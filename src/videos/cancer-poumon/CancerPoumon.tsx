// « Le cancer du poumon » (n° 51, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : le soir sur le balcon, ton père fume, tousse dans son mouchoir et voit un peu de sang ; « ce n'est
// rien… » ; plongée vers ses poumons. Puis le trajet de l'air (schéma fourni par le propriétaire, sans annotations), le
// cancer, le tabac, les signes, les examens, les risques, les traitements, chute « arrêter de fumer, à tout âge ».
// Storyboard : docs/lpi/storyboard-cancer-poumon.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Poumons, Risques, Signes, Tabac, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerPoumonProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, poumons: Poumons, cancer: Cancer, tabac: Tabac, signes: Signes, examens: Examens, risques: Risques, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	poumons: {p: zoomInto({x: 540, y: 1100, color: LPI.navy}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	tabac: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerPoumon: React.FC<CancerPoumonProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-poumon/voix.wav' : null} sfx={sfx} />
);
