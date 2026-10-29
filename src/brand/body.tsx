// Corps (trait bleu nuit, aplats de la palette) : poignet paume vers le haut avec artère radiale,
// doigts de l'examinateur qui prennent le pouls, pouce barré. Réutilisés d'une vidéo à l'autre.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** point du pouls radial dans le repère du poignet */
export const RADIAL = {x: 520, y: 128};

/** Avant-bras + main paume vers le haut ; `artery` 0 → 1 dessine l'artère, `pulse` fait battre le point. */
export const Wrist: React.FC<{artery: number; pulse: number; glow: number}> = ({artery, pulse, glow}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={880} height={340} viewBox="0 0 880 340" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="fc-arm-fade" x1="0" x2="1">
					<stop offset="0" stopColor={LPI.paper} stopOpacity="0" />
					<stop offset="0.12" stopColor={LPI.paper} stopOpacity="1" />
				</linearGradient>
			</defs>
			{/* pouce (côté artère radiale) */}
			<path d="M600 96 C612 52 646 18 690 10 C716 6 730 26 716 44 C698 68 676 84 664 112 Z" fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			{/* doigts */}
			{[
				[96, 868],
				[140, 880],
				[184, 868],
				[226, 846],
			].map(([y, x1], i) => (
				<rect key={i} x={720} y={y} width={x1 - 720} height={40} rx={20} fill={LPI.paper} stroke={N} strokeWidth={8} />
			))}
			{/* paume */}
			<path d="M548 98 C600 82 700 82 760 92 L768 262 C700 280 600 278 548 246 Z" fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			{/* avant-bras */}
			<path d="M-20 76 C180 78 400 90 556 98 L556 248 C400 256 180 268 -20 268" fill="url(#fc-arm-fade)" stroke={N} strokeWidth={8} strokeLinejoin="round" />
			{/* plis du poignet */}
			<path d="M560 120 C574 160 574 196 560 232" fill="none" stroke={alpha(N, 0.35)} strokeWidth={6} strokeLinecap="round" />
			<path d="M582 118 C596 160 596 196 582 236" fill="none" stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" />
			{/* artère radiale, côté pouce */}
			<path
				d="M60 116 C220 114 400 120 556 128"
				fill="none"
				stroke={LPI.pink}
				strokeWidth={16}
				strokeLinecap="round"
				strokeDasharray={520}
				strokeDashoffset={520 * (1 - artery)}
			/>
			{artery > 0.9 ? (
				<>
					{[0, 1].map((k) => {
						const r = 18 + ((frame * 1.6 + k * 26) % 52);
						return <circle key={k} cx={RADIAL.x} cy={RADIAL.y} r={r} fill="none" stroke={LPI.pink} strokeWidth={5} opacity={glow * (1 - (r - 18) / 52)} />;
					})}
					<circle cx={RADIAL.x} cy={RADIAL.y} r={15 + 9 * pulse} fill={LPI.pink} stroke={N} strokeWidth={5} />
				</>
			) : null}
		</svg>
	);
};

/** Deux doigts de l'examinateur (index + majeur) qui descendent appuyer sur le pouls. */
export const PressFingers: React.FC<{index: number; middle: number; press: number}> = ({index, middle, press}) => {
	const finger = (dx: number, p: number, len: number) => (
		<g transform={`translate(${dx} ${(1 - p) * -200 + press * 6}) rotate(-8)`} opacity={Math.min(1, Math.max(0, (p - 0.4) / 0.3))}>
			<rect x={-24} y={-len} width={48} height={len + 24} rx={24} fill={LPI.paper} stroke={N} strokeWidth={8} />
			<path d={`M-14 ${-6} C-14 10 14 10 14 -6 L14 -22 C14 -30 -14 -30 -14 -22 Z`} fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={5} />
			<path d={`M-12 ${-len + 50} H12 M-12 ${-len + 96} H12`} stroke={alpha(N, 0.3)} strokeWidth={5} strokeLinecap="round" />
		</g>
	);
	return (
		<svg width={200} height={420} viewBox="-100 -400 200 420" style={{overflow: 'visible'}}>
			{finger(-30, index, 200)}
			{finger(30, middle, 224)}
		</svg>
	);
};

/** Pouce de l'examinateur, barré : « il a son propre pouls ». */
export const CrossedThumb: React.FC<{cross: number; size?: number}> = ({cross, size = 150}) => (
	<svg width={size} height={size} viewBox="0 0 150 150" style={{overflow: 'visible'}}>
		<path d="M40 70 C40 50 52 40 60 28 C66 18 82 20 80 36 L76 58 H112 C124 58 128 72 120 80 C128 86 126 98 116 100 C122 108 116 120 106 120 C110 128 104 136 94 136 H54 C44 136 40 128 40 118 Z" fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
		<rect x="16" y="66" width="28" height="74" rx="10" fill={LPI.sky} stroke={N} strokeWidth={8} />
		<g opacity={Math.min(1, cross * 2)}>
			<path d={`M10 10 L${10 + 130 * cross} ${10 + 130 * cross}`} stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
			<path d={`M140 10 L${140 - 130 * Math.max(0, cross * 2 - 1)} ${10 + 130 * Math.max(0, cross * 2 - 1)}`} stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
		</g>
	</svg>
);

