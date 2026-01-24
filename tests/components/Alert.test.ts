/**
 * Alert Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAlert } from '../../src/components/Alert';
import type { AlertType } from '../../src/components/Alert';

describe('Alert', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('creates an alert element', () => {
      const alert = createAlert({ message: 'Test message' });
      expect(alert.element).toBeInstanceOf(HTMLElement);
      expect(alert.element.classList.contains('dos-alert')).toBe(true);
    });

    it('renders with string message', () => {
      const alert = createAlert({ message: 'Test message' });
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.textContent).toBe('Test message');
    });

    it('renders with element message', () => {
      const msgElement = document.createElement('strong');
      msgElement.textContent = 'Bold message';
      const alert = createAlert({ message: msgElement });
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.querySelector('strong')?.textContent).toBe('Bold message');
    });

    it('renders with title', () => {
      const alert = createAlert({ message: 'Test', title: 'Alert Title' });
      const titleEl = alert.element.querySelector('.dos-alert__title');
      expect(titleEl?.textContent).toBe('Alert Title');
    });

    it('renders without title when not provided', () => {
      const alert = createAlert({ message: 'Test' });
      const titleEl = alert.element.querySelector('.dos-alert__title');
      expect(titleEl).toBeNull();
    });

    it('renders icon by default', () => {
      const alert = createAlert({ message: 'Test' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl).not.toBeNull();
    });

    it('renders without icon when icon is false', () => {
      const alert = createAlert({ message: 'Test', icon: false });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl).toBeNull();
    });

    it('renders custom icon string', () => {
      const alert = createAlert({ message: 'Test', icon: '?' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('?');
    });

    it('applies custom className', () => {
      const alert = createAlert({ message: 'Test', className: 'custom-class' });
      expect(alert.element.classList.contains('custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const alert = createAlert({ message: 'Test', id: 'my-alert' });
      expect(alert.element.id).toBe('my-alert');
    });
  });

  describe('alert types', () => {
    it('defaults to info type', () => {
      const alert = createAlert({ message: 'Test' });
      expect(alert.element.classList.contains('dos-alert--info')).toBe(true);
    });

    it('applies info type', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      expect(alert.element.classList.contains('dos-alert--info')).toBe(true);
    });

    it('applies success type', () => {
      const alert = createAlert({ message: 'Test', type: 'success' });
      expect(alert.element.classList.contains('dos-alert--success')).toBe(true);
    });

    it('applies warning type', () => {
      const alert = createAlert({ message: 'Test', type: 'warning' });
      expect(alert.element.classList.contains('dos-alert--warning')).toBe(true);
    });

    it('applies error type', () => {
      const alert = createAlert({ message: 'Test', type: 'error' });
      expect(alert.element.classList.contains('dos-alert--error')).toBe(true);
    });

    it('shows info icon for info type', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('i');
    });

    it('shows success icon for success type', () => {
      const alert = createAlert({ message: 'Test', type: 'success' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('✓');
    });

    it('shows warning icon for warning type', () => {
      const alert = createAlert({ message: 'Test', type: 'warning' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('!');
    });

    it('shows error icon for error type', () => {
      const alert = createAlert({ message: 'Test', type: 'error' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('✗');
    });
  });

  describe('dismissible behavior', () => {
    it('shows dismiss button when dismissible is true', () => {
      const alert = createAlert({ message: 'Test', dismissible: true });
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss');
      expect(dismissBtn).not.toBeNull();
    });

    it('hides dismiss button when dismissible is false', () => {
      const alert = createAlert({ message: 'Test', dismissible: false });
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss');
      expect(dismissBtn).toBeNull();
    });

    it('dismisses when button is clicked', () => {
      const alert = createAlert({ message: 'Test', dismissible: true });
      container.appendChild(alert.element);
      
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss') as HTMLButtonElement;
      dismissBtn.click();
      
      expect(alert.element.classList.contains('dos-alert--hidden')).toBe(true);
    });

    it('calls onDismiss callback when dismissed', () => {
      const onDismiss = vi.fn();
      const alert = createAlert({ message: 'Test', dismissible: true, onDismiss });
      container.appendChild(alert.element);
      
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss') as HTMLButtonElement;
      dismissBtn.click();
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('dismiss() method hides the alert', () => {
      const alert = createAlert({ message: 'Test', dismissible: true });
      container.appendChild(alert.element);
      
      alert.dismiss();
      
      expect(alert.element.classList.contains('dos-alert--hidden')).toBe(true);
    });

    it('dismiss() calls onDismiss callback', () => {
      const onDismiss = vi.fn();
      const alert = createAlert({ message: 'Test', dismissible: true, onDismiss });
      
      alert.dismiss();
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('dismiss() does not call onDismiss twice', () => {
      const onDismiss = vi.fn();
      const alert = createAlert({ message: 'Test', dismissible: true, onDismiss });
      
      alert.dismiss();
      alert.dismiss();
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('instance methods', () => {
    it('setMessage updates string message', () => {
      const alert = createAlert({ message: 'Original' });
      
      alert.setMessage('Updated');
      
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.textContent).toBe('Updated');
    });

    it('setMessage updates element message', () => {
      const alert = createAlert({ message: 'Original' });
      
      const newMsg = document.createElement('em');
      newMsg.textContent = 'Italic message';
      alert.setMessage(newMsg);
      
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.querySelector('em')?.textContent).toBe('Italic message');
    });

    it('setType updates the alert type', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      
      alert.setType('error');
      
      expect(alert.element.classList.contains('dos-alert--error')).toBe(true);
      expect(alert.element.classList.contains('dos-alert--info')).toBe(false);
    });

    it('setType updates the icon', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      
      alert.setType('success');
      
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.textContent).toBe('✓');
    });

    it('setType updates ARIA role', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      expect(alert.element.getAttribute('role')).toBe('status');
      
      alert.setType('error');
      expect(alert.element.getAttribute('role')).toBe('alert');
    });

    it('destroy removes element from DOM', () => {
      const alert = createAlert({ message: 'Test' });
      container.appendChild(alert.element);
      
      alert.destroy();
      
      expect(container.contains(alert.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="status" for info type', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      expect(alert.element.getAttribute('role')).toBe('status');
    });

    it('has role="status" for success type', () => {
      const alert = createAlert({ message: 'Test', type: 'success' });
      expect(alert.element.getAttribute('role')).toBe('status');
    });

    it('has role="alert" for warning type', () => {
      const alert = createAlert({ message: 'Test', type: 'warning' });
      expect(alert.element.getAttribute('role')).toBe('alert');
    });

    it('has role="alert" for error type', () => {
      const alert = createAlert({ message: 'Test', type: 'error' });
      expect(alert.element.getAttribute('role')).toBe('alert');
    });

    it('has aria-live="polite" for info type', () => {
      const alert = createAlert({ message: 'Test', type: 'info' });
      expect(alert.element.getAttribute('aria-live')).toBe('polite');
    });

    it('has aria-live="assertive" for error type', () => {
      const alert = createAlert({ message: 'Test', type: 'error' });
      expect(alert.element.getAttribute('aria-live')).toBe('assertive');
    });

    it('icon has aria-hidden="true"', () => {
      const alert = createAlert({ message: 'Test' });
      const iconEl = alert.element.querySelector('.dos-alert__icon');
      expect(iconEl?.getAttribute('aria-hidden')).toBe('true');
    });

    it('dismiss button has aria-label', () => {
      const alert = createAlert({ message: 'Test', dismissible: true });
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss');
      expect(dismissBtn?.getAttribute('aria-label')).toBe('Dismiss alert');
    });

    it('dismiss button is keyboard accessible', () => {
      const onDismiss = vi.fn();
      const alert = createAlert({ message: 'Test', dismissible: true, onDismiss });
      container.appendChild(alert.element);
      
      const dismissBtn = alert.element.querySelector('.dos-alert__dismiss') as HTMLButtonElement;
      dismissBtn.focus();
      dismissBtn.click();
      
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles empty message', () => {
      const alert = createAlert({ message: '' });
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.textContent).toBe('');
    });

    it('handles very long message', () => {
      const longMessage = 'A'.repeat(1000);
      const alert = createAlert({ message: longMessage });
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.textContent).toBe(longMessage);
    });

    it('handles special characters in message', () => {
      const alert = createAlert({ message: '<script>alert("xss")</script>' });
      const messageEl = alert.element.querySelector('.dos-alert__message');
      expect(messageEl?.textContent).toBe('<script>alert("xss")</script>');
      expect(messageEl?.querySelector('script')).toBeNull();
    });
  });
});
