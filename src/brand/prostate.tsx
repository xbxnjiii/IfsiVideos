// Briques « cancer de la prostate » (vidéo n° 49). Mise en situation réaliste (demandé) : la chambre la nuit (mur sombre,
// fenêtre et lune, lit en bois, couette, table de nuit, réveil à chiffres rouges, lampe de chevet, porte des toilettes
// qui laisse passer la lumière) et l'homme endormi. Explications aux couleurs de la marque : le bassin de l'homme vu de
// profil (vessie, prostate, urètre, rectum, os du pubis) avec l'adénome qui serre l'urètre, la tumeur, le doigt du
// toucher rectal, l'aiguille de la biopsie ; cellules qui se multiplient ; châtaigne (taille réelle) ; pictos.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Mélange opaque de deux couleurs de la marque (pour les dégradés : reste dans la palette). */
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
/** Couleur de la marque posée sur le blanc cassé avec l'opacité `t` (version opaque d'une transparence). */
const mixA = (c: string, t: number) => mix(LPI.paper, c, t);

const SK = {stroke: N, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Vraies couleurs de la chambre la nuit (mise en situation réaliste). */
export const NIGHT = {
	wall: '#2A3248',
	wallLow: '#222838',
	floor: '#4A3527',
	floorLine: '#3B2A1F',
	wood: '#7A5233',
	woodDark: '#5C3D25',
	sheet: '#E6EAF0',
	duvet: '#8FA7C9',
	duvetDark: '#6F88AD',
	skin: '#E9B994',
	hair: '#B8B8B8',
	sky: '#0E1830',
	moon: '#F2EEDC',
	curtain: '#7D6E5A',
	clock: '#161616',
	led: '#FF3B30',
	lamp: '#FFD27A',
	shade: '#E9DCC2',
	light: '#FFF2CF',
	pyjama: '#7FA0C8',
} as const;

/** Repères de la chambre (pixels, cadre 1080 × 1920). */
export const ROOM = {floor: 1380, bedX: 230, bedW: 560, doorX: 830, doorW: 230, doorTop: 730, standX: 520} as const;

/** Réveil numérique (repère 220 × 110) : `time` « 01:00 », `pop` fait sauter les chiffres quand l'heure change. */
export const AlarmClock: React.FC<{time: string; pop?: number}> = ({time, pop = 0}) => (
	<svg width={220} height={120} viewBox="0 0 220 120" style={{overflow: 'visible'}}>
		<rect x={6} y={10} width={208} height={100} rx={20} fill={NIGHT.clock} stroke="#000" strokeWidth={3} />
		<rect x={20} y={24} width={180} height={72} rx={10} fill="#0B0B0B" />
		<ellipse cx={110} cy={60} rx={100} ry={44} fill={alpha(NIGHT.led, 0.08)} />
		<text x={110} y={60} textAnchor="middle" dominantBaseline="central" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={58 * (1 + 0.12 * pop)} fill={NIGHT.led} style={{filter: `drop-shadow(0 0 8px ${NIGHT.led})`}}>
			{time}
		</text>
	</svg>
);

/**
 * La chambre la nuit, plein cadre 1080 × 1920 (vraies couleurs). `lamp` 0 → 1 allume la lampe de chevet, `door` 0 → 1
 * ouvre la porte des toilettes (lumière qui s'étale au sol), `asleep` 0 → 1 : l'homme couché sous la couette (0 = lit
 * vide, couette repoussée), `time` l'heure du réveil, `clockPop` le saut des chiffres. `children` : dessiné entre le
 * décor et le premier plan (l'homme debout).
 */
export const Bedroom: React.FC<{lamp?: number; door?: number; asleep?: number; time: string; clockPop?: number; children?: React.ReactNode}> = ({lamp = 0, door = 0, asleep = 1, time, clockPop = 0, children}) => {
	const frame = useCurrentFrame();
	const F = ROOM.floor;
	const bx = ROOM.bedX;
	const bw = ROOM.bedW;
	const dx = ROOM.doorX;
	const dw = ROOM.doorW;
	const dt = ROOM.doorTop;
	const breathe = Math.sin(frame / 14) * 4 * asleep;
	const open = door;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<linearGradient id="nb-wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={NIGHT.wall} />
					<stop offset="1" stopColor={NIGHT.wallLow} />
				</linearGradient>
				<linearGradient id="nb-floor" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={NIGHT.floor} />
					<stop offset="1" stopColor="#2E2118" />
				</linearGradient>
				<radialGradient id="nb-lamp" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor={NIGHT.lamp} stopOpacity={0.55} />
					<stop offset="1" stopColor={NIGHT.lamp} stopOpacity={0} />
				</radialGradient>
				<linearGradient id="nb-spill" x1="1" y1="0" x2="0" y2="0">
					<stop offset="0" stopColor={NIGHT.light} stopOpacity={0.55} />
					<stop offset="1" stopColor={NIGHT.light} stopOpacity={0} />
				</linearGradient>
				<radialGradient id="nb-moon" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="#9FB4E0" stopOpacity={0.35} />
					<stop offset="1" stopColor="#9FB4E0" stopOpacity={0} />
				</radialGradient>
			</defs>
			{/* mur et plinthe */}
			<rect width={1080} height={F} fill="url(#nb-wall)" />
			<rect y={F - 26} width={1080} height={26} fill="#1C2130" />
			{/* fenêtre : nuit, lune, étoiles, rideaux */}
			<g>
				<rect x={240} y={330} width={420} height={470} rx={10} fill={NIGHT.sky} stroke="#59647D" strokeWidth={14} />
				{[[300, 400], [420, 370], [600, 430], [520, 520], [330, 610], [620, 690]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={3 + (i % 2)} fill="#DCE3F5" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 20 + i))} />
				))}
				<circle cx={540} cy={450} r={130} fill="url(#nb-moon)" />
				<circle cx={540} cy={450} r={48} fill={NIGHT.moon} />
				<circle cx={562} cy={438} r={44} fill={NIGHT.sky} />
				<line x1={450} y1={330} x2={450} y2={800} stroke="#59647D" strokeWidth={10} />
				<line x1={240} y1={560} x2={660} y2={560} stroke="#59647D" strokeWidth={10} />
				<path d="M200 300 L300 300 Q290 560 320 840 L200 840 Z" fill={NIGHT.curtain} />
				<path d="M700 300 L600 300 Q610 560 580 840 L700 840 Z" fill={NIGHT.curtain} />
				<rect x={180} y={286} width={540} height={20} rx={10} fill="#4B4032" />
			</g>
			{/* sol en parquet */}
			<rect y={F} width={1080} height={1920 - F} fill="url(#nb-floor)" />
			{[0, 1, 2, 3, 4].map((i) => (
				<line key={i} x1={0} y1={F + 40 + i * i * 34} x2={1080} y2={F + 40 + i * i * 34} stroke={NIGHT.floorLine} strokeWidth={4} />
			))}
			{/* porte des toilettes (à droite) : quand elle s'ouvre, la lumière sort */}
			<g>
				<rect x={dx - 14} y={dt - 14} width={dw + 28} height={F - dt + 14} fill="#3A3F52" />
				<rect x={dx} y={dt} width={dw} height={F - dt} fill={open > 0 ? NIGHT.light : '#151826'} />
				{open > 0 ? <polygon points={`${dx},${F} ${dx + dw},${F} ${dx + dw},${F + 540} ${dx - 420 * open},${F + 540}`} fill="url(#nb-spill)" /> : null}
				<rect x={dx} y={F - 8} width={dw} height={8} fill={alpha(NIGHT.light, 0.5)} />
				{/* battant qui pivote vers la pièce */}
				<g transform={`translate(${dx} 0) scale(${1 - 0.82 * open} 1)`}>
					<rect x={0} y={dt} width={dw} height={F - dt} fill={NIGHT.woodDark} stroke="#2E1F14" strokeWidth={4} />
					<rect x={28} y={dt + 40} width={dw - 56} height={250} rx={8} fill="none" stroke="#4A3220" strokeWidth={6} />
					<rect x={28} y={dt + 330} width={dw - 56} height={250} rx={8} fill="none" stroke="#4A3220" strokeWidth={6} />
					<circle cx={dw - 30} cy={dt + 330} r={11} fill="#C9B27A" />
				</g>
			</g>
			{/* table de nuit + lampe + réveil (à gauche du lit) */}
			<g>
				<circle cx={110} cy={1000} r={340 * lamp + 1} fill="url(#nb-lamp)" opacity={lamp} />
				<rect x={20} y={1150} width={190} height={F - 1150} fill={NIGHT.wood} stroke="#3E2A19" strokeWidth={4} />
				<rect x={34} y={1190} width={162} height={70} rx={6} fill={NIGHT.woodDark} />
				<circle cx={115} cy={1225} r={7} fill="#C9B27A" />
				<rect x={10} y={1136} width={210} height={20} rx={6} fill={NIGHT.woodDark} />
				<rect x={52} y={1040} width={10} height={96} fill="#8A8172" />
				<path d={`M8 1040 L106 1040 L88 960 L26 960 Z`} fill={lamp > 0 ? NIGHT.lamp : NIGHT.shade} opacity={0.6 + 0.4 * lamp} />
				<g transform="translate(96 1056) scale(0.55)">
					<AlarmClock time={time} pop={clockPop} />
				</g>
			</g>
			{/* lit en bois vu de côté */}
			<g>
				<rect x={bx} y={1040} width={34} height={F - 1040} rx={8} fill={NIGHT.wood} stroke="#3E2A19" strokeWidth={4} />
				<rect x={bx + bw - 30} y={1170} width={30} height={F - 1170} rx={8} fill={NIGHT.wood} stroke="#3E2A19" strokeWidth={4} />
				<rect x={bx + 20} y={1230} width={bw - 30} height={70} fill={NIGHT.woodDark} />
				<rect x={bx + 20} y={1180} width={bw - 40} height={58} rx={14} fill={NIGHT.sheet} />
				{/* oreiller */}
				<ellipse cx={bx + 110} cy={1166} rx={78} ry={30} fill="#F2F4F7" stroke="#C9CFD9" strokeWidth={3} />
				{/* l'homme endormi : tête de profil sur l'oreiller */}
				{asleep > 0 ? (
					<g opacity={asleep}>
						<ellipse cx={bx + 118} cy={1130} rx={46} ry={40} fill={NIGHT.skin} />
						<path d={`M${bx + 76} 1124 Q${bx + 92} 1086 ${bx + 136} 1092 Q${bx + 112} 1102 ${bx + 100} 1124 Z`} fill={NIGHT.hair} />
						<path d={`M${bx + 140} 1126 q8 2 14 0`} stroke="#5A4033" strokeWidth={4} fill="none" strokeLinecap="round" />
						<ellipse cx={bx + 162} cy={1138} rx={8} ry={10} fill={NIGHT.skin} />
					</g>
				) : null}
				{/* couette : bosse quand il dort, repoussée sinon */}
				<path
					d={
						asleep > 0.5
							? `M${bx + 150} ${1196 - breathe} Q${bx + 240} ${1094 - breathe} ${bx + 360} ${1126 - breathe} Q${bx + 470} ${1146} ${bx + bw - 26} ${1176} L${bx + bw - 10} 1250 L${bx + 140} 1250 Z`
							: `M${bx + 300} 1180 Q${bx + 380} 1150 ${bx + 450} 1160 Q${bx + 510} 1166 ${bx + bw - 26} 1176 L${bx + bw - 10} 1250 L${bx + 290} 1250 Z`
					}
					fill={NIGHT.duvet}
					stroke={NIGHT.duvetDark}
					strokeWidth={4}
				/>
			</g>
			{children}
			{/* voile de nuit, plus clair quand la lampe est allumée */}
			<rect width={1080} height={1920} fill="#0A1024" opacity={0.28 - 0.14 * lamp} pointerEvents="none" />
		</svg>
	);
};

