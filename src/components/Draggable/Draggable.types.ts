/**
 * Draggable Component Types
 *
 * Type definitions for the DOS-style draggable element component.
 */

/**
 * Position coordinates
 */
export interface DragPosition {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Drag delta (change from start)
 */
export interface DragDelta {
  /** Change in X from drag start */
  deltaX: number;
  /** Change in Y from drag start */
  deltaY: number;
}

/**
 * Axis constraint for dragging
 */
export type DragAxis = 'x' | 'y' | 'both';

/**
 * Bounds for constraining drag movement
 */
export interface DragBounds {
  /** Minimum X position */
  left?: number;
  /** Maximum X position */
  right?: number;
  /** Minimum Y position */
  top?: number;
  /** Maximum Y position */
  bottom?: number;
}

/**
 * Props for the Draggable component
 */
export interface DraggableProps {
  /** Initial X position */
  initialX?: number;

  /** Initial Y position */
  initialY?: number;

  /** Constrain movement to an axis */
  axis?: DragAxis;

  /** Bounds to constrain movement */
  bounds?: DragBounds | 'parent' | 'window';

  /** Grid snap size [x, y] */
  grid?: [number, number];

  /** Handle selector or element - if provided, only this area triggers drag */
  handle?: string | HTMLElement;

  /** Cancel selector - elements matching this won't trigger drag */
  cancel?: string;

  /** Content to wrap */
  content?: HTMLElement | string;

  /** Whether to use CSS transform instead of position */
  useTransform?: boolean;

  /** Callback fired when drag starts */
  onDragStart?: (position: DragPosition) => void;

  /** Callback fired during drag */
  onDrag?: (position: DragPosition, delta: DragDelta) => void;

  /** Callback fired when drag ends */
  onDragEnd?: (position: DragPosition) => void;

  /** Custom ID for the element */
  id?: string;

  /** Additional CSS class */
  className?: string;

  /** Whether dragging is disabled */
  disabled?: boolean;
}

/**
 * Instance returned by createDraggable
 */
export interface DraggableInstance {
  /** The draggable element */
  element: HTMLElement;

  /** Get current position */
  getPosition(): DragPosition;

  /** Set position programmatically */
  setPosition(x: number, y: number): void;

  /** Reset to initial position */
  reset(): void;

  /** Set new content */
  setContent(content: HTMLElement | string): void;

  /** Enable dragging */
  enable(): void;

  /** Disable dragging */
  disable(): void;

  /** Check if dragging is currently disabled */
  isDisabled(): boolean;

  /** Check if currently dragging */
  isDragging(): boolean;

  /** Destroy the component */
  destroy(): void;
}
