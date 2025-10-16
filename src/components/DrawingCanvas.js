/**
 * 画板组件
 * 负责处理画布的绘制功能
 */

export class DrawingCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.currentColor = '#ffffff'; // 黑板默认使用白色粉笔
    this.brushSize = 3;

    this.setupCanvas();
    this.bindEvents();
  }

  /**
   * 设置画布尺寸和样式
   */
  setupCanvas() {
    // 设置画布尺寸 - 增加到更大的尺寸以便更好的绘制体验
    this.canvas.width = 800;
    this.canvas.height = 600;

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
   * 修正：考虑画布缩放比例
   */
  getPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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
   * 清空画板（黑板风格）
   */
  clear() {
    this.ctx.fillStyle = '#2d3436';
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

    // 检查是否所有像素都是黑板背景色 (#2d3436)
    const bgR = 45, bgG = 52, bgB = 54;
    for (let i = 0; i < data.length; i += 4) {
      // 允许轻微的颜色偏差
      if (Math.abs(data[i] - bgR) > 5 ||
          Math.abs(data[i + 1] - bgG) > 5 ||
          Math.abs(data[i + 2] - bgB) > 5) {
        return false;
      }
    }
    return true;
  }
}
