// Briques « cancer colorectal » (vidéo n° 52). Mise en situation réaliste (demandé) : la cuisine le matin (carrelage,
// fenêtre, placards, calendrier mural dont l'année change), le plan de travail en bois avec son tiroir qui s'ouvre et
// garde les lettres, l'enveloppe du dépistage. Explications aux couleurs de la marque : pictos (kit de dépistage,
// viande rouge et charcuterie, transit qui change, mal au ventre), polype.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/** Vraies couleurs de la cuisine (mise en situation réaliste). */
export const KITCHEN = {
	wall: '#F3EDE3',
	tile: '#E7EEF2',
	grout: '#CBD5DC',
	wood: '#B07A4C',
	woodDark: '#8A5A34',
	woodLight: '#C89466',
	top: '#E9E2D6',
	topEdge: '#C9BFAE',
	window: '#DDEBF7',
	frame: '#FFFFFF',
	cabinet: '#F7F4EE',
	cabinetLine: '#D9D1C3',
	handle: '#9AA3AD',
	paper: '#FFFFFF',
	envelope: '#FBFAF6',
	envelopeShade: '#E5E1D8',
	stamp: '#3F7FC4',
	calRed: '#D9534F',
} as const;

/** Repères de la cuisine (pixels, cadre 1080 × 1920). */
export const KIT = {counter: 1300, drawer: {x: 360, y: 1380, w: 360, h: 150}, cal: {x: 790, y: 300}} as const;

/** Enveloppe (repère 260 × 170, vraies couleurs) : `open` 0 → 1 soulève le rabat. */
export const Envelope: React.FC<{width?: number; open?: number}> = ({width = 260, open = 0}) => (
	<svg width={width} height={(width * 170) / 260} viewBox="0 0 260 170" style={{overflow: 'visible'}}>
		<rect x={2} y={2} width={256} height={166} rx={8} fill={KITCHEN.envelope} stroke={KITCHEN.envelopeShade} strokeWidth={3} />
		<path d="M4 164 L130 86 L256 164" fill="none" stroke={KITCHEN.envelopeShade} strokeWidth={3} />
		<path d={`M4 6 L130 ${6 + 84 * (1 - 2 * open)} L256 6`} fill={open > 0.5 ? KITCHEN.envelopeShade : KITCHEN.envelope} stroke={KITCHEN.envelopeShade} strokeWidth={3} strokeLinejoin="round" />
		<rect x={196} y={18} width={44} height={50} rx={3} fill={KITCHEN.stamp} opacity={0.9} />
		<path d="M208 43 L228 43 M218 33 L218 53" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
		<rect x={30} y={110} width={110} height={8} rx={4} fill="#B9C1CB" />
		<rect x={30} y={126} width={80} height={8} rx={4} fill="#B9C1CB" />
	</svg>
);

/**
 * La cuisine, plein cadre 1080 × 1920 (vraies couleurs) : mur, crédence carrelée, fenêtre, placards hauts, calendrier
 * mural (`year`, `flip` 0 → 1 : la page s'envole), puis `children` (le père, derrière le plan de travail), et devant :
 * le plan de travail et son tiroir (`drawer` 0 → 1 ouvert, `inside` : nombre d'enveloppes déjà rangées), `onTop` posé
 * sur le plan de travail.
 */
