// « Le tube jaune » (n° 63, série « les tubes », sans barre de progression) : l'ionogramme, ion par ion, avec les normes
// fournies par le propriétaire. Storyboard : docs/lpi/storyboard-tube-jaune.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bicar, Calcium, Chlore, Fin, Hook, Ions, Jaune, Magnesium, Phosphore, Potassium, Sodium} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type TubeJauneProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, jaune: Jaune, ions: Ions, sodium: Sodium, potassium: Potassium, chlore: Chlore, bicar: Bicar, phosphore: Phosphore, magnesium: Magnesium, calcium: Calcium, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	jaune: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	ions: {p: whip('left'), sfx: 'whoosh'},
	sodium: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	potassium: {p: runWipe(), sfx: 'run'},
	chlore: {p: whip('up'), sfx: 'whoosh'},
	bicar: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	phosphore: {p: whip('left'), sfx: 'whoosh'},
	magnesium: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	calcium: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const TubeJaune: React.FC<TubeJauneProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/tube-jaune/voix.wav' : null} sfx={sfx} />
);
