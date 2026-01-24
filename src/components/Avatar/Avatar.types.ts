/**
 * Avatar Component Types
 *
 * DOS-style user avatar with ASCII border and initials.
 */

/**
 * Avatar size options
 */
export type AvatarSize = 'small' | 'medium' | 'large';

/**
 * Avatar shape options (DOS aesthetic means no rounded corners)
 */
export type AvatarShape = 'square';

/**
 * Avatar status indicator options
 */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * Avatar component props
 */
export interface AvatarProps {
  /**
   * User name (used to generate initials if not provided)
   */
  name: string;

  /**
   * Image URL (optional - if provided, displays image instead of initials)
   * Note: In DOS aesthetic, images are typically not used
   */
  image?: string;

  /**
   * Custom initials override
   * If not provided, extracted from name
   */
  initials?: string;

  /**
   * Avatar size
   * @default 'medium'
   */
  size?: AvatarSize;

  /**
   * Status indicator
   */
  status?: AvatarStatus;

  /**
   * Avatar shape
   * @default 'square'
   */
  shape?: AvatarShape;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom HTML id attribute
   */
  id?: string;

  /**
   * ARIA label override (defaults to name)
   */
  'aria-label'?: string;
}

/**
 * Avatar instance methods and properties
 */
export interface AvatarInstance {
  /**
   * The avatar DOM element
   */
  element: HTMLDivElement;

  /**
   * Update the name (recalculates initials)
   */
  setName: (name: string) => void;

  /**
   * Get the current name
   */
  getName: () => string;

  /**
   * Set custom initials
   */
  setInitials: (initials: string) => void;

  /**
   * Get the displayed initials
   */
  getInitials: () => string;

  /**
   * Update the status
   */
  setStatus: (status: AvatarStatus | undefined) => void;

  /**
   * Get the current status
   */
  getStatus: () => AvatarStatus | undefined;

  /**
   * Set the image URL
   */
  setImage: (image: string | undefined) => void;

  /**
   * Remove the avatar from the DOM
   */
  destroy: () => void;
}
