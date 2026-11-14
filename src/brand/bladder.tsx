// Briques « cancer de la vessie » (vidéo n° 53). Mise en situation réaliste (demandé) : les toilettes vues d'en haut, comme
// on les voit debout (carrelage, réservoir, abattant relevé, cuvette en céramique), l'eau qui se teinte de rouge (du sang
// dans les urines). Explications aux couleurs de la marque : pictos des signes (sang dans les urines, qui disparaît puis
// revient, envies fréquentes, brûlures), des examens (analyse d'urine, cystoscopie), des risques (produits chimiques au
// travail) et des traitements (résection par l'urètre, lavages de la vessie, ablation de la vessie).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Vraies couleurs des toilettes (mise en situation réaliste). */
export const LOO = {
	wall: '#E9EDF1',
	wallTile: '#DDE3E9',
	floor: '#D8D0C4',
	floorGrout: '#BFB5A6',
	ceramic: '#FBFBFA',
	ceramicShade: '#D9DEE3',
	ceramicDeep: '#B9C1CA',
	water: '#CFE3EC',
	waterDeep: '#A9CBDA',
	blood: '#B8323F',
	bloodLight: '#D9606B',
	chrome: '#B9C2CC',
} as const;

/** Centre de l'eau de la cuvette (repère 1080 × 1920). */
export const LOO_WATER = {x: 540, y: 1270} as const;

/**
 * Les toilettes vues d'en haut (repère 1080 × 1920, plein cadre, vraies couleurs) : mur carrelé et réservoir en haut,
 * abattant relevé, cuvette en céramique, eau au fond ; `tint` 0 → 1 : l'eau se teinte de rouge depuis le centre
 * (du sang dans les urines) ; `ripple` : petites ondes à la surface.
 */
export const ToiletTop: React.FC<{tint?: number; ripple?: number}> = ({tint = 0, ripple = 0}) => {
	const frame = useCurrentFrame();
	const W = LOO_WATER;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<pattern id="lo-floor" width={180} height={180} patternUnits="userSpaceOnUse" patternTransform="rotate(45 540 1400)">
					<rect width={180} height={180} fill={LOO.floor} />
					<rect width={180} height={5} fill={LOO.floorGrout} />
					<rect width={5} height={180} fill={LOO.floorGrout} />
				</pattern>
				<pattern id="lo-wall" width={120} height={120} patternUnits="userSpaceOnUse">
					<rect width={120} height={120} fill={LOO.wall} />
					<rect width={120} height={4} fill={LOO.wallTile} />
					<rect width={4} height={120} fill={LOO.wallTile} />
				</pattern>
				<radialGradient id="lo-rim" cx="0.5" cy="0.4" r="0.6">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="0.75" stopColor={LOO.ceramic} />
					<stop offset="1" stopColor={LOO.ceramicShade} />
				</radialGradient>
				<radialGradient id="lo-bowl" cx="0.5" cy="0.62" r="0.62">
					<stop offset="0" stopColor={LOO.ceramicDeep} />
					<stop offset="0.55" stopColor={LOO.ceramicShade} />
					<stop offset="1" stopColor="#F4F6F8" />
				</radialGradient>
				<radialGradient id="lo-water" cx="0.5" cy="0.45" r="0.6">
					<stop offset="0" stopColor={LOO.water} />
					<stop offset="1" stopColor={LOO.waterDeep} />
				</radialGradient>
				<radialGradient id="lo-blood" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor={LOO.blood} stopOpacity={0.9} />
					<stop offset="0.6" stopColor={LOO.bloodLight} stopOpacity={0.75} />
					<stop offset="1" stopColor={LOO.bloodLight} stopOpacity={0} />
				</radialGradient>
				<linearGradient id="lo-tank" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={LOO.ceramicShade} />
					<stop offset="0.3" stopColor="#FFFFFF" />
					<stop offset="1" stopColor={LOO.ceramicShade} />
				</linearGradient>
				<filter id="lo-soft" x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation={22} />
				</filter>
				<clipPath id="lo-pool">
					<ellipse cx={W.x} cy={W.y} rx={190} ry={130} />
				</clipPath>
			</defs>
			{/* sol en diagonale, mur carrelé en haut */}
			<rect width={1080} height={1920} fill="url(#lo-floor)" />
			<rect width={1080} height={560} fill="url(#lo-wall)" />
			<rect y={548} width={1080} height={24} fill="#CBD2D9" />
			{/* ombre douce de la cuvette */}
			<ellipse cx={556} cy={1250} rx={470} ry={420} fill="#5E6670" opacity={0.28} filter="url(#lo-soft)" />
			{/* réservoir + bouton */}
			<rect x={250} y={150} width={580} height={330} rx={40} fill="url(#lo-tank)" stroke={LOO.ceramicDeep} strokeWidth={4} />
			<rect x={236} y={130} width={608} height={56} rx={24} fill="#FFFFFF" stroke={LOO.ceramicDeep} strokeWidth={4} />
			<ellipse cx={540} cy={158} rx={56} ry={16} fill={LOO.chrome} stroke="#8E99A5" strokeWidth={3} />
			<line x1={540} y1={144} x2={540} y2={172} stroke="#8E99A5" strokeWidth={3} />
			{/* abattant relevé contre le réservoir */}
			<path d="M300 760 Q296 380 540 360 Q784 380 780 760 Z" fill="url(#lo-tank)" stroke={LOO.ceramicDeep} strokeWidth={4} />
			<path d="M340 740 Q340 420 540 404 Q740 420 740 740" fill="none" stroke="#FFFFFF" strokeWidth={10} opacity={0.7} />
			{/* charnières */}
			<rect x={360} y={752} width={70} height={34} rx={10} fill={LOO.chrome} stroke="#8E99A5" strokeWidth={3} />
			<rect x={650} y={752} width={70} height={34} rx={10} fill={LOO.chrome} stroke="#8E99A5" strokeWidth={3} />
			{/* rebord de la cuvette */}
			<ellipse cx={540} cy={1180} rx={430} ry={400} fill="url(#lo-rim)" stroke={LOO.ceramicDeep} strokeWidth={5} />
			{/* intérieur de la cuvette */}
			<ellipse cx={540} cy={1205} rx={340} ry={318} fill="url(#lo-bowl)" />
			<path d="M230 1120 Q300 900 540 890" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.75} />
			{/* l'eau au fond, qui se teinte */}
			<ellipse cx={W.x} cy={W.y} rx={190} ry={130} fill="url(#lo-water)" />
			<g clipPath="url(#lo-pool)">
				{tint > 0 ? (
					<>
						<ellipse cx={W.x + 6 * Math.sin(frame / 25)} cy={W.y + 4} rx={60 + 200 * tint} ry={40 + 140 * tint} fill="url(#lo-blood)" opacity={Math.min(1, tint * 1.4)} />
						{[0, 1, 2].map((i) => {
							const a = frame / 40 + (i * Math.PI * 2) / 3;
							return (
								<path
									key={i}
									d={`M${W.x} ${W.y} Q${W.x + 90 * Math.cos(a)} ${W.y + 60 * Math.sin(a)} ${W.x + 150 * Math.cos(a + 0.8)} ${W.y + 100 * Math.sin(a + 0.8)}`}
									fill="none"
									stroke={LOO.blood}
									strokeWidth={14}
									strokeLinecap="round"
									opacity={0.35 * tint}
								/>
							);
						})}
					</>
				) : null}
				{ripple > 0
					? [0, 1, 2].map((i) => {
							const t = ((frame / 30 + i / 3) % 1 + 1) % 1;
							return <ellipse key={i} cx={W.x} cy={W.y} rx={20 + 170 * t} ry={14 + 115 * t} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={ripple * 0.5 * (1 - t)} />;
						})
					: null}
				<ellipse cx={W.x - 60} cy={W.y - 60} rx={90} ry={22} fill="#FFFFFF" opacity={0.35} />
			</g>
			<ellipse cx={W.x} cy={W.y} rx={190} ry={130} fill="none" stroke={LOO.ceramicDeep} strokeWidth={3} opacity={0.6} />
		</svg>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Du sang dans les urines : un flacon d'urine teinté de rose, une goutte. */
