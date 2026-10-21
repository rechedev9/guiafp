import { cn } from 'cn';
import { ArrowRightIcon, CheckIcon, RotateCcwIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProgressBar } from '@/components/progress-bar';
import { Button } from '@/components/ui/button';
import type { StudyQuiz } from '@/content/study';
import { hasModifier, onControl, shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';

const SESSION = 10;

type Question = { item: StudyQuiz; options: string[] };

const toQuestions = (items: StudyQuiz[]): Question[] =>
  items.map((item) => ({ item, options: shuffle([item.right, ...item.wrong]) }));

function pickSession(
  items: StudyQuiz[],
  answers: Record<string, { right: number; wrong: number }>,
) {
  // Questions never answered right come first: they are where the gaps are.
  const weak = items.filter((item) => {
    const stats = answers[item.id];
    return !stats || stats.wrong >= stats.right;
  });
  const strong = items.filter((item) => !weak.includes(item));
  return toQuestions([...shuffle(weak), ...shuffle(strong)].slice(0, SESSION));
}

export function Quiz({ items }: { items: StudyQuiz[] }) {
  const answers = useStudyStore((state) => state.answers);
  const record = useStudyStore((state) => state.answer);
  const [questions, setQuestions] = useState(() => pickSession(items, answers));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [missed, setMissed] = useState<StudyQuiz[]>([]);
  const current = questions[index];

  function choose(option: string) {
    if (!current || chosen !== null) return;
    const correct = option === current.item.right;
    setChosen(option);
    record(current.item.id, correct);
    if (!correct) setMissed((prev) => [...prev, current.item]);
  }

  function next() {
    setChosen(null);
    setIndex((i) => i + 1);
  }

  function restart(retry: boolean) {
    setQuestions(retry ? toQuestions(shuffle(missed)) : pickSession(items, answers));
    setIndex(0);
    setChosen(null);
    setMissed([]);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!current || hasModifier(event)) return;
      if (chosen !== null && event.key === 'Enter' && !onControl(event)) next();
      const option = current.options[Number(event.key) - 1];
      if (chosen === null && option !== undefined) choose(option);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!current) {
    const score = questions.length - missed.length;
    return (
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-semibold text-primary tabular-nums">
            {score}/{questions.length}
          </span>
          <span className="text-muted-foreground">
            {missed.length === 0
              ? 'Todo bien. Mañana repite otro test.'
              : 'Repasa los fallos ahora, mientras los tienes frescos.'}
          </span>
        </div>
        {missed.length > 0 && (
          <ul className="flex flex-col gap-2">
            {missed.map((item) => (
              <li key={item.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{item.q}</p>
                <p className="text-emerald-700 dark:text-emerald-400">{item.right}</p>
                <p className="text-muted-foreground">{item.why}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {missed.length > 0 && (
            <Button onClick={() => restart(true)}>
              <RotateCcwIcon />
              Repetir los fallos
            </Button>
          )}
          <Button
            variant={missed.length > 0 ? 'outline' : 'default'}
            onClick={() => restart(false)}
          >
            Nuevo test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="tabular-nums">
          Pregunta {index + 1} de {questions.length}
        </span>
        <ProgressBar
          value={index}
          max={questions.length}
          label="Preguntas contestadas"
          className="flex-1"
        />
      </div>
      <div
        key={current.item.id}
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm duration-200 animate-in fade-in motion-reduce:animate-none sm:p-8"
      >
        <p className="text-lg font-semibold text-balance">{current.item.q}</p>
        <div className="flex flex-col gap-2">
          {current.options.map((option, i) => {
            const isRight = option === current.item.right;
            const picked = option === chosen;
            return (
              <button
                key={option}
                type="button"
                disabled={chosen !== null}
                onClick={() => choose(option)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                  chosen === null && 'hover:border-primary/50 hover:bg-primary/5',
                  chosen !== null && isRight && 'border-emerald-500 bg-emerald-500/10',
                  picked && !isRight && 'border-destructive bg-destructive/10',
                  chosen !== null && !isRight && !picked && 'opacity-60',
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                  {chosen !== null && isRight ? (
                    <CheckIcon className="size-3.5" />
                  ) : picked ? (
                    <XIcon className="size-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                {option}
              </button>
            );
          })}
        </div>
        {chosen !== null && (
          <div className="flex flex-col gap-3 border-t pt-4 duration-200 animate-in fade-in motion-reduce:animate-none">
            <p className="text-sm leading-relaxed">
              <strong
                className={
                  chosen === current.item.right
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-destructive'
                }
              >
                {chosen === current.item.right ? '¡Correcto! ' : 'No es esa. '}
              </strong>
              {current.item.why}
            </p>
            <Button onClick={next} className="self-start">
              Siguiente
              <ArrowRightIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
