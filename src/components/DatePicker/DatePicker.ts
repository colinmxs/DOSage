/**
 * DatePicker component
 * DOS-style date picker with calendar popup
 */

import type {
  DatePickerProps,
  DatePickerState,
  DatePickerElement,
  DisabledDateFn,
} from './DatePicker.types';
import './DatePicker.css';

/** Day names for header */
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Month names */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Parse a date from various formats
 */
function parseDate(value: Date | string | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  // Handle YYYY-MM-DD format specially to avoid timezone issues
  // When parsing "2026-06-15", we want local June 15, not UTC June 15 (which might be June 14 locally)
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format a date according to format string
 */
function formatDate(date: Date | null, format: string): string {
  if (!date) return '';
  
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Check if two dates are the same day
 */
function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date is today
 */
function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get the first day of a month
 */
function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * Get the last day of a month
 */
function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

/**
 * Get all days to display in calendar grid (includes padding days from prev/next month)
 */
function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  
  const days: Date[] = [];
  
  // Add days from previous month to fill first week
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add all days of current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  
  // Add days from next month to complete last week
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  
  return days;
}

/**
 * Check if a date is disabled
 */
function isDateDisabled(
  date: Date,
  min: Date | null,
  max: Date | null,
  disabledDates: Date[] | DisabledDateFn | undefined
): boolean {
  // Check min bound
  if (min) {
    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (checkDate < minDate) return true;
  }
  
  // Check max bound
  if (max) {
    const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (checkDate > maxDate) return true;
  }
  
  // Check disabled dates
  if (disabledDates) {
    if (typeof disabledDates === 'function') {
      return disabledDates(date);
    } else if (Array.isArray(disabledDates)) {
      return disabledDates.some(d => isSameDay(d, date));
    }
  }
  
  return false;
}

/**
 * Creates a DOS-style DatePicker component
 */
export function createDatePicker(props: DatePickerProps): DatePickerElement {
  const {
    value: initialValue,
    label,
    placeholder = 'Select date...',
    format = 'YYYY-MM-DD',
    min,
    max,
    disabled = false,
    disabledDates,
    error: initialError,
    name,
    required = false,
    onChange,
    onOpen,
    onClose,
  } = props;

  // Parse initial value and bounds
  let selectedDate = parseDate(initialValue);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);

  // Component state
  const state: DatePickerState = {
    viewMonth: selectedDate?.getMonth() ?? new Date().getMonth(),
    viewYear: selectedDate?.getFullYear() ?? new Date().getFullYear(),
    isOpen: false,
    focusedDate: null,
    isFocused: false,
  };

  let currentError = initialError;
  let currentDisabled = disabled;

  // Create main container
  const container = document.createElement('div') as DatePickerElement;
  container.className = 'dos-date-picker';
  
  if (currentDisabled) {
    container.classList.add('dos-date-picker--disabled');
  }
  if (currentError) {
    container.classList.add('dos-date-picker--error');
  }

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = document.createElement('label');
    labelElement.className = 'dos-date-picker___label';
    if (required) {
      labelElement.classList.add('dos-date-picker___label--required');
    }
    labelElement.textContent = label;
    container.appendChild(labelElement);
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-date-picker___input-wrapper';

  // Create hidden input for form submission
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  if (name) hiddenInput.name = name;
  hiddenInput.value = formatDate(selectedDate, format);
  inputWrapper.appendChild(hiddenInput);

  // Create visible input (read-only display)
  const inputId = `dos-datepicker-${Math.random().toString(36).slice(2, 11)}`;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.className = 'dos-date-picker___input';
  input.placeholder = placeholder;
  input.readOnly = true;
  input.value = formatDate(selectedDate, format);
  input.disabled = currentDisabled;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-haspopup', 'dialog');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-autocomplete', 'none');
  if (required) input.setAttribute('aria-required', 'true');
  inputWrapper.appendChild(input);

  // Link label to input
  if (labelElement) {
    labelElement.htmlFor = inputId;
  }

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'dos-date-picker___toggle';
  toggleButton.innerHTML = '▼'; // Calendar icon alternative
  toggleButton.disabled = currentDisabled;
  toggleButton.setAttribute('aria-label', 'Open calendar');
  toggleButton.setAttribute('tabindex', '-1');
  inputWrapper.appendChild(toggleButton);

  container.appendChild(inputWrapper);

  // Create calendar popup
  const calendarId = `dos-datepicker-calendar-${Math.random().toString(36).slice(2, 11)}`;
  const calendar = document.createElement('div');
  calendar.id = calendarId;
  calendar.className = 'dos-date-picker___calendar';
  calendar.setAttribute('role', 'dialog');
  calendar.setAttribute('aria-modal', 'true');
  calendar.setAttribute('aria-label', 'Choose date');
  input.setAttribute('aria-controls', calendarId);

  // Create calendar header
  const header = document.createElement('div');
  header.className = 'dos-date-picker___header';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'dos-date-picker___nav';
  prevButton.innerHTML = '◄';
  prevButton.setAttribute('aria-label', 'Previous month');

  const headerTitle = document.createElement('span');
  headerTitle.className = 'dos-date-picker___header-title';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'dos-date-picker___nav';
  nextButton.innerHTML = '►';
  nextButton.setAttribute('aria-label', 'Next month');

  header.appendChild(prevButton);
  header.appendChild(headerTitle);
  header.appendChild(nextButton);
  calendar.appendChild(header);

  // Create calendar grid
  const grid = document.createElement('div');
  grid.className = 'dos-date-picker___grid';
  grid.setAttribute('role', 'grid');
  calendar.appendChild(grid);

  // Create footer with today button
  const footer = document.createElement('div');
  footer.className = 'dos-date-picker___footer';

  const todayButton = document.createElement('button');
  todayButton.type = 'button';
  todayButton.className = 'dos-date-picker___today-btn';
  todayButton.textContent = 'Today';
  todayButton.setAttribute('aria-label', 'Go to today');
  footer.appendChild(todayButton);
  calendar.appendChild(footer);

  container.appendChild(calendar);

  // Create error element
  let errorElement: HTMLDivElement | null = null;
  function createErrorElement(message: string): void {
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'dos-date-picker___error';
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
   * Update the header title
   */
  function updateHeaderTitle(): void {
    headerTitle.textContent = `${MONTH_NAMES[state.viewMonth]} ${state.viewYear}`;
    calendar.setAttribute('aria-label', `Choose date, ${MONTH_NAMES[state.viewMonth]} ${state.viewYear}`);
  }

  /**
   * Check if previous month navigation should be disabled
   */
  function isPrevMonthDisabled(): boolean {
    if (!minDate) return false;
    const prevMonth = state.viewMonth === 0 ? 11 : state.viewMonth - 1;
    const prevYear = state.viewMonth === 0 ? state.viewYear - 1 : state.viewYear;
    const lastDayOfPrevMonth = getLastDayOfMonth(prevYear, prevMonth);
    return lastDayOfPrevMonth < minDate;
  }

  /**
   * Check if next month navigation should be disabled
   */
  function isNextMonthDisabled(): boolean {
    if (!maxDate) return false;
    const nextMonth = state.viewMonth === 11 ? 0 : state.viewMonth + 1;
    const nextYear = state.viewMonth === 11 ? state.viewYear + 1 : state.viewYear;
    const firstDayOfNextMonth = getFirstDayOfMonth(nextYear, nextMonth);
    return firstDayOfNextMonth > maxDate;
  }

  /**
   * Render the calendar grid
   */
  function renderCalendar(): void {
    updateHeaderTitle();
    prevButton.disabled = isPrevMonthDisabled();
    nextButton.disabled = isNextMonthDisabled();

    // Clear existing grid
    grid.innerHTML = '';

    // Add day headers
    DAY_NAMES.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'dos-date-picker___day-header';
      dayHeader.textContent = day;
      dayHeader.setAttribute('role', 'columnheader');
      grid.appendChild(dayHeader);
    });

    // Get days for current view
    const days = getCalendarDays(state.viewYear, state.viewMonth);

    // Add day buttons
    days.forEach(date => {
      const dayButton = document.createElement('button');
      dayButton.type = 'button';
      dayButton.className = 'dos-date-picker___day';
      dayButton.textContent = date.getDate().toString();
      dayButton.setAttribute('role', 'gridcell');
      dayButton.setAttribute('data-date', date.toISOString());

      // Check if this is in current month
      const isCurrentMonth = date.getMonth() === state.viewMonth;
      if (!isCurrentMonth) {
        dayButton.classList.add('dos-date-picker___day--other-month');
      }

      // Check if today
      if (isToday(date)) {
        dayButton.classList.add('dos-date-picker___day--today');
        dayButton.setAttribute('aria-current', 'date');
      }

      // Check if selected
      if (isSameDay(date, selectedDate)) {
        dayButton.classList.add('dos-date-picker___day--selected');
        dayButton.setAttribute('aria-selected', 'true');
      }

      // Check if disabled
      const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
      if (isDisabled) {
        dayButton.classList.add('dos-date-picker___day--disabled');
        dayButton.disabled = true;
        dayButton.setAttribute('aria-disabled', 'true');
      }

      // Check if focused
      if (isSameDay(date, state.focusedDate)) {
        dayButton.setAttribute('tabindex', '0');
      } else {
        dayButton.setAttribute('tabindex', '-1');
      }

      // Add click handler
      dayButton.addEventListener('click', () => {
        if (!isDisabled) {
          selectDate(date);
        }
      });

      grid.appendChild(dayButton);
    });
  }

  /**
   * Select a date
   */
  function selectDate(date: Date): void {
    selectedDate = date;
    const formatted = formatDate(date, format);
    input.value = formatted;
    hiddenInput.value = formatted;

    // Update state and close calendar
    closeCalendar();

    // Fire change callback
    onChange?.(date, formatted);
  }

  /**
   * Open the calendar
   */
  function openCalendar(): void {
    if (currentDisabled || state.isOpen) return;

    state.isOpen = true;
    calendar.classList.add('dos-date-picker___calendar--open');
    input.setAttribute('aria-expanded', 'true');

    // Set view to selected date or today
    if (selectedDate) {
      state.viewMonth = selectedDate.getMonth();
      state.viewYear = selectedDate.getFullYear();
      state.focusedDate = selectedDate;
    } else {
      const today = new Date();
      state.viewMonth = today.getMonth();
      state.viewYear = today.getFullYear();
      state.focusedDate = today;
    }

    renderCalendar();

    // Focus the selected/focused day
    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);

    onOpen?.();
  }

  /**
   * Close the calendar
   */
  function closeCalendar(): void {
    if (!state.isOpen) return;

    state.isOpen = false;
    calendar.classList.remove('dos-date-picker___calendar--open');
    input.setAttribute('aria-expanded', 'false');
    state.focusedDate = null;

    input.focus();
    onClose?.();
  }

  /**
   * Toggle the calendar
   */
  function toggleCalendar(): void {
    if (state.isOpen) {
      closeCalendar();
    } else {
      openCalendar();
    }
  }

  /**
   * Navigate to previous month
   */
  function prevMonth(): void {
    if (isPrevMonthDisabled()) return;
    
    if (state.viewMonth === 0) {
      state.viewMonth = 11;
      state.viewYear--;
    } else {
      state.viewMonth--;
    }

    // Update focused date to same day in new month if possible
    if (state.focusedDate) {
      const newFocused = new Date(state.viewYear, state.viewMonth, state.focusedDate.getDate());
      const lastDay = getLastDayOfMonth(state.viewYear, state.viewMonth);
      if (newFocused > lastDay) {
        state.focusedDate = lastDay;
      } else {
        state.focusedDate = newFocused;
      }
    }

    renderCalendar();
    
    // Re-focus
    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  /**
   * Navigate to next month
   */
  function nextMonth(): void {
    if (isNextMonthDisabled()) return;
    
    if (state.viewMonth === 11) {
      state.viewMonth = 0;
      state.viewYear++;
    } else {
      state.viewMonth++;
    }

    // Update focused date to same day in new month if possible
    if (state.focusedDate) {
      const newFocused = new Date(state.viewYear, state.viewMonth, state.focusedDate.getDate());
      const lastDay = getLastDayOfMonth(state.viewYear, state.viewMonth);
      if (newFocused > lastDay) {
        state.focusedDate = lastDay;
      } else {
        state.focusedDate = newFocused;
      }
    }

    renderCalendar();
    
    // Re-focus
    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  /**
   * Navigate focused date by days
   */
  function moveFocus(days: number): void {
    if (!state.focusedDate) {
      state.focusedDate = selectedDate ?? new Date();
    }

    const newDate = new Date(state.focusedDate);
    newDate.setDate(newDate.getDate() + days);

    // Check bounds
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    state.focusedDate = newDate;

    // Update view if necessary
    if (newDate.getMonth() !== state.viewMonth || newDate.getFullYear() !== state.viewYear) {
      state.viewMonth = newDate.getMonth();
      state.viewYear = newDate.getFullYear();
    }

    renderCalendar();

    // Focus the new date
    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  /**
   * Go to first day of month
   */
  function goToFirstDay(): void {
    const firstDay = getFirstDayOfMonth(state.viewYear, state.viewMonth);
    
    // Find first non-disabled day
    let date = firstDay;
    while (isDateDisabled(date, minDate, maxDate, disabledDates)) {
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      if (date.getMonth() !== state.viewMonth) return; // All days disabled
    }

    state.focusedDate = date;
    renderCalendar();

    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  /**
   * Go to last day of month
   */
  function goToLastDay(): void {
    const lastDay = getLastDayOfMonth(state.viewYear, state.viewMonth);
    
    // Find last non-disabled day
    let date = lastDay;
    while (isDateDisabled(date, minDate, maxDate, disabledDates)) {
      date = new Date(date);
      date.setDate(date.getDate() - 1);
      if (date.getMonth() !== state.viewMonth) return; // All days disabled
    }

    state.focusedDate = date;
    renderCalendar();

    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  /**
   * Go to today
   */
  function goToToday(): void {
    const today = new Date();
    
    // Check if today is within bounds
    if (isDateDisabled(today, minDate, maxDate, disabledDates)) {
      // Just navigate to today's month
      state.viewMonth = today.getMonth();
      state.viewYear = today.getFullYear();
      renderCalendar();
      return;
    }

    state.viewMonth = today.getMonth();
    state.viewYear = today.getFullYear();
    state.focusedDate = today;
    
    renderCalendar();

    setTimeout(() => {
      const focusedButton = grid.querySelector('[tabindex="0"]') as HTMLButtonElement;
      focusedButton?.focus();
    }, 0);
  }

  // Event handlers
  function handleInputClick(): void {
    if (!currentDisabled) {
      toggleCalendar();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent): void {
    if (currentDisabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleCalendar();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!state.isOpen) {
          openCalendar();
        }
        break;
      case 'Escape':
        if (state.isOpen) {
          event.preventDefault();
          closeCalendar();
        }
        break;
    }
  }

  function handleCalendarKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(-7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(7);
        break;
      case 'PageUp':
        event.preventDefault();
        prevMonth();
        break;
      case 'PageDown':
        event.preventDefault();
        nextMonth();
        break;
      case 'Home':
        event.preventDefault();
        goToFirstDay();
        break;
      case 'End':
        event.preventDefault();
        goToLastDay();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (state.focusedDate && !isDateDisabled(state.focusedDate, minDate, maxDate, disabledDates)) {
          selectDate(state.focusedDate);
        }
        break;
      case 'Escape':
        event.preventDefault();
        closeCalendar();
        break;
    }
  }

  function handleOutsideClick(event: MouseEvent): void {
    if (state.isOpen && !container.contains(event.target as Node)) {
      closeCalendar();
    }
  }

  // Wire up event listeners
  input.addEventListener('click', handleInputClick);
  input.addEventListener('keydown', handleInputKeyDown);
  toggleButton.addEventListener('click', handleInputClick);
  prevButton.addEventListener('click', prevMonth);
  nextButton.addEventListener('click', nextMonth);
  todayButton.addEventListener('click', goToToday);
  calendar.addEventListener('keydown', handleCalendarKeyDown);
  document.addEventListener('click', handleOutsideClick);

  // Public API
  container.getValue = () => selectedDate;

  container.setValue = (value: Date | string | null) => {
    selectedDate = parseDate(value);
    const formatted = formatDate(selectedDate, format);
    input.value = formatted;
    hiddenInput.value = formatted;
    
    if (selectedDate) {
      state.viewMonth = selectedDate.getMonth();
      state.viewYear = selectedDate.getFullYear();
    }
    
    if (state.isOpen) {
      renderCalendar();
    }
  };

  container.getFormattedValue = () => formatDate(selectedDate, format);

  container.open = openCalendar;
  container.close = closeCalendar;
  container.toggle = toggleCalendar;
  container.isOpen = () => state.isOpen;

  container.setDisabled = (disabled: boolean) => {
    currentDisabled = disabled;
    input.disabled = disabled;
    toggleButton.disabled = disabled;
    container.classList.toggle('dos-date-picker--disabled', disabled);
    
    if (disabled && state.isOpen) {
      closeCalendar();
    }
  };

  container.setError = (error: boolean | string) => {
    currentError = error;
    container.classList.toggle('dos-date-picker--error', !!error);
    
    if (typeof error === 'string') {
      createErrorElement(error);
    } else {
      removeErrorElement();
    }
  };

  container.clear = () => {
    selectedDate = null;
    input.value = '';
    hiddenInput.value = '';
    
    if (state.isOpen) {
      renderCalendar();
    }
    
    onChange?.(null, '');
  };

  container.navigateTo = (month: number, year: number) => {
    state.viewMonth = month;
    state.viewYear = year;
    
    if (state.isOpen) {
      renderCalendar();
    }
  };

  container.focus = () => {
    input.focus();
  };

  container.destroy = () => {
    document.removeEventListener('click', handleOutsideClick);
    input.removeEventListener('click', handleInputClick);
    input.removeEventListener('keydown', handleInputKeyDown);
    toggleButton.removeEventListener('click', handleInputClick);
    prevButton.removeEventListener('click', prevMonth);
    nextButton.removeEventListener('click', nextMonth);
    todayButton.removeEventListener('click', goToToday);
    calendar.removeEventListener('keydown', handleCalendarKeyDown);
  };

  return container;
}
