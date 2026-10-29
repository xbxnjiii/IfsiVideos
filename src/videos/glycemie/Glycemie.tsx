// « La glycémie » : une vidéo par constante. Accroche-question, définition (taux de sucre dans le sang, glucose =
// carburant des cellules, g/l), glycémie capillaire, norme adulte à jeun (normoglycémie), hyperglycémie,
// hypoglycémie (urgence), récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Definition, Hook, Hyper, Hypo, Mesure, Norme, Outro} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type GlycemieProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, norme: Norme, hyper: Hyper, hypo: Hypo, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 476, y: 791}), sfx: 'whoosh'}, // on plonge dans l'écran du lecteur
	mesure: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: runWipe(), sfx: 'run'},
	hyper: {p: whip('up'), sfx: 'whoosh'},
	hypo: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Glycemie: React.FC<GlycemieProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/glycemie/voix.wav' : null} sfx={sfx} />
);
