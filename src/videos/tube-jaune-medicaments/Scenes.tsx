// « Le tube jaune : les médicaments » (n° 96, série courte du tube jaune, vidéo 19 ; directives Instagram). Accroche :
// nausées, vision jaune, cœur lent : surdosage en digoxine ? 1 · marge thérapeutique étroite (dose efficace ≈ dose toxique ;
// taux résiduel, juste avant la prise suivante, heure de la dernière prise notée) ; 2 · digoxine (cœur ; surdosage :
// nausées, vision jaune, bradycardie ; risque : sujet âgé, insuffisance rénale, hypokaliémie) ; 3 · lithium (trouble
// bipolaire ; prélèvement 12 h après la dernière prise ; surdosage : tremblements, confusion, ataxie ; déshydratation,
// AINS, diurétiques, IEC le font monter).
// Sources : ANSM / RCP de la digoxine et du lithium (lithiémie à 12 h, cibles ≈ 0,5 – 0,8 mmol/L ; digoxinémie ≈ 0,5 –
// 0,9 ng/mL), HAS (bon usage des dosages de médicaments), variables selon les laboratoires et les indications.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {WallClock} from '../../brand/devices';
import {KidneysIcon} from '../../brand/diabetes';
import {DizzyIcon, ThirstIcon, TremorIcon} from '../../brand/icons';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {Heart} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LES MÉDICAMENTS', total: 3};

/** Jauge : zone efficace étroite, juste sous la zone toxique ; curseur `v` (0 → 1). */
const Window: React.FC<{v: number; width?: number}> = ({v, width = 760}) => {
	const W = 760;
	const H = 220;
	const X = (x: number) => 40 + x * (W - 80);
	return (
		<svg width={width} height={(width / W) * H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<rect x={X(0)} y={60} width={X(1) - X(0)} height={80} rx={40} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={X(0.44)} y={66} width={X(0.66) - X(0.44)} height={68} fill={LPI.sky} />
			<rect x={X(0.66)} y={66} width={X(1) - X(0.66) - 6} height={68} rx={34} fill={alpha(LPI.pink, 0.85)} />
			<text x={X(0.55)} y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={N}>efficace</text>
			<text x={X(0.86)} y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={N}>toxique</text>
			<text x={X(0.2)} y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={alpha(N, 0.6)}>trop faible</text>
			<path d={`M${X(v)} 150 l-20 40 h40 Z`} fill={N} />
		</svg>
	);
};

/** Œil à la vision jaune. */
const YellowEye: React.FC<{size?: number; tint?: number}> = ({size = 160, tint = 1}) => (
	<svg width={size} height={size * 0.6} viewBox="-100 -60 200 120">
		<path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0Z" fill="#FFF" stroke={N} strokeWidth={7} />
		<circle r={34} fill={LPI.blue} stroke={N} strokeWidth={6} />
		<circle r={14} fill={N} />
		<path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0Z" fill="#F2D33A" opacity={0.55 * tint} />
	</svg>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const NAUS = at('intro', 'nausées,');
	const VISION = at('intro', 'vision');
	const COEUR = at('intro', 'cœur');
	const DIGO = at('intro', 'digoxine.');
	const DEUX = at('intro', 'deux');
	const PREL = at('intro', 'prélever ?');
	const slow = frame >= COEUR ? 9 : 4.5;
	return (
		<LabHook
			series={S}
			title={'Les *médicaments*\ndans le tube *jaune*'}
			titleSize={78}
			art={
				<Live
					render={(f) => (
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<div style={{opacity: f >= VISION - 6 ? 1 : 0.15}}><YellowEye size={220} tint={interpolate(f, [VISION - 4, VISION + 10], [0, 1], clamp)} /></div>
							<div style={{opacity: f >= COEUR - 6 ? 1 : 0.15}}><Heart size={150} beat={Math.max(0, Math.sin(f / slow)) ** 3} /></div>
						</div>
					)}
				/>
			}
			chips={[
				{label: 'digoxine', at: DEUX},
				{label: 'lithium', at: DEUX + 6, tone: LPI.pink},
			]}
			notes={[
				{text: 'surdosage ?', at: DIGO - 10},
				{text: 'tu sais quand prélever ?', at: PREL - 12},
			]}
			punches={[NAUS + 1, VISION + 1, COEUR + 1, DIGO + 1, DEUX + 1]}
			shakes={[DIGO + 2]}
		/>
	);
};

export const Principe: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('principe', 'un');
	const ETROITE = at('principe', 'étroite.');
	const PROCHES = at('principe', 'proches.');
	const AVANT = at('principe', 'avant');
	const NOTE = at('principe', 'note');
	const v = 0.3 + 0.29 * Math.sin(frame / 14) + 0.28 * interpolate(frame, [PROCHES - 4, PROCHES + 10], [0, 1], clamp) * Math.max(0, Math.sin(frame / 7));
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Une marge *étroite*'}
			titleAt={UN}
			titleSize={100}
			explain={{text: 'bonne dose et dose toxique sont proches', at: PROCHES - 30}}
			art={{at: ETROITE - 6, node: <Live render={() => <Window v={Math.min(0.95, Math.max(0.05, v))} width={740} />} />}}
			chips={[
				{label: 'dosé juste avant la prise suivante', at: AVANT - 4, tone: LPI.pink},
				{label: "l'heure de la dernière prise notée", at: NOTE - 2, tone: LPI.navy},
			]}
			punches={[ETROITE + 1, PROCHES + 1, AVANT + 1, NOTE + 1]}
		/>
	);
};

