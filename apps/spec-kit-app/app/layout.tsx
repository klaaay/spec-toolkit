import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { GitBranch, ScrollText } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Spec ToolKit 文档',
  description: 'Spec ToolKit 的 CLI、命令包内容与辅助依赖说明',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <SidebarProvider>
          <AppSidebar />
          <main className="pb-16 w-full">
            <div className="flex items-center justify-between h-16 px-4 border-b bg-white w-full">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://github.com/klaaay/spec-toolkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>GitHub 仓库</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://github.com/klaaay/spec-toolkit/blob/main/packages/spec-kit-ts/CHANGELOG.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    <span>变更日志</span>
                  </a>
                </Button>
              </div>
            </div>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
              <PageBreadcrumb />
              {children}
            </div>
          </main>
          <Toaster position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  );
}
