// Briques « cancer du poumon » (vidéo n° 51). Mise en situation réaliste (demandé) : le balcon le soir (ciel du
// crépuscule, immeubles aux fenêtres allumées, rambarde en métal, plante, cendrier) et le père, vu de face, qui fume,
// tousse dans son mouchoir et découvre un peu de sang. Explications aux couleurs de la marque : pictos (perte de poids,
// radon, travail / amiante, immunothérapie, thérapie ciblée, tabagisme passif, cigarette barrée), fibroscope.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const P = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Vraies couleurs du balcon le soir et du père (mise en situation réaliste). */
export const DUSK = {
	skyTop: '#2C3A68',
	skyMid: '#7A5C8E',
	skyLow: '#E9967A',
	city: '#2A2F45',
	cityFar: '#46496A',
	window: '#FFD27A',
	rail: '#3A3F4A',
	railHi: '#6B7280',
	ledge: '#8C8E93',
	skin: '#E6B793',
	skinShade: '#CC9A75',
	skinLine: '#A8714F',
	hair: '#B9B4AE',
	hairDark: '#8D8780',
	stubble: '#9C8E84',
	sweater: '#5B6B7C',
	sweaterShade: '#475665',
	tissue: '#F7F7F4',
	blood: '#B3172B',
	smoke: '#C9CED6',
	ember: '#FF7A2E',
	leaf: '#4F8A4C',
	pot: '#B5704E',
} as const;

/**
 * Le balcon au crépuscule, plein cadre 1080 × 1920 (vraies couleurs) : ciel, immeubles et fenêtres allumées,
 * `children` (le père) puis, au premier plan, la rambarde (main courante à `rail`), une plante et le cendrier.
 */
export const Balcony: React.FC<{rail?: number; children?: React.ReactNode}> = ({rail = 1360, children}) => {
	const frame = useCurrentFrame();
	const R = rail;
	const towers = [
		[0, 760, 150], [140, 860, 120], [250, 700, 170], [410, 820, 130], [530, 640, 150], [670, 780, 140], [800, 690, 160], [950, 840, 140],
	];
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<linearGradient id="bc-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={DUSK.skyTop} />
					<stop offset="0.45" stopColor={DUSK.skyMid} />
					<stop offset="0.75" stopColor={DUSK.skyLow} />
				</linearGradient>
				<linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#4B4E57" />
					<stop offset="1" stopColor="#2E3038" />
				</linearGradient>
			</defs>
			<rect width={1080} height={1920} fill="url(#bc-sky)" />
			<circle cx={860} cy={300} r={46} fill="#F6EFD8" opacity={0.85} />
			{[[120, 180], [300, 120], [520, 220], [700, 140], [980, 210]].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={2.5} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.abs(Math.sin(frame / 25 + i))} />
			))}
			{/* immeubles au loin, puis plus près */}
			{towers.map(([x, top, w], i) => (
				<g key={i}>
					<rect x={x} y={top - 120} width={w * 0.8} height={1300 - top + 120} fill={DUSK.cityFar} opacity={0.6} transform={`translate(${30} 0)`} />
					<rect x={x} y={top} width={w} height={1400 - top} fill={DUSK.city} />
					{Array.from({length: 14}).map((_, k) => {
						const cx = x + 18 + (k % 3) * (w / 3.2);
						const cy = top + 30 + Math.floor(k / 3) * 70;
						const on = (i * 7 + k * 3) % 5 < 2;
						return on ? <rect key={k} x={cx} y={cy} width={18} height={26} rx={2} fill={DUSK.window} opacity={0.85} /> : null;
					})}
				</g>
			))}
			{children}
			{/* sol du balcon, rambarde, plante, cendrier */}
			<rect x={0} y={R + 40} width={1080} height={1920 - R - 40} fill="url(#bc-floor)" />
			<g>
				{Array.from({length: 13}).map((_, i) => (
					<rect key={i} x={10 + i * 86} y={R + 20} width={14} height={1920 - R} fill={DUSK.rail} />
				))}
				<rect x={0} y={R} width={1080} height={34} rx={8} fill={DUSK.ledge} />
				<rect x={0} y={R} width={1080} height={8} rx={4} fill="#B3B6BB" />
				<rect x={0} y={R + 260} width={1080} height={18} fill={DUSK.rail} />
			</g>
			<g>
				<path d="M60 1360 L74 1250 L176 1250 L190 1360 Z" fill={DUSK.pot} />
				{[[-60, -140], [-20, -190], [20, -200], [60, -150], [0, -110], [-80, -90]].map(([dx, dy], i) => (
					<path key={i} d={`M125 1250 Q${125 + dx * 0.4} ${1250 + dy * 0.6} ${125 + dx} ${1250 + dy} Q${125 + dx * 0.8 + 16} ${1250 + dy * 0.5} 125 1250 Z`} fill={i % 2 ? '#3E7240' : DUSK.leaf} transform={`rotate(${Math.sin(frame / 35 + i) * 2} 125 1250)`} />
				))}
			</g>
			<g>
				<ellipse cx={900} cy={R - 4} rx={70} ry={18} fill="#6F737B" />
				<ellipse cx={900} cy={R - 10} rx={56} ry={10} fill="#3B3E45" />
				<rect x={872} y={R - 22} width={34} height={7} rx={3} fill="#E9E4DA" transform={`rotate(-12 889 ${R - 18})`} />
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ LE PÈRE, DE FACE (repère 600 × 1000) ═══════════════════════════════ */

