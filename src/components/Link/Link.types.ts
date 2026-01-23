/**
 * Link Component Types
 *
 * Type definitions for the DOS-style Link component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Underline style options for links
 */
export type LinkUnderline = 'always' | 'hover' | 'none';

/**
 * Props for the Link component
 */
export interface LinkProps extends BaseComponentProps {
  /**
   * Link destination URL.
   */
  href: string;

  /**
   * Link text content.
   */
  label: string;

  /**
   * Target attribute for link behavior.
   * @default '_self'
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Whether this is an external link.
   * When true, opens in new tab and shows external indicator.
   * @default false
   */
  external?: boolean;

  /**
   * Underline style.
   * @default 'always'
   */
  underline?: LinkUnderline;

  /**
   * Whether the link is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional click handler.
   * Called before navigation occurs.
   */
  onClick?: (event: MouseEvent) => void;
}
