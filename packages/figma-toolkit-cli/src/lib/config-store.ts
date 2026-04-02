import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

import type { ToolkitConfig } from '../types.js';

export const CONFIG_DIR_NAME = '.figma-toolkit-cli';
export const CONFIG_FILE_NAME = 'config.json';
export const DEFAULT_BASE_URL = 'https://api.figma.com';

export function getConfigDir(): string {
  return process.env.FIGMA_TOOLKIT_CONFIG_DIR || join(homedir(), CONFIG_DIR_NAME);
}

export function getConfigFilePath(): string {
  return join(getConfigDir(), CONFIG_FILE_NAME);
}

export async function readConfig(): Promise<ToolkitConfig> {
  const filePath = getConfigFilePath();

  try {
    await access(filePath);
  } catch {
    return {};
  }

  const content = await readFile(filePath, 'utf8');

  if (!content.trim()) {
    return {};
  }

  return JSON.parse(content) as ToolkitConfig;
}

export async function writeConfig(config: ToolkitConfig): Promise<void> {
  const dir = getConfigDir();
  const filePath = getConfigFilePath();

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

export async function updateConfig(patch: Partial<ToolkitConfig>): Promise<ToolkitConfig> {
  const current = await readConfig();
  const nextConfig = {
    ...current,
    ...patch,
  };

  Object.keys(nextConfig).forEach(key => {
    const typedKey = key as keyof ToolkitConfig;

    if (!nextConfig[typedKey]) {
      delete nextConfig[typedKey];
    }
  });

  await writeConfig(nextConfig);

  return nextConfig;
}

export async function removeConfigKey(key: keyof ToolkitConfig): Promise<ToolkitConfig> {
  const current = await readConfig();

  delete current[key];

  await writeConfig(current);

  return current;
}

export async function clearConfig(): Promise<void> {
  await rm(getConfigDir(), { recursive: true, force: true });
}
