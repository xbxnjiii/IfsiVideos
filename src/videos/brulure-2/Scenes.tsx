// Scènes de « Brûlure du 2e degré ». Accroche sans texte, réaliste : on égoutte les pâtes, l'eau bouillante éclabousse
// l'avant-bras, quelques minutes plus tard des cloques. Puis les deux sortes : superficiel (haut du derme ; rouge,
// suintant, très douloureux, phlyctènes ; ≈ 2 semaines) et profond (derme profond ; pâle, cloques molles, peu
// douloureux ; > 3 semaines, séquelles, greffe), chute.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {BurnPatch, CUT_Y, CutView, PastaPour, SkinClose, skinClosePt} from '../../brand/burnstage';
import {DayChip} from '../../brand/injury';
import {Burst} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Chip} from '../brulure-1/Scenes';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Traits de douleur autour d'un point (de `t0` à `t0 + 26`). */
const Pain: React.FC<{t0: number; x: number; y: number; r?: number}> = ({t0, x, y, r = 120}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= t0 + 26) return null;
	const k = (frame - t0) / 26;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			{[0, 1, 2, 3, 4].map((i) => {
				const a = -1.8 + i * 0.6;
				return <line key={i} x1={x + Math.cos(a) * (r + k * 40)} y1={y + Math.sin(a) * (r + k * 40)} x2={x + Math.cos(a) * (r + 60 + k * 60)} y2={y + Math.sin(a) * (r + 60 + k * 60)} stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" opacity={1 - k} />;
			})}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : LES PÂTES ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const EGOUTTES = at('intro', 'égouttes');
	const ECLABOUSSE = at('intro', 'éclabousse');
	const BRAS = at('intro', 'bras.');
	const MINUTES = at('intro', 'minutes');
	const CLOQUES = at('intro', 'cloques');
	const APPARAISSENT = at('intro', 'apparaissent.');
	const tilt = lin(frame, EGOUTTES - 6, EGOUTTES + 26);
	const splash = interpolate(frame, [ECLABOUSSE - 4, BRAS + 4], [0, 1], clamp);
	const jerk = frame >= BRAS && frame < BRAS + 20 ? Math.sin(((frame - BRAS) / 20) * Math.PI) : 0;
	const close = lin(frame, MINUTES - 10, MINUTES + 6);
	const k = interpolate(frame, [MINUTES, CLOQUES, APPARAISSENT + 24], [0.15, 0.4, 1], clamp);
	return (
		<AbsoluteFill>
			{close < 1 ? (
				<AbsoluteFill style={{opacity: 1 - close, transform: `scale(${1 + 0.6 * close})`, transformOrigin: '200px 920px'}}>
					<PastaPour tilt={tilt} splash={splash} jerk={jerk} />
				</AbsoluteFill>
			) : null}
			{close > 0 ? (
				<AbsoluteFill style={{opacity: close}}>
					<SkinClose>
						<BurnPatch deg={2} k={k} />
					</SkinClose>
				</AbsoluteFill>
			) : null}
			<Pain t0={BRAS} x={150} y={930} />
			<Sfx name="tap" at={EGOUTTES} volume={0.1} dur={40} />
			<Sfx name="hiss" at={ECLABOUSSE} volume={0.08} />
			<Sfx name="stamp" at={BRAS} volume={0.06} />
			<Sfx name="pop" at={CLOQUES} volume={0.05} />
		</AbsoluteFill>
	);
};

/** Deux pastilles « superficiel » / « profond ». */
const TwoKinds: React.FC<{at: number; on?: 0 | 1 | -1}> = ({at: t0, on = -1}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const pill = (t: string, i: number) => (
		<div key={t} style={{padding: '14px 30px', borderRadius: 999, border: `6px solid ${N}`, background: on === i ? (i ? LPI.pink : LPI.sky) : LPI.paper, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, opacity: on === -1 || on === i ? 1 : 0.45, transform: `scale(${popAt(frame, t0 + i * 6)})`}}>
			{t}
		</div>
	);
	return <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 24}}>{[pill('superficiel', 0), pill('profond', 1)]}</div>;
};

