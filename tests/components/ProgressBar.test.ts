/**
 * @file ProgressBar component tests
 * @description Tests for the DOS-style progress bar component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createProgressBar } from '../../src/components/ProgressBar';

describe('ProgressBar', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders a progress bar element', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.element).toBeInstanceOf(HTMLElement);
      expect(progress.element.classList.contains('dos-progress-bar')).toBe(true);
    });

    it('renders with default values', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.getValue()).toBe(0);
      expect(progress.getMax()).toBe(100);
      expect(progress.getPercentage()).toBe(0);
    });

    it('renders with custom value and max', () => {
      const progress = createProgressBar({
        value: 50,
        max: 200,
      });
      container.appendChild(progress.element);

      expect(progress.getValue()).toBe(50);
      expect(progress.getMax()).toBe(200);
      expect(progress.getPercentage()).toBe(25);
    });

    it('renders with custom id', () => {
      const progress = createProgressBar({
        id: 'my-progress',
      });
      container.appendChild(progress.element);

      expect(progress.element.id).toBe('my-progress');
    });

    it('renders with custom className', () => {
      const progress = createProgressBar({
        className: 'custom-progress',
      });
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('custom-progress')).toBe(true);
    });

    it('renders track and fill elements', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      const track = progress.element.querySelector('.dos-progress-bar__track');
      const fill = progress.element.querySelector('.dos-progress-bar__fill');

      expect(track).toBeTruthy();
      expect(fill).toBeTruthy();
    });

    it('clamps value to max', () => {
      const progress = createProgressBar({
        value: 150,
        max: 100,
      });
      container.appendChild(progress.element);

      expect(progress.getValue()).toBe(100);
      expect(progress.getPercentage()).toBe(100);
    });

    it('clamps value to minimum 0', () => {
      const progress = createProgressBar({
        value: -50,
      });
      container.appendChild(progress.element);

      expect(progress.getValue()).toBe(0);
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const progress = createProgressBar({ size: 'small' });
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--small')).toBe(true);
    });

    it('renders medium size by default', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--medium')).toBe(true);
    });

    it('renders large size', () => {
      const progress = createProgressBar({ size: 'large' });
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--large')).toBe(true);
    });
  });

  describe('styles', () => {
    it('renders blocks style by default', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--blocks')).toBe(true);
    });

    it('renders boxed style', () => {
      const progress = createProgressBar({ style: 'boxed' });
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--boxed')).toBe(true);
    });
  });

  describe('value display', () => {
    it('does not show value by default', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      const valueElement = progress.element.querySelector('.dos-progress-bar__value');
      expect(valueElement).toBeNull();
    });

    it('shows value when showValue is true', () => {
      const progress = createProgressBar({
        value: 50,
        max: 100,
        showValue: true,
      });
      container.appendChild(progress.element);

      const valueElement = progress.element.querySelector('.dos-progress-bar__value');
      expect(valueElement).toBeTruthy();
      expect(valueElement?.textContent).toBe('50%');
    });

    it('uses custom value formatter', () => {
      const progress = createProgressBar({
        value: 50,
        max: 100,
        showValue: true,
        valueFormat: (value, max) => `${value}/${max} items`,
      });
      container.appendChild(progress.element);

      const valueElement = progress.element.querySelector('.dos-progress-bar__value');
      expect(valueElement?.textContent).toBe('50/100 items');
    });

    it('updates value display when value changes', () => {
      const progress = createProgressBar({
        value: 0,
        showValue: true,
      });
      container.appendChild(progress.element);

      progress.setValue(75);

      const valueElement = progress.element.querySelector('.dos-progress-bar__value');
      expect(valueElement?.textContent).toBe('75%');
    });
  });

  describe('indeterminate mode', () => {
    it('renders indeterminate state', () => {
      const progress = createProgressBar({ indeterminate: true });
      container.appendChild(progress.element);

      expect(progress.element.classList.contains('dos-progress-bar--indeterminate')).toBe(true);
      expect(progress.isIndeterminate()).toBe(true);
    });

    it('does not have aria-valuenow in indeterminate mode', () => {
      const progress = createProgressBar({ indeterminate: true });
      container.appendChild(progress.element);

      expect(progress.element.hasAttribute('aria-valuenow')).toBe(false);
    });

    it('shows ... for value in indeterminate mode', () => {
      const progress = createProgressBar({
        indeterminate: true,
        showValue: true,
      });
      container.appendChild(progress.element);

      const valueElement = progress.element.querySelector('.dos-progress-bar__value');
      expect(valueElement?.textContent).toBe('...');
    });

    it('can toggle indeterminate mode', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      expect(progress.isIndeterminate()).toBe(false);

      progress.setIndeterminate(true);
      expect(progress.isIndeterminate()).toBe(true);
      expect(progress.element.classList.contains('dos-progress-bar--indeterminate')).toBe(true);

      progress.setIndeterminate(false);
      expect(progress.isIndeterminate()).toBe(false);
      expect(progress.element.classList.contains('dos-progress-bar--indeterminate')).toBe(false);
    });
  });

  describe('custom color', () => {
    it('applies custom color', () => {
      const progress = createProgressBar({
        value: 50,
        color: '#ff0000',
      });
      container.appendChild(progress.element);

      const fill = progress.element.querySelector('.dos-progress-bar__fill') as HTMLElement;
      expect(fill.style.color).toBe('rgb(255, 0, 0)');
      expect(progress.element.classList.contains('dos-progress-bar--custom-color')).toBe(true);
    });
  });

  describe('instance methods', () => {
    it('setValue updates the value', () => {
      const progress = createProgressBar({ value: 0 });
      container.appendChild(progress.element);

      progress.setValue(75);
      expect(progress.getValue()).toBe(75);
      expect(progress.getPercentage()).toBe(75);
    });

    it('setValue clamps to max', () => {
      const progress = createProgressBar({ value: 0, max: 100 });
      container.appendChild(progress.element);

      progress.setValue(150);
      expect(progress.getValue()).toBe(100);
    });

    it('setValue clamps to 0', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      progress.setValue(-10);
      expect(progress.getValue()).toBe(0);
    });

    it('setMax updates the maximum', () => {
      const progress = createProgressBar({ value: 50, max: 100 });
      container.appendChild(progress.element);

      progress.setMax(200);
      expect(progress.getMax()).toBe(200);
      expect(progress.getPercentage()).toBe(25);
    });

    it('setMax clamps current value if needed', () => {
      const progress = createProgressBar({ value: 75, max: 100 });
      container.appendChild(progress.element);

      progress.setMax(50);
      expect(progress.getMax()).toBe(50);
      expect(progress.getValue()).toBe(50);
    });

    it('setMax minimum is 1', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      progress.setMax(0);
      expect(progress.getMax()).toBe(1);
    });

    it('getPercentage returns correct value', () => {
      const progress = createProgressBar({ value: 25, max: 50 });
      container.appendChild(progress.element);

      expect(progress.getPercentage()).toBe(50);
    });

    it('destroy removes element', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(container.contains(progress.element)).toBe(true);

      progress.destroy();
      expect(container.contains(progress.element)).toBe(false);
    });
  });

  describe('fill width', () => {
    it('sets correct fill width for 0%', () => {
      const progress = createProgressBar({ value: 0, max: 100 });
      container.appendChild(progress.element);

      const fill = progress.element.querySelector('.dos-progress-bar__fill') as HTMLElement;
      expect(fill.style.width).toBe('0%');
    });

    it('sets correct fill width for 50%', () => {
      const progress = createProgressBar({ value: 50, max: 100 });
      container.appendChild(progress.element);

      const fill = progress.element.querySelector('.dos-progress-bar__fill') as HTMLElement;
      expect(fill.style.width).toBe('50%');
    });

    it('sets correct fill width for 100%', () => {
      const progress = createProgressBar({ value: 100, max: 100 });
      container.appendChild(progress.element);

      const fill = progress.element.querySelector('.dos-progress-bar__fill') as HTMLElement;
      expect(fill.style.width).toBe('100%');
    });

    it('updates fill width when value changes', () => {
      const progress = createProgressBar({ value: 0 });
      container.appendChild(progress.element);

      const fill = progress.element.querySelector('.dos-progress-bar__fill') as HTMLElement;
      expect(fill.style.width).toBe('0%');

      progress.setValue(75);
      expect(fill.style.width).toBe('75%');
    });
  });

  describe('accessibility', () => {
    it('has role="progressbar"', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('role')).toBe('progressbar');
    });

    it('has aria-valuemin', () => {
      const progress = createProgressBar();
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-valuemin')).toBe('0');
    });

    it('has aria-valuemax', () => {
      const progress = createProgressBar({ max: 200 });
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-valuemax')).toBe('200');
    });

    it('has aria-valuenow', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuetext', () => {
      const progress = createProgressBar({ value: 50 });
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-valuetext')).toBe('50%');
    });

    it('uses custom formatter for aria-valuetext', () => {
      const progress = createProgressBar({
        value: 5,
        max: 10,
        valueFormat: (value, max) => `Step ${value} of ${max}`,
      });
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-valuetext')).toBe('Step 5 of 10');
    });

    it('has aria-label when provided', () => {
      const progress = createProgressBar({
        label: 'File upload progress',
      });
      container.appendChild(progress.element);

      expect(progress.element.getAttribute('aria-label')).toBe('File upload progress');
    });

    it('updates ARIA attributes when value changes', () => {
      const progress = createProgressBar({ value: 0 });
      container.appendChild(progress.element);

      progress.setValue(75);

      expect(progress.element.getAttribute('aria-valuenow')).toBe('75');
      expect(progress.element.getAttribute('aria-valuetext')).toBe('75%');
    });

    it('updates ARIA attributes when max changes', () => {
      const progress = createProgressBar({ value: 50, max: 100 });
      container.appendChild(progress.element);

      progress.setMax(200);

      expect(progress.element.getAttribute('aria-valuemax')).toBe('200');
      expect(progress.element.getAttribute('aria-valuetext')).toBe('25%');
    });
  });

  describe('edge cases', () => {
    it('handles max of 0 gracefully', () => {
      const progress = createProgressBar({ value: 50, max: 0 });
      container.appendChild(progress.element);

      // Max should be clamped to 1
      expect(progress.getMax()).toBe(1);
    });

    it('handles negative max gracefully', () => {
      const progress = createProgressBar({ value: 50, max: -100 });
      container.appendChild(progress.element);

      // Max should be clamped to 1
      expect(progress.getMax()).toBe(1);
    });

    it('handles fractional values', () => {
      const progress = createProgressBar({ value: 33.33, max: 100 });
      container.appendChild(progress.element);

      expect(progress.getValue()).toBe(33.33);
      expect(progress.getPercentage()).toBe(33); // Rounded
    });

    it('handles very large values', () => {
      const progress = createProgressBar({
        value: 999999,
        max: 1000000,
      });
      container.appendChild(progress.element);

      expect(progress.getPercentage()).toBe(100);
    });
  });
});
