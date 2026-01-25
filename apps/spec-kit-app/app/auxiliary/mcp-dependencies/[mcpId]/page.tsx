import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { findMcpById, type McpKind } from '@/lib/mcps';

interface McpDependenciesDetailPageProps {
  params: Promise<{
    mcpId: string;
  }>;
}

export async function generateMetadata({ params }: McpDependenciesDetailPageProps): Promise<Metadata> {
  const { mcpId } = await params;
  const mcp = findMcpById(mcpId);

  if (!mcp) {
    return {
      title: 'MCP 未找到 - Spec ToolKit 文档',
    };
  }

  return {
    title: `${mcp.name} - 辅助 MCP`,
    description: mcp.summary,
  };
}

const kindLabels: Record<McpKind, string> = {
  code: '代码 MCP',
  integration: '集成服务',
};

export default async function McpDependenciesDetailPage({ params }: McpDependenciesDetailPageProps) {
  const { mcpId } = await params;
  const mcp = findMcpById(mcpId);

  if (!mcp) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/auxiliary/mcp-dependencies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4" />
          返回 MCP 列表
        </Link>
      </div>

      <header className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge className="flex-shrink-0" variant="secondary">
            {kindLabels[mcp.kind]}
          </Badge>
          {mcp.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {mcp.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-dashed text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
          {mcp.repositoryPath ? (
            <span>
              代码位置：
              <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">{mcp.repositoryPath}</code>
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{mcp.name}</h1>
          <p className="leading-6 text-muted-foreground">{mcp.description}</p>
        </div>
      </header>

      {mcp.media?.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">功能展示</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mcp.media.map((item, index) => (
              <div key={index} className="space-y-2">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt || ''}
                    className="w-full rounded-xl border border-border/60 shadow-sm"
                  />
                ) : (
                  <video src={item.url} controls className="w-full rounded-xl border border-border/60 shadow-sm">
                    您的浏览器不支持视频播放。
                  </video>
                )}
                {item.caption ? <p className="text-sm text-muted-foreground">{item.caption}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">主要能力</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {mcp.capabilities.map(capability => (
            <li key={capability.id} className="rounded-xl border border-border/60 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold">{capability.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{capability.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {mcp.clientConfig ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">客户端配置示例</h2>
          <div className="space-y-4">
            {mcp.clientConfig.stdio && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">STDIO 模式（本地）</h3>
                <pre className="overflow-x-auto rounded-lg border border-border bg-slate-950 p-4 text-sm text-slate-50">
                  <code>{JSON.stringify({ [mcp.id]: mcp.clientConfig.stdio }, null, 2)}</code>
                </pre>
              </div>
            )}
            {mcp.clientConfig.http && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">HTTP 模式（远程）</h3>
                <pre className="overflow-x-auto rounded-lg border border-border bg-slate-950 p-4 text-sm text-slate-50">
                  <code>{JSON.stringify({ [mcp.id]: mcp.clientConfig.http }, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">本地开发与调试</h2>
        {mcp.setup.prerequisites?.length ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">准备工作</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              {mcp.setup.prerequisites.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <ol className="space-y-3 text-sm leading-6">
          {mcp.setup.steps.map(step => (
            <li key={step} className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
              {step}
            </li>
          ))}
        </ol>

        {mcp.setup.notes?.length ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 p-4 text-xs leading-5 text-muted-foreground">
            {mcp.setup.notes.map(note => (
              <div key={note}>{note}</div>
            ))}
          </div>
        ) : null}
      </section>

      {mcp.runtimeNotes?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">运行提示</h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {mcp.runtimeNotes.map(note => (
              <li key={note} className="rounded-lg border border-border/60 bg-white p-3 shadow-sm">
                {note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
