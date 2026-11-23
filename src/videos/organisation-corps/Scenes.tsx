// « L'organisation du corps humain » (n° 101, 1re vidéo du thème « l'anatomie » ; directives Instagram). Accroche :
// 37 000 milliards de cellules rangées en 5 niveaux. Un même fil rouge, le cœur : 1 · la cellule (plus petite unité vivante :
// membrane, cytoplasme, noyau avec l'ADN ; une cellule du muscle cardiaque) ; 2 · le tissu (cellules semblables ; 4 types :
// épithélial recouvre, conjonctif soutient, musculaire se contracte, nerveux transmet) ; 3 · l'organe (plusieurs tissus,
// une mission : le cœur = muscle + conjonctif + nerveux) ; 4 · l'appareil ou système (organes qui coopèrent : cœur +
// vaisseaux = appareil cardiovasculaire) ; 5 · l'organisme (tous les appareils réunis : toi).
// Sources : Bianconi E. et al., « An estimation of the number of cells in the human body », Ann Hum Biol 2013 (≈ 3,7 × 10¹³
// cellules) ; Marieb & Hoehn, Anatomie et physiologie humaines (niveaux d'organisation, 4 tissus fondamentaux).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion} from '../../brand/labshort';
import {Patient} from '../../brand/patient';
import {Heart} from '../../brand/pictos';
import {Pop} from '../../brand/short';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: LPI.pink, label: "L'ANATOMIE · L'ORGANISATION", total: 5};
const beatOf = (f: number) => Math.max(0, Math.sin(f / 4.5)) ** 3;

