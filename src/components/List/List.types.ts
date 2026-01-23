/**
 * List Component Types
 */

export type ListType = 'unordered' | 'ordered';

export interface ListItem {
  content: string | HTMLElement;
  children?: ListItem[];
}

export interface ListProps {
  items: ListItem[];
  type?: ListType;
  bullet?: string;
  nested?: boolean;
  className?: string;
  id?: string;
}
