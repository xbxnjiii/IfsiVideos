// « Le tube jaune : les sérologies (2) : la grossesse » (n° 93, série courte du tube jaune, vidéo 16 ; directives Instagram).
// Accroche : un steak saignant pendant la grossesse. 1 · toxoplasmose (viande mal cuite, terre, litière ; non immunisée :
// sérologie tous les mois jusqu'à l'accouchement + conseils) ; 2 · rubéole (malformations au début de la grossesse ; non
// immunisée : vaccin après l'accouchement, jamais pendant (vaccin vivant)) ; 3 · CMV (salive et urines des jeunes enfants ;
// hygiène des mains après les couches, couverts non partagés) ; 4 · EBV (mononucléose ; IgM = infection récente : fièvre,
// angine, grande fatigue).
// Sources : HAS 2016 / arrêté du 1er février 2017 (sérologie de toxoplasmose mensuelle si non immune, rubéole en début de
// grossesse) ; HCSP 2018 (CMV : mesures d'hygiène) ; calendrier vaccinal (rubéole : vaccin vivant contre-indiqué pendant la
// grossesse, en post-partum).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Live} from '../../brand/bold';
import {MeatIcon} from '../../brand/colorectal';
import {MomToBe} from '../../brand/diabetes';
import {FeverIcon} from '../../brand/icons';
import {Cat} from '../../brand/injury';
import {Baby, Diaper} from '../../brand/kids';
import {LabFin, LabHook, LabNotion, NextTitle} from '../../brand/labshort';
import {FONT, LPI} from '../../brand/theme';
import {CAP} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const S = {cap: CAP.gel, label: 'LE TUBE JAUNE · SÉROLOGIES 2/3', total: 4};

/** Pastille « IgM + ». */
const IgmTag: React.FC<{on: number}> = ({on}) => (
	<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, background: LPI.pink, border: `6px solid ${N}`, borderRadius: 30, padding: '14px 30px', transform: `scale(${0.6 + 0.4 * on})`, opacity: on}}>IgM +</div>
);

/** Calendrier : un tube par mois pendant la grossesse ; `n` mois cochés. */
const Months: React.FC<{n: number}> = ({n}) => (
	<div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, width: 640}}>
		{Array.from({length: 9}).map((_, i) => (
			<div key={i} style={{height: 90, borderRadius: 20, border: `5px solid ${N}`, background: i < n ? LPI.sky : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>
				{i < n ? '✓' : `M${i + 1}`}
			</div>
		))}
	</div>
);

export const Hook: React.FC = () => {
	const STEAK = at('intro', 'steak');
	const BEBE = at('intro', 'bébé');
	const SEQ = at('intro', 'séquelles.');
	const QUATRE = at('intro', 'quatre');
	const CONN = at('intro', 'connais ?');
	return (
		<LabHook
			series={S}
			title={'Les *sérologies*\nde la *grossesse*'}
			titleSize={92}
			art={
				<Live
					render={(f) => (
						<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
							<MomToBe width={200} belly={1} inside={interpolate(f, [BEBE - 6, BEBE + 10], [0, 1], clamp)} mood={f >= SEQ - 4 ? 'inquiete' : 'calme'} />
							<div style={{opacity: f >= STEAK - 6 ? 1 : 0.15}}><MeatIcon size={130} /></div>
						</div>
					)}
				/>
			}
			chips={[
				{label: 'toxoplasmose', at: QUATRE},
				{label: 'rubéole', at: QUATRE + 5, tone: LPI.pink},
				{label: 'CMV', at: QUATRE + 10},
				{label: 'EBV', at: QUATRE + 15, tone: LPI.pink},
			]}
			notes={[
				{text: 'un steak saignant…', at: STEAK - 4},
				{text: 'tu les connais ?', at: CONN - 6},
			]}
			punches={[STEAK + 1, BEBE + 1, SEQ + 1, QUATRE + 1]}
			shakes={[SEQ + 2]}
		/>
	);
};

export const Toxo: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('toxo', 'un');
	const VIANDE = at('toxo', 'viande');
	const TERRE = at('toxo', 'terre');
	const LIT = at('toxo', 'litières');
	const IMMU = at('toxo', 'immunisée,');
	const MOIS = at('toxo', 'mois');
	const CONS = at('toxo', 'conseils :');
	const LAVES = at('toxo', 'lavés.');
	const n = interpolate(frame, [MOIS - 10, MOIS + 30], [0, 9], clamp);
	return (
		<LabNotion
			series={S}
			steps={[[UN, 1]]}
			title={'La *toxoplasmose*'}
			titleAt={UN}
			titleSize={100}
			explain={{text: 'un parasite', at: VIANDE - 14}}
			art={{
				at: VIANDE - 6,
				node: (
					<Live
						render={(f) =>
							f < IMMU - 6 ? (
								<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
									<MeatIcon size={150} />
									<div style={{opacity: f >= LIT - 6 ? 1 : 0.15}}><Cat size={200} /></div>
								</div>
							) : (
								<Months n={n} />
							)
						}
					/>
				),
			}}
			artY={790}
			chips={[
				{label: 'viande mal cuite', at: VIANDE - 2},
				{label: 'terre · litière de chat', at: TERRE - 2, tone: LPI.pink},
				{label: 'pas immunisée : sérologie chaque mois', at: MOIS - 8, tone: LPI.navy},
				{label: 'viande bien cuite, légumes lavés', at: CONS + 10},
			]}
			punches={[VIANDE + 1, TERRE + 1, LIT + 1, IMMU + 1, MOIS + 1, CONS + 1, LAVES + 1]}
		/>
	);
};

