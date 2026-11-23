// « Le tube jaune : les sérologies (3) » (n° 94, série courte du tube jaune, vidéo 17 ; directives Instagram). Accroche :
// piqûre de tique il y a 3 jours, sérologie de Lyme : trop tôt ! 1 · ASLO / ASD (anticorps antistreptococciques ; montent
// plusieurs semaines après l'infection : complications (glomérulonéphrite, rhumatisme articulaire)) ; 2 · Lyme (érythème
// migrant = diagnostic clinique, pas de sérologie, on traite ; sérologie pour les formes disséminées : nerfs,
// articulations) ; 3 · Covid (infection en cours : test nasal (PCR / antigénique) ; sérologie = contact passé ou vaccin).
// Sources : HAS 2018 (borréliose de Lyme : pas de sérologie devant un érythème migrant, ni après une piqûre sans signe) ;
// SPILF (ASLO / ASD : complications post-streptococciques) ; HAS 2020 (place des tests sérologiques du Covid-19).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FONT, LPI} from '../../brand/theme';
import {SkinG, TickG} from '../../brand/tick';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · SÉROLOGIES 3/3', total: 3};

/** Médaillon de peau (vraies couleurs) : tique au centre, plaque rouge qui s'étend (`ring`). */
const SkinDisc: React.FC<{size?: number; ring?: number; tick?: number}> = ({size = 320, ring = 0, tick = 1}) => {
	const id = React.useId().replace(/:/g, '');
	return (
		<svg width={size} height={size} viewBox="0 0 1000 1000">
			<defs>
				<clipPath id={`d${id}`}>
					<circle cx={500} cy={500} r={480} />
				</clipPath>
			</defs>
			<g clipPath={`url(#d${id})`}>
				<SkinG real ring={ring} red={0.3}>
					{tick > 0 && <TickG x={500} y={500} s={2.2} opacity={tick} fed={0.3} buried={0.4} />}
				</SkinG>
			</g>
			<circle cx={500} cy={500} r={480} fill="none" stroke={N} strokeWidth={16} />
		</svg>
	);
};

/** Frise des jours / semaines avec un repère « trop tôt » et « bon moment ». */
const Timing: React.FC<{pos: number; good: [number, number]; label: string; width?: number}> = ({pos, good, label, width = 760}) => {
	const W = 760;
	const H = 200;
	const X = (x: number) => 40 + x * (W - 80);
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<rect x={X(good[0])} y={50} width={X(good[1]) - X(good[0])} height={60} rx={20} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<text x={(X(good[0]) + X(good[1])) / 2} y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>{label}</text>
			<line x1={40} y1={130} x2={W - 40} y2={130} stroke={N} strokeWidth={6} strokeLinecap="round" />
			<text x={X(0)} y={180} fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>J0</text>
			<circle cx={X(pos)} cy={130} r={20} fill={LPI.pink} stroke={N} strokeWidth={5} />
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TIQUE = at('intro', 'tique');
	const TROIS = at('intro', 'trois');
	const LYME = at('intro', 'lyme ?');
	const TOT = at('intro', 'trop');
	const SERO = at('intro', 'sérologies,');
	const MOM = at('intro', 'moment.');
	return (
		<LabHook
			series={S}
			title={'Les *sérologies*\nau bon *moment*'}
			titleSize={92}
			art={<Live render={() => <SkinDisc size={330} ring={interpolate(frame, [LYME, LYME + 30], [0, 0.3], clamp)} />} />}
			chips={[
				{label: 'ASLO · ASD', at: SERO - 4},
				{label: 'Lyme', at: SERO + 2, tone: LPI.pink},
				{label: 'Covid', at: SERO + 8},
			]}
			notes={[
				{text: 'piqûre il y a 3 jours', at: TROIS - 4},
				{text: 'trop tôt !', at: TOT - 2},
			]}
			punches={[TIQUE + 1, TROIS + 1, LYME + 1, TOT + 1, SERO + 1, MOM + 1]}
			shakes={[TOT + 2]}
		/>
	);
};

