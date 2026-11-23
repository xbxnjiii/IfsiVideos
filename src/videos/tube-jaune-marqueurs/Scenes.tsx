// « Le tube jaune : les marqueurs tumoraux » (n° 89, série courte du tube jaune, vidéo 12 ; directives Instagram). Accroche :
// un marqueur un peu élevé n'est pas un cancer. 1 · principe (substances libérées par certaines tumeurs ; montent aussi sans
// cancer : inflammation, tabac (ACE), foie malade ; pas de dépistage, suivi d'un cancer connu) ; 2 · marqueurs et organes
// (AFP foie / testicule, CA 125 ovaire, CA 15-3 sein, CA 19-9 pancréas, ACE côlon, PSA (+ libre) prostate : seul dosage
// discuté pour le dépistage individuel, après 50 ans, avec le médecin) ; 3 · suivi (dosé avant le traitement, cinétique :
// baisse = efficacité, remontée = récidive).
// Sources : HAS (pas de dépistage du cancer de la prostate par PSA en population, information individuelle) ; INCa
// (marqueurs tumoraux : suivi, pas diagnostic) ; recommandations ESMO / ASCO (CA 125, ACE, CA 15-3 dans le suivi).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · MARQUEURS TUMORAUX', total: 3};

const MARKERS = [
	{sig: 'AFP', organ: 'foie · testicules'},
	{sig: 'CA 125', organ: 'ovaires'},
	{sig: 'CA 15-3', organ: 'sein'},
	{sig: 'CA 19-9', organ: 'pancréas'},
	{sig: 'ACE', organ: 'côlon'},
	{sig: 'PSA', organ: 'prostate'},
];

/** Grille des 6 marqueurs : `on[i]` (0 → 1) allume la carte, `hot` = carte en avant. */
const MarkerGrid: React.FC<{on: number[]; hot?: number; organs?: boolean}> = ({on, hot = -1, organs = true}) => (
	<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, width: 860}}>
		{MARKERS.map((m, i) => {
			const v = on[i] ?? 0;
			return (
				<div
					key={m.sig}
					style={{
						height: 170,
						borderRadius: 30,
						background: i === hot ? LPI.pink : v > 0.5 ? LPI.paper : alpha(LPI.paper, 0.45),
						border: `6px solid ${alpha(N, 0.25 + 0.75 * v)}`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						color: N,
						transform: `scale(${0.9 + 0.1 * v + (i === hot ? 0.06 : 0)})`,
						opacity: 0.35 + 0.65 * v,
					}}
				>
					<div style={{fontSize: 54}}>{m.sig}</div>
					{organs && <div style={{fontSize: 30, marginTop: 4, opacity: v}}>{m.organ}</div>}
				</div>
			);
		})}
	</div>
);

/** Cellule tumorale qui libère des points dans le sang. */
const TumorRelease: React.FC<{size?: number; flow?: number}> = ({size = 300, flow = 1}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size * 1.6} height={size} viewBox="-160 -100 320 200" style={{overflow: 'visible'}}>
			<rect x={-160} y={-30} width={320} height={60} rx={30} fill={alpha('#B3263E', 0.25)} stroke={alpha(N, 0.4)} strokeWidth={3} />
			<path d="M-120 -70 q20 -30 50 -10 q30 -20 40 10 q30 10 10 40 q10 30 -30 30 q-20 25 -50 0 q-35 0 -30 -30 q-25 -20 10 -40Z" fill={LPI.pink} stroke={N} strokeWidth={5} />
			<circle cx={-80} cy={-40} r={14} fill={alpha(N, 0.5)} />
			{Array.from({length: 8}).map((_, i) => {
				const t = ((frame / 40 + i / 8) % 1) * flow;
				return <circle key={i} cx={-60 + t * 220} cy={-4 + Math.sin(i * 2 + t * 6) * 14} r={9} fill={LPI.blue} stroke={N} strokeWidth={3} opacity={flow > 0.05 ? 1 - t * 0.4 : 0} />;
			})}
		</svg>
	);
};

