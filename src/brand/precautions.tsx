// Précautions standard : équipements à « enfiler » sur le `Patient` (masque, lunettes, tablier ; même repère 400 × 560),
// gouttelettes de toux, objets du soin (seringue + capuchon, bassin, douchette, spray, sac de linge, mouchoir + poubelle,
// montre, bague), icônes des 6 réflexes et leur suivi. Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Hand} from './sampling';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SK = {stroke: N, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Masque chirurgical (repère du `Patient` 400 × 560) : élastiques vers les oreilles, plis. */
export const MaskShape: React.FC = () => (
	<>
		<path d="M150 140 L134 118 M250 140 L266 118 M152 170 L136 124 M248 170 L264 124" stroke={N} strokeWidth={4} fill="none" />
		<path d="M148 132 Q200 120 252 132 L248 172 Q200 190 152 172 Z" fill={LPI.sky} {...SK} />
		<path d="M156 146 H244 M156 158 H244" stroke={alpha(N, 0.5)} strokeWidth={4} />
	</>
);
/** Lunettes de protection (repère du `Patient`). */
export const GogglesShape: React.FC = () => (
	<>
		<path d="M134 114 H266" stroke={N} strokeWidth={6} />
		<rect x={150} y={100} width={100} height={34} rx={14} fill={alpha(LPI.sky, 0.55)} {...SK} />
		<path d="M200 104 V130" stroke={N} strokeWidth={5} />
		<path d="M160 108 L170 104" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" />
	</>
);
/** Tablier à usage unique (repère du `Patient`). */
export const ApronShape: React.FC = () => (
	<>
		<path d="M176 196 Q200 186 224 196" stroke={N} strokeWidth={5} fill="none" />
		<path d="M164 206 H236 L262 270 L272 560 H128 L138 270 Z" fill={alpha(LPI.paper, 0.93)} {...SK} />
		<path d="M140 300 H260" stroke={N} strokeWidth={5} />
		<path d="M150 210 L128 300 M250 210 L272 300" stroke={alpha(N, 0.4)} strokeWidth={4} />
	</>
);

/** Ce que porte le personnage (par-dessus un `Patient` de même taille) : chaque calque 0 → 1 (il « tombe » en place). */
export const Wear: React.FC<{size: number; mask?: number; goggles?: number; apron?: number}> = ({size, mask = 0, goggles = 0, apron = 0}) => {
	const layer = (k: number, node: React.ReactNode, dy: number) =>
		k > 0 ? (
			<g opacity={Math.min(1, k * 2)} transform={`translate(0 ${-dy * (1 - k)})`}>
				{node}
			</g>
		) : null;
	return (
		<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{layer(apron, <ApronShape />, 120)}
			{layer(mask, <MaskShape />, 80)}
			{layer(goggles, <GogglesShape />, 80)}
		</svg>
	);
};

/** Gouttelettes qui sortent de la bouche (repère du `Patient`) ; `blocked` 0 → 1 : le masque les arrête. */
export const CoughSpray: React.FC<{size: number; at: number; until?: number; blocked?: number; dir?: 1 | -1}> = ({size, at: t0, until = 1e9, blocked = 0, dir = 1}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > until + 24) return null;
	return (
		<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{Array.from({length: 14}, (_, i) => {
				const born = t0 + (i % 7) * 3 + Math.floor(i / 7) * 12;
				const t = ((frame - born) % 30) / 30;
				if (frame < born || frame > until + 20) return null;
				const reach = 260 * (1 - 0.85 * blocked);
				const ang = (-0.5 + (i * 0.37) % 1) * 0.9;
				const x = 200 + dir * (40 + t * reach * Math.cos(ang));
				const y = 158 + t * reach * Math.sin(ang) + t * t * 40;
				return <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 2} fill={i % 2 ? LPI.sky : LPI.blue} stroke={N} strokeWidth={2} opacity={(1 - t) * 0.95} />;
			})}
		</svg>
	);
};

/** Seringue + aiguille, horizontale (400 × 100), pointe à droite. */
export const Syringe: React.FC<{width?: number}> = ({width = 400}) => (
	<svg width={width} height={width / 4} viewBox="0 0 400 100" style={{overflow: 'visible'}}>
		<rect x={10} y={40} width={40} height={20} rx={4} fill={LPI.blue} {...SK} />
		<path d="M50 50 H90" {...SK} />
		<rect x={90} y={26} width={170} height={48} rx={8} fill={alpha(LPI.sky, 0.7)} {...SK} />
		<rect x={92} y={30} width={90} height={40} fill={alpha(LPI.pink, 0.6)} />
		{[120, 150, 180, 210, 240].map((x) => (
			<path key={x} d={`M${x} 26 V40`} stroke={N} strokeWidth={4} />
		))}
		<rect x={260} y={38} width={34} height={24} rx={4} fill={LPI.blue} {...SK} />
		<path d="M294 50 H392" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<path d="M380 46 L396 50 L380 54" fill={N} />
	</svg>
);
/** Capuchon d'aiguille (120 × 40). */
export const NeedleCap: React.FC<{width?: number}> = ({width = 120}) => (
	<svg width={width} height={width / 3} viewBox="0 0 120 40" style={{overflow: 'visible'}}>
		<path d="M4 12 H100 Q116 20 100 28 H4 Z" fill={LPI.pink} {...SK} />
	</svg>
);

