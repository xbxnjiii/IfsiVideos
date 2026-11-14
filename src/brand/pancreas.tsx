// Briques « cancer du pancréas » (vidéo n° 54). Calques à poser sur le schéma fourni (tumeur de la tête du pancréas,
// prothèse biliaire) et pictos aux couleurs de la marque (œil jaune, douleur du ventre vers le dos, scanner, alcool,
// pancréatite, selles claires).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Tumeur (grappe de cellules rouges, comme celle du schéma fourni), centrée en (x, y), rayon `r`, qui pousse avec
 * `grow` 0 → 1. */
export const TumorBlob: React.FC<{x: number; y: number; r?: number; grow?: number}> = ({x, y, r = 38, grow = 1}) => {
	if (grow <= 0) return null;
	const cells: [number, number, number][] = [
		[0, 0, 0.42], [0.45, -0.25, 0.34], [-0.45, -0.2, 0.34], [0.35, 0.42, 0.33], [-0.38, 0.4, 0.33], [0, -0.55, 0.32], [0.62, 0.15, 0.28], [-0.62, 0.12, 0.28], [0, 0.6, 0.3],
	];
	return (
		<g transform={`translate(${x} ${y}) scale(${grow})`}>
			<circle r={r * 1.05} fill="#7D1F35" opacity={0.25} />
			{cells.map(([dx, dy, k], i) => (
				<g key={i}>
					<circle cx={dx * r} cy={dy * r} r={k * r} fill="#C8344F" stroke="#8E1F36" strokeWidth={1.5} />
					<circle cx={dx * r - k * r * 0.3} cy={dy * r - k * r * 0.3} r={k * r * 0.35} fill="#F08AA0" opacity={0.6} />
				</g>
			))}
		</g>
	);
};

/** Prothèse biliaire (petit tube grillagé) posée le long d'une ligne brisée, qui apparaît avec `k` 0 → 1. */
export const Stent: React.FC<{pts: [number, number][]; k?: number; w?: number}> = ({pts, k = 1, w = 14}) => {
	if (k <= 0) return null;
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
	return (
		<g opacity={k}>
			<path d={d} fill="none" stroke="#5E6B78" strokeWidth={w + 4} strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} fill="none" stroke="#C9D1DA" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} fill="none" stroke="#5E6B78" strokeWidth={w - 2} strokeDasharray="3 5" strokeLinecap="butt" strokeLinejoin="round" />
		</g>
	);
};

/** Des points qui scintillent (insuline), autour de (x, y). */
export const Sparkle: React.FC<{x: number; y: number; from: number; n?: number; spread?: number; color?: string}> = ({x, y, from, n = 8, spread = 120, color = LPI.blue}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const t = (((frame - from) / 40 + i / n) % 1 + 1) % 1;
				const a = (i / n) * Math.PI * 2;
				return <circle key={i} cx={x + Math.cos(a) * spread * (0.3 + 0.7 * t)} cy={y - 40 * t + Math.sin(a) * spread * 0.4} r={9 * (1 - t) + 3} fill={color} stroke={LPI.paper} strokeWidth={2} opacity={1 - t} />;
			})}
		</g>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Un œil dont le blanc est jaune (jaunisse). */
export const JaundiceEyeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M8 50 Q50 12 92 50 Q50 88 8 50 Z" fill="#F2D35B" {...SW} />
		<circle cx={50} cy={50} r={17} fill={LPI.blue} {...SW} strokeWidth={4} />
		<circle cx={50} cy={50} r={7} fill={N} />
		<circle cx={44} cy={44} r={4} fill={LPI.paper} />
	</svg>
);

/** Une douleur au ventre qui part dans le dos : le tronc de profil, une flèche du ventre vers le dos. */
export const BackPainIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 8 Q22 50 30 92 L70 92 Q80 60 72 40 Q70 20 62 8 Z" fill={LPI.paper} {...SW} />
		<path d="M66 54 L38 54" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
		<path d="M46 44 L34 54 L46 64" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M16 40 l8 6 l-6 4 l8 6" fill="none" stroke={LPI.pink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le scanner : l'anneau et la table. */
export const ScannerIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={42} cy={46} r={32} fill={LPI.sky} {...SW} />
		<circle cx={42} cy={46} r={14} fill={LPI.paper} {...SW} strokeWidth={4} />
		<rect x={30} y={42} width={66} height={10} rx={4} fill={LPI.blue} {...SW} strokeWidth={4} />
		<line x1={30} y1={84} x2={92} y2={84} {...SW} />
	</svg>
);

/** L'alcool en excès : un verre de vin et une bouteille. */
export const WineIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 18 L46 18 Q48 46 30 50 Q12 46 14 18 Z" fill={LPI.paper} {...SW} />
		<path d="M16 30 L44 30 Q42 46 30 48 Q18 46 16 30 Z" fill={LPI.pink} />
		<line x1={30} y1={50} x2={30} y2={80} {...SW} />
		<line x1={18} y1={82} x2={42} y2={82} {...SW} />
		<path d="M64 10 L76 10 L76 30 Q88 36 88 50 L88 88 Q88 92 84 92 L56 92 Q52 92 52 88 L52 50 Q52 36 64 30 Z" fill={LPI.blue} {...SW} />
		<rect x={56} y={56} width={28} height={20} rx={3} fill={LPI.paper} />
	</svg>
);

/** La pancréatite : le pancréas enflammé. */
export const InflamIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M10 70 Q8 52 24 48 Q44 44 60 38 Q80 30 90 36 Q94 46 84 52 Q66 60 48 64 Q38 82 22 84 Q10 82 10 70 Z" fill="#F4C44E" {...SW} />
		<path d="M50 30 Q42 22 48 10 Q54 20 58 16 Q62 26 56 32" fill={LPI.pink} {...SW} strokeWidth={3} />
		<path d="M74 26 Q68 20 72 12 Q78 18 80 14 Q84 22 78 28" fill={LPI.pink} {...SW} strokeWidth={3} />
	</svg>
);

/** Urines foncées, selles claires : deux flacons (foncé / clair). */
export const DarkUrineIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M22 30 L26 88 Q26 92 30 92 L58 92 Q62 92 62 88 L66 30 Z" fill="#B97A2A" {...SW} />
		<rect x={18} y={18} width={52} height={14} rx={5} fill={LPI.blue} {...SW} />
		<path d="M30 46 L58 46" stroke={alpha('#FFFFFF', 0.5)} strokeWidth={4} strokeLinecap="round" />
	</svg>
);
