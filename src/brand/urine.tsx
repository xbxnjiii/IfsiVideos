// Briques « diurèse » réutilisables : normes adulte (zones), bocal gradué qui se remplit goutte à goutte,
// horloge « 24 h », cadence des gouttes selon le volume, appareil urinaire (reins → uretères → vessie).
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {usePop} from './kit';
import type {Zone} from './NormScale';
import {alpha, FONT, LPI} from './theme';
import {clamp} from './ui';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

/** Normes adulte (liste fournie) : anurie < 100 · oligurie < 400 · normodiurèse 600 – 2000 · polyurie > 2500 à 3000 ml/24 h. */
export const DIU_ZONES: Zone[] = [
	{name: 'anurie', range: '< 100', tone: 'high', w: 0.95, lo: 0, hi: 100},
	{name: 'oligurie', range: '< 400', tone: 'mid', w: 1, lo: 100, hi: 400},
	{name: '', tone: 'gap', w: 0.3, lo: 400, hi: 600},
	{name: 'normodiurèse', range: '600 – 2000', tone: 'norm', w: 1.35, lo: 600, hi: 2000},
	{name: '', tone: 'gap', w: 0.3, lo: 2000, hi: 2500},
	{name: 'polyurie', range: '> 2500 à 3000', tone: 'low', w: 1.15, lo: 2500, hi: 4000},
];

export const JAR_MAX = 3500;

/** Bocal gradué de recueil des urines (24 h) : le niveau suit la diurèse, les gouttes tombent du tuyau. */
export const Jar: React.FC<{value: number; drops: number[]}> = ({value, drops}) => {
	const frame = useCurrentFrame();
	const lvl = (v: number) => 380 - (Math.min(v, JAR_MAX) / JAR_MAX) * 316;
	const top = lvl(value);
	const wave = Array.from({length: 11}, (_, i) => {
		const x = 30 + i * 20;
		return `${x},${top + 5 * Math.sin(i / 1.3 + frame / 5)}`;
	}).join(' ');
	return (
		<svg width={260} height={400} viewBox="0 0 260 400" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="lpi-jar">
					<path d="M44 64 H216 V356 Q216 384 188 384 H72 Q44 384 44 356 Z" />
				</clipPath>
			</defs>
			{/* tuyau qui amène les urines */}
			<path d="M130 -24 V40" stroke={LPI.navy} strokeWidth={16} strokeLinecap="round" />
			<path d="M130 -24 V40" stroke={LPI.sky} strokeWidth={7} strokeLinecap="round" />
			<g clipPath="url(#lpi-jar)">
				<polygon points={`${wave} 240,400 20,400`} fill={alpha(LPI.sky, 0.95)} />
				<polyline points={wave} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinejoin="round" />
			</g>
			{drops.map((d, i) => {
				const t = (frame - d) / 12;
				if (t < 0 || t > 1) return null;
				const y = 46 + t * t * (top - 46);
				return <path key={i} d={`M130 ${y - 14} C124 ${y - 4} 120 ${y + 2} 120 ${y + 6} A10 10 0 0 0 140 ${y + 6} C140 ${y + 2} 136 ${y - 4} 130 ${y - 14} Z`} fill={LPI.blue} />;
			})}
			<path d="M44 64 H216 V356 Q216 384 188 384 H72 Q44 384 44 356 Z" fill="none" stroke={LPI.navy} strokeWidth={10} strokeLinejoin="round" />
			<rect x="28" y="36" width="204" height="34" rx="12" fill={LPI.blue} stroke={LPI.navy} strokeWidth={8} />
			{[1000, 2000, 3000].map((g) => (
				<g key={g}>
					<path d={`M172 ${lvl(g)} H206`} stroke={LPI.navy} strokeWidth={6} strokeLinecap="round" />
					<text x="166" y={lvl(g) + 8} textAnchor="end" fontFamily={FONT.body} fontWeight={800} fontSize="22" fill={alpha(LPI.navy, 0.75)}>
						{g / 1000} L
					</text>
				</g>
			))}
		</svg>
	);
};

