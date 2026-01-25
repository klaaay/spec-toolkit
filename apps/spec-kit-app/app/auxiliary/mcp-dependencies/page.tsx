import type { Metadata } from 'next';

import { McpGallery } from '@/components/mcps/McpGallery';
import { mcps } from '@/lib/mcps';

export const metadata: Metadata = {
  title: '辅助 MCP - Spec ToolKit 文档',
  description: '查看常用 MCP 的能力边界与部署步骤，快速接入项目。',
};

export default function McpDependenciesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">辅助 MCP</h1>
        <p className="text-muted-foreground">
          列举命令包集成所需的 MCP 能力，涵盖部署与接入指南，帮助你迅速构建开发环境。
        </p>
      </header>

      <McpGallery mcps={mcps} />
    </div>
  );
}
