# DOSage Implementation — Start Work

## Project Context

You are building **DOSage**, a TypeScript component library that faithfully recreates classic DOS-era computer interfaces for modern web applications. Think 1980s-90s IBM PC aesthetics: the iconic blue screens, blocky text, and blinking cursors that defined an era of computing.

### Design Characteristics

| Element | Specification |
|---------|---------------|
| **Primary Background** | DOS Blue `#0000AA` |
| **Primary Text** | White `#FFFFFF` |
| **Typography** | Blocky, pixelated (CGA/EGA-era aesthetic) |
| **Cursor** | Thick blinking block cursor (█) |
| **Corners** | Sharp edges only — NO rounded corners anywhere |
| **Fonts** | Monospace exclusively |
| **Borders** | Box-drawing characters: `─│═║┌┐└┘├┤┬┴┼╔╗╚╝╠╣╦╩╬` |

### Technical Requirements

| Requirement | Details |
|-------------|---------|
| **Language** | Pure TypeScript with comprehensive types |
| **Dependencies** | Zero/minimal runtime dependencies |
| **Compatibility** | Framework-agnostic (vanilla TS/JS) |
| **Modules** | ESM and CJS support |
| **Accessibility** | Full ARIA support, complete keyboard navigation |
| **Testing** | Comprehensive unit tests for all components |

---

## Your Resources

### 1. Implementation Checklists
✅ **Your task lists** — work through these sequentially.

| Phases | File |
|--------|------|
| Phases 0–3 | `planning/checklist-phase0-3.md` |
| Phases 4–9 | `planning/checklist-phase4-9.md` |
| Phases 10–13 | `planning/checklist-phase10-13.md` |

- Organized into numbered phases
- Check boxes (`- [x]`) as you complete tasks
- Human Checkpoints (`⛔ HUMAN ONLY`) mark phase boundaries
- Never skip tasks or phases

### 2. Kitchen Sink Demo — `demo/`
🎨 **Component showcase** — add every component here after implementation.

For each component:
- Live, interactive example
- All variants demonstrated
- Copy-paste code snippet
- Accessibility notes

### 3. Project Foundation — `planning/project-foundation.md`
📋 **Reference document** — architectural decisions and project context.

---

## Your Workflow

Follow this exact sequence:

```
┌─────────────────────────────────────────────────────────────┐
│  1. READ the checklist files (phases 0-3, 4-9, 10-13)       │
│     └── Find your current position                          │
│                         ↓                                   │
│  2. FIND the next incomplete phase                          │
│     └── Look for first unchecked ⛔ HUMAN ONLY              │
│                         ↓                                   │
│  3. COMPLETE all tasks in that phase                        │
│     └── Check boxes as you complete each task               │
│                         ↓                                   │
│  4. For EACH component:                                     │
│     ├── Define TypeScript types first                       │
│     ├── Implement the component                             │
│     ├── Add all ARIA/accessibility                          │
│     ├── Write comprehensive unit tests                      │
│     └── Add to Kitchen Sink with example + code             │
│                         ↓                                   │
│  5. At Human Checkpoint: STOP and REPORT                    │
│     └── Use the reporting format from agent-instructions    │
└─────────────────────────────────────────────────────────────┘
```

---

## Critical Rules

### 🛑 Human Checkpoint Protocol

When you encounter:
```markdown
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section
```

You **MUST**:
1. **STOP** — do not proceed to the next phase
2. **DO NOT** check this box — only humans can
3. **REPORT** your completion with the standard format
4. **WAIT** for human to check the box
5. **CONTINUE** only after verification

### ⚠️ Absolute Rules

| Rule | Consequence of Violation |
|------|-------------------------|
| **DO NOT** check any `⛔ HUMAN ONLY` box | Work may be invalidated |
| **DO NOT** proceed past unchecked checkpoint | Subsequent work discarded |
| **DO NOT** skip tasks or phases | Dependencies will break |
| **DO NOT** forget the Kitchen Sink | Component incomplete |
| **DO NOT** use `any` types without documenting why | Code review failure |
| **DO NOT** ignore accessibility | Core requirement violation |
| **DO NOT** use rounded corners | Design violation |
| **DO NOT** use non-monospace fonts | Design violation |

---

## Component Implementation Checklist

For **every** component you implement, verify:

```
□ Types defined in ComponentName.types.ts
□ Implementation in ComponentName.ts
□ Styles in ComponentName.css
□ Exported from component index.ts
□ Added to main src/index.ts
□ Unit tests written and passing
□ ARIA attributes added
□ Keyboard navigation works
□ Focus states visible
□ Added to Kitchen Sink demo
□ Code snippet in Kitchen Sink
□ All variants demonstrated
```

---

## Code Style Quick Reference

### TypeScript
```typescript
// Always define types first
interface Props {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

// JSDoc on public APIs
/**
 * Creates a DOS-style button.
 * @param props - Configuration options
 * @returns Button element
 */
export function createButton(props: Props): HTMLButtonElement { }
```

### CSS
```css
/* Use custom properties, BEM-like naming */
.dos-button {
  background: var(--dos-bg-primary);
  color: var(--dos-text-primary);
  border-radius: 0; /* Always */
}
.dos-button--primary { }
.dos-button--disabled { }
```

### Accessibility
```typescript
element.setAttribute('role', 'button');
element.setAttribute('tabindex', '0');
element.setAttribute('aria-disabled', 'false');
```

---

## Reporting Format

When you reach a Human Checkpoint, report using this format:

```markdown
## Phase [N] Complete

### ✅ Completed Tasks
- [List each task completed]

### 🔧 Decisions Made
- [Decision]: [Reasoning]

### ⚠️ Issues Encountered
- [Issue]: [Resolution or blocker status]

### 📦 Kitchen Sink Updates
- Added [Component] with all variants and code snippet

### 📊 Test Coverage
- [X] tests passing for [Component]

### 🛑 Status
Ready for human verification. Awaiting checkpoint approval.
```

---

## Start Now

Execute these steps in order:

1. **Read** the checklist files (`checklist-phase0-3.md`, then `checklist-phase4-9.md`, then `checklist-phase10-13.md`) to find current position
2. **Identify** the first phase with an unchecked `⛔ HUMAN ONLY` checkpoint
3. **Begin** working on that phase's tasks
4. **Report** when you reach the Human Checkpoint

---

**Remember:** Quality over speed. Every component must be fully typed, tested, accessible, and demonstrated in the Kitchen Sink. Take your time and do it right.

Good luck, and welcome to the DOS era! 💾
