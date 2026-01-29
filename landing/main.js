import { 
  createContainer, 
  createHeading, 
  createText, 
  createButton, 
  createCard,
  createBox,
  createGrid,
  createGridItem,
  createASCIIArt,
  createBadge,
  createDivider,
  createProgressBar,
  createLoadingSpinner,
  createWindow,
  initTheme 
} from '@dosage/index.js';

// Import only essential DOSage styles
import './styles.css';

// Initialize the DOS theme
initTheme();

// Get the main app container
const app = document.getElementById('app');

// Boot sequence state
let bootComplete = false;
let windowTimers = new Map(); // Track auto-popup timers

// Create boot screen
function createBootScreen() {
  const bootContainer = createContainer({
    padding: { all: 'xl' },
    className: 'boot-screen'
  });

  // DOS-style boot header
  const bootHeader = createASCIIArt({
    text: 'DOSage',
    font: 'block'
  });

  const bootTitle = createText({
    children: 'DOSage Operating System v0.1.0',
    size: 'lg'
  });

  const bootSubtitle = createText({
    children: 'Copyright (C) 2026 DOSage Systems Inc.',
    size: 'sm'
  });

  // Boot messages container - use DOSage Box with border instead of custom styling
  const messagesBox = createBox({
    border: true,
    padding: 'md',
    height: 200
  });

  // Progress bar
  const progressContainer = createBox({
    padding: { y: 'md' }
  });
  
  const progressBar = createProgressBar({
    value: 0,
    max: 100,
    showValue: true,
    label: 'System Loading',
    style: 'blocks',
    size: 'small' // Try different size to see if it helps
  });

  progressContainer.appendChild(progressBar.element);

  // Loading spinner
  const spinnerContainer = createBox({
    padding: { y: 'md' },
    display: 'flex',
    className: 'center-content'
  });

  const spinner = createLoadingSpinner({
    style: 'ascii',
    size: 'large',
    label: 'Initializing DOSage components...'
  });

  spinnerContainer.appendChild(spinner.element);

  // Build boot screen
  bootContainer.appendChild(bootHeader);
  bootContainer.appendChild(bootTitle);
  bootContainer.appendChild(bootSubtitle);
  bootContainer.appendChild(messagesBox);
  bootContainer.appendChild(progressContainer);
  bootContainer.appendChild(spinnerContainer);

  // Add status bar container for "Press any key" message using DOSage components
  const statusBar = createBox({
    padding: { top: 'lg' },
    display: 'flex',
    className: 'center-content'
  });

  bootContainer.appendChild(statusBar);

  return { bootContainer, messagesBox, progressBar, spinner, statusBar };
}

// Boot sequence messages
const bootMessages = [
  'Detecting DOSage components... OK',
  'Loading theme system... OK', 
  'Initializing retro graphics... OK',
  'Checking for Y2K compliance... OK',
  'Loading 640K of awesome... OK',
  'Calibrating floppy disk drives... OK',
  'Starting Windows 95 emulation... FAILED',
  'Starting Windows 98 emulation... FAILED', 
  'Starting MS-DOS 6.22... SUCCESS!',
  'Loading DOSage UI library... OK',
  'Preparing annoying popup windows... OK',
  'System ready.'
];

