// « Le tube jaune : l'auto-immunité (1) » (n° 97, série courte du tube jaune, vidéo 20 ; directives Instagram). Accroche :
// et si le corps s'attaquait lui-même ? 1 · AAN (anticorps antinucléaires : test de départ ; à faible taux, aussi chez des
// personnes en bonne santé) ; 2 · anti-ADN natif (très évocateurs du lupus : peau, articulations, reins) ; 3 · ENA
// (antigènes nucléaires solubles : précisent la cible quand les AAN sont positifs ; ex. anti-SSA / SSB du syndrome de
// Gougerot-Sjögren : yeux et bouche secs) ; 4 · ANCA (anticorps anti-cytoplasme des polynucléaires : vascularites des
// petits vaisseaux, reins et poumons).
// Sources : HAS 2017 (PNDS lupus systémique : AAN puis anti-ADN natif, anti-ENA) ; PNDS syndrome de Gougerot-Sjögren ;
// PNDS vascularites à ANCA (2019).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP, WhiteCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: "LE TUBE JAUNE · L'AUTO-IMMUNITÉ 1/2", total: 4};

/** Anticorps en Y orienté vers (0, 0). */
const Y: React.FC<{x: number; y: number; ang: number; s?: number; tone?: string}> = ({x, y, ang, s = 1, tone = LPI.pink}) => (
	<g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
		<path d="M0 40 V0 M0 0 L-24 -30 M0 0 L24 -30" stroke={N} strokeWidth={16} strokeLinecap="round" fill="none" />
		<path d="M0 40 V0 M0 0 L-24 -30 M0 0 L24 -30" stroke={tone} strokeWidth={9} strokeLinecap="round" fill="none" />
	</g>
);

/** Une de nos cellules, attaquée par des anticorps (`attack` 0 → 1) ; `target` : 'noyau' | 'adn'. */
const SelfCell: React.FC<{attack: number; target?: 'noyau' | 'adn'; size?: number}> = ({attack, target = 'noyau', size = 380}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-200 -200 400 400" style={{overflow: 'visible'}}>
			<circle r={150} fill={alpha(LPI.sky, 0.8)} stroke={N} strokeWidth={8} />
			<circle r={64} fill={target === 'noyau' ? alpha(LPI.pink, 0.4 + 0.5 * attack) : LPI.paper} stroke={N} strokeWidth={7} />
			{target === 'adn' &&
				[0, 1].map((k) => (
					<path key={k} d={Array.from({length: 21}, (_, i) => `${i ? 'L' : 'M'}${-50 + i * 5} ${Math.sin(i / 2 + frame / 8 + k * Math.PI) * 22}`).join(' ')} fill="none" stroke={k ? LPI.pink : LPI.blue} strokeWidth={7} strokeLinecap="round" />
				))}
			{Array.from({length: 6}).map((_, i) => {
				const a = (i / 6) * Math.PI * 2 + 0.4;
				const r = 290 - 200 * attack;
				return <Y key={i} x={Math.cos(a) * r} y={Math.sin(a) * r} ang={(a * 180) / Math.PI - 90} s={1.1} />;
			})}
		</svg>
	);
};

/** Petit vaisseau enflammé, avec des globules blancs visés (ANCA). */
const Vasc: React.FC<{inflame: number; width?: number}> = ({inflame, width = 700}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width, height: 260}}>
			<svg width={width} height={260} viewBox="0 0 700 260">
				<rect x={0} y={60} width={700} height={140} rx={70} fill={alpha('#B3263E', 0.2 + 0.35 * inflame)} stroke={N} strokeWidth={7} />
				<rect x={0} y={60} width={700} height={140} rx={70} fill="none" stroke={LPI.pink} strokeWidth={6 + 18 * inflame} opacity={inflame} />
				{[0, 1, 2].map((i) => (
					<Y key={i} x={140 + i * 210 + 50} y={60} ang={180} s={0.9} />
				))}
			</svg>
			{[0, 1, 2].map((i) => (
				<div key={i} style={{position: 'absolute', left: 120 + i * 210 + ((frame * 2) % 40), top: 95}}>
					<WhiteCell size={80} kind="pnn" />
				</div>
			))}
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ATT = at('intro', "s'attaquait");
	const AUTO = at('intro', "l'auto-immunité.");
	const ANTI = at('intro', 'anticorps');
	const CONTRE = at('intro', 'contre');
	const QUATRE = at('intro', 'quatre');
	return (
		<LabHook
			series={S}
			title={"*L'auto-immunité*\ndans le tube *jaune*"}
			titleSize={84}
			art={<Live render={() => <SelfCell size={330} attack={interpolate(frame, [ATT - 6, ATT + 30], [0.1, 0.9], clamp)} />} />}
			chips={[
				{label: 'AAN', at: QUATRE},
				{label: 'anti-ADN', at: QUATRE + 5, tone: LPI.pink},
				{label: 'ENA', at: QUATRE + 10},
				{label: 'ANCA', at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[
				{text: 'le corps contre lui-même ?', at: ATT - 4},
				{text: 'des anticorps contre nous', at: CONTRE - 10},
			]}
			punches={[ATT + 1, AUTO + 1, ANTI + 1, QUATRE + 1]}
			shakes={[ATT + 10]}
		/>
	);
};

export const Aan: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('aan', 'un');
	const ANTIN = at('aan', 'antinucléaires,');
	const NOYAU = at('aan', 'noyau');
	const DEPART = at('aan', 'départ,');
	const PETIT = at('aan', 'petit');
	const SANTE = at('aan', 'santé.');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Les *AAN*'}
			titleAt={UN}
			explain={{text: 'anticorps antinucléaires', at: ANTIN - 6}}
			art={{at: ANTIN - 4, node: <Live render={() => <SelfCell attack={interpolate(frame, [NOYAU - 10, NOYAU + 14], [0.1, 1], clamp)} />} />}}
			artY={800}
			chips={[
				{label: 'ils visent le noyau', at: NOYAU - 4, tone: LPI.pink},
				{label: 'le test de départ', at: DEPART - 6},
				{label: 'petit taux : aussi chez des gens en bonne santé', at: PETIT - 4, tone: LPI.navy},
			]}
			punches={[ANTIN + 1, NOYAU + 1, DEPART + 1, PETIT + 1, SANTE + 1]}
		/>
	);
};

