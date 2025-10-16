/**
 * CSS Validation Tests
 * 
 * Validates CSS structure, new styles, and ensures proper styling rules
 * Tests the new start game section styles
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CSS Validation', () => {
  let css;

  beforeEach(() => {
    // Read the actual CSS file
    css = readFileSync(resolve(__dirname, '../../../src/styles/main.css'), 'utf-8');
  });

  describe('Start Game Section Styles - New Feature', () => {
    it('should have styles for start-game-section class', () => {
      expect(css).toMatch(/\.start-game-section\s*{/);
    });

    it('should have text-align center for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?text-align:\s*center/);
    });

    it('should have margin for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?margin:\s*30px\s+0/);
    });

    it('should have padding for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?padding:\s*30px/);
    });

    it('should have gradient background for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?background:\s*linear-gradient/);
    });

    it('should have border-radius for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?border-radius:\s*15px/);
    });

    it('should have dashed border for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section[\s\S]*?border:\s*2px\s+dashed/);
    });

    it('should have hidden state for start-game-section', () => {
      expect(css).toMatch(/\.start-game-section\.hidden\s*{/);
      expect(css).toMatch(/\.start-game-section\.hidden[\s\S]*?display:\s*none/);
    });
  });

  describe('Start Button Styles', () => {
    it('should have styles for btn-start class', () => {
      expect(css).toMatch(/\.btn-start\s*{/);
    });

    it('should have gradient background for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?background:\s*linear-gradient.*667eea.*764ba2/);
    });

    it('should have white text color for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?color:\s*white/);
    });

    it('should have appropriate font size for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?font-size:\s*1\.3em/);
    });

    it('should have padding for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?padding:\s*18px\s+48px/);
    });

    it('should have minimum width for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?min-width:\s*200px/);
    });

    it('should have box shadow for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?box-shadow/);
    });

    it('should have pulse animation for start button', () => {
      expect(css).toMatch(/\.btn-start[\s\S]*?animation:\s*pulse/);
    });

    it('should have hover styles for start button', () => {
      expect(css).toMatch(/\.btn-start:hover\s*{/);
    });

    it('should have enhanced box shadow on hover', () => {
      expect(css).toMatch(/\.btn-start:hover[\s\S]*?box-shadow:\s*0\s+8px\s+30px/);
    });

    it('should have transform on hover', () => {
      expect(css).toMatch(/\.btn-start:hover[\s\S]*?transform:\s*translateY\(-3px\)\s+scale\(1\.05\)/);
    });
  });

  describe('Start Hint Styles', () => {
    it('should have styles for start-hint class', () => {
      expect(css).toMatch(/\.start-hint\s*{/);
    });

    it('should have margin-top for start-hint', () => {
      expect(css).toMatch(/\.start-hint[\s\S]*?margin-top:\s*15px/);
    });

    it('should have color for start-hint', () => {
      expect(css).toMatch(/\.start-hint[\s\S]*?color:\s*#667eea/);
    });

    it('should have font size for start-hint', () => {
      expect(css).toMatch(/\.start-hint[\s\S]*?font-size:\s*1\.1em/);
    });

    it('should have font weight for start-hint', () => {
      expect(css).toMatch(/\.start-hint[\s\S]*?font-weight:\s*500/);
    });
  });

  describe('General Style Requirements', () => {
    it('should have global reset styles', () => {
      expect(css).toMatch(/\*\s*{[\s\S]*?margin:\s*0/);
      expect(css).toMatch(/\*\s*{[\s\S]*?padding:\s*0/);
      expect(css).toMatch(/\*\s*{[\s\S]*?box-sizing:\s*border-box/);
    });

    it('should have body gradient background', () => {
      expect(css).toMatch(/body[\s\S]*?background:\s*linear-gradient/);
    });

    it('should have canvas styles', () => {
      expect(css).toMatch(/#drawingCanvas/);
    });

    it('should have button base styles', () => {
      expect(css).toMatch(/\.btn\s*{/);
    });
  });

  describe('Animation Definitions', () => {
    it('should have pulse animation keyframes', () => {
      expect(css).toMatch(/@keyframes\s+pulse\s*{/);
    });

    it('should have pulse animation scale transforms', () => {
      expect(css).toMatch(/@keyframes\s+pulse[\s\S]*?transform:\s*scale/);
    });

    it('should have fadeIn animation', () => {
      expect(css).toMatch(/@keyframes\s+fadeIn\s*{/);
    });
  });

  describe('Responsive Design', () => {
    it('should have media query for mobile devices', () => {
      expect(css).toMatch(/@media\s*\(\s*max-width:\s*768px\s*\)/);
    });

    it('should adjust padding in mobile view', () => {
      expect(css).toMatch(/@media[\s\S]*?body[\s\S]*?padding:\s*10px/);
    });
  });

  describe('Color Consistency', () => {
    it('should use primary purple color (#667eea)', () => {
      expect(css).toMatch(/#667eea/);
    });

    it('should use secondary purple color (#764ba2)', () => {
      expect(css).toMatch(/#764ba2/);
    });

    it('should use white color (#ffffff or white)', () => {
      expect(css).toMatch(/white|#ffffff/i);
    });
  });

  describe('Layout Styles', () => {
    it('should have flexbox utilities', () => {
      expect(css).toMatch(/display:\s*flex/);
    });

    it('should have proper spacing with margin and padding', () => {
      expect(css).toMatch(/margin/);
      expect(css).toMatch(/padding/);
    });

    it('should have border-radius for rounded corners', () => {
      expect(css).toMatch(/border-radius/);
    });
  });

  describe('Interactive Elements', () => {
    it('should have cursor pointer for interactive elements', () => {
      expect(css).toMatch(/cursor:\s*pointer/);
    });

    it('should have hover states defined', () => {
      expect(css).toMatch(/:hover/);
    });

    it('should have transitions for smooth interactions', () => {
      expect(css).toMatch(/transition/);
    });
  });
});