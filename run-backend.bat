@echo off
title BusBuddy - Spring Boot Backend
echo ====================================================
echo Starting BusBuddy Backend (Spring Boot 3 + Java 21)
echo ====================================================
cd /d "%~dp0busbuddy\backend"
call mvnw.bat spring-boot:run
pause
