// « Le tube jaune : les hormones (1) » (n° 90, série courte du tube jaune, vidéo 13 ; directives Instagram). Accroche :
// fatigue, prise de poids, frilosité… ou cœur qui s'emballe ? 1 · TSH (hypophyse, chef d'orchestre de la thyroïde ; varie
// à l'envers : haute = hypothyroïdie, basse = hyperthyroïdie ; ≈ 0,4 – 4 mUI/L) ; 2 · cortisol (surrénales, hormone du
// stress, cycle jour / nuit : prélèvement à 8 h, heure notée sur le tube) ; 3 · prolactine (allaitement ; trop haute hors
// grossesse : arrêt des règles, écoulement de lait ; médicaments, stress : prélever au calme, au repos).
// Sources : HAS 2022 (hypothyroïdie : la TSH en 1re intention, normes ≈ 0,4 – 4 mUI/L selon les laboratoires) ; Société
// française d'endocrinologie (cortisol à 8 h ; hyperprolactinémie : prélèvement au repos, médicaments à rechercher).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {BrainIcon} from '../../brand/diabetes';
import {PillIcon, ShiverIcon, StressIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {Bottle} from '../../brand/kids';
import {Heart} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES HORMONES 1/2', total: 3};

/** Thyroïde en papillon ; `act` : −1 (lente, pâle) → 1 (emballée, rose vif). */
const Thyroid: React.FC<{size?: number; act?: number}> = ({size = 200, act = 0}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + (act > 0 ? 0.06 * act * Math.sin(frame / 2) : 0);
	const fill = act >= 0 ? LPI.pink : alpha(LPI.pink, 0.5 + 0.5 * (1 + act));
	return (
		<svg width={size} height={size * 0.7} viewBox="-100 -70 200 140" style={{overflow: 'visible', transform: `scale(${pulse})`}}>
			<path d="M-8 -10 C-30 -60 -90 -50 -88 0 C-86 50 -30 55 -8 20 Z" fill={fill} stroke={N} strokeWidth={6} />
			<path d="M8 -10 C30 -60 90 -50 88 0 C86 50 30 55 8 20 Z" fill={fill} stroke={N} strokeWidth={6} />
			<rect x={-14} y={-14} width={28} height={36} rx={10} fill={fill} stroke={N} strokeWidth={6} />
		</svg>
	);
};

/** Deux jauges qui varient à l'envers : TSH et thyroïde ; `k` : −1 (TSH haute) → 1 (TSH basse). */
const Inverse: React.FC<{k: number; width?: number}> = ({k, width = 700}) => {
	const W = 700;
	const H = 420;
	const tsh = 0.5 - 0.38 * k;
	const thy = 0.5 + 0.38 * k;
	const bar = (x: number, v: number, label: string, tone: string) => (
		<g>
			<rect x={x} y={60} width={130} height={280} rx={24} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={x + 10} y={60 + 10 + (1 - v) * 260} width={110} height={v * 260} rx={16} fill={tone} />
			<text x={x + 65} y={395} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>{label}</text>
		</g>
	);
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			{bar(120, tsh, 'TSH', LPI.blue)}
			{bar(450, thy, 'thyroïde', LPI.pink)}
			<path d="M290 160 C330 120 380 120 420 160 M410 140 l12 22 -24 4" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
			<path d="M420 250 C380 290 330 290 290 250 M300 272 l-12 -22 24 -4" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
		</svg>
	);
};

