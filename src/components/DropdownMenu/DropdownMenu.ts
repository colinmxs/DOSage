/**
 * DropdownMenu Component
 *
 * A DOS-style dropdown menu with submenus, icons, shortcuts, and full keyboard navigation.
 * 
 * ┌─────────────────────┐
 * │ New         Ctrl+N  │
 * │ Open        Ctrl+O  │
 * ├─────────────────────┤
 * │ Save        Ctrl+S  │
 * │ Save As...          │
 * ├─────────────────────┤
 * │ Exit        Alt+F4  │
 * └─────────────────────┘
 */

import type {
  DropdownMenuProps,
  DropdownMenuElement,
  DropdownMenuItem,
  DropdownPosition,
} from './DropdownMenu.types';
import './DropdownMenu.css';

// Unique ID counter for dropdown menus
let dropdownIdCounter = 0;

/**
 * Generates a unique ID for dropdown menu elements
 */
function generateDropdownId(): string {
  return `dos-dropdown-${++dropdownIdCounter}`;
}

/**
 * Deep clones menu items to prevent mutation of original data
 */
function deepCloneItems(items: DropdownMenuItem[]): DropdownMenuItem[] {
  return items.map((item): DropdownMenuItem => {
    const cloned: DropdownMenuItem = { ...item };
    if (item.items) {
      cloned.items = deepCloneItems(item.items);
    }
    return cloned;
  });
}

/**
 * Builds CSS classes for the dropdown menu
 */
function buildDropdownClasses(position: DropdownPosition, isOpen: boolean, className?: string): string {
  const classes = ['dos-dropdown-menu'];
  
  if (isOpen) {
    classes.push('dos-dropdown-menu--open');
  }
  
  classes.push(`dos-dropdown-menu--${position}`);
  
  if (className) {
    classes.push(className);
  }
  
  return classes.join(' ');
}

/**
 * Creates a DOS-style dropdown menu element.
 *
 * @param props - DropdownMenu configuration options
 * @returns The dropdown menu element with methods
 *
 * @example
 * ```typescript
 * import { createDropdownMenu } from 'dosage';
 *
 * const dropdown = createDropdownMenu({
 *   items: [
 *     { label: 'New', shortcut: 'Ctrl+N', action: () => console.log('New') },
 *     { label: 'Open', shortcut: 'Ctrl+O', action: () => console.log('Open') },
 *     { divider: true },
 *     { label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Save') },
 *     { label: 'Save As...', action: () => console.log('Save As') },
 *     { divider: true },
 *     { label: 'Export', items: [
 *       { label: 'As PDF', action: () => console.log('PDF') },
 *       { label: 'As HTML', action: () => console.log('HTML') }
 *     ]},
 *     { divider: true },
 *     { label: 'Exit', shortcut: 'Alt+F4', action: () => console.log('Exit') }
 *   ],
 *   trigger: document.getElementById('menu-button'),
 *   onSelect: (item, path) => console.log('Selected:', path.join(' > '))
 * });
 *
 * document.body.appendChild(dropdown);
 * ```
 */
