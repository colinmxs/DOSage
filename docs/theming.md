# DOSage Theming Guide

DOSage uses CSS custom properties for theming, allowing easy customization while maintaining the DOS aesthetic. This guide covers everything you need to know about theming in DOSage.

## Table of Contents

- [Preset Themes](#preset-themes)
- [Using ThemeManager](#using-thememanager)
- [Custom Themes](#custom-themes)
- [CSS Custom Properties Reference](#css-custom-properties-reference)
- [Scoped Themes](#scoped-themes)
- [Dark/Light Mode Support](#darklight-mode-support)
- [Theme Playground](#theme-playground)

---

## Preset Themes

DOSage includes four preset themes that capture different eras and styles of vintage computing:

### DOS Blue (Default)

The classic IBM DOS blue screen aesthetic. This is the default theme that most users will recognize from classic PC computing.

```typescript
import { ThemeManager } from 'dosage';

ThemeManager.setTheme('dos-blue');
```

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#0000AA` | Deep blue |
| Foreground | `#FFFFFF` | White text |
| Primary | `#FFFF55` | Yellow highlights |
| Secondary | `#55FFFF` | Cyan accents |
| Border | `#AAAAAA` | Gray borders |

**Best for:** General use, applications that want the classic DOS look.

---

### Amber Monochrome

Emulates vintage amber monochrome monitors popular in the early 1980s. Creates a warm, nostalgic feel.

```typescript
ThemeManager.setTheme('amber');
```

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#1A1000` | Dark brown |
| Foreground | `#FFB000` | Amber |
| Primary | `#FFCC00` | Bright amber |
| Border | `#805800` | Dark amber |

**Best for:** Terminal-style applications, retro computer simulations.

---

### Green Phosphor

Classic green phosphor CRT look, reminiscent of early terminals and computers.

```typescript
ThemeManager.setTheme('green-phosphor');
```

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#001100` | Dark green |
| Foreground | `#00FF00` | Green |
| Primary | `#33FF33` | Bright green |
| Border | `#006600` | Dark green |

**Best for:** Terminal emulators, hacker aesthetic, matrix-style interfaces.

---

### CGA

IBM Color Graphics Adapter palette with its distinctive 16-color palette.

```typescript
ThemeManager.setTheme('cga');
```

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#000000` | Black |
| Foreground | `#FFFFFF` | White |
| Primary | `#FF55FF` | Magenta |
| Secondary | `#55FFFF` | Cyan |
| Border | `#AAAAAA` | Gray |

**Best for:** Gaming interfaces, colorful retro applications.

---

## Using ThemeManager

ThemeManager provides static methods for managing themes at runtime.

### Set Theme

Apply a theme globally or to a specific element:

```typescript
import { ThemeManager } from 'dosage';

// Set theme globally (applies to document root)
ThemeManager.setTheme('amber');

// Set theme for a specific container
const container = document.getElementById('my-container');
ThemeManager.setTheme('green-phosphor', container);
```

### Get Current Theme

Retrieve the currently active theme:

```typescript
const currentTheme = ThemeManager.getTheme();
console.log(currentTheme); // 'dos-blue'

// Get theme for specific element
const containerTheme = ThemeManager.getTheme(container);
```

### Theme Persistence

Themes are automatically persisted to localStorage. On page load, the saved theme preference is restored:

```typescript
import { initTheme } from 'dosage';

// Call this on app startup to restore saved theme
initTheme();
```

The theme is saved under the key `dos-theme` in localStorage.

### Theme Change Events

Listen for theme changes:

```typescript
document.addEventListener('dos:theme:change', (event) => {
  const { theme, scope } = event.detail;
  console.log(`Theme changed to: ${theme}`);
});
```

---

## Custom Themes

Create your own themes to match your application's branding.

### Register a Custom Theme

```typescript
import { ThemeManager } from 'dosage';
import type { ThemeConfig } from 'dosage';

const cyberpunkTheme: ThemeConfig = {
  name: 'cyberpunk',
  colors: {
    bg: '#0d0221',
    fg: '#ff00ff',
    primary: '#00ffff',
    secondary: '#ff00ff',
    border: '#660066',
    highlight: '#ffffff',
    shadow: '#000000',
    disabled: '#333333',
    error: '#ff0000',
    success: '#00ff00',
  },
  spacing: {
    unit: '8px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: "'Perfect DOS VGA 437', monospace",
    fontSize: '16px',
    fontSizeSm: '14px',
    fontSizeLg: '18px',
    lineHeight: '1.4',
  },
};

// Register the theme
ThemeManager.registerTheme('cyberpunk', cyberpunkTheme);

// Now use it
ThemeManager.setTheme('cyberpunk');
```

### Creating a Theme CSS File

For themes you want to ship with your application, create a CSS file:

```css
/* my-theme.css */
[data-dos-theme="my-theme"] {
  --dos-color-bg: #1a1a2e;
  --dos-color-fg: #eee;
  --dos-color-primary: #e94560;
  --dos-color-secondary: #16213e;
  --dos-color-border: #533483;
  --dos-color-highlight: #ffffff;
  --dos-color-shadow: #000000;
  --dos-color-disabled: #4a4a4a;
  --dos-color-error: #ff4444;
  --dos-color-success: #00ff00;
}
```

Import the CSS file and apply:

```typescript
import './my-theme.css';
import { ThemeManager } from 'dosage';

ThemeManager.setTheme('my-theme');
```

### Override Specific Properties

Apply partial theme changes without creating a full theme:

```typescript
ThemeManager.applyCustomProperties({
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
});
```

This is useful for:
- A/B testing color schemes
- User preference customization
- Dynamic branding

---

## CSS Custom Properties Reference

All theme values are exposed as CSS custom properties.

### Colors

| Property | Description | Default (DOS Blue) |
|----------|-------------|-------------------|
| `--dos-color-bg` | Background color | `#0000AA` |
| `--dos-color-fg` | Foreground/text color | `#FFFFFF` |
| `--dos-color-primary` | Primary accent color | `#FFFF55` |
| `--dos-color-secondary` | Secondary accent color | `#55FFFF` |
| `--dos-color-border` | Border color | `#AAAAAA` |
| `--dos-color-highlight` | Highlight/selection color | `#FFFFFF` |
| `--dos-color-shadow` | Shadow color | `#000000` |
| `--dos-color-disabled` | Disabled state color | `#555555` |
| `--dos-color-error` | Error/danger color | `#FF5555` |
| `--dos-color-success` | Success color | `#55FF55` |

### Typography

| Property | Description | Default |
|----------|-------------|---------|
| `--dos-font-family` | Font family | `'Perfect DOS VGA 437', monospace` |
| `--dos-font-size` | Base font size | `16px` |
| `--dos-font-size-sm` | Small font size | `14px` |
| `--dos-font-size-lg` | Large font size | `18px` |
| `--dos-line-height` | Line height | `1.4` |

### Spacing

| Property | Description | Default |
|----------|-------------|---------|
| `--dos-space-unit` | Base spacing unit | `8px` |
| `--dos-space-xs` | Extra small | `4px` |
| `--dos-space-sm` | Small | `8px` |
| `--dos-space-md` | Medium | `16px` |
| `--dos-space-lg` | Large | `24px` |
| `--dos-space-xl` | Extra large | `32px` |

### Borders

| Property | Description | Default |
|----------|-------------|---------|
| `--dos-border-width` | Border width | `1px` |
| `--dos-border-style` | Border style | `solid` |

### Animation

| Property | Description | Default |
|----------|-------------|---------|
| `--dos-cursor-blink-rate` | Cursor blink rate | `530ms` |
| `--dos-timing-instant` | Instant timing | `0ms` |
| `--dos-timing-fast` | Fast timing | `100ms` |
| `--dos-timing-normal` | Normal timing | `200ms` |

### Using Custom Properties

Use these properties in your own CSS:

```css
.my-custom-element {
  background-color: var(--dos-color-bg);
  color: var(--dos-color-fg);
  border: var(--dos-border-width) solid var(--dos-color-border);
  padding: var(--dos-space-md);
  font-family: var(--dos-font-family);
  font-size: var(--dos-font-size);
}

.my-custom-element:hover {
  background-color: var(--dos-color-highlight);
  color: var(--dos-color-bg);
}

.my-custom-element:disabled {
  color: var(--dos-color-disabled);
}
```

---

## Scoped Themes

Apply different themes to different parts of your application:

### HTML Approach

```html
<div data-dos-theme="dos-blue">
  <!-- Blue themed content -->
  <p>This section uses the DOS Blue theme</p>
</div>

<div data-dos-theme="amber">
  <!-- Amber themed content -->
  <p>This section uses the Amber theme</p>
</div>
```

### JavaScript Approach

```typescript
const mainArea = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar');

ThemeManager.setTheme('dos-blue', mainArea);
ThemeManager.setTheme('amber', sidebar);
```

### Nested Themes

Themes can be nested - inner themes override outer themes:

```html
<div data-dos-theme="dos-blue">
  <p>Blue theme</p>
  
  <div data-dos-theme="green-phosphor">
    <p>Green theme (nested)</p>
  </div>
  
  <p>Back to blue theme</p>
</div>
```

---

## Dark/Light Mode Support

### System Preference Detection

Respond to the user's system preference:

```typescript
import { ThemeManager, initTheme } from 'dosage';

function setupThemeWithSystemPreference() {
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Map to DOSage themes
  // Note: All DOSage themes are "dark" by nature, but you could
  // create light variants for accessibility
  const theme = prefersDark ? 'dos-blue' : 'dos-blue'; // Customize as needed
  
  ThemeManager.setTheme(theme);
}

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    const theme = e.matches ? 'dos-blue' : 'cga';
    ThemeManager.setTheme(theme);
  });
```

### Manual Theme Toggle

Create a theme toggle button:

```typescript
import { createButton, ThemeManager } from 'dosage';

const themes = ['dos-blue', 'amber', 'green-phosphor', 'cga'];
let currentIndex = 0;

const toggleButton = createButton({
  label: '[ ] Toggle Theme',
  onClick: () => {
    currentIndex = (currentIndex + 1) % themes.length;
    ThemeManager.setTheme(themes[currentIndex]);
    toggleButton.textContent = `Theme: ${themes[currentIndex]}`;
  }
});
```

### High Contrast Mode

For users who need higher contrast, consider creating a high-contrast theme:

```css
[data-dos-theme="high-contrast"] {
  --dos-color-bg: #000000;
  --dos-color-fg: #FFFFFF;
  --dos-color-primary: #FFFF00;
  --dos-color-secondary: #00FFFF;
  --dos-color-border: #FFFFFF;
  --dos-color-highlight: #FFFFFF;
  --dos-color-error: #FF0000;
  --dos-color-success: #00FF00;
}
```

---

## Theme Playground

The Kitchen Sink demo includes an interactive theme playground where you can:

1. **Preview all preset themes** - See components in each theme
2. **Customize colors** - Adjust individual color values in real-time
3. **Export custom themes** - Generate CSS for your custom theme

### Using the Theme Picker

The demo app includes a theme picker in the header:

```typescript
import { createThemePicker } from './components/ThemePicker';

const picker = createThemePicker();
document.querySelector('.header').appendChild(picker);
```

### Building Your Own Theme Picker

```typescript
import { createSelect, ThemeManager } from 'dosage';
import type { ThemePreset } from 'dosage';

const themes: { value: ThemePreset; label: string }[] = [
  { value: 'dos-blue', label: 'DOS Blue' },
  { value: 'amber', label: 'Amber' },
  { value: 'green-phosphor', label: 'Green Phosphor' },
  { value: 'cga', label: 'CGA' },
];

const themePicker = createSelect({
  label: 'Theme',
  value: ThemeManager.getTheme(),
  options: themes,
  onChange: (value) => {
    ThemeManager.setTheme(value as ThemePreset);
  }
});
```

---

## Best Practices

### 1. Initialize Theme Early

Call `initTheme()` as early as possible to prevent flash of unstyled content:

```typescript
// At the top of your main entry file
import { initTheme } from 'dosage';
initTheme();
```

### 2. Use CSS Custom Properties

Always use the CSS custom properties instead of hardcoding colors:

```css
/* ✅ Good */
.my-button {
  background: var(--dos-color-primary);
}

/* ❌ Bad */
.my-button {
  background: #FFFF55;
}
```

### 3. Test All Themes

Ensure your custom components look good in all themes:

```typescript
const themes = ['dos-blue', 'amber', 'green-phosphor', 'cga'];
themes.forEach(theme => {
  ThemeManager.setTheme(theme);
  // Visually verify your components
});
```

### 4. Respect User Preferences

Store and restore theme preferences:

```typescript
// initTheme() handles this automatically, but for custom logic:
const savedTheme = localStorage.getItem('dos-theme');
if (savedTheme) {
  ThemeManager.setTheme(savedTheme);
}
```

### 5. Provide Theme Context

When using scoped themes, document which theme is expected:

```html
<!-- This component expects the amber theme for terminal-like appearance -->
<div data-dos-theme="amber" class="terminal-widget">
  ...
</div>
```

---

## Troubleshooting

### Theme Not Applying

1. Ensure CSS is imported: `import 'dosage/css'`
2. Check that `data-dos-theme` attribute is set on the element
3. Verify the theme name is correct (case-sensitive)

### Theme Flashing on Load

1. Call `initTheme()` before rendering
2. Add theme attribute in HTML: `<html data-dos-theme="dos-blue">`
3. Use CSS to set initial background color

### Custom Properties Not Working

1. Ensure you're targeting the correct scope
2. Check for CSS specificity issues
3. Verify the property name (use browser DevTools)

---

## Migration Guide

### From Inline Styles to Theme System

Before:
```typescript
element.style.backgroundColor = '#0000AA';
element.style.color = '#FFFFFF';
```

After:
```css
.my-element {
  background-color: var(--dos-color-bg);
  color: var(--dos-color-fg);
}
```

### From Hardcoded Colors to Custom Properties

1. Identify all color values in your CSS
2. Map to corresponding `--dos-color-*` properties
3. Replace hardcoded values with `var()` functions
4. Test with all preset themes

---

*Last updated: January 2026*
