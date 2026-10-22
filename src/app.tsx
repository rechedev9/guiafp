import { cn } from 'cn';
import { GraduationCapIcon } from 'lucide-react';
import { lazy, Suspense, useEffect } from 'react';
import { GuidePage } from '@/guide-page';
import { scrollTarget, studyHref, useRoute } from '@/lib/route';

const loadStudy = () => import('@/study/study-app');
const StudyApp = lazy(() => loadStudy().then((module) => ({ default: module.StudyApp })));
const StudyStatus = lazy(() =>
  import('@/study/study-status').then((module) => ({ default: module.StudyStatus })),
);

export function App() {
  const route = useRoute();
  const studying = route.page !== 'guide';

  const target = scrollTarget(route);

  // Fetch the study chunk once the guide is idle, so the first tap on Estudiar is instant.
  useEffect(() => {
    const id = window.setTimeout(() => void loadStudy(), 2000);
    return () => window.clearTimeout(id);
  }, []);

  // Runs after render, so a guide anchor opened from a study page exists by then.
  useEffect(() => {
    const element = document.getElementById(target);
    if (element) element.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [target]);

  const tabs = [
    { href: studyHref(), label: 'Estudiar', active: studying },
    { href: '#/', label: 'Guía', more: ' del campus', active: !studying },
  ];

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <nav aria-label="Principal" className="mx-auto flex h-12 max-w-6xl items-center gap-1 px-4">
          <a
            href={studyHref()}
            className="mr-3 flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCapIcon className="size-3.5" />
            </span>
            <span className="hidden min-[400px]:inline">Guía FP</span>
          </a>
          {tabs.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={cn(
                'relative flex h-12 items-center px-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                tab.active
                  ? 'text-foreground after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>
                {tab.label}
                {tab.more && <span className="hidden sm:inline">{tab.more}</span>}
              </span>
            </a>
          ))}
          <div className="ml-auto flex items-center">
            {studying && (
              <Suspense fallback={null}>
                <StudyStatus />
              </Suspense>
            )}
          </div>
        </nav>
      </div>
      {studying ? (
        <Suspense fallback={<p className="p-8 text-center text-muted-foreground">Cargando…</p>}>
          <StudyApp route={route} />
        </Suspense>
      ) : (
        <GuidePage />
      )}
    </div>
  );
}
