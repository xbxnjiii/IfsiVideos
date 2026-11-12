// « Brûlure du 1er degré » (série des degrés de brûlure, n° 46, voix gratuite d'abord, sans barre de progression).
// Accroche sans texte, réaliste : une journée à la plage, le dos rougit, le soir le moindre contact fait mal. Puis la
// couche touchée (épiderme), l'aspect (rouge, sèche, douloureuse, sans cloque : un coup de soleil), l'évolution (3 à 5
// jours, sans trace), chute. Storyboard : docs/lpi/storyboard-brulures-degres.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aspect, Couche, Evolution, Fin, Hook, Geste} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type Brulure1Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, couche: Couche, aspect: Aspect, evolution: Evolution, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	couche: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	aspect: {p: whip('left'), sfx: 'whoosh'},
	evolution: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	geste: {p: zoomInto({x: 540, y: 1000}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Brulure1: React.FC<Brulure1Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/brulure-1/voix.wav' : null} sfx={sfx} />
);
