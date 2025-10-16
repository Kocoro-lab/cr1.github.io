/**
 * 你画我猜游戏 - 主入口文件
 * 负责初始化游戏和协调各个模块
 */

import { DrawingCanvas } from './components/DrawingCanvas.js';
import { GameManager } from './game/GameManager.js';
import './styles/main.css';

class DrawAndGuessGame {
  constructor() {
    this.canvas = null;
    this.gameManager = null;
    this.init();
  }

  /**
   * 初始化游戏
   */
  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * 设置游戏组件和事件监听
   */
  setup() {
    // 初始化画板
    const canvasElement = document.getElementById('drawingCanvas');
    this.canvas = new DrawingCanvas(canvasElement);

    // 初始化游戏管理器
    this.gameManager = new GameManager(this.canvas);

    // 绑定UI事件
    this.bindEvents();

    console.log('🎮 游戏初始化完成！');
  }

  /**
   * 绑定所有UI事件
   */
  bindEvents() {
    // 开始游戏按钮
    document.getElementById('startBtn').addEventListener('click', () => {
      this.startGame();
    });

    // 颜色选择
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.canvas.setColor(e.target.dataset.color);
      });
    });

    // 笔刷大小调整
    const brushSize = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    brushSize.addEventListener('input', e => {
      const size = e.target.value;
      brushSizeValue.textContent = size;
      this.canvas.setBrushSize(parseInt(size));
    });

    // 清空画板
    document.getElementById('clearBtn').addEventListener('click', () => {
      this.canvas.clear();
    });

    // 提交答案
    document.getElementById('submitBtn').addEventListener('click', () => {
      this.gameManager.submitAnswer();
    });

    // 跳过当前题目
    document.getElementById('skipBtn').addEventListener('click', () => {
      this.gameManager.skipWord();
    });

    // 下一题
    document.getElementById('nextBtn').addEventListener('click', () => {
      this.gameManager.nextWord();
    });
  }

  /**
   * 开始游戏
   */
  startGame() {
    // 隐藏开始按钮区域
    document.getElementById('startGameSection').classList.add('hidden');

    // 显示画板和工具栏（如果之前被隐藏）
    document.querySelector('.canvas-wrapper').style.display = 'block';
    document.querySelector('.toolbar').style.display = 'block';

    // 开始第一题
    this.gameManager.nextWord();

    console.log('🎮 游戏开始！');
  }
}

// 启动游戏
new DrawAndGuessGame();
