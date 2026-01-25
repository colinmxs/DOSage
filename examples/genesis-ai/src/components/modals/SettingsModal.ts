/**
 * Genesis AI - Settings Modal Component
 */

import {
  createModal,
  createTabs,
  createBox,
  createTextInput,
  createToggle,
  createRadioButton,
  createButton,
  createButtonGroup,
  addButtonsToGroup,
} from 'dosage';
import type { Settings } from '../../types';
import { THEME_OPTIONS } from '../../config';

export interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export interface SettingsModalInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export function createSettingsModal(props: SettingsModalProps): SettingsModalInstance {
  const { settings: initialSettings, onSave, onClose } = props;

  // Clone settings for editing
  let editedSettings = { ...initialSettings };

  // Create General tab content
  function createGeneralTab(): HTMLElement {
    const container = createBox({ padding: 'md' });
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

    const nameInput = createTextInput({
      label: 'Display Name',
      value: editedSettings.displayName,
      placeholder: 'Enter your name...',
      onChange: (value) => {
        editedSettings.displayName = value;
      },
    });

    container.appendChild(nameInput);

    return container;
  }

  // Create Appearance tab content
  function createAppearanceTab(): HTMLElement {
    const container = createBox({ padding: 'md' });
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

    // Theme selection
    const themeLabel = document.createElement('div');
    themeLabel.textContent = 'Theme:';
    themeLabel.style.marginBottom = '0.5rem';
    container.appendChild(themeLabel);

    const themeGroup = createBox({});
    themeGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem;';

    for (const option of THEME_OPTIONS) {
      const radio = createRadioButton({
        label: option.label,
        name: 'theme',
        value: option.value,
        checked: editedSettings.theme === option.value,
        onChange: () => {
          editedSettings.theme = option.value;
        },
      });
      themeGroup.appendChild(radio);
    }

    container.appendChild(themeGroup);

    return container;
  }

  // Create Chat tab content
  function createChatTab(): HTMLElement {
    const container = createBox({ padding: 'md' });
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

    const autoScrollToggle = createToggle({
      label: 'Auto-scroll to new messages',
      checked: editedSettings.autoScroll,
      onChange: (checked) => {
        editedSettings.autoScroll = checked;
      },
    });

    const timestampsToggle = createToggle({
      label: 'Show timestamps',
      checked: editedSettings.showTimestamps,
      onChange: (checked) => {
        editedSettings.showTimestamps = checked;
      },
    });

    const soundToggle = createToggle({
      label: 'Sound effects',
      checked: editedSettings.soundEnabled,
      onChange: (checked) => {
        editedSettings.soundEnabled = checked;
      },
    });

    container.appendChild(autoScrollToggle);
    container.appendChild(timestampsToggle);
    container.appendChild(soundToggle);

    return container;
  }

  // Create tabs component
  const tabs = createTabs({
    tabs: [
      { id: 'general', label: 'General', content: createGeneralTab() },
      { id: 'appearance', label: 'Appearance', content: createAppearanceTab() },
      { id: 'chat', label: 'Chat', content: createChatTab() },
    ],
    orientation: 'horizontal',
  });

  // Create footer buttons
  const footer = createBox({});
  footer.style.cssText = 'display: flex; justify-content: flex-end; gap: 0.5rem;';

  const buttonGroup = createButtonGroup({
    orientation: 'horizontal',
  });

  const cancelButton = createButton({
    label: 'Cancel',
    variant: 'secondary',
    onClick: () => {
      modal.close();
      onClose();
    },
  });

  const saveButton = createButton({
    label: 'Save Settings',
    variant: 'primary',
    onClick: () => {
      onSave(editedSettings);
      modal.close();
    },
  });

  addButtonsToGroup(buttonGroup, [cancelButton, saveButton]);
  footer.appendChild(buttonGroup);

  // Create modal
  const modal = createModal({
    title: 'Settings',
    content: tabs,
    footer,
    size: 'large',
    closeOnOverlay: true,
    closeOnEscape: true,
    onClose,
  });

  return {
    open: () => modal.open(),
    close: () => modal.close(),
    destroy: () => modal.destroy(),
  };
}
