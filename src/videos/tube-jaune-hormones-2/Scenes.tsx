// « Le tube jaune : les hormones (2) » (n° 91, série courte du tube jaune, vidéo 14 ; directives Instagram). Accroche :
// avant un scanner chez une jeune femme, est-elle enceinte ? 1 · β-hCG (placenta ; détectables dans le sang ≈ 10 jours
// après la fécondation, avant le retard de règles ; doublent ≈ toutes les 48 h au début) ; 2 · FSH et LH (hypophyse,
// commandent ovaires et testicules ; dosées en début de cycle (J2 – J5) ; très hautes après la ménopause) ; 3 · progestérone
// (après l'ovulation, prépare l'utérus ; ≈ J21 d'un cycle de 28 jours : preuve de l'ovulation) ; 4 · testostérone
// (hormone masculine, aussi chez la femme ; prélevée le matin, pic matinal).
// Sources : CNGOF (bilan hormonal de la fertilité, J2 – J5, progestérone J21) ; HAS (β-hCG plasmatiques, cinétique) ;
// Société française d'endocrinologie (testostérone le matin, entre 7 h et 11 h).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {SunIcon} from '../../brand/burnstage';
import {BrainIcon, MomToBe} from '../../brand/diabetes';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {MuscleArm} from '../../brand/renal';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES HORMONES 2/2', total: 4};

/** β-hCG qui doublent : barres J0, J2, J4, J6 ; `n` barres visibles. */
const Doubling: React.FC<{n: number; width?: number}> = ({n, width = 640}) => {
	const W = 640;
	const H = 360;
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={H - 60} x2={W - 30} y2={H - 60} stroke={N} strokeWidth={6} strokeLinecap="round" />
			{[1, 2, 4, 8].map((v, i) => {
				const on = clamp01(n - i);
				const h = v * 32 * on;
				return (
					<g key={i}>
						<rect x={80 + i * 140} y={H - 60 - h} width={100} height={h} rx={14} fill={i === 3 ? LPI.pink : LPI.sky} stroke={N} strokeWidth={5} opacity={on > 0 ? 1 : 0} />
						<text x={130 + i * 140} y={H - 18} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={N}>J{i * 2}</text>
						{i > 0 && on > 0.5 && <text x={130 + i * 140} y={H - 74 - h} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>×2</text>}
					</g>
				);
			})}
		</svg>
	);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Cycle de 28 jours : FSH / LH tôt (J2 – J5), pic de LH à J14, progestérone qui monte ensuite ; `t` (0 → 1) et `mark` (J3 ou J21). */
const Cycle: React.FC<{t: number; mark?: 'start' | 'j21' | null; prog?: number; width?: number}> = ({t, mark = null, prog = 0, width = 760}) => {
	const W = 760;
	const H = 360;
	const X = (d: number) => 50 + (d / 28) * (W - 90);
	const base = H - 70;
	const lh = (d: number) => 0.15 + 0.75 * Math.exp(-((d - 14) ** 2) / 1.5);
	const pg = (d: number) => (d < 14 ? 0.05 : 0.05 + 0.75 * Math.exp(-((d - 21) ** 2) / 14));
	const days = Array.from({length: 113}, (_, i) => i / 4).filter((d) => d <= t * 28);
	const path = (f: (d: number) => number) => days.map((d, i) => `${i ? 'L' : 'M'}${X(d)} ${base - f(d) * (H - 120)}`).join(' ');
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			{mark === 'start' && <rect x={X(2)} y={30} width={X(5) - X(2)} height={base - 30} rx={10} fill={alpha(LPI.pink, 0.45)} />}
			{mark === 'j21' && <rect x={X(20)} y={30} width={X(22) - X(20)} height={base - 30} rx={10} fill={alpha(LPI.pink, 0.45)} />}
			<line x1={40} y1={base} x2={W - 30} y2={base} stroke={N} strokeWidth={6} strokeLinecap="round" />
			{[1, 14, 21, 28].map((d) => (
				<text key={d} x={X(d)} y={H - 28} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>J{d}</text>
			))}
			<path d={path(lh)} fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
			{prog > 0 && <path d={path(pg)} fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" opacity={prog} />}
			<text x={X(10)} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={LPI.blue}>LH</text>
			{prog > 0 && <text x={X(24.5)} y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N} opacity={prog}>progestérone</text>}
		</svg>
	);
};

export const Hook: React.FC = () => {
	const SCAN = at('intro', 'scanner');
	const ENC = at('intro', 'enceinte ?');
	const SANG = at('intro', 'sang');
	const GROS = at('intro', 'grossesse');
	const FERT = at('intro', 'fertilité.');
	return (
		<LabHook
			series={S}
			title={'Les *hormones*\nde la *grossesse*'}
			titleSize={92}
			art={<Live render={(f) => <MomToBe width={240} belly={interpolate(f, [ENC - 6, ENC + 16], [0, 1], clamp)} mood="calme" />} />}
			chips={[
				{label: 'β-hCG', at: GROS - 4},
				{label: 'FSH · LH', at: GROS + 2, tone: LPI.pink},
				{label: 'progestérone', at: FERT - 6},
				{label: 'testostérone', at: FERT, tone: LPI.pink},
			]}
			notes={[
				{text: 'avant un scanner…', at: SCAN - 6},
				{text: 'est-elle enceinte ?', at: ENC - 4},
			]}
			punches={[SCAN + 1, ENC + 1, SANG + 1, GROS + 1, FERT + 1]}
			shakes={[ENC + 2]}
		/>
	);
};

