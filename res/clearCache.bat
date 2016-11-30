@echo off
Choice /C YN /M "Do you want to remove temporary files?"

IF ERRORLEVEL 1 Goto YES
IF ERRORLEVEL 2 Goto NO

Goto End

:YES
if exist "%LOCALAPPDATA%\Megstar Treasury Management System" (
    echo Removing Temporary Files...
    rd "%LOCALAPPDATA%\Megstar Treasury Management System" /S/Q
	@pause
)

:NO
Goto End

:End