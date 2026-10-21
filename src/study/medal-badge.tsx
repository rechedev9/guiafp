import { cn } from 'cn';
import { MedalIcon } from 'lucide-react';
import { medalOf } from '@/lib/game';

const medalStyles = {
  bronce: 'bg-orange-700/10 text-orange-800 dark:text-orange-300',
  plata: 'bg-slate-400/20 text-slate-700 dark:text-slate-200',
  oro: 'bg-yellow-400/25 text-yellow-800 dark:text-yellow-300',
};

export function MedalBadge({ mastered, total }: { mastered: number; total: number }) {
  const medal = medalOf(mastered, total);
  if (!medal) return null;
  return (
    <span
      className={cn(
        'inline-flex animate-pop items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize',
        medalStyles[medal],
      )}
      title="Medalla según las tarjetas dominadas: bronce 20 %, plata 50 %, oro 90 %"
    >
      <MedalIcon className="size-3.5" />
      {medal}
    </span>
  );
}
