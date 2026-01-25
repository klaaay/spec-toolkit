'use client';

import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { MarkdownRenderer } from './MarkdownRenderer';

interface WorkflowSheetProps {
  packageName: string;
  packagePath: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowSheet({ packageName, packagePath, isOpen, onClose }: WorkflowSheetProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !packagePath) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setContent('');

    // 构建 workflow.md 的路径
    const workflowPath = `${packagePath}/workflow.md`;

    fetch(`/commands-packages/${workflowPath}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`无法加载工作流文档：${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        if (!isMounted) return;
        setContent(text);
        setIsLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setIsLoading(false);
        setError(err instanceof Error ? err.message : '加载工作流文档时出现未知错误');
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, packagePath]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-4xl">
        <div className="flex h-full flex-col gap-4 p-6">
          <SheetHeader className="gap-3">
            <SheetTitle className="text-lg font-semibold">命令包工作流</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">{packageName} - workflow.md</SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                正在加载工作流文档...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                暂无工作流文档内容
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