export const BloodUrineIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 30 L28 88 Q28 92 32 92 L62 92 Q66 92 66 88 L70 30 Z" fill={LPI.paper} {...SW} />
		<path d="M27 52 L67 52 L66 88 Q66 92 62 92 L32 92 Q28 92 28 88 Z" fill={LPI.pink} />
		<path d="M24 30 L28 88 Q28 92 32 92 L62 92 Q66 92 66 88 L70 30 Z" fill="none" {...SW} />
		<rect x={20} y={18} width={54} height={14} rx={5} fill={LPI.blue} {...SW} />
		<path d="M84 44 Q92 58 84 64 Q76 58 84 44 Z" fill={LPI.pink} {...SW} strokeWidth={4} />
	</svg>
);

/** Il peut disparaître… puis revenir : la goutte qui s'efface et revient (flèche en boucle). */
export const ComeBackIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M28 22 Q40 42 28 52 Q16 42 28 22 Z" fill={LPI.pink} {...SW} strokeWidth={4} />
		<path d="M72 22 Q84 42 72 52 Q60 42 72 22 Z" fill="none" stroke={N} strokeWidth={4} strokeDasharray="6 6" />
		<path d="M22 70 Q50 96 78 70" fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" />
		<path d="M70 64 L80 70 L72 80" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Envie d'uriner souvent, envie pressante : la cuvette et un réveil. */
export const UrgeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={10} y={20} width={30} height={30} rx={6} fill={LPI.paper} {...SW} />
		<path d="M8 52 L60 52 Q60 76 38 80 L36 92 L22 92 L20 78 Q8 72 8 52 Z" fill={LPI.paper} {...SW} />
		<circle cx={74} cy={34} r={18} fill={LPI.sky} {...SW} />
		<path d="M74 24 L74 34 L82 38" fill="none" {...SW} strokeWidth={4} />
		<path d="M68 62 L72 76 M80 58 L86 70" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/** Des brûlures en urinant : une goutte et une flamme. */
