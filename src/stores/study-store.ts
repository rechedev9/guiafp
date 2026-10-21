import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { today } from '@/lib/dates';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

// Leitner box: box n waits INTERVALS[n] days. Box 0 is due again the same day.
export type CardState = { box: number; due: number; reviews: number; lapses: number };

const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
const MAX_BOX = INTERVALS.length - 1;
const MASTERED_BOX = 4;

const interval = (box: number) => INTERVALS[Math.min(box, MAX_BOX)] ?? 0;

export function schedule(state: CardState | undefined, grade: Grade): CardState {
  const day = today();
  const prev = state ?? { box: 0, due: day, reviews: 0, lapses: 0 };
  const reviews = prev.reviews + 1;
  if (grade === 'again') {
    return { box: 0, due: day, reviews, lapses: prev.lapses + (prev.box > 0 ? 1 : 0) };
  }
  if (grade === 'hard') {
    const box = Math.max(1, prev.box);
    return { ...prev, box, due: day + Math.max(1, Math.floor(interval(box) / 2)), reviews };
  }
  const box = Math.min(MAX_BOX, prev.box + (grade === 'easy' ? 2 : 1));
  return { ...prev, box, due: day + interval(box), reviews };
}

type StudyState = {
  cards: Record<string, CardState>;
  answers: Record<string, { right: number; wrong: number }>;
  bestTimes: Record<string, number>;
  activity: Record<string, number>;
  grade: (id: string, grade: Grade) => void;
  answer: (id: string, correct: boolean) => void;
  saveTime: (key: string, ms: number) => void;
};

const bump = (activity: Record<string, number>) => {
  const day = String(today());
  return { ...activity, [day]: (activity[day] ?? 0) + 1 };
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      cards: {},
      answers: {},
      bestTimes: {},
      activity: {},
      grade: (id, grade) =>
        set((state) => ({
          cards: { ...state.cards, [id]: schedule(state.cards[id], grade) },
          activity: bump(state.activity),
        })),
      answer: (id, correct) =>
        set((state) => {
          const prev = state.answers[id] ?? { right: 0, wrong: 0 };
          const next = correct
            ? { ...prev, right: prev.right + 1 }
            : { ...prev, wrong: prev.wrong + 1 };
          return { answers: { ...state.answers, [id]: next }, activity: bump(state.activity) };
        }),
      saveTime: (key, ms) =>
        set((state) => {
          const best = state.bestTimes[key];
          return best !== undefined && best <= ms
            ? state
            : { bestTimes: { ...state.bestTimes, [key]: ms } };
        }),
    }),
    { name: 'guiafp-study' },
  ),
);

export function streak(activity: Record<string, number>) {
  let day = today();
  // A streak survives until the end of the day after the last session.
  if (!activity[String(day)]) day -= 1;
  let count = 0;
  while (activity[String(day)]) {
    count++;
    day--;
  }
  return count;
}

export type DeckStats = { total: number; fresh: number; due: number; mastered: number };

export function deckStats(ids: string[], cards: Record<string, CardState>): DeckStats {
  const day = today();
  const stats = { total: ids.length, fresh: 0, due: 0, mastered: 0 };
  for (const id of ids) {
    const card = cards[id];
    if (!card) stats.fresh++;
    else {
      if (card.due <= day) stats.due++;
      if (card.box >= MASTERED_BOX) stats.mastered++;
    }
  }
  return stats;
}
