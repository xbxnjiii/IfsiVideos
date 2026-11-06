// Planche anatomique « La Petite IDE » n° 1 : LES POUMONS (dessin maison, palette de la marque, contours bleu nuit).
// Réutilisable dans toutes les vidéos (BPCO, asthme, pneumonie, embolie…). Les planches suivantes (cerveau, cœur…)
// suivront le même principe : un dessin `…Art` (groupe SVG dans un repère fixe), un svg autonome avec étiquettes, des
// gros plans dans une loupe `ZoomBubble`, et un calque calé sur le `Patient` pour les voir « à travers » le corps.
//
// - `LungsArt` (repère 600 × 640) / `Lungs` (svg autonome, étiquettes `labels`) : trachée et ses anneaux, bronches →
//   bronchioles (arbre qui se dessine `tree`), alvéoles au bout, lobes et scissures, plèvre, diaphragme, côtes, air qui
//   circule ; BPCO `copd` (paroi rose épaissie, passage étroit, mucus, poumons distendus et plus sombres, diaphragme
//   aplati) + emphysème `emph` (bulles) + air piégé `trapped`.
// - `AlveoliZoom` : grappes d'alvéoles + vaisseaux, O₂ qui passe dans le sang ; emphysème (les parois cassent : grands
//   sacs), air emprisonné.
// - `AirwayCross` : bronche en coupe (anneaux de cartilage, muscle, muqueuse) : ouverte → enflammée, muscle contracté,
//   passage en étoile, mucus qui coule.
// - `ZoomBubble` : loupe ronde reliée au point qu'elle grossit (comme les planches de cours).
// - `ChestXRay` : radio du thorax calée sur le `Patient` (même repère 400 × 560, même taille) : film bleu nuit, côtes,
//   colonne, clavicules, poumons sombres ; ligne de balayage `scan`, puis les poumons en couleur se découvrent `reveal`.
import React, {useId} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {TORSO} from './patient';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const popAt = (frame: number, t0: number) =>
	frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2);
/** Hasard stable (0 → 1). */
const rnd = (i: number, k = 0) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/* ═══════════════════════════════ GÉOMÉTRIE (repère 600 × 640) ═══════════════════════════════ */
/** Poumon droit du patient (à gauche de l'image) : 3 lobes. */
export const LUNG_R =
	'M214 96 C178 98 132 168 106 252 C84 330 66 440 66 530 C66 556 84 566 104 558 C146 540 204 524 258 532 C274 534 282 522 280 504 C276 448 272 392 270 340 C268 306 264 282 260 258 C254 178 244 96 214 96 Z';
/** Poumon gauche du patient (à droite de l'image) : 2 lobes + encoche du cœur. */
export const LUNG_L =
	'M386 96 C422 98 468 168 494 252 C516 330 534 440 534 530 C534 556 516 566 496 558 C456 542 414 532 376 538 C360 540 352 528 358 512 C366 494 384 474 382 452 C380 430 356 428 344 416 C336 396 334 360 336 334 C338 304 340 282 344 258 C350 178 356 96 386 96 Z';
const FISSURES = [
	'M72 352 C140 340 206 336 271 344',
	'M270 398 C212 420 142 470 90 548',
	'M340 300 C402 350 470 440 520 548',
];
const LOBE_NAMES: [number, number, string, string][] = [
	[168, 236, 'lobe', 'supérieur'],
	[150, 400, 'lobe', 'moyen'],
	[222, 486, 'lobe', 'inférieur'],
	[446, 300, 'lobe', 'supérieur'],
	[468, 504, 'lobe', 'inférieur'],
];
/** Point central (gonflement, distension). */
const CENTER: [number, number] = [300, 340];

type Seg = {pts: number[]; w: number; lvl: number; tip?: boolean};
/** Bronches principales puis lobaires et segmentaires (dessinées à la main). */
const MAIN: Seg[] = [
	// bronches souches (droite plus courte et plus verticale)
	{pts: [298, 236, 280, 266, 240, 292], w: 28, lvl: 0},
	{pts: [302, 236, 326, 268, 378, 300], w: 24, lvl: 0},
	// poumon droit
	{pts: [240, 292, 226, 262, 212, 226], w: 17, lvl: 1},
	{pts: [212, 226, 206, 180, 210, 138], w: 11, lvl: 2, tip: true},
	{pts: [212, 226, 170, 214, 134, 228], w: 10, lvl: 2, tip: true},
	{pts: [212, 226, 236, 192, 244, 158], w: 9, lvl: 2, tip: true},
	{pts: [240, 292, 232, 330, 226, 362], w: 19, lvl: 1},
	{pts: [226, 362, 186, 376, 146, 392], w: 12, lvl: 2, tip: true},
	{pts: [226, 362, 222, 410, 214, 450], w: 16, lvl: 2},
	{pts: [214, 450, 162, 474, 114, 494], w: 11, lvl: 3, tip: true},
	{pts: [214, 450, 206, 494, 196, 528], w: 11, lvl: 3, tip: true},
	{pts: [214, 450, 244, 482, 254, 514], w: 9, lvl: 3, tip: true},
	// poumon gauche
	{pts: [378, 300, 390, 266, 396, 226], w: 15, lvl: 1},
	{pts: [396, 226, 396, 180, 392, 138], w: 10, lvl: 2, tip: true},
	{pts: [396, 226, 436, 214, 474, 232], w: 10, lvl: 2, tip: true},
	{pts: [396, 226, 372, 192, 362, 158], w: 9, lvl: 2, tip: true},
	{pts: [378, 300, 420, 332, 462, 352], w: 11, lvl: 2, tip: true},
	{pts: [378, 300, 386, 352, 392, 410], w: 16, lvl: 1},
	{pts: [392, 410, 440, 446, 488, 480], w: 11, lvl: 2, tip: true},
	{pts: [392, 410, 400, 462, 410, 520], w: 11, lvl: 2, tip: true},
	{pts: [392, 410, 378, 450, 386, 498], w: 8, lvl: 2, tip: true},
];

