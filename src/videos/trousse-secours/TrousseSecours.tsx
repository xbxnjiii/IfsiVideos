// « Que doit contenir une trousse de secours à la maison ? » — format court (≈ 47 s, voix gratuite, sans barre de
// progression), accroche animée sans texte (le couteau glisse, la trousse est vide). Storyboard :
// docs/lpi/storyboard-trousse-secours.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Plus, Regles, Soigner, Tenir} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TrousseSecoursProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, soigner: Soigner, tenir: Tenir, plus: Plus, regles: Regles, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	soigner: {p: zoomInto({x: 540, y: 1050, color: LPI.sky}), sfx: 'whoosh'}, // on plonge dans la trousse vide
	tenir: {p: whip('left'), sfx: 'whoosh'},
	plus: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	regles: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TrousseSecours: React.FC<TrousseSecoursProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/trousse-secours/voix.wav' : null} sfx={sfx} />
);
