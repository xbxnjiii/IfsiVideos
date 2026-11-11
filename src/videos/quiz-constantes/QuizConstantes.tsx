// Quiz-Constantes (promo) : les 7 vidéos des paramètres vitaux sont sorties (FR, FC, T°, TA, glycémie, SpO₂,
// diurèse) → quiz gratuit sur lapetiteide.fr (lien en bio). Accroche « quiz éclair » : 4 questions, 3 secondes chacune
// (vrai silence dans la voix pour répondre), puis les 7 vidéos, le quiz du site sur un téléphone, le défi final.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Hook, Outro, Quiz, Serie} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type QuizConstantesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, quiz: Quiz, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	quiz: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const QuizConstantes: React.FC<QuizConstantesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/quiz-constantes/voix.wav' : null} sfx={sfx} progress={false} />
);
