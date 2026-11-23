// « Le tube jaune : CRP et procalcitonine » (n° 85, série courte du tube jaune, vidéo 8 ; directives Instagram). Accroche :
// virus ou bactérie ? 1 · CRP (protéine de l'inflammation, foie ; < 5 mg/L ; monte en 6 h, pic vers 48 h, redescend ; toute
// inflammation) ; 2 · procalcitonine (surtout les bactéries ; < 0,5 µg/L : infection bactérienne grave peu probable ; aide à
// commencer ou arrêter les antibiotiques).
// Sources : HAS / SPILF (bon usage des antibiotiques, PCT) ; Surviving Sepsis Campaign 2021 ; cinétique de la CRP
// (début 4 – 6 h, pic 36 – 50 h) ; valeurs usuelles (CRP < 5 mg/L, PCT < 0,5 µg/L).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {FeverIcon, PillIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {Bacterium} from '../../brand/stomach';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: "LE TUBE JAUNE · L'INFLAMMATION", total: 2};

/** Virus (boule à spicules). */
const Virus: React.FC<{size?: number}> = ({size = 120}) => (
	<svg width={size} height={size} viewBox="-60 -60 120 120">
		{Array.from({length: 10}).map((_, i) => {
			const a = (i / 10) * Math.PI * 2;
			return (
				<g key={i}>
					<line x1={Math.cos(a) * 30} y1={Math.sin(a) * 30} x2={Math.cos(a) * 48} y2={Math.sin(a) * 48} stroke={N} strokeWidth={5} />
					<circle cx={Math.cos(a) * 50} cy={Math.sin(a) * 50} r={7} fill={LPI.sky} stroke={N} strokeWidth={3} />
				</g>
			);
		})}
		<circle r={32} fill={LPI.blue} stroke={N} strokeWidth={6} />
	</svg>
);

/** Courbe de la CRP : monte en 6 h, pic vers 48 h, redescend ; tracée jusqu'à `t` heures (0 → 120). */
const CrpCurve: React.FC<{t: number}> = ({t}) => {
	const W = 760;
	const H = 280;
	const X = (h: number) => 40 + (h / 120) * (W - 60);
	const v = (h: number) => (h < 6 ? 0 : h < 48 ? Math.sin(((h - 6) / 42) * (Math.PI / 2)) : Math.max(0, 1 - (h - 48) / 80));
	const Y = (h: number) => H - 40 - (H - 80) * v(h);
	const pts = Array.from({length: 121}, (_, i) => i).filter((h) => h <= t);
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={H - 40} x2={W - 10} y2={H - 40} stroke={N} strokeWidth={5} strokeLinecap="round" />
			{[0, 48, 96].map((h) => (
				<text key={h} x={X(h)} y={H} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={N}>
					{h} h
				</text>
			))}
			<path d={pts.map((h, i) => `${i ? 'L' : 'M'}${X(h)} ${Y(h)}`).join(' ')} fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
			<rect x={X(46)} y={20} width={X(50) - X(46)} height={H - 60} fill={alpha(LPI.blue, t >= 48 ? 0.25 : 0)} />
		</svg>
	);
};

export const Hook: React.FC = () => {
	const VIRUS = at('intro', 'virus');
	const BACT = at('intro', 'bactérie');
	const DEUX = at('intro', 'deux');
	const ANTI = at('intro', 'antibiotiques.');
	const CONN = at('intro', 'connais');
	return (
		<LabHook
			series={S}
			title={"*L'inflammation*\ndans le tube *jaune*"}
			titleSize={90}
			art={
				<Live
					render={(f) => (
						<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
							<div style={{opacity: f >= VIRUS - 4 ? 1 : 0.15, transform: `rotate(${f * 2}deg)`}}><Virus size={170} /></div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N}}>ou</div>
							<div style={{opacity: f >= BACT - 4 ? 1 : 0.15}}><svg width={240} height={180} viewBox="-120 -90 240 180"><Bacterium x={0} y={0} s={2.8} /></svg></div>
						</div>
					)}
				/>
			}
			chips={[
				{label: 'CRP', at: DEUX},
				{label: 'procalcitonine', at: DEUX + 6, tone: LPI.pink},
			]}
			notes={[
				{text: 'et les antibiotiques ?', at: ANTI - 6, size: 36},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[VIRUS + 1, BACT + 1, DEUX + 1, ANTI + 1]}
		/>
	);
};

