# Prompt 3: DOSage Checklist — Phases 4–9

## Context

You are continuing the implementation checklist for **DOSage**, a TypeScript component library recreating DOS-era interfaces.

This is **Part 2 of 3** for the checklist. You will generate Phases 4–9.

**Important:** This continues from the Phase 0–3 checklist. Use the same format and conventions.

---

## Checklist Format Reminder

### Per-Component Format

```markdown
#### ComponentName

**File:** `src/components/ComponentName/ComponentName.ts`
**Styles:** `src/components/ComponentName/ComponentName.css`
**Types:** `src/components/ComponentName/ComponentName.types.ts`
**Tests:** `tests/components/ComponentName.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ComponentNameProps`
  - [ ] Prop: `propName` (type) — description
- [ ] Implement base component
- [ ] Implement variants
  - [ ] Variant: `variantName` — description
- [ ] Implement states: default, hover, focus, active, disabled
- [ ] Add CSS styles with class `.dos-componentname`
- [ ] Add keyboard navigation (list specific keys)
- [ ] Add ARIA attributes (list specific attributes)
- [ ] Write unit tests (list specific test cases)
- [ ] Add to Kitchen Sink demo
  - [ ] Basic example
  - [ ] All variants showcase
  - [ ] Code snippet displayed

> **Accessibility:** [notes]
> **Keyboard:** [key bindings]
```

End each phase with:
```markdown
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase N
```

---

## Generate These Phases

### Phase 4: Button & Link Components

Include full component specs for:

- **Button**
  - Variants: primary, secondary, danger, ghost
  - Sizes: small, medium, large
  - States: default, hover, focus, active, disabled, loading
  - DOS-style: thick borders, blocky appearance
  
- **ButtonGroup**
  - Horizontal/vertical orientation
  - Connected/separated modes
  
- **IconButton**
  - Square button for icons/characters
  - Same variants as Button
  
- **Link**
  - DOS-style hyperlink appearance
  - Underline style, color treatment
  - Visited state handling

### Phase 5: Form Controls (Basic)

Include full component specs for:

- **TextInput**
  - Single-line text input
  - DOS-style bordered box
  - Placeholder support
  - States: default, focus, error, disabled
  
- **Textarea**
  - Multi-line text input
  - Resizable option
  - Character/line count option
  
- **PasswordInput**
  - Masked with `*` or `●` characters
  - Show/hide password toggle
  
- **Checkbox**
  - DOS style: `[X]` checked, `[ ]` unchecked
  - Indeterminate state: `[-]`
  - Label positioning
  
- **RadioButton**
  - DOS style: `(•)` selected, `( )` unselected
  - RadioGroup wrapper
  
- **FormGroup** / **Fieldset**
  - Groups related form controls
  - Legend/label support
  - Border using box-drawing characters
  
- **FormValidation**
  - Error message display
  - Error state styling
  - Validation icons/indicators

### Phase 6: Form Controls (Advanced)

Include full component specs for:

- **Select** / **Dropdown**
  - Native-like but DOS-styled
  - Arrow indicator: `▼`
  - Options list styling
  
- **Toggle** / **Switch**
  - DOS-style: `[ON ]` / `[OFF]` or `[■--]` / `[--■]`
  
- **Slider** / **Range**
  - Track with ASCII: `├──────────┤`
  - Thumb indicator
  - Value display option
  
- **FileInput**
  - DOS-style file selection
  - Drag and drop zone styling
  - File list display
  
- **DatePicker**
  - DOS-style calendar popup
  - Month/year navigation
  - Box-drawing calendar grid
  
- **TimePicker**
  - Hour/minute selection
  - 12/24 hour format option

### Phase 7: Navigation Components

Include full component specs for:

- **MenuBar**
  - Classic DOS horizontal menu (File, Edit, View...)
  - Keyboard: Alt+letter shortcuts
  - Dropdown on click/hover
  
- **DropdownMenu**
  - Menu items with optional icons
  - Dividers
  - Nested submenus
  - Keyboard navigation
  
- **ContextMenu**
  - Right-click triggered
  - Positioned at cursor
  - Same styling as DropdownMenu
  
- **Sidebar**
  - Navigation panel
  - Collapsible sections
  - Active state indication
  
- **Breadcrumbs**
  - Path display: `Home > Section > Page`
  - Separator character options
  
- **Pagination**
  - Page numbers
  - Previous/Next controls
  - DOS-style: `[<] 1 2 [3] 4 5 [>]`
  
- **Stepper** / **Wizard**
  - Step indicators
  - Progress display
  - Navigation between steps

### Phase 8: Feedback & Overlay Components

Include full component specs for:

- **Modal** / **Dialog**
  - Centered overlay
  - Box-drawing border
  - Title bar
  - Close button
  - Focus trap
  
- **Window**
  - Full DOS window frame
  - Title bar with controls: `[─][□][X]`
  - Minimize, maximize, close
  - Draggable (optional)
  - Resizable (optional)
  
- **Alert**
  - Banner-style notifications
  - Types: info, success, warning, error
  - Dismissible option
  
- **Toast**
  - Temporary notifications
  - Position options
  - Auto-dismiss
  - Stack multiple toasts
  
- **Tooltip**
  - Hover-triggered info
  - Positioning: top, bottom, left, right
  - Arrow pointer
  
- **Popover**
  - Click-triggered overlay
  - Richer content than tooltip
  
- **ProgressBar**
  - Block characters: `████░░░░░░` or `[█████     ]`
  - Percentage display
  - Indeterminate animation
  
- **LoadingSpinner**
  - ASCII animation: `|`, `/`, `-`, `\` cycle
  - Or block-based spinner
  
- **SkeletonLoader**
  - Content placeholder
  - Animated shimmer effect (DOS-style)

### Phase 9: Data Display Components

Include full component specs for:

- **Table**
  - Box-drawing borders
  - Sortable columns
  - Pagination integration
  - Row selection
  - Striped rows option
  
- **DataGrid** (if different from Table)
  - More complex data handling
  - Cell editing
  - Column resizing
  
- **List**
  - Vertical list of items
  - Selection support
  - Keyboard navigation
  
- **TreeView**
  - Expandable/collapsible nodes
  - ASCII tree characters: `├──`, `└──`, `│`
  - Icons for folders/files
  
- **Badge** / **Tag**
  - Small label: `[NEW]`, `[v1.0]`
  - Color variants
  - Removable option
  
- **Avatar**
  - ASCII art style
  - Initials fallback
  - Status indicator
  
- **Card**
  - Content container
  - Header, body, footer sections
  - DOS-style bordered
  
- **Timeline**
  - Vertical event list
  - Connecting lines
  - Timestamps
  
- **EmptyState**
  - Placeholder for empty lists/content
  - ASCII art illustration
  - Action button

---

## Output

Generate the complete checklist content for Phases 4–9 in markdown format.

Start with:
```markdown
## Phase 4: Button & Link Components
```

And continue through Phase 9, ending with the Human Checkpoint for Phase 9.
