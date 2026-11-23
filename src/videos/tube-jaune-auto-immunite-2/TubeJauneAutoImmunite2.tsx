// Tube-Jaune-Auto-Immunite-2 : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Ccp, Fin, Fr, Hook, Tg, Tpo} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneAutoImmunite2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, ccp: Ccp, fr: Fr, tpo: Tpo, tg: Tg, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	ccp: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	fr: {p: whip('left'), sfx: 'whoosh'},
	tpo: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	tg: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJauneAutoImmunite2: React.FC<TubeJauneAutoImmunite2Props> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune-auto-immunite-2/voix.wav' : null} sfx={sfx} />
);
