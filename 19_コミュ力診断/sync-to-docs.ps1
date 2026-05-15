param(
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceRoot = Split-Path -Parent $scriptDir
$srcDir = Join-Path $scriptDir 'src'
$destDir = Join-Path $workspaceRoot 'docs\commu-checker'

if (!(Test-Path $srcDir)) {
  throw "Source directory not found: $srcDir"
}

if (!(Test-Path $destDir)) {
  throw "Destination directory not found: $destDir"
}

$files = @(
  'index.html',
  'check.html',
  'types.html',
  'history.html',
  'data.js',
  'style.css',
  'favicon.svg',
  'thumbnail.png',
  'ogp.png'
)

Write-Host "Sync source: $srcDir"
Write-Host "Sync destination: $destDir"

foreach ($name in $files) {
  $src = Join-Path $srcDir $name
  $dest = Join-Path $destDir $name

  if (!(Test-Path $src)) {
    Write-Warning "Skip missing source file: $name"
    continue
  }

  if ($WhatIf) {
    Write-Host "[WhatIf] Copy $name"
  } else {
    Copy-Item -Path $src -Destination $dest -Force
    Write-Host "Copied $name"
  }
}

Write-Host 'Sync completed.'
