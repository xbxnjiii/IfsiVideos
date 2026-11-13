// « Le cancer de la prostate » (n° 49, format pathologie, voix gratuite d'abord, sans barre de progression).
// Accroche sans texte, réaliste : la chambre la nuit, il se lève à 1 h, 3 h, 5 h pour aller aux toilettes ; « c'est
// l'âge… » ; plongée vers sa prostate. Puis prostate, adénome, cancer, signes tardifs, examens, risques, traitements,
// chute « dès 50 ans, on en parle à son médecin ». Storyboard : docs/lpi/storyboard-cancer-prostate.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Adenome, Cancer, Examens, Fin, Hook, Prostate, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerProstateProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, prostate: Prostate, adenome: Adenome, cancer: Cancer, signes: Signes, examens: Examens, risques: Risques, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	prostate: {p: zoomInto({x: 540, y: 900, color: LPI.navy}), sfx: 'whoosh'},
	adenome: {p: whip('left'), sfx: 'whoosh'},
	cancer: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerProstate: React.FC<CancerProstateProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-prostate/voix.wav' : null} sfx={sfx} />
);
