import { cn } from 'cn';
import { RotateCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Kbd } from '@/components/kbd';
import { Button } from '@/components/ui/button';
import type { StudyCard } from '@/content/study';
import { today } from '@/lib/dates';
import { canSpeak, hasModifier, onControl, percent, shuffle } from '@/lib/study';
import { type CardState, type Grade, schedule, useStudyStore } from '@/stores/study-store';
import { SessionBar } from '@/study/session-bar';
import { SessionDone, useSessionXp } from '@/study/session-done';
import { SpeakButton } from '@/study/speak-button';

export const NEW_PER_SESSION = 12;
const RETRY_GAP = 3;

const grades: { grade: Grade; label: string; key: string; className: string }[] = [
  { grade: 'again', label: 'Otra vez', key: '1', className: 'text-destructive' },
  { grade: 'hard', label: 'Difícil', key: '2', className: 'text-warning' },
  { grade: 'good', label: 'Bien', key: '3', className: 'text-primary' },
  { grade: 'easy', label: 'Fácil', key: '4', className: 'text-success' },
];

type QueueOptions = { cards: StudyCard[]; states: Record<string, CardState>; mixed: boolean };

function buildQueue({ cards, states, mixed }: QueueOptions) {
  const day = today();
  const due = cards.filter((card) => {
    const state = states[card.id];
    return state !== undefined && state.due <= day;
  });
  const unseen = cards.filter((card) => !states[card.id]);
  // Mixed decks span every subject, so new cards must not all come from the first one.
  const fresh = (mixed ? shuffle(unseen) : unseen).slice(0, NEW_PER_SESSION);
  return mixed ? shuffle([...due, ...fresh]) : [...shuffle(due), ...shuffle(fresh)];
}

function waitLabel(state: CardState | undefined, grade: Grade) {
  const days = schedule(state, grade).due - today();
  if (days === 0) return 'hoy';
  return days === 1 ? '1 día' : `${days} días`;
}

type FlashcardsProps = { cards: StudyCard[]; mixed?: boolean };

export function Flashcards({ cards, mixed = false }: FlashcardsProps) {
  const states = useStudyStore((state) => state.cards);
  const gradeCard = useStudyStore((state) => state.grade);
  const session = useSessionXp();
  const [queue, setQueue] = useState(() => buildQueue({ cards, states, mixed }));
  const [revealed, setRevealed] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [tally, setTally] = useState({ reviewed: 0, again: 0 });
  const current = queue[0];
  // A card graded 'again' goes back into the queue, so it counts once.
  const total = tally.reviewed - tally.again + queue.length;

  function restart(all: boolean) {
    const next = all ? shuffle(cards) : buildQueue({ cards, states, mixed });
    setQueue(next);
    setTally({ reviewed: 0, again: 0 });
    session.reset();
  }

  function grade(value: Grade) {
    if (!current) return;
    const rest = queue.slice(1);
    if (value === 'again') rest.splice(Math.min(RETRY_GAP, rest.length), 0, current);
    const finish = rest.length === 0 ? { perfect: tally.again === 0 } : undefined;
    gradeCard({ id: current.id, grade: value, finish });
    setQueue(rest);
    setRevealed(false);
    setAttempt('');
    setTally((prev) => ({
      reviewed: prev.reviewed + 1,
      again: prev.again + (value === 'again' ? 1 : 0),
    }));
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (
        hasModifier(event) ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement
      ) {
        return;
      }
      if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
        if (onControl(event)) return;
        event.preventDefault();
        setRevealed(true);
        return;
      }
      const match = grades.find((g) => g.key === event.key);
      if (revealed && match) grade(match.grade);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!current) {
    const remembered = tally.reviewed - tally.again;
    return (
      <SessionDone
        title={tally.reviewed > 0 ? 'Sesión terminada' : 'Nada pendiente por ahora'}
        xp={session.gained}
        stats={
          tally.reviewed > 0
            ? [
                { label: 'Repasos', value: tally.reviewed },
                {
                  label: 'Recordadas',
                  value: `${percent(remembered, tally.reviewed)} %`,
                },
                { label: 'Para repetir', value: tally.again },
              ]
            : undefined
        }
        actions={
          <>
            <Button onClick={() => restart(false)}>
              <RotateCcwIcon />
              Buscar más tarjetas
            </Button>
            <Button variant="outline" onClick={() => restart(true)}>
              Practicar el mazo entero
            </Button>
          </>
        }
      >
        <p className="max-w-prose text-sm text-muted-foreground">
          {tally.reviewed > 0
            ? 'Las que sabías volverán dentro de unos días, justo antes de olvidarlas.'
            : 'Las tarjetas aparecen cuando toca repasarlas. Vuelve mañana o practica el mazo entero ahora.'}
        </p>
      </SessionDone>
    );
  }

  const state = states[current.id];
  const done = total - queue.length;

  return (
    <div className="flex flex-col gap-3">
      <SessionBar done={done} total={total} label="Tarjetas repasadas">
        <span className="shrink-0">{state ? 'Repaso' : 'Nueva'}</span>
      </SessionBar>

      <div
        key={current.id}
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border bg-card duration-200 animate-in fade-in motion-reduce:animate-none',
          !revealed && 'min-h-56',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
          <span className="text-xs font-medium text-muted-foreground">
            {mixed ? current.subject.title : 'Pregunta'}
          </span>
          <SpeakButton text={current.front} lang={current.subject.speak} />
        </div>
        <p className="px-5 pt-1 pb-6 text-xl leading-snug font-medium text-balance sm:px-7 sm:text-2xl">
          {current.front}
        </p>

        {revealed ? (
          <div className="flex flex-col gap-2 border-t bg-muted/40 px-5 py-5 duration-200 animate-in fade-in motion-reduce:animate-none sm:px-7">
            {attempt.trim() && (
              <p className="text-sm text-muted-foreground">
                Tu respuesta: <span className="text-foreground">{attempt}</span>
              </p>
            )}
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg leading-relaxed">{current.back}</p>
              {/* Foreign words sit on the front; the back is foreign only after a Spanish prompt. */}
              {!canSpeak(current.front) && (
                <SpeakButton text={current.back} lang={current.subject.speak} />
              )}
            </div>
          </div>
        ) : (
          <form
            className="mt-auto flex flex-col gap-3 border-t px-5 py-5 sm:px-7"
            onSubmit={(event) => {
              event.preventDefault();
              setRevealed(true);
            }}
          >
            <textarea
              value={attempt}
              onChange={(event) => setAttempt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  setRevealed(true);
                }
              }}
              rows={2}
              aria-label="Tu respuesta, opcional"
              placeholder="Escribe la respuesta de memoria antes de mirar (opcional)"
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="flex items-center gap-3">
              <Button type="submit" size="lg">
                Mostrar respuesta
              </Button>
              <Kbd className="hidden sm:inline-flex">Espacio</Kbd>
            </div>
          </form>
        )}
      </div>

      {revealed && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-lg border bg-border">
            {grades.map((g) => (
              <button
                key={g.grade}
                type="button"
                onClick={() => grade(g.grade)}
                className="flex min-h-16 flex-col items-center justify-center gap-0.5 bg-card px-1 py-2 transition-colors hover:bg-muted"
              >
                <span className={cn('text-sm font-semibold', g.className)}>{g.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {waitLabel(state, g.grade)}
                </span>
                <Kbd className="mt-1 hidden sm:inline-flex">{g.key}</Kbd>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Debajo de cada botón, cuándo volverá la tarjeta. Valora con sinceridad.
          </p>
        </div>
      )}
    </div>
  );
}