/** Courbe de suivi : avant traitement haut, baisse, puis remontée (`up`). */
const FollowCurve: React.FC<{t: number; up: number; width?: number}> = ({t, up, width = 760}) => {
	const W = 760;
	const H = 340;
	const v = (x: number) => (x < 0.15 ? 0.85 : x < 0.55 ? 0.85 - 0.7 * ((x - 0.15) / 0.4) : 0.15 + up * 0.6 * Math.max(0, (x - 0.7) / 0.3));
	const X = (x: number) => 50 + x * (W - 90);
	const Y = (x: number) => H - 60 - v(x) * (H - 110);
	const pts = Array.from({length: 101}, (_, i) => i / 100).filter((x) => x <= t);
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<line x1={40} y1={H - 60} x2={W - 30} y2={H - 60} stroke={N} strokeWidth={6} strokeLinecap="round" />
			<line x1={X(0.15)} y1={30} x2={X(0.15)} y2={H - 60} stroke={alpha(N, 0.4)} strokeWidth={4} strokeDasharray="12 10" />
			<text x={X(0.15)} y={H - 18} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>traitement</text>
			<path d={pts.map((x, i) => `${i ? 'L' : 'M'}${X(x)} ${Y(x)}`).join(' ')} fill="none" stroke={up > 0.3 ? LPI.pink : LPI.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ELEVE = at('intro', 'élevé…');
	const CANCER = at('intro', 'cancer.');
	const VITE = at('intro', 'vite !');
	const SIX = at('intro', 'six');
	const VRAI = at('intro', 'vraiment ?');
	const on = MARKERS.map((_, i) => interpolate(frame, [SIX + i * 4, SIX + i * 4 + 6], [0.3, 1], clamp));
	return (
		<LabHook
			series={S}
			title={'Les *marqueurs*\n*tumoraux*'}
			titleSize={92}
			art={<Live render={() => <div style={{transform: 'scale(0.62)'}}><MarkerGrid on={on} organs={false} hot={frame >= ELEVE - 4 && frame < SIX ? 4 : -1} /></div>} />}
			chips={[
				{label: 'un peu élevé…', at: ELEVE - 4},
				{label: 'un cancer ?', at: CANCER - 4, tone: LPI.pink},
			]}
			notes={[
				{text: 'pas si vite !', at: VITE - 4},
				{text: 'à quoi servent-ils ?', at: VRAI - 14},
			]}
			punches={[ELEVE + 1, CANCER + 1, VITE + 1, SIX + 1]}
			shakes={[VITE + 2]}
		/>
	);
};

export const Principe: React.FC = () => {
	const UN = at('principe', 'un');
	const SUBST = at('principe', 'substances');
	const SANS = at('principe', 'sans');
	const INFL = at('principe', 'inflammation,');
	const TABAC = at('principe', 'tabac,');
	const FOIE = at('principe', 'foie');
	const DEP = at('principe', 'dépister :');
	const SUIVRE = at('principe', 'suivre');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le *principe*'}
			titleAt={UN}
			explain={{text: 'libérés dans le sang par certaines tumeurs', at: SUBST - 4}}
			art={{at: SUBST, node: <TumorRelease size={380} />}}
			chips={[
				{label: 'sans cancer :', at: SANS - 6, tone: LPI.navy},
				{label: 'inflammation', at: INFL - 2},
				{label: 'tabac', at: TABAC - 2, tone: LPI.pink},
				{label: 'foie malade', at: FOIE - 2, icon: <FattyLiverIcon size={40} />},
			]}
			note={{text: 'pas pour dépister : pour suivre', at: DEP - 6, size: 40}}
			punches={[SUBST + 1, SANS + 1, INFL + 1, TABAC + 1, FOIE + 1, DEP + 1, SUIVRE + 1]}
			sfx={[{name: 'buzz', at: DEP}]}
		/>
	);
};

