# Electron Build and Release Guide

This document explains how to build and release the Mosaic desktop application using Electron.

## Quick Start

### Building Locally

```bash
# Install dependencies
npm install

# Build the Electron application
npm run electron:build
```

The build artifacts will be in the `release/` directory:
- **Linux**: `Mosaic-X.X.X.AppImage`, `mosaic_X.X.X_amd64.deb`
- **Windows**: `Mosaic Setup X.X.X.exe`, `Mosaic X.X.X.exe` (portable)
- **macOS**: `Mosaic-X.X.X.dmg`, `Mosaic-X.X.X-mac.zip`

### Development Mode

```bash
# Run the app in development mode with hot reload
npm run electron:dev
```

This will start the Vite dev server and launch Electron with DevTools open.

## Creating a Release

### Automated Release via GitHub Actions

The easiest way to create a release is to push a Git tag:

```bash
# Create a new version tag
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

This will automatically:
1. Build the application for Windows, macOS, and Linux
2. Create a GitHub Release
3. Upload all installers to the release

The workflow runs on GitHub Actions and requires no local setup.

### Manual Release

If you need to manually publish a release:

```bash
# Set your GitHub token
export GH_TOKEN=your_github_token_here

# Build and publish
npm run electron:publish
```

This will build the application and upload it to GitHub Releases.

## Build Configuration

The Electron Builder configuration is in `package.json` under the `build` key:

```json
{
  "build": {
    "appId": "com.mosaic.app",
    "productName": "Mosaic",
    "directories": {
      "output": "release",
      "buildResources": "build"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"]
    },
    "mac": {
      "target": ["dmg", "zip"],
      "category": "public.app-category.productivity"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Utility"
    },
    "publish": {
      "provider": "github",
      "owner": "Yuxiang-Xiao",
      "repo": "mosaic"
    }
  }
}
```

### Customizing the Build

To change the build configuration:

1. **App ID**: Change `appId` to your unique identifier
2. **Product Name**: Change `productName` to your app name
3. **Targets**: Modify the `target` arrays for each platform
4. **Icons**: Replace files in the `build/` directory
5. **Publisher**: Update the `publish` section with your GitHub details

## Icons

Icons are located in the `build/` directory:
- `icon.png` - Linux icon (PNG format)
- `icon.ico` - Windows icon (ICO format)
- `icon.icns` - macOS icon (ICNS format)

To update icons, replace these files with your own.

## Package Scripts

- `npm run dev` - Run web version in development mode
- `npm run build` - Build web version and Electron main process
- `npm run electron:dev` - Run Electron app in development mode
- `npm run electron:build` - Build Electron installers
- `npm run electron:publish` - Build and publish to GitHub

## Troubleshooting

### Build Fails with "GH_TOKEN not set"

This is expected when building locally. The error occurs because Electron Builder detects CI environment and tries to publish. The build artifacts are still created successfully in the `release/` directory.

To avoid this warning, you can:
1. Set `GH_TOKEN` environment variable (not recommended for local builds)
2. Ignore the warning - the build still succeeds

### Port 3000 Already in Use

If you get a port conflict error when running `npm run electron:dev`:

1. Stop any other process using port 3000
2. Or modify `vite.config.ts` to use a different port, and update `electron/main.ts` accordingly

### Build Artifacts Too Large

Electron applications bundle Chromium, making them larger than native applications:
- Typical size: 100-200 MB per platform
- This is normal for Electron apps
- Users only download their platform's installer

## Platform-Specific Notes

### Windows

- NSIS installer provides standard installation experience
- Portable executable runs without installation
- Requires WebView2 (pre-installed on Windows 10/11)

### macOS

- DMG provides drag-to-Applications installation
- Code signing recommended for distribution (requires Apple Developer account)
- Notarization required for macOS 10.15+

### Linux

- AppImage is universal and works on most distributions
- .deb package for Debian/Ubuntu-based systems
- No installation required for AppImage

## Security

The Electron main process is configured with security best practices:
- `nodeIntegration: false` - Prevents Node.js access from renderer
- `contextIsolation: true` - Isolates preload scripts
- `sandbox: true` - Runs renderer in sandboxed environment

All user data is stored locally using browser localStorage API.
