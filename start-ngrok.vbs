Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d C:\Users\Hp\Desktop\medwell-platform && ngrok.exe http 5000", 0, False
