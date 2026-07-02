Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d C:\Users\Hp\Desktop\medwell-platform && node server.js", 0, False
