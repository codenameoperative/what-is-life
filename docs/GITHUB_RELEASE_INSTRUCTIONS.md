# GitHub Release Instructions for v0.1.1

## Overview
This guide explains how to create a GitHub release for What is Life v0.1.1, including tagging, creating release notes, and uploading build artifacts.

## Prerequisites
- All changes have been committed and pushed to the main branch
- Build artifacts are ready (Windows MSI/EXE, Android APKs, Linux AppImage)
- Release notes have been prepared in `docs/release-notes/v0.1.1.md`

## Step 1: Create Release Tag

1. **Go to GitHub Repository**
   - Navigate to https://github.com/codenameoperative/what-is-life

2. **Create Release Tag**
   ```bash
   # On your local machine (if not already done)
   git tag v0.1.1
   git push origin v0.1.1
   ```

3. **Verify Tag Creation**
   - Check that the tag appears in GitHub under "Releases" or "Tags"

## Step 2: Create GitHub Release

1. **Navigate to Releases**
   - Go to the repository's main page
   - Click on "Releases" in the right sidebar
   - Click "Create a new release"

2. **Fill Release Details**
   - **Tag**: Select `v0.1.1` from the dropdown (or create it if not exists)
   - **Release title**: `v0.1.1 - Stable Release`
   - **Description**: Copy the contents from `docs/release-notes/v0.1.1.md`

3. **Add Release Notes**
   ```markdown
   # Release Notes – v0.1.1

   ## 🆕 Highlights
   - Major UI/UX improvements and mini-game enhancements for v0.1.1 stable release.
   - Cross-platform build optimization: Windows MSI/EXE and Android APKs only.
   - Enhanced mini-game difficulty systems and CPU opponent support.
   - Improved settings management and save data controls.

   ## 🎮 Gameplay & Systems
   - **Enhanced Mini-Games**:
     - Added difficulty settings to all mini-games with intelligent AI opponents
     - Fight mini-game now supports CPU opponents when not connected to friends
     - Tic-Tac-Toe AI with easy/medium/hard difficulty levels using strategic move evaluation

   - **UI/UX Improvements**:
     - Centered utility bar with improved responsive layout and glass morphism effects
     - Enhanced player ID display with sticky positioning for better visibility
     - Improved modal layouts and button interactions

   - **Settings & Controls**:
     - Removed automated grinding feature for better game balance
     - Added delete save functionality with confirmation dialog
     - Streamlined settings interface with better organization

   ## 🖥️ Platform & Build Support
   - **Windows**: MSI and EXE packaging via optimized GitHub Actions workflow
   - **Android**: APK generation with ARM32/ARM64 support
   - **Linux**: AppImage builds available for x64 architecture
   - **Build Optimization**: Removed macOS and Linux build jobs from CI/CD pipeline

   ## 📦 Technical Improvements
   - **Code Quality**:
     - Cleaned up unused imports and deprecated features
     - Improved error handling and build stability
     - Enhanced TypeScript type safety

   - **Performance**:
     - Optimized build process for faster compilation
     - Reduced bundle size through better code splitting
     - Improved memory management in mini-games

   ## 🔧 Development & Documentation
   - **Documentation Updates**:
     - Updated build instructions and platform requirements
     - Enhanced development guides for contributors
     - Improved icon specifications and asset guidelines

   - **Build System**:
     - Streamlined CI/CD pipeline for target platforms only
     - Added automated testing for key features
     - Improved dependency management

   ## 🎯 Known Issues / Next Steps
   - Mobile UI optimizations for smaller screens
   - Additional mini-game content and variations
   - Performance monitoring and analytics improvements
   - Community-driven macOS builds and testing

   ## 📋 Release Checklist
   - [x] UI/UX improvements implemented
   - [x] Mini-game difficulty systems added
   - [x] Settings cleanup completed
   - [x] Build optimization finished
   - [x] Cross-platform testing completed
   - [x] Documentation updated

   ## 🚀 Installation Instructions

   ### Windows
   Download the latest MSI/EXE from the releases page and run the installer.

   ### Android
   Download the APK file and install it on your Android device (Android 8.0+ required).

   ### Linux
   Download the AppImage file, make it executable with `chmod +x what-is-life_*.AppImage`, and run it directly.

   ## 🙋‍♂️ Support & Feedback
   - **Issues**: Report bugs and feature requests on GitHub Issues
   - **Discussions**: Join community discussions on GitHub Discussions
   - **Email**: Contact the maintainer for private inquiries

   **Maintained by:** CodeNameOperative
   **Repository:** https://github.com/codenameoperative/what-is-life
   **Version:** 0.1.1
   **Release Date:** October 2025
   ```

## Step 3: Upload Build Artifacts

1. **Prepare Build Artifacts**
   - Windows: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/`
   - Android: `android/app/build/outputs/apk/release/`
   - Linux: `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/`

2. **Upload to Release**
   - In the GitHub release creation form, scroll to "Attach binaries by dropping them here or selecting them"
   - Upload the following files:
     - `what-is-life_0.1.1_x64-setup.exe` (Windows installer)
     - `what-is-life_0.1.1_x64.msi` (Windows MSI)
     - `app-release.apk` (Android APK)
     - `what-is-life_0.1.1_amd64.AppImage` (Linux AppImage)

## Step 4: Publish Release

1. **Review Information**
   - Ensure all details are correct
   - Verify that build artifacts uploaded successfully
   - Check that release notes are properly formatted

2. **Publish Release**
   - Click "Publish release" button
   - The release will be live immediately

## Step 5: Post-Release Actions

1. **Update Documentation**
   - Update `README.md` with links to new release
   - Update any version references in documentation

2. **Social Media & Announcements**
   - Post about the release in relevant communities
   - Update Discord/Reddit posts if applicable

3. **Monitor & Support**
   - Monitor GitHub Issues for any release-related problems
   - Respond to user feedback and bug reports

## Troubleshooting

### Build Artifacts Not Found
- Ensure CI/CD pipeline completed successfully
- Check `src-tauri/target/` directories for generated files
- Verify that all dependencies are properly installed

### Release Creation Fails
- Ensure you have maintainer permissions on the repository
- Check that the tag `v0.1.1` exists and is pushed to origin
- Verify network connectivity for file uploads

### Large Files Upload Issues
- GitHub releases support files up to 2GB
- If files are too large, consider compressing or splitting
- Check file sizes before attempting upload

## Additional Notes
- Release notes should be comprehensive but concise
- Include installation instructions for each platform
- Always test downloads after publishing
- Keep backup copies of all build artifacts
