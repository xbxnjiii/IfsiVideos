// « Le tube violet » (n° 62, 1re vidéo de la série sur les tubes, sans barre de progression) : à quoi il sert et ce qu'on
// y mesure (EDTA, hématologie, NFS, groupe sanguin, hémoglobine glyquée). Storyboard : docs/lpi/storyboard-tube-violet.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Autres, Blancs, Edta, Fin, Gestes, Hook, Nfs, Piege, Plaquettes, Rouges} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeVioletProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, edta: Edta, nfs: Nfs, rouges: Rouges, blancs: Blancs, plaquettes: Plaquettes, autres: Autres, piege: Piege, gestes: Gestes, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	edta: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	nfs: {p: whip('left'), sfx: 'whoosh'},
	rouges: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	blancs: {p: runWipe(), sfx: 'run'},
	plaquettes: {p: whip('up'), sfx: 'whoosh'},
	autres: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	piege: {p: whip('left'), sfx: 'whoosh'},
	gestes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeViolet: React.FC<TubeVioletProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-violet/voix.wav' : null} sfx={sfx} />
);