export const Liste1: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('liste1', 'deux');
	const ORG = at('liste1', 'organes.');
	const AFP = at('liste1', "l'a");
	const C125 = at('liste1', 'cent');
	const C153 = at('liste1', 'quinze');
	const ts = [AFP, C125 - 6, C153 - 6];
	const on = MARKERS.map((_, i) => (i < 3 ? interpolate(frame, [ts[i] - 4, ts[i] + 6], [0, 1], clamp) : 0));
	const hot = ts.filter((t) => frame >= t - 4).length - 1;
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Les *6* *marqueurs*'}
			titleAt={DEUX}
			pink
			explain={{text: 'chacun son organe', at: ORG - 6}}
			art={{at: ORG - 4, node: <Live render={() => <MarkerGrid on={on} hot={hot} />} />}}
			artY={800}
			punches={[ORG + 1, AFP + 1, C125 + 1, C153 + 1]}
		/>
	);
};

export const Liste2: React.FC = () => {
	const frame = useCurrentFrame();
	const C199 = at('liste2', 'dix-neuf');
	const ACE = at('liste2', "l'a");
	const PSA = at('liste2', 'p');
	const LIBRE = at('liste2', 'libre,');
	const SEUL = at('liste2', 'seul');
	const MED = at('liste2', 'médecin,');
	const ts = [C199 - 8, ACE, PSA];
	const on = MARKERS.map((_, i) => (i < 3 ? 1 : interpolate(frame, [ts[i - 3] - 4, ts[i - 3] + 6], [0, 1], clamp)));
	const hot = 2 + ts.filter((t) => frame >= t - 4).length;
	return (
		<LabNotion
			series={S}
			steps={[[0, 2]]}
			title={'Les *6* *marqueurs*'}
			titleAt={-30}
			pink
			explain={{text: 'chacun son organe', at: -30}}
			art={{at: -30, node: <Live render={() => <MarkerGrid on={on} hot={hot} />} />}}
			artY={800}
			chips={[
				{label: 'PSA + PSA libre', at: LIBRE - 6},
				{label: 'PSA : se discute avec le médecin, après 50 ans', at: SEUL - 2, tone: LPI.navy},
			]}
			punches={[C199 + 1, ACE + 1, PSA + 1, SEUL + 1, MED + 1]}
		/>
	);
};

export const Suivi: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('suivi', 'trois');
	const AVANT = at('suivi', 'avant');
	const EVOL = at('suivi', 'évolue.');
	const BAISSE = at('suivi', 'baisse,');
	const REMONTE = at('suivi', 'remonte,');
	const RECID = at('suivi', 'récidive.');
	const t = interpolate(frame, [AVANT - 4, BAISSE + 20, REMONTE - 4, REMONTE + 20], [0, 0.6, 0.6, 1], clamp);
	const up = interpolate(frame, [REMONTE - 4, REMONTE + 16], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *suivi*'}
			titleAt={TROIS}
			explain={{text: 'dosé avant le traitement, puis son évolution', at: AVANT - 4}}
			art={{at: AVANT - 4, node: <Live render={() => <FollowCurve t={t} up={up} width={740} />} />}}
			artY={790}
			chips={[
				{label: 'il baisse : le traitement marche', at: BAISSE - 4, tone: LPI.paper},
				{label: 'il remonte : on cherche une récidive', at: REMONTE - 2, tone: LPI.pink},
			]}
			punches={[AVANT + 1, EVOL + 1, BAISSE + 1, REMONTE + 1, RECID + 1]}
			sfx={[{name: 'buzz', at: REMONTE + 2}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const SEUL = at('fin', 'seul');
	const DIAG = at('fin', 'diagnostic :');
	const SUIT = at('fin', 'suit');
	const MAL = at('fin', 'maladie.');
	const PROCH = at('fin', 'prochaine');
	const HORM = at('fin', 'hormones,');
	return (
		<LabFin
			series={S}
			title={'Les *marqueurs*'}
			rows={[
				{t: SEUL, title: 'pas un diagnostic', sub: 'montent aussi sans cancer'},
				{t: DIAG + 10, title: '6 marqueurs, 6 organes', sub: 'AFP · CA 125 · CA 15-3 · CA 19-9 · ACE · PSA'},
				{t: SUIT, title: 'ils suivent la maladie', sub: 'baisse = efficace · remontée = récidive ?'},
			]}
			check={MAL}
			next={{at: PROCH, artAt: HORM, children: <NextTitle pre="les " hot="hormones" post=" : la thyroïde" />}}
		/>
	);
};
