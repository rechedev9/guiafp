import { cn } from 'cn';
import { MapPinIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { courses } from '@/content/guide';
import { subjects } from '@/content/study';
import type { Subject } from '@/content/study/types';
import { daysUntil, formatDate, relativeDays } from '@/lib/dates';

const examDay = (iso: string) =>
  formatDate(iso, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const exams = subjects
  .flatMap((subject) => (subject.exam ? [{ subject, exam: subject.exam }] : []))
  .toSorted((a, b) => a.exam.first.localeCompare(b.exam.first));
const withoutExam = subjects.filter((subject) => !subject.exam).map((subject) => subject.title);

type Calendar = NonNullable<Subject['calendar']>;

export function CourseCalendar({ calendar }: { calendar: Calendar }) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Exámenes presenciales de tus asignaturas</h3>
        <ul className="flex flex-col divide-y rounded-xl border bg-card text-sm sm:hidden">
          {exams.map(({ subject, exam }) => (
            <li key={subject.slug} className="flex flex-col gap-1 p-3">
              <span className="font-medium">{subject.title}</span>
              <span className="first-letter:uppercase">{examDay(exam.first)}</span>
              <span className="text-muted-foreground">Junio: {examDay(exam.second)}</span>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto rounded-xl border bg-card sm:block">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Asignatura</th>
                <th className="p-3 font-medium">1.ª convocatoria (mayo)</th>
                <th className="p-3 font-medium">2.ª convocatoria (junio)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {exams.map(({ subject, exam }) => (
                <tr key={subject.slug}>
                  <td className="p-3 font-medium">{subject.title}</td>
                  <td className="p-3 first-letter:uppercase">{examDay(exam.first)}</td>
                  <td className="p-3 text-muted-foreground first-letter:uppercase">
                    {examDay(exam.second)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Cada examen dura unos 1 h 50 min. {withoutExam.join(' y ')} no tienen examen.
        </p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {calendar.venues.map(([island, venue]) => (
            <li
              key={island}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
            >
              <MapPinIcon className="size-4 shrink-0 text-primary" />
              <span className="font-medium">{island}:</span> {venue}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Todas las entregas del curso</h3>
        <p className="text-sm text-muted-foreground">
          Cierran a las 23:59. La mayoría admite 3 días más con penalización. Historia e Inglés
          publican sus fechas al abrir cada bloque.
        </p>
        <ol className="flex flex-col divide-y rounded-xl border bg-card">
          {calendar.deadlines.map((deadline) => {
            const days = daysUntil(deadline.date);
            const past = days < 0;
            return (
              <li
                key={`${deadline.date}-${deadline.course}-${deadline.what}`}
                className={cn(
                  'flex flex-wrap items-center gap-x-3 gap-y-1 p-3 text-sm',
                  past && 'opacity-50',
                )}
              >
                <span className="w-24 shrink-0 font-medium tabular-nums first-letter:uppercase">
                  {formatDate(deadline.date, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <Badge variant="secondary">{courses[deadline.course].short}</Badge>
                <span className="flex-1">{deadline.what}</span>
                {!past && days <= 14 && (
                  <Badge variant={days <= 7 ? 'destructive' : 'outline'}>
                    {relativeDays(days)}
                  </Badge>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