/* ═══════════════════════════════ BASSIN DE L'HOMME, VU DE PROFIL (repère 800 × 900, face vers la droite) ═══════════════════════════════ */

/** Points du bassin (repère 800 × 900) pour poser étiquettes et loupes. */
export const PELVIS = {
	bladder: [490, 230],
	prostate: [446, 428],
	urethra: [600, 566],
	prostUrethra: [450, 440],
	rectum: [262, 430],
	pubis: [624, 424],
	tumor: [406, 446],
	back: [392, 440],
} as const;

/** Convertit un point du bassin en pixels pour un dessin posé en (left, top) sur `W` pixels de large. */
export const pelvisPt = (p: readonly [number, number], left: number, top: number, W: number) => ({x: left + (p[0] * W) / 800, y: top + (p[1] * W) / 800});

/** Échantillonne une suite de segments (lignes et courbes quadratiques) en points réguliers. */
type Seg = [number, number, number, number] | [number, number, number, number, number, number];
const sampleSegs = (segs: Seg[], step = 6) => {
	const pts: [number, number][] = [];
	for (const g of segs) {
		const n = 24;
		for (let i = 0; i <= n; i++) {
			const t = i / n;
			if (g.length === 4) pts.push([g[0] + (g[2] - g[0]) * t, g[1] + (g[3] - g[1]) * t]);
			else {
				const u = 1 - t;
				pts.push([u * u * g[0] + 2 * u * t * g[2] + t * t * g[4], u * u * g[1] + 2 * u * t * g[3] + t * t * g[5]]);
			}
		}
	}
	// longueurs cumulées pour avancer à vitesse constante
	const L = [0];
	for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
	const at = (t: number): [number, number] => {
		const d = t * L[L.length - 1];
		let i = 1;
		while (i < L.length - 1 && L[i] < d) i++;
		const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
		return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
	};
	const d = 'M' + pts.filter((_, i) => i % Math.max(1, Math.round(step / 2)) === 0 || i === pts.length - 1).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
	return {d, at};
};

