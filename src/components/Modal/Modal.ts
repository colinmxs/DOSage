/**
 * Modal Component
 *
 * A DOS-style modal/dialog with box-drawing borders, focus trapping,
 * and keyboard navigation.
 */

import type { ModalProps, ModalInstance, ModalSize } from './Modal.types';
import './Modal.css';

/** Counter for generating unique IDs */
let modalIdCounter = 0;

/** Track the element that opened the modal for focus restoration */
let previousActiveElement: Element | null = null;

/** All focusable element selectors */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([data-dos-focus-trap])',
].join(', ');

/**
 * Gets all focusable elements within a container (excluding focus traps)
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

/**
 * Creates a DOS-style modal dialog.
 *
 * @param props - Modal configuration options
 * @returns Modal instance with methods for control
 *
 * @example
 * ```typescript
 * import { createModal, createButton } from 'dosage';
 *
 * const modal = createModal({
 *   title: 'Confirm Action',
 *   content: 'Are you sure you want to proceed?',
 *   onClose: () => console.log('Modal closed')
 * });
 *
 * // Open the modal
 * modal.open();
 *
 * // Or append to DOM and control via instance
 * document.body.appendChild(modal.element);
 * ```
 */
export function createModal(props: ModalProps = {}): ModalInstance {
  const {
    open = false,
    title,
    content,
    footer,
    size = 'medium',
    closable = true,
    closeOnEscape = true,
    closeOnOverlay = true,
    onClose,
    onOpen,
    className,
    id,
  } = props;

  // Generate unique ID
  const modalId = id || `dos-modal-${++modalIdCounter}`;
  const titleId = `${modalId}-title`;
  const contentId = `${modalId}-content`;

  // State
  let isOpen = false;
  let currentProps = { ...props };

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = `dos-modal__overlay dos-modal--${size}`;
  if (className) {
    overlay.classList.add(className);
  }
  overlay.id = modalId;
  overlay.setAttribute('role', 'presentation');

  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'dos-modal__dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  if (title) {
    dialog.setAttribute('aria-labelledby', titleId);
  }
  dialog.setAttribute('aria-describedby', contentId);
  dialog.setAttribute('tabindex', '-1');

  // Create header
  const header = document.createElement('div');
  header.className = 'dos-modal__header';

  const titleEl = document.createElement('h2');
  titleEl.className = 'dos-modal__title';
  titleEl.id = titleId;
  titleEl.textContent = title || '';

  header.appendChild(titleEl);

  // Create close button
  let closeButton: HTMLButtonElement | null = null;
  if (closable) {
    closeButton = document.createElement('button');
    closeButton.className = 'dos-modal__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => closeModal());
    header.appendChild(closeButton);
  }

  // Create body
  const body = document.createElement('div');
  body.className = 'dos-modal__body';
  body.id = contentId;

  if (content) {
    if (typeof content === 'string') {
      body.textContent = content;
    } else {
      body.appendChild(content);
    }
  }

  // Create footer
  const footerEl = document.createElement('div');
  footerEl.className = 'dos-modal__footer';

  if (footer) {
    footerEl.appendChild(footer);
  }

  // Create focus trap elements
  const focusTrapStart = document.createElement('div');
  focusTrapStart.className = 'dos-modal__focus-trap';
  focusTrapStart.tabIndex = 0;
  focusTrapStart.setAttribute('data-dos-focus-trap', 'start');

  const focusTrapEnd = document.createElement('div');
  focusTrapEnd.className = 'dos-modal__focus-trap';
  focusTrapEnd.tabIndex = 0;
  focusTrapEnd.setAttribute('data-dos-focus-trap', 'end');

  // Assemble dialog
  dialog.appendChild(focusTrapStart);
  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footerEl);
  dialog.appendChild(focusTrapEnd);
  overlay.appendChild(dialog);

  // Event handlers
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    }
  }

  function handleOverlayClick(event: MouseEvent): void {
    if (closeOnOverlay && event.target === overlay) {
      closeModal();
    }
  }

  // Flag to prevent recursive focus handling
  let isHandlingFocus = false;

  function handleFocusTrap(event: FocusEvent): void {
    // Prevent infinite recursion
    if (isHandlingFocus) return;
    isHandlingFocus = true;

    try {
      const focusableElements = getFocusableElements(dialog);
      if (focusableElements.length === 0) {
        // Focus the dialog itself when no focusable elements
        dialog.focus();
        return;
      }

      if (event.target === focusTrapStart) {
        // Wrap to last focusable element
        const lastElement = focusableElements[focusableElements.length - 1];
        if (lastElement) lastElement.focus();
      } else if (event.target === focusTrapEnd) {
        // Wrap to first focusable element
        const firstElement = focusableElements[0];
        if (firstElement) firstElement.focus();
      }
    } finally {
      // Reset flag after a microtask to allow new focus events
      queueMicrotask(() => {
        isHandlingFocus = false;
      });
    }
  }

  // Focus trap event listeners
  focusTrapStart.addEventListener('focus', handleFocusTrap);
  focusTrapEnd.addEventListener('focus', handleFocusTrap);

  /**
   * Opens the modal
   */
  function openModal(): void {
    if (isOpen) return;

    // Store the previously focused element
    previousActiveElement = document.activeElement;

    // Lock body scroll
    document.body.classList.add('dos-modal-open');

    // Show modal
    overlay.classList.add('dos-modal__overlay--open');
    isOpen = true;

    // Add event listeners
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeyDown);

    // Focus the dialog or first focusable element
    requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(dialog);
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      } else {
        dialog.focus();
      }
    });

    // Call onOpen callback
    onOpen?.();
  }

  /**
   * Closes the modal
   */
  function closeModal(): void {
    if (!isOpen) return;

    // Hide modal
    overlay.classList.remove('dos-modal__overlay--open');
    isOpen = false;

    // Remove event listeners
    overlay.removeEventListener('click', handleOverlayClick);
    document.removeEventListener('keydown', handleKeyDown);

    // Unlock body scroll (only if no other modals are open)
    const otherModals = document.querySelectorAll('.dos-modal__overlay--open');
    if (otherModals.length === 0) {
      document.body.classList.remove('dos-modal-open');
    }

    // Restore focus to previous element
    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }

    // Call onClose callback
    onClose?.();
  }

  /**
   * Sets the modal title
   */
  function setTitle(newTitle: string): void {
    titleEl.textContent = newTitle;
    if (newTitle) {
      dialog.setAttribute('aria-labelledby', titleId);
    } else {
      dialog.removeAttribute('aria-labelledby');
    }
  }

  /**
   * Sets the modal content
   */
  function setContent(newContent: string | HTMLElement): void {
    body.innerHTML = '';
    if (typeof newContent === 'string') {
      body.textContent = newContent;
    } else {
      body.appendChild(newContent);
    }
  }

  /**
   * Sets the modal footer
   */
  function setFooter(newFooter: HTMLElement): void {
    footerEl.innerHTML = '';
    footerEl.appendChild(newFooter);
  }

  /**
   * Updates modal size class
   */
  function updateSize(newSize: ModalSize): void {
    overlay.classList.remove(
      'dos-modal--small',
      'dos-modal--medium',
      'dos-modal--large',
      'dos-modal--fullscreen'
    );
    overlay.classList.add(`dos-modal--${newSize}`);
  }

  /**
   * Updates modal props
   */
  function update(newProps: Partial<ModalProps>): void {
    currentProps = { ...currentProps, ...newProps };

    if (newProps.title !== undefined) {
      setTitle(newProps.title || '');
    }

    if (newProps.content !== undefined) {
      if (newProps.content) {
        setContent(newProps.content);
      } else {
        body.innerHTML = '';
      }
    }

    if (newProps.footer !== undefined) {
      footerEl.innerHTML = '';
      if (newProps.footer) {
        footerEl.appendChild(newProps.footer);
      }
    }

    if (newProps.size !== undefined) {
      updateSize(newProps.size);
    }

    if (newProps.open !== undefined) {
      if (newProps.open && !isOpen) {
        openModal();
      } else if (!newProps.open && isOpen) {
        closeModal();
      }
    }
  }

  /**
   * Destroys the modal and cleans up
   */
  function destroy(): void {
    closeModal();
    focusTrapStart.removeEventListener('focus', handleFocusTrap);
    focusTrapEnd.removeEventListener('focus', handleFocusTrap);
    overlay.remove();
  }

  // Open immediately if open prop is true
  if (open) {
    // Defer to allow DOM attachment
    requestAnimationFrame(() => openModal());
  }

  return {
    element: overlay,
    open: openModal,
    close: closeModal,
    isOpen: () => isOpen,
    setTitle,
    setContent,
    setFooter,
    update,
    destroy,
  };
}

