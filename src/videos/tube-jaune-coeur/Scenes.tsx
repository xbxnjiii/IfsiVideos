// « Le tube jaune : le cœur » (n° 88, série courte du tube jaune, vidéo 11 ; directives Instagram). Accroche : douleur dans
// la poitrine, infarctus ou pas ? 1 · troponine (protéine du muscle cardiaque, passe dans le sang quand les cellules
// meurent, monte en quelques heures : dosage à l'arrivée puis 1 – 3 h après, cinétique = infarctus) ; 2 · le seuil (dépend
// de la technique : lire la norme du laboratoire ; monte aussi dans l'embolie pulmonaire, l'insuffisance rénale, le sepsis) ;
// 3 · NT-proBNP (cœur trop étiré ; normal = insuffisance cardiaque très peu probable ; élevé → échographie ; seuil selon
// l'âge : < 125 pg/mL hors urgence, en urgence 450 / 900 / 1 800 selon < 50, 50 – 75, > 75 ans).
// Sources : ESC 2023 (syndromes coronaires aigus, algorithme 0 h / 1 h – 0 h / 3 h, troponine hypersensible, 99e
// percentile) ; ESC 2021 (insuffisance cardiaque, NT-proBNP < 125 pg/mL ; seuils d'âge en urgence, étude ICON).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {FeverIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {Heart} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LE CŒUR', total: 3};

