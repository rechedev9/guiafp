import { t } from 'elysia';

const count = t.Number({ minimum: 0 });

const Study = t.Object({
  cards: t.Record(
    t.String(),
    t.Object({ box: count, due: t.Number(), reviews: count, lapses: count }),
  ),
  answers: t.Record(t.String(), t.Object({ right: count, wrong: count })),
  bestTimes: t.Record(t.String(), count),
  activity: t.Record(t.String(), count),
  xp: count,
  days: t.Record(t.String(), t.Object({ xp: count, cards: count, right: count, games: count })),
  totals: t.Object({ cards: count, perfect: count, bestCombo: count, bestRun: count }),
  badges: t.Record(t.String(), t.Number()),
  muted: t.Boolean(),
});

const Checklist = t.Object({ done: t.Record(t.String(), t.Boolean()) });

// The { state, version } shape that zustand persist writes to localStorage.
export const StudyEntry = t.Object({ state: Study, version: t.Optional(t.Number()) });
export const ChecklistEntry = t.Object({ state: Checklist, version: t.Optional(t.Number()) });

export const Stored = t.Object({
  rev: t.Integer({ minimum: 0 }),
  study: t.Optional(StudyEntry),
  checklist: t.Optional(ChecklistEntry),
});

// The client sends and receives the raw localStorage strings, so it never parses them.
export const Raw = t.Object({
  study: t.Optional(t.String({ maxLength: 2_000_000 })),
  checklist: t.Optional(t.String({ maxLength: 100_000 })),
});

export type StudyData = typeof Study.static;
export type StoredState = typeof Stored.static;
export type RawData = typeof Raw.static;
