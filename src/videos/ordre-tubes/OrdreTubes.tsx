// « L'ordre des tubes » (n° 66, série « les tubes », directives Instagram) : l'ordre avec l'additif et l'analyse de
// chaque tube, les cas d'aiguille, les retournements. Storyboard : docs/lpi/storyboard-ordre-tubes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aiguille, Fin, Hook, Ordre, Retourner} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type OrdreTubesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, ordre: Ordre, aiguille: Aiguille, retourner: Retourner, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	ordre: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	aiguille: {p: whip('left'), sfx: 'whoosh'},
	retourner: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const OrdreTubes: React.FC<OrdreTubesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/ordre-tubes/voix.wav' : null} sfx={sfx} />
);
