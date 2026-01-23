# DOSage Theming Guide

DOSage uses CSS custom properties for theming, allowing easy customization while maintaining the DOS aesthetic.

## Preset Themes

DOSage includes four preset themes:

### DOS Blue (Default)

The classic IBM DOS blue screen aesthetic.

```typescript
ThemeManager.setTheme('dos-blue');
```

- Background: `#0000AA` (Deep Blue)
- Foreground: `#FFFFFF` (White)
- Primary: `#FFFF55` (Yellow)
- Secondary: `#55FFFF` (Cyan)

### Amber Monochrome

Emulates vintage amber monochrome monitors.

```typescript
ThemeManager.setTheme('amber');
```

- Background: `#1A1000` (Dark Brown)
- Foreground: `#FFB000` (Amber)
- Primary: `#FFCC00` (Bright Amber)

### Green Phosphor

Classic green phosphor CRT look.

```typescript
ThemeManager.setTheme('green-phosphor');
```

- Background: `#001100` (Dark Green)
- Foreground: `#00FF00` (Green)
- Primary: `#33FF33` (Bright Green)

### CGA

IBM Color Graphics Adapter palette.

```typescript
ThemeManager.setTheme('cga');
```

- Background: `#000000` (Black)
- Foreground: `#FFFFFF` (White)
- Primary: `#FF55FF` (Magenta)
- Secondary: `#55FFFF` (Cyan)

## Using ThemeManager

### Set Theme

```typescript
import { ThemeManager } from 'dosage';

// Set globally
ThemeManager.setTheme('amber');

// Set for specific element
const container = document.getElementById('my-container');
ThemeManager.setTheme('green-phosphor', container);
```

### Get Current Theme

```typescript
const currentTheme = ThemeManager.getTheme();
console.log(currentTheme); // 'dos-blue'
```

### Theme Persistence

Themes are automatically persisted to localStorage:

```typescript
import { initTheme } from 'dosage';

// On app start, restore saved theme or use default
initTheme();
```

## Custom Themes

### Register a Custom Theme

```typescript
ThemeManager.registerTheme('cyberpunk', {
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
});

// Use the custom theme
ThemeManager.setTheme('cyberpunk');
```

### Override Specific Properties

```typescript
ThemeManager.applyCustomProperties({
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
});
```

## CSS Custom Properties Reference

All theme values are available as CSS custom properties:

### Colors

```css
--dos-color-bg          /* Background color */
--dos-color-fg          /* Foreground/text color */
--dos-color-primary     /* Primary accent color */
--dos-color-secondary   /* Secondary accent color */
--dos-color-border      /* Border color */
--dos-color-highlight   /* Highlight/selection color */
--dos-color-shadow      /* Shadow color */
--dos-color-disabled    /* Disabled state color */
--dos-color-error       /* Error/danger color */
--dos-color-success     /* Success color */
```

### Typography

```css
--dos-font-family       /* Font family */
--dos-font-size         /* Base font size */
--dos-font-size-sm      /* Small font size */
--dos-font-size-lg      /* Large font size */
--dos-line-height       /* Line height */
```

### Spacing

```css
--dos-space-unit        /* Base spacing unit (8px) */
--dos-space-xs          /* Extra small (4px) */
--dos-space-sm          /* Small (8px) */
--dos-space-md          /* Medium (16px) */
--dos-space-lg          /* Large (24px) */
--dos-space-xl          /* Extra large (32px) */
```

### Animation

```css
--dos-cursor-blink-rate /* Cursor blink rate */
--dos-timing-instant    /* Instant (0ms) */
--dos-timing-fast       /* Fast (100ms) */
--dos-timing-normal     /* Normal (200ms) */
```

## Using CSS Custom Properties

You can use these properties in your own styles:

```css
.my-custom-element {
  background-color: var(--dos-color-bg);
  color: var(--dos-color-fg);
  border: var(--dos-border-width) solid var(--dos-color-border);
  padding: var(--dos-space-md);
  font-family: var(--dos-font-family);
}
```

## Scoped Themes

Apply different themes to different parts of your app:

```html
<div data-dos-theme="dos-blue">
  <!-- Blue themed content -->
</div>

<div data-dos-theme="amber">
  <!-- Amber themed content -->
</div>
```

```typescript
const blueSection = document.querySelector('[data-dos-theme="dos-blue"]');
const amberSection = document.querySelector('[data-dos-theme="amber"]');

ThemeManager.setTheme('dos-blue', blueSection);
ThemeManager.setTheme('amber', amberSection);
```
