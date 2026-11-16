// « L'ordre des tubes » (n° 61, format inventaire, look 2026, sans barre de progression) : accroche « le labo appelle :
// potassium à 7 » (une fausse hyperkaliémie, due à l'ordre des tubes), pourquoi l'ordre, un tube par scène avec la frise
// de l'ordre en bas, les gestes, récap. Storyboard : docs/lpi/storyboard-tubes-prelevement.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Citrate, Edta, Fin, Fluor, Gestes, Hemoc, Hepar, Hook, Pourquoi, Sec} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubesPrelevementProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, hemoc: Hemoc, citrate: Citrate, sec: Sec, hepar: Hepar, edta: Edta, fluor: Fluor, gestes: Gestes, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hemoc: {p: whip('left'), sfx: 'whoosh'},
	citrate: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	sec: {p: runWipe(), sfx: 'run'},
	hepar: {p: whip('up'), sfx: 'whoosh'},
	edta: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	fluor: {p: whip('left'), sfx: 'whoosh'},
	gestes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubesPrelevement: React.FC<TubesPrelevementProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tubes-prelevement/voix.wav' : null} sfx={sfx} />
);
