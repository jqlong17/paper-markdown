#!/usr/bin/env node

/**
 * Paper CLI 安装脚本
 * 下载对应平台的预编译二进制
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = '1.0.0';
const BIN_DIR = path.join(__dirname, 'bin');
const BIN_NAME = 'paper';

// 获取平台信息
function getPlatform() {
  const platform = process.platform;
  const arch = process.arch;
  
  const platformMap = {
    'darwin': 'macos',
    'linux': 'linux',
    'win32': 'windows'
  };
  
  const archMap = {
    'x64': 'x86_64',
    'arm64': 'aarch64'
  };
  
  const platformName = platformMap[platform];
  const archName = archMap[arch];
  
  if (!platformName || !archName) {
    throw new Error(`不支持的平台: ${platform} ${arch}`);
  }
  
  return { platform: platformName, arch: archName };
}

// 获取下载 URL
function getDownloadUrl(platform, arch) {
  const ext = platform === 'windows' ? '.exe' : '';
  return `https://github.com/jqlong17/paper-cli/releases/download/v${VERSION}/paper-${VERSION}-${platform}-${arch}${ext}`;
}

// 下载文件
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // 重定向
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// 主函数
async function main() {
  console.log('[paper] 正在安装 Paper CLI...');
  
  try {
    // 确保 bin 目录存在
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    
    const { platform, arch } = getPlatform();
    console.log(`[paper] 平台: ${platform} ${arch}`);
    
    // 检查是否已有本地构建
    const localBinary = path.join(__dirname, 'target', 'release', BIN_NAME);
    if (fs.existsSync(localBinary)) {
      console.log('[paper] 使用本地构建的二进制文件');
      fs.copyFileSync(localBinary, path.join(BIN_DIR, BIN_NAME));
    } else {
      // 从 GitHub Releases 下载
      const url = getDownloadUrl(platform, arch);
      const dest = path.join(BIN_DIR, BIN_NAME);
      
      console.log(`[paper] 下载: ${url}`);
      await downloadFile(url, dest);
    }
    
    // 设置可执行权限
    if (process.platform !== 'win32') {
      fs.chmodSync(path.join(BIN_DIR, BIN_NAME), 0o755);
    }
    
    console.log('[paper] 安装完成！');
    console.log('[paper] 使用: paper <file.md>');
    
  } catch (error) {
    console.error('[paper] 安装失败:', error.message);
    console.error('[paper] 请手动从源码构建: cargo build --release');
    process.exit(1);
  }
}

main();
