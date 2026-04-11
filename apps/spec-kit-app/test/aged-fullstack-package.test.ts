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
  it('exposes package metadata, workflow and five aged-prefixed skills', async () => {
    const tree = await getCommandsPackagesTree();
    const packageDir = findDirectory(tree, 'aged-fullstack');
    const primarySkillIds =
      packageDir?.meta?.skills?.map(skill => skill.id).filter(id => !id.includes('.references.')) ?? [];

    expect(packageDir).toBeDefined();
    expect(packageDir?.meta).toMatchObject({
      package: 'aged-fullstack',
      category: '全栈开发',
    });

    expect(packageDir?.children.some(child => child.type === 'file' && child.name === 'workflow.md')).toBe(true);
    expect(primarySkillIds).toEqual([
      'aged-fullstack-development',
      'aged-fullstack-bootstrap',
      'aged-fullstack-backend-module',
      'aged-fullstack-frontend-feature',
      'aged-fullstack-integration-gate',
    ]);
    expect(packageDir?.meta?.skills?.map(skill => skill.id)).toContain(
      'aged-fullstack-development.references.template-facts',
    );
    expect(packageDir?.meta?.skills?.map(skill => skill.id)).toContain(
      'aged-fullstack-development.references.recommended-rules',
    );
  });
});