/** Bassin de lit (300 × 160). */
export const Bedpan: React.FC<{width?: number}> = ({width = 300}) => (
	<svg width={width} height={(width * 160) / 300} viewBox="0 0 300 160" style={{overflow: 'visible'}}>
		<path d="M20 60 Q20 30 60 30 H240 Q290 30 290 80 Q290 140 230 140 H70 Q20 140 20 100 Z" fill={LPI.paper} {...SK} />
		<ellipse cx={150} cy={70} rx={100} ry={26} fill={alpha(LPI.sky, 0.8)} {...SK} />
		<path d="M290 80 H300" stroke={N} strokeWidth={14} strokeLinecap="round" />
	</svg>
);
/** Douchette (tête + flexible) qui arrose vers le bas (220 × 200). */
export const ShowerHead: React.FC<{width?: number; spray?: number}> = ({width = 220, spray = 0}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 200) / 220} viewBox="0 0 220 200" style={{overflow: 'visible'}}>
			<path d="M200 10 C200 60 170 60 140 60" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" />
			<path d="M146 40 L60 70 L84 104 L160 60 Z" fill={LPI.blue} {...SK} />
			{spray > 0
				? Array.from({length: 6}, (_, i) => {
						const t = ((frame * 2 + i * 9) % 40) / 40;
						return <path key={i} d={`M${74 + i * 6} ${96 + t * 70} l${-6 + i * 2} 14`} stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" opacity={spray * (1 - t)} />;
					})
				: null}
		</svg>
	);
};
/** Flacon pulvérisateur (détergent-désinfectant) (140 × 220). */
export const SprayBottle: React.FC<{width?: number}> = ({width = 140}) => (
	<svg width={width} height={(width * 220) / 140} viewBox="0 0 140 220" style={{overflow: 'visible'}}>
		<path d="M40 20 H96 L100 50 H40 Z" fill={N} />
		<path d="M96 26 H124 L118 38 H96" fill={N} />
		<path d="M60 50 H84 V70 H60 Z" fill={LPI.blue} {...SK} />
		<path d="M30 92 Q30 70 52 70 H92 Q114 70 114 92 V200 Q114 212 102 212 H42 Q30 212 30 200 Z" fill={LPI.sky} {...SK} />
		<rect x={44} y={112} width={56} height={60} rx={8} fill={LPI.paper} stroke={N} strokeWidth={4} />
		<path d="M72 124 V160 M54 142 H90" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" />
	</svg>
);
/** Sac à linge sale (180 × 220). */
export const LaundryBag: React.FC<{width?: number}> = ({width = 180}) => (
	<svg width={width} height={(width * 220) / 180} viewBox="0 0 180 220" style={{overflow: 'visible'}}>
		<path d="M30 60 Q20 200 40 210 H140 Q160 200 150 60 Z" fill={alpha(LPI.sky, 0.85)} {...SK} />
		<path d="M30 60 Q90 40 150 60" fill="none" {...SK} />
		<path d="M60 40 Q70 10 90 30 Q110 6 120 40" fill={LPI.paper} {...SK} />
		<path d="M50 120 Q90 140 130 120" fill="none" stroke={alpha(N, 0.4)} strokeWidth={5} />
	</svg>
);
/** Mouchoir en papier (80 × 70). */
export const Tissue: React.FC<{width?: number}> = ({width = 80}) => (
	<svg width={width} height={(width * 70) / 80} viewBox="0 0 80 70" style={{overflow: 'visible'}}>
		<path d="M10 20 Q30 4 44 18 Q60 6 72 24 Q78 46 62 60 Q40 70 20 60 Q4 44 10 20 Z" fill={LPI.paper} {...SK} strokeWidth={5} />
		<path d="M28 30 Q38 40 50 30" fill="none" stroke={alpha(N, 0.4)} strokeWidth={4} />
	</svg>
);
/** Poubelle à pédale (150 × 190) ; `open` 0 → 1 : le couvercle se soulève. */
export const Bin: React.FC<{width?: number; open?: number}> = ({width = 150, open = 0}) => (
	<svg width={width} height={(width * 190) / 150} viewBox="0 0 150 190" style={{overflow: 'visible'}}>
		<g transform={`rotate(${-40 * open} 20 50)`}>
			<rect x={16} y={36} width={118} height={18} rx={8} fill={LPI.blue} {...SK} />
		</g>
		<path d="M24 58 H126 L118 180 H32 Z" fill={LPI.paper} {...SK} />
		<path d="M54 80 V160 M75 80 V160 M96 80 V160" stroke={alpha(N, 0.35)} strokeWidth={5} />
	</svg>
);
/** Montre (bracelet + cadran) et bague, pour la main de `Hand` (repère 200 × 260). */
export const WatchShape: React.FC = () => (
	<>
		<rect x={46} y={232} width={118} height={26} rx={8} fill={N} />
		<circle cx={105} cy={245} r={22} fill={LPI.paper} {...SK} strokeWidth={5} />
		<path d="M105 245 V233 M105 245 H114" stroke={N} strokeWidth={4} strokeLinecap="round" />
	</>
);
export const RingShape: React.FC = () => (
	<>
		<rect x={76} y={96} width={32} height={12} rx={5} fill={LPI.pink} stroke={N} strokeWidth={4} />
		<circle cx={92} cy={94} r={7} fill={LPI.paper} stroke={N} strokeWidth={3} />
	</>
);

