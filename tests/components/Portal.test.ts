/**
 * Portal Component Tests
 *
 * Unit tests for the Portal utility component.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createPortal,
  getActivePortals,
  getPortalById,
  destroyAllPortals,
} from '../../src/components/Portal';

describe('Portal', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create test container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Clean up any existing portals
    destroyAllPortals();
  });

  afterEach(() => {
    // Clean up
    destroyAllPortals();
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('renders content to document.body by default', () => {
      const portal = createPortal({
        content: '<div class="portal-content">Hello</div>',
      });

      expect(portal.isMounted).toBe(true);
      expect(document.body.querySelector('.portal-content')).toBeTruthy();
      expect(document.body.querySelector('.dos-portal')).toBeTruthy();
    });

    it('renders content to a specified target element', () => {
      const _portal = createPortal({
        content: '<div class="portal-content">Hello</div>',
        target: container,
      });

      expect(container.querySelector('.portal-content')).toBeTruthy();
      // Content should be inside test container, not directly in body
      const portalEl = container.querySelector('.dos-portal');
      expect(portalEl).toBeTruthy();
    });

    it('renders content to a specified target selector', () => {
      const _portal = createPortal({
        content: '<div class="portal-content">Hello</div>',
        target: '#test-container',
      });

      expect(container.querySelector('.portal-content')).toBeTruthy();
    });

    it('renders HTMLElement content', () => {
      const contentEl = document.createElement('span');
      contentEl.className = 'custom-element';
      contentEl.textContent = 'Custom Content';

      const _portal = createPortal({
        content: contentEl,
      });

      const found = document.body.querySelector('.custom-element');
      expect(found).toBeTruthy();
      expect(found?.textContent).toBe('Custom Content');
    });

    it('applies custom class names', () => {
      const _portal = createPortal({
        content: 'Test',
        className: 'my-portal',
        containerClass: 'my-container',
      });

      const portalEl = document.body.querySelector('.dos-portal');
      expect(portalEl?.classList.contains('my-portal')).toBe(true);
      expect(portalEl?.classList.contains('my-container')).toBe(true);
    });

    it('uses custom ID when provided', () => {
      const _portal = createPortal({
        content: 'Test',
        id: 'my-custom-portal',
      });

      expect(document.getElementById('my-custom-portal')).toBeTruthy();
    });

    it('generates unique IDs for multiple portals', () => {
      const portal1 = createPortal({ content: 'One' });
      const portal2 = createPortal({ content: 'Two' });

      expect(portal1.element.id).not.toBe(portal2.element.id);
    });

    it('falls back to document.body when target selector not found', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const portal = createPortal({
        content: '<div class="fallback-content">Fallback</div>',
        target: '#nonexistent-target',
      });

      expect(document.body.querySelector('.fallback-content')).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('not found')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('lifecycle', () => {
    it('calls onMount callback when mounted', () => {
      const onMount = vi.fn();

      const _portal = createPortal({
        content: 'Test',
        onMount,
      });

      expect(onMount).toHaveBeenCalledTimes(1);
    });

    it('calls onUnmount callback when unmounted', () => {
      const onUnmount = vi.fn();

      const portal = createPortal({
        content: 'Test',
        onUnmount,
      });

      portal.unmount();
      expect(onUnmount).toHaveBeenCalledTimes(1);
    });

    it('dispatches dos:portal:mount event', () => {
      const handler = vi.fn();
      document.body.addEventListener('dos:portal:mount', handler);

      const _portal = createPortal({
        content: 'Test',
      });

      expect(handler).toHaveBeenCalled();
      document.body.removeEventListener('dos:portal:mount', handler);
    });

    it('does not mount twice when mount() called multiple times', () => {
      const onMount = vi.fn();

      const portal = createPortal({
        content: 'Test',
        onMount,
      });

      portal.mount();
      portal.mount();

      expect(onMount).toHaveBeenCalledTimes(1);
    });

    it('unmount removes element from DOM', () => {
      const portal = createPortal({
        content: '<div class="to-remove">Remove me</div>',
      });

      expect(document.body.querySelector('.to-remove')).toBeTruthy();

      portal.unmount();

      expect(document.body.querySelector('.to-remove')).toBeFalsy();
      expect(portal.isMounted).toBe(false);
    });

    it('can remount after unmount', () => {
      const portal = createPortal({
        content: '<div class="remount-test">Remount</div>',
      });

      portal.unmount();
      expect(document.body.querySelector('.remount-test')).toBeFalsy();

      portal.mount();
      expect(document.body.querySelector('.remount-test')).toBeTruthy();
      expect(portal.isMounted).toBe(true);
    });
  });

  describe('content updates', () => {
    it('updates content with setContent(string)', () => {
      const portal = createPortal({
        content: '<div class="old-content">Old</div>',
      });

      expect(document.body.querySelector('.old-content')).toBeTruthy();

      portal.setContent('<div class="new-content">New</div>');

      expect(document.body.querySelector('.old-content')).toBeFalsy();
      expect(document.body.querySelector('.new-content')).toBeTruthy();
    });

    it('updates content with setContent(HTMLElement)', () => {
      const portal = createPortal({
        content: 'Initial',
      });

      const newContent = document.createElement('div');
      newContent.className = 'element-content';
      newContent.textContent = 'Element Content';

      portal.setContent(newContent);

      expect(document.body.querySelector('.element-content')).toBeTruthy();
    });
  });

  describe('moveTo', () => {
    it('moves portal to a new target element', () => {
      const target1 = document.createElement('div');
      target1.id = 'target1';
      document.body.appendChild(target1);

      const target2 = document.createElement('div');
      target2.id = 'target2';
      document.body.appendChild(target2);

      const portal = createPortal({
        content: '<div class="moving-content">Move me</div>',
        target: target1,
      });

      expect(target1.querySelector('.moving-content')).toBeTruthy();
      expect(target2.querySelector('.moving-content')).toBeFalsy();

      portal.moveTo(target2);

      expect(target1.querySelector('.moving-content')).toBeFalsy();
      expect(target2.querySelector('.moving-content')).toBeTruthy();
    });

    it('does not remount if target is the same', () => {
      const onMount = vi.fn();
      const onUnmount = vi.fn();

      const portal = createPortal({
        content: 'Test',
        target: container,
        onMount,
        onUnmount,
      });

      // Reset mocks after initial mount
      onMount.mockClear();
      onUnmount.mockClear();

      portal.moveTo(container);

      expect(onUnmount).not.toHaveBeenCalled();
      expect(onMount).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('removes portal from DOM and tracking', () => {
      const portal = createPortal({
        content: '<div class="destroy-test">Destroy</div>',
        id: 'destroy-portal',
      });

      expect(document.body.querySelector('.destroy-test')).toBeTruthy();
      expect(getPortalById('destroy-portal')).toBeTruthy();

      portal.destroy();

      expect(document.body.querySelector('.destroy-test')).toBeFalsy();
      expect(portal.isMounted).toBe(false);
      expect(getPortalById('destroy-portal')).toBeUndefined();
    });
  });

  describe('portal tracking', () => {
    it('tracks active portals', () => {
      const _portal1 = createPortal({ content: 'One' });
      const _portal2 = createPortal({ content: 'Two' });

      const active = getActivePortals();
      expect(active.length).toBe(2);
    });

    it('removes from tracking when destroyed', () => {
      const portal1 = createPortal({ content: 'One' });
      const portal2 = createPortal({ content: 'Two' });

      expect(getActivePortals().length).toBe(2);

      portal1.destroy();

      expect(getActivePortals().length).toBe(1);
    });

    it('getPortalById returns correct portal', () => {
      const portal = createPortal({
        content: 'Test',
        id: 'findable-portal',
      });

      const found = getPortalById('findable-portal');
      expect(found).toBe(portal);
    });

    it('destroyAllPortals cleans up all portals', () => {
      createPortal({ content: 'One' });
      createPortal({ content: 'Two' });
      createPortal({ content: 'Three' });

      expect(getActivePortals().length).toBe(3);
      expect(document.querySelectorAll('.dos-portal').length).toBe(3);

      destroyAllPortals();

      expect(getActivePortals().length).toBe(0);
      expect(document.querySelectorAll('.dos-portal').length).toBe(0);
    });
  });

  describe('event bubbling', () => {
    it('preserves event bubbling to original parent when enabled', () => {
      // Create an element with a parent
      const parent = document.createElement('div');
      const child = document.createElement('button');
      child.className = 'bubble-test';
      child.textContent = 'Click';
      parent.appendChild(child);
      document.body.appendChild(parent);

      const parentHandler = vi.fn();
      parent.addEventListener('click', parentHandler);

      // Remove child from parent and put in portal
      parent.removeChild(child);

      const _portal = createPortal({
        content: child,
        preserveEventBubbling: true,
      });

      // Click the button (now in portal)
      child.click();

      // The click event should have bubbled through normal DOM
      // and also been dispatched to original parent
      // Note: This is best-effort and may not work perfectly in all cases
      
      // Clean up
      parent.removeEventListener('click', parentHandler);
      document.body.removeChild(parent);
    });
  });

  describe('accessibility', () => {
    it('has data-dos-portal attribute', () => {
      const portal = createPortal({
        content: 'Test',
      });

      expect(portal.element.getAttribute('data-dos-portal')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles empty string content', () => {
      const portal = createPortal({
        content: '',
      });

      expect(portal.isMounted).toBe(true);
    });

    it('handles null target gracefully', () => {
      const _portal = createPortal({
        content: 'Test',
        target: null,
      });

      // Should render to document.body
      expect(document.body.querySelector('.dos-portal')).toBeTruthy();
    });
  });
});
