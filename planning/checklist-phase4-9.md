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
**Styles:** `src/components/MenuBar/MenuBar.styles.css`
**Types:** `src/components/MenuBar/MenuBar.types.ts`
**Tests:** `tests/components/MenuBar.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `MenuBarProps`
  - [ ] Prop: `items` (MenuBarItem[]) — menu items
  - [ ] Prop: `onSelect` (function) — item selection handler
- [ ] Define TypeScript interface `MenuBarItem`
  - [ ] Prop: `label` (string) — menu label (e.g., 'File')
  - [ ] Prop: `accessKey` (string) — Alt+key shortcut (e.g., 'F')
  - [ ] Prop: `items` (MenuItem[]) — dropdown items
  - [ ] Prop: `disabled` (boolean) — menu disabled
- [ ] Implement classic DOS horizontal menu bar
  - [ ] Display: `File  Edit  View  Options  Help`
  - [ ] Underline access key character
- [ ] Implement dropdown trigger on click or hover
- [ ] Implement Alt+key shortcuts
- [ ] Implement states: default, hover, active/open, disabled
- [ ] Add CSS styles with class `.dos-menu-bar`
  - [ ] `.dos-menu-bar___item`
  - [ ] `.dos-menu-bar___item--active`
  - [ ] `.dos-menu-bar___item--disabled`
  - [ ] `.dos-menu-bar___accesskey`
- [ ] Add keyboard navigation
  - [ ] `Alt` + letter — open corresponding menu
  - [ ] `Arrow Left/Right` — navigate between menus
  - [ ] `Arrow Down` / `Enter` — open dropdown
  - [ ] `Escape` — close menu
- [ ] Add ARIA attributes
  - [ ] `role="menubar"`
  - [ ] `role="menuitem"` — on each top item
  - [ ] `aria-haspopup="menu"`
  - [ ] `aria-expanded`
- [ ] Write unit tests
  - [ ] Test: renders menu items
  - [ ] Test: opens dropdown on click
  - [ ] Test: Alt+key shortcuts work
  - [ ] Test: arrow key navigation works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Classic DOS menu example
  - [ ] With dropdowns
  - [ ] Code snippet displayed

> **Accessibility:** Full menubar ARIA pattern. Alt+key announced.
> **Keyboard:** `Alt+letter` shortcuts, `Arrows` to navigate

---

### 7.2 DropdownMenu

**File:** `src/components/DropdownMenu/DropdownMenu.ts`
**Styles:** `src/components/DropdownMenu/DropdownMenu.styles.css`
**Types:** `src/components/DropdownMenu/DropdownMenu.types.ts`
**Tests:** `tests/components/DropdownMenu.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `DropdownMenuProps`
  - [ ] Prop: `items` (MenuItem[]) — menu items
  - [ ] Prop: `open` (boolean) — controlled open state
  - [ ] Prop: `trigger` (Element) — trigger element
  - [ ] Prop: `position` ('bottom' | 'right') — dropdown position
  - [ ] Prop: `onSelect` (function) — selection handler
  - [ ] Prop: `onClose` (function) — close handler
- [ ] Define TypeScript interface `MenuItem`
  - [ ] Prop: `label` (string) — item label
  - [ ] Prop: `icon` (string) — optional icon/character
  - [ ] Prop: `shortcut` (string) — keyboard shortcut display
  - [ ] Prop: `disabled` (boolean) — item disabled
  - [ ] Prop: `divider` (boolean) — render as divider
  - [ ] Prop: `items` (MenuItem[]) — nested submenu
  - [ ] Prop: `action` (function) — item action
- [ ] Implement DOS-style dropdown menu
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
- [ ] Implement dividers and submenus
- [ ] Implement states: default, hover, active, disabled
- [ ] Add CSS styles with class `.dos-dropdown-menu`
  - [ ] `.dos-dropdown-menu___item`
  - [ ] `.dos-dropdown-menu___item--highlighted`
  - [ ] `.dos-dropdown-menu___item--disabled`
  - [ ] `.dos-dropdown-menu___icon`
  - [ ] `.dos-dropdown-menu___label`
  - [ ] `.dos-dropdown-menu___shortcut`
  - [ ] `.dos-dropdown-menu___submenu-arrow`
  - [ ] `.dos-dropdown-menu___divider`
- [ ] Add keyboard navigation
  - [ ] `Arrow Up/Down` — navigate items
  - [ ] `Arrow Right` — open submenu
  - [ ] `Arrow Left` — close submenu
  - [ ] `Enter` — activate item
  - [ ] `Escape` — close menu
  - [ ] Type-ahead — jump to item
- [ ] Add ARIA attributes
  - [ ] `role="menu"`
  - [ ] `role="menuitem"` — on items
  - [ ] `role="separator"` — on dividers
  - [ ] `aria-haspopup` — for submenus
  - [ ] `aria-disabled`
- [ ] Write unit tests
  - [ ] Test: renders menu items
  - [ ] Test: handles item selection
  - [ ] Test: keyboard navigation works
  - [ ] Test: submenus open correctly
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic dropdown
  - [ ] With icons and shortcuts
  - [ ] Nested submenus
  - [ ] Code snippet displayed

> **Accessibility:** Full menu ARIA pattern. Submenus announced.
> **Keyboard:** `Arrows` to navigate, `Enter` to select, `Escape` to close

---

### 7.3 ContextMenu

**File:** `src/components/ContextMenu/ContextMenu.ts`
**Styles:** `src/components/ContextMenu/ContextMenu.styles.css`
**Types:** `src/components/ContextMenu/ContextMenu.types.ts`
**Tests:** `tests/components/ContextMenu.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ContextMenuProps`
  - [ ] Prop: `items` (MenuItem[]) — menu items (same as DropdownMenu)
  - [ ] Prop: `target` (Element | string) — element(s) to attach to
  - [ ] Prop: `onSelect` (function) — selection handler
  - [ ] Prop: `onOpen` (function) — open handler with position
  - [ ] Prop: `onClose` (function) — close handler
- [ ] Implement right-click triggered menu
- [ ] Position at cursor location
- [ ] Reuse DropdownMenu styling and items
- [ ] Handle viewport boundary collision
- [ ] Implement states: closed, open
- [ ] Add CSS styles with class `.dos-context-menu`
  - [ ] Inherit from `.dos-dropdown-menu`
  - [ ] Positioning utilities
- [ ] Add keyboard navigation
  - [ ] `Shift+F10` — open context menu (standard)
  - [ ] Same navigation as DropdownMenu
- [ ] Add ARIA attributes
  - [ ] Same as DropdownMenu
  - [ ] Announced as context menu
- [ ] Write unit tests
  - [ ] Test: opens on right-click
  - [ ] Test: positions at cursor
  - [ ] Test: handles boundary collision
  - [ ] Test: keyboard trigger works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Right-click target area
  - [ ] With various menu items
  - [ ] Code snippet displayed

> **Accessibility:** Can be triggered via `Shift+F10`. Focus managed properly.
> **Keyboard:** `Shift+F10` to open, same navigation as DropdownMenu

---

### 7.4 Sidebar

