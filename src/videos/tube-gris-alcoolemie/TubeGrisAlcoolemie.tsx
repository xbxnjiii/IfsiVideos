// « Le tube gris : l'alcoolémie » (n° 74, série « les tubes », directives Instagram). Storyboard : docs/lpi/storyboard-tube-gris.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Corps, Fin, Geste, Hook, Quand, Seuils} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeGrisAlcoolemieProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, quand: Quand, geste: Geste, seuils: Seuils, corps: Corps, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	quand: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	geste: {p: whip('left'), sfx: 'whoosh'},
	seuils: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	corps: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeGrisAlcoolemie: React.FC<TubeGrisAlcoolemieProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-gris-alcoolemie/voix.wav' : null} sfx={sfx} />
);
