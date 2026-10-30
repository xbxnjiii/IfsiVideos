// Briques « SpO₂ » réutilisables : normes, saturomètre en gros plan (pince au bout du doigt : écran, courbe de
// pouls, lumière qui traverse le doigt, vernis, doigt froid, ongle bleuté), vaisseau sanguin vu de près (globules
// rouges dont l'hémoglobine se charge en O₂ au contact du poumon) et grille de 100 hémoglobines (le pourcentage).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {Zone} from './NormScale';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/** Zones adultes (charte) : hypoxémie < 90 · désaturation 90 – 95 · normale 95 – 100 %. */
export const SPO_ZONES: Zone[] = [
	{name: 'hypoxémie', range: '< 90 %', tone: 'high', w: 1, lo: 80, hi: 90},
	{name: 'désaturation', range: '90 – 95 %', tone: 'mid', w: 1, lo: 90, hi: 95},
	{name: 'normale', range: '95 – 100 %', tone: 'norm', w: 1.1, lo: 95, hi: 100.5},
];

/** Hasard stable (0 → 1) pour l'élément i, k. */
const rnd = (i: number, k = 0) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Courbe de pouls (pléthysmographie) : onde systolique + petite onde dicrote ; `noise` la rend irrégulière. */
const pleth = (t: number, period: number, noise: number) => {
	const p = (((t % period) + period) % period) / period;
	const clean = Math.exp(-(((p - 0.16) / 0.09) ** 2)) + 0.35 * Math.exp(-(((p - 0.48) / 0.1) ** 2));
	return clean * (1 - 0.6 * noise) + noise * (0.5 * Math.sin(t * 1.3) + 0.35 * Math.sin(t * 2.9 + 1) + 0.25 * Math.sin(t * 0.7 + 2));
};

/**
 * Saturomètre (oxymètre de pouls) sur le bout du doigt, vu de côté (viewBox 900 × 600, largeur `width`).
 * `clip` 0 → 1 : la pince se ferme ; `on` : écran allumé ; `light` : la lumière traverse le doigt à chaque battement ;
 * `polish` : vernis sur l'ongle ; `cold` : doigt froid (bleu clair) ; `cyan` : ongle bleuté ; `noise` : courbe irrégulière ;
 * `alert` 0 / 1 : valeur en rose qui clignote.
 */
export const PulseOx: React.FC<{
	value: number;
	width?: number;
	clip?: number;
	on?: number;
	light?: number;
	period?: number;
	polish?: number;
	cold?: number;
	cyan?: number;
	noise?: number;
	alert?: number;
}> = ({value, width = 900, clip = 1, on = 1, light = 0, period = 24, polish = 0, cold = 0, cyan = 0, noise = 0, alert = 0}) => {
	const frame = useCurrentFrame();
	const beat = Math.exp(-(frame % period) / 4);
	const finger = 'M-120 378 H630 C692 378 722 412 722 452 C722 492 692 526 630 526 H-120 Z';
	const pts: string[] = [];
	for (let x = 0; x <= 280; x += 4) {
		const t = frame - (280 - x) / 5;
		pts.push(`${430 + x},${336 - 40 * pleth(t, period, noise)}`);
	}
	const hot = alert > 0.5 && frame % 16 < 10;
	return (
		<svg width={width} height={(width * 600) / 900} viewBox="0 0 900 600" style={{overflow: 'visible'}}>
			{/* doigt (peau, ou froid) + plis + ongle */}
			<path d={finger} fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			<path d={finger} fill={LPI.pink} opacity={0.3 * (1 - cold)} />
			{cold > 0 ? <path d={finger} fill={LPI.sky} opacity={0.6 * cold} /> : null}
			<path d="M150 392 Q140 452 150 512 M330 392 Q320 452 330 512" fill="none" stroke={alpha(N, 0.35)} strokeWidth={6} strokeLinecap="round" />
			<rect x={548} y={362} width={140} height={32} rx={16} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={548} y={362} width={140} height={32} rx={16} fill={LPI.pink} opacity={0.35 * (1 - polish) * (1 - cyan)} />
			{cyan > 0 ? <rect x={548} y={362} width={140} height={32} rx={16} fill={LPI.blue} opacity={0.85 * cyan} /> : null}
			{polish > 0 ? <rect x={548} y={362} width={140} height={32} rx={16} fill={LPI.pink} stroke={N} strokeWidth={6} opacity={polish} /> : null}
			{clip > 0 ? (
				<g opacity={Math.min(1, clip * 2)}>
					{/* mâchoire du bas + charnière */}
					<g transform={`translate(0 ${(1 - clip) * 160})`}>
						<rect x={392} y={524} width={360} height={66} rx={33} fill={N} />
						<rect x={720} y={300} width={52} height={290} rx={26} fill={N} />
						<circle cx={560} cy={530} r={10} fill={alpha(LPI.sky, 0.8)} />
					</g>
					{/* lumière qui traverse le doigt, au rythme du pouls */}
					{light > 0 ? (
						<g opacity={light}>
							<circle cx={560} cy={452} r={44 + 26 * beat} fill={LPI.pink} opacity={0.25 + 0.3 * beat} />
							<rect x={538} y={372} width={44} height={156} rx={22} fill={LPI.pink} opacity={0.55 + 0.45 * beat} />
						</g>
					) : null}
					{/* boîtier + écran */}
					<g transform={`translate(0 ${(1 - clip) * -240})`}>
						<rect x={380} y={92} width={380} height={292} rx={54} fill={N} />
						<circle cx={560} cy={374} r={10} fill={LPI.pink} opacity={light > 0 ? 0.6 + 0.4 * beat : 0.4} />
						<rect x={408} y={118} width={324} height={238} rx={30} fill={LPI.paper} stroke={hot ? LPI.pink : 'none'} strokeWidth={8} />
						<g opacity={on}>
							<text x={428} y={164} fontFamily={FONT.body} fontWeight={800} fontSize={30} fill={LPI.blue}>
								SpO₂
							</text>
							<text x={668} y={262} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={128} fill={alert > 0.5 ? LPI.pink : N}>
								{Math.round(value)}
							</text>
							<text x={674} y={262} fontFamily={FONT.title} fontWeight={900} fontSize={46} fill={LPI.blue}>
								%
							</text>
							<path
								d="M0 10 C-14 -2 -10 -16 0 -8 C10 -16 14 -2 0 10 Z"
								transform={`translate(700 152) scale(${1.5 + 0.5 * beat})`}
								fill={LPI.pink}
								stroke={N}
								strokeWidth={2.5}
								strokeLinejoin="round"
							/>
							<polyline points={pts.join(' ')} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
						</g>
					</g>
				</g>
			) : null}
		</svg>
	);
};

