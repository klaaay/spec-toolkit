import type { Metadata } from 'next';
import Link from 'next/link';
import { PuzzleIcon, ServerIcon } from 'lucide-react';

const resources = [
  {
    href: '/auxiliary/plugin-dependencies',
    title: '辅助插件',
    description: '浏览命令包依赖的插件能力，了解安装方法与使用要点。',
    icon: PuzzleIcon,
  },
  {
    href: '/auxiliary/mcp-dependencies',
    title: '辅助 MCP',
    description: '查看常用 MCP 的能力边界与部署集成方式，快速接入项目。',
    icon: ServerIcon,
  },
];

export const metadata: Metadata = {
  title: '其他辅助 - Spec ToolKit 文档',
  description: '浏览命令包所需的其他辅助资源，包含插件与 MCP 的能力说明。',
};

export default function AuxiliaryPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">其他辅助</h1>
        <p className="text-muted-foreground">命令包依赖的插件与 MCP 资源在此集中呈现，便于检索安装步骤与集成说明。</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map(resource => {
          const Icon = resource.icon;

          return (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                <span>{resource.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-6">{resource.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
