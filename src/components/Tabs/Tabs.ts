/**
 * Tabs Component
 *
 * A DOS-style tabbed interface with full keyboard navigation and ARIA support.
 * Supports horizontal and vertical orientations with box-drawing character styling.
 */

import type {
  TabsProps,
  TabProps,
  TabsState,
  TabsElement,
  TabChangeEventDetail,
} from './Tabs.types';
import './Tabs.css';

/**
 * Creates a DOS-style tabs component with tablist, tab, and tabpanel patterns.
 *
 * @param props - Tabs configuration options
 * @returns The tabs container element with attached methods
 *
 * @example
 * ```typescript
 * import { createTabs } from 'dosage';
 *
 * const tabs = createTabs({
 *   tabs: [
 *     { id: 'tab1', label: 'General', content: 'General settings content' },
 *     { id: 'tab2', label: 'Advanced', content: 'Advanced settings content' },
 *     { id: 'tab3', label: 'About', content: 'About information' },
 *   ],
 *   orientation: 'horizontal',
 *   onChange: (tabId) => console.log('Tab changed:', tabId)
 * });
 *
 * document.body.appendChild(tabs);
 * ```
 */
export function createTabs(props: TabsProps): TabsElement {
  const {
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    orientation = 'horizontal',
    variant = 'default',
    activation = 'automatic',
    onChange,
    className,
    id,
  } = props;

  // Determine initial active tab
  const getInitialActiveTab = (): string => {
    if (controlledActiveTab) return controlledActiveTab;
    if (defaultActiveTab) return defaultActiveTab;
    // Find first non-disabled tab
    const firstEnabled = tabs.find((tab) => !tab.disabled);
    return firstEnabled?.id || tabs[0]?.id || '';
  };

  // Component state
  const state: TabsState = {
    activeTab: getInitialActiveTab(),
    focusedTab: getInitialActiveTab(),
    renderedTabs: new Set([getInitialActiveTab()]),
  };

  // Create main container
  const container = document.createElement('div') as unknown as TabsElement;
  container.className = buildContainerClasses();

  if (id) {
    container.id = id;
  }

  // Create tab list
  const tabList = document.createElement('div');
  tabList.className = 'dos-tabs__list';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-orientation', orientation);

  // Create tab panels container
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'dos-tabs__panels';

  // Tab elements map for quick access
  const tabElements = new Map<string, HTMLButtonElement>();
  const panelElements = new Map<string, HTMLDivElement>();

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = [
      'dos-tabs',
      `dos-tabs--${orientation}`,
      `dos-tabs--${variant}`,
    ];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Render a single tab button
   */
  function createTabButton(tab: TabProps, index: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = buildTabClasses(tab);
    button.id = `${id || 'tabs'}-tab-${tab.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(state.activeTab === tab.id));
    button.setAttribute('aria-controls', `${id || 'tabs'}-panel-${tab.id}`);
    button.setAttribute('tabindex', state.activeTab === tab.id ? '0' : '-1');

    if (tab.disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.disabled = true;
    }

    // Create content structure
    if (tab.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'dos-tabs__tab-icon';
      iconSpan.textContent = tab.icon;
      iconSpan.setAttribute('aria-hidden', 'true');
      button.appendChild(iconSpan);
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = 'dos-tabs__tab-label';
    labelSpan.textContent = tab.label;
    button.appendChild(labelSpan);

    // Event handlers
    button.addEventListener('click', () => handleTabClick(tab.id));
    button.addEventListener('keydown', (e) => handleTabKeyDown(e, tab.id, index));
    button.addEventListener('focus', () => handleTabFocus(tab.id));

    return button;
  }

  /**
   * Build tab button class string
   */
  function buildTabClasses(tab: TabProps): string {
    const classes = ['dos-tabs__tab'];
    if (state.activeTab === tab.id) {
      classes.push('dos-tabs__tab--active');
    }
    if (tab.disabled) {
      classes.push('dos-tabs__tab--disabled');
    }
    return classes.join(' ');
  }

  /**
   * Create a tab panel element
   */
  function createTabPanel(tab: TabProps): HTMLDivElement {
    const panel = document.createElement('div');
    panel.className = 'dos-tabs__panel';
    panel.id = `${id || 'tabs'}-panel-${tab.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${id || 'tabs'}-tab-${tab.id}`);
    panel.setAttribute('tabindex', '0');

    // Set visibility
    if (state.activeTab === tab.id) {
      panel.classList.add('dos-tabs__panel--active');
    } else {
      panel.hidden = true;
    }

    // Render content
    renderPanelContent(panel, tab);

    return panel;
  }

  /**
   * Render panel content
   */
  function renderPanelContent(panel: HTMLDivElement, tab: TabProps): void {
    panel.innerHTML = '';

    if (typeof tab.content === 'string') {
      panel.textContent = tab.content;
    } else if (typeof tab.content === 'function') {
      panel.appendChild(tab.content());
    } else {
      panel.appendChild(tab.content);
    }
  }

  /**
   * Handle tab click
   */
  function handleTabClick(tabId: string): void {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    activateTab(tabId);
  }

  /**
   * Handle tab focus (for automatic activation mode)
   */
  function handleTabFocus(tabId: string): void {
    state.focusedTab = tabId;

    if (activation === 'automatic') {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab?.disabled) {
        activateTab(tabId);
      }
    }
  }

  /**
   * Handle keyboard navigation on tabs
   */
  function handleTabKeyDown(event: KeyboardEvent, tabId: string, _index: number): void {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((t) => t.id === tabId);

    let nextTabId: string | null = null;

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          nextTabId = getNextEnabledTab(enabledTabs, currentEnabledIndex, 1);
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          nextTabId = getNextEnabledTab(enabledTabs, currentEnabledIndex, -1);
        }
        break;

      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          nextTabId = getNextEnabledTab(enabledTabs, currentEnabledIndex, 1);
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          nextTabId = getNextEnabledTab(enabledTabs, currentEnabledIndex, -1);
        }
        break;

      case 'Home':
        event.preventDefault();
        nextTabId = enabledTabs[0]?.id || null;
        break;

      case 'End':
        event.preventDefault();
        nextTabId = enabledTabs[enabledTabs.length - 1]?.id || null;
        break;

      case 'Enter':
      case ' ':
        if (activation === 'manual') {
          event.preventDefault();
          activateTab(tabId);
        }
        break;
    }

    if (nextTabId) {
      focusTab(nextTabId);
    }
  }

  /**
   * Get next enabled tab in direction
   */
  function getNextEnabledTab(
    enabledTabs: TabProps[],
    currentIndex: number,
    direction: 1 | -1
  ): string | null {
    if (enabledTabs.length === 0) return null;

    let nextIndex = currentIndex + direction;

    // Wrap around
    if (nextIndex < 0) {
      nextIndex = enabledTabs.length - 1;
    } else if (nextIndex >= enabledTabs.length) {
      nextIndex = 0;
    }

    return enabledTabs[nextIndex]?.id || null;
  }

  /**
   * Focus a specific tab
   */
  function focusTab(tabId: string): void {
    const tabElement = tabElements.get(tabId);
    if (tabElement) {
      tabElement.focus();
    }
  }

  /**
   * Activate a tab
   */
  function activateTab(tabId: string): void {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab || tab.disabled) return;

    const previousTabId = state.activeTab;
    if (previousTabId === tabId) return;

    state.activeTab = tabId;
    state.renderedTabs.add(tabId);

    // Update tab buttons
    tabElements.forEach((element, id) => {
      const isActive = id === tabId;
      element.setAttribute('aria-selected', String(isActive));
      element.setAttribute('tabindex', isActive ? '0' : '-1');
      element.classList.toggle('dos-tabs__tab--active', isActive);
    });

    // Update panels
    panelElements.forEach((element, id) => {
      const isActive = id === tabId;
      element.classList.toggle('dos-tabs__panel--active', isActive);
      element.hidden = !isActive;
    });

    // Dispatch custom event
    const event = new CustomEvent<TabChangeEventDetail>('dos:tabs:change', {
      bubbles: true,
      detail: {
        tabId,
        previousTabId,
      },
    });
    container.dispatchEvent(event);

    // Call onChange callback
    if (onChange) {
      onChange(tabId);
    }
  }

  /**
   * Render all tabs and panels
   */
  function render(): void {
    tabList.innerHTML = '';
    panelsContainer.innerHTML = '';
    tabElements.clear();
    panelElements.clear();

    tabs.forEach((tab, index) => {
      // Create and store tab button
      const tabButton = createTabButton(tab, index);
      tabElements.set(tab.id, tabButton);
      tabList.appendChild(tabButton);

      // Create and store panel
      const panel = createTabPanel(tab);
      panelElements.set(tab.id, panel);
      panelsContainer.appendChild(panel);
    });
  }

  // Initial render
  render();

  // Assemble component
  container.appendChild(tabList);
  container.appendChild(panelsContainer);

  // Public API methods
  container.getActiveTab = () => state.activeTab;

  container.setActiveTab = (tabId: string) => {
    activateTab(tabId);
    focusTab(tabId);
  };

  container.enableTab = (tabId: string) => {
    const tabElement = tabElements.get(tabId);
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const tab = tabs[tabIndex];

    if (tabElement && tabIndex !== -1 && tab) {
      tab.disabled = false;
      tabElement.disabled = false;
      tabElement.removeAttribute('aria-disabled');
      tabElement.classList.remove('dos-tabs__tab--disabled');
    }
  };

  container.disableTab = (tabId: string) => {
    const tabElement = tabElements.get(tabId);
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const tab = tabs[tabIndex];

    if (tabElement && tabIndex !== -1 && tab) {
      tab.disabled = true;
      tabElement.disabled = true;
      tabElement.setAttribute('aria-disabled', 'true');
      tabElement.classList.add('dos-tabs__tab--disabled');

      // If this was the active tab, switch to next enabled
      if (state.activeTab === tabId) {
        const nextEnabled = tabs.find((t) => !t.disabled);
        if (nextEnabled) {
          activateTab(nextEnabled.id);
        }
      }
    }
  };

  container.getTabs = () => [...tabs];

  container.setTabs = (newTabs: TabProps[]) => {
    tabs.length = 0;
    tabs.push(...newTabs);

    // Reset state if active tab no longer exists
    if (!newTabs.find((t) => t.id === state.activeTab)) {
      const firstEnabled = newTabs.find((t) => !t.disabled);
      state.activeTab = firstEnabled?.id || newTabs[0]?.id || '';
    }

    render();
  };

  container.focus = () => {
    const activeTabElement = tabElements.get(state.activeTab);
    if (activeTabElement) {
      activeTabElement.focus();
    }
  };

  container.destroy = () => {
    // Remove all event listeners by replacing elements
    tabElements.forEach((element) => {
      const clone = element.cloneNode(true);
      element.parentNode?.replaceChild(clone, element);
    });
    tabElements.clear();
    panelElements.clear();
  };

  return container;
}
