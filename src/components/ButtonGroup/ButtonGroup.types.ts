/**
 * ButtonGroup Component Types
 *
 * Type definitions for the ButtonGroup component.
 */

import type { BaseComponentProps } from '../../types/common';
import type { ButtonSize, ButtonVariant } from '../Button/Button.types';

/**
 * Props for the ButtonGroup component
 */
export interface ButtonGroupProps extends BaseComponentProps {
  /**
   * Layout direction for buttons.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether buttons share borders (connected) or have gaps (separated).
   * @default false
   */
  connected?: boolean;

  /**
   * Apply consistent size to all buttons in the group.
   */
  size?: ButtonSize;

  /**
   * Apply consistent variant to all buttons in the group.
   */
  variant?: ButtonVariant;

  /**
   * Accessible label for the button group.
   */
  ariaLabel?: string;
}
