@echo off

cd ..

rd /s/q build\rdpx
rd /s/q dist\

pyinstaller --onefile --uac-admin --name rdpx --icon img\icon.ico remoteappapi.py

rd /s/q build\rdpx

robocopy /E /Z /B /XO /NP css dist\css
robocopy /E /Z /B /XO /NP db dist\db
robocopy /E /Z /B /XO /NP docimg dist\docimg
robocopy /E /Z /B /XO /NP html dist\html
robocopy /E /Z /B /XO /NP img dist\img
robocopy /E /Z /B /XO /NP includes dist\includes
robocopy /E /Z /B /XO /NP js dist\js
robocopy /E /Z /B /XO /NP nginxconf dist\nginxconf
robocopy /E /Z /B /XO /NP tmpl dist\tmpl

copy /Y README.md dist\

