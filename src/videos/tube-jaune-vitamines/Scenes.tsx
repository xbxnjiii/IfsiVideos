// « Le tube jaune : les vitamines » (n° 99, série courte du tube jaune, vidéo 22 et dernière ; directives Instagram).
// Accroche : fatigue, fourmillements, anémie : un manque de vitamines ? 1 · vitamine D (fabriquée par la peau au soleil,
// fixe le calcium dans les os ; carence fréquente en France : hiver, personnes âgées, peaux foncées) ; 2 · vitamine B12 et
// folates (B9) (fabrication des globules rouges : carence → anémie macrocytaire ; B12 : nerfs) ; 3 · CDT (transferrine
// carboxy-déficiente : consommation d'alcool excessive et quotidienne depuis ≥ 2 semaines ; repérage et suivi).
// Sources : HAS 2013 (dosage de la vitamine D : indications restreintes) ; Santé publique France (étude ENNS : carence
// fréquente) ; HAS (anémie macrocytaire : B12 / folates) ; SFA (CDT, marqueur de consommation chronique d'alcool).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {SunIcon} from '../../brand/burnstage';
import {BoneIcon} from '../../brand/labart';
import {IconDot, LabFin, LabHook, LabNotion} from '../../brand/labshort';
import {WineGlassG} from '../../brand/liver';
import {Pop} from '../../brand/short';
import {FONT, LPI} from '../../brand/theme';
import {CAP, RedCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES VITAMINES', total: 3};

/** Pastille de vitamine. */
const VitPill: React.FC<{label: string; tone?: string; size?: number; on?: number}> = ({label, tone = LPI.sky, size = 150, on = 1}) => (
	<div style={{width: size * 1.6, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.4, color: N, opacity: 0.2 + 0.8 * on, transform: `scale(${0.85 + 0.15 * on})`}}>
		{label}
	</div>
);

/** Verre de vin (vraies couleurs) dans un svg. */
const Wine: React.FC<{size?: number; fill?: number}> = ({size = 160, fill = 0.7}) => (
	<svg width={size} height={size * 1.4} viewBox="-60 -110 120 170" style={{overflow: 'visible'}}>
		<WineGlassG fill={fill} />
	</svg>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const FAT = at('intro', 'fatigue,');
	const FOURM = at('intro', 'fourmillements,');
	const ANEM = at('intro', 'anémie…');
	const VIT = at('intro', 'vitamines ?');
	const D = at('intro', 'd,');
	const B = at('intro', 'douze,');
	const FOL = at('intro', 'folates,');
	const ALC = at('intro', "l'alcool.");
	const on = (t: number) => interpolate(frame, [t - 6, t + 4], [0, 1], clamp);
	return (
		<LabHook
			series={S}
			title={'Les *vitamines*\ndans le tube *jaune*'}
			titleSize={90}
			art={
				<Live
					render={() => (
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
							<VitPill label="D" size={110} on={on(D)} />
							<VitPill label="B12" size={110} tone={LPI.pink} on={on(B)} />
							<VitPill label="B9" size={110} tone={LPI.pink} on={on(FOL)} />
							<VitPill label="CDT" size={110} on={on(ALC)} />
						</div>
					)}
				/>
			}
			chips={[
				{label: 'fatigue', at: FAT},
				{label: 'fourmillements', at: FOURM - 2, tone: LPI.pink},
				{label: 'anémie', at: ANEM - 2},
			]}
			notes={[{text: 'un manque de vitamines ?', at: VIT - 10}]}
			punches={[FAT + 1, FOURM + 1, ANEM + 1, VIT + 1, D + 1, B + 1, FOL + 1, ALC + 1]}
		/>
	);
};

export const Vitd: React.FC = () => {
	const UN = at('vitd', 'un');
	const PEAU = at('vitd', 'peau');
	const CALC = at('vitd', 'calcium');
	const FRANCE = at('vitd', 'france,');
	const HIVER = at('vitd', 'hiver,');
	const AGEES = at('vitd', 'âgées');
	const FONC = at('vitd', 'foncées.');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La vitamine *D*'}
			titleAt={UN}
			explain={{text: 'fabriquée par la peau, au soleil', at: PEAU - 6}}
			art={{
				at: PEAU - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
								<SunIcon size={170} />
								<div style={{fontSize: 70, fontWeight: 900, color: N, opacity: f >= CALC - 6 ? 1 : 0.15}}>→</div>
								<div style={{opacity: f >= CALC - 6 ? 1 : 0.15}}><IconDot size={180}><BoneIcon size={130} /></IconDot></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'fixe le calcium', at: CALC - 6},
				{label: 'souvent en manque', at: FRANCE - 2, tone: LPI.pink},
				{label: 'hiver', at: HIVER - 2},
				{label: 'personnes âgées', at: AGEES - 6, tone: LPI.navy},
				{label: 'peaux foncées', at: FONC - 6},
			]}
			punches={[PEAU + 1, CALC + 1, FRANCE + 1, HIVER + 1, AGEES + 1, FONC + 1]}
		/>
	);
};

