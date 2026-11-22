// « Le tube gris : la glycémie » (n° 73, série « les tubes », directives Instagram). Storyboard : docs/lpi/storyboard-tube-gris.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Diabete, Fin, Hook, Jeun, Normes, Pourquoi} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeGrisGlycemieProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, jeun: Jeun, normes: Normes, diabete: Diabete, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	jeun: {p: whip('left'), sfx: 'whoosh'},
	normes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	diabete: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeGrisGlycemie: React.FC<TubeGrisGlycemieProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-gris-glycemie/voix.wav' : null} sfx={sfx} />
);
