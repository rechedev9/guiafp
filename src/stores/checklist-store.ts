import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onRemoteData, syncedStorage } from '@/lib/sync';

type ChecklistState = {
  done: Record<string, boolean>;
  toggle: (id: string) => void;
};

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      done: {},
      toggle: (id) => set((state) => ({ done: { ...state.done, [id]: !state.done[id] } })),
    }),
    { name: 'guiafp-checklist', storage: syncedStorage() },
  ),
);

onRemoteData('checklist', () => void useChecklistStore.persist.rehydrate());
