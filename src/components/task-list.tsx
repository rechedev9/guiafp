import { cn } from 'cn';
import { ExternalLinkIcon } from 'lucide-react';
import { ExternalLink } from '@/components/external-link';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { courses, type Task } from '@/content/guide';
import { daysUntil, relativeDays, TIME_ZONE } from '@/lib/dates';
import { useChecklistStore } from '@/stores/checklist-store';

// Read once per page load; the countdown only needs day precision.
const now = Date.now();
const dateFormat = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: TIME_ZONE,
});

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) {
    return <Badge variant="outline">Fecha dentro de la tarea</Badge>;
  }
  const date = new Date(deadline);
  const days = daysUntil(deadline);
  const label = dateFormat.format(date);
  if (date.getTime() < now) {
    return <Badge variant="secondary">Cerrado ({label})</Badge>;
  }
  return (
    <Badge variant={days <= 7 ? 'destructive' : 'secondary'}>
      {label}, {relativeDays(days)}
    </Badge>
  );
}

type TaskListProps = {
  title: string;
  tasks: Task[];
};

export function TaskList({ title, tasks }: TaskListProps) {
  const done = useChecklistStore((state) => state.done);
  const toggle = useChecklistStore((state) => state.toggle);
  const count = tasks.filter((task) => done[task.id]).length;

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
          {count} de {tasks.length}
        </span>
      </header>
      <ProgressBar value={count} max={tasks.length} label={title} className="h-1 rounded-none" />
      <ul className="divide-y">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-3 p-4">
            <Checkbox
              id={task.id}
              checked={done[task.id] ?? false}
              onCheckedChange={() => toggle(task.id)}
              className="mt-0.5 size-5"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
              <label
                htmlFor={task.id}
                className={cn(
                  'cursor-pointer leading-snug',
                  done[task.id] && 'text-muted-foreground line-through',
                )}
              >
                <span className="mr-2 font-medium text-primary">{courses[task.course].short}</span>
                {task.title}
              </label>
              <div className="flex shrink-0 items-center gap-2">
                <DeadlineBadge deadline={task.deadline} />
                <ExternalLink
                  href={task.href ?? courses[task.course].href}
                  className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
                  aria-label={`Abrir ${task.title} en el campus`}
                >
                  <ExternalLinkIcon />
                </ExternalLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
