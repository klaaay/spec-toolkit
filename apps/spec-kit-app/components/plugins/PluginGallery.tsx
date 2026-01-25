import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { PluginInfo, PluginKind } from '@/lib/plugins';

interface PluginGalleryProps {
  readonly plugins: ReadonlyArray<PluginInfo>;
}

const kindLabels: Record<PluginKind, string> = {
  figma: 'Figma 插件',
  browser: '浏览器插件',
};

export function PluginGallery({ plugins }: PluginGalleryProps) {
  if (plugins.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
        暂无可展示的插件。
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plugins.map(plugin => {
        const cardContent = (
          <div className="h-full rounded-xl border border-border bg-white p-5 shadow-sm transition-all group-hover:shadow-md group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{kindLabels[plugin.kind]}</Badge>
              {plugin.tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {plugin.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-dashed text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {plugin.name}
              </h3>
              {plugin.externalLink && (
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plugin.summary}</p>
          </div>
        );

        // 如果配置了外部链接，使用 a 标签打开新窗口
        if (plugin.externalLink) {
          return (
            <a
              key={plugin.id}
              href={plugin.externalLink}
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
            key={plugin.id}
            href={`/auxiliary/plugin-dependencies/${plugin.id}`}
            className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80">
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
