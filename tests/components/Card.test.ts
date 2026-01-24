/**
 * @file Card component tests
 * @description Comprehensive tests for the DOS-style Card component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCard } from '../../src/components/Card';

describe('Card', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders a card element', () => {
      const card = createCard();
      expect(card.element).toBeInstanceOf(HTMLElement);
      expect(card.element.classList.contains('dos-card')).toBe(true);
    });

    it('renders with default bordered style', () => {
      const card = createCard();
      expect(card.element.classList.contains('dos-card--bordered')).toBe(true);
    });

    it('renders without bordered when specified', () => {
      const card = createCard({ bordered: false });
      expect(card.element.classList.contains('dos-card--bordered')).toBe(false);
    });

    it('renders with custom id', () => {
      const card = createCard({ id: 'test-card' });
      expect(card.element.id).toBe('test-card');
    });

    it('renders with custom className', () => {
      const card = createCard({ className: 'custom-card' });
      expect(card.element.classList.contains('custom-card')).toBe(true);
    });

    it('renders with elevated style', () => {
      const card = createCard({ elevated: true });
      expect(card.element.classList.contains('dos-card--elevated')).toBe(true);
    });

    it('renders without elevation by default', () => {
      const card = createCard();
      expect(card.element.classList.contains('dos-card--elevated')).toBe(false);
    });
  });

  describe('header section', () => {
    it('renders with string header', () => {
      const card = createCard({ header: 'Card Title' });
      const header = card.element.querySelector('.dos-card__header');
      expect(header).not.toBeNull();
      expect(header?.textContent).toBe('Card Title');
    });

    it('renders with element header', () => {
      const headerEl = document.createElement('span');
      headerEl.textContent = 'Custom Header';
      headerEl.className = 'custom-header';
      
      const card = createCard({ header: headerEl });
      const header = card.element.querySelector('.dos-card__header');
      expect(header).not.toBeNull();
      expect(header?.querySelector('.custom-header')).not.toBeNull();
    });

    it('does not render header when not provided', () => {
      const card = createCard({ content: 'Just content' });
      const header = card.element.querySelector('.dos-card__header');
      expect(header).toBeNull();
    });

    it('sets header id for accessibility', () => {
      const card = createCard({ id: 'my-card', header: 'Title' });
      const header = card.element.querySelector('.dos-card__header');
      expect(header?.id).toBe('my-card-header');
    });
  });

  describe('content section', () => {
    it('renders with string content', () => {
      const card = createCard({ content: 'Card body content' });
      const content = card.element.querySelector('.dos-card__content');
      expect(content).not.toBeNull();
      expect(content?.textContent).toBe('Card body content');
    });

    it('renders with element content', () => {
      const contentEl = document.createElement('div');
      contentEl.className = 'custom-content';
      contentEl.innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      
      const card = createCard({ content: contentEl });
      const content = card.element.querySelector('.dos-card__content');
      expect(content).not.toBeNull();
      expect(content?.querySelector('.custom-content')).not.toBeNull();
    });

    it('does not render content when not provided', () => {
      const card = createCard({ header: 'Just header' });
      const content = card.element.querySelector('.dos-card__content');
      expect(content).toBeNull();
    });
  });

  describe('footer section', () => {
    it('renders with footer element', () => {
      const footerEl = document.createElement('div');
      footerEl.className = 'footer-actions';
      footerEl.innerHTML = '<button>Save</button><button>Cancel</button>';
      
      const card = createCard({ footer: footerEl });
      const footer = card.element.querySelector('.dos-card__footer');
      expect(footer).not.toBeNull();
      expect(footer?.querySelector('.footer-actions')).not.toBeNull();
    });

    it('does not render footer when not provided', () => {
      const card = createCard({ content: 'Just content' });
      const footer = card.element.querySelector('.dos-card__footer');
      expect(footer).toBeNull();
    });

    it('renders all sections in correct order', () => {
      const footerEl = document.createElement('button');
      footerEl.textContent = 'Action';
      
      const card = createCard({
        header: 'Header',
        content: 'Content',
        footer: footerEl
      });
      
      const children = Array.from(card.element.children);
      expect(children.length).toBe(3);
      expect(children[0].classList.contains('dos-card__header')).toBe(true);
      expect(children[1].classList.contains('dos-card__content')).toBe(true);
      expect(children[2].classList.contains('dos-card__footer')).toBe(true);
    });
  });

  describe('interactive mode', () => {
    it('applies interactive class when interactive', () => {
      const card = createCard({ interactive: true });
      expect(card.element.classList.contains('dos-card--interactive')).toBe(true);
    });

    it('sets button role when interactive', () => {
      const card = createCard({ interactive: true });
      expect(card.element.getAttribute('role')).toBe('button');
    });

    it('sets article role when not interactive', () => {
      const card = createCard({ interactive: false });
      expect(card.element.getAttribute('role')).toBe('article');
    });

    it('makes card focusable when interactive', () => {
      const card = createCard({ interactive: true });
      expect(card.element.getAttribute('tabindex')).toBe('0');
    });

    it('does not make card focusable when not interactive', () => {
      const card = createCard({ interactive: false });
      expect(card.element.getAttribute('tabindex')).toBeNull();
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: true, onClick });
      container.appendChild(card.element);
      
      card.element.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not interactive', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: false, onClick });
      container.appendChild(card.element);
      
      card.element.click();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('selected state', () => {
    it('applies selected class when selected', () => {
      const card = createCard({ interactive: true, selected: true });
      expect(card.element.classList.contains('dos-card--selected')).toBe(true);
    });

    it('does not apply selected class when not selected', () => {
      const card = createCard({ interactive: true, selected: false });
      expect(card.element.classList.contains('dos-card--selected')).toBe(false);
    });

    it('sets aria-pressed when interactive and selected', () => {
      const card = createCard({ interactive: true, selected: true });
      expect(card.element.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('keyboard navigation', () => {
    it('activates on Enter key when interactive', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: true, onClick });
      container.appendChild(card.element);
      
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      card.element.dispatchEvent(event);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Space key when interactive', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: true, onClick });
      container.appendChild(card.element);
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      card.element.dispatchEvent(event);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate on other keys', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: true, onClick });
      container.appendChild(card.element);
      
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      card.element.dispatchEvent(event);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not activate on Enter when not interactive', () => {
      const onClick = vi.fn();
      const card = createCard({ interactive: false, onClick });
      container.appendChild(card.element);
      
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      card.element.dispatchEvent(event);
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('sets aria-label when provided', () => {
      const card = createCard({ 'aria-label': 'Product card' });
      expect(card.element.getAttribute('aria-label')).toBe('Product card');
    });

    it('sets aria-labelledby when provided', () => {
      const card = createCard({ 'aria-labelledby': 'external-label' });
      expect(card.element.getAttribute('aria-labelledby')).toBe('external-label');
    });

    it('uses header for aria-labelledby when no explicit label', () => {
      const card = createCard({ id: 'card-1', header: 'Card Title' });
      expect(card.element.getAttribute('aria-labelledby')).toBe('card-1-header');
    });

    it('does not set aria-labelledby when header is absent and no label', () => {
      const card = createCard({ content: 'Just content' });
      expect(card.element.getAttribute('aria-labelledby')).toBeNull();
    });

    it('prefers explicit aria-label over header', () => {
      const card = createCard({
        header: 'Header Title',
        'aria-label': 'Custom label'
      });
      expect(card.element.getAttribute('aria-label')).toBe('Custom label');
      expect(card.element.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('instance methods', () => {
    describe('setHeader / getHeader', () => {
      it('updates header with string', () => {
        const card = createCard({ header: 'Initial' });
        card.setHeader('Updated Title');
        
        const header = card.element.querySelector('.dos-card__header');
        expect(header?.textContent).toBe('Updated Title');
      });

      it('updates header with element', () => {
        const card = createCard({ header: 'Initial' });
        
        const newHeader = document.createElement('strong');
        newHeader.textContent = 'Bold Title';
        card.setHeader(newHeader);
        
        const header = card.element.querySelector('.dos-card__header');
        expect(header?.querySelector('strong')).not.toBeNull();
      });

      it('removes header when set to undefined', () => {
        const card = createCard({ header: 'Initial' });
        card.setHeader(undefined);
        
        const header = card.element.querySelector('.dos-card__header');
        expect(header).toBeNull();
      });

      it('adds header to card without header', () => {
        const card = createCard({ content: 'Just content' });
        card.setHeader('New Header');
        
        const header = card.element.querySelector('.dos-card__header');
        expect(header?.textContent).toBe('New Header');
      });

      it('getHeader returns header element', () => {
        const card = createCard({ header: 'Title' });
        const header = card.getHeader();
        expect(header?.classList.contains('dos-card__header')).toBe(true);
      });

      it('getHeader returns null when no header', () => {
        const card = createCard({ content: 'Content only' });
        expect(card.getHeader()).toBeNull();
      });
    });

    describe('setContent / getContent', () => {
      it('updates content with string', () => {
        const card = createCard({ content: 'Initial' });
        card.setContent('Updated Content');
        
        const content = card.element.querySelector('.dos-card__content');
        expect(content?.textContent).toBe('Updated Content');
      });

      it('updates content with element', () => {
        const card = createCard({ content: 'Initial' });
        
        const newContent = document.createElement('p');
        newContent.textContent = 'Paragraph content';
        card.setContent(newContent);
        
        const content = card.element.querySelector('.dos-card__content');
        expect(content?.querySelector('p')).not.toBeNull();
      });

      it('removes content when set to undefined', () => {
        const card = createCard({ content: 'Initial' });
        card.setContent(undefined);
        
        const content = card.element.querySelector('.dos-card__content');
        expect(content).toBeNull();
      });

      it('getContent returns content element', () => {
        const card = createCard({ content: 'Body' });
        const content = card.getContent();
        expect(content?.classList.contains('dos-card__content')).toBe(true);
      });

      it('getContent returns null when no content', () => {
        const card = createCard({ header: 'Header only' });
        expect(card.getContent()).toBeNull();
      });
    });

    describe('setFooter / getFooter', () => {
      it('updates footer with element', () => {
        const initialFooter = document.createElement('button');
        initialFooter.textContent = 'Initial';
        
        const card = createCard({ footer: initialFooter });
        
        const newFooter = document.createElement('button');
        newFooter.textContent = 'Updated';
        card.setFooter(newFooter);
        
        const footer = card.element.querySelector('.dos-card__footer');
        expect(footer?.textContent).toBe('Updated');
      });

      it('removes footer when set to undefined', () => {
        const initialFooter = document.createElement('button');
        initialFooter.textContent = 'Initial';
        
        const card = createCard({ footer: initialFooter });
        card.setFooter(undefined);
        
        const footer = card.element.querySelector('.dos-card__footer');
        expect(footer).toBeNull();
      });

      it('adds footer to card without footer', () => {
        const card = createCard({ content: 'Content' });
        
        const newFooter = document.createElement('button');
        newFooter.textContent = 'Action';
        card.setFooter(newFooter);
        
        const footer = card.element.querySelector('.dos-card__footer');
        expect(footer).not.toBeNull();
      });

      it('getFooter returns footer element', () => {
        const footerEl = document.createElement('button');
        footerEl.textContent = 'Action';
        
        const card = createCard({ footer: footerEl });
        const footer = card.getFooter();
        expect(footer?.classList.contains('dos-card__footer')).toBe(true);
      });

      it('getFooter returns null when no footer', () => {
        const card = createCard({ content: 'Content only' });
        expect(card.getFooter()).toBeNull();
      });
    });

    describe('setBordered / isBordered', () => {
      it('enables border', () => {
        const card = createCard({ bordered: false });
        card.setBordered(true);
        
        expect(card.element.classList.contains('dos-card--bordered')).toBe(true);
        expect(card.isBordered()).toBe(true);
      });

      it('disables border', () => {
        const card = createCard({ bordered: true });
        card.setBordered(false);
        
        expect(card.element.classList.contains('dos-card--bordered')).toBe(false);
        expect(card.isBordered()).toBe(false);
      });
    });

    describe('setElevated / isElevated', () => {
      it('enables elevation', () => {
        const card = createCard({ elevated: false });
        card.setElevated(true);
        
        expect(card.element.classList.contains('dos-card--elevated')).toBe(true);
        expect(card.isElevated()).toBe(true);
      });

      it('disables elevation', () => {
        const card = createCard({ elevated: true });
        card.setElevated(false);
        
        expect(card.element.classList.contains('dos-card--elevated')).toBe(false);
        expect(card.isElevated()).toBe(false);
      });
    });

    describe('setSelected / isSelected', () => {
      it('sets selected state', () => {
        const card = createCard({ interactive: true, selected: false });
        card.setSelected(true);
        
        expect(card.element.classList.contains('dos-card--selected')).toBe(true);
        expect(card.isSelected()).toBe(true);
        expect(card.element.getAttribute('aria-pressed')).toBe('true');
      });

      it('clears selected state', () => {
        const card = createCard({ interactive: true, selected: true });
        card.setSelected(false);
        
        expect(card.element.classList.contains('dos-card--selected')).toBe(false);
        expect(card.isSelected()).toBe(false);
        expect(card.element.getAttribute('aria-pressed')).toBe('false');
      });
    });

    describe('focus', () => {
      it('focuses interactive card', () => {
        const card = createCard({ interactive: true });
        container.appendChild(card.element);
        
        card.focus();
        expect(document.activeElement).toBe(card.element);
      });

      it('does not throw for non-interactive card', () => {
        const card = createCard({ interactive: false });
        container.appendChild(card.element);
        
        expect(() => card.focus()).not.toThrow();
      });
    });

    describe('destroy', () => {
      it('removes event listeners', () => {
        const onClick = vi.fn();
        const card = createCard({ interactive: true, onClick });
        container.appendChild(card.element);
        
        card.destroy();
        card.element.click();
        
        expect(onClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('complete card scenarios', () => {
    it('renders a product card', () => {
      const footerEl = document.createElement('div');
      footerEl.innerHTML = '<button>Add to Cart</button><button>Details</button>';
      
      const card = createCard({
        header: 'Premium Widget',
        content: 'A high-quality widget for all your needs. Only $19.99!',
        footer: footerEl,
        bordered: true,
        elevated: true
      });
      
      container.appendChild(card.element);
      
      expect(card.element.querySelector('.dos-card__header')?.textContent).toBe('Premium Widget');
      expect(card.element.querySelector('.dos-card__content')?.textContent).toContain('$19.99');
      expect(card.element.querySelector('.dos-card__footer button')).not.toBeNull();
      expect(card.element.classList.contains('dos-card--elevated')).toBe(true);
    });

    it('renders a selectable card list item', () => {
      const card = createCard({
        content: 'Selectable item',
        interactive: true,
        selected: false,
        bordered: true,
        onClick: () => card.setSelected(!card.isSelected())
      });
      
      container.appendChild(card.element);
      
      card.element.click();
      expect(card.isSelected()).toBe(true);
      
      card.element.click();
      expect(card.isSelected()).toBe(false);
    });

    it('renders a minimal card', () => {
      const card = createCard({
        content: 'Simple note content',
        bordered: false,
        elevated: false
      });
      
      expect(card.element.querySelector('.dos-card__header')).toBeNull();
      expect(card.element.querySelector('.dos-card__content')).not.toBeNull();
      expect(card.element.querySelector('.dos-card__footer')).toBeNull();
      expect(card.element.classList.contains('dos-card--bordered')).toBe(false);
    });
  });
});
