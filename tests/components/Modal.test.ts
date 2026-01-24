/**
 * Modal Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createModal, showAlert, showConfirm, showPrompt } from '../../src/components/Modal';

describe('Modal', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up any open modals
    document.querySelectorAll('.dos-modal__overlay').forEach((el) => el.remove());
    document.body.classList.remove('dos-modal-open');
    container.remove();
  });

  describe('rendering', () => {
    it('creates a modal element', () => {
      const modal = createModal({ title: 'Test Modal' });
      expect(modal.element).toBeInstanceOf(HTMLElement);
      expect(modal.element.classList.contains('dos-modal__overlay')).toBe(true);
    });

    it('renders with title', () => {
      const modal = createModal({ title: 'Test Title' });
      container.appendChild(modal.element);

      const title = modal.element.querySelector('.dos-modal__title');
      expect(title?.textContent).toBe('Test Title');
    });

    it('renders with string content', () => {
      const modal = createModal({ content: 'Test content' });
      container.appendChild(modal.element);

      const body = modal.element.querySelector('.dos-modal__body');
      expect(body?.textContent).toBe('Test content');
    });

    it('renders with element content', () => {
      const contentEl = document.createElement('p');
      contentEl.textContent = 'Custom content';

      const modal = createModal({ content: contentEl });
      container.appendChild(modal.element);

      const body = modal.element.querySelector('.dos-modal__body');
      expect(body?.contains(contentEl)).toBe(true);
    });

    it('renders with footer', () => {
      const footer = document.createElement('div');
      footer.textContent = 'Footer content';

      const modal = createModal({ footer });
      container.appendChild(modal.element);

      const footerEl = modal.element.querySelector('.dos-modal__footer');
      expect(footerEl?.contains(footer)).toBe(true);
    });

    it('renders close button when closable is true', () => {
      const modal = createModal({ closable: true });
      container.appendChild(modal.element);

      const closeBtn = modal.element.querySelector('.dos-modal__close');
      expect(closeBtn).not.toBeNull();
    });

    it('does not render close button when closable is false', () => {
      const modal = createModal({ closable: false });
      container.appendChild(modal.element);

      const closeBtn = modal.element.querySelector('.dos-modal__close');
      expect(closeBtn).toBeNull();
    });

    it('applies size class', () => {
      const modal = createModal({ size: 'large' });
      expect(modal.element.classList.contains('dos-modal--large')).toBe(true);
    });

    it('applies default medium size', () => {
      const modal = createModal({});
      expect(modal.element.classList.contains('dos-modal--medium')).toBe(true);
    });

    it('applies custom className', () => {
      const modal = createModal({ className: 'custom-modal' });
      expect(modal.element.classList.contains('custom-modal')).toBe(true);
    });

    it('applies custom id', () => {
      const modal = createModal({ id: 'my-modal' });
      expect(modal.element.id).toBe('my-modal');
    });
  });

  describe('open/close behavior', () => {
    it('starts closed by default', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      expect(modal.isOpen()).toBe(false);
      expect(modal.element.classList.contains('dos-modal__overlay--open')).toBe(false);
    });

    it('opens when open() is called', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      modal.open();
      expect(modal.isOpen()).toBe(true);
      expect(modal.element.classList.contains('dos-modal__overlay--open')).toBe(true);
    });

    it('closes when close() is called', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      modal.open();
      modal.close();
      expect(modal.isOpen()).toBe(false);
      expect(modal.element.classList.contains('dos-modal__overlay--open')).toBe(false);
    });

    it('opens immediately when open prop is true', async () => {
      const modal = createModal({ open: true });
      container.appendChild(modal.element);

      // Wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(modal.isOpen()).toBe(true);
    });

    it('calls onOpen callback when opened', () => {
      const onOpen = vi.fn();
      const modal = createModal({ onOpen });
      container.appendChild(modal.element);

      modal.open();
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onClose callback when closed', () => {
      const onClose = vi.fn();
      const modal = createModal({ onClose });
      container.appendChild(modal.element);

      modal.open();
      modal.close();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('adds dos-modal-open class to body when opened', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      modal.open();
      expect(document.body.classList.contains('dos-modal-open')).toBe(true);
    });

    it('removes dos-modal-open class from body when closed', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      modal.open();
      modal.close();
      expect(document.body.classList.contains('dos-modal-open')).toBe(false);
    });
  });

  describe('close triggers', () => {
    it('closes when close button is clicked', () => {
      const modal = createModal({ closable: true });
      container.appendChild(modal.element);
      modal.open();

      const closeBtn = modal.element.querySelector('.dos-modal__close') as HTMLElement;
      closeBtn?.click();

      expect(modal.isOpen()).toBe(false);
    });

    it('closes when Escape is pressed', () => {
      const modal = createModal({ closeOnEscape: true });
      container.appendChild(modal.element);
      modal.open();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(modal.isOpen()).toBe(false);
    });

    it('does not close on Escape when closeOnEscape is false', () => {
      const modal = createModal({ closeOnEscape: false });
      container.appendChild(modal.element);
      modal.open();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(modal.isOpen()).toBe(true);
    });

    it('closes when overlay is clicked', () => {
      const modal = createModal({ closeOnOverlay: true });
      container.appendChild(modal.element);
      modal.open();

      // Click the overlay (not the dialog)
      modal.element.click();

      expect(modal.isOpen()).toBe(false);
    });

    it('does not close when overlay click and closeOnOverlay is false', () => {
      const modal = createModal({ closeOnOverlay: false });
      container.appendChild(modal.element);
      modal.open();

      modal.element.click();

      expect(modal.isOpen()).toBe(true);
    });

    it('does not close when dialog is clicked', () => {
      const modal = createModal({ closeOnOverlay: true });
      container.appendChild(modal.element);
      modal.open();

      const dialog = modal.element.querySelector('.dos-modal__dialog') as HTMLElement;
      dialog.click();

      expect(modal.isOpen()).toBe(true);
    });
  });

  describe('instance methods', () => {
    it('setTitle updates the title', () => {
      const modal = createModal({ title: 'Original' });
      container.appendChild(modal.element);

      modal.setTitle('Updated');

      const title = modal.element.querySelector('.dos-modal__title');
      expect(title?.textContent).toBe('Updated');
    });

    it('setContent updates content with string', () => {
      const modal = createModal({ content: 'Original' });
      container.appendChild(modal.element);

      modal.setContent('Updated');

      const body = modal.element.querySelector('.dos-modal__body');
      expect(body?.textContent).toBe('Updated');
    });

    it('setContent updates content with element', () => {
      const modal = createModal({ content: 'Original' });
      container.appendChild(modal.element);

      const newContent = document.createElement('span');
      newContent.textContent = 'New element';
      modal.setContent(newContent);

      const body = modal.element.querySelector('.dos-modal__body');
      expect(body?.contains(newContent)).toBe(true);
    });

    it('setFooter updates the footer', () => {
      const modal = createModal({});
      container.appendChild(modal.element);

      const newFooter = document.createElement('div');
      newFooter.id = 'new-footer';
      modal.setFooter(newFooter);

      const footer = modal.element.querySelector('.dos-modal__footer');
      expect(footer?.querySelector('#new-footer')).not.toBeNull();
    });

    it('update method updates multiple props', () => {
      const modal = createModal({ title: 'Original', size: 'small' });
      container.appendChild(modal.element);

      modal.update({ title: 'Updated', size: 'large' });

      const title = modal.element.querySelector('.dos-modal__title');
      expect(title?.textContent).toBe('Updated');
      expect(modal.element.classList.contains('dos-modal--large')).toBe(true);
    });

    it('destroy removes the modal and cleans up', () => {
      const modal = createModal({});
      container.appendChild(modal.element);
      modal.open();

      modal.destroy();

      expect(document.body.contains(modal.element)).toBe(false);
      expect(document.body.classList.contains('dos-modal-open')).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role="dialog" on the dialog element', () => {
      const modal = createModal({});
      const dialog = modal.element.querySelector('.dos-modal__dialog');
      expect(dialog?.getAttribute('role')).toBe('dialog');
    });

    it('has aria-modal="true"', () => {
      const modal = createModal({});
      const dialog = modal.element.querySelector('.dos-modal__dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('has aria-labelledby pointing to title', () => {
      const modal = createModal({ title: 'Test', id: 'test-modal' });
      const dialog = modal.element.querySelector('.dos-modal__dialog');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('test-modal-title');
    });

    it('has aria-describedby pointing to content', () => {
      const modal = createModal({ id: 'test-modal' });
      const dialog = modal.element.querySelector('.dos-modal__dialog');
      expect(dialog?.getAttribute('aria-describedby')).toBe('test-modal-content');
    });

    it('close button has aria-label', () => {
      const modal = createModal({ closable: true });
      const closeBtn = modal.element.querySelector('.dos-modal__close');
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close dialog');
    });
  });

  describe('focus management', () => {
    it('focuses first focusable element when opened', async () => {
      const footer = document.createElement('div');
      const button = document.createElement('button');
      button.textContent = 'Focus me';
      footer.appendChild(button);

      const modal = createModal({ footer });
      container.appendChild(modal.element);
      modal.open();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // The close button should be focused first (it comes before footer in DOM order)
      // or the first button in footer if no close button
      const closeBtn = modal.element.querySelector('.dos-modal__close');
      expect(document.activeElement).toBe(closeBtn || button);
    });
  });
});

describe('showAlert', () => {
  afterEach(() => {
    document.querySelectorAll('.dos-modal__overlay').forEach((el) => el.remove());
    document.body.classList.remove('dos-modal-open');
  });

  it('opens an alert modal with message', async () => {
    const alertPromise = showAlert('Test message');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const modal = document.querySelector('.dos-modal__overlay--open');
    expect(modal).not.toBeNull();

    const body = modal?.querySelector('.dos-modal__body');
    expect(body?.textContent).toBe('Test message');

    // Close the modal
    const okBtn = modal?.querySelector('.dos-button') as HTMLElement;
    okBtn?.click();

    await alertPromise;
  });

  it('uses custom title', async () => {
    const alertPromise = showAlert('Message', 'Custom Title');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const title = document.querySelector('.dos-modal__title');
    expect(title?.textContent).toBe('Custom Title');

    // Close
    const okBtn = document.querySelector('.dos-button') as HTMLElement;
    okBtn?.click();

    await alertPromise;
  });
});

describe('showConfirm', () => {
  afterEach(() => {
    document.querySelectorAll('.dos-modal__overlay').forEach((el) => el.remove());
    document.body.classList.remove('dos-modal-open');
  });

  it('resolves true when OK is clicked', async () => {
    const confirmPromise = showConfirm('Confirm this?');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const buttons = document.querySelectorAll('.dos-button');
    const okBtn = buttons[0] as HTMLElement; // First button is OK
    okBtn?.click();

    const result = await confirmPromise;
    expect(result).toBe(true);
  });

  it('resolves false when Cancel is clicked', async () => {
    const confirmPromise = showConfirm('Confirm this?');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const buttons = document.querySelectorAll('.dos-button');
    const cancelBtn = buttons[1] as HTMLElement; // Second button is Cancel
    cancelBtn?.click();

    const result = await confirmPromise;
    expect(result).toBe(false);
  });
});

describe('showPrompt', () => {
  afterEach(() => {
    document.querySelectorAll('.dos-modal__overlay').forEach((el) => el.remove());
    document.body.classList.remove('dos-modal-open');
  });

  it('resolves with input value when OK is clicked', async () => {
    const promptPromise = showPrompt('Enter name:');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const input = document.querySelector('input') as HTMLInputElement;
    input.value = 'Test Name';

    const buttons = document.querySelectorAll('.dos-button');
    const okBtn = buttons[0] as HTMLElement;
    okBtn?.click();

    const result = await promptPromise;
    expect(result).toBe('Test Name');
  });

  it('resolves null when Cancel is clicked', async () => {
    const promptPromise = showPrompt('Enter name:');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const buttons = document.querySelectorAll('.dos-button');
    const cancelBtn = buttons[1] as HTMLElement;
    cancelBtn?.click();

    const result = await promptPromise;
    expect(result).toBeNull();
  });

  it('uses default value', async () => {
    const promptPromise = showPrompt('Enter name:', 'Prompt', 'Default');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Default');

    // Close
    const cancelBtn = document.querySelectorAll('.dos-button')[1] as HTMLElement;
    cancelBtn?.click();

    await promptPromise;
  });
});
