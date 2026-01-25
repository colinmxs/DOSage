/**
 * Genesis AI - Storage Service
 * Handles localStorage persistence
 */

import { STORAGE_KEY, DEFAULT_SETTINGS, APP_VERSION } from '../config';
import type {
  GenesisAIStorage,
  Settings,
  Conversation,
  Message,
} from '../types';
import { generateId, getCurrentTimestamp } from '../utils/formatters';

/** Default storage state */
const DEFAULT_STORAGE: GenesisAIStorage = {
  version: APP_VERSION,
  settings: DEFAULT_SETTINGS,
  conversations: [],
  activeConversationId: null,
};

class StorageServiceClass {
  private data: GenesisAIStorage;

  constructor() {
    this.data = this.load();
  }

  /** Load data from localStorage */
  private load(): GenesisAIStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GenesisAIStorage;
        // Merge with defaults to handle new properties
        return {
          ...DEFAULT_STORAGE,
          ...parsed,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        };
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
    return { ...DEFAULT_STORAGE };
  }

  /** Save data to localStorage */
  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save storage:', e);
    }
  }

  /** Get current settings */
  getSettings(): Settings {
    return { ...this.data.settings };
  }

  /** Update settings */
  updateSettings(updates: Partial<Settings>): Settings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.getSettings();
  }

  /** Get all conversations */
  getConversations(): Conversation[] {
    return [...this.data.conversations];
  }

  /** Get a specific conversation by ID */
  getConversation(id: string): Conversation | undefined {
    return this.data.conversations.find((c) => c.id === id);
  }

  /** Get active conversation ID */
  getActiveConversationId(): string | null {
    return this.data.activeConversationId;
  }

  /** Set active conversation */
  setActiveConversation(id: string | null): void {
    this.data.activeConversationId = id;
    this.save();
  }

  /** Create a new conversation */
  createConversation(title?: string): Conversation {
    const now = getCurrentTimestamp();
    const conversation: Conversation = {
      id: generateId(),
      title: title || 'New Chat',
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    this.data.conversations.unshift(conversation);
    this.data.activeConversationId = conversation.id;
    this.save();
    return conversation;
  }

  /** Add message to conversation */
  addMessage(conversationId: string, message: Omit<Message, 'id'>): Message {
    const conversation = this.data.conversations.find(
      (c) => c.id === conversationId
    );
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const fullMessage: Message = {
      ...message,
      id: generateId(),
    };

    conversation.messages.push(fullMessage);
    conversation.updatedAt = getCurrentTimestamp();

    // Update title from first user message
    if (conversation.messages.length === 1 && message.role === 'user') {
      conversation.title =
        message.content.substring(0, 30) +
        (message.content.length > 30 ? '...' : '');
    }

    this.save();
    return fullMessage;
  }

  /** Delete a conversation */
  deleteConversation(id: string): void {
    const index = this.data.conversations.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.data.conversations.splice(index, 1);

      // If active conversation was deleted, switch to first available
      if (this.data.activeConversationId === id) {
        this.data.activeConversationId =
          this.data.conversations[0]?.id || null;
      }

      this.save();
    }
  }

  /** Delete a message from a conversation */
  deleteMessage(conversationId: string, messageId: string): void {
    const conversation = this.data.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      const index = conversation.messages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        conversation.messages.splice(index, 1);
        conversation.updatedAt = getCurrentTimestamp();
        this.save();
      }
    }
  }

  /** Clear all data */
  clearAll(): void {
    this.data = { ...DEFAULT_STORAGE };
    this.save();
  }

  /** Export conversations as JSON */
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

/** Singleton storage service instance */
export const StorageService = new StorageServiceClass();
