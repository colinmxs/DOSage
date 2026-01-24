/**
 * DatePicker component tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDatePicker } from '../../src/components/DatePicker';
import type { DatePickerElement } from '../../src/components/DatePicker';

describe('DatePicker', () => {
  let container: DatePickerElement;

  beforeEach(() => {
    // Mock system date to ensure consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15)); // January 15, 2026
  });

  afterEach(() => {
    vi.useRealTimers();
    container?.destroy?.();
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('creates a date picker element', () => {
      container = createDatePicker({});
      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.classList.contains('dos-date-picker')).toBe(true);
    });

    it('renders with label', () => {
      container = createDatePicker({ label: 'Select Date' });
      const label = container.querySelector('.dos-date-picker___label');
      expect(label).not.toBeNull();
      expect(label?.textContent).toBe('Select Date');
    });

    it('renders with required label', () => {
      container = createDatePicker({ label: 'Date', required: true });
      const label = container.querySelector('.dos-date-picker___label');
      expect(label?.classList.contains('dos-date-picker___label--required')).toBe(true);
    });

    it('renders with placeholder', () => {
      container = createDatePicker({ placeholder: 'Pick a date' });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.placeholder).toBe('Pick a date');
    });

    it('renders with default placeholder', () => {
      container = createDatePicker({});
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.placeholder).toBe('Select date...');
    });

    it('renders with initial value', () => {
      container = createDatePicker({ value: new Date(2026, 5, 15) });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('2026-06-15');
    });

    it('renders with initial value from string', () => {
      container = createDatePicker({ value: '2026-06-15' });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('2026-06-15');
    });

    it('renders with custom format', () => {
      container = createDatePicker({ 
        value: new Date(2026, 5, 15),
        format: 'DD/MM/YYYY'
      });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('15/06/2026');
    });

    it('renders toggle button', () => {
      container = createDatePicker({});
      const toggle = container.querySelector('.dos-date-picker___toggle');
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('aria-label')).toBe('Open calendar');
    });

    it('renders hidden input for form submission', () => {
      container = createDatePicker({ name: 'date-field', value: new Date(2026, 0, 15) });
      const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hidden).not.toBeNull();
      expect(hidden.name).toBe('date-field');
      expect(hidden.value).toBe('2026-01-15');
    });

    it('renders calendar popup (initially closed)', () => {
      container = createDatePicker({});
      const calendar = container.querySelector('.dos-date-picker___calendar');
      expect(calendar).not.toBeNull();
      expect(calendar?.classList.contains('dos-date-picker___calendar--open')).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class', () => {
      container = createDatePicker({ disabled: true });
      expect(container.classList.contains('dos-date-picker--disabled')).toBe(true);
    });

    it('disables input when disabled', () => {
      container = createDatePicker({ disabled: true });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('disables toggle button when disabled', () => {
      container = createDatePicker({ disabled: true });
      const toggle = container.querySelector('.dos-date-picker___toggle') as HTMLButtonElement;
      expect(toggle.disabled).toBe(true);
    });

    it('does not open calendar when disabled', () => {
      container = createDatePicker({ disabled: true });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.click();
      
      expect(container.isOpen()).toBe(false);
    });

    it('can toggle disabled state via API', () => {
      container = createDatePicker({});
      container.setDisabled(true);
      
      expect(container.classList.contains('dos-date-picker--disabled')).toBe(true);
      
      container.setDisabled(false);
      expect(container.classList.contains('dos-date-picker--disabled')).toBe(false);
    });
  });

  describe('error state', () => {
    it('applies error class with boolean error', () => {
      container = createDatePicker({ error: true });
      expect(container.classList.contains('dos-date-picker--error')).toBe(true);
    });

    it('applies error class with string error', () => {
      container = createDatePicker({ error: 'Invalid date' });
      expect(container.classList.contains('dos-date-picker--error')).toBe(true);
    });

    it('displays error message when provided', () => {
      container = createDatePicker({ error: 'Invalid date' });
      const errorEl = container.querySelector('.dos-date-picker___error');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent).toBe('Invalid date');
    });

    it('error message has role=alert', () => {
      container = createDatePicker({ error: 'Invalid date' });
      const errorEl = container.querySelector('.dos-date-picker___error');
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });

    it('can set error via API', () => {
      container = createDatePicker({});
      container.setError('Please select a date');
      
      expect(container.classList.contains('dos-date-picker--error')).toBe(true);
      const errorEl = container.querySelector('.dos-date-picker___error');
      expect(errorEl?.textContent).toBe('Please select a date');
    });

    it('can clear error via API', () => {
      container = createDatePicker({ error: 'Invalid date' });
      container.setError(false);
      
      expect(container.classList.contains('dos-date-picker--error')).toBe(false);
      expect(container.querySelector('.dos-date-picker___error')).toBeNull();
    });
  });

  describe('calendar popup', () => {
    it('opens calendar on input click', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.click();
      
      expect(container.isOpen()).toBe(true);
      expect(container.querySelector('.dos-date-picker___calendar--open')).not.toBeNull();
    });

    it('opens calendar on toggle button click', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const toggle = container.querySelector('.dos-date-picker___toggle') as HTMLButtonElement;
      toggle.click();
      
      expect(container.isOpen()).toBe(true);
    });

    it('closes calendar on second click', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.click();
      expect(container.isOpen()).toBe(true);
      
      input.click();
      expect(container.isOpen()).toBe(false);
    });

    it('closes calendar on outside click', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      container.open();
      expect(container.isOpen()).toBe(true);
      
      // Create and click outside element
      const outside = document.createElement('div');
      document.body.appendChild(outside);
      
      // Simulate outside click via document click
      const event = new MouseEvent('click', { bubbles: true });
      outside.dispatchEvent(event);
      
      expect(container.isOpen()).toBe(false);
    });

    it('displays current month and year', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('January 2026');
    });

    it('displays day headers', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const headers = container.querySelectorAll('.dos-date-picker___day-header');
      expect(headers.length).toBe(7);
      expect(headers[0]?.textContent).toBe('Su');
      expect(headers[6]?.textContent).toBe('Sa');
    });

    it('displays days of the month', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day');
      expect(days.length).toBeGreaterThan(28); // At least 28 days + padding
    });

    it('highlights today', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const today = container.querySelector('.dos-date-picker___day--today');
      expect(today).not.toBeNull();
      expect(today?.textContent).toBe('15'); // January 15, 2026
      expect(today?.getAttribute('aria-current')).toBe('date');
    });

    it('highlights selected date', () => {
      container = createDatePicker({ value: new Date(2026, 0, 20) });
      document.body.appendChild(container);
      container.open();
      
      const selected = container.querySelector('.dos-date-picker___day--selected');
      expect(selected).not.toBeNull();
      expect(selected?.textContent).toBe('20');
      expect(selected?.getAttribute('aria-selected')).toBe('true');
    });

    it('shows other-month days with different styling', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const otherMonthDays = container.querySelectorAll('.dos-date-picker___day--other-month');
      expect(otherMonthDays.length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    it('navigates to previous month', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const prevBtn = container.querySelector('.dos-date-picker___nav:first-of-type') as HTMLButtonElement;
      prevBtn.click();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('December 2025');
    });

    it('navigates to next month', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const nextBtn = container.querySelector('.dos-date-picker___nav:last-of-type') as HTMLButtonElement;
      nextBtn.click();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('February 2026');
    });

    it('navigates across year boundary forward', () => {
      vi.setSystemTime(new Date(2025, 11, 15)); // December 2025
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const nextBtn = container.querySelector('.dos-date-picker___nav:last-of-type') as HTMLButtonElement;
      nextBtn.click();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('January 2026');
    });

    it('navigates across year boundary backward', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const prevBtn = container.querySelector('.dos-date-picker___nav:first-of-type') as HTMLButtonElement;
      prevBtn.click();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('December 2025');
    });

    it('goes to today when today button is clicked', () => {
      container = createDatePicker({ value: new Date(2026, 5, 15) }); // June 2026
      document.body.appendChild(container);
      container.open();
      
      const todayBtn = container.querySelector('.dos-date-picker___today-btn') as HTMLButtonElement;
      todayBtn.click();
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('January 2026');
    });

    it('navigateTo API works', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      container.navigateTo(6, 2027); // July 2027
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('July 2027');
    });
  });

  describe('date selection', () => {
    it('selects date when day is clicked', () => {
      const onChange = vi.fn();
      container = createDatePicker({ onChange });
      document.body.appendChild(container);
      container.open();
      
      // Find day 20 in current month
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day20 = Array.from(days).find(d => d.textContent === '20') as HTMLButtonElement;
      day20?.click();
      
      expect(onChange).toHaveBeenCalled();
      const [date, formatted] = onChange.mock.calls[0];
      expect(date.getDate()).toBe(20);
      expect(date.getMonth()).toBe(0); // January
      expect(formatted).toBe('2026-01-20');
    });

    it('closes calendar after selection', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day20 = Array.from(days).find(d => d.textContent === '20') as HTMLButtonElement;
      day20?.click();
      
      expect(container.isOpen()).toBe(false);
    });

    it('updates input value after selection', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day20 = Array.from(days).find(d => d.textContent === '20') as HTMLButtonElement;
      day20?.click();
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('2026-01-20');
    });

    it('updates hidden input after selection', () => {
      container = createDatePicker({ name: 'date-field' });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day20 = Array.from(days).find(d => d.textContent === '20') as HTMLButtonElement;
      day20?.click();
      
      const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hidden.value).toBe('2026-01-20');
    });
  });

  describe('min/max constraints', () => {
    it('disables days before min date', () => {
      container = createDatePicker({ min: new Date(2026, 0, 10) });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day5 = Array.from(days).find(d => d.textContent === '5') as HTMLButtonElement;
      
      expect(day5.classList.contains('dos-date-picker___day--disabled')).toBe(true);
      expect(day5.disabled).toBe(true);
    });

    it('disables days after max date', () => {
      container = createDatePicker({ max: new Date(2026, 0, 20) });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day25 = Array.from(days).find(d => d.textContent === '25') as HTMLButtonElement;
      
      expect(day25.classList.contains('dos-date-picker___day--disabled')).toBe(true);
      expect(day25.disabled).toBe(true);
    });

    it('does not select disabled day', () => {
      const onChange = vi.fn();
      container = createDatePicker({ min: new Date(2026, 0, 10), onChange });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day5 = Array.from(days).find(d => d.textContent === '5') as HTMLButtonElement;
      day5?.click();
      
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disables previous month button at min boundary', () => {
      container = createDatePicker({ min: new Date(2026, 0, 1) });
      document.body.appendChild(container);
      container.open();
      
      const prevBtn = container.querySelector('.dos-date-picker___nav:first-of-type') as HTMLButtonElement;
      expect(prevBtn.disabled).toBe(true);
    });

    it('disables next month button at max boundary', () => {
      container = createDatePicker({ max: new Date(2026, 0, 31) });
      document.body.appendChild(container);
      container.open();
      
      const nextBtn = container.querySelector('.dos-date-picker___nav:last-of-type') as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(true);
    });
  });

  describe('disabled dates', () => {
    it('disables specific dates from array', () => {
      container = createDatePicker({
        disabledDates: [new Date(2026, 0, 12), new Date(2026, 0, 18)]
      });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day12 = Array.from(days).find(d => d.textContent === '12') as HTMLButtonElement;
      const day18 = Array.from(days).find(d => d.textContent === '18') as HTMLButtonElement;
      
      expect(day12.classList.contains('dos-date-picker___day--disabled')).toBe(true);
      expect(day18.classList.contains('dos-date-picker___day--disabled')).toBe(true);
    });

    it('disables dates from function', () => {
      // Disable weekends
      container = createDatePicker({
        disabledDates: (date) => date.getDay() === 0 || date.getDay() === 6
      });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      
      // Check that some days are disabled (Saturdays and Sundays)
      const disabledDays = Array.from(days).filter(d => 
        d.classList.contains('dos-date-picker___day--disabled')
      );
      expect(disabledDays.length).toBeGreaterThan(0);
    });
  });

  describe('keyboard navigation', () => {
    it('opens calendar on Enter', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      input.dispatchEvent(event);
      
      expect(container.isOpen()).toBe(true);
    });

    it('opens calendar on Space', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.focus();
      
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      input.dispatchEvent(event);
      
      expect(container.isOpen()).toBe(true);
    });

    it('opens calendar on ArrowDown', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      input.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      input.dispatchEvent(event);
      
      expect(container.isOpen()).toBe(true);
    });

    it('closes calendar on Escape', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      calendar.dispatchEvent(event);
      
      expect(container.isOpen()).toBe(false);
    });

    it('navigates days with ArrowRight', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      calendar.dispatchEvent(event);
      
      // Focus should move to 16th
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-16');
    });

    it('navigates days with ArrowLeft', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      calendar.dispatchEvent(event);
      
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-14');
    });

    it('navigates weeks with ArrowUp', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      calendar.dispatchEvent(event);
      
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-08');
    });

    it('navigates weeks with ArrowDown', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      calendar.dispatchEvent(event);
      
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-22');
    });

    it('navigates months with PageUp', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      calendar.dispatchEvent(event);
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('December 2025');
    });

    it('navigates months with PageDown', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true });
      calendar.dispatchEvent(event);
      
      const title = container.querySelector('.dos-date-picker___header-title');
      expect(title?.textContent).toBe('February 2026');
    });

    it('goes to first day with Home', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      calendar.dispatchEvent(event);
      
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-01');
    });

    it('goes to last day with End', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      calendar.dispatchEvent(event);
      
      vi.runAllTimers();
      const focused = container.querySelector('[tabindex="0"]') as HTMLButtonElement;
      expect(focused?.getAttribute('data-date')).toContain('2026-01-31');
    });

    it('selects date with Enter on focused day', () => {
      const onChange = vi.fn();
      container = createDatePicker({ value: new Date(2026, 0, 15), onChange });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      calendar.dispatchEvent(event);
      
      expect(onChange).toHaveBeenCalled();
    });

    it('selects date with Space on focused day', () => {
      const onChange = vi.fn();
      container = createDatePicker({ value: new Date(2026, 0, 15), onChange });
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      calendar.dispatchEvent(event);
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('public API', () => {
    it('getValue returns selected date', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      const value = container.getValue();
      expect(value?.getFullYear()).toBe(2026);
      expect(value?.getMonth()).toBe(0);
      expect(value?.getDate()).toBe(15);
    });

    it('getValue returns null when no date selected', () => {
      container = createDatePicker({});
      expect(container.getValue()).toBeNull();
    });

    it('setValue updates the date', () => {
      container = createDatePicker({});
      container.setValue(new Date(2026, 5, 20));
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('2026-06-20');
      expect(container.getValue()?.getDate()).toBe(20);
    });

    it('setValue accepts string', () => {
      container = createDatePicker({});
      container.setValue('2026-06-20');
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('2026-06-20');
    });

    it('setValue with null clears the date', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      container.setValue(null);
      
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('');
      expect(container.getValue()).toBeNull();
    });

    it('getFormattedValue returns formatted string', () => {
      container = createDatePicker({ value: new Date(2026, 0, 15) });
      expect(container.getFormattedValue()).toBe('2026-01-15');
    });

    it('getFormattedValue respects format', () => {
      container = createDatePicker({ 
        value: new Date(2026, 0, 15),
        format: 'DD/MM/YYYY'
      });
      expect(container.getFormattedValue()).toBe('15/01/2026');
    });

    it('open opens the calendar', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      container.open();
      expect(container.isOpen()).toBe(true);
    });

    it('close closes the calendar', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      container.close();
      expect(container.isOpen()).toBe(false);
    });

    it('toggle toggles the calendar', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      container.toggle();
      expect(container.isOpen()).toBe(true);
      
      container.toggle();
      expect(container.isOpen()).toBe(false);
    });

    it('clear clears the selected date', () => {
      const onChange = vi.fn();
      container = createDatePicker({ value: new Date(2026, 0, 15), onChange });
      container.clear();
      
      expect(container.getValue()).toBeNull();
      expect(onChange).toHaveBeenCalledWith(null, '');
    });

    it('focus focuses the input', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      container.focus();
      
      const input = container.querySelector('.dos-date-picker___input');
      expect(document.activeElement).toBe(input);
    });
  });

  describe('callbacks', () => {
    it('calls onChange when date is selected', () => {
      const onChange = vi.fn();
      container = createDatePicker({ onChange });
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day20 = Array.from(days).find(d => d.textContent === '20') as HTMLButtonElement;
      day20?.click();
      
      expect(onChange).toHaveBeenCalledWith(expect.any(Date), '2026-01-20');
    });

    it('calls onOpen when calendar opens', () => {
      const onOpen = vi.fn();
      container = createDatePicker({ onOpen });
      document.body.appendChild(container);
      
      container.open();
      expect(onOpen).toHaveBeenCalled();
    });

    it('calls onClose when calendar closes', () => {
      const onClose = vi.fn();
      container = createDatePicker({ onClose });
      document.body.appendChild(container);
      
      container.open();
      container.close();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('input has role=combobox', () => {
      container = createDatePicker({});
      const input = container.querySelector('.dos-date-picker___input');
      expect(input?.getAttribute('role')).toBe('combobox');
    });

    it('input has aria-haspopup=dialog', () => {
      container = createDatePicker({});
      const input = container.querySelector('.dos-date-picker___input');
      expect(input?.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('input has aria-expanded', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      const input = container.querySelector('.dos-date-picker___input');
      expect(input?.getAttribute('aria-expanded')).toBe('false');
      
      container.open();
      expect(input?.getAttribute('aria-expanded')).toBe('true');
    });

    it('input has aria-controls for calendar', () => {
      container = createDatePicker({});
      const input = container.querySelector('.dos-date-picker___input');
      const calendar = container.querySelector('.dos-date-picker___calendar');
      
      expect(input?.getAttribute('aria-controls')).toBe(calendar?.id);
    });

    it('input has aria-required when required', () => {
      container = createDatePicker({ required: true });
      const input = container.querySelector('.dos-date-picker___input');
      expect(input?.getAttribute('aria-required')).toBe('true');
    });

    it('calendar has role=dialog', () => {
      container = createDatePicker({});
      const calendar = container.querySelector('.dos-date-picker___calendar');
      expect(calendar?.getAttribute('role')).toBe('dialog');
    });

    it('calendar has aria-modal=true', () => {
      container = createDatePicker({});
      const calendar = container.querySelector('.dos-date-picker___calendar');
      expect(calendar?.getAttribute('aria-modal')).toBe('true');
    });

    it('calendar has aria-label with month and year', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const calendar = container.querySelector('.dos-date-picker___calendar');
      expect(calendar?.getAttribute('aria-label')).toContain('January 2026');
    });

    it('grid has role=grid', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const grid = container.querySelector('.dos-date-picker___grid');
      expect(grid?.getAttribute('role')).toBe('grid');
    });

    it('day cells have role=gridcell', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const day = container.querySelector('.dos-date-picker___day');
      expect(day?.getAttribute('role')).toBe('gridcell');
    });

    it('day headers have role=columnheader', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const header = container.querySelector('.dos-date-picker___day-header');
      expect(header?.getAttribute('role')).toBe('columnheader');
    });

    it('navigation buttons have aria-labels', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const prevBtn = container.querySelector('.dos-date-picker___nav:first-of-type');
      const nextBtn = container.querySelector('.dos-date-picker___nav:last-of-type');
      
      expect(prevBtn?.getAttribute('aria-label')).toBe('Previous month');
      expect(nextBtn?.getAttribute('aria-label')).toBe('Next month');
    });

    it('label is linked to input', () => {
      container = createDatePicker({ label: 'Select Date' });
      
      const label = container.querySelector('.dos-date-picker___label') as HTMLLabelElement;
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      
      expect(label.htmlFor).toBe(input.id);
    });

    it('disabled days have aria-disabled', () => {
      container = createDatePicker({ min: new Date(2026, 0, 10) });
      document.body.appendChild(container);
      container.open();
      
      const disabledDay = container.querySelector('.dos-date-picker___day--disabled');
      expect(disabledDay?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles invalid initial value gracefully', () => {
      container = createDatePicker({ value: 'invalid-date' });
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles leap year February', () => {
      vi.setSystemTime(new Date(2024, 1, 15)); // February 2024 (leap year)
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const day29 = Array.from(days).find(d => d.textContent === '29');
      expect(day29).not.toBeUndefined();
    });

    it('handles non-leap year February', () => {
      vi.setSystemTime(new Date(2025, 1, 15)); // February 2025 (not leap year)
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      const days = container.querySelectorAll('.dos-date-picker___day:not(.dos-date-picker___day--other-month)');
      const daysInMonth = Array.from(days).filter(d => 
        !d.classList.contains('dos-date-picker___day--other-month')
      );
      
      // February 2025 has 28 days
      const day28 = Array.from(days).find(d => d.textContent === '28' && !d.classList.contains('dos-date-picker___day--other-month'));
      const day29 = Array.from(days).find(d => d.textContent === '29' && !d.classList.contains('dos-date-picker___day--other-month'));
      
      expect(day28).not.toBeUndefined();
      expect(day29).toBeUndefined();
    });

    it('destroy removes event listeners', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      
      container.destroy();
      
      // Should not throw when clicking after destroy
      const input = container.querySelector('.dos-date-picker___input') as HTMLInputElement;
      expect(() => input.click()).not.toThrow();
    });

    it('closes calendar when disabled while open', () => {
      container = createDatePicker({});
      document.body.appendChild(container);
      container.open();
      
      expect(container.isOpen()).toBe(true);
      
      container.setDisabled(true);
      expect(container.isOpen()).toBe(false);
    });
  });
});
