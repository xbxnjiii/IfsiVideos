// Briques « cancer de l'estomac » (vidéo n° 55). Mise en situation réaliste (vraies couleurs) : l'assiette du repas
// (viande, haricots verts, purée) et le sachet de pansement gastrique. Explications aux couleurs de la marque : la
// bactérie Helicobacter pylori (spirale à flagelles), pictos des signes (vite rassasié, vomissements, selles noires), du
// sel et de la bactérie.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** L'assiette du repas vue en plongée (repère libre, centrée en (0, 0), largeur ≈ 2 × `r`), vraies couleurs. */
export const DinnerPlate: React.FC<{r?: number; eaten?: number}> = ({r = 200, eaten = 0}) => {
	const k = r / 200;
	return (
		<g transform={`scale(${k})`}>
			<ellipse cx={8} cy={14} rx={206} ry={62} fill="#5E5048" opacity={0.25} />
			<ellipse cx={0} cy={0} rx={200} ry={58} fill="#FBFBF8" stroke="#D6D2CA" strokeWidth={3} />
			<ellipse cx={0} cy={2} rx={150} ry={40} fill="#F1EEE8" />
			{/* purée */}
			<path d="M-120 4 Q-118 -26 -82 -28 Q-46 -30 -40 0 Q-46 22 -82 22 Q-118 22 -120 4 Z" fill="#F2DFA6" stroke="#D9C17F" strokeWidth={2} />
			<path d="M-104 -8 Q-90 -16 -70 -10" fill="none" stroke="#E2C978" strokeWidth={3} />
			{/* viande */}
			<path d="M-30 -10 Q-26 -32 20 -30 Q60 -28 62 -6 Q60 18 16 20 Q-26 20 -30 -10 Z" fill="#8A4A2E" stroke="#5E2F1A" strokeWidth={2} />
			<path d="M-14 -16 Q14 -22 44 -14 M-10 0 Q18 -6 48 2" fill="none" stroke="#6B3820" strokeWidth={3} opacity={0.7} />
			{/* haricots verts */}
			{[0, 1, 2, 3, 4].map((i) => (
				<path key={i} d={`M${74 + i * 6} ${-20 + i * 9} q24 -6 46 4`} fill="none" stroke={i % 2 ? '#4E8A3A' : '#5FA046'} strokeWidth={7} strokeLinecap="round" opacity={1 - eaten * 0.2} />
			))}
		</g>
	);
};

/** Le sachet de pansement gastrique (vraies couleurs : blanc et vert), largeur `w`. */
export const GelSachet: React.FC<{w?: number}> = ({w = 120}) => (
	<svg width={w} height={w * 1.3} viewBox="0 0 100 130">
		<path d="M10 8 L90 8 L90 122 L10 122 Z" fill="#F7F8F6" stroke="#B9BDB7" strokeWidth={3} />
		<path d="M10 8 L90 8 L90 22 L10 22 Z" fill="#E1E4DF" />
		{[16, 30, 44, 58, 72].map((x) => (
			<line key={x} x1={x} y1={8} x2={x + 4} y2={22} stroke="#C9CDC6" strokeWidth={2} />
		))}
		<rect x={18} y={44} width={64} height={30} rx={6} fill="#3E9A6B" />
		<rect x={18} y={82} width={44} height={8} rx={4} fill="#9FC9B1" />
		<rect x={18} y={96} width={56} height={8} rx={4} fill="#9FC9B1" />
	</svg>
);

