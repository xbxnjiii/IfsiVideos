// Corps humain semi-réaliste animé, en unités « corps » (1000 × 1800).
// Couches : peau (volume, contour) → intérieur en transparence (muscles, poumons, vaisseaux, cœur)
// → carte thermique. Le sang circule (globules), l'onde de pouls part du cœur à chaque battement.
import React from 'react';
import {alpha, LPI} from '../brand/theme';
import {ARTERIES, BONES, HEART, LINES, LUNGS, MUSCLES, PARTS, RIBS, Vessel, VEINS} from './body';
import {pointAt, sample, Sampled, smooth} from './geometry';
import {Heart, HEART_BOX} from './Heart';
import {Lungs} from './Lungs';

export type BodyLook = {
	/** 0 = peau opaque, 1 = « rayons X » (on voit l'intérieur) */
	xray: number;
	/** opacité de la couche musculaire */
	muscles: number;
	/** opacité des vaisseaux */
	vessels: number;
	/** poumons / cœur visibles */
	organs: number;
	/** −1 (froid) … 0 … +1 (fièvre) */
	thermal: number;
	/** inspiration 0 → 1 */
	breath: number;
	/** vitesse du sang veineux / de base (1 = normal) */
	flow: number;
	/** contour lumineux d'un groupe de vaisseaux */
	focus?: 'arteries' | 'veins' | null;
	/** tracé progressif des vaisseaux depuis le cœur (0 → 1) */
	draw?: number;
};

export const DEFAULT_LOOK: BodyLook = {xray: 0, muscles: 0, vessels: 0, organs: 0, thermal: 0, breath: 0, flow: 1, focus: null, draw: 1};

/* ─────────── précalculs (une seule fois) ─────────── */

type VesselGeo = Vessel & {d: string; s: Sampled; offset: number};

const geo = (v: Vessel): VesselGeo => {
	const d = smooth(v.pts);
	const s = sample(d, 3);
	// distance « depuis le cœur » : début du tracé pour une artère, fin pour une veine
	const [x, y] = v.kind === 'artery' ? v.pts[0] : v.pts[v.pts.length - 1];
	return {...v, d, s, offset: Math.hypot(x - HEART.x, y - HEART.y) * 1.15};
};
const A_GEO = ARTERIES.map(geo);
const V_GEO = VEINS.map(geo);

/* ─────────── battements ─────────── */

/** contraction ventriculaire / auriculaire à la frame donnée */
export const heartState = (frame: number, beats: number[]) => {
	let last = -1e9;
	let next = 1e9;
	for (const b of beats) {
		if (b <= frame) last = b;
		else {
			next = b;
			break;
		}
	}
	const t = frame - last;
	const ventricles = t < 0 ? 0 : t < 3 ? t / 3 : Math.exp(-(t - 3) / 5);
	const atria = Math.exp(-Math.abs(frame - (next - 5)) / 2.2);
	return {ventricles, atria, last};
};

/** distance parcourue par le sang artériel : vitesse de base + poussée à chaque systole */
const arterialTravel = (frame: number, beats: number[], flow: number) => {
	let surge = 0;
	for (const b of beats) {
		if (b > frame) break;
		surge += 40 * (1 - Math.exp(-(frame - b) / 6));
	}
	return frame * 1.6 * flow + surge;
};

/* ─────────── rendu d'un vaisseau ─────────── */

