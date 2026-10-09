import {makeTimeline} from '../../brand/timeline';
import voice from './voice.json';

// Voix ElevenLabs alignée mot à mot (scripts/voice/align_voice.py). Transitions de 14 frames,
// démarrées 0,25 s avant que la voix attaque la partie (comme la vidéo Constantes).
export const TL = makeTimeline(voice, {tail: 1.0, endCard: 2.6, transition: 14, preRoll: 0.25});

export const SCENE_IDS = [
	'intro',
	'e1',
	'b1',
	'b2',
	'b3',
	'b4',
	'b5',
	'e2',
	'b6',
	'b7',
	'b8',
	'b9',
	'e3',
	'b10',
	'b11',
	'b12',
	'b13',
	'b14',
	'outro',
	'end',
] as const;
export type SceneId = (typeof SCENE_IDS)[number];

/** Frame locale d'un mot dans une scène. */
export const at = (scene: SceneId, word: string, n = 1) => TL.cue(scene, word, n);
/** Frame absolue (composition) d'un mot : pour la mascotte et la progression globales. */
export const abs = (scene: SceneId, word: string, n = 1) => start(scene) + TL.cue(scene, word, n);
export const start = (scene: SceneId) => TL.starts[SCENE_IDS.indexOf(scene)];