/** Petite horloge « 24 h » dont l'aiguille fait le tour du cadran. */
export const Clock24: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	const turn = interpolate(frame, [t0 + 2, t0 + 26], [0, 360], ease);
	return (
		<div style={{opacity: Math.min(1, p * 2), transform: `scale(${0.4 + 0.6 * p})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<svg width={120} height={120} viewBox="-60 -60 120 120">
				<circle r={52} fill={LPI.paper} stroke={LPI.navy} strokeWidth={8} />
				<path d={`M0 0 L0 -36 A36 36 0 ${turn > 180 ? 1 : 0} 1 ${36 * Math.sin((turn * Math.PI) / 180)} ${-36 * Math.cos((turn * Math.PI) / 180)} Z`} fill={alpha(LPI.sky, 0.9)} />
				<g transform={`rotate(${turn})`}>
					<path d="M0 6 V-38" stroke={LPI.navy} strokeWidth={7} strokeLinecap="round" />
				</g>
				<circle r={7} fill={LPI.pink} stroke={LPI.navy} strokeWidth={3} />
			</svg>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: LPI.navy, marginTop: 2}}>24 h</div>
		</div>
	);
};

/** Instants des gouttes : la cadence suit le volume (beaucoup d'urine = goutte à goutte rapide). */
export const dropTimes = (frame: number, start: number, vAt: (f: number) => number) => {
	const out: number[] = [];
	let ph = 0;
	for (let f = start; f <= frame; f++) {
		const v = vAt(f);
		const period = v < 120 ? 0 : interpolate(v, [120, 400, 1500, 3200], [60, 34, 16, 6], clamp);
		if (period <= 0) continue;
		ph += 1 / period;
		if (ph >= 1) {
			ph -= 1;
			out.push(f);
		}
	}
	return out.slice(-6);
};

const KIDNEY = 'M0 -62 C40 -62 56 -26 50 6 C44 40 20 64 -6 58 C-26 54 -22 30 -14 14 C-8 2 -20 -8 -30 -16 C-46 -30 -32 -62 0 -62 Z';

/** Appareil urinaire de face : vaisseau (sang) → reins qui filtrent → uretères (gouttes) → vessie qui se remplit.
 * `kidneys`, `blood`, `ureters`, `bladder` : apparitions 0 → 1 ; `fill` : niveau de la vessie 0 → 1 ; `filter` : reins qui brillent. */
export const UrinarySystem: React.FC<{size?: number; kidneys?: number; blood?: number; ureters?: number; bladder?: number; fill?: number; filter?: number}> = ({
	size = 400,
	kidneys = 1,
	blood = 0,
	ureters = 0,
	bladder = 0,
	fill = 0,
	filter = 0,
}) => {
	const frame = useCurrentFrame();
	const N = LPI.navy;
	const ureter = (s: number) => `M${200 + s * 74} 170 C${200 + s * 70} 240 ${200 + s * 40} 270 ${200 + s * 34} 314`;
	const top = 400 - fill * 70;
	return (
		<svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{overflow: 'visible'}}>
			{/* vaisseau sanguin + branches vers les reins */}
			<g opacity={blood}>
				<path d="M200 0 V250" stroke={N} strokeWidth={30} strokeLinecap="round" />
				<path d="M200 0 V250" stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
				<path d="M200 110 H130 M200 110 H270" stroke={N} strokeWidth={22} strokeLinecap="round" />
				<path d="M200 110 H130 M200 110 H270" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" />
				{[0, 1, 2].map((k) => {
					const y = ((frame * 4 + k * 80) % 240) + 4;
					return <circle key={k} cx={200} cy={y} r={7} fill={LPI.paper} stroke={N} strokeWidth={3} />;
				})}
			</g>
			{/* uretères + gouttes qui descendent */}
			{[-1, 1].map((s) => (
				<g key={s} opacity={ureters}>
					<path d={ureter(s)} fill="none" stroke={N} strokeWidth={18} strokeLinecap="round" />
					<path d={ureter(s)} fill="none" stroke={LPI.sky} strokeWidth={8} strokeLinecap="round" />
					<path d={ureter(s)} fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" strokeDasharray="6 34" strokeDashoffset={-frame * 3} />
				</g>
			))}
			{/* reins (haricots) */}
			{[-1, 1].map((s) => (
				<g key={s} transform={`translate(${200 + s * 92} 118) scale(${s * (0.55 + 0.45 * kidneys)} ${0.55 + 0.45 * kidneys})`} opacity={Math.min(1, kidneys * 1.6)}>
					<circle r={78} fill={alpha(LPI.sky, 0.6 * filter)} />
					<path d={KIDNEY} fill={LPI.pink} stroke={N} strokeWidth={8} strokeLinejoin="round" />
					<path d="M-6 -30 C14 -24 22 -2 14 20" fill="none" stroke={alpha(LPI.paper, 0.85)} strokeWidth={7} strokeLinecap="round" />
				</g>
			))}
			{/* vessie */}
			<g opacity={Math.min(1, bladder * 1.6)} transform={`translate(200 360) scale(${0.6 + 0.4 * bladder}) translate(-200 -360)`}>
				<defs>
					<clipPath id="lpi-bladder">
						<path d="M120 330 C120 300 150 296 200 296 C250 296 280 300 280 330 C280 380 250 404 200 404 C150 404 120 380 120 330 Z" />
					</clipPath>
				</defs>
				<path d="M120 330 C120 300 150 296 200 296 C250 296 280 300 280 330 C280 380 250 404 200 404 C150 404 120 380 120 330 Z" fill={LPI.paper} />
				<g clipPath="url(#lpi-bladder)">
					<rect x={110} y={top + 4 * Math.sin(frame / 6)} width={180} height={120} fill={alpha(LPI.sky, 0.95)} />
				</g>
				<path d="M120 330 C120 300 150 296 200 296 C250 296 280 300 280 330 C280 380 250 404 200 404 C150 404 120 380 120 330 Z" fill="none" stroke={N} strokeWidth={8} />
				<path d="M200 404 V420" stroke={N} strokeWidth={10} strokeLinecap="round" />
			</g>
		</svg>
	);
};
