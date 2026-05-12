param(
    [Parameter(Mandatory = $true)][string]$ProjectDir,
    [string]$AntExecutable = "ant",
    [string]$BuildFile = "build.xml",
    [string]$SvnExecutable = "svn",
    [Parameter(Mandatory = $true)][string]$DiffOutputFile
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
    $originalRevision = (& $SvnExecutable info --show-item revision).Trim()
    if (-not $originalRevision) {
        throw "Unable to determine the current svn revision."
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

    if (-not $revisions) {
        throw "No revisions were returned by svn log."
    }

    $workingRevision = $null
    $workingIndex = $null

    for ($i = 0; $i -lt $revisions.Count; $i++) {
        $revision = $revisions[$i]
        Write-Host "Checking revision r$revision"

        & $SvnExecutable update -r $revision | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "svn update to revision r$revision failed."
        }

        & $AntExecutable -f $BuildFile compile | Out-Host
        if ($LASTEXITCODE -eq 0) {
            $workingRevision = $revision
            $workingIndex = $i
            break
        }
    }

    if (-not $workingRevision) {
        Write-Host "No working revision was found."
        exit 0
    }

    Write-Host "Working revision found: r$workingRevision"

    if ($workingIndex -gt 0) {
        $nextBrokenRevision = $revisions[$workingIndex - 1]
        New-Item -ItemType Directory -Force -Path ([System.IO.Path]::GetDirectoryName($DiffOutputFile)) | Out-Null
        & $SvnExecutable diff -c $nextBrokenRevision | Set-Content -Path $DiffOutputFile -Encoding UTF8
        if ($LASTEXITCODE -ne 0) {
            throw "svn diff for revision r$nextBrokenRevision failed."
        }
        Write-Host "Diff saved to '$DiffOutputFile'."
    }
}
finally {
    if ($originalRevision) {
        & $SvnExecutable update -r $originalRevision | Out-Host
    }
    Pop-Location
}
