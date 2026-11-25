// La-Cellule-Schema : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Energie, Enveloppe, Fabrication, Fin, Hook, Noyau} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type LaCelluleSchemaProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, enveloppe: Enveloppe, noyau: Noyau, fabrication: Fabrication, energie: Energie, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	enveloppe: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	noyau: {p: whip('left'), sfx: 'whoosh'},
	fabrication: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	energie: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const LaCelluleSchema: React.FC<LaCelluleSchemaProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/la-cellule-schema/voix.wav' : null} sfx={sfx} />
);
