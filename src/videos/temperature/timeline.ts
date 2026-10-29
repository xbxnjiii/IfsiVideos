import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'def', 'voies', 'norme', 'febricule', 'hyper', 'hypo', 'outro', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS);
