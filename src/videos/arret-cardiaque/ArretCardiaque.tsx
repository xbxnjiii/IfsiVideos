// « L'arrêt cardiaque chez l'adulte » : accroche-choc (le tracé devient plat, 3 minutes pour le cerveau, −10 %
// de survie par minute sans massage), définition (fibrillation ventriculaire), reconnaître, alerter (15 / 112,
// DAE), masser (100 – 120/min, 5 – 6 cm), RCP 30/2, défibrillateur, récap rapide.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Alerter, Dae, Definition, Hook, Masser, Outro, Rcp, Reconnaitre} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type ArretCardiaqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Definition, reconnaitre: Reconnaitre, alerter: Alerter, masser: Masser, rcp: Rcp, dae: Dae, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 960}), sfx: 'whoosh'}, // on plonge dans le cœur qui tremble
	reconnaitre: {p: whip('left'), sfx: 'whoosh'},
	alerter: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	masser: {p: runWipe(), sfx: 'run'}, // « sans attendre » : elle traverse en courant
	rcp: {p: whip('up'), sfx: 'whoosh'},
	dae: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const ArretCardiaque: React.FC<ArretCardiaqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/arret-cardiaque/voix.wav' : null} sfx={sfx} />
);