export const Kitchen: React.FC<{year: string; nextYear?: string; flip?: number; drawer?: number; inside?: number; children?: React.ReactNode; onTop?: React.ReactNode}> = ({
	year,
	nextYear,
	flip = 0,
	drawer = 0,
	inside = 0,
	children,
	onTop,
}) => {
	const frame = useCurrentFrame();
	const C = KIT.counter;
	const d = KIT.drawer;
	const slide = 70 * drawer;
	const {x: cx, y: cy} = KIT.cal;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<pattern id="kt-tiles" width={90} height={60} patternUnits="userSpaceOnUse">
					<rect width={90} height={60} fill={KITCHEN.tile} />
					<rect width={90} height={3} fill={KITCHEN.grout} />
					<rect width={3} height={60} fill={KITCHEN.grout} />
				</pattern>
				<linearGradient id="kt-wood" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={KITCHEN.woodLight} />
					<stop offset="1" stopColor={KITCHEN.wood} />
				</linearGradient>
				<linearGradient id="kt-win" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#FFF6DD" />
					<stop offset="1" stopColor={KITCHEN.window} />
				</linearGradient>
			</defs>
			<rect width={1080} height={1920} fill={KITCHEN.wall} />
			{/* placards hauts */}
			<g>
				<rect x={0} y={0} width={1080} height={210} fill={KITCHEN.cabinet} />
				{[0, 1, 2, 3].map((i) => (
					<g key={i}>
						<rect x={12 + i * 268} y={10} width={256} height={186} rx={6} fill="none" stroke={KITCHEN.cabinetLine} strokeWidth={4} />
						<rect x={128 + i * 268} y={160} width={24} height={8} rx={4} fill={KITCHEN.handle} />
					</g>
				))}
				<rect x={0} y={206} width={1080} height={10} fill={KITCHEN.cabinetLine} />
			</g>
			{/* fenêtre (à gauche) */}
			<g>
				<rect x={40} y={300} width={300} height={380} rx={8} fill="url(#kt-win)" stroke={KITCHEN.frame} strokeWidth={16} />
				<line x1={190} y1={300} x2={190} y2={680} stroke={KITCHEN.frame} strokeWidth={10} />
				<line x1={40} y1={490} x2={340} y2={490} stroke={KITCHEN.frame} strokeWidth={10} />
				<path d="M60 680 Q120 600 180 680 Z" fill="#7FB07A" opacity={0.7} />
			</g>
			{/* calendrier mural : l'année, la page qui s'envole */}
			<g>
				<rect x={cx} y={cy - 18} width={14} height={18} rx={4} fill={KITCHEN.handle} />
				<rect x={cx - 100} y={cy} width={214} height={250} rx={10} fill={KITCHEN.paper} stroke="#D6D0C4" strokeWidth={4} />
				<rect x={cx - 100} y={cy} width={214} height={70} rx={10} fill={KITCHEN.calRed} />
				<text x={cx + 7} y={cy + 47} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill="#FFFFFF">
					{flip > 0.5 && nextYear ? nextYear : year}
				</text>
				{Array.from({length: 20}).map((_, i) => (
					<rect key={i} x={cx - 82 + (i % 5) * 38} y={cy + 92 + Math.floor(i / 5) * 36} width={26} height={22} rx={4} fill="#ECE7DD" />
				))}
				{flip > 0 && flip < 1 ? (
					<g transform={`translate(${cx + 7 + 200 * flip} ${cy + 125 - 260 * flip}) rotate(${-40 * flip})`} opacity={1 - flip}>
						<rect x={-107} y={-125} width={214} height={250} rx={10} fill={KITCHEN.paper} stroke="#D6D0C4" strokeWidth={4} />
						<rect x={-107} y={-125} width={214} height={70} rx={10} fill={KITCHEN.calRed} />
					</g>
				) : null}
			</g>
			{/* crédence */}
			<rect x={0} y={C - 260} width={1080} height={260} fill="url(#kt-tiles)" />
			{children}
			{/* plan de travail + façade en bois */}
			<rect x={0} y={C} width={1080} height={1920 - C} fill="url(#kt-wood)" />
			<rect x={0} y={C - 22} width={1080} height={30} rx={6} fill={KITCHEN.top} />
			<rect x={0} y={C + 4} width={1080} height={8} fill={KITCHEN.topEdge} />
			{[0, 1, 2].map((i) => (
				<rect key={i} x={30 + i * 350} y={C + 50} width={320} height={i === 1 ? 0 : 520} rx={8} fill="none" stroke={KITCHEN.woodDark} strokeWidth={5} opacity={0.6} />
			))}
			{onTop}
			{/* tiroir : intérieur sombre (les lettres déjà rangées), façade qui avance */}
			<g>
				<rect x={d.x} y={d.y} width={d.w} height={d.h} rx={6} fill="#3B2615" />
				{drawer > 0.02
					? Array.from({length: inside}).map((_, i) => (
							<g key={i} transform={`translate(${d.x + 40 + i * 28} ${d.y + 18 + slide * 0.2 - i * 6}) rotate(${-4 + i * 5}) scale(1.05)`}>
								<Envelope width={250} />
							</g>
						))
					: null}
				<rect x={d.x - 10} y={d.y + slide} width={d.w + 20} height={d.h} rx={8} fill="url(#kt-wood)" stroke={KITCHEN.woodDark} strokeWidth={5} />
				<rect x={d.x + d.w / 2 - 50} y={d.y + slide + 60} width={100} height={18} rx={9} fill={KITCHEN.handle} />
			</g>
			{/* soleil du matin qui bouge à peine */}
			<rect width={1080} height={1920} fill="#FFE7B0" opacity={0.06 + 0.02 * Math.sin(frame / 40)} pointerEvents="none" />
		</svg>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Le kit de dépistage à faire chez soi : le tube et sa tige, l'enveloppe retour. */
export const KitIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={8} y={44} width={58} height={44} rx={6} fill={LPI.paper} {...SW} />
		<path d="M8 50 L37 70 L66 50" fill="none" {...SW} strokeWidth={4} />
		<rect x={66} y={18} width={20} height={64} rx={8} fill={LPI.sky} {...SW} />
		<rect x={64} y={10} width={24} height={14} rx={5} fill={LPI.blue} {...SW} />
		<line x1={76} y1={24} x2={76} y2={70} stroke={N} strokeWidth={3} />
		<path d="M71 72 Q76 80 81 72" fill={LPI.pink} {...SW} strokeWidth={3} />
	</svg>
);

