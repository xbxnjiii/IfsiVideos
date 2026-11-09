// « Comment mettre un suppositoire ? » — 1er format COURT info + humour (≈ 40 s, sans barre de progression) :
// accroche « le match » pointe / plat → l'idée reçue (1991) → on suit la notice (la pointe, comme une fusée) →
// le bon geste en 5 cartes → « décollage réussi ! ». Storyboard : docs/lpi/storyboard-suppositoire.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Geste, Hook, Mythe, Verite} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type SuppositoireProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, mythe: Mythe, verite: Verite, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	mythe: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	verite: {p: whip('left'), sfx: 'whoosh'},
	geste: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Suppositoire: React.FC<SuppositoireProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/suppositoire/voix.wav' : null} sfx={sfx} />
);
