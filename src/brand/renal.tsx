// Briques « bilan rénal » (série les tubes, n° 64) : le rein qui filtre le sang (déchets qui partent dans l'urine ou
// qui restent dans le sang), l'échelle des stades du DFG, les deux jauges créatinine ↑ / DFG ↓, la courbe aiguë /
// chronique, le muscle et la chaîne de protéine. Couleurs de la marque seulement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;

/** Hachage déterministe 0 → 1. */
const rnd = (i: number, k = 1) => {
	const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return s - Math.floor(s);
};

const BEAN = 'M0 -150 C100 -150 140 -70 128 10 C116 100 52 160 -16 146 C-66 136 -58 76 -36 36 C-22 8 -50 -14 -76 -36 C-116 -76 -80 -150 0 -150 Z';

/**
 * Le rein qui filtre (920 × 700) : le sang traverse le rein de gauche à droite avec des globules (blanc cassé, gardés)
 * et des déchets (points bleu nuit). `filter` 1 → les déchets tombent dans l'uretère vers l'urine ; 0 → ils restent dans
 * le sang. `pile` 0 → 1 : déchets accumulés dans le sang (rein fatigué). `glow` : halo bleu clair autour du rein.
 */
export const KidneyFilter: React.FC<{width?: number; filter?: number; pile?: number; glow?: number; tired?: number}> = ({width = 920, filter = 1, pile = 0, glow = 0, tired = 0}) => {
	const frame = useCurrentFrame();
	const W = 920;
	const H = 700;
	const VY = 150;
	const KX = 460;
	const KY = 290;
	const dots: React.ReactNode[] = [];
	const n = 26;
	for (let i = 0; i < n; i++) {
		const waste = i % 2 === 0;
		const p = (frame / 120 + i / n + rnd(i) * 0.03) % 1;
		const x = p * W;
		const lane = VY + (rnd(i, 2) - 0.5) * 56;
		if (!waste) {
			dots.push(<ellipse key={i} cx={x} cy={lane} rx={15} ry={11} fill={LPI.paper} stroke={N} strokeWidth={3} />);
			continue;
		}
		const leaves = rnd(i, 3) < filter;
		if (leaves && x > KX - 20) {
			// descend dans l'uretère
			const q = Math.min(1, (x - (KX - 20)) / 300);
			const y = interpolate(q, [0, 0.35, 1], [lane, KY + 40, H - 60]);
			const xx = interpolate(q, [0, 0.35, 1], [KX - 20, KX + 10, KX + 10]);
			if (q >= 1) continue;
			dots.push(<circle key={i} cx={xx} cy={y} r={9} fill={N} />);
		} else {
			dots.push(<circle key={i} cx={x} cy={lane} r={9} fill={N} />);
		}
	}
	// déchets accumulés
	const piled = Math.round(pile * 34);
	for (let j = 0; j < piled; j++) {
		const x = ((rnd(j, 5) * W + frame * 2.2) % W);
		const y = VY + (rnd(j, 6) - 0.5) * 70;
		dots.push(<circle key={`p${j}`} cx={x} cy={y} r={8} fill={alpha(N, 0.85)} />);
	}
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			{/* uretère + urine */}
			<path d={`M${KX + 10} ${KY + 60} V${H - 70}`} stroke={N} strokeWidth={34} strokeLinecap="round" />
			<path d={`M${KX + 10} ${KY + 60} V${H - 70}`} stroke={alpha(LPI.sky, 1)} strokeWidth={20} strokeLinecap="round" />
			<ellipse cx={KX + 10} cy={H - 38} rx={110} ry={34} fill={alpha('#F6E7A8', 0.95)} stroke={N} strokeWidth={6} />
			{/* rein */}
			<g transform={`translate(${KX} ${KY}) scale(1.55)`}>
				<circle r={190} fill={alpha(LPI.sky, 0.55 * glow)} />
				<path d={BEAN} fill={interpolateColor(tired)} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M-30 -96 C30 -80 60 -20 40 50" fill="none" stroke={alpha(LPI.paper, 0.75)} strokeWidth={14} strokeLinecap="round" />
			</g>
			{/* vaisseau sanguin par-dessus le rein */}
			<rect x={0} y={VY - 48} width={W} height={96} rx={48} fill={alpha(LPI.pink, 0.92)} stroke={N} strokeWidth={6} />
			{dots}
		</svg>
	);
};

/** Rose (rein en forme) → rose pâle grisé (rein fatigué). */
const interpolateColor = (t: number) => (t <= 0 ? LPI.pink : t >= 1 ? '#CDB7C3' : `color-mix(in srgb, ${LPI.pink} ${Math.round((1 - t) * 100)}%, #A9A9B8)`);

