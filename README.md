# DOSage

A TypeScript component library that recreates the aesthetic of classic DOS-era computer interfaces for modern web applications.

## Features

- 🎨 **Nostalgic DOS Aesthetic** - Blocky typography, high-contrast colors, and monospace fonts
- 📦 **Zero Dependencies** - Lightweight with minimal runtime dependencies
- 🎯 **TypeScript First** - Full type safety and IntelliSense support
- 🌈 **Themeable** - Multiple preset themes (DOS Blue, Amber, Green Phosphor, B&W) plus custom themes
- ♿ **Accessible** - Modern accessibility standards despite retro look
- 🎪 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS

## Quick Start

```bash
npm install dosage
```

### Basic Usage

```typescript
import { initTheme } from 'dosage';
import 'dosage/styles.css';

// Initialize with default DOS blue theme
initTheme('dos-blue');
```

### Custom Theme

```typescript
import { applyTheme } from 'dosage';

const customTheme = {
  name: 'My Theme',
  colors: {
    background: '#000000',
    foreground: '#00FF00',
    // ... more colors
  },
  fonts: {
    mono: '"Courier New", monospace'
  }
};

applyTheme(customTheme);
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start Kitchen Sink demo app
npm run dev

# Build the library
npm run build

# Run tests
npm test
```

### Project Structure

```
DOSage/
├── src/              # Component library source
├── kitchen-sink/     # Demo application
├── tests/            # Test files
├── dist/             # Build output
└── planning/         # Project planning documents
```

## Kitchen Sink Demo

The Kitchen Sink demo application showcases all DOSage components. Run `npm run dev` to see it in action at http://localhost:3000.

## Documentation

Visit the [documentation](./docs) for detailed API references and usage guides.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting PRs.

## License

MIT © Colin Maxwell

## Credits

Inspired by the golden age of DOS computing and the aesthetic of classic text-mode interfaces.
