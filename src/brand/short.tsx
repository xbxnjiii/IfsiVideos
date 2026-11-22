// Kit des vidéos courtes « directives Instagram » (série des tubes, n° 65 et suivantes) : fond en aplat, pop au ressort,
// pastilles, pastille de série visible dès l'image 0, compteur n/N qui avance au mot, carte « prochaine vidéo ».
// Les n° 65 à 72 ont leurs copies locales ; les nouvelles vidéos importent d'ici.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FlatBg, popAt} from './bold';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;

export const ShortBg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={tone} light={0.24} />
	</>
);
export const PINK_BG = alpha(LPI.pink, 0.5);

/** Pop au ressort centré sur (x, y), sortie rapide à `to`. */
export const Pop: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, to = 1e9, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * interpolate(frame, [to, to + 7], [1, 0], clamp)})`}}>{children}</div>;
};

/** Pastille de mot. */
export const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue || tone === LPI.navy ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

/** Flèche ↑ / ↓ qui rebondit. */
export const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 110}) => {
	const frame = useCurrentFrame();
	return (
		<Pop at={t0} to={to} x={x} y={y}>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(frame / 3)}px)`}}>{up ? '↑' : '↓'}</div>
		</Pop>
	);
};

/** Pastille de série en haut (dès l'image 0) : bouchon de la couleur du tube + libellé. */
export const SeriesPill: React.FC<{cap: string; label: string}> = ({cap, label}) => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: cap, border: `3px solid ${N}`}} />
		{label}
	</div>
);

/** Compteur « n / total » en haut à droite ; `steps` = [image, n] : il passe à n et rebondit sur le mot du numéro. */
export const Counter: React.FC<{steps: [number, number][]; total: number; done?: boolean}> = ({steps, total, done}) => {
	const frame = useCurrentFrame();
	let n = 0;
	let bump = -100;
	for (const [t, v] of steps) if (frame >= t) [n, bump] = [v, t];
	const s = frame >= bump && frame < bump + 20 ? 1 + 0.15 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / {total}
		</div>
	);
};

/** Carte bleu nuit « PROCHAINE VIDÉO » (ou autre sur-titre) + titre + illustration à droite. */
export const NextCard: React.FC<{kicker?: string; children: React.ReactNode; art?: React.ReactNode}> = ({kicker = 'PROCHAINE VIDÉO', children, art}) => (
	<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
		<div style={{flex: 1}}>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>{kicker}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: LPI.paper, lineHeight: 1.1}}>{children}</div>
		</div>
		{art}
	</div>
);

/** Jauge horizontale en zones ; `v` dans [min, max], `ticks` = graduations affichées. */
export const ZoneGauge: React.FC<{zones: {to: number; tone: string; label?: string}[]; min: number; max: number; v?: number; ticks?: number[]; fmt?: (t: number) => string; width?: number}> = ({zones, min, max, v, ticks = [], fmt = (t) => String(t), width = 920}) => {
	const X = (t: number) => ((Math.min(max, Math.max(min, t)) - min) / (max - min)) * width;
	let from = min;
	return (
		<div style={{position: 'relative', width, height: 220}}>
			<div style={{position: 'absolute', left: 0, top: 60, width, height: 76, borderRadius: 38, overflow: 'hidden', border: `6px solid ${N}`, boxSizing: 'border-box', display: 'flex'}}>
				{zones.map((z, i) => {
					const w = X(z.to) - X(from);
					from = z.to;
					return <div key={i} style={{width: w, background: z.tone, borderLeft: i ? `4px solid ${N}` : undefined}} />;
				})}
			</div>
			{(() => {
				let f2 = min;
				return zones.map((z, i) => {
					const cx = (X(f2) + X(z.to)) / 2;
					f2 = z.to;
					return z.label ? (
						<div key={`l${i}`} style={{position: 'absolute', left: cx, top: 74, transform: 'translateX(-50%)', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, whiteSpace: 'nowrap'}}>
							{z.label}
						</div>
					) : null;
				});
			})()}
			{ticks.map((t) => (
				<div key={t} style={{position: 'absolute', left: X(t), top: 146, transform: 'translateX(-50%)', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, whiteSpace: 'nowrap'}}>
					{fmt(t)}
				</div>
			))}
			{v !== undefined ? <div style={{position: 'absolute', left: X(v) - 26, top: 14, width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: `40px solid ${N}`}} /> : null}
		</div>
	);
};
