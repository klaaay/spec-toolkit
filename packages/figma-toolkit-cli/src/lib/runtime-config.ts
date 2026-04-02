import type { CommandRuntimeOptions, ToolkitConfig } from '../types.js';
import { DEFAULT_BASE_URL, readConfig } from './config-store.js';

export async function resolveRuntimeConfig(options: CommandRuntimeOptions = {}): Promise<ToolkitConfig> {
  const config = await readConfig();

  return {
    baseUrl: options.baseUrl || process.env.FIGMA_TOOLKIT_BASE_URL || config.baseUrl || DEFAULT_BASE_URL,
    figmaToken: options.token || process.env.FIGMA_TOOLKIT_FIGMA_TOKEN || process.env.FIGMA_TOKEN || config.figmaToken,
  };
}

export function maskToken(token?: string): string | undefined {
  if (!token) {
    return undefined;
  }

  if (token.length <= 8) {
    return '********';
  }

  return `${token.slice(0, 4)}********${token.slice(-4)}`;
}
