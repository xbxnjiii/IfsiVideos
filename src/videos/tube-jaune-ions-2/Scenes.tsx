// « Le tube jaune : calcium, phosphore, magnésium, bicarbonates » (n° 84, série courte du tube jaune, vidéo 7 ; directives
// Instagram ; version courte de la n° 63, mêmes normes : tableau du propriétaire). 1 · calcium (os, muscles, cœur ;
// 2,2 – 2,6 mmol/L ; bas : fourmillements, crampes) ; 2 · phosphore (partenaire du calcium ; 0,8 – 1,3 ; monte si les reins
// filtrent mal) ; 3 · magnésium (nerfs, muscles, cœur ; 0,75 – 1 ; bas : crampes, potassium qui ne remonte pas) ;
// 4 · bicarbonates (tampon de l'acidité ; 22 – 30 ; bas : acidose, ex. acidocétose diabétique).
// Sources : tableau du propriétaire (n° 63) ; hypomagnésémie et hypokaliémie réfractaire (recommandations de réanimation).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {BoneIcon} from '../../brand/labart';
import {IconDot, LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {MuscleArm} from '../../brand/renal';
import {LPI} from '../../brand/theme';
import {CAP, Ion} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {Seesaw} from '../tube-jaune/Scenes';
import {at} from './timeline';

const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES IONS 2/2', total: 4};

export const Hook: React.FC = () => {
	const CA = at('intro', 'calcium,');
	const P = at('intro', 'phosphore,');
	const MG = at('intro', 'magnésium,');
	const BIC = at('intro', 'bicarbonates');
	const CRAMPES = at('intro', 'crampes,');
	const CONN = at('intro', 'connais');
	return (
		<LabHook
			series={S}
			title={'Les *ions* (suite)\ndans le tube *jaune*'}
			titleSize={92}
			art={
				<Live
					render={(f) => (
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
							{[
								['Ca²⁺', CA, LPI.sky],
								['P', P, LPI.pink],
								['Mg²⁺', MG, LPI.pink],
								['HCO₃⁻', BIC, LPI.sky],
							].map(([l, t, tone]) => (
								<div key={l as string} style={{opacity: f >= (t as number) - 4 ? 1 : 0.15}}>
									<Ion label={l as string} size={150} tone={tone as string} fs={(l as string).length > 3 ? 0.26 : 0.36} />
								</div>
							))}
						</div>
					)}
				/>
			}
			chips={[
				{label: 'calcium', at: CA},
				{label: 'phosphore', at: P, tone: LPI.pink},
				{label: 'magnésium', at: MG},
				{label: 'bicarbonates', at: BIC, tone: LPI.pink},
			]}
			notes={[
				{text: 'crampes… ou pire', at: CRAMPES - 4},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[CA + 1, P + 1, MG + 1, BIC + 1, CRAMPES + 1]}
		/>
	);
};

export const Calcium: React.FC = () => {
	const UN = at('calcium', 'un');
	const OS = at('calcium', 'os,');
	const MUSC = at('calcium', 'muscles');
	const NORME = at('calcium', 'norme');
	const BAS = at('calcium', 'bas');
	const CRAMPES = at('calcium', 'crampes.');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *calcium*'}
			titleAt={UN}
			art={{
				at: OS - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
								<IconDot size={170}><BoneIcon size={120} /></IconDot>
								<div style={{opacity: f >= MUSC - 4 ? 1 : 0}}><MuscleArm size={200} pump={Math.max(0, Math.sin(f / 5))} /></div>
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '2,2 – 2,6 mmol/L']], at: NORME - 4}}
			chips={[
				{label: 'trop bas : fourmillements', at: BAS - 2, tone: LPI.pink},
				{label: 'crampes', at: CRAMPES - 4},
			]}
			punches={[OS + 1, MUSC + 1, NORME + 1, BAS + 1]}
		/>
	);
};

