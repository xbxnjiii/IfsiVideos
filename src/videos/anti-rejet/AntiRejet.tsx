// « Les anti-rejet » (n° 72, série « le tube violet », dernière vidéo, directives Instagram). Storyboard : docs/lpi/storyboard-tube-violet-serie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Lesquels, Marge, Moment, Pourquoi} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type AntiRejetProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, lesquels: Lesquels, marge: Marge, moment: Moment, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	lesquels: {p: whip('left'), sfx: 'whoosh'},
	marge: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	moment: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const AntiRejet: React.FC<AntiRejetProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/anti-rejet/voix.wav' : null} sfx={sfx} />
);