const VesselTube: React.FC<{
	v: VesselGeo;
	frame: number;
	travel: number;
	beats: number[];
	glow: number;
	draw: number;
}> = ({v, frame, travel, beats, glow, draw}) => {
	const isA = v.kind === 'artery';
	const color = isA ? LPI.pink : LPI.blue;
	const len = v.s.length;
	// tracé progressif : les artères poussent depuis le cœur, les veines depuis la périphérie
	const shown = draw >= 1 ? len : Math.max(0, Math.min(len, draw * 1500 - v.offset));
	if (shown <= 0) return null;
	const dash = draw >= 1 ? undefined : isA ? `${shown} ${len + 10}` : `0 ${len - shown} ${shown} 10`;
	// globules
	const n = Math.max(2, Math.floor(len / 30));
	const cells = Array.from({length: n}, (_, i) => {
		const base = (i / n) * len + (i % 3) * 7;
		const l = (((base + travel) % len) + len) % len;
		const p = pointAt(v.s, l);
		return {x: p.x, y: p.y, a: (p.a * 180) / Math.PI, l};
	}).filter((c) => draw >= 1 || (isA ? c.l < shown : c.l > len - shown));
	// onde de pouls (artères) : un trait clair qui file depuis le cœur
	const waves = isA
		? beats
				.filter((b) => b <= frame && frame - b < 90)
				.map((b) => (frame - b) * 16 - v.offset)
				.filter((dist) => dist > 0 && dist < len + 70)
		: [];
	return (
		<g fill="none" strokeLinecap="round" strokeLinejoin="round">
			{glow > 0 ? <path d={v.d} stroke={alpha(isA ? LPI.pink : LPI.blue, 0.35 * glow)} strokeWidth={v.w + 18} /> : null}
			<g strokeDasharray={dash}>
				<path d={v.d} stroke={alpha(LPI.navy, 0.75)} strokeWidth={v.w + 3} />
				<path d={v.d} stroke={color} strokeWidth={v.w} />
				<path d={v.d} stroke={alpha(LPI.navy, 0.22)} strokeWidth={v.w * 0.45} transform={`translate(${v.w * 0.22} 0)`} />
				<path d={v.d} stroke={alpha(LPI.paper, 0.5)} strokeWidth={v.w * 0.28} transform={`translate(${-v.w * 0.22} 0)`} />
			</g>
			{cells.map((c, i) => (
				<ellipse
					key={i}
					cx={c.x}
					cy={c.y}
					rx={v.w * 0.42}
					ry={v.w * 0.24}
					transform={`rotate(${c.a} ${c.x} ${c.y})`}
					fill={alpha(LPI.paper, 0.7)}
					stroke="none"
				/>
			))}
			{waves.map((dist, i) => (
				<path
					key={`w${i}`}
					d={v.d}
					stroke={alpha(LPI.paper, 0.9)}
					strokeWidth={v.w * 0.7}
					strokeDasharray={`70 ${len + 200}`}
					strokeDashoffset={70 - dist}
				/>
			))}
		</g>
	);
};

/* ─────────── corps ─────────── */

