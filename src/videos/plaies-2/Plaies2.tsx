// Série « Les plaies », partie 2 / 3 : les plaies aiguës (rythme plus lent, voix +0 %). Accroche (« Ce petit
// trou… plus dangereux qu'une grande coupure ? »), carte de la série, excoriation · coupure · lacération, piqûre ·
// morsure · plaie chirurgicale, brûlures par degrés, récap + « à suivre : partie 3 ».
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Brulures, Hook, Outro, Serie, Trauma1, Trauma2} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Plaies2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, trauma1: Trauma1, trauma2: Trauma2, brulures: Brulures, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: wave({x: 540, y: 900}), sfx: 'whoosh'},
	trauma1: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	trauma2: {p: whip('left'), sfx: 'whoosh'},
	brulures: {p: runWipe(), sfx: 'run'},
	outro: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Plaies2: React.FC<Plaies2Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/plaies-2/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LES PLAIES" part={2} count={3} from={start('trauma1')} to={start('end')} />
	</AbsoluteFill>
);