/** La bactérie Helicobacter pylori (couleurs de la marque) : corps en spirale, flagelles qui ondulent ; `angle`. */
export const Bacterium: React.FC<{x: number; y: number; s?: number; angle?: number; o?: number}> = ({x, y, s = 1, angle = 0, o = 1}) => {
	const frame = useCurrentFrame();
	const w = Math.sin(frame / 4 + x) * 4;
	if (o <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={o}>
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M-26 ${-4 + i * 4} q-10 ${w} -18 ${-w * 0.5} q-8 ${-w} -16 ${w * 0.4}`} fill="none" stroke={N} strokeWidth={2} strokeLinecap="round" />
			))}
			<path d="M-26 0 Q-18 -14 -8 0 Q2 14 12 0 Q22 -14 30 0" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" />
			<path d="M-26 0 Q-18 -14 -8 0 Q2 14 12 0 Q22 -14 30 0" fill="none" stroke={LPI.blue} strokeWidth={9} strokeLinecap="round" />
			<circle cx={26} cy={-2} r={2.5} fill={LPI.paper} />
		</g>
	);
};

/** Éclairs de douleur (repère libre, centrés en (x, y)), qui clignotent ; `k` 0 → 1. */
export const PainBolts: React.FC<{x: number; y: number; k?: number; s?: number}> = ({x, y, k = 1, s = 1}) => {
	const frame = useCurrentFrame();
	if (k <= 0) return null;
	const f = 0.6 + 0.4 * Math.sin(frame / 3);
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={k * f}>
			{[-60, 0, 60].map((dx, i) => (
				<path key={i} d={`M${dx - 8} ${-40 + (i % 2) * 10} l14 22 l-12 6 l18 30`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
			))}
		</g>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
/** Un estomac (repère 100 × 100). */
const StomachShape: React.FC<{fill?: string}> = ({fill = LPI.paper}) => (
	<path d="M40 6 L40 24 Q40 40 30 50 Q18 64 26 80 Q38 96 62 90 Q88 82 90 56 Q92 30 70 24 Q56 22 54 30 L52 6" fill={fill} {...SW} />
);

/** Se sentir vite rassasié : l'estomac déjà plein. */
export const FullIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<StomachShape />
		<path d="M28 58 Q50 50 88 50 Q88 80 62 88 Q36 94 28 74 Z" fill={LPI.pink} opacity={0.8} />
		<StomachShape fill="none" />
		<path d="M70 8 L70 18 M64 13 L76 13" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** Des vomissements : un visage et un jet. */
export const VomitIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={36} cy={42} r={28} fill={LPI.paper} {...SW} />
		<path d="M24 34 l8 4 M48 34 l-8 4" {...SW} strokeWidth={4} />
		<ellipse cx={40} cy={56} rx={8} ry={6} fill={N} />
		<path d="M46 58 Q70 60 72 78 Q74 92 88 92" fill="none" stroke={LPI.sky} strokeWidth={9} strokeLinecap="round" />
		<circle cx={82} cy={74} r={4} fill={LPI.sky} />
	</svg>
);

/** Des selles noires. */
export const BlackStoolIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<ellipse cx={50} cy={72} rx={34} ry={18} fill={N} stroke={N} strokeWidth={4} />
		<ellipse cx={50} cy={52} rx={24} ry={14} fill={N} stroke={LPI.paper} strokeWidth={2} />
		<ellipse cx={50} cy={36} rx={12} ry={9} fill={N} stroke={LPI.paper} strokeWidth={2} />
		<path d="M38 66 Q50 60 62 66" fill="none" stroke={alpha(LPI.paper, 0.5)} strokeWidth={3} />
	</svg>
);

/** La bactérie (picto). */
export const BacteriumIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M16 50 Q28 26 40 50 Q52 74 64 50 Q76 26 86 50" fill="none" stroke={N} strokeWidth={18} strokeLinecap="round" />
		<path d="M16 50 Q28 26 40 50 Q52 74 64 50 Q76 26 86 50" fill="none" stroke={LPI.blue} strokeWidth={11} strokeLinecap="round" />
		<path d="M14 50 q-6 -10 -10 -4 M14 52 q-6 8 -10 14" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" />
	</svg>
);

/** Une alimentation trop salée : la salière. */
export const SaltIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M34 30 Q34 14 50 14 Q66 14 66 30 L70 86 Q70 92 64 92 L36 92 Q30 92 30 86 Z" fill={LPI.paper} {...SW} />
		<path d="M34 30 L66 30" {...SW} />
		{[[44, 22], [56, 22], [50, 18]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={2.5} fill={N} />
		))}
		{[[22, 10], [80, 14], [16, 26], [86, 30]].map(([x, y], i) => (
			<rect key={i} x={x} y={y} width={5} height={5} fill={LPI.blue} transform={`rotate(20 ${x} ${y})`} />
		))}
	</svg>
);
