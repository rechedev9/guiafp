import { Value } from '@sinclair/typebox/value';
import { Elysia, t } from 'elysia';
import { mergeEntries } from './merge';
import { ChecklistEntry, Raw, type RawData, type StoredState, StudyEntry } from './schema';
import type { Storage } from './storage';

type Deps = { storage: Storage; initial: StoredState };

function parse<T extends typeof StudyEntry | typeof ChecklistEntry>(schema: T, raw?: string) {
  if (raw === undefined) return undefined;
  const value: unknown = JSON.parse(raw);
  if (!Value.Check(schema, value)) throw new Error('invalid');
  return value;
}

function parseAll(data: RawData) {
  try {
    return {
      study: parse(StudyEntry, data.study),
      checklist: parse(ChecklistEntry, data.checklist),
    };
  } catch {
    return undefined;
  }
}

const toRaw = (state: StoredState): RawData => ({
  study: state.study && JSON.stringify(state.study),
  checklist: state.checklist && JSON.stringify(state.checklist),
});

export function createApp({ storage, initial }: Deps) {
  let current = initial;
  let saving = Promise.resolve();

  return new Elysia({ prefix: '/api' })
    .onAfterHandle(({ set }) => {
      set.headers['cache-control'] = 'no-store';
    })
    .get('/state', () => ({ rev: current.rev, data: toRaw(current) }))
    .put(
      '/state',
      async ({ body, status }) => {
        const local = parseAll(body.data);
        if (!local) return status(422, 'Datos no válidos');
        // A device that saw the latest revision replaces it; any other device is merged in.
        const base =
          body.rev === current.rev ? { study: undefined, checklist: undefined } : current;
        const merged = mergeEntries(base, local);
        const next: StoredState = {
          rev: current.rev + 1,
          study: merged.study ?? current.study,
          checklist: merged.checklist ?? current.checklist,
        };
        current = next;
        // Saves run one after another so an older state never lands on disk after a newer one.
        const write = saving.then(() => storage.save(next));
        saving = write.catch((error: unknown) => console.error('save failed', error));
        await write;
        return { rev: next.rev, data: toRaw(next) };
      },
      { body: t.Object({ rev: t.Integer(), data: Raw }) },
    );
}

export type App = ReturnType<typeof createApp>;
