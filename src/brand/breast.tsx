// Briques « cancer du sein » (vidéo n° 50). Mise en situation réaliste (demandé) : la salle de bain le matin (carrelage,
// fenêtre dépolie, étagère, plante, buée, lavabo au premier plan) et la maman, vue de face comme dans le miroir, enroulée
// dans sa serviette, qui lève le bras et palpe le haut de son sein, côté aisselle (là où naissent la plupart des
// cancers). Explications aux couleurs de la marque : pictos des signes (boule, peau qui se creuse / peau d'orange,
// mamelon qui rentre, boule sous le bras), de la palpation, de la mammographie, de l'échographie, des risques et des
// traitements ; rangée « une femme sur huit ».
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const P = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Vraies couleurs de la salle de bain et de la maman (mise en situation réaliste). */
export const BATH = {
	tile: '#EEF1F4',
	grout: '#D3D9E0',
	tileLow: '#E3E8EE',
	glass: '#E4EEF8',
	light: '#FFF4D9',
	frame: '#C9CFD6',
	shelf: '#B88B62',
	cup: '#7FB3D9',
	leaf: '#5E9B5A',
	leafDark: '#467A43',
	pot: '#C77B55',
	soap: '#F2C6D6',
	counter: '#E8E2D8',
	counterEdge: '#CFC6B8',
	basin: '#FBFBFA',
	chrome: '#B9C2CC',
	skin: '#EBC09E',
	skinShade: '#D9A47F',
	skinLine: '#B97F5C',
	hair: '#8A6650',
	hairGrey: '#BDB3AA',
	towel: '#F5F1E8',
	towelShade: '#E2DACB',
	towelBand: '#9DB9D9',
	lip: '#C27B78',
	eye: '#3A2A22',
} as const;

/**
 * La salle de bain le matin, plein cadre 1080 × 1920 (vraies couleurs) : carrelage, fenêtre dépolie et rayon de soleil,
 * étagère (verre à dents, savon, plante), porte-serviette, buée qui monte. `children` : la personne (entre le décor et le
 * lavabo du premier plan). `counter` : hauteur du plan du lavabo.
 */
