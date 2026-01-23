# DOSage Project Foundation

> Architectural decisions for the DOSage TypeScript component library

---

## 1. Directory Structure

```
DOSage/
├── src/
│   ├── components/           # All UI components
│   │   ├── Button/
│   │   ├── TextInput/
│   │   ├── Menu/
│   │   ├── Dialog/
│   │   ├── ProgressBar/
│   │   └── ...
│   ├── core/                 # Core utilities and base classes
│   │   ├── Component.ts      # Base component class
│   │   ├── dom.ts            # DOM manipulation utilities
│   │   ├── events.ts         # Event handling utilities
│   │   └── index.ts
│   ├── themes/               # Theme definitions
│   │   ├── base.css          # CSS custom property definitions
│   │   ├── presets/          # Preset theme files
│   │   │   ├── dos-blue.css
│   │   │   ├── amber.css
│   │   │   ├── green-phosphor.css
│   │   │   └── cga.css
│   │   ├── ThemeManager.ts   # Runtime theme switching
│   │   └── index.ts
│   ├── styles/               # Global/shared styles
│   │   ├── reset.css         # Minimal CSS reset
│   │   ├── fonts.css         # Font-face declarations
│   │   └── global.css        # Global DOS aesthetic styles
│   ├── types/                # Shared TypeScript types
│   │   ├── common.ts         # Common types used across components
│   │   └── index.ts
│   └── index.ts              # Main entry point (exports all public API)
├── tests/                    # Test files (mirrors src/ structure)
│   ├── components/
│   │   ├── Button.test.ts
│   │   └── ...
│   ├── core/
│   └── themes/
├── demo/                     # Kitchen Sink demo application
│   ├── src/
│   │   ├── pages/            # Demo pages by category
│   │   ├── utils/            # Demo utilities (code display, etc.)
│   │   └── main.ts
│   ├── public/
│   │   └── fonts/            # DOS-style fonts
│   ├── index.html
│   └── vite.config.ts
├── dist/                     # Build output (gitignored)
│   ├── esm/                  # ES modules build
│   ├── cjs/                  # CommonJS build
│   ├── types/                # TypeScript declarations
│   └── css/                  # Compiled CSS
├── docs/                     # Documentation
│   ├── getting-started.md
│   ├── theming.md
│   ├── components/           # Per-component documentation
│   └── api/                  # Generated API docs
├── planning/                 # Project planning documents
├── .github/                  # GitHub workflows, templates
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts            # Library build config
├── vitest.config.ts          # Test config
└── README.md
```

**Key decisions:**
- **Co-located component files**: Each component has its own folder with all related files together
- **Separate tests directory**: Mirrors `src/` structure for easier test configuration and clearer separation
- **Demo as separate app**: Uses Vite for fast development, isolated from library build
- **Themes as CSS files**: Enables native CSS cascade and easy customization

---

## 2. Naming Conventions

### Component File Names
- **Pattern**: `PascalCase` matching component name
- **Examples**:
  - `Button.ts` - Main component logic
  - `Button.styles.css` - Component styles
  - `Button.types.ts` - TypeScript interfaces/types
  - `index.ts` - Barrel export

### CSS Class Names
- **Pattern**: `dos-{component}`, `dos-{component}--{modifier}`, `dos-{component}___{element}`
- **Prefix**: `dos-` (short, memorable, avoids conflicts)
- **Convention**: BEM-inspired with triple underscore for elements (visual distinction)
- **Examples**:
  ```
  .dos-button
  .dos-button--primary
  .dos-button--disabled
  .dos-button___icon
  .dos-menu
  .dos-menu___item
  .dos-menu___item--selected
  .dos-dialog
  .dos-dialog___title
  .dos-dialog___content
  .dos-dialog___footer
  ```

### TypeScript Interface Names
- **Pattern**: `{ComponentName}Props`, `{ComponentName}Options`, `{ComponentName}State`
- **No `I` prefix**: Modern TypeScript convention
- **Examples**:
  ```typescript
  ButtonProps
  ButtonOptions
  MenuItemConfig
  DialogState
  ThemeConfig
  DosageConfig
  ```

