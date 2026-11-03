// Série « La douleur : échelles d'évaluation », partie 1 / 2 : l'auto-évaluation (voix +0 %). Accroche « question au
// spectateur » (de 0 à 10, tu as mal à combien ?), carte de la série, principe, EN, EVA, EVS, visages, seuil, récap + « à suivre ».
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {AbsoluteFill} from 'remotion';
import {MASCOT} from './mascot';
import {Auto, En, Eva, Evs, Hook, Outro, Serie, Seuil, Visages} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Douleur1Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, auto: Auto, en: En, eva: Eva, evs: Evs, visages: Visages, seuil: Seuil, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	auto: {p: whip('left'), sfx: 'whoosh'},
	en: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	eva: {p: runWipe(), sfx: 'run'},
	evs: {p: whip('up'), sfx: 'whoosh'},
	visages: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	seuil: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Douleur1: React.FC<Douleur1Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/douleur-1/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LA DOULEUR" part={1} count={2} from={start('auto')} to={start('end')} />
	</AbsoluteFill>
);
