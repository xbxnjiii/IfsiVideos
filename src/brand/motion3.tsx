// ─────────────────────────────────────────────────────────────────────────────
//  La Petite IDE — motion design « v3 » (moderne, rythmé) : briques réutilisables
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {Sign, SignKind} from './learn';
import {alpha, FONT, GRID, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const ease = Easing.bezier(0.22, 1, 0.36, 1); // « easeOutQuint » : départ vif, arrivée douce

/* ───────────────── caméra : dérive lente + coups de zoom sur les mots clés ───────────────── */

const punchCurve = (t: number) => (t < 0 ? 0 : t < 4 ? t / 4 : Math.exp(-(t - 4) / 8));

export const Camera: React.FC<{punches?: number[]; children: React.ReactNode; strength?: number}> = ({
	punches = [],
	children,
	strength = 0.05,
}) => {
	const frame = useCurrentFrame();
	const p = punches.reduce((acc, at) => acc + punchCurve(frame - at), 0);
	const scale = 1 + 0.01 * Math.sin(frame / 55) + strength * Math.min(1.2, p);
	const x = Math.sin(frame / 70) * 6;
	return (
		<AbsoluteFill style={{transform: `translateX(${x}px) scale(${scale})`, transformOrigin: '540px 860px'}}>{children}</AbsoluteFill>
	);
};

/* ───────────────── fond : blanc cassé + grille de points qui défile + éléments de marque ───────────────── */

// éléments de la planche, posés en bordure (jamais sur le texte), très discrets
const DECO = [
	{key: 'etincelle', x: 1016, y: 236, s: 50, ph: 1.4},
	{key: 'coeur-rose', x: 1022, y: 470, s: 52, ph: 0},
	{key: 'coeur-bleu', x: 46, y: 1580, s: 54, ph: 2.2},
	{key: 'etincelle', x: 1010, y: 1600, s: 42, ph: 3.1},
];

export const LiveBackground: React.FC<{deco?: boolean}> = ({deco = true}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(${alpha(LPI.sky, 0.95)} 3px, transparent 3.5px)`,
					backgroundSize: '46px 46px',
					backgroundPosition: `0px ${-frame * 0.6}px`,
					WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0.55), transparent 85%)',
					maskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0.55), transparent 85%)',
				}}
			/>
			{deco
				? DECO.map((d, i) => (
						<Img
							key={i}
							src={staticFile(`brand/mascotte-v2/elements/${d.key}.webp`)}
							style={{
								position: 'absolute',
								left: d.x - d.s / 2 + Math.sin(t * 0.8 + d.ph) * 10,
								top: d.y - d.s / 2 + Math.cos(t * 0.6 + d.ph) * 14,
								width: d.s,
								opacity: 0.55,
								transform: `rotate(${Math.sin(t + d.ph) * 10}deg)`,
							}}
						/>
					))
				: null}
		</AbsoluteFill>
	);
};

/* ───────────────── éclats (petits traits qui rayonnent) ───────────────── */

export const Burst: React.FC<{at: number; x: number; y: number; r?: number; n?: number}> = ({at, x, y, r = 120, n = 10}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 18) return null;
	const p = ease(Math.min(1, t / 14));
	const o = interpolate(t, [0, 3, 18], [0, 1, 0], clamp);
	return (
		<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible'}}>
			{Array.from({length: n}, (_, i) => {
				const a = (i / n) * Math.PI * 2 + 0.3;
				const r0 = r * (0.55 + 0.45 * p);
				const r1 = r0 + 34 * (1 - p * 0.6);
				return (
					<line
						key={i}
						x1={x + Math.cos(a) * r0}
						y1={y + Math.sin(a) * r0}
						x2={x + Math.cos(a) * r1}
						y2={y + Math.sin(a) * r1}
						stroke={i % 2 ? LPI.pink : LPI.blue}
						strokeWidth={9}
						strokeLinecap="round"
						opacity={o}
					/>
				);
			})}
		</svg>
	);
};

/* ───────────────── compteur à rouleaux ───────────────── */

const DigitColumn: React.FC<{pos: number; size: number; color: string; hidden?: number}> = ({pos, size, color, hidden = 0}) => {
	const h = size * 1.05;
	const p = ((pos % 10) + 10) % 10;
	return (
		<span style={{display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'top', width: size * 0.6 * (1 - hidden), opacity: 1 - hidden}}>
			<span style={{display: 'block', transform: `translateY(${-p * h}px)`}}>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
					<span key={i} style={{display: 'block', height: h, lineHeight: `${h}px`, color, textAlign: 'center'}}>
						{d}
					</span>
				))}
			</span>
		</span>
	);
};

/** Chiffres qui roulent vers la nouvelle valeur (format français : virgule). */
export const Odometer: React.FC<{value: number; decimals?: number; places?: number; size?: number; color?: string}> = ({
	value,
	decimals = 0,
	places = 2,
	size = 150,
	color = LPI.navy,
}) => {
	const scaled = value * 10 ** decimals;
	const cols: React.ReactNode[] = [];
	for (let k = places + decimals - 1; k >= 0; k--) {
		const unit = 10 ** k;
		// le chiffre « roule » seulement pendant le passage du chiffre inférieur de 9 à 0
		const below = (scaled % unit) / unit;
		const base = Math.floor(scaled / unit);
		const roll = k === 0 ? scaled / unit : base + Math.max(0, (below - 0.9) / 0.1);
		const leading = k >= decimals + 1 && base === 0 ? 1 : 0;
		cols.push(<DigitColumn key={`d${k}`} pos={roll} size={size} color={color} hidden={leading} />);
		if (k === decimals && decimals > 0) {
			cols.push(
				<span key="comma" style={{display: 'inline-block', width: size * 0.28, textAlign: 'center', color}}>
					,
				</span>,
			);
		}
	}
	return (
		<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, lineHeight: 1.05, display: 'inline-flex', letterSpacing: '-0.02em'}}>
			{cols}
		</span>
	);
};

/* ───────────────── ouverture de chapitre : gros numéro qui s'écrase puis file dans le coin ───────────────── */

export const ChapterSlam: React.FC<{
	n: number;
	at: number;
	from?: {x: number; y: number};
	to?: {x: number; y: number};
	size?: number;
}> = ({n, at, from = {x: 540, y: 820}, to = {x: 72 + 46, y: 236 + 46}, size = 92}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame - at;
	if (t < -1) return null;
	const pop = spring({frame: t, fps, config: {damping: 11, stiffness: 210, mass: 0.7}});
	const fly = interpolate(t, [16, 30], [0, 1], {...clamp, easing: ease});
	const big = 320;
	const d = interpolate(fly, [0, 1], [big, size]);
	const cx = interpolate(fly, [0, 1], [from.x, to.x]);
	const cy = interpolate(fly, [0, 1], [from.y, to.y]);
	const rot = (1 - pop) * -40 * (1 - fly);
	return (
		<>
			<Burst at={at + 2} x={from.x} y={from.y} r={190} n={12} />
			<div
				style={{
					position: 'absolute',
					left: cx - d / 2,
					top: cy - d / 2,
					width: d,
					height: d,
					borderRadius: 999,
					background: LPI.blue,
					boxShadow: `0 ${20 * (1 - fly) + 10}px ${50 * (1 - fly) + 24}px ${alpha(LPI.blue, 0.35)}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: d * 0.6,
					color: LPI.paper,
					transform: `scale(${fly > 0 ? 1 : 0.4 + 0.6 * pop}) rotate(${rot}deg)`,
				}}
			>
				{n}
			</div>
		</>
	);
};

