@echo off
setlocal enabledelayedexpansion

REM What is Life - Native Windows Build Script
REM For building on Windows machines with Visual Studio Build Tools

echo "🪟 What is Life - Native Windows Build"
echo "======================================"
echo ""

REM Check prerequisites
echo "🔍 Checking prerequisites..."

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo "❌ Node.js not found. Please install Node.js 18+ from:"
    echo "https://nodejs.org/"
    pause
    exit /b 1
)

REM Check for Rust
rustc --version >nul 2>&1
if errorlevel 1 (
    echo "❌ Rust not found. Please install Rust from:"
    echo "https://rustup.rs/"
    pause
    exit /b 1
)

REM Check for Visual Studio Build Tools
if not exist "%VSINSTALLDIR%" (
    echo "❌ Visual Studio Build Tools not found."
    echo ""
    echo "📋 Please install Visual Studio Build Tools:"
    echo "1. Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/"
    echo "2. Select 'Desktop development with C++' workload"
    echo "3. Include Windows SDK and MSVC build tools"
    echo ""
    pause
    exit /b 1
)

echo "✅ Prerequisites check passed!"
echo ""

REM Setup Rust target
echo "🔧 Setting up Rust target..."
rustup target add x86_64-pc-windows-msvc

REM Install dependencies
echo "📦 Installing dependencies..."
call npm install

if errorlevel 1 (
    echo "❌ Failed to install dependencies"
    pause
    exit /b 1
)

REM Build web assets
echo "🏗️ Building web assets..."
call npm run build

if errorlevel 1 (
    echo "❌ Failed to build web assets"
    pause
    exit /b 1
)

REM Build Tauri application
echo "🪟 Building Windows application..."
echo "This may take several minutes..."

call npx tauri build --target x86_64-pc-windows-msvc

if errorlevel 1 (
    echo "❌ Failed to build Windows application"
    pause
    exit /b 1
)

echo ""
echo "✅ Build completed successfully!"
echo ""

REM Check for output
if exist "src-tauri\target\x86_64-pc-windows-msvc\release\what-is-life.exe" (
    echo "📍 Windows executable created:"
    echo "   src-tauri\target\x86_64-pc-windows-msvc\release\what-is-life.exe"
    echo ""
    echo "📦 Size: !file_size!"
    dir "src-tauri\target\x86_64-pc-windows-msvc\release\what-is-life.exe" | find "what-is-life.exe"
) else (
    echo "⚠️ Build completed but executable not found in expected location"
    echo "Check src-tauri\target\ for build outputs"
)

echo ""
echo "🎉 Windows build process completed!"
echo ""
echo "📋 Next steps:"
echo "• Test the executable: src-tauri\target\x86_64-pc-windows-msvc\release\what-is-life.exe"
echo "• Create an installer using NSIS or WiX Toolset"
echo "• Upload to GitHub releases for distribution"
echo ""
echo "🔧 For development:"
echo "• Use 'npm run tauri:dev' for development mode"
echo "• Use 'npm run tauri:build' for production builds"
echo ""

pause