/** La viande rouge et la charcuterie : un steak, un saucisson. */
export const MeatIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 40 Q14 18 40 18 Q62 18 64 36 Q66 56 46 62 Q24 66 14 40 Z" fill={LPI.pink} {...SW} />
		<circle cx={40} cy={38} r={8} fill={LPI.paper} {...SW} strokeWidth={4} />
		<rect x={36} y={66} width={56} height={22} rx={11} fill={LPI.pink} {...SW} transform="rotate(-18 64 77)" />
		{[[54, 78], [64, 72], [74, 74], [82, 66]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={2.5} fill={LPI.paper} />
		))}
	</svg>
);

/** Le transit qui change : deux flèches qui partent dans des sens opposés. */
export const TransitIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M16 34 Q40 14 64 34 Q78 46 88 30" fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" />
		<path d="M78 26 L90 28 L86 40" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M84 66 Q60 86 36 66 Q22 54 12 70" fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
		<path d="M22 74 L10 72 L14 60" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Mal au ventre : le ventre et des éclairs de douleur. */
export const BellyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 10 Q18 50 26 90 L74 90 Q82 50 76 10" fill={LPI.paper} {...SW} />
		<circle cx={50} cy={58} r={4} fill={N} />
		<path d="M38 36 l8 8 l-6 4 l10 10 M62 30 l-6 10 l8 2 l-8 12" fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Polype (repère du dessin où il est posé) : petite boule rose sur un pied, qui pousse avec `grow` 0 → 1. */
export const Polyp: React.FC<{x: number; y: number; grow?: number; angle?: number; r?: number}> = ({x, y, grow = 1, angle = -40, r = 16}) => {
	if (grow <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(${angle}) scale(${grow})`}>
			<path d={`M-5 0 Q-4 ${-r * 0.8} -6 ${-r * 1.2} L6 ${-r * 1.2} Q4 ${-r * 0.8} 5 0 Z`} fill="#E07C88" stroke="#B2485A" strokeWidth={1.5} />
			<circle cx={0} cy={-r * 1.6} r={r} fill="#EE8C98" stroke="#B2485A" strokeWidth={2} />
			<circle cx={-r * 0.35} cy={-r * 1.95} r={r * 0.3} fill="#FFFFFF" opacity={0.5} />
		</g>
	);
};

/** Halo autour d'un objet qu'on veut montrer (repère libre). */
export const Glow: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => (
	<circle cx={x} cy={y} r={r} fill={alpha(LPI.sky, 0.35 * o)} />
);
