// « AVC — l'histoire de Michel » (format histoire, mystérieux) : on ne présente pas une notion, on raconte un
// accident. Accroche (la moitié de son sourire a disparu), fausse piste (« juste la fatigue, ça va passer »),
// révélation (artère bouchée, AVC, neurones qui s'éteignent), on regarde le corps (VITE), pourquoi d'un seul côté,
// fin. Fond nuit et cadre de scanner (src/brand/night.tsx), pas de barre de progression.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Histoire, Hook, Pourquoi, Revele, Signes, Urgence, Vite} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type AvcHistoireProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, histoire: Histoire, revele: Revele, signes: Signes, vite: Vite, urgence: Urgence, pourquoi: Pourquoi, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; plongées en bleu nuit (fond de l'histoire). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	histoire: {p: zoomInto({x: 540, y: 1000, color: LPI.navy}), sfx: 'whoosh'},
	revele: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: zoomInto({x: 540, y: 1000, color: LPI.navy}), sfx: 'whoosh'}, // on plonge dans le cerveau
	vite: {p: whip('up'), sfx: 'whoosh'},
	urgence: {p: zoomInto({x: 540, y: 290, color: LPI.navy}), sfx: 'whoosh'}, // dans la lettre E
	pourquoi: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: zoomInto({x: 540, y: 1000, color: LPI.navy}), sfx: 'whoosh'},
	end: {p: wave({x: 540, y: 1000}), sfx: 'whoosh'},
};

export const AvcHistoire: React.FC<AvcHistoireProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/avc-histoire/voix.wav' : null} sfx={sfx} progress={false} />
);
