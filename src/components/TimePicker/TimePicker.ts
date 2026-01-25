/**
 * TimePicker component
 * DOS-style time picker with spinbox inputs
 */

import type {
  TimePickerProps,
  TimePickerElement,
  TimeFormat,
  TimePeriod,
  ParsedTime,
} from './TimePicker.types';
import './TimePicker.css';

/**
 * Create a default ParsedTime object
 */
function createDefaultTime(format: TimeFormat, hours?: number, minutes?: number): ParsedTime {
  if (format === '12h') {
    return { 
      hours: hours ?? 12, 
      minutes: minutes ?? 0, 
      period: 'AM' 
    };
  }
  return { 
    hours: hours ?? 0, 
    minutes: minutes ?? 0 
  };
}

/**
 * Parse a time string or Date to ParsedTime
 */
function parseTime(value: string | Date | undefined | null, format: TimeFormat): ParsedTime | null {
  if (!value) return null;

  let hours: number;
  let minutes: number;
  let period: TimePeriod | undefined;

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    hours = value.getHours();
    minutes = value.getMinutes();
  } else {
    // Parse string in various formats
    // Supported: "HH:MM", "H:MM", "HH:MM AM", "HH:MM PM", "H:MM AM/PM"
    const timeMatch = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!timeMatch || !timeMatch[1] || !timeMatch[2]) return null;

    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
    const parsedPeriod = timeMatch[3]?.toUpperCase() as TimePeriod | undefined;

    // Handle AM/PM in input
    if (parsedPeriod) {
      if (hours === 12) {
        hours = parsedPeriod === 'AM' ? 0 : 12;
      } else if (parsedPeriod === 'PM') {
        hours += 12;
      }
    }
  }

  // Validate
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  // Convert to format-specific representation
  if (format === '12h') {
    period = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }
    return { hours, minutes, period };
  }

  return { hours, minutes };
}

/**
 * Format ParsedTime to string
 */
