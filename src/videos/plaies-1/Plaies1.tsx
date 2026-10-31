// Série « Les plaies », partie 1 / 3 : les bases (rythme plus lent, voix +0 %). Accroche (3 jours… ou des mois ?),
// carte de la série, définition (la peau = une barrière), les couches de la peau, aiguë / chronique, simple ou grave,
// récap + « à suivre : partie 2 ».
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Couches, Definition, Familles, Gravite, Hook, Outro, Serie} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Plaies1Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, def: Definition, couches: Couches, familles: Familles, gravite: Gravite, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: wave({x: 540, y: 900}), sfx: 'whoosh'},
	def: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	couches: {p: whip('left'), sfx: 'whoosh'},
	familles: {p: runWipe(), sfx: 'run'},
	gravite: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Plaies1: React.FC<Plaies1Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/plaies-1/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LES PLAIES" part={1} count={3} from={start('def')} to={start('end')} />
	</AbsoluteFill>
);
