import {episodeTimeline} from '../../brand/timeline';
import voice from './voice.json';

export const SCENE_IDS = ['intro', 'nfs', 'hematies', 'hemoglobine', 'hematocrite', 'vgm', 'plaquettes', 'leucocytes', 'formule', 'lymphocytes', 'hba1c', 'bnp', 'fin', 'end'] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const {TL, at, start, abs} = episodeTimeline(voice, SCENE_IDS, {minTotal: 0});
