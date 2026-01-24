/**
 * Toast Component
 *
 * A DOS-style toast notification system for displaying temporary messages.
 * Supports auto-dismiss, stacking, positioning, and pause-on-hover.
 *
 * @example
 * ```typescript
 * import { createToast, createToastContainer, toast } from 'dosage';
 *
 * // Using the toast() convenience function
 * toast.info('File saved successfully');
 * toast.error('Failed to load data');
 *
 * // Using ToastContainer for more control
 * const container = createToastContainer({
 *   position: 'bottom-right',
 *   maxToasts: 3
 * });
 * document.body.appendChild(container.element);
 *
 * container.add({ message: 'Hello!', type: 'success' });
 * ```
 */

import type {
  ToastProps,
  ToastInstance,
  ToastContainerProps,
  ToastContainerInstance,
  ToastType,
  ToastPosition,
} from './Toast.types';
import { TOAST_ICONS } from './Toast.types';
import './Toast.css';

// Counter for unique toast IDs
let toastIdCounter = 0;

/**
 * Creates a single toast element
 */
export function createToast(props: ToastProps): ToastInstance {
  const {
    message,
    type = 'info',
    duration = 5000,
    dismissible = true,
    onDismiss,
    pauseOnHover = true,
    className,
    id,
  } = props;

  // Generate unique ID
  const toastId = id || `dos-toast-${++toastIdCounter}`;

  // Track state
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let remainingTime = duration || 0;
  let startTime = 0;
  let isPaused = false;
  let isDismissed = false;

  // Create main element
  const toastEl = document.createElement('div');
  toastEl.className = `dos-toast dos-toast--${type} dos-toast--entering${className ? ` ${className}` : ''}`;
  toastEl.id = toastId;
  toastEl.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');
  toastEl.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');
  toastEl.setAttribute('aria-atomic', 'true');

  // Create icon
  const iconEl = document.createElement('span');
  iconEl.className = 'dos-toast__icon';
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = TOAST_ICONS[type];
  toastEl.appendChild(iconEl);

  // Create content container
  const contentEl = document.createElement('div');
  contentEl.className = 'dos-toast__content';

  // Create message
  const messageEl = document.createElement('p');
  messageEl.className = 'dos-toast__message';
  messageEl.textContent = message;
  contentEl.appendChild(messageEl);
  toastEl.appendChild(contentEl);

  // Create dismiss button if dismissible
  let dismissBtn: HTMLButtonElement | null = null;
  if (dismissible) {
    dismissBtn = document.createElement('button');
    dismissBtn.className = 'dos-toast__dismiss';
    dismissBtn.type = 'button';
    dismissBtn.textContent = 'X';
    dismissBtn.setAttribute('aria-label', 'Dismiss notification');
    dismissBtn.addEventListener('click', dismiss);
    toastEl.appendChild(dismissBtn);
  }

  // Remove entering animation class after animation completes
  const handleAnimationEnd = (e: AnimationEvent) => {
    // Check if animationName exists (may not in some test environments)
    if (e.animationName?.includes('enter') || !e.animationName) {
      toastEl.classList.remove('dos-toast--entering');
    }
  };
  toastEl.addEventListener('animationend', handleAnimationEnd);

  // Auto-dismiss timer functions
  function startTimer(): void {
    if (duration && duration > 0 && !isPaused && !isDismissed) {
      startTime = Date.now();
      timeoutId = setTimeout(dismiss, remainingTime);
    }
  }

  function pauseTimer(): void {
    if (timeoutId && !isPaused) {
      clearTimeout(timeoutId);
      timeoutId = null;
      remainingTime -= Date.now() - startTime;
      isPaused = true;
      toastEl.classList.add('dos-toast--paused');
    }
  }

  function resumeTimer(): void {
    if (isPaused && !isDismissed) {
      isPaused = false;
      toastEl.classList.remove('dos-toast--paused');
      startTimer();
    }
  }

  // Pause on hover
  if (pauseOnHover && duration) {
    toastEl.addEventListener('mouseenter', pauseTimer);
    toastEl.addEventListener('mouseleave', resumeTimer);
  }

  // Start auto-dismiss timer
  startTimer();

  /**
   * Dismiss the toast with exit animation
   */
  function dismiss(): void {
    if (isDismissed) return;
    isDismissed = true;

    // Clear timer
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Trigger exit animation
    toastEl.classList.add('dos-toast--exiting');

    // Remove after animation
    const handleExitEnd = () => {
      toastEl.removeEventListener('animationend', handleExitEnd);
      destroy();
      onDismiss?.();
    };
    toastEl.addEventListener('animationend', handleExitEnd);
  }

  /**
   * Pause the auto-dismiss timer
   */
  function pause(): void {
    pauseTimer();
  }

  /**
   * Resume the auto-dismiss timer
   */
  function resume(): void {
    resumeTimer();
  }

  /**
   * Remove the toast from DOM and clean up
   */
  function destroy(): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (dismissBtn) {
      dismissBtn.removeEventListener('click', dismiss);
    }
    toastEl.removeEventListener('animationend', handleAnimationEnd);
    if (pauseOnHover) {
      toastEl.removeEventListener('mouseenter', pauseTimer);
      toastEl.removeEventListener('mouseleave', resumeTimer);
    }
    toastEl.remove();
  }

  return {
    element: toastEl,
    id: toastId,
    dismiss,
    pause,
    resume,
    destroy,
  };
}