/* ═══════════════════════════════ DEUX SORTES ; LE SUPERFICIEL TOUCHE LE HAUT DU DERME ═══════════════════════════════ */
export const Couche: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUXIEME = at('couche', 'deuxième');
	const DEUX = at('couche', 'deux');
	const SUPERFICIEL = at('couche', 'superficiel');
	const DERME = at('couche', 'derme,');
	const SOUS = at('couche', 'sous');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={DEUXIEME - 6} text={'*2e* degré'} size={120} y={190} center />
			<TwoKinds at={DEUX - 4} on={frame >= SUPERFICIEL - 4 ? 0 : -1} />
			{frame >= SUPERFICIEL - 6 ? (
				<AbsoluteFill style={{opacity: fadeIn(frame, SUPERFICIEL - 6, 10)}}>
					<CutView y0={CUT_Y.top} y1={CUT_Y.dermMid} k={lin(frame, DERME - 8, DERME + 10)} labels={3} focus={1} />
				</AbsoluteFill>
			) : null}
			{frame >= SOUS - 4 ? (
				<Note at={SOUS - 4} y={1400} size={48} tone={LPI.pink}>
					le haut du derme
				</Note>
			) : null}
			<Sfx name="whoosh" at={DEUXIEME - 6} volume={0.05} />
			<Sfx name="pop" at={DEUX - 4} volume={0.08} />
			<Sfx name="pop" at={DERME} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE SUPERFICIEL : ROUGE, SUINTANT, TRÈS DOULOUREUX, PHLYCTÈNES ═══════════════════════════════ */
