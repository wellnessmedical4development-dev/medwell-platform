$source = "C:\Users\Hp\Desktop\medwell-platform"
$dest = "\\serveur\Systeme IA\medwell-platform"
$exclude = @("node_modules", "client\node_modules", "client\dist")

while ($true) {
    Start-Sleep -Seconds 300
    $args = "/E /XD $($exclude -join ' ') /R:2 /W:3 /NP /NJH /NJS"
    Start-Process -NoNewWindow -FilePath "robocopy.exe" -ArgumentList "`"$source`" `"$dest`" $args" -Wait
}
