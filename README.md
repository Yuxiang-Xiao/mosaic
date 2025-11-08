# Mosaic

A personal tracking application that uses a heatmap to visualize your progress and consistency. All data is stored locally.

## Desktop Application

Mosaic can be packaged as a desktop application using Electron, providing a native experience across multiple platforms.

### Prerequisites

- Node.js (v20 or later)

### Development

```bash
# Install dependencies
npm install

# Run in development mode (web)
npm run dev

# Run in Electron development mode (desktop)
npm run electron:dev
```

### Building

```bash
# Build web version
npm run build

# Build desktop executable
npm run electron:build
```

The desktop application will be built in `release/` with the following formats:
- Windows: `.exe` installer and portable executable
- macOS: `.dmg` and `.zip`
- Linux: `.AppImage` and `.deb`

### Release and Publish

To create a new release, push a tag with the format `v*` (e.g., `v1.0.0`):

```bash
git tag v1.0.0
git push origin v1.0.0
```

This will trigger the GitHub Actions workflow that builds the application for all platforms and creates a GitHub release with the installers.

You can also manually publish a release:

```bash
# Requires GH_TOKEN environment variable
npm run electron:publish
```
