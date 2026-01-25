/**
 * @file ProgressBar component
 * @description DOS-style progress bar with block characters
 */

import type {
  ProgressBarProps,
  ProgressBarInstance,
  ProgressBarSize,
  ProgressBarStyle,
} from './ProgressBar.types';
import './ProgressBar.css';

/**
 * Default value formatter - shows percentage
 */
function defaultValueFormatter(value: number, max: number): string {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return `${percentage}%`;
}

/**
 * Creates a DOS-style progress bar element
 *
 * @param props - Progress bar configuration
 * @returns Progress bar instance with element and control methods
 *
 * @example
 * ```ts
 * const progress = createProgressBar({
 *   value: 50,
 *   max: 100,
 *   showValue: true,
 *   label: 'Loading progress'
 * });
 *
 * document.body.appendChild(progress.element);
 *
 * // Update progress
 * progress.setValue(75);
 * ```
 */
export function createProgressBar(props: ProgressBarProps = {}): ProgressBarInstance {
  const {
    value: initialValue = 0,
    max: initialMax = 100,
    showValue = false,
    valueFormat = defaultValueFormatter,
    indeterminate: initialIndeterminate = false,
    size = 'medium',
    style = 'blocks',
    color,
    label,
    id,
    className,
  } = props;

  // State
  let currentValue = Math.max(0, Math.min(initialValue, initialMax));
  let currentMax = Math.max(1, initialMax);
  let isIndeterminate = initialIndeterminate;

  // Create DOM elements
  const element = document.createElement('div');
  const progressId = id ?? `dos-progress-bar-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  element.id = progressId;
  element.className = buildClassName(size, style, isIndeterminate, !!color, className);

  // Track element
  const track = document.createElement('div');
  track.className = 'dos-progress-bar__track';

  // Fill element
  const fill = document.createElement('div');
  fill.className = 'dos-progress-bar__fill';
  track.appendChild(fill);

  element.appendChild(track);

  // Value display
  let valueElement: HTMLSpanElement | null = null;
  if (showValue) {
    valueElement = document.createElement('span');
    valueElement.className = 'dos-progress-bar__value';
    element.appendChild(valueElement);
  }

  // ARIA attributes
  element.setAttribute('role', 'progressbar');
  element.setAttribute('aria-valuemin', '0');
  
  if (label) {
    element.setAttribute('aria-label', label);
  }

  // Apply custom color
  if (color) {
    fill.style.color = color;
  }

  // Initial render
  updateProgressBar();

  /**
   * Build the class name string
   */
  function buildClassName(
    sz: ProgressBarSize,
    st: ProgressBarStyle,
    indet: boolean,
    hasCustomColor: boolean,
    extra?: string
  ): string {
    const classes = [
      'dos-progress-bar',
      `dos-progress-bar--${sz}`,
      `dos-progress-bar--${st}`,
    ];

    if (indet) {
      classes.push('dos-progress-bar--indeterminate');
    }

    if (hasCustomColor) {
      classes.push('dos-progress-bar--custom-color');
    }

    if (extra) {
      classes.push(extra);
    }

    return classes.join(' ');
  }

  /**
   * Update the progress bar display
   */
  function updateProgressBar(): void {
    const percentage = currentMax > 0 ? (currentValue / currentMax) * 100 : 0;

    if (isIndeterminate) {
      // Indeterminate mode - ARIA indicates unknown progress
      element.removeAttribute('aria-valuenow');
      element.removeAttribute('aria-valuetext');
      element.setAttribute('aria-valuemax', String(currentMax));

      if (valueElement) {
        valueElement.textContent = '...';
      }
    } else {
      // Determinate mode
      element.setAttribute('aria-valuenow', String(currentValue));
      element.setAttribute('aria-valuemax', String(currentMax));
      element.setAttribute('aria-valuetext', valueFormat(currentValue, currentMax));

      // Update fill width
      fill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;

      if (valueElement) {
        valueElement.textContent = valueFormat(currentValue, currentMax);
      }
    }
  }

  // Instance methods
  const instance: ProgressBarInstance = {
    get element() {
      return element;
    },

    setValue(value: number): void {
      currentValue = Math.max(0, Math.min(value, currentMax));
      updateProgressBar();
    },

    getValue(): number {
      return currentValue;
    },

    setMax(max: number): void {
      currentMax = Math.max(1, max);
      currentValue = Math.min(currentValue, currentMax);
      updateProgressBar();
    },

    getMax(): number {
      return currentMax;
    },

    getPercentage(): number {
      return currentMax > 0 ? Math.round((currentValue / currentMax) * 100) : 0;
    },

    setIndeterminate(indeterminate: boolean): void {
      isIndeterminate = indeterminate;
      element.className = buildClassName(size, style, isIndeterminate, !!color, className);
      updateProgressBar();
    },

    isIndeterminate(): boolean {
      return isIndeterminate;
    },

    destroy(): void {
      element.remove();
    },
  };

  return instance;
}
