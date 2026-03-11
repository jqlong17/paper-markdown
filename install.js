#!/usr/bin/env node

/**
 * Paper CLI 安装脚本
 * 优先使用 npm 包中包含的二进制文件
 */

const fs = require('fs');
const path = require('path');

const BIN_DIR = path.join(__dirname, 'bin');
const BIN_NAME = process.platform === 'win32' ? 'paper.exe' : 'paper';

// 主函数
function main() {
  console.log('[paper] 正在安装 Paper CLI...');
  
  try {
    // 确保 bin 目录存在
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    
    // 检查 npm 包中是否包含预构建的二进制
    const bundledBinary = path.join(__dirname, 'target', 'release', 'paper');
    const dest = path.join(BIN_DIR, BIN_NAME);
    
    if (fs.existsSync(bundledBinary)) {
      console.log('[paper] 使用预构建的二进制文件');
      fs.copyFileSync(bundledBinary, dest);
    } else {
      console.error('[paper] 错误: 未找到预构建的二进制文件');
      console.error('[paper] 请从 GitHub Releases 手动下载，或使用 cargo 安装:');
      console.error('[paper]   cargo install paper-cli');
      process.exit(1);
    }
    
    // 设置可执行权限
    if (process.platform !== 'win32') {
      fs.chmodSync(dest, 0o755);
    }
    
    console.log('[paper] 安装完成！');
    console.log('[paper] 使用: paper <file.md>');
    
  } catch (error) {
    console.error('[paper] 安装失败:', error.message);
    process.exit(1);
  }
}

main();
