/**
 * Tabs Component Types
 *
 * Type definitions for the DOS-style Tabs component with
 * tablist, tab, and tabpanel patterns.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Tab orientation options
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab variant styles
 */
export type TabsVariant = 'default' | 'boxed' | 'minimal';

/**
 * Individual tab configuration
 */
export interface TabProps {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label text displayed in the tab button
   */
  label: string;

  /**
   * Optional icon character to display before label
   */
  icon?: string;

  /**
   * Whether this tab is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Content to display when this tab is active
   * Can be a string, HTML element, or function that returns an element
   */
  content: string | HTMLElement | (() => HTMLElement);
}

/**
 * Individual tab panel configuration
 */
export interface TabPanelProps {
  /**
   * Unique identifier for the panel (should match tab id)
   */
  id: string;

  /**
   * Content of the tab panel
   */
  content: string | HTMLElement | (() => HTMLElement);

  /**
   * Whether the panel should be lazy loaded
   * If true, content is only rendered when tab is first activated
   * @default false
   */
  lazy?: boolean;
}

/**
 * Props for the Tabs component
 */
export interface TabsProps extends BaseComponentProps {
  /**
   * Array of tab configurations
   */
  tabs: TabProps[];

  /**
   * ID of the initially active tab
   * If not provided, first non-disabled tab is selected
   */
  defaultActiveTab?: string;

  /**
   * ID of the currently active tab (controlled mode)
   * When provided, component is in controlled mode
   */
  activeTab?: string;

  /**
   * Tab layout orientation
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * Visual variant style
   * @default 'default'
   */
  variant?: TabsVariant;

  /**
   * Whether to activate tabs on focus (automatic) or require click/Enter (manual)
   * @default 'automatic'
   */
  activation?: 'automatic' | 'manual';

  /**
   * Callback fired when the active tab changes
   */
  onChange?: (tabId: string) => void;
}

/**
 * Internal state for the Tabs component
 */
export interface TabsState {
  /**
   * Currently active tab ID
   */
  activeTab: string;

  /**
   * Currently focused tab ID (may differ from active in manual mode)
   */
  focusedTab: string;

  /**
   * Set of tab IDs whose content has been rendered (for lazy loading)
   */
  renderedTabs: Set<string>;
}

/**
 * Tabs component element with attached methods
 */
export interface TabsElement extends HTMLElement {
  /**
   * Get the currently active tab ID
   */
  getActiveTab: () => string;

  /**
   * Set the active tab programmatically
   */
  setActiveTab: (tabId: string) => void;

  /**
   * Enable a previously disabled tab
   */
  enableTab: (tabId: string) => void;

  /**
   * Disable a tab
   */
  disableTab: (tabId: string) => void;

  /**
   * Get the array of tab configurations
   */
  getTabs: () => TabProps[];

  /**
   * Update tabs dynamically
   */
  setTabs: (tabs: TabProps[]) => void;

  /**
   * Focus the tab list
   */
  focus: () => void;

  /**
   * Clean up event listeners and resources
   */
  destroy: () => void;
}

/**
 * Event detail for tab change events
 */
export interface TabChangeEventDetail {
  /**
   * ID of the newly active tab
   */
  tabId: string;

  /**
   * ID of the previously active tab
   */
  previousTabId: string;
}