/** Contour échantillonné d'un chemin « M … C … Z » (pour savoir si un point est dans le poumon). */
const sample = (d: string) => {
	const v = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
	const pts: [number, number][] = [[v[0], v[1]]];
	for (let i = 2; i + 5 < v.length; i += 6) {
		const [x0, y0] = pts[pts.length - 1];
		for (let k = 1; k <= 10; k++) {
			const t = k / 10;
			const u = 1 - t;
			pts.push([
				u * u * u * x0 + 3 * u * u * t * v[i] + 3 * u * t * t * v[i + 2] + t * t * t * v[i + 4],
				u * u * u * y0 + 3 * u * u * t * v[i + 1] + 3 * u * t * t * v[i + 3] + t * t * t * v[i + 5],
			]);
		}
	}
	return pts;
};
const POLYS = [sample(LUNG_R), sample(LUNG_L)];
const inPoly = (x: number, y: number, poly: [number, number][]) => {
	let c = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i];
		const [xj, yj] = poly[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
};
/** Dans un poumon, à `m` unités du bord au moins. */
const inside = (x: number, y: number, m = 10) =>
	POLYS.some((P) =>
		[
			[0, 0],
			[m, 0],
			[-m, 0],
			[0, m],
			[0, -m],
		].every(([dx, dy]) => inPoly(x + dx, y + dy, P)),
	);

