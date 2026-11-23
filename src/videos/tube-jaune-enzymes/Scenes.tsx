// « Le tube jaune : les enzymes » (n° 82, série courte du tube jaune, vidéo 5 ; directives Instagram). Accroche : quand des
// cellules meurent, elles lâchent leurs enzymes. 1 · CPK (muscles : effort, chute, injection IM ; rhabdomyolyse dangereuse
// pour les reins) ; 2 · LDH (presque toutes les cellules : globules rouges, foie, cancers ; sensible mais peu précis) ;
// 3 · lipase (pancréas ; > 3 × la normale + douleur qui part dans le dos = pancréatite aiguë, calcul ou alcool).
// Sources : critères d'Atlanta révisés 2012 (lipase > 3 × N) ; valeurs usuelles des laboratoires (CPK < 200 UI/L environ,
// LDH ≈ 120 – 250 UI/L, lipase < 60 UI/L environ), variables selon les méthodes.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon, Pancreas} from '../../brand/diabetes';
import {RunIcon, SyringeIcon} from '../../brand/icons';
import {BurstCell} from '../../brand/labart';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {MuscleArm} from '../../brand/renal';
import {LPI} from '../../brand/theme';
import {CAP, RedCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES ENZYMES', total: 3};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MEURENT = at('intro', 'meurent,');
	const LACHENT = at('intro', 'lâchent');
	const TROIS = at('intro', 'trois');
	const LESQ = at('intro', 'lesquelles');
	const burst = interpolate(frame, [LACHENT - 4, LACHENT + 16], [0, 1], clamp);
	return (
		<LabHook
			series={S}
			title={'Les *enzymes*\ndans le tube *jaune*'}
			art={<Live render={() => <BurstCell burst={burst} size={340} />} />}
			chips={[
				{label: 'CPK', at: TROIS},
				{label: 'LDH', at: TROIS + 5, tone: LPI.pink},
				{label: 'lipase', at: TROIS + 10},
			]}
			notes={[
				{text: 'des cellules qui meurent', at: MEURENT - 2},
				{text: 'tu sais lesquelles ?', at: LESQ - 6},
			]}
			punches={[MEURENT + 1, LACHENT + 1, TROIS + 1]}
		/>
	);
};

export const Cpk: React.FC = () => {
	const UN = at('cpk', 'un');
	const MUSC = at('cpk', 'muscles.');
	const EFFORT = at('cpk', 'effort,');
	const CHUTE = at('cpk', 'chute');
	const INJ = at('cpk', 'injection');
	const DETRUIT = at('cpk', 'détruit');
	const RHABDO = at('cpk', 'rhabdomyolyse,');
	const REINS = at('cpk', 'reins.');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Les *CPK*'}
			titleAt={UN}
			explain={{text: "l'enzyme des muscles", at: MUSC - 4}}
			art={{at: MUSC, node: <Live render={(f) => <MuscleArm size={260} pump={Math.max(0, Math.sin(f / 5))} bulk={1.15} />} />}}
			norm={{rows: [['', '< 200 UI/L environ']], at: EFFORT - 6}}
			chips={[
				{label: 'gros effort', at: EFFORT - 2, icon: <RunIcon size={40} />},
				{label: 'chute', at: CHUTE - 2, tone: LPI.pink},
				{label: 'injection dans le muscle', at: INJ - 2, icon: <SyringeIcon size={40} />},
				{label: 'rhabdomyolyse', at: RHABDO - 2, tone: LPI.navy},
			]}
			note={{text: 'muscle détruit : danger pour les reins', at: REINS - 6, size: 34}}
			extra={
				<Live
					render={(f) =>
						f >= REINS - 6 ? (
							<div style={{position: 'absolute', left: 800, top: 680}}>
								<KidneysIcon size={140} />
							</div>
						) : null
					}
				/>
			}
			punches={[MUSC + 1, EFFORT + 1, DETRUIT + 1, RHABDO + 1, REINS + 1]}
			sfx={[{name: 'buzz', at: DETRUIT}]}
		/>
	);
};

export const Ldh: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('ldh', 'deux');
	const TOUTES = at('ldh', 'toutes');
	const MEURENT = at('ldh', 'meurent,');
	const GLOB = at('ldh', 'globules');
	const FOIE = at('ldh', 'foie');
	const CANC = at('ldh', 'cancers.');
	const PRECIS = at('ldh', 'précis.');
	const burst = interpolate(frame, [MEURENT - 4, MEURENT + 16], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Les *LDH*'}
			titleAt={DEUX}
			pink
			explain={{text: 'dans presque toutes les cellules', at: TOUTES - 4}}
			art={{at: TOUTES, node: <Live render={() => <BurstCell burst={burst} size={300} tone={LPI.sky} />} />}}
			norm={{rows: [['', '≈ 120 – 250 UI/L']], at: GLOB - 10}}
			chips={[
				{label: 'globules rouges', at: GLOB - 2, icon: <RedCell size={40} />},
				{label: 'foie', at: FOIE - 2, icon: <FattyLiverIcon size={40} />, tone: LPI.pink},
				{label: 'certains cancers', at: CANC - 4},
			]}
			note={{text: "un bon signal d'alerte… mais pas très précis", at: PRECIS - 10, size: 34}}
			punches={[TOUTES + 1, MEURENT + 1, GLOB + 1, CANC + 1, PRECIS + 1]}
		/>
	);
};

export const Lipase: React.FC = () => {
	const TROIS = at('lipase', 'trois');
	const PANC = at('lipase', 'pancréas.');
	const PLUS = at('lipase', 'plus');
	const DOS = at('lipase', 'dos');
	const PANCREATITE = at('lipase', 'pancréatite');
	const CALC = at('lipase', 'calcul');
	const ALC = at('lipase', "l'alcool.");
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'La *lipase*'}
			titleAt={TROIS}
			explain={{text: "l'enzyme du pancréas", at: PANC - 6}}
			art={{at: PANC - 4, node: <Live render={(f) => <Pancreas width={420} dead={f >= DOS ? 0.4 : 0} />} />}}
			norm={{rows: [['', '< 60 UI/L environ']], at: PANC + 10}}
			chips={[
				{label: 'plus de 3 × la normale', at: PLUS - 2, tone: LPI.pink},
				{label: 'douleur qui part dans le dos', at: DOS - 6},
				{label: 'pancréatite aiguë', at: PANCREATITE - 2, tone: LPI.navy},
				{label: 'calcul ou alcool', at: CALC - 2},
			]}
			punches={[PANC + 1, PLUS + 1, DOS + 1, PANCREATITE + 1, ALC + 1]}
			sfx={[{name: 'buzz', at: PANCREATITE}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const CPK = at('fin', 'cpk,');
	const LDH = at('fin', 'ldh,');
	const LIP = at('fin', 'lipase');
	const LIRE = at('fin', 'lire');
	const PROCH = at('fin', 'prochaine');
	const SOD = at('fin', 'sodium,');
	return (
		<LabFin
			series={S}
			title={'Les *enzymes*'}
			pink
			rows={[
				{t: CPK, title: 'CPK', sub: 'muscles · rhabdomyolyse'},
				{t: LDH, title: 'LDH', sub: 'cellules qui meurent · peu précis'},
				{t: LIP, title: 'lipase', sub: '> 3 × N + douleur : pancréatite'},
			]}
			check={LIRE}
			next={{at: PROCH, artAt: SOD, children: <NextTitle pre="le " hot="sodium" post=", le potassium et le chlore" />}}
		/>
	);
};
