// « Les hémocultures » (n° 100, v2 refaite à la demande avec deux documents du propriétaire : le matériel en 8 objets et
// « combien de paires prélever »). Accroche : une hémoculture mal prélevée = une bactérie de la peau dans le flacon et des
// antibiotiques pour rien. 1 · le matériel (gants, garrot, compresses stériles, antiseptique alcoolique pour la peau, alcool
// à 70° pour les bouchons, aiguille à ailettes + corps de pompe, flacons aérobie / anaérobie, sparadrap) ; 2 · le volume
// (bactéries pas toujours présentes dans le sang : 40 – 60 mL chez l'adulte par épisode = 2 à 3 paires (4 à 6 flacons) sur
// 24 h ; ≈ 8 – 10 mL par flacon à l'écran) ; 3 · l'ordre (aérobie bouchon vert puis anaérobie bouchon orange ; ailettes :
// l'air de la tubulure part dans l'aérobie) ; 4 · l'asepsie (antiseptique alcoolique, séchage, ne plus palper ; alcool à
// 70° sur les bouchons). Fin : avant le 1er antibiotique, étiqueter, vite au labo.
// Sources : documents du propriétaire ; REMIC 2022 (SFM : 40 – 60 mL par épisode, 8 – 10 mL par flacon) ; SF2H 2020
// (antisepsie alcoolique, temps de séchage). Le visuel est dessiné par nous (l'image fournie n'est pas reprise).
// Couleurs des bouchons : vraies couleurs (HEMO_CAP), elles peuvent varier selon les marques.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {Microbe} from '../../brand/hands';
import {PillIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion} from '../../brand/labshort';
import {AntisepticBottle, Butterfly, Gauze, Hand, Holder, TourniquetStrap} from '../../brand/sampling';
import {Pop} from '../../brand/short';
import {alpha, FONT, LPI} from '../../brand/theme';
import {HEMO_CAP, HemoFlask} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: HEMO_CAP.aero, label: 'LES TUBES · LES HÉMOCULTURES', total: 4};

