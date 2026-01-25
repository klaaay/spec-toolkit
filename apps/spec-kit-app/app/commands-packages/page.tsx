import { getCommandsPackagesTree } from '@/lib/commands-packages';
import { CommandsPackagesExplorer } from '@/components/CommandsPackages/Explorer';

export const metadata = {
  title: '命令包广场 - Spec ToolKit 文档',
  description: '浏览与查看命令包资源、模板与说明文件。',
};

export default async function CommandPackagesPage() {
  const tree = await getCommandsPackagesTree();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        {/* <h1 className="text-3xl font-bold">命令包广场</h1> */}
        <p className="text-muted-foreground">
          浏览仓库内的命令包目录结构，查看命令描述、依赖及模板，并预览对应的 Markdown 内容。
        </p>
      </header>

      <CommandsPackagesExplorer root={tree} />
    </div>
  );
}