### CSS Custom Property Names
- **Pattern**: `--dos-{category}-{name}` or `--dos-{category}-{subcategory}-{name}`
- **Categories**: `color`, `font`, `space`, `size`, `border`, `cursor`, `timing`
- **Examples**:
  ```css
  --dos-color-bg
  --dos-color-fg
  --dos-color-primary
  --dos-color-border
  --dos-color-highlight
  --dos-color-shadow
  --dos-font-family
  --dos-font-size
  --dos-font-size-lg
  --dos-space-unit          /* Base grid unit (typically 8px) */
  --dos-space-xs
  --dos-space-sm
  --dos-space-md
  --dos-border-width
  --dos-cursor-blink-rate
  --dos-timing-fast
  --dos-timing-normal
  ```

### Test File Names
- **Pattern**: `{ComponentName}.test.ts`
- **Location**: `tests/` directory mirroring `src/`
- **Examples**:
  ```
  tests/components/Button.test.ts
  tests/core/Component.test.ts
  tests/themes/ThemeManager.test.ts
  ```

### Event Names
- **Pattern**: `dos:{component}:{action}` for custom events
- **Examples**:
  ```
  dos:button:click
  dos:menu:select
  dos:dialog:close
  dos:input:change
  ```

---

## 3. Component Architecture Pattern

Each component folder follows this structure:

```
src/components/Button/
├── Button.ts           # Main component class/logic
├── Button.styles.css   # Component-specific styles
├── Button.types.ts     # TypeScript interfaces and types
└── index.ts            # Barrel export
```

### File Responsibilities

**`Button.ts`** - Main component implementation:
```typescript
// Imports types, applies styles, exports component class
export class Button { ... }
```

**`Button.styles.css`** - Scoped styles:
```css
/* Uses CSS custom properties for theming */
/* All classes prefixed with dos- */
.dos-button { ... }
```

**`Button.types.ts`** - Type definitions:
```typescript
export interface ButtonProps { ... }
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

**`index.ts`** - Clean exports:
```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button.types';
```

### Rationale
- **Co-location**: All component code together for easy maintenance
- **Separate CSS files**: Native CSS, no runtime overhead, easy to override
- **Separate types file**: Clean imports, can be used independently
- **Barrel exports**: Clean public API, enables tree-shaking

---

## 4. Theming System Design

### CSS Custom Properties Structure

**Base theme file (`src/themes/base.css`):**
```css
:root, [data-dos-theme] {
  /* Colors */
  --dos-color-bg: #0000AA;
  --dos-color-fg: #FFFFFF;
  --dos-color-primary: #FFFF55;
  --dos-color-secondary: #55FFFF;
  --dos-color-border: #AAAAAA;
  --dos-color-highlight: #FFFFFF;
  --dos-color-shadow: #000000;
  --dos-color-disabled: #555555;
  --dos-color-error: #FF5555;
  --dos-color-success: #55FF55;
  
  /* Typography */
  --dos-font-family: 'DOS', 'Perfect DOS VGA 437', 'Consolas', monospace;
  --dos-font-size: 16px;
  --dos-font-size-sm: 14px;
  --dos-font-size-lg: 20px;
  --dos-line-height: 1.2;
  
  /* Spacing (grid-based, 8px unit) */
  --dos-space-unit: 8px;
  --dos-space-xs: calc(var(--dos-space-unit) * 0.5);   /* 4px */
  --dos-space-sm: var(--dos-space-unit);               /* 8px */
  --dos-space-md: calc(var(--dos-space-unit) * 2);     /* 16px */
  --dos-space-lg: calc(var(--dos-space-unit) * 3);     /* 24px */
  --dos-space-xl: calc(var(--dos-space-unit) * 4);     /* 32px */
  
  /* Borders */
  --dos-border-width: 2px;
  --dos-border-style: solid;
  
  /* Cursor */
  --dos-cursor-width: 0.6em;
  --dos-cursor-height: 1em;
  --dos-cursor-blink-rate: 530ms;
  
  /* Animation */
  --dos-timing-instant: 0ms;
  --dos-timing-fast: 100ms;
  --dos-timing-normal: 250ms;
}
```

### Theme Presets

**DOS Blue (default):**
```css
[data-dos-theme="dos-blue"] {
  --dos-color-bg: #0000AA;
  --dos-color-fg: #FFFFFF;
  --dos-color-primary: #FFFF55;
  --dos-color-border: #AAAAAA;
}
```

**Amber (monochrome amber CRT):**
```css
[data-dos-theme="amber"] {
  --dos-color-bg: #1A1000;
  --dos-color-fg: #FFB000;
  --dos-color-primary: #FFCC00;
  --dos-color-border: #805800;
}
```

**Green Phosphor (monochrome green CRT):**
```css
[data-dos-theme="green-phosphor"] {
  --dos-color-bg: #001100;
  --dos-color-fg: #00FF00;
  --dos-color-primary: #33FF33;
  --dos-color-border: #006600;
}
```

**CGA (4-color CGA palette):**
```css
[data-dos-theme="cga"] {
  --dos-color-bg: #000000;
  --dos-color-fg: #FFFFFF;
  --dos-color-primary: #FF55FF;
  --dos-color-secondary: #55FFFF;
  --dos-color-border: #AAAAAA;
}
```

### TypeScript Theme Interface

```typescript
interface ThemeColors {
  bg: string;
  fg: string;
  primary: string;
  secondary: string;
  border: string;
  highlight: string;
  shadow: string;
  disabled: string;
  error: string;
  success: string;
}

