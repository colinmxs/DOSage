/**
 * Tooltip Component
 *
 * DOS-style tooltip for displaying contextual information on hover or focus.
 * Supports multiple positions with automatic viewport collision detection.
 */

import type {
  TooltipProps,
  TooltipInstance,
  TooltipPosition,
} from './Tooltip.types';
import './Tooltip.css';

let tooltipIdCounter = 0;

/**
 * Creates a DOS-style tooltip component
 *
 * @param props - Tooltip configuration options
 * @returns TooltipInstance with methods to control the tooltip
 *
 * @example
 * ```typescript
 * const button = document.querySelector('#my-button') as HTMLElement;
 * const tooltip = createTooltip({
 *   content: 'Click me!',
 *   target: button,
 *   position: 'top',
 *   trigger: 'hover'
 * });
 *
 * // Later: cleanup
 * tooltip.destroy();
 * ```
 */
export function createTooltip(props: TooltipProps): TooltipInstance {
  const {
    content,
    target,
    position = 'top',
    trigger = 'both',
    delay = 200,
    arrow = true,
    className,
    id = `dos-tooltip-${++tooltipIdCounter}`,
    offset = 8,
  } = props;

  let currentContent = content;
  let currentPosition = position;
  let isVisible = false;
  let showTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Create tooltip element
  const tooltipEl = document.createElement('div');
  tooltipEl.id = id;
  tooltipEl.className = 'dos-tooltip';
  if (className) {
    tooltipEl.classList.add(className);
  }
  tooltipEl.classList.add(`dos-tooltip--${currentPosition}`);

  // Set ARIA attributes
  tooltipEl.setAttribute('role', 'tooltip');

  // Create content container
  const contentEl = document.createElement('span');
  contentEl.className = 'dos-tooltip__content';
  contentEl.textContent = currentContent;
  tooltipEl.appendChild(contentEl);

  // Create arrow if enabled
  let arrowEl: HTMLElement | null = null;
  if (arrow) {
    arrowEl = document.createElement('span');
    arrowEl.className = 'dos-tooltip__arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    tooltipEl.appendChild(arrowEl);
  }

  // Set up ARIA relationship on target
  target.setAttribute('aria-describedby', id);

  // Make target focusable if needed
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '0');
  }

  // Append to body
  document.body.appendChild(tooltipEl);

  /**
   * Calculate tooltip position relative to target
   */
  function calculatePosition(pos: TooltipPosition): { top: number; left: number } {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (pos) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - offset;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + offset;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + scrollX - tooltipRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + scrollX + offset;
        break;
    }

    return { top, left };
  }

  /**
   * Check if position would cause overflow and get best alternative
   */
  function getBestPosition(preferredPos: TooltipPosition): TooltipPosition {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    const spaceTop = targetRect.top;
    const spaceBottom = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    // Check if preferred position has enough space
    switch (preferredPos) {
      case 'top':
        if (spaceTop >= tooltipRect.height + offset) return 'top';
        if (spaceBottom >= tooltipRect.height + offset) return 'bottom';
        break;
      case 'bottom':
        if (spaceBottom >= tooltipRect.height + offset) return 'bottom';
        if (spaceTop >= tooltipRect.height + offset) return 'top';
        break;
      case 'left':
        if (spaceLeft >= tooltipRect.width + offset) return 'left';
        if (spaceRight >= tooltipRect.width + offset) return 'right';
        break;
      case 'right':
        if (spaceRight >= tooltipRect.width + offset) return 'right';
        if (spaceLeft >= tooltipRect.width + offset) return 'left';
        break;
    }

    // Fall back to preferred position if no good alternative
    return preferredPos;
  }

  /**
   * Update tooltip position on screen
   */
  function updatePosition(): void {
    // Get best position accounting for viewport
    const bestPosition = getBestPosition(currentPosition);

    // Update position class if changed
    if (bestPosition !== currentPosition) {
      tooltipEl.classList.remove(`dos-tooltip--${currentPosition}`);
      tooltipEl.classList.add(`dos-tooltip--${bestPosition}`);
    }

    const { top, left } = calculatePosition(bestPosition);

    // Clamp to viewport
    const clampedLeft = Math.max(8, Math.min(left, window.innerWidth - tooltipEl.offsetWidth - 8));
    const clampedTop = Math.max(8, Math.min(top, document.documentElement.scrollHeight - tooltipEl.offsetHeight - 8));

    tooltipEl.style.top = `${clampedTop}px`;
    tooltipEl.style.left = `${clampedLeft}px`;

    // Restore original position class after positioning
    if (bestPosition !== currentPosition) {
      tooltipEl.classList.remove(`dos-tooltip--${bestPosition}`);
      tooltipEl.classList.add(`dos-tooltip--${currentPosition}`);
    }
  }

  /**
   * Show the tooltip
   */
  function show(): void {
    if (isVisible) return;

    // Clear any pending hide
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }

    // Apply delay
    showTimeoutId = setTimeout(() => {
      isVisible = true;
      updatePosition();
      tooltipEl.classList.add('dos-tooltip--visible');
    }, delay);
  }

  /**
   * Hide the tooltip
   */
  function hide(): void {
    // Clear any pending show
    if (showTimeoutId) {
      clearTimeout(showTimeoutId);
      showTimeoutId = null;
    }

    if (!isVisible) return;

    isVisible = false;
    tooltipEl.classList.remove('dos-tooltip--visible');
  }

  /**
   * Update tooltip content
   */
  function setContent(newContent: string): void {
    currentContent = newContent;
    contentEl.textContent = newContent;
    if (isVisible) {
      updatePosition();
    }
  }

  /**
   * Update tooltip position preference
   */
  function setPosition(newPosition: TooltipPosition): void {
    tooltipEl.classList.remove(`dos-tooltip--${currentPosition}`);
    currentPosition = newPosition;
    tooltipEl.classList.add(`dos-tooltip--${currentPosition}`);
    if (isVisible) {
      updatePosition();
    }
  }

  // Event handlers
  function handleMouseEnter(): void {
    if (trigger === 'hover' || trigger === 'both') {
      show();
    }
  }

  function handleMouseLeave(): void {
    if (trigger === 'hover' || trigger === 'both') {
      hide();
    }
  }

  function handleFocus(): void {
    if (trigger === 'focus' || trigger === 'both') {
      show();
    }
  }

  function handleBlur(): void {
    if (trigger === 'focus' || trigger === 'both') {
      hide();
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isVisible) {
      hide();
    }
  }

  // Attach event listeners to target
  target.addEventListener('mouseenter', handleMouseEnter);
  target.addEventListener('mouseleave', handleMouseLeave);
  target.addEventListener('focus', handleFocus);
  target.addEventListener('blur', handleBlur);
  target.addEventListener('keydown', handleKeyDown);

  // Update position on scroll/resize
  function handleScrollResize(): void {
    if (isVisible) {
      updatePosition();
    }
  }

  window.addEventListener('scroll', handleScrollResize, true);
  window.addEventListener('resize', handleScrollResize);

  /**
   * Clean up and remove tooltip
   */
  function destroy(): void {
    // Clear timeouts
    if (showTimeoutId) clearTimeout(showTimeoutId);
    if (hideTimeoutId) clearTimeout(hideTimeoutId);

    // Remove event listeners from target
    target.removeEventListener('mouseenter', handleMouseEnter);
    target.removeEventListener('mouseleave', handleMouseLeave);
    target.removeEventListener('focus', handleFocus);
    target.removeEventListener('blur', handleBlur);
    target.removeEventListener('keydown', handleKeyDown);

    // Remove global listeners
    window.removeEventListener('scroll', handleScrollResize, true);
    window.removeEventListener('resize', handleScrollResize);

    // Remove ARIA relationship
    target.removeAttribute('aria-describedby');

    // Remove tooltip from DOM
    tooltipEl.remove();
  }

  return {
    element: tooltipEl,
    show,
    hide,
    setContent,
    setPosition,
    isVisible: () => isVisible,
    destroy,
  };
}
