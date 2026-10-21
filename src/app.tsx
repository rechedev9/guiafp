import { cn } from 'cn';
import { BrainIcon, CompassIcon } from 'lucide-react';
import { lazy, Suspense, useEffect } from 'react';
import { GuidePage } from '@/guide-page';
import { scrollTarget, studyHref, useRoute } from '@/lib/route';

const loadStudy = () => import('@/study/study-app');
const StudyApp = lazy(() => loadStudy().then((module) => ({ default: module.StudyApp })));

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
    { href: '#/', label: 'Guía', more: ' del campus', icon: CompassIcon, active: !studying },
    { href: studyHref(), label: 'Estudiar', icon: BrainIcon, active: studying },
  ];

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <nav aria-label="Principal" className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4">
          <span className="mr-auto font-semibold tracking-tight whitespace-nowrap">FP Virtual</span>
          {tabs.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                tab.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {tab.more && <span className="hidden sm:inline">{tab.more}</span>}
            </a>
          ))}
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
