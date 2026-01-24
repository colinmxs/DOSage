/**
 * Checkbox Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createCheckbox,
  setCheckboxChecked,
  getCheckboxChecked,
  setCheckboxIndeterminate,
  setCheckboxDisabled,
  toggleCheckbox,
} from '../../src/components/Checkbox';
import type { CheckboxElement } from '../../src/components/Checkbox';

/**
 * Helper to simulate clicking a checkbox in jsdom.
 * jsdom doesn't always fire the change event on input.click().
 */
function clickCheckbox(input: HTMLInputElement): void {
  input.checked = !input.checked;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Checkbox', () => {
  let checkbox: CheckboxElement | null = null;

  afterEach(() => {
    if (checkbox && checkbox.parentNode) {
      checkbox.remove();
    }
    checkbox = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      checkbox = createCheckbox({});

      expect(checkbox).toBeInstanceOf(HTMLDivElement);
      expect(checkbox.classList.contains('dos-checkbox')).toBe(true);

      const input = checkbox.querySelector('input');
      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input?.type).toBe('checkbox');
    });

    it('renders unchecked by default', () => {
      checkbox = createCheckbox({});

      expect(checkbox.isChecked()).toBe(false);
      expect(checkbox.classList.contains('dos-checkbox--checked')).toBe(false);
    });

    it('renders checked when checked prop is true', () => {
      checkbox = createCheckbox({ checked: true });

      expect(checkbox.isChecked()).toBe(true);
      expect(checkbox.classList.contains('dos-checkbox--checked')).toBe(true);
    });

    it('renders with label', () => {
      checkbox = createCheckbox({ label: 'Accept terms' });

      const label = checkbox.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Accept terms');
    });

    it('associates label with input', () => {
      checkbox = createCheckbox({ label: 'Option' });

      const label = checkbox.querySelector('label');
      const input = checkbox.getInput();

      expect(label?.htmlFor).toBe(input.id);
    });

    it('renders required indicator when required', () => {
      checkbox = createCheckbox({ label: 'Required', required: true });

      const requiredIndicator = checkbox.querySelector('.dos-checkbox__required');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('*');
    });

    it('applies custom className', () => {
      checkbox = createCheckbox({ className: 'my-checkbox' });

      expect(checkbox.classList.contains('dos-checkbox')).toBe(true);
      expect(checkbox.classList.contains('my-checkbox')).toBe(true);
    });

    it('applies custom id', () => {
      checkbox = createCheckbox({ id: 'my-checkbox' });

      const input = checkbox.getInput();
      expect(input.id).toBe('my-checkbox');
    });

    it('sets name attribute', () => {
      checkbox = createCheckbox({ name: 'agreement' });

      expect(checkbox.getInput().name).toBe('agreement');
    });

    it('sets value attribute', () => {
      checkbox = createCheckbox({ value: 'agreed' });

      expect(checkbox.getInput().value).toBe('agreed');
    });

    it('renders check mark box', () => {
      checkbox = createCheckbox({});

      const box = checkbox.querySelector('.dos-checkbox__box');
      expect(box).toBeTruthy();
    });

    it('renders check mark element', () => {
      checkbox = createCheckbox({});

      const mark = checkbox.querySelector('.dos-checkbox__mark');
      expect(mark).toBeTruthy();
    });
  });

  describe('label position', () => {
    it('defaults to label on right', () => {
      checkbox = createCheckbox({ label: 'Right label' });

      expect(checkbox.classList.contains('dos-checkbox--label-right')).toBe(true);
    });

    it('places label on left when specified', () => {
      checkbox = createCheckbox({ label: 'Left label', labelPosition: 'left' });

      expect(checkbox.classList.contains('dos-checkbox--label-left')).toBe(true);
    });
  });

  describe('check character', () => {
    it('uses X by default', () => {
      checkbox = createCheckbox({ checked: true });

      const mark = checkbox.querySelector('.dos-checkbox__mark');
      expect(mark?.textContent).toBe('X');
    });

    it('uses custom check character', () => {
      checkbox = createCheckbox({ checked: true, checkChar: '✓' });

      const mark = checkbox.querySelector('.dos-checkbox__mark');
      expect(mark?.textContent).toBe('✓');
    });
  });

  describe('indeterminate state', () => {
    it('renders indeterminate state', () => {
      checkbox = createCheckbox({ indeterminate: true });

      expect(checkbox.isIndeterminate()).toBe(true);
      expect(checkbox.classList.contains('dos-checkbox--indeterminate')).toBe(true);
    });

    it('displays - for indeterminate', () => {
      checkbox = createCheckbox({ indeterminate: true });

      const mark = checkbox.querySelector('.dos-checkbox__mark');
      expect(mark?.textContent).toBe('-');
    });

    it('sets aria-checked to mixed', () => {
      checkbox = createCheckbox({ indeterminate: true });

      expect(checkbox.getInput().getAttribute('aria-checked')).toBe('mixed');
    });

    it('clears indeterminate on change', () => {
      checkbox = createCheckbox({ indeterminate: true });

      clickCheckbox(checkbox.getInput());

      expect(checkbox.isIndeterminate()).toBe(false);
      expect(checkbox.classList.contains('dos-checkbox--indeterminate')).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('renders disabled state', () => {
      checkbox = createCheckbox({ disabled: true });

      expect(checkbox.classList.contains('dos-checkbox--disabled')).toBe(true);
      expect(checkbox.getInput().disabled).toBe(true);
    });

    it('prevents interaction when disabled', () => {
      const handleChange = vi.fn();
      checkbox = createCheckbox({ disabled: true, onChange: handleChange });

      checkbox.getInput().click();

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it('calls onChange when clicked', () => {
      const handleChange = vi.fn();
      checkbox = createCheckbox({ onChange: handleChange });

      clickCheckbox(checkbox.getInput());

      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Event));
    });

    it('calls onChange with correct state on subsequent clicks', () => {
      const handleChange = vi.fn();
      checkbox = createCheckbox({ onChange: handleChange });

      clickCheckbox(checkbox.getInput());
      expect(handleChange).toHaveBeenLastCalledWith(true, expect.any(Event));

      clickCheckbox(checkbox.getInput());
      expect(handleChange).toHaveBeenLastCalledWith(false, expect.any(Event));
    });

    it('calls onFocus when focused', () => {
      const handleFocus = vi.fn();
      checkbox = createCheckbox({ onFocus: handleFocus });

      checkbox.getInput().dispatchEvent(new FocusEvent('focus'));

      expect(handleFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = vi.fn();
      checkbox = createCheckbox({ onBlur: handleBlur });

      checkbox.getInput().dispatchEvent(new FocusEvent('blur'));

      expect(handleBlur).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('adds focused class on focus', () => {
      checkbox = createCheckbox({});

      checkbox.getInput().dispatchEvent(new FocusEvent('focus'));

      expect(checkbox.classList.contains('dos-checkbox--focused')).toBe(true);
    });

    it('removes focused class on blur', () => {
      checkbox = createCheckbox({});

      checkbox.getInput().dispatchEvent(new FocusEvent('focus'));
      checkbox.getInput().dispatchEvent(new FocusEvent('blur'));

      expect(checkbox.classList.contains('dos-checkbox--focused')).toBe(false);
    });

    it('toggles on wrapper click', () => {
      checkbox = createCheckbox({});
      document.body.appendChild(checkbox);

      const box = checkbox.querySelector('.dos-checkbox__box') as HTMLElement;
      box.click();

      expect(checkbox.isChecked()).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    it('toggles on Space key via input', () => {
      checkbox = createCheckbox({});

      clickCheckbox(checkbox.getInput());

      expect(checkbox.isChecked()).toBe(true);
    });

    it('input is focusable', () => {
      checkbox = createCheckbox({});
      document.body.appendChild(checkbox);

      checkbox.getInput().focus();

      expect(document.activeElement).toBe(checkbox.getInput());
    });
  });

  describe('methods', () => {
    it('isChecked returns current state', () => {
      checkbox = createCheckbox({ checked: true });

      expect(checkbox.isChecked()).toBe(true);

      checkbox.setChecked(false);

      expect(checkbox.isChecked()).toBe(false);
    });

    it('setChecked updates the state', () => {
      checkbox = createCheckbox({});

      checkbox.setChecked(true);

      expect(checkbox.isChecked()).toBe(true);
      expect(checkbox.getInput().checked).toBe(true);
      expect(checkbox.classList.contains('dos-checkbox--checked')).toBe(true);
    });

    it('setChecked clears indeterminate state', () => {
      checkbox = createCheckbox({ indeterminate: true });

      checkbox.setChecked(true);

      expect(checkbox.isIndeterminate()).toBe(false);
    });

    it('toggle toggles the state', () => {
      checkbox = createCheckbox({});

      checkbox.toggle();

      expect(checkbox.isChecked()).toBe(true);

      checkbox.toggle();

      expect(checkbox.isChecked()).toBe(false);
    });

    it('toggle calls onChange', () => {
      const handleChange = vi.fn();
      checkbox = createCheckbox({ onChange: handleChange });

      checkbox.toggle();

      expect(handleChange).toHaveBeenCalled();
    });

    it('isIndeterminate returns current state', () => {
      checkbox = createCheckbox({ indeterminate: true });

      expect(checkbox.isIndeterminate()).toBe(true);
    });

    it('setIndeterminate updates the state', () => {
      checkbox = createCheckbox({});

      checkbox.setIndeterminate(true);

      expect(checkbox.isIndeterminate()).toBe(true);
      expect(checkbox.getInput().indeterminate).toBe(true);
    });

    it('setDisabled updates disabled state', () => {
      checkbox = createCheckbox({});

      checkbox.setDisabled(true);

      expect(checkbox.classList.contains('dos-checkbox--disabled')).toBe(true);
      expect(checkbox.getInput().disabled).toBe(true);
    });

    it('focus focuses the input', () => {
      checkbox = createCheckbox({});
      document.body.appendChild(checkbox);

      checkbox.focus();

      expect(document.activeElement).toBe(checkbox.getInput());
    });

    it('getInput returns the underlying input', () => {
      checkbox = createCheckbox({});

      const input = checkbox.getInput();

      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input.type).toBe('checkbox');
    });
  });

  describe('helper functions', () => {
    it('setCheckboxChecked sets the state', () => {
      checkbox = createCheckbox({});

      setCheckboxChecked(checkbox, true);

      expect(checkbox.isChecked()).toBe(true);
    });

    it('getCheckboxChecked gets the state', () => {
      checkbox = createCheckbox({ checked: true });

      const checked = getCheckboxChecked(checkbox);

      expect(checked).toBe(true);
    });

    it('setCheckboxIndeterminate sets indeterminate', () => {
      checkbox = createCheckbox({});

      setCheckboxIndeterminate(checkbox, true);

      expect(checkbox.isIndeterminate()).toBe(true);
    });

    it('setCheckboxDisabled sets disabled state', () => {
      checkbox = createCheckbox({});

      setCheckboxDisabled(checkbox, true);

      expect(checkbox.getInput().disabled).toBe(true);
    });

    it('toggleCheckbox toggles the state', () => {
      checkbox = createCheckbox({});

      toggleCheckbox(checkbox);

      expect(checkbox.isChecked()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has aria-required when required', () => {
      checkbox = createCheckbox({ required: true });

      expect(checkbox.getInput().getAttribute('aria-required')).toBe('true');
    });

    it('has aria-checked mixed when indeterminate', () => {
      checkbox = createCheckbox({ indeterminate: true });

      expect(checkbox.getInput().getAttribute('aria-checked')).toBe('mixed');
    });

    it('removes aria-checked when not indeterminate', () => {
      checkbox = createCheckbox({ indeterminate: true });

      checkbox.setIndeterminate(false);

      expect(checkbox.getInput().getAttribute('aria-checked')).toBeNull();
    });

    it('box is hidden from screen readers', () => {
      checkbox = createCheckbox({});

      const box = checkbox.querySelector('.dos-checkbox__box');
      expect(box?.getAttribute('aria-hidden')).toBe('true');
    });

    it('required indicator is hidden from screen readers', () => {
      checkbox = createCheckbox({ label: 'Field', required: true });

      const indicator = checkbox.querySelector('.dos-checkbox__required');
      expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    });

    it('uses native checkbox for accessibility', () => {
      checkbox = createCheckbox({});

      const input = checkbox.getInput();
      expect(input.type).toBe('checkbox');
    });
  });
});
