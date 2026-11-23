// « Le tube jaune : le fer » (n° 79, série courte du tube jaune, vidéo 2 ; directives Instagram). Accroche : le manque de fer
// = 1re cause d'anémie dans le monde (OMS) ; 1 · fer sérique (varie dans la journée et avec les repas, seul il ne suffit pas ;
// ≈ 10 – 30 µmol/L) ; 2 · ferritine (les réserves, le chiffre le plus fiable ; basse = manque de fer ; haute : inflammation,
// foie, excès de fer) ; 3 · transferrine (le camion ; carence → plus de camions, à moitié vides : saturation basse).
// Sources : OMS (carence martiale, 1re cause d'anémie) ; HAS 2011 « Choix des examens du métabolisme du fer » (ferritine
// en 1re intention) ; valeurs usuelles des laboratoires (ferritine H 30 – 300 / F 15 – 200 µg/L, transferrine 2 – 4 g/L,
// coefficient de saturation 20 – 40 %, variables selon les laboratoires).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {FattyLiverIcon} from '../../brand/liver';
import {FeverIcon} from '../../brand/icons';
import {FeBall, IronTruck, Pantry} from '../../brand/labart';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, RedCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LE FER', total: 3};

export const Hook: React.FC = () => {
	const ANEMIE = at('intro', "d'anémie");
	const TROIS = at('intro', 'trois');
	const LEQUEL = at('intro', 'lequel');
	return (
		<LabHook
			series={S}
			title={'Le *fer*\ndans le tube *jaune*'}
			art={
				<div style={{position: 'relative', width: 420, height: 320, transform: 'scale(1.25)'}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{position: 'absolute', left: 20 + i * 120, top: 120 + (i % 2) * 60, opacity: 0.75}}>
							<RedCell size={150} />
						</div>
					))}
					<svg width={420} height={160} viewBox="0 0 420 160" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
						{[70, 200, 330].map((x, i) => (
							<g key={x} transform={`translate(${x} ${60 + i * 10})`}>
								<FeBall r={34} />
							</g>
						))}
					</svg>
				</div>
			}
			chips={[
				{label: '1re cause d’anémie', at: ANEMIE - 4, tone: LPI.pink},
				{label: 'fer', at: TROIS},
				{label: 'ferritine', at: TROIS + 6, tone: LPI.pink},
				{label: 'transferrine', at: TROIS + 12},
			]}
			notes={[{text: 'tu sais lequel regarder ?', at: LEQUEL - 6}]}
			punches={[ANEMIE + 1, TROIS + 1, LEQUEL + 1]}
		/>
	);
};

