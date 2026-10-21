import {
  BrainIcon,
  CalendarDaysIcon,
  FlameIcon,
  MessageCircleIcon,
  MoonIcon,
  PencilLineIcon,
  ShuffleIcon,
} from 'lucide-react';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { allCards, cardsOf, subjects } from '@/content/study';
import { principles, weeklyPlan } from '@/content/study/science';
import { daysUntil, formatDate, today } from '@/lib/dates';
import { studyHref } from '@/lib/route';
import { deckStats, streak, useStudyStore } from '@/stores/study-store';

const principleIcons = {
  brain: BrainIcon,
  calendar: CalendarDaysIcon,
  shuffle: ShuffleIcon,
  message: MessageCircleIcon,
  pencil: PencilLineIcon,
  moon: MoonIcon,
};

export function StudyHome() {
  const states = useStudyStore((state) => state.cards);
  const activity = useStudyStore((state) => state.activity);
  const total = deckStats(
    allCards().map((card) => card.id),
    states,
  );
  const days = streak(activity);
  const doneToday = activity[today()] ?? 0;

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-5">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Estudiar el temario
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          El material de las 7 asignaturas resumido en castellano, con tarjetas de repaso espaciado,
          tests, juegos y ejercicios para practicar. El progreso se guarda en este navegador.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={studyHref('repaso')} className={buttonVariants({ size: 'lg' })}>
            <ShuffleIcon />
            {total.due > 0
              ? `Repaso mezclado: ${total.due} para hoy`
              : 'Empezar el repaso mezclado'}
          </a>
        </div>
        <dl className="grid max-w-2xl grid-cols-3 gap-3">
          {[
            {
              label: 'días seguidos',
              value: days,
              icon: <FlameIcon className="size-4 text-orange-500" />,
            },
            { label: 'repasos hoy', value: doneToday },
            { label: 'tarjetas dominadas', value: `${total.mastered}/${total.total}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-3 sm:p-4">
              <dt className="text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
              <dd className="flex items-center gap-1.5 text-xl font-semibold tabular-nums sm:text-2xl">
                {stat.value}
                {stat.icon}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Asignaturas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const stats = deckStats(
              cardsOf(subject).map((card) => card.id),
              states,
            );
            const seen = stats.total - stats.fresh;
            return (
              <a
                key={subject.slug}
                href={studyHref(subject.slug)}
                className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-[border-color,transform] hover:border-primary/50 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {subject.code}
                  </Badge>
                  {stats.due > 0 && <Badge>{stats.due} para hoy</Badge>}
                </div>
                <h3 className="font-semibold">{subject.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {subject.lead}
                </p>
                <div className="mt-auto flex flex-col gap-1.5">
                  <ProgressBar
                    value={stats.mastered}
                    max={stats.total}
                    label={`Dominadas en ${subject.title}`}
                  />
                  <p className="flex flex-wrap justify-between gap-x-3 text-xs text-muted-foreground">
                    <span>
                      {seen} de {stats.total} tarjetas vistas
                    </span>
                    {subject.exam && daysUntil(subject.exam.first) > 0 && (
                      <span>
                        Examen el{' '}
                        {formatDate(subject.exam.first, { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Por qué está montado así</h2>
          <p className="max-w-prose text-muted-foreground">
            Cada modo aplica una técnica que la investigación sobre el aprendizaje ha comprobado que
            funciona mejor que releer y subrayar.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principleIcons[principle.icon];
            return (
              <div
                key={principle.title}
                className="flex flex-col gap-2 rounded-xl border bg-card p-4"
              >
                <Icon className="size-5 text-primary" />
                <h3 className="font-semibold">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
                <p className="mt-auto text-sm font-medium text-primary">{principle.here}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Un plan semanal sencillo</h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {weeklyPlan.map((step, i) => (
            <li key={step.when} className="flex gap-3 rounded-xl border bg-card p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{step.when}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.what}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
