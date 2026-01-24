/**
 * @fileoverview DOS-style Breadcrumbs navigation component.
 * @description Provides a breadcrumb trail with customizable separators,
 * overflow handling, and full ARIA accessibility support.
 */

import type {
  BreadcrumbsProps,
  BreadcrumbItem,
  BreadcrumbsElement,
  BreadcrumbSeparator,
} from './Breadcrumbs.types';
import './Breadcrumbs.css';

/**
 * Creates a DOS-style breadcrumbs navigation component.
 *
 * @param props - Configuration options for the breadcrumbs
 * @returns An HTMLElement representing the breadcrumbs with extended methods
 *
 * @example
 * ```ts
 * const breadcrumbs = createBreadcrumbs({
 *   items: [
 *     { label: 'Home', href: '/' },
 *     { label: 'Documents', href: '/documents' },
 *     { label: 'Reports', href: '/documents/reports' },
 *     { label: 'Q4 Report' } // Current page - no href
 *   ],
 *   separator: '>',
 *   onSelect: (item, index) => console.log('Navigate to:', item.href)
 * });
 * document.body.appendChild(breadcrumbs);
 * ```
 */
export function createBreadcrumbs(props: BreadcrumbsProps): BreadcrumbsElement {
  const {
    items,
    separator = '>',
    maxItems,
    onSelect,
    ariaLabel = 'Breadcrumb',
    className = '',
    id,
  } = props;

  // Internal state
  let currentItems = [...items];
  let currentSeparator: BreadcrumbSeparator = separator;
  let currentMaxItems = maxItems;
  let isExpanded = false; // For collapsed state

  // Create the nav element
  const nav = document.createElement('nav') as BreadcrumbsElement;
  nav.className = `dos-breadcrumbs${className ? ` ${className}` : ''}`;
  nav.setAttribute('aria-label', ariaLabel);

  if (id) {
    nav.id = id;
  }

  /**
   * Creates a breadcrumb item element.
   */
  function createItemElement(item: BreadcrumbItem, index: number, isLast: boolean): HTMLElement {
    const isCurrent = isLast;
    const hasHref = Boolean(item.href) && !isCurrent;

    // Create element based on whether it's a link or not
    const element = hasHref
      ? document.createElement('a')
      : document.createElement('span');

    element.className = `dos-breadcrumbs__item${isCurrent ? ' dos-breadcrumbs__item--current' : ''}`;

    if (hasHref) {
      (element as HTMLAnchorElement).href = item.href!;
      element.addEventListener('click', (e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(item, index);
        }
      });
    }

    // Add icon if provided
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-breadcrumbs__item-icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      element.appendChild(icon);
    }

    // Add label
    const label = document.createElement('span');
    label.className = 'dos-breadcrumbs__item-label';
    label.textContent = item.label;
    element.appendChild(label);

    // ARIA for current page
    if (isCurrent) {
      element.setAttribute('aria-current', 'page');
    }

    return element;
  }

  /**
   * Creates a separator element.
   */
  function createSeparatorElement(): HTMLElement {
    const sep = document.createElement('span');
    sep.className = 'dos-breadcrumbs__separator';
    sep.textContent = ` ${currentSeparator} `;
    sep.setAttribute('aria-hidden', 'true');
    return sep;
  }

  /**
   * Creates an ellipsis element for collapsed items.
   */
  function createEllipsisElement(hiddenCount: number): HTMLElement {
    const ellipsis = document.createElement('button');
    ellipsis.className = 'dos-breadcrumbs__ellipsis';
    ellipsis.textContent = '...';
    ellipsis.setAttribute('type', 'button');
    ellipsis.setAttribute('aria-label', `Show ${hiddenCount} more items`);
    ellipsis.setAttribute('title', `${hiddenCount} items hidden`);

    ellipsis.addEventListener('click', () => {
      isExpanded = true;
      render();
    });

    return ellipsis;
  }

  /**
   * Calculates which items to show based on maxItems.
   * Returns { start: items[], hidden: items[], end: items[] }
   */
  function getVisibleItems(): {
    start: { item: BreadcrumbItem; originalIndex: number }[];
    hidden: { item: BreadcrumbItem; originalIndex: number }[];
    end: { item: BreadcrumbItem; originalIndex: number }[];
  } {
    const allItems = currentItems.map((item, index) => ({ item, originalIndex: index }));

    if (!currentMaxItems || currentItems.length <= currentMaxItems || isExpanded) {
      return { start: allItems, hidden: [], end: [] };
    }

    // Always show first item and last items
    // maxItems includes: first + ellipsis placeholder + last items
    const firstCount = 1;
    const lastCount = Math.max(1, currentMaxItems - 2); // At least show 1 at end
    const start = allItems.slice(0, firstCount);
    const end = allItems.slice(-lastCount);
    const hidden = allItems.slice(firstCount, -lastCount);

    return { start, hidden, end };
  }

  /**
   * Renders the breadcrumbs.
   */
  function render(): void {
    nav.innerHTML = '';

    const ol = document.createElement('ol');
    ol.className = 'dos-breadcrumbs__list';

    const { start, hidden, end } = getVisibleItems();

    // Render start items
    start.forEach(({ item, originalIndex }, i) => {
      const li = document.createElement('li');
      li.className = 'dos-breadcrumbs__list-item';

      const isLast = hidden.length === 0 && end.length === 0 && i === start.length - 1;
      li.appendChild(createItemElement(item, originalIndex, isLast && originalIndex === currentItems.length - 1));

      // Add separator if not the very last item
      if (!(hidden.length === 0 && end.length === 0 && i === start.length - 1)) {
        li.appendChild(createSeparatorElement());
      }

      ol.appendChild(li);
    });

    // Render ellipsis if there are hidden items
    if (hidden.length > 0) {
      const li = document.createElement('li');
      li.className = 'dos-breadcrumbs__list-item';
      li.appendChild(createEllipsisElement(hidden.length));
      li.appendChild(createSeparatorElement());
      ol.appendChild(li);
    }

    // Render end items
    end.forEach(({ item, originalIndex }, i) => {
      const li = document.createElement('li');
      li.className = 'dos-breadcrumbs__list-item';

      const isLast = i === end.length - 1;
      li.appendChild(createItemElement(item, originalIndex, isLast));

      // Add separator if not the last item
      if (!isLast) {
        li.appendChild(createSeparatorElement());
      }

      ol.appendChild(li);
    });

    nav.appendChild(ol);
  }

  // Public methods
  nav.setItems = (newItems: BreadcrumbItem[]): void => {
    currentItems = [...newItems];
    isExpanded = false;
    render();
  };

  nav.getItems = (): BreadcrumbItem[] => {
    return [...currentItems];
  };

  nav.setSeparator = (newSeparator: BreadcrumbSeparator): void => {
    currentSeparator = newSeparator;
    render();
  };

  nav.setMaxItems = (newMaxItems: number | undefined): void => {
    currentMaxItems = newMaxItems;
    isExpanded = false;
    render();
  };

  nav.destroy = (): void => {
    nav.innerHTML = '';
  };

  // Initial render
  render();

  return nav;
}
