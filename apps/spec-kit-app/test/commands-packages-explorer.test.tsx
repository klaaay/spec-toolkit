import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommandsPackagesExplorer } from '@/components/CommandsPackages/Explorer';
import type { PackageTree } from '@/lib/commands-packages';

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');

  return {
    ...actual,
    EllipsisVertical: (props: Record<string, unknown>) => <svg data-icon="ellipsis-vertical" {...props} />,
  };
});

const tree: PackageTree = {
  type: 'directory',
  name: 'commands-packages',
  path: '',
  children: [
    {
      type: 'directory',
      name: 'frontend-contract',
      path: 'frontend-contract',
      meta: {
        package: 'frontend-contract',
        skills: [],
      },
      children: [],
    },
  ],
};

describe('CommandsPackagesExplorer', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => '' }));
  });

  it('shows an overflow menu affordance with the updated helper copy', () => {
    render(<CommandsPackagesExplorer root={tree} />);

    expect(screen.getByText('使用右上角菜单查看详情和操作')).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: '查看命令包操作' });
    expect(menuButton.querySelector('[data-icon="ellipsis-vertical"]')).not.toBeNull();
  });
});
