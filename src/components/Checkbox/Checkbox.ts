/**
 * Checkbox Component
 *
 * A DOS-style checkbox with [ ], [X], and [-] states.
 * Provides authentic DOS aesthetic with full keyboard support.
 */

import type { CheckboxProps, CheckboxElement, CheckmarkChar } from './Checkbox.types';
import './Checkbox.css';

// Unique ID counter for checkbox-label association
let checkboxIdCounter = 0;

/**
 * Generates a unique ID for checkbox elements
 */
function generateCheckboxId(): string {
  return `dos-checkbox-${++checkboxIdCounter}`;
}

/**
 * Gets the appropriate check mark character
 */
function getCheckMark(char: CheckmarkChar): string {
  return char;
}

/**
 * Creates a DOS-style checkbox element.
 *
 * @param props - Checkbox configuration options
 * @returns The checkbox wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createCheckbox } from 'dosage';
 *
 * const checkbox = createCheckbox({
 *   label: 'I agree to the terms',
 *   checked: false,
 *   onChange: (checked) => console.log('Checked:', checked)
 * });
 *
 * document.body.appendChild(checkbox);
 * ```
 */
export function createCheckbox(props: CheckboxProps): CheckboxElement {
  const {
    checked = false,
    indeterminate = false,
    label,
    labelPosition = 'right',
    name,
    value,
    disabled = false,
    required = false,
    checkChar = 'X',
    onChange,
    onFocus,
    onBlur,
    className,
    id,
  } = props;

  // Generate unique ID
  const checkboxId = id ?? generateCheckboxId();

  // Track internal state
  let isCheckedState = checked;
  let isIndeterminateState = indeterminate;

  // Create wrapper element
  const wrapper = document.createElement('div') as CheckboxElement;
  wrapper.className = buildWrapperClasses(
    isCheckedState,
    isIndeterminateState,
    disabled,
    labelPosition,
    className
  );

  // Create hidden native input for accessibility and form submission
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = checkboxId;
  input.className = 'dos-checkbox__input';
  input.checked = isCheckedState;
  input.indeterminate = isIndeterminateState;

  if (name) {
    input.name = name;
  }

  if (value !== undefined) {
    input.value = value;
  }

  if (disabled) {
    input.disabled = true;
  }

  if (required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }

  // Set ARIA attributes
  if (isIndeterminateState) {
    input.setAttribute('aria-checked', 'mixed');
  }

  // Create visual checkbox box
  const box = document.createElement('span');
  box.className = 'dos-checkbox__box';
  box.setAttribute('aria-hidden', 'true');

  // Create check mark element
  const mark = document.createElement('span');
  mark.className = 'dos-checkbox__mark';
  mark.textContent = isIndeterminateState ? '-' : getCheckMark(checkChar);
  box.appendChild(mark);

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = document.createElement('label');
    labelElement.htmlFor = checkboxId;
    labelElement.className = 'dos-checkbox__label';
    labelElement.textContent = label;

    if (required) {
      const requiredIndicator = document.createElement('span');
      requiredIndicator.className = 'dos-checkbox__required';
      requiredIndicator.textContent = '*';
      requiredIndicator.setAttribute('aria-hidden', 'true');
      labelElement.appendChild(requiredIndicator);
    }
  }

  // Event handlers
  input.addEventListener('change', (event) => {
    isCheckedState = input.checked;
    isIndeterminateState = false;
    input.indeterminate = false;
    input.removeAttribute('aria-checked');

    updateVisualState(wrapper, mark, isCheckedState, isIndeterminateState, checkChar);
    onChange?.(isCheckedState, event);
  });

  input.addEventListener('focus', (event) => {
    wrapper.classList.add('dos-checkbox--focused');
    onFocus?.(event as FocusEvent);
  });

  input.addEventListener('blur', (event) => {
    wrapper.classList.remove('dos-checkbox--focused');
    onBlur?.(event as FocusEvent);
  });

  // Allow clicking on the wrapper to toggle
  wrapper.addEventListener('click', (event) => {
    if (event.target === input || disabled) return;
    input.click();
  });

  // Keyboard support via Space key (handled natively by input)
  wrapper.addEventListener('keydown', (event) => {
    if (event.key === ' ' && document.activeElement !== input && !disabled) {
      event.preventDefault();
      input.click();
    }
  });

  // Assemble elements
  wrapper.appendChild(input);
  wrapper.appendChild(box);
  if (labelElement) {
    wrapper.appendChild(labelElement);
  }

  // Attach methods to the wrapper element
  wrapper.isChecked = (): boolean => isCheckedState;

  wrapper.setChecked = (newChecked: boolean): void => {
    isCheckedState = newChecked;
    isIndeterminateState = false;
    input.checked = newChecked;
    input.indeterminate = false;
    input.removeAttribute('aria-checked');
    updateVisualState(wrapper, mark, isCheckedState, isIndeterminateState, checkChar);
  };

  wrapper.toggle = (): void => {
    wrapper.setChecked(!isCheckedState);
    onChange?.(isCheckedState, new Event('change'));
  };

  wrapper.isIndeterminate = (): boolean => isIndeterminateState;

  wrapper.setIndeterminate = (newIndeterminate: boolean): void => {
    isIndeterminateState = newIndeterminate;
    input.indeterminate = newIndeterminate;

    if (newIndeterminate) {
      input.setAttribute('aria-checked', 'mixed');
    } else {
      input.removeAttribute('aria-checked');
    }

    updateVisualState(wrapper, mark, isCheckedState, isIndeterminateState, checkChar);
  };

  wrapper.setDisabled = (newDisabled: boolean): void => {
    input.disabled = newDisabled;
    wrapper.classList.toggle('dos-checkbox--disabled', newDisabled);
  };

  wrapper.focus = (): void => {
    input.focus();
  };

  wrapper.getInput = (): HTMLInputElement => input;

  return wrapper;
}

