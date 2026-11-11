// « Pourquoi ne jamais retirer un objet planté ? » : l'évier de la cuisine (robinet qui coule, mousse), le verre qui
// tombe et éclate (éclats qui volent), la main avec l'éclat planté (gouttes de sang roses), les doigts qui viennent le
// pincer, la coupe de peau (calque posé sur `SkinBlock`, repère 900 × 500) : le vaisseau coupé que l'éclat bouche, et ce
// qui arrive si on le retire (le sang jaillit). Couleurs de la marque uniquement (le sang = rose, le verre = bleu clair).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Évier de cuisine (1000 × 640) : carrelage, plan de travail, bac plein d'eau moussante, robinet (`water` : l'eau coule). */
export const Sink: React.FC<{width?: number; water?: number; foam?: number}> = ({width = 1000, water = 1, foam = 1}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 640) / 1000} viewBox="0 0 1000 640" style={{overflow: 'visible', display: 'block'}}>
			{/* carrelage */}
			<rect x={0} y={0} width={1000} height={340} rx={30} fill={alpha(LPI.sky, 0.45)} />
			{[110, 220].map((y) => (
				<line key={y} x1={0} x2={1000} y1={y} y2={y} stroke={alpha(N, 0.12)} strokeWidth={4} />
			))}
			{[125, 250, 375, 500, 625, 750, 875].map((x) => (
				<line key={x} x1={x} x2={x} y1={0} y2={340} stroke={alpha(N, 0.12)} strokeWidth={4} />
			))}
			{/* robinet */}
			<rect x={780} y={250} width={90} height={60} rx={14} fill={LPI.blue} {...SK} />
			<path d="M825 252 V120 Q825 80 785 80 H690 Q660 80 660 110 V140" fill="none" stroke={N} strokeWidth={36} strokeLinecap="round" />
			<path d="M825 252 V120 Q825 80 785 80 H690 Q660 80 660 110 V140" fill="none" stroke={LPI.paper} strokeWidth={22} strokeLinecap="round" />
			<rect x={800} y={150} width={60} height={22} rx={8} fill={LPI.pink} {...SK} strokeWidth={5} />
			{water > 0 ? (
				<g opacity={water}>
					<path d="M650 150 Q648 260 652 352 M670 150 Q672 260 668 352" stroke={alpha(LPI.sky, 0.9)} strokeWidth={10} strokeLinecap="round" />
					{[0, 1, 2, 3].map((i) => {
						const t = ((frame / 6 + i / 4) % 1) as number;
						return <circle key={i} cx={658 + Math.sin(i * 3) * 6} cy={150 + 200 * t} r={6} fill={LPI.paper} stroke={alpha(N, 0.4)} strokeWidth={2} />;
					})}
				</g>
			) : null}
			{/* plan de travail + bac */}
			<rect x={0} y={330} width={1000} height={310} rx={26} fill={LPI.paper} {...SK} />
			<path d="M180 350 H820 V560 Q820 600 780 600 H220 Q180 600 180 560 Z" fill={alpha(LPI.sky, 0.75)} {...SK} />
			<path d="M196 380 H804" stroke={alpha(N, 0.35)} strokeWidth={5} strokeDasharray="14 12" />
			{/* mousse */}
			{foam > 0
				? Array.from({length: 14}, (_, i) => {
						const x = 220 + i * 42;
						const r = 18 + ((i * 7) % 3) * 8 + 2 * Math.sin(frame / 9 + i);
						return <circle key={i} cx={x} cy={372 - ((i * 11) % 3) * 8} r={r * foam} fill={LPI.paper} stroke={alpha(N, 0.45)} strokeWidth={4} />;
					})
				: null}
			{/* éponge */}
			<rect x={70} y={300} width={110} height={56} rx={14} fill={LPI.pink} {...SK} strokeWidth={6} />
			<rect x={70} y={300} width={110} height={20} rx={10} fill={LPI.blue} />
		</svg>
	);
};