export const Bathroom: React.FC<{counter?: number; children?: React.ReactNode}> = ({counter = 1540, children}) => {
	const frame = useCurrentFrame();
	const C = counter;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<pattern id="bt-tiles" width={135} height={135} patternUnits="userSpaceOnUse">
					<rect width={135} height={135} fill={BATH.tile} />
					<rect x={0} y={0} width={135} height={4} fill={BATH.grout} />
					<rect x={0} y={0} width={4} height={135} fill={BATH.grout} />
					<rect x={8} y={8} width={60} height={30} rx={10} fill="#FFFFFF" opacity={0.35} />
				</pattern>
				<linearGradient id="bt-shade" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
					<stop offset="1" stopColor="#8D9AAB" stopOpacity={0.3} />
				</linearGradient>
				<linearGradient id="bt-win" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={BATH.light} />
					<stop offset="1" stopColor={BATH.glass} />
				</linearGradient>
				<linearGradient id="bt-beam" x1="1" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={BATH.light} stopOpacity={0.55} />
					<stop offset="1" stopColor={BATH.light} stopOpacity={0} />
				</linearGradient>
				<linearGradient id="bt-counter" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={BATH.counter} />
					<stop offset="1" stopColor="#D8D0C3" />
				</linearGradient>
				<radialGradient id="bt-basin" cx="0.5" cy="0.35" r="0.6">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="1" stopColor="#DCE1E6" />
				</radialGradient>
				<filter id="bt-blur" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation={18} />
				</filter>
			</defs>
			<rect width={1080} height={1920} fill="url(#bt-tiles)" />
			<rect width={1080} height={1920} fill="url(#bt-shade)" />
			{/* fenêtre dépolie (en haut à droite) et rayon de soleil */}
			<g>
				<rect x={730} y={120} width={300} height={480} rx={10} fill="url(#bt-win)" stroke={BATH.frame} strokeWidth={16} />
				<line x1={880} y1={120} x2={880} y2={600} stroke={BATH.frame} strokeWidth={10} />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<ellipse key={i} cx={760 + (i % 3) * 100} cy={180 + Math.floor(i / 3) * 220} rx={30} ry={70} fill="#FFFFFF" opacity={0.25} />
				))}
				<polygon points="730,140 1030,140 620,1400 120,1400" fill="url(#bt-beam)" opacity={0.5 + 0.08 * Math.sin(frame / 30)} />
			</g>
			{/* étagère : verre à dents, savon, plante */}
			<g>
				<rect x={40} y={760} width={250} height={20} rx={6} fill={BATH.shelf} />
				<rect x={40} y={778} width={250} height={8} fill="#8E6A49" opacity={0.6} />
				<path d="M70 760 L74 680 L124 680 L128 760 Z" fill={BATH.cup} opacity={0.85} stroke="#5E8DB3" strokeWidth={3} />
				<rect x={86} y={600} width={10} height={100} rx={5} fill="#E9F0F7" stroke="#9FB0C2" strokeWidth={2} />
				<rect x={102} y={615} width={10} height={86} rx={5} fill="#F3C7D5" stroke="#C99AAA" strokeWidth={2} />
				<rect x={150} y={690} width={46} height={70} rx={10} fill={BATH.soap} stroke="#C99AAA" strokeWidth={3} />
				<rect x={164} y={666} width={18} height={26} rx={4} fill="#FFFFFF" stroke="#C99AAA" strokeWidth={3} />
				<path d="M222 760 L228 712 L272 712 L278 760 Z" fill={BATH.pot} />
				{[[-40, -70], [-15, -95], [12, -100], [35, -72], [0, -60]].map(([dx, dy], i) => (
					<path key={i} d={`M250 712 Q${250 + dx * 0.4} ${712 + dy * 0.6} ${250 + dx} ${712 + dy} Q${250 + dx * 0.8 + 12} ${712 + dy * 0.5} 250 712 Z`} fill={i % 2 ? BATH.leafDark : BATH.leaf} transform={`rotate(${Math.sin(frame / 40 + i) * 2} 250 712)`} />
				))}
			</g>
			{/* porte-serviette (à droite) */}
			<g>
				<rect x={860} y={760} width={170} height={12} rx={6} fill={BATH.chrome} />
				<path d="M880 770 L1010 770 L1004 1010 Q945 1030 886 1010 Z" fill="#E7C9B5" stroke="#C9A891" strokeWidth={3} />
				<rect x={884} y={950} width={124} height={16} fill="#D7B39B" />
			</g>
			{children}
			{/* buée qui monte */}
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const t = ((frame * 0.004 + i / 6) % 1 + 1) % 1;
				return <circle key={i} cx={140 + i * 160 + 40 * Math.sin(frame / 50 + i)} cy={C - 40 - t * 900} r={120 + 40 * (i % 3)} fill="#FFFFFF" opacity={0.18 * Math.sin(Math.PI * t)} filter="url(#bt-blur)" />;
			})}
			{/* plan du lavabo au premier plan */}
			<g>
				<rect x={0} y={C} width={1080} height={1920 - C} fill="url(#bt-counter)" />
				<rect x={0} y={C} width={1080} height={14} fill={BATH.counterEdge} />
				<ellipse cx={540} cy={C + 210} rx={360} ry={120} fill="url(#bt-basin)" stroke="#C6CDD4" strokeWidth={6} />
				<ellipse cx={540} cy={C + 230} rx={300} ry={84} fill="#E9EDF1" />
				<circle cx={540} cy={C + 250} r={14} fill={BATH.chrome} stroke="#8E99A5" strokeWidth={3} />
				<rect x={516} y={C + 20} width={48} height={70} rx={12} fill={BATH.chrome} stroke="#8E99A5" strokeWidth={3} />
				<path d={`M540 ${C + 40} Q540 ${C - 10} 600 ${C - 6} L640 ${C - 4} L640 ${C + 24} L604 ${C + 22} Q568 ${C + 24} 566 ${C + 60} Z`} fill={BATH.chrome} stroke="#8E99A5" strokeWidth={3} />
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ LA MAMAN, DE FACE (repère 600 × 1000) ═══════════════════════════════ */

