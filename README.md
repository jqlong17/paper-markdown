# Paper CLI

> 极简 Markdown 预览 CLI 工具
> 
> *冷静、有人文感的数字宣纸*

[![GitHub stars](https://img.shields.io/github/stars/jqlong17/paper-cli?style=social)](https://github.com/jqlong17/paper-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ 特性

- 🪟 **独立窗口** - 使用 Electron，无需浏览器
- 🖥️ **多窗口支持** - 同时打开多个 Markdown 文件，终端不阻塞
- 🌐 **浏览器支持** - `--browser` 选项使用系统浏览器
- 📝 **实时读取** - 每次刷新获取最新内容
- 🎨 **极简设计** - 数字宣纸风格，沉浸阅读
- 📊 **完整日志** - 自动记录每次运行的详细日志

---

## 📦 安装

### 方式一：从 GitHub 安装（推荐）

```bash
npm install -g jqlong17/paper-cli
```

### 方式二：从源码安装

```bash
git clone https://github.com/jqlong17/paper-cli.git
cd paper-cli
npm install
npm link
```

---

## 🚀 使用方法

### 打开单个文件

```bash
paper README.md
```

### 同时打开多个文件（终端不阻塞）

```bash
paper doc/guide.md
paper notes/ideas.md
paper README.md

# 三个窗口同时运行，可继续输入命令
```

### 浏览器模式

```bash
# 使用系统浏览器打开
paper README.md --browser

# 简写
paper README.md -b
```

### 查看帮助

```bash
paper --help
```

---

## 🎨 设计哲学

**Paper** 追求"冷静、有人文感"的阅读体验：

| 设计元素 | 实现方式 |
|---------|---------|
| **配色** | 象牙白 `#F9F8F2` + 深炭灰 `#333333` |
| **字体** | Noto Serif SC 衬线体 |
| **动效** | 1.2s 淡入，模拟墨迹晕开 |
| **排版** | 1.8 行高，0.03em 字间距 |
| **沉浸** | 隐藏滚动条，去除生硬边框 |

---

## 📋 终端输出示例

```
╔════════════════════════════════════════════════╗
║              [paper] 数字宣纸                  ║
╠════════════════════════════════════════════════╣
║ 正在为您展开纸张...
║ 文件: README.md
║ 模式: 独立窗口
╠════════════════════════════════════════════════╣
║ 关闭窗口即可退出                               ║
║ 可继续打开其他文件                             ║
╚════════════════════════════════════════════════╝

[paper] 独立窗口已打开 ✓
[paper] 进程 PID: 89556
[paper] 终端已释放，可继续输入命令
```

---

## 📁 目录结构

```
paper-cli/
├── bin/
│   └── paper.js          # CLI 入口
├── scripts/
│   ├── test.js           # 测试脚本
│   └── publish.sh        # 发布脚本
├── examples/
│   └── demo.md           # 示例文档
├── docs/
│   └── PUBLISH.md        # 发布指南
├── test/                 # 测试用例（本地开发）
│   ├── basic.md
│   ├── chinese.md
│   ├── edge-cases.md
│   └── empty.md
├── log/                  # 运行日志（自动生成）
├── package.json
├── README.md
└── LICENSE
```

---

## 🧪 开发测试

```bash
# 克隆项目
git clone https://github.com/jqlong17/paper-cli.git
cd paper-cli

# 安装依赖
npm install

# 运行测试
npm test
# 或
node scripts/test.js

# 查看日志
node scripts/test.js --logs
```

---

## 📊 日志系统

每次运行自动生成日志，保存在 `log/` 目录：

```bash
# 查看最新日志摘要
node scripts/test.js --logs

# 查看日志文件
ls log/
cat log/paper_2024-XX-XX_XXXXXX.log
```

日志包含：
- 启动时间、命令参数
- 文件处理信息
- 错误堆栈
- 会话持续时间

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Q` | 退出应用 |
| `Ctrl+R` | 刷新页面 |
| `Ctrl++` / `Ctrl+-` | 放大/缩小 |

---

## 📦 依赖

- [electron](https://github.com/electron/electron) - 独立窗口
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 渲染
- [open](https://github.com/sindresorhus/open) - 打开浏览器

---

## 📄 License

MIT © [jqlong17](https://github.com/jqlong17)

---

> 在数字世界中，寻找纸张的温度。
