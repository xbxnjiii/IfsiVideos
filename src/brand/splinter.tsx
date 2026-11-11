// « Comment retirer une écharde ? » : vieille planche vue de dessus (veines, nœud, fente, fibres qui dépassent), écharde
// plantée dans le grand doigt (partie qui dépasse + partie vue par transparence sous la peau, poussée plus loin, cassée,
// retirée dans son axe), pince à écharde qui s'ouvre / se ferme. À dessiner dans le repère d'un `BigFinger`. Même rendu
// soigné que bandage.tsx. Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const LINE = {stroke: alpha(N, 0.72), strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const WOOD = mix(LPI.blue, N, 0.35);

/** L'écharde dans le repère du doigt : point d'entrée, direction (vers l'intérieur : vers la main), longueurs. */
export const SPLINTER = {x: 640, y: 236, ang: 196, inLen: 130, outLen: 70};
const rad = (SPLINTER.ang * Math.PI) / 180;
/** Point à `d` unités le long de l'écharde (d > 0 : sous la peau ; d < 0 : la partie qui dépasse). */
export const splinterAt = (d: number) => ({x: SPLINTER.x + Math.cos(rad) * d, y: SPLINTER.y + Math.sin(rad) * d});

/**
 * Vieille planche vue de dessus, sous le doigt (repère d'un `BigFinger`) : grandes veines, un nœud, une fente, des fibres
 * soulevées (l'une d'elles accroche le doigt en (`hookX`, ~236)).
 */
