# Commands Package Menu Icon 实现计划

> **对于 agent 型执行者：** 必需子 skill：优先使用 `superpowers-subagent-driven-development`，否则使用 `superpowers-executing-plans` 逐任务实施本计划。所有步骤使用 `- [ ]` 复选框格式追踪。

**目标：** 将命令包卡片右上角入口从“信息图标”调整为“更多操作菜单”语义，并同步辅助文案。

**架构：** 在 `CommandsPackagesExplorer` 内保留现有菜单状态与交互逻辑，只修改菜单触发器的图标和提示文案。先为该组件补一个最小渲染测试，锁定“菜单入口语义”和“辅助文案”这两个行为，再做最小实现。

**技术栈：** Next.js 16、React 19、TypeScript、`lucide-react`、Vitest、Testing Library

---

### 任务 1: 为命令包卡片补最小菜单语义测试

**文件：**
- 修改：`apps/spec-kit-app/package.json`
- 创建：`apps/spec-kit-app/vitest.config.ts`
- 创建：`apps/spec-kit-app/test/setup.ts`
- 创建：`apps/spec-kit-app/test/commands-packages-explorer.test.tsx`

- [ ] **步骤 1: 为 `spec-kit-app` 增加测试脚本和测试依赖**

在 `apps/spec-kit-app/package.json` 中补充：

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@vitejs/plugin-react": "^5.0.4",
    "jsdom": "^26.1.0",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **步骤 2: 添加 Vitest 配置**

创建 `apps/spec-kit-app/vitest.config.ts`：

```ts
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
```

- [ ] **步骤 3: 添加测试初始化文件**

创建 `apps/spec-kit-app/test/setup.ts`：

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **步骤 4: 先写失败测试，锁定新的菜单语义**

创建 `apps/spec-kit-app/test/commands-packages-explorer.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommandsPackagesExplorer } from '@/components/CommandsPackages/Explorer';
import type { PackageTree } from '@/lib/commands-packages';

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');

  return {
    ...actual,
    EllipsisVertical: (props: Record<string, unknown>) => <svg data-icon="ellipsis-vertical" {...props} />,
    FileTextIcon: (props: Record<string, unknown>) => <svg data-icon="file-text" {...props} />,
    FolderIcon: (props: Record<string, unknown>) => <svg data-icon="folder" {...props} />,
  };
});

const tree: PackageTree = {
  type: 'directory',
  name: 'root',
  path: '',
  children: [
    {
      type: 'directory',
      name: 'frontend-contract',
      path: 'frontend-contract',
      meta: {
        package: 'frontend-contract',
        title: 'frontend-contract',
        description: '使用右上角菜单查看详情和操作',
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

  it('在命令包卡片上显示更多操作菜单语义和新文案', () => {
    render(<CommandsPackagesExplorer root={tree} />);

    expect(screen.getByText('使用右上角菜单查看详情和操作')).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: '查看命令包操作' });
    expect(menuButton.querySelector('[data-icon=\"ellipsis-vertical\"]')).not.toBeNull();
  });
});
```

- [ ] **步骤 5: 运行测试验证红灯**

运行：

```bash
pnpm --filter @klaaay/spec-kit-app test -- test/commands-packages-explorer.test.tsx
```

预期：
- 测试失败
- 失败点至少包含旧文案仍然存在，或 `EllipsisVertical` 尚未被渲染

### 任务 2: 以最小改动完成图标和文案替换

**文件：**
- 修改：`apps/spec-kit-app/components/CommandsPackages/Explorer.tsx`
- 复用：`apps/spec-kit-app/test/commands-packages-explorer.test.tsx`

- [ ] **步骤 1: 将菜单触发器图标改为更符合“更多操作”的图标**

在 `apps/spec-kit-app/components/CommandsPackages/Explorer.tsx` 中：

```tsx
import { ChevronRightIcon, EllipsisVertical, FileTextIcon, FolderIcon } from 'lucide-react';
```

并将按钮内图标从：

```tsx
<InfoIcon className="h-4 w-4" />
```

替换为：

```tsx
<EllipsisVertical className="h-4 w-4" />
```

- [ ] **步骤 2: 更新辅助文案**

将：

```tsx
使用右上角图标查看命令包信息
```

替换为：

```tsx
使用右上角菜单查看详情和操作
```

- [ ] **步骤 3: 运行单测验证绿灯**

运行：

```bash
pnpm --filter @klaaay/spec-kit-app test -- test/commands-packages-explorer.test.tsx
```

预期：
- 测试通过
- 输出中显示 `1 passed`

- [ ] **步骤 4: 运行相关基线验证**

运行：

```bash
pnpm lint
pnpm test
```

预期：
- `pnpm lint` 无报错
- `pnpm test` 仍然全部通过

- [ ] **步骤 5: 检查变更范围**

运行：

```bash
git status --short
git diff -- apps/spec-kit-app/components/CommandsPackages/Explorer.tsx apps/spec-kit-app/package.json apps/spec-kit-app/vitest.config.ts apps/spec-kit-app/test/setup.ts apps/spec-kit-app/test/commands-packages-explorer.test.tsx
```

预期：
- 只出现计划内文件
- `Explorer.tsx` 只包含图标与文案的最小改动
