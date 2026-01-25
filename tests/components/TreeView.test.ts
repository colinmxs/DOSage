/**
 * TreeView Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createTreeView } from '../../src/components/TreeView';
import type { TreeNode, TreeViewProps as _TreeViewProps } from '../../src/components/TreeView';

// Sample tree data
function createSampleTree(): TreeNode[] {
  return [
    {
      id: 'documents',
      label: 'Documents',
      children: [
        { id: 'readme', label: 'README.TXT' },
        { id: 'config', label: 'CONFIG.SYS' },
        {
          id: 'letters',
          label: 'Letters',
          children: [
            { id: 'letter1', label: 'letter1.doc' },
            { id: 'letter2', label: 'letter2.doc' },
          ],
        },
      ],
    },
    {
      id: 'programs',
      label: 'Programs',
      children: [
        { id: 'edit', label: 'EDIT.COM' },
        { id: 'format', label: 'FORMAT.COM' },
      ],
    },
    { id: 'autoexec', label: 'AUTOEXEC.BAT' },
  ];
}

// Helper to simulate keyboard events
function pressKey(element: HTMLElement, key: string, options: Partial<KeyboardEventInit> = {}): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
}

// Helper to simulate click events
function click(element: HTMLElement): void {
  element.click();
}

describe('TreeView', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const tree = createTreeView({ nodes: [] });
      expect(tree.element).toBeDefined();
      expect(tree.element.classList.contains('dos-tree-view')).toBe(true);
      expect(tree.element.getAttribute('role')).toBe('tree');
    });

    it('renders tree nodes', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      // Initially only top-level nodes are visible (not expanded)
      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls.length).toBe(3);
    });

    it('renders node labels', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      const labels = tree.element.querySelectorAll('.dos-tree-view___label');
      expect(labels[0].textContent).toBe('Documents');
      expect(labels[1].textContent).toBe('Programs');
      expect(labels[2].textContent).toBe('AUTOEXEC.BAT');
    });

    it('renders expand icons for parent nodes', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      const toggles = tree.element.querySelectorAll('.dos-tree-view___toggle');
      // Documents and Programs have children, AUTOEXEC.BAT doesn't
      expect(toggles[0].classList.contains('dos-tree-view___toggle--collapsed')).toBe(true);
      expect(toggles[1].classList.contains('dos-tree-view___toggle--collapsed')).toBe(true);
      expect(toggles[2].classList.contains('dos-tree-view___toggle--leaf')).toBe(true);
    });

    it('renders empty state when no nodes', () => {
      const tree = createTreeView({ nodes: [] });
      const empty = tree.element.querySelector('.dos-tree-view___empty');
      expect(empty).toBeTruthy();
      expect(empty?.textContent).toBe('No items');
    });

    it('renders with custom class name', () => {
      const tree = createTreeView({ nodes: [], className: 'custom-class' });
      expect(tree.element.classList.contains('custom-class')).toBe(true);
    });

    it('renders with custom id', () => {
      const tree = createTreeView({ nodes: [], id: 'my-tree' });
      expect(tree.element.id).toBe('my-tree');
    });

    it('renders lines when showLines is true', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        defaultExpanded: true,
        showLines: true,
      });
      const lineConnectors = tree.element.querySelectorAll(
        '.dos-tree-view___line-mid, .dos-tree-view___line-end'
      );
      expect(lineConnectors.length).toBeGreaterThan(0);
    });

    it('hides lines when showLines is false', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        defaultExpanded: true,
        showLines: false,
      });
      expect(tree.element.classList.contains('dos-tree-view--no-lines')).toBe(true);
    });

    it('renders custom icons', () => {
      const nodes: TreeNode[] = [
        { id: '1', label: 'Folder', icon: '📁', children: [{ id: '2', label: 'File', icon: '📄' }] },
      ];
      const tree = createTreeView({ nodes, defaultExpanded: true, showIcons: true });
      const icons = tree.element.querySelectorAll('.dos-tree-view___icon');
      expect(icons[0].textContent).toBe('📁');
      expect(icons[1].textContent).toBe('📄');
    });
  });

  describe('expand/collapse', () => {
    it('expands node on toggle click', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      // Initially collapsed - only 3 visible
      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(3);

      // Click toggle to expand Documents
      const toggle = tree.element.querySelector('.dos-tree-view___toggle') as HTMLElement;
      click(toggle);

      // Now Documents children visible (3 more nodes)
      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(6);
    });

    it('collapses expanded node on toggle click', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(6);

      const toggle = tree.element.querySelector('.dos-tree-view___toggle') as HTMLElement;
      click(toggle);

      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(3);
    });

    it('expands with defaultExpanded true', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        defaultExpanded: true,
      });

      // All nodes visible
      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls.length).toBe(10); // All 10 nodes
    });

    it('expands specific nodes with defaultExpanded array', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        defaultExpanded: ['documents'],
      });

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls.length).toBe(6); // 3 root + 3 children of Documents
    });

    it('calls onExpand when expanding', () => {
      const onExpand = vi.fn();
      const tree = createTreeView({ nodes: createSampleTree(), onExpand });

      const toggle = tree.element.querySelector('.dos-tree-view___toggle') as HTMLElement;
      click(toggle);

      expect(onExpand).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'documents' }),
        true
      );
    });

    it('calls onExpand when collapsing', () => {
      const onExpand = vi.fn();
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
        onExpand,
      });

      const toggle = tree.element.querySelector('.dos-tree-view___toggle') as HTMLElement;
      click(toggle);

      expect(onExpand).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'documents' }),
        false
      );
    });

    it('expandNode expands a specific node', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.expandNode('documents');

      expect(tree.isExpanded('documents')).toBe(true);
      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(6);
    });

    it('collapseNode collapses a specific node', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      tree.collapseNode('documents');

      expect(tree.isExpanded('documents')).toBe(false);
    });

    it('expandAll expands all nodes', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.expandAll();

      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(10);
    });

    it('collapseAll collapses all nodes', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        defaultExpanded: true,
      });

      tree.collapseAll();

      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(3);
    });
  });

  describe('selection', () => {
    it('does not select by default', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      const node = tree.element.querySelector('.dos-tree-view___node') as HTMLElement;
      click(node);

      expect(tree.getSelectedIds()).toHaveLength(0);
    });

    it('selects node when selectable is true', () => {
      const onSelect = vi.fn();
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        onSelect,
      });

      const node = tree.element.querySelector('.dos-tree-view___node') as HTMLElement;
      click(node);

      expect(tree.isSelected('documents')).toBe(true);
      expect(onSelect).toHaveBeenCalledWith([expect.objectContaining({ id: 'documents' })]);
    });

    it('replaces selection in single select mode', () => {
      const tree = createTreeView({ nodes: createSampleTree(), selectable: true });

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      click(nodeEls[0] as HTMLElement);
      click(nodeEls[1] as HTMLElement);

      expect(tree.isSelected('documents')).toBe(false);
      expect(tree.isSelected('programs')).toBe(true);
    });

    it('toggles selection in multi-select mode', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        multiSelect: true,
      });

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      click(nodeEls[0] as HTMLElement);
      click(nodeEls[1] as HTMLElement);

      expect(tree.isSelected('documents')).toBe(true);
      expect(tree.isSelected('programs')).toBe(true);

      // Click again to deselect
      click(nodeEls[0] as HTMLElement);
      expect(tree.isSelected('documents')).toBe(false);
    });

    it('initializes with selectedNodes', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        selectedNodes: ['programs'],
      });

      expect(tree.isSelected('programs')).toBe(true);
    });

    it('selectNode selects a node', () => {
      const tree = createTreeView({ nodes: createSampleTree(), selectable: true });

      tree.selectNode('autoexec');

      expect(tree.isSelected('autoexec')).toBe(true);
    });

    it('selectNodes selects multiple nodes', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        multiSelect: true,
      });

      tree.selectNodes(['documents', 'programs']);

      expect(tree.getSelectedIds()).toEqual(['documents', 'programs']);
    });

    it('clearSelection clears all selections', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        selectedNodes: ['documents'],
      });

      tree.clearSelection();

      expect(tree.getSelectedIds()).toHaveLength(0);
    });
  });

  describe('disabled nodes', () => {
    it('renders disabled nodes', () => {
      const nodes: TreeNode[] = [
        { id: '1', label: 'Enabled' },
        { id: '2', label: 'Disabled', disabled: true },
      ];
      const tree = createTreeView({ nodes });

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls[1].classList.contains('dos-tree-view___node--disabled')).toBe(true);
      expect(nodeEls[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('does not select disabled nodes on click', () => {
      const nodes: TreeNode[] = [{ id: '1', label: 'Disabled', disabled: true }];
      const onSelect = vi.fn();
      const tree = createTreeView({ nodes, selectable: true, onSelect });

      const node = tree.element.querySelector('.dos-tree-view___node') as HTMLElement;
      click(node);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('focuses first node on focus', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.element.dispatchEvent(new FocusEvent('focus'));

      const firstNode = tree.element.querySelector('.dos-tree-view___node');
      expect(firstNode?.classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('navigates down with ArrowDown', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(tree.element, 'ArrowDown');

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls[1].classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('navigates up with ArrowUp', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.focusNode('programs');
      pressKey(tree.element, 'ArrowUp');

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls[0].classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('expands with ArrowRight', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.focusNode('documents');
      pressKey(tree.element, 'ArrowRight');

      expect(tree.isExpanded('documents')).toBe(true);
    });

    it('moves to first child with ArrowRight when expanded', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      tree.focusNode('documents');
      pressKey(tree.element, 'ArrowRight');

      // Should focus first child (readme)
      const readmeNode = tree.element.querySelector('[data-id="readme"]');
      expect(readmeNode?.classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('collapses with ArrowLeft', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      tree.focusNode('documents');
      pressKey(tree.element, 'ArrowLeft');

      expect(tree.isExpanded('documents')).toBe(false);
    });

    it('moves to parent with ArrowLeft when collapsed', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      tree.focusNode('readme');
      pressKey(tree.element, 'ArrowLeft');

      const documentsNode = tree.element.querySelector('[data-id="documents"]');
      expect(documentsNode?.classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('navigates to first with Home', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.focusNode('autoexec');
      pressKey(tree.element, 'Home');

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls[0].classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('navigates to last with End', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(tree.element, 'End');

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      expect(nodeEls[nodeEls.length - 1].classList.contains('dos-tree-view___node--focused')).toBe(true);
    });

    it('selects with Enter', () => {
      const tree = createTreeView({ nodes: createSampleTree(), selectable: true });

      tree.focusNode('documents');
      pressKey(tree.element, 'Enter');

      expect(tree.isSelected('documents')).toBe(true);
    });

    it('selects with Space', () => {
      const tree = createTreeView({ nodes: createSampleTree(), selectable: true });

      tree.focusNode('programs');
      pressKey(tree.element, ' ');

      expect(tree.isSelected('programs')).toBe(true);
    });

    it('expands all siblings with *', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.focusNode('documents');
      pressKey(tree.element, '*');

      expect(tree.isExpanded('documents')).toBe(true);
      expect(tree.isExpanded('programs')).toBe(true);
    });

    it('supports type-ahead navigation', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(tree.element, 'a');

      const autoexecNode = tree.element.querySelector('[data-id="autoexec"]');
      expect(autoexecNode?.classList.contains('dos-tree-view___node--focused')).toBe(true);
    });
  });

  describe('instance methods', () => {
    it('setNodes replaces nodes', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.setNodes([{ id: 'new', label: 'New Node' }]);

      expect(tree.element.querySelectorAll('.dos-tree-view___node').length).toBe(1);
    });

    it('getNodes returns nodes', () => {
      const nodes = createSampleTree();
      const tree = createTreeView({ nodes });

      expect(tree.getNodes()).toEqual(nodes);
    });

    it('toggleNode toggles expansion', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      tree.toggleNode('documents');
      expect(tree.isExpanded('documents')).toBe(true);

      tree.toggleNode('documents');
      expect(tree.isExpanded('documents')).toBe(false);
    });

    it('getNodeById returns node', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      const node = tree.getNodeById('readme');
      expect(node?.label).toBe('README.TXT');
    });

    it('getSelectedNodes returns selected nodes', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        multiSelect: true,
        selectedNodes: ['documents', 'programs'],
      });

      const selected = tree.getSelectedNodes();
      expect(selected).toHaveLength(2);
      expect(selected[0].id).toBe('documents');
    });

    it('focus focuses the container', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      document.body.appendChild(tree.element);

      tree.focus();

      expect(document.activeElement).toBe(tree.element);

      tree.destroy();
    });

    it('destroy removes element', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      document.body.appendChild(tree.element);

      tree.destroy();

      expect(document.body.contains(tree.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role tree', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      expect(tree.element.getAttribute('role')).toBe('tree');
    });

    it('has tabindex 0', () => {
      const tree = createTreeView({ nodes: createSampleTree() });
      expect(tree.element.getAttribute('tabindex')).toBe('0');
    });

    it('has aria-label', () => {
      const tree = createTreeView({ nodes: [], 'aria-label': 'File Browser' });
      expect(tree.element.getAttribute('aria-label')).toBe('File Browser');
    });

    it('sets aria-multiselectable for multi-select', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        multiSelect: true,
      });
      expect(tree.element.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('nodes have role treeitem', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      const nodeEls = tree.element.querySelectorAll('.dos-tree-view___node');
      nodeEls.forEach((el) => {
        expect(el.getAttribute('role')).toBe('treeitem');
      });
    });

    it('nodes have aria-level', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        expandedNodes: ['documents'],
      });

      const documentsNode = tree.element.querySelector('[data-id="documents"]');
      expect(documentsNode?.getAttribute('aria-level')).toBe('1');

      const readmeNode = tree.element.querySelector('[data-id="readme"]');
      expect(readmeNode?.getAttribute('aria-level')).toBe('2');
    });

    it('parent nodes have aria-expanded', () => {
      const tree = createTreeView({ nodes: createSampleTree() });

      const documentsNode = tree.element.querySelector('[data-id="documents"]');
      expect(documentsNode?.getAttribute('aria-expanded')).toBe('false');

      tree.expandNode('documents');

      const expandedNode = tree.element.querySelector('[data-id="documents"]');
      expect(expandedNode?.getAttribute('aria-expanded')).toBe('true');
    });

    it('selectable nodes have aria-selected', () => {
      const tree = createTreeView({
        nodes: createSampleTree(),
        selectable: true,
        selectedNodes: ['documents'],
      });

      const documentsNode = tree.element.querySelector('[data-id="documents"]');
      expect(documentsNode?.getAttribute('aria-selected')).toBe('true');

      const programsNode = tree.element.querySelector('[data-id="programs"]');
      expect(programsNode?.getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('onNodeClick callback', () => {
    it('calls onNodeClick when node is clicked', () => {
      const onNodeClick = vi.fn();
      const tree = createTreeView({ nodes: createSampleTree(), onNodeClick });

      const node = tree.element.querySelector('.dos-tree-view___node') as HTMLElement;
      click(node);

      expect(onNodeClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'documents' }));
    });

    it('does not call onNodeClick for disabled nodes', () => {
      const nodes: TreeNode[] = [{ id: '1', label: 'Disabled', disabled: true }];
      const onNodeClick = vi.fn();
      const tree = createTreeView({ nodes, onNodeClick });

      const node = tree.element.querySelector('.dos-tree-view___node') as HTMLElement;
      click(node);

      expect(onNodeClick).not.toHaveBeenCalled();
    });
  });
});