/** Points du père (repère 600 × 1000) : la bouche, le mouchoir tenu devant la poitrine. */
export const DAD = {mouth: [300, 292], face: [300, 220], tissueLow: [380, 600]} as const;

const Arm: React.FC<{pts: [number, number][]; w: number}> = ({pts, w}) => {
	const [a, b, c] = pts;
	const seg = (p: [number, number], q: [number, number], ww: number, col: string) => <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={col} strokeWidth={ww} strokeLinecap="round" />;
	return (
		<g>
			{seg(a, b, w + 6, DUSK.sweaterShade)}
			{seg(b, c, w * 0.85 + 6, DUSK.sweaterShade)}
			{seg(a, b, w, DUSK.sweater)}
			{seg(b, c, w * 0.85, DUSK.sweater)}
		</g>
	);
};
const Fist: React.FC<{at: [number, number]; r?: number}> = ({at: [x, y], r = 34}) => (
	<g>
		<ellipse cx={x} cy={y} rx={r} ry={r * 0.85} fill={DUSK.skin} stroke={DUSK.skinLine} strokeWidth={3} />
		<path d={`M${x - r * 0.6} ${y - r * 0.2} q${r * 0.6} ${-r * 0.3} ${r * 1.2} 0`} fill="none" stroke={DUSK.skinLine} strokeWidth={2.5} opacity={0.7} />
	</g>
);

/**
 * Le père, vu de face (repère 600 × 1000, vraies couleurs), cheveux gris, barbe de quelques jours, pull. `smoke` 0 → 1
 * porte la cigarette à sa bouche (main droite), `puff` braise qui rougit ; `cough` 0 → 1 il tousse (secousses, yeux
 * fermés) dans son mouchoir (main gauche à la bouche) ; `show` 0 → 1 il baisse le mouchoir devant lui, ouvert, `blood`
 * 0 → 1 la tache de sang ; `worry` sourcils ; `shrug` petit sourire « ce n'est rien ».
 */