/* ───────────────── carte-terme : « slam » au centre puis vol vers sa place dans la fiche ───────────────── */

export const SLOT = {x: 72, y: 1046, w: 600, h: 100, gap: 12};
const BIG_W = 860;
const BIG_H = 150;
const TEXT_W = BIG_W - 72 - 104 - 30;

/** Taille de police qui tient sur une ligne (estimation par nombre de caractères). */
const fit = (text: string, max: number, em: number) => Math.min(max, TEXT_W / (Math.max(1, text.length) * em));

const plain = (n: React.ReactNode): string =>
	typeof n === 'string' || typeof n === 'number'
		? String(n)
		: Array.isArray(n)
			? n.map(plain).join('')
			: React.isValidElement(n)
				? plain((n.props as {children?: React.ReactNode}).children)
				: '';

export const TermSlam: React.FC<{
	at: number;
	index: number;
	term: string;
	meaning: React.ReactNode;
	sign: SignKind;
	active?: boolean;
	slamY?: number;
	/** haut de la première place de la fiche */
	top?: number;
}> = ({at, index, term, meaning, sign, active = false, slamY = 840, top = SLOT.y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame - at;
	if (t < 0) return null;
	const pop = spring({frame: t, fps, config: {damping: 10, stiffness: 230, mass: 0.7}});
	const fly = interpolate(t, [24, 38], [0, 1], {...clamp, easing: ease});
	const k = SLOT.w / BIG_W;
	const scale = interpolate(fly, [0, 1], [0.35 + 0.65 * pop, k]);
	const slotY = top + index * (SLOT.h + SLOT.gap);
	// on interpole le CENTRE de la carte : le « pop » grandit depuis le centre de l'écran
	const cx = interpolate(fly, [0, 1], [540, SLOT.x + SLOT.w / 2]);
	const cy = interpolate(fly, [0, 1], [slamY, slotY + (BIG_H * k) / 2]);
	const x = cx - (BIG_W * scale) / 2;
	const y = cy - (BIG_H * scale) / 2;
	const rot = interpolate(fly, [0, 1], [(1 - pop) * -10 - 2, 0]);
	const wiggle = fly < 1 ? Math.sin(t / 2.2) * 0.8 * (1 - fly) : 0;
	const on = fly < 1 || active;
	const termSize = fit(term, 66, 0.6);
	const meaningSize = fit(plain(meaning), 38, 0.53);
	return (
		<>
			{fly < 0.05 ? <Burst at={at + 1} x={540} y={slamY} r={230} n={12} /> : null}
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: BIG_W,
					height: BIG_H,
					transform: `scale(${scale}) rotate(${rot + wiggle}deg)`,
					transformOrigin: 'top left',
					display: 'flex',
					alignItems: 'center',
					gap: 30,
					padding: '0 36px',
					borderRadius: 44,
					background: LPI.paper,
					border: `5px solid ${on ? LPI.blue : LPI.sky}`,
					boxShadow: on ? `0 26px 60px ${alpha(LPI.blue, 0.28)}` : SHADOW,
				}}
			>
				<div style={{transform: `scale(${0.4 + 0.6 * spring({frame: t - 3, fps, config: {damping: 9, stiffness: 220}})})`}}>
					<Sign kind={sign} size={104} />
				</div>
				<div style={{whiteSpace: 'nowrap'}}>
					<div
						style={{
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: termSize,
							lineHeight: 1,
							color: on ? LPI.blue : LPI.navy,
							display: 'flex',
						}}
					>
						{term.split('').map((ch, i) => {
							const l = spring({frame: t - 2 - i * 0.8, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
							return (
								<span
									key={i}
									style={{
										display: 'inline-block',
										whiteSpace: 'pre',
										opacity: Math.min(1, l * 2),
										transform: `translateY(${(1 - l) * 34}px) scale(${0.6 + 0.4 * l})`,
									}}
								>
									{ch}
								</span>
							);
						})}
					</div>
					<div
						style={{
							fontFamily: FONT.body,
							fontWeight: 700,
							fontSize: meaningSize,
							color: alpha(LPI.navy, 0.75),
							marginTop: 8,
							opacity: interpolate(t, [8, 14], [0, 1], clamp),
							transform: `translateY(${interpolate(t, [8, 14], [12, 0], {...clamp, easing: ease})}px)`,
						}}
					>
						{meaning}
					</div>
				</div>
			</div>
		</>
	);
};

/* ───────────────── transition de marque : vague bleue puis dévoilement ───────────────── */

type WaveProps = {x: number; y: number};
const WaveComponent: React.FC<TransitionPresentationComponentProps<WaveProps>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
	if (presentationDirection === 'exiting') {
		return <AbsoluteFill style={{transform: `scale(${1 + 0.06 * presentationProgress})`}}>{children}</AbsoluteFill>;
	}
	const {x, y} = passedProps;
	const R = Math.hypot(Math.max(x, GRID.w - x), Math.max(y, GRID.h - y)) + 60;
	const p = presentationProgress;
	const r1 = ease(Math.min(1, p / 0.55)) * R;
	const r2 = ease(Math.max(0, (p - 0.3) / 0.7)) * R;
	return (
		<AbsoluteFill>
			<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0}}>
				<circle cx={x} cy={y} r={r1} fill={LPI.blue} />
				<circle cx={x} cy={y} r={Math.max(0, r2 + 40)} fill={LPI.sky} />
			</svg>
			<AbsoluteFill style={{clipPath: `circle(${r2}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};
export const wave = (props: WaveProps): TransitionPresentation<WaveProps> => ({component: WaveComponent, props});

/* ───────────────── confettis aux couleurs de la marque ───────────────── */

export const Confetti: React.FC<{at: number; x?: number; y?: number; n?: number}> = ({at, x = 540, y = 900, n = 46}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 70) return null;
	const colors = [LPI.blue, LPI.pink, LPI.sky, LPI.navy];
	return (
		<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			{Array.from({length: n}, (_, i) => {
				const a = -Math.PI / 2 + (random(`ca${i}`) - 0.5) * 2.4;
				const v = 18 + random(`cv${i}`) * 22;
				const px = x + Math.cos(a) * v * t;
				const py = y + Math.sin(a) * v * t + 0.9 * t * t;
				const rot = t * (8 + random(`cr${i}`) * 14) * (i % 2 ? 1 : -1);
				const o = interpolate(t, [50, 70], [1, 0], clamp);
				const w = 14 + random(`cw${i}`) * 12;
				return i % 3 === 0 ? (
					<circle key={i} cx={px} cy={py} r={w / 2.4} fill={colors[i % 4]} opacity={o} />
				) : (
					<rect key={i} x={px - w / 2} y={py - w / 4} width={w} height={w / 2} rx={3} fill={colors[i % 4]} opacity={o} transform={`rotate(${rot} ${px} ${py})`} />
				);
			})}
		</svg>
	);
};

/* ───────────────── tap : ondulation façon interface mobile ───────────────── */

export const TapRipple: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 24) return null;
	const p = ease(t / 24);
	return (
		<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			<circle cx={x} cy={y} r={20 + 90 * p} fill="none" stroke={LPI.blue} strokeWidth={8} opacity={1 - p} />
			<circle cx={x} cy={y} r={26 * (1 - p * 0.5)} fill={alpha(LPI.navy, 0.25 * (1 - p))} />
		</svg>
	);
};

/* ───────────────── scène : socle bleu clair qui ondule sous l'illustration ───────────────── */

export const Stage: React.FC<{
	y: number;
	h: number;
	children: React.ReactNode;
	at?: number;
	/**
	 * Remplissages qui montent comme un liquide (vague en surface), ex. rose = « trop haut ».
	 * `level` 0 → 1. Pas de mélange de teintes : chaque couleur reste une couleur de la palette.
	 */
	layers?: {color: string; level: number}[];
	/** petits rebonds du socle sur les mots clés */
	bumps?: number[];
}> = ({y, h, children, at = 6, layers = [], bumps = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 140}});
	const bump = bumps.reduce((acc, b) => acc + (frame >= b ? Math.exp(-(frame - b) / 5) * Math.sin((frame - b) * 0.9) : 0), 0);
	const wob = (k: number) => Math.sin(frame / 20 + k) * 10;
	const w = 936;
	const path = `M${40 + wob(1)} ${30 + wob(2)} C${w * 0.3} ${-10 + wob(3)} ${w * 0.7} ${10 + wob(4)} ${w - 30 + wob(5)} ${40 + wob(6)} C${w + 10} ${h * 0.4} ${w - 10 + wob(7)} ${h * 0.75} ${w - 50 + wob(8)} ${h - 20 + wob(9)} C${w * 0.6} ${h + 10} ${w * 0.3} ${h - 10 + wob(10)} ${50 + wob(11)} ${h - 30 + wob(12)} C${-10} ${h * 0.7} ${10 + wob(13)} ${h * 0.3} ${40 + wob(1)} ${30 + wob(2)} Z`;
	const blob = (fill: string) => (
		<svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<path d={path} fill={fill} />
		</svg>
	);
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: w,
				height: h,
				transform: `scale(${(0.85 + 0.15 * s) * (1 + 0.02 * bump)})`,
				opacity: Math.min(1, s * 1.5),
			}}
		>
			{blob(alpha(LPI.sky, 0.55))}
			{layers.map((l, i) => {
				if (l.level <= 0.001) return null;
				const amp = 14;
				const top = interpolate(l.level, [0, 1], [h + amp + 30, -amp - 40]);
				const pts = Array.from({length: 26}, (_, k) => {
					const px = -40 + (k * (w + 80)) / 25;
					return `${px}px ${top + amp * Math.sin(px / 70 + frame / 5 + i)}px`;
				});
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							inset: 0,
							clipPath: `polygon(${[...pts, `${w + 40}px ${h + 60}px`, `-40px ${h + 60}px`].join(', ')})`,
						}}
					>
						{blob(LPI.paper)}
						{blob(l.color)}
					</div>
				);
			})}
			{children}
		</div>
	);
};
