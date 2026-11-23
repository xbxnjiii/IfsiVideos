// Tube-Jaune-Vitamines : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {B12, Cdt, Fin, Hook, Vitd} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneVitaminesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, vitd: Vitd, b12: B12, cdt: Cdt, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	vitd: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	b12: {p: whip('left'), sfx: 'whoosh'},
	cdt: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneVitamines: React.FC<TubeJauneVitaminesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-vitamines/voix.wav' : null} sfx={sfx} />
);
