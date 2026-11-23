// Tube-Jaune-Electrophorese : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Electro, Fin, Hook, Igs, Pic} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneElectrophoreseProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, electro: Electro, pic: Pic, ig: Igs, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	electro: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	pic: {p: whip('left'), sfx: 'whoosh'},
	ig: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneElectrophorese: React.FC<TubeJauneElectrophoreseProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-electrophorese/voix.wav' : null} sfx={sfx} />
);
