import { describe, it, expect } from 'vitest';
import { createDefinitionList } from '../../src/components/DefinitionList/DefinitionList';

describe('DefinitionList', () => {
  it('renders dl, dt, dd structure', () => {
    const dl = createDefinitionList({
      items: [{ term: 'Term', definition: 'Definition' }],
    });
    expect(dl.tagName).toBe('DL');
    expect(dl.querySelector('dt')).toBeTruthy();
    expect(dl.querySelector('dd')).toBeTruthy();
  });

  it('stacked layout works', () => {
    const dl = createDefinitionList({
      items: [{ term: 'Term', definition: 'Definition' }],
      layout: 'stacked',
    });
    expect(dl.className).toContain('dos-definition-list--stacked');
  });

  it('inline layout works', () => {
    const dl = createDefinitionList({
      items: [{ term: 'Term', definition: 'Definition' }],
      layout: 'inline',
    });
    expect(dl.className).toContain('dos-definition-list--inline');
  });
});
