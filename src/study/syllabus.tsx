import { BookOpenIcon, ChevronDownIcon, HelpCircleIcon } from 'lucide-react';
import type { Unit } from '@/content/study/types';
import { RichText } from '@/study/rich-text';

function SelfCheck({ items }: { items: Unit['selfCheck'] }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <HelpCircleIcon className="size-4 text-primary" />
        Pregúntate antes de mirar
      </h4>
      <p className="text-sm text-muted-foreground">
        Intenta contestar con tus palabras, en voz alta o por escrito. Después abre la respuesta.
      </p>
      <ul className="flex flex-col divide-y rounded-md border bg-card">
        {items.map(([question, answer]) => (
          <li key={question}>
            <details className="group">
              <summary className="flex list-none items-start justify-between gap-3 p-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDownIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="border-t px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Syllabus({ units }: { units: Unit[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-12">
      {units.map((unit) => (
        <article key={unit.id} className="flex flex-col gap-5">
          <header className="flex flex-col gap-1.5">
            <h3 className="text-xl font-semibold tracking-tight text-balance">{unit.title}</h3>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpenIcon className="size-3.5" />
              {unit.source}
            </p>
            <p className="max-w-prose leading-relaxed text-muted-foreground">{unit.summary}</p>
          </header>
          {unit.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2 border-t pt-4">
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="flex flex-col gap-2 leading-relaxed text-foreground/85">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    <span>
                      <RichText text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <SelfCheck items={unit.selfCheck} />
        </article>
      ))}
    </div>
  );
}
