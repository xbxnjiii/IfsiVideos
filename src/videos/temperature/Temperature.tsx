// « La température corporelle » : une vidéo par constante. Accroche-question, définition (°C), voies de mesure,
// norme adulte (apyrétique), fébricule, hyperthermie (signes), hypothermie (signes), récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Definition, Febricule, Hook, Hyper, Hypo, Norme, Outro, Voies} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TemperatureProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, voies: Voies, norme: Norme, febricule: Febricule, hyper: Hyper, hypo: Hypo, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 333, y: 988}), sfx: 'whoosh'}, // on plonge dans le réservoir du thermomètre
	voies: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: runWipe(), sfx: 'run'},
	febricule: {p: whip('up'), sfx: 'whoosh'},
	hyper: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	hypo: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Temperature: React.FC<TemperatureProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/temperature/voix.wav' : null} sfx={sfx} />
);
