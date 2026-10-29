import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'def', 'mesure', 'norme', 'tachy', 'brady', 'obs', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS);
