/**
 * Resizable Component Types
 *
 * Type definitions for the DOS-style resizable container component.
 */

/**
 * Resize handle positions
 */
export type ResizeHandle =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Resize direction during active resize
 */
export type ResizeDirection = 'horizontal' | 'vertical' | 'both';

/**
 * Size constraints for resizable element
 */
export interface ResizeConstraints {
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
}

/**
 * Size information during resize
 */
export interface ResizeSize {
  /** Current width in pixels */
  width: number;
  /** Current height in pixels */
  height: number;
}

/**
 * Delta change during resize
 */
export interface ResizeDelta {
  /** Change in width */
  deltaWidth: number;
  /** Change in height */
  deltaHeight: number;
}

/**
 * Props for the Resizable component
 */
export interface ResizableProps {
  /** Which handles to enable for resizing */
  handles?: ResizeHandle[];

  /** Initial width in pixels */
  initialWidth?: number;

  /** Initial height in pixels */
  initialHeight?: number;

  /** Size constraints */
  constraints?: ResizeConstraints;

  /** Step size for resizing (snap to grid) */
  step?: number;

  /** Whether to show resize handles on hover only */
  showHandlesOnHover?: boolean;

  /** Whether to maintain aspect ratio during resize */
  aspectRatio?: number | boolean;

  /** Content to wrap */
  content?: HTMLElement | string;

  /** Callback fired when resize starts */
  onResizeStart?: (size: ResizeSize, handle: ResizeHandle) => void;

  /** Callback fired during resize */
  onResize?: (size: ResizeSize, delta: ResizeDelta) => void;

  /** Callback fired when resize ends */
  onResizeEnd?: (size: ResizeSize) => void;

  /** Custom ID for the element */
  id?: string;

  /** Additional CSS class */
  className?: string;

  /** Whether resizing is disabled */
  disabled?: boolean;
}

/**
 * Instance returned by createResizable
 */
export interface ResizableInstance {
  /** The root resizable element */
  element: HTMLElement;

  /** The content wrapper element */
  contentElement: HTMLElement;

  /** Get current size */
  getSize(): ResizeSize;

  /** Set size programmatically */
  setSize(width: number, height: number): void;

  /** Reset to initial size */
  reset(): void;

  /** Set new content */
  setContent(content: HTMLElement | string): void;

  /** Enable resizing */
  enable(): void;

  /** Disable resizing */
  disable(): void;

  /** Check if resizing is currently disabled */
  isDisabled(): boolean;

  /** Check if currently resizing */
  isResizing(): boolean;

  /** Destroy the component */
  destroy(): void;
}
