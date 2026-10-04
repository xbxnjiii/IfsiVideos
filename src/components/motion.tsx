import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, TITLE} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Spring « punchy » utilisé partout pour les entrées. */
export const usePop = (delay = 0, damping = 12, stiffness = 180) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.7}});
};

/** Positionne un bloc centré horizontalement à une hauteur donnée. */
export const At: React.FC<{
	top: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({top, children, style}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left: 0,
			right: 0,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			...style,
		}}
	>
		{children}
	</div>
);

type From = 'bottom' | 'top' | 'left' | 'right' | 'scale';

/** Fait apparaître ses enfants avec un spring (et les fait sortir si `out` est défini). */
export const Pop: React.FC<{
	delay?: number;
	from?: From;
	distance?: number;
	out?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({delay = 0, from = 'bottom', distance = 80, out, children, style}) => {
	const frame = useCurrentFrame();
	const s = usePop(delay);
	const o = out === undefined ? 0 : interpolate(frame, [out, out + 8], [0, 1], clamp);
	const d = (1 - s) * distance;
	const t =
		from === 'bottom'
			? `translateY(${d}px)`
			: from === 'top'
				? `translateY(${-d}px)`
				: from === 'left'
					? `translateX(${-d}px)`
					: from === 'right'
						? `translateX(${d}px)`
						: '';
	const scale = from === 'scale' ? 0.4 + 0.6 * s : 1;
	return (
		<div
			style={{
				transform: `${t} scale(${scale * (1 - o * 0.15)})`,
				opacity: Math.min(1, s * 1.6) * (1 - o),
				...style,
			}}
		>
			{children}
		</div>
	);
};

const parseWord = (raw: string) => {
	const m = raw.match(/^([*_])(.+?)\1(.*)$/);
	if (!m) return {kind: 'plain' as const, word: raw, tail: ''};
	return {kind: m[1] === '*' ? ('accent' as const) : ('marker' as const), word: m[2], tail: m[3]};
};

/**
 * Typographie cinétique : chaque mot « pop » à la suite.
 *  *mot*  -> couleur d'accent
 *  _mot_  -> surligné (fond accent, texte foncé)
 *  \n     -> retour à la ligne
 */
export const Words: React.FC<{
	text: string;
	delay?: number;
	stagger?: number;
	size?: number;
	color?: string;
	accent?: string;
	weight?: number;
	font?: string;
	align?: 'center' | 'left';
	lineHeight?: number;
	maxWidth?: number;
	style?: React.CSSProperties;
}> = ({
	text,
	delay = 0,
	stagger = 3,
	size = 110,
	color = C.white,
	accent = C.red,
	weight = 900,
	font = TITLE,
	align = 'center',
	lineHeight = 1.08,
	maxWidth = 900,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let idx = 0;
	return (
		<div
			style={{
				maxWidth,
				fontFamily: font,
				fontWeight: weight,
				fontSize: size,
				lineHeight,
				color,
				letterSpacing: '-0.025em',
				textAlign: align,
				...style,
			}}
		>
			{text.split('\n').map((line, li) => (
				<div
					key={li}
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: align === 'center' ? 'center' : 'flex-start',
						columnGap: '0.26em',
					}}
				>
					{line
						.split(' ')
						.filter(Boolean)
						.map((raw, wi) => {
							const i = idx++;
							const {kind, word, tail} = parseWord(raw);
							const s = spring({
								frame: frame - delay - i * stagger,
								fps,
								config: {damping: 11, stiffness: 210, mass: 0.6},
							});
							const marker = interpolate(frame - delay - i * stagger, [6, 16], [0, 1], {
								...clamp,
								easing: Easing.out(Easing.cubic),
							});
							return (
								<span
									key={wi}
									style={{
										display: 'inline-block',
										position: 'relative',
										transform: `translateY(${(1 - s) * 50}px) scale(${0.5 + 0.5 * s})`,
										opacity: Math.min(1, s * 2),
										color: kind === 'accent' ? accent : kind === 'marker' ? C.dark : color,
									}}
								>
									{kind === 'marker' ? (
										<span
											style={{
												position: 'absolute',
												left: '-0.12em',
												right: '-0.12em',
												top: '0.08em',
												bottom: '0.02em',
												background: accent,
												borderRadius: '0.14em',
												transform: `scaleX(${marker}) rotate(-1.5deg)`,
												transformOrigin: 'left center',
												zIndex: -1,
											}}
										/>
									) : null}
									<span style={{position: 'relative'}}>{word}</span>
									{tail ? <span style={{color}}>{tail}</span> : null}
								</span>
							);
						})}
				</div>
			))}
		</div>
	);
};

/** Pastille de texte (glassmorphism) avec icône optionnelle. */
export const Chip: React.FC<{
	children: React.ReactNode;
	color?: string;
	icon?: React.ReactNode;
	size?: number;
	solid?: boolean;
	style?: React.CSSProperties;
}> = ({children, color = C.cyan, icon, size = 40, solid = false, style}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 18,
			padding: `${size * 0.45}px ${size * 0.8}px`,
			borderRadius: 999,
			background: solid ? color : 'rgba(255,255,255,0.07)',
			border: `3px solid ${solid ? color : color + '88'}`,
			boxShadow: `0 10px 40px ${color}33`,
			fontFamily: BODY,
			fontWeight: 700,
			fontSize: size,
			color: solid ? C.dark : C.white,
			lineHeight: 1.2,
			...style,
		}}
	>
		{icon}
		<span>{children}</span>
	</div>
);

/** Carte arrondie translucide. */
export const Card: React.FC<{
	children: React.ReactNode;
	color?: string;
	style?: React.CSSProperties;
}> = ({children, color = C.white, style}) => (
	<div
		style={{
			background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
			border: `2px solid ${color}40`,
			borderRadius: 40,
			padding: '34px 44px',
			boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
			...style,
		}}
	>
		{children}
	</div>
);

/** Zoom lent et continu sur toute la scène : garde l'image « vivante ». */
export const Camera: React.FC<{
	children: React.ReactNode;
	duration: number;
	from?: number;
	to?: number;
}> = ({children, duration, from = 1, to = 1.045}) => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, duration], [from, to], clamp);
	return <AbsoluteFill style={{transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
};

/** Secousse d'écran courte déclenchée à `at`. */
export const useShake = (at: number, strength = 18, length = 10) => {
	const frame = useCurrentFrame();
	const k = frame - at;
	if (k < 0 || k > length) return 'translate(0px, 0px)';
	const decay = 1 - k / length;
	const x = Math.sin(k * 7.3) * strength * decay;
	const y = Math.cos(k * 5.1) * strength * decay;
	return `translate(${x}px, ${y}px)`;
};

/** Tampon (check / croix) qui s'écrase avec rotation. */
export const Stamp: React.FC<{at: number; children: React.ReactNode; rotate?: number}> = ({
	at,
	children,
	rotate = -12,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 260, mass: 0.6}});
	if (frame < at) return null;
	return (
		<div
			style={{
				transform: `scale(${interpolate(s, [0, 1], [2.4, 1])}) rotate(${rotate * s}deg)`,
				opacity: Math.min(1, s * 3),
			}}
		>
			{children}
		</div>
	);
};
