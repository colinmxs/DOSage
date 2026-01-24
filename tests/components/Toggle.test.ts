/**
 * Toggle Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createToggle } from '../../src/components/Toggle';

describe('Toggle', () => {
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
      const toggle = createToggle();
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle')).toBe(true);
      expect(toggle.querySelector('.dos-toggle__track')).not.toBeNull();
    });

    it('renders off state by default', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      expect(track?.getAttribute('aria-checked')).toBe('false');
      expect(toggle.classList.contains('dos-toggle--checked')).toBe(false);
    });

    it('renders on state when checked', () => {
      const toggle = createToggle({ checked: true });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      expect(track?.getAttribute('aria-checked')).toBe('true');
      expect(toggle.classList.contains('dos-toggle--checked')).toBe(true);
    });

    it('renders with label', () => {
      const toggle = createToggle({ label: 'Dark Mode' });
      container.appendChild(toggle);

      const label = toggle.querySelector('.dos-toggle__label');
      expect(label?.textContent).toBe('Dark Mode');
    });

    it('renders label on left when specified', () => {
      const toggle = createToggle({ label: 'Test', labelPosition: 'left' });
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle--label-left')).toBe(true);
      // Label should be first child
      const firstChild = toggle.querySelector(':first-child');
      expect(firstChild?.classList.contains('dos-toggle__label')).toBe(true);
    });

    it('renders label on right by default', () => {
      const toggle = createToggle({ label: 'Test', labelPosition: 'right' });
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle--label-right')).toBe(true);
    });

    it('renders text style by default', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle--text')).toBe(true);
      expect(toggle.querySelector('.dos-toggle__state')).not.toBeNull();
    });

    it('renders slider style when specified', () => {
      const toggle = createToggle({ style: 'slider' });
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle--slider')).toBe(true);
      expect(toggle.querySelector('.dos-toggle__thumb')).not.toBeNull();
      expect(toggle.querySelector('.dos-toggle__rail')).not.toBeNull();
    });

    it('renders all size variants', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        const toggle = createToggle({ size });
        container.appendChild(toggle);

        expect(toggle.classList.contains(`dos-toggle--${size}`)).toBe(true);
      });
    });

    it('renders custom ON/OFF labels', () => {
      const toggle = createToggle({
        onLabel: 'YES',
        offLabel: 'NO',
        checked: false,
      });
      container.appendChild(toggle);

      const stateEl = toggle.querySelector('.dos-toggle__state');
      expect(stateEl?.textContent).toBe('NO');

      toggle.setChecked(true);
      expect(stateEl?.textContent).toBe('YES');
    });
  });

  describe('interaction', () => {
    it('toggles on click', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      expect(toggle.getChecked()).toBe(false);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      track.click();

      expect(toggle.getChecked()).toBe(true);
    });

    it('toggles on label click', () => {
      const toggle = createToggle({ label: 'Test' });
      container.appendChild(toggle);

      expect(toggle.getChecked()).toBe(false);

      const label = toggle.querySelector('.dos-toggle__label') as HTMLElement;
      label.click();

      expect(toggle.getChecked()).toBe(true);
    });

    it('toggles on Space key', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      track.dispatchEvent(event);

      expect(toggle.getChecked()).toBe(true);
    });

    it('toggles on Enter key', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      track.dispatchEvent(event);

      expect(toggle.getChecked()).toBe(true);
    });

    it('calls onChange when toggled', () => {
      const onChange = vi.fn();
      const toggle = createToggle({ onChange });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      track.click();

      expect(onChange).toHaveBeenCalledWith(true);

      track.click();
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('calls onFocus when focused', () => {
      const onFocus = vi.fn();
      const toggle = createToggle({ onFocus });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      track.focus();

      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when blurred', () => {
      const onBlur = vi.fn();
      const toggle = createToggle({ onBlur });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      track.focus();
      track.blur();

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('renders disabled state', () => {
      const toggle = createToggle({ disabled: true });
      container.appendChild(toggle);

      expect(toggle.classList.contains('dos-toggle--disabled')).toBe(true);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      expect(track.disabled).toBe(true);
      expect(track.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not toggle when disabled', () => {
      const onChange = vi.fn();
      const toggle = createToggle({ disabled: true, onChange });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      track.click();

      expect(toggle.getChecked()).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('can be disabled programmatically', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      toggle.setDisabled(true);

      expect(toggle.classList.contains('dos-toggle--disabled')).toBe(true);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      expect(track.disabled).toBe(true);
    });

    it('can be enabled programmatically', () => {
      const toggle = createToggle({ disabled: true });
      container.appendChild(toggle);

      toggle.setDisabled(false);

      expect(toggle.classList.contains('dos-toggle--disabled')).toBe(false);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      expect(track.disabled).toBe(false);
    });
  });

  describe('public methods', () => {
    it('getChecked returns current state', () => {
      const toggle = createToggle({ checked: true });
      container.appendChild(toggle);

      expect(toggle.getChecked()).toBe(true);
    });

    it('setChecked updates the state', () => {
      const toggle = createToggle({ checked: false });
      container.appendChild(toggle);

      toggle.setChecked(true);

      expect(toggle.getChecked()).toBe(true);
      expect(toggle.classList.contains('dos-toggle--checked')).toBe(true);
    });

    it('setChecked does not fire onChange', () => {
      const onChange = vi.fn();
      const toggle = createToggle({ onChange });
      container.appendChild(toggle);

      toggle.setChecked(true);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('toggle method toggles the state', () => {
      const onChange = vi.fn();
      const toggle = createToggle({ onChange });
      container.appendChild(toggle);

      toggle.toggle();

      expect(toggle.getChecked()).toBe(true);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('destroy removes the element', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      expect(container.contains(toggle)).toBe(true);

      toggle.destroy();

      expect(container.contains(toggle)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="switch"', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      expect(track?.getAttribute('role')).toBe('switch');
    });

    it('has aria-checked attribute', () => {
      const toggle = createToggle({ checked: false });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      expect(track?.getAttribute('aria-checked')).toBe('false');

      toggle.setChecked(true);
      expect(track?.getAttribute('aria-checked')).toBe('true');
    });

    it('has aria-labelledby when label provided', () => {
      const toggle = createToggle({ label: 'Test', id: 'test-toggle' });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      const labelId = track?.getAttribute('aria-labelledby');

      expect(labelId).toBe('test-toggle-label');

      const label = toggle.querySelector(`#${labelId}`);
      expect(label?.textContent).toBe('Test');
    });

    it('has aria-disabled when disabled', () => {
      const toggle = createToggle({ disabled: true });
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track');
      expect(track?.getAttribute('aria-disabled')).toBe('true');
    });

    it('is keyboard accessible', () => {
      const toggle = createToggle();
      container.appendChild(toggle);

      const track = toggle.querySelector('.dos-toggle__track') as HTMLButtonElement;
      expect(track.tabIndex).not.toBe(-1);
    });
  });

  describe('form integration', () => {
    it('creates hidden input with name', () => {
      const toggle = createToggle({ name: 'dark-mode' });
      container.appendChild(toggle);

      const input = toggle.querySelector('input[name="dark-mode"]') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.type).toBe('checkbox');
    });

    it('hidden input reflects checked state', () => {
      const toggle = createToggle({ name: 'setting', checked: true });
      container.appendChild(toggle);

      const input = toggle.querySelector('input[name="setting"]') as HTMLInputElement;
      expect(input.checked).toBe(true);

      toggle.setChecked(false);
      expect(input.checked).toBe(false);
    });

    it('hidden input reflects disabled state', () => {
      const toggle = createToggle({ name: 'setting', disabled: true });
      container.appendChild(toggle);

      const input = toggle.querySelector('input[name="setting"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);

      toggle.setDisabled(false);
      expect(input.disabled).toBe(false);
    });
  });

  describe('slider style', () => {
    it('renders slider track correctly', () => {
      const toggle = createToggle({ style: 'slider' });
      container.appendChild(toggle);

      expect(toggle.querySelector('.dos-toggle__slider-track')).not.toBeNull();
      expect(toggle.querySelector('.dos-toggle__thumb')).not.toBeNull();
      expect(toggle.querySelector('.dos-toggle__rail')).not.toBeNull();
    });

    it('shows filled rail when checked', () => {
      const toggle = createToggle({ style: 'slider', checked: true });
      container.appendChild(toggle);

      const rail = toggle.querySelector('.dos-toggle__rail');
      expect(rail?.classList.contains('dos-toggle__rail--filled')).toBe(true);
    });

    it('removes filled rail when unchecked', () => {
      const toggle = createToggle({ style: 'slider', checked: true });
      container.appendChild(toggle);

      toggle.setChecked(false);

      const rail = toggle.querySelector('.dos-toggle__rail');
      expect(rail?.classList.contains('dos-toggle__rail--filled')).toBe(false);
    });
  });
});