export const Rubeole: React.FC = () => {
	const DEUX = at('rubeole', 'deux');
	const DEBUT = at('rubeole', 'début');
	const MALF = at('rubeole', 'malformations');
	const IMMU = at('rubeole', 'immunisée,');
	const VACC = at('rubeole', 'vaccine…');
	const APRES = at('rubeole', "l'accouchement,");
	const JAMAIS = at('rubeole', 'jamais');
	return (
		<LabNotion
			series={S}
			steps={[[0, 1], [DEUX, 2]]}
			title={'La *rubéole*'}
			titleAt={DEUX}
			pink
			explain={{text: 'grave au début de la grossesse', at: DEBUT - 4}}
			art={{
				at: DEBUT - 4,
				node: <Live render={(f) => (f < APRES - 6 ? <MomToBe width={220} belly={0.5} inside={1} mood="inquiete" /> : <Baby size={260} mood="calme" />)} />,
			}}
			chips={[
				{label: 'malformations graves', at: MALF - 2, tone: LPI.pink},
				{label: 'pas immunisée : vaccin', at: VACC - 8},
				{label: "après l'accouchement", at: APRES - 2, tone: LPI.navy},
				{label: 'jamais pendant', at: JAMAIS - 2, tone: LPI.pink},
			]}
			punches={[DEBUT + 1, MALF + 1, IMMU + 1, VACC + 1, APRES + 1, JAMAIS + 1]}
			sfx={[{name: 'buzz', at: JAMAIS}]}
		/>
	);
};

export const Cmv: React.FC = () => {
	const TROIS = at('cmv', 'trois');
	const CMV = at('cmv', 'cytomégalovirus,');
	const SALIVE = at('cmv', 'salive');
	const ENF = at('cmv', 'enfants.');
	const MAINS = at('cmv', 'mains');
	const COUCHE = at('cmv', 'couche,');
	const COUV = at('cmv', 'couverts.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 2], [TROIS, 3]]}
			title={'Le *CMV*'}
			titleAt={TROIS}
			explain={{text: 'cytomégalovirus', at: CMV}}
			art={{
				at: SALIVE - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
								<Baby size={240} mood="calme" />
								<div style={{opacity: f >= COUCHE - 8 ? 1 : 0.15}}><Diaper width={190} wet={0.4} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'salive et urines des petits', at: ENF - 10},
				{label: 'mains lavées après la couche', at: MAINS - 4, tone: LPI.pink},
				{label: 'couverts non partagés', at: COUV - 8, tone: LPI.navy},
			]}
			punches={[CMV + 1, SALIVE + 1, ENF + 1, MAINS + 1, COUCHE + 1, COUV + 1]}
		/>
	);
};

export const Ebv: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('ebv', 'quatre');
	const MONO = at('ebv', 'mononucléose,');
	const BAISER = at('ebv', 'baiser.');
	const M = at('ebv', 'm');
	const REC = at('ebv', 'récente,');
	const FIEVRE = at('ebv', 'fièvre,');
	const ANG = at('ebv', 'angine');
	const FAT = at('ebv', 'fatigue.');
	return (
		<LabNotion
			series={S}
			steps={[[0, 3], [QUATRE, 4]]}
			title={"*L'EBV*"}
			titleAt={QUATRE}
			pink
			explain={{text: 'virus de la mononucléose', at: MONO - 6}}
			art={{
				at: MONO - 4,
				node: (
					<Live
						render={(f) => (
							<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
								<div style={{fontSize: 150, lineHeight: 1, fontFamily: FONT.title, color: LPI.pink, WebkitTextStroke: `5px ${N}`}}>♥</div>
								<IgmTag on={interpolate(f, [M - 6, M + 6], [0, 1], clamp)} />
								<div style={{opacity: f >= FIEVRE - 6 ? 1 : 0}}><FeverIcon size={130} /></div>
							</div>
						)}
					/>
				),
			}}
			chips={[
				{label: 'la maladie du baiser', at: BAISER - 6},
				{label: 'IgM + : infection récente', at: REC - 6, tone: LPI.navy},
				{label: 'fièvre · angine · grande fatigue', at: ANG - 6, tone: LPI.pink},
			]}
			punches={[MONO + 1, BAISER + 1, M + 1, REC + 1, FIEVRE + 1, ANG + 1, FAT + 1]}
		/>
	);
};

export const Fin: React.FC = () => {
	const TOXO = at('fin', 'toxoplasmose,');
	const RUB = at('fin', 'rubéole,');
	const CMV = at('fin', 'cytomégalovirus,');
	const MONO = at('fin', 'mononucléose :');
	const LIRE = at('fin', 'lire.');
	const PROCH = at('fin', 'prochaine');
	const DERN = at('fin', 'dernière');
	return (
		<LabFin
			series={S}
			title={'*Sérologies* · 2/3'}
			pink
			rows={[
				{t: TOXO, title: 'toxoplasmose', sub: 'chaque mois si pas immunisée'},
				{t: RUB, title: 'rubéole', sub: "vaccin après l'accouchement"},
				{t: CMV, title: 'CMV', sub: 'mains lavées, couverts à part'},
				{t: MONO, title: 'EBV', sub: 'IgM + : mononucléose récente'},
			]}
			check={LIRE}
			next={{at: PROCH, artAt: DERN, children: <NextTitle pre="ASLO, " hot="Lyme" post=", Covid" />}}
		/>
	);
};
