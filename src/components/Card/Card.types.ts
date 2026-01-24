/**
 * @file Card component types
 * @description TypeScript interfaces for the DOS-style Card component
 */

/**
 * Card component properties
 */
export interface CardProps {
  /**
   * Card header content
   * Can be a string or HTML element
   */
  header?: string | HTMLElement;

  /**
   * Card body content
   * Can be a string or HTML element
   */
  content?: string | HTMLElement;

  /**
   * Card footer content
   * Typically contains action buttons
   */
  footer?: HTMLElement;

  /**
   * Show border around the card
   * @default true
   */
  bordered?: boolean;

  /**
   * Show elevation shadow effect using DOS characters
   * @default false
   */
  elevated?: boolean;

  /**
   * Make the card clickable/interactive
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether the card is in selected state
   * Only applies when interactive is true
   * @default false
   */
  selected?: boolean;

  /**
   * Click handler for interactive cards
   */
  onClick?: (event: MouseEvent | KeyboardEvent) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Custom ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA labelledby reference
   */
  'aria-labelledby'?: string;
}

/**
 * Card instance returned by createCard
 */
export interface CardInstance {
  /**
   * The card DOM element
   */
  element: HTMLElement;

  /**
   * Set the header content
   */
  setHeader: (header: string | HTMLElement | undefined) => void;

  /**
   * Get the current header content (element)
   */
  getHeader: () => HTMLElement | null;

  /**
   * Set the body content
   */
  setContent: (content: string | HTMLElement | undefined) => void;

  /**
   * Get the current body content (element)
   */
  getContent: () => HTMLElement | null;

  /**
   * Set the footer content
   */
  setFooter: (footer: HTMLElement | undefined) => void;

  /**
   * Get the current footer content (element)
   */
  getFooter: () => HTMLElement | null;

  /**
   * Set bordered state
   */
  setBordered: (bordered: boolean) => void;

  /**
   * Get bordered state
   */
  isBordered: () => boolean;

  /**
   * Set elevated state
   */
  setElevated: (elevated: boolean) => void;

  /**
   * Get elevated state
   */
  isElevated: () => boolean;

  /**
   * Set selected state (for interactive cards)
   */
  setSelected: (selected: boolean) => void;

  /**
   * Get selected state
   */
  isSelected: () => boolean;

  /**
   * Focus the card (for interactive cards)
   */
  focus: () => void;

  /**
   * Clean up event listeners and resources
   */
  destroy: () => void;
}
