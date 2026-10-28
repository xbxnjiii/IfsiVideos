// Échelle des normes (adulte) : zones nommées (hypo / normo / hyper…), bornes chiffrées sous chaque zone,
// curseur qui suit la valeur animée de l'illustration ; la zone où se trouve le curseur s'allume.
// L'axe n'est pas linéaire : chaque zone a sa largeur (lisibilité), le curseur est placé dans sa zone.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, FONT, LPI} from './theme';
import {clamp} from './ui';

export type ZoneTone = 'low' | 'norm' | 'mid' | 'high' | 'gap';
export type Zone = {
	/** nom du terme (ex. « normocardie ») ; vide = zone de transition sans nom */
	name: string;
	/** bornes affichées sous la zone (ex. « 60 – 100 bpm ») */
	range?: string;
	tone: ZoneTone;
	/** largeur relative de la zone */
	w: number;
	/** valeurs couvertes (placement du curseur) */
	lo: number;
	hi: number;
};

const BG: Record<ZoneTone, string> = {
	low: LPI.sky,
	norm: LPI.blue,
	mid: alpha(LPI.pink, 0.5),
	high: LPI.pink,
	gap: alpha(LPI.sky, 0.45),
};
const INK: Record<ZoneTone, string> = {low: LPI.navy, norm: LPI.paper, mid: LPI.navy, high: LPI.navy, gap: LPI.navy};

const TAG_W = 122;
const BAR_H = 52;
const TOP = 34;

