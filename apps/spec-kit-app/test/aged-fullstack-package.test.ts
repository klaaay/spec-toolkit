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

describe('aged-fullstack package', () => {
  it('exposes package metadata, workflow and a single aged-fullstack-development skill with references', async () => {
    const tree = await getCommandsPackagesTree();
    const packageDir = findDirectory(tree, 'aged-fullstack');
    const primarySkillIds =
      packageDir?.meta?.skills?.map(skill => skill.id).filter(id => !id.includes('.references.')) ?? [];
    const referenceSkillIds =
      packageDir?.meta?.skills?.map(skill => skill.id).filter(id => id.includes('.references.')) ?? [];

    expect(packageDir).toBeDefined();
    expect(packageDir?.meta).toMatchObject({
      package: 'aged-fullstack',
      category: '全栈开发',
    });

    expect(packageDir?.children.some(child => child.type === 'file' && child.name === 'workflow.md')).toBe(true);
    expect(primarySkillIds).toEqual(['aged-fullstack-development']);
    expect(referenceSkillIds).toEqual([
      'aged-fullstack-development.references.template-facts',
      'aged-fullstack-development.references.recommended-rules',
      'aged-fullstack-development.references.bootstrap',
      'aged-fullstack-development.references.backend-module',
      'aged-fullstack-development.references.frontend-feature',
      'aged-fullstack-development.references.integration-gate',
    ]);
  });
});
