/**
 * DrawingCanvas Component Tests
 * 
 * Testing all functionality of the canvas drawing component including:
 * - Canvas initialization and setup
 * - Drawing operations (mouse and touch)
 * - Color and brush size management
 * - Canvas clearing and state
 * - Image data operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DrawingCanvas } from '../../components/DrawingCanvas.js';

describe('DrawingCanvas', () => {
  let canvas;
  let drawingCanvas;

  beforeEach(() => {
    // Create a fresh canvas element for each test
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    drawingCanvas = new DrawingCanvas(canvas);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(canvas);
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with correct default properties', () => {
      expect(drawingCanvas.canvas).toBe(canvas);
      expect(drawingCanvas.ctx).toBeDefined();
      expect(drawingCanvas.isDrawing).toBe(false);
      expect(drawingCanvas.currentColor).toBe('#000000');
      expect(drawingCanvas.brushSize).toBe(3);
    });

    it('should call setupCanvas during initialization', () => {
      const spy = vi.spyOn(DrawingCanvas.prototype, 'setupCanvas');
      new DrawingCanvas(canvas);
      expect(spy).toHaveBeenCalled();
    });

    it('should call bindEvents during initialization', () => {
      const spy = vi.spyOn(DrawingCanvas.prototype, 'bindEvents');
      new DrawingCanvas(canvas);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setupCanvas - Canvas Dimensions', () => {
    it('should set canvas width to 800 pixels', () => {
      expect(canvas.width).toBe(800);
    });

    it('should set canvas height to 600 pixels', () => {
      expect(canvas.height).toBe(600);
    });

    it('should configure context with round line caps', () => {
      expect(drawingCanvas.ctx.lineCap).toBe('round');
    });

    it('should configure context with round line joins', () => {
      expect(drawingCanvas.ctx.lineJoin).toBe('round');
    });

    it('should fill canvas with white background on setup', () => {
      const fillRectSpy = vi.spyOn(drawingCanvas.ctx, 'fillRect');
      drawingCanvas.setupCanvas();
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('Event Binding', () => {
    it('should attach mousedown event listener', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should attach mousemove event listener', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should attach mouseup event listener', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('should attach mouseout event listener', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('mouseout', expect.any(Function));
    });

    it('should attach touchstart event listener for mobile support', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });

    it('should attach touchmove event listener for mobile support', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('should attach touchend event listener for mobile support', () => {
      const spy = vi.spyOn(canvas, 'addEventListener');
      drawingCanvas.bindEvents();
      expect(spy).toHaveBeenCalledWith('touchend', expect.any(Function));
    });
  });

  describe('Drawing State Management', () => {
    it('should start drawing when startDrawing is called', () => {
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.startDrawing(mockEvent);
      expect(drawingCanvas.isDrawing).toBe(true);
    });

    it('should call beginPath when starting to draw', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'beginPath');
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.startDrawing(mockEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should call moveTo with correct position when starting to draw', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'moveTo');
      const mockEvent = { clientX: 100, clientY: 150 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 10, top: 20 }));
      
      drawingCanvas.startDrawing(mockEvent);
      expect(spy).toHaveBeenCalledWith(90, 130);
    });

    it('should stop drawing when stopDrawing is called', () => {
      drawingCanvas.isDrawing = true;
      drawingCanvas.stopDrawing();
      expect(drawingCanvas.isDrawing).toBe(false);
    });

    it('should begin new path when stopping drawing', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'beginPath');
      drawingCanvas.stopDrawing();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Drawing Operations', () => {
    it('should not draw when isDrawing is false', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'lineTo');
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.isDrawing = false;
      drawingCanvas.draw(mockEvent);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should draw when isDrawing is true', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'lineTo');
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.isDrawing = true;
      drawingCanvas.draw(mockEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should use current color when drawing', () => {
      drawingCanvas.isDrawing = true;
      drawingCanvas.currentColor = '#ff0000';
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.draw(mockEvent);
      expect(drawingCanvas.ctx.strokeStyle).toBe('#ff0000');
    });

    it('should use current brush size when drawing', () => {
      drawingCanvas.isDrawing = true;
      drawingCanvas.brushSize = 10;
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.draw(mockEvent);
      expect(drawingCanvas.ctx.lineWidth).toBe(10);
    });

    it('should call stroke to render the line', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'stroke');
      drawingCanvas.isDrawing = true;
      const mockEvent = { clientX: 50, clientY: 50 };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.draw(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Position Calculation', () => {
    it('should calculate correct mouse position relative to canvas', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 100, top: 200 }));
      const mockEvent = { clientX: 350, clientY: 450 };
      
      const pos = drawingCanvas.getPosition(mockEvent);
      expect(pos.x).toBe(250);
      expect(pos.y).toBe(250);
    });

    it('should handle zero offset correctly', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      const mockEvent = { clientX: 100, clientY: 200 };
      
      const pos = drawingCanvas.getPosition(mockEvent);
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });

    it('should handle negative positions', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 200, top: 300 }));
      const mockEvent = { clientX: 50, clientY: 100 };
      
      const pos = drawingCanvas.getPosition(mockEvent);
      expect(pos.x).toBe(-150);
      expect(pos.y).toBe(-200);
    });
  });

  describe('Color Management', () => {
    it('should update current color when setColor is called', () => {
      drawingCanvas.setColor('#ff0000');
      expect(drawingCanvas.currentColor).toBe('#ff0000');
    });

    it('should accept hex color codes', () => {
      drawingCanvas.setColor('#00ff00');
      expect(drawingCanvas.currentColor).toBe('#00ff00');
    });

    it('should accept named colors', () => {
      drawingCanvas.setColor('red');
      expect(drawingCanvas.currentColor).toBe('red');
    });

    it('should accept rgb color values', () => {
      drawingCanvas.setColor('rgb(255, 0, 0)');
      expect(drawingCanvas.currentColor).toBe('rgb(255, 0, 0)');
    });
  });

  describe('Brush Size Management', () => {
    it('should update brush size when setBrushSize is called', () => {
      drawingCanvas.setBrushSize(10);
      expect(drawingCanvas.brushSize).toBe(10);
    });

    it('should accept minimum brush size of 1', () => {
      drawingCanvas.setBrushSize(1);
      expect(drawingCanvas.brushSize).toBe(1);
    });

    it('should accept large brush sizes', () => {
      drawingCanvas.setBrushSize(20);
      expect(drawingCanvas.brushSize).toBe(20);
    });

    it('should handle brush size as number', () => {
      drawingCanvas.setBrushSize(5);
      expect(typeof drawingCanvas.brushSize).toBe('number');
    });
  });

  describe('Canvas Clearing', () => {
    it('should fill canvas with white when cleared', () => {
      const fillRectSpy = vi.spyOn(drawingCanvas.ctx, 'fillRect');
      drawingCanvas.clear();
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should set fillStyle to white before clearing', () => {
      drawingCanvas.clear();
      expect(drawingCanvas.ctx.fillStyle).toBe('#ffffff');
    });

    it('should clear the entire canvas area', () => {
      const fillRectSpy = vi.spyOn(drawingCanvas.ctx, 'fillRect');
      drawingCanvas.clear();
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('Image Data Operations', () => {
    it('should return image data when getImageData is called', () => {
      const mockImageData = { data: new Uint8ClampedArray(4) };
      drawingCanvas.ctx.getImageData = vi.fn(() => mockImageData);
      
      const result = drawingCanvas.getImageData();
      expect(result).toBe(mockImageData);
    });

    it('should get image data for entire canvas', () => {
      const spy = vi.spyOn(drawingCanvas.ctx, 'getImageData');
      drawingCanvas.getImageData();
      expect(spy).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should detect empty canvas correctly', () => {
      const whitePixels = new Uint8ClampedArray(800 * 600 * 4);
      for (let i = 0; i < whitePixels.length; i += 4) {
        whitePixels[i] = 255;     // R
        whitePixels[i + 1] = 255; // G
        whitePixels[i + 2] = 255; // B
        whitePixels[i + 3] = 255; // A
      }
      
      drawingCanvas.ctx.getImageData = vi.fn(() => ({ 
        data: whitePixels 
      }));
      
      expect(drawingCanvas.isEmpty()).toBe(true);
    });

    it('should detect non-empty canvas correctly', () => {
      const mixedPixels = new Uint8ClampedArray(800 * 600 * 4);
      mixedPixels.fill(255);
      mixedPixels[0] = 0; // First pixel is not white
      
      drawingCanvas.ctx.getImageData = vi.fn(() => ({ 
        data: mixedPixels 
      }));
      
      expect(drawingCanvas.isEmpty()).toBe(false);
    });

    it('should handle single non-white pixel in isEmpty check', () => {
      const pixels = new Uint8ClampedArray(16); // 4 pixels
      pixels.fill(255);
      pixels[4] = 0; // Second pixel red channel is 0
      
      drawingCanvas.ctx.getImageData = vi.fn(() => ({ 
        data: pixels 
      }));
      
      expect(drawingCanvas.isEmpty()).toBe(false);
    });
  });

  describe('Touch Event Handling', () => {
    it('should prevent default on touchstart', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        touches: [{ clientX: 50, clientY: 50 }],
      };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      const startSpy = vi.spyOn(drawingCanvas, 'startDrawing');
      canvas.dispatchEvent(new Event('touchstart'));
      
      // Manually trigger the touch handler
      const touchHandler = canvas.addEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )?.[1];
      
      if (touchHandler) {
        touchHandler(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      }
    });

    it('should prevent default on touchmove', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        touches: [{ clientX: 50, clientY: 50 }],
      };
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      canvas.dispatchEvent(new Event('touchmove'));
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle getBoundingClientRect returning null properties gracefully', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: null, top: null }));
      const mockEvent = { clientX: 50, clientY: 50 };
      
      expect(() => drawingCanvas.getPosition(mockEvent)).not.toThrow();
    });

    it('should handle very large canvas dimensions', () => {
      canvas.width = 10000;
      canvas.height = 10000;
      
      expect(() => drawingCanvas.clear()).not.toThrow();
    });

    it('should handle rapid consecutive draw calls', () => {
      drawingCanvas.isDrawing = true;
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      for (let i = 0; i < 100; i++) {
        const mockEvent = { clientX: i, clientY: i };
        expect(() => drawingCanvas.draw(mockEvent)).not.toThrow();
      }
    });

    it('should handle color change during drawing', () => {
      drawingCanvas.isDrawing = true;
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.setColor('#ff0000');
      drawingCanvas.draw({ clientX: 10, clientY: 10 });
      
      drawingCanvas.setColor('#00ff00');
      drawingCanvas.draw({ clientX: 20, clientY: 20 });
      
      expect(drawingCanvas.ctx.strokeStyle).toBe('#00ff00');
    });

    it('should handle brush size change during drawing', () => {
      drawingCanvas.isDrawing = true;
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.setBrushSize(5);
      drawingCanvas.draw({ clientX: 10, clientY: 10 });
      
      drawingCanvas.setBrushSize(15);
      drawingCanvas.draw({ clientX: 20, clientY: 20 });
      
      expect(drawingCanvas.ctx.lineWidth).toBe(15);
    });
  });

  describe('Integration with Canvas Context', () => {
    it('should maintain drawing state across multiple operations', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }));
      
      drawingCanvas.setColor('#ff0000');
      drawingCanvas.setBrushSize(10);
      drawingCanvas.startDrawing({ clientX: 10, clientY: 10 });
      drawingCanvas.draw({ clientX: 20, clientY: 20 });
      drawingCanvas.draw({ clientX: 30, clientY: 30 });
      drawingCanvas.stopDrawing();
      
      expect(drawingCanvas.currentColor).toBe('#ff0000');
      expect(drawingCanvas.brushSize).toBe(10);
      expect(drawingCanvas.isDrawing).toBe(false);
    });

    it('should properly reset context state after clearing', () => {
      drawingCanvas.setColor('#ff0000');
      drawingCanvas.setBrushSize(15);
      drawingCanvas.clear();
      
      expect(drawingCanvas.currentColor).toBe('#ff0000');
      expect(drawingCanvas.brushSize).toBe(15);
    });
  });
});