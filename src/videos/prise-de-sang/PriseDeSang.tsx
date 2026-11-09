// « Le matériel pour une prise de sang » v2 (format inventaire, look 2026, voix Laura) : accroche = le plateau en
// 3 bandes de couleur où les 13 objets tombent, puis chaque objet repris un par un en très grand (aplat de couleur par
// famille, vrai flou de mouvement), récap = le plateau se remplit à nouveau. En haut : pastille de la famille en cours
// et compteur MATÉRIEL n / 13. Storyboard : docs/lpi/storyboard-prise-de-sang.md.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {popAt} from '../../brand/bold';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {MASCOT} from './mascot';
import {Bras, Dechets, Fin, GROUPS, Hook, itemMarks, Mains, Outro, Prelevement, Tubes} from './Scenes';
import {SCENE_IDS, SceneId, start, TL} from './timeline';

export type PriseDeSangProps = {voice: boolean; sfx: boolean};

const N = LPI.navy;
const SCENES: Record<SceneId, React.FC> = {intro: Hook, prelevement: Prelevement, tubes: Tubes, mains: Mains, bras: Bras, fin: Fin, dechets: Dechets, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	prelevement: {p: zoomInto({x: 540, y: 640}), sfx: 'whoosh'}, // on plonge dans la bande 1 du plateau
	tubes: {p: whip('left'), sfx: 'whoosh'},
	mains: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	bras: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	dechets: {p: zoomInto({x: 540, y: 700, color: LPI.blue}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

/** En haut : la famille en cours (à gauche) et le compteur MATÉRIEL n / 13 (à droite). */
const TopBar: React.FC = () => {
	const frame = useCurrentFrame();
	const from = start('prelevement') + 6;
	const to = start('outro');
	const o = interpolate(frame, [from, from + 10, to - 8, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	const fam = frame < start('mains') ? 0 : frame < start('fin') ? 1 : 2;
	const famAt = [from, start('mains') + 4, start('fin') + 4][fam];
	const marks = itemMarks();
	const n = marks.filter((m) => frame >= m).length;
	const last = marks[Math.max(0, n - 1)];
	const bump = n > 0 && frame - last < 12 ? 1 + 0.3 * Math.exp(-(frame - last) / 3) : 1;
	const pill = {height: 78, boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px 0 8px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW};
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={{position: 'absolute', left: 48, top: 54, ...pill, transform: `scale(${popAt(frame, famAt)})`, transformOrigin: 'left center'}}>
				<div style={{width: 58, height: 58, borderRadius: 29, background: [LPI.sky, LPI.pink, LPI.blue][fam], border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: fam === 2 ? LPI.paper : N}}>{fam + 1}</div>
				<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N}}>{GROUPS[fam].title.toUpperCase()}</div>
			</div>
			<div style={{position: 'absolute', right: 48, top: 54, ...pill, padding: '0 8px 0 22px'}}>
				<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.12em', color: alpha(N, 0.75)}}>MATÉRIEL</div>
				<div style={{padding: '4px 16px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, fontVariantNumeric: 'tabular-nums', transform: `scale(${bump})`}}>{n} / 13</div>
			</div>
		</AbsoluteFill>
	);
};

export const PriseDeSang: React.FC<PriseDeSangProps> = ({voice, sfx}) => (
	<AbsoluteFill>
		<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/prise-de-sang/voix.wav' : null} sfx={sfx} />
		<TopBar />
	</AbsoluteFill>
);
