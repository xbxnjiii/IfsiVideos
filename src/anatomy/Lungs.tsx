// Poumons semi-réalistes (repère local 480 × 600) : trachée annelée, lobes et scissures,
// arbre bronchique généré (déterministe), alvéoles, diaphragme. `breath` 0 → 1 = inspiration.
import React from 'react';
import {alpha, LPI} from '../brand/theme';
import {rng, smooth, P} from './geometry';

export const LUNGS_BOX = {w: 480, h: 600};

const RIGHT: P[] = [[168, 58], [116, 92], [74, 166], [48, 276], [38, 398], [42, 494], [70, 544], [128, 534], [178, 526], [216, 540], [222, 440], [212, 330], [204, 232], [194, 128]];
const LEFT: P[] = [[312, 58], [364, 92], [406, 166], [432, 276], [442, 398], [438, 494], [410, 546], [352, 540], [318, 530], [292, 506], [304, 456], [318, 414], [284, 356], [276, 256], [286, 130]];
const RIGHT_D = smooth(RIGHT, true);
const LEFT_D = smooth(LEFT, true);
const FISSURES = [
	'M58 300 C100 296 160 312 212 322',
	'M196 196 C160 280 110 380 54 470',
	'M286 196 C330 280 380 380 430 470',
];

type Seg = {x1: number; y1: number; x2: number; y2: number; w: number; depth: number};

const tree = (x: number, y: number, ang: number, len: number, w: number, depth: number, rand: () => number, out: Seg[], tips: P[]) => {
	const x2 = x + Math.cos(ang) * len;
	const y2 = y + Math.sin(ang) * len;
	out.push({x1: x, y1: y, x2, y2, w, depth});
	if (depth >= 6) {
		tips.push([x2, y2]);
		return;
	}
	const spread = 0.38 + rand() * 0.22;
	const k = 0.7 + rand() * 0.08;
	tree(x2, y2, ang - spread, len * k, w * 0.72, depth + 1, rand, out, tips);
	tree(x2, y2, ang + spread * (0.8 + rand() * 0.4), len * k * (0.85 + rand() * 0.2), w * 0.7, depth + 1, rand, out, tips);
};

const build = () => {
	const segs: Seg[] = [];
	const tips: P[] = [];
	const r = rng(7);
	// bronches souches → lobes
	tree(204, 214, Math.PI * 0.62, 70, 14, 1, r, segs, tips); // droite, vers le bas
	tree(204, 214, Math.PI * 0.95, 58, 12, 2, r, segs, tips); // droite, vers le haut / dehors
	tree(276, 222, Math.PI * 0.38, 72, 14, 1, r, segs, tips); // gauche, vers le bas
	tree(276, 222, Math.PI * 0.05, 56, 12, 2, r, segs, tips); // gauche, vers le dehors
	tree(198, 208, -Math.PI * 0.62, 46, 10, 2, r, segs, tips); // lobes supérieurs
	tree(282, 216, -Math.PI * 0.38, 46, 10, 2, r, segs, tips);
	const alveoli = tips.flatMap(([x, y], i) => {
		const rr = rng(100 + i);
		return Array.from({length: 4}, () => [x + (rr() - 0.5) * 22, y + (rr() - 0.5) * 22, 4 + rr() * 4] as [number, number, number]);
	});
	return {segs, alveoli};
};
const TREE = build();

