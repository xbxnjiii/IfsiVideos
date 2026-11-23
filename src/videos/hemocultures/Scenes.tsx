// « Les hémocultures » (n° 100, série « les tubes » ; directives Instagram). Accroche : une hémoculture mal prélevée = une
// bactérie de la peau dans le flacon et des antibiotiques pour rien. 1 · le bon moment (fièvre, frissons, hypothermie ;
// toujours avant la 1re dose d'antibiotique) ; 2 · le volume (8 – 10 mL par flacon chez l'adulte, en général 4 à 6 flacons
// en un seul prélèvement) ; 3 · l'ordre (aérobie bouchon vert puis anaérobie bouchon orange ; avec une aiguille à ailettes,
// l'air de la tubulure part dans l'aérobie) ; 4 · l'asepsie (friction hydro-alcoolique, antiseptique alcoolique, séchage,
// pas de palpation après, opercules désinfectés). Fin : étiqueter, acheminer vite au laboratoire.
// Sources : REMIC 2022 (SFM : prélèvement unique de 4 à 6 flacons, 8 – 10 mL par flacon chez l'adulte, volume = 1er
// facteur de sensibilité) ; SF2H 2020 (antisepsie alcoolique, temps de séchage) ; CLSI M47 (contamination < 3 %).
// Couleurs des bouchons : vraies couleurs (HEMO_CAP), elles peuvent varier selon les marques.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {Microbe} from '../../brand/hands';
import {FeverIcon, PillIcon, ShiverIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion} from '../../brand/labshort';
import {AntisepticBottle, ShaBottle} from '../../brand/sampling';
import {Pop} from '../../brand/short';
import {alpha, FONT, LPI} from '../../brand/theme';
import {HEMO_CAP, HemoFlask} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: HEMO_CAP.aero, label: 'LES TUBES · LES HÉMOCULTURES', total: 4};

