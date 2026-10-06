import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, FONT, GRID, LPI, SHADOW} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ────────────────────────────── mouvement ────────────────────────────── */

/** Spring doux (léger micro-rebond seulement si `bounce`). */
export const useSoft = (at: number, bounce = false) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({
		frame: frame - at,
		fps,
		config: bounce ? {damping: 14, stiffness: 120, mass: 0.9} : {damping: 22, stiffness: 120, mass: 1},
	});
};

type Dir = 'up' | 'down' | 'left' | 'right' | 'none';

/** Apparition progressive : fondu + léger glissement + scale subtil. */
export const Enter: React.FC<{
	at: number;
	from?: Dir;
	distance?: number;
	bounce?: boolean;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({at, from = 'up', distance = 36, bounce = false, children, style}) => {
	const s = useSoft(at, bounce);
	const d = (1 - s) * distance;
	const t = {
		up: `translateY(${d}px)`,
		down: `translateY(${-d}px)`,
		left: `translateX(${-d}px)`,
		right: `translateX(${d}px)`,
		none: '',
	}[from];
	return (
		<div style={{opacity: Math.min(1, s * 1.4), transform: `${t} scale(${0.97 + 0.03 * s})`, ...style}}>{children}</div>
	);
};

/** Bloc positionné en absolu (coordonnées de la grille 1080 × 1920). */
export const Box: React.FC<{
	x: number;
	y: number;
	w?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({x, y, w, children, style}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, ...style}}>{children}</div>
);

/* ────────────────────────────── décor ────────────────────────────── */

const BLOB =
	'M520 40 C700 30 860 150 870 330 C880 520 760 640 560 650 C360 660 170 600 120 420 C70 240 300 50 520 40 Z';

/** Fond principal : blanc cassé + deux formes douces bleu clair qui respirent à peine. */
export const Background: React.FC<{variant?: 0 | 1 | 2}> = ({variant = 0}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const drift = (k: number) => Math.sin(t * 0.25 + k) * 10;
	const layouts = [
		[
			{x: 520, y: -170, s: 0.9, r: 12},
			{x: -360, y: 1320, s: 1.0, r: -8},
		],
		[
			{x: -330, y: -120, s: 0.85, r: -14},
			{x: 560, y: 1400, s: 0.9, r: 10},
		],
		[
			{x: 560, y: 980, s: 0.8, r: 20},
			{x: -380, y: -60, s: 0.75, r: 0},
		],
	][variant];
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0}}>
				{layouts.map((b, i) => (
					<path
						key={i}
						d={BLOB}
						fill={LPI.sky}
						opacity={i === 0 ? 0.5 : 0.38}
						transform={`translate(${b.x + drift(i)} ${b.y + drift(i + 2)}) rotate(${b.r} 500 340) scale(${b.s})`}
					/>
				))}
			</svg>
		</AbsoluteFill>
	);
};

/** Trois petits traits « éclat » (élément graphique de la charte). */
export const Dashes: React.FC<{size?: number; color?: string; at?: number}> = ({
	size = 46,
	color = LPI.blue,
	at = 0,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<svg width={size} height={size} viewBox="0 0 50 50" style={{overflow: 'visible'}}>
			{[
				[8, 36, 2, 46],
				[20, 24, 16, 12],
				[34, 30, 44, 22],
			].map(([x1, y1, x2, y2], i) => (
				<line
					key={i}
					x1={x1}
					y1={y1}
					x2={x1 + (x2 - x1) * p}
					y2={y1 + (y2 - y1) * p}
					stroke={color}
					strokeWidth={6}
					strokeLinecap="round"
				/>
			))}
		</svg>
	);
};

/** Coup de pinceau rose (surlignage de la charte), révélé de gauche à droite. */
export const Brush: React.FC<{at: number; width: number; height?: number; color?: string; opacity?: number}> = ({
	at,
	width,
	height = 34,
	color = LPI.pink,
	opacity = 0.55,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 400 40"
			preserveAspectRatio="none"
			style={{position: 'absolute', left: -10, bottom: 6, zIndex: -1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}
		>
			<path
				d="M6 14 C80 6 200 4 392 8 C398 16 396 28 390 34 C260 38 120 38 10 34 C2 28 2 20 6 14 Z"
				fill={color}
				opacity={opacity}
			/>
		</svg>
	);
};

/* ────────────────────────────── typographie ────────────────────────────── */

/** Sur-titre : « CONSTANTE 1/5 ». */
export const Kicker: React.FC<{at: number; children: React.ReactNode; color?: string}> = ({
	at,
	children,
	color = LPI.blue,
}) => (
	<Enter at={at} from="left" distance={24}>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{width: 34, height: 6, borderRadius: 3, background: LPI.pink}} />
			<div
				style={{
					fontFamily: FONT.body,
					fontWeight: 700,
					fontSize: 28,
					letterSpacing: '0.16em',
					color,
					textTransform: 'uppercase',
				}}
			>
				{children}
			</div>
		</div>
	</Enter>
);

/**
 * Titre : apparition mot à mot. `*mot*` = mot important (bleu principal + coup de pinceau rose).
 * `\n` = retour à la ligne.
 */
