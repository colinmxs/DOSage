# 🤖 DOSage Agent Instructions

## Your Mission

You are building **DOSage**, a TypeScript component library that faithfully recreates the nostalgic DOS-era computer interface aesthetic for modern web applications. Your goal is to deliver production-ready, accessible, and well-tested components that capture the spirit of 1980s-90s computing while meeting modern web standards.

## Project Overview

**DOSage** brings classic DOS aesthetics to the modern web:

| Aspect | Details |
|--------|---------|
| **Language** | TypeScript with strict mode |
| **Dependencies** | Zero/minimal runtime dependencies |
| **Compatibility** | Framework-agnostic (vanilla TS/JS) |
| **Modules** | ESM and CJS support |
| **Accessibility** | Full ARIA support, keyboard navigation |
| **Design** | DOS blue (#0000AA), monospace fonts, sharp edges, box-drawing characters |

**Visual Characteristics:**
- Blocky, pixelated typography (CGA/EGA-era aesthetic)
- Thick blinking block cursor (█)
- High-contrast DOS blue background with white/light gray text
- Sharp edges — absolutely no rounded corners
- Monospace fonts exclusively
- Box-drawing characters for borders: `─│═║┌┐└┘├┤┬┴┼╔╗╚╝╠╣╦╩╬`

---

## Critical Files & Paths

| Purpose | Path |
|---------|------|
| Implementation Checklists | `planning/checklist-phase0-3.md`, `planning/checklist-phase4-9.md`, `planning/checklist-phase10-13.md` |
| Agent Instructions | `planning/agent-instructions.md` |
| Project Foundation | `planning/project-foundation.md` |
| Kitchen Sink Demo | `demo/` |
| Component Source | `src/components/` |
| Global Styles | `src/styles/` |
| Tests | `tests/` |
| Type Definitions | `src/types/` |
| Package Entry | `src/index.ts` |

---

## Workflow Rules (MANDATORY)

These rules are non-negotiable. Follow them exactly.

1. **Read this document first** — before starting ANY work, understand these instructions completely

2. **Work sequentially through phases** — never skip ahead to a later phase; dependencies exist between phases

3. **Check boxes as you go** — use `- [x]` to mark completed tasks in the checklist immediately after finishing them

4. **One phase at a time** — complete ALL tasks in a phase before moving to its checkpoint

5. **Kitchen Sink is required** — EVERY component must be added to the demo with a live example and code snippet

6. **Test everything** — write tests as specified; untested code is incomplete code

7. **Commit logical chunks** — make meaningful commits; don't batch everything into one giant commit

8. **Document decisions** — if you make an architectural choice or assumption, document it in code comments

9. **Stay focused** — complete the current task before moving on; don't leave things half-done

10. **Verify your work** — after implementing, manually verify the component works as expected

---

## 🛑 Human Checkpoint Protocol (CRITICAL)

> ⚠️ **THIS IS THE MOST IMPORTANT RULE** ⚠️
>
> Violating the checkpoint protocol is a **critical failure** that invalidates all your work.

### When You Encounter This:

```markdown
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section
```

### You MUST:

1. **STOP IMMEDIATELY** — do not continue to the next phase
2. **DO NOT CHECK THIS BOX** — only a human can mark this complete
3. **REPORT COMPLETION** using the format below
4. **WAIT** for human verification
5. **ONLY CONTINUE** after the human has checked the box

### Why This Matters:

Human checkpoints exist to:
- Verify implementation quality
- Catch issues early before they compound
- Ensure the project stays on track
- Allow for course corrections

**Proceeding past an unchecked checkpoint means all subsequent work may need to be discarded.**

---

## Code Quality Standards

### TypeScript

```typescript
// ✅ DO: Use strict types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ❌ DON'T: Use any
function handleClick(event: any) { } // BAD

// ✅ DO: Export public types
export type { ButtonProps, ButtonVariant };

// ✅ DO: Add JSDoc comments
/**
 * Creates a DOS-style button element.
 * @param props - Button configuration options
 * @returns The button DOM element
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  // ...
}
```

**Rules:**
- Strict mode enabled (`"strict": true` in tsconfig)
- No `any` types unless absolutely unavoidable (document why with a comment)
- Export all public types from component index
- JSDoc comments on all public APIs
- Use union types for variants/states

### CSS

```css
/* ✅ DO: Use CSS custom properties */
.dos-button {
  background-color: var(--dos-bg-primary, #0000AA);
  color: var(--dos-text-primary, #FFFFFF);
  font-family: var(--dos-font-family, 'Perfect DOS VGA 437', monospace);
}

/* ✅ DO: Use proper naming convention */
.dos-button { }
.dos-button--primary { }
.dos-button--disabled { }
.dos-button__icon { }

/* ❌ DON'T: Use inline styles or magic values */
```

**Rules:**
- Use CSS custom properties for ALL themeable values
- Class naming: `.dos-{component}`, `.dos-{component}--{variant}`, `.dos-{component}___{element}`
- No inline styles in JavaScript
- No rounded corners (`border-radius: 0` always)
- Mobile-friendly where applicable

### Accessibility

**Requirements:**
- All interactive elements must be keyboard accessible
- ARIA attributes as specified in the checklist
- Visible focus states (high contrast)
- Screen reader friendly
- Test with keyboard only — no mouse

**Common ARIA patterns:**
```typescript
// Button
button.setAttribute('role', 'button');
button.setAttribute('aria-pressed', 'false');
button.setAttribute('aria-disabled', 'false');

// Menu
menu.setAttribute('role', 'menu');
menuItem.setAttribute('role', 'menuitem');

// Dialog
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('aria-labelledby', titleId);
```

### Testing

**Requirements:**
- Unit tests for all components
- Test all states and variants
- Test keyboard interactions
- Test accessibility attributes
- Test edge cases (empty props, long text, etc.)

**Test structure:**
```typescript
describe('DOSButton', () => {
  describe('rendering', () => {
    it('renders with default props', () => { });
    it('renders with custom label', () => { });
    it('renders all variants', () => { });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', () => { });
    it('responds to Enter key', () => { });
    it('responds to Space key', () => { });
    it('does not respond when disabled', () => { });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => { });
    it('is focusable', () => { });
    it('announces state changes', () => { });
  });
});
```

---

## Component Implementation Pattern

When implementing a component, follow this exact sequence:

### Step 1: Create Directory Structure

```
src/components/ComponentName/
├── ComponentName.ts        # Main implementation
├── ComponentName.css       # Component styles
├── ComponentName.types.ts  # TypeScript interfaces
└── index.ts                # Public exports
```

### Step 2: Define Types First

```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  // Required props first
  label: string;
  
  // Optional props with defaults documented
  /** @default 'primary' */
  variant?: 'primary' | 'secondary';
  
  /** @default false */
  disabled?: boolean;
  
  // Event handlers
  onClick?: () => void;
}

export interface ComponentNameState {
  isActive: boolean;
  isFocused: boolean;
}
```

### Step 3: Implement Component

```typescript
// ComponentName.ts
import type { ComponentNameProps } from './ComponentName.types';
import './ComponentName.css';

export function createComponentName(props: ComponentNameProps): HTMLElement {
  const { label, variant = 'primary', disabled = false, onClick } = props;
  
  // 1. Create DOM elements
  const element = document.createElement('div');
  element.className = `dos-componentname dos-componentname--${variant}`;
  
  // 2. Set content
  element.textContent = label;
  
  // 3. Add ARIA attributes
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', disabled ? '-1' : '0');
  element.setAttribute('aria-disabled', String(disabled));
  
  // 4. Wire up event handlers
  if (!disabled && onClick) {
    element.addEventListener('click', onClick);
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  }
  
  return element;
}
```

### Step 4: Add Styles

```css
/* ComponentName.css */
.dos-componentname {
  font-family: var(--dos-font-family);
  background-color: var(--dos-bg-primary);
  color: var(--dos-text-primary);
  border: none;
  padding: var(--dos-spacing-sm);
  cursor: pointer;
}

.dos-componentname:focus {
  outline: 2px solid var(--dos-focus-color);
  outline-offset: 2px;
}

.dos-componentname--primary { }
.dos-componentname--secondary { }
.dos-componentname--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Step 5: Export from Index

```typescript
// index.ts
export { createComponentName } from './ComponentName';
export type { ComponentNameProps, ComponentNameState } from './ComponentName.types';
```

### Step 6: Add to Main Index

```typescript
// src/index.ts
export * from './components/ComponentName';
```

### Step 7: Write Tests

Create `tests/ComponentName.test.ts` with comprehensive tests.

### Step 8: Add to Kitchen Sink

Add a section to the demo showing the component with all variants.

---

## Kitchen Sink Demo Requirements

The Kitchen Sink (`demo/`) is a living showcase of all components. **Every component must appear here.**

### For Each Component, Include:

1. **Section Header** — component name and brief description
2. **Live Examples** — interactive, working components
3. **All Variants** — show every variant option
4. **All States** — show disabled, active, focused states where applicable
5. **Code Snippet** — copy-paste ready code example
6. **Notes** — any usage notes or accessibility information

### Example Section Structure:

```html
<section class="demo-section" id="button">
  <h2>Button</h2>
  <p>DOS-style clickable button with keyboard support.</p>
  
  <div class="demo-examples">
    <h3>Variants</h3>
    <div class="demo-row">
      <!-- Live button examples -->
    </div>
    
    <h3>States</h3>
    <div class="demo-row">
      <!-- Disabled, active states -->
    </div>
  </div>
  
  <div class="demo-code">
    <h3>Usage</h3>
    <pre><code>
import { createButton } from 'dosage';

const button = createButton({
  label: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Clicked!')
});

document.body.appendChild(button);
    </code></pre>
  </div>
</section>
```

---

## When You Get Stuck

### Unclear Task
- Make a reasonable decision based on project conventions
- Document your decision in a code comment
- Note it in your phase completion report
- Continue working

### Blocked by External Factor
- Note the blocker clearly in your report
- **STOP** — do not try to work around critical blockers
- Wait for human guidance

### Error You Can't Fix
- Document the error message
- Document what you tried
- **STOP** — don't make the problem worse
- Wait for human assistance

### Missing Dependency
- If it's optional: note it and continue
- If it's required: **STOP** and report

### Ambiguous Requirements
- Check `planning/project-foundation.md` for context
- Look at similar components for patterns
- Make a decision and document it
- Continue working

---

## Reporting Format

After completing a phase (before the Human Checkpoint), provide this report:

```markdown
## Phase [N] Complete

### ✅ Completed Tasks
- [Task 1 that was completed]
- [Task 2 that was completed]
- [etc.]

### 🔧 Decisions Made
- [Architectural choice]: [Reasoning]
- [Assumption made]: [Why]

### ⚠️ Issues Encountered
- [Problem]: [How it was resolved OR why it's blocking]

### 📦 Kitchen Sink Updates
- Added [Component] section with:
  - Live examples for all variants
  - Code snippet
  - Accessibility notes

### 📊 Test Coverage
- [Component]: X tests passing
- All accessibility tests passing

### 🛑 Status
**Ready for human verification.**

Awaiting checkpoint approval before proceeding to Phase [N+1].
```

---

## DO NOT ❌

| Never Do This | Why |
|---------------|-----|
| Check any `⛔ HUMAN ONLY` box | Only humans verify checkpoints |
| Skip phases or tasks | Dependencies exist between phases |
| Proceed past unchecked checkpoint | All subsequent work may be invalid |
| Add external dependencies without approval | Zero-dependency goal |
| Write untested code | Tests are required, not optional |
| Forget the Kitchen Sink demo | Every component must be demonstrated |
| Use `any` types without documentation | TypeScript strict mode required |
| Ignore accessibility requirements | Accessibility is core to the project |
| Use rounded corners | DOS aesthetic requires sharp edges |
| Use non-monospace fonts | DOS aesthetic requires monospace |
| Make one giant commit | Commit logical, reviewable chunks |

---

## Quick Reference: DOS Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| DOS Blue | `#0000AA` | Primary background |
| White | `#FFFFFF` | Primary text |
| Light Gray | `#AAAAAA` | Secondary text |
| Black | `#000000` | Borders, shadows |
| Bright Blue | `#5555FF` | Highlights, focus |
| Yellow | `#FFFF55` | Warnings, emphasis |
| Red | `#FF5555` | Errors, alerts |
| Green | `#55FF55` | Success states |

---

## Quick Reference: Keyboard Navigation

All interactive components must support:

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift+Tab` | Move focus backward |
| `Enter` | Activate focused element |
| `Space` | Activate focused element (buttons) |
| `Escape` | Close dialogs/menus |
| `Arrow keys` | Navigate within component |
| `Home` | Go to first item |
| `End` | Go to last item |

---

*Last updated: January 2026*
