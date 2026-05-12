param(
    [Parameter(Mandatory = $true)][string]$ProjectDir,
    [string]$AntExecutable = "ant",
    [string]$BuildFile = "build.xml",
    [string]$SvnExecutable = "svn",
    [Parameter(Mandatory = $true)][string]$OutputZip,
    [Parameter(Mandatory = $true)][string]$TempDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

foreach ($command in @($AntExecutable, $SvnExecutable)) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Command '$command' is not available."
    }
}

Push-Location $ProjectDir
try {
    $projectUrl = (& $SvnExecutable info --show-item url).Trim()
    if (-not $projectUrl) {
        throw "Unable to determine svn repository URL."
    }

    $logLines = & $SvnExecutable log -q
    if ($LASTEXITCODE -ne 0) {
        throw "svn log failed."
    }

    $revisions = @(
        $logLines |
        Select-String '^r\d+' |
        ForEach-Object { [int]($_.Matches[0].Value.TrimStart('r')) }
    )

    if ($revisions.Count -lt 3) {
        throw "At least three revisions are required for the team target."
    }

    $previousRevisions = $revisions[1..2]
    $exportRoot = Join-Path $TempDir "exports"
    $jarRoot = Join-Path $TempDir "jars"

    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $exportRoot, $jarRoot | Out-Null

    foreach ($revision in $previousRevisions) {
        $revisionDir = Join-Path $exportRoot "r$revision"
        Write-Host "Exporting revision r$revision"

        & $SvnExecutable export "$projectUrl@$revision" $revisionDir --force | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "svn export failed for revision r$revision."
        }

        & $AntExecutable -f (Join-Path $revisionDir $BuildFile) build | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed for revision r$revision."
        }

        $builtJar = Get-ChildItem -Path (Join-Path $revisionDir "build-ant/dist") -Filter *.jar | Select-Object -First 1
        if (-not $builtJar) {
            throw "No jar file was produced for revision r$revision."
        }

        Copy-Item $builtJar.FullName (Join-Path $jarRoot "r$revision-$($builtJar.Name)")
    }

    Remove-Item $OutputZip -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path ([System.IO.Path]::GetDirectoryName($OutputZip)) | Out-Null
    Compress-Archive -Path (Join-Path $jarRoot '*') -DestinationPath $OutputZip
    Write-Host "Archive created: $OutputZip"
}
finally {
    Pop-Location
}
