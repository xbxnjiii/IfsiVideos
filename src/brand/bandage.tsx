// « Comment bien mettre un pansement » : grand doigt vu de dessus (rendu soigné : peau opaque en dégradé, ongle, plis,
// ombre douce), petite coupure, goutte, eau / mousse, compresse qui tamponne ; pansement adhésif vu de dessus (bande
// microperforée, carré blanc = compresse, deux languettes de protection qui se décollent l'une après l'autre, enroulé
// autour du doigt) ; doigt de l'autre main qui lisse et appuie ; anneau-cible pointillé. Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Mélange opaque de deux couleurs de la marque. */
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const LINE = {stroke: alpha(N, 0.72), strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const SKIN_LO = mix(LPI.paper, LPI.pink, 0.55);
const STRIP = mix(LPI.paper, LPI.sky, 0.75);

/** Repère 1000 × 400 du grand doigt : axe du doigt, bords, coupure (sur la 2e phalange). */
export const FINGER = {axis: 200, top: 62, bottom: 338, cut: {x: 560, y: 198}, w: 1000, h: 400};

/** Point du repère du doigt → écran, pour un `BigFinger` de largeur `width` posé en (`left`, `top`). */
export const fingerPt = (p: {x: number; y: number}, left: number, top: number, width: number) => ({x: left + (p.x * width) / 1000, y: top + (p.y * width) / 1000});

/**
 * Grand index vu de dessus, pointé vers la droite (repère 1000 × 400, la main sort du cadre à gauche). `cut` 0 → 1 la
 * coupure ; `bleed` la goutte qui perle ; `clean` 0 → 1 la plaie nettoyée (plus de sang) ; `wet` reflets d'eau ;
 * `tint` voile d'antiseptique ; `children` : calques dessinés dans le même repère (pansement, eau, compresse, doigt…).
 */
export const BigFinger: React.FC<{width?: number; cut?: number; bleed?: number; clean?: number; wet?: number; tint?: number; children?: React.ReactNode}> = ({width = 1300, cut = 1, bleed = 0, clean = 0, wet = 0, tint = 0, children}) => {
	const id = React.useId().replace(/:/g, '');
	const C = FINGER.cut;
	const blood = cl(bleed) * (1 - cl(clean));
	return (
		<svg width={width} height={(width * 400) / 1000} viewBox="0 0 1000 400" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<filter id={`fs${id}`} x="-30%" y="-60%" width="160%" height="220%">
					<feGaussianBlur stdDeviation="12" />
				</filter>
				<linearGradient id={`fk${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="0.55" stopColor={mix(LPI.paper, LPI.pink, 0.3)} />
					<stop offset="1" stopColor={SKIN_LO} />
				</linearGradient>
				<linearGradient id={`fn${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={mix(LPI.paper, LPI.pink, 0.35)} />
					<stop offset="1" stopColor={mix(LPI.paper, LPI.pink, 0.15)} />
				</linearGradient>
			</defs>
			{/* ombre douce sur le plan de travail */}
			<path d="M-400 120 L700 128 C880 134 975 170 975 240 C975 300 880 360 700 366 L-400 376 Z" fill={alpha(N, 0.2)} filter={`url(#fs${id})`} />
			{/* le doigt */}
			<path d="M-400 56 L700 66 C880 72 975 130 975 200 C975 270 880 328 700 334 L-400 344 Z" fill={`url(#fk${id})`} {...LINE} />
			<path d="M-400 92 L690 100 C800 104 880 124 920 150" fill="none" stroke={alpha(LPI.paper, 0.9)} strokeWidth={16} strokeLinecap="round" />
			{/* plis des articulations (dessus du doigt) */}
			{[300, 700].map((x) => (
				<g key={x}>
					{[-26, 0, 26].map((d, i) => (
						<path key={i} d={`M${x + d} ${130 + Math.abs(d) * 0.6} Q${x + d + 14} 200 ${x + d} ${270 - Math.abs(d) * 0.6}`} fill="none" stroke={alpha(N, i === 1 ? 0.2 : 0.12)} strokeWidth={3} strokeLinecap="round" />
					))}
				</g>
			))}
			{/* ongle */}
			<path d="M800 132 L896 136 C936 142 950 172 950 200 C950 228 936 258 896 264 L800 268 C784 226 784 174 800 132 Z" fill={`url(#fn${id})`} {...LINE} />
			<path d="M806 146 C796 180 796 220 806 254" fill="none" stroke={alpha(LPI.paper, 0.95)} strokeWidth={10} strokeLinecap="round" />
			<path d="M840 150 L900 152" stroke={alpha(LPI.paper, 0.8)} strokeWidth={8} strokeLinecap="round" />
			{/* la coupure */}
			{cut > 0 ? (
				<g opacity={cl(cut)}>
					<ellipse cx={C.x} cy={C.y} rx={44} ry={36} fill={alpha(LPI.pink, 0.35 * (1 - 0.6 * cl(clean)))} />
					<path d={`M${C.x - 26} ${C.y - 26} Q${C.x} ${C.y - 2} ${C.x + 24} ${C.y + 28}`} fill="none" stroke={mix(LPI.pink, N, 0.12)} strokeWidth={11} strokeLinecap="round" />
					<path d={`M${C.x - 26} ${C.y - 26} Q${C.x} ${C.y - 2} ${C.x + 24} ${C.y + 28}`} fill="none" stroke={alpha(N, 0.75)} strokeWidth={3} strokeLinecap="round" />
				</g>
			) : null}
			{tint > 0 ? <ellipse cx={C.x} cy={C.y} rx={92} ry={70} fill={alpha(LPI.blue, 0.16 * cl(tint))} /> : null}
			{/* goutte qui perle */}
			{blood > 0 ? (
				<g transform={`translate(${C.x + 30} ${C.y + 20}) scale(${blood})`}>
					<path d="M0 -26 C20 -6 22 16 0 24 C-22 16 -20 -6 0 -26 Z" fill={LPI.pink} stroke={alpha(N, 0.65)} strokeWidth={3} />
					<ellipse cx={-7} cy={-2} rx={5} ry={9} fill={alpha(LPI.paper, 0.85)} />
				</g>
			) : null}
			{/* reflets d'eau */}
			{wet > 0 ? (
				<g opacity={cl(wet)}>
					{[[470, 130, 16], [610, 250, 12], [680, 150, 10], [420, 240, 9], [540, 280, 8]].map(([x, y, r], i) => (
						<g key={i}>
							<ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill={alpha(LPI.sky, 0.9)} stroke={alpha(N, 0.35)} strokeWidth={2} />
							<ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.3} ry={r * 0.22} fill={LPI.paper} />
						</g>
					))}
				</g>
			) : null}
			{children}
		</svg>
	);
};

/**
 * Pansement adhésif vu de dessus, à dessiner DANS un `BigFinger` (même repère) : grand axe vertical, centre (`x`, `y`),
 * `rot` degrés. Bande microperforée bleu clair, carré blanc au centre (la compresse). `tab1` / `tab2` 0 → 1 : la languette
 * du haut / du bas se décolle et s'en va ; `wrapTop` / `wrapBottom` 0 → 1 : cette moitié s'enroule autour du doigt (elle
 * raccourcit, bouts ombrés) ; `lift` 0 → 1 il plane au-dessus (ombre portée) ; `sloppy` plis d'un pansement mal collé ;
 * `wet` / `dirt` mouillé, sali ; `glow` le carré blanc s'allume.
 */
export const BandageG: React.FC<{x: number; y: number; rot?: number; scale?: number; tab1?: number; tab2?: number; wrapTop?: number; wrapBottom?: number; lift?: number; sloppy?: number; wet?: number; dirt?: number; glow?: number; opacity?: number}> = ({x, y, rot = 0, scale = 1, tab1 = 0, tab2 = 0, wrapTop = 0, wrapBottom = 0, lift = 0, sloppy = 0, wet = 0, dirt = 0, glow = 0, opacity = 1}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const W = 95;
	const top = lerp(320, 156, cl(wrapTop));
	const bot = lerp(320, 156, cl(wrapBottom));
	const strip = `M${-W} ${-top + 60} Q${-W} ${-top} ${-W + 60} ${-top} L${W - 60} ${-top} Q${W} ${-top} ${W} ${-top + 60} L${W} ${bot - 60} Q${W} ${bot} ${W - 60} ${bot} L${-W + 60} ${bot} Q${-W} ${bot} ${-W} ${bot - 60} Z`;
	const tab = (side: -1 | 1, p: number) => {
		if (p >= 1) return null;
		const len = 320 + 34;
		const y0 = side < 0 ? -320 : -34;
		return (
			<g transform={`translate(${-40 * p} ${side * 260 * p}) rotate(${side * 24 * p})`} opacity={1 - p * p}>
				<rect x={-W - 4} y={y0} width={2 * W + 8} height={len} rx={58} fill={alpha(LPI.paper, 0.82)} stroke={alpha(N, 0.55)} strokeWidth={2.5} />
				{[0, 1, 2, 3].map((i) => (
					<path key={i} d={`M${-W + 10 + i * 46} ${y0 + 10} l-40 ${len - 20}`} stroke={alpha(LPI.paper, 0.9)} strokeWidth={6} strokeLinecap="round" />
				))}
				{/* le bord replié qu'on attrape */}
				<rect x={-W - 4} y={side < 0 ? 4 : -34} width={2 * W + 8} height={30} rx={8} fill={alpha(LPI.sky, 0.55)} stroke={alpha(N, 0.45)} strokeWidth={2} />
			</g>
		);
	};
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
			<defs>
				<filter id={`bs${id}`} x="-40%" y="-40%" width="180%" height="180%">
					<feGaussianBlur stdDeviation={6 + 14 * lift} />
				</filter>
				<linearGradient id={`be${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={alpha(N, 0.22 * cl(wrapTop))} />
					<stop offset="0.3" stopColor={alpha(N, 0)} />
					<stop offset="0.7" stopColor={alpha(N, 0)} />
					<stop offset="1" stopColor={alpha(N, 0.22 * cl(wrapBottom))} />
				</linearGradient>
			</defs>
			<path d={strip} fill={alpha(N, 0.22)} filter={`url(#bs${id})`} transform={`translate(${8 + 34 * lift} ${12 + 50 * lift})`} />
			<path d={strip} fill={STRIP} {...LINE} />
			{/* microperforations */}
			{Array.from({length: 13}, (_, r) =>
				[-60, -20, 20, 60].map((c) => {
					const yy = -300 + r * 50;
					if (yy < -top + 24 || yy > bot - 24 || Math.abs(yy) < 120) return null;
					return <circle key={`${r}${c}`} cx={c} cy={yy} r={4} fill={alpha(N, 0.13)} />;
				}),
			)}
			{/* compresse (carré blanc) */}
			<rect x={-70} y={-104} width={140} height={208} rx={14} fill={LPI.paper} stroke={alpha(N, 0.5)} strokeWidth={3} />
			{Array.from({length: 4}, (_, r) => [-36, 0, 36].map((c) => <circle key={`${r}${c}`} cx={c} cy={-66 + r * 44} r={5} fill={alpha(LPI.sky, 0.9)} />))}
			{glow > 0 ? <rect x={-80} y={-114} width={160} height={228} rx={20} fill="none" stroke={LPI.blue} strokeWidth={8} opacity={cl(glow) * (0.6 + 0.4 * Math.sin(frame / 3))} /> : null}
			<path d={strip} fill={`url(#be${id})`} />
			{sloppy > 0 ? (
				<g opacity={cl(sloppy)} stroke={alpha(N, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round">
					<path d={`M-80 ${-top + 40} q30 22 60 4 q30 -18 70 6`} />
					<path d={`M-70 ${bot - 40} q30 -18 56 0 q30 18 74 -4`} />
					<path d={`M60 ${-top + 70} q-14 30 4 60`} />
				</g>
			) : null}
			{wet > 0 ? <path d={strip} fill={alpha(LPI.blue, 0.3 * cl(wet))} /> : null}
			{dirt > 0
				? [[-40, -150, 14], [30, 130, 18], [-10, 40, 10], [50, -60, 12], [-60, 90, 9]].map(([dx, dy, r], i) => <circle key={i} cx={dx} cy={dy} r={r * cl(dirt * 1.5 - i * 0.1)} fill={alpha(N, 0.45)} />)
				: null}
			{tab(-1, cl(tab1))}
			{tab(1, cl(tab2))}
		</g>
	);
};

/**
 * Doigt de l'autre main qui arrive d'en haut (dessiné dans le repère d'un `BigFinger`) : bout en (`x`, `y`), `press` 0 → 1
 * il appuie (il s'écrase un peu, anneau sur la peau).
 */
export const Presser: React.FC<{x: number; y: number; press?: number; rot?: number}> = ({x, y, press = 0, rot = -8}) => {
	const id = React.useId().replace(/:/g, '');
	const p = cl(press);
	return (
		<g>
			{p > 0 ? <ellipse cx={x} cy={y + 10} rx={70 + 30 * p} ry={40 + 16 * p} fill="none" stroke={alpha(LPI.blue, 0.6 * (1 - p * 0.5))} strokeWidth={6} /> : null}
			<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${1 + 0.06 * p} ${1 - 0.06 * p})`}>
				<defs>
					<linearGradient id={`pg${id}`} x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor={LPI.paper} />
						<stop offset="1" stopColor={SKIN_LO} />
					</linearGradient>
				</defs>
				<path d="M-62 -700 L-62 -40 C-62 10 -34 34 0 34 C34 34 62 10 62 -40 L62 -700 Z" fill={alpha(N, 0.2)} transform="translate(14 22)" />
				<path d="M-62 -700 L-62 -40 C-62 10 -34 34 0 34 C34 34 62 10 62 -40 L62 -700 Z" fill={`url(#pg${id})`} {...LINE} />
				<path d="M-36 -98 L36 -98 C44 -60 40 -10 0 4 C-40 -10 -44 -60 -36 -98 Z" fill={mix(LPI.paper, LPI.pink, 0.22)} stroke={alpha(N, 0.55)} strokeWidth={3} />
				<path d="M-22 -80 L-14 -20" stroke={alpha(LPI.paper, 0.95)} strokeWidth={7} strokeLinecap="round" />
				{[-200, -170].map((yy) => (
					<path key={yy} d={`M-40 ${yy} Q0 ${yy + 12} 40 ${yy}`} fill="none" stroke={alpha(N, 0.16)} strokeWidth={3} strokeLinecap="round" />
				))}
			</g>
		</g>
	);
};

/** Anneau-cible pointillé qui tourne et respire (dans un repère SVG) ; `tone` rose (plaie) ou bleu (compresse). */
export const TargetRing: React.FC<{x: number; y: number; r: number; on?: number; tone?: string}> = ({x, y, r, on = 1, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	const s = 0.6 + 0.4 * cl(on) + 0.04 * Math.sin(frame / 4);
	return <circle cx={x} cy={y} r={r * s} fill="none" stroke={tone} strokeWidth={9} strokeDasharray="22 16" strokeDashoffset={-frame * 2} strokeLinecap="round" opacity={cl(on * 2)} />;
};

/** Mousse de savon + gouttes d'eau qui tombent sur la coupure (repère d'un `BigFinger`), `on` 0 → 1. */
export const WashFx: React.FC<{on: number; foam?: number}> = ({on, foam = 0}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	const C = FINGER.cut;
	return (
		<g opacity={cl(on * 3)}>
			{Array.from({length: 7}, (_, i) => {
				const t = ((frame * 0.06 + i / 7) % 1) as number;
				const xx = C.x - 120 + i * 40;
				return <ellipse key={i} cx={xx} cy={-60 + t * 300} rx={9} ry={14} fill={alpha(LPI.sky, 0.95)} stroke={alpha(N, 0.4)} strokeWidth={2} opacity={t < 0.85 ? 1 : (1 - t) * 6} />;
			})}
			{foam > 0
				? [[-60, -30, 26], [-20, -50, 20], [30, -36, 28], [70, 0, 22], [-40, 20, 24], [10, 30, 30], [60, 50, 18]].map(([dx, dy, r], i) => (
						<circle key={i} cx={C.x + dx} cy={C.y + dy} r={r * cl(foam * 1.4 - i * 0.05) * (1 + 0.05 * Math.sin(frame / 3 + i))} fill={alpha(LPI.paper, 0.92)} stroke={alpha(N, 0.3)} strokeWidth={2.5} />
					))
				: null}
		</g>
	);
};

/** Compresse tenue entre deux doigts qui tamponne la coupure (repère d'un `BigFinger`) : `dab` 0 → 1 (descend / remonte). */
export const DabPad: React.FC<{dab: number; on: number; tint?: number}> = ({dab, on, tint = 0}) => {
	if (on <= 0) return null;
	const C = FINGER.cut;
	const y = C.y - 170 + 170 * cl(dab);
	return (
		<g opacity={cl(on * 3)} transform={`translate(${C.x} ${y})`}>
			<ellipse cx={14} cy={170 - 170 * cl(dab) + 30} rx={110} ry={40} fill={alpha(N, 0.12 * (0.4 + 0.6 * cl(dab)))} />
			<rect x={-100} y={-90} width={200} height={180} rx={16} fill={LPI.paper} stroke={alpha(N, 0.6)} strokeWidth={3} />
			{Array.from({length: 5}, (_, i) => (
				<path key={i} d={`M-90 ${-70 + i * 35} H90`} stroke={alpha(LPI.sky, 0.9)} strokeWidth={3} />
			))}
			{tint > 0 ? <rect x={-100} y={-90} width={200} height={180} rx={16} fill={alpha(LPI.blue, 0.22 * cl(tint))} /> : null}
			{/* pouce et index qui la tiennent, vus de dessus */}
			<path d="M-40 -60 L-40 -520 L60 -520 L60 -60 C60 -20 40 0 10 0 C-20 0 -40 -20 -40 -60 Z" fill={mix(LPI.paper, LPI.pink, 0.3)} {...LINE} />
			<path d="M-24 -96 L44 -96 C48 -60 40 -30 10 -24 C-20 -30 -28 -60 -24 -96 Z" fill={mix(LPI.paper, LPI.pink, 0.15)} stroke={alpha(N, 0.5)} strokeWidth={3} />
		</g>
	);
};
