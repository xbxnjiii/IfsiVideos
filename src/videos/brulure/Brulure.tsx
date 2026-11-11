// « Comment soigner une petite brûlure ? » — format court (≈ 47 s, voix gratuite d'abord, Laura une fois validée, sans barre
// de progression). Accroche sans texte au début : le doigt touche le bord de la casserole, il recule, la peau rougit.
// Puis les idées reçues (glaçon, beurre, dentifrice : surtout pas), l'eau du robinet 15 minutes (règle des 3 × 15), la
// cloque qu'on ne perce pas + compresse ou pansement gras + paracétamol, quand consulter, chute.
// Storyboard : docs/lpi/storyboard-brulure.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Consulter, Eau, Fin, Hook, Idees, Proteger} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type BrulureProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, idees: Idees, eau: Eau, proteger: Proteger, consulter: Consulter, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	idees: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	eau: {p: whip('left'), sfx: 'whoosh'},
	proteger: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	consulter: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Brulure: React.FC<BrulureProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/brulure/voix.wav' : null} sfx={sfx} />
);
