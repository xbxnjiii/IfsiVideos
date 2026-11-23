// « Le tube jaune : l'allergologie » (n° 95, série courte du tube jaune, vidéo 18 ; directives Instagram). Accroche : il
// éternue chaque printemps, c'est une allergie ? 1 · principe (IgE ; allergènes : pollens, acariens, poils, aliments) ;
// 2 · Phadiatop (dépistage, mélange d'allergènes respiratoires ; négatif : allergie respiratoire peu probable) + Trophatop
// (aliments) ; 3 · IgE spécifiques (ex-RAST : un allergène à la fois ; un positif doit concorder avec les symptômes).
// Sources : HAS 2005 (indications du dosage des IgE spécifiques dans le diagnostic et le suivi des allergies) ; SFA
// (sensibilisation ≠ allergie : interpréter avec la clinique).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {Plate} from '../../brand/diabetes';
import {Microbe} from '../../brand/hands';
import {Cat} from '../../brand/injury';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: "LE TUBE JAUNE · L'ALLERGOLOGIE", total: 3};

/** Fleur de pollen. */
const Pollen: React.FC<{size?: number}> = ({size = 120}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-60 -60 120 120" style={{overflow: 'visible'}}>
			{Array.from({length: 6}).map((_, i) => (
				<ellipse key={i} cx={0} cy={-26} rx={14} ry={24} fill={LPI.pink} stroke={N} strokeWidth={4} transform={`rotate(${i * 60})`} />
			))}
			<circle r={16} fill={LPI.sky} stroke={N} strokeWidth={4} />
			{[0, 1, 2].map((i) => {
				const t = ((frame / 40 + i / 3) % 1);
				return <circle key={i} cx={20 + t * 40} cy={-20 - t * 30 + i * 12} r={4} fill={LPI.blue} opacity={1 - t} />;
			})}
		</svg>
	);
};

const ALLERGENS: {name: string; node: React.ReactNode}[] = [
	{name: 'pollens', node: <Pollen size={110} />},
	{name: 'acariens', node: <Microbe size={90} tone={LPI.sky} />},
	{name: 'chat', node: <Cat size={110} />},
	{name: 'aliments', node: <Plate size={110} />},
];

/** Rangée des allergènes ; `on[i]` allume, `pick` = celui qu'on isole (IgE spécifiques). */
const Allergens: React.FC<{on: number[]; pick?: number; mix?: number}> = ({on, pick = -1, mix = 0}) => (
	<div style={{position: 'relative', display: 'flex', gap: 18}}>
		{ALLERGENS.map((a, i) => {
			const v = on[i] ?? 0;
			const isPick = i === pick;
			return (
				<div key={a.name} style={{width: 190, height: 210, borderRadius: 30, border: `6px solid ${alpha(N, 0.3 + 0.7 * v)}`, background: isPick ? LPI.pink : LPI.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pick >= 0 && !isPick ? 0.3 : 0.25 + 0.75 * v, transform: `scale(${0.88 + 0.12 * v + (isPick ? 0.08 : 0)})`}}>
					{a.node}
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>{a.name}</div>
				</div>
			);
		})}
		{mix > 0 && (
			<div style={{position: 'absolute', left: -14, top: -14, width: 3 * 208 - 18 + 28, height: 238, borderRadius: 38, border: `7px dashed ${LPI.blue}`, opacity: mix}} />
		)}
	</div>
);

/** Anticorps IgE (Y). */
const IgE: React.FC<{size?: number}> = ({size = 140}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<svg width={size} height={size} viewBox="-50 -50 100 100">
			<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={N} strokeWidth={18} strokeLinecap="round" fill="none" />
			<path d="M0 40 V0 M0 0 L-28 -34 M0 0 L28 -34" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" fill="none" />
		</svg>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>IgE</div>
	</div>
);

