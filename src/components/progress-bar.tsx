import { cn } from 'cn';

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  className?: string;
  fillClassName?: string;
};

export function ProgressBar({ value, max, label, className, fillClassName }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('h-1.5 overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className={cn(
          'h-full rounded-[inherit] transition-[width] duration-300',
          fillClassName ?? 'bg-primary',
        )}
        style={{ width: `${(value / Math.max(max, 1)) * 100}%` }}
      />
    </div>
  );
}