/** Flacon qui oscille doucement. */
const SwayFlask: React.FC<{cap: string; size?: number; level?: number}> = ({cap, size = 130, level = 0.6}) => (
	<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 14) * 4}deg)`}}><HemoFlask size={size} cap={cap} label="" level={level} /></div>} />
);

/** Flacon d'alcool à 70° (bouchons). */
const AlcoholBottle: React.FC<{size?: number}> = ({size = 110}) => (
	<svg width={size} height={size * 1.7} viewBox="0 0 140 240">
		<rect x={50} y={4} width={40} height={28} rx={6} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<path d="M24 70 Q24 36 56 36 H84 Q116 36 116 70 V220 Q116 236 100 236 H40 Q24 236 24 220 Z" fill={LPI.paper} stroke={N} strokeWidth={5} />
		<rect x={30} y={100} width={80} height={90} rx={10} fill={LPI.blue} />
		<text x={70} y={158} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={LPI.paper}>70°</text>
	</svg>
);

/** Rouleau de sparadrap. */
const TapeRoll: React.FC<{size?: number}> = ({size = 130}) => (
	<svg width={size} height={size} viewBox="0 0 140 140">
		<ellipse cx={70} cy={92} rx={58} ry={30} fill={alpha(N, 0.15)} />
		<path d="M12 50 V88 Q12 116 70 116 Q128 116 128 88 V50" fill={LPI.paper} stroke={N} strokeWidth={5} />
		<ellipse cx={70} cy={50} rx={58} ry={28} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<ellipse cx={70} cy={50} rx={26} ry={12} fill={LPI.sky} stroke={N} strokeWidth={4} />
		<path d="M128 88 L136 128 L110 116" fill={LPI.paper} stroke={N} strokeWidth={4} strokeLinejoin="round" />
	</svg>
);

const TRAY: {name: string; key: string; node: React.ReactNode}[] = [
	{name: 'gants', key: 'gants,', node: <Hand size={120} gloved={1} />},
	{name: 'garrot', key: 'garrot,', node: <TourniquetStrap size={170} />},
	{name: 'compresses stériles', key: 'compresses', node: <Gauze size={110} sterile />},
	{name: 'antiseptique (peau)', key: 'antiseptique', node: <AntisepticBottle size={70} />},
	{name: 'alcool 70° (bouchons)', key: "l'alcool", node: <AlcoholBottle size={70} />},
	{name: 'ailettes + corps de pompe', key: 'aiguille', node: <div style={{display: 'flex', alignItems: 'center', gap: 4}}><Butterfly size={130} /><Holder size={80} /></div>},
	{name: 'flacons', key: 'flacons,', node: <div style={{display: 'flex', gap: 6}}><HemoFlask size={52} cap={HEMO_CAP.aero} label="" /><HemoFlask size={52} cap={HEMO_CAP.anaero} label="" /></div>},
	{name: 'sparadrap', key: 'sparadrap.', node: <TapeRoll size={110} />},
];

/** Plateau des 8 objets ; `on[i]` (0 → 1) fait tomber l'objet i à sa place. */
const Tray: React.FC<{on: number[]; hot?: number}> = ({on, hot = -1}) => (
	<div style={{width: 900, padding: 24, borderRadius: 50, background: alpha(LPI.paper, 0.9), border: `7px solid ${N}`, boxShadow: `0 16px 40px ${alpha(N, 0.2)}`, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, boxSizing: 'border-box'}}>
		{TRAY.map((o, i) => {
			const v = on[i] ?? 0;
			return (
				<div key={o.name} style={{height: 300, borderRadius: 26, background: i === hot ? alpha(LPI.pink, 0.45) : alpha(LPI.sky, 0.35), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '12px 6px', boxSizing: 'border-box'}}>
					<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: v, transform: `translateY(${(1 - v) * -90}px) scale(${0.7 + 0.3 * v})`}}>{o.node}</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 27, lineHeight: 1.1, color: N, textAlign: 'center', opacity: v, display: 'flex', gap: 6, alignItems: 'center', maxWidth: '100%'}}>
						<span style={{display: 'inline-flex', width: 34, height: 34, borderRadius: 17, background: N, color: LPI.paper, alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0}}>{i + 1}</span>
						{o.name}
					</div>
				</div>
			);
		})}
	</div>
);

/** Frise de 24 h : paires de flacons qui s'ajoutent (`n` paires) et volume cumulé. */
const Pairs24: React.FC<{n: number}> = ({n}) => {
	const pairs = Math.max(1, Math.min(3, Math.floor(n + 0.001)));
	return (
		<div style={{width: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
			<div style={{display: 'flex', gap: 34, alignItems: 'flex-end', height: 240}}>
				{[0, 1, 2].map((i) => {
					const v = Math.max(0, Math.min(1, n - i));
					return (
						<div key={i} style={{display: 'flex', gap: 6, opacity: 0.15 + 0.85 * v, transform: `translateY(${(1 - v) * 30}px)`, border: i === 2 ? `5px dashed ${alpha(N, 0.5)}` : 'none', borderRadius: 26, padding: i === 2 ? 8 : 13}}>
							<HemoFlask size={80} cap={HEMO_CAP.aero} label="" level={v} />
							<HemoFlask size={80} cap={HEMO_CAP.anaero} label="" level={v} />
						</div>
					);
				})}
			</div>
			<div style={{width: 820, height: 14, borderRadius: 7, background: alpha(N, 0.2), position: 'relative'}}>
				<div style={{position: 'absolute', inset: 0, width: `${Math.min(1, n / 3) * 100}%`, borderRadius: 7, background: LPI.blue}} />
			</div>
			<div style={{display: 'flex', justifyContent: 'space-between', width: 820, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>
				<span>0 h</span>
				<span style={{fontSize: 44}}>{pairs} paire{pairs > 1 ? 's' : ''}</span>
				<span>24 h</span>
			</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MAL = at('intro', 'mal');
	const ANTI = at('intro', 'antibiotiques');
	const PEAU = at('intro', 'peau.');
	const MAT = at('intro', 'matériel,');
	const VOL = at('intro', 'volume,');
	const ORD = at('intro', "l'ordre,");
	const ASE = at('intro', "l'asepsie :");
	const TOUT = at('intro', 'tout ?');
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
				{label: 'le matériel', at: MAT - 2},
				{label: 'le volume', at: VOL - 2, tone: LPI.pink},
				{label: "l'ordre", at: ORD - 2},
				{label: "l'asepsie", at: ASE - 2, tone: LPI.pink},
			]}
			notes={[
				{text: 'une bactérie… de sa peau', at: PEAU - 14},
				{text: 'tu sais tout ?', at: TOUT - 6},
			]}
			punches={[MAL + 1, ANTI + 1, PEAU + 1, MAT + 1, VOL + 1, ORD + 1, ASE + 1]}
			shakes={[PEAU + 2]}
		/>
	);
};

export const Materiel: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('materiel', 'un');
	const MAT = at('materiel', 'matériel.');
	const ts = TRAY.map((o) => at('materiel', o.key));
	const on = ts.map((t) => interpolate(frame, [t - 6, t + 6], [0, 1], clamp));
	const hot = ts.filter((t) => frame >= t - 6).length - 1;
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *matériel*'}
			titleAt={UN}
			art={{at: MAT - 4, node: <Live render={() => <Tray on={on} hot={hot} />} />}}
			artY={960}
			punches={ts.map((t) => t + 1)}
			sfx={ts.map((t) => ({name: 'pop' as const, at: t, volume: 0.15}))}
		/>
	);
};

export const Volume: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('volume', 'deux');
	const BACT = at('volume', 'bactéries');
	const PREL = at('volume', 'prélève,');
	const QUAR = at('volume', 'quarante');
	const PAIRES = at('volume', 'paires');
	const H24 = at('volume', 'vingt-quatre');
	const n = interpolate(frame, [PREL - 6, PAIRES + 20], [0.6, 3], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *volume*'}
			titleAt={DEUX}
			pink
			explain={{text: 'plus on prélève, plus on la trouve', at: PREL - 6}}
			art={{at: BACT - 4, node: <Live render={() => <Pairs24 n={n} />} />}}
			artY={820}
			norm={{rows: [['adulte', '40 – 60 mL']], at: QUAR - 4, y: 1120}}
			chips={[
				{label: '2 à 3 paires, sur 24 h', at: PAIRES - 6, tone: LPI.navy},
				{label: '≈ 8 – 10 mL par flacon', at: H24 + 4},
			]}
			punches={[BACT + 1, PREL + 1, QUAR + 1, PAIRES + 1, H24 + 1]}
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
	const ANTIS = at('asepsie', 'antiseptique');
	const SECHER = at('asepsie', 'sécher,');
	const TOUCHE = at('asepsie', 'touche');
	const ALC = at('asepsie', "d'alcool");
	const BOUCHON = at('asepsie', 'bouchon');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={"*L'asepsie*"}
			titleAt={QUATRE}
			pink
			art={{
				at: ANTIS - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'flex-end', gap: 50}}>
								<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
									<AntisepticBottle size={120} />
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>la peau</div>
								</div>
								<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: f >= ALC - 6 ? 1 : 0.15}}>
									<div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
										<AlcoholBottle size={90} />
										<HemoFlask size={90} cap={HEMO_CAP.aero} label="" />
									</div>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>les bouchons</div>
								</div>
							</div>
						)}
					/>
				),
			}}
			artY={800}
			chips={[
				{label: 'antiseptique alcoolique', at: ANTIS - 2},
				{label: 'on laisse sécher', at: SECHER - 6, tone: LPI.pink},
				{label: 'on ne touche plus la veine', at: TOUCHE - 6, tone: LPI.navy},
				{label: 'alcool à 70° sur les bouchons', at: BOUCHON - 10},
			]}
			punches={[ANTIS + 1, SECHER + 1, TOUCHE + 1, ALC + 1, BOUCHON + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const AVANT = at('fin', 'avant');
	const ANTI = at('fin', 'antibiotique.');
	const ETIQ = at('fin', 'étiquette,');
	return (
		<LabFin
			series={S}
			title={'*Hémocultures*'}
			rows={[
				{t: AVANT - 30, title: 'le matériel', sub: '8 objets, 2 antiseptiques'},
				{t: AVANT - 20, title: '40 – 60 mL', sub: '2 à 3 paires sur 24 h'},
				{t: AVANT - 10, title: 'vert puis orange', sub: 'aérobie puis anaérobie'},
				{t: AVANT, title: "avant l'antibiotique", sub: 'peau sèche, ne plus toucher'},
			]}
			check={ANTI}
			done={
				<Pop at={ETIQ - 4} x={540} y={1230}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.paper, background: N, borderRadius: 40, padding: '24px 40px', textAlign: 'center', lineHeight: 1.25, whiteSpace: 'nowrap', boxShadow: `0 10px 30px ${alpha(N, 0.25)}`}}>
						étiqueter · vite au labo
						<div style={{fontSize: 30, color: LPI.pink}}>couleurs selon les marques</div>
					</div>
				</Pop>
			}
		/>
	);
};
