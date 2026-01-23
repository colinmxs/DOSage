/**
 * Button Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createButton,
  setButtonLoading,
  setButtonDisabled,
  setButtonLabel,
} from '../../src/components/Button';

describe('Button', () => {
  let button: HTMLButtonElement | null = null;

  afterEach(() => {
    if (button && button.parentNode) {
      button.remove();
    }
    button = null;
    vi.clearAllTimers();
  });

  describe('rendering', () => {
    it('renders with required label', () => {
      button = createButton({ label: 'Click Me' });

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toContain('Click Me');
    });

    it('renders with default classes', () => {
      button = createButton({ label: 'Test' });

      expect(button.classList.contains('dos-button')).toBe(true);
      expect(button.classList.contains('dos-button--secondary')).toBe(true);
      expect(button.classList.contains('dos-button--medium')).toBe(true);
    });

    it('applies custom className', () => {
      button = createButton({ label: 'Test', className: 'my-button' });

      expect(button.classList.contains('dos-button')).toBe(true);
      expect(button.classList.contains('my-button')).toBe(true);
    });

    it('applies custom id', () => {
      button = createButton({ label: 'Test', id: 'my-button' });

      expect(button.id).toBe('my-button');
    });

    it('sets correct button type', () => {
      button = createButton({ label: 'Submit', type: 'submit' });
      expect(button.type).toBe('submit');

      button = createButton({ label: 'Reset', type: 'reset' });
      expect(button.type).toBe('reset');

      button = createButton({ label: 'Button', type: 'button' });
      expect(button.type).toBe('button');
    });

    it('defaults to button type', () => {
      button = createButton({ label: 'Test' });

      expect(button.type).toBe('button');
    });
  });

  describe('variants', () => {
    it('applies primary variant', () => {
      button = createButton({ label: 'Test', variant: 'primary' });

      expect(button.classList.contains('dos-button--primary')).toBe(true);
    });

    it('applies secondary variant (default)', () => {
      button = createButton({ label: 'Test', variant: 'secondary' });

      expect(button.classList.contains('dos-button--secondary')).toBe(true);
    });

    it('applies danger variant', () => {
      button = createButton({ label: 'Test', variant: 'danger' });

      expect(button.classList.contains('dos-button--danger')).toBe(true);
    });

    it('applies ghost variant', () => {
      button = createButton({ label: 'Test', variant: 'ghost' });

      expect(button.classList.contains('dos-button--ghost')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      button = createButton({ label: 'Test', size: 'small' });

      expect(button.classList.contains('dos-button--small')).toBe(true);
    });

    it('applies medium size (default)', () => {
      button = createButton({ label: 'Test', size: 'medium' });

      expect(button.classList.contains('dos-button--medium')).toBe(true);
    });

    it('applies large size', () => {
      button = createButton({ label: 'Test', size: 'large' });

      expect(button.classList.contains('dos-button--large')).toBe(true);
    });
  });

  describe('icon', () => {
    it('renders icon when provided', () => {
      button = createButton({ label: 'Save', icon: '►' });
      const icon = button.querySelector('.dos-button__icon');

      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe('►');
    });

    it('positions icon on left by default', () => {
      button = createButton({ label: 'Save', icon: '►' });
      const icon = button.querySelector('.dos-button__icon');

      expect(icon?.classList.contains('dos-button__icon--left')).toBe(true);
    });

    it('positions icon on right when specified', () => {
      button = createButton({ label: 'Next', icon: '►', iconPosition: 'right' });
      const icon = button.querySelector('.dos-button__icon');

      expect(icon?.classList.contains('dos-button__icon--right')).toBe(true);
    });

    it('hides icon from screen readers', () => {
      button = createButton({ label: 'Save', icon: '►' });
      const icon = button.querySelector('.dos-button__icon');

      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('full width', () => {
    it('applies full-width class when enabled', () => {
      button = createButton({ label: 'Test', fullWidth: true });

      expect(button.classList.contains('dos-button--full-width')).toBe(true);
    });

    it('does not apply full-width class by default', () => {
      button = createButton({ label: 'Test' });

      expect(button.classList.contains('dos-button--full-width')).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class when disabled', () => {
      button = createButton({ label: 'Test', disabled: true });

      expect(button.classList.contains('dos-button--disabled')).toBe(true);
    });

    it('sets disabled attribute when disabled', () => {
      button = createButton({ label: 'Test', disabled: true });

      expect(button.disabled).toBe(true);
    });

    it('sets aria-disabled when disabled', () => {
      button = createButton({ label: 'Test', disabled: true });

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not call onClick when disabled', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', disabled: true, onClick });

      button.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('applies loading class when loading', () => {
      button = createButton({ label: 'Test', loading: true });

      expect(button.classList.contains('dos-button--loading')).toBe(true);
    });

    it('sets aria-busy when loading', () => {
      button = createButton({ label: 'Test', loading: true });

      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('shows spinner when loading', () => {
      button = createButton({ label: 'Test', loading: true });
      const spinner = button.querySelector('.dos-button__spinner');

      expect(spinner).not.toBeNull();
    });

    it('hides icon when loading', () => {
      button = createButton({ label: 'Test', icon: '►', loading: true });
      const icon = button.querySelector('.dos-button__icon');

      expect(icon).toBeNull();
    });
  });

  describe('click handling', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', onClick });

      button.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', loading: true, onClick });

      button.click();

      expect(onClick).not.toHaveBeenCalled();
    });

    it('passes MouseEvent to onClick', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', onClick });

      button.click();

      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('keyboard navigation', () => {
    it('activates on Enter key', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Space key', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate on other keys', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true })
      );

      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not activate when disabled', () => {
      const onClick = vi.fn();
      button = createButton({ label: 'Test', disabled: true, onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      );

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('is focusable by default', () => {
      button = createButton({ label: 'Test' });

      // Buttons are focusable by default, no tabindex needed
      expect(button.tabIndex).toBe(0);
    });

    it('sets aria-label when provided', () => {
      button = createButton({ label: 'X', ariaLabel: 'Close dialog' });

      expect(button.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('has label element for text', () => {
      button = createButton({ label: 'Click Me' });
      const labelEl = button.querySelector('.dos-button__label');

      expect(labelEl).not.toBeNull();
      expect(labelEl?.textContent).toBe('Click Me');
    });
  });

  describe('helper functions', () => {
    describe('setButtonLoading', () => {
      it('adds loading state', () => {
        button = createButton({ label: 'Test' });

        setButtonLoading(button, true);

        expect(button.classList.contains('dos-button--loading')).toBe(true);
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.querySelector('.dos-button__spinner')).not.toBeNull();
      });

      it('removes loading state', () => {
        button = createButton({ label: 'Test', loading: true });

        setButtonLoading(button, false);

        expect(button.classList.contains('dos-button--loading')).toBe(false);
        expect(button.getAttribute('aria-busy')).toBeNull();
        expect(button.querySelector('.dos-button__spinner')).toBeNull();
      });
    });

    describe('setButtonDisabled', () => {
      it('adds disabled state', () => {
        button = createButton({ label: 'Test' });

        setButtonDisabled(button, true);

        expect(button.classList.contains('dos-button--disabled')).toBe(true);
        expect(button.disabled).toBe(true);
        expect(button.getAttribute('aria-disabled')).toBe('true');
      });

      it('removes disabled state', () => {
        button = createButton({ label: 'Test', disabled: true });

        setButtonDisabled(button, false);

        expect(button.classList.contains('dos-button--disabled')).toBe(false);
        expect(button.disabled).toBe(false);
        expect(button.getAttribute('aria-disabled')).toBeNull();
      });
    });

    describe('setButtonLabel', () => {
      it('updates label text', () => {
        button = createButton({ label: 'Old Label' });

        setButtonLabel(button, 'New Label');

        const labelEl = button.querySelector('.dos-button__label');
        expect(labelEl?.textContent).toBe('New Label');
      });
    });
  });
});
