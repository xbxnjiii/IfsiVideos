// Illustrations de la vidéo « fréquence cardiaque » (palette de la marque, trait bleu nuit).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Odometer} from '../../brand/motion3';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';

const N = LPI.navy;

/* ───────────── poignet (paume vers le haut) : artère radiale côté pouce ───────────── */

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

/* ───────────── chronomètre (1 minute) ───────────── */

export const Stopwatch: React.FC<{progress: number; count: number; size?: number; label?: string}> = ({progress, count, size = 300, label = 'battements'}) => {
	const r = 118;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<svg width={size} height={size} viewBox="-150 -160 300 310" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={-26} y={-160} width={52} height={30} rx={10} fill={LPI.blue} stroke={N} strokeWidth={7} />
				<circle r={r + 16} fill={LPI.paper} stroke={N} strokeWidth={9} />
				<circle r={r} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={18} />
				<circle r={r} fill="none" stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} transform="rotate(-90)" />
				<g transform={`rotate(${progress * 360})`}>
					<path d={`M0 0 V${-r + 22}`} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
				</g>
				<circle r={9} fill={LPI.pink} stroke={N} strokeWidth={4} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 34}}>
				<div style={{background: alpha(LPI.paper, 0.92), borderRadius: 24, padding: '0 12px', lineHeight: 1}}>
					<Odometer value={count} places={2} size={size * 0.3} />
				</div>
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.075, color: alpha(N, 0.7), marginTop: 4}}>{label}</div>
			</div>
		</div>
	);
};

/* ───────────── amplitude du pouls : bien frappé / filant ───────────── */

/** Onde de pouls qui défile (montée raide, descente douce) ; `amp` = force, `period` = vitesse. */
export const PulseWave: React.FC<{amp: number; period: number; width?: number; height?: number; color?: string; on: number}> = ({
	amp,
	period,
	width = 600,
	height = 130,
	color = LPI.blue,
	on,
}) => {
	const frame = useCurrentFrame();
	const pts = Array.from({length: Math.ceil(width / 5) + 1}, (_, i) => {
		const x = i * 5;
		const ph = (((x + frame * 7) / (period * 7)) % 1 + 1) % 1;
		const v = ph < 0.18 ? Math.sin((ph / 0.18) * (Math.PI / 2)) : Math.exp(-(ph - 0.18) * 4.2) * (1 + 0.18 * Math.sin((ph - 0.18) * 18));
		return `${width - x},${height * 0.82 - v * amp * on}`;
	}).join(' ');
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<path d={`M0 ${height * 0.82} H${width}`} stroke={alpha(N, 0.15)} strokeWidth={4} />
			<polyline points={pts} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

/* ───────────── quiz : patient au repos + écran du moniteur ───────────── */

export const RestingPatient: React.FC<{size?: number}> = ({size = 420}) => {
	const frame = useCurrentFrame();
	const breath = Math.sin(frame / 14) * 3;
	return (
		<svg width={size} height={size * 0.62} viewBox="0 0 420 260" style={{overflow: 'visible'}}>
			{/* lit */}
			<rect x="20" y="150" width="380" height="34" rx="14" fill={LPI.blue} stroke={N} strokeWidth={8} />
			<path d="M28 184 V236 M392 184 V236" stroke={N} strokeWidth={10} strokeLinecap="round" />
			<path d="M20 160 V70" stroke={N} strokeWidth={12} strokeLinecap="round" />
			{/* oreiller + tête */}
			<rect x="40" y="106" width="110" height="50" rx="22" fill={LPI.paper} stroke={N} strokeWidth={7} />
			<circle cx="104" cy="104" r="38" fill={LPI.paper} stroke={N} strokeWidth={8} />
			<path d="M88 104 Q96 110 104 104 M112 104 Q120 110 128 104" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			{/* couverture */}
			<path d={`M138 ${118 - breath} C210 ${100 - breath} 330 ${106 - breath} 390 120 L392 156 L138 156 Z`} fill={LPI.sky} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			<path d={`M200 ${116 - breath} C250 ${110 - breath} 300 ${112 - breath} 350 120`} fill="none" stroke={alpha(N, 0.3)} strokeWidth={5} strokeLinecap="round" />
			{/* « zzz » du repos */}
			{[0, 1, 2].map((k) => {
				const t = ((frame / 30 + k / 3) % 1);
				return (
					<text key={k} x={150 + t * 60} y={70 - t * 60} fontFamily={FONT.title} fontWeight={900} fontSize={26 + k * 6} fill={alpha(LPI.blue, 1 - t)}>
						z
					</text>
				);
			})}
		</svg>
	);
};

/* ───────────── petites icônes (causes, situations) ───────────── */

type IP = {size?: number; color?: string};
const Ico: React.FC<IP & {children: React.ReactNode}> = ({size = 64, color = N, children}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);
/** effort : silhouette qui court */
export const RunIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<circle cx="60" cy="18" r="9" />
		<path d="M54 32 L42 56 L60 64 L54 88 M42 56 L24 50 M52 36 L72 46 L84 40 M44 60 L28 82" />
	</Ico>
);
/** fièvre : thermomètre */
export const FeverIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M42 62 V20 A8 8 0 0 1 58 20 V62 A16 16 0 1 1 42 62 Z" />
		<path d="M50 70 V36" stroke={LPI.pink} strokeWidth={9} />
	</Ico>
);
/** stress : éclair */
export const StressIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M56 8 L26 56 H48 L40 92 L74 40 H52 Z" fill={alpha(LPI.pink, 0.6)} />
	</Ico>
);
/** douleur : étincelle « aïe » */
export const PainIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 10 L58 38 L88 30 L66 52 L86 76 L56 66 L50 92 L42 66 L14 76 L34 52 L12 30 L42 38 Z" fill={alpha(LPI.pink, 0.6)} />
	</Ico>
);
/** sportif : médaille */
export const MedalIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M34 10 L46 44 M66 10 L54 44" />
		<circle cx="50" cy="64" r="22" fill={alpha(LPI.sky, 0.9)} />
		<path d="M50 54 V74 M44 58 L50 54" />
	</Ico>
);
/** sommeil : lune */
export const MoonIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M64 14 A36 36 0 1 0 86 64 A28 28 0 0 1 64 14 Z" fill={alpha(LPI.sky, 0.9)} />
		<path d="M30 22 H42 L30 34 H42" strokeWidth={5} />
	</Ico>
);

/** Pastille d'une cause (icône + libellé) qui « claque » sur son mot. */
export const CauseChip: React.FC<{at: number; icon: React.ReactNode; label: string; tone?: string}> = ({at: t0, icon, label, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const t = frame - t0;
	const s = t < 6 ? interpolate(t, [0, 6], [0.4, 1.12]) : 1 + 0.12 * Math.exp(-(t - 6) / 3) * Math.cos((t - 6) * 0.9) - 0.0;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				height: 96,
				padding: '0 30px 0 12px',
				borderRadius: 999,
				background: LPI.paper,
				border: `5px solid ${tone}`,
				boxShadow: `0 14px 34px ${alpha(N, 0.12)}`,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: 42,
				color: N,
				whiteSpace: 'nowrap',
				opacity: interpolate(t, [0, 3], [0, 1], clamp),
				transform: `scale(${s}) rotate(${interpolate(t, [0, 8], [-8, 0], clamp)}deg)`,
			}}
		>
			<div style={{width: 72, height: 72, borderRadius: 36, background: alpha(tone, 0.45), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
			{label}
		</div>
	);
};
