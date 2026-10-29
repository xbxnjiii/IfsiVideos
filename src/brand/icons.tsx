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
/** maux de tête : tête + éclairs aux tempes */
export const HeadacheIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="50" cy="56" r="28" />
		<path d="M40 52 L46 54 M60 52 L54 54 M42 70 Q50 64 58 70" />
		<path d="M14 30 L22 20 L22 30 L30 20 M86 30 L78 20 L78 30 L70 20" stroke={LPI.pink} strokeWidth={8} />
	</Ico>
);
/** bourdonnements d'oreilles : oreille + ondes */
export const EarIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M30 40 C30 22 44 12 58 14 C72 16 80 28 78 42 C76 54 64 58 62 68 C60 80 50 88 40 84" />
		<path d="M46 42 C46 34 54 30 60 34 C64 38 62 44 58 48" />
		<path d="M14 38 Q8 50 14 62 M22 44 Q19 50 22 56" stroke={LPI.pink} strokeWidth={7} />
	</Ico>
);
/** vertiges / tête qui tourne : spirale */
export const DizzyIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a26 26 0 1 1 26 26" />
		<path d="M82 18 L85 25 L92 28 L85 31 L82 38 L79 31 L72 28 L79 25 Z" fill={alpha(LPI.pink, 0.8)} strokeWidth={4} />
	</Ico>
);
/** malaise : visage, yeux fermés, gouttes */
export const FaintIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="50" cy="54" r="32" fill={alpha(LPI.sky, 0.6)} />
		<path d="M34 48 Q40 54 46 48 M54 48 Q60 54 66 48 M42 70 H58" />
		<path d="M84 14 C84 14 92 24 92 29 A8 8 0 0 1 76 29 C76 24 84 14 84 14 Z" fill={alpha(LPI.sky, 0.9)} strokeWidth={4} />
	</Ico>
);
/** soif : verre d'eau */
export const ThirstIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M26 16 H74 L66 88 H34 Z" />
		<path d="M30 46 H70 L66 84 H34 Z" fill={alpha(LPI.sky, 0.9)} stroke="none" />
		<path d="M26 16 H74 L66 88 H34 Z" />
	</Ico>
);
/** urines abondantes : goutte + flèches */
export const UrineIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M40 20 C40 20 62 46 62 60 A22 22 0 0 1 18 60 C18 46 40 20 40 20 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M78 24 V62 M68 52 L78 64 L88 52 M78 76 V88" />
	</Ico>
);
/** fatigue : pile presque vide */
export const TiredIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<rect x="14" y="30" width="64" height="40" rx="8" />
		<path d="M86 42 V58" />
		<rect x="22" y="38" width="14" height="24" rx="3" fill={alpha(LPI.pink, 0.9)} stroke="none" />
	</Ico>
);
/** tremblements : main + traits qui vibrent */
export const TremorIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M38 88 V48 M38 52 V24 M50 50 V18 M62 52 V24 M74 56 V36 M38 60 C30 52 22 56 26 64 L38 82 M38 88 H70 C74 80 74 70 74 56" />
		<path d="M12 30 L18 36 L12 42 M88 20 L82 26 L88 32" stroke={LPI.pink} strokeWidth={6} />
	</Ico>
);
/** faim : assiette + couverts */
export const HungerIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="52" cy="54" r="24" />
		<circle cx="52" cy="54" r="12" fill={alpha(LPI.sky, 0.9)} />
		<path d="M14 20 V40 C14 46 22 46 22 40 V20 M18 44 V88 M86 20 C78 26 78 44 86 50 V88" />
	</Ico>
);
/** hypertension : manomètre aiguille dans le rouge */
export const HypertensionIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M14 66 A36 36 0 0 1 86 66" />
		<path d="M66 40 A36 36 0 0 1 86 66" stroke={LPI.pink} strokeWidth={9} />
		<path d="M50 66 L72 40" />
		<circle cx="50" cy="66" r="6" fill={LPI.blue} />
	</Ico>
);
/** tabac : cigarette qui fume */
export const CigaretteIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<rect x="10" y="58" width="70" height="16" rx="4" />
		<path d="M64 58 V74" />
		<rect x="66" y="60" width="12" height="12" fill={alpha(LPI.pink, 0.9)} stroke="none" />
		<path d="M84 48 C78 40 90 32 84 22 M92 50 C88 44 96 38 92 30" stroke={alpha(LPI.navy, 0.6)} strokeWidth={5} />
	</Ico>
);
/** diabète : goutte + morceau de sucre */
export const DiabetesIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M38 14 C38 14 60 40 60 54 A22 22 0 0 1 16 54 C16 40 38 14 38 14 Z" fill={alpha(LPI.pink, 0.8)} />
		<rect x="58" y="56" width="28" height="28" rx="6" fill={LPI.paper} />
	</Ico>
);
/** cholestérol : artère avec une plaque qui la rétrécit */
export const CholesterolIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M8 32 H92 M8 72 H92" />
		<path d="M34 32 C40 46 62 46 68 32 Z" fill={alpha(LPI.pink, 0.9)} />
		<path d="M30 72 C38 60 58 60 64 72 Z" fill={alpha(LPI.pink, 0.9)} />
	</Ico>
);
/** troubles du rythme : tracé irrégulier */
export const ArrhythmiaIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M6 56 H20 L26 40 L32 70 L38 56 H46 L50 28 L56 80 L62 56 H70 L74 46 L78 62 L82 56 H94" />
	</Ico>
);
