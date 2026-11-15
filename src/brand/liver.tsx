// Briques « cancer du foie » (vidéo n° 57). Mise en situation réaliste (vraies couleurs) : le soir, la fenêtre de nuit,
// la bouteille et le verre de vin rouge qui se remplit. Explications aux couleurs de la marque : pictos (virus des
// hépatites, foie gras, ventre qui gonfle, douleur sous les côtes à droite, le foie qui repousse, la greffe, la chaleur,
// couper l'arrivée de sang, vaccin, dépistage), nodules de la cirrhose.
import React from 'react';
import {random} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Vraies couleurs du vin et du verre. */
export const WINE = {wine: '#7A1528', wineLight: '#A3263E', glass: '#E8F1F6', glassEdge: '#9FB3C2', bottle: '#2E4A2C', bottleLight: '#4E7048', label: '#F2E6CC'} as const;

/** Verre à pied (repère libre, pied posé en (0, 0), hauteur ≈ 260 × `s`) : `fill` 0 → 1 le vin dans le verre. */
export const WineGlassG: React.FC<{fill?: number; s?: number}> = ({fill = 0, s = 1}) => {
	const top = -250;
	const bowlBottom = -120;
	const lvl = bowlBottom - 92 * Math.max(0, Math.min(1, fill));
	// bol : demi-ellipse ouverte en haut (x ±62 en haut, fond arrondi à y = bowlBottom)
	const bowlX = (y: number) => 62 * Math.sqrt(Math.max(0, 1 - ((y - top) / (bowlBottom - top)) ** 2 * 0.98));
	return (
		<g transform={`scale(${s})`}>
			<ellipse cx={0} cy={0} rx={60} ry={12} fill={alpha(WINE.glassEdge, 0.5)} stroke={WINE.glassEdge} strokeWidth={3} />
			<rect x={-5} y={-122} width={10} height={120} fill={alpha(WINE.glass, 0.8)} stroke={WINE.glassEdge} strokeWidth={2} />
			{fill > 0.01 ? (
				<path
					d={`M${-bowlX(lvl)} ${lvl} L${bowlX(lvl)} ${lvl} Q${bowlX(lvl) * 0.9} ${bowlBottom + 6} 0 ${bowlBottom} Q${-bowlX(lvl) * 0.9} ${bowlBottom + 6} ${-bowlX(lvl)} ${lvl} Z`}
					fill={WINE.wine}
				/>
			) : null}
			{fill > 0.01 ? <ellipse cx={0} cy={lvl} rx={bowlX(lvl)} ry={7} fill={WINE.wineLight} /> : null}
			<path d={`M-62 ${top} Q-66 ${bowlBottom + 10} 0 ${bowlBottom} Q66 ${bowlBottom + 10} 62 ${top}`} fill={alpha(WINE.glass, 0.25)} stroke={WINE.glassEdge} strokeWidth={4} />
			<ellipse cx={0} cy={top} rx={62} ry={9} fill="none" stroke={WINE.glassEdge} strokeWidth={3} />
			<path d={`M-44 ${top + 20} Q-50 ${top + 80} -30 ${bowlBottom - 14}`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
		</g>
	);
};

/** Bouteille de vin rouge (repère libre, posée en (0, 0), hauteur ≈ 420 × `s`) ; `tilt` en degrés (on se sert). */
export const WineBottleG: React.FC<{s?: number; tilt?: number}> = ({s = 1, tilt = 0}) => (
	<g transform={`scale(${s}) rotate(${tilt} 0 -200)`}>
		<path d="M-52 0 L-52 -230 Q-52 -280 -20 -300 L-20 -400 L20 -400 L20 -300 Q52 -280 52 -230 L52 0 Z" fill={WINE.bottle} stroke="#1D301C" strokeWidth={4} />
		<rect x={-22} y={-420} width={44} height={36} rx={4} fill="#8E1B2E" />
		<rect x={-44} y={-190} width={88} height={110} rx={6} fill={WINE.label} />
		<rect x={-30} y={-160} width={60} height={10} rx={5} fill="#8E1B2E" />
		<rect x={-24} y={-130} width={48} height={8} rx={4} fill="#B9A887" />
		<path d="M-36 -240 L-36 -20" stroke={WINE.bottleLight} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
	</g>
);

/** La fenêtre de la cuisine la nuit (même place que dans `Kitchen` : x 40, y 300, 300 × 380) : ciel de nuit, lune. */
export const NightWindow: React.FC = () => (
	<g>
		<defs>
			<linearGradient id="lv-night" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#14213D" />
				<stop offset="1" stopColor="#2C3E66" />
			</linearGradient>
		</defs>
		<rect x={48} y={308} width={284} height={364} fill="url(#lv-night)" />
		<circle cx={270} cy={370} r={30} fill="#F4F1DE" />
		<circle cx={284} cy={362} r={28} fill="#1B2A4A" />
		{[[90, 360], [150, 420], [120, 560], [250, 520], [300, 610], [210, 330]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={3} fill="#FFFFFF" opacity={0.8} />
		))}
		<line x1={190} y1={300} x2={190} y2={680} stroke="#FFFFFF" strokeWidth={10} />
		<line x1={40} y1={490} x2={340} y2={490} stroke="#FFFFFF" strokeWidth={10} />
	</g>
);