export const NormScale: React.FC<{
	zones: Zone[];
	/** valeur courante (le curseur la suit) ; undefined = pas de curseur */
	value?: number;
	at: number;
	markerAt?: number;
	x?: number;
	y: number;
	width?: number;
	tag?: React.ReactNode;
	/** cadre pointillé au-dessus d'une plage particulière (ex. cible BPCO 88–92 %) */
	bracket?: {lo: number; hi: number; label: React.ReactNode; at: number};
	nameSize?: number;
	rangeSize?: number;
}> = ({zones, value, at, markerAt, x = 72, y, width = 936, tag = 'Adulte', bracket, nameSize = 26, rangeSize = 22}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 1) return null;
	const barW = width - (tag ? TAG_W + 12 : 0);
	const total = zones.reduce((s, z) => s + z.w, 0);
	const starts: number[] = [];
	let acc = 0;
	for (const z of zones) {
		starts.push((acc / total) * barW);
		acc += z.w;
	}
	const segW = (i: number) => (zones[i].w / total) * barW;
	const toX = (v: number) => {
		if (v <= zones[0].lo) return 4;
		for (let i = 0; i < zones.length; i++) {
			const z = zones[i];
			if (v < z.hi || i === zones.length - 1) {
				const t = Math.min(1, Math.max(0, (v - z.lo) / (z.hi - z.lo)));
				return Math.min(barW - 4, Math.max(4, starts[i] + t * segW(i)));
			}
		}
		return barW - 4;
	};
	const active = value === undefined ? -1 : zones.findIndex((z, i) => (value >= z.lo || i === 0) && (value < z.hi || i === zones.length - 1));
	const tagP = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 200}});
	// le curseur n'arrive jamais avant sa barre
	const mk = markerAt !== undefined ? spring({frame: frame - Math.max(markerAt, at + 6), fps, config: {damping: 10, stiffness: 220, mass: 0.6}}) : 0;
	const barLeft = tag ? TAG_W + 12 : 0;
	return (
		<div style={{position: 'absolute', left: x, top: y, width, height: TOP + BAR_H + rangeSize + 14}}>
			{tag ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: TOP + 5,
						width: TAG_W,
						height: BAR_H - 10,
						borderRadius: 999,
						background: LPI.navy,
						color: LPI.paper,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT.body,
						fontWeight: 800,
						fontSize: 18,
						letterSpacing: '0.12em',
						textTransform: 'uppercase',
						opacity: Math.min(1, tagP * 2),
						transform: `translateX(${(1 - tagP) * -30}px)`,
					}}
				>
					{tag}
				</div>
			) : null}
			<div style={{position: 'absolute', left: barLeft, top: TOP, width: barW, height: BAR_H}}>
				{zones.map((z, i) => {
					const s = spring({frame: frame - at - 3 - i * 3, fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
					const on = i === active;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: starts[i] + 2,
								top: 0,
								width: segW(i) - 4,
								height: BAR_H,
								borderRadius: i === 0 ? '26px 8px 8px 26px' : i === zones.length - 1 ? '8px 26px 26px 8px' : 8,
								background: BG[z.tone],
								boxShadow: on ? `0 0 0 4px ${LPI.paper}, 0 0 0 7px ${alpha(LPI.navy, 0.85)}, 0 10px 24px ${alpha(LPI.navy, 0.2)}` : 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: nameSize,
								color: INK[z.tone],
								whiteSpace: 'nowrap',
								opacity: Math.min(1, s * 2),
								transform: `scaleY(${0.3 + 0.7 * s}) scale(${on ? 1.04 : 1})`,
								zIndex: on ? 2 : 1,
							}}
						>
							{z.name}
						</div>
					);
				})}
				{zones.map((z, i) =>
					z.range ? (
						<div
							key={`r${i}`}
							style={{
								position: 'absolute',
								left: starts[i],
								width: segW(i),
								top: BAR_H + 6,
								textAlign: 'center',
								fontFamily: FONT.body,
								fontWeight: 700,
								fontSize: rangeSize,
								color: i === active ? LPI.navy : alpha(LPI.navy, 0.66),
								whiteSpace: 'nowrap',
								opacity: interpolate(frame, [at + 8 + i * 3, at + 14 + i * 3], [0, 1], clamp),
							}}
						>
							{z.range}
						</div>
					) : null,
				)}
				{bracket && frame >= bracket.at ? (
					<Bracket x0={toX(bracket.lo)} x1={toX(bracket.hi)} label={bracket.label} p={spring({frame: frame - bracket.at, fps, config: {damping: 12, stiffness: 200}})} />
				) : null}
				{value !== undefined && mk > 0.01 ? (
					<div
						style={{
							position: 'absolute',
							left: toX(value) - 13,
							top: -26,
							width: 26,
							height: 30,
							transform: `scale(${mk})`,
							transformOrigin: 'bottom center',
							zIndex: 3,
						}}
					>
						<svg width={26} height={30} viewBox="0 0 26 30">
							<path d="M13 30 L1 12 A12 12 0 1 1 25 12 Z" fill={LPI.navy} stroke={LPI.paper} strokeWidth={3} />
							<circle cx="13" cy="12" r="5" fill={LPI.paper} />
						</svg>
					</div>
				) : null}
			</div>
		</div>
	);
};

const Bracket: React.FC<{x0: number; x1: number; label: React.ReactNode; p: number}> = ({x0, x1, label, p}) => (
	<>
		<div
			style={{
				position: 'absolute',
				left: x0,
				top: -6,
				width: Math.max(10, x1 - x0),
				height: BAR_H + 12,
				borderRadius: 12,
				border: `4px dashed ${LPI.navy}`,
				opacity: Math.min(1, p * 2),
				transform: `scale(${0.8 + 0.2 * p})`,
				zIndex: 2,
			}}
		/>
		<div
			style={{
				position: 'absolute',
				left: (x0 + x1) / 2,
				top: -42,
				transform: `translateX(-50%) scale(${p})`,
				padding: '3px 12px',
				borderRadius: 999,
				background: LPI.paper,
				border: `3px solid ${LPI.navy}`,
				fontFamily: FONT.body,
				fontWeight: 800,
				fontSize: 20,
				color: LPI.navy,
				whiteSpace: 'nowrap',
				zIndex: 4,
			}}
		>
			{label}
		</div>
	</>
);
