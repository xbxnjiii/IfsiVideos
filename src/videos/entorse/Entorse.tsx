// « Entorse de la cheville » — format court (≈ 42 s, voix gratuite d'abord, Laura une fois validée, sans barre de
// progression). Accroche sans texte, réaliste : footing au parc, le pied se tord sur une racine, la cheville gonfle. Idée
// reçue (« je bouge le pied, donc pas cassé » : radio, os fêlé), le bon geste en 4 mots (glace 15 – 20 min dans un linge,
// repos, élévation plus haut que la hanche, contention sans trop serrer), quand faire une radio (4 pas impossibles, douleur
// sur l'os, cheville déformée), chute (il saute la racine). Storyboard : docs/lpi/storyboard-entorse.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Consulter, Fin, Hook, Idees, Methode, Suite} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EntorseProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, idees: Idees, methode: Methode, suite: Suite, consulter: Consulter, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	idees: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	methode: {p: whip('left'), sfx: 'whoosh'},
	suite: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	consulter: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Entorse: React.FC<EntorseProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/entorse/voix.wav' : null} sfx={sfx} />
);