/**
 * Les nodules de la cirrhose posés sur un foie (repère libre) : petites bosses claires cernées, cicatrices ; `k` 0 → 1
 * (nombre de nodules qui apparaissent), placés dans le polygone `poly`.
 */
export const Cirrhosis: React.FC<{poly: readonly (readonly [number, number])[]; k: number; seed?: string; r?: number}> = ({poly, k, seed = 'cz', r = 9}) => {
	const pts = React.useMemo(() => {
		const xs = poly.map((p) => p[0]);
		const ys = poly.map((p) => p[1]);
		const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
		const inside = (x: number, y: number) => {
			let c = false;
			for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
				const [xi, yi] = poly[i];
				const [xj, yj] = poly[j];
				if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
			}
			return c;
		};
		const out: [number, number, number][] = [];
		for (let i = 0; out.length < 70 && i < 900; i++) {
			const x = x0 + random(`${seed}x${i}`) * (x1 - x0);
			const y = y0 + random(`${seed}y${i}`) * (y1 - y0);
			if (inside(x, y)) out.push([x, y, random(`${seed}o${i}`)]);
		}
		return out;
	}, [poly, seed]);
	if (k <= 0) return null;
	return (
		<g>
			{pts.map(([x, y, o], i) => {
				const a = Math.max(0, Math.min(1, k * 1.4 - o * 0.4));
				if (a <= 0) return null;
				return (
					<g key={i} opacity={a}>
						<circle cx={x} cy={y} r={r * (0.8 + 0.5 * o)} fill="#C98A6A" opacity={0.55} />
						<circle cx={x} cy={y} r={r * (0.8 + 0.5 * o)} fill="none" stroke="#F3D7A8" strokeWidth={2.2} opacity={0.85} />
						<circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#FFFFFF" opacity={0.35} />
					</g>
				);
			})}
		</g>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Un foie (repère 100 × 100), centré en (x, 50). */
export const LiverShape: React.FC<{x?: number; y?: number; s?: number; fill?: string}> = ({x = 50, y = 50, s = 1, fill = LPI.pink}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M-40 -6 Q-42 -30 -14 -30 Q20 -32 44 -24 Q52 -20 40 -10 Q20 4 -2 14 Q-14 34 -32 30 Q-46 22 -40 -6 Z" fill={fill} {...SW} />
		<path d="M4 -30 Q0 -10 -4 12" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" />
	</g>
);

/** Les virus des hépatites B et C. */
export const VirusIcon: React.FC<IP & {label?: string}> = ({size = 100, label = 'B C'}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
			<g key={a} transform={`rotate(${a} 50 50)`}>
				<line x1={50} y1={14} x2={50} y2={24} stroke={N} strokeWidth={5} strokeLinecap="round" />
				<circle cx={50} cy={11} r={5} fill={LPI.pink} stroke={N} strokeWidth={3} />
			</g>
		))}
		<circle cx={50} cy={50} r={28} fill={LPI.sky} {...SW} />
		<text x={50} y={59} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={24} fill={N}>{label}</text>
	</svg>
);

/** Le gras qui s'accumule dans le foie : le foie avec des gouttes de graisse. */
export const FattyLiverIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<LiverShape y={52} s={1.05} fill={LPI.pink} />
		{[[30, 44, 7], [46, 38, 6], [62, 34, 5], [36, 60, 5], [52, 50, 6]].map(([x, y, r], i) => (
			<circle key={i} cx={x} cy={y} r={r} fill={LPI.paper} stroke={N} strokeWidth={2.5} />
		))}
	</svg>
);

/** Un ventre qui gonfle (ascite). */
export const SwollenBellyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M34 6 L34 30 Q8 50 22 78 Q30 92 50 92 L66 92 L66 6" fill={LPI.paper} {...SW} />
		<path d="M22 50 Q12 64 22 78" fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
		<path d="M80 40 l8 0 M84 36 l0 8 M80 62 l8 0 M84 58 l0 8" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
		<circle cx={46} cy={62} r={3} fill={N} />
	</svg>
);

