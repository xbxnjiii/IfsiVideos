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
	bladder: [430, 300],
	prostate: [440, 530],
	urethra: [640, 652],
	prostUrethra: [444, 590],
	rectum: [300, 560],
	pubis: [600, 500],
	tumor: [392, 556],
	back: [372, 548],
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

// urètre : col de la vessie → prostate → sous le pubis → le long de la verge → gland
const URETHRA = sampleSegs([
	[430, 418, 440, 530],
	[440, 530, 446, 612],
	[446, 612, 452, 662, 512, 662],
	[512, 662, 640, 650],
	[640, 650, 742, 642, 752, 736],
	[752, 736, 750, 860],
]);
// canal déférent : de l'épididyme, remonte devant le pubis, passe au-dessus de la vessie, redescend derrière elle
const VAS = sampleSegs([
	[566, 742, 548, 640, 600, 560],
	[600, 560, 660, 470, 600, 250],
	[600, 250, 560, 150, 450, 160],
	[450, 160, 320, 170, 326, 300],
	[326, 300, 330, 380, 372, 430],
	[372, 430, 404, 470, 426, 520],
]);

/**
 * Appareil génital et urinaire de l'homme, coupe de profil (face vers la droite), dessiné comme un schéma de manuel
 * (demandé : « vraiment le schéma de l'appareil masculin ») : colonne et sacrum, intestin, vessie (paroi plissée,
 * uretère, urine), vésicule séminale, prostate (capsule, zone de transition autour de l'urètre, zone périphérique à
 * l'arrière), rectum jusqu'à l'anus, symphyse pubienne, verge (corps caverneux, corps spongieux, urètre, gland), bourse
 * avec testicule et épididyme, canal déférent qui remonte jusqu'à la prostate ; dégradés et ombres douces, une teinte
 * de la marque par organe. `grow` 0 → 1 : adénome (la zone de transition grossit et serre l'urètre) ; `flow` 0 → 1 :
 * l'urine descend jusqu'au bout de la verge (plus lentement si l'urètre est serré) ; `fill` : niveau d'urine ;
 * `tumor` 0 → 1 : tumeur dans la zone périphérique (côté rectum) ; `spread` 0 → 1 : cellules qui s'échappent ;
 * `finger` 0 → 1 : doigt ganté du toucher rectal ; `needle` 0 → 1 : aiguille de biopsie ; `glow` / `bladderGlow` /
 * `urethraGlow` : halos ; `body={false}` : organes du petit bassin seuls (loupe).
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
	const [px, py] = PELVIS.prostate;
	const rx = 74 + 40 * grow;
	const ry = 62 + 32 * grow;
	const lumen = 13 - 8 * grow;
	const URE = URETHRA.d;
	const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
	const speed = 1 - 0.65 * grow;
	const drops = flow > 0 ? [0, 1, 2, 3, 4, 5, 6] : [];
	const fy = 300 + 104 - 196 * fill;
	const RECT = 'M228 160 Q210 360 262 520 Q290 620 300 740 Q304 772 322 786 L356 786 Q368 770 368 740 Q366 620 344 520 Q300 360 318 160 Z';
	const RECT_IN = 'M248 170 Q234 360 280 520 Q306 620 316 740 Q318 766 330 778 L346 778 Q354 766 352 740 Q350 620 328 520 Q290 360 300 170 Z';
	// silhouette : dos et fesse à gauche, cuisse en bas, ventre et pubis à droite
	const OUT = 'M176 0 Q132 250 138 420 Q140 610 232 726 Q282 790 336 806 L344 900 L610 900 L604 700 Q626 640 690 600 Q744 530 738 400 Q728 220 700 0 Z';
	const tzx = rx * (0.42 + 0.3 * grow);
	const tzy = ry * (0.46 + 0.28 * grow);
	const lobules: [number, number][] = [[-0.62, -0.1], [-0.5, 0.35], [-0.3, 0.62], [0.05, 0.7], [0.4, 0.55], [0.6, 0.18], [0.55, -0.35], [0.25, -0.62], [-0.2, -0.6], [-0.55, -0.42]];
	const shade = (c: string, t: number) => mix(c, N, t);
	return (
		<svg width={width} height={(width * 900) / 800} viewBox="0 0 800 900" style={{overflow: 'visible'}}>
			<defs>
				<filter id={id('sh')} x="-30%" y="-30%" width="160%" height="160%">
					<feDropShadow dx={0} dy={7} stdDeviation={8} floodColor={N} floodOpacity={0.26} />
				</filter>
				<filter id={id('soft')} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation={6} />
				</filter>
				<linearGradient id={id('fat')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={mixA(LPI.pink, 0.2)} />
					<stop offset="0.5" stopColor={mixA(LPI.pink, 0.1)} />
					<stop offset="1" stopColor={mixA(LPI.pink, 0.22)} />
				</linearGradient>
				<linearGradient id={id('mus')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={mixA(LPI.pink, 0.75)} />
					<stop offset="0.5" stopColor={mixA(LPI.pink, 0.95)} />
					<stop offset="1" stopColor={mixA(LPI.pink, 0.7)} />
				</linearGradient>
				<radialGradient id={id('bone')} cx="0.35" cy="0.3" r="0.8">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="0.6" stopColor={mixA(LPI.sky, 0.55)} />
					<stop offset="1" stopColor={mixA(N, 0.4)} />
				</radialGradient>
				<radialGradient id={id('blad')} cx="0.4" cy="0.35" r="0.75">
					<stop offset="0" stopColor={mixA(LPI.blue, 0.55)} />
					<stop offset="1" stopColor={shade(LPI.blue, 0.15)} />
				</radialGradient>
				<linearGradient id={id('urine')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mixA(LPI.sky, 0.95)} />
					<stop offset="1" stopColor={mixA(LPI.blue, 0.5)} />
				</linearGradient>
				<radialGradient id={id('pro')} cx="0.38" cy="0.32" r="0.8">
					<stop offset="0" stopColor={mixA(LPI.pink, 0.6)} />
					<stop offset="0.6" stopColor={LPI.pink} />
					<stop offset="1" stopColor={shade(LPI.pink, 0.35)} />
				</radialGradient>
				<radialGradient id={id('tz')} cx="0.5" cy="0.45" r="0.6">
					<stop offset="0" stopColor={mixA(LPI.pink, 0.35)} />
					<stop offset="1" stopColor={mixA(LPI.pink, 0.8)} />
				</radialGradient>
				<linearGradient id={id('rec')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={shade(LPI.pink, 0.4)} />
					<stop offset="0.5" stopColor={shade(LPI.pink, 0.18)} />
					<stop offset="1" stopColor={shade(LPI.pink, 0.42)} />
				</linearGradient>
				<linearGradient id={id('cav')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mixA(LPI.blue, 0.75)} />
					<stop offset="1" stopColor={shade(LPI.blue, 0.2)} />
				</linearGradient>
				<radialGradient id={id('testis')} cx="0.38" cy="0.32" r="0.8">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={mixA(LPI.sky, 0.95)} />
				</radialGradient>
				<linearGradient id={id('glove')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={mix(LPI.sky, N, 0.12)} />
					<stop offset="0.45" stopColor={LPI.paper} />
					<stop offset="1" stopColor={mix(LPI.sky, N, 0.2)} />
				</linearGradient>
				<radialGradient id={id('tum')} cx="0.4" cy="0.35" r="0.7">
					<stop offset="0" stopColor={mix(N, LPI.pink, 0.35)} />
					<stop offset="1" stopColor={N} />
				</radialGradient>
				<clipPath id={id('bc')}>
					<ellipse cx={430} cy={300} rx={124} ry={102} />
				</clipPath>
				<clipPath id={id('rc')}>
					<path d={RECT} />
				</clipPath>
				<clipPath id={id('body')}>
					<path d={OUT} />
				</clipPath>
			</defs>
			{/* coupe : peau, graisse, colonne lombaire, intestin, muscle du ventre, fesse */}
			{body ? (
				<g>
					<path d={OUT} fill={url('fat')} />
					<g clipPath={url('body')}>
						{Array.from({length: 46}, (_, i) => (
							<ellipse key={i} cx={140 + ((i * 97) % 600)} cy={50 + ((i * 173) % 840)} rx={22} ry={16} fill="none" stroke={mixA(LPI.pink, 0.24)} strokeWidth={2} />
						))}
						{[[330, 104, 70, 44], [460, 86, 80, 46], [590, 126, 66, 50], [400, 168, 60, 34], [540, 190, 54, 30]].map(([x, y, a, b2], i) => (
							<g key={i} filter={url('sh')}>
								<ellipse cx={x} cy={y} rx={a} ry={b2} fill={mixA(LPI.pink, 0.4)} stroke={mixA(N, 0.35)} strokeWidth={3} />
								<ellipse cx={x} cy={y} rx={a * 0.55} ry={b2 * 0.45} fill="none" stroke={mixA(LPI.pink, 0.75)} strokeWidth={3} />
							</g>
						))}
						<path d="M680 0 Q714 200 702 330 Q690 420 648 446 L622 430 Q656 390 662 320 Q668 190 640 0 Z" fill={url('mus')} stroke={mixA(N, 0.4)} strokeWidth={3} />
						{Array.from({length: 10}, (_, i) => (
							<path key={i} d={`M${646 + i * 3} ${20 + i * 40} Q${672 + i * 2} ${30 + i * 40} ${694 - i} ${26 + i * 40}`} fill="none" stroke={mixA(N, 0.18)} strokeWidth={2} />
						))}
						<path d="M146 540 Q130 690 236 800 L320 860 Q240 720 236 600 Z" fill={url('mus')} opacity={0.75} />
					</g>
					<path d={OUT} fill="none" stroke={mixA(LPI.pink, 0.9)} strokeWidth={14} />
					<path d={OUT} fill="none" stroke={mixA(N, 0.55)} strokeWidth={3} />
					{/* bourse + testicule + épididyme */}
					<g filter={url('sh')}>
						<path d="M552 680 Q520 700 518 790 Q520 880 590 892 Q660 884 668 800 Q668 712 640 690 Z" fill={mixA(LPI.pink, 0.55)} stroke={mixA(N, 0.6)} strokeWidth={4} />
						<path d="M552 680 Q520 700 518 790 Q520 880 590 892 Q660 884 668 800 Q668 712 640 690" fill="none" stroke={mixA(LPI.pink, 0.95)} strokeWidth={10} />
						<ellipse cx={596} cy={808} rx={46} ry={58} fill={url('testis')} stroke={mixA(N, 0.55)} strokeWidth={3} />
						{Array.from({length: 5}, (_, i) => (
							<path key={i} d={`M${572 + i * 10} ${770 + (i % 2) * 6} q6 14 0 28 q-6 14 0 28`} fill="none" stroke={mixA(LPI.blue, 0.35)} strokeWidth={2.5} />
						))}
						<path d="M560 752 Q548 790 556 836 Q566 864 586 868 Q562 840 566 800 Q568 768 584 752 Q574 742 560 752 Z" fill={LPI.pink} stroke={mixA(N, 0.55)} strokeWidth={3} />
					</g>
				</g>
			) : null}
			{/* colonne lombaire, sacrum, coccyx */}
			<g filter={url('sh')}>
				{(body ? [[182, 46, -6]] : []).concat([[176, 110, -4], [170, 172, -2], [170, 234, 2], [178, 296, 8], [192, 356, 16], [208, 410, 24], [220, 456, 32], [228, 492, 40]]).map(([x, y, r], i, arr) => {
					const k = i - (arr.length - 8);
					const big = k < 0;
					const w = big ? 66 : 52 - k * 3;
					const h = big ? 56 : 48 - k * 4;
					return (
						<g key={i} transform={`rotate(${r} ${x} ${y})`}>
							<rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={14} fill={url('bone')} stroke={mixA(N, 0.6)} strokeWidth={3} />
							<circle cx={x - 6} cy={y - 4} r={2.5} fill={mixA(N, 0.3)} />
							<circle cx={x + 7} cy={y + 6} r={2} fill={mixA(N, 0.3)} />
						</g>
					);
				})}
			</g>
			{/* symphyse pubienne */}
			<g transform="rotate(-18 600 500)" filter={url('sh')}>
				<ellipse cx={600} cy={500} rx={36} ry={82} fill={url('bone')} stroke={mixA(N, 0.65)} strokeWidth={4} />
				<path d="M600 430 L600 570" stroke={mixA(LPI.sky, 0.9)} strokeWidth={5} strokeDasharray="6 6" />
				{[[588, 470], [612, 500], [590, 530], [608, 455], [596, 552]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={3} fill={mixA(N, 0.28)} />
				))}
			</g>
			{/* rectum jusqu'à l'anus : paroi, plis, sphincter */}
			<g filter={url('sh')}>
				<path d={RECT} fill={url('rec')} stroke={mixA(N, 0.7)} strokeWidth={4} />
				<path d={RECT_IN} fill={shade(LPI.pink, 0.55)} opacity={0.8} />
				{[[262, 260], [282, 360], [300, 450]].map(([x, y], i) => (
					<path key={i} d={`M${x - 30 + i * 6} ${y} Q${x} ${y - 16} ${x + 34 - i * 2} ${y + 6}`} fill="none" stroke={mixA(LPI.pink, 0.6)} strokeWidth={5} strokeLinecap="round" />
				))}
				{[[300, 734], [366, 734]].map(([x, y], i) => (
					<ellipse key={i} cx={x} cy={y} rx={12} ry={24} fill={url('mus')} stroke={mixA(N, 0.45)} strokeWidth={3} />
				))}
			</g>
			{finger > 0 ? (
				<g clipPath={url('rc')}>
					<g transform={`translate(${-6 * finger} ${300 - 300 * finger})`}>
						<path d="M318 880 L318 600 Q320 548 344 546 Q368 548 368 600 L368 880 Z" fill={url('glove')} stroke={mixA(N, 0.75)} strokeWidth={4} />
						<path d="M326 590 Q344 566 362 590" fill="none" stroke={mixA(N, 0.35)} strokeWidth={3} />
						{[680, 760].map((y) => (
							<path key={y} d={`M322 ${y} Q343 ${y + 8} 364 ${y}`} fill="none" stroke={mixA(N, 0.3)} strokeWidth={3} />
						))}
						<path d="M332 620 L332 800" stroke={alpha(LPI.paper, 0.8)} strokeWidth={5} strokeLinecap="round" />
					</g>
				</g>
			) : null}
			{/* verge : corps caverneux (dessus), corps spongieux autour de l'urètre, gland */}
			{body ? (
				<g filter={url('sh')}>
					<path d="M560 618 Q640 596 712 604 Q790 616 796 700 L796 830 Q794 884 760 892 Q724 890 720 840 L722 720 Q718 690 690 684 L560 690 Z" fill={mixA(LPI.pink, 0.45)} stroke={mixA(N, 0.6)} strokeWidth={4} />
					<path d="M574 630 Q640 612 708 620 Q774 632 778 700 L778 800 Q770 812 760 800 L760 712 Q756 668 712 662 L580 664 Z" fill={url('cav')} stroke={mixA(N, 0.5)} strokeWidth={3} />
					<path d="M540 652 Q600 676 700 668 Q742 668 748 720 L748 836 Q746 850 738 836 L736 726 Q730 690 700 688 L560 690 Q536 684 540 652 Z" fill={mixA(LPI.pink, 0.85)} stroke={mixA(N, 0.4)} strokeWidth={2.5} />
					<path d="M722 812 Q728 790 756 788 Q788 790 794 820 L794 840 Q790 886 758 890 Q724 886 722 840 Z" fill={LPI.pink} stroke={mixA(N, 0.6)} strokeWidth={3} />
				</g>
			) : null}
			{/* canal déférent (de l'épididyme à la prostate) */}
			{body ? (
				<g>
					<path d={VAS.d} fill="none" stroke={mixA(N, 0.6)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
					<path d={VAS.d} fill="none" stroke={shade(LPI.pink, 0.15)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
				</g>
			) : null}
			{/* vésicule séminale */}
			<g filter={url('sh')}>
				<path d="M336 392 Q318 380 326 362 Q340 350 352 366 Q366 352 380 368 Q392 384 380 398 Q392 414 376 428 Q360 440 350 426 Q334 434 330 418 Q320 404 336 392 Z" fill={url('pro')} stroke={mixA(N, 0.55)} strokeWidth={3} />
				<path d="M340 380 Q352 392 366 378 M344 410 Q358 400 372 414" fill="none" stroke={mixA(N, 0.3)} strokeWidth={3} />
			</g>
			{/* uretère */}
			<path d="M300 60 Q296 160 330 250" fill="none" stroke={mixA(N, 0.6)} strokeWidth={14} strokeLinecap="round" />
			<path d="M300 60 Q296 160 330 250" fill="none" stroke={mixA(LPI.blue, 0.7)} strokeWidth={8} strokeLinecap="round" />
			{/* vessie */}
			{bladderGlow > 0 ? <ellipse cx={430} cy={300} rx={172} ry={150} fill={alpha(LPI.sky, 0.8 * bladderGlow)} filter={url('soft')} /> : null}
			<g filter={url('sh')}>
				<ellipse cx={430} cy={300} rx={140} ry={118} fill={url('blad')} stroke={mixA(N, 0.75)} strokeWidth={4} />
				<ellipse cx={430} cy={300} rx={124} ry={102} fill={alpha(LPI.paper, 0.96)} />
				<g clipPath={url('bc')}>
					<rect x={290} y={fy + Math.sin(frame / 8) * 3} width={280} height={300} fill={url('urine')} />
					<path d={`M290 ${fy + Math.sin(frame / 8) * 3} Q360 ${fy - 6} 430 ${fy + 2} Q500 ${fy + 8} 570 ${fy}`} fill="none" stroke={alpha(LPI.paper, 0.8)} strokeWidth={4} />
				</g>
				{Array.from({length: 16}, (_, i) => {
					const a = (i / 16) * Math.PI * 2;
					const x1 = 430 + Math.cos(a) * 124;
					const y1 = 300 + Math.sin(a) * 102;
					const x2 = 430 + Math.cos(a) * 112;
					const y2 = 300 + Math.sin(a) * 91;
					return <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 5} ${(y1 + y2) / 2 - 5} ${x2} ${y2}`} stroke={mixA(LPI.blue, 0.75)} strokeWidth={4} strokeLinecap="round" />;
				})}
				<ellipse cx={392} cy={238} rx={46} ry={20} fill={alpha(LPI.paper, 0.5)} transform="rotate(-20 392 238)" />
			</g>
			{/* prostate */}
			{glow > 0 ? <ellipse cx={px} cy={py} rx={rx + 40} ry={ry + 36} fill={alpha(LPI.pink, (0.45 + 0.3 * pulse) * glow)} filter={url('soft')} /> : null}
			<g filter={url('sh')}>
				<ellipse cx={px} cy={py} rx={rx} ry={ry} fill={url('pro')} stroke={mixA(N, 0.8)} strokeWidth={4} />
				<ellipse cx={px} cy={py} rx={rx - 7} ry={ry - 7} fill="none" stroke={alpha(LPI.paper, 0.35)} strokeWidth={3} />
				{lobules.map(([lx, ly], i) => (
					<path key={i} d={`M${px + lx * rx - 9} ${py + ly * ry} q9 -10 18 0`} fill="none" stroke={mixA(N, 0.3)} strokeWidth={2.5} strokeLinecap="round" />
				))}
				<ellipse cx={px + 4} cy={py - 6} rx={tzx} ry={tzy} fill={url('tz')} stroke={mixA(N, 0.35)} strokeWidth={2.5} strokeDasharray="5 5" />
				<path d={`M${px - rx * 0.6} ${py - ry * 0.55} Q${px - rx * 0.2} ${py - ry * 0.85} ${px + rx * 0.3} ${py - ry * 0.65}`} fill="none" stroke={alpha(LPI.paper, 0.7)} strokeWidth={7} strokeLinecap="round" />
			</g>
			{grow > 0.3
				? [-1, 1].map((sg) => (
						<path key={sg} d={`M${px + sg * (rx + 52)} ${py - 18} L${px + sg * (rx + 16)} ${py} L${px + sg * (rx + 52)} ${py + 18} Z`} fill={N} opacity={(grow - 0.3) / 0.7} transform={`translate(${sg * 6 * Math.sin(frame / 4)} 0)`} />
					))
				: null}
			{tumor > 0 ? (
				<g transform={`translate(${PELVIS.tumor[0]} ${PELVIS.tumor[1]}) scale(${tumor})`} filter={url('sh')}>
					<path d="M-34 -6 Q-36 -30 -14 -32 Q-2 -42 14 -32 Q32 -30 30 -12 Q44 4 30 20 Q22 38 2 34 Q-14 42 -26 28 Q-44 16 -34 -6 Z" fill={url('tum')} stroke={mix(N, LPI.pink, 0.2)} strokeWidth={3} />
					{[[-14, -12, 7], [8, -18, 6], [16, 8, 7], [-10, 14, 6], [2, -2, 5]].map(([x, y, r], i) => (
						<g key={i}>
							<circle cx={x} cy={y} r={r} fill={mixA(LPI.pink, 0.85)} />
							<circle cx={x + 1} cy={y + 1} r={r * 0.4} fill={N} />
						</g>
					))}
				</g>
			) : null}
			{spread > 0
				? [[-1, -1], [-1, 0.4], [1, -0.6], [0.6, 1], [-0.3, 1]].map(([dx, dy], i) => {
						const k = Math.min(1, spread * 1.3 - i * 0.06);
						if (k <= 0) return null;
						return <circle key={i} cx={PELVIS.tumor[0] + dx * 210 * k} cy={PELVIS.tumor[1] + dy * 210 * k} r={11} fill={url('tum')} stroke={LPI.pink} strokeWidth={4} opacity={1 - 0.3 * k} />;
					})
				: null}
			{/* urètre */}
			{urethraGlow > 0 ? <path d={URE} fill="none" stroke={alpha(LPI.blue, 0.5 * urethraGlow)} strokeWidth={lumen + 34} strokeLinecap="round" strokeLinejoin="round" filter={url('soft')} /> : null}
			<path d={URE} fill="none" stroke={mixA(N, 0.75)} strokeWidth={lumen + 12} strokeLinecap="round" strokeLinejoin="round" />
			<path d={URE} fill="none" stroke={mixA(LPI.pink, 0.95)} strokeWidth={lumen + 6} strokeLinecap="round" strokeLinejoin="round" />
			<path d={URE} fill="none" stroke={LPI.paper} strokeWidth={lumen} strokeLinecap="round" strokeLinejoin="round" />
			{drops.map((i) => {
				const t = (((frame * 0.012 * speed + i / 7) % 1) + 1) % 1;
				const [x, y] = URETHRA.at(t);
				return <circle key={i} cx={x} cy={y} r={Math.max(3, lumen * 0.42)} fill={LPI.blue} opacity={flow} />;
			})}
			{needle > 0 ? (
				<g filter={url('sh')}>
					<line x1={360} y1={840} x2={360 + (PELVIS.prostate[0] - 10 - 360) * needle} y2={840 + (PELVIS.prostate[1] + 10 - 840) * needle} stroke={mixA(N, 0.9)} strokeWidth={7} strokeLinecap="round" />
					<line x1={360} y1={840} x2={360 + (PELVIS.prostate[0] - 10 - 360) * needle} y2={840 + (PELVIS.prostate[1] + 10 - 840) * needle} stroke={LPI.paper} strokeWidth={2.5} strokeLinecap="round" />
					<rect x={326} y={836} width={68} height={74} rx={16} fill={url('glove')} stroke={mixA(N, 0.75)} strokeWidth={4} />
					<rect x={340} y={854} width={40} height={10} rx={5} fill={mixA(LPI.blue, 0.6)} />
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
