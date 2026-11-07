// Série « Le diabète », partie 2 / 2 : le découvrir et le soigner (voix +0 %, animations posées). Accroche « il va très
// bien… et pourtant » (le sucre abîme ses yeux, ses reins, ses pieds sans un bruit : comment le repérer à temps ?), carte
// de la série, le découvrir (souvent silencieux, ≥ 1,26 g/L à jeun sur deux prises de sang), complications, traitement
// (selon le type) + HbA1c, ton rôle, récap + « série terminée ». Briques : src/brand/diabetes.tsx.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {SeriesTag} from '../../brand/series';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Compli, Diag, Hook, Outro, Role, Serie, Trait} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Diabete2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, diag: Diag, compli: Compli, trait: Trait, role: Role, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	diag: {p: whip('left'), sfx: 'whoosh'},
	compli: {p: runWipe(), sfx: 'run'},
	trait: {p: whip('up'), sfx: 'whoosh'},
	role: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Diabete2: React.FC<Diabete2Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/diabete-2/voix.wav' : null} sfx={sfx} />
		<SeriesTag label="LE DIABÈTE" part={2} count={2} from={start('diag')} to={start('end')} />
	</AbsoluteFill>
);
