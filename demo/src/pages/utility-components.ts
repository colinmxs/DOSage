/**
 * Utility Components Demo Pages
 * 
 * Kitchen Sink demo pages for Phase 11 utility components.
 */

import {
  createPortal,
  createFocusTrap,
  createKeyboardShortcutHandler,
  createScrollArea,
  createResizable,
  createDraggable,
  createVisuallyHidden,
  createButton,
  createPanel,
  createText,
  createHeading,
  createTextInput,
} from 'dosage';

/**
 * Creates a demo section with title, description, and examples
 */
function createDemoSection(title: string, description: string): HTMLElement {
  const section = document.createElement('section');
  section.className = 'dos-demo-section';

  const titleEl = document.createElement('h3');
  titleEl.className = 'dos-demo-section___title';
  titleEl.textContent = title;
  section.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement('p');
    descEl.className = 'dos-demo-section___description';
    descEl.textContent = description;
    section.appendChild(descEl);
  }

  return section;
}

/**
 * Creates an examples container
 */
function createExamplesContainer(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dos-demo-section___examples';
  return container;
}

/**
 * Creates a code snippet display
 */
function createCodeSnippet(code: string): HTMLElement {
  const pre = document.createElement('pre');
  pre.className = 'dos-demo-code';
  const codeEl = document.createElement('code');
  codeEl.textContent = code;
  pre.appendChild(codeEl);
  return pre;
}

// =============================================================================
// Portal Page
// =============================================================================

export function renderPortalPage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Portal';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Renders content into a different part of the DOM tree. Useful for modals, tooltips, and other overlay content.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Basic Portal', 'Content rendered at the end of document.body');
  const basicExamples = createExamplesContainer();

  let portalInstance: ReturnType<typeof createPortal> | null = null;

  const openBtn = createButton({
    label: 'Open Portal',
    variant: 'primary',
    onClick: () => {
      if (portalInstance) {
        portalInstance.destroy();
      }
      
      const portalContent = document.createElement('div');
      portalContent.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--dos-bg-primary); border: 2px solid var(--dos-text-primary); padding: 20px; z-index: 1000;';
      portalContent.innerHTML = `
        <div style="font-family: var(--dos-font-family); color: var(--dos-text-primary);">
          ╔═══════════════════════╗<br>
          ║  Portal Content!      ║<br>
          ║                       ║<br>
          ║  I'm rendered at      ║<br>
          ║  document.body        ║<br>
          ╚═══════════════════════╝
        </div>
      `;

      const closeBtn = createButton({
        label: '[X] Close',
        variant: 'secondary',
        onClick: () => {
          if (portalInstance) {
            portalInstance.destroy();
            portalInstance = null;
          }
        },
      });
      portalContent.appendChild(closeBtn);

      portalInstance = createPortal({ content: portalContent });
    },
  });

  basicExamples.appendChild(openBtn);
  basicSection.appendChild(basicExamples);

  basicSection.appendChild(createCodeSnippet(`import { createPortal } from 'dosage';

const portal = createPortal({
  content: myModalElement,
  target: document.body, // default
});

// Later: cleanup
portal.destroy();`));

  content.appendChild(basicSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}

// =============================================================================
// FocusTrap Page
// =============================================================================

