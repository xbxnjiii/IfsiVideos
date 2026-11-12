// Balade en forêt, vue de côté, plein écran (repère 1080 × 1920) : ciel clair, rangée d'arbres lointains, grands arbres
// au premier plan (troncs en vrai bois brun comme la planche de l'écharde, feuillage en bleus de la marque), sentier, une
// branche qui passe au-dessus du sentier (la tique tombe d'une de ses feuilles). `drift` fait glisser le décor (parallaxe).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
/** Bois brun (exception à la palette demandée pour le bois : « une vraie planche »). */
const BARK = '#8A5A35';
const BARK_DK = '#5E3B22';
const PATH = '#D9B88F';
const LEAF = [mix(LPI.blue, N, 0.15), LPI.blue, mix(LPI.blue, LPI.sky, 0.45)];

/** Un grand arbre : tronc brun texturé, houppier en grappes de feuillage (bleus de la marque, contours fins). */
const Tree: React.FC<{x: number; ground: number; h: number; w: number; seed: number; far?: boolean}> = ({x, ground, h, w, seed, far}) => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 40 + seed) * 4;
	const blobs = Array.from({length: 7}, (_, i) => {
		const a = (i / 7) * Math.PI * 2 + seed;
		return {cx: x + Math.cos(a) * w * 0.32 + sway, cy: ground - h + Math.sin(a) * w * 0.22, r: w * (0.28 + 0.06 * ((i + seed) % 3))};
	});
	if (far) {
		return (
			<g opacity={0.45}>
				<rect x={x - 10} y={ground - h * 0.6} width={20} height={h * 0.6} fill={mix(BARK, LPI.sky, 0.5)} />
				{blobs.map((b, i) => (
					<circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={mix(LPI.sky, LPI.blue, 0.35)} />
				))}
			</g>
		);
	}
	return (
		<g>
			<path d={`M${x - w * 0.09} ${ground} C${x - w * 0.07} ${ground - h * 0.4} ${x - w * 0.05} ${ground - h * 0.7} ${x - w * 0.04} ${ground - h + 40} L${x + w * 0.04} ${ground - h + 40} C${x + w * 0.05} ${ground - h * 0.7} ${x + w * 0.07} ${ground - h * 0.4} ${x + w * 0.09} ${ground} Z`} fill={BARK} stroke={alpha(N, 0.7)} strokeWidth={4} />
			{[0.2, 0.42, 0.65].map((t, i) => (
				<path key={i} d={`M${x - w * 0.05} ${ground - h * t} q${w * 0.04} -18 ${w * 0.08} -6`} fill="none" stroke={BARK_DK} strokeWidth={4} strokeLinecap="round" />
			))}
			{blobs.map((b, i) => (
				<circle key={i} cx={b.cx + 10} cy={b.cy + 16} r={b.r} fill={alpha(N, 0.18)} />
			))}
			{blobs.map((b, i) => (
				<circle key={`l${i}`} cx={b.cx} cy={b.cy} r={b.r} fill={LEAF[(i + seed) % 3]} stroke={alpha(N, 0.55)} strokeWidth={3} />
			))}
			{blobs.slice(0, 4).map((b, i) => (
				<ellipse key={`h${i}`} cx={b.cx - b.r * 0.3} cy={b.cy - b.r * 0.35} rx={b.r * 0.35} ry={b.r * 0.18} fill={alpha(LPI.paper, 0.35)} />
			))}
		</g>
	);
};

/**
 * Forêt plein écran. `ground` : niveau du sentier ; `branch` : point (x, y) de la feuille d'où tombe la tique (une branche
 * part de l'arbre de droite jusqu'à elle) ; `drift` 0 → 1 : le décor glisse vers la gauche (on avance).
 */
export const ForestBg: React.FC<{ground?: number; branch?: {x: number; y: number}; drift?: number}> = ({ground = 1500, branch = {x: 560, y: 700}, drift = 0}) => {
	const frame = useCurrentFrame();
	const d = drift * 260;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mix(LPI.sky, LPI.paper, 0.2)} />
					<stop offset="1" stopColor={LPI.paper} />
				</linearGradient>
			</defs>
			<rect width={1080} height={1920} fill="url(#fsky)" />
			{/* rayons de lumière entre les arbres */}
			{[200, 520, 840].map((x, i) => (
				<path key={i} d={`M${x} 0 L${x + 140} 0 L${x + 380} ${ground} L${x + 160} ${ground} Z`} fill={alpha(LPI.paper, 0.35 + 0.05 * Math.sin(frame / 20 + i))} />
			))}
			<g transform={`translate(${-d * 0.4} 0)`}>
				{Array.from({length: 9}, (_, i) => (
					<Tree key={i} x={-80 + i * 170} ground={ground - 60} h={700 + (i % 3) * 120} w={300} seed={i} far />
				))}
			</g>
			{/* sol, sentier */}
			<rect x={0} y={ground - 70} width={1080} height={1920 - ground + 70} fill={mix(LPI.sky, LPI.paper, 0.4)} />
			<path d={`M0 ${ground - 30} Q540 ${ground - 60} 1080 ${ground - 30} L1080 ${ground + 120} Q540 ${ground + 90} 0 ${ground + 120} Z`} fill={PATH} stroke={alpha(N, 0.3)} strokeWidth={3} />
			{Array.from({length: 14}, (_, i) => (
				<ellipse key={i} cx={((i * 97 - d) % 1200 + 1200) % 1200 - 60} cy={ground + 20 + (i % 3) * 22} rx={10 + (i % 3) * 4} ry={5} fill={alpha(BARK_DK, 0.35)} />
			))}
			<g transform={`translate(${-d} 0)`}>
				<Tree x={-60} ground={ground - 20} h={1200} w={520} seed={2} />
				<Tree x={1180} ground={ground - 20} h={1150} w={520} seed={5} />
				{/* la branche qui passe au-dessus du sentier */}
				<path d={`M1150 ${branch.y - 160} C980 ${branch.y - 120} 760 ${branch.y - 40} ${branch.x + d} ${branch.y - 20}`} fill="none" stroke={BARK} strokeWidth={26} strokeLinecap="round" />
				<path d={`M1150 ${branch.y - 160} C980 ${branch.y - 120} 760 ${branch.y - 40} ${branch.x + d} ${branch.y - 20}`} fill="none" stroke={alpha(N, 0.5)} strokeWidth={30} strokeLinecap="round" opacity={0.25} />
				{[0, 1, 2, 3, 4].map((i) => {
					const lx = branch.x + d + 40 + i * 110;
					const ly = branch.y - 30 - i * 22 + Math.sin(frame / 25 + i) * 4;
					return <path key={i} d={`M${lx} ${ly} q30 -40 70 -10 q-30 40 -70 10 Z`} fill={LEAF[i % 3]} stroke={alpha(N, 0.5)} strokeWidth={3} transform={`rotate(${30 + i * 15} ${lx} ${ly})`} />;
				})}
				<path d={`M${branch.x + d} ${branch.y - 20} q-10 10 -4 20 q24 10 30 -12 q-6 -14 -26 -8 Z`} fill={LEAF[1]} stroke={alpha(N, 0.5)} strokeWidth={3} />
			</g>
		</svg>
	);
};
