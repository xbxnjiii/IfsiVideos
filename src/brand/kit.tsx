// ─────────────────────────────────────────────────────────────────────────────
//  La Petite IDE — kit « réseaux sociaux » : stickers, tampons, puces cochées, rubans,
//  progression par étapes. Briques réutilisables pour les vidéos « liste » (ex. 14 besoins).
//  Toujours dans la palette ; un seul ressort de référence (POP) pour tout le kit.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, FONT, GRID, LPI, SHADOW} from './theme';
import {clamp} from './ui';

/** Ressort « pop » de la charte : dépassement ≈ 12 %. */
export const POP = {damping: 10, stiffness: 220, mass: 0.6};

export const usePop = (at: number, config = POP) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return frame < at ? 0 : spring({frame: frame - at, fps, config});
};

/** Sticker : contenu posé avec un liseré blanc épais et une ombre, qui « claque » en tournant. */
export const Sticker: React.FC<{
	at: number;
	x: number;
	y: number;
	rot?: number;
	/** frame de disparition (rétrécit vite) */
	out?: number;
	children: React.ReactNode;
	wobble?: boolean;
}> = ({at, x, y, rot = -6, out, children, wobble = true}) => {
	const frame = useCurrentFrame();
	const p = usePop(at);
	if (frame < at) return null;
	const leave = out !== undefined ? interpolate(frame, [out, out + 6], [1, 0], {...clamp, easing: (t) => t * t}) : 1;
	if (leave <= 0) return null;
	const w = wobble ? Math.sin((frame - at) / 9) * 2 : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rot + (1 - p) * 24 + w}deg) scale(${p * leave})`,
				filter: [
					`drop-shadow(5px 0 0 ${LPI.paper})`,
					`drop-shadow(-5px 0 0 ${LPI.paper})`,
					`drop-shadow(0 5px 0 ${LPI.paper})`,
					`drop-shadow(0 -5px 0 ${LPI.paper})`,
					`drop-shadow(0 14px 18px ${alpha(LPI.navy, 0.22)})`,
				].join(' '),
			}}
		>
			{children}
		</div>
	);
};

/** Tampon : texte en capitales dans un cadre, qui s'écrase (gros → taille finale) avec un petit flash. */
export const Stamp: React.FC<{
	at: number;
	x: number;
	y: number;
	text: React.ReactNode;
	color?: string;
	rot?: number;
	size?: number;
	out?: number;
}> = ({at, x, y, text, color = LPI.pink, rot = -8, size = 56, out}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0) return null;
	const leave = out !== undefined ? interpolate(frame, [out, out + 6], [1, 0], clamp) : 1;
	if (leave <= 0) return null;
	// écrasement : 2,4 → 1 en 5 frames, puis petit rebond
	const s = t < 5 ? interpolate(t, [0, 5], [2.4, 0.92], {easing: (v) => v * v}) : 1 - 0.08 * Math.exp(-(t - 5) / 3) * Math.cos((t - 5) * 0.9);
	const o = interpolate(t, [0, 3], [0, 1], clamp) * leave;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (0.6 + 0.4 * leave)})`,
				opacity: o,
				padding: `${size * 0.16}px ${size * 0.42}px`,
				border: `${Math.max(5, size * 0.11)}px solid ${color}`,
				borderRadius: size * 0.3,
				background: alpha(LPI.paper, 0.92),
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size,
				letterSpacing: '0.04em',
				lineHeight: 1,
				color: color === LPI.pink ? LPI.navy : color,
				whiteSpace: 'nowrap',
				textTransform: 'uppercase',
				boxShadow: `0 12px 30px ${alpha(LPI.navy, 0.16)}`,
			}}
		>
			{text}
		</div>
	);
};