/** Les stades du DFG (mL/min/1,73 m²), du meilleur au pire. */
export const DFG_STAGES = [
	{st: '1', range: '≥ 90', label: 'normal + signes d\'atteinte', v: 100},
	{st: '2', range: '60 – 89', label: 'légère baisse', v: 75},
	{st: '3', range: '30 – 59', label: 'baisse modérée', sub: '3a : 45 – 59 · 3b : 30 – 44', v: 45},
	{st: '4', range: '15 – 29', label: 'baisse sévère', v: 22},
	{st: '5', range: '< 15', label: 'insuffisance rénale terminale', v: 10},
];

/**
 * L'échelle des 5 stades (largeur 940) : chaque ligne apparaît à son temps `lit[i]` ; `cur` = ligne en surbrillance
 * (index, peut être fractionnaire pour glisser). Les lignes passent du bleu (bon) au rose (grave).
 */
export const StageLadder: React.FC<{lit: number[]; cur: number; width?: number}> = ({lit, cur, width = 940}) => {
	const frame = useCurrentFrame();
	const rowH = 150;
	const tones = [LPI.sky, alpha(LPI.sky, 0.6), alpha(LPI.pink, 0.45), alpha(LPI.pink, 0.75), LPI.pink];
	return (
		<div style={{position: 'relative', width, height: rowH * 5 + 20}}>
			{DFG_STAGES.map((s, i) => {
				const t0 = lit[i] ?? 1e9;
				if (frame < t0) return null;
				const k = Math.min(1, (frame - t0) / 9);
				const on = Math.max(0, 1 - Math.abs(cur - i));
				return (
					<div
						key={s.st}
						style={{
							position: 'absolute',
							left: 0,
							top: i * rowH,
							width,
							height: rowH - 18,
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'center',
							gap: 22,
							padding: '0 24px',
							borderRadius: 34,
							background: tones[i],
							border: `${5 + on * 3}px solid ${N}`,
							boxShadow: SHADOW,
							opacity: interpolate(k, [0, 1], [0, 0.45 + 0.55 * Math.max(on, frame >= t0 ? 0.55 : 0)]),
							transform: `translateX(${(1 - k) * -80}px) scale(${1 + on * 0.04})`,
						}}
					>
						<div style={{width: 92, height: 92, borderRadius: 46, background: on > 0.5 ? N : LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: on > 0.5 ? LPI.paper : N}}>{s.st}</div>
						<div style={{width: 230, fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N, whiteSpace: 'nowrap'}}>{s.range}</div>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, lineHeight: 1.1}}>{s.label}</div>
							{s.sub ? <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: alpha(N, 0.75), marginTop: 4}}>{s.sub}</div> : null}
						</div>
					</div>
				);
			})}
		</div>
	);
};

/** Deux jauges côte à côte : la créatinine monte quand le DFG baisse (`k` 0 → 1). */
export const InverseGauges: React.FC<{k: number; width?: number}> = ({k, width = 700}) => {
	const frame = useCurrentFrame();
	const H = 440;
	const bar = (x: number, level: number, label: string, tone: string, up: boolean) => (
		<g transform={`translate(${x} 0)`}>
			<rect x={-70} y={20} width={140} height={340} rx={30} fill={LPI.paper} stroke={N} strokeWidth={7} />
			<rect x={-58} y={32 + 316 * (1 - level)} width={116} height={316 * level} rx={22} fill={tone} />
			<text x={0} y={410} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={42} fill={N}>
				{label}
			</text>
			<text x={110} y={200 + (up ? -1 : 1) * 8 * Math.sin(frame / 3)} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={110} fill={N} opacity={k}>
				{up ? '↑' : '↓'}
			</text>
		</g>
	);
	return (
		<svg width={width} height={(width / 700) * H} viewBox={`0 0 700 ${H}`} style={{overflow: 'visible'}}>
			{bar(150, 0.25 + 0.65 * k, 'créatinine', LPI.pink, true)}
			{bar(480, 0.9 - 0.65 * k, 'DFG', LPI.blue, false)}
		</svg>
	);
};

