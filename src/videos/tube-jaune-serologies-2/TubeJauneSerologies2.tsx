// Tube-Jaune-Serologies-2 : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cmv, Ebv, Fin, Hook, Rubeole, Toxo} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneSerologies2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, toxo: Toxo, rubeole: Rubeole, cmv: Cmv, ebv: Ebv, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	toxo: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	rubeole: {p: whip('left'), sfx: 'whoosh'},
	cmv: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	ebv: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneSerologies2: React.FC<TubeJauneSerologies2Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-serologies-2/voix.wav' : null} sfx={sfx} />
);