export const Phosphore: React.FC = () => {
	const DEUX = at('phosphore', 'deux');
	const PART = at('phosphore', 'partenaire');
	const NORME = at('phosphore', 'norme');
	const MONTE = at('phosphore', 'monte');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *phosphore*'}
			titleAt={DEUX}
			pink
			explain={{text: 'le partenaire du calcium dans les os', at: PART - 4}}
			art={{
				at: PART,
				node: (
					<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
						<Ion label="Ca²⁺" size={140} tone={LPI.sky} />
						<div style={{fontSize: 60, fontWeight: 900, color: LPI.navy}}>+</div>
						<Ion label="P" size={140} tone={LPI.pink} />
						<div style={{fontSize: 60, fontWeight: 900, color: LPI.navy}}>=</div>
						<IconDot size={150}><BoneIcon size={110} /></IconDot>
					</div>
				),
			}}
			norm={{rows: [['', '0,8 – 1,3 mmol/L']], at: NORME - 4}}
			chips={[{label: 'monte si les reins filtrent mal', at: MONTE - 2, icon: <KidneysIcon size={44} />, tone: LPI.paper}]}
			punches={[PART + 1, NORME + 1, MONTE + 1]}
		/>
	);
};

export const Magnesium: React.FC = () => {
	const TROIS = at('magnesium', 'trois');
	const NERFS = at('magnesium', 'nerfs,');
	const NORME = at('magnesium', 'norme');
	const BAS = at('magnesium', 'bas,');
	const POT = at('magnesium', 'potassium');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *magnésium*'}
			titleAt={TROIS}
			explain={{text: 'nerfs · muscles · cœur', at: NERFS - 2}}
			art={{at: NERFS, node: <Ion label="Mg²⁺" size={220} tone={LPI.pink} />}}
			norm={{rows: [['', '0,75 – 1 mmol/L']], at: NORME - 4}}
			chips={[
				{label: 'trop bas : crampes', at: BAS - 2},
				{label: 'le potassium ne remonte pas', at: POT - 4, tone: LPI.navy},
			]}
			punches={[NERFS + 1, NORME + 1, BAS + 1, POT + 1]}
		/>
	);
};

export const Bicar: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('bicar', 'quatre');
	const TAMPON = at('bicar', 'tampon');
	const NORME = at('bicar', 'norme');
	const BAS = at('bicar', 'bas,');
	const ACIDO = at('bicar', "l'acidocétose");
	const tilt = interpolate(frame, [BAS - 4, BAS + 14], [0, -1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'Les *bicarbonates*'}
			titleAt={QUATRE}
			titleSize={100}
			pink
			explain={{text: "le tampon contre l'acidité", at: TAMPON - 4}}
			art={{at: TAMPON, node: <Live render={() => <Seesaw tilt={tilt} width={560} />} />}}
			artY={800}
			norm={{rows: [['', '22 – 30 mmol/L']], at: NORME - 4, y: 1090}}
			chips={[
				{label: 'trop bas : sang trop acide', at: BAS - 2, tone: LPI.pink},
				{label: 'ex. : acidocétose du diabétique', at: ACIDO - 4},
			]}
			punches={[TAMPON + 1, NORME + 1, BAS + 1, ACIDO + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const CA = at('fin', 'calcium,');
	const P = at('fin', 'phosphore,');
	const MG = at('fin', 'magnésium,');
	const BIC = at('fin', 'bicarbonates');
	const COMPLET = at('fin', 'complet.');
	const PROCH = at('fin', 'prochaine');
	const CRP = at('fin', 'crp');
	return (
		<LabFin
			series={S}
			title={'Les *ions* · 2/2'}
			rows={[
				{t: CA, title: 'calcium', sub: '2,2 – 2,6 mmol/L'},
				{t: P, title: 'phosphore', sub: '0,8 – 1,3 mmol/L'},
				{t: MG, title: 'magnésium', sub: '0,75 – 1 mmol/L'},
				{t: BIC, title: 'bicarbonates', sub: '22 – 30 mmol/L'},
			]}
			check={COMPLET}
			next={{at: PROCH, artAt: CRP, children: <NextTitle pre="la " hot="CRP" post=" et la procalcitonine" />}}
		/>
	);
};