export const DadBalcony: React.FC<{width?: number; smoke?: number; puff?: number; cough?: number; show?: number; blood?: number; worry?: number; shrug?: number; cig?: boolean}> = ({
	width = 600,
	smoke = 0,
	puff = 0,
	cough = 0,
	show = 0,
	blood = 0,
	worry = 0,
	shrug = 0,
	cig = true,
}) => {
	const frame = useCurrentFrame();
	const shake = cough * Math.sin(frame * 1.7) * 7;
	const bend = cough * (4 + 3 * Math.sin(frame * 0.9));
	const blink = frame % 120 > 114 ? 0.12 : 1;
	const eyesShut = cough > 0.5 ? 0.12 : blink;
	// bras droit (côté gauche de l'image) : cigarette, au repos à hauteur de poitrine → à la bouche
	const rSh: [number, number] = [150, 470];
	const rEl = P([120, 730], [160, 640], smoke);
	const rHand = P([210, 640], [272, 300], smoke);
	// bras gauche (côté droit de l'image) : mouchoir, au repos → à la bouche (toux) → devant la poitrine (montré)
	const lSh: [number, number] = [450, 470];
	const mouthT = Math.max(cough, 0);
	const lEl0: [number, number] = [490, 760];
	const lHand0: [number, number] = [470, 900];
	const lElM: [number, number] = [470, 640];
	const lHandM: [number, number] = [330, 310];
	const lElS: [number, number] = [480, 700];
	const lHandS: [number, number] = [DAD.tissueLow[0], DAD.tissueLow[1]];
	const lEl = show > 0 ? P(P(lEl0, lElM, mouthT), lElS, show) : P(lEl0, lElM, mouthT);
	const lHand = show > 0 ? P(P(lHand0, lHandM, mouthT), lHandS, show) : P(lHand0, lHandM, mouthT);
	const tip: [number, number] = [rHand[0] + 52, rHand[1] - 10];
	return (
		<svg width={width} height={(width * 1000) / 600} viewBox="0 0 600 1000" style={{overflow: 'visible'}}>
			<g transform={`translate(${shake} ${bend})`}>
				{/* cou, buste (pull) */}
				<path d="M262 300 L262 420 L338 420 L338 300 Z" fill={DUSK.skin} />
				<path d="M262 340 Q300 380 338 340 L338 372 Q300 404 262 372 Z" fill={DUSK.skinShade} opacity={0.6} />
				<path d="M100 560 Q104 452 196 430 L260 412 Q300 440 340 412 L404 430 Q496 452 500 560 L510 1000 L90 1000 Z" fill={DUSK.sweater} stroke={DUSK.sweaterShade} strokeWidth={4} />
				<path d="M260 412 Q300 450 340 412" fill="none" stroke={DUSK.sweaterShade} strokeWidth={10} strokeLinecap="round" />
				{[180, 250, 350, 420].map((x) => (
					<path key={x} d={`M${x} 520 Q${x + 6} 760 ${x - 4} 990`} fill="none" stroke={DUSK.sweaterShade} strokeWidth={3} opacity={0.5} />
				))}
				{/* tête */}
				<ellipse cx={188} cy={228} rx={18} ry={30} fill={DUSK.skin} stroke={DUSK.skinLine} strokeWidth={3} />
				<ellipse cx={412} cy={228} rx={18} ry={30} fill={DUSK.skin} stroke={DUSK.skinLine} strokeWidth={3} />
				<path d="M190 200 Q188 100 300 92 Q412 100 410 200 L408 280 Q400 350 300 362 Q200 350 192 280 Z" fill={DUSK.skin} stroke={DUSK.skinLine} strokeWidth={3} />
				{/* barbe de quelques jours */}
				<path d="M206 270 Q214 346 300 356 Q386 346 394 270 Q370 318 300 322 Q230 318 206 270 Z" fill={DUSK.stubble} opacity={0.45} />
				{/* cheveux gris courts, tempes dégarnies */}
				<path d="M190 196 Q184 96 300 84 Q416 96 410 196 Q398 150 360 140 Q330 118 300 122 Q262 118 238 140 Q202 150 190 196 Z" fill={DUSK.hair} />
				<path d="M230 120 Q300 96 372 122" fill="none" stroke={DUSK.hairDark} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
				{/* sourcils */}
				<path d={`M228 ${180 - 8 * worry} Q254 ${168 - 4 * worry} 280 ${176 - 10 * worry}`} fill="none" stroke={DUSK.hairDark} strokeWidth={9} strokeLinecap="round" />
				<path d={`M372 ${180 - 8 * worry} Q346 ${168 - 4 * worry} 320 ${176 - 10 * worry}`} fill="none" stroke={DUSK.hairDark} strokeWidth={9} strokeLinecap="round" />
				{/* yeux */}
				{[256, 344].map((x) => (
					<g key={x}>
						<ellipse cx={x} cy={210} rx={16} ry={10 * eyesShut} fill="#FFFFFF" />
						{eyesShut > 0.3 ? <circle cx={x} cy={212 + 4 * show} r={7.5} fill="#3A2A22" /> : null}
						<path d={`M${x - 18} 206 Q${x} ${198} ${x + 18} 206`} fill="none" stroke={DUSK.skinLine} strokeWidth={3} strokeLinecap="round" />
						<path d={`M${x - 16} 228 Q${x} 234 ${x + 16} 228`} fill="none" stroke={DUSK.skinShade} strokeWidth={3} strokeLinecap="round" />
					</g>
				))}
				{/* rides du front, nez, bouche */}
				<path d="M250 150 Q300 142 350 150 M258 162 Q300 156 342 162" fill="none" stroke={DUSK.skinShade} strokeWidth={2.5} opacity={0.7} />
				<path d="M300 220 Q290 258 306 266" fill="none" stroke={DUSK.skinLine} strokeWidth={4} strokeLinecap="round" />
				{cough > 0.3 ? (
					<ellipse cx={300} cy={296} rx={18} ry={14} fill="#7A3B36" />
				) : (
					<path d={`M270 296 Q300 ${300 + 10 * shrug} 330 ${294 - 6 * shrug}`} fill="none" stroke="#9C5A52" strokeWidth={7} strokeLinecap="round" />
				)}
				{/* bras droit + cigarette */}
				<Arm pts={[rSh, rEl, rHand]} w={76} />
				<Fist at={rHand} />
				{cig ? (
					<g>
						<rect x={rHand[0] + 14} y={rHand[1] - 16} width={46} height={11} rx={3} fill="#F2EFE8" stroke="#C9C2B4" strokeWidth={1.5} transform={`rotate(-12 ${rHand[0] + 14} ${rHand[1] - 10})`} />
						<rect x={rHand[0] + 14} y={rHand[1] - 16} width={14} height={11} rx={3} fill="#D99A55" transform={`rotate(-12 ${rHand[0] + 14} ${rHand[1] - 10})`} />
						<circle cx={tip[0]} cy={tip[1]} r={6 + 3 * puff} fill={DUSK.ember} opacity={0.6 + 0.4 * puff} style={{filter: `drop-shadow(0 0 ${6 + 10 * puff}px ${DUSK.ember})`}} />
						{[0, 1, 2, 3].map((i) => {
							const t = ((frame * 0.012 + i / 4) % 1 + 1) % 1;
							return <circle key={i} cx={tip[0] + Math.sin(frame / 12 + i * 2) * 18 * t + 10 * t} cy={tip[1] - 30 - t * 260} r={10 + 30 * t} fill={DUSK.smoke} opacity={0.45 * (1 - t)} />;
						})}
					</g>
				) : null}
				{/* bras gauche + mouchoir */}
				<Arm pts={[lSh, lEl, lHand]} w={76} />
				<g transform={`translate(${lHand[0]} ${lHand[1]})`}>
					<path d={`M-60 -40 Q-10 -70 60 -46 Q74 10 56 60 Q0 76 -58 54 Q-74 10 -60 -40 Z`} fill={DUSK.tissue} stroke="#CFCFC8" strokeWidth={3} transform={`scale(${0.8 + 0.5 * show})`} />
					{blood > 0 ? (
						<g opacity={blood} transform={`scale(${0.8 + 0.5 * show})`}>
							<path d="M-14 -6 Q2 -22 18 -8 Q26 8 10 16 Q-6 22 -16 10 Q-22 2 -14 -6 Z" fill={DUSK.blood} />
							<circle cx={26} cy={-20} r={4} fill={DUSK.blood} />
							<circle cx={-24} cy={20} r={3} fill={DUSK.blood} />
						</g>
					) : null}
					<Fist at={[52, 58]} r={28} />
				</g>
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** La perte de poids : une balance, la flèche qui descend. */
export const WeightLossIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={12} y={44} width={58} height={46} rx={12} fill={LPI.paper} {...SW} />
		<rect x={24} y={54} width={34} height={14} rx={4} fill={LPI.sky} {...SW} strokeWidth={3} />
		<path d="M84 18 L84 60 M74 50 L84 62 L94 50" fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le radon : une maison, le gaz qui monte du sol. */
export const RadonIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M18 50 L50 22 L82 50 L82 80 L18 80 Z" fill={LPI.paper} {...SW} />
		<line x1={6} y1={86} x2={94} y2={86} {...SW} />
		{[34, 50, 66].map((x, i) => (
			<path key={i} d={`M${x} 96 Q${x - 6} 86 ${x} 76 Q${x + 6} 66 ${x} 58`} fill="none" stroke={LPI.pink} strokeWidth={4} strokeLinecap="round" strokeDasharray="5 5" />
		))}
	</svg>
);

/** Au travail : un casque de chantier (amiante, produits respirés). */
export const HelmetIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M18 64 Q18 26 50 24 Q82 26 82 64 Z" fill={LPI.sky} {...SW} />
		<rect x={10} y={62} width={80} height={12} rx={6} fill={LPI.blue} {...SW} />
		<path d="M50 24 L50 44 M36 30 L40 48 M64 30 L60 48" fill="none" {...SW} strokeWidth={4} />
		{[[26, 88], [44, 92], [62, 88], [78, 92]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={3.5} fill={N} opacity={0.6} />
		))}
	</svg>
);

