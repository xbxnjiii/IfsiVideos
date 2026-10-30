// Format « histoire » (mystérieux) : fond bleu nuit qui respire, grille et poussières, cadre de « scanner » (coins
// lumineux, point qui pulse, étiquette lieu · heure), lueur autour des dessins (le trait bleu nuit disparaîtrait sur
// le fond), flash de choc. Couleurs de la marque uniquement (le bleu nuit est le plus sombre).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';
import {clamp} from './ui';

const N = LPI.navy;

/** Fond nuit : bleu nuit, halo bleu au centre qui respire, grille fine, poussières qui flottent. */
export const NightBg: React.FC<{glow?: string}> = ({glow = LPI.blue}) => {
	const frame = useCurrentFrame();
	const breathe = 0.16 + 0.05 * Math.sin(frame / 40);
	return (
		<AbsoluteFill style={{background: N}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% 52%, ${alpha(glow, breathe)} 0%, ${alpha(glow, 0)} 70%)`}} />
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${alpha(LPI.sky, 0.045)} 2px, transparent 2px), linear-gradient(90deg, ${alpha(LPI.sky, 0.045)} 2px, transparent 2px)`,
					backgroundSize: '90px 90px',
					backgroundPosition: `0 ${(frame * 0.4) % 90}px`,
				}}
			/>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 26}, (_, i) => {
					const x = (i * 397) % 1080;
					const y = (((i * 733) % 1920) - frame * (0.4 + (i % 5) * 0.15) + 1920 * 4) % 1920;
					return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill={LPI.sky} opacity={0.12 + 0.1 * Math.sin(frame / 12 + i)} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** Lueur bleu clair autour d'un dessin au trait bleu nuit (lisible sur le fond nuit). */
export const Glow: React.FC<{children: React.ReactNode; color?: string; strength?: number}> = ({children, color = LPI.sky, strength = 1}) => (
	<div style={{filter: `drop-shadow(0 0 ${2.5 * strength}px ${color}) drop-shadow(0 0 ${16 * strength}px ${alpha(LPI.blue, 0.55)})`}}>{children}</div>
);

/**
 * Cadre de « scanner » : fond un peu plus clair, grille, coins lumineux, point qui pulse en haut, étiquette en
 * capitales espacées en bas (« 07 H 42 · SALLE DE BAINS »). Le contenu est rogné au cadre.
 */
export const ScanFrame: React.FC<{x?: number; y: number; w?: number; h: number; label?: string; labelAt?: number; at?: number; children?: React.ReactNode; tone?: string}> = ({
	x = 72,
	y,
	w = 936,
	h,
	label,
	labelAt = 0,
	at = 0,
	children,
	tone = LPI.blue,
}) => {
	const frame = useCurrentFrame();
	const o = at <= 0 ? 1 : interpolate(frame, [at, at + 8], [0, 1], clamp);
	const s = at <= 0 ? 1 : interpolate(frame, [at, at + 10], [0.94, 1], clamp);
	const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
	const corner = (cx: number, cy: number, sx: number, sy: number) => (
		<path d={`M${cx} ${cy + sy * 46} V${cy} H${cx + sx * 46}`} fill="none" stroke={tone} strokeWidth={6} strokeLinecap="round" />
	);
	const labelO = interpolate(frame, [labelAt, labelAt + 8], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s})`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 34, background: alpha(LPI.sky, 0.09), border: `3px solid ${alpha(LPI.sky, 0.22)}`, overflow: 'hidden'}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: `linear-gradient(${alpha(LPI.sky, 0.07)} 2px, transparent 2px), linear-gradient(90deg, ${alpha(LPI.sky, 0.07)} 2px, transparent 2px)`,
						backgroundSize: '72px 72px',
					}}
				/>
				{children}
			</div>
			<svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{corner(26, 26, 1, 1)}
				{corner(w - 26, 26, -1, 1)}
				{corner(26, h - 26, 1, -1)}
				{corner(w - 26, h - 26, -1, -1)}
				<circle cx={w / 2} cy={0} r={22 + 10 * pulse} fill={alpha(LPI.pink, 0.25)} />
				<circle cx={w / 2} cy={0} r={13} fill={LPI.pink} stroke={N} strokeWidth={4} />
			</svg>
			{label ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 26,
						textAlign: 'center',
						fontFamily: FONT.body,
						fontWeight: 800,
						fontSize: 34,
						letterSpacing: '0.18em',
						color: LPI.paper,
						opacity: labelO,
						textShadow: `0 0 18px ${alpha(N, 0.9)}`,
					}}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};

/** Flash de choc (plein écran) qui retombe. */
export const NightFlash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.45}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 14], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: alpha(color, o)}} />;
};

/** Mots qui sortent dans le désordre : chaque lettre tremble et se mélange, puis se remet (ou non) en place. */
export const Scramble: React.FC<{text: string; at: number; mix: number; size?: number; color?: string}> = ({text, at: t0, mix, size = 56, color = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const pool = 'aeiouvbrstlmnp';
	return (
		<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color, letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>
			{text.split('').map((c, i) => {
				const k = Math.floor(frame / 3) + i * 7;
				const swap = c !== ' ' && c !== '…' && ((k * 13) % 10) / 10 < mix;
				const ch = swap ? pool[(k * 31 + i) % pool.length] : c;
				return (
					<span key={i} style={{display: 'inline-block', transform: `translateY(${swap ? Math.sin(frame + i) * 6 : 0}px) rotate(${swap ? Math.sin(frame * 0.7 + i) * 12 : 0}deg)`, color: swap ? LPI.pink : color}}>
						{ch === ' ' ? ' ' : ch}
					</span>
				);
			})}
		</span>
	);
};
