// Petites icônes « ligne » (100 × 100, trait bleu nuit) pour les pastilles de causes / situations.
import React from 'react';
import {alpha, LPI} from './theme';

const N = LPI.navy;

type IP = {size?: number; color?: string};
const Ico: React.FC<IP & {children: React.ReactNode}> = ({size = 64, color = N, children}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);
/** effort : silhouette qui court */
export const RunIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="60" cy="18" r="9" />
		<path d="M54 32 L42 56 L60 64 L54 88 M42 56 L24 50 M52 36 L72 46 L84 40 M44 60 L28 82" />
	</Ico>
);
/** fièvre : thermomètre */
export const FeverIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M42 62 V20 A8 8 0 0 1 58 20 V62 A16 16 0 1 1 42 62 Z" />
		<path d="M50 70 V36" stroke={LPI.pink} strokeWidth={9} />
	</Ico>
);
/** stress : éclair */
export const StressIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M56 8 L26 56 H48 L40 92 L74 40 H52 Z" fill={alpha(LPI.pink, 0.6)} />
	</Ico>
);
/** douleur : étincelle « aïe » */
export const PainIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 10 L58 38 L88 30 L66 52 L86 76 L56 66 L50 92 L42 66 L14 76 L34 52 L12 30 L42 38 Z" fill={alpha(LPI.pink, 0.6)} />
	</Ico>
);
/** sportif : médaille */
export const MedalIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M34 10 L46 44 M66 10 L54 44" />
		<circle cx="50" cy="64" r="22" fill={alpha(LPI.sky, 0.9)} />
		<path d="M50 54 V74 M44 58 L50 54" />
	</Ico>
);
/** sommeil : lune */
export const MoonIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M64 14 A36 36 0 1 0 86 64 A28 28 0 0 1 64 14 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M30 22 H42 L30 34 H42" strokeWidth={5} />
	</Ico>
);

/** médicament : gélule */
export const PillIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<g transform="rotate(-35 50 50)">
			<rect x="18" y="34" width="64" height="32" rx="16" />
			<path d="M50 34 V66" />
			<path d="M50 36 H66 A14 14 0 0 1 66 64 H50 Z" fill={alpha(LPI.pink, 0.6)} />
		</g>
	</Ico>
);
/** anxiété : visage inquiet */
export const AnxietyIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="50" cy="52" r="34" fill={alpha(LPI.sky, 0.7)} />
		<path d="M36 44 L42 40 M64 44 L58 40 M36 70 Q50 60 64 70" />
		<path d="M80 18 Q86 28 80 34" stroke={LPI.blue} />
	</Ico>
);
/** œil (observer discrètement) */
export const EyeIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M8 50 Q50 12 92 50 Q50 88 8 50 Z" fill={alpha(LPI.sky, 0.7)} />
		<circle cx="50" cy="50" r="14" fill={N} />
	</Ico>
);
/** sueurs : gouttes */
export const SweatIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M34 18 C34 18 52 40 52 52 A18 18 0 0 1 16 52 C16 40 34 18 34 18 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M70 44 C70 44 84 60 84 69 A14 14 0 0 1 56 69 C56 60 70 44 70 44 Z" fill={alpha(LPI.sky, 0.9)} />
	</Ico>
);
/** visage rouge (joues roses) */
export const FlushIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="50" cy="52" r="34" />
		<circle cx="34" cy="60" r="8" fill={alpha(LPI.pink, 0.9)} stroke="none" />
		<circle cx="66" cy="60" r="8" fill={alpha(LPI.pink, 0.9)} stroke="none" />
		<path d="M38 44 V46 M62 44 V46 M42 70 Q50 76 58 70" />
	</Ico>
);
/** visage pâle (peau froide) */
export const PaleIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="50" cy="52" r="34" fill={alpha(LPI.sky, 0.8)} />
		<path d="M38 44 V46 M62 44 V46 M40 70 L46 66 L52 70 L58 66 L62 70" />
	</Ico>
);
/** frissons / grelotte : flocon */
export const ShiverIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		{[0, 60, 120].map((r) => (
			<g key={r} transform={`rotate(${r} 50 50)`}>
				<path d="M50 14 V86 M40 24 L50 34 L60 24 M40 76 L50 66 L60 76" />
			</g>
		))}
	</Ico>
);
