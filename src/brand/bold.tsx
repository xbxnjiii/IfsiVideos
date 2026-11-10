// Kit « look 2026 » : gros titres plein cadre, aplats de couleur, objets qui entrent et sortent avec un VRAI flou de
// mouvement.
// Règle du flou (@remotion/motion-blur, `CameraMotionBlur`) : il rejoue ses enfants à des images légèrement passées
// (`Freeze`) ; seul ce qui appelle `useCurrentFrame()` À L'INTÉRIEUR du calque bouge d'un échantillon à l'autre. Une
// position calculée dans le composant parent est la même pour tous les échantillons : aucun flou. D'où `Live` (rendu
// en fonction de l'image) et `Fly` (pose en fonction de l'image), toujours évalués dans le calque `Blur`.
import {CameraMotionBlur} from '@remotion/motion-blur';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp, Title} from './ui';

const N = LPI.navy;
export const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
export const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** Ressort (~12 % de dépassement), comme les pops du pilote. */
export const popAt = (frame: number, t0: number) =>
	frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2);

/** Calque de flou de mouvement (désactivé quand rien ne bouge : `on={false}` rend la même chose, sans coût). */
export const Blur: React.FC<{on?: boolean; shutter?: number; samples?: number; children: React.ReactNode}> = ({on = true, shutter = 220, samples = 7, children}) =>
	on ? (
		<CameraMotionBlur shutterAngle={shutter} samples={samples}>
			<AbsoluteFill>{children}</AbsoluteFill>
		</CameraMotionBlur>
	) : (
		<AbsoluteFill>{children}</AbsoluteFill>
	);

/** Rendu en fonction de l'image (à mettre dans `Blur` : chaque échantillon a sa propre image). */
export const Live: React.FC<{render: (frame: number) => React.ReactNode}> = ({render}) => {
	const frame = useCurrentFrame();
	return <>{render(frame)}</>;
};

export type Pose = {x: number; y: number; s?: number; rot?: number; o?: number};
type Dir = 'left' | 'right' | 'top' | 'bottom';
const DIR: Record<Dir, [number, number]> = {left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1]};

/** Objet centré sur (x, y) dont la pose vient d'une fonction de l'image (évaluée dans le calque flou). */
export const Posed: React.FC<{pose: (frame: number) => Pose | null; children: React.ReactNode}> = ({pose, children}) => {
	const frame = useCurrentFrame();
	const p = pose(frame);
	if (!p || (p.o ?? 1) <= 0) return null;
	return (
		<div style={{position: 'absolute', left: p.x, top: p.y, opacity: p.o ?? 1, transform: `translate(-50%, -50%) rotate(${p.rot ?? 0}deg) scale(${p.s ?? 1})`}}>
			{children}
		</div>
	);
};

/**
 * Pose d'un objet qui entre en trombe à `at` (depuis `from`, avec un léger dépassement), reste posé, puis ressort en
 * accélérant à `out` (vers `to`). `move` : déplacements en cours de route [{at, x, y, s, dur}].
 */
