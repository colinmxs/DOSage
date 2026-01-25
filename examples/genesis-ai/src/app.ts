/**
 * Genesis AI - Main Application Orchestrator
 */

import {
  initTheme,
  ThemeManager,
  createSplitPane,
  createBox,
  createCommandPalette,
  toast,
  type CommandPaletteElement,
} from 'dosage';
import type { Conversation, Message, Settings, ThemePreset } from './types';
import { StorageService, ChatService } from './services';
import {
  createHeader,
  createStatusBar,
  createChatWindow,
  createConversationList,
  createSettingsModal,
  createAboutModal,
  createHelpModal,
  type HeaderInstance,
  type StatusBarInstance,
  type ChatWindowInstance,
  type ConversationListInstance,
} from './components';
import { getCurrentTimestamp } from './utils/formatters';
import { SHORTCUTS } from './config';

export interface AppState {
  conversations: Conversation[];
  activeConversationId: string | null;
  settings: Settings;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  totalTokens: number;
}

export class App {
  private container: HTMLElement;
  private state: AppState;

  // Component instances
  private header: HeaderInstance | null = null;
  private statusBar: StatusBarInstance | null = null;
  private chatWindow: ChatWindowInstance | null = null;
  private conversationList: ConversationListInstance | null = null;
  private commandPalette: CommandPaletteElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    // Initialize state from storage
    this.state = {
      conversations: StorageService.getConversations(),
      activeConversationId: StorageService.getActiveConversationId(),
      settings: StorageService.getSettings(),
      sidebarCollapsed: false,
      isLoading: false,
      totalTokens: 0,
    };

    // Initialize theme
    initTheme();
    ThemeManager.setTheme(this.state.settings.theme);

