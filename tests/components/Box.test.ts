/**
 * Box Component Tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createBox } from '../../src/components/Box';

describe('Box', () => {
  let box: HTMLElement | null = null;

  afterEach(() => {
    if (box && box.parentNode) {
      box.remove();
    }
    box = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      box = createBox();

      expect(box).toBeInstanceOf(HTMLElement);
      expect(box.tagName).toBe('DIV');
      expect(box.classList.contains('dos-box')).toBe(true);
    });

    it('applies default display mode (block)', () => {
      box = createBox();

      expect(box.classList.contains('dos-box--block')).toBe(true);
    });

    it('applies custom className', () => {
      box = createBox({ className: 'my-box' });

      expect(box.classList.contains('dos-box')).toBe(true);
      expect(box.classList.contains('my-box')).toBe(true);
    });

    it('applies custom id', () => {
      box = createBox({ id: 'my-box' });

      expect(box.id).toBe('my-box');
    });
  });

  describe('border', () => {
    it('has no border by default', () => {
      box = createBox();

      expect(box.classList.contains('dos-box--bordered')).toBe(false);
    });

    it('applies bordered class when border=true', () => {
      box = createBox({ border: true });

      expect(box.classList.contains('dos-box--bordered')).toBe(true);
    });

    it('applies border config with custom settings', () => {
      box = createBox({
        border: {
          width: 2,
          style: 'dashed',
          color: '#ff0000',
        },
      });

      // Browser converts hex to rgb format
      expect(box.style.border).toContain('2px dashed');
      expect(box.style.border).toMatch(/rgb\(255,\s*0,\s*0\)|#ff0000/i);
    });

    it('applies border to specific sides', () => {
      box = createBox({
        border: {
          width: 1,
          style: 'solid',
          sides: 'top',
        },
      });

      expect(box.style.borderTop).toContain('1px solid');
    });

    it('applies border to multiple sides', () => {
      box = createBox({
        border: {
          width: 1,
          style: 'solid',
          sides: ['top', 'bottom'],
        },
      });

      expect(box.style.borderTop).toContain('1px solid');
      expect(box.style.borderBottom).toContain('1px solid');
    });
  });

  describe('padding', () => {
    it('applies preset padding values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        box = createBox({ padding: preset });
        expect(box.classList.contains(`dos-box--padding-${preset}`)).toBe(true);
      });
    });

    it('applies numeric padding as inline style', () => {
      box = createBox({ padding: 16 });

      expect(box.style.padding).toBe('16px');
    });
  });

  describe('margin', () => {
    it('applies preset margin values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        box = createBox({ margin: preset });
        expect(box.classList.contains(`dos-box--margin-${preset}`)).toBe(true);
      });
    });

    it('applies numeric margin as inline style', () => {
      box = createBox({ margin: 8 });

      expect(box.style.margin).toBe('8px');
    });
  });

  describe('display mode', () => {
    it('applies block display', () => {
      box = createBox({ display: 'block' });

      expect(box.classList.contains('dos-box--block')).toBe(true);
    });

    it('applies inline-block display', () => {
      box = createBox({ display: 'inline-block' });

      expect(box.classList.contains('dos-box--inline-block')).toBe(true);
    });

    it('applies flex display', () => {
      box = createBox({ display: 'flex' });

      expect(box.classList.contains('dos-box--flex')).toBe(true);
    });

    it('applies inline-flex display', () => {
      box = createBox({ display: 'inline-flex' });

      expect(box.classList.contains('dos-box--inline-flex')).toBe(true);
    });
  });

  describe('dimensions', () => {
    it('applies numeric width as pixels', () => {
      box = createBox({ width: 200 });

      expect(box.style.width).toBe('200px');
    });

    it('applies string width as-is', () => {
      box = createBox({ width: '50%' });

      expect(box.style.width).toBe('50%');
    });

    it('applies numeric height as pixels', () => {
      box = createBox({ height: 100 });

      expect(box.style.height).toBe('100px');
    });

    it('applies string height as-is', () => {
      box = createBox({ height: '10rem' });

      expect(box.style.height).toBe('10rem');
    });
  });

  describe('backgroundColor', () => {
    it('applies background color', () => {
      box = createBox({ backgroundColor: '#0000AA' });

      expect(box.style.backgroundColor).toBe('rgb(0, 0, 170)');
    });
  });
});
