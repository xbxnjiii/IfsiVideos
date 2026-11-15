// Briques « cancer de l'œsophage » (vidéo n° 58). Mise en situation réaliste (vraies couleurs) : le verre d'eau, l'assiette
// coupée en tout petits morceaux, le bol de soupe. Explications aux couleurs de la marque : pictos (mal à avaler, douleur
// en avalant, voix enrouée, reflux, fruits et légumes, prothèse, les deux types de cellules), la bouchée qui descend.
import React from 'react';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Verre d'eau (repère libre, posé en (0, 0), hauteur ≈ 200 × `s`, vraies couleurs) : `fill` 0 → 1. */
export const WaterGlassG: React.FC<{fill?: number; s?: number}> = ({fill = 1, s = 1}) => {
	const h = 200;
	const lvl = -10 - (h - 30) * Math.max(0, Math.min(1, fill));
	const xAt = (y: number) => 52 + (-y / h) * 10;
	return (
		<g transform={`scale(${s})`}>
			<ellipse cx={0} cy={2} rx={58} ry={10} fill="#5E5048" opacity={0.18} />
			{fill > 0.01 ? (
				<>
					<path d={`M${-xAt(lvl)} ${lvl} L${xAt(lvl)} ${lvl} L52 -10 L-52 -10 Z`} fill="#CFE6F5" opacity={0.85} />
					<ellipse cx={0} cy={lvl} rx={xAt(lvl)} ry={6} fill="#E6F3FB" />
				</>
			) : null}
			<path d={`M-62 ${-h} L-54 0 L54 0 L62 ${-h}`} fill={alpha('#E8F1F6', 0.35)} stroke="#9FB3C2" strokeWidth={4} strokeLinejoin="round" />
			<ellipse cx={0} cy={-h} rx={62} ry={9} fill="none" stroke="#9FB3C2" strokeWidth={3} />
			<rect x={-54} y={-12} width={108} height={12} fill="#D9E4EA" opacity={0.8} />
			<path d={`M-42 ${-h + 20} L-36 -30`} stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
		</g>
	);
};

/** Assiette vue en plongée (centrée en (0, 0), largeur ≈ 2 × `r`) : la viande coupée en tout petits morceaux, de la purée. */
export const CutPlateG: React.FC<{r?: number}> = ({r = 200}) => {
	const k = r / 200;
	const bits = [[-20, -14], [2, -20], [24, -12], [-8, 4], [14, 2], [36, 6], [-28, 8], [6, 16], [28, 18], [-14, 20]];
	return (
		<g transform={`scale(${k})`}>
			<ellipse cx={8} cy={14} rx={206} ry={62} fill="#5E5048" opacity={0.25} />
			<ellipse cx={0} cy={0} rx={200} ry={58} fill="#FBFBF8" stroke="#D6D2CA" strokeWidth={3} />
			<ellipse cx={0} cy={2} rx={150} ry={40} fill="#F1EEE8" />
			<path d="M-120 4 Q-118 -26 -82 -28 Q-46 -30 -40 0 Q-46 22 -82 22 Q-118 22 -120 4 Z" fill="#F2DFA6" stroke="#D9C17F" strokeWidth={2} />
			{bits.map(([x, y], i) => (
				<rect key={i} x={x - 7} y={y - 5} width={14} height={10} rx={3} fill="#8A4A2E" stroke="#5E2F1A" strokeWidth={1.5} transform={`rotate(${(i * 37) % 60 - 30} ${x} ${y})`} />
			))}
		</g>
	);
};

/** Bol de soupe vu un peu de haut (centré en (0, 0), largeur ≈ 2 × `r`, vraies couleurs), avec la cuillère. */
export const SoupBowlG: React.FC<{r?: number}> = ({r = 160}) => {
	const k = r / 160;
	return (
		<g transform={`scale(${k})`}>
			<ellipse cx={6} cy={70} rx={150} ry={26} fill="#5E5048" opacity={0.22} />
			<path d="M-160 0 Q-150 92 0 96 Q150 92 160 0 Z" fill="#F4F1EA" stroke="#CFC8BB" strokeWidth={4} />
			<ellipse cx={0} cy={0} rx={160} ry={42} fill="#FBFAF6" stroke="#CFC8BB" strokeWidth={4} />
			<ellipse cx={0} cy={4} rx={136} ry={32} fill="#E59A3E" />
			<ellipse cx={-30} cy={-2} rx={40} ry={8} fill="#F3BC6E" opacity={0.8} />
			{[[40, 6], [70, -4], [-60, 10]].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={4} fill="#6E9E4A" />
			))}
			<path d="M60 -6 L170 -70" stroke="#B9C1CB" strokeWidth={12} strokeLinecap="round" />
			<ellipse cx={58} cy={0} rx={22} ry={10} fill="#C9D0D8" transform="rotate(-30 58 0)" />
		</g>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Un cou de profil avec l'œsophage (repère 100 × 100). */
