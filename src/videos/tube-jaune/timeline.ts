import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'jaune', 'ions', 'sodium', 'potassium', 'chlore', 'bicar', 'phosphore', 'magnesium', 'calcium', 'fin', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS, {minTotal: 0});
