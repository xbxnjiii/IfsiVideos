// « Les différents types de plaies » (format notion, avec la dynamique des vidéos pathologie) : accroche (coupure de
// papier guérie en 3 jours / escarre qui dure des mois), définition dans une coupe de peau, deux familles (aiguë /
// chronique), plaies aiguës, brûlures, plaies chroniques, 4 stades d'escarre, signes de gravité, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aigues, Brulures, Chroniques, Definition, Escarre, Familles, Gravite, Hook, Outro} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaiesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, familles: Familles, aigues: Aigues, brulures: Brulures, chroniques: Chroniques, escarre: Escarre, gravite: Gravite, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 1000}), sfx: 'whoosh'}, // on plonge dans la peau
	familles: {p: whip('left'), sfx: 'whoosh'},
	aigues: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	brulures: {p: runWipe(), sfx: 'run'},
	chroniques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	escarre: {p: whip('up'), sfx: 'whoosh'},
	gravite: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Plaies: React.FC<PlaiesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/plaies/voix.wav' : null} sfx={sfx} />
);