/** Bronchioles : fourches au bout des bronches segmentaires et rameaux sur leurs flancs, qui restent dans le poumon. */
const growTree = () => {
	const segs: Seg[] = [];
	const tips: [number, number][] = [];
	let id = 0;
	const rec = (x: number, y: number, ang: number, len: number, w: number, lvl: number, depth: number) => {
		let grew = false;
		for (const s of [-1, 1]) {
			id++;
			for (const bend of [0, 0.35, -0.35]) {
				const a = ang + s * (0.42 + 0.22 * rnd(id)) + bend * s;
				const L = len * (0.85 + 0.3 * rnd(id, 1));
				const x2 = x + Math.cos(a) * L;
				const y2 = y + Math.sin(a) * L;
				if (!inside(x2, y2) || !inside((x + x2) / 2, (y + y2) / 2, 6)) continue;
				const mx = x + Math.cos(a - s * 0.18) * L * 0.55;
				const my = y + Math.sin(a - s * 0.18) * L * 0.55;
				segs.push({pts: [x, y, mx, my, x2, y2], w, lvl});
				grew = true;
				if (depth > 1) rec(x2, y2, a, len * 0.7, w * 0.66, lvl + 1, depth - 1);
				else tips.push([x2, y2]);
				break;
			}
		}
		if (!grew && depth < 3) tips.push([x, y]);
	};
	for (const sg of MAIN) {
		if (sg.lvl === 0) continue;
		const p = sg.pts;
		const n = p.length;
		const ang = Math.atan2(p[n - 1] - p[n - 3], p[n - 2] - p[n - 4]);
		if (sg.tip) rec(p[n - 2], p[n - 1], ang, 40, sg.w * 0.6, sg.lvl + 1, 3);
		// rameaux sur les flancs (à 55 % du segment, de chaque côté)
		const t = 0.55;
		const u = 1 - t;
		const x = u * u * p[0] + 2 * u * t * p[2] + t * t * p[4];
		const y = u * u * p[1] + 2 * u * t * p[3] + t * t * p[5];
		const dir = Math.atan2(p[5] - p[1], p[4] - p[0]);
		for (const s of [-1, 1]) rec(x, y, dir + s * 0.9, 34, sg.w * 0.5, sg.lvl + 1, 2);
	}
	return {segs, tips};
};
const TREE = growTree();
const LEVELS = 7;
/** Bout de bronchiole le plus proche d'un point (pour poser une étiquette sur une vraie grappe). */
const nearestTip = (x: number, y: number): [number, number] =>
	TREE.tips.reduce((b, t) => (Math.hypot(t[0] - x, t[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? t : b), TREE.tips[0]);
const nearestTwig = (x: number, y: number): [number, number] => {
	const mids = TREE.segs.filter((sg) => sg.lvl === 4).map((sg) => [sg.pts[2], sg.pts[3]] as [number, number]);
	return mids.reduce((b, t) => (Math.hypot(t[0] - x, t[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? t : b), mids[0]);
};

const segPath = (p: number[]) =>
	p.length >= 6 ? `M${p[0]} ${p[1]} Q${p[2]} ${p[3]} ${p[4]} ${p[5]}` : `M${p[0]} ${p[1]} L${p[2]} ${p[3]}`;

/** Bulles d'emphysème (poumons vus de face). */
const BULLAE: [number, number, number][] = [
	[176, 168, 20],
	[138, 262, 15],
	[198, 128, 11],
	[430, 172, 22],
	[472, 262, 14],
	[404, 128, 12],
	[120, 430, 12],
	[488, 410, 13],
];
/** Bouchons de mucus (sur les bronches lobaires). */
const PLUGS: [number, number][] = [
	[226, 262],
	[232, 330],
	[186, 376],
	[222, 410],
	[390, 266],
	[420, 332],
	[386, 352],
	[440, 446],
];

/** Tube de bronche : contour bleu nuit, paroi claire (rose si elle s'enflamme), passage d'air (bleu clair). */
const Tube: React.FC<{d: string; w: number; prog: number; copd: number}> = ({d, w, prog, copd}) => {
	if (prog <= 0.001) return null;
	const dash = {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - prog};
	return (
		<g fill="none" strokeLinecap="round" strokeLinejoin="round">
			<path d={d} {...dash} stroke={N} strokeWidth={w + 5 + 4 * copd} />
			<path d={d} {...dash} stroke={LPI.paper} strokeWidth={w + 1 + 4 * copd} />
			<path d={d} {...dash} stroke={LPI.pink} strokeWidth={w + 1 + 4 * copd} opacity={copd} />
			<path d={d} {...dash} stroke={alpha(N, 0.25)} strokeWidth={w + 1 + 4 * copd} opacity={copd * 0.6} />
			<path d={d} {...dash} stroke={LPI.sky} strokeWidth={Math.max(1, w * 0.42 * (1 - 0.55 * copd))} />
		</g>
	);
};

export type LungsArtProps = {
	/** l'arbre bronchique se dessine (0 → 1) */
	tree?: number;
	/** grappes d'alvéoles au bout des bronchioles */
	alveoli?: number;
	/** BPCO : paroi enflammée, passage étroit, mucus, poumons distendus et plus sombres, diaphragme aplati */
	copd?: number;
	/** emphysème : bulles (par défaut = copd) */
	emph?: number;
	/** air piégé : bulles qui restent coincées */
	trapped?: number;
	/** l'air circule dans les bronches (phase en frames ; null = immobile) ; `airOut` : il ressort */
	air?: number | null;
	airOut?: boolean;
	pleura?: number;
	diaphragm?: number;
	ribs?: number;
	/** scissures + noms des lobes */
	lobes?: number;
	/** gonflement à l'inspiration (0 → 1) */
	breath?: number;
	/** remplissage des poumons (0 = contour seul) */
	fill?: number;
};

/** Les poumons dessinés « La Petite IDE » (groupe SVG, repère 600 × 640). */
export const LungsArt: React.FC<LungsArtProps> = ({
	tree = 1,
	alveoli = 1,
	copd = 0,
	emph,
	trapped = 0,
	air = null,
	airOut = false,
	pleura = 0,
	diaphragm = 0,
	ribs = 0,
	lobes = 0,
	breath = 0,
	fill = 1,
}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const e = emph ?? copd;
	const prog = (lvl: number) => Math.min(1, Math.max(0, tree * LEVELS - lvl));
	const k = 1 + 0.04 * breath + 0.06 * copd;
	const flat = 26 * copd;
	const dia = `M30 ${566 + flat * 0.4} C110 ${520 + flat} 222 ${514 + flat} 300 ${548 + flat * 0.3} C378 ${514 + flat} 490 ${520 + flat} 570 ${566 + flat * 0.4}`;
	return (
		<g>
			<defs>
				<clipPath id={`lc${id}`}>
					<path d={LUNG_R} />
					<path d={LUNG_L} />
				</clipPath>
			</defs>
			{/* diaphragme (muscle en dôme sous les poumons) */}
			{diaphragm > 0 ? (
				<g opacity={diaphragm} fill="none" strokeLinecap="round">
					<path d={dia} stroke={N} strokeWidth={24} />
					<path d={dia} stroke={LPI.pink} strokeWidth={14} />
					<path d={dia} stroke={alpha(N, 0.2)} strokeWidth={14} strokeDasharray="3 9" />
				</g>
			) : null}
			<g transform={`translate(${CENTER[0]} ${CENTER[1]}) scale(${k}) translate(${-CENTER[0]} ${-CENTER[1]})`}>
				{/* plèvre : fine enveloppe autour de chaque poumon */}
				{pleura > 0 ? (
					<g opacity={pleura}>
						{[LUNG_R, LUNG_L].map((d) => (
							<path key={d} d={d} fill="none" stroke={N} strokeWidth={30} strokeLinejoin="round" />
						))}
						{[LUNG_R, LUNG_L].map((d) => (
							<path key={`p${d}`} d={d} fill="none" stroke={LPI.sky} strokeWidth={24} strokeLinejoin="round" />
						))}
					</g>
				) : null}
				{/* poumons */}
				{[LUNG_R, LUNG_L].map((d) => (
					<g key={d}>
						<path d={d} fill={LPI.paper} />
						<path d={d} fill={LPI.pink} opacity={0.62 * fill} />
						<path d={d} fill={N} opacity={0.16 * copd * fill} />
					</g>
				))}
				<g clipPath={`url(#lc${id})`} opacity={fill}>
					{/* reflets */}
					<ellipse cx={150} cy={250} rx={60} ry={120} fill={LPI.paper} opacity={0.28} transform="rotate(14 150 250)" />
					<ellipse cx={460} cy={250} rx={56} ry={116} fill={LPI.paper} opacity={0.28} transform="rotate(-14 460 250)" />
					{/* ombre du bord interne */}
					<path d={LUNG_R} fill="none" stroke={N} strokeWidth={26} opacity={0.06} />
					<path d={LUNG_L} fill="none" stroke={N} strokeWidth={26} opacity={0.06} />
				</g>
				{/* scissures */}
				{lobes > 0 ? (
					<g opacity={lobes} fill="none" stroke={N} strokeLinecap="round">
						{FISSURES.map((d) => (
							<path key={d} d={d} strokeWidth={4} strokeDasharray="10 7" opacity={0.6} />
						))}
					</g>
				) : null}
				{/* arbre bronchique : trachée */}
				<g opacity={Math.min(1, tree * 4)}>
					<rect x={280} y={18} width={40} height={232} rx={18} fill={LPI.paper} stroke={N} strokeWidth={6} />
					{Array.from({length: 11}, (_, i) => (
						<rect
							key={i}
							x={283}
							y={34 + i * 19}
							width={34}
							height={9}
							rx={4.5}
							fill={LPI.sky}
							stroke={N}
							strokeWidth={2.5}
						/>
					))}
				</g>
				{MAIN.map((s, i) => (
					<Tube key={i} d={segPath(s.pts)} w={s.w} prog={prog(s.lvl)} copd={copd} />
				))}
				<g clipPath={`url(#lc${id})`}>
					{TREE.segs.map((s, i) => (
						<Tube key={i} d={segPath(s.pts)} w={Math.max(2.5, s.w)} prog={prog(s.lvl)} copd={copd} />
					))}
					{/* alvéoles en grappes au bout des bronchioles (elles grossissent et se vident avec l'emphysème) */}
					{alveoli > 0
						? TREE.tips.map(([x, y], i) => {
								const o = Math.min(alveoli, prog(LEVELS - 1));
								// une grappe sur deux (une sur trois quand l'emphysème les a réunies en sacs)
								if (o <= 0 || i % (e > 0.5 ? 3 : 2) !== 0) return null;
								const r = 5.5 * (1 + 0.8 * e);
								const n = e > 0.5 ? 2 : 4;
								return (
									<g key={i} opacity={o}>
										{Array.from({length: n}, (_, j) => {
											const a = (j / n) * Math.PI * 2 + i;
											return (
												<circle
													key={j}
													cx={x + Math.cos(a) * r * 1.05}
													cy={y + Math.sin(a) * r * 1.05}
													r={r}
													fill={e > 0.5 ? alpha(LPI.paper, 0.7) : LPI.pink}
													stroke={N}
													strokeWidth={2.2}
												/>
											);
										})}
									</g>
								);
							})
						: null}
					{/* mucus dans les bronches */}
					{copd > 0
						? PLUGS.map(([x, y], i) => (
								<ellipse
									key={i}
									cx={x}
									cy={y}
									rx={9 * copd}
									ry={6.5 * copd}
									fill={LPI.sky}
									stroke={N}
									strokeWidth={2.5}
									opacity={Math.min(1, copd * 1.5)}
								/>
							))
						: null}
					{/* emphysème : bulles là où les alvéoles ont cassé */}
					{e > 0
						? BULLAE.map(([x, y, r], i) => {
								const s = Math.min(1, Math.max(0, e * 1.6 - i * 0.08));
								if (s <= 0) return null;
								return (
									<g key={i}>
										<circle cx={x} cy={y} r={r * s} fill={alpha(LPI.paper, 0.92)} stroke={N} strokeWidth={3} />
										<path
											d={`M${x - r * 0.5 * s} ${y - r * 0.15 * s} q${r * 0.3 * s} ${-r * 0.35 * s} ${r * 0.6 * s} ${-r * 0.1 * s}`}
											stroke={alpha(N, 0.4)}
											strokeWidth={2}
											fill="none"
										/>
									</g>
								);
							})
						: null}
					{/* air piégé */}
					{trapped > 0
						? BULLAE.concat(PLUGS.map(([x, y]) => [x + 22, y + 18, 9] as [number, number, number])).map(([x, y], i) => {
								const o = Math.min(1, Math.max(0, trapped * 14 - i));
								return (
									<circle
										key={`t${i}`}
										cx={x + 14 + Math.sin(frame / 6 + i) * 2}
										cy={y + 20 + Math.cos(frame / 7 + i) * 2}
										r={7}
										fill={LPI.paper}
										stroke={LPI.blue}
										strokeWidth={3}
										opacity={o}
									/>
								);
							})
						: null}
				</g>
				{/* l'air qui circule (petits traits dans le passage) */}
				{air !== null
					? MAIN.map((s, i) => (
							<path
								key={`a${i}`}
								d={segPath(s.pts)}
								fill="none"
								stroke={LPI.blue}
								strokeWidth={Math.max(2, s.w * 0.22)}
								strokeLinecap="round"
								strokeDasharray="0.04 0.12"
								pathLength={1}
								strokeDashoffset={(airOut ? 1 : -1) * ((air * (1 - 0.6 * copd)) / 60)}
								opacity={prog(s.lvl)}
							/>
						))
					: null}
				{/* contours par-dessus */}
				{[LUNG_R, LUNG_L].map((d) => (
					<path key={`o${d}`} d={d} fill="none" stroke={N} strokeWidth={6} strokeLinejoin="round" />
				))}
				{/* noms des lobes */}
				{lobes > 0
					? LOBE_NAMES.map(([x, y, a, b]) => (
							<text
								key={`${x}${y}`}
								x={x}
								y={y}
								textAnchor="middle"
								fontFamily={FONT.body}
								fontWeight={800}
								fontSize={19}
								fill={alpha(N, 0.75)}
								stroke={LPI.paper}
								strokeWidth={6}
								paintOrder="stroke"
								strokeLinejoin="round"
								opacity={lobes}
							>
								<tspan x={x} dy={0}>
									{a}
								</tspan>
								<tspan x={x} dy={21}>
									{b}
								</tspan>
							</text>
						))
					: null}
			</g>
			{/* côtes (devant les poumons) */}
			{ribs > 0 ? (
				<g opacity={ribs} fill="none" strokeLinecap="round">
					{Array.from({length: 8}, (_, i) => {
						const y = 120 + i * 52;
						const w = 190 + i * 14;
						return [-1, 1].map((s) => {
							const d = `M${300 + s * 34} ${y} C${300 + s * 120} ${y - 26} ${300 + s * (w + 20)} ${y - 6} ${300 + s * (w + 40)} ${y + 44}`;
							return (
								<g key={`${i}${s}`}>
									<path d={d} stroke={N} strokeWidth={17} />
									<path d={d} stroke={LPI.paper} strokeWidth={11} />
								</g>
							);
						});
					})}
					{/* sternum */}
					<rect x={286} y={110} width={28} height={330} rx={12} fill={LPI.paper} stroke={N} strokeWidth={5} />
				</g>
			) : null}
		</g>
	);
};

/* ═══════════════════════════════ ÉTIQUETTES ═══════════════════════════════ */
export type LungLabel = 'trachee' | 'bronche' | 'bronchiole' | 'alveoles' | 'plevre' | 'diaphragme' | 'cotes';
const LABELS: Record<LungLabel, {pt: [number, number]; side: 'L' | 'R'; y: number; text: string}> = {
	trachee: {pt: [320, 92], side: 'R', y: 62, text: 'trachée'},
	bronche: {pt: [262, 276], side: 'L', y: 300, text: 'bronche'},
	bronchiole: {pt: nearestTwig(470, 220), side: 'R', y: 196, text: 'bronchiole'},
	alveoles: {pt: nearestTip(500, 460), side: 'R', y: 452, text: 'alvéoles'},
	plevre: {pt: [70, 440], side: 'L', y: 440, text: 'plèvre'},
	diaphragme: {pt: [150, 560], side: 'L', y: 612, text: 'diaphragme'},
	cotes: {pt: [96, 230], side: 'L', y: 190, text: 'côtes'},
};
const LabelTag: React.FC<{k: LungLabel; at: number}> = ({k, at: t0}) => {
	const frame = useCurrentFrame();
	const L = LABELS[k];
	const s = popAt(frame, t0);
	if (s <= 0) return null;
	const fs = 26;
	const w = L.text.length * fs * 0.6 + 34;
	const x0 = L.side === 'L' ? 34 - w : 566;
	const ex = L.side === 'L' ? 34 : 566;
	const line = Math.min(1, (frame - t0) / 6);
	return (
		<g>
			<path
				d={`M${L.pt[0]} ${L.pt[1]} L${L.pt[0] + (ex - L.pt[0]) * line} ${L.pt[1] + (L.y - L.pt[1]) * line}`}
				stroke={N}
				strokeWidth={4}
				strokeLinecap="round"
			/>
			<circle cx={L.pt[0]} cy={L.pt[1]} r={7} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<g transform={`translate(${ex} ${L.y}) scale(${s}) translate(${-ex} ${-L.y})`}>
				<rect x={x0} y={L.y - 24} width={w} height={48} rx={24} fill={LPI.paper} stroke={N} strokeWidth={4} />
				<text
					x={x0 + w / 2}
					y={L.y + 9}
					textAnchor="middle"
					fontFamily={FONT.body}
					fontWeight={800}
					fontSize={fs}
					fill={N}
				>
					{L.text}
				</text>
			</g>
		</g>
	);
};

/** Poumons autonomes (svg). `labels` : étiquette → frame d'apparition (la planche s'élargit pour les loger). */
export const Lungs: React.FC<LungsArtProps & {width?: number; labels?: Partial<Record<LungLabel, number>>}> = ({
	width = 600,
	labels,
	...art
}) => {
	const vb = labels ? [-200, 0, 1000, 660] : [0, 0, 600, 640];
	return (
		<svg
			width={width}
			height={(width * vb[3]) / vb[2]}
			viewBox={vb.join(' ')}
			style={{overflow: 'visible', display: 'block'}}
		>
			<LungsArt {...art} />
			{labels
				? (Object.entries(labels) as [LungLabel, number][]).map(([k, t]) => <LabelTag key={k} k={k} at={t} />)
				: null}
		</svg>
	);
};

/* ═══════════════════════════════ GROS PLAN : ALVÉOLES ═══════════════════════════════ */
const SACS: [number, number][] = [
	[276, 128],
	[262, 286],
	[112, 296],
];
const RING = Array.from({length: 8}, (_, i) => (i / 8) * Math.PI * 2 + 0.3);

/**
 * Grappes d'alvéoles au bout d'une bronchiole (viewBox 400 × 400). `vessels` : vaisseaux sanguins autour ;
 * `o2` : phase (frames) de l'O₂ qui passe dans le sang (null = immobile) ; `emph` : les parois cassent, les alvéoles se
 * réunissent en grands sacs ; `trapped` : air emprisonné (flèches qui tournent).
 */
export const AlveoliZoom: React.FC<{
	size?: number;
	emph?: number;
	trapped?: number;
	vessels?: number;
	o2?: number | null;
	airIn?: number | null;
}> = ({size = 400, emph = 0, trapped = 0, vessels = 1, o2 = null, airIn = null}) => {
	const frame = useCurrentFrame();
	const e = emph;
	const r = 27 * (1 + 0.75 * e);
	const spread = 44 * (1 + 0.42 * e);
	const circles = SACS.flatMap(([cx, cy]) => [
		[cx, cy] as [number, number],
		...RING.map((a) => [cx + Math.cos(a) * spread, cy + Math.sin(a) * spread] as [number, number]),
	]);
	const ducts = SACS.map(([x, y]) => `M150 172 Q${(150 + x) / 2 + 10} ${(172 + y) / 2 - 12} ${x} ${y}`);
	const bron = 'M-30 30 Q70 70 150 172';
	return (
		<svg width={size} height={size} viewBox="0 0 400 400" style={{overflow: 'visible', display: 'block'}}>
			{/* bronchiole et canaux */}
			{[bron, ...ducts].map((d, i) => (
				<g key={d} fill="none" strokeLinecap="round">
					<path d={d} stroke={N} strokeWidth={i === 0 ? 46 : 32} />
					<path d={d} stroke={LPI.paper} strokeWidth={i === 0 ? 36 : 23} />
					<path d={d} stroke={LPI.sky} strokeWidth={i === 0 ? 14 : 9} />
				</g>
			))}
			{/* alvéoles : contour d'ensemble (union) puis remplissage, puis parois internes */}
			{circles.map(([x, y], i) => (
				<circle key={`s${i}`} cx={x} cy={y} r={r} fill={N} stroke={N} strokeWidth={12} />
			))}
			{circles.map(([x, y], i) => (
				<circle key={`f${i}`} cx={x} cy={y} r={r} fill={LPI.paper} />
			))}
			{circles.map(([x, y], i) => (
				<circle key={`p${i}`} cx={x} cy={y} r={r} fill={LPI.pink} opacity={0.85 * (1 - 0.75 * e)} />
			))}
			{circles.map(([x, y], i) => (
				<circle
					key={`w${i}`}
					cx={x}
					cy={y}
					r={r}
					fill="none"
					stroke={N}
					strokeWidth={3.5}
					opacity={Math.max(0, 1 - 1.6 * e)}
				/>
			))}
			{/* morceaux de parois cassées */}
			{e > 0
				? circles.map(([x, y], i) =>
						i % 3 === 1 ? (
							<path
								key={`b${i}`}
								d={`M${x - 8} ${y - 6} l10 5 l-4 9`}
								fill="none"
								stroke={N}
								strokeWidth={3}
								strokeLinecap="round"
								opacity={Math.min(1, e * 2) * (1 - Math.max(0, e - 0.8) * 3)}
							/>
						) : null,
					)
				: null}
			{/* reflets */}
			{circles.map(([x, y], i) => (
				<ellipse
					key={`h${i}`}
					cx={x - r * 0.3}
					cy={y - r * 0.35}
					rx={r * 0.28}
					ry={r * 0.18}
					fill={LPI.paper}
					opacity={0.55 * (1 - e)}
				/>
			))}
			{/* vaisseaux sanguins qui entourent les alvéoles */}
			{vessels > 0
				? SACS.map(([x, y], i) => (
						<g key={`v${i}`} fill="none" strokeLinecap="round" opacity={vessels * (1 - 0.5 * e)}>
							<path
								d={`M${x - 80} ${y + 30} C${x - 40} ${y - 70} ${x + 40} ${y + 70} ${x + 84} ${y - 26}`}
								stroke={N}
								strokeWidth={10}
							/>
							<path
								d={`M${x - 80} ${y + 30} C${x - 40} ${y - 70} ${x + 40} ${y + 70} ${x + 84} ${y - 26}`}
								stroke={LPI.blue}
								strokeWidth={5}
							/>
							<path
								d={`M${x - 70} ${y - 50} C${x - 10} ${y - 10} ${x + 10} ${y + 30} ${x + 50} ${y + 80}`}
								stroke={N}
								strokeWidth={10}
							/>
							<path
								d={`M${x - 70} ${y - 50} C${x - 10} ${y - 10} ${x + 10} ${y + 30} ${x + 50} ${y + 80}`}
								stroke={LPI.pink}
								strokeWidth={5}
							/>
						</g>
					))
				: null}
			{/* l'air qui arrive par la bronchiole */}
			{airIn !== null
				? Array.from({length: 5}, (_, i) => {
						const t = (((airIn / 40 + i / 5) % 1) + 1) % 1;
						const x = -30 + 180 * t;
						const y = 30 + 142 * t * t * 0.6 + 142 * 0.4 * t;
						return <circle key={`ai${i}`} cx={x} cy={y} r={6} fill={LPI.blue} opacity={Math.sin(Math.PI * t)} />;
					})
				: null}
			{/* O₂ qui passe dans le sang */}
			{o2 !== null
				? SACS.flatMap(([x, y], i) =>
						Array.from({length: Math.round(4 * (1 - 0.7 * e))}, (_, j) => {
							const t = (((o2 / 36 + j / 4 + i * 0.3) % 1) + 1) % 1;
							const a = j * 1.7 + i;
							return (
								<circle
									key={`o${i}${j}`}
									cx={x + Math.cos(a) * 70 * t}
									cy={y + Math.sin(a) * 70 * t}
									r={5}
									fill={LPI.blue}
									stroke={LPI.paper}
									strokeWidth={2}
									opacity={Math.sin(Math.PI * t)}
								/>
							);
						}),
					)
				: null}
			{/* air emprisonné : flèches qui tournent en rond dans les sacs */}
			{trapped > 0
				? SACS.map(([x, y], i) => (
						<g
							key={`t${i}`}
							transform={`translate(${x} ${y}) rotate(${frame * 6 + i * 90}) scale(${Math.min(1, trapped * 3 - i)})`}
							opacity={Math.min(1, trapped * 3 - i)}
						>
							<circle r={30} fill={alpha(LPI.paper, 0.85)} stroke={LPI.blue} strokeWidth={3} />
							<path d="M0 -18 A18 18 0 1 1 -17 6" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
							<path
								d="M-24 0 L-17 9 L-8 2"
								fill="none"
								stroke={LPI.blue}
								strokeWidth={5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</g>
					))
				: null}
		</svg>
	);
};

/* ═══════════════════════════════ GROS PLAN : BRONCHE EN COUPE ═══════════════════════════════ */
/** Contour du passage d'air : ellipse ondulée (8 plis) qui devient une étoile quand le muscle se contracte. */
const lumenPath = (cx: number, cy: number, r0: number, amp: number, ry = 0.68) =>
	Array.from({length: 97}, (_, i) => {
		const a = (i / 96) * Math.PI * 2;
		const r = r0 * (1 + amp * Math.cos(8 * a));
		return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r * ry).toFixed(1)}`;
	}).join(' ') + ' Z';

/**
 * Bronche en coupe, vue de trois quarts (viewBox 320 × 400). `inflame` : la paroi s'épaissit et rougit ; `squeeze` :
 * le muscle se contracte (passage en étoile) ; `mucus` : mucus qui encombre et coule.
 */
export const AirwayCross: React.FC<{size?: number; inflame?: number; squeeze?: number; mucus?: number}> = ({
	size = 320,
	inflame = 0,
	squeeze = 0,
	mucus = 0,
}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const cx = 160;
	const cy = 262;
	const R = 104;
	const wall = interpolate(inflame, [0, 1], [0, 1], clamp);
	const r0 = 56 - 20 * wall - 12 * squeeze;
	const amp = 0.05 + 0.18 * squeeze + 0.06 * wall;
	const drip = mucus * (30 + 6 * Math.sin(frame / 8));
	const ring = (t: number) => {
		const y = 50 + t * 196;
		const rx = 80 + t * 24;
		return `M${cx - rx} ${y} A${rx} ${26 + t * 40} 0 0 0 ${cx + rx} ${y}`;
	};
	return (
		<svg width={size} height={(size * 400) / 320} viewBox="0 0 320 400" style={{overflow: 'visible', display: 'block'}}>
			{/* corps du tube */}
			<path
				d={`M80 50 L${cx - R} ${cy} A${R} ${R * 0.68} 0 0 0 ${cx + R} ${cy} L240 50 Z`}
				fill={LPI.pink}
				stroke={N}
				strokeWidth={6}
				strokeLinejoin="round"
			/>
			<path
				d={`M80 50 L${cx - R} ${cy} A${R} ${R * 0.68} 0 0 0 ${cx + R} ${cy} L240 50 Z`}
				fill={N}
				opacity={0.12 * wall}
			/>
			<ellipse cx={cx} cy={50} rx={80} ry={26} fill={alpha(N, 0.7)} stroke={N} strokeWidth={6} />
			<defs>
				<clipPath id={`ab${id}`}>
					<path d={`M80 50 L${cx - R} ${cy} A${R} ${R * 0.68} 0 0 0 ${cx + R} ${cy} L240 50 Z`} />
				</clipPath>
			</defs>
			{/* anneaux de cartilage (dans le tube) */}
			<g clipPath={`url(#ab${id})`}>
				{[0.2, 0.45, 0.7].map((t) => (
					<g key={t} fill="none" strokeLinecap="round">
						<path d={ring(t)} stroke={N} strokeWidth={22} />
						<path d={ring(t)} stroke={LPI.paper} strokeWidth={14} />
					</g>
				))}
			</g>
			{/* face coupée : paroi, muscle, muqueuse, passage */}
			<ellipse cx={cx} cy={cy} rx={R} ry={R * 0.68} fill={LPI.pink} stroke={N} strokeWidth={6} />
			<ellipse cx={cx} cy={cy} rx={R} ry={R * 0.68} fill={N} opacity={0.12 * wall} />
			<ellipse
				cx={cx}
				cy={cy}
				rx={R - 18}
				ry={(R - 18) * 0.68}
				fill="none"
				stroke={alpha(N, 0.4)}
				strokeWidth={7 + 9 * squeeze}
			/>
			<path d={lumenPath(cx, cy, r0 + 12, amp)} fill={LPI.paper} opacity={0.5} />
			<path d={lumenPath(cx, cy, r0, amp)} fill={N} stroke={N} strokeWidth={4} />
			<ellipse cx={cx - r0 * 0.2} cy={cy - r0 * 0.15} rx={r0 * 0.5} ry={r0 * 0.3} fill={LPI.blue} opacity={0.35} />
			{/* mucus */}
			{mucus > 0 ? (
				<g>
					<path
						d={`M${cx - 30 * mucus} ${cy + 8} C${cx - 26 * mucus} ${cy + 30 * mucus} ${cx + 30 * mucus} ${cy + 30 * mucus} ${cx + 30 * mucus} ${cy + 6} C${cx + 10} ${cy - 8 * mucus} ${cx - 14} ${cy - 6 * mucus} ${cx - 30 * mucus} ${cy + 8} Z`}
						fill={LPI.sky}
						stroke={N}
						strokeWidth={3}
					/>
					<path
						d={`M${cx + 4} ${cy + 22 * mucus} C${cx + 14} ${cy + 40 + drip * 0.4} ${cx + 12} ${cy + 50 + drip} ${cx + 6} ${cy + 58 + drip} C${cx} ${cy + 50 + drip} ${cx - 4} ${cy + 40 + drip * 0.4} ${cx + 4} ${cy + 22 * mucus} Z`}
						fill={LPI.sky}
						stroke={N}
						strokeWidth={3}
						opacity={Math.min(1, mucus * 2)}
					/>
				</g>
			) : null}
			{/* inflammation : petits éclats sur la paroi */}
			{wall > 0
				? [0.3, 1.4, 2.5, 3.6, 4.7, 5.6].map((a) => (
						<circle
							key={a}
							cx={cx + Math.cos(a) * (R - 8)}
							cy={cy + Math.sin(a) * (R - 8) * 0.68}
							r={4 * wall}
							fill={N}
							opacity={0.35 * wall}
						/>
					))
				: null}
		</svg>
	);
};

/* ═══════════════════════════════ LOUPE RONDE ═══════════════════════════════ */
/**
 * Loupe ronde (HTML) reliée par deux traits au point grossi (comme les planches de cours). `ax, ay` : point grossi ;
 * `cx, cy, r` : loupe ; `w, h` : taille du calque (par défaut l'écran).
 */
export const ZoomBubble: React.FC<{
	at: number;
	until?: number;
	ax: number;
	ay: number;
	cx: number;
	cy: number;
	r: number;
	w?: number;
	h?: number;
	children: React.ReactNode;
	bg?: string;
}> = ({at: t0, until = 1e9, ax, ay, cx, cy, r, w = 1080, h = 1920, children, bg = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > until + 8) return null;
	const out = interpolate(frame, [until, until + 8], [1, 0], clamp);
	const s = popAt(frame, t0 + 4) * (0.8 + 0.2 * out);
	const line = interpolate(frame, [t0, t0 + 6], [0, 1], clamp);
	const d = Math.hypot(ax - cx, ay - cy);
	const phi = Math.atan2(ay - cy, ax - cx);
	const al = Math.acos(Math.min(1, r / Math.max(d, r + 1)));
	const pts = [phi - al, phi + al].map((a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, opacity: out}}>
			<svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{pts.map(([x, y], i) => (
					<path
						key={i}
						d={`M${ax} ${ay} L${ax + (x - ax) * line} ${ay + (y - ay) * line}`}
						stroke={N}
						strokeWidth={5}
						strokeLinecap="round"
					/>
				))}
				<circle cx={ax} cy={ay} r={16} fill={alpha(LPI.paper, 0.4)} stroke={N} strokeWidth={5} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: cx - r,
					top: cy - r,
					width: 2 * r,
					height: 2 * r,
					borderRadius: r,
					border: `8px solid ${N}`,
					boxSizing: 'border-box',
					background: bg,
					overflow: 'hidden',
					boxShadow: SHADOW,
					transform: `scale(${s})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{children}
			</div>
		</div>
	);
};

/* ═══════════════════════════════ RADIO DU THORAX ═══════════════════════════════ */
/** Place les poumons dessinés (repère 600 × 640) dans le thorax du `Patient` (repère 400 × 560). */
export const LUNGS_IN_PATIENT = {x: 81, y: 185.5, s: 0.397};
const XMAP = `translate(${LUNGS_IN_PATIENT.x} ${LUNGS_IN_PATIENT.y}) scale(${LUNGS_IN_PATIENT.s})`;

/**
 * Radio du thorax, à poser exactement par-dessus le `Patient` (même `size`, même position). `scan` (0 → 1) : la ligne
 * de balayage descend, la radio apparaît au-dessus d'elle ; `xray` : opacité de la radio ; `reveal` : les poumons en
 * couleur se découvrent à leur place (avec les props de `LungsArt` : `copd`, `tree`, `trapped`…).
 */
export const ChestXRay: React.FC<{size?: number; scan?: number; xray?: number; reveal?: number} & LungsArtProps> = ({
	size = 360,
	scan = 1,
	xray = 1,
	reveal = 0,
	...art
}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const y0 = 150;
	const y1 = 440;
	const sy = y0 + (y1 - y0) * scan;
	const ribs = Array.from({length: 9}, (_, i) => 226 + i * 22);
	return (
		<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`xt${id}`}>
					<path d={TORSO} />
				</clipPath>
				<clipPath id={`xs${id}`}>
					<rect x={0} y={0} width={400} height={sy} />
				</clipPath>
				<radialGradient id={`xg${id}`} cx="0.5" cy="0.45" r="0.6">
					<stop offset="0" stopColor={LPI.blue} stopOpacity={0.45} />
					<stop offset="1" stopColor={N} stopOpacity={0} />
				</radialGradient>
			</defs>
			{xray > 0 ? (
				<g clipPath={`url(#xt${id})`} opacity={xray}>
					<g clipPath={`url(#xs${id})`}>
						<rect x={0} y={140} width={400} height={420} fill={N} />
						<rect x={0} y={140} width={400} height={420} fill={`url(#xg${id})`} />
						{/* poumons : sombres (l'air laisse passer les rayons) */}
						<g transform={XMAP}>
							{[LUNG_R, LUNG_L].map((d) => (
								<path key={`x${d}`} d={d} fill={N} stroke={alpha(LPI.sky, 0.35)} strokeWidth={8} />
							))}
							{/* trachée et bronches en clair */}
							<rect x={284} y={18} width={32} height={232} rx={14} fill={alpha(LPI.sky, 0.25)} />
							{MAIN.map((s, i) => (
								<path
									key={i}
									d={segPath(s.pts)}
									fill="none"
									stroke={alpha(LPI.sky, 0.4)}
									strokeWidth={Math.max(3, s.w * 0.55)}
									strokeLinecap="round"
								/>
							))}
							{TREE.segs.map((s, i) => (
								<path
									key={`t${i}`}
									d={segPath(s.pts)}
									fill="none"
									stroke={alpha(LPI.sky, 0.22)}
									strokeWidth={3}
									strokeLinecap="round"
								/>
							))}
						</g>
						{/* cœur (ombre claire) */}
						<ellipse cx={214} cy={340} rx={42} ry={50} fill={alpha(LPI.sky, 0.32)} transform="rotate(-18 214 340)" />
						{/* colonne vertébrale */}
						{Array.from({length: 14}, (_, i) => (
							<rect
								key={`v${i}`}
								x={191}
								y={196 + i * 21}
								width={18}
								height={16}
								rx={5}
								fill={alpha(LPI.paper, 0.55)}
							/>
						))}
						{/* clavicules */}
						{[-1, 1].map((s) => (
							<path
								key={`c${s}`}
								d={`M${200 + s * 10} 222 C${200 + s * 40} 214 ${200 + s * 70} 214 ${200 + s * 96} 206`}
								fill="none"
								stroke={alpha(LPI.paper, 0.85)}
								strokeWidth={9}
								strokeLinecap="round"
							/>
						))}
						{/* côtes */}
						{ribs.map((y, i) =>
							[-1, 1].map((s) => (
								<path
									key={`r${i}${s}`}
									d={`M${200 + s * 10} ${y} C${200 + s * 40} ${y - 14} ${200 + s * (78 + i * 2)} ${y - 10} ${200 + s * (92 + i * 1.5)} ${y + 18}`}
									fill="none"
									stroke={alpha(LPI.paper, 0.72)}
									strokeWidth={6}
									strokeLinecap="round"
								/>
							)),
						)}
					</g>
				</g>
			) : null}
			{/* ligne de balayage */}
			{scan > 0 && scan < 1 ? (
				<g clipPath={`url(#xt${id})`}>
					<rect x={0} y={sy - 14} width={400} height={14} fill={alpha(LPI.sky, 0.35)} />
					<rect x={0} y={sy - 3} width={400} height={5} fill={LPI.sky} />
					<rect x={0} y={sy - 1} width={400} height={2} fill={LPI.paper} opacity={0.6 + 0.4 * Math.sin(frame)} />
				</g>
			) : null}
			{/* les poumons en couleur se découvrent */}
			{reveal > 0 ? (
				<g transform={XMAP} opacity={reveal}>
					<LungsArt {...art} />
				</g>
			) : null}
		</svg>
	);
};
