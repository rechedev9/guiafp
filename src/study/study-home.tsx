import { cn } from 'cn';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, LockIcon, TimerIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ProgressBar } from '@/components/progress-bar';
import { StatStrip } from '@/components/stat-strip';
import { buttonVariants } from '@/components/ui/button';
import { allCards, cardsOf, subjects } from '@/content/study';
import { principles, weeklyPlan } from '@/content/study/science';
import { daysUntil, formatDate, today } from '@/lib/dates';
import { achievements, DAILY_GOAL, emptyDay, levelOf, QUEST_BONUS, quests } from '@/lib/game';
import { studyHref } from '@/lib/route';
import { percent } from '@/lib/study';
import { deckStats, streak, useStudyStore } from '@/stores/study-store';
import { ActivityHeatmap, ReviewForecast } from '@/study/charts';
import { NEW_PER_SESSION } from '@/study/flashcards';

const SECONDS_PER_CARD = 12;
const tableCols = 'md:grid-cols-[minmax(0,1fr)_160px_90px_80px_120px]';
const longToday = () =>
  formatDate(new Date().toISOString(), { weekday: 'long', day: 'numeric', month: 'long' });

function Panel({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-4 sm:p-5', className)}
    >
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </header>
      {children}
    </section>
  );
}

function TodayPanel({ due, fresh }: { due: number; fresh: number }) {
  const fresher = Math.min(fresh, NEW_PER_SESSION);
  const empty = due + fresher === 0;
  const minutes = empty ? 0 : Math.max(1, Math.round(((due + fresher) * SECONDS_PER_CARD) / 60));
  const figures = [
    { label: 'Para repasar', value: due },
    { label: 'Nuevas', value: fresher },
    { label: 'Tiempo estimado', value: minutes, unit: 'min' },
  ];

  return (
    <section className="flex flex-col justify-between gap-6 rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold">Repaso de hoy</h2>
        <p className="text-sm text-muted-foreground">
          Tarjetas de todas las asignaturas, mezcladas y programadas por repetición espaciada.
        </p>
      </div>
      <dl className="flex flex-wrap gap-x-10 gap-y-3">
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt className="text-xs text-muted-foreground">{figure.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              {figure.value}
              {figure.unit && (
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  {figure.unit}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        <a
          href={studyHref('repaso')}
          className={buttonVariants({ size: 'lg', variant: empty ? 'outline' : 'default' })}
        >
          {empty ? 'Todo al día: practicar igualmente' : 'Empezar repaso'}
        </a>
        <a
          href={studyHref('desafio')}
          className={buttonVariants({ size: 'lg', variant: 'outline' })}
        >
          <TimerIcon />
          Contrarreloj
        </a>
      </div>
    </section>
  );
}

function DailyGoals() {
  const day = useStudyStore((state) => state.days[String(today())] ?? emptyDay);
  const done = quests.filter((quest) => quest.value(day) >= quest.goal).length;
  return (
    <Panel title="Objetivos de hoy" aside={`${done} de ${quests.length}`}>
      <ul className="flex flex-col gap-3">
        {quests.map((quest) => {
          const value = Math.min(quest.value(day), quest.goal);
          const complete = value >= quest.goal;
          return (
            <li key={quest.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span
                  className={cn('flex items-center gap-2', complete && 'text-muted-foreground')}
                >
                  {complete && <CheckIcon className="size-4 text-success" />}
                  {quest.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {value}/{quest.goal}
                </span>
              </div>
              <ProgressBar
                value={value}
                max={quest.goal}
                label={quest.title}
                fillClassName={complete ? 'bg-success' : undefined}
              />
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        Cada objetivo suma {QUEST_BONUS} XP. Se renuevan a medianoche.
      </p>
    </Panel>
  );
}

function SubjectTable() {
  const states = useStudyStore((state) => state.cards);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Asignaturas</h2>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div
          aria-hidden
          className={cn(
            'hidden gap-4 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid',
            tableCols,
          )}
        >
          <span>Asignatura</span>
          <span>Dominio</span>
          <span className="text-right">Vistas</span>
          <span className="text-right">Para hoy</span>
          <span className="text-right">Examen</span>
        </div>
        <ul className="divide-y">
          {subjects.map((subject) => {
            const stats = deckStats(
              cardsOf(subject).map((card) => card.id),
              states,
            );
            const mastered = percent(stats.mastered, stats.total);
            const exam =
              subject.exam && daysUntil(subject.exam.first) > 0 ? subject.exam : undefined;
            return (
              <li key={subject.slug}>
                <a
                  href={studyHref(subject.slug)}
                  className={cn(
                    'group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-muted/50',
                    tableCols,
                  )}
                >
                  <span className="flex min-w-0 items-baseline gap-2.5">
                    <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                      {subject.code}
                    </span>
                    <span className="truncate font-medium group-hover:text-primary">
                      {subject.title}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground md:hidden" />
                  <span className="col-span-2 flex items-center gap-2 pl-[3.625rem] md:col-span-1 md:pl-0">
                    <ProgressBar
                      value={stats.mastered}
                      max={stats.total}
                      label={`Dominio de ${subject.title}`}
                      className="flex-1"
                    />
                    <span className="w-9 text-right font-mono text-xs text-muted-foreground">
                      {mastered} %
                    </span>
                    <span className="text-xs text-muted-foreground md:hidden">
                      · {stats.due > 0 ? `${stats.due} para hoy` : 'al día'}
                    </span>
                  </span>
                  <span className="hidden text-right font-mono text-sm text-muted-foreground md:block">
                    {stats.total - stats.fresh}/{stats.total}
                  </span>
                  <span
                    className={cn(
                      'hidden text-right font-mono text-sm md:block',
                      stats.due > 0 ? 'font-medium text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {stats.due}
                  </span>
                  <span className="hidden text-right text-sm text-muted-foreground md:block">
                    {exam
                      ? formatDate(exam.first, { day: 'numeric', month: 'short' })
                      : 'Sin examen'}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Achievements() {
  const badges = useStudyStore((state) => state.badges);
  const unlocked = achievements.filter((badge) => badges[badge.id] !== undefined).length;
  return (
    <details className="group rounded-lg border bg-card">
      <summary className="flex list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span>
          Logros{' '}
          <span className="font-normal text-muted-foreground">
            · {unlocked} de {achievements.length}
          </span>
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <ul className="grid gap-px border-t bg-border sm:grid-cols-2">
        {achievements.map((badge) => {
          const done = badges[badge.id] !== undefined;
          return (
            <li key={badge.id} className="flex items-start gap-3 bg-card px-4 py-3">
              {done ? (
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <LockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
              )}
              <span className={cn('min-w-0 text-sm', !done && 'text-muted-foreground')}>
                <span className="font-medium">{badge.title}</span>
                <span className="block text-xs text-muted-foreground">{badge.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function Method() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Cómo funciona</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          Cada modo aplica una técnica que la investigación sobre el aprendizaje ha comprobado que
          funciona mejor que releer y subrayar. Lo que cuenta es repasar un poco cada día.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title} className="flex flex-col gap-1 border-l-2 pl-3">
              <dt className="text-sm font-semibold">{principle.title}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{principle.text}</dd>
              <dd className="text-sm text-foreground">{principle.here}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Un plan semanal sencillo</h3>
          <ol className="flex flex-col divide-y rounded-lg border bg-card">
            {weeklyPlan.map((step, i) => (
              <li key={step.when} className="flex gap-3 p-3">
                <span className="w-4 shrink-0 font-mono text-xs leading-5 text-muted-foreground">
                  {i + 1}
                </span>
                <div className="text-sm">
                  <p className="font-medium">{step.when}</p>
                  <p className="leading-relaxed text-muted-foreground">{step.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function StudyHome() {
  const states = useStudyStore((state) => state.cards);
  const answers = useStudyStore((state) => state.answers);
  const days = useStudyStore((state) => state.days);
  const activity = useStudyStore((state) => state.activity);
  const xp = useStudyStore((state) => state.xp);
  const ids = allCards().map((card) => card.id);
  const total = deckStats(ids, states);
  const tests = Object.values(answers).reduce(
    (sum, stats) => ({ right: sum.right + stats.right, all: sum.all + stats.right + stats.wrong }),
    { right: 0, all: 0 },
  );
  const { level, into, cost } = levelOf(xp);
  const todayXp = days[String(today())]?.xp ?? 0;
  const run = streak(activity);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground first-letter:uppercase">{longToday()}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hoy</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <TodayPanel due={total.due} fresh={total.fresh} />
        <DailyGoals />
      </div>

      <StatStrip
        stats={[
          {
            label: 'Racha',
            value: run === 1 ? '1 día' : `${run} días`,
            hint: 'Días seguidos estudiando',
          },
          {
            label: 'Tarjetas dominadas',
            value: `${total.mastered}/${total.total}`,
            hint: `${percent(total.mastered, total.total)} % del temario`,
          },
          {
            label: 'Acierto en test',
            value: tests.all ? `${percent(tests.right, tests.all)} %` : 'Sin datos',
            hint: `${tests.all} respuestas`,
          },
          {
            label: `Nivel ${level}`,
            value: `${xp} XP`,
            hint: `Hoy ${Math.min(todayXp, DAILY_GOAL)}/${DAILY_GOAL}, faltan ${cost - into} para subir`,
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Actividad" aside="XP por día">
          <ActivityHeatmap days={days} />
        </Panel>
        <Panel title="Próximos 7 días" aside="Tarjetas por repasar">
          <ReviewForecast ids={ids} cards={states} />
        </Panel>
      </div>

      <SubjectTable />
      <Achievements />
      <Method />
    </div>
  );
}
