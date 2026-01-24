/**
 * PasswordInput Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createPasswordInput,
  setPasswordInputValue,
  getPasswordInputValue,
  setPasswordInputError,
  setPasswordInputDisabled,
  togglePasswordVisibility,
} from '../../src/components/PasswordInput';
import type { PasswordInputElement } from '../../src/components/PasswordInput';

describe('PasswordInput', () => {
  let input: PasswordInputElement | null = null;

  afterEach(() => {
    if (input && input.parentNode) {
      input.remove();
    }
    input = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      input = createPasswordInput({});

      expect(input).toBeInstanceOf(HTMLDivElement);
      expect(input.classList.contains('dos-password-input')).toBe(true);

      const inputField = input.querySelector('input');
      expect(inputField).toBeInstanceOf(HTMLInputElement);
      expect(inputField?.type).toBe('password');
    });

    it('renders with initial value', () => {
      input = createPasswordInput({ value: 'secret123' });

      const inputField = input.getInput();
      expect(inputField.value).toBe('secret123');
    });

    it('renders with placeholder', () => {
      input = createPasswordInput({ placeholder: 'Enter password...' });

      const inputField = input.getInput();
      expect(inputField.placeholder).toBe('Enter password...');
    });

    it('renders with label', () => {
      input = createPasswordInput({ label: 'Password' });

      const label = input.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Password');
    });

    it('associates label with input', () => {
      input = createPasswordInput({ label: 'Password' });

      const label = input.querySelector('label');
      const inputField = input.getInput();

      expect(label?.htmlFor).toBe(inputField.id);
    });

    it('renders required indicator when required', () => {
      input = createPasswordInput({ label: 'Password', required: true });

      const requiredIndicator = input.querySelector('.dos-password-input__required');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('*');
    });

    it('applies custom className', () => {
      input = createPasswordInput({ className: 'my-password' });

      expect(input.classList.contains('dos-password-input')).toBe(true);
      expect(input.classList.contains('my-password')).toBe(true);
    });

    it('applies custom id', () => {
      input = createPasswordInput({ id: 'my-password-input' });

      const inputField = input.getInput();
      expect(inputField.id).toBe('my-password-input');
    });

    it('sets name attribute', () => {
      input = createPasswordInput({ name: 'password' });

      expect(input.getInput().name).toBe('password');
    });

    it('sets autocomplete attribute', () => {
      input = createPasswordInput({ autocomplete: 'new-password' });

      expect(input.getInput().autocomplete).toBe('new-password');
    });

    it('defaults to current-password autocomplete', () => {
      input = createPasswordInput({});

      expect(input.getInput().autocomplete).toBe('current-password');
    });

    it('applies custom width', () => {
      input = createPasswordInput({ width: 300 });
      expect(input.style.width).toBe('300px');

      input = createPasswordInput({ width: '50%' });
      expect(input.style.width).toBe('50%');
    });

    it('stores mask character in data attribute', () => {
      input = createPasswordInput({ maskChar: '●' });

      expect(input.getInput().dataset.maskChar).toBe('●');
    });
  });

  describe('toggle button', () => {
    it('renders toggle button by default', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('does not render toggle button when showToggle is false', () => {
      input = createPasswordInput({ showToggle: false });

      const toggleButton = input.querySelector('.dos-password-input__toggle');
      expect(toggleButton).toBeNull();
      expect(input.classList.contains('dos-password-input--no-toggle')).toBe(true);
    });

    it('toggles visibility on button click', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      const inputField = input.getInput();

      expect(inputField.type).toBe('password');

      toggleButton.click();

      expect(inputField.type).toBe('text');
      expect(input.classList.contains('dos-password-input--visible')).toBe(true);

      toggleButton.click();

      expect(inputField.type).toBe('password');
      expect(input.classList.contains('dos-password-input--visible')).toBe(false);
    });

    it('toggles visibility on Enter key', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      const inputField = input.getInput();

      toggleButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(inputField.type).toBe('text');
    });

    it('toggles visibility on Space key', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      const inputField = input.getInput();

      toggleButton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(inputField.type).toBe('text');
    });

    it('updates aria-pressed on toggle', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;

      expect(toggleButton.getAttribute('aria-pressed')).toBe('false');

      toggleButton.click();

      expect(toggleButton.getAttribute('aria-pressed')).toBe('true');
    });

    it('updates aria-label on toggle', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;

      expect(toggleButton.getAttribute('aria-label')).toBe('Show password');

      toggleButton.click();

      expect(toggleButton.getAttribute('aria-label')).toBe('Hide password');
    });

    it('calls onToggleVisibility callback', () => {
      const handleToggle = vi.fn();
      input = createPasswordInput({ onToggleVisibility: handleToggle });

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      toggleButton.click();

      expect(handleToggle).toHaveBeenCalledWith(true);

      toggleButton.click();

      expect(handleToggle).toHaveBeenCalledWith(false);
    });

    it('disables toggle button when input is disabled', () => {
      input = createPasswordInput({ disabled: true });

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      expect(toggleButton.disabled).toBe(true);
    });
  });

  describe('states', () => {
    it('renders disabled state', () => {
      input = createPasswordInput({ disabled: true });

      expect(input.classList.contains('dos-password-input--disabled')).toBe(true);
      expect(input.getInput().disabled).toBe(true);
    });

    it('renders error state with message', () => {
      input = createPasswordInput({ error: 'Password is required' });

      expect(input.classList.contains('dos-password-input--error')).toBe(true);

      const errorElement = input.querySelector('.dos-password-input__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('Password is required');
    });

    it('renders error state without message', () => {
      input = createPasswordInput({ error: true });

      expect(input.classList.contains('dos-password-input--error')).toBe(true);

      const errorElement = input.querySelector('.dos-password-input__error');
      expect(errorElement).toBeNull();
    });

    it('disabled label has correct class', () => {
      input = createPasswordInput({ label: 'Password', disabled: true });

      const label = input.querySelector('label');
      expect(label?.classList.contains('dos-password-input__label--disabled')).toBe(true);
    });
  });

  describe('validation attributes', () => {
    it('sets maxLength attribute', () => {
      input = createPasswordInput({ maxLength: 32 });

      expect(input.getInput().maxLength).toBe(32);
    });
  });

  describe('events', () => {
    it('calls onChange when input changes', () => {
      const handleChange = vi.fn();
      input = createPasswordInput({ onChange: handleChange });

      const inputField = input.getInput();
      inputField.value = 'newpassword';
      inputField.dispatchEvent(new Event('input', { bubbles: true }));

      expect(handleChange).toHaveBeenCalledWith('newpassword', expect.any(Event));
    });

    it('calls onBlur when input loses focus', () => {
      const handleBlur = vi.fn();
      input = createPasswordInput({ onBlur: handleBlur });

      const inputField = input.getInput();
      inputField.value = 'blurtest';
      inputField.dispatchEvent(new FocusEvent('blur'));

      expect(handleBlur).toHaveBeenCalledWith('blurtest', expect.any(FocusEvent));
    });

    it('calls onFocus when input gains focus', () => {
      const handleFocus = vi.fn();
      input = createPasswordInput({ onFocus: handleFocus });

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));

      expect(handleFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('calls onEnter when Enter key is pressed', () => {
      const handleEnter = vi.fn();
      input = createPasswordInput({ onEnter: handleEnter });

      const inputField = input.getInput();
      inputField.value = 'entertest';
      inputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(handleEnter).toHaveBeenCalledWith('entertest', expect.any(KeyboardEvent));
    });

    it('adds focused class on focus', () => {
      input = createPasswordInput({});

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));

      expect(input.classList.contains('dos-password-input--focused')).toBe(true);
    });

    it('removes focused class on blur', () => {
      input = createPasswordInput({});

      const inputField = input.getInput();
      inputField.dispatchEvent(new FocusEvent('focus'));
      inputField.dispatchEvent(new FocusEvent('blur'));

      expect(input.classList.contains('dos-password-input--focused')).toBe(false);
    });
  });

  describe('methods', () => {
    it('getValue returns current value', () => {
      input = createPasswordInput({ value: 'initial' });

      expect(input.getValue()).toBe('initial');

      input.getInput().value = 'updated';
      expect(input.getValue()).toBe('updated');
    });

    it('setValue updates the input value', () => {
      input = createPasswordInput({ value: 'initial' });

      input.setValue('new password');

      expect(input.getInput().value).toBe('new password');
    });

    it('setError updates error state', () => {
      input = createPasswordInput({});

      input.setError('Invalid password');

      expect(input.classList.contains('dos-password-input--error')).toBe(true);
      const errorElement = input.querySelector('.dos-password-input__error');
      expect(errorElement?.textContent).toContain('Invalid password');
    });

    it('setError clears error when passed undefined', () => {
      input = createPasswordInput({ error: 'Initial error' });

      input.setError(undefined);

      expect(input.classList.contains('dos-password-input--error')).toBe(false);
      const errorElement = input.querySelector('.dos-password-input__error');
      expect(errorElement).toBeNull();
    });

    it('setDisabled updates disabled state', () => {
      input = createPasswordInput({});

      input.setDisabled(true);

      expect(input.classList.contains('dos-password-input--disabled')).toBe(true);
      expect(input.getInput().disabled).toBe(true);
    });

    it('setDisabled also disables toggle button', () => {
      input = createPasswordInput({});

      input.setDisabled(true);

      const toggleButton = input.querySelector('.dos-password-input__toggle') as HTMLButtonElement;
      expect(toggleButton.disabled).toBe(true);
    });

    it('focusInput focuses the input element', () => {
      input = createPasswordInput({});
      document.body.appendChild(input);

      input.focusInput();

      expect(document.activeElement).toBe(input.getInput());
    });

    it('getInput returns the underlying input element', () => {
      input = createPasswordInput({});

      const inputField = input.getInput();

      expect(inputField).toBeInstanceOf(HTMLInputElement);
    });

    it('toggleVisibility toggles password visibility', () => {
      input = createPasswordInput({});

      expect(input.isVisible()).toBe(false);
      expect(input.getInput().type).toBe('password');

      input.toggleVisibility();

      expect(input.isVisible()).toBe(true);
      expect(input.getInput().type).toBe('text');
    });

    it('isVisible returns current visibility state', () => {
      input = createPasswordInput({});

      expect(input.isVisible()).toBe(false);

      input.toggleVisibility();

      expect(input.isVisible()).toBe(true);
    });
  });

  describe('helper functions', () => {
    it('setPasswordInputValue sets the value', () => {
      input = createPasswordInput({});

      setPasswordInputValue(input, 'helper value');

      expect(input.getValue()).toBe('helper value');
    });

    it('getPasswordInputValue gets the value', () => {
      input = createPasswordInput({ value: 'getter test' });

      const value = getPasswordInputValue(input);

      expect(value).toBe('getter test');
    });

    it('setPasswordInputError sets the error', () => {
      input = createPasswordInput({});

      setPasswordInputError(input, 'Helper error');

      expect(input.classList.contains('dos-password-input--error')).toBe(true);
    });

    it('setPasswordInputDisabled sets disabled state', () => {
      input = createPasswordInput({});

      setPasswordInputDisabled(input, true);

      expect(input.getInput().disabled).toBe(true);
    });

    it('togglePasswordVisibility toggles visibility', () => {
      input = createPasswordInput({});

      togglePasswordVisibility(input);

      expect(input.isVisible()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has aria-required when required', () => {
      input = createPasswordInput({ required: true });

      expect(input.getInput().getAttribute('aria-required')).toBe('true');
    });

    it('has aria-invalid when error', () => {
      input = createPasswordInput({ error: true });

      expect(input.getInput().getAttribute('aria-invalid')).toBe('true');
    });

    it('has aria-describedby linking to error message', () => {
      input = createPasswordInput({ id: 'pwd-input', error: 'Error message' });

      const inputField = input.getInput();
      const errorElement = input.querySelector('.dos-password-input__error');

      expect(inputField.getAttribute('aria-describedby')).toBe('pwd-input-error');
      expect(errorElement?.id).toBe('pwd-input-error');
    });

    it('error message has role="alert"', () => {
      input = createPasswordInput({ error: 'Alert error' });

      const errorElement = input.querySelector('.dos-password-input__error');
      expect(errorElement?.getAttribute('role')).toBe('alert');
    });

    it('toggle button has aria-label', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle');
      expect(toggleButton?.getAttribute('aria-label')).toBe('Show password');
    });

    it('toggle button has aria-pressed', () => {
      input = createPasswordInput({});

      const toggleButton = input.querySelector('.dos-password-input__toggle');
      expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');
    });

    it('toggle icon is hidden from screen readers', () => {
      input = createPasswordInput({});

      const icon = input.querySelector('.dos-password-input__toggle-icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('required indicator is hidden from screen readers', () => {
      input = createPasswordInput({ label: 'Password', required: true });

      const indicator = input.querySelector('.dos-password-input__required');
      expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('security', () => {
    it('masks password by default', () => {
      input = createPasswordInput({ value: 'secret' });

      expect(input.getInput().type).toBe('password');
    });

    it('never exposes password in accessible name', () => {
      input = createPasswordInput({ value: 'supersecret', label: 'Password' });

      const inputField = input.getInput();
      // The value should not be in aria-label or any accessible property
      expect(inputField.getAttribute('aria-label')).toBeNull();
    });
  });
});
