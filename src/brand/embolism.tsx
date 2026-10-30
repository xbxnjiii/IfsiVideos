// Briques « embolie pulmonaire » réutilisables : corps entier (le `Patient` + des jambes), veine profonde de la
// jambe, caillot qui remonte (veine → cœur droit → artère pulmonaire) et se coince dans le poumon (zone privée de
// sang), mollet gonflé, bas de contention ; position demi-assise ; scanner des poumons.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LUNGS, Patient, PatientProps} from './patient';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/** Espace du corps entier : 400 × 940 (le `Patient` occupe 400 × 560 en haut, les jambes dessous). */
export const BODY = {w: 400, h: 940};
export const bodyPx = (x: number, y: number, size: number) => ({x: (x * size) / BODY.w, y: (y * size) / BODY.w});

/** Trajet du caillot : mollet → veine profonde → veine cave → cœur droit → artère pulmonaire → coincé dans le poumon. */
const PATH: [number, number][] = [
	[150, 820],
	[146, 735],
	[142, 640],
	[152, 548],
	[182, 470],
	[186, 380],
	[204, 322],
	[222, 306],
	[212, 268],
	[200, 256],
	[172, 272],
	[158, 294],
];
const LENS = PATH.slice(1).map(([x, y], i) => Math.hypot(x - PATH[i][0], y - PATH[i][1]));
const TOTAL = LENS.reduce((a, b) => a + b, 0);
/** part du trajet (0 → 1) parcourue au point i du trajet */
const tAt = (i: number) => LENS.slice(0, i).reduce((a, b) => a + b, 0) / TOTAL;
/** repères du trajet : mollet, cœur (ventricule droit), coincé */
export const CLOT_T = {calf: 0, heart: tAt(7), lodge: 1};
/** position du caillot (espace du corps) à la part t du trajet */
export const clotAt = (t: number): [number, number] => {
	let d = Math.max(0, Math.min(1, t)) * TOTAL;
	for (let i = 0; i < LENS.length; i++) {
		if (d <= LENS[i] || i === LENS.length - 1) {
			const k = Math.min(1, d / LENS[i]);
			return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * k, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * k];
		}
		d -= LENS[i];
	}
	return PATH[PATH.length - 1];
};
const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
const VEIN = line(PATH.slice(0, 8));
const PULM = ['M222 306 L212 268 L200 256 L172 272 L150 300 L138 334', 'M172 272 L162 322', 'M200 256 L228 272 L250 300 L262 334', 'M228 272 L240 322'];
/** branche bouchée (au-delà du caillot) */
const BLOCKED = 'M158 294 L150 300 L138 334 M158 294 L162 322';

