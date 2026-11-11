// Série « La douleur : échelles d'évaluation », partie 2 / 2 : l'hétéro-évaluation — v2 (look 2026, voix Laura).
// Accroche « elle ne se plaint jamais » (choisie par le propriétaire) : image 0 = Madame Martin, 87 ans, et « Elle ne se
// plaint jamais » ; sa bulle reste vide ; « Donc, elle n'a pas mal ? » → tampon FAUX ! (flash, secousse) ; « Regarde
// mieux » : on s'approche, son visage se crispe, sa main protège sa hanche (étiquettes au mot) ; « Sa douleur ne se dit
// pas : elle se voit ». Puis la carte de la série, le principe (c'est toi qui observes), Algoplus (grille oui / non en
// plein cadre, 2 / 5), Doloplus (la douleur dure : 10 questions, 8 / 30), la BPS en réanimation, EVENDOL chez l'enfant
// (5 / 15), récap ; à la fin, Madame Martin est enfin soulagée + « série terminée ». Un aplat par scène, une idée par
// plan, vrai flou de mouvement (src/brand/bold.tsx). La v1 reste dans l'historique git (commit bcf0f1d).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, RowCard, ToneBg} from '../../brand/bold';
import {WallClock} from '../../brand/devices';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, Confetti} from '../../brand/motion3';
import {Kid, ObsRow, PAIN_PARTS, PainFace, ScoreBar, TalkIcon, Ventilator} from '../../brand/pain';
import {Patient, PatientProps} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const SKY = LPI.sky;
const ROSE = alpha(LPI.pink, 0.6);
const ON_BLUE = {color: LPI.paper, accent: N};
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);

/** Élément posé (coin haut-gauche en x, y) qui « pop » à `from` et s'efface à `to`. */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'left bottom'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const out = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.7 + 0.3 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

/** Patient (Elder) dans une boîte à sa taille, pour être centré par `Fly`. */
const Box: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => <div style={{position: 'relative', width: size, height: size * 1.4}}>{children}</div>;
/** Point du patient (repère 400 × 560) quand il est centré en (cx, cy) à la taille `size`. */
const pt = (cx: number, cy: number, size: number, px: number, py: number) => ({x: cx - size / 2 + (px * size) / 400, y: cy - size * 0.7 + (py * size) / 400});

/** Bulle vide (« … ») : il ne peut pas parler ; `cross` : barrée. */
const MuteBubble: React.FC<{size?: number; cross?: number}> = ({size = 200, cross = 0}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{overflow: 'visible'}}>
			<path d="M20 10 H180 Q194 10 194 24 V96 Q194 110 180 110 H80 L44 146 V110 H20 Q6 110 6 96 V24 Q6 10 20 10 Z" fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			{[60, 100, 140].map((x, i) => (
				<circle key={x} cx={x} cy={60} r={11} fill={alpha(N, 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 5 - i)))} />
			))}
			{cross > 0 ? <path d={`M16 132 L${16 + 170 * cross} ${132 - 124 * cross}`} stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" /> : null}
		</svg>
	);
};

