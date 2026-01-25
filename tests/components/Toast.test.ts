/**
 * Toast Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createToast, createToastContainer, toast } from '../../src/components/Toast';
import type { ToastType } from '../../src/components/Toast';

// Helper function to simulate animation end event
function simulateAnimationEnd(element: HTMLElement): void {
  const event = new Event('animationend', { bubbles: true });
  element.dispatchEvent(event);
}

describe('Toast', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
    toast.destroy();
  });

  describe('createToast', () => {
    describe('rendering', () => {
      it('creates a toast element', () => {
        const t = createToast({ message: 'Test' });
        expect(t.element).toBeInstanceOf(HTMLElement);
        expect(t.element.classList.contains('dos-toast')).toBe(true);
      });

      it('renders message content', () => {
        const t = createToast({ message: 'Hello World' });
        const messageEl = t.element.querySelector('.dos-toast__message');
        expect(messageEl?.textContent).toBe('Hello World');
      });

      it('generates unique ID', () => {
        const t1 = createToast({ message: 'Test 1' });
        const t2 = createToast({ message: 'Test 2' });
        expect(t1.id).not.toBe(t2.id);
      });

      it('uses custom ID if provided', () => {
        const t = createToast({ message: 'Test', id: 'my-toast' });
        expect(t.id).toBe('my-toast');
        expect(t.element.id).toBe('my-toast');
      });

      it('applies custom className', () => {
        const t = createToast({ message: 'Test', className: 'custom-class' });
        expect(t.element.classList.contains('custom-class')).toBe(true);
      });

      it('renders icon', () => {
        const t = createToast({ message: 'Test' });
        const iconEl = t.element.querySelector('.dos-toast__icon');
        expect(iconEl).not.toBeNull();
      });

      it('renders dismiss button when dismissible is true', () => {
        const t = createToast({ message: 'Test', dismissible: true });
        const dismissBtn = t.element.querySelector('.dos-toast__dismiss');
        expect(dismissBtn).not.toBeNull();
      });

      it('hides dismiss button when dismissible is false', () => {
        const t = createToast({ message: 'Test', dismissible: false });
        const dismissBtn = t.element.querySelector('.dos-toast__dismiss');
        expect(dismissBtn).toBeNull();
      });
    });

    describe('toast types', () => {
      const types: ToastType[] = ['info', 'success', 'warning', 'error'];

      types.forEach((type) => {
        it(`applies ${type} type`, () => {
          const t = createToast({ message: 'Test', type });
          expect(t.element.classList.contains(`dos-toast--${type}`)).toBe(true);
        });
      });

      it('defaults to info type', () => {
        const t = createToast({ message: 'Test' });
        expect(t.element.classList.contains('dos-toast--info')).toBe(true);
      });

      it('shows correct icon for each type', () => {
        const icons = { info: 'i', success: '✓', warning: '!', error: '✗' };
        types.forEach((type) => {
          const t = createToast({ message: 'Test', type });
          const iconEl = t.element.querySelector('.dos-toast__icon');
          expect(iconEl?.textContent).toBe(icons[type]);
        });
      });
    });

    describe('auto-dismiss', () => {
      it('auto-dismisses after duration', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: 5000, onDismiss });
        container.appendChild(t.element);

        expect(onDismiss).not.toHaveBeenCalled();
        vi.advanceTimersByTime(5000);
        // Wait for animation
        simulateAnimationEnd(t.element);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });

      it('does not auto-dismiss when duration is 0', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: 0, onDismiss });
        container.appendChild(t.element);

        vi.advanceTimersByTime(10000);
        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('does not auto-dismiss when duration is null', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: null, onDismiss });
        container.appendChild(t.element);

        vi.advanceTimersByTime(10000);
        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('pauses auto-dismiss timer', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: 5000, onDismiss });
        container.appendChild(t.element);

        vi.advanceTimersByTime(3000);
        t.pause();
        vi.advanceTimersByTime(5000);
        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('resumes auto-dismiss timer', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: 5000, onDismiss });
        container.appendChild(t.element);

        vi.advanceTimersByTime(3000);
        t.pause();
        vi.advanceTimersByTime(5000);
        t.resume();
        vi.advanceTimersByTime(2000);
        simulateAnimationEnd(t.element);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('dismiss', () => {
      it('dismisses on button click', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', dismissible: true, onDismiss, duration: 0 });
        container.appendChild(t.element);

        const dismissBtn = t.element.querySelector('.dos-toast__dismiss') as HTMLButtonElement;
        dismissBtn.click();
        simulateAnimationEnd(t.element);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });

      it('dismiss() method triggers callback', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', onDismiss, duration: 0 });
        container.appendChild(t.element);

        t.dismiss();
        simulateAnimationEnd(t.element);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });

      it('adds exiting class on dismiss', () => {
        const t = createToast({ message: 'Test', duration: 0 });
        container.appendChild(t.element);

        t.dismiss();
        expect(t.element.classList.contains('dos-toast--exiting')).toBe(true);
      });

      it('does not call onDismiss twice', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', onDismiss, duration: 0 });
        container.appendChild(t.element);

        t.dismiss();
        t.dismiss();
        simulateAnimationEnd(t.element);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('destroy', () => {
      it('removes element from DOM', () => {
        const t = createToast({ message: 'Test', duration: 0 });
        container.appendChild(t.element);
        expect(container.contains(t.element)).toBe(true);

        t.destroy();
        expect(container.contains(t.element)).toBe(false);
      });

      it('clears auto-dismiss timer', () => {
        const onDismiss = vi.fn();
        const t = createToast({ message: 'Test', duration: 5000, onDismiss });
        container.appendChild(t.element);

        t.destroy();
        vi.advanceTimersByTime(10000);
        expect(onDismiss).not.toHaveBeenCalled();
      });
    });

    describe('setMessage', () => {
      it('updates the toast message', () => {
        const t = createToast({ message: 'Initial message', duration: 0 });
        container.appendChild(t.element);

        t.setMessage('Updated message');
        
        const messageEl = t.element.querySelector('.dos-toast__message');
        expect(messageEl?.textContent).toBe('Updated message');
      });

      it('can update message multiple times', () => {
        const t = createToast({ message: 'First', duration: 0 });
        container.appendChild(t.element);

        t.setMessage('Second');
        t.setMessage('Third');
        
        const messageEl = t.element.querySelector('.dos-toast__message');
        expect(messageEl?.textContent).toBe('Third');
      });
    });

    describe('setType', () => {
      it('updates the toast type class', () => {
        const t = createToast({ message: 'Test', type: 'info', duration: 0 });
        container.appendChild(t.element);
        expect(t.element.classList.contains('dos-toast--info')).toBe(true);

        t.setType('error');
        
        expect(t.element.classList.contains('dos-toast--error')).toBe(true);
        expect(t.element.classList.contains('dos-toast--info')).toBe(false);
      });

      it('updates the icon for each type', () => {
        const t = createToast({ message: 'Test', type: 'info', duration: 0 });
        container.appendChild(t.element);
        const iconEl = t.element.querySelector('.dos-toast__icon') as HTMLElement;

        t.setType('success');
        expect(iconEl.textContent).toBe('✓');

        t.setType('warning');
        expect(iconEl.textContent).toBe('!');

        t.setType('error');
        expect(iconEl.textContent).toBe('✗');

        t.setType('info');
        expect(iconEl.textContent).toBe('i');
      });

      it('updates ARIA role based on type', () => {
        const t = createToast({ message: 'Test', type: 'info', duration: 0 });
        container.appendChild(t.element);
        expect(t.element.getAttribute('role')).toBe('status');

        t.setType('error');
        expect(t.element.getAttribute('role')).toBe('alert');

        t.setType('warning');
        expect(t.element.getAttribute('role')).toBe('alert');

        t.setType('success');
        expect(t.element.getAttribute('role')).toBe('status');
      });

      it('updates aria-live based on type', () => {
        const t = createToast({ message: 'Test', type: 'info', duration: 0 });
        container.appendChild(t.element);
        expect(t.element.getAttribute('aria-live')).toBe('polite');

        t.setType('error');
        expect(t.element.getAttribute('aria-live')).toBe('assertive');

        t.setType('success');
        expect(t.element.getAttribute('aria-live')).toBe('polite');
      });
    });

    describe('accessibility', () => {
      it('has role="status" for info type', () => {
        const t = createToast({ message: 'Test', type: 'info' });
        expect(t.element.getAttribute('role')).toBe('status');
      });

      it('has role="status" for success type', () => {
        const t = createToast({ message: 'Test', type: 'success' });
        expect(t.element.getAttribute('role')).toBe('status');
      });

      it('has role="alert" for warning type', () => {
        const t = createToast({ message: 'Test', type: 'warning' });
        expect(t.element.getAttribute('role')).toBe('alert');
      });

      it('has role="alert" for error type', () => {
        const t = createToast({ message: 'Test', type: 'error' });
        expect(t.element.getAttribute('role')).toBe('alert');
      });

      it('has aria-live="polite" for info/success', () => {
        const t = createToast({ message: 'Test', type: 'info' });
        expect(t.element.getAttribute('aria-live')).toBe('polite');
      });

      it('has aria-live="assertive" for warning/error', () => {
        const t = createToast({ message: 'Test', type: 'error' });
        expect(t.element.getAttribute('aria-live')).toBe('assertive');
      });

      it('has aria-atomic="true"', () => {
        const t = createToast({ message: 'Test' });
        expect(t.element.getAttribute('aria-atomic')).toBe('true');
      });

      it('dismiss button has aria-label', () => {
        const t = createToast({ message: 'Test', dismissible: true });
        const dismissBtn = t.element.querySelector('.dos-toast__dismiss');
        expect(dismissBtn?.getAttribute('aria-label')).toBe('Dismiss notification');
      });

      it('icon has aria-hidden="true"', () => {
        const t = createToast({ message: 'Test' });
        const iconEl = t.element.querySelector('.dos-toast__icon');
        expect(iconEl?.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('createToastContainer', () => {
    describe('rendering', () => {
      it('creates a container element', () => {
        const tc = createToastContainer();
        expect(tc.element).toBeInstanceOf(HTMLElement);
        expect(tc.element.classList.contains('dos-toast-container')).toBe(true);
      });

      it('applies default position', () => {
        const tc = createToastContainer();
        expect(tc.element.classList.contains('dos-toast-container--top-right')).toBe(true);
      });

      it('applies custom position', () => {
        const tc = createToastContainer({ position: 'bottom-left' });
        expect(tc.element.classList.contains('dos-toast-container--bottom-left')).toBe(true);
      });

      it('applies custom className', () => {
        const tc = createToastContainer({ className: 'custom-class' });
        expect(tc.element.classList.contains('custom-class')).toBe(true);
      });

      it('applies custom id', () => {
        const tc = createToastContainer({ id: 'my-container' });
        expect(tc.element.id).toBe('my-container');
      });
    });

    describe('add', () => {
      it('adds toast to container', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        const t = tc.add({ message: 'Test' });
        expect(tc.element.contains(t.element)).toBe(true);
      });

      it('tracks added toasts', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        tc.add({ message: 'Test 1' });
        tc.add({ message: 'Test 2' });
        expect(tc.getToasts()).toHaveLength(2);
      });

      it('removes toast from tracking when dismissed', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        const t = tc.add({ message: 'Test', duration: 0 });
        expect(tc.getToasts()).toHaveLength(1);

        t.dismiss();
        simulateAnimationEnd(t.element);
        expect(tc.getToasts()).toHaveLength(0);
      });

      it('respects maxToasts limit', () => {
        const tc = createToastContainer({ maxToasts: 3 });
        container.appendChild(tc.element);

        tc.add({ message: 'Toast 1', duration: 0 });
        tc.add({ message: 'Toast 2', duration: 0 });
        tc.add({ message: 'Toast 3', duration: 0 });

        // Adding 4th should remove the first
        tc.add({ message: 'Toast 4', duration: 0 });
        // The oldest will be in exiting state

        expect(tc.getToasts()).toHaveLength(3);
      });
    });

    describe('remove', () => {
      it('removes toast by ID', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        const t = tc.add({ message: 'Test', id: 'test-toast', duration: 0 });
        tc.remove('test-toast');
        simulateAnimationEnd(t.element);

        expect(tc.getToasts()).toHaveLength(0);
      });

      it('does nothing for unknown ID', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        tc.add({ message: 'Test', duration: 0 });
        tc.remove('unknown-id');

        expect(tc.getToasts()).toHaveLength(1);
      });
    });

    describe('clear', () => {
      it('clears all toasts', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        const t1 = tc.add({ message: 'Toast 1', duration: 0 });
        const t2 = tc.add({ message: 'Toast 2', duration: 0 });
        tc.clear();

        simulateAnimationEnd(t1.element);
        simulateAnimationEnd(t2.element);

        expect(tc.getToasts()).toHaveLength(0);
      });
    });

    describe('destroy', () => {
      it('removes container from DOM', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        tc.destroy();
        expect(container.contains(tc.element)).toBe(false);
      });

      it('clears all toasts before destroying', () => {
        const tc = createToastContainer();
        container.appendChild(tc.element);

        const t = tc.add({ message: 'Test', duration: 0 });
        tc.destroy();

        // After destroy, toasts should be in dismissed state
        // The clear() calls dismiss() which initiates the animation
        expect(t.element.classList.contains('dos-toast--exiting')).toBe(true);
      });
    });

    describe('accessibility', () => {
      it('has aria-label', () => {
        const tc = createToastContainer();
        expect(tc.element.getAttribute('aria-label')).toBe('Notifications');
      });

      it('has aria-live="polite"', () => {
        const tc = createToastContainer();
        expect(tc.element.getAttribute('aria-live')).toBe('polite');
      });
    });
  });

  describe('toast convenience object', () => {
    it('creates default container on first use', () => {
      toast.info('Test');
      expect(document.querySelector('.dos-toast-container')).not.toBeNull();
    });

    it('toast.info shows info toast', () => {
      const t = toast.info('Info message');
      expect(t.element.classList.contains('dos-toast--info')).toBe(true);
    });

    it('toast.success shows success toast', () => {
      const t = toast.success('Success message');
      expect(t.element.classList.contains('dos-toast--success')).toBe(true);
    });

    it('toast.warning shows warning toast', () => {
      const t = toast.warning('Warning message');
      expect(t.element.classList.contains('dos-toast--warning')).toBe(true);
    });

    it('toast.error shows error toast', () => {
      const t = toast.error('Error message');
      expect(t.element.classList.contains('dos-toast--error')).toBe(true);
    });

    it('toast.show accepts full props', () => {
      const t = toast.show({ message: 'Custom', type: 'success', duration: 0 });
      expect(t.element.classList.contains('dos-toast--success')).toBe(true);
    });

    it('toast.clear removes all toasts', () => {
      const t1 = toast.info('Test 1');
      const t2 = toast.info('Test 2');
      toast.clear();

      // Trigger animation ends
      simulateAnimationEnd(t1.element);
      simulateAnimationEnd(t2.element);

      expect(toast.getContainer().getToasts()).toHaveLength(0);
    });

    it('toast.destroy removes the container', () => {
      toast.info('Test');
      toast.destroy();
      expect(document.querySelector('.dos-toast-container')).toBeNull();
    });
  });
});
