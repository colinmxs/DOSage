# Getting Started with DOSage

This guide will help you get started with DOSage, a TypeScript component library that recreates DOS-era interfaces for modern web applications.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [First Component](#first-component)
- [Adding Styles](#adding-styles)
- [Theming Basics](#theming-basics)
- [Framework Integration](#framework-integration)
- [Next Steps](#next-steps)

---

## Prerequisites

Before installing DOSage, ensure you have:

- **Node.js:** Version 18.0.0 or higher
- **npm:** Version 9.0.0 or higher (or yarn/pnpm)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

---

## Installation

### npm

```bash
npm install dosage
```

### yarn

```bash
yarn add dosage
```

### pnpm

```bash
pnpm add dosage
```

### CDN Usage

For quick prototyping or simple projects, you can use DOSage via CDN:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://unpkg.com/dosage/dist/css/dosage.css">

<!-- Include the JavaScript -->
<script type="module">
  import { createButton, ThemeManager } from 'https://unpkg.com/dosage/dist/esm/index.js';
  
  ThemeManager.setTheme('dos-blue');
  
  const button = createButton({
    label: 'Click Me',
    onClick: () => alert('Hello, DOS!')
  });
  
  document.body.appendChild(button);
</script>
```

---

## Basic Setup

### 1. Import Styles

First, import the DOSage CSS in your application entry point:

**In TypeScript/JavaScript:**

```typescript
import 'dosage/css';
```

**In CSS:**

```css
@import 'dosage/css';
```

**In HTML:**

```html
<link rel="stylesheet" href="node_modules/dosage/dist/css/dosage.css">
```

### 2. Initialize Theme

Set up your preferred theme:

```typescript
import { ThemeManager, initTheme } from 'dosage';

// Option 1: Auto-initialize (uses saved preference or default)
initTheme();

// Option 2: Set a specific theme
ThemeManager.setTheme('dos-blue');
```

Available preset themes:
- `dos-blue` - Classic DOS blue (default)
- `amber` - Amber monochrome monitor
- `green-phosphor` - Green CRT terminal
- `cga` - IBM CGA color palette

### 3. Set HTML Structure

Add the theme attribute to your HTML for immediate styling:

```html
<!DOCTYPE html>
<html lang="en" data-dos-theme="dos-blue">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My DOS App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/main.ts"></script>
</body>
</html>
```

---

## First Component

Let's create your first DOSage component - a simple button:

```typescript
import { createButton } from 'dosage';

// Create a button
const button = createButton({
  label: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Button clicked!')
});

// Add to the page
document.getElementById('app')?.appendChild(button);
```

### Component Structure

Most DOSage components follow this pattern:

```typescript
import { createComponentName } from 'dosage';
import type { ComponentNameProps } from 'dosage';

// Define props
const props: ComponentNameProps = {
  // Required props
  label: 'Example',
  
  // Optional props with defaults
  variant: 'primary',
  disabled: false,
  
  // Event handlers
  onClick: () => { /* handle click */ }
};

// Create the component
const element = createComponentName(props);

// Add to DOM
container.appendChild(element);
```

---

## Adding Styles

### Using CSS Custom Properties

DOSage uses CSS custom properties for all colors, spacing, and typography. You can use these in your own styles:

```css
.my-custom-widget {
  /* Colors */
  background-color: var(--dos-color-bg);
  color: var(--dos-color-fg);
  border-color: var(--dos-color-border);
  
  /* Spacing */
  padding: var(--dos-space-md);
  margin-bottom: var(--dos-space-lg);
  
  /* Typography */
  font-family: var(--dos-font-family);
  font-size: var(--dos-font-size);
}
```

### Component Classes

All DOSage components use predictable CSS classes:

- `.dos-button` - Button component
- `.dos-button--primary` - Primary variant
- `.dos-button--disabled` - Disabled state
- `.dos-panel___content` - Panel content area

---

## Theming Basics

### Switching Themes

```typescript
import { ThemeManager } from 'dosage';

// Set theme globally
ThemeManager.setTheme('amber');

// Set theme for specific element
const section = document.getElementById('terminal-section');
ThemeManager.setTheme('green-phosphor', section);
```

### Getting Current Theme

```typescript
const currentTheme = ThemeManager.getTheme();
console.log(currentTheme); // 'dos-blue'
```

### Theme Persistence

Themes are automatically saved to localStorage. When the user returns, their preference is restored:

```typescript
import { initTheme } from 'dosage';

// Call on app startup
initTheme(); // Restores saved theme or uses default
```

For more theming options, see the [Theming Guide](./theming.md).

---

## Framework Integration

DOSage is framework-agnostic and works with any JavaScript framework.

### Vanilla JavaScript/TypeScript

DOSage works directly with vanilla JS/TS:

```typescript
import { createButton, createPanel } from 'dosage';

// Create a panel with a button inside
const panel = createPanel({
  title: 'Welcome',
  borderStyle: 'double'
});

const button = createButton({
  label: 'Get Started',
  variant: 'primary',
  onClick: () => navigate('/dashboard')
});

// Add button to panel content
panel.querySelector('.dos-panel___content')?.appendChild(button);

// Add panel to page
document.getElementById('app')?.appendChild(panel);
```

### React

Wrap DOSage components in React components:

```tsx
import { useEffect, useRef, FC } from 'react';
import { createButton } from 'dosage';
import type { ButtonProps } from 'dosage';

interface DosButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => void;
}

const DosButton: FC<DosButtonProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const button = createButton({
      ...props,
      onClick: props.onClick
    });
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(button);

    return () => {
      button.remove();
    };
  }, [props]);

  return <div ref={containerRef} />;
};

// Usage
function App() {
  return (
    <DosButton 
      label="Click Me" 
      variant="primary"
      onClick={() => console.log('Clicked!')} 
    />
  );
}
```

### Vue 3

Use DOSage components in Vue with Composition API:

```vue
<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { createButton } from 'dosage';
import type { ButtonProps } from 'dosage';

const props = defineProps<{
  label: string;
  variant?: ButtonProps['variant'];
}>();

const emit = defineEmits<{
  click: [];
}>();

const containerRef = ref<HTMLElement | null>(null);
let buttonElement: HTMLElement | null = null;

function renderButton() {
  if (!containerRef.value) return;
  
  if (buttonElement) {
    buttonElement.remove();
  }
  
  buttonElement = createButton({
    label: props.label,
    variant: props.variant,
    onClick: () => emit('click')
  });
  
  containerRef.value.appendChild(buttonElement);
}

onMounted(renderButton);
watch(() => props, renderButton, { deep: true });
onUnmounted(() => buttonElement?.remove());
</script>
```

### Svelte

Use DOSage components in Svelte:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createButton } from 'dosage';
  import type { ButtonProps } from 'dosage';
  
  export let label: string;
  export let variant: ButtonProps['variant'] = 'secondary';
  export let onClick: () => void = () => {};
  
  let container: HTMLElement;
  let button: HTMLElement;
  
  onMount(() => {
    button = createButton({ label, variant, onClick });
    container.appendChild(button);
  });
  
  onDestroy(() => {
    button?.remove();
  });
</script>

<div bind:this={container}></div>
```

### Angular

Use DOSage components in Angular:

```typescript
// dos-button.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { createButton } from 'dosage';
import type { ButtonProps } from 'dosage';

@Component({
  selector: 'dos-button',
  template: ''
})
export class DosButtonComponent implements OnInit, OnDestroy {
  @Input() label!: string;
  @Input() variant: ButtonProps['variant'] = 'secondary';
  @Output() buttonClick = new EventEmitter<void>();
  
  private buttonElement: HTMLElement | null = null;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    this.buttonElement = createButton({
      label: this.label,
      variant: this.variant,
      onClick: () => this.buttonClick.emit()
    });
    this.el.nativeElement.appendChild(this.buttonElement);
  }
  
  ngOnDestroy() {
    this.buttonElement?.remove();
  }
}
```

---

## TypeScript Support

DOSage is written in TypeScript and provides comprehensive type definitions:

```typescript
import type { 
  ButtonProps, 
  PanelProps, 
  ThemePreset,
  ThemeConfig 
} from 'dosage';

// All props are fully typed
const buttonConfig: ButtonProps = {
  label: 'Submit',
  variant: 'primary',
  size: 'large',
  disabled: false,
  loading: false,
  onClick: () => submitForm()
};

// Theme types are available
const theme: ThemePreset = 'amber';
```

---

## Accessibility

DOSage components are built with accessibility in mind:

- **Keyboard Navigation:** All interactive components are keyboard accessible
- **ARIA Attributes:** Proper roles, states, and properties
- **Focus Management:** Visible focus indicators
- **Screen Readers:** Announcements for state changes

```typescript
// All buttons are keyboard accessible
const button = createButton({
  label: 'Submit',
  onClick: handleSubmit
});
// User can press Enter or Space to activate

// Modals trap focus
const modal = createModal({
  title: 'Confirm',
  content: 'Are you sure?',
  // Focus is trapped within the modal
});
```

---

## Next Steps

Now that you have DOSage set up, here's what to explore next:

1. **[Component Documentation](./components/)** - Explore all available components
2. **[Theming Guide](./theming.md)** - Customize colors and create themes
3. **[API Reference](./api/)** - Complete API documentation
4. **[Kitchen Sink Demo](../demo/)** - Interactive component playground

### Common Tasks

- **Create a form:** See [Form Controls](./components/form-controls.md)
- **Show notifications:** See [Toast](./components/feedback.md#toast)
- **Build a dialog:** See [Modal](./components/overlays.md#modal)
- **Display data:** See [Table](./components/data-display.md#table)

### Getting Help

- Check the [FAQ](./faq.md) for common questions
- Search [existing issues](https://github.com/your-repo/dosage/issues)
- Open a [new issue](https://github.com/your-repo/dosage/issues/new)

---

Happy building! 💾