/** Verre à boire (120 × 170). */
export const DrinkGlass: React.FC<{size?: number}> = ({size = 120}) => (
	<svg width={size} height={(size * 170) / 120} viewBox="0 0 120 170" style={{overflow: 'visible', display: 'block'}}>
		<path d="M10 8 H110 L96 160 H24 Z" fill={alpha(LPI.sky, 0.55)} {...SK} />
		<path d="M30 24 L38 140" stroke={LPI.paper} strokeWidth={8} strokeLinecap="round" />
		<path d="M18 60 H102" stroke={alpha(N, 0.25)} strokeWidth={4} />
	</svg>
);

/** Éclats qui volent quand le verre éclate (repère du parent, centrés en 0, 0) ; `t` 0 → 1. */
export const ShardBurst: React.FC<{t: number; scale?: number}> = ({t, scale = 1}) => {
	if (t <= 0 || t >= 1) return null;
	return (
		<svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{Array.from({length: 14}, (_, i) => {
				const a = (-Math.PI * (0.1 + 0.8 * ((i * 37) % 14) / 14)) - (i % 2 ? 0.2 : 0);
				const v = (240 + ((i * 53) % 5) * 70) * scale;
				const x = Math.cos(a) * v * t;
				const y = Math.sin(a) * v * t + 520 * scale * t * t;
				const r = (i * 47) % 360 + 700 * t;
				const k = (0.6 + ((i * 3) % 4) * 0.25) * scale;
				return <path key={i} d="M-14 -10 L18 -6 L4 22 Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${k * 1.6})`} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={3} strokeLinejoin="round" opacity={1 - t * 0.4} />;
			})}
		</svg>
	);
};

/** Main ouverte (paume) avec l'éclat planté (300 × 390) : `shard` (0 → 1 : il s'enfonce), `blood` (gouttes roses),
 * `pain` (traits de douleur), `gauze` (compresses roulées tout autour de l'éclat, 0 → 1). */
