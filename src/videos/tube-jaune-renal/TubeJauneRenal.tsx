// « Le tube jaune : le bilan rénal » (n° 64, série « les tubes », sans barre de progression) : urée, créatinine, DFG et ses
// 5 stades, avec les normes fournies par le propriétaire. Storyboard : docs/lpi/storyboard-tube-jaune-renal.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Creat, Dfg, Fin, Hook, Reins, Stades, Uree} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneRenalProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, reins: Reins, uree: Uree, creat: Creat, dfg: Dfg, stades: Stades, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	reins: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	uree: {p: whip('left'), sfx: 'whoosh'},
	creat: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	dfg: {p: runWipe(), sfx: 'run'},
	stades: {p: whip('up'), sfx: 'whoosh'},
	fin: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneRenal: React.FC<TubeJauneRenalProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-renal/voix.wav' : null} sfx={sfx} />
);
