/**
 * MainContent Component
 *
 * Main content area for the Kitchen Sink demo.
 */

import { onRouteChange, getCurrentRoute } from '../utils/router';
import { renderHomePage } from '../pages/home';
import {
  renderContainerPage,
  renderPanelPage,
  renderBoxPage,
  renderGridPage,
  renderDividerPage,
} from '../pages/layout';
import {
  renderHeadingPage,
  renderTextPage,
  renderCodePage,
  renderCodeBlockPage,
  renderBlockquotePage,
  renderListPage,
  renderDefinitionListPage,
  renderLabelPage,
  renderASCIIArtPage,
} from '../pages/typography-components';
import {
  renderButtonPage,
  renderButtonGroupPage,
  renderIconButtonPage,
  renderLinkPage,
} from '../pages/buttons';
import {
  renderTextInputPage,
  renderTextareaPage,
  renderPasswordInputPage,
  renderCheckboxPage,
  renderRadioButtonPage,
  renderFormGroupPage,
  renderFormValidationPage,
  renderSelectPage,
  renderTogglePage,
  renderSliderPage,
  renderFileInputPage,
  renderDatePickerPage,
  renderTimePickerPage,
} from '../pages/form-controls';
import { renderMenuBarPage, renderDropdownMenuPage, renderContextMenuPage, renderSidebarPage, renderBreadcrumbsPage, renderPaginationPage, renderStepperPage } from '../pages/navigation';
import {
  renderModalPage,
  renderWindowPage,
  renderAlertPage,
  renderToastPage,
  renderTooltipPage,
  renderPopoverPage,
  renderProgressBarPage,
  renderLoadingSpinnerPage,
  renderSkeletonLoaderPage,
} from '../pages/feedback';

/** Page content element reference */
let contentElement: HTMLElement | null = null;

/**
 * Page registry - maps route IDs to page render functions
 */
const pages: Record<string, () => HTMLElement> = {
  home: renderHomePage,
  // Layout pages
  container: renderContainerPage,
  panel: renderPanelPage,
  box: renderBoxPage,
  grid: renderGridPage,
  divider: renderDividerPage,
  // Typography pages
  heading: renderHeadingPage,
  text: renderTextPage,
  code: renderCodePage,
  codeblock: renderCodeBlockPage,
  blockquote: renderBlockquotePage,
  list: renderListPage,
  'definition-list': renderDefinitionListPage,
  label: renderLabelPage,
  'ascii-art': renderASCIIArtPage,
  // Button & Link pages (Phase 4)
  button: renderButtonPage,
  'button-group': renderButtonGroupPage,
  'icon-button': renderIconButtonPage,
  link: renderLinkPage,
  // Form controls (Phase 5)
  'text-input': renderTextInputPage,
  textarea: renderTextareaPage,
  'password-input': renderPasswordInputPage,
  checkbox: renderCheckboxPage,
  'radio-button': renderRadioButtonPage,
  'form-group': renderFormGroupPage,
  'form-validation': renderFormValidationPage,
  select: renderSelectPage,
  toggle: renderTogglePage,
  slider: renderSliderPage,
  'file-input': renderFileInputPage,
  'date-picker': renderDatePickerPage,
  'time-picker': renderTimePickerPage,
  // Feedback (Phase 8)
  modal: renderModalPage,
  window: renderWindowPage,
  alert: renderAlertPage,
  toast: renderToastPage,
  tooltip: renderTooltipPage,
  popover: renderPopoverPage,
  progress: renderProgressBarPage,
  spinner: renderLoadingSpinnerPage,
  skeleton: renderSkeletonLoaderPage,
  // Navigation
  menu: renderMenuBarPage,
  'dropdown-menu': renderDropdownMenuPage,
  'context-menu': renderContextMenuPage,
  sidebar: renderSidebarPage,
  breadcrumbs: renderBreadcrumbsPage,
  pagination: renderPaginationPage,
  stepper: renderStepperPage,
  tabs: () => createPlaceholderPage('Tabs', 'Tabbed interface component.'),
  breadcrumb: () => createPlaceholderPage('Breadcrumb', 'Navigation breadcrumb trail.'),
  // Themes
  themes: () => createPlaceholderPage('Theme Showcase', 'Preview all available themes.'),
};

/**
 * Creates a placeholder page for components not yet implemented
 */
function createPlaceholderPage(title: string, description: string): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = title;

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = description;

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  const placeholder = document.createElement('div');
  placeholder.className = 'dos-demo-section';
  placeholder.innerHTML = `
    <div class="dos-demo-section___title">🚧 Coming Soon</div>
    <div class="dos-demo-section___description">
      This component is planned for implementation. Check the checklist for progress.
    </div>
    <div class="dos-demo-section___examples">
      <pre>
╔══════════════════════════════════════════╗
║                                          ║
║   Component under construction...        ║
║                                          ║
║   ████████░░░░░░░░░░░░░░  33%           ║
║                                          ║
╚══════════════════════════════════════════╝
      </pre>
    </div>
  `;

  content.appendChild(placeholder);

  page.appendChild(header);
  page.appendChild(content);

  return page;
}

/**
 * Renders the current route's page
 */
function renderCurrentPage(): void {
  if (!contentElement) return;

  const route = getCurrentRoute() || 'home';
  const renderPage = pages[route] ?? (() => createPlaceholderPage('Not Found', 'Page not found.'));

  // Clear existing content
  contentElement.innerHTML = '';

  // Render new page
  const page = renderPage();
  contentElement.appendChild(page);

  // Scroll to top
  contentElement.scrollTop = 0;
}

/**
 * Creates the main content area element
 */
export function createMainContent(): HTMLElement {
  const main = document.createElement('main');
  main.className = 'dos-main';
  main.setAttribute('role', 'main');

  contentElement = main;

  // Listen for route changes
  onRouteChange(renderCurrentPage);

  // Initial render
  renderCurrentPage();

  return main;
}

/**
 * Register a page renderer for a route
 */
export function registerPage(route: string, renderer: () => HTMLElement): void {
  pages[route] = renderer;
}
