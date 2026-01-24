/**
 * Textarea Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTextarea,
  setTextareaValue,
  getTextareaValue,
  setTextareaError,
  setTextareaDisabled,
} from '../../src/components/Textarea';
import type { TextareaElement } from '../../src/components/Textarea';

describe('Textarea', () => {
  let textarea: TextareaElement | null = null;

  afterEach(() => {
    if (textarea && textarea.parentNode) {
      textarea.remove();
    }
    textarea = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      textarea = createTextarea({});

      expect(textarea).toBeInstanceOf(HTMLDivElement);
      expect(textarea.classList.contains('dos-textarea')).toBe(true);

      const field = textarea.querySelector('textarea');
      expect(field).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('renders with initial value', () => {
      textarea = createTextarea({ value: 'Hello World' });

      const field = textarea.getTextarea();
      expect(field.value).toBe('Hello World');
    });

    it('renders with placeholder', () => {
      textarea = createTextarea({ placeholder: 'Enter text...' });

      const field = textarea.getTextarea();
      expect(field.placeholder).toBe('Enter text...');
    });

    it('renders with label', () => {
      textarea = createTextarea({ label: 'Description' });

      const label = textarea.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Description');
    });

    it('associates label with textarea', () => {
      textarea = createTextarea({ label: 'Comments' });

      const label = textarea.querySelector('label');
      const field = textarea.getTextarea();

      expect(label?.htmlFor).toBe(field.id);
    });

    it('renders required indicator when required', () => {
      textarea = createTextarea({ label: 'Required Field', required: true });

      const requiredIndicator = textarea.querySelector('.dos-textarea__required');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('*');
    });

    it('applies custom className', () => {
      textarea = createTextarea({ className: 'my-textarea' });

      expect(textarea.classList.contains('dos-textarea')).toBe(true);
      expect(textarea.classList.contains('my-textarea')).toBe(true);
    });

    it('applies custom id', () => {
      textarea = createTextarea({ id: 'my-textarea' });

      const field = textarea.getTextarea();
      expect(field.id).toBe('my-textarea');
    });

    it('sets name attribute', () => {
      textarea = createTextarea({ name: 'message' });

      expect(textarea.getTextarea().name).toBe('message');
    });

    it('sets rows attribute', () => {
      textarea = createTextarea({ rows: 10 });

      expect(textarea.getTextarea().rows).toBe(10);
    });

    it('sets cols attribute', () => {
      textarea = createTextarea({ cols: 50 });

      expect(textarea.getTextarea().cols).toBe(50);
    });

    it('applies custom width', () => {
      textarea = createTextarea({ width: 400 });
      expect(textarea.style.width).toBe('400px');

      textarea = createTextarea({ width: '80%' });
      expect(textarea.style.width).toBe('80%');
    });
  });

  describe('resize behavior', () => {
    it('defaults to vertical resize', () => {
      textarea = createTextarea({});

      expect(textarea.classList.contains('dos-textarea--resize-vertical')).toBe(true);
    });

    it('applies none resize class', () => {
      textarea = createTextarea({ resizable: 'none' });

      expect(textarea.classList.contains('dos-textarea--resize-none')).toBe(true);
    });

    it('applies horizontal resize class', () => {
      textarea = createTextarea({ resizable: 'horizontal' });

      expect(textarea.classList.contains('dos-textarea--resize-horizontal')).toBe(true);
    });

    it('applies both resize class', () => {
      textarea = createTextarea({ resizable: 'both' });

      expect(textarea.classList.contains('dos-textarea--resize-both')).toBe(true);
    });

    it('applies none resize when false', () => {
      textarea = createTextarea({ resizable: false });

      expect(textarea.classList.contains('dos-textarea--resize-none')).toBe(true);
    });

    it('applies both resize when true', () => {
      textarea = createTextarea({ resizable: true });

      expect(textarea.classList.contains('dos-textarea--resize-both')).toBe(true);
    });
  });

  describe('character count', () => {
    it('shows character count when enabled', () => {
      textarea = createTextarea({ showCount: true, value: 'Hello' });

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement).toBeTruthy();
      expect(countElement?.textContent).toContain('5');
    });

    it('shows count with max length format', () => {
      textarea = createTextarea({ showCount: true, maxLength: 100, value: 'Test' });

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.textContent).toBe('4/100');
    });

    it('updates count on input', () => {
      textarea = createTextarea({ showCount: true, maxLength: 100 });

      const field = textarea.getTextarea();
      field.value = 'Updated text';
      field.dispatchEvent(new Event('input', { bubbles: true }));

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.textContent).toBe('12/100');
    });

    it('adds limit class when near max', () => {
      textarea = createTextarea({ showCount: true, maxLength: 10, value: '123456789' });

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.classList.contains('dos-textarea__count--limit')).toBe(true);
    });

    it('adds exceeded class when over max', () => {
      textarea = createTextarea({ showCount: true, maxLength: 5, value: '123456789' });

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.classList.contains('dos-textarea__count--exceeded')).toBe(true);
    });
  });

  describe('states', () => {
    it('renders disabled state', () => {
      textarea = createTextarea({ disabled: true });

      expect(textarea.classList.contains('dos-textarea--disabled')).toBe(true);
      expect(textarea.getTextarea().disabled).toBe(true);
    });

    it('renders readonly state', () => {
      textarea = createTextarea({ readonly: true });

      expect(textarea.classList.contains('dos-textarea--readonly')).toBe(true);
      expect(textarea.getTextarea().readOnly).toBe(true);
    });

    it('renders error state with message', () => {
      textarea = createTextarea({ error: 'This field is required' });

      expect(textarea.classList.contains('dos-textarea--error')).toBe(true);

      const errorElement = textarea.querySelector('.dos-textarea__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('This field is required');
    });

    it('renders error state without message', () => {
      textarea = createTextarea({ error: true });

      expect(textarea.classList.contains('dos-textarea--error')).toBe(true);

      const errorElement = textarea.querySelector('.dos-textarea__error');
      expect(errorElement).toBeNull();
    });

    it('disabled label has correct class', () => {
      textarea = createTextarea({ label: 'Test', disabled: true });

      const label = textarea.querySelector('label');
      expect(label?.classList.contains('dos-textarea__label--disabled')).toBe(true);
    });
  });

  describe('validation attributes', () => {
    it('sets maxLength attribute', () => {
      textarea = createTextarea({ maxLength: 500 });

      expect(textarea.getTextarea().maxLength).toBe(500);
    });

    it('sets minLength attribute', () => {
      textarea = createTextarea({ minLength: 10 });

      expect(textarea.getTextarea().minLength).toBe(10);
    });
  });

  describe('events', () => {
    it('calls onChange when textarea changes', () => {
      const handleChange = vi.fn();
      textarea = createTextarea({ onChange: handleChange });

      const field = textarea.getTextarea();
      field.value = 'test value';
      field.dispatchEvent(new Event('input', { bubbles: true }));

      expect(handleChange).toHaveBeenCalledWith('test value', expect.any(Event));
    });

    it('calls onBlur when textarea loses focus', () => {
      const handleBlur = vi.fn();
      textarea = createTextarea({ onBlur: handleBlur });

      const field = textarea.getTextarea();
      field.value = 'blur test';
      field.dispatchEvent(new FocusEvent('blur'));

      expect(handleBlur).toHaveBeenCalledWith('blur test', expect.any(FocusEvent));
    });

    it('calls onFocus when textarea gains focus', () => {
      const handleFocus = vi.fn();
      textarea = createTextarea({ onFocus: handleFocus });

      const field = textarea.getTextarea();
      field.dispatchEvent(new FocusEvent('focus'));

      expect(handleFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('adds focused class on focus', () => {
      textarea = createTextarea({});

      const field = textarea.getTextarea();
      field.dispatchEvent(new FocusEvent('focus'));

      expect(textarea.classList.contains('dos-textarea--focused')).toBe(true);
    });

    it('removes focused class on blur', () => {
      textarea = createTextarea({});

      const field = textarea.getTextarea();
      field.dispatchEvent(new FocusEvent('focus'));
      field.dispatchEvent(new FocusEvent('blur'));

      expect(textarea.classList.contains('dos-textarea--focused')).toBe(false);
    });
  });

  describe('methods', () => {
    it('getValue returns current value', () => {
      textarea = createTextarea({ value: 'initial' });

      expect(textarea.getValue()).toBe('initial');

      textarea.getTextarea().value = 'updated';
      expect(textarea.getValue()).toBe('updated');
    });

    it('setValue updates the textarea value', () => {
      textarea = createTextarea({ value: 'initial' });

      textarea.setValue('new value');

      expect(textarea.getTextarea().value).toBe('new value');
    });

    it('setValue updates character count', () => {
      textarea = createTextarea({ showCount: true, maxLength: 100 });

      textarea.setValue('Updated');

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.textContent).toBe('7/100');
    });

    it('setError updates error state', () => {
      textarea = createTextarea({});

      textarea.setError('An error occurred');

      expect(textarea.classList.contains('dos-textarea--error')).toBe(true);
      const errorElement = textarea.querySelector('.dos-textarea__error');
      expect(errorElement?.textContent).toContain('An error occurred');
    });

    it('setError clears error when passed undefined', () => {
      textarea = createTextarea({ error: 'Initial error' });

      textarea.setError(undefined);

      expect(textarea.classList.contains('dos-textarea--error')).toBe(false);
      const errorElement = textarea.querySelector('.dos-textarea__error');
      expect(errorElement).toBeNull();
    });

    it('setDisabled updates disabled state', () => {
      textarea = createTextarea({});

      textarea.setDisabled(true);

      expect(textarea.classList.contains('dos-textarea--disabled')).toBe(true);
      expect(textarea.getTextarea().disabled).toBe(true);
    });

    it('focusTextarea focuses the textarea element', () => {
      textarea = createTextarea({});
      document.body.appendChild(textarea);

      textarea.focusTextarea();

      expect(document.activeElement).toBe(textarea.getTextarea());
    });

    it('getTextarea returns the underlying textarea element', () => {
      textarea = createTextarea({});

      const field = textarea.getTextarea();

      expect(field).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('helper functions', () => {
    it('setTextareaValue sets the value', () => {
      textarea = createTextarea({});

      setTextareaValue(textarea, 'helper value');

      expect(textarea.getValue()).toBe('helper value');
    });

    it('getTextareaValue gets the value', () => {
      textarea = createTextarea({ value: 'getter test' });

      const value = getTextareaValue(textarea);

      expect(value).toBe('getter test');
    });

    it('setTextareaError sets the error', () => {
      textarea = createTextarea({});

      setTextareaError(textarea, 'Helper error');

      expect(textarea.classList.contains('dos-textarea--error')).toBe(true);
    });

    it('setTextareaDisabled sets disabled state', () => {
      textarea = createTextarea({});

      setTextareaDisabled(textarea, true);

      expect(textarea.getTextarea().disabled).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has aria-required when required', () => {
      textarea = createTextarea({ required: true });

      expect(textarea.getTextarea().getAttribute('aria-required')).toBe('true');
    });

    it('has aria-invalid when error', () => {
      textarea = createTextarea({ error: true });

      expect(textarea.getTextarea().getAttribute('aria-invalid')).toBe('true');
    });

    it('has aria-describedby linking to error message', () => {
      textarea = createTextarea({ id: 'test-textarea', error: 'Error message' });

      const field = textarea.getTextarea();
      const errorElement = textarea.querySelector('.dos-textarea__error');

      expect(field.getAttribute('aria-describedby')).toContain('test-textarea-error');
      expect(errorElement?.id).toBe('test-textarea-error');
    });

    it('has aria-describedby linking to count', () => {
      textarea = createTextarea({ id: 'test-textarea', showCount: true });

      const field = textarea.getTextarea();
      expect(field.getAttribute('aria-describedby')).toContain('test-textarea-count');
    });

    it('error message has role="alert"', () => {
      textarea = createTextarea({ error: 'Alert error' });

      const errorElement = textarea.querySelector('.dos-textarea__error');
      expect(errorElement?.getAttribute('role')).toBe('alert');
    });

    it('count has aria-live', () => {
      textarea = createTextarea({ showCount: true });

      const countElement = textarea.querySelector('.dos-textarea__count');
      expect(countElement?.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('multi-line input', () => {
    it('handles multi-line value', () => {
      const multiLineValue = 'Line 1\nLine 2\nLine 3';
      textarea = createTextarea({ value: multiLineValue });

      expect(textarea.getValue()).toBe(multiLineValue);
    });

    it('preserves whitespace in value', () => {
      const valueWithSpaces = '  Indented\n    More indented';
      textarea = createTextarea({ value: valueWithSpaces });

      expect(textarea.getValue()).toBe(valueWithSpaces);
    });
  });
});
