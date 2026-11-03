// Série « La douleur : échelles d'évaluation » : échelle numérique 0 → 10 (EN), réglette EVA recto (côté patient,
// curseur) / verso (côté soignant, graduée), échelle verbale simple (EVS, 5 mots), échelle des visages (6 visages, sans
// sourire ni larmes, comme la FPS-R), bulles de parole, enfant (Kid), respirateur, grilles d'observation (Algoplus,
// EVENDOL, BPS) et barre de score avec seuil. Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {SeriesPart} from './series';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Teinte d'une note de douleur 0 → 10 : blanc (aucune), bleu clair (légère), bleu (modérée), rose (intense). */
export const painTone = (v: number) => (v <= 0 ? LPI.paper : v <= 3 ? LPI.sky : v <= 6 ? LPI.blue : LPI.pink);
const painInk = (v: number) => (v >= 4 && v <= 6 ? LPI.paper : N);

/* ───────────── icônes de la série ───────────── */

/** Bulle qui parle (« il peut répondre »). */
export const TalkIcon: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 22 H86 Q92 22 92 28 V62 Q92 68 86 68 H44 L26 84 V68 H14 Q8 68 8 62 V28 Q8 22 14 22 Z" fill={LPI.paper} {...SK} />
		<path d="M26 38 H74 M26 52 H60" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
	</svg>
);

/** Bulle vide barrée (« il ne peut pas répondre »). */
export const MuteIcon: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 22 H86 Q92 22 92 28 V62 Q92 68 86 68 H44 L26 84 V68 H14 Q8 68 8 62 V28 Q8 22 14 22 Z" fill={LPI.paper} {...SK} />
		{[32, 50, 68].map((x) => (
			<circle key={x} cx={x} cy={45} r={6} fill={alpha(N, 0.45)} />
		))}
		<path d="M16 86 L86 12" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
	</svg>
);

/** Les 2 parties de la série (carte `SeriesParts`, carte « À suivre »). */
export const PAIN_PARTS: SeriesPart[] = [
	{title: 'Il peut répondre', icon: <TalkIcon size={74} />},
	{title: 'Il ne répond pas', icon: <MuteIcon size={74} />},
];

/* ───────────── bulles ───────────── */

/** Bulle de parole (queue en bas à gauche ou à droite) ; `think` = bulle de pensée (petits ronds). */
export const Bubble: React.FC<{children: React.ReactNode; tail?: 'left' | 'right'; think?: boolean; tone?: string; pad?: string}> = ({children, tail = 'left', think = false, tone = LPI.paper, pad = '18px 30px'}) => (
	<div style={{position: 'relative', display: 'inline-block'}}>
		<div style={{padding: pad, borderRadius: 40, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, color: N, whiteSpace: 'nowrap', position: 'relative', zIndex: 1}}>{children}</div>
		{think ? (
			<>
				<div style={{position: 'absolute', [tail]: 30, bottom: -30, width: 26, height: 26, borderRadius: 13, background: tone, border: `5px solid ${N}`}} />
				<div style={{position: 'absolute', [tail]: 14, bottom: -54, width: 16, height: 16, borderRadius: 8, background: tone, border: `4px solid ${N}`}} />
			</>
		) : (
			<svg width={60} height={44} viewBox="0 0 60 44" style={{position: 'absolute', [tail]: 34, bottom: -36, zIndex: 2, transform: tail === 'right' ? 'scaleX(-1)' : undefined}}>
				<path d="M4 0 L18 40 L44 0" fill={tone} stroke={N} strokeWidth={6} strokeLinejoin="round" />
				<path d="M2 -6 H48" stroke={tone} strokeWidth={10} />
			</svg>
		)}
	</div>
);

/* ───────────── EN : échelle numérique 0 → 10 ───────────── */

/** Échelle numérique : 11 cases qui arrivent l'une après l'autre (`at`, `stagger`), `pick` = la note choisie (grossie,
 * entourée) à partir de `pickAt` ; `hover` (0 → 10, continu) = doigt qui hésite au-dessus ; `ends` = étiquettes des bouts. */
