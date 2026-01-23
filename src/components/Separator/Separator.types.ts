/**
 * Separator Component Types
 *
 * Type definitions for the Separator layout component.
 */

import type { BaseComponentProps, SpacingValue } from '../../types/common';

/**
 * Props for the Separator component
 */
export interface SeparatorProps extends BaseComponentProps {
  /**
   * Vertical space around the separator.
   * @default 'md'
   */
  spacing?: SpacingValue;

  /**
   * Show a visible line or just spacing.
   * @default false
   */
  visible?: boolean;
}
