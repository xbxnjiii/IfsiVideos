// « Une tique : comment bien la retirer ? » : peau en très gros plan (grain, pores, fins poils, ombre douce), tique vue de
// dessus (rostre, écusson, 8 pattes articulées qui bougent, gorgée de sang ou non), tire-tique (crochet fendu qui se glisse
// dessous et tourne), plaque rouge qui s'étend (érythème migrant), petits flacons et pictos. Même rendu soigné que
// bandage.tsx (peau opaque en dégradé, contours fins, ombres floutées). Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const LINE = {stroke: alpha(N, 0.72), strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const SKIN_HI = mix(LPI.paper, LPI.pink, 0.18);
const SKIN_LO = mix(LPI.paper, LPI.pink, 0.5);
/** Pseudo-hasard stable (même dessin à chaque image). */
const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/**
 * Peau en très gros plan (repère 1000 × 1000, déborde largement pour remplir l'écran) : dégradé, grain en losanges,
 * pores, fins poils. `red` 0 → 1 : petite rougeur au centre ; `ring` 0 → 1 : plaque rouge qui s'étend (érythème migrant,
 * centre plus clair) ; `tint` voile d'antiseptique. `children` : calques dans le même repère (tique, outil…).
 */
export const SkinG: React.FC<{red?: number; ring?: number; tint?: number; children?: React.ReactNode}> = ({red = 0, ring = 0, tint = 0, children}) => {
	const id = React.useId().replace(/:/g, '');
	const R = 60 + 380 * cl(ring);
	return (
		<g>
			<defs>
				<radialGradient id={`sk${id}`} cx="0.45" cy="0.4" r="0.8">
					<stop offset="0" stopColor={SKIN_HI} />
					<stop offset="1" stopColor={SKIN_LO} />
				</radialGradient>
				<radialGradient id={`em${id}`} cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor={alpha(LPI.pink, 0.55)} />
					<stop offset="0.45" stopColor={alpha(LPI.pink, 0.12)} />
					<stop offset="0.75" stopColor={alpha(LPI.pink, 0.6)} />
					<stop offset="0.92" stopColor={alpha(LPI.pink, 0.75)} />
					<stop offset="1" stopColor={alpha(LPI.pink, 0)} />
				</radialGradient>
				<filter id={`sb${id}`} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<rect x={-1500} y={-1500} width={4000} height={4000} fill={`url(#sk${id})`} />
			{/* grain de la peau : fins sillons croisés */}
			{Array.from({length: 40}, (_, i) => (
				<path key={`a${i}`} d={`M${-1500 + i * 100} -1500 L${-1500 + i * 100 + 3000} 1500`} stroke={alpha(N, 0.045)} strokeWidth={2} />
			))}
			{Array.from({length: 40}, (_, i) => (
				<path key={`b${i}`} d={`M${-1500 + i * 100} 2500 L${-1500 + i * 100 + 3000} -500`} stroke={alpha(N, 0.035)} strokeWidth={2} />
			))}
			{/* pores et fins poils */}
			{Array.from({length: 70}, (_, i) => {
				const x = -500 + rnd(i) * 2000;
				const y = -500 + rnd(i + 99) * 2000;
				const a = -30 + rnd(i + 7) * 30;
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
						<circle r={3.5} fill={alpha(N, 0.18)} />
						{i % 2 ? <path d={`M0 0 q18 -6 38 -2`} fill="none" stroke={alpha(N, 0.28)} strokeWidth={2.2} strokeLinecap="round" /> : null}
					</g>
				);
			})}
			{ring > 0 ? <circle cx={500} cy={500} r={R} fill={`url(#em${id})`} filter={`url(#sb${id})`} /> : null}
			{red > 0 ? <circle cx={500} cy={500} r={46} fill={alpha(LPI.pink, 0.55 * cl(red))} filter={`url(#sb${id})`} /> : null}
			{tint > 0 ? <circle cx={500} cy={500} r={120} fill={alpha(LPI.blue, 0.14 * cl(tint))} filter={`url(#sb${id})`} /> : null}
			{children}
		</g>
	);
};

/**
 * Tique vue de dessus, centre (`x`, `y`), longueur ≈ 40 × `s` unités, tête vers `ang` (degrés, 0 = vers le haut) :
 * rostre, écusson brillant, corps, 8 pattes articulées (`walk` : elles bougent). `fed` 0 → 1 gorgée (corps gonflé, plus
 * clair) ; `buried` 0 → 1 tête plantée dans la peau (rostre caché, petite rougeur) ; `head` : le rostre bien visible
 * (une fois retirée, « avec sa tête »).
 */
