#!/usr/bin/env node

import { createRequire } from 'node:module';

import { registerConfigCommands } from './commands/config.js';
import { registerFigmaCommands } from './commands/figma.js';
import { printError } from './lib/output.js';
import { program } from './utils/getCommandProgram.js';

const require = createRequire(import.meta.url);
const { version = '0.0.0' } = require('../package.json') as { version?: string };

program
  .name('figma-toolkit')
  .description('figma-toolkit 命令行工具，支持本地保存 token 并直接调用 Figma 官方 API')
  .version(`v${version}`, '-v, --version', '显示 CLI 版本信息')
  .helpOption('-h, --help', '显示帮助信息')
  .showHelpAfterError('(使用 --help 查看命令说明)');

registerConfigCommands(program);
registerFigmaCommands(program);

program.parseAsync(process.argv).catch(error => {
  printError(error);
});
