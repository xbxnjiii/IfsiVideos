// Tube-Jaune-Marqueurs : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Liste1, Liste2, Principe, Suivi} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneMarqueursProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, principe: Principe, liste1: Liste1, liste2: Liste2, suivi: Suivi, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	principe: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	liste1: {p: whip('left'), sfx: 'whoosh'},
	liste2: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	suivi: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneMarqueurs: React.FC<TubeJauneMarqueursProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-marqueurs/voix.wav' : null} sfx={sfx} />
);
