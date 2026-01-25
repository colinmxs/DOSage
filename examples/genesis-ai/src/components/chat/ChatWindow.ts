/**
 * Genesis AI - Chat Window Component
 * Main chat interface combining message list, typing indicator, and input
 */

import { createPanel, getPanelContent } from 'dosage';
import type { Message, Conversation } from '../../types';
import { createMessageList } from './MessageList';
import { createTypingIndicator } from './TypingIndicator';
import { createChatInput } from './ChatInput';

export interface ChatWindowProps {
  conversation: Conversation | null;
  showTimestamps?: boolean;
  autoScroll?: boolean;
  onSendMessage: (content: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onCopyMessage?: (message: Message) => void;
  onStartNewChat?: () => void;
}

export interface ChatWindowInstance {
  element: HTMLElement;
  addMessage: (message: Message) => void;
  setConversation: (conversation: Conversation | null) => void;
  showTypingIndicator: () => void;
  hideTypingIndicator: () => void;
  setInputDisabled: (disabled: boolean) => void;
  focusInput: () => void;
  destroy: () => void;
}

export function createChatWindow(props: ChatWindowProps): ChatWindowInstance {
  const {
    conversation: initialConversation,
    showTimestamps = true,
    autoScroll = true,
    onSendMessage,
    onDeleteMessage,
    onCopyMessage,
    onStartNewChat,
  } = props;

  let currentConversation = initialConversation;

  // Create the main panel
  const panel = createPanel({
    title: currentConversation?.title || 'New Chat',
    borderStyle: 'double',
    padding: 'none',
  });

  const content = getPanelContent(panel);
  if (!content) {
    throw new Error('Failed to get panel content');
  }
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `;

  // Create message list
  const messageList = createMessageList({
    messages: currentConversation?.messages || [],
    showTimestamps,
    autoScroll,
    onCopyMessage,
    onDeleteMessage,
    onStartChat: onStartNewChat,
  });

  messageList.element.style.flex = '1';
  messageList.element.style.minHeight = '0';

  // Create typing indicator
  const typingIndicator = createTypingIndicator();

  // Create chat input
  const chatInput = createChatInput({
    onSend: onSendMessage,
    placeholder: 'Type your message... (Ctrl+Enter to send)',
  });

  // Assemble components
  content.appendChild(messageList.element);
  content.appendChild(typingIndicator.element);
  content.appendChild(chatInput.element);

  // Panel title helper
  function updateTitle(title: string) {
    // Find the title element and update it
    const titleEl = panel.querySelector('.dos-panel__title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  return {
    element: panel,

    addMessage(message: Message) {
      messageList.addMessage(message);
    },

    setConversation(conversation: Conversation | null) {
      currentConversation = conversation;
      updateTitle(conversation?.title || 'New Chat');
      messageList.setMessages(conversation?.messages || []);
    },

    showTypingIndicator() {
      typingIndicator.show();
    },

    hideTypingIndicator() {
      typingIndicator.hide();
    },

    setInputDisabled(disabled: boolean) {
      chatInput.setDisabled(disabled);
    },

    focusInput() {
      chatInput.focus();
    },

    destroy() {
      messageList.destroy();
      typingIndicator.destroy();
      chatInput.destroy();
    },
  };
}
