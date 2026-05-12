param(
    [Parameter(Mandatory = $true)][string]$ProtectedListFile,
    [string]$SvnExecutable = "svn",
    [string]$CommitMessage = "Commit after protected class check"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command $SvnExecutable -ErrorAction SilentlyContinue)) {
    throw "Command '$SvnExecutable' is not available."
}

if (-not (Test-Path $ProtectedListFile)) {
    throw "Protected class list '$ProtectedListFile' was not found."
}

$protected = Get-Content $ProtectedListFile |
    Where-Object { $_.Trim() -and -not $_.Trim().StartsWith("#") } |
    ForEach-Object { $_.Trim().Replace('\', '/') }

$statusLines = & $SvnExecutable status
if ($LASTEXITCODE -ne 0) {
    throw "svn status failed."
}

$changed = @()
foreach ($line in $statusLines) {
    if ($line.Length -gt 8) {
        $changed += $line.Substring(8).Trim().Replace('\', '/')
    }
}

if (-not $changed) {
    Write-Host "Working copy has no local changes."
    exit 0
}

$blocked = $changed | Where-Object { $protected -contains $_ }
if ($blocked) {
    Write-Host "Commit skipped. Protected classes were modified:"
    $blocked | ForEach-Object { Write-Host $_ }
    exit 0
}

& $SvnExecutable commit -m $CommitMessage | Out-Host
if ($LASTEXITCODE -ne 0) {
    throw "svn commit failed."
}
