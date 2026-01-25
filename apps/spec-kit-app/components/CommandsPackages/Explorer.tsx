'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRightIcon, FileTextIcon, FolderIcon, InfoIcon } from 'lucide-react';

import { type DirectoryNode, type FileNode, type PackageMeta, type PackageTree } from '@/lib/commands-packages';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { AddCommandPackageGuide } from './AddCommandPackageGuide';
import { CommandPackageMetaSheet } from './CommandPackageMetaSheet';
import { MarkdownRenderer } from './MarkdownRenderer';
import { WorkflowSheet } from './WorkflowSheet';

type TreeItem = DirectoryNode | FileNode;

interface ExplorerProps {
  root: PackageTree;
}

const ROOT_LABEL = 'root';

const FILTERED_MD_FILTERS = ['workflow.md'];
const CATEGORY_ORDER = ['SDD-Spec开发', '前端开发'];
const UNCATEGORIZED_LABEL = '未分类';
const DEFAULT_AI = 'claude';
const DEFAULT_SCRIPT = 'auto';
const AI_ASSISTANTS = [
  { key: 'claude', name: 'Claude Code', requiresCli: true },
  { key: 'gemini', name: 'Gemini CLI', requiresCli: true },
  { key: 'copilot', name: 'GitHub Copilot', requiresCli: false },
  { key: 'cursor-agent', name: 'Cursor', requiresCli: false },
  { key: 'qwen', name: 'Qwen Code', requiresCli: true },
  { key: 'opencode', name: 'opencode', requiresCli: true },
  { key: 'windsurf', name: 'Windsurf', requiresCli: false },
  { key: 'codex', name: 'Codex CLI', requiresCli: true },
  { key: 'kilocode', name: 'Kilo Code', requiresCli: false },
  { key: 'auggie', name: 'Auggie CLI', requiresCli: true },
  { key: 'roo', name: 'Roo Code', requiresCli: false },
  { key: 'codebuddy', name: 'CodeBuddy', requiresCli: true },
  { key: 'q', name: 'Amazon Q Developer CLI', requiresCli: true },
];
const SCRIPT_OPTIONS = [
  {
    type: 'auto',
    label: '自动选择',
    description: '不传 --script，默认随系统选择',
  },
  {
    type: 'sh',
    label: 'POSIX Shell',
    description: 'bash / zsh / Linux / macOS',
  },
  { type: 'ps', label: 'PowerShell', description: 'Windows 默认' },
];

function findDirectoryByPath(node: DirectoryNode, pathSegments: string[]): DirectoryNode | null {
  if (pathSegments.length === 0) {
    return node;
  }

  const [current, ...rest] = pathSegments;
  const next = node.children.find(
    (child): child is DirectoryNode => child.type === 'directory' && child.name === current,
  );

  if (!next) {
    return null;
  }

  return findDirectoryByPath(next, rest);
}

function useDirectory(root: DirectoryNode, pathSegments: string[]) {
  return useMemo(() => findDirectoryByPath(root, pathSegments), [root, pathSegments]);
}