export const NumScale: React.FC<{at: number; width?: number; stagger?: number; pick?: number | null; pickAt?: number; hover?: number | null; ends?: [number, number] | null; glow?: number[]}> = ({at: t0, width = 936, stagger = 2, pick = null, pickAt = 0, hover = null, ends = null, glow = []}) => {
	const frame = useCurrentFrame();
	const gap = 8;
	const cw = (width - gap * 10) / 11;
	const picked = pick !== null && frame >= pickAt;
	return (
		<div style={{position: 'relative', width, height: cw + 150}}>
			{Array.from({length: 11}, (_, v) => {
				const t = t0 + v * stagger;
				if (frame < t) return null;
				const on = picked && v === pick;
				const lit = glow.includes(v);
				const s = popAt(frame, t) * (on ? 1 + 0.22 * Math.min(1, (frame - pickAt) / 5) : 1);
				return (
					<div key={v} style={{position: 'absolute', left: v * (cw + gap), top: 60, width: cw, height: cw, borderRadius: 22, background: painTone(v), border: `${on || lit ? 7 : 5}px solid ${N}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: cw * 0.5, color: painInk(v), transform: `scale(${s})`, boxShadow: on ? `0 0 0 8px ${alpha(LPI.pink, 0.55)}` : lit ? `0 0 0 7px ${alpha(LPI.blue, 0.4)}` : 'none', zIndex: on ? 2 : 1}}>
						{v}
					</div>
				);
			})}
			{hover !== null ? (
				<svg width={84} height={84} viewBox="0 0 60 60" style={{position: 'absolute', left: hover * (cw + gap) + cw / 2 - 42, top: -30, overflow: 'visible'}}>
					<path d="M30 56 L8 22 H22 V2 H38 V22 H52 Z" fill={LPI.pink} {...SK} strokeWidth={5} />
				</svg>
			) : null}
			{ends ? (
				<>
					{frame >= ends[0] ? (
						<div style={{position: 'absolute', left: -6, top: cw + 76, width: 300, fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: N, lineHeight: 1.1, opacity: interpolate(frame, [ends[0], ends[0] + 6], [0, 1], clamp)}}>
							0 = aucune
							<br />
							douleur
						</div>
					) : null}
					{frame >= ends[1] ? (
						<div style={{position: 'absolute', right: -6, top: cw + 76, width: 360, textAlign: 'right', fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: N, lineHeight: 1.1, opacity: interpolate(frame, [ends[1], ends[1] + 6], [0, 1], clamp)}}>
							10 = la pire douleur
							<br />
							imaginable
						</div>
					) : null}
				</>
			) : null}
		</div>
	);
};

/* ───────────── EVA : la réglette ───────────── */

/** Petit visage de bout de réglette : 0 = détendu, 1 = douleur maximale. */
const EndFace: React.FC<{pain: number; x: number; y: number; r?: number}> = ({pain, x, y, r = 24}) => (
	<g transform={`translate(${x} ${y})`}>
		<circle r={r} fill={pain ? alpha(LPI.pink, 0.6) : LPI.paper} stroke={N} strokeWidth={5} />
		{pain ? (
			<>
				<path d={`M${-r * 0.5} ${-r * 0.2} l${r * 0.25} ${r * 0.12} M${r * 0.5} ${-r * 0.2} l${-r * 0.25} ${r * 0.12}`} stroke={N} strokeWidth={4} strokeLinecap="round" />
				<path d={`M${-r * 0.4} ${r * 0.45} Q0 ${r * 0.1} ${r * 0.4} ${r * 0.45}`} fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
			</>
		) : (
			<>
				<circle cx={-r * 0.35} cy={-r * 0.15} r={3} fill={N} />
				<circle cx={r * 0.35} cy={-r * 0.15} r={3} fill={N} />
				<path d={`M${-r * 0.35} ${r * 0.35} H${r * 0.35}`} stroke={N} strokeWidth={4} strokeLinecap="round" />
			</>
		)}
	</g>
);

/** Réglette EVA (880 × 230) : recto « côté patient » (une ligne, de pas de douleur à douleur maximale, curseur à `pos`
 * 0 → 1) ; elle se retourne avec `flip` 0 → 1 : verso « côté soignant », gradué de 0 à 10, le score se lit sous le curseur.
 * `ends` : les étiquettes des bouts apparaissent (0 → 1 pour chacune). */
export const Ruler: React.FC<{pos: number; flip: number; width?: number; ends?: [number, number]; hand?: number}> = ({pos, flip, width = 880, ends = [1, 1], hand = 0}) => {
	const k = width / 880;
	const back = flip >= 0.5;
	const sy = Math.max(0.04, Math.abs(Math.cos(flip * Math.PI)));
	const x0 = 90;
	const x1 = 790;
	const cx = x0 + (x1 - x0) * pos;
	return (
		<div style={{position: 'relative', width, height: 230 * k, transform: `scaleY(${sy})`}}>
			<svg width={width} height={230 * k} viewBox="0 0 880 230" style={{overflow: 'visible'}}>
				<rect x={10} y={30} width={860} height={150} rx={30} fill={back ? LPI.sky : LPI.paper} stroke={N} strokeWidth={7} />
				{back ? (
					<>
						{Array.from({length: 101}, (_, i) => {
							const x = x0 + ((x1 - x0) * i) / 100;
							const big = i % 10 === 0;
							return <path key={i} d={`M${x} 52 V${big ? 92 : i % 5 === 0 ? 80 : 70}`} stroke={N} strokeWidth={big ? 5 : 2.5} />;
						})}
						{Array.from({length: 11}, (_, v) => (
							<text key={v} x={x0 + ((x1 - x0) * v) / 10} y={136} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
								{v}
							</text>
						))}
						<path d={`M${cx} 40 V170`} stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
					</>
				) : (
					<>
						<path d={`M${x0} 105 H${x1}`} stroke={N} strokeWidth={8} strokeLinecap="round" />
						<path d={`M${x0} 85 V125 M${x1} 85 V125`} stroke={N} strokeWidth={8} strokeLinecap="round" />
						<g opacity={ends[0]}>
							<EndFace pain={0} x={x0 - 40} y={105} />
						</g>
						<g opacity={ends[1]}>
							<EndFace pain={1} x={x1 + 40} y={105} />
						</g>
						{/* curseur : une fenêtre qui glisse sur la ligne */}
						<g transform={`translate(${cx} 105)`}>
							<rect x={-26} y={-58} width={52} height={116} rx={14} fill={alpha(LPI.blue, 0.35)} stroke={N} strokeWidth={6} />
							<path d="M0 -44 V44" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
						</g>
						{hand > 0 ? (
							<g transform={`translate(${cx + 8} 150)`} opacity={hand}>
								<path d="M-14 0 C-14 -10 -8 -16 0 -16 C8 -16 14 -10 14 0 V40 H-14 Z" fill={LPI.paper} {...SK} strokeWidth={5} />
								<path d="M-14 0 C-14 -10 -8 -16 0 -16 C8 -16 14 -10 14 0 V40 H-14 Z" fill={alpha(LPI.pink, 0.3)} />
								<rect x={-24} y={36} width={48} height={40} rx={14} fill={LPI.blue} stroke={N} strokeWidth={5} />
							</g>
						) : null}
					</>
				)}
			</svg>
			{!back ? (
				<>
					<div style={{position: 'absolute', left: 20 * k, top: 186 * k, fontFamily: FONT.body, fontWeight: 800, fontSize: 28 * k, color: N, opacity: ends[0]}}>pas de douleur</div>
					<div style={{position: 'absolute', right: 0, top: 186 * k, fontFamily: FONT.body, fontWeight: 800, fontSize: 28 * k, color: N, opacity: ends[1]}}>douleur maximale</div>
				</>
			) : null}
		</div>
	);
};

/* ───────────── EVS : des mots ───────────── */

export const EVS_WORDS = ['pas de douleur', 'faible', 'modérée', 'intense', 'extrêmement intense'];

/** Échelle verbale simple : 5 mots (du plus léger au plus fort) qui arrivent à `ats[i]`, `pick` entouré à `pickAt`. */
export const WordScale: React.FC<{ats: number[]; pick?: number | null; pickAt?: number; width?: number; from?: number}> = ({ats, pick = null, pickAt = 0, width = 560, from}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 12, width}}>
			{EVS_WORDS.map((w, i) => {
				const t = ats[i];
				if (frame < t)
					return <div key={w} style={{height: 84, borderRadius: 999, border: `4px dashed ${alpha(N, 0.25)}`, boxSizing: 'border-box', opacity: from !== undefined && frame >= from ? interpolate(frame, [from + i * 3, from + i * 3 + 6], [0, 1], clamp) : 0}} />;
				const on = pick === i && frame >= pickAt;
				const v = [0, 2, 5, 7, 10][i];
				return (
					<div key={w} style={{height: 84, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', boxSizing: 'border-box', borderRadius: 999, background: on ? painTone(v) : LPI.paper, border: `${on ? 7 : 5}px solid ${on ? N : alpha(N, 0.35)}`, boxShadow: SHADOW, transform: `translateX(${(1 - popAt(frame, t)) * 60}px) scale(${on ? 1.05 : 1})`, opacity: Math.min(1, (frame - t) / 4)}}>
						<div style={{display: 'flex', gap: 5}}>
							{[0, 1, 2, 3].map((b) => (
								<div key={b} style={{width: 14, height: 16 + b * 8, alignSelf: 'flex-end', borderRadius: 4, background: b < i ? painTone(v) : alpha(N, 0.12), border: `3px solid ${b < i ? N : 'transparent'}`}} />
							))}
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: on && v >= 4 && v <= 6 ? LPI.paper : N, whiteSpace: 'nowrap'}}>{w}</div>
					</div>
				);
			})}
		</div>
	);
};

/* ───────────── échelle des visages ───────────── */

/** Un visage de l'échelle (niveau 0 → 5) : de détendu à très douloureux, sans sourire ni larmes (comme la FPS-R). */
export const PainFace: React.FC<{level: number; size?: number}> = ({level, size = 130}) => {
	const l = Math.max(0, Math.min(5, level));
	const brow = l * 3.2;
	const sq = Math.min(1, l / 3);
	const mouthOpen = Math.max(0, l - 3) * 7;
	const down = Math.min(3, l) * 4;
	return (
		<svg width={size} height={size} viewBox="-60 -60 120 120" style={{overflow: 'visible'}}>
			<circle r={52} fill={l >= 4 ? alpha(LPI.pink, 0.5) : l >= 2 ? alpha(LPI.pink, 0.25) : LPI.paper} stroke={N} strokeWidth={6} />
			{/* sourcils qui se froncent */}
			<path d={`M-30 ${-22 + brow * 0.2} L-10 ${-20 - brow * 0.6}`} stroke={N} strokeWidth={5} strokeLinecap="round" opacity={l > 0 ? 1 : 0} />
			<path d={`M30 ${-22 + brow * 0.2} L10 ${-20 - brow * 0.6}`} stroke={N} strokeWidth={5} strokeLinecap="round" opacity={l > 0 ? 1 : 0} />
			{/* yeux : ronds puis plissés */}
			{[-20, 20].map((x) =>
				sq < 0.7 ? (
					<ellipse key={x} cx={x} cy={-6} rx={5} ry={6 * (1 - sq * 0.6)} fill={N} />
				) : (
					<path key={x} d={`M${x - 9} -8 L${x + 9} -4 M${x - 9} -2 L${x + 9} -4`} stroke={N} strokeWidth={5} strokeLinecap="round" />
				),
			)}
			{/* bouche : droite → tombante → grimace ouverte */}
			{mouthOpen > 0 ? (
				<path d={`M-20 ${24} Q0 ${14 - mouthOpen * 0.3} 20 24 Q0 ${30 + mouthOpen} -20 24 Z`} fill={N} stroke={N} strokeWidth={4} strokeLinejoin="round" />
			) : (
				<path d={`M-18 ${24 + (l > 1 ? 2 : 0)} Q0 ${24 - down} 18 ${24 + (l > 1 ? 2 : 0)}`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			)}
		</svg>
	);
};

/** Les 6 visages (scores 0, 2, 4, 6, 8, 10), qui arrivent à `at` ; `pick` entouré à `pickAt`. */
export const FacesScale: React.FC<{at: number; pick?: number | null; pickAt?: number; size?: number; gap?: number}> = ({at: t0, pick = null, pickAt = 0, size = 130, gap = 22}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap}}>
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const t = t0 + i * 4;
				const on = pick === i && frame >= pickAt;
				return (
					<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: frame < t ? 0 : 1, transform: `scale(${frame < t ? 0 : popAt(frame, t) * (on ? 1.18 : 1)}) translateY(${on ? -10 : 0}px)`}}>
						<div style={{borderRadius: '50%', boxShadow: on ? `0 0 0 10px ${alpha(LPI.pink, 0.7)}` : 'none'}}>
							<PainFace level={i} size={size} />
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: on ? LPI.blue : alpha(N, 0.6)}}>{i * 2}</div>
					</div>
				);
			})}
		</div>
	);
};

/* ───────────── l'enfant ───────────── */

/** Enfant (300 × 360) : `mood`, `cry` (larmes + « ouin »), `point` 0 → 1 (le bras se lève et montre vers la droite),
 * `curl` (recroquevillé), `shake` (agité), `turn` (se détourne). */
export const Kid: React.FC<{size?: number; mood?: 'calme' | 'mal'; cry?: number; point?: number; curl?: number; shake?: number; turn?: number}> = ({size = 300, mood = 'calme', cry = 0, point = 0, curl = 0, shake = 0, turn = 0}) => {
	const frame = useCurrentFrame();
	const k = size / 300;
	const jx = Math.sin(frame * 1.9) * 6 * shake;
	const mal = mood === 'mal';
	const arm = -10 - 75 * point;
	return (
		<svg width={size} height={360 * k} viewBox="0 0 300 360" style={{overflow: 'visible'}}>
			<g transform={`translate(${jx} ${curl * 20}) rotate(${turn * -8} 150 300)`}>
				{/* corps (pyjama), jambes repliées si recroquevillé */}
				<path d={`M86 ${232 + curl * 10} Q150 ${206 + curl * 6} 214 ${232 + curl * 10} L226 340 H74 Z`} fill={LPI.blue} {...SK} />
				<path d="M150 236 V330" stroke={alpha(N, 0.3)} strokeWidth={4} />
				{/* bras gauche (le long du corps / serré) et bras droit (qui montre) */}
				<path d={`M96 ${246 + curl * 8} Q${72 + curl * 30} 290 ${84 + curl * 40} ${322 - curl * 20}`} fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
				<path d={`M96 ${246 + curl * 8} Q${72 + curl * 30} 290 ${84 + curl * 40} ${322 - curl * 20}`} fill="none" stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" />
				<g transform={`rotate(${arm} 206 246)`}>
					<path d="M206 246 Q226 290 216 324" fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
					<path d="M206 246 Q226 290 216 324" fill="none" stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" />
					<circle cx={216} cy={330} r={14} fill={LPI.paper} stroke={N} strokeWidth={5} />
				</g>
				{/* tête */}
				<circle cx={150} cy={122} r={82} fill={LPI.paper} stroke={N} strokeWidth={7} />
				<circle cx={150} cy={122} r={82} fill={alpha(LPI.pink, 0.28)} />
				<path d="M74 104 C74 52 112 34 150 36 C192 36 226 58 226 104 C206 82 176 74 150 76 C126 72 98 82 74 104 Z" fill={N} />
				<path d="M150 38 C140 22 156 12 166 22" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" />
				<ellipse cx={110} cy={150} rx={14} ry={8} fill={LPI.pink} opacity={mal ? 0.9 : 0.55} />
				<ellipse cx={190} cy={150} rx={14} ry={8} fill={LPI.pink} opacity={mal ? 0.9 : 0.55} />
				{mal ? (
					<>
						<path d="M110 106 L134 116 M190 106 L166 116" stroke={N} strokeWidth={6} strokeLinecap="round" />
						<path d="M112 128 L134 124 M188 128 L166 124" stroke={N} strokeWidth={6} strokeLinecap="round" />
						<path d="M126 170 Q150 150 174 170 Q150 184 126 170 Z" fill={N} />
					</>
				) : (
					<>
						<circle cx={122} cy={124} r={9} fill={N} />
						<circle cx={178} cy={124} r={9} fill={N} />
						<path d="M132 166 Q150 174 168 166" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
					</>
				)}
				{cry > 0
					? [118, 182].map((x, i) => {
							const t = ((frame + i * 9) % 22) / 22;
							return <path key={x} d={`M${x} ${136 + t * 40} q-6 10 0 16 q6 -6 0 -16 Z`} fill={LPI.sky} stroke={N} strokeWidth={3} opacity={cry * (1 - t * 0.6)} />;
						})
					: null}
			</g>
			{cry > 0
				? [0, 1, 2].map((i) => {
						const t = ((frame + i * 8) % 24) / 24;
						return <path key={i} d={`M${236 + t * 30} ${150 - 22 - i * 12} q16 ${12 + i * 8} 0 ${44 + i * 24}`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" opacity={cry * (1 - t)} />;
					})
				: null}
		</svg>
	);
};

/* ───────────── réanimation : le respirateur ───────────── */

/** Respirateur (240 × 300) : écran avec la courbe de pression qui défile ; `fight` 0 → 1 : la courbe devient
 * irrégulière (le patient « lutte » contre la machine), l'écran s'allume en rose. */
export const Ventilator: React.FC<{width?: number; fight?: number}> = ({width = 240, fight = 0}) => {
	const frame = useCurrentFrame();
	const k = width / 240;
	const pts = Array.from({length: 40}, (_, i) => {
		const x = 30 + i * 4.6;
		const t = (i + frame * 0.6) / 10;
		const base = Math.max(0, Math.sin(t * Math.PI)) * 30;
		const jag = fight * Math.sin(i * 2.7 + frame * 0.9) * 12;
		return `${x},${110 - base - jag}`;
	}).join(' ');
	return (
		<svg width={width} height={300 * k} viewBox="0 0 240 300" style={{overflow: 'visible'}}>
			<rect x={10} y={10} width={220} height={260} rx={26} fill={LPI.paper} {...SK} />
			<rect x={26} y={30} width={188} height={110} rx={14} fill={N} stroke={fight > 0.5 && frame % 14 < 8 ? LPI.pink : N} strokeWidth={6} />
			<polyline points={pts} fill="none" stroke={fight > 0.5 ? LPI.pink : LPI.sky} strokeWidth={5} strokeLinejoin="round" />
			{[60, 120, 180].map((x) => (
				<circle key={x} cx={x} cy={180} r={16} fill={LPI.sky} stroke={N} strokeWidth={5} />
			))}
			<rect x={40} y={216} width={160} height={30} rx={10} fill={alpha(LPI.blue, 0.5)} stroke={N} strokeWidth={5} />
			<path d="M60 270 V292 M180 270 V292" stroke={N} strokeWidth={8} strokeLinecap="round" />
		</svg>
	);
};

/* ───────────── grilles d'observation ───────────── */

export type SheetRow = {label: string; icon?: React.ReactNode; at: number; points?: number; pointsAt?: number};

/** Grille d'observation (Algoplus : `mode` oui / non ; EVENDOL ou BPS : points 0 → `max`) : chaque ligne arrive à
 * son mot, la réponse s'allume à `pointsAt` ; le total se lit en bas (`total`). */
export const ObsSheet: React.FC<{title: string; rows: SheetRow[]; mode: 'yesno' | 'points'; max?: number; width?: number; rowH?: number; total?: {at: number; of: number; label?: string}}> = ({title, rows, mode, max = 3, width = 560, rowH = 74, total}) => {
	const frame = useCurrentFrame();
	const score = rows.reduce((s, r) => s + (r.pointsAt !== undefined && frame >= r.pointsAt ? r.points ?? 0 : 0), 0);
	return (
		<div style={{width, borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden'}}>
			<div style={{background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, padding: '12px 24px'}}>{title}</div>
			<div style={{padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 8}}>
				{rows.map((r) => {
					const on = frame >= r.at;
					const ans = r.pointsAt !== undefined && frame >= r.pointsAt;
					return (
						<div key={r.label} style={{height: rowH, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px', borderRadius: 18, background: on ? (ans && (r.points ?? 0) > 0 ? alpha(LPI.pink, 0.35) : alpha(LPI.sky, 0.45)) : alpha(LPI.sky, 0.15), opacity: on ? 1 : 0.35, transform: `scale(${on ? popAt(frame, r.at) : 1})`}}>
							{r.icon ? <div style={{width: 54, height: 54, borderRadius: 27, background: LPI.paper, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{r.icon}</div> : null}
							<div style={{flex: 1, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, whiteSpace: 'nowrap'}}>{r.label}</div>
							{mode === 'yesno' ? (
								<div style={{display: 'flex', gap: 6}}>
									{['oui', 'non'].map((o) => {
										const pick = ans && ((o === 'oui') === (r.points ?? 0) > 0);
										return (
											<div key={o} style={{padding: '4px 14px', borderRadius: 999, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: pick ? (o === 'oui' ? N : LPI.paper) : alpha(N, 0.4), background: pick ? (o === 'oui' ? LPI.pink : LPI.blue) : 'transparent', border: `3px solid ${pick ? N : alpha(N, 0.25)}`, transform: `scale(${pick ? popAt(frame, r.pointsAt ?? 0) : 1})`}}>
												{o}
											</div>
										);
									})}
								</div>
							) : (
								<div style={{display: 'flex', gap: 6}}>
									{Array.from({length: max}, (_, i) => (
										<div key={i} style={{width: 24, height: 24, borderRadius: 12, background: ans && i < (r.points ?? 0) ? LPI.pink : 'transparent', border: `4px solid ${ans && i < (r.points ?? 0) ? N : alpha(N, 0.25)}`}} />
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
			{total && frame >= total.at ? (
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 14px', borderTop: `4px dashed ${alpha(N, 0.2)}`}}>
					<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: alpha(N, 0.7), letterSpacing: '0.08em'}}>{total.label ?? 'SCORE'}</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N, transform: `scale(${popAt(frame, total.at)})`}}>
						<span style={{color: score > 0 ? LPI.pink : N}}>{score}</span> / {total.of}
					</div>
				</div>
			) : null}
		</div>
	);
};

/** Barre de score 0 → `max` avec le seuil (« dès 5 / 30 ») : elle se remplit jusqu'à `value`, rose au-delà du seuil. */
export const ScoreBar: React.FC<{value: number; max: number; threshold: number; width?: number; label?: string}> = ({value, max, threshold, width = 936, label}) => {
	const f = Math.max(0, Math.min(1, value / max));
	const tx = (threshold / max) * (width - 40) + 20;
	const over = value >= threshold;
	return (
		<div style={{position: 'relative', width, height: 150}}>
			<div style={{position: 'absolute', left: 20, right: 20, top: 52, height: 46, borderRadius: 23, background: alpha(LPI.sky, 0.6), border: `5px solid ${N}`, overflow: 'hidden'}}>
				<div style={{width: `${f * 100}%`, height: '100%', background: over ? LPI.pink : LPI.blue}} />
			</div>
			<div style={{position: 'absolute', left: tx - 3, top: 36, width: 6, height: 78, borderRadius: 3, background: N}} />
			<div style={{position: 'absolute', left: tx - 120, top: 0, width: 240, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: N}}>{label ?? `seuil : ${threshold}`}</div>
			<div style={{position: 'absolute', left: 12, top: 108, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: alpha(N, 0.6)}}>0</div>
			<div style={{position: 'absolute', right: 12, top: 108, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: alpha(N, 0.6)}}>{max}</div>
		</div>
	);
};
