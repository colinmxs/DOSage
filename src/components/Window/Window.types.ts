/**
 * Window Component Types
 *
 * Type definitions for the DOS-style draggable/resizable window component.
 */

/**
 * Position coordinates for the window
 */
export interface WindowPosition {
  x: number;
  y: number;
}

/**
 * Dimensions for the window
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Window state enumeration
 */
export type WindowState = 'normal' | 'minimized' | 'maximized';

/**
 * Configuration options for creating a Window component
 */
export interface WindowProps {
  /**
   * Window title displayed in the title bar
   */
  title: string;

  /**
   * Window content - can be a string or HTML element
   */
  content?: string | HTMLElement;

  /**
   * Initial width of the window (in pixels or CSS value)
   * @default 400
   */
  width?: number | string;

  /**
   * Initial height of the window (in pixels or CSS value)
   * @default 300
   */
  height?: number | string;

  /**
   * Initial X position (in pixels from left)
   * @default 50
   */
  x?: number;

  /**
   * Initial Y position (in pixels from top)
   * @default 50
   */
  y?: number;

  /**
   * Initial state of the window
   * @default 'normal'
   */
  state?: WindowState;

  /**
   * Whether the window can be dragged
   * @default true
   */
  draggable?: boolean;

  /**
   * Whether the window can be resized
   * @default true
   */
  resizable?: boolean;

  /**
   * Whether to show the minimize button
   * @default true
   */
  showMinimize?: boolean;

  /**
   * Whether to show the maximize button
   * @default true
   */
  showMaximize?: boolean;

  /**
   * Whether to show the close button
   * @default true
   */
  showClose?: boolean;

  /**
   * Minimum width (in pixels)
   * @default 200
   */
  minWidth?: number;

  /**
   * Minimum height (in pixels)
   * @default 100
   */
  minHeight?: number;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Optional ID for the window element
   */
  id?: string;

  /**
   * Callback when the window is closed
   */
  onClose?: () => void;

  /**
   * Callback when the window is minimized
   */
  onMinimize?: () => void;

  /**
   * Callback when the window is maximized
   */
  onMaximize?: () => void;

  /**
   * Callback when the window is restored from minimized/maximized
   */
  onRestore?: () => void;

  /**
   * Callback when the window is moved
   */
  onMove?: (position: WindowPosition) => void;

  /**
   * Callback when the window is resized
   */
  onResize?: (size: WindowSize) => void;

  /**
   * Callback when the window gains focus
   */
  onFocus?: () => void;

  /**
   * Callback when the window loses focus
   */
  onBlur?: () => void;
}

/**
 * Instance methods and properties returned when creating a Window
 */
export interface WindowInstance {
  /**
   * The root window element
   */
  element: HTMLElement;

  /**
   * Opens/shows the window
   */
  open(): void;

  /**
   * Closes/hides the window
   */
  close(): void;

  /**
   * Minimizes the window
   */
  minimize(): void;

  /**
   * Maximizes the window
   */
  maximize(): void;

  /**
   * Restores the window to normal state
   */
  restore(): void;

  /**
   * Brings the window to the front (focus)
   */
  focus(): void;

  /**
   * Gets the current window state
   */
  getState(): WindowState;

  /**
   * Gets the current position
   */
  getPosition(): WindowPosition;

  /**
   * Sets the window position
   */
  setPosition(x: number, y: number): void;

  /**
   * Gets the current size
   */
  getSize(): WindowSize;

  /**
   * Sets the window size
   */
  setSize(width: number, height: number): void;

  /**
   * Sets the window title
   */
  setTitle(title: string): void;

  /**
   * Sets the window content
   */
  setContent(content: string | HTMLElement): void;

  /**
   * Destroys the window and cleans up event listeners
   */
  destroy(): void;

  /**
   * Whether the window is currently visible
   */
  isVisible(): boolean;

  /**
   * Whether the window is currently focused
   */
  isFocused(): boolean;
}
