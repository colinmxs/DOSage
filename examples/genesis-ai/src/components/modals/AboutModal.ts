/**
 * Genesis AI - About Modal Component
 */

import {
  createModal,
  createBox,
  createText,
  createBadge,
  createButton,
} from 'dosage';
import { APP_VERSION, ASCII_LOGO } from '../../config';

export interface AboutModalProps {
  onClose: () => void;
}

export interface AboutModalInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export function createAboutModal(props: AboutModalProps): AboutModalInstance {
  const { onClose } = props;

  // Create content
  const content = createBox({});
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  `;

  // ASCII Logo
  const logoContainer = createBox({});
  logoContainer.style.cssText = `
    white-space: pre;
    font-family: monospace;
    font-size: 0.6rem;
    line-height: 1.1;
  `;
  logoContainer.textContent = ASCII_LOGO;

  // Version badge
  const versionBadge = createBadge({
    label: `v${APP_VERSION}`,
    variant: 'info',
  });

  // Description
  const description = createText({
    children: 'A retro-styled AI chatbot interface built with DOSage',
    align: 'center',
  });

  // Built with
  const builtWith = createText({
    children: 'Built with DOSage Component Library',
    size: 'sm',
    align: 'center',
  });

  // Timeline / Version history
  const historyTitle = createText({
    children: '─── Version History ───',
    weight: 'bold',
    align: 'center',
  });

  const historyContainer = createBox({});
  historyContainer.style.cssText = 'text-align: left; padding: 0.5rem;';

  const versions = [
    { version: 'v1.0.0', note: 'Initial release', current: true },
    { version: 'v0.9.0', note: 'Beta release', current: false },
    { version: 'v0.1.0', note: 'First prototype', current: false },
  ];

  for (const v of versions) {
    const versionLine = createText({
      children: `${v.current ? '●' : '○'} ${v.version} - ${v.note}`,
      size: 'sm',
    });
    historyContainer.appendChild(versionLine);
  }

  // Assemble content
  content.appendChild(logoContainer);
  content.appendChild(versionBadge.element);
  content.appendChild(description);
  content.appendChild(builtWith);
  content.appendChild(historyTitle);
  content.appendChild(historyContainer);

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
    title: 'About Genesis AI',
    content,
    footer,
    size: 'medium',
    closeOnOverlay: true,
    closeOnEscape: true,
    onClose,
  });

  return {
    open: () => modal.open(),
    close: () => modal.close(),
    destroy: () => {
      versionBadge.destroy();
      modal.destroy();
    },
  };
}
