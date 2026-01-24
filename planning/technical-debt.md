# Technical Debt

This document tracks known technical debt, architectural issues, and areas for improvement in the DOSage project.

---

## 🔴 Critical

_High-impact issues that should be addressed soon._

### Global Cursor Styling — DOS Block Cursor Implementation

**Priority:** 🔴 **CRITICAL — HIGHEST PRIORITY**
**Impact:** Core visual identity, brand authenticity, user immersion
**Effort:** Medium

**Description:**
The cursor is currently the browser default (thin vertical line). This is a **fundamental aesthetic failure** for a DOS-style library. The cursor is one of the most iconic elements of the DOS/CLI experience and its absence undermines the entire visual identity of the project.

**Why it exists:**
Cursor styling was not included in the original style plan. This was an oversight that must be corrected immediately.

**The Problem:**
- Browser default cursor (thin, non-blinking or subtle blink) breaks DOS immersion
- No visual distinction between DOSage inputs and standard HTML inputs
- Missing a core part of the DOS aesthetic that users expect
- Undermines credibility as a serious DOS-style component library

**Required Solution — DOS Block Cursor Specification:**

1. **Visual Characteristics:**
   - Thick block cursor (█) filling the character width
   - High contrast: inverse colors (e.g., white block on blue bg, or blue block on white text)
   - Sharp edges (no anti-aliasing or smooth transitions)
   - Prominent blink animation (~530ms cycle matching classic DOS timing)

2. **Keyboard Reactivity:**
   - **Focus state:** Cursor visible and blinking in focused inputs
   - **Blur state:** Cursor hidden or changes to outline-only block
   - **Typing state:** Brief pause in blink on keypress (restart blink cycle)
   - **Insert vs Overwrite mode:** Block cursor for overwrite, underline for insert (if applicable)
   - **Disabled state:** No cursor shown
   - **Read-only state:** Different cursor style (outline block?) or no cursor

