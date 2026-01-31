/**
 * Feedback Components Page
 *
 * Demonstrates Modal, Window, Alert, Toast, Tooltip, Popover,
 * ProgressBar, LoadingSpinner, and SkeletonLoader components.
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createModal,
  showAlert,
  showConfirm,
  showPrompt,
  createButton,
  createWindow,
  createAlert,
  createToast,
  createToastContainer,
  toast,
  createTooltip,
  createPopover,
  createProgressBar,
  createLoadingSpinner,
  createSkeletonLoader,
} from 'dosage';

// Track tooltips for cleanup
const activeTooltips: ReturnType<typeof createTooltip>[] = [];

/**
 * Renders the Modal demo page
 */
export function renderModalPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Modal';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style modal dialogs with focus trapping, keyboard navigation, and ARIA support.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Modal Example
  const basicSection = createDemoSection({
    title: 'Basic Modal',
    description: 'A simple modal with title, content, and close button.',
    code: `import { createModal, createButton } from 'dosage';

const modal = createModal({
  title: 'Hello World',
  content: 'This is a basic modal dialog.',
  closable: true,
  onClose: () => console.log('Modal closed')
});

// Append modal to body (required for positioning)
document.body.appendChild(modal.element);

// Open the modal
modal.open();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const openBtn = createButton({
      label: 'Open Basic Modal',
      onClick: () => {
        const modal = createModal({
          title: 'Hello World',
          content: 'This is a basic modal dialog. Press Escape or click the X button to close.',
          closable: true,
        });
        document.body.appendChild(modal.element);
        modal.open();
      },
    });
    basicExample.appendChild(openBtn);
  }
  content.appendChild(basicSection);

  // Modal Sizes
  const sizesSection = createDemoSection({
    title: 'Modal Sizes',
    description: 'Modals come in four sizes: small, medium (default), large, and fullscreen.',
    code: `createModal({ size: 'small', title: 'Small Modal', content: '...' });
createModal({ size: 'medium', title: 'Medium Modal', content: '...' });
createModal({ size: 'large', title: 'Large Modal', content: '...' });
createModal({ size: 'fullscreen', title: 'Fullscreen Modal', content: '...' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.flexWrap = 'wrap';
    sizesExample.style.gap = 'var(--dos-space-sm)';

    const sizes = ['small', 'medium', 'large', 'fullscreen'] as const;
    sizes.forEach((size) => {
      const btn = createButton({
        label: `${size.charAt(0).toUpperCase() + size.slice(1)}`,
        onClick: () => {
          const modal = createModal({
            title: `${size.charAt(0).toUpperCase() + size.slice(1)} Modal`,
            content: `This is a ${size}-sized modal. The content area adjusts to fit the modal size.`,
            size,
            closable: true,
          });
          document.body.appendChild(modal.element);
          modal.open();
        },
      });
      sizesExample.appendChild(btn);
    });
  }
  content.appendChild(sizesSection);

  // Modal with Custom Footer
  const footerSection = createDemoSection({
    title: 'Modal with Custom Footer',
    description: 'Add custom footer content with action buttons.',
    code: `const footer = document.createElement('div');
footer.style.display = 'flex';
footer.style.gap = 'var(--dos-space-sm)';
footer.style.justifyContent = 'flex-end';

const cancelBtn = createButton({
  label: 'Cancel',
  variant: 'secondary',
  onClick: () => modal.close()
});

const confirmBtn = createButton({
  label: 'Confirm',
  variant: 'primary',
  onClick: () => {
    console.log('Confirmed!');
    modal.close();
  }
});

footer.appendChild(cancelBtn);
footer.appendChild(confirmBtn);

const modal = createModal({
  title: 'Confirm Action',
  content: 'Are you sure you want to proceed?',
  footer,
  closable: true
});`,
  });

  const footerExample = footerSection.querySelector('.dos-demo-section___examples');
  if (footerExample) {
    const openBtn = createButton({
      label: 'Open Modal with Footer',
      onClick: () => {
        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.gap = 'var(--dos-space-sm)';
        footer.style.justifyContent = 'flex-end';

        const modal = createModal({
          title: 'Confirm Action',
          content: 'Are you sure you want to proceed with this action? This cannot be undone.',
          footer,
          closable: true,
        });

        const cancelBtn = createButton({
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => modal.close(),
        });

        const confirmBtn = createButton({
          label: 'Confirm',
          variant: 'primary',
          onClick: () => {
            console.log('Confirmed!');
            modal.close();
          },
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);

        document.body.appendChild(modal.element);
        modal.open();
      },
    });
    footerExample.appendChild(openBtn);
  }
  content.appendChild(footerSection);

  // Alert Dialog
  const alertSection = createDemoSection({
    title: 'Alert Dialog',
    description: 'Quick method to show alert messages to users.',
    code: `import { showAlert } from 'dosage';

// Basic alert
showAlert('Operation completed successfully!');

// Alert with custom title
showAlert('File not found. Please check the path and try again.', 'Error');`,
  });

  const alertExample = alertSection.querySelector('.dos-demo-section___examples');
  if (alertExample) {
    alertExample.style.display = 'flex';
    alertExample.style.flexWrap = 'wrap';
    alertExample.style.gap = 'var(--dos-space-sm)';

    const infoBtn = createButton({
      label: 'Show Info Alert',
      onClick: () => showAlert('Operation completed successfully!'),
    });

    const errorBtn = createButton({
      label: 'Show Error Alert',
      variant: 'danger',
      onClick: () => showAlert('File not found. Please check the path and try again.', 'Error'),
    });

    alertExample.appendChild(infoBtn);
    alertExample.appendChild(errorBtn);
  }
  content.appendChild(alertSection);

  // Confirm Dialog
  const confirmSection = createDemoSection({
    title: 'Confirm Dialog',
    description: 'Ask users to confirm or cancel an action. Returns a Promise.',
    code: `import { showConfirm } from 'dosage';

const confirmed = await showConfirm('Are you sure you want to delete this file?');

if (confirmed) {
  console.log('User confirmed');
} else {
  console.log('User cancelled');
}`,
  });

  const confirmExample = confirmSection.querySelector('.dos-demo-section___examples');
  if (confirmExample) {
    const confirmBtn = createButton({
      label: 'Show Confirm Dialog',
      onClick: async () => {
        const confirmed = await showConfirm('Are you sure you want to delete this file?');
        if (confirmed) {
          showAlert('File deleted!', 'Success');
        } else {
          showAlert('Operation cancelled.', 'Info');
        }
      },
    });
    confirmExample.appendChild(confirmBtn);
  }
  content.appendChild(confirmSection);

  // Prompt Dialog
  const promptSection = createDemoSection({
    title: 'Prompt Dialog',
    description: 'Get text input from users. Returns the input value or null if cancelled.',
    code: `import { showPrompt } from 'dosage';

const name = await showPrompt('Enter your name:', 'User Input', 'Anonymous');

if (name !== null) {
  console.log(\`Hello, \${name}!\`);
}`,
  });

  const promptExample = promptSection.querySelector('.dos-demo-section___examples');
  if (promptExample) {
    const promptBtn = createButton({
      label: 'Show Prompt Dialog',
      onClick: async () => {
        const name = await showPrompt('Enter your name:', 'User Input', 'Anonymous');
        if (name !== null) {
          showAlert(`Hello, ${name}!`, 'Greeting');
        }
      },
    });
    promptExample.appendChild(promptBtn);
  }
  content.appendChild(promptSection);

  // Close Options
  const closeOptionsSection = createDemoSection({
    title: 'Close Options',
    description: 'Configure how the modal can be closed.',
    code: `// Modal that cannot be closed by clicking overlay
createModal({
  title: 'Important',
  content: 'This modal can only be closed with the X button or Escape key.',
  closeOnOverlay: false
});

// Modal that cannot be closed with Escape
createModal({
  title: 'Protected',
  content: 'Escape key is disabled. Click X to close.',
  closeOnEscape: false
});`,
  });

  const closeOptionsExample = closeOptionsSection.querySelector('.dos-demo-section___examples');
  if (closeOptionsExample) {
    closeOptionsExample.style.display = 'flex';
    closeOptionsExample.style.flexWrap = 'wrap';
    closeOptionsExample.style.gap = 'var(--dos-space-sm)';

    const overlayBtn = createButton({
      label: 'No Overlay Close',
      onClick: () => {
        const modal = createModal({
          title: 'Click Overlay Test',
          content: 'Try clicking the dark overlay. This modal will NOT close. Use the X button or Escape key.',
          closeOnOverlay: false,
          closable: true,
        });
        document.body.appendChild(modal.element);
        modal.open();
      },
    });

    const escapeBtn = createButton({
      label: 'No Escape Close',
      onClick: () => {
        const modal = createModal({
          title: 'Escape Key Test',
          content: 'Try pressing Escape. This modal will NOT close. Click the X button or the overlay.',
          closeOnEscape: false,
          closable: true,
        });
        document.body.appendChild(modal.element);
        modal.open();
      },
    });

    closeOptionsExample.appendChild(overlayBtn);
    closeOptionsExample.appendChild(escapeBtn);
  }
  content.appendChild(closeOptionsSection);

  // Accessibility Notes
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Modal includes comprehensive accessibility features.',
    code: `// Accessibility features included:
// - role="dialog" and aria-modal="true"
// - aria-labelledby pointing to title
// - aria-describedby pointing to content
// - Focus trapping within modal
// - Focus restoration on close
// - Escape key to close
// - Body scroll lock when open`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const featuresList = document.createElement('ul');
    featuresList.style.margin = '0';
    featuresList.style.paddingLeft = 'var(--dos-space-md)';
    
    const features = [
      'role="dialog" and aria-modal="true" for screen readers',
      'aria-labelledby and aria-describedby for context',
      'Focus trapping keeps keyboard users within modal',
      'Focus returns to trigger element on close',
      'Escape key closes the modal',
      'Body scroll is locked while modal is open',
    ];
    
    features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      li.style.marginBottom = 'var(--dos-space-xs)';
      featuresList.appendChild(li);
    });
    
    a11yExample.appendChild(featuresList);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Window demo page
 */
export function renderWindowPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Window';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style draggable, resizable windows with title bar controls.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Create a container for the windows (positioned relative)
  const windowContainer = document.createElement('div');
  windowContainer.style.position = 'relative';
  windowContainer.style.height = '400px';
  windowContainer.style.border = '1px dashed var(--dos-color-border)';
  windowContainer.style.marginBottom = 'var(--dos-space-md)';
  windowContainer.style.overflow = 'hidden';

  // Basic Window Example
  const basicSection = createDemoSection({
    title: 'Basic Window',
    description: 'A simple window with title bar, minimize, maximize, and close buttons.',
    code: `import { createWindow } from 'dosage';

const window = createWindow({
  title: 'My Window',
  content: 'Hello, this is window content!',
  x: 50,
  y: 50,
  width: 300,
  height: 200
});

document.body.appendChild(window.element);
window.open();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const openBtn = createButton({
      label: 'Open Window',
      onClick: () => {
        const win = createWindow({
          title: 'My Window',
          content: 'Hello! This is a DOS-style window. You can drag it by the title bar, resize by edges, and use the control buttons.',
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          width: 350,
          height: 200,
        });
        windowContainer.appendChild(win.element);
        win.open();
      },
    });
    basicExample.appendChild(openBtn);
    basicExample.appendChild(windowContainer);
  }
  content.appendChild(basicSection);

  // Window Options
  const optionsSection = createDemoSection({
    title: 'Window Options',
    description: 'Configure window controls and behavior.',
    code: `// Non-closable window
createWindow({
  title: 'Cannot Close',
  showClose: false
});

// Non-resizable, non-draggable
createWindow({
  title: 'Static Window',
  draggable: false,
  resizable: false
});

// Minimal window (no controls)
createWindow({
  title: 'Minimal',
  showMinimize: false,
  showMaximize: false,
  showClose: false
});`,
  });

  const optionsExample = optionsSection.querySelector('.dos-demo-section___examples');
  if (optionsExample) {
    optionsExample.style.display = 'flex';
    optionsExample.style.flexWrap = 'wrap';
    optionsExample.style.gap = 'var(--dos-space-sm)';

    const nonClosableBtn = createButton({
      label: 'No Close Button',
      onClick: () => {
        const win = createWindow({
          title: 'Cannot Close (Use minimize/restore)',
          content: 'This window has no close button. Use minimize or maximize to interact.',
          showClose: false,
          x: 30,
          y: 30,
          width: 320,
          height: 180,
        });
        windowContainer.appendChild(win.element);
        win.open();
      },
    });

    const staticBtn = createButton({
      label: 'Static Window',
      onClick: () => {
        const win = createWindow({
          title: 'Static Window',
          content: 'This window cannot be dragged or resized. It stays in place.',
          draggable: false,
          resizable: false,
          x: 80,
          y: 80,
          width: 280,
          height: 150,
        });
        windowContainer.appendChild(win.element);
        win.open();
      },
    });

    const minimalBtn = createButton({
      label: 'Minimal Window',
      onClick: () => {
        const win = createWindow({
          title: 'Minimal Window',
          content: 'This window has no control buttons at all.',
          showMinimize: false,
          showMaximize: false,
          showClose: false,
          x: 120,
          y: 40,
          width: 250,
          height: 140,
        });
        windowContainer.appendChild(win.element);
        win.open();
      },
    });

    optionsExample.appendChild(nonClosableBtn);
    optionsExample.appendChild(staticBtn);
    optionsExample.appendChild(minimalBtn);
  }
  content.appendChild(optionsSection);

  // Window States
  const statesSection = createDemoSection({
    title: 'Window States',
    description: 'Windows can be normal, minimized, or maximized.',
    code: `// Start minimized
createWindow({
  title: 'Starts Minimized',
  state: 'minimized'
});

// Programmatic control
const win = createWindow({ title: 'Test' });
win.minimize();
win.maximize();
win.restore();`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    statesExample.style.display = 'flex';
    statesExample.style.flexWrap = 'wrap';
    statesExample.style.gap = 'var(--dos-space-sm)';

    const minimizedBtn = createButton({
      label: 'Start Minimized',
      onClick: () => {
        const win = createWindow({
          title: 'I Started Minimized',
          content: 'Click the restore button (□) to see me!',
          state: 'minimized',
          x: 50,
          y: 100,
          width: 300,
          height: 180,
        });
        windowContainer.appendChild(win.element);
        win.open();
      },
    });

    statesExample.appendChild(minimizedBtn);
  }
  content.appendChild(statesSection);

  // Callbacks
  const callbacksSection = createDemoSection({
    title: 'Event Callbacks',
    description: 'React to window events like close, move, and resize.',
    code: `createWindow({
  title: 'Events Demo',
  onClose: () => console.log('Window closed'),
  onMinimize: () => console.log('Window minimized'),
  onMaximize: () => console.log('Window maximized'),
  onMove: (pos) => console.log('Moved to:', pos),
  onResize: (size) => console.log('Resized to:', size),
  onFocus: () => console.log('Window focused')
});`,
  });

  const callbacksExample = callbacksSection.querySelector('.dos-demo-section___examples');
  if (callbacksExample) {
    const eventsBtn = createButton({
      label: 'Open Events Demo Window',
      onClick: () => {
        const log = document.createElement('div');
        log.style.padding = 'var(--dos-space-xs)';
        log.style.fontSize = 'var(--dos-font-size-sm)';
        log.style.maxHeight = '100px';
        log.style.overflow = 'auto';

        const addLog = (msg: string) => {
          const line = document.createElement('div');
          line.textContent = `> ${msg}`;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };

        const win = createWindow({
          title: 'Events Demo',
          content: log,
          x: 60,
          y: 60,
          width: 320,
          height: 200,
          onClose: () => showAlert('Window was closed!'),
          onMinimize: () => addLog('minimized'),
          onMaximize: () => addLog('maximized'),
          onRestore: () => addLog('restored'),
          onMove: (pos) => addLog(`moved to ${pos.x}, ${pos.y}`),
          onResize: (size) => addLog(`resized to ${size.width}x${size.height}`),
          onFocus: () => addLog('focused'),
        });

        addLog('Window opened - try interacting!');
        windowContainer.appendChild(win.element);
        win.open();
      },
    });
    callbacksExample.appendChild(eventsBtn);
  }
  content.appendChild(callbacksSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Window includes comprehensive accessibility features.',
    code: `// Accessibility features included:
// - role="dialog" for proper semantics
// - aria-labelledby pointing to title
// - Keyboard accessible control buttons
// - Escape key closes window (when close button shown)
// - Tab navigation through controls`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const featuresList = document.createElement('ul');
    featuresList.style.margin = '0';
    featuresList.style.paddingLeft = 'var(--dos-space-md)';

    const features = [
      'role="dialog" for proper screen reader semantics',
      'aria-labelledby links to window title',
      'All control buttons are keyboard accessible',
      'Escape key closes window (when close button shown)',
      'Focus management within window',
    ];

    features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      li.style.marginBottom = 'var(--dos-space-xs)';
      featuresList.appendChild(li);
    });

    a11yExample.appendChild(featuresList);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Alert demo page
 */
export function renderAlertPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Alert';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style banner notifications for displaying info, success, warning, or error messages.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Alert container for demos
  const alertContainer = document.createElement('div');
  alertContainer.style.display = 'flex';
  alertContainer.style.flexDirection = 'column';
  alertContainer.style.gap = 'var(--dos-space-md)';
  alertContainer.style.marginBottom = 'var(--dos-space-lg)';

  // Alert Types Section
  const typesSection = createDemoSection({
    title: 'Alert Types',
    description: 'Four alert variants for different message types.',
    code: `import { createAlert } from 'dosage';

// Info alert
createAlert({
  message: 'This is an informational message.',
  type: 'info'
});

// Success alert
createAlert({
  message: 'Operation completed successfully!',
  type: 'success'
});

// Warning alert
createAlert({
  message: 'Please save your work.',
  type: 'warning'
});

// Error alert
createAlert({
  message: 'An error occurred.',
  type: 'error'
});`,
  });

  const typesExample = typesSection.querySelector('.dos-demo-section___examples');
  if (typesExample) {
    const types = ['info', 'success', 'warning', 'error'] as const;
    const messages = {
      info: 'This is an informational message.',
      success: 'Operation completed successfully!',
      warning: 'Please save your work before continuing.',
      error: 'An error occurred while processing your request.',
    };

    types.forEach((type) => {
      const alert = createAlert({
        message: messages[type],
        type,
      });
      typesExample.appendChild(alert.element);
    });
  }
  content.appendChild(typesSection);

  // With Titles
  const titlesSection = createDemoSection({
    title: 'Alerts with Titles',
    description: 'Add a title for more context.',
    code: `createAlert({
  message: 'Your session will expire in 5 minutes.',
  type: 'warning',
  title: 'Session Warning'
});`,
  });

  const titlesExample = titlesSection.querySelector('.dos-demo-section___examples');
  if (titlesExample) {
    const alert = createAlert({
      message: 'Your session will expire in 5 minutes. Please save your work.',
      type: 'warning',
      title: 'Session Warning',
    });
    titlesExample.appendChild(alert.element);
  }
  content.appendChild(titlesSection);

  // Dismissible Alerts
  const dismissSection = createDemoSection({
    title: 'Dismissible Alerts',
    description: 'Users can dismiss alerts with a close button.',
    code: `createAlert({
  message: 'This alert can be dismissed.',
  type: 'info',
  dismissible: true,
  onDismiss: () => console.log('Alert dismissed')
});`,
  });

  const dismissExample = dismissSection.querySelector('.dos-demo-section___examples');
  if (dismissExample) {
    const createDismissibleAlert = () => {
      const alert = createAlert({
        message: 'Click the [X] button to dismiss this alert.',
        type: 'info',
        dismissible: true,
        onDismiss: () => {
          // Show a replacement message
          showAlert('Alert was dismissed!');
        },
      });
      return alert.element;
    };

    dismissExample.appendChild(createDismissibleAlert());

    // Button to recreate dismissed alert
    const resetBtn = createButton({
      label: 'Show Dismissible Alert',
      onClick: () => {
        const existing = dismissExample.querySelector('.dos-alert');
        if (!existing) {
          dismissExample.insertBefore(createDismissibleAlert(), dismissExample.firstChild);
        }
      },
    });
    resetBtn.style.marginTop = 'var(--dos-space-md)';
    dismissExample.appendChild(resetBtn);
  }
  content.appendChild(dismissSection);

  // Custom Icons
  const iconsSection = createDemoSection({
    title: 'Custom Icons',
    description: 'Use custom icons or hide the icon entirely.',
    code: `// Custom icon
createAlert({
  message: 'Custom icon alert.',
  type: 'info',
  icon: '?'  // Custom icon character
});

// No icon
createAlert({
  message: 'Alert without icon.',
  type: 'info',
  icon: false
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const customIcon = createAlert({
      message: 'This alert has a custom question mark icon.',
      type: 'info',
      icon: '?',
    });
    iconsExample.appendChild(customIcon.element);

    const noIcon = createAlert({
      message: 'This alert has no icon at all.',
      type: 'success',
      icon: false,
    });
    noIcon.element.style.marginTop = 'var(--dos-space-sm)';
    iconsExample.appendChild(noIcon.element);
  }
  content.appendChild(iconsSection);

  // Programmatic Control
  const controlSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Update alerts dynamically with instance methods.',
    code: `const alert = createAlert({
  message: 'Initial message',
  type: 'info'
});

// Update message
alert.setMessage('Updated message');

// Change type
alert.setType('success');

// Dismiss programmatically
alert.dismiss();

// Remove from DOM
alert.destroy();`,
  });

  const controlExample = controlSection.querySelector('.dos-demo-section___examples');
  if (controlExample) {
    let demoAlert = createAlert({
      message: 'Click the buttons below to modify this alert.',
      type: 'info',
      dismissible: true,
    });
    controlExample.appendChild(demoAlert.element);

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.flexWrap = 'wrap';
    btnContainer.style.gap = 'var(--dos-space-sm)';
    btnContainer.style.marginTop = 'var(--dos-space-md)';

    const changeToSuccess = createButton({
      label: 'Set Success',
      onClick: () => demoAlert.setType('success'),
    });

    const changeToWarning = createButton({
      label: 'Set Warning',
      onClick: () => demoAlert.setType('warning'),
    });

    const changeToError = createButton({
      label: 'Set Error',
      onClick: () => demoAlert.setType('error'),
    });

    const changeMessage = createButton({
      label: 'Change Message',
      onClick: () => demoAlert.setMessage('Message updated at ' + new Date().toLocaleTimeString()),
    });

    const resetAlert = createButton({
      label: 'Reset Alert',
      onClick: () => {
        demoAlert.destroy();
        demoAlert = createAlert({
          message: 'Click the buttons below to modify this alert.',
          type: 'info',
          dismissible: true,
        });
        controlExample.insertBefore(demoAlert.element, btnContainer);
      },
    });

    btnContainer.appendChild(changeToSuccess);
    btnContainer.appendChild(changeToWarning);
    btnContainer.appendChild(changeToError);
    btnContainer.appendChild(changeMessage);
    btnContainer.appendChild(resetAlert);
    controlExample.appendChild(btnContainer);
  }
  content.appendChild(controlSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Alert includes proper ARIA roles and live regions.',
    code: `// Info/Success use role="status" with aria-live="polite"
// Warning/Error use role="alert" with aria-live="assertive"

// This ensures screen readers announce alerts appropriately:
// - Polite: announced after current speech
// - Assertive: announced immediately`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const featuresList = document.createElement('ul');
    featuresList.style.margin = '0';
    featuresList.style.paddingLeft = 'var(--dos-space-md)';

    const features = [
      'Info and Success alerts use role="status" for polite announcements',
      'Warning and Error alerts use role="alert" for assertive announcements',
      'aria-live regions ensure dynamic content is announced',
      'Icons have aria-hidden="true" to avoid redundant announcements',
      'Dismiss button has descriptive aria-label',
    ];

    features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      li.style.marginBottom = 'var(--dos-space-xs)';
      featuresList.appendChild(li);
    });

    a11yExample.appendChild(featuresList);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Toast demo page
 */
export function renderToastPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Toast';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style toast notifications for non-blocking, temporary messages with auto-dismiss and stacking support.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Toast Types Section
  const typesSection = createDemoSection({
    title: 'Toast Types',
    description: 'Toasts come in four types: info (default), success, warning, and error. Each has distinct styling and ARIA roles.',
    code: `import { toast } from 'dosage';

// Use the convenient toast object
toast.info('This is an info message');
toast.success('Operation completed successfully');
toast.warning('Please check your input');
toast.error('An error occurred');`,
  });

  const typesExample = typesSection.querySelector('.dos-demo-section___examples');
  if (typesExample) {
    typesExample.style.display = 'flex';
    typesExample.style.flexWrap = 'wrap';
    typesExample.style.gap = 'var(--dos-space-sm)';

    const types = [
      { type: 'info', label: 'Info Toast', message: 'This is an informational message.' },
      { type: 'success', label: 'Success Toast', message: 'Operation completed successfully!' },
      { type: 'warning', label: 'Warning Toast', message: 'Please check your input.' },
      { type: 'error', label: 'Error Toast', message: 'An error occurred. Please try again.' },
    ] as const;

    types.forEach(({ type, label, message }) => {
      const btn = createButton({
        label,
        onClick: () => {
          toast[type](message);
        },
      });
      typesExample.appendChild(btn);
    });
  }
  content.appendChild(typesSection);

  // Positions Section
  const positionsSection = createDemoSection({
    title: 'Toast Positions',
    description: 'Toasts can appear in six positions: top-left, top-center, top-right, bottom-left, bottom-center, and bottom-right.',
    code: `import { createToastContainer, createToast } from 'dosage';

// Create a container at a specific position
const container = createToastContainer({
  position: 'bottom-right'
});
document.body.appendChild(container.element);

// Add a toast to the container
container.add({
  message: 'Hello from bottom-right!',
  type: 'info'
});`,
  });

  // Track containers for cleanup
  const positionContainers: Map<string, ReturnType<typeof createToastContainer>> = new Map();

  const positionsExample = positionsSection.querySelector('.dos-demo-section___examples');
  if (positionsExample) {
    const positionsGrid = document.createElement('div');
    positionsGrid.style.display = 'grid';
    positionsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    positionsGrid.style.gap = 'var(--dos-space-sm)';
    positionsGrid.style.maxWidth = '400px';

    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ] as const;

    positions.forEach((position) => {
      const btn = createButton({
        label: position,
        variant: 'secondary',
        onClick: () => {
          // Get or create container for this position
          let container = positionContainers.get(position);
          if (!container) {
            container = createToastContainer({
              position,
              id: `demo-toast-container-${position}`,
            });
            document.body.appendChild(container.element);
            positionContainers.set(position, container);
          }

          container.add({
            message: `Toast at ${position}`,
            type: 'info',
            duration: 3000,
          });
        },
      });
      positionsGrid.appendChild(btn);
    });
    positionsExample.appendChild(positionsGrid);
  }
  content.appendChild(positionsSection);

  // Auto-Dismiss Section
  const durationSection = createDemoSection({
    title: 'Auto-Dismiss Duration',
    description: 'Toasts auto-dismiss after a configurable duration. Set duration to 0 or null to disable auto-dismiss.',
    code: `import { toast } from 'dosage';

// Quick (2 seconds)
toast.info('Quick message', { duration: 2000 });

// Default (5 seconds)
toast.info('Default duration message');

// Long (10 seconds)
toast.info('Long message', { duration: 10000 });

// Persistent (manual dismiss only)
toast.info('Persistent message', { duration: 0 });`,
  });

  const durationExample = durationSection.querySelector('.dos-demo-section___examples');
  if (durationExample) {
    durationExample.style.display = 'flex';
    durationExample.style.flexWrap = 'wrap';
    durationExample.style.gap = 'var(--dos-space-sm)';

    const durations = [
      { label: '2s Duration', duration: 2000, message: 'Quick! Only 2 seconds.' },
      { label: '5s Duration', duration: 5000, message: 'Default 5 second duration.' },
      { label: '10s Duration', duration: 10000, message: 'Long 10 second duration.' },
      { label: 'No Auto-Dismiss', duration: 0, message: 'Click X to dismiss this toast.' },
    ];

    durations.forEach(({ label, duration, message }) => {
      const btn = createButton({
        label,
        variant: 'secondary',
        onClick: () => {
          toast.info(message, { duration });
        },
      });
      durationExample.appendChild(btn);
    });
  }
  content.appendChild(durationSection);

  // Pause on Hover Section
  const pauseSection = createDemoSection({
    title: 'Pause on Hover',
    description: 'By default, toasts pause their auto-dismiss timer when hovered. This can be disabled with pauseOnHover: false.',
    code: `import { toast } from 'dosage';

// Default behavior - pauses on hover
toast.info('Hover to pause timer', {
  duration: 5000,
  pauseOnHover: true  // default
});

// Disable pause on hover
toast.info('Timer continues on hover', {
  duration: 5000,
  pauseOnHover: false
});`,
  });

  const pauseExample = pauseSection.querySelector('.dos-demo-section___examples');
  if (pauseExample) {
    pauseExample.style.display = 'flex';
    pauseExample.style.flexWrap = 'wrap';
    pauseExample.style.gap = 'var(--dos-space-sm)';

    const pauseBtn = createButton({
      label: 'Pauseable (hover me)',
      onClick: () => {
        toast.info('Hover over this toast to pause the timer.', {
          duration: 5000,
          pauseOnHover: true,
        });
      },
    });
    pauseExample.appendChild(pauseBtn);

    const noPauseBtn = createButton({
      label: 'Not Pauseable',
      variant: 'secondary',
      onClick: () => {
        toast.info('Hovering will not pause this toast.', {
          duration: 5000,
          pauseOnHover: false,
        });
      },
    });
    pauseExample.appendChild(noPauseBtn);
  }
  content.appendChild(pauseSection);

  // Max Toasts Section
  const maxToastsSection = createDemoSection({
    title: 'Max Toasts Limit',
    description: 'Containers can limit the number of visible toasts. When the limit is reached, older toasts are automatically dismissed.',
    code: `import { createToastContainer } from 'dosage';

const container = createToastContainer({
  position: 'top-right',
  maxToasts: 3  // Only show 3 toasts at a time
});

document.body.appendChild(container.element);

// When you add a 4th toast, the oldest one is dismissed
container.add({ message: 'Toast 1' });
container.add({ message: 'Toast 2' });
container.add({ message: 'Toast 3' });
container.add({ message: 'Toast 4 (dismisses Toast 1)' });`,
  });

  const maxToastsExample = maxToastsSection.querySelector('.dos-demo-section___examples');
  if (maxToastsExample) {
    let maxToastsContainer: ReturnType<typeof createToastContainer> | null = null;
    let toastCounter = 0;

    const spamBtn = createButton({
      label: 'Spam Toasts (max 3)',
      onClick: () => {
        if (!maxToastsContainer) {
          maxToastsContainer = createToastContainer({
            position: 'top-right',
            maxToasts: 3,
            id: 'demo-max-toasts-container',
          });
          document.body.appendChild(maxToastsContainer.element);
        }

        toastCounter++;
        maxToastsContainer.add({
          message: `Toast #${toastCounter} - Only 3 visible at once!`,
          type: 'info',
          duration: 5000,
        });
      },
    });
    maxToastsExample.appendChild(spamBtn);
  }
  content.appendChild(maxToastsSection);

  // Programmatic Control Section
  const controlSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Toasts return an instance with methods to dismiss, update message, and change type.',
    code: `import { createToast, createToastContainer } from 'dosage';

// Create a container to hold the toast
const container = createToastContainer({
  position: 'top-right'
});
document.body.appendChild(container.element);

// Create a toast via the container
const instance = container.add({
  message: 'Processing...',
  type: 'info',
  duration: 0  // persistent
});

// Later, update the toast
instance.setMessage('Still processing...');
instance.setType('warning');

// Or dismiss it
instance.dismiss();`,
  });

  const controlExample = controlSection.querySelector('.dos-demo-section___examples');
  if (controlExample) {
    controlExample.style.display = 'flex';
    controlExample.style.flexDirection = 'column';
    controlExample.style.gap = 'var(--dos-space-sm)';

    // Create a dedicated container for programmatic control demo
    let controlContainer: ReturnType<typeof createToastContainer> | null = null;
    let activeToast: ReturnType<typeof createToast> | null = null;

    // Ensure container exists
    const getContainer = () => {
      if (!controlContainer) {
        controlContainer = createToastContainer({
          position: 'top-right',
          id: 'demo-programmatic-control-container',
          maxToasts: 1,
        });
        document.body.appendChild(controlContainer.element);
      }
      return controlContainer;
    };

    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const createBtn = createButton({
      label: 'Create Toast',
      onClick: () => {
        // Dismiss existing toast if any
        if (activeToast) {
          activeToast.destroy();
          activeToast = null;
        }
        
        // Create new toast via container
        const container = getContainer();
        activeToast = container.add({
          message: 'Persistent toast - use buttons to control',
          type: 'info',
          duration: 0,
          onDismiss: () => {
            activeToast = null;
          },
        });
      },
    });
    buttonsRow.appendChild(createBtn);

    const updateMsgBtn = createButton({
      label: 'Update Message',
      variant: 'secondary',
      onClick: () => {
        if (activeToast) {
          activeToast.setMessage('Message updated at ' + new Date().toLocaleTimeString());
        } else {
          toast.warning('Create a toast first!', { duration: 2000 });
        }
      },
    });
    buttonsRow.appendChild(updateMsgBtn);

    const types = ['info', 'success', 'warning', 'error'] as const;
    types.forEach((type) => {
      const btn = createButton({
        label: `Set ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        variant: 'secondary',
        onClick: () => {
          if (activeToast) {
            activeToast.setType(type);
          } else {
            toast.warning('Create a toast first!', { duration: 2000 });
          }
        },
      });
      buttonsRow.appendChild(btn);
    });

    const dismissBtn = createButton({
      label: 'Dismiss',
      variant: 'danger',
      onClick: () => {
        if (activeToast) {
          activeToast.dismiss();
          activeToast = null;
        } else {
          toast.warning('Create a toast first!', { duration: 2000 });
        }
      },
    });
    buttonsRow.appendChild(dismissBtn);

    controlExample.appendChild(buttonsRow);
  }
  content.appendChild(controlSection);

  // Clear All Section
  const clearSection = createDemoSection({
    title: 'Clear and Destroy',
    description: 'Clear all toasts from a container, or destroy the container entirely.',
    code: `import { toast } from 'dosage';

// Show some toasts
toast.info('Message 1');
toast.success('Message 2');
toast.warning('Message 3');

// Clear all toasts
toast.clear();

// Or destroy the container completely
toast.destroy();`,
  });

  const clearExample = clearSection.querySelector('.dos-demo-section___examples');
  if (clearExample) {
    clearExample.style.display = 'flex';
    clearExample.style.flexWrap = 'wrap';
    clearExample.style.gap = 'var(--dos-space-sm)';

    const showMultipleBtn = createButton({
      label: 'Show Multiple Toasts',
      onClick: () => {
        toast.info('Info toast');
        setTimeout(() => toast.success('Success toast'), 200);
        setTimeout(() => toast.warning('Warning toast'), 400);
        setTimeout(() => toast.error('Error toast'), 600);
      },
    });
    clearExample.appendChild(showMultipleBtn);

    const clearBtn = createButton({
      label: 'Clear All',
      variant: 'secondary',
      onClick: () => {
        toast.clear();
      },
    });
    clearExample.appendChild(clearBtn);

    const destroyBtn = createButton({
      label: 'Destroy Container',
      variant: 'danger',
      onClick: () => {
        toast.destroy();
      },
    });
    clearExample.appendChild(destroyBtn);
  }
  content.appendChild(clearSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Toasts follow ARIA best practices:
      • Info/Success toasts use role="status" and aria-live="polite"
      • Warning/Error toasts use role="alert" and aria-live="assertive"
      • All toasts have aria-atomic="true" for complete announcement
      • Dismiss button has accessible label
    `,
    code: `// Info/Success - polite announcements
toast.info('Update available');   // role="status" aria-live="polite"
toast.success('File saved');      // role="status" aria-live="polite"

// Warning/Error - assertive announcements
toast.warning('Session expiring'); // role="alert" aria-live="assertive"
toast.error('Connection lost');    // role="alert" aria-live="assertive"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    accessibilityExample.style.display = 'flex';
    accessibilityExample.style.flexWrap = 'wrap';
    accessibilityExample.style.gap = 'var(--dos-space-sm)';

    const politeBtn = createButton({
      label: 'Polite (status)',
      variant: 'secondary',
      onClick: () => {
        toast.info('Polite notification - announced when convenient', { duration: 4000 });
      },
    });
    accessibilityExample.appendChild(politeBtn);

    const assertiveBtn = createButton({
      label: 'Assertive (alert)',
      variant: 'danger',
      onClick: () => {
        toast.error('Assertive alert - announced immediately!', { duration: 4000 });
      },
    });
    accessibilityExample.appendChild(assertiveBtn);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  // Cleanup function for position containers when page changes
  const cleanup = () => {
    positionContainers.forEach((container) => {
      container.destroy();
    });
    positionContainers.clear();
  };

  // Set up cleanup on page unload
  page.addEventListener('DOMNodeRemoved', cleanup);

  return page;
}

/**
 * Renders the Tooltip demo page
 */
export function renderTooltipPage(): HTMLElement {
  const page = document.createElement('div');

  // Track tooltips for cleanup
  const pageTooltips: ReturnType<typeof createTooltip>[] = [];

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Tooltip';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style tooltips for displaying contextual information on hover or focus.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Tooltips Section
  const basicSection = createDemoSection({
    title: 'Basic Tooltips',
    description: 'Attach tooltips to any element. Hover or focus to see the tooltip.',
    code: `import { createTooltip, createButton } from 'dosage';

const button = document.getElementById('my-button');
const tooltip = createTooltip({
  content: 'This is a tooltip',
  target: button,
  position: 'top'
});

// Cleanup when done
tooltip.destroy();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    basicExample.style.display = 'flex';
    basicExample.style.flexWrap = 'wrap';
    basicExample.style.gap = 'var(--dos-space-md)';

    const btn1 = createButton({
      label: 'Hover me!',
    });
    const tip1 = createTooltip({
      content: 'This is a basic tooltip',
      target: btn1,
      position: 'top',
    });
    pageTooltips.push(tip1);
    basicExample.appendChild(btn1);

    const btn2 = createButton({
      label: 'Or focus me',
      variant: 'secondary',
    });
    const tip2 = createTooltip({
      content: 'You can also trigger tooltips with keyboard focus',
      target: btn2,
      position: 'bottom',
    });
    pageTooltips.push(tip2);
    basicExample.appendChild(btn2);
  }
  content.appendChild(basicSection);

  // Positions Section
  const positionsSection = createDemoSection({
    title: 'Tooltip Positions',
    description: 'Tooltips can appear in four positions: top, bottom, left, and right.',
    code: `createTooltip({ content: 'Top', target: btn, position: 'top' });
createTooltip({ content: 'Bottom', target: btn, position: 'bottom' });
createTooltip({ content: 'Left', target: btn, position: 'left' });
createTooltip({ content: 'Right', target: btn, position: 'right' });`,
  });

  const positionsExample = positionsSection.querySelector('.dos-demo-section___examples');
  if (positionsExample) {
    positionsExample.style.display = 'flex';
    positionsExample.style.flexWrap = 'wrap';
    positionsExample.style.gap = 'var(--dos-space-md)';
    positionsExample.style.justifyContent = 'center';
    positionsExample.style.padding = 'var(--dos-space-xl)';

    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const btn = createButton({
        label: position.charAt(0).toUpperCase() + position.slice(1),
        variant: 'secondary',
      });
      const tip = createTooltip({
        content: `Tooltip on the ${position}`,
        target: btn,
        position,
      });
      pageTooltips.push(tip);
      positionsExample.appendChild(btn);
    });
  }
  content.appendChild(positionsSection);

  // Trigger Modes Section
  const triggersSection = createDemoSection({
    title: 'Trigger Modes',
    description: 'Control how tooltips are triggered: hover only, focus only, or both.',
    code: `// Hover only
createTooltip({
  content: 'Hover tooltip',
  target: btn1,
  trigger: 'hover'
});

// Focus only (keyboard accessible)
createTooltip({
  content: 'Focus tooltip',
  target: btn2,
  trigger: 'focus'
});

// Both (default)
createTooltip({
  content: 'Hover or focus',
  target: btn3,
  trigger: 'both'
});`,
  });

  const triggersExample = triggersSection.querySelector('.dos-demo-section___examples');
  if (triggersExample) {
    triggersExample.style.display = 'flex';
    triggersExample.style.flexWrap = 'wrap';
    triggersExample.style.gap = 'var(--dos-space-md)';

    const hoverBtn = createButton({
      label: 'Hover Only',
    });
    const hoverTip = createTooltip({
      content: 'This only shows on mouse hover',
      target: hoverBtn,
      trigger: 'hover',
    });
    pageTooltips.push(hoverTip);
    triggersExample.appendChild(hoverBtn);

    const focusBtn = createButton({
      label: 'Focus Only (Tab to me)',
      variant: 'secondary',
    });
    const focusTip = createTooltip({
      content: 'This only shows on keyboard focus',
      target: focusBtn,
      trigger: 'focus',
    });
    pageTooltips.push(focusTip);
    triggersExample.appendChild(focusBtn);

    const bothBtn = createButton({
      label: 'Both (Default)',
      variant: 'primary',
    });
    const bothTip = createTooltip({
      content: 'This shows on both hover and focus',
      target: bothBtn,
      trigger: 'both',
    });
    pageTooltips.push(bothTip);
    triggersExample.appendChild(bothBtn);
  }
  content.appendChild(triggersSection);

  // Delay Section
  const delaySection = createDemoSection({
    title: 'Show Delay',
    description: 'Add a delay before showing the tooltip to prevent accidental triggers.',
    code: `// No delay (instant)
createTooltip({
  content: 'Instant!',
  target: btn1,
  delay: 0
});

// Default delay (200ms)
createTooltip({
  content: 'Default delay',
  target: btn2,
  delay: 200
});

// Longer delay
createTooltip({
  content: 'Slow tooltip',
  target: btn3,
  delay: 500
});`,
  });

  const delayExample = delaySection.querySelector('.dos-demo-section___examples');
  if (delayExample) {
    delayExample.style.display = 'flex';
    delayExample.style.flexWrap = 'wrap';
    delayExample.style.gap = 'var(--dos-space-md)';

    const delays = [
      { delay: 0, label: 'Instant (0ms)' },
      { delay: 200, label: 'Default (200ms)' },
      { delay: 500, label: 'Slow (500ms)' },
    ];

    delays.forEach(({ delay, label }) => {
      const btn = createButton({
        label,
        variant: 'secondary',
      });
      const tip = createTooltip({
        content: `Appears after ${delay}ms`,
        target: btn,
        delay,
      });
      pageTooltips.push(tip);
      delayExample.appendChild(btn);
    });
  }
  content.appendChild(delaySection);

  // Arrow Section
  const arrowSection = createDemoSection({
    title: 'With and Without Arrow',
    description: 'Tooltips can optionally show an arrow pointing to the target element.',
    code: `// With arrow (default)
createTooltip({
  content: 'Has an arrow',
  target: btn1,
  arrow: true
});

// Without arrow
createTooltip({
  content: 'No arrow',
  target: btn2,
  arrow: false
});`,
  });

  const arrowExample = arrowSection.querySelector('.dos-demo-section___examples');
  if (arrowExample) {
    arrowExample.style.display = 'flex';
    arrowExample.style.flexWrap = 'wrap';
    arrowExample.style.gap = 'var(--dos-space-md)';

    const withArrowBtn = createButton({
      label: 'With Arrow',
    });
    const withArrowTip = createTooltip({
      content: 'This tooltip has an arrow',
      target: withArrowBtn,
      arrow: true,
    });
    pageTooltips.push(withArrowTip);
    arrowExample.appendChild(withArrowBtn);

    const noArrowBtn = createButton({
      label: 'Without Arrow',
      variant: 'secondary',
    });
    const noArrowTip = createTooltip({
      content: 'This tooltip has no arrow',
      target: noArrowBtn,
      arrow: false,
    });
    pageTooltips.push(noArrowTip);
    arrowExample.appendChild(noArrowBtn);
  }
  content.appendChild(arrowSection);

  // Programmatic Control Section
  const controlSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Control tooltips programmatically with show(), hide(), setContent(), and setPosition().',
    code: `const tooltip = createTooltip({
  content: 'Initial content',
  target: element,
  trigger: 'both'
});

// Show/hide programmatically
tooltip.show();
tooltip.hide();

// Update content
tooltip.setContent('New content!');

// Change position
tooltip.setPosition('right');

// Check visibility
if (tooltip.isVisible()) { ... }

// Cleanup
tooltip.destroy();`,
  });

  const controlExample = controlSection.querySelector('.dos-demo-section___examples');
  if (controlExample) {
    controlExample.style.display = 'flex';
    controlExample.style.flexDirection = 'column';
    controlExample.style.gap = 'var(--dos-space-md)';

    // Create a target for controlled tooltip
    const targetBtn = createButton({
      label: 'Controlled Tooltip Target',
    });
    targetBtn.style.alignSelf = 'flex-start';
    controlExample.appendChild(targetBtn);

    const controlledTip = createTooltip({
      content: 'Controlled tooltip',
      target: targetBtn,
      trigger: 'hover',
      delay: 0,
    });
    pageTooltips.push(controlledTip);

    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const showBtn = createButton({
      label: 'Show',
      variant: 'secondary',
      onClick: () => controlledTip.show(),
    });
    buttonsRow.appendChild(showBtn);

    const hideBtn = createButton({
      label: 'Hide',
      variant: 'secondary',
      onClick: () => controlledTip.hide(),
    });
    buttonsRow.appendChild(hideBtn);

    const contents = ['Content A', 'Content B', 'Longer content with more text'];
    let contentIndex = 0;
    const updateContentBtn = createButton({
      label: 'Update Content',
      variant: 'secondary',
      onClick: () => {
        contentIndex = (contentIndex + 1) % contents.length;
        controlledTip.setContent(contents[contentIndex] as string);
      },
    });
    buttonsRow.appendChild(updateContentBtn);

    const positions = ['top', 'right', 'bottom', 'left'] as const;
    let posIndex = 0;
    const updatePosBtn = createButton({
      label: 'Cycle Position',
      variant: 'secondary',
      onClick: () => {
        posIndex = (posIndex + 1) % positions.length;
        controlledTip.setPosition(positions[posIndex] as (typeof positions)[number]);
      },
    });
    buttonsRow.appendChild(updatePosBtn);

    controlExample.appendChild(buttonsRow);
  }
  content.appendChild(controlSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Tooltips follow ARIA best practices:
      • role="tooltip" on the tooltip element
      • aria-describedby on the target element
      • Keyboard accessible via focus trigger
      • Press Escape to dismiss
    `,
    code: `// Tooltip automatically sets up ARIA relationships
const tooltip = createTooltip({
  content: 'Accessible tooltip',
  target: button,
  id: 'my-tooltip'
});

// The target will have:
// aria-describedby="my-tooltip"

// The tooltip will have:
// role="tooltip"
// id="my-tooltip"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    const accessNote = document.createElement('p');
    accessNote.style.marginBottom = 'var(--dos-space-md)';
    accessNote.textContent = 'Try using Tab to focus the button below, then press Escape to dismiss:';
    accessibilityExample.appendChild(accessNote);

    const accessBtn = createButton({
      label: 'Focus me (Tab), dismiss (Escape)',
    });
    const accessTip = createTooltip({
      content: 'Press Escape to dismiss this tooltip',
      target: accessBtn,
      trigger: 'focus',
      delay: 0,
    });
    pageTooltips.push(accessTip);
    accessibilityExample.appendChild(accessBtn);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  // Cleanup function for tooltips when page changes
  const cleanup = () => {
    pageTooltips.forEach((tip) => {
      tip.destroy();
    });
    pageTooltips.length = 0;
  };

  // Set up cleanup on page removal
  page.addEventListener('DOMNodeRemoved', cleanup);

  return page;
}

