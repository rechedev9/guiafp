import { cn } from 'cn';
import { EyeIcon, RotateCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StudyCard } from '@/content/study';
import { today } from '@/lib/dates';
import { starsFor } from '@/lib/game';
import { canSpeak, hasModifier, onControl, shuffle } from '@/lib/study';
import { type CardState, type Grade, schedule, useStudyStore } from '@/stores/study-store';
import { SessionDone, useSessionXp } from '@/study/celebration';
import { SpeakButton } from '@/study/speak-button';

const NEW_PER_SESSION = 12;
const RETRY_GAP = 3;

const grades: { grade: Grade; label: string; key: string; className: string }[] = [
  {
    grade: 'again',
    label: 'Otra vez',
    key: '1',
    className: 'border-destructive/40 text-destructive',
  },
  {
    grade: 'hard',
    label: 'Difícil',
    key: '2',
    className: 'border-amber-500/50 text-amber-700 dark:text-amber-400',
  },
  { grade: 'good', label: 'Bien', key: '3', className: 'border-primary/50 text-primary' },
  {
    grade: 'easy',
    label: 'Fácil',
    key: '4',
    className: 'border-emerald-500/50 text-emerald-700 dark:text-emerald-400',
  },
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
    return (
      <SessionDone
        title={tally.reviewed > 0 ? '¡Sesión terminada!' : 'No te toca repasar nada'}
        xp={session.gained}
        stars={
          tally.reviewed > 0 ? starsFor(tally.reviewed - tally.again, tally.reviewed) : undefined
        }
        celebrate={tally.reviewed > 0}
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
        <p className="max-w-md text-sm text-muted-foreground">
          {tally.reviewed > 0
            ? `Has repasado ${tally.reviewed} tarjetas (${tally.again} para repetir). Las que sabías volverán dentro de unos días, justo antes de olvidarlas.`
            : 'Las tarjetas aparecen cuando toca repasarlas. Vuelve mañana o practica el mazo entero ahora.'}
        </p>
      </SessionDone>
    );
  }

  const state = states[current.id];
  const done = total - queue.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {Math.min(done + 1, total)} de {total}
        </span>
        <ProgressBar value={done} max={total} label="Tarjetas repasadas" className="flex-1" />
        <Badge variant={state ? 'secondary' : 'outline'}>{state ? 'Repaso' : 'Nueva'}</Badge>
      </div>

      <div
        key={current.id}
        className="flex min-h-64 flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm duration-200 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-3">
          {mixed ? (
            <Badge variant="outline">{current.subject.title}</Badge>
          ) : (
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Pregunta
            </span>
          )}
          <SpeakButton text={current.front} lang={current.subject.speak} />
        </div>
        <p className="text-xl font-semibold text-balance sm:text-2xl">{current.front}</p>

        {revealed ? (
          <div className="flex flex-col gap-3 border-t pt-4 duration-200 animate-in fade-in motion-reduce:animate-none">
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
            className="mt-auto flex flex-col gap-3"
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
              placeholder="Intenta responder de memoria antes de mirar (opcional)"
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <Button type="submit" size="lg" className="self-start">
              <EyeIcon />
              Ver respuesta
            </Button>
          </form>
        )}
      </div>

      {revealed && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            ¿Cómo te ha ido? Responde con sinceridad: así se ajusta el repaso.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {grades.map((g) => (
              <Button
                key={g.grade}
                variant="outline"
                onClick={() => grade(g.grade)}
                className={cn('pressable h-auto flex-col gap-0.5 py-2', g.className)}
              >
                <span className="font-semibold">{g.label}</span>
                <span className="text-xs text-muted-foreground">{waitLabel(state, g.grade)}</span>
              </Button>
            ))}
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Atajos: espacio para ver la respuesta, teclas 1 a 4 para valorar.
          </p>
        </div>
      )}
    </div>
  );
}