/** L'immunothérapie : un bouclier (les défenses) face à une cellule tumorale. */
export const ImmunoIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 14 L56 22 L56 48 Q56 70 30 84 Q4 70 4 48 L4 22 Z" fill={LPI.sky} {...SW} />
		<path d="M18 46 L28 56 L44 36" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
		<circle cx={78} cy={56} r={16} fill={LPI.pink} {...SW} />
		{[0, 1, 2, 3, 4, 5].map((i) => {
			const a = (i / 6) * Math.PI * 2;
			return <line key={i} x1={78 + Math.cos(a) * 16} y1={56 + Math.sin(a) * 16} x2={78 + Math.cos(a) * 22} y2={56 + Math.sin(a) * 22} {...SW} strokeWidth={4} />;
		})}
	</svg>
);

/** Les traitements ciblés : une cible et sa flèche. */
export const TargetIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={44} cy={56} r={34} fill={LPI.paper} {...SW} />
		<circle cx={44} cy={56} r={21} fill={LPI.sky} {...SW} />
		<circle cx={44} cy={56} r={8} fill={LPI.pink} {...SW} strokeWidth={4} />
		<path d="M44 56 L90 12 M76 12 L90 12 L90 26" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Le tabagisme passif : quelqu'un fume, la fumée va vers l'autre. */
