/**
 * Slider/Range Component
 *
 * DOS-style slider with ASCII track and thumb.
 * Supports single value and range selection.
 */

import type { SliderProps, SliderElement } from './Slider.types';
import './Slider.css';

let sliderIdCounter = 0;

/**
 * Generates a unique ID for slider elements.
 */
function generateSliderId(): string {
  return `dos-slider-${++sliderIdCounter}`;
}

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a value to the nearest step.
 */
function roundToStep(value: number, step: number, min: number): number {
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

/**
 * Creates a DOS-style slider component.
 *
 * @param props - Slider configuration options
 * @returns Slider DOM element with control methods
 *
 * @example
 * ```typescript
 * const slider = createSlider({
 *   label: 'Volume',
 *   min: 0,
 *   max: 100,
 *   value: 50,
 *   showValue: true,
 *   onChange: (value) => console.log('Value:', value)
 * });
 * document.body.appendChild(slider);
 * ```
 */
export function createSlider(props: SliderProps = {}): SliderElement {
  const {
    value: initialValue = 0,
    min: initialMin = 0,
    max: initialMax = 100,
    step = 1,
    label,
    showValue = false,
    showTicks = false,
    tickCount = 5,
    range = false,
    size = 'md',
    name,
    disabled = false,
    onChange,
    onChangeEnd,
    onFocus,
    onBlur,
    formatValue,
    className,
    id,
  } = props;

  // State
  let minValue = initialMin;
  let maxValue = initialMax;
  let isDisabled = disabled;
  let currentValue: number | [number, number];
  let isDragging = false;
  let activeThumb: 'min' | 'max' | null = null;

  // Initialize value
  if (range) {
    if (Array.isArray(initialValue)) {
      currentValue = [
        clamp(initialValue[0], minValue, maxValue),
        clamp(initialValue[1], minValue, maxValue),
      ];
    } else {
      currentValue = [minValue, clamp(initialValue, minValue, maxValue)];
    }
  } else {
    currentValue = clamp(
      Array.isArray(initialValue) ? initialValue[0] : initialValue,
      minValue,
      maxValue
    );
  }

  // Generate unique ID
  const sliderId = id ?? generateSliderId();
  const labelId = `${sliderId}-label`;

  // Create wrapper element
  const wrapper = document.createElement('div') as unknown as SliderElement;
  wrapper.id = sliderId;
  wrapper.className = buildWrapperClasses();

  // Create label row if needed
  let valueDisplay: HTMLSpanElement | null = null;
  if (label || showValue) {
    const labelRow = document.createElement('div');
    labelRow.className = 'dos-slider__label';

    if (label) {
      const labelText = document.createElement('span');
      labelText.id = labelId;
      labelText.className = 'dos-slider__label-text';
      labelText.textContent = label;
      labelRow.appendChild(labelText);
    }

    if (showValue) {
      valueDisplay = document.createElement('span');
      valueDisplay.className = 'dos-slider__value-display';
      valueDisplay.textContent = formatDisplayValue();
      labelRow.appendChild(valueDisplay);
    }

    wrapper.appendChild(labelRow);
  }

  // Create track container
  const trackContainer = document.createElement('div');
  trackContainer.className = 'dos-slider__track-container';

  // Create track
  const track = document.createElement('div');
  track.className = 'dos-slider__track';

  // ASCII track start: ├
  const trackStart = document.createElement('span');
  trackStart.className = 'dos-slider__track-start';
  trackStart.textContent = '├';
  trackStart.setAttribute('aria-hidden', 'true');
  track.appendChild(trackStart);

  // Track line area
  const trackLine = document.createElement('div');
  trackLine.className = 'dos-slider__track-line';

  // Fill element
  const fill = document.createElement('div');
  fill.className = 'dos-slider__fill';
  trackLine.appendChild(fill);

  // Unfill element
  const unfill = document.createElement('div');
  unfill.className = 'dos-slider__unfill';
  trackLine.appendChild(unfill);

  // Create thumb(s)
  let thumbMin: HTMLDivElement | null = null;

  if (range) {
    thumbMin = createThumb('min');
    trackLine.appendChild(thumbMin);
  }

  const thumbMax = createThumb(range ? 'max' : 'single');
  trackLine.appendChild(thumbMax);

  track.appendChild(trackLine);

  // ASCII track end: ┤
  const trackEnd = document.createElement('span');
  trackEnd.className = 'dos-slider__track-end';
  trackEnd.textContent = '┤';
  trackEnd.setAttribute('aria-hidden', 'true');
  track.appendChild(trackEnd);

  trackContainer.appendChild(track);
  wrapper.appendChild(trackContainer);

  // Create ticks if needed
  if (showTicks && tickCount > 1) {
    const ticks = document.createElement('div');
    ticks.className = 'dos-slider__ticks';

    for (let i = 0; i < tickCount; i++) {
      const tickValue = minValue + ((maxValue - minValue) * i) / (tickCount - 1);
      const tick = document.createElement('div');
      tick.className = 'dos-slider__tick';

      const tickMark = document.createElement('span');
      tickMark.className = 'dos-slider__tick-mark';
      tickMark.textContent = '│';
      tick.appendChild(tickMark);

      const tickLabel = document.createElement('span');
      tickLabel.className = 'dos-slider__tick-label';
      tickLabel.textContent = formatValue ? formatValue(tickValue) : String(Math.round(tickValue));
      tick.appendChild(tickLabel);

      ticks.appendChild(tick);
    }

    wrapper.appendChild(ticks);
  }

  // Create hidden input(s) for form submission
  const hiddenInputs: HTMLInputElement[] = [];
  if (name) {
    if (range) {
      const inputMin = createHiddenInput(`${name}-min`);
      const inputMax = createHiddenInput(`${name}-max`);
      hiddenInputs.push(inputMin, inputMax);
      wrapper.appendChild(inputMin);
      wrapper.appendChild(inputMax);
    } else {
      const input = createHiddenInput(name);
      hiddenInputs.push(input);
      wrapper.appendChild(input);
    }
    updateHiddenInputs();
  }

  // Initial position update
  updateThumbPositions();

  /**
   * Creates a hidden input element.
   */
  function createHiddenInput(inputName: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = inputName;
    input.className = 'dos-slider__input';
    return input;
  }

  /**
   * Creates a thumb element.
   */
  function createThumb(type: 'min' | 'max' | 'single'): HTMLDivElement {
    const thumb = document.createElement('div');
    thumb.className = `dos-slider__thumb${type !== 'single' ? ` dos-slider__thumb--${type}` : ''}`;
    thumb.setAttribute('role', 'slider');
    thumb.setAttribute('tabindex', isDisabled ? '-1' : '0');
    thumb.setAttribute('aria-valuemin', String(minValue));
    thumb.setAttribute('aria-valuemax', String(maxValue));
    thumb.textContent = '█';

    if (label) {
      thumb.setAttribute('aria-labelledby', labelId);
    }

    if (isDisabled) {
      thumb.setAttribute('aria-disabled', 'true');
    }

    updateThumbAria(thumb, type);

    // Event listeners
    thumb.addEventListener('mousedown', (e) => handleThumbMouseDown(e, type));
    thumb.addEventListener('keydown', (e) => handleThumbKeydown(e, type));
    thumb.addEventListener('focus', handleFocus);
    thumb.addEventListener('blur', handleBlur);

    return thumb;
  }

  /**
   * Updates ARIA attributes on a thumb.
   */
  function updateThumbAria(thumb: HTMLDivElement, type: 'min' | 'max' | 'single'): void {
    let val: number;
    if (range && Array.isArray(currentValue)) {
      val = type === 'min' ? currentValue[0] : currentValue[1];
    } else {
      val = currentValue as number;
    }

    thumb.setAttribute('aria-valuenow', String(val));
    thumb.setAttribute(
      'aria-valuetext',
      formatValue ? formatValue(val) : String(val)
    );
  }

  /**
   * Builds the wrapper class string.
   */
  function buildWrapperClasses(): string {
    const classes = ['dos-slider'];
    classes.push(`dos-slider--${size}`);
    if (range) classes.push('dos-slider--range');
    if (isDisabled) classes.push('dos-slider--disabled');
    if (isDragging) classes.push('dos-slider--dragging');
    if (className) classes.push(className);
    return classes.join(' ');
  }

  /**
   * Formats the value for display.
   */
  function formatDisplayValue(): string {
    if (range && Array.isArray(currentValue)) {
      const minStr = formatValue ? formatValue(currentValue[0]) : String(currentValue[0]);
      const maxStr = formatValue ? formatValue(currentValue[1]) : String(currentValue[1]);
      return `${minStr} - ${maxStr}`;
    }
    const val = currentValue as number;
    return formatValue ? formatValue(val) : String(val);
  }

  /**
   * Gets the percentage position for a value.
   */
  function getPercentage(val: number): number {
    return ((val - minValue) / (maxValue - minValue)) * 100;
  }

  /**
   * Gets the value from a percentage.
   */
  function getValueFromPercentage(percentage: number): number {
    const raw = minValue + (percentage / 100) * (maxValue - minValue);
    return roundToStep(clamp(raw, minValue, maxValue), step, minValue);
  }

  /**
   * Updates thumb positions and fill.
   */
  function updateThumbPositions(): void {
    if (range && Array.isArray(currentValue)) {
      const minPercent = getPercentage(currentValue[0]);
      const maxPercent = getPercentage(currentValue[1]);

      if (thumbMin) {
        thumbMin.style.left = `${minPercent}%`;
        updateThumbAria(thumbMin, 'min');
      }
      thumbMax.style.left = `${maxPercent}%`;
      updateThumbAria(thumbMax, 'max');

      // Fill between thumbs
      fill.style.left = `${minPercent}%`;
      fill.style.width = `${maxPercent - minPercent}%`;
      unfill.style.width = `0%`;
    } else {
      const percent = getPercentage(currentValue as number);
      thumbMax.style.left = `${percent}%`;
      updateThumbAria(thumbMax, 'single');

      // Fill from start to thumb
      fill.style.left = '0%';
      fill.style.width = `${percent}%`;
      unfill.style.left = `${percent}%`;
      unfill.style.width = `${100 - percent}%`;
    }

    // Update value display
    if (valueDisplay) {
      valueDisplay.textContent = formatDisplayValue();
    }

    // Update hidden inputs
    updateHiddenInputs();
  }

  /**
   * Updates hidden input values.
   */
  function updateHiddenInputs(): void {
    if (range && Array.isArray(currentValue)) {
      if (hiddenInputs[0]) hiddenInputs[0].value = String(currentValue[0]);
      if (hiddenInputs[1]) hiddenInputs[1].value = String(currentValue[1]);
    } else {
      if (hiddenInputs[0]) hiddenInputs[0].value = String(currentValue);
    }
  }

  /**
   * Sets the value and triggers callbacks.
   */
  function setValue(
    newValue: number | [number, number],
    triggerCallback = true
  ): void {
    if (range) {
      if (Array.isArray(newValue)) {
        currentValue = [
          clamp(newValue[0], minValue, maxValue),
          clamp(newValue[1], minValue, maxValue),
        ];
        // Ensure min <= max
        if (currentValue[0] > currentValue[1]) {
          [currentValue[0], currentValue[1]] = [currentValue[1], currentValue[0]];
        }
      }
    } else {
      currentValue = clamp(
        Array.isArray(newValue) ? newValue[0] : newValue,
        minValue,
        maxValue
      );
    }

    updateThumbPositions();

    if (triggerCallback) {
      onChange?.(currentValue);
    }
  }

  /**
   * Handles mouse down on thumb.
   */
  function handleThumbMouseDown(e: MouseEvent, type: 'min' | 'max' | 'single'): void {
    if (isDisabled) return;
    e.preventDefault();

    isDragging = true;
    activeThumb = type === 'single' ? 'max' : type;
    wrapper.className = buildWrapperClasses();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * Handles mouse move during drag.
   */
  function handleMouseMove(e: MouseEvent): void {
    if (!isDragging || !activeThumb) return;

    const rect = trackLine.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);

    if (range && Array.isArray(currentValue)) {
      if (activeThumb === 'min') {
        setValue([Math.min(newValue, currentValue[1]), currentValue[1]]);
      } else {
        setValue([currentValue[0], Math.max(newValue, currentValue[0])]);
      }
    } else {
      setValue(newValue);
    }
  }

  /**
   * Handles mouse up to end drag.
   */
  function handleMouseUp(): void {
    if (isDragging) {
      isDragging = false;
      activeThumb = null;
      wrapper.className = buildWrapperClasses();
      onChangeEnd?.(currentValue);
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  /**
   * Handles keyboard navigation on thumb.
   */
  function handleThumbKeydown(e: KeyboardEvent, type: 'min' | 'max' | 'single'): void {
    if (isDisabled) return;

    const largeStep = step * 10;
    let delta = 0;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        delta = step;
        break;

      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        delta = -step;
        break;

      case 'PageUp':
        e.preventDefault();
        delta = largeStep;
        break;

      case 'PageDown':
        e.preventDefault();
        delta = -largeStep;
        break;

      case 'Home':
        e.preventDefault();
        if (range && Array.isArray(currentValue)) {
          if (type === 'min' || type === 'single') {
            setValue([minValue, currentValue[1]]);
          } else {
            setValue([currentValue[0], currentValue[0]]);
          }
        } else {
          setValue(minValue);
        }
        onChangeEnd?.(currentValue);
        return;

      case 'End':
        e.preventDefault();
        if (range && Array.isArray(currentValue)) {
          if (type === 'max' || type === 'single') {
            setValue([currentValue[0], maxValue]);
          } else {
            setValue([currentValue[1], currentValue[1]]);
          }
        } else {
          setValue(maxValue);
        }
        onChangeEnd?.(currentValue);
        return;

      default:
        return;
    }

    if (delta !== 0) {
      if (range && Array.isArray(currentValue)) {
        if (type === 'min') {
          const newMin = clamp(currentValue[0] + delta, minValue, currentValue[1]);
          setValue([newMin, currentValue[1]]);
        } else {
          const newMax = clamp(currentValue[1] + delta, currentValue[0], maxValue);
          setValue([currentValue[0], newMax]);
        }
      } else {
        setValue((currentValue as number) + delta);
      }
      onChangeEnd?.(currentValue);
    }
  }

  /**
   * Handles focus event.
   */
  function handleFocus(): void {
    onFocus?.();
  }

  /**
   * Handles blur event.
   */
  function handleBlur(): void {
    onBlur?.();
  }

  /**
   * Handles click on track to set value.
   */
  function handleTrackClick(e: MouseEvent): void {
    if (isDisabled) return;

    // Don't handle if clicked on thumb
    if (
      e.target === thumbMax ||
      (thumbMin && e.target === thumbMin)
    ) {
      return;
    }

    const rect = trackLine.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);

    if (range && Array.isArray(currentValue)) {
      // Determine which thumb is closer
      const distToMin = Math.abs(newValue - currentValue[0]);
      const distToMax = Math.abs(newValue - currentValue[1]);

      if (distToMin <= distToMax) {
        setValue([newValue, currentValue[1]]);
        thumbMin?.focus();
      } else {
        setValue([currentValue[0], newValue]);
        thumbMax.focus();
      }
    } else {
      setValue(newValue);
      thumbMax.focus();
    }

    onChangeEnd?.(currentValue);
  }

  // Attach track click handler
  trackContainer.addEventListener('click', handleTrackClick);

  // Public API methods
  wrapper.getValue = () => currentValue;

  wrapper.setValue = (newValue: number | [number, number]) => {
    setValue(newValue, false);
  };

  wrapper.setDisabled = (newDisabled: boolean) => {
    isDisabled = newDisabled;
    wrapper.className = buildWrapperClasses();

    const thumbs = [thumbMax];
    if (thumbMin) thumbs.push(thumbMin);

    thumbs.forEach((thumb) => {
      thumb.setAttribute('tabindex', isDisabled ? '-1' : '0');
      if (isDisabled) {
        thumb.setAttribute('aria-disabled', 'true');
      } else {
        thumb.removeAttribute('aria-disabled');
      }
    });

    hiddenInputs.forEach((input) => {
      input.disabled = isDisabled;
    });
  };

  wrapper.setMin = (newMin: number) => {
    minValue = newMin;
    if (range && Array.isArray(currentValue)) {
      currentValue = [
        Math.max(currentValue[0], minValue),
        Math.max(currentValue[1], minValue),
      ];
    } else {
      currentValue = Math.max(currentValue as number, minValue);
    }
    updateThumbPositions();

    const thumbs = [thumbMax];
    if (thumbMin) thumbs.push(thumbMin);
    thumbs.forEach((thumb) => {
      thumb.setAttribute('aria-valuemin', String(minValue));
    });
  };

  wrapper.setMax = (newMax: number) => {
    maxValue = newMax;
    if (range && Array.isArray(currentValue)) {
      currentValue = [
        Math.min(currentValue[0], maxValue),
        Math.min(currentValue[1], maxValue),
      ];
    } else {
      currentValue = Math.min(currentValue as number, maxValue);
    }
    updateThumbPositions();

    const thumbs = [thumbMax];
    if (thumbMin) thumbs.push(thumbMin);
    thumbs.forEach((thumb) => {
      thumb.setAttribute('aria-valuemax', String(maxValue));
    });
  };

  wrapper.destroy = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    trackContainer.removeEventListener('click', handleTrackClick);
    wrapper.remove();
  };

  return wrapper;
}
