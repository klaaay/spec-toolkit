import type { Metadata } from 'next';

import { McpGallery } from '@/components/mcps/McpGallery';
import { mcps } from '@/lib/mcps';

export const metadata: Metadata = {
  title: 'MCP 依赖 - Spec ToolKit 文档',
  description: '查看命令包依赖的 MCP，了解能力边界与部署步骤。',
};

export default function McpDependenciesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">MCP 依赖</h1>
        <p className="text-muted-foreground">
          列举命令包集成所需的 MCP 能力，涵盖部署与接入指南，帮助你迅速构建开发环境。
        </p>
      </header>

      <McpGallery mcps={mcps} />
    </div>
  );
}
