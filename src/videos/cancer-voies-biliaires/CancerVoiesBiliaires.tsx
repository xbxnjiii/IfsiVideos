// « Le cancer des voies biliaires » (n° 60, format pathologie, voix gratuite d'abord, sans barre de progression).
// Accroche sans texte, réaliste : la nuit, ton père se gratte ; le matin, urines foncées et yeux jaunes ; loupe sur la
// voie biliaire. Puis les voies biliaires (schéma fourni par le propriétaire, sans annotations), le cancer, les 2 types,
// les signes, les risques, les examens, les traitements, chute « on consulte vite ».
// Storyboard : docs/lpi/storyboard-cancer-voies-biliaires.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Risques, Signes, Traitement, Types, Voies} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerVoiesBiliairesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, voies: Voies, cancer: Cancer, types: Types, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	voies: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	types: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	risques: {p: whip('up'), sfx: 'whoosh'},
	examens: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerVoiesBiliaires: React.FC<CancerVoiesBiliairesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-voies-biliaires/voix.wav' : null} sfx={sfx} />
);
