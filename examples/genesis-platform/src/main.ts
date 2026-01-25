/**
 * Genesis Platform - Main Entry Point
 */

import './styles.css';
import { initTheme, createPanel, getPanelContent, createHeading, createText, createButton } from 'dosage';

// Initialize the application
function init(): void {
  // Initialize DOSage theme system
  initTheme();

  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  // Create a welcome panel
  const panel = createPanel({
    title: '═══ GENESIS PLATFORM ═══',
    borderStyle: 'double',
    shadow: true,
    padding: 'lg',
  });


  app.appendChild(panel);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
