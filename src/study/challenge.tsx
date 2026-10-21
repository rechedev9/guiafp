import { cn } from 'cn';
import { HeartIcon, PlayIcon, RotateCcwIcon, SwordsIcon, TrophyIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { allQuiz, findSubject, subjectSlugOf } from '@/content/study';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { SessionDone, useSessionXp } from '@/study/celebration';
import { QuestionCard, toQuestions } from '@/study/question-card';

const LIVES = 3;

const newDeck = () => toQuestions(shuffle(allQuiz()));
const hits = (n: number) => `${n} ${n === 1 ? 'acierto' : 'aciertos'}`;
const runStars = (run: number) => (run >= 15 ? 3 : run >= 8 ? 2 : run >= 3 ? 1 : 0);

function Hearts({ lives }: { lives: number }) {
  return (
    <span role="img" className="flex items-center gap-1" aria-label={`${lives} vidas`}>
      {Array.from({ length: LIVES }, (_, i) => (
        <HeartIcon
          key={`${i}-${i < lives}`}
          className={cn(
            'size-6 transition-colors',
            i < lives ? 'fill-rose-500 text-rose-500' : 'animate-shake text-muted-foreground/30',
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

  // An empty choice means the countdown ran out, which costs a life like a wrong answer.
  function choose(option: string) {
    if (!current || chosen !== null) return;
    const correct = option === current.item.right;
    setChosen(option);
    // Losing the last life ends the run here, so leaving before the results still saves it.
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
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border bg-linear-to-br from-rose-500/10 via-card to-amber-500/10 p-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30">
          <SwordsIcon className="size-8" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Desafío de supervivencia</h2>
          <p className="max-w-md text-muted-foreground">
            Preguntas de todas las asignaturas mezcladas. Tienes 3 vidas y 20 segundos por pregunta.
            ¿Hasta dónde llegas?
          </p>
        </div>
        <Hearts lives={LIVES} />
        {best > 0 && (
          <p className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
            <TrophyIcon className="size-4 text-amber-500" />
            Tu récord: {hits(best)}
          </p>
        )}
        <Button size="lg" onClick={start}>
          <PlayIcon />
          Empezar
        </Button>
      </div>
    );
  }

  if (!current || (lives === 0 && chosen === null)) {
    const isRecord = run > bestBefore;
    return (
      <SessionDone
        title={isRecord ? `¡Nuevo récord! ${hits(run)}` : hits(run)}
        xp={session.gained}
        stars={runStars(run)}
        celebrate={isRecord || run >= 8}
        actions={
          <Button onClick={start}>
            <RotateCcwIcon />
            Otra partida
          </Button>
        }
      >
        <p className="max-w-sm text-sm text-muted-foreground">
          {isRecord
            ? 'Has superado tu mejor marca.'
            : best > 0
              ? `Tu récord está en ${hits(best)}.`
              : 'A la próxima cae el primero.'}{' '}
          Las preguntas falladas saldrán antes en el Test de cada asignatura.
        </p>
      </SessionDone>
    );
  }

  const subject = findSubject(subjectSlugOf(current.item.id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Hearts lives={lives} />
        <span className="text-lg font-bold tabular-nums">
          {run} <span className="text-sm font-normal text-muted-foreground">aciertos</span>
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
          <TrophyIcon className="size-4 text-amber-500" />
          {Math.max(bestBefore, run)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
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
