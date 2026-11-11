// « Plaie franche ou contuse ? » — série courte « Les plaies » (≈ 34 s, sans barre de progression), accroche
// « couteau ou portière ? ». Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Contuse, Fin, Franche, Hook} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaieContuseProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, franche: Franche, contuse: Contuse, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	franche: {p: zoomInto({x: 540, y: 680, color: LPI.sky}), sfx: 'whoosh'}, // on plonge dans la carte du couteau
	contuse: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PlaieContuse: React.FC<PlaieContuseProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/plaie-contuse/voix.wav' : null} sfx={sfx} />
);