**File:** `src/components/Sidebar/Sidebar.ts`
**Styles:** `src/components/Sidebar/Sidebar.styles.css`
**Types:** `src/components/Sidebar/Sidebar.types.ts`
**Tests:** `tests/components/Sidebar.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `SidebarProps`
  - [ ] Prop: `items` (SidebarItem[]) — navigation items
  - [ ] Prop: `activeItem` (string) — currently active item ID
  - [ ] Prop: `collapsible` (boolean) — sections can collapse
  - [ ] Prop: `collapsed` (boolean) — entire sidebar collapsed
  - [ ] Prop: `width` (string | number) — sidebar width
  - [ ] Prop: `position` ('left' | 'right') — sidebar position
  - [ ] Prop: `onSelect` (function) — item selection handler
- [ ] Define TypeScript interface `SidebarItem`
  - [ ] Prop: `id` (string) — unique identifier
  - [ ] Prop: `label` (string) — item label
  - [ ] Prop: `icon` (string) — optional icon
  - [ ] Prop: `items` (SidebarItem[]) — nested items (section)
  - [ ] Prop: `expanded` (boolean) — section expanded state
  - [ ] Prop: `disabled` (boolean) — item disabled
- [ ] Implement DOS-style navigation panel
- [ ] Implement collapsible sections with `▼` / `▶` indicators
- [ ] Implement active state indication
- [ ] Add CSS styles with class `.dos-sidebar`
  - [ ] `.dos-sidebar___section`
  - [ ] `.dos-sidebar___section-header`
  - [ ] `.dos-sidebar___section-toggle`
  - [ ] `.dos-sidebar___item`
  - [ ] `.dos-sidebar___item--active`
  - [ ] `.dos-sidebar___item--disabled`
  - [ ] `.dos-sidebar--collapsed`
- [ ] Add keyboard navigation
  - [ ] `Arrow Up/Down` — navigate items
  - [ ] `Enter` — select item / toggle section
  - [ ] `Arrow Left/Right` — collapse/expand sections
- [ ] Add ARIA attributes
  - [ ] `role="navigation"`
  - [ ] `aria-current="page"` — on active item
  - [ ] `aria-expanded` — on collapsible sections
- [ ] Write unit tests
  - [ ] Test: renders navigation items
  - [ ] Test: highlights active item
  - [ ] Test: collapses/expands sections
  - [ ] Test: keyboard navigation works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic sidebar
  - [ ] With collapsible sections
  - [ ] Code snippet displayed

> **Accessibility:** Navigation landmark. Active item announced.
> **Keyboard:** `Arrows` to navigate, `Enter` to select/toggle

---

### 7.5 Breadcrumbs

**File:** `src/components/Breadcrumbs/Breadcrumbs.ts`
**Styles:** `src/components/Breadcrumbs/Breadcrumbs.styles.css`
**Types:** `src/components/Breadcrumbs/Breadcrumbs.types.ts`
**Tests:** `tests/components/Breadcrumbs.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `BreadcrumbsProps`
  - [ ] Prop: `items` (BreadcrumbItem[]) — path items
  - [ ] Prop: `separator` (string) — separator character (default '>')
  - [ ] Prop: `maxItems` (number) — max visible items (collapse middle)
  - [ ] Prop: `onSelect` (function) — item click handler
- [ ] Define TypeScript interface `BreadcrumbItem`
  - [ ] Prop: `label` (string) — display text
  - [ ] Prop: `href` (string) — optional link
  - [ ] Prop: `icon` (string) — optional icon
- [ ] Implement DOS-style breadcrumb trail
  - [ ] Display: `Home > Section > Subsection > Page`
- [ ] Implement separator customization
  - [ ] Options: `>`, `»`, `/`, `\`, `│`
- [ ] Implement overflow with ellipsis for long paths
- [ ] Last item is current (not a link)
- [ ] Add CSS styles with class `.dos-breadcrumbs`
  - [ ] `.dos-breadcrumbs___item`
  - [ ] `.dos-breadcrumbs___item--current`
  - [ ] `.dos-breadcrumbs___separator`
  - [ ] `.dos-breadcrumbs___ellipsis`
- [ ] Add keyboard navigation
  - [ ] `Tab` — navigate between links
- [ ] Add ARIA attributes
  - [ ] `role="navigation"`
  - [ ] `aria-label="Breadcrumb"`
  - [ ] `aria-current="page"` — on last item
- [ ] Write unit tests
  - [ ] Test: renders path correctly
  - [ ] Test: uses correct separator
  - [ ] Test: last item is not a link
  - [ ] Test: collapse overflow works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic breadcrumb trail
  - [ ] Different separators
  - [ ] Long path with collapse
  - [ ] Code snippet displayed

> **Accessibility:** Navigation landmark with "Breadcrumb" label. Current page announced.
> **Keyboard:** `Tab` between links

---

### 7.6 Pagination

**File:** `src/components/Pagination/Pagination.ts`
**Styles:** `src/components/Pagination/Pagination.styles.css`
**Types:** `src/components/Pagination/Pagination.types.ts`
**Tests:** `tests/components/Pagination.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `PaginationProps`
  - [ ] Prop: `currentPage` (number) — current page (1-indexed)
  - [ ] Prop: `totalPages` (number) — total page count
  - [ ] Prop: `siblingCount` (number) — pages shown around current
  - [ ] Prop: `boundaryCount` (number) — pages at start/end
  - [ ] Prop: `showFirstLast` (boolean) — show first/last buttons
  - [ ] Prop: `showPrevNext` (boolean) — show prev/next buttons
  - [ ] Prop: `onChange` (function) — page change handler
- [ ] Implement DOS-style pagination
  - [ ] Display: `[<<] [<] 1 2 [3] 4 5 ... 10 [>] [>>]`
  - [ ] First: `[<<]` or `[|<]`
  - [ ] Previous: `[<]`
  - [ ] Next: `[>]`
  - [ ] Last: `[>>]` or `[>|]`
- [ ] Implement ellipsis for large page counts
- [ ] Implement current page highlight
- [ ] Add CSS styles with class `.dos-pagination`
  - [ ] `.dos-pagination___button`
  - [ ] `.dos-pagination___page`
  - [ ] `.dos-pagination___page--current`
  - [ ] `.dos-pagination___page--disabled`
  - [ ] `.dos-pagination___ellipsis`
- [ ] Add keyboard navigation
  - [ ] `Tab` — navigate between buttons
  - [ ] `Enter` — activate button
  - [ ] `Arrow Left/Right` — prev/next page (optional)
- [ ] Add ARIA attributes
  - [ ] `role="navigation"`
  - [ ] `aria-label="Pagination"`
  - [ ] `aria-current="page"` — on current page
  - [ ] `aria-disabled` — on disabled buttons
- [ ] Write unit tests
  - [ ] Test: renders correct page numbers
  - [ ] Test: highlights current page
  - [ ] Test: disables prev on first page
  - [ ] Test: disables next on last page
  - [ ] Test: ellipsis appears correctly
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic pagination
  - [ ] With first/last buttons
  - [ ] Large page count with ellipsis
  - [ ] Code snippet displayed

> **Accessibility:** Navigation landmark. Current page announced.
> **Keyboard:** `Tab` between buttons, `Enter` to select

---

### 7.7 Stepper / Wizard

