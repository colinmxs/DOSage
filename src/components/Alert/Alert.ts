/**
 * Alert Component
 *
 * A DOS-style banner notification for displaying info, success, warning, or error messages.
 * Features dismissible option and type-specific icons and colors.
 *
 * @example
 * ```typescript
 * import { createAlert } from 'dosage';
 *
 * const alert = createAlert({
 *   message: 'This action cannot be undone.',
 *   type: 'warning',
 *   title: 'Warning',
 *   dismissible: true,
 *   onDismiss: () => console.log('Alert dismissed')
 * });
 *
 * document.body.appendChild(alert.element);
 * ```
 */

import type { AlertProps, AlertInstance, AlertType } from './Alert.types';
import { ALERT_ICONS } from './Alert.types';
import './Alert.css';

/**
 * Creates a DOS-style alert banner
 */
export function createAlert(props: AlertProps): AlertInstance {
  const {
    message,
    type = 'info',
    title,
    icon = true,
    dismissible = false,
    onDismiss,
    className,
    id,
  } = props;

  // Track current state
  let currentType = type;
  let isVisible = true;

  // Create main element
  const alertEl = document.createElement('div');
  alertEl.className = `dos-alert dos-alert--${currentType}${className ? ` ${className}` : ''}`;
  if (id) {
    alertEl.id = id;
  }

  // Set ARIA attributes based on type
  // Error and warning use role="alert" for assertive announcement
  // Info and success use role="status" for polite announcement
  if (currentType === 'error' || currentType === 'warning') {
    alertEl.setAttribute('role', 'alert');
    alertEl.setAttribute('aria-live', 'assertive');
  } else {
    alertEl.setAttribute('role', 'status');
    alertEl.setAttribute('aria-live', 'polite');
  }

  // Create icon if enabled
  let iconEl: HTMLSpanElement | null = null;
  if (icon) {
    iconEl = document.createElement('span');
    iconEl.className = 'dos-alert__icon';
    iconEl.setAttribute('aria-hidden', 'true');
    const iconText = typeof icon === 'string' ? icon : ALERT_ICONS[currentType];
    iconEl.textContent = iconText;
    alertEl.appendChild(iconEl);
  }

  // Create content container
  const contentEl = document.createElement('div');
  contentEl.className = 'dos-alert__content';

  // Create title if provided
  let titleEl: HTMLDivElement | null = null;
  if (title) {
    titleEl = document.createElement('div');
    titleEl.className = 'dos-alert__title';
    titleEl.textContent = title;
    contentEl.appendChild(titleEl);
  }

  // Create message container
  const messageEl = document.createElement('div');
  messageEl.className = 'dos-alert__message';
  if (typeof message === 'string') {
    messageEl.textContent = message;
  } else {
    messageEl.appendChild(message);
  }
  contentEl.appendChild(messageEl);
  alertEl.appendChild(contentEl);

  // Create dismiss button if dismissible
  let dismissBtn: HTMLButtonElement | null = null;
  if (dismissible) {
    dismissBtn = document.createElement('button');
    dismissBtn.className = 'dos-alert__dismiss';
    dismissBtn.type = 'button';
    dismissBtn.textContent = 'X';
    dismissBtn.setAttribute('aria-label', 'Dismiss alert');
    dismissBtn.addEventListener('click', dismiss);
    alertEl.appendChild(dismissBtn);
  }

  /**
   * Dismiss the alert
   */
  function dismiss(): void {
    if (!isVisible) return;
    isVisible = false;
    alertEl.classList.add('dos-alert--hidden');
    onDismiss?.();
  }

  /**
   * Update the alert message
   */
  function setMessage(newMessage: string | HTMLElement): void {
    messageEl.innerHTML = '';
    if (typeof newMessage === 'string') {
      messageEl.textContent = newMessage;
    } else {
      messageEl.appendChild(newMessage);
    }
  }

  /**
   * Update the alert type
   */
  function setType(newType: AlertType): void {
    alertEl.classList.remove(`dos-alert--${currentType}`);
    alertEl.classList.add(`dos-alert--${newType}`);
    currentType = newType;

    // Update ARIA based on new type
    if (newType === 'error' || newType === 'warning') {
      alertEl.setAttribute('role', 'alert');
      alertEl.setAttribute('aria-live', 'assertive');
    } else {
      alertEl.setAttribute('role', 'status');
      alertEl.setAttribute('aria-live', 'polite');
    }

    // Update icon if using default icons
    if (iconEl && icon === true) {
      iconEl.textContent = ALERT_ICONS[newType];
    }
  }

  /**
   * Remove the alert from DOM and clean up
   */
  function destroy(): void {
    if (dismissBtn) {
      dismissBtn.removeEventListener('click', dismiss);
    }
    alertEl.remove();
  }

  return {
    element: alertEl,
    dismiss,
    setMessage,
    setType,
    destroy,
  };
}
