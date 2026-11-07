// Série « Le diabète », partie 1 / 2 : les 3 types (voix +0 %, animations posées). Accroche « paradoxe » (son sang est
// plein de sucre… et ses cellules meurent de faim), carte de la série, le principe (clé insuline, renvoi vidéo
// glycémie), type 1 = insulinodépendant (DID), type 2 = non insulinodépendant (DNID), diabète gestationnel, récap +
// « à suivre : découvrir et soigner ». Briques : src/brand/diabetes.tsx.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Def, Gesta, Hook, Outro, Serie, Type1, Type2} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Diabete1Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, def: Def, type1: Type1, type2: Type2, gesta: Gesta, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	def: {p: whip('left'), sfx: 'whoosh'},
	type1: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	type2: {p: runWipe(), sfx: 'run'},
	gesta: {p: whip('up'), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Diabete1: React.FC<Diabete1Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/diabete-1/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LE DIABÈTE" part={1} count={2} from={start('def')} to={start('end')} />
	</AbsoluteFill>
);