**File:** `src/components/Stepper/Stepper.ts`
**Styles:** `src/components/Stepper/Stepper.styles.css`
**Types:** `src/components/Stepper/Stepper.types.ts`
**Tests:** `tests/components/Stepper.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `StepperProps`
  - [ ] Prop: `steps` (Step[]) — step definitions
  - [ ] Prop: `currentStep` (number) — active step (0-indexed)
  - [ ] Prop: `orientation` ('horizontal' | 'vertical') — layout
  - [ ] Prop: `allowStepClick` (boolean) — navigate by clicking steps
  - [ ] Prop: `showStepNumbers` (boolean) — display step numbers
  - [ ] Prop: `onChange` (function) — step change handler
- [ ] Define TypeScript interface `Step`
  - [ ] Prop: `label` (string) — step label
  - [ ] Prop: `description` (string) — optional description
  - [ ] Prop: `completed` (boolean) — step completed
  - [ ] Prop: `error` (boolean) — step has error
  - [ ] Prop: `disabled` (boolean) — step disabled
- [ ] Implement DOS-style step indicator
  - [ ] Horizontal: `[1]───[2]───(3)───[ ]───[ ]`
  - [ ] Completed: `[✓]` or `[X]`
  - [ ] Current: `(3)` or `[●]`
  - [ ] Upcoming: `[ ]`
- [ ] Implement connecting lines between steps
- [ ] Add CSS styles with class `.dos-stepper`
  - [ ] `.dos-stepper___step`
  - [ ] `.dos-stepper___step-indicator`
  - [ ] `.dos-stepper___step-label`
  - [ ] `.dos-stepper___step-description`
  - [ ] `.dos-stepper___connector`
  - [ ] `.dos-stepper___step--completed`
  - [ ] `.dos-stepper___step--current`
  - [ ] `.dos-stepper___step--error`
  - [ ] `.dos-stepper___step--disabled`
  - [ ] `.dos-stepper--horizontal`
  - [ ] `.dos-stepper--vertical`
- [ ] Add keyboard navigation
  - [ ] `Tab` — navigate between steps (if clickable)
  - [ ] `Enter` — go to step (if clickable)
- [ ] Add ARIA attributes
  - [ ] `role="list"` — on stepper
  - [ ] `role="listitem"` — on each step
  - [ ] `aria-current="step"` — on current step
- [ ] Write unit tests
  - [ ] Test: renders all steps
  - [ ] Test: highlights current step
  - [ ] Test: shows completed status
  - [ ] Test: click navigation works (when enabled)
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Horizontal stepper
  - [ ] Vertical stepper
  - [ ] With completed/error states
  - [ ] Code snippet displayed

> **Accessibility:** Step progress announced. Current step indicated.
> **Keyboard:** `Tab` to navigate if clickable

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 7

---

## Phase 8: Feedback & Overlay Components

### 8.1 Modal / Dialog

**File:** `src/components/Modal/Modal.ts`
**Styles:** `src/components/Modal/Modal.styles.css`
**Types:** `src/components/Modal/Modal.types.ts`
**Tests:** `tests/components/Modal.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ModalProps`
  - [ ] Prop: `open` (boolean) — visibility state
  - [ ] Prop: `title` (string) — dialog title
  - [ ] Prop: `content` (string | Element) — dialog body
  - [ ] Prop: `footer` (Element) — footer content (buttons)
  - [ ] Prop: `size` ('small' | 'medium' | 'large' | 'fullscreen') — modal size
  - [ ] Prop: `closable` (boolean) — show close button
  - [ ] Prop: `closeOnEscape` (boolean) — close on Escape key
  - [ ] Prop: `closeOnOverlay` (boolean) — close on overlay click
  - [ ] Prop: `onClose` (function) — close handler
  - [ ] Prop: `onOpen` (function) — open handler
- [ ] Implement centered overlay dialog
- [ ] Implement DOS-style box-drawing border
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
- [ ] Implement focus trap (focus stays within modal)
- [ ] Implement scroll lock on body
- [ ] Implement states: closed, open
- [ ] Add CSS styles with class `.dos-modal`
  - [ ] `.dos-modal___overlay`
  - [ ] `.dos-modal___dialog`
  - [ ] `.dos-modal___header`
  - [ ] `.dos-modal___title`
  - [ ] `.dos-modal___close`
  - [ ] `.dos-modal___body`
  - [ ] `.dos-modal___footer`
  - [ ] `.dos-modal--small`
  - [ ] `.dos-modal--medium`
  - [ ] `.dos-modal--large`
  - [ ] `.dos-modal--fullscreen`
- [ ] Add keyboard navigation
  - [ ] `Escape` — close modal
  - [ ] `Tab` — cycle through focusable elements
  - [ ] Focus returns to trigger on close
- [ ] Add ARIA attributes
  - [ ] `role="dialog"`
  - [ ] `aria-modal="true"`
  - [ ] `aria-labelledby` — points to title
  - [ ] `aria-describedby` — points to content
- [ ] Write unit tests
  - [ ] Test: opens and closes correctly
  - [ ] Test: focus trap works
  - [ ] Test: Escape closes modal
  - [ ] Test: overlay click closes (when enabled)
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic modal
  - [ ] Different sizes
  - [ ] With form content
  - [ ] Code snippet displayed

> **Accessibility:** Focus trapped. Escape to close. Announced as dialog.
> **Keyboard:** `Escape` to close, `Tab` to navigate within

---

### 8.2 Window

**File:** `src/components/Window/Window.ts`
**Styles:** `src/components/Window/Window.styles.css`
**Types:** `src/components/Window/Window.types.ts`
**Tests:** `tests/components/Window.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `WindowProps`
  - [ ] Prop: `title` (string) — window title
  - [ ] Prop: `content` (Element) — window content
  - [ ] Prop: `width` (number | string) — initial width
  - [ ] Prop: `height` (number | string) — initial height
  - [ ] Prop: `x` (number) — initial X position
  - [ ] Prop: `y` (number) — initial Y position
  - [ ] Prop: `minimized` (boolean) — minimized state
  - [ ] Prop: `maximized` (boolean) — maximized state
  - [ ] Prop: `draggable` (boolean) — can be dragged
  - [ ] Prop: `resizable` (boolean) — can be resized
  - [ ] Prop: `showMinimize` (boolean) — show minimize button
  - [ ] Prop: `showMaximize` (boolean) — show maximize button
  - [ ] Prop: `showClose` (boolean) — show close button
  - [ ] Prop: `onClose` (function) — close handler
  - [ ] Prop: `onMinimize` (function) — minimize handler
  - [ ] Prop: `onMaximize` (function) — maximize handler
  - [ ] Prop: `onMove` (function) — move handler
  - [ ] Prop: `onResize` (function) — resize handler
- [ ] Implement full DOS window frame
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
- [ ] Implement title bar with controls
  - [ ] Minimize: `[─]` or `[_]`
  - [ ] Maximize/Restore: `[□]` or `[↕]`
  - [ ] Close: `[X]`
- [ ] Implement drag to move (when enabled)
- [ ] Implement resize handles (when enabled)
- [ ] Implement states: normal, minimized, maximized, focused
- [ ] Add CSS styles with class `.dos-window`
  - [ ] `.dos-window___frame`
  - [ ] `.dos-window___title-bar`
  - [ ] `.dos-window___title`
  - [ ] `.dos-window___controls`
  - [ ] `.dos-window___control`
  - [ ] `.dos-window___content`
  - [ ] `.dos-window___resize-handle`
  - [ ] `.dos-window--minimized`
  - [ ] `.dos-window--maximized`
  - [ ] `.dos-window--focused`
  - [ ] `.dos-window--dragging`
- [ ] Add keyboard navigation
  - [ ] Title bar buttons keyboard accessible
  - [ ] `Alt+F4` — close (optional)
  - [ ] Focus management
- [ ] Add ARIA attributes
  - [ ] `role="dialog"` or appropriate landmark
  - [ ] `aria-labelledby` — title
  - [ ] Button labels for controls
