#!/bin/bash
# Android Build Script using Docker

set -e

echo "🚀 Starting Android APK builds..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -f Dockerfile.android -t android-builder .

# Create container and build APKs
echo "🤖 Building ARM64 APK..."
docker run --rm -v "$(pwd):/app" android-builder bash -c "
    cd /app/web/android && \
    ./gradlew assembleDebug -PabiFilter=arm64-v8a && \
    cp app/build/outputs/apk/debug/app-arm64-v8a-debug.apk /app/
"

echo "🤖 Building ARM32 APK..."
docker run --rm -v "$(pwd):/app" android-builder bash -c "
    cd /app/web/android && \
    ./gradlew assembleDebug -PabiFilter=armeabi-v7a && \
    cp app/build/outputs/apk/debug/app-armeabi-v7a-debug.apk /app/
"

echo "✅ Android APK builds completed!"
echo "📱 APK files created:"
ls -la *.apk

echo ""
echo "📋 Build Summary:"
echo "   • ARM64 APK: $(ls -lh app-arm64-v8a-debug.apk 2>/dev/null | awk '{print $5}' || echo 'Not found')"
echo "   • ARM32 APK: $(ls -lh app-armeabi-v7a-debug.apk 2>/dev/null | awk '{print $5}' || echo 'Not found')"
