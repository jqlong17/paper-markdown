#!/usr/bin/env node

/**
 * Paper CLI 安装脚本
 * 优先使用预构建的二进制，否则从源码构建
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BIN_DIR = path.join(__dirname, 'bin');
const BIN_NAME = process.platform === 'win32' ? 'paper.exe' : 'paper';

// 检查是否有 Cargo
function hasCargo() {
  try {
    execSync('cargo --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// 从源码构建
function buildFromSource() {
  console.log('[paper] 从源码构建...');
  console.log('[paper] 这可能需要几分钟...');
  
  try {
    execSync('cargo build --release', {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    const binaryPath = path.join(__dirname, 'target', 'release', 'paper');
    if (fs.existsSync(binaryPath)) {
      return binaryPath;
    }
    throw new Error('构建成功但未找到二进制文件');
  } catch (error) {
    throw new Error(`构建失败: ${error.message}`);
  }
}

// 主函数
function main() {
  console.log('[paper] 正在安装 Paper CLI...');
  
  try {
    // 确保 bin 目录存在
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    
    const bundledBinary = path.join(__dirname, 'target', 'release', 'paper');
    const dest = path.join(BIN_DIR, BIN_NAME);
    let binaryPath = null;
    
    // 1. 检查是否有预构建的二进制（npm pack 时包含）
    if (fs.existsSync(bundledBinary)) {
      console.log('[paper] 使用预构建的二进制文件');
      binaryPath = bundledBinary;
    }
    // 2. 尝试从源码构建（GitHub 安装时）
    else if (hasCargo()) {
      console.log('[paper] 未找到预构建二进制，将从源码构建');
      binaryPath = buildFromSource();
    }
    // 3. 失败
    else {
      console.error('[paper] 错误: 未找到预构建二进制文件，且未安装 Rust');
      console.error('[paper] 解决方案:');
      console.error('[paper]   1. 安装 Rust: https://rustup.rs/');
      console.error('[paper]   2. 然后重新运行安装');
      console.error('[paper]   3. 或从 GitHub Releases 下载预编译版本');
      process.exit(1);
    }
    
    // 复制到 bin 目录
    fs.copyFileSync(binaryPath, dest);
    
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