export const Body: React.FC<{
	id: string;
	frame: number;
	beats: number[];
	look: BodyLook;
	/** pixels écran par unité corps (garde des contours d'épaisseur constante à l'écran) */
	px?: number;
	children?: React.ReactNode;
}> = ({id, frame, beats, look, px = 0.6, children}) => {
	const ink = (pixels: number) => pixels / px;
	const {xray, muscles, vessels, organs, thermal, breath, flow, focus} = look;
	const hs = heartState(frame, beats);
	const travel = arterialTravel(frame, beats, flow);
	const vtravel = frame * 1.4 * flow;
	const fever = Math.max(0, thermal);
	const cold = Math.max(0, -thermal);
	const heartT = `translate(${HEART.x - HEART_BOX.cx * HEART.scale} ${HEART.y - HEART_BOX.cy * HEART.scale}) scale(${HEART.scale})`;
	return (
		<g>
			<defs>
				<radialGradient id={`${id}-skin`} cx="500" cy="520" r="1100" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor={LPI.pink} stopOpacity="0.14" />
					<stop offset="0.6" stopColor={LPI.pink} stopOpacity="0.27" />
					<stop offset="1" stopColor={LPI.pink} stopOpacity="0.42" />
				</radialGradient>
				{/* ombre interne : assombrit seulement le bord EXTÉRIEUR de la silhouette (volume) */}
				<filter id={`${id}-inner`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
					<feGaussianBlur in="SourceAlpha" stdDeviation="13" result="b" />
					<feComposite in="SourceAlpha" in2="b" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="e" />
					<feFlood floodColor={LPI.navy} floodOpacity="0.4" />
					<feComposite in2="e" operator="in" />
				</filter>
				<clipPath id={`${id}-body`}>
					{PARTS.map((p) => (
						<path key={p.id} d={p.d} />
					))}
				</clipPath>
				<radialGradient id={`${id}-fever`} cx="500" cy="560" r="900" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor={LPI.pink} stopOpacity={0.85 * fever} />
					<stop offset="0.45" stopColor={LPI.pink} stopOpacity={0.6 * fever} />
					<stop offset="1" stopColor={LPI.pink} stopOpacity={0.3 * fever} />
				</radialGradient>
				<radialGradient id={`${id}-cold`} cx="500" cy="560" r="1000" gradientUnits="userSpaceOnUse">
					<stop offset="0.12" stopColor={LPI.sky} stopOpacity={0.15 * cold} />
					<stop offset="0.45" stopColor={LPI.blue} stopOpacity={0.4 * cold} />
					<stop offset="0.8" stopColor={LPI.blue} stopOpacity={0.75 * cold} />
				</radialGradient>
			</defs>
			{/* ombre au sol */}
			<ellipse cx={500} cy={1806} rx={190} ry={22} fill={alpha(LPI.navy, 0.12)} />
			{/* peau : traits de tous les morceaux puis remplissages par-dessus → seul le contour extérieur reste */}
			<g fill="none" stroke={LPI.navy} strokeWidth={ink(9)} strokeLinejoin="round">
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
			<g fill={LPI.paper}>
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
			<rect width={1000} height={1800} fill={`url(#${id}-skin)`} clipPath={`url(#${id}-body)`} opacity={1 - 0.8 * xray} />
			{xray > 0 ? <rect width={1000} height={1800} fill={alpha(LPI.sky, 0.45 * xray)} clipPath={`url(#${id}-body)`} /> : null}
			<g filter={`url(#${id}-inner)`}>
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
			<g fill="none" stroke={alpha(LPI.navy, 0.28 * (1 - 0.6 * xray))} strokeWidth={ink(2.2)} strokeLinecap="round">
				{LINES.map((d, i) => (
					<path key={i} d={d} />
				))}
			</g>
			{/* intérieur */}
			{xray > 0 ? (
				<g clipPath={`url(#${id}-body)`} opacity={xray}>
					{muscles > 0 ? (
						<g opacity={muscles}>
							{MUSCLES.map((m) => (
								<g key={m.id}>
									<path d={m.d} fill={alpha(LPI.pink, 0.42)} stroke={alpha(LPI.navy, 0.3)} strokeWidth={2} />
									{m.fibers.map((f, i) => (
										<path key={i} d={f} fill="none" stroke={alpha(LPI.navy, 0.18)} strokeWidth={1.6} />
									))}
								</g>
							))}
						</g>
					) : null}
					{organs > 0 ? (
						<g opacity={organs} transform={`translate(${LUNGS.x} ${LUNGS.y}) scale(${LUNGS.scale})`}>
							<Lungs id={`${id}-lungs`} breath={breath} />
						</g>
					) : null}
					<g fill="none" stroke={alpha(LPI.navy, 0.13)} strokeWidth={9} strokeLinecap="round">
						{RIBS.map((d, i) => (
							<path key={i} d={d} />
						))}
						{BONES.map((d, i) => (
							<path key={`b${i}`} d={d} strokeWidth={i === 0 ? 16 : 11} />
						))}
					</g>
					{vessels > 0 ? (
						<g opacity={vessels}>
							{V_GEO.map((v) => (
								<VesselTube key={v.id} v={v} frame={frame} travel={vtravel} beats={beats} glow={focus === 'veins' ? 1 : 0} draw={look.draw ?? 1} />
							))}
							{A_GEO.map((v) => (
								<VesselTube key={v.id} v={v} frame={frame} travel={travel} beats={beats} glow={focus === 'arteries' ? 1 : 0} draw={look.draw ?? 1} />
							))}
						</g>
					) : null}
					{organs > 0 ? (
						<g opacity={organs} transform={heartT}>
							<Heart id={`${id}-heart`} contract={hs.ventricles} atria={hs.atria} />
						</g>
					) : null}
				</g>
			) : null}
			{/* carte thermique */}
			{fever > 0 ? <rect x={0} y={0} width={1000} height={1800} fill={`url(#${id}-fever)`} clipPath={`url(#${id}-body)`} /> : null}
			{cold > 0 ? <rect x={0} y={0} width={1000} height={1800} fill={`url(#${id}-cold)`} clipPath={`url(#${id}-body)`} /> : null}
			{children}
		</g>
	);
};
