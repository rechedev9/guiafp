export const TIME_ZONE = 'Europe/Madrid';

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('es-ES', { ...options, timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}