export const Fer: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('fer', 'un');
	const SER = at('fer', 'sérique,');
	const VARIE = at('fer', 'varie');
	const SEUL = at('fer', 'seul,');
	const NORME = at('fer', 'norme');
	const v = frame < VARIE ? 18 : 18 + 9 * Math.sin((frame - VARIE) / 7);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Le fer *sérique*'}
			titleAt={UN}
			titleSize={104}
			explain={{text: 'le fer qui circule dans le sang', at: SER}}
			art={{
				at: SER + 6,
				node: (
					<Live
						render={() => (
							<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
								<svg width={120} height={120} viewBox="-60 -60 120 120">
									<FeBall r={50} />
								</svg>
								<div style={{padding: '14px 30px', borderRadius: 30, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: frame >= VARIE ? LPI.pink : LPI.paper, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
									{Math.round(v)} <span style={{fontSize: 30}}>µmol/L</span>
								</div>
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['', '≈ 10 – 30 µmol/L']], at: NORME - 4}}
			chips={[
				{label: 'varie dans la journée', at: VARIE},
				{label: 'seul : pas suffisant', at: SEUL - 2, tone: LPI.pink},
			]}
			punches={[SER + 1, VARIE + 1, SEUL + 1, NORME + 1]}
		/>
	);
};

export const Ferritine: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('ferritine', 'deux');
	const RES = at('ferritine', 'réserves');
	const GARDE = at('ferritine', 'garde-manger.');
	const FIABLE = at('ferritine', 'fiable');
	const BASSE = at('ferritine', 'basse,');
	const MONTE = at('ferritine', 'monte');
	const INFL = at('ferritine', 'inflammation,');
	const FOIE = at('ferritine', 'foie');
	const EXCES = at('ferritine', 'excès');
	const fill = frame < BASSE - 4 ? interpolate(frame, [GARDE - 6, GARDE + 20], [0, 0.8], clamp) : frame < MONTE - 4 ? interpolate(frame, [BASSE - 4, BASSE + 10], [0.8, 0.1], clamp) : interpolate(frame, [MONTE - 4, MONTE + 14], [0.1, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La *ferritine*'}
			titleAt={DEUX}
			pink
			explain={{text: 'les réserves de fer', at: RES}}
			art={{at: GARDE - 6, node: <Live render={() => <Pantry fill={fill} width={360} />} />}}
			artY={790}
			norm={{rows: [['homme', '30 – 300 µg/L'], ['femme', '15 – 200 µg/L']], at: FIABLE - 4, y: 1100}}
			chips={[
				{label: 'basse = manque de fer', at: BASSE - 2, tone: LPI.navy},
				{label: 'inflammation', at: INFL - 2, icon: <FeverIcon size={44} />},
				{label: 'foie malade', at: FOIE - 2, icon: <FattyLiverIcon size={44} />},
				{label: 'excès de fer', at: EXCES - 2},
			]}
			note={{text: 'le chiffre le plus fiable · normes selon le laboratoire', at: FIABLE + 6}}
			punches={[RES + 1, GARDE + 1, FIABLE + 1, BASSE + 1, MONTE + 1]}
			sfx={[{name: 'buzz', at: BASSE}]}
		/>
	);
};

export const Transferrine: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('transferrine', 'trois');
	const CAMION = at('transferrine', 'camion');
	const MANQUE = at('transferrine', 'manque,');
	const PLUS = at('transferrine', 'plus');
	const VIDES = at('transferrine', 'vides');
	const SAT = at('transferrine', 'saturation');
	const load = interpolate(frame, [VIDES - 6, VIDES + 6], [1, 0.4], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'La *transferrine*'}
			titleAt={TROIS}
			titleSize={100}
			explain={{text: 'le camion qui transporte le fer', at: CAMION}}
			art={{
				at: CAMION + 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', gap: 10}}>
								<IronTruck load={load} width={f >= PLUS ? 330 : 440} />
								{f >= PLUS ? <IronTruck load={load} width={330} /> : null}
							</div>
						)}
					/>
				),
			}}
			norm={{rows: [['transferrine', '2 – 4 g/L'], ['saturation', '20 – 40 %']], at: SAT - 6}}
			chips={[
				{label: 'manque de fer : plus de camions', at: PLUS - 2},
				{label: 'mais à moitié vides', at: VIDES - 2, tone: LPI.pink},
			]}
			punches={[CAMION + 1, MANQUE + 1, PLUS + 1, VIDES + 1, SAT + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const FER = at('fin', 'fer,');
	const FERR = at('fin', 'ferritine,');
	const TRANS = at('fin', 'transferrine');
	const LIRE = at('fin', 'lire');
	const PROCH = at('fin', 'prochaine');
	const FOIE = at('fin', 'foie.');
	return (
		<LabFin
			series={S}
			title={'Le bilan du *fer*'}
			rows={[
				{t: FER, title: 'fer sérique', sub: 'varie : seul, il ne suffit pas'},
				{t: FERR, title: 'ferritine', sub: 'les réserves : le plus fiable'},
				{t: TRANS, title: 'transferrine', sub: 'le camion · saturation 20 – 40 %'},
			]}
			check={LIRE}
			next={{at: PROCH, artAt: FOIE, children: <NextTitle pre="le " hot="foie" />}}
		/>
	);
};

