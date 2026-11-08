// Les constantes de l'enfant (0 – 2 · 2 – 11 · 12 – 17 ans) : seulement ce qui change par rapport à l'adulte. Accroche
// « le piège » (« Ce bébé respire 45 fois par minute… et son cœur bat à 140. Tu appelles le médecin ? » → « Pas besoin ! »),
// les 3 âges + la règle d'or, FC, FR, TA, température, glycémie, SpO₂, diurèse, récap. Briques : src/brand/kids.tsx.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Ages, Diurese, Fc, Fr, Gly, Hook, Outro, Spo2, Ta, Temp} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type ConstantesEnfantProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, ages: Ages, fc: Fc, fr: Fr, ta: Ta, temp: Temp, gly: Gly, spo2: Spo2, diurese: Diurese, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	ages: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	fc: {p: whip('left'), sfx: 'whoosh'},
	fr: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	ta: {p: runWipe(), sfx: 'run'},
	temp: {p: whip('up'), sfx: 'whoosh'},
	gly: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	spo2: {p: whip('left'), sfx: 'whoosh'},
	diurese: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	outro: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const ConstantesEnfant: React.FC<ConstantesEnfantProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/constantes-enfant/voix.wav' : null} sfx={sfx} />
);
