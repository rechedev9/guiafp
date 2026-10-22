import { cn } from 'cn';
import { RotateCcwIcon, TimerIcon } from 'lucide-react';
import { useState } from 'react';
import { StatStrip } from '@/components/stat-strip';
import { Button } from '@/components/ui/button';
import { allQuiz, findSubject, subjectSlugOf } from '@/content/study';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { QuestionCard, toQuestions } from '@/study/question-card';
import { SessionDone, useSessionXp } from '@/study/session-done';

const LIVES = 3;

const newDeck = () => toQuestions(shuffle(allQuiz()));
const hits = (n: number) => `${n} ${n === 1 ? 'acierto' : 'aciertos'}`;

function Misses({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: LIVES }, (_, i) => (
        <span
          key={i}
          className={cn(
            'size-2 rounded-full',
            i < count ? 'bg-destructive' : 'bg-muted-foreground/25',
          )}
        />
      ))}
    </span>
  );
}

export function Challenge() {
  const best = useStudyStore((state) => state.totals.bestRun);
  const record = useStudyStore((state) => state.answer);
  const complete = useStudyStore((state) => state.complete);
  const session = useSessionXp();
  const [deck, setDeck] = useState(newDeck);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [lives, setLives] = useState(LIVES);
  const [run, setRun] = useState(0);
  const [bestBefore, setBestBefore] = useState(best);
  const current = deck[index];

  // An empty choice means the countdown ran out, which counts as a miss.
  function choose(option: string) {
    if (!current || chosen !== null) return;
    const correct = option === current.item.right;
    setChosen(option);
    // The third miss ends the run here, so leaving before the results still saves it.
    const finish = !correct && lives === 1 ? { perfect: false, run } : undefined;
    record({ id: current.item.id, correct, finish });
    if (correct) setRun((n) => n + 1);
    else setLives((n) => n - 1);
  }

  function next() {
    if (lives > 0 && index + 1 === deck.length) complete({ perfect: false, run });
    setChosen(null);
    setIndex((i) => i + 1);
  }

  function start() {
    setDeck(newDeck());
    setIndex(0);
    setChosen(null);
    setLives(LIVES);
    setRun(0);
    setBestBefore(best);
    setPlaying(true);
    session.reset();
  }

  if (!playing) {
    return (
      <div className="flex flex-col gap-5 rounded-lg border bg-card p-5 sm:p-7">
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>
            Preguntas de test de las {deck.length} que hay en todas las asignaturas, mezcladas.
          </li>
          <li>20 segundos por pregunta. Si se acaba el tiempo, cuenta como fallo.</li>
          <li>La ronda termina al tercer fallo. Las falladas salen antes en el Test.</li>
        </ul>
        <StatStrip
          className="max-w-md"
          stats={[
            { label: 'Tu récord', value: best > 0 ? hits(best) : 'Sin marca' },
            { label: 'Fallos permitidos', value: LIVES - 1 },
          ]}
        />
        <Button size="lg" className="self-start" onClick={start}>
          <TimerIcon />
          Empezar ronda
        </Button>
      </div>
    );
  }

  if (!current || (lives === 0 && chosen === null)) {
    const isRecord = run > bestBefore;
    return (
      <SessionDone
        xp={session.gained}
        title={isRecord ? `Nuevo récord: ${hits(run)}` : 'Ronda terminada'}
        stats={[
          { label: 'Aciertos', value: run },
          { label: 'Récord', value: Math.max(run, bestBefore) },
        ]}
        actions={
          <Button onClick={start}>
            <RotateCcwIcon />
            Otra ronda
          </Button>
        }
      >
        <p className="max-w-prose text-sm text-muted-foreground">
          Las preguntas falladas saldrán antes en el Test de cada asignatura.
        </p>
      </SessionDone>
    );
  }

  const subject = findSubject(subjectSlugOf(current.item.id));
  const misses = LIVES - lives;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          Aciertos <span className="font-medium text-foreground">{run}</span>
        </span>
        <span
          role="img"
          aria-label={`${misses} de ${LIVES} fallos`}
          className="flex items-center gap-2"
        >
          Fallos <Misses count={misses} />
        </span>
        <span className="tabular-nums">
          Récord <span className="font-medium text-foreground">{Math.max(bestBefore, run)}</span>
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div
          key={current.item.id}
          onAnimationEnd={() => choose('')}
          style={{ animationPlayState: chosen === null ? 'running' : 'paused' }}
          className="h-full origin-left animate-countdown rounded-full"
        />
      </div>
      <QuestionCard
        key={current.item.id}
        question={current}
        chosen={chosen}
        onChoose={choose}
        onNext={next}
        tag={subject?.title}
        timedOut={chosen === ''}
        nextLabel={lives === 0 || index + 1 === deck.length ? 'Ver resultado' : 'Siguiente'}
      />
    </div>
  );
}
