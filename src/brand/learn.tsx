// Briques pédagogiques La Petite IDE : numéro de partie, carte « terme technique », signes.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

/* ─────────── signes (sens du terme) ─────────── */

export type SignKind = 'up' | 'down' | 'check' | 'wave' | 'alert' | 'squeeze' | 'relax' | 'device' | 'empty';

const SIGN_BG: Record<SignKind, string> = {
	up: LPI.pink,
	down: LPI.sky,
	check: LPI.sky,
	wave: LPI.pink,
	alert: LPI.pink,
	squeeze: LPI.pink,
	relax: LPI.sky,
	device: LPI.sky,
	empty: LPI.sky,
};

export const Sign: React.FC<{kind: SignKind; size?: number}> = ({kind, size = 76}) => {
	const s = {
		fill: 'none',
		stroke: LPI.navy,
		strokeWidth: 9,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
	};
	const glyph = {
		up: <path d="M50 76 V26 M30 44 L50 24 L70 44" {...s} />,
		down: <path d="M50 24 V74 M30 56 L50 76 L70 56" {...s} />,
		check: <path d="M28 52 L44 68 L72 36" {...s} />,
		wave: <path d="M18 54 L32 54 L40 34 L50 70 L58 42 L64 54 L82 54" {...s} />,
		alert: (
			<>
				<path d="M50 26 V58" {...s} />
				<circle cx="50" cy="74" r="6" fill={LPI.navy} />
			</>
		),
		squeeze: (
			<path
				d="M50 76 C26 60 22 44 32 36 C40 30 48 34 50 40 C52 34 60 30 68 36 C78 44 74 60 50 76 Z"
				fill={LPI.navy}
				stroke="none"
			/>
		),
		relax: (
			<path
				d="M50 80 C18 60 14 40 26 30 C36 22 48 28 50 36 C52 28 64 22 74 30 C86 40 82 60 50 80 Z"
				{...s}
				strokeWidth={7}
			/>
		),
		device: (
			<>
				<rect x="24" y="30" width="52" height="40" rx="12" {...s} strokeWidth={7} />
				<path d="M34 50 H42 L46 42 L52 58 L56 50 H66" {...s} strokeWidth={6} />
			</>
		),
		empty: (
			<>
				<ellipse cx="50" cy="52" rx="26" ry="18" {...s} strokeWidth={7} />
				<path d="M26 24 L74 80" {...s} strokeWidth={7} />
			</>
		),
	}[kind];
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				background: SIGN_BG[kind],
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100">
				{glyph}
			</svg>
		</div>
	);
};

/* ─────────── carte « terme technique » ─────────── */

/**
 * Le terme apparaît au moment où la voix le prononce (`at`), reste affiché ensuite
 * (on construit la fiche de révision), et s'allume tant qu'il est le terme courant.
 */
export const TermCard: React.FC<{
	at: number;
	until?: number;
	term: React.ReactNode;
	meaning: React.ReactNode;
	sign: SignKind;
	width?: number;
}> = ({at, until = Infinity, term, meaning, sign, width = 650}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 200, mass: 0.8}});
	const on = frame >= at && frame < until ? 1 : 0;
	const glow = interpolate(frame, [at, at + 8], [0, 1], clamp) * on;
	const pop = on ? 1 + 0.025 * Math.max(0, 1 - (frame - at) / 10) : 1;
	if (frame < at - 1) return <div style={{height: 108}} />;
	return (
		<div
			style={{
				width,
				height: 108,
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				padding: '0 28px',
				borderRadius: 32,
				background: LPI.paper,
				border: `3px solid ${glow > 0.5 ? LPI.blue : LPI.sky}`,
				boxShadow: glow > 0.5 ? `0 16px 40px ${alpha(LPI.blue, 0.22)}` : SHADOW,
				opacity: Math.min(1, s * 1.6) * (on ? 1 : 0.88),
				transform: `translateX(${(1 - s) * 90}px) scale(${pop})`,
				transformOrigin: 'left center',
			}}
		>
			<Sign kind={sign} size={74} />
			<div>
				<div
					style={{
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 46,
						lineHeight: 1.02,
						color: glow > 0.5 ? LPI.blue : LPI.navy,
					}}
				>
					{term}
				</div>
				<div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 29, color: alpha(LPI.navy, 0.72), marginTop: 4}}>
					{meaning}
				</div>
			</div>
		</div>
	);
};

/* ─────────── numéro de partie ─────────── */

export const NumberBadge: React.FC<{n: number; at: number; size?: number}> = ({n, at, size = 96}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 220, mass: 0.7}});
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				background: LPI.blue,
				color: LPI.paper,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size * 0.58,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: `0 12px 30px ${alpha(LPI.blue, 0.35)}`,
				transform: `scale(${s}) rotate(${(1 - s) * -30}deg)`,
				flexShrink: 0,
			}}
		>
			{n}
		</div>
	);
};
