import { cn } from 'cn';
import {
  ArrowUpDownIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
  LayersIcon,
  ListChecksIcon,
  PencilLineIcon,
  PuzzleIcon,
} from 'lucide-react';
import { type ComponentType, useState } from 'react';
import { StatStrip } from '@/components/stat-strip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cardsOf, clozeOf, quizOf, sequencesOf, subjects, unitsOf } from '@/content/study';
import type { Subject } from '@/content/study/types';
import { daysUntil, formatDate, relativeDays } from '@/lib/dates';
import { studyHref } from '@/lib/route';
import { deckStats, useStudyStore } from '@/stores/study-store';
import { ClozeDrill } from '@/study/cloze-drill';
import { CourseCalendar } from '@/study/course-calendar';
import { Flashcards, NEW_PER_SESSION } from '@/study/flashcards';
import { MatchGame } from '@/study/match-game';
import { Quiz } from '@/study/quiz';
import { SequenceGame } from '@/study/sequence-game';
import { Syllabus } from '@/study/syllabus';

type Mode = {
  id: 'calendario' | 'temario' | 'tarjetas' | 'test' | 'completar' | 'emparejar' | 'ordenar';
  label: string;
  icon: ComponentType<{ className?: string }>;
  lead?: string;
};

const allModes: Mode[] = [
  { id: 'calendario', label: 'Calendario', icon: CalendarDaysIcon },
  { id: 'temario', label: 'Temario', icon: BookOpenIcon },
  {
    id: 'tarjetas',
    label: 'Tarjetas',
    icon: LayersIcon,
    lead: `Repetición espaciada: cada tarjeta vuelve cuando estás a punto de olvidarla. Hoy salen las que tocan y hasta ${NEW_PER_SESSION} nuevas.`,
  },
  {
    id: 'test',
    label: 'Test',
    icon: ListChecksIcon,
    lead: 'Diez preguntas, con explicación al momento. Primero salen las que nunca has acertado.',
  },
  {
    id: 'completar',
    label: 'Completar',
    icon: PencilLineIcon,
    lead: 'Escribe la palabra que falta. Las que falles vuelven al final hasta que las aciertes.',
  },
  {
    id: 'emparejar',
    label: 'Emparejar',
    icon: PuzzleIcon,
    lead: 'Une cada concepto con su significado lo más rápido que puedas. Cada fallo suma 3 segundos.',
  },
  {
    id: 'ordenar',
    label: 'Ordenar',
    icon: ArrowUpDownIcon,
    lead: 'Pon los pasos o las fechas en orden. Al acertar se muestran los detalles.',
  },
];

function availableModes(subject: Subject, unit?: string) {
  return allModes.filter((mode) => {
    if (mode.id === 'calendario') return Boolean(subject.calendar);
    if (mode.id === 'completar') return clozeOf(subject, unit).length > 0;
    if (mode.id === 'ordenar') return sequencesOf(subject, unit).length > 0;
    return true;
  });
}

