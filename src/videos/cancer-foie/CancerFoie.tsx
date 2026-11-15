// « Le cancer du foie » (n° 57, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans texte,
// réaliste : chaque soir, ton père se sert un verre… puis un deuxième, depuis des années ; le foie ne se plaint pas, il
// s'abîme en silence (cirrhose) jusqu'au cancer. Puis le foie (schéma fourni par le propriétaire, sans annotations), le
// cancer sur un foie malade, les causes, les signes, les examens, les traitements, chute « ça protège son foie ».
// Storyboard : docs/lpi/storyboard-cancer-foie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Causes, Examens, Fin, Foie, Hook, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerFoieProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, foie: Foie, cancer: Cancer, causes: Causes, signes: Signes, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	foie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	causes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	traitement: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	fin: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerFoie: React.FC<CancerFoieProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-foie/voix.wav' : null} sfx={sfx} />
);
