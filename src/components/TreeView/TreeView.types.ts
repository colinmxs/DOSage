/**
 * TreeView Component Types
 *
 * TypeScript interfaces for the DOS-style hierarchical tree view.
 */

/**
 * Single tree node
 */
export interface TreeNode {
  /** Unique identifier for the node */
  id: string;

  /** Display label */
  label: string;

  /** Optional icon (default folder/file based on children) */
  icon?: string;

  /** Child nodes */
  children?: TreeNode[];

  /** Whether the node is disabled */
  disabled?: boolean;

  /** Custom data attached to the node */
  data?: Record<string, unknown>;
}

/**
 * TreeView component props
 */
export interface TreeViewProps {
  /** Tree nodes to display */
  nodes: TreeNode[];

  /** Enable node selection */
  selectable?: boolean;

  /** Allow multiple selection */
  multiSelect?: boolean;

  /** Currently selected node IDs */
  selectedNodes?: string[];

  /** Currently expanded node IDs */
  expandedNodes?: string[];

  /** Default expanded state: true for all, or array of node IDs */
  defaultExpanded?: boolean | string[];

  /** Callback when selection changes */
  onSelect?: (selectedNodes: TreeNode[]) => void;

  /** Callback when node is expanded or collapsed */
  onExpand?: (node: TreeNode, expanded: boolean) => void;

  /** Callback when node is clicked */
  onNodeClick?: (node: TreeNode) => void;

  /** Show expand/collapse icons for parent nodes */
  showExpandIcons?: boolean;

  /** Show file/folder icons */
  showIcons?: boolean;

  /** Custom folder icon when closed */
  folderIconClosed?: string;

  /** Custom folder icon when open */
  folderIconOpen?: string;

  /** Custom file icon */
  fileIcon?: string;

  /** Show connecting lines */
  showLines?: boolean;

  /** Additional class name */
  className?: string;

  /** Component ID */
  id?: string;

  /** Accessible label for the tree */
  'aria-label'?: string;
}

/**
 * Flat representation of a tree node for internal use
 */
export interface FlatTreeNode {
  /** Original node */
  node: TreeNode;

  /** Nesting level (0-based) */
  level: number;

  /** Parent node ID */
  parentId: string | null;

  /** Whether node has children */
  hasChildren: boolean;

  /** Whether this is the last child of its parent */
  isLastChild: boolean;

  /** Array of booleans indicating whether to show vertical line at each level */
  lineGuides: boolean[];
}

/**
 * TreeView instance methods
 */
export interface TreeViewInstance {
  /** The root DOM element */
  element: HTMLElement;

  /** Update the tree nodes */
  setNodes(nodes: TreeNode[]): void;

  /** Get current nodes */
  getNodes(): TreeNode[];

  /** Expand a node */
  expandNode(nodeId: string): void;

  /** Collapse a node */
  collapseNode(nodeId: string): void;

  /** Toggle expand/collapse */
  toggleNode(nodeId: string): void;

  /** Expand all nodes */
  expandAll(): void;

  /** Collapse all nodes */
  collapseAll(): void;

  /** Check if a node is expanded */
  isExpanded(nodeId: string): boolean;

  /** Select a node */
  selectNode(nodeId: string): void;

  /** Select multiple nodes */
  selectNodes(nodeIds: string[]): void;

  /** Deselect a node */
  deselectNode(nodeId: string): void;

  /** Clear all selection */
  clearSelection(): void;

  /** Get selected nodes */
  getSelectedNodes(): TreeNode[];

  /** Get selected node IDs */
  getSelectedIds(): string[];

  /** Check if a node is selected */
  isSelected(nodeId: string): boolean;

  /** Get a node by ID */
  getNodeById(nodeId: string): TreeNode | undefined;

  /** Focus the tree */
  focus(): void;

  /** Focus a specific node */
  focusNode(nodeId: string): void;

  /** Scroll a node into view */
  scrollToNode(nodeId: string): void;

  /** Destroy the component and clean up */
  destroy(): void;
}