/** Points de la maman (repère 600 × 1000) : le haut du sein côté aisselle (là où elle palpe), le visage. */
export const MUM = {palp: [418, 585], face: [300, 220], chest: [380, 640]} as const;

/** Bras : épaule → coude → poignet, le bras plus large que l'avant-bras, ombre douce le long du bord. */
const Limb: React.FC<{pts: [number, number][]; w: number}> = ({pts, w}) => {
	const [a, b, c] = pts;
	const seg = (p: [number, number], q: [number, number], ww: number, col: string, extra = 0) => (
		<line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={col} strokeWidth={ww + extra} strokeLinecap="round" />
	);
	return (
		<g>
			{seg(a, b, w, BATH.skinLine, 6)}
			{seg(b, c, w * 0.8, BATH.skinLine, 6)}
			{seg(a, b, w, BATH.skin)}
			{seg(b, c, w * 0.8, BATH.skin)}
			<g opacity={0.35}>
				{seg([a[0] + w * 0.2, a[1]], [b[0] + w * 0.16, b[1]], w * 0.36, BATH.skinShade)}
				{seg([b[0] + w * 0.14, b[1]], [c[0] + w * 0.1, c[1]], w * 0.3, BATH.skinShade)}
			</g>
		</g>
	);
};

/** Main (repère de la maman) : paume + doigts tendus vers `dir` (angle en degrés). */
const HandAt: React.FC<{at: [number, number]; dir: number; flat?: boolean}> = ({at: [x, y], dir, flat = false}) => (
	<g transform={`translate(${x} ${y}) rotate(${dir})`}>
		<ellipse cx={-6} cy={0} rx={36} ry={30} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={3} />
		{[-16, -2, 12].map((dy, i) => (
			<rect key={i} x={14} y={dy - 7} width={flat ? 46 : 40} height={14} rx={7} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={2.5} />
		))}
		<rect x={-4} y={18} width={30} height={13} rx={6.5} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={2.5} transform="rotate(25 -4 18)" />
	</g>
);

/**
 * La maman, vue de face comme dans le miroir (repère 600 × 1000, vraies couleurs), enroulée dans sa serviette.
 * `raise` 0 → 1 lève son bras gauche (main derrière la tête), `palp` 0 → 1 amène sa main droite sur le haut de son sein
 * côté aisselle (`MUM.palp`), `rub` fait tourner les doigts (palpation en petits cercles), `worry` l'inquiétude
 * (sourcils, bouche), `smile` le petit sourire « ce n'est rien », `look` 0 → 1 : elle baisse les yeux vers sa poitrine.
 */