interface ThemeSpacing {
  unit: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface ThemeTypography {
  fontFamily: string;
  fontSize: string;
  fontSizeSm: string;
  fontSizeLg: string;
  lineHeight: string;
}

interface ThemeConfig {
  name: string;
  colors: Partial<ThemeColors>;
  spacing?: Partial<ThemeSpacing>;
  typography?: Partial<ThemeTypography>;
}

type ThemePreset = 'dos-blue' | 'amber' | 'green-phosphor' | 'cga';
```

### Runtime Theme Switching

```typescript
// ThemeManager API
class ThemeManager {
  static setTheme(theme: ThemePreset | string, scope?: HTMLElement): void;
  static getTheme(scope?: HTMLElement): string;
  static registerTheme(name: string, config: ThemeConfig): void;
  static applyCustomProperties(config: Partial<ThemeConfig>, scope?: HTMLElement): void;
}

// Usage
ThemeManager.setTheme('amber');                    // Apply to :root
ThemeManager.setTheme('green-phosphor', element);  // Apply to specific element
```

**Implementation approach:**
- Uses `data-dos-theme` attribute for theme selection
- Themes are pure CSS files that can be loaded on demand
- `ThemeManager` adds/removes attributes and can inject custom properties
- Supports scoped theming (different themes for different parts of page)

---

## 5. Build & Module System

### Bundler/Build Tool: **Vite** (library mode)

**Rationale:**
- Excellent TypeScript support out of the box
- Fast development with HMR
- Clean library mode for building distributable packages
- Handles CSS processing naturally
- Rollup-based output for optimized bundles

### CSS Handling: **Separate CSS files**

- Component CSS compiled and concatenated
- Output as separate `.css` file(s) in `dist/css/`
- Users import CSS separately: `import 'dosage/dist/css/dosage.css'`
- Also offer individual component CSS for selective imports

**Output structure:**
```
dist/
├── css/
│   ├── dosage.css          # All styles bundled
│   ├── dosage.min.css      # Minified
│   ├── themes/             # Individual theme files
│   │   ├── dos-blue.css
│   │   ├── amber.css
│   │   └── ...
│   └── components/         # Individual component styles
│       ├── button.css
│       └── ...
```

### Entry Point Structure

**Main entry (`src/index.ts`):**
```typescript
// Core
export { DosageConfig, init } from './core';

// Theme
export { ThemeManager } from './themes';
export type { ThemeConfig, ThemePreset } from './themes';

// Components (individual exports for tree-shaking)
export { Button } from './components/Button';
export { TextInput } from './components/TextInput';
export { Menu } from './components/Menu';
// ... all components

// Types
export type { ButtonProps, TextInputProps, MenuProps } from './types';
```

**Package.json exports field:**
```json
{
  "name": "dosage",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./css": "./dist/css/dosage.css",
    "./css/*": "./dist/css/*",
    "./themes/*": "./dist/css/themes/*"
  },
  "sideEffects": ["*.css"]
}
```

### ESM and CJS Support

**Build configuration produces:**
- `dist/esm/` - ES Modules (default for modern bundlers)
- `dist/cjs/` - CommonJS (Node.js, older bundlers)
- `dist/types/` - TypeScript declaration files

**Vite config approach:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      output: {
        preserveModules: true,  // For tree-shaking
        exports: 'named'
      }
    }
  }
});
```

