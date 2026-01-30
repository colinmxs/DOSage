import { 
  createContainer, 
  createHeading, 
  createText, 
  createButton, 
  createBox,
  createGrid,
  createGridItem,
  createASCIIArt,
  createProgressBar,
  createLoadingSpinner,
  createPanel,
  createLink,
  getPanelContent,
  initTheme 
} from '@dosage/index.js';

// Import only essential DOSage styles
import './styles.css';

// Initialize the DOS theme
initTheme();

// Get the main app container
const app = document.getElementById('app');

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
  'Initializing program launcher... OK',
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

  // DOS-style command prompt area with all the important info
  const commandSection = createBox({
    padding: { top: 'lg' }
  });

  const commandPrompt = createBox({
    border: true,
    padding: 'md'
  });

  // Create the command prompt content with inline GitHub link
  const promptContainer = document.createElement('div');
  promptContainer.className = 'command-prompt-text';
  
  const promptContent = `C:\\DOSAGE> Welcome to DOSage - Retro UI Library for Modern Web Development
C:\\DOSAGE> Built with TypeScript • Zero Dependencies • 60+ Components
C:\\DOSAGE> Ready for your next retro project!
C:\\DOSAGE> 
C:\\DOSAGE> GitHub: `;

  const endContent = `
C:\\DOSAGE> _`;

  // Create text node for the beginning
  const startText = document.createTextNode(promptContent);
  
  // Create the GitHub link using DOSage Link component
  const githubLink = createLink({
    href: 'https://github.com/colinmxs/DOSage',
    label: 'https://github.com/colinmxs/DOSage',
    external: true
  });
  
  // Create text node for the end
  const endText = document.createTextNode(endContent);
  
  // Append all parts to the container
  promptContainer.appendChild(startText);
  promptContainer.appendChild(githubLink);
  promptContainer.appendChild(endText);

  commandPrompt.appendChild(promptContainer);
  commandSection.appendChild(commandPrompt);

  // Create fixed program panels using Panel components
  const programPanelsContainer = createBox({
    padding: { top: 'lg' },
    display: 'flex'
  });

  // Create the three program panels
  const docsPanel = createProgramPanel(
    '📚 API Documentation',
    'Complete reference for all DOSage components, props, and methods. Perfect for developers who want to dive deep into the library.',
    'Browse Documentation',
    () => window.location.href = '/docs/index.html'
  );

  const demoPanel = createProgramPanel(
    '🎮 Interactive Demo', 
    'Try out all DOSage components in an interactive playground. See the library in action and experiment with different configurations.',
    'Launch Demo',
    () => window.location.href = '/demo/index.html'
  );

  const examplesPanel = createProgramPanel(
    '🤖 Genesis AI Example',
    'A complete application built with DOSage showcasing real-world usage patterns and advanced component combinations.',
    'View Example',
    () => window.location.href = '/examples/genesis-ai/index.html'
  );

  programPanelsContainer.appendChild(docsPanel);
  programPanelsContainer.appendChild(demoPanel);
  programPanelsContainer.appendChild(examplesPanel);

  // Build the desktop
  container.appendChild(systemHeader);
  container.appendChild(commandSection);
  container.appendChild(programPanelsContainer);

  return container;
}

// Create a fixed program panel using Panel component
function createProgramPanel(title, description, buttonText, onClick) {
  const panel = createPanel({
    title: title
  });

  // Get the panel content area
  const panelContent = getPanelContent(panel);

  // Add description text
  const descText = createText({
    children: description
  });

  // Add some spacing
  const spacer = createText({
    children: ' '
  });

  // Add button
  const button = createButton({
    label: buttonText,
    onClick: onClick
  });

  // Add content to panel
  panelContent.appendChild(descText);
  panelContent.appendChild(spacer);
  panelContent.appendChild(button);

  return panel;
}

// Main initialization
async function init() {
  // Run boot sequence
  await runBootSequence();
  
  // Show main content
  const mainContent = createMainContent();
  app.appendChild(mainContent);
}

// Start the experience!
init();

