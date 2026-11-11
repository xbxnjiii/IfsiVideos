import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, FONT, GRID, LPI, SHADOW} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ────────────────────────────── mouvement ────────────────────────────── */

/** Spring vif mais amorti (léger micro-rebond seulement si `bounce`). */
export const useSoft = (at: number, bounce = false) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({
		frame: frame - at,
		fps,
		config: bounce ? {damping: 13, stiffness: 190, mass: 0.8} : {damping: 20, stiffness: 170, mass: 0.9},
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
	/** couleur des mots `*accentués*` (rose sur le fond nuit) */
	accent?: string;
}> = ({at, text, size = 96, align = 'left', stagger = 3, brush = true, color = LPI.navy, accent = LPI.blue}) => {
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
									color: m ? accent : color,
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
