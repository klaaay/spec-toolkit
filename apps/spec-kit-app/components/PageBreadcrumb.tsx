'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon } from 'lucide-react';
import { routeMapping } from '@/constants';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function PageBreadcrumb() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <div className="flex items-center g-0.5">
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>首页</span>
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const segmentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLastItem = index === pathSegments.length - 1;
          const displayName = routeMapping[segment] || segment;

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segmentPath}>{displayName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
