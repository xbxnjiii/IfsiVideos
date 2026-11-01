// Hygiène des mains : microbes (petits, ronds, amusants mais sérieux), essaims qui apparaissent / s'en vont, étincelles
// de mains propres, loupe, environnement du patient (lit, table, pompe), gouttes de liquides biologiques, robinet +
// savon, suivi des 5 indications (2 « avant » en bleu, 3 « après » en rose). Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SK = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Pseudo-aléatoire stable (graine → 0..1). */
export const rnd = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Un microbe : corps rond, cils, deux yeux. `tone` : rose (les tiens), bleu clair (ceux du patient), bleu. */
export const Microbe: React.FC<{size?: number; tone?: string; seed?: number}> = ({size = 40, tone = LPI.pink, seed = 0}) => {
	const frame = useCurrentFrame();
	const spin = Math.sin(frame / 7 + seed) * 12;
	const squash = 1 + 0.08 * Math.sin(frame / 4 + seed * 3);
	return (
		<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible', transform: `rotate(${spin}deg) scale(${squash}, ${2 - squash})`}}>
			{Array.from({length: 8}, (_, i) => (
				<path key={i} d="M0 -30 V-44" transform={`rotate(${i * 45 + Math.sin(frame / 3 + i) * 8})`} stroke={N} strokeWidth={6} strokeLinecap="round" />
			))}
			<circle r={30} fill={tone} stroke={N} strokeWidth={6} />
			<circle cx={-10} cy={-4} r={5} fill={N} />
			<circle cx={10} cy={-4} r={5} fill={N} />
			<path d="M-8 10 Q0 15 8 10" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
		</svg>
	);
};

/**
 * Essaim de microbes dans un rectangle (w × h) : `appear` 0 → 1 les fait arriver un par un, `gone` 0 → 1 les fait
 * disparaître (rétrécissent, s'effacent). Positions fixes (graine), petit frétillement.
 */
export const Swarm: React.FC<{w: number; h: number; n?: number; seed?: number; size?: number; appear?: number; gone?: number; tone?: string | string[]}> = ({
	w,
	h,
	n = 12,
	seed = 1,
	size = 40,
	appear = 1,
	gone = 0,
	tone = LPI.pink,
}) => {
	const frame = useCurrentFrame();
	const tones = Array.isArray(tone) ? tone : [tone];
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, pointerEvents: 'none'}}>
			{Array.from({length: n}, (_, i) => {
				const a = interpolate(appear * n - i, [0, 1], [0, 1], clamp);
				const g = interpolate(gone * n - (n - 1 - i) * 0.4, [0, 1], [0, 1], clamp);
				const k = a * (1 - g);
				if (k <= 0) return null;
				const x = rnd(seed * 31 + i) * (w - size) + Math.sin(frame / 9 + i) * 6;
				const y = rnd(seed * 17 + i * 3) * (h - size) + Math.cos(frame / 11 + i) * 6;
				const s = (0.7 + 0.5 * rnd(seed + i * 7)) * (a < 1 ? 0.4 + 0.6 * a + 0.15 * Math.sin(a * Math.PI) : 1) * (1 - 0.6 * g);
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, opacity: Math.min(1, k * 1.5), transform: `scale(${s})`}}>
						<Microbe size={size} tone={tones[i % tones.length]} seed={seed + i} />
					</div>
				);
			})}
		</div>
	);
};

/** Étincelles « propre » (étoiles à 4 branches) qui éclatent à `at` autour de (x, y). */
export const Sparkles: React.FC<{at: number; x: number; y: number; r?: number; n?: number}> = ({at: t0, x, y, r = 120, n = 7}) => {
	const frame = useCurrentFrame();
	const t = frame - t0;
	if (t < 0 || t > 30) return null;
	return (
		<>
			{Array.from({length: n}, (_, i) => {
				const ang = (i / n) * Math.PI * 2 + 0.4;
				const d = r * (0.5 + 0.5 * rnd(i + 3)) * interpolate(t, [0, 14], [0.3, 1], clamp);
				const s = interpolate(t, [0, 6, 22, 30], [0, 1.1, 1, 0], clamp) * (0.6 + 0.6 * rnd(i + 9));
				return (
					<svg key={i} width={44} height={44} viewBox="-22 -22 44 44" style={{position: 'absolute', left: x + Math.cos(ang) * d - 22, top: y + Math.sin(ang) * d - 22, transform: `scale(${s}) rotate(${t * 6}deg)`}}>
						<path d="M0 -20 Q3 -3 20 0 Q3 3 0 20 Q-3 3 -20 0 Q-3 -3 0 -20 Z" fill={i % 2 ? LPI.sky : LPI.paper} stroke={N} strokeWidth={3} />
					</svg>
				);
			})}
		</>
	);
};

