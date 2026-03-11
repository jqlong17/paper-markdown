# Paper CLI 发布指南

本文档指导你如何将 `paper-cli` 发布到 GitHub 和 npm，让用户可以直接安装使用。

---

## 📋 准备材料

在发布前，请确认以下内容：

### 1. 账号准备
- [ ] GitHub 账号（已有）
- [ ] npm 账号（需要在 https://www.npmjs.com/signup 注册）

### 2. 项目信息完善
- [ ] `package.json` 中的 `name` 字段：`paper-cli`
- [ ] `package.json` 中的 `version` 字段（首次发布建议用 `1.0.0`）
- [ ] `package.json` 中的 `author` 字段（添加你的名字和邮箱）
- [ ] `README.md` 中的 `Your Name` 替换为你的名字
- [ ] `README.md` 中的 GitHub 链接更新为你的仓库地址
- [ ] `LICENSE` 文件中的版权信息（可选）

---

## 🚀 第一步：推送到 GitHub

### 1. 在 GitHub 创建新仓库

打开 https://github.com/new 创建新仓库：
- **Repository name**: `paper-cli`
- **Description**: 极简 Markdown 预览 CLI 工具
- **Visibility**: Public（推荐，方便其他人使用）
- **Initialize**: 不要勾选任何选项（我们已经有本地仓库了）

### 2. 推送本地代码

使用 GitHub CLI（你已配置过）：

```bash
# 创建仓库并推送（在 paper-cli 目录内执行）
cd ~/project/paper-cli

# 方式一：使用 GitHub CLI（推荐）
gh repo create paper-cli --public --source=. --remote=origin --push

# 方式二：手动添加远程仓库
# git remote add origin https://github.com/YOUR_USERNAME/paper-cli.git
# git branch -M main
# git push -u origin main
```

### 3. 验证推送

打开 `https://github.com/YOUR_USERNAME/paper-cli` 查看代码是否已上传。

---

## 📦 第二步：发布到 npm

### 1. 登录 npm

```bash
# 在终端登录 npm
npm login

# 输入你的用户名、密码和邮箱
# 会提示你输入 OTP（如果开启了两步验证）
```

### 2. 检查包内容

发布前检查一下哪些文件会被包含：

```bash
# 查看将会发布的文件列表
npm pack --dry-run
```

确保包含：
- ✅ paper.js
- ✅ README.md
- ✅ LICENSE
- ✅ package.json
- ❌ node_modules/（被 .gitignore 排除了）
- ❌ log/（被 .gitignore 排除了）

### 3. 发布到 npm

```bash
# 发布公开包（首次发布需要用 --access=public）
npm publish --access=public
```

### 4. 验证发布

打开 `https://www.npmjs.com/package/paper-cli` 查看是否发布成功。

---

## 🔄 后续更新流程

当你需要发布新版本时：

### 1. 更新版本号

```bash
# 更新版本号（自动修改 package.json）
npm version patch   # 1.0.0 -> 1.0.1（小修复）
npm version minor   # 1.0.0 -> 1.1.0（新功能）
npm version major   # 1.0.0 -> 2.0.0（重大更新）
```

### 2. 推送到 GitHub

```bash
git push origin main
git push origin --tags  # 推送版本标签
```

### 3. 发布到 npm

```bash
npm publish
```

---

## 🧪 本地测试发布

在正式发布前，可以先本地测试：

```bash
# 方式一：本地链接测试
npm link
paper demo.md  # 测试全局命令是否可用

# 方式二：本地安装测试
npm install -g .
paper demo.md
```

---

## ⚠️ 常见问题

### 1. 包名已被占用

如果 `paper-cli` 已被占用，你可以：
- 换一个名字，如 `@yourusername/paper-cli`
- 联系原包所有者
- 换一个独特的名字

### 2. Electron 相关警告

由于 `paper-cli` 依赖 Electron，体积较大（约 150MB），首次安装可能需要几分钟。这是正常的。

### 3. 权限问题

如果遇到权限错误：

```bash
# macOS/Linux
sudo chown -R $(whoami) ~/.npm

# 或使用 nvm 管理 Node.js 版本
```

### 4. npm 2FA

如果开启了双因素认证，发布时需要输入 OTP：

```bash
npm publish --otp=123456
```

---

## 📊 发布后的效果

成功发布后，用户可以：

```bash
# 直接安装使用
npm install -g paper-cli
paper demo.md

# 或使用 npx
npx paper-cli demo.md
```

---

## 📝 发布清单

发布前最后检查：

- [ ] GitHub 仓库已创建并推送
- [ ] npm 账号已注册并登录
- [ ] package.json 信息完整正确
- [ ] README.md 包含安装和使用说明
- [ ] LICENSE 文件存在
- [ ] 本地测试通过（`paper demo.md` 正常工作）
- [ ] npm pack --dry-run 输出正确
- [ ] npm publish 成功
- [ ] npm 页面显示正常

---

## 💡 建议

1. **README 很重要**：这是用户第一眼看到的内容，确保有清晰的安装和使用说明
2. **添加示例截图**：可以在 README 中添加工具运行截图，更直观
3. **设置关键词**：package.json 中的 keywords 影响 npm 搜索排名
4. **版本号规范**：遵循语义化版本（Semantic Versioning）

祝发布顺利！🎉
