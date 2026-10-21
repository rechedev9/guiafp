import { cn } from 'cn';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, RotateCcwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Sequence } from '@/content/study/types';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { Stars } from '@/study/celebration';

type Item = { label: string; detail: string; position: number };

function scramble(sequence: Sequence): Item[] {
  const items = sequence.items.map(([label, detail], position) => ({ label, detail, position }));
  let order = shuffle(items);
  while (items.length > 1 && order.every((item, i) => item.position === i)) order = shuffle(items);
  return order;
}

type SequenceGameProps = { sequence: Sequence; recordKey: string };

function SequenceBoard({ sequence, recordKey }: SequenceGameProps) {
  const record = useStudyStore((state) => state.answer);
  const complete = useStudyStore((state) => state.complete);
  const [order, setOrder] = useState(() => scramble(sequence));
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inOrder = order.every((item, i) => item.position === i);
  const solved = checked && inOrder;

  function move(from: number, to: number) {
    const item = order[from];
    if (!item || to < 0 || to >= order.length) return;
    const next = order.filter((_, i) => i !== from);
    next.splice(to, 0, item);
    setOrder(next);
    setChecked(false);
  }

  function check() {
    if (attempts === 0) {
      record({ id: recordKey, correct: inOrder, finish: inOrder ? { perfect: true } : undefined });
    } else if (inOrder) {
      complete({ perfect: false });
    }
    setAttempts((n) => n + 1);
    setChecked(true);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:p-6">
      <div>
        <h3 className="font-semibold">{sequence.title}</h3>
        <p className="text-sm text-muted-foreground">{sequence.instruction}</p>
      </div>
      <ol className="flex flex-col gap-2">
        {order.map((item, i) => {
          const ok = item.position === i;
          return (
            <li
              key={item.label}
              className={cn(
                'flex items-center gap-2 rounded-xl border bg-background p-2 pl-3 transition-colors duration-200',
                checked && ok && 'border-emerald-500/60 bg-emerald-500/10',
                checked && !ok && 'border-destructive/50 bg-destructive/5',
              )}
            >
              <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="leading-snug font-medium">{item.label}</p>
                {solved && item.detail && (
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                )}
              </div>
              {checked &&
                (ok ? (
                  <CheckIcon className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XIcon className="size-4 shrink-0 text-destructive" />
                ))}
              <div className="flex shrink-0 flex-col">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Subir ${item.label}`}
                  disabled={i === 0 || solved}
                  onClick={() => move(i, i - 1)}
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Bajar ${item.label}`}
                  disabled={i === order.length - 1 || solved}
                  onClick={() => move(i, i + 1)}
                >
                  <ArrowDownIcon />
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        {solved ? (
          <>
            <Stars count={attempts === 1 ? 3 : attempts === 2 ? 2 : 1} className="[&_svg]:size-6" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {attempts === 1 ? '¡Perfecto a la primera!' : `Conseguido en ${attempts} intentos.`}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setOrder(scramble(sequence));
                setChecked(false);
                setAttempts(0);
              }}
            >
              <RotateCcwIcon />
              Otra vez
            </Button>
          </>
        ) : (
          <>
            <Button onClick={check}>Comprobar</Button>
            {checked && (
              <p className="text-sm text-muted-foreground">
                Las marcadas en rojo no están en su sitio. Muévelas y vuelve a comprobar.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function SequenceGame({ sequences, slug }: { sequences: Sequence[]; slug: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sequences.map((sequence) => (
        <SequenceBoard
          key={sequence.title}
          sequence={sequence}
          recordKey={`${slug}/seq/${sequence.title}`}
        />
      ))}
    </div>
  );
}
