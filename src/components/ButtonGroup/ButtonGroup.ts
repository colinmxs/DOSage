/**
 * ButtonGroup Component
 *
 * Groups multiple buttons together with consistent styling.
 * Supports horizontal/vertical orientation and connected/separated modes.
 */

import type { ButtonGroupProps } from './ButtonGroup.types';
import './ButtonGroup.css';

/**
 * Creates a DOS-style button group element.
 *
 * @param props - ButtonGroup configuration options
 * @returns The button group DOM element
 *
 * @example
 * ```typescript
 * import { createButtonGroup, createButton } from 'dosage';
 *
 * const group = createButtonGroup({
 *   orientation: 'horizontal',
 *   connected: true,
 *   ariaLabel: 'File actions'
 * });
 *
 * const btn1 = createButton({ label: 'New' });
 * const btn2 = createButton({ label: 'Open' });
 * const btn3 = createButton({ label: 'Save' });
 *
 * addButtonsToGroup(group, [btn1, btn2, btn3]);
 * document.body.appendChild(group);
 * ```
 */
export function createButtonGroup(props: ButtonGroupProps = {}): HTMLElement {
  const {
    orientation = 'horizontal',
    connected = false,
    ariaLabel,
    className,
    id,
  } = props;

  // Create group element
  const element = document.createElement('div');

  // Build class list
  const classes = [
    'dos-button-group',
    `dos-button-group--${orientation}`,
    connected ? 'dos-button-group--connected' : 'dos-button-group--separated',
  ];

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Set ARIA attributes
  element.setAttribute('role', 'group');

  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }

  return element;
}

/**
 * Adds buttons to a button group.
 *
 * @param group - The button group element
 * @param buttons - Array of button elements to add
 */
export function addButtonsToGroup(
  group: HTMLElement,
  buttons: HTMLButtonElement[]
): void {
  buttons.forEach((button) => {
    group.appendChild(button);
  });

  // Set up keyboard navigation for connected groups
  if (group.classList.contains('dos-button-group--connected')) {
    setupKeyboardNavigation(group, buttons);
  }
}

/**
 * Sets up arrow key navigation within a connected button group.
 *
 * @param group - The button group element
 * @param buttons - Array of button elements
 */
function setupKeyboardNavigation(
  group: HTMLElement,
  buttons: HTMLButtonElement[]
): void {
  const isVertical = group.classList.contains('dos-button-group--vertical');

  buttons.forEach((button, index) => {
    button.addEventListener('keydown', (event: KeyboardEvent) => {
      const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

      let targetIndex = -1;

      if (event.key === prevKey) {
        targetIndex = index > 0 ? index - 1 : buttons.length - 1;
      } else if (event.key === nextKey) {
        targetIndex = index < buttons.length - 1 ? index + 1 : 0;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = buttons.length - 1;
      }

      if (targetIndex >= 0) {
        event.preventDefault();
        buttons[targetIndex].focus();
      }
    });
  });
}

/**
 * Gets all buttons in a button group.
 *
 * @param group - The button group element
 * @returns Array of button elements
 */
export function getGroupButtons(group: HTMLElement): HTMLButtonElement[] {
  return Array.from(group.querySelectorAll('.dos-button'));
}
