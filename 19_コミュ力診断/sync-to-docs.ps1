param(
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceRoot = Split-Path -Parent $scriptDir
$srcDir = Join-Path $scriptDir 'src'
$destDir = Join-Path $workspaceRoot 'docs\commu-checker'
$srcTrainingsDir = Join-Path $srcDir 'trainings'
$destTrainingsDir = Join-Path $destDir 'trainings'

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

if (Test-Path $srcTrainingsDir) {
  if (!(Test-Path $destTrainingsDir)) {
    if ($WhatIf) {
      Write-Host "[WhatIf] Create trainings directory: $destTrainingsDir"
    } else {
      New-Item -ItemType Directory -Path $destTrainingsDir -Force | Out-Null
      Write-Host "Created trainings directory"
    }
  }

  $trainingFiles = Get-ChildItem -Path $srcTrainingsDir -File -Filter '*.html'
  if ($trainingFiles.Count -eq 0) {
    Write-Warning 'No training HTML files found in src/trainings'
  } else {
    foreach ($file in $trainingFiles) {
      $dest = Join-Path $destTrainingsDir $file.Name
      if ($WhatIf) {
        Write-Host "[WhatIf] Copy trainings/$($file.Name)"
      } else {
        Copy-Item -Path $file.FullName -Destination $dest -Force
        Write-Host "Copied trainings/$($file.Name)"
      }
    }
  }
} else {
  Write-Warning "Skip trainings sync: source directory not found: $srcTrainingsDir"
}

Write-Host 'Sync completed.'
