// « La fréquence cardiaque » : une vidéo par constante (≈ 1 min 10). Accroche-question, définition,
// prise du pouls radial, norme adulte, tachycardie, bradycardie, rythme et force du pouls, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Brady, Definition, Hook, Mesure, Norme, Outro, Rythme, Tachy} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type FrequenceCardiaqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, norme: Norme, tachy: Tachy, brady: Brady, rythme: Rythme, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 850}), sfx: 'whoosh'}, // on plonge dans le cœur de l'accroche
	mesure: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: runWipe(), sfx: 'run'},
	tachy: {p: whip('up'), sfx: 'whoosh'},
	brady: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	rythme: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1050, color: LPI.sky}), sfx: 'whoosh'},
};

export const FrequenceCardiaque: React.FC<FrequenceCardiaqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/frequence-cardiaque/voix.wav' : null} sfx={sfx} />
);
