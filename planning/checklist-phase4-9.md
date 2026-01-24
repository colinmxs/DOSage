# DOSage Implementation Checklist — Phases 4–9

> Part 2 of 3: Button & Link Components through Data Display Components

---

## Phase 4: Button & Link Components

### 4.1 Button

**File:** `src/components/Button/Button.ts`
**Styles:** `src/components/Button/Button.css`
**Types:** `src/components/Button/Button.types.ts`
**Tests:** `tests/components/Button.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ButtonProps`
  - [x] Prop: `label` (string) — button text content
  - [x] Prop: `variant` (ButtonVariant) — 'primary' | 'secondary' | 'danger' | 'ghost'
  - [x] Prop: `size` (ButtonSize) — 'small' | 'medium' | 'large'
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `loading` (boolean) — shows loading state
  - [x] Prop: `type` (string) — 'button' | 'submit' | 'reset'
  - [x] Prop: `icon` (string) — optional icon/character prefix
  - [x] Prop: `iconPosition` ('left' | 'right') — icon placement
  - [x] Prop: `fullWidth` (boolean) — expand to container width
  - [x] Prop: `onClick` (function) — click handler
- [x] Implement base component with thick DOS-style borders
- [x] Implement variants
  - [x] Variant: `primary` — highlighted action, uses `--dos-color-primary`
  - [x] Variant: `secondary` — standard action, uses `--dos-color-fg`
  - [x] Variant: `danger` — destructive action, uses `--dos-color-error`
  - [x] Variant: `ghost` — minimal/text-only appearance
- [x] Implement sizes
  - [x] Size: `small` — compact padding, `--dos-font-size-sm`
  - [x] Size: `medium` — default size, `--dos-font-size`
  - [x] Size: `large` — generous padding, `--dos-font-size-lg`
- [x] Implement states: default, hover, focus, active, disabled, loading
- [x] Add loading state with ASCII spinner animation
- [x] Add CSS styles with class `.dos-button`
  - [x] `.dos-button--primary`
  - [x] `.dos-button--secondary`
  - [x] `.dos-button--danger`
  - [x] `.dos-button--ghost`
  - [x] `.dos-button--small`
  - [x] `.dos-button--medium`
  - [x] `.dos-button--large`
  - [x] `.dos-button--loading`
  - [x] `.dos-button--disabled`
  - [x] `.dos-button--full-width`
- [x] Add keyboard navigation
  - [x] `Enter` — activate button
  - [x] `Space` — activate button
- [x] Add ARIA attributes
  - [x] `role="button"` (if not using `<button>`)
  - [x] `aria-disabled` — when disabled
  - [x] `aria-busy` — when loading
  - [x] `aria-label` — when icon-only
- [x] Write unit tests
  - [x] Test: renders with correct label
  - [x] Test: applies variant classes correctly
  - [x] Test: applies size classes correctly
  - [x] Test: handles click events
  - [x] Test: respects disabled state
  - [x] Test: shows loading state
  - [x] Test: keyboard activation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] All variants showcase
  - [x] All sizes showcase
  - [x] States demonstration (loading, disabled)
  - [x] Code snippet displayed

> **Accessibility:** Ensure visible focus indicator with high contrast. Loading state announced to screen readers.
> **Keyboard:** `Enter`, `Space` to activate

---

### 4.2 ButtonGroup

**File:** `src/components/ButtonGroup/ButtonGroup.ts`
**Styles:** `src/components/ButtonGroup/ButtonGroup.css`
**Types:** `src/components/ButtonGroup/ButtonGroup.types.ts`
**Tests:** `tests/components/ButtonGroup.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ButtonGroupProps`
  - [x] Prop: `orientation` ('horizontal' | 'vertical') — layout direction
  - [x] Prop: `connected` (boolean) — buttons share borders
  - [x] Prop: `size` (ButtonSize) — applies to all children
  - [x] Prop: `variant` (ButtonVariant) — applies to all children
  - [x] Prop: `children` (Button[]) — button components
- [x] Implement base component as flex container
- [x] Implement orientation modes
  - [x] Horizontal: buttons in a row
  - [x] Vertical: buttons in a column
- [x] Implement connection modes
  - [x] Connected: shared borders, rounded only on outer edges
  - [x] Separated: gap between buttons
- [x] Add CSS styles with class `.dos-button-group`
  - [x] `.dos-button-group--horizontal`
  - [x] `.dos-button-group--vertical`
  - [x] `.dos-button-group--connected`
  - [x] `.dos-button-group--separated`
- [x] Add keyboard navigation
  - [x] `Tab` — move between buttons
  - [x] `Arrow keys` — navigate within connected group
- [x] Add ARIA attributes
  - [x] `role="group"`
  - [x] `aria-label` — group description
- [x] Write unit tests
  - [x] Test: renders children correctly
  - [x] Test: applies orientation class
  - [x] Test: connected mode removes inner borders
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Horizontal connected example
  - [x] Vertical separated example
  - [x] Code snippet displayed

> **Accessibility:** Group announced as toolbar/group. Arrow key navigation for connected groups.
> **Keyboard:** `Tab` between groups, `Arrow keys` within connected group

---

### 4.3 IconButton

**File:** `src/components/IconButton/IconButton.ts`
**Styles:** `src/components/IconButton/IconButton.css`
**Types:** `src/components/IconButton/IconButton.types.ts`
**Tests:** `tests/components/IconButton.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `IconButtonProps`
  - [x] Prop: `icon` (string) — icon character or ASCII art
  - [x] Prop: `label` (string) — accessible label (required)
  - [x] Prop: `variant` (ButtonVariant) — same as Button
  - [x] Prop: `size` (ButtonSize) — same as Button
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onClick` (function) — click handler
- [x] Implement square button with centered icon
- [x] Implement variants (inherit from Button)
- [x] Implement states: default, hover, focus, active, disabled
- [x] Add CSS styles with class `.dos-icon-button`
  - [x] Ensure square aspect ratio
  - [x] Center icon content
  - [x] Inherit variant styles from Button
- [x] Add keyboard navigation
  - [x] `Enter` — activate button
  - [x] `Space` — activate button
- [x] Add ARIA attributes
  - [x] `aria-label` — required, describes action
  - [x] `aria-disabled` — when disabled
- [x] Write unit tests
  - [x] Test: renders icon correctly
  - [x] Test: maintains square shape
  - [x] Test: applies variant classes
  - [x] Test: requires accessible label
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Common icon examples (`X`, `?`, `i`, `▲`, `▼`)
  - [x] All variants showcase
  - [x] Code snippet displayed

> **Accessibility:** MUST have aria-label since no visible text. Announce as button.
> **Keyboard:** `Enter`, `Space` to activate

---

### 4.4 Link

**File:** `src/components/Link/Link.ts`
**Styles:** `src/components/Link/Link.css`
**Types:** `src/components/Link/Link.types.ts`
**Tests:** `tests/components/Link.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `LinkProps`
  - [x] Prop: `href` (string) — link destination
  - [x] Prop: `label` (string) — link text
  - [x] Prop: `target` (string) — '_blank', '_self', etc.
  - [x] Prop: `external` (boolean) — opens in new tab with icon
  - [x] Prop: `underline` ('always' | 'hover' | 'none') — underline style
  - [x] Prop: `disabled` (boolean) — prevents navigation
  - [x] Prop: `onClick` (function) — optional click handler
- [x] Implement base component using `<a>` element
- [x] Implement DOS-style appearance
  - [x] Primary color for link text
  - [x] Underline using low-line or box characters
  - [x] Visited state with different color
- [x] Implement states: default, hover, focus, active, visited, disabled
- [x] Add CSS styles with class `.dos-link`
  - [x] `.dos-link--underline-always`
  - [x] `.dos-link--underline-hover`
  - [x] `.dos-link--underline-none`
  - [x] `.dos-link--external`
  - [x] `.dos-link--disabled`
  - [x] `.dos-link--visited`
- [x] Add keyboard navigation
  - [x] `Enter` — activate link
- [x] Add ARIA attributes
  - [x] `aria-disabled` — when disabled
  - [x] `rel="noopener noreferrer"` — for external links
- [x] Write unit tests
  - [x] Test: renders anchor with correct href
  - [x] Test: applies underline styles
  - [x] Test: handles external links correctly
  - [x] Test: respects disabled state
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic link example
  - [x] External link with icon
  - [x] Underline variants
  - [x] Code snippet displayed

> **Accessibility:** Use semantic `<a>` element. External links should indicate opening in new window.
> **Keyboard:** `Enter` to activate

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 4

---

## Phase 5: Form Controls (Basic)

### 5.1 TextInput

**File:** `src/components/TextInput/TextInput.ts`
**Styles:** `src/components/TextInput/TextInput.styles.css`
**Types:** `src/components/TextInput/TextInput.types.ts`
**Tests:** `tests/components/TextInput.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TextInputProps`
  - [x] Prop: `value` (string) — current value
  - [x] Prop: `placeholder` (string) — placeholder text
  - [x] Prop: `label` (string) — associated label text
  - [x] Prop: `name` (string) — form field name
  - [x] Prop: `type` (string) — 'text', 'email', 'tel', 'url', etc.
  - [x] Prop: `disabled` (boolean) — disables input
  - [x] Prop: `readonly` (boolean) — prevents editing
  - [x] Prop: `required` (boolean) — marks as required
  - [x] Prop: `error` (string | boolean) — error state/message
  - [x] Prop: `maxLength` (number) — character limit
  - [x] Prop: `onChange` (function) — change handler
  - [x] Prop: `onBlur` (function) — blur handler
- [x] Implement DOS-style bordered input box
- [x] Implement blinking cursor effect
- [x] Implement states: default, focus, error, disabled
- [x] Add CSS styles with class `.dos-text-input`
  - [x] `.dos-text-input___field`
  - [x] `.dos-text-input___label`
  - [x] `.dos-text-input___error`
  - [x] `.dos-text-input--focused`
  - [x] `.dos-text-input--error`
  - [x] `.dos-text-input--disabled`
- [x] Add keyboard navigation
  - [x] Standard text input keys
  - [x] `Tab` — focus next element
- [x] Add ARIA attributes
  - [x] `aria-invalid` — when error
  - [x] `aria-describedby` — links to error message
  - [x] `aria-required` — when required
- [x] Write unit tests
  - [x] Test: renders input with value
  - [x] Test: displays label correctly
  - [x] Test: handles input changes
  - [x] Test: shows error state
  - [x] Test: respects disabled state
  - [x] Test: enforces maxLength
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With placeholder
  - [x] With error state
  - [x] Disabled state
  - [x] Code snippet displayed

> **Accessibility:** Label must be associated with input. Error messages linked via aria-describedby.
> **Keyboard:** Standard text input behavior

---

### 5.2 Textarea

**File:** `src/components/Textarea/Textarea.ts`
**Styles:** `src/components/Textarea/Textarea.styles.css`
**Types:** `src/components/Textarea/Textarea.types.ts`
**Tests:** `tests/components/Textarea.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TextareaProps`
  - [x] Prop: `value` (string) — current value
  - [x] Prop: `placeholder` (string) — placeholder text
  - [x] Prop: `label` (string) — associated label text
  - [x] Prop: `name` (string) — form field name
  - [x] Prop: `rows` (number) — visible row count
  - [x] Prop: `cols` (number) — visible column count
  - [x] Prop: `resizable` (boolean | 'horizontal' | 'vertical' | 'both') — resize behavior
  - [x] Prop: `showCount` (boolean) — show character/line count
  - [x] Prop: `maxLength` (number) — character limit
  - [x] Prop: `disabled` (boolean) — disables input
  - [x] Prop: `error` (string | boolean) — error state/message
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement multi-line DOS-style text area
- [x] Implement character/line counter display
- [x] Implement resize handle (DOS-style grip)
- [x] Implement states: default, focus, error, disabled
- [x] Add CSS styles with class `.dos-textarea`
  - [x] `.dos-textarea___field`
  - [x] `.dos-textarea___label`
  - [x] `.dos-textarea___count`
  - [x] `.dos-textarea___error`
  - [x] `.dos-textarea--resizable`
  - [x] `.dos-textarea--focused`
  - [x] `.dos-textarea--error`
  - [x] `.dos-textarea--disabled`
- [x] Add keyboard navigation
  - [x] Standard textarea keys
  - [x] `Tab` — focus next element (not insert tab)
- [x] Add ARIA attributes
  - [x] `aria-invalid` — when error
  - [x] `aria-describedby` — links to error/count
- [x] Write unit tests
  - [x] Test: renders textarea with value
  - [x] Test: handles multi-line input
  - [x] Test: displays character count
  - [x] Test: respects maxLength
  - [x] Test: resize behavior works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With character count
  - [x] Resizable variants
  - [x] Code snippet displayed

> **Accessibility:** Character count announced dynamically. Resize grip must be keyboard accessible.
> **Keyboard:** Standard textarea behavior, resize via keyboard if possible

---

### 5.3 PasswordInput

**File:** `src/components/PasswordInput/PasswordInput.ts`
**Styles:** `src/components/PasswordInput/PasswordInput.styles.css`
**Types:** `src/components/PasswordInput/PasswordInput.types.ts`
**Tests:** `tests/components/PasswordInput.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `PasswordInputProps`
  - [x] Prop: `value` (string) — current value
  - [x] Prop: `placeholder` (string) — placeholder text
  - [x] Prop: `label` (string) — associated label text
  - [x] Prop: `name` (string) — form field name
  - [x] Prop: `maskChar` (string) — character for masking ('*' or '●')
  - [x] Prop: `showToggle` (boolean) — show/hide password toggle
  - [x] Prop: `disabled` (boolean) — disables input
  - [x] Prop: `error` (string | boolean) — error state/message
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement password input with masking
- [x] Implement show/hide toggle button
- [x] Implement states: default, focus, error, disabled, visible
- [x] Add CSS styles with class `.dos-password-input`
  - [x] `.dos-password-input___field`
  - [x] `.dos-password-input___toggle`
  - [x] `.dos-password-input--visible`
  - [x] `.dos-password-input--error`
