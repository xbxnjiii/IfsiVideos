// « Plaie superficielle ou profonde ? » — série courte « Les plaies » (≈ 35 s, sans barre de progression), accroche
// « le genou râpé ». Storyboard : docs/lpi/storyboard-plaies-courtes.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Profonde, Superficielle} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PlaieProfondeurProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, superficielle: Superficielle, profonde: Profonde, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	superficielle: {p: zoomInto({x: 545, y: 780, color: LPI.pink}), sfx: 'whoosh'}, // on plonge dans l'éraflure,
	profonde: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PlaieProfondeur: React.FC<PlaieProfondeurProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/plaie-profondeur/voix.wav' : null} sfx={sfx} />
);
