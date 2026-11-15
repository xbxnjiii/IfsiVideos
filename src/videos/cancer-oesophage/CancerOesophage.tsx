// « Le cancer de l'œsophage » (n° 58, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche
// sans texte, réaliste : au repas, ton grand-père avale… et ça coince ; le verre d'eau, l'assiette en petits morceaux,
// la soupe ; plongée vers sa poitrine, loupe sur l'intérieur de l'œsophage. Puis l'œsophage et sa paroi (schéma fourni
// par le propriétaire, sans annotations), le cancer, les 2 types, les signes, les risques, la fibroscopie, les
// traitements, chute « du mal à avaler qui dure, on consulte vite ». Storyboard : docs/lpi/storyboard-cancer-oesophage.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Oesophage, Paroi, Risques, Signes, Traitement, Types} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerOesophageProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, oesophage: Oesophage, paroi: Paroi, cancer: Cancer, types: Types, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	oesophage: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	paroi: {p: whip('left'), sfx: 'whoosh'},
	cancer: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	types: {p: runWipe(), sfx: 'run'},
	signes: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	examens: {p: whip('left'), sfx: 'whoosh'},
	traitement: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerOesophage: React.FC<CancerOesophageProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-oesophage/voix.wav' : null} sfx={sfx} />
);
