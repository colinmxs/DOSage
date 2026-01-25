/**
 * TreeView Component
 *
 * DOS-style hierarchical tree view with expand/collapse, selection,
 * keyboard navigation, and ASCII connector lines.
 */

import type {
  TreeNode,
  TreeViewProps,
  TreeViewInstance,
  FlatTreeNode,
} from './TreeView.types';
import './TreeView.css';

/**
 * Creates a DOS-style TreeView component.
 *
 * @param props - TreeView configuration options
 * @returns TreeView instance with element and control methods
 *
 * @example
 * ```typescript
 * const tree = createTreeView({
 *   nodes: [
 *     {
 *       id: 'docs',
 *       label: 'Documents',
 *       children: [
 *         { id: 'readme', label: 'README.TXT' },
 *         { id: 'config', label: 'CONFIG.SYS' },
 *       ],
 *     },
 *   ],
 *   selectable: true,
 *   showLines: true,
 * });
 *
 * document.body.appendChild(tree.element);
 * ```
 */
export function createTreeView(props: TreeViewProps): TreeViewInstance {
  const {
    nodes: initialNodes = [],
    selectable = false,
    multiSelect = false,
    selectedNodes: initialSelectedNodes = [],
    expandedNodes: initialExpandedNodes,
    defaultExpanded = false,
    onSelect,
    onExpand,
    onNodeClick,
    showExpandIcons = true,
    showIcons = true,
    folderIconClosed = '[+]',
    folderIconOpen = '[-]',
    fileIcon = '[ ]',
    showLines = true,
    className = '',
    id,
  } = props;

  // State
  let nodes = [...initialNodes];
  let selectedIds = new Set<string>(initialSelectedNodes);
  let expandedIds = new Set<string>(
    initialExpandedNodes
      ? initialExpandedNodes
      : defaultExpanded === true
        ? getAllNodeIds(initialNodes)
        : Array.isArray(defaultExpanded)
          ? defaultExpanded
          : []
  );
  let focusedNodeId: string | null = null;

  // Node lookup map for quick access
  const nodeMap = new Map<string, TreeNode>();
  buildNodeMap(initialNodes);

  // Create container element
  const container = document.createElement('div');
  container.className = buildContainerClassName();
  if (id) container.id = id;
  if (className) container.classList.add(...className.split(' ').filter(Boolean));

  // Set ARIA attributes
  container.setAttribute('role', 'tree');
  container.setAttribute('tabindex', '0');
  container.setAttribute('aria-label', props['aria-label'] || 'Tree');
  if (multiSelect) {
    container.setAttribute('aria-multiselectable', 'true');
  }

  // Build class names
  function buildContainerClassName(): string {
    const classes = ['dos-tree-view'];
    if (!showLines) classes.push('dos-tree-view--no-lines');
    return classes.join(' ');
  }

  // Build flat node map for quick lookups
  function buildNodeMap(nodeList: TreeNode[]): void {
    nodeMap.clear();
    function traverse(list: TreeNode[]): void {
      for (const node of list) {
        nodeMap.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      }
    }
    traverse(nodeList);
  }

  // Get all node IDs (for defaultExpanded = true)
  function getAllNodeIds(nodeList: TreeNode[]): string[] {
    const ids: string[] = [];
    function traverse(list: TreeNode[]): void {
      for (const node of list) {
        ids.push(node.id);
        if (node.children) {
          traverse(node.children);
        }
      }
    }
    traverse(nodeList);
    return ids;
  }

  // Get visible flat list of nodes
  function getVisibleNodes(): FlatTreeNode[] {
    const visible: FlatTreeNode[] = [];

    function traverse(
      nodeList: TreeNode[],
      level: number,
      parentId: string | null,
      lineGuides: boolean[]
    ): void {
      nodeList.forEach((node, index) => {
        const isLastChild = index === nodeList.length - 1;
        const hasChildren = Boolean(node.children && node.children.length > 0);
        const isExpanded = expandedIds.has(node.id);

        visible.push({
          node,
          level,
          parentId,
          hasChildren,
          isLastChild,
          lineGuides: [...lineGuides],
        });

        // Recursively add children if expanded
        if (hasChildren && isExpanded && node.children) {
          const newLineGuides = [...lineGuides, !isLastChild];
          traverse(node.children, level + 1, node.id, newLineGuides);
        }
      });
    }

    traverse(nodes, 0, null, []);
    return visible;
  }

  // Render tree
  function renderTree(): void {
    container.innerHTML = '';

    if (nodes.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'dos-tree-view___empty';
      emptyEl.textContent = 'No items';
      emptyEl.setAttribute('role', 'presentation');
      container.appendChild(emptyEl);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'dos-tree-view___list';
    list.setAttribute('role', 'presentation');

    const visibleNodes = getVisibleNodes();
    visibleNodes.forEach((flatNode) => {
      const nodeEl = createNodeElement(flatNode);
      list.appendChild(nodeEl);
    });

    container.appendChild(list);
  }

  // Create individual node element
  function createNodeElement(flatNode: FlatTreeNode): HTMLElement {
    const { node, level, hasChildren, isLastChild, lineGuides } = flatNode;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedIds.has(node.id);
    const isFocused = focusedNodeId === node.id;

    const li = document.createElement('li');
    li.className = 'dos-tree-view___node';
    li.setAttribute('role', 'treeitem');
    li.setAttribute('data-id', node.id);
    li.setAttribute('aria-level', String(level + 1));
    li.setAttribute('tabindex', '-1');

    // Selected state
    if (isSelected) {
      li.classList.add('dos-tree-view___node--selected');
      li.setAttribute('aria-selected', 'true');
    } else if (selectable) {
      li.setAttribute('aria-selected', 'false');
    }

    // Expanded state
    if (hasChildren) {
      li.setAttribute('aria-expanded', String(isExpanded));
    }

    // Disabled state
    if (node.disabled) {
      li.classList.add('dos-tree-view___node--disabled');
      li.setAttribute('aria-disabled', 'true');
    }

    // Focused state
    if (isFocused) {
      li.classList.add('dos-tree-view___node--focused');
    }

    // Indentation and line guides
    if (showLines && level > 0) {
      const indent = document.createElement('span');
      indent.className = 'dos-tree-view___indent';
      indent.setAttribute('aria-hidden', 'true');

      // Add line guides for each level
      for (let i = 0; i < lineGuides.length; i++) {
        const guide = document.createElement('span');
        guide.className = lineGuides[i]
          ? 'dos-tree-view___line-cont'
          : 'dos-tree-view___line-space';
        indent.appendChild(guide);
      }

      // Add branch connector (├── or └──)
      const branch = document.createElement('span');
      branch.className = isLastChild
        ? 'dos-tree-view___line-end'
        : 'dos-tree-view___line-mid';
      indent.appendChild(branch);

      li.appendChild(indent);
    } else if (!showLines && level > 0) {
      // Simple indentation without lines
      const indent = document.createElement('span');
      indent.className = 'dos-tree-view___indent';
      indent.style.width = `${level * 16}px`;
      indent.setAttribute('aria-hidden', 'true');
      li.appendChild(indent);
    }

    // Expand/collapse toggle
    if (showExpandIcons) {
      const toggle = document.createElement('span');
      toggle.className = 'dos-tree-view___toggle';
      toggle.setAttribute('aria-hidden', 'true');

      if (hasChildren) {
        toggle.classList.add(
          isExpanded ? 'dos-tree-view___toggle--expanded' : 'dos-tree-view___toggle--collapsed'
        );
        toggle.textContent = isExpanded ? folderIconOpen : folderIconClosed;

        if (!node.disabled) {
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExpand(node.id);
          });
        }
      } else {
        toggle.classList.add('dos-tree-view___toggle--leaf');
        toggle.textContent = fileIcon;
      }

      li.appendChild(toggle);
    }

    // Node icon
    if (showIcons && node.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-tree-view___icon';
      icon.textContent = node.icon;
      icon.setAttribute('aria-hidden', 'true');
      li.appendChild(icon);
    }

    // Node label
    const label = document.createElement('span');
    label.className = 'dos-tree-view___label';
    label.textContent = node.label;
    li.appendChild(label);

    // Click handler
    li.addEventListener('click', () => handleNodeClick(node));

    return li;
  }

  // Handle node click
  function handleNodeClick(node: TreeNode): void {
    if (node.disabled) return;

    // Call click callback
    if (onNodeClick) {
      onNodeClick(node);
    }

    // Handle selection
    if (selectable) {
      if (multiSelect) {
        if (selectedIds.has(node.id)) {
          selectedIds.delete(node.id);
        } else {
          selectedIds.add(node.id);
        }
      } else {
        selectedIds.clear();
        selectedIds.add(node.id);
      }

      renderTree();

      if (onSelect) {
        onSelect(getSelectedNodes());
      }
    }

    // Update focus
    setFocusedNode(node.id);
  }

  // Toggle node expand/collapse
  function toggleExpand(nodeId: string): void {
    const node = nodeMap.get(nodeId);
    if (!node || !node.children || node.children.length === 0) return;

    if (expandedIds.has(nodeId)) {
      expandedIds.delete(nodeId);
      if (onExpand) onExpand(node, false);
    } else {
      expandedIds.add(nodeId);
      if (onExpand) onExpand(node, true);
    }

    renderTree();
  }

  // Set focused node
  function setFocusedNode(nodeId: string | null): void {
    focusedNodeId = nodeId;

    // Update visual focus
    const allNodes = container.querySelectorAll('.dos-tree-view___node');
    allNodes.forEach((el) => {
      el.classList.remove('dos-tree-view___node--focused');
    });

    if (nodeId) {
      const focusedEl = container.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
      if (focusedEl) {
        focusedEl.classList.add('dos-tree-view___node--focused');
        // Scroll into view (with check for jsdom compatibility)
        if (typeof focusedEl.scrollIntoView === 'function') {
          focusedEl.scrollIntoView({ block: 'nearest' });
        }
      }
      container.setAttribute('aria-activedescendant', `treeitem-${nodeId}`);
    } else {
      container.removeAttribute('aria-activedescendant');
    }
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent): void {
    const visibleNodes = getVisibleNodes();
    if (visibleNodes.length === 0) return;

    const currentIndex = focusedNodeId
      ? visibleNodes.findIndex((fn) => fn.node.id === focusedNodeId)
      : -1;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : findNextEnabledIndex(visibleNodes, currentIndex, 1);
        const nextNode = visibleNodes[nextIndex];
        if (nextIndex >= 0 && nextNode) {
          setFocusedNode(nextNode.node.id);
        }
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex =
          currentIndex < 0
            ? visibleNodes.length - 1
            : findNextEnabledIndex(visibleNodes, currentIndex, -1);
        const prevNode = visibleNodes[prevIndex];
        if (prevIndex >= 0 && prevNode) {
          setFocusedNode(prevNode.node.id);
        }
        break;
      }

      case 'ArrowRight': {
        event.preventDefault();
        if (currentIndex >= 0) {
          const flatNode = visibleNodes[currentIndex];
          if (flatNode && flatNode.hasChildren) {
            if (!expandedIds.has(flatNode.node.id)) {
              // Expand the node
              toggleExpand(flatNode.node.id);
            } else if (flatNode.node.children && flatNode.node.children.length > 0) {
              // Move to first child
              const firstChild = flatNode.node.children[0];
              if (firstChild && !firstChild.disabled) {
                setFocusedNode(firstChild.id);
              }
            }
          }
        }
        break;
      }

      case 'ArrowLeft': {
        event.preventDefault();
        if (currentIndex >= 0) {
          const flatNode = visibleNodes[currentIndex];
          if (flatNode && flatNode.hasChildren && expandedIds.has(flatNode.node.id)) {
            // Collapse the node
            toggleExpand(flatNode.node.id);
          } else if (flatNode && flatNode.parentId) {
            // Move to parent
            setFocusedNode(flatNode.parentId);
          }
        }
        break;
      }

      case 'Home': {
        event.preventDefault();
        const firstEnabled = findFirstEnabled(visibleNodes);
        const firstNode = visibleNodes[firstEnabled];
        if (firstEnabled >= 0 && firstNode) {
          setFocusedNode(firstNode.node.id);
        }
        break;
      }

      case 'End': {
        event.preventDefault();
        const lastEnabled = findLastEnabled(visibleNodes);
        const lastNode = visibleNodes[lastEnabled];
        if (lastEnabled >= 0 && lastNode) {
          setFocusedNode(lastNode.node.id);
        }
        break;
      }

      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (currentIndex >= 0) {
          const focusedFlatNode = visibleNodes[currentIndex];
          if (focusedFlatNode) {
            handleNodeClick(focusedFlatNode.node);
          }
        }
        break;
      }

      case '*': {
        // Expand all siblings
        event.preventDefault();
        if (currentIndex >= 0) {
          const flatNode = visibleNodes[currentIndex];
          if (flatNode) {
            const siblings = getSiblings(flatNode);
            siblings.forEach((sibling) => {
              if (sibling.children && sibling.children.length > 0) {
                expandedIds.add(sibling.id);
              }
            });
            renderTree();
          }
        }
        break;
      }

      default:
        // Type-ahead navigation
        if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
          const startIndex = currentIndex < 0 ? 0 : currentIndex + 1;
          const foundIndex = findNodeByFirstChar(visibleNodes, event.key, startIndex);
          const foundNode = visibleNodes[foundIndex];
          if (foundIndex >= 0 && foundNode) {
            setFocusedNode(foundNode.node.id);
          }
        }
        break;
    }
  }

  // Find next enabled index
  function findNextEnabledIndex(
    visibleNodes: FlatTreeNode[],
    startIndex: number,
    direction: 1 | -1
  ): number {
    let index = startIndex + direction;
    while (index >= 0 && index < visibleNodes.length) {
      const item = visibleNodes[index];
      if (item && !item.node.disabled) {
        return index;
      }
      index += direction;
    }
    return startIndex;
  }

  // Find first enabled node
  function findFirstEnabled(visibleNodes: FlatTreeNode[]): number {
    for (let i = 0; i < visibleNodes.length; i++) {
      const item = visibleNodes[i];
      if (item && !item.node.disabled) return i;
    }
    return -1;
  }

  // Find last enabled node
  function findLastEnabled(visibleNodes: FlatTreeNode[]): number {
    for (let i = visibleNodes.length - 1; i >= 0; i--) {
      const item = visibleNodes[i];
      if (item && !item.node.disabled) return i;
    }
    return -1;
  }

  // Find node by first character
  function findNodeByFirstChar(
    visibleNodes: FlatTreeNode[],
    char: string,
    startIndex: number
  ): number {
    const lowerChar = char.toLowerCase();

    // Search from startIndex to end
    for (let i = startIndex; i < visibleNodes.length; i++) {
      const item = visibleNodes[i];
      if (item && !item.node.disabled && item.node.label.toLowerCase().startsWith(lowerChar)) {
        return i;
      }
    }

    // Wrap around
    for (let i = 0; i < startIndex; i++) {
      const item = visibleNodes[i];
      if (item && !item.node.disabled && item.node.label.toLowerCase().startsWith(lowerChar)) {
        return i;
      }
    }

    return -1;
  }

  // Get siblings of a node
  function getSiblings(flatNode: FlatTreeNode): TreeNode[] {
    if (flatNode.parentId === null) {
      return nodes;
    }
    const parent = nodeMap.get(flatNode.parentId);
    return parent?.children || [];
  }

  // Get selected nodes
  function getSelectedNodes(): TreeNode[] {
    const selected: TreeNode[] = [];
    selectedIds.forEach((id) => {
      const node = nodeMap.get(id);
      if (node) selected.push(node);
    });
    return selected;
  }

  // Focus handler
  function handleFocus(): void {
    if (!focusedNodeId) {
      const visibleNodes = getVisibleNodes();
      if (visibleNodes.length > 0) {
        // Focus first selected node or first enabled node
        const firstSelectedIndex = visibleNodes.findIndex((fn) => selectedIds.has(fn.node.id));
        const firstSelectedNode = visibleNodes[firstSelectedIndex];
        if (firstSelectedIndex >= 0 && firstSelectedNode) {
          setFocusedNode(firstSelectedNode.node.id);
        } else {
          const firstEnabled = findFirstEnabled(visibleNodes);
          const firstEnabledNode = visibleNodes[firstEnabled];
          if (firstEnabled >= 0 && firstEnabledNode) {
            setFocusedNode(firstEnabledNode.node.id);
          }
        }
      }
    }
  }

  // Blur handler
  function handleBlur(): void {
    // Keep focus ID but remove visual indicator
    const allNodes = container.querySelectorAll('.dos-tree-view___node');
    allNodes.forEach((el) => {
      el.classList.remove('dos-tree-view___node--focused');
    });
  }

  // Attach event listeners
  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('focus', handleFocus);
  container.addEventListener('blur', handleBlur);

  // Initial render
  renderTree();

  // Return instance
  const instance: TreeViewInstance = {
    element: container,

    setNodes(newNodes: TreeNode[]): void {
      nodes = [...newNodes];
      buildNodeMap(newNodes);
      // Filter out invalid selections and expansions
      const validIds = new Set(nodeMap.keys());
      selectedIds = new Set([...selectedIds].filter((id) => validIds.has(id)));
      expandedIds = new Set([...expandedIds].filter((id) => validIds.has(id)));
      focusedNodeId = null;
      renderTree();
    },

    getNodes(): TreeNode[] {
      return [...nodes];
    },

    expandNode(nodeId: string): void {
      const node = nodeMap.get(nodeId);
      if (node && node.children && node.children.length > 0) {
        expandedIds.add(nodeId);
        renderTree();
        if (onExpand) onExpand(node, true);
      }
    },

    collapseNode(nodeId: string): void {
      const node = nodeMap.get(nodeId);
      if (node && expandedIds.has(nodeId)) {
        expandedIds.delete(nodeId);
        renderTree();
        if (onExpand) onExpand(node, false);
      }
    },

    toggleNode(nodeId: string): void {
      toggleExpand(nodeId);
    },

    expandAll(): void {
      nodes.forEach(function traverseExpand(node: TreeNode) {
        if (node.children && node.children.length > 0) {
          expandedIds.add(node.id);
          node.children.forEach(traverseExpand);
        }
      });
      // Also handle nodes from the map
      nodeMap.forEach((node) => {
        if (node.children && node.children.length > 0) {
          expandedIds.add(node.id);
        }
      });
      renderTree();
    },

    collapseAll(): void {
      expandedIds.clear();
      renderTree();
    },

    isExpanded(nodeId: string): boolean {
      return expandedIds.has(nodeId);
    },

    selectNode(nodeId: string): void {
      if (!selectable) return;
      const node = nodeMap.get(nodeId);
      if (!node || node.disabled) return;

      if (!multiSelect) {
        selectedIds.clear();
      }
      selectedIds.add(nodeId);
      renderTree();

      if (onSelect) onSelect(getSelectedNodes());
    },

    selectNodes(nodeIds: string[]): void {
      if (!selectable) return;

      if (multiSelect) {
        nodeIds.forEach((id) => {
          const node = nodeMap.get(id);
          if (node && !node.disabled) {
            selectedIds.add(id);
          }
        });
      } else if (nodeIds.length > 0) {
        selectedIds.clear();
        const firstId = nodeIds[0];
        if (firstId) {
          const node = nodeMap.get(firstId);
          if (node && !node.disabled) {
            selectedIds.add(firstId);
          }
        }
      }

      renderTree();
      if (onSelect) onSelect(getSelectedNodes());
    },

    deselectNode(nodeId: string): void {
      if (selectedIds.has(nodeId)) {
        selectedIds.delete(nodeId);
        renderTree();
        if (onSelect) onSelect(getSelectedNodes());
      }
    },

    clearSelection(): void {
      selectedIds.clear();
      renderTree();
      if (onSelect) onSelect([]);
    },

    getSelectedNodes,

    getSelectedIds(): string[] {
      return [...selectedIds];
    },

    isSelected(nodeId: string): boolean {
      return selectedIds.has(nodeId);
    },

    getNodeById(nodeId: string): TreeNode | undefined {
      return nodeMap.get(nodeId);
    },

    focus(): void {
      container.focus();
    },

    focusNode(nodeId: string): void {
      setFocusedNode(nodeId);
      container.focus();
    },

    scrollToNode(nodeId: string): void {
      const nodeEl = container.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
      if (nodeEl && typeof nodeEl.scrollIntoView === 'function') {
        nodeEl.scrollIntoView({ block: 'nearest' });
      }
    },

    destroy(): void {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
      container.remove();
    },
  };

  return instance;
}
