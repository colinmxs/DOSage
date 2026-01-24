/**
 * TimePicker component tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimePicker } from '../../src/components/TimePicker';
import type { TimePickerElement } from '../../src/components/TimePicker';

describe('TimePicker', () => {
  let container: TimePickerElement;

  afterEach(() => {
    container?.destroy?.();
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('creates a time picker element', () => {
      container = createTimePicker({});
      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.classList.contains('dos-time-picker')).toBe(true);
    });

    it('renders with label', () => {
      container = createTimePicker({ label: 'Select Time' });
      const label = container.querySelector('.dos-time-picker___label');
      expect(label).not.toBeNull();
      expect(label?.textContent).toBe('Select Time');
    });

    it('renders with required label', () => {
      container = createTimePicker({ label: 'Time', required: true });
      const label = container.querySelector('.dos-time-picker___label');
      expect(label?.classList.contains('dos-time-picker___label--required')).toBe(true);
    });

    it('renders hours and minutes fields', () => {
      container = createTimePicker({});
      const fields = container.querySelectorAll('.dos-time-picker___field');
      expect(fields.length).toBe(2);
    });

    it('renders spinner buttons', () => {
      container = createTimePicker({});
      const spinners = container.querySelectorAll('.dos-time-picker___spinner');
      expect(spinners.length).toBe(4); // 2 up + 2 down
    });

    it('renders separator', () => {
      container = createTimePicker({});
      const separator = container.querySelector('.dos-time-picker___separator');
      expect(separator).not.toBeNull();
      expect(separator?.textContent).toBe(':');
    });

    it('renders AM/PM buttons for 12h format', () => {
      container = createTimePicker({ format: '12h' });
      const periodBtns = container.querySelectorAll('.dos-time-picker___period-btn');
      expect(periodBtns.length).toBe(2);
      expect(periodBtns[0]?.textContent).toBe('AM');
      expect(periodBtns[1]?.textContent).toBe('PM');
    });

    it('does not render AM/PM buttons for 24h format', () => {
      container = createTimePicker({ format: '24h' });
      const period = container.querySelector('.dos-time-picker___period');
      expect(period).toBeNull();
    });

    it('renders with initial value', () => {
      container = createTimePicker({ value: '14:30', format: '24h' });
      expect(container.getValue()).toBe('14:30');
    });

    it('renders with initial value in 12h format', () => {
      container = createTimePicker({ value: '14:30', format: '12h' });
      expect(container.getValue()).toBe('2:30 PM');
    });

    it('renders hidden input for form submission', () => {
      container = createTimePicker({ name: 'time-field', value: '10:00 AM', format: '12h' });
      const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hidden).not.toBeNull();
      expect(hidden.name).toBe('time-field');
      expect(hidden.value).toBe('10:00 AM');
    });

    it('displays placeholder when no value', () => {
      container = createTimePicker({});
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      expect(hoursInput.value).toBe('--');
    });
  });

  describe('disabled state', () => {
    it('applies disabled class', () => {
      container = createTimePicker({ disabled: true });
      expect(container.classList.contains('dos-time-picker--disabled')).toBe(true);
    });

    it('disables inputs when disabled', () => {
      container = createTimePicker({ disabled: true });
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      inputs.forEach(input => {
        expect((input as HTMLInputElement).disabled).toBe(true);
      });
    });

    it('disables spinners when disabled', () => {
      container = createTimePicker({ disabled: true });
      const spinners = container.querySelectorAll('.dos-time-picker___spinner');
      spinners.forEach(spinner => {
        expect((spinner as HTMLButtonElement).disabled).toBe(true);
      });
    });

    it('disables period buttons when disabled', () => {
      container = createTimePicker({ disabled: true, format: '12h' });
      const periodBtns = container.querySelectorAll('.dos-time-picker___period-btn');
      periodBtns.forEach(btn => {
        expect((btn as HTMLButtonElement).disabled).toBe(true);
      });
    });

    it('can toggle disabled state via API', () => {
      container = createTimePicker({});
      container.setDisabled(true);
      expect(container.classList.contains('dos-time-picker--disabled')).toBe(true);
      
      container.setDisabled(false);
      expect(container.classList.contains('dos-time-picker--disabled')).toBe(false);
    });
  });

  describe('error state', () => {
    it('applies error class with boolean error', () => {
      container = createTimePicker({ error: true });
      expect(container.classList.contains('dos-time-picker--error')).toBe(true);
    });

    it('applies error class with string error', () => {
      container = createTimePicker({ error: 'Invalid time' });
      expect(container.classList.contains('dos-time-picker--error')).toBe(true);
    });

    it('displays error message when provided', () => {
      container = createTimePicker({ error: 'Invalid time' });
      const errorEl = container.querySelector('.dos-time-picker___error');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent).toBe('Invalid time');
    });

    it('error message has role=alert', () => {
      container = createTimePicker({ error: 'Invalid time' });
      const errorEl = container.querySelector('.dos-time-picker___error');
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });

    it('can set error via API', () => {
      container = createTimePicker({});
      container.setError('Please enter a valid time');
      
      expect(container.classList.contains('dos-time-picker--error')).toBe(true);
      const errorEl = container.querySelector('.dos-time-picker___error');
      expect(errorEl?.textContent).toBe('Please enter a valid time');
    });

    it('can clear error via API', () => {
      container = createTimePicker({ error: 'Invalid time' });
      container.setError(false);
      
      expect(container.classList.contains('dos-time-picker--error')).toBe(false);
      expect(container.querySelector('.dos-time-picker___error')).toBeNull();
    });
  });

  describe('hours spinner', () => {
    it('increments hours on up button click', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      upBtn.click();
      
      expect(container.getValue()).toBe('11:00');
    });

    it('decrements hours on down button click', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const downBtn = container.querySelector('.dos-time-picker___spinner--down') as HTMLButtonElement;
      downBtn.click();
      
      expect(container.getValue()).toBe('09:00');
    });

    it('wraps hours from 23 to 0 in 24h format', () => {
      container = createTimePicker({ value: '23:00', format: '24h' });
      document.body.appendChild(container);
      
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      upBtn.click();
      
      expect(container.getValue()).toBe('00:00');
    });

    it('wraps hours from 0 to 23 in 24h format', () => {
      container = createTimePicker({ value: '00:00', format: '24h' });
      document.body.appendChild(container);
      
      const downBtn = container.querySelector('.dos-time-picker___spinner--down') as HTMLButtonElement;
      downBtn.click();
      
      expect(container.getValue()).toBe('23:00');
    });

    it('wraps hours from 12 to 1 in 12h format', () => {
      container = createTimePicker({ value: '12:00 PM', format: '12h' });
      document.body.appendChild(container);
      
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      upBtn.click();
      
      expect(container.getParsedValue()?.hours).toBe(1);
    });

    it('wraps hours from 1 to 12 in 12h format', () => {
      container = createTimePicker({ value: '1:00 AM', format: '12h' });
      document.body.appendChild(container);
      
      const downBtn = container.querySelector('.dos-time-picker___spinner--down') as HTMLButtonElement;
      downBtn.click();
      
      expect(container.getParsedValue()?.hours).toBe(12);
    });
  });

  describe('minutes spinner', () => {
    it('increments minutes on up button click', () => {
      container = createTimePicker({ value: '10:30', format: '24h' });
      document.body.appendChild(container);
      
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const minutesUpBtn = upBtns[1] as HTMLButtonElement;
      minutesUpBtn.click();
      
      expect(container.getValue()).toBe('10:31');
    });

    it('decrements minutes on down button click', () => {
      container = createTimePicker({ value: '10:30', format: '24h' });
      document.body.appendChild(container);
      
      const downBtns = container.querySelectorAll('.dos-time-picker___spinner--down');
      const minutesDownBtn = downBtns[1] as HTMLButtonElement;
      minutesDownBtn.click();
      
      expect(container.getValue()).toBe('10:29');
    });

    it('wraps minutes from 59 to 0', () => {
      container = createTimePicker({ value: '10:59', format: '24h' });
      document.body.appendChild(container);
      
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const minutesUpBtn = upBtns[1] as HTMLButtonElement;
      minutesUpBtn.click();
      
      expect(container.getValue()).toBe('10:00');
    });

    it('wraps minutes from 0 to 59', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const downBtns = container.querySelectorAll('.dos-time-picker___spinner--down');
      const minutesDownBtn = downBtns[1] as HTMLButtonElement;
      minutesDownBtn.click();
      
      expect(container.getValue()).toBe('10:59');
    });

    it('respects step value', () => {
      container = createTimePicker({ value: '10:00', format: '24h', step: 15 });
      document.body.appendChild(container);
      
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const minutesUpBtn = upBtns[1] as HTMLButtonElement;
      minutesUpBtn.click();
      
      expect(container.getValue()).toBe('10:15');
    });

    it('wraps with step value', () => {
      container = createTimePicker({ value: '10:45', format: '24h', step: 15 });
      document.body.appendChild(container);
      
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const minutesUpBtn = upBtns[1] as HTMLButtonElement;
      minutesUpBtn.click();
      
      expect(container.getValue()).toBe('10:00');
    });
  });

  describe('period selection (12h format)', () => {
    it('activates AM button when AM is selected', () => {
      container = createTimePicker({ value: '10:00 AM', format: '12h' });
      const amBtn = container.querySelector('.dos-time-picker___period-btn:first-child');
      expect(amBtn?.classList.contains('dos-time-picker___period-btn--active')).toBe(true);
    });

    it('activates PM button when PM is selected', () => {
      container = createTimePicker({ value: '2:00 PM', format: '12h' });
      const pmBtn = container.querySelector('.dos-time-picker___period-btn:last-child');
      expect(pmBtn?.classList.contains('dos-time-picker___period-btn--active')).toBe(true);
    });

    it('switches to AM on AM button click', () => {
      container = createTimePicker({ value: '2:00 PM', format: '12h' });
      document.body.appendChild(container);
      
      const amBtn = container.querySelector('.dos-time-picker___period-btn:first-child') as HTMLButtonElement;
      amBtn.click();
      
      expect(container.getParsedValue()?.period).toBe('AM');
    });

    it('switches to PM on PM button click', () => {
      container = createTimePicker({ value: '10:00 AM', format: '12h' });
      document.body.appendChild(container);
      
      const pmBtn = container.querySelector('.dos-time-picker___period-btn:last-child') as HTMLButtonElement;
      pmBtn.click();
      
      expect(container.getParsedValue()?.period).toBe('PM');
    });
  });

  describe('keyboard navigation', () => {
    it('increments hours with ArrowUp', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      hoursInput.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      hoursInput.dispatchEvent(event);
      
      expect(container.getValue()).toBe('11:00');
    });

    it('decrements hours with ArrowDown', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      hoursInput.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      hoursInput.dispatchEvent(event);
      
      expect(container.getValue()).toBe('09:00');
    });

    it('increments minutes with ArrowUp on minutes field', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1] as HTMLInputElement;
      minutesInput.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      minutesInput.dispatchEvent(event);
      
      expect(container.getValue()).toBe('10:01');
    });

    it('decrements minutes with ArrowDown on minutes field', () => {
      container = createTimePicker({ value: '10:30', format: '24h' });
      document.body.appendChild(container);
      
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1] as HTMLInputElement;
      minutesInput.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      minutesInput.dispatchEvent(event);
      
      expect(container.getValue()).toBe('10:29');
    });
  });

  describe('direct input', () => {
    it('accepts valid hours input', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      hoursInput.value = '15';
      hoursInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(container.getValue()).toBe('15:00');
    });

    it('accepts valid minutes input', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1] as HTMLInputElement;
      minutesInput.value = '45';
      minutesInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(container.getValue()).toBe('10:45');
    });

    it('rejects invalid hours input', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      hoursInput.value = '25';
      hoursInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Should reset to original value
      expect(container.getValue()).toBe('10:00');
    });

    it('rejects invalid minutes input', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      document.body.appendChild(container);
      
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1] as HTMLInputElement;
      minutesInput.value = '65';
      minutesInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Should reset to original value
      expect(container.getValue()).toBe('10:00');
    });
  });

  describe('public API', () => {
    it('getValue returns formatted string', () => {
      container = createTimePicker({ value: '14:30', format: '24h' });
      expect(container.getValue()).toBe('14:30');
    });

    it('getValue returns empty string when no value', () => {
      container = createTimePicker({});
      expect(container.getValue()).toBe('');
    });

    it('getParsedValue returns parsed time object', () => {
      container = createTimePicker({ value: '14:30', format: '24h' });
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(14);
      expect(parsed?.minutes).toBe(30);
    });

    it('getParsedValue returns null when no value', () => {
      container = createTimePicker({});
      expect(container.getParsedValue()).toBeNull();
    });

    it('setValue updates the time', () => {
      container = createTimePicker({ format: '24h' });
      container.setValue('15:45');
      
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(15);
      expect(parsed?.minutes).toBe(45);
    });

    it('setValue accepts Date object', () => {
      container = createTimePicker({ format: '24h' });
      const date = new Date();
      date.setHours(10, 30);
      container.setValue(date);
      
      expect(container.getValue()).toBe('10:30');
    });

    it('setValue with null clears the time', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      container.setValue(null);
      
      expect(container.getValue()).toBe('');
      expect(container.getParsedValue()).toBeNull();
    });

    it('setHours updates hours', () => {
      container = createTimePicker({ value: '10:30', format: '24h' });
      container.setHours(15);
      
      expect(container.getValue()).toBe('15:30');
    });

    it('setMinutes updates minutes', () => {
      container = createTimePicker({ value: '10:30', format: '24h' });
      container.setMinutes(45);
      
      expect(container.getValue()).toBe('10:45');
    });

    it('setPeriod updates period in 12h format', () => {
      container = createTimePicker({ value: '10:00 AM', format: '12h' });
      container.setPeriod('PM');
      
      expect(container.getParsedValue()?.period).toBe('PM');
    });

    it('togglePeriod toggles AM/PM', () => {
      container = createTimePicker({ value: '10:00 AM', format: '12h' });
      container.togglePeriod();
      
      expect(container.getParsedValue()?.period).toBe('PM');
      
      container.togglePeriod();
      expect(container.getParsedValue()?.period).toBe('AM');
    });

    it('clear clears the time', () => {
      const onChange = vi.fn();
      container = createTimePicker({ value: '10:00', format: '24h', onChange });
      container.clear();
      
      expect(container.getValue()).toBe('');
      expect(onChange).toHaveBeenCalledWith('', null);
    });

    it('focus focuses the hours input', () => {
      container = createTimePicker({});
      document.body.appendChild(container);
      
      container.focus();
      
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(document.activeElement).toBe(hoursInput);
    });
  });

  describe('onChange callback', () => {
    it('fires when hours change', () => {
      const onChange = vi.fn();
      container = createTimePicker({ value: '10:00', format: '24h', onChange });
      document.body.appendChild(container);
      
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      upBtn.click();
      
      expect(onChange).toHaveBeenCalledWith('11:00', expect.objectContaining({ hours: 11, minutes: 0 }));
    });

    it('fires when minutes change', () => {
      const onChange = vi.fn();
      container = createTimePicker({ value: '10:00', format: '24h', onChange });
      document.body.appendChild(container);
      
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const minutesUpBtn = upBtns[1] as HTMLButtonElement;
      minutesUpBtn.click();
      
      expect(onChange).toHaveBeenCalledWith('10:01', expect.objectContaining({ hours: 10, minutes: 1 }));
    });

    it('fires when period changes', () => {
      const onChange = vi.fn();
      container = createTimePicker({ value: '10:00 AM', format: '12h', onChange });
      document.body.appendChild(container);
      
      const pmBtn = container.querySelector('.dos-time-picker___period-btn:last-child') as HTMLButtonElement;
      pmBtn.click();
      
      expect(onChange).toHaveBeenCalledWith('10:00 PM', expect.objectContaining({ period: 'PM' }));
    });
  });

  describe('accessibility', () => {
    it('hours input has role=spinbutton', () => {
      container = createTimePicker({});
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(hoursInput?.getAttribute('role')).toBe('spinbutton');
    });

    it('hours input has aria-label', () => {
      container = createTimePicker({});
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(hoursInput?.getAttribute('aria-label')).toBe('Hours');
    });

    it('hours input has aria-valuemin and aria-valuemax', () => {
      container = createTimePicker({ format: '24h' });
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(hoursInput?.getAttribute('aria-valuemin')).toBe('0');
      expect(hoursInput?.getAttribute('aria-valuemax')).toBe('23');
    });

    it('hours input has aria-valuemin and aria-valuemax for 12h format', () => {
      container = createTimePicker({ format: '12h' });
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(hoursInput?.getAttribute('aria-valuemin')).toBe('1');
      expect(hoursInput?.getAttribute('aria-valuemax')).toBe('12');
    });

    it('hours input has aria-valuenow when value is set', () => {
      container = createTimePicker({ value: '10:00', format: '24h' });
      const hoursInput = container.querySelector('.dos-time-picker___input');
      expect(hoursInput?.getAttribute('aria-valuenow')).toBe('10');
    });

    it('minutes input has role=spinbutton', () => {
      container = createTimePicker({});
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1];
      expect(minutesInput?.getAttribute('role')).toBe('spinbutton');
    });

    it('minutes input has aria-label', () => {
      container = createTimePicker({});
      const inputs = container.querySelectorAll('.dos-time-picker___input');
      const minutesInput = inputs[1];
      expect(minutesInput?.getAttribute('aria-label')).toBe('Minutes');
    });

    it('spinner buttons have aria-labels', () => {
      container = createTimePicker({});
      const upBtns = container.querySelectorAll('.dos-time-picker___spinner--up');
      const downBtns = container.querySelectorAll('.dos-time-picker___spinner--down');
      
      expect(upBtns[0]?.getAttribute('aria-label')).toBe('Increase hours');
      expect(downBtns[0]?.getAttribute('aria-label')).toBe('Decrease hours');
      expect(upBtns[1]?.getAttribute('aria-label')).toBe('Increase minutes');
      expect(downBtns[1]?.getAttribute('aria-label')).toBe('Decrease minutes');
    });

    it('period buttons have aria-pressed', () => {
      container = createTimePicker({ value: '10:00 AM', format: '12h' });
      const amBtn = container.querySelector('.dos-time-picker___period-btn:first-child');
      const pmBtn = container.querySelector('.dos-time-picker___period-btn:last-child');
      
      expect(amBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(pmBtn?.getAttribute('aria-pressed')).toBe('false');
    });

    it('separator has aria-hidden', () => {
      container = createTimePicker({});
      const separator = container.querySelector('.dos-time-picker___separator');
      expect(separator?.getAttribute('aria-hidden')).toBe('true');
    });

    it('label is linked to hours input', () => {
      container = createTimePicker({ label: 'Select Time' });
      
      const label = container.querySelector('.dos-time-picker___label') as HTMLLabelElement;
      const hoursInput = container.querySelector('.dos-time-picker___input') as HTMLInputElement;
      
      expect(label.htmlFor).toBe(hoursInput.id);
    });
  });

  describe('time parsing', () => {
    it('parses 24h time string', () => {
      container = createTimePicker({ value: '14:30', format: '24h' });
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(14);
      expect(parsed?.minutes).toBe(30);
    });

    it('parses 12h time string with AM', () => {
      container = createTimePicker({ value: '10:30 AM', format: '12h' });
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(10);
      expect(parsed?.minutes).toBe(30);
      expect(parsed?.period).toBe('AM');
    });

    it('parses 12h time string with PM', () => {
      container = createTimePicker({ value: '2:30 PM', format: '12h' });
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(2);
      expect(parsed?.minutes).toBe(30);
      expect(parsed?.period).toBe('PM');
    });

    it('converts 12:00 AM to midnight in 12h format', () => {
      container = createTimePicker({ value: '12:00 AM', format: '12h' });
      const parsed = container.getParsedValue();
      // In display, midnight is shown as 12:00 AM
      expect(parsed?.hours).toBe(12);
      expect(parsed?.period).toBe('AM');
    });

    it('converts 12:00 PM to noon in 12h format', () => {
      container = createTimePicker({ value: '12:00 PM', format: '12h' });
      const parsed = container.getParsedValue();
      expect(parsed?.hours).toBe(12);
      expect(parsed?.period).toBe('PM');
    });

    it('parses Date object', () => {
      const date = new Date();
      date.setHours(15, 45);
      container = createTimePicker({ value: date, format: '24h' });
      
      expect(container.getValue()).toBe('15:45');
    });

    it('handles invalid time string gracefully', () => {
      container = createTimePicker({ value: 'invalid', format: '24h' });
      expect(container.getValue()).toBe('');
      expect(container.getParsedValue()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('initializes with no value', () => {
      container = createTimePicker({});
      document.body.appendChild(container);
      
      // First increment should initialize to default
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      upBtn.click();
      
      expect(container.getParsedValue()).not.toBeNull();
    });

    it('destroy removes event listeners', () => {
      container = createTimePicker({});
      document.body.appendChild(container);
      
      container.destroy();
      
      // Should not throw when clicking after destroy
      const upBtn = container.querySelector('.dos-time-picker___spinner--up') as HTMLButtonElement;
      expect(() => upBtn.click()).not.toThrow();
    });
  });
});
