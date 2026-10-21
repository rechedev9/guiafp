import { cn } from 'cn';
import { StarIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode, useState } from 'react';
import { useStudyStore } from '@/stores/study-store';

const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];

// Deterministic noise in [0, 1): the same piece lands the same way on every render.
const noise = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 36 }, (_, i) => {
        const style: CSSProperties & Record<`--${string}`, string> = {
          left: `${noise(i, 1) * 100}%`,
          backgroundColor: colors[i % colors.length],
          animationDelay: `${noise(i, 2) * 0.5}s`,
          '--drift': `${(noise(i, 3) - 0.5) * 120}px`,
          '--fall': `${260 + noise(i, 4) * 220}px`,
          '--spin': `${(noise(i, 5) - 0.5) * 1080}deg`,
        };
        return (
          <span
            key={i}
            style={style}
            className={cn(
              'absolute -top-3 animate-confetti',
              i % 3 === 0 ? 'size-2 rounded-full' : 'h-3 w-1.5 rounded-sm',
            )}
          />
        );
      })}
    </div>
  );
}

export function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <div
      role="img"
      className={cn('flex items-end gap-1', className)}
      aria-label={`${count} de 3 estrellas`}
    >
      {[0, 1, 2].map((i) => (
        <StarIcon
          key={i}
          style={{ animationDelay: `${0.15 + i * 0.18}s` }}
          className={cn(
            'animate-pop',
            i === 1 ? 'size-12' : 'size-9',
            i < count
              ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_6px_rgb(245_158_11/0.45)]'
              : 'text-muted-foreground/25',
          )}
        />
      ))}
    </div>
  );
}

export function useSessionXp() {
  const xp = useStudyStore((state) => state.xp);
  const [start, setStart] = useState(xp);
  return { gained: xp - start, reset: () => setStart(xp) };
}

type SessionDoneProps = {
  title: string;
  xp: number;
  stars?: number;
  celebrate?: boolean;
  children?: ReactNode;
  actions: ReactNode;
};

export function SessionDone({ title, xp, stars, celebrate, children, actions }: SessionDoneProps) {
  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
      {celebrate && <Confetti />}
      {stars !== undefined && <Stars count={stars} />}
      <h3 className="text-2xl font-semibold tracking-tight text-balance">{title}</h3>
      {xp > 0 && (
        <p
          style={{ animationDelay: '0.7s' }}
          className="animate-pop rounded-full bg-amber-500/15 px-4 py-1 text-lg font-bold text-amber-700 tabular-nums dark:text-amber-300"
        >
          +{xp} XP
        </p>
      )}
      {children}
      <div className="flex flex-wrap justify-center gap-2">{actions}</div>
    </div>
  );
}
