import { cn } from 'cn';
import { ArrowRightIcon, CheckIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Kbd } from '@/components/kbd';
import { Button } from '@/components/ui/button';
import type { StudyQuiz } from '@/content/study';
import { hasModifier, onControl, shuffle } from '@/lib/study';

export type Question = { item: StudyQuiz; options: string[] };

export const toQuestions = (items: StudyQuiz[]): Question[] =>
  items.map((item) => ({ item, options: shuffle([item.right, ...item.wrong]) }));

type QuestionCardProps = {
  question: Question;
  chosen: string | null;
  onChoose: (option: string) => void;
  onNext: () => void;
  tag?: string;
  nextLabel?: string;
  timedOut?: boolean;
};

export function QuestionCard({
  question,
  chosen,
  onChoose,
  onNext,
  tag,
  nextLabel = 'Siguiente',
  timedOut = false,
}: QuestionCardProps) {
  const { item, options } = question;
  const correct = chosen === item.right;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (hasModifier(event)) return;
      if (chosen !== null && event.key === 'Enter' && !onControl(event)) onNext();
      const option = options[Number(event.key) - 1];
      if (chosen === null && option !== undefined) onChoose(option);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-card p-5 duration-200 animate-in fade-in motion-reduce:animate-none sm:p-7">
      <div className="flex flex-col gap-2">
        {tag && <span className="text-xs font-medium text-muted-foreground">{tag}</span>}
        <p className="text-lg leading-snug font-medium text-balance sm:text-xl">{item.q}</p>
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          const isRight = option === item.right;
          const picked = option === chosen;
          return (
            <button
              key={option}
              type="button"
              disabled={chosen !== null}
              onClick={() => onChoose(option)}
              className={cn(
                'flex min-h-12 items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors duration-150',
                chosen === null && 'hover:border-primary/40 hover:bg-accent',
                chosen !== null && isRight && 'border-success/60 bg-success/10',
                picked && !isRight && 'border-destructive/60 bg-destructive/10',
                chosen !== null && !isRight && !picked && 'text-muted-foreground',
              )}
            >
              {chosen !== null && isRight ? (
                <CheckIcon className="size-5 shrink-0 text-success" />
              ) : picked ? (
                <XIcon className="size-5 shrink-0 text-destructive" />
              ) : (
                <Kbd className="h-5 w-5">{i + 1}</Kbd>
              )}
              {option}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div className="flex flex-col gap-4 border-t pt-4 duration-200 animate-in fade-in motion-reduce:animate-none">
          <p className="text-sm leading-relaxed">
            <strong className={correct ? 'text-success' : 'text-destructive'}>
              {correct ? 'Correcto. ' : timedOut ? 'Se acabó el tiempo. ' : 'Incorrecto. '}
            </strong>
            {item.why}
          </p>
          <div className="flex items-center gap-3">
            <Button size="lg" onClick={onNext}>
              {nextLabel}
              <ArrowRightIcon />
            </Button>
            <Kbd className="hidden sm:inline-flex">Intro</Kbd>
          </div>
        </div>
      )}
    </div>
  );
}
