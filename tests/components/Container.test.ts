/**
 * Container Component Tests
 */

import { describe, it, expect, beforeEach as _beforeEach, afterEach } from 'vitest';
import { createContainer } from '../../src/components/Container';

describe('Container', () => {
  let container: HTMLElement | null = null;

  afterEach(() => {
    if (container && container.parentNode) {
      container.remove();
    }
    container = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      container = createContainer();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.tagName).toBe('DIV');
      expect(container.classList.contains('dos-container')).toBe(true);
    });

    it('renders with custom tag', () => {
      container = createContainer({ as: 'section' });

      expect(container.tagName).toBe('SECTION');
    });

    it('applies custom className', () => {
      container = createContainer({ className: 'my-class' });

      expect(container.classList.contains('dos-container')).toBe(true);
      expect(container.classList.contains('my-class')).toBe(true);
    });

    it('applies custom id', () => {
      container = createContainer({ id: 'my-container' });

      expect(container.id).toBe('my-container');
    });
  });

  describe('padding', () => {
    it('applies default padding (md)', () => {
      container = createContainer();

      expect(container.classList.contains('dos-container--padding-md')).toBe(true);
    });

    it('applies preset padding values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        container = createContainer({ padding: preset });
        expect(container.classList.contains(`dos-container--padding-${preset}`)).toBe(true);
      });
    });

    it('applies numeric padding as inline style', () => {
      container = createContainer({ padding: 20 });

      expect(container.style.padding).toBe('20px');
    });

    it('applies string padding as inline style', () => {
      container = createContainer({ padding: '1rem' });

      expect(container.style.padding).toBe('1rem');
    });

    it('applies x/y padding separately', () => {
      container = createContainer({ padding: { x: 'lg', y: 'sm' } });

      expect(container.classList.contains('dos-container--padding-x-lg')).toBe(true);
      expect(container.classList.contains('dos-container--padding-y-sm')).toBe(true);
    });

    it('applies mixed x/y padding', () => {
      container = createContainer({ padding: { x: 20, y: 'md' } });

      expect(container.style.paddingLeft).toBe('20px');
      expect(container.style.paddingRight).toBe('20px');
      expect(container.classList.contains('dos-container--padding-y-md')).toBe(true);
    });
  });

  describe('centering', () => {
    it('is not centered by default', () => {
      container = createContainer();

      expect(container.classList.contains('dos-container--centered')).toBe(false);
    });

    it('applies centered class when centered=true', () => {
      container = createContainer({ centered: true });

      expect(container.classList.contains('dos-container--centered')).toBe(true);
    });
  });

  describe('maxWidth', () => {
    it('applies numeric maxWidth as pixels', () => {
      container = createContainer({ maxWidth: 800 });

      expect(container.style.maxWidth).toBe('800px');
    });

    it('applies string maxWidth as-is', () => {
      container = createContainer({ maxWidth: '50rem' });

      expect(container.style.maxWidth).toBe('50rem');
    });
  });
});
