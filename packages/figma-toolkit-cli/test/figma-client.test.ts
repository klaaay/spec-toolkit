import { describe, expect, it, vi } from 'vitest';

import { createFigmaToolkitClient } from '../src/lib/figma-client.js';

describe('figma-client', () => {
  it('请求时拼接 baseUrl、路径和 query，并注入 X-Figma-Token', async () => {
    const request = vi.fn().mockResolvedValue({
      data: { success: true },
    });

    const client = createFigmaToolkitClient({
      baseUrl: 'https://api.figma.com/',
      figmaToken: 'figd_test_token',
      request,
    });

    await client.getFileNodes('file_key_123', {
      ids: '1:2,1:3',
      depth: 2,
      geometry: 'paths',
    });

    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.figma.com/v1/files/file_key_123/nodes',
      headers: {
        'X-Figma-Token': 'figd_test_token',
      },
      params: {
        ids: '1:2,1:3',
        depth: 2,
        geometry: 'paths',
      },
    });
  });

  it('未提供 token 时直接抛出清晰错误', async () => {
    const client = createFigmaToolkitClient({
      baseUrl: 'https://api.figma.com',
      request: vi.fn(),
    });

    await expect(client.getImageFills('file_key_123')).rejects.toThrow('未配置 Figma Token');
  });
});