/** Flacon qui oscille doucement. */
const SwayFlask: React.FC<{cap: string; label?: string; size?: number; level?: number; o2?: number; noO2?: number}> = ({cap, label = '', size = 130, level = 0.6, o2, noO2}) => (
	<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 14) * 4}deg)`}}><HemoFlask size={size} cap={cap} label={label} level={level} o2={o2} noO2={noO2} /></div>} />
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MAL = at('intro', 'mal');
	const ANTI = at('intro', 'antibiotiques');
	const PEAU = at('intro', 'peau.');
	const QUATRE = at('intro', 'quatre');
	const CONN = at('intro', 'connais ?');
	const jump = interpolate(frame, [PEAU - 30, PEAU], [0, 1], clamp);
	return (
		<LabHook
			series={S}
			title={'Les *hémocultures*\nsans erreur'}
			titleSize={78}
			lead={<SwayFlask cap={HEMO_CAP.aero} size={120} />}
			art={
				<Live
					render={(f) => (
						<div style={{position: 'relative', width: 420, height: 300}}>
							<div style={{position: 'absolute', left: 0, bottom: 0, width: 420, height: 70, borderRadius: 35, background: '#E8B896', border: `5px solid ${N}`}} />
							{[0, 1, 2].map((i) => (
								<div key={i} style={{position: 'absolute', left: 60 + i * 110 + jump * (150 - i * 40), bottom: 40 + jump * (160 - i * 20) * Math.sin(Math.PI * Math.min(1, jump * 1.2))}}>
									<Microbe size={70} tone={LPI.pink} seed={i} />
								</div>
							))}
							<div style={{position: 'absolute', right: 0, top: 0, opacity: f >= ANTI - 4 ? 1 : 0.15}}><PillIcon size={110} /></div>
						</div>
					)}
				/>
			}
			chips={[
				{label: 'le bon moment', at: QUATRE},
				{label: 'le volume', at: QUATRE + 5, tone: LPI.pink},
				{label: "l'ordre", at: QUATRE + 10},
				{label: "l'asepsie", at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[
				{text: 'une bactérie… de sa peau', at: PEAU - 14},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[MAL + 1, ANTI + 1, PEAU + 1, QUATRE + 1]}
			shakes={[PEAU + 2]}
		/>
	);
};

export const Quand: React.FC = () => {
	const UN = at('quand', 'un');
	const FIEVRE = at('quand', 'fièvre,');
	const FRISS = at('quand', 'frissons,');
	const BASSE = at('quand', 'basse.');
	const AVANT = at('quand', 'avant');
	const POUSS = at('quand', 'poussent');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le bon *moment*'}
			titleAt={UN}
			art={{
				at: FIEVRE - 6,
				node: (
					<Live
						render={(f) =>
							f < AVANT - 8 ? (
								<div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
									<FeverIcon size={150} />
									<div style={{opacity: f >= FRISS - 6 ? 1 : 0.15}}><ShiverIcon size={150} /></div>
								</div>
							) : (
								<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
									<HemoFlask size={110} cap={HEMO_CAP.aero} label="" level={0.6} />
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N}}>puis</div>
									<PillIcon size={150} />
								</div>
							)
						}
					/>
				),
			}}
			chips={[
				{label: 'fièvre', at: FIEVRE - 2},
				{label: 'frissons', at: FRISS - 2, tone: LPI.pink},
				{label: 'température basse', at: BASSE - 12},
				{label: 'avant antibiotique', at: AVANT - 4, tone: LPI.navy},
			]}
			note={{text: 'sinon, les bactéries ne poussent plus', at: POUSS - 12, size: 36}}
			punches={[FIEVRE + 1, FRISS + 1, BASSE + 1, AVANT + 1, POUSS + 1]}
		/>
	);
};

export const Volume: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('volume', 'deux');
	const TROUVE = at('volume', 'trouve');
	const REMPLIT = at('volume', 'remplit');
	const HUIT = at('volume', 'huit');
	const QUATRE = at('volume', 'quatre');
	const FOIS = at('volume', 'fois.');
	const fill = interpolate(frame, [REMPLIT - 4, HUIT + 14], [0.1, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *volume*'}
			titleAt={DEUX}
			pink
			explain={{text: "c'est lui qui trouve la bactérie", at: TROUVE - 4}}
			art={{
				at: TROUVE - 4,
				node: (
					<Live
						render={(f) =>
							f < QUATRE - 6 ? (
								<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
									<HemoFlask size={150} cap={HEMO_CAP.aero} label="" level={fill} />
									<div style={{fontFamily: FONT.title, fontWeight: 900, color: N, textAlign: 'center', opacity: f >= HUIT - 6 ? 1 : 0}}>
										<div style={{fontSize: 90, lineHeight: 1}}>8 – 10</div>
										<div style={{fontSize: 40}}>mL par flacon</div>
									</div>
								</div>
							) : (
								<div style={{display: 'flex', gap: 10}}>
									{Array.from({length: 6}).map((_, i) => (
										<div key={i} style={{opacity: i < 4 ? 1 : 0.45}}>
											<HemoFlask size={90} cap={i % 2 ? HEMO_CAP.anaero : HEMO_CAP.aero} label="" level={1} />
										</div>
									))}
								</div>
							)
						}
					/>
				),
			}}
			artY={800}
			chips={[
				{label: 'adulte : 8 à 10 mL par flacon', at: HUIT - 4, tone: LPI.paper},
				{label: 'en général 4 à 6 flacons, en une fois', at: QUATRE - 4, tone: LPI.navy},
			]}
			punches={[TROUVE + 1, REMPLIT + 1, HUIT + 1, QUATRE + 1, FOIS + 1]}
		/>
	);
};

export const Ordre: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('ordre', 'trois');
	const AERO = at('ordre', 'aérobie,');
	const VERT = at('ordre', 'vert,');
	const ANAERO = at('ordre', "l'anaérobie,");
	const ORANGE = at('ordre', 'orange.');
	const AILETTES = at('ordre', 'ailettes,');
	const AIR = at('ordre', "l'air");
	const PREMIER = at('ordre', 'premier.');
	const o2 = interpolate(frame, [AIR - 4, AIR + 10], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={"*L'ordre*"}
			titleAt={TROIS}
			art={{
				at: AERO - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'flex-end', gap: 50}}>
								{[
									{cap: HEMO_CAP.aero, n: '1', label: 'aérobie', t: AERO, o2},
									{cap: HEMO_CAP.anaero, n: '2', label: 'anaérobie', t: ANAERO, o2: 0},
								].map((x) => (
									<div key={x.n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: f >= x.t - 6 ? 1 : 0.15}}>
										<div style={{width: 74, height: 74, borderRadius: 37, background: x.cap, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.paper}}>{x.n}</div>
										<HemoFlask size={130} cap={x.cap} label="" level={0.7} o2={x.o2} noO2={x.n === '2' && f >= ORANGE ? 1 : 0} />
										<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>{x.label}</div>
									</div>
								))}
							</div>
						)}
					/>
				),
			}}
			artY={820}
			chips={[
				{label: 'aérobie : bouchon vert, en 1er', at: VERT - 6},
				{label: 'anaérobie : bouchon orange, en 2e', at: ORANGE - 6, tone: LPI.pink},
				{label: "ailettes : l'air de la tubulure part dans le 1er", at: AILETTES - 2, tone: LPI.navy},
			]}
			punches={[AERO + 1, VERT + 1, ANAERO + 1, ORANGE + 1, AILETTES + 1, PREMIER + 1]}
		/>
	);
};

export const Asepsie: React.FC = () => {
	const QUATRE = at('asepsie', 'quatre');
	const FRIC = at('asepsie', 'friction');
	const ANTIS = at('asepsie', 'antiseptique');
	const SECHER = at('asepsie', 'sécher,');
	const TOUCHE = at('asepsie', 'touche');
	const DESINF = at('asepsie', 'désinfecte');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={"*L'asepsie*"}
			titleAt={QUATRE}
			pink
			art={{
				at: FRIC - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'flex-end', gap: 40}}>
								<ShaBottle size={140} press={f >= FRIC && f < FRIC + 20 ? 1 : 0} />
								<div style={{opacity: f >= ANTIS - 6 ? 1 : 0.15}}><AntisepticBottle size={130} /></div>
								<div style={{opacity: f >= DESINF - 6 ? 1 : 0.15}}><HemoFlask size={100} cap={HEMO_CAP.aero} label="" level={0} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'friction des mains', at: FRIC - 2},
				{label: 'antiseptique', at: ANTIS - 2, tone: LPI.pink},
				{label: 'on laisse sécher', at: SECHER - 6},
				{label: 'ne plus toucher', at: TOUCHE - 6, tone: LPI.navy},
				{label: 'haut des flacons', at: DESINF - 2},
			]}
			punches={[FRIC + 1, ANTIS + 1, SECHER + 1, TOUCHE + 1, DESINF + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const AVANT = at('fin', 'avant');
	const REMPLIS = at('fin', 'remplis,');
	const VERT = at('fin', 'vert,');
	const ASEP = at('fin', 'asepsie');
	const ETIQ = at('fin', 'étiquette,');
	return (
		<LabFin
			series={S}
			title={'*Hémocultures*'}
			rows={[
				{t: AVANT, title: "avant l'antibiotique", sub: 'fièvre, frissons, hypothermie'},
				{t: REMPLIS, title: 'bien remplis', sub: '8 – 10 mL · 4 à 6 flacons'},
				{t: VERT, title: 'vert puis orange', sub: 'aérobie puis anaérobie'},
				{t: ASEP, title: 'asepsie parfaite', sub: 'sécher, ne plus toucher'},
			]}
			check={ETIQ}
			done={
				<Pop at={ETIQ + 6} x={540} y={1230}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.paper, background: N, borderRadius: 40, padding: '24px 40px', textAlign: 'center', lineHeight: 1.25, whiteSpace: 'nowrap', boxShadow: `0 10px 30px ${alpha(N, 0.25)}`}}>
						étiqueter · vite au labo
						<div style={{fontSize: 30, color: LPI.pink}}>couleurs selon les marques</div>
					</div>
				</Pop>
			}
		/>
	);
};