export const flyPose =
	(o: {at: number; out?: number; x: number; y: number; s?: number; rot?: number; from?: Dir; to?: Dir; dist?: number; move?: {at: number; x?: number; y?: number; s?: number; rot?: number; dur?: number}[]}) =>
	(f: number): Pose | null => {
		const {at: t0, out = 1e9, from = 'right', to = 'left', dist = 1400} = o;
		if (f < t0 - 1 || f > out + 12) return null;
		let x = o.x;
		let y = o.y;
		let s = o.s ?? 1;
		let rot = o.rot ?? 0;
		for (const m of o.move ?? []) {
			const k = interpolate(f, [m.at, m.at + (m.dur ?? 12)], [0, 1], ease);
			x += ((m.x ?? x) - x) * k;
			y += ((m.y ?? y) - y) * k;
			s += ((m.s ?? s) - s) * k;
			rot += ((m.rot ?? rot) - rot) * k;
		}
		const kin = interpolate(f, [t0, t0 + 11], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
		const [dx, dy] = DIR[from];
		x += dx * dist * (1 - kin);
		y += dy * dist * (1 - kin);
		rot += (dx || dy) * 14 * (1 - kin);
		const kout = interpolate(f, [out, out + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
		const [ex, ey] = DIR[to];
		x += ex * dist * kout;
		y += ey * dist * kout;
		rot += (ex || ey) * 10 * kout;
		return {x, y, s, rot};
	};

/** Le flou ne sert que pendant l'entrée et la sortie : on le coupe le reste du temps (rendu bien plus rapide). */
export const moving = (frame: number, t0: number, out = 1e9, extra: number[] = []) =>
	(frame >= t0 - 1 && frame <= t0 + 13) || (frame >= out - 1 && frame <= out + 12) || extra.some((t) => frame >= t - 1 && frame <= t + 14);

/** Objet qui entre / sort en trombe avec un vrai flou de mouvement. */
export const Fly: React.FC<{at: number; out?: number; x: number; y: number; s?: number; rot?: number; from?: Dir; to?: Dir; dist?: number; move?: {at: number; x?: number; y?: number; s?: number; rot?: number; dur?: number}[]; children: React.ReactNode}> = (props) => {
	const frame = useCurrentFrame();
	const {at: t0, out = 1e9, move = []} = props;
	if (frame < t0 - 1 || frame > out + 12) return null;
	return (
		<Blur on={moving(frame, t0, out, move.map((m) => m.at))}>
			<Posed pose={flyPose(props)}>{props.children}</Posed>
		</Blur>
	);
};

/** Fond en aplat (couleur de la famille) avec deux grands disques clairs qui respirent lentement. */
export const FlatBg: React.FC<{tone: string; light?: number}> = ({tone, light = 0.16}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	return (
		<AbsoluteFill style={{background: tone, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -260 + 30 * Math.sin(t * 0.5), top: -200 + 24 * Math.cos(t * 0.4), width: 900, height: 900, borderRadius: '50%', background: alpha(LPI.paper, light)}} />
			<div style={{position: 'absolute', right: -320 + 26 * Math.cos(t * 0.45), bottom: -260 + 30 * Math.sin(t * 0.38), width: 1000, height: 1000, borderRadius: '50%', background: alpha(LPI.paper, light * 0.8)}} />
		</AbsoluteFill>
	);
};

/** Grand titre plein cadre (une idée par plan) ; fondu de sortie à `to`. */
export const Big: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; center?: boolean; color?: string; accent?: string}> = ({from, to = 1e9, text, size = 112, y = 170, center = false, color, accent}) => {
	const frame = useCurrentFrame();
	if (frame < from - 2 || frame >= to + 8) return null;
	const o = interpolate(frame, [to, to + 7], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 60, top: y - 18 * (1 - o), width: 960, opacity: o}}>
			<Title at={from} text={text} size={size} stagger={3} align={center ? 'center' : 'left'} color={color} accent={accent} />
		</div>
	);
};

/** Pastille d'explication centrée (gros texte), qui sort en fondu à `to`. */
export const Note: React.FC<{at: number; to?: number; y: number; children: React.ReactNode; tone?: string; size?: number; x?: number}> = ({at: t0, to = 1e9, y, children, tone = LPI.paper, size = 50, x}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= to + 8) return null;
	const p = popAt(frame, t0);
	const o = interpolate(frame, [to, to + 7], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, display: 'flex', justifyContent: x === undefined ? 'center' : 'flex-start', opacity: o}}>
			<div
				style={{
					padding: `${size * 0.22}px ${size * 0.55}px`,
					borderRadius: 999,
					background: tone,
					border: `5px solid ${N}`,
					boxShadow: SHADOW,
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: size,
					lineHeight: 1.1,
					color: tone === LPI.blue || tone === N ? LPI.paper : N,
					textAlign: 'center',
					maxWidth: 960,
					transform: `scale(${0.4 + 0.6 * p})`,
					opacity: Math.min(1, p * 2),
				}}
			>
				{children}
			</div>
		</div>
	);
};

/** Carte de famille plein cadre : un chiffre géant qui claque, le nom de la famille dessous. */
export const BigNumber: React.FC<{at: number; out: number; n: number | string; title: string; color?: string; accent?: string; tone?: string}> = ({at: t0, out, n, title, color, accent, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (frame < t0 - 1 || frame > out + 12) return null;
	return (
		<>
			<Blur on={moving(frame, t0, out)}>
				<Posed pose={flyPose({at: t0, out, x: 540, y: 700, from: 'left', to: 'top', dist: 1500})}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 560, lineHeight: 1, color: tone, WebkitTextStroke: `14px ${N}`, paintOrder: 'stroke', textShadow: `0 22px 0 ${alpha(N, 0.18)}`}}>{n}</div>
				</Posed>
			</Blur>
			<Big from={t0 + 4} to={out} text={title} size={118} y={1040} center color={color} accent={accent} />
		</>
	);
};

/** Aplat d'une scène posé sur le blanc cassé (un ton transparent ne laisse jamais voir du noir). */
export const ToneBg: React.FC<{tone: string; light?: number}> = ({tone, light = 0.2}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={tone} light={tone === LPI.paper ? 0 : light} />
	</>
);

/** Flash plein écran (choc) qui retombe. */
export const Flash: React.FC<{at: number; max?: number; color?: string}> = ({at: t0, max = 0.35, color = LPI.pink}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 14], [0, max, 0], clamp);
	return o > 0 ? <AbsoluteFill style={{background: alpha(color, o)}} /> : null;
};