export const Adn: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('adn', 'deux');
	const ANTI = at('adn', 'anti-a');
	const PRES = at('adn', 'présents,');
	const LUPUS = at('adn', 'lupus,');
	const PEAU = at('adn', 'peau,');
	const ARTIC = at('adn', 'articulations');
	const REINS = at('adn', 'reins.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Les *anti-ADN*'}
			titleAt={DEUX}
			pink
			explain={{text: 'ils visent l’ADN du noyau', at: ANTI}}
			art={{at: ANTI - 4, node: <Live render={() => <SelfCell target="adn" attack={interpolate(frame, [PRES - 10, PRES + 14], [0.1, 1], clamp)} />} />}}
			artY={800}
			chips={[
				{label: 'présents : on pense au lupus', at: LUPUS - 6, tone: LPI.navy},
				{label: 'peau', at: PEAU - 2},
				{label: 'articulations', at: ARTIC - 2, tone: LPI.pink},
				{label: 'reins', at: REINS - 2, icon: <KidneysIcon size={40} />},
			]}
			punches={[ANTI + 1, PRES + 1, LUPUS + 1, PEAU + 1, ARTIC + 1, REINS + 1]}
		/>
	);
};

export const Ena: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('ena', 'trois');
	const QUAND = at('ena', 'quand');
	const PREC = at('ena', 'préciser');
	const SJ = at('ena', 'gougerot-sjögren,');
	const YEUX = at('ena', 'yeux');
	const SECS = at('ena', 'secs.');
	const zoom = interpolate(frame, [PREC - 6, PREC + 16], [0, 1], clamp);
	const targets = ['SSA', 'SSB', 'Sm', 'RNP', 'Scl-70'];
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *ENA*'}
			titleAt={TROIS}
			explain={{text: 'AAN positifs : on précise la cible', at: QUAND - 4}}
			art={{
				at: QUAND - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', width: 760}}>
								{targets.map((t, i) => {
									const hot = f >= SJ - 6 && i < 2;
									return (
										<div key={t} style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N, padding: '18px 30px', borderRadius: 30, border: `6px solid ${N}`, background: hot ? LPI.pink : LPI.paper, opacity: clamp01(zoom * 5 - i), transform: `scale(${hot ? 1.1 : 1})`}}>
											{t}
										</div>
									);
								})}
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'ex. : Gougerot-Sjögren', at: SJ - 4, tone: LPI.pink},
				{label: 'yeux et bouche très secs', at: YEUX - 4, tone: LPI.navy},
			]}
			punches={[QUAND + 1, PREC + 1, SJ + 1, YEUX + 1, SECS + 1]}
		/>
	);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const Anca: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('anca', 'quatre');
	const GB = at('anca', 'globules');
	const INFL = at('anca', 'inflammation');
	const VASC = at('anca', 'vascularite,');
	const REINS = at('anca', 'reins');
	const POUM = at('anca', 'poumons.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'Les *ANCA*'}
			titleAt={QUATRE}
			pink
			explain={{text: 'ils visent certains globules blancs', at: GB - 10}}
			art={{at: GB - 6, node: <Live render={() => <Vasc inflame={interpolate(frame, [INFL - 4, INFL + 16], [0, 1], clamp)} width={700} />} />}}
			chips={[
				{label: 'petits vaisseaux enflammés : vascularite', at: VASC - 10, tone: LPI.pink},
				{label: 'reins', at: REINS - 2, icon: <KidneysIcon size={40} />},
				{label: 'poumons', at: POUM - 4, tone: LPI.navy},
			]}
			punches={[GB + 1, INFL + 1, VASC + 1, REINS + 1, POUM + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const ANTI = at('fin', 'anticorps');
	const ORIENT = at('fin', 'orientent,');
	const SIGNES = at('fin', 'signes.');
	const PROCH = at('fin', 'prochaine');
	const SUITE = at('fin', 'suite');
	return (
		<LabFin
			series={S}
			title={'*Auto-immunité*'}
			rows={[
				{t: ANTI, title: 'AAN', sub: 'le test de départ'},
				{t: ANTI + 10, title: 'anti-ADN', sub: 'lupus'},
				{t: ORIENT - 10, title: 'ENA', sub: 'préciser la cible (Sjögren…)'},
				{t: ORIENT, title: 'ANCA', sub: 'vascularites'},
			]}
			check={SIGNES}
			next={{at: PROCH, artAt: SUITE, children: <NextTitle pre="anti-CCP, " hot="facteur rhumatoïde" post=", thyroïde" />}}
		/>
	);
};