export const Digoxine: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('digoxine', 'deux');
	const COEUR = at('digoxine', 'cœur.');
	const NAUS = at('digoxine', 'nausées,');
	const VISION = at('digoxine', 'vision');
	const LENT = at('digoxine', 'lentement.');
	const AGEE = at('digoxine', 'âgée,');
	const REINS = at('digoxine', 'reins');
	const POT = at('digoxine', 'potassium');
	const slow = frame >= LENT - 10 ? 10 : 4.5;
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La *digoxine*'}
			titleAt={DEUX}
			pink
			explain={{text: 'un médicament du cœur', at: COEUR - 8}}
			art={{
				at: COEUR - 6,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<Heart size={190} beat={Math.max(0, Math.sin(f / slow)) ** 3} />
								<div style={{opacity: f >= VISION - 6 ? 1 : 0.15}}><YellowEye size={210} tint={interpolate(f, [VISION - 4, VISION + 10], [0, 1], clamp)} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'surdosage : nausées, vision jaune', at: NAUS - 4},
				{label: 'cœur trop lent', at: LENT - 10, tone: LPI.pink},
				{label: 'risque : âgé · reins · potassium bas', at: AGEE - 6, tone: LPI.navy, icon: <KidneysIcon size={40} />},
			]}
			punches={[COEUR + 1, NAUS + 1, VISION + 1, LENT + 1, AGEE + 1, REINS + 1, POT + 1]}
			sfx={[{name: 'buzz', at: LENT}]}
		/>
	);
};

export const Lithium: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('lithium', 'trois');
	const BIPO = at('lithium', 'bipolaire.');
	const DOUZE = at('lithium', 'douze');
	const SURD = at('lithium', 'surdosé,');
	const TREMB = at('lithium', 'tremblements,');
	const CONF = at('lithium', 'confusion,');
	const DEMAR = at('lithium', 'démarche');
	const DESHY = at('lithium', 'déshydratation');
	const spin = interpolate(frame, [DOUZE - 10, DOUZE + 30], [0, 12], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *lithium*'}
			titleAt={TROIS}
			explain={{text: 'pour le trouble bipolaire', at: BIPO - 10}}
			art={{
				at: DOUZE - 10,
				node: (
					<Live
						render={(f) =>
							f < SURD - 4 ? (
								<WallClock h={(8 + spin) % 12} m={0} size={260} />
							) : (
								<div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
									<TremorIcon size={150} />
									<div style={{opacity: f >= CONF - 6 ? 1 : 0.15}}><DizzyIcon size={150} /></div>
									<div style={{opacity: f >= DESHY - 6 ? 1 : 0.15}}><ThirstIcon size={150} /></div>
								</div>
							)
						}
					/>
				),
			}}
			artY={790}
			chips={[
				{label: 'prélevé 12 h après la dernière prise', at: DOUZE - 2, tone: LPI.pink},
				{label: 'surdosage : tremblements, confusion', at: TREMB - 6},
				{label: 'démarche instable', at: DEMAR - 4},
				{label: 'déshydratation : il monte', at: DESHY - 2, tone: LPI.navy},
			]}
			punches={[BIPO + 1, DOUZE + 1, SURD + 1, TREMB + 1, CONF + 1, DEMAR + 1, DESHY + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const MARGE = at('fin', 'marge');
	const PREL = at('fin', 'prélèvement');
	const NOTEE = at('fin', 'notée');
	const TUBE = at('fin', 'tube.');
	const PROCH = at('fin', 'prochaine');
	const AUTO = at('fin', "l'auto-immunité.");
	return (
		<LabFin
			series={S}
			title={'*Médicaments*'}
			pink
			rows={[
				{t: MARGE, title: 'marge étroite', sub: 'efficace ≈ toxique'},
				{t: PREL, title: 'digoxine', sub: 'avant la prise · âgé, reins, K⁺ bas'},
				{t: NOTEE - 10, title: 'lithium', sub: '12 h après la dernière prise'},
			]}
			check={TUBE}
			next={{at: PROCH, artAt: AUTO - 10, children: <NextTitle pre="l'" hot="auto-immunité" />}}
		/>
	);
};
