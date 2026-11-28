import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'regle', 'pression', 'massage', 'soulager', 'fin', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
// format court qui boucle : pas de carte logo, la dernière image (`end`, 0,8 s) rejoint la première
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS, {minTotal: 0, tail: 0.7, endCard: 0.8});
