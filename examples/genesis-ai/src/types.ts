/**
 * Genesis AI - Type Definitions
 * TypeScript interfaces for the application
 */

/** Theme preset options */
export type ThemePreset = 'dos-blue' | 'amber' | 'green-phosphor' | 'cga';

/** Message roles */
export type MessageRole = 'user' | 'assistant';

/** Individual chat message */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
  };
}

/** Conversation/chat session */
export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

/** Application settings */
export interface Settings {
  displayName: string;
  theme: ThemePreset;
  soundEnabled: boolean;
  showTimestamps: boolean;
  autoScroll: boolean;
  fontSize: number;
}

/** Complete storage schema */
export interface GenesisAIStorage {
  version: string;
  settings: Settings;
  conversations: Conversation[];
  activeConversationId: string | null;
}

/** Chat service response */
export interface ChatResponse {
  content: string;
  tokens?: number;
  model?: string;
}

/** Command palette action */
export interface CommandAction {
  id: string;
  label: string;
  shortcut?: string;
  section?: string;
  action: () => void;
}
