/**
 * Unit tests for GameManager
 * Tests game logic, word management, scoring, and UI interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameManager } from '../GameManager.js';

describe('GameManager', () => {
  let mockCanvas;
  let gameManager;
  let mockElements;

  beforeEach(() => {
    // Mock canvas
    mockCanvas = {
      clear: vi.fn(),
      isEmpty: vi.fn(() => false),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(800 * 600 * 4),
      })),
    };

    // Mock DOM elements
    mockElements = {
      wordDisplay: { textContent: '', className: '' },
      scoreDisplay: { textContent: '0' },
      resultArea: { classList: { add: vi.fn(), remove: vi.fn() } },
      resultTitle: { textContent: '' },
      resultMessage: { innerHTML: '' },
    };

    document.getElementById = vi.fn((id) => mockElements[id]);
    
    // Mock alert and console
    global.alert = vi.fn();
    global.console.log = vi.fn();

    gameManager = new GameManager(mockCanvas);
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      expect(gameManager.canvas).toBe(mockCanvas);
      expect(gameManager.currentWord).toBe(null);
      expect(gameManager.score).toBe(0);
      expect(gameManager.usedWords).toBeInstanceOf(Set);
      expect(gameManager.usedWords.size).toBe(0);
    });

    it('should initialize word list', () => {
      expect(gameManager.wordList).toBeDefined();
      expect(gameManager.wordList.easy).toBeDefined();
      expect(gameManager.wordList.medium).toBeDefined();
      expect(gameManager.wordList.hard).toBeDefined();
    });
  });

  describe('initWordList', () => {
    it('should return word lists with easy category', () => {
      const wordList = gameManager.initWordList();
      expect(wordList.easy).toBeDefined();
      expect(Array.isArray(wordList.easy)).toBe(true);
      expect(wordList.easy.length).toBeGreaterThan(0);
    });

    it('should return word lists with medium category', () => {
      const wordList = gameManager.initWordList();
      expect(wordList.medium).toBeDefined();
      expect(Array.isArray(wordList.medium)).toBe(true);
      expect(wordList.medium.length).toBeGreaterThan(0);
    });

    it('should return word lists with hard category', () => {
      const wordList = gameManager.initWordList();
      expect(wordList.hard).toBeDefined();
      expect(Array.isArray(wordList.hard)).toBe(true);
      expect(wordList.hard.length).toBeGreaterThan(0);
    });

    it('should have expected words in easy category', () => {
      const wordList = gameManager.initWordList();
      expect(wordList.easy).toContain('太阳');
      expect(wordList.easy).toContain('月亮');
    });

    it('should have unique words across all categories', () => {
      const wordList = gameManager.initWordList();
      const allWords = [...wordList.easy, ...wordList.medium, ...wordList.hard];
      const uniqueWords = new Set(allWords);
      expect(allWords.length).toBe(uniqueWords.size);
    });
  });

  describe('getRandomWord', () => {
    it('should return a word from the word list', () => {
      const word = gameManager.getRandomWord();
      const allWords = [
        ...gameManager.wordList.easy,
        ...gameManager.wordList.medium,
        ...gameManager.wordList.hard,
      ];
      expect(allWords).toContain(word);
    });

    it('should add returned word to usedWords set', () => {
      const word = gameManager.getRandomWord();
      expect(gameManager.usedWords.has(word)).toBe(true);
    });

    it('should not return the same word twice until all words are used', () => {
      const firstWord = gameManager.getRandomWord();
      const secondWord = gameManager.getRandomWord();
      
      if (firstWord === secondWord) {
        // If same, all words must be used (list size is 1)
        const totalWords = gameManager.wordList.easy.length +
                          gameManager.wordList.medium.length +
                          gameManager.wordList.hard.length;
        expect(totalWords).toBe(1);
      } else {
        expect(firstWord).not.toBe(secondWord);
      }
    });

    it('should reset usedWords when all words are used', () => {
      const totalWords = gameManager.wordList.easy.length +
                        gameManager.wordList.medium.length +
                        gameManager.wordList.hard.length;
      
      // Use all words
      for (let i = 0; i < totalWords; i++) {
        gameManager.getRandomWord();
      }
      
      expect(gameManager.usedWords.size).toBe(totalWords);
      
      // Next call should reset and return a word
      const word = gameManager.getRandomWord();
      expect(word).toBeDefined();
      expect(gameManager.usedWords.size).toBe(1);
    });

    it('should eventually return all words if called enough times', () => {
      const totalWords = gameManager.wordList.easy.length +
                        gameManager.wordList.medium.length +
                        gameManager.wordList.hard.length;
      const seenWords = new Set();
      
      // Get words until we've seen them all at least once
      for (let i = 0; i < totalWords * 2; i++) {
        seenWords.add(gameManager.getRandomWord());
      }
      
      expect(seenWords.size).toBe(totalWords);
    });
  });

  describe('nextWord', () => {
    it('should set currentWord to a new word', () => {
      gameManager.nextWord();
      expect(gameManager.currentWord).not.toBe(null);
    });

    it('should clear the canvas', () => {
      gameManager.nextWord();
      expect(mockCanvas.clear).toHaveBeenCalled();
    });

    it('should call updateWordDisplay', () => {
      gameManager.updateWordDisplay = vi.fn();
      gameManager.nextWord();
      expect(gameManager.updateWordDisplay).toHaveBeenCalled();
    });

    it('should call hideResult', () => {
      gameManager.hideResult = vi.fn();
      gameManager.nextWord();
      expect(gameManager.hideResult).toHaveBeenCalled();
    });

    it('should log the new word to console', () => {
      gameManager.nextWord();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('submitAnswer', () => {
    it('should alert if no current word', () => {
      gameManager.currentWord = null;
      gameManager.submitAnswer();
      expect(global.alert).toHaveBeenCalledWith('请先点击"下一题"开始游戏！');
    });

    it('should alert if canvas is empty', () => {
      gameManager.currentWord = '太阳';
      mockCanvas.isEmpty = vi.fn(() => true);
      gameManager.submitAnswer();
      expect(global.alert).toHaveBeenCalledWith('画板是空的，请先画点什么吧！');
    });

    it('should evaluate drawing if conditions are met', () => {
      gameManager.currentWord = '太阳';
      mockCanvas.isEmpty = vi.fn(() => false);
      gameManager.evaluateDrawing = vi.fn(() => ({ success: true, points: 10, message: '太棒了' }));
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      
      gameManager.submitAnswer();
      
      expect(gameManager.evaluateDrawing).toHaveBeenCalled();
    });

    it('should update score after evaluation', () => {
      gameManager.currentWord = '太阳';
      gameManager.score = 5;
      mockCanvas.isEmpty = vi.fn(() => false);
      gameManager.evaluateDrawing = vi.fn(() => ({ success: true, points: 10, message: '太棒了' }));
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      
      gameManager.submitAnswer();
      
      expect(gameManager.score).toBe(15);
    });

    it('should show result after evaluation', () => {
      gameManager.currentWord = '太阳';
      mockCanvas.isEmpty = vi.fn(() => false);
      const evaluation = { success: true, points: 10, message: '太棒了' };
      gameManager.evaluateDrawing = vi.fn(() => evaluation);
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      
      gameManager.submitAnswer();
      
      expect(gameManager.showResult).toHaveBeenCalledWith(evaluation);
    });
  });

  describe('evaluateDrawing', () => {
    it('should return an evaluation object', () => {
      const evaluation = gameManager.evaluateDrawing();
      expect(evaluation).toBeDefined();
      expect(evaluation).toHaveProperty('success');
      expect(evaluation).toHaveProperty('points');
      expect(evaluation).toHaveProperty('message');
    });

    it('should return boolean success value', () => {
      const evaluation = gameManager.evaluateDrawing();
      expect(typeof evaluation.success).toBe('boolean');
    });

    it('should return numeric points value', () => {
      const evaluation = gameManager.evaluateDrawing();
      expect(typeof evaluation.points).toBe('number');
      expect(evaluation.points).toBeGreaterThanOrEqual(0);
    });

    it('should return string message', () => {
      const evaluation = gameManager.evaluateDrawing();
      expect(typeof evaluation.message).toBe('string');
      expect(evaluation.message.length).toBeGreaterThan(0);
    });

    it('should return varied results over multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        const evaluation = gameManager.evaluateDrawing();
        results.add(evaluation.points);
      }
      // Should have at least 2 different point values
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('skipWord', () => {
    it('should alert if no current word', () => {
      gameManager.currentWord = null;
      gameManager.skipWord();
      expect(global.alert).toHaveBeenCalledWith('请先点击"下一题"开始游戏！');
    });

    it('should show result with 0 points if current word exists', () => {
      gameManager.currentWord = '太阳';
      gameManager.showResult = vi.fn();
      
      gameManager.skipWord();
      
      expect(gameManager.showResult).toHaveBeenCalledWith({
        success: false,
        points: 0,
        message: '正确答案是: 太阳',
      });
    });

    it('should display correct answer in message', () => {
      gameManager.currentWord = '月亮';
      gameManager.showResult = vi.fn();
      
      gameManager.skipWord();
      
      const call = gameManager.showResult.mock.calls[0][0];
      expect(call.message).toContain('月亮');
    });
  });

  describe('updateWordDisplay', () => {
    it('should update word display element with current word', () => {
      gameManager.currentWord = '太阳';
      gameManager.updateWordDisplay();
      expect(mockElements.wordDisplay.textContent).toBe('太阳');
    });

    it('should set active class when word exists', () => {
      gameManager.currentWord = '太阳';
      gameManager.updateWordDisplay();
      expect(mockElements.wordDisplay.className).toBe('word active');
    });

    it('should show default text when no current word', () => {
      gameManager.currentWord = null;
      gameManager.updateWordDisplay();
      expect(mockElements.wordDisplay.textContent).toBe('点击开始游戏');
    });

    it('should set default class when no current word', () => {
      gameManager.currentWord = null;
      gameManager.updateWordDisplay();
      expect(mockElements.wordDisplay.className).toBe('word');
    });
  });

  describe('updateScore', () => {
    it('should update score display with current score', () => {
      gameManager.score = 42;
      gameManager.updateScore();
      expect(mockElements.scoreDisplay.textContent).toBe(42);
    });

    it('should handle zero score', () => {
      gameManager.score = 0;
      gameManager.updateScore();
      expect(mockElements.scoreDisplay.textContent).toBe(0);
    });

    it('should handle large scores', () => {
      gameManager.score = 9999;
      gameManager.updateScore();
      expect(mockElements.scoreDisplay.textContent).toBe(9999);
    });
  });

  describe('showResult', () => {
    it('should display success title for successful evaluation', () => {
      const evaluation = { success: true, points: 10, message: '太棒了' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultTitle.textContent).toBe('🎉 恭喜！');
    });

    it('should display failure title for failed evaluation', () => {
      const evaluation = { success: false, points: 2, message: '再试试' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultTitle.textContent).toBe('😅 再试试吧！');
    });

    it('should include evaluation message in result', () => {
      const evaluation = { success: true, points: 10, message: '画得很好' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultMessage.innerHTML).toContain('画得很好');
    });

    it('should include current word in result', () => {
      const evaluation = { success: true, points: 10, message: '太棒了' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultMessage.innerHTML).toContain('太阳');
    });

    it('should include points in result', () => {
      const evaluation = { success: true, points: 10, message: '太棒了' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultMessage.innerHTML).toContain('10');
    });

    it('should remove hidden class from result area', () => {
      const evaluation = { success: true, points: 10, message: '太棒了' };
      gameManager.currentWord = '太阳';
      gameManager.showResult(evaluation);
      expect(mockElements.resultArea.classList.remove).toHaveBeenCalledWith('hidden');
    });
  });

  describe('hideResult', () => {
    it('should add hidden class to result area', () => {
      gameManager.hideResult();
      expect(mockElements.resultArea.classList.add).toHaveBeenCalledWith('hidden');
    });
  });

  describe('game flow scenarios', () => {
    it('should handle complete game round', () => {
      // Start new word
      gameManager.nextWord();
      expect(gameManager.currentWord).not.toBe(null);
      
      // Submit answer
      mockCanvas.isEmpty = vi.fn(() => false);
      gameManager.evaluateDrawing = vi.fn(() => ({ success: true, points: 10, message: 'Good' }));
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      gameManager.submitAnswer();
      
      expect(gameManager.score).toBe(10);
    });

    it('should accumulate score over multiple rounds', () => {
      mockCanvas.isEmpty = vi.fn(() => false);
      gameManager.evaluateDrawing = vi.fn(() => ({ success: true, points: 5, message: 'OK' }));
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      
      for (let i = 0; i < 3; i++) {
        gameManager.nextWord();
        gameManager.submitAnswer();
      }
      
      expect(gameManager.score).toBe(15);
    });

    it('should handle skip and continue game', () => {
      gameManager.showResult = vi.fn();
      
      gameManager.nextWord();
      const firstWord = gameManager.currentWord;
      
      gameManager.skipWord();
      expect(gameManager.score).toBe(0);
      
      gameManager.nextWord();
      expect(gameManager.currentWord).not.toBe(firstWord);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid successive nextWord calls', () => {
      for (let i = 0; i < 10; i++) {
        gameManager.nextWord();
        expect(gameManager.currentWord).not.toBe(null);
      }
    });

    it('should handle negative score scenarios gracefully', () => {
      gameManager.score = -10;
      gameManager.updateScore();
      expect(mockElements.scoreDisplay.textContent).toBe(-10);
    });

    it('should handle very long word names', () => {
      const longWord = '这是一个非常非常长的词汇名称用于测试';
      gameManager.currentWord = longWord;
      gameManager.updateWordDisplay();
      expect(mockElements.wordDisplay.textContent).toBe(longWord);
    });

    it('should handle evaluation with zero points', () => {
      gameManager.currentWord = '太阳';
      mockCanvas.isEmpty = vi.fn(() => false);
      gameManager.evaluateDrawing = vi.fn(() => ({ success: false, points: 0, message: 'Try again' }));
      gameManager.updateScore = vi.fn();
      gameManager.showResult = vi.fn();
      
      const initialScore = gameManager.score;
      gameManager.submitAnswer();
      expect(gameManager.score).toBe(initialScore);
    });
  });
});