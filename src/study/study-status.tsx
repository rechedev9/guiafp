import { cn } from 'cn';
import {
  AwardIcon,
  FlameIcon,
  TargetIcon,
  TrendingUpIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { today } from '@/lib/dates';
import { DAILY_GOAL, levelOf } from '@/lib/game';
import { type Toast, useGameFeed } from '@/stores/game-feed';
import { streak, useStudyStore } from '@/stores/study-store';

function GoalRing({ value }: { value: number }) {
  const ratio = Math.min(1, value / DAILY_GOAL);
  return (
    <svg viewBox="0 0 36 36" aria-hidden className="size-5 -rotate-90">
      <circle cx="18" cy="18" r="14" fill="none" strokeWidth="5" className="stroke-muted" />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${ratio * 100} 100`}
        className={cn(
          'transition-[stroke-dasharray] duration-500',
          ratio >= 1 ? 'stroke-success' : 'stroke-primary',
        )}
      />
    </svg>
  );
}

const toastIcons = { level: TrendingUpIcon, badge: AwardIcon, quest: TargetIcon };

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useGameFeed((state) => state.dismiss);
  const Icon = toastIcons[toast.kind];

  useEffect(() => {
    const id = window.setTimeout(() => dismiss(toast.id), 4000);
    return () => window.clearTimeout(id);
  }, [dismiss, toast.id]);

  return (
    <div className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-popover p-3 text-sm shadow-lg duration-200 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:w-80">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{toast.title}</span>
        <span className="block text-muted-foreground">{toast.detail}</span>
      </span>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Cerrar aviso"
        className="-m-1 rounded p-1 text-muted-foreground hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

export function Toasts() {
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

export function StudyStatus() {
  const xp = useStudyStore((state) => state.xp);
  const todayXp = useStudyStore((state) => state.days[String(today())]?.xp ?? 0);
  const days = useStudyStore((state) => streak(state.activity));
  const muted = useStudyStore((state) => state.muted);
  const toggleMute = useStudyStore((state) => state.toggleMute);
  const { level } = levelOf(xp);

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground tabular-nums">
      <span
        role="img"
        className="flex items-center gap-1.5"
        title="Meta diaria"
        aria-label={`Meta de hoy: ${Math.min(todayXp, DAILY_GOAL)} de ${DAILY_GOAL} XP`}
      >
        <GoalRing value={todayXp} />
        <span aria-hidden>
          <span className="font-medium text-foreground">{Math.min(todayXp, DAILY_GOAL)}</span>/
          {DAILY_GOAL}
        </span>
      </span>
      <span
        role="img"
        className="hidden items-center gap-1 min-[400px]:flex"
        title="Días seguidos"
        aria-label={days === 1 ? '1 día seguido' : `${days} días seguidos`}
      >
        <FlameIcon className={cn('size-4', days > 0 && 'text-warning')} />
        <span className="font-medium text-foreground">{days}</span>
      </span>
      <span className="hidden font-medium sm:inline" title={`${xp} XP en total`}>
        Nivel <span className="text-foreground">{level}</span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2"
        onClick={toggleMute}
        aria-label="Sonido"
        aria-pressed={!muted}
      >
        {muted ? <VolumeXIcon /> : <Volume2Icon />}
      </Button>
    </div>
  );
}