/** Cœur qui bat ; `leak` (0 → 1) : des points de troponine en sortent. */
const LeakyHeart: React.FC<{size?: number; leak?: number; stretch?: number}> = ({size = 300, leak = 0, stretch = 0}) => {
	const frame = useCurrentFrame();
	const beat = Math.max(0, Math.sin(frame / 4.5)) ** 3;
	return (
		<div style={{position: 'relative', width: size * 1.4, height: size * 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{transform: `scale(${1 + 0.25 * stretch}, ${1 + 0.12 * stretch})`}}>
				<Heart size={size} beat={beat} />
			</div>
			{Array.from({length: 10}).map((_, i) => {
				const a = (i / 10) * Math.PI * 2 + 0.3;
				const t = ((frame / 30 + i * 0.37) % 1) * leak;
				const r = size * (0.35 + 0.4 * t);
				return <div key={i} style={{position: 'absolute', left: size * 0.7 + Math.cos(a) * r - 9, top: size * 0.6 + Math.sin(a) * r - 9, width: 18, height: 18, borderRadius: 9, background: LPI.pink, border: `3px solid ${N}`, opacity: leak > 0.05 ? 1 - t * 0.6 : 0}} />;
			})}
		</div>
	);
};

/** Deux prises : H0 et H3 ; la 2e barre monte au-dessus du seuil. */
const TwoDraws: React.FC<{h0: number; h3: number; width?: number}> = ({h0, h3, width = 620}) => {
	const H = 360;
	const bar = (x: number, v: number, label: string, on: number) => (
		<g opacity={on}>
			<rect x={x} y={H - 60 - v * 240} width={140} height={v * 240} rx={16} fill={v > 0.55 ? LPI.pink : LPI.sky} stroke={N} strokeWidth={6} />
			<text x={x + 70} y={H - 16} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>{label}</text>
		</g>
	);
	return (
		<svg width={width} height={(width / 620) * H} viewBox={`0 0 620 ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={H - 60} x2={580} y2={H - 60} stroke={N} strokeWidth={6} strokeLinecap="round" />
			<line x1={40} y1={H - 60 - 0.5 * 240} x2={580} y2={H - 60 - 0.5 * 240} stroke={alpha(N, 0.5)} strokeWidth={4} strokeDasharray="14 10" />
			<text x={580} y={H - 72 - 0.5 * 240} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>seuil</text>
			{bar(110, 0.25, 'arrivée', h0)}
			{bar(370, 0.25 + 0.6 * h3, '+ 1 à 3 h', h3 > 0 ? 1 : 0)}
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const DOUL = at('intro', 'douleur');
	const INF = at('intro', 'infarctus,');
	const DEUX = at('intro', 'deux');
	const TEMPS = at('intro', 'temps');
	const CONN = at('intro', 'connais ?');
	const leak = interpolate(frame, [INF - 4, INF + 20], [0, 1], clamp);
	return (
		<LabHook
			series={S}
			title={'Le *cœur*\ndans le tube *jaune*'}
			art={<Live render={() => <LeakyHeart size={240} leak={leak} />} />}
			chips={[
				{label: 'troponine', at: DEUX},
				{label: 'NT-proBNP', at: DEUX + 6, tone: LPI.pink},
			]}
			notes={[
				{text: 'infarctus… ou pas ?', at: INF - 4},
				{text: 'le temps compte', at: TEMPS - 4},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[DOUL + 1, INF + 1, DEUX + 1, TEMPS + 1]}
			shakes={[INF + 2]}
		/>
	);
};

export const Tropo: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('tropo', 'un');
	const PROT = at('tropo', 'protéine');
	const MEURENT = at('tropo', 'meurent,');
	const SANG = at('tropo', 'sang.');
	const MONTE = at('tropo', 'monte');
	const ARRIV = at('tropo', "l'arrivée,");
	const TROIS = at('tropo', 'trois');
	const AUGM = at('tropo', 'augmente,');
	const INF = at('tropo', "l'infarctus.");
	const leak = interpolate(frame, [MEURENT - 4, SANG + 10], [0, 1], clamp);
	const h3 = interpolate(frame, [AUGM - 6, AUGM + 14], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La *troponine*'}
			titleAt={UN}
			explain={{text: 'une protéine du muscle du cœur', at: PROT - 4}}
			art={{
				at: PROT,
				node: <Live render={(f) => (f < MONTE - 4 ? <LeakyHeart size={240} leak={leak} /> : <TwoDraws h0={f >= ARRIV - 6 ? 1 : 0} h3={f >= TROIS - 4 ? Math.max(0.01, h3) : 0} width={600} />)} />,
			}}
			artY={790}
			chips={[
				{label: 'des cellules du cœur meurent', at: MEURENT - 4, tone: LPI.paper},
				{label: 'dosée à l’arrivée, puis 1 à 3 h après', at: ARRIV - 4},
				{label: 'elle augmente : infarctus ?', at: AUGM - 2, tone: LPI.pink},
			]}
			punches={[PROT + 1, MEURENT + 1, MONTE + 1, ARRIV + 1, TROIS + 1, AUGM + 1, INF + 1]}
			sfx={[{name: 'buzz', at: AUGM + 4}]}
		/>
	);
};

export const Seuil: React.FC = () => {
	const DEUX = at('seuil', 'deux');
	const LABO = at('seuil', 'laboratoire');
	const NORME = at('seuil', 'norme');
	const AUSSI = at('seuil', 'aussi');
	const EMB = at('seuil', 'embolie');
	const REN = at('seuil', 'rénale');
	const INF = at('seuil', 'infection');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le *seuil*'}
			titleAt={DEUX}
			pink
			explain={{text: 'il dépend du laboratoire', at: LABO - 6}}
			art={{
				at: NORME - 6,
				node: (
					<div style={{width: 560, padding: '26px 34px', borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, color: N, boxSizing: 'border-box'}}>
						<div style={{fontSize: 30, opacity: 0.6}}>RÉSULTAT</div>
						<div style={{fontSize: 52, marginTop: 6}}>troponine</div>
						<div style={{fontSize: 34, marginTop: 10, background: alpha(LPI.pink, 0.5), borderRadius: 14, padding: '6px 14px', display: 'inline-block'}}>norme du labo : &lt; …</div>
					</div>
				),
			}}
			chips={[
				{label: 'lis la norme écrite sur le résultat', at: NORME - 2, tone: LPI.navy},
				{label: 'monte aussi : embolie pulmonaire', at: EMB - 2},
				{label: 'insuffisance rénale', at: REN - 8, icon: <KidneysIcon size={40} />},
				{label: 'infection grave', at: INF - 2, icon: <FeverIcon size={40} />},
			]}
			punches={[LABO + 1, NORME + 1, AUSSI + 1, EMB + 1, REN + 1, INF + 1]}
		/>
	);
};

export const Bnp: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('bnp', 'trois');
	const ETIRE = at('bnp', 'étiré,');
	const POMPE = at('bnp', 'pompe');
	const NORMAL = at('bnp', 'normal,');
	const ELEVE = at('bnp', 'élevé,');
	const ECHO = at('bnp', 'échographie');
	const AGE = at('bnp', "l'âge.");
	const stretch = interpolate(frame, [ETIRE - 6, ETIRE + 14], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *NT-proBNP*'}
			titleAt={TROIS}
			explain={{text: 'libéré quand le cœur est trop étiré', at: ETIRE - 8}}
			art={{at: ETIRE - 6, node: <Live render={() => <LeakyHeart size={220} stretch={stretch} />} />}}
			artY={780}
			norm={{rows: [['', '< 125 pg/mL (hors urgence)']], at: NORMAL - 4, y: 1060}}
			chips={[
				{label: 'normal : insuffisance cardiaque peu probable', at: NORMAL + 6, tone: LPI.paper},
				{label: 'élevé : échographie du cœur', at: ECHO - 6, tone: LPI.pink},
				{label: "le seuil monte avec l'âge", at: AGE - 10, tone: LPI.navy},
			]}
			punches={[ETIRE + 1, POMPE + 1, NORMAL + 1, ELEVE + 1, ECHO + 1, AGE + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const TROPO = at('fin', 'troponine,');
	const BNP = at('fin', 'p,');
	const FAT = at('fin', 'fatigue.');
	const PROCH = at('fin', 'prochaine');
	const MARQ = at('fin', 'marqueurs');
	return (
		<LabFin
			series={S}
			title={'Le *cœur*'}
			pink
			rows={[
				{t: TROPO, title: 'troponine', sub: 'le muscle qui souffre · 2 prises'},
				{t: BNP - 20, title: 'NT-proBNP', sub: 'le cœur qui fatigue · selon l’âge'},
			]}
			check={FAT}
			next={{at: PROCH, artAt: MARQ, children: <NextTitle pre="les " hot="marqueurs" post=" tumoraux" />}}
		/>
	);
};

