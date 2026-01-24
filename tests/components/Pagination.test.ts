/**
 * @fileoverview Tests for the Pagination component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPagination } from '../../src/components/Pagination';

describe('Pagination', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('renders with basic props', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      expect(pagination.classList.contains('dos-pagination')).toBe(true);
    });

    it('renders correct number of page buttons for small page count', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      expect(pageButtons.length).toBe(5);
    });

    it('renders first/last buttons by default', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      expect(buttons.length).toBe(4); // first, prev, next, last
    });

    it('hides first/last buttons when showFirstLast is false', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5, showFirstLast: false });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      expect(buttons.length).toBe(2); // prev, next only
    });

    it('hides prev/next buttons when showPrevNext is false', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5, showPrevNext: false });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      expect(buttons.length).toBe(2); // first, last only
    });

    it('hides all nav buttons when both options are false', () => {
      const pagination = createPagination({
        currentPage: 1,
        totalPages: 5,
        showFirstLast: false,
        showPrevNext: false,
      });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      expect(buttons.length).toBe(0);
    });

    it('applies custom className', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5, className: 'my-class' });
      expect(pagination.classList.contains('my-class')).toBe(true);
    });

    it('applies custom id', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5, id: 'my-pagination' });
      expect(pagination.id).toBe('my-pagination');
    });
  });

  describe('current page highlighting', () => {
    it('highlights the current page', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      container.appendChild(pagination);

      const currentPage = pagination.querySelector('.dos-pagination__page--current');
      expect(currentPage).not.toBeNull();
      expect(currentPage?.textContent).toBe('3');
    });

    it('sets aria-current on current page', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      container.appendChild(pagination);

      const currentPage = pagination.querySelector('.dos-pagination__page--current');
      expect(currentPage?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('ellipsis', () => {
    it('shows ellipsis for large page counts', () => {
      const pagination = createPagination({ currentPage: 5, totalPages: 20 });
      container.appendChild(pagination);

      const ellipsis = pagination.querySelectorAll('.dos-pagination__ellipsis');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('shows left ellipsis when current page is near the end', () => {
      const pagination = createPagination({ currentPage: 18, totalPages: 20, siblingCount: 1, boundaryCount: 1 });
      container.appendChild(pagination);

      const ellipsis = pagination.querySelectorAll('.dos-pagination__ellipsis');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('shows both ellipses when current page is in the middle', () => {
      const pagination = createPagination({ currentPage: 10, totalPages: 20, siblingCount: 1, boundaryCount: 1 });
      container.appendChild(pagination);

      const ellipsis = pagination.querySelectorAll('.dos-pagination__ellipsis');
      expect(ellipsis.length).toBe(2);
    });

    it('does not show ellipsis when pages fit', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      container.appendChild(pagination);

      const ellipsis = pagination.querySelectorAll('.dos-pagination__ellipsis');
      expect(ellipsis.length).toBe(0);
    });
  });

  describe('button states', () => {
    it('disables first/prev buttons on first page', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const firstBtn = buttons[0] as HTMLButtonElement;
      const prevBtn = buttons[1] as HTMLButtonElement;

      expect(firstBtn.disabled).toBe(true);
      expect(prevBtn.disabled).toBe(true);
    });

    it('disables next/last buttons on last page', () => {
      const pagination = createPagination({ currentPage: 5, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const nextBtn = buttons[2] as HTMLButtonElement;
      const lastBtn = buttons[3] as HTMLButtonElement;

      expect(nextBtn.disabled).toBe(true);
      expect(lastBtn.disabled).toBe(true);
    });

    it('enables all buttons in the middle', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      buttons.forEach((btn) => {
        expect((btn as HTMLButtonElement).disabled).toBe(false);
      });
    });
  });

  describe('interaction', () => {
    it('calls onChange when page is clicked', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 1, totalPages: 5, onChange });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      (pageButtons[2] as HTMLElement).click(); // Click page 3

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange when next button is clicked', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 2, totalPages: 5, onChange });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const nextBtn = buttons[2] as HTMLElement; // next button
      nextBtn.click();

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange when prev button is clicked', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const prevBtn = buttons[1] as HTMLElement; // prev button
      prevBtn.click();

      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('calls onChange when first button is clicked', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const firstBtn = buttons[0] as HTMLElement;
      firstBtn.click();

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('calls onChange when last button is clicked', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      const lastBtn = buttons[3] as HTMLElement;
      lastBtn.click();

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('does not call onChange when clicking current page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const currentPage = pagination.querySelector('.dos-pagination__page--current') as HTMLElement;
      currentPage.click();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 1, totalPages: 5, onChange, disabled: true });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      (pageButtons[2] as HTMLElement).click();

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('navigates to next page with ArrowRight', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 2, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('navigates to previous page with ArrowLeft', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('navigates to first page with Home', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('navigates to last page with End', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('does not navigate past first page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 1, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not navigate past last page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 5, totalPages: 5, onChange });
      container.appendChild(pagination);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      pagination.dispatchEvent(event);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('public API', () => {
    it('setPage changes the current page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 1, totalPages: 5, onChange });
      container.appendChild(pagination);

      pagination.setPage(4);

      expect(onChange).toHaveBeenCalledWith(4);
      expect(pagination.getPage()).toBe(4);
    });

    it('setPage clamps to valid range', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      pagination.setPage(10);
      expect(pagination.getPage()).toBe(5);

      pagination.setPage(0);
      expect(pagination.getPage()).toBe(1);
    });

    it('getPage returns current page', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      expect(pagination.getPage()).toBe(3);
    });

    it('setTotalPages changes total pages', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      pagination.setTotalPages(10);

      expect(pagination.getTotalPages()).toBe(10);
    });

    it('setTotalPages clamps current page if needed', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 5, totalPages: 5, onChange });
      container.appendChild(pagination);

      pagination.setTotalPages(3);

      expect(pagination.getPage()).toBe(3);
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('nextPage goes to next page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 2, totalPages: 5, onChange });

      pagination.nextPage();

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('previousPage goes to previous page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });

      pagination.previousPage();

      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('firstPage goes to first page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });

      pagination.firstPage();

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('lastPage goes to last page', () => {
      const onChange = vi.fn();
      const pagination = createPagination({ currentPage: 3, totalPages: 5, onChange });

      pagination.lastPage();

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('setDisabled toggles disabled state', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      pagination.setDisabled(true);

      expect(pagination.isDisabled()).toBe(true);
      expect(pagination.classList.contains('dos-pagination--disabled')).toBe(true);
    });

    it('destroy cleans up the pagination', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      pagination.destroy();

      expect(pagination.innerHTML).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has navigation role', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      expect(pagination.getAttribute('role')).toBe('navigation');
    });

    it('has aria-label', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      expect(pagination.getAttribute('aria-label')).toBe('Pagination');
    });

    it('buttons have aria-label', () => {
      const pagination = createPagination({ currentPage: 3, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-label')).not.toBeNull();
      });
    });

    it('page buttons have aria-label', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      pageButtons.forEach((btn) => {
        expect(btn.getAttribute('aria-label')).not.toBeNull();
      });
    });

    it('ellipsis is hidden from screen readers', () => {
      const pagination = createPagination({ currentPage: 10, totalPages: 20 });
      container.appendChild(pagination);

      const ellipsis = pagination.querySelectorAll('.dos-pagination__ellipsis');
      ellipsis.forEach((el) => {
        expect(el.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('disabled buttons have aria-disabled', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 5 });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button:disabled');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('edge cases', () => {
    it('handles totalPages of 1', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 1 });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      expect(pageButtons.length).toBe(1);
    });

    it('handles totalPages of 0', () => {
      const pagination = createPagination({ currentPage: 1, totalPages: 0 });
      container.appendChild(pagination);

      const pageButtons = pagination.querySelectorAll('.dos-pagination__page');
      expect(pageButtons.length).toBe(0);
    });

    it('handles currentPage greater than totalPages', () => {
      const pagination = createPagination({ currentPage: 10, totalPages: 5 });
      container.appendChild(pagination);

      expect(pagination.getPage()).toBe(5);
    });

    it('handles currentPage less than 1', () => {
      const pagination = createPagination({ currentPage: 0, totalPages: 5 });
      container.appendChild(pagination);

      expect(pagination.getPage()).toBe(1);
    });

    it('handles custom labels', () => {
      const pagination = createPagination({
        currentPage: 1,
        totalPages: 5,
        labels: {
          first: '<<',
          previous: '<',
          next: '>',
          last: '>>',
        },
      });
      container.appendChild(pagination);

      const buttons = pagination.querySelectorAll('.dos-pagination__button');
      expect(buttons[0].textContent).toBe('<<');
      expect(buttons[1].textContent).toBe('<');
      expect(buttons[2].textContent).toBe('>');
      expect(buttons[3].textContent).toBe('>>');
    });
  });
});
