'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  id: string;
}

export function MermaidRenderer({ chart, id }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chart) {
      return;
    }

    const renderMermaid = async () => {
      try {
        // 初始化 mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        });

        // 清空容器
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // 渲染图表
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid 渲染错误：', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              <div class="font-semibold mb-2">Mermaid 图表渲染失败</div>
              <div class="text-xs opacity-80">${error instanceof Error ? error.message : '未知错误'}</div>
            </div>
          `;
        }
      }
    };

    void renderMermaid();
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="my-4 flex items-center justify-center overflow-auto rounded-lg border bg-muted/30 p-6"
    />
  );
}