- [x] Add keyboard navigation
  - [x] Standard input keys
  - [x] Toggle button keyboard accessible
- [x] Add ARIA attributes
  - [x] `type="password"` — native masking
  - [x] `aria-pressed` — on toggle button
  - [x] `aria-describedby` — links to instructions
- [x] Write unit tests
  - [x] Test: masks input correctly
  - [x] Test: toggle reveals/hides password
  - [x] Test: uses correct mask character
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With show/hide toggle
  - [x] Different mask characters
  - [x] Code snippet displayed

> **Accessibility:** Toggle button announces current state. Never expose password to screen readers.
> **Keyboard:** Standard input, toggle via `Enter`/`Space`

---

### 5.4 Checkbox

**File:** `src/components/Checkbox/Checkbox.ts`
**Styles:** `src/components/Checkbox/Checkbox.styles.css`
**Types:** `src/components/Checkbox/Checkbox.types.ts`
**Tests:** `tests/components/Checkbox.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `CheckboxProps`
  - [x] Prop: `checked` (boolean) — checked state
  - [x] Prop: `indeterminate` (boolean) — indeterminate state
  - [x] Prop: `label` (string) — checkbox label text
  - [x] Prop: `labelPosition` ('left' | 'right') — label placement
  - [x] Prop: `name` (string) — form field name
  - [x] Prop: `value` (string) — form value
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style checkbox
  - [x] Unchecked: `[ ]`
  - [x] Checked: `[X]` or `[✓]`
  - [x] Indeterminate: `[-]`
- [x] Implement states: unchecked, checked, indeterminate, hover, focus, disabled
- [x] Add CSS styles with class `.dos-checkbox`
  - [x] `.dos-checkbox___input`
  - [x] `.dos-checkbox___box`
  - [x] `.dos-checkbox___label`
  - [x] `.dos-checkbox--checked`
  - [x] `.dos-checkbox--indeterminate`
  - [x] `.dos-checkbox--disabled`
  - [x] `.dos-checkbox--label-left`
- [x] Add keyboard navigation
  - [x] `Space` — toggle checked state
  - [x] `Tab` — focus next element
- [x] Add ARIA attributes
  - [x] Native `<input type="checkbox">` or `role="checkbox"`
  - [x] `aria-checked` — 'true', 'false', 'mixed'
  - [x] `aria-disabled` — when disabled
- [x] Write unit tests
  - [x] Test: renders unchecked state
  - [x] Test: renders checked state
  - [x] Test: renders indeterminate state
  - [x] Test: toggles on click
  - [x] Test: toggles on Space key
  - [x] Test: respects disabled state
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] All states showcase
  - [x] Label positions
  - [x] Code snippet displayed

> **Accessibility:** Use native checkbox or proper ARIA. Indeterminate state uses `aria-checked="mixed"`.
> **Keyboard:** `Space` to toggle

---

### 5.5 RadioButton & RadioGroup

**File:** `src/components/RadioButton/RadioButton.ts`
**Styles:** `src/components/RadioButton/RadioButton.styles.css`
**Types:** `src/components/RadioButton/RadioButton.types.ts`
**Tests:** `tests/components/RadioButton.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `RadioButtonProps`
  - [x] Prop: `checked` (boolean) — selected state
  - [x] Prop: `label` (string) — radio label text
  - [x] Prop: `name` (string) — group name (required)
  - [x] Prop: `value` (string) — form value
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — change handler
- [x] Define TypeScript interface `RadioGroupProps`
  - [x] Prop: `name` (string) — group name
  - [x] Prop: `value` (string) — selected value
  - [x] Prop: `options` (RadioOption[]) — radio options
  - [x] Prop: `orientation` ('horizontal' | 'vertical') — layout
  - [x] Prop: `disabled` (boolean) — disables all radios
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style radio button
  - [x] Unselected: `( )`
  - [x] Selected: `(•)` or `(●)`
- [x] Implement RadioGroup container
- [x] Implement states: unselected, selected, hover, focus, disabled
- [x] Add CSS styles with class `.dos-radio`
  - [x] `.dos-radio___input`
  - [x] `.dos-radio___circle`
  - [x] `.dos-radio___label`
  - [x] `.dos-radio--checked`
  - [x] `.dos-radio--disabled`
- [x] Add CSS styles with class `.dos-radio-group`
  - [x] `.dos-radio-group--horizontal`
  - [x] `.dos-radio-group--vertical`
- [x] Add keyboard navigation
  - [x] `Space` — select current radio
  - [x] `Arrow Up/Down` — navigate in vertical group
  - [x] `Arrow Left/Right` — navigate in horizontal group
- [x] Add ARIA attributes
  - [x] Native `<input type="radio">` or `role="radio"`
  - [x] `role="radiogroup"` — on container
  - [x] `aria-checked` — 'true' or 'false'
- [x] Write unit tests
  - [x] Test: renders unselected state
  - [x] Test: renders selected state
  - [x] Test: only one can be selected in group
  - [x] Test: arrow keys navigate group
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic group example
  - [x] Horizontal and vertical layouts
  - [x] Code snippet displayed

> **Accessibility:** RadioGroup must have role="radiogroup". Arrow keys move selection within group.
> **Keyboard:** `Space` to select, `Arrow keys` to navigate

---

### 5.6 FormGroup / Fieldset

**File:** `src/components/FormGroup/FormGroup.ts`
**Styles:** `src/components/FormGroup/FormGroup.styles.css`
**Types:** `src/components/FormGroup/FormGroup.types.ts`
**Tests:** `tests/components/FormGroup.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `FormGroupProps`
  - [x] Prop: `legend` (string) — fieldset legend/title
  - [x] Prop: `description` (string) — helper text
  - [x] Prop: `error` (string) — group-level error message
  - [x] Prop: `required` (boolean) — indicates required fields
  - [x] Prop: `disabled` (boolean) — disables all children
  - [x] Prop: `children` (Element[]) — form controls
- [x] Implement using semantic `<fieldset>` and `<legend>`
- [x] Implement DOS-style border using box-drawing characters
  - [x] Top: `┌─ Legend ─────────┐`
  - [x] Sides: `│                 │`
  - [x] Bottom: `└─────────────────┘`
- [x] Add CSS styles with class `.dos-form-group`
  - [x] `.dos-form-group___legend`
  - [x] `.dos-form-group___content`
  - [x] `.dos-form-group___description`
  - [x] `.dos-form-group___error`
  - [x] `.dos-form-group--error`
  - [x] `.dos-form-group--disabled`
- [x] Add ARIA attributes
  - [x] Native `<fieldset>` provides grouping
  - [x] `aria-describedby` — links to description/error
- [x] Write unit tests
  - [x] Test: renders fieldset with legend
  - [x] Test: displays description text
  - [x] Test: shows error state
  - [x] Test: disables children when disabled
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic grouped form controls
  - [x] With description and error
  - [x] Code snippet displayed

> **Accessibility:** Use semantic `<fieldset>`/`<legend>`. Groups related form controls logically.
> **Keyboard:** Standard form navigation

---

### 5.7 FormValidation

**File:** `src/components/FormValidation/FormValidation.ts`
**Styles:** `src/components/FormValidation/FormValidation.styles.css`
**Types:** `src/components/FormValidation/FormValidation.types.ts`
**Tests:** `tests/components/FormValidation.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `FormValidationProps`
  - [x] Prop: `message` (string) — validation message
  - [x] Prop: `type` ('error' | 'warning' | 'success' | 'info') — message type
  - [x] Prop: `icon` (boolean | string) — show/custom icon
  - [x] Prop: `visible` (boolean) — controls visibility
  - [x] Prop: `id` (string) — for aria-describedby linking
- [x] Implement error message display component
- [x] Implement type-based icons
  - [x] Error: `✗` or `[!]`
  - [x] Warning: `⚠` or `[?]`
  - [x] Success: `✓` or `[√]`
  - [x] Info: `ℹ` or `[i]`
- [x] Add CSS styles with class `.dos-form-validation`
  - [x] `.dos-form-validation___icon`
  - [x] `.dos-form-validation___message`
  - [x] `.dos-form-validation--error`
  - [x] `.dos-form-validation--warning`
  - [x] `.dos-form-validation--success`
  - [x] `.dos-form-validation--info`
- [x] Add ARIA attributes
  - [x] `role="alert"` — for errors (live region)
  - [x] `aria-live="polite"` — for non-error messages
- [x] Write unit tests
  - [x] Test: renders message correctly
  - [x] Test: applies type-specific styles
  - [x] Test: shows appropriate icon
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] All message types
  - [x] With form field integration
  - [x] Code snippet displayed
- [x] Add "Real-time Validation" demo section
  - [x] Create interactive form with multiple fields
    - [x] Username field (required, minLength: 3)
    - [x] Email field (required, email format)
    - [x] Password field (required, minLength: 8)
    - [x] Confirm password field (must match password)
  - [x] Implement validation on blur (when leaving field)
  - [x] Show validation errors using `setError()` method
  - [x] Clear errors when input becomes valid
  - [x] Show success state when field is valid
  - [x] Add form submit button that validates all fields
  - [x] Display overall form validity state
  - [x] Add code snippet showing the wiring pattern

> **Accessibility:** Error messages use `role="alert"` for immediate announcement. Link to inputs via `aria-describedby`.
> **Keyboard:** Not interactive

---

### 5.8 Validation Utilities

**File:** `src/utils/validators.ts`
**Types:** `src/utils/validators.types.ts`
**Tests:** `tests/utils/validators.test.ts`

- [x] Create utils directory structure
- [x] Define TypeScript interfaces
  - [x] `ValidationResult` — { valid: boolean; message?: string }
  - [x] `ValidatorFn` — (value: string) => ValidationResult
  - [x] `ValidatorOptions` — configuration for each validator
- [x] Implement core validators
  - [x] `validators.required(options?)` — checks for non-empty value
  - [x] `validators.email(options?)` — validates email format
  - [x] `validators.minLength(min, options?)` — minimum character count
  - [x] `validators.maxLength(max, options?)` — maximum character count
  - [x] `validators.pattern(regex, options?)` — custom regex pattern
  - [x] `validators.matches(fieldName, options?)` — matches another field (e.g., confirm password)
- [x] Implement validator composition
  - [x] `validators.compose(...validators)` — combine multiple validators
  - [x] `validators.custom(fn, message)` — create custom validator
- [x] Allow custom error messages per validator
- [x] Export from main `src/index.ts`
- [x] Write unit tests
  - [x] Test: required validator with empty/non-empty values
  - [x] Test: email validator with valid/invalid emails
  - [x] Test: minLength/maxLength boundaries
  - [x] Test: pattern matching
  - [x] Test: compose combines validators correctly
  - [x] Test: custom validator works
- [x] Add JSDoc documentation for all exports

> **Note:** These are optional utilities — developers can use any validation library they prefer.

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 5

---

## Phase 6: Form Controls (Advanced)

### 6.1 Select / Dropdown

