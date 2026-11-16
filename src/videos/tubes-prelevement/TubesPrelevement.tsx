// « L'ordre des tubes » (n° 61, format inventaire, look 2026, sans barre de progression) : accroche « le labo appelle :
// potassium à 7 » (une fausse hyperkaliémie, due à l'ordre des tubes), pourquoi l'ordre (la micro-goutte), puis l'ordre seul
// (sans dire à quoi sert chaque tube, demandé), la frise de 7 cases en bas, les gestes, récap. Storyboard : docs/lpi/storyboard-tubes-prelevement.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bleu, Fin, Gestes, Hemoc, Hook, Pourquoi, Purge, Secs, Suite} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubesPrelevementProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, hemoc: Hemoc, purge: Purge, bleu: Bleu, secs: Secs, suite: Suite, gestes: Gestes, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hemoc: {p: whip('left'), sfx: 'whoosh'},
	purge: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	bleu: {p: runWipe(), sfx: 'run'},
	secs: {p: whip('up'), sfx: 'whoosh'},
	suite: {p: zoomInto({x: 540, y: 900}), sfx: 'whoosh'},
	gestes: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubesPrelevement: React.FC<TubesPrelevementProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tubes-prelevement/voix.wav' : null} sfx={sfx} />
);
