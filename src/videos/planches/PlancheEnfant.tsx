// Planches de contrôle des dessins « constantes de l'enfant » (src/brand/kids.tsx), en image fixe :
// `npx remotion still Planche-Enfant out/planche.png --frame=30 --props='{"page":1}'`
// page 1 : le bébé et ses états ; page 2 : pied, couche + balance, brassards, courbes, objets, moniteur, cartes des âges.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AgeTable, Baby, BabyFoot, Bottle, CompChart, Cuff, Diaper, KidMonitor, KitchenScale, Pleth, ThermoStick} from '../../brand/kids';
import {FONT, LPI} from '../../brand/theme';

const N = LPI.navy;
const Cell: React.FC<{x: number; y: number; label: string; children: React.ReactNode}> = ({x, y, label, children}) => (
	<div style={{position: 'absolute', left: x, top: y}}>
		{children}
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 26, color: N, marginTop: 6}}>{label}</div>
	</div>
);

export const PlancheEnfant: React.FC<{page: number}> = ({page}) => (
	<AbsoluteFill style={{background: LPI.paper}}>
		{page === 1 ? (
			<>
				<Cell x={30} y={40} label="calme">
					<Baby size={320} />
				</Cell>
				<Cell x={380} y={40} label="tirage + ailes + geignement">
					<Baby size={320} breath={1} retract={1} flare={1} moan={1} mood="mal" />
				</Cell>
				<Cell x={730} y={40} label="nez bouché">
					<Baby size={320} snot={1} />
				</Cell>
				<Cell x={30} y={500} label="bonnet + fièvre">
					<Baby size={320} bonnet={1} fever={1} />
				</Cell>
				<Cell x={380} y={500} label="stéthoscope">
					<Baby size={320} steth={1} />
				</Cell>
				<Cell x={730} y={500} label="capteur au pied">
					<Baby size={320} sensor={1} />
				</Cell>
				<Cell x={30} y={960} label="tout mou">
					<Baby size={320} limp={1} />
				</Cell>
				<Cell x={380} y={960} label="pleure">
					<Baby size={320} mood="pleure" />
				</Cell>
				<Cell x={730} y={960} label="tremble">
					<Baby size={320} shake={1} />
				</Cell>
			</>
		) : (
			<>
				<Cell x={30} y={30} label="talon">
					<BabyFoot width={200} zones={1} prick={1} drop={1} />
				</Cell>
				<Cell x={280} y={60} label="couche + balance">
					<KitchenScale width={360} grams={75}>
						<Diaper width={200} wet={1} />
					</KitchenScale>
				</Cell>
				<Cell x={680} y={60} label="brassards">
					<div style={{display: 'flex', alignItems: 'flex-end', gap: 16}}>
						<Cuff width={80} label="S" />
						<Cuff width={110} label="M" />
						<Cuff width={150} label="L" />
					</div>
				</Cell>
				<Cell x={30} y={420} label="courbes">
					<CompChart width={520} t={1} fall={1} />
				</Cell>
				<Cell x={600} y={420} label="thermomètre · biberon">
					<div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
						<ThermoStick width={300} />
						<Bottle width={80} />
					</div>
				</Cell>
				<Cell x={600} y={680} label="courbe propre / brouillée">
					<Pleth width={420} />
					<Pleth width={420} noise={1} color={LPI.pink} />
				</Cell>
				<Cell x={30} y={780} label="moniteur">
					<KidMonitor fr={45} fc={140} alarm={1} />
				</Cell>
				<div style={{position: 'absolute', left: 0, top: 1150}}>
					<AgeTable y={0} at={[0, 0, 0]} values={['100 – 160', '70 – 120', '60 – 100']} unit="battements / min" unitAt={0} />
				</div>
				<div style={{position: 'absolute', left: 0, top: 1520}}>
					<AgeTable y={0} at={[0, 0, 0]} values={['', '', '']} same={{text: 'fièvre ≥ 38 °C', at: 0}} />
				</div>
			</>
		)}
	</AbsoluteFill>
);
