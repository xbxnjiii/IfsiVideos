// Precautions-Standard : « Les précautions standard » (SF2H 2017). Accroche « deux patients : lequel peut te contaminer ?
// les deux ! », 6 réflexes pour tous les patients (un par scène, suivi des 6), récap.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Aes, Env, Epi, Excreta, Hook, Mains, Outro, Regle, Toux} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type PrecautionsStandardProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, regle: Regle, mains: Mains, epi: Epi, toux: Toux, aes: Aes, excreta: Excreta, env: Env, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	regle: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	mains: {p: whip('left'), sfx: 'whoosh'},
	epi: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	toux: {p: runWipe(), sfx: 'run'},
	aes: {p: whip('up'), sfx: 'whoosh'},
	excreta: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	env: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PrecautionsStandard: React.FC<PrecautionsStandardProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/precautions-standard/voix.wav' : null} sfx={sfx} />
);
