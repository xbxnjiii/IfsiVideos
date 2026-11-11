// « La plaie par piqûre » — série courte « Les plaies » (≈ 37 s, sans barre de progression), accroche « le clou ».
// Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Dessous, Fin, Hook, Piqure} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaiePiqureProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, dessous: Dessous, piqure: Piqure, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	dessous: {p: zoomInto({x: 830, y: 640, color: LPI.pink}), sfx: 'whoosh'}, // on plonge là où le clou est entré
	piqure: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PlaiePiqure: React.FC<PlaiePiqureProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/plaie-piqure/voix.wav' : null} sfx={sfx} />
);
