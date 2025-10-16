/**
 * 画板组件
 * 负责处理画布的绘制功能
 */

export class DrawingCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.currentColor = '#000000';
    this.brushSize = 3;

    this.setupCanvas();
    this.bindEvents();
  }

  /**
   * 设置画布尺寸和样式
   */
  setupCanvas() {
    // 设置画布尺寸
    this.canvas.width = 600;
    this.canvas.height = 400;

    // 设置绘制样式
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // 填充白色背景
    this.clear();
  }

  /**
   * 绑定鼠标和触摸事件
   */
  bindEvents() {
    // 鼠标事件
    this.canvas.addEventListener('mousedown', e => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', e => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // 触摸事件（移动端支持）
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.startDrawing(e.touches[0]);
    });
    this.canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      this.draw(e.touches[0]);
    });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  /**
   * 开始绘制
   */
  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  /**
   * 绘制路径
   */
  draw(e) {
    if (!this.isDrawing) return;

    const pos = this.getPosition(e);
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  /**
   * 停止绘制
   */
  stopDrawing() {
    this.isDrawing = false;
    this.ctx.beginPath();
  }

  /**
   * 获取鼠标/触摸位置
   */
  getPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * 设置画笔颜色
   */
  setColor(color) {
    this.currentColor = color;
  }

  /**
   * 设置画笔大小
   */
  setBrushSize(size) {
    this.brushSize = size;
  }

  /**
   * 清空画板
   */
  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 获取画布图像数据（用于分析）
   */
  getImageData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 检查画布是否为空
   */
  isEmpty() {
    const imageData = this.getImageData();
    const data = imageData.data;

    // 检查是否所有像素都是白色
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        return false;
      }
    }
    return true;
  }
}
