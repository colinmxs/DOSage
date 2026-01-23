# Getting Started with DOSage

This guide will help you get started with DOSage, a TypeScript component library that recreates DOS-era interfaces.

## Installation

Install DOSage via npm:

```bash
npm install dosage
```

## Basic Setup

### 1. Import Styles

First, import the DOSage CSS in your application:

```typescript
import 'dosage/css';
```

Or in CSS:

```css
@import 'dosage/css';
```

### 2. Initialize Theme

Set up your preferred theme:

```typescript
import { ThemeManager, initTheme } from 'dosage';

// Option 1: Auto-initialize (uses saved preference or default)
initTheme();

// Option 2: Set specific theme
ThemeManager.setTheme('dos-blue');
```

### 3. Create Components

Import and use components:

```typescript
import { createButton, createPanel } from 'dosage';

// Create a panel
const panel = createPanel({
  title: 'My Application',
  borderStyle: 'double',
});

// Create a button
const button = createButton({
  label: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Button clicked!'),
});

// Add button to panel
panel.querySelector('.dos-panel___content')?.appendChild(button);

// Add panel to page
document.body.appendChild(panel);
```

## TypeScript Support

DOSage is written in TypeScript and provides comprehensive type definitions:

```typescript
import type { ButtonProps, PanelProps, ThemePreset } from 'dosage';

const buttonConfig: ButtonProps = {
  label: 'Submit',
  variant: 'primary',
  disabled: false,
};
```

## Framework Integration

### Vanilla JavaScript/TypeScript

DOSage works out of the box with vanilla JS/TS:

```typescript
import { createButton } from 'dosage';

const button = createButton({ label: 'Click' });
document.getElementById('app')?.appendChild(button);
```

### React

Wrap DOSage components in React components:

```tsx
import { useEffect, useRef } from 'react';
import { createButton } from 'dosage';
import type { ButtonProps } from 'dosage';

function DosButton(props: ButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = createButton(props);
    containerRef.current?.appendChild(button);

    return () => {
      button.remove();
    };
  }, [props]);

  return <div ref={containerRef} />;
}
```

### Vue

Use DOSage components in Vue:

```vue
<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { createButton } from 'dosage';

const container = ref<HTMLElement>();
let button: HTMLElement;

onMounted(() => {
  button = createButton({
    label: 'Click Me',
    onClick: () => console.log('Clicked!'),
  });
  container.value?.appendChild(button);
});

onUnmounted(() => {
  button?.remove();
});
</script>
```

## Next Steps

- Explore the [Component Documentation](./components/)
- Learn about [Theming](./theming.md)
- Check out the [API Reference](./api/)
- View the [Kitchen Sink Demo](../demo/)
