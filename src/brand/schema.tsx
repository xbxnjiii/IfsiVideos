// Schémas de manuel annotés au mot (modèle `Organisation-Corps-Schema`, n° 102) : carte blanche 960 × 1120, légendes
// (point sur la structure, trait de rappel qui se trace, nom + sous-titre bleu, la dernière pulse en rose), scène type
// `LevelScene` (pastille de série, compteur n / N, titre, carte), dégradés communs `Defs`, couleurs de manuel `ANAT_C`
// (exception à la palette validée pour l'anatomie).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live} from './bold';
import {Camera} from './motion3';
import {Counter, PINK_BG, Pop, SeriesPill, ShortBg} from './short';
import {Sfx, type SfxName} from './Sfx';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;
export type SchemaSeries = {cap: string; label: string; total: number};
export const ANAT_C = {
	muscle: '#C9545F',
	muscleDark: '#8E2A35',
	artery: '#D63B3B',
	vein: '#3F63B8',
	nerve: '#E8B931',
	fat: '#F6D98A',
	skin: '#F6D2B8',
	skinLine: '#C98F6B',
	nucleus: '#8E6BB8',
	nucleusDark: '#5B3F86',
	mito: '#F2994A',
	mitoDark: '#B7621C',
	blood: '#A3212E',
	bone: '#EFE8DE',
};
const C = ANAT_C;

/* ═══════════════════════════════ ANNOTATIONS ═══════════════════════════════ */

/** Une légende de manuel : point sur la structure (ax, ay), trait qui se trace, texte (tx, ty) + sous-titre. */
export type Ann = {at: number; text: string; sub?: string; ax: number; ay: number; tx: number; ty: number; end?: boolean; size?: number};

export const Label: React.FC<{a: Ann; hot: boolean}> = ({a, hot}) => {
	const f = useCurrentFrame();
	if (f < a.at - 4) return null;
	const size = a.size ?? 34;
	const p = interpolate(f, [a.at - 4, a.at + 6], [0, 1], clamp);
	const o = interpolate(f, [a.at, a.at + 6], [0, 1], clamp);
	// le trait part du côté du texte tourné vers la structure (largeur du texte estimée)
	const tw = a.text.length * size * 0.56;
	const far = a.end ? a.ax < a.tx - tw : a.ax > a.tx + tw;
	const lx = far ? a.tx + (a.end ? -tw - 12 : tw + 12) : a.tx + (a.end ? 12 : -12);
	const ly = a.ty - size * 0.32;
	const len = Math.hypot(a.ax - lx, a.ay - ly);
	const pulse = hot ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
	const anchor = a.end ? 'end' : 'start';
	return (
		<g>
			{hot ? <circle cx={a.ax} cy={a.ay} r={20 + 10 * pulse} fill="none" stroke={LPI.pink} strokeWidth={6} opacity={0.4 + 0.5 * pulse} /> : null}
			<line x1={a.ax} y1={a.ay} x2={lx} y2={ly} stroke={LPI.paper} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
			<line x1={a.ax} y1={a.ay} x2={lx} y2={ly} stroke={N} strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
			<circle cx={a.ax} cy={a.ay} r={9 * Math.min(1, p * 3)} fill={N} stroke={LPI.paper} strokeWidth={3} />
			<g opacity={o} transform={`translate(${(a.end ? 1 : -1) * 14 * (1 - o)} 0)`}>
				<text x={a.tx} y={a.ty} textAnchor={anchor} fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={N} stroke={LPI.paper} strokeWidth={10} paintOrder="stroke" strokeLinejoin="round">
					{a.text}
				</text>
				{a.sub ? (
					<text x={a.tx} y={a.ty + size * 0.95} textAnchor={anchor} fontFamily={FONT.body} fontWeight={800} fontSize={size * 0.74} fill={LPI.blue} stroke={LPI.paper} strokeWidth={8} paintOrder="stroke" strokeLinejoin="round">
						{a.sub}
					</text>
				) : null}
			</g>
		</g>
	);
};