/** Cellule ronde : membrane, cytoplasme, noyau + ADN ; `lab` (0 → 3) fait apparaître les étiquettes. */
const Cell: React.FC<{size?: number; lab?: number}> = ({size = 380, lab = 0}) => {
	const frame = useCurrentFrame();
	const tag = (on: number, x: number, y: number, t: string, ax: number, ay: number) => (
		<g opacity={on}>
			<line x1={x} y1={y} x2={ax} y2={ay} stroke={N} strokeWidth={4} />
			<circle cx={ax} cy={ay} r={7} fill={N} />
			<rect x={x - (t.length * 15 + 30) / 2} y={y - 28} width={t.length * 15 + 30} height={52} rx={26} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<text x={x} y={y + 9} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>{t}</text>
		</g>
	);
	const w = 1 + 0.02 * Math.sin(frame / 10);
	return (
		<svg width={size} height={size} viewBox="-200 -200 400 400" style={{overflow: 'visible'}}>
			<ellipse rx={150 * w} ry={138 / w} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={8} />
			{[[-80, -50], [70, -70], [-40, 80], [90, 60], [-100, 20]].map(([x, y], i) => (
				<ellipse key={i} cx={x} cy={y} rx={18} ry={9} fill={alpha(LPI.blue, 0.5)} transform={`rotate(${i * 40} ${x} ${y})`} />
			))}
			<circle r={52} fill={LPI.pink} stroke={N} strokeWidth={6} />
			<path d={Array.from({length: 17}, (_, i) => `${i ? 'L' : 'M'}${-32 + i * 4} ${Math.sin(i / 1.6 + frame / 8) * 14}`).join(' ')} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			{tag(clamp01(lab), -130, -190, 'membrane', -95, -110)}
			{tag(clamp01(lab - 1), 120, 190, 'cytoplasme', 80, 80)}
			{tag(clamp01(lab - 2), 150, -190, 'noyau + ADN', 35, -40)}
		</svg>
	);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Cellule du muscle cardiaque : allongée, striée, un noyau central. */
const HeartCell: React.FC<{size?: number}> = ({size = 360}) => (
	<svg width={size} height={size * 0.5} viewBox="-180 -90 360 180">
		<path d="M-170 -40 L-120 -60 L120 -60 L170 -30 L170 40 L120 60 L-120 60 L-170 30 Z" fill={alpha(LPI.pink, 0.75)} stroke={N} strokeWidth={7} strokeLinejoin="round" />
		{Array.from({length: 15}).map((_, i) => (
			<line key={i} x1={-140 + i * 20} y1={-52} x2={-140 + i * 20} y2={52} stroke={alpha(N, 0.35)} strokeWidth={5} />
		))}
		<ellipse rx={36} ry={22} fill={LPI.sky} stroke={N} strokeWidth={5} />
	</svg>
);

/** Les 4 tissus ; `on[i]` allume chacun. */
const TISSUES = ['épithélial', 'conjonctif', 'musculaire', 'nerveux'];
const TissueArt: React.FC<{k: number}> = ({k}) => {
	const frame = useCurrentFrame();
	if (k === 0)
		return (
			<svg width={170} height={120} viewBox="0 0 170 120">
				{Array.from({length: 5}).map((_, i) => (
					<g key={i}>
						<rect x={6 + i * 32} y={30} width={30} height={60} rx={6} fill={LPI.sky} stroke={N} strokeWidth={4} />
						<circle cx={21 + i * 32} cy={62} r={7} fill={LPI.pink} />
					</g>
				))}
			</svg>
		);
	if (k === 1)
		return (
			<svg width={170} height={120} viewBox="0 0 170 120">
				{[20, 45, 70, 95].map((y, i) => (
					<path key={y} d={`M5 ${y} C50 ${y - 18} 110 ${y + 18} 165 ${y}`} fill="none" stroke={i % 2 ? LPI.pink : LPI.blue} strokeWidth={5} />
				))}
				{[[40, 34], [110, 58], [70, 88]].map(([x, y]) => (
					<ellipse key={x} cx={x} cy={y} rx={14} ry={9} fill={LPI.paper} stroke={N} strokeWidth={4} />
				))}
			</svg>
		);
	if (k === 2) {
		const sq = 1 - 0.08 * beatOf(frame);
		return (
			<svg width={170} height={120} viewBox="0 0 170 120">
				<g transform={`translate(85 60) scale(${sq} 1) translate(-85 -60)`}>
					{[18, 50, 82].map((y) => (
						<g key={y}>
							<rect x={6} y={y} width={158} height={26} rx={13} fill={alpha(LPI.pink, 0.8)} stroke={N} strokeWidth={4} />
							{Array.from({length: 9}).map((_, i) => (
								<line key={i} x1={20 + i * 16} y1={y + 4} x2={20 + i * 16} y2={y + 22} stroke={alpha(N, 0.35)} strokeWidth={3} />
							))}
						</g>
					))}
				</g>
			</svg>
		);
	}
	const p = (frame / 20) % 1;
	return (
		<svg width={170} height={120} viewBox="0 0 170 120">
			<path d="M40 60 L160 60 M40 60 L15 25 M40 60 L12 60 M40 60 L18 95 M160 60 L168 40 M160 60 L168 80" stroke={N} strokeWidth={6} strokeLinecap="round" fill="none" />
			<circle cx={40} cy={60} r={20} fill={LPI.blue} stroke={N} strokeWidth={5} />
			<circle cx={60 + p * 100} cy={60} r={8} fill={LPI.pink} stroke={N} strokeWidth={3} />
		</svg>
	);
};
const Tissues: React.FC<{on: number[]; hot?: number}> = ({on, hot = -1}) => (
	<div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, width: 800}}>
		{TISSUES.map((t, i) => {
			const v = on[i] ?? 0;
			return (
				<div key={t} style={{height: 210, borderRadius: 30, border: `6px solid ${N}`, background: i === hot ? alpha(LPI.pink, 0.45) : LPI.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 0.2 + 0.8 * v, transform: `scale(${0.9 + 0.1 * v})`}}>
					<TissueArt k={i} />
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>{t}</div>
				</div>
			);
		})}
	</div>
);

