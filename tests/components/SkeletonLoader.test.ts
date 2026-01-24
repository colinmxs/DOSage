/**
 * @file SkeletonLoader component tests
 * @description Tests for the DOS-style skeleton loader component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSkeletonLoader } from '../../src/components/SkeletonLoader';

describe('SkeletonLoader', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders a skeleton element', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element).toBeInstanceOf(HTMLElement);
      expect(skeleton.element.classList.contains('dos-skeleton')).toBe(true);
    });

    it('renders with default text variant', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--text')).toBe(true);
    });

    it('renders with custom id', () => {
      const skeleton = createSkeletonLoader({ id: 'my-skeleton' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.id).toBe('my-skeleton');
    });

    it('renders with custom className', () => {
      const skeleton = createSkeletonLoader({ className: 'custom-skeleton' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('custom-skeleton')).toBe(true);
    });

    it('is visible by default', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.isVisible()).toBe(true);
      expect(skeleton.element.classList.contains('dos-skeleton--hidden')).toBe(false);
    });
  });

  describe('variants', () => {
    it('renders text variant', () => {
      const skeleton = createSkeletonLoader({ variant: 'text' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--text')).toBe(true);
      expect(skeleton.element.querySelector('.dos-skeleton__line')).toBeTruthy();
    });

    it('renders rectangle variant', () => {
      const skeleton = createSkeletonLoader({ variant: 'rectangle' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--rectangle')).toBe(true);
      expect(skeleton.element.querySelector('.dos-skeleton__block')).toBeTruthy();
    });

    it('renders circle variant', () => {
      const skeleton = createSkeletonLoader({ variant: 'circle' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--circle')).toBe(true);
      expect(skeleton.element.querySelector('.dos-skeleton__block')).toBeTruthy();
    });
  });

  describe('text variant', () => {
    it('renders single line by default', () => {
      const skeleton = createSkeletonLoader({ variant: 'text' });
      container.appendChild(skeleton.element);

      const lines = skeleton.element.querySelectorAll('.dos-skeleton__line');
      expect(lines.length).toBe(1);
    });

    it('renders multiple lines', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        lines: 3,
      });
      container.appendChild(skeleton.element);

      const lines = skeleton.element.querySelectorAll('.dos-skeleton__line');
      expect(lines.length).toBe(3);
    });

    it('renders 5 lines', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        lines: 5,
      });
      container.appendChild(skeleton.element);

      const lines = skeleton.element.querySelectorAll('.dos-skeleton__line');
      expect(lines.length).toBe(5);
    });

    it('uses block characters for content', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        width: 10,
      });
      container.appendChild(skeleton.element);

      const line = skeleton.element.querySelector('.dos-skeleton__line');
      expect(line?.textContent).toContain('░');
    });

    it('respects numeric width as characters', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        width: 15,
      });
      container.appendChild(skeleton.element);

      const line = skeleton.element.querySelector('.dos-skeleton__line') as HTMLElement;
      expect(line.style.width).toContain('ch');
    });

    it('respects string width as CSS value', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        width: '200px',
      });
      container.appendChild(skeleton.element);

      const line = skeleton.element.querySelector('.dos-skeleton__line') as HTMLElement;
      expect(line.style.width).toBe('200px');
    });
  });

  describe('rectangle variant', () => {
    it('sets width and height', () => {
      const skeleton = createSkeletonLoader({
        variant: 'rectangle',
        width: '200px',
        height: '150px',
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.width).toBe('200px');
      expect(skeleton.element.style.height).toBe('150px');
    });

    it('uses numeric width as ch units', () => {
      const skeleton = createSkeletonLoader({
        variant: 'rectangle',
        width: 30,
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.width).toBe('30ch');
    });

    it('uses numeric height as em units', () => {
      const skeleton = createSkeletonLoader({
        variant: 'rectangle',
        height: 10,
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.height).toBe('10em');
    });

    it('contains block element', () => {
      const skeleton = createSkeletonLoader({ variant: 'rectangle' });
      container.appendChild(skeleton.element);

      const block = skeleton.element.querySelector('.dos-skeleton__block');
      expect(block).toBeTruthy();
    });

    it('contains fill element with block characters', () => {
      const skeleton = createSkeletonLoader({ variant: 'rectangle' });
      container.appendChild(skeleton.element);

      const fill = skeleton.element.querySelector('.dos-skeleton__fill');
      expect(fill).toBeTruthy();
      expect(fill?.textContent).toContain('░');
    });
  });

  describe('circle variant', () => {
    it('sets equal width and height', () => {
      const skeleton = createSkeletonLoader({
        variant: 'circle',
        width: '50px',
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.width).toBe('50px');
      expect(skeleton.element.style.height).toBe('50px');
    });

    it('uses default size if not specified', () => {
      const skeleton = createSkeletonLoader({ variant: 'circle' });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.width).toBe('3em');
      expect(skeleton.element.style.height).toBe('3em');
    });

    it('uses numeric width as ch units', () => {
      const skeleton = createSkeletonLoader({
        variant: 'circle',
        width: 5,
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.style.width).toBe('5ch');
    });
  });

  describe('animation', () => {
    it('has animation class by default', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--animated')).toBe(true);
    });

    it('can disable animation', () => {
      const skeleton = createSkeletonLoader({ animate: false });
      container.appendChild(skeleton.element);

      expect(skeleton.element.classList.contains('dos-skeleton--animated')).toBe(false);
    });
  });

  describe('instance methods', () => {
    it('show() makes skeleton visible', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      skeleton.hide();
      expect(skeleton.isVisible()).toBe(false);

      skeleton.show();
      expect(skeleton.isVisible()).toBe(true);
      expect(skeleton.element.classList.contains('dos-skeleton--hidden')).toBe(false);
    });

    it('hide() hides skeleton', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      skeleton.hide();
      expect(skeleton.isVisible()).toBe(false);
      expect(skeleton.element.classList.contains('dos-skeleton--hidden')).toBe(true);
    });

    it('isVisible() returns correct state', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.isVisible()).toBe(true);

      skeleton.hide();
      expect(skeleton.isVisible()).toBe(false);

      skeleton.show();
      expect(skeleton.isVisible()).toBe(true);
    });

    it('destroy() removes element', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(container.contains(skeleton.element)).toBe(true);

      skeleton.destroy();
      expect(container.contains(skeleton.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="status"', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element.getAttribute('role')).toBe('status');
    });

    it('has aria-busy="true"', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element.getAttribute('aria-busy')).toBe('true');
    });

    it('has default aria-label', () => {
      const skeleton = createSkeletonLoader();
      container.appendChild(skeleton.element);

      expect(skeleton.element.getAttribute('aria-label')).toBe('Loading content');
    });

    it('has custom aria-label', () => {
      const skeleton = createSkeletonLoader({
        label: 'Loading user profile',
      });
      container.appendChild(skeleton.element);

      expect(skeleton.element.getAttribute('aria-label')).toBe('Loading user profile');
    });

    it('hides visual content from screen readers', () => {
      const skeleton = createSkeletonLoader({ variant: 'text' });
      container.appendChild(skeleton.element);

      const line = skeleton.element.querySelector('.dos-skeleton__line');
      expect(line?.getAttribute('aria-hidden')).toBe('true');
    });

    it('hides block content from screen readers', () => {
      const skeleton = createSkeletonLoader({ variant: 'rectangle' });
      container.appendChild(skeleton.element);

      const block = skeleton.element.querySelector('.dos-skeleton__block');
      expect(block?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles zero lines gracefully', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        lines: 0,
      });
      container.appendChild(skeleton.element);

      const lines = skeleton.element.querySelectorAll('.dos-skeleton__line');
      expect(lines.length).toBe(0);
    });

    it('handles large number of lines', () => {
      const skeleton = createSkeletonLoader({
        variant: 'text',
        lines: 10,
      });
      container.appendChild(skeleton.element);

      const lines = skeleton.element.querySelectorAll('.dos-skeleton__line');
      expect(lines.length).toBe(10);
    });
  });
});
