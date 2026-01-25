/**
 * Genesis AI - Message List Component
 * Scrollable message display area
 */

import { createScrollArea, createBox, createEmptyState, createButton } from 'dosage';
import type { Message } from '../../types';
import { createMessageBubble, type MessageBubbleInstance } from './MessageBubble';

export interface MessageListProps {
  messages: Message[];
  showTimestamps?: boolean;
  autoScroll?: boolean;
  onCopyMessage?: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onStartChat?: () => void;
}

export interface MessageListInstance {
  element: HTMLElement;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
  scrollToBottom: () => void;
  destroy: () => void;
}

export function createMessageList(props: MessageListProps): MessageListInstance {
  const {
    messages: initialMessages,
    showTimestamps = true,
    autoScroll = true,
    onCopyMessage,
    onDeleteMessage,
    onRegenerateMessage,
    onStartChat,
  } = props;

  // Track rendered message bubbles
  const messageBubbles = new Map<string, MessageBubbleInstance>();

  // Create content container
  const contentBox = createBox({
    padding: 'md',
  });
  contentBox.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100%;
  `;

  // Create scroll area
  const scrollArea = createScrollArea({
    orientation: 'vertical',
    content: contentBox,
    autoHide: true,
    smoothScroll: true,
  });

  scrollArea.element.style.cssText = `
    flex: 1;
    height: 100%;
  `;

  // Empty state
  let emptyStateElement: HTMLElement | null = null;

  function showEmptyState() {
    if (emptyStateElement) return;

    const actionButton = createButton({
      label: '[ Start a New Chat ]',
      variant: 'primary',
      onClick: onStartChat,
    });

    const emptyState = createEmptyState({
      title: 'No messages yet',
      description: 'Start a conversation with Genesis AI!',
      icon: 'chat',
      size: 'medium',
      action: actionButton,
    });

    emptyStateElement = emptyState.element;
    emptyStateElement.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    `;

    contentBox.appendChild(emptyStateElement);
  }

  function hideEmptyState() {
    if (emptyStateElement) {
      emptyStateElement.remove();
      emptyStateElement = null;
    }
  }

  function renderMessage(message: Message): MessageBubbleInstance {
    const bubble = createMessageBubble({
      message,
      showTimestamp: showTimestamps,
      onCopy: onCopyMessage,
      onDelete: onDeleteMessage,
      onRegenerate: message.role === 'assistant' ? onRegenerateMessage : undefined,
    });
    return bubble;
  }

  function addMessage(message: Message) {
    hideEmptyState();

    const bubble = renderMessage(message);
    messageBubbles.set(message.id, bubble);
    contentBox.appendChild(bubble.element);

    if (autoScroll) {
      // Small delay to ensure DOM update
      requestAnimationFrame(() => {
        scrollArea.scrollToBottom();
      });
    }
  }

  function removeMessage(messageId: string) {
    const bubble = messageBubbles.get(messageId);
    if (bubble) {
      bubble.destroy();
      bubble.element.remove();
      messageBubbles.delete(messageId);
    }

    if (messageBubbles.size === 0) {
      showEmptyState();
    }
  }

  function clearMessages() {
    for (const bubble of messageBubbles.values()) {
      bubble.destroy();
      bubble.element.remove();
    }
    messageBubbles.clear();
    showEmptyState();
  }

  function setMessages(messages: Message[]) {
    // Clear existing
    for (const bubble of messageBubbles.values()) {
      bubble.destroy();
      bubble.element.remove();
    }
    messageBubbles.clear();
    hideEmptyState();

    if (messages.length === 0) {
      showEmptyState();
      return;
    }

    // Render all messages
    for (const message of messages) {
      const bubble = renderMessage(message);
      messageBubbles.set(message.id, bubble);
      contentBox.appendChild(bubble.element);
    }

    if (autoScroll) {
      requestAnimationFrame(() => {
        scrollArea.scrollToBottom();
      });
    }
  }

  // Initial render
  if (initialMessages.length === 0) {
    showEmptyState();
  } else {
    setMessages(initialMessages);
  }

  return {
    element: scrollArea.element,

    addMessage,
    removeMessage,
    clearMessages,
    setMessages,

    scrollToBottom: () => scrollArea.scrollToBottom(),

    destroy: () => {
      for (const bubble of messageBubbles.values()) {
        bubble.destroy();
      }
      messageBubbles.clear();
      scrollArea.destroy();
    },
  };
}
