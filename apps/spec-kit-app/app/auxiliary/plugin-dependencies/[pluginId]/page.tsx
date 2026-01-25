import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { findPluginById, type PluginKind } from '@/lib/plugins';

interface PluginDependenciesDetailPageProps {
  params: Promise<{
    pluginId: string;
  }>;
}

export async function generateMetadata({ params }: PluginDependenciesDetailPageProps): Promise<Metadata> {
  const { pluginId } = await params;
  const plugin = findPluginById(pluginId);

  if (!plugin) {
    return {
      title: '插件未找到 - Spec ToolKit 文档',
    };
  }

  return {
    title: `${plugin.name} - 辅助插件`,
    description: plugin.summary,
  };
}

const kindLabels: Record<PluginKind, string> = {
  figma: 'Figma 插件',
  browser: '浏览器插件',
};

export default async function PluginDependenciesDetailPage({ params }: PluginDependenciesDetailPageProps) {
  const { pluginId } = await params;
  const plugin = findPluginById(pluginId);

  if (!plugin) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/auxiliary/plugin-dependencies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4" />
          返回插件列表
        </Link>
      </div>

      <header className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{kindLabels[plugin.kind]}</Badge>
          {plugin.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {plugin.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-dashed text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
          {plugin.repositoryPath ? (
            <span>
              代码位置：
              <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">{plugin.repositoryPath}</code>
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{plugin.name}</h1>
          <p className="text-muted-foreground leading-6">{plugin.description}</p>
        </div>
      </header>

      {plugin.media?.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">功能展示</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {plugin.media.map((item, index) => (
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
          {plugin.capabilities.map(capability => (
            <li key={capability.id} className="rounded-xl border border-border/60 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold">{capability.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-6">{capability.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">安装与使用</h2>
        {plugin.installation.prerequisites?.length ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">准备工作</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground leading-6">
              {plugin.installation.prerequisites.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <ol className="space-y-3 text-sm leading-6">
          {plugin.installation.steps.map(step => (
            <li key={step} className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
              {step}
            </li>
          ))}
        </ol>

        {plugin.installation.notes?.length ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground leading-5">
            {plugin.installation.notes.map(note => (
              <div key={note}>{note}</div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
