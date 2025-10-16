/**
 * HTML Structure Validation Tests
 * 
 * Validates the structure, semantics, and accessibility of index.html
 * Ensures all required elements are present and properly configured
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('HTML Structure Validation', () => {
  let html;

  beforeEach(() => {
    // Read the actual HTML file
    html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf-8');
  });

  describe('Document Structure', () => {
    it('should have DOCTYPE declaration', () => {
      expect(html.toLowerCase()).toMatch(/<!doctype html>/i);
    });

    it('should have html tag with lang attribute', () => {
      expect(html).toMatch(/<html\s+lang="zh-CN"/i);
    });

    it('should have proper head section', () => {
      expect(html).toMatch(/<head>/i);
      expect(html).toMatch(/<\/head>/i);
    });

    it('should have proper body section', () => {
      expect(html).toMatch(/<body>/i);
      expect(html).toMatch(/<\/body>/i);
    });
  });

  describe('Meta Tags', () => {
    it('should have charset meta tag', () => {
      expect(html).toMatch(/<meta\s+charset="UTF-8"/i);
    });

    it('should have viewport meta tag for responsive design', () => {
      expect(html).toMatch(/<meta\s+name="viewport"/i);
      expect(html).toMatch(/width=device-width/i);
      expect(html).toMatch(/initial-scale=1\.0/i);
    });

    it('should have description meta tag', () => {
      expect(html).toMatch(/<meta\s+name="description"/i);
    });

    it('should have descriptive title', () => {
      expect(html).toMatch(/<title>.*Draw & Guess Game.*<\/title>/i);
    });
  });

  describe('Start Game Section - New Feature', () => {
    it('should have start game section element', () => {
      expect(html).toMatch(/id="startGameSection"/);
    });

    it('should have start game section with correct class', () => {
      expect(html).toMatch(/class="start-game-section"/);
    });

    it('should have start button with correct ID', () => {
      expect(html).toMatch(/id="startBtn"/);
    });

    it('should have start button with appropriate classes', () => {
      expect(html).toMatch(/class="btn btn-start"/);
    });

    it('should have start hint paragraph', () => {
      expect(html).toMatch(/class="start-hint"/);
    });

    it('should have emoji in start button', () => {
      expect(html).toMatch(/🎮/);
    });

    it('should have Chinese text for start button', () => {
      expect(html).toMatch(/开始游戏/);
    });

    it('should have descriptive hint text', () => {
      expect(html).toMatch(/点击按钮开始你的绘画之旅/);
    });
  });

  describe('Canvas Element', () => {
    it('should have canvas element with correct ID', () => {
      expect(html).toMatch(/<canvas\s+id="drawingCanvas"/i);
    });

    it('should have canvas wrapper div', () => {
      expect(html).toMatch(/class="canvas-wrapper"/);
    });
  });

  describe('Game Controls', () => {
    it('should have all required button elements', () => {
      const requiredButtons = [
        'startBtn',
        'clearBtn',
        'submitBtn',
        'skipBtn',
        'nextBtn',
      ];

      requiredButtons.forEach(btnId => {
        expect(html).toMatch(new RegExp(`id="${btnId}"`));
      });
    });

    it('should have brush size input', () => {
      expect(html).toMatch(/id="brushSize"/);
      expect(html).toMatch(/type="range"/);
    });

    it('should have brush size value display', () => {
      expect(html).toMatch(/id="brushSizeValue"/);
    });

    it('should have color picker buttons', () => {
      expect(html).toMatch(/class="color-btn"/);
      expect(html).toMatch(/data-color/);
    });
  });

  describe('Game Information Display', () => {
    it('should have word display element', () => {
      expect(html).toMatch(/id="wordDisplay"/);
    });

    it('should have score display element', () => {
      expect(html).toMatch(/id="scoreDisplay"/);
    });

    it('should have result area element', () => {
      expect(html).toMatch(/id="resultArea"/);
    });
  });

  describe('Semantic HTML', () => {
    it('should use header tag for game header', () => {
      expect(html).toMatch(/<header/i);
    });

    it('should use main tag for main content', () => {
      expect(html).toMatch(/<main/i);
    });

    it('should use footer tag for game footer', () => {
      expect(html).toMatch(/<footer/i);
    });

    it('should use details/summary for instructions', () => {
      expect(html).toMatch(/<details/i);
      expect(html).toMatch(/<summary/i);
    });
  });

  describe('Script Loading', () => {
    it('should load main JavaScript module', () => {
      expect(html).toMatch(/<script\s+type="module"\s+src="\/src\/main\.js"/i);
    });

    it('should load main CSS file', () => {
      expect(html).toMatch(/<link\s+rel="stylesheet"\s+href="\/src\/styles\/main\.css"/i);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      expect(html).toMatch(/<h1>/i);
      expect(html).toMatch(/<h3>/i);
    });

    it('should have labels for form inputs', () => {
      expect(html).toMatch(/<label\s+for="brushSize"/i);
    });

    it('should have descriptive button text', () => {
      expect(html).toMatch(/清空画板/);
      expect(html).toMatch(/提交答案/);
      expect(html).toMatch(/跳过/);
      expect(html).toMatch(/下一题/);
    });
  });

  describe('Content Validation', () => {
    it('should have game title', () => {
      expect(html).toMatch(/你画我猜/);
    });

    it('should have game subtitle/description', () => {
      expect(html).toMatch(/根据提示词画出图案/);
    });

    it('should have game instructions', () => {
      expect(html).toMatch(/游戏说明/);
    });
  });
});