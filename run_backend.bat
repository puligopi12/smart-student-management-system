@echo off
echo ===================================================
echo Starting SmartEdu Spring Boot Backend (Port 8080)
echo ===================================================
cd /d "%~dp0backend"

if exist "target\student-management-backend-1.0.0.jar" (
    echo Starting packaged JAR application...
    java -jar target\student-management-backend-1.0.0.jar
) else (
    echo Building and running with Maven...
    mvn spring-boot:run
)
pause
