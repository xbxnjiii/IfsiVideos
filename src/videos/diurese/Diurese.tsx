// « La diurèse » : une vidéo par constante. Accroche-question, définition (quantité d'urine fabriquée par les
// reins, vessie), mesure sur 24 heures (bocal gradué, ml), norme adulte (normodiurèse), polyurie, oligurie,
// anurie (urgence), récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Anurie, Definition, Hook, Mesure, Norme, Oligo, Outro, Poly} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type DiureseProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, mesure: Mesure, norme: Norme, poly: Poly, oligo: Oligo, anurie: Anurie, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 900}), sfx: 'whoosh'}, // on plonge dans le bocal de l'accroche
	mesure: {p: whip('left'), sfx: 'whoosh'},
	norme: {p: runWipe(), sfx: 'run'},
	poly: {p: whip('up'), sfx: 'whoosh'},
	oligo: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	anurie: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Diurese: React.FC<DiureseProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/diurese/voix.wav' : null} sfx={sfx} />
);