**File:** `src/components/Select/Select.ts`
**Styles:** `src/components/Select/Select.styles.css`
**Types:** `src/components/Select/Select.types.ts`
**Tests:** `tests/components/Select.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `SelectProps`
  - [x] Prop: `value` (string | string[]) — selected value(s)
  - [x] Prop: `options` (SelectOption[]) — available options
  - [x] Prop: `placeholder` (string) — placeholder text
  - [x] Prop: `label` (string) — associated label
  - [x] Prop: `multiple` (boolean) — allow multiple selection
  - [x] Prop: `searchable` (boolean) — filter options
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `error` (string | boolean) — error state
  - [x] Prop: `onChange` (function) — change handler
- [x] Define TypeScript interface `SelectOption`
  - [x] Prop: `value` (string) — option value
  - [x] Prop: `label` (string) — display text
  - [x] Prop: `disabled` (boolean) — option disabled
  - [x] Prop: `group` (string) — optgroup label
- [x] Implement DOS-style select with dropdown
- [x] Implement arrow indicator: `▼`
- [x] Implement dropdown list styling
- [x] Implement states: default, open, focus, error, disabled
- [x] Add CSS styles with class `.dos-select`
  - [x] `.dos-select___trigger`
  - [x] `.dos-select___arrow`
  - [x] `.dos-select___dropdown`
  - [x] `.dos-select___option`
  - [x] `.dos-select___option--selected`
  - [x] `.dos-select___option--highlighted`
  - [x] `.dos-select___option--disabled`
  - [x] `.dos-select___group`
  - [x] `.dos-select--open`
  - [x] `.dos-select--error`
  - [x] `.dos-select--disabled`
- [x] Add keyboard navigation
  - [x] `Enter` / `Space` — open/close dropdown, select option
  - [x] `Arrow Up/Down` — navigate options
  - [x] `Home` / `End` — first/last option
  - [x] `Escape` — close dropdown
  - [x] Type-ahead — jump to matching option
- [x] Add ARIA attributes
  - [x] `role="combobox"` — on trigger
  - [x] `role="listbox"` — on dropdown
  - [x] `role="option"` — on options
  - [x] `aria-expanded` — dropdown state
  - [x] `aria-selected` — selected option
  - [x] `aria-activedescendant` — current focus
- [x] Write unit tests
  - [x] Test: renders with selected value
  - [x] Test: opens dropdown on click
  - [x] Test: selects option correctly
  - [x] Test: keyboard navigation works
  - [x] Test: type-ahead works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With option groups
  - [x] Searchable variant
  - [x] Code snippet displayed

> **Accessibility:** Full ARIA combobox pattern. Type-ahead for quick selection.
> **Keyboard:** `Enter`/`Space` to toggle, `Arrows` to navigate, `Escape` to close

---

### 6.2 Toggle / Switch

**File:** `src/components/Toggle/Toggle.ts`
**Styles:** `src/components/Toggle/Toggle.styles.css`
**Types:** `src/components/Toggle/Toggle.types.ts`
**Tests:** `tests/components/Toggle.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ToggleProps`
  - [x] Prop: `checked` (boolean) — toggle state
  - [x] Prop: `label` (string) — toggle label
  - [x] Prop: `labelPosition` ('left' | 'right') — label placement
  - [x] Prop: `onLabel` (string) — text when on (e.g., 'ON')
  - [x] Prop: `offLabel` (string) — text when off (e.g., 'OFF')
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style toggle
  - [x] Style A: `[ON ]` / `[OFF]`
  - [x] Style B: `[■──]` / `[──■]`
- [x] Implement states: off, on, hover, focus, disabled
- [x] Add CSS styles with class `.dos-toggle`
  - [x] `.dos-toggle___track`
  - [x] `.dos-toggle___thumb`
  - [x] `.dos-toggle___label`
  - [x] `.dos-toggle___state-label`
  - [x] `.dos-toggle--checked`
  - [x] `.dos-toggle--disabled`
- [x] Add keyboard navigation
  - [x] `Space` — toggle state
  - [x] `Enter` — toggle state
- [x] Add ARIA attributes
  - [x] `role="switch"`
  - [x] `aria-checked` — 'true' or 'false'
  - [x] `aria-disabled` — when disabled
- [x] Write unit tests
  - [x] Test: renders off state
  - [x] Test: renders on state
  - [x] Test: toggles on click
  - [x] Test: toggles on Space/Enter
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With ON/OFF labels
  - [x] Different visual styles
  - [x] Code snippet displayed

> **Accessibility:** Use `role="switch"` for proper semantics. Announce state changes.
> **Keyboard:** `Space`/`Enter` to toggle

---

### 6.3 Slider / Range

**File:** `src/components/Slider/Slider.ts`
**Styles:** `src/components/Slider/Slider.styles.css`
**Types:** `src/components/Slider/Slider.types.ts`
**Tests:** `tests/components/Slider.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `SliderProps`
  - [x] Prop: `value` (number | [number, number]) — current value(s)
  - [x] Prop: `min` (number) — minimum value
  - [x] Prop: `max` (number) — maximum value
  - [x] Prop: `step` (number) — increment step
  - [x] Prop: `label` (string) — slider label
  - [x] Prop: `showValue` (boolean) — display current value
  - [x] Prop: `showTicks` (boolean) — show tick marks
  - [x] Prop: `range` (boolean) — enable range selection
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style slider
  - [x] Track: `├──────────┤`
  - [x] Thumb: `█` or `▓`
  - [x] Fill: `████──────` (filled portion)
- [x] Implement range slider with two thumbs
- [x] Implement value display
- [x] Implement states: default, hover, focus, active, disabled
- [x] Add CSS styles with class `.dos-slider`
  - [x] `.dos-slider___track`
  - [x] `.dos-slider___fill`
  - [x] `.dos-slider___thumb`
  - [x] `.dos-slider___value`
  - [x] `.dos-slider___ticks`
  - [x] `.dos-slider--disabled`
  - [x] `.dos-slider--range`
- [x] Add keyboard navigation
  - [x] `Arrow Left/Down` — decrease value
  - [x] `Arrow Right/Up` — increase value
  - [x] `Home` — minimum value
  - [x] `End` — maximum value
  - [x] `Page Up/Down` — larger increments
- [x] Add ARIA attributes
  - [x] `role="slider"`
  - [x] `aria-valuemin`
  - [x] `aria-valuemax`
  - [x] `aria-valuenow`
  - [x] `aria-valuetext` — human-readable value
- [x] Write unit tests
  - [x] Test: renders with correct value
  - [x] Test: respects min/max bounds
  - [x] Test: keyboard changes value
  - [x] Test: mouse drag works
  - [x] Test: range mode works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] Range slider
  - [x] With ticks and value display
  - [x] Code snippet displayed

> **Accessibility:** Full slider ARIA pattern. Value text for screen readers.
> **Keyboard:** `Arrows` for small steps, `Page Up/Down` for large steps, `Home`/`End` for bounds

---

### 6.4 FileInput

**File:** `src/components/FileInput/FileInput.ts`
**Styles:** `src/components/FileInput/FileInput.styles.css`
**Types:** `src/components/FileInput/FileInput.types.ts`
**Tests:** `tests/components/FileInput.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `FileInputProps`
  - [x] Prop: `accept` (string) — accepted file types
  - [x] Prop: `multiple` (boolean) — allow multiple files
  - [x] Prop: `label` (string) — input label
  - [x] Prop: `buttonLabel` (string) — button text (e.g., 'Browse...')
  - [x] Prop: `dragDrop` (boolean) — enable drag and drop zone
  - [x] Prop: `showFileList` (boolean) — show selected files
  - [x] Prop: `maxSize` (number) — max file size in bytes
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — file selection handler
- [x] Implement DOS-style file input
- [x] Implement drag and drop zone with border
- [x] Implement file list display with remove option
- [x] Implement states: default, hover, dragover, disabled
- [x] Add CSS styles with class `.dos-file-input`
  - [x] `.dos-file-input___button`
  - [x] `.dos-file-input___dropzone`
  - [x] `.dos-file-input___file-list`
  - [x] `.dos-file-input___file-item`
  - [x] `.dos-file-input--dragover`
  - [x] `.dos-file-input--disabled`
- [x] Add keyboard navigation
  - [x] `Enter` / `Space` — open file dialog
  - [x] File list keyboard accessible
- [x] Add ARIA attributes
  - [x] `aria-describedby` — describes accepted types
  - [x] Dropzone announces drag state
- [x] Write unit tests
  - [x] Test: opens file dialog
  - [x] Test: accepts correct file types
  - [x] Test: drag and drop works
  - [x] Test: displays file list
  - [x] Test: removes files
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic file input
  - [x] Drag and drop zone
  - [x] With file list
  - [x] Code snippet displayed

> **Accessibility:** Announce selected files. Dropzone state announced for drag events.
> **Keyboard:** `Enter`/`Space` to open dialog

---

### 6.5 DatePicker

**File:** `src/components/DatePicker/DatePicker.ts`
**Styles:** `src/components/DatePicker/DatePicker.styles.css`
**Types:** `src/components/DatePicker/DatePicker.types.ts`
**Tests:** `tests/components/DatePicker.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `DatePickerProps`
  - [x] Prop: `value` (Date | string) — selected date
  - [x] Prop: `label` (string) — input label
  - [x] Prop: `placeholder` (string) — input placeholder
  - [x] Prop: `format` (string) — date format (e.g., 'YYYY-MM-DD')
  - [x] Prop: `min` (Date) — minimum selectable date
  - [x] Prop: `max` (Date) — maximum selectable date
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `disabledDates` (Date[] | function) — specific disabled dates
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style date input with calendar popup
- [x] Implement calendar grid using box-drawing characters
  ```
  ┌──────────────────────────────┐
  │  ◄  │   January 2026   │  ►  │
  ├──────────────────────────────┤
  │ Su  Mo  Tu  We  Th  Fr  Sa   │
  │                  1   2   3   │
  │  4   5   6   7   8   9  10   │
  │ 11  12  13  14  15  16  17   │
  │ 18  19  20  21  22  23  24   │
  │ 25  26  27  28  29  30  31   │
  └──────────────────────────────┘
  ```
- [x] Implement month/year navigation
- [x] Implement states: default, open, focus, error, disabled
- [x] Add CSS styles with class `.dos-date-picker`
  - [x] `.dos-date-picker___input`
  - [x] `.dos-date-picker___calendar`
  - [x] `.dos-date-picker___header`
  - [x] `.dos-date-picker___nav`
  - [x] `.dos-date-picker___grid`
  - [x] `.dos-date-picker___day`
  - [x] `.dos-date-picker___day--selected`
  - [x] `.dos-date-picker___day--today`
  - [x] `.dos-date-picker___day--disabled`
  - [x] `.dos-date-picker___day--other-month`
- [x] Add keyboard navigation
  - [x] `Enter` / `Space` — open calendar, select date
  - [x] `Arrow keys` — navigate days
  - [x] `Page Up/Down` — previous/next month
  - [x] `Home` / `End` — first/last day of month
  - [x] `Escape` — close calendar
- [x] Add ARIA attributes
  - [x] `role="dialog"` — on calendar popup
  - [x] `role="grid"` — on calendar grid
  - [x] `aria-label` — month and year
  - [x] `aria-selected` — selected date
- [x] Write unit tests
  - [x] Test: displays selected date
  - [x] Test: opens calendar popup
  - [x] Test: selects date correctly
  - [x] Test: navigates months
  - [x] Test: respects min/max bounds
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic example
  - [x] With min/max dates
  - [x] Disabled dates
  - [x] Code snippet displayed

> **Accessibility:** Calendar grid follows ARIA grid pattern. Date announced with full context.
> **Keyboard:** Full grid navigation, `Escape` to close

---

### 6.6 TimePicker

**File:** `src/components/TimePicker/TimePicker.ts`
**Styles:** `src/components/TimePicker/TimePicker.css`
**Types:** `src/components/TimePicker/TimePicker.types.ts`
**Tests:** `tests/components/TimePicker.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TimePickerProps`
  - [x] Prop: `value` (string | Date) — selected time
  - [x] Prop: `label` (string) — input label
  - [x] Prop: `format` ('12h' | '24h') — time format
  - [x] Prop: `step` (number) — minute increment (e.g., 15)
  - [x] Prop: `min` (string) — minimum time
  - [x] Prop: `max` (string) — maximum time
  - [x] Prop: `disabled` (boolean) — disables interaction
  - [x] Prop: `onChange` (function) — change handler
- [x] Implement DOS-style time input
- [x] Implement spinbox for hour/minute with up/down buttons
- [x] Implement AM/PM toggle for 12h format
- [x] Display: `[HH]:[MM] [AM/PM]`
- [x] Implement states: default, focus, error, disabled
- [x] Add CSS styles with class `.dos-time-picker`
  - [x] `.dos-time-picker___input`
  - [x] `.dos-time-picker___hours`
  - [x] `.dos-time-picker___minutes`
  - [x] `.dos-time-picker___separator`
  - [x] `.dos-time-picker___period`
  - [x] `.dos-time-picker___spinner`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — increment/decrement value
  - [x] `Tab` — move between hour/minute/period
  - [x] Direct number input
