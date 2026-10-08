// Gros plans « loupe » et accessoires posés sur le corps.
import React from 'react';
import {alpha, LPI} from '../brand/theme';
import {ARM_R} from './body';
import {limb, mirror, P, PR, rng} from './geometry';

/* ─────────── loupe (cercle relié au corps) ─────────── */

export const Loupe: React.FC<{
	x: number;
	y: number;
	r: number;
	/** point visé sur le corps (en px écran) */
	target: {x: number; y: number};
	open: number;
	id: string;
	children: React.ReactNode;
	/** taille du repère interne (le contenu est dessiné en 600 × 600) */
	size?: number;
}> = ({x, y, r, target, open, id, children, size = 600}) => {
	if (open <= 0.001) return null;
	const rr = r * open;
	const dx = target.x - x;
	const dy = target.y - y;
	const d = Math.hypot(dx, dy) || 1;
	const ex = x + (dx / d) * rr;
	const ey = y + (dy / d) * rr;
	const k = (2 * rr) / size;
	return (
		<g>
			<defs>
				<clipPath id={`${id}-clip`}>
					<circle cx={x} cy={y} r={rr} />
				</clipPath>
			</defs>
			<line x1={ex} y1={ey} x2={target.x} y2={target.y} stroke={LPI.navy} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={open} />
			<circle cx={target.x} cy={target.y} r={22 * open} fill="none" stroke={LPI.paper} strokeWidth={9} />
			<circle cx={target.x} cy={target.y} r={22 * open} fill="none" stroke={LPI.blue} strokeWidth={5} />
			<circle cx={x} cy={y + 14} r={rr + 6} fill={alpha(LPI.navy, 0.16)} />
			<g clipPath={`url(#${id}-clip)`}>
				<rect x={x - rr} y={y - rr} width={2 * rr} height={2 * rr} fill={LPI.paper} />
				<g transform={`translate(${x - rr} ${y - rr}) scale(${k})`}>{children}</g>
			</g>
			<circle cx={x} cy={y} r={rr} fill="none" stroke={LPI.paper} strokeWidth={14} />
			<circle cx={x} cy={y} r={rr + 7} fill="none" stroke={LPI.navy} strokeWidth={4} />
		</g>
	);
};

/* ─────────── battements → forme de l'onde de pression ─────────── */

export const pulseShape = (frame: number, beats: number[]) => {
	let last = -1e9;
	for (const b of beats) {
		if (b <= frame) last = b;
		else break;
	}
	const t = frame - last;
	return t < 0 ? 0 : t < 4 ? t / 4 : Math.exp(-(t - 4) / 7);
};

/* ─────────── artère vue en coupe longitudinale (sous le brassard) ─────────── */

const RBC: React.FC<{x: number; y: number; s: number; a?: number; fill?: string}> = ({x, y, s, a = 0, fill = LPI.pink}) => (
	<g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
		<ellipse rx={24} ry={15} fill={fill} stroke={LPI.navy} strokeWidth={3} />
		<ellipse rx={11} ry={5.5} fill={alpha(LPI.navy, 0.2)} />
		<ellipse cx={-8} cy={-7} rx={8} ry={3} fill={alpha(LPI.paper, 0.6)} />
	</g>
);