/** Petite courbe (500 × 300) : `mode` « aigue » = la valeur saute d'un coup, « chronique » = elle monte lentement ; `k` 0 → 1 trace. */
export const TrendCurve: React.FC<{mode: 'aigue' | 'chronique'; k: number; width?: number}> = ({mode, k, width = 420}) => {
	const pts: string[] = [];
	const n = 60;
	for (let i = 0; i <= Math.round(n * k); i++) {
		const t = i / n;
		const v = mode === 'aigue' ? (t < 0.55 ? 0.15 : 0.15 + 0.7 * Math.min(1, (t - 0.55) / 0.08)) : 0.15 + 0.7 * t * t;
		pts.push(`${40 + t * 440},${260 - v * 220}`);
	}
	return (
		<svg width={width} height={(width / 500) * 300} viewBox="0 0 500 300">
			<rect x={4} y={4} width={492} height={292} rx={30} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<path d="M40 30 V262 H480" fill="none" stroke={alpha(N, 0.45)} strokeWidth={5} strokeLinecap="round" />
			{pts.length > 1 ? <polyline points={pts.join(' ')} fill="none" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : null}
		</svg>
	);
};

/** Un biceps contracté (icône, repère 200 × 200). `size` 0,6 → 1,2 : muscle plus ou moins gros. */
export const MuscleArm: React.FC<{size?: number; bulk?: number; pump?: number}> = ({size = 220, bulk = 1, pump = 0}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<path d="M30 170 L60 110 Q66 96 80 92 L118 84 L126 40 Q130 22 148 26 Q166 30 162 50 L156 96 Q154 120 132 128 L80 150 L64 180 Z" fill="#F1C9A5" stroke={N} strokeWidth={7} strokeLinejoin="round" />
		<ellipse cx={100} cy={112 - pump * 4} rx={34 * bulk} ry={24 * bulk + pump * 3} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={6} />
	</svg>
);

/** Chaîne de protéine qui se défait en acides aminés (`split` 0 → 1). Largeur 600. */
export const ProteinChain: React.FC<{split?: number; width?: number}> = ({split = 0, width = 600}) => {
	const frame = useCurrentFrame();
	const n = 8;
	const tones = [LPI.pink, LPI.sky, LPI.blue, LPI.pink, LPI.sky, LPI.blue, LPI.pink, LPI.sky];
	return (
		<svg width={width} height={(width / 600) * 160} viewBox="0 0 600 160" style={{overflow: 'visible'}}>
			{Array.from({length: n}).map((_, i) => {
				const x = 60 + i * 68 + (i - 3.5) * 18 * split;
				const y = 80 + Math.sin(i * 1.3 + frame / 10) * (14 + 26 * split);
				const nx = 60 + (i + 1) * 68 + (i + 1 - 3.5) * 18 * split;
				const ny = 80 + Math.sin((i + 1) * 1.3 + frame / 10) * (14 + 26 * split);
				return (
					<g key={i}>
						{i < n - 1 ? <line x1={x} y1={y} x2={nx} y2={ny} stroke={N} strokeWidth={8} opacity={1 - split} /> : null}
						<circle cx={x} cy={y} r={26} fill={tones[i]} stroke={N} strokeWidth={6} />
					</g>
				);
			})}
		</svg>
	);
};

/** Pastille « molécule » ronde avec un texte (NH₃, urée…). */
export const Molecule: React.FC<{label: string; tone?: string; size?: number}> = ({label, tone = LPI.sky, size = 140}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * (label.length > 4 ? 0.22 : 0.3), color: N, textAlign: 'center', lineHeight: 1}}>{label}</div>
);

/** La machine de dialyse (icône 260 × 220) : le sang sort du bras, passe dans la machine et revient. */
export const DialysisMachine: React.FC<{size?: number; flow?: number}> = ({size = 300, flow = 1}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={(size / 260) * 220} viewBox="0 0 260 220" style={{overflow: 'visible'}}>
			<rect x={120} y={10} width={130} height={200} rx={18} fill={LPI.sky} stroke={N} strokeWidth={7} />
			<rect x={138} y={30} width={94} height={56} rx={10} fill={LPI.paper} stroke={N} strokeWidth={5} />
			<circle cx={185} cy={130} r={26} fill={LPI.paper} stroke={N} strokeWidth={5} />
			<g transform={`rotate(${frame * 6 * flow} 185 130)`}>
				<path d="M185 108 V152 M163 130 H207" stroke={N} strokeWidth={5} strokeLinecap="round" />
			</g>
			<path d="M20 120 Q60 60 120 70" fill="none" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" strokeDasharray="14 12" strokeDashoffset={-frame * 2 * flow} />
			<path d="M120 170 Q60 180 20 150" fill="none" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" strokeDasharray="14 12" strokeDashoffset={-frame * 2 * flow} />
			<path d="M8 100 H40 V170 H8 Z" fill="#F1C9A5" stroke={N} strokeWidth={6} strokeLinejoin="round" />
		</svg>
	);
};

