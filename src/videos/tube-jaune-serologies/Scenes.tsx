// « Le tube jaune : les sérologies (1) » (n° 92, série courte du tube jaune, vidéo 15 ; directives Instagram). Accroche :
// vacciné contre l'hépatite B… ou il l'a eue ? 1 · principe (anticorps = trace d'un microbe ou d'un vaccin ; IgM = récent,
// IgG = ancien ou protégé) ; 2 · hépatite B (Ag HBs = virus présent ; anti-HBs seuls = vaccin ; anti-HBs + anti-HBc =
// guéri) + hépatite C (anticorps positifs → recherche de l'ARN du virus) ; 3 · VIH (test combiné anticorps + antigène p24,
// toujours confirmé sur un 2e prélèvement, accord du patient) ; 4 · syphilis (test tréponémique de dépistage, puis test
// non tréponémique (VDRL / RPR) qui dit si l'infection est active).
// Sources : HAS 2016 (VIH : test combiné, confirmation sur un 2e prélèvement) ; HAS 2015 (syphilis : test tréponémique puis
// non tréponémique) ; HAS / AFEF (interprétation des marqueurs de l'hépatite B ; hépatite C : ARN si anticorps positifs).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {Microbe} from '../../brand/hands';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · SÉROLOGIES 1/3', total: 4};

/** Anticorps en Y. */
const Ab: React.FC<{size?: number; tone?: string}> = ({size = 90, tone = LPI.blue}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={N} strokeWidth={18} strokeLinecap="round" fill="none" />
		<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={tone} strokeWidth={10} strokeLinecap="round" fill="none" />
	</svg>
);

/** IgM tôt puis IgG qui restent ; tracé jusqu'à `t` (0 → 1). */
const IgCurves: React.FC<{t: number; g?: number; width?: number}> = ({t, g = 1, width = 740}) => {
	const W = 740;
	const H = 340;
	const X = (x: number) => 50 + x * (W - 90);
	const base = H - 60;
	const m = (x: number) => 0.8 * Math.exp(-((x - 0.2) ** 2) / 0.012);
	const gg = (x: number) => 0.7 / (1 + Math.exp(-(x - 0.38) * 18));
	const xs = Array.from({length: 101}, (_, i) => i / 100).filter((x) => x <= t);
	const path = (f: (x: number) => number) => xs.map((x, i) => `${i ? 'L' : 'M'}${X(x)} ${base - f(x) * (H - 110)}`).join(' ');
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={base} x2={W - 30} y2={base} stroke={N} strokeWidth={6} strokeLinecap="round" />
			<text x={X(0.02)} y={H - 18} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>contact</text>
			<text x={X(0.98)} y={H - 18} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>des mois, des années</text>
			<path d={path(m)} fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
			{t > 0.25 && <text x={X(0.2)} y={base - 0.8 * (H - 110) - 16} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>IgM</text>}
			<path d={path(gg)} fill="none" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" opacity={g} />
			{t > 0.7 && <text x={X(0.85)} y={base - 0.7 * (H - 110) - 16} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N} opacity={g}>IgG</text>}
		</svg>
	);
};

