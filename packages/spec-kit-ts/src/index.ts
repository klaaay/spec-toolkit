#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { pullPackageCommand } from './commands/pull-package.js';
import { checkCommand } from './commands/check.js';
import { type InitOptions } from './types/index.js';
import { showBanner, getBanner } from './utils/ui.js';
import { DEFAULT_REGISTRY_URL } from './constants/pull-package.js';
import { PullPackageOptions } from './types/pull-package.js';
import { AGENT_CONFIG } from './constants/index.js';

const program = new Command();
const supportedAgents = Object.keys(AGENT_CONFIG).join(', ');
const require = createRequire(import.meta.url);
const { version: cliVersion = '0.0.0' } = require('../package.json') as {
  version?: string;
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const specKitVersion = readSpecKitVersion();

function readSpecKitVersion(): string | null {
  const versionFilePath = resolve(moduleDir, '../spec-kit-version.txt');

  try {
    const version = readFileSync(versionFilePath, 'utf8').trim();
    return version || null;
  } catch {
    return null;
  }
}

function logVersionInfo(): void {
  if (specKitVersion) {
    console.log(`Spec Kit 模板版本：${specKitVersion}`);
  }
}

program
  .name('spec-ts')
  .description('Specify CLI - Spec-Driven Development 工具包')
  .version(`v${cliVersion}`, '-v, --version', '显示 CLI 版本信息')
  .hook('preAction', () => {
    showBanner();
  });

program.on('option:version', () => {
  logVersionInfo();
});

program.helpOption('-h, --help', '显示帮助信息');
program.addHelpCommand('help [command]', '显示指定命令或所有命令的帮助信息');
program.addHelpText('beforeAll', () => getBanner());

// Init 命令
program
  .command('init [project-name]')
  .description('从本地模板初始化一个新的 Specify 项目')
  .option('--ai <agent>', `AI 助手：${supportedAgents}`)
  .option('--script <type>', '脚本类型：sh 或 ps')
  .option('--ignore-agent-tools', '跳过 AI 代理工具检查（如 Claude Code）')
  .option('--no-git', '跳过 git 仓库初始化')
  .option('--here', '在当前目录初始化项目而不是创建新目录')
  .option('--force', '使用 --here 时强制合并/覆盖（跳过确认）')
  .action(async (projectName: string | undefined, options: InitOptions) => {
    await initCommand(projectName, options);
  });

// Check 命令
program
  .command('check')
  .description('检查所有必需的工具是否已安装')
  .action(async () => {
    await checkCommand();
  });

// Pull Package 命令
program
  .command('pull-package [packageName]')
  .description('从远端拉取结构化命令包，并根据 AI/脚本类型更新本地模板')
  .option('--registry <url>', `命令包源地址（默认 ${DEFAULT_REGISTRY_URL}）`, DEFAULT_REGISTRY_URL)
  .option('--ai <agent>', `AI 助手：${supportedAgents}`)
  .option('--script <type>', '脚本类型：sh 或 ps')
  .option('--project <path>', 'Specify 项目的根目录（默认当前目录）')
  .option('--force', '覆盖已存在的模板与命令文件')
  .action(async (packageName: string | undefined, options: PullPackageOptions) => {
    await pullPackageCommand(packageName, options);
  });

// 解析命令行参数
program.parse();

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