/* ───────────── icônes des 6 réflexes + suivi ───────────── */

export type ReflexKind = 'mains' | 'epi' | 'toux' | 'aes' | 'excreta' | 'env';
export const REFLEXES: ReflexKind[] = ['mains', 'epi', 'toux', 'aes', 'excreta', 'env'];
export const REFLEX_LABEL: Record<ReflexKind, string> = {mains: 'mains', epi: 'protections', toux: 'toux', aes: 'piqûres', excreta: 'excreta', env: 'environnement'};

export const ReflexIcon: React.FC<{kind: ReflexKind; size?: number}> = ({kind, size = 60}) => {
	if (kind === 'mains') return <Hand size={size * 0.72} />;
	if (kind === 'epi') return <Hand size={size * 0.72} gloved={1} />;
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
			{kind === 'toux' ? (
				<>
					<path d="M16 42 L4 30 M84 42 L96 30 M18 66 L4 36 M82 66 L96 36" stroke={N} strokeWidth={4} fill="none" />
					<path d="M14 38 Q50 26 86 38 L82 68 Q50 82 18 68 Z" fill={LPI.sky} {...SK} strokeWidth={5} />
					<path d="M22 50 H78 M22 60 H78" stroke={alpha(N, 0.5)} strokeWidth={4} />
				</>
			) : kind === 'aes' ? (
				<g transform="rotate(-40 50 50)">
					<path d="M4 50 H16 M10 40 V60" stroke={N} strokeWidth={6} strokeLinecap="round" />
					<rect x={16} y={38} width={46} height={24} rx={5} fill={alpha(LPI.sky, 0.85)} {...SK} strokeWidth={5} />
					<rect x={18} y={41} width={22} height={18} fill={alpha(LPI.pink, 0.7)} />
					<path d="M62 50 H72" stroke={N} strokeWidth={10} strokeLinecap="round" />
					<path d="M72 50 H98" stroke={N} strokeWidth={4} strokeLinecap="round" />
				</g>
			) : kind === 'excreta' ? (
				<>
					<path d="M6 46 Q6 32 22 32 H70 Q88 32 88 54 Q88 76 68 76 H24 Q6 76 6 60 Z" fill={LPI.paper} {...SK} strokeWidth={5} />
					<ellipse cx={46} cy={48} rx={28} ry={9} fill={LPI.sky} stroke={N} strokeWidth={4} />
					<path d="M88 54 H98" stroke={N} strokeWidth={9} strokeLinecap="round" />
					<path d="M46 6 C40 16 34 22 34 28 A12 12 0 0 0 58 28 C58 22 52 16 46 6 Z" fill={LPI.blue} stroke={N} strokeWidth={4} />
				</>
			) : (
				<>
					<path d="M30 14 H62 L64 30 H30 Z" fill={N} />
					<path d="M20 44 Q20 32 32 32 H64 Q76 32 76 44 V88 Q76 94 70 94 H26 Q20 94 20 88 Z" fill={LPI.sky} {...SK} strokeWidth={5} />
					<path d="M80 22 l8 -4 M82 30 l10 0 M80 38 l8 4" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
				</>
			)}
		</svg>
	);
};

/** Suivi des 6 réflexes : le courant grossit, les précédents sont cochés. */
export const ReflexTracker: React.FC<{current: number; at: number}> = ({current, at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 8], [0, 1], clamp);
	const pulse = 1 + 0.06 * Math.sin(frame / 4);
	return (
		<div style={{display: 'flex', justifyContent: 'center', gap: 16, opacity: o}}>
			{REFLEXES.map((k, i) => {
				const n = i + 1;
				const on = n === current;
				const done = n < current;
				const d = on ? 118 : 96;
				return (
					<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<div style={{position: 'relative', width: d, height: d, borderRadius: d / 2, background: on ? LPI.sky : done ? alpha(LPI.blue, 0.18) : LPI.paper, border: `5px solid ${on ? N : alpha(N, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? pulse : 1})`, boxShadow: on ? SHADOW : 'none', opacity: on || done || current === 0 ? 1 : 0.55}}>
							<ReflexIcon kind={k} size={on ? 74 : 58} />
							{done ? (
								<div style={{position: 'absolute', right: -6, top: -6, width: 34, height: 34, borderRadius: 17, background: LPI.blue, border: `3px solid ${LPI.paper}`, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
							) : null}
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: on ? 30 : 24, color: on ? N : alpha(N, 0.55)}}>{n}</div>
					</div>
				);
			})}
		</div>
	);
};
