import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { McpInfo, McpKind } from '@/lib/mcps';

interface McpGalleryProps {
  readonly mcps: ReadonlyArray<McpInfo>;
}

const kindLabels: Record<McpKind, string> = {
  code: '代码 MCP',
  integration: '集成服务',
};

export function McpGallery({ mcps }: McpGalleryProps) {
  if (mcps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
        暂无可展示的 MCP 依赖。
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mcps.map(mcp => {
        const cardContent = (
          <div className="h-full rounded-xl border border-border bg-white p-5 shadow-sm transition-all group-hover:shadow-md group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
            <div className="flex items-center gap-2">
              <Badge className="flex-shrink-0" variant="secondary">
                {kindLabels[mcp.kind]}
              </Badge>
              {mcp.tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {mcp.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-dashed text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {mcp.name}
              </h3>
              {mcp.externalLink && (
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{mcp.summary}</p>
          </div>
        );

        // 如果配置了外部链接，使用 a 标签打开新窗口
        if (mcp.externalLink) {
          return (
            <a
              key={mcp.id}
              href={mcp.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80">
              {cardContent}
            </a>
          );
        }

        // 否则使用内部路由
        return (
          <Link
            key={mcp.id}
            href={`/auxiliary/mcp-dependencies/${mcp.id}`}
            className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80">
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
