// « Escarre : tu masses ? » (n° 105, série « Les plaies » en fenêtre pixel 8-bit, pilote). Accroche : rougeur au
// sacrum, la loupe montre la lésion qui commence près de l'os ; règle avant 10 s ; 3 notions ; fin = test du doigt,
// puis la dernière image rejoint la première (boucle). Storyboard : docs/lpi/storyboard-escarre-massage.md.
import React from 'react';
import {Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Hook, Loop, Massage, Pression, Regle, Soulager} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type EscarreMassageProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, regle: Regle, pression: Pression, massage: Massage, soulager: Soulager, fin: Fin, end: Loop};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	regle: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	pression: {p: whip('left'), sfx: 'whoosh'},
	massage: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	soulager: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 880, color: LPI.sky}), sfx: 'whoosh'},
};

export const EscarreMassage: React.FC<EscarreMassageProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/escarre-massage/voix.wav' : null} sfx={sfx} />
);
