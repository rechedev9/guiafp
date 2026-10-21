import { RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { ProgressBar } from '@/components/progress-bar';
import { Button } from '@/components/ui/button';
import type { StudyQuiz } from '@/content/study';
import { starsFor } from '@/lib/game';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { SessionDone, useSessionXp } from '@/study/celebration';
import { QuestionCard, toQuestions } from '@/study/question-card';

const SESSION = 10;

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
  const complete = useStudyStore((state) => state.complete);
  const session = useSessionXp();
  const [questions, setQuestions] = useState(() => pickSession(items, answers));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [missed, setMissed] = useState<StudyQuiz[]>([]);
  const [retry, setRetry] = useState(false);
  const current = questions[index];

  function choose(option: string) {
    if (!current || chosen !== null) return;
    const correct = option === current.item.right;
    setChosen(option);
    record({ id: current.item.id, correct });
    if (!correct) setMissed((prev) => [...prev, current.item]);
  }

  function next() {
    if (index + 1 === questions.length) complete({ perfect: !retry && missed.length === 0 });
    setChosen(null);
    setIndex((i) => i + 1);
  }

  function restart(again: boolean) {
    setQuestions(again ? toQuestions(shuffle(missed)) : pickSession(items, answers));
    setRetry(again);
    setIndex(0);
    setChosen(null);
    setMissed([]);
    session.reset();
  }

  if (!current) {
    const score = questions.length - missed.length;
    const stars = starsFor(score, questions.length);
    return (
      <SessionDone
        title={
          missed.length === 0 ? '¡Pleno! Ni un fallo' : `${score} de ${questions.length} aciertos`
        }
        xp={session.gained}
        stars={stars}
        celebrate={stars >= 2}
        actions={
          <>
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
          </>
        }
      >
        {missed.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              Repasa los fallos ahora, mientras los tienes frescos.
            </p>
            <ul className="flex w-full flex-col gap-2 text-left">
              {missed.map((item) => (
                <li key={item.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{item.q}</p>
                  <p className="text-emerald-700 dark:text-emerald-400">{item.right}</p>
                  <p className="text-muted-foreground">{item.why}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </SessionDone>
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
      <QuestionCard
        key={current.item.id}
        question={current}
        chosen={chosen}
        onChoose={choose}
        onNext={next}
        nextLabel={index + 1 === questions.length ? 'Ver resultado' : 'Siguiente'}
      />
    </div>
  );
}
