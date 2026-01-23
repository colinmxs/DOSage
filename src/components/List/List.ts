/**
 * List Component
 */

import type { ListProps, ListItem } from './List.types';
import './List.css';

export function createList(props: ListProps): HTMLElement {
  const {
    items,
    type = 'unordered',
    bullet = '■',
    nested = false,
    className = '',
    id,
  } = props;

  const listElement = type === 'ordered' 
    ? document.createElement('ol')
    : document.createElement('ul');

  const classes = ['dos-list', `dos-list--${type}`];
  if (nested) classes.push('dos-list--nested');
  if (className) classes.push(className);

  listElement.className = classes.join(' ');
  if (id) listElement.id = id;

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'dos-list___item';

    if (type === 'unordered') {
      const bulletSpan = document.createElement('span');
      bulletSpan.className = 'dos-list___bullet';
      bulletSpan.textContent = bullet;
      bulletSpan.setAttribute('aria-hidden', 'true');
      li.appendChild(bulletSpan);
    }

    const content = document.createElement('span');
    content.className = 'dos-list___content';
    
    if (typeof item.content === 'string') {
      content.textContent = item.content;
    } else {
      content.appendChild(item.content);
    }
    
    li.appendChild(content);

    if (item.children && item.children.length > 0) {
      const nestedList = createList({
        items: item.children,
        type,
        bullet,
        nested: true,
      });
      li.appendChild(nestedList);
    }

    listElement.appendChild(li);
  });

  return listElement;
}
