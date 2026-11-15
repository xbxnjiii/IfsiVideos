// Briques « cancer de l'anus » (vidéo n° 59). Mise en situation réaliste (vraies couleurs) : le rouleau de papier toilette
// sur le mur carrelé, la feuille tirée et la petite tache de sang. Explications aux couleurs de la marque : le
// papillomavirus (HPV), les cellules de la paroi qu'il abîme, pictos (sang sur le papier, démangeaisons, écoulement,
// défenses affaiblies, partenaires, intestin enflammé, toucher rectal, anuscopie, prélèvement, sphincter gardé, vaccin).
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/**
 * Le rouleau de papier toilette en très gros plan (repère 1080 × 1920, vraies couleurs) : mur carrelé, dérouleur chromé,
 * le rouleau, la feuille tirée (`pull` 0 → 1) et la tache de sang qui apparaît dessus (`blood` 0 → 1).
 */
export const ToiletPaperWall: React.FC<{pull?: number; blood?: number}> = ({pull = 0, blood = 0}) => {
	const cx = 540;
	const cy = 760;
	const R = 260;
	const sheet = 380 + 520 * pull;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<pattern id="tp-tiles" width={180} height={180} patternUnits="userSpaceOnUse">
					<rect width={180} height={180} fill="#EEF2F4" />
					<rect width={180} height={5} fill="#D3DBE0" />
					<rect width={5} height={180} fill="#D3DBE0" />
				</pattern>
				<radialGradient id="tp-roll" cx="0.4" cy="0.35" r="0.7">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="0.75" stopColor="#F1EEE8" />
					<stop offset="1" stopColor="#D9D3C8" />
				</radialGradient>
				<linearGradient id="tp-chrome" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#F4F6F8" />
					<stop offset="0.5" stopColor="#AEB7BF" />
					<stop offset="1" stopColor="#E3E7EA" />
				</linearGradient>
				<linearGradient id="tp-sheet" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#E9E5DE" />
					<stop offset="0.15" stopColor="#FBFAF7" />
					<stop offset="0.85" stopColor="#FBFAF7" />
					<stop offset="1" stopColor="#E9E5DE" />
				</linearGradient>
				<filter id="tp-soft">
					<feGaussianBlur stdDeviation="12" />
				</filter>
			</defs>
			<rect width={1080} height={1920} fill="url(#tp-tiles)" />
			{/* ombre portée */}
			<ellipse cx={cx + 30} cy={cy + 40} rx={R + 30} ry={R + 20} fill="#6F7C86" opacity={0.25} filter="url(#tp-soft)" />
			{/* support chromé */}
			<rect x={cx - R - 70} y={cy - 40} width={60} height={80} rx={14} fill="url(#tp-chrome)" stroke="#8E99A3" strokeWidth={3} />
			<rect x={cx + R + 10} y={cy - 40} width={60} height={80} rx={14} fill="url(#tp-chrome)" stroke="#8E99A3" strokeWidth={3} />
			{/* la feuille qui pend, avec ses pointillés */}
			<rect x={cx - R + 30} y={cy} width={2 * R - 60} height={sheet} fill="url(#tp-sheet)" />
			{Array.from({length: 6}).map((_, i) => (
				<line key={i} x1={cx - R + 40} y1={cy + 180 + i * 180} x2={cx + R - 40} y2={cy + 180 + i * 180} stroke="#D8D2C6" strokeWidth={3} strokeDasharray="10 12" opacity={cy + 180 + i * 180 < cy + sheet ? 1 : 0} />
			))}
			<path d={`M${cx - R + 30} ${cy + sheet} l40 -10 l40 12 l40 -8 l40 10 l40 -12 l40 8 l40 -10 l40 12 l40 -8 l40 10 l40 -6 L${cx + R - 30} ${cy + sheet} Z`} fill="#FBFAF7" />
			{/* la tache de sang */}
			{blood > 0 ? (
				<g transform={`translate(${cx + 20} ${cy + sheet - 200})`} opacity={Math.min(1, blood * 1.5)}>
					<ellipse cx={0} cy={0} rx={52 * blood} ry={34 * blood} fill="#B3122E" opacity={0.55} filter="url(#tp-soft)" />
					<path d={`M-34 -4 Q-20 -26 6 -20 Q34 -16 30 6 Q24 26 -4 22 Q-36 18 -34 -4 Z`} fill="#A8102A" opacity={0.75} transform={`scale(${blood})`} />
				</g>
			) : null}
			{/* le rouleau */}
			<circle cx={cx} cy={cy} r={R} fill="url(#tp-roll)" stroke="#CFC8BB" strokeWidth={4} />
			{[0.82, 0.64, 0.46].map((k, i) => (
				<circle key={i} cx={cx} cy={cy} r={R * k} fill="none" stroke="#E6E1D7" strokeWidth={3} />
			))}
			<circle cx={cx} cy={cy} r={R * 0.3} fill="#C9A77C" stroke="#A9865C" strokeWidth={6} />
			<circle cx={cx} cy={cy} r={R * 0.16} fill="url(#tp-chrome)" stroke="#8E99A3" strokeWidth={4} />
		</svg>
	);
};

