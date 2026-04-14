import { describe, expect, it } from 'vitest';

import { getCommandsPackagesTree } from '@/lib/commands-packages';

function findDirectory(
  node: Awaited<ReturnType<typeof getCommandsPackagesTree>>,
  name: string,
): typeof node | undefined {
  if (node.name === name && node.type === 'directory') {
    return node;
  }

  for (const child of node.children) {
    if (child.type !== 'directory') {
      continue;
    }

    const match = findDirectory(child, name);
    if (match) {
      return match;
    }
  }

  return undefined;
}

describe('media-processing package', () => {
  it('exposes TinyPNG compression as the first media-processing skill', async () => {
    const tree = await getCommandsPackagesTree();
    const packageDir = findDirectory(tree, 'media-processing');

    expect(packageDir).toBeDefined();
    expect(packageDir?.meta).toMatchObject({
      package: 'media-processing',
      category: '媒体处理',
    });

    expect(packageDir?.children.some(child => child.type === 'file' && child.name === 'workflow.md')).toBe(true);
    expect(packageDir?.meta?.skills?.map(skill => skill.id)).toEqual(['media-processing-tinypng']);
    expect(packageDir?.meta?.skills?.[0]?.scripts?.map(script => script.id)).toEqual(['compress-image']);
    expect(packageDir?.meta?.otherDependencies).toMatchObject({
      'tinypng-api': {
        name: 'TinyPNG API',
      },
    });
  });
});
