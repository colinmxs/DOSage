# DOSage Component Library — Specification Request

## Project Overview

**DOSage** is a TypeScript component library that recreates the aesthetic of classic DOS-era computer interfaces for modern web applications. The name is a portmanteau of "DOS" and "sage" (or perhaps "sausage" for the playful at heart).

---

## Core Design Principles

### Visual Identity
- **Blocky, pixelated typography** reminiscent of CGA/EGA-era text rendering
- **Thick, blinking block cursor** as a signature UI element
- **High-contrast color schemes** with the classic blue/white DOS aesthetic as the default
- **Sharp edges, no rounded corners** — everything should feel angular and grid-aligned
- **Monospace fonts exclusively** — the UI should feel like a terminal

### Technical Principles
- **Pure TypeScript** — first-class TypeScript support with comprehensive type definitions
- **Minimal dependencies** — avoid bloat; prefer zero or near-zero external runtime dependencies
- **Framework-agnostic core** — should work with vanilla TypeScript/JavaScript projects
- **Modern build tooling** — support ESM and CJS module formats
- **Accessible** — despite the retro aesthetic, follow modern accessibility standards (ARIA, keyboard navigation)

---

## Theming System Requirements

### Default Theme
- Primary: DOS blue (`#0000AA`) background with white/light gray text
- Accent colors for selections, highlights, and focus states
- Scanline or CRT effects (optional, toggleable)

### Customization
- Fully customizable color palette via CSS custom properties or theme configuration object
- Preset themes (e.g., DOS Blue, Amber Monochrome, Green Phosphor, Black & White)
- Support for user-defined custom themes
- Dark/light mode variants where applicable

---

## Component Library Scope

Create a **comprehensive, production-ready component library** with the full range of UI primitives and patterns a modern web developer would expect. The checklist should cover:

### Layout & Structure
- Container / Panel / Box
- Grid system
- Dividers / Separators (ASCII-style: `─`, `│`, `═`, `║`, box-drawing characters)
- Window / Dialog frame (with title bar, minimize/maximize/close)
- Tabs / Tab panels
- Accordion / Collapsible sections
- Card component
- Split pane / Resizable panels

### Typography & Text
- Headings (H1–H6 with DOS styling)
- Paragraph / Body text
- Code / Preformatted text blocks
- Blockquote
- Lists (ordered, unordered, with DOS bullet styles)
- Label component
- ASCII art renderer

### Form Controls
- Text input (single-line)
- Textarea (multi-line)
- Password input (with `*` masking)
- Select / Dropdown
- Checkbox (with `[X]` / `[ ]` styling)
- Radio button (with `(•)` / `( )` styling)
- Toggle / Switch
- Slider / Range input
- File input
- Date picker (DOS-style calendar)
- Time picker
- Form group / Fieldset
- Form validation states and error messages

### Buttons & Actions
- Button (primary, secondary, danger, ghost variants)
- Button group
- Icon button
- Link / Anchor styled as DOS hyperlink

### Navigation
- Menu bar (classic DOS-style horizontal menu)
- Dropdown menu
- Context menu (right-click)
- Sidebar / Navigation panel
- Breadcrumbs
- Pagination
- Stepper / Wizard navigation

### Feedback & Overlays
- Modal / Dialog
- Alert / Notification banner
- Toast / Snackbar notifications
- Tooltip
- Popover
- Loading spinner / Progress indicator (ASCII-style animation)
- Progress bar (block characters: `█`, `▓`, `▒`, `░`)
- Skeleton loader

### Data Display
- Table (with sorting, pagination, row selection)
- Data grid
- List / List items
- Tree view (expandable/collapsible)
- Badge / Tag / Chip
- Avatar (ASCII-art or initials-based)
- Stat / Metric display
- Timeline
- Empty state

### Media & Visualization
- Image container (with optional ASCII art conversion)
- Icon system (ASCII/Unicode character-based icons)
- Chart placeholders (ASCII-style bar charts, spark lines)

### Utility Components
- Portal
- Visually hidden (for accessibility)
- Focus trap
- Keyboard shortcut handler
- Scroll area (custom scrollbar styling)
- Resizable
- Draggable

