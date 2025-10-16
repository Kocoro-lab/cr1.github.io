# 你画我猜 🎨

一个简单有趣的 Web 小游戏 - 根据提示词画出图案，看看能得多少分！

[![Deploy Status](https://github.com/cr1/cr1.github.io/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/cr1/cr1.github.io/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 游戏简介

"你画我猜"是一款完全基于前端技术的画图游戏，无需后端服务支持。游戏会给出一个词汇，玩家需要在画板上画出对应的图案，系统会对绘画进行评分。

**在线体验**: [https://cr1.github.io](https://cr1.github.io)

### 特点

- 🎮 **纯前端实现** - 无需后端服务器，完全在浏览器本地运行
- 🎨 **Canvas 绘图** - 基于 HTML5 Canvas，流畅的绘图体验
- 📱 **响应式设计** - 支持桌面和移动设备
- 🔒 **隐私保护** - 所有数据仅在本地，不上传服务器
- ⚡ **快速加载** - 使用 Vite 构建，优化加载速度
- 🎯 **简单易玩** - 适合所有年龄段

## 项目结构

```
cr1.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 部署配置
├── docs/                      # 项目文档目录
│   ├── 开发文档.md
│   ├── 使用说明.md
│   └── 技术设计.md
├── public/                    # 静态资源目录
├── src/                       # 源代码目录
│   ├── components/           # 组件目录
│   │   └── DrawingCanvas.js  # 画板组件
│   ├── game/                 # 游戏逻辑目录
│   │   └── GameManager.js    # 游戏管理器
│   ├── styles/               # 样式目录
│   │   └── main.css          # 主样式文件
│   └── main.js               # 主入口文件
├── .editorconfig             # 编辑器配置
├── .prettierrc               # 代码格式化配置
├── .prettierignore           # Prettier 忽略文件
├── eslint.config.js          # ESLint 配置
├── .gitignore                # Git 忽略文件
├── index.html                # HTML 入口文件
├── package.json              # 项目配置文件
├── vite.config.js            # Vite 构建配置
└── README.md                 # 项目说明文件
```

## 代码规范

### 编辑器配置 (.editorconfig)
- UTF-8 编码
- LF 换行符
- 2 空格缩进
- 文件末尾保留空行
- 自动删除行尾空格

### 代码格式化 (Prettier)
- 使用单引号
- 保留分号
- 行宽限制 100 字符
- ES5 风格尾逗号
- 箭头函数参数无括号（单参数时）

### 代码检查 (ESLint)
- ES 最新语法
- 模块化开发
- 禁止使用 var，推荐 const
- 未使用变量警告
- 优先使用箭头函数和模板字符串

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 技术栈

- **构建工具**: Vite
- **代码检查**: ESLint 9+
- **代码格式化**: Prettier
- **开发语言**: JavaScript (ES6+)
- **图形渲染**: Canvas API / WebGL (根据游戏需求)

## 开始开发

1. 克隆项目并安装依赖
2. 运行 `npm run dev` 启动开发服务器
3. 遵循代码规范进行开发
4. 提交前运行 `npm run lint` 和 `npm run format`