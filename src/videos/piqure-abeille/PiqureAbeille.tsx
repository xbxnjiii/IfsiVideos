// « Piqûre d'abeille : on retire le dard comment ? » — format court (≈ 49 s, voix gratuite d'abord, Laura une fois validée,
// sans barre de progression). Accroche sans texte au début : un pique-nique, une abeille se pose sur la main et pique ; la
// caméra plonge : le dard est resté planté. Idée reçue (le pincer : on presse la poche de venin), gratter avec une carte,
// eau + savon, froid dans un linge, ce qui est normal, quand appeler le 15, chute (la guêpe ne laisse pas son dard).
// Storyboard : docs/lpi/storyboard-piqure-abeille.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Idees, Methode, Normal, Soins, Urgence} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PiqureAbeilleProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, idees: Idees, methode: Methode, soins: Soins, normal: Normal, urgence: Urgence, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	idees: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	methode: {p: whip('left'), sfx: 'whoosh'},
	soins: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	normal: {p: runWipe(), sfx: 'run'},
	urgence: {p: whip('up'), sfx: 'whoosh'},
	fin: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PiqureAbeille: React.FC<PiqureAbeilleProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/piqure-abeille/voix.wav' : null} sfx={sfx} />
);
