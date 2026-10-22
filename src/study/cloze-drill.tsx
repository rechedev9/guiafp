import { ArrowRightIcon, LightbulbIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { StudyCloze } from '@/content/study';
import { isCorrect, shuffle } from '@/lib/study';
import { useStudyStore } from '@/stores/study-store';
import { SessionBar } from '@/study/session-bar';
import { SessionDone, useSessionXp } from '@/study/session-done';
import { SpeakButton } from '@/study/speak-button';

const SESSION = 12;

type ClozeDrillProps = { items: StudyCloze[]; lang?: string };

export function ClozeDrill({ items, lang }: ClozeDrillProps) {
  const record = useStudyStore((state) => state.answer);
  const hit = useStudyStore((state) => state.hit);
  const complete = useStudyStore((state) => state.complete);
  const session = useSessionXp();
  const [queue, setQueue] = useState(() => shuffle(items).slice(0, SESSION));
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'right' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [firstTry, setFirstTry] = useState({ right: 0, seen: new Set<string>() });
  const current = queue[0];
  const total = Math.min(SESSION, items.length);

  function settle(correct: boolean) {
    if (!current) return;
    setResult(correct ? 'right' : 'wrong');
    if (firstTry.seen.has(current.id)) {
      hit({ correct });
      return;
    }
    record({ id: current.id, correct });
    setFirstTry((prev) => ({
      right: prev.right + (correct ? 1 : 0),
      seen: new Set(prev.seen).add(current.id),
    }));
  }

  function check() {
    if (!current || !input.trim()) return;
    settle(isCorrect(input, [current.answer, ...(current.alt ?? [])]));
  }

  function next() {
    if (!current) return;
    if (result === 'right' && queue.length === 1) {
      complete({ perfect: firstTry.right === firstTry.seen.size });
    }
    // A wrong answer comes back at the end, until it is produced without help.
    setQueue((prev) => (result === 'wrong' ? [...prev.slice(1), current] : prev.slice(1)));
    setInput('');
    setResult(null);
    setShowHint(false);
  }

  if (!current) {
    return (
      <SessionDone
        xp={session.gained}
        title="Ronda terminada"
        stats={[
          { label: 'A la primera', value: `${firstTry.right}/${firstTry.seen.size}` },
          { label: 'Repetidas', value: firstTry.seen.size - firstTry.right },
        ]}
        actions={
          <Button
            onClick={() => {
              setQueue(shuffle(items).slice(0, SESSION));
              setFirstTry({ right: 0, seen: new Set() });
              session.reset();
            }}
          >
            <RotateCcwIcon />
            Otra ronda
          </Button>
        }
      >
        <p className="max-w-md text-sm text-muted-foreground">
          Las que fallaste las has repetido hasta escribirlas bien.
        </p>
      </SessionDone>
    );
  }

  const [before = '', after = ''] = current.text.split('___');
  const filled = `${before}${current.answer}${after}`;

  return (
    <div className="flex flex-col gap-3">
      <SessionBar done={total - queue.length} total={total} label="Frases completadas">
        {firstTry.seen.has(current.id) && <span className="shrink-0">Repetición</span>}
      </SessionBar>
      <form
        key={current.id + String(queue.length)}
        className="flex flex-col gap-5 rounded-lg border bg-card p-5 duration-200 animate-in fade-in motion-reduce:animate-none sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          if (result) next();
          else check();
        }}
      >
        <p className="text-xl leading-relaxed font-medium">
          {before}
          <input
            autoFocus
            value={input}
            readOnly={result !== null}
            onChange={(event) => setInput(event.target.value)}
            aria-label="Palabra que falta"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            size={Math.max(6, current.answer.length + 2)}
            className="mx-1 inline-block max-w-full rounded-md border border-input bg-background px-2 py-0.5 text-center outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {after}
        </p>
        {showHint && current.hint && !result && (
          <p className="text-sm text-muted-foreground">Pista: {current.hint}</p>
        )}
        {result && (
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <p className="text-sm">
              {result === 'right' ? (
                <strong className="text-success">Correcto. </strong>
              ) : (
                <strong className="text-destructive">Era «{current.answer}». </strong>
              )}
              <span className="text-muted-foreground">{filled}</span>
            </p>
            <SpeakButton text={filled} lang={lang} />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {result ? (
            <Button type="submit" size="lg">
              {result === 'wrong' ? 'Entendido, la repetiré' : 'Siguiente'}
              <ArrowRightIcon />
            </Button>
          ) : (
            <>
              <Button type="submit" size="lg" disabled={!input.trim()}>
                Comprobar
              </Button>
              {current.hint && !showHint && (
                <Button type="button" variant="ghost" size="lg" onClick={() => setShowHint(true)}>
                  <LightbulbIcon />
                  Pista
                </Button>
              )}
              <Button type="button" variant="ghost" size="lg" onClick={() => settle(false)}>
                No lo sé
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