export const PassiveSmokeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={20} cy={34} r={11} fill={LPI.sky} {...SW} />
		<path d="M4 90 Q4 56 20 54 Q36 56 36 90 Z" fill={LPI.sky} {...SW} />
		<rect x={30} y={34} width={18} height={6} rx={2} fill={LPI.paper} {...SW} strokeWidth={3} />
		<path d="M48 30 Q58 20 66 30 Q74 40 82 30" fill="none" stroke={alpha(N, 0.5)} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 6" />
		<circle cx={82} cy={44} r={11} fill={LPI.pink} {...SW} />
		<path d="M66 96 Q66 66 82 64 Q98 66 98 96 Z" fill={LPI.pink} {...SW} />
	</svg>
);

/** Arrêter de fumer : la cigarette barrée. */
export const NoSmokeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={14} y={46} width={60} height={12} rx={3} fill={LPI.paper} {...SW} strokeWidth={4} />
		<rect x={14} y={46} width={16} height={12} rx={3} fill={LPI.pink} />
		<path d="M82 40 Q76 32 82 24 Q88 16 82 8" fill="none" stroke={alpha(N, 0.5)} strokeWidth={4} strokeLinecap="round" />
		<circle cx={50} cy={52} r={44} fill="none" stroke={LPI.pink} strokeWidth={8} />
		<line x1={19} y1={21} x2={81} y2={83} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
	</svg>
);
