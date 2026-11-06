// « La BPCO » v2 (format pathologie, remplace la v1) : accroche « Juste une toux de fumeur ? » (il tousse, crache,
// s'arrête à chaque étage ; « c'est juste la cigarette » : FAUX ; c'est la BPCO ; 2 malades sur 3 l'ignorent),
// définition (sigle), la radio couche par couche (côtes → poumons → bronches → alvéoles → une alvéole ; chez lui :
// bronches enflammées, mucus, emphysème, air piégé), cause (tabac), signes, spirométrie, traitement, oxygène à petit
// débit (SpO₂ 88 – 95 %) et exacerbation, récap rapide. Vrais bruitages (toux, essoufflement, briquet, inhalateur).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cause, Definition, Diagnostic, Hook, Outro, Oxygene, Radio, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type BpcoProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, radio: Radio, cause: Cause, signes: Signes, diag: Diagnostic, traitement: Traitement, oxygene: Oxygene, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 1000}), sfx: 'whoosh'}, // on plonge dans ses poumons
	radio: {p: wave({x: 540, y: 760}), sfx: 'whoosh'}, // la radio
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
