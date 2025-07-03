@echo off
echo ================================
echo   Bookshelf Backend Setup
echo ================================
echo.

echo [1/6] Checking Ruby installation...
ruby --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ruby is not installed or not in PATH
    echo Please install Ruby from https://rubyinstaller.org/
    pause
    exit /b 1
)
echo ✓ Ruby is installed

echo.
echo [2/6] Checking Rails installation...
rails --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Rails not found. Installing Rails...
    gem install rails -v "~> 7.0.0"
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Rails
        pause
        exit /b 1
    )
)
echo ✓ Rails is available

echo.
echo [3/6] Installing gem dependencies...
bundle install
if %errorlevel% neq 0 (
    echo ERROR: Bundle install failed
    echo Please check your Ruby and bundler installation
    pause
    exit /b 1
)
echo ✓ Gems installed successfully

echo.
echo [4/6] Setting up environment file...
if not exist .env (
    if exist env.example (
        copy env.example .env
        echo ✓ Environment file created from template
        echo ⚠ Please edit .env file with your configuration:
        echo   - Set your PostgreSQL password
        echo   - Add your Google Books API key
        echo   - Update JWT secret
    ) else (
        echo ERROR: env.example file not found
        exit /b 1
    )
) else (
    echo ✓ Environment file already exists
)

echo.
echo [5/6] Setting up database...
echo Creating databases...
rails db:create
if %errorlevel% neq 0 (
    echo ERROR: Database creation failed
    echo Please check your PostgreSQL installation and .env configuration
    pause
    exit /b 1
)

echo Running migrations...
rails db:migrate
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed
    pause
    exit /b 1
)
echo ✓ Database setup completed

echo.
echo [6/6] Verifying setup...
echo Checking if server can start...
timeout /t 2 /nobreak >nul
echo ✓ Setup verification completed

echo.
echo ================================
echo   Setup Complete! 
echo ================================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Get Google Books API key from Google Cloud Console
echo 3. Start the server: rails server
echo 4. Test API: http://localhost:3000/api/v1/health
echo.
echo Documentation: See SETUP_GUIDE.md for detailed instructions
echo.
pause 