---

## 6. Kitchen Sink Demo App

### Technology: **Vite + Vanilla TypeScript**

**Rationale:**
- Dogfooding: demonstrates the library without framework dependencies
- Fast development with HMR
- Shows pure TypeScript/JS usage patterns
- Easy to deploy as static site

### Demo Structure

```
demo/
├── src/
│   ├── pages/
│   │   ├── index.ts           # Home/overview
│   │   ├── buttons.ts         # Button variants
│   │   ├── inputs.ts          # Text inputs, checkboxes
│   │   ├── menus.ts           # Menus, dropdowns
│   │   ├── dialogs.ts         # Modal dialogs
│   │   ├── progress.ts        # Progress bars, loaders
│   │   ├── typography.ts      # Text styles
│   │   └── themes.ts          # Theme showcase
│   ├── components/
│   │   ├── CodeBlock.ts       # Displays source code
│   │   ├── DemoSection.ts     # Wrapper for demo examples
│   │   └── ThemePicker.ts     # Theme switching control
│   ├── utils/
│   │   ├── highlight.ts       # Syntax highlighting
│   │   └── router.ts          # Simple hash-based routing
│   └── main.ts
├── public/
│   └── fonts/
├── index.html
└── vite.config.ts
```

### Organization: **Single page with navigation**

- Hash-based routing (`#/buttons`, `#/menus`, etc.)
- Sidebar navigation (itself a DOSage component demo)
- Persistent theme picker in header
- DOS-style aesthetic throughout

### Code Display

Each demo section shows:
1. **Live example** - Interactive component
2. **HTML output** - Generated DOM structure
3. **TypeScript code** - How to create the component
4. **CSS customization** - Relevant CSS custom properties

**Implementation:**
```typescript
// DemoSection component
interface DemoSectionProps {
  title: string;
  description?: string;
  example: () => HTMLElement;
  code: string;
  cssVariables?: string[];
}
```

### Theme Switching

- `ThemePicker` component in demo header
- Dropdown/radio buttons showing all preset themes
- Custom theme builder section on themes page
- Persists selection to localStorage
- Applies via `ThemeManager.setTheme()`

---

## 7. Testing Strategy

### Test Framework: **Vitest**

**Rationale:**
- Native Vite integration (same config, fast)
- Jest-compatible API (familiar)
- Built-in TypeScript support
- jsdom for DOM testing

### What to Test for Each Component

1. **Rendering**
   - Component creates expected DOM structure
   - CSS classes are applied correctly
   - ARIA attributes are present

2. **Props/Options**
   - All props affect output correctly
   - Default values work
   - Invalid props are handled gracefully

3. **Interactivity**
   - Click/keyboard events fire correctly
   - State changes update DOM
   - Custom events dispatch with correct data

4. **Accessibility**
   - Keyboard navigation works
   - Focus management is correct
   - Screen reader announcements (aria-live)

5. **Theming**
   - Component respects CSS custom properties
   - Theme changes apply correctly

### Accessibility Testing

**Tools:**
- `vitest-axe` - Automated a11y violation detection
- Manual keyboard testing in demo app
- Screen reader testing checklist in docs

**Per-component a11y test:**
```typescript
import { axe } from 'vitest-axe';

it('should have no accessibility violations', async () => {
  const button = new Button({ label: 'Click me' });
  document.body.appendChild(button.element);
  const results = await axe(button.element);
  expect(results).toHaveNoViolations();
});
```

### Test File Structure

