/**
 * RadioButton and RadioGroup Components
 *
 * DOS-style radio buttons with ( ) and (•) states.
 * Provides authentic DOS aesthetic with full keyboard support.
 */

import type {
  RadioButtonProps,
  RadioButtonElement,
  RadioGroupProps,
  RadioGroupElement,
} from './RadioButton.types';
import './RadioButton.css';

// Unique ID counter for radio-label association
let radioIdCounter = 0;

/**
 * Generates a unique ID for radio elements
 */
function generateRadioId(): string {
  return `dos-radio-${++radioIdCounter}`;
}

/**
 * Creates a DOS-style radio button element.
 *
 * @param props - RadioButton configuration options
 * @returns The radio button wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createRadioButton } from 'dosage';
 *
 * const radio = createRadioButton({
 *   label: 'Option A',
 *   name: 'options',
 *   value: 'a',
 *   onChange: (value) => console.log('Selected:', value)
 * });
 *
 * document.body.appendChild(radio);
 * ```
 */
export function createRadioButton(props: RadioButtonProps): RadioButtonElement {
  const {
    checked = false,
    label,
    name,
    value,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    className,
    id,
  } = props;

  // Generate unique ID
  const radioId = id ?? generateRadioId();

  // Track internal state
  let isCheckedState = checked;

  // Create wrapper element
  const wrapper = document.createElement('div') as RadioButtonElement;
  wrapper.className = buildRadioClasses(isCheckedState, disabled, className);

  // Create hidden native input for accessibility and form submission
  const input = document.createElement('input');
  input.type = 'radio';
  input.id = radioId;
  input.className = 'dos-radio__input';
  input.name = name;
  input.value = value;
  input.checked = isCheckedState;

  if (disabled) {
    input.disabled = true;
  }

  // Create visual radio circle
  const circle = document.createElement('span');
  circle.className = 'dos-radio__circle';
  circle.setAttribute('aria-hidden', 'true');

  // Create dot element
  const dot = document.createElement('span');
  dot.className = 'dos-radio__dot';
  circle.appendChild(dot);

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = document.createElement('label');
    labelElement.htmlFor = radioId;
    labelElement.className = 'dos-radio__label';
    labelElement.textContent = label;
  }

  // Event handlers
  input.addEventListener('change', (event) => {
    isCheckedState = input.checked;
    updateRadioVisualState(wrapper, isCheckedState);
    onChange?.(value, event);
  });

  input.addEventListener('focus', (event) => {
    wrapper.classList.add('dos-radio--focused');
    onFocus?.(event as FocusEvent);
  });

  input.addEventListener('blur', (event) => {
    wrapper.classList.remove('dos-radio--focused');
    onBlur?.(event as FocusEvent);
  });

  // Allow clicking on the wrapper to select
  wrapper.addEventListener('click', (event) => {
    if (event.target === input || disabled) return;
    input.click();
  });

  // Assemble elements
  wrapper.appendChild(input);
  wrapper.appendChild(circle);
  if (labelElement) {
    wrapper.appendChild(labelElement);
  }

  // Attach methods to the wrapper element
  wrapper.isChecked = (): boolean => isCheckedState;

  wrapper.setChecked = (newChecked: boolean): void => {
    isCheckedState = newChecked;
    input.checked = newChecked;
    updateRadioVisualState(wrapper, isCheckedState);
  };

  wrapper.getValue = (): string => value;

  wrapper.setDisabled = (newDisabled: boolean): void => {
    input.disabled = newDisabled;
    wrapper.classList.toggle('dos-radio--disabled', newDisabled);
  };

  wrapper.focus = (): void => {
    input.focus();
  };

  wrapper.getInput = (): HTMLInputElement => input;

  return wrapper;
}

/**
 * Builds the radio button class string
 */
