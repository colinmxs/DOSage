import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRadioButton, createRadioGroup } from '../../src/components/RadioButton';
import type { RadioOption } from '../../src/components/RadioButton';

describe('RadioButton', () => {
  describe('createRadioButton', () => {
    describe('rendering', () => {
      it('creates a radio button element', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        expect(radio).toBeInstanceOf(HTMLElement);
        expect(radio.classList.contains('dos-radio')).toBe(true);
      });

      it('creates a native radio input', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        const input = radio.querySelector('input[type="radio"]');
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toHaveAttribute('name', 'test');
        expect(input).toHaveAttribute('value', 'option1');
      });

      it('renders with a label', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          label: 'Option 1',
        });

        const label = radio.querySelector('label');
        expect(label).toBeTruthy();
        expect(label?.textContent).toBe('Option 1');
      });

      it('associates label with input via htmlFor', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          label: 'Option 1',
        });

        const input = radio.querySelector('input') as HTMLInputElement;
        const label = radio.querySelector('label') as HTMLLabelElement;
        expect(label.htmlFor).toBe(input.id);
      });

      it('renders without a label when not provided', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        const label = radio.querySelector('label');
        expect(label).toBeNull();
      });

      it('creates visual circle element', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        const circle = radio.querySelector('.dos-radio__circle');
        expect(circle).toBeTruthy();
        expect(circle).toHaveAttribute('aria-hidden', 'true');
      });

      it('uses provided id', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          id: 'custom-id',
        });

        const input = radio.querySelector('input');
        expect(input?.id).toBe('custom-id');
      });

      it('generates unique id when not provided', () => {
        const radio1 = createRadioButton({ name: 'test', value: 'option1' });
        const radio2 = createRadioButton({ name: 'test', value: 'option2' });

        const input1 = radio1.querySelector('input') as HTMLInputElement;
        const input2 = radio2.querySelector('input') as HTMLInputElement;

        expect(input1.id).toBeTruthy();
        expect(input2.id).toBeTruthy();
        expect(input1.id).not.toBe(input2.id);
      });

      it('applies custom className', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          className: 'custom-class',
        });

        expect(radio.classList.contains('custom-class')).toBe(true);
      });
    });

    describe('checked state', () => {
      it('renders unchecked by default', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(false);
        expect(radio.classList.contains('dos-radio--checked')).toBe(false);
      });

      it('renders checked when checked prop is true', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          checked: true,
        });

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(true);
        expect(radio.classList.contains('dos-radio--checked')).toBe(true);
      });

      it('isChecked returns current state', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          checked: true,
        });

        expect(radio.isChecked()).toBe(true);
      });

      it('setChecked updates state', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        radio.setChecked(true);

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(true);
        expect(radio.isChecked()).toBe(true);
        expect(radio.classList.contains('dos-radio--checked')).toBe(true);
      });

      it('getValue returns the value', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        expect(radio.getValue()).toBe('option1');
      });
    });

    describe('disabled state', () => {
      it('renders disabled when disabled prop is true', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          disabled: true,
        });

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(radio.classList.contains('dos-radio--disabled')).toBe(true);
      });

      it('setDisabled updates disabled state', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        radio.setDisabled(true);

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(radio.classList.contains('dos-radio--disabled')).toBe(true);

        radio.setDisabled(false);
        expect(input.disabled).toBe(false);
        expect(radio.classList.contains('dos-radio--disabled')).toBe(false);
      });
    });

    describe('interaction', () => {
      it('calls onChange when clicked', () => {
        const onChange = vi.fn();
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          onChange,
        });
        document.body.appendChild(radio);

        const input = radio.querySelector('input') as HTMLInputElement;
        input.click();

        expect(onChange).toHaveBeenCalledWith('option1', expect.any(Event));

        document.body.removeChild(radio);
      });

      it('does not call onChange when disabled', () => {
        const onChange = vi.fn();
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          disabled: true,
          onChange,
        });
        document.body.appendChild(radio);

        const input = radio.querySelector('input') as HTMLInputElement;
        input.click();

        expect(onChange).not.toHaveBeenCalled();

        document.body.removeChild(radio);
      });

      it('clicking wrapper selects the radio', () => {
        const onChange = vi.fn();
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          onChange,
        });
        document.body.appendChild(radio);

        radio.click();

        expect(onChange).toHaveBeenCalled();

        document.body.removeChild(radio);
      });

      it('getInput returns the native input', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });

        const input = radio.getInput();
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input.type).toBe('radio');
      });

      it('focus method focuses the input', () => {
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
        });
        document.body.appendChild(radio);

        radio.focus();

        const input = radio.querySelector('input') as HTMLInputElement;
        expect(document.activeElement).toBe(input);

        document.body.removeChild(radio);
      });

      it('calls onFocus when input receives focus', () => {
        const onFocus = vi.fn();
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          onFocus,
        });
        document.body.appendChild(radio);

        const input = radio.querySelector('input') as HTMLInputElement;
        input.focus();

        expect(onFocus).toHaveBeenCalled();
        expect(radio.classList.contains('dos-radio--focused')).toBe(true);

        document.body.removeChild(radio);
      });

      it('calls onBlur when input loses focus', () => {
        const onBlur = vi.fn();
        const radio = createRadioButton({
          name: 'test',
          value: 'option1',
          onBlur,
        });
        document.body.appendChild(radio);

        const input = radio.querySelector('input') as HTMLInputElement;
        input.focus();
        input.blur();

        expect(onBlur).toHaveBeenCalled();
        expect(radio.classList.contains('dos-radio--focused')).toBe(false);

        document.body.removeChild(radio);
      });
    });
  });

  describe('createRadioGroup', () => {
    const defaultOptions: RadioOption[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    describe('rendering', () => {
      it('creates a fieldset element', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        expect(group.tagName).toBe('FIELDSET');
        expect(group.classList.contains('dos-radio-group')).toBe(true);
      });

      it('has role="radiogroup"', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        expect(group.getAttribute('role')).toBe('radiogroup');
      });

      it('renders a legend when label is provided', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          label: 'Select an option',
        });

        const legend = group.querySelector('legend');
        expect(legend).toBeTruthy();
        expect(legend?.textContent).toContain('Select an option');
      });

      it('renders required indicator when required', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          label: 'Required Field',
          required: true,
        });

        const required = group.querySelector('.dos-radio-group__required');
        expect(required).toBeTruthy();
        expect(required?.textContent).toBe('*');
        expect(group.getAttribute('aria-required')).toBe('true');
      });

      it('renders all options as radio buttons', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        const radios = group.querySelectorAll('.dos-radio');
        expect(radios.length).toBe(3);
      });

      it('renders in vertical orientation by default', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        expect(group.classList.contains('dos-radio-group--vertical')).toBe(true);
      });

      it('renders in horizontal orientation when specified', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          orientation: 'horizontal',
        });

        expect(group.classList.contains('dos-radio-group--horizontal')).toBe(true);
      });

      it('uses provided id', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          id: 'custom-group-id',
        });

        expect(group.id).toBe('custom-group-id');
      });

      it('applies custom className', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          className: 'custom-class',
        });

        expect(group.classList.contains('custom-class')).toBe(true);
      });
    });

    describe('value handling', () => {
      it('no value is selected by default', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        expect(group.getValue()).toBeUndefined();
      });

      it('selects initial value when provided', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          value: 'option2',
        });

        expect(group.getValue()).toBe('option2');
      });

      it('setValue updates the selected value', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        group.setValue('option3');
        expect(group.getValue()).toBe('option3');

        const radioButtons = group.getRadioButtons();
        expect(radioButtons[2].isChecked()).toBe(true);
        expect(radioButtons[0].isChecked()).toBe(false);
        expect(radioButtons[1].isChecked()).toBe(false);
      });

      it('getRadioButtons returns all radio button elements', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        const radios = group.getRadioButtons();
        expect(radios.length).toBe(3);
        expect(radios[0].getValue()).toBe('option1');
        expect(radios[1].getValue()).toBe('option2');
        expect(radios[2].getValue()).toBe('option3');
      });
    });

    describe('disabled state', () => {
      it('disables all radios when disabled is true', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          disabled: true,
        });

        expect(group.classList.contains('dos-radio-group--disabled')).toBe(true);

        const radios = group.getRadioButtons();
        radios.forEach((radio) => {
          expect(radio.getInput().disabled).toBe(true);
        });
      });

      it('setDisabled updates all radios', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        group.setDisabled(true);

        expect(group.classList.contains('dos-radio-group--disabled')).toBe(true);

        const radios = group.getRadioButtons();
        radios.forEach((radio) => {
          expect(radio.getInput().disabled).toBe(true);
        });

        group.setDisabled(false);

        expect(group.classList.contains('dos-radio-group--disabled')).toBe(false);
        radios.forEach((radio) => {
          expect(radio.getInput().disabled).toBe(false);
        });
      });

      it('respects individual option disabled state', () => {
        const group = createRadioGroup({
          name: 'test',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' },
          ],
        });

        const radios = group.getRadioButtons();
        expect(radios[0].getInput().disabled).toBe(false);
        expect(radios[1].getInput().disabled).toBe(true);
        expect(radios[2].getInput().disabled).toBe(false);
      });
    });

    describe('error state', () => {
      it('renders error message when error is provided', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          error: 'Please select an option',
        });

        expect(group.classList.contains('dos-radio-group--error')).toBe(true);

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement).toBeTruthy();
        expect(errorElement?.textContent).toContain('Please select an option');
        expect(errorElement?.getAttribute('role')).toBe('alert');
      });

      it('setError adds error message', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        group.setError('This field is required');

        expect(group.classList.contains('dos-radio-group--error')).toBe(true);

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement?.textContent).toContain('This field is required');
      });

      it('setError removes error when undefined', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          error: 'Initial error',
        });

        group.setError(undefined);

        expect(group.classList.contains('dos-radio-group--error')).toBe(false);

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement).toBeNull();
      });

      it('setError with boolean true shows error class without message', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });

        group.setError(true);

        expect(group.classList.contains('dos-radio-group--error')).toBe(true);

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement).toBeNull();
      });
    });

    describe('interaction', () => {
      it('calls onChange when option is selected', () => {
        const onChange = vi.fn();
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          onChange,
        });
        document.body.appendChild(group);

        const radios = group.getRadioButtons();
        radios[1].getInput().click();

        expect(onChange).toHaveBeenCalledWith('option2', expect.any(Event));

        document.body.removeChild(group);
      });

      it('focus method focuses the selected radio', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          value: 'option2',
        });
        document.body.appendChild(group);

        group.focus();

        const radios = group.getRadioButtons();
        expect(document.activeElement).toBe(radios[1].getInput());

        document.body.removeChild(group);
      });

      it('focus method focuses first radio when none selected', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
        });
        document.body.appendChild(group);

        group.focus();

        const radios = group.getRadioButtons();
        expect(document.activeElement).toBe(radios[0].getInput());

        document.body.removeChild(group);
      });
    });

    describe('keyboard navigation', () => {
      let group: ReturnType<typeof createRadioGroup>;

      beforeEach(() => {
        group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          value: 'option1',
        });
        document.body.appendChild(group);
        group.focus();
      });

      afterEach(() => {
        document.body.removeChild(group);
      });

      it('ArrowDown moves to next option in vertical mode', () => {
        const radios = group.getRadioButtons();
        expect(document.activeElement).toBe(radios[0].getInput());

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

        expect(document.activeElement).toBe(radios[1].getInput());
        expect(group.getValue()).toBe('option2');
      });

      it('ArrowUp moves to previous option in vertical mode', () => {
        const radios = group.getRadioButtons();
        group.setValue('option2');
        radios[1].focus();

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

        expect(document.activeElement).toBe(radios[0].getInput());
        expect(group.getValue()).toBe('option1');
      });

      it('ArrowDown wraps to first option at end', () => {
        const radios = group.getRadioButtons();
        group.setValue('option3');
        radios[2].focus();

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

        expect(document.activeElement).toBe(radios[0].getInput());
      });

      it('ArrowUp wraps to last option at beginning', () => {
        const radios = group.getRadioButtons();

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

        expect(document.activeElement).toBe(radios[2].getInput());
      });

      it('ArrowRight/ArrowLeft work in horizontal mode', () => {
        document.body.removeChild(group);

        group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          value: 'option1',
          orientation: 'horizontal',
        });
        document.body.appendChild(group);
        group.focus();

        const radios = group.getRadioButtons();

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        expect(document.activeElement).toBe(radios[1].getInput());

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        expect(document.activeElement).toBe(radios[0].getInput());
      });

      it('skips disabled options when navigating', () => {
        document.body.removeChild(group);

        group = createRadioGroup({
          name: 'test',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' },
          ],
          value: 'option1',
        });
        document.body.appendChild(group);
        group.focus();

        const radios = group.getRadioButtons();

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

        // Should skip option2 and go to option3
        expect(document.activeElement).toBe(radios[2].getInput());
      });

      it('does not navigate when group is disabled', () => {
        group.setDisabled(true);

        const _radios = group.getRadioButtons();
        const initialActive = document.activeElement;

        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

        // Focus should not have changed
        expect(document.activeElement).toBe(initialActive);
      });
    });

    describe('accessibility', () => {
      it('has proper aria-describedby when error is present', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          error: 'Error message',
          id: 'test-group',
        });

        expect(group.getAttribute('aria-describedby')).toBe('test-group-error');

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement?.id).toBe('test-group-error');
      });

      it('error element has proper ARIA attributes', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          error: 'Error message',
        });

        const errorElement = group.querySelector('.dos-radio-group__error');
        expect(errorElement?.getAttribute('role')).toBe('alert');
        expect(errorElement?.getAttribute('aria-live')).toBe('polite');
      });

      it('required indicator is hidden from screen readers', () => {
        const group = createRadioGroup({
          name: 'test',
          options: defaultOptions,
          label: 'Required Field',
          required: true,
        });

        const required = group.querySelector('.dos-radio-group__required');
        expect(required?.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  // Cleanup
  afterEach(() => {
    document.body.innerHTML = '';
  });
});
