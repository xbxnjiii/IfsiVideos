// « C'est quoi la BPCO ? » (format pathologie, comme l'AVC, l'arrêt cardiaque et l'embolie) : accroche (« Et si
// chaque respiration devenait un véritable effort ? », compte à rebours 3 · 2 · 1, « C'est la BPCO »), définition
// (sigle), dans les bronches (obstruction, emphysème, air piégé), cause (tabac), signes, spirométrie, traitement,
// oxygène à petit débit (SpO₂ 88 – 92 %) et exacerbation, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cause, Dedans, Definition, Diagnostic, Hook, Outro, Oxygene, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type BpcoProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, dedans: Dedans, cause: Cause, signes: Signes, diag: Diagnostic, traitement: Traitement, oxygene: Oxygene, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 1000}), sfx: 'whoosh'}, // on plonge dans ses poumons
	dedans: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	cause: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	diag: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('up'), sfx: 'whoosh'},
	oxygene: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Bpco: React.FC<BpcoProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/bpco/voix.wav' : null} sfx={sfx} />
);
