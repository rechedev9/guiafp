import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { allCards, findSubject } from '@/content/study';
import { type Route, studyHref } from '@/lib/route';
import { Challenge } from '@/study/challenge';
import { Flashcards } from '@/study/flashcards';
import { StudyHome } from '@/study/study-home';
import { Toasts } from '@/study/study-status';
import { SubjectPage } from '@/study/subject-page';

type SessionPageProps = { title: string; lead: string; children: ReactNode };

function SessionPage({ title, lead, children }: SessionPageProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <nav aria-label="Ruta" className="flex items-center gap-1 text-sm text-muted-foreground">
          <a href={studyHref()} className="transition-colors hover:text-foreground">
            Estudiar
          </a>
          <ChevronRightIcon className="size-3.5" />
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{lead}</p>
      </header>
      {children}
    </div>
  );
}

function StudyRoute({ route }: { route: Route }) {
  if (route.page === 'review') {
    return (
      <SessionPage
        title="Repaso mezclado"
        lead="Las tarjetas que tocan hoy de todas las asignaturas, mezcladas. Cambiar de tema cuesta un poco más, pero se recuerda mejor."
      >
        <Flashcards cards={allCards()} mixed />
      </SessionPage>
    );
  }
  if (route.page === 'challenge') {
    return (
      <SessionPage
        title="Contrarreloj"
        lead="Preguntas de test de todas las asignaturas con 20 segundos para cada una."
      >
        <Challenge />
      </SessionPage>
    );
  }
  if (route.page === 'subject') {
    const subject = findSubject(route.slug);
    if (subject) return <SubjectPage key={subject.slug} subject={subject} mode={route.mode} />;
  }
  return <StudyHome />;
}

export function StudyApp({ route }: { route: Route }) {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <StudyRoute route={route} />
      </main>
      <Toasts />
    </>
  );
}
