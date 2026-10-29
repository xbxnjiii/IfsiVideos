// « C'est quoi un AVC » : accroche-choc (toutes les 4 minutes en France, 2 millions de neurones par minute),
// définition, AVC ischémique / hémorragique, reconnaître avec VITE, le 15 et l'heure du début, imagerie +
// thrombolyse / thrombectomie, facteurs de risque, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Definition, Hemorragique, Hook, Ischemique, Outro, Risques, Traitement, Urgence, Vite} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type AvcProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook,
	def: Definition,
	isch: Ischemique,
	hemo: Hemorragique,
	vite: Vite,
	urgence: Urgence,
	traitement: Traitement,
	risques: Risques,
	outro: Outro,
	end: EndCard,
};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 549, y: 1082}), sfx: 'whoosh'}, // on plonge dans le cerveau de l'accroche
	isch: {p: whip('left'), sfx: 'whoosh'},
	hemo: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	vite: {p: runWipe(), sfx: 'run'}, // « VITE » : elle traverse en courant
	urgence: {p: whip('up'), sfx: 'whoosh'},
	traitement: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	risques: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Avc: React.FC<AvcProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/avc/voix.wav' : null} sfx={sfx} />
);
