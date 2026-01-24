/**
 * Avatar Component Tests
 */

import { describe, it, expect } from 'vitest';
import { createAvatar } from '../../src/components/Avatar';
import type { AvatarStatus } from '../../src/components/Avatar';

describe('Avatar', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element).toBeDefined();
      expect(avatar.element.classList.contains('dos-avatar')).toBe(true);
    });

    it('renders with custom id', () => {
      const avatar = createAvatar({ name: 'John Doe', id: 'my-avatar' });
      expect(avatar.element.id).toBe('my-avatar');
    });

    it('renders with custom class name', () => {
      const avatar = createAvatar({ name: 'John Doe', className: 'custom-class' });
      expect(avatar.element.classList.contains('custom-class')).toBe(true);
    });

    it('has role img', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element.getAttribute('role')).toBe('img');
    });

    it('has aria-label with name', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element.getAttribute('aria-label')).toBe('John Doe');
    });

    it('uses custom aria-label', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        'aria-label': 'User Avatar',
      });
      expect(avatar.element.getAttribute('aria-label')).toBe('User Avatar');
    });

    it('renders box container', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      const box = avatar.element.querySelector('.dos-avatar___box');
      expect(box).toBeTruthy();
    });
  });

  describe('initials', () => {
    it('extracts initials from full name', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.getInitials()).toBe('JD');

      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl?.textContent).toBe('JD');
    });

    it('extracts initial from single name', () => {
      const avatar = createAvatar({ name: 'John' });
      expect(avatar.getInitials()).toBe('J');
    });

    it('extracts first and last initials from multi-word name', () => {
      const avatar = createAvatar({ name: 'John Michael Doe' });
      expect(avatar.getInitials()).toBe('JD');
    });

    it('handles empty name', () => {
      const avatar = createAvatar({ name: '' });
      expect(avatar.getInitials()).toBe('?');
    });

    it('handles whitespace name', () => {
      const avatar = createAvatar({ name: '   ' });
      expect(avatar.getInitials()).toBe('?');
    });

    it('uses custom initials when provided', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        initials: 'X',
      });
      expect(avatar.getInitials()).toBe('X');
    });

    it('uppercases initials', () => {
      const avatar = createAvatar({ name: 'john doe' });
      expect(avatar.getInitials()).toBe('JD');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const avatar = createAvatar({ name: 'John Doe', size: 'small' });
      expect(avatar.element.classList.contains('dos-avatar--small')).toBe(true);
    });

    it('renders medium size', () => {
      const avatar = createAvatar({ name: 'John Doe', size: 'medium' });
      expect(avatar.element.classList.contains('dos-avatar--medium')).toBe(true);
    });

    it('renders large size', () => {
      const avatar = createAvatar({ name: 'John Doe', size: 'large' });
      expect(avatar.element.classList.contains('dos-avatar--large')).toBe(true);
    });

    it('defaults to medium size', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element.classList.contains('dos-avatar--medium')).toBe(true);
    });
  });

  describe('status', () => {
    const statuses: AvatarStatus[] = ['online', 'offline', 'busy', 'away'];

    statuses.forEach((status) => {
      it(`renders ${status} status indicator`, () => {
        const avatar = createAvatar({ name: 'John Doe', status });
        const statusEl = avatar.element.querySelector('.dos-avatar___status');
        expect(statusEl).toBeTruthy();
        expect(statusEl?.classList.contains(`dos-avatar___status--${status}`)).toBe(true);
      });
    });

    it('does not render status when not provided', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl).toBeNull();
    });

    it('status has aria-hidden', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'online' });
      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl?.getAttribute('aria-hidden')).toBe('true');
    });

    it('includes status in aria-label', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'online' });
      expect(avatar.element.getAttribute('aria-label')).toBe('John Doe, Online');
    });
  });

  describe('image', () => {
    it('renders image when provided', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
      });
      const img = avatar.element.querySelector('.dos-avatar___image') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toBe('https://example.com/avatar.jpg');
    });

    it('image has empty alt', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
      });
      const img = avatar.element.querySelector('.dos-avatar___image') as HTMLImageElement;
      expect(img.alt).toBe('');
    });

    it('does not render initials when image provided', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
      });
      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl).toBeNull();
    });
  });

  describe('instance methods', () => {
    it('setName updates name and initials', () => {
      const avatar = createAvatar({ name: 'John Doe' });

      avatar.setName('Jane Smith');

      expect(avatar.getName()).toBe('Jane Smith');
      expect(avatar.getInitials()).toBe('JS');

      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl?.textContent).toBe('JS');
    });

    it('setName does not change custom initials', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        initials: 'X',
      });

      avatar.setName('Jane Smith');

      expect(avatar.getInitials()).toBe('X');
    });

    it('setName updates aria-label', () => {
      const avatar = createAvatar({ name: 'John Doe' });

      avatar.setName('Jane Smith');

      expect(avatar.element.getAttribute('aria-label')).toBe('Jane Smith');
    });

    it('setInitials updates displayed initials', () => {
      const avatar = createAvatar({ name: 'John Doe' });

      avatar.setInitials('ZZ');

      expect(avatar.getInitials()).toBe('ZZ');

      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl?.textContent).toBe('ZZ');
    });

    it('setStatus adds status indicator', () => {
      const avatar = createAvatar({ name: 'John Doe' });

      avatar.setStatus('online');

      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl).toBeTruthy();
      expect(avatar.getStatus()).toBe('online');
    });

    it('setStatus removes status indicator', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'online' });

      avatar.setStatus(undefined);

      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl).toBeNull();
      expect(avatar.getStatus()).toBeUndefined();
    });

    it('setStatus changes existing status', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'online' });

      avatar.setStatus('busy');

      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl?.classList.contains('dos-avatar___status--busy')).toBe(true);
      expect(avatar.getStatus()).toBe('busy');
    });

    it('setImage switches from initials to image', () => {
      const avatar = createAvatar({ name: 'John Doe' });

      avatar.setImage('https://example.com/avatar.jpg');

      const img = avatar.element.querySelector('.dos-avatar___image') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toBe('https://example.com/avatar.jpg');

      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl).toBeNull();
    });

    it('setImage switches from image to initials', () => {
      const avatar = createAvatar({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
      });

      avatar.setImage(undefined);

      const img = avatar.element.querySelector('.dos-avatar___image');
      expect(img).toBeNull();

      const initialsEl = avatar.element.querySelector('.dos-avatar___initials');
      expect(initialsEl?.textContent).toBe('JD');
    });

    it('destroy removes element from DOM', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      document.body.appendChild(avatar.element);

      avatar.destroy();

      expect(document.body.contains(avatar.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role img', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element.getAttribute('role')).toBe('img');
    });

    it('has descriptive aria-label', () => {
      const avatar = createAvatar({ name: 'John Doe' });
      expect(avatar.element.getAttribute('aria-label')).toBe('John Doe');
    });

    it('includes status in aria-label', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'busy' });
      expect(avatar.element.getAttribute('aria-label')).toBe('John Doe, Busy');
    });

    it('status indicator has aria-hidden', () => {
      const avatar = createAvatar({ name: 'John Doe', status: 'online' });
      const statusEl = avatar.element.querySelector('.dos-avatar___status');
      expect(statusEl?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
