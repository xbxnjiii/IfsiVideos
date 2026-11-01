import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'regle', 'mains', 'epi', 'toux', 'aes', 'excreta', 'env', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS);
