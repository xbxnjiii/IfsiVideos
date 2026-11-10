// Série « La douleur : échelles d'évaluation », partie 2 / 2 : l'hétéro-évaluation — v2 (look 2026, voix Laura).
// Accroche « elle ne se plaint jamais » (Madame Martin, 87 ans), carte de la série, principe, Algoplus, Doloplus, BPS,
// EVENDOL, récap (Madame Martin enfin soulagée) + « série terminée ». En haut pendant les notions : le chapitre en cours
// (à gauche) et la série (à droite) ; pas de barre de progression. Storyboard : docs/lpi/storyboard-douleur-serie.md.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TopPill} from '../../brand/bold';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {MASCOT} from './mascot';
import {Algoplus, Bps, Doloplus, Evendol, Hetero, Hook, Outro, Serie} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Douleur2Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, hetero: Hetero, algoplus: Algoplus, doloplus: Doloplus, bps: Bps, evendol: Evendol, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	hetero: {p: whip('left'), sfx: 'whoosh'},
	algoplus: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	doloplus: {p: runWipe(), sfx: 'run'},
	bps: {p: whip('up'), sfx: 'whoosh'},
	evendol: {p: zoomInto({x: 540, y: 700, color: LPI.blue}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

const CHAPTERS: {id: SceneId; badge?: string; tone?: string; label: string}[] = [
	{id: 'hetero', label: 'LE PRINCIPE'},
	{id: 'algoplus', badge: '1', label: 'ALGOPLUS'},
	{id: 'doloplus', badge: '2', tone: LPI.sky, label: 'DOLOPLUS'},
	{id: 'bps', badge: '3', label: 'BPS · RÉANIMATION'},
	{id: 'evendol', badge: '4', tone: LPI.sky, label: 'EVENDOL · ENFANT'},
];

const TopBar: React.FC = () => {
	const frame = useCurrentFrame();
	const from = start('hetero') + 6;
	const to = start('outro');
	const o = interpolate(frame, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	const ch = [...CHAPTERS].reverse().find((c) => frame >= start(c.id) + 4) ?? CHAPTERS[0];
	return (
		<AbsoluteFill>
			<TopPill side="left" at={Math.max(from, start(ch.id) + 4)} badge={ch.badge} badgeTone={ch.tone} label={ch.label} opacity={o} />
			<TopPill side="right" at={from} label="LA DOULEUR" chip="2/2" opacity={o} />
		</AbsoluteFill>
	);
};

export const Douleur2: React.FC<Douleur2Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/douleur-2/voix.wav' : null} sfx={sfx} />
		<TopBar />
	</AbsoluteFill>
);
