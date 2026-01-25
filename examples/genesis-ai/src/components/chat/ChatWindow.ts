/**
 * Genesis AI - Chat Window Component
 * Main chat interface combining message list, typing indicator, and input
 */

import { createBox } from 'dosage';
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

  // Create the main container using Box
  const container = createBox({});
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `;

  // Create chat input FIRST so we can reference it in messageList
  const chatInput = createChatInput({
    onSend: onSendMessage,
    placeholder: 'Type your message... (Ctrl+Enter to send)',
  });

  // Create message list
  const messageList = createMessageList({
    messages: currentConversation?.messages || [],
    showTimestamps,
    autoScroll,
    onCopyMessage,
    onDeleteMessage,
    onStartChat: () => {
      // Focus the actual textarea element directly
      const textareaEl = chatInput.element.querySelector('textarea');
      if (textareaEl) textareaEl.focus();
    },
  });

  messageList.element.style.flex = '1';
  messageList.element.style.minHeight = '0';

  // Create typing indicator
  const typingIndicator = createTypingIndicator();

  // Assemble components
  container.appendChild(messageList.element);
  container.appendChild(typingIndicator.element);
  container.appendChild(chatInput.element);

  return {
    element: container,

    addMessage(message: Message) {
      messageList.addMessage(message);
    },

    setConversation(conversation: Conversation | null) {
      currentConversation = conversation;
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
      // Focus the actual textarea element directly
      const textareaEl = chatInput.element.querySelector('textarea');
      if (textareaEl) textareaEl.focus();
    },

    destroy() {
      messageList.destroy();
      typingIndicator.destroy();
      chatInput.destroy();
    },
  };
}
