// « Le tube jaune : l'auto-immunité (2) » (n° 98, série courte du tube jaune, vidéo 21 ; directives Instagram). Accroche :
// doigts raides et gonflés le matin, thyroïde qui se dérègle. 1 · anti-CCP (très spécifiques de la polyarthrite
// rhumatoïde ; peuvent précéder les symptômes) ; 2 · facteur rhumatoïde (souvent associé, moins spécifique : infections,
// autres maladies, sujets âgés sains) ; 3 · anti-TPO (thyroïdite auto-immune de Hashimoto, souvent hypothyroïdie ; aussi
// maladie de Basedow) ; 4 · anti-thyroglobuline (complètent les anti-TPO ; suivi des cancers différenciés de la thyroïde).
// Sources : HAS 2007 / SFR (polyarthrite rhumatoïde : FR et anti-CCP) ; HAS 2022 (hypothyroïdie : anti-TPO) ; ETA
// (suivi des cancers différenciés : thyroglobuline + anticorps anti-Tg).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {alpha, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: "LE TUBE JAUNE · L'AUTO-IMMUNITÉ 2/2", total: 4};
const SKIN = '#F1C9A8';

/** Main vue de face ; `swell` (0 → 1) : articulations des doigts gonflées et rouges. */
const HandJoints: React.FC<{swell: number; size?: number}> = ({swell, size = 320}) => {
	const frame = useCurrentFrame();
	const fingers = [
		{x: -66, len: 120},
		{x: -22, len: 150},
		{x: 22, len: 140},
		{x: 64, len: 110},
	];
	const pulse = 1 + 0.08 * swell * Math.sin(frame / 5);
	return (
		<svg width={size} height={size * 1.15} viewBox="-130 -230 260 300" style={{overflow: 'visible'}}>
			<path d="M-95 -10 Q-100 60 -40 70 H50 Q100 60 96 -10 Z" fill={SKIN} stroke={N} strokeWidth={6} />
			<path d="M-95 -10 Q-140 -50 -130 -90 Q-118 -100 -100 -70 L-80 -40" fill={SKIN} stroke={N} strokeWidth={6} />
			{fingers.map((f, i) => (
				<g key={i}>
					<rect x={f.x - 19} y={-f.len - 10} width={38} height={f.len + 20} rx={19} fill={SKIN} stroke={N} strokeWidth={6} />
					{[0.35, 0.7].map((k) => (
						<ellipse key={k} cx={f.x} cy={-f.len * k} rx={(20 + 9 * swell) * pulse} ry={(12 + 6 * swell) * pulse} fill={alpha('#D9534F', 0.65 * swell)} />
					))}
				</g>
			))}
			{fingers.map((f, i) => (
				<ellipse key={`m${i}`} cx={f.x} cy={-8} rx={(18 + 8 * swell) * pulse} ry={(12 + 6 * swell) * pulse} fill={alpha('#D9534F', 0.7 * swell)} />
			))}
		</svg>
	);
};

