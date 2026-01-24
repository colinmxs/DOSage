/**
 * Accordion Component Types
 *
 * Type definitions for the DOS-style Accordion component with
 * expandable/collapsible sections.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Accordion expansion mode
 * - 'single': Only one section can be open at a time
 * - 'multiple': Multiple sections can be open simultaneously
 */
export type AccordionMode = 'single' | 'multiple';

/**
 * Accordion visual variant
 */
export type AccordionVariant = 'default' | 'boxed' | 'minimal';

/**
 * Individual accordion item/section configuration
 */
export interface AccordionItemProps {
  /**
   * Unique identifier for the accordion item
   */
  id: string;

  /**
   * Header text displayed in the trigger button
   */
  title: string;

  /**
   * Optional icon character to display in the header
   */
  icon?: string;

  /**
   * Content to display when the section is expanded
   * Can be a string, HTML element, or function that returns an element
   */
  content: string | HTMLElement | (() => HTMLElement);

  /**
   * Whether this section is disabled (cannot be expanded/collapsed)
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether this section should be expanded by default
   * @default false
   */
  defaultExpanded?: boolean;
}

/**
 * Props for the Accordion component
 */
export interface AccordionProps extends BaseComponentProps {
  /**
   * Array of accordion item configurations
   */
  items: AccordionItemProps[];

  /**
   * Expansion mode
   * @default 'single'
   */
  mode?: AccordionMode;

  /**
   * Visual variant style
   * @default 'default'
   */
  variant?: AccordionVariant;

  /**
   * IDs of initially expanded items (controlled mode override)
   * When provided, the component operates in controlled mode
   */
  expandedItems?: string[];

  /**
   * Icon character for collapsed state
   * @default '[+]'
   */
  collapsedIcon?: string;

  /**
   * Icon character for expanded state
   * @default '[-]'
   */
  expandedIcon?: string;

  /**
   * Whether to allow all sections to be collapsed
   * When false, at least one section must remain open
   * @default true
   */
  allowAllCollapsed?: boolean;

  /**
   * Callback fired when a section is toggled
   */
  onToggle?: (itemId: string, expanded: boolean) => void;

  /**
   * Callback fired when expanded items change (provides array of expanded IDs)
   */
  onChange?: (expandedItems: string[]) => void;
}

/**
 * Internal state for the Accordion component
 */
export interface AccordionState {
  /**
   * Set of currently expanded item IDs
   */
  expandedItems: Set<string>;

  /**
   * Currently focused item ID (for keyboard navigation)
   */
  focusedItem: string | null;
}

/**
 * Accordion component element with attached methods
 */
export interface AccordionElement extends HTMLElement {
  /**
   * Get array of currently expanded item IDs
   */
  getExpandedItems: () => string[];

  /**
   * Check if a specific item is expanded
   */
  isExpanded: (itemId: string) => boolean;

  /**
   * Expand a specific item
   */
  expand: (itemId: string) => void;

  /**
   * Collapse a specific item
   */
  collapse: (itemId: string) => void;

  /**
   * Toggle a specific item's expanded state
   */
  toggle: (itemId: string) => void;

  /**
   * Expand all items
   */
  expandAll: () => void;

  /**
   * Collapse all items
   */
  collapseAll: () => void;

  /**
   * Enable a disabled item
   */
  enableItem: (itemId: string) => void;

  /**
   * Disable an item
   */
  disableItem: (itemId: string) => void;

  /**
   * Get the accordion items configuration
   */
  getItems: () => AccordionItemProps[];

  /**
   * Update accordion items dynamically
   */
  setItems: (items: AccordionItemProps[]) => void;

  /**
   * Focus the first header
   */
  focus: () => void;

  /**
   * Clean up event listeners and resources
   */
  destroy: () => void;
}

/**
 * Event detail for accordion toggle events
 */
export interface AccordionToggleEventDetail {
  /**
   * ID of the toggled item
   */
  itemId: string;

  /**
   * Whether the item is now expanded
   */
  expanded: boolean;

  /**
   * Array of all currently expanded item IDs
   */
  expandedItems: string[];
}
