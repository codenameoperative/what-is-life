# What Is Life - Multi-Platform Build Guide

## Overview
This guide covers building "What Is Life" for multiple platforms and architectures including Linux (x32/x64/ARM), Windows, macOS, and Android.

## Prerequisites

### For All Platforms
- Node.js 18+ and npm
- Rust 1.70+
- Git

### For Linux Builds
- Linux system with development tools
- GTK development libraries
- WebKitGTK development libraries
- AppIndicator libraries

### For Windows Builds
- Windows 10/11
- Visual Studio Build Tools
- WebView2 runtime

### For macOS Builds
- macOS 10.15+
- Xcode command line tools

### For Android Builds
- Java JDK 11+
- Android SDK
- Android NDK (for native builds)

## Quick Build Commands

### Linux (All Architectures)
```bash
# Install dependencies
npm install

# Build all Linux targets
npm run tauri:build:all

# Or build specific architecture
npm run tauri:build:linux:x64      # 64-bit Intel/AMD
npm run tauri:build:linux:arm64    # 64-bit ARM
npm run tauri:build:linux:i686     # 32-bit Intel
```

### Windows
```bash
npm install
npm run tauri:build:windows
```

### macOS
```bash
npm install
npm run tauri:build:macos
```

### Android (All Architectures)
```bash
npm install
npm run android:build:all

# Or build specific architecture
npm run android:build:arm64     # ARM64 (Android 8+)
npm run android:build:x86_64    # x86_64 (Android 8+)
npm run android:build:arm32     # ARM32 (Android 8+)
npm run android:build:x86       # x86 (Android 8+)
```

### Automated Build Script
```bash
# Run the comprehensive build script
./build.sh
```

## Output Files

### Linux
- **`.deb`**: Debian/Ubuntu packages
  - `what-is-life_0.0.1_amd64.deb` (64-bit)
  - `what-is-life_0.0.1_arm64.deb` (ARM64)
  - `what-is-life_0.0.1_i386.deb` (32-bit)

- **`.rpm`**: Red Hat/Fedora packages
  - `what-is-life-0.0.1-1.x86_64.rpm` (64-bit)
  - `what-is-life-0.0.1-1.aarch64.rpm` (ARM64)
  - `what-is-life-0.0.1-1.i686.rpm` (32-bit)

- **`.AppImage`**: Universal Linux binaries
  - `What Is Life_0.0.1_amd64.AppImage` (64-bit)
  - `What Is Life_0.0.1_arm64.AppImage` (ARM64)
  - `What Is Life_0.0.1_i686.AppImage` (32-bit)

- **`tar.gz`**: Manual installation archives
  - `what-is-life_0.0.1_amd64.tar.gz`
  - `what-is-life_0.0.1_arm64.tar.gz`
  - `what-is-life_0.0.1_i686.tar.gz`

### Android
- **`APK`**: Android packages
  - `what-is-life-android-arm64-v8a-debug.apk` (ARM64)
  - `what-is-life-android-x86_64-debug.apk` (x86_64)
  - `what-is-life-android-armeabi-v7a-debug.apk` (ARM32)
  - `what-is-life-android-x86-debug.apk` (x86)

### Windows
- **`.msi`**: Windows installer
  - `What Is Life_0.0.1_x64_en-US.msi`

### macOS
- **`.app`**: macOS application bundle
  - `What Is Life.app`

## Distribution Compatibility

### Linux
- **Ubuntu**: 16.04+ (18.04+ recommended)
- **Debian**: 9+ (10+ recommended)
- **Fedora**: 30+ (35+ recommended)
- **Red Hat**: 7+ (8+ recommended)
- **Arch Linux**: Latest
- **Manjaro**: Latest
- **openSUSE**: 15+
- **AppImage**: Any Linux distribution with glibc 2.17+