/** Thyroïde en papillon, attaquée (`attack`) par des anticorps. */
const ThyroidAttack: React.FC<{attack: number; size?: number; slow?: number}> = ({attack, size = 300, slow = 0}) => (
	<svg width={size} height={size * 0.8} viewBox="-130 -100 260 200" style={{overflow: 'visible'}}>
		{[-1, 1].map((sd) => (
			<path key={sd} d={`M${sd * 8} -10 C${sd * 30} -60 ${sd * 90} -50 ${sd * 88} 0 C${sd * 86} 50 ${sd * 30} 55 ${sd * 8} 20 Z`} fill={alpha(LPI.pink, 1 - 0.5 * slow)} stroke={N} strokeWidth={6} />
		))}
		<rect x={-14} y={-14} width={28} height={36} rx={10} fill={alpha(LPI.pink, 1 - 0.5 * slow)} stroke={N} strokeWidth={6} />
		{Array.from({length: 6}).map((_, i) => {
			const a = (i / 6) * Math.PI * 2 + 0.3;
			const r = 190 - 110 * attack;
			return (
				<g key={i} transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r * 0.75}) rotate(${(a * 180) / Math.PI - 90})`}>
					<path d="M0 30 V0 M0 0 L-18 -22 M0 0 L18 -22" stroke={N} strokeWidth={12} strokeLinecap="round" fill="none" />
					<path d="M0 30 V0 M0 0 L-18 -22 M0 0 L18 -22" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" fill="none" />
				</g>
			);
		})}
	</svg>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const DOIGTS = at('intro', 'doigts');
	const MATINS = at('intro', 'matins ?');
	const THY = at('intro', 'thyroïde');
	const QUATRE = at('intro', 'quatre');
	const CONN = at('intro', 'connais ?');
	return (
		<LabHook
			series={S}
			title={"*L'auto-immunité*\n(suite)"}
			titleSize={84}
			art={
				<Live
					render={(f) =>
						f < THY - 4 ? (
							<HandJoints size={250} swell={interpolate(frame, [DOIGTS, MATINS], [0, 1], clamp)} />
						) : (
							<ThyroidAttack size={300} attack={interpolate(frame, [THY - 4, THY + 30], [0, 0.8], clamp)} />
						)
					}
				/>
			}
			chips={[
				{label: 'anti-CCP', at: QUATRE},
				{label: 'facteur rhumatoïde', at: QUATRE + 5, tone: LPI.pink},
				{label: 'anti-TPO', at: QUATRE + 10},
				{label: 'anti-thyroglobuline', at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[{text: 'tu les connais ?', at: CONN - 6}]}
			punches={[DOIGTS + 1, MATINS + 1, THY + 1, QUATRE + 1]}
		/>
	);
};

export const Ccp: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('ccp', 'un');
	const SPEC = at('ccp', 'spécifiques');
	const PR = at('ccp', 'polyarthrite');
	const INFL = at('ccp', 'inflammation');
	const MAINS = at('ccp', 'mains.');
	const AVANT = at('ccp', 'avant');
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'Les *anti-CCP*'}
			titleAt={UN}
			explain={{text: 'la polyarthrite rhumatoïde', at: PR - 4}}
			art={{at: SPEC - 6, node: <Live render={() => <HandJoints size={280} swell={interpolate(frame, [INFL - 6, MAINS + 10], [0, 1], clamp)} />} />}}
			artY={800}
			chips={[
				{label: 'très spécifiques', at: SPEC - 2, tone: LPI.pink},
				{label: 'articulations enflammées, surtout les mains', at: INFL - 2},
				{label: 'parfois avant les douleurs', at: AVANT - 6, tone: LPI.navy},
			]}
			punches={[SPEC + 1, PR + 1, INFL + 1, MAINS + 1, AVANT + 1]}
		/>
	);
};

export const Fr: React.FC = () => {
	const DEUX = at('fr', 'deux');
	const FACT = at('fr', 'facteur');
	const ACC = at('fr', 'accompagne');
	const MOINS = at('fr', 'moins');
	const INF = at('fr', 'infections,');
	const AGEES = at('fr', 'âgées');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'Le facteur *rhumatoïde*'}
			titleAt={DEUX}
			titleSize={82}
			pink
			explain={{text: 'souvent avec les anti-CCP', at: ACC - 4}}
			art={{at: FACT - 4, node: <HandJoints size={250} swell={0.6} />}}
			artY={800}
			chips={[
				{label: 'moins précis', at: MOINS - 2, tone: LPI.navy},
				{label: 'aussi : infections, autres maladies', at: INF - 6},
				{label: 'personnes âgées en bonne santé', at: AGEES - 8, tone: LPI.pink},
			]}
			punches={[FACT + 1, ACC + 1, MOINS + 1, INF + 1, AGEES + 1]}
		/>
	);
};

export const Tpo: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('tpo', 'trois');
	const ATT = at('tpo', 'attaquent');
	const THY = at('tpo', 'thyroïdite');
	const HASHI = at('tpo', 'hashimoto,');
	const HYPO = at('tpo', "l'hypothyroïdie.");
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *anti-TPO*'}
			titleAt={TROIS}
			explain={{text: 'ils attaquent la thyroïde', at: ATT - 4}}
			art={{at: ATT - 6, node: <Live render={() => <ThyroidAttack size={340} attack={interpolate(frame, [ATT - 6, ATT + 24], [0, 0.85], clamp)} slow={interpolate(frame, [HYPO - 10, HYPO + 10], [0, 1], clamp)} />} />}}
			artY={800}
			chips={[
				{label: 'thyroïdite auto-immune', at: THY - 2, tone: LPI.pink},
				{label: 'maladie de Hashimoto', at: HASHI - 6},
				{label: 'souvent : hypothyroïdie', at: HYPO - 10, tone: LPI.navy},
			]}
			punches={[ATT + 1, THY + 1, HASHI + 1, HYPO + 1]}
		/>
	);
};

export const Tg: React.FC = () => {
	const QUATRE = at('tg', 'quatre');
	const TG = at('tg', 'anti-thyroglobuline.');
	const COMP = at('tg', 'complètent');
	const SUIVI = at('tg', 'suivi');
	const CANC = at('tg', 'cancers');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'Les *anti-Tg*'}
			titleAt={QUATRE}
			pink
			explain={{text: 'anti-thyroglobuline', at: TG}}
			art={{at: TG, node: <ThyroidAttack size={300} attack={0.6} />}}
			artY={800}
			chips={[
				{label: 'ils complètent les anti-TPO', at: COMP - 4},
				{label: 'suivi de certains cancers de la thyroïde', at: SUIVI - 6, tone: LPI.navy},
			]}
			punches={[TG + 1, COMP + 1, SUIVI + 1, CANC + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const ART = at('fin', 'articulations');
	const THY = at('fin', 'thyroïde');
	const O = at('fin', 'o.');
	const PROCH = at('fin', 'prochaine');
	const VIT = at('fin', 'vitamines.');
	return (
		<LabFin
			series={S}
			title={'*Auto-immunité*'}
			pink
			rows={[
				{t: ART, title: 'anti-CCP', sub: 'polyarthrite rhumatoïde'},
				{t: ART + 14, title: 'facteur rhumatoïde', sub: 'moins précis'},
				{t: THY, title: 'anti-TPO', sub: 'Hashimoto'},
				{t: THY + 14, title: 'anti-Tg', sub: 'thyroïde · suivi des cancers'},
			]}
			check={O}
			next={{at: PROCH, artAt: VIT - 10, children: <NextTitle pre="la dernière : les " hot="vitamines" />}}
		/>
	);
};