    this.render();
    this.setupKeyboardShortcuts();
  }

  private render(): void {
    // Clear container
    this.container.innerHTML = '';

    // Create main layout wrapper
    const wrapper = createBox({});
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    `;

    // Create header
    this.header = createHeader({
      onNewChat: () => this.handleNewChat(),
      onOpenSettings: () => this.openSettingsModal(),
      onToggleSidebar: () => this.toggleSidebar(),
      onShowHelp: () => this.openHelpModal(),
      onShowAbout: () => this.openAboutModal(),
      onExport: () => this.exportConversation(),
      onClearChat: () => this.clearCurrentChat(),
      onThemeChange: (theme) => this.changeTheme(theme as ThemePreset),
      onOpenCommandPalette: () => this.openCommandPalette(),
    });

    // Create status bar
    this.statusBar = createStatusBar({
      status: 'Ready',
      tokenCount: this.state.totalTokens,
      model: 'Genesis-1',
      contextUsage: 0,
    });

    // Create conversation list (sidebar)
    this.conversationList = createConversationList({
      conversations: this.state.conversations,
      activeConversationId: this.state.activeConversationId,
      onSelect: (id) => this.switchConversation(id),
      onNewChat: () => this.handleNewChat(),
      onOpenSettings: () => this.openSettingsModal(),
      onOpenHelp: () => this.openHelpModal(),
    });

    // Get active conversation
    const activeConversation = this.state.activeConversationId
      ? this.state.conversations.find(
          (c) => c.id === this.state.activeConversationId
        )
      : null;

    // Create chat window
    this.chatWindow = createChatWindow({
      conversation: activeConversation ?? null,
      showTimestamps: this.state.settings.showTimestamps,
      autoScroll: this.state.settings.autoScroll,
      onSendMessage: (content) => this.handleSendMessage(content),
      onDeleteMessage: (messageId) => this.handleDeleteMessage(messageId),
      onCopyMessage: () => toast.success('Copied to clipboard!'),
      onStartNewChat: () => this.handleNewChat(),
    });

    // Create split pane for sidebar and chat
    const splitPane = createSplitPane({
      orientation: 'horizontal',
      firstPane: {
        initialSize: '220px',
        minSize: 180,
        maxSize: 350,
        content: this.conversationList.element,
        collapsible: true,
        collapsed: this.state.sidebarCollapsed,
      },
      secondPane: {
        content: this.chatWindow.element,
      },
      dividerSize: 4,
    });

    splitPane.style.flex = '1';
    splitPane.style.minHeight = '0';

    // Create command palette
    this.commandPalette = createCommandPalette({
      commands: this.getCommands(),
      placeholder: 'Type a command...',
      prompt: 'C:\\>',
      fuzzySearch: true,
      showRecent: true,
      onExecute: (cmd) => {
        toast.info(`Executed: ${cmd.label}`);
      },
    });

    // Assemble layout
    wrapper.appendChild(this.header.element);
    wrapper.appendChild(splitPane);
    wrapper.appendChild(this.statusBar.element);

    this.container.appendChild(wrapper);
    this.container.appendChild(this.commandPalette);

    // Focus chat input
    this.chatWindow.focusInput();
  }

  private getCommands() {
    return [
      {
        id: 'new-chat',
        label: 'New Chat',
        shortcut: SHORTCUTS.newChat,
        category: 'Chat',
        action: (): undefined => { this.handleNewChat(); return undefined; },
      },
      {
        id: 'clear-chat',
        label: 'Clear Current Chat',
        shortcut: SHORTCUTS.clearChat,
        category: 'Chat',
        action: (): undefined => { this.clearCurrentChat(); return undefined; },
      },
      {
        id: 'export',
        label: 'Export Conversation',
        shortcut: SHORTCUTS.export,
        category: 'Chat',
        action: (): undefined => { this.exportConversation(); return undefined; },
      },
      {
        id: 'settings',
        label: 'Open Settings',
        shortcut: SHORTCUTS.settings,
        category: 'App',
        action: (): undefined => { this.openSettingsModal(); return undefined; },
      },
      {
        id: 'toggle-sidebar',
        label: 'Toggle Sidebar',
        shortcut: SHORTCUTS.toggleSidebar,
        category: 'View',
        action: (): undefined => { this.toggleSidebar(); return undefined; },
      },
      {
        id: 'help',
        label: 'Show Help',
        shortcut: SHORTCUTS.help,
        category: 'Help',
        action: (): undefined => { this.openHelpModal(); return undefined; },
      },
      {
        id: 'about',
        label: 'About Genesis AI',
        category: 'Help',
        action: (): undefined => { this.openAboutModal(); return undefined; },
      },
      {
        id: 'theme-dos-blue',
        label: 'Theme: DOS Blue',
        category: 'Appearance',
        action: (): undefined => { this.changeTheme('dos-blue'); return undefined; },
      },
      {
        id: 'theme-amber',
        label: 'Theme: Amber',
        category: 'Appearance',
        action: (): undefined => { this.changeTheme('amber'); return undefined; },
      },
      {
        id: 'theme-green',
        label: 'Theme: Green Phosphor',
        category: 'Appearance',
        action: (): undefined => { this.changeTheme('green-phosphor'); return undefined; },
      },
      {
        id: 'theme-cga',
        label: 'Theme: CGA',
        category: 'Appearance',
        action: (): undefined => { this.changeTheme('cga'); return undefined; },
      },
    ];
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Command palette: Ctrl+K or Ctrl+P
      if ((e.ctrlKey && e.key === 'k') || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        this.openCommandPalette();
      }

      // New chat: Ctrl+N
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.handleNewChat();
      }

      // Settings: Ctrl+,
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        this.openSettingsModal();
      }

      // Toggle sidebar: F9
      if (e.key === 'F9') {
        e.preventDefault();
        this.toggleSidebar();
      }

      // Help: F1
      if (e.key === 'F1') {
        e.preventDefault();
        this.openHelpModal();
      }

      // Export: Ctrl+E
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        this.exportConversation();
      }

      // Clear chat: Ctrl+L
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.clearCurrentChat();
      }
    });
  }

  // --- Actions ---

  private handleNewChat(): void {
    const conversation = StorageService.createConversation();
    this.state.conversations = StorageService.getConversations();
    this.state.activeConversationId = conversation.id;

    this.conversationList?.setConversations(this.state.conversations);
    this.conversationList?.setActiveConversation(conversation.id);
    this.chatWindow?.setConversation(conversation);
    this.chatWindow?.focusInput();

    toast.success('New chat created!');
  }

  private async handleSendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    // Ensure we have an active conversation
    if (!this.state.activeConversationId) {
      this.handleNewChat();
    }

    const conversationId = this.state.activeConversationId!;

    // Add user message
    const userMessage: Omit<Message, 'id'> = {
      role: 'user',
      content,
      timestamp: getCurrentTimestamp(),
    };

    const savedUserMessage = StorageService.addMessage(conversationId, userMessage);
    this.chatWindow?.addMessage(savedUserMessage);

    // Update status
    this.statusBar?.updateStatus('Sending...');
    this.chatWindow?.setInputDisabled(true);
    this.chatWindow?.showTypingIndicator();

    try {
      // Get AI response
      const response = await ChatService.sendMessage(content);

      // Add AI message
      const aiMessage: Omit<Message, 'id'> = {
        role: 'assistant',
        content: response.content,
        timestamp: getCurrentTimestamp(),
        metadata: {
          model: response.model,
          tokens: response.tokens,
        },
      };

      const savedAiMessage = StorageService.addMessage(conversationId, aiMessage);
      this.chatWindow?.hideTypingIndicator();
      this.chatWindow?.addMessage(savedAiMessage);

      // Update token count
      this.state.totalTokens += response.tokens || 0;
      this.statusBar?.updateTokens(this.state.totalTokens);
      this.statusBar?.updateContextUsage(
        Math.min(100, Math.round(this.state.totalTokens / 40))
      );

      // Update conversation list (title may have changed)
      this.state.conversations = StorageService.getConversations();
      this.conversationList?.setConversations(this.state.conversations);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response. Please try again.');
      this.chatWindow?.hideTypingIndicator();
    } finally {
      this.statusBar?.updateStatus('Ready');
      this.chatWindow?.setInputDisabled(false);
      this.chatWindow?.focusInput();
    }
  }

  private handleDeleteMessage(messageId: string): void {
    if (!this.state.activeConversationId) return;

    StorageService.deleteMessage(this.state.activeConversationId, messageId);

    // Refresh conversation
    const conversation = StorageService.getConversation(
      this.state.activeConversationId
    );
    if (conversation) {
      this.chatWindow?.setConversation(conversation);
    }

    toast.info('Message deleted');
  }

  private switchConversation(id: string): void {
    this.state.activeConversationId = id;
    StorageService.setActiveConversation(id);

    const conversation = StorageService.getConversation(id);
    if (conversation) {
      this.chatWindow?.setConversation(conversation);
      this.conversationList?.setActiveConversation(id);
    }
  }

  private clearCurrentChat(): void {
    if (!this.state.activeConversationId) {
      toast.warning('No active chat to clear');
      return;
    }

    // Delete the current conversation and create a new one
    StorageService.deleteConversation(this.state.activeConversationId);
    this.handleNewChat();

    toast.info('Chat cleared');
  }

  private toggleSidebar(): void {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    // Re-render to apply sidebar state
    // For now, just show a toast - full implementation would toggle SplitPane collapse
    toast.info(
      this.state.sidebarCollapsed ? 'Sidebar hidden' : 'Sidebar shown'
    );
  }

  private changeTheme(theme: ThemePreset): void {
    this.state.settings.theme = theme;
    StorageService.updateSettings({ theme });
    ThemeManager.setTheme(theme);
    toast.success(`Theme changed to ${theme}`);
  }

  private exportConversation(): void {
    if (!this.state.activeConversationId) {
      toast.warning('No conversation to export');
      return;
    }

    const conversation = StorageService.getConversation(
      this.state.activeConversationId
    );
    if (!conversation) return;

    // Format conversation as text
    let text = `# ${conversation.title}\n`;
    text += `Exported: ${new Date().toLocaleString()}\n\n`;
    text += '---\n\n';

    for (const msg of conversation.messages) {
      const role = msg.role === 'user' ? 'You' : 'Genesis AI';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      text += `[${role}] (${time})\n${msg.content}\n\n`;
    }

    // Download as file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Conversation exported!');
  }

  private openCommandPalette(): void {
    this.commandPalette?.open();
  }

  private openSettingsModal(): void {
    const modal = createSettingsModal({
      settings: this.state.settings,
      onSave: (newSettings) => {
        this.state.settings = newSettings;
        StorageService.updateSettings(newSettings);
        ThemeManager.setTheme(newSettings.theme);
        toast.success('Settings saved!');

        // Update chat window with new settings
        this.chatWindow?.destroy();
        const conversation = this.state.activeConversationId
          ? StorageService.getConversation(this.state.activeConversationId)
          : null;
        this.chatWindow = createChatWindow({
          conversation: conversation ?? null,
          showTimestamps: newSettings.showTimestamps,
          autoScroll: newSettings.autoScroll,
          onSendMessage: (content) => this.handleSendMessage(content),
          onDeleteMessage: (messageId) => this.handleDeleteMessage(messageId),
          onCopyMessage: () => toast.success('Copied to clipboard!'),
          onStartNewChat: () => this.handleNewChat(),
        });
      },
      onClose: () => {
        modal.destroy();
      },
    });

    modal.open();
  }

  private openHelpModal(): void {
    const modal = createHelpModal({
      onClose: () => {
        modal.destroy();
      },
    });

    modal.open();
  }

  private openAboutModal(): void {
    const modal = createAboutModal({
      onClose: () => {
        modal.destroy();
      },
    });

    modal.open();
  }

  public destroy(): void {
    this.header?.destroy();
    this.statusBar?.destroy();
    this.chatWindow?.destroy();
    this.conversationList?.destroy();
    this.commandPalette?.destroy();
  }
}
