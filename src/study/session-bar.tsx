import type { ReactNode } from 'react';
import { ProgressBar } from '@/components/progress-bar';

type SessionBarProps = { done: number; total: number; label: string; children?: ReactNode };

export function SessionBar({ done, total, label, children }: SessionBarProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="shrink-0 font-mono tabular-nums">
        {Math.min(done + 1, total)}/{total}
      </span>
      <ProgressBar value={done} max={total} label={label} className="flex-1" />
      {children}
    </div>
  );
}