export const HandShard: React.FC<{size?: number; shard?: number; blood?: number; pain?: number; gauze?: number}> = ({size = 300, shard = 1, blood = 0, pain = 0, gauze = 0}) => {
	const frame = useCurrentFrame();
	const fill = LPI.paper;
	const sx = 160;
	const sy = 250;
	return (
		<svg width={size} height={(size * 390) / 300} viewBox="0 0 300 390" style={{overflow: 'visible', display: 'block'}}>
			{/* doigts, pouce, paume */}
			{[72, 117, 162, 207].map((x, i) => (
				<rect key={x} x={x} y={[52, 22, 30, 66][i]} width={42} height={190} rx={21} fill={fill} {...SK} />
			))}
			<rect x={8} y={168} width={46} height={136} rx={23} fill={fill} {...SK} transform="rotate(-38 31 236)" />
			<path d="M60 174 H255 V318 Q255 376 198 376 H118 Q60 376 60 318 Z" fill={fill} {...SK} />
			<path d="M60 174 H255 V318 Q255 376 198 376 H118 Q60 376 60 318 Z" fill={alpha(LPI.pink, 0.25)} />
			<path d="M96 250 Q150 230 220 246 M100 290 Q160 276 214 296" fill="none" stroke={alpha(N, 0.25)} strokeWidth={4} strokeLinecap="round" />
			{/* sang autour de l'éclat */}
			{blood > 0 ? (
				<g opacity={blood}>
					<ellipse cx={sx} cy={sy + 6} rx={34 * blood} ry={18 * blood} fill={alpha(LPI.pink, 0.9)} />
					{[0, 1].map((i) => {
						const t = ((frame / 26 + i / 2) % 1) as number;
						return <path key={i} d={`M${sx - 18 + i * 34} ${sy + 20 + t * 70} q-8 12 0 20 q8 -8 0 -20 Z`} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={blood * (1 - t * 0.7)} />;
					})}
				</g>
			) : null}
			{/* compresses roulées qui calent l'éclat */}
			{gauze > 0
				? [
						[sx - 58, sy - 4, -14],
						[sx + 58, sy - 4, 14],
					].map(([x, y, r], i) => (
						<g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${gauze})`}>
							<rect x={-26} y={-44} width={52} height={88} rx={22} fill={LPI.paper} {...SK} strokeWidth={5} />
							{[-24, -8, 8, 24].map((yy) => (
								<line key={yy} x1={-22} x2={22} y1={yy} y2={yy} stroke={alpha(LPI.sky, 0.95)} strokeWidth={4} />
							))}
						</g>
					))
				: null}
			{/* l'éclat (la partie qui dépasse) */}
			<g transform={`translate(${sx} ${sy}) rotate(-16) translate(${-40} ${-150 + 40 * (1 - shard)})`} opacity={shard > 0 ? 1 : 0}>
				<path d="M8 4 L80 16 L48 150 Z" fill={alpha(LPI.sky, 0.85)} {...SK} />
				<path d="M26 18 L46 110" stroke={LPI.paper} strokeWidth={7} strokeLinecap="round" />
			</g>
			{pain > 0
				? [
						[sx - 70, sy - 70, -1],
						[sx + 70, sy - 70, 1],
					].map(([x, y, s]) => <path key={x} d={`M${x} ${y} l${10 * s} -22 l${-4 * s} 18 l${14 * s} -16`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={pain} transform={`translate(${s * 3 * Math.sin(frame / 2)} 0)`} />)
				: null}
		</svg>
	);
};

/** Pouce et index qui viennent pincer (260 × 200) : `close` 0 → 1 (les deux doigts se rapprochent). */
export const Pinch: React.FC<{size?: number; close?: number}> = ({size = 260, close = 0}) => {
	const gap = 60 * (1 - close);
	return (
		<svg width={size} height={(size * 200) / 260} viewBox="0 0 260 200" style={{overflow: 'visible', display: 'block'}}>
			<g transform={`translate(0 ${-gap / 2})`}>
				<path d="M40 40 H210 Q244 40 244 74 Q244 96 220 96 H40 Z" fill={LPI.paper} {...SK} />
				<path d="M206 46 Q232 50 232 72" fill="none" stroke={alpha(N, 0.3)} strokeWidth={5} strokeLinecap="round" />
			</g>
			<g transform={`translate(0 ${gap / 2})`}>
				<path d="M60 112 H196 Q226 112 226 140 Q226 160 204 160 H60 Z" fill={LPI.paper} {...SK} />
			</g>
			<path d="M0 60 H52 V170 H0 Z" fill={LPI.blue} {...SK} />
		</svg>
	);
};

/**
 * Calque de la coupe de peau (repère `SKIN` 900 × 500, à poser sur `SkinBlock` à la même largeur) : un vaisseau dans le
 * derme (le sang circule), coupé par l'éclat qui le BOUCHE ; `out` 0 → 1 : l'éclat ressort (il monte) ; `gush` 0 → 1 :
 * le sang jaillit par la plaie et s'étale sur la peau ; `plug` : halo sur le bouchon.
 */
export const ShardSection: React.FC<{width?: number; out?: number; gush?: number; plug?: number}> = ({width = 900, out = 0, gush = 0, plug = 0}) => {
	const frame = useCurrentFrame();
	const vy = 238;
	const cx = 450;
	const flowing = gush > 0 ? 1 : 0;
	return (
		<svg width={width} height={(width * 500) / 900} viewBox="0 0 900 500" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{/* le vaisseau, coupé au milieu */}
			{[
				[0, cx - 34],
				[cx + 34, 900],
			].map(([a, b]) => (
				<g key={a}>
					<rect x={a} y={vy - 22} width={b - a} height={44} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={6} />
					{Array.from({length: 6}, (_, i) => {
						const t = ((frame / 40 + i / 6) % 1) as number;
						const x = a + (b - a) * t;
						return <ellipse key={i} cx={x} cy={vy} rx={13} ry={8} fill={LPI.pink} stroke={alpha(N, 0.55)} strokeWidth={3} />;
					})}
				</g>
			))}
			{plug > 0 ? <circle cx={cx} cy={vy} r={60 + 6 * Math.sin(frame / 4)} fill="none" stroke={LPI.blue} strokeWidth={7} strokeDasharray="14 10" opacity={plug} /> : null}
			{/* le sang qui jaillit */}
			{flowing ? (
				<g opacity={Math.min(1, gush * 3)}>
					<path d={`M${cx - 30} ${vy} Q${cx - 26} ${150} ${cx - 18} ${60} L${cx + 18} ${60} Q${cx + 26} ${150} ${cx + 30} ${vy} Z`} fill={LPI.pink} stroke={N} strokeWidth={5} />
					<path d={`M${cx - 30 - 260 * gush} 60 Q${cx} ${60 - 90 * gush} ${cx + 30 + 260 * gush} 60 Z`} fill={LPI.pink} stroke={N} strokeWidth={5} />
					{Array.from({length: 8}, (_, i) => {
						const t = ((frame / 14 + i / 8) % 1) as number;
						const a = -Math.PI / 2 + ((i % 4) - 1.5) * 0.4;
						return <circle key={i} cx={cx + Math.cos(a) * 200 * t} cy={50 + Math.sin(a) * 200 * t + 160 * t * t} r={14 * (1 - t) + 4} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={gush} />;
					})}
				</g>
			) : null}
			{/* l'éclat : planté dans la plaie, il bouche le vaisseau */}
			<g transform={`translate(0 ${-1300 * out}) rotate(${-14 * out} ${cx} 0)`}>
				<path d={`M${cx - 48} -80 L${cx + 52} -60 L${cx + 6} ${vy + 40} Z`} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={7} strokeLinejoin="round" />
				<path d={`M${cx - 18} -50 L${cx + 2} ${vy - 20}`} stroke={LPI.paper} strokeWidth={7} strokeLinecap="round" />
			</g>
		</svg>
	);
};

/** Petite écharde (180 × 120) : un doigt avec une minuscule écharde en surface. */
export const Splinter: React.FC<{size?: number}> = ({size = 180}) => (
	<svg width={size} height={(size * 120) / 180} viewBox="0 0 180 120" style={{overflow: 'visible', display: 'block'}}>
		<path d="M0 30 H130 Q172 30 172 70 Q172 110 130 110 H0 Z" fill={LPI.paper} {...SK} />
		<path d="M0 30 H130 Q172 30 172 70 Q172 110 130 110 H0 Z" fill={alpha(LPI.pink, 0.25)} />
		<path d="M120 46 Q150 50 156 66" fill="none" stroke={alpha(N, 0.3)} strokeWidth={5} strokeLinecap="round" />
		<path d="M70 44 L104 30 L96 50 Z" fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={4} strokeLinejoin="round" />
	</svg>
);

/** Chaise (160 × 200). */
export const Chair: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={(size * 200) / 160} viewBox="0 0 160 200" style={{overflow: 'visible', display: 'block'}}>
		<path d="M30 10 H58 V110" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
		<rect x={24} y={100} width={116} height={26} rx={10} fill={LPI.blue} {...SK} />
		<path d="M36 126 V192 M128 126 V192" stroke={N} strokeWidth={12} strokeLinecap="round" />
		<rect x={30} y={10} width={30} height={90} rx={10} fill={LPI.sky} {...SK} />
	</svg>
);

/** Hôpital (urgences) 200 × 180. */
export const ErIcon: React.FC<{size?: number}> = ({size = 200}) => (
	<svg width={size} height={(size * 180) / 200} viewBox="0 0 200 180" style={{overflow: 'visible', display: 'block'}}>
		<rect x={20} y={50} width={160} height={124} rx={14} fill={LPI.paper} {...SK} />
		<rect x={64} y={10} width={72} height={58} rx={12} fill={LPI.paper} {...SK} />
		<path d="M100 20 V58 M81 39 H119" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" />
		<rect x={30} y={86} width={140} height={30} rx={8} fill={LPI.blue} />
		<text x={100} y={109} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={22} fill={LPI.paper}>
			URGENCES
		</text>
		<rect x={84} y={130} width={32} height={44} rx={6} fill={LPI.sky} {...SK} strokeWidth={5} />
	</svg>
);
