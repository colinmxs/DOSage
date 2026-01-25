/**
 * Toggle/Switch Component
 *
 * DOS-style toggle switch with ON/OFF states.
 * Supports text style [ON ] / [OFF] and slider style [■──] / [──■].
 */

import type { ToggleProps, ToggleElement } from './Toggle.types';
import './Toggle.css';

let toggleIdCounter = 0;

/**
 * Generates a unique ID for toggle elements.
 */
function generateToggleId(): string {
  return `dos-toggle-${++toggleIdCounter}`;
}

/**
 * Creates a DOS-style toggle/switch component.
 *
 * @param props - Toggle configuration options
 * @returns Toggle DOM element with control methods
 *
 * @example
 * ```typescript
 * const toggle = createToggle({
 *   label: 'Dark Mode',
 *   checked: false,
 *   onChange: (checked) => console.log('Toggled:', checked)
 * });
 * document.body.appendChild(toggle);
 * ```
 */
export function createToggle(props: ToggleProps = {}): ToggleElement {
  const {
    checked = false,
    label,
    labelPosition = 'right',
    onLabel = 'ON',
    offLabel = 'OFF',
    style = 'text',
    size = 'md',
    name,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    className,
    id,
  } = props;

  // State
  let isChecked = checked;
  let isDisabled = disabled;

  // Generate unique ID
  const toggleId = id ?? generateToggleId();
  const labelId = `${toggleId}-label`;

  // Create wrapper element
  const wrapper = document.createElement('div') as unknown as ToggleElement;
  wrapper.id = toggleId;
  wrapper.className = buildWrapperClasses();

  // Create label if provided
  let labelElement: HTMLSpanElement | null = null;
  if (label) {
    labelElement = document.createElement('span');
    labelElement.id = labelId;
    labelElement.className = 'dos-toggle__label';
    labelElement.textContent = label;
  }

  // Create toggle track (the clickable button)
  const track = document.createElement('button');
  track.type = 'button';
  track.className = buildTrackClasses();
  track.setAttribute('role', 'switch');
  track.setAttribute('aria-checked', String(isChecked));
  if (label) {
    track.setAttribute('aria-labelledby', labelId);
  }
  if (isDisabled) {
    track.disabled = true;
    track.setAttribute('aria-disabled', 'true');
  }

  // Create track content based on style
  if (style === 'text') {
    const stateSpan = document.createElement('span');
    stateSpan.className = 'dos-toggle__state';
    stateSpan.textContent = isChecked ? onLabel : offLabel;
    track.appendChild(stateSpan);
  } else {
    // Slider style
    const sliderTrack = document.createElement('span');
    sliderTrack.className = 'dos-toggle__slider-track';

    const thumb = document.createElement('span');
    thumb.className = 'dos-toggle__thumb';

    const rail = document.createElement('span');
    rail.className = 'dos-toggle__rail';
    if (isChecked) {
      rail.classList.add('dos-toggle__rail--filled');
    }

    sliderTrack.appendChild(thumb);
    sliderTrack.appendChild(rail);
    track.appendChild(sliderTrack);
  }

  // Create hidden input for form submission
  let hiddenInput: HTMLInputElement | null = null;
  if (name) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'checkbox';
    hiddenInput.name = name;
    hiddenInput.className = 'dos-toggle__input';
    hiddenInput.checked = isChecked;
    hiddenInput.disabled = isDisabled;
    hiddenInput.setAttribute('aria-hidden', 'true');
    hiddenInput.tabIndex = -1;
    wrapper.appendChild(hiddenInput);
  }

  // Assemble elements based on label position
  if (labelElement && labelPosition === 'left') {
    wrapper.appendChild(labelElement);
  }
  wrapper.appendChild(track);
  if (labelElement && labelPosition === 'right') {
    wrapper.appendChild(labelElement);
  }

  /**
   * Builds the wrapper class string.
   */
  function buildWrapperClasses(): string {
    const classes = ['dos-toggle'];
    classes.push(`dos-toggle--${style}`);
    classes.push(`dos-toggle--${size}`);
    classes.push(`dos-toggle--label-${labelPosition}`);
    if (isChecked) classes.push('dos-toggle--checked');
    if (isDisabled) classes.push('dos-toggle--disabled');
    if (className) classes.push(className);
    return classes.join(' ');
  }

  /**
   * Builds the track class string.
   */
  function buildTrackClasses(): string {
    const classes = ['dos-toggle__track'];
    classes.push(isChecked ? 'dos-toggle__track--on' : 'dos-toggle__track--off');
    return classes.join(' ');
  }

  /**
   * Updates the visual state of the toggle.
   */
  function updateState(): void {
    wrapper.className = buildWrapperClasses();
    track.className = buildTrackClasses();
    track.setAttribute('aria-checked', String(isChecked));

    if (style === 'text') {
      const stateSpan = track.querySelector('.dos-toggle__state');
      if (stateSpan) {
        stateSpan.textContent = isChecked ? onLabel : offLabel;
      }
    } else {
      const rail = track.querySelector('.dos-toggle__rail');
      if (rail) {
        if (isChecked) {
          rail.classList.add('dos-toggle__rail--filled');
        } else {
          rail.classList.remove('dos-toggle__rail--filled');
        }
      }
    }

    if (hiddenInput) {
      hiddenInput.checked = isChecked;
    }
  }

  /**
   * Toggles the checked state.
   */
  function toggle(): void {
    if (isDisabled) return;
    isChecked = !isChecked;
    updateState();
    onChange?.(isChecked);
  }

  /**
   * Handles click on the toggle.
   */
  function handleClick(e: MouseEvent): void {
    e.preventDefault();
    toggle();
  }

  /**
   * Handles keyboard events.
   */
  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
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

  // Attach event listeners
  track.addEventListener('click', handleClick);
  track.addEventListener('keydown', handleKeydown);
  track.addEventListener('focus', handleFocus);
  track.addEventListener('blur', handleBlur);

  // Also make wrapper clickable (but not the label area directly to avoid double-firing)
  wrapper.addEventListener('click', (e) => {
    // Only handle clicks on wrapper itself, not on child elements
    if (e.target === wrapper || (labelElement && e.target === labelElement)) {
      e.preventDefault();
      track.focus();
      toggle();
    }
  });

  // Public API methods
  wrapper.getChecked = () => isChecked;

  wrapper.setChecked = (newChecked: boolean) => {
    if (isChecked !== newChecked) {
      isChecked = newChecked;
      updateState();
    }
  };

  wrapper.toggle = () => {
    toggle();
  };

  wrapper.setDisabled = (newDisabled: boolean) => {
    isDisabled = newDisabled;
    track.disabled = isDisabled;
    if (isDisabled) {
      track.setAttribute('aria-disabled', 'true');
    } else {
      track.removeAttribute('aria-disabled');
    }
    if (hiddenInput) {
      hiddenInput.disabled = isDisabled;
    }
    wrapper.className = buildWrapperClasses();
  };

  wrapper.destroy = () => {
    track.removeEventListener('click', handleClick);
    track.removeEventListener('keydown', handleKeydown);
    track.removeEventListener('focus', handleFocus);
    track.removeEventListener('blur', handleBlur);
    wrapper.remove();
  };

  return wrapper;
}
