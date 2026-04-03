'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpenIcon, HomeIcon, PuzzleIcon, FolderIcon, ServerIcon, LifeBuoyIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { version } from '@/lib/version';

export function AppSidebar() {
  const pathname = usePathname();
  const isPluginActive = pathname.startsWith('/auxiliary/plugin-dependencies');
  const isMcpActive = pathname.startsWith('/auxiliary/mcp-dependencies');
  const isAuxiliaryActive = pathname === '/auxiliary' || isPluginActive || isMcpActive;

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center w-full">
          <div className="flex items-center gap-2 mt-3">
            <h1 className="font-medium">Spec ToolKit</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>导航</SidebarGroupLabel> */}
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <span className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    首页
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/usage" passHref>
                <SidebarMenuButton asChild isActive={pathname === '/usage'}>
                  <span className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4" />
                    使用说明
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/commands-packages" passHref>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/commands-packages')}>
                  <span className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4" />
                    命令包广场
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/auxiliary" passHref>
                <SidebarMenuButton asChild isActive={isAuxiliaryActive}>
                  <span className="flex items-center gap-2">
                    <LifeBuoyIcon className="h-4 w-4" />
                    辅助依赖
                  </span>
                </SidebarMenuButton>
              </Link>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Link href="/auxiliary/plugin-dependencies" passHref>
                    <SidebarMenuSubButton asChild isActive={isPluginActive}>
                      <span className="flex items-center gap-2">
                        <PuzzleIcon className="h-4 w-4" />
                        插件依赖
                      </span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Link href="/auxiliary/mcp-dependencies" passHref>
                    <SidebarMenuSubButton asChild isActive={isMcpActive}>
                      <span className="flex items-center gap-2">
                        <ServerIcon className="h-4 w-4" />
                        MCP 依赖
                      </span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-gray-500">版本 v{version}</SidebarFooter>
    </Sidebar>
  );
}
