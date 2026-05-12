param(
    [Parameter(Mandatory = $true)][string]$ReportsDir,
    [string]$SvnExecutable = "svn",
    [string]$CommitMessage = "Add JUnit XML report"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command $SvnExecutable -ErrorAction SilentlyContinue)) {
    throw "Command '$SvnExecutable' is not available."
}

if (-not (Test-Path $ReportsDir)) {
    throw "Report directory '$ReportsDir' was not found."
}

$xmlFiles = Get-ChildItem -Path $ReportsDir -Recurse -Filter *.xml
if (-not $xmlFiles) {
    throw "No JUnit XML files were produced in '$ReportsDir'."
}

foreach ($file in $xmlFiles) {
    & $SvnExecutable add --force $file.FullName | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "svn add failed for '$($file.FullName)'."
    }
}

& $SvnExecutable commit $ReportsDir -m $CommitMessage | Out-Host
if ($LASTEXITCODE -ne 0) {
    throw "svn commit failed."
}