export const Crp: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('crp', 'un');
	const PROT = at('crp', 'protéine');
	const FOIE = at('crp', 'foie.');
	const NORM = at('crp', 'normale');
	const SIX = at('crp', 'six');
	const MIEUX = at('crp', 'mieux.');
	const TOUTE = at('crp', 'toute');
	const t = interpolate(frame, [SIX - 10, MIEUX + 6], [0, 120], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La *CRP*'}
			titleAt={UN}
			explain={{text: "la protéine de l'inflammation, faite par le foie", at: PROT - 4, to: SIX - 14}}
			art={{
				at: PROT,
				node: (
					<Live
						render={(f) =>
							f < SIX - 12 ? (
								<div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
									<FeverIcon size={140} />
									<div style={{opacity: f >= FOIE - 4 ? 1 : 0}}><FattyLiverIcon size={150} /></div>
								</div>
							) : (
								<CrpCurve t={t} />
							)
						}
					/>
				),
			}}
			norm={{rows: [['', '< 5 mg/L']], at: NORM - 4}}
			chips={[
				{label: 'monte en 6 h', at: SIX},
				{label: 'pic vers 48 h', at: SIX + 30, tone: LPI.pink},
				{label: 'toute inflammation, pas que les infections', at: TOUTE - 4, tone: LPI.navy},
			]}
			punches={[PROT + 1, NORM + 1, SIX + 1, MIEUX + 1, TOUTE + 1]}
		/>
	);
};

export const Pct: React.FC = () => {
	const DEUX = at('pct', 'deux');
	const BACT = at('pct', 'bactéries,');
	const VIRUS = at('pct', 'virus.');
	const SOUS = at('pct', 'sous');
	const PROB = at('pct', 'probable.');
	const COMM = at('pct', 'commencer,');
	const ARR = at('pct', 'arrêter,');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La *procalcitonine*'}
			titleAt={DEUX}
			titleSize={96}
			pink
			explain={{text: 'PCT', at: DEUX + 20}}
			art={{
				at: BACT - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<div style={{textAlign: 'center'}}>
									<svg width={230} height={170} viewBox="-115 -85 230 170"><Bacterium x={0} y={0} s={2.6} /></svg>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>↑↑</div>
								</div>
								<div style={{textAlign: 'center', opacity: f >= VIRUS - 4 ? 1 : 0}}>
									<Virus size={150} />
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>↑</div>
								</div>
							</div>
						)}
					/>
				),
			}}
			artY={790}
			norm={{rows: [['', '< 0,5 µg/L']], at: SOUS - 2, y: 1090}}
			chips={[
				{label: 'infection bactérienne grave peu probable', at: PROB - 10, tone: LPI.paper},
				{label: 'commencer ou arrêter les antibiotiques', at: COMM - 4, tone: LPI.navy, icon: <PillIcon size={40} />},
			]}
			punches={[BACT + 1, VIRUS + 1, SOUS + 1, COMM + 1, ARR + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const CRP = at('fin', 'crp');
	const PCT = at('fin', 'procalcitonine');
	const LIRE = at('fin', 'lire');
	const PROCH = at('fin', 'prochaine');
	const ALB = at('fin', "l'albumine");
	return (
		<LabFin
			series={S}
			title={"*L'inflammation*"}
			rows={[
				{t: CRP, title: 'CRP', sub: '< 5 mg/L · toute inflammation'},
				{t: PCT, title: 'procalcitonine', sub: '< 0,5 µg/L · surtout les bactéries'},
			]}
			check={LIRE}
			next={{at: PROCH, artAt: ALB, children: <NextTitle pre="l'" hot="albumine" post=" et les protéines" />}}
		/>
	);
};
