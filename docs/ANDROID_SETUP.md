# Android Build Setup (v0.1.1)

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- **Docker** 20.10+ installed on your system
- **Git** 2.30+ for cloning the repository
- **At least 8GB of free disk space** for the build environment
- **Basic command line knowledge**
- **Android device** or emulator with Android 8.0+ (API level 26+)

### Build Android APKs

#### Using Docker (Recommended)
```bash
# Clone the repository (if not already cloned)
git clone https://github.com/codenameoperative/what-is-life.git
cd what-is-life

# Make the build script executable (first time only)
chmod +x scripts/build-android.sh

# Build Android APKs for ARM64 (ARM32 is deprecated as of v0.1.1)
./scripts/build-android.sh

# The built APK will be available at:
# - build/app/outputs/flutter-apk/app-release.apk (debug)
# - build/app/outputs/bundle/release/app-release.aab (release bundle)
```

#### Manual Build (Advanced)
If you prefer to build without Docker, you'll need to set up the Android development environment manually:

1. Install Flutter SDK and Android Studio
2. Set up Android SDK and NDK
3. Run:
   ```bash
   flutter pub get
   flutter build apk --release  # For APK
   # OR
   flutter build appbundle  # For AAB (Google Play Store)
   ```

### What happens during the build:
1. **Docker image creation** - Builds a complete Android development environment
2. **Dependency installation** - Downloads all required Android SDK components
3. **Web asset building** - Compiles the React frontend
4. **APK generation** - Creates optimized APKs for ARM32 and ARM64
5. **Artifact output** - APK files are saved in the project root

### Output Files
- `app-arm64-v8a-debug.apk` - For ARM64 devices (most modern phones)
- `app-armeabi-v7a-debug.apk` - For ARM32 devices (older phones)

## 🛠️ Manual Setup (Advanced Users)

If you prefer to set up the Android development environment manually:

### Install Java JDK 11+
```bash
# Ubuntu/Debian
sudo apt install openjdk-11-jdk

# Or download from Oracle/OpenJDK website
```

### Install Android SDK
```bash
# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip

# Set up environment
mkdir -p ~/android-sdk/cmdline-tools
export ANDROID_SDK_ROOT=~/android-sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Install required packages
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.2.9519653" "cmake;3.22.1"
```

### Install Node.js Dependencies
```bash
npm install
cd web
npm install @capacitor/android
npx cap add android
npx cap sync android
```

### Build APKs Manually
```bash
# Build web assets first
npm run build

# Build ARM64 APK
cd web/android
./gradlew assembleDebug -PabiFilter=arm64-v8a

# Build ARM32 APK
./gradlew assembleDebug -PabiFilter=armeabi-v7a
```

## 📱 Supported Architectures

| Architecture | Support | Target Devices |
|-------------|---------|----------------|
| **ARM64** | ✅ **Primary** | Most modern Android phones/tablets |
| **ARM32** | ✅ **Secondary** | Older Android devices |
| **x86** | ❌ **Not supported** | Intel-based tablets (discontinued) |
| **x86_64** | ❌ **Not supported** | Intel-based devices (discontinued) |

## 🔧 Troubleshooting

### Docker Issues
- Ensure Docker daemon is running: `sudo systemctl start docker`
- Check Docker version: `docker --version`
- Free up disk space if needed: `docker system prune -a`

### Build Failures
- Check available disk space: `df -h`
- Verify internet connection for downloading dependencies
- Check Docker logs: `docker logs <container_id>`

### APK Installation Issues
- Enable "Install from Unknown Sources" in Android settings
- Check if device meets minimum requirements (Android 8.0+)
- Verify APK integrity if transfer was interrupted

## 📋 Requirements Summary

### Minimum Android Version: **8.0 (API 26)**
### Supported ABIs: **armeabi-v7a, arm64-v8a**
### Recommended: **Docker Desktop** or **Docker Engine 20.10+**
