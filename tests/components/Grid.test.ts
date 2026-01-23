/**
 * Grid Component Tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createGrid, createGridItem } from '../../src/components/Grid';

describe('Grid', () => {
  let grid: HTMLElement | null = null;

  afterEach(() => {
    if (grid && grid.parentNode) {
      grid.remove();
    }
    grid = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      grid = createGrid();

      expect(grid).toBeInstanceOf(HTMLElement);
      expect(grid.tagName).toBe('DIV');
      expect(grid.classList.contains('dos-grid')).toBe(true);
    });

    it('applies default column (1)', () => {
      grid = createGrid();

      expect(grid.style.gridTemplateColumns).toBe('repeat(1, 1fr)');
    });

    it('applies custom className', () => {
      grid = createGrid({ className: 'my-grid' });

      expect(grid.classList.contains('dos-grid')).toBe(true);
      expect(grid.classList.contains('my-grid')).toBe(true);
    });

    it('applies custom id', () => {
      grid = createGrid({ id: 'my-grid' });

      expect(grid.id).toBe('my-grid');
    });
  });

  describe('columns', () => {
    it('applies numeric columns', () => {
      grid = createGrid({ columns: 3 });

      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('applies string columns value', () => {
      grid = createGrid({ columns: '1fr 2fr 1fr' });

      expect(grid.style.gridTemplateColumns).toBe('1fr 2fr 1fr');
    });
  });

  describe('rows', () => {
    it('does not set rows by default', () => {
      grid = createGrid();

      expect(grid.style.gridTemplateRows).toBe('');
    });

    it('applies numeric rows', () => {
      grid = createGrid({ rows: 2 });

      expect(grid.style.gridTemplateRows).toBe('repeat(2, 1fr)');
    });

    it('applies string rows value', () => {
      grid = createGrid({ rows: 'auto 1fr auto' });

      expect(grid.style.gridTemplateRows).toBe('auto 1fr auto');
    });
  });

  describe('gap', () => {
    it('applies default gap (md)', () => {
      grid = createGrid();

      expect(grid.classList.contains('dos-grid--gap-md')).toBe(true);
    });

    it('applies preset gap values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        grid = createGrid({ gap: preset });
        expect(grid.classList.contains(`dos-grid--gap-${preset}`)).toBe(true);
      });
    });

    it('applies numeric gap as inline style', () => {
      grid = createGrid({ gap: 20 });

      expect(grid.style.gap).toBe('20px');
    });

    it('applies row/column gap separately', () => {
      grid = createGrid({ gap: { row: 'lg', column: 'sm' } });

      expect(grid.classList.contains('dos-grid--row-gap-lg')).toBe(true);
      expect(grid.classList.contains('dos-grid--column-gap-sm')).toBe(true);
    });
  });

  describe('alignment', () => {
    it('applies default alignment (stretch)', () => {
      grid = createGrid();

      expect(grid.classList.contains('dos-grid--align-stretch')).toBe(true);
      expect(grid.classList.contains('dos-grid--justify-stretch')).toBe(true);
    });

    it('applies alignItems', () => {
      grid = createGrid({ alignItems: 'center' });

      expect(grid.classList.contains('dos-grid--align-center')).toBe(true);
    });

    it('applies justifyItems', () => {
      grid = createGrid({ justifyItems: 'start' });

      expect(grid.classList.contains('dos-grid--justify-start')).toBe(true);
    });
  });
});

describe('GridItem', () => {
  let item: HTMLElement | null = null;

  afterEach(() => {
    if (item && item.parentNode) {
      item.remove();
    }
    item = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      item = createGridItem();

      expect(item).toBeInstanceOf(HTMLElement);
      expect(item.tagName).toBe('DIV');
      expect(item.classList.contains('dos-grid__item')).toBe(true);
    });

    it('applies custom className', () => {
      item = createGridItem({ className: 'my-item' });

      expect(item.classList.contains('dos-grid__item')).toBe(true);
      expect(item.classList.contains('my-item')).toBe(true);
    });

    it('applies custom id', () => {
      item = createGridItem({ id: 'my-item' });

      expect(item.id).toBe('my-item');
    });
  });

  describe('positioning', () => {
    it('applies column position', () => {
      item = createGridItem({ column: 2 });

      expect(item.style.gridColumn).toBe('2');
    });

    it('applies column string value', () => {
      item = createGridItem({ column: '1 / 3' });

      expect(item.style.gridColumn).toBe('1 / 3');
    });

    it('applies row position', () => {
      item = createGridItem({ row: 3 });

      expect(item.style.gridRow).toBe('3');
    });

    it('applies row string value', () => {
      item = createGridItem({ row: '2 / span 2' });

      expect(item.style.gridRow).toBe('2 / span 2');
    });
  });

  describe('spanning', () => {
    it('applies colSpan', () => {
      item = createGridItem({ colSpan: 2 });

      expect(item.style.gridColumn).toBe('span 2');
    });

    it('applies rowSpan', () => {
      item = createGridItem({ rowSpan: 3 });

      expect(item.style.gridRow).toBe('span 3');
    });

    it('column prop takes precedence over colSpan', () => {
      item = createGridItem({ column: 1, colSpan: 2 });

      expect(item.style.gridColumn).toBe('1');
    });
  });
});
