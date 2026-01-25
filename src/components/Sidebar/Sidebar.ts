/**
 * @fileoverview DOS-style Sidebar navigation component.
 * @description Provides a navigation sidebar with collapsible sections,
 * keyboard navigation, and full ARIA accessibility support.
 */

import type { SidebarProps, SidebarItem, SidebarElement } from './Sidebar.types';
import './Sidebar.css';

/**
 * Creates a DOS-style sidebar navigation component.
 *
 * @param props - Configuration options for the sidebar
 * @returns An HTMLElement representing the sidebar with extended methods
 *
 * @example
 * ```ts
 * const sidebar = createSidebar({
 *   items: [
 *     { id: 'home', label: 'Home', icon: '■' },
 *     {
 *       id: 'settings',
 *       label: 'Settings',
 *       items: [
 *         { id: 'general', label: 'General' },
 *         { id: 'display', label: 'Display' }
 *       ]
 *     }
 *   ],
 *   activeItem: 'home',
 *   onSelect: (item) => console.log('Selected:', item.id)
 * });
 * document.body.appendChild(sidebar);
 * ```
 */
export function createSidebar(props: SidebarProps): SidebarElement {
  const {
    items,
    activeItem = null,
    collapsible = true,
    collapsed = false,
    width = '200px',
    position = 'left',
    onSelect,
    onToggle,
    onCollapseChange,
    className = '',
    id,
  } = props;

  // Internal state
  let currentItems = [...items];
  let currentActiveItem: string | null = activeItem;
  let isCollapsed = collapsed;
  const sectionStates: Map<string, boolean> = new Map();

  // Initialize section states from items
  function initSectionStates(itemList: SidebarItem[]): void {
    for (const item of itemList) {
      if (item.items && item.items.length > 0) {
        sectionStates.set(item.id, item.expanded !== false);
        initSectionStates(item.items);
      }
    }
  }
  initSectionStates(currentItems);

  // Create the nav element
  const nav = document.createElement('nav') as SidebarElement;
  nav.className = `dos-sidebar${position === 'right' ? ' dos-sidebar--right' : ''}${isCollapsed ? ' dos-sidebar--collapsed' : ''}${className ? ` ${className}` : ''}`;
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Sidebar navigation');

  if (id) {
    nav.id = id;
  }

  // Set width
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  nav.style.width = isCollapsed ? '' : widthValue;

  // Track focusable elements for keyboard navigation
  let focusableElements: HTMLElement[] = [];

  /**
   * Creates a single sidebar item element.
   */
  function createItemElement(item: SidebarItem, isTopLevel: boolean = false, isNested: boolean = false): HTMLElement {
    const element = document.createElement('button');
    element.className = 'dos-sidebar__item';
    element.setAttribute('type', 'button');
    element.setAttribute('data-id', item.id);

    if (isTopLevel) {
      element.classList.add('dos-sidebar__item--top-level');
    }
    if (isNested) {
      element.classList.add('dos-sidebar__item--nested');
    }
    if (item.disabled) {
      element.classList.add('dos-sidebar__item--disabled');
      element.setAttribute('aria-disabled', 'true');
      element.tabIndex = -1;
    } else {
      element.tabIndex = 0;
    }
    if (currentActiveItem === item.id) {
      element.classList.add('dos-sidebar__item--active');
      element.setAttribute('aria-current', 'page');
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-sidebar__item-icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      element.appendChild(icon);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'dos-sidebar__item-label';
    label.textContent = item.label;
    element.appendChild(label);

    // Click handler
    if (!item.disabled) {
      element.addEventListener('click', () => {
        selectItem(item);
      });
    }

    return element;
  }

  /**
   * Creates a section with header and collapsible content.
   */
  function createSectionElement(item: SidebarItem): HTMLElement {
    const section = document.createElement('div');
    section.className = 'dos-sidebar__section';
    section.setAttribute('data-section-id', item.id);

    const isExpanded = sectionStates.get(item.id) !== false;
    if (!isExpanded) {
      section.classList.add('dos-sidebar__section--collapsed');
    }

    // Section header
    const header = document.createElement('button');
    header.className = 'dos-sidebar__section-header';
    header.setAttribute('type', 'button');
    header.setAttribute('aria-expanded', String(isExpanded));
    header.setAttribute('data-section-id', item.id);
    header.tabIndex = 0;

    // Toggle indicator
    const toggle = document.createElement('span');
    toggle.className = 'dos-sidebar__section-toggle';
    toggle.textContent = isExpanded ? '▼' : '▶';
    toggle.setAttribute('aria-hidden', 'true');
    header.appendChild(toggle);

    // Section icon (if provided)
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-sidebar__item-icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      header.appendChild(icon);
    }

    // Section label
    const label = document.createElement('span');
    label.className = 'dos-sidebar__section-label';
    label.textContent = item.label;
    header.appendChild(label);

    // Click handler for toggling
    if (collapsible) {
      header.addEventListener('click', () => {
        toggleSectionById(item.id);
      });
    }

    section.appendChild(header);

    // Section content (children)
    const content = document.createElement('div');
    content.className = 'dos-sidebar__section-content';
    content.setAttribute('role', 'group');
    content.setAttribute('aria-labelledby', `sidebar-section-${item.id}`);
    header.id = `sidebar-section-${item.id}`;

    if (item.items) {
      for (const childItem of item.items) {
        if (childItem.items && childItem.items.length > 0) {
          // Nested section
          content.appendChild(createSectionElement(childItem));
        } else {
          content.appendChild(createItemElement(childItem, false, false));
        }
      }
    }

    section.appendChild(content);

    return section;
  }

  /**
   * Renders all items into the sidebar.
   */
  function render(): void {
    nav.innerHTML = '';
    focusableElements = [];

    for (const item of currentItems) {
      if (item.items && item.items.length > 0) {
        nav.appendChild(createSectionElement(item));
      } else {
        nav.appendChild(createItemElement(item, true));
      }
    }

    // Update focusable elements list
    updateFocusableElements();
  }

  /**
   * Updates the list of focusable elements for keyboard navigation.
   */
  function updateFocusableElements(): void {
    focusableElements = Array.from(
      nav.querySelectorAll<HTMLElement>(
        '.dos-sidebar__item:not(.dos-sidebar__item--disabled), .dos-sidebar__section-header'
      )
    ).filter((el) => {
      // Check if the element is visible (not in a collapsed section)
      let parent = el.parentElement;
      while (parent && parent !== nav) {
        if (parent.classList.contains('dos-sidebar__section-content')) {
          const section = parent.parentElement;
          if (section?.classList.contains('dos-sidebar__section--collapsed')) {
            return false;
          }
        }
        parent = parent.parentElement;
      }
      return true;
    });
  }

  /**
   * Selects an item and calls the onSelect callback.
   */
  function selectItem(item: SidebarItem): void {
    currentActiveItem = item.id;

    // Update active state in DOM
    const allItems = nav.querySelectorAll('.dos-sidebar__item');
    allItems.forEach((el) => {
      el.classList.remove('dos-sidebar__item--active');
      el.removeAttribute('aria-current');
    });

    const activeEl = nav.querySelector(`[data-id="${item.id}"]`);
    if (activeEl) {
      activeEl.classList.add('dos-sidebar__item--active');
      activeEl.setAttribute('aria-current', 'page');
    }

    onSelect?.(item);
  }

  /**
   * Toggles a section by ID.
   */
  function toggleSectionById(sectionId: string): void {
    const currentState = sectionStates.get(sectionId);
    const newState = currentState === false ? true : !currentState;
    sectionStates.set(sectionId, newState);

    // Find the section element and update it
    const section = nav.querySelector(`[data-section-id="${sectionId}"].dos-sidebar__section`);
    const header = nav.querySelector(`.dos-sidebar__section-header[data-section-id="${sectionId}"]`);

    if (section) {
      if (newState) {
        section.classList.remove('dos-sidebar__section--collapsed');
      } else {
        section.classList.add('dos-sidebar__section--collapsed');
      }
    }

    if (header) {
      header.setAttribute('aria-expanded', String(newState));
      const toggle = header.querySelector('.dos-sidebar__section-toggle');
      if (toggle) {
        toggle.textContent = newState ? '▼' : '▶';
      }
    }

    // Update focusable elements list
    updateFocusableElements();

    // Find the item and call callback
    const item = findItemById(currentItems, sectionId);
    if (item) {
      onToggle?.(item, newState);
    }
  }

  /**
   * Finds an item by ID in the items tree.
   */
  function findItemById(itemList: SidebarItem[], id: string): SidebarItem | null {
    for (const item of itemList) {
      if (item.id === id) {
        return item;
      }
      if (item.items) {
        const found = findItemById(item.items, id);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Keyboard navigation handler.
   */
  function handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const isItem = target.classList.contains('dos-sidebar__item');
    const isHeader = target.classList.contains('dos-sidebar__section-header');

    if (!isItem && !isHeader) return;

    updateFocusableElements();
    const currentIndex = focusableElements.indexOf(target);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < focusableElements.length - 1) {
          const nextElement = focusableElements[currentIndex + 1];
          if (nextElement) {
            nextElement.focus();
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          const prevElement = focusableElements[currentIndex - 1];
          if (prevElement) {
            prevElement.focus();
          }
        }
        break;

      case 'ArrowRight':
        if (isHeader && collapsible) {
          const sectionId = target.getAttribute('data-section-id');
          if (sectionId && sectionStates.get(sectionId) === false) {
            event.preventDefault();
            toggleSectionById(sectionId);
          }
        }
        break;

      case 'ArrowLeft':
        if (isHeader && collapsible) {
          const sectionId = target.getAttribute('data-section-id');
          if (sectionId && sectionStates.get(sectionId) !== false) {
            event.preventDefault();
            toggleSectionById(sectionId);
          }
        }
        break;

      case 'Enter':
      case ' ':
        if (isHeader) {
          event.preventDefault();
          const sectionId = target.getAttribute('data-section-id');
          if (sectionId && collapsible) {
            toggleSectionById(sectionId);
          }
        } else if (isItem) {
          event.preventDefault();
          const itemId = target.getAttribute('data-id');
          if (itemId) {
            const item = findItemById(currentItems, itemId);
            if (item && !item.disabled) {
              selectItem(item);
            }
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          if (firstElement) {
            firstElement.focus();
          }
        }
        break;

      case 'End':
        event.preventDefault();
        if (focusableElements.length > 0) {
          const lastElement = focusableElements[focusableElements.length - 1];
          if (lastElement) {
            lastElement.focus();
          }
        }
        break;
    }
  }

  // Add keyboard event listener
  nav.addEventListener('keydown', handleKeyDown);

  // Public methods
  nav.setActiveItem = (id: string | null): void => {
    if (id === null) {
      currentActiveItem = null;
      const allItems = nav.querySelectorAll('.dos-sidebar__item');
      allItems.forEach((el) => {
        el.classList.remove('dos-sidebar__item--active');
        el.removeAttribute('aria-current');
      });
    } else {
      const item = findItemById(currentItems, id);
      if (item) {
        selectItem(item);
      }
    }
  };

  nav.getActiveItem = (): string | null => {
    return currentActiveItem;
  };

  nav.expandSection = (id: string): void => {
    if (sectionStates.get(id) === false) {
      toggleSectionById(id);
    }
  };

  nav.collapseSection = (id: string): void => {
    if (sectionStates.get(id) !== false) {
      toggleSectionById(id);
    }
  };

  nav.toggleSection = (id: string): void => {
    toggleSectionById(id);
  };

  nav.setCollapsed = (newCollapsed: boolean): void => {
    isCollapsed = newCollapsed;
    if (isCollapsed) {
      nav.classList.add('dos-sidebar--collapsed');
      nav.style.width = '';
    } else {
      nav.classList.remove('dos-sidebar--collapsed');
      nav.style.width = widthValue;
    }
    onCollapseChange?.(isCollapsed);
  };

  nav.isCollapsed = (): boolean => {
    return isCollapsed;
  };

  nav.setItems = (newItems: SidebarItem[]): void => {
    currentItems = [...newItems];
    sectionStates.clear();
    initSectionStates(currentItems);
    render();
  };

  nav.destroy = (): void => {
    nav.removeEventListener('keydown', handleKeyDown);
    nav.innerHTML = '';
  };

  // Initial render
  render();

  return nav;
}
