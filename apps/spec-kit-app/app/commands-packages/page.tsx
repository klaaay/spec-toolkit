import { getCommandsPackagesTree } from '@/lib/commands-packages';
import { CommandsPackagesExplorer } from '@/components/CommandsPackages/Explorer';

export const metadata = {
  title: '命令包广场 - Spec ToolKit 文档',
  description: '浏览仓库中的命令包，查看其中的命令、技能、模板与依赖说明。',
};

export default async function CommandPackagesPage() {
  const tree = await getCommandsPackagesTree();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        {/* <h1 className="text-3xl font-bold">命令包广场</h1> */}
        <p className="text-muted-foreground">
          浏览仓库中的命令包目录，查看其中的命令、技能、模板、代理提示词与依赖说明，并预览对应文件内容。
        </p>
      </header>

      <CommandsPackagesExplorer root={tree} />
    </div>
  );
}