export const PlankG: React.FC<{hookX?: number}> = ({hookX = 640}) => {
	const id = React.useId().replace(/:/g, '');
	return (
		<g>
			<defs>
				<linearGradient id={`pk${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mix(LPI.sky, LPI.paper, 0.2)} />
					<stop offset="1" stopColor={mix(LPI.sky, LPI.blue, 0.25)} />
				</linearGradient>
			</defs>
			<rect x={-800} y={-900} width={2800} height={3000} fill={mix(LPI.paper, LPI.sky, 0.3)} />
			<rect x={-800} y={-120} width={2800} height={760} fill={alpha(N, 0.2)} transform="translate(0 24)" />
			<rect x={-800} y={-120} width={2800} height={760} fill={`url(#pk${id})`} {...LINE} />
			{Array.from({length: 14}, (_, i) => {
				const y = -90 + i * 52;
				return <path key={i} d={`M-800 ${y} C-300 ${y - 16} 200 ${y + 20} 700 ${y - 6} S1600 ${y + 14} 2000 ${y}`} fill="none" stroke={alpha(WOOD, 0.22)} strokeWidth={4} strokeLinecap="round" />;
			})}
			{/* nœud du bois */}
			<g transform="translate(180 470)">
				<ellipse rx={70} ry={36} fill={alpha(WOOD, 0.25)} stroke={alpha(WOOD, 0.45)} strokeWidth={4} />
				<ellipse rx={40} ry={18} fill="none" stroke={alpha(WOOD, 0.45)} strokeWidth={3} />
				<ellipse rx={14} ry={7} fill={alpha(WOOD, 0.6)} />
			</g>
			{/* fente */}
			<path d="M-400 560 L-120 548 L60 566 L300 552" fill="none" stroke={alpha(N, 0.45)} strokeWidth={5} strokeLinecap="round" />
			{/* fibres soulevées le long du bord (l'une va se planter) */}
			{[-200, 120, 420, hookX, 980].map((x, i) => (
				<path key={i} d={`M${x - 70} ${300 + (i % 2) * 20} L${x + 10} ${292 + (i % 2) * 20} L${x - 60} ${306 + (i % 2) * 20} Z`} fill={WOOD} stroke={alpha(N, 0.6)} strokeWidth={2} opacity={x === hookX ? 0 : 0.85} />
			))}
		</g>
	);
};

/**
 * Écharde plantée (repère d'un `BigFinger`) : `on` apparition ; `push` 0 → 1 enfoncée plus loin (la partie qui dépasse
 * rentre) ; `broken` 0 → 1 le bout qui dépassait casse et s'envole, le morceau reste sous la peau ; `pull` 0 → 1 elle sort
 * dans son axe (vers la droite) ; `red` rougeur autour.
 */
export const SplinterG: React.FC<{on?: number; push?: number; broken?: number; pull?: number; red?: number}> = ({on = 1, push = 0, broken = 0, pull = 0, red = 0}) => {
	if (on <= 0) return null;
	const S = SPLINTER;
	const shift = 40 * cl(push) - 280 * cl(pull);
	const a = splinterAt(S.inLen + shift);
	const entry = splinterAt(0);
	const tip = splinterAt(-S.outLen + shift);
	const b = cl(broken);
	const w = 9;
	// partie sous la peau (vue par transparence) : de l'entrée (ou de la queue si elle est sortie) à la pointe
	const inStart = shift < 0 ? splinterAt(Math.max(0, shift)) : entry;
	const nx = -Math.sin(rad) * w;
	const ny = Math.cos(rad) * w;
	const sliver = (p: {x: number; y: number}, q: {x: number; y: number}, sharp: boolean) =>
		sharp ? `M${p.x + nx} ${p.y + ny} L${q.x} ${q.y} L${p.x - nx} ${p.y - ny} Z` : `M${p.x + nx} ${p.y + ny} L${q.x + nx * 0.7} ${q.y + ny * 0.7} L${q.x - nx * 0.7} ${q.y - ny * 0.7} L${p.x - nx} ${p.y - ny} Z`;
	return (
		<g opacity={cl(on * 2)}>
			{red > 0 ? <ellipse cx={S.x - 30} cy={S.y - 6} rx={110} ry={80} fill={alpha(LPI.pink, 0.45 * cl(red))} /> : null}
			{/* sous la peau */}
			{pull < 1 ? <path d={sliver(inStart, a, true)} fill={alpha(N, 0.38)} /> : null}
			{/* point d'entrée */}
			{pull < 0.6 ? <ellipse cx={entry.x} cy={entry.y} rx={12} ry={9} fill={alpha(LPI.pink, 0.8)} stroke={alpha(N, 0.5)} strokeWidth={2} /> : null}
			{/* la partie qui dépasse (ou toute l'écharde une fois sortie) */}
			{b < 1 ? (
				<g transform={`translate(${60 * b} ${-120 * b}) rotate(${80 * b} ${tip.x} ${tip.y})`} opacity={1 - b}>
					<path d={sliver(shift < 0 ? a : entry, tip, false)} fill={WOOD} {...LINE} strokeWidth={2.5} />
					<path d={`M${tip.x + nx * 0.3} ${tip.y + ny * 0.3} L${(shift < 0 ? a : entry).x + nx * 0.3} ${(shift < 0 ? a : entry).y + ny * 0.3}`} stroke={alpha(LPI.paper, 0.45)} strokeWidth={3} strokeLinecap="round" />
				</g>
			) : null}
		</g>
	);
};

/**
 * Pince à écharde vue de dessus (repère d'un `BigFinger`) : pointes en (`x`, `y`), corps orienté selon `ang` (degrés,
 * direction pointes → charnière), `close` 0 → 1 les pointes se rejoignent ; `tint` voile d'antiseptique (désinfectée).
 */
export const TweezersG: React.FC<{x: number; y: number; ang?: number; close?: number; tint?: number; opacity?: number}> = ({x, y, ang = -40, close = 0, tint = 0, opacity = 1}) => {
	const id = React.useId().replace(/:/g, '');
	const open = 26 * (1 - cl(close));
	const arm = (side: 1 | -1) => `M0 ${side * 3} L120 ${side * (8 + open)} L620 ${side * 26} L620 ${side * 6} L120 ${side * (2 + open * 0.6)} Z`;
	return (
		<g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={opacity}>
			<defs>
				<linearGradient id={`tw${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={mix(LPI.sky, LPI.blue, 0.3)} />
				</linearGradient>
			</defs>
			<path d={arm(1)} fill={alpha(N, 0.2)} transform="translate(14 22)" />
			<path d={arm(-1)} fill={alpha(N, 0.2)} transform="translate(14 22)" />
			<path d={arm(-1)} fill={`url(#tw${id})`} {...LINE} strokeWidth={2.5} />
			<path d={arm(1)} fill={`url(#tw${id})`} {...LINE} strokeWidth={2.5} />
			<rect x={600} y={-30} width={60} height={60} rx={18} fill={mix(LPI.sky, LPI.blue, 0.2)} {...LINE} strokeWidth={2.5} />
			{[300, 360, 420].map((xx) => (
				<path key={xx} d={`M${xx} -22 L${xx} 22`} stroke={alpha(N, 0.25)} strokeWidth={3} />
			))}
			{tint > 0 ? <ellipse cx={80} cy={0} rx={110} ry={40} fill={alpha(LPI.blue, 0.25 * cl(tint))} /> : null}
		</g>
	);
};

/** Flèche pointillée qui montre le sens de sortie (dans l'axe de l'écharde, vers l'extérieur). */
export const PullArrowG: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	const p = splinterAt(-SPLINTER.outLen - 30);
	const q = splinterAt(-SPLINTER.outLen - 260);
	const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
	return (
		<g opacity={cl(on * 2)}>
			<line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={LPI.blue} strokeWidth={10} strokeDasharray="22 14" strokeDashoffset={frame * 3} strokeLinecap="round" />
			<path d="M0 -26 L40 0 L0 26 Z" fill={LPI.blue} transform={`translate(${q.x} ${q.y}) rotate(${ang})`} />
		</g>
	);
};

/** Petite écharde sous la peau, en coupe (icône 160 × 110) : la peau, l'écharde cassée en dessous. */
export const DeepSplinterIcon: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={(size * 110) / 160} viewBox="0 0 160 110">
		<rect x={6} y={30} width={148} height={74} rx={14} fill={mix(LPI.paper, LPI.pink, 0.4)} stroke={N} strokeWidth={4} />
		<rect x={6} y={30} width={148} height={20} rx={8} fill={mix(LPI.paper, LPI.pink, 0.15)} stroke={N} strokeWidth={3} />
		<path d="M40 66 L118 84 L116 92 L38 74 Z" fill={WOOD} stroke={N} strokeWidth={3} />
		<path d="M82 20 l10 -10 M96 22 l14 -8" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" />
	</svg>
);
