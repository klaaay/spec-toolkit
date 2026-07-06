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
  it('exposes translated productivity skills, docs and the upstream source version', async () => {
    const tree = await getCommandsPackagesTree();
    const packageDir = findDirectory(tree, 'mattpocock-skills');
    const docs = packageDir?.meta?.docs as Array<{ id: string; file: string }> | undefined;
    const primarySkillIds =
      packageDir?.meta?.skills
        ?.map(skill => skill.id)
        .filter(id => !id.includes('.references.') && !id.endsWith('.glossary')) ?? [];

    expect(packageDir).toBeDefined();
    expect(packageDir?.meta).toMatchObject({
      package: 'mattpocock-skills',
      category: '效率工具',
      version: 'v1.0.1-106-g66f92b6',
      upstream: {
        repo: 'https://github.com/mattpocock/skills',
        paths: ['skills/productivity', 'skills/engineering', 'docs/productivity', 'docs/engineering'],
        describe: 'v1.0.1-106-g66f92b6',
        latestTag: 'v1.0.1',
        commitsSinceTag: 106,
        sourceVersion: '66f92b61f5b1434a1c7422f6fbd8efc5ee0c0214',
        sourceDate: '2026-07-05',
      },
    });

    expect(packageDir?.children.some(child => child.type === 'file' && child.name === 'workflow.md')).toBe(true);
    expect(primarySkillIds).toEqual([
      'grill-me',
      'grilling',
      'handoff',
      'teach',
      'writing-great-skills',
      'ask-matt',
      'setup-matt-pocock-skills',
      'grill-with-docs',
      'to-prd',
      'to-issues',
      'implement',
      'code-review',
      'triage',
      'tdd',
      'diagnosing-bugs',
      'prototype',
      'research',
      'resolving-merge-conflicts',
      'improve-codebase-architecture',
      'codebase-design',
      'domain-modeling',
    ]);
    expect(packageDir?.meta?.skills?.some(skill => skill.id === 'codebase-design.references.deepening')).toBe(true);
    expect(packageDir?.meta?.skills?.some(skill => skill.id === 'triage.references.agent-brief')).toBe(true);
    expect(packageDir?.meta?.skills?.find(skill => skill.id === 'diagnosing-bugs')?.scripts?.[0]?.id).toBe(
      'hitl-loop-template',
    );
    expect(docs?.map(doc => doc.file)).toEqual([
      'docs/productivity/grill-me.md',
      'docs/productivity/grilling.md',
      'docs/productivity/handoff.md',
      'docs/productivity/teach.md',
      'docs/productivity/writing-great-skills.md',
      'docs/engineering/ask-matt.md',
      'docs/engineering/code-review.md',
      'docs/engineering/codebase-design.md',
      'docs/engineering/diagnosing-bugs.md',
      'docs/engineering/domain-modeling.md',
      'docs/engineering/grill-with-docs.md',
      'docs/engineering/implement.md',
      'docs/engineering/improve-codebase-architecture.md',
      'docs/engineering/prototype.md',
      'docs/engineering/research.md',
      'docs/engineering/resolving-merge-conflicts.md',
      'docs/engineering/setup-matt-pocock-skills.md',
      'docs/engineering/tdd.md',
      'docs/engineering/to-issues.md',
      'docs/engineering/to-prd.md',
      'docs/engineering/triage.md',
    ]);
  });
});
