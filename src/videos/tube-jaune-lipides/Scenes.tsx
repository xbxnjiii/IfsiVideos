// « Le tube jaune : le bilan lipidique » (n° 81, série courte du tube jaune, vidéo 4, ajoutée à la demande ; directives
// Instagram). Accroche : le cholestérol bouche les artères en silence. 1 – 2 · cholestérol total (< 2 g/L) et LDL, le
// mauvais (< 1,6 g/L sans facteur de risque, cible plus basse si le risque cardiovasculaire augmente) ; 3 · HDL, le bon
// (≥ 0,4 g/L, plus c'est haut mieux c'est) ; 4 · triglycérides (< 1,5 g/L ; sucre, alcool, gras ; à jeun 12 h).
// Sources : HAS 2017 « Principales dyslipidémies : stratégies de prise en charge » (cibles du LDL selon le risque) ;
// valeurs usuelles des laboratoires français (CT < 2 g/L, HDL ≥ 0,40 g/L, TG < 1,50 g/L, jeûne de 12 h).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {MeatIcon} from '../../brand/colorectal';
import {Artery} from '../../brand/labart';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {LPI} from '../../brand/theme';
import {CAP, SugarCube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LE CHOLESTÉROL', total: 4};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const BOUCHE = at('intro', 'bouche');
	const SILENCE = at('intro', 'silence.');
	const QUATRE = at('intro', 'quatre');
	const LIRE = at('intro', 'lire');
	const plaque = interpolate(frame, [BOUCHE - 4, SILENCE + 10], [0.15, 0.9], clamp);
	return (
		<LabHook
			series={S}
			title={'Le *cholestérol*\ndans le tube *jaune*'}
			titleSize={84}
			art={<Live render={() => <Artery plaque={plaque} width={400} />} />}
			chips={[
				{label: 'total', at: QUATRE},
				{label: 'LDL', at: QUATRE + 5, tone: LPI.pink},
				{label: 'HDL', at: QUATRE + 10},
				{label: 'triglycérides', at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[
				{text: 'il bouche les artères en silence', at: BOUCHE - 2},
				{text: 'tu sais les lire ?', at: LIRE - 6},
			]}
			punches={[BOUCHE + 1, SILENCE + 1, QUATRE + 1]}
		/>
	);
};

export const Ldl: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('ldl', 'un');
	const LDL = at('ldl', 'ldl,');
	const MAUVAIS = at('ldl', 'mauvais');
	const DEPOSE = at('ldl', 'dépose');
	const TOTAL = at('ldl', 'total');
	const SIX = at('ldl', 'six');
	const CIBLE = at('ldl', 'cible');
	const plaque = interpolate(frame, [DEPOSE - 4, DEPOSE + 24], [0.1, 0.8], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1], [LDL, 2]]}
			title={'Total et *LDL*'}
			titleAt={UN}
			explain={{text: 'le LDL : le mauvais cholestérol', at: MAUVAIS - 4}}
			art={{at: DEPOSE - 6, node: <Live render={() => <Artery plaque={plaque} width={330} />} />}}
			artY={760}
			norm={{rows: [['total', '< 2 g/L'], ['LDL', '< 1,6 g/L (sans risque)']], at: TOTAL - 4, y: 1060}}
			chips={[{label: 'cible plus basse si risque cardiaque', at: CIBLE - 2, tone: LPI.pink}]}
			note={{text: 'il se dépose dans les artères', at: SIX + 10}}
			punches={[LDL + 1, MAUVAIS + 1, DEPOSE + 1, SIX + 1, CIBLE + 1]}
		/>
	);
};

export const Hdl: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('hdl', 'trois');
	const BON = at('hdl', 'bon');
	const NETTOIE = at('hdl', 'nettoie');
	const FOIE = at('hdl', 'foie.');
	const HAUT = at('hdl', 'haut,');
	const QUATRE = at('hdl', 'quatre');
	const clean = interpolate(frame, [NETTOIE - 4, FOIE + 10], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *HDL*'}
			titleAt={TROIS}
			pink
			explain={{text: 'le bon cholestérol', at: BON - 4}}
			art={{
				at: NETTOIE - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
								<Artery plaque={0.8} clean={clean} width={300} />
								<div style={{fontSize: 70, fontWeight: 900, color: LPI.navy}}>→</div>
								<div style={{opacity: f >= FOIE - 4 ? 1 : 0.25}}>
									<FattyLiverIcon size={170} />
								</div>
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '≥ 0,4 g/L']], at: QUATRE - 6}}
			chips={[{label: "plus c'est haut, mieux c'est", at: HAUT - 4, tone: LPI.navy}]}
			punches={[BON + 1, NETTOIE + 1, FOIE + 1, HAUT + 1]}
		/>
	);
};

const Glass: React.FC<{size?: number}> = ({size = 44}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 10 H70 L66 60 Q50 74 34 60 Z" fill="#9B2335" stroke={LPI.navy} strokeWidth={6} />
		<path d="M50 70 V90 M34 92 H66" stroke={LPI.navy} strokeWidth={7} strokeLinecap="round" />
	</svg>
);

export const Tg: React.FC = () => {
	const QUATRE = at('tg', 'quatre');
	const TRI = at('tg', 'triglycérides,');
	const SUCRE = at('tg', 'sucre,');
	const ALC = at('tg', "l'alcool");
	const GRAS = at('tg', 'gras.');
	const NORM = at('tg', 'normaux');
	const REPAS = at('tg', 'repas');
	const JEUN = at('tg', 'jeun,');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'Les *triglycérides*'}
			titleAt={TRI - 2}
			titleSize={100}
			explain={{text: 'des graisses dans le sang', at: TRI + 4}}
			art={{
				at: SUCRE - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
								<div style={{opacity: f >= SUCRE - 4 ? 1 : 0}}><SugarCube size={110} /></div>
								<div style={{opacity: f >= ALC - 4 ? 1 : 0}}><Glass size={120} /></div>
								<div style={{opacity: f >= GRAS - 4 ? 1 : 0}}><MeatIcon size={120} /></div>
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '< 1,5 g/L']], at: NORM - 4}}
			chips={[
				{label: 'montent après un repas', at: REPAS - 6, tone: LPI.pink},
				{label: 'à jeun depuis 12 h', at: JEUN - 4, tone: LPI.navy},
			]}
			punches={[TRI + 1, SUCRE + 1, ALC + 1, GRAS + 1, NORM + 1, JEUN + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const TOTAL = at('fin', 'total,');
	const LDL = at('fin', 'ldl,');
	const HDL = at('fin', 'hdl,');
	const TG = at('fin', 'triglycérides');
	const BILAN = at('fin', 'lipidique.');
	const PROCH = at('fin', 'prochaine');
	const ENZ = at('fin', 'enzymes');
	return (
		<LabFin
			series={S}
			title={'Bilan *lipidique*'}
			rows={[
				{t: TOTAL, title: 'total', sub: '< 2 g/L'},
				{t: LDL, title: 'LDL (mauvais)', sub: '< 1,6 g/L sans risque'},
				{t: HDL, title: 'HDL (bon)', sub: '≥ 0,4 g/L'},
				{t: TG, title: 'triglycérides', sub: '< 1,5 g/L · à jeun 12 h'},
			]}
			check={BILAN}
			next={{at: PROCH, artAt: ENZ, children: <NextTitle pre="les " hot="enzymes" />}}
		/>
	);
};