- [ ] Write unit tests
  - [ ] Test: renders window frame
  - [ ] Test: drag to move works
  - [ ] Test: resize works
  - [ ] Test: minimize/maximize/close work
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic window
  - [ ] Draggable window
  - [ ] Resizable window
  - [ ] Multiple windows
  - [ ] Code snippet displayed

> **Accessibility:** Title bar controls labeled. Focus management for window.
> **Keyboard:** Control buttons keyboard accessible

---

### 8.3 Alert

**File:** `src/components/Alert/Alert.ts`
**Styles:** `src/components/Alert/Alert.styles.css`
**Types:** `src/components/Alert/Alert.types.ts`
**Tests:** `tests/components/Alert.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `AlertProps`
  - [ ] Prop: `message` (string | Element) — alert content
  - [ ] Prop: `type` ('info' | 'success' | 'warning' | 'error') — alert type
  - [ ] Prop: `title` (string) — optional title
  - [ ] Prop: `icon` (boolean | string) — show/custom icon
  - [ ] Prop: `dismissible` (boolean) — can be dismissed
  - [ ] Prop: `onDismiss` (function) — dismiss handler
- [ ] Implement banner-style notification
  ```
  ╔══[!]════════════════════════════════════════╗
  ║ Warning: This action cannot be undone.  [X] ║
  ╚═════════════════════════════════════════════╝
  ```
- [ ] Implement type-specific icons and colors
  - [ ] Info: `[i]`, primary/secondary color
  - [ ] Success: `[✓]`, success color
  - [ ] Warning: `[!]`, warning color
  - [ ] Error: `[✗]`, error color
- [ ] Implement dismissible with close button
- [ ] Add CSS styles with class `.dos-alert`
  - [ ] `.dos-alert___icon`
  - [ ] `.dos-alert___title`
  - [ ] `.dos-alert___message`
  - [ ] `.dos-alert___dismiss`
  - [ ] `.dos-alert--info`
  - [ ] `.dos-alert--success`
  - [ ] `.dos-alert--warning`
  - [ ] `.dos-alert--error`
- [ ] Add keyboard navigation
  - [ ] Dismiss button keyboard accessible
- [ ] Add ARIA attributes
  - [ ] `role="alert"` — for important messages
  - [ ] `role="status"` — for informational
  - [ ] `aria-live` — appropriate politeness
- [ ] Write unit tests
  - [ ] Test: renders message correctly
  - [ ] Test: applies type-specific styles
  - [ ] Test: dismisses on button click
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] All alert types
  - [ ] Dismissible alerts
  - [ ] With titles
  - [ ] Code snippet displayed

> **Accessibility:** Uses appropriate role based on urgency. Announced to screen readers.
> **Keyboard:** Dismiss button focusable

---

### 8.4 Toast

**File:** `src/components/Toast/Toast.ts`
**Styles:** `src/components/Toast/Toast.styles.css`
**Types:** `src/components/Toast/Toast.types.ts`
**Tests:** `tests/components/Toast.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ToastProps`
  - [ ] Prop: `message` (string) — toast content
  - [ ] Prop: `type` ('info' | 'success' | 'warning' | 'error') — toast type
  - [ ] Prop: `duration` (number) — auto-dismiss time (ms)
  - [ ] Prop: `position` ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center') — screen position
  - [ ] Prop: `dismissible` (boolean) — can be manually dismissed
  - [ ] Prop: `onDismiss` (function) — dismiss handler
- [ ] Define TypeScript interface `ToastContainerProps`
  - [ ] Prop: `position` — default position
  - [ ] Prop: `maxToasts` (number) — max visible toasts
- [ ] Implement temporary notification
- [ ] Implement ToastContainer for managing multiple toasts
- [ ] Implement auto-dismiss with countdown
- [ ] Implement stack/queue behavior
- [ ] Add CSS styles with class `.dos-toast`
  - [ ] `.dos-toast___message`
  - [ ] `.dos-toast___dismiss`
  - [ ] `.dos-toast--info`
  - [ ] `.dos-toast--success`
  - [ ] `.dos-toast--warning`
  - [ ] `.dos-toast--error`
  - [ ] `.dos-toast--entering`
  - [ ] `.dos-toast--exiting`
- [ ] Add CSS styles with class `.dos-toast-container`
  - [ ] Position variants
- [ ] Add keyboard navigation
  - [ ] Dismiss button keyboard accessible
  - [ ] Focus management for stacked toasts
- [ ] Add ARIA attributes
  - [ ] `role="status"` or `role="alert"`
  - [ ] `aria-live="polite"` or `"assertive"`
- [ ] Write unit tests
  - [ ] Test: displays toast message
  - [ ] Test: auto-dismisses after duration
  - [ ] Test: manual dismiss works
  - [ ] Test: stacks multiple toasts
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Trigger various toasts
  - [ ] Different positions
  - [ ] Stacked toasts
  - [ ] Code snippet displayed

> **Accessibility:** Announced via live region. Pause auto-dismiss on hover.
> **Keyboard:** Dismiss button focusable, focus management

---

### 8.5 Tooltip

**File:** `src/components/Tooltip/Tooltip.ts`
**Styles:** `src/components/Tooltip/Tooltip.styles.css`
**Types:** `src/components/Tooltip/Tooltip.types.ts`
**Tests:** `tests/components/Tooltip.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `TooltipProps`
  - [ ] Prop: `content` (string) — tooltip text
  - [ ] Prop: `position` ('top' | 'bottom' | 'left' | 'right') — preferred position
  - [ ] Prop: `trigger` ('hover' | 'focus' | 'both') — trigger method
  - [ ] Prop: `delay` (number) — show delay (ms)
  - [ ] Prop: `arrow` (boolean) — show arrow pointer
  - [ ] Prop: `target` (Element) — element to attach to
- [ ] Implement hover-triggered info overlay
- [ ] Implement arrow pointing to target
- [ ] Handle viewport boundary collision (flip position)
- [ ] Implement show delay to prevent flicker
- [ ] Add CSS styles with class `.dos-tooltip`
  - [ ] `.dos-tooltip___content`
  - [ ] `.dos-tooltip___arrow`
  - [ ] `.dos-tooltip--top`
  - [ ] `.dos-tooltip--bottom`
  - [ ] `.dos-tooltip--left`
  - [ ] `.dos-tooltip--right`
  - [ ] `.dos-tooltip--visible`
- [ ] Add keyboard navigation
  - [ ] Show on focus (for focus trigger)
  - [ ] `Escape` — hide tooltip
- [ ] Add ARIA attributes
  - [ ] `role="tooltip"`
  - [ ] `aria-describedby` — on target element
- [ ] Write unit tests
  - [ ] Test: shows on hover
  - [ ] Test: shows on focus
  - [ ] Test: positions correctly
  - [ ] Test: handles boundary collision
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic tooltips
  - [ ] All positions
  - [ ] Trigger variants
  - [ ] Code snippet displayed

> **Accessibility:** Associated via `aria-describedby`. Keyboard accessible via focus.
> **Keyboard:** `Escape` to dismiss, focusable trigger shows tooltip

---

### 8.6 Popover