```
tests/
├── setup.ts                    # Global test setup (jsdom, etc.)
├── utils/
│   ├── render.ts               # Test rendering helpers
│   └── events.ts               # Event simulation helpers
├── components/
│   ├── Button.test.ts
│   ├── TextInput.test.ts
│   └── ...
├── core/
│   ├── Component.test.ts
│   └── dom.test.ts
└── themes/
    └── ThemeManager.test.ts
```

**Test file template:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('creates a button element', () => { ... });
    it('applies dos-button class', () => { ... });
  });

  describe('props', () => {
    it('sets label text', () => { ... });
    it('applies variant modifier class', () => { ... });
  });

  describe('events', () => {
    it('fires click event', () => { ... });
    it('supports keyboard activation', () => { ... });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => { ... });
    it('is focusable', () => { ... });
  });
});
```

---

## Summary

### All Directory Paths

| Path | Purpose |
|------|---------|
| `src/` | Source code root |
| `src/components/` | UI components |
| `src/core/` | Base classes and utilities |
| `src/themes/` | Theme CSS and ThemeManager |
| `src/themes/presets/` | Preset theme CSS files |
| `src/styles/` | Global/shared CSS |
| `src/types/` | Shared TypeScript types |
| `tests/` | Test files (mirrors src/) |
| `demo/` | Kitchen Sink demo app |
| `demo/src/pages/` | Demo pages by component category |
| `dist/` | Build output |
| `dist/esm/` | ES modules |
| `dist/cjs/` | CommonJS modules |
| `dist/types/` | TypeScript declarations |
| `dist/css/` | Compiled CSS |
| `docs/` | Documentation |

### All Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Component file | `PascalCase.ts` | `Button.ts` |
| Styles file | `PascalCase.styles.css` | `Button.styles.css` |
| Types file | `PascalCase.types.ts` | `Button.types.ts` |
| Test file | `PascalCase.test.ts` | `Button.test.ts` |
| CSS class | `dos-{component}` | `.dos-button` |
| CSS modifier | `dos-{component}--{modifier}` | `.dos-button--primary` |
| CSS element | `dos-{component}___{element}` | `.dos-menu___item` |
| CSS custom prop | `--dos-{category}-{name}` | `--dos-color-bg` |
| TS interface | `{Name}Props` | `ButtonProps` |
| TS type | `{Name}Type` | `ButtonVariant` |
| Custom event | `dos:{component}:{action}` | `dos:menu:select` |

### Key TypeScript Interfaces to Create

```typescript
// Core
interface DosageConfig { ... }
interface ComponentOptions { ... }

// Theme
interface ThemeConfig { ... }
interface ThemeColors { ... }
interface ThemeSpacing { ... }
interface ThemeTypography { ... }
type ThemePreset = 'dos-blue' | 'amber' | 'green-phosphor' | 'cga';

// Components
interface ButtonProps { ... }
interface TextInputProps { ... }
interface MenuProps { ... }
interface MenuItemConfig { ... }
interface DialogProps { ... }
interface ProgressBarProps { ... }

// Events
interface DosageEvent<T = unknown> { ... }
interface DosageEventMap { ... }
```

### Key CSS Custom Properties to Establish

```css
/* Colors (required for all themes) */
--dos-color-bg
--dos-color-fg
--dos-color-primary
--dos-color-secondary
--dos-color-border
--dos-color-highlight
--dos-color-shadow
--dos-color-disabled
--dos-color-error
--dos-color-success

/* Typography */
--dos-font-family
--dos-font-size
--dos-font-size-sm
--dos-font-size-lg
--dos-line-height

/* Spacing */
--dos-space-unit
--dos-space-xs
--dos-space-sm
--dos-space-md
--dos-space-lg
--dos-space-xl

/* Borders */
--dos-border-width
--dos-border-style

/* Cursor */
--dos-cursor-width
--dos-cursor-height
--dos-cursor-blink-rate

/* Animation */
--dos-timing-instant
--dos-timing-fast
--dos-timing-normal
```

---

## Next Steps

With these foundations established, the next phases should:

1. **Phase 0**: Set up repository with this directory structure
2. **Phase 1**: Implement build system and create base CSS/theme files
3. **Phase 2**: Create base `Component` class with common functionality
4. **Phase 3**: Implement first component (Button) as reference
5. **Phase 4+**: Additional components following established patterns
