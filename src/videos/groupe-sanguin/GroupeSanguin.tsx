// « Le groupe sanguin et les RAI » (n° 70, série « le tube violet », directives Instagram). Storyboard : docs/lpi/storyboard-tube-violet-serie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Abo, Deux, Fin, Hook, Rai, Rhesus} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type GroupeSanguinProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, abo: Abo, rhesus: Rhesus, deux: Deux, rai: Rai, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	abo: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	rhesus: {p: whip('left'), sfx: 'whoosh'},
	deux: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	rai: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const GroupeSanguin: React.FC<GroupeSanguinProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/groupe-sanguin/voix.wav' : null} sfx={sfx} />
);