/** Toutes les légendes ; la dernière apparue pulse (cercle rose) jusqu'à la suivante. */
export const Labels: React.FC<{anns: Ann[]}> = ({anns}) => {
	const f = useCurrentFrame();
	const shown = anns.filter((a) => f >= a.at - 4).sort((x, y) => x.at - y.at);
	const last = shown[shown.length - 1];
	return (
		<>
			{anns.map((a, i) => (
				<Label key={i} a={a} hot={a === last && f < a.at + 40} />
			))}
		</>
	);
};

/** Carte blanche du schéma (960 × 1120) : dessin + légendes, dans le même repère. */
export const SchemaCard: React.FC<{draw: (f: number) => React.ReactNode; anns: Ann[]; caption?: string}> = ({draw, anns, caption}) => (
	<div style={{width: 960, height: 1120, borderRadius: 44, background: '#FFFFFF', boxShadow: SHADOW, border: `5px solid ${alpha(N, 0.15)}`, position: 'relative', overflow: 'hidden'}}>
		<Live
			render={(f) => (
				<svg width={960} height={1120} viewBox="0 0 960 1120" style={{position: 'absolute', left: 0, top: 0}}>
					{draw(f)}
					<Labels anns={anns} />
				</svg>
			)}
		/>
		{caption ? (
			<div style={{position: 'absolute', left: 30, top: 24, fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.12em', color: alpha(N, 0.45)}}>{caption}</div>
		) : null}
	</div>
);

/** Scène d'un niveau : pastille, compteur, titre, carte du schéma. */
export const LevelScene: React.FC<{
	series: SchemaSeries;
	n: number;
	numAt: number;
	title: string;
	pink?: boolean;
	cardAt: number;
	caption: string;
	draw: (f: number) => React.ReactNode;
	anns: Ann[];
	extra?: React.ReactNode;
	sfx?: {name: SfxName; at: number; volume?: number}[];
}> = ({series, n, numAt, title, pink, cardAt, caption, draw, anns, extra, sfx = []}) => (
	<AbsoluteFill>
		<ShortBg tone={pink ? PINK_BG : LPI.sky} />
		<SeriesPill cap={series.cap} label={series.label} />
		<Counter steps={[[0, n - 1], [numAt, n]]} total={series.total} />
		<Camera punches={[numAt + 1, ...anns.map((a) => a.at + 1)]} strength={0.015}>
			<Big from={numAt - 2} text={title} size={100} y={300} />
			<Pop at={cardAt} x={540} y={1012}>
				<SchemaCard draw={draw} anns={anns} caption={caption} />
			</Pop>
			{extra}
		</Camera>
		<Sfx name="pop" at={numAt} volume={0.18} />
		<Sfx name="whoosh" at={cardAt} volume={0.12} />
		{anns.map((a, i) => (
			<Sfx key={i} name="tick" at={a.at} volume={0.12} />
		))}
		{sfx.map((s, i) => (
			<Sfx key={`s${i}`} name={s.name} at={s.at} volume={s.volume ?? 0.15} />
		))}
	</AbsoluteFill>
);

/* ═══════════════════════════════ DESSINS ═══════════════════════════════ */

/** Définitions de dégradés communes (à poser une fois par svg). */
export const Defs: React.FC = () => (
	<defs>
		<radialGradient id="ocsCyto" cx="45%" cy="40%" r="65%">
			<stop offset="0%" stopColor="#FFFFFF" />
			<stop offset="100%" stopColor={LPI.sky} />
		</radialGradient>
		<radialGradient id="ocsNuc" cx="40%" cy="35%" r="70%">
			<stop offset="0%" stopColor="#B79BD8" />
			<stop offset="100%" stopColor={C.nucleus} />
		</radialGradient>
		<linearGradient id="ocsMuscle" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stopColor="#DE6E78" />
			<stop offset="100%" stopColor={C.muscleDark} />
		</linearGradient>
		<linearGradient id="ocsWall" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor="#D8636D" />
			<stop offset="100%" stopColor="#A43A45" />
		</linearGradient>
		<linearGradient id="ocsSkin" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stopColor="#F1C3A3" />
			<stop offset="50%" stopColor={C.skin} />
			<stop offset="100%" stopColor="#F1C3A3" />
		</linearGradient>
		<filter id="ocsSoft" x="-20%" y="-20%" width="140%" height="140%">
			<feGaussianBlur stdDeviation="10" />
		</filter>
	</defs>
);