export const Hcg: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('hcg', 'un');
	const GROS = at('hcg', 'grossesse,');
	const PLAC = at('hcg', 'placenta.');
	const DIX = at('hcg', 'dix');
	const RETARD = at('hcg', 'retard');
	const DOUBLE = at('hcg', 'double');
	const n = interpolate(frame, [DOUBLE - 14, DOUBLE + 30], [0.5, 4], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Les *β-hCG*'}
			titleAt={UN}
			explain={{text: "l'hormone de la grossesse (placenta)", at: GROS - 4}}
			art={{
				at: GROS,
				node: <Live render={(f) => (f < DOUBLE - 16 ? <MomToBe width={230} belly={0.6} inside={interpolate(f, [PLAC - 6, PLAC + 10], [0, 1], clamp)} mood="content" /> : <Doubling n={n} width={600} />)} />,
			}}
			artY={790}
			chips={[
				{label: 'visibles dès 10 jours', at: DIX - 4},
				{label: 'avant le retard de règles', at: RETARD - 6, tone: LPI.pink},
				{label: 'doublent environ tous les 2 jours', at: DOUBLE - 6, tone: LPI.navy},
			]}
			punches={[GROS + 1, PLAC + 1, DIX + 1, RETARD + 1, DOUBLE + 1]}
		/>
	);
};

export const Fshlh: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('fshlh', 'deux');
	const CERV = at('fshlh', 'cerveau');
	const OV = at('fshlh', 'ovaires');
	const DEBUT = at('fshlh', 'début');
	const HAUTES = at('fshlh', 'hautes');
	const MENO = at('fshlh', 'ménopause.');
	const t = interpolate(frame, [DEBUT - 24, DEBUT + 4], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'*FSH* et *LH*'}
			titleAt={DEUX}
			pink
			explain={{text: 'le cerveau commande ovaires et testicules', at: CERV - 6}}
			art={{
				at: CERV - 4,
				node: (
					<Live
						render={(f) =>
							f < DEBUT - 24 ? (
								<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
									<BrainIcon size={170} />
									<div style={{fontSize: 70, fontWeight: 900, color: N, opacity: f >= OV - 8 ? 1 : 0.2}}>→</div>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, opacity: f >= OV - 8 ? 1 : 0.2, textAlign: 'center', lineHeight: 1.3}}>ovaires<br />testicules</div>
								</div>
							) : (
								<Cycle t={t} mark="start" width={720} />
							)
						}
					/>
				),
			}}
			artY={790}
			chips={[
				{label: 'dosées en début de cycle', at: DEBUT - 4},
				{label: 'très hautes après 50 ans : ménopause', at: HAUTES - 4, tone: LPI.navy},
			]}
			punches={[CERV + 1, OV + 1, DEBUT + 1, HAUTES + 1, MENO + 1]}
		/>
	);
};

export const Proges: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('proges', 'trois');
	const MONTE = at('proges', 'monte');
	const UTER = at('proges', "l'utérus");
	const VINGT = at('proges', 'vingt');
	const LIEU = at('proges', 'lieu.');
	const prog = interpolate(frame, [MONTE - 4, MONTE + 16], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'La *progestérone*'}
			titleAt={TROIS}
			titleSize={100}
			explain={{text: "elle monte après l'ovulation", at: MONTE - 4}}
			art={{at: MONTE - 6, node: <Live render={(f) => <Cycle t={1} prog={prog} mark={f >= VINGT - 4 ? 'j21' : null} width={720} />} />}}
			artY={790}
			chips={[
				{label: "prépare l'utérus", at: UTER - 4},
				{label: 'dosée vers J21', at: VINGT - 2, tone: LPI.pink},
				{label: "preuve que l'ovulation a eu lieu", at: LIEU - 14, tone: LPI.navy},
			]}
			punches={[MONTE + 1, UTER + 1, VINGT + 1, LIEU + 1]}
		/>
	);
};

export const Testo: React.FC = () => {
	const QUATRE = at('testo', 'quatre');
	const MASC = at('testo', 'masculine,');
	const FEMME = at('testo', 'femme.');
	const MATIN = at('testo', 'matin,');
	const HAUT = at('testo', 'haut.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'La *testostérone*'}
			titleAt={QUATRE}
			titleSize={100}
			pink
			explain={{text: "l'hormone masculine", at: MASC - 6}}
			art={{
				at: MASC - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<MuscleArm size={200} pump={Math.max(0, Math.sin(f / 5))} />
								<div style={{opacity: f >= MATIN - 6 ? 1 : 0}}><SunIcon size={170} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'aussi un peu chez la femme', at: FEMME - 10},
				{label: 'prélevée le matin', at: MATIN - 4, tone: LPI.navy},
				{label: 'au plus haut', at: HAUT - 6, tone: LPI.paper},
			]}
			punches={[MASC + 1, FEMME + 1, MATIN + 1, HAUT + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const GROS = at('fin', 'grossesse,');
	const CYCLE = at('fin', 'cycle,');
	const OVUL = at('fin', 'ovulation,');
	const TESTO = at('fin', 'testostérone :');
	const JAUNE = at('fin', 'jaune.');
	const PROCH = at('fin', 'prochaine');
	const SERO = at('fin', 'sérologies.');
	return (
		<LabFin
			series={S}
			title={'*Hormones* · 2/2'}
			rows={[
				{t: GROS, title: 'β-hCG', sub: 'grossesse · doublent en 2 jours'},
				{t: CYCLE, title: 'FSH · LH', sub: 'début de cycle · ménopause'},
				{t: OVUL, title: 'progestérone', sub: 'vers J21 : ovulation'},
				{t: TESTO, title: 'testostérone', sub: 'prélevée le matin'},
			]}
			check={JAUNE}
			next={{at: PROCH, artAt: SERO, children: <NextTitle pre="les " hot="sérologies" />}}
		/>
	);
};
