// « Le tube bleu : TP et INR » (n° 75, série « les tubes », directives Instagram). Storyboard : docs/lpi/storyboard-tube-bleu.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Inr, Remplir, Tp} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeBleuTpInrProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, remplir: Remplir, tp: Tp, inr: Inr, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	remplir: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	tp: {p: whip('left'), sfx: 'whoosh'},
	inr: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeBleuTpInr: React.FC<TubeBleuTpInrProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-bleu-tp-inr/voix.wav' : null} sfx={sfx} />
);
