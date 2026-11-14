// « Le cancer de la vessie » (n° 53, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : l'eau des toilettes rougit, ton grand-père se dit « ce n'est rien » ; plongée vers sa vessie. Puis
// l'appareil urinaire (schéma fourni par le propriétaire, sans annotations), le cancer, les signes, le tabac, les examens,
// les autres risques, les traitements, chute « du sang dans les urines, même une seule fois : on consulte ».
// Storyboard : docs/lpi/storyboard-cancer-vessie.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Examens, Fin, Hook, Risques, Signes, Tabac, Traitement, Vessie} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerVessieProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, vessie: Vessie, cancer: Cancer, signes: Signes, tabac: Tabac, examens: Examens, risques: Risques, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	vessie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	tabac: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerVessie: React.FC<CancerVessieProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-vessie/voix.wav' : null} sfx={sfx} />
);
