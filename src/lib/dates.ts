export const TIME_ZONE = 'Europe/Madrid';

const DAY_MS = 86_400_000;
// en-CA formats as YYYY-MM-DD, which Date.parse reads as UTC midnight.
const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('es-ES', { ...options, timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}

// Calendar day number in Madrid, so day counts ignore the hour.
const campusDay = (time: number) => Date.parse(dayKey.format(time)) / DAY_MS;

export const today = () => campusDay(Date.now());

export const daysUntil = (iso: string) => campusDay(Date.parse(iso)) - today();

export const relativeDays = (days: number) =>
  days === 0 ? 'hoy' : days === 1 ? 'mañana' : `en ${days} días`;
