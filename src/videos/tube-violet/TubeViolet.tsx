// « Le tube violet » (n° 62, 1re vidéo de la série sur les tubes, sans barre de progression) : à quoi il sert et ce qu'on
// y mesure : la NFS ligne par ligne, avec les normes adultes (v2 sur le contenu fourni par le propriétaire). Storyboard : docs/lpi/storyboard-tube-violet.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Formule, Hematies, Hematocrite, Hemoglobine, Hook, Leucocytes, Lymphocytes, Nfs, Plaquettes, Vgm} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeVioletProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, nfs: Nfs, hematies: Hematies, hemoglobine: Hemoglobine, hematocrite: Hematocrite, vgm: Vgm, plaquettes: Plaquettes, leucocytes: Leucocytes, formule: Formule, lymphocytes: Lymphocytes, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	nfs: {p: zoomInto({x: 540, y: 860}), sfx: 'whoosh'},
	hematies: {p: whip('left'), sfx: 'whoosh'},
	hemoglobine: {p: zoomInto({x: 540, y: 800}), sfx: 'whoosh'},
	hematocrite: {p: whip('up'), sfx: 'whoosh'},
	vgm: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	plaquettes: {p: runWipe(), sfx: 'run'},
	leucocytes: {p: whip('left'), sfx: 'whoosh'},
	formule: {p: zoomInto({x: 540, y: 760}), sfx: 'whoosh'},
	lymphocytes: {p: whip('up'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeViolet: React.FC<TubeVioletProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-violet/voix.wav' : null} sfx={sfx} />
);