function formatTime(parsed: ParsedTime | null, format: TimeFormat): string {
  if (!parsed) return '';

  const { hours, minutes, period } = parsed;
  const paddedMinutes = minutes.toString().padStart(2, '0');

  if (format === '24h') {
    const paddedHours = hours.toString().padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}`;
  } else {
    // 12-hour format
    return `${hours}:${paddedMinutes} ${period || 'AM'}`;
  }
}

/**
 * Parse time string to minutes since midnight for comparison
/* Reserved for future min/max validation:
 * parseTimeToMinutes(timeStr: string): number | null
 * isTimeInBounds(hours24: number, minutes: number, minStr?: string, maxStr?: string): boolean
 */

/**
 * Creates a DOS-style TimePicker component
 */
export function createTimePicker(props: TimePickerProps): TimePickerElement {
  const {
    value: initialValue,
    label,
    format = '12h',
    step = 1,
    min: _min = undefined,
    max: _max = undefined,
    disabled = false,
    error: initialError,
    name,
    required = false,
    onChange,
  } = props;

  // Parse initial value
  let currentTime = parseTime(initialValue, format);
  let currentDisabled = disabled;
  let currentError = initialError;

  // Create main container
  const container = document.createElement('div') as TimePickerElement;
  container.className = 'dos-time-picker';

  if (currentDisabled) {
    container.classList.add('dos-time-picker--disabled');
  }
  if (currentError) {
    container.classList.add('dos-time-picker--error');
  }

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = document.createElement('label');
    labelElement.className = 'dos-time-picker___label';
    if (required) {
      labelElement.classList.add('dos-time-picker___label--required');
    }
    labelElement.textContent = label;
    container.appendChild(labelElement);
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-time-picker___input-wrapper';

  // Create hidden input for form submission
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.className = 'dos-time-picker___hidden';
  if (name) hiddenInput.name = name;
  hiddenInput.value = formatTime(currentTime, format);
  inputWrapper.appendChild(hiddenInput);

  // Create hours field
  const hoursField = document.createElement('div');
  hoursField.className = 'dos-time-picker___field';

  const hoursUp = document.createElement('button');
  hoursUp.type = 'button';
  hoursUp.className = 'dos-time-picker___spinner dos-time-picker___spinner--up';
  hoursUp.textContent = '▲';
  hoursUp.setAttribute('aria-label', 'Increase hours');
  hoursUp.setAttribute('tabindex', '-1');
  hoursUp.disabled = currentDisabled;

  const hoursInput = document.createElement('input');
  hoursInput.type = 'text';
  hoursInput.className = 'dos-time-picker___input';
  hoursInput.setAttribute('role', 'spinbutton');
  hoursInput.setAttribute('aria-label', 'Hours');
  hoursInput.setAttribute('aria-valuemin', format === '12h' ? '1' : '0');
  hoursInput.setAttribute('aria-valuemax', format === '12h' ? '12' : '23');
  hoursInput.disabled = currentDisabled;
  hoursInput.value = currentTime ? currentTime.hours.toString().padStart(2, '0') : '--';
  if (currentTime) {
    hoursInput.setAttribute('aria-valuenow', currentTime.hours.toString());
  }

  const hoursDown = document.createElement('button');
  hoursDown.type = 'button';
  hoursDown.className = 'dos-time-picker___spinner dos-time-picker___spinner--down';
  hoursDown.textContent = '▼';
  hoursDown.setAttribute('aria-label', 'Decrease hours');
  hoursDown.setAttribute('tabindex', '-1');
  hoursDown.disabled = currentDisabled;

  hoursField.appendChild(hoursUp);
  hoursField.appendChild(hoursInput);
  hoursField.appendChild(hoursDown);
  inputWrapper.appendChild(hoursField);

  // Create separator
  const separator = document.createElement('span');
  separator.className = 'dos-time-picker___separator';
  separator.textContent = ':';
  separator.setAttribute('aria-hidden', 'true');
  inputWrapper.appendChild(separator);

  // Create minutes field
  const minutesField = document.createElement('div');
  minutesField.className = 'dos-time-picker___field';

  const minutesUp = document.createElement('button');
  minutesUp.type = 'button';
  minutesUp.className = 'dos-time-picker___spinner dos-time-picker___spinner--up';
  minutesUp.textContent = '▲';
  minutesUp.setAttribute('aria-label', 'Increase minutes');
  minutesUp.setAttribute('tabindex', '-1');
  minutesUp.disabled = currentDisabled;

  const minutesInput = document.createElement('input');
  minutesInput.type = 'text';
  minutesInput.className = 'dos-time-picker___input';
  minutesInput.setAttribute('role', 'spinbutton');
  minutesInput.setAttribute('aria-label', 'Minutes');
  minutesInput.setAttribute('aria-valuemin', '0');
  minutesInput.setAttribute('aria-valuemax', '59');
  minutesInput.disabled = currentDisabled;
  minutesInput.value = currentTime ? currentTime.minutes.toString().padStart(2, '0') : '--';
  if (currentTime) {
    minutesInput.setAttribute('aria-valuenow', currentTime.minutes.toString());
  }

  const minutesDown = document.createElement('button');
  minutesDown.type = 'button';
  minutesDown.className = 'dos-time-picker___spinner dos-time-picker___spinner--down';
  minutesDown.textContent = '▼';
  minutesDown.setAttribute('aria-label', 'Decrease minutes');
  minutesDown.setAttribute('tabindex', '-1');
  minutesDown.disabled = currentDisabled;

  minutesField.appendChild(minutesUp);
  minutesField.appendChild(minutesInput);
  minutesField.appendChild(minutesDown);
  inputWrapper.appendChild(minutesField);

  // Create period selector for 12h format
  let periodContainer: HTMLDivElement | null = null;
  let amButton: HTMLButtonElement | null = null;
  let pmButton: HTMLButtonElement | null = null;

  if (format === '12h') {
    periodContainer = document.createElement('div');
    periodContainer.className = 'dos-time-picker___period';

    amButton = document.createElement('button');
    amButton.type = 'button';
    amButton.className = 'dos-time-picker___period-btn';
    amButton.textContent = 'AM';
    amButton.setAttribute('aria-label', 'Select AM');
    amButton.disabled = currentDisabled;
    if (currentTime?.period === 'AM') {
      amButton.classList.add('dos-time-picker___period-btn--active');
      amButton.setAttribute('aria-pressed', 'true');
    } else {
      amButton.setAttribute('aria-pressed', 'false');
    }

    pmButton = document.createElement('button');
    pmButton.type = 'button';
    pmButton.className = 'dos-time-picker___period-btn';
    pmButton.textContent = 'PM';
    pmButton.setAttribute('aria-label', 'Select PM');
    pmButton.disabled = currentDisabled;
    if (currentTime?.period === 'PM') {
      pmButton.classList.add('dos-time-picker___period-btn--active');
      pmButton.setAttribute('aria-pressed', 'true');
    } else {
      pmButton.setAttribute('aria-pressed', 'false');
    }

    periodContainer.appendChild(amButton);
    periodContainer.appendChild(pmButton);
    inputWrapper.appendChild(periodContainer);
  }

  container.appendChild(inputWrapper);

  // Link label to hours input
  if (labelElement) {
    const inputId = `dos-timepicker-${Math.random().toString(36).slice(2, 11)}`;
    hoursInput.id = inputId;
    labelElement.htmlFor = inputId;
  }

  // Create error element
  let errorElement: HTMLDivElement | null = null;
  function createErrorElement(message: string): void {
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'dos-time-picker___error';
      errorElement.setAttribute('role', 'alert');
      container.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function removeErrorElement(): void {
    if (errorElement) {
      errorElement.remove();
      errorElement = null;
    }
  }

  // Show error if initially provided
  if (typeof currentError === 'string') {
    createErrorElement(currentError);
  }

  /**
   * Update the display values
   */
  function updateDisplay(): void {
    if (currentTime) {
      hoursInput.value = currentTime.hours.toString().padStart(2, '0');
      hoursInput.setAttribute('aria-valuenow', currentTime.hours.toString());
      minutesInput.value = currentTime.minutes.toString().padStart(2, '0');
      minutesInput.setAttribute('aria-valuenow', currentTime.minutes.toString());

      if (format === '12h' && amButton && pmButton) {
        if (currentTime.period === 'AM') {
          amButton.classList.add('dos-time-picker___period-btn--active');
          amButton.setAttribute('aria-pressed', 'true');
          pmButton.classList.remove('dos-time-picker___period-btn--active');
          pmButton.setAttribute('aria-pressed', 'false');
        } else {
          pmButton.classList.add('dos-time-picker___period-btn--active');
          pmButton.setAttribute('aria-pressed', 'true');
          amButton.classList.remove('dos-time-picker___period-btn--active');
          amButton.setAttribute('aria-pressed', 'false');
        }
      }
    } else {
      hoursInput.value = '--';
      hoursInput.removeAttribute('aria-valuenow');
      minutesInput.value = '--';
      minutesInput.removeAttribute('aria-valuenow');
      
      if (amButton && pmButton) {
        amButton.classList.remove('dos-time-picker___period-btn--active');
        amButton.setAttribute('aria-pressed', 'false');
        pmButton.classList.remove('dos-time-picker___period-btn--active');
        pmButton.setAttribute('aria-pressed', 'false');
      }
    }

    hiddenInput.value = formatTime(currentTime, format);
  }

  /**
   * Fire change callback
   */
  function fireChange(): void {
    const formatted = formatTime(currentTime, format);
    onChange?.(formatted, currentTime);
  }

  /**
   * Increment hours
   */
  function incrementHours(): void {
    if (currentDisabled) return;

    if (!currentTime) {
      // Initialize with default
      currentTime = createDefaultTime(format);
    } else {
      if (format === '12h') {
        currentTime.hours = currentTime.hours === 12 ? 1 : currentTime.hours + 1;
      } else {
        currentTime.hours = currentTime.hours === 23 ? 0 : currentTime.hours + 1;
      }
    }

    updateDisplay();
    fireChange();
  }

  /**
   * Decrement hours
   */
  function decrementHours(): void {
    if (currentDisabled) return;

    if (!currentTime) {
      if (format === '12h') {
        currentTime = { hours: 12, minutes: 0, period: 'PM' };
      } else {
        currentTime = { hours: 23, minutes: 0 };
      }
    } else {
      if (format === '12h') {
        currentTime.hours = currentTime.hours === 1 ? 12 : currentTime.hours - 1;
      } else {
        currentTime.hours = currentTime.hours === 0 ? 23 : currentTime.hours - 1;
      }
    }

    updateDisplay();
    fireChange();
  }

  /**
   * Increment minutes
   */
  function incrementMinutes(): void {
    if (currentDisabled) return;

    if (!currentTime) {
      currentTime = createDefaultTime(format);
    } else {
      currentTime.minutes = (currentTime.minutes + step) % 60;
      // If we wrap around, might want to increment hour (optional behavior)
      if (currentTime.minutes < step && step <= 59) {
        // Wrapped - don't auto-increment hour, keep at same hour
      }
    }

    updateDisplay();
    fireChange();
  }

  /**
   * Decrement minutes
   */
  function decrementMinutes(): void {
    if (currentDisabled) return;

    if (!currentTime) {
      currentTime = createDefaultTime(format, undefined, 60 - step);
    } else {
      currentTime.minutes = currentTime.minutes - step;
      if (currentTime.minutes < 0) {
        currentTime.minutes = 60 + currentTime.minutes;
      }
    }

    updateDisplay();
    fireChange();
  }

  /**
   * Set period (AM/PM)
   */
  function setPeriod(period: TimePeriod): void {
    if (currentDisabled || format !== '12h') return;

    if (!currentTime) {
      currentTime = { hours: 12, minutes: 0, period };
    } else {
      currentTime.period = period;
    }

    updateDisplay();
    fireChange();
  }

  /**
   * Handle hours input change
   */
  function handleHoursInput(): void {
    const value = parseInt(hoursInput.value, 10);
    if (isNaN(value)) return;

    const maxHours = format === '12h' ? 12 : 23;
    const minHours = format === '12h' ? 1 : 0;

    if (value >= minHours && value <= maxHours) {
      if (!currentTime) {
        currentTime = createDefaultTime(format, value);
      } else {
        currentTime.hours = value;
      }
      updateDisplay();
      fireChange();
    } else {
      // Reset to valid value
      updateDisplay();
    }
  }

  /**
   * Handle minutes input change
   */
  function handleMinutesInput(): void {
    const value = parseInt(minutesInput.value, 10);
    if (isNaN(value)) return;

    if (value >= 0 && value <= 59) {
      if (!currentTime) {
        currentTime = createDefaultTime(format, undefined, value);
      } else {
        currentTime.minutes = value;
      }
      updateDisplay();
      fireChange();
    } else {
      // Reset to valid value
      updateDisplay();
    }
  }

  /**
   * Handle keyboard navigation on hours input
   */
  function handleHoursKeyDown(event: KeyboardEvent): void {
    if (currentDisabled) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        incrementHours();
        break;
      case 'ArrowDown':
        event.preventDefault();
        decrementHours();
        break;
    }
  }

  /**
   * Handle keyboard navigation on minutes input
   */
  function handleMinutesKeyDown(event: KeyboardEvent): void {
    if (currentDisabled) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        incrementMinutes();
        break;
      case 'ArrowDown':
        event.preventDefault();
        decrementMinutes();
        break;
    }
  }

  // Wire up event listeners
  hoursUp.addEventListener('click', incrementHours);
  hoursDown.addEventListener('click', decrementHours);
  hoursInput.addEventListener('change', handleHoursInput);
  hoursInput.addEventListener('keydown', handleHoursKeyDown);

  minutesUp.addEventListener('click', incrementMinutes);
  minutesDown.addEventListener('click', decrementMinutes);
  minutesInput.addEventListener('change', handleMinutesInput);
  minutesInput.addEventListener('keydown', handleMinutesKeyDown);

  if (amButton && pmButton) {
    amButton.addEventListener('click', () => setPeriod('AM'));
    pmButton.addEventListener('click', () => setPeriod('PM'));
  }

  // Select all on focus for easier typing
  hoursInput.addEventListener('focus', () => hoursInput.select());
  minutesInput.addEventListener('focus', () => minutesInput.select());

  // Public API
  container.getValue = () => formatTime(currentTime, format);

  container.getParsedValue = () => currentTime;

  container.setValue = (value: string | Date | null) => {
    currentTime = parseTime(value, format);
    updateDisplay();
  };

  container.setHours = (hours: number) => {
    const maxHours = format === '12h' ? 12 : 23;
    const minHours = format === '12h' ? 1 : 0;

    if (hours >= minHours && hours <= maxHours) {
      if (!currentTime) {
        currentTime = createDefaultTime(format, hours);
      } else {
        currentTime.hours = hours;
      }
      updateDisplay();
      fireChange();
    }
  };

  container.setMinutes = (minutes: number) => {
    if (minutes >= 0 && minutes <= 59) {
      if (!currentTime) {
        currentTime = createDefaultTime(format, undefined, minutes);
      } else {
        currentTime.minutes = minutes;
      }
      updateDisplay();
      fireChange();
    }
  };

  container.setPeriod = (period: TimePeriod) => {
    if (format === '12h') {
      setPeriod(period);
    }
  };

  container.togglePeriod = () => {
    if (format === '12h' && currentTime?.period) {
      setPeriod(currentTime.period === 'AM' ? 'PM' : 'AM');
    }
  };

  container.setDisabled = (disabled: boolean) => {
    currentDisabled = disabled;
    container.classList.toggle('dos-time-picker--disabled', disabled);
    hoursInput.disabled = disabled;
    minutesInput.disabled = disabled;
    hoursUp.disabled = disabled;
    hoursDown.disabled = disabled;
    minutesUp.disabled = disabled;
    minutesDown.disabled = disabled;
    if (amButton) amButton.disabled = disabled;
    if (pmButton) pmButton.disabled = disabled;
  };

  container.setError = (error: boolean | string) => {
    currentError = error;
    container.classList.toggle('dos-time-picker--error', !!error);

    if (typeof error === 'string') {
      createErrorElement(error);
    } else {
      removeErrorElement();
    }
  };

  container.clear = () => {
    currentTime = null;
    updateDisplay();
    fireChange();
  };

  container.focus = () => {
    hoursInput.focus();
  };

  container.destroy = () => {
    hoursUp.removeEventListener('click', incrementHours);
    hoursDown.removeEventListener('click', decrementHours);
    hoursInput.removeEventListener('change', handleHoursInput);
    hoursInput.removeEventListener('keydown', handleHoursKeyDown);
    minutesUp.removeEventListener('click', incrementMinutes);
    minutesDown.removeEventListener('click', decrementMinutes);
    minutesInput.removeEventListener('change', handleMinutesInput);
    minutesInput.removeEventListener('keydown', handleMinutesKeyDown);
  };

  return container;
}
