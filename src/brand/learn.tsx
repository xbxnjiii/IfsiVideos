// Briques pédagogiques La Petite IDE : numéro de partie, carte « terme technique », signes.
import React from 'react';
import {LPI} from './theme';

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
