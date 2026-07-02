$watchPath = "C:\Users\Hp\Desktop\medwell-platform"
$destPath = "\\serveur\Systeme IA\medwell-platform"
$exclude = @("node_modules", "client\node_modules", "client\dist", ".git")

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::DirectoryName

$changeEvent = Register-ObjectEvent $watcher "Changed" -Action {
    $path = $Event.SourceEventArgs.FullPath
    $relative = $path.Substring($Event.MessageData.watchPath.Length + 1)
    foreach ($ex in $Event.MessageData.exclude) {
        if ($relative -like "$ex*") { return }
    }
    $dest = Join-Path $Event.MessageData.destPath $relative
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -LiteralPath $path -Destination $dest -Force 2>$null
}

$createEvent = Register-ObjectEvent $watcher "Created" -Action {
    $path = $Event.SourceEventArgs.FullPath
    $relative = $path.Substring($Event.MessageData.watchPath.Length + 1)
    foreach ($ex in $Event.MessageData.exclude) {
        if ($relative -like "$ex*") { return }
    }
    $dest = Join-Path $Event.MessageData.destPath $relative
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -LiteralPath $path -Destination $dest -Force 2>$null
}

$deleteEvent = Register-ObjectEvent $watcher "Deleted" -Action {
    $path = $Event.SourceEventArgs.FullPath
    $relative = $path.Substring($Event.MessageData.watchPath.Length + 1)
    foreach ($ex in $Event.MessageData.exclude) {
        if ($relative -like "$ex*") { return }
    }
    $dest = Join-Path $Event.MessageData.destPath $relative
    if (Test-Path $dest) { Remove-Item -LiteralPath $dest -Force 2>$null }
}

$renameEvent = Register-ObjectEvent $watcher "Renamed" -Action {
    $path = $Event.SourceEventArgs.FullPath
    $relative = $path.Substring($Event.MessageData.watchPath.Length + 1)
    foreach ($ex in $Event.MessageData.exclude) {
        if ($relative -like "$ex*") { return }
    }
    $dest = Join-Path $Event.MessageData.destPath $relative
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -LiteralPath $path -Destination $dest -Force 2>$null
}

$messageData = @{ watchPath = $watchPath; destPath = $destPath; exclude = $exclude }
$changeEvent.MessageData = $messageData
$createEvent.MessageData = $messageData
$deleteEvent.MessageData = $messageData
$renameEvent.MessageData = $messageData

Write-Host "Auto-sync running. Watching $watchPath -> $destPath"
Write-Host "Excluding: $($exclude -join ', ')"
Write-Host "Press Ctrl+C to stop."

while ($true) { Start-Sleep -Seconds 10 }
