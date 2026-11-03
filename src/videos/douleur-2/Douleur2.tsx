// Série « La douleur : échelles d'évaluation », partie 2 / 2 : l'hétéro-évaluation (voix +0 %). Accroche « patient muet »
// (choisie par le propriétaire), carte de la série, principe, Algoplus, Doloplus, BPS, EVENDOL, récap + « série terminée ».
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {AbsoluteFill} from 'remotion';
import {MASCOT} from './mascot';
import {Algoplus, Bps, Doloplus, Evendol, Hetero, Hook, Outro, Serie} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Douleur2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, hetero: Hetero, algoplus: Algoplus, doloplus: Doloplus, bps: Bps, evendol: Evendol, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hetero: {p: whip('left'), sfx: 'whoosh'},
	algoplus: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	doloplus: {p: runWipe(), sfx: 'run'},
	bps: {p: whip('up'), sfx: 'whoosh'},
	evendol: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Douleur2: React.FC<Douleur2Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/douleur-2/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LA DOULEUR" part={2} count={2} from={start('hetero')} to={start('end')} />
	</AbsoluteFill>
);