/** Vraies couleurs du schéma d'anatomie (exception à la palette, demandée : « qu'on distingue bien l'appareil génital »). */
export const ANAT = {
	skin: '#F2B38A',
	skinDark: '#D98E62',
	thigh: '#F7C7A3',
	fat: '#FCEDA4',
	fatDark: '#EFD46A',
	bone: '#EFE8DE',
	boneDark: '#C7B8A6',
	muscle: '#C9545F',
	peritoneum: '#6F86B8',
	rectum: '#B5303F',
	rectumDark: '#7C1C29',
	bladder: '#F58A1F',
	bladderDark: '#C2620E',
	urine: '#F8D35A',
	prostate: '#80538F',
	prostateDark: '#5B3868',
	vesicle: '#EE6767',
	vas: '#DD4646',
	cav: '#9B78EE',
	cavDark: '#7353D2',
	spongy: '#F5A3B6',
	glans: '#EF8EA6',
	urethra: '#8C1E33',
	testis: '#F1EAE3',
	testisDark: '#C6B8AC',
	epid: '#F05A5A',
	tunica: '#B5303F',
	glove: '#7FB3E6',
	steel: '#B9C3CD',
	tumor: '#3E2347',
} as const;

// urètre : col de la vessie → prostate → diaphragme → bulbe → sous le pubis → verge qui pend → méat
const URETHRA = sampleSegs([
	[446, 352, 444, 420, 450, 500],
	[450, 500, 452, 528],
	[452, 528, 456, 574, 510, 574],
	[510, 574, 652, 566],
	[652, 566, 722, 566, 724, 640],
	[724, 640, 726, 846],
]);
// canal déférent : épididyme → remonte devant le pubis → par-dessus la vessie → derrière → ampoule → prostate
const VAS = sampleSegs([
	[598, 690, 630, 600, 676, 470],
	[676, 470, 720, 300, 660, 150],
	[660, 150, 600, 64, 486, 82],
	[486, 82, 362, 100, 352, 200],
	[352, 200, 346, 280, 382, 318],
	[382, 318, 412, 352, 444, 418],
]);

/**
 * Petit bassin de l'homme en coupe sagittale (face vers la droite), dessiné comme un schéma de cours d'IFSI / de
 * médecine, en vraies couleurs (`ANAT`), cadré sur la prostate : 5e vertèbre lombaire, sacrum et coccyx, rectum (ampoule,
 * canal anal, sphincters, anus), vessie (dôme, paroi musculaire, uretère, col), péritoine (cul-de-sac entre vessie et
 * rectum), vésicule séminale, canal déférent et son ampoule, prostate (base sous la vessie, apex en bas, zone de
 * transition autour de l'urètre, zone périphérique côté rectum), diaphragme uro-génital, symphyse pubienne, muscle de la
 * paroi abdominale, verge (bulbe, corps spongieux, corps caverneux, gland plus large avec sa couronne et le méat),
 * bourse avec testicule et épididyme. `grow` 0 → 1 : adénome (la zone de transition grossit et serre l'urètre) ;
 * `flow` : l'urine descend jusqu'au méat (plus lentement si l'urètre est serré) ; `fill` : niveau d'urine ; `tumor` :
 * tumeur dans la zone périphérique ; `spread` : cellules qui s'échappent ; `finger` : doigt ganté du toucher rectal ;
 * `needle` : aiguille de biopsie ; `glow` / `bladderGlow` / `urethraGlow` : halos ; `body={false}` : organes seuls.
 */
