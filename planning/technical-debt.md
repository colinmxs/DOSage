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

## 🟡 Medium Priority

_Issues that impact code quality or maintainability but don't block development._

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

### None currently identified

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

*Last updated: January 23, 2026*
