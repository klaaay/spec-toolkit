'use client';

import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  theme?: string;
}

export function CodeBlock({ code, language = 'typescript', className, theme = 'github-dark' }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      try {
        setIsLoading(true);
        const html = await codeToHtml(code, {
          lang: language,
          theme: theme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void highlight();
  }, [code, language, theme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn('rounded-md overflow-hidden relative group', className)}>
      {!isLoading && (
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-1.5 rounded-md bg-black/20 hover:bg-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Copy code">
          {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
        </button>
      )}
      {isLoading ? (
        <div className="bg-zinc-900 animate-pulse p-4 rounded-md h-20"></div>
      ) : (
        <div className="shiki-wrapper text-sm" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      )}
    </div>
  );
}
