// « La plaie par morsure » — série courte « Les plaies » (≈ 34 s, sans barre de progression), accroche « le chat ».
// Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Geste, Hook, Pourquoi, Risque} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaieMorsureProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, risque: Risque, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 711, y: 1159, color: LPI.pink}), sfx: 'whoosh'}, // on plonge dans les traces de crocs
	risque: {p: whip('left'), sfx: 'whoosh'},
	geste: {p: wave({x: 540, y: 1090}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PlaieMorsure: React.FC<PlaieMorsureProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/plaie-morsure/voix.wav' : null} sfx={sfx} />
);
