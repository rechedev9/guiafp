import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StudyData } from '../../server/schema';
import { subjectSlugOf, subjects } from '@/content/study';
import { today } from '@/lib/dates';
import {
  achievements,
  DAILY_GOAL,
  emptyDay,
  emptyTotals,
  levelOf,
  type Progress,
  QUEST_BONUS,
  quests,
} from '@/lib/game';
import { play, type Sound } from '@/lib/sfx';
import { onRemoteData, syncedStorage } from '@/lib/sync';
import { type Toast, useGameFeed } from '@/stores/game-feed';

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

const cardXp: Record<Grade, number> = { again: 2, hard: 6, good: 10, easy: 12 };

type Finish = { perfect: boolean; run?: number };

// correct: true grows the combo, false breaks it, undefined leaves it.
type Gain = { xp: number; correct?: boolean; cards?: number; right?: number; finish?: Finish };

// The server validates the saved progress, so its schema defines the shape.
type Saved = StudyData;

type StudyState = Saved & {
  grade: (review: { id: string; grade: Grade; finish?: Finish }) => void;
  answer: (result: { id: string; correct: boolean; finish?: Finish }) => void;
  hit: (result: { correct: boolean; finish?: Finish }) => void;
  complete: (finish: Finish) => void;
  saveTime: (key: string, ms: number) => void;
  toggleMute: () => void;
};

const bump = (activity: Record<string, number>) => {
  const day = String(today());
  return { ...activity, [day]: (activity[day] ?? 0) + 1 };
};

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

function progressOf(state: Saved): Progress {
  const practised = new Set(
    [...Object.keys(state.cards), ...Object.keys(state.answers)].map(subjectSlugOf),
  );
  return {
    xp: state.xp,
    totals: state.totals,
    streak: streak(state.activity),
    mastered: deckStats(Object.keys(state.cards), state.cards).mastered,
    fastestMatch: Math.min(Infinity, ...Object.values(state.bestTimes)),
    goalDays: Object.values(state.days).filter((day) => day.xp >= DAILY_GOAL).length,
    subjects: subjects.filter((subject) => practised.has(subject.slug)).length,
    subjectCount: subjects.length,
  };
}

type SoundCause = { levelUp: boolean; toasts: number; gain: Gain };

function soundOf({ levelUp, toasts, gain }: SoundCause): Sound | undefined {
  if (levelUp) return 'level';
  if (toasts > 0) return 'badge';
  if (gain.finish) return 'done';
  if (gain.correct === undefined) return undefined;
  return gain.correct ? 'right' : 'wrong';
}

let eventId = 0;

type RewardOptions = { state: Saved; gain: Gain; patch?: Partial<Saved> };

// Side effects: pushes toasts to the game feed and plays one sound.
function reward({ state, gain, patch }: RewardOptions): Saved {
  const feed = useGameFeed.getState();
  const key = String(today());
  const { finish } = gain;
  const combo = gain.correct === undefined ? feed.combo : gain.correct ? feed.combo + 1 : 0;
  const earned = gain.xp + (finish ? (finish.perfect ? 50 : 25) : 0);
  const before = state.days[key] ?? emptyDay;
  const day = {
    xp: before.xp + earned,
    cards: before.cards + (gain.cards ?? 0),
    right: before.right + (gain.right ?? 0),
    games: before.games + (finish ? 1 : 0),
  };
  const toasts: Toast[] = [];
  const add = (toast: Omit<Toast, 'id'>) => toasts.push({ ...toast, id: ++eventId });
  for (const quest of quests) {
    if (quest.value(before) >= quest.goal || quest.value(day) < quest.goal) continue;
    day.xp += QUEST_BONUS;
    add({
      kind: 'quest',
      title: 'Objetivo cumplido',
      detail: `${quest.title}: +${QUEST_BONUS} XP`,
    });
  }
  const gained = day.xp - before.xp;
  const next: Saved = {
    ...state,
    ...patch,
    xp: state.xp + gained,
    days: { ...state.days, [key]: day },
    totals: {
      cards: state.totals.cards + (gain.cards ?? 0),
      perfect: state.totals.perfect + (finish?.perfect ? 1 : 0),
      bestCombo: Math.max(state.totals.bestCombo, combo),
      bestRun: Math.max(state.totals.bestRun, finish?.run ?? 0),
    },
    activity: bump(state.activity),
  };

  const level = levelOf(next.xp);
  const levelUp = level.level > levelOf(state.xp).level;
  if (levelUp) {
    add({
      kind: 'level',
      title: `Nivel ${level.level}`,
      detail: `Has llegado al nivel ${level.level}.`,
    });
  }
  const progress = progressOf(next);
  const badges = { ...state.badges };
  for (const badge of achievements) {
    if (badges[badge.id] !== undefined || !badge.test(progress)) continue;
    badges[badge.id] = today();
    add({ kind: 'badge', title: `Logro: ${badge.title}`, detail: badge.text });
  }

  const sound = soundOf({ levelUp, toasts: toasts.length, gain });
  if (sound && !state.muted) play(sound, combo);
  useGameFeed.setState({
    combo,
    toasts: [...feed.toasts, ...toasts].slice(-3),
  });
  return { ...next, badges };
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      cards: {},
      answers: {},
      bestTimes: {},
      activity: {},
      xp: 0,
      days: {},
      totals: emptyTotals,
      badges: {},
      muted: false,
      grade: ({ id, grade, finish }) => {
        const state = get();
        const cards = { ...state.cards, [id]: schedule(state.cards[id], grade) };
        const correct = grade === 'again' ? false : grade === 'hard' ? undefined : true;
        const gain = { xp: cardXp[grade], correct, cards: 1, finish };
        set(reward({ state, gain, patch: { cards } }));
      },
      answer: ({ id, correct, finish }) => {
        const state = get();
        const prev = state.answers[id] ?? { right: 0, wrong: 0 };
        const stats = correct
          ? { ...prev, right: prev.right + 1 }
          : { ...prev, wrong: prev.wrong + 1 };
        const answers = { ...state.answers, [id]: stats };
        const gain = { xp: correct ? 10 : 2, correct, right: correct ? 1 : 0, finish };
        set(reward({ state, gain, patch: { answers } }));
      },
      hit: ({ correct, finish }) =>
        set(reward({ state: get(), gain: { xp: correct ? 5 : 0, correct, finish } })),
      complete: (finish) => set(reward({ state: get(), gain: { xp: 0, finish } })),
      saveTime: (key, ms) =>
        set((state) => {
          const best = state.bestTimes[key];
          return best !== undefined && best <= ms
            ? state
            : { bestTimes: { ...state.bestTimes, [key]: ms } };
        }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
    }),
    { name: 'guiafp-study', storage: syncedStorage() },
  ),
);

onRemoteData('study', () => void useStudyStore.persist.rehydrate());

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
