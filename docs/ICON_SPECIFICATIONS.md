# 🎨 Icon Design Specifications - What is Life

## 📋 **Icon Requirements Overview**

The game requires a comprehensive icon set for branding, UI elements, and platform distribution. All icons should maintain consistency with the modern, glassmorphism-inspired design aesthetic.

## 🖼️ **Required Icon Dimensions**

### **Primary App Icons (Square)**
```
┌─────────────────────────────────────┐
│          APP ICONS                  │
├─────────────────────────────────────┤
│ • 512x512px - Main app icon        │
│ • 256x256px - Alternative size     │
│ • 128x128px - Small app icon       │
│ • 64x64px   - Tiny app icon        │
│ • 32x32px   - Favicon size         │
│ • 16x16px   - Smallest favicon     │
└─────────────────────────────────────┘
```

### **Platform-Specific Icons**

#### **Windows (.ico format)**
```
• 256x256px (primary)
• 128x128px
• 64x64px
• 48x48px
• 32x32px
• 16x16px
```

#### **macOS (.icns format)**
```
• 1024x1024px (primary)
• 512x512px
• 256x256px
• 128x128px
• 64x64px
• 32x32px
• 16x16px
```

#### **Linux (.png format)**
```
• 512x512px (primary)
• 256x256px
• 128x128px
• 64x64px
• 48x48px
• 32x32px
• 16x16px
```

#### **Android (Adaptive Icons)**
```
Foreground: 432x432px (within 66x66dp safe zone)
Background: 432x432px
Final: 512x512px (with padding)
```

### **UI Element Icons (32x32px base)**
```
• 16x16px  - Extra small
• 24x24px  - Small
• 32x32px  - Standard (base)
• 48x48px  - Large
• 64x64px  - Extra large
• 128x128px - Activity icons
```

## 🎨 **Design Guidelines**

### **Color Palette**
- **Primary**: `#5865f2` (Discord-inspired blue)
- **Accent**: `#fee75c` (Golden yellow)
- **Secondary**: `#36393f` (Dark gray)
- **Background**: `#000000` to `#1a1a1a` (Black gradient)
- **Text**: `#ffffff` (White)
- **Muted**: `#72767d` (Gray)

### **Style Requirements**
- **Modern & Clean**: Glassmorphism effects
- **Consistent**: Same style across all icons
- **Scalable**: Works at all sizes
- **Readable**: Clear at small sizes
- **Professional**: Polished appearance

### **Icon Elements**
The main app icon should incorporate:
- **Life Symbol**: Circle/square representing life
- **Activity Elements**: Subtle hints of game activities
- **Modern Aesthetics**: Rounded corners, subtle shadows
- **Brand Colors**: Primary blue with accent highlights

## 📁 **File Organization**

```
icons/
├── app/
│   ├── icon-512x512.png
│   ├── icon-256x256.png
│   ├── icon-128x128.png
│   ├── icon-64x64.png
│   ├── icon-32x32.png
│   └── icon-16x16.png
├── platforms/
│   ├── windows/
│   │   ├── app.ico
│   │   └── installer.ico
│   ├── macos/
│   │   └── app.icns
│   ├── linux/
│   │   ├── app.png
│   │   └── tray.png
│   └── android/
│       ├── adaptive/
│       │   ├── foreground.png
│       │   ├── background.png
│       │   └── icon.png
│       └── legacy/
│           ├── mipmap-hdpi/ic_launcher.png
│           ├── mipmap-mdpi/ic_launcher.png
│           ├── mipmap-xhdpi/ic_launcher.png
│           ├── mipmap-xxhdpi/ic_launcher.png
│           └── mipmap-xxxhdpi/ic_launcher.png
└── ui/
    ├── activities/
    │   ├── search.png
    │   ├── crime.png
    │   ├── work.png
    │   ├── hunt.png
    │   ├── fish.png
    │   ├── dig.png
    │   ├── post.png
    │   ├── stream.png
    │   ├── explore.png
    │   └── garden.png
    ├── ui-elements/
    │   ├── settings.png
    │   ├── inventory.png
    │   ├── shop.png
    │   ├── multiplayer.png
    │   ├── achievements.png
    │   └── profile.png
    └── status/
        ├── online.png
        ├── offline.png
        ├── away.png
        └── busy.png
```

## 🛠️ **Technical Specifications**

### **Formats**
- **Web**: PNG (transparent background)
- **Windows**: ICO (multi-resolution)
- **macOS**: ICNS (Apple icon format)
- **Android**: PNG (adaptive icons)
- **Linux**: PNG (various sizes)

### **Background**
- **Transparent** for web and Linux
- **Solid color** for Windows/macOS installers
- **Adaptive** for Android (foreground + background)

### **Export Settings**
- **PNG**: 32-bit with transparency
- **Compression**: Lossless
- **Color Profile**: sRGB
- **Resolution**: 72 DPI

## ✅ **Delivery Checklist**

- [ ] Main app icon (all required sizes)
- [ ] Platform-specific formats (ICO, ICNS)
- [ ] Android adaptive icons
- [ ] UI element icons (activities, settings, etc.)
- [ ] Status indicator icons
- [ ] Favicon variants
- [ ] Proper file organization
- [ ] README with usage instructions

## 🎯 **Usage Instructions**

### **Tauri Configuration**
Icons will be placed in `src-tauri/icons/` directory:
```
src-tauri/
└── icons/
    ├── 32x32.png
    ├── 128x128.png
    ├── icon.icns
    ├── icon.ico
    └── icon.png
```

### **Web Assets**
Place in `web/public/` directory:
```
web/public/
├── favicon.ico
├── apple-touch-icon.png
└── icon-192.png
```

### **Android Integration**
Icons placed in `android/app/src/main/res/`:
```
res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

## 📞 **Contact & Questions**

For any questions about icon specifications or requirements, please refer to this document or contact the development team.

---

**🎨 Icon Design Specification v1.0**
