// « Brûlure du 2e degré » (série des degrés de brûlure, n° 47, voix gratuite d'abord, sans barre de progression).
// Accroche sans texte, réaliste : on égoutte les pâtes, l'eau bouillante éclabousse l'avant-bras, des cloques
// apparaissent. Puis le 2e degré superficiel (haut du derme ; rouge, suintant, très douloureux, phlyctènes ; ≈ 2
// semaines) et profond (derme profond ; pâle, cloques molles, peu douloureux ; > 3 semaines, séquelles, greffe), chute.
// Storyboard : docs/lpi/storyboard-brulures-degres.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Couche, Evolution, Fin, Hook, Profond, Superficiel} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type Brulure2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, couche: Couche, superficiel: Superficiel, profond: Profond, evolution: Evolution, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	couche: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	superficiel: {p: whip('left'), sfx: 'whoosh'},
	profond: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	evolution: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Brulure2: React.FC<Brulure2Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/brulure-2/voix.wav' : null} sfx={sfx} />
);
