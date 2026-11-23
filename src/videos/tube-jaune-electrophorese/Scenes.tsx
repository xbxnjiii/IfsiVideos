// « Le tube jaune : électrophorèse et immunoglobulines » (n° 87, série courte du tube jaune, vidéo 10 ; directives
// Instagram). Accroche : un pic sur la courbe peut cacher un myélome. 1 · l'électrophorèse (un courant sépare les protéines
// du sérum selon taille et charge : albumine, alpha 1, alpha 2, bêta, gamma) ; 2 · ce qu'elle montre (dôme large des gammas
// = inflammation chronique, hypergammaglobulinémie polyclonale ; pic étroit = immunoglobuline monoclonale → chercher un
// myélome) ; 3 · les immunoglobulines (IgG les plus nombreuses, durée ; IgA muqueuses ; IgM en premier ; basses = déficit
// immunitaire).
// Sources : HAS / Société française d'hématologie (gammapathies monoclonales, myélome) ; valeurs usuelles des laboratoires
// français (albumine ≈ 55 – 65 % des protéines ; IgG ≈ 7 – 16 g/L, IgA ≈ 0,7 – 4 g/L, IgM ≈ 0,4 – 2,3 g/L, variables).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: "LE TUBE JAUNE · L'ÉLECTROPHORÈSE", total: 3};

const BANDS = [
	{x: 0.14, h: 1, w: 0.035, name: 'albumine'},
	{x: 0.36, h: 0.16, w: 0.025, name: 'α1'},
	{x: 0.5, h: 0.3, w: 0.03, name: 'α2'},
	{x: 0.65, h: 0.27, w: 0.035, name: 'β'},
	{x: 0.84, h: 0.32, w: 0.07, name: 'γ'},
];

/** Courbe d'électrophorèse : 5 bandes ; `gamma` 'normal' | 'dome' | 'spike' ; tracée jusqu'à `reveal` (0 → 1) ; `lit` = bandes nommées. */
const ElectroCurve: React.FC<{reveal?: number; gamma?: number; spike?: number; lit?: number; width?: number}> = ({reveal = 1, gamma = 0, spike = 0, lit = 0, width = 820}) => {
	const W = 820;
	const H = 380;
	const base = H - 70;
	const y = (u: number) => {
		let v = 0;
		BANDS.forEach((b, i) => {
			let h = b.h;
			let w = b.w;
			if (i === 4) {
				h = b.h + 0.28 * gamma;
				w = b.w + 0.03 * gamma;
			}
			v += h * Math.exp(-((u - b.x) ** 2) / (2 * w * w));
		});
		v += 0.85 * spike * Math.exp(-((u - 0.8) ** 2) / (2 * 0.008 * 0.008));
		return base - v * (H - 120);
	};
	const n = 240;
	const pts = Array.from({length: n + 1}, (_, i) => i / n).filter((u) => u <= reveal);
	const X = (u: number) => 30 + u * (W - 60);
	const d = pts.map((u, i) => `${i ? 'L' : 'M'}${X(u).toFixed(1)} ${y(u).toFixed(1)}`).join(' ');
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<rect x={10} y={20} width={W - 20} height={H - 30} rx={30} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<line x1={30} y1={base} x2={W - 30} y2={base} stroke={alpha(N, 0.3)} strokeWidth={4} />
			{pts.length > 1 && <path d={`${d} L${X(pts[pts.length - 1])} ${base} L${X(0)} ${base} Z`} fill={alpha(LPI.sky, 0.8)} />}
			{pts.length > 1 && <path d={d} fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />}
			{BANDS.map((b, i) => (
				<text key={b.name} x={X(b.x)} y={H - 22} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={i === 0 ? 30 : 38} fill={N} opacity={clamp01(lit * 5 - i)}>
					{b.name}
				</text>
			))}
			{spike > 0.5 && <path d={`M${X(0.8)} ${y(0.8) - 20} l-18 -34 h36 Z`} fill={LPI.pink} stroke={N} strokeWidth={4} />}
		</svg>
	);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Anticorps en Y (IgG), en pentamère (IgM) ou en paire (IgA). */