/** Le patient (taille `size`, en x, y) + calques dans son espace (400 × 560) : bulle « aïe », zone qu'il protège, agitation. */
const Elder: React.FC<PatientProps & {x: number; y: number; moan?: number; guard?: number; agit?: number}> = ({x, y, size = 360, moan = 0, guard = 0, agit = 0, ...p}) => {
	const frame = useCurrentFrame();
	const jx = Math.sin(frame * 1.7) * 7 * agit;
	return (
		<div style={{position: 'absolute', left: x + jx, top: y}}>
			<Patient size={size} elder={1} {...p} />
			<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{guard > 0 ? (
					<g opacity={guard}>
						<circle cx={200} cy={420} r={46 + 6 * Math.sin(frame / 4)} fill={alpha(LPI.pink, 0.45)} stroke={LPI.pink} strokeWidth={6} strokeDasharray="10 8" />
						<path d="M150 380 l-14 -12 M250 380 l14 -12 M200 360 v-16" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
					</g>
				) : null}
				{moan > 0
					? [0, 1, 2].map((i) => {
							const t = ((frame + i * 8) % 24) / 24;
							return <path key={i} d={`M${232 + t * 26} ${140 - 8 - i * 10} q12 ${10 + i * 6} 0 ${30 + i * 18}`} fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" opacity={moan * (1 - t)} />;
						})
					: null}
				{agit > 0
					? [-1, 1].map((k) => <path key={k} d={`M${200 + k * 150} 250 l${k * 16} 10 l${-k * 16} 10 l${k * 16} 10`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={agit * (0.6 + 0.4 * Math.sin(frame))} />)
					: null}
			</svg>
		</div>
	);
};

/** Petites icônes des items (54 px). */
const SoundIcon: React.FC = () => (
	<svg width={40} height={40} viewBox="0 0 100 100">
		<path d="M20 40 H36 L56 22 V78 L36 60 H20 Z" fill={LPI.sky} stroke={N} strokeWidth={7} strokeLinejoin="round" />
		<path d="M68 36 Q78 50 68 64 M78 26 Q94 50 78 74" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" />
	</svg>
);
const EyeIco: React.FC = () => (
	<svg width={40} height={40} viewBox="0 0 100 100">
		<path d="M8 50 Q50 14 92 50 Q50 86 8 50 Z" fill={LPI.paper} stroke={N} strokeWidth={7} strokeLinejoin="round" />
		<circle cx={50} cy={50} r={14} fill={N} />
	</svg>
);
const BodyIco: React.FC = () => (
	<svg width={40} height={40} viewBox="0 0 100 100">
		<circle cx={50} cy={22} r={12} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<path d="M30 92 V54 Q30 40 50 40 Q70 40 70 54 V92" fill={LPI.blue} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		<circle cx={50} cy={66} r={9} fill={LPI.pink} />
	</svg>
);
const MoveIco: React.FC = () => (
	<svg width={40} height={40} viewBox="0 0 100 100">
		<path d="M14 50 l14 -12 v24 Z M86 50 l-14 -12 v24 Z" fill={N} />
		<path d="M30 50 H70" stroke={N} strokeWidth={7} strokeLinecap="round" />
		<path d="M44 22 l6 -10 l6 10 M44 78 l6 10 l6 -10" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
const LinkIco: React.FC = () => (
	<svg width={40} height={40} viewBox="0 0 100 100">
		<circle cx={30} cy={36} r={12} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<circle cx={70} cy={36} r={12} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<path d="M12 84 Q30 56 48 84 M52 84 Q70 56 88 84" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
	</svg>
);
const MiniFace: React.FC<{level?: number}> = ({level = 4}) => <PainFace level={level} size={42} />;

/* ═══════════════════════════════ ACCROCHE : ELLE NE SE PLAINT JAMAIS ═══════════════════════════════ */
const HK = {cx: 540, cy: 960, size: 560};
const HK2 = {cx: 540, cy: 1000, size: 700};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MARTIN = at('intro', 'martin,');
	const JAMAIS = at('intro', 'jamais');
	const MOT = at('intro', 'mot,');
	const CRI = at('intro', 'cri.');
	const DONC = at('intro', 'donc,');
	const FAUX = at('intro', 'faux');
	const REG = at('intro', 'regarde');
	const CRISPE = at('intro', 'crispe,');
	const MAIN = at('intro', 'main');
	const HANCHE = at('intro', 'hanche…');
	const DOUL = at('intro', 'douleur');
	const VOIT = at('intro', 'voit.');
	const face = pt(HK2.cx, HK2.cy, HK2.size, 200, 108);
	const hip = pt(HK2.cx, HK2.cy, HK2.size, 200, 420);
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[MARTIN + 1, JAMAIS + 1, CRI + 1, FAUX + 1, REG + 1, CRISPE + 1, HANCHE + 1, VOIT + 1]} shakes={[FAUX + 2]} strength={0.04}>
				<Fly at={-60} x={HK.cx} y={HK.cy} move={[{at: REG - 2, x: HK2.cx, y: HK2.cy, s: HK2.size / HK.size, dur: 16}]}>
					<Box size={HK.size}>
						<Live
							render={(f) => (
								<Elder x={0} y={0} size={HK.size} woman breath={idle(f)} mood={f >= CRISPE - 2 ? 'mal' : 'calme'} pain={fadeIn(f, CRISPE - 2, 8) * 0.7} guard={fadeIn(f, MAIN - 2, 8)} />
							)}
						/>
					</Box>
				</Fly>
				<Note at={MARTIN - 2} to={REG - 6} y={430} size={40} tone={LPI.paper}>
					Mme Martin · 87 ans
				</Note>
				<Pop from={MOT - 4} to={FAUX - 4} x={720} y={520}>
					<MuteBubble size={210} cross={fadeIn(frame, CRI - 2, 8)} />
				</Pop>
				<Stamp at={FAUX} x={540} y={1180} text="FAUX !" size={130} rot={-8} out={REG + 6} />
				<Burst at={FAUX} x={540} y={1180} r={420} n={18} />
				<PointTag at={CRISPE - 2} x={830} y={520} px={face.x + 40} py={face.y}>
					son visage se crispe
				</PointTag>
				<PointTag at={HANCHE - 4} x={330} y={1430} px={hip.x - 40} py={hip.y}>
					elle protège sa hanche
				</PointTag>
				<Big from={-60} to={DONC - 6} text={'Elle ne se plaint\n*jamais*'} size={116} y={150} />
				<Big from={DONC - 4} to={REG - 6} text={"Donc… elle n'a\npas *mal* ?"} size={116} y={150} />
				<Big from={REG - 4} to={DOUL - 6} text={'Regarde\n*mieux*'} size={130} y={150} />
				<Big from={DOUL - 4} text={'Elle ne se dit pas…\nelle se *voit*'} size={110} y={150} />
			</Camera>
			<Flash at={FAUX} max={0.35} />
			<Sfx name="pop" at={MARTIN - 2} volume={0.07} />
			<Sfx name="pop" at={MOT - 4} volume={0.07} />
			<Sfx name="tick" at={CRI - 2} volume={0.07} />
			<Sfx name="stamp" at={FAUX} volume={0.13} />
			<Sfx name="whoosh" at={REG - 2} volume={0.08} />
			<Sfx name="pop" at={CRISPE - 2} volume={0.08} />
			<Sfx name="pop" at={HANCHE - 4} volume={0.08} />
			<Sfx name="ding" at={VOIT} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const Serie: React.FC = () => {
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const DEUX = at('serie', 'deux');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const REP = at('serie', 'répondre.');
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[DEUX + 1, SERIE + 1, REP + 1]} shakes={[DEUX + 2]}>
				<Note at={NOUS - 4} y={150} size={34} tone={N}>
					SÉRIE · LA DOULEUR
				</Note>
				<Big from={PART - 2} text={'Partie *2* sur 2'} size={124} y={250} center />
				<SeriesParts parts={PAIN_PARTS} current={1} at={DEUX - 2} y={520} />
				<Note at={AUJ - 2} y={960} size={50}>
					Aujourd&apos;hui : <span style={{color: LPI.blue}}>il ne peut pas répondre</span>
				</Note>
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={DEUX - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={REP} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PRINCIPE : C'EST TOI QUI OBSERVES ═══════════════════════════════ */
const HT = {cx: 540, cy: 960, size: 520};

export const Hetero: React.FC = () => {
	const frame = useCurrentFrame();
	const EXPR = at('hetero', "s'exprimer,");
	const TOI = at('hetero', 'toi');
	const OBS = at('hetero', "l'observant");
	const HET = at('hetero', "l'hétéro-évaluation.");
	const VIS = at('hetero', 'visage,');
	const GEST = at('hetero', 'gestes');
	const PLAI = at('hetero', 'plaintes');
	const PARL = at('hetero', 'parlent');
	const face = pt(HT.cx, HT.cy, HT.size, 200, 108);
	const hip = pt(HT.cx, HT.cy, HT.size, 200, 420);
	const mouth = pt(HT.cx, HT.cy, HT.size, 220, 150);
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[EXPR + 1, TOI + 1, OBS + 1, HET + 1, VIS + 1, GEST + 1, PLAI + 1]} strength={0.03}>
				<Big from={-2} to={TOI - 6} text={'Il ne peut pas\nle *dire*'} size={120} />
				<Big from={TOI - 4} to={HET - 6} text={"C'est *toi*\nqui *observes*"} size={120} />
				<Big from={HET - 4} text={"*L'hétéro-*\n*évaluation*"} size={120} />
				<Fly at={-4} x={HT.cx} y={HT.cy} from="bottom" dist={1100}>
					<Box size={HT.size}>
						<Live render={(f) => <Elder x={0} y={0} size={HT.size} breath={idle(f, 40)} mood="mal" pain={0.5} moan={fadeIn(f, PLAI - 2, 6)} guard={interpolate(f, [GEST - 2, GEST + 6], [0, 1], clamp)} />} />
					</Box>
				</Fly>
				<Pop from={2} to={TOI - 6} x={720} y={560}>
					<MuteBubble size={200} cross={fadeIn(frame, EXPR - 2, 8)} />
				</Pop>
				{/* le viseur : c'est toi qui regardes */}
				{frame >= OBS - 2 && frame < VIS - 4 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: fadeIn(frame, OBS - 2, 6)}}>
						<circle cx={HT.cx} cy={900} r={330 + 8 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={10} strokeDasharray="26 16" strokeDashoffset={frame * 2} />
					</svg>
				) : null}
				<PointTag at={VIS - 2} x={840} y={560} px={face.x + 40} py={face.y}>
					son visage
				</PointTag>
				<PointTag at={GEST - 2} x={270} y={1310} px={hip.x - 40} py={hip.y}>
					ses gestes
				</PointTag>
				<PointTag at={PLAI - 2} x={850} y={980} px={mouth.x + 20} py={mouth.y}>
					ses plaintes
				</PointTag>
				<Note at={HET + 4} to={VIS - 6} y={1330} size={46}>
					le soignant évalue en observant
				</Note>
			</Camera>
			<Sfx name="tick" at={EXPR - 2} volume={0.07} />
			<Sfx name="whoosh" at={OBS - 2} volume={0.06} />
			<Sfx name="pop" at={HET + 4} volume={0.07} />
			{[VIS, GEST, PLAI].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="ding" at={PARL} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · ALGOPLUS ═══════════════════════════════ */
const ROW_Y = 410;
const ROW_STEP = 128;
const SMALL = {x: 160, y: 1400, s: 0.45};

export const Algoplus: React.FC = () => {
	const frame = useCurrentFrame();
	const COMMU = at('algoplus', 'communique');
	const ALGO = at('algoplus', 'algoplus.');
	const CINQ = at('algoplus', 'cinq');
	const VIS = at('algoplus', 'visage,');
	const REG = at('algoplus', 'regard,');
	const PLAI = at('algoplus', 'plaintes,');
	const CORPS = at('algoplus', 'corps,');
	const COMP = at('algoplus', 'comportement.');
	const UN = at('algoplus', 'un');
	const DES = at('algoplus', 'dès');
	const SOUL = at('algoplus', 'soulage.');
	const items: [number, React.ReactNode, string, number][] = [
		[VIS, <MiniFace key="v" />, 'son visage', 1],
		[REG, <EyeIco key="r" />, 'son regard', 0],
		[PLAI, <SoundIcon key="p" />, 'ses plaintes', 0],
		[CORPS, <BodyIco key="c" />, 'son corps', 1],
		[COMP, <MoveIco key="m" />, 'son comportement', 0],
	];
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[COMMU + 1, ALGO + 1, CINQ + 1, ...items.map((r) => r[0] + 1), UN + 1, DES + 1]} shakes={[DES + 2]} strength={0.03}>
				<Big from={-2} to={ALGO - 6} text={'Elle ne\n*communique* pas'} size={116} />
				<Big from={ALGO - 4} text={'*Algoplus*'} size={150} />
				<Fly at={-4} x={540} y={960} from="bottom" dist={1100} move={[{at: ALGO - 4, x: SMALL.x, y: SMALL.y, s: SMALL.s, dur: 12}]}>
					<Box size={520}>
						<Live render={(f) => <Elder x={0} y={0} size={520} woman breath={idle(f)} mood="mal" pain={0.4} guard={interpolate(f, [CORPS - 2, CORPS + 6], [0, 1], clamp)} />} />
					</Box>
				</Fly>
				<Pop from={COMMU - 2} to={ALGO - 6} x={720} y={560}>
					<MuteBubble size={200} cross={fadeIn(frame, COMMU + 4, 8)} />
				</Pop>
				<Note at={CINQ - 2} to={VIS - 4} y={340} size={40}>
					5 questions · oui ou non
				</Note>
				{items.map(([t, icon, label, v], i) => (
					<ObsRow key={label} at={t - 2} y={ROW_Y + i * ROW_STEP} h={112} icon={icon} label={label} mode="yesno" value={v} answerAt={UN - 2 + i * 3} from={i % 2 ? 'left' : 'right'} />
				))}
				<Note at={UN + 14} y={1062} size={66} tone={LPI.pink}>
					2 / 5
				</Note>
				<Note at={DES - 2} y={1170} size={44}>
					dès 2 sur 5 : elle a mal
				</Note>
				<Note at={SOUL - 2} y={1268} size={44} tone={LPI.sky}>
					on la soulage
				</Note>
			</Camera>
			<Sfx name="pop" at={COMMU - 2} volume={0.07} />
			<Sfx name="whoosh" at={ALGO - 4} volume={0.08} />
			{items.map(([t]) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.07} />
			))}
			{items.map((_, i) => (
				<Sfx key={`a${i}`} name="tick" at={UN - 2 + i * 3} volume={0.06} />
			))}
			<Sfx name="ding" at={UN + 14} volume={0.08} />
			<Sfx name="impact" at={DES} volume={0.08} />
			<Sfx name="pop" at={SOUL - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · DOLOPLUS ═══════════════════════════════ */
export const Doloplus: React.FC = () => {
	const frame = useCurrentFrame();
	const DURE = at('doloplus', 'dure');
	const DOLO = at('doloplus', 'doloplus.');
	const DIX = at('doloplus', 'dix');
	const CORPS = at('doloplus', 'corps,');
	const MOUV = at('doloplus', 'mouvements,');
	const REL = at('doloplus', 'relation');
	const PART = at('doloplus', 'partir');
	const TRENTE = at('doloplus', 'trente,');
	const PRES = at('doloplus', 'présente.');
	const value = interpolate(frame, [PART - 2, TRENTE + 12], [0, 8], ease);
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[DURE + 1, DOLO + 1, DIX + 1, CORPS + 1, MOUV + 1, REL + 1, TRENTE + 1]} strength={0.03}>
				<Big from={-2} to={DOLO - 6} text={'Si la douleur\n*dure*…'} size={124} />
				<Big from={DOLO - 4} text={'*Doloplus*'} size={150} />
				<Fly at={-4} out={DIX - 6} x={540} y={860} from="bottom" to="top" dist={1100}>
					<Live render={(f) => <WallClock h={8} m={0} size={460} spin={interpolate(f, [DURE - 4, DOLO + 20], [0, 18], clamp)} />} />
				</Fly>
				<Note at={DIX - 2} y={350} size={44}>
					10 questions, plus complètes
				</Note>
				<RowCard at={CORPS - 2} y={470} h={190} badge={<BodyIco />} badgeTone={LPI.sky} title="Son corps" sub="5 questions" subAt={CORPS + 4} />
				<RowCard at={MOUV - 2} y={686} h={190} badge={<MoveIco />} badgeTone={LPI.sky} title="Ses mouvements" sub="2 questions" subAt={MOUV + 4} from="left" />
				<RowCard at={REL - 2} y={902} h={190} badge={<LinkIco />} badgeTone={LPI.sky} title="Sa relation aux autres" sub="3 questions" subAt={REL + 4} />
				{frame >= PART - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 1180, opacity: fadeIn(frame, PART - 4, 6)}}>
						<ScoreBar value={value} max={30} threshold={5} label="dès 5 / 30" />
						<div style={{position: 'absolute', right: 0, top: -58, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N}}>
							<span style={{color: value >= 5 ? LPI.pink : N}}>{Math.round(value)}</span> / 30
						</div>
					</div>
				) : null}
				<Note at={PRES - 2} y={1350} size={46} tone={LPI.pink}>
					la douleur est présente
				</Note>
			</Camera>
			<Sfx name="tick" at={DURE} volume={0.07} />
			<Sfx name="whoosh" at={DIX - 6} volume={0.07} />
			{[CORPS, MOUV, REL].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={PART - 2} volume={0.05} />
			<Sfx name="ding" at={PRES - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LA BPS (RÉANIMATION) ═══════════════════════════════ */
const BP = {cx: 330, cy: 900, size: 440};
const VENT = {cx: 830, cy: 900, w: 300};

export const Bps: React.FC = () => {
	const frame = useCurrentFrame();
	const REA = at('bps', 'réanimation,');
	const INTU = at('bps', 'intubé');
	const ENDO = at('bps', 'endormi,');
	const BPS = at('bps', 'bps.');
	const VIS = at('bps', 'visage,');
	const BRAS = at('bps', 'bras,');
	const SUPP = at('bps', 'supporte');
	const RESP = at('bps', 'respirateur.');
	const mouth = pt(BP.cx, BP.cy, BP.size, 200, 152);
	const face = pt(BP.cx, BP.cy, BP.size, 200, 108);
	const arm = pt(BP.cx, BP.cy, BP.size, 80, 380);
	const tube = fadeIn(frame, INTU - 2, 10);
	const tense = interpolate(frame, [BRAS - 2, BRAS + 6], [0, 1], clamp);
	const vx = VENT.cx - VENT.w / 2;
	const vy = VENT.cy - (VENT.w * 300) / 240 / 2;
	const tubeD = `M${mouth.x} ${mouth.y} C${mouth.x + 160} ${mouth.y + 20} ${vx - 60} ${vy + 260} ${vx + 30} ${vy + 250}`;
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.blue} light={0.1} />
			<Camera punches={[REA + 1, INTU + 1, BPS + 1, VIS + 1, BRAS + 1, RESP + 1]} strength={0.03}>
				<Big from={-2} to={BPS - 6} text={'En\n*réanimation*'} size={124} {...ON_BLUE} />
				<Big from={BPS - 4} text={'La *BPS*'} size={160} {...ON_BLUE} />
				<Fly at={-4} x={BP.cx} y={BP.cy} from="left">
					<Live render={(f) => <Patient size={BP.size} breath={idle(f, 50) * 0.6} eyesClosed={fadeIn(f, ENDO - 4, 8)} mood={f >= VIS - 2 ? 'mal' : 'calme'} armL={8 * interpolate(f, [BRAS - 2, BRAS + 6], [0, 1], clamp)} armR={8 * interpolate(f, [BRAS - 2, BRAS + 6], [0, 1], clamp)} />} />
				</Fly>
				<Fly at={INTU - 8} x={VENT.cx} y={VENT.cy} from="right">
					<Live render={(f) => <Ventilator width={VENT.w} fight={interpolate(f, [SUPP - 2, SUPP + 8], [0, 1], clamp)} />} />
				</Fly>
				{tube > 0 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<path d={tubeD} fill="none" stroke={N} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${tube} 1`} />
						<path d={tubeD} fill="none" stroke={LPI.sky} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${tube} 1`} />
						{tense > 0
							? [-1, 1].map((k) => <path key={k} d={`M${BP.cx + k * 190} 860 l${k * 18} 10 l${-k * 18} 10 l${k * 18} 10`} fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" opacity={tense * (0.6 + 0.4 * Math.sin(frame))} />)
							: null}
						{frame >= ENDO - 2
							? [0, 1].map((i) => (
									<text key={i} x={face.x + 120 + i * 36} y={face.y - 70 - i * 34 - ((frame / 3) % 10)} fontFamily={FONT.title} fontWeight={900} fontSize={52 - i * 10} fill={LPI.paper} opacity={fadeIn(frame, ENDO - 2 + i * 6, 6)}>
										z
									</text>
								))
							: null}
					</svg>
				) : null}
				<Note at={INTU - 2} to={ENDO - 4} y={1250} size={46}>
					intubé : un tube pour respirer
				</Note>
				<Note at={ENDO - 2} to={BPS - 4} y={1250} size={46}>
					endormi : il ne peut pas parler
				</Note>
				<PointTag at={VIS - 2} x={260} y={520} px={face.x} py={face.y - 20} dark>
					son visage
				</PointTag>
				<PointTag at={BRAS - 2} x={260} y={1270} px={arm.x} py={arm.y} dark>
					ses bras
				</PointTag>
				<PointTag at={RESP - 4} x={790} y={1270} px={VENT.cx} py={vy + 360} dark>
					le respirateur
				</PointTag>
			</Camera>
			<Sfx name="whoosh" at={INTU - 8} volume={0.08} />
			<Sfx name="pop" at={BPS - 4} volume={0.08} />
			{[VIS, BRAS].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="buzz" at={SUPP} volume={0.05} dur={16} />
			<Sfx name="pop" at={RESP - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · EVENDOL (ENFANT) ═══════════════════════════════ */
export const Evendol: React.FC = () => {
	const ENF = at('evendol', "l'enfant");
	const SEPT = at('evendol', 'sept');
	const EVEN = at('evendol', 'evendol');
	const VOIX = at('evendol', 'voix,');
	const VIS = at('evendol', 'visage,');
	const MOUV = at('evendol', 'mouvements,');
	const POS = at('evendol', 'position,');
	const REL = at('evendol', 'relation');
	const DES = at('evendol', 'dès');
	const SOUL = at('evendol', 'soulage.');
	const items: [number, React.ReactNode, string, number][] = [
		[VOIX, <SoundIcon key="v" />, 'sa voix', 2],
		[VIS, <MiniFace key="f" />, 'son visage', 1],
		[MOUV, <MoveIco key="m" />, 'ses mouvements', 1],
		[POS, <BodyIco key="p" />, 'sa position', 1],
		[REL, <LinkIco key="r" />, 'sa relation', 0],
	];
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[ENF + 1, SEPT + 1, EVEN + 1, ...items.map((r) => r[0] + 1), DES + 1]} strength={0.03}>
				<Big from={-2} to={EVEN - 6} text={"Chez\n*l'enfant*"} size={136} />
				<Big from={EVEN - 4} text={'*EVENDOL*'} size={150} />
				<Fly at={ENF - 8} x={540} y={900} from="bottom" dist={1100} move={[{at: EVEN - 4, x: SMALL.x, y: SMALL.y + 20, s: 0.5, dur: 12}]}>
					<Live
						render={(f) => (
							<Kid
								size={440}
								mood={f >= VIS - 2 ? 'mal' : 'calme'}
								cry={interpolate(f, [VOIX - 2, VOIX + 4, VIS + 10, VIS + 16], [0, 1, 1, 0.3], clamp)}
								shake={interpolate(f, [MOUV - 2, MOUV + 4, MOUV + 20, MOUV + 26], [0, 1, 1, 0], clamp)}
								curl={fadeIn(f, POS - 2, 8)}
								turn={fadeIn(f, REL - 2, 8)}
							/>
						)}
					/>
				</Fly>
				<Note at={SEPT - 2} to={EVEN - 6} y={1230} size={70} tone={LPI.pink}>
					moins de 7 ans
				</Note>
				{items.map(([t, icon, label, v], i) => (
					<ObsRow key={label} at={t - 2} y={ROW_Y + i * ROW_STEP} h={112} icon={icon} label={label} mode="points" value={v} answerAt={t + 6} from={i % 2 ? 'left' : 'right'} />
				))}
				<Note at={DES - 6} y={1062} size={66} tone={LPI.pink}>
					5 / 15
				</Note>
				<Note at={DES - 2} y={1170} size={44}>
					dès 4 sur 15 : on le soulage
				</Note>
			</Camera>
			<Sfx name="whoosh" at={ENF - 8} volume={0.08} />
			<Sfx name="pop" at={SEPT - 2} volume={0.08} />
			<Sfx name="whoosh" at={EVEN - 4} volume={0.07} />
			{items.map(([t]) => (
				<Sfx key={t} name="tick" at={t + 6} volume={0.06} />
			))}
			<Sfx name="impact" at={DES} volume={0.08} />
			<Sfx name="ding" at={SOUL - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP : MADAME MARTIN EST SOULAGÉE ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const REP = at('outro', 'répondre,');
	const ALGO = at('outro', 'algoplus');
	const DOLO = at('outro', 'doloplus');
	const BPS = at('outro', 'bps');
	const EVEN = at('outro', 'evendol');
	const TOUJ = at('outro', 'toujours');
	const MAD = at('outro', 'madame');
	const SOUL = at('outro', 'soulagée.');
	const rows: [number, React.ReactNode, string, string][] = [
		[REP - 2, <TalkIcon key="t" size={50} />, "C'est toi qui observes", "s'il ne peut pas répondre"],
		[ALGO - 2, '1', 'Algoplus', 'personne âgée · dès 2 / 5'],
		[DOLO - 2, '2', 'Doloplus', 'douleur qui dure · dès 5 / 30'],
		[BPS - 2, '3', 'BPS', 'en réanimation'],
		[EVEN - 2, '4', 'EVENDOL', 'enfant de moins de 7 ans · dès 4 / 15'],
		[TOUJ - 2, '!', 'Toujours', 'on soulage, puis on réévalue'],
	];
	const out = 1 - fadeIn(frame, MAD - 6, 8);
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.paper} />
			<Camera punches={[...rows.map((r) => r[0] + 3), MAD + 1, SOUL + 1]} strength={0.03}>
				<Big from={-2} to={MAD - 6} text={"*L'hétéro-évaluation*"} size={96} y={170} center />
				{out > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: out}}>
						{rows.map(([t, badge, title, sub], i) => (
							<RowCard key={title} at={t} y={360 + i * 144} h={128} size={46} badge={badge} badgeTone={i === 0 ? LPI.sky : i === 5 ? LPI.blue : LPI.pink} title={title} sub={sub} check={t + 12} from={i % 2 ? 'left' : 'right'} />
						))}
					</div>
				) : null}
				<Big from={MAD - 4} text={'Et *Mme* *Martin* ?'} size={110} y={170} center />
				<Fly at={MAD - 4} x={540} y={800} from="bottom" dist={1100}>
					<Live render={(f) => <Patient size={420} elder={1} woman breath={idle(f)} mood={f >= SOUL - 2 ? 'content' : 'calme'} />} />
				</Fly>
				<Note at={SOUL - 2} y={1120} size={60} tone={LPI.sky}>
					enfin soulagée
				</Note>
				<Confetti at={SOUL} x={540} y={800} n={70} />
				<NextUp at={SOUL + 8} part={2} done title="Tu sais l'évaluer !" teaser="qu'il puisse parler… ou non" icon={<TalkIcon size={96} />} y={1236} />
			</Camera>
			{rows.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="whoosh" at={MAD - 4} volume={0.08} />
			<Sfx name="ding" at={SOUL} volume={0.09} />
			<Sfx name="whoosh" at={SOUL + 8} volume={0.06} />
		</AbsoluteFill>
	);
};