/** Loupe : verre rond (le contenu `children` est vu à travers, déjà grossi par l'appelant) + manche. */
export const Loupe: React.FC<{r: number; children?: React.ReactNode}> = ({r, children}) => (
	<div style={{position: 'relative', width: r * 2, height: r * 2}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: alpha(LPI.paper, 0.96)}}>{children}</div>
		<svg width={r * 3.1} height={r * 3.1} viewBox={`${-r - 12} ${-r - 12} ${r * 3.1} ${r * 3.1}`} style={{position: 'absolute', left: -12, top: -12, overflow: 'visible'}}>
			<circle cx={r} cy={r} r={r} fill="none" stroke={N} strokeWidth={16} />
			<circle cx={r} cy={r} r={r - 14} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={6} />
			<path d={`M${r + r * 0.72} ${r + r * 0.72} L${r + r * 1.45} ${r + r * 1.45}`} stroke={N} strokeWidth={34} strokeLinecap="round" />
			<path d={`M${r + r * 0.78} ${r + r * 0.78} L${r + r * 1.4} ${r + r * 1.4}`} stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" />
		</svg>
	</div>
);

/** Goutte (liquide biologique) : `tone` rose = sang, bleu clair = urines, blanc cassé = salive. */
export const Drop: React.FC<{size?: number; tone?: string}> = ({size = 60, tone = LPI.pink}) => (
	<svg width={size} height={size * 1.3} viewBox="0 0 60 78" style={{overflow: 'visible'}}>
		<path d="M30 4 C22 20 8 36 8 50 A22 22 0 0 0 52 50 C52 36 38 20 30 4 Z" fill={tone} {...SK} />
		<path d="M18 48 Q18 40 24 34" fill="none" stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** Lit d'hôpital vu de côté (420 × 240) ; `rail` : barrière mise en avant. */
export const Bed: React.FC<{width?: number; rail?: number}> = ({width = 420, rail = 0}) => (
	<svg width={width} height={(width * 240) / 420} viewBox="0 0 420 240" style={{overflow: 'visible'}}>
		<rect x={20} y={40} width={22} height={150} rx={8} fill={LPI.blue} {...SK} />
		<rect x={380} y={80} width={22} height={110} rx={8} fill={LPI.blue} {...SK} />
		<rect x={30} y={120} width={360} height={46} rx={14} fill={LPI.sky} {...SK} />
		<rect x={44} y={92} width={340} height={34} rx={14} fill={LPI.paper} {...SK} />
		<rect x={52} y={70} width={92} height={30} rx={14} fill={LPI.paper} {...SK} />
		<g opacity={0.5 + 0.5 * rail}>
			<rect x={150} y={56} width={170} height={16} rx={8} fill={rail > 0.5 ? LPI.pink : LPI.paper} {...SK} />
			<path d="M170 72 V100 M300 72 V100" {...SK} fill="none" />
		</g>
		{[70, 350].map((x) => (
			<g key={x}>
				<path d={`M${x} 166 V200`} {...SK} fill="none" />
				<circle cx={x} cy={212} r={14} fill={N} />
			</g>
		))}
	</svg>
);

/** Table de chevet (160 × 200) avec un verre. */
export const BedTable: React.FC<{width?: number}> = ({width = 160}) => (
	<svg width={width} height={(width * 200) / 160} viewBox="0 0 160 200" style={{overflow: 'visible'}}>
		<path d="M66 20 H96 L92 70 H70 Z" fill={alpha(LPI.sky, 0.8)} {...SK} />
		<rect x={14} y={70} width={132} height={120} rx={14} fill={LPI.paper} {...SK} />
		<path d="M14 110 H146" {...SK} fill="none" />
		<rect x={64} y={130} width={32} height={10} rx={5} fill={N} />
		<rect x={64} y={88} width={32} height={10} rx={5} fill={N} />
	</svg>
);

/** Pompe à perfusion sur son pied (160 × 300). */
export const IvPump: React.FC<{width?: number}> = ({width = 160}) => (
	<svg width={width} height={(width * 300) / 160} viewBox="0 0 160 300" style={{overflow: 'visible'}}>
		<path d="M80 10 V286 M40 286 H120" {...SK} fill="none" strokeWidth={8} />
		<path d="M54 16 H106" {...SK} fill="none" strokeWidth={8} />
		<rect x={70} y={22} width={36} height={56} rx={10} fill={alpha(LPI.sky, 0.85)} {...SK} />
		<rect x={22} y={110} width={116} height={86} rx={14} fill={LPI.blue} {...SK} />
		<rect x={36} y={124} width={88} height={36} rx={8} fill={LPI.paper} stroke={N} strokeWidth={4} />
		<text x={80} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={N}>
			50 mL/h
		</text>
		<circle cx={50} cy={180} r={7} fill={LPI.pink} stroke={N} strokeWidth={3} />
		<circle cx={74} cy={180} r={7} fill={LPI.paper} stroke={N} strokeWidth={3} />
	</svg>
);

/** Robinet + savon (300 × 220) : l'eau coule si `flow` > 0, mousse si `soap` > 0. */
export const Faucet: React.FC<{width?: number; flow?: number; soap?: number}> = ({width = 300, flow = 1, soap = 1}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 220) / 300} viewBox="0 0 300 220" style={{overflow: 'visible'}}>
			<path d="M40 30 H150 Q180 30 180 60 V80" fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
			<path d="M40 30 H150 Q180 30 180 60 V80" fill="none" stroke={LPI.sky} strokeWidth={16} strokeLinecap="round" />
			<rect x={70} y={6} width={40} height={18} rx={6} fill={LPI.blue} {...SK} />
			{flow > 0 ? (
				<g opacity={flow}>
					{[0, 1, 2].map((i) => (
						<path key={i} d={`M${170 + i * 10} 96 V${150 + ((frame * 6 + i * 20) % 40)}`} stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" />
					))}
				</g>
			) : null}
			<rect x={190} y={160} width={96} height={52} rx={22} fill={LPI.pink} {...SK} />
			{soap > 0
				? [0, 1, 2, 3].map((i) => (
						<circle key={i} cx={206 + i * 24} cy={150 - ((frame * 1.5 + i * 13) % 50)} r={8 + (i % 2) * 4} fill={alpha(LPI.paper, 0.9)} stroke={N} strokeWidth={3} opacity={soap} />
					))
				: null}
		</svg>
	);
};

