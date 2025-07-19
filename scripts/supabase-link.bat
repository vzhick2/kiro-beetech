@echo off
REM Supabase Link Script
REM Usage: supabase-link.bat [password]

set PROJECT_REF=jjpklpivpvywagmjjwpu

if "%1"=="" (
    echo Usage: supabase-link.bat [password]
    echo.
    echo This script links to the Supabase project without prompting for password.
    echo.
    echo Example: supabase-link.bat your_database_password
    exit /b 1
)

echo Linking to Supabase project...
npx supabase link --project-ref %PROJECT_REF% -p %1

if %ERRORLEVEL% EQU 0 (
    echo Successfully linked to project!
) else (
    echo Failed to link to project.
) 