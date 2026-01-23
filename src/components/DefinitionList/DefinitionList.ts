import type { DefinitionListProps } from './DefinitionList.types';
import './DefinitionList.css';

export function createDefinitionList(props: DefinitionListProps): HTMLDListElement {
  const { items, layout = 'stacked', className = '', id } = props;

  const dl = document.createElement('dl');
  dl.className = `dos-definition-list dos-definition-list--${layout}${className ? ' ' + className : ''}`;
  if (id) dl.id = id;

  items.forEach(item => {
    const dt = document.createElement('dt');
    dt.className = 'dos-definition-list___term';
    dt.textContent = item.term;
    
    const dd = document.createElement('dd');
    dd.className = 'dos-definition-list___definition';
    
    if (typeof item.definition === 'string') {
      dd.textContent = item.definition;
    } else {
      dd.appendChild(item.definition);
    }

    dl.appendChild(dt);
    dl.appendChild(dd);
  });

  return dl;
}
