'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { PackageMeta } from '@/lib/commands-packages';

interface CommandPackageMetaSheetProps {
  activeMeta: { name: string; path: string; meta: PackageMeta } | null;
  onClose: () => void;
  onOpenFile?: (filePath: string) => void;
}

export function CommandPackageMetaSheet({ activeMeta, onClose, onOpenFile }: CommandPackageMetaSheetProps) {
  const handleFileClick = (file: string) => {
    if (!activeMeta) return;

    // 构建文件的完整路径
    const filePath = activeMeta.path ? `${activeMeta.path}/${file}` : file;

    // 触发文件预览（保持命令包详情抽屉打开，以便用户查看完文件后可以返回）
    onOpenFile?.(filePath);
  };
  return (
    <Sheet open={Boolean(activeMeta)} onOpenChange={isOpen => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
        {activeMeta ? (
          <div className="flex h-full flex-col gap-6 p-6">
            <SheetHeader className="gap-2 text-left">
              <SheetTitle className="text-lg font-semibold">{activeMeta.meta.package}</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                路径：{activeMeta.path || '/'}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-6 overflow-auto pr-1 text-sm">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">版本</div>
                <div className="font-medium">{activeMeta.meta.version ?? '未提供'}</div>
              </div>
              {activeMeta.meta.commands && activeMeta.meta.commands.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">Commands</div>
                  <div className="space-y-2">
                    {activeMeta.meta.commands.map(command => (
                      <div
                        key={command.id}
                        className="cursor-pointer rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
                        onClick={() => handleFileClick(command.file)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFileClick(command.file);
                          }
                        }}>
                        <div className="text-sm font-medium">{command.id}</div>
                        <div className="mt-1 text-xs leading-5 text-muted-foreground">{command.description}</div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <div>脚本：{command.file}</div>
                          <div>输出：{command.output}</div>
                          {command.requires && command.requires.length > 0 && (
                            <div>依赖：{command.requires.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeMeta.meta.agents && activeMeta.meta.agents.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">Agents</div>
                  <div className="space-y-2">
                    {activeMeta.meta.agents.map(agent => (
                      <div
                        key={agent.id}
                        className="cursor-pointer rounded-lg border bg-muted/20 p-3 text-xs transition-colors hover:bg-muted/30 hover:border-primary/30"
                        onClick={() => handleFileClick(agent.file)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFileClick(agent.file);
                          }
                        }}>
                        <div className="text-sm font-medium">{agent.id}</div>
                        {agent.description ? (
                          <div className="mt-1 text-muted-foreground">{agent.description}</div>
                        ) : null}
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div>文件：{agent.file}</div>
                          {agent.output ? <div>输出：{agent.output}</div> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeMeta.meta.skills && activeMeta.meta.skills.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">Skills</div>
                  <div className="space-y-2">
                    {activeMeta.meta.skills.map(skill => (
                      <div key={skill.id} className="rounded-lg border bg-muted/20 p-3 text-xs transition-colors">
                        <div
                          className="cursor-pointer transition-colors hover:text-primary"
                          onClick={() => handleFileClick(skill.file)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleFileClick(skill.file);
                            }
                          }}>
                          <div className="text-sm font-medium">{skill.id}</div>
                          {skill.description ? (
                            <div className="mt-1 text-muted-foreground">{skill.description}</div>
                          ) : null}
                          <div className="mt-2 grid gap-1 text-muted-foreground">
                            <div>文件：{skill.file}</div>
                            {skill.output ? <div>输出：{skill.output}</div> : null}
                          </div>
                        </div>
                        {skill.scripts && skill.scripts.length > 0 ? (
                          <div className="mt-3 space-y-2 border-t pt-3">
                            <div className="text-xs font-medium text-muted-foreground">脚本</div>
                            {skill.scripts.map(script => (
                              <div
                                key={script.id}
                                className="cursor-pointer rounded border bg-muted/10 p-2 transition-colors hover:bg-muted/20 hover:border-primary/30"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleFileClick(script.file);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFileClick(script.file);
                                  }
                                }}>
                                <div className="text-xs font-medium">{script.id}</div>
                                {script.description ? (
                                  <div className="mt-1 text-[11px] text-muted-foreground">{script.description}</div>
                                ) : null}
                                <div className="mt-1 text-[11px] text-muted-foreground">文件：{script.file}</div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeMeta.meta.templates && activeMeta.meta.templates.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">模板</div>
                  <div className="space-y-2">
                    {activeMeta.meta.templates.map(template => (
                      <div
                        key={template.id}
                        className="cursor-pointer rounded-lg border bg-muted/20 p-3 text-xs transition-colors hover:bg-muted/30 hover:border-primary/30"
                        onClick={() => handleFileClick(template.file)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFileClick(template.file);
                          }
                        }}>
                        <div className="font-medium">{template.id}</div>
                        <div className="mt-1 text-muted-foreground">文件：{template.file}</div>
                        <div className="text-muted-foreground">输出：{template.output}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {activeMeta.meta.mcpServers && Object.keys(activeMeta.meta.mcpServers).length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">MCP 服务依赖</div>
                  <div className="text-xs leading-5 text-muted-foreground">
                    使用该命令包前，请确认下列 MCP 服务已配置并可用。
                  </div>
                  <div className="space-y-2 text-xs">
                    {Object.entries(activeMeta.meta.mcpServers).map(([serverId, serverConfig]) => {
                      return (
                        <div key={serverId} className="rounded-lg border bg-muted/10 p-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-col gap-1">
                              <div className="text-sm font-medium">{serverConfig.name ?? serverId}</div>
                              {serverConfig.name ? (
                                <div className="text-[11px] text-muted-foreground">ID：{serverId}</div>
                              ) : null}
                              {serverConfig.docUrl ? (
                                <a
                                  href={serverConfig.docUrl}
                                  className="text-xs text-primary underline underline-offset-4"
                                  target="_blank"
                                  rel="noopener noreferrer">
                                  文档
                                </a>
                              ) : null}
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">MCP</span>
                          </div>
                          <div className="mt-2 space-y-1 text-muted-foreground">
                            {serverConfig.description ? <div>说明：{serverConfig.description}</div> : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {activeMeta.meta.otherDependencies && Object.keys(activeMeta.meta.otherDependencies).length > 0 ? (
                <div className="space-y-3">
                  <div className="text-base font-semibold">其他可选依赖</div>
                  <div className="text-xs leading-5 text-muted-foreground">以下依赖可提升体验，但非必需。</div>
                  <div className="space-y-2 text-xs">
                    {Object.entries(activeMeta.meta.otherDependencies).map(([dependencyId, dependency]) => (
                      <div key={dependencyId} className="rounded-lg border bg-muted/5 p-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">{dependency.name ?? dependencyId}</div>
                          {dependency.name ? (
                            <div className="text-[11px] text-muted-foreground">ID：{dependencyId}</div>
                          ) : null}
                          {dependency.docUrl ? (
                            <a
                              href={dependency.docUrl}
                              className="text-xs text-primary underline underline-offset-4"
                              target="_blank"
                              rel="noopener noreferrer">
                              文档
                            </a>
                          ) : null}
                        </div>
                        {dependency.description ? (
                          <div className="mt-2 text-muted-foreground">说明：{dependency.description}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