export const BurningIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M34 14 Q54 46 34 62 Q14 46 34 14 Z" fill={LPI.sky} {...SW} />
		<path d="M66 90 Q46 86 50 66 Q54 54 62 46 Q62 60 70 62 Q72 52 70 42 Q90 58 86 76 Q82 90 66 90 Z" fill={LPI.pink} {...SW} />
	</svg>
);

/** Produits chimiques au travail : un bidon (peinture, teintures, caoutchouc) et des gouttes. */
export const ChemicalIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={18} y={28} width={50} height={62} rx={6} fill={LPI.sky} {...SW} />
		<rect x={24} y={16} width={18} height={14} rx={3} fill={LPI.blue} {...SW} strokeWidth={4} />
		<line x1={18} y1={46} x2={68} y2={46} stroke={N} strokeWidth={4} />
		<line x1={18} y1={72} x2={68} y2={72} stroke={N} strokeWidth={4} />
		<path d="M38 52 L48 66 L28 66 Z" fill={LPI.paper} {...SW} strokeWidth={3} />
		<text x={38} y={64} textAnchor="middle" fontSize={11} fontWeight={900} fill={N} fontFamily="Arial">!</text>
		<path d="M82 40 Q90 54 82 60 Q74 54 82 40 Z" fill={LPI.pink} {...SW} strokeWidth={4} />
		<path d="M84 70 Q90 80 84 84 Q78 80 84 70 Z" fill={LPI.pink} {...SW} strokeWidth={3} />
	</svg>
);

/** L'analyse d'urine : un pot et une bandelette. */
export const UrineTestIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 36 L18 88 Q18 92 22 92 L50 92 Q54 92 54 88 L58 36 Z" fill={alpha(LPI.sky, 0.9)} {...SW} />
		<rect x={10} y={24} width={52} height={14} rx={5} fill={LPI.blue} {...SW} />
		<rect x={70} y={10} width={16} height={82} rx={4} fill={LPI.paper} {...SW} transform="rotate(10 78 50)" />
		{[30, 46, 62, 78].map((y, i) => (
			<rect key={y} x={73} y={y - 12} width={10} height={9} rx={2} fill={i === 1 ? LPI.pink : i === 3 ? LPI.blue : LPI.sky} transform="rotate(10 78 50)" />
		))}
	</svg>
);

/** La cystoscopie / la résection par l'urètre : une fine caméra souple, sa lumière. */
export const ScopeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M10 90 Q30 86 36 66 Q42 44 62 36" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
		<path d="M10 90 Q30 86 36 66 Q42 44 62 36" fill="none" stroke={LPI.sky} strokeWidth={3} strokeLinecap="round" />
		<circle cx={64} cy={35} r={8} fill={N} />
		<path d="M70 30 L94 14 L96 44 Z" fill={alpha(LPI.sky, 0.8)} stroke={LPI.blue} strokeWidth={3} strokeLinejoin="round" />
		<circle cx={64} cy={35} r={3} fill={LPI.paper} />
	</svg>
);

/** Une vessie (repère 100 × 100), simple, aux couleurs de la marque. */
const BladderShape: React.FC<{fill?: string}> = ({fill = LPI.sky}) => (
	<>
		<path d="M50 88 L50 74 Q20 72 18 46 Q18 20 50 18 Q82 20 82 46 Q80 72 50 74" fill={fill} {...SW} />
		<path d="M30 20 Q24 10 20 4 M70 20 Q76 10 80 4" fill="none" {...SW} strokeWidth={4} />
	</>
);

/** Les lavages de la vessie avec un médicament : une sonde, des gouttes qui remplissent la vessie. */
export const InstillIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<BladderShape fill={LPI.paper} />
		<path d="M24 56 Q50 64 76 56 Q74 70 50 72 Q26 70 24 56 Z" fill={LPI.blue} opacity={0.8} />
		{[[38, 44], [54, 38], [64, 48]].map(([x, y], i) => (
			<path key={i} d={`M${x} ${y - 7} Q${x + 5} ${y} ${x} ${y + 3} Q${x - 5} ${y} ${x} ${y - 7} Z`} fill={LPI.blue} />
		))}
		<line x1={50} y1={74} x2={50} y2={98} stroke={N} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/** Retirer toute la vessie : la vessie et un bistouri. */
export const BladderOutIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<g opacity={0.95}>
			<BladderShape fill={LPI.pink} />
		</g>
		<path d="M14 90 L60 46" stroke={N} strokeWidth={7} strokeLinecap="round" />
		<path d="M60 46 L76 30 Q82 30 80 38 L64 52 Z" fill={LPI.paper} {...SW} strokeWidth={4} />
	</svg>
);

/** Surtout les hommes : symbole masculin. */
export const MaleIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={42} cy={58} r={24} fill={LPI.sky} {...SW} strokeWidth={7} />
		<path d="M60 40 L84 16 M64 16 L84 16 L84 36" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
