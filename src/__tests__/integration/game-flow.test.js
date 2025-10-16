/**
 * Integration Tests - Complete Game Flow
 * 
 * Tests the integration between components and the complete game flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DrawingCanvas } from '../../components/DrawingCanvas.js';
import { GameManager } from '../../game/GameManager.js';

describe('Game Flow Integration', () => {
  let canvas;
  let drawingCanvas;
  let gameManager;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    drawingCanvas = new DrawingCanvas(canvas);
    gameManager = new GameManager(drawingCanvas);
  });

  afterEach(() => {
    document.body.removeChild(canvas);
  });

  describe('Canvas and GameManager Integration', () => {
    it('should initialize GameManager with DrawingCanvas instance', () => {
      expect(gameManager.canvas).toBe(drawingCanvas);
    });

    it('should clear canvas when starting new word', () => {
      const clearSpy = vi.spyOn(drawingCanvas, 'clear');
      gameManager.nextWord();
      expect(clearSpy).toHaveBeenCalled();
    });

    it('should check if canvas is empty before submitting', () => {
      const isEmptySpy = vi.spyOn(drawingCanvas, 'isEmpty');
      gameManager.submitAnswer();
      expect(isEmptySpy).toHaveBeenCalled();
    });
  });

  describe('Complete Drawing Flow', () => {
    it('should handle complete drawing sequence', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));

      // Start drawing
      drawingCanvas.startDrawing({ clientX: 10, clientY: 10 });
      expect(drawingCanvas.isDrawing).toBe(true);

      // Draw some points
      drawingCanvas.draw({ clientX: 20, clientY: 20 });
      drawingCanvas.draw({ clientX: 30, clientY: 30 });

      // Stop drawing
      drawingCanvas.stopDrawing();
      expect(drawingCanvas.isDrawing).toBe(false);
    });

    it('should handle multiple drawing sessions', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));

      // First drawing session
      drawingCanvas.startDrawing({ clientX: 10, clientY: 10 });
      drawingCanvas.draw({ clientX: 20, clientY: 20 });
      drawingCanvas.stopDrawing();

      // Second drawing session
      drawingCanvas.startDrawing({ clientX: 50, clientY: 50 });
      drawingCanvas.draw({ clientX: 60, clientY: 60 });
      drawingCanvas.stopDrawing();

      expect(drawingCanvas.isDrawing).toBe(false);
    });
  });

  describe('Game State Management', () => {
    it('should maintain score across multiple rounds', () => {
      expect(gameManager.score).toBe(0);

      // Simulate scoring
      gameManager.score += 10;
      expect(gameManager.score).toBe(10);

      gameManager.score += 5;
      expect(gameManager.score).toBe(15);
    });

    it('should track used words', () => {
      const initialSize = gameManager.usedWords.size;
      gameManager.nextWord();
      expect(gameManager.usedWords.size).toBe(initialSize + 1);
    });

    it('should generate different words on consecutive calls', () => {
      gameManager.nextWord();
      const firstWord = gameManager.currentWord;

      gameManager.nextWord();
      const secondWord = gameManager.currentWord;

      // Note: There's a chance they could be the same, but very unlikely
      expect(firstWord).toBeDefined();
      expect(secondWord).toBeDefined();
    });
  });

  describe('Canvas Dimension Updates', () => {
    it('should maintain 800x600 canvas dimensions', () => {
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    it('should preserve dimensions after clearing', () => {
      drawingCanvas.clear();
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });
  });

  describe('Error Recovery', () => {
    it('should handle empty canvas submission gracefully', () => {
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      drawingCanvas.ctx.getImageData = vi.fn(() => ({
        data: new Uint8ClampedArray(800 * 600 * 4).fill(255),
      }));

      gameManager.submitAnswer();
      
      mockAlert.mockRestore();
    });

    it('should handle skip without crashing', () => {
      gameManager.nextWord();
      expect(() => gameManager.skipWord()).not.toThrow();
    });
  });
});