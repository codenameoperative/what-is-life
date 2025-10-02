# 🚀 What is Life - Development Guide

## Overview

This guide covers setting up the development environment, understanding the codebase architecture, and contributing to the project.

---

## 🛠️ **Development Setup**

### **Prerequisites**
- **Node.js**: 18+ (LTS recommended)
- **Rust**: 1.70+ (latest stable)
- **Git**: 2.30+
- **Platform-specific tools** (see build requirements)

### **Quick Setup**
```bash
# Clone repository
git clone https://github.com/codenameoperative/what-is-life.git
cd what-is-life

# Install dependencies
npm ci
npm ci --prefix web

# Start development
npm run tauri:dev
```

> 📚 **Prefer the Wiki?** Up-to-date setup and architecture notes live in the [GitHub Wiki](https://github.com/codenameoperative/what-is-life/wiki).

### **Environment Variables**
Create `.env` file in `web/` directory:
```env
# Supabase (optional - for future features)
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🏗️ **Project Architecture**

### **Technology Stack**
```
Frontend:    React 18 + TypeScript + Tailwind CSS
Backend:     Tauri (Rust) + SQLite
Mobile:      Capacitor + Android SDK
Build:       Vite + Cargo
```

### **Directory Structure**
```
what-is-life/
├── web/                    # React frontend
│   ├── src/
│   │   ├── activities/     # Game activity components
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React state management
│   │   ├── services/       # Game services & utilities
│   │   └── utils/          # Helper functions & data
│   └── public/             # Static assets
├── src-tauri/              # Rust backend
│   ├── src/                # Rust source code
│   └── icons/              # App icons
├── android/                # Android project (Capacitor)
├── docs/                   # Documentation
├── assets/                 # Media assets
└── scripts/                # Build scripts
```

### **Key Components**

#### **Frontend (React/TypeScript)**
- **Activities**: Individual game activity implementations
- **Components**: Modals, UI elements, layouts
- **Contexts**: Game state, notifications, multiplayer
- **Utils**: RNG, item definitions, game logic

#### **Backend (Rust/Tauri)**
- **Main Application**: Window management, system integration
- **IPC Commands**: Communication between frontend/backend
- **Data Persistence**: Save/load game state
- **Network Services**: LAN discovery, multiplayer

---

## 🔧 **Development Workflow**

### **Local Development**
```bash
# Install dependencies
npm ci
npm ci --prefix web

# Start development server
npm run tauri:dev

# Build for production
npm run tauri:build

# Run tests (when implemented)
npm test
```

### **Adding New Activities**
1. Create activity component in `web/src/activities/`
2. Add to `Game.tsx` activity renderer
3. Update item requirements in `utils/items.ts`
4. Add to activity grid in `Game.tsx`
5. Update documentation

### **UI Component Development**
- Use design system classes (`.glass`, `.glass-strong`, `.text-primary`, etc.)
- Follow responsive design patterns
- Implement proper accessibility
- Add loading states and error handling

### **State Management**
- **GameContext**: Core game state (player, inventory, settings)
- **NotifyContext**: Toast notifications
- **MultiplayerContext**: Network state and connections

---

## 🎨 **Design System**

### **Color Variables** (`web/src/index.css`)
```css
:root {
  /* Primary colors */
  --primary: #5865f2;
  --accent: #fee75c;
  --secondary: #36393f;

  /* Text colors */
  --text-primary: #ffffff;
  --text-secondary: #b9bbbe;
  --text-muted: #72767d;

  /* Backgrounds */
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2f3136;

  /* Borders & accents */
  --border: #36393f;
  --border-strong: #40444b;
  --success: #57f287;
  --warning: #fee75c;
  --error: #ed4245;
}
```

### **Utility Classes**
- `.glass`: Glassmorphism background
- `.glass-strong`: Enhanced glass effect
- `.btn-primary`: Primary button styling
- `.btn-secondary`: Secondary button styling
- `.modal-overlay`: Modal backdrop
- `.input-modern`: Modern input styling

---

## 🚀 **Build System**

### **Available Commands**
```bash
# Development
npm run dev              # Frontend dev server
npm run tauri:dev        # Full app dev mode

# Building
npm run build            # Frontend production build
npm run tauri:build      # Full app build

# Platform-specific builds
npm run tauri:build:linux:x64     # Linux 64-bit
npm run tauri:build:linux:arm64   # Linux ARM64
npm run tauri:build:linux:i686    # Linux 32-bit
npm run tauri:build:windows       # Windows
npm run tauri:build:macos         # macOS

# Android builds
npm run android:build:all         # All Android ABIs
npm run android:build:arm64       # Android ARM64
```

### **Build Requirements**

#### **Linux**
```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

# Cross-compilation
rustup target add x86_64-unknown-linux-gnu
rustup target add aarch64-unknown-linux-gnu
rustup target add i686-unknown-linux-gnu
```

#### **Windows**
```powershell
# Install Visual Studio Build Tools
# WebView2 runtime
# Windows SDK
```

#### **macOS**
```bash
# Xcode command line tools
xcode-select --install
```

#### **Android**
```bash
# Android SDK & NDK
# Java JDK 11+
npm install @capacitor/android
```

---

## 🧪 **Testing & Quality**

### **Code Quality**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting (configure as needed)
- **Prettier**: Code formatting (configure as needed)

### **Performance**
- Bundle size monitoring
- Memory leak prevention
- 60fps animation targets
- Efficient state updates

### **Cross-platform Testing**
- Test on all target platforms
- Verify network functionality
- Check file system operations
- Validate UI responsiveness

---

## 📝 **Contributing Guidelines**

### **Code Style**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for functions
- Keep components modular and reusable

### **Commit Messages**
```
feat: add new activity system
fix: resolve multiplayer connection issue
docs: update game guide
style: improve UI component styling
refactor: optimize state management
```

### **Pull Request Process**
1. Create feature branch from `main`
2. Make changes with proper commits
3. Test on multiple platforms
4. Update documentation
5. Create pull request with description

---

## 🔍 **Debugging**

### **Frontend Debugging**
- React DevTools for component inspection
- Browser console for logging
- Network tab for API calls
- Application tab for storage

### **Backend Debugging**
- Tauri devtools
- Rust debugging with `println!`
- IPC communication monitoring
- File system operation logs

### **Multiplayer Debugging**
- Network packet inspection
- Connection state monitoring
- LAN discovery logs
- WebSocket message tracing

---

## 📚 **Resources**

- **Tauri Documentation**: https://tauri.app/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Capacitor**: https://capacitorjs.com/
- **Rust Book**: https://doc.rust-lang.org/book/

---

**Happy coding! 🎮**
