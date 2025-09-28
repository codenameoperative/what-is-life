#!/bin/bash

# What Is Life - Multi-Platform Build Script
# This script builds the application for multiple Linux distributions and architectures

set -e

echo "🚀 Building What Is Life for Multiple Platforms"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
    print_error "Please run this script from the root directory of the project"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build web assets
print_status "Building web assets..."
npm run build

# Function to build for specific target
build_target() {
    local target=$1
    local description=$2

    print_status "Building for $description ($target)..."

    if npm run tauri:build -- --target $target; then
        print_success "Successfully built for $description"
        return 0
    else
        print_error "Failed to build for $description"
        return 1
    fi
}

# Create output directory
mkdir -p dist

# Build Linux packages
print_status "Building Linux packages..."

# x86_64 (64-bit Intel/AMD)
if build_target "x86_64-unknown-linux-gnu" "Linux x86_64"; then
    # Copy built packages
    if [ -d "src-tauri/target/x86_64-unknown-linux-gnu/release/bundle" ]; then
        cp -r src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/* dist/ 2>/dev/null || true
    fi
fi

# aarch64 (64-bit ARM)
if build_target "aarch64-unknown-linux-gnu" "Linux ARM64"; then
    if [ -d "src-tauri/target/aarch64-unknown-linux-gnu/release/bundle" ]; then
        cp -r src-tauri/target/aarch64-unknown-linux-gnu/release/bundle/* dist/ 2>/dev/null || true
    fi
fi

# i686 (32-bit Intel)
if build_target "i686-unknown-linux-gnu" "Linux i686"; then
    if [ -d "src-tauri/target/i686-unknown-linux-gnu/release/bundle" ]; then
        cp -r src-tauri/target/i686-unknown-linux-gnu/release/bundle/* dist/ 2>/dev/null || true
    fi
fi

# Build Android APKs
print_status "Building Android APKs..."

# Check if Android build environment is available
if command -v java &> /dev/null && [ -d "web/android" ]; then
    print_status "Building Android APKs..."

    # Sync Capacitor
    cd web
    npx cap sync android
    cd android

    # Build for different ABIs
    declare -a abis=("arm64-v8a" "x86_64" "armeabi-v7a" "x86")
    declare -a abi_names=("ARM64" "x86_64" "ARM32" "x86")

    for i in "${!abis[@]}"; do
        abi="${abis[$i]}"
        abi_name="${abi_names[$i]}"

        print_status "Building Android APK for $abi_name ($abi)..."
        if ./gradlew assembleDebug -PabiFilter="$abi"; then
            print_success "Successfully built Android APK for $abi_name"

            # Copy APK to dist
            apk_file="app/build/outputs/apk/debug/app-$abi-debug.apk"
            if [ -f "$apk_file" ]; then
                cp "$apk_file" "../../../dist/what-is-life-android-${abi}-debug.apk"
            fi
        else
            print_warning "Failed to build Android APK for $abi_name"
        fi
    done

    cd ../..
else
    print_warning "Android build environment not available. Skipping Android builds."
fi

# Create tar.gz archives for manual distribution
print_status "Creating tar.gz archives for distribution..."

cd dist

# Create tar.gz for each architecture
for dir in */; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        print_status "Creating tar.gz for $dirname..."
        tar -czf "${dirname}.tar.gz" -C "$dir" .
        print_success "Created ${dirname}.tar.gz"
    fi
done

cd ..

print_success "Build process completed!"
print_status "Output files are available in the 'dist' directory:"
ls -la dist/

echo ""
print_status "Summary of built packages:"
echo "  Linux:"
echo "    - .deb packages (Debian/Ubuntu)"
echo "    - .rpm packages (Red Hat/Fedora)"
echo "    - .AppImage files (universal Linux)"
echo "    - tar.gz archives (manual installation)"
echo "  Android:"
echo "    - APK files for different architectures"
echo ""
print_success "Ready for distribution! 🎉"
