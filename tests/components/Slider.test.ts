/**
 * Slider Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSlider } from '../../src/components/Slider';

describe('Slider', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const slider = createSlider();
      container.appendChild(slider);

      expect(slider.classList.contains('dos-slider')).toBe(true);
      expect(slider.querySelector('.dos-slider__track')).not.toBeNull();
      expect(slider.querySelector('.dos-slider__thumb')).not.toBeNull();
    });

    it('renders with correct initial value', () => {
      const slider = createSlider({ value: 50 });
      container.appendChild(slider);

      expect(slider.getValue()).toBe(50);
    });

    it('renders with label', () => {
      const slider = createSlider({ label: 'Volume' });
      container.appendChild(slider);

      const label = slider.querySelector('.dos-slider__label-text');
      expect(label?.textContent).toBe('Volume');
    });

    it('renders value display when showValue is true', () => {
      const slider = createSlider({ value: 75, showValue: true });
      container.appendChild(slider);

      const valueDisplay = slider.querySelector('.dos-slider__value-display');
      expect(valueDisplay?.textContent).toBe('75');
    });

    it('renders all size variants', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        const slider = createSlider({ size });
        container.appendChild(slider);

        expect(slider.classList.contains(`dos-slider--${size}`)).toBe(true);
      });
    });

    it('renders tick marks when showTicks is true', () => {
      const slider = createSlider({ showTicks: true, tickCount: 5 });
      container.appendChild(slider);

      const ticks = slider.querySelector('.dos-slider__ticks');
      expect(ticks).not.toBeNull();
      expect(ticks?.querySelectorAll('.dos-slider__tick').length).toBe(5);
    });

    it('renders ASCII track characters', () => {
      const slider = createSlider();
      container.appendChild(slider);

      const trackStart = slider.querySelector('.dos-slider__track-start');
      const trackEnd = slider.querySelector('.dos-slider__track-end');

      expect(trackStart?.textContent).toBe('├');
      expect(trackEnd?.textContent).toBe('┤');
    });

    it('renders thumb with block character', () => {
      const slider = createSlider();
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.textContent).toBe('█');
    });
  });

  describe('value constraints', () => {
    it('respects min/max bounds on initial value', () => {
      const slider = createSlider({ min: 0, max: 100, value: 150 });
      container.appendChild(slider);

      expect(slider.getValue()).toBe(100);
    });

    it('respects min bound', () => {
      const slider = createSlider({ min: 10, max: 100, value: 5 });
      container.appendChild(slider);

      expect(slider.getValue()).toBe(10);
    });

    it('respects step value', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10, value: 45 });
      container.appendChild(slider);

      // Should round to nearest step
      expect(slider.getValue()).toBe(45);
    });
  });

  describe('range mode', () => {
    it('renders two thumbs in range mode', () => {
      const slider = createSlider({ range: true });
      container.appendChild(slider);

      const thumbs = slider.querySelectorAll('.dos-slider__thumb');
      expect(thumbs.length).toBe(2);
    });

    it('renders with range class', () => {
      const slider = createSlider({ range: true });
      container.appendChild(slider);

      expect(slider.classList.contains('dos-slider--range')).toBe(true);
    });

    it('accepts array value in range mode', () => {
      const slider = createSlider({ range: true, value: [25, 75] });
      container.appendChild(slider);

      expect(slider.getValue()).toEqual([25, 75]);
    });

    it('displays range value correctly', () => {
      const slider = createSlider({ range: true, value: [25, 75], showValue: true });
      container.appendChild(slider);

      const valueDisplay = slider.querySelector('.dos-slider__value-display');
      expect(valueDisplay?.textContent).toBe('25 - 75');
    });
  });

  describe('keyboard navigation', () => {
    it('increases value with ArrowRight', () => {
      const slider = createSlider({ value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(51);
    });

    it('increases value with ArrowUp', () => {
      const slider = createSlider({ value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(51);
    });

    it('decreases value with ArrowLeft', () => {
      const slider = createSlider({ value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(49);
    });

    it('decreases value with ArrowDown', () => {
      const slider = createSlider({ value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(49);
    });

    it('jumps to min with Home', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(0);
    });

    it('jumps to max with End', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(100);
    });

    it('increases by large step with PageUp', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(60);
    });

    it('decreases by large step with PageDown', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50, step: 1 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(40);
    });
  });

  describe('callbacks', () => {
    it('calls onChange when value changes via keyboard', () => {
      const onChange = vi.fn();
      const slider = createSlider({ value: 50, onChange });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      thumb.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(51);
    });

    it('calls onChangeEnd after keyboard navigation', () => {
      const onChangeEnd = vi.fn();
      const slider = createSlider({ value: 50, onChangeEnd });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      thumb.dispatchEvent(event);

      expect(onChangeEnd).toHaveBeenCalledWith(51);
    });

    it('calls onFocus when thumb receives focus', () => {
      const onFocus = vi.fn();
      const slider = createSlider({ onFocus });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      thumb.focus();

      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when thumb loses focus', () => {
      const onBlur = vi.fn();
      const slider = createSlider({ onBlur });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      thumb.focus();
      thumb.blur();

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('renders disabled state', () => {
      const slider = createSlider({ disabled: true });
      container.appendChild(slider);

      expect(slider.classList.contains('dos-slider--disabled')).toBe(true);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('tabindex')).toBe('-1');
      expect(thumb?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not respond to keyboard when disabled', () => {
      const onChange = vi.fn();
      const slider = createSlider({ value: 50, disabled: true, onChange });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      thumb.dispatchEvent(event);

      expect(slider.getValue()).toBe(50);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('can be disabled programmatically', () => {
      const slider = createSlider();
      container.appendChild(slider);

      slider.setDisabled(true);

      expect(slider.classList.contains('dos-slider--disabled')).toBe(true);
    });
  });

  describe('public methods', () => {
    it('getValue returns current value', () => {
      const slider = createSlider({ value: 42 });
      container.appendChild(slider);

      expect(slider.getValue()).toBe(42);
    });

    it('setValue updates the value', () => {
      const slider = createSlider({ value: 0 });
      container.appendChild(slider);

      slider.setValue(75);

      expect(slider.getValue()).toBe(75);
    });

    it('setValue does not call onChange', () => {
      const onChange = vi.fn();
      const slider = createSlider({ value: 0, onChange });
      container.appendChild(slider);

      slider.setValue(75);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('setMin updates minimum value', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50 });
      container.appendChild(slider);

      slider.setMin(60);

      expect(slider.getValue()).toBe(60);
    });

    it('setMax updates maximum value', () => {
      const slider = createSlider({ min: 0, max: 100, value: 50 });
      container.appendChild(slider);

      slider.setMax(40);

      expect(slider.getValue()).toBe(40);
    });

    it('destroy removes the element', () => {
      const slider = createSlider();
      container.appendChild(slider);

      expect(container.contains(slider)).toBe(true);

      slider.destroy();

      expect(container.contains(slider)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="slider"', () => {
      const slider = createSlider();
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('role')).toBe('slider');
    });

    it('has aria-valuemin', () => {
      const slider = createSlider({ min: 10 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-valuemin')).toBe('10');
    });

    it('has aria-valuemax', () => {
      const slider = createSlider({ max: 200 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-valuemax')).toBe('200');
    });

    it('has aria-valuenow', () => {
      const slider = createSlider({ value: 50 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuetext', () => {
      const slider = createSlider({ value: 50 });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-valuetext')).toBe('50');
    });

    it('uses custom formatValue for aria-valuetext', () => {
      const slider = createSlider({
        value: 50,
        formatValue: (v) => `${v}%`,
      });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-valuetext')).toBe('50%');
    });

    it('has aria-labelledby when label provided', () => {
      const slider = createSlider({ label: 'Volume', id: 'test-slider' });
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb');
      expect(thumb?.getAttribute('aria-labelledby')).toBe('test-slider-label');
    });

    it('is keyboard accessible', () => {
      const slider = createSlider();
      container.appendChild(slider);

      const thumb = slider.querySelector('.dos-slider__thumb') as HTMLElement;
      expect(thumb.tabIndex).not.toBe(-1);
    });
  });

  describe('form integration', () => {
    it('creates hidden input with name', () => {
      const slider = createSlider({ name: 'volume', value: 50 });
      container.appendChild(slider);

      const input = slider.querySelector('input[name="volume"]') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.value).toBe('50');
    });

    it('updates hidden input when value changes', () => {
      const slider = createSlider({ name: 'volume', value: 50 });
      container.appendChild(slider);

      slider.setValue(75);

      const input = slider.querySelector('input[name="volume"]') as HTMLInputElement;
      expect(input.value).toBe('75');
    });

    it('creates two hidden inputs for range mode', () => {
      const slider = createSlider({ name: 'range', range: true, value: [25, 75] });
      container.appendChild(slider);

      const inputMin = slider.querySelector('input[name="range-min"]') as HTMLInputElement;
      const inputMax = slider.querySelector('input[name="range-max"]') as HTMLInputElement;

      expect(inputMin).not.toBeNull();
      expect(inputMax).not.toBeNull();
      expect(inputMin.value).toBe('25');
      expect(inputMax.value).toBe('75');
    });
  });

  describe('value display', () => {
    it('updates value display when value changes', () => {
      const slider = createSlider({ value: 50, showValue: true });
      container.appendChild(slider);

      slider.setValue(75);

      const valueDisplay = slider.querySelector('.dos-slider__value-display');
      expect(valueDisplay?.textContent).toBe('75');
    });

    it('uses formatValue for display', () => {
      const slider = createSlider({
        value: 50,
        showValue: true,
        formatValue: (v) => `${v}%`,
      });
      container.appendChild(slider);

      const valueDisplay = slider.querySelector('.dos-slider__value-display');
      expect(valueDisplay?.textContent).toBe('50%');
    });
  });
});
