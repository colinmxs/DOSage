# DOS Block Cursor Customization

DOSage implements an authentic DOS-style block cursor (█) across all text input components using a JavaScript-based overlay system for maximum browser compatibility.

## How It Works

DOSage uses a **cursor overlay approach** instead of CSS `caret-shape: block` (which has limited browser support). The implementation:

1. **Hides the native caret** using `caret-color: transparent`
2. **Renders a block character overlay** (█) positioned at the cursor location
3. **Tracks cursor position** via selection events and input handlers
4. **Animates blinking** using CSS `@keyframes` with `step-end` timing

This approach ensures consistent block cursor behavior across all browsers.

## Default Behavior

The DOS block cursor automatically applies to all DOSage text input components:

- TextInput
- Textarea
- PasswordInput
- SearchInput
- Combobox
- MultiSelect
- TagInput
- CommandPalette

> **Note:** DatePicker uses a readonly input and TimePicker uses a spinbox, so they don't display a text cursor.

### Features

| Feature | Description |
|---------|-------------|
| **Block Style** | Authentic DOS block cursor (█) |
| **Blink Animation** | Classic ~530ms blink cycle matching DOS timing |
| **Focus State** | Cursor visible and blinking when focused |
| **Read-only State** | Dimmed cursor color, no blinking |
| **Disabled State** | Cursor hidden |
| **Reduced Motion** | Respects `prefers-reduced-motion` preference |
| **RTL Support** | Proper positioning for right-to-left text |
| **Selection** | DOS-style inverse selection colors |

## CSS Custom Properties

Customize the cursor appearance using these CSS custom properties:

```css
:root {
  /* Cursor color (default: primary yellow) */
  --dos-cursor-color: #FFFF55;
  
  /* Cursor color for read-only fields */
  --dos-cursor-color-readonly: #888888;
  
  /* Cursor dimensions */
  --dos-cursor-width: 0.6em;
  --dos-cursor-height: 1.2em;
  
  /* Blink rate (classic DOS ~530ms) */
  --dos-cursor-blink-rate: 530ms;
  
  /* Selection colors */
  --dos-selection-bg: #FFFFFF;
  --dos-selection-fg: #0000AA;
}
```

## Utility Classes

DOSage provides utility classes for fine-grained cursor control:

### `.dos-cursor-none`
Completely hides the cursor overlay.

```html
<input class="dos-text-input__field dos-cursor-none" />
```

### `.dos-cursor-visible`
Forces the cursor to be visible (overrides disabled states).

```html
<input class="dos-text-input__field dos-cursor-visible" />
```

### `.dos-cursor-blink`
Forces the cursor to blink (useful for custom implementations).

```html
<input class="dos-text-input__field dos-cursor-blink" />
```

### `.dos-cursor-steady`
Disables blinking while keeping cursor visible.

```html
<input class="dos-text-input__field dos-cursor-steady" />
```

## Cursor Overlay API

For advanced use cases, you can use the `DOSCursor` utility directly:

```typescript
import { createDOSCursor, attachDOSCursor } from 'dosage';

// Simple usage
const input = document.querySelector('input');
const wrapper = document.querySelector('.input-wrapper');
const cursor = attachDOSCursor(input, wrapper);

// Advanced usage with options
const cursor = createDOSCursor({
  input: inputElement,
  wrapper: wrapperElement,
  cursorChar: '█',        // Default block character
  disabled: false,
  readonly: false,
  onPositionUpdate: (position) => {
    console.log('Cursor at:', position.left, position.top);
  }
});

// Manual control
cursor.show();
cursor.hide();
cursor.updatePosition();
cursor.setDisabled(true);
cursor.setReadonly(true);

// Cleanup when done
cursor.destroy();
```

### DOSCursor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `HTMLInputElement \| HTMLTextAreaElement` | *required* | The input element to track |
| `wrapper` | `HTMLElement` | *required* | Container for the cursor overlay (must have `position: relative`) |
| `cursorChar` | `string` | `'█'` | Character to display as cursor |
| `disabled` | `boolean` | `false` | Whether cursor is disabled |
| `readonly` | `boolean` | `false` | Whether input is readonly |
| `onPositionUpdate` | `(position) => void` | `undefined` | Callback on position changes |

### DOSCursor Instance Methods