/**
 * Opens a simple alert modal with a message and OK button.
 *
 * @param message - The message to display
 * @param title - Optional title (defaults to 'Alert')
 * @returns Promise that resolves when the modal is closed
 *
 * @example
 * ```typescript
 * import { showAlert } from 'dosage';
 *
 * await showAlert('File saved successfully!', 'Success');
 * ```
 */
export function showAlert(message: string, title: string = 'Alert'): Promise<void> {
  return new Promise((resolve) => {
    // Create OK button
    const okButton = document.createElement('button');
    okButton.className = 'dos-button dos-button--primary';
    okButton.textContent = 'OK';

    const footer = document.createElement('div');
    footer.appendChild(okButton);

    const modal = createModal({
      title,
      content: message,
      footer,
      size: 'small',
      closable: true,
      closeOnEscape: true,
      closeOnOverlay: false,
      onClose: () => {
        modal.destroy();
        resolve();
      },
    });

    okButton.addEventListener('click', () => modal.close());

    document.body.appendChild(modal.element);
    modal.open();
  });
}

/**
 * Opens a confirmation modal with OK and Cancel buttons.
 *
 * @param message - The message to display
 * @param title - Optional title (defaults to 'Confirm')
 * @returns Promise that resolves to true if confirmed, false if cancelled
 *
 * @example
 * ```typescript
 * import { showConfirm } from 'dosage';
 *
 * const confirmed = await showConfirm('Delete this file?', 'Confirm Delete');
 * if (confirmed) {
 *   // User clicked OK
 * }
 * ```
 */
