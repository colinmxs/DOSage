/**
 * Genesis AI - Application Entry Point
 * A retro-styled AI chatbot interface built with DOSage
 */

import './styles.css';
import { App } from './app';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');

  if (!appContainer) {
    console.error('App container not found!');
    return;
  }

  // Initialize the application
  const app = new App(appContainer);

  // Store reference for debugging
  (window as any).__genesisApp = app;

  console.log('Genesis AI initialized successfully!');
});
