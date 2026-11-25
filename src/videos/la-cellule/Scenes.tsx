// « La cellule » (n° 103, thème « l'anatomie », vidéo générale ; la n° 104 en est le schéma annoté ; directives Instagram).
// Accroche : 37 000 milliards de cellules, chacune comme une petite usine. 1 · plus petite unité vivante, la forme suit le
// rôle (globule rouge rond et plat, neurone très long, cellule musculaire allongée) ; 2 · trois parties (membrane qui
// choisit ce qui entre et sort, cytoplasme, noyau qui garde l'ADN) ; 3 · les organites (mitochondries : énergie,
// ribosomes : protéines, appareil de Golgi : emballe et expédie) ; 4 · la division (copie de l'ADN puis deux cellules
// identiques : la mitose ; croissance et réparation).
// Sources : Bianconi E. et al., Ann Hum Biol 2013 (≈ 3,7 × 10¹³ cellules) ; Marieb & Hoehn, Anatomie et physiologie
// humaines (la cellule : membrane plasmique, cytoplasme, organites, noyau ; mitose).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion} from '../../brand/labshort';
import {ANAT_C} from '../../brand/schema';
import {Pop} from '../../brand/short';
import {alpha, FONT, LPI} from '../../brand/theme';
import {RedCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const C = ANAT_C;
const S = {cap: LPI.pink, label: "L'ANATOMIE · LA CELLULE", total: 4};

/** Cellule simple : membrane, cytoplasme, noyau + ADN ; `hl` = partie mise en avant (pulse) ; `swap` (0 → 1) : des
 *  molécules entrent et sortent par la membrane ; `organ` (0 → 1) : organites ; `hot` = organite mis en avant. */
const SimpleCell: React.FC<{size?: number; hl?: 'membrane' | 'cyto' | 'noyau' | null; swap?: number; organ?: number; hot?: number}> = ({size = 420, hl = null, swap = 0, organ = 0, hot = -1}) => {
	const f = useCurrentFrame();
	const p = 0.5 + 0.5 * Math.sin(f / 4);
	const glow = (k: string) => (hl === k ? 1 : 0);
	const w = 1 + 0.015 * Math.sin(f / 10);
	const mol = (i: number) => {
		const t = ((f / 40 + i / 4) % 1) * swap;
		const a = i * 1.6 + 0.4;
		const inward = i % 2 === 0;
		const r = inward ? 230 - 110 * t : 120 + 110 * t;
		return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={11} fill={inward ? LPI.blue : LPI.pink} stroke={N} strokeWidth={3} opacity={swap} />;
	};
	return (
		<svg width={size} height={size} viewBox="-230 -230 460 460" style={{overflow: 'visible'}}>
			<defs>
				<radialGradient id="lcCyto" cx="45%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="100%" stopColor={LPI.sky} />
				</radialGradient>
			</defs>
			<ellipse rx={196 * w} ry={180 / w} fill={LPI.pink} stroke={N} strokeWidth={6} />
			<ellipse rx={182 * w} ry={166 / w} fill="url(#lcCyto)" stroke={alpha(N, 0.5)} strokeWidth={3} />
			{hl === 'membrane' ? <ellipse rx={196 * w} ry={180 / w} fill="none" stroke={LPI.pink} strokeWidth={14 + 10 * p} opacity={0.6} /> : null}
			{hl === 'cyto' ? <ellipse rx={150} ry={135} fill={alpha(LPI.blue, 0.12 + 0.12 * p)} /> : null}
			<g opacity={organ}>
				<g opacity={hot < 0 || hot === 0 ? 1 : 0.3} transform={`scale(${hot === 0 ? 1 + 0.08 * p : 1})`}>
					{[
						[95, -80, -25],
						[-110, 70, 30],
					].map(([x, y, r], i) => (
						<g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
							<ellipse rx={46} ry={22} fill={C.mito} stroke={C.mitoDark} strokeWidth={4} />
							<path d="M-34 0 L-26 -12 L-18 10 L-10 -12 L-2 10 L6 -12 L14 10 L22 -12 L30 0" fill="none" stroke={C.mitoDark} strokeWidth={3} />
						</g>
					))}
				</g>
				<g opacity={hot < 0 || hot === 1 ? 1 : 0.3}>
					{Array.from({length: 16}).map((_, i) => {
						const a = i * 2.39;
						const r = 110 + ((i * 29) % 50);
						return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.9} r={hot === 1 ? 7 + 2 * p : 6} fill={N} />;
					})}
				</g>
				<g opacity={hot < 0 || hot === 2 ? 1 : 0.3}>
					{[0, 1, 2, 3].map((k) => (
						<path key={k} d={`M${50 - k * 3} ${70 + k * 13} Q${95} ${48 + k * 13} ${135 + k * 3} ${78 + k * 13}`} fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
					))}
					{hot === 2 ? <circle cx={150 + 60 * ((f / 30) % 1)} cy={130 + 20 * ((f / 30) % 1)} r={13} fill={alpha(LPI.pink, 0.8)} stroke={N} strokeWidth={3} /> : null}
				</g>
			</g>
			<circle cx={-15} cy={0} r={72 + (hl === 'noyau' ? 5 * p : 0)} fill={C.nucleus} stroke={C.nucleusDark} strokeWidth={6} />
			<path d={Array.from({length: 18}, (_, i) => `${i ? 'L' : 'M'}${-50 + i * 4} ${Math.sin(i / 1.5 + f / 8) * 18}`).join(' ')} fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" />
			{glow('noyau') ? <circle cx={-15} cy={0} r={92} fill="none" stroke={LPI.pink} strokeWidth={8} opacity={0.4 + 0.5 * p} /> : null}
			{[0, 1, 2, 3].map(mol)}
		</svg>
	);
};