export const Hook: React.FC = () => {
	const ETERNUE = at('intro', 'éternue');
	const YEUX = at('intro', 'yeux');
	const ALL = at('intro', 'allergie ?');
	const TROIS = at('intro', 'trois');
	const CONN = at('intro', 'connais ?');
	return (
		<LabHook
			series={S}
			title={"*L'allergie*\ndans le tube *jaune*"}
			art={<Live render={(f) => <div style={{transform: `rotate(${f >= ETERNUE && f < ETERNUE + 12 ? 6 * Math.sin(f) : 0}deg)`}}><Pollen size={260} /></div>} />}
			chips={[
				{label: 'Phadiatop', at: TROIS},
				{label: 'Trophatop', at: TROIS + 6, tone: LPI.pink},
				{label: 'IgE spécifiques', at: TROIS + 12},
			]}
			notes={[
				{text: 'il éternue chaque printemps', at: ETERNUE - 4},
				{text: 'une allergie ?', at: ALL - 4},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[ETERNUE + 1, YEUX + 1, ALL + 1, TROIS + 1]}
		/>
	);
};

export const Ige: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('ige', 'un');
	const SPEC = at('ige', 'spéciaux,');
	const E = at('ige', 'e.');
	const CHERCHE = at('ige', 'cherche');
	const POL = at('ige', 'pollens,');
	const ACA = at('ige', 'acariens,');
	const CHAT = at('ige', 'chat,');
	const ALIM = at('ige', 'aliments.');
	const ts = [POL, ACA, CHAT, ALIM];
	const on = ts.map((t) => interpolate(frame, [t - 4, t + 6], [0, 1], clamp));
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *principe*'}
			titleAt={UN}
			explain={{text: 'des anticorps spéciaux : les IgE', at: SPEC - 6}}
			art={{at: SPEC - 4, node: <Live render={(f) => (f < CHERCHE ? <IgE size={200} /> : <Allergens on={on} />)} />}}
			artY={800}
			chips={[{label: 'contre ce qui déclenche l’allergie', at: CHERCHE + 4, tone: LPI.pink}]}
			punches={[SPEC + 1, E + 1, POL + 1, ACA + 1, CHAT + 1, ALIM + 1]}
		/>
	);
};

export const Phadiatop: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('phadiatop', 'deux');
	const DEP = at('phadiatop', 'dépistage');
	const MEL = at('phadiatop', 'mélange');
	const NEG = at('phadiatop', 'négatif,');
	const PROB = at('phadiatop', 'probable.');
	const TROPH = at('phadiatop', 'trophatop');
	const mix = interpolate(frame, [MEL - 4, MEL + 10], [0, 1], clamp);
	const food = interpolate(frame, [TROPH - 4, TROPH + 8], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *Phadiatop*'}
			titleAt={DEUX}
			pink
			explain={{text: 'un test de dépistage', at: DEP - 6}}
			art={{at: DEP - 4, node: <Live render={() => <Allergens on={[1, 1, 1, food]} mix={mix * (1 - food)} pick={food > 0.5 ? 3 : -1} />} />}}
			artY={800}
			chips={[
				{label: 'mélange des allergènes respirés', at: MEL - 4},
				{label: 'négatif : allergie respiratoire peu probable', at: PROB - 14, tone: LPI.navy},
				{label: 'Trophatop : les aliments', at: TROPH - 2, tone: LPI.pink},
			]}
			punches={[DEP + 1, MEL + 1, NEG + 1, PROB + 1, TROPH + 1]}
		/>
	);
};

export const Rast: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('rast', 'trois');
	const RAST = at('rast', 'rast.');
	const SEUL = at('rast', 'seul');
	const CAUSE = at('rast', 'cause.');
	const MAIS = at('rast', 'mais');
	const SYMPT = at('rast', 'symptômes');
	const pick = frame < SEUL - 4 ? -1 : Math.floor(interpolate(frame, [SEUL - 4, CAUSE], [0, 2.99], clamp));
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *IgE* spécifiques'}
			titleAt={TROIS}
			titleSize={100}
			explain={{text: 'autrefois appelées RAST', at: RAST - 10}}
			art={{at: RAST - 6, node: <Live render={() => <Allergens on={[1, 1, 1, 1]} pick={pick} />} />}}
			artY={800}
			chips={[
				{label: 'un seul allergène à la fois', at: SEUL - 2},
				{label: 'positif ne suffit pas', at: MAIS + 10, tone: LPI.pink},
				{label: 'il doit coller aux symptômes', at: SYMPT - 6, tone: LPI.navy},
			]}
			punches={[RAST + 1, SEUL + 1, CAUSE + 1, MAIS + 1, SYMPT + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const PHA = at('fin', 'phadiatop');
	const SPEC = at('fin', 'spécifiques');
	const COUP = at('fin', 'coupable.');
	const PROCH = at('fin', 'prochaine');
	const MED = at('fin', 'médicaments,');
	return (
		<LabFin
			series={S}
			title={"*L'allergologie*"}
			rows={[
				{t: PHA, title: 'IgE', sub: "les anticorps de l'allergie"},
				{t: PHA + 10, title: 'Phadiatop · Trophatop', sub: 'dépister (respirés · aliments)'},
				{t: SPEC, title: 'IgE spécifiques', sub: 'trouver le coupable + symptômes'},
			]}
			check={COUP}
			next={{at: PROCH, artAt: MED, children: <NextTitle pre="les " hot="médicaments" post=" : digoxine, lithium" />}}
		/>
	);
};