export function createDropdownMenu(props: DropdownMenuProps): DropdownMenuElement {
  const {
    items: initialItems,
    open: initialOpen = false,
    trigger,
    position: initialPosition = 'bottom-start',
    onSelect,
    onOpen,
    onClose,
    className,
    id,
  } = props;

  // Generate unique ID
  const dropdownId = id ?? generateDropdownId();

  // Internal state
  let items = deepCloneItems(initialItems);
  let isOpen = initialOpen;
  let position = initialPosition;
  let activeSubmenuStack: HTMLElement[] = [];
  let triggerElement: HTMLElement | null = null;

  // Create dropdown menu element - we'll attach methods below
  const dropdown = document.createElement('ul') as unknown as DropdownMenuElement;
  dropdown.className = buildDropdownClasses(position, isOpen, className);
  dropdown.id = dropdownId;
  dropdown.setAttribute('role', 'menu');
  dropdown.setAttribute('tabindex', '-1');

  // Resolve trigger element
  if (trigger) {
    if (typeof trigger === 'string') {
      triggerElement = document.querySelector(trigger);
    } else {
      triggerElement = trigger;
    }
  }

  // Set up trigger if provided
  if (triggerElement) {
    triggerElement.setAttribute('aria-haspopup', 'menu');
    triggerElement.setAttribute('aria-expanded', String(isOpen));
    triggerElement.setAttribute('aria-controls', dropdownId);

    triggerElement.addEventListener('click', handleTriggerClick);
    triggerElement.addEventListener('keydown', handleTriggerKeydown);
  }

  // Global event listeners
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleGlobalKeydown);

  /**
   * Render the menu items
   */
  function render(): void {
    dropdown.innerHTML = '';

    items.forEach((item, index) => {
      if (item.divider) {
        const divider = document.createElement('li');
        divider.className = 'dos-dropdown-menu__divider';
        divider.setAttribute('role', 'separator');
        dropdown.appendChild(divider);
      } else {
        const menuItem = createMenuItem(item, index, []);
        dropdown.appendChild(menuItem);
      }
    });
  }

  /**
   * Create a menu item element
   */
  function createMenuItem(
    item: DropdownMenuItem,
    index: number,
    path: string[]
  ): HTMLElement {
    const li = document.createElement('li');
    li.className = 'dos-dropdown-menu__item';
    li.setAttribute('role', 'none');
    li.setAttribute('data-index', String(index));

    const button = document.createElement('button');
    button.className = 'dos-dropdown-menu__trigger';
    button.setAttribute('role', 'menuitem');
    button.setAttribute('tabindex', '-1');

    if (item.disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.classList.add('dos-dropdown-menu__trigger--disabled');
    }

    const hasSubmenu = item.items && item.items.length > 0;
    if (hasSubmenu) {
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-dropdown-menu__icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      button.appendChild(icon);
    } else {
      // Add spacer for alignment when other items have icons
      const spacer = document.createElement('span');
      spacer.className = 'dos-dropdown-menu__icon dos-dropdown-menu__icon--spacer';
      spacer.setAttribute('aria-hidden', 'true');
      button.appendChild(spacer);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'dos-dropdown-menu__label';
    label.textContent = item.label;
    button.appendChild(label);

    // Shortcut
    if (item.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'dos-dropdown-menu__shortcut';
      shortcut.textContent = item.shortcut;
      shortcut.setAttribute('aria-hidden', 'true');
      button.appendChild(shortcut);
    }

    // Submenu arrow
    if (hasSubmenu) {
      const arrow = document.createElement('span');
      arrow.className = 'dos-dropdown-menu__submenu-arrow';
      arrow.textContent = '▶';
      arrow.setAttribute('aria-hidden', 'true');
      button.appendChild(arrow);
    }

    // Event handlers
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.disabled) return;

      if (hasSubmenu) {
        toggleSubmenu(li, item.items!, [...path, item.label]);
      } else {
        selectItem(item, [...path, item.label]);
      }
    });

    button.addEventListener('mouseenter', () => {
      // Highlight this item
      highlightItem(li);

      // Auto-open submenu on hover
      if (hasSubmenu && !item.disabled) {
        openSubmenu(li, item.items!, [...path, item.label]);
      } else {
        // Close any open submenus at this level
        closeSubmenusAt(li);
      }
    });

    button.addEventListener('keydown', (e) => {
      handleItemKeydown(e, li, item, path);
    });

    li.appendChild(button);
    return li;
  }

  /**
   * Handle trigger element click
   */
  function handleTriggerClick(e: Event): void {
    e.stopPropagation();
    toggleDropdown();
  }

  /**
   * Handle trigger element keydown
   */
  function handleTriggerKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        openDropdown();
        focusFirstItem();
        break;
      case 'ArrowUp':
        e.preventDefault();
        openDropdown();
        focusLastItem();
        break;
    }
  }

  /**
   * Handle clicks outside the dropdown
   */
  function handleOutsideClick(e: Event): void {
    if (!isOpen) return;

    const target = e.target as Node;
    if (!dropdown.contains(target) && target !== triggerElement && !triggerElement?.contains(target)) {
      closeDropdown();
    }
  }

  /**
   * Handle global keydown events
   */
  function handleGlobalKeydown(e: KeyboardEvent): void {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        triggerElement?.focus();
        break;
    }
  }

  /**
   * Handle keydown on menu items
   */
  function handleItemKeydown(
    e: KeyboardEvent,
    li: HTMLElement,
    item: DropdownMenuItem,
    path: string[]
  ): void {
    const hasSubmenu = item.items && item.items.length > 0;
    const isInSubmenu = li.closest('.dos-dropdown-menu__submenu') !== null;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (item.disabled) return;
        
        if (hasSubmenu) {
          openSubmenu(li, item.items!, [...path, item.label]);
          focusFirstSubmenuItem(li);
        } else {
          selectItem(item, [...path, item.label]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        focusNextItem(li);
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusPreviousItem(li);
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (hasSubmenu && !item.disabled) {
          openSubmenu(li, item.items!, [...path, item.label]);
          focusFirstSubmenuItem(li);
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (isInSubmenu) {
          closeSubmenu(li);
        }
        break;

      case 'Home':
        e.preventDefault();
        focusFirstItem();
        break;

      case 'End':
        e.preventDefault();
        focusLastItem();
        break;

      case 'Tab':
        // Close dropdown and let tab work naturally
        closeDropdown();
        break;

      default:
        // Type-ahead: jump to item starting with typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          const char = e.key.toLowerCase();
          focusItemStartingWith(char, li.parentElement!);
        }
        break;
    }
  }

  /**
   * Toggle dropdown open/close
   */
  function toggleDropdown(): void {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Open the dropdown
   */
  function openDropdown(): void {
    if (isOpen) return;

    isOpen = true;
    dropdown.classList.add('dos-dropdown-menu--open');
    triggerElement?.setAttribute('aria-expanded', 'true');
    onOpen?.();
    
    // Position dropdown relative to trigger
    if (triggerElement) {
      positionDropdown();
    }
  }

  /**
   * Close the dropdown
   */
  function closeDropdown(): void {
    if (!isOpen) return;

    isOpen = false;
    dropdown.classList.remove('dos-dropdown-menu--open');
    triggerElement?.setAttribute('aria-expanded', 'false');
    
    // Close all submenus
    closeAllSubmenus();
    
    onClose?.();
  }

  /**
   * Position the dropdown relative to its trigger
   */
  function positionDropdown(): void {
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Reset any inline positioning
    dropdown.style.removeProperty('top');
    dropdown.style.removeProperty('bottom');
    dropdown.style.removeProperty('left');
    dropdown.style.removeProperty('right');
    dropdown.style.removeProperty('transform');

    // Calculate position based on preference and available space
    let top: number;
    let left: number;

    switch (position) {
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        top = triggerRect.bottom;
        
        // Check if there's room below
        if (top + dropdownRect.height > viewportHeight && triggerRect.top > dropdownRect.height) {
          top = triggerRect.top - dropdownRect.height;
        }
        break;

      case 'right':
      case 'right-start':
      case 'right-end':
        left = triggerRect.right;
        
        // Check if there's room to the right
        if (left + dropdownRect.width > viewportWidth && triggerRect.left > dropdownRect.width) {
          left = triggerRect.left - dropdownRect.width;
        }
        break;

      default:
        top = triggerRect.bottom;
        break;
    }

    // Apply position
    if (position.startsWith('bottom')) {
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${top!}px`;
      
      if (position === 'bottom-start') {
        dropdown.style.left = `${triggerRect.left}px`;
      } else if (position === 'bottom-end') {
        dropdown.style.left = `${triggerRect.right - dropdownRect.width}px`;
      } else {
        dropdown.style.left = `${triggerRect.left + (triggerRect.width - dropdownRect.width) / 2}px`;
      }
    } else if (position.startsWith('right')) {
      dropdown.style.position = 'fixed';
      dropdown.style.left = `${left!}px`;
      
      if (position === 'right-start') {
        dropdown.style.top = `${triggerRect.top}px`;
      } else if (position === 'right-end') {
        dropdown.style.top = `${triggerRect.bottom - dropdownRect.height}px`;
      } else {
        dropdown.style.top = `${triggerRect.top + (triggerRect.height - dropdownRect.height) / 2}px`;
      }
    }
  }

  /**
   * Highlight a menu item
   */
  function highlightItem(li: HTMLElement): void {
    // Remove highlight from siblings
    const parent = li.parentElement;
    if (parent) {
      parent.querySelectorAll('.dos-dropdown-menu__trigger').forEach((trigger) => {
        trigger.classList.remove('dos-dropdown-menu__trigger--highlighted');
      });
    }

    // Add highlight to this item
    const trigger = li.querySelector('.dos-dropdown-menu__trigger');
    trigger?.classList.add('dos-dropdown-menu__trigger--highlighted');
  }

  /**
   * Focus the first item in the dropdown
   */
  function focusFirstItem(): void {
    const firstItem = dropdown.querySelector(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    ) as HTMLElement;
    firstItem?.focus();
  }

  /**
   * Focus the last item in the dropdown
   */
  function focusLastItem(): void {
    const items = dropdown.querySelectorAll(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    );
    const lastItem = items[items.length - 1] as HTMLElement;
    lastItem?.focus();
  }

  /**
   * Focus the next item
   */
  function focusNextItem(currentLi: HTMLElement): void {
    const parent = currentLi.parentElement!;
    const items = Array.from(parent.querySelectorAll(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    )) as HTMLElement[];
    
    const currentTrigger = currentLi.querySelector('.dos-dropdown-menu__trigger');
    const currentIndex = items.indexOf(currentTrigger as HTMLElement);
    
    if (currentIndex < items.length - 1) {
      const nextItem = items[currentIndex + 1];
      if (nextItem) nextItem.focus();
    } else {
      const firstItem = items[0];
      if (firstItem) firstItem.focus(); // Wrap to first
    }
  }

  /**
   * Focus the previous item
   */
  function focusPreviousItem(currentLi: HTMLElement): void {
    const parent = currentLi.parentElement!;
    const items = Array.from(parent.querySelectorAll(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    )) as HTMLElement[];
    
    const currentTrigger = currentLi.querySelector('.dos-dropdown-menu__trigger');
    const currentIndex = items.indexOf(currentTrigger as HTMLElement);
    
    if (currentIndex > 0) {
      const prevItem = items[currentIndex - 1];
      if (prevItem) prevItem.focus();
    } else {
      const lastItem = items[items.length - 1];
      if (lastItem) lastItem.focus(); // Wrap to last
    }
  }

  /**
   * Focus item starting with a specific character (type-ahead)
   */
  function focusItemStartingWith(char: string, container: HTMLElement): void {
    const items = Array.from(container.querySelectorAll(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    )) as HTMLElement[];
    
    const currentFocused = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(currentFocused);
    
    // Start searching from the item after the current one
    const startIndex = currentIndex + 1;
    
    for (let i = 0; i < items.length; i++) {
      const index = (startIndex + i) % items.length;
      const item = items[index];
      if (item) {
        const label = item.querySelector('.dos-dropdown-menu__label')?.textContent || '';
        
        if (label.toLowerCase().startsWith(char)) {
          item.focus();
          return;
        }
      }
    }
  }

  /**
   * Focus the first item in a submenu
   */
  function focusFirstSubmenuItem(parentLi: HTMLElement): void {
    const submenu = parentLi.querySelector('.dos-dropdown-menu__submenu');
    const firstItem = submenu?.querySelector(
      '.dos-dropdown-menu__item:not([role="separator"]) .dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)'
    ) as HTMLElement;
    firstItem?.focus();
  }

  /**
   * Toggle a submenu
   */
  function toggleSubmenu(parentLi: HTMLElement, subItems: DropdownMenuItem[], path: string[]): void {
    const existingSubmenu = parentLi.querySelector('.dos-dropdown-menu__submenu');
    if (existingSubmenu) {
      closeSubmenusAt(parentLi);
    } else {
      openSubmenu(parentLi, subItems, path);
    }
  }

  /**
   * Open a submenu
   */
  function openSubmenu(parentLi: HTMLElement, subItems: DropdownMenuItem[], path: string[]): void {
    // Close any existing submenus at this level
    closeSubmenusAt(parentLi);

    const button = parentLi.querySelector('.dos-dropdown-menu__trigger');
    button?.setAttribute('aria-expanded', 'true');

    const submenu = document.createElement('ul');
    submenu.className = 'dos-dropdown-menu__submenu';
    submenu.setAttribute('role', 'menu');

    subItems.forEach((subItem, index) => {
      if (subItem.divider) {
        const divider = document.createElement('li');
        divider.className = 'dos-dropdown-menu__divider';
        divider.setAttribute('role', 'separator');
        submenu.appendChild(divider);
      } else {
        const menuItem = createMenuItem(subItem, index, path);
        submenu.appendChild(menuItem);
      }
    });

    parentLi.appendChild(submenu);
    activeSubmenuStack.push(submenu);

    // Check viewport bounds and flip if needed
    const rect = parentLi.getBoundingClientRect();
    const submenuRect = submenu.getBoundingClientRect();
    
    if (rect.right + submenuRect.width > window.innerWidth) {
      submenu.classList.add('dos-dropdown-menu__submenu--left');
    }
  }

  /**
   * Close submenus at a specific level
   */
  function closeSubmenusAt(item: HTMLElement): void {
    const parent = item.parentElement;
    if (!parent) return;

    parent.querySelectorAll('.dos-dropdown-menu__submenu').forEach((submenu) => {
      const stackIndex = activeSubmenuStack.indexOf(submenu as HTMLElement);
      if (stackIndex !== -1) {
        activeSubmenuStack.splice(stackIndex, 1);
      }
      submenu.remove();
    });

    parent.querySelectorAll('.dos-dropdown-menu__trigger').forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Close a submenu and return focus to parent
   */
  function closeSubmenu(currentLi: HTMLElement): void {
    const submenu = currentLi.closest('.dos-dropdown-menu__submenu');
    if (!submenu) return;

    const parentLi = submenu.parentElement as HTMLElement;
    const parentTrigger = parentLi.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
    
    submenu.remove();
    const stackIndex = activeSubmenuStack.indexOf(submenu as HTMLElement);
    if (stackIndex !== -1) {
      activeSubmenuStack.splice(stackIndex, 1);
    }
    
    parentTrigger?.setAttribute('aria-expanded', 'false');
    parentTrigger?.focus();
  }

  /**
   * Close all submenus
   */
  function closeAllSubmenus(): void {
    dropdown.querySelectorAll('.dos-dropdown-menu__submenu').forEach((submenu) => submenu.remove());
    dropdown.querySelectorAll('.dos-dropdown-menu__trigger').forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });
    activeSubmenuStack = [];
  }

  /**
   * Select an item
   */
  function selectItem(item: DropdownMenuItem, path: string[]): void {
    item.action?.();
    onSelect?.(item, path);
    closeDropdown();
    triggerElement?.focus();
  }

  /**
   * Update items
   */
  function setItems(newItems: DropdownMenuItem[]): void {
    items = deepCloneItems(newItems);
    render();
  }

  /**
   * Update position
   */
  function setPosition(newPosition: DropdownPosition): void {
    dropdown.classList.remove(`dos-dropdown-menu--${position}`);
    position = newPosition;
    dropdown.classList.add(`dos-dropdown-menu--${position}`);
    
    if (isOpen && triggerElement) {
      positionDropdown();
    }
  }

  /**
   * Set item disabled state by path
   */
  function setItemDisabled(path: string[], disabled: boolean): void {
    let currentItems = items;
    
    for (let i = 0; i < path.length; i++) {
      const label = path[i];
      const item = currentItems.find((it) => it.label === label);
      
      if (!item) return;
      
      if (i === path.length - 1) {
        item.disabled = disabled;
      } else if (item.items) {
        currentItems = item.items;
      } else {
        return;
      }
    }
    
    render();
  }

  /**
   * Clean up event listeners and remove element
   */
  function destroy(): void {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleGlobalKeydown);
    
    if (triggerElement) {
      triggerElement.removeEventListener('click', handleTriggerClick);
      triggerElement.removeEventListener('keydown', handleTriggerKeydown);
      triggerElement.removeAttribute('aria-haspopup');
      triggerElement.removeAttribute('aria-expanded');
      triggerElement.removeAttribute('aria-controls');
    }
    
    dropdown.remove();
  }

  // Initial render
  render();

  // Attach methods to element
  dropdown.open = openDropdown;
  dropdown.close = closeDropdown;
  dropdown.toggle = toggleDropdown;
  dropdown.isOpen = () => isOpen;
  dropdown.setItems = setItems;
  dropdown.setPosition = setPosition;
  dropdown.setItemDisabled = setItemDisabled;
  dropdown.destroy = destroy;

  return dropdown;
}
