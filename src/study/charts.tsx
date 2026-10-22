import { cn } from 'cn';
import { today } from '@/lib/dates';
import { DAILY_GOAL, type DayLog } from '@/lib/game';
import type { CardState } from '@/stores/study-store';

const WEEKS = 26;
const DAY_MS = 86_400_000;
const shortDate = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' });
const monthName = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'UTC' });
const heat = ['bg-muted', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4'];

// Day numbers count from 1970-01-01, a Thursday: +3 makes Monday the first row.
const weekdayOf = (day: number) => (day + 3) % 7;

function level(xp: number) {
  if (xp <= 0) return 0;
  if (xp >= DAILY_GOAL) return 4;
  return Math.min(3, 1 + Math.floor((xp / DAILY_GOAL) * 3));
}

export function ActivityHeatmap({ days }: { days: Record<string, DayLog> }) {
  const end = today();
  const start = end - weekdayOf(end) - (WEEKS - 1) * 7;
  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_day, d) => start + w * 7 + d),
  );
  const active = weeks.flat().filter((day) => (days[String(day)]?.xp ?? 0) > 0).length;

  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`Has estudiado ${active} días de las últimas ${WEEKS} semanas`}
        className="flex gap-0.5 sm:gap-[3px]"
      >
        {weeks.map((week) => {
          const first = week[0] ?? start;
          const startsMonth = new Date(first * DAY_MS).getUTCDate() <= 7;
          return (
            <div key={first} className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-[3px]">
              <span
                className="h-4 text-[0.65rem] whitespace-nowrap text-muted-foreground"
                aria-hidden
              >
                {startsMonth ? monthName.format(first * DAY_MS) : ''}
              </span>
              {week.map((day) => {
                const xp = days[String(day)]?.xp ?? 0;
                return (
                  <span
                    key={day}
                    title={`${shortDate.format(day * DAY_MS)}: ${xp} XP`}
                    className={cn(
                      'aspect-square w-full rounded-[2px] sm:rounded-[3px]',
                      day > end ? 'invisible' : heat[level(xp)],
                      day === end && 'ring-1 ring-foreground/40',
                    )}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <figcaption className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {active} {active === 1 ? 'día' : 'días'} con estudio en {WEEKS} semanas
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          Menos
          {heat.map((tone) => (
            <span key={tone} className={cn('size-2.5 rounded-[2px]', tone)} />
          ))}
          Más
        </span>
      </figcaption>
    </figure>
  );
}

type ReviewForecastProps = { ids: string[]; cards: Record<string, CardState> };

// Only the ids still in the content count, as in deckStats, so today matches the due total.
export function ReviewForecast({ ids, cards }: ReviewForecastProps) {
  const day = today();
  const counts = Array.from({ length: 7 }, () => 0);
  for (const id of ids) {
    const card = cards[id];
    if (!card) continue;
    const offset = Math.max(0, card.due - day);
    if (offset < 7) counts[offset] = (counts[offset] ?? 0) + 1;
  }
  const peak = Math.max(1, ...counts);

  return (
    <figure className="flex flex-col gap-2">
      <ol className="grid h-28 grid-cols-7 items-end gap-2">
        {counts.map((count, i) => (
          <li key={i} className="flex h-full flex-col items-center justify-end gap-1">
            <span className="text-xs font-medium tabular-nums">{count}</span>
            <span
              className={cn('w-full rounded-t-[3px]', i === 0 ? 'bg-primary' : 'bg-heat-2')}
              style={{ height: `${(count / peak) * 70}%`, minHeight: count > 0 ? 3 : 1 }}
            />
            <span className="text-[0.7rem] text-muted-foreground">
              {i === 0 ? 'hoy' : weekday.format((day + i) * DAY_MS).replace('.', '')}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="sr-only">
        Tarjetas que tocan cada uno de los próximos 7 días
      </figcaption>
    </figure>
  );
}
