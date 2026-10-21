import { cn } from 'cn';
import {
  BrainIcon,
  CalendarDaysIcon,
  CheckIcon,
  CrownIcon,
  FlameIcon,
  LayersIcon,
  LockIcon,
  MapIcon,
  MessageCircleIcon,
  MoonIcon,
  PencilLineIcon,
  ShuffleIcon,
  SparklesIcon,
  StarIcon,
  SwordsIcon,
  TargetIcon,
  ZapIcon,
} from 'lucide-react';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { allCards, cardsOf, subjects } from '@/content/study';
import { principles, weeklyPlan } from '@/content/study/science';
import { daysUntil, formatDate, today } from '@/lib/dates';
import { achievements, emptyDay, levelOf, QUEST_BONUS, quests } from '@/lib/game';
import { studyHref } from '@/lib/route';
import { type DeckStats, deckStats, streak, useStudyStore } from '@/stores/study-store';
import { MedalBadge } from '@/study/medal-badge';
import { LevelBadge, StreakFlame, XpBar } from '@/study/player-hud';

const principleIcons = {
  brain: BrainIcon,
  calendar: CalendarDaysIcon,
  shuffle: ShuffleIcon,
  message: MessageCircleIcon,
  pencil: PencilLineIcon,
  moon: MoonIcon,
};

const badgeIcons = {
  spark: SparklesIcon,
  flame: FlameIcon,
  zap: ZapIcon,
  star: StarIcon,
  layers: LayersIcon,
  crown: CrownIcon,
  map: MapIcon,
  target: TargetIcon,
};

function PlayerCard({ total }: { total: DeckStats }) {
  const xp = useStudyStore((state) => state.xp);
  const activity = useStudyStore((state) => state.activity);
  const { level, into, cost, rank } = levelOf(xp);
  const days = streak(activity);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-linear-to-br from-amber-500/10 via-card to-rose-500/10 p-5">
      <div className="flex items-center gap-4">
        <LevelBadge level={level} className="size-16 rounded-2xl text-2xl" />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Nivel {level}
          </p>
          <p className="text-xl font-semibold">{rank}</p>
          <p className="text-sm text-muted-foreground tabular-nums">{xp} XP en total</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <XpBar xp={xp} className="h-3" />
        <p className="text-xs text-muted-foreground tabular-nums">
          Faltan {cost - into} XP para el nivel {level + 1}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border bg-card/80 p-3">
          <dt className="text-xs text-muted-foreground">días seguidos</dt>
          <dd className="flex items-center gap-1.5 text-xl font-semibold tabular-nums">
            {days}
            <StreakFlame days={days} />
          </dd>
        </div>
        <div className="rounded-xl border bg-card/80 p-3">
          <dt className="text-xs text-muted-foreground">tarjetas dominadas</dt>
          <dd className="text-xl font-semibold tabular-nums">
            {total.mastered}
            <span className="text-sm font-normal text-muted-foreground">/{total.total}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function DailyQuests() {
  const day = useStudyStore((state) => state.days[String(today())] ?? emptyDay);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
      <div>
        <h3 className="font-semibold">Misiones de hoy</h3>
        <p className="text-sm text-muted-foreground">
          Cada una da {QUEST_BONUS} XP extra. Se renuevan cada día.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {quests.map((quest) => {
          const value = Math.min(quest.value(day), quest.goal);
          const done = value >= quest.goal;
          return (
            <li key={quest.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg border-2',
                  done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-dashed text-muted-foreground',
                )}
              >
                {done ? <CheckIcon className="size-4" /> : <TargetIcon className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span className={cn('font-medium', done && 'text-muted-foreground line-through')}>
                    {quest.title}
                  </span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {value}/{quest.goal}
                  </span>
                </div>
                <ProgressBar value={value} max={quest.goal} label={quest.title} className="mt-1" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Achievements() {
  const badges = useStudyStore((state) => state.badges);
  const unlocked = achievements.filter((badge) => badges[badge.id] !== undefined).length;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 lg:col-span-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">Logros</h3>
        <span className="text-sm text-muted-foreground tabular-nums">
          {unlocked} de {achievements.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {achievements.map((badge) => {
          const done = badges[badge.id] !== undefined;
          const Icon = done ? badgeIcons[badge.icon] : LockIcon;
          return (
            <li
              key={badge.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-xl border p-2.5 min-[480px]:flex-row min-[480px]:gap-2.5',
                done ? 'border-amber-400/50 bg-amber-500/5' : 'opacity-60',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  done
                    ? 'bg-linear-to-br from-amber-400 to-orange-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-tight font-semibold">{badge.title}</span>
                <span className="block text-xs leading-snug text-muted-foreground">
                  {badge.text}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function StudyHome() {
  const states = useStudyStore((state) => state.cards);
  const total = deckStats(
    allCards().map((card) => card.id),
    states,
  );

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-5">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Estudiar el temario
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          El material de las 7 asignaturas resumido en castellano y convertido en juego: gana XP,
          sube de nivel, encadena combos y completa misiones cada día. El progreso se guarda en este
          navegador.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={studyHref('repaso')} className={buttonVariants({ size: 'lg' })}>
            <ShuffleIcon />
            {total.due > 0
              ? `Repaso mezclado: ${total.due} para hoy`
              : 'Empezar el repaso mezclado'}
          </a>
          <a
            href={studyHref('desafio')}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-linear-to-r from-rose-500 to-orange-500 text-white hover:opacity-90',
            )}
          >
            <SwordsIcon />
            Desafío de supervivencia
          </a>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Tu partida</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <PlayerCard total={total} />
          <DailyQuests />
          <Achievements />
        </div>
      </section>

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
                className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/50 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {subject.code}
                    </Badge>
                    <MedalBadge mastered={stats.mastered} total={stats.total} />
                  </span>
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
            funciona mejor que releer y subrayar. Los puntos y las misiones solo sirven para que
            vuelvas cada día: lo que cuenta es repasar un poco a diario.
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
