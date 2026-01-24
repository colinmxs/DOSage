/**
 * @fileoverview DOS-style Pagination component.
 * @description Provides page navigation with ellipsis support,
 * keyboard navigation, and full ARIA accessibility support.
 */

import type { PaginationProps, PaginationElement } from './Pagination.types';
import './Pagination.css';

/**
 * Creates a DOS-style pagination component.
 *
 * @param props - Configuration options for the pagination
 * @returns An HTMLElement representing the pagination with extended methods
 *
 * @example
 * ```ts
 * const pagination = createPagination({
 *   currentPage: 1,
 *   totalPages: 10,
 *   onChange: (page) => console.log('Go to page:', page)
 * });
 * document.body.appendChild(pagination);
 * ```
 */
export function createPagination(props: PaginationProps): PaginationElement {
  const {
    currentPage,
    totalPages,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstLast = true,
    showPrevNext = true,
    onChange,
    disabled = false,
    labels = {},
    className = '',
    id,
  } = props;

  // Internal state
  let page = Math.max(1, Math.min(currentPage, totalPages));
  let pages = totalPages;
  let isDisabled = disabled;

  // Default labels
  const defaultLabels = {
    first: '|<',
    previous: '<',
    next: '>',
    last: '>|',
    page: (p: number) => String(p),
    ...labels,
  };

  // Create the nav element
  const nav = document.createElement('nav') as PaginationElement;
  nav.className = `dos-pagination${isDisabled ? ' dos-pagination--disabled' : ''}${className ? ` ${className}` : ''}`;
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Pagination');

  if (id) {
    nav.id = id;
  }

  /**
   * Calculates which page numbers to display.
   * Returns an array of page numbers and null for ellipsis.
   */
  function getPageNumbers(): (number | null)[] {
    if (pages <= 0) return [];

    const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3; // +3 for current, and 2 ellipsis
    
    // If total pages fit without ellipsis
    if (pages <= totalNumbers) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(page + siblingCount, pages - boundaryCount);

    const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
    const showRightEllipsis = rightSiblingIndex < pages - boundaryCount - 1;

    const result: (number | null)[] = [];

    // Left boundary pages
    for (let i = 1; i <= boundaryCount; i++) {
      result.push(i);
    }

    // Left ellipsis
    if (showLeftEllipsis) {
      result.push(null);
    } else {
      // Fill in pages between boundary and siblings
      for (let i = boundaryCount + 1; i < leftSiblingIndex; i++) {
        result.push(i);
      }
    }

    // Sibling pages and current
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      result.push(i);
    }

    // Right ellipsis
    if (showRightEllipsis) {
      result.push(null);
    } else {
      // Fill in pages between siblings and right boundary
      for (let i = rightSiblingIndex + 1; i <= pages - boundaryCount; i++) {
        result.push(i);
      }
    }

    // Right boundary pages
    for (let i = pages - boundaryCount + 1; i <= pages; i++) {
      result.push(i);
    }

    // Remove duplicates while preserving order and nulls
    const seen = new Set<number>();
    const filtered: (number | null)[] = [];
    for (const item of result) {
      if (item === null) {
        filtered.push(null);
      } else if (!seen.has(item)) {
        seen.add(item);
        filtered.push(item);
      }
    }

    return filtered;
  }

  /**
   * Creates a navigation button (first, prev, next, last).
   */
  function createNavButton(
    label: string,
    ariaLabel: string,
    targetPage: number,
    isDisabledBtn: boolean
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'dos-pagination__button';
    button.textContent = label;
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', ariaLabel);
    button.disabled = isDisabledBtn || isDisabled;

    if (isDisabledBtn) {
      button.setAttribute('aria-disabled', 'true');
    }

    button.addEventListener('click', () => {
      if (!button.disabled) {
        goToPage(targetPage);
      }
    });

    return button;
  }

  /**
   * Creates a page number button.
   */
  function createPageButton(pageNum: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `dos-pagination__page${pageNum === page ? ' dos-pagination__page--current' : ''}`;
    button.textContent = defaultLabels.page(pageNum);
    button.setAttribute('type', 'button');
    button.disabled = isDisabled;

    if (pageNum === page) {
      button.setAttribute('aria-current', 'page');
      button.setAttribute('aria-label', `Page ${pageNum}, current page`);
    } else {
      button.setAttribute('aria-label', `Go to page ${pageNum}`);
    }

    button.addEventListener('click', () => {
      if (!button.disabled && pageNum !== page) {
        goToPage(pageNum);
      }
    });

    return button;
  }

  /**
   * Creates an ellipsis element.
   */
  function createEllipsis(): HTMLSpanElement {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'dos-pagination__ellipsis';
    ellipsis.textContent = '...';
    ellipsis.setAttribute('aria-hidden', 'true');
    return ellipsis;
  }

  /**
   * Goes to a specific page.
   */
  function goToPage(newPage: number): void {
    const clampedPage = Math.max(1, Math.min(newPage, pages));
    if (clampedPage !== page) {
      page = clampedPage;
      onChange?.(page);
      render();
    }
  }

  /**
   * Renders the pagination.
   */
  function render(): void {
    nav.innerHTML = '';

    if (pages <= 0) return;

    // First button
    if (showFirstLast) {
      nav.appendChild(createNavButton(defaultLabels.first, 'Go to first page', 1, page === 1));
    }

    // Previous button
    if (showPrevNext) {
      nav.appendChild(createNavButton(defaultLabels.previous, 'Go to previous page', page - 1, page === 1));
    }

    // Page numbers
    const pageNumbers = getPageNumbers();
    pageNumbers.forEach((pageNum) => {
      if (pageNum === null) {
        nav.appendChild(createEllipsis());
      } else {
        nav.appendChild(createPageButton(pageNum));
      }
    });

    // Next button
    if (showPrevNext) {
      nav.appendChild(createNavButton(defaultLabels.next, 'Go to next page', page + 1, page === pages));
    }

    // Last button
    if (showFirstLast) {
      nav.appendChild(createNavButton(defaultLabels.last, 'Go to last page', pages, page === pages));
    }

    // Update disabled class
    if (isDisabled) {
      nav.classList.add('dos-pagination--disabled');
    } else {
      nav.classList.remove('dos-pagination--disabled');
    }
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent): void {
    if (isDisabled) return;

    switch (event.key) {
      case 'ArrowLeft':
        if (page > 1) {
          event.preventDefault();
          goToPage(page - 1);
        }
        break;
      case 'ArrowRight':
        if (page < pages) {
          event.preventDefault();
          goToPage(page + 1);
        }
        break;
      case 'Home':
        if (page !== 1) {
          event.preventDefault();
          goToPage(1);
        }
        break;
      case 'End':
        if (page !== pages) {
          event.preventDefault();
          goToPage(pages);
        }
        break;
    }
  }

  nav.addEventListener('keydown', handleKeyDown);

  // Public methods
  nav.setPage = (newPage: number): void => {
    goToPage(newPage);
  };

  nav.getPage = (): number => {
    return page;
  };

  nav.setTotalPages = (newTotalPages: number): void => {
    pages = Math.max(0, newTotalPages);
    // Clamp current page if needed
    if (page > pages) {
      page = Math.max(1, pages);
      onChange?.(page);
    }
    render();
  };

  nav.getTotalPages = (): number => {
    return pages;
  };

  nav.nextPage = (): void => {
    if (page < pages) {
      goToPage(page + 1);
    }
  };

  nav.previousPage = (): void => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  nav.firstPage = (): void => {
    goToPage(1);
  };

  nav.lastPage = (): void => {
    goToPage(pages);
  };

  nav.setDisabled = (newDisabled: boolean): void => {
    isDisabled = newDisabled;
    render();
  };

  nav.isDisabled = (): boolean => {
    return isDisabled;
  };

  nav.destroy = (): void => {
    nav.removeEventListener('keydown', handleKeyDown);
    nav.innerHTML = '';
  };

  // Initial render
  render();

  return nav;
}
