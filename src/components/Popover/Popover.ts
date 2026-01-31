/**
 * Popover Component
 *
 * DOS-style popover for displaying rich content triggered by user interaction.
 * Supports click, hover, and focus triggers with automatic positioning.
 */

import type {
  PopoverProps,
  PopoverInstance,
  PopoverPosition,
} from './Popover.types';
import './Popover.css';

let popoverIdCounter = 0;

/**
 * Creates a DOS-style popover component
 *
 * @param props - Popover configuration options
 * @returns PopoverInstance with methods to control the popover
 *
 * @example
 * ```typescript
 * const button = document.querySelector('#my-button') as HTMLElement;
 * const content = document.createElement('div');
 * content.innerHTML = '<p>Rich content here!</p>';
 *
 * const popover = createPopover({
 *   content,
 *   target: button,
 *   title: 'My Popover',
 *   trigger: 'click'
 * });
 *
 * // Later: cleanup
 * popover.destroy();
 * ```
 */
export function createPopover(props: PopoverProps): PopoverInstance {
  const {
    content,
    target,
    title,
    position = 'bottom',
    trigger = 'click',
    arrow = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    className,
    id = `dos-popover-${++popoverIdCounter}`,
    offset = 8,
    backgroundColor = 'var(--dos-color-bg-secondary)',
    onOpen,
    onClose,
  } = props;

  let currentPosition = position;
  let currentTitle = title;
  let isOpenState = false;

  // Create popover element
  const popoverEl = document.createElement('div');
  popoverEl.id = id;
  popoverEl.className = 'dos-popover';
  if (className) {
    popoverEl.classList.add(className);
  }
  popoverEl.classList.add(`dos-popover--${currentPosition}`);

  // Apply background color
  popoverEl.style.backgroundColor = backgroundColor;
  
  // Set CSS custom property for arrow background
  popoverEl.style.setProperty('--dos-popover-bg', backgroundColor);

  // Set ARIA attributes
  popoverEl.setAttribute('role', 'dialog');
  popoverEl.setAttribute('aria-modal', 'false');

  // Create header if title is provided
  let headerEl: HTMLElement | null = null;
  let titleEl: HTMLElement | null = null;
  let closeBtn: HTMLButtonElement | null = null;

  function createHeader(): void {
    if (!headerEl) {
      headerEl = document.createElement('div');
      headerEl.className = 'dos-popover__header';

      titleEl = document.createElement('h3');
      titleEl.className = 'dos-popover__title';
      titleEl.id = `${id}-title`;
      headerEl.appendChild(titleEl);

      closeBtn = document.createElement('button');
      closeBtn.className = 'dos-popover__close';
      closeBtn.type = 'button';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close popover');
      closeBtn.addEventListener('click', close);
      headerEl.appendChild(closeBtn);

      popoverEl.insertBefore(headerEl, popoverEl.firstChild);
      popoverEl.setAttribute('aria-labelledby', `${id}-title`);
    }
  }

  function updateHeader(): void {
    if (currentTitle) {
      if (!headerEl) {
        createHeader();
      }
      if (titleEl) {
        titleEl.textContent = currentTitle;
      }
      if (headerEl) {
        headerEl.style.display = '';
      }
    } else if (headerEl) {
      headerEl.style.display = 'none';
      popoverEl.removeAttribute('aria-labelledby');
    }
  }

  if (title) {
    createHeader();
    // titleEl is definitely set after createHeader()
    if (titleEl) {
      (titleEl as HTMLElement).textContent = title;
    }
  }

  // Create content container
  const contentEl = document.createElement('div');
  contentEl.className = 'dos-popover__content';

  function setContentInternal(newContent: HTMLElement | string): void {
    contentEl.innerHTML = '';
    if (typeof newContent === 'string') {
      contentEl.textContent = newContent;
    } else {
      contentEl.appendChild(newContent);
    }
  }

  setContentInternal(content);
  popoverEl.appendChild(contentEl);

  // Create arrow if enabled
  let arrowEl: HTMLElement | null = null;
  if (arrow) {
    arrowEl = document.createElement('span');
    arrowEl.className = 'dos-popover__arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    popoverEl.appendChild(arrowEl);
  }

  // Set up ARIA attributes on target
  target.setAttribute('aria-haspopup', 'dialog');
  target.setAttribute('aria-expanded', 'false');
  target.setAttribute('aria-controls', id);

  // Make target focusable if needed
  if (!target.hasAttribute('tabindex') && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
    target.setAttribute('tabindex', '0');
  }

  // Append to body
  document.body.appendChild(popoverEl);

  /**
   * Calculate popover position relative to target
   */
  function calculatePosition(pos: PopoverPosition): { top: number; left: number } {
    const targetRect = target.getBoundingClientRect();
    const popoverRect = popoverEl.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (pos) {
      case 'top':
        top = targetRect.top + scrollY - popoverRect.height - offset;
        left = targetRect.left + scrollX + (targetRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + offset;
        left = targetRect.left + scrollX + (targetRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height - popoverRect.height) / 2;
        left = targetRect.left + scrollX - popoverRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height - popoverRect.height) / 2;
        left = targetRect.right + scrollX + offset;
        break;
    }

    return { top, left };
  }

  /**
   * Check if position would cause overflow and get best alternative
   */
  function getBestPosition(preferredPos: PopoverPosition): PopoverPosition {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetRect = target.getBoundingClientRect();
    const popoverRect = popoverEl.getBoundingClientRect();

    const spaceTop = targetRect.top;
    const spaceBottom = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    switch (preferredPos) {
      case 'top':
        if (spaceTop >= popoverRect.height + offset) return 'top';
        if (spaceBottom >= popoverRect.height + offset) return 'bottom';
        break;
      case 'bottom':
        if (spaceBottom >= popoverRect.height + offset) return 'bottom';
        if (spaceTop >= popoverRect.height + offset) return 'top';
        break;
      case 'left':
        if (spaceLeft >= popoverRect.width + offset) return 'left';
        if (spaceRight >= popoverRect.width + offset) return 'right';
        break;
      case 'right':
        if (spaceRight >= popoverRect.width + offset) return 'right';
        if (spaceLeft >= popoverRect.width + offset) return 'left';
        break;
    }

    return preferredPos;
  }

  /**
   * Update popover position on screen
   */
  function updatePosition(): void {
    const bestPosition = getBestPosition(currentPosition);

    // Update position class if changed
    popoverEl.classList.remove(
      'dos-popover--top',
      'dos-popover--bottom',
      'dos-popover--left',
      'dos-popover--right'
    );
    popoverEl.classList.add(`dos-popover--${bestPosition}`);

    const { top, left } = calculatePosition(bestPosition);

    // Clamp to viewport
    const clampedLeft = Math.max(8, Math.min(left, window.innerWidth - popoverEl.offsetWidth - 8));
    const clampedTop = Math.max(8, Math.min(top, document.documentElement.scrollHeight - popoverEl.offsetHeight - 8));

    popoverEl.style.top = `${clampedTop}px`;
    popoverEl.style.left = `${clampedLeft}px`;
  }

  /**
   * Open the popover
   */
  function open(): void {
    if (isOpenState) return;

    isOpenState = true;
    updatePosition();
    popoverEl.classList.add('dos-popover--open');
    target.setAttribute('aria-expanded', 'true');

    // Focus first focusable element or close button
    const firstFocusable = popoverEl.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 0);
    }

    onOpen?.();
  }

  /**
   * Close the popover
   */
  function close(): void {
    if (!isOpenState) return;

    isOpenState = false;
    popoverEl.classList.remove('dos-popover--open');
    target.setAttribute('aria-expanded', 'false');

    // Return focus to target
    target.focus();

    onClose?.();
  }

  /**
   * Toggle the popover
   */
  function toggle(): void {
    if (isOpenState) {
      close();
    } else {
      open();
    }
  }

  // Event handlers
  function handleTargetClick(e: MouseEvent): void {
    if (trigger === 'click') {
      e.preventDefault();
      toggle();
    }
  }

  function handleTargetKeydown(e: KeyboardEvent): void {
    if (trigger === 'click' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  }

  function handleTargetMouseEnter(): void {
    if (trigger === 'hover') {
      open();
    }
  }

  function handleTargetMouseLeave(e: MouseEvent): void {
    if (trigger === 'hover') {
      // Don't close if moving into popover
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && popoverEl.contains(relatedTarget)) {
        return;
      }
      close();
    }
  }

  function handlePopoverMouseLeave(e: MouseEvent): void {
    if (trigger === 'hover') {
      // Don't close if moving back to target
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && target.contains(relatedTarget)) {
        return;
      }
      close();
    }
  }

  function handleTargetFocus(): void {
    if (trigger === 'focus') {
      open();
    }
  }

  function handleTargetBlur(e: FocusEvent): void {
    if (trigger === 'focus') {
      // Don't close if focus is moving into popover
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && popoverEl.contains(relatedTarget)) {
        return;
      }
      close();
    }
  }

  function handleDocumentClick(e: MouseEvent): void {
    if (!closeOnClickOutside || !isOpenState) return;

    const clickTarget = e.target as Node;
    if (!popoverEl.contains(clickTarget) && !target.contains(clickTarget)) {
      close();
    }
  }

  function handleDocumentKeydown(e: KeyboardEvent): void {
    if (closeOnEscape && e.key === 'Escape' && isOpenState) {
      close();
    }
  }

  function handleScrollResize(): void {
    if (isOpenState) {
      updatePosition();
    }
  }

  // Attach event listeners
  target.addEventListener('click', handleTargetClick);
  target.addEventListener('keydown', handleTargetKeydown);
  target.addEventListener('mouseenter', handleTargetMouseEnter);
  target.addEventListener('mouseleave', handleTargetMouseLeave);
  target.addEventListener('focus', handleTargetFocus);
  target.addEventListener('blur', handleTargetBlur);

  popoverEl.addEventListener('mouseleave', handlePopoverMouseLeave);

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);
  window.addEventListener('scroll', handleScrollResize, true);
  window.addEventListener('resize', handleScrollResize);

  /**
   * Update popover content
   */
  function setContent(newContent: HTMLElement | string): void {
    setContentInternal(newContent);
    if (isOpenState) {
      updatePosition();
    }
  }

  /**
   * Update popover title
   */
  function setTitle(newTitle: string | null): void {
    currentTitle = newTitle ?? undefined;
    updateHeader();
    if (isOpenState) {
      updatePosition();
    }
  }

  /**
   * Update popover position preference
   */
  function setPosition(newPosition: PopoverPosition): void {
    currentPosition = newPosition;
    if (isOpenState) {
      updatePosition();
    }
  }

  /**
   * Clean up and remove popover
   */
  function destroy(): void {
    // Remove event listeners from target
    target.removeEventListener('click', handleTargetClick);
    target.removeEventListener('keydown', handleTargetKeydown);
    target.removeEventListener('mouseenter', handleTargetMouseEnter);
    target.removeEventListener('mouseleave', handleTargetMouseLeave);
    target.removeEventListener('focus', handleTargetFocus);
    target.removeEventListener('blur', handleTargetBlur);

    // Remove popover listeners
    popoverEl.removeEventListener('mouseleave', handlePopoverMouseLeave);

    // Remove global listeners
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleDocumentKeydown);
    window.removeEventListener('scroll', handleScrollResize, true);
    window.removeEventListener('resize', handleScrollResize);

    // Remove ARIA attributes from target
    target.removeAttribute('aria-haspopup');
    target.removeAttribute('aria-expanded');
    target.removeAttribute('aria-controls');

    // Remove popover from DOM
    popoverEl.remove();
  }

  return {
    element: popoverEl,
    open,
    close,
    toggle,
    setContent,
    setTitle,
    setPosition,
    isOpen: () => isOpenState,
    destroy,
  };
}
