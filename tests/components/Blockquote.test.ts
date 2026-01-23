/**
 * Blockquote Component Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createBlockquote } from '../../src/components/Blockquote/Blockquote';

describe('Blockquote', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('renders blockquote element', () => {
      const blockquote = createBlockquote({
        children: 'This is a quote',
      });

      container.appendChild(blockquote);

      expect(blockquote.tagName).toBe('BLOCKQUOTE');
      expect(blockquote.textContent).toContain('This is a quote');
      expect(blockquote.className).toContain('dos-blockquote');
    });

    it('renders with HTML element as children', () => {
      const p = document.createElement('p');
      p.textContent = 'Quote content';

      const blockquote = createBlockquote({
        children: p,
      });

      expect(blockquote.querySelector('p')).toBe(p);
    });

    it('displays citation', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
        cite: 'Author Name',
      });

      const cite = blockquote.querySelector('.dos-blockquote___cite');
      expect(cite).toBeTruthy();
      expect(cite?.textContent).toContain('Author Name');
    });

    it('no citation element when cite not provided', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
      });

      const cite = blockquote.querySelector('.dos-blockquote___cite');
      expect(cite).toBeFalsy();
    });

    it('renders default indicator', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
      });

      const indicator = blockquote.querySelector('.dos-blockquote___indicator');
      expect(indicator).toBeTruthy();
      expect(indicator?.textContent).toBe('│');
    });

    it('custom indicator character works', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
        indicator: '▌',
      });

      const indicator = blockquote.querySelector('.dos-blockquote___indicator');
      expect(indicator?.textContent).toBe('▌');
    });

    it('indicator is aria-hidden', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
      });

      const indicator = blockquote.querySelector('.dos-blockquote___indicator');
      expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    });

    it('applies custom className', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
        className: 'custom-class',
      });

      expect(blockquote.className).toContain('custom-class');
      expect(blockquote.className).toContain('dos-blockquote');
    });

    it('applies id attribute', () => {
      const blockquote = createBlockquote({
        children: 'Quote',
        id: 'test-blockquote',
      });

      expect(blockquote.id).toBe('test-blockquote');
    });
  });

  describe('accessibility', () => {
    it('uses semantic blockquote element', () => {
      const blockquote = createBlockquote({ children: 'test' });
      expect(blockquote instanceof HTMLQuoteElement).toBe(true);
    });

    it('uses semantic cite element', () => {
      const blockquote = createBlockquote({
        children: 'test',
        cite: 'Author',
      });

      const cite = blockquote.querySelector('cite');
      expect(cite).toBeTruthy();
    });
  });
});