/** Tableau de l'hépatite B : 3 profils ; `row` = profil allumé (0 virus, 1 vacciné, 2 guéri). */
const HbTable: React.FC<{row: number; width?: number}> = ({row, width = 860}) => {
	const cols = ['Ag HBs', 'anti-HBs', 'anti-HBc'];
	const rows: {name: string; v: boolean[]; tone: string}[] = [
		{name: 'virus présent', v: [true, false, true], tone: LPI.pink},
		{name: 'vacciné', v: [false, true, false], tone: LPI.sky},
		{name: 'guéri', v: [false, true, true], tone: LPI.sky},
	];
	return (
		<div style={{width, fontFamily: FONT.title, fontWeight: 900, color: N}}>
			<div style={{display: 'grid', gridTemplateColumns: '230px 1fr 1fr 1fr', gap: 10, fontSize: 32, textAlign: 'center', marginBottom: 10}}>
				<div />
				{cols.map((c) => (
					<div key={c}>{c}</div>
				))}
			</div>
			{rows.map((r, i) => {
				const on = row >= i;
				const hot = Math.floor(row) === i;
				return (
					<div key={r.name} style={{display: 'grid', gridTemplateColumns: '230px 1fr 1fr 1fr', gap: 10, alignItems: 'center', marginBottom: 12, opacity: on ? 1 : 0.18, transform: `scale(${hot ? 1.03 : 1})`}}>
						<div style={{fontSize: 34, background: hot ? r.tone : LPI.paper, border: `5px solid ${N}`, borderRadius: 22, padding: '12px 10px', textAlign: 'center'}}>{r.name}</div>
						{r.v.map((x, k) => (
							<div key={k} style={{height: 74, borderRadius: 22, border: `5px solid ${N}`, background: x ? alpha(r.tone, 0.9) : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50}}>
								{x ? '+' : '–'}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};

/** Deux prélèvements : le 1er positif, le 2e confirme. */
const TwoTests: React.FC<{a: string; b: string; second: number; size?: number}> = ({a, b, second, size = 1}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 40, transform: `scale(${size})`}}>
		{[a, b].map((label, i) => (
			<div key={label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: i === 0 ? 1 : 0.15 + 0.85 * second}}>
				<Tube cap={CAP.gel} size={95} level={0.7} serum={1} gel />
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, textAlign: 'center', width: 220}}>{label}</div>
			</div>
		))}
		<div style={{position: 'absolute'}} />
	</div>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const VACC = at('intro', 'vacciné');
	const EUE = at('intro', 'eue ?');
	const SERO = at('intro', 'sérologie');
	const HEP = at('intro', 'hépatites,');
	const VIH = at('intro', 'vih,');
	const SYPH = at('intro', 'syphilis :');
	const LIRE = at('intro', 'lire.');
	const row = frame < EUE - 4 ? 1 : 2;
	return (
		<LabHook
			series={S}
			title={'Les *sérologies*\ndans le tube *jaune*'}
			titleSize={92}
			art={<Live render={() => <div style={{transform: 'scale(0.62)'}}><HbTable row={row} width={860} /></div>} />}
			chips={[
				{label: 'hépatites', at: HEP - 2},
				{label: 'VIH', at: VIH - 2, tone: LPI.pink},
				{label: 'syphilis', at: SYPH - 2},
			]}
			notes={[
				{text: 'vacciné… ou guéri ?', at: VACC - 4},
				{text: 'voici comment les lire', at: LIRE - 14},
			]}
			punches={[VACC + 1, EUE + 1, SERO + 1, HEP + 1, VIH + 1, SYPH + 1]}
		/>
	);
};

export const Principe: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('principe', 'un');
	const ANTI = at('principe', 'anticorps,');
	const MICROBE = at('principe', 'microbe,');
	const VACCIN = at('principe', 'vaccin.');
	const M = at('principe', 'm');
	const RECENT = at('principe', 'récent.');
	const ANCIEN = at('principe', 'ancien,');
	const PROT = at('principe', 'protégé.');
	const t = interpolate(frame, [M - 14, RECENT + 6, ANCIEN - 20, PROT], [0, 0.32, 0.32, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *principe*'}
			titleAt={UN}
			explain={{text: 'on cherche les anticorps', at: ANTI - 6}}
			art={{
				at: ANTI - 4,
				node: (
					<Live
						render={(f) =>
							f < M - 14 ? (
								<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
									<Ab size={150} />
									<div style={{fontSize: 70, fontWeight: 900, color: N}}>→</div>
									<div style={{opacity: f >= MICROBE - 6 ? 1 : 0.15}}><Microbe size={130} tone={LPI.pink} /></div>
									<div style={{opacity: f >= VACCIN - 6 ? 1 : 0.15, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>ou vaccin</div>
								</div>
							) : (
								<IgCurves t={t} width={720} />
							)
						}
					/>
				),
			}}
			artY={790}
			chips={[
				{label: 'IgM : récent', at: RECENT - 6, tone: LPI.pink},
				{label: 'IgG : ancien ou protégé', at: ANCIEN - 4},
			]}
			punches={[ANTI + 1, MICROBE + 1, VACCIN + 1, RECENT + 1, ANCIEN + 1, PROT + 1]}
		/>
	);
};

export const Hepb: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('hepb', 'deux');
	const AG = at('hepb', "l'antigène");
	const VAC = at('hepb', 'vaccin.');
	const ANTIC = at('hepb', 'c :');
	const GUERI = at('hepb', 'guéri.');
	const HEPC = at('hepb', 'c,');
	const LUI = at('hepb', 'lui-même.');
	const row = frame < at('hepb', 'anticorps') - 6 ? 0 : frame < ANTIC - 8 ? 1 : 2;
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={"*L'hépatite* *B*"}
			titleAt={DEUX}
			pink
			explain={{text: 'trois marqueurs à croiser', at: AG - 6}}
			art={{at: AG - 4, node: <Live render={() => <HbTable row={frame < AG - 4 ? -1 : row} width={860} />} />}}
			artY={820}
			chips={[
				{label: 'hépatite C : anticorps + → on cherche le virus', at: HEPC - 6, tone: LPI.navy},
			]}
			punches={[AG + 1, VAC + 1, ANTIC + 1, GUERI + 1, HEPC + 1, LUI + 1]}
		/>
	);
};

export const Vih: React.FC = () => {
	const TROIS = at('vih', 'trois');
	const COMB = at('vih', 'combiné');
	const MORCEAU = at('vih', 'morceau');
	const POS = at('vih', 'positif,');
	const DEUX = at('vih', 'deuxième');
	const ACCORD = at('vih', "l'accord");
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *VIH*'}
			titleAt={TROIS}
			explain={{text: 'test combiné : anticorps + morceau du virus', at: COMB - 6}}
			art={{at: POS - 6, node: <Live render={(f) => <TwoTests a="1er : positif" b="2e : confirme" second={interpolate(f, [DEUX - 6, DEUX + 6], [0, 1], clamp)} />} />}}
			artY={850}
			chips={[
				{label: 'toujours confirmé sur un 2e prélèvement', at: DEUX - 6, tone: LPI.pink},
				{label: "avec l'accord du patient", at: ACCORD - 2, tone: LPI.navy},
			]}
			punches={[COMB + 1, MORCEAU + 1, POS + 1, DEUX + 1, ACCORD + 1]}
		/>
	);
};

export const Syphilis: React.FC = () => {
	const QUATRE = at('syphilis', 'quatre');
	const PREMIER = at('syphilis', 'premier');
	const POS = at('syphilis', 'positif,');
	const SECOND = at('syphilis', 'second');
	const ACTIVE = at('syphilis', 'active.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'La *syphilis*'}
			titleAt={QUATRE}
			pink
			explain={{text: 'deux tests, l’un après l’autre', at: PREMIER - 6}}
			art={{at: PREMIER - 4, node: <Live render={(f) => <TwoTests a="1er : dépiste" b="2e : active ?" second={interpolate(f, [SECOND - 6, SECOND + 6], [0, 1], clamp)} />} />}}
			artY={850}
			chips={[
				{label: 's’il est positif…', at: POS - 4},
				{label: "le 2e dit si l'infection est active", at: ACTIVE - 14, tone: LPI.navy},
			]}
			punches={[PREMIER + 1, POS + 1, SECOND + 1, ACTIVE + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const REC = at('fin', 'récent,');
	const ANC = at('fin', 'ancien,');
	const CONF = at('fin', 'confirmation.');
	const PROCH = at('fin', 'prochaine');
	const GROS = at('fin', 'grossesse.');
	return (
		<LabFin
			series={S}
			title={'*Sérologies* · 1/3'}
			rows={[
				{t: REC, title: 'IgM', sub: 'contact récent'},
				{t: ANC, title: 'IgG', sub: 'ancien ou protégé'},
				{t: CONF - 10, title: 'hépatite B · VIH · syphilis', sub: 'toujours confirmer'},
			]}
			check={CONF}
			next={{at: PROCH, artAt: GROS - 6, children: <NextTitle pre="les sérologies de la " hot="grossesse" />}}
		/>
	);
};