export const MumTowel: React.FC<{width?: number; raise?: number; palp?: number; rub?: number; worry?: number; smile?: number; look?: number}> = ({width = 600, raise = 0, palp = 0, rub = 0, worry = 0, smile = 0, look = 0}) => {
	const frame = useCurrentFrame();
	const blink = frame % 110 > 104 ? 0.15 : 1;
	// bras gauche (côté droit de l'image) : pendant → levé, main derrière la tête
	const lSh: [number, number] = [458, 470];
	const lEl = P([500, 730], [585, 290], raise);
	const lWr = P([506, 940], [420, 150], raise);
	// bras droit (côté gauche de l'image) : pendant → la main sur le haut du sein gauche
	const r = rub * 7;
	const target: [number, number] = [MUM.palp[0] + Math.cos(frame / 3) * r, MUM.palp[1] + Math.sin(frame / 3) * r];
	const rSh: [number, number] = [142, 470];
	const rEl = P([100, 730], [196, 770], palp);
	const rWr = P([96, 945], [target[0] - 68, target[1] + 34], palp);
	const handDir = palp > 0.5 ? -24 : 90;
	const brow = 10 * worry;
	return (
		<svg width={width} height={(width * 1000) / 600} viewBox="0 0 600 1000" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="mt-skin" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={BATH.skinShade} />
					<stop offset="0.3" stopColor={BATH.skin} />
					<stop offset="0.7" stopColor={BATH.skin} />
					<stop offset="1" stopColor={BATH.skinShade} />
				</linearGradient>
				<linearGradient id="mt-towel" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={BATH.towelShade} />
					<stop offset="0.4" stopColor={BATH.towel} />
					<stop offset="1" stopColor={BATH.towelShade} />
				</linearGradient>
			</defs>
			{/* cheveux (derrière) */}
			<path d="M178 150 Q172 60 300 52 Q428 60 422 150 L436 330 Q420 372 380 372 L220 372 Q180 372 164 330 Z" fill={BATH.hair} />
			{/* bras gauche levé : derrière la tête */}
			{raise > 0.45 ? <Limb pts={[lSh, lEl, lWr]} w={70} /> : null}
			{/* cou */}
			<path d="M262 300 L262 420 L338 420 L338 300 Z" fill={BATH.skin} />
			<path d="M262 330 Q300 372 338 330 L338 360 Q300 392 262 360 Z" fill={BATH.skinShade} opacity={0.6} />
			{/* buste */}
			<path d="M108 560 Q110 452 196 432 L262 410 L338 410 L404 432 Q490 452 492 560 L500 1000 L100 1000 Z" fill="url(#mt-skin)" stroke={BATH.skinLine} strokeWidth={3} />
			<path d="M208 452 Q250 470 284 462" fill="none" stroke={BATH.skinShade} strokeWidth={5} strokeLinecap="round" />
			<path d="M392 452 Q350 470 316 462" fill="none" stroke={BATH.skinShade} strokeWidth={5} strokeLinecap="round" />
			{/* aisselle, quand le bras est levé */}
			{raise > 0.45 ? <path d="M470 486 Q492 520 488 566" fill="none" stroke={BATH.skinShade} strokeWidth={6} strokeLinecap="round" opacity={raise} /> : null}
			<path d="M286 590 Q300 606 314 590" fill="none" stroke={BATH.skinShade} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
			{/* serviette (du dessous des bras jusqu'en bas), rentrée sur le côté */}
			<path d="M112 616 Q300 586 488 616 L498 1000 L102 1000 Z" fill="url(#mt-towel)" stroke={BATH.towelShade} strokeWidth={4} />
			<path d="M112 616 Q300 586 488 616 L489 640 Q300 610 111 640 Z" fill={BATH.towelShade} opacity={0.7} />
			<rect x={104} y={860} width={392} height={26} fill={BATH.towelBand} opacity={0.85} />
			<path d="M396 616 Q420 700 404 780 Q392 740 380 610 Z" fill={BATH.towelShade} />
			{[150, 210, 270, 330, 390, 450].map((x) => (
				<path key={x} d={`M${x} 650 Q${x + 6} 800 ${x - 4} 990`} fill="none" stroke={BATH.towelShade} strokeWidth={3} opacity={0.6} />
			))}
			{/* bras gauche pendant */}
			{raise <= 0.45 ? <Limb pts={[lSh, lEl, lWr]} w={70} /> : null}
			{/* bras droit + main qui palpe */}
			<Limb pts={[rSh, rEl, rWr]} w={70} />
			<HandAt at={palp > 0.5 ? [target[0] - 18, target[1]] : rWr} dir={handDir} flat={palp > 0.5} />
			{/* tête */}
			<ellipse cx={186} cy={226} rx={18} ry={30} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={3} />
			<ellipse cx={414} cy={226} rx={18} ry={30} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={3} />
			<ellipse cx={300} cy={215} rx={112} ry={128} fill={BATH.skin} stroke={BATH.skinLine} strokeWidth={3} />
			{/* frange et mèche grise, chignon vite fait */}
			<path d="M188 190 Q186 92 300 84 Q414 92 412 190 Q392 132 336 124 Q300 150 236 132 Q204 150 188 190 Z" fill={BATH.hair} />
			<path d="M330 92 Q372 100 396 140" fill="none" stroke={BATH.hairGrey} strokeWidth={10} strokeLinecap="round" />
			<ellipse cx={300} cy={66} rx={58} ry={36} fill={BATH.hair} />
			<path d="M262 60 Q300 44 338 60" fill="none" stroke={BATH.hairGrey} strokeWidth={6} strokeLinecap="round" />
			{/* sourcils (l'inquiétude remonte le bout intérieur) */}
			<path d={`M232 ${172 - brow * 0.2} Q256 ${162 - brow * 0.4} 280 ${170 - brow}`} fill="none" stroke={BATH.hair} strokeWidth={7} strokeLinecap="round" />
			<path d={`M368 ${172 - brow * 0.2} Q344 ${162 - brow * 0.4} 320 ${170 - brow}`} fill="none" stroke={BATH.hair} strokeWidth={7} strokeLinecap="round" />
			{/* yeux (clignent, regardent vers le bas) */}
			{[258, 342].map((x) => (
				<g key={x}>
					<ellipse cx={x} cy={204} rx={17} ry={11 * blink} fill="#FFFFFF" />
					<circle cx={x} cy={204 + 4 * look} r={8 * Math.min(1, blink * 1.2)} fill={BATH.eye} />
					<path d={`M${x - 18} ${200 - 2 * look} Q${x} ${192 + 6 * look} ${x + 18} ${200 - 2 * look}`} fill="none" stroke={BATH.skinLine} strokeWidth={3} strokeLinecap="round" />
					<path d={`M${x - 14} 222 Q${x} 228 ${x + 14} 222`} fill="none" stroke={BATH.skinShade} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
				</g>
			))}
			{/* nez, joues, bouche */}
			<path d="M300 214 Q292 248 304 256" fill="none" stroke={BATH.skinLine} strokeWidth={4} strokeLinecap="round" />
			<ellipse cx={240} cy={262} rx={22} ry={12} fill="#E79C8E" opacity={0.3} />
			<ellipse cx={360} cy={262} rx={22} ry={12} fill="#E79C8E" opacity={0.3} />
			{worry > smile ? (
				<ellipse cx={300} cy={290} rx={16 - 6 * worry} ry={6 + 6 * worry} fill={BATH.lip} />
			) : (
				<path d={`M272 ${286} Q300 ${286 + 14 * smile} 328 ${286 - 2 * smile}`} fill="none" stroke={BATH.lip} strokeWidth={7} strokeLinecap="round" />
			)}
			<path d="M238 300 Q232 286 240 274" fill="none" stroke={BATH.skinShade} strokeWidth={2.5} opacity={0.5} />
			<path d="M362 300 Q368 286 360 274" fill="none" stroke={BATH.skinShade} strokeWidth={2.5} opacity={0.5} />
		</svg>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
/** Profil du sein (repère 100 × 100), paroi à gauche. */
const BreastSide: React.FC<{nipple?: 'out' | 'in'}> = ({nipple = 'out'}) => (
	<>
		<line x1={22} y1={8} x2={22} y2={92} {...SW} />
		<path d={`M22 18 Q40 22 56 40 Q72 54 ${nipple === 'out' ? '76 56 Q84 58 80 64' : '70 58 Q66 60 70 64'} Q66 78 48 84 Q34 88 22 86`} fill={LPI.paper} {...SW} />
	</>
);

/** Une boule dans le sein. */
export const LumpIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<BreastSide />
		<circle cx={46} cy={50} r={11} fill={LPI.pink} {...SW} strokeWidth={4} />
	</svg>
);

/** La peau qui se creuse ou prend l'aspect d'une peau d'orange (pores marqués). */
export const OrangeSkinIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={10} y={14} width={80} height={72} rx={18} fill={alpha(LPI.pink, 0.45)} {...SW} />
		{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
			<circle key={i} cx={22 + (i % 4) * 18 + ((Math.floor(i / 4) % 2) * 9)} cy={30 + Math.floor(i / 4) * 18} r={3} fill={N} opacity={0.7} />
		))}
		<path d="M30 56 Q50 70 70 56" fill="none" {...SW} strokeWidth={4} />
	</svg>
);

