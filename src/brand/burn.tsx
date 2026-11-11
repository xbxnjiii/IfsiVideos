// « Comment soigner une petite brûlure ? » : casserole vue de dessus (bord en inox, fond, vapeur), eau du robinet qui
// coule sur le doigt (dans le repère d'un `BigFinger`), glaçon, beurre, tube de dentifrice, carte « 15 » de la règle des
// trois quinze, compresse posée sur la brûlure, épingle. Même rendu soigné que bandage.tsx. Couleurs de la marque.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FINGER} from './bandage';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const LINE = {stroke: alpha(N, 0.72), strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/**
 * Casserole vue de dessus, dans le repère d'un `BigFinger` (centre (`x`, `y`), rayon `r`) : bord en inox épais, fond
 * plus sombre, eau qui frémit et vapeur ; `hot` 0 → 1 le bord rougit légèrement, ondes de chaleur.
 */
export const HotPanG: React.FC<{x: number; y: number; r: number; hot?: number}> = ({x, y, r, hot = 1}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	return (
		<g>
			<defs>
				<radialGradient id={`rim${id}`} cx="0.4" cy="0.35" r="0.7">
					<stop offset="0.86" stopColor={LPI.paper} />
					<stop offset="0.93" stopColor={mix(LPI.sky, LPI.blue, 0.2)} />
					<stop offset="1" stopColor={mix(LPI.paper, LPI.sky, 0.6)} />
				</radialGradient>
				<radialGradient id={`bot${id}`} cx="0.5" cy="0.5" r="0.6">
					<stop offset="0" stopColor={mix(LPI.sky, LPI.blue, 0.35)} />
					<stop offset="1" stopColor={mix(LPI.blue, N, 0.25)} />
				</radialGradient>
				<filter id={`ps${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
			</defs>
			<circle cx={x + 20} cy={y + 34} r={r} fill={alpha(N, 0.25)} filter={`url(#ps${id})`} />
			<circle cx={x} cy={y} r={r} fill={`url(#rim${id})`} {...LINE} />
			<circle cx={x} cy={y} r={r * 0.86} fill={`url(#bot${id})`} stroke={alpha(N, 0.5)} strokeWidth={3} />
			{/* bulles qui frémissent */}
			{Array.from({length: 9}, (_, i) => {
				const a = i * 2.4;
				const d = r * (0.2 + 0.55 * ((i * 0.37) % 1));
				const s = 0.5 + 0.5 * Math.sin(frame / 4 + i);
				return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={6 + 8 * s} fill="none" stroke={alpha(LPI.paper, 0.6)} strokeWidth={3} />;
			})}
			<circle cx={x} cy={y} r={r * 0.93} fill="none" stroke={alpha(LPI.pink, 0.55 * cl(hot))} strokeWidth={r * 0.1} />
			{/* vapeur */}
			{[0, 1, 2, 3].map((i) => {
				const t = ((frame * 0.02 + i / 4) % 1) as number;
				const xx = x - r * 0.4 + i * r * 0.27;
				const yy = y - t * r * 0.9;
				return <path key={i} d={`M${xx} ${yy} q-30 -40 0 -80 q30 -40 0 -80`} fill="none" stroke={alpha(LPI.paper, 0.85)} strokeWidth={18} strokeLinecap="round" opacity={Math.sin(t * Math.PI) * cl(hot)} />;
			})}
		</g>
	);
};

/** Eau du robinet qui coule sur la brûlure (repère d'un `BigFinger`) : bec de robinet en haut, filet, éclaboussures. */
export const WaterStreamG: React.FC<{on: number; x?: number}> = ({on, x = FINGER.burn.x}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	const top = -520;
	const hit = FINGER.axis - 70;
	const len = (hit - top - 40) * cl(on * 1.5);
	return (
		<g>
			{/* bec du robinet */}
			<path d={`M${x - 260} ${top - 160} L${x - 40} ${top - 160} Q${x + 46} ${top - 160} ${x + 46} ${top - 70} L${x + 46} ${top} L${x - 46} ${top} L${x - 46} ${top - 70} Q${x - 46} ${top - 92} ${x - 70} ${top - 92} L${x - 260} ${top - 92} Z`} fill={mix(LPI.paper, LPI.sky, 0.6)} {...LINE} />
			<path d={`M${x - 250} ${top - 140} L${x - 50} ${top - 140}`} stroke={LPI.paper} strokeWidth={10} strokeLinecap="round" />
			{/* filet d'eau */}
			<rect x={x - 30} y={top} width={60} height={len} rx={26} fill={alpha(LPI.sky, 0.85)} stroke={alpha(N, 0.35)} strokeWidth={2.5} />
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M${x - 12 + i * 12} ${top + ((frame * 9 + i * 40) % 120)} l0 60`} stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} strokeLinecap="round" opacity={on >= 0.66 ? 1 : 0} />
			))}
			{/* l'eau s'étale sur le doigt et éclabousse */}
			{on >= 0.66 ? (
				<g>
					<ellipse cx={x} cy={FINGER.axis} rx={190} ry={120} fill={alpha(LPI.sky, 0.45)} />
					{Array.from({length: 8}, (_, i) => {
						const t = ((frame * 0.08 + i / 8) % 1) as number;
						const dir = i % 2 ? 1 : -1;
						return <circle key={i} cx={x + dir * (40 + t * 200 + (i % 3) * 20)} cy={hit + 20 - Math.sin(t * Math.PI) * 90 + t * 60} r={7 - t * 3} fill={alpha(LPI.sky, 0.95)} stroke={alpha(N, 0.3)} strokeWidth={1.5} opacity={1 - t} />;
					})}
				</g>
			) : null}
		</g>
	);
};

/** Compresse (ou pansement gras) posée à plat sur la brûlure (repère d'un `BigFinger`) ; `greasy` : tulle gras. */
export const GauzeOnG: React.FC<{on: number; greasy?: boolean}> = ({on, greasy}) => {
	if (on <= 0) return null;
	const B = FINGER.burn;
	const s = 0.7 + 0.3 * cl(on);
	return (
		<g transform={`translate(${B.x + 10} ${B.y}) scale(${s})`} opacity={cl(on * 2)}>
			<rect x={-140} y={-112} width={280} height={224} rx={14} fill={alpha(N, 0.18)} transform="translate(10 14)" />
			<rect x={-140} y={-112} width={280} height={224} rx={14} fill={greasy ? mix(LPI.paper, LPI.sky, 0.35) : LPI.paper} stroke={alpha(N, 0.55)} strokeWidth={3} />
			{Array.from({length: 7}, (_, i) => (
				<path key={`h${i}`} d={`M-130 ${-90 + i * 30} H130`} stroke={alpha(greasy ? LPI.blue : LPI.sky, greasy ? 0.35 : 0.9)} strokeWidth={greasy ? 5 : 3} />
			))}
			{greasy ? Array.from({length: 9}, (_, i) => <path key={`v${i}`} d={`M${-120 + i * 30} -100 V100`} stroke={alpha(LPI.blue, 0.35)} strokeWidth={5} />) : null}
		</g>
	);
};

/** Épingle qui s'approche de la cloque (repère d'un `BigFinger`), `t` 0 → 1. */
export const PinG: React.FC<{t: number}> = ({t}) => {
	if (t <= 0) return null;
	const B = FINGER.burn;
	const x = B.x + 260 - 200 * cl(t);
	const y = B.y - 260 + 200 * cl(t);
	return (
		<g transform={`translate(${x} ${y}) rotate(-45)`}>
			<rect x={-6} y={0} width={12} height={300} rx={6} fill={mix(LPI.paper, LPI.sky, 0.6)} {...LINE} />
			<path d="M-6 0 L0 -40 L6 0 Z" fill={mix(LPI.paper, LPI.sky, 0.6)} {...LINE} />
			<circle cx={0} cy={318} r={30} fill={LPI.pink} {...LINE} />
			<circle cx={-9} cy={308} r={8} fill={alpha(LPI.paper, 0.8)} />
		</g>
	);
};

/** Glaçon (repère 200 × 200) : cube translucide bleu clair, reflets, petite goutte. */
export const IceCube: React.FC<{size?: number}> = ({size = 200}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<path d="M40 70 L110 40 L170 70 L170 150 L100 180 L40 150 Z" fill={alpha(LPI.sky, 0.95)} {...LINE} />
		<path d="M40 70 L100 100 L170 70 M100 100 L100 180" fill="none" {...LINE} />
		<path d="M100 100 L170 70 L170 150 L100 180 Z" fill={alpha(LPI.blue, 0.25)} />
		<path d="M58 80 L95 64" stroke={LPI.paper} strokeWidth={10} strokeLinecap="round" />
		<path d="M120 120 L120 150" stroke={alpha(LPI.paper, 0.9)} strokeWidth={8} strokeLinecap="round" />
		<path d="M150 186 q8 10 0 18 q-8 -8 0 -18 Z" fill={LPI.sky} stroke={alpha(N, 0.5)} strokeWidth={2} />
	</svg>
);

/** Plaquette de beurre (repère 220 × 160) dans son papier. */
export const ButterPat: React.FC<{size?: number}> = ({size = 220}) => (
	<svg width={size} height={(size * 160) / 220} viewBox="0 0 220 160" style={{overflow: 'visible'}}>
		<path d="M20 60 L120 30 L200 60 L200 110 L100 140 L20 110 Z" fill={mix(LPI.paper, LPI.pink, 0.15)} {...LINE} />
		<path d="M20 60 L100 90 L200 60 M100 90 L100 140" fill="none" {...LINE} />
		<path d="M100 90 L200 60 L200 110 L100 140 Z" fill={alpha(LPI.pink, 0.2)} />
		<path d="M20 60 L100 90 L100 140 L20 110 Z" fill={alpha(LPI.sky, 0.6)} />
		<path d="M30 74 L90 96" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" />
		<path d="M50 56 L110 38" stroke={LPI.paper} strokeWidth={8} strokeLinecap="round" />
	</svg>
);

/** Tube de dentifrice (repère 260 × 120) avec un petit ruban de pâte. */
export const ToothpasteTube: React.FC<{size?: number}> = ({size = 260}) => (
	<svg width={size} height={(size * 120) / 260} viewBox="0 0 260 120" style={{overflow: 'visible'}}>
		<path d="M20 30 L170 40 L170 80 L20 90 Z" fill={LPI.paper} {...LINE} />
		<rect x={10} y={26} width={22} height={68} rx={4} fill={LPI.sky} {...LINE} />
		<path d="M60 48 L150 52 M60 72 L150 68" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
		<rect x={170} y={46} width={30} height={28} rx={6} fill={LPI.blue} {...LINE} />
		<path d="M200 60 C220 60 226 40 244 44 C260 48 250 70 234 66" fill="none" stroke={LPI.paper} strokeWidth={16} strokeLinecap="round" />
		<path d="M200 60 C220 60 226 40 244 44 C260 48 250 70 234 66" fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={5} strokeLinecap="round" strokeDasharray="6 10" />
	</svg>
);

/** Carte « 15 » de la règle des trois quinze : gros 15 + unité, petite légende ; elle « claque » à `pop`. */
export const FifteenCard: React.FC<{unit: string; label: string; tone?: string; width?: number}> = ({unit, label, tone = LPI.sky, width = 300}) => (
	<div style={{width, boxSizing: 'border-box', padding: '18px 10px 16px', borderRadius: 36, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
		<div style={{display: 'inline-block', padding: '0 18px', borderRadius: 24, background: tone}}>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: N, lineHeight: 1.05}}>15</span>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue, marginLeft: 6}}>{unit}</span>
		</div>
		<div style={{marginTop: 10, fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: alpha(N, 0.8), lineHeight: 1.15}}>{label}</div>
	</div>
);
