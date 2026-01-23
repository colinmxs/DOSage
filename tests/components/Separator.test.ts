/**
 * Separator Component Tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createSeparator } from '../../src/components/Separator';

describe('Separator', () => {
  let separator: HTMLElement | null = null;

  afterEach(() => {
    if (separator && separator.parentNode) {
      separator.remove();
    }
    separator = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      separator = createSeparator();

      expect(separator).toBeInstanceOf(HTMLElement);
      expect(separator.tagName).toBe('DIV');
      expect(separator.classList.contains('dos-separator')).toBe(true);
    });

    it('is hidden by default', () => {
      separator = createSeparator();

      expect(separator.classList.contains('dos-separator--hidden')).toBe(true);
    });

    it('applies custom className', () => {
      separator = createSeparator({ className: 'my-separator' });

      expect(separator.classList.contains('dos-separator')).toBe(true);
      expect(separator.classList.contains('my-separator')).toBe(true);
    });

    it('applies custom id', () => {
      separator = createSeparator({ id: 'my-separator' });

      expect(separator.id).toBe('my-separator');
    });
  });

  describe('visibility', () => {
    it('is hidden when visible=false', () => {
      separator = createSeparator({ visible: false });

      expect(separator.classList.contains('dos-separator--hidden')).toBe(true);
      expect(separator.classList.contains('dos-separator--visible')).toBe(false);
    });

    it('is visible when visible=true', () => {
      separator = createSeparator({ visible: true });

      expect(separator.classList.contains('dos-separator--visible')).toBe(true);
      expect(separator.classList.contains('dos-separator--hidden')).toBe(false);
    });
  });

  describe('spacing', () => {
    it('applies default spacing (md)', () => {
      separator = createSeparator();

      expect(separator.classList.contains('dos-separator--spacing-md')).toBe(true);
    });

    it('applies preset spacing values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        separator = createSeparator({ spacing: preset });
        expect(separator.classList.contains(`dos-separator--spacing-${preset}`)).toBe(true);
      });
    });

    it('applies numeric spacing as inline style', () => {
      separator = createSeparator({ spacing: 32 });

      expect(separator.style.height).toBe('32px');
      expect(separator.style.marginTop).toBe('32px');
      expect(separator.style.marginBottom).toBe('32px');
    });

    it('applies string spacing as inline style', () => {
      separator = createSeparator({ spacing: '2rem' });

      expect(separator.style.height).toBe('2rem');
      expect(separator.style.marginTop).toBe('2rem');
      expect(separator.style.marginBottom).toBe('2rem');
    });
  });

  describe('accessibility', () => {
    it('has role separator when visible', () => {
      separator = createSeparator({ visible: true });

      expect(separator.getAttribute('role')).toBe('separator');
    });

    it('is aria-hidden when not visible', () => {
      separator = createSeparator({ visible: false });

      expect(separator.getAttribute('aria-hidden')).toBe('true');
    });

    it('no aria-hidden when visible', () => {
      separator = createSeparator({ visible: true });

      expect(separator.getAttribute('aria-hidden')).toBeNull();
    });
  });
});
