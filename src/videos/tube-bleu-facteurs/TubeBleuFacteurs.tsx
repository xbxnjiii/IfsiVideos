// « Le tube bleu : anti-Xa, antithrombine, protéines C et S, facteurs » (n° 77, série « les tubes »). Storyboard : docs/lpi/storyboard-tube-bleu.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Antithrombine, Antixa, Facteurs, Fin, Hook, Proteines} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeBleuFacteursProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, antixa: Antixa, antithrombine: Antithrombine, proteines: Proteines, facteurs: Facteurs, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	antixa: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	antithrombine: {p: whip('left'), sfx: 'whoosh'},
	proteines: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	facteurs: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeBleuFacteurs: React.FC<TubeBleuFacteursProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-bleu-facteurs/voix.wav' : null} sfx={sfx} />
);
