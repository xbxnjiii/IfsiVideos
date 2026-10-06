// Timeline générique « voix → scènes → animations » pour les vidéos La Petite IDE.
// voice.json est produit par scripts/voice/tts_maquette.py (voix maquette) ou
// scripts/voice/prepare_voice.py (vraie voix) : remplacer la voix recale toute la vidéo.

export type VoiceData = {
	duration: number;
	sections: {id: string; start: number; end: number}[];
	words: {text: string; start: number; end: number}[];
};

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9']/g, '');

export const makeTimeline = (
	voice: VoiceData,
	opts: {
		fps?: number;
		/** frames de silence avant le premier mot */
		offset?: number;
		/** durée des transitions (frames) */
		transition?: number;
		/** les animations anticipent le mot de quelques frames */
		lead?: number;
		/** secondes gardées après le dernier mot avant la carte logo */
		tail?: number;
		/** durée de la carte logo finale (s) */
		endCard?: number;
		/** durée minimale de la vidéo (frames) */
		minTotal?: number;
		/** la transition démarre `preRoll` s avant que la voix n'attaque la partie */
		preRoll?: number;
	} = {},
) => {
	const fps = opts.fps ?? 30;
	const offset = opts.offset ?? 8;
	const transition = opts.transition ?? 18;
	const lead = opts.lead ?? 3;
	const off = offset / fps;
	const sec2f = (s: number) => Math.round(s * fps);

	const ids = [...voice.sections.map((s) => s.id), 'end'];
	const last = voice.sections[voice.sections.length - 1];
	const endStart = sec2f(last.end + off + (opts.tail ?? 1.3));
	const starts = [
		0,
		// la transition commence `preRoll` s avant que la voix n'attaque la partie
		...voice.sections.slice(1).map((s) => sec2f(s.start + off - (opts.preRoll ?? 0.35))),
		endStart,
	];
	const total = Math.max(opts.minTotal ?? 0, endStart + sec2f(opts.endCard ?? 3.4));
	const durations = starts.map((s, i) => (i < starts.length - 1 ? starts[i + 1] - s + transition : total - s));

	/** Instant (s, temps vidéo) du n-ième mot `word` prononcé après `after` s. */
	const sec = (word: string, after = 0, n = 1) => {
		let c = 0;
		for (const w of voice.words) {
			if (w.start + off >= after && norm(w.text) === norm(word) && ++c === n) return w.start + off;
		}
		throw new Error(`Mot « ${word} » introuvable après ${after.toFixed(2)} s`);
	};

	/** Frame locale de la scène `id` à laquelle `word` est prononcé (n-ième occurrence). */
	const cue = (id: string, word: string, n = 1) => {
		const i = ids.indexOf(id);
		if (i < 0) throw new Error(`Scène inconnue : ${id}`);
		return sec2f(sec(word, starts[i] / fps - 0.05, n)) - starts[i] - lead;
	};

	/** Fin de parole (frame locale) de la partie `id`. */
	const speechEnd = (id: string) => {
		const i = ids.indexOf(id);
		return sec2f(voice.sections[i].end + off) - starts[i];
	};

	return {fps, offset, transition, lead, ids, starts, durations, total, words: voice.words, cue, speechEnd};
};

export type Timeline = ReturnType<typeof makeTimeline>;
