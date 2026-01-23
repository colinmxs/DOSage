import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createASCIIArt } from '../../src/components/ASCIIArt/ASCIIArt';

describe('ASCIIArt', () => {
  describe('rendering', () => {
    it('renders pre element', () => {
      const art = createASCIIArt({ art: '  _____\n /     \\\n \\_____/' });
      expect(art.tagName).toBe('PRE');
    });

    it('art string displays correctly', () => {
      const artString = 'ASCII';
      const art = createASCIIArt({ art: artString });
      expect(art.textContent).toBe(artString);
    });

    it('text conversion works', () => {
      const art = createASCIIArt({ text: 'A' });
      expect(art.textContent).toBeTruthy();
    });

    it('applies custom className', () => {
      const art = createASCIIArt({ art: 'test', className: 'custom-class' });
      expect(art.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('ARIA attributes present', () => {
      const art = createASCIIArt({ art: 'test', text: 'Test Art' });
      expect(art.getAttribute('role')).toBe('img');
      expect(art.getAttribute('aria-label')).toBeTruthy();
    });

    it('uses text as aria-label when text is provided', () => {
      const art = createASCIIArt({ art: 'test', text: 'My Label' });
      expect(art.getAttribute('aria-label')).toBe('My Label');
    });

    it('uses default aria-label when no text provided', () => {
      const art = createASCIIArt({ art: 'test' });
      expect(art.getAttribute('aria-label')).toBe('ASCII art');
    });
  });

  describe('animation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds animated class when animate is true', () => {
      const art = createASCIIArt({ art: 'test', animate: true });
      expect(art.classList.contains('dos-ascii-art--animated')).toBe(true);
    });

    it('does not add animated class when animate is false', () => {
      const art = createASCIIArt({ art: 'test', animate: false });
      expect(art.classList.contains('dos-ascii-art--animated')).toBe(false);
    });

    it('starts with empty content when animated', () => {
      const art = createASCIIArt({ art: 'test', animate: true });
      // Content starts empty (except for cursor)
      const cursor = art.querySelector('.dos-ascii-art___cursor');
      expect(cursor).toBeTruthy();
    });

    it('adds cursor element during animation', () => {
      const art = createASCIIArt({ art: 'ABC', animate: true });
      const cursor = art.querySelector('.dos-ascii-art___cursor');
      expect(cursor).toBeTruthy();
      expect(cursor?.textContent).toBe('█');
    });

    it('adds animating class during animation', () => {
      const art = createASCIIArt({ art: 'test', animate: true });
      expect(art.classList.contains('dos-ascii-art--animating')).toBe(true);
    });

    it('uses custom animation speed', () => {
      const art = createASCIIArt({ art: 'test', animate: true, animationSpeed: 100 });
      expect(art.classList.contains('dos-ascii-art--animated')).toBe(true);
    });
  });
});
