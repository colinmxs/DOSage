/**
 * Heading Component Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHeading } from '../../src/components/Heading/Heading';
import type { HeadingProps } from '../../src/components/Heading/Heading.types';

describe('Heading', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const heading = createHeading({
        level: 1,
        children: 'Test Heading',
      });

      container.appendChild(heading);

      expect(heading.tagName).toBe('H1');
      expect(heading.textContent).toBe('Test Heading');
      expect(heading.className).toContain('dos-heading');
      expect(heading.className).toContain('dos-heading--h1');
      expect(heading.className).toContain('dos-heading--left');
    });

    it('renders all heading levels correctly', () => {
      for (let level = 1; level <= 6; level++) {
        const heading = createHeading({
          level: level as 1 | 2 | 3 | 4 | 5 | 6,
          children: `Heading ${level}`,
        });

        container.appendChild(heading);

        expect(heading.tagName).toBe(`H${level}`);
        expect(heading.className).toContain(`dos-heading--h${level}`);
        expect(heading.textContent).toBe(`Heading ${level}`);
      }
    });

    it('renders with custom label', () => {
      const heading = createHeading({
        level: 2,
        children: 'Custom Heading Text',
      });

      expect(heading.textContent).toBe('Custom Heading Text');
    });

    it('renders with HTML element as children', () => {
      const span = document.createElement('span');
      span.textContent = 'Nested Element';

      const heading = createHeading({
        level: 3,
        children: span,
      });

      expect(heading.querySelector('span')).toBe(span);
      expect(heading.textContent).toBe('Nested Element');
    });

    it('applies alignment classes correctly', () => {
      const leftHeading = createHeading({
        level: 1,
        children: 'Left',
        align: 'left',
      });
      expect(leftHeading.className).toContain('dos-heading--left');

      const centerHeading = createHeading({
        level: 1,
        children: 'Center',
        align: 'center',
      });
      expect(centerHeading.className).toContain('dos-heading--center');

      const rightHeading = createHeading({
        level: 1,
        children: 'Right',
        align: 'right',
      });
      expect(rightHeading.className).toContain('dos-heading--right');
    });

    it('applies uppercase class when uppercase prop is true', () => {
      const heading = createHeading({
        level: 1,
        children: 'uppercase heading',
        uppercase: true,
      });

      expect(heading.className).toContain('dos-heading--uppercase');
    });

    it('does not apply uppercase class when uppercase prop is false', () => {
      const heading = createHeading({
        level: 1,
        children: 'normal heading',
        uppercase: false,
      });

      expect(heading.className).not.toContain('dos-heading--uppercase');
    });

    it('applies decorated class when decorated prop is true', () => {
      const heading = createHeading({
        level: 1,
        children: 'Decorated',
        decorated: true,
      });

      expect(heading.className).toContain('dos-heading--decorated');
    });

    it('renders decoration element when decorated', () => {
      const heading = createHeading({
        level: 1,
        children: 'Test',
        decorated: true,
      });

      const decoration = heading.querySelector('.dos-heading___decoration');
      expect(decoration).toBeTruthy();
      expect(decoration?.textContent).toBe('════'); // 4 characters for "Test"
      expect(decoration?.getAttribute('aria-hidden')).toBe('true');
    });

    it('decoration length matches heading text length', () => {
      const shortHeading = createHeading({
        level: 1,
        children: 'Hi',
        decorated: true,
      });

      const shortDecoration = shortHeading.querySelector('.dos-heading___decoration');
      expect(shortDecoration?.textContent).toBe('══'); // 2 characters

      const longHeading = createHeading({
        level: 1,
        children: 'Long Heading Text',
        decorated: true,
      });

      const longDecoration = longHeading.querySelector('.dos-heading___decoration');
      expect(longDecoration?.textContent?.length).toBe(17); // 17 characters
    });

    it('applies custom className', () => {
      const heading = createHeading({
        level: 1,
        children: 'Test',
        className: 'custom-class another-class',
      });

      expect(heading.className).toContain('custom-class');
      expect(heading.className).toContain('another-class');
      expect(heading.className).toContain('dos-heading');
    });

    it('applies id attribute', () => {
      const heading = createHeading({
        level: 1,
        children: 'Test',
        id: 'test-heading',
      });

      expect(heading.id).toBe('test-heading');
    });
  });

  describe('accessibility', () => {
    it('uses semantic heading elements', () => {
      const h1 = createHeading({ level: 1, children: 'H1' });
      const h2 = createHeading({ level: 2, children: 'H2' });
      const h3 = createHeading({ level: 3, children: 'H3' });

      expect(h1 instanceof HTMLHeadingElement).toBe(true);
      expect(h2 instanceof HTMLHeadingElement).toBe(true);
      expect(h3 instanceof HTMLHeadingElement).toBe(true);
    });

    it('decoration is marked as aria-hidden', () => {
      const heading = createHeading({
        level: 1,
        children: 'Test',
        decorated: true,
      });

      const decoration = heading.querySelector('.dos-heading___decoration');
      expect(decoration?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('combination of props', () => {
    it('applies multiple modifiers correctly', () => {
      const heading = createHeading({
        level: 2,
        children: 'complex heading',
        align: 'center',
        uppercase: true,
        decorated: true,
        className: 'custom',
        id: 'complex',
      });

      expect(heading.tagName).toBe('H2');
      expect(heading.className).toContain('dos-heading');
      expect(heading.className).toContain('dos-heading--h2');
      expect(heading.className).toContain('dos-heading--center');
      expect(heading.className).toContain('dos-heading--uppercase');
      expect(heading.className).toContain('dos-heading--decorated');
      expect(heading.className).toContain('custom');
      expect(heading.id).toBe('complex');

      const decoration = heading.querySelector('.dos-heading___decoration');
      expect(decoration).toBeTruthy();
    });
  });
});