/** Cortisol sur 24 h : pic le matin, creux le soir ; repère à 8 h. */
const DayCurve: React.FC<{t: number; mark?: number; width?: number}> = ({t, mark = 0, width = 740}) => {
	const W = 740;
	const H = 340;
	const X = (h: number) => 50 + (h / 24) * (W - 90);
	const v = (h: number) => 0.12 + 0.8 * Math.exp(-((h - 8) ** 2) / (h < 8 ? 8 : 40));
	const Y = (h: number) => H - 60 - Math.min(1, v(h)) * (H - 110);
	const hs = Array.from({length: 97}, (_, i) => i / 4).filter((h) => h <= t * 24);
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={H - 60} x2={W - 30} y2={H - 60} stroke={N} strokeWidth={6} strokeLinecap="round" />
			{[0, 8, 16, 24].map((h) => (
				<text key={h} x={X(h)} y={H - 18} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>{h} h</text>
			))}
			<circle cx={X(8)} cy={Y(8)} r={22 * mark} fill={alpha(LPI.pink, 0.6)} stroke={N} strokeWidth={4 * mark} />
			<path d={hs.map((h, i) => `${i ? 'L' : 'M'}${X(h)} ${Y(h)}`).join(' ')} fill="none" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const FAT = at('intro', 'fatigue,');
	const FROID = at('intro', 'froid…');
	const COEUR = at('intro', 'cœur');
	const TROIS = at('intro', 'trois');
	const CONN = at('intro', 'connais ?');
	const act = frame < COEUR - 4 ? interpolate(frame, [FAT, FROID], [0, -1], clamp) : interpolate(frame, [COEUR - 4, COEUR + 10], [-1, 1], clamp);
	return (
		<LabHook
			series={S}
			title={'Les *hormones*\ndans le tube *jaune*'}
			titleSize={92}
			art={
				<Live
					render={(f) => (
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<Thyroid size={280} act={act} />
							<div style={{display: 'flex', gap: 30, alignItems: 'center', height: 110}}>
								<div style={{opacity: f >= FROID - 6 && f < COEUR - 4 ? 1 : 0.15}}><ShiverIcon size={100} /></div>
								<div style={{opacity: f >= COEUR - 4 ? 1 : 0.15}}><Heart size={100} beat={Math.max(0, Math.sin(f / 2.5))} /></div>
							</div>
						</div>
					)}
				/>
			}
			chips={[
				{label: 'TSH', at: TROIS},
				{label: 'cortisol', at: TROIS + 6, tone: LPI.pink},
				{label: 'prolactine', at: TROIS + 12},
			]}
			notes={[{text: 'tu les connais ?', at: CONN - 6}]}
			punches={[FAT + 1, FROID + 1, COEUR + 1, TROIS + 1]}
		/>
	);
};

export const Tsh: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('tsh', 'un');
	const CHEF = at('tsh', 'chef');
	const CERV = at('tsh', 'cerveau.');
	const ENVERS = at('tsh', "l'envers.");
	const HAUTE = at('tsh', 'haute,');
	const HYPO = at('tsh', "l'hypothyroïdie.");
	const BASSE = at('tsh', 'basse,');
	const HYPER = at('tsh', "l'hyperthyroïdie.");
	const NORME = at('tsh', 'norme');
	const k = frame < BASSE - 4 ? interpolate(frame, [HAUTE - 4, HAUTE + 12], [0, -1], clamp) : interpolate(frame, [BASSE - 4, BASSE + 12], [-1, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La *TSH*'}
			titleAt={UN}
			explain={{text: 'le chef d’orchestre de la thyroïde', at: CHEF - 4}}
			art={{
				at: CHEF,
				node: (
					<Live
						render={(f) =>
							f < ENVERS - 6 ? (
								<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
									<div style={{opacity: f >= CERV - 8 ? 1 : 0.2}}><BrainIcon size={150} /></div>
									<div style={{fontSize: 70, fontWeight: 900, color: N}}>→</div>
									<Thyroid size={220} />
								</div>
							) : (
								<Inverse k={k} width={600} />
							)
						}
					/>
				),
			}}
			artY={800}
			norm={{rows: [['', '≈ 0,4 – 4 mUI/L']], at: NORME - 4, y: 1100}}
			chips={[
				{label: 'elle varie à l’envers', at: ENVERS - 4, tone: LPI.navy},
				{label: 'TSH haute : hypothyroïdie', at: HYPO - 10},
				{label: 'TSH basse : hyperthyroïdie', at: HYPER - 10, tone: LPI.pink},
			]}
			punches={[CHEF + 1, CERV + 1, ENVERS + 1, HAUTE + 1, BASSE + 1, NORME + 1]}
		/>
	);
};

