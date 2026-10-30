// « C'est quoi une embolie pulmonaire ? » (format pathologie, comme l'AVC et l'arrêt cardiaque) : accroche-choc
// (3e cause de mort cardiovasculaire, le caillot remonte de la jambe aux poumons), définition (embolie, phlébite),
// signes, conduite à tenir (alerter, demi-assis, surveiller), traitement (anticoagulants, thrombolyse), facteurs
// de risque et prévention, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Definition, Hook, Outro, Risques, Signes, Traitement, Urgence} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EmboliePulmonaireProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, signes: Signes, urgence: Urgence, traitement: Traitement, risques: Risques, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 1000}), sfx: 'whoosh'}, // on plonge dans le poumon bouché
	signes: {p: whip('left'), sfx: 'whoosh'},
	urgence: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	traitement: {p: runWipe(), sfx: 'run'},
	risques: {p: whip('up'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const EmboliePulmonaire: React.FC<EmboliePulmonaireProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/embolie-pulmonaire/voix.wav' : null} sfx={sfx} />
);
