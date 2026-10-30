import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'histoire', 'revele', 'signes', 'vite', 'urgence', 'pourquoi', 'fin', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS);
