# Mosaic

A personal tracking application that uses a heatmap to visualize your progress and consistency. All data is stored locally.

## Features

- 📊 Visual heatmap tracking for habits and goals
- 🌙 Dark/Light mode support
- 📱 Responsive design for desktop and mobile
- 💾 Local data storage with import/export functionality
- 🏷️ Multi-language support
- 🖼️ Custom window controls (minimize, maximize, close)
- 📅 Monthly and yearly view modes

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

## Data Storage

Mosaic stores all data locally in your browser using localStorage:

- **habits**: Your habit tracking data and check-in history
- **darkMode**: Your theme preference
- **language**: Your selected language

### Data Backup

You can export your data for backup:

1. Click the menu button in the sidebar
2. Select "Export" from the menu
3. Save the JSON file to your desired location

To import data:

1. Click the menu button in the sidebar
2. Select "Import" from the menu
3. Choose your previously exported JSON file

## Usage

1. **Create Habits**: Click the "+" button to add new habits you want to track
2. **Daily Check-ins**: Click the "Log Today" button to mark a habit as completed for the current day
3. **View Progress**: The heatmap visualization shows your consistency over time
4. **Archive Habits**: Use the archive feature to hide habits you're not actively tracking

## Customization

- **Theme**: Toggle between light and dark modes using the theme button in the sidebar
- **View Mode**: Switch between monthly and yearly heatmap views
- **Language**: Change the interface language (if multiple languages are available)

## Technical Details

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Desktop Framework**: Electron
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG icons

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions for improvement:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Changelog

### v1.0.6
- Fixed window controls display issue
- Improved Electron environment detection
- Updated package.json version number

### v1.0.5
- Hidden native scrollbars for cleaner UI
- Added custom scrollbar styling for scrollable elements
- Improved window controls functionality

### v1.0.2
- Updated application logo
- Implemented custom window controls
- Fixed version number display in releases

### v1.0.0
- Initial release
- Basic habit tracking functionality
- Heatmap visualization
- Dark/light mode support