export const ArteryLoupe: React.FC<{
	frame: number;
	beats: number[];
	/** 1 normal, > 1 hypertension, < 1 hypotension */
	strength: number;
	/** 0 → 1 : flèches de pression visibles */
	arrows: number;
	/** mettre en avant la phase : systole (contraction) ou diastole */
	phase?: 'sys' | 'dia' | null;
}> = ({frame, beats, strength, arrows, phase}) => {
	const p = pulseShape(frame, beats);
	const push = (8 + 30 * p) * strength;
	const lumen = 190 + push;
	const top = 300 - lumen / 2;
	const bot = 300 + lumen / 2;
	const wall = 58;
	const rand = rng(3);
	const cells = Array.from({length: 13}, (_, i) => ({ox: rand() * 700, oy: (rand() - 0.5) * 0.7, a: (rand() - 0.5) * 50, s: 0.8 + rand() * 0.4, i}));
	let travel = frame * 2.5;
	for (const b of beats) if (b <= frame) travel += 34 * strength * (1 - Math.exp(-(frame - b) / 6));
	const wallBand = (y0: number, dir: 1 | -1) => (
		<g>
			{/* adventice / média / intima */}
			<rect x={-20} y={dir < 0 ? y0 - wall : y0} width={640} height={wall} fill={LPI.pink} />
			{Array.from({length: 16}, (_, i) => (
				<path
					key={i}
					d={`M${i * 40 - 20} ${dir < 0 ? y0 - wall + 6 : y0 + 6} q20 ${(wall - 12) / 2} 0 ${wall - 12}`}
					fill="none"
					stroke={alpha(LPI.navy, 0.18)}
					strokeWidth={4}
				/>
			))}
			<rect x={-20} y={dir < 0 ? y0 - 9 : y0} width={640} height={9} fill={LPI.paper} />
			<rect x={-20} y={dir < 0 ? y0 - wall : y0 + wall - 12} width={640} height={12} fill={alpha(LPI.navy, 0.3)} />
			<line x1={-20} x2={620} y1={y0 + (dir < 0 ? -wall : wall)} y2={y0 + (dir < 0 ? -wall : wall)} stroke={LPI.navy} strokeWidth={4} />
			<line x1={-20} x2={620} y1={y0} y2={y0} stroke={LPI.navy} strokeWidth={3} />
		</g>
	);
	const hot = strength > 1.2;
	return (
		<g>
			{/* muscle autour */}
			<rect width={600} height={600} fill={alpha(LPI.pink, 0.3)} />
			{Array.from({length: 22}, (_, i) => (
				<path key={i} d={`M${-40 + i * 32} -10 L${-140 + i * 32} 610`} stroke={alpha(LPI.navy, 0.08)} strokeWidth={9} />
			))}
			{/* sang */}
			<rect x={-20} y={top} width={640} height={lumen} fill={alpha(LPI.pink, 0.45)} />
			{cells.map((c) => {
				const x = ((c.ox + travel * (0.9 + (c.i % 3) * 0.08)) % 720) - 60;
				return <RBC key={c.i} x={x} y={300 + c.oy * lumen} s={c.s * 1.45} a={c.a} />;
			})}
			{wallBand(top, -1)}
			{wallBand(bot, 1)}
			{/* poussée du sang sur la paroi */}
			<g opacity={arrows} stroke={hot ? LPI.navy : LPI.blue} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none">
				{[120, 300, 480].map((x) => {
					const L = 18 + 40 * p * strength;
					return (
						<g key={x}>
							<path d={`M${x} ${top + 30} V${top + 30 - L} M${x - 14} ${top + 44 - L} L${x} ${top + 30 - L} L${x + 14} ${top + 44 - L}`} />
							<path d={`M${x} ${bot - 30} V${bot - 30 + L} M${x - 14} ${bot - 44 + L} L${x} ${bot - 30 + L} L${x + 14} ${bot - 44 + L}`} />
						</g>
					);
				})}
			</g>
			{phase ? (
				<rect
					x={-20}
					y={top - wall - 6}
					width={640}
					height={lumen + 2 * wall + 12}
					fill="none"
					stroke={phase === 'sys' ? LPI.pink : LPI.sky}
					strokeWidth={10}
					opacity={0.9}
				/>
			) : null}
		</g>
	);
};

/* ─────────── capillaire du doigt + lumière de l'oxymètre ─────────── */

export const CapillaryLoupe: React.FC<{
	frame: number;
	/** part des globules qui portent leur O2 (0 → 1) */
	sat: number;
	/** O2 dissous autour (0 → 1) */
	plasmaO2: number;
	/** lumière de l'oxymètre 0 → 1 */
	light: number;
}> = ({frame, sat, plasmaO2, light}) => {
	const rand = rng(11);
	const cells = Array.from({length: 7}, (_, i) => ({ox: i * 106 + rand() * 30, oy: (rand() - 0.5) * 40, a: (rand() - 0.5) * 30, s: 0.95 + rand() * 0.25, k: rand()}));
	const dots = Array.from({length: 26}, () => ({x: rand() * 600, y: rand() * 600, ph: rand() * 6}));
	const travel = frame * 3;
	return (
		<g>
			<rect width={600} height={600} fill={alpha(LPI.pink, 0.28)} />
			{/* O2 dissous dans les tissus */}
			{dots.map((d, i) => (
				<circle key={i} cx={d.x + Math.sin(frame / 20 + d.ph) * 8} cy={d.y} r={7} fill={LPI.blue} opacity={0.55 * plasmaO2} />
			))}
			{/* capillaire */}
			<path d="M-20 360 C150 300 300 330 620 230" fill="none" stroke={LPI.navy} strokeWidth={150} strokeLinecap="round" />
			<path d="M-20 360 C150 300 300 330 620 230" fill="none" stroke={alpha(LPI.pink, 0.9)} strokeWidth={138} />
			<path d="M-20 360 C150 300 300 330 620 230" fill="none" stroke={alpha(LPI.paper, 0.35)} strokeWidth={40} transform="translate(0 -36)" />
			{cells.map((c, i) => {
				const x = ((c.ox + travel) % 740) - 70;
				const t = (x + 20) / 640;
				const y = 360 - 130 * t + Math.sin(t * Math.PI) * -10 + c.oy;
				const loaded = c.k < sat;
				return (
					<g key={i}>
						<RBC x={x} y={y} s={c.s * 1.6} a={-12 + c.a} fill={loaded ? LPI.pink : LPI.sky} />
						{loaded
							? [0, 1, 2, 3].map((j) => {
									const ang = (j / 4) * Math.PI * 2 + frame / 18;
									return <circle key={j} cx={x + Math.cos(ang) * 46} cy={y + Math.sin(ang) * 31} r={11} fill={LPI.blue} stroke={LPI.paper} strokeWidth={3.5} />;
								})
							: null}
					</g>
				);
			})}
			{/* faisceau lumineux de l'oxymètre (haut → bas) */}
			{light > 0 ? (
				<g opacity={light}>
					<rect x={250} y={0} width={100} height={600} fill={alpha(LPI.pink, 0.28)} />
					<rect x={286} y={0} width={28} height={600} fill={alpha(LPI.paper, 0.45)} />
					<rect x={200} y={-10} width={200} height={46} rx={14} fill={LPI.navy} />
					<rect x={200} y={564} width={200} height={46} rx={14} fill={LPI.navy} />
					<circle cx={300} cy={30} r={14} fill={LPI.pink} stroke={LPI.paper} strokeWidth={4} />
				</g>
			) : null}
		</g>
	);
};

