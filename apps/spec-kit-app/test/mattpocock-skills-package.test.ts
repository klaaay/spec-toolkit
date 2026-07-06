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

describe('mattpocock-skills package', () => {
  it('exposes translated productivity skills and remembers the upstream source version', async () => {
    const tree = await getCommandsPackagesTree();
    const packageDir = findDirectory(tree, 'mattpocock-skills');
    const primarySkillIds =
      packageDir?.meta?.skills
        ?.map(skill => skill.id)
        .filter(id => !id.includes('.references.') && !id.endsWith('.glossary')) ?? [];

    expect(packageDir).toBeDefined();
    expect(packageDir?.meta).toMatchObject({
      package: 'mattpocock-skills',
      category: '效率工具',
      upstream: {
        repo: 'https://github.com/mattpocock/skills',
        path: 'skills/productivity',
        sourceVersion: '66f92b61f5b1434a1c7422f6fbd8efc5ee0c0214',
      },
    });

    expect(packageDir?.children.some(child => child.type === 'file' && child.name === 'workflow.md')).toBe(true);
    expect(primarySkillIds).toEqual(['grill-me', 'grilling', 'handoff', 'teach', 'writing-great-skills']);
  });
});
