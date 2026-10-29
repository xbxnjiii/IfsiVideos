import {makeTimeline} from '../../brand/timeline';
import voice from './voice.json';

/** 72 bpm à 30 fps (battement toutes les 25 frames). */
export const BEAT = 25;

// Voix : voir voix/02-constantes.script.json (texte exact dit). Transitions de 14 frames, démarrées 0,25 s avant la partie.
export const TL = makeTimeline(voice, {minTotal: 61 * 30, tail: 1.2, endCard: 2.6, transition: 14, preRoll: 0.25});

export const SCENE_IDS = ['intro', 'temp', 'fc', 'fr', 'pa', 'spo2', 'gly', 'diu', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];

/** Raccourci : frame locale d'un mot dans une scène. */
export const at = (scene: SceneId, word: string, n = 1) => TL.cue(scene, word, n);

/** Frame ABSOLUE (composition) d'un mot : pour la mascotte globale, qui traverse les scènes. */
export const abs = (scene: SceneId, word: string, n = 1) => TL.starts[SCENE_IDS.indexOf(scene)] + TL.cue(scene, word, n);
