import {makeTimeline} from '../../brand/timeline';
import voice from './voice.json';

// Voix de la marque (scripts/voice/tts_voix.py) alignée mot à mot. Transitions de 14 frames,
// démarrées 0,25 s avant que la voix attaque la partie.
export const TL = makeTimeline(voice, {minTotal: 61 * 30, tail: 1.2, endCard: 2.6, transition: 14, preRoll: 0.25});

export const SCENE_IDS = ['intro', 'def', 'mesure', 'norme', 'tachy', 'brady', 'rythme', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];

/** Frame locale d'un mot dans une scène (n-ième occurrence). */
export const at = (scene: SceneId, word: string, n = 1) => TL.cue(scene, word, n);
/** Début (frame absolue) d'une scène. */
export const start = (scene: SceneId) => TL.starts[SCENE_IDS.indexOf(scene)];
/** Frame absolue d'un mot : pour la mascotte, qui traverse les scènes. */
export const abs = (scene: SceneId, word: string, n = 1) => start(scene) + TL.cue(scene, word, n);
