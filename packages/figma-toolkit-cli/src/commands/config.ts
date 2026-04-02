import type { Command } from 'commander';

import { getConfigFilePath, readConfig, removeConfigKey, updateConfig } from '../lib/config-store.js';
import { maskToken } from '../lib/runtime-config.js';
import { printJson, printSuccess } from '../lib/output.js';

export function registerConfigCommands(program: Command): void {
  const configCommand = program.command('config').description('管理 figma-toolkit 本地配置');

  configCommand
    .command('set-token <token>')
    .description('保存 Figma Token 到本地配置')
    .action(async (token: string) => {
      await updateConfig({ figmaToken: token.trim() });
      printSuccess(`已保存 Figma Token 到 ${getConfigFilePath()}`);
    });

  configCommand
    .command('set-base-url <url>')
    .description('保存 Figma API 服务地址到本地配置')
    .action(async (url: string) => {
      await updateConfig({ baseUrl: url.trim() });
      printSuccess(`已保存 baseUrl 到 ${getConfigFilePath()}`);
    });

  configCommand
    .command('remove <key>')
    .description('删除指定配置，支持 figmaToken、baseUrl')
    .action(async (key: 'figmaToken' | 'baseUrl') => {
      await removeConfigKey(key);
      printSuccess(`已删除配置 ${key}`);
    });

  configCommand
    .command('list')
    .description('查看当前配置')
    .action(async () => {
      const config = await readConfig();
      printJson({
        ...config,
        figmaToken: maskToken(config.figmaToken),
      });
    });

  configCommand
    .command('path')
    .description('输出配置文件路径')
    .action(() => {
      printSuccess(getConfigFilePath());
    });
}
