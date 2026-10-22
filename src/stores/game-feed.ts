import { create } from 'zustand';

export type Toast = {
  id: number;
  kind: 'level' | 'badge' | 'quest';
  title: string;
  detail: string;
};

// Session-only game events: kept out of the persisted store so they never trigger a save.
type GameFeed = {
  combo: number;
  toasts: Toast[];
  dismiss: (id: number) => void;
};

export const useGameFeed = create<GameFeed>()((set) => ({
  combo: 0,
  toasts: [],
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
