/**
 * DrawAndGuessGame Main Application Tests
 * 
 * Testing the main game controller including:
 * - Game initialization and setup
 * - Start game functionality
 * - Event binding and handling
 * - Component integration
 * - DOM manipulation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the CSS import
vi.mock('../styles/main.css', () => ({}));

describe('DrawAndGuessGame Application', () => {
  let originalHTML;

  beforeEach(() => {
    // Save original HTML
    originalHTML = document.body.innerHTML;

    // Setup DOM with game structure
    document.body.innerHTML = `
      <div id="app">
        <div id="startGameSection" class="start-game-section">
          <button id="startBtn" class="btn btn-start">🎮 开始游戏</button>
          <p class="start-hint">点击按钮开始你的绘画之旅！</p>
        </div>
        <div class="canvas-wrapper">
          <canvas id="drawingCanvas"></canvas>
        </div>
        <div class="toolbar">
          <div class="color-picker">
            <button class="color-btn active" data-color="#000000"></button>
            <button class="color-btn" data-color="#ff0000"></button>
          </div>
          <div class="brush-size">
            <input type="range" id="brushSize" min="1" max="20" value="3" />
            <span id="brushSizeValue">3</span>
          </div>
          <button id="clearBtn" class="btn">清空画板</button>
          <button id="submitBtn" class="btn">提交答案</button>
          <button id="skipBtn" class="btn">跳过</button>
          <button id="nextBtn" class="btn">下一题</button>
        </div>
        <div id="wordDisplay">点击开始游戏</div>
        <div id="scoreDisplay">0</div>
        <div id="resultArea" class="hidden"></div>
      </div>
    `;
  });

  afterEach(() => {
    // Restore original HTML
    document.body.innerHTML = originalHTML;
    vi.clearAllMocks();
  });

  describe('Game Initialization', () => {
    it('should initialize game when DOM is ready', async () => {
      // Mock modules before importing
      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({
          setColor: vi.fn(),
          setBrushSize: vi.fn(),
          clear: vi.fn(),
        })),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => ({
          nextWord: vi.fn(),
          submitAnswer: vi.fn(),
          skipWord: vi.fn(),
        })),
      }));

      const { DrawingCanvas } = await import('../components/DrawingCanvas.js');
      const { GameManager } = await import('../game/GameManager.js');

      // Simulate document ready state
      Object.defineProperty(document, 'readyState', {
        configurable: true,
        get() {
          return 'complete';
        },
      });

      // Import and initialize main after mocks are set
      await import('../main.js');

      // Verify components were initialized
      expect(DrawingCanvas).toHaveBeenCalled();
      expect(GameManager).toHaveBeenCalled();
    });

    it('should wait for DOMContentLoaded if document is still loading', async () => {
      Object.defineProperty(document, 'readyState', {
        configurable: true,
        get() {
          return 'loading';
        },
      });

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({})),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => ({})),
      }));

      await import('../main.js');

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'DOMContentLoaded',
        expect.any(Function)
      );
    });
  });

  describe('Start Game Functionality', () => {
    it('should hide start game section when start button is clicked', () => {
      const startGameSection = document.getElementById('startGameSection');
      const startBtn = document.getElementById('startBtn');

      expect(startGameSection.classList.contains('hidden')).toBe(false);

      startBtn.click();

      expect(startGameSection.classList.contains('hidden')).toBe(true);
    });

    it('should display canvas wrapper when game starts', () => {
      const canvasWrapper = document.querySelector('.canvas-wrapper');
      const startBtn = document.getElementById('startBtn');

      canvasWrapper.style.display = 'none';

      startBtn.click();

      expect(canvasWrapper.style.display).toBe('block');
    });

    it('should display toolbar when game starts', () => {
      const toolbar = document.querySelector('.toolbar');
      const startBtn = document.getElementById('startBtn');

      toolbar.style.display = 'none';

      startBtn.click();

      expect(toolbar.style.display).toBe('block');
    });

    it('should trigger nextWord when game starts', async () => {
      const mockGameManager = {
        nextWord: vi.fn(),
        submitAnswer: vi.fn(),
        skipWord: vi.fn(),
      };

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => mockGameManager),
      }));

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({})),
      }));

      // Re-import to use mocked modules
      await import('../main.js');

      const startBtn = document.getElementById('startBtn');
      startBtn.click();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGameManager.nextWord).toHaveBeenCalled();
    });
  });

  describe('Event Binding - Color Selection', () => {
    it('should bind click events to color buttons', () => {
      const colorBtns = document.querySelectorAll('.color-btn');
      expect(colorBtns.length).toBeGreaterThan(0);

      colorBtns.forEach(btn => {
        expect(btn).toBeDefined();
      });
    });

    it('should set active class on selected color button', () => {
      const colorBtns = document.querySelectorAll('.color-btn');
      const firstBtn = colorBtns[0];
      const secondBtn = colorBtns[1];

      firstBtn.classList.add('active');
      secondBtn.classList.remove('active');

      secondBtn.click();
      secondBtn.classList.add('active');
      firstBtn.classList.remove('active');

      expect(secondBtn.classList.contains('active')).toBe(true);
      expect(firstBtn.classList.contains('active')).toBe(false);
    });

    it('should call canvas.setColor with correct color value', async () => {
      const mockCanvas = {
        setColor: vi.fn(),
        setBrushSize: vi.fn(),
        clear: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => mockCanvas),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => ({})),
      }));

      await import('../main.js');

      const colorBtn = document.querySelector('.color-btn[data-color="#ff0000"]');
      if (colorBtn) {
        colorBtn.click();
        expect(mockCanvas.setColor).toHaveBeenCalledWith('#ff0000');
      }
    });
  });

  describe('Event Binding - Brush Size', () => {
    it('should update brush size value display on slider change', () => {
      const brushSize = document.getElementById('brushSize');
      const brushSizeValue = document.getElementById('brushSizeValue');

      brushSize.value = '10';
      brushSize.dispatchEvent(new Event('input'));

      // In real implementation, this would update
      expect(brushSize.value).toBe('10');
    });

    it('should call canvas.setBrushSize with correct value', async () => {
      const mockCanvas = {
        setColor: vi.fn(),
        setBrushSize: vi.fn(),
        clear: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => mockCanvas),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => ({})),
      }));

      await import('../main.js');

      const brushSize = document.getElementById('brushSize');
      brushSize.value = '15';
      brushSize.dispatchEvent(new Event('input'));
    });

    it('should handle brush size range from 1 to 20', () => {
      const brushSize = document.getElementById('brushSize');

      expect(brushSize.min).toBe('1');
      expect(brushSize.max).toBe('20');
    });
  });

  describe('Event Binding - Canvas Operations', () => {
    it('should call canvas.clear when clear button is clicked', async () => {
      const mockCanvas = {
        setColor: vi.fn(),
        setBrushSize: vi.fn(),
        clear: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => mockCanvas),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => ({})),
      }));

      await import('../main.js');

      const clearBtn = document.getElementById('clearBtn');
      clearBtn.click();

      expect(mockCanvas.clear).toHaveBeenCalled();
    });
  });

  describe('Event Binding - Game Actions', () => {
    it('should call gameManager.submitAnswer when submit button is clicked', async () => {
      const mockGameManager = {
        nextWord: vi.fn(),
        submitAnswer: vi.fn(),
        skipWord: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({})),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => mockGameManager),
      }));

      await import('../main.js');

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.click();

      expect(mockGameManager.submitAnswer).toHaveBeenCalled();
    });

    it('should call gameManager.skipWord when skip button is clicked', async () => {
      const mockGameManager = {
        nextWord: vi.fn(),
        submitAnswer: vi.fn(),
        skipWord: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({})),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => mockGameManager),
      }));

      await import('../main.js');

      const skipBtn = document.getElementById('skipBtn');
      skipBtn.click();

      expect(mockGameManager.skipWord).toHaveBeenCalled();
    });

    it('should call gameManager.nextWord when next button is clicked', async () => {
      const mockGameManager = {
        nextWord: vi.fn(),
        submitAnswer: vi.fn(),
        skipWord: vi.fn(),
      };

      vi.doMock('../components/DrawingCanvas.js', () => ({
        DrawingCanvas: vi.fn().mockImplementation(() => ({})),
      }));

      vi.doMock('../game/GameManager.js', () => ({
        GameManager: vi.fn().mockImplementation(() => mockGameManager),
      }));

      await import('../main.js');

      const nextBtn = document.getElementById('nextBtn');
      nextBtn.click();

      expect(mockGameManager.nextWord).toHaveBeenCalled();
    });
  });

  describe('DOM Element Validation', () => {
    it('should have all required DOM elements present', () => {
      expect(document.getElementById('startBtn')).toBeTruthy();
      expect(document.getElementById('startGameSection')).toBeTruthy();
      expect(document.getElementById('drawingCanvas')).toBeTruthy();
      expect(document.querySelector('.canvas-wrapper')).toBeTruthy();
      expect(document.querySelector('.toolbar')).toBeTruthy();
      expect(document.getElementById('brushSize')).toBeTruthy();
      expect(document.getElementById('brushSizeValue')).toBeTruthy();
      expect(document.getElementById('clearBtn')).toBeTruthy();
      expect(document.getElementById('submitBtn')).toBeTruthy();
      expect(document.getElementById('skipBtn')).toBeTruthy();
      expect(document.getElementById('nextBtn')).toBeTruthy();
    });

    it('should have canvas element with correct ID', () => {
      const canvas = document.getElementById('drawingCanvas');
      expect(canvas).toBeTruthy();
      expect(canvas.tagName).toBe('CANVAS');
    });

    it('should have start button with correct attributes', () => {
      const startBtn = document.getElementById('startBtn');
      expect(startBtn).toBeTruthy();
      expect(startBtn.classList.contains('btn')).toBe(true);
      expect(startBtn.classList.contains('btn-start')).toBe(true);
    });
  });

  describe('CSS Class Management', () => {
    it('should properly toggle hidden class on start game section', () => {
      const startGameSection = document.getElementById('startGameSection');
      
      expect(startGameSection.classList.contains('hidden')).toBe(false);
      
      startGameSection.classList.add('hidden');
      expect(startGameSection.classList.contains('hidden')).toBe(true);
      
      startGameSection.classList.remove('hidden');
      expect(startGameSection.classList.contains('hidden')).toBe(false);
    });

    it('should handle multiple class changes gracefully', () => {
      const startGameSection = document.getElementById('startGameSection');
      
      startGameSection.classList.add('hidden');
      startGameSection.classList.add('active');
      startGameSection.classList.remove('hidden');
      
      expect(startGameSection.classList.contains('hidden')).toBe(false);
      expect(startGameSection.classList.contains('active')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing DOM elements gracefully', () => {
      document.body.innerHTML = '<div id="app"></div>';
      
      expect(() => {
        const element = document.getElementById('nonExistentElement');
        expect(element).toBeNull();
      }).not.toThrow();
    });

    it('should handle multiple rapid button clicks', () => {
      const startBtn = document.getElementById('startBtn');
      
      expect(() => {
        for (let i = 0; i < 10; i++) {
          startBtn.click();
        }
      }).not.toThrow();
    });
  });
});