// Run boot sequence
async function runBootSequence() {
  const { bootContainer, messagesBox, progressBar, spinner, statusBar } = createBootScreen();
  app.appendChild(bootContainer);

  // Add boot messages with delays
  for (let i = 0; i < bootMessages.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    
    const messageText = createText({
      children: bootMessages[i],
      className: 'boot-message'
    });
    messagesBox.appendChild(messageText);
    
    // Update progress
    const progress = Math.floor(((i + 1) / bootMessages.length) * 100);
    progressBar.setValue(progress);
    
    // Scroll to bottom
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  // Wait a moment, then show "Press any key"
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Stop spinner
  spinner.stop();
  
  // Add blinking "Press any key" message to status bar (not in scrolling area!)
  const pressKeyText = createText({
    children: 'Press any key to continue...',
    align: 'center',
    className: 'press-key-blink'
  });
  statusBar.appendChild(pressKeyText);

  // Wait for any key press or click
  return new Promise(resolve => {
    const handleInput = () => {
      document.removeEventListener('keydown', handleInput);
      document.removeEventListener('click', handleInput);
      bootContainer.remove();
      bootComplete = true;
      resolve();
    };
    
    document.addEventListener('keydown', handleInput);
    document.addEventListener('click', handleInput);
  });
}

// Create the main DOS desktop interface
function createMainContent() {
  // Create main container - keep it centered like boot sequence
  const container = createContainer({
    maxWidth: '1000px',
    padding: { all: 'xl' },
    centered: true,
    className: 'dos-desktop'
  });

  // DOS-style system header
  const systemHeader = createBox({
    padding: { bottom: 'lg' },
    display: 'flex',
    className: 'center-content'
  });

  const systemTitle = createHeading({
    level: 2,
    children: 'DOSage System Desktop',
    align: 'center'
  });
  systemHeader.appendChild(systemTitle);

  // System info panel (like DOS system info)
  const systemInfoPanel = createBox({
    border: true,
    padding: 'lg',
    className: 'system-info-panel'
  });

  const systemInfoTitle = createText({
    children: 'SYSTEM INFORMATION',
    size: 'lg',
    align: 'center'
  });

  // Use DOSage Box for spacing instead of custom CSS
  const systemInfoGridContainer = createBox({
    padding: { top: 'md' }
  });

  const systemInfoGrid = createGrid({
    columns: 2,
    gap: 'md'
  });

  // System info items
  const infoItems = [
    ['System Name:', 'DOSage UI Library'],
    ['Version:', 'v0.1.0'],
    ['Components:', '60+ Available'],
    ['Memory:', '640K of Awesome'],
    ['Graphics:', 'Retro VGA Mode'],
    ['Status:', 'Ready for Development']
  ];

  infoItems.forEach(([label, value]) => {
    const labelItem = createGridItem();
    const valueItem = createGridItem();
    
    const labelText = createText({ children: label });
    const valueText = createText({ children: value });
    
    labelItem.appendChild(labelText);
    valueItem.appendChild(valueText);
    
    systemInfoGrid.appendChild(labelItem);
    systemInfoGrid.appendChild(valueItem);
  });

  systemInfoGridContainer.appendChild(systemInfoGrid);
  systemInfoPanel.appendChild(systemInfoTitle);
  systemInfoPanel.appendChild(systemInfoGridContainer);

  // Available programs section (replaces the old nav cards)
  const programsSection = createBox({
    padding: { top: 'xl' }
  });

  const programsTitle = createHeading({
    level: 3,
    children: 'Available Programs',
    align: 'center'
  });

  // Use DOSage Box for spacing instead of custom CSS
  const programsNoteContainer = createBox({
    padding: { top: 'sm' }
  });

  const programsNote = createText({
    children: 'Click on any program icon to launch. Programs will auto-restart if closed.',
    size: 'sm',
    align: 'center'
  });

  programsNoteContainer.appendChild(programsNote);
  programsSection.appendChild(programsTitle);
  programsSection.appendChild(programsNoteContainer);

  // DOS-style command prompt area
  const commandSection = createBox({
    padding: { top: 'xl' }
  });

  const commandPrompt = createBox({
    border: true,
    padding: 'md'
  });

  const promptText = createText({
    children: 'C:\\DOSAGE> Welcome to DOSage - Retro UI Library for Modern Web Development\nC:\\DOSAGE> Built with TypeScript • Zero Dependencies • 60+ Components\nC:\\DOSAGE> Ready for your next retro project!\nC:\\DOSAGE> _',
    className: 'command-prompt-text'
  });

  commandPrompt.appendChild(promptText);
  commandSection.appendChild(commandPrompt);

  // Build the desktop
  container.appendChild(systemHeader);
  container.appendChild(systemInfoPanel);
  container.appendChild(programsSection);
  container.appendChild(commandSection);

  return container;
}

// Create popup windows for navigation
function createPopupWindows() {
  const windows = [];

  // Documentation Window
  const docsWindow = createWindow({
    title: '📚 API Documentation',
    width: 350,
    height: 250,
    x: getRandomPosition().x,
    y: getRandomPosition().y,
    draggable: true,
    resizable: false,
    content: createWindowContent(
      'Complete reference for all DOSage components, props, and methods. Perfect for developers who want to dive deep into the library.',
      'Browse Documentation',
      () => window.location.href = '/docs/'
    ),
    onClose: () => scheduleWindowReopen('docs', createDocsWindow)
  });

  // Demo Window  
  const demoWindow = createWindow({
    title: '🎮 Interactive Demo',
    width: 350,
    height: 250,
    x: getRandomPosition().x,
    y: getRandomPosition().y,
    draggable: true,
    resizable: false,
    content: createWindowContent(
      'Try out all DOSage components in an interactive playground. See the library in action and experiment with different configurations.',
      'Launch Demo',
      () => window.location.href = '/demo/'
    ),
    onClose: () => scheduleWindowReopen('demo', createDemoWindow)
  });

  // Examples Window
  const examplesWindow = createWindow({
    title: '🤖 Genesis AI Example',
    width: 350,
    height: 250,
    x: getRandomPosition().x,
    y: getRandomPosition().y,
    draggable: true,
    resizable: false,
    content: createWindowContent(
      'A complete application built with DOSage showcasing real-world usage patterns and advanced component combinations.',
      'View Example',
      () => window.location.href = '/examples/genesis-ai/'
    ),
    onClose: () => scheduleWindowReopen('examples', createExamplesWindow)
  });

  windows.push(
    { id: 'docs', window: docsWindow },
    { id: 'demo', window: demoWindow },
    { id: 'examples', window: examplesWindow }
  );

  return windows;
}

// Individual window creators for recreation
function createDocsWindow(position = null) {
  const windowId = 'docs-' + Date.now(); // Unique ID
  const pos = position || getRandomPosition();
  const window = createWindow({
    title: '📚 API Documentation',
    width: 350,
    height: 250,
    x: pos.x,
    y: pos.y,
    draggable: true,
    resizable: false,
    id: windowId, // Ensure unique ID
    content: createWindowContent(
      'Complete reference for all DOSage components, props, and methods. Perfect for developers who want to dive deep into the library.',
      'Browse Documentation',
      () => window.location.href = '/docs/'
    ),
    onClose: () => {
      // Just remove from DOM, don't call destroy() which might break dragging
      if (window.element && window.element.parentNode) {
        window.element.parentNode.removeChild(window.element);
      }
      scheduleWindowReopen('docs', createDocsWindow);
    }
  });
  return window;
}

function createDemoWindow(position = null) {
  const windowId = 'demo-' + Date.now(); // Unique ID
  const pos = position || getRandomPosition();
  const window = createWindow({
    title: '🎮 Interactive Demo',
    width: 350,
    height: 250,
    x: pos.x,
    y: pos.y,
    draggable: true,
    resizable: false,
    id: windowId, // Ensure unique ID
    content: createWindowContent(
      'Try out all DOSage components in an interactive playground. See the library in action and experiment with different configurations.',
      'Launch Demo',
      () => window.location.href = '/demo/'
    ),
    onClose: () => {
      // Just remove from DOM, don't call destroy() which might break dragging
      if (window.element && window.element.parentNode) {
        window.element.parentNode.removeChild(window.element);
      }
      scheduleWindowReopen('demo', createDemoWindow);
    }
  });
  return window;
}

function createExamplesWindow(position = null) {
  const windowId = 'examples-' + Date.now(); // Unique ID
  const pos = position || getRandomPosition();
  const window = createWindow({
    title: '🤖 Genesis AI Example',
    width: 350,
    height: 250,
    x: pos.x,
    y: pos.y,
    draggable: true,
    resizable: false,
    id: windowId, // Ensure unique ID
    content: createWindowContent(
      'A complete application built with DOSage showcasing real-world usage patterns and advanced component combinations.',
      'View Example',
      () => window.location.href = '/examples/genesis-ai/'
    ),
    onClose: () => {
      // Just remove from DOM, don't call destroy() which might break dragging
      if (window.element && window.element.parentNode) {
        window.element.parentNode.removeChild(window.element);
      }
      scheduleWindowReopen('examples', createExamplesWindow);
    }
  });
  return window;
}

// Fun randomization utilities!
function getRandomPosition() {
  // Get viewport dimensions
  const maxX = Math.max(100, window.innerWidth - 400); // Leave room for window width
  const maxY = Math.max(100, window.innerHeight - 300); // Leave room for window height
  
  return {
    x: Math.floor(Math.random() * maxX) + 50, // At least 50px from left
    y: Math.floor(Math.random() * maxY) + 50  // At least 50px from top
  };
}

// Even more chaotic positioning for extra silliness
function getChaosPosition() {
  const positions = [
    { x: 50, y: 50 },     // Top-left
    { x: 400, y: 50 },    // Top-right-ish
    { x: 50, y: 300 },    // Bottom-left-ish
    { x: 300, y: 200 },   // Center-ish
    { x: 150, y: 100 },   // Random spot 1
    { x: 250, y: 250 },   // Random spot 2
    { x: 100, y: 400 },   // Lower area
    { x: 350, y: 150 }    // Right area
  ];
  
  return positions[Math.floor(Math.random() * positions.length)];
}

// Create window content
function createWindowContent(description, buttonText, onClick) {
  const contentBox = createBox({
    padding: 'md',
    display: 'flex',
    className: 'window-content'
  });

  const descText = createText({
    children: description,
    className: 'window-description'
  });

  const buttonBox = createBox({
    padding: { top: 'md' },
    display: 'flex',
    className: 'center-content'
  });

  const button = createButton({
    label: buttonText,
    variant: 'primary',
    onClick: onClick
  });

  buttonBox.appendChild(button);
  contentBox.appendChild(descText);
  contentBox.appendChild(buttonBox);

  return contentBox;
}

// Schedule window to reopen after being closed
function scheduleWindowReopen(windowId, windowCreatorFn) {
  // Clear any existing timer
  if (windowTimers.has(windowId)) {
    clearTimeout(windowTimers.get(windowId));
  }

  // Set new timer (1-3 seconds) - MUCH more annoying!
  const delay = 1000 + Math.random() * 2000;
  const timer = setTimeout(() => {
    if (bootComplete) {
      // Get position first
      const position = getChaosPosition();
      
      // Create window with the position already set (don't call setPosition later)
      const newWindow = windowCreatorFn(position);
      
      // Add to DOM and show - NO FOCUSING AT ALL
      document.body.appendChild(newWindow.element);
      newWindow.open();
      
      // No focus calls - let user focus manually
    }
    windowTimers.delete(windowId);
  }, delay);

  windowTimers.set(windowId, timer);
}

// Show popup windows with staggered timing
function showPopupWindows(windows) {
  windows.forEach((item, index) => {
    setTimeout(() => {
      document.body.appendChild(item.window.element);
      item.window.open();
      
      // Focus the first window
      if (index === 0) {
        setTimeout(() => item.window.focus(), 100);
      }
    }, index * 1000 + 2000); // Stagger by 1 second each, start after 2 seconds
  });
}

// Main initialization
async function init() {
  // Run boot sequence
  await runBootSequence();
  
  // Show main content
  const mainContent = createMainContent();
  app.appendChild(mainContent);
  
  // Create and show popup windows
  const windows = createPopupWindows();
  showPopupWindows(windows);
}

// Start the experience!
init();

