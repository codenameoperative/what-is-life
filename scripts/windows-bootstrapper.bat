@echo off
setlocal enabledelayedexpansion

REM What is Life - Windows Bootstrapper
REM This script helps Windows users run the Linux builds via WSL
REM For native Windows builds, see: https://github.com/yourusername/what-is-life

echo "🎮 What is Life - Windows Installation Helper"
echo "==========================================="
echo ""

REM Check if WSL is installed
wsl --version >nul 2>&1
if errorlevel 1 (
    echo "❌ Windows Subsystem for Linux (WSL) is required to run Linux builds."
    echo ""
    echo "📋 To install WSL:"
    echo "1. Open PowerShell as Administrator"
    echo "2. Run: wsl --install"
    echo "3. Restart your computer"
    echo ""
    echo "🔄 After installing WSL, run this script again."
    pause
    exit /b 1
)

echo "✅ WSL detected!"
echo ""

REM Check if we're in the right directory
if not exist "dist\linux\" (
    echo "❌ Linux builds not found in dist\linux\"
    echo ""
    echo "📥 Please download the Linux packages from GitHub releases first:"
    echo "https://github.com/yourusername/what-is-life/releases"
    echo ""
    echo "📦 Expected files:"
    echo "• what-is-life_0.1.0_amd64.AppImage"
    echo "• what-is-life_0.1.0_amd64.deb"
    echo "• what-is-life_0.1.0-1.x86_64.rpm"
    pause
    exit /b 1
)

echo "📦 Linux packages found!"
echo ""

REM Create WSL script
echo "🔧 Setting up WSL launcher..."

REM Create a Linux script that will be run via WSL
(
echo "#!/bin/bash"
echo "# What is Life - Linux Launcher (via WSL)"
echo ""
echo "# Change to Windows mount point"
echo "cd /mnt/c/Users/%USERNAME%/Desktop/What\ is\ life"
echo ""
echo "echo '🎮 Starting What is Life...'"
echo "echo ''"
echo ""
echo "# Make AppImage executable"
echo "chmod +x dist/linux/appimage/what-is-life_0.1.0_amd64.AppImage"
echo ""
echo "# Run the AppImage"
echo "dist/linux/appimage/what-is-life_0.1.0_amd64.AppImage"
) > temp_wsl_launcher.sh

echo "✅ WSL launcher created!"
echo ""

REM Create desktop shortcut
echo "🖥️ Creating desktop shortcut..."
powershell -Command "
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\What is Life.lnk')
$Shortcut.TargetPath = 'wsl'
$Shortcut.Arguments = 'bash --login -c \"cd /mnt/c/Users/$env:USERNAME/Desktop/What\ is\ life && bash temp_wsl_launcher.sh\"'
$Shortcut.WorkingDirectory = [Environment]::CurrentDirectory
$Shortcut.IconLocation = 'wsl.exe,0'
$Shortcut.Description = 'Launch What is Life via WSL'
$Shortcut.Save()
"

echo "✅ Desktop shortcut created!"
echo ""

REM Cleanup
del temp_wsl_launcher.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Double-click 'What is Life' icon on your desktop"
echo "2. The game will launch via WSL"
echo ""
echo "⚠️ Note: This method requires WSL and provides Linux experience on Windows"
echo "💡 For native Windows builds, visit: https://github.com/yourusername/what-is-life"
echo ""
echo "🔧 Troubleshooting:"
echo "• Ensure WSL is properly installed and updated"
echo "• Make sure the Linux packages are in dist/linux/"
echo "• Check that the AppImage has execute permissions"
echo ""
pause
