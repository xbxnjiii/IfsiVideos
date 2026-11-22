// « L'HbA1c » (n° 69, série « le tube violet », directives Instagram). Storyboard : docs/lpi/storyboard-tube-violet-serie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Mois, Objectif, Pratique, Quoi} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type Hba1cVideoProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, quoi: Quoi, mois: Mois, objectif: Objectif, pratique: Pratique, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	quoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	mois: {p: whip('left'), sfx: 'whoosh'},
	objectif: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	pratique: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Hba1cVideo: React.FC<Hba1cVideoProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/hba1c/voix.wav' : null} sfx={sfx} />
);