/**
 * Builds the wrapper class string
 */
function buildWrapperClasses(
  checked: boolean,
  indeterminate: boolean,
  disabled: boolean,
  labelPosition: 'left' | 'right',
  className?: string
): string {
  const classes = ['dos-checkbox'];

  if (checked) {
    classes.push('dos-checkbox--checked');
  }

  if (indeterminate) {
    classes.push('dos-checkbox--indeterminate');
  }

  if (disabled) {
    classes.push('dos-checkbox--disabled');
  }

  classes.push(`dos-checkbox--label-${labelPosition}`);

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Updates the visual state of the checkbox
 */
function updateVisualState(
  wrapper: HTMLElement,
  mark: HTMLElement,
  checked: boolean,
  indeterminate: boolean,
  checkChar: CheckmarkChar
): void {
  wrapper.classList.toggle('dos-checkbox--checked', checked && !indeterminate);
  wrapper.classList.toggle('dos-checkbox--indeterminate', indeterminate);

  if (indeterminate) {
    mark.textContent = '-';
  } else {
    mark.textContent = getCheckMark(checkChar);
  }
}

/**
 * Sets the checked state of a Checkbox element.
 *
 * @param element - The Checkbox element
 * @param checked - The new checked state
 */
export function setCheckboxChecked(element: CheckboxElement, checked: boolean): void {
  element.setChecked(checked);
}

/**
 * Gets the checked state of a Checkbox element.
 *
 * @param element - The Checkbox element
 * @returns The current checked state
 */
export function getCheckboxChecked(element: CheckboxElement): boolean {
  return element.isChecked();
}

/**
 * Sets the indeterminate state of a Checkbox element.
 *
 * @param element - The Checkbox element
 * @param indeterminate - The new indeterminate state
 */
export function setCheckboxIndeterminate(element: CheckboxElement, indeterminate: boolean): void {
  element.setIndeterminate(indeterminate);
}

/**
 * Sets the disabled state of a Checkbox element.
 *
 * @param element - The Checkbox element
 * @param disabled - Whether to disable
 */
export function setCheckboxDisabled(element: CheckboxElement, disabled: boolean): void {
  element.setDisabled(disabled);
}

/**
 * Toggles the checked state of a Checkbox element.
 *
 * @param element - The Checkbox element
 */
export function toggleCheckbox(element: CheckboxElement): void {
  element.toggle();
}
