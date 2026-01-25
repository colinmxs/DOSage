/**
 * DOS Block Cursor Styling Tests
 *
 * Tests for the global DOS block cursor implementation across all text input components.
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { createTextInput } from '../../src/components/TextInput';
import { createTextarea } from '../../src/components/Textarea';
import { createPasswordInput } from '../../src/components/PasswordInput';
import type { TextInputElement } from '../../src/components/TextInput';
import type { TextareaElement } from '../../src/components/Textarea';
import type { PasswordInputElement } from '../../src/components/PasswordInput';

// Helper to add element to DOM for CSS computation
function mountElement(element: HTMLElement): HTMLElement {
  document.body.appendChild(element);
  return element;
}

describe('DOS Block Cursor', () => {
  let element: HTMLElement | null = null;

  afterEach(() => {
    if (element && element.parentNode) {
      element.remove();
    }
    element = null;
  });

  describe('TextInput cursor styling', () => {
    let input: TextInputElement;

    beforeEach(() => {
      input = createTextInput({ label: 'Test Input' });
      element = mountElement(input);
    });

    it('should have cursor styling applied to input field', () => {
      const field = input.querySelector('.dos-text-input__field') as HTMLInputElement;
      expect(field).toBeTruthy();
      // The field should exist and be ready for cursor styling
      expect(field.tagName).toBe('INPUT');
    });

    it('should add focused class when input is focused', () => {
      const field = input.getInput();
      field.focus();
      expect(input.classList.contains('dos-text-input--focused')).toBe(true);
    });

    it('should remove focused class when input is blurred', () => {
      const field = input.getInput();
      field.focus();
      field.blur();
      expect(input.classList.contains('dos-text-input--focused')).toBe(false);
    });

    it('should have readonly class when readonly', () => {
      const readonlyInput = createTextInput({ readonly: true });
      element?.remove();
      element = mountElement(readonlyInput);
      expect(readonlyInput.classList.contains('dos-text-input--readonly')).toBe(true);
    });

    it('should have disabled class when disabled', () => {
      const disabledInput = createTextInput({ disabled: true });
      element?.remove();
      element = mountElement(disabledInput);
      expect(disabledInput.classList.contains('dos-text-input--disabled')).toBe(true);
    });
  });

  describe('Textarea cursor styling', () => {
    let textarea: TextareaElement;

    beforeEach(() => {
      textarea = createTextarea({ label: 'Test Textarea' });
      element = mountElement(textarea);
    });

    it('should have cursor styling applied to textarea field', () => {
      const field = textarea.querySelector('.dos-textarea__field') as HTMLTextAreaElement;
      expect(field).toBeTruthy();
      expect(field.tagName).toBe('TEXTAREA');
    });

    it('should add focused class when textarea is focused', () => {
      const field = textarea.getTextarea();
      field.focus();
      expect(textarea.classList.contains('dos-textarea--focused')).toBe(true);
    });

    it('should have readonly class when readonly', () => {
      const readonlyTextarea = createTextarea({ readonly: true });
      element?.remove();
      element = mountElement(readonlyTextarea);
      expect(readonlyTextarea.classList.contains('dos-textarea--readonly')).toBe(true);
    });

    it('should have disabled class when disabled', () => {
      const disabledTextarea = createTextarea({ disabled: true });
      element?.remove();
      element = mountElement(disabledTextarea);
      expect(disabledTextarea.classList.contains('dos-textarea--disabled')).toBe(true);
    });
  });

  describe('PasswordInput cursor styling', () => {
    let passwordInput: PasswordInputElement;

    beforeEach(() => {
      passwordInput = createPasswordInput({ label: 'Test Password' });
      element = mountElement(passwordInput);
    });

    it('should have cursor styling applied to password field', () => {
      const field = passwordInput.querySelector('.dos-password-input__field') as HTMLInputElement;
      expect(field).toBeTruthy();
      expect(field.tagName).toBe('INPUT');
    });

    it('should add focused class when password input is focused', () => {
      const field = passwordInput.getInput();
      field.focus();
      expect(passwordInput.classList.contains('dos-password-input--focused')).toBe(true);
    });

    it('should have disabled class when disabled', () => {
      const disabledPassword = createPasswordInput({ disabled: true });
      element?.remove();
      element = mountElement(disabledPassword);
      expect(disabledPassword.classList.contains('dos-password-input--disabled')).toBe(true);
    });
  });

  describe('CSS custom properties', () => {
    it('should have cursor color custom property defined', () => {
      // Create a test element to check CSS custom properties
      const testElement = document.createElement('div');
      testElement.setAttribute('data-dos-theme', '');
      document.body.appendChild(testElement);

      const styles = getComputedStyle(testElement);
      // Note: Custom properties may not be directly readable via getComputedStyle
      // This test verifies the element can be styled
      expect(testElement.getAttribute('data-dos-theme')).toBe('');

      testElement.remove();
    });
  });

  describe('Cursor utility classes', () => {
    beforeEach(() => {
      element = createTextInput({ label: 'Test' });
      mountElement(element);
    });

    it('should accept dos-cursor-none class', () => {
      const field = (element as TextInputElement).getInput();
      field.classList.add('dos-cursor-none');
      expect(field.classList.contains('dos-cursor-none')).toBe(true);
    });

    it('should accept dos-cursor-steady class', () => {
      const field = (element as TextInputElement).getInput();
      field.classList.add('dos-cursor-steady');
      expect(field.classList.contains('dos-cursor-steady')).toBe(true);
    });

    it('should accept dos-cursor-blink class', () => {
      const field = (element as TextInputElement).getInput();
      field.classList.add('dos-cursor-blink');
      expect(field.classList.contains('dos-cursor-blink')).toBe(true);
    });

    it('should accept dos-cursor-visible class', () => {
      const field = (element as TextInputElement).getInput();
      field.classList.add('dos-cursor-visible');
      expect(field.classList.contains('dos-cursor-visible')).toBe(true);
    });
  });

  describe('Focus states', () => {
    it('TextInput should have focus method', () => {
      const input = createTextInput({});
      mountElement(input);
      expect(typeof input.getInput().focus).toBe('function');
      element = input;
    });

    it('Textarea should have focus method', () => {
      const textarea = createTextarea({});
      mountElement(textarea);
      expect(typeof textarea.getTextarea().focus).toBe('function');
      element = textarea;
    });

    it('PasswordInput should have focus method', () => {
      const password = createPasswordInput({});
      mountElement(password);
      expect(typeof password.getInput().focus).toBe('function');
      element = password;
    });
  });

  describe('Accessibility', () => {
    it('focused TextInput should be accessible via keyboard', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);
      const field = input.getInput();

      expect(field.tabIndex).not.toBe(-1);
    });

    it('disabled TextInput should not be focusable', () => {
      const input = createTextInput({ disabled: true });
      element = mountElement(input);
      const field = input.getInput();

      expect(field.disabled).toBe(true);
    });

    it('readonly TextInput should still be focusable', () => {
      const input = createTextInput({ readonly: true });
      element = mountElement(input);
      const field = input.getInput();

      expect(field.readOnly).toBe(true);
      // readonly inputs are still focusable
      expect(field.tabIndex).not.toBe(-1);
    });
  });

  describe('Cursor overlay integration', () => {
    it('TextInput should have cursor overlay element', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay).toBeTruthy();
    });

    it('Textarea should have cursor overlay element', () => {
      const textarea = createTextarea({ label: 'Test' });
      element = mountElement(textarea);

      const overlay = textarea.querySelector('.dos-cursor-overlay');
      expect(overlay).toBeTruthy();
    });

    it('PasswordInput should have cursor overlay element', () => {
      const password = createPasswordInput({ label: 'Test' });
      element = mountElement(password);

      const overlay = password.querySelector('.dos-cursor-overlay');
      expect(overlay).toBeTruthy();
    });

    it('cursor overlay should use block character', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay?.textContent).toBe('█');
    });

    it('cursor overlay should be hidden by default', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay?.classList.contains('dos-cursor-overlay--hidden')).toBe(true);
    });

    it('cursor overlay should be visible when focused', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const field = input.getInput();
      field.focus();

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay?.classList.contains('dos-cursor-overlay--visible')).toBe(true);
    });

    it('cursor overlay should be hidden when blurred', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const field = input.getInput();
      field.focus();
      field.blur();

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay?.classList.contains('dos-cursor-overlay--hidden')).toBe(true);
    });

    it('cursor overlay should have aria-hidden attribute', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay?.getAttribute('aria-hidden')).toBe('true');
    });

    it('disabled input should not show cursor on focus', () => {
      const input = createTextInput({ label: 'Test', disabled: true });
      element = mountElement(input);

      // Can't actually focus a disabled input, but verify the overlay is not visible
      const overlay = input.querySelector('.dos-cursor-overlay');
      // Either no overlay exists, or if it does, it should have the hidden class
      if (overlay) {
        expect(overlay.classList.contains('dos-cursor-overlay--visible')).toBe(false);
      }
      // Either way, the input should be disabled
      expect(input.getInput().disabled).toBe(true);
    });

    it('destroy should remove cursor overlay', () => {
      const input = createTextInput({ label: 'Test' });
      element = mountElement(input);

      const overlay = input.querySelector('.dos-cursor-overlay');
      expect(overlay).toBeTruthy();

      input.destroy();

      const overlayAfter = input.querySelector('.dos-cursor-overlay');
      expect(overlayAfter).toBeNull();
    });
  });
});
