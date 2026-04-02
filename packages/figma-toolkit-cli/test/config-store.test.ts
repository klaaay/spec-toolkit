import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { clearConfig, getConfigDir, readConfig, writeConfig } from '../src/lib/config-store.js';

describe('config-store', () => {
  let tempConfigDir = '';

  beforeEach(async () => {
    tempConfigDir = await mkdtemp(join(tmpdir(), 'figma-toolkit-cli-'));
    process.env.FIGMA_TOOLKIT_CONFIG_DIR = tempConfigDir;
    await clearConfig();
  });

  afterEach(async () => {
    delete process.env.FIGMA_TOOLKIT_CONFIG_DIR;
    await rm(tempConfigDir, { recursive: true, force: true });
  });

  it('将配置保存到默认配置文件', async () => {
    const configDir = getConfigDir();

    await writeConfig({
      baseUrl: 'http://127.0.0.1:9999',
      figmaToken: 'figd_test_token',
    });

    const config = await readConfig();

    expect(configDir).toBe(tempConfigDir);
    expect(config).toEqual({
      baseUrl: 'http://127.0.0.1:9999',
      figmaToken: 'figd_test_token',
    });
  });

  it('清空配置后返回默认值', async () => {
    await writeConfig({
      baseUrl: 'http://localhost:3000',
      figmaToken: 'figd_test_token',
    });

    await clearConfig();

    expect(await readConfig()).toEqual({});
  });
});
