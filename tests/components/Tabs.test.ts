/**
 * Tabs Component Tests
 */

import { describe, it, expect, afterEach, vi, beforeEach as _beforeEach } from 'vitest';
import { createTabs, TabsElement } from '../../src/components/Tabs';

describe('Tabs', () => {
  let tabs: TabsElement | null = null;

  const defaultTabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ];

  afterEach(() => {
    if (tabs && tabs.parentNode) {
      tabs.remove();
    }
    tabs = null;
  });

  describe('rendering', () => {
    it('renders with required props', () => {
      tabs = createTabs({ tabs: defaultTabs });

      expect(tabs).toBeInstanceOf(HTMLElement);
      expect(tabs.classList.contains('dos-tabs')).toBe(true);
    });

    it('renders all tab buttons', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons.length).toBe(3);
    });

    it('renders all tab panels', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(tabPanels.length).toBe(3);
    });

    it('renders tab labels correctly', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[0].textContent).toContain('Tab 1');
      expect(tabButtons[1].textContent).toContain('Tab 2');
      expect(tabButtons[2].textContent).toContain('Tab 3');
    });

    it('renders tab content correctly', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].textContent).toBe('Content 1');
    });

    it('renders with custom className', () => {
      tabs = createTabs({ tabs: defaultTabs, className: 'my-tabs' });

      expect(tabs.classList.contains('my-tabs')).toBe(true);
    });

    it('renders with custom id', () => {
      tabs = createTabs({ tabs: defaultTabs, id: 'my-tabs' });

      expect(tabs.id).toBe('my-tabs');
    });

    it('renders tab with icon', () => {
      tabs = createTabs({
        tabs: [{ id: 'tab1', label: 'Tab 1', icon: '★', content: 'Content' }],
      });

      const icon = tabs.querySelector('.dos-tabs__tab-icon');
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe('★');
    });
  });

  describe('orientation', () => {
    it('defaults to horizontal orientation', () => {
      tabs = createTabs({ tabs: defaultTabs });

      expect(tabs.classList.contains('dos-tabs--horizontal')).toBe(true);
    });

    it('applies horizontal orientation class', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'horizontal' });

      expect(tabs.classList.contains('dos-tabs--horizontal')).toBe(true);
    });

    it('applies vertical orientation class', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'vertical' });

      expect(tabs.classList.contains('dos-tabs--vertical')).toBe(true);
    });

    it('sets aria-orientation on tablist', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'vertical' });

      const tabList = tabs.querySelector('[role="tablist"]');
      expect(tabList?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('variants', () => {
    it('defaults to default variant', () => {
      tabs = createTabs({ tabs: defaultTabs });

      expect(tabs.classList.contains('dos-tabs--default')).toBe(true);
    });

    it('applies boxed variant', () => {
      tabs = createTabs({ tabs: defaultTabs, variant: 'boxed' });

      expect(tabs.classList.contains('dos-tabs--boxed')).toBe(true);
    });

    it('applies minimal variant', () => {
      tabs = createTabs({ tabs: defaultTabs, variant: 'minimal' });

      expect(tabs.classList.contains('dos-tabs--minimal')).toBe(true);
    });
  });

  describe('active tab', () => {
    it('selects first tab by default', () => {
      tabs = createTabs({ tabs: defaultTabs });

      expect(tabs.getActiveTab()).toBe('tab1');
    });

    it('respects defaultActiveTab prop', () => {
      tabs = createTabs({ tabs: defaultTabs, defaultActiveTab: 'tab2' });

      expect(tabs.getActiveTab()).toBe('tab2');
    });

    it('marks active tab with aria-selected', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[0].getAttribute('aria-selected')).toBe('true');
      expect(tabButtons[1].getAttribute('aria-selected')).toBe('false');
    });

    it('shows only active panel', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].hidden).toBe(false);
      expect(panels[1].hidden).toBe(true);
      expect(panels[2].hidden).toBe(true);
    });

    it('applies active class to active tab button', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[0].classList.contains('dos-tabs__tab--active')).toBe(true);
      expect(tabButtons[1].classList.contains('dos-tabs__tab--active')).toBe(false);
    });
  });

  describe('tab switching', () => {
    it('changes active tab on click', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      expect(tabs.getActiveTab()).toBe('tab2');
    });

    it('updates aria-selected on tab change', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      expect(tabButtons[0].getAttribute('aria-selected')).toBe('false');
      expect(tabButtons[1].getAttribute('aria-selected')).toBe('true');
    });

    it('shows correct panel on tab change', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].hidden).toBe(true);
      expect(panels[1].hidden).toBe(false);
    });

    it('calls onChange callback on tab change', () => {
      const onChange = vi.fn();
      tabs = createTabs({ tabs: defaultTabs, onChange });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      expect(onChange).toHaveBeenCalledWith('tab2');
    });

    it('dispatches custom event on tab change', () => {
      tabs = createTabs({ tabs: defaultTabs });
      const handler = vi.fn();
      tabs.addEventListener('dos:tabs:change', handler);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.tabId).toBe('tab2');
      expect(handler.mock.calls[0][0].detail.previousTabId).toBe('tab1');
    });

    it('does not change tab when clicking active tab', () => {
      const onChange = vi.fn();
      tabs = createTabs({ tabs: defaultTabs, onChange });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).click();

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled tabs', () => {
    it('renders disabled tab correctly', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
        ],
      });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[1].hasAttribute('disabled')).toBe(true);
      expect(tabButtons[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('applies disabled class to disabled tab', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
        ],
      });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[1].classList.contains('dos-tabs__tab--disabled')).toBe(true);
    });

    it('does not switch to disabled tab on click', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
        ],
      });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).click();

      expect(tabs.getActiveTab()).toBe('tab1');
    });

    it('skips disabled tabs when defaultActiveTab is disabled', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1', disabled: true },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
        ],
      });

      expect(tabs.getActiveTab()).toBe('tab2');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with ArrowRight in horizontal mode', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'horizontal' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[1]);
    });

    it('moves focus with ArrowLeft in horizontal mode', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'horizontal' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).focus();
      (tabButtons[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[0]);
    });

    it('moves focus with ArrowDown in vertical mode', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'vertical' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[1]);
    });

    it('moves focus with ArrowUp in vertical mode', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'vertical' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).focus();
      (tabButtons[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[0]);
    });

    it('wraps focus at the end', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'horizontal' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[2] as HTMLElement).focus();
      (tabButtons[2] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[0]);
    });

    it('wraps focus at the beginning', () => {
      tabs = createTabs({ tabs: defaultTabs, orientation: 'horizontal' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[2]);
    });

    it('moves to first tab with Home key', () => {
      tabs = createTabs({ tabs: defaultTabs });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[2] as HTMLElement).focus();
      (tabButtons[2] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[0]);
    });

    it('moves to last tab with End key', () => {
      tabs = createTabs({ tabs: defaultTabs });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[2]);
    });

    it('skips disabled tabs during navigation', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
          { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
        ],
      });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(tabButtons[2]);
    });
  });

  describe('activation modes', () => {
    it('activates tab automatically on focus by default', () => {
      tabs = createTabs({ tabs: defaultTabs, activation: 'automatic' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).focus();

      expect(tabs.getActiveTab()).toBe('tab2');
    });

    it('does not activate tab on focus in manual mode', () => {
      tabs = createTabs({ tabs: defaultTabs, activation: 'manual' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[0] as HTMLElement).focus();
      (tabButtons[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(tabs.getActiveTab()).toBe('tab1');
    });

    it('activates tab with Enter in manual mode', () => {
      tabs = createTabs({ tabs: defaultTabs, activation: 'manual' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).focus();
      (tabButtons[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(tabs.getActiveTab()).toBe('tab2');
    });

    it('activates tab with Space in manual mode', () => {
      tabs = createTabs({ tabs: defaultTabs, activation: 'manual' });
      document.body.appendChild(tabs);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      (tabButtons[1] as HTMLElement).focus();
      (tabButtons[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      );

      expect(tabs.getActiveTab()).toBe('tab2');
    });
  });

  describe('ARIA attributes', () => {
    it('has role="tablist" on the tab list', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabList = tabs.querySelector('[role="tablist"]');
      expect(tabList).not.toBeNull();
    });

    it('has role="tab" on each tab button', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons.length).toBe(3);
    });

    it('has role="tabpanel" on each panel', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels.length).toBe(3);
    });

    it('links tabs to panels with aria-controls', () => {
      tabs = createTabs({ tabs: defaultTabs, id: 'test-tabs' });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[0].getAttribute('aria-controls')).toBe('test-tabs-panel-tab1');
    });

    it('links panels to tabs with aria-labelledby', () => {
      tabs = createTabs({ tabs: defaultTabs, id: 'test-tabs' });

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].getAttribute('aria-labelledby')).toBe('test-tabs-tab-tab1');
    });

    it('sets tabindex correctly for roving tabindex', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[0].getAttribute('tabindex')).toBe('0');
      expect(tabButtons[1].getAttribute('tabindex')).toBe('-1');
      expect(tabButtons[2].getAttribute('tabindex')).toBe('-1');
    });

    it('sets tabindex="0" on panels for accessibility', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('public API', () => {
    it('getActiveTab returns current active tab', () => {
      tabs = createTabs({ tabs: defaultTabs });

      expect(tabs.getActiveTab()).toBe('tab1');
    });

    it('setActiveTab changes active tab', () => {
      tabs = createTabs({ tabs: defaultTabs });

      tabs.setActiveTab('tab2');

      expect(tabs.getActiveTab()).toBe('tab2');
    });

    it('enableTab enables a disabled tab', () => {
      tabs = createTabs({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
        ],
      });

      tabs.enableTab('tab2');

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[1].hasAttribute('disabled')).toBe(false);
    });

    it('disableTab disables a tab', () => {
      tabs = createTabs({ tabs: defaultTabs });

      tabs.disableTab('tab2');

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons[1].hasAttribute('disabled')).toBe(true);
    });

    it('disabling active tab switches to next enabled', () => {
      tabs = createTabs({ tabs: defaultTabs });

      tabs.disableTab('tab1');

      // Should switch to another enabled tab (tab2 or tab3)
      expect(tabs.getActiveTab()).not.toBe('tab1');
      const activeTabs = tabs.querySelectorAll('[role="tab"][aria-selected="true"]');
      expect(activeTabs.length).toBe(1);
    });

    it('getTabs returns current tabs array', () => {
      tabs = createTabs({ tabs: defaultTabs });

      const result = tabs.getTabs();

      expect(result.length).toBe(3);
      expect(result[0].id).toBe('tab1');
    });

    it('setTabs updates tabs dynamically', () => {
      tabs = createTabs({ tabs: defaultTabs });

      tabs.setTabs([
        { id: 'new1', label: 'New Tab 1', content: 'New Content 1' },
        { id: 'new2', label: 'New Tab 2', content: 'New Content 2' },
      ]);

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons.length).toBe(2);
      expect(tabButtons[0].textContent).toContain('New Tab 1');
    });

    it('focus focuses the active tab', () => {
      tabs = createTabs({ tabs: defaultTabs });
      document.body.appendChild(tabs);

      tabs.focus();

      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(document.activeElement).toBe(tabButtons[0]);
    });

    it('destroy cleans up component', () => {
      tabs = createTabs({ tabs: defaultTabs });
      document.body.appendChild(tabs);

      tabs.destroy();

      // Verify no errors occur when trying to interact
      const tabButtons = tabs.querySelectorAll('[role="tab"]');
      expect(tabButtons.length).toBeGreaterThan(0);
    });
  });

  describe('dynamic content', () => {
    it('renders function content', () => {
      tabs = createTabs({
        tabs: [
          {
            id: 'tab1',
            label: 'Tab 1',
            content: () => {
              const div = document.createElement('div');
              div.textContent = 'Dynamic content';
              return div;
            },
          },
        ],
      });

      const panel = tabs.querySelector('[role="tabpanel"]');
      expect(panel?.textContent).toBe('Dynamic content');
    });

    it('renders element content', () => {
      const element = document.createElement('span');
      element.textContent = 'Element content';

      tabs = createTabs({
        tabs: [{ id: 'tab1', label: 'Tab 1', content: element }],
      });

      const panel = tabs.querySelector('[role="tabpanel"]');
      expect(panel?.textContent).toBe('Element content');
    });
  });
});
