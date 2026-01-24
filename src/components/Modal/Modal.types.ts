/**
 * Modal Component Types
 *
 * Type definitions for the DOS-style Modal/Dialog component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Modal size options
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

/**
 * Props for the Modal component
 */
export interface ModalProps extends BaseComponentProps {
  /**
   * Visibility state of the modal.
   * @default false
   */
  open?: boolean;

  /**
   * Dialog title displayed in the header.
   */
  title?: string;

  /**
   * Dialog body content. Can be a string or DOM element.
   */
  content?: string | HTMLElement;

  /**
   * Footer content, typically action buttons.
   */
  footer?: HTMLElement;

  /**
   * Modal size variant.
   * @default 'medium'
   */
  size?: ModalSize;

  /**
   * Whether to show the close button in the header.
   * @default true
   */
  closable?: boolean;

  /**
   * Whether pressing Escape closes the modal.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether clicking the overlay closes the modal.
   * @default true
   */
  closeOnOverlay?: boolean;

  /**
   * Callback when the modal is closed.
   */
  onClose?: () => void;

  /**
   * Callback when the modal is opened.
   */
  onOpen?: () => void;
}

/**
 * Modal instance interface for programmatic control
 */
export interface ModalInstance {
  /** The modal element */
  element: HTMLElement;

  /** Opens the modal */
  open: () => void;

  /** Closes the modal */
  close: () => void;

  /** Returns whether the modal is currently open */
  isOpen: () => boolean;

  /** Sets the modal title */
  setTitle: (title: string) => void;

  /** Sets the modal content */
  setContent: (content: string | HTMLElement) => void;

  /** Sets the modal footer */
  setFooter: (footer: HTMLElement) => void;

  /** Updates modal props */
  update: (props: Partial<ModalProps>) => void;

  /** Destroys the modal and cleans up event listeners */
  destroy: () => void;
}
