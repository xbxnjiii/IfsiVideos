// Fiche BONUS sans voix (après le récap, avant le logo) : glycémie et diurèse, normes adulte.
// Rythme tenu sans voix : tampon « Bonus ! », cartes qui arrivent, échelles dont le curseur balaie
// les zones (bruitages discrets), puis « Mets pause pour noter ».
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Stamp, Sticker, usePop} from '../../brand/kit';
import {Burst, Camera, LiveBackground} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Kicker, Title} from '../../brand/ui';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;

export const ZONES_BONUS = {
	glycemie: [
		{name: 'hypoglycémie', range: '< 0,70 g/l', tone: 'low', w: 1, lo: 0.3, hi: 0.7},
		{name: 'normoglycémie', range: '0,70 – 1,10 g/l', tone: 'norm', w: 1.15, lo: 0.7, hi: 1.1},
		{name: 'hyperglycémie', range: '> 1,10 g/l', tone: 'high', w: 1, lo: 1.1, hi: 2},
	],
	diurese: [
		{name: 'anurie', range: '< 100', tone: 'high', w: 0.95, lo: 0, hi: 100},
		{name: 'oligurie', range: '< 400', tone: 'mid', w: 1, lo: 100, hi: 400},
		{name: '', tone: 'gap', w: 0.32, lo: 400, hi: 600},
		{name: 'normodiurèse', range: '600 – 2000', tone: 'norm', w: 1.3, lo: 600, hi: 2000},
		{name: '', tone: 'gap', w: 0.32, lo: 2000, hi: 2500},
		{name: 'polyurie', range: '> 2500 à 3000', tone: 'low', w: 1.1, lo: 2500, hi: 4000},
	],
} satisfies Record<string, Zone[]>;

/** goutte de sang + morceau de sucre */
const GlucoseIcon: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={110} height={110} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
			<path
				d="M92 20 C120 62 150 92 150 126 A58 58 0 0 1 34 126 C34 92 64 62 92 20 Z"
				fill={LPI.pink}
				stroke={N}
				strokeWidth="10"
				strokeLinejoin="round"
				transform={`translate(0 ${Math.sin(frame / 10) * 3})`}
			/>
			<path d="M60 120 A30 30 0 0 0 80 150" fill="none" stroke={LPI.paper} strokeWidth="9" strokeLinecap="round" />
			<g transform={`translate(136 128) rotate(${-12 + Math.sin(frame / 12) * 4})`}>
				<rect x="-34" y="-34" width="68" height="68" rx="12" fill={LPI.paper} stroke={N} strokeWidth="9" />
				{[
					[-14, -12],
					[10, -16],
					[-6, 12],
					[14, 10],
				].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r="4" fill={alpha(N, 0.35)} />
				))}
			</g>
		</svg>
	);
};

/** bocal gradué (recueil des urines sur 24 h) */
const JarIcon: React.FC<{level: number}> = ({level}) => {
	const frame = useCurrentFrame();
	const top = 170 - 120 * level;
	const wave = Array.from({length: 9}, (_, i) => {
		const x = 52 + i * 12;
		return `${x},${top + 4 * Math.sin(i / 1.4 + frame / 5)}`;
	}).join(' ');
	return (
		<svg width={110} height={110} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="jar-in">
					<path d="M52 40 H148 V168 Q148 180 136 180 H64 Q52 180 52 168 Z" />
				</clipPath>
			</defs>
			<g clipPath="url(#jar-in)">
				<polygon points={`${wave} 160,200 40,200`} fill={LPI.sky} />
			</g>
			<path d="M52 40 H148 V168 Q148 180 136 180 H64 Q52 180 52 168 Z" fill="none" stroke={N} strokeWidth="10" strokeLinejoin="round" />
			<rect x="42" y="22" width="116" height="24" rx="10" fill={LPI.blue} stroke={N} strokeWidth="8" />
			{[70, 100, 130, 160].map((y) => (
				<path key={y} d={`M124 ${y} H146`} stroke={N} strokeWidth="6" strokeLinecap="round" />
			))}
			<text x="100" y="128" textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize="30" fill={N}>
				24 h
			</text>
		</svg>
	);
};

