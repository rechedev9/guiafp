import { ap2 } from '@/content/study/ap2';
import { hcib } from '@/content/study/hcib';
import { ipo2 } from '@/content/study/ipo2';
import { pi } from '@/content/study/pi';
import { slea1 } from '@/content/study/slea1';
import { slea2 } from '@/content/study/slea2';
import { tutoria } from '@/content/study/tutoria';
import type { ClozeItem, QuizItem, Subject } from '@/content/study/types';

export const subjects: Subject[] = [hcib, ipo2, ap2, slea1, slea2, pi, tutoria];

export const findSubject = (slug: string) => subjects.find((subject) => subject.slug === slug);

// FNV-1a: ids derive from the text, so progress survives reordering the content.
function hashId(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export type StudyCard = {
  id: string;
  subject: Subject;
  front: string;
  back: string;
};

export type StudyQuiz = QuizItem & { id: string };
export type StudyCloze = ClozeItem & { id: string };

export const unitsOf = (subject: Subject, unitId?: string) =>
  subject.units.filter((unit) => !unitId || unit.id === unitId);

export const cardsOf = (subject: Subject, unitId?: string): StudyCard[] =>
  unitsOf(subject, unitId).flatMap((unit) =>
    unit.cards.map(([front, back]) => ({
      id: `${subject.slug}/${unit.id}/${hashId(front)}`,
      subject,
      front,
      back,
    })),
  );

export const quizOf = (subject: Subject, unitId?: string): StudyQuiz[] =>
  unitsOf(subject, unitId).flatMap((unit) =>
    unit.quiz.map((item) => ({ ...item, id: `${subject.slug}/${unit.id}/q${hashId(item.q)}` })),
  );

export const clozeOf = (subject: Subject, unitId?: string): StudyCloze[] =>
  unitsOf(subject, unitId).flatMap((unit) =>
    (unit.cloze ?? []).map((item) => ({
      ...item,
      id: `${subject.slug}/${unit.id}/c${hashId(item.text)}`,
    })),
  );

export const sequencesOf = (subject: Subject, unitId?: string) =>
  unitsOf(subject, unitId).flatMap((unit) => unit.sequences ?? []);

// Every study id starts with its subject slug, as built above.
export const subjectSlugOf = (id: string) => id.split('/')[0] ?? '';

export const allCards = () => subjects.flatMap((subject) => cardsOf(subject));

export const allQuiz = () => subjects.flatMap((subject) => quizOf(subject));
