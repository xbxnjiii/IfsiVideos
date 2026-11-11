// « Comment bien mettre un pansement ? » — format court (≈ 44 s, voix gratuite edge-tts, sans barre de progression).
// Accroche animée sans texte au début : la coupure au doigt, le pansement collé vite fait… raté (le carré blanc à côté,
// la colle sur la plaie). Puis : préparer (mains, nettoyer, désinfecter, sécher), poser (assez grand, une languette, le
// carré blanc sur la plaie, l'autre languette en lissant, appuyer sur les bords), le changer chaque jour, chute.
// Storyboard : docs/lpi/storyboard-pansement.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Garder, Hook, Pose, Prep} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PansementProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, prep: Prep, pose: Pose, garder: Garder, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	prep: {p: zoomInto({x: 540, y: 960}), sfx: 'whoosh'}, // on plonge sur le doigt
	pose: {p: whip('left'), sfx: 'whoosh'},
	garder: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Pansement: React.FC<PansementProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/pansement/voix.wav' : null} sfx={sfx} />
);