const Throat: React.FC<{fill?: string}> = ({fill = LPI.paper}) => (
	<>
		<path d="M30 6 Q22 20 30 34 Q36 44 34 60 L34 96 L80 96 L80 6 Z" fill={fill} {...SW} />
		<path d="M56 18 L56 92" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
	</>
);

/** Du mal à avaler : la bouchée qui coince dans l'œsophage. */
export const SwallowIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<Throat />
		<circle cx={56} cy={46} r={10} fill="#B9784A" stroke={N} strokeWidth={3} />
		<path d="M42 46 L48 46 M64 46 L70 46" stroke={N} strokeWidth={4} strokeLinecap="round" />
		<path d="M86 30 l0 10 M86 48 l0 2" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** Une douleur en avalant. */
export const PainSwallowIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<Throat />
		<path d="M44 34 l8 8 l-6 4 l10 10" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
		<circle cx={56} cy={70} r={7} fill="#B9784A" stroke={N} strokeWidth={3} />
	</svg>
);

/** Une voix enrouée : une bouche et des ondes cassées. */
export const HoarseIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M10 30 Q10 14 30 14 Q50 14 50 32 L50 60 Q50 74 36 74 L30 74 L30 88 L16 74 Q10 70 10 60 Z" fill={LPI.paper} {...SW} />
		<ellipse cx={30} cy={46} rx={10} ry={7} fill={LPI.pink} stroke={N} strokeWidth={3} />
		<path d="M60 34 l8 6 l-6 6 l8 6 M74 26 l10 8 l-8 8 l10 8 l-8 8" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le reflux : l'acide de l'estomac qui remonte dans l'œsophage. */
export const RefluxIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M40 4 L40 30 Q40 40 30 50 Q18 64 26 80 Q38 96 62 90 Q88 82 90 56 Q92 30 70 26 Q58 24 54 32 L54 4" fill={LPI.paper} {...SW} />
		<path d="M32 70 Q50 60 82 62 Q80 84 60 88 Q38 90 32 70 Z" fill={LPI.pink} opacity={0.85} />
		<path d="M47 52 L47 14 M40 22 L47 12 L54 22" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Des fruits et des légumes (une pomme et une carotte). */
export const FruitVegIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 34 Q14 34 14 54 Q14 80 30 84 Q36 86 40 82 Q44 86 50 84 Q66 80 66 54 Q66 34 50 34 Q44 34 40 38 Q36 34 30 34 Z" fill={LPI.pink} {...SW} />
		<path d="M40 36 Q40 24 48 18" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
		<path d="M72 30 L92 86 L78 90 Z" fill={LPI.sky} {...SW} />
		<path d="M74 30 Q70 18 66 14 M76 30 Q78 16 84 12" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** La prothèse : un petit tube grillagé qui garde l'œsophage ouvert. */
export const StentIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 8 L30 92 M70 8 L70 92" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
		<rect x={38} y={14} width={24} height={72} rx={8} fill={LPI.sky} {...SW} />
		{[24, 38, 52, 66].map((y) => (
			<path key={y} d={`M40 ${y} L60 ${y + 12} M60 ${y} L40 ${y + 12}`} stroke={N} strokeWidth={2.5} />
		))}
	</svg>
);

/** Le carcinome épidermoïde : des cellules plates, empilées comme des pavés. */
export const SquamousIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[0, 1, 2].map((row) =>
			[0, 1, 2].map((col) => (
				<g key={`${row}-${col}`}>
					<rect x={10 + col * 27 + (row % 2) * 6} y={14 + row * 25} width={24} height={21} rx={7} fill={LPI.pink} stroke={N} strokeWidth={3} />
					<circle cx={22 + col * 27 + (row % 2) * 6} cy={24 + row * 25} r={4} fill={N} />
				</g>
			)),
		)}
	</svg>
);

/** L'adénocarcinome : des cellules de glande, en cercle autour d'un petit canal. */
export const GlandIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{Array.from({length: 8}).map((_, i) => {
			const a = (i / 8) * Math.PI * 2;
			return <ellipse key={i} cx={50 + 30 * Math.cos(a)} cy={50 + 30 * Math.sin(a)} rx={13} ry={10} transform={`rotate(${(a * 180) / Math.PI} ${50 + 30 * Math.cos(a)} ${50 + 30 * Math.sin(a)})`} fill={LPI.sky} stroke={N} strokeWidth={3} />;
		})}
		<circle cx={50} cy={50} r={11} fill={LPI.paper} stroke={N} strokeWidth={3} />
	</svg>
);
