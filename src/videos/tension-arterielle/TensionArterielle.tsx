// « La tension artérielle » : une vidéo par constante. Accroche-question, définition (pression du sang sur la
// paroi des artères, mmHg), mesure au tensiomètre, deux chiffres (systolique / diastolique), norme adulte,
// hypertension (HTA), hypotension, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Chiffres, Definition, Hook, Hyper, Hypo, Mesure, Norme, Outro} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TensionArterielleProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, chiffres: Chiffres, norme: Norme, hyper: Hyper, hypo: Hypo, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 800}), sfx: 'whoosh'}, // on plonge dans le manomètre de l'accroche
	mesure: {p: whip('left'), sfx: 'whoosh'},
	chiffres: {p: runWipe(), sfx: 'run'},
	norme: {p: whip('up'), sfx: 'whoosh'},
	hyper: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	hypo: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TensionArterielle: React.FC<TensionArterielleProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/tension-arterielle/voix.wav' : null} sfx={sfx} />
);
