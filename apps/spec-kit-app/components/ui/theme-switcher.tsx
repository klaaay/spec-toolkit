'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'github-light', name: 'GitHub Light' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'nord', name: 'Nord' },
  { id: 'one-dark-pro', name: 'One Dark Pro' },
  { id: 'solarized-light', name: 'Solarized Light' },
  { id: 'min-dark', name: 'Minimal Dark' },
  { id: 'vitesse-dark', name: 'Vitesse Dark' },
];

interface ThemeSwitcherProps {
  currentTheme: string;
  onChange: (theme: string) => void;
  className?: string;
}

export function ThemeSwitcher({ currentTheme, onChange, className }: ThemeSwitcherProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {themes.map(theme => (
        <button
          key={theme.id}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md border transition-colors',
            currentTheme === theme.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card hover:bg-secondary/50 border-border',
          )}
          onClick={() => onChange(theme.id)}>
          <span className="flex items-center gap-1.5">
            {currentTheme === theme.id && <Check className="h-3.5 w-3.5" />}
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}