/**
 * Vaisseau sanguin vu de près (viewBox 900 × 460, largeur `width`) : globules rouges qui défilent, chacun avec
 * 4 hémoglobines (pastilles) chargées d'O₂ (bleu) selon `sat` 0 → 1. `lung` : alvéole du poumon au-dessus,
 * d'où tombent des bulles d'O₂ (`loading`). `phase` : avancée du sang (par défaut 4 × frame).
 */
export const Vessel: React.FC<{sat: number; width?: number; lung?: number; loading?: number; phase?: number}> = ({sat, width = 900, lung = 0, loading = 0, phase}) => {
	const frame = useCurrentFrame();
	const ph = phase ?? frame * 4;
	const SEATS = [
		[-22, -13],
		[22, -13],
		[-22, 13],
		[22, 13],
	];
	return (
		<svg width={width} height={(width * 460) / 900} viewBox="0 0 900 460" style={{overflow: 'visible'}}>
			{/* alvéole pulmonaire (le poumon) */}
			{lung > 0 ? (
				<g opacity={lung}>
					<path d="M40 176 C20 110 60 30 150 26 C220 0 330 10 380 60 C430 100 420 150 400 176 Z" fill={alpha(LPI.sky, 0.9)} stroke={N} strokeWidth={7} strokeLinejoin="round" />
					<text x={220} y={82} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
						poumon
					</text>
				</g>
			) : null}
			{/* paroi du vaisseau */}
			<rect x={-40} y={186} width={980} height={224} fill={alpha(LPI.pink, 0.16)} />
			<path d="M-40 186 H940 M-40 410 H940" stroke={N} strokeWidth={9} />
			{/* bulles d'O₂ qui passent du poumon dans le sang */}
			{loading > 0
				? Array.from({length: 7}, (_, i) => {
						const t = ((frame + i * 9) % 54) / 54;
						const x = 80 + rnd(i, 3) * 300;
						const y = 110 + t * 170;
						return (
							<g key={i} transform={`translate(${x} ${y})`} opacity={loading * Math.sin(t * Math.PI)}>
								<circle r={20} fill={LPI.blue} stroke={LPI.paper} strokeWidth={4} />
								<text y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={LPI.paper}>
									O₂
								</text>
							</g>
						);
					})
				: null}
			{/* globules rouges */}
			{Array.from({length: 8}, (_, i) => {
				const x = ((i * 135 + ph) % 1080) - 90;
				const y = 298 + Math.sin(i * 1.7 + frame / 18) * 34;
				const r = (Math.sin(i * 2.3 + frame / 30) * 12).toFixed(1);
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
						<ellipse rx={56} ry={42} fill={LPI.pink} stroke={N} strokeWidth={6} />
						<ellipse rx={32} ry={22} fill={alpha(N, 0.1)} />
						{SEATS.map(([sx, sy], k) => {
							const full = rnd(i, k) < sat;
							return <circle key={k} cx={sx} cy={sy} r={11} fill={full ? LPI.blue : LPI.paper} stroke={N} strokeWidth={3.5} />;
						})}
					</g>
				);
			})}
		</svg>
	);
};

/** 100 hémoglobines (10 × 10) : les `filled` premières sont chargées d'O₂ (point bleu), les autres vides. */
export const HemoGrid: React.FC<{filled: number; size?: number}> = ({filled, size = 46}) => (
	<div style={{display: 'grid', gridTemplateColumns: `repeat(10, ${size}px)`, gap: size * 0.22}}>
		{Array.from({length: 100}, (_, i) => {
			const full = i < Math.round(filled);
			return (
				<svg key={i} width={size} height={size} viewBox="0 0 40 40">
					<circle cx={20} cy={20} r={16} fill={full ? LPI.pink : LPI.paper} stroke={full ? N : alpha(N, 0.4)} strokeWidth={4} strokeDasharray={full ? undefined : '5 4'} />
					{full ? <circle cx={20} cy={20} r={8} fill={LPI.blue} /> : null}
				</svg>
			);
		})}
	</div>
);
