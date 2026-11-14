// « Le cancer du pancréas » (n° 54, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : ton père devant le miroir, le blanc de ses yeux jaunit, il a maigri ; plongée vers son pancréas.
// Puis le pancréas (schéma fourni par le propriétaire, sans annotations), le cancer, pourquoi le jaune, les signes, les
// risques, les examens, les traitements, chute « des yeux jaunes, maigrir sans raison : on consulte vite ».
// Storyboard : docs/lpi/storyboard-cancer-pancreas.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Jaunisse, Pancreas, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerPancreasProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pancreas: Pancreas, cancer: Cancer, jaunisse: Jaunisse, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pancreas: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	jaunisse: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	risques: {p: whip('up'), sfx: 'whoosh'},
	examens: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerPancreas: React.FC<CancerPancreasProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-pancreas/voix.wav' : null} sfx={sfx} />
);
