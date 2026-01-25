import { describe, it, expect, vi as _vi } from 'vitest';
import { createFormValidation } from '../../src/components/FormValidation';
import type { ValidationType } from '../../src/components/FormValidation';

describe('FormValidation', () => {
  describe('rendering', () => {
    it('creates a div element', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      expect(validation.tagName).toBe('DIV');
      expect(validation.classList.contains('dos-form-validation')).toBe(true);
    });

    it('renders message text', () => {
      const validation = createFormValidation({
        message: 'This field is required',
      });

      expect(validation.textContent).toContain('This field is required');
    });

    it('renders message in dedicated element', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      const messageElement = validation.querySelector('.dos-form-validation__message');
      expect(messageElement).toBeTruthy();
      expect(messageElement?.textContent).toBe('Test message');
    });

    it('uses provided id', () => {
      const validation = createFormValidation({
        message: 'Test message',
        id: 'custom-validation-id',
      });

      expect(validation.id).toBe('custom-validation-id');
    });

    it('generates unique id when not provided', () => {
      const validation1 = createFormValidation({ message: 'Message 1' });
      const validation2 = createFormValidation({ message: 'Message 2' });

      expect(validation1.id).toBeTruthy();
      expect(validation2.id).toBeTruthy();
      expect(validation1.id).not.toBe(validation2.id);
    });

    it('applies custom className', () => {
      const validation = createFormValidation({
        message: 'Test message',
        className: 'custom-class',
      });

      expect(validation.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('type variants', () => {
    it('defaults to error type', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      expect(validation.classList.contains('dos-form-validation--error')).toBe(true);
      expect(validation.getType()).toBe('error');
    });

    it.each<ValidationType>(['error', 'warning', 'success', 'info'])(
      'renders %s type correctly',
      (type) => {
        const validation = createFormValidation({
          message: 'Test message',
          type,
        });

        expect(validation.classList.contains(`dos-form-validation--${type}`)).toBe(true);
        expect(validation.getType()).toBe(type);
      }
    );

    it('setType updates the type', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'error',
      });

      validation.setType('success');

      expect(validation.classList.contains('dos-form-validation--success')).toBe(true);
      expect(validation.classList.contains('dos-form-validation--error')).toBe(false);
      expect(validation.getType()).toBe('success');
    });

    it('getType returns current type', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'warning',
      });

      expect(validation.getType()).toBe('warning');
    });
  });

  describe('icons', () => {
    it('shows default icon by default', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'error',
      });

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.textContent).toBe('[!]');
    });

    it.each([
      ['error', '[!]'],
      ['warning', '[?]'],
      ['success', '[√]'],
      ['info', '[i]'],
    ] as const)('shows correct default icon for %s type', (type, expectedIcon) => {
      const validation = createFormValidation({
        message: 'Test message',
        type,
      });

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.textContent).toBe(expectedIcon);
    });

    it('hides icon when icon is false', () => {
      const validation = createFormValidation({
        message: 'Test message',
        icon: false,
      });

      const iconElement = validation.querySelector('.dos-form-validation__icon') as HTMLElement;
      expect(iconElement.style.display).toBe('none');
    });

    it('shows custom icon when provided', () => {
      const validation = createFormValidation({
        message: 'Test message',
        icon: '>>>',
      });

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.textContent).toBe('>>>');
    });

    it('setIcon updates the icon', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      validation.setIcon('***');

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.textContent).toBe('***');
    });

    it('setIcon(false) hides the icon', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      validation.setIcon(false);

      const iconElement = validation.querySelector('.dos-form-validation__icon') as HTMLElement;
      expect(iconElement.style.display).toBe('none');
    });

    it('setIcon(true) restores default icon', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'warning',
        icon: false,
      });

      validation.setIcon(true);

      const iconElement = validation.querySelector('.dos-form-validation__icon') as HTMLElement;
      expect(iconElement.style.display).toBe('');
      expect(iconElement.textContent).toBe('[?]');
    });

    it('icon element is hidden from screen readers', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });

    it('updates icon when type changes and using default icon', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'error',
      });

      validation.setType('success');

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.textContent).toBe('[√]');
    });

    it('does not update custom icon when type changes', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'error',
        icon: '>>>',
      });

      validation.setType('success');

      const iconElement = validation.querySelector('.dos-form-validation__icon');
      expect(iconElement?.textContent).toBe('>>>');
    });
  });

  describe('visibility', () => {
    it('is visible by default', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      expect(validation.classList.contains('dos-form-validation--hidden')).toBe(false);
      expect(validation.isVisible()).toBe(true);
    });

    it('can be hidden initially', () => {
      const validation = createFormValidation({
        message: 'Test message',
        visible: false,
      });

      expect(validation.classList.contains('dos-form-validation--hidden')).toBe(true);
      expect(validation.isVisible()).toBe(false);
    });

    it('setVisible toggles visibility', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      validation.setVisible(false);

      expect(validation.classList.contains('dos-form-validation--hidden')).toBe(true);
      expect(validation.isVisible()).toBe(false);

      validation.setVisible(true);

      expect(validation.classList.contains('dos-form-validation--hidden')).toBe(false);
      expect(validation.isVisible()).toBe(true);
    });

    it('isVisible returns current visibility', () => {
      const validation = createFormValidation({
        message: 'Test message',
        visible: false,
      });

      expect(validation.isVisible()).toBe(false);
    });
  });

  describe('message methods', () => {
    it('setMessage updates the message', () => {
      const validation = createFormValidation({
        message: 'Initial message',
      });

      validation.setMessage('Updated message');

      const messageElement = validation.querySelector('.dos-form-validation__message');
      expect(messageElement?.textContent).toBe('Updated message');
    });

    it('getMessage returns current message', () => {
      const validation = createFormValidation({
        message: 'Test message',
      });

      expect(validation.getMessage()).toBe('Test message');

      validation.setMessage('New message');
      expect(validation.getMessage()).toBe('New message');
    });
  });

  describe('accessibility', () => {
    it('error type has role="alert"', () => {
      const validation = createFormValidation({
        message: 'Error message',
        type: 'error',
      });

      expect(validation.getAttribute('role')).toBe('alert');
      expect(validation.hasAttribute('aria-live')).toBe(false);
    });

    it('warning type has aria-live="polite"', () => {
      const validation = createFormValidation({
        message: 'Warning message',
        type: 'warning',
      });

      expect(validation.hasAttribute('role')).toBe(false);
      expect(validation.getAttribute('aria-live')).toBe('polite');
    });

    it('success type has aria-live="polite"', () => {
      const validation = createFormValidation({
        message: 'Success message',
        type: 'success',
      });

      expect(validation.hasAttribute('role')).toBe(false);
      expect(validation.getAttribute('aria-live')).toBe('polite');
    });

    it('info type has aria-live="polite"', () => {
      const validation = createFormValidation({
        message: 'Info message',
        type: 'info',
      });

      expect(validation.hasAttribute('role')).toBe(false);
      expect(validation.getAttribute('aria-live')).toBe('polite');
    });

    it('updates ARIA attributes when type changes', () => {
      const validation = createFormValidation({
        message: 'Test message',
        type: 'error',
      });

      expect(validation.getAttribute('role')).toBe('alert');

      validation.setType('info');

      expect(validation.hasAttribute('role')).toBe(false);
      expect(validation.getAttribute('aria-live')).toBe('polite');

      validation.setType('error');

      expect(validation.getAttribute('role')).toBe('alert');
      expect(validation.hasAttribute('aria-live')).toBe(false);
    });

    it('can be linked via aria-describedby', () => {
      const validation = createFormValidation({
        message: 'Error message',
        id: 'my-validation',
      });

      const input = document.createElement('input');
      input.setAttribute('aria-describedby', validation.id);

      expect(input.getAttribute('aria-describedby')).toBe('my-validation');
    });
  });

  // Cleanup
  afterEach(() => {
    document.body.innerHTML = '';
  });
});
