// Tube-Jaune-Auto-Immunite : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aan, Adn, Anca, Ena, Fin, Hook} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneAutoImmuniteProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, aan: Aan, adn: Adn, ena: Ena, anca: Anca, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	aan: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	adn: {p: whip('left'), sfx: 'whoosh'},
	ena: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	anca: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneAutoImmunite: React.FC<TubeJauneAutoImmuniteProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-auto-immunite/voix.wav' : null} sfx={sfx} />
);
