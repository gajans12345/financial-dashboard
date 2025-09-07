@echo off
echo Quick Git Commands for Financial Dashboard
echo ==========================================
echo.
echo 1. Add all changes and commit
echo 2. Push to GitHub
echo 3. Pull from GitHub
echo 4. Check status
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Adding all changes...
    git add .
    set /p message="Enter commit message: "
    git commit -m "%message%"
    echo Changes committed!
    pause
    goto :eof
)

if "%choice%"=="2" (
    echo Pushing to GitHub...
    git push origin main
    echo Pushed to GitHub!
    pause
    goto :eof
)

if "%choice%"=="3" (
    echo Pulling from GitHub...
    git pull origin main
    echo Pulled from GitHub!
    pause
    goto :eof
)

if "%choice%"=="4" (
    echo Checking git status...
    git status
    pause
    goto :eof
)

if "%choice%"=="5" (
    echo Goodbye!
    goto :eof
)

echo Invalid choice. Please try again.
pause