**File:** `src/components/Popover/Popover.ts`
**Styles:** `src/components/Popover/Popover.styles.css`
**Types:** `src/components/Popover/Popover.types.ts`
**Tests:** `tests/components/Popover.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `PopoverProps`
  - [ ] Prop: `content` (Element) — popover content
  - [ ] Prop: `title` (string) — optional header
  - [ ] Prop: `position` ('top' | 'bottom' | 'left' | 'right') — preferred position
  - [ ] Prop: `trigger` ('click' | 'hover' | 'focus') — trigger method
  - [ ] Prop: `arrow` (boolean) — show arrow pointer
  - [ ] Prop: `closeOnClickOutside` (boolean) — dismiss on outside click
  - [ ] Prop: `target` (Element) — element to attach to
  - [ ] Prop: `onOpen` (function) — open handler
  - [ ] Prop: `onClose` (function) — close handler
- [ ] Implement click-triggered overlay
- [ ] Support richer content than tooltip
- [ ] Implement arrow pointing to target
- [ ] Handle viewport boundary collision
- [ ] Add CSS styles with class `.dos-popover`
  - [ ] `.dos-popover___header`
  - [ ] `.dos-popover___content`
  - [ ] `.dos-popover___arrow`
  - [ ] `.dos-popover--top`
  - [ ] `.dos-popover--bottom`
  - [ ] `.dos-popover--left`
  - [ ] `.dos-popover--right`
  - [ ] `.dos-popover--open`
- [ ] Add keyboard navigation
  - [ ] `Enter` / `Space` — toggle popover
  - [ ] `Escape` — close popover
  - [ ] Focus management within popover
- [ ] Add ARIA attributes
  - [ ] `aria-haspopup="dialog"` — on trigger
  - [ ] `aria-expanded` — on trigger
  - [ ] Popover labeled appropriately
- [ ] Write unit tests
  - [ ] Test: opens on click
  - [ ] Test: closes on outside click
  - [ ] Test: keyboard toggle works
  - [ ] Test: positions correctly
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic popover
  - [ ] With form content
  - [ ] Different positions
  - [ ] Code snippet displayed

> **Accessibility:** Focus managed within. Escape to close.
> **Keyboard:** `Enter`/`Space` to toggle, `Escape` to close

---

### 8.7 ProgressBar

**File:** `src/components/ProgressBar/ProgressBar.ts`
**Styles:** `src/components/ProgressBar/ProgressBar.styles.css`
**Types:** `src/components/ProgressBar/ProgressBar.types.ts`
**Tests:** `tests/components/ProgressBar.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ProgressBarProps`
  - [ ] Prop: `value` (number) — current value (0-100)
  - [ ] Prop: `max` (number) — maximum value (default 100)
  - [ ] Prop: `showValue` (boolean) — display percentage
  - [ ] Prop: `valueFormat` (function) — custom value formatter
  - [ ] Prop: `indeterminate` (boolean) — unknown progress
  - [ ] Prop: `size` ('small' | 'medium' | 'large') — bar height
  - [ ] Prop: `color` (string) — custom fill color
  - [ ] Prop: `label` (string) — accessible label
- [ ] Implement DOS-style progress bar
  - [ ] Style A: `████████░░░░░░░░` (blocks)
  - [ ] Style B: `[████████        ]` (boxed)
  - [ ] Percentage: `[████████        ] 50%`
- [ ] Implement indeterminate animation
- [ ] Add CSS styles with class `.dos-progress-bar`
  - [ ] `.dos-progress-bar___track`
  - [ ] `.dos-progress-bar___fill`
  - [ ] `.dos-progress-bar___value`
  - [ ] `.dos-progress-bar--small`
  - [ ] `.dos-progress-bar--medium`
  - [ ] `.dos-progress-bar--large`
  - [ ] `.dos-progress-bar--indeterminate`
- [ ] Add keyboard navigation
  - [ ] Not interactive (display only)
- [ ] Add ARIA attributes
  - [ ] `role="progressbar"`
  - [ ] `aria-valuemin="0"`
  - [ ] `aria-valuemax`
  - [ ] `aria-valuenow`
  - [ ] `aria-valuetext` — human-readable value
  - [ ] `aria-label` — description
- [ ] Write unit tests
  - [ ] Test: renders correct fill percentage
  - [ ] Test: displays value when enabled
  - [ ] Test: indeterminate mode works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic progress bars
  - [ ] With percentage display
  - [ ] Indeterminate state
  - [ ] Different sizes
  - [ ] Code snippet displayed

> **Accessibility:** Proper progressbar role with value attributes.
> **Keyboard:** Not interactive

---

### 8.8 LoadingSpinner

**File:** `src/components/LoadingSpinner/LoadingSpinner.ts`
**Styles:** `src/components/LoadingSpinner/LoadingSpinner.styles.css`
**Types:** `src/components/LoadingSpinner/LoadingSpinner.types.ts`
**Tests:** `tests/components/LoadingSpinner.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `LoadingSpinnerProps`
  - [ ] Prop: `size` ('small' | 'medium' | 'large') — spinner size
  - [ ] Prop: `label` (string) — accessible label
  - [ ] Prop: `style` ('ascii' | 'block' | 'dots') — animation style
- [ ] Implement ASCII animation spinner
  - [ ] ASCII cycle: `|`, `/`, `-`, `\` (rotating)
  - [ ] Block: `▖`, `▘`, `▝`, `▗` (rotating)
  - [ ] Dots: `⠋`, `⠙`, `⠹`, `⠸`, `⠼`, `⠴`, `⠦`, `⠧`, `⠇`, `⠏` (braille)
- [ ] Implement animation timing
- [ ] Add CSS styles with class `.dos-loading-spinner`
  - [ ] `.dos-loading-spinner___character`
  - [ ] `.dos-loading-spinner--small`
  - [ ] `.dos-loading-spinner--medium`
  - [ ] `.dos-loading-spinner--large`
  - [ ] CSS animation for frame switching
- [ ] Add ARIA attributes
  - [ ] `role="status"`
  - [ ] `aria-live="polite"`
  - [ ] `aria-label` — loading description
- [ ] Write unit tests
  - [ ] Test: renders spinner
  - [ ] Test: animates correctly
  - [ ] Test: applies size
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] All animation styles
  - [ ] Different sizes
  - [ ] In context (button loading, etc.)
  - [ ] Code snippet displayed

> **Accessibility:** Status role announces loading. Label describes what's loading.
> **Keyboard:** Not interactive

---

### 8.9 SkeletonLoader

**File:** `src/components/SkeletonLoader/SkeletonLoader.ts`
**Styles:** `src/components/SkeletonLoader/SkeletonLoader.styles.css`
**Types:** `src/components/SkeletonLoader/SkeletonLoader.types.ts`
**Tests:** `tests/components/SkeletonLoader.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `SkeletonLoaderProps`
  - [ ] Prop: `variant` ('text' | 'rectangle' | 'circle') — shape variant
  - [ ] Prop: `width` (string | number) — element width
  - [ ] Prop: `height` (string | number) — element height
  - [ ] Prop: `lines` (number) — for text variant, number of lines
  - [ ] Prop: `animate` (boolean) — show shimmer animation
  - [ ] Prop: `label` (string) — accessible label
- [ ] Implement DOS-style content placeholder
  - [ ] Use block characters: `░░░░░░░░░░░░░░`
  - [ ] Shimmer effect with `▒` or changing shade
- [ ] Implement shapes for different content types
- [ ] Add CSS styles with class `.dos-skeleton`
  - [ ] `.dos-skeleton--text`
  - [ ] `.dos-skeleton--rectangle`
  - [ ] `.dos-skeleton--circle`
  - [ ] `.dos-skeleton--animated`
  - [ ] CSS animation for shimmer
- [ ] Add ARIA attributes
  - [ ] `aria-busy="true"`
  - [ ] `aria-label` — describes loading content
