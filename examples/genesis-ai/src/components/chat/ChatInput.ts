/**
 * Genesis AI - Chat Input Component
 * Message input area with send/clear buttons
 */

import {
  createTextarea,
  createButton,
  createButtonGroup,
  addButtonsToGroup,
  createBox,
  createBadge,
  getTextareaValue,
  setTextareaValue,
} from 'dosage';
import { MESSAGE_CHAR_LIMIT, SHORTCUTS } from '../../config';

export interface ChatInputProps {
  onSend: (message: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatInputInstance {
  element: HTMLElement;
  focus: () => void;
  clear: () => void;
  setDisabled: (disabled: boolean) => void;
  getValue: () => string;
  destroy: () => void;
}

export function createChatInput(props: ChatInputProps): ChatInputInstance {
  const {
    onSend,
    onClear,
    disabled = false,
    placeholder = 'Type your message...',
  } = props;

  let isDisabled = disabled;

  // Create container
  const container = createBox({
    padding: 'md',
  });
  container.style.cssText = `
    border-top: 1px solid currentColor;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `;

  // Create textarea
  const textarea = createTextarea({
    placeholder,
    rows: 3,
    maxLength: MESSAGE_CHAR_LIMIT,
    showCount: true,
    disabled: isDisabled,
  });

  // Handle Ctrl+Enter to send
  const textareaEl = textarea.getTextarea();
  textareaEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter' && !isDisabled) {
      e.preventDefault();
      handleSend();
    }
  });

  // Create button row
  const buttonRow = createBox({ display: 'flex' });
  buttonRow.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  // Shortcut hint
  const hintBadge = createBadge({
    label: `${SHORTCUTS.send} to send`,
    variant: 'default',
    size: 'small',
  });

  // Button group
  const buttonGroup = createButtonGroup({
    orientation: 'horizontal',
    connected: false,
  });

  const clearButton = createButton({
    label: 'Clear',
    variant: 'secondary',
    disabled: isDisabled,
    onClick: () => {
      setTextareaValue(textarea, '');
      onClear?.();
    },
  });

  const sendButton = createButton({
    label: 'Send ►',
    variant: 'primary',
    disabled: isDisabled,
    onClick: handleSend,
  });

  addButtonsToGroup(buttonGroup, [clearButton, sendButton]);

  buttonRow.appendChild(hintBadge.element);
  buttonRow.appendChild(buttonGroup);

  container.appendChild(textarea);
  container.appendChild(buttonRow);

  function handleSend() {
    const value = getTextareaValue(textarea).trim();
    if (value && !isDisabled) {
      onSend(value);
      setTextareaValue(textarea, '');
      // Keep focus on textarea after sending - get the actual element
      const textareaEl = textarea.getTextarea();
      if (textareaEl) textareaEl.focus();
    }
  }

  function setDisabled(disabled: boolean) {
    isDisabled = disabled;
    textarea.setDisabled(disabled);
    // Note: Button disabled state would need individual updates
  }

  return {
    element: container,

    focus() {
      textarea.focus();
    },

    clear() {
      setTextareaValue(textarea, '');
    },

    setDisabled,

    getValue() {
      return getTextareaValue(textarea);
    },

    destroy() {
      textarea.destroy?.();
      hintBadge.destroy();
    },
  };
}