/** Étiquette reliée à un point par un trait pointillé (`dark` : trait clair, sur un aplat foncé). */
export const PointTag: React.FC<{at: number; to?: number; x: number; y: number; px: number; py: number; children: React.ReactNode; dark?: boolean; size?: number; tone?: string}> = ({at: t0, to = 1e9, x, y, px, py, children, dark, size = 42, tone = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= to + 8) return null;
	const o = interpolate(frame, [to, to + 7], [1, 0], clamp) * fadeIn(frame, t0, 5);
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o, overflow: 'visible'}}>
				<line x1={x} y1={y} x2={px} y2={py} stroke={dark ? LPI.paper : N} strokeWidth={5} strokeDasharray="10 9" strokeLinecap="round" />
				<circle cx={px} cy={py} r={9} fill={LPI.pink} stroke={N} strokeWidth={4} />
			</svg>
			<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, opacity: o}}>
				<div style={{padding: `${size * 0.24}px ${size * 0.62}px`, borderRadius: 999, background: tone, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue || tone === N ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
			</div>
		</>
	);
};

/** Coche rose qui se dessine (0 → 1). */
export const Tick: React.FC<{k: number; size?: number}> = ({k, size = 46}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M22 52 L42 72 L78 30" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
	</svg>
);

/**
 * Carte pleine largeur qui glisse à `at` : pastille (numéro ou picto), dessin optionnel (`children`), titre, sous-titre
 * (à `subAt`), coche à `check`. `dim` 0 → 1 : la carte s'efface un peu quand on passe à la suivante.
 */
export const RowCard: React.FC<{at: number; y: number; h?: number; badge?: React.ReactNode; badgeTone?: string; title: React.ReactNode; sub?: React.ReactNode; subAt?: number; dim?: number; check?: number; from?: 'left' | 'right'; art?: number; size?: number; children?: React.ReactNode}> = ({at: t0, y, h = 180, badge, badgeTone = LPI.pink, title, sub, subAt = -1e9, dim = 0, check, from = 'right', art = 200, size = 50, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = Math.min(1, (frame - t0) / 9);
	const ck = check === undefined ? 0 : fadeIn(frame, check, 6);
	return (
		<div style={{position: 'absolute', left: 50, top: y, width: 980, height: h, boxSizing: 'border-box', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', transform: `translateX(${(from === 'right' ? 1 : -1) * (1 - Easing.out(Easing.cubic)(k)) * 420}px) scale(${popAt(frame, t0)})`, opacity: (0.4 + 0.6 * k) * (1 - 0.4 * dim)}}>
			{badge !== undefined ? <div style={{width: 80, height: 80, flexShrink: 0, borderRadius: 40, background: badgeTone, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: badgeTone === LPI.blue || badgeTone === N ? LPI.paper : N}}>{badge}</div> : null}
			{children ? <div style={{width: art, height: h - 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div> : null}
			<div style={{flex: 1, minWidth: 0}}>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1.04}}>{title}</div>
				{sub && frame >= subAt ? <div style={{marginTop: 6, fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.64, lineHeight: 1.12, color: alpha(N, 0.78), opacity: fadeIn(frame, Math.max(subAt, t0 + 4), 6)}}>{sub}</div> : null}
			</div>
			{check !== undefined ? (
				<div style={{width: 70, height: 70, flexShrink: 0, borderRadius: 20, border: `5px solid ${N}`, background: ck > 0 ? LPI.pink : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ck > 0 ? popAt(frame, check) : 1})`}}>{ck > 0 ? <Tick k={ck} /> : null}</div>
			) : null}
		</div>
	);
};

/** Pastille du haut de l'écran (y 54) : à gauche le chapitre en cours (pastille ronde + nom), à droite la série. */
export const TopPill: React.FC<{side: 'left' | 'right'; at: number; badge?: React.ReactNode; badgeTone?: string; label: string; chip?: string; bump?: number; opacity?: number}> = ({side, at: t0, badge, badgeTone = LPI.pink, label, chip, bump = 1, opacity = 1}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || opacity <= 0) return null;
	return (
		<div style={{position: 'absolute', [side]: 48, top: 54, height: 78, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: badge !== undefined ? '0 24px 0 8px' : chip ? '0 8px 0 24px' : '0 24px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, opacity, transform: `scale(${popAt(frame, t0)})`, transformOrigin: `${side} center`}}>
			{badge !== undefined ? <div style={{width: 58, height: 58, borderRadius: 29, background: badgeTone, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: badgeTone === LPI.blue || badgeTone === N ? LPI.paper : N}}>{badge}</div> : null}
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 27, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>{label}</div>
			{chip ? <div style={{padding: '4px 16px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, fontVariantNumeric: 'tabular-nums', transform: `scale(${bump})`}}>{chip}</div> : null}
		</div>
	);
};
