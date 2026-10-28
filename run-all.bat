@echo off
title BusBuddy Launcher
echo ====================================================
echo Launching BusBuddy Full Stack Application
echo ====================================================
echo Starting Backend in separate window...
start "BusBuddy Backend" cmd /k "cd /d %~dp0busbuddy\backend && mvnw.bat spring-boot:run"

echo Starting Frontend in separate window...
start "BusBuddy Frontend" cmd /k "cd /d %~dp0busbuddy\frontend && npm.cmd run dev"

echo Waiting 5 seconds before opening browser...
timeout /t 5 /nobreak >nul

echo Opening browser at http://localhost:5173
start http://localhost:5173

echo.
echo Both servers are launching. Press any key to exit this launcher window.
pause
