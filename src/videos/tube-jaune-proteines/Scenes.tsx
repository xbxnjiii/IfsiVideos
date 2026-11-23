// « Le tube jaune : les protéines » (n° 86, série courte du tube jaune, vidéo 9 ; directives Instagram). Accroche : il mange mal
// depuis des semaines ? 1 · albumine (la plus abondante, faite par le foie, retient l'eau dans les vaisseaux ; 35 – 50 g/L ;
// basse : dénutrition, foie malade, pertes rénales, œdèmes) ; 2 · préalbumine (vit ≈ 2 jours : dénutrition récente,
// renutrition ; ≈ 0,2 – 0,4 g/L) ; 3 · haptoglobine (capte l'hémoglobine libérée par l'hémolyse ; effondrée = hémolyse ;
// ≈ 0,3 – 2 g/L).
// Sources : HAS 2019 / 2021 (diagnostic de la dénutrition : albuminémie < 35 g/L, < 30 g/L sévère) ; valeurs usuelles des
// laboratoires français (préalbumine ≈ 0,20 – 0,40 g/L, haptoglobine ≈ 0,3 – 2 g/L), variables selon les laboratoires.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {Ankles} from '../../brand/heartfail';
import {BurstCell} from '../../brand/labart';
import {IconDot, LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {DinnerPlate} from '../../brand/stomach';
import {FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;

/** Assiette (DinnerPlate est un <g> SVG centré sur 0, 0). */
const PlateSvg: React.FC<{r: number; eaten?: number}> = ({r, eaten = 0}) => (
	<svg width={r * 2.2} height={r * 0.9} viewBox={`${-r * 1.1} ${-r * 0.45} ${r * 2.2} ${r * 0.9}`} style={{overflow: 'visible'}}>
		<DinnerPlate r={r} eaten={eaten} />
	</svg>
);
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES PROTÉINES', total: 3};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MAL = at('intro', 'mal');
	const DEUX = at('intro', 'deux');
	const TROIS = at('intro', 'troisième');
	const DETR = at('intro', 'détruits.');
	const CONN = at('intro', 'connais');
	const eaten = interpolate(frame, [0, MAL + 20], [0.1, 0.05], clamp);
	return (
		<LabHook
			series={S}
			title={'Les *protéines*\ndans le tube *jaune*'}
			titleSize={90}
			art={
				<Live
					render={(f) =>
						f < TROIS - 6 ? (
							<div style={{transform: `rotate(${3 * Math.sin(f / 6)}deg)`}}><PlateSvg r={170} eaten={eaten} /></div>
						) : (
							<BurstCell burst={interpolate(f, [DETR - 8, DETR + 10], [0, 1], clamp)} size={300} />
						)
					}
				/>
			}
			chips={[
				{label: 'albumine', at: DEUX},
				{label: 'préalbumine', at: DEUX + 6, tone: LPI.pink},
				{label: 'haptoglobine', at: TROIS},
			]}
			notes={[
				{text: 'globules rouges détruits', at: DETR - 6, size: 36},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[MAL + 1, DEUX + 1, TROIS + 1, DETR + 1]}
		/>
	);
};

export const Albumine: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('albumine', 'un');
	const ABOND = at('albumine', 'abondante');
	const FOIE = at('albumine', 'foie.');
	const RETIENT = at('albumine', 'retient');
	const NORME = at('albumine', 'norme');
	const DENUT = at('albumine', 'dénutrition,');
	const REINS = at('albumine', 'reins,');
	const OEDEMES = at('albumine', 'œdèmes');
	const swell = interpolate(frame, [OEDEMES - 6, OEDEMES + 16], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={"*L'albumine*"}
			titleAt={UN}
			explain={{text: 'la plus abondante du sang, faite par le foie', at: ABOND - 6, to: RETIENT - 4}}
			art={{
				at: FOIE - 6,
				node: (
					<Live
						render={(f) =>
							f < OEDEMES - 8 ? (
								<IconDot size={260}><FattyLiverIcon size={190} /></IconDot>
							) : (
								<Ankles swell={swell} width={420} />
							)
						}
					/>
				),
			}}
			artY={770}
			norm={{rows: [['', '35 – 50 g/L']], at: NORME - 4, y: 1070}}
			chips={[
				{label: "elle retient l'eau dans les vaisseaux", at: RETIENT - 2, tone: LPI.paper},
				{label: 'trop basse : dénutrition', at: DENUT - 4, tone: LPI.pink},
				{label: 'foie malade · pertes par les reins', at: REINS - 8, icon: <KidneysIcon size={40} />},
			]}
			note={{text: 'parfois des œdèmes', at: OEDEMES - 4, size: 36}}
			punches={[ABOND + 1, FOIE + 1, RETIENT + 1, NORME + 1, DENUT + 1, OEDEMES + 1]}
		/>
	);
};

export const Prealb: React.FC = () => {
	const DEUX = at('prealb', 'deux');
	const JOURS = at('prealb', 'jours');
	const TEMOIN = at('prealb', 'témoin');
	const RENUT = at('prealb', 'renutrition');
	const NORME = at('prealb', 'norme');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La *préalbumine*'}
			titleAt={DEUX}
			titleSize={100}
			pink
			explain={{text: 'elle ne vit que 2 jours', at: JOURS - 6}}
			art={{
				at: JOURS - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
								<div style={{width: 230, height: 230, borderRadius: 115, background: LPI.paper, border: `8px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: FONT.title, fontWeight: 900, color: N}}>
									<div style={{fontSize: 110, lineHeight: 1}}>2</div>
									<div style={{fontSize: 40}}>jours</div>
								</div>
								<div style={{opacity: f >= RENUT - 6 ? 1 : 0}}><PlateSvg r={120} /></div>
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '≈ 0,2 – 0,4 g/L']], at: NORME - 4}}
			chips={[
				{label: 'dénutrition récente', at: TEMOIN + 6},
				{label: 'la renutrition marche ?', at: RENUT - 4, tone: LPI.navy},
			]}
			punches={[JOURS + 1, TEMOIN + 1, RENUT + 1, NORME + 1]}
		/>
	);
};

export const Hapto: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('hapto', 'trois');
	const ATTRAPE = at('hapto', 'attrape');
	const ECLAT = at('hapto', 'éclatent.');
	const EFF = at('hapto', 'effondrée,');
	const HEMO = at('hapto', 'hémolyse.');
	const NORME = at('hapto', 'norme');
	const burst = interpolate(frame, [ECLAT - 8, ECLAT + 10], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={"*L'haptoglobine*"}
			titleAt={TROIS}
			titleSize={100}
			explain={{text: "elle attrape l'hémoglobine libérée", at: ATTRAPE - 4}}
			art={{at: ATTRAPE, node: <Live render={() => <BurstCell burst={burst} size={300} />} />}}
			artY={800}
			norm={{rows: [['', '≈ 0,3 – 2 g/L']], at: NORME - 4}}
			chips={[
				{label: 'globules rouges qui éclatent', at: ECLAT - 6, tone: LPI.pink},
				{label: 'effondrée = hémolyse', at: EFF - 2, tone: LPI.navy},
			]}
			punches={[ATTRAPE + 1, ECLAT + 1, EFF + 1, HEMO + 1, NORME + 1]}
			sfx={[{name: 'buzz', at: EFF}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const ALB = at('fin', 'albumine,');
	const PRE = at('fin', 'préalbumine,');
	const HAP = at('fin', 'haptoglobine');
	const PROT = at('fin', 'protéines.');
	const PROCH = at('fin', 'prochaine');
	const ELEC = at('fin', "l'électrophorèse");
	return (
		<LabFin
			series={S}
			title={'Les *protéines*'}
			pink
			rows={[
				{t: ALB, title: 'albumine', sub: '35 – 50 g/L · dénutrition'},
				{t: PRE, title: 'préalbumine', sub: '≈ 0,2 – 0,4 g/L · récent'},
				{t: HAP, title: 'haptoglobine', sub: '≈ 0,3 – 2 g/L · hémolyse'},
			]}
			check={PROT}
			next={{at: PROCH, artAt: ELEC, children: <NextTitle pre="l'" hot="électrophorèse" />}}
		/>
	);
};