const Tube: React.FC<{d: string; color: string; o: number; phase?: number; width?: number}> = ({d, color, o, phase, width = 9}) => (
	<g opacity={o}>
		<path d={d} fill="none" stroke={alpha(LPI.paper, 0.95)} strokeWidth={width + 7} strokeLinecap="round" strokeLinejoin="round" />
		<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
		{phase !== undefined ? <path d={d} fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" strokeDasharray="3 22" strokeDashoffset={-phase} opacity={0.55} /> : null}
	</g>
);

/** Éclair « douleur » (espace du corps). */
const Zap: React.FC<{x: number; y: number; o: number; s?: number}> = ({x, y, o, s = 1}) => {
	const frame = useCurrentFrame();
	if (o <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s * (1 + 0.12 * Math.sin(frame / 2))})`} opacity={o}>
			<path d="M0 -26 L8 -6 L24 -10 L10 4 L20 22 L2 12 L-6 30 L-6 10 L-24 14 L-10 0 L-22 -14 L-4 -8 Z" fill={LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
		</g>
	);
};

export type FullBodyProps = {
	size: number;
	patient?: PatientProps;
	/** veine profonde de la jambe (0 → 1) et avancée du sang dedans */
	vein?: number;
	veinPhase?: number;
	/** artères pulmonaires (0 → 1) */
	pulm?: number;
	/** caillot : visible (0 → 1), part du trajet parcourue, taille (0 → 1 : il grossit) */
	clot?: number;
	clotT?: number;
	clotGrow?: number;
	/** le caillot bouche l'artère : la zone du poumon derrière n'a plus de sang (0 → 1) */
	lodged?: number;
	/** mollet gonflé et rouge (phlébite) ; douleur au mollet, à la poitrine */
	swell?: number;
	calfPain?: number;
	chestPain?: number;
	/** bas de contention (0 → 1) */
	stocking?: number;
};

/** Corps entier vu de face : jambes (short, mollets, chaussures) sous le `Patient`, puis veine, artères pulmonaires et caillot. */
export const FullBody: React.FC<FullBodyProps> = ({size, patient = {}, vein = 0, veinPhase, pulm = 0, clot = 0, clotT = 0, clotGrow = 1, lodged = 0, swell = 0, calfPain = 0, chestPain = 0, stocking = 0}) => {
	const frame = useCurrentFrame();
	const h = (size * BODY.h) / BODY.w;
	const [cx, cy] = clotAt(clotT);
	const calves: [number, number][] = [
		[146, 790],
		[254, 790],
	];
	const shins = ['M146 730 L150 892', 'M254 730 L250 892'];
	const legShapes = (fill: string, stroke: string, sw: number, k: number) => (
		<>
			<path d={shins[k]} stroke={stroke === 'none' ? fill : stroke} strokeWidth={sw === 0 ? 62 : 62 + sw} strokeLinecap="round" fill="none" />
			<ellipse cx={calves[k][0]} cy={calves[k][1]} rx={36 * (1 + (k === 0 ? 0.3 * swell : 0))} ry={58} fill={fill} stroke={stroke} strokeWidth={sw} />
		</>
	);
	return (
		<div style={{position: 'relative', width: size, height: h}}>
			{/* jambes (sous le patient) */}
			<svg width={size} height={h} viewBox={`0 0 ${BODY.w} ${BODY.h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{/* haut du short (entre les cuisses) */}
				<path d="M96 520 H304 L300 640 C270 640 230 630 200 600 C170 630 130 640 100 640 Z" fill={LPI.blue} stroke={N} strokeWidth={7} strokeLinejoin="round" />
				{[0, 1].map((k) => (
					<g key={k}>
						{legShapes(N, N, 14, k)}
						{legShapes(LPI.paper, 'none', 0, k)}
						<g opacity={0.3}>{legShapes(LPI.pink, 'none', 0, k)}</g>
						{k === 0 && swell > 0 ? <g opacity={0.45 * swell}>{legShapes(LPI.pink, 'none', 0, k)}</g> : null}
						{stocking > 0 ? (
							<g opacity={stocking}>
								<path d={shins[k]} stroke={LPI.sky} strokeWidth={62} strokeLinecap="round" fill="none" />
								<ellipse cx={calves[k][0]} cy={calves[k][1]} rx={36} ry={58} fill={LPI.sky} />
								<path d={`M${calves[k][0] - 34} 770 H${calves[k][0] + 34} M${calves[k][0] - 30} 820 H${calves[k][0] + 30} M${calves[k][0] - 26} 860 H${calves[k][0] + 26}`} stroke={alpha(N, 0.35)} strokeWidth={5} />
							</g>
						) : null}
						{/* short */}
						<path d={k === 0 ? 'M140 520 L146 732' : 'M260 520 L254 732'} stroke={N} strokeWidth={106} strokeLinecap="butt" />
						<path d={k === 0 ? 'M140 520 L146 726' : 'M260 520 L254 726'} stroke={LPI.blue} strokeWidth={92} strokeLinecap="butt" />
						{/* chaussure */}
						<ellipse cx={k === 0 ? 142 : 258} cy={914} rx={46} ry={20} fill={N} />
					</g>
				))}
			</svg>
			<div style={{position: 'absolute', left: 0, top: 0}}>
				<Patient size={size} {...patient} fade={false} />
			</div>
			{/* veine, artères pulmonaires, caillot, douleurs */}
			<svg width={size} height={h} viewBox={`0 0 ${BODY.w} ${BODY.h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{vein > 0 ? <Tube d={VEIN} color={LPI.blue} o={vein} phase={veinPhase ?? frame * 2} /> : null}
				{lodged > 0 ? (
					<path d={LUNGS[0]} fill={alpha(N, 0.35 * lodged)} stroke={LPI.pink} strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={frame * 2} opacity={lodged} />
				) : null}
				{pulm > 0
					? PULM.map((d) => <Tube key={d} d={d} color={LPI.pink} o={pulm} width={8} />)
					: null}
				{pulm > 0 && lodged > 0 ? <Tube d={BLOCKED} color={LPI.sky} o={Math.min(pulm, lodged)} width={8} /> : null}
				{clot > 0 ? (
					<g transform={`translate(${cx} ${cy}) scale(${(0.35 + 0.65 * clotGrow) * (1 + 0.06 * Math.sin(frame / 3))})`} opacity={Math.min(1, clot * 1.5)}>
						<circle r={24} fill={alpha(LPI.pink, 0.35 * (0.6 + 0.4 * Math.sin(frame / 4)))} />
						<path d="M-15 -4 C-13 -15 4 -17 13 -9 C19 -1 13 12 2 15 C-9 17 -17 8 -15 -4 Z" fill={LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
						<circle cx={-4} cy={-3} r={4} fill={alpha(N, 0.3)} />
						<circle cx={5} cy={5} r={3} fill={alpha(N, 0.3)} />
					</g>
				) : null}
				<Zap x={160} y={262} o={chestPain} s={1.1} />
				<Zap x={196} y={782} o={calfPain} s={1.1} />
			</svg>
		</div>
	);
};

/**
 * Position demi-assise (vue de côté, viewBox 420 × 260) : le dossier du lit se relève à 45° (`raise` 0 → 1) ;
 * patient allongé puis demi-assis, « 45° » affiché quand c'est fait.
 */
export const SemiSitting: React.FC<{raise: number; width?: number}> = ({raise, width = 420}) => {
	const a = (45 * raise * Math.PI) / 180;
	const hinge = [168, 150];
	const dir = [-Math.cos(a), -Math.sin(a)];
	const along = (d: number, off = 0) => [hinge[0] + dir[0] * d - dir[1] * off, hinge[1] + dir[1] * d + dir[0] * off];
	const back0 = along(0, 12);
	const back1 = along(150, 12);
	const shoulder = along(100, -14);
	const head = along(132, -22);
	const pillow = along(128, -2);
	return (
		<svg width={width} height={(width * 260) / 420} viewBox="0 0 420 260" style={{overflow: 'visible'}}>
			{/* lit : cadre, pieds, roues, matelas */}
			<path d="M40 190 V236 M390 190 V236" stroke={N} strokeWidth={10} strokeLinecap="round" />
			<circle cx={40} cy={240} r={10} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<circle cx={390} cy={240} r={10} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<rect x={20} y={168} width={392} height={26} rx={10} fill={N} />
			<rect x={168} y={146} width={236} height={26} rx={10} fill={LPI.paper} stroke={N} strokeWidth={6} />
			{/* dossier qui se relève */}
			<path d={`M${back0[0]} ${back0[1]} L${back1[0]} ${back1[1]}`} stroke={N} strokeWidth={32} strokeLinecap="round" />
			<path d={`M${back0[0]} ${back0[1]} L${back1[0]} ${back1[1]}`} stroke={LPI.paper} strokeWidth={20} strokeLinecap="round" />
			{/* patient : jambes sur le matelas, buste sur le dossier, tête sur l'oreiller */}
			<path d="M176 132 L384 132" stroke={N} strokeWidth={40} strokeLinecap="round" />
			<path d="M176 132 L384 132" stroke={LPI.blue} strokeWidth={28} strokeLinecap="round" />
			<path d={`M${hinge[0] + 8} ${hinge[1] - 18} L${shoulder[0]} ${shoulder[1]}`} stroke={N} strokeWidth={50} strokeLinecap="round" />
			<path d={`M${hinge[0] + 8} ${hinge[1] - 18} L${shoulder[0]} ${shoulder[1]}`} stroke={LPI.blue} strokeWidth={38} strokeLinecap="round" />
			<ellipse cx={pillow[0]} cy={pillow[1]} rx={30} ry={14} transform={`rotate(${-45 * raise} ${pillow[0]} ${pillow[1]})`} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<circle cx={head[0]} cy={head[1]} r={26} fill={LPI.paper} stroke={N} strokeWidth={7} />
			<circle cx={head[0]} cy={head[1]} r={26} fill={LPI.pink} opacity={0.3} />
			{/* angle */}
			{raise > 0.05 ? (
				<g opacity={Math.min(1, raise * 1.2)}>
					<path d={`M${hinge[0] - 70} ${hinge[1]} A70 70 0 0 1 ${hinge[0] - 70 * Math.cos(a)} ${hinge[1] - 70 * Math.sin(a)}`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
					{raise > 0.9 ? (
						<text x={hinge[0] - 150} y={hinge[1] + 6} fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
							45°
						</text>
					) : null}
				</g>
			) : null}
		</svg>
	);
};

/** Scanner des poumons (à mettre dans un `ScanMonitor`) : poumons, artères pulmonaires, caillot qui bouche une branche. */
export const ChestScan: React.FC<{clot: number; width?: number}> = ({clot, width = 320}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 220) / 220} viewBox="90 190 220 220" style={{overflow: 'visible'}}>
			{LUNGS.map((d) => (
				<path key={d} d={d} fill={alpha(LPI.paper, 0.85)} stroke={N} strokeWidth={5} strokeLinejoin="round" />
			))}
			{clot > 0 ? <path d={LUNGS[0]} fill={alpha(N, 0.3 * clot)} /> : null}
			{PULM.map((d) => (
				<Tube key={d} d={d} color={LPI.pink} o={1} width={7} />
			))}
			{clot > 0 ? <Tube d={BLOCKED} color={LPI.sky} o={clot} width={7} /> : null}
			{clot > 0 ? (
				<g transform="translate(158 294)" opacity={clot}>
					<circle r={22 + 4 * Math.sin(frame / 3)} fill="none" stroke={LPI.pink} strokeWidth={5} strokeDasharray="8 6" strokeDashoffset={frame * 2} />
					<circle r={9} fill={LPI.pink} stroke={N} strokeWidth={3} />
				</g>
			) : null}
		</svg>
	);
};
