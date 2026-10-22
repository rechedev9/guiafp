import { RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { StudyQuiz } from '@/content/study';
import { shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { QuestionCard, toQuestions } from '@/study/question-card';
import { SessionBar } from '@/study/session-bar';
import { SessionDone, useSessionXp } from '@/study/session-done';

const SESSION = 10;
const mark = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

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
    return (
      <SessionDone
        xp={session.gained}
        title={missed.length === 0 ? 'Test superado sin fallos' : 'Test terminado'}
        stats={[
          { label: 'Aciertos', value: `${score}/${questions.length}` },
          {
            label: 'Nota',
            value: mark.format(questions.length ? (score / questions.length) * 10 : 0),
          },
          { label: 'Fallos', value: missed.length },
        ]}
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
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Revisa los fallos ahora, mientras están frescos</h4>
            <ul className="flex flex-col divide-y rounded-lg border text-sm">
              {missed.map((item) => (
                <li key={item.id} className="flex flex-col gap-1 p-3">
                  <p className="font-medium">{item.q}</p>
                  <p className="text-success">{item.right}</p>
                  <p className="text-muted-foreground">{item.why}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SessionDone>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SessionBar done={index} total={questions.length} label="Preguntas contestadas" />
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
