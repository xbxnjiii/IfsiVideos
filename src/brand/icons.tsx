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
/** cyanose : lèvres bleutées */
export const CyanosisIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M14 52 C26 34 40 34 50 42 C60 34 74 34 86 52 C72 72 28 72 14 52 Z" fill={alpha(LPI.blue, 0.75)} />
		<path d="M16 52 C36 58 64 58 84 52" />
	</Ico>
);
/** alité : lit */
export const BedIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M10 30 V80 M10 64 H90 V80 M10 52 H90" />
		<circle cx="26" cy="44" r="8" fill={alpha(LPI.sky, 0.9)} />
		<path d="M38 52 V40 H84 C88 40 90 44 90 52" fill={alpha(LPI.blue, 0.35)} />
	</Ico>
);
/** en avion */
export const PlaneIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 8 C56 8 58 16 58 24 V40 L90 58 V66 L58 58 V76 L70 86 V92 L50 86 L30 92 V86 L42 76 V58 L10 66 V58 L42 40 V24 C42 16 44 8 50 8 Z" fill={alpha(LPI.sky, 0.9)} />
	</Ico>
);
/** plâtré : jambe dans un plâtre */
export const CastIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M38 8 H58 V60 L78 74 C84 78 82 90 74 90 H40 C36 90 34 86 34 82 Z" fill={alpha(LPI.paper, 1)} />
		<path d="M36 30 H58 M36 46 H58 M40 66 H62" strokeWidth={5} />
	</Ico>
);
/** opération : bistouri */
export const ScalpelIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M14 86 L56 44" strokeWidth={10} />
		<path d="M56 44 C68 30 80 18 90 12 C88 26 78 44 64 54 Z" fill={alpha(LPI.sky, 0.9)} />
	</Ico>
);
/** cancer : ruban */
export const RibbonIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 50 C36 36 34 14 50 12 C66 14 64 36 50 50 Z" fill={alpha(LPI.pink, 0.6)} />
		<path d="M50 50 L28 90 M50 50 L72 90" strokeWidth={9} />
	</Ico>
);
/** mollet gonflé */
export const LegIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M38 6 V40 C24 50 24 70 36 80 L34 92 H64 L60 80 C70 66 68 46 58 38 V6" fill={alpha(LPI.pink, 0.6)} />
	</Ico>
);
/** travail : usine qui rejette des poussières */
export const DustIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M10 88 V52 L32 64 V52 L54 64 V30 H70 V88 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M64 22 C60 14 70 10 68 4" strokeWidth={5} />
		<circle cx="82" cy="22" r="4" fill={N} stroke="none" />
		<circle cx="88" cy="38" r="3" fill={N} stroke="none" />
		<circle cx="78" cy="48" r="3.5" fill={N} stroke="none" />
	</Ico>
);
/** pollution : nuage gris de fumées au-dessus de la ville */
export const SmogIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M22 50 C10 50 10 32 24 32 C26 18 46 16 52 28 C58 20 76 24 74 38 C88 38 88 50 76 50 Z" fill={alpha(N, 0.35)} />
		<path d="M14 90 V68 H30 V90 M38 90 V60 H54 V90 M62 90 V72 H82 V90" fill={alpha(LPI.sky, 0.9)} />
	</Ico>
);
/** toux : bouche ouverte et traits de toux */
export const CoughIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M14 30 C14 14 50 12 52 34 L58 48 L50 52 C52 66 44 72 34 70 L30 86" />
		<path d="M66 40 L84 34 M68 52 L90 52 M66 64 L84 70" stroke={LPI.pink} strokeWidth={8} />
	</Ico>
);
/** crachats (expectorations) */
export const SputumIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 16 C70 16 84 34 80 54 C78 70 64 84 48 82 C30 80 18 66 20 50 C22 32 32 16 50 16 Z" fill={alpha(LPI.blue, 0.45)} />
		<circle cx="40" cy="40" r="7" fill={alpha(LPI.paper, 0.9)} stroke="none" />
	</Ico>
);
/** le matin : soleil qui se lève */
export const SunriseIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M24 70 A26 26 0 0 1 76 70 Z" fill={alpha(LPI.pink, 0.8)} />
		<path d="M10 82 H90 M50 30 V18 M22 44 L14 36 M78 44 L86 36" />
	</Ico>
);
/** vaccin : seringue */
export const SyringeIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M30 70 L70 30 L82 42 L42 82 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M76 24 L90 38 M83 31 L94 20 M30 70 L12 88 M48 52 L56 60 M58 42 L66 50" />
	</Ico>
);
/** inhalateur (bronchodilatateur) */
export const InhalerIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<rect x="30" y="8" width="24" height="44" rx="8" fill={alpha(LPI.sky, 0.9)} />
		<path d="M24 40 H60 V64 H84 V84 H24 Z" fill={alpha(LPI.blue, 0.8)} />
	</Ico>
);
