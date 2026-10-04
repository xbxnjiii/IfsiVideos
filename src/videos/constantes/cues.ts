// Synchronisation voix ↔ animations.
// Toutes les animations sont déclenchées par un MOT de la voix off (voice.json, généré par
// scripts/voice/prepare_voice.py). Si on remplace la voix, tout se recale automatiquement.
import voice from './voice.json';

export const FPS = 30;
/** Petit temps d'avance avant le premier mot, pour laisser le personnage apparaître. */
export const VOICE_OFFSET = 8;
export const TRANSITION = 14;
/** Les animations anticipent légèrement le mot (Whisper date les mots un peu tard). */
export const CUE_LEAD = 4;
/** Durée minimale de la vidéo (1 min) et temps gardé après le dernier mot pour la conclusion. */
const MIN_TOTAL = 60 * FPS + 30;
const OUTRO_HOLD = 5.0;

export type Word = {text: string; start: number; end: number};
export const WORDS: Word[] = voice.words;

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9']/g, '');

const off = VOICE_OFFSET / FPS;

/** Instant (s, temps vidéo) du n-ième mot `word` prononcé après `after` secondes. */
export const sec = (word: string, after = 0, n = 1): number => {
	let count = 0;
	for (const w of WORDS) {
		if (w.start + off >= after && norm(w.text) === norm(word)) {
			count++;
			if (count === n) return w.start + off;
		}
	}
	throw new Error(`Mot « ${word} » introuvable après ${after}s dans voice.json`);
};

/** Début de parole d'une section = fin du blanc qui la précède (ou début du mot). */
const speechStart = (s: {speech: number}) => {
	const pause = voice.pauses.filter((p) => p.end <= s.speech + 0.35 && p.end >= s.speech - 1.2).pop();
	return (pause ? pause.end : s.speech) + off;
};

export const SCENES = ['intro', 'temp', 'fc', 'fr', 'pa', 'spo2', 'outro'] as const;
export type SceneId = (typeof SCENES)[number];

/** La transition démarre 0,3 s avant que la voix n'attaque la partie suivante. */
export const STARTS: number[] = [0, ...voice.sections.map((s) => Math.round((speechStart(s) - 0.3) * FPS))];

const lastWord = WORDS[WORDS.length - 1];
export const TOTAL = Math.max(MIN_TOTAL, Math.round((lastWord.end + off + OUTRO_HOLD) * FPS));

export const DURATIONS: number[] = STARTS.map((s, i) =>
	i < STARTS.length - 1 ? STARTS[i + 1] - s + TRANSITION : TOTAL - s,
);

/** Frame locale (relative au début de la scène) à laquelle `word` est prononcé. */
export const cue = (scene: SceneId, word: string, n = 1): number => {
	const i = SCENES.indexOf(scene);
	return Math.round(sec(word, STARTS[i] / FPS - 0.05, n) * FPS) - STARTS[i] - CUE_LEAD;
};
