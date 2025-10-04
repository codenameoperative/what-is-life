# 🎮 What is Life?

A modern idle/incremental life simulation game built with React, TypeScript, Rust (Tauri), and modern web technologies. Experience various life activities, collect items, earn WTC (What Are Those Coins?), and build your virtual life across multiple platforms!

![What is Life](https://img.shields.io/badge/What%20is%20Life-Idle%20Game-blue?style=for-the-badge&logo=game&logoColor=white)
![Multi-Platform](https://img.shields.io/badge/Platforms-Linux%20%7C%20Windows%20%7C%20macOS%20%7C%20Android-green?style=for-the-badge)
![Built with](https://img.shields.io/badge/Built%20with-React%20%7C%20Rust%20%7C%20Tauri-orange?style=for-the-badge)

## 🌟 **Overview**

**What is Life?** is a comprehensive life simulation game featuring:

- 🏆 **50-Level Progression System** with XP, achievements, and dynamic titles
- 💰 **Multi-Currency Economy** (Wallet, Bank, Stash)
- 🎯 **10+ Life Activities** with unique mechanics and requirements
- 🌐 **LAN Multiplayer** for local network gaming
- 📱 **Cross-Platform** support (Linux, Windows, macOS, Android)
- 🎨 **Modern UI** inspired by Discord, Neal.fun, ChatGPT, and Zorin OS
- 👑 **Admin Commands** for testing and development (restricted access)

---

## 📋 **Table of Contents**

- [🚀 Quick Start](#-quick-start)
- [🎮 Core Features](#-core-features)
- [🛠️ Technical Stack](#️-technical-stack)
- [📦 Distribution](#-distribution)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)

---

## 🚀 **Quick Start**

### **Web Version** (Development/Testing)
```bash
cd web
npm ci
npm run dev
```

### **Desktop Builds** (Windows MSI Focus)
```bash
# Install dependencies
npm ci
npm ci --prefix web

# Build for Windows (MSI installer)
npm run tauri:build:windows:msi

# Legacy builds (Linux - deprioritized)
npm run tauri:build:linux:x64    # 64-bit Intel/AMD
# Community builds (require extra setup):
# npm run tauri:build:linux:arm64  # 64-bit ARM
# npm run tauri:build:linux:i686   # 32-bit Intel
```

### **Android Build** (Docker-based)
```bash
# Build Android APKs using Docker
./scripts/build-android.sh

# Or build manually:
docker build -f Dockerfile.android -t android-builder .
docker run --rm -v $(pwd):/app android-builder
```

## 🎮 **Core Features**

### **📊 Level & Achievement System**
- **50-Level Progression**: Earn XP through activities, unlock rewards and titles
- **Achievement Categories**: Activity Masters, Wealth Builders, Survivors, Collectors, Level Climbers
- **Dynamic Titles**: Earn and equip special titles like "The Explorer", "Master Angler", "Green Thumb"
- **Death Penalties**: Higher levels bring greater rewards but greater risks

### **💰 Economic System**
- **Multiple banking system**: Wallet, Bank, Stash with different purposes
- **Item Trading**: Buy, sell, and collect rare items with 7 tiers
- **Market Dynamics**: Rotating shop inventory and special deals
- **Universal Item System**: Weapons, tools, clothing, collectibles, animals, fish, ores

### **🏆 Implemented Activities**

| Activity | Icon | Requirements | Cooldown | Rewards |
|----------|------|--------------|----------|---------|
| **Search** | 🔍 | None | 5s | Items only |
| **Crime** | 🦹 | None | 5s | WTC (50-200) |
| **Work** | 💼 | None | 10s | WTC (10-50) |
| **Hunt** | 🏹 | Hunting Rifle | 5s | Animals, Items, Treasure |
| **Fish** | 🐟 | Fishing Rod | 5s | Fish, Items, Pirate Stashes |
| **Dig** | ⛏️ | Shovel/Pickaxe | 5s | Ores, Buried Treasure |
| **Post** | 💬 | Phone/Laptop/PC | 10s | WTC, Items, Viral Success |
| **Stream** | ⏺️ | Streaming Setup | 10s | WTC, Items, Followers |
| **Explore** | 🗺️ | None | 10s | WTC, Items, Death Risk |
| **Garden** | 🌾 | None | 10s | Plants, Harvests, Pests |

### **🌐 LAN Multiplayer**
- **Local Network Gaming**: Connect with friends on the same network
- **Session Management**: Create or join multiplayer sessions
- **Mini-Games**: Russian Roulette, Fight, Race with other players
- **Real-time Communication**: Encrypted peer-to-peer messaging

### **🎨 Modern UI/UX**
- **Glass Morphism Effects**: Inspired by modern design trends
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Custom Scrollbars**: Enhanced visual feedback
- **Toast Notifications**: Real-time feedback for all actions

## 🛠️ **Technical Stack**

### **Frontend**
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Custom CSS Variables** - Design system
- **Context API** - State management

### **Backend/Desktop**
- **Tauri 1.8** - Rust-based desktop framework
- **Rust** - High-performance system integration
- **SQLite** - Local data persistence
- **WebKitGTK** - Linux rendering engine

### **Mobile**
- **Capacitor** - Cross-platform mobile runtime
- **Android SDK** - Native Android integration
- **Gradle** - Android build system

### **Multiplayer**
- **Custom LAN Discovery** - Network device detection
- **WebSocket Communication** - Real-time messaging
- **End-to-End Encryption** - Secure peer communication

## 📦 **Distribution**

### **Linux** 🐧
- **`.deb`**, **`.rpm`**, and **`.AppImage`** bundles
- **Official support**: x64 (Intel/AMD)
- **Community builds**: ARM64 / i686 (require additional toolchains)

### **Windows** 🪟
- **`.msi`** installer packages (Primary focus)
- **64-bit** native builds
- **WebView2** integration
- **MSI installer** with Start Menu shortcuts

> **🪟 Windows Development Focus**: The project now prioritizes Windows MSI installer development. Native Windows builds are available through GitHub Actions CI/CD pipeline with professional MSI packaging.

### **macOS** 🍎
- **Community-driven development**
- **Requires macOS build environment**
- **`.app` bundles** handled by volunteer maintainers

> **🍎 Community Development Notice**: macOS and iOS versions can be built using the existing codebase and CI/CD pipeline. Community contributors who create and maintain these versions will be responsible for their ongoing updates, testing, and distribution. The Developer focuses on Linux, Windows, and Android platforms.

### **iOS** 📱
- **Community-driven development** (targeting early 2026)
- **Requires macOS build environment**
- **App Store distribution** handled by volunteer maintainers

> **💻 Call for macOS Contributors**: We need developers with macOS machines to create native macOS `.app` bundles and iOS versions! The build system is ready - just run the GitHub Actions workflow or use the provided build scripts. Contributors will be credited and can maintain their own release channels.

### **Android** 🤖
- **APK packages** for ARM32 and ARM64 architectures only
- **Docker-based builds** for consistent cross-platform development
- **Minimum API 26** (Android 8.0)
- **ARM64 and ARM32** support (x86/x86_64 not supported)

## 🏗️ **Project Structure**

```
what-is-life/
├── web/                    # React web application
│   ├── src/
│   │   ├── activities/     # Game activity components
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React state management
│   │   ├── services/       # Game services & utilities
│   │   └── utils/          # Helper functions & data
│   ├── dist/               # Built web assets
│   └── package.json
├── src-tauri/              # Tauri Rust backend
│   ├── src/
│   │   ├── main.rs         # Application entry point
│   │   └── lib.rs          # Shared Rust code
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── android/                # Android project (generated)
├── dist/                   # Final build outputs
├── BUILD_README.md         # Detailed build instructions
└── README.md              # This file
```

## 🚀 **Development Roadmap**

### **✅ Completed**
- [x] Core game mechanics (10 activities)
- [x] Level & achievement system
- [x] LAN multiplayer functionality
- [x] Modern UI redesign
- [x] Cross-platform builds
- [x] Android support (not fully)

### **🔄 In Progress**
- [ ] Documentation migration to GitHub Wiki

### **🎯 Upcoming**
- [ ] Job progression mechanics
- [ ] Shop system expansion
- [ ] Story/quest system
- [ ] Social features
- [ ] others......

## 🎯 **How to Play**

1. **Start the Game**: Launch on your preferred platform
2. **Set Username**: Choose your unique identifier
3. **Choose Activities**: Click available activity buttons
4. **Meet Requirements**: Ensure you have required items/equipment
5. **Collect Rewards**: WTC and items are added automatically
6. **Manage Resources**: Use earnings to upgrade and progress
7. **Multiplayer**: Connect with friends via LAN for mini-games

## 🤝 **Contributing**

We welcome contributions! Areas for help:
- New activity implementations (ask for permission from CodeNameOperative)
- UI/UX improvements
- Game balance adjustments
- Cross-platform testing
- Documentation improvements
- Bug reports and feature requests

### **Development Setup**
```bash
# Clone repository
git clone https://github.com/codenameoperative/what-is-life.git
cd what-is-life

# Install dependencies
npm install

# Start development
npm run tauri:dev

# Build for testing
npm run tauri:build
```

## 📋 **Build Requirements**

### **All Platforms**
- Node.js 18+
- npm 9+
- Rust 1.70+
- Git

### **Linux Builds**
- GTK development libraries
- WebKitGTK
- AppIndicator libraries

### **Windows Builds**
- Visual Studio Build Tools
- WebView2 runtime

### **macOS Builds**
- Xcode command line tools

### **Android Builds**
- **Docker** (recommended) - Complete build environment in container
- **Java JDK 11+** - For manual builds without Docker
- **Android SDK & NDK** - For manual builds without Docker
- **Capacitor CLI** - For manual builds without Docker
- **Linux/macOS/Windows** - Docker works on all platforms

## 📚 **Documentation**

### **🎮 Game Guides**
- **[Complete Game Guide](docs/gameplay/COMPLETE_GAME_GUIDE.md)** - Complete gameplay instructions and strategies
- **[Game Guide](docs/gameplay/GAME_GUIDE.md)** - Core gameplay instructions
- **[Items Database](ITEMS_DATABASE.md)** - Complete item statistics and information
- **[System Requirements](docs/SYSTEM_REQUIREMENTS.md)** - Hardware/software requirements

### **🚀 Development**
- **[Development Guide](docs/development/DEVELOPMENT_GUIDE.md)** - Setup and development workflow
- **[Build Instructions](docs/build/BUILD_README.md)** - Detailed build procedures

### **🎨 Design & Assets**
- **[Icon Specifications](docs/ICON_SPECIFICATIONS.md)** - Icon design requirements
- **Assets**: Game icons and media files in `assets/`

### **📜 Scripts & Tools**
- **Build Scripts**: `scripts/` directory
- **Icon Generation**: `scripts/generate-icons.sh`

---

## 🌟 **Open Source & Community**

**What is Life** is proudly open source and welcomes community contributions!

### **🎯 Development Roadmap**

**✅ Completed:**
- Complete Linux build system (x64, ARM64, i686)
- Windows compatibility (WSL bootstrapper + native builds)
- Professional documentation suite
- Cross-platform CI/CD pipeline setup
- Fixed activity system and save functionality
- Improved UI with reduced hover glitches
- Optimized activity cooldowns for better gameplay
- Windows MSI installer development

### **💻 Platform-Specific Contributions**

- **Linux**: Bug reports, performance improvements, new architectures
- **Windows**: Native build testing, MSI installer improvements
- **macOS**: Native `.app` builds, iOS port development
- **Android**: APK optimization, mobile UI improvements

---

---

## ⚠️ **Testing & Bug Reports**

**NOTE**: The game is currently in beta and was rarely tested due to lack of time and resources. I am open to bug reports and suggestions before the full release later this year.

**🚨 Important Notice**: These builds have been rarely tested across different systems and configurations. While we strive for compatibility, you may encounter issues specific to your setup.

### **🐛 We're Open to Bug Reports & Suggestions!**

We're actively developing and improving **What is Life**. Your feedback is crucial for making this the best idle gaming experience possible!

**📧 How to Report Issues:**
- **GitHub Issues**: [Report bugs and request features](https://github.com/codenameoperative/what-is-life/issues)
- **Discussions**: [Join the community discussion](https://github.com/codenameoperative/what-is-life/discussions)

**🔍 What to Include in Bug Reports:**
- **Platform**: Linux/Windows/macOS + version
- **Architecture**: x64, ARM64, x32, etc.
- **Description**: What happened vs. what you expected
- **Steps to Reproduce**: Detailed steps to trigger the issue
- **Screenshots/Logs**: Any relevant error messages or screenshots
- **System Specs**: RAM, CPU, GPU information

**💡 Feature Requests Welcome:**
- New activity ideas
- UI/UX improvements
- Multiplayer enhancements
- Platform-specific features
- Performance optimizations

**🎯 Current Known Limitations:**
- Limited cross-platform testing
- Some architectures may have compatibility issues
- Multiplayer features need more real-world testing
- Performance optimization ongoing

Your reports help us prioritize fixes and improvements. Thank you for helping make **What is Life** better! 🚀

---

## 🏆 **Achievements** & Recognition**

- **20+ Achievements** across 6 categories
- **50-Level System** with progressive rewards
- **Dynamic Titles** for accomplished players
- **Cross-Platform Compatibility**
- **Modern Architecture** with TypeScript & Rust

## 📄 **License**

This project is developed by **CodeNameOperative**. See individual component licenses for details.

## 🌟 **Special Thanks**

- **Tauri Team** for the amazing desktop framework
- **Capacitor Team** for cross-platform mobile support
- **React & TypeScript** communities and creators
- **Open source contributors**

---

**🎮 Built with ❤️ by CodeNameOperative**
