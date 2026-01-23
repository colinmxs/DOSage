# Prompt 2: DOSage Checklist — Phases 0–3

## Context

You are generating the implementation checklist for **DOSage**, a TypeScript component library recreating DOS-era interfaces.

This is **Part 1 of 3** for the checklist. You will generate Phases 0–3.

---

## Project Structure Reference

Use these paths (adjust if your foundation doc specifies differently):

```
src/
├── components/          # All components
├── styles/
│   ├── reset.css        # CSS reset
│   ├── base.css         # Base styles
│   ├── themes/          # Theme files
│   └── variables.css    # CSS custom properties
├── utils/               # Utility functions
├── types/               # Shared TypeScript types
└── index.ts             # Main entry point

demo/                    # Kitchen Sink app
├── index.html
├── main.ts
├── styles.css
└── sections/            # One file per component category

tests/                   # Test files (mirror src structure)
```

---

## Checklist Format Requirements

Use this exact format for consistency:

```markdown
## Phase N: Phase Name

### Section Name

#### Subsection or Component Name

- [ ] Task description
  - [ ] Sub-task if needed
  - [ ] Another sub-task
- [ ] Next task

> **Note:** Any helpful context or considerations

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase N
```

### Per-Component Format

For each component, use this expanded format:

```markdown
#### ComponentName

**File:** `src/components/ComponentName/ComponentName.ts`
**Styles:** `src/components/ComponentName/ComponentName.css`
**Types:** `src/components/ComponentName/ComponentName.types.ts`
**Tests:** `tests/components/ComponentName.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ComponentNameProps`
  - [ ] Prop: `propName` (type) — description
  - [ ] Prop: `anotherProp` (type) — description
- [ ] Implement base component
- [ ] Implement variants
  - [ ] Variant: `variantName` — description
- [ ] Implement states
  - [ ] State: default
  - [ ] State: hover
  - [ ] State: focus
  - [ ] State: active
  - [ ] State: disabled
- [ ] Add CSS styles with class `.dos-componentname`
- [ ] Add keyboard navigation
  - [ ] Key: `Tab` — description
  - [ ] Key: `Enter` — description
- [ ] Add ARIA attributes
  - [ ] `role="..."` 
  - [ ] `aria-label` or `aria-labelledby`
- [ ] Write unit tests
  - [ ] Test: renders correctly
  - [ ] Test: handles click/interaction
  - [ ] Test: keyboard navigation works
  - [ ] Test: disabled state prevents interaction
- [ ] Add to Kitchen Sink demo
  - [ ] Basic example
  - [ ] All variants showcase
  - [ ] Code snippet displayed

> **Accessibility:** [specific notes]
> **Keyboard:** [key bindings summary]
```

---

## Generate These Phases

### Phase 0: Project Foundation & Kitchen Sink App

Include tasks for:
- Repository initialization (package.json, tsconfig.json, etc.)
- Directory structure creation
- Build tooling setup (bundler config, scripts)
- Linting and formatting (ESLint, Prettier)
- Git configuration (.gitignore)
- Kitchen Sink demo app scaffold
  - HTML shell with DOS styling
  - Navigation sidebar
  - Main content area
  - Theme switcher UI (even if non-functional initially)
- Basic theming infrastructure
  - CSS custom properties file
  - Theme type definitions
  - Default DOS Blue theme values

### Phase 1: Core Infrastructure

Include tasks for:
- CSS reset (DOS-appropriate)
- Base typography styles
- Theming system
  - Theme provider/manager
  - Theme switching logic
  - Preset themes: DOS Blue, Amber Monochrome, Green Phosphor, Black & White
- Font setup (monospace, any custom pixel fonts)
- Animation utilities (cursor blink, scanlines)
- Transition utilities
- Focus style utilities
- Wire up theme switcher in Kitchen Sink

### Phase 2: Layout Primitives

Include full component specs for:
- **Container** — basic content wrapper with padding options
- **Panel** — bordered container using box-drawing characters
- **Box** — flexible box with customizable borders
- **Grid** — CSS grid-based layout system
- **Divider** — horizontal/vertical separators using ASCII (`─`, `│`, `═`, `║`)
- **Separator** — lighter visual break

### Phase 3: Typography Components

Include full component specs for:
- **Heading** — H1–H6 with DOS styling
- **Text** — body text, paragraph component
- **Code** — inline code styling
- **CodeBlock** — preformatted code blocks with optional line numbers
- **Blockquote** — quoted text with DOS-style indicator
- **List** — ordered, unordered with DOS bullet styles (`■`, `►`, `•`)
- **DefinitionList** — term/definition pairs
- **Label** — form label component
- **ASCIIArt** — render pre-defined ASCII art or text-to-ASCII

---

## Output

Generate the complete checklist content for Phases 0–3 in markdown format.

Start the document with:

```markdown
# DOSage Implementation Checklist

> **Instructions:** Work through this checklist sequentially. Check boxes as you complete tasks. STOP at each Human Checkpoint and wait for verification.

---
```

Then provide all four phases with full detail as specified above.
