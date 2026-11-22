// « La NFS 2/2 : globules blancs et plaquettes » (n° 68, série « le tube violet », directives Instagram).
// Storyboard : docs/lpi/storyboard-tube-violet-serie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Formule, Hook, Leucocytes, Lymphocytes, Plaquettes} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type NfsGlobulesBlancsProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, plaquettes: Plaquettes, leucocytes: Leucocytes, formule: Formule, lymphocytes: Lymphocytes, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	plaquettes: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	leucocytes: {p: whip('left'), sfx: 'whoosh'},
	formule: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	lymphocytes: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const NfsGlobulesBlancs: React.FC<NfsGlobulesBlancsProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/nfs-globules-blancs/voix.wav' : null} sfx={sfx} />
);
