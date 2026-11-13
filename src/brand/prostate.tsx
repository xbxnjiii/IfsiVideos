// Briques « cancer de la prostate » (vidéo n° 49). Mise en situation réaliste (demandé) : la chambre la nuit (mur sombre,
// fenêtre et lune, lit en bois, couette, table de nuit, réveil à chiffres rouges, lampe de chevet, porte des toilettes
// qui laisse passer la lumière) et l'homme endormi. Explications aux couleurs de la marque : le bassin de l'homme vu de
// profil (vessie, prostate, urètre, rectum, os du pubis) avec l'adénome qui serre l'urètre, la tumeur, le doigt du
// toucher rectal, l'aiguille de la biopsie ; cellules qui se multiplient ; châtaigne (taille réelle) ; pictos.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
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
	urethra: [440, 600],
	rectum: [300, 560],
	pubis: [600, 500],
	tumor: [392, 556],
	back: [372, 548],
} as const;

/** Convertit un point du bassin en pixels pour un dessin posé en (left, top) sur `W` pixels de large. */
export const pelvisPt = (p: readonly [number, number], left: number, top: number, W: number) => ({x: left + (p[0] * W) / 800, y: top + (p[1] * W) / 800});

/**
 * Bassin de l'homme vu de profil (schéma, couleurs de la marque) : vessie (`fill` urine), prostate sous la vessie,
 * urètre qui la traverse, rectum derrière, os du pubis devant. `grow` 0 → 1 : adénome (la prostate grossit et serre
 * l'urètre) ; `flow` 0 → 1 : l'urine descend (plus lentement si l'urètre est serré) ; `tumor` 0 → 1 : tumeur à
 * l'arrière de la prostate ; `spread` 0 → 1 : cellules qui s'échappent ; `finger` 0 → 1 : doigt ganté du toucher rectal
 * qui remonte dans le rectum et palpe l'arrière de la prostate ; `needle` 0 → 1 : aiguille de biopsie ; `glow` : halo
 * sur la prostate ; `bladderGlow` : halo sur la vessie ; `urethraGlow` : l'urètre surligné.
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
	const [px, py] = PELVIS.prostate;
	const rx = 72 + 40 * grow;
	const ry = 60 + 32 * grow;
	const lumen = 16 - 10 * grow;
	// urètre : col de la vessie → prostate → coude → vers l'avant
	const URE = `M430 418 L${px} ${py} L440 640 Q446 700 520 730 L700 790`;
	const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
	const speed = 1 - 0.65 * grow;
	const drops = flow > 0 ? [0, 1, 2, 3, 4] : [];
	// petit chemin paramétré pour les gouttes le long de l'urètre
	const ureAt = (t: number) => {
		if (t < 0.45) return [430 + (px - 430) * (t / 0.45), 418 + (py + 80 - 418) * (t / 0.45)];
		if (t < 0.7) {
			const u = (t - 0.45) / 0.25;
			return [440 + 40 * u * u, 600 + 110 * u];
		}
		const u = (t - 0.7) / 0.3;
		return [480 + 220 * u, 710 + 80 * u];
	};
	const fy = 300 + 110 - 200 * fill;
	return (
		<svg width={width} height={(width * 900) / 800} viewBox="0 0 800 900" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="pv-bladder">
					<ellipse cx={430} cy={300} rx={140} ry={118} />
				</clipPath>
				<clipPath id="pv-rectum">
					<path d="M228 160 Q210 360 262 520 Q290 620 300 760 L372 760 Q366 620 344 520 Q300 360 318 160 Z" />
				</clipPath>
			</defs>
			{/* silhouette du bas du tronc (dos à gauche, ventre à droite) */}
			{body ? (
				<path d="M150 40 Q110 300 150 520 Q180 700 260 860 L560 870 Q620 780 700 760 Q760 600 720 420 Q700 200 690 40 Z" fill={alpha(LPI.paper, 0.9)} stroke={alpha(N, 0.35)} strokeWidth={6} strokeDasharray="4 12" />
			) : null}
			{/* os : sacrum (dos) et pubis (devant) */}
			<path d="M160 120 Q150 300 196 430 Q214 470 206 500" fill="none" stroke={alpha(N, 0.55)} strokeWidth={30} strokeLinecap="round" />
			<ellipse cx={600} cy={500} rx={34} ry={78} fill={alpha(N, 0.55)} transform="rotate(-18 600 500)" />
			{/* rectum (derrière la prostate) */}
			<path d="M228 160 Q210 360 262 520 Q290 620 300 760 L372 760 Q366 620 344 520 Q300 360 318 160 Z" fill={alpha(LPI.pink, 0.28)} {...SK} strokeWidth={5} />
			{/* doigt ganté du toucher rectal : remonte depuis le bas, dans le rectum */}
			{finger > 0 ? (
				<g clipPath="url(#pv-rectum)">
					<g transform={`translate(${-6 * finger} ${300 - 300 * finger})`}>
						<path d="M318 860 L318 600 Q320 548 344 546 Q368 548 368 600 L368 860 Z" fill={LPI.sky} {...SK} strokeWidth={5} />
						<path d="M330 600 Q344 588 358 600" fill="none" stroke={alpha(N, 0.5)} strokeWidth={4} />
					</g>
				</g>
			) : null}
			{/* vessie */}
			{bladderGlow > 0 ? <ellipse cx={430} cy={300} rx={170} ry={148} fill={alpha(LPI.sky, 0.7 * bladderGlow)} /> : null}
			<ellipse cx={430} cy={300} rx={140} ry={118} fill={alpha(LPI.paper, 0.95)} />
			<g clipPath="url(#pv-bladder)">
				<rect x={280} y={fy + Math.sin(frame / 8) * 3} width={300} height={300} fill={alpha(LPI.sky, 0.95)} />
			</g>
			<ellipse cx={430} cy={300} rx={140} ry={118} fill="none" {...SK} />
			{/* prostate */}
			{glow > 0 ? <ellipse cx={px} cy={py} rx={rx + 34} ry={ry + 30} fill={alpha(LPI.pink, (0.35 + 0.25 * pulse) * glow)} /> : null}
			<ellipse cx={px} cy={py} rx={rx} ry={ry} fill={LPI.pink} {...SK} />
			<path d={`M${px - rx * 0.55} ${py - ry * 0.5} Q${px - rx * 0.2} ${py - ry * 0.8} ${px + rx * 0.3} ${py - ry * 0.6}`} fill="none" stroke={alpha(LPI.paper, 0.75)} strokeWidth={8} strokeLinecap="round" />
			{/* flèches : la prostate serre l'urètre */}
			{grow > 0.3
				? [-1, 1].map((s) => (
						<path key={s} d={`M${px + s * (rx + 52)} ${py - 18} L${px + s * (rx + 16)} ${py} L${px + s * (rx + 52)} ${py + 18} Z`} fill={N} opacity={(grow - 0.3) / 0.7} transform={`translate(${s * 6 * Math.sin(frame / 4)} 0)`} />
					))
				: null}
			{/* tumeur : à l'arrière de la prostate (côté rectum) */}
			{tumor > 0 ? (
				<g transform={`translate(${PELVIS.tumor[0]} ${PELVIS.tumor[1]}) scale(${tumor})`}>
					<path d="M-34 -6 Q-30 -34 -4 -32 Q22 -40 28 -14 Q42 8 22 26 Q0 40 -20 28 Q-42 18 -34 -6 Z" fill={N} stroke={N} strokeWidth={3} />
					{[[-14, -10], [8, -16], [14, 10], [-10, 14]].map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={6} fill={alpha(LPI.pink, 0.9)} />
					))}
				</g>
			) : null}
			{/* cellules qui s'échappent */}
			{spread > 0
				? [[-1, -1], [-1, 0.4], [1, -0.6], [0.6, 1], [-0.3, 1]].map(([dx, dy], i) => {
						const k = Math.min(1, spread * 1.3 - i * 0.06);
						if (k <= 0) return null;
						return <circle key={i} cx={PELVIS.tumor[0] + dx * 210 * k} cy={PELVIS.tumor[1] + dy * 210 * k} r={10} fill={N} stroke={LPI.pink} strokeWidth={4} opacity={1 - 0.3 * k} />;
					})
				: null}
			{/* urètre */}
			{urethraGlow > 0 ? <path d={URE} fill="none" stroke={alpha(LPI.blue, 0.45 * urethraGlow)} strokeWidth={lumen + 30} strokeLinecap="round" strokeLinejoin="round" /> : null}
			<path d={URE} fill="none" stroke={N} strokeWidth={lumen + 10} strokeLinecap="round" strokeLinejoin="round" />
			<path d={URE} fill="none" stroke={LPI.paper} strokeWidth={lumen} strokeLinecap="round" strokeLinejoin="round" />
			{drops.map((i) => {
				const t = (((frame * 0.018 * speed + i / 5) % 1) + 1) % 1;
				const [x, y] = ureAt(t);
				return <circle key={i} cx={x} cy={y} r={Math.max(3, lumen * 0.45)} fill={LPI.blue} opacity={flow} />;
			})}
			{/* aiguille de biopsie (passe à travers la paroi du rectum) */}
			{needle > 0 ? (
				<g>
					<line x1={360} y1={820} x2={360 + (PELVIS.prostate[0] - 10 - 360) * needle} y2={820 + (PELVIS.prostate[1] + 10 - 820) * needle} stroke={N} strokeWidth={7} strokeLinecap="round" />
					<line x1={360} y1={820} x2={360 + (PELVIS.prostate[0] - 10 - 360) * needle} y2={820 + (PELVIS.prostate[1] + 10 - 820) * needle} stroke={LPI.paper} strokeWidth={2.5} strokeLinecap="round" />
					<rect x={330} y={820} width={60} height={70} rx={12} fill={LPI.sky} {...SK} strokeWidth={5} />
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
					<circle r={46} fill={bad ? LPI.pink : alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={5} />
					{bad ? (
						<path d="M-18 -6 Q-14 -22 2 -18 Q20 -20 18 0 Q22 16 4 18 Q-14 22 -18 6 Z" fill={N} />
					) : (
						<circle r={14} fill={alpha(LPI.blue, 0.85)} />
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
				<circle r={38} fill={LPI.pink} stroke={N} strokeWidth={5} />
				<path d="M-14 -4 Q-10 -16 2 -14 Q16 -14 14 0 Q16 12 2 14 Q-12 16 -14 4 Z" fill={N} />
			</g>,
		);
	}
	return (
		<svg width={width} height={(width * 640) / 900} viewBox="0 0 900 640" style={{overflow: 'visible'}}>
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
