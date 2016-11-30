@echo off
taskkill /IM explorer.exe /F
cd /d %userprofile%\AppData\Local
del IconCache.db /a
start explorer.exe