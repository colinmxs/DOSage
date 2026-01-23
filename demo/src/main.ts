/**
 * DOSage Kitchen Sink Demo - Main Entry Point
 */

import './styles.css';
import { createSidebar } from './components/Sidebar';
import { createMainContent } from './components/MainContent';
import { createThemePicker } from './components/ThemePicker';
import { initRouter, navigate, getCurrentRoute } from './utils/router';

// Initialize the application
function init(): void {
  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  // Create app shell structure
  app.innerHTML = '';
  app.className = 'dos-app';

  // Create header with theme picker
  const header = document.createElement('header');
  header.className = 'dos-app___header';

  const title = document.createElement('h1');
  title.className = 'dos-app___title';
  title.textContent = '█ DOSage Kitchen Sink █';

  const themePicker = createThemePicker();

  header.appendChild(title);
  header.appendChild(themePicker);

  // Create main layout container
  const layout = document.createElement('div');
  layout.className = 'dos-app___layout';

  // Create sidebar
  const sidebar = createSidebar();

  // Create main content area
  const main = createMainContent();

  layout.appendChild(sidebar);
  layout.appendChild(main);

  // Assemble the app
  app.appendChild(header);
  app.appendChild(layout);

  // Initialize routing
  initRouter();

  // Navigate to initial route
  const initialRoute = getCurrentRoute();
  navigate(initialRoute || 'home');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