/**
 * Renders the Popover demo page
 */
export function renderPopoverPage(): HTMLElement {
  const page = document.createElement('div');

  // Track popovers for cleanup
  const pagePopovers: ReturnType<typeof createPopover>[] = [];

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Popover';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style popovers for displaying rich content triggered by user interaction.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Popover Section
  const basicSection = createDemoSection({
    title: 'Basic Popover',
    description: 'Click a trigger element to show a popover with rich content.',
    code: `import { createPopover, createButton } from 'dosage';

const button = document.getElementById('my-button');
const popover = createPopover({
  content: 'This is popover content',
  target: button,
  title: 'Popover Title',
  trigger: 'click'
});

// Cleanup when done
popover.destroy();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    basicExample.style.display = 'flex';
    basicExample.style.flexWrap = 'wrap';
    basicExample.style.gap = 'var(--dos-space-md)';

    const btn1 = createButton({
      label: 'Click for Popover',
    });
    const pop1 = createPopover({
      content: 'This is a basic popover with text content. Click outside or press Escape to close.',
      target: btn1,
      title: 'Basic Popover',
      trigger: 'click',
    });
    pagePopovers.push(pop1);
    basicExample.appendChild(btn1);

    const btn2 = createButton({
      label: 'No Title',
      variant: 'secondary',
    });
    const pop2 = createPopover({
      content: 'This popover has no title header.',
      target: btn2,
      trigger: 'click',
    });
    pagePopovers.push(pop2);
    basicExample.appendChild(btn2);
  }
  content.appendChild(basicSection);

  // Positions Section
  const positionsSection = createDemoSection({
    title: 'Popover Positions',
    description: 'Popovers can appear in four positions: top, bottom, left, and right.',
    code: `createPopover({ content: '...', target: btn, position: 'top' });
createPopover({ content: '...', target: btn, position: 'bottom' });
createPopover({ content: '...', target: btn, position: 'left' });
createPopover({ content: '...', target: btn, position: 'right' });`,
  });

  const positionsExample = positionsSection.querySelector('.dos-demo-section___examples');
  if (positionsExample) {
    positionsExample.style.display = 'flex';
    positionsExample.style.flexWrap = 'wrap';
    positionsExample.style.gap = 'var(--dos-space-md)';
    positionsExample.style.justifyContent = 'center';
    positionsExample.style.padding = 'var(--dos-space-xl)';

    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const btn = createButton({
        label: position.charAt(0).toUpperCase() + position.slice(1),
        variant: 'secondary',
      });
      const pop = createPopover({
        content: `This popover appears on the ${position} of the trigger.`,
        target: btn,
        title: `Position: ${position}`,
        position,
        trigger: 'click',
      });
      pagePopovers.push(pop);
      positionsExample.appendChild(btn);
    });
  }
  content.appendChild(positionsSection);

  // Trigger Modes Section
  const triggersSection = createDemoSection({
    title: 'Trigger Modes',
    description: 'Popovers can be triggered by click (default), hover, or focus.',
    code: `// Click trigger (default)
createPopover({
  content: '...',
  target: btn,
  trigger: 'click'
});

// Hover trigger
createPopover({
  content: '...',
  target: btn,
  trigger: 'hover'
});

// Focus trigger
createPopover({
  content: '...',
  target: btn,
  trigger: 'focus'
});`,
  });

  const triggersExample = triggersSection.querySelector('.dos-demo-section___examples');
  if (triggersExample) {
    triggersExample.style.display = 'flex';
    triggersExample.style.flexWrap = 'wrap';
    triggersExample.style.gap = 'var(--dos-space-md)';

    const clickBtn = createButton({
      label: 'Click Trigger',
    });
    const clickPop = createPopover({
      content: 'This popover opens on click.',
      target: clickBtn,
      title: 'Click Trigger',
      trigger: 'click',
    });
    pagePopovers.push(clickPop);
    triggersExample.appendChild(clickBtn);

    const hoverBtn = createButton({
      label: 'Hover Trigger',
      variant: 'secondary',
    });
    const hoverPop = createPopover({
      content: 'This popover opens on hover.',
      target: hoverBtn,
      title: 'Hover Trigger',
      trigger: 'hover',
    });
    pagePopovers.push(hoverPop);
    triggersExample.appendChild(hoverBtn);

    const focusBtn = createButton({
      label: 'Focus Trigger (Tab to me)',
      variant: 'secondary',
    });
    const focusPop = createPopover({
      content: 'This popover opens on keyboard focus.',
      target: focusBtn,
      title: 'Focus Trigger',
      trigger: 'focus',
    });
    pagePopovers.push(focusPop);
    triggersExample.appendChild(focusBtn);
  }
  content.appendChild(triggersSection);

  // Rich Content Section
  const richContentSection = createDemoSection({
    title: 'Rich Content',
    description: 'Popovers can contain any HTML element, including forms and interactive content.',
    code: `const formContent = document.createElement('form');
formContent.innerHTML = \`
  <label>Name: <input type="text" /></label>
  <button type="submit">Submit</button>
\`;

createPopover({
  content: formContent,
  target: button,
  title: 'User Form'
});`,
  });

  const richContentExample = richContentSection.querySelector('.dos-demo-section___examples');
  if (richContentExample) {
    richContentExample.style.display = 'flex';
    richContentExample.style.flexWrap = 'wrap';
    richContentExample.style.gap = 'var(--dos-space-md)';

    // Popover with form
    const formBtn = createButton({
      label: 'Popover with Form',
    });

    const formContent = document.createElement('form');
    formContent.style.display = 'flex';
    formContent.style.flexDirection = 'column';
    formContent.style.gap = 'var(--dos-space-sm)';
    formContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label for="pop-name">Name:</label>
        <input id="pop-name" type="text" style="padding: 4px; font-family: inherit;" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label for="pop-email">Email:</label>
        <input id="pop-email" type="email" style="padding: 4px; font-family: inherit;" />
      </div>
      <button type="submit" style="padding: 4px 8px; font-family: inherit; cursor: pointer;">Submit</button>
    `;
    formContent.addEventListener('submit', (e) => {
      e.preventDefault();
      toast.success('Form submitted!');
      formPop.close();
    });

    const formPop = createPopover({
      content: formContent,
      target: formBtn,
      title: 'User Information',
      trigger: 'click',
    });
    pagePopovers.push(formPop);
    richContentExample.appendChild(formBtn);

    // Popover with list
    const listBtn = createButton({
      label: 'Popover with List',
      variant: 'secondary',
    });

    const listContent = document.createElement('ul');
    listContent.style.margin = '0';
    listContent.style.paddingLeft = '20px';
    listContent.innerHTML = `
      <li>Item One</li>
      <li>Item Two</li>
      <li>Item Three</li>
    `;

    const listPop = createPopover({
      content: listContent,
      target: listBtn,
      title: 'Menu Items',
      trigger: 'click',
    });
    pagePopovers.push(listPop);
    richContentExample.appendChild(listBtn);
  }
  content.appendChild(richContentSection);

  // Programmatic Control Section
  const controlSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Control popovers programmatically with open(), close(), toggle(), and other methods. Visual indicator shows current state.',
    code: `const popover = createPopover({
  content: 'Initial content',
  target: element,
  title: 'My Popover'
});

// Open/close programmatically
popover.open();
popover.close();
popover.toggle();

// Update content
popover.setContent('New content!');
popover.setTitle('New Title');

// Change position
popover.setPosition('right');

// Check state
if (popover.isOpen()) { ... }

// Cleanup
popover.destroy();`,
  });

  const controlExample = controlSection.querySelector('.dos-demo-section___examples');
  if (controlExample) {
    controlExample.style.display = 'flex';
    controlExample.style.flexDirection = 'column';
    controlExample.style.gap = 'var(--dos-space-md)';

    // State indicator
    const stateIndicator = document.createElement('div');
    stateIndicator.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    stateIndicator.style.fontWeight = 'bold';
    stateIndicator.style.border = '1px solid var(--dos-color-text-primary)';
    stateIndicator.style.backgroundColor = 'var(--dos-color-bg-tertiary)';
    stateIndicator.textContent = 'Popover State: CLOSED';
    controlExample.appendChild(stateIndicator);

    // Create a target for controlled popover
    const targetBtn = createButton({
      label: 'Controlled Popover Target',
    });
    targetBtn.style.alignSelf = 'flex-start';
    controlExample.appendChild(targetBtn);

    const controlledPop = createPopover({
      content: 'Use the buttons below to control this popover programmatically.',
      target: targetBtn,
      title: 'Programmatic Popover',
      trigger: 'click',
      onOpen: () => {
        stateIndicator.textContent = 'Popover State: OPEN';
        stateIndicator.style.backgroundColor = 'var(--dos-color-success-bg)';
      },
      onClose: () => {
        stateIndicator.textContent = 'Popover State: CLOSED';
        stateIndicator.style.backgroundColor = 'var(--dos-color-bg-tertiary)';
      },
    });
    pagePopovers.push(controlledPop);

    // Button controls
    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const openBtn = createButton({
      label: 'Open',
      variant: 'secondary',
      onClick: () => controlledPop.open(),
    });
    buttonsRow.appendChild(openBtn);

    const closeBtn = createButton({
      label: 'Close',
      variant: 'secondary',
      onClick: () => controlledPop.close(),
    });
    buttonsRow.appendChild(closeBtn);

    const toggleBtn = createButton({
      label: 'Toggle',
      variant: 'secondary',
      onClick: () => controlledPop.toggle(),
    });
    buttonsRow.appendChild(toggleBtn);

    controlExample.appendChild(buttonsRow);

    // Position controls
    const positionsRow = document.createElement('div');
    positionsRow.style.display = 'flex';
    positionsRow.style.flexWrap = 'wrap';
    positionsRow.style.gap = 'var(--dos-space-sm)';
    positionsRow.style.marginTop = 'var(--dos-space-xs)';

    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((pos) => {
      const posBtn = createButton({
        label: `Position: ${pos}`,
        variant: 'secondary',
        onClick: () => {
          controlledPop.setPosition(pos);
          controlledPop.open();
        },
      });
      positionsRow.appendChild(posBtn);
    });

    controlExample.appendChild(positionsRow);

    // Content/title controls
    const contentRow = document.createElement('div');
    contentRow.style.display = 'flex';
    contentRow.style.flexWrap = 'wrap';
    contentRow.style.gap = 'var(--dos-space-sm)';
    contentRow.style.marginTop = 'var(--dos-space-xs)';

    const contents = [
      'Use the buttons below to control this popover programmatically.',
      'Updated content! Try changing the position.',
      'This is different content with more text to demonstrate dynamic updates.',
    ];
    let contentIndex = 0;
    const updateContentBtn = createButton({
      label: 'Cycle Content',
      variant: 'secondary',
      onClick: () => {
        contentIndex = (contentIndex + 1) % contents.length;
        controlledPop.setContent(contents[contentIndex] as string);
      },
    });
    contentRow.appendChild(updateContentBtn);

    const titles = ['Programmatic Popover', 'Updated Title', 'Another Title'];
    let titleIndex = 0;
    const updateTitleBtn = createButton({
      label: 'Cycle Title',
      variant: 'secondary',
      onClick: () => {
        titleIndex = (titleIndex + 1) % titles.length;
        controlledPop.setTitle(titles[titleIndex] as string);
      },
    });
    contentRow.appendChild(updateTitleBtn);

    controlExample.appendChild(contentRow);
  }
  content.appendChild(controlSection);

  // Background Color Section
  const backgroundSection = createDemoSection({
    title: 'Background Color',
    description: 'Customize popover background color for better visibility or theming.',
    code: `createPopover({
  content: 'Custom background',
  target: button,
  title: 'Styled Popover',
  backgroundColor: '#1a1a1a'
});`,
  });

  const backgroundExample = backgroundSection.querySelector('.dos-demo-section___examples');
  if (backgroundExample) {
    backgroundExample.style.display = 'flex';
    backgroundExample.style.flexWrap = 'wrap';
    backgroundExample.style.gap = 'var(--dos-space-md)';

    // Default background
    const defaultBtn = createButton({
      label: 'Default Background',
    });
    const defaultPop = createPopover({
      content: 'This uses the default background color from the theme.',
      target: defaultBtn,
      title: 'Default',
      trigger: 'click',
    });
    pagePopovers.push(defaultPop);
    backgroundExample.appendChild(defaultBtn);

    // Dark background
    const darkBtn = createButton({
      label: 'Dark Background',
      variant: 'secondary',
    });
    const darkPop = createPopover({
      content: 'Custom dark background for contrast.',
      target: darkBtn,
      title: 'Dark Theme',
      trigger: 'click',
      backgroundColor: '#1a1a1a',
    });
    pagePopovers.push(darkPop);
    backgroundExample.appendChild(darkBtn);

    // Light background
    const lightBtn = createButton({
      label: 'Light Background',
      variant: 'secondary',
    });
    const lightPop = createPopover({
      content: 'Custom light background with better visibility.',
      target: lightBtn,
      title: 'Light Theme',
      trigger: 'click',
      backgroundColor: '#f0f0f0',
    });
    pagePopovers.push(lightPop);
    backgroundExample.appendChild(lightBtn);

    // Colored background
    const colorBtn = createButton({
      label: 'Colored Background',
      variant: 'secondary',
    });
    const colorPop = createPopover({
      content: 'You can use any CSS color value.',
      target: colorBtn,
      title: 'Colored',
      trigger: 'click',
      backgroundColor: '#003366',
    });
    pagePopovers.push(colorPop);
    backgroundExample.appendChild(colorBtn);
  }
  content.appendChild(backgroundSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Popovers follow ARIA best practices:
      • role="dialog" on the popover element
      • aria-haspopup="dialog" and aria-expanded on trigger
      • aria-controls links trigger to popover
      • Focus is moved into popover when opened
      • Escape key closes popover
      • Focus returns to trigger when closed
    `,
    code: `// Popover automatically sets up ARIA relationships
const popover = createPopover({
  content: formElement,
  target: button,
  title: 'User Form',
  id: 'my-popover'
});

// The target will have:
// aria-haspopup="dialog"
// aria-expanded="false" / "true"
// aria-controls="my-popover"

// The popover will have:
// role="dialog"
// aria-labelledby="my-popover-title"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    const accessNote = document.createElement('p');
    accessNote.style.marginBottom = 'var(--dos-space-md)';
    accessNote.textContent = 'Click the button, then use Tab to navigate inside the popover. Press Escape to close.';
    accessibilityExample.appendChild(accessNote);

    const accessBtn = createButton({
      label: 'Open Accessible Popover',
    });

    const accessContent = document.createElement('div');
    accessContent.innerHTML = `
      <p>This popover demonstrates keyboard navigation:</p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Tab through focusable elements</li>
        <li>Press Escape to close</li>
        <li>Focus returns to trigger</li>
      </ul>
      <button style="padding: 4px 8px; font-family: inherit; cursor: pointer;">Focusable Button</button>
    `;

    const accessPop = createPopover({
      content: accessContent,
      target: accessBtn,
      title: 'Accessibility Demo',
      trigger: 'click',
    });
    pagePopovers.push(accessPop);
    accessibilityExample.appendChild(accessBtn);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  // Cleanup function for popovers when page changes
  const cleanup = () => {
    pagePopovers.forEach((pop) => {
      pop.destroy();
    });
    pagePopovers.length = 0;
  };

  // Set up cleanup on page removal
  page.addEventListener('DOMNodeRemoved', cleanup);

  return page;
}

/**
 * Renders the ProgressBar demo page
 */
export function renderProgressBarPage(): HTMLElement {
  const page = document.createElement('div');

  // Track progress bars for cleanup
  const pageProgressBars: ReturnType<typeof createProgressBar>[] = [];

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'ProgressBar';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style progress bars using ASCII block characters.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic ProgressBar Section
  const basicSection = createDemoSection({
    title: 'Basic ProgressBar',
    description: 'A simple progress bar showing determinate progress.',
    code: `import { createProgressBar } from 'dosage';

const progress = createProgressBar({
  value: 50,
  max: 100,
  label: 'Loading progress'
});

document.body.appendChild(progress.element);

// Update progress
progress.setValue(75);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    basicExample.style.display = 'flex';
    basicExample.style.flexDirection = 'column';
    basicExample.style.gap = 'var(--dos-space-md)';

    const prog1 = createProgressBar({ value: 25 });
    pageProgressBars.push(prog1);
    basicExample.appendChild(prog1.element);

    const prog2 = createProgressBar({ value: 50 });
    pageProgressBars.push(prog2);
    basicExample.appendChild(prog2.element);

    const prog3 = createProgressBar({ value: 75 });
    pageProgressBars.push(prog3);
    basicExample.appendChild(prog3.element);

    const prog4 = createProgressBar({ value: 100 });
    pageProgressBars.push(prog4);
    basicExample.appendChild(prog4.element);
  }
  content.appendChild(basicSection);

  // Styles Section
  const stylesSection = createDemoSection({
    title: 'Progress Bar Styles',
    description: 'Two visual styles: blocks (default) and boxed.',
    code: `// Blocks style (default): ████████░░░░░░░░
createProgressBar({
  value: 50,
  style: 'blocks'
});

// Boxed style: [████████        ]
createProgressBar({
  value: 50,
  style: 'boxed'
});`,
  });

  const stylesExample = stylesSection.querySelector('.dos-demo-section___examples');
  if (stylesExample) {
    stylesExample.style.display = 'flex';
    stylesExample.style.flexDirection = 'column';
    stylesExample.style.gap = 'var(--dos-space-md)';

    const label1 = document.createElement('span');
    label1.textContent = 'Blocks style:';
    label1.style.color = 'var(--dos-color-text-secondary)';
    stylesExample.appendChild(label1);

    const blocksProgress = createProgressBar({ value: 60, style: 'blocks' });
    pageProgressBars.push(blocksProgress);
    stylesExample.appendChild(blocksProgress.element);

    const label2 = document.createElement('span');
    label2.textContent = 'Boxed style:';
    label2.style.color = 'var(--dos-color-text-secondary)';
    label2.style.marginTop = 'var(--dos-space-sm)';
    stylesExample.appendChild(label2);

    const boxedProgress = createProgressBar({ value: 60, style: 'boxed' });
    pageProgressBars.push(boxedProgress);
    stylesExample.appendChild(boxedProgress.element);
  }
  content.appendChild(stylesSection);

  // Sizes Section
  const sizesSection = createDemoSection({
    title: 'Sizes',
    description: 'Progress bars come in three sizes: small, medium (default), and large.',
    code: `createProgressBar({ value: 50, size: 'small' });
createProgressBar({ value: 50, size: 'medium' });
createProgressBar({ value: 50, size: 'large' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.flexDirection = 'column';
    sizesExample.style.gap = 'var(--dos-space-md)';

    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = 'var(--dos-space-sm)';

      const label = document.createElement('span');
      label.textContent = `${size}:`;
      label.style.minWidth = '6ch';
      label.style.color = 'var(--dos-color-text-secondary)';
      wrapper.appendChild(label);

      const progress = createProgressBar({ value: 50, size });
      pageProgressBars.push(progress);
      wrapper.appendChild(progress.element);

      sizesExample.appendChild(wrapper);
    });
  }
  content.appendChild(sizesSection);

  // Value Display Section
  const valueSection = createDemoSection({
    title: 'Value Display',
    description: 'Show the current progress value as a percentage or with custom formatting.',
    code: `// Show percentage
createProgressBar({
  value: 75,
  showValue: true
});

// Custom formatter
createProgressBar({
  value: 5,
  max: 10,
  showValue: true,
  valueFormat: (value, max) => \`\${value}/\${max} files\`
});`,
  });

  const valueExample = valueSection.querySelector('.dos-demo-section___examples');
  if (valueExample) {
    valueExample.style.display = 'flex';
    valueExample.style.flexDirection = 'column';
    valueExample.style.gap = 'var(--dos-space-md)';

    const percentProgress = createProgressBar({
      value: 75,
      showValue: true,
      label: 'Progress with percentage',
    });
    pageProgressBars.push(percentProgress);
    valueExample.appendChild(percentProgress.element);

    const customProgress = createProgressBar({
      value: 5,
      max: 10,
      showValue: true,
      valueFormat: (value, max) => `${value}/${max} files`,
    });
    pageProgressBars.push(customProgress);
    valueExample.appendChild(customProgress.element);

    const bytesProgress = createProgressBar({
      value: 512,
      max: 1024,
      showValue: true,
      valueFormat: (value) => `${value} KB`,
    });
    pageProgressBars.push(bytesProgress);
    valueExample.appendChild(bytesProgress.element);
  }
  content.appendChild(valueSection);

  // Indeterminate Section
  const indeterminateSection = createDemoSection({
    title: 'Indeterminate Progress',
    description: 'For unknown progress duration, use indeterminate mode with an animated indicator.',
    code: `createProgressBar({
  indeterminate: true,
  label: 'Loading...'
});

// Toggle indeterminate mode
progress.setIndeterminate(true);
progress.setIndeterminate(false);`,
  });

  const indeterminateExample = indeterminateSection.querySelector('.dos-demo-section___examples');
  if (indeterminateExample) {
    indeterminateExample.style.display = 'flex';
    indeterminateExample.style.flexDirection = 'column';
    indeterminateExample.style.gap = 'var(--dos-space-md)';

    const label1 = document.createElement('span');
    label1.textContent = 'Blocks style indeterminate:';
    label1.style.color = 'var(--dos-color-text-secondary)';
    indeterminateExample.appendChild(label1);

    const indeterminate1 = createProgressBar({
      indeterminate: true,
      style: 'blocks',
      label: 'Loading...',
    });
    pageProgressBars.push(indeterminate1);
    indeterminateExample.appendChild(indeterminate1.element);

    const label2 = document.createElement('span');
    label2.textContent = 'Boxed style indeterminate:';
    label2.style.color = 'var(--dos-color-text-secondary)';
    label2.style.marginTop = 'var(--dos-space-sm)';
    indeterminateExample.appendChild(label2);

    const indeterminate2 = createProgressBar({
      indeterminate: true,
      style: 'boxed',
      label: 'Loading...',
    });
    pageProgressBars.push(indeterminate2);
    indeterminateExample.appendChild(indeterminate2.element);
  }
  content.appendChild(indeterminateSection);

  // Interactive Demo Section
  const interactiveSection = createDemoSection({
    title: 'Interactive Demo',
    description: 'Control a progress bar programmatically.',
    code: `const progress = createProgressBar({
  value: 0,
  showValue: true
});

// Methods
progress.setValue(50);
progress.setMax(200);
progress.setIndeterminate(true);

// Getters
progress.getValue();     // 50
progress.getMax();       // 200
progress.getPercentage();// 25
progress.isIndeterminate(); // true`,
  });

  const interactiveExample = interactiveSection.querySelector('.dos-demo-section___examples');
  if (interactiveExample) {
    interactiveExample.style.display = 'flex';
    interactiveExample.style.flexDirection = 'column';
    interactiveExample.style.gap = 'var(--dos-space-md)';

    const controlledProgress = createProgressBar({
      value: 0,
      showValue: true,
      label: 'Interactive progress',
    });
    pageProgressBars.push(controlledProgress);
    interactiveExample.appendChild(controlledProgress.element);

    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const decreaseBtn = createButton({
      label: '-10%',
      variant: 'secondary',
      onClick: () => {
        const current = controlledProgress.getValue();
        controlledProgress.setValue(current - 10);
      },
    });
    buttonsRow.appendChild(decreaseBtn);

    const increaseBtn = createButton({
      label: '+10%',
      variant: 'secondary',
      onClick: () => {
        const current = controlledProgress.getValue();
        controlledProgress.setValue(current + 10);
      },
    });
    buttonsRow.appendChild(increaseBtn);

    const resetBtn = createButton({
      label: 'Reset',
      variant: 'secondary',
      onClick: () => {
        controlledProgress.setIndeterminate(false);
        controlledProgress.setValue(0);
      },
    });
    buttonsRow.appendChild(resetBtn);

    const completeBtn = createButton({
      label: 'Complete',
      variant: 'primary',
      onClick: () => {
        controlledProgress.setIndeterminate(false);
        controlledProgress.setValue(100);
      },
    });
    buttonsRow.appendChild(completeBtn);

    const toggleIndeterminateBtn = createButton({
      label: 'Toggle Indeterminate',
      variant: 'secondary',
      onClick: () => {
        controlledProgress.setIndeterminate(!controlledProgress.isIndeterminate());
      },
    });
    buttonsRow.appendChild(toggleIndeterminateBtn);

    interactiveExample.appendChild(buttonsRow);

    // Simulated download
    const downloadSection = document.createElement('div');
    downloadSection.style.marginTop = 'var(--dos-space-md)';

    const downloadLabel = document.createElement('span');
    downloadLabel.textContent = 'Simulated download:';
    downloadLabel.style.color = 'var(--dos-color-text-secondary)';
    downloadSection.appendChild(downloadLabel);

    const downloadProgress = createProgressBar({
      value: 0,
      showValue: true,
      valueFormat: (value) => `${value}%`,
      label: 'Download progress',
    });
    pageProgressBars.push(downloadProgress);
    downloadSection.appendChild(downloadProgress.element);

    let downloadInterval: ReturnType<typeof setInterval> | null = null;

    const startDownloadBtn = createButton({
      label: 'Start Download',
      variant: 'primary',
      onClick: () => {
        if (downloadInterval) {
          clearInterval(downloadInterval);
        }
        downloadProgress.setValue(0);
        downloadProgress.setIndeterminate(false);

        downloadInterval = setInterval(() => {
          const current = downloadProgress.getValue();
          if (current >= 100) {
            clearInterval(downloadInterval!);
            downloadInterval = null;
            toast.success('Download complete!');
          } else {
            downloadProgress.setValue(current + Math.random() * 10);
          }
        }, 200);
      },
    });
    downloadSection.appendChild(startDownloadBtn);

    interactiveExample.appendChild(downloadSection);
  }
  content.appendChild(interactiveSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Progress bars include proper ARIA attributes:
      • role="progressbar" for semantic meaning
      • aria-valuemin="0" (always 0)
      • aria-valuemax for the maximum value
      • aria-valuenow for the current value
      • aria-valuetext for human-readable progress
      • aria-label for accessible description
    `,
    code: `createProgressBar({
  value: 50,
  max: 100,
  showValue: true,
  label: 'File upload progress'
});

// The element will have:
// role="progressbar"
// aria-valuemin="0"
// aria-valuemax="100"
// aria-valuenow="50"
// aria-valuetext="50%"
// aria-label="File upload progress"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    const accessNote = document.createElement('p');
    accessNote.style.marginBottom = 'var(--dos-space-md)';
    accessNote.textContent =
      'Progress bars are non-interactive display elements. Screen readers will announce the current progress value.';
    accessibilityExample.appendChild(accessNote);

    const accessProgress = createProgressBar({
      value: 75,
      showValue: true,
      label: 'Installation progress',
    });
    pageProgressBars.push(accessProgress);
    accessibilityExample.appendChild(accessProgress.element);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  return page;
}

/**
 * Renders the LoadingSpinner demo page
 */
export function renderLoadingSpinnerPage(): HTMLElement {
  const page = document.createElement('div');

  // Track spinners for cleanup
  const pageSpinners: ReturnType<typeof createLoadingSpinner>[] = [];

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'LoadingSpinner';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style ASCII animated loading indicators.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Spinner Section
  const basicSection = createDemoSection({
    title: 'Basic LoadingSpinner',
    description: 'A simple animated spinner using ASCII characters.',
    code: `import { createLoadingSpinner } from 'dosage';

const spinner = createLoadingSpinner({
  label: 'Loading data...'
});

document.body.appendChild(spinner.element);

// When done
spinner.stop();
spinner.destroy();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    basicExample.style.display = 'flex';
    basicExample.style.alignItems = 'center';
    basicExample.style.gap = 'var(--dos-space-md)';

    const spinner = createLoadingSpinner();
    pageSpinners.push(spinner);
    basicExample.appendChild(spinner.element);

    const label = document.createElement('span');
    label.textContent = 'Loading...';
    basicExample.appendChild(label);
  }
  content.appendChild(basicSection);

  // Animation Styles Section
  const stylesSection = createDemoSection({
    title: 'Animation Styles',
    description: 'Three different animation styles: ASCII (default), block, and dots (braille).',
    code: `// ASCII style (default): | / - \\
createLoadingSpinner({ style: 'ascii' });

// Block style: ▖ ▘ ▝ ▗
createLoadingSpinner({ style: 'block' });

// Dots style (braille): ⠋ ⠙ ⠹ ⠸ ...
createLoadingSpinner({ style: 'dots' });`,
  });

  const stylesExample = stylesSection.querySelector('.dos-demo-section___examples');
  if (stylesExample) {
    stylesExample.style.display = 'flex';
    stylesExample.style.flexDirection = 'column';
    stylesExample.style.gap = 'var(--dos-space-md)';

    const styles = [
      { style: 'ascii' as const, name: 'ASCII', frames: '| / - \\' },
      { style: 'block' as const, name: 'Block', frames: '▖ ▘ ▝ ▗' },
      { style: 'dots' as const, name: 'Dots (Braille)', frames: '⠋ ⠙ ⠹ ⠸ ...' },
    ];

    styles.forEach(({ style, name, frames }) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = 'var(--dos-space-sm)';

      const spinner = createLoadingSpinner({ style });
      pageSpinners.push(spinner);
      row.appendChild(spinner.element);

      const label = document.createElement('span');
      label.innerHTML = `<strong>${name}:</strong> ${frames}`;
      row.appendChild(label);

      stylesExample.appendChild(row);
    });
  }
  content.appendChild(stylesSection);

  // Sizes Section
  const sizesSection = createDemoSection({
    title: 'Sizes',
    description: 'Spinners come in three sizes: small, medium (default), and large.',
    code: `createLoadingSpinner({ size: 'small' });
createLoadingSpinner({ size: 'medium' });
createLoadingSpinner({ size: 'large' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.alignItems = 'center';
    sizesExample.style.gap = 'var(--dos-space-lg)';

    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = 'var(--dos-space-xs)';

      const spinner = createLoadingSpinner({ size });
      pageSpinners.push(spinner);
      wrapper.appendChild(spinner.element);

      const label = document.createElement('span');
      label.textContent = size;
      label.style.fontSize = 'var(--dos-font-size-sm)';
      label.style.color = 'var(--dos-color-text-secondary)';
      wrapper.appendChild(label);

      sizesExample.appendChild(wrapper);
    });
  }
  content.appendChild(sizesSection);

  // Speed Control Section
  const speedSection = createDemoSection({
    title: 'Animation Speed',
    description: 'Control the animation speed in milliseconds per frame.',
    code: `// Slow (200ms per frame)
createLoadingSpinner({ speed: 200 });

// Normal (100ms per frame - default)
createLoadingSpinner({ speed: 100 });

// Fast (50ms per frame)
createLoadingSpinner({ speed: 50 });`,
  });

  const speedExample = speedSection.querySelector('.dos-demo-section___examples');
  if (speedExample) {
    speedExample.style.display = 'flex';
    speedExample.style.alignItems = 'center';
    speedExample.style.gap = 'var(--dos-space-lg)';

    const speeds = [
      { speed: 200, name: 'Slow' },
      { speed: 100, name: 'Normal' },
      { speed: 50, name: 'Fast' },
    ];

    speeds.forEach(({ speed, name }) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = 'var(--dos-space-xs)';

      const spinner = createLoadingSpinner({ speed });
      pageSpinners.push(spinner);
      wrapper.appendChild(spinner.element);

      const label = document.createElement('span');
      label.textContent = `${name} (${speed}ms)`;
      label.style.fontSize = 'var(--dos-font-size-sm)';
      label.style.color = 'var(--dos-color-text-secondary)';
      wrapper.appendChild(label);

      speedExample.appendChild(wrapper);
    });
  }
  content.appendChild(speedSection);

  // Interactive Control Section
  const controlSection = createDemoSection({
    title: 'Interactive Control',
    description: 'Control spinners programmatically with start(), stop(), and setLabel().',
    code: `const spinner = createLoadingSpinner({
  label: 'Processing...'
});

// Start/stop animation
spinner.start();
spinner.stop();

// Check state
spinner.isAnimating(); // true/false

// Update label
spinner.setLabel('Almost done...');

// Clean up
spinner.destroy();`,
  });

  const controlExample = controlSection.querySelector('.dos-demo-section___examples');
  if (controlExample) {
    controlExample.style.display = 'flex';
    controlExample.style.flexDirection = 'column';
    controlExample.style.gap = 'var(--dos-space-md)';

    const spinnerRow = document.createElement('div');
    spinnerRow.style.display = 'flex';
    spinnerRow.style.alignItems = 'center';
    spinnerRow.style.gap = 'var(--dos-space-sm)';

    const controlledSpinner = createLoadingSpinner({
      size: 'large',
      label: 'Processing...',
    });
    pageSpinners.push(controlledSpinner);
    spinnerRow.appendChild(controlledSpinner.element);

    const statusLabel = document.createElement('span');
    statusLabel.textContent = 'Processing...';
    spinnerRow.appendChild(statusLabel);

    controlExample.appendChild(spinnerRow);

    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const startBtn = createButton({
      label: 'Start',
      variant: 'primary',
      onClick: () => {
        controlledSpinner.start();
        statusLabel.textContent = 'Running...';
      },
    });
    buttonsRow.appendChild(startBtn);

    const stopBtn = createButton({
      label: 'Stop',
      variant: 'secondary',
      onClick: () => {
        controlledSpinner.stop();
        statusLabel.textContent = 'Stopped';
      },
    });
    buttonsRow.appendChild(stopBtn);

    const labels = ['Loading...', 'Processing...', 'Please wait...', 'Almost done...'];
    let labelIndex = 0;
    const changeLabelBtn = createButton({
      label: 'Change Label',
      variant: 'secondary',
      onClick: () => {
        labelIndex = (labelIndex + 1) % labels.length;
        const newLabel = labels[labelIndex] as string;
        controlledSpinner.setLabel(newLabel);
        statusLabel.textContent = newLabel;
      },
    });
    buttonsRow.appendChild(changeLabelBtn);

    controlExample.appendChild(buttonsRow);
  }
  content.appendChild(controlSection);

  // In Context Section
  const contextSection = createDemoSection({
    title: 'In Context',
    description: 'Examples of spinners used in common UI patterns.',
    code: `// With button loading state - use inherit for visibility
button.disabled = true;
const spinner = createLoadingSpinner({ 
  size: 'small',
  color: 'inherit' // Inherits button text color
});
button.prepend(spinner.element);

// Inline loading indicator
<span>Loading data {spinner} please wait...</span>`,
  });

  const contextExample = contextSection.querySelector('.dos-demo-section___examples');
  if (contextExample) {
    contextExample.style.display = 'flex';
    contextExample.style.flexDirection = 'column';
    contextExample.style.gap = 'var(--dos-space-lg)';

    // Button with spinner
    const buttonExample = document.createElement('div');
    buttonExample.style.display = 'flex';
    buttonExample.style.alignItems = 'center';
    buttonExample.style.gap = 'var(--dos-space-sm)';

    const loadingBtn = createButton({
      label: 'Submit',
      variant: 'primary',
    });
    loadingBtn.style.display = 'inline-flex';
    loadingBtn.style.alignItems = 'center';
    loadingBtn.style.gap = 'var(--dos-space-xs)';

    let isLoading = false;
    let btnSpinner: ReturnType<typeof createLoadingSpinner> | null = null;
    loadingBtn.addEventListener('click', () => {
      if (isLoading) return;

      isLoading = true;
      btnSpinner = createLoadingSpinner({ size: 'small', color: 'inherit' });
      pageSpinners.push(btnSpinner);
      loadingBtn.prepend(btnSpinner.element);
      loadingBtn.querySelector('.dos-button__label')!.textContent = 'Loading...';
      (loadingBtn as HTMLButtonElement).disabled = true;

      setTimeout(() => {
        if (btnSpinner) {
          btnSpinner.destroy();
          pageSpinners.splice(pageSpinners.indexOf(btnSpinner), 1);
        }
        loadingBtn.querySelector('.dos-button__label')!.textContent = 'Submit';
        (loadingBtn as HTMLButtonElement).disabled = false;
        isLoading = false;
        toast.success('Submitted successfully!');
      }, 2000);
    });
    buttonExample.appendChild(loadingBtn);

    const btnLabel = document.createElement('span');
    btnLabel.textContent = '← Click to see button loading state';
    btnLabel.style.color = 'var(--dos-color-text-secondary)';
    buttonExample.appendChild(btnLabel);

    contextExample.appendChild(buttonExample);

    // Inline text with spinner
    const inlineExample = document.createElement('div');
    inlineExample.style.display = 'flex';
    inlineExample.style.alignItems = 'center';
    inlineExample.style.gap = 'var(--dos-space-xs)';

    const text1 = document.createElement('span');
    text1.textContent = 'Fetching results';
    inlineExample.appendChild(text1);

    const inlineSpinner = createLoadingSpinner({ size: 'small' });
    pageSpinners.push(inlineSpinner);
    inlineExample.appendChild(inlineSpinner.element);

    const text2 = document.createElement('span');
    text2.textContent = 'please wait...';
    inlineExample.appendChild(text2);

    contextExample.appendChild(inlineExample);

    // Button variants example
    const buttonVariantsLabel = document.createElement('div');
    buttonVariantsLabel.style.marginTop = 'var(--dos-space-md)';
    buttonVariantsLabel.innerHTML = '<strong>Button Variants with Spinners:</strong>';
    contextExample.appendChild(buttonVariantsLabel);

    const buttonVariantsContainer = document.createElement('div');
    buttonVariantsContainer.style.display = 'flex';
    buttonVariantsContainer.style.flexWrap = 'wrap';
    buttonVariantsContainer.style.gap = 'var(--dos-space-sm)';

    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
    variants.forEach((variant) => {
      const btn = createButton({
        label: 'Loading',
        variant: variant,
      });
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.gap = 'var(--dos-space-xs)';

      const spinner = createLoadingSpinner({ size: 'small', color: 'inherit' });
      pageSpinners.push(spinner);
      btn.prepend(spinner.element);

      buttonVariantsContainer.appendChild(btn);
    });

    contextExample.appendChild(buttonVariantsContainer);
  }
  content.appendChild(contextSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Loading spinners include proper ARIA attributes:
      • role="status" for semantic meaning
      • aria-live="polite" for screen reader announcements
      • aria-label for descriptive loading text
      • Character is hidden from screen readers with aria-hidden
    `,
    code: `createLoadingSpinner({
  label: 'Loading user data'
});

// The element will have:
// role="status"
// aria-live="polite"
// aria-label="Loading user data"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    const accessNote = document.createElement('p');
    accessNote.style.marginBottom = 'var(--dos-space-md)';
    accessNote.textContent =
      'Screen readers will announce the label when the spinner appears, helping users understand what is loading.';
    accessibilityExample.appendChild(accessNote);

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = 'var(--dos-space-sm)';

    const accessSpinner = createLoadingSpinner({
      label: 'Loading user data',
    });
    pageSpinners.push(accessSpinner);
    row.appendChild(accessSpinner.element);

    const label = document.createElement('span');
    label.textContent = 'Loading user data';
    row.appendChild(label);

    accessibilityExample.appendChild(row);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  // Cleanup function
  const cleanup = () => {
    pageSpinners.forEach((spinner) => {
      spinner.destroy();
    });
    pageSpinners.length = 0;
  };

  page.addEventListener('DOMNodeRemoved', cleanup);

  return page;
}

/**
 * Renders the SkeletonLoader demo page
 */
export function renderSkeletonLoaderPage(): HTMLElement {
  const page = document.createElement('div');

  // Track skeletons for cleanup
  const pageSkeletons: ReturnType<typeof createSkeletonLoader>[] = [];

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'SkeletonLoader';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style content placeholders using ASCII block characters.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Skeleton Section
  const basicSection = createDemoSection({
    title: 'Basic SkeletonLoader',
    description: 'Content placeholders shown while data is loading.',
    code: `import { createSkeletonLoader } from 'dosage';

// Single line text skeleton
const skeleton = createSkeletonLoader({
  variant: 'text',
  width: 20,
  label: 'Loading text...'
});

document.body.appendChild(skeleton.element);

// When content loads
skeleton.hide();
// or
skeleton.destroy();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    basicExample.style.display = 'flex';
    basicExample.style.flexDirection = 'column';
    basicExample.style.gap = 'var(--dos-space-md)';

    const label1 = document.createElement('span');
    label1.textContent = 'Single line:';
    label1.style.color = 'var(--dos-color-text-secondary)';
    basicExample.appendChild(label1);

    const skeleton1 = createSkeletonLoader({
      variant: 'text',
      width: 30,
    });
    pageSkeletons.push(skeleton1);
    basicExample.appendChild(skeleton1.element);

    const label2 = document.createElement('span');
    label2.textContent = 'Multi-line:';
    label2.style.color = 'var(--dos-color-text-secondary)';
    label2.style.marginTop = 'var(--dos-space-sm)';
    basicExample.appendChild(label2);

    const skeleton2 = createSkeletonLoader({
      variant: 'text',
      width: '100%',
      lines: 3,
    });
    pageSkeletons.push(skeleton2);
    basicExample.appendChild(skeleton2.element);
  }
  content.appendChild(basicSection);

  // Variants Section
  const variantsSection = createDemoSection({
    title: 'Shape Variants',
    description: 'Three shape variants: text (lines), rectangle (blocks), and circle (avatars).',
    code: `// Text lines
createSkeletonLoader({
  variant: 'text',
  lines: 2
});

// Rectangle (card/image)
createSkeletonLoader({
  variant: 'rectangle',
  width: '200px',
  height: '100px'
});

// Circle (avatar)
createSkeletonLoader({
  variant: 'circle',
  width: '3em'
});`,
  });

  const variantsExample = variantsSection.querySelector('.dos-demo-section___examples');
  if (variantsExample) {
    variantsExample.style.display = 'flex';
    variantsExample.style.flexWrap = 'wrap';
    variantsExample.style.gap = 'var(--dos-space-lg)';
    variantsExample.style.alignItems = 'flex-start';

    // Text variant
    const textWrapper = document.createElement('div');
    textWrapper.style.display = 'flex';
    textWrapper.style.flexDirection = 'column';
    textWrapper.style.gap = 'var(--dos-space-xs)';

    const textLabel = document.createElement('span');
    textLabel.textContent = 'Text:';
    textLabel.style.color = 'var(--dos-color-text-secondary)';
    textLabel.style.fontSize = 'var(--dos-font-size-sm)';
    textWrapper.appendChild(textLabel);

    const textSkeleton = createSkeletonLoader({
      variant: 'text',
      width: 25,
      lines: 2,
    });
    pageSkeletons.push(textSkeleton);
    textWrapper.appendChild(textSkeleton.element);

    variantsExample.appendChild(textWrapper);

    // Rectangle variant
    const rectWrapper = document.createElement('div');
    rectWrapper.style.display = 'flex';
    rectWrapper.style.flexDirection = 'column';
    rectWrapper.style.gap = 'var(--dos-space-xs)';

    const rectLabel = document.createElement('span');
    rectLabel.textContent = 'Rectangle:';
    rectLabel.style.color = 'var(--dos-color-text-secondary)';
    rectLabel.style.fontSize = 'var(--dos-font-size-sm)';
    rectWrapper.appendChild(rectLabel);

    const rectSkeleton = createSkeletonLoader({
      variant: 'rectangle',
      width: '150px',
      height: '80px',
    });
    pageSkeletons.push(rectSkeleton);
    rectWrapper.appendChild(rectSkeleton.element);

    variantsExample.appendChild(rectWrapper);

    // Circle variant
    const circleWrapper = document.createElement('div');
    circleWrapper.style.display = 'flex';
    circleWrapper.style.flexDirection = 'column';
    circleWrapper.style.gap = 'var(--dos-space-xs)';

    const circleLabel = document.createElement('span');
    circleLabel.textContent = 'Circle:';
    circleLabel.style.color = 'var(--dos-color-text-secondary)';
    circleLabel.style.fontSize = 'var(--dos-font-size-sm)';
    circleWrapper.appendChild(circleLabel);

    const circleSkeleton = createSkeletonLoader({
      variant: 'circle',
      width: '4em',
    });
    pageSkeletons.push(circleSkeleton);
    circleWrapper.appendChild(circleSkeleton.element);

    variantsExample.appendChild(circleWrapper);
  }
  content.appendChild(variantsSection);

  // Animation Section
  const animationSection = createDemoSection({
    title: 'Animation',
    description: 'Skeletons animate by default to indicate loading. Animation can be disabled.',
    code: `// Animated (default)
createSkeletonLoader({
  variant: 'text',
  animate: true
});

// Static (no animation)
createSkeletonLoader({
  variant: 'text',
  animate: false
});`,
  });

  const animationExample = animationSection.querySelector('.dos-demo-section___examples');
  if (animationExample) {
    animationExample.style.display = 'flex';
    animationExample.style.flexDirection = 'column';
    animationExample.style.gap = 'var(--dos-space-md)';

    const animatedWrapper = document.createElement('div');
    animatedWrapper.style.display = 'flex';
    animatedWrapper.style.alignItems = 'center';
    animatedWrapper.style.gap = 'var(--dos-space-sm)';

    const animatedLabel = document.createElement('span');
    animatedLabel.textContent = 'Animated:';
    animatedLabel.style.minWidth = '8ch';
    animatedLabel.style.color = 'var(--dos-color-text-secondary)';
    animatedWrapper.appendChild(animatedLabel);

    const animatedSkeleton = createSkeletonLoader({
      variant: 'text',
      width: 20,
      animate: true,
    });
    pageSkeletons.push(animatedSkeleton);
    animatedWrapper.appendChild(animatedSkeleton.element);

    animationExample.appendChild(animatedWrapper);

    const staticWrapper = document.createElement('div');
    staticWrapper.style.display = 'flex';
    staticWrapper.style.alignItems = 'center';
    staticWrapper.style.gap = 'var(--dos-space-sm)';

    const staticLabel = document.createElement('span');
    staticLabel.textContent = 'Static:';
    staticLabel.style.minWidth = '8ch';
    staticLabel.style.color = 'var(--dos-color-text-secondary)';
    staticWrapper.appendChild(staticLabel);

    const staticSkeleton = createSkeletonLoader({
      variant: 'text',
      width: 20,
      animate: false,
    });
    pageSkeletons.push(staticSkeleton);
    staticWrapper.appendChild(staticSkeleton.element);

    animationExample.appendChild(staticWrapper);
  }
  content.appendChild(animationSection);

  // Common Patterns Section
  const patternsSection = createDemoSection({
    title: 'Common Patterns',
    description: 'Skeleton layouts for common UI patterns: cards, lists, and profiles.',
    code: `// Card skeleton
const cardWrapper = document.createElement('div');
cardWrapper.appendChild(createSkeletonLoader({
  variant: 'rectangle',
  width: '100%',
  height: '120px'
}).element);
cardWrapper.appendChild(createSkeletonLoader({
  variant: 'text',
  lines: 3
}).element);

// User profile skeleton
const profile = document.createElement('div');
profile.appendChild(createSkeletonLoader({
  variant: 'circle',
  width: '48px'
}).element);
profile.appendChild(createSkeletonLoader({
  variant: 'text',
  width: 15
}).element);`,
  });

  const patternsExample = patternsSection.querySelector('.dos-demo-section___examples');
  if (patternsExample) {
    patternsExample.style.display = 'flex';
    patternsExample.style.flexWrap = 'wrap';
    patternsExample.style.gap = 'var(--dos-space-xl)';
    patternsExample.style.alignItems = 'flex-start';

    // Card skeleton pattern
    const cardPattern = document.createElement('div');
    cardPattern.style.display = 'flex';
    cardPattern.style.flexDirection = 'column';
    cardPattern.style.gap = 'var(--dos-space-xs)';
    cardPattern.style.width = '200px';
    cardPattern.style.border = '1px solid var(--dos-color-border)';
    cardPattern.style.padding = 'var(--dos-space-sm)';

    const cardLabel = document.createElement('span');
    cardLabel.textContent = 'Card Pattern:';
    cardLabel.style.color = 'var(--dos-color-text-secondary)';
    cardLabel.style.fontSize = 'var(--dos-font-size-sm)';
    cardLabel.style.marginBottom = 'var(--dos-space-xs)';
    cardPattern.appendChild(cardLabel);

    const cardImage = createSkeletonLoader({
      variant: 'rectangle',
      width: '100%',
      height: '80px',
    });
    pageSkeletons.push(cardImage);
    cardPattern.appendChild(cardImage.element);

    const cardTitle = createSkeletonLoader({
      variant: 'text',
      width: '80%',
    });
    pageSkeletons.push(cardTitle);
    cardTitle.element.style.marginTop = 'var(--dos-space-sm)';
    cardPattern.appendChild(cardTitle.element);

    const cardText = createSkeletonLoader({
      variant: 'text',
      width: '100%',
      lines: 2,
    });
    pageSkeletons.push(cardText);
    cardPattern.appendChild(cardText.element);

    patternsExample.appendChild(cardPattern);

    // User profile skeleton pattern
    const profilePattern = document.createElement('div');
    profilePattern.style.display = 'flex';
    profilePattern.style.flexDirection = 'column';
    profilePattern.style.gap = 'var(--dos-space-xs)';

    const profileLabel = document.createElement('span');
    profileLabel.textContent = 'Profile Pattern:';
    profileLabel.style.color = 'var(--dos-color-text-secondary)';
    profileLabel.style.fontSize = 'var(--dos-font-size-sm)';
    profileLabel.style.marginBottom = 'var(--dos-space-xs)';
    profilePattern.appendChild(profileLabel);

    const profileRow = document.createElement('div');
    profileRow.style.display = 'flex';
    profileRow.style.alignItems = 'center';
    profileRow.style.gap = 'var(--dos-space-sm)';

    const avatar = createSkeletonLoader({
      variant: 'circle',
      width: '3em',
    });
    pageSkeletons.push(avatar);
    profileRow.appendChild(avatar.element);

    const profileInfo = document.createElement('div');
    profileInfo.style.display = 'flex';
    profileInfo.style.flexDirection = 'column';
    profileInfo.style.gap = 'var(--dos-space-xs)';

    const name = createSkeletonLoader({
      variant: 'text',
      width: 15,
    });
    pageSkeletons.push(name);
    profileInfo.appendChild(name.element);

    const role = createSkeletonLoader({
      variant: 'text',
      width: 10,
    });
    pageSkeletons.push(role);
    profileInfo.appendChild(role.element);

    profileRow.appendChild(profileInfo);
    profilePattern.appendChild(profileRow);

    patternsExample.appendChild(profilePattern);

    // List skeleton pattern
    const listPattern = document.createElement('div');
    listPattern.style.display = 'flex';
    listPattern.style.flexDirection = 'column';
    listPattern.style.gap = 'var(--dos-space-xs)';

    const listLabel = document.createElement('span');
    listLabel.textContent = 'List Pattern:';
    listLabel.style.color = 'var(--dos-color-text-secondary)';
    listLabel.style.fontSize = 'var(--dos-font-size-sm)';
    listLabel.style.marginBottom = 'var(--dos-space-xs)';
    listPattern.appendChild(listLabel);

    for (let i = 0; i < 3; i++) {
      const listItem = document.createElement('div');
      listItem.style.display = 'flex';
      listItem.style.alignItems = 'center';
      listItem.style.gap = 'var(--dos-space-sm)';
      listItem.style.padding = 'var(--dos-space-xs) 0';

      const bullet = createSkeletonLoader({
        variant: 'circle',
        width: '1.5em',
      });
      pageSkeletons.push(bullet);
      listItem.appendChild(bullet.element);

      const itemText = createSkeletonLoader({
        variant: 'text',
        width: 18 + Math.floor(Math.random() * 8),
      });
      pageSkeletons.push(itemText);
      listItem.appendChild(itemText.element);

      listPattern.appendChild(listItem);
    }

    patternsExample.appendChild(listPattern);
  }
  content.appendChild(patternsSection);

  // Interactive Demo Section
  const interactiveSection = createDemoSection({
    title: 'Interactive Demo',
    description: 'Toggle between skeleton and loaded content.',
    code: `const skeleton = createSkeletonLoader({
  variant: 'text',
  lines: 3,
  label: 'Loading article'
});

// Show skeleton while loading
document.body.appendChild(skeleton.element);

// When content loads
skeleton.hide();
// Display actual content

// Control methods
skeleton.show();
skeleton.hide();
skeleton.isVisible();
skeleton.destroy();`,
  });

  const interactiveExample = interactiveSection.querySelector('.dos-demo-section___examples');
  if (interactiveExample) {
    interactiveExample.style.display = 'flex';
    interactiveExample.style.flexDirection = 'column';
    interactiveExample.style.gap = 'var(--dos-space-md)';

    // Container for skeleton and content
    const demoContainer = document.createElement('div');
    demoContainer.style.minHeight = '100px';
    demoContainer.style.border = '1px solid var(--dos-color-border)';
    demoContainer.style.padding = 'var(--dos-space-md)';

    const demoSkeleton = createSkeletonLoader({
      variant: 'text',
      width: '100%',
      lines: 4,
      label: 'Loading article content',
    });
    pageSkeletons.push(demoSkeleton);
    demoContainer.appendChild(demoSkeleton.element);

    const actualContent = document.createElement('div');
    actualContent.style.display = 'none';
    actualContent.innerHTML = `
      <h3 style="margin: 0 0 0.5em;">Article Title</h3>
      <p style="margin: 0;">This is the actual content that appears after loading is complete. 
      The skeleton provides a visual placeholder while the data is being fetched.</p>
    `;
    demoContainer.appendChild(actualContent);

    interactiveExample.appendChild(demoContainer);

    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.flexWrap = 'wrap';
    buttonsRow.style.gap = 'var(--dos-space-sm)';

    const showSkeletonBtn = createButton({
      label: 'Show Skeleton',
      variant: 'secondary',
      onClick: () => {
        demoSkeleton.show();
        actualContent.style.display = 'none';
      },
    });
    buttonsRow.appendChild(showSkeletonBtn);

    const showContentBtn = createButton({
      label: 'Show Content',
      variant: 'primary',
      onClick: () => {
        demoSkeleton.hide();
        actualContent.style.display = 'block';
      },
    });
    buttonsRow.appendChild(showContentBtn);

    const simulateLoadBtn = createButton({
      label: 'Simulate Load (2s)',
      variant: 'secondary',
      onClick: () => {
        demoSkeleton.show();
        actualContent.style.display = 'none';

        setTimeout(() => {
          demoSkeleton.hide();
          actualContent.style.display = 'block';
          toast.success('Content loaded!');
        }, 2000);
      },
    });
    buttonsRow.appendChild(simulateLoadBtn);

    interactiveExample.appendChild(buttonsRow);
  }
  content.appendChild(interactiveSection);

  // Accessibility Section
  const accessibilitySection = createDemoSection({
    title: 'Accessibility',
    description: `
      Skeleton loaders include proper ARIA attributes:
      • role="status" for semantic meaning
      • aria-busy="true" to indicate loading state
      • aria-label for descriptive text
      • Visual content hidden from screen readers
    `,
    code: `createSkeletonLoader({
  variant: 'text',
  lines: 3,
  label: 'Loading user profile'
});

// The element will have:
// role="status"
// aria-busy="true"
// aria-label="Loading user profile"`,
  });

  const accessibilityExample = accessibilitySection.querySelector('.dos-demo-section___examples');
  if (accessibilityExample) {
    const accessNote = document.createElement('p');
    accessNote.style.marginBottom = 'var(--dos-space-md)';
    accessNote.textContent =
      'Screen readers will announce the loading state without reading the placeholder characters.';
    accessibilityExample.appendChild(accessNote);

    const accessSkeleton = createSkeletonLoader({
      variant: 'text',
      width: '100%',
      lines: 2,
      label: 'Loading user profile',
    });
    pageSkeletons.push(accessSkeleton);
    accessibilityExample.appendChild(accessSkeleton.element);
  }
  content.appendChild(accessibilitySection);

  page.appendChild(content);

  // Cleanup function
  const cleanup = () => {
    pageSkeletons.forEach((skeleton) => {
      skeleton.destroy();
    });
    pageSkeletons.length = 0;
  };

  page.addEventListener('DOMNodeRemoved', cleanup);

  return page;
}
