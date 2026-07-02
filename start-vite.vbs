Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d C:\Users\Hp\Desktop\medwell-platform\client && npx vite --port 3000 --host", 0, False
