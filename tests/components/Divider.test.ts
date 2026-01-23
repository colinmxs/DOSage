/**
 * Divider Component Tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createDivider, DIVIDER_CHARACTERS } from '../../src/components/Divider';

describe('Divider', () => {
  let divider: HTMLElement | null = null;

  afterEach(() => {
    if (divider && divider.parentNode) {
      divider.remove();
    }
    divider = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      divider = createDivider();

      expect(divider).toBeInstanceOf(HTMLElement);
      expect(divider.tagName).toBe('DIV');
      expect(divider.classList.contains('dos-divider')).toBe(true);
    });

    it('renders horizontal by default', () => {
      divider = createDivider();

      expect(divider.classList.contains('dos-divider--horizontal')).toBe(true);
    });

    it('renders single variant by default', () => {
      divider = createDivider();

      expect(divider.classList.contains('dos-divider--single')).toBe(true);
    });

    it('applies custom className', () => {
      divider = createDivider({ className: 'my-divider' });

      expect(divider.classList.contains('dos-divider')).toBe(true);
      expect(divider.classList.contains('my-divider')).toBe(true);
    });

    it('applies custom id', () => {
      divider = createDivider({ id: 'my-divider' });

      expect(divider.id).toBe('my-divider');
    });

    it('contains line element', () => {
      divider = createDivider();
      const line = divider.querySelector('.dos-divider__line');

      expect(line).not.toBeNull();
    });
  });

  describe('orientation', () => {
    it('applies horizontal orientation', () => {
      divider = createDivider({ orientation: 'horizontal' });

      expect(divider.classList.contains('dos-divider--horizontal')).toBe(true);
      expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('applies vertical orientation', () => {
      divider = createDivider({ orientation: 'vertical' });

      expect(divider.classList.contains('dos-divider--vertical')).toBe(true);
      expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('variants', () => {
    it('renders correct character for single horizontal', () => {
      divider = createDivider({ variant: 'single', orientation: 'horizontal' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.horizontal.single);
    });

    it('renders correct character for double horizontal', () => {
      divider = createDivider({ variant: 'double', orientation: 'horizontal' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.horizontal.double);
    });

    it('renders correct character for thick horizontal', () => {
      divider = createDivider({ variant: 'thick', orientation: 'horizontal' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.horizontal.thick);
    });

    it('renders correct character for dashed horizontal', () => {
      divider = createDivider({ variant: 'dashed', orientation: 'horizontal' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.horizontal.dashed);
    });

    it('renders correct character for single vertical', () => {
      divider = createDivider({ variant: 'single', orientation: 'vertical' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.vertical.single);
    });

    it('renders correct character for double vertical', () => {
      divider = createDivider({ variant: 'double', orientation: 'vertical' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain(DIVIDER_CHARACTERS.vertical.double);
    });
  });

  describe('custom character', () => {
    it('uses custom character when provided', () => {
      divider = createDivider({ character: '★' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain('★');
    });

    it('custom character overrides variant', () => {
      divider = createDivider({ variant: 'double', character: '×' });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent).toContain('×');
      expect(line?.textContent).not.toContain(DIVIDER_CHARACTERS.horizontal.double);
    });
  });

  describe('length', () => {
    it('renders full length by default', () => {
      divider = createDivider();
      const line = divider.querySelector('.dos-divider__line');

      // Should have many repeated characters
      expect((line?.textContent?.length ?? 0) > 10).toBe(true);
    });

    it('applies specific character count', () => {
      divider = createDivider({ length: 5 });
      const line = divider.querySelector('.dos-divider__line');

      expect(line?.textContent?.length).toBe(5);
    });
  });

  describe('margin', () => {
    it('applies preset margin values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        divider = createDivider({ margin: preset });
        expect(divider.classList.contains(`dos-divider--margin-${preset}`)).toBe(true);
      });
    });

    it('applies custom margin as inline style', () => {
      divider = createDivider({ margin: 24, orientation: 'horizontal' });

      expect(divider.style.marginTop).toBe('24px');
      expect(divider.style.marginBottom).toBe('24px');
    });
  });

  describe('accessibility', () => {
    it('has role separator', () => {
      divider = createDivider();

      expect(divider.getAttribute('role')).toBe('separator');
    });

    it('has aria-orientation attribute', () => {
      divider = createDivider({ orientation: 'horizontal' });

      expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    });
  });
});
