import {makeTimeline} from '../../brand/timeline';
import voice from './voice.json';

/** 72 bpm à 30 fps (battement toutes les 25 frames). */
export const BEAT = 25;

export const TL = makeTimeline(voice, {minTotal: 61 * 30, tail: 1.3, endCard: 3.4});

export const SCENE_IDS = ['intro', 'temp', 'fc', 'fr', 'pa', 'spo2', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];

/** Raccourci : frame locale d'un mot dans une scène. */
export const at = (scene: SceneId, word: string, n = 1) => TL.cue(scene, word, n);
