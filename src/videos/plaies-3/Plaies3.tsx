// Série « Les plaies », partie 3 / 3 : les plaies chroniques (rythme plus lent, voix +0 %). Accroche (« Cette
// plaie… ne fait pas mal »), carte de la série, l'escarre, ses 4 stades, l'ulcère de jambe, le pied diabétique,
// récap + série terminée.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Escarre, Hook, Outro, Pied, Serie, Stades, Ulcere} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Plaies3Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, escarre: Escarre, stades: Stades, ulcere: Ulcere, pied: Pied, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: wave({x: 540, y: 900}), sfx: 'whoosh'},
	escarre: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	stades: {p: whip('up'), sfx: 'whoosh'},
	ulcere: {p: runWipe(), sfx: 'run'},
	pied: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Plaies3: React.FC<Plaies3Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/plaies-3/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LES PLAIES" part={3} count={3} from={start('escarre')} to={start('end')} />
	</AbsoluteFill>
);
