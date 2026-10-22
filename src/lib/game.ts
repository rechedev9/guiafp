export const DAILY_GOAL = 150;
export const QUEST_BONUS = 30;

// Each level costs 50 XP more than the one before: 100, 150, 200...
export function levelOf(xp: number) {
  let level = 1;
  let floor = 0;
  let cost = 100;
  while (xp >= floor + cost) {
    floor += cost;
    level++;
    cost += 50;
  }
  return { level, into: xp - floor, cost };
}

export type DayLog = { xp: number; cards: number; right: number; games: number };

export const emptyDay: DayLog = { xp: 0, cards: 0, right: 0, games: 0 };

export const quests = [
  { id: 'cards', title: 'Repasa 20 tarjetas', goal: 20, value: (day: DayLog) => day.cards },
  { id: 'right', title: 'Acierta 15 preguntas', goal: 15, value: (day: DayLog) => day.right },
  { id: 'games', title: 'Termina 2 partidas', goal: 2, value: (day: DayLog) => day.games },
  { id: 'xp', title: `Gana ${DAILY_GOAL} XP`, goal: DAILY_GOAL, value: (day: DayLog) => day.xp },
] as const;

export type Totals = {
  cards: number;
  perfect: number;
  bestCombo: number;
  bestRun: number;
};

export const emptyTotals: Totals = {
  cards: 0,
  perfect: 0,
  bestCombo: 0,
  bestRun: 0,
};

export type Progress = {
  xp: number;
  totals: Totals;
  streak: number;
  mastered: number;
  fastestMatch: number;
  goalDays: number;
  subjects: number;
  subjectCount: number;
};

export const achievements: {
  id: string;
  title: string;
  text: string;
  test: (p: Progress) => boolean;
}[] = [
  {
    id: 'start',
    title: 'Primer paso',
    text: 'Gana tus primeros puntos.',
    test: (p) => p.xp > 0,
  },
  {
    id: 'streak-3',
    title: 'En racha',
    text: 'Estudia 3 días seguidos.',
    test: (p) => p.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Semana completa',
    text: 'Estudia 7 días seguidos.',
    test: (p) => p.streak >= 7,
  },
  {
    id: 'combo-10',
    title: 'Imparable',
    text: 'Encadena 10 aciertos.',
    test: (p) => p.totals.bestCombo >= 10,
  },
  {
    id: 'combo-25',
    title: 'En llamas',
    text: 'Encadena 25 aciertos.',
    test: (p) => p.totals.bestCombo >= 25,
  },
  {
    id: 'perfect',
    title: 'Sin un fallo',
    text: 'Termina una partida perfecta.',
    test: (p) => p.totals.perfect >= 1,
  },
  {
    id: 'cards-100',
    title: 'Cien repasos',
    text: 'Repasa 100 tarjetas.',
    test: (p) => p.totals.cards >= 100,
  },
  {
    id: 'cards-500',
    title: 'Memoria de elefante',
    text: 'Repasa 500 tarjetas.',
    test: (p) => p.totals.cards >= 500,
  },
  {
    id: 'mastered-50',
    title: 'Dominio',
    text: 'Domina 50 tarjetas.',
    test: (p) => p.mastered >= 50,
  },
  {
    id: 'fast',
    title: 'Rayo',
    text: 'Gana Emparejar en menos de 20 segundos.',
    test: (p) => p.fastestMatch < 20_000,
  },
  {
    id: 'survivor',
    title: 'Superviviente',
    text: 'Consigue 15 aciertos en una ronda de Contrarreloj.',
    test: (p) => p.totals.bestRun >= 15,
  },
  {
    id: 'explorer',
    title: 'Trotamundos',
    text: 'Practica en todas las asignaturas.',
    test: (p) => p.subjects >= p.subjectCount,
  },
  {
    id: 'goal-7',
    title: 'Constancia',
    text: `Gana ${DAILY_GOAL} XP en 7 días distintos.`,
    test: (p) => p.goalDays >= 7,
  },
  {
    id: 'level-5',
    title: 'Guía local',
    text: 'Llega al nivel 5.',
    test: (p) => levelOf(p.xp).level >= 5,
  },
];