/** Le mamelon qui rentre (ou qui coule). */
export const NippleIcon: React.FC<IP & {drop?: boolean}> = ({size = 100, drop = true}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<BreastSide nipple="in" />
		<path d="M92 61 L78 61 M84 55 L78 61 L84 67" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
		{drop ? <path d="M72 72 Q66 82 72 86 Q78 82 72 72 Z" fill={LPI.pink} {...SW} strokeWidth={3} /> : null}
	</svg>
);

/** Une boule sous le bras (aisselle) : buste de face, bras levé, point rose. */
export const ArmpitIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={42} cy={20} r={11} fill={LPI.paper} {...SW} />
		<path d="M22 92 L24 50 Q26 38 42 36 Q58 38 60 46 L74 16" fill="none" {...SW} />
		<path d="M60 46 L62 92" fill="none" {...SW} />
		<circle cx={62} cy={52} r={8} fill={LPI.pink} {...SW} strokeWidth={4} />
	</svg>
);

/** La palpation : trois doigts qui tournent en petits cercles sur le sein. */
export const PalpationIcon: React.FC<IP & {spin?: number}> = ({size = 100, spin = 0}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<BreastSide />
		<path d="M38 26 A16 16 0 1 1 30 40" fill="none" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" transform={`rotate(${spin} 44 40)`} />
		<path d="M27 34 L30 41 L37 38" fill="none" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${spin} 44 40)`} />
		{[0, 1, 2].map((i) => (
			<ellipse key={i} cx={46 + i * 9} cy={44 - i * 4} rx={5} ry={7} fill={LPI.sky} {...SW} strokeWidth={3} transform={`rotate(${-30} ${46 + i * 9} ${44 - i * 4})`} />
		))}
	</svg>
);

/** La mammographie : l'appareil (colonne, deux plaques qui serrent doucement le sein). `press` 0 → 1. */
export const MammoIcon: React.FC<IP & {press?: number}> = ({size = 100, press = 0.6}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={14} y={8} width={18} height={86} rx={6} fill={LPI.sky} {...SW} />
		<rect x={30} y={22 + 10 * press} width={52} height={10} rx={4} fill={LPI.paper} {...SW} />
		<rect x={30} y={62} width={52} height={10} rx={4} fill={LPI.paper} {...SW} />
		<path d={`M34 ${36 + 10 * press} Q64 ${38 + 8 * press} 70 ${48 + 4 * press} Q64 58 34 58 Z`} fill={LPI.pink} {...SW} strokeWidth={4} />
		<rect x={6} y={88} width={34} height={8} rx={4} fill={N} />
	</svg>
);

/** L'échographie : la sonde et ses ondes. */
export const EchoIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M40 10 L60 10 L64 50 Q50 58 36 50 Z" fill={LPI.sky} {...SW} />
		<path d="M36 50 Q50 60 64 50 L62 58 Q50 64 38 58 Z" fill={N} />
		{[0, 1, 2].map((i) => (
			<path key={i} d={`M${34 - i * 8} ${70 + i * 9} Q50 ${80 + i * 10} ${66 + i * 8} ${70 + i * 9}`} fill="none" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" opacity={1 - i * 0.25} />
		))}
	</svg>
);

/** Une proche touchée : deux femmes, l'une entourée. */
export const WomenFamilyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={32} cy={26} r={12} fill={LPI.pink} {...SW} />
		<path d="M20 22 Q32 6 44 22" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<path d="M12 86 L22 48 Q32 42 42 48 L52 86 Z" fill={LPI.pink} {...SW} />
		<circle cx={70} cy={40} r={10} fill={LPI.sky} {...SW} />
		<path d="M54 88 L62 60 Q70 55 78 60 L86 88 Z" fill={LPI.sky} {...SW} />
	</svg>
);

/** Un verre de vin + une cigarette : l'alcool et le tabac. */
export const WineSmokeIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M16 14 L46 14 Q48 40 31 46 Q14 40 16 14 Z" fill={LPI.paper} {...SW} />
		<path d="M18 26 L44 26 Q42 40 31 43 Q20 40 18 26 Z" fill={LPI.pink} />
		<path d="M31 46 L31 76 M20 78 L42 78" fill="none" {...SW} />
		<rect x={50} y={66} width={44} height={11} rx={3} fill={LPI.paper} {...SW} strokeWidth={4} transform="rotate(-20 72 71)" />
		<rect x={50} y={66} width={12} height={11} rx={3} fill={LPI.pink} transform="rotate(-20 72 71)" />
		<path d="M88 52 Q82 44 88 36 Q94 28 88 20" fill="none" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Le surpoids et le manque d'activité : un pèse-personne et un canapé. */
export const ScaleSofaIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={8} y={50} width={44} height={40} rx={10} fill={LPI.paper} {...SW} />
		<rect x={18} y={58} width={24} height={12} rx={4} fill={LPI.sky} {...SW} strokeWidth={3} />
		<path d="M56 60 L56 44 Q56 36 64 36 L84 36 Q92 36 92 44 L92 60" fill={LPI.pink} {...SW} />
		<rect x={52} y={58} width={44} height={20} rx={6} fill={LPI.pink} {...SW} />
		<path d="M56 78 L56 86 M92 78 L92 86" {...SW} />
	</svg>
);

/** La chimiothérapie : une poche de perfusion qui goutte. */
export const ChemoIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 10 L70 10 L70 52 Q70 62 60 62 L40 62 Q30 62 30 52 Z" fill={LPI.sky} {...SW} />
		<rect x={36} y={30} width={28} height={6} rx={3} fill={LPI.paper} />
		<path d="M50 62 L50 74" {...SW} />
		<rect x={44} y={72} width={12} height={14} rx={3} fill={LPI.paper} {...SW} strokeWidth={4} />
		<path d="M50 86 Q50 92 56 94" fill="none" {...SW} strokeWidth={4} />
		<circle cx={50} cy={80} r={2.5} fill={LPI.pink} />
	</svg>
);

/** Silhouette de femme (repère 100 × 160). */
const WomanFigure: React.FC<{fill: string}> = ({fill}) => (
	<g>
		<circle cx={50} cy={32} r={22} fill={fill} stroke={N} strokeWidth={6} />
		<path d="M28 30 Q50 0 72 30" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
		<path d="M18 150 L34 70 Q50 60 66 70 L82 150 Z" fill={fill} stroke={N} strokeWidth={6} strokeLinejoin="round" />
	</g>
);

/**
 * « Une femme sur huit » : 8 silhouettes sur deux rangées de 4 qui arrivent une à une (`n` 0 → 8), la dernière devient
 * rose quand `hit` 0 → 1. Largeur `width` (hauteur ≈ width × 0.67).
 */
export const OneInEight: React.FC<{width?: number; n?: number; hit?: number}> = ({width = 960, n = 8, hit = 0}) => (
	<svg width={width} height={(width * 640) / 960} viewBox="0 0 960 640" style={{overflow: 'visible'}}>
		{Array.from({length: 8}).map((_, i) => {
			const k = Math.max(0, Math.min(1, n - i));
			if (k <= 0) return null;
			const last = i === 7;
			const s = 1.6 * (0.7 + 0.3 * k + (last ? 0.15 * hit : 0));
			const cx = 120 + (i % 4) * 240;
			const cy = 150 + Math.floor(i / 4) * 320;
			return (
				<g key={i} transform={`translate(${cx} ${cy}) scale(${s}) translate(-50 -80)`} opacity={k}>
					<WomanFigure fill={last && hit > 0.5 ? LPI.pink : LPI.sky} />
				</g>
			);
		})}
	</svg>
);
