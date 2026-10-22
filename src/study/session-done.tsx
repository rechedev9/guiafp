import { CheckCircle2Icon } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { type Stat, StatStrip } from '@/components/stat-strip';
import { useStudyStore } from '@/stores/study-store';

export function useSessionXp() {
  const xp = useStudyStore((state) => state.xp);
  const [start, setStart] = useState(xp);
  return { gained: xp - start, reset: () => setStart(xp) };
}

type SessionDoneProps = {
  title: string;
  stats?: Stat[];
  xp?: number;
  children?: ReactNode;
  actions: ReactNode;
};

export function SessionDone({ title, stats, xp, children, actions }: SessionDoneProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-card p-5 duration-200 animate-in fade-in motion-reduce:animate-none sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <CheckCircle2Icon className="size-5 text-success" />
        {title}
      </h3>
      {stats && (
        <StatStrip
          stats={xp === undefined ? stats : [...stats, { label: 'XP', value: `+${xp}` }]}
        />
      )}
      {children}
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}
