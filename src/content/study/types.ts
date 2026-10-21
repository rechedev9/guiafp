import type { CourseCode } from '@/content/guide';

// Text fields accept **bold** for key terms.
type Section = { title: string; points: string[] };

export type QuizItem = { q: string; right: string; wrong: string[]; why: string };

export type ClozeItem = { text: string; answer: string; alt?: string[]; hint?: string };

export type Sequence = {
  title: string;
  instruction: string;
  items: [label: string, detail: string][];
};

export type Unit = {
  id: string;
  title: string;
  source: string;
  summary: string;
  sections: Section[];
  selfCheck: [question: string, answer: string][];
  cards: [front: string, back: string][];
  quiz: QuizItem[];
  cloze?: ClozeItem[];
  sequences?: Sequence[];
};

type Exam = { first: string; second: string; parts: string[] };

// Dates are plain YYYY-MM-DD; online deliveries close at 23:59 Madrid time.
export type Deadline = { date: string; course: CourseCode; what: string };

type Calendar = { deadlines: Deadline[]; venues: readonly (readonly [string, string])[] };

export type Subject = {
  slug: string;
  tab: string;
  code: CourseCode;
  title: string;
  lead: string;
  grading: string[];
  exam?: Exam;
  calendar?: Calendar;
  speak?: 'de-DE' | 'en-GB';
  units: Unit[];
};
