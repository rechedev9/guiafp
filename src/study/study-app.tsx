import { ArrowLeftIcon } from 'lucide-react';
import { allCards, findSubject } from '@/content/study';
import { type Route, studyHref } from '@/lib/route';
import { Challenge } from '@/study/challenge';
import { Flashcards } from '@/study/flashcards';
import { PlayerHud } from '@/study/player-hud';
import { StudyHome } from '@/study/study-home';
import { SubjectPage } from '@/study/subject-page';

function BackLink() {
  return (
    <a
      href={studyHref()}
      className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="size-4" />
      Todas las asignaturas
    </a>
  );
}

function StudyRoute({ route }: { route: Route }) {
  if (route.page === 'review') {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Repaso mezclado</h1>
          <p className="max-w-prose text-muted-foreground">
            Las tarjetas que tocan hoy de todas las asignaturas, mezcladas. Cambiar de tema cuesta
            un poco más, pero se recuerda mejor.
          </p>
        </header>
        <Flashcards cards={allCards()} mixed />
      </div>
    );
  }
  if (route.page === 'challenge') {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <Challenge />
      </div>
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
      <PlayerHud />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <StudyRoute route={route} />
      </main>
    </>
  );
}