/** Neurone : corps cellulaire, dendrites, très long axone. */
const Neuron: React.FC<{size?: number}> = ({size = 300}) => (
	<svg width={size} height={size * 0.45} viewBox="0 0 300 135">
		<path d="M50 68 L14 30 M50 68 L6 72 M50 68 L20 112 M44 52 L36 14" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<path d="M70 68 L280 68" stroke={N} strokeWidth={7} strokeLinecap="round" />
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={92 + i * 46} y={58} width={36} height={20} rx={10} fill={C.fat} stroke={N} strokeWidth={3} />
		))}
		<path d="M280 68 L296 48 M280 68 L298 68 M280 68 L296 88" stroke={N} strokeWidth={5} strokeLinecap="round" />
		<circle cx={52} cy={68} r={26} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<circle cx={52} cy={68} r={9} fill={C.nucleusDark} />
	</svg>
);

/** Cellule musculaire : longue, striée, plusieurs noyaux. */
const MuscleCell: React.FC<{size?: number}> = ({size = 300}) => (
	<svg width={size} height={size * 0.3} viewBox="0 0 300 90">
		<rect x={6} y={18} width={288} height={54} rx={27} fill={C.muscle} stroke={N} strokeWidth={5} />
		{Array.from({length: 20}).map((_, i) => (
			<line key={i} x1={22 + i * 13.5} y1={24} x2={22 + i * 13.5} y2={66} stroke={alpha('#5E1820', 0.45)} strokeWidth={3} />
		))}
		{[70, 160, 240].map((x) => (
			<ellipse key={x} cx={x} cy={45} rx={14} ry={8} fill={C.nucleus} stroke={N} strokeWidth={2.5} />
		))}
	</svg>
);

