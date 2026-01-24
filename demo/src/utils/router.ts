/**
 * Simple Hash-based Router
 *
 * Provides basic routing for the Kitchen Sink demo.
 */

/** Route change callback type */
type RouteChangeCallback = (route: string) => void;

/** Registered callbacks */
const callbacks: RouteChangeCallback[] = [];

/** Current route */
let currentRoute = '';

/**
 * Route constants for navigation
 */
export const ROUTES = {
  HOME: 'home',
  // Layout
  CONTAINER: 'container',
  PANEL: 'panel',
  BOX: 'box',
  GRID: 'grid',
  DIVIDER: 'divider',
  // Typography
  HEADING: 'heading',
  TEXT: 'text',
  CODE: 'code',
  CODEBLOCK: 'codeblock',
  BLOCKQUOTE: 'blockquote',
  LIST: 'list',
  DEFINITION_LIST: 'definition-list',
  LABEL: 'label',
  ASCII_ART: 'ascii-art',
  // Button & Link
  BUTTON: 'button',
  BUTTON_GROUP: 'button-group',
  ICON_BUTTON: 'icon-button',
  LINK: 'link',
  // Form Controls
  TEXT_INPUT: 'text-input',
  TEXTAREA: 'textarea',
  PASSWORD_INPUT: 'password-input',
  CHECKBOX: 'checkbox',
  RADIO_BUTTON: 'radio-button',
  FORM_GROUP: 'form-group',
  FORM_VALIDATION: 'form-validation',
  SELECT: 'select',
  TOGGLE: 'toggle',
  SLIDER: 'slider',
  FILE_INPUT: 'file-input',
  DATE_PICKER: 'date-picker',
  TIME_PICKER: 'time-picker',
  // Feedback
  MODAL: 'modal',
  WINDOW: 'window',
  ALERT: 'alert',
  TOAST: 'toast',
  TOOLTIP: 'tooltip',
  POPOVER: 'popover',
  PROGRESS: 'progress',
  SPINNER: 'spinner',
  SKELETON: 'skeleton',
  // Navigation
  MENU: 'menu',
  DROPDOWN_MENU: 'dropdown-menu',
  CONTEXT_MENU: 'context-menu',
  SIDEBAR: 'sidebar',
  BREADCRUMBS: 'breadcrumbs',
  PAGINATION: 'pagination',
  STEPPER: 'stepper',
  TABS: 'tabs',
  BREADCRUMB: 'breadcrumb',
  // Data Display
  TABLE: 'table',
  DATA_GRID: 'data-grid',
  LISTBOX: 'listbox',
  TREE_VIEW: 'tree-view',
  BADGE: 'badge',
  AVATAR: 'avatar',
  CARD: 'card',
  TIMELINE: 'timeline',
  EMPTY_STATE: 'empty-state',
  // Advanced Components
  ACCORDION: 'accordion',
  SPLIT_PANE: 'split-pane',
  COMMAND_PALETTE: 'command-palette',
  SEARCH_INPUT: 'search-input',
  COMBOBOX: 'combobox',
  MULTI_SELECT: 'multi-select',
  TAG_INPUT: 'tag-input',
  // Themes
  THEMES: 'themes',
} as const;

/**
 * Navigate to a route
 *
 * @param path - Route path to navigate to
 */
export function navigate(path: string): void {
  window.location.hash = path;
}

/**
 * Get the current route from the URL hash
 *
 * @returns Current route path
 */
export function getCurrentRoute(): string {
  const hash = window.location.hash.slice(1); // Remove #
  return hash || 'home';
}

/**
 * Register a callback for route changes
 *
 * @param callback - Function to call when route changes
 */
export function onRouteChange(callback: RouteChangeCallback): void {
  callbacks.push(callback);
}

/**
 * Handle hash change event
 */
function handleHashChange(): void {
  const newRoute = getCurrentRoute();

  if (newRoute !== currentRoute) {
    currentRoute = newRoute;
    callbacks.forEach((callback) => callback(newRoute));
  }
}

/**
 * Initialize the router
 *
 * Sets up hash change listener and processes initial route.
 */
export function initRouter(): void {
  currentRoute = getCurrentRoute();

  window.addEventListener('hashchange', handleHashChange);

  // Trigger initial route
  callbacks.forEach((callback) => callback(currentRoute));
}

/**
 * Destroy the router
 *
 * Removes event listeners and clears callbacks.
 */
export function destroyRouter(): void {
  window.removeEventListener('hashchange', handleHashChange);
  callbacks.length = 0;
}
