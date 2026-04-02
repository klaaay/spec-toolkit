import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadFigmaImages } from '../src/lib/image-download.js';

describe('image-download', () => {
  let tempDir = '';

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('将图片下载到指定目录并按节点 ID 命名', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'figma-toolkit-images-'));
    const downloader = vi.fn().mockResolvedValue(Buffer.from('svg-content'));

    const result = await downloadFigmaImages({
      fileKey: 'Bqh5yKWAdgxfhVR7FkqHzW',
      outputDir: tempDir,
      format: 'svg',
      images: {
        '699:1625': 'https://example.com/a.svg',
        '699:1626': 'https://example.com/b.svg',
      },
      downloader,
    });

    expect(result.savedFiles).toEqual([join(tempDir, '699-1625.svg'), join(tempDir, '699-1626.svg')]);
    expect(result.skippedNodeIds).toEqual([]);
    expect(await readFile(join(tempDir, '699-1625.svg'), 'utf8')).toBe('svg-content');
    expect(downloader).toHaveBeenCalledTimes(2);
  });

  it('跳过没有下载地址的节点', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'figma-toolkit-images-'));

    const result = await downloadFigmaImages({
      fileKey: 'Bqh5yKWAdgxfhVR7FkqHzW',
      outputDir: tempDir,
      format: 'png',
      images: {
        '699:1625': null,
      },
      downloader: vi.fn(),
    });

    expect(result.savedFiles).toEqual([]);
    expect(result.skippedNodeIds).toEqual(['699:1625']);
  });
});
