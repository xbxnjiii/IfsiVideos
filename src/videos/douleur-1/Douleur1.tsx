// Série « La douleur : échelles d'évaluation », partie 1 / 2 : l'auto-évaluation — v2 (look 2026, voix Laura).
// Accroche « trois soignants, trois avis », carte de la série, principe, échelle numérique, EVA, EVS, visages, seuil,
// récap + « à suivre ». En haut pendant les notions : le chapitre en cours (à gauche) et la série (à droite) ; pas de
// barre de progression. Storyboard : docs/lpi/storyboard-douleur-serie.md.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TopPill} from '../../brand/bold';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {MASCOT} from './mascot';
import {Auto, En, Eva, Evs, Hook, Outro, Serie, Seuil, Visages} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type Douleur1Props = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, serie: Serie, auto: Auto, en: En, eva: Eva, evs: Evs, visages: Visages, seuil: Seuil, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	serie: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	auto: {p: whip('left'), sfx: 'whoosh'},
	en: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	eva: {p: runWipe(), sfx: 'run'},
	evs: {p: whip('up'), sfx: 'whoosh'},
	visages: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	seuil: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

/** Chapitre affiché en haut à gauche pendant chaque notion. */
const CHAPTERS: {id: SceneId; badge?: string; tone?: string; label: string}[] = [
	{id: 'auto', label: 'LE PRINCIPE'},
	{id: 'en', badge: '1', label: 'ÉCHELLE NUMÉRIQUE'},
	{id: 'eva', badge: '2', tone: LPI.sky, label: 'ÉCHELLE EVA'},
	{id: 'evs', badge: '3', label: 'ÉCHELLE EVS'},
	{id: 'visages', badge: '4', tone: LPI.sky, label: 'ÉCHELLE DES VISAGES'},
	{id: 'seuil', badge: '!', label: 'ET ENSUITE ?'},
];

const TopBar: React.FC = () => {
	const frame = useCurrentFrame();
	const from = start('auto') + 6;
	const to = start('outro');
	const o = interpolate(frame, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	const ch = [...CHAPTERS].reverse().find((c) => frame >= start(c.id) + 4) ?? CHAPTERS[0];
	return (
		<AbsoluteFill>
			<TopPill side="left" at={Math.max(from, start(ch.id) + 4)} badge={ch.badge} badgeTone={ch.tone} label={ch.label} opacity={o} />
			<TopPill side="right" at={from} label="LA DOULEUR" chip="1/2" opacity={o} />
		</AbsoluteFill>
	);
};

export const Douleur1: React.FC<Douleur1Props> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/douleur-1/voix.wav' : null} sfx={sfx} />
		<TopBar />
	</AbsoluteFill>
);
