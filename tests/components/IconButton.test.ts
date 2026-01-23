/**
 * IconButton Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createIconButton,
  setIconButtonIcon,
  setIconButtonDisabled,
} from '../../src/components/IconButton';

describe('IconButton', () => {
  let button: HTMLButtonElement | null = null;

  afterEach(() => {
    if (button && button.parentNode) {
      button.remove();
    }
    button = null;
  });

  describe('rendering', () => {
    it('renders with required props', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button.tagName).toBe('BUTTON');
    });

    it('displays the icon', () => {
      button = createIconButton({ icon: '►', label: 'Play' });
      const icon = button.querySelector('.dos-icon-button__icon');

      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe('►');
    });

    it('applies default classes', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button.classList.contains('dos-icon-button')).toBe(true);
      expect(button.classList.contains('dos-icon-button--secondary')).toBe(true);
      expect(button.classList.contains('dos-icon-button--medium')).toBe(true);
    });

    it('applies custom className', () => {
      button = createIconButton({ icon: 'X', label: 'Close', className: 'my-icon-btn' });

      expect(button.classList.contains('dos-icon-button')).toBe(true);
      expect(button.classList.contains('my-icon-btn')).toBe(true);
    });

    it('applies custom id', () => {
      button = createIconButton({ icon: 'X', label: 'Close', id: 'close-btn' });

      expect(button.id).toBe('close-btn');
    });

    it('has button type', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button.type).toBe('button');
    });
  });

  describe('variants', () => {
    it('applies primary variant', () => {
      button = createIconButton({ icon: 'X', label: 'Close', variant: 'primary' });

      expect(button.classList.contains('dos-icon-button--primary')).toBe(true);
    });

    it('applies secondary variant (default)', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button.classList.contains('dos-icon-button--secondary')).toBe(true);
    });

    it('applies danger variant', () => {
      button = createIconButton({ icon: 'X', label: 'Close', variant: 'danger' });

      expect(button.classList.contains('dos-icon-button--danger')).toBe(true);
    });

    it('applies ghost variant', () => {
      button = createIconButton({ icon: 'X', label: 'Close', variant: 'ghost' });

      expect(button.classList.contains('dos-icon-button--ghost')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      button = createIconButton({ icon: 'X', label: 'Close', size: 'small' });

      expect(button.classList.contains('dos-icon-button--small')).toBe(true);
    });

    it('applies medium size (default)', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button.classList.contains('dos-icon-button--medium')).toBe(true);
    });

    it('applies large size', () => {
      button = createIconButton({ icon: 'X', label: 'Close', size: 'large' });

      expect(button.classList.contains('dos-icon-button--large')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class when disabled', () => {
      button = createIconButton({ icon: 'X', label: 'Close', disabled: true });

      expect(button.classList.contains('dos-icon-button--disabled')).toBe(true);
    });

    it('sets disabled attribute', () => {
      button = createIconButton({ icon: 'X', label: 'Close', disabled: true });

      expect(button.disabled).toBe(true);
    });

    it('sets aria-disabled', () => {
      button = createIconButton({ icon: 'X', label: 'Close', disabled: true });

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not call onClick when disabled', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', disabled: true, onClick });

      button.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('click handling', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', onClick });

      button.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes MouseEvent to onClick', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', onClick });

      button.click();

      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('keyboard navigation', () => {
    it('activates on Enter key', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Space key', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate when disabled', () => {
      const onClick = vi.fn();
      button = createIconButton({ icon: 'X', label: 'Close', disabled: true, onClick });

      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      );

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('requires aria-label (provided via label prop)', () => {
      button = createIconButton({ icon: 'X', label: 'Close window' });

      expect(button.getAttribute('aria-label')).toBe('Close window');
    });

    it('hides icon from screen readers', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });
      const icon = button.querySelector('.dos-icon-button__icon');

      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('is focusable', () => {
      button = createIconButton({ icon: 'X', label: 'Close' });

      expect(button.tabIndex).toBe(0);
    });
  });

  describe('helper functions', () => {
    describe('setIconButtonIcon', () => {
      it('updates the icon', () => {
        button = createIconButton({ icon: 'X', label: 'Close' });

        setIconButtonIcon(button, '▲');

        const icon = button.querySelector('.dos-icon-button__icon');
        expect(icon?.textContent).toBe('▲');
      });
    });

    describe('setIconButtonDisabled', () => {
      it('enables a disabled button', () => {
        button = createIconButton({ icon: 'X', label: 'Close', disabled: true });

        setIconButtonDisabled(button, false);

        expect(button.disabled).toBe(false);
        expect(button.classList.contains('dos-icon-button--disabled')).toBe(false);
      });

      it('disables an enabled button', () => {
        button = createIconButton({ icon: 'X', label: 'Close' });

        setIconButtonDisabled(button, true);

        expect(button.disabled).toBe(true);
        expect(button.classList.contains('dos-icon-button--disabled')).toBe(true);
      });
    });
  });

  describe('common icons', () => {
    const icons = [
      { icon: 'X', label: 'Close' },
      { icon: '?', label: 'Help' },
      { icon: 'i', label: 'Info' },
      { icon: '▲', label: 'Move up' },
      { icon: '▼', label: 'Move down' },
      { icon: '►', label: 'Play' },
      { icon: '◄', label: 'Previous' },
      { icon: '■', label: 'Stop' },
    ];

    icons.forEach(({ icon, label }) => {
      it(`renders ${icon} icon correctly`, () => {
        button = createIconButton({ icon, label });
        const iconEl = button.querySelector('.dos-icon-button__icon');

        expect(iconEl?.textContent).toBe(icon);
      });
    });
  });
});
