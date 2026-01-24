/**
 * Draggable Component
 *
 * A DOS-style draggable element that can be moved around the screen.
 * Supports axis constraints, bounds, grid snapping, and custom handles.
 */

export { createDraggable } from './Draggable';
export type {
  DraggableProps,
  DraggableInstance,
  DragPosition,
  DragDelta,
  DragAxis,
  DragBounds,
} from './Draggable.types';