| Method | Description |
|--------|-------------|
| `show()` | Make cursor visible |
| `hide()` | Hide cursor |
| `updatePosition()` | Manually trigger position recalculation |
| `getPosition()` | Get current cursor position `{ left, top, index, height }` |
| `isVisible()` | Check if cursor is currently visible |
| `getElement()` | Get the cursor overlay DOM element |
| `setDisabled(disabled)` | Update disabled state |
| `setReadonly(readonly)` | Update readonly state |
| `destroy()` | Clean up event listeners and remove element |

## Accessibility

### ARIA

The cursor overlay includes `aria-hidden="true"` to prevent screen readers from announcing it, since it's purely decorative and the actual cursor position is tracked by the input element.

### Reduced Motion

The cursor respects the `prefers-reduced-motion` media query. When users have enabled reduced motion preferences, the cursor remains visible but stops blinking:

```css
@media (prefers-reduced-motion: reduce) {
  .dos-cursor-overlay {
    animation: none !important;
    opacity: 1 !important;
  }
}
```

### High Contrast Mode

In high contrast mode, cursor colors are automatically adjusted for maximum visibility:

```css
@media (prefers-contrast: more) {
  :root {
    --dos-cursor-color: #FFFFFF;
    --dos-selection-bg: #FFFFFF;
    --dos-selection-fg: #000000;
  }
}
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| IE 11 | ⚠️ Limited (no CSS custom properties) |

The JavaScript overlay approach ensures consistent cursor behavior across all modern browsers.

## Theme Integration

The cursor automatically uses theme colors. When changing themes, the cursor color updates accordingly:

```typescript
import { setTheme } from 'dosage';

// Switch to amber theme - cursor becomes amber
setTheme('amber');

// Switch to green phosphor - cursor becomes green
setTheme('green-phosphor');
```

## Custom Implementations

### Creating a Custom Cursor

For elements that don't use DOSage components, you can use the cursor utility directly:

```typescript
import { attachDOSCursor } from 'dosage';

const input = document.querySelector('#my-custom-input');
const wrapper = input.parentElement;

// Make sure wrapper has position: relative
wrapper.style.position = 'relative';

const cursor = attachDOSCursor(input, wrapper);

// Remember to clean up when the element is removed
function cleanup() {
  cursor.destroy();
}
```

### Visual Block Cursor (Display Only)

For display-only contexts (like terminal emulators), use the `.dos-block-cursor` class:

```html
<span class="dos-block-cursor">
  <span class="content">Your text here</span>
</span>
```

This creates a visual block cursor (█) after the content that blinks with the standard DOS timing.

## Examples

### Amber Cursor

```css
:root {
  --dos-cursor-color: #FFAA00;
  --dos-selection-bg: #FFAA00;
  --dos-selection-fg: #000000;
}
```

### Green Phosphor Cursor

```css
:root {
  --dos-cursor-color: #33FF33;
  --dos-selection-bg: #33FF33;
  --dos-selection-fg: #000000;
}
```

### Faster Blink Rate

```css
:root {
  --dos-cursor-blink-rate: 300ms;
}
```

### Slower Blink Rate

```css
:root {
  --dos-cursor-blink-rate: 800ms;
}
```

### Underscore Cursor

```typescript
const cursor = attachDOSCursor(input, wrapper, { cursorChar: '_' });
```

### Half-Block Cursor

```typescript
const cursor = attachDOSCursor(input, wrapper, { cursorChar: '▄' });
```

## Troubleshooting

### Cursor Not Visible

1. Ensure the input is focused
2. Check if `.dos-cursor-none` class is accidentally applied
3. Verify the input is not disabled
4. Make sure the wrapper element has `position: relative`

### Cursor Not Blinking

1. Check if `prefers-reduced-motion` is enabled in your OS settings
2. Verify the cursor CSS is loaded (`cursor.css` is imported in `global.css`)
3. Ensure no custom CSS is overriding the animation

### Wrong Cursor Color

1. Check theme variables are set correctly
2. Verify `--dos-cursor-color` custom property value
3. Check for CSS specificity issues

### Cursor Position Wrong

1. Ensure the input uses a monospace font
2. Check that no custom letter-spacing or word-spacing is applied
3. Verify the wrapper element properly contains the input

### Cursor Not Cleaning Up

If you create cursors manually, remember to call `cursor.destroy()` when the component is removed to prevent memory leaks.