export const Pelvis: React.FC<{
	width?: number;
	grow?: number;
	flow?: number;
	fill?: number;
	tumor?: number;
	spread?: number;
	finger?: number;
	needle?: number;
	glow?: number;
	bladderGlow?: number;
	urethraGlow?: number;
	body?: boolean;
}> = ({width = 800, grow = 0, flow = 0, fill = 0.55, tumor = 0, spread = 0, finger = 0, needle = 0, glow = 0, bladderGlow = 0, urethraGlow = 0, body = true}) => {
	const frame = useCurrentFrame();
	const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
	const id = (k: string) => `pv${uid}${k}`;
	const url = (k: string) => `url(#${id(k)})`;
	const A = ANAT;
	const [px, py] = PELVIS.prostate;
	const g = 1 + 0.34 * grow;
	const lumen = 10 - 6 * grow;
	const URE = URETHRA.d;
	const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
	const speed = 1 - 0.65 * grow;
	const drops = flow > 0 ? [0, 1, 2, 3, 4, 5, 6] : [];
	const fy = 340 - 210 * fill;
	// silhouette : dos et fesse à gauche, périnée en bas, ventre et pubis à droite (pas de cuisse : on cible la prostate)
	const OUT = 'M40 0 Q-4 240 50 460 Q120 640 268 704 L320 704 Q430 696 520 664 L560 640 Q640 610 686 572 Q740 500 736 420 Q728 300 756 0 Z';
	const SACRUM = 'M50 40 Q28 262 128 440 Q180 522 248 566 L266 548 Q216 490 196 424 Q134 270 168 40 Z';
	const RECT = 'M212 0 Q178 200 230 350 Q258 430 260 500 Q264 556 300 598 L282 704 L322 704 L340 600 Q368 560 366 500 Q374 420 350 334 Q314 190 316 0 Z';
	const RECT_IN = 'M236 0 Q204 200 252 350 Q280 430 282 500 Q286 552 314 590 L296 700 L308 700 L322 594 Q342 556 340 500 Q346 420 326 336 Q292 190 292 0 Z';
	const BLAD = 'M384 254 Q370 150 470 120 Q584 96 626 160 Q650 214 600 284 Q548 346 452 354 Q390 342 384 254 Z';
	const PRO = 'M386 362 Q442 340 508 360 Q526 410 490 470 Q468 508 448 510 Q420 506 398 470 Q368 410 386 362 Z';
	// le doigt entre par l'anus et remonte le long du canal vers l'arrière de la prostate
	const fBase: [number, number] = [292, 760];
	const fTip: [number, number] = [372, 452];
	const fLen = Math.hypot(fTip[0] - fBase[0], fTip[1] - fBase[1]);
	const fAng = (Math.atan2(fTip[1] - fBase[1], fTip[0] - fBase[0]) * 180) / Math.PI;
	const scaleAt = (k: number, cx: number, cy: number) => `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`;
	return (
		<svg width={width} height={(width * 900) / 800} viewBox="0 0 800 900" style={{overflow: 'visible'}}>
			<defs>
				<filter id={id('sh')} x="-30%" y="-30%" width="160%" height="160%">
					<feDropShadow dx={0} dy={5} stdDeviation={6} floodColor="#3A1A12" floodOpacity={0.26} />
				</filter>
				<filter id={id('soft')} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation={6} />
				</filter>
				<radialGradient id={id('fat')} cx="0.55" cy="0.4" r="0.85">
					<stop offset="0" stopColor="#FFF6C8" />
					<stop offset="1" stopColor={A.fat} />
				</radialGradient>
				<linearGradient id={id('bone')} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="1" stopColor={A.bone} />
				</linearGradient>
				<linearGradient id={id('mus')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#B4434F" />
					<stop offset="0.5" stopColor={A.muscle} />
					<stop offset="1" stopColor="#B4434F" />
				</linearGradient>
				<linearGradient id={id('rec')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={A.rectumDark} />
					<stop offset="0.5" stopColor={A.rectum} />
					<stop offset="1" stopColor={A.rectumDark} />
				</linearGradient>
				<radialGradient id={id('blad')} cx="0.38" cy="0.3" r="0.85">
					<stop offset="0" stopColor="#FFB45C" />
					<stop offset="0.6" stopColor={A.bladder} />
					<stop offset="1" stopColor={A.bladderDark} />
				</radialGradient>
				<radialGradient id={id('pro')} cx="0.4" cy="0.3" r="0.85">
					<stop offset="0" stopColor="#A57BB5" />
					<stop offset="0.6" stopColor={A.prostate} />
					<stop offset="1" stopColor={A.prostateDark} />
				</radialGradient>
				<radialGradient id={id('tz')} cx="0.5" cy="0.45" r="0.6">
					<stop offset="0" stopColor="#C29FCE" />
					<stop offset="1" stopColor="#9C73AC" />
				</radialGradient>
				<linearGradient id={id('cav')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={A.cavDark} />
					<stop offset="0.5" stopColor="#B49BF5" />
					<stop offset="1" stopColor={A.cavDark} />
				</linearGradient>
				<radialGradient id={id('glans')} cx="0.4" cy="0.3" r="0.8">
					<stop offset="0" stopColor="#F9B9C9" />
					<stop offset="1" stopColor="#D9738E" />
				</radialGradient>
				<radialGradient id={id('testis')} cx="0.38" cy="0.32" r="0.8">
					<stop offset="0" stopColor="#FFFFFF" />
					<stop offset="0.7" stopColor={A.testis} />
					<stop offset="1" stopColor={A.testisDark} />
				</radialGradient>
				<linearGradient id={id('glove')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#5E95CF" />
					<stop offset="0.45" stopColor="#A9CDF2" />
					<stop offset="1" stopColor="#5E95CF" />
				</linearGradient>
				<radialGradient id={id('tum')} cx="0.4" cy="0.35" r="0.7">
					<stop offset="0" stopColor="#6B3E78" />
					<stop offset="1" stopColor={A.tumor} />
				</radialGradient>
				<clipPath id={id('bc')}>
					<path d={BLAD} transform={scaleAt(0.84, 500, 232)} />
				</clipPath>
				<clipPath id={id('rc')}>
					<path d={RECT} />
				</clipPath>
			</defs>
			{body ? (
				<g>
					<path d={OUT} fill={url('fat')} />
					<path d={OUT} fill="none" stroke={A.skin} strokeWidth={24} strokeLinejoin="round" />
					<path d={OUT} fill="none" stroke={A.skinDark} strokeWidth={2} />
					{/* muscle grand droit (paroi du ventre) */}
					<path d="M706 0 Q732 180 716 300 Q704 370 664 404 L640 392 Q676 352 684 296 Q696 170 670 0 Z" fill={url('mus')} />
					{/* muscles de la fesse (grand fessier) */}
					<path d="M44 300 Q40 480 150 610 Q210 660 262 690 Q170 600 120 470 Q90 390 96 300 Z" fill={url('mus')} opacity={0.85} />
				</g>
			) : null}
			{/* 5e vertèbre lombaire + disque, sacrum (vertèbres soudées), coccyx */}
			<g filter={url('sh')}>
				{body ? (
					<>
						<rect x={58} y={-30} width={104} height={50} rx={12} fill={url('bone')} stroke={A.boneDark} strokeWidth={3} transform="rotate(8 110 0)" />
						<rect x={62} y={22} width={98} height={14} rx={6} fill="#BFD6EE" transform="rotate(10 110 30)" />
					</>
				) : null}
				<path d={SACRUM} fill={url('bone')} stroke={A.boneDark} strokeWidth={3} />
				{[90, 160, 230, 296, 356, 410, 460, 504].map((y, i) => {
					const x0 = 60 + i * i * 2.2 + i * 2;
					return <path key={y} d={`M${x0} ${y} L${x0 + 82 - i * 4} ${y + 6 + i * 3}`} stroke={A.boneDark} strokeWidth={2.5} opacity={0.8} />;
				})}
			</g>
			{/* péritoine : recouvre la vessie et descend entre la vessie et le rectum (cul-de-sac) */}
			{body ? <path d="M720 120 Q620 80 520 104 Q420 110 388 190 Q370 260 352 292 Q330 260 318 160 Q306 80 300 0" fill="none" stroke={A.peritoneum} strokeWidth={3} strokeDasharray="10 6" /> : null}
			{/* rectum : ampoule, canal anal, sphincters */}
			<g filter={url('sh')}>
				<path d={RECT} fill={url('rec')} />
				<path d={RECT_IN} fill="#6A1622" opacity={0.55} />
				{[[236, 150], [256, 270], [290, 400]].map(([x, y], i) => (
					<path key={i} d={`M${x - 18} ${y} Q${x + 10} ${y - 14} ${x + 46} ${y + 6}`} fill="none" stroke="#D45A68" strokeWidth={6} strokeLinecap="round" />
				))}
				{[[284, 640], [336, 640], [282, 686], [330, 690]].map(([x, y], i) => (
					<ellipse key={i} cx={x} cy={y} rx={13} ry={22} fill={url('mus')} />
				))}
			</g>
			{finger > 0 ? (
				<g clipPath={url('rc')}>
					<g transform={`translate(${fBase[0] + (fTip[0] - fBase[0]) * (finger - 1) * 0.9} ${fBase[1] + (fTip[1] - fBase[1]) * (finger - 1) * 0.9}) rotate(${fAng})`}>
						<rect x={-120} y={-22} width={fLen + 120} height={44} rx={22} fill={url('glove')} stroke="#3F6E9E" strokeWidth={3} />
						<path d={`M${fLen - 30} -14 Q${fLen - 12} 0 ${fLen - 30} 14`} fill="none" stroke="#3F6E9E" strokeWidth={3} />
						{[0.45, 0.75].map((k) => (
							<path key={k} d={`M${fLen * k} -18 q6 18 0 36`} fill="none" stroke="#3F6E9E" strokeWidth={2.5} opacity={0.6} />
						))}
					</g>
				</g>
			) : null}
			{/* diaphragme uro-génital (sous la prostate) */}
			{body ? <path d="M392 506 Q470 520 586 500 L590 530 Q470 552 388 534 Z" fill={url('mus')} opacity={0.9} /> : null}
			{/* symphyse pubienne */}
			<g filter={url('sh')}>
				<path d="M600 330 Q640 320 650 380 Q662 460 640 512 Q616 532 598 508 Q586 450 588 390 Q586 340 600 330 Z" fill={url('bone')} stroke={A.boneDark} strokeWidth={3} />
				<path d="M612 350 Q628 420 620 500" fill="none" stroke="#BFD6EE" strokeWidth={5} />
			</g>
			{/* bourse : testicule, épididyme */}
			{body ? (
				<g filter={url('sh')}>
					<path d="M520 640 Q492 712 516 790 Q552 852 616 844 Q676 830 680 760 Q684 680 650 630 Q590 620 520 640 Z" fill={A.skin} />
					<path d="M534 656 Q510 720 530 784 Q560 834 614 828 Q662 816 664 760 Q666 692 640 648 Q590 638 534 656 Z" fill={A.tunica} />
					<ellipse cx={596} cy={748} rx={48} ry={62} fill={url('testis')} transform="rotate(-14 596 748)" />
					<path d="M556 690 Q536 744 548 796 Q560 820 580 826 Q556 790 560 748 Q564 708 592 686 Q572 678 556 690 Z" fill={A.epid} />
				</g>
			) : null}
			{/* verge : bulbe, corps spongieux, corps caverneux, gland plus large avec sa couronne, méat */}
			{body ? (
				<g filter={url('sh')}>
					{/* peau de la verge */}
					<path d="M600 520 Q700 500 744 540 Q776 572 774 640 L772 764 Q770 778 756 780 L694 780 Q680 778 680 764 L682 640 Q678 600 650 592 L560 600 Z" fill={A.skin} />
					{/* corps caverneux (dessus) */}
					<path d="M584 534 Q690 516 734 552 Q760 580 760 640 L758 770 L742 770 L742 650 Q740 610 712 602 Q660 596 590 566 Z" fill={url('cav')} />
					{/* corps spongieux (dessous) + bulbe */}
					<ellipse cx={478} cy={588} rx={46} ry={26} fill={A.spongy} />
					<path d="M470 566 Q560 556 652 552 Q712 552 716 610 L714 776 L700 776 L698 620 Q696 586 652 584 Q560 590 474 610 Z" fill={A.spongy} />
					{/* gland : plus large que la tige, couronne, méat */}
					<path d="M674 772 Q672 750 700 748 L752 748 Q784 752 786 776 Q790 812 772 846 Q752 872 728 872 Q702 872 684 846 Q666 812 674 772 Z" fill={url('glans')} />
					<path d="M672 776 Q728 760 788 776" fill="none" stroke="#B85872" strokeWidth={5} strokeLinecap="round" />
					<path d="M720 856 Q726 868 732 856" fill="none" stroke="#8C1E33" strokeWidth={4} strokeLinecap="round" />
					<ellipse cx={712} cy={798} rx={14} ry={22} fill="#FFFFFF" opacity={0.25} />
				</g>
			) : null}
			{/* canal déférent */}
			{body ? (
				<g>
					<path d={VAS.d} fill="none" stroke="#9E2A2A" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
					<path d={VAS.d} fill="none" stroke={A.vas} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
				</g>
			) : null}
			{/* uretère */}
			<path d="M336 0 Q330 150 398 286" fill="none" stroke="#C2620E" strokeWidth={13} strokeLinecap="round" />
			<path d="M336 0 Q330 150 398 286" fill="none" stroke="#F7B061" strokeWidth={7} strokeLinecap="round" />
			{/* vésicule séminale (entre la vessie et le rectum, au-dessus de la prostate) */}
			<g filter={url('sh')}>
				<path d="M330 236 Q322 216 340 210 Q356 210 360 228 Q378 222 384 242 Q400 246 398 266 Q414 278 404 298 Q412 318 394 330 Q376 334 368 316 Q348 318 348 298 Q330 292 336 274 Q318 264 326 248 Z" fill={A.vesicle} />
				{[[344, 236], [362, 262], [378, 290], [390, 316]].map(([x, y], i) => (
					<path key={i} d={`M${x - 9} ${y} q9 -11 18 0`} fill="none" stroke="#C04848" strokeWidth={3} strokeLinecap="round" />
				))}
			</g>
			{/* vessie : dôme, paroi musculaire, urine, col */}
			{bladderGlow > 0 ? <path d={BLAD} fill={alpha(LPI.sky, 0.85 * bladderGlow)} stroke={alpha(LPI.sky, 0.85 * bladderGlow)} strokeWidth={50} filter={url('soft')} /> : null}
			<g filter={url('sh')}>
				<path d={BLAD} fill={url('blad')} />
				<g clipPath={url('bc')}>
					<rect x={360} y={90} width={300} height={280} fill="#FFD9A6" />
					<rect x={360} y={fy + Math.sin(frame / 8) * 3} width={300} height={300} fill={A.urine} />
					<path d={`M360 ${fy + Math.sin(frame / 8) * 3} Q440 ${fy - 6} 510 ${fy + 2} Q590 ${fy + 8} 660 ${fy}`} fill="none" stroke="#FFF2B8" strokeWidth={4} />
				</g>
				{Array.from({length: 12}, (_, i) => {
					const t = i / 12;
					const x = 400 + 210 * t;
					return <path key={i} d={`M${x} ${150 - 30 * Math.sin(t * Math.PI)} q6 6 0 12`} fill="none" stroke={A.bladderDark} strokeWidth={3} opacity={0.6} />;
				})}
				<ellipse cx={460} cy={150} rx={46} ry={16} fill="#FFFFFF" opacity={0.35} transform="rotate(-14 460 150)" />
			</g>
			{/* prostate : base sous la vessie, apex en bas ; zone de transition autour de l'urètre */}
			{glow > 0 ? <ellipse cx={px} cy={py} rx={96 * g} ry={100 * g} fill={alpha(LPI.pink, (0.5 + 0.3 * pulse) * glow)} filter={url('soft')} /> : null}
			<g filter={url('sh')} transform={scaleAt(g, px, py - 20)}>
				<path d={PRO} fill={url('pro')} />
				<ellipse cx={px + 6} cy={py - 18} rx={30 + 18 * grow} ry={42 + 14 * grow} fill={url('tz')} />
				{Array.from({length: 9}, (_, i) => {
					const a = (i / 9) * Math.PI * 2;
					return <path key={i} d={`M${px + Math.cos(a) * 40 - 7} ${py - 8 + Math.sin(a) * 46} q7 -8 14 0`} fill="none" stroke="#4B2C57" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />;
				})}
				<path d={`M${px - 40} ${py - 52} Q${px} ${py - 74} ${px + 44} ${py - 54}`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.3} />
			</g>
			{grow > 0.3
				? [-1, 1].map((sg) => (
						<path key={sg} d={`M${px + sg * 120} ${py - 36} L${px + sg * 84} ${py - 20} L${px + sg * 120} ${py - 4} Z`} fill={N} opacity={(grow - 0.3) / 0.7} transform={`translate(${sg * 6 * Math.sin(frame / 4)} 0)`} />
					))
				: null}
			{tumor > 0 ? (
				<g transform={`translate(${PELVIS.tumor[0]} ${PELVIS.tumor[1]}) scale(${tumor * 0.75})`} filter={url('sh')}>
					<path d="M-34 -6 Q-36 -30 -14 -32 Q-2 -42 14 -32 Q32 -30 30 -12 Q44 4 30 20 Q22 38 2 34 Q-14 42 -26 28 Q-44 16 -34 -6 Z" fill={url('tum')} stroke="#2A1430" strokeWidth={3} />
					{[[-14, -12, 7], [8, -18, 6], [16, 8, 7], [-10, 14, 6], [2, -2, 5]].map(([x, y, r], i) => (
						<g key={i}>
							<circle cx={x} cy={y} r={r} fill="#C98BD6" />
							<circle cx={x + 1} cy={y + 1} r={r * 0.4} fill="#2A1430" />
						</g>
					))}
				</g>
			) : null}
			{spread > 0
				? [[-1, -1], [-1, 0.4], [1, -0.6], [0.6, 1], [-0.3, 1]].map(([dx, dy], i) => {
						const k = Math.min(1, spread * 1.3 - i * 0.06);
						if (k <= 0) return null;
						return <circle key={i} cx={PELVIS.tumor[0] + dx * 200 * k} cy={PELVIS.tumor[1] + dy * 200 * k} r={11} fill={url('tum')} stroke="#C98BD6" strokeWidth={4} opacity={1 - 0.3 * k} />;
					})
				: null}
			{/* urètre */}
			{urethraGlow > 0 ? <path d={URE} fill="none" stroke={alpha(LPI.blue, 0.55 * urethraGlow)} strokeWidth={lumen + 34} strokeLinecap="round" strokeLinejoin="round" filter={url('soft')} /> : null}
			<path d={URE} fill="none" stroke={A.urethra} strokeWidth={lumen + 8} strokeLinecap="round" strokeLinejoin="round" />
			<path d={URE} fill="none" stroke="#D9576B" strokeWidth={lumen} strokeLinecap="round" strokeLinejoin="round" />
			{drops.map((i) => {
				const t = (((frame * 0.012 * speed + i / 7) % 1) + 1) % 1;
				const [x, y] = URETHRA.at(t);
				return <circle key={i} cx={x} cy={y} r={Math.max(3, lumen * 0.5)} fill={A.urine} stroke="#C9A22A" strokeWidth={1.5} opacity={flow} />;
			})}
			{needle > 0 ? (
				<g filter={url('sh')}>
					<line x1={326} y1={660} x2={326 + (px - 36 - 326) * needle} y2={660 + (py + 18 - 660) * needle} stroke="#5E6B78" strokeWidth={6} strokeLinecap="round" />
					<line x1={326} y1={660} x2={326 + (px - 36 - 326) * needle} y2={660 + (py + 18 - 660) * needle} stroke={A.steel} strokeWidth={2.5} strokeLinecap="round" />
					<rect x={296} y={656} width={56} height={84} rx={16} fill={url('glove')} stroke="#3F6E9E" strokeWidth={3} />
				</g>
			) : null}
		</svg>
	);
};

/** Châtaigne (vraies couleurs, repère 200 × 200) : la taille de la prostate. */
export const Chestnut: React.FC<{size?: number}> = ({size = 200}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<ellipse cx={104} cy={186} rx={70} ry={10} fill="rgba(0,0,0,0.18)" />
		<path d="M100 22 Q78 48 40 86 Q16 116 30 150 Q50 186 100 186 Q150 186 170 150 Q184 116 160 86 Q122 48 100 22 Z" fill="#7B3F1E" stroke="#4A2410" strokeWidth={4} />
		<path d="M44 140 Q100 168 158 140 Q166 160 150 174 Q100 192 50 174 Q34 160 44 140 Z" fill="#C9A77E" />
		<path d="M70 60 Q60 100 64 130" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={8} strokeLinecap="round" />
		<path d="M100 22 L100 10" stroke="#4A2410" strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/**
 * Champ de cellules (repère 900 × 640) : des cellules saines (bleu clair) ; `k` 0 → 1 : les cellules cancéreuses (rose,
 * noyau bleu nuit irrégulier) se multiplient depuis le centre et poussent les autres ; `split` : la cellule du centre se
 * divise en deux.
 */
export const CellField: React.FC<{k: number; width?: number}> = ({k, width = 900}) => {
	const frame = useCurrentFrame();
	const cells: React.ReactNode[] = [];
	const cx = 450;
	const cy = 320;
	let idx = 0;
	for (let row = 0; row < 6; row++) {
		for (let col = 0; col < 8; col++) {
			const x = 70 + col * 110 + (row % 2) * 55;
			const y = 60 + row * 106;
			const d = Math.hypot(x - cx, y - cy);
			const reach = k * 520;
			const bad = d < reach;
			const appear = bad ? Math.min(1, (reach - d) / 60) : 0;
			const wob = Math.sin(frame / 9 + idx) * 3;
			cells.push(
				<g key={`${row}-${col}`} transform={`translate(${x + wob} ${y}) scale(${1 + 0.08 * appear})`}>
					<circle r={46} fill={bad ? 'url(#cf-bad)' : 'url(#cf-ok)'} stroke={mixA(N, 0.7)} strokeWidth={4} />
					<ellipse cx={-14} cy={-18} rx={14} ry={8} fill={alpha(LPI.paper, 0.6)} />
					{bad ? (
						<path d="M-18 -6 Q-14 -22 2 -18 Q20 -20 18 0 Q22 16 4 18 Q-14 22 -18 6 Z" fill={N} />
					) : (
						<>
							<circle r={15} fill={mixA(LPI.blue, 0.7)} />
							<circle r={5} fill={mixA(N, 0.55)} cx={3} cy={2} />
						</>
					)}
				</g>,
			);
			idx++;
		}
	}
	// cellules en trop qui « débordent » au centre
	const extra = Math.floor(k * 9);
	for (let i = 0; i < extra; i++) {
		const a = i * 2.39;
		const r = 30 + i * 22;
		cells.push(
			<g key={`x${i}`} transform={`translate(${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r * 0.8})`}>
				<circle r={38} fill="url(#cf-bad)" stroke={mixA(N, 0.7)} strokeWidth={4} />
				<path d="M-14 -4 Q-10 -16 2 -14 Q16 -14 14 0 Q16 12 2 14 Q-12 16 -14 4 Z" fill={N} />
			</g>,
		);
	}
	return (
		<svg width={width} height={(width * 640) / 900} viewBox="0 0 900 640" style={{overflow: 'visible'}}>
			<defs>
				<radialGradient id="cf-ok" cx="0.35" cy="0.3" r="0.8">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={mixA(LPI.sky, 1)} />
				</radialGradient>
				<radialGradient id="cf-bad" cx="0.35" cy="0.3" r="0.8">
					<stop offset="0" stopColor={mixA(LPI.pink, 0.55)} />
					<stop offset="1" stopColor={mix(LPI.pink, N, 0.25)} />
				</radialGradient>
			</defs>
			{cells}
		</svg>
	);
};

/** Os qui fait mal (repère 300 × 200) : os + éclairs de douleur roses qui clignotent (`pain` 0 → 1). */
export const BonePain: React.FC<{pain?: number; size?: number}> = ({pain = 1, size = 300}) => {
	const frame = useCurrentFrame();
	const f = 0.6 + 0.4 * Math.abs(Math.sin(frame / 5));
	return (
		<svg width={size} height={(size * 200) / 300} viewBox="0 0 300 200" style={{overflow: 'visible'}}>
			<path d="M60 70 A28 28 0 1 1 84 48 L216 48 A28 28 0 1 1 240 70 A28 28 0 1 1 216 152 L84 152 A28 28 0 1 1 60 130 A28 28 0 1 1 60 70 Z" fill={LPI.paper} {...SK} />
			<circle cx={150} cy={100} r={26} fill={alpha(N, 0.85 * pain)} />
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const a = (i / 6) * Math.PI * 2;
				return <path key={i} d={`M${150 + Math.cos(a) * 40} ${100 + Math.sin(a) * 40} L${150 + Math.cos(a) * 62} ${100 + Math.sin(a) * 62}`} stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" opacity={pain * f} />;
			})}
		</svg>
	);
};

/** Famille (repère 100 × 100, trait bleu nuit) : un père et son fils, le père entouré (antécédent familial). */
export const FamilyIcon: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={34} cy={26} r={12} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<path d="M14 84 Q14 48 34 46 Q54 48 54 84 Z" fill={LPI.pink} stroke={N} strokeWidth={5} strokeLinejoin="round" />
		<circle cx={70} cy={42} r={9} fill={LPI.sky} stroke={N} strokeWidth={5} />
		<path d="M56 86 Q56 60 70 58 Q84 60 84 86 Z" fill={LPI.sky} stroke={N} strokeWidth={5} strokeLinejoin="round" />
	</svg>
);

/** Globe (repère 100 × 100) : les origines (famille venue d'Afrique ou des Antilles). */
export const GlobeIcon: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={38} fill={LPI.sky} stroke={N} strokeWidth={5} />
		<path d="M44 22 Q36 30 40 40 Q48 46 44 56 Q50 70 56 78 Q62 64 60 54 Q66 46 60 36 Q56 26 44 22 Z" fill={LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
		<ellipse cx={50} cy={50} rx={16} ry={38} fill="none" stroke={alpha(N, 0.4)} strokeWidth={3} />
		<line x1={12} y1={50} x2={88} y2={50} stroke={alpha(N, 0.4)} strokeWidth={3} />
	</svg>
);

/** Calendrier « 50 + » (repère 100 × 100) : l'âge. */
export const AgeIcon: React.FC<{size?: number; label?: string}> = ({size = 100, label = '50+'}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={12} y={18} width={76} height={70} rx={10} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<rect x={12} y={18} width={76} height={20} rx={8} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<line x1={32} y1={10} x2={32} y2={26} stroke={N} strokeWidth={6} strokeLinecap="round" />
		<line x1={68} y1={10} x2={68} y2={26} stroke={N} strokeWidth={6} strokeLinecap="round" />
		<text x={50} y={66} textAnchor="middle" dominantBaseline="central" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={30} fill={N}>
			{label}
		</text>
	</svg>
);

/** Radiothérapie (repère 100 × 100) : faisceaux qui convergent sur une cible. */
export const RayIcon: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[[-1, -1], [0, -1.2], [1, -1]].map(([dx, dy], i) => (
			<path key={i} d={`M${50 + dx * 36} ${56 + dy * 36} L50 58`} stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" strokeDasharray="8 6" />
		))}
		<circle cx={50} cy={64} r={16} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<circle cx={50} cy={64} r={6} fill={N} />
	</svg>
);

/** Surveillance active (repère 100 × 100) : un œil sur un calendrier coché (on surveille, sans traiter tout de suite). */
export const WatchIcon: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M10 50 Q50 14 90 50 Q50 86 10 50 Z" fill={LPI.paper} stroke={N} strokeWidth={5} strokeLinejoin="round" />
		<circle cx={50} cy={50} r={15} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<circle cx={55} cy={45} r={5} fill={LPI.paper} />
	</svg>
);
