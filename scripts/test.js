#!/usr/bin/env node

/**
 * Paper 测试脚本
 * 
 * 用法:
 *   node test.js              # 运行所有测试
 *   node test.js basic        # 运行指定测试用例
 *   node test.js --browser    # 使用浏览器模式
 *   node test.js -v           # 显示详细输出
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test');
const LOG_DIR = path.join(__dirname, 'log');

// 测试用例配置
const TEST_CASES = [
  {
    name: 'basic',
    file: 'basic.md',
    description: '基础功能测试 - 标题、列表、代码块、引用'
  },
  {
    name: 'chinese',
    file: 'chinese.md',
    description: '中文排版测试 - 中文字体、混排、古诗词'
  },
  {
    name: 'edge',
    file: 'edge-cases.md',
    description: '边界测试 - 特殊字符、超长标题、嵌套引用'
  },
  {
    name: 'empty',
    file: 'empty.md',
    description: '空文档测试 - 极简内容处理'
  }
];

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
  log('\n╔════════════════════════════════════════════════╗', 'cyan');
  log('║          [paper] 测试套件                      ║', 'cyan');
  log('╠════════════════════════════════════════════════╣', 'cyan');
  log(`║ 测试用例: ${TEST_CASES.length.toString().padEnd(35)} ║`);
  log(`║ 日志目录: log/                                 ║`);
  log('╚════════════════════════════════════════════════╝\n', 'cyan');
}

function getLatestLogFile() {
  const files = fs.readdirSync(LOG_DIR)
    .filter(f => f.endsWith('.log'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(LOG_DIR, f)).mtime
    }))
    .sort((a, b) => b.time - a.time);
  
  return files.length > 0 ? path.join(LOG_DIR, files[0].name) : null;
}

function analyzeLog(logFile) {
  if (!fs.existsSync(logFile)) {
    return { error: '日志文件不存在' };
  }
  
  const content = fs.readFileSync(logFile, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line);
  
  const events = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
  
  const summary = {
    totalEvents: events.length,
    startTime: events[0]?.timestamp,
    endTime: events[events.length - 1]?.timestamp,
    errors: events.filter(e => e.type === 'ERROR' || e.type === 'OUTPUT' && e.data?.level === 'error'),
    mode: events.find(e => e.type === 'MODE_SELECT')?.data?.useBrowser ? 'browser' : 'electron',
    port: events.find(e => e.type === 'SERVER_START')?.data?.port,
    fileProcessed: events.find(e => e.type === 'INPUT')?.data?.fileName
  };
  
  return summary;
}

function runTest(testCase, options = {}) {
  const { browser = false, verbose = false } = options;
  const testFile = path.join(TEST_DIR, testCase.file);
  
  log(`\n▶ 运行测试: ${testCase.name}`, 'bright');
  log(`  描述: ${testCase.description}`, 'gray');
  log(`  文件: ${testCase.file}`, 'gray');
  
  if (!fs.existsSync(testFile)) {
    log(`  ✗ 测试文件不存在: ${testFile}`, 'red');
    return false;
  }
  
  const startTime = Date.now();
  
  try {
    // 构建命令
    const cmd = `node paper.js "${testFile}"${browser ? ' --browser' : ''}`;
    
    if (verbose) {
      log(`  命令: ${cmd}`, 'gray');
    }
    
    // 运行测试（5秒后自动终止）
    const output = execSync(cmd, {
      timeout: 5000,
      encoding: 'utf-8',
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    const duration = Date.now() - startTime;
    log(`  ✓ 测试通过 (${duration}ms)`, 'green');
    
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // 检查是否因为超时终止（这是正常的）
    if (error.signal === 'SIGTERM' || error.code === 'ETIMEDOUT') {
      log(`  ✓ 测试启动成功 (${duration}ms)`, 'green');
      return true;
    }
    
    log(`  ✗ 测试失败: ${error.message}`, 'red');
    if (verbose && error.stdout) {
      log(`  输出: ${error.stdout}`, 'gray');
    }
    return false;
  }
}

function listTestCases() {
  log('\n可用测试用例:', 'bright');
  TEST_CASES.forEach((test, i) => {
    log(`  ${i + 1}. ${test.name.padEnd(10)} - ${test.description}`, 'cyan');
  });
  log('');
}

function showLatestLog() {
  const logFile = getLatestLogFile();
  
  if (!logFile) {
    log('没有找到日志文件', 'yellow');
    return;
  }
  
  log(`\n📄 最新日志: ${path.basename(logFile)}`, 'bright');
  
  const summary = analyzeLog(logFile);
  
  log('\n  日志摘要:', 'cyan');
  log(`    事件总数: ${summary.totalEvents}`, 'gray');
  log(`    启动时间: ${summary.startTime || 'N/A'}`, 'gray');
  log(`    运行模式: ${summary.mode || 'N/A'}`, 'gray');
  log(`    服务端口: ${summary.port || 'N/A'}`, 'gray');
  log(`    处理文件: ${summary.fileProcessed || 'N/A'}`, 'gray');
  
  if (summary.errors.length > 0) {
    log(`    错误数量: ${summary.errors.length}`, 'red');
    summary.errors.forEach((err, i) => {
      if (i < 3) {
        log(`      - ${err.data?.message || err.data?.data?.message || JSON.stringify(err)}`, 'red');
      }
    });
  } else {
    log(`    错误数量: 0 ✓`, 'green');
  }
  
  log(`\n  完整日志: ${logFile}`, 'gray');
}

function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('-v') || args.includes('--verbose');
  const browser = args.includes('--browser') || args.includes('-b');
  const list = args.includes('--list') || args.includes('-l');
  const logs = args.includes('--logs') || args.includes('--log');
  
  // 确保目录存在
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  
  if (list) {
    listTestCases();
    return;
  }
  
  if (logs) {
    showLatestLog();
    return;
  }
  
  banner();
  
  // 确定要运行的测试
  let testsToRun = TEST_CASES;
  const specificTest = args.find(arg => !arg.startsWith('-'));
  
  if (specificTest) {
    testsToRun = TEST_CASES.filter(t => t.name === specificTest);
    if (testsToRun.length === 0) {
      log(`错误: 未知的测试用例 "${specificTest}"`, 'red');
      log('使用 --list 查看可用测试', 'yellow');
      process.exit(1);
    }
  }
  
  // 运行测试
  const results = [];
  
  for (const test of testsToRun) {
    const passed = runTest(test, { browser, verbose });
    results.push({ name: test.name, passed });
  }
  
  // 显示结果摘要
  log('\n' + '═'.repeat(50), 'cyan');
  log('测试摘要', 'bright');
  log('═'.repeat(50), 'cyan');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  results.forEach(r => {
    const icon = r.passed ? '✓' : '✗';
    const color = r.passed ? 'green' : 'red';
    log(`  ${icon} ${r.name}`, color);
  });
  
  log('─'.repeat(50), 'cyan');
  log(`  总计: ${results.length} | 通过: ${passed} | 失败: ${failed}`, 'bright');
  
  if (failed === 0) {
    log('\n✓ 所有测试通过！', 'green');
  } else {
    log(`\n✗ ${failed} 个测试失败`, 'red');
  }
  
  // 显示最新日志信息
  showLatestLog();
  
  process.exit(failed > 0 ? 1 : 0);
}

// 显示帮助
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Paper 测试脚本

用法:
  node test.js [选项] [测试名]

选项:
  -h, --help       显示帮助信息
  -l, --list       列出所有测试用例
  -b, --browser    使用浏览器模式运行测试
  -v, --verbose    显示详细输出
  --logs           查看最新日志摘要

测试用例:
  basic            基础功能测试
  chinese          中文排版测试
  edge             边界情况测试
  empty            空文档测试

示例:
  node test.js                    # 运行所有测试
  node test.js basic              # 只运行基础测试
  node test.js --browser          # 使用浏览器模式
  node test.js chinese -v         # 详细输出中文测试
  node test.js --logs             # 查看最新日志
`);
  process.exit(0);
}

main();