- [ ] Write unit tests
  - [ ] Test: renders correct shape
  - [ ] Test: animates when enabled
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Text skeleton
  - [ ] Card skeleton
  - [ ] Avatar skeleton
  - [ ] Code snippet displayed

> **Accessibility:** `aria-busy` indicates loading state.
> **Keyboard:** Not interactive

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 8

---

## Phase 9: Data Display Components

### 9.1 Table

**File:** `src/components/Table/Table.ts`
**Styles:** `src/components/Table/Table.styles.css`
**Types:** `src/components/Table/Table.types.ts`
**Tests:** `tests/components/Table.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `TableProps`
  - [ ] Prop: `columns` (TableColumn[]) — column definitions
  - [ ] Prop: `data` (object[]) — row data
  - [ ] Prop: `sortable` (boolean) — enable sorting
  - [ ] Prop: `sortColumn` (string) — current sort column
  - [ ] Prop: `sortDirection` ('asc' | 'desc') — sort direction
  - [ ] Prop: `selectable` (boolean) — enable row selection
  - [ ] Prop: `selectedRows` (string[]) — selected row IDs
  - [ ] Prop: `striped` (boolean) — alternating row colors
  - [ ] Prop: `bordered` (boolean) — show cell borders
  - [ ] Prop: `stickyHeader` (boolean) — fixed header on scroll
  - [ ] Prop: `emptyMessage` (string) — message when no data
  - [ ] Prop: `onSort` (function) — sort handler
  - [ ] Prop: `onSelect` (function) — selection handler
  - [ ] Prop: `onRowClick` (function) — row click handler
- [ ] Define TypeScript interface `TableColumn`
  - [ ] Prop: `key` (string) — data property key
  - [ ] Prop: `label` (string) — column header text
  - [ ] Prop: `width` (string | number) — column width
  - [ ] Prop: `sortable` (boolean) — column sortable
  - [ ] Prop: `align` ('left' | 'center' | 'right') — text alignment
  - [ ] Prop: `render` (function) — custom cell renderer
- [ ] Implement DOS-style table with box-drawing
  ```
  ┌──────────────┬─────────┬──────────┐
  │ Name         │ Size    │ Date     │
  ├──────────────┼─────────┼──────────┤
  │ CONFIG.SYS   │ 1,024   │ 01-15-26 │
  │ AUTOEXEC.BAT │ 512     │ 01-15-26 │
  │ COMMAND.COM  │ 54,619  │ 01-15-26 │
  └──────────────┴─────────┴──────────┘
  ```
- [ ] Implement sortable columns with indicators `▲` / `▼`
- [ ] Implement row selection with checkboxes
- [ ] Implement striped rows using alternate shading
- [ ] Add CSS styles with class `.dos-table`
  - [ ] `.dos-table___header`
  - [ ] `.dos-table___header-cell`
  - [ ] `.dos-table___header-cell--sortable`
  - [ ] `.dos-table___body`
  - [ ] `.dos-table___row`
  - [ ] `.dos-table___row--selected`
  - [ ] `.dos-table___row--striped`
  - [ ] `.dos-table___cell`
  - [ ] `.dos-table___sort-indicator`
  - [ ] `.dos-table--bordered`
  - [ ] `.dos-table--sticky-header`
- [ ] Add keyboard navigation
  - [ ] `Arrow Up/Down` — navigate rows
  - [ ] `Space` — select row (when selectable)
  - [ ] `Enter` — activate row
  - [ ] Tab through sortable headers
- [ ] Add ARIA attributes
  - [ ] `role="table"`, `role="rowgroup"`, `role="row"`, `role="columnheader"`, `role="cell"`
  - [ ] `aria-sort` — on sortable columns
  - [ ] `aria-selected` — on selectable rows
- [ ] Write unit tests
  - [ ] Test: renders data correctly
  - [ ] Test: sorts on column click
  - [ ] Test: selects rows
  - [ ] Test: keyboard navigation works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic table
  - [ ] Sortable columns
  - [ ] Selectable rows
  - [ ] Striped rows
  - [ ] Code snippet displayed

> **Accessibility:** Full table ARIA. Sortable columns announced.
> **Keyboard:** `Arrows` to navigate, `Space` to select, `Enter` to activate

---

### 9.2 DataGrid

**File:** `src/components/DataGrid/DataGrid.ts`
**Styles:** `src/components/DataGrid/DataGrid.styles.css`
**Types:** `src/components/DataGrid/DataGrid.types.ts`
**Tests:** `tests/components/DataGrid.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `DataGridProps`
  - [ ] Extends TableProps with additional features
  - [ ] Prop: `editable` (boolean) — enable cell editing
  - [ ] Prop: `resizableColumns` (boolean) — enable column resizing
  - [ ] Prop: `reorderableColumns` (boolean) — enable column reordering
  - [ ] Prop: `pagination` (PaginationConfig) — pagination settings
  - [ ] Prop: `virtualScroll` (boolean) — enable virtual scrolling
  - [ ] Prop: `onCellEdit` (function) — cell edit handler
  - [ ] Prop: `onColumnResize` (function) — column resize handler
  - [ ] Prop: `onColumnReorder` (function) — column reorder handler
- [ ] Implement enhanced table with editing
- [ ] Implement cell editing (click to edit)
- [ ] Implement column resizing with drag handles
- [ ] Implement column reordering via drag
- [ ] Implement integrated pagination
- [ ] Add CSS styles with class `.dos-data-grid`
  - [ ] Inherit from `.dos-table`
  - [ ] `.dos-data-grid___cell--editing`
  - [ ] `.dos-data-grid___resize-handle`
  - [ ] `.dos-data-grid___pagination`
- [ ] Add keyboard navigation
  - [ ] Inherit from Table
  - [ ] `F2` or `Enter` — edit cell
  - [ ] `Escape` — cancel edit
  - [ ] `Tab` — move to next cell in edit mode
- [ ] Add ARIA attributes
  - [ ] Inherit from Table
  - [ ] `aria-readonly` — for non-editable cells
- [ ] Write unit tests
  - [ ] Test: cell editing works
  - [ ] Test: column resize works
  - [ ] Test: pagination integration works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Editable grid
  - [ ] Resizable columns
  - [ ] With pagination
  - [ ] Code snippet displayed

> **Accessibility:** Editable cells announced. Edit mode indicated.
> **Keyboard:** `F2`/`Enter` to edit, `Escape` to cancel

---

### 9.3 List

**File:** `src/components/List/List.ts`
**Styles:** `src/components/List/List.styles.css`
**Types:** `src/components/List/List.types.ts`
**Tests:** `tests/components/List.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ListProps`
  - [ ] Prop: `items` (ListItem[]) — list items
  - [ ] Prop: `selectable` (boolean) — enable selection
  - [ ] Prop: `multiSelect` (boolean) — allow multiple selection
  - [ ] Prop: `selectedItems` (string[]) — selected item IDs
  - [ ] Prop: `bordered` (boolean) — show item borders
  - [ ] Prop: `dividers` (boolean) — show dividers between items
  - [ ] Prop: `onSelect` (function) — selection handler
  - [ ] Prop: `onItemClick` (function) — item click handler
- [ ] Define TypeScript interface `ListItem`
  - [ ] Prop: `id` (string) — unique identifier
  - [ ] Prop: `primary` (string) — main text
  - [ ] Prop: `secondary` (string) — secondary text
  - [ ] Prop: `icon` (string) — leading icon
  - [ ] Prop: `trailing` (string | Element) — trailing content
  - [ ] Prop: `disabled` (boolean) — item disabled
