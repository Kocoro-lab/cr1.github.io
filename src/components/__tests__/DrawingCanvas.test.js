/**
 * Unit tests for DrawingCanvas component
 * Tests drawing functionality, event handling, and canvas operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DrawingCanvas } from '../DrawingCanvas.js';

describe('DrawingCanvas', () => {
  let canvas;
  let drawingCanvas;
  let mockContext;

  beforeEach(() => {
    // Create a mock canvas element
    canvas = document.createElement('canvas');
    
    // Mock the 2D context
    mockContext = {
      lineCap: '',
      lineJoin: '',
      strokeStyle: '',
      lineWidth: 0,
      fillStyle: '',
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(800 * 600 * 4).fill(0),
        width: 800,
        height: 600,
      })),
    };

    // Mock canvas methods
    canvas.getContext = vi.fn(() => mockContext);
    canvas.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    }));
    canvas.addEventListener = vi.fn();

    drawingCanvas = new DrawingCanvas(canvas);
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      expect(drawingCanvas.canvas).toBe(canvas);
      expect(drawingCanvas.ctx).toBe(mockContext);
      expect(drawingCanvas.isDrawing).toBe(false);
      expect(drawingCanvas.currentColor).toBe('#ffffff');
      expect(drawingCanvas.brushSize).toBe(3);
    });

    it('should call setupCanvas during initialization', () => {
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    it('should call bindEvents during initialization', () => {
      // Should bind 8 events: 4 mouse events + 3 touch events + 1 mouseout
      expect(canvas.addEventListener).toHaveBeenCalledTimes(8);
    });
  });

  describe('setupCanvas', () => {
    it('should set canvas dimensions to 800x600', () => {
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    it('should set line cap to round', () => {
      expect(mockContext.lineCap).toBe('round');
    });

    it('should set line join to round', () => {
      expect(mockContext.lineJoin).toBe('round');
    });

    it('should fill canvas with background color', () => {
      expect(mockContext.fillStyle).toBe('#2d3436');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('bindEvents', () => {
    it('should bind mousedown event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should bind mousemove event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should bind mouseup event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('should bind mouseout event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('mouseout', expect.any(Function));
    });

    it('should bind touchstart event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });

    it('should bind touchmove event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('should bind touchend event', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
    });
  });

  describe('startDrawing', () => {
    it('should set isDrawing to true', () => {
      const event = { clientX: 100, clientY: 100 };
      drawingCanvas.startDrawing(event);
      expect(drawingCanvas.isDrawing).toBe(true);
    });

    it('should apply current color to strokeStyle', () => {
      const event = { clientX: 100, clientY: 100 };
      drawingCanvas.currentColor = '#ff0000';
      drawingCanvas.startDrawing(event);
      expect(mockContext.strokeStyle).toBe('#ff0000');
    });

    it('should apply brush size to lineWidth', () => {
      const event = { clientX: 100, clientY: 100 };
      drawingCanvas.brushSize = 10;
      drawingCanvas.startDrawing(event);
      expect(mockContext.lineWidth).toBe(10);
    });

    it('should begin a new path', () => {
      const event = { clientX: 100, clientY: 100 };
      drawingCanvas.startDrawing(event);
      expect(mockContext.beginPath).toHaveBeenCalled();
    });

    it('should move to correct position', () => {
      const event = { clientX: 100, clientY: 100 };
      drawingCanvas.startDrawing(event);
      expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
    });
  });

  describe('draw', () => {
    it('should not draw when isDrawing is false', () => {
      drawingCanvas.isDrawing = false;
      const event = { clientX: 150, clientY: 150 };
      drawingCanvas.draw(event);
      expect(mockContext.lineTo).not.toHaveBeenCalled();
    });

    it('should draw line to new position when isDrawing is true', () => {
      drawingCanvas.isDrawing = true;
      const event = { clientX: 150, clientY: 150 };
      drawingCanvas.draw(event);
      expect(mockContext.lineTo).toHaveBeenCalledWith(150, 150);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should restart path after drawing', () => {
      drawingCanvas.isDrawing = true;
      const event = { clientX: 150, clientY: 150 };
      drawingCanvas.draw(event);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(150, 150);
    });
  });

  describe('stopDrawing', () => {
    it('should set isDrawing to false', () => {
      drawingCanvas.isDrawing = true;
      drawingCanvas.stopDrawing();
      expect(drawingCanvas.isDrawing).toBe(false);
    });

    it('should begin a new path to reset drawing state', () => {
      mockContext.beginPath.mockClear();
      drawingCanvas.stopDrawing();
      expect(mockContext.beginPath).toHaveBeenCalled();
    });
  });

  describe('getPosition', () => {
    it('should calculate correct position without scaling', () => {
      const event = { clientX: 100, clientY: 100 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos).toEqual({ x: 100, y: 100 });
    });

    it('should account for canvas offset', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 50,
        top: 50,
        width: 800,
        height: 600,
      }));
      const event = { clientX: 150, clientY: 150 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos).toEqual({ x: 100, y: 100 });
    });

    it('should scale coordinates when canvas is scaled', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 400, // Canvas displayed at half size
        height: 300,
      }));
      const event = { clientX: 100, clientY: 100 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos).toEqual({ x: 200, y: 200 }); // Scaled 2x
    });

    it('should handle complex scaling and offset', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 25,
        top: 25,
        width: 400,
        height: 300,
      }));
      const event = { clientX: 125, clientY: 125 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos).toEqual({ x: 200, y: 200 });
    });
  });

  describe('setColor', () => {
    it('should update currentColor', () => {
      drawingCanvas.setColor('#ff0000');
      expect(drawingCanvas.currentColor).toBe('#ff0000');
    });

    it('should accept any valid color format', () => {
      drawingCanvas.setColor('rgb(255, 0, 0)');
      expect(drawingCanvas.currentColor).toBe('rgb(255, 0, 0)');
    });
  });

  describe('setBrushSize', () => {
    it('should update brushSize', () => {
      drawingCanvas.setBrushSize(10);
      expect(drawingCanvas.brushSize).toBe(10);
    });

    it('should accept different brush sizes', () => {
      drawingCanvas.setBrushSize(1);
      expect(drawingCanvas.brushSize).toBe(1);
      drawingCanvas.setBrushSize(20);
      expect(drawingCanvas.brushSize).toBe(20);
    });
  });

  describe('clear', () => {
    it('should fill canvas with background color', () => {
      mockContext.fillRect.mockClear();
      drawingCanvas.clear();
      expect(mockContext.fillStyle).toBe('#2d3436');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('getImageData', () => {
    it('should return image data from context', () => {
      const imageData = drawingCanvas.getImageData();
      expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 800, 600);
      expect(imageData).toBeDefined();
      expect(imageData.width).toBe(800);
      expect(imageData.height).toBe(600);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty canvas (all background color)', () => {
      const bgData = new Uint8ClampedArray(800 * 600 * 4);
      for (let i = 0; i < bgData.length; i += 4) {
        bgData[i] = 45;     // R
        bgData[i + 1] = 52; // G
        bgData[i + 2] = 54; // B
        bgData[i + 3] = 255; // A
      }
      mockContext.getImageData = vi.fn(() => ({
        data: bgData,
        width: 800,
        height: 600,
      }));
      expect(drawingCanvas.isEmpty()).toBe(true);
    });

    it('should return false when canvas has drawings', () => {
      const drawingData = new Uint8ClampedArray(800 * 600 * 4);
      for (let i = 0; i < drawingData.length; i += 4) {
        drawingData[i] = 45;
        drawingData[i + 1] = 52;
        drawingData[i + 2] = 54;
        drawingData[i + 3] = 255;
      }
      // Add a white pixel (drawing)
      drawingData[0] = 255;
      drawingData[1] = 255;
      drawingData[2] = 255;
      
      mockContext.getImageData = vi.fn(() => ({
        data: drawingData,
        width: 800,
        height: 600,
      }));
      expect(drawingCanvas.isEmpty()).toBe(false);
    });

    it('should allow small color variance (tolerance of 5)', () => {
      const almostBgData = new Uint8ClampedArray(800 * 600 * 4);
      for (let i = 0; i < almostBgData.length; i += 4) {
        almostBgData[i] = 47;     // R: 45+2 (within tolerance)
        almostBgData[i + 1] = 50; // G: 52-2 (within tolerance)
        almostBgData[i + 2] = 56; // B: 54+2 (within tolerance)
        almostBgData[i + 3] = 255;
      }
      mockContext.getImageData = vi.fn(() => ({
        data: almostBgData,
        width: 800,
        height: 600,
      }));
      expect(drawingCanvas.isEmpty()).toBe(true);
    });

    it('should detect colors outside tolerance threshold', () => {
      const variantData = new Uint8ClampedArray(800 * 600 * 4);
      for (let i = 0; i < variantData.length; i += 4) {
        variantData[i] = 51;     // R: 45+6 (outside tolerance)
        variantData[i + 1] = 52;
        variantData[i + 2] = 54;
        variantData[i + 3] = 255;
      }
      mockContext.getImageData = vi.fn(() => ({
        data: variantData,
        width: 800,
        height: 600,
      }));
      expect(drawingCanvas.isEmpty()).toBe(false);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle null or undefined events gracefully', () => {
      expect(() => {
        drawingCanvas.isDrawing = true;
        drawingCanvas.draw({ clientX: undefined, clientY: undefined });
      }).not.toThrow();
    });

    it('should handle very small brush sizes', () => {
      drawingCanvas.setBrushSize(0.5);
      expect(drawingCanvas.brushSize).toBe(0.5);
    });

    it('should handle very large brush sizes', () => {
      drawingCanvas.setBrushSize(100);
      expect(drawingCanvas.brushSize).toBe(100);
    });

    it('should handle negative coordinates', () => {
      const event = { clientX: -10, clientY: -10 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos.x).toBeDefined();
      expect(pos.y).toBeDefined();
    });

    it('should handle coordinates beyond canvas bounds', () => {
      const event = { clientX: 10000, clientY: 10000 };
      const pos = drawingCanvas.getPosition(event);
      expect(pos.x).toBeDefined();
      expect(pos.y).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete drawing workflow', () => {
      // Start drawing
      drawingCanvas.startDrawing({ clientX: 100, clientY: 100 });
      expect(drawingCanvas.isDrawing).toBe(true);
      
      // Draw some points
      drawingCanvas.draw({ clientX: 110, clientY: 110 });
      drawingCanvas.draw({ clientX: 120, clientY: 120 });
      
      // Stop drawing
      drawingCanvas.stopDrawing();
      expect(drawingCanvas.isDrawing).toBe(false);
    });

    it('should allow changing color mid-drawing', () => {
      drawingCanvas.setColor('#ff0000');
      drawingCanvas.startDrawing({ clientX: 100, clientY: 100 });
      
      drawingCanvas.setColor('#0000ff');
      drawingCanvas.startDrawing({ clientX: 200, clientY: 200 });
      expect(mockContext.strokeStyle).toBe('#0000ff');
    });

    it('should allow changing brush size mid-drawing', () => {
      drawingCanvas.setBrushSize(5);
      drawingCanvas.startDrawing({ clientX: 100, clientY: 100 });
      
      drawingCanvas.setBrushSize(15);
      drawingCanvas.startDrawing({ clientX: 200, clientY: 200 });
      expect(mockContext.lineWidth).toBe(15);
    });

    it('should handle clear followed by drawing', () => {
      drawingCanvas.clear();
      drawingCanvas.startDrawing({ clientX: 100, clientY: 100 });
      drawingCanvas.draw({ clientX: 110, clientY: 110 });
      expect(drawingCanvas.isDrawing).toBe(true);
    });
  });
});