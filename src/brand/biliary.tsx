// Briques « cancer des voies biliaires » (vidéo n° 60). Pictos aux couleurs de la marque : un canal biliaire, la
// vésicule, les calculs, des selles claires, des griffures (la peau qui gratte).
import React from 'react';
import {LPI} from './theme';

const N = LPI.navy;
type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Les canaux biliaires : un arbre de petits canaux qui se rejoignent. */
export const DuctIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 40 Q14 14 44 14 Q78 12 90 22 Q94 30 80 38 Q60 48 50 60 Q40 74 26 70 Q12 64 14 40 Z" fill={LPI.pink} {...SW} />
		<path d="M30 30 Q40 40 46 52 M64 26 Q56 40 48 52 M46 52 L46 92" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/** La vésicule biliaire (poire verte). */
export const GallbladderIcon: React.FC<IP & {tumor?: boolean}> = ({size = 100, tumor = false}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M70 14 Q86 16 80 30 Q74 40 70 52 Q66 86 40 88 Q14 88 16 62 Q18 42 44 36 Q58 32 62 22 Q64 14 70 14 Z" fill={LPI.sky} {...SW} />
		{tumor ? [[36, 64], [44, 58], [30, 72], [42, 72], [50, 66]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={LPI.pink} stroke={N} strokeWidth={2.5} />) : null}
	</svg>
);

/** Des calculs biliaires dans la vésicule. */
export const GallstoneIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M70 14 Q86 16 80 30 Q74 40 70 52 Q66 86 40 88 Q14 88 16 62 Q18 42 44 36 Q58 32 62 22 Q64 14 70 14 Z" fill={LPI.sky} {...SW} />
		{[[34, 64, 9], [52, 62, 7], [42, 76, 7], [28, 76, 5]].map(([x, y, r], i) => (
			<circle key={i} cx={x} cy={y} r={r} fill={LPI.paper} stroke={N} strokeWidth={3} />
		))}
	</svg>
);

/** Des selles claires (décolorées). */
export const PaleStoolIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<ellipse cx={50} cy={74} rx={34} ry={16} fill={LPI.paper} {...SW} />
		<ellipse cx={50} cy={54} rx={24} ry={13} fill={LPI.paper} {...SW} />
		<ellipse cx={50} cy={38} rx={13} ry={9} fill={LPI.paper} {...SW} />
		<path d="M78 14 l8 -6 M84 24 l10 0 M74 8 l0 -6" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Des griffures sur la peau (vraies couleurs : peau chair, traits rouges), centrées en (x, y) ; `k` 0 → 1. */
export const ScratchMarks: React.FC<{x: number; y: number; k: number; s?: number}> = ({x, y, k, s = 1}) => {
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, k * 1.5)}>
			{[-24, 0, 24].map((d, i) => {
				const len = 110 * Math.min(1, Math.max(0, k * 3 - i * 0.5));
				return <path key={i} d={`M${d - 30} -50 l${(len * 0.55).toFixed(1)} ${len.toFixed(1)}`} stroke="#D8504F" strokeWidth={9} strokeLinecap="round" opacity={0.75} />;
			})}
		</g>
	);
};