/* ─────────── accessoires sur le corps (unités corps) ─────────── */

/** brassard autour du bras droit du patient (gauche de l'écran) */
export const Cuff: React.FC<{inflate: number; show: number}> = ({inflate, show}) => {
	if (show <= 0) return null;
	const seg: PR[] = ARM_R.filter((p) => p[1] >= 410 && p[1] <= 560).map(([x, y, r]) => [x, y, r + 7 + 7 * inflate]);
	const d = limb(seg, [false, false]);
	return (
		<g opacity={show}>
			<path d="M300 540 C268 600 226 640 186 676" fill="none" stroke={LPI.navy} strokeWidth={6} strokeLinecap="round" />
			{/* manomètre */}
			<g transform="translate(168 700)">
				<circle r={34} fill={LPI.paper} stroke={LPI.navy} strokeWidth={6} />
				{Array.from({length: 9}, (_, i) => {
					const a = ((-135 + i * 33.75) * Math.PI) / 180;
					return <line key={i} x1={Math.sin(a) * 22} y1={-Math.cos(a) * 22} x2={Math.sin(a) * 29} y2={-Math.cos(a) * 29} stroke={LPI.navy} strokeWidth={3} />;
				})}
				<line x1={0} y1={0} x2={Math.sin(((-110 + 160 * inflate) * Math.PI) / 180) * 24} y2={-Math.cos(((-110 + 160 * inflate) * Math.PI) / 180) * 24} stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
				<circle r={6} fill={LPI.navy} />
			</g>
			<path d={d} fill={LPI.blue} stroke={LPI.navy} strokeWidth={5} strokeLinejoin="round" />
			<path d={limb(seg.map(([x, y, r]) => [x, y, r * 0.35] as PR), [false, false])} fill={alpha(LPI.paper, 0.25)} />
			{[0.25, 0.5, 0.75].map((k) => {
				const i = Math.floor(k * (seg.length - 1));
				const [x, y, r] = seg[i];
				return <path key={k} d={`M${x - r} ${y + 4} Q${x} ${y + 12} ${x + r} ${y + 4}`} fill="none" stroke={alpha(LPI.navy, 0.35)} strokeWidth={3} strokeDasharray="6 6" />;
			})}
		</g>
	);
};

/** pince de l'oxymètre sur l'index gauche du patient (droite de l'écran) */
export const OXI_TIP: P = mirror<P>([[199, 1050]])[0];
export const OxiClip: React.FC<{show: number; glow: number}> = ({show, glow}) => {
	if (show <= 0) return null;
	const [x, y] = OXI_TIP;
	return (
		<g opacity={show} transform={`translate(${x} ${y}) rotate(-6)`}>
			<path d="M10 -30 C40 -60 70 -40 90 -90" fill="none" stroke={LPI.navy} strokeWidth={3.5} strokeLinecap="round" />
			<rect x={-17} y={-30} width={34} height={52} rx={12} fill={LPI.navy} />
			<rect x={-11} y={-22} width={22} height={14} rx={4} fill={LPI.paper} />
			<circle cx={0} cy={14} r={4 + 3 * glow} fill={LPI.pink} opacity={0.6 + 0.4 * glow} />
		</g>
	);
};
