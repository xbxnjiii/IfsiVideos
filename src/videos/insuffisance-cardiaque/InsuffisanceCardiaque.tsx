// Insuffisance-Cardiaque (format pathologie) : accroche « 3 indices » (+3 kg en une semaine, il dort assis, chevilles qui gonflent) → son cœur s'épuise → ses poumons peuvent se noyer ; définition, cœur gauche, cœur droit, pesée, traitement, OAP, récap.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Def, Droite, Gauche, Hook, Outro, Role, Traitement, Urgence} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type InsuffisanceCardiaqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Def, gauche: Gauche, droite: Droite, role: Role, traitement: Traitement, urgence: Urgence, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	gauche: {p: whip('left'), sfx: 'whoosh'},
	droite: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	role: {p: runWipe(), sfx: 'run'},
	traitement: {p: whip('up'), sfx: 'whoosh'},
	urgence: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const InsuffisanceCardiaque: React.FC<InsuffisanceCardiaqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/insuffisance-cardiaque/voix.wav' : null} sfx={sfx} />
);