- [x] Add ARIA attributes
  - [x] `role="spinbutton"` — for hour/minute inputs
  - [x] `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- [x] Write unit tests (83 tests)
  - [x] Test: displays selected time
  - [x] Test: increments/decrements correctly
  - [x] Test: respects step value
  - [x] Test: 12h/24h format works
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] 12-hour format example
  - [x] 24-hour format example
  - [x] With step increments
  - [x] Code snippet displayed

> **Accessibility:** Spinbutton pattern for hour/minute. Clear value announcements.
> **Keyboard:** `Arrows` to change values, `Tab` between fields

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 6

---

## Phase 7: Navigation Components

### 7.1 MenuBar

**File:** `src/components/MenuBar/MenuBar.ts`
**Styles:** `src/components/MenuBar/MenuBar.css`
**Types:** `src/components/MenuBar/MenuBar.types.ts`
**Tests:** `tests/components/MenuBar.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `MenuBarProps`
  - [x] Prop: `items` (MenuBarItem[]) — menu items
  - [x] Prop: `onSelect` (function) — item selection handler
  - [x] Prop: `onMenuOpen` (function) — menu open handler
  - [x] Prop: `onMenuClose` (function) — menu close handler
- [x] Define TypeScript interface `MenuBarItem`
  - [x] Prop: `label` (string) — menu label (e.g., 'File')
  - [x] Prop: `accessKey` (string) — Alt+key shortcut (e.g., 'F')
  - [x] Prop: `items` (MenuItem[]) — dropdown items
  - [x] Prop: `disabled` (boolean) — menu disabled
- [x] Define TypeScript interface `MenuItem`
  - [x] Prop: `label` (string) — item label
  - [x] Prop: `icon` (string) — optional icon/character
  - [x] Prop: `shortcut` (string) — keyboard shortcut display
  - [x] Prop: `disabled` (boolean) — item disabled
  - [x] Prop: `divider` (boolean) — render as divider
  - [x] Prop: `children` (MenuItem[]) — nested submenu
  - [x] Prop: `action` (function) — item action
- [x] Implement classic DOS horizontal menu bar
  - [x] Display: `File  Edit  View  Options  Help`
  - [x] Underline access key character
- [x] Implement dropdown trigger on click
- [x] Implement menu switching on hover (when menu open)
- [x] Implement Alt+key shortcuts
- [x] Implement states: default, hover, active/open, disabled
- [x] Add CSS styles with class `.dos-menu-bar`
  - [x] `.dos-menu-bar__list`
  - [x] `.dos-menu-bar__item`
  - [x] `.dos-menu-bar__item--active`
  - [x] `.dos-menu-bar__trigger`
  - [x] `.dos-menu-bar__trigger--disabled`
  - [x] `.dos-menu-bar__accesskey`
  - [x] `.dos-menu-bar__dropdown`
  - [x] `.dos-menu-bar__dropdown--open`
  - [x] `.dos-menu-bar__dropdown-item`
  - [x] `.dos-menu-bar__dropdown-trigger`
  - [x] `.dos-menu-bar__dropdown-trigger--highlighted`
  - [x] `.dos-menu-bar__divider`
  - [x] `.dos-menu-bar__icon`
  - [x] `.dos-menu-bar__shortcut`
  - [x] `.dos-menu-bar__submenu-arrow`
  - [x] `.dos-menu-bar__submenu`
- [x] Add keyboard navigation
  - [x] `Alt` + letter — open corresponding menu
  - [x] `Arrow Left/Right` — navigate between menus
  - [x] `Arrow Up/Down` — navigate dropdown items
  - [x] `Arrow Down` / `Enter` / `Space` — open dropdown
  - [x] `Enter` — activate item
  - [x] `Escape` — close menu
  - [x] `Home/End` — jump to first/last item
  - [x] Type-ahead — jump to matching item
- [x] Add ARIA attributes
  - [x] `role="menubar"`
  - [x] `role="menuitem"` — on each top item
  - [x] `role="menu"` — on dropdowns
  - [x] `aria-haspopup="menu"`
  - [x] `aria-expanded`
  - [x] `aria-disabled`
  - [x] `tabindex` management for roving tabindex
- [x] Implement public API methods
  - [x] `openMenu(label)` — programmatically open menu
  - [x] `closeMenu()` — close current menu
  - [x] `getOpenMenu()` — get currently open menu
  - [x] `setItems(items)` — update menu items
  - [x] `setMenuDisabled(label, disabled)` — enable/disable menu
  - [x] `setItemDisabled(path, disabled)` — enable/disable item
  - [x] `destroy()` — clean up event listeners
- [x] Write unit tests (50 tests)
  - [x] Test: renders menu items
  - [x] Test: opens dropdown on click
  - [x] Test: closes dropdown on second click
  - [x] Test: switches menu on hover when open
  - [x] Test: closes on outside click
  - [x] Test: closes on Escape
  - [x] Test: Alt+key shortcuts work
  - [x] Test: arrow key navigation works
  - [x] Test: renders items with icons, shortcuts
  - [x] Test: renders dividers
  - [x] Test: disabled items not selectable
  - [x] Test: submenus open on hover
  - [x] Test: public API methods work
  - [x] Test: callbacks are invoked
  - [x] Test: has correct ARIA attributes
- [x] Add to Kitchen Sink demo
  - [x] Classic DOS menu example
  - [x] With dropdowns and submenus
  - [x] With icons and shortcuts
  - [x] Disabled items example
  - [x] Keyboard navigation example
  - [x] Programmatic control example
  - [x] Accessibility notes
  - [x] Code snippets displayed

> **Accessibility:** Full menubar ARIA pattern. Alt+key announced.
> **Keyboard:** `Alt+letter` shortcuts, `Arrows` to navigate

---

### 7.2 DropdownMenu

**File:** `src/components/DropdownMenu/DropdownMenu.ts`
**Styles:** `src/components/DropdownMenu/DropdownMenu.styles.css`
**Types:** `src/components/DropdownMenu/DropdownMenu.types.ts`
**Tests:** `tests/components/DropdownMenu.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `DropdownMenuProps`
  - [x] Prop: `items` (MenuItem[]) — menu items
  - [x] Prop: `open` (boolean) — controlled open state
  - [x] Prop: `trigger` (Element) — trigger element
  - [x] Prop: `position` ('bottom' | 'right') — dropdown position
  - [x] Prop: `onSelect` (function) — selection handler
  - [x] Prop: `onClose` (function) — close handler
- [x] Define TypeScript interface `MenuItem`
  - [x] Prop: `label` (string) — item label
  - [x] Prop: `icon` (string) — optional icon/character
  - [x] Prop: `shortcut` (string) — keyboard shortcut display
  - [x] Prop: `disabled` (boolean) — item disabled
  - [x] Prop: `divider` (boolean) — render as divider
  - [x] Prop: `items` (MenuItem[]) — nested submenu
  - [x] Prop: `action` (function) — item action
- [x] Implement DOS-style dropdown menu
  ```
  ┌─────────────────┐
  │ New         Ctrl+N │
  │ Open        Ctrl+O │
  ├─────────────────────┤
  │ Save        Ctrl+S │
  │ Save As...         │
  ├─────────────────────┤
  │ Exit        Alt+F4 │
  └─────────────────────┘
  ```
- [x] Implement dividers and submenus
- [x] Implement states: default, hover, active, disabled
- [x] Add CSS styles with class `.dos-dropdown-menu`
  - [x] `.dos-dropdown-menu___item`
  - [x] `.dos-dropdown-menu___item--highlighted`
  - [x] `.dos-dropdown-menu___item--disabled`
  - [x] `.dos-dropdown-menu___icon`
  - [x] `.dos-dropdown-menu___label`
  - [x] `.dos-dropdown-menu___shortcut`
  - [x] `.dos-dropdown-menu___submenu-arrow`
  - [x] `.dos-dropdown-menu___divider`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — navigate items
  - [x] `Arrow Right` — open submenu
  - [x] `Arrow Left` — close submenu
  - [x] `Enter` — activate item
  - [x] `Escape` — close menu
  - [x] Type-ahead — jump to item
- [x] Add ARIA attributes
  - [x] `role="menu"`
  - [x] `role="menuitem"` — on items
  - [x] `role="separator"` — on dividers
  - [x] `aria-haspopup` — for submenus
  - [x] `aria-disabled`
- [x] Write unit tests
  - [x] Test: renders menu items
  - [x] Test: handles item selection
  - [x] Test: keyboard navigation works
  - [x] Test: submenus open correctly
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic dropdown
  - [x] With icons and shortcuts
  - [x] Nested submenus
  - [x] Code snippet displayed

> **Accessibility:** Full menu ARIA pattern. Submenus announced.
> **Keyboard:** `Arrows` to navigate, `Enter` to select, `Escape` to close

---

### 7.3 ContextMenu

**File:** `src/components/ContextMenu/ContextMenu.ts`
**Styles:** `src/components/ContextMenu/ContextMenu.styles.css`
**Types:** `src/components/ContextMenu/ContextMenu.types.ts`
**Tests:** `tests/components/ContextMenu.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ContextMenuProps`
  - [x] Prop: `items` (MenuItem[]) — menu items (same as DropdownMenu)
  - [x] Prop: `target` (Element | string) — element(s) to attach to
  - [x] Prop: `onSelect` (function) — selection handler
  - [x] Prop: `onOpen` (function) — open handler with position
  - [x] Prop: `onClose` (function) — close handler
- [x] Implement right-click triggered menu
- [x] Position at cursor location
- [x] Reuse DropdownMenu styling and items
- [x] Handle viewport boundary collision
- [x] Implement states: closed, open
- [x] Add CSS styles with class `.dos-context-menu`
  - [x] Inherit from `.dos-dropdown-menu`
  - [x] Positioning utilities
- [x] Add keyboard navigation
  - [x] `Shift+F10` — open context menu (standard)
  - [x] Same navigation as DropdownMenu
- [x] Add ARIA attributes
  - [x] Same as DropdownMenu
  - [x] Announced as context menu
- [x] Write unit tests
  - [x] Test: opens on right-click
  - [x] Test: positions at cursor
  - [x] Test: handles boundary collision
  - [x] Test: keyboard trigger works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Right-click target area
  - [x] With various menu items
  - [x] Code snippet displayed

> **Accessibility:** Can be triggered via `Shift+F10`. Focus managed properly.
> **Keyboard:** `Shift+F10` to open, same navigation as DropdownMenu

---

### 7.4 Sidebar

**File:** `src/components/Sidebar/Sidebar.ts`
**Styles:** `src/components/Sidebar/Sidebar.styles.css`
**Types:** `src/components/Sidebar/Sidebar.types.ts`
**Tests:** `tests/components/Sidebar.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `SidebarProps`
  - [x] Prop: `items` (SidebarItem[]) — navigation items
  - [x] Prop: `activeItem` (string) — currently active item ID
  - [x] Prop: `collapsible` (boolean) — sections can collapse
  - [x] Prop: `collapsed` (boolean) — entire sidebar collapsed
  - [x] Prop: `width` (string | number) — sidebar width
  - [x] Prop: `position` ('left' | 'right') — sidebar position
  - [x] Prop: `onSelect` (function) — item selection handler
- [x] Define TypeScript interface `SidebarItem`
  - [x] Prop: `id` (string) — unique identifier
  - [x] Prop: `label` (string) — item label
  - [x] Prop: `icon` (string) — optional icon
  - [x] Prop: `items` (SidebarItem[]) — nested items (section)
  - [x] Prop: `expanded` (boolean) — section expanded state
  - [x] Prop: `disabled` (boolean) — item disabled
- [x] Implement DOS-style navigation panel
- [x] Implement collapsible sections with `▼` / `▶` indicators
- [x] Implement active state indication
- [x] Add CSS styles with class `.dos-sidebar`
  - [x] `.dos-sidebar___section`
  - [x] `.dos-sidebar___section-header`
  - [x] `.dos-sidebar___section-toggle`
  - [x] `.dos-sidebar___item`
  - [x] `.dos-sidebar___item--active`
  - [x] `.dos-sidebar___item--disabled`
  - [x] `.dos-sidebar--collapsed`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — navigate items
  - [x] `Enter` — select item / toggle section
  - [x] `Arrow Left/Right` — collapse/expand sections
- [x] Add ARIA attributes
  - [x] `role="navigation"`
  - [x] `aria-current="page"` — on active item
  - [x] `aria-expanded` — on collapsible sections
- [x] Write unit tests
  - [x] Test: renders navigation items
  - [x] Test: highlights active item
  - [x] Test: collapses/expands sections
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic sidebar
  - [x] With collapsible sections
  - [x] Code snippet displayed

