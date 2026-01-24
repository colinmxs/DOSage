/**
 * Resizable Component
 *
 * A DOS-style resizable container with draggable handles.
 * Supports edge and corner resizing with constraints and aspect ratio locking.
 */

export { createResizable } from './Resizable';
export type {
  ResizableProps,
  ResizableInstance,
  ResizeHandle,
  ResizeDirection,
  ResizeConstraints,
  ResizeSize,
  ResizeDelta,
} from './Resizable.types';
