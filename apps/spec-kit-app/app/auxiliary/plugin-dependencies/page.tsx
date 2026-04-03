import type { Metadata } from 'next';

import { PluginGallery } from '@/components/plugins/PluginGallery';
import { plugins } from '@/lib/plugins';

export const metadata: Metadata = {
  title: '插件依赖 - Spec ToolKit 文档',
  description: '浏览命令包依赖的插件，了解安装方法与使用要点。',
};

export default function PluginDependenciesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">插件依赖</h1>
        <p className="text-muted-foreground">
          命令包依赖的插件清单及其能力说明。点击任意卡片即可查看插件的主要特性、安装步骤及本地调试方式。
        </p>
      </header>

      <PluginGallery plugins={plugins} />
    </div>
  );
}
