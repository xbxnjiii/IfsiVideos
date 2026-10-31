// « Le matériel pour une prise de sang » (format inventaire, rythme d'apprentissage) : accroche = le plateau et ses
// 3 familles où les 13 objets tombent (« Ça, c'est le matériel qu'il te faut… »), puis chaque objet repris un par un
// (gros plan + explication + liste qui se coche, compteur « MATÉRIEL n / 13 »), récap.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Bras, Dechets, Fin, Hook, ItemCounter, Mains, Outro, Prelevement, Tubes} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type PriseDeSangProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, prelevement: Prelevement, tubes: Tubes, mains: Mains, bras: Bras, fin: Fin, dechets: Dechets, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	prelevement: {p: zoomInto({x: 540, y: 600}), sfx: 'whoosh'}, // on plonge dans la famille 1 du plateau
	tubes: {p: whip('left'), sfx: 'whoosh'},
	mains: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	bras: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	dechets: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const PriseDeSang: React.FC<PriseDeSangProps> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/prise-de-sang/voix.wav' : null} sfx={sfx} />
		<ItemCounter from={start('prelevement') + 10} to={start('outro')} />
	</AbsoluteFill>
);