const AntiY: React.FC<{size?: number; tone?: string}> = ({size = 120, tone = LPI.blue}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={N} strokeWidth={18} strokeLinecap="round" />
		<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={tone} strokeWidth={10} strokeLinecap="round" />
	</svg>
);
const Ig: React.FC<{kind: 'G' | 'A' | 'M'; size?: number; on?: number}> = ({kind, size = 220, on = 1}) => {
	const tone = kind === 'G' ? LPI.blue : kind === 'A' ? LPI.pink : LPI.sky;
	const n = kind === 'G' ? 1 : kind === 'A' ? 2 : 5;
	return (
		<div style={{width: size, height: size + 60, position: 'relative', opacity: 0.2 + 0.8 * on, transform: `scale(${0.85 + 0.15 * on})`}}>
			{Array.from({length: n}).map((_, i) => {
				const a = n === 1 ? 0 : n === 2 ? (i ? 90 : -90) : (i * 360) / n;
				const r = n === 1 ? 0 : n === 2 ? size * 0.2 : size * 0.24;
				const s = n === 1 ? size * 0.8 : n === 2 ? size * 0.5 : size * 0.42;
				return (
					<div key={i} style={{position: 'absolute', left: size / 2 - s / 2 + r * Math.sin((a * Math.PI) / 180), top: size / 2 - s / 2 - r * Math.cos((a * Math.PI) / 180), transform: `rotate(${a}deg)`}}>
						<AntiY size={s} tone={tone} />
					</div>
				);
			})}
			<div style={{position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>Ig{kind}</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PIC = at('intro', 'pic');
	const CANCER = at('intro', 'cancer');
	const MYEL = at('intro', 'myélome.');
	const TRIE = at('intro', 'trie');
	const CINQ = at('intro', 'cinq');
	const LIRE = at('intro', 'lire ?');
	const spike = interpolate(frame, [PIC, PIC + 14], [0, 1], clamp);
	return (
		<LabHook
			series={S}
			title={"*L'électrophorèse*\ndans le tube *jaune*"}
			titleSize={84}
			art={<Live render={() => <ElectroCurve spike={spike} width={560} />} />}
			chips={[
				{label: 'albumine', at: CINQ},
				{label: 'α1 · α2', at: CINQ + 5, tone: LPI.pink},
				{label: 'β', at: CINQ + 10},
				{label: 'γ', at: CINQ + 15, tone: LPI.pink},
			]}
			notes={[
				{text: 'un cancer du sang ?', at: CANCER - 4},
				{text: 'tu sais la lire ?', at: LIRE - 6},
			]}
			punches={[PIC + 1, CANCER + 1, MYEL + 1, TRIE + 1, CINQ + 1]}
			shakes={[PIC + 12]}
		/>
	);
};

export const Electro: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('electro', 'un');
	const COURANT = at('electro', 'courant');
	const SEPARENT = at('electro', 'séparent');
	const TAILLE = at('electro', 'taille');
	const CINQ = at('electro', 'cinq');
	const ALB = at('electro', "l'albumine,");
	const GAMMA = at('electro', 'gamma.');
	const reveal = interpolate(frame, [COURANT, SEPARENT + 20], [0, 1], clamp);
	const lit = interpolate(frame, [ALB - 4, GAMMA + 4], [0.2, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={"*L'électrophorèse*"}
			titleAt={UN}
			titleSize={100}
			explain={{text: 'un courant trie les protéines du sérum', at: COURANT - 4}}
			art={{at: COURANT, node: <Live render={() => <ElectroCurve reveal={reveal} lit={lit} width={800} />} />}}
			artY={790}
			chips={[
				{label: 'selon leur taille et leur charge', at: TAILLE - 4, tone: LPI.paper},
				{label: '5 bandes', at: CINQ - 2, tone: LPI.pink},
			]}
			note={{text: 'albumine · α1 · α2 · β · γ', at: ALB - 4, size: 40}}
			punches={[COURANT + 1, SEPARENT + 1, CINQ + 1, ALB + 1, GAMMA + 1]}
		/>
	);
};

export const Pic: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('pic', 'deux');
	const DOME = at('pic', 'dôme');
	const CHRON = at('pic', 'chronique.');
	const MAIS = at('pic', 'mais');
	const PIC = at('pic', 'pic,');
	const FAMILLE = at('pic', 'famille');
	const MYEL = at('pic', 'myélome,');
	const MOELLE = at('pic', 'moelle');
	const gamma = interpolate(frame, [DOME - 4, DOME + 16], [0, 1], clamp) * interpolate(frame, [MAIS - 4, MAIS + 8], [1, 0], clamp);
	const spike = interpolate(frame, [PIC - 4, PIC + 12], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *pic*'}
			titleAt={DEUX}
			pink
			explain={{text: 'ce que montrent les gammas', at: DOME - 10}}
			art={{at: DOME - 6, node: <Live render={() => <ElectroCurve gamma={gamma} spike={spike} lit={1} width={760} />} />}}
			artY={790}
			chips={[
				{label: 'dôme large : inflammation chronique', at: CHRON - 10, tone: LPI.paper},
				{label: 'pic étroit : une seule famille de cellules', at: FAMILLE - 6, tone: LPI.pink},
				{label: 'chercher un myélome (cancer de la moelle)', at: MYEL - 4, tone: LPI.navy},
			]}
			punches={[DOME + 1, CHRON + 1, PIC + 1, FAMILLE + 1, MYEL + 1, MOELLE + 1]}
			sfx={[{name: 'buzz', at: PIC}]}
		/>
	);
};

export const Igs: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('ig', 'trois');
	const ANTI = at('ig', 'anticorps.');
	const G = at('ig', 'nombreuses,');
	const A = at('ig', 'elles,');
	const M = at('ig', 'arrivent');
	const TROP = at('ig', 'trop');
	const on = (t: number) => interpolate(frame, [t - 10, t + 4], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *immunoglobulines*'}
			titleAt={TROIS}
			titleSize={88}
			explain={{text: 'ce sont les anticorps', at: ANTI - 6}}
			art={{
				at: ANTI - 4,
				node: (
					<Live
						render={() => (
							<div style={{display: 'flex', gap: 20, alignItems: 'flex-end'}}>
								<Ig kind="G" size={200} on={on(G - 14)} />
								<Ig kind="A" size={200} on={on(A - 8)} />
								<Ig kind="M" size={200} on={on(M - 10)} />
							</div>
						)}
					/>
				),
			}}
			artY={800}
			chips={[
				{label: 'IgG : les plus nombreuses, sur la durée', at: G - 6},
				{label: 'IgA : nez, bouche, intestin', at: A + 10, tone: LPI.pink},
				{label: 'IgM : en premier', at: M - 4},
				{label: 'trop basses : défenses affaiblies', at: TROP - 2, tone: LPI.navy},
			]}
			punches={[ANTI + 1, G + 1, A + 1, M + 1, TROP + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const CINQ = at('fin', 'cinq');
	const PIC = at('fin', 'pic');
	const TROIS = at('fin', 'trois');
	const LIRE = at('fin', 'lire');
	const PROCH = at('fin', 'prochaine');
	const TROPO = at('fin', 'troponine.');
	return (
		<LabFin
			series={S}
			title={'*Électro* et *Ig*'}
			rows={[
				{t: CINQ, title: '5 bandes', sub: 'albumine · α1 · α2 · β · γ'},
				{t: PIC, title: 'un pic étroit', sub: 'chercher un myélome'},
				{t: TROIS, title: 'IgG · IgA · IgM', sub: 'les anticorps'},
			]}
			check={LIRE}
			next={{at: PROCH, artAt: TROPO - 20, children: <NextTitle pre="le cœur : la " hot="troponine" />}}
		/>
	);
};