function SubjectTabs({ active }: { active: string }) {
  return (
    <nav
      aria-label="Asignaturas"
      className="relative -mx-4 overflow-x-auto px-4"
      ref={(nav) => {
        const current = nav?.querySelector('[aria-current="page"]');
        if (nav && current instanceof HTMLElement) nav.scrollLeft = current.offsetLeft - 16;
      }}
    >
      <ul className="flex w-max gap-1 border-b">
        {subjects.map((subject) => (
          <li key={subject.slug}>
            <a
              href={studyHref(subject.slug)}
              aria-current={subject.slug === active ? 'page' : undefined}
              className={cn(
                '-mb-px block border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                subject.slug === active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {subject.tab}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ExamNote({ subject }: { subject: Subject }) {
  if (!subject.exam) return <span>Sin examen presencial</span>;
  const days = daysUntil(subject.exam.first);
  return (
    <span className="flex items-center gap-1.5">
      <GraduationCapIcon className="size-4" />
      Examen el {formatDate(subject.exam.first, { weekday: 'long', day: 'numeric', month: 'long' })}
      {days > 0 && `, ${relativeDays(days)}`}
    </span>
  );
}

type SubjectPageProps = { subject: Subject; mode?: string };

export function SubjectPage({ subject, mode }: SubjectPageProps) {
  const [unit, setUnit] = useState<string>();
  const states = useStudyStore((state) => state.cards);
  const modes = availableModes(subject, unit);
  const active = modes.find((m) => m.id === mode) ?? modes[0];
  const cards = cardsOf(subject, unit);
  const stats = deckStats(
    cards.map((card) => card.id),
    states,
  );
  const sessionKey = `${subject.slug}-${unit ?? 'all'}`;

  return (
    <div className="flex flex-col gap-6">
      <SubjectTabs active={subject.slug} />

      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{subject.code}</span>
            <ExamNote subject={subject} />
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {subject.title}
          </h1>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{subject.lead}</p>
        </div>
        <StatStrip
          className="max-w-xl"
          stats={[
            { label: 'Para repasar hoy', value: stats.due },
            { label: 'Sin estudiar', value: `${stats.fresh}/${stats.total}` },
            { label: 'Dominadas', value: `${stats.mastered}/${stats.total}` },
          ]}
        />
      </header>

      {subject.units.length > 1 && (
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Unidad"
        >
          {[{ id: undefined, title: 'Todas las unidades' }, ...subject.units].map((u) => (
            <button
              key={u.title}
              type="button"
              aria-pressed={unit === u.id}
              onClick={() => setUnit(u.id)}
              className={cn(
                'min-h-9 shrink-0 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
                unit === u.id
                  ? 'border-primary/50 bg-accent font-medium text-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {u.title}
            </button>
          ))}
        </div>
      )}

      {active && (
        <Tabs
          value={active.id}
          onValueChange={(value) => {
            window.location.hash = studyHref(subject.slug, String(value));
          }}
        >
          <TabsList
            variant="line"
            className="w-full group-data-horizontal/tabs:h-10 justify-start overflow-x-auto"
          >
            {modes.map((m) => (
              <TabsTrigger key={m.id} value={m.id} className="flex-none">
                <m.icon />
                {m.label}
                {m.id === 'tarjetas' && stats.due > 0 && (
                  <span className="rounded bg-primary/10 px-1.5 font-mono text-[0.7rem] text-primary">
                    {stats.due}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={active.id} className="flex flex-col gap-4 pt-4 text-base">
            {active.lead && (
              <p className="max-w-prose text-sm text-muted-foreground">{active.lead}</p>
            )}
            {active.id === 'calendario' && subject.calendar && (
              <CourseCalendar calendar={subject.calendar} />
            )}
            {active.id === 'temario' && (
              <>
                <section className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4">
                  <h3 className="font-semibold">Cómo se aprueba</h3>
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {subject.grading.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {subject.exam && (
                    <p className="text-sm text-muted-foreground">
                      Partes del examen: {subject.exam.parts.join(', ')}.
                    </p>
                  )}
                </section>
                <Syllabus units={unitsOf(subject, unit)} />
              </>
            )}
            {(active.id === 'tarjetas' || active.id === 'test' || active.id === 'completar') && (
              <div className="max-w-2xl">
                {active.id === 'tarjetas' && <Flashcards key={sessionKey} cards={cards} />}
                {active.id === 'test' && <Quiz key={sessionKey} items={quizOf(subject, unit)} />}
                {active.id === 'completar' && (
                  <ClozeDrill
                    key={sessionKey}
                    items={clozeOf(subject, unit)}
                    lang={subject.speak}
                  />
                )}
              </div>
            )}
            {active.id === 'emparejar' && (
              <MatchGame key={sessionKey} cards={cards} recordKey={sessionKey} />
            )}
            {active.id === 'ordenar' && (
              <SequenceGame
                key={sessionKey}
                sequences={sequencesOf(subject, unit)}
                slug={subject.slug}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
