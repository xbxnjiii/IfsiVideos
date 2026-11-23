// « Le tube jaune : le foie » (n° 80, série courte du tube jaune, vidéo 3 ; directives Instagram). Accroche : le foie souffre
// en silence, 4 enzymes donnent l'alerte avant la jaunisse. 1 – 2 · transaminases ASAT (GOT) et ALAT (GPT) : dans les
// cellules du foie, passent dans le sang quand elles sont abîmées (hépatite, médicaments, alcool) ; l'ALAT est la plus propre
// au foie ; 3 · gamma-GT (alcool, médicaments, bile qui circule mal) ; 4 · PAL (bile bloquée par un calcul ; viennent aussi
// des os, plus hautes chez l'enfant).
// Sources : valeurs usuelles des laboratoires français (ASAT / ALAT < 40 UI/L environ ; GGT H < 55 / F < 38 UI/L ; PAL
// ≈ 40 – 130 UI/L chez l'adulte), variables selon les laboratoires et les méthodes ; AFEF (bilan hépatique).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {PillIcon} from '../../brand/icons';
import {BileDuct, BoneIcon, LiverCells} from '../../brand/labart';
import {IconDot, LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FattyLiverIcon} from '../../brand/liver';
import {LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · LE FOIE', total: 4};

export const Hook: React.FC = () => {
	const SILENCE = at('intro', 'silence.');
	const QUATRE = at('intro', 'quatre');
	const ALERTE = at('intro', "l'alerte,");
	const JAUN = at('intro', 'jaunisse.');
	const LIRE = at('intro', 'lire');
	return (
		<LabHook
			series={S}
			title={'Le *foie*\ndans le tube *jaune*'}
			art={<Live render={(f) => <div style={{transform: `scale(${1 + 0.04 * Math.sin(f / 8)})`}}><IconDot size={330}><FattyLiverIcon size={250} /></IconDot></div>} />}
			chips={[
				{label: 'ASAT', at: QUATRE},
				{label: 'ALAT', at: QUATRE + 5, tone: LPI.pink},
				{label: 'gamma-GT', at: QUATRE + 10},
				{label: 'PAL', at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[
				{text: "l'alerte avant la jaunisse", at: JAUN - 8},
				{text: 'tu sais les lire ?', at: LIRE - 6},
			]}
			punches={[SILENCE + 1, QUATRE + 1, ALERTE + 1, JAUN + 1]}
		/>
	);
};

export const Transa: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('transa', 'un');
	const TRANS = at('transa', 'transaminases,');
	const ALAT = at('transa', "l'alat,");
	const GOT = at('transa', 'got');
	const CELL = at('transa', 'cellules');
	const ABIM = at('transa', 'abîmées,');
	const HEP = at('transa', 'hépatite,');
	const MED = at('transa', 'médicaments');
	const ALC = at('transa', "l'alcool.");
	const PROPRE = at('transa', 'propre');
	const hurt = interpolate(frame, [ABIM - 4, ABIM + 20], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1], [ALAT, 2]]}
			title={'Les *transaminases*'}
			titleAt={TRANS}
			titleSize={96}
			explain={{text: 'ASAT (GOT) · ALAT (GPT)', at: GOT - 4}}
			art={{at: CELL - 6, node: <Live render={() => <LiverCells hurt={hurt} width={460} />} />}}
			artY={790}
			norm={{rows: [['', '< 40 UI/L environ']], at: HEP - 8, y: 1090}}
			chips={[
				{label: 'hépatite', at: HEP - 2},
				{label: 'médicaments', at: MED - 2, icon: <PillIcon size={40} />, tone: LPI.pink},
				{label: 'alcool', at: ALC - 2},
			]}
			note={{text: "l'ALAT : la plus propre au foie", at: PROPRE - 6, size: 36}}
			punches={[TRANS + 1, CELL + 1, ABIM + 1, HEP + 1, PROPRE + 1]}
			sfx={[{name: 'buzz', at: ABIM}]}
		/>
	);
};

export const Ggt: React.FC = () => {
	const TROIS = at('ggt', 'trois');
	const GT = at('ggt', 'gt.');
	const ALC = at('ggt', "l'alcool,");
	const MED = at('ggt', 'médicaments…');
	const BILE = at('ggt', 'bile');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Les *gamma-GT*'}
			titleAt={TROIS}
			pink
			explain={{text: 'GGT', at: GT}}
			art={{at: ALC - 4, node: <IconDot size={230}><FattyLiverIcon size={170} /></IconDot>}}
			norm={{rows: [['homme', '< 55 UI/L'], ['femme', '< 38 UI/L']], at: ALC + 6}}
			chips={[
				{label: 'alcool', at: ALC},
				{label: 'médicaments', at: MED - 2, icon: <PillIcon size={40} />},
				{label: 'bile qui circule mal', at: BILE - 4, tone: LPI.navy},
			]}
			note={{text: 'normes selon le laboratoire', at: BILE + 20}}
			punches={[GT + 1, ALC + 1, MED + 1, BILE + 1]}
		/>
	);
};

export const Pal: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('pal', 'quatre');
	const PHOS = at('pal', 'phosphatases');
	const PAL = at('pal', 'pal.');
	const BILE = at('pal', 'bile');
	const CALC = at('pal', 'calcul');
	const OS = at('pal', 'os');
	const ENFANT = at('pal', "l'enfant");
	const block = interpolate(frame, [CALC - 6, CALC + 6], [0, 1], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={'Les *PAL*'}
			titleAt={QUATRE}
			explain={{text: 'phosphatases alcalines', at: PHOS}}
			art={{at: BILE - 6, node: <Live render={() => <BileDuct block={block} width={520} />} />}}
			norm={{rows: [['adulte', '≈ 40 – 130 UI/L']], at: PAL + 4}}
			chips={[
				{label: 'bile bloquée (calcul)', at: CALC - 2, tone: LPI.pink},
				{label: 'les os', at: OS - 2, icon: <BoneIcon size={44} />},
				{label: "plus hautes chez l'enfant", at: ENFANT - 4, tone: LPI.navy},
			]}
			punches={[PHOS + 1, BILE + 1, CALC + 1, OS + 1, ENFANT + 1]}
			sfx={[{name: 'buzz', at: CALC}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const TRANS = at('fin', 'transaminases,');
	const GT = at('fin', 'gt,');
	const PHOS = at('fin', 'phosphatases');
	const FOIE = at('fin', 'foie.');
	const PROCH = at('fin', 'prochaine');
	const CHOL = at('fin', 'cholestérol.');
	return (
		<LabFin
			series={S}
			title={'Bilan du *foie*'}
			pink
			rows={[
				{t: TRANS, title: 'ASAT · ALAT', sub: "cellules du foie abîmées"},
				{t: GT, title: 'gamma-GT', sub: 'alcool, médicaments, bile'},
				{t: PHOS, title: 'PAL', sub: 'bile bloquée · os'},
			]}
			check={FOIE}
			next={{at: PROCH, artAt: CHOL, children: <NextTitle pre="le " hot="cholestérol" />}}
		/>
	);
};