> **Accessibility:** Navigation landmark. Active item announced.
> **Keyboard:** `Arrows` to navigate, `Enter` to select/toggle

---

### 7.5 Breadcrumbs

**File:** `src/components/Breadcrumbs/Breadcrumbs.ts`
**Styles:** `src/components/Breadcrumbs/Breadcrumbs.styles.css`
**Types:** `src/components/Breadcrumbs/Breadcrumbs.types.ts`
**Tests:** `tests/components/Breadcrumbs.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `BreadcrumbsProps`
  - [x] Prop: `items` (BreadcrumbItem[]) — path items
  - [x] Prop: `separator` (string) — separator character (default '>')
  - [x] Prop: `maxItems` (number) — max visible items (collapse middle)
  - [x] Prop: `onSelect` (function) — item click handler
- [x] Define TypeScript interface `BreadcrumbItem`
  - [x] Prop: `label` (string) — display text
  - [x] Prop: `href` (string) — optional link
  - [x] Prop: `icon` (string) — optional icon
- [x] Implement DOS-style breadcrumb trail
  - [x] Display: `Home > Section > Subsection > Page`
- [x] Implement separator customization
  - [x] Options: `>`, `»`, `/`, `\`, `│`
- [x] Implement overflow with ellipsis for long paths
- [x] Last item is current (not a link)
- [x] Add CSS styles with class `.dos-breadcrumbs`
  - [x] `.dos-breadcrumbs___item`
  - [x] `.dos-breadcrumbs___item--current`
  - [x] `.dos-breadcrumbs___separator`
  - [x] `.dos-breadcrumbs___ellipsis`
- [x] Add keyboard navigation
  - [x] `Tab` — navigate between links
- [x] Add ARIA attributes
  - [x] `role="navigation"`
  - [x] `aria-label="Breadcrumb"`
  - [x] `aria-current="page"` — on last item
- [x] Write unit tests
  - [x] Test: renders path correctly
  - [x] Test: uses correct separator
  - [x] Test: last item is not a link
  - [x] Test: collapse overflow works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic breadcrumb trail
  - [x] Different separators
  - [x] Long path with collapse
  - [x] Code snippet displayed

> **Accessibility:** Navigation landmark with "Breadcrumb" label. Current page announced.
> **Keyboard:** `Tab` between links

---

### 7.6 Pagination

**File:** `src/components/Pagination/Pagination.ts`
**Styles:** `src/components/Pagination/Pagination.styles.css`
**Types:** `src/components/Pagination/Pagination.types.ts`
**Tests:** `tests/components/Pagination.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `PaginationProps`
  - [x] Prop: `currentPage` (number) — current page (1-indexed)
  - [x] Prop: `totalPages` (number) — total page count
  - [x] Prop: `siblingCount` (number) — pages shown around current
  - [x] Prop: `boundaryCount` (number) — pages at start/end
  - [x] Prop: `showFirstLast` (boolean) — show first/last buttons
  - [x] Prop: `showPrevNext` (boolean) — show prev/next buttons
  - [x] Prop: `onChange` (function) — page change handler
- [x] Implement DOS-style pagination
  - [x] Display: `[<<] [<] 1 2 [3] 4 5 ... 10 [>] [>>]`
  - [x] First: `[<<]` or `[|<]`
  - [x] Previous: `[<]`
  - [x] Next: `[>]`
  - [x] Last: `[>>]` or `[>|]`
- [x] Implement ellipsis for large page counts
- [x] Implement current page highlight
- [x] Add CSS styles with class `.dos-pagination`
  - [x] `.dos-pagination___button`
  - [x] `.dos-pagination___page`
  - [x] `.dos-pagination___page--current`
  - [x] `.dos-pagination___page--disabled`
  - [x] `.dos-pagination___ellipsis`
- [x] Add keyboard navigation
  - [x] `Tab` — navigate between buttons
  - [x] `Enter` — activate button
  - [x] `Arrow Left/Right` — prev/next page (optional)
- [x] Add ARIA attributes
  - [x] `role="navigation"`
  - [x] `aria-label="Pagination"`
  - [x] `aria-current="page"` — on current page
  - [x] `aria-disabled` — on disabled buttons
- [x] Write unit tests
  - [x] Test: renders correct page numbers
  - [x] Test: highlights current page
  - [x] Test: disables prev on first page
  - [x] Test: disables next on last page
  - [x] Test: ellipsis appears correctly
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic pagination
  - [x] With first/last buttons
  - [x] Large page count with ellipsis
  - [x] Code snippet displayed

> **Accessibility:** Navigation landmark. Current page announced.
> **Keyboard:** `Tab` between buttons, `Enter` to select

---

### 7.7 Stepper / Wizard

**File:** `src/components/Stepper/Stepper.ts`
**Styles:** `src/components/Stepper/Stepper.styles.css`
**Types:** `src/components/Stepper/Stepper.types.ts`
**Tests:** `tests/components/Stepper.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `StepperProps`
  - [x] Prop: `steps` (Step[]) — step definitions
  - [x] Prop: `currentStep` (number) — active step (0-indexed)
  - [x] Prop: `orientation` ('horizontal' | 'vertical') — layout
  - [x] Prop: `allowStepClick` (boolean) — navigate by clicking steps
  - [x] Prop: `showStepNumbers` (boolean) — display step numbers
  - [x] Prop: `onChange` (function) — step change handler
- [x] Define TypeScript interface `Step`
  - [x] Prop: `label` (string) — step label
  - [x] Prop: `description` (string) — optional description
  - [x] Prop: `completed` (boolean) — step completed
  - [x] Prop: `error` (boolean) — step has error
  - [x] Prop: `disabled` (boolean) — step disabled
- [x] Implement DOS-style step indicator
  - [x] Horizontal: `[1]───[2]───(3)───[ ]───[ ]`
  - [x] Completed: `[✓]` or `[X]`
  - [x] Current: `(3)` or `[●]`
  - [x] Upcoming: `[ ]`
- [x] Implement connecting lines between steps
- [x] Add CSS styles with class `.dos-stepper`
  - [x] `.dos-stepper___step`
  - [x] `.dos-stepper___step-indicator`
  - [x] `.dos-stepper___step-label`
  - [x] `.dos-stepper___step-description`
  - [x] `.dos-stepper___connector`
  - [x] `.dos-stepper___step--completed`
  - [x] `.dos-stepper___step--current`
  - [x] `.dos-stepper___step--error`
  - [x] `.dos-stepper___step--disabled`
  - [x] `.dos-stepper--horizontal`
  - [x] `.dos-stepper--vertical`
- [x] Add keyboard navigation
  - [x] `Tab` — navigate between steps (if clickable)
  - [x] `Enter` — go to step (if clickable)
- [x] Add ARIA attributes
  - [x] `role="list"` — on stepper
  - [x] `role="listitem"` — on each step
  - [x] `aria-current="step"` — on current step
- [x] Write unit tests
  - [x] Test: renders all steps
  - [x] Test: highlights current step
  - [x] Test: shows completed status
  - [x] Test: click navigation works (when enabled)
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Horizontal stepper
  - [x] Vertical stepper
  - [x] With completed/error states
  - [x] Code snippet displayed

> **Accessibility:** Step progress announced. Current step indicated.
> **Keyboard:** `Tab` to navigate if clickable

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 7

---

## Phase 8: Feedback & Overlay Components

### 8.1 Modal / Dialog

**File:** `src/components/Modal/Modal.ts`
**Styles:** `src/components/Modal/Modal.css`
**Types:** `src/components/Modal/Modal.types.ts`
**Tests:** `tests/components/Modal.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ModalProps`
  - [x] Prop: `open` (boolean) — visibility state
  - [x] Prop: `title` (string) — dialog title
  - [x] Prop: `content` (string | Element) — dialog body
  - [x] Prop: `footer` (Element) — footer content (buttons)
  - [x] Prop: `size` ('small' | 'medium' | 'large' | 'fullscreen') — modal size
  - [x] Prop: `closable` (boolean) — show close button
  - [x] Prop: `closeOnEscape` (boolean) — close on Escape key
  - [x] Prop: `closeOnOverlay` (boolean) — close on overlay click
  - [x] Prop: `onClose` (function) — close handler
  - [x] Prop: `onOpen` (function) — open handler
- [x] Implement centered overlay dialog
- [x] Implement DOS-style box-drawing border
  ```
  ╔══════════════════════════╗
  ║ Dialog Title         [X] ║
  ╠══════════════════════════╣
  ║                          ║
  ║  Dialog content goes     ║
  ║  here in this area.      ║
  ║                          ║
  ╠══════════════════════════╣
  ║         [OK] [Cancel]    ║
  ╚══════════════════════════╝
  ```
- [x] Implement focus trap (focus stays within modal)
- [x] Implement scroll lock on body
- [x] Implement states: closed, open
- [x] Add CSS styles with class `.dos-modal`
  - [x] `.dos-modal__overlay`
  - [x] `.dos-modal__dialog`
  - [x] `.dos-modal__header`
  - [x] `.dos-modal__title`
  - [x] `.dos-modal__close`
  - [x] `.dos-modal__body`
  - [x] `.dos-modal__footer`
  - [x] `.dos-modal--small`
  - [x] `.dos-modal--medium`
  - [x] `.dos-modal--large`
  - [x] `.dos-modal--fullscreen`
- [x] Add keyboard navigation
  - [x] `Escape` — close modal
  - [x] `Tab` — cycle through focusable elements
  - [x] Focus returns to trigger on close
- [x] Add ARIA attributes
  - [x] `role="dialog"`
  - [x] `aria-modal="true"`
  - [x] `aria-labelledby` — points to title
  - [x] `aria-describedby` — points to content
- [x] Write unit tests
  - [x] Test: opens and closes correctly
  - [x] Test: focus trap works
  - [x] Test: Escape closes modal
  - [x] Test: overlay click closes (when enabled)
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic modal
  - [x] Different sizes
  - [x] With form content
  - [x] Code snippet displayed
- [x] Implement helper functions
  - [x] `showAlert()` — simple alert dialog
  - [x] `showConfirm()` — confirmation dialog (returns Promise<boolean>)
  - [x] `showPrompt()` — prompt dialog (returns Promise<string | null>)

> **Accessibility:** Focus trapped. Escape to close. Announced as dialog.
> **Keyboard:** `Escape` to close, `Tab` to navigate within

---

### 8.2 Window

**File:** `src/components/Window/Window.ts`
**Styles:** `src/components/Window/Window.styles.css`
**Types:** `src/components/Window/Window.types.ts`
**Tests:** `tests/components/Window.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `WindowProps`
  - [x] Prop: `title` (string) — window title
  - [x] Prop: `content` (Element) — window content
  - [x] Prop: `width` (number | string) — initial width
  - [x] Prop: `height` (number | string) — initial height
  - [x] Prop: `x` (number) — initial X position
  - [x] Prop: `y` (number) — initial Y position
  - [x] Prop: `minimized` (boolean) — minimized state
  - [x] Prop: `maximized` (boolean) — maximized state
  - [x] Prop: `draggable` (boolean) — can be dragged
  - [x] Prop: `resizable` (boolean) — can be resized
  - [x] Prop: `showMinimize` (boolean) — show minimize button
  - [x] Prop: `showMaximize` (boolean) — show maximize button
  - [x] Prop: `showClose` (boolean) — show close button
  - [x] Prop: `onClose` (function) — close handler
  - [x] Prop: `onMinimize` (function) — minimize handler
  - [x] Prop: `onMaximize` (function) — maximize handler
  - [x] Prop: `onMove` (function) — move handler
  - [x] Prop: `onResize` (function) — resize handler
- [x] Implement full DOS window frame
  ```
  ┌──────────────────────────────────────┐
  │ [─] Window Title             [□] [X] │
  ├──────────────────────────────────────┤
  │                                      │
  │  Window content area                 │
  │                                      │
  │                                      │
  └──────────────────────────────────────┘
  ```
- [x] Implement title bar with controls
  - [x] Minimize: `[─]` or `[_]`
  - [x] Maximize/Restore: `[□]` or `[↕]`
  - [x] Close: `[X]`
- [x] Implement drag to move (when enabled)
- [x] Implement resize handles (when enabled)
- [x] Implement states: normal, minimized, maximized, focused
- [x] Add CSS styles with class `.dos-window`
  - [x] `.dos-window___frame`
  - [x] `.dos-window___title-bar`
  - [x] `.dos-window___title`
  - [x] `.dos-window___controls`
  - [x] `.dos-window___control`
  - [x] `.dos-window___content`
  - [x] `.dos-window___resize-handle`
  - [x] `.dos-window--minimized`
  - [x] `.dos-window--maximized`
  - [x] `.dos-window--focused`
  - [x] `.dos-window--dragging`