3. **Implementation Strategy:**

   **Phase 1: Global Cursor Base**
   - Add CSS custom properties for cursor styling to `src/styles/global.css`:
     ```
     --dos-cursor-width: 0.6em (character width)
     --dos-cursor-height: 1em (line height)
     --dos-cursor-color: var(--dos-bg-primary)
     --dos-cursor-bg: var(--dos-text-primary)
     --dos-cursor-blink-duration: 530ms
     ```
   - Create reusable cursor animation keyframes
   - Define base cursor classes: `.dos-cursor`, `.dos-cursor--blink`, `.dos-cursor--static`

   **Phase 2: Input Component Integration**
   - Apply cursor styling to all text input components:
     - TextInput
     - Textarea
     - PasswordInput
     - DatePicker (when keyboard input added)
     - TimePicker
     - Select (when searchable/editable)
   - Use pseudo-elements or wrapper elements to render block cursor
   - Position cursor based on caret position
   - Handle multi-line inputs (Textarea) correctly

   **Phase 3: Interactive Behaviors**
   - Implement keyboard event handlers:
     - Restart blink animation on keydown
     - Pause blinking briefly during rapid typing
   - Implement focus/blur transitions
   - Ensure cursor doesn't interfere with text selection
   - Test cursor position accuracy with various font sizes

   **Phase 4: Accessibility & Polish**
   - Ensure cursor is visible in all color themes
   - Test with screen readers (cursor shouldn't break announcements)
   - Add option to disable blink for users with vestibular disorders
   - Document cursor customization options
   - Verify cursor respects `prefers-reduced-motion`

4. **Technical Approach Options:**

   **Option A: CSS-Only with Caret-Color + Shadow**
   - Use `caret-color` + heavy `text-shadow` to thicken cursor
   - Pros: Simple, native browser caret positioning
   - Cons: Limited customization, may not achieve true block look

   **Option B: Hidden Caret + Pseudo-Element Overlay**
   - Hide native caret (`caret-color: transparent`)
   - Position `::after` pseudo-element as block cursor
   - Use JS to track caret position and update cursor position
   - Pros: Full visual control, true block cursor
   - Cons: More complex, requires JS for positioning

   **Option C: Wrapper Element with Absolute Positioned Cursor**
   - Wrap input content in editable div
   - Render separate cursor element positioned absolutely
   - Use Selection API to track cursor position
   - Pros: Maximum control, works in complex layouts
   - Cons: Most complex, potential accessibility issues

   **Recommended: Option B** (Balance of control and maintainability)

5. **Acceptance Criteria:**
   - [ ] All text inputs display thick block cursor (█ style)
   - [ ] Cursor blinks at ~530ms interval (classic DOS timing)
   - [ ] Cursor restarts blink cycle on keypress
   - [ ] Cursor hidden when input not focused
   - [ ] Cursor respects `prefers-reduced-motion` media query
   - [ ] Cursor visible and properly positioned in all themes
   - [ ] Cursor doesn't interfere with text selection
   - [ ] Works correctly in multi-line inputs (Textarea)
   - [ ] Kitchen Sink demo showcases cursor behavior
   - [ ] Documentation includes cursor customization guide

6. **Blockers/Risks:**
   - Browser compatibility (test in Chrome, Firefox, Safari, Edge)
   - Performance with many simultaneous inputs
   - Cursor position accuracy with variable-width fonts (use monospace!)
   - Mobile/touch devices (may need different approach)

**This is non-negotiable.** A DOS library without a proper DOS cursor is like a pizza without cheese. Let's make this happen! 🔥

**Added:** 2026-01-23
**Assignee:** TBD

---

### MenuBar — First Menu Item Incorrectly Highlighted

**Priority:** 🔴 **CRITICAL**
**Impact:** User experience, interaction fidelity, DOS authenticity
**Effort:** Medium

**Description:**
When expanding a menu in the MenuBar, the first item in the menu often retains a highlight style regardless of what item the user is hovering over or navigating to with the keyboard. This breaks the fundamental interaction model of menu navigation.

**Why it exists:**
Likely an initialization issue where the first item gets a default focus/highlight state that isn't properly cleared when the user interacts with other items.

**Proposed solution:**
- Review MenuBar highlight state management
- Ensure highlight state is exclusively tied to actual hover/focus
- Only one item should be highlighted at a time
- Match native DOS menu behavior exactly
- Test with both mouse and keyboard navigation

**Added:** 2026-01-24
**Assignee:** TBD

---

### ContextMenu — Nested Submenu Highlight Bug

**Priority:** 🔴 **CRITICAL**
**Impact:** User experience, interaction fidelity, DOS authenticity
**Effort:** Medium

**Description:**
In nested submenus on the ContextMenu, when highlighting a menu option that isn't the top item, the top-level menu item incorrectly retains a highlight style. Only one item should be highlighted at a time per menu level. This needs to work like a regular DOS-style menu environment.

**Why it exists:**
State management for nested menus isn't properly isolating highlight states per level, or parent items are retaining hover styles when they shouldn't.

**Proposed solution:**
- Review highlight state propagation in nested menus
- Ensure parent menu items don't retain highlight when child menus are navigated
- Only one item highlighted per menu level
- Match native DOS context menu behavior
- Test thoroughly with deeply nested submenus

**Added:** 2026-01-24
**Assignee:** TBD

---

### Toast — Programmatic Control Demo Completely Broken

**Priority:** 🔴 **CRITICAL**
**Impact:** Developer experience, documentation quality, demo credibility
**Effort:** Medium

**Description:**
The programmatic control section on the Toast demo page is fundamentally broken:
- "Create Toast" creates a semi-permanent modal in the bottom left instead of an example toast
- Other buttons throw console errors
- Sometimes shows "CREATE A TOAST FIRST!" message incorrectly
- The entire section doesn't work as expected

**Why it exists:**
The demo implementation doesn't properly manage toast instances and their lifecycle.

**Proposed solution:**
Complete rework of the Toast programmatic control demo:
1. "Create Toast" should create a visible example toast
2. All control buttons should operate on that specific toast instance
3. Clear visual feedback for each action
4. No console errors
5. Proper cleanup when toast is dismissed
6. Consider showing toast near the code example for consistency

**Added:** 2026-01-24
**Assignee:** TBD

---

### Alerts & Toasts — Need Background Color for Visibility

**Priority:** 🔴 **CRITICAL**
**Impact:** Visibility, accessibility, usability
**Effort:** Small

**Description:**
Alerts and Toasts don't have sufficient background styling, making them hard to see against various page backgrounds. These are critical UI feedback elements that must be immediately visible to users.

**Why it exists:**
Initial implementation may have assumed a specific background context or relied on inherited styles.

**Proposed solution:**
- Add solid background colors to Alert and Toast components
- Use appropriate DOS color palette (blue, black, or themed)
- Ensure high contrast between background and text
- Test visibility against all common page backgrounds
- Update Kitchen Sink demos to showcase visibility

**Added:** 2026-01-24
**Assignee:** TBD

---

### SkeletonLoader — Animation Not Working

**Priority:** 🔴 **CRITICAL**
**Impact:** Visual feedback, perceived performance, spec compliance
**Effort:** Small-Medium

**Description:**
The skeleton loader animation isn't working in the Kitchen Sink demo. The spec requires subtle animations on the skeleton loader to indicate loading state, but currently it appears static.

**Why it exists:**
Animation CSS may not be properly applied, or there's a conflict with other styles preventing the animation from running.

**Proposed solution:**
- Review SkeletonLoader CSS animation implementation
- Verify keyframes are properly defined
- Check for CSS specificity issues blocking animation
- Ensure animation respects `prefers-reduced-motion`
- Test in multiple browsers
- Update Kitchen Sink to clearly demonstrate animation

**Added:** 2026-01-24
**Assignee:** TBD

---

### Card, Timeline, EmptyState — Demo Layout Inconsistent with Site Standards

**Priority:** 🔴 **CRITICAL**
**Impact:** Documentation consistency, developer experience, project standards
**Effort:** Medium

**Description:**
The Card, Timeline, and EmptyState Kitchen Sink demo pages have a fundamentally different layout than the rest of the site:
1. Code examples are all grouped at the bottom of the page instead of appearing inline with each demo
2. Examples on Timeline appear outside the bordered example boxes
3. This breaks the established pattern where each demo section has its own code snippet displayed immediately below

**Why it exists:**
These components were implemented in a batch and used a different demo page template/structure than earlier components.

**Proposed solution:**
- Refactor Card demo page to use `createDemoSection()` with inline code snippets per example
- Refactor Timeline demo page similarly, ensuring examples appear inside bordered boxes
- Refactor EmptyState demo page to match site-wide demo patterns
- Each demo should follow the pattern: Title → Description → Live Example → Code Snippet
- Reference working examples like Table, Button, or TextInput for correct structure

**Added:** 2026-01-24
**Assignee:** TBD

---

## 🟡 Medium Priority

_Issues that impact code quality or maintainability but don't block development._

### Table — Selection Brackets Wrapping at Narrow Widths

**Priority:** 🟡 Medium
**Impact:** Visual consistency, DOS aesthetic
**Effort:** Small

**Description:**
In selectable row tables, the "[ ]" selection indicator brackets are wrapping to separate lines at certain viewport dimensions. The title column displays fine, but the selection brackets in data rows are wrapping. The brackets should remain on a single line as "[ ]" regardless of table width.

**Why it exists:**
Missing `white-space: nowrap` or similar constraint on the selection cell.

**Proposed solution:**
- Add `white-space: nowrap` to the selection cell class
- Ensure minimum width for selection column
- Consider using a fixed width for the selection column
- Test at various viewport widths

**Added:** 2026-01-24
**Assignee:** TBD

---

### DataGrid — Pagination Select Column Truncating

**Priority:** 🟡 Medium
**Impact:** Visual consistency, usability
**Effort:** Small

**Description:**
On the DataGrid pagination example, the select column is truncating to display "[..." instead of the full "[ ]" brackets. The selection indicator should never be truncated.

**Why it exists:**
Column width is too narrow or text-overflow ellipsis is being applied to the selection cell.

**Proposed solution:**
- Ensure selection column has minimum width to fit "[ ]"
- Remove text-overflow: ellipsis from selection cells
- Add `white-space: nowrap` to selection cells
- Consider fixed width for selection column

**Added:** 2026-01-24
**Assignee:** TBD

---

### DataGrid — "Select All" Button Only Selects Current Page

**Priority:** 🟡 Medium
**Impact:** User experience, expected behavior
**Effort:** Medium

**Description:**
In the "All Features Combined" DataGrid example, the "Select All" button only selects rows on the current page. User expectation is that this button should select ALL rows in the entire dataset across all pages. The column header checkbox already handles page-level selection, so the button should differentiate by selecting the entire dataset.

**Why it exists:**
Implementation didn't distinguish between page-level selection (header checkbox) and dataset-level selection (button).

**Proposed solution:**
- Modify "Select All" button to select all rows across entire dataset
- Keep header checkbox behavior as page-level selection
- Update button label to clarify: "Select All (X total)" 
- Consider adding visual feedback showing total selected count
- Update API to support `selectAll(true)` for entire dataset vs page

**Added:** 2026-01-24
**Assignee:** TBD

---

### ListBox — Selection Indicators Wrapping Instead of "( )" or "[ ]"

**Priority:** 🟡 Medium
**Impact:** Visual consistency, DOS aesthetic, usability
**Effort:** Small

**Description:**
Nearly all ListBox examples (single select, multi select, rich items, disabled items, dense mode, scrollable list, etc.) show wrapped/broken selection indicators. The indicators should display as clean "( )" for radio-style or "[ ]" for checkbox-style on a single line, but instead they appear to be wrapping or displaying incorrectly.

**Why it exists:**
Missing nowrap constraints on list item selection indicator elements, or improper flex/inline-flex handling.

**Proposed solution:**
- Add `white-space: nowrap` to selection indicator container
- Ensure selection indicators have proper fixed width
- Review flex layout for list items to prevent indicator compression
- Test across all ListBox variants and modes
- Ensure consistent indicator display regardless of item content length

**Added:** 2026-01-24
**Assignee:** TBD

---

### TreeView — Ghost Brackets Appearing Behind Nodes

**Priority:** 🟡 Medium
**Impact:** Visual quality, aesthetic consistency
**Effort:** Medium

**Description:**
There's a visual bug in TreeView where additional/phantom square brackets appear behind or next to child node controls. For example, the first example shows a proper "[+]Documents" but there's another set of brackets visible beneath/behind it. This ghost bracket issue affects most examples on the TreeView page.

**Why it exists:**
Likely a CSS layering issue, duplicate element rendering, or ::before/::after pseudo-elements being displayed incorrectly. May also be connector line rendering interfering with node icons.

**Proposed solution:**
- Inspect DOM structure to identify source of extra brackets
- Check for duplicate elements or pseudo-elements
- Review z-index stacking of tree node elements
- Ensure only one set of expand/collapse brackets per node
- Check if connector lines are accidentally rendering bracket-like characters
- Test fix across all TreeView examples

**Added:** 2026-01-24
**Assignee:** TBD

---

### Modal — Artifact at Top Center of Title Bar

**Priority:** 🟡 Medium
**Impact:** Visual polish, aesthetic consistency
**Effort:** Small

**Description:**
There's a weird visual artifact at the top center of the Modal title bar. It's unclear if this is intentional or a bug.

**Why it exists:**
Possibly a CSS border/pseudo-element issue or an intentional design element that needs clarification.

**Proposed solution:**
- Investigate the source of the artifact
- Determine if it's intentional (DOS aesthetic choice)
- If unintentional, fix the CSS causing the artifact
- If intentional, document the design decision
- Update Kitchen Sink to clarify intent

**Added:** 2026-01-24
**Assignee:** TBD

---

### Window Demo — Inconsistent Window Launch Position

**Priority:** 🟡 Medium
**Impact:** Demo consistency, developer experience
**Effort:** Medium

**Description:**
On the Window page of the Kitchen Sink, all buttons that simulate different window configurations launch the window in the top open window space instead of near the button and code example. This is inconsistent with how the rest of the Kitchen Sink app works.

**Why it exists:**
Window component may have been implemented to always open at a fixed position rather than contextually.

**Proposed solution:**
- Modify Window demos to launch windows near their respective button/code sections
- Maintain consistency with rest of Kitchen Sink demo patterns
- Consider a "demo container" pattern for windowed components
- Each window configuration should appear near its code example

**Added:** 2026-01-24
**Assignee:** TBD

---

### Alert — Dismissible Alert Demo Button Doesn't Reshow Alert

**Priority:** 🟡 Medium
**Impact:** Demo functionality, developer experience
**Effort:** Small

**Description:**
The "Show Dismissible Alert" button doesn't re-show the alert after it's been dismissed, making the button essentially useless after first use.

**Why it exists:**
Demo implementation doesn't recreate or reset the alert after dismissal.

**Proposed solution:**
- Implement alert re-creation when button is clicked after dismissal
- Or toggle visibility instead of destroying element
- Button should always work to show the dismissible alert example
- Consider adding visual feedback when alert is already visible

**Added:** 2026-01-24
**Assignee:** TBD

---

### ProgressBar — Boxed-Style Static Display Incorrect

**Priority:** 🟡 Medium
**Impact:** Visual correctness, DOS authenticity
**Effort:** Small

**Description:**
The boxed-style progress bar doesn't look formatted correctly in the Kitchen Sink. The square brackets don't properly surround the "bar" visually. The animated example with box style looks fine, but the static display is very wrong.

**Why it exists:**
Likely a CSS or character spacing issue specific to the static display rendering.

**Proposed solution:**
- Review boxed-style progress bar CSS
- Ensure brackets properly surround the progress fill
- Compare static vs animated implementations
- Fix alignment/spacing issues
- Test with various progress values (0%, 50%, 100%)

**Added:** 2026-01-24
**Assignee:** TBD

---

### LoadingSpinner — Extraneous Circle Character

**Priority:** 🟡 Medium
**Impact:** Visual clarity, aesthetic consistency
**Effort:** Small

**Description:**
Each LoadingSpinner example shows a small circle character next to the animated spinner portion. This appears to be unintentional and clutters the visual presentation.

**Why it exists:**
Possibly a placeholder character, debug artifact, or unintended rendering of spinner state.

**Proposed solution:**
- Identify source of the circle character
- Remove the extraneous character
- Keep only the animated spinner portion
- Test across all spinner variants
- Update Kitchen Sink demos

**Added:** 2026-01-24
**Assignee:** TBD

---

### LoadingSpinner — In-Context Button Spinner Invisible

**Priority:** 🟡 Medium
**Impact:** Visibility, usability
**Effort:** Small

**Description:**
In the "in context" spinner example, when a spinner is added to a button, it's impossible to see. The spinner and button appear to use the same color, making the spinner invisible.

**Why it exists:**
Spinner color isn't adapting to the button's background/text context.

**Proposed solution:**
- Ensure spinner color contrasts with its container
- Inherit or invert colors based on context
- Add CSS custom property for spinner color override
- Test spinner visibility in all container contexts
- Update in-context demo to show proper visibility

**Added:** 2026-01-24
**Assignee:** TBD

---

### MenuBar — Programmatic Control Doesn't Open Menus

**Priority:** 🟡 Medium
**Impact:** Demo functionality, documentation quality
**Effort:** Small

**Description:**
In the MenuBar programmatic control section, "Open File Menu" and "Open Edit Menu" buttons only highlight the menu items but don't actually open the dropdown menus.

**Why it exists:**
Programmatic API may only be setting visual state without triggering the actual open behavior.

**Proposed solution:**
- Review MenuBar's programmatic open API
- Ensure `open()` method actually expands the menu dropdown
- Update demo to properly demonstrate menu opening
- Add visual confirmation of menu state

**Added:** 2026-01-24
**Assignee:** TBD

---

### DropdownMenu — Programmatic Control Broken

**Priority:** 🟡 Medium
**Impact:** Demo functionality, documentation quality
**Effort:** Small

**Description:**
Programmatic control buttons on the DropdownMenu page don't open/close the menu as expected.

**Why it exists:**
Programmatic API implementation incomplete or demo not properly wired.

**Proposed solution:**
- Review DropdownMenu open/close programmatic API
- Fix demo button handlers to properly control menu state
- Add clear visual feedback for menu state changes
- Ensure consistency with other menu component APIs

**Added:** 2026-01-24
**Assignee:** TBD

---

### ContextMenu — Programmatic Control Unclear/Broken

**Priority:** 🟡 Medium
**Impact:** Demo functionality, developer experience
**Effort:** Small

**Description:**
Programmatic control on the ContextMenu page doesn't seem to do anything visible, or if it does, the effect is unclear. Developers using the Kitchen Sink as documentation need clear, working examples.

**Why it exists:**
ContextMenu programmatic control may be partially implemented or demo doesn't clearly show the effect.

**Proposed solution:**
- Review ContextMenu programmatic API
- Determine what actions should be demonstrable (show at position, hide, etc.)
- Implement clear visual feedback for each action
- Ensure demo is useful for developers learning the API
- Add descriptive labels explaining what each button does

**Added:** 2026-01-24
**Assignee:** TBD

---

### Popover — Missing Background Color Option + Broken Demo

**Priority:** 🟡 Medium
**Impact:** Visibility, customization, demo quality
**Effort:** Medium

**Description:**
Popovers should have an option for a background color for visibility. Additionally, the programmatic control section on the Popover page is broken and needs a complete rework. Need to clarify what we're trying to demo and the best way to demonstrate it.

**Why it exists:**
Initial implementation may have assumed transparent/inherited background. Demo section not properly thought through.

**Proposed solution:**
- Add `backgroundColor` prop to Popover component
- Default to appropriate DOS-style background (blue or black)
- Rework programmatic control demo:
  - Clear purpose for each demo button
  - Show popover positioning options
  - Demonstrate show/hide programmatically
  - Add visual feedback for popover state
- Make demo useful for developers

**Added:** 2026-01-24
**Assignee:** TBD

---

### Sidebar — Collapsible Sections Content Overflow

**Priority:** 🟡 Medium
**Impact:** Layout correctness, usability
**Effort:** Small

**Description:**
In the Sidebar collapsible sections demo, the events list overflows the section container instead of showing a scrollbar.

**Why it exists:**
Missing `overflow: auto` or similar constraint on the collapsible section content area.

**Proposed solution:**
- Add proper overflow handling to collapsible section content
- Implement scrollbar when content exceeds container height
- Style scrollbar to match DOS aesthetic
- Test with varying content lengths
- Update Kitchen Sink demo to showcase scrolling behavior

**Added:** 2026-01-24
**Assignee:** TBD

---

### Stepper — Completed Steps Missing Selected Visual Indicator

**Priority:** 🟡 Medium
**Impact:** User experience, visual feedback
**Effort:** Small

**Description:**
In the Stepper clickable steps demo, clicking on an already completed step doesn't show a visual indicator that it's currently selected. Other steps get a yellow highlight when selected, but completed steps just retain the green checkmark with no selection indicator.

**Why it exists:**
Selection state styling doesn't account for the intersection of "completed" and "selected" states.

**Proposed solution:**
- Create combined visual state for "completed + selected" steps
- Options:
  - Add yellow border/glow around green completed step
  - Use different shade of green for selected completed step
  - Add selection indicator that overlays completion indicator
- Ensure both states (complete AND selected) are visually communicated
- Test with multi-step navigation scenarios

**Added:** 2026-01-24
**Assignee:** TBD

---

### DatePicker — Support Keyboard Input

**Priority:** 🟡 Medium
**Impact:** User experience, accessibility
**Effort:** Medium

**Description:**
Currently, the DatePicker only supports clicking to select dates. Users should be able to type dates directly into the input field for faster data entry.

**Why it exists:**
Initial implementation focused on the calendar picker UI. Keyboard input parsing was deferred.

**Proposed solution:**
- Add text input field to DatePicker
- Parse typed dates in common formats (MM/DD/YYYY, YYYY-MM-DD, etc.)
- Validate input and provide real-time feedback
- Maintain calendar picker as alternative input method
- Handle invalid input gracefully

**Added:** 2026-01-23
**Assignee:** TBD

### Form Components — Demonstrate Real-Time Validation

**Priority:** 🟡 Medium
**Impact:** Developer experience, documentation completeness
**Effort:** Small

**Description:**
Need to assess how "required" properties work across form components and provide Kitchen Sink examples showing real-time input validation wiring. Developers need clear patterns for connecting validation to user feedback.

**Why it exists:**
Components were implemented individually without a unified validation demonstration. The `required` property exists but its integration with FormValidation isn't clearly shown.

**Proposed solution:**
- Review all form components for `required` property implementation
- Create comprehensive Kitchen Sink section showing:
  - Basic required field validation
  - Real-time validation with FormValidation utils
  - Error state display and clearing
  - Complete form validation patterns
- Document best practices for validation wiring

**Added:** 2026-01-23
**Assignee:** TBD

---

## 🟢 Low Priority

_Minor improvements, optimizations, or refactoring opportunities._

### Tooltip — Redundant Hover vs Focus Demo Buttons

**Priority:** 🟢 Low
**Impact:** Demo clarity
**Effort:** Small

**Description:**
In the Basic Tooltips section, the "Hover" vs "Focus" buttons appear functionally identical as implemented. The trigger modes section demonstrates the difference correctly, but the basic tooltips section is redundant.

**Why it exists:**
Demo may have been set up before trigger mode implementation was complete, or both buttons were given the same trigger behavior.

**Proposed solution:**
- Simplify basic tooltips demo to a single button with hover trigger
- Let the "Trigger Modes" section handle the hover/focus/click differentiation
- Remove redundancy from the demo
- Update section heading to just "Basic Tooltip"

**Added:** 2026-01-24
**Assignee:** TBD

---

## 📝 Debt Log

Use this format when adding new technical debt:

```markdown
### [Component/Area] — Brief Description

**Priority:** 🔴 Critical / 🟡 Medium / 🟢 Low
**Impact:** [What this affects]
**Effort:** [Estimated complexity: Small / Medium / Large]

**Description:**
[Detailed explanation of the issue]

**Why it exists:**
[Context on why this debt was incurred]

**Proposed solution:**
[How this could be addressed]

**Added:** [Date]
**Assignee:** [Name or TBD]
```

---

## ✅ Resolved Debt

Archive resolved items here for historical reference.

### Example Entry (delete when first real debt is added)

**[Component] — Example issue**
- **Resolved:** 2026-01-23
- **Solution:** Brief description of fix
- **PR/Commit:** [Reference]

---

*Last updated: January 24, 2026*
