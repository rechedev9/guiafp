import type { StoredState, StudyData } from './schema';

type Entries = Omit<StoredState, 'rev'>;
type DayLog = StudyData['days'][string];

const combine =
  <V>(pick: (a: V, b: V) => V) =>
  (server: Record<string, V>, local: Record<string, V>) => {
    const out = { ...server };
    for (const [key, value] of Object.entries(local)) {
      const prev = out[key];
      out[key] = prev === undefined ? value : pick(prev, value);
    }
    return out;
  };

const byMax = combine(Math.max);
const byMin = combine(Math.min);

const maxDay = (a: DayLog, b: DayLog): DayLog => ({
  xp: Math.max(a.xp, b.xp),
  cards: Math.max(a.cards, b.cards),
  right: Math.max(a.right, b.right),
  games: Math.max(a.games, b.games),
});

// Progress only grows, so the larger value wins. XP earned on two devices at once is not summed.
function mergeStudy(server: StudyData, local: StudyData): StudyData {
  return {
    ...server,
    ...local,
    cards: combine<StudyData['cards'][string]>((a, b) => (a.reviews > b.reviews ? a : b))(
      server.cards,
      local.cards,
    ),
    answers: combine<StudyData['answers'][string]>((a, b) => ({
      right: Math.max(a.right, b.right),
      wrong: Math.max(a.wrong, b.wrong),
    }))(server.answers, local.answers),
    bestTimes: byMin(server.bestTimes, local.bestTimes),
    activity: byMax(server.activity, local.activity),
    days: combine(maxDay)(server.days, local.days),
    badges: byMin(server.badges, local.badges),
    xp: Math.max(server.xp, local.xp),
    totals: {
      cards: Math.max(server.totals.cards, local.totals.cards),
      perfect: Math.max(server.totals.perfect, local.totals.perfect),
      bestCombo: Math.max(server.totals.bestCombo, local.totals.bestCombo),
      bestRun: Math.max(server.totals.bestRun, local.totals.bestRun),
    },
  };
}

// The device's own data wins where values cannot be combined, such as a ticked box.
export function mergeEntries(server: Entries, local: Entries): Entries {
  const study =
    server.study && local.study
      ? { ...local.study, state: mergeStudy(server.study.state, local.study.state) }
      : (local.study ?? server.study);
  const checklist =
    server.checklist && local.checklist
      ? {
          ...local.checklist,
          state: { done: { ...server.checklist.state.done, ...local.checklist.state.done } },
        }
      : (local.checklist ?? server.checklist);
  return { study, checklist };
}
