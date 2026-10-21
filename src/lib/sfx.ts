export type Sound = 'right' | 'wrong' | 'done' | 'level' | 'badge';

let context: AudioContext | undefined;

type Note = { freq: number; at: number; length: number; type?: OscillatorType; volume?: number };

function tone(audio: AudioContext, { freq, at, length, type = 'sine', volume = 0.07 }: Note) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + at;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

type Arpeggio = { freqs: number[]; step: number; type: OscillatorType; volume?: number };

const arpeggio = ({ freqs, step, type, volume }: Arpeggio): Note[] =>
  freqs.map((freq, i) => ({ freq, at: i * step, length: step * 2.5, type, volume }));

// The right-answer chime climbs a semitone per combo step, up to an octave.
function notes(sound: Sound, combo: number): Note[] {
  const base = 523 * 2 ** (Math.min(combo, 12) / 12);
  if (sound === 'right') {
    return [
      { freq: base, at: 0, length: 0.12 },
      { freq: base * 1.5, at: 0.07, length: 0.18 },
    ];
  }
  if (sound === 'wrong') {
    return [
      { freq: 220, at: 0, length: 0.16, type: 'triangle', volume: 0.09 },
      { freq: 165, at: 0.1, length: 0.22, type: 'triangle', volume: 0.09 },
    ];
  }
  if (sound === 'done') return arpeggio({ freqs: [523, 659, 784], step: 0.09, type: 'triangle' });
  if (sound === 'level') {
    return arpeggio({
      freqs: [523, 659, 784, 1047, 1319],
      step: 0.08,
      type: 'square',
      volume: 0.035,
    });
  }
  return arpeggio({ freqs: [784, 988, 1175, 1568], step: 0.07, type: 'triangle' });
}

export function play(sound: Sound, combo = 0) {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return;
  context ??= new AudioContext();
  const audio = context;
  void audio.resume().then(() => {
    for (const note of notes(sound, combo)) tone(audio, note);
  });
}
