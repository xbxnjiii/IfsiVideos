// « Le cancer du rein » (n° 56, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans texte,
// réaliste : ton père a mal au dos, à l'échographie une boule apparaît sur le rein (découverte par hasard). Puis le rein
// (schéma fourni par le propriétaire, sans annotations), le cancer, les signes, les risques, les examens, les
// traitements, chute « du sang dans les urines : on consulte ». Storyboard : docs/lpi/storyboard-cancer-rein.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Rein, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerReinProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, rein: Rein, cancer: Cancer, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	rein: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	risques: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	traitement: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	fin: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerRein: React.FC<CancerReinProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-rein/voix.wav' : null} sfx={sfx} />
);
