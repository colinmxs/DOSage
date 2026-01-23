export type ASCIIFont = 'standard' | 'banner' | 'block' | 'mini';

export interface ASCIIArtProps {
  art?: string;
  text?: string;
  font?: ASCIIFont;
  color?: string;
  animate?: boolean;
  animationSpeed?: number;
  className?: string;
  id?: string;
}