### Interactive Patterns
- Command palette / Command input (DOS prompt style)
- Search input with autocomplete
- Combobox
- Multi-select
- Tag input
- Rich text hints (syntax highlighting for code)

---

## Deliverable: Specification Checklist

Generate an **exhaustive, implementation-ready checklist** that includes:

### Phase 0: Kitchen Sink Demo Application (FIRST PRIORITY)

Before building any components, create a **Kitchen Sink demo application** that will serve as:
- A live showcase for all components as they are developed
- A visual verification tool for the human reviewer
- A reference implementation showing proper usage patterns
- An interactive documentation site

The Kitchen Sink app should:
- Be a standalone web application (vanilla HTML/CSS/JS or minimal bundler)
- Have a sidebar navigation listing all component categories
- Display each component with:
  - Live rendered example(s)
  - The implementation code shown alongside
  - Interactive controls to toggle variants/states where applicable
- Support theme switching to verify theming works correctly
- Be the **first thing built** so components can be added incrementally

---

### Phase Structure & Human Checkpoints

The checklist must be organized into **sequential phases**. Each phase ends with a **Human Verification Checkpoint**.

#### Human Checkpoint Rules (CRITICAL)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🛑 HUMAN CHECKPOINT — AGENT MUST STOP HERE                         │
│                                                                     │
│  - [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section     │
│                                                                     │
│  ⚠️  AGENT INSTRUCTIONS:                                            │
│  1. You may NOT check this box. Only a human can.                   │
│  2. You may NOT proceed past this checkpoint until it is checked.   │
│  3. When you reach this checkpoint, STOP and report completion.     │
│  4. Wait for the human to verify and check the box.                 │
│  5. Only after the box is checked may you continue to the next      │
│     phase.                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

Each phase should include:
1. All implementation tasks for that phase (checkable by agent)
2. "Add to Kitchen Sink" task — component must be added to the demo app with example code
3. Human Checkpoint at the end — blocks further progress until verified

---

### Checklist Phases

1. **Phase 0: Project Foundation & Kitchen Sink App**
   - Repository structure and configuration
   - Build tooling setup
   - Kitchen Sink demo application scaffold
   - Basic theming infrastructure
   - 🛑 HUMAN CHECKPOINT

2. **Phase 1: Core Infrastructure**
   - Theming system (CSS custom properties, theme switching)
   - Base styles and CSS reset
   - Typography system (fonts, sizing)
   - Animation/transition utilities
   - Add theme switcher to Kitchen Sink
   - 🛑 HUMAN CHECKPOINT

3. **Phase 2: Layout Primitives**
   - Container / Panel / Box
   - Grid system
   - Dividers / Separators
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

4. **Phase 3: Typography Components**
   - Headings, Paragraph, Code blocks
   - Lists, Blockquote, Label
   - ASCII art renderer
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

5. **Phase 4: Button & Link Components**
   - Button (all variants)
   - Button group
   - Icon button
   - Link component
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

6. **Phase 5: Form Controls (Basic)**
   - Text input, Textarea, Password input
   - Checkbox, Radio button
   - Form group / Fieldset
   - Validation states
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

7. **Phase 6: Form Controls (Advanced)**
   - Select / Dropdown
   - Toggle / Switch
   - Slider / Range
   - File input
   - Date picker, Time picker
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

8. **Phase 7: Navigation Components**
   - Menu bar
   - Dropdown menu
   - Context menu
   - Sidebar, Breadcrumbs, Pagination
   - Stepper / Wizard
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

9. **Phase 8: Feedback & Overlay Components**
   - Modal / Dialog
   - Window frame (with title bar controls)
   - Alert, Toast, Tooltip, Popover
   - Progress bar, Loading spinner
   - Skeleton loader
   - Add to Kitchen Sink with code examples
   - 🛑 HUMAN CHECKPOINT

10. **Phase 9: Data Display Components**
    - Table (with sorting, pagination)
    - List / Tree view
    - Badge, Avatar, Card
    - Timeline, Empty state
    - Add to Kitchen Sink with code examples
    - 🛑 HUMAN CHECKPOINT

11. **Phase 10: Advanced Interactive Components**
    - Tabs / Tab panels
    - Accordion
    - Split pane / Resizable panels
    - Command palette
    - Search with autocomplete
    - Combobox, Multi-select, Tag input
    - Add to Kitchen Sink with code examples
    - 🛑 HUMAN CHECKPOINT

12. **Phase 11: Utility Components**
    - Portal, Focus trap
    - Keyboard shortcut handler
    - Scroll area
    - Resizable, Draggable
    - Visually hidden
    - Add to Kitchen Sink with code examples
    - 🛑 HUMAN CHECKPOINT

13. **Phase 12: Polish & Documentation**
    - Complete API documentation
    - Theming guide
    - Contributing guidelines
    - Final Kitchen Sink polish
    - README and getting started guide
    - 🛑 HUMAN CHECKPOINT

14. **Phase 13: Quality Assurance**
    - Unit test coverage
    - Accessibility audit
    - Browser compatibility testing
    - Performance review
    - Bundle size analysis
    - 🛑 FINAL HUMAN CHECKPOINT

---

### Per-Component Specification Format

For each component in the checklist, include:

```markdown
#### ComponentName

- [ ] Define props/API interface (TypeScript types)
- [ ] Implement base component
- [ ] Implement variants: [list specific variants]
- [ ] Implement states: default, hover, focus, active, disabled
- [ ] Add keyboard navigation (specify keys)
- [ ] Add ARIA attributes for accessibility
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo app
  - [ ] Basic example
  - [ ] All variants showcase
  - [ ] Code snippet displayed alongside
- [ ] Document props in API reference

> **Accessibility Notes:** [specific a11y considerations]
> **Keyboard Interactions:** [specific key bindings]
```

---

## Constraints & Guidelines

- **No React, Vue, Angular, or other framework dependencies in core** — framework-specific wrappers may be considered as separate packages
- **Bundle size matters** — tree-shakeable, minimal footprint
- **Semantic HTML** — use appropriate elements under the hood
- **Progressive enhancement** — components should be functional without JavaScript where possible
- **Consistent API patterns** — similar components should have similar prop interfaces

---

## Required Deliverables

**You must produce THREE separate documents.** Save each as its own file in the `planning/` directory.

---

### 📄 Deliverable 1: The Checklist (`planning/dosage-checklist.md`)

A **comprehensive, exhaustive implementation checklist** covering every aspect of the DOSage project. This is the master document that tracks all work.

**Format Requirements:**
- Structured markdown with clear hierarchical organization by phase
- Checkboxes (`- [ ]`) for every actionable task
- Human checkpoint boxes clearly marked with `⛔ HUMAN ONLY` prefix
- Detailed sub-tasks for each component following the per-component format above
- "Add to Kitchen Sink" task after each component/section
- Notes or considerations in blockquotes where helpful
- Links or references to inspiration/prior art where relevant

**Content Requirements:**
- **Leave no stone unturned.** Every component, every variant, every state, every accessibility concern, every test—all explicitly listed as checkable items.
- Expand every component from the Component Library Scope section into full detailed sub-tasks
- Include file paths where code should live
- Include specific TypeScript interface names to create
- Include specific CSS class naming conventions
- Include specific test file names and test case descriptions
- This checklist should be so thorough that an agent could work from it with zero ambiguity

**Structure:**
1. Phase 0: Project Foundation & Kitchen Sink App (with all sub-tasks)
2. Phase 1: Core Infrastructure (with all sub-tasks)
3. Phases 2-13: Component phases (each component fully expanded)
4. Each phase ends with: `- [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section`

---

### 📄 Deliverable 2: Agent Instructions (`planning/agent-instructions.md`)

A **standalone instruction document** that will be provided to any coding agent before they begin work. This establishes the rules, standards, and workflow the agent must follow.

**Must Include:**

```markdown
# 🤖 DOSage Agent Instructions

## Your Mission
[Brief description of what DOSage is and what the agent is building]

## Critical Files
- Checklist location: `planning/dosage-checklist.md`
- Kitchen Sink app location: [specify path]
- Component source location: [specify path]
- Test location: [specify path]

## Workflow Rules (MANDATORY)

1. **Work sequentially.** Complete phases in order. Do not skip ahead.
2. **Check boxes as you complete tasks.** Use `- [x]` to mark completion.
3. **One phase at a time.** Finish all tasks in a phase before the checkpoint.
4. **Kitchen Sink updates are required.** After every component:
   - Add a working example to the Kitchen Sink app
   - Display the implementation code alongside
   - Demonstrate all variants and states

## 🛑 Human Checkpoint Protocol (CRITICAL)

When you encounter:
```
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section
```

You MUST:
1. **STOP immediately.** Do not continue to the next phase.
2. **Do NOT check this box.** Only a human can check it.
3. **Report your completion** with:
   - Summary of what was implemented
   - Any decisions or assumptions made
   - Any issues encountered
   - Confirmation that Kitchen Sink has been updated
4. **Wait.** Do not proceed until the human checks the box.
5. **Verify before continuing.** Re-read the checklist to confirm the box is checked.

Violating this protocol is a critical failure.

## Quality Standards

- All code must be fully typed with TypeScript (no `any` unless absolutely necessary)
- All components must include ARIA attributes and keyboard navigation
- All components must integrate with the theming system
- All components must have unit tests
- Code must be clean, well-commented, and follow established patterns
- No external runtime dependencies unless explicitly approved

## Code Style & Conventions
[Specify naming conventions, file structure patterns, etc.]

## When You Get Stuck

- If a task is unclear: make a reasonable decision, document it in a comment, and continue
- If a task is blocked: note the blocker and stop
- If you encounter an error: attempt to fix it; if you can't, document and stop

## Reporting Format

After completing a phase, provide:
1. ✅ **Completed:** [list of completed tasks]
2. 🔧 **Decisions Made:** [any assumptions or choices]
3. ⚠️ **Issues:** [any problems encountered]
4. 📦 **Kitchen Sink:** [confirmation of updates]
5. 🛑 **Status:** Ready for human verification
```

---

### 📄 Deliverable 3: Starter Prompt (`planning/starter-prompt.md`)

A **ready-to-use prompt** that the human will copy and paste to kick off the agent on the next phase of work. This prompt should be complete and self-contained.

**Must Include:**

```markdown
# DOSage Implementation — Begin Work

## Context

You are building **DOSage**, a TypeScript component library that recreates classic DOS-era computer interfaces for modern web applications.

**Key characteristics:**
- Blocky, pixelated typography
- Thick blinking block cursor
- High-contrast DOS blue/white color schemes (customizable)
- Monospace fonts, sharp edges, no rounded corners
- Zero/minimal runtime dependencies
- Full accessibility support despite retro aesthetic

## Your Resources

- **Checklist:** `planning/dosage-checklist.md` — your task list, work through it sequentially
- **Agent Instructions:** `planning/agent-instructions.md` — read this FIRST for rules and standards
- **Kitchen Sink App:** [path] — add every component here after implementation

## Your Task

1. **Read `planning/agent-instructions.md`** to understand the rules and workflow
2. **Read `planning/dosage-checklist.md`** to find your current position
3. **Identify the next uncompleted phase** (find the first unchecked `⛔ HUMAN ONLY` checkpoint)
4. **Complete all tasks in that phase** sequentially, checking boxes as you go
5. **After each component:**
   - Implement with full TypeScript types
   - Add accessibility (ARIA, keyboard nav)
   - Write unit tests
   - Add to Kitchen Sink with live example + code display
6. **When you reach the Human Checkpoint:**
   - STOP working immediately
   - Report everything you completed
   - Wait for human verification before continuing

## Critical Reminders

⚠️ **Do NOT check any box marked `⛔ HUMAN ONLY`** — only a human can check these
⚠️ **Do NOT proceed past a Human Checkpoint** until it has been checked
⚠️ **Do NOT skip tasks** — complete them in order
⚠️ **Do NOT forget the Kitchen Sink** — every component must be added

## Begin

Start by reading the agent instructions, then the checklist. Identify where to begin and start working.
```

---

## Summary of Deliverables

| # | File | Purpose |
|---|------|---------|
| 1 | `planning/dosage-checklist.md` | The exhaustive, trackable implementation checklist |
| 2 | `planning/agent-instructions.md` | Rules and standards for the coding agent |
| 3 | `planning/starter-prompt.md` | Copy-paste prompt to kick off agent work |

All three files must be complete, standalone, and production-ready.

---

*Let's build something that makes developers nostalgic and users delighted.*