/** Une douleur à droite, sous les côtes (là où est le foie). */
export const RibPainIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M20 8 Q14 50 20 92 L80 92 Q86 50 80 8" fill={LPI.paper} {...SW} />
		{[24, 36, 48].map((y) => (
			<path key={y} d={`M24 ${y} Q50 ${y + 10} 76 ${y}`} fill="none" stroke={alpha(N, 0.5)} strokeWidth={3} strokeLinecap="round" />
		))}
		<LiverShape x={44} y={64} s={0.45} />
		<path d="M22 58 l8 6 l-6 4 l10 8" fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le foie qui repousse : un foie et une flèche qui tourne. */
export const RegrowIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<LiverShape y={54} s={0.95} />
		<path d="M72 18 Q90 30 84 52" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" />
		<path d="M76 46 l8 8 l6 -10" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** La greffe : un nouveau foie dans une glacière de transport. */
export const TransplantIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={12} y={34} width={76} height={54} rx={8} fill={LPI.sky} {...SW} />
		<rect x={36} y={24} width={28} height={12} rx={4} fill={LPI.paper} {...SW} strokeWidth={4} />
		<path d="M44 62 L56 62 M50 56 L50 68" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" />
		<LiverShape x={50} y={10} s={0.42} />
	</svg>
);

/** Détruire la tumeur par la chaleur : une aiguille et une flamme. */
export const HeatIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<LiverShape y={62} s={0.9} fill={LPI.sky} />
		<line x1={84} y1={10} x2={50} y2={58} stroke={N} strokeWidth={5} strokeLinecap="round" />
		<path d="M50 72 Q38 68 40 56 Q42 48 48 42 Q48 52 54 54 Q56 46 54 40 Q66 50 64 60 Q62 72 50 72 Z" fill={LPI.pink} {...SW} strokeWidth={3} />
	</svg>
);

/** Couper l'arrivée de sang à la tumeur : un vaisseau bouché devant une tumeur. */
export const BloodCutIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={70} cy={50} r={20} fill={LPI.pink} {...SW} />
		{[[64, 44], [76, 46], [70, 58]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={5} fill={LPI.paper} stroke={N} strokeWidth={2} />
		))}
		<path d="M6 50 L46 50" stroke={N} strokeWidth={16} strokeLinecap="round" />
		<path d="M6 50 L46 50" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
		<rect x={36} y={36} width={10} height={28} rx={3} fill={N} />
	</svg>
);

/** Le vaccin contre l'hépatite B. */
export const VaccineIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<g transform="rotate(-45 50 50)">
			<rect x={30} y={38} width={44} height={24} rx={4} fill={LPI.sky} {...SW} />
			<rect x={36} y={42} width={22} height={16} fill={LPI.blue} />
			<path d="M74 50 L84 50 M84 40 L84 60 M30 50 L14 50" {...SW} />
		</g>
		<circle cx={78} cy={78} r={16} fill={LPI.pink} {...SW} strokeWidth={4} />
		<text x={78} y={85} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={20} fill={N}>B</text>
	</svg>
);

/** Le dépistage de l'hépatite C : une goutte de sang et une coche. */
export const ScreenCIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M40 10 Q62 40 62 58 Q62 80 40 80 Q18 80 18 58 Q18 40 40 10 Z" fill={LPI.pink} {...SW} />
		<text x={40} y={66} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={26} fill={N}>C</text>
		<circle cx={76} cy={76} r={16} fill={LPI.blue} {...SW} strokeWidth={4} />
		<path d="M68 76 l6 6 l10 -12" fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Moins d'alcool : un verre et un signe moins. */
export const LessAlcoholIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 12 L60 12 Q62 40 42 48 Q22 40 24 12 Z" fill={LPI.paper} {...SW} />
		<path d="M27 26 L57 26 Q56 40 42 44 Q28 40 27 26 Z" fill={LPI.pink} />
		<path d="M42 48 L42 76 M28 80 L56 80" {...SW} />
		<circle cx={76} cy={70} r={16} fill={LPI.blue} {...SW} strokeWidth={4} />
		<path d="M68 70 L84 70" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** La biopsie : une fine aiguille qui entre dans le foie. */
export const BiopsyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<LiverShape y={60} s={0.95} fill={LPI.sky} />
		<line x1={88} y1={8} x2={46} y2={58} stroke={N} strokeWidth={4} strokeLinecap="round" />
		<rect x={78} y={2} width={16} height={22} rx={4} fill={LPI.paper} {...SW} strokeWidth={3} transform="rotate(40 86 13)" />
		<circle cx={44} cy={60} r={6} fill={LPI.pink} stroke={N} strokeWidth={2.5} />
	</svg>
);
