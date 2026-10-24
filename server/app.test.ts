import { describe, expect, test } from 'bun:test';
import { createApp } from './app';
import type { RawData, StoredState } from './schema';

const study = (cards: Record<string, number>, muted = false) =>
  JSON.stringify({
    state: {
      cards: Object.fromEntries(
        Object.entries(cards).map(([id, reviews]) => [id, { box: 1, due: 0, reviews, lapses: 0 }]),
      ),
      answers: {},
      bestTimes: {},
      activity: {},
      xp: 0,
      days: {},
      totals: { cards: 0, perfect: 0, bestCombo: 0, bestRun: 0 },
      badges: {},
      muted,
    },
    version: 0,
  });

function setup() {
  const saved: StoredState[] = [];
  const storage = {
    load: async () => ({ rev: 0 }),
    save: async (state: StoredState) => void saved.push(state),
  };
  const app = createApp({ storage, initial: { rev: 0 } });
  const put = async (body: { rev: number; data: RawData }) => {
    const response = await app.handle(
      new Request('http://test/api/state', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
    return { status: response.status, body: response.ok ? await response.json() : undefined };
  };
  return { put, saved };
}

const cardsOf = (raw: string) => Object.keys(JSON.parse(raw).state.cards).toSorted();

describe('PUT /api/state', () => {
  test('a device on the latest revision replaces the saved progress', async () => {
    const { put, saved } = setup();
    const first = await put({ rev: -1, data: { study: study({ a: 1 }) } });
    const second = await put({ rev: first.body.rev, data: { study: study({ b: 1 }) } });
    expect(second.body.rev).toBe(2);
    expect(cardsOf(second.body.data.study)).toEqual(['b']);
    expect(saved).toHaveLength(2);
  });

  test('a device behind the server merges, keeping the most reviewed card and its own settings', async () => {
    const { put } = setup();
    await put({ rev: -1, data: { study: study({ a: 3, b: 1 }) } });
    const stale = await put({ rev: 0, data: { study: study({ a: 1, c: 1 }, true) } });
    const state = JSON.parse(stale.body.data.study).state;
    expect(cardsOf(stale.body.data.study)).toEqual(['a', 'b', 'c']);
    expect(state.cards.a.reviews).toBe(3);
    expect(state.muted).toBe(true);
  });

  test('rejects progress that does not match the schema', async () => {
    const { put, saved } = setup();
    const reply = await put({
      rev: -1,
      data: { study: JSON.stringify({ state: { xp: 'mucho' } }) },
    });
    expect(reply.status).toBe(422);
    expect(saved).toHaveLength(0);
  });
});