export function showConfirm(message: string, title: string = 'Confirm'): Promise<boolean> {
  return new Promise((resolve) => {
    let result = false;

    // Create buttons
    const okButton = document.createElement('button');
    okButton.className = 'dos-button dos-button--primary';
    okButton.textContent = 'OK';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'dos-button dos-button--secondary';
    cancelButton.textContent = 'Cancel';

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.gap = 'var(--dos-space-sm)';
    footer.appendChild(okButton);
    footer.appendChild(cancelButton);

    const modal = createModal({
      title,
      content: message,
      footer,
      size: 'small',
      closable: true,
      closeOnEscape: true,
      closeOnOverlay: false,
      onClose: () => {
        modal.destroy();
        resolve(result);
      },
    });

    okButton.addEventListener('click', () => {
      result = true;
      modal.close();
    });

    cancelButton.addEventListener('click', () => {
      result = false;
      modal.close();
    });

    document.body.appendChild(modal.element);
    modal.open();
  });
}

/**
 * Opens a prompt modal with an input field.
 *
 * @param message - The message/label to display
 * @param title - Optional title (defaults to 'Prompt')
 * @param defaultValue - Optional default value for the input
 * @returns Promise that resolves to the input value, or null if cancelled
 *
 * @example
 * ```typescript
 * import { showPrompt } from 'dosage';
 *
 * const name = await showPrompt('Enter your name:', 'Name');
 * if (name !== null) {
 *   console.log('Hello, ' + name);
 * }
 * ```
 */
export function showPrompt(
  message: string,
  title: string = 'Prompt',
  defaultValue: string = ''
): Promise<string | null> {
  return new Promise((resolve) => {
    let result: string | null = null;

    // Create content with input
    const contentEl = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = message;
    label.style.display = 'block';
    label.style.marginBottom = 'var(--dos-space-sm)';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'dos-text-input__field';
    input.value = defaultValue;
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';

    contentEl.appendChild(label);
    contentEl.appendChild(input);

    // Create buttons
    const okButton = document.createElement('button');
    okButton.className = 'dos-button dos-button--primary';
    okButton.textContent = 'OK';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'dos-button dos-button--secondary';
    cancelButton.textContent = 'Cancel';

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.gap = 'var(--dos-space-sm)';
    footer.appendChild(okButton);
    footer.appendChild(cancelButton);

    const modal = createModal({
      title,
      content: contentEl,
      footer,
      size: 'small',
      closable: true,
      closeOnEscape: true,
      closeOnOverlay: false,
      onClose: () => {
        modal.destroy();
        resolve(result);
      },
    });

    // Handle Enter key in input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        result = input.value;
        modal.close();
      }
    });

    okButton.addEventListener('click', () => {
      result = input.value;
      modal.close();
    });

    cancelButton.addEventListener('click', () => {
      result = null;
      modal.close();
    });

    document.body.appendChild(modal.element);
    modal.open();

    // Focus input after modal opens
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  });
}
