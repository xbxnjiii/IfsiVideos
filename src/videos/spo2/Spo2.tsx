// « La SpO₂ » : une vidéo par constante, avec la dynamique de l'arrêt cardiaque (caméra qui s'approche, tout dans
// le corps). Accroche « 98 %… mais 98 % de quoi ? », définition (saturation pulsée en oxygène : poumons → sang →
// hémoglobine), mesure au doigt (saturomètre, valeur fiable), norme adulte (et cible BPCO), désaturation /
// hypoxémie, signes (cyanose), récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bas, Definition, Hook, Mesure, Norme, Outro, Signes} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type Spo2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, norme: Norme, bas: Bas, signes: Signes, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 860}), sfx: 'whoosh'}, // on plonge dans l'écran du saturomètre
	mesure: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	bas: {p: runWipe(), sfx: 'run'},
	signes: {p: whip('up'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Spo2: React.FC<Spo2Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/spo2/voix.wav' : null} sfx={sfx} />
);
