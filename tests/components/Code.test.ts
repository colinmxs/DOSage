/**
 * Code Component Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createCode } from '../../src/components/Code/Code';

describe('Code', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('renders code element', () => {
      const code = createCode({
        children: 'const x = 42;',
      });

      container.appendChild(code);

      expect(code.tagName).toBe('CODE');
      expect(code.textContent).toBe('const x = 42;');
      expect(code.className).toContain('dos-code');
    });

    it('preserves whitespace', () => {
      const code = createCode({
        children: '  indented\n  code  ',
      });

      expect(code.textContent).toBe('  indented\n  code  ');
    });

    it('highlighted variant applies styles', () => {
      const code = createCode({
        children: 'highlighted',
        highlighted: true,
      });

      expect(code.className).toContain('dos-code--highlighted');
    });

    it('normal code does not have highlighted class', () => {
      const code = createCode({
        children: 'normal',
        highlighted: false,
      });

      expect(code.className).not.toContain('dos-code--highlighted');
    });

    it('applies custom className', () => {
      const code = createCode({
        children: 'test',
        className: 'custom-class',
      });

      expect(code.className).toContain('custom-class');
      expect(code.className).toContain('dos-code');
    });

    it('applies id attribute', () => {
      const code = createCode({
        children: 'test',
        id: 'test-code',
      });

      expect(code.id).toBe('test-code');
    });
  });

  describe('accessibility', () => {
    it('uses semantic code element', () => {
      const code = createCode({ children: 'test' });
      expect(code instanceof HTMLElement).toBe(true);
      expect(code.tagName).toBe('CODE');
    });
  });
});
