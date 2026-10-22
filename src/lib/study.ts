export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a !== undefined && b !== undefined) {
      copy[i] = b;
      copy[j] = a;
    }
  }
  return copy;
}

export const percent = (part: number, whole: number) =>
  whole ? Math.round((part / whole) * 100) : 0;

// Window shortcuts skip browser combos and must not steal Enter or Space from a focused control.
export const hasModifier = (event: KeyboardEvent) => event.altKey || event.ctrlKey || event.metaKey;

export const onControl = (event: KeyboardEvent) =>
  event.target instanceof Element &&
  event.target.closest('a, button, input, textarea, select, summary') !== null;

// Lenient match: case, accents, umlaut spellings and punctuation do not count.
function normalize(answer: string) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.,!?¡¿'’"]/g, '')
    .replace(/\s+/g, ' ');
}

export const isCorrect = (input: string, answers: string[]) =>
  answers.some((answer) => normalize(answer) === normalize(input));

// Spanish prompts and grammar notes must not be read with a German or English voice.
const spanishHint = /[¿¡áéíóúñ→+]|\b(de|en|vs|caso|con|para|y)\b/i;

const speakText = (text: string) =>
  text
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const canSpeak = (text: string) =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && !spanishHint.test(text);

export function speak(text: string, lang: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speakText(text));
  utterance.lang = lang;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}
