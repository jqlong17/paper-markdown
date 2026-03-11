# Paper CLI

> 极速 Markdown 预览 CLI 工具
> 
> *冷静、有人文感的数字宣纸*

[![Rust](https://img.shields.io/badge/Rust-1.70%2B-orange.svg)](https://www.rust-lang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ 特性

- 🚀 **极速启动** - Rust 原生性能，启动时间 < 1秒
- 🪟 **独立窗口** - 使用系统 WebView，无浏览器 UI
- 📝 **实时预览** - 文件修改自动刷新
- 🎨 **数字宣纸** - 优雅的排版风格
- 💾 **内存优化** - 内存占用仅 ~20MB（对比 Electron ~150MB）

---

## 📦 安装

### 方式一：Cargo 安装（推荐）

```bash
cargo install paper-markdown
```

### 方式二：从源码构建

```bash
git clone https://github.com/jqlong17/paper-cli.git
cd paper-cli
cargo build --release
```

### 方式三：npm 安装

```bash
# 从 GitHub 安装（推荐）
npm install -g jqlong17/paper-cli

# 或使用 npx（无需安装）
npx paper-cli demo.md
```

**注意**: npm 安装会自动检测平台并下载/构建对应的二进制文件。如果本地没有 Rust 环境，会从 GitHub Releases 下载预编译版本。

---

## 🚀 使用方法

```bash
# 打开 Markdown 文件
paper demo.md

# 查看帮助
paper --help

# 查看版本
paper --version
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
| **沉浸** | 隐藏滚动条，独立窗口 |

---

## 📊 性能对比

| 方案 | 内存占用 | 启动时间 | 包体积 |
|------|---------|----------|--------|
| **Paper CLI** (Rust) | **~20MB** | **<1s** | **~5MB** |
| Electron | ~150MB | ~3s | ~150MB |
| Node.js + 浏览器 | ~50MB | ~2s | ~80MB |

---

## 🛠️ 技术栈

- **后端**: Rust
- **HTTP 服务器**: warp
- **Markdown 解析**: pulldown-cmark
- **窗口管理**: tao
- **WebView**: wry
- **前端**: 纯 HTML/CSS

---

## 📄 License

MIT © [jqlong17](https://github.com/jqlong17)

---

> 在数字世界中，寻找纸张的温度。
