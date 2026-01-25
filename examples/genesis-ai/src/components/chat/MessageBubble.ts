/**
 * Genesis AI - Message Bubble Component
 * Individual chat message display
 */

import {
  createCard,
  createAvatar,
  createText,
  createBox,
  createCodeBlock,
  createContextMenu,
} from 'dosage';
import type { Message } from '../../types';
import { formatTime } from '../../utils/formatters';

export interface MessageBubbleProps {
  message: Message;
  showTimestamp?: boolean;
  onCopy?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export interface MessageBubbleInstance {
  element: HTMLElement;
  destroy: () => void;
}

/**
 * Parse message content and render code blocks
 */
function parseContent(content: string): HTMLElement {
  const container = createBox({});
  container.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';

  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  for (const part of parts) {
    if (part.startsWith('```')) {
      // Extract language and code
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
      if (match) {
        const language = match[1] || 'text';
        const code = match[2].trim();
        const codeBlock = createCodeBlock({
          code,
          language,
          lineNumbers: code.split('\n').length > 3,
          copyButton: true,
        });
        container.appendChild(codeBlock);
      }
    } else if (part.trim()) {
      // Regular text - handle line breaks and basic formatting
      const lines = part.trim().split('\n');
      for (const line of lines) {
        const text = createText({
          children: line || '\u00A0', // Non-breaking space for empty lines
          size: 'base',
        });
        container.appendChild(text);
      }
    }
  }

  return container;
}

export function createMessageBubble(
  props: MessageBubbleProps
): MessageBubbleInstance {
  const { message, showTimestamp = true, onCopy, onDelete, onRegenerate } = props;

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Create avatar
  const avatar = createAvatar({
    name: isUser ? 'User' : 'Genesis AI',
    initials: isUser ? 'U' : 'AI',
    size: 'small',
    status: isAssistant ? 'online' : undefined,
  });

  // Create header with name and timestamp
  const headerBox = createBox({ display: 'flex' });
  headerBox.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  `;

  headerBox.appendChild(avatar.element);

  const nameText = createText({
    children: isUser ? 'You' : 'Genesis AI',
    weight: 'bold',
    size: 'sm',
  });
  headerBox.appendChild(nameText);

  if (showTimestamp) {
    const timeText = createText({
      children: formatTime(message.timestamp),
      size: 'sm',
    });
    timeText.style.marginLeft = 'auto';
    timeText.style.opacity = '0.7';
    headerBox.appendChild(timeText);
  }

  // Create content
  const contentElement = parseContent(message.content);

  // Create card container
  const cardContent = createBox({});
  cardContent.appendChild(headerBox);
  cardContent.appendChild(contentElement);

  const card = createCard({
    content: cardContent,
    bordered: true,
    elevated: false,
  });

  // Style based on role
  card.element.style.cssText = `
    max-width: 85%;
    ${isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
  `;

  // Add context menu
  const contextMenuItems = [
    {
      label: 'Copy',
      shortcut: 'Ctrl+C',
      action: () => {
        navigator.clipboard.writeText(message.content);
        onCopy?.(message);
      },
    },
  ];

  if (onDelete) {
    contextMenuItems.push({
      label: 'Delete',
      action: () => onDelete(message.id),
    } as any);
  }

  if (isAssistant && onRegenerate) {
    contextMenuItems.push({
      label: 'Regenerate',
      action: () => onRegenerate(message.id),
    } as any);
  }

  const contextMenu = createContextMenu({
    target: card.element,
    items: contextMenuItems,
  });

  return {
    element: card.element,
    destroy: () => {
      card.destroy();
      avatar.destroy();
      contextMenu.destroy();
    },
  };
}
