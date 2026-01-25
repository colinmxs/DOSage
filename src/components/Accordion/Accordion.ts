/**
 * Accordion Component
 *
 * A DOS-style accordion with expandable/collapsible sections.
 * Supports single and multiple expansion modes with full keyboard navigation.
 */

import type {
  AccordionProps,
  AccordionItemProps,
  AccordionState,
  AccordionElement,
  AccordionToggleEventDetail,
} from './Accordion.types';
import './Accordion.css';

/**
 * Creates a DOS-style accordion component with expandable sections.
 *
 * @param props - Accordion configuration options
 * @returns The accordion container element with attached methods
 *
 * @example
 * ```typescript
 * import { createAccordion } from 'dosage';
 *
 * const accordion = createAccordion({
 *   items: [
 *     { id: 'section1', title: 'General Settings', content: 'General content...' },
 *     { id: 'section2', title: 'Advanced Settings', content: 'Advanced content...' },
 *     { id: 'section3', title: 'About', content: 'About information...' },
 *   ],
 *   mode: 'single',
 *   onToggle: (id, expanded) => console.log(`${id} is now ${expanded ? 'open' : 'closed'}`)
 * });
 *
 * document.body.appendChild(accordion);
 * ```
 */
export function createAccordion(props: AccordionProps): AccordionElement {
  const {
    items,
    mode = 'single',
    variant = 'default',
    expandedItems: controlledExpanded,
    collapsedIcon = '[+]',
    expandedIcon = '[-]',
    allowAllCollapsed = true,
    onToggle,
    onChange,
    className,
    id,
  } = props;

  // Determine initial expanded items
  const getInitialExpanded = (): Set<string> => {
    if (controlledExpanded) {
      return new Set(controlledExpanded);
    }

    const defaultExpanded = items
      .filter((item) => item.defaultExpanded && !item.disabled)
      .map((item) => item.id)
      .filter((id): id is string => id !== undefined);

    // In single mode, only keep the first
    if (mode === 'single' && defaultExpanded.length > 0) {
      const firstItem = defaultExpanded[0];
      if (firstItem !== undefined) {
        return new Set([firstItem]);
      }
    }

    return new Set(defaultExpanded);
  };

  // Component state
  const state: AccordionState = {
    expandedItems: getInitialExpanded(),
    focusedItem: null,
  };

  // Create main container
  const container = document.createElement('div') as unknown as AccordionElement;
  container.className = buildContainerClasses();

  if (id) {
    container.id = id;
  }

  // Item elements map for quick access
  const itemElements = new Map<
    string,
    {
      wrapper: HTMLDivElement;
      header: HTMLButtonElement;
      content: HTMLDivElement;
    }
  >();

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-accordion', `dos-accordion--${variant}`];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Create a single accordion item
   */
  function createAccordionItem(item: AccordionItemProps, index: number): HTMLDivElement {
    const isExpanded = state.expandedItems.has(item.id);

    // Item wrapper
    const wrapper = document.createElement('div');
    wrapper.className = buildItemClasses(item, isExpanded);
    wrapper.setAttribute('data-accordion-item', item.id);

    // Header button
    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'dos-accordion__header';
    header.id = `${id ?? 'accordion'}-header-${item.id}`;
    header.setAttribute('aria-expanded', String(isExpanded));
    header.setAttribute('aria-controls', `${id ?? 'accordion'}-content-${item.id}`);

    if (item.disabled) {
      header.setAttribute('aria-disabled', 'true');
      header.disabled = true;
    }

    // Icon element
    const iconSpan = document.createElement('span');
    iconSpan.className = 'dos-accordion__icon';
    iconSpan.textContent = isExpanded ? expandedIcon : collapsedIcon;
    iconSpan.setAttribute('aria-hidden', 'true');
    header.appendChild(iconSpan);

    // Custom icon (if provided)
    if (item.icon) {
      const customIcon = document.createElement('span');
      customIcon.className = 'dos-accordion__custom-icon';
      customIcon.textContent = item.icon;
      customIcon.setAttribute('aria-hidden', 'true');
      header.appendChild(customIcon);
    }

    // Title element
    const titleSpan = document.createElement('span');
    titleSpan.className = 'dos-accordion__title';
    titleSpan.textContent = item.title;
    header.appendChild(titleSpan);

    // Content region
    const content = document.createElement('div');
    content.className = 'dos-accordion__content';
    content.id = `${id ?? 'accordion'}-content-${item.id}`;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', `${id ?? 'accordion'}-header-${item.id}`);

    if (!isExpanded) {
      content.hidden = true;
    }

    // Render content
    renderItemContent(content, item);

    // Event handlers
    header.addEventListener('click', () => handleItemClick(item.id));
    header.addEventListener('keydown', (e) => handleItemKeyDown(e, item.id, index));

    // Assemble item
    wrapper.appendChild(header);
    wrapper.appendChild(content);

    // Store references
    itemElements.set(item.id, { wrapper, header, content });

    return wrapper;
  }

  /**
   * Build item class string
   */
  function buildItemClasses(item: AccordionItemProps, isExpanded: boolean): string {
    const classes = ['dos-accordion__item'];
    if (isExpanded) {
      classes.push('dos-accordion__item--expanded');
    }
    if (item.disabled) {
      classes.push('dos-accordion__item--disabled');
    }
    return classes.join(' ');
  }

  /**
   * Render item content
   */
  function renderItemContent(contentEl: HTMLDivElement, item: AccordionItemProps): void {
    const contentInner = document.createElement('div');
    contentInner.className = 'dos-accordion__content-inner';

    if (typeof item.content === 'string') {
      contentInner.textContent = item.content;
    } else if (typeof item.content === 'function') {
      contentInner.appendChild(item.content());
    } else {
      contentInner.appendChild(item.content);
    }

    contentEl.appendChild(contentInner);
  }

  /**
   * Handle item header click
   */
  function handleItemClick(itemId: string): void {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    toggleItem(itemId);
  }

  /**
   * Handle keyboard navigation
   */
  function handleItemKeyDown(event: KeyboardEvent, itemId: string, _index: number): void {
    const enabledItems = items.filter((i) => !i.disabled);
    const currentEnabledIndex = enabledItems.findIndex((i) => i.id === itemId);

    let nextItemId: string | null = null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextItemId = getNextEnabledItem(enabledItems, currentEnabledIndex, 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        nextItemId = getNextEnabledItem(enabledItems, currentEnabledIndex, -1);
        break;

      case 'Home':
        event.preventDefault();
        nextItemId = enabledItems[0]?.id ?? null;
        break;

      case 'End':
        event.preventDefault();
        nextItemId = enabledItems[enabledItems.length - 1]?.id ?? null;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleItem(itemId);
        break;
    }

    if (nextItemId) {
      focusItem(nextItemId);
    }
  }

  /**
   * Get next enabled item in direction
   */
  function getNextEnabledItem(
    enabledItems: AccordionItemProps[],
    currentIndex: number,
    direction: 1 | -1
  ): string | null {
    if (enabledItems.length === 0) return null;

    let nextIndex = currentIndex + direction;

    // Wrap around
    if (nextIndex < 0) {
      nextIndex = enabledItems.length - 1;
    } else if (nextIndex >= enabledItems.length) {
      nextIndex = 0;
    }

    return enabledItems[nextIndex]?.id ?? null;
  }

  /**
   * Focus an item's header
   */
  function focusItem(itemId: string): void {
    const itemEl = itemElements.get(itemId);
    if (itemEl) {
      itemEl.header.focus();
      state.focusedItem = itemId;
    }
  }

  /**
   * Toggle an item's expanded state
   */
  function toggleItem(itemId: string): void {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    const isCurrentlyExpanded = state.expandedItems.has(itemId);
    const willBeExpanded = !isCurrentlyExpanded;

    // Check if we can collapse
    if (!willBeExpanded && !allowAllCollapsed && state.expandedItems.size === 1) {
      return;
    }

    // In single mode, collapse others when expanding
    if (mode === 'single' && willBeExpanded) {
      state.expandedItems.forEach((id) => {
        if (id !== itemId) {
          setItemExpanded(id, false);
        }
      });
      state.expandedItems.clear();
    }

    // Set the item's state
    setItemExpanded(itemId, willBeExpanded);

    if (willBeExpanded) {
      state.expandedItems.add(itemId);
    } else {
      state.expandedItems.delete(itemId);
    }

    // Dispatch events
    dispatchToggleEvent(itemId, willBeExpanded);

    // Callbacks
    if (onToggle) {
      onToggle(itemId, willBeExpanded);
    }

    if (onChange) {
      onChange(Array.from(state.expandedItems));
    }
  }

  /**
   * Set an item's expanded state (DOM updates)
   */
  function setItemExpanded(itemId: string, expanded: boolean): void {
    const itemEl = itemElements.get(itemId);
    if (!itemEl) return;

    const { wrapper, header, content } = itemEl;

    // Update wrapper classes
    wrapper.classList.toggle('dos-accordion__item--expanded', expanded);

    // Update header
    header.setAttribute('aria-expanded', String(expanded));

    // Update icon
    const iconSpan = header.querySelector('.dos-accordion__icon');
    if (iconSpan) {
      iconSpan.textContent = expanded ? expandedIcon : collapsedIcon;
    }

    // Update content visibility
    content.hidden = !expanded;
  }

  /**
   * Dispatch custom toggle event
   */
  function dispatchToggleEvent(itemId: string, expanded: boolean): void {
    const event = new CustomEvent<AccordionToggleEventDetail>('dos:accordion:toggle', {
      bubbles: true,
      detail: {
        itemId,
        expanded,
        expandedItems: Array.from(state.expandedItems),
      },
    });
    container.dispatchEvent(event);
  }

  /**
   * Render all accordion items
   */
  function render(): void {
    container.innerHTML = '';
    itemElements.clear();

    items.forEach((item, index) => {
      const itemEl = createAccordionItem(item, index);
      container.appendChild(itemEl);
    });
  }

  // Initial render
  render();

  // Public API methods
  container.getExpandedItems = (): string[] => Array.from(state.expandedItems);

  container.isExpanded = (itemId: string): boolean => state.expandedItems.has(itemId);

  container.expand = (itemId: string): void => {
    if (!state.expandedItems.has(itemId)) {
      toggleItem(itemId);
    }
  };

  container.collapse = (itemId: string): void => {
    if (state.expandedItems.has(itemId)) {
      toggleItem(itemId);
    }
  };

  container.toggle = (itemId: string): void => {
    toggleItem(itemId);
  };

  container.expandAll = (): void => {
    if (mode === 'single') {
      // In single mode, only expand first enabled
      const firstEnabled = items.find((i) => !i.disabled);
      if (firstEnabled && !state.expandedItems.has(firstEnabled.id)) {
        toggleItem(firstEnabled.id);
      }
    } else {
      items.forEach((item) => {
        if (!item.disabled && !state.expandedItems.has(item.id)) {
          setItemExpanded(item.id, true);
          state.expandedItems.add(item.id);
        }
      });
      if (onChange) {
        onChange(Array.from(state.expandedItems));
      }
    }
  };

  container.collapseAll = (): void => {
    if (!allowAllCollapsed && state.expandedItems.size > 0) {
      // Keep one item expanded
      const firstExpanded = Array.from(state.expandedItems)[0];
      state.expandedItems.forEach((id) => {
        if (id !== firstExpanded) {
          setItemExpanded(id, false);
          state.expandedItems.delete(id);
        }
      });
    } else {
      state.expandedItems.forEach((id) => {
        setItemExpanded(id, false);
      });
      state.expandedItems.clear();
    }
    if (onChange) {
      onChange(Array.from(state.expandedItems));
    }
  };

  container.enableItem = (itemId: string): void => {
    const itemIndex = items.findIndex((i) => i.id === itemId);
    const itemEl = itemElements.get(itemId);
    const item = items[itemIndex];

    if (itemIndex !== -1 && itemEl && item) {
      item.disabled = false;
      itemEl.wrapper.classList.remove('dos-accordion__item--disabled');
      itemEl.header.disabled = false;
      itemEl.header.removeAttribute('aria-disabled');
    }
  };

  container.disableItem = (itemId: string): void => {
    const itemIndex = items.findIndex((i) => i.id === itemId);
    const itemEl = itemElements.get(itemId);
    const item = items[itemIndex];

    if (itemIndex !== -1 && itemEl && item) {
      item.disabled = true;
      itemEl.wrapper.classList.add('dos-accordion__item--disabled');
      itemEl.header.disabled = true;
      itemEl.header.setAttribute('aria-disabled', 'true');
    }
  };

  container.getItems = (): AccordionItemProps[] => [...items];

  container.setItems = (newItems: AccordionItemProps[]): void => {
    items.length = 0;
    items.push(...newItems);

    // Reset expanded items to those that still exist
    const existingIds = new Set(newItems.map((i) => i.id));
    state.expandedItems.forEach((id) => {
      if (!existingIds.has(id)) {
        state.expandedItems.delete(id);
      }
    });

    // Add default expanded items
    newItems.forEach((item) => {
      if (item.defaultExpanded && !item.disabled) {
        if (mode === 'single' && state.expandedItems.size > 0) {
          return;
        }
        state.expandedItems.add(item.id);
      }
    });

    render();
  };

  container.focus = (): void => {
    const firstEnabled = items.find((i) => !i.disabled);
    if (firstEnabled) {
      focusItem(firstEnabled.id);
    }
  };

  container.destroy = (): void => {
    itemElements.forEach(({ header }) => {
      const clone = header.cloneNode(true);
      header.parentNode?.replaceChild(clone, header);
    });
    itemElements.clear();
  };

  return container;
}
