# DOSage

> A TypeScript component library recreating DOS-era interfaces for modern web applications.

[![CI Status](https://github.com/colinmxs/DOSage/actions/workflows/ci.yml/badge.svg)](https://github.com/colinmxs/DOSage/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dosage.svg)](https://www.npmjs.com/package/dosage)
[![npm downloads](https://img.shields.io/npm/dm/dosage.svg)](https://www.npmjs.com/package/dosage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ██████╗  ██████╗ ███████╗ █████╗  ██████╗ ███████╗              ║
║   ██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔════╝ ██╔════╝              ║
║   ██║  ██║██║   ██║███████╗███████║██║  ███╗█████╗                ║
║   ██║  ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══╝                ║
║   ██████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝███████╗              ║
║   ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Features

- **Pure TypeScript** — Full type safety with comprehensive type definitions
- **Zero Dependencies** — No runtime dependencies, minimal footprint
- **Framework Agnostic** — Works with vanilla JS/TS, React, Vue, or any framework
- **Accessible** — Full ARIA support and keyboard navigation
- **Themeable** — Multiple preset themes + custom theme support
- **DOS Authentic** — Faithful recreation of DOS-era aesthetics

## Installation

```bash
npm install dosage
```

## Quick Start

```typescript
import { createButton, ThemeManager } from 'dosage';
import 'dosage/css';

// Initialize theme
ThemeManager.setTheme('dos-blue');

// Create a button
const button = createButton({
  label: 'Click Me!',
  variant: 'primary',
  onClick: () => alert('Hello, DOS!'),
});

document.body.appendChild(button);
```

## Themes

DOSage includes several preset themes:

| Theme | Description |
|-------|-------------|
| `dos-blue` | Classic DOS blue screen (default) |
| `amber` | Amber monochrome monitor |
| `green-phosphor` | Green phosphor CRT |
| `cga` | IBM CGA 16-color palette |

```typescript
import { ThemeManager } from 'dosage';

// Set theme
ThemeManager.setTheme('amber');

// Get current theme
const current = ThemeManager.getTheme();

// Register custom theme
ThemeManager.registerTheme('my-theme', {
  name: 'my-theme',
  colors: {
    bg: '#1a1a2e',
    fg: '#eee',
    // ...
  },
  // ...
});
```

## Components

### Layout
- Container
- Panel
- Box
- Grid
- Divider
- Separator

### Typography
- Heading
- Text
- Code
- CodeBlock
- Blockquote
- List
- DefinitionList
- Label
- ASCIIArt

### Form Controls
- Button
- ButtonGroup
- IconButton
- Link
- TextInput
- Textarea
- Checkbox
- RadioButton
- Select
- Slider

### Feedback
- Alert
- Toast
- ProgressBar
- Spinner
- Skeleton
- Tooltip

### Navigation
- Menu
- ContextMenu
- Tabs
- Breadcrumb
- Pagination

### Data Display
- Table
- Card
- Badge
- Avatar
- Window
- Dialog

## Accessibility

All components are built with accessibility in mind:

- Full keyboard navigation
- ARIA attributes
- High contrast focus states
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Install dependencies
npm install

# Start demo server
npm run dev

# Run tests
npm test

# Build library
npm run build
```

## License

MIT © DOSage Contributors

---

*Bringing the nostalgic DOS aesthetic to modern web applications* 💾
