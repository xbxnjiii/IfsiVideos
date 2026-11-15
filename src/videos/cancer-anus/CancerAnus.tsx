// « Le cancer de l'anus » (n° 59, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : le papier toilette taché de sang, ta mère gênée (« des hémorroïdes… », « c'est gênant… »), loupe sur
// le canal anal. Puis l'anus (schéma fourni par le propriétaire, sans annotations), le cancer, le papillomavirus, les
// signes, les risques, les examens, les traitements, chute « du sang qui dure, on consulte… et le vaccin ».
// Storyboard : docs/lpi/storyboard-cancer-anus.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Anus, Cancer, Examens, Fin, Hook, Papillomavirus, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerAnusProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, anus: Anus, cancer: Cancer, hpv: Papillomavirus, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	anus: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	hpv: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	risques: {p: whip('up'), sfx: 'whoosh'},
	examens: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerAnus: React.FC<CancerAnusProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-anus/voix.wav' : null} sfx={sfx} />
);