export const Lungs: React.FC<{breath: number; id: string; /** 0 → 1 : arbre bronchique visible */ bronchi?: number}> = ({breath, id, bronchi = 1}) => {
	const b = breath;
	const sx = 1 + 0.05 * b;
	const sy = 1 + 0.085 * b;
	const lungT = `translate(240 120) scale(${sx} ${sy}) translate(-240 -120)`;
	const dia = 556 + 26 * b;
	const DIAPHRAGM = `M0 ${dia + 34} C70 ${dia - 30 + 16 * b} 170 ${dia - 14 + 12 * b} 240 ${dia + 2} C310 ${dia - 14 + 12 * b} 410 ${dia - 30 + 16 * b} 480 ${dia + 34}`;
	return (
		<g>
			<defs>
				<radialGradient id={`${id}-tissue`} cx="0.4" cy="0.35" r="0.75">
					<stop offset="0" stopColor={LPI.paper} stopOpacity="0.9" />
					<stop offset="0.5" stopColor={LPI.sky} stopOpacity="1" />
					<stop offset="1" stopColor={LPI.blue} stopOpacity="0.55" />
				</radialGradient>
				<pattern id={`${id}-alv`} width="16" height="16" patternUnits="userSpaceOnUse">
					<circle cx="5" cy="5" r="3.2" fill="none" stroke={alpha(LPI.blue, 0.22)} strokeWidth="1.4" />
					<circle cx="13" cy="12" r="2.6" fill="none" stroke={alpha(LPI.blue, 0.18)} strokeWidth="1.2" />
				</pattern>
				<clipPath id={`${id}-clip`}>
					<path d={RIGHT_D} />
					<path d={LEFT_D} />
				</clipPath>
			</defs>
			{/* diaphragme */}
			<path d={DIAPHRAGM} fill="none" stroke={alpha(LPI.navy, 0.55)} strokeWidth={26} strokeLinecap="round" />
			<path d={DIAPHRAGM} fill="none" stroke={LPI.pink} strokeWidth={19} strokeLinecap="round" />
			<path d={DIAPHRAGM} fill="none" stroke={alpha(LPI.paper, 0.5)} strokeWidth={5} strokeLinecap="round" transform="translate(0 -4)" />
			<g transform={lungT}>
				{[RIGHT_D, LEFT_D].map((d, i) => (
					<g key={i}>
						<path d={d} fill={`url(#${id}-tissue)`} />
						<path d={d} fill={`url(#${id}-alv)`} />
					</g>
				))}
				<g clipPath={`url(#${id}-clip)`} opacity={bronchi}>
					{TREE.alveoli.map(([x, y, r], i) => (
						<circle key={i} cx={x} cy={y} r={r * (1 + 0.25 * b)} fill={alpha(LPI.paper, 0.55)} stroke={alpha(LPI.blue, 0.45)} strokeWidth={1.4} />
					))}
					{TREE.segs.map((s, i) => (
						<line key={`o${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={alpha(LPI.blue, 0.85)} strokeWidth={s.w + 2.5} strokeLinecap="round" />
					))}
					{TREE.segs
						.filter((s) => s.w > 4)
						.map((s, i) => (
							<line key={`i${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={alpha(LPI.paper, 0.85)} strokeWidth={s.w * 0.5} strokeLinecap="round" />
						))}
				</g>
				{FISSURES.map((d, i) => (
					<path key={i} d={d} fill="none" stroke={alpha(LPI.navy, 0.2)} strokeWidth={3} strokeLinecap="round" clipPath={`url(#${id}-clip)`} />
				))}
				<path d={RIGHT_D} fill="none" stroke={LPI.navy} strokeWidth={5} />
				<path d={LEFT_D} fill="none" stroke={LPI.navy} strokeWidth={5} />
			</g>
			{/* trachée + bronches souches */}
			<g fill="none" strokeLinecap="round">
				<path d="M240 0 V176 M240 176 C228 194 214 204 200 216 M240 176 C252 194 266 206 280 222" stroke={LPI.navy} strokeWidth={42} />
				<path d="M240 0 V176 M240 176 C228 194 214 204 200 216 M240 176 C252 194 266 206 280 222" stroke={LPI.paper} strokeWidth={34} />
				{Array.from({length: 12}, (_, i) => (
					<path key={i} d={`M224 ${8 + i * 14} Q240 ${14 + i * 14} 256 ${8 + i * 14}`} stroke={alpha(LPI.blue, 0.55)} strokeWidth={5} />
				))}
				<path d="M240 0 V176" stroke={alpha(LPI.navy, 0.12)} strokeWidth={10} transform="translate(9 0)" />
			</g>
		</g>
	);
};