/** Le papillomavirus (HPV) aux couleurs de la marque : capside ronde à boutons ; `s` taille, `o` opacité. */
export const Hpv: React.FC<{x: number; y: number; s?: number; o?: number; spin?: number}> = ({x, y, s = 1, o = 1, spin = 0}) => {
	const frame = useCurrentFrame();
	if (o <= 0) return null;
	const rot = spin + frame * 0.6;
	return (
		<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`} opacity={o}>
			<circle r={30} fill={LPI.pink} stroke={N} strokeWidth={4} />
			{Array.from({length: 10}).map((_, i) => {
				const a = (i / 10) * Math.PI * 2;
				return <circle key={i} cx={22 * Math.cos(a)} cy={22 * Math.sin(a)} r={6} fill={LPI.paper} stroke={N} strokeWidth={2} />;
			})}
			<circle r={7} fill={LPI.sky} stroke={N} strokeWidth={2} />
		</g>
	);
};

/** Une cellule de la paroi (vue simple, couleurs de la marque) : `sick` 0 → 1 la rend irrégulière et rose. */
export const WallCell: React.FC<{x: number; y: number; r?: number; sick?: number}> = ({x, y, r = 46, sick = 0}) => {
	const pts = Array.from({length: 12}).map((_, i) => {
		const a = (i / 12) * Math.PI * 2;
		const j = 1 + sick * (random(`wc${x}-${y}-${i}`) - 0.5) * 0.45;
		return `${(x + r * j * Math.cos(a)).toFixed(1)},${(y + r * j * Math.sin(a)).toFixed(1)}`;
	});
	const fill = sick > 0.5 ? LPI.pink : LPI.sky;
	return (
		<g>
			<polygon points={pts.join(' ')} fill={fill} stroke={N} strokeWidth={4} strokeLinejoin="round" />
			<circle cx={x + sick * 6} cy={y - sick * 4} r={r * (0.32 + 0.18 * sick)} fill={sick > 0.5 ? LPI.navy : LPI.blue} opacity={0.85} />
		</g>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Le papillomavirus (picto). */
export const HpvIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={34} fill={LPI.pink} {...SW} />
		{Array.from({length: 10}).map((_, i) => {
			const a = (i / 10) * Math.PI * 2;
			return <circle key={i} cx={50 + 24 * Math.cos(a)} cy={50 + 24 * Math.sin(a)} r={7} fill={LPI.paper} stroke={N} strokeWidth={3} />;
		})}
		<text x={50} y={58} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={N}>HPV</text>
	</svg>
);

/** Du sang sur le papier toilette. */
export const BloodPaperIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={22} y={34} width={56} height={58} fill={LPI.paper} {...SW} />
		<path d="M30 70 L70 70" stroke={alpha(N, 0.35)} strokeWidth={3} strokeDasharray="5 5" />
		<circle cx={50} cy={22} r={18} fill={LPI.paper} {...SW} />
		<circle cx={50} cy={22} r={6} fill={LPI.sky} stroke={N} strokeWidth={3} />
		<path d="M44 52 Q50 42 58 50 Q62 58 52 60 Q42 60 44 52 Z" fill={LPI.pink} stroke={N} strokeWidth={3} />
	</svg>
);

/** Des démangeaisons : des traits de grattage. */
export const ItchIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={36} fill={LPI.paper} {...SW} />
		{[-14, 0, 14].map((d) => (
			<path key={d} d={`M${34 + d} 66 L${58 + d} 30`} stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" />
		))}
		<path d="M80 18 l6 -6 M84 26 l8 0 M74 12 l0 -8" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Un écoulement : des gouttes. */
export const DischargeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[[36, 20, 1], [64, 40, 0.8], [40, 62, 0.7]].map(([x, y, k], i) => (
			<path key={i} d={`M${x} ${y} q${14 * k} ${20 * k} ${14 * k} ${30 * k} a${14 * k} ${14 * k} 0 0 1 ${-28 * k} 0 q0 ${-10 * k} ${14 * k} ${-30 * k} z`} fill={i ? LPI.sky : LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
		))}
	</svg>
);

/** Des défenses immunitaires affaiblies : un bouclier fêlé. */
export const ShieldLowIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M50 8 L84 20 Q84 64 50 92 Q16 64 16 20 Z" fill={LPI.sky} {...SW} />
		<path d="M54 14 L44 40 L58 52 L46 78" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M30 48 L70 48" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" opacity={0.0} />
	</svg>
);

/** De nombreux partenaires : plusieurs silhouettes. */
export const PartnersIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[[26, LPI.sky], [50, LPI.pink], [74, LPI.sky]].map(([x, c], i) => (
			<g key={i}>
				<circle cx={x as number} cy={34} r={11} fill={c as string} {...SW} strokeWidth={3.5} />
				<path d={`M${(x as number) - 16} 82 Q${(x as number) - 16} 52 ${x} 52 Q${(x as number) + 16} 52 ${(x as number) + 16} 82 Z`} fill={c as string} {...SW} strokeWidth={3.5} />
			</g>
		))}
	</svg>
);

/** Une maladie inflammatoire de l'intestin : l'intestin et des éclairs. */
export const GutInflamIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M22 84 L22 30 Q22 16 36 16 L64 16 Q78 16 78 30 L78 84" fill="none" stroke={N} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M22 84 L22 30 Q22 16 36 16 L64 16 Q78 16 78 30 L78 84" fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M46 34 l8 10 l-8 4 l10 12" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le toucher rectal : un doigt ganté. */
export const GloveFingerIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M18 84 L18 54 Q18 44 28 44 L60 44 L60 24 Q60 12 70 12 Q80 12 80 24 L80 70 Q80 86 64 86 L18 86 Z" fill={LPI.sky} {...SW} />
		<path d="M30 44 L30 60 M42 44 L42 60" stroke={N} strokeWidth={3} strokeLinecap="round" />
		<path d="M64 24 Q70 20 76 24" stroke={LPI.paper} strokeWidth={4} strokeLinecap="round" fill="none" />
	</svg>
);

/** L'anuscopie : un petit tube éclairé. */
export const AnoscopeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 30 L70 30 L64 86 L36 86 Z" fill={LPI.paper} {...SW} />
		<rect x={22} y={22} width={56} height={12} rx={4} fill={LPI.sky} {...SW} />
		<path d="M50 34 L50 82" stroke="#FFE7A0" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
		<path d="M78 14 l8 -8 M84 24 l10 -2" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Une biopsie : une petite pince qui prend un fragment. */
export const ForcepsIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M10 90 L56 44" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<path d="M56 44 Q66 26 80 22 M56 44 Q74 38 78 24" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
		<circle cx={82} cy={20} r={8} fill={LPI.pink} stroke={N} strokeWidth={3} />
	</svg>
);

/** On garde le sphincter : un anneau de muscle et une coche. */
export const SphincterKeepIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={42} cy={46} r={28} fill="none" stroke={LPI.pink} strokeWidth={14} />
		<circle cx={42} cy={46} r={28} fill="none" stroke={N} strokeWidth={3} />
		<circle cx={42} cy={46} r={8} fill={LPI.paper} stroke={N} strokeWidth={3} />
		<circle cx={74} cy={74} r={16} fill={LPI.blue} {...SW} strokeWidth={4} />
		<path d="M66 74 l6 6 l10 -12" fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le vaccin contre le papillomavirus. */
export const HpvVaccineIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<g transform="rotate(-45 46 46)">
			<rect x={26} y={34} width={44} height={24} rx={4} fill={LPI.sky} {...SW} />
			<rect x={32} y={38} width={22} height={16} fill={LPI.blue} />
			<path d="M70 46 L80 46 M80 36 L80 56 M26 46 L10 46" {...SW} />
		</g>
		<g transform="translate(74 74) scale(0.42)">
			<circle r={34} fill={LPI.pink} stroke={N} strokeWidth={8} />
			{Array.from({length: 8}).map((_, i) => {
				const a = (i / 8) * Math.PI * 2;
				return <circle key={i} cx={22 * Math.cos(a)} cy={22 * Math.sin(a)} r={8} fill={LPI.paper} stroke={N} strokeWidth={4} />;
			})}
		</g>
	</svg>
);

/** Une fille et un garçon (pictos). */
export const GirlBoyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={30} cy={30} r={13} fill={LPI.pink} {...SW} strokeWidth={4} />
		<path d="M30 30 m-14 -2 q4 -16 14 -16 q10 0 14 16" fill="none" stroke={N} strokeWidth={4} />
		<path d="M14 88 L22 50 L38 50 L46 88 Z" fill={LPI.pink} {...SW} strokeWidth={4} />
		<circle cx={70} cy={30} r={13} fill={LPI.sky} {...SW} strokeWidth={4} />
		<path d="M56 88 L56 54 Q56 48 62 48 L78 48 Q84 48 84 54 L84 88 Z" fill={LPI.sky} {...SW} strokeWidth={4} />
	</svg>
);
