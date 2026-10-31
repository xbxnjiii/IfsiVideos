// Vidéos en série (« partie 1 / 3 ») : carte de la série juste après l'accroche (les parties déjà vues sont cochées, la
// partie en cours brille, les suivantes attendent avec un cadenas : donne envie de regarder la suite), étiquette de la
// série sur la ligne du sur-titre, carte « À suivre » de la fin du récap. Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

export type SeriesPart = {title: string; icon: React.ReactNode};

const Check: React.FC<{size?: number}> = ({size = 44}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 52 L42 70 L76 32" fill="none" stroke={N} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
const Lock: React.FC<{size?: number}> = ({size = 44}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M32 46 V34 A18 18 0 0 1 68 34 V46" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
		<rect x={22} y={46} width={56} height={42} rx={10} fill={LPI.sky} stroke={N} strokeWidth={8} />
		<circle cx={50} cy={66} r={6} fill={N} />
	</svg>
);

/** Une partie de la série (tuile) : faite (cochée), en cours (rose, « ici »), à venir (cadenas, en retrait). */
const PartTile: React.FC<{i: number; part: SeriesPart; state: 'done' | 'current' | 'next'; at: number; y: number}> = ({i, part, state, at: t0, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const cur = state === 'current';
	const glow = cur ? 0.5 + 0.5 * Math.sin(frame / 5) : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				height: 168,
				boxSizing: 'border-box',
				borderRadius: 40,
				background: cur ? LPI.pink : LPI.paper,
				border: `6px solid ${cur ? N : state === 'done' ? LPI.blue : alpha(N, 0.2)}`,
				boxShadow: cur ? `0 0 ${24 + 24 * glow}px ${alpha(LPI.pink, 0.8)}` : SHADOW,
				display: 'flex',
				alignItems: 'center',
				gap: 26,
				padding: '0 30px',
				opacity: state === 'next' ? 0.82 : 1,
				transform: `scale(${popAt(frame, t0) * (cur ? 1.04 : 1)}) rotate(${(1 - Math.min(1, (frame - t0) / 8)) * -4}deg)`,
			}}
		>
			<div style={{width: 112, height: 112, borderRadius: 56, background: cur ? LPI.paper : alpha(LPI.sky, 0.7), border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{part.icon}</div>
			<div style={{flex: 1}}>
				<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.14em', color: alpha(N, 0.7)}}>PARTIE {i + 1}</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{part.title}</div>
			</div>
			<div style={{width: 92, height: 92, borderRadius: 46, background: state === 'done' ? LPI.sky : cur ? N : LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				{state === 'done' ? <Check /> : cur ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.paper}}>ICI</div> : <Lock />}
			</div>
		</div>
	);
};

/** Les parties de la série en colonne (à partir de y), la partie `current` mise en avant. */
export const SeriesParts: React.FC<{parts: SeriesPart[]; current: number; at: number; y?: number; gap?: number; stagger?: number}> = ({parts, current, at: t0, y = 470, gap = 196, stagger = 6}) => (
	<>
		{parts.map((p, i) => (
			<PartTile key={p.title} i={i} part={p} state={i < current ? 'done' : i === current ? 'current' : 'next'} at={t0 + i * stagger} y={y + i * gap} />
		))}
	</>
);

/** Étiquette de la série (« LES PLAIES · 1/3 ») sur la ligne du sur-titre, à droite ; visible de `from` à `to`. */
export const SeriesTag: React.FC<{label: string; part: number; count: number; from: number; to: number}> = ({label, part, count, from, to}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [from, from + 10, to - 8, to], [0, 1, 1, 0], clamp);
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', right: 60, top: 222, opacity: o, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 18px', borderRadius: 999, background: LPI.paper, border: `4px solid ${LPI.sky}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.1em', color: N}}>
			{label}
			<span style={{padding: '2px 12px', borderRadius: 999, background: LPI.pink, color: N}}>
				{part}/{count}
			</span>
		</div>
	);
};

/** Carte « À suivre » (fin de récap) : la prochaine partie, son titre et une phrase qui donne envie. */
export const NextUp: React.FC<{at: number; part: number; title: string; teaser: string; icon: React.ReactNode; y?: number; done?: boolean}> = ({at: t0, part, title, teaser, icon, y = 1010, done = false}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const wob = Math.sin(frame / 6) * 1.5;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, transform: `scale(${popAt(frame, t0)}) rotate(${wob * 0.3}deg)`}}>
			<div style={{borderRadius: 44, background: N, padding: '26px 34px', boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 28}}>
				<div style={{width: 150, height: 150, borderRadius: 75, background: LPI.pink, border: `6px solid ${LPI.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
				<div style={{flex: 1}}>
					<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.16em', color: LPI.sky}}>{done ? 'SÉRIE TERMINÉE' : `À SUIVRE · PARTIE ${part}`}</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 58, color: LPI.paper, lineHeight: 1.05}}>{title}</div>
					<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: LPI.pink, marginTop: 8, opacity: interpolate(frame, [t0 + 10, t0 + 18], [0, 1], clamp)}}>{teaser}</div>
				</div>
			</div>
		</div>
	);
};