export const Title: React.FC<{
	at: number;
	text: string;
	size?: number;
	align?: 'left' | 'center';
	stagger?: number;
	brush?: boolean;
	color?: string;
}> = ({at, text, size = 96, align = 'left', stagger = 3, brush = true, color = LPI.navy}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let i = 0;
	return (
		<div
			style={{
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size,
				lineHeight: 1.04,
				color,
				letterSpacing: '-0.015em',
				textAlign: align,
			}}
		>
			{text.split('\n').map((line, li) => (
				<div
					key={li}
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: align === 'center' ? 'center' : 'flex-start',
						columnGap: '0.24em',
					}}
				>
					{line.split(' ').map((raw, wi) => {
						const k = i++;
						const m = raw.match(/^\*(.+)\*(.*)$/);
						const word = m ? m[1] : raw;
						const s = spring({frame: frame - at - k * stagger, fps, config: {damping: 20, stiffness: 140}});
						return (
							<span
								key={wi}
								style={{
									position: 'relative',
									display: 'inline-block',
									opacity: Math.min(1, s * 1.5),
									transform: `translateY(${(1 - s) * 28}px)`,
									color: m ? LPI.blue : color,
									zIndex: 0,
								}}
							>
								{m && brush ? (
									<Brush at={at + k * stagger + 8} width={word.length * size * 0.56} height={size * 0.36} />
								) : null}
								{word}
								{m ? m[2] : ''}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

export const Subtitle: React.FC<{at: number; children: React.ReactNode; size?: number}> = ({
	at,
	children,
	size = 40,
}) => (
	<Enter at={at} distance={20}>
		<div
			style={{fontFamily: FONT.body, fontWeight: 600, fontSize: size, color: alpha(LPI.navy, 0.72), lineHeight: 1.3}}
		>
			{children}
		</div>
	</Enter>
);

/** Grand chiffre clé + unité. */
export const Readout: React.FC<{value: React.ReactNode; unit?: React.ReactNode; size?: number; color?: string}> = ({
	value,
	unit,
	size = 132,
	color = LPI.navy,
}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap'}}>
		<span
			style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, lineHeight: 1, color, letterSpacing: '-0.02em'}}
		>
			{value}
		</span>
		{unit ? (
			<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: size * 0.34, color: LPI.blue}}>{unit}</span>
		) : null}
	</div>
);

/* ────────────────────────────── surfaces ────────────────────────────── */

/** Carte : surface blanc cassé, bord bleu clair, ombre douce. */
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; tint?: boolean}> = ({
	children,
	style,
	tint,
}) => (
	<div
		style={{
			position: 'relative',
			background: tint ? alpha(LPI.sky, 0.45) : LPI.paper,
			border: `3px solid ${LPI.sky}`,
			borderRadius: 44,
			boxShadow: SHADOW,
			...style,
		}}
	>
		{children}
	</div>
);

type ChipKind = 'soft' | 'solid' | 'pink' | 'outline';

/** Pastille d'information. `on` (0→1) la fait passer de « soft » à « solid » (mise en évidence). */
export const Chip: React.FC<{
	children: React.ReactNode;
	kind?: ChipKind;
	size?: number;
	icon?: React.ReactNode;
	on?: number;
}> = ({children, kind = 'soft', size = 36, icon, on}) => {
	const k: ChipKind = on !== undefined ? (on > 0.5 ? 'solid' : 'soft') : kind;
	const styles: Record<ChipKind, React.CSSProperties> = {
		soft: {background: LPI.sky, color: LPI.navy, border: `3px solid ${LPI.sky}`},
		solid: {background: LPI.blue, color: LPI.paper, border: `3px solid ${LPI.blue}`},
		pink: {background: LPI.pink, color: LPI.navy, border: `3px solid ${LPI.pink}`},
		outline: {background: LPI.paper, color: LPI.navy, border: `3px solid ${LPI.sky}`},
	};
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 14,
				padding: `${size * 0.36}px ${size * 0.72}px`,
				borderRadius: 999,
				fontFamily: FONT.body,
				fontWeight: 700,
				fontSize: size,
				lineHeight: 1.15,
				whiteSpace: 'nowrap',
				transform: on !== undefined ? `scale(${1 + 0.04 * on})` : undefined,
				...styles[k],
			}}
		>
			{icon}
			<span>{children}</span>
		</div>
	);
};

/* ────────────────────────────── marque ────────────────────────────── */

/** Filigrane : logo icône + nom de la marque (en haut à gauche). */
export const Watermark: React.FC<{opacity?: number}> = ({opacity = 1}) => (
	<div
		style={{position: 'absolute', left: 56, top: GRID.header, display: 'flex', alignItems: 'center', gap: 16, opacity}}
	>
		<Img src={staticFile('brand/logo/logo-icone.webp')} style={{width: 84, height: 'auto'}} />
		<div style={{fontFamily: FONT.brand, fontWeight: 700, fontSize: 36, color: LPI.navy, letterSpacing: '-0.01em'}}>
			La <span style={{color: LPI.blue}}>Petite</span> IDE
		</div>
	</div>
);

/** Progression : une pastille par étape, la courante s'allonge. */
export const Progress: React.FC<{count: number; current: number; progress: number; opacity?: number}> = ({
	count,
	current,
	progress,
	opacity = 1,
}) => (
	<div style={{position: 'absolute', right: 64, top: GRID.header + 36, display: 'flex', gap: 10, opacity}}>
		{Array.from({length: count}, (_, i) => {
			const active = i === current;
			const done = i < current;
			return (
				<div
					key={i}
					style={{
						width: active ? 70 : 26,
						height: 12,
						borderRadius: 6,
						background: done ? LPI.blue : LPI.sky,
						overflow: 'hidden',
					}}
				>
					{active ? (
						<div style={{width: `${progress * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} />
					) : null}
				</div>
			);
		})}
	</div>
);
