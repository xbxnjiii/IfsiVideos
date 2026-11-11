// « Plaie aiguë ou chronique ? » — série courte « Les plaies » (≈ 38 s, sans barre de progression), accroche « papi et
// son petit-fils ». Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aigue, Chronique, Exemples, Fin, Hook} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaieChroniqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, aigue: Aigue, chronique: Chronique, exemples: Exemples, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	aigue: {p: zoomInto({x: 904, y: 1288, color: LPI.sky}), sfx: 'whoosh'}, // on plonge dans la jambe du petit
	chronique: {p: whip('left'), sfx: 'whoosh'},
	exemples: {p: wave({x: 540, y: 1010}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PlaieChronique: React.FC<PlaieChroniqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/plaie-chronique/voix.wav' : null} sfx={sfx} />
);
