/**
 * TextInput Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTextInput,
  setTextInputValue,
  getTextInputValue,
  setTextInputError,
  setTextInputDisabled,
} from '../../src/components/TextInput';
import type { TextInputElement } from '../../src/components/TextInput';

describe('TextInput', () => {
  let input: TextInputElement | null = null;

  afterEach(() => {
    if (input && input.parentNode) {
      input.remove();
    }
    input = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      input = createTextInput({});

      expect(input).toBeInstanceOf(HTMLDivElement);
      expect(input.classList.contains('dos-text-input')).toBe(true);

      const inputField = input.querySelector('input');
      expect(inputField).toBeInstanceOf(HTMLInputElement);
      expect(inputField?.type).toBe('text');
    });

    it('renders with initial value', () => {
      input = createTextInput({ value: 'Hello' });

      const inputField = input.getInput();
      expect(inputField.value).toBe('Hello');
    });

    it('renders with placeholder', () => {
      input = createTextInput({ placeholder: 'Enter text...' });

      const inputField = input.getInput();
      expect(inputField.placeholder).toBe('Enter text...');
    });

    it('renders with label', () => {
      input = createTextInput({ label: 'Username' });

      const label = input.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Username');
    });

    it('associates label with input', () => {
      input = createTextInput({ label: 'Email' });

      const label = input.querySelector('label');
      const inputField = input.getInput();

      expect(label?.htmlFor).toBe(inputField.id);
    });

    it('renders required indicator when required', () => {
      input = createTextInput({ label: 'Required Field', required: true });

      const requiredIndicator = input.querySelector('.dos-text-input__required');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('*');
    });

    it('applies custom className', () => {
      input = createTextInput({ className: 'my-input' });

      expect(input.classList.contains('dos-text-input')).toBe(true);
      expect(input.classList.contains('my-input')).toBe(true);
    });

    it('applies custom id', () => {
      input = createTextInput({ id: 'my-text-input' });

      const inputField = input.getInput();
      expect(inputField.id).toBe('my-text-input');
    });

    it('sets correct input type', () => {
      input = createTextInput({ type: 'email' });
      expect(input.getInput().type).toBe('email');

      input = createTextInput({ type: 'tel' });
      expect(input.getInput().type).toBe('tel');

      input = createTextInput({ type: 'url' });
      expect(input.getInput().type).toBe('url');
    });

    it('sets name attribute', () => {
      input = createTextInput({ name: 'username' });

      expect(input.getInput().name).toBe('username');
    });

    it('applies custom width', () => {
      input = createTextInput({ width: 300 });
      expect(input.style.width).toBe('300px');

      input = createTextInput({ width: '50%' });
      expect(input.style.width).toBe('50%');
    });
  });

  describe('states', () => {
    it('renders disabled state', () => {
      input = createTextInput({ disabled: true });

      expect(input.classList.contains('dos-text-input--disabled')).toBe(true);
      expect(input.getInput().disabled).toBe(true);
    });

    it('renders readonly state', () => {
      input = createTextInput({ readonly: true });

      expect(input.classList.contains('dos-text-input--readonly')).toBe(true);
      expect(input.getInput().readOnly).toBe(true);
    });

    it('renders error state with message', () => {
      input = createTextInput({ error: 'This field is required' });

      expect(input.classList.contains('dos-text-input--error')).toBe(true);

      const errorElement = input.querySelector('.dos-text-input__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('This field is required');
    });

    it('renders error state without message', () => {
      input = createTextInput({ error: true });

      expect(input.classList.contains('dos-text-input--error')).toBe(true);

      const errorElement = input.querySelector('.dos-text-input__error');
      expect(errorElement).toBeNull();
    });

    it('disabled label has correct class', () => {
      input = createTextInput({ label: 'Test', disabled: true });

      const label = input.querySelector('label');
      expect(label?.classList.contains('dos-text-input__label--disabled')).toBe(true);
    });
  });

  describe('validation attributes', () => {
    it('sets maxLength attribute', () => {
      input = createTextInput({ maxLength: 100 });

      expect(input.getInput().maxLength).toBe(100);
    });

    it('sets minLength attribute', () => {
      input = createTextInput({ minLength: 5 });

      expect(input.getInput().minLength).toBe(5);
    });

    it('sets pattern attribute', () => {
      input = createTextInput({ pattern: '[A-Za-z]+' });

      expect(input.getInput().pattern).toBe('[A-Za-z]+');
    });

    it('sets autocomplete attribute', () => {
      input = createTextInput({ autocomplete: 'email' });

      expect(input.getInput().autocomplete).toBe('email');
    });
  });

  describe('events', () => {
    it('calls onChange when input changes', () => {
      const handleChange = vi.fn();
      input = createTextInput({ onChange: handleChange });

      const inputField = input.getInput();
      inputField.value = 'test value';
      inputField.dispatchEvent(new Event('input', { bubbles: true }));

      expect(handleChange).toHaveBeenCalledWith('test value', expect.any(Event));
    });

    it('calls onBlur when input loses focus', () => {
      const handleBlur = vi.fn();
      input = createTextInput({ onBlur: handleBlur });

      const inputField = input.getInput();
      inputField.value = 'blur test';
      inputField.dispatchEvent(new FocusEvent('blur'));

      expect(handleBlur).toHaveBeenCalledWith('blur test', expect.any(FocusEvent));
    });

    it('calls onFocus when input gains focus', () => {
      const handleFocus = vi.fn();
      input = createTextInput({ onFocus: handleFocus });

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));

      expect(handleFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('calls onEnter when Enter key is pressed', () => {
      const handleEnter = vi.fn();
      input = createTextInput({ onEnter: handleEnter });

      const inputField = input.getInput();
      inputField.value = 'enter test';
      inputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(handleEnter).toHaveBeenCalledWith('enter test', expect.any(KeyboardEvent));
    });

    it('adds focused class on focus', () => {
      input = createTextInput({});

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));

      expect(input.classList.contains('dos-text-input--focused')).toBe(true);
    });

    it('removes focused class on blur', () => {
      input = createTextInput({});

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));
      inputField.dispatchEvent(new FocusEvent('blur'));

      expect(input.classList.contains('dos-text-input--focused')).toBe(false);
    });
  });

  describe('methods', () => {
    it('getValue returns current value', () => {
      input = createTextInput({ value: 'initial' });

      expect(input.getValue()).toBe('initial');

      input.getInput().value = 'updated';
      expect(input.getValue()).toBe('updated');
    });

    it('setValue updates the input value', () => {
      input = createTextInput({ value: 'initial' });

      input.setValue('new value');

      expect(input.getInput().value).toBe('new value');
    });

    it('setError updates error state', () => {
      input = createTextInput({});

      input.setError('An error occurred');

      expect(input.classList.contains('dos-text-input--error')).toBe(true);
      const errorElement = input.querySelector('.dos-text-input__error');
      expect(errorElement?.textContent).toContain('An error occurred');
    });

    it('setError clears error when passed undefined', () => {
      input = createTextInput({ error: 'Initial error' });

      input.setError(undefined);

      expect(input.classList.contains('dos-text-input--error')).toBe(false);
      const errorElement = input.querySelector('.dos-text-input__error');
      expect(errorElement).toBeNull();
    });

    it('setDisabled updates disabled state', () => {
      input = createTextInput({});

      input.setDisabled(true);

      expect(input.classList.contains('dos-text-input--disabled')).toBe(true);
      expect(input.getInput().disabled).toBe(true);
    });

    it('focusInput focuses the input element', () => {
      input = createTextInput({});
      document.body.appendChild(input);

      input.focusInput();

      expect(document.activeElement).toBe(input.getInput());
    });

    it('getInput returns the underlying input element', () => {
      input = createTextInput({});

      const inputField = input.getInput();

      expect(inputField).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('helper functions', () => {
    it('setTextInputValue sets the value', () => {
      input = createTextInput({});

      setTextInputValue(input, 'helper value');

      expect(input.getValue()).toBe('helper value');
    });

    it('getTextInputValue gets the value', () => {
      input = createTextInput({ value: 'getter test' });

      const value = getTextInputValue(input);

      expect(value).toBe('getter test');
    });

    it('setTextInputError sets the error', () => {
      input = createTextInput({});

      setTextInputError(input, 'Helper error');

      expect(input.classList.contains('dos-text-input--error')).toBe(true);
    });

    it('setTextInputDisabled sets disabled state', () => {
      input = createTextInput({});

      setTextInputDisabled(input, true);

      expect(input.getInput().disabled).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has aria-required when required', () => {
      input = createTextInput({ required: true });

      expect(input.getInput().getAttribute('aria-required')).toBe('true');
    });

    it('has aria-invalid when error', () => {
      input = createTextInput({ error: true });

      expect(input.getInput().getAttribute('aria-invalid')).toBe('true');
    });

    it('has aria-describedby linking to error message', () => {
      input = createTextInput({ id: 'test-input', error: 'Error message' });

      const inputField = input.getInput();
      const errorElement = input.querySelector('.dos-text-input__error');

      expect(inputField.getAttribute('aria-describedby')).toBe('test-input-error');
      expect(errorElement?.id).toBe('test-input-error');
    });

    it('error message has role="alert"', () => {
      input = createTextInput({ error: 'Alert error' });

      const errorElement = input.querySelector('.dos-text-input__error');
      expect(errorElement?.getAttribute('role')).toBe('alert');
    });

    it('error icon is hidden from screen readers', () => {
      input = createTextInput({ error: 'Error with icon' });

      const icon = input.querySelector('.dos-text-input__error-icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('required indicator is hidden from screen readers', () => {
      input = createTextInput({ label: 'Field', required: true });

      const indicator = input.querySelector('.dos-text-input__required');
      expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('keyboard navigation', () => {
    it('input is focusable', () => {
      input = createTextInput({});
      document.body.appendChild(input);

      const inputField = input.getInput();
      inputField.focus();

      expect(document.activeElement).toBe(inputField);
    });

    it('disabled input is not focusable via disabled attribute', () => {
      input = createTextInput({ disabled: true });

      expect(input.getInput().disabled).toBe(true);
    });
  });
});
