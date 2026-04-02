import { describe, expect, it } from 'vitest';

import { parseFigmaInput, resolveFigmaRequestTarget } from '../src/lib/figma-input.js';

describe('figma-input', () => {
  it('可以从 Figma 链接中解析 fileKey 和 node-id', () => {
    const result = parseFigmaInput('https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev');

    expect(result).toEqual({
      fileKey: 'Bqh5yKWAdgxfhVR7FkqHzW',
      ids: '699:1625',
      isLink: true,
    });
  });

  it('显式传入 --ids 时优先级高于链接中的 node-id', () => {
    const result = resolveFigmaRequestTarget({
      input: 'https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?node-id=699-1625&m=dev',
      ids: '100:200',
      requireIds: true,
    });

    expect(result).toEqual({
      fileKey: 'Bqh5yKWAdgxfhVR7FkqHzW',
      ids: '100:200',
      isLink: true,
    });
  });

  it('需要 ids 的命令在链接和参数都缺失 node-id 时抛错', () => {
    expect(() =>
      resolveFigmaRequestTarget({
        input: 'https://www.figma.com/design/Bqh5yKWAdgxfhVR7FkqHzW/demo?m=dev',
        requireIds: true,
      }),
    ).toThrow('未提供节点 ID，请传 --ids 或直接传带 node-id 的 Figma 链接');
  });
});
