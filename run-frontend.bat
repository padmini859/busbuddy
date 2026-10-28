@echo off
title BusBuddy - React Frontend
echo ====================================================
echo Starting BusBuddy Frontend (Vite + React 18)
echo ====================================================
cd /d "%~dp0busbuddy\frontend"
call npm.cmd run dev
pause
