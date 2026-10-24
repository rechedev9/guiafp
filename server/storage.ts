import { Value } from '@sinclair/typebox/value';
import { copyFile, mkdir, readdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { Stored, type StoredState } from './schema';

const KEEP_BACKUPS = 30;

export type Storage = {
  load: () => Promise<StoredState>;
  save: (state: StoredState) => Promise<void>;
};

// One file per state, written to a temp file and renamed so a crash never leaves half a file.
// The first save of each day copies the previous state to backups/, keeping the last 30 days.
export function fileStorage(dir: string): Storage {
  const file = join(dir, 'state.json');
  const backups = join(dir, 'backups');

  async function backup() {
    if (!(await Bun.file(file).exists())) return;
    const target = join(backups, `${new Date().toISOString().slice(0, 10)}.json`);
    if (await Bun.file(target).exists()) return;
    await mkdir(backups, { recursive: true });
    await copyFile(file, target);
    const old = (await readdir(backups)).toSorted().slice(0, -KEEP_BACKUPS);
    await Promise.all(old.map((name) => rm(join(backups, name))));
  }

  return {
    load: async () => {
      const source = Bun.file(file);
      if (!(await source.exists())) return { rev: 0 };
      const value: unknown = await source.json();
      if (!Value.Check(Stored, value)) throw new Error(`${file} does not match the schema`);
      return value;
    },
    save: async (state) => {
      await mkdir(dir, { recursive: true });
      await backup();
      await Bun.write(`${file}.tmp`, JSON.stringify(state));
      await rename(`${file}.tmp`, file);
    },
  };
}
