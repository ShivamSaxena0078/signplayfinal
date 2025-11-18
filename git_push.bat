@echo off
echo ========================================
echo SignPlay - Safe Git Push Script
echo ========================================
echo.

echo Step 1: Checking for secrets...
python check_secrets.py
if errorlevel 1 (
    echo.
    echo ❌ Security check failed!
    echo ⚠️  DO NOT proceed with commit!
    pause
    exit /b 1
)

echo.
echo Step 2: Showing git status...
git status

echo.
echo Step 3: Files to be committed:
git diff --cached --name-only

echo.
echo ========================================
echo ⚠️  IMPORTANT: Review the files above
echo ========================================
echo.
echo Make sure NO .env files are listed!
echo.
set /p confirm="Do you want to proceed with commit? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo Commit cancelled.
    pause
    exit /b 0
)

echo.
set /p message="Enter commit message: "

echo.
echo Step 4: Committing changes...
git add .
git commit -m "%message%"

echo.
echo Step 5: Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ⚠️  Push failed. Trying 'master' branch...
    git push origin master
)

echo.
echo ========================================
echo ✅ Done!
echo ========================================
pause
