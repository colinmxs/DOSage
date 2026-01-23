/**
 * DOSage Kitchen Sink Application
 * 
 * Interactive showcase and testing ground for all DOSage components.
 */

import { initTheme, applyTheme, presetThemes } from '../../src/theme';
import { renderNavigation } from './components/Navigation';
import { renderThemeSwitcher } from './components/ThemeSwitcher';
import { renderHeader } from './components/Header';
import { renderComponentShowcase } from './components/ComponentShowcase';

// Initialize the default theme
initTheme('dos-blue');

// App state
const state = {
  currentSection: 'welcome',
  currentTheme: 'dos-blue',
};

// Render the application
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="kitchen-sink">
      ${renderHeader()}
      <div class="kitchen-sink-container">
        ${renderNavigation(state.currentSection)}
        <main class="kitchen-sink-content">
          ${renderThemeSwitcher(state.currentTheme)}
          ${renderComponentShowcase(state.currentSection)}
        </main>
      </div>
    </div>
  `;

  attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
  // Navigation listeners
  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = (e.target as HTMLElement).getAttribute('data-nav-link');
      if (section) {
        state.currentSection = section;
        render();
      }
    });
  });

  // Theme switcher listeners
  const themeButtons = document.querySelectorAll('[data-theme]');
  themeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const themeName = (e.target as HTMLElement).getAttribute('data-theme');
      if (themeName) {
        state.currentTheme = themeName;
        applyTheme(themeName);
        render();
      }
    });
  });
}

// Initial render
render();

// Hot module replacement for Vite
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    try {
      render();
    } catch (error) {
      console.error('Error during hot module replacement:', error);
    }
  });
}