/** Les 5 niveaux en escalier ; `n` niveaux allumés, `hot` = niveau en avant. */
const LEVELS = ['cellule', 'tissu', 'organe', 'appareil', 'organisme'];
const Ladder: React.FC<{n: number; hot?: number; width?: number}> = ({n, hot = -1, width = 860}) => (
	<div style={{width, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12}}>
		{LEVELS.map((l, i) => {
			const v = clamp01(n - i);
			const h = 90 + i * 45;
			return (
				<div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.2 + 0.8 * v}}>
					<div style={{width: 150, height: h, borderRadius: 24, background: i === hot ? LPI.pink : i % 2 ? alpha(LPI.pink, 0.55) : LPI.sky, border: `5px solid ${N}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 10, boxSizing: 'border-box', transform: `scaleY(${0.6 + 0.4 * v})`, transformOrigin: 'bottom'}}>
						<div style={{width: 46, height: 46, borderRadius: 23, background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
					</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N}}>{l}</div>
				</div>
			);
		})}
	</div>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MIL = at('intro', 'milliards');
	const CELL = at('intro', 'cellules…');
	const RANGE = at('intro', 'rangé,');
	const CINQ = at('intro', 'cinq');
	const LESQ = at('intro', 'lesquels ?');
	const count = Math.round(interpolate(frame, [0, MIL + 8], [0, 37000], clamp));
	return (
		<LabHook
			series={S}
			title={"L'organisation\ndu *corps* *humain*"}
			titleSize={82}
			lead={<Live render={(f) => <div style={{transform: `scale(${1 + 0.05 * Math.sin(f / 8)})`}}><svg width={150} height={150} viewBox="-75 -75 150 150"><circle r={62} fill={alpha(LPI.sky, 0.9)} stroke={N} strokeWidth={6} /><circle r={24} fill={LPI.pink} stroke={N} strokeWidth={5} /></svg></div>} />}
			art={
				<Live
					render={(f) =>
						f < RANGE - 6 ? (
							<div style={{fontFamily: FONT.title, fontWeight: 900, color: N, textAlign: 'center', width: 520}}>
								<div style={{fontSize: 96, lineHeight: 1}}>{count.toLocaleString('fr-FR')}</div>
								<div style={{fontSize: 40, opacity: f >= MIL - 4 ? 1 : 0}}>milliards de cellules</div>
							</div>
						) : (
							<div style={{transform: 'scale(0.6)'}}><Ladder n={interpolate(f, [CINQ - 10, CINQ + 30], [0, 5], clamp)} /></div>
						)
					}
				/>
			}
			chips={[]}
			notes={[
				{text: 'parfaitement rangé', at: RANGE - 4},
				{text: 'tu sais lesquels ?', at: LESQ - 6},
			]}
			punches={[MIL + 1, CELL + 1, RANGE + 1, CINQ + 1]}
			shakes={[MIL + 9]}
		/>
	);
};

export const Cellule: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('cellule', 'un');
	const PETITE = at('cellule', 'petite');
	const MEMB = at('cellule', 'membrane');
	const CYTO = at('cellule', 'cytoplasme');
	const NOYAU = at('cellule', 'noyau');
	const PRENONS = at('cellule', 'prenons');
	const lab = interpolate(frame, [MEMB - 4, MEMB + 4, CYTO - 4, CYTO + 4, NOYAU - 4, NOYAU + 4], [0, 1, 1, 2, 2, 3], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La *cellule*'}
			titleAt={UN}
			explain={{text: 'la plus petite unité vivante', at: PETITE - 6}}
			art={{at: PETITE - 4, node: <Live render={(f) => (f < PRENONS - 4 ? <Cell size={420} lab={lab} /> : <HeartCell size={420} />)} />}}
			artY={840}
			chips={[{label: 'ici : une cellule du muscle du cœur', at: PRENONS - 2, tone: LPI.pink}]}
			punches={[PETITE + 1, MEMB + 1, CYTO + 1, NOYAU + 1, PRENONS + 1]}
		/>
	);
};

export const Tissu: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('tissu', 'deux');
	const SEMB = at('tissu', 'semblables');
	const QUATRE = at('tissu', 'quatre :');
	const ts = [at('tissu', "l'épithélial,"), at('tissu', 'conjonctif,'), at('tissu', 'musculaire,'), at('tissu', 'nerveux,')];
	const verbs = [at('tissu', 'recouvre,'), at('tissu', 'soutient,'), at('tissu', 'contracte,'), at('tissu', 'transmet')];
	const on = ts.map((t) => interpolate(frame, [t - 6, t + 4], [0, 1], clamp));
	const hot = ts.filter((t) => frame >= t - 6).length - 1;
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *tissu*'}
			titleAt={DEUX}
			pink
			explain={{text: 'des cellules semblables, ensemble', at: SEMB - 6}}
			art={{at: QUATRE - 6, node: <Live render={() => <Tissues on={on} hot={hot} />} />}}
			artY={860}
			chips={[
				{label: 'recouvre', at: verbs[0] - 2},
				{label: 'soutient', at: verbs[1] - 2, tone: LPI.pink},
				{label: 'se contracte', at: verbs[2] - 4},
				{label: 'transmet', at: verbs[3] - 2, tone: LPI.pink},
			]}
			punches={[SEMB + 1, QUATRE + 1, ...ts.map((t) => t + 1)]}
		/>
	);
};

export const Organe: React.FC = () => {
	const TROIS = at('organe', 'trois');
	const PLUS = at('organe', 'plusieurs');
	const MISSION = at('organe', 'mission.');
	const COEUR = at('organe', 'cœur');
	const MUSCLE = at('organe', 'muscle,');
	const CONJ = at('organe', 'conjonctif');
	const NERV = at('organe', 'nerveux.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={"*L'organe*"}
			titleAt={TROIS}
			explain={{text: 'plusieurs tissus, une même mission', at: PLUS - 6}}
			art={{at: COEUR - 8, node: <Live render={(f) => <Heart size={330} beat={beatOf(f)} />} />}}
			artY={820}
			chips={[
				{label: 'muscle', at: MUSCLE - 2, tone: LPI.pink},
				{label: 'conjonctif', at: CONJ - 2},
				{label: 'nerveux', at: NERV - 2, tone: LPI.pink},
			]}
			punches={[PLUS + 1, MISSION + 1, COEUR + 1, MUSCLE + 1, CONJ + 1, NERV + 1]}
			sfx={[{name: 'heartbeat', at: COEUR, volume: 0.25}]}
		/>
	);
};

export const Appareil: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('appareil', 'quatre');
	const SYST = at('appareil', 'système :');
	const COOP = at('appareil', 'coopèrent.');
	const VAISS = at('appareil', 'vaisseaux');
	const CARDIO = at('appareil', 'cardiovasculaire.');
	const flow = interpolate(frame, [VAISS - 6, VAISS + 16], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={"*L'appareil*"}
			titleAt={QUATRE}
			pink
			explain={{text: 'ou système : des organes qui coopèrent', at: SYST - 8}}
			art={{at: COOP - 10, node: <Live render={(f) => <Patient size={330} heart={1} beat={beatOf(f)} flow={flow} />} />}}
			artY={880}
			chips={[{label: 'cœur + vaisseaux = cardiovasculaire', at: CARDIO - 10, tone: LPI.navy}]}
			punches={[SYST + 1, COOP + 1, VAISS + 1, CARDIO + 1]}
		/>
	);
};

export const Organisme: React.FC = () => {
	const frame = useCurrentFrame();
	const CINQ = at('organisme', 'cinq');
	const TOUS = at('organisme', 'tous');
	const TOI = at('organisme', 'toi !');
	const all = interpolate(frame, [TOUS - 4, TOUS + 30], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 4], [CINQ, 5]]}
			title={"*L'organisme*"}
			titleAt={CINQ}
			explain={{text: 'tous les appareils réunis', at: TOUS - 4}}
			art={{at: TOUS - 6, node: <Live render={(f) => <Patient size={330} mood={f >= TOI - 4 ? 'content' : 'calme'} heart={1} beat={beatOf(f)} flow={1} lungs={all} breath={Math.max(0, Math.sin(f / 20)) * all} brain={clamp01(all * 1.5 - 0.5)} />} />}}
			artY={880}
			chips={[{label: "et l'organisme… c'est toi !", at: TOI - 10, tone: LPI.pink}]}
			punches={[TOUS + 1, TOI + 1]}
			sfx={[{name: 'ding', at: TOI, volume: 0.2}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const ts = [at('fin', 'cellule,'), at('fin', 'tissu,'), at('fin', 'organe,'), at('fin', 'appareil,'), at('fin', 'organisme.')];
	const PROCH = at('fin', 'prochaine');
	return (
		<LabFin
			series={S}
			title={'Les *5* *niveaux*'}
			pink
			rows={[
				{t: ts[0], title: 'cellule', sub: 'la plus petite unité vivante'},
				{t: ts[1], title: 'tissu', sub: 'épithélial · conjonctif · musculaire · nerveux'},
				{t: ts[2], title: 'organe', sub: 'plusieurs tissus, une mission'},
				{t: ts[3], title: 'appareil (système)', sub: 'des organes qui coopèrent'},
				{t: ts[4], title: 'organisme', sub: 'toi !'},
			]}
			check={ts[4] + 6}
			done={
				<Pop at={PROCH - 2} x={540} y={1440}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, background: N, borderRadius: 40, padding: '22px 40px', whiteSpace: 'nowrap'}}>
						prochaine vidéo : <span style={{color: LPI.pink}}>la cellule</span>
					</div>
				</Pop>
			}
		/>
	);
};