export function CommandsPackagesExplorer({ root }: ExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'markdown' | 'raw'>('markdown');
  const [activeMeta, setActiveMeta] = useState<{
    name: string;
    path: string;
    meta: PackageMeta;
  } | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [workflowPreview, setWorkflowPreview] = useState<{
    name: string;
    path: string;
  } | null>(null);
  const [installDialog, setInstallDialog] = useState<{ name: string } | null>(null);
  const [selectedAi, setSelectedAi] = useState(DEFAULT_AI);
  const [selectedScript, setSelectedScript] = useState(DEFAULT_SCRIPT);
  const menuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentDirectory = useDirectory(root, currentPath);

  const items = useMemo<TreeItem[]>(() => {
    if (!currentDirectory) {
      return [];
    }
    return currentDirectory.children;
  }, [currentDirectory]);

  const visibleItems = useMemo(() => {
    return items.filter(item => !FILTERED_MD_FILTERS.includes(item?.name));
  }, [items]);

  const categorizedItems = useMemo(() => {
    if (currentPath.length > 0) {
      return null;
    }

    const grouped = new Map<string, TreeItem[]>();
    visibleItems.forEach(item => {
      let category = UNCATEGORIZED_LABEL;
      if (item.type === 'directory' && typeof item.meta?.category === 'string') {
        const trimmed = item.meta.category.trim();
        if (trimmed) {
          category = trimmed;
        }
      }
      const existing = grouped.get(category);
      if (existing) {
        existing.push(item);
      } else {
        grouped.set(category, [item]);
      }
    });

    const orderedCategories: string[] = [];
    CATEGORY_ORDER.forEach(category => {
      if (grouped.has(category)) {
        orderedCategories.push(category);
      }
    });
    const remaining = Array.from(grouped.keys())
      .filter(category => !orderedCategories.includes(category))
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));
    orderedCategories.push(...remaining);

    return {
      orderedCategories,
      grouped,
    };
  }, [currentPath.length, visibleItems]);

  useEffect(() => {
    setFileContent('');
    setFileError(null);
    setPreviewMode('markdown');
  }, [selectedFilePath]);

  useEffect(() => {
    if (!selectedFilePath) {
      return;
    }

    let isMounted = true;
    setIsLoadingFile(true);
    setFileError(null);

    fetch(`/commands-packages/${selectedFilePath}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`无法加载文件：${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        if (!isMounted) return;
        setFileContent(content);
        setIsLoadingFile(false);
      })
      .catch(error => {
        if (!isMounted) return;
        setIsLoadingFile(false);
        setFileError(error instanceof Error ? error.message : '加载文件时出现未知错误');
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFilePath]);

  const clearMenuCloseTimer = useCallback(() => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
  }, []);

  const scheduleMenuClose = useCallback(
    (path: string) => {
      clearMenuCloseTimer();
      menuCloseTimerRef.current = setTimeout(() => {
        setHoveredMenu(current => (current === path ? null : current));
      }, 150);
    },
    [clearMenuCloseTimer],
  );

  const openMenu = useCallback(
    (path: string) => {
      clearMenuCloseTimer();
      setHoveredMenu(path);
    },
    [clearMenuCloseTimer],
  );

  const closeMenu = useCallback(() => {
    clearMenuCloseTimer();
    setHoveredMenu(null);
  }, [clearMenuCloseTimer]);

  useEffect(() => {
    return () => {
      clearMenuCloseTimer();
    };
  }, [clearMenuCloseTimer]);

  useEffect(() => {
    setSelectedFilePath(null);
    setIsPreviewOpen(false);
    closeMenu();
  }, [closeMenu, currentPath]);

  if (!currentDirectory) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-destructive">
        无法定位目录，请检查命令包资源是否存在。
      </div>
    );
  }

  const breadcrumbs = [ROOT_LABEL, ...currentPath];

  const handleOpenMeta = (directory: DirectoryNode) => {
    closeMenu();
    if (!directory.meta) {
      return;
    }
    setActiveMeta({
      name: directory.name,
      path: directory.path,
      meta: directory.meta,
    });
  };

  const handleOpenWorkflow = (directory: DirectoryNode) => {
    closeMenu();
    setWorkflowPreview({
      name: directory.name,
      path: directory.path,
    });
  };

  const handleOpenInstallDialog = (directory: DirectoryNode) => {
    closeMenu();
    setInstallDialog({ name: directory.name });
    setSelectedAi(DEFAULT_AI);
    setSelectedScript(DEFAULT_SCRIPT);
  };

  const hasWorkflowFile = (directory: DirectoryNode): boolean => {
    return directory.children.some(child => child.type === 'file' && child.name.toLowerCase() === 'workflow.md');
  };

  const handleDoubleClick = (item: TreeItem) => {
    if (item.type === 'directory') {
      setCurrentPath(prev => [...prev, item.name]);
      return;
    }
    setSelectedFilePath(item.path);
    setIsPreviewOpen(true);
    setPreviewMode('markdown');
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentPath([]);
      return;
    }
    setCurrentPath(currentPath.slice(0, index));
  };

  const renderItem = (item: TreeItem) => {
    const isFile = item.type === 'file';
    const isSelected = selectedFilePath === item.path;
    const canShowMeta = item.type === 'directory' && Boolean(item.meta);
    const canShowWorkflow = item.type === 'directory' && hasWorkflowFile(item);
    const canShowInstall = item.type === 'directory' && currentPath.length === 0;
    const canShowMenu = item.type === 'directory' && (canShowMeta || canShowWorkflow || canShowInstall);

    return (
      <Card
        key={item.path}
        role="button"
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            handleDoubleClick(item);
          }
        }}
        onDoubleClick={() => handleDoubleClick(item)}
        className={cn(
          'group cursor-pointer border bg-background transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40',
          isSelected && isFile && 'border-primary shadow-sm',
        )}>
        <CardContent className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-primary/40 bg-primary/10 text-primary">
                {isFile ? <FileTextIcon className="h-5 w-5" /> : <FolderIcon className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold leading-5 break-all">{item.name}</div>
                {canShowMeta && <div className="text-xs text-muted-foreground">使用右上角图标查看命令包信息</div>}
                {isFile && <div className="text-xs uppercase text-muted-foreground">{item.extension}</div>}
              </div>
            </div>
            {canShowMenu ? (
              <div
                className="relative"
                onMouseEnter={() => openMenu(item.path)}
                onMouseLeave={() => scheduleMenuClose(item.path)}>
                <button
                  type="button"
                  className="rounded-full border border-dashed border-muted-foreground/30 p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="查看命令包操作"
                  onClick={event => {
                    event.stopPropagation();
                    if (hoveredMenu === item.path) {
                      closeMenu();
                    } else {
                      openMenu(item.path);
                    }
                  }}
                  onFocus={() => openMenu(item.path)}
                  onBlur={() => scheduleMenuClose(item.path)}>
                  <InfoIcon className="h-4 w-4" />
                </button>
                <div
                  className={cn(
                    'absolute right-0 z-20 mt-2 w-40 rounded-md border bg-popover p-2 text-sm shadow-lg transition-all',
                    hoveredMenu === item.path
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-1 opacity-0',
                  )}
                  onMouseEnter={() => openMenu(item.path)}
                  onMouseLeave={() => scheduleMenuClose(item.path)}
                  onClick={event => event.stopPropagation()}>
                  {canShowMeta ? (
                    <button
                      type="button"
                      className="w-full rounded-sm px-2 py-1 text-left transition-colors hover:bg-muted"
                      onClick={() => handleOpenMeta(item)}>
                      查看命令包信息
                    </button>
                  ) : null}
                  {canShowWorkflow ? (
                    <button
                      type="button"
                      className="w-full rounded-sm px-2 py-1 text-left transition-colors hover:bg-muted"
                      onClick={() => handleOpenWorkflow(item)}>
                      查看工作流程
                    </button>
                  ) : null}
                  {canShowInstall ? (
                    <button
                      type="button"
                      className="w-full rounded-sm px-2 py-1 text-left transition-colors hover:bg-muted"
                      onClick={() => handleOpenInstallDialog(item)}>
                      复制安装指令
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          {!isFile && item.children.length > 0 ? (
            <div className="text-xs text-muted-foreground">
              {item.children.filter(child => !FILTERED_MD_FILTERS.includes(child.name)).length} 项
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {breadcrumbs?.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((segment, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={`${segment}-${index}`} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(index)}
                    className={cn(
                      'transition-colors hover:text-foreground',
                      isLast && 'font-medium text-foreground',
                      !isLast && 'underline underline-offset-4',
                    )}
                    disabled={isLast}>
                    {segment || ROOT_LABEL}
                  </button>
                  {!isLast && <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />}
                </div>
              );
            })}
          </div>
        )}

        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AddCommandPackageGuide show={currentPath.length === 0} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              双击进入下级目录或打开文件，点击卡片右上角的图标即可查看命令包详情。
            </p>
            {categorizedItems ? (
              <div className="space-y-6">
                {categorizedItems.orderedCategories.map((category, index) => {
                  const groupItems = categorizedItems.grouped.get(category) ?? [];
                  return (
                    <div key={category} className="space-y-3">
                      <div className="text-sm font-semibold text-foreground">{category}</div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupItems.map(item => renderItem(item))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map(item => renderItem(item))}
              </div>
            )}
            {visibleItems.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                当前目录下没有更多内容。
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <CommandPackageMetaSheet
        activeMeta={activeMeta}
        onClose={() => setActiveMeta(null)}
        onOpenFile={filePath => {
          setSelectedFilePath(filePath);
          setIsPreviewOpen(true);
          setPreviewMode('markdown');
        }}
      />

      <WorkflowSheet
        packageName={workflowPreview?.name ?? ''}
        packagePath={workflowPreview?.path ?? ''}
        isOpen={workflowPreview !== null}
        onClose={() => setWorkflowPreview(null)}
      />

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
          <div className="flex h-full flex-col gap-4 p-6">
            <SheetHeader className="gap-3">
              <SheetTitle className="text-lg font-semibold">文件预览</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {selectedFilePath ?? '未选择文件'}
              </SheetDescription>
              {selectedFilePath ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === 'markdown' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('markdown')}
                    disabled={isLoadingFile}>
                    Markdown
                  </Button>
                  <Button
                    variant={previewMode === 'raw' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('raw')}
                    disabled={isLoadingFile}>
                    明文
                  </Button>
                </div>
              ) : null}
            </SheetHeader>
            <div className="mt-4 flex-1 overflow-auto">
              {!selectedFilePath ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  双击左侧文件以加载预览。
                </div>
              ) : isLoadingFile ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  正在加载文件内容...
                </div>
              ) : fileError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                  {fileError}
                </div>
              ) : previewMode === 'markdown' ? (
                <MarkdownRenderer content={fileContent} />
              ) : (
                <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs leading-6">
                  <code>{fileContent}</code>
                </pre>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={installDialog !== null}
        onOpenChange={open => {
          if (!open) {
            setInstallDialog(null);
          }
        }}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>快速生成安装指令</DialogTitle>
            <DialogDescription>选择 AI 助手与脚本类型，即可生成当前命令包的拉取指令。</DialogDescription>
          </DialogHeader>
          {installDialog ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">AI 助手</div>
                <div className="flex flex-wrap gap-2">
                  {AI_ASSISTANTS.map(option => {
                    const isActive = selectedAi === option.key;
                    return (
                      <Button
                        key={option.key}
                        type="button"
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAi(option.key)}>
                        {option.key}
                        {option.requiresCli ? ' *' : ''}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">带 * 的选项需要提前安装对应 CLI。</p>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">脚本类型</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {SCRIPT_OPTIONS.map(option => {
                    const isActive = selectedScript === option.type;
                    return (
                      <button
                        key={option.type}
                        type="button"
                        className={cn(
                          'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                          isActive ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
                        )}
                        onClick={() => setSelectedScript(option.type)}>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">最终指令</div>
                <CodeBlock
                  language="bash"
                  code={`specify-ts pull-package ${installDialog.name} --ai ${selectedAi}${
                    selectedScript === 'auto' ? '' : ` --script ${selectedScript}`
                  }`}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
