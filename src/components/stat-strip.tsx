import { cn } from 'cn';
import type { ReactNode } from 'react';

export type Stat = { label: string; value: ReactNode; hint?: ReactNode };

// The 1px gap over a border-coloured grid draws the dividers between cells.
export function StatStrip({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none',
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-0.5 bg-card p-3 max-sm:odd:last:col-span-2 sm:px-4"
        >
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="text-xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
          {stat.hint && <dd className="text-xs text-muted-foreground">{stat.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}
