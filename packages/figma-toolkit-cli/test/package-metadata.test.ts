import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const packageJsonPath = join(import.meta.dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  name: string;
  version: string;
  bin?: Record<string, string>;
  publishConfig?: Record<string, string>;
};

describe('package metadata', () => {
  it('使用个人公开包发布配置', () => {
    expect(packageJson.name).toBe('@klaaay/figma-toolkit-cli');
    expect(packageJson.version).toBe('0.1.0');
    expect(packageJson.bin).toEqual({
      'figma-toolkit': './dist/index.js',
    });
    expect(packageJson.publishConfig).toEqual({
      access: 'public',
    });
  });

  it('README 使用个人包名', () => {
    const readmePath = join(import.meta.dirname, '..', 'README.md');
    const readme = readFileSync(readmePath, 'utf8');

    expect(readme).toContain('# @klaaay/figma-toolkit-cli');
    expect(readme).toContain('pnpm --filter @klaaay/figma-toolkit-cli build');
  });
});
