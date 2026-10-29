// « La fréquence respiratoire » : une vidéo par constante. Accroche-question (la compter sans que le patient
// le sache), définition (cycle = inspiration + expiration), mesure discrète, norme adulte, tachypnée,
// bradypnée (morphine), amplitude / rythme / dyspnée, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Brady, Definition, Hook, Mesure, Norme, Obs, Outro, Tachy} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type FrequenceRespiratoireProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, norme: Norme, tachy: Tachy, brady: Brady, obs: Obs, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 820}), sfx: 'whoosh'}, // on plonge dans les poumons de l'accroche
	mesure: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: runWipe(), sfx: 'run'},
	tachy: {p: whip('up'), sfx: 'whoosh'},
	brady: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	obs: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const FrequenceRespiratoire: React.FC<FrequenceRespiratoireProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/frequence-respiratoire/voix.wav' : null} sfx={sfx} />
);
