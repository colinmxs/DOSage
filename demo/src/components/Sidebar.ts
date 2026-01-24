/**
 * Sidebar Component
 *
 * Navigation sidebar for the Kitchen Sink demo.
 */

import { navigate, getCurrentRoute, onRouteChange } from '../utils/router';

/** Navigation structure */
const NAV_ITEMS = [
  {
    category: 'Overview',
    items: [{ id: 'home', label: 'Home' }],
  },
  {
    category: 'Layout',
    items: [
      { id: 'container', label: 'Container' },
      { id: 'panel', label: 'Panel' },
      { id: 'box', label: 'Box' },
      { id: 'grid', label: 'Grid' },
      { id: 'divider', label: 'Divider' },
    ],
  },
  {
    category: 'Typography',
    items: [
      { id: 'heading', label: 'Heading' },
      { id: 'text', label: 'Text' },
      { id: 'code', label: 'Code' },
      { id: 'codeblock', label: 'CodeBlock' },
      { id: 'blockquote', label: 'Blockquote' },
      { id: 'list', label: 'List' },
      { id: 'definition-list', label: 'DefinitionList' },
      { id: 'label', label: 'Label' },
      { id: 'ascii-art', label: 'ASCIIArt' },
    ],
  },
  {
    category: 'Buttons & Links',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'button-group', label: 'ButtonGroup' },
      { id: 'icon-button', label: 'IconButton' },
      { id: 'link', label: 'Link' },
    ],
  },
  {
    category: 'Form Controls',
    items: [
      { id: 'text-input', label: 'TextInput' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'password-input', label: 'PasswordInput' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio-button', label: 'RadioButton' },
      { id: 'form-group', label: 'FormGroup' },
      { id: 'form-validation', label: 'FormValidation' },
      { id: 'select', label: 'Select' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'slider', label: 'Slider' },
      { id: 'file-input', label: 'FileInput' },
      { id: 'date-picker', label: 'DatePicker' },
      { id: 'time-picker', label: 'TimePicker' },
    ],
  },
  {
    category: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'progress', label: 'Progress' },
      { id: 'spinner', label: 'Spinner' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { id: 'menu', label: 'MenuBar' },
      { id: 'dropdown-menu', label: 'DropdownMenu' },
      { id: 'context-menu', label: 'ContextMenu' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
    ],
  },
  {
    category: 'Themes',
    items: [{ id: 'themes', label: 'Theme Showcase' }],
  },
];

/**
 * Creates the sidebar navigation element
 */
export function createSidebar(): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'dos-sidebar';

  // Title
  const title = document.createElement('div');
  title.className = 'dos-sidebar___title';
  title.textContent = '╔═ COMPONENTS ═╗';
  sidebar.appendChild(title);

  // Navigation
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Component navigation');

  const navList = document.createElement('ul');
  navList.className = 'dos-sidebar___nav';

  NAV_ITEMS.forEach((section) => {
    const categoryEl = document.createElement('li');
    categoryEl.className = 'dos-sidebar___category';

    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'dos-sidebar___category-title';
    categoryTitle.textContent = section.category;
    categoryEl.appendChild(categoryTitle);

    const itemsList = document.createElement('ul');
    itemsList.className = 'dos-sidebar___nav';

    section.items.forEach((item) => {
      const itemEl = document.createElement('li');

      const button = document.createElement('button');
      button.className = 'dos-sidebar___item';
      button.textContent = item.label;
      button.dataset.route = item.id;

      button.addEventListener('click', () => {
        navigate(item.id);
      });

      itemEl.appendChild(button);
      itemsList.appendChild(itemEl);
    });

    categoryEl.appendChild(itemsList);
    navList.appendChild(categoryEl);
  });

  nav.appendChild(navList);
  sidebar.appendChild(nav);

  // Update active state on route change
  const updateActiveState = (): void => {
    const currentRoute = getCurrentRoute();
    const buttons = sidebar.querySelectorAll('.dos-sidebar___item');
    buttons.forEach((btn) => {
      const button = btn as HTMLButtonElement;
      if (button.dataset.route === currentRoute) {
        button.classList.add('dos-sidebar___item--active');
      } else {
        button.classList.remove('dos-sidebar___item--active');
      }
    });
  };

  onRouteChange(updateActiveState);
  updateActiveState();

  return sidebar;
}
