@echo off
setlocal
set "ROOT=%~dp0"
set "SITE=%ROOT%site"
if exist "%SITE%" rmdir /s /q "%SITE%"
if errorlevel 1 exit /b %errorlevel%
mkdir "%SITE%"
if errorlevel 1 exit /b %errorlevel%
xcopy "%ROOT%public\*" "%SITE%\" /E /I /Y >nul
if errorlevel 1 exit /b %errorlevel%
echo Built static gallery into site\.
exit /b 0