export const Superficiel: React.FC = () => {
	const frame = useCurrentFrame();
	const ROUGE = at('superficiel', 'rouge,');
	const SUINTE = at('superficiel', 'suinte,');
	const MAL = at('superficiel', 'mal…');
	const CLOQUES = at('superficiel', 'cloques');
	const PHLYC = at('superficiel', 'phlyctènes.');
	const SEMAINES = at('superficiel', 'semaines');
	const CICATRICE = at('superficiel', 'cicatrice.');
	const p = (x: number, y: number) => skinClosePt(x, y);
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={2} k={1} />
			</SkinClose>
			<TwoKinds at={0} on={0} />
			<PointTag at={ROUGE - 2} to={PHLYC - 6} x={250} y={560} px={p(360, 420).x} py={p(360, 420).y} size={46} tone={LPI.paper}>
				rouge
			</PointTag>
			<PointTag at={SUINTE - 2} to={PHLYC - 6} x={830} y={600} px={p(600, 450).x} py={p(600, 450).y} size={46} tone={LPI.paper}>
				suintante
			</PointTag>
			<Pain t0={MAL - 4} x={p(500, 500).x} y={p(500, 500).y} r={300} />
			<PointTag at={CLOQUES - 2} x={330} y={1480} px={p(440, 500).x} py={p(440, 500).y} size={46} tone={LPI.sky}>
				cloques au liquide clair
			</PointTag>
			<Big from={PHLYC - 6} to={SEMAINES - 6} text={'Des *phlyctènes*'} size={96} y={170} center />
			{frame >= SEMAINES - 6 ? (
				<div style={{position: 'absolute', left: 860 - 100, top: 1290, transform: `scale(${popAt(frame, SEMAINES - 6)})`}}>
					<DayChip text="2 sem." size={200} />
				</div>
			) : null}
			<Chip at={CICATRICE - 6} x={650} y={1640}>
				sans grosse cicatrice
			</Chip>
			{[ROUGE - 2, SUINTE - 2, CLOQUES - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="stamp" at={MAL - 4} volume={0.06} />
			<Sfx name="ding" at={CICATRICE} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PROFOND : DERME EN PROFONDEUR ; PÂLE, CLOQUES MOLLES, PEU DOULOUREUX ═══════════════════════════════ */
export const Profond: React.FC = () => {
	const frame = useCurrentFrame();
	const PROFOND = at('profond', 'profond,');
	const PROFONDEUR = at('profond', 'profondeur.');
	const SOUS = at('profond', 'sous');
	const MOLLES = at('profond', 'molles,');
	const PALE = at('profond', 'pâle,');
	const PEU = at('profond', 'peu');
	const NERFS = at('profond', 'nerfs');
	const swap = lin(frame, SOUS - 10, SOUS + 4);
	const p = (x: number, y: number) => skinClosePt(x, y);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			{swap < 1 ? (
				<AbsoluteFill style={{opacity: 1 - swap}}>
					<CutView y0={CUT_Y.top} y1={CUT_Y.derm} k={lin(frame, PROFONDEUR - 10, PROFONDEUR + 12)} labels={3} focus={1} nerves={1} nervesBurnt={fadeIn(frame, PROFONDEUR + 4, 12)} />
				</AbsoluteFill>
			) : null}
			{swap > 0 ? (
				<AbsoluteFill style={{opacity: swap}}>
					<SkinClose>
						<BurnPatch deg={2.5} k={1} />
					</SkinClose>
				</AbsoluteFill>
			) : null}
			<TwoKinds at={0} on={frame >= PROFOND - 6 ? 1 : 0} />
			<PointTag at={MOLLES - 4} x={270} y={600} px={p(450, 470).x} py={p(450, 470).y} size={46} tone={LPI.paper}>
				cloques molles
			</PointTag>
			<PointTag at={PALE - 2} x={820} y={1480} px={p(520, 560).x} py={p(520, 560).y} size={46} tone={LPI.paper}>
				pâle, presque blanche
			</PointTag>
			<Chip at={PEU - 4} x={650} y={1600} ok={false}>
				peu de douleur
			</Chip>
			<Chip at={NERFS - 4} x={650} y={1740} ok={false}>
				nerfs abîmés
			</Chip>
			<Sfx name="whoosh" at={PROFOND - 6} volume={0.05} />
			<Sfx name="pop" at={MOLLES - 4} volume={0.07} />
			<Sfx name="pop" at={PALE - 2} volume={0.07} />
			<Sfx name="stamp" at={PEU - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ ÉVOLUTION DU PROFOND : LENTE, SÉQUELLES, GREFFE ═══════════════════════════════ */
export const Evolution: React.FC = () => {
	const frame = useCurrentFrame();
	const LENTEMENT = at('evolution', 'lentement,');
	const TROIS = at('evolution', 'trois');
	const SEQUELLES = at('evolution', 'séquelles…');
	const GREFFER = at('evolution', 'greffer');
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={2.5} k={1} heal={0.25 * lin(frame, LENTEMENT, GREFFER)} />
			</SkinClose>
			<Big from={0} text={'Plus de *3* *semaines*'} size={110} y={170} center />
			{frame >= TROIS - 6 ? (
				<div style={{position: 'absolute', left: 540 - 110, top: 1240, transform: `scale(${popAt(frame, TROIS - 6)})`}}>
					<DayChip text="3 sem." size={240} />
				</div>
			) : null}
			<Chip at={SEQUELLES - 4} x={650} y={1580} ok={false}>
				séquelles
			</Chip>
			<Chip at={GREFFER - 4} x={650} y={1730} ok={false}>
				greffe
			</Chip>
			<Sfx name="tick" at={TROIS} volume={0.08} />
			<Sfx name="pop" at={SEQUELLES - 4} volume={0.07} />
			<Sfx name="stamp" at={GREFFER - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : PLUS ÇA FAIT MAL… MOINS C'EST GRAVE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const DOULOUREUSE = at('fin', 'douloureuse,');
	const SUPERFICIEL = at('fin', 'superficiel.');
	const PRESQUE = at('fin', 'presque');
	const GRAVE = at('fin', 'grave !');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={0} text={'*Retiens* bien'} size={110} y={240} center />
			<RowCard at={DOULOUREUSE - 4} y={560} h={220} art={0} badge="1" badgeTone={LPI.sky} title="Très douloureuse" sub="→ superficiel" subAt={SUPERFICIEL - 4} size={56} />
			<RowCard at={PRESQUE - 4} y={820} h={220} art={0} badge="2" title="Presque plus de douleur" sub="→ plus grave !" subAt={GRAVE - 6} from="left" size={56} />
			<Burst at={GRAVE + 2} x={540} y={930} r={280} n={12} />
			<Sfx name="pop" at={DOULOUREUSE - 4} volume={0.08} />
			<Sfx name="pop" at={PRESQUE - 4} volume={0.08} />
			<Sfx name="stamp" at={GRAVE} volume={0.08} />
		</AbsoluteFill>
	);
};