export const B12: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('b12', 'deux');
	const FOL = at('b12', 'folates,');
	const NEUF = at('b12', 'neuf.');
	const FAB = at('b12', 'fabriquer');
	const MANQ = at('b12', 'manquent,');
	const GROS = at('b12', 'gros :');
	const ANEM = at('b12', 'anémie.');
	const NERFS = at('b12', 'nerfs.');
	const grow = interpolate(frame, [MANQ - 4, GROS + 6], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'*B12* et *folates*'}
			titleAt={DEUX}
			pink
			explain={{text: 'folates = vitamine B9', at: NEUF - 10}}
			art={{
				at: FAB - 6,
				node: (
					<Live
						render={() => (
							<div style={{display: 'flex', alignItems: 'flex-end', gap: 26}}>
								{[0, 1, 2].map((i) => (
									<RedCell key={i} size={110 + 70 * grow} />
								))}
							</div>
						)}
					/>
				),
			}}
			artY={790}
			chips={[
				{label: 'pour fabriquer les globules rouges', at: FAB - 4},
				{label: 'manque : globules trop gros, anémie', at: GROS - 8, tone: LPI.pink},
				{label: 'la B12 protège aussi les nerfs', at: NERFS - 14, tone: LPI.navy},
			]}
			punches={[FOL + 1, NEUF + 1, FAB + 1, MANQ + 1, GROS + 1, ANEM + 1, NERFS + 1]}
		/>
	);
};

export const Cdt: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('cdt', 'trois');
	const TRANS = at('cdt', 'transferrine');
	const ALC = at('cdt', "d'alcool,");
	const JOURS = at('cdt', 'jours,');
	const SEM = at('cdt', 'semaines.');
	const REP = at('cdt', 'repérer');
	const SUIV = at('cdt', 'suivre');
	const days = Math.round(interpolate(frame, [JOURS - 10, SEM + 4], [1, 14], clamp));
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'La *CDT*'}
			titleAt={TROIS}
			explain={{text: 'transferrine carboxy-déficiente', at: TRANS - 4}}
			art={{
				at: ALC - 8,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<Wine size={130} fill={0.8} />
								<div style={{fontFamily: FONT.title, fontWeight: 900, color: N, textAlign: 'center', opacity: f >= JOURS - 10 ? 1 : 0.15}}>
									<div style={{fontSize: 120, lineHeight: 1}}>{days}</div>
									<div style={{fontSize: 40}}>jours</div>
								</div>
							</div>
						)}
					/>
				),
			}}
			artY={860}
			chips={[
				{label: 'beaucoup d’alcool, tous les jours', at: ALC - 4, tone: LPI.pink},
				{label: 'depuis au moins 2 semaines', at: SEM - 10},
				{label: 'repérer et suivre', at: REP - 4, tone: LPI.navy},
			]}
			punches={[TRANS + 1, ALC + 1, JOURS + 1, SEM + 1, REP + 1, SUIV + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const D = at('fin', 'd,');
	const B = at('fin', 'douze,');
	const FOL = at('fin', 'folates,');
	const T = at('fin', 't :');
	const TERM = at('fin', 'terminée.');
	const BRAVO = at('fin', 'bravo,');
	return (
		<LabFin
			series={S}
			title={'Les *vitamines*'}
			pink
			rows={[
				{t: D, title: 'vitamine D', sub: 'soleil · os · souvent basse'},
				{t: B, title: 'B12', sub: 'globules rouges · nerfs'},
				{t: FOL, title: 'folates (B9)', sub: 'globules rouges'},
				{t: T, title: 'CDT', sub: 'alcool tous les jours ≥ 2 semaines'},
			]}
			check={TERM}
			done={
				<Pop at={BRAVO - 4} x={540} y={1230}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, background: N, borderRadius: 40, padding: '26px 44px', textAlign: 'center', lineHeight: 1.25}}>
						SÉRIE TERMINÉE
						<div style={{fontSize: 36, color: LPI.pink}}>22 vidéos sur le tube jaune</div>
					</div>
				</Pop>
			}
		/>
	);
};
