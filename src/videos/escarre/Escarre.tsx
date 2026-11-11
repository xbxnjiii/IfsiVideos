// « L'escarre » — série courte « Les plaies » (≈ 36 s, sans barre de progression), accroche « quelques heures ».
// Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Geste, Hook, Ou, Pression} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EscarreProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pression: Pression, ou: Ou, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pression: {p: zoomInto({x: 540, y: 1000, color: LPI.pink}), sfx: 'whoosh'}, // on plonge sous le bas du dos
	ou: {p: whip('left'), sfx: 'whoosh'},
	geste: {p: wave({x: 540, y: 900}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Escarre: React.FC<EscarreProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/escarre/voix.wav' : null} sfx={sfx} />
);
