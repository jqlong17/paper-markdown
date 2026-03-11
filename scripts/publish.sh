#!/bin/bash

# Paper CLI 发布脚本
# 一键完成 GitHub 推送和 npm 发布

echo "🚀 Paper CLI 发布助手"
echo "====================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在 paper-cli 目录内运行此脚本${NC}"
    exit 1
fi

# 检查 git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  初始化 Git 仓库...${NC}"
    git init
    git add .
    git commit -m "feat: initial release"
fi

# 1. 检查 GitHub CLI
echo ""
echo "📋 检查 GitHub CLI..."
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  未安装 GitHub CLI${NC}"
    echo "   安装命令: brew install gh"
    echo "   安装后运行: gh auth login"
    exit 1
fi

# 检查 gh 登录状态
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  请先登录 GitHub CLI${NC}"
    echo "   运行: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI 已配置${NC}"

# 2. 检查 npm 登录
echo ""
echo "📋 检查 npm 登录状态..."
if ! npm whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  请先登录 npm${NC}"
    echo "   运行: npm login"
    exit 1
fi

echo -e "${GREEN}✓ npm 已登录: $(npm whoami)${NC}"

# 3. 显示当前信息
echo ""
echo "📦 当前包信息:"
echo "   名称: $(cat package.json | grep '"name"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')"
echo "   版本: $(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')"
echo "   作者: $(cat package.json | grep '"author"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')"

echo ""
read -p "是否继续发布? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

# 4. 推送到 GitHub
echo ""
echo "🌐 推送到 GitHub..."

# 检查远程仓库
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}创建 GitHub 仓库...${NC}"
    gh repo create paper-cli --public --source=. --remote=origin --push
else
    git push origin main
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 已推送到 GitHub${NC}"
else
    echo -e "${RED}❌ GitHub 推送失败${NC}"
    exit 1
fi

# 5. 发布到 npm
echo ""
echo "📤 发布到 npm..."
echo "   正在检查包内容..."
npm pack --dry-run

echo ""
read -p "确认发布到 npm? (y/N): " confirm_npm
if [[ ! $confirm_npm =~ ^[Yy]$ ]]; then
    echo "已取消 npm 发布"
    exit 0
fi

npm publish --access=public

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 发布成功!${NC}"
    echo ""
    echo "📍 访问地址:"
    echo "   GitHub: https://github.com/$(gh api user -q .login)/paper-cli"
    echo "   npm:    https://www.npmjs.com/package/paper-cli"
    echo ""
    echo "📥 用户现在可以运行:"
    echo "   npm install -g paper-cli"
    echo "   paper demo.md"
else
    echo -e "${RED}❌ npm 发布失败${NC}"
    exit 1
fi
