// « Le tube jaune : sodium, potassium, chlore » (n° 83, série courte du tube jaune, vidéo 6 ; directives Instagram ; version
// courte de la partie ionogramme de la n° 63, mêmes normes : tableau du propriétaire). Accroche : un potassium de travers
// peut arrêter un cœur. 1 · sodium (l'eau autour des cellules ; 133 – 150 mmol/L ; haut : cellules déshydratées ; bas :
// cellules qui gonflent, cerveau) ; 2 · potassium (dans les cellules, fait battre le cœur ; 3,5 – 5 ; garrot trop long /
// tube hémolysé = faux potassium haut) ; 3 · chlore (suit le sodium, équilibre acide / base ; 95 – 105).
// Sources : tableau du propriétaire (n° 63) ; CLSI GP41 (hémolyse, garrot > 1 min : pseudo-hyperkaliémie).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {EcgMonitor} from '../../brand/arrest';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {LPI} from '../../brand/theme';
import {CAP, Ion} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {CellMap} from '../tube-jaune/Scenes';
import {at} from './timeline';

const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES IONS 1/2', total: 3};

export const Hook: React.FC = () => {
	const ARR = at('intro', 'arrêter');
	const IONO = at('intro', "l'ionogramme");
	const TROIS = at('intro', 'trois');
	const CONN = at('intro', 'connais');
	return (
		<LabHook
			series={S}
			title={'Les *ions*\ndans le tube *jaune*'}
			art={<Live render={(f) => <EcgMonitor width={540} height={260} rhythm={(t) => (t < ARR + 4 ? 'sinus' : 'flat')} readout={f < ARR + 4 ? '72' : '0'} alert={f >= ARR + 4 ? 1 : 0} />} />}
			chips={[
				{label: 'Na⁺ sodium', at: TROIS},
				{label: 'K⁺ potassium', at: TROIS + 6, tone: LPI.pink},
				{label: 'Cl⁻ chlore', at: TROIS + 12},
			]}
			notes={[
				{text: "l'ionogramme", at: IONO - 4},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[ARR + 1, IONO + 1, TROIS + 1]}
			shakes={[ARR + 3]}
		/>
	);
};

export const Sodium: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('sodium', 'un');
	const GARD = at('sodium', 'gardien');
	const NORME = at('sodium', 'norme');
	const HAUT = at('sodium', 'haut,');
	const BAS = at('sodium', 'bas,');
	const CERV = at('sodium', 'cerveau.');
	const swell = frame < HAUT - 4 ? 1 : frame < BAS - 4 ? interpolate(frame, [HAUT - 4, HAUT + 10], [1, 0.75], clamp) : interpolate(frame, [BAS - 4, BAS + 12], [0.75, 1.3], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *sodium*'}
			titleAt={UN}
			explain={{text: "le gardien de l'eau, autour des cellules", at: GARD - 4}}
			art={{at: GARD, node: <Live render={(f) => <CellMap out={['Na⁺', 'Na⁺', 'Na⁺', 'Na⁺', 'Na⁺']} swell={swell} labels={0} flow={f >= BAS ? 1 : 0} w={500} />} />}}
			artY={790}
			norm={{rows: [['', '133 – 150 mmol/L']], at: NORME - 4, y: 1140}}
			chips={[
				{label: 'trop haut : cellules déshydratées', at: HAUT - 2},
				{label: "trop bas : elles gonflent d'eau", at: BAS - 2, tone: LPI.pink},
			]}
			note={{text: 'même dans le cerveau', at: CERV - 6, size: 36}}
			punches={[GARD + 1, NORME + 1, HAUT + 1, BAS + 1, CERV + 1]}
		/>
	);
};

export const Potassium: React.FC = () => {
	const DEUX = at('potassium', 'deux');
	const INT = at('potassium', "l'intérieur");
	const BATTRE = at('potassium', 'battre');
	const ETROITE = at('potassium', 'étroite');
	const DEREG = at('potassium', 'dérégler.');
	const GARROT = at('potassium', 'garrot');
	const ABIME = at('potassium', 'abîmé,');
	const TORT = at('potassium', 'tort.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *potassium*'}
			titleAt={DEUX}
			pink
			explain={{text: 'surtout dans les cellules', at: INT - 4}}
			art={{at: BATTRE - 4, node: <Live render={(f) => <EcgMonitor width={620} height={250} rhythm={(t) => (t < DEREG - 4 ? 'sinus' : 'fv')} readout={f < DEREG - 4 ? '72' : '?'} alert={f >= DEREG - 4 && f < GARROT ? 1 : 0} />} />}}
			norm={{rows: [['', '3,5 – 5 mmol/L']], at: ETROITE - 2}}
			chips={[
				{label: 'trop haut ou trop bas : le cœur se dérègle', at: DEREG - 8, tone: LPI.navy},
				{label: 'garrot trop long, tube hémolysé', at: GARROT - 2},
				{label: 'faux potassium haut', at: TORT - 6, tone: LPI.pink},
			]}
			punches={[INT + 1, BATTRE + 1, ETROITE + 1, DEREG + 1, GARROT + 1, TORT + 1]}
			sfx={[{name: 'buzz', at: DEREG}]}
		/>
	);
};

export const Chlore: React.FC = () => {
	const TROIS = at('chlore', 'trois');
	const CHLO = at('chlore', 'chlorure.');
	const SUIT = at('chlore', 'suit');
	const EQUI = at('chlore', "l'équilibre");
	const NORME = at('chlore', 'norme');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *chlore*'}
			titleAt={TROIS}
			explain={{text: 'aussi appelé chlorure (Cl⁻)', at: CHLO - 6}}
			art={{
				at: SUIT - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
								<Ion label="Na⁺" size={150} tone={LPI.pink} />
								<div style={{fontSize: 70, fontWeight: 900, color: LPI.navy, transform: `translateX(${6 * Math.sin(f / 4)}px)`}}>→</div>
								<Ion label="Cl⁻" size={150} tone={LPI.sky} />
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '95 – 105 mmol/L']], at: NORME - 4}}
			chips={[
				{label: 'il suit le sodium', at: SUIT},
				{label: 'équilibre acide / base', at: EQUI - 2, tone: LPI.pink},
			]}
			punches={[CHLO + 1, SUIT + 1, EQUI + 1, NORME + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const NA = at('fin', 'sodium,');
	const K = at('fin', 'potassium,');
	const CL = at('fin', 'chlore');
	const IONO = at('fin', "l'ionogramme.");
	const PROCH = at('fin', 'prochaine');
	const CA = at('fin', 'calcium,');
	return (
		<LabFin
			series={S}
			title={'Les *ions* · 1/2'}
			pink
			rows={[
				{t: NA, title: 'sodium Na⁺', sub: '133 – 150 mmol/L'},
				{t: K, title: 'potassium K⁺', sub: '3,5 – 5 · attention au garrot'},
				{t: CL, title: 'chlore Cl⁻', sub: '95 – 105 mmol/L'},
			]}
			check={IONO}
			next={{at: PROCH, artAt: CA, children: <NextTitle pre="le " hot="calcium" post=", le phosphore, le magnésium…" />}}
		/>
	);
};
