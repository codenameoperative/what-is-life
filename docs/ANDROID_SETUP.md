# Android SDK Setup Instructions for those looking to make their own builds (made for linux but you can search up to find your specific platform)

## Install Android Studio on Linux:
```bash
# Download Android Studio
wget -O android-studio.tar.gz https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.3.1.18/android-studio-2023.3.1.18-linux.tar.gz

# Extract
sudo tar -xzf android-studio.tar.gz -C /opt/

# Add to PATH
echo 'export ANDROID_HOME=/opt/android-studio' >> ~/.bashrc
echo 'export ANDROID_SDK_ROOT=$ANDROID_HOME/sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/bin:$ANDROID_SDK_ROOT/platform-tools' >> ~/.bashrc
source ~/.bashrc

# Launch Android Studio to download SDK
/opt/android-studio/bin/studio.sh
```

## In Android Studio:
1. Open SDK Manager
2. Install:
   - Android SDK Platform 34 (API 34)
   - Android SDK Build-Tools 34.0.0
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator (optional)

## After SDK Setup, Build APKs:
```bash
``cd /home/arcelus/Desktop/What\ is\ life``

# Build Android APKs
npm run android:build:all

# Individual architectures:
npm run android:build:arm64    # ARM64 (Android 8-15)
npm run android:build:arm32    # ARM32 (Android 8-15)
npm run android:build:x86_64   # x86_64 (Android 8-15)
npm run android:build:x86      # x86 (Android 8-15)
```
