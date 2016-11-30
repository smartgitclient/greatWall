@echo off
set reshacker="D:\Program Files (x86)\Resource Hacker\ResHacker.exe"
set innosetup="D:\Program Files (x86)\Inno Setup 5\Compil32"
%reshacker% -script res\replace_icon_win32.script
%reshacker% -script res\replace_icon_win64.script
%innosetup% /cc %1