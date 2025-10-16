/**
 * 游戏管理器
 * 负责游戏逻辑、词库管理和评分系统
 */

export class GameManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentWord = null;
    this.score = 0;
    this.wordList = this.initWordList();
    this.usedWords = new Set();
  }

  /**
   * 初始化词库
   * 简单的演示词汇，按难度分类
   */
  initWordList() {
    return {
      easy: ['太阳', '月亮', '星星', '房子', '树', '花', '猫', '狗', '鱼', '鸟'],
      medium: ['汽车', '飞机', '自行车', '电脑', '手机', '书', '眼镜', '雨伞', '笑脸', '爱心'],
      hard: ['彩虹', '蝴蝶', '蛋糕', '火箭', '城堡', '钢琴', '足球', '生日', '礼物', '风车'],
    };
  }

  /**
   * 随机选择一个词汇
   */
  getRandomWord() {
    // 合并所有难度的词汇
    const allWords = [...this.wordList.easy, ...this.wordList.medium, ...this.wordList.hard];

    // 过滤掉已使用的词汇
    const availableWords = allWords.filter(word => !this.usedWords.has(word));

    // 如果所有词汇都用完了，重置
    if (availableWords.length === 0) {
      this.usedWords.clear();
      return this.getRandomWord();
    }

    // 随机选择
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    this.usedWords.add(word);
    return word;
  }

  /**
   * 开始新的一题
   */
  nextWord() {
    this.currentWord = this.getRandomWord();
    this.canvas.clear();
    this.updateWordDisplay();
    this.hideResult();
    console.log('📝 新词汇:', this.currentWord);
  }

  /**
   * 提交答案并评分
   */
  submitAnswer() {
    if (!this.currentWord) {
      alert('请先点击"下一题"开始游戏！');
      return;
    }

    if (this.canvas.isEmpty()) {
      alert('画板是空的，请先画点什么吧！');
      return;
    }

    // 简单的评分逻辑（演示用）
    // 实际应用中可以集成机器学习模型进行图像识别
    const evaluation = this.evaluateDrawing();

    this.score += evaluation.points;
    this.updateScore();
    this.showResult(evaluation);
  }

  /**
   * 评估绘画（简化版本）
   * 实际项目中可以集成 TensorFlow.js 进行图像识别
   */
  evaluateDrawing() {
    // 这里使用随机评分作为演示
    // 实际应用应该使用 AI 模型识别图像
    const scores = [
      { success: true, points: 10, message: '画得太棒了！一眼就认出来了！' },
      { success: true, points: 7, message: '画得不错，能看出是什么！' },
      { success: true, points: 5, message: '还可以，勉强能认出来！' },
      { success: false, points: 2, message: '嗯...这是什么来着？' },
    ];

    return scores[Math.floor(Math.random() * scores.length)];
  }

  /**
   * 跳过当前词汇
   */
  skipWord() {
    if (!this.currentWord) {
      alert('请先点击"下一题"开始游戏！');
      return;
    }

    this.showResult({
      success: false,
      points: 0,
      message: `正确答案是: ${this.currentWord}`,
    });
  }

  /**
   * 更新词汇显示
   */
  updateWordDisplay() {
    const wordDisplay = document.getElementById('wordDisplay');
    wordDisplay.textContent = this.currentWord || '点击开始游戏';
    wordDisplay.className = this.currentWord ? 'word active' : 'word';
  }

  /**
   * 更新分数显示
   */
  updateScore() {
    document.getElementById('scoreDisplay').textContent = this.score;
  }

  /**
   * 显示结果
   */
  showResult(evaluation) {
    const resultArea = document.getElementById('resultArea');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    resultTitle.textContent = evaluation.success ? '🎉 恭喜！' : '😅 再试试吧！';
    resultMessage.innerHTML = `
      <p>${evaluation.message}</p>
      <p>词汇是: <strong>${this.currentWord}</strong></p>
      <p>获得分数: <strong>${evaluation.points}</strong> 分</p>
    `;

    resultArea.classList.remove('hidden');
  }

  /**
   * 隐藏结果
   */
  hideResult() {
    document.getElementById('resultArea').classList.add('hidden');
  }
}