export function renderFocusTrapPage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'FocusTrap';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Traps keyboard focus within a container. Essential for modal dialogs and other overlay content.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Focus Trap Demo', 'Tab key cycles through elements within the trap');
  const basicExamples = createExamplesContainer();

  const trapContainer = document.createElement('div');
  trapContainer.style.cssText = 'border: 2px dashed var(--dos-text-secondary); padding: 16px; margin: 8px 0;';
  
  const trapContent = document.createElement('div');
  trapContent.innerHTML = `
    <p style="margin-bottom: 12px;">Focus is trapped within this box. Try pressing Tab!</p>
  `;

  const input1 = createTextInput({ placeholder: 'First input', name: 'first' });
  const input2 = createTextInput({ placeholder: 'Second input', name: 'second' });
  const btn = createButton({ label: 'A Button', variant: 'secondary' });

  trapContent.appendChild(input1);
  trapContent.appendChild(document.createElement('br'));
  trapContent.appendChild(document.createElement('br'));
  trapContent.appendChild(input2);
  trapContent.appendChild(document.createElement('br'));
  trapContent.appendChild(document.createElement('br'));
  trapContent.appendChild(btn);

  trapContainer.appendChild(trapContent);

  let focusTrap: ReturnType<typeof createFocusTrap> | null = null;

  const activateBtn = createButton({
    label: 'Activate Trap',
    variant: 'primary',
    onClick: () => {
      if (!focusTrap) {
        focusTrap = createFocusTrap({
          container: trapContainer,
          initialFocus: input1.querySelector('input') as HTMLElement,
        });
      }
      focusTrap.activate();
      trapContainer.style.borderColor = 'var(--dos-color-success)';
    },
  });

  const deactivateBtn = createButton({
    label: 'Deactivate Trap',
    variant: 'secondary',
    onClick: () => {
      if (focusTrap) {
        focusTrap.deactivate();
        trapContainer.style.borderColor = 'var(--dos-text-secondary)';
      }
    },
  });

  basicExamples.appendChild(activateBtn);
  basicExamples.appendChild(document.createTextNode(' '));
  basicExamples.appendChild(deactivateBtn);
  basicExamples.appendChild(trapContainer);
  basicSection.appendChild(basicExamples);

  basicSection.appendChild(createCodeSnippet(`import { createFocusTrap } from 'dosage';

const trap = createFocusTrap({
  container: modalElement,
  initialFocus: firstInput,
  escapeDeactivates: true,
  returnFocusOnDeactivate: true,
});

trap.activate();
// Later:
trap.deactivate();`));

  content.appendChild(basicSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}

// =============================================================================
// KeyboardShortcutHandler Page
// =============================================================================

export function renderKeyboardShortcutsPage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'KeyboardShortcutHandler';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Register and handle keyboard shortcuts with support for modifier keys and sequences.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Try These Shortcuts', 'Press the keyboard shortcuts below');
  const basicExamples = createExamplesContainer();

  const output = document.createElement('div');
  output.style.cssText = 'font-family: var(--dos-font-family); padding: 12px; border: 1px solid var(--dos-text-secondary); min-height: 60px; margin-top: 12px;';
  output.textContent = 'Press a shortcut to see it here...';

  const handler = createKeyboardShortcutHandler({ scope: 'global' });

  handler.register({ key: 'a', ctrl: true }, () => {
    output.textContent = '✓ Ctrl+A was pressed!';
  });

  handler.register({ key: 's', ctrl: true }, () => {
    output.textContent = '✓ Ctrl+S was pressed!';
  });

  handler.register({ key: 'Escape' }, () => {
    output.textContent = '✓ Escape was pressed!';
  });

  handler.register({ key: 'k', ctrl: true }, () => {
    output.textContent = '✓ Ctrl+K was pressed!';
  });

  const shortcuts = document.createElement('div');
  shortcuts.innerHTML = `
    <p><kbd>Ctrl</kbd> + <kbd>A</kbd> - Select all (intercepted)</p>
    <p><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save (intercepted)</p>
    <p><kbd>Ctrl</kbd> + <kbd>K</kbd> - Quick action</p>
    <p><kbd>Escape</kbd> - Cancel</p>
  `;
  shortcuts.style.cssText = 'font-family: var(--dos-font-family); line-height: 2;';

  basicExamples.appendChild(shortcuts);
  basicExamples.appendChild(output);
  basicSection.appendChild(basicExamples);

  basicSection.appendChild(createCodeSnippet(`import { createKeyboardShortcutHandler } from 'dosage';

const handler = createKeyboardShortcutHandler({ scope: 'global' });

handler.register({ key: 's', ctrl: true }, () => {
  console.log('Save!');
});

handler.register({ key: 'Escape' }, () => {
  console.log('Cancel!');
});

// Cleanup
handler.destroy();`));

  content.appendChild(basicSection);
  page.appendChild(header);
  page.appendChild(content);

  // Cleanup on page unload
  page.addEventListener('remove', () => handler.destroy());

  return page;
}