/**
 * Creates a toast container for managing multiple toasts
 */
export function createToastContainer(props: ToastContainerProps = {}): ToastContainerInstance {
  const {
    position = 'top-right',
    maxToasts = 5,
    className,
    id,
  } = props;

  // Track active toasts
  const toasts: ToastInstance[] = [];

  // Create container element
  const containerEl = document.createElement('div');
  containerEl.className = `dos-toast-container dos-toast-container--${position}${className ? ` ${className}` : ''}`;
  if (id) {
    containerEl.id = id;
  }
  containerEl.setAttribute('aria-label', 'Notifications');
  containerEl.setAttribute('aria-live', 'polite');

  /**
   * Add a new toast to the container
   */
  function add(toastProps: Omit<ToastProps, 'position'>): ToastInstance {
    // Remove oldest toasts if at max
    while (toasts.length >= maxToasts) {
      const oldest = toasts.shift();
      oldest?.dismiss();
    }

    // Create new toast
    const toast = createToast({
      ...toastProps,
      onDismiss: () => {
        // Remove from tracking array
        const index = toasts.indexOf(toast);
        if (index > -1) {
          toasts.splice(index, 1);
        }
        toastProps.onDismiss?.();
      },
    });

    // Add to container and tracking
    toasts.push(toast);
    containerEl.appendChild(toast.element);

    return toast;
  }

  /**
   * Remove a specific toast by ID
   */
  function remove(toastId: string): void {
    const toast = toasts.find((t) => t.id === toastId);
    toast?.dismiss();
  }

  /**
   * Remove all toasts
   */
  function clear(): void {
    [...toasts].forEach((toast) => toast.dismiss());
  }

  /**
   * Get all active toasts
   */
  function getToasts(): ToastInstance[] {
    return [...toasts];
  }

  /**
   * Clean up the container
   */
  function destroy(): void {
    clear();
    containerEl.remove();
  }

  return {
    element: containerEl,
    add,
    remove,
    clear,
    getToasts,
    destroy,
  };
}

// Default container for convenience functions
let defaultContainer: ToastContainerInstance | null = null;
let defaultPosition: ToastPosition = 'top-right';

/**
 * Get or create the default toast container
 */
function getDefaultContainer(): ToastContainerInstance {
  if (!defaultContainer) {
    defaultContainer = createToastContainer({ position: defaultPosition });
    document.body.appendChild(defaultContainer.element);
  }
  return defaultContainer;
}

/**
 * Convenience object for showing toasts
 */
export const toast = {
  /**
   * Show an info toast
   */
  info(message: string, options?: Partial<Omit<ToastProps, 'message' | 'type'>>): ToastInstance {
    return getDefaultContainer().add({ message, type: 'info', ...options });
  },

  /**
   * Show a success toast
   */
  success(message: string, options?: Partial<Omit<ToastProps, 'message' | 'type'>>): ToastInstance {
    return getDefaultContainer().add({ message, type: 'success', ...options });
  },

  /**
   * Show a warning toast
   */
  warning(message: string, options?: Partial<Omit<ToastProps, 'message' | 'type'>>): ToastInstance {
    return getDefaultContainer().add({ message, type: 'warning', ...options });
  },

  /**
   * Show an error toast
   */
  error(message: string, options?: Partial<Omit<ToastProps, 'message' | 'type'>>): ToastInstance {
    return getDefaultContainer().add({ message, type: 'error', ...options });
  },

  /**
   * Show a toast with custom type
   */
  show(props: ToastProps): ToastInstance {
    return getDefaultContainer().add(props);
  },

  /**
   * Clear all toasts from the default container
   */
  clear(): void {
    defaultContainer?.clear();
  },

  /**
   * Set the default position for toasts
   */
  setPosition(position: ToastPosition): void {
    defaultPosition = position;
    if (defaultContainer) {
      // Recreate container with new position
      const toasts = defaultContainer.getToasts();
      defaultContainer.element.remove();
      defaultContainer = createToastContainer({ position });
      document.body.appendChild(defaultContainer.element);
      // Note: existing toasts will be cleared, this is intentional
    }
  },

  /**
   * Get the default container (creates it if needed)
   */
  getContainer(): ToastContainerInstance {
    return getDefaultContainer();
  },

  /**
   * Destroy the default container
   */
  destroy(): void {
    if (defaultContainer) {
      defaultContainer.destroy();
      defaultContainer = null;
    }
  },
};
