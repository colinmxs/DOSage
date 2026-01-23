import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createList } from '../../src/components/List/List';

describe('List', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders unordered list', () => {
    const list = createList({
      items: [{ content: 'Item 1' }, { content: 'Item 2' }],
      type: 'unordered',
    });
    expect(list.tagName).toBe('UL');
    expect(list.querySelectorAll('li').length).toBe(2);
  });

  it('renders ordered list', () => {
    const list = createList({
      items: [{ content: 'Item 1' }, { content: 'Item 2' }],
      type: 'ordered',
    });
    expect(list.tagName).toBe('OL');
  });

  it('custom bullet character works', () => {
    const list = createList({
      items: [{ content: 'Item 1' }],
      bullet: '►',
    });
    const bullet = list.querySelector('.dos-list___bullet');
    expect(bullet?.textContent).toBe('►');
  });

  it('nested lists render correctly', () => {
    const list = createList({
      items: [
        {
          content: 'Parent',
          children: [{ content: 'Child' }],
        },
      ],
    });
    const nestedLists = list.querySelectorAll('.dos-list--nested');
    expect(nestedLists.length).toBeGreaterThan(0);
  });
});
