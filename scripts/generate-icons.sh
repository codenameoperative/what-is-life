#!/bin/bash

# What is Life - Icon Generation Script
# Generates all required icon sizes from a single source image

set -e

SOURCE_ICON="assets/icons/app-icon-source.png"
OUTPUT_DIR="src-tauri/icons"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🎨 What is Life - Icon Generation Script"
echo "========================================"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${RED}❌ Source icon not found: $SOURCE_ICON${NC}"
    echo "Please place your source icon at: $SOURCE_ICON"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick not found. Please install it:${NC}"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  macOS: brew install imagemagick"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}📁 Generating icons from: $SOURCE_ICON${NC}"
echo ""

# Generate PNG icons for Tauri
echo "🔧 Generating Tauri PNG icons..."
SIZES=(16 32 128 256 512)

for size in "${SIZES[@]}"; do
    echo "  📏 ${size}x${size}px"
    convert "$SOURCE_ICON" -resize "${size}x${size}" "$OUTPUT_DIR/${size}x${size}.png"
done

# Generate high-res version
echo "  📏 128x128@2x.png (256x256)"
convert "$SOURCE_ICON" -resize "256x256" "$OUTPUT_DIR/128x128@2x.png"

echo -e "${GREEN}✅ PNG icons generated successfully!${NC}"
echo ""

# Generate ICO file for Windows
echo "🪟 Generating Windows ICO file..."
convert "$SOURCE_ICON" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    \( -clone 0 -resize 128x128 \) \
    \( -clone 0 -resize 256x256 \) \
    -delete 0 "$OUTPUT_DIR/icon.ico"

echo -e "${GREEN}✅ Windows ICO generated successfully!${NC}"
echo ""

# Generate ICNS file for macOS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Generating macOS ICNS file..."
    # Create iconset directory
    ICONSET_DIR="$OUTPUT_DIR/icon.iconset"
    mkdir -p "$ICONSET_DIR"

    # Generate various sizes for iconset
    convert "$SOURCE_ICON" -resize 16x16 "$ICONSET_DIR/icon_16x16.png"
    convert "$SOURCE_ICON" -resize 32x32 "$ICONSET_DIR/icon_16x16@2x.png"
    convert "$SOURCE_ICON" -resize 32x32 "$ICONSET_DIR/icon_32x32.png"
    convert "$SOURCE_ICON" -resize 64x64 "$ICONSET_DIR/icon_32x32@2x.png"
    convert "$SOURCE_ICON" -resize 128x128 "$ICONSET_DIR/icon_128x128.png"
    convert "$SOURCE_ICON" -resize 256x256 "$ICONSET_DIR/icon_128x128@2x.png"
    convert "$SOURCE_ICON" -resize 256x256 "$ICONSET_DIR/icon_256x256.png"
    convert "$SOURCE_ICON" -resize 512x512 "$ICONSET_DIR/icon_256x256@2x.png"
    convert "$SOURCE_ICON" -resize 512x512 "$ICONSET_DIR/icon_512x512.png"
    convert "$SOURCE_ICON" -resize 1024x1024 "$ICONSET_DIR/icon_512x512@2x.png"

    # Create ICNS file
    iconutil -c icns "$ICONSET_DIR" -o "$OUTPUT_DIR/icon.icns"

    # Clean up iconset
    rm -rf "$ICONSET_DIR"

    echo -e "${GREEN}✅ macOS ICNS generated successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping ICNS generation (not on macOS)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All icons generated successfully!${NC}"
echo ""
echo "📂 Generated files in: $OUTPUT_DIR"
echo "   📄 PNG files: 16x16, 32x32, 128x128, 128x128@2x, 256x256, 512x512"
echo "   🪟 ICO file: icon.ico (multi-resolution)"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   🍎 ICNS file: icon.icns (macOS)"
fi
echo ""
echo "✅ Ready for Tauri builds across all platforms!"
