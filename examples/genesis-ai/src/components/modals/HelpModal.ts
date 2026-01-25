/**
 * Genesis AI - Help Modal Component
 */

import {
  createModal,
  createBox,
  createText,
  createAccordion,
  createButton,
} from 'dosage';
import { SHORTCUTS } from '../../config';

export interface HelpModalProps {
  onClose: () => void;
}

export interface HelpModalInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export function createHelpModal(props: HelpModalProps): HelpModalInstance {
  const { onClose } = props;

  // Create content
  const content = createBox({});
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  // Keyboard Shortcuts section
  const shortcutsTitle = createText({
    children: '⌨ Keyboard Shortcuts',
    weight: 'bold',
  });

  const shortcutsBox = createBox({ padding: 'sm' });
  shortcutsBox.style.cssText = `
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid currentColor;
  `;

  const shortcutEntries = [
    { action: 'New Chat', shortcut: SHORTCUTS.newChat },
    { action: 'Send Message', shortcut: SHORTCUTS.send },
    { action: 'Command Palette', shortcut: SHORTCUTS.commandPalette },
    { action: 'Settings', shortcut: SHORTCUTS.settings },
    { action: 'Toggle Sidebar', shortcut: SHORTCUTS.toggleSidebar },
    { action: 'Help', shortcut: SHORTCUTS.help },
    { action: 'Export Chat', shortcut: SHORTCUTS.export },
    { action: 'Clear Chat', shortcut: SHORTCUTS.clearChat },
  ];

  for (const entry of shortcutEntries) {
    const actionText = createText({ children: entry.action, size: 'sm' });
    const shortcutText = createText({ children: entry.shortcut, size: 'sm' });
    shortcutText.style.textAlign = 'right';
    shortcutsBox.appendChild(actionText);
    shortcutsBox.appendChild(shortcutText);
  }

  content.appendChild(shortcutsTitle);
  content.appendChild(shortcutsBox);

  // FAQ Accordion
  const faqTitle = createText({
    children: '❓ Frequently Asked Questions',
    weight: 'bold',
  });
  faqTitle.style.marginTop = '1rem';

  const faqContent1 = createBox({});
  faqContent1.appendChild(
    createText({
      children:
        'Genesis AI is a demo application showcasing the DOSage component library. It simulates an AI chatbot interface with authentic DOS aesthetics.',
    })
  );

  const faqContent2 = createBox({});
  faqContent2.appendChild(
    createText({
      children:
        'All conversations are stored locally in your browser using localStorage. No data is sent to any server. You can export or clear your data anytime.',
    })
  );

  const faqContent3 = createBox({});
  faqContent3.appendChild(
    createText({
      children:
        "Go to Settings (Ctrl+,) and select the Appearance tab. You can choose from DOS Blue, Amber, Green Phosphor, or CGA themes.",
    })
  );

  const accordion = createAccordion({
    items: [
      {
        id: 'what-is',
        title: 'What is Genesis AI?',
        content: faqContent1,
      },
      {
        id: 'data-privacy',
        title: 'Where is my data stored?',
        content: faqContent2,
      },
      {
        id: 'change-theme',
        title: 'How do I change the theme?',
        content: faqContent3,
      },
    ],
    mode: 'multiple',
  });

  content.appendChild(faqTitle);
  content.appendChild(accordion);

  // Footer with close button
  const footer = createBox({});
  footer.style.cssText = 'display: flex; justify-content: center;';

  const closeButton = createButton({
    label: 'Close',
    variant: 'primary',
    onClick: () => {
      modal.close();
    },
  });

  footer.appendChild(closeButton);

  // Create modal
  const modal = createModal({
    title: 'Help',
    content,
    footer,
    size: 'large',
    closeOnOverlay: true,
    closeOnEscape: true,
    onClose,
  });

  return {
    open: () => modal.open(),
    close: () => modal.close(),
    destroy: () => {
      accordion.destroy?.();
      modal.destroy();
    },
  };
}
