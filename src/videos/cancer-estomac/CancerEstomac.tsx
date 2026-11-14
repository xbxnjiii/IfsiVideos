// « Le cancer de l'estomac » (n° 55, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : au repas, ton grand-père repousse son assiette ; mal au ventre, il a maigri, sachet de pansement
// gastrique ; plongée vers son estomac. Puis l'estomac (schéma fourni par le propriétaire, sans annotations), le cancer,
// la bactérie Helicobacter pylori, les signes, les risques, la fibroscopie, les traitements, chute « on consulte… au lieu
// de prendre des pansements pendant des mois ». Storyboard : docs/lpi/storyboard-cancer-estomac.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bacterie, Cancer, Estomac, Examens, Fin, Hook, Risques, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerEstomacProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, estomac: Estomac, cancer: Cancer, bacterie: Bacterie, signes: Signes, risques: Risques, examens: Examens, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	estomac: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	bacterie: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	signes: {p: runWipe(), sfx: 'run'},
	risques: {p: whip('up'), sfx: 'whoosh'},
	examens: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerEstomac: React.FC<CancerEstomacProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-estomac/voix.wav' : null} sfx={sfx} />
);
