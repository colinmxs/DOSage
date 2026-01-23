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
  LIST: 'list',
  // Form Controls
  BUTTON: 'button',
  INPUT: 'input',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  // Feedback
  ALERT: 'alert',
  PROGRESS: 'progress',
  SPINNER: 'spinner',
  // Navigation
  MENU: 'menu',
  TABS: 'tabs',
  BREADCRUMB: 'breadcrumb',
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