/** Suivi des 5 indications : 1 – 2 « avant » (bleu), 3 – 5 « après » (rose) ; `current` grossit, les précédentes sont cochées. */
export const StepTracker: React.FC<{current: number; at: number}> = ({current, at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 8], [0, 1], clamp);
	const pulse = 1 + 0.06 * Math.sin(frame / 4);
	const dot = (n: number) => {
		const before = n <= 2;
		const tone = before ? LPI.blue : LPI.pink;
		const on = n === current;
		const done = n < current;
		const d = on ? 96 : 70;
		return (
			<div key={n} style={{width: d, height: d, borderRadius: d / 2, background: on || done ? tone : LPI.paper, border: `5px solid ${on ? N : alpha(N, 0.45)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: on ? 52 : 36, color: on || done ? (before ? LPI.paper : N) : alpha(N, 0.5), transform: `scale(${on ? pulse : 1})`, boxShadow: on ? SHADOW : 'none'}}>
				{done ? '✓' : n}
			</div>
		);
	};
	const group = (label: string, tone: string, ns: number[]) => (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}>{ns.map(dot)}</div>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.16em', color: tone === LPI.pink ? alpha(N, 0.75) : LPI.blue}}>{label}</div>
		</div>
	);
	return (
		<div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 46, opacity: o}}>
			{group('AVANT', LPI.blue, [1, 2])}
			{group('APRÈS', LPI.pink, [3, 4, 5])}
		</div>
	);
};
