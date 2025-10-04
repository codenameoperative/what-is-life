# 🎮 What is Life?

A modern idle/incremental life simulation game built with React, TypeScript, Rust (Tauri), and modern web technologies. Experience various life activities, collect items, earn WTC (What Are Those Coins?), and build your virtual life across multiple platforms!

![What is Life](https://img.shields.io/badge/What%20is%20Life-Idle%20Game-blue?style=for-the-badge&logo=game&logoColor=white)
![Windows MSI](https://img.shields.io/badge/Windows-MSI%20Installer-green?style=for-the-badge&logo=windows&logoColor=white)
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
- 🎒 **500+ Items** across 7 categories and 8 tiers
- 🔧 **60+ Search Locations** with unique rewards and effects
- 💼 **20+ Jobs** across 4 tiers with different requirements and pay scales

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

# Alternative: Build for Linux (development)
npm run tauri:build -- --target x86_64-unknown-linux-gnu
```

### **Docker Builds** (Android APK)
```bash
# Build Android APK using Docker
./scripts/build-android.sh
```

---

## 🎮 **Core Features**

### **Activities & Gameplay**
- **Search**: Explore various locations to find items and earn money
- **Work**: Apply for jobs and earn steady income based on job tier
- **Hunt**: Track and hunt animals for valuable resources
- **Fish**: Catch fish in different aquatic environments
- **Dig**: Mine for ores and precious minerals
- **Post**: Share content on social media platforms for rewards
- **Stream**: Broadcast content to earn viewer donations
- **Explore**: Discover new locations and hidden treasures
- **Garden**: Grow plants and manage your virtual garden
- **Crime**: Engage in illicit activities for quick cash (with risks)

### **Items System**
- **7 Categories**: Weapons, Tools, Clothing, Collectables, Animals, Fish, Ores
- **8 Tiers**: Useless → Common → Uncommon → Rare → Epic → Legendary → Mythical → WDYFT
- **500+ Unique Items** with different properties and uses
- **Breakable Items** with durability mechanics
- **Stackable Items** for efficient inventory management
- **Tier Pills** for easy visual identification

### **Job System**
- **4 Job Tiers**: Entry → Intermediate → Advanced → Expert
- **20+ Unique Jobs** with different requirements and pay scales
- **Item Requirements** for certain high-paying positions
- **Dynamic Job Market** with varying opportunities

### **Search Locations**
- **60+ Locations** across different environments
- **Unique Drop Tables** for each location
- **Special Effects** that influence gameplay
- **Risk/Reward Balance** for strategic exploration

---

## 🛠️ **Technical Stack**

### **Frontend**
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive design
- **Vite** for fast development and building
- **Context API** for state management

### **Desktop**
- **Tauri 2.0** for cross-platform desktop apps
- **Rust** for secure, performant backend
- **WebView** for native OS integration

### **Mobile**
- **Capacitor** for native mobile app generation
- **Android Gradle** for APK building
- **Docker** for consistent build environments

### **Development Tools**
- **ESLint** + **Prettier** for code quality
- **TypeScript** for type checking
- **GitHub Actions** for CI/CD
- **Docker** for containerized builds

---

## 📦 **Distribution**

### **Windows (Primary)**
- **MSI Installer** for easy installation and uninstallation
- **x64 Architecture** for modern Windows systems
- **Auto-updater** for seamless updates

### **Linux**
- **AppImage** and **DEB** packages available
- **Native integration** with Linux desktop environments
- **Docker builds** for consistent deployment

### **Android**
- **APK Generation** via Docker and Gradle
- **ARM64 and ARM32** support
- **Native Android** app store ready

### **Development**
- **Web version** for testing and development
- **Hot reload** for rapid iteration
- **Cross-platform** testing capabilities

---

## 📚 **Documentation**

### **Items Database**
- Complete documentation of all 500+ items
- Detailed tier and category breakdowns
- Crafting recipes and special properties

### **Locations Guide**
- Comprehensive list of all 60+ search locations
- Drop rates and special effects for each location
- Strategic exploration tips

### **Jobs Guide**
- All 20+ jobs with requirements and pay scales
- Career progression strategies
- Item dependency explanations

### **Technical Docs**
- Architecture overview and design decisions
- Development setup and build instructions
- API documentation for modding support

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### **Code Contributions**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Bug Reports**
- Use the GitHub Issues page
- Include detailed reproduction steps
- Add relevant screenshots or logs
- Tag appropriately (bug, enhancement, etc.)

### **Feature Requests**
- Discuss ideas in GitHub Discussions
- Provide detailed use cases
- Consider implementation complexity
- Tag as enhancement

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/what-is-life.git
cd what-is-life

# Install dependencies
npm ci
npm ci --prefix web

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Windsurf Engineering Team** for the core development
- **Tauri Community** for the excellent cross-platform framework
- **React Team** for the powerful frontend library
- **Open Source Community** for various tools and utilities
- **Gaming Community** for inspiration and feedback

---

**🎯 Ready to start your virtual life adventure? Let's begin!**
