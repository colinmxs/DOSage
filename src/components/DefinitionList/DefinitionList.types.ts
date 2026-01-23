export type DefinitionListLayout = 'stacked' | 'inline';

export interface DefinitionItem {
  term: string;
  definition: string | HTMLElement;
}

export interface DefinitionListProps {
  items: DefinitionItem[];
  layout?: DefinitionListLayout;
  className?: string;
  id?: string;
}