/** Mitose : `p` 0 → 1 (l'ADN se copie, la cellule s'étrangle puis se sépare en deux). */
const Mitosis: React.FC<{p: number; size?: number}> = ({p, size = 460}) => {
	const split = interpolate(p, [0.35, 1], [0, 1], clamp);
	const copy = interpolate(p, [0, 0.35], [0, 1], clamp);
	const d = 135 * split;
	const r = 150 - 40 * split;
	return (
		<svg width={size} height={size * 0.75} viewBox="-300 -170 600 340" style={{overflow: 'visible'}}>
			{[-1, 1].map((s) => (
				<circle key={`m${s}`} cx={s * d} cy={0} r={r} fill={LPI.pink} stroke={N} strokeWidth={6} />
			))}
			{[-1, 1].map((s) => (
				<circle key={`c${s}`} cx={s * d} cy={0} r={r - 13} fill={LPI.sky} />
			))}
			{[-1, 1].map((s) => {
				const off = split > 0 ? s * d : s * 34 * copy;
				return (
					<g key={`n${s}`} opacity={s < 0 ? 1 : Math.max(copy, 0.0001)}>
						<circle cx={off} cy={0} r={52 - 10 * copy * (1 - split)} fill={C.nucleus} stroke={C.nucleusDark} strokeWidth={5} opacity={s < 0 || copy > 0.05 ? 1 : 0} />
						<path d={Array.from({length: 12}, (_, i) => `${i ? 'L' : 'M'}${off - 26 + i * 4.6} ${Math.sin(i / 1.4) * 14}`).join(' ')} fill="none" stroke={LPI.paper} strokeWidth={4.5} strokeLinecap="round" />
					</g>
				);
			})}
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MIL = at('intro', 'milliards');
	const USINE = at('intro', 'usine.');
	const FONCT = at('intro', 'fonctionne ?');
	const count = Math.round(interpolate(frame, [0, MIL + 8], [0, 37000], clamp));
	return (
		<LabHook
			series={S}
			title={'La *cellule*'}
			titleSize={110}
			lead={<Live render={(f) => <div style={{transform: `scale(${1 + 0.06 * Math.sin(f / 7)})`}}><SimpleCell size={220} /></div>} />}
			art={
				<Live
					render={(f) =>
						f < USINE - 6 ? (
							<div style={{fontFamily: FONT.title, fontWeight: 900, color: N, textAlign: 'center', width: 520}}>
								<div style={{fontSize: 100, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{count.toLocaleString('fr-FR')}</div>
								<div style={{fontSize: 40, opacity: f >= MIL - 4 ? 1 : 0.15}}>milliards de cellules</div>
							</div>
						) : (
							<SimpleCell size={420} organ={interpolate(f, [USINE - 6, USINE + 10], [0, 1], clamp)} hot={2} />
						)
					}
				/>
			}
			chips={[]}
			notes={[
				{text: 'une petite usine', at: USINE - 4},
				{text: 'comment elle fonctionne ?', at: FONCT - 8},
			]}
			punches={[MIL + 1, USINE + 1, FONCT + 1]}
			shakes={[MIL + 9]}
		/>
	);
};

export const Forme: React.FC = () => {
	const UN = at('forme', 'un');
	const PETITE = at('forme', 'petite');
	const ROLE = at('forme', 'rôle :');
	const GR = at('forme', 'globule');
	const NEU = at('forme', 'neurone,');
	const MUS = at('forme', 'muscle.');
	const card = (t: number, node: React.ReactNode, label: string, x: number, y: number) => (
		<Pop at={t - 6} x={x} y={y}>
			<div style={{width: 400, height: 250, borderRadius: 34, background: '#FFFFFF', border: `6px solid ${N}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
				{node}
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>{label}</div>
			</div>
		</Pop>
	);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Une *unité* *vivante*'}
			titleSize={96}
			titleAt={UN}
			explain={{text: 'la plus petite unité vivante', at: PETITE - 6}}
			art={{at: PETITE - 2, node: <Live render={(f) => <div style={{opacity: f < GR - 8 ? 1 : 0}}><SimpleCell size={380} /></div>} />}}
			artY={820}
			chips={[{label: 'sa forme suit son rôle', at: ROLE - 6, tone: LPI.pink}]}
			extra={
				<>
					{card(GR, <RedCell size={130} />, 'globule rouge', 300, 720)}
					{card(NEU, <Neuron size={320} />, 'neurone', 780, 720)}
					{card(MUS, <MuscleCell size={320} />, 'cellule du muscle', 540, 1010)}
				</>
			}
			punches={[PETITE + 1, ROLE + 1, GR + 1, NEU + 1, MUS + 1]}
		/>
	);
};

export const Parties: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('parties', 'deux');
	const MEMB = at('parties', 'membrane,');
	const CHOI = at('parties', 'choisit');
	const CYTO = at('parties', 'cytoplasme,');
	const NOYAU = at('parties', 'noyau,');
	const ADN = at('parties', "l'adn :");
	const PLAN = at('parties', 'plan');
	const hl = frame >= NOYAU - 4 ? 'noyau' : frame >= CYTO - 4 ? 'cyto' : frame >= MEMB - 4 ? 'membrane' : null;
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Trois *parties*'}
			titleAt={DEUX}
			pink
			art={{at: DEUX + 6, node: <Live render={(f) => <SimpleCell size={460} hl={hl} swap={interpolate(f, [CHOI - 6, CHOI + 10, CYTO - 8, CYTO], [0, 1, 1, 0], clamp)} />} />}}
			artY={790}
			chips={[
				{label: 'membrane : filtre', at: MEMB - 2},
				{label: 'cytoplasme', at: CYTO - 2, tone: LPI.pink},
				{label: 'noyau', at: NOYAU - 2},
				{label: "ADN = le plan", at: PLAN - 6, tone: LPI.navy},
			]}
			punches={[MEMB + 1, CHOI + 1, CYTO + 1, NOYAU + 1, ADN + 1, PLAN + 1]}
		/>
	);
};

export const Organites: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('organites', 'trois');
	const PETITS = at('organites', 'petits');
	const MITO = at('organites', 'mitochondries');
	const RIBO = at('organites', 'ribosomes');
	const GOLGI = at('organites', 'golgi');
	const EXP = at('organites', 'expédier.');
	const hot = frame >= GOLGI - 6 ? 2 : frame >= RIBO - 4 ? 1 : frame >= MITO - 4 ? 0 : -1;
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *organites*'}
			titleAt={TROIS}
			explain={{text: 'de petits organes', at: PETITS - 6}}
			art={{at: PETITS - 4, node: <Live render={(f) => <SimpleCell size={440} organ={interpolate(f, [PETITS - 4, PETITS + 10], [0, 1], clamp)} hot={hot} />} />}}
			artY={800}
			chips={[
				{label: 'mitochondries : énergie', at: MITO - 2, tone: LPI.pink},
				{label: 'ribosomes : protéines', at: RIBO - 2},
				{label: 'Golgi : emballe, expédie', at: GOLGI - 4, tone: LPI.navy},
			]}
			punches={[PETITS + 1, MITO + 1, RIBO + 1, GOLGI + 1, EXP + 1]}
		/>
	);
};

export const Division: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('division', 'quatre');
	const COPIE = at('division', 'copie');
	const COUPE = at('division', 'coupe');
	const MITOSE = at('division', 'mitose.');
	const GRANDIR = at('division', 'grandir');
	const REPARER = at('division', 'réparer');
	const p = interpolate(frame, [COPIE - 4, COPIE + 20, COUPE - 4, COUPE + 30], [0, 0.35, 0.35, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'La *division*'}
			titleAt={QUATRE}
			pink
			explain={{text: 'la mitose', at: MITOSE - 4}}
			art={{at: QUATRE + 8, node: <Live render={() => <Mitosis p={p} size={520} />} />}}
			artY={820}
			chips={[
				{label: "copie de l'ADN", at: COPIE - 2},
				{label: 'deux cellules', at: COUPE + 8, tone: LPI.pink},
				{label: 'pour grandir', at: GRANDIR - 2, tone: LPI.navy},
				{label: 'pour réparer', at: REPARER - 2},
			]}
			punches={[COPIE + 1, COUPE + 1, MITOSE + 1, GRANDIR + 1, REPARER + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const UNITE = at('fin', 'unité');
	const TROIS = at('fin', 'trois');
	const ORG = at('fin', 'organites');
	const DIV = at('fin', 'division.');
	const PROCH = at('fin', 'prochaine');
	return (
		<LabFin
			series={S}
			title={'La *cellule*'}
			pink
			rows={[
				{t: UNITE, title: 'unité vivante', sub: 'sa forme suit son rôle'},
				{t: TROIS, title: 'trois parties', sub: 'membrane · cytoplasme · noyau'},
				{t: ORG, title: 'des organites', sub: 'mitochondries · ribosomes · Golgi'},
				{t: DIV, title: 'la division', sub: 'mitose : 2 cellules identiques'},
			]}
			check={DIV + 6}
			done={
				<Pop at={PROCH - 2} x={540} y={1300}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, background: N, borderRadius: 40, padding: '22px 40px', whiteSpace: 'nowrap'}}>
						prochaine vidéo : <span style={{color: LPI.pink}}>le schéma annoté</span>
					</div>
				</Pop>
			}
		/>
	);
};
