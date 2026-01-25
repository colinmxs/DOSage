/**
 * Genesis AI - Conversation List Component
 * Sidebar showing chat history grouped by date
 */

import {
  createBox,
  createText,
  createListBox,
  createButton,
  createEmptyState,
  type ListBoxInstance,
} from 'dosage';
import type { Conversation } from '../../types';
import { formatDate, truncate } from '../../utils/formatters';

export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (conversationId: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export interface ConversationListInstance {
  element: HTMLElement;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  destroy: () => void;
}

interface GroupedConversations {
  [key: string]: Conversation[];
}

function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const groups: GroupedConversations = {};

  for (const conv of conversations) {
    const dateGroup = formatDate(conv.updatedAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(conv);
  }

  return groups;
}

export function createConversationList(
  props: ConversationListProps
): ConversationListInstance {
  const {
    conversations: initialConversations,
    activeConversationId: initialActiveId,
    onSelect,
    onNewChat,
    onOpenSettings,
    onOpenHelp,
  } = props;

  let conversations = initialConversations;
  let activeId = initialActiveId;
  let listBox: ListBoxInstance | null = null;

  // Create main container
  const container = createBox({});
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `;

  // Header
  const header = createBox({ padding: 'sm' });
  header.style.cssText = `
    border-bottom: 1px solid currentColor;
    padding: 0.5rem;
  `;
  const headerText = createText({
    children: 'CONVERSATIONS',
    weight: 'bold',
    size: 'sm',
    align: 'center',
  });
  header.appendChild(headerText);

  // List container (scrollable)
  const listContainer = createBox({});
  listContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  `;

  // Action buttons at bottom
  const actionsContainer = createBox({ padding: 'sm' });
  actionsContainer.style.cssText = `
    border-top: 1px solid currentColor;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
  `;

  const newChatBtn = createButton({
    label: '+ New Chat',
    variant: 'primary',
    fullWidth: true,
    onClick: onNewChat,
  });

  const settingsBtn = createButton({
    label: '⚙ Settings',
    variant: 'secondary',
    fullWidth: true,
    onClick: onOpenSettings,
  });

  const helpBtn = createButton({
    label: '? Help',
    variant: 'secondary',
    fullWidth: true,
    onClick: onOpenHelp,
  });

  actionsContainer.appendChild(newChatBtn);
  actionsContainer.appendChild(settingsBtn);
  actionsContainer.appendChild(helpBtn);

  function renderList() {
    // Clear existing list
    listContainer.innerHTML = '';

    if (conversations.length === 0) {
      const emptyState = createEmptyState({
        title: 'No chats yet',
        description: 'Start a new conversation!',
        size: 'small',
      });
      emptyState.element.style.padding = '1rem';
      listContainer.appendChild(emptyState.element);
      return;
    }

    // Group conversations
    const groups = groupConversationsByDate(conversations);
    const groupOrder = ['Today', 'Yesterday', 'Last 7 Days', 'Older'];

    for (const groupName of groupOrder) {
      const groupConvs = groups[groupName];
      if (!groupConvs || groupConvs.length === 0) continue;

      // Group header
      const groupHeader = createBox({ padding: 'sm' });
      groupHeader.style.cssText = `
        padding: 0.5rem;
        opacity: 0.7;
      `;
      const groupText = createText({
        children: `▼ ${groupName}`,
        size: 'sm',
        weight: 'bold',
      });
      groupHeader.appendChild(groupText);
      listContainer.appendChild(groupHeader);

      // Items in group
      const items = groupConvs.map((conv) => ({
        id: conv.id,
        primary: truncate(conv.title, 25),
        secondary: `${conv.messages.length} messages`,
        icon: conv.id === activeId ? '●' : '○',
      }));

      listBox = createListBox({
        items,
        selectable: true,
        selectedItems: activeId ? [activeId] : [],
        dividers: false,
        onSelect: (selectedItems) => {
          if (selectedItems.length > 0) {
            const selectedId = String(selectedItems[0].id);
            onSelect(selectedId);
          }
        },
      });

      listContainer.appendChild(listBox.element);
    }
  }

  // Assemble
  container.appendChild(header);
  container.appendChild(listContainer);
  container.appendChild(actionsContainer);

  // Initial render
  renderList();

  return {
    element: container,

    setConversations(newConversations: Conversation[]) {
      conversations = newConversations;
      renderList();
    },

    setActiveConversation(id: string | null) {
      activeId = id;
      renderList();
    },

    destroy() {
      listBox?.destroy();
    },
  };
}
