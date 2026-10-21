import { cn } from 'cn';
import { ArrowRightIcon, CheckIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
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
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm duration-200 animate-in fade-in motion-reduce:animate-none sm:p-8',
        chosen !== null && !correct && 'animate-shake',
      )}
    >
      {tag && <span className="text-xs font-medium text-muted-foreground">{tag}</span>}
      <p className="text-lg font-semibold text-balance">{item.q}</p>
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
                'pressable flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-[transform,border-color,background-color,opacity] duration-200',
                chosen === null &&
                  'hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5',
                chosen !== null && isRight && 'scale-[1.02] border-emerald-500 bg-emerald-500/10',
                picked && !isRight && 'border-destructive bg-destructive/10',
                chosen !== null && !isRight && !picked && 'opacity-50',
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold">
                {chosen !== null && isRight ? (
                  <CheckIcon className="size-4 text-emerald-600" />
                ) : picked ? (
                  <XIcon className="size-4 text-destructive" />
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
              className={correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}
            >
              {correct ? '¡Correcto! ' : timedOut ? '¡Se acabó el tiempo! ' : 'No es esa. '}
            </strong>
            {item.why}
          </p>
          <Button onClick={onNext} className="self-start">
            {nextLabel}
            <ArrowRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
