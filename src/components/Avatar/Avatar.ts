/**
 * Avatar Component
 *
 * DOS-style user avatar displaying initials in an ASCII box.
 *
 * Visual representation:
 * ┌───┐
 * │JD │
 * └───┘
 */

import type { AvatarProps, AvatarInstance, AvatarStatus } from './Avatar.types';
import './Avatar.css';

/**
 * Extracts initials from a name
 * - "John Doe" -> "JD"
 * - "John" -> "J"
 * - "John Michael Doe" -> "JD" (first and last)
 */
function extractInitials(name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) return '?';

  const words = trimmedName.split(/\s+/);
  if (words.length === 1) {
    const firstWord = words[0];
    return firstWord ? firstWord.charAt(0).toUpperCase() : '?';
  }

  // Take first and last word initials
  const firstWord = words[0];
  const lastWord = words[words.length - 1];
  const first = firstWord ? firstWord.charAt(0).toUpperCase() : '';
  const last = lastWord ? lastWord.charAt(0).toUpperCase() : '';
  return first + last;
}

/**
 * Creates a DOS-style avatar component
 *
 * @param props - Avatar configuration options
 * @returns Avatar instance with element and control methods
 *
 * @example
 * ```typescript
 * const avatar = createAvatar({
 *   name: 'John Doe',
 *   size: 'medium',
 *   status: 'online',
 * });
 * document.body.appendChild(avatar.element);
 * ```
 */
export function createAvatar(props: AvatarProps): AvatarInstance {
  const {
    name: initialName,
    image: initialImage,
    initials: customInitials,
    size = 'medium',
    status: initialStatus,
    shape = 'square',
    className,
    id,
    'aria-label': ariaLabel,
  } = props;

  // State
  let name = initialName;
  let initials = customInitials ?? extractInitials(initialName);
  let status = initialStatus;
  let image = initialImage;

  // Create main avatar element
  const avatar = document.createElement('div');
  avatar.className = buildClassName();

  if (id) {
    avatar.id = id;
  }

  // Set ARIA attributes
  avatar.setAttribute('role', 'img');
  avatar.setAttribute('aria-label', ariaLabel || name);

  // Create box container
  const box = document.createElement('div');
  box.className = 'dos-avatar___box';

  // Create content (initials or image)
  let contentEl: HTMLSpanElement | HTMLImageElement;

  if (image) {
    contentEl = document.createElement('img');
    (contentEl as HTMLImageElement).src = image;
    (contentEl as HTMLImageElement).alt = '';
    contentEl.className = 'dos-avatar___image';
  } else {
    contentEl = document.createElement('span');
    contentEl.className = 'dos-avatar___initials';
    contentEl.textContent = initials;
  }

  box.appendChild(contentEl);
  avatar.appendChild(box);

  // Create status indicator if provided
  let statusEl: HTMLSpanElement | null = null;
  if (status) {
    statusEl = createStatusIndicator(status);
    avatar.appendChild(statusEl);
  }

  /**
   * Build the CSS class name string
   */
  function buildClassName(): string {
    const classes = ['dos-avatar'];
    classes.push(`dos-avatar--${size}`);
    classes.push(`dos-avatar--${shape}`);
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Create a status indicator element
   */
  function createStatusIndicator(statusValue: AvatarStatus): HTMLSpanElement {
    const el = document.createElement('span');
    el.className = `dos-avatar___status dos-avatar___status--${statusValue}`;
    el.setAttribute('aria-hidden', 'true');

    // Set aria description on avatar
    const statusLabels: Record<AvatarStatus, string> = {
      online: 'Online',
      offline: 'Offline',
      busy: 'Busy',
      away: 'Away',
    };
    avatar.setAttribute('aria-label', `${ariaLabel || name}, ${statusLabels[statusValue]}`);

    return el;
  }

  /**
   * Update the displayed initials
   */
  function updateInitials(): void {
    if (!image && contentEl instanceof HTMLSpanElement) {
      contentEl.textContent = initials;
    }
  }

  /**
   * Update the ARIA label
   */
  function updateAriaLabel(): void {
    if (status) {
      const statusLabels: Record<AvatarStatus, string> = {
        online: 'Online',
        offline: 'Offline',
        busy: 'Busy',
        away: 'Away',
      };
      avatar.setAttribute('aria-label', `${ariaLabel || name}, ${statusLabels[status]}`);
    } else {
      avatar.setAttribute('aria-label', ariaLabel || name);
    }
  }

  // Return the avatar instance
  return {
    element: avatar,

    setName(newName: string): void {
      name = newName;
      if (!customInitials) {
        initials = extractInitials(newName);
        updateInitials();
      }
      updateAriaLabel();
    },

    getName(): string {
      return name;
    },

    setInitials(newInitials: string): void {
      initials = newInitials;
      updateInitials();
    },

    getInitials(): string {
      return initials;
    },

    setStatus(newStatus: AvatarStatus | undefined): void {
      // Remove existing status indicator
      if (statusEl) {
        statusEl.remove();
        statusEl = null;
      }

      status = newStatus;

      // Create new status indicator if provided
      if (status) {
        statusEl = createStatusIndicator(status);
        avatar.appendChild(statusEl);
      }

      updateAriaLabel();
    },

    getStatus(): AvatarStatus | undefined {
      return status;
    },

    setImage(newImage: string | undefined): void {
      image = newImage;

      // Replace content element
      const oldContent = contentEl;

      if (image) {
        contentEl = document.createElement('img');
        (contentEl as HTMLImageElement).src = image;
        (contentEl as HTMLImageElement).alt = '';
        contentEl.className = 'dos-avatar___image';
      } else {
        contentEl = document.createElement('span');
        contentEl.className = 'dos-avatar___initials';
        contentEl.textContent = initials;
      }

      box.replaceChild(contentEl, oldContent);
    },

    destroy(): void {
      avatar.remove();
    },
  };
}
