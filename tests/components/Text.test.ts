/**
 * Text Component Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createText } from '../../src/components/Text/Text';
import type { TextProps } from '../../src/components/Text/Text.types';

describe('Text', () => {
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
      const text = createText({
        children: 'Test text',
      });

      container.appendChild(text);

      expect(text.tagName).toBe('P');
      expect(text.textContent).toBe('Test text');
      expect(text.className).toContain('dos-text');
      expect(text.className).toContain('dos-text--base');
      expect(text.className).toContain('dos-text--left');
    });

    it('renders with custom text content', () => {
      const text = createText({
        children: 'Custom text content',
      });

      expect(text.textContent).toBe('Custom text content');
    });

    it('renders with HTML element as children', () => {
      const span = document.createElement('span');
      span.textContent = 'Nested Element';

      const text = createText({
        children: span,
      });

      expect(text.querySelector('span')).toBe(span);
      expect(text.textContent).toBe('Nested Element');
    });

    it('applies size classes correctly', () => {
      const smText = createText({
        children: 'Small',
        size: 'sm',
      });
      expect(smText.className).toContain('dos-text--sm');

      const baseText = createText({
        children: 'Base',
        size: 'base',
      });
      expect(baseText.className).toContain('dos-text--base');

      const lgText = createText({
        children: 'Large',
        size: 'lg',
      });
      expect(lgText.className).toContain('dos-text--lg');
    });

    it('applies weight classes correctly', () => {
      const normalText = createText({
        children: 'Normal',
        weight: 'normal',
      });
      expect(normalText.className).not.toContain('dos-text--bold');

      const boldText = createText({
        children: 'Bold',
        weight: 'bold',
      });
      expect(boldText.className).toContain('dos-text--bold');
    });

    it('applies alignment classes correctly', () => {
      const leftText = createText({
        children: 'Left',
        align: 'left',
      });
      expect(leftText.className).toContain('dos-text--left');

      const centerText = createText({
        children: 'Center',
        align: 'center',
      });
      expect(centerText.className).toContain('dos-text--center');

      const rightText = createText({
        children: 'Right',
        align: 'right',
      });
      expect(rightText.className).toContain('dos-text--right');

      const justifyText = createText({
        children: 'Justify',
        align: 'justify',
      });
      expect(justifyText.className).toContain('dos-text--justify');
    });

    it('applies truncate class when truncate prop is true', () => {
      const text = createText({
        children: 'This is a long text that should be truncated',
        truncate: true,
      });

      expect(text.className).toContain('dos-text--truncate');
    });

    it('does not apply truncate class when truncate prop is false', () => {
      const text = createText({
        children: 'Normal text',
        truncate: false,
      });

      expect(text.className).not.toContain('dos-text--truncate');
    });

    it('renders as different HTML elements', () => {
      const pText = createText({
        children: 'Paragraph',
        as: 'p',
      });
      expect(pText.tagName).toBe('P');

      const spanText = createText({
        children: 'Span',
        as: 'span',
      });
      expect(spanText.tagName).toBe('SPAN');

      const divText = createText({
        children: 'Div',
        as: 'div',
      });
      expect(divText.tagName).toBe('DIV');
    });

    it('applies custom color', () => {
      const text = createText({
        children: 'Colored text',
        color: '#FF0000',
      });

      expect(text.style.color).toBe('rgb(255, 0, 0)');
    });

    it('applies custom className', () => {
      const text = createText({
        children: 'Test',
        className: 'custom-class another-class',
      });

      expect(text.className).toContain('custom-class');
      expect(text.className).toContain('another-class');
      expect(text.className).toContain('dos-text');
    });

    it('applies id attribute', () => {
      const text = createText({
        children: 'Test',
        id: 'test-text',
      });

      expect(text.id).toBe('test-text');
    });
  });

  describe('accessibility', () => {
    it('uses semantic HTML elements', () => {
      const p = createText({ children: 'Paragraph', as: 'p' });
      const span = createText({ children: 'Span', as: 'span' });
      const div = createText({ children: 'Div', as: 'div' });

      expect(p instanceof HTMLParagraphElement).toBe(true);
      expect(span instanceof HTMLSpanElement).toBe(true);
      expect(div instanceof HTMLDivElement).toBe(true);
    });
  });

  describe('combination of props', () => {
    it('applies multiple modifiers correctly', () => {
      const text = createText({
        children: 'complex text',
        size: 'lg',
        weight: 'bold',
        align: 'center',
        truncate: true,
        as: 'div',
        color: '#00FF00',
        className: 'custom',
        id: 'complex',
      });

      expect(text.tagName).toBe('DIV');
      expect(text.className).toContain('dos-text');
      expect(text.className).toContain('dos-text--lg');
      expect(text.className).toContain('dos-text--bold');
      expect(text.className).toContain('dos-text--center');
      expect(text.className).toContain('dos-text--truncate');
      expect(text.className).toContain('custom');
      expect(text.style.color).toBe('rgb(0, 255, 0)');
      expect(text.id).toBe('complex');
    });
  });
});
