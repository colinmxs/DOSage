/**
 * Panel Component Types
 *
 * Type definitions for the Panel layout component.
 */

import type { BaseComponentProps, SpacingValue, BoxBorderStyle } from '../../types/common';

/**
 * Props for the Panel component
 */
export interface PanelProps extends BaseComponentProps {
  /**
   * Optional panel title displayed in the top border.
   */
  title?: string;

  /**
   * Box-drawing border style.
   * @default 'single'
   */
  borderStyle?: BoxBorderStyle;

  /**
   * Internal padding.
   * @default 'md'
   */
  padding?: SpacingValue;

  /**
   * Show DOS-style drop shadow.
   * @default false
   */
  shadow?: boolean;
}
