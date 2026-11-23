// Tube-Jaune-Coeur : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bnp, Fin, Hook, Seuil, Tropo} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneCoeurProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, tropo: Tropo, seuil: Seuil, bnp: Bnp, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	tropo: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	seuil: {p: whip('left'), sfx: 'whoosh'},
	bnp: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneCoeur: React.FC<TubeJauneCoeurProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-coeur/voix.wav' : null} sfx={sfx} />
);
