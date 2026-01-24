/**
 * @file Card component
 * @description DOS-style card container with header, content, and footer sections
 */

import type { CardProps, CardInstance } from './Card.types';
import './Card.css';

/**
 * Creates a DOS-style card container
 * 
 * @param props - Card configuration options
 * @returns Card instance with element and methods
 * 
 * @example
 * ```typescript
 * const card = createCard({
 *   header: 'Card Title',
 *   content: 'Card body content goes here.',
 *   bordered: true,
 *   elevated: true
 * });
 * document.body.appendChild(card.element);
 * ```
 */
export function createCard(props: CardProps = {}): CardInstance {
  const {
    header,
    content,
    footer,
    bordered = true,
    elevated = false,
    interactive = false,
    selected = false,
    onClick,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  } = props;

  // Create main card container
  const element = document.createElement('div');
  element.className = buildClassName(bordered, elevated, interactive, selected, className);
  
  if (id) {
    element.id = id;
  }

  // Internal state
  let currentBordered = bordered;
  let currentElevated = elevated;
  let currentSelected = selected;
  let headerElement: HTMLElement | null = null;
  let contentElement: HTMLElement | null = null;
  let footerElement: HTMLElement | null = null;

  // Set up ARIA attributes
  if (interactive) {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    if (selected) {
      element.setAttribute('aria-pressed', 'true');
    }
  } else {
    element.setAttribute('role', 'article');
  }

  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
  if (ariaLabelledby) {
    element.setAttribute('aria-labelledby', ariaLabelledby);
  }

  // Generate unique ID for header if needed for labelledby
  const headerId = id ? `${id}-header` : `card-header-${Date.now()}`;

  // Create and append header if provided
  if (header !== undefined) {
    headerElement = createHeaderElement(header, headerId);
    element.appendChild(headerElement);
    
    // If no explicit aria-label, use header for labelling
    if (!ariaLabel && !ariaLabelledby) {
      element.setAttribute('aria-labelledby', headerId);
    }
  }

  // Create and append content if provided
  if (content !== undefined) {
    contentElement = createContentElement(content);
    element.appendChild(contentElement);
  }

  // Create and append footer if provided
  if (footer !== undefined) {
    footerElement = createFooterElement(footer);
    element.appendChild(footerElement);
  }

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (interactive && onClick) {
      onClick(event);
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (!interactive) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
  }

  // Add event listeners for interactive cards
  if (interactive) {
    element.addEventListener('click', handleClick);
    element.addEventListener('keydown', handleKeydown);
  }

  // Helper function to build class name
  function buildClassName(
    bordered: boolean,
    elevated: boolean,
    interactive: boolean,
    selected: boolean,
    className?: string
  ): string {
    const classes = ['dos-card'];
    
    if (bordered) classes.push('dos-card--bordered');
    if (elevated) classes.push('dos-card--elevated');
    if (interactive) classes.push('dos-card--interactive');
    if (selected) classes.push('dos-card--selected');
    if (className) classes.push(className);
    
    return classes.join(' ');
  }

  // Helper function to update class name
  function updateClassName(): void {
    element.className = buildClassName(
      currentBordered,
      currentElevated,
      interactive,
      currentSelected,
      className
    );
  }

  // Instance methods
  function setHeader(newHeader: string | HTMLElement | undefined): void {
    // Remove existing header
    if (headerElement) {
      element.removeChild(headerElement);
      headerElement = null;
    }

    // Add new header if provided
    if (newHeader !== undefined) {
      headerElement = createHeaderElement(newHeader, headerId);
      // Insert at the beginning
      element.insertBefore(headerElement, element.firstChild);
    }
  }

  function getHeader(): HTMLElement | null {
    return headerElement;
  }

  function setContent(newContent: string | HTMLElement | undefined): void {
    // Remove existing content
    if (contentElement) {
      element.removeChild(contentElement);
      contentElement = null;
    }

    // Add new content if provided
    if (newContent !== undefined) {
      contentElement = createContentElement(newContent);
      // Insert after header (if exists) or at beginning
      if (headerElement) {
        headerElement.insertAdjacentElement('afterend', contentElement);
      } else {
        element.insertBefore(contentElement, element.firstChild);
      }
    }
  }

  function getContent(): HTMLElement | null {
    return contentElement;
  }

  function setFooter(newFooter: HTMLElement | undefined): void {
    // Remove existing footer
    if (footerElement) {
      element.removeChild(footerElement);
      footerElement = null;
    }

    // Add new footer if provided
    if (newFooter !== undefined) {
      footerElement = createFooterElement(newFooter);
      element.appendChild(footerElement);
    }
  }

  function getFooter(): HTMLElement | null {
    return footerElement;
  }

  function setBordered(bordered: boolean): void {
    currentBordered = bordered;
    updateClassName();
  }

  function isBordered(): boolean {
    return currentBordered;
  }

  function setElevated(elevated: boolean): void {
    currentElevated = elevated;
    updateClassName();
  }

  function isElevated(): boolean {
    return currentElevated;
  }

  function setSelected(selected: boolean): void {
    currentSelected = selected;
    updateClassName();
    if (interactive) {
      element.setAttribute('aria-pressed', String(selected));
    }
  }

  function isSelected(): boolean {
    return currentSelected;
  }

  function focus(): void {
    if (interactive) {
      element.focus();
    }
  }

  function destroy(): void {
    element.removeEventListener('click', handleClick);
    element.removeEventListener('keydown', handleKeydown);
  }

  return {
    element,
    setHeader,
    getHeader,
    setContent,
    getContent,
    setFooter,
    getFooter,
    setBordered,
    isBordered,
    setElevated,
    isElevated,
    setSelected,
    isSelected,
    focus,
    destroy,
  };
}

/**
 * Creates a header element for the card
 */
function createHeaderElement(header: string | HTMLElement, headerId: string): HTMLElement {
  const headerEl = document.createElement('div');
  headerEl.className = 'dos-card__header';
  headerEl.id = headerId;

  if (typeof header === 'string') {
    headerEl.textContent = header;
  } else {
    headerEl.appendChild(header);
  }

  return headerEl;
}

/**
 * Creates a content element for the card
 */
function createContentElement(content: string | HTMLElement): HTMLElement {
  const contentEl = document.createElement('div');
  contentEl.className = 'dos-card__content';

  if (typeof content === 'string') {
    contentEl.textContent = content;
  } else {
    contentEl.appendChild(content);
  }

  return contentEl;
}

/**
 * Creates a footer element for the card
 */
function createFooterElement(footer: HTMLElement): HTMLElement {
  const footerEl = document.createElement('div');
  footerEl.className = 'dos-card__footer';
  footerEl.appendChild(footer);

  return footerEl;
}