- [ ] Implement vertical list
- [ ] Implement selection (single and multi)
- [ ] Add CSS styles with class `.dos-list`
  - [ ] `.dos-list___item`
  - [ ] `.dos-list___item--selected`
  - [ ] `.dos-list___item--disabled`
  - [ ] `.dos-list___item-icon`
  - [ ] `.dos-list___item-content`
  - [ ] `.dos-list___item-primary`
  - [ ] `.dos-list___item-secondary`
  - [ ] `.dos-list___item-trailing`
  - [ ] `.dos-list___divider`
  - [ ] `.dos-list--bordered`
- [ ] Add keyboard navigation
  - [ ] `Arrow Up/Down` — navigate items
  - [ ] `Enter` / `Space` — select item
  - [ ] `Home` / `End` — first/last item
  - [ ] `Ctrl+A` — select all (multi-select)
- [ ] Add ARIA attributes
  - [ ] `role="listbox"` — for selectable lists
  - [ ] `role="list"` — for non-selectable
  - [ ] `role="option"` — for selectable items
  - [ ] `aria-selected`
  - [ ] `aria-multiselectable`
- [ ] Write unit tests
  - [ ] Test: renders items correctly
  - [ ] Test: single selection works
  - [ ] Test: multi selection works
  - [ ] Test: keyboard navigation works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic list
  - [ ] Selectable list
  - [ ] Multi-select list
  - [ ] With icons and secondary text
  - [ ] Code snippet displayed

> **Accessibility:** Listbox pattern for selectable. Selection state announced.
> **Keyboard:** `Arrows` to navigate, `Enter`/`Space` to select

---

### 9.4 TreeView

**File:** `src/components/TreeView/TreeView.ts`
**Styles:** `src/components/TreeView/TreeView.styles.css`
**Types:** `src/components/TreeView/TreeView.types.ts`
**Tests:** `tests/components/TreeView.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `TreeViewProps`
  - [ ] Prop: `nodes` (TreeNode[]) — tree data
  - [ ] Prop: `selectable` (boolean) — enable selection
  - [ ] Prop: `multiSelect` (boolean) — allow multiple selection
  - [ ] Prop: `selectedNodes` (string[]) — selected node IDs
  - [ ] Prop: `expandedNodes` (string[]) — expanded node IDs
  - [ ] Prop: `defaultExpanded` (boolean | string[]) — initial expanded
  - [ ] Prop: `onSelect` (function) — selection handler
  - [ ] Prop: `onExpand` (function) — expand/collapse handler
- [ ] Define TypeScript interface `TreeNode`
  - [ ] Prop: `id` (string) — unique identifier
  - [ ] Prop: `label` (string) — node label
  - [ ] Prop: `icon` (string) — node icon (folder, file)
  - [ ] Prop: `children` (TreeNode[]) — child nodes
  - [ ] Prop: `expanded` (boolean) — expanded state
  - [ ] Prop: `disabled` (boolean) — node disabled
- [ ] Implement DOS-style tree with ASCII characters
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
- [ ] Tree characters: `├──`, `└──`, `│   `, `    `
- [ ] Folder icons: `[+]` closed, `[-]` open
- [ ] File icons: `[ ]` or custom
- [ ] Implement expand/collapse on click or keyboard
- [ ] Add CSS styles with class `.dos-tree-view`
  - [ ] `.dos-tree-view___node`
  - [ ] `.dos-tree-view___node--expanded`
  - [ ] `.dos-tree-view___node--selected`
  - [ ] `.dos-tree-view___node--disabled`
  - [ ] `.dos-tree-view___icon`
  - [ ] `.dos-tree-view___label`
  - [ ] `.dos-tree-view___branch`
  - [ ] `.dos-tree-view___children`
- [ ] Add keyboard navigation
  - [ ] `Arrow Up/Down` — navigate nodes
  - [ ] `Arrow Right` — expand / move to child
  - [ ] `Arrow Left` — collapse / move to parent
  - [ ] `Enter` / `Space` — select node
  - [ ] `Home` / `End` — first/last visible node
  - [ ] `*` — expand all siblings
- [ ] Add ARIA attributes
  - [ ] `role="tree"`
  - [ ] `role="treeitem"`
  - [ ] `aria-expanded`
  - [ ] `aria-selected`
  - [ ] `aria-level`
- [ ] Write unit tests
  - [ ] Test: renders tree structure
  - [ ] Test: expands/collapses nodes
  - [ ] Test: selects nodes
  - [ ] Test: keyboard navigation works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] File browser tree
  - [ ] Selectable tree
  - [ ] Code snippet displayed

> **Accessibility:** Full tree ARIA pattern. Level and expanded state announced.
> **Keyboard:** `Arrows` for navigation, `Enter`/`Space` to select

---

### 9.5 Badge / Tag

**File:** `src/components/Badge/Badge.ts`
**Styles:** `src/components/Badge/Badge.styles.css`
**Types:** `src/components/Badge/Badge.types.ts`
**Tests:** `tests/components/Badge.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `BadgeProps`
  - [ ] Prop: `label` (string) — badge text
  - [ ] Prop: `variant` ('default' | 'primary' | 'success' | 'warning' | 'error' | 'info') — color variant
  - [ ] Prop: `size` ('small' | 'medium') — badge size
  - [ ] Prop: `removable` (boolean) — show remove button
  - [ ] Prop: `icon` (string) — leading icon
  - [ ] Prop: `onRemove` (function) — remove handler
- [ ] Implement DOS-style badge/tag
  - [ ] Display: `[NEW]`, `[v1.0]`, `[ERROR]`
  - [ ] Removable: `[NEW ×]`
- [ ] Implement color variants using theme colors
- [ ] Add CSS styles with class `.dos-badge`
  - [ ] `.dos-badge___label`
  - [ ] `.dos-badge___icon`
  - [ ] `.dos-badge___remove`
  - [ ] `.dos-badge--default`
  - [ ] `.dos-badge--primary`
  - [ ] `.dos-badge--success`
  - [ ] `.dos-badge--warning`
  - [ ] `.dos-badge--error`
  - [ ] `.dos-badge--info`
  - [ ] `.dos-badge--small`
  - [ ] `.dos-badge--removable`
- [ ] Add keyboard navigation
  - [ ] Remove button keyboard accessible
- [ ] Add ARIA attributes
  - [ ] `role="status"` — if dynamic
  - [ ] Remove button labeled
- [ ] Write unit tests
  - [ ] Test: renders label correctly
  - [ ] Test: applies variant styles
  - [ ] Test: remove button works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] All variants
  - [ ] Removable badges
  - [ ] Sizes
  - [ ] Code snippet displayed

> **Accessibility:** Remove button labeled. Status badges announced.
> **Keyboard:** Remove button focusable

---

### 9.6 Avatar

