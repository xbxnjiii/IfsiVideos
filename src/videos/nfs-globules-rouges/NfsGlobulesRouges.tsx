// « La NFS 1/2 : les globules rouges » (n° 67, série « le tube violet », directives Instagram) : hématies, hémoglobine,
// hématocrite, VGM, avec les normes adultes. Storyboard : docs/lpi/storyboard-tube-violet-serie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hematies, Hematocrite, Hemoglobine, Hook, Vgm} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type NfsGlobulesRougesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, hematies: Hematies, hemoglobine: Hemoglobine, hematocrite: Hematocrite, vgm: Vgm, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	hematies: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hemoglobine: {p: whip('left'), sfx: 'whoosh'},
	hematocrite: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	vgm: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const NfsGlobulesRouges: React.FC<NfsGlobulesRougesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/nfs-globules-rouges/voix.wav' : null} sfx={sfx} />
);