- [x] Add keyboard navigation
  - [x] Title bar buttons keyboard accessible
  - [x] `Alt+F4` — close (optional)
  - [x] Focus management
- [x] Add ARIA attributes
  - [x] `role="dialog"` or appropriate landmark
  - [x] `aria-labelledby` — title
  - [x] Button labels for controls
- [x] Write unit tests
  - [x] Test: renders window frame
  - [x] Test: drag to move works
  - [x] Test: resize works
  - [x] Test: minimize/maximize/close work
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic window
  - [x] Draggable window
  - [x] Resizable window
  - [x] Multiple windows
  - [x] Code snippet displayed

> **Accessibility:** Title bar controls labeled. Focus management for window.
> **Keyboard:** Control buttons keyboard accessible

---

### 8.3 Alert

**File:** `src/components/Alert/Alert.ts`
**Styles:** `src/components/Alert/Alert.styles.css`
**Types:** `src/components/Alert/Alert.types.ts`
**Tests:** `tests/components/Alert.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `AlertProps`
  - [x] Prop: `message` (string | Element) — alert content
  - [x] Prop: `type` ('info' | 'success' | 'warning' | 'error') — alert type
  - [x] Prop: `title` (string) — optional title
  - [x] Prop: `icon` (boolean | string) — show/custom icon
  - [x] Prop: `dismissible` (boolean) — can be dismissed
  - [x] Prop: `onDismiss` (function) — dismiss handler
- [x] Implement banner-style notification
  ```
  ╔══[!]════════════════════════════════════════╗
  ║ Warning: This action cannot be undone.  [X] ║
  ╚═════════════════════════════════════════════╝
  ```
- [x] Implement type-specific icons and colors
  - [x] Info: `[i]`, primary/secondary color
  - [x] Success: `[✓]`, success color
  - [x] Warning: `[!]`, warning color
  - [x] Error: `[✗]`, error color
- [x] Implement dismissible with close button
- [x] Add CSS styles with class `.dos-alert`
  - [x] `.dos-alert___icon`
  - [x] `.dos-alert___title`
  - [x] `.dos-alert___message`
  - [x] `.dos-alert___dismiss`
  - [x] `.dos-alert--info`
  - [x] `.dos-alert--success`
  - [x] `.dos-alert--warning`
  - [x] `.dos-alert--error`
- [x] Add keyboard navigation
  - [x] Dismiss button keyboard accessible
- [x] Add ARIA attributes
  - [x] `role="alert"` — for important messages
  - [x] `role="status"` — for informational
  - [x] `aria-live` — appropriate politeness
- [x] Write unit tests
  - [x] Test: renders message correctly
  - [x] Test: applies type-specific styles
  - [x] Test: dismisses on button click
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] All alert types
  - [x] Dismissible alerts
  - [x] With titles
  - [x] Code snippet displayed

> **Accessibility:** Uses appropriate role based on urgency. Announced to screen readers.
> **Keyboard:** Dismiss button focusable

---

### 8.4 Toast

**File:** `src/components/Toast/Toast.ts`
**Styles:** `src/components/Toast/Toast.styles.css`
**Types:** `src/components/Toast/Toast.types.ts`
**Tests:** `tests/components/Toast.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ToastProps`
  - [x] Prop: `message` (string) — toast content
  - [x] Prop: `type` ('info' | 'success' | 'warning' | 'error') — toast type
  - [x] Prop: `duration` (number) — auto-dismiss time (ms)
  - [x] Prop: `position` ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center') — screen position
  - [x] Prop: `dismissible` (boolean) — can be manually dismissed
  - [x] Prop: `onDismiss` (function) — dismiss handler
- [x] Define TypeScript interface `ToastContainerProps`
  - [x] Prop: `position` — default position
  - [x] Prop: `maxToasts` (number) — max visible toasts
- [x] Implement temporary notification
- [x] Implement ToastContainer for managing multiple toasts
- [x] Implement auto-dismiss with countdown
- [x] Implement stack/queue behavior
- [x] Add CSS styles with class `.dos-toast`
  - [x] `.dos-toast___message`
  - [x] `.dos-toast___dismiss`
  - [x] `.dos-toast--info`
  - [x] `.dos-toast--success`
  - [x] `.dos-toast--warning`
  - [x] `.dos-toast--error`
  - [x] `.dos-toast--entering`
  - [x] `.dos-toast--exiting`
- [x] Add CSS styles with class `.dos-toast-container`
  - [x] Position variants
- [x] Add keyboard navigation
  - [x] Dismiss button keyboard accessible
  - [x] Focus management for stacked toasts
- [x] Add ARIA attributes
  - [x] `role="status"` or `role="alert"`
  - [x] `aria-live="polite"` or `"assertive"`
- [x] Write unit tests
  - [x] Test: displays toast message
  - [x] Test: auto-dismisses after duration
  - [x] Test: manual dismiss works
  - [x] Test: stacks multiple toasts
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Trigger various toasts
  - [x] Different positions
  - [x] Stacked toasts
  - [x] Code snippet displayed

> **Accessibility:** Announced via live region. Pause auto-dismiss on hover.
> **Keyboard:** Dismiss button focusable, focus management

---

### 8.5 Tooltip

**File:** `src/components/Tooltip/Tooltip.ts`
**Styles:** `src/components/Tooltip/Tooltip.styles.css`
**Types:** `src/components/Tooltip/Tooltip.types.ts`
**Tests:** `tests/components/Tooltip.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TooltipProps`
  - [x] Prop: `content` (string) — tooltip text
  - [x] Prop: `position` ('top' | 'bottom' | 'left' | 'right') — preferred position
  - [x] Prop: `trigger` ('hover' | 'focus' | 'both') — trigger method
  - [x] Prop: `delay` (number) — show delay (ms)
  - [x] Prop: `arrow` (boolean) — show arrow pointer
  - [x] Prop: `target` (Element) — element to attach to
- [x] Implement hover-triggered info overlay
- [x] Implement arrow pointing to target
- [x] Handle viewport boundary collision (flip position)
- [x] Implement show delay to prevent flicker
- [x] Add CSS styles with class `.dos-tooltip`
  - [x] `.dos-tooltip___content`
  - [x] `.dos-tooltip___arrow`
  - [x] `.dos-tooltip--top`
  - [x] `.dos-tooltip--bottom`
  - [x] `.dos-tooltip--left`
  - [x] `.dos-tooltip--right`
  - [x] `.dos-tooltip--visible`
- [x] Add keyboard navigation
  - [x] Show on focus (for focus trigger)
  - [x] `Escape` — hide tooltip
- [x] Add ARIA attributes
  - [x] `role="tooltip"`
  - [x] `aria-describedby` — on target element
- [x] Write unit tests
  - [x] Test: shows on hover
  - [x] Test: shows on focus
  - [x] Test: positions correctly
  - [x] Test: handles boundary collision
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic tooltips
  - [x] All positions
  - [x] Trigger variants
  - [x] Code snippet displayed

> **Accessibility:** Associated via `aria-describedby`. Keyboard accessible via focus.
> **Keyboard:** `Escape` to dismiss, focusable trigger shows tooltip

---

### 8.6 Popover

**File:** `src/components/Popover/Popover.ts`
**Styles:** `src/components/Popover/Popover.styles.css`
**Types:** `src/components/Popover/Popover.types.ts`
**Tests:** `tests/components/Popover.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `PopoverProps`
  - [x] Prop: `content` (Element) — popover content
  - [x] Prop: `title` (string) — optional header
  - [x] Prop: `position` ('top' | 'bottom' | 'left' | 'right') — preferred position
  - [x] Prop: `trigger` ('click' | 'hover' | 'focus') — trigger method
  - [x] Prop: `arrow` (boolean) — show arrow pointer
  - [x] Prop: `closeOnClickOutside` (boolean) — dismiss on outside click
  - [x] Prop: `target` (Element) — element to attach to
  - [x] Prop: `onOpen` (function) — open handler
  - [x] Prop: `onClose` (function) — close handler
- [x] Implement click-triggered overlay
- [x] Support richer content than tooltip
- [x] Implement arrow pointing to target
- [x] Handle viewport boundary collision
- [x] Add CSS styles with class `.dos-popover`
  - [x] `.dos-popover___header`
  - [x] `.dos-popover___content`
  - [x] `.dos-popover___arrow`
  - [x] `.dos-popover--top`
  - [x] `.dos-popover--bottom`
  - [x] `.dos-popover--left`
  - [x] `.dos-popover--right`
  - [x] `.dos-popover--open`
- [x] Add keyboard navigation
  - [x] `Enter` / `Space` — toggle popover
  - [x] `Escape` — close popover
  - [x] Focus management within popover
- [x] Add ARIA attributes
  - [x] `aria-haspopup="dialog"` — on trigger
  - [x] `aria-expanded` — on trigger
  - [x] Popover labeled appropriately
- [x] Write unit tests
  - [x] Test: opens on click
  - [x] Test: closes on outside click
  - [x] Test: keyboard toggle works
  - [x] Test: positions correctly
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic popover
  - [x] With form content
  - [x] Different positions
  - [x] Code snippet displayed

> **Accessibility:** Focus managed within. Escape to close.
> **Keyboard:** `Enter`/`Space` to toggle, `Escape` to close

---

### 8.7 ProgressBar

**File:** `src/components/ProgressBar/ProgressBar.ts`
**Styles:** `src/components/ProgressBar/ProgressBar.styles.css`
**Types:** `src/components/ProgressBar/ProgressBar.types.ts`
**Tests:** `tests/components/ProgressBar.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ProgressBarProps`
  - [x] Prop: `value` (number) — current value (0-100)
  - [x] Prop: `max` (number) — maximum value (default 100)
  - [x] Prop: `showValue` (boolean) — display percentage
  - [x] Prop: `valueFormat` (function) — custom value formatter
  - [x] Prop: `indeterminate` (boolean) — unknown progress
  - [x] Prop: `size` ('small' | 'medium' | 'large') — bar height
  - [x] Prop: `color` (string) — custom fill color
  - [x] Prop: `label` (string) — accessible label
- [x] Implement DOS-style progress bar
  - [x] Style A: `████████░░░░░░░░` (blocks)
  - [x] Style B: `[████████        ]` (boxed)
  - [x] Percentage: `[████████        ] 50%`
- [x] Implement indeterminate animation
- [x] Add CSS styles with class `.dos-progress-bar`
  - [x] `.dos-progress-bar___track`
  - [x] `.dos-progress-bar___fill`
  - [x] `.dos-progress-bar___value`
  - [x] `.dos-progress-bar--small`
  - [x] `.dos-progress-bar--medium`
  - [x] `.dos-progress-bar--large`
  - [x] `.dos-progress-bar--indeterminate`
- [x] Add keyboard navigation
  - [x] Not interactive (display only)
- [x] Add ARIA attributes
  - [x] `role="progressbar"`
  - [x] `aria-valuemin="0"`
  - [x] `aria-valuemax`
  - [x] `aria-valuenow`
  - [x] `aria-valuetext` — human-readable value
  - [x] `aria-label` — description
- [x] Write unit tests
  - [x] Test: renders correct fill percentage
  - [x] Test: displays value when enabled
  - [x] Test: indeterminate mode works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic progress bars
  - [x] With percentage display
  - [x] Indeterminate state
  - [x] Different sizes
  - [x] Code snippet displayed

> **Accessibility:** Proper progressbar role with value attributes.
> **Keyboard:** Not interactive

---

### 8.8 LoadingSpinner

**File:** `src/components/LoadingSpinner/LoadingSpinner.ts`
**Styles:** `src/components/LoadingSpinner/LoadingSpinner.styles.css`
**Types:** `src/components/LoadingSpinner/LoadingSpinner.types.ts`
**Tests:** `tests/components/LoadingSpinner.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `LoadingSpinnerProps`
  - [x] Prop: `size` ('small' | 'medium' | 'large') — spinner size
  - [x] Prop: `label` (string) — accessible label
  - [x] Prop: `style` ('ascii' | 'block' | 'dots') — animation style
- [x] Implement ASCII animation spinner
  - [x] ASCII cycle: `|`, `/`, `-`, `\` (rotating)
  - [x] Block: `▖`, `▘`, `▝`, `▗` (rotating)
  - [x] Dots: `⠋`, `⠙`, `⠹`, `⠸`, `⠼`, `⠴`, `⠦`, `⠧`, `⠇`, `⠏` (braille)
- [x] Implement animation timing
- [x] Add CSS styles with class `.dos-loading-spinner`
  - [x] `.dos-loading-spinner___character`
  - [x] `.dos-loading-spinner--small`
  - [x] `.dos-loading-spinner--medium`
  - [x] `.dos-loading-spinner--large`
  - [x] CSS animation for frame switching
- [x] Add ARIA attributes
  - [x] `role="status"`
  - [x] `aria-live="polite"`
  - [x] `aria-label` — loading description
- [x] Write unit tests
  - [x] Test: renders spinner
  - [x] Test: animates correctly
  - [x] Test: applies size
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] All animation styles
  - [x] Different sizes
  - [x] In context (button loading, etc.)
  - [x] Code snippet displayed

> **Accessibility:** Status role announces loading. Label describes what's loading.
> **Keyboard:** Not interactive

---

### 8.9 SkeletonLoader

**File:** `src/components/SkeletonLoader/SkeletonLoader.ts`
**Styles:** `src/components/SkeletonLoader/SkeletonLoader.styles.css`
**Types:** `src/components/SkeletonLoader/SkeletonLoader.types.ts`
**Tests:** `tests/components/SkeletonLoader.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `SkeletonLoaderProps`
  - [x] Prop: `variant` ('text' | 'rectangle' | 'circle') — shape variant
  - [x] Prop: `width` (string | number) — element width
  - [x] Prop: `height` (string | number) — element height
  - [x] Prop: `lines` (number) — for text variant, number of lines
  - [x] Prop: `animate` (boolean) — show shimmer animation
  - [x] Prop: `label` (string) — accessible label
