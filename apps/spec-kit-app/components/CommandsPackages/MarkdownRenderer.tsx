'use client';

import { type Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

import { cn } from '@/lib/utils';

import { MermaidRenderer } from './MermaidRenderer';

let mermaidCounter = 0;

/**
 * 通用 Markdown 组件配置
 * 支持：
 * - GFM 表格、任务列表等
 * - Mermaid 流程图渲染
 * - 代码高亮
 * - 完整的 HTML 标签样式
 */
export const markdownComponents: Partial<Components> = {
  code({ node, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1];
    const codeString = String(children).replace(/\n$/, '');
    const inline = !className;

    // 内联代码
    if (inline) {
      return (
        <code className={cn('rounded bg-muted px-1.5 py-0.5 text-xs', className)} {...props}>
          {children}
        </code>
      );
    }

    // Mermaid 图表
    if (language === 'mermaid') {
      mermaidCounter += 1;
      return <MermaidRenderer chart={codeString} id={`${Date.now()}-${mermaidCounter}`} />;
    }

    // 普通代码块
    return (
      <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs leading-6">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  table({ className, ...props }: any) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-border/60">
        <table className={cn('w-full text-sm', className)} {...props} />
      </div>
    );
  },
  thead({ className, ...props }: any) {
    return <thead className={cn('bg-muted/50', className)} {...props} />;
  },
  th({ className, ...props }: any) {
    return <th className={cn('border-b px-4 py-2 text-left font-semibold', className)} {...props} />;
  },
  td({ className, ...props }: any) {
    return <td className={cn('border-b px-4 py-2', className)} {...props} />;
  },
  h1({ className, ...props }: any) {
    return <h1 className={cn('mb-4 mt-6 text-2xl font-bold', className)} {...props} />;
  },
  h2({ className, ...props }: any) {
    return <h2 className={cn('mb-3 mt-5 text-xl font-bold', className)} {...props} />;
  },
  h3({ className, ...props }: any) {
    return <h3 className={cn('mb-2 mt-4 text-lg font-semibold', className)} {...props} />;
  },
  p({ className, ...props }: any) {
    return <p className={cn('mb-3 leading-7', className)} {...props} />;
  },
  ul({ className, ...props }: any) {
    return <ul className={cn('mb-3 ml-6 list-disc', className)} {...props} />;
  },
  ol({ className, ...props }: any) {
    return <ol className={cn('mb-3 ml-6 list-decimal', className)} {...props} />;
  },
  li({ className, ...props }: any) {
    return <li className={cn('mb-1', className)} {...props} />;
  },
  blockquote({ className, ...props }: any) {
    return (
      <blockquote
        className={cn('my-4 border-l-4 border-primary/40 bg-muted/30 py-2 pl-4 italic', className)}
        {...props}
      />
    );
  },
  hr({ className, ...props }: any) {
    return <hr className={cn('my-6 border-border', className)} {...props} />;
  },
  a({ className, ...props }: any) {
    return (
      <a
        className={cn('text-primary underline underline-offset-4 hover:text-primary/80', className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 通用 Markdown 渲染组件
 *
 * 功能特性：
 * - 支持 GFM（GitHub Flavored Markdown）
 * - 支持 Frontmatter
 * - 支持 Mermaid 流程图
 * - 支持表格、列表、代码块等
 * - 响应式设计
 *
 * @example
 * ```tsx
 * <MarkdownRenderer content={markdownText} />
 * ```
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkFrontmatter]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
