/**
 * @file LoadingSpinner component tests
 * @description Tests for the DOS-style loading spinner component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLoadingSpinner } from '../../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders a spinner element', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element).toBeInstanceOf(HTMLElement);
      expect(spinner.element.classList.contains('dos-loading-spinner')).toBe(true);
    });

    it('renders with default props', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--medium')).toBe(true);
      expect(spinner.element.classList.contains('dos-loading-spinner--ascii')).toBe(true);
    });

    it('renders with custom id', () => {
      const spinner = createLoadingSpinner({ id: 'my-spinner' });
      container.appendChild(spinner.element);

      expect(spinner.element.id).toBe('my-spinner');
    });

    it('renders with custom className', () => {
      const spinner = createLoadingSpinner({ className: 'custom-spinner' });
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('custom-spinner')).toBe(true);
    });

    it('renders with custom color', () => {
      const spinner = createLoadingSpinner({ color: '#ffffff' });
      container.appendChild(spinner.element);

      expect(spinner.element.style.color).toBe('rgb(255, 255, 255)');
    });

    it('renders with inherit color', () => {
      const spinner = createLoadingSpinner({ color: 'inherit' });
      container.appendChild(spinner.element);

      expect(spinner.element.style.color).toBe('inherit');
    });

    it('renders character element', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');
      expect(character).toBeTruthy();
      expect(character?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders visually hidden label element', () => {
      const spinner = createLoadingSpinner({ label: 'Loading data' });
      container.appendChild(spinner.element);

      const label = spinner.element.querySelector('.dos-loading-spinner__label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Loading data');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const spinner = createLoadingSpinner({ size: 'small' });
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--small')).toBe(true);
    });

    it('renders medium size by default', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--medium')).toBe(true);
    });

    it('renders large size', () => {
      const spinner = createLoadingSpinner({ size: 'large' });
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--large')).toBe(true);
    });
  });

  describe('styles', () => {
    it('renders ascii style by default', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--ascii')).toBe(true);
    });

    it('renders block style', () => {
      const spinner = createLoadingSpinner({ style: 'block' });
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--block')).toBe(true);
    });

    it('renders dots style', () => {
      const spinner = createLoadingSpinner({ style: 'dots' });
      container.appendChild(spinner.element);

      expect(spinner.element.classList.contains('dos-loading-spinner--dots')).toBe(true);
    });

    it('displays initial frame for ascii style', () => {
      const spinner = createLoadingSpinner({ style: 'ascii' });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');
      expect(character?.textContent).toBe('|');
    });

    it('displays initial frame for block style', () => {
      const spinner = createLoadingSpinner({ style: 'block' });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');
      expect(character?.textContent).toBe('▖');
    });

    it('displays initial frame for dots style', () => {
      const spinner = createLoadingSpinner({ style: 'dots' });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');
      expect(character?.textContent).toBe('⠋');
    });
  });

  describe('animation', () => {
    it('starts animation automatically', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.isAnimating()).toBe(true);
    });

    it('animates through ascii frames', () => {
      const spinner = createLoadingSpinner({ style: 'ascii', speed: 100 });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');

      expect(character?.textContent).toBe('|');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('/');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('-');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('\\');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('|'); // Cycles back
    });

    it('animates through block frames', () => {
      const spinner = createLoadingSpinner({ style: 'block', speed: 100 });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');

      expect(character?.textContent).toBe('▖');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('▘');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('▝');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('▗');
    });

    it('animates through dots frames', () => {
      const spinner = createLoadingSpinner({ style: 'dots', speed: 100 });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');

      expect(character?.textContent).toBe('⠋');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('⠙');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('⠹');
    });

    it('respects custom speed', () => {
      const spinner = createLoadingSpinner({ style: 'ascii', speed: 200 });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');

      expect(character?.textContent).toBe('|');

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('|'); // Should not have changed

      vi.advanceTimersByTime(100);
      expect(character?.textContent).toBe('/'); // Now it should change
    });
  });

  describe('instance methods', () => {
    it('stop() stops the animation', () => {
      const spinner = createLoadingSpinner({ style: 'ascii', speed: 100 });
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');

      expect(spinner.isAnimating()).toBe(true);

      spinner.stop();

      expect(spinner.isAnimating()).toBe(false);
      expect(spinner.element.classList.contains('dos-loading-spinner--stopped')).toBe(true);

      const currentChar = character?.textContent;
      vi.advanceTimersByTime(500);
      expect(character?.textContent).toBe(currentChar); // Should not have changed
    });

    it('start() resumes the animation', () => {
      const spinner = createLoadingSpinner({ style: 'ascii', speed: 100 });
      container.appendChild(spinner.element);

      spinner.stop();
      expect(spinner.isAnimating()).toBe(false);

      spinner.start();
      expect(spinner.isAnimating()).toBe(true);
      expect(spinner.element.classList.contains('dos-loading-spinner--stopped')).toBe(false);
    });

    it('start() does nothing if already running', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.isAnimating()).toBe(true);

      // This should not cause issues
      spinner.start();
      spinner.start();

      expect(spinner.isAnimating()).toBe(true);
    });

    it('setLabel() updates the label', () => {
      const spinner = createLoadingSpinner({ label: 'Loading' });
      container.appendChild(spinner.element);

      expect(spinner.element.getAttribute('aria-label')).toBe('Loading');

      spinner.setLabel('Processing data');

      expect(spinner.element.getAttribute('aria-label')).toBe('Processing data');

      const labelElement = spinner.element.querySelector('.dos-loading-spinner__label');
      expect(labelElement?.textContent).toBe('Processing data');
    });

    it('destroy() stops animation and removes element', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(container.contains(spinner.element)).toBe(true);
      expect(spinner.isAnimating()).toBe(true);

      spinner.destroy();

      expect(container.contains(spinner.element)).toBe(false);
      expect(spinner.isAnimating()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="status"', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.getAttribute('role')).toBe('status');
    });

    it('has aria-live="polite"', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.getAttribute('aria-live')).toBe('polite');
    });

    it('has aria-label with default value', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      expect(spinner.element.getAttribute('aria-label')).toBe('Loading');
    });

    it('has aria-label with custom value', () => {
      const spinner = createLoadingSpinner({ label: 'Fetching results' });
      container.appendChild(spinner.element);

      expect(spinner.element.getAttribute('aria-label')).toBe('Fetching results');
    });

    it('hides character from screen readers', () => {
      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      const character = spinner.element.querySelector('.dos-loading-spinner__character');
      expect(character?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('cleanup', () => {
    it('clears interval on stop', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      spinner.stop();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it('clears interval on destroy', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

      const spinner = createLoadingSpinner();
      container.appendChild(spinner.element);

      spinner.destroy();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
