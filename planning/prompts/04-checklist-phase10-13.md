# Prompt 4: DOSage Checklist — Phases 10–13

## Context

You are completing the implementation checklist for **DOSage**, a TypeScript component library recreating DOS-era interfaces.

This is **Part 3 of 3** for the checklist. You will generate Phases 10–13.

**Important:** This continues from the Phase 4–9 checklist. Use the same format and conventions.

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
- [ ] Implement base component
- [ ] Implement variants and states
- [ ] Add CSS styles
- [ ] Add keyboard navigation
- [ ] Add ARIA attributes
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** [notes]
> **Keyboard:** [key bindings]
```

End each phase with:
```markdown
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase N
```

---

## Generate These Phases

### Phase 10: Advanced Interactive Components

Include full component specs for:

- **Tabs** / **TabPanels**
  - Horizontal/vertical tab layouts
  - DOS-style tab appearance
  - Keyboard: Arrow keys, Home/End
  - ARIA: tablist, tab, tabpanel
  
- **Accordion**
  - Collapsible sections
  - Single/multiple expand modes
  - Header with expand indicator: `[+]` / `[-]`
  - Keyboard: Enter/Space, arrows
  
- **SplitPane**
  - Resizable split views
  - Horizontal/vertical orientation
  - Drag handle with ASCII indicator
  - Min/max size constraints
  
- **CommandPalette**
  - DOS prompt style: `C:\>`
  - Search/filter commands
  - Keyboard-first interface
  - Recently used commands
  - Fuzzy search support
  
- **SearchInput**
  - Search box with icon/prompt
  - Autocomplete suggestions dropdown
  - Keyboard navigation through results
  - Clear button
  
- **Combobox**
  - Text input + dropdown combo
  - Type-ahead filtering
  - Custom option rendering
  
- **MultiSelect**
  - Select multiple options
  - Tags/chips display for selected
  - Select all / clear all
  
- **TagInput**
  - Add/remove tags by typing
  - Validation for duplicates
  - Backspace to remove last tag

### Phase 11: Utility Components

Include full component specs for:

- **Portal**
  - Render children outside DOM hierarchy
  - Used by modals, tooltips, etc.
  
- **FocusTrap**
  - Contains focus within component
  - Used by modals, dialogs
  - Initial focus, return focus
  
- **KeyboardShortcutHandler**
  - Global/scoped keyboard shortcuts
  - Shortcut registration API
  - Display shortcut hints
  
- **ScrollArea**
  - Custom scrollbar styling
  - DOS-style scrollbar: `▲ ███░░░░ ▼`
  - Horizontal/vertical
  
- **Resizable**
  - Make any element resizable
  - Resize handles
  - Min/max constraints
  
- **Draggable**
  - Make any element draggable
  - Drag handle
  - Containment bounds
  
- **VisuallyHidden**
  - Screen reader only content
  - For accessibility

### Phase 12: Polish & Documentation

Include tasks for:

#### API Documentation
- [ ] Document all components with JSDoc
- [ ] Generate API reference (TypeDoc or similar)
- [ ] Props tables for each component
- [ ] Usage examples in documentation

#### Theming Guide
- [ ] Document all CSS custom properties
- [ ] Theme creation tutorial
- [ ] Preset theme documentation
- [ ] Dark/light mode guidance

#### Kitchen Sink Polish
- [ ] Review all component demos
- [ ] Ensure consistent code examples
- [ ] Add interactive playground controls
- [ ] Mobile/responsive testing
- [ ] Performance check

#### Developer Documentation
- [ ] README.md with quick start
- [ ] Installation instructions (npm, yarn, CDN)
- [ ] Basic usage examples
- [ ] Framework integration guides (vanilla, React wrapper notes)
- [ ] Contributing guidelines
- [ ] Code style documentation
- [ ] Changelog setup

### Phase 13: Quality Assurance

Include tasks for:

#### Unit Test Coverage
- [ ] Audit test coverage (target: 80%+)
- [ ] Add missing component tests
- [ ] Add edge case tests
- [ ] Add error boundary tests

#### Accessibility Audit
- [ ] Run axe-core or similar on all components
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Verify keyboard navigation for all interactive components
- [ ] Check color contrast ratios
- [ ] Review ARIA usage for correctness
- [ ] Document any accessibility limitations

#### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Document browser support matrix
- [ ] Note any polyfills needed

#### Performance Review
- [ ] Measure initial bundle size
- [ ] Verify tree-shaking works
- [ ] Check for memory leaks
- [ ] Profile render performance
- [ ] Optimize if needed

#### Bundle Analysis
- [ ] Generate bundle visualization
- [ ] Identify any bloat
- [ ] Ensure no unnecessary dependencies
- [ ] Document final bundle sizes

#### Final Verification
- [ ] All Kitchen Sink demos working
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Documentation complete
- [ ] Package ready for publish

---

## Output

Generate the complete checklist content for Phases 10–13 in markdown format.

Start with:
```markdown
## Phase 10: Advanced Interactive Components
```

End with:
```markdown
---

- [ ] ⛔ HUMAN ONLY: Final verification complete — DOSage is ready for release

---

## Checklist Complete

All phases have been defined. Work through each phase sequentially, stopping at each Human Checkpoint for verification.
```
