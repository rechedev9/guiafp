import { cn } from 'cn';
import {
  CheckIcon,
  CrownIcon,
  FlameIcon,
  TargetIcon,
  TrophyIcon,
  Volume2Icon,
  VolumeXIcon,
  ZapIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProgressBar } from '@/components/progress-bar';
import { Button } from '@/components/ui/button';
import { today } from '@/lib/dates';
import { DAILY_GOAL, levelOf, multiplier } from '@/lib/game';
import { type Toast, useGameFeed } from '@/stores/game-feed';
import { streak, useStudyStore } from '@/stores/study-store';

export function LevelBadge({ level, className }: { level: number; className?: string }) {
  return (
    <span
      key={level}
      className={cn(
        'flex size-9 shrink-0 animate-pop items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-600 font-bold text-white shadow-md ring-2 shadow-orange-500/30 ring-amber-300/60 tabular-nums',
        className,
      )}
      role="img"
      aria-label={`Nivel ${level}`}
    >
      {level}
    </span>
  );
}

export function XpBar({ xp, className }: { xp: number; className?: string }) {
  const { into, cost } = levelOf(xp);
  return (
    <ProgressBar
      value={into}
      max={cost}
      label="XP hasta el siguiente nivel"
      className={cn('h-2', className)}
      fillClassName="bg-linear-to-r from-amber-400 via-orange-500 to-rose-500"
    />
  );
}

export function StreakFlame({ days }: { days: number }) {
  return (
    <FlameIcon
      className={cn(
        'size-4',
        days > 0 ? 'fill-orange-400 text-orange-500' : 'text-muted-foreground',
      )}
    />
  );
}

function GoalRing({ value, className }: { value: number; className?: string }) {
  const ratio = Math.min(1, value / DAILY_GOAL);
  const done = ratio >= 1;
  const label = `Meta de hoy: ${Math.min(value, DAILY_GOAL)} de ${DAILY_GOAL} XP`;
  return (
    <span
      className={cn('relative flex size-9 shrink-0 items-center justify-center', className)}
      title={label}
      aria-label={label}
      role="img"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" className="stroke-muted" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${ratio * 100} 100`}
          className={cn(
            'transition-[stroke-dasharray] duration-500',
            done ? 'stroke-emerald-500' : 'stroke-primary',
          )}
        />
      </svg>
      {done ? (
        <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <TargetIcon className="size-4 text-primary" />
      )}
    </span>
  );
}

const toastIcons = { level: CrownIcon, badge: TrophyIcon, quest: TargetIcon };

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useGameFeed((state) => state.dismiss);
  const Icon = toastIcons[toast.kind];

  useEffect(() => {
    const id = window.setTimeout(() => dismiss(toast.id), 4000);
    return () => window.clearTimeout(id);
  }, [dismiss, toast.id]);

  return (
    <button
      type="button"
      onClick={() => dismiss(toast.id)}
      className="pointer-events-auto flex w-full animate-pop items-center gap-3 rounded-2xl border border-amber-400/50 bg-card/95 p-3 text-left shadow-lg backdrop-blur sm:w-80"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-600 text-white">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{toast.title}</span>
        <span className="block text-sm text-muted-foreground">{toast.detail}</span>
      </span>
    </button>
  );
}

function Toasts() {
  const toasts = useGameFeed((state) => state.toasts);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-30 flex flex-col items-center gap-2 sm:right-4 sm:left-auto sm:items-end"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export function PlayerHud() {
  const xp = useStudyStore((state) => state.xp);
  const combo = useGameFeed((state) => state.combo);
  const lastGain = useGameFeed((state) => state.lastGain);
  // The gain already shown before this mount must not float again on return to the section.
  const [stale] = useState(lastGain?.id);
  const todayXp = useStudyStore((state) => state.days[String(today())]?.xp ?? 0);
  const days = useStudyStore((state) => streak(state.activity));
  const muted = useStudyStore((state) => state.muted);
  const toggleMute = useStudyStore((state) => state.toggleMute);
  const { level, into, cost, rank } = levelOf(xp);
  const boost = multiplier(combo);

  return (
    <>
      <div className="sticky top-14 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3">
          <LevelBadge level={level} />
          <div className="relative min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="truncate font-semibold">{rank}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {into}/{cost} XP
              </span>
            </div>
            <XpBar xp={xp} className="mt-1" />
            {lastGain && lastGain.id !== stale && (
              <span
                key={lastGain.id}
                aria-hidden
                className="absolute -top-1.5 right-0 animate-xp-float rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white shadow"
              >
                +{lastGain.xp}
              </span>
            )}
          </div>
          {combo >= 3 && (
            <span
              key={boost}
              className="flex shrink-0 animate-pop items-center gap-0.5 rounded-full bg-orange-500/15 px-2 py-1 text-xs font-bold text-orange-600 tabular-nums dark:text-orange-400"
              aria-label={`Combo de ${combo} aciertos`}
            >
              <ZapIcon className="size-3.5 fill-current" />
              {combo}
              {boost > 1 && <span className="ml-0.5">x{boost}</span>}
            </span>
          )}
          <GoalRing value={todayXp} />
          <span
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold tabular-nums sm:flex"
            aria-label={`${days} días seguidos`}
          >
            <StreakFlame days={days} />
            {days}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeXIcon /> : <Volume2Icon />}
          </Button>
        </div>
      </div>
      <Toasts />
    </>
  );
}