function buildRadioClasses(checked: boolean, disabled: boolean, className?: string): string {
  const classes = ['dos-radio'];

  if (checked) {
    classes.push('dos-radio--checked');
  }

  if (disabled) {
    classes.push('dos-radio--disabled');
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Updates the visual state of the radio button
 */
function updateRadioVisualState(wrapper: HTMLElement, checked: boolean): void {
  wrapper.classList.toggle('dos-radio--checked', checked);
}

/**
 * Creates a DOS-style radio group element.
 *
 * @param props - RadioGroup configuration options
 * @returns The radio group fieldset element with methods
 *
 * @example
 * ```typescript
 * import { createRadioGroup } from 'dosage';
 *
 * const group = createRadioGroup({
 *   name: 'color',
 *   label: 'Select Color',
 *   options: [
 *     { value: 'red', label: 'Red' },
 *     { value: 'green', label: 'Green' },
 *     { value: 'blue', label: 'Blue' }
 *   ],
 *   onChange: (value) => console.log('Selected:', value)
 * });
 *
 * document.body.appendChild(group);
 * ```
 */
export function createRadioGroup(props: RadioGroupProps): RadioGroupElement {
  const {
    name,
    value,
    options,
    orientation = 'vertical',
    disabled = false,
    label,
    required = false,
    error,
    onChange,
    className,
    id,
  } = props;

  // Generate unique IDs
  const groupId = id ?? `dos-radio-group-${++radioIdCounter}`;
  const errorId = `${groupId}-error`;

  // Track current value
  let currentValue = value;

  // Create fieldset element
  const fieldset = document.createElement('fieldset') as RadioGroupElement;
  fieldset.className = buildGroupClasses(orientation, disabled, error, className);
  fieldset.setAttribute('role', 'radiogroup');

  if (id) {
    fieldset.id = id;
  }

  // Create legend if label provided
  if (label) {
    const legend = document.createElement('legend');
    legend.className = 'dos-radio-group__legend';

    const legendText = document.createElement('span');
    legendText.textContent = label;
    legend.appendChild(legendText);

    if (required) {
      const requiredIndicator = document.createElement('span');
      requiredIndicator.className = 'dos-radio-group__required';
      requiredIndicator.textContent = '*';
      requiredIndicator.setAttribute('aria-hidden', 'true');
      legend.appendChild(requiredIndicator);
    }

    fieldset.appendChild(legend);
  }

  // Set aria-required
  if (required) {
    fieldset.setAttribute('aria-required', 'true');
  }

  // Set aria-describedby for error
  if (error && typeof error === 'string') {
    fieldset.setAttribute('aria-describedby', errorId);
  }

  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dos-radio-group__options';

  // Store radio button references
  const radioButtons: RadioButtonElement[] = [];

  // Create radio buttons for each option
  options.forEach((option) => {
    const radioButton = createRadioButton({
      name,
      value: option.value,
      label: option.label,
      checked: currentValue === option.value,
      disabled: disabled || (option.disabled ?? false),
      onChange: (selectedValue, event) => {
        currentValue = selectedValue;

        // Update all radio buttons' visual state
        radioButtons.forEach((rb) => {
          const isSelected = rb.getValue() === selectedValue;
          if (rb.isChecked() !== isSelected) {
            rb.setChecked(isSelected);
          }
        });

        onChange?.(selectedValue, event);
      },
    });

    radioButtons.push(radioButton);
    optionsContainer.appendChild(radioButton);
  });

  fieldset.appendChild(optionsContainer);

  // Create error message if provided
  if (typeof error === 'string' && error) {
    const errorElement = createGroupErrorElement(error, errorId);
    fieldset.appendChild(errorElement);
  }

  // Add keyboard navigation for arrow keys
  fieldset.addEventListener('keydown', (event) => {
    if (disabled) return;

    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (event.key === prevKey || event.key === nextKey) {
      event.preventDefault();

      const enabledRadios = radioButtons.filter(
        (rb) => !rb.getInput().disabled
      );
      if (enabledRadios.length === 0) return;

      const currentIndex = enabledRadios.findIndex(
        (rb) => rb.getInput() === document.activeElement
      );

      let newIndex: number;
      if (event.key === prevKey) {
        newIndex = currentIndex <= 0 ? enabledRadios.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex >= enabledRadios.length - 1 ? 0 : currentIndex + 1;
      }

      const targetRadio = enabledRadios[newIndex];
      if (targetRadio) {
        targetRadio.getInput().focus();
        targetRadio.getInput().click();
      }
    }
  });

  // Attach methods to the fieldset element
  fieldset.getValue = (): string | undefined => currentValue;

  fieldset.setValue = (newValue: string): void => {
    currentValue = newValue;
    radioButtons.forEach((rb) => {
      rb.setChecked(rb.getValue() === newValue);
    });
  };

  fieldset.setError = (newError: string | boolean | undefined): void => {
    // Remove existing error element
    const existingError = fieldset.querySelector('.dos-radio-group__error');
    if (existingError) {
      existingError.remove();
    }

    // Update fieldset classes
    fieldset.classList.toggle('dos-radio-group--error', !!newError);

    // Update ARIA attributes
    if (newError && typeof newError === 'string') {
      const newErrorElement = createGroupErrorElement(newError, errorId);
      fieldset.appendChild(newErrorElement);
      fieldset.setAttribute('aria-describedby', errorId);
    } else {
      fieldset.removeAttribute('aria-describedby');
    }
  };

  fieldset.setDisabled = (newDisabled: boolean): void => {
    fieldset.classList.toggle('dos-radio-group--disabled', newDisabled);
    radioButtons.forEach((rb) => rb.setDisabled(newDisabled));
  };

  fieldset.focus = (): void => {
    // Focus the currently selected radio, or the first one
    const selectedRadio = radioButtons.find((rb) => rb.isChecked());
    const targetRadio = selectedRadio ?? radioButtons[0];
    if (targetRadio) {
      targetRadio.focus();
    }
  };

  fieldset.getRadioButtons = (): RadioButtonElement[] => [...radioButtons];

  return fieldset;
}

/**
 * Builds the radio group class string
 */
function buildGroupClasses(
  orientation: 'horizontal' | 'vertical',
  disabled: boolean,
  error: string | boolean | undefined,
  className?: string
): string {
  const classes = ['dos-radio-group', `dos-radio-group--${orientation}`];

  if (disabled) {
    classes.push('dos-radio-group--disabled');
  }

  if (error) {
    classes.push('dos-radio-group--error');
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Creates the group error message element
 */
function createGroupErrorElement(message: string, errorId: string): HTMLDivElement {
  const errorElement = document.createElement('div');
  errorElement.id = errorId;
  errorElement.className = 'dos-radio-group__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');

  // Add error icon
  const iconSpan = document.createElement('span');
  iconSpan.className = 'dos-radio-group__error-icon';
  iconSpan.textContent = '[!]';
  iconSpan.setAttribute('aria-hidden', 'true');
  errorElement.appendChild(iconSpan);

  // Add error message
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  errorElement.appendChild(messageSpan);

  return errorElement;
}

/**
 * Sets the checked state of a RadioButton element.
 *
 * @param element - The RadioButton element
 * @param checked - The new checked state
 */
export function setRadioButtonChecked(element: RadioButtonElement, checked: boolean): void {
  element.setChecked(checked);
}

/**
 * Gets the checked state of a RadioButton element.
 *
 * @param element - The RadioButton element
 * @returns The current checked state
 */
export function getRadioButtonChecked(element: RadioButtonElement): boolean {
  return element.isChecked();
}

/**
 * Sets the value of a RadioGroup element.
 *
 * @param element - The RadioGroup element
 * @param value - The new selected value
 */
export function setRadioGroupValue(element: RadioGroupElement, value: string): void {
  element.setValue(value);
}

/**
 * Gets the value of a RadioGroup element.
 *
 * @param element - The RadioGroup element
 * @returns The currently selected value
 */
export function getRadioGroupValue(element: RadioGroupElement): string | undefined {
  return element.getValue();
}

/**
 * Sets the error state of a RadioGroup element.
 *
 * @param element - The RadioGroup element
 * @param error - Error message or boolean
 */
export function setRadioGroupError(
  element: RadioGroupElement,
  error: string | boolean | undefined
): void {
  element.setError(error);
}

/**
 * Sets the disabled state of a RadioGroup element.
 *
 * @param element - The RadioGroup element
 * @param disabled - Whether to disable
 */
export function setRadioGroupDisabled(element: RadioGroupElement, disabled: boolean): void {
  element.setDisabled(disabled);
}
