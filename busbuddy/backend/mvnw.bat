@echo off
setlocal
if "%JAVA_HOME%"=="" (
    if exist "C:\Users\PADMINI\.jdks\openjdk-25.0.1" (
        set "JAVA_HOME=C:\Users\PADMINI\.jdks\openjdk-25.0.1"
    )
)
if not "%JAVA_HOME%"=="" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)
if exist "C:\Users\PADMINI\Downloads\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" (
    "C:\Users\PADMINI\Downloads\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" %*
) else (
    mvn %*
)