- [x] Implement DOS-style content placeholder
  - [x] Use block characters: `░░░░░░░░░░░░░░`
  - [x] Shimmer effect with `▒` or changing shade
- [x] Implement shapes for different content types
- [x] Add CSS styles with class `.dos-skeleton`
  - [x] `.dos-skeleton--text`
  - [x] `.dos-skeleton--rectangle`
  - [x] `.dos-skeleton--circle`
  - [x] `.dos-skeleton--animated`
  - [x] CSS animation for shimmer
- [x] Add ARIA attributes
  - [x] `aria-busy="true"`
  - [x] `aria-label` — describes loading content
- [x] Write unit tests
  - [x] Test: renders correct shape
  - [x] Test: animates when enabled
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Text skeleton
  - [x] Card skeleton
  - [x] Avatar skeleton
  - [x] Code snippet displayed

> **Accessibility:** `aria-busy` indicates loading state.
> **Keyboard:** Not interactive

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 8

---

## Phase 9: Data Display Components

### 9.1 Table

**File:** `src/components/Table/Table.ts`
**Styles:** `src/components/Table/Table.css`
**Types:** `src/components/Table/Table.types.ts`
**Tests:** `tests/components/Table.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TableProps`
  - [x] Prop: `columns` (TableColumn[]) — column definitions
  - [x] Prop: `data` (object[]) — row data
  - [x] Prop: `sortable` (boolean) — enable sorting
  - [x] Prop: `sortColumn` (string) — current sort column
  - [x] Prop: `sortDirection` ('asc' | 'desc') — sort direction
  - [x] Prop: `selectable` (boolean) — enable row selection
  - [x] Prop: `selectedRows` (string[]) — selected row IDs
  - [x] Prop: `striped` (boolean) — alternating row colors
  - [x] Prop: `bordered` (boolean) — show cell borders
  - [x] Prop: `stickyHeader` (boolean) — fixed header on scroll
  - [x] Prop: `emptyMessage` (string) — message when no data
  - [x] Prop: `onSort` (function) — sort handler
  - [x] Prop: `onSelect` (function) — selection handler
  - [x] Prop: `onRowClick` (function) — row click handler
- [x] Define TypeScript interface `TableColumn`
  - [x] Prop: `key` (string) — data property key
  - [x] Prop: `label` (string) — column header text
  - [x] Prop: `width` (string | number) — column width
  - [x] Prop: `sortable` (boolean) — column sortable
  - [x] Prop: `align` ('left' | 'center' | 'right') — text alignment
  - [x] Prop: `render` (function) — custom cell renderer
- [x] Implement DOS-style table with box-drawing
  ```
  ┌──────────────┬─────────┬──────────┐
  │ Name         │ Size    │ Date     │
  ├──────────────┼─────────┼──────────┤
  │ CONFIG.SYS   │ 1,024   │ 01-15-26 │
  │ AUTOEXEC.BAT │ 512     │ 01-15-26 │
  │ COMMAND.COM  │ 54,619  │ 01-15-26 │
  └──────────────┴─────────┴──────────┘
  ```
- [x] Implement sortable columns with indicators `▲` / `▼`
- [x] Implement row selection with checkboxes
- [x] Implement striped rows using alternate shading
- [x] Add CSS styles with class `.dos-table`
  - [x] `.dos-table___header`
  - [x] `.dos-table___header-cell`
  - [x] `.dos-table___header-cell--sortable`
  - [x] `.dos-table___body`
  - [x] `.dos-table___row`
  - [x] `.dos-table___row--selected`
  - [x] `.dos-table___row--striped`
  - [x] `.dos-table___cell`
  - [x] `.dos-table___sort-indicator`
  - [x] `.dos-table--bordered`
  - [x] `.dos-table--sticky-header`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — navigate rows
  - [x] `Space` — select row (when selectable)
  - [x] `Enter` — activate row
  - [x] Tab through sortable headers
- [x] Add ARIA attributes
  - [x] `role="table"`, `role="rowgroup"`, `role="row"`, `role="columnheader"`, `role="cell"`
  - [x] `aria-sort` — on sortable columns
  - [x] `aria-selected` — on selectable rows
- [x] Write unit tests
  - [x] Test: renders data correctly
  - [x] Test: sorts on column click
  - [x] Test: selects rows
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic table
  - [x] Sortable columns
  - [x] Selectable rows
  - [x] Striped rows
  - [x] Code snippet displayed

> **Accessibility:** Full table ARIA. Sortable columns announced.
> **Keyboard:** `Arrows` to navigate, `Space` to select, `Enter` to activate

---

### 9.2 DataGrid

**File:** `src/components/DataGrid/DataGrid.ts`
**Styles:** `src/components/DataGrid/DataGrid.css`
**Types:** `src/components/DataGrid/DataGrid.types.ts`
**Tests:** `tests/components/DataGrid.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `DataGridProps`
  - [x] Extends TableProps with additional features
  - [x] Prop: `editable` (boolean) — enable cell editing
  - [x] Prop: `resizableColumns` (boolean) — enable column resizing
  - [x] Prop: `reorderableColumns` (boolean) — enable column reordering
  - [x] Prop: `pagination` (PaginationConfig) — pagination settings
  - [x] Prop: `virtualScroll` (boolean) — enable virtual scrolling
  - [x] Prop: `onCellEdit` (function) — cell edit handler
  - [x] Prop: `onColumnResize` (function) — column resize handler
  - [x] Prop: `onColumnReorder` (function) — column reorder handler
- [x] Implement enhanced table with editing
- [x] Implement cell editing (click to edit)
- [x] Implement column resizing with drag handles
- [x] Implement column reordering via drag
- [x] Implement integrated pagination
- [x] Add CSS styles with class `.dos-data-grid`
  - [x] Inherit from `.dos-table`
  - [x] `.dos-data-grid___cell--editing`
  - [x] `.dos-data-grid___resize-handle`
  - [x] `.dos-data-grid___pagination`
- [x] Add keyboard navigation
  - [x] Inherit from Table
  - [x] `F2` or `Enter` — edit cell
  - [x] `Escape` — cancel edit
  - [x] `Tab` — move to next cell in edit mode
- [x] Add ARIA attributes
  - [x] Inherit from Table
  - [x] `aria-readonly` — for non-editable cells
- [x] Write unit tests
  - [x] Test: cell editing works
  - [x] Test: column resize works
  - [x] Test: pagination integration works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Editable grid
  - [x] Resizable columns
  - [x] With pagination
  - [x] Code snippet displayed

> **Accessibility:** Editable cells announced. Edit mode indicated.
> **Keyboard:** `F2`/`Enter` to edit, `Escape` to cancel

---

### 9.3 List (implemented as ListBox)

**File:** `src/components/ListBox/ListBox.ts`
**Styles:** `src/components/ListBox/ListBox.css`
**Types:** `src/components/ListBox/ListBox.types.ts`
**Tests:** `tests/components/ListBox.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `ListBoxProps`
  - [x] Prop: `items` (ListBoxItem[]) — list items
  - [x] Prop: `selectable` (boolean) — enable selection
  - [x] Prop: `multiSelect` (boolean) — allow multiple selection
  - [x] Prop: `selectedItems` (string[]) — selected item IDs
  - [x] Prop: `bordered` (boolean) — show item borders
  - [x] Prop: `dividers` (boolean) — show dividers between items
  - [x] Prop: `onSelect` (function) — selection handler
  - [x] Prop: `onItemClick` (function) — item click handler
- [x] Define TypeScript interface `ListBoxItem`
  - [x] Prop: `id` (string) — unique identifier
  - [x] Prop: `primary` (string) — main text
  - [x] Prop: `secondary` (string) — secondary text
  - [x] Prop: `icon` (string) — leading icon
  - [x] Prop: `trailing` (string | Element) — trailing content
  - [x] Prop: `disabled` (boolean) — item disabled
- [x] Implement vertical list
- [x] Implement selection (single and multi)
- [x] Add CSS styles with class `.dos-listbox`
  - [x] `.dos-listbox___item`
  - [x] `.dos-listbox___item--selected`
  - [x] `.dos-listbox___item--disabled`
  - [x] `.dos-listbox___icon`
  - [x] `.dos-listbox___content`
  - [x] `.dos-listbox___primary`
  - [x] `.dos-listbox___secondary`
  - [x] `.dos-listbox___trailing`
  - [x] `.dos-listbox--dividers`
  - [x] `.dos-listbox--bordered`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — navigate items
  - [x] `Enter` / `Space` — select item
  - [x] `Home` / `End` — first/last item
  - [x] `Ctrl+A` — select all (multi-select)
  - [x] Type-ahead — jump to item by first letter
- [x] Add ARIA attributes
  - [x] `role="listbox"` — on container
  - [x] `role="option"` — on items
  - [x] `aria-selected`
  - [x] `aria-multiselectable`
  - [x] `aria-disabled`
  - [x] `aria-activedescendant`
- [x] Write unit tests (69 tests passing)
  - [x] Test: renders items correctly
  - [x] Test: single selection works
  - [x] Test: multi selection works
  - [x] Test: keyboard navigation works
  - [x] Test: type-ahead navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic list
  - [x] Selectable list
  - [x] Multi-select list
  - [x] With icons and secondary text
  - [x] Disabled items
  - [x] Dense mode
  - [x] Scrollable with maxHeight
  - [x] Instance methods demo
  - [x] Keyboard navigation demo
  - [x] Accessibility info
  - [x] Code snippets displayed

> **Accessibility:** Listbox pattern for selectable. Selection state announced.
> **Keyboard:** `Arrows` to navigate, `Enter`/`Space` to select, `Ctrl+A` select all, type letter to jump

---

### 9.4 TreeView

**File:** `src/components/TreeView/TreeView.ts`
**Styles:** `src/components/TreeView/TreeView.styles.css`
**Types:** `src/components/TreeView/TreeView.types.ts`
**Tests:** `tests/components/TreeView.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TreeViewProps`
  - [x] Prop: `nodes` (TreeNode[]) — tree data
  - [x] Prop: `selectable` (boolean) — enable selection
  - [x] Prop: `multiSelect` (boolean) — allow multiple selection
  - [x] Prop: `selectedNodes` (string[]) — selected node IDs
  - [x] Prop: `expandedNodes` (string[]) — expanded node IDs
  - [x] Prop: `defaultExpanded` (boolean | string[]) — initial expanded
  - [x] Prop: `onSelect` (function) — selection handler
  - [x] Prop: `onExpand` (function) — expand/collapse handler
- [x] Define TypeScript interface `TreeNode`
  - [x] Prop: `id` (string) — unique identifier
  - [x] Prop: `label` (string) — node label
  - [x] Prop: `icon` (string) — node icon (folder, file)
  - [x] Prop: `children` (TreeNode[]) — child nodes
  - [x] Prop: `expanded` (boolean) — expanded state
  - [x] Prop: `disabled` (boolean) — node disabled
- [x] Implement DOS-style tree with ASCII characters
  ```
  ├── Documents
  │   ├── Letters
  │   │   ├── letter1.doc
  │   │   └── letter2.doc
  │   └── Reports
  │       └── report.doc
  ├── Programs
  │   ├── edit.com
  │   └── format.com
  └── README.TXT
  ```