export const Aslo: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('aslo', 'un');
	const STREP = at('aslo', 'streptocoque,');
	const ANG = at('aslo', 'angines.');
	const SEM = at('aslo', 'semaines');
	const COMPL = at('aslo', 'complication,');
	const REINS = at('aslo', 'reins');
	const ARTIC = at('aslo', 'articulations.');
	const pos = interpolate(frame, [SEM - 20, SEM + 20], [0.05, 0.6], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'*ASLO* et *ASD*'}
			titleAt={UN}
			explain={{text: 'anticorps contre le streptocoque', at: STREP - 10}}
			art={{at: SEM - 20, node: <Live render={() => <Timing pos={pos} good={[0.4, 0.95]} label="des semaines après" width={740} />} />}}
			chips={[
				{label: "la bactérie de certaines angines", at: ANG - 10, tone: LPI.paper},
				{label: 'pour une complication', at: COMPL - 4, tone: LPI.pink},
				{label: 'reins', at: REINS - 2, icon: <KidneysIcon size={40} />},
				{label: 'articulations', at: ARTIC - 4, tone: LPI.navy},
			]}
			punches={[STREP + 1, ANG + 1, SEM + 1, COMPL + 1, REINS + 1, ARTIC + 1]}
		/>
	);
};

export const Lyme: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('lyme', 'deux');
	const PLAQUE = at('lyme', 'plaque');
	const ETEND = at('lyme', "s'étend");
	const SUFFIT = at('lyme', 'suffit');
	const PAS = at('lyme', 'pas');
	const TRAITE = at('lyme', 'traite.');
	const TARD = at('lyme', 'tard,');
	const NERFS = at('lyme', 'nerfs');
	const ring = interpolate(frame, [PLAQUE - 6, ETEND + 30], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La maladie de *Lyme*'}
			titleAt={DEUX}
			titleSize={100}
			pink
			explain={{text: 'une plaque rouge qui s’étend', at: PLAQUE - 4}}
			art={{at: PLAQUE - 6, node: <Live render={() => <SkinDisc size={360} ring={ring} tick={0} />} />}}
			artY={790}
			chips={[
				{label: 'elle suffit au diagnostic', at: SUFFIT - 2},
				{label: 'pas de sérologie : on traite', at: PAS - 4, tone: LPI.pink},
				{label: 'plus tard : nerfs, articulations', at: TARD - 4, tone: LPI.navy},
			]}
			punches={[PLAQUE + 1, ETEND + 1, SUFFIT + 1, PAS + 1, TRAITE + 1, TARD + 1, NERFS + 1]}
		/>
	);
};

export const Covid: React.FC = () => {
	const TROIS = at('covid', 'trois');
	const MAINT = at('covid', 'maintenant,');
	const NASAL = at('covid', 'nasal.');
	const SERO = at('covid', 'sérologie,');
	const RENC = at('covid', 'rencontré');
	const VACC = at('covid', 'vaccin.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *Covid*'}
			titleAt={TROIS}
			explain={{text: 'deux questions, deux tests', at: MAINT - 10}}
			art={{
				at: MAINT - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', gap: 24}}>
								{[
									['malade maintenant ?', 'test nasal', MAINT - 6, LPI.pink],
									['déjà rencontré ?', 'sérologie', SERO - 6, LPI.sky],
								].map(([q, a, t, tone]) => (
									<div key={a as string} style={{width: 380, padding: '26px 20px', borderRadius: 34, border: `6px solid ${N}`, background: LPI.paper, fontFamily: FONT.title, fontWeight: 900, color: N, textAlign: 'center', opacity: f >= (t as number) ? 1 : 0.15}}>
										<div style={{fontSize: 36}}>{q}</div>
										<div style={{fontSize: 52, marginTop: 14, background: tone as string, borderRadius: 22, padding: '8px 0'}}>{a}</div>
									</div>
								))}
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'le virus… ou le vaccin', at: VACC - 14, tone: LPI.navy},
			]}
			punches={[MAINT + 1, NASAL + 1, SERO + 1, RENC + 1, VACC + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const SERO = at('fin', 'sérologie');
	const MOM = at('fin', 'moment.');
	const PROCH = at('fin', 'prochaine');
	const PHADI = at('fin', 'phadiatop.');
	return (
		<LabFin
			series={S}
			title={'*Sérologies* · 3/3'}
			pink
			rows={[
				{t: SERO, title: 'ASLO · ASD', sub: 'des semaines après : complications'},
				{t: SERO + 14, title: 'Lyme', sub: 'plaque rouge : on traite, sans sérologie'},
				{t: SERO + 28, title: 'Covid', sub: 'maintenant : test nasal'},
			]}
			check={MOM}
			next={{at: PROCH, artAt: PHADI - 20, children: <NextTitle pre="l'" hot="allergologie" />}}
		/>
	);
};
