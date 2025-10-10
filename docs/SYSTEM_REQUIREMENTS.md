# 📋 What is Life - System Requirements (v0.1.1)

## 🎮 **Minimum Requirements**

### **All Platforms**
- **OS**: Windows 10 64-bit (21H2+), macOS 11.0+ (Big Sur), Linux (Ubuntu 20.04+, Fedora 34+)
- **RAM**: 4 GB (8 GB recommended for better performance)
- **Storage**: 1 GB free space (SSD recommended)
- **Display**: 1366x768 resolution (1920x1080 recommended)
- **Network**: Stable internet connection for updates and multiplayer features

### **Platform-Specific**

#### **Windows** 🪟
- **OS**: Windows 10 64-bit (21H2) or Windows 11 (21H2)
- **Processor**: Intel Core i3-8100 / AMD Ryzen 3 1200 or better
- **Graphics**: DirectX 12 compatible with 2GB VRAM
- **Additional**: 
  - WebView2 runtime (installed automatically if missing)
  - Visual C++ Redistributable 2019 or later

#### **macOS** 🍎
- **OS**: macOS 10.15 (Catalina) or later
- **Processor**: Intel Core i3 or Apple Silicon M1/M2
- **Graphics**: Metal-compatible GPU
- **Additional**: None

#### **Linux** 🐧
- **OS**: Ubuntu 18.04+, Fedora 30+, or equivalent
- **Processor**: x86_64, ARM64, or x86 (32-bit)
- **Graphics**: OpenGL 3.3+ compatible
- **Additional**: GTK libraries (see installation guide)

#### **Android** 🤖
- **OS**: Android 8.0 (API level 26) or later
- **RAM**: 2 GB
- **Storage**: 200 MB free space
- **Architecture**: ARM64, ARM32, x86_64, or x86

---

## 🚀 **Recommended Requirements**

### **All Platforms**
- **RAM**: 4 GB or more
- **Storage**: 1 GB free space
- **Display**: 1920x1080 resolution or higher
- **Network**: High-speed internet for smooth multiplayer

### **Gaming Performance**
- **Processor**: Intel Core i5 / AMD Ryzen 5 or better
- **RAM**: 8 GB for optimal performance
- **Graphics**: Dedicated GPU for enhanced visuals

---

## 🛠️ **Development Requirements**

### **Core Development**
- **Node.js**: 18.0.0 or later (LTS recommended)
- **npm**: 9.0.0 or later
- **Rust**: 1.70.0 or later (latest stable recommended)
- **Git**: 2.30.0 or later

### **Platform-Specific Development**

#### **Windows Development**
```powershell
# Windows Build Tools
# Visual Studio Build Tools 2022
# Windows SDK 10.0.19041.0 or later
# WebView2 Runtime
```

#### **macOS Development**
```bash
# Xcode Command Line Tools
xcode-select --install

# Verify installation
xcode-select -p
```

#### **Linux Development**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora/RHEL
sudo dnf install webkit2gtk3-devel libappindicator-gtk3-devel librsvg2-devel patchelf

# Arch Linux
sudo pacman -S webkit2gtk base-devel libappindicator-gtk3 librsvg patchelf
```

#### **Android Development**
```bash
# Android SDK & NDK
# Install Android Studio or command-line tools
# Java JDK 11 or later

# Capacitor Android
npm install @capacitor/android
```

### **Cross-Compilation (Optional)**
```bash
# Add Rust targets for cross-compilation
rustup target add x86_64-unknown-linux-gnu
rustup target add aarch64-unknown-linux-gnu
rustup target add i686-unknown-linux-gnu
rustup target add x86_64-pc-windows-msvc
rustup target add x86_64-apple-darwin
```

---

## 📦 **Build Output Requirements**

### **Storage Space for Builds**
- **Single platform build**: ~200 MB
- **All Linux architectures**: ~600 MB
- **Full cross-platform build**: ~2 GB
- **Android APKs**: ~50 MB per architecture

### **Distribution Package Sizes**
- **AppImage**: ~140 MB (Linux)
- **DEB/RPM**: ~3.5 MB (Linux)
- **MSI**: ~50 MB (Windows)
- **DMG**: ~100 MB (macOS)
- **APK**: ~15-25 MB (Android)

---

## 🌐 **Network Requirements**

### **Online Features**
- **Account sync**: Optional cloud save (future feature)
- **Updates**: Automatic update checks
- **Analytics**: Anonymous usage statistics (optional)

### **Multiplayer Features**
- **LAN gaming**: Same local network required
- **Port requirements**: Automatic port selection
- **Firewall**: Allow outbound connections
- **NAT**: Should work with most home routers

### **Bandwidth Usage**
- **Updates**: ~50 MB per major update
- **Multiplayer**: < 1 MB per hour
- **Background**: Minimal network usage

---

## 🔧 **Troubleshooting Requirements**

### **Common Issues**

#### **"WebView2 not found" (Windows)**
- **Solution**: Download from Microsoft website
- **URL**: https://developer.microsoft.com/microsoft-edge/webview2/

#### **"GTK not found" (Linux)**
- **Solution**: Install system dependencies
- **Command**: See development requirements above

#### **"Android SDK not found"**
- **Solution**: Install Android Studio or command-line tools
- **Minimum API**: 26 (Android 8.0)

#### **Build failures**
- **Rust**: Ensure latest stable version
- **Node.js**: Use LTS version
- **Dependencies**: Clear npm cache and reinstall

### **Performance Optimization**
- **Close background applications**
- **Ensure sufficient RAM**
- **Update graphics drivers**
- **Check antivirus exclusions**

---

## 📞 **Support**

If you encounter issues not covered here:
- Check the [troubleshooting guide](../build/BUILD_README.md#troubleshooting)
- Visit [GitHub Issues](../../issues) for known problems
- Create a new issue for unreported problems

---

**✅ System ready? Let's play What is Life!** 🎮