/** Puce cochée : la coche se dessine, le libellé glisse. `sub` = précision (ex. « = urines »). */
export const CheckChip: React.FC<{at: number; label: React.ReactNode; sub?: React.ReactNode; color?: string; size?: number}> = ({
	at,
	label,
	sub,
	color = LPI.blue,
	size = 40,
}) => {
	const frame = useCurrentFrame();
	const p = usePop(at);
	if (frame < at) return null;
	const draw = interpolate(frame - at, [4, 12], [0, 1], clamp);
	const d = size * 1.3;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 14,
				padding: `10px ${size * 0.7}px 10px 10px`,
				borderRadius: 999,
				background: LPI.paper,
				border: `4px solid ${alpha(color, 0.9)}`,
				boxShadow: SHADOW,
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * -60}px) scale(${0.7 + 0.3 * p})`,
				transformOrigin: 'left center',
				whiteSpace: 'nowrap',
			}}
		>
			<svg width={d} height={d} viewBox="0 0 40 40">
				<circle cx="20" cy="20" r="19" fill={color} />
				<path
					d="M11 21 L17.5 27 L29 14"
					fill="none"
					stroke={LPI.paper}
					strokeWidth="5"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray="30"
					strokeDashoffset={30 * (1 - draw)}
				/>
			</svg>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: LPI.navy}}>{label}</span>
			{sub ? <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: size * 0.72, color: alpha(LPI.navy, 0.6)}}>{sub}</span> : null}
		</div>
	);
};

/** Trait rose qui barre un élément (dessiné de gauche à droite). */
export const Strike: React.FC<{at: number; width: number; rot?: number; color?: string; thick?: number}> = ({
	at,
	width,
	rot = -12,
	color = LPI.pink,
	thick = 16,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame - at, [0, 6], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
	if (p <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: width * p,
				height: thick,
				marginLeft: -width / 2,
				marginTop: -thick / 2,
				borderRadius: thick,
				background: color,
				transform: `rotate(${rot}deg)`,
				transformOrigin: `${width / 2}px 50%`,
				boxShadow: `0 0 0 4px ${LPI.paper}`,
			}}
		/>
	);
};

/** Ruban « scène de crime » qui traverse l'écran en diagonale. */
export const Tape: React.FC<{at: number; y: number; text: string; rot?: number; out?: number}> = ({at, y, text, rot = -9, out}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0) return null;
	const enter = interpolate(t, [0, 7], [0, 1], {...clamp, easing: (v) => 1 - (1 - v) ** 3});
	const leave = out !== undefined ? interpolate(frame, [out, out + 8], [0, 1], clamp) : 0;
	const unit = `${text}  •  `;
	return (
		<div
			style={{
				position: 'absolute',
				left: -200,
				width: GRID.w + 400,
				top: y,
				height: 92,
				transform: `rotate(${rot}deg) translateX(${(1 - enter) * -1500 + leave * 1500}px)`,
				background: LPI.pink,
				borderTop: `8px solid ${LPI.navy}`,
				borderBottom: `8px solid ${LPI.navy}`,
				boxShadow: `0 16px 36px ${alpha(LPI.navy, 0.25)}`,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					whiteSpace: 'nowrap',
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 40,
					letterSpacing: '0.08em',
					color: LPI.navy,
					transform: `translateX(${-((frame * 6) % 600)}px)`,
				}}
			>
				{unit.repeat(8)}
			</div>
		</div>
	);
};

/** Progression par étapes : un segment par élément, groupes séparés, élément courant allongé. */
export const GroupProgress: React.FC<{
	groups: number[];
	/** index (0 → n-1) de l'élément courant, -1 = aucun ; `group` = groupe mis en avant (écran d'étape) */
	current: number;
	group?: number;
	/** avancement 0 → 1 de l'élément courant */
	progress: number;
	colors: string[];
	opacity?: number;
	y?: number;
}> = ({groups, current, group = -1, progress, colors, opacity = 1, y = GRID.header + 14}) => {
	let k = 0;
	return (
		<div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, opacity}}>
			{groups.map((n, g) => (
				<div key={g} style={{display: 'flex', gap: 7, padding: 5, borderRadius: 12, background: g === group ? alpha(colors[g], 0.35) : 'transparent'}}>
					{Array.from({length: n}, () => {
						const i = k++;
						const cur = i === current;
						const done = current >= 0 ? i < current : false;
						return (
							<div
								key={i}
								style={{
									width: cur ? 74 : 30,
									height: 12,
									borderRadius: 6,
									background: done ? colors[g] : alpha(LPI.sky, 0.8),
									overflow: 'hidden',
								}}
							>
								{cur ? <div style={{width: `${progress * 100}%`, height: '100%', background: colors[g], borderRadius: 6}} /> : null}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

/** Bulle de commentaire : « … » qui s'agite puis le texte s'écrit. */
export const TypingBubble: React.FC<{at: number; text: string; size?: number}> = ({at: t0, text, size = 34}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	const typing = frame - t0 < 12;
	const n = Math.floor(interpolate(frame, [t0 + 12, t0 + 12 + text.length * 0.9], [0, text.length], clamp));
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 16,
				padding: '22px 32px',
				borderRadius: '38px 38px 38px 8px',
				background: LPI.paper,
				border: `4px solid ${LPI.sky}`,
				boxShadow: SHADOW,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size,
				color: LPI.navy,
				whiteSpace: 'nowrap',
				opacity: Math.min(1, p * 1.5),
				transform: `scale(${0.6 + 0.4 * p})`,
				transformOrigin: 'left bottom',
				minHeight: size * 2.8,
			}}
		>
			{typing ? (
				<div style={{display: 'flex', gap: 10, padding: '0 6px'}}>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							style={{width: 16, height: 16, borderRadius: 99, background: LPI.blue, transform: `translateY(${Math.sin((frame - t0) / 2 - i) * 6}px)`}}
						/>
					))}
				</div>
			) : (
				<span>
					{text.slice(0, n)}
					<span style={{opacity: n < text.length ? 1 : 0, color: LPI.blue}}>|</span>
				</span>
			)}
		</div>
	);
};
