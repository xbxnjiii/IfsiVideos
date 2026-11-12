// « Brûlure du 3e degré » (série des degrés de brûlure, n° 48, voix gratuite d'abord, sans barre de progression).
// Accroche sans texte, réaliste : un barbecue rallumé à l'alcool, retour de flamme sur le bras. Puis la couche (toute la
// peau détruite, jusqu'à la graisse, les muscles, les os), l'aspect (cartonnée, sèche, blanche / brune / noire, sans
// cloque), le piège (indolore : nerfs détruits, douleur autour), la gravité (urgence, le 15, greffe), chute (jamais
// d'alcool). Storyboard : docs/lpi/storyboard-brulures-degres.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aspect, Couche, Douleur, Fin, Gravite, Hook, Geste} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type Brulure3Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, couche: Couche, aspect: Aspect, douleur: Douleur, gravite: Gravite, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	couche: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	aspect: {p: whip('left'), sfx: 'whoosh'},
	douleur: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	gravite: {p: runWipe(), sfx: 'run'},
	geste: {p: wave({x: 540, y: 900}), sfx: 'whoosh'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Brulure3: React.FC<Brulure3Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/brulure-3/voix.wav' : null} sfx={sfx} />
);
