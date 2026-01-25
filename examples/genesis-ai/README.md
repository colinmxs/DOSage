# Genesis AI

> A retro-styled AI chatbot interface built with DOSage

Genesis AI is the flagship example project for the DOSage component library, demonstrating how to build a complete, functional web application using authentic DOS aesthetics.

![Genesis AI Screenshot](screenshot.png)

## Features

- 🖥️ **Authentic DOS Look** - True to the DOS aesthetic with box-drawing characters and monospace fonts
- 💬 **Chat Interface** - Full chat UI with message bubbles, typing indicators, and code blocks
- 📁 **Conversation Management** - Create, switch, and export conversations
- 🎨 **Theme Support** - Choose from DOS Blue, Amber, Green Phosphor, and CGA themes
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation with command palette
- 💾 **Local Storage** - All conversations persist locally in your browser

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or pnpm

### Installation

From the DOSage root directory:

```bash
# Install dependencies
npm install

# Navigate to genesis-ai
cd examples/genesis-ai

# Install example dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New conversation |
| `Ctrl+K` | Open command palette |
| `Ctrl+,` | Open settings |
| `Ctrl+Enter` | Send message |
| `Ctrl+E` | Export conversation |
| `Ctrl+L` | Clear current chat |
| `F1` | Show help |
| `F9` | Toggle sidebar |

## Project Structure

```
genesis-ai/
├── index.html              # Entry point
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite bundler config
└── src/
    ├── main.ts             # Application bootstrap
    ├── app.ts              # Main orchestrator
    ├── config.ts           # Configuration constants
    ├── types.ts            # TypeScript interfaces
    ├── styles.css          # Minimal CSS resets
    ├── components/
    │   ├── chat/           # Chat interface components
    │   ├── layout/         # Header, StatusBar
    │   ├── modals/         # Settings, About, Help
    │   └── sidebar/        # Conversation list
    ├── services/
    │   ├── ChatService.ts  # Mock AI responses
    │   └── StorageService.ts # LocalStorage persistence
    └── utils/
        └── formatters.ts   # Helper utilities
```

## Components Used

Genesis AI showcases 30+ DOSage components including:

- **Layout**: `SplitPane`, `Panel`, `Box`, `Container`, `ScrollArea`
- **Navigation**: `MenuBar`, `CommandPalette`
- **Forms**: `Textarea`, `TextInput`, `Toggle`, `RadioButton`
- **Feedback**: `Modal`, `Toast`, `LoadingSpinner`, `ProgressBar`
- **Data Display**: `Card`, `Avatar`, `Badge`, `ListBox`, `EmptyState`
- **Typography**: `Text`, `CodeBlock`

## Themes

Switch between themes using Settings (Ctrl+,) or the command palette (Ctrl+K):

- **DOS Blue** - Classic DOS blue background
- **Amber** - Amber monochrome terminal
- **Green Phosphor** - Green CRT monitor look
- **CGA** - CGA cyan palette

## Built With

- [DOSage](https://github.com/example/dosage) - DOS-style UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## License

MIT License - See the main DOSage repository for details.