export const Cortisol: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('cortisol', 'deux');
	const STRESS = at('cortisol', 'stress,');
	const SURR = at('cortisol', 'surrénales.');
	const MATIN = at('cortisol', 'matin');
	const SOIR = at('cortisol', 'soir :');
	const HUIT = at('cortisol', 'huit');
	const NOTE = at('cortisol', 'note');
	const t = interpolate(frame, [MATIN - 20, SOIR + 10], [0, 1], clamp);
	const mark = interpolate(frame, [HUIT - 4, HUIT + 8], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *cortisol*'}
			titleAt={DEUX}
			pink
			explain={{text: "l'hormone du stress (surrénales)", at: STRESS - 6}}
			art={{
				at: STRESS - 4,
				node: <Live render={(f) => (f < MATIN - 20 ? <StressIcon size={200} /> : <DayCurve t={t} mark={mark} width={720} />)} />,
			}}
			artY={790}
			chips={[
				{label: 'au plus haut le matin', at: MATIN - 4},
				{label: 'prélevé à 8 h', at: HUIT - 2, tone: LPI.pink},
				{label: "l'heure notée sur le tube", at: NOTE - 2, tone: LPI.navy},
			]}
			punches={[STRESS + 1, SURR + 1, MATIN + 1, SOIR + 1, HUIT + 1, NOTE + 1]}
		/>
	);
};

export const Prolactine: React.FC = () => {
	const TROIS = at('prolactine', 'trois');
	const ALLAIT = at('prolactine', "l'allaitement.");
	const HAUTE = at('prolactine', 'haute,');
	const REGLES = at('prolactine', 'règles');
	const LAIT = at('prolactine', 'lait.');
	const MED = at('prolactine', 'médicaments');
	const STRESS = at('prolactine', 'stress');
	const CALME = at('prolactine', 'calme,');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'La *prolactine*'}
			titleAt={TROIS}
			explain={{text: "l'hormone de l'allaitement", at: ALLAIT - 8}}
			art={{
				at: ALLAIT - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<Bottle width={130} level={0.75} />
								<div style={{opacity: f >= MED - 6 ? 1 : 0}}><PillIcon size={130} /></div>
								<div style={{opacity: f >= STRESS - 6 ? 1 : 0}}><StressIcon size={130} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'trop haute : règles qui s’arrêtent', at: REGLES - 8, tone: LPI.pink},
				{label: 'du lait qui coule', at: LAIT - 6},
				{label: 'médicaments, stress : elle monte', at: STRESS - 4, tone: LPI.navy},
				{label: 'prélevée au calme, au repos', at: CALME - 4},
			]}
			punches={[ALLAIT + 1, HAUTE + 1, REGLES + 1, LAIT + 1, MED + 1, STRESS + 1, CALME + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const TSH = at('fin', "l'envers,");
	const CORT = at('fin', 'cortisol');
	const PROL = at('fin', 'prolactine');
	const CALME = at('fin', 'calme.');
	const PROCH = at('fin', 'prochaine');
	const GROS = at('fin', 'grossesse');
	return (
		<LabFin
			series={S}
			title={'*Hormones* · 1/2'}
			pink
			rows={[
				{t: TSH - 10, title: 'TSH', sub: 'à l’envers · ≈ 0,4 – 4 mUI/L'},
				{t: CORT, title: 'cortisol', sub: 'prélevé à 8 h, heure notée'},
				{t: PROL, title: 'prolactine', sub: 'au calme, au repos'},
			]}
			check={CALME}
			next={{at: PROCH, artAt: GROS, children: <NextTitle pre="les hormones de la " hot="grossesse" />}}
		/>
	);
};
