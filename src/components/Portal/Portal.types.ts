/**
 * Portal Component Types
 *
 * Type definitions for the Portal utility component.
 * Portals render content outside the DOM hierarchy while maintaining
 * event bubbling and React-like behavior.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Portal target container type
 */
export type PortalContainer = HTMLElement | string | null;

/**
 * Props for the Portal component
 */
export interface PortalProps extends BaseComponentProps {
  /**
   * Content to render inside the portal.
   * Can be an HTML element or string content.
   */
  content: HTMLElement | string;

  /**
   * Target container for the portal content.
   * Can be an HTMLElement, a CSS selector string, or null for document.body.
   * @default document.body
   */
  target?: PortalContainer;

  /**
   * Whether the portal should create its own wrapper container.
   * @default true
   */
  createContainer?: boolean;

  /**
   * Custom CSS class for the portal container.
   */
  containerClass?: string;

  /**
   * Whether to preserve event bubbling through the portal.
   * When true, events will bubble from portal content to the original parent.
   * @default true
   */
  preserveEventBubbling?: boolean;

  /**
   * Callback fired when the portal is mounted to the DOM.
   */
  onMount?: () => void;

  /**
   * Callback fired when the portal is unmounted from the DOM.
   */
  onUnmount?: () => void;
}

/**
 * Portal instance with control methods
 */
export interface PortalInstance {
  /**
   * The portal container element.
   */
  element: HTMLElement;

  /**
   * The content element inside the portal.
   */
  content: HTMLElement | null;

  /**
   * Whether the portal is currently mounted.
   */
  isMounted: boolean;

  /**
   * Updates the portal content.
   * @param newContent - New content to render
   */
  setContent(newContent: HTMLElement | string): void;

  /**
   * Moves the portal to a new target container.
   * @param newTarget - New target container
   */
  moveTo(newTarget: PortalContainer): void;

  /**
   * Mounts the portal to the DOM if not already mounted.
   */
  mount(): void;

  /**
   * Unmounts the portal from the DOM.
   */
  unmount(): void;

  /**
   * Destroys the portal and cleans up all resources.
   */
  destroy(): void;
}