const Card: React.FC<{at: number; y: number; icon: React.ReactNode; title: string; def: React.ReactNode}> = ({at: t0, y, icon, title, def}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				height: 330,
				borderRadius: 44,
				background: alpha(LPI.paper, 0.96),
				border: `5px solid ${LPI.sky}`,
				boxShadow: SHADOW,
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 220}px) rotate(${(1 - p) * 4}deg)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 26,
					top: 26,
					width: 140,
					height: 140,
					borderRadius: 999,
					background: alpha(LPI.sky, 0.8),
					border: `5px solid ${LPI.paper}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</div>
			<div style={{position: 'absolute', left: 196, top: 36, fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: LPI.blue, lineHeight: 1}}>{title}</div>
			<div style={{position: 'absolute', left: 198, top: 118, fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: alpha(N, 0.72)}}>{def}</div>
		</div>
	);
};

/** pastille « mets pause pour noter » */
const PauseHint: React.FC = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 18,
			padding: '16px 34px 16px 18px',
			borderRadius: 999,
			background: LPI.navy,
			color: LPI.paper,
			fontFamily: FONT.title,
			fontWeight: 900,
			fontSize: 40,
			whiteSpace: 'nowrap',
		}}
	>
		<div style={{width: 58, height: 58, borderRadius: 999, background: LPI.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
			<div style={{width: 9, height: 26, borderRadius: 4, background: N}} />
			<div style={{width: 9, height: 26, borderRadius: 4, background: N}} />
		</div>
		Mets pause pour noter !
	</div>
);

/** repères du bonus (frames locales) — partagés avec le jeu de la mascotte */
// (le panoramique d'entrée dure 14 frames : rien d'important avant)
export const BONUS_T = {stamp: 14, title: 34, cardA: 38, hypo: 90, hyper: 124, cardB: 142, oligo: 184, anurie: 210, poly: 236, hint: 256};

export const Bonus: React.FC = () => {
	const frame = useCurrentFrame();
	const T = BONUS_T;
	const gly = interpolate(frame, [T.cardA + 16, T.cardA + 36, T.hypo, T.hypo + 18, T.hyper, T.hyper + 16, T.hyper + 34], [0.95, 0.95, 0.6, 0.6, 1.45, 1.45, 0.95], ease);
	const diu = interpolate(
		frame,
		[T.cardB + 14, T.cardB + 28, T.oligo, T.oligo + 12, T.anurie, T.anurie + 10, T.poly, T.poly + 12, T.poly + 26],
		[1200, 1200, 300, 300, 60, 60, 3000, 3000, 1200],
		ease,
	);
	const jar = interpolate(diu, [0, 3000], [0.05, 0.95], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[T.stamp, T.cardA + 2, T.hypo + 2, T.hyper + 2, T.cardB + 2, T.anurie + 2, T.poly + 2, T.hint]} shakes={[T.stamp + 1]}>
				<Stamp at={T.stamp} x={540} y={330} text="Bonus !" size={110} rot={-7} out={T.title - 2} />
				<Burst at={T.stamp + 1} x={540} y={330} r={330} n={16} />
				<div style={{position: 'absolute', left: 72, top: 226}}>
					<Kicker at={T.title}>Bonus · normes adulte</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: 270, width: 936}}>
					<Title at={T.title + 2} text="Deux autres valeurs" size={56} stagger={2} brush={false} />
					<Title at={T.title + 6} text="à *surveiller*" size={92} stagger={2} />
				</div>
				<Card at={T.cardA} y={500} icon={<GlucoseIcon />} title="Glycémie" def="taux de sucre dans le sang" />
				<NormScale zones={ZONES_BONUS.glycemie} value={gly} at={T.cardA + 10} markerAt={T.cardA + 16} x={96} y={680} width={888} nameSize={25} />
				<Card at={T.cardB} y={860} icon={<JarIcon level={jar} />} title="Diurèse" def="volume d'urine sur 24 h (en ml)" />
				<NormScale zones={ZONES_BONUS.diurese} value={diu} at={T.cardB + 10} markerAt={T.cardB + 14} x={96} y={1040} width={888} nameSize={22} rangeSize={19} />
				<Sticker at={T.hint} x={540} y={1290} rot={-3}>
					<PauseHint />
				</Sticker>
			</Camera>
			<Sfx name="stamp" at={T.stamp} volume={0.12} />
			<Sfx name="whoosh" at={T.cardA} volume={0.07} />
			<Sfx name="whoosh" at={T.cardB} volume={0.07} />
			{[T.hypo, T.hyper, T.oligo, T.anurie, T.poly].map((t) => (
				<Sfx key={t} name="tick" at={t} volume={0.1} />
			))}
			<Sfx name="ding" at={T.hint} volume={0.09} />
		</AbsoluteFill>
	);
};
