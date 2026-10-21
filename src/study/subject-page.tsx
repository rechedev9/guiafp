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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cardsOf, clozeOf, quizOf, sequencesOf, subjects, unitsOf } from '@/content/study';
import type { Subject } from '@/content/study/types';
import { daysUntil, formatDate, relativeDays } from '@/lib/dates';
import { studyHref } from '@/lib/route';
import { deckStats, useStudyStore } from '@/stores/study-store';
import { ClozeDrill } from '@/study/cloze-drill';
import { CourseCalendar } from '@/study/course-calendar';
import { Flashcards } from '@/study/flashcards';
import { MatchGame } from '@/study/match-game';
import { MedalBadge } from '@/study/medal-badge';
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
    lead: 'Repetición espaciada: cada tarjeta vuelve cuando estás a punto de olvidarla. Hoy salen las que tocan y hasta 12 nuevas.',
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
    lead: 'Contrarreloj: une cada concepto con su significado. Cada fallo suma 3 segundos.',
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

function ExamBadge({ subject }: { subject: Subject }) {
  if (!subject.exam) return null;
  const days = daysUntil(subject.exam.first);
  return (
    <Badge variant="outline" className="h-auto gap-1.5 py-1">
      <GraduationCapIcon />
      Examen: {formatDate(subject.exam.first, { weekday: 'short', day: 'numeric', month: 'short' })}
      {days > 0 && `, ${relativeDays(days)}`}
    </Badge>
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

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {subject.code}
          </Badge>
          <ExamBadge subject={subject} />
          <MedalBadge mastered={stats.mastered} total={stats.total} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{subject.title}</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{subject.lead}</p>
        <dl className="grid max-w-xl grid-cols-3 gap-2">
          {[
            { label: 'para repasar hoy', value: stats.due },
            { label: 'sin estudiar', value: stats.fresh },
            { label: 'dominadas', value: stats.mastered },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="text-xl font-semibold tabular-nums">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground">/{stats.total}</span>
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {subject.units.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Unidad">
          {[{ id: undefined, title: 'Todas las unidades' }, ...subject.units].map((u) => (
            <button
              key={u.title}
              type="button"
              aria-pressed={unit === u.id}
              onClick={() => setUnit(u.id)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                unit === u.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card hover:border-primary/50',
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
          <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
            {modes.map((m) => (
              <TabsTrigger key={m.id} value={m.id} className="flex-none">
                <m.icon />
                {m.label}
                {m.id === 'tarjetas' && stats.due > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-[0.7rem] text-primary-foreground tabular-nums">
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
                <section className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4">
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
            {active.id === 'tarjetas' && <Flashcards key={sessionKey} cards={cards} />}
            {active.id === 'test' && <Quiz key={sessionKey} items={quizOf(subject, unit)} />}
            {active.id === 'completar' && (
              <ClozeDrill key={sessionKey} items={clozeOf(subject, unit)} lang={subject.speak} />
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
