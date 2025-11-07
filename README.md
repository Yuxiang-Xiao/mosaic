# Mosaic

A personal tracking application that uses a heatmap to visualize your progress and consistency. All data is stored locally.

## Desktop Application

Mosaic can be packaged as a desktop application using Tauri, providing a native experience across multiple platforms.

### Prerequisites

- Node.js (v14 or later)
- Rust (latest stable version)
- System dependencies (Linux only):
  - `libgtk-3-dev`
  - `libwebkit2gtk-4.1-dev`
  - `libayatana-appindicator3-dev`
  - `librsvg2-dev`

### Development

```bash
# Install dependencies
npm install

# Run in development mode (web)
npm run dev

# Run in Tauri development mode (desktop)
npm run tauri:dev
```

### Building

```bash
# Build web version
npm run build

# Build desktop executable
npm run tauri:build
```

The desktop application will be built in `src-tauri/target/release/bundle/` with the following formats:
- Linux: `.deb`, `.rpm`, and standalone executable
- macOS: `.dmg` and `.app`
- Windows: `.exe` and `.msi`

The standalone executable is located at `src-tauri/target/release/mosaic` (or `mosaic.exe` on Windows).