// =============================================================================
// ScrollArea Page
// =============================================================================

export function renderScrollAreaPage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'ScrollArea';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Custom DOS-style scrollbars with arrow buttons and draggable thumb.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Vertical Scroll
  const verticalSection = createDemoSection('Vertical Scrollbar', 'Classic DOS-style with ▲ and ▼ buttons');
  const verticalExamples = createExamplesContainer();

  const verticalContent = document.createElement('div');
  verticalContent.innerHTML = Array(30).fill(0).map((_, i) => `<p>Line ${i + 1}: Lorem ipsum dolor sit amet consectetur.</p>`).join('');

  const verticalScroll = createScrollArea({
    content: verticalContent,
    orientation: 'vertical',
    width: '400px',
    height: '200px',
  });

  verticalExamples.appendChild(verticalScroll.element);
  verticalSection.appendChild(verticalExamples);

  // Horizontal Scroll
  const horizontalSection = createDemoSection('Horizontal Scrollbar', 'With ◄ and ► buttons');
  const horizontalExamples = createExamplesContainer();

  const horizontalContent = document.createElement('div');
  horizontalContent.style.whiteSpace = 'nowrap';
  horizontalContent.innerHTML = '<p>' + '═'.repeat(200) + '</p><p>This content is very wide and requires horizontal scrolling to view completely.</p>';

  const horizontalScroll = createScrollArea({
    content: horizontalContent,
    orientation: 'horizontal',
    width: '400px',
    height: '80px',
  });

  horizontalExamples.appendChild(horizontalScroll.element);
  horizontalSection.appendChild(horizontalExamples);

  // Both directions
  const bothSection = createDemoSection('Both Directions', 'Vertical and horizontal scrolling');
  const bothExamples = createExamplesContainer();

  const bothContent = document.createElement('div');
  bothContent.style.whiteSpace = 'nowrap';
  bothContent.innerHTML = Array(20).fill(0).map((_, i) => `<p>Line ${i + 1}: ${'═'.repeat(100)}</p>`).join('');

  const bothScroll = createScrollArea({
    content: bothContent,
    orientation: 'both',
    width: '400px',
    height: '200px',
  });

  bothExamples.appendChild(bothScroll.element);
  bothSection.appendChild(bothExamples);

  bothSection.appendChild(createCodeSnippet(`import { createScrollArea } from 'dosage';

const scrollArea = createScrollArea({
  content: myContent,
  orientation: 'both', // 'vertical' | 'horizontal' | 'both'
  width: '400px',
  height: '200px',
  autoHide: false,
});

// Programmatic scrolling
scrollArea.scrollTo(0, 100);
scrollArea.scrollToTop();
scrollArea.scrollToBottom();`));

  content.appendChild(verticalSection);
  content.appendChild(horizontalSection);
  content.appendChild(bothSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}

// =============================================================================
// Resizable Page
// =============================================================================

export function renderResizablePage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Resizable';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Make elements resizable by dragging edges and corners.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Resizable Box', 'Drag edges or corners to resize');
  const basicExamples = createExamplesContainer();
  basicExamples.style.minHeight = '300px';
  basicExamples.style.position = 'relative';

  const boxContent = document.createElement('div');
  boxContent.style.cssText = 'padding: 16px; font-family: var(--dos-font-family); background: var(--dos-bg-secondary); height: 100%; box-sizing: border-box;';
  boxContent.innerHTML = `
    ╔═══════════════════╗<br>
    ║  Resize Me!       ║<br>
    ║                   ║<br>
    ║  Drag any edge    ║<br>
    ║  or corner        ║<br>
    ╚═══════════════════╝
  `;

  const resizable = createResizable({
    content: boxContent,
    initialWidth: 200,
    initialHeight: 150,
    minWidth: 100,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    handles: ['right', 'bottom', 'bottom-right'],
  });

  basicExamples.appendChild(resizable.element);
  basicSection.appendChild(basicExamples);

  // All Handles
  const allSection = createDemoSection('All Handles', 'Resize from any direction');
  const allExamples = createExamplesContainer();
  allExamples.style.minHeight = '350px';
  allExamples.style.position = 'relative';

  const allContent = document.createElement('div');
  allContent.style.cssText = 'padding: 16px; font-family: var(--dos-font-family); background: var(--dos-bg-secondary); height: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center;';
  allContent.textContent = '8-way resize';

  const resizableAll = createResizable({
    content: allContent,
    initialWidth: 180,
    initialHeight: 120,
    minWidth: 80,
    minHeight: 60,
    handles: ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
  });

  allExamples.appendChild(resizableAll.element);
  allSection.appendChild(allExamples);

  allSection.appendChild(createCodeSnippet(`import { createResizable } from 'dosage';

const resizable = createResizable({
  content: myElement,
  initialWidth: 200,
  initialHeight: 150,
  minWidth: 100,
  minHeight: 80,
  maxWidth: 500,
  handles: ['right', 'bottom', 'bottom-right'],
  onResize: ({ width, height }) => {
    console.log(\`Size: \${width}x\${height}\`);
  },
});

// Programmatic resize
resizable.setSize(300, 200);`));

  content.appendChild(basicSection);
  content.appendChild(allSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}

// =============================================================================
// Draggable Page
// =============================================================================

export function renderDraggablePage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Draggable';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Make elements draggable with mouse or keyboard.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Basic Draggable', 'Drag with mouse or use arrow keys when focused');
  const basicExamples = createExamplesContainer();
  basicExamples.style.minHeight = '250px';
  basicExamples.style.position = 'relative';
  basicExamples.style.border = '1px dashed var(--dos-text-secondary)';

  const dragContent = document.createElement('div');
  dragContent.style.cssText = 'padding: 16px; font-family: var(--dos-font-family); background: var(--dos-bg-secondary); border: 2px solid var(--dos-text-primary); cursor: grab;';
  dragContent.innerHTML = '◈ Drag Me! ◈';

  const draggable = createDraggable({
    content: dragContent,
    bounds: 'parent',
    initialX: 20,
    initialY: 20,
  });

  basicExamples.appendChild(draggable.element);
  basicSection.appendChild(basicExamples);

  // Axis Constrained
  const axisSection = createDemoSection('Axis Constraints', 'Horizontal and vertical only');
  const axisExamples = createExamplesContainer();
  axisExamples.style.minHeight = '200px';
  axisExamples.style.position = 'relative';
  axisExamples.style.border = '1px dashed var(--dos-text-secondary)';

  const hContent = document.createElement('div');
  hContent.style.cssText = 'padding: 12px; font-family: var(--dos-font-family); background: var(--dos-color-info); border: 1px solid; display: inline-block;';
  hContent.textContent = '↔ Horizontal';

  const hDraggable = createDraggable({
    content: hContent,
    axis: 'x',
    bounds: 'parent',
    initialX: 10,
    initialY: 20,
  });

  const vContent = document.createElement('div');
  vContent.style.cssText = 'padding: 12px; font-family: var(--dos-font-family); background: var(--dos-color-success); border: 1px solid; display: inline-block;';
  vContent.textContent = '↕ Vertical';

  const vDraggable = createDraggable({
    content: vContent,
    axis: 'y',
    bounds: 'parent',
    initialX: 200,
    initialY: 20,
  });

  axisExamples.appendChild(hDraggable.element);
  axisExamples.appendChild(vDraggable.element);
  axisSection.appendChild(axisExamples);

  // Grid Snapping
  const gridSection = createDemoSection('Grid Snapping', 'Snaps to 20px grid');
  const gridExamples = createExamplesContainer();
  gridExamples.style.minHeight = '200px';
  gridExamples.style.position = 'relative';
  gridExamples.style.border = '1px dashed var(--dos-text-secondary)';
  gridExamples.style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 19px, var(--dos-text-secondary) 19px, var(--dos-text-secondary) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, var(--dos-text-secondary) 19px, var(--dos-text-secondary) 20px)';
  gridExamples.style.backgroundSize = '20px 20px';

  const gridContent = document.createElement('div');
  gridContent.style.cssText = 'padding: 16px; font-family: var(--dos-font-family); background: var(--dos-color-warning); border: 1px solid; display: inline-block;';
  gridContent.textContent = '⊞ Grid Snap';

  const gridDraggable = createDraggable({
    content: gridContent,
    bounds: 'parent',
    grid: [20, 20],
    initialX: 0,
    initialY: 0,
  });

  gridExamples.appendChild(gridDraggable.element);
  gridSection.appendChild(gridExamples);

  gridSection.appendChild(createCodeSnippet(`import { createDraggable } from 'dosage';

const draggable = createDraggable({
  content: myElement,
  axis: 'both',       // 'x' | 'y' | 'both'
  bounds: 'parent',   // 'parent' | 'window' | { left, right, top, bottom }
  grid: [20, 20],     // snap to grid
  onDrag: ({ position, delta }) => {
    console.log(\`Position: \${position.x}, \${position.y}\`);
  },
});

// Keyboard: Arrow keys move, Shift+Arrow for larger steps
// Programmatic control:
draggable.setPosition(100, 50);
draggable.reset();`));

  content.appendChild(basicSection);
  content.appendChild(axisSection);
  content.appendChild(gridSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}