- [x] Tree characters: `├──`, `└──`, `│   `, `    `
- [x] Folder icons: `[+]` closed, `[-]` open
- [x] File icons: `[ ]` or custom
- [x] Implement expand/collapse on click or keyboard
- [x] Add CSS styles with class `.dos-tree-view`
  - [x] `.dos-tree-view___node`
  - [x] `.dos-tree-view___node--expanded`
  - [x] `.dos-tree-view___node--selected`
  - [x] `.dos-tree-view___node--disabled`
  - [x] `.dos-tree-view___icon`
  - [x] `.dos-tree-view___label`
  - [x] `.dos-tree-view___branch`
  - [x] `.dos-tree-view___children`
- [x] Add keyboard navigation
  - [x] `Arrow Up/Down` — navigate nodes
  - [x] `Arrow Right` — expand / move to child
  - [x] `Arrow Left` — collapse / move to parent
  - [x] `Enter` / `Space` — select node
  - [x] `Home` / `End` — first/last visible node
  - [x] `*` — expand all siblings
- [x] Add ARIA attributes
  - [x] `role="tree"`
  - [x] `role="treeitem"`
  - [x] `aria-expanded`
  - [x] `aria-selected`
  - [x] `aria-level`
- [x] Write unit tests
  - [x] Test: renders tree structure
  - [x] Test: expands/collapses nodes
  - [x] Test: selects nodes
  - [x] Test: keyboard navigation works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] File browser tree
  - [x] Selectable tree
  - [x] Code snippet displayed

> **Accessibility:** Full tree ARIA pattern. Level and expanded state announced.
> **Keyboard:** `Arrows` for navigation, `Enter`/`Space` to select

---

### 9.5 Badge / Tag

**File:** `src/components/Badge/Badge.ts`
**Styles:** `src/components/Badge/Badge.styles.css`
**Types:** `src/components/Badge/Badge.types.ts`
**Tests:** `tests/components/Badge.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `BadgeProps`
  - [x] Prop: `label` (string) — badge text
  - [x] Prop: `variant` ('default' | 'primary' | 'success' | 'warning' | 'error' | 'info') — color variant
  - [x] Prop: `size` ('small' | 'medium') — badge size
  - [x] Prop: `removable` (boolean) — show remove button
  - [x] Prop: `icon` (string) — leading icon
  - [x] Prop: `onRemove` (function) — remove handler
- [x] Implement DOS-style badge/tag
  - [x] Display: `[NEW]`, `[v1.0]`, `[ERROR]`
  - [x] Removable: `[NEW ×]`
- [x] Implement color variants using theme colors
- [x] Add CSS styles with class `.dos-badge`
  - [x] `.dos-badge___label`
  - [x] `.dos-badge___icon`
  - [x] `.dos-badge___remove`
  - [x] `.dos-badge--default`
  - [x] `.dos-badge--primary`
  - [x] `.dos-badge--success`
  - [x] `.dos-badge--warning`
  - [x] `.dos-badge--error`
  - [x] `.dos-badge--info`
  - [x] `.dos-badge--small`
  - [x] `.dos-badge--removable`
- [x] Add keyboard navigation
  - [x] Remove button keyboard accessible
- [x] Add ARIA attributes
  - [x] `role="status"` — if dynamic
  - [x] Remove button labeled
- [x] Write unit tests
  - [x] Test: renders label correctly
  - [x] Test: applies variant styles
  - [x] Test: remove button works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] All variants
  - [x] Removable badges
  - [x] Sizes
  - [x] Code snippet displayed

> **Accessibility:** Remove button labeled. Status badges announced.
> **Keyboard:** Remove button focusable

---

### 9.6 Avatar

**File:** `src/components/Avatar/Avatar.ts`
**Styles:** `src/components/Avatar/Avatar.styles.css`
**Types:** `src/components/Avatar/Avatar.types.ts`
**Tests:** `tests/components/Avatar.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `AvatarProps`
  - [x] Prop: `name` (string) — user name (for initials)
  - [x] Prop: `image` (string) — image URL (optional)
  - [x] Prop: `initials` (string) — custom initials override
  - [x] Prop: `size` ('small' | 'medium' | 'large') — avatar size
  - [x] Prop: `status` ('online' | 'offline' | 'busy' | 'away') — status indicator
  - [x] Prop: `shape` ('square' | 'rounded') — avatar shape
- [x] Implement DOS-style ASCII avatar
  ```
  ┌───┐
  │JD │
  └───┘
  ```
- [x] Implement initials fallback (extract from name)
- [x] Implement status indicator dot
- [x] Add CSS styles with class `.dos-avatar`
  - [x] `.dos-avatar___initials`
  - [x] `.dos-avatar___image`
  - [x] `.dos-avatar___status`
  - [x] `.dos-avatar--small`
  - [x] `.dos-avatar--medium`
  - [x] `.dos-avatar--large`
  - [x] `.dos-avatar--square`
  - [x] `.dos-avatar--rounded`
  - [x] `.dos-avatar___status--online`
  - [x] `.dos-avatar___status--offline`
  - [x] `.dos-avatar___status--busy`
  - [x] `.dos-avatar___status--away`
- [x] Add ARIA attributes
  - [x] `role="img"`
  - [x] `aria-label` — user name
- [x] Write unit tests
  - [x] Test: generates initials from name
  - [x] Test: displays image when provided
  - [x] Test: shows status indicator
  - [x] Test: applies size and shape
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] With initials
  - [x] Different sizes
  - [x] Status indicators
  - [x] Code snippet displayed

> **Accessibility:** Labeled as image with user name.
> **Keyboard:** Not interactive

---

### 9.7 Card

**File:** `src/components/Card/Card.ts`
**Styles:** `src/components/Card/Card.styles.css`
**Types:** `src/components/Card/Card.types.ts`
**Tests:** `tests/components/Card.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `CardProps`
  - [x] Prop: `header` (string | Element) — card header
  - [x] Prop: `content` (string | Element) — card body
  - [x] Prop: `footer` (Element) — card footer
  - [x] Prop: `bordered` (boolean) — show border
  - [x] Prop: `elevated` (boolean) — shadow effect
  - [x] Prop: `interactive` (boolean) — clickable card
  - [x] Prop: `selected` (boolean) — selected state
  - [x] Prop: `onClick` (function) — click handler
- [x] Implement DOS-style card container
  ```
  ╔══════════════════════════╗
  ║ Card Header              ║
  ╠══════════════════════════╣
  ║                          ║
  ║ Card content goes here   ║
  ║                          ║
  ╠══════════════════════════╣
  ║ [Action] [Action]        ║
  ╚══════════════════════════╝
  ```
- [x] Implement sections: header, body, footer
- [x] Implement elevation (shadow using ░▒▓)
- [x] Add CSS styles with class `.dos-card`
  - [x] `.dos-card___header`
  - [x] `.dos-card___content`
  - [x] `.dos-card___footer`
  - [x] `.dos-card--bordered`
  - [x] `.dos-card--elevated`
  - [x] `.dos-card--interactive`
  - [x] `.dos-card--selected`
- [x] Add keyboard navigation
  - [x] `Enter` / `Space` — activate (if interactive)
  - [x] `Tab` — navigate to card actions
- [x] Add ARIA attributes
  - [x] `role="article"` — if standalone content
  - [x] `role="button"` — if interactive
  - [x] `aria-selected` — if selectable
- [x] Write unit tests
  - [x] Test: renders sections correctly
  - [x] Test: applies border/elevation
  - [x] Test: interactive mode works
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Basic card
  - [x] With all sections
  - [x] Interactive card
  - [x] Elevated card
  - [x] Code snippet displayed

> **Accessibility:** Proper roles based on usage. Interactive cards keyboard accessible.
> **Keyboard:** `Enter`/`Space` for interactive cards

---

### 9.8 Timeline

**File:** `src/components/Timeline/Timeline.ts`
**Styles:** `src/components/Timeline/Timeline.styles.css`
**Types:** `src/components/Timeline/Timeline.types.ts`
**Tests:** `tests/components/Timeline.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `TimelineProps`
  - [x] Prop: `events` (TimelineEvent[]) — timeline events
  - [x] Prop: `orientation` ('vertical' | 'horizontal') — layout
  - [x] Prop: `alternating` (boolean) — alternate left/right (vertical)
- [x] Define TypeScript interface `TimelineEvent`
  - [x] Prop: `id` (string) — unique identifier
  - [x] Prop: `title` (string) — event title
  - [x] Prop: `description` (string) — event description
  - [x] Prop: `timestamp` (string | Date) — event time
  - [x] Prop: `icon` (string) — event icon
  - [x] Prop: `status` ('completed' | 'current' | 'upcoming') — event status
- [x] Implement DOS-style timeline
  ```
  ●─────── 01/15/2026 ─────────
  │ Event Title
  │ Event description text
  │
  ○─────── 01/20/2026 ─────────
  │ Another Event
  │ More description
  │
  ◌─────── 01/25/2026 ─────────
    Upcoming Event
  ```
- [x] Implement connecting lines
- [x] Implement status indicators: `●` complete, `○` current, `◌` upcoming
- [x] Add CSS styles with class `.dos-timeline`
  - [x] `.dos-timeline___event`
  - [x] `.dos-timeline___event--completed`
  - [x] `.dos-timeline___event--current`
  - [x] `.dos-timeline___event--upcoming`
  - [x] `.dos-timeline___marker`
  - [x] `.dos-timeline___connector`
  - [x] `.dos-timeline___content`
  - [x] `.dos-timeline___timestamp`
  - [x] `.dos-timeline___title`
  - [x] `.dos-timeline___description`
  - [x] `.dos-timeline--vertical`
  - [x] `.dos-timeline--horizontal`
  - [x] `.dos-timeline--alternating`
- [x] Add ARIA attributes
  - [x] `role="list"`
  - [x] `role="listitem"` — on events
  - [x] Time elements with proper datetime
- [x] Write unit tests
  - [x] Test: renders events correctly
  - [x] Test: displays timestamps
  - [x] Test: applies status styles
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] Vertical timeline
  - [x] Alternating layout
  - [x] Different statuses
  - [x] Code snippet displayed

> **Accessibility:** List semantics. Timestamps properly formatted.
> **Keyboard:** Not interactive (unless events are links)

---

### 9.9 EmptyState

**File:** `src/components/EmptyState/EmptyState.ts`
**Styles:** `src/components/EmptyState/EmptyState.styles.css`
**Types:** `src/components/EmptyState/EmptyState.types.ts`
**Tests:** `tests/components/EmptyState.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interface `EmptyStateProps`
  - [x] Prop: `title` (string) — main message
  - [x] Prop: `description` (string) — secondary message
  - [x] Prop: `icon` (string) — illustration/icon
  - [x] Prop: `action` (Element) — action button
  - [x] Prop: `size` ('small' | 'medium' | 'large') — component size
- [x] Implement empty state placeholder
  ```
       _____
      |     |
      |  ?  |
      |_____|

    No files found

  Try adjusting your search
  or check a different folder.

      [ Browse Files ]
  ```
- [x] Implement DOS-style ASCII art illustrations
  - [x] Empty folder
  - [x] No search results
  - [x] Error state
  - [x] No data
- [x] Add CSS styles with class `.dos-empty-state`
  - [x] `.dos-empty-state___icon`
  - [x] `.dos-empty-state___title`
  - [x] `.dos-empty-state___description`
  - [x] `.dos-empty-state___action`
  - [x] `.dos-empty-state--small`
  - [x] `.dos-empty-state--medium`
  - [x] `.dos-empty-state--large`
- [x] Add ARIA attributes
  - [x] `role="status"` — if dynamically shown
  - [x] Action button accessible
- [x] Write unit tests
  - [x] Test: renders title and description
  - [x] Test: displays icon
  - [x] Test: renders action button
  - [x] Test: has no accessibility violations
- [x] Add to Kitchen Sink demo
  - [x] No results example
  - [x] Error state example
  - [x] With action button
  - [x] Code snippet displayed

> **Accessibility:** Announced when appearing dynamically.
> **Keyboard:** Action button focusable

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 9

---

## Phase Summary

### Components Created in Phases 4–9

| Phase | Components |
|-------|------------|
| Phase 4 | Button, ButtonGroup, IconButton, Link |
| Phase 5 | TextInput, Textarea, PasswordInput, Checkbox, RadioButton/RadioGroup, FormGroup, FormValidation |
| Phase 6 | Select, Toggle, Slider, FileInput, DatePicker, TimePicker |
| Phase 7 | MenuBar, DropdownMenu, ContextMenu, Sidebar, Breadcrumbs, Pagination, Stepper |
| Phase 8 | Modal, Window, Alert, Toast, Tooltip, Popover, ProgressBar, LoadingSpinner, SkeletonLoader |
| Phase 9 | Table, DataGrid, List, TreeView, Badge, Avatar, Card, Timeline, EmptyState |

**Total Components: 37**

---

## Next Steps

Continue to **Phases 10–13** for:
- Layout components
- Typography components
- Utility components
- Documentation and polish
