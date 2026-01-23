import { describe, it, expect } from 'vitest';
import { 
  dosBlueTheme, 
  amberTheme, 
  greenPhosphorTheme, 
  blackAndWhiteTheme,
  presetThemes,
  VERSION 
} from '../src/index';

describe('DOSage Library', () => {
  it('should export version', () => {
    expect(VERSION).toBe('0.1.0');
  });

  it('should export preset themes', () => {
    expect(presetThemes).toBeDefined();
    expect(presetThemes['dos-blue']).toBe(dosBlueTheme);
    expect(presetThemes['amber']).toBe(amberTheme);
    expect(presetThemes['green-phosphor']).toBe(greenPhosphorTheme);
    expect(presetThemes['black-and-white']).toBe(blackAndWhiteTheme);
  });

  describe('Themes', () => {
    it('should have DOS Blue theme with correct colors', () => {
      expect(dosBlueTheme.name).toBe('DOS Blue');
      expect(dosBlueTheme.colors.background).toBe('#0000AA');
      expect(dosBlueTheme.colors.foreground).toBe('#FFFFFF');
    });

    it('should have Amber theme with correct colors', () => {
      expect(amberTheme.name).toBe('Amber Monochrome');
      expect(amberTheme.colors.background).toBe('#000000');
      expect(amberTheme.colors.foreground).toBe('#FFAA00');
    });

    it('should have Green Phosphor theme with correct colors', () => {
      expect(greenPhosphorTheme.name).toBe('Green Phosphor');
      expect(greenPhosphorTheme.colors.background).toBe('#001100');
      expect(greenPhosphorTheme.colors.foreground).toBe('#00FF00');
    });

    it('should have Black & White theme with correct colors', () => {
      expect(blackAndWhiteTheme.name).toBe('Black & White');
      expect(blackAndWhiteTheme.colors.background).toBe('#000000');
      expect(blackAndWhiteTheme.colors.foreground).toBe('#FFFFFF');
    });

    it('should have all required color properties', () => {
      const theme = dosBlueTheme;
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.foreground).toBeDefined();
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.secondary).toBeDefined();
      expect(theme.colors.accent).toBeDefined();
      expect(theme.colors.border).toBeDefined();
      expect(theme.colors.selection).toBeDefined();
      expect(theme.colors.focus).toBeDefined();
      expect(theme.colors.disabled).toBeDefined();
      expect(theme.colors.error).toBeDefined();
      expect(theme.colors.warning).toBeDefined();
      expect(theme.colors.success).toBeDefined();
    });
  });
});