**File:** `src/components/Avatar/Avatar.ts`
**Styles:** `src/components/Avatar/Avatar.styles.css`
**Types:** `src/components/Avatar/Avatar.types.ts`
**Tests:** `tests/components/Avatar.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `AvatarProps`
  - [ ] Prop: `name` (string) — user name (for initials)
  - [ ] Prop: `image` (string) — image URL (optional)
  - [ ] Prop: `initials` (string) — custom initials override
  - [ ] Prop: `size` ('small' | 'medium' | 'large') — avatar size
  - [ ] Prop: `status` ('online' | 'offline' | 'busy' | 'away') — status indicator
  - [ ] Prop: `shape` ('square' | 'rounded') — avatar shape
- [ ] Implement DOS-style ASCII avatar
  ```
  ┌───┐
  │JD │
  └───┘
  ```
- [ ] Implement initials fallback (extract from name)
- [ ] Implement status indicator dot
- [ ] Add CSS styles with class `.dos-avatar`
  - [ ] `.dos-avatar___initials`
  - [ ] `.dos-avatar___image`
  - [ ] `.dos-avatar___status`
  - [ ] `.dos-avatar--small`
  - [ ] `.dos-avatar--medium`
  - [ ] `.dos-avatar--large`
  - [ ] `.dos-avatar--square`
  - [ ] `.dos-avatar--rounded`
  - [ ] `.dos-avatar___status--online`
  - [ ] `.dos-avatar___status--offline`
  - [ ] `.dos-avatar___status--busy`
  - [ ] `.dos-avatar___status--away`
- [ ] Add ARIA attributes
  - [ ] `role="img"`
  - [ ] `aria-label` — user name
- [ ] Write unit tests
  - [ ] Test: generates initials from name
  - [ ] Test: displays image when provided
  - [ ] Test: shows status indicator
  - [ ] Test: applies size and shape
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] With initials
  - [ ] Different sizes
  - [ ] Status indicators
  - [ ] Code snippet displayed

> **Accessibility:** Labeled as image with user name.
> **Keyboard:** Not interactive

---

### 9.7 Card

**File:** `src/components/Card/Card.ts`
**Styles:** `src/components/Card/Card.styles.css`
**Types:** `src/components/Card/Card.types.ts`
**Tests:** `tests/components/Card.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `CardProps`
  - [ ] Prop: `header` (string | Element) — card header
  - [ ] Prop: `content` (string | Element) — card body
  - [ ] Prop: `footer` (Element) — card footer
  - [ ] Prop: `bordered` (boolean) — show border
  - [ ] Prop: `elevated` (boolean) — shadow effect
  - [ ] Prop: `interactive` (boolean) — clickable card
  - [ ] Prop: `selected` (boolean) — selected state
  - [ ] Prop: `onClick` (function) — click handler
- [ ] Implement DOS-style card container
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
- [ ] Implement sections: header, body, footer
- [ ] Implement elevation (shadow using ░▒▓)
- [ ] Add CSS styles with class `.dos-card`
  - [ ] `.dos-card___header`
  - [ ] `.dos-card___content`
  - [ ] `.dos-card___footer`
  - [ ] `.dos-card--bordered`
  - [ ] `.dos-card--elevated`
  - [ ] `.dos-card--interactive`
  - [ ] `.dos-card--selected`
- [ ] Add keyboard navigation
  - [ ] `Enter` / `Space` — activate (if interactive)
  - [ ] `Tab` — navigate to card actions
- [ ] Add ARIA attributes
  - [ ] `role="article"` — if standalone content
  - [ ] `role="button"` — if interactive
  - [ ] `aria-selected` — if selectable
- [ ] Write unit tests
  - [ ] Test: renders sections correctly
  - [ ] Test: applies border/elevation
  - [ ] Test: interactive mode works
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Basic card
  - [ ] With all sections
  - [ ] Interactive card
  - [ ] Elevated card
  - [ ] Code snippet displayed

> **Accessibility:** Proper roles based on usage. Interactive cards keyboard accessible.
> **Keyboard:** `Enter`/`Space` for interactive cards

---

### 9.8 Timeline

**File:** `src/components/Timeline/Timeline.ts`
**Styles:** `src/components/Timeline/Timeline.styles.css`
**Types:** `src/components/Timeline/Timeline.types.ts`
**Tests:** `tests/components/Timeline.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `TimelineProps`
  - [ ] Prop: `events` (TimelineEvent[]) — timeline events
  - [ ] Prop: `orientation` ('vertical' | 'horizontal') — layout
  - [ ] Prop: `alternating` (boolean) — alternate left/right (vertical)
- [ ] Define TypeScript interface `TimelineEvent`
  - [ ] Prop: `id` (string) — unique identifier
  - [ ] Prop: `title` (string) — event title
  - [ ] Prop: `description` (string) — event description
  - [ ] Prop: `timestamp` (string | Date) — event time
  - [ ] Prop: `icon` (string) — event icon
  - [ ] Prop: `status` ('completed' | 'current' | 'upcoming') — event status
- [ ] Implement DOS-style timeline
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
- [ ] Implement connecting lines
- [ ] Implement status indicators: `●` complete, `○` current, `◌` upcoming
- [ ] Add CSS styles with class `.dos-timeline`
  - [ ] `.dos-timeline___event`
  - [ ] `.dos-timeline___event--completed`
  - [ ] `.dos-timeline___event--current`
  - [ ] `.dos-timeline___event--upcoming`
  - [ ] `.dos-timeline___marker`
  - [ ] `.dos-timeline___connector`
  - [ ] `.dos-timeline___content`
  - [ ] `.dos-timeline___timestamp`
  - [ ] `.dos-timeline___title`
  - [ ] `.dos-timeline___description`
  - [ ] `.dos-timeline--vertical`
  - [ ] `.dos-timeline--horizontal`
  - [ ] `.dos-timeline--alternating`
- [ ] Add ARIA attributes
  - [ ] `role="list"`
  - [ ] `role="listitem"` — on events
  - [ ] Time elements with proper datetime
- [ ] Write unit tests
  - [ ] Test: renders events correctly
  - [ ] Test: displays timestamps
  - [ ] Test: applies status styles
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] Vertical timeline
  - [ ] Alternating layout
  - [ ] Different statuses
  - [ ] Code snippet displayed

> **Accessibility:** List semantics. Timestamps properly formatted.
> **Keyboard:** Not interactive (unless events are links)

---

### 9.9 EmptyState

**File:** `src/components/EmptyState/EmptyState.ts`
**Styles:** `src/components/EmptyState/EmptyState.styles.css`
**Types:** `src/components/EmptyState/EmptyState.types.ts`
**Tests:** `tests/components/EmptyState.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `EmptyStateProps`
  - [ ] Prop: `title` (string) — main message
  - [ ] Prop: `description` (string) — secondary message
  - [ ] Prop: `icon` (string) — illustration/icon
  - [ ] Prop: `action` (Element) — action button
  - [ ] Prop: `size` ('small' | 'medium' | 'large') — component size
- [ ] Implement empty state placeholder
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
- [ ] Implement DOS-style ASCII art illustrations
  - [ ] Empty folder
  - [ ] No search results
  - [ ] Error state
  - [ ] No data
- [ ] Add CSS styles with class `.dos-empty-state`
  - [ ] `.dos-empty-state___icon`
  - [ ] `.dos-empty-state___title`
  - [ ] `.dos-empty-state___description`
  - [ ] `.dos-empty-state___action`
  - [ ] `.dos-empty-state--small`
  - [ ] `.dos-empty-state--medium`
  - [ ] `.dos-empty-state--large`
- [ ] Add ARIA attributes
  - [ ] `role="status"` — if dynamically shown
  - [ ] Action button accessible
- [ ] Write unit tests
  - [ ] Test: renders title and description
  - [ ] Test: displays icon
  - [ ] Test: renders action button
  - [ ] Test: has no accessibility violations
- [ ] Add to Kitchen Sink demo
  - [ ] No results example
  - [ ] Error state example
  - [ ] With action button
  - [ ] Code snippet displayed

> **Accessibility:** Announced when appearing dynamically.
> **Keyboard:** Action button focusable

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 9

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
