// « Une tique : comment bien la retirer ? » — format court (≈ 47 s, voix gratuite d'abord, Laura une fois validée, sans
// barre de progression). Accroche sans texte au début : sur la peau, un petit point noir que le doigt frotte… il ne part
// pas ; zoom : une tique. Puis l'idée reçue (éther, alcool, huile : elle recrache des microbes), le tire-tique (dessous,
// on tourne, elle sort avec sa tête), après (désinfecter, se laver les mains, noter la date), surveiller un mois (plaque
// rouge qui s'étend, fièvre → médecin, maladie de Lyme), chute (manches longues, pantalon, inspection).
// Storyboard : docs/lpi/storyboard-tique.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Apres, Fin, Hook, Idees, Methode, Surveiller} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TiqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, idees: Idees, methode: Methode, apres: Apres, surveiller: Surveiller, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	idees: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	methode: {p: whip('left'), sfx: 'whoosh'},
	apres: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	surveiller: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Tique: React.FC<TiqueProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tique/voix.wav' : null} sfx={sfx} />
);
