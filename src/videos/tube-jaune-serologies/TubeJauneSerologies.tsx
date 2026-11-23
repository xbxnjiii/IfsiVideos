// Tube-Jaune-Serologies : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hepb, Hook, Principe, Syphilis, Vih} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneSerologiesProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, principe: Principe, hepb: Hepb, vih: Vih, syphilis: Syphilis, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	principe: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hepb: {p: whip('left'), sfx: 'whoosh'},
	vih: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	syphilis: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneSerologies: React.FC<TubeJauneSerologiesProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-serologies/voix.wav' : null} sfx={sfx} />
);