// =============================================================================
// VisuallyHidden Page
// =============================================================================

export function renderVisuallyHiddenPage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'VisuallyHidden';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Hide content visually while keeping it accessible to screen readers.';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection('Screen Reader Text', 'Content hidden visually but announced by screen readers');
  const basicExamples = createExamplesContainer();

  const iconBtn = createButton({
    label: '✕',
    variant: 'secondary',
  });
  
  const srText = createVisuallyHidden({
    content: 'Close dialog',
  });
  iconBtn.appendChild(srText.element);

  const explanation = document.createElement('p');
  explanation.style.cssText = 'font-family: var(--dos-font-family); margin: 12px 0;';
  explanation.innerHTML = 'The button shows "✕" but screen readers announce "✕ Close dialog"';

  basicExamples.appendChild(iconBtn);
  basicExamples.appendChild(explanation);
  basicSection.appendChild(basicExamples);

  // Skip Link Example
  const skipSection = createDemoSection('Skip Link', 'Visible on focus for keyboard users');
  const skipExamples = createExamplesContainer();

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = 'display: inline-block; padding: 8px 12px; background: var(--dos-bg-primary); border: 2px solid var(--dos-text-primary);';

  const skipHidden = createVisuallyHidden({
    content: skipLink,
    focusable: true,
  });

  const skipInstructions = document.createElement('p');
  skipInstructions.style.cssText = 'font-family: var(--dos-font-family); margin: 12px 0;';
  skipInstructions.textContent = 'Tab to this area to reveal the skip link (normally at top of page)';

  skipExamples.appendChild(skipHidden.element);
  skipExamples.appendChild(skipInstructions);
  skipSection.appendChild(skipExamples);

  // ARIA Label Example
  const ariaSection = createDemoSection('Accessible Labels', 'Hidden labels for form inputs');
  const ariaExamples = createExamplesContainer();

  const searchInput = createTextInput({
    placeholder: 'Search...',
    name: 'search',
    id: 'demo-search',
  });

  const searchLabel = createVisuallyHidden({
    as: 'label',
    htmlFor: 'demo-search',
    content: 'Search the documentation',
  });

  ariaExamples.appendChild(searchLabel.element);
  ariaExamples.appendChild(searchInput);
  ariaSection.appendChild(ariaExamples);

  ariaSection.appendChild(createCodeSnippet(`import { createVisuallyHidden } from 'dosage';

// Screen reader only text
const hidden = createVisuallyHidden({
  content: 'Additional context for screen readers',
});
button.appendChild(hidden.element);

// Skip link (visible on focus)
const skipLink = createVisuallyHidden({
  content: skipLinkElement,
  focusable: true,
});

// Hidden form label
const label = createVisuallyHidden({
  as: 'label',
  htmlFor: 'search-input',
  content: 'Search the site',
});`));

  content.appendChild(basicSection);
  content.appendChild(skipSection);
  content.appendChild(ariaSection);
  page.appendChild(header);
  page.appendChild(content);

  return page;
}
