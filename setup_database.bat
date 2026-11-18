@echo off
echo ===================================================
echo Setting up SmartEdu MySQL Database
echo ===================================================
set /p DB_PASS=Enter MySQL root password (default: newpassword): 
if "%DB_PASS%"=="" set DB_PASS=newpassword

echo Applying schema.sql...
mysql -u root -p%DB_PASS% < database\schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo Error applying schema.sql. Please check your MySQL credentials.
    pause
    exit /b %ERRORLEVEL%
)

echo Applying sample-data.sql...
mysql -u root -p%DB_PASS% < database\sample-data.sql
if %ERRORLEVEL% NEQ 0 (
    echo Error applying sample-data.sql.
    pause
    exit /b %ERRORLEVEL%
)

echo ===================================================
echo Database successfully initialized with sample data!
echo ===================================================
pause
