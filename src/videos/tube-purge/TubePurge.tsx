// « Le tube de purge » (n° 65, série « les tubes », directives Instagram) : pourquoi le tube blanc avec une aiguille à
// ailettes, quand, et ce qu'on en fait. Storyboard : docs/lpi/storyboard-tube-purge.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Pourquoi, Purge, Quand} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubePurgeProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, purge: Purge, quand: Quand, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	purge: {p: whip('left'), sfx: 'whoosh'},
	quand: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubePurge: React.FC<TubePurgeProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-purge/voix.wav' : null} sfx={sfx} />
);
