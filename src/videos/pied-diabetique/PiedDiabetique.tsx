// « Le pied diabétique (et l'ulcère de jambe) » — série courte « Les plaies » (≈ 35 s, sans barre de progression),
// accroche « il ne sent rien ». Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Pied, Ulcere} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PiedDiabetiqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pied: Pied, ulcere: Ulcere, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pied: {p: zoomInto({x: 420, y: 1150, color: LPI.sky}), sfx: 'whoosh'}, // on plonge vers la plaie du pied
	ulcere: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PiedDiabetique: React.FC<PiedDiabetiqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/pied-diabetique/voix.wav' : null} sfx={sfx} />
);