### Android
- **Minimum API Level**: 26 (Android 8.0)
- **Target API Level**: 34 (Android 15)
- **Supported Architectures**:
  - ARM64-v8a (64-bit ARM)
  - ARM32 (32-bit ARM)
  - x86_64 (64-bit Intel)
  - x86 (32-bit Intel)

## Build Environment Setup

### Linux Build Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora/RHEL
sudo dnf install webkit2gtk3-devel libappindicator-gtk3-devel librsvg2-devel patchelf

# Arch Linux
sudo pacman -S webkit2gtk base-devel libappindicator-gtk3 librsvg patchelf
```

### Android Build Setup
```bash
# Install Android SDK and NDK
# Configure ANDROID_HOME and ANDROID_NDK_HOME environment variables

# Install Capacitor Android
npm install @capacitor/android

# Initialize Android project
cd web
npx cap add android
```

### Cross-Compilation Setup
For building multiple architectures on a single machine:

```bash
# Install cross-compilation targets
rustup target add x86_64-unknown-linux-gnu
rustup target add aarch64-unknown-linux-gnu
rustup target add i686-unknown-linux-gnu

# Install cross-compilation tools
# Ubuntu/Debian
sudo apt install gcc-x86-64-linux-gnu gcc-aarch64-linux-gnu gcc-i686-linux-gnu
```

## Troubleshooting

### Common Issues

1. **WebKitGTK not found**
   ```bash
   sudo apt install libwebkit2gtk-4.1-dev
   ```

2. **Android build fails**
   - Ensure Android SDK is properly installed
   - Check JAVA_HOME is set correctly
   - Verify Android API level 26+ is installed

3. **Cross-compilation fails**
   - Install appropriate cross-compilation libraries
   - Ensure target architecture is supported

4. **Permission denied**
   ```bash
   chmod +x build.sh
   ```

### Build Logs
- Check `src-tauri/target/` for Rust build artifacts
- Check `web/dist/` for web build output
- Check `dist/` for final packages

## File Structure for Distribution

```
dist/
├── deb/
│   ├── what-is-life_0.0.1_amd64.deb
│   ├── what-is-life_0.0.1_arm64.deb
│   └── what-is-life_0.0.1_i386.deb
├── rpm/
│   ├── what-is-life-0.0.1-1.x86_64.rpm
│   ├── what-is-life-0.0.1-1.aarch64.rpm
│   └── what-is-life-0.0.1-1.i686.rpm
├── appimage/
│   ├── What Is Life_0.0.1_amd64.AppImage
│   ├── What Is Life_0.0.1_arm64.AppImage
│   └── What Is Life_0.0.1_i686.AppImage
├── android/
│   ├── what-is-life-android-arm64-v8a-debug.apk
│   ├── what-is-life-android-x86_64-debug.apk
│   ├── what-is-life-android-armeabi-v7a-debug.apk
│   └── what-is-life-android-x86-debug.apk
└── tar.gz archives for manual distribution
```

## Windows Laptop Transfer Instructions

Copy these files from your Linux machine to Windows laptop:

### Required Files:
1. **All built packages** from `dist/` directory
2. **Source code** (optional, for development)
3. **Build scripts** (`build.sh`, `package.json`)

### Transfer Methods:
1. **USB Drive**: Copy entire `dist/` folder
2. **Network**: Use SCP/SFTP/rsync
3. **Cloud Storage**: Upload to Google Drive/Dropbox
4. **Git**: Push to repository and clone on Windows

### Final Distribution Package:
```
What-Is-Life-Distribution/
├── linux/
│   ├── deb/
│   ├── rpm/
│   ├── appimage/
│   └── tar.gz/
├── android/
│   └── apk/
├── windows/
│   └── msi/
├── macos/
│   └── app/
└── README.md (this file)
```

## Support
For build issues, check:
- Tauri documentation: https://tauri.app/
- Capacitor documentation: https://capacitorjs.com/
- GitHub Issues for known problems
