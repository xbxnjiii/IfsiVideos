// Tube-Jaune-Enzymes : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cpk, Fin, Hook, Ldh, Lipase} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneEnzymesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, cpk: Cpk, ldh: Ldh, lipase: Lipase, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	cpk: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	ldh: {p: whip('left'), sfx: 'whoosh'},
	lipase: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneEnzymes: React.FC<TubeJauneEnzymesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-enzymes/voix.wav' : null} sfx={sfx} />
);
