import {makeTimeline, VoiceData} from '../../brand/timeline';
import voice from './voice.json';

// Voix de la marque (scripts/voice/tts_voix.py) alignée mot à mot. La réponse du quiz reste dans la
// scène du quiz : on fusionne les parties « quiz » et « reponse » (les mots gardent leur timing).
const rep = voice.sections.find((s) => s.id === 'reponse')!;
const merged: VoiceData = {
	...voice,
	sections: voice.sections.filter((s) => s.id !== 'reponse').map((s) => (s.id === 'quiz' ? {...s, end: rep.end} : s)),
};

export const TL = makeTimeline(merged, {minTotal: 61 * 30, tail: 1.2, endCard: 2.6, transition: 14, preRoll: 0.25});

export const SCENE_IDS = ['intro', 'def', 'mesure', 'norme', 'tachy', 'brady', 'rythme', 'quiz', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];

/** Frame locale d'un mot dans une scène (n-ième occurrence). */
export const at = (scene: SceneId, word: string, n = 1) => TL.cue(scene, word, n);
/** Début (frame absolue) d'une scène. */
export const start = (scene: SceneId) => TL.starts[SCENE_IDS.indexOf(scene)];
/** Frame absolue d'un mot : pour la mascotte, qui traverse les scènes. */
export const abs = (scene: SceneId, word: string, n = 1) => start(scene) + TL.cue(scene, word, n);
