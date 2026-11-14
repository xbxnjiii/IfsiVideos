// « Le cancer colorectal » (n° 52, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : dans la cuisine, ton père range la lettre du dépistage dans un tiroir… deux ans plus tard, encore ;
// plongée vers son ventre. Puis le côlon (schéma fourni par le propriétaire, sans annotations), le polype qui devient un
// cancer, les signes, le dépistage, la coloscopie, les risques, les traitements, chute « ouvrir la lettre, faire le test ».
// Storyboard : docs/lpi/storyboard-cancer-colorectal.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Colon, Depistage, Examens, Fin, Hook, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerColorectalProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, colon: Colon, cancer: Cancer, signes: Signes, depistage: Depistage, examens: Examens, risques: Risques, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	colon: {p: zoomInto({x: 540, y: 1100, color: LPI.navy}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	depistage: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerColorectal: React.FC<CancerColorectalProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-colorectal/voix.wav' : null} sfx={sfx} />
);