export const TickG: React.FC<{x: number; y: number; s?: number; ang?: number; walk?: number; fed?: number; buried?: number; opacity?: number}> = ({x, y, s = 1, ang = 0, walk = 0, fed = 0, buried = 0, opacity = 1}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const f = cl(fed);
	const bw = 13 + 7 * f;
	const bh = 15 + 8 * f;
	const body = mix(N, LPI.sky, 0.25 * f);
	const leg = (side: 1 | -1, i: number) => {
		const base = -6 + i * 4.2;
		const w = Math.sin(frame * 0.6 * walk + i * 1.7 + (side > 0 ? 0 : Math.PI)) * 4 * walk;
		const sweep = [-55, -20, 15, 45][i] + w;
		const r1 = (sweep * Math.PI) / 180;
		const knee = {x: side * (bw * 0.75 + 6 * Math.cos(r1)), y: base + 6 * Math.sin(r1) - 2};
		const foot = {x: knee.x + side * 6 * Math.cos(r1 + 0.6 * side * (i < 2 ? -1 : 1)), y: knee.y + 7 * Math.sin(r1) + (i < 2 ? -4 : 4)};
		return <path key={`${side}${i}`} d={`M${side * 4} ${base} L${knee.x} ${knee.y} L${foot.x} ${foot.y}`} fill="none" stroke={N} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />;
	};
	return (
		<g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`} opacity={opacity}>
			<defs>
				<radialGradient id={`tb${id}`} cx="0.4" cy="0.3" r="0.8">
					<stop offset="0" stopColor={mix(body, LPI.paper, 0.25)} />
					<stop offset="1" stopColor={body} />
				</radialGradient>
			</defs>
			<ellipse cx={3} cy={8} rx={bw + 6} ry={bh + 6} fill={alpha(N, 0.2)} />
			{[0, 1, 2, 3].map((i) => leg(1, i))}
			{[0, 1, 2, 3].map((i) => leg(-1, i))}
			{/* rostre (pièces buccales), caché quand la tête est plantée */}
			<g opacity={1 - cl(buried)}>
				<path d="M-3 -14 L-2 -24 L0 -27 L2 -24 L3 -14 Z" fill={mix(N, LPI.blue, 0.2)} stroke={N} strokeWidth={1} />
				<path d="M-4 -14 L-6 -21 M4 -14 L6 -21" stroke={N} strokeWidth={1.6} strokeLinecap="round" />
			</g>
			{/* corps */}
			<ellipse cx={0} cy={4} rx={bw} ry={bh} fill={`url(#tb${id})`} stroke={N} strokeWidth={1.4} />
			<path d={`M${-bw * 0.6} ${4 + bh * 0.3} Q0 ${4 + bh * 0.75} ${bw * 0.6} ${4 + bh * 0.3}`} fill="none" stroke={alpha(LPI.paper, 0.2)} strokeWidth={1.2} />
			{/* écusson brillant */}
			<path d="M-8 -12 Q0 -16 8 -12 Q9 -2 0 4 Q-9 -2 -8 -12 Z" fill={mix(N, LPI.blue, 0.12)} stroke={N} strokeWidth={1} />
			<ellipse cx={-3} cy={-9} rx={3} ry={1.6} fill={alpha(LPI.paper, 0.6)} />
			<ellipse cx={-5} cy={0} rx={4} ry={2} fill={alpha(LPI.paper, 0.35)} transform="rotate(-20 -5 0)" />
		</g>
	);
};

/**
 * Tire-tique (crochet) vu de dessus, pointe fendue en (`x`, `y`), corps orienté selon `ang` (degrés, direction pointe →
 * poignée), `scale`. Plastique bleu, fente en V.
 */
export const TickHookG: React.FC<{x: number; y: number; ang?: number; scale?: number; opacity?: number}> = ({x, y, ang = 0, scale = 1, opacity = 1}) => {
	const id = React.useId().replace(/:/g, '');
	return (
		<g transform={`translate(${x} ${y}) rotate(${ang}) scale(${scale})`} opacity={opacity}>
			<defs>
				<linearGradient id={`th${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mix(LPI.blue, LPI.paper, 0.35)} />
					<stop offset="1" stopColor={mix(LPI.blue, N, 0.15)} />
				</linearGradient>
			</defs>
			<path d="M-6 -34 L60 -40 L420 -46 Q460 -46 460 0 Q460 46 420 46 L60 40 L-6 34 L18 0 Z" fill={alpha(N, 0.22)} transform="translate(12 18)" />
			{/* fourche fendue (la fente en V attrape la tique au ras de la peau) */}
			<path d="M-6 -34 L60 -40 L420 -46 Q460 -46 460 0 Q460 46 420 46 L60 40 L-6 34 L18 0 Z" fill={`url(#th${id})`} {...LINE} strokeWidth={3} />
			<path d="M60 -26 L400 -32" stroke={alpha(LPI.paper, 0.55)} strokeWidth={8} strokeLinecap="round" />
			<circle cx={400} cy={0} r={16} fill={mix(LPI.sky, LPI.paper, 0.4)} stroke={alpha(N, 0.5)} strokeWidth={2} />
		</g>
	);
};

/** Petit flacon étiqueté (repère 120 × 200) : `label` en capitales, `tone` couleur du bouchon. */
export const LabelBottle: React.FC<{label: string; tone?: string; size?: number}> = ({label, tone = LPI.blue, size = 120}) => (
	<svg width={size} height={(size * 200) / 120} viewBox="0 0 120 200" style={{overflow: 'visible'}}>
		<rect x={40} y={8} width={40} height={34} rx={8} fill={tone} stroke={N} strokeWidth={4} />
		<path d="M30 46 Q30 40 40 40 L80 40 Q90 40 90 46 L104 76 Q108 84 108 94 L108 180 Q108 192 96 192 L24 192 Q12 192 12 180 L12 94 Q12 84 16 76 Z" fill={LPI.paper} stroke={N} strokeWidth={4} />
		<rect x={18} y={104} width={84} height={56} rx={8} fill={alpha(LPI.sky, 0.8)} stroke={alpha(N, 0.5)} strokeWidth={2} />
		<text x={60} y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={label.length > 6 ? 17 : 20} fill={N}>
			{label}
		</text>
		<path d="M26 96 L26 180" stroke={alpha(LPI.paper, 0.9)} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

/** Médaillon rond (peau vue à travers un hublot) : `children` = un `SkinG` déjà posé dans le repère 1000 × 1000. */
export const SkinMedallion: React.FC<{size?: number; children: React.ReactNode}> = ({size = 420, children}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, overflow: 'hidden', border: `8px solid ${N}`, boxShadow: SHADOW, background: LPI.paper}}>
		<svg width={size} height={size} viewBox="300 300 400 400">
			{children}
		</svg>
	</div>
);

/** Pictos des bons réflexes de balade (repère 160 × 120) : manches longues, pantalon, inspection à la loupe. */
export const WalkIcon: React.FC<{kind: 'sleeve' | 'pants' | 'check'; size?: number}> = ({kind, size = 160}) => (
	<svg width={size} height={(size * 120) / 160} viewBox="0 0 160 120" style={{overflow: 'visible'}}>
		{kind === 'sleeve' ? (
			<g>
				<path d="M20 30 L70 14 L140 30 L150 100 L118 104 L112 56 L104 110 L56 110 L48 56 L42 104 L10 100 Z" fill={LPI.sky} stroke={N} strokeWidth={4} strokeLinejoin="round" />
				<path d="M58 14 Q80 30 102 14" fill="none" stroke={N} strokeWidth={4} />
				<path d="M12 92 L42 96 M118 96 L148 92" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" />
			</g>
		) : kind === 'pants' ? (
			<g>
				<path d="M44 8 L116 8 L124 112 L90 112 L80 46 L70 112 L36 112 Z" fill={LPI.blue} stroke={N} strokeWidth={4} strokeLinejoin="round" />
				<path d="M44 22 L116 22" stroke={alpha(LPI.paper, 0.6)} strokeWidth={4} />
				<path d="M36 102 L70 102 M90 102 L124 102" stroke={LPI.sky} strokeWidth={6} strokeLinecap="round" />
			</g>
		) : (
			<g>
				<circle cx={66} cy={52} r={38} fill={alpha(LPI.sky, 0.7)} stroke={N} strokeWidth={6} />
				<circle cx={66} cy={52} r={6} fill={N} />
				<path d="M94 80 L138 112" stroke={N} strokeWidth={14} strokeLinecap="round" />
				<path d="M48 36 Q56 26 70 26" fill="none" stroke={LPI.paper} strokeWidth={6} strokeLinecap="round" />
			</g>
		)}
	</svg>
);
