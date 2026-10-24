import { treaty } from '@elysiajs/eden';
import { create } from 'zustand';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { App } from '../../server/app';
import type { RawData } from '../../server/schema';

type Part = keyof RawData;

const storageKeys: Record<Part, string> = { study: 'guiafp-study', checklist: 'guiafp-checklist' };
const parts = ['study', 'checklist'] as const;
// Present while this device holds exactly what the server has; missing on first run too.
const CLEAN_KEY = 'guiafp-sync-clean';
const PUSH_DELAY_MS = 1000;
const RETRY_MS = 15_000;

export type SyncStatus = 'saving' | 'saved' | 'offline';

export const useSyncStatus = create<{ status: SyncStatus }>()(() => ({ status: 'saving' }));

const api = treaty<App>(window.location.origin).api;
const rehydrators = new Map<Part, () => void>();

// The server revision the local data is based on; -1 makes the first push a merge.
let rev = -1;
let edits = 0;
let busy = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function snapshot() {
  const data: RawData = {};
  for (const part of parts) {
    const raw = localStorage.getItem(storageKeys[part]);
    if (raw !== null) data[part] = raw;
  }
  return data;
}

function apply(data: RawData) {
  for (const part of parts) {
    const raw = data[part];
    if (raw === undefined || raw === localStorage.getItem(storageKeys[part])) continue;
    localStorage.setItem(storageKeys[part], raw);
    rehydrators.get(part)?.();
  }
}

const request = (keepalive: boolean) =>
  localStorage.getItem(CLEAN_KEY) === null
    ? api.state.put({ rev, data: snapshot() }, { fetch: { keepalive } })
    : api.state.get({ fetch: { keepalive } });

async function sync(keepalive = false) {
  if (busy) return;
  busy = true;
  clearTimeout(timer);
  const before = edits;
  useSyncStatus.setState({ status: 'saving' });
  const reply = await request(keepalive).catch(() => undefined);
  busy = false;
  if (!reply?.data) {
    useSyncStatus.setState({ status: 'offline' });
    timer = setTimeout(() => void sync(), RETRY_MS);
    return;
  }
  // A change made during the request is pushed again with the old revision, so the server merges it.
  if (edits !== before) {
    void sync();
    return;
  }
  apply(reply.data.data);
  rev = reply.data.rev;
  localStorage.setItem(CLEAN_KEY, '1');
  useSyncStatus.setState({ status: 'saved' });
}

function changed() {
  edits++;
  localStorage.removeItem(CLEAN_KEY);
  useSyncStatus.setState({ status: 'saving' });
  clearTimeout(timer);
  timer = setTimeout(() => void sync(), PUSH_DELAY_MS);
}

const local: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    changed();
  },
  removeItem: (name) => localStorage.removeItem(name),
};

// zustand persist storage that also sends every write to the server.
export const syncedStorage = <S>() => createJSONStorage<S>(() => local);

export function onRemoteData(part: Part, rehydrate: () => void) {
  rehydrators.set(part, rehydrate);
}

export function startSync() {
  void sync();
  window.addEventListener('online', () => void sync());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void sync();
    else if (localStorage.getItem(CLEAN_KEY) === null) void sync(true);
  });
  // Another tab wrote new data: reload it here so this tab does not save over it.
  window.addEventListener('storage', (event) => {
    for (const part of parts) {
      if (event.key === storageKeys[part]) rehydrators.get(part)?.();
    }
  });
}
