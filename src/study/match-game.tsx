import { cn } from 'cn';
import { RotateCcwIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { StudyCard } from '@/content/study';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';

const PAIRS = 6;
const PENALTY_MS = 3000;
const fits = (card: StudyCard) => card.front.length <= 42 && card.back.length <= 60;

type Side = 'left' | 'right';
type Tile = { id: string; text: string };
type Round = Record<Side, Tile[]>;
type Pick = { side: Side; id: string; at: number };

function newRound(pool: StudyCard[]): Round {
  const fronts = new Set<string>();
  const backs = new Set<string>();
  // Two tiles with the same text would make a right pair count as a mistake.
  const picked = shuffle(pool)
    .filter((card) => {
      if (fronts.has(card.front) || backs.has(card.back)) return false;
      fronts.add(card.front);
      backs.add(card.back);
      return true;
    })
    .slice(0, PAIRS);
  return {
    left: shuffle(picked.map((card) => ({ id: card.id, text: card.front }))),
    right: shuffle(picked.map((card) => ({ id: card.id, text: card.back }))),
  };
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

type MatchGameProps = { cards: StudyCard[]; recordKey: string };

export function MatchGame({ cards, recordKey }: MatchGameProps) {
  const pool = cards.filter(fits);
  const best = useStudyStore((state) => state.bestTimes[recordKey]);
  const saveTime = useStudyStore((state) => state.saveTime);
  const [round, setRound] = useState(() => newRound(pool));
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const total = round.left.length;
  const running = startedAt !== null && finalTime === null;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setNow(performance.now()), 200);
    return () => window.clearInterval(id);
  }, [running]);

  // Event timestamps share the performance.now() clock and keep render pure.
  function pick({ side, id, at }: Pick) {
    if (matched.includes(id) || finalTime !== null) return;
    const start = startedAt ?? at;
    if (startedAt === null) {
      setStartedAt(at);
      setNow(at);
    }
    const nextLeft = side === 'left' ? id : left;
    const nextRight = side === 'right' ? id : right;
    if (!nextLeft || !nextRight) {
      setLeft(nextLeft);
      setRight(nextRight);
      return;
    }
    setLeft(null);
    setRight(null);
    if (nextLeft === nextRight) {
      const done = [...matched, nextLeft];
      setMatched(done);
      if (done.length === total) {
        const time = at - start + mistakes * PENALTY_MS;
        setFinalTime(time);
        saveTime(recordKey, time);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrong([`left:${nextLeft}`, `right:${nextRight}`]);
      window.setTimeout(() => setWrong([]), 500);
    }
  }

  function reset() {
    setRound(newRound(pool));
    setLeft(null);
    setRight(null);
    setMatched([]);
    setMistakes(0);
    setStartedAt(null);
    setFinalTime(null);
  }

  if (pool.length < 4) {
    return (
      <p className="text-muted-foreground">Esta unidad no tiene parejas cortas para este juego.</p>
    );
  }

  const elapsed = finalTime ?? (startedAt === null ? 0 : now - startedAt + mistakes * PENALTY_MS);

  function tileClass(side: Side, id: string) {
    const selected = (side === 'left' ? left : right) === id;
    return cn(
      'min-h-14 rounded-xl border bg-card px-3 py-2 text-left text-sm leading-snug transition-[opacity,transform,border-color,background-color] duration-200 sm:text-base',
      'hover:border-primary/50 active:scale-[0.98]',
      selected && 'border-primary bg-primary/10 ring-2 ring-primary/30',
      wrong.includes(`${side}:${id}`) && 'animate-shake border-destructive bg-destructive/10',
      matched.includes(id) &&
        'pointer-events-none scale-95 border-emerald-500/40 bg-emerald-500/10 opacity-40',
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 font-medium tabular-nums">
          <TimerIcon className="size-4 text-primary" />
          {seconds(elapsed)}
        </span>
        <span className="text-muted-foreground tabular-nums">
          {matched.length}/{total} parejas · {mistakes} fallos (+3 s cada uno)
        </span>
        {best !== undefined && (
          <span className="flex items-center gap-1.5 text-muted-foreground tabular-nums">
            <TrophyIcon className="size-4 text-amber-500" />
            Récord {seconds(best)}
          </span>
        )}
      </div>

      {finalTime !== null ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
          <TrophyIcon className="size-10 text-amber-500" />
          <p className="text-lg font-semibold">
            {best !== undefined && finalTime <= best ? '¡Nuevo récord! ' : ''}
            {seconds(finalTime)}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Cada ronda saca parejas distintas. Intenta bajar tu tiempo sin fallos.
          </p>
          <Button onClick={reset}>
            <RotateCcwIcon />
            Otra ronda
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {(['left', 'right'] as const).map((side) => (
            <div key={side} className="flex flex-col gap-2 sm:gap-3">
              {round[side].map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={(event) => pick({ side, id: tile.id, at: event.timeStamp })}
                  className={tileClass(side, tile.id)}
                >
                  {tile.text}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Toca un elemento de la izquierda y su pareja de la derecha. El reloj empieza con el primer
        toque.
      </p>
    </div>
  );
}
