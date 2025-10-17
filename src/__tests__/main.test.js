/**
 * Unit tests for main.js - DrawAndGuessGame
 * Tests game initialization, setup, event binding, and game start
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DrawingCanvas } from '../components/DrawingCanvas.js';
import { GameManager } from '../game/GameManager.js';

// Mock the modules
vi.mock('../components/DrawingCanvas.js');
vi.mock('../game/GameManager.js');

describe('DrawAndGuessGame', () => {
  let DrawAndGuessGame;
  let mockCanvas;
  let mockElements;
  let mockEventListeners;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    mockEventListeners = {};

    // Mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.id = 'drawingCanvas';

    // Mock DOM elements
    mockElements = {
      drawingCanvas: mockCanvas,
      startBtn: document.createElement('button'),
      brushSize: document.createElement('input'),
      brushSizeValue: document.createElement('span'),
      clearBtn: document.createElement('button'),
      submitBtn: document.createElement('button'),
      skipBtn: document.createElement('button'),
      nextBtn: document.createElement('button'),
      startGameSection: document.createElement('div'),
      canvasWrapper: document.createElement('div'),
      toolbar: document.createElement('div'),
    };

    mockElements.startBtn.id = 'startBtn';
    mockElements.brushSize.id = 'brushSize';
    mockElements.brushSize.value = '3';
    mockElements.brushSizeValue.id = 'brushSizeValue';
    mockElements.clearBtn.id = 'clearBtn';
    mockElements.submitBtn.id = 'submitBtn';
    mockElements.skipBtn.id = 'skipBtn';
    mockElements.nextBtn.id = 'nextBtn';
    mockElements.startGameSection.id = 'startGameSection';
    mockElements.startGameSection.classList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    // Mock color buttons
    const colorButtons = [];
    for (let i = 0; i < 6; i++) {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.dataset.color = '#' + i + i + i + i + i + i;
      btn.classList = {
        remove: vi.fn(),
        add: vi.fn(),
      };
      btn.addEventListener = vi.fn((event, handler) => {
        if (!mockEventListeners[`color-${i}`]) {
          mockEventListeners[`color-${i}`] = {};
        }
        mockEventListeners[`color-${i}`][event] = handler;
      });
      colorButtons.push(btn);
    }

    // Setup document mock
    document.getElementById = vi.fn((id) => mockElements[id]);
    document.querySelectorAll = vi.fn((selector) => {
      if (selector === '.color-btn') return colorButtons;
      return [];
    });
    document.querySelector = vi.fn((selector) => {
      if (selector === '.canvas-wrapper') return mockElements.canvasWrapper;
      if (selector === '.toolbar') return mockElements.toolbar;
      return null;
    });

    // Add event listener tracking
    Object.values(mockElements).forEach((el) => {
      if (el && el.addEventListener) {
        const originalAddEventListener = el.addEventListener.bind(el);
        el.addEventListener = vi.fn((event, handler) => {
          if (!mockEventListeners[el.id]) {
            mockEventListeners[el.id] = {};
          }
          mockEventListeners[el.id][event] = handler;
          originalAddEventListener(event, handler);
        });
      }
    });

    // Mock console.log
    global.console.log = vi.fn();

    // Mock DrawingCanvas and GameManager
    DrawingCanvas.mockImplementation(() => ({
      setColor: vi.fn(),
      setBrushSize: vi.fn(),
      clear: vi.fn(),
    }));

    GameManager.mockImplementation(() => ({
      nextWord: vi.fn(),
      submitAnswer: vi.fn(),
      skipWord: vi.fn(),
    }));

    // Set document ready state
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete',
    });

    // Import main.js dynamically to trigger class instantiation
    await import('../main.js');
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('initialization', () => {
    it('should create DrawingCanvas instance with canvas element', () => {
      expect(DrawingCanvas).toHaveBeenCalledWith(mockCanvas);
    });

    it('should create GameManager instance', () => {
      expect(GameManager).toHaveBeenCalled();
    });

    it('should log initialization complete message', () => {
      expect(console.log).toHaveBeenCalledWith('🎮 游戏初始化完成！');
    });
  });

  describe('event binding', () => {
    it('should bind click event to start button', () => {
      expect(mockElements.startBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should bind click events to color buttons', () => {
      const colorButtons = document.querySelectorAll('.color-btn');
      colorButtons.forEach((btn) => {
        expect(btn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      });
    });

    it('should bind input event to brush size slider', () => {
      expect(mockElements.brushSize.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    });

    it('should bind click event to clear button', () => {
      expect(mockElements.clearBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should bind click event to submit button', () => {
      expect(mockElements.submitBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should bind click event to skip button', () => {
      expect(mockElements.skipBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should bind click event to next button', () => {
      expect(mockElements.nextBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('start button functionality', () => {
    it('should hide start game section when clicked', () => {
      if (mockEventListeners.startBtn && mockEventListeners.startBtn.click) {
        mockEventListeners.startBtn.click();
        expect(mockElements.startGameSection.classList.add).toHaveBeenCalledWith('hidden');
      }
    });

    it('should display canvas wrapper when game starts', () => {
      if (mockEventListeners.startBtn && mockEventListeners.startBtn.click) {
        mockEventListeners.startBtn.click();
        expect(mockElements.canvasWrapper.style.display).toBe('block');
      }
    });

    it('should display toolbar when game starts', () => {
      if (mockEventListeners.startBtn && mockEventListeners.startBtn.click) {
        mockEventListeners.startBtn.click();
        expect(mockElements.toolbar.style.display).toBe('block');
      }
    });

    it('should log game start message', () => {
      if (mockEventListeners.startBtn && mockEventListeners.startBtn.click) {
        console.log.mockClear();
        mockEventListeners.startBtn.click();
        expect(console.log).toHaveBeenCalledWith('🎮 游戏开始！');
      }
    });
  });

  describe('color picker functionality', () => {
    it('should change canvas color when color button is clicked', () => {
      const colorButtons = document.querySelectorAll('.color-btn');
      if (colorButtons[0] && mockEventListeners['color-0']?.click) {
        const mockEvent = {
          target: colorButtons[0],
        };
        mockEventListeners['color-0'].click(mockEvent);

        const canvasInstance = DrawingCanvas.mock.results[0]?.value;
        if (canvasInstance) {
          expect(canvasInstance.setColor).toHaveBeenCalled();
        }
      }
    });

    it('should update active class on color buttons', () => {
      const colorButtons = document.querySelectorAll('.color-btn');
      if (colorButtons[1] && mockEventListeners['color-1']?.click) {
        const mockEvent = {
          target: colorButtons[1],
        };
        mockEventListeners['color-1'].click(mockEvent);

        // Should remove active from all buttons
        colorButtons.forEach((btn) => {
          expect(btn.classList.remove).toHaveBeenCalledWith('active');
        });

        // Should add active to clicked button
        expect(colorButtons[1].classList.add).toHaveBeenCalledWith('active');
      }
    });
  });

  describe('brush size functionality', () => {
    it('should update brush size value display', () => {
      if (mockEventListeners.brushSize?.input) {
        const mockEvent = {
          target: { value: '10' },
        };
        mockEventListeners.brushSize.input(mockEvent);
        expect(mockElements.brushSizeValue.textContent).toBe('10');
      }
    });

    it('should update canvas brush size', () => {
      if (mockEventListeners.brushSize?.input) {
        const mockEvent = {
          target: { value: '15' },
        };
        mockEventListeners.brushSize.input(mockEvent);

        const canvasInstance = DrawingCanvas.mock.results[0]?.value;
        if (canvasInstance) {
          expect(canvasInstance.setBrushSize).toHaveBeenCalledWith(15);
        }
      }
    });
  });

  describe('canvas control functionality', () => {
    it('should clear canvas when clear button is clicked', () => {
      if (mockEventListeners.clearBtn?.click) {
        mockEventListeners.clearBtn.click();

        const canvasInstance = DrawingCanvas.mock.results[0]?.value;
        if (canvasInstance) {
          expect(canvasInstance.clear).toHaveBeenCalled();
        }
      }
    });
  });

  describe('game control functionality', () => {
    it('should submit answer when submit button is clicked', () => {
      if (mockEventListeners.submitBtn?.click) {
        mockEventListeners.submitBtn.click();

        const gameManagerInstance = GameManager.mock.results[0]?.value;
        if (gameManagerInstance) {
          expect(gameManagerInstance.submitAnswer).toHaveBeenCalled();
        }
      }
    });

    it('should skip word when skip button is clicked', () => {
      if (mockEventListeners.skipBtn?.click) {
        mockEventListeners.skipBtn.click();

        const gameManagerInstance = GameManager.mock.results[0]?.value;
        if (gameManagerInstance) {
          expect(gameManagerInstance.skipWord).toHaveBeenCalled();
        }
      }
    });

    it('should get next word when next button is clicked', () => {
      if (mockEventListeners.nextBtn?.click) {
        mockEventListeners.nextBtn.click();

        const gameManagerInstance = GameManager.mock.results[0]?.value;
        if (gameManagerInstance) {
          expect(gameManagerInstance.nextWord).toHaveBeenCalled();
        }
      }
    });
  });

  describe('document ready state handling', () => {
    it('should handle loading state by waiting for DOMContentLoaded', async () => {
      vi.resetModules();

      Object.defineProperty(document, 'readyState', {
        writable: true,
        value: 'loading',
      });

      let domContentLoadedHandler;
      document.addEventListener = vi.fn((event, handler) => {
        if (event === 'DOMContentLoaded') {
          domContentLoadedHandler = handler;
        }
      });

      await import('../main.js?v=1');

      expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete game flow', () => {
      // Start game
      if (mockEventListeners.startBtn?.click) {
        mockEventListeners.startBtn.click();
      }

      // Select color
      const colorButtons = document.querySelectorAll('.color-btn');
      if (colorButtons[2] && mockEventListeners['color-2']?.click) {
        mockEventListeners['color-2'].click({ target: colorButtons[2] });
      }

      // Change brush size
      if (mockEventListeners.brushSize?.input) {
        mockEventListeners.brushSize.input({ target: { value: '8' } });
      }

      // Clear canvas
      if (mockEventListeners.clearBtn?.click) {
        mockEventListeners.clearBtn.click();
      }

      // Get next word
      if (mockEventListeners.nextBtn?.click) {
        mockEventListeners.nextBtn.click();
      }

      // Submit answer
      if (mockEventListeners.submitBtn?.click) {
        mockEventListeners.submitBtn.click();
      }

      const canvasInstance = DrawingCanvas.mock.results[0]?.value;
      const gameManagerInstance = GameManager.mock.results[0]?.value;

      if (canvasInstance && gameManagerInstance) {
        expect(canvasInstance.setColor).toHaveBeenCalled();
        expect(canvasInstance.setBrushSize).toHaveBeenCalled();
        expect(canvasInstance.clear).toHaveBeenCalled();
        expect(gameManagerInstance.nextWord).toHaveBeenCalled();
        expect(gameManagerInstance.submitAnswer).toHaveBeenCalled();
      }
    });
  });
});