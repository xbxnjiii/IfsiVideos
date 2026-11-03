// Série « La douleur : échelles d'évaluation », partie 2 / 2 : l'hétéro-évaluation (rythme d'apprentissage, voix +0 %).
// Accroche « patient muet » choisie par le propriétaire (image 0 : une personne âgée, sa bulle reste vide, « Comment
// savoir s'il a mal ? » ; il souffre : grimace, gémit, se protège ; « avec la bonne échelle » ; « ça ne se devine pas »
// barré, tampon « Ça se mesure ! »), carte de la série, le principe (c'est toi qui observes), Algoplus, Doloplus, la BPS
// en réanimation, EVENDOL chez l'enfant, récap + « série terminée ». Briques : pain.tsx, `Patient` (`elder`).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {WallClock} from '../../brand/devices';
import {CamKey, CauseChip, Head, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {CheckChip, Stamp, Strike} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {Bubble, Kid, ObsSheet, PAIN_PARTS, PainFace, ScoreBar, TalkIcon, Ventilator} from '../../brand/pain';
import {Patient, PatientProps} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; max?: number}> = ({at: t0, max = 0.45}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 3}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 6) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: interpolate(frame, [to, to + 6], [1, 0], clamp)}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Élément qui « pop » à `from` et s'efface à `to` (posé en x, y). */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'center'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const out = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.7 + 0.3 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

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

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : une personne âgée, sa bulle « … » reste vide, « Comment savoir s'il a mal ? ». « parler » : la bulle se
// barre ; « il souffre » : grimace, éclairs (flash, secousse), 3 pastilles (grimace · gémit · se protège) ; « avec la
// bonne échelle » : une grille d'observation arrive ; « ça ne se devine pas » barré ; tampon « Ça se mesure ! ».
const HP = {x: 320, y: 500, size: 440};
const hpPt = (px: number, py: number) => ({x: HP.x + (px * HP.size) / 400, y: HP.y + (py * HP.size) / 400});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PARLER = at('intro', 'parler');
	const MAL = at('intro', 'mal');
	const POUR = at('intro', 'pourtant');
	const SOUF = at('intro', 'souffre');
	const COMM = at('intro', 'comment');
	const AVEC = at('intro', 'avec');
	const ECH = at('intro', 'échelle');
	const CAR = at('intro', 'car');
	const DEVINE = at('intro', 'devine');
	const MES = at('intro', 'mesure');
	const face = hpPt(200, 140);
	const keys: CamKey[] = [
		{at: POUR - 2, s: 1.35, x: face.x, y: face.y + 160, dur: 14},
		{at: COMM - 2, s: 1, dur: 14},
	];
	const slide = interpolate(frame, [AVEC - 6, AVEC + 8], [0, 1], ease);
	const bad = frame >= POUR - 2;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PARLER + 1, MAL + 1, COMM + 1, ECH + 1, DEVINE + 1, MES + 1]} shakes={[SOUF + 2, MES + 2]} strength={0.04}>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<div style={{transform: `translateX(${-200 * slide}px)`}}>
						<Elder x={HP.x} y={HP.y} size={HP.size} breath={idle(frame, 40)} mood={bad ? 'mal' : 'calme'} pain={fadeIn(frame, SOUF - 2, 6)} sweat={0.5 * fadeIn(frame, SOUF, 10)} moan={fadeIn(frame, SOUF + 10, 6)} guard={fadeIn(frame, SOUF + 18, 8)} />
						<div style={{position: 'absolute', left: HP.x + 300, top: HP.y - 120, opacity: 1 - fadeIn(frame, AVEC - 8, 8), transform: `rotate(${Math.sin(frame / 9) * 3}deg)`}}>
							<MuteBubble size={210} cross={interpolate(frame, [PARLER - 2, PARLER + 6], [0, 1], ease)} />
						</div>
					</div>
				</ZoomCam>
				{/* les signes qu'on peut observer */}
				<div style={{position: 'absolute', left: 72, top: 1240}}>
					<CauseChip at={SOUF + 4} icon={<MiniFace level={4} />} label="grimace" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1240}}>
					<CauseChip at={SOUF + 12} icon={<SoundIcon />} label="gémit" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1356}}>
					<CauseChip at={SOUF + 20} icon={<BodyIco />} label="se protège" />
				</div>
				{/* la bonne échelle : une grille d'observation */}
				{frame >= ECH - 4 ? (
					<div style={{position: 'absolute', left: 600, top: 560, transform: `translateX(${(1 - popAt(frame, ECH - 4)) * 400}px) rotate(4deg)`}}>
						<ObsSheet
							title="ÉCHELLE"
							mode="yesno"
							width={420}
							rowH={66}
							rows={[
								{label: 'visage', at: ECH - 4, points: 1, pointsAt: ECH + 4},
								{label: 'plaintes', at: ECH - 4, points: 1, pointsAt: ECH + 10},
								{label: 'corps', at: ECH - 4, points: 1, pointsAt: ECH + 16},
							]}
						/>
					</div>
				) : null}
				{frame >= CAR - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center'}}>
						<div style={{position: 'relative', transform: `scale(${popAt(frame, CAR - 2)})`}}>
							<Pill at={CAR - 2} size={56} color={LPI.paper}>
								ça se devine
							</Pill>
							<Strike at={DEVINE + 2} width={420} rot={-8} thick={14} />
						</div>
					</div>
				) : null}
				<Stamp at={MES - 1} x={540} y={900} text="Ça se mesure !" size={84} rot={-7} />
				<Burst at={MES - 1} x={540} y={900} r={320} n={16} />
				{/* titres */}
				<TitleAt from={-60} to={AVEC - 4} text="Comment savoir s'il a *mal* ?" size={92} stagger={0} />
				<TitleAt from={AVEC - 2} text={'Avec la *bonne*\n*échelle* !'} size={92} />
			</Camera>
			<Flash at={SOUF} />
			<Sfx name="heartbeat" at={0} volume={0.07} />
			<Sfx name="buzz" at={PARLER} volume={0.05} dur={12} />
			<Sfx name="impact" at={SOUF} volume={0.11} />
			{[4, 12, 20].map((d) => (
				<Sfx key={d} name="pop" at={SOUF + d} volume={0.08} />
			))}
			<Sfx name="whoosh" at={ECH - 4} volume={0.07} />
			<Sfx name="stamp" at={DEVINE + 2} volume={0.08} />
			<Sfx name="stamp" at={MES - 1} volume={0.13} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const DEUX = at('serie', 'deux');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const REP = at('serie', 'répondre');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, SERIE + 1, REP + 1]} shakes={[DEUX + 2]}>
				<Head kicker="Série · La douleur" kAt={NOUS - 4} title="Partie *2* sur 2" tAt={PART - 2} size={92} />
				<SeriesParts parts={PAIN_PARTS} current={1} at={DEUX - 2} />
				{frame >= AUJ - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, AUJ - 2)})`}}>
						<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>
							Aujourd'hui : <span style={{color: LPI.blue}}>il ne répond pas</span>
						</div>
					</div>
				) : null}
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={DEUX - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={REP} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE PRINCIPE ═══════════════════════════════ */
// Il ne peut pas parler (bulle vide) ; c'est toi qui observes : la caméra (avec un viseur rond) va du visage aux gestes
// puis à la bouche (« aïe… ») ; le terme « Hétéro-évaluation » claque et se range ; 3 puces cochées.
const TP = {x: 303, y: 30, size: 330};
const tPt = (px: number, py: number) => ({x: TP.x + (px * TP.size) / 400, y: TP.y + (py * TP.size) / 400});

export const Hetero: React.FC = () => {
	const frame = useCurrentFrame();
	const EXPR = at('hetero', "s'exprimer");
	const TOI = at('hetero', 'toi');
	const OBS = at('hetero', "l'observant");
	const HET = at('hetero', "l'hétéro-évaluation");
	const VIS = at('hetero', 'visage');
	const GEST = at('hetero', 'gestes');
	const PLAI = at('hetero', 'plaintes');
	const PARL = at('hetero', 'parlent');
	const face = tPt(200, 120);
	const body = tPt(200, 380);
	const mouth = tPt(210, 150);
	const keys: CamKey[] = [
		{at: VIS - 4, s: 2, x: face.x, y: face.y, dur: 12},
		{at: GEST - 4, s: 1.5, x: body.x, y: body.y, dur: 12},
		{at: PLAI - 2, s: 2.1, x: mouth.x + 30, y: mouth.y, dur: 10},
		{at: PARL + 6, s: 1, dur: 14},
	];
	const ring = frame >= VIS - 2 && frame < PARL + 6 ? 1 : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TOI + 1, OBS + 1, HET + 1, VIS + 1, GEST + 1, PLAI + 1]} strength={0.03}>
				<Head kicker="Le principe" kAt={2} title="C'est *toi* qui *observes*" tAt={8} />
				<Stage y={440} h={540} at={4} bumps={[TOI, OBS, VIS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Elder x={TP.x} y={TP.y} size={TP.size} breath={idle(frame, 40)} mood="mal" pain={0.5} moan={fadeIn(frame, PLAI - 2, 6)} guard={interpolate(frame, [GEST - 2, GEST + 6, PLAI, PLAI + 6], [0, 1, 1, 0], clamp)} />
					</ZoomCam>
					<div style={{position: 'absolute', left: 640, top: 30, opacity: 1 - fadeIn(frame, VIS - 6, 6)}}>
						<MuteBubble size={170} cross={fadeIn(frame, EXPR - 2, 8)} />
					</div>
					{ring > 0 ? (
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
							<circle cx={468} cy={270} r={180 + 6 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={frame * 2} />
						</svg>
					) : null}
					<StagePill from={TOI - 2} to={HET - 4} color={LPI.blue}>
						c'est toi qui évalues
					</StagePill>
					{frame >= PLAI ? (
						<div style={{position: 'absolute', left: 640, top: 40, transform: `scale(${popAt(frame, PLAI)})`}}>
							<Bubble tail="left" tone={alpha(LPI.pink, 0.9)}>
								<span style={{fontSize: 52}}>aïe…</span>
							</Bubble>
						</div>
					) : null}
				</Stage>
				<TermSlam index={0} at={HET} term="Hétéro-évaluation" meaning="le soignant évalue en observant" sign="device" slamY={710} slot={{x: 72, y: 1012, w: 936}} active={frame >= HET} />
				<div style={{position: 'absolute', left: 72, top: 1210, display: 'flex', gap: 18}}>
					<CheckChip at={VIS - 2} label="visage" size={42} />
					<CheckChip at={GEST - 2} label="gestes" size={42} />
					<CheckChip at={PLAI - 2} label="plaintes" size={42} />
				</div>
			</Camera>
			<Sfx name="pop" at={TOI - 2} volume={0.08} />
			<Sfx name="whoosh" at={VIS - 4} volume={0.06} />
			<Sfx name="whoosh" at={GEST - 4} volume={0.06} />
			<Sfx name="pop" at={PLAI} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ALGOPLUS ═══════════════════════════════ */
// La grille Algoplus (5 questions, oui / non) arrive ligne par ligne pendant que le patient montre chaque signe ; « un
// point par oui » : visage oui, regard non, plaintes oui, corps non, comportement non → 2 / 5 → il a mal, on le soulage.
export const Algoplus: React.FC = () => {
	const frame = useCurrentFrame();
	const PERS = at('algoplus', 'personne');
	const COMMU = at('algoplus', 'communique');
	const ALGO = at('algoplus', 'algoplus');
	const CINQ = at('algoplus', 'cinq');
	const VIS = at('algoplus', 'visage');
	const REG = at('algoplus', 'regard');
	const PLAI = at('algoplus', 'plaintes');
	const CORPS = at('algoplus', 'corps');
	const COMP = at('algoplus', 'comportement');
	const UN = at('algoplus', 'un');
	const DES = at('algoplus', 'dès');
	const MAL = at('algoplus', 'mal');
	const SOUL = at('algoplus', 'soulage');
	const sheet = popAt(frame, ALGO - 2);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ALGO + 1, CINQ + 1, VIS + 1, PLAI + 1, UN + 1, DES + 1]} shakes={[MAL + 1]} strength={0.03}>
				<Head kicker="Personne âgée" kAt={PERS - 4} title="L'échelle *Algoplus*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[ALGO, UN, DES]}>
					<Elder
						x={0}
						y={70}
						size={310}
						breath={idle(frame, 40)}
						mood={frame >= VIS - 2 ? 'mal' : 'calme'}
						eyesClosed={interpolate(frame, [REG - 2, REG + 6, PLAI, PLAI + 6], [0, 0.6, 0.6, 0], clamp)}
						moan={interpolate(frame, [PLAI - 2, PLAI + 4, CORPS, CORPS + 6], [0, 1, 1, 0], clamp)}
						guard={interpolate(frame, [CORPS - 2, CORPS + 6, COMP, COMP + 6], [0, 1, 1, 0], clamp)}
						agit={interpolate(frame, [COMP - 2, COMP + 4, COMP + 24, COMP + 30], [0, 1, 1, 0], clamp)}
					/>
					{frame >= COMMU - 2 && frame < ALGO + 6 ? (
						<div style={{position: 'absolute', left: 200, top: 10, opacity: 1 - fadeIn(frame, ALGO - 2, 8), transform: `scale(${popAt(frame, COMMU - 2)})`}}>
							<MuteBubble size={170} cross={fadeIn(frame, COMMU + 4, 8)} />
						</div>
					) : null}
					{sheet > 0 ? (
						<div style={{position: 'absolute', left: 330, top: 6, transform: `scale(${sheet})`, transformOrigin: 'right top'}}>
							<ObsSheet
								title="ALGOPLUS"
								mode="yesno"
								width={590}
								rowH={68}
								rows={[
									{label: 'visage', icon: <MiniFace level={4} />, at: VIS - 2, points: 1, pointsAt: UN - 2},
									{label: 'regard', icon: <EyeIco />, at: REG - 2, points: 0, pointsAt: UN + 1},
									{label: 'plaintes', icon: <SoundIcon />, at: PLAI - 2, points: 1, pointsAt: UN + 4},
									{label: 'corps', icon: <BodyIco />, at: CORPS - 2, points: 0, pointsAt: UN + 7},
									{label: 'comportement', icon: <MoveIco />, at: COMP - 2, points: 0, pointsAt: UN + 10},
								]}
								total={{at: UN - 2, of: 5}}
							/>
						</div>
					) : null}
					<StagePill from={ALGO - 2} to={VIS - 4} color={LPI.sky} y={480}>
						5 questions · oui ou non
					</StagePill>
				</Stage>
				{frame >= DES - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1030}}>
						<Pill at={DES - 2} size={44} color={LPI.pink}>
							dès 2 / 5 : il a mal
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1140}}>
					<CheckChip at={SOUL - 2} label="on le soulage" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={COMMU - 2} volume={0.08} />
			<Sfx name="pop" at={ALGO - 2} volume={0.09} />
			{[VIS, REG, PLAI, CORPS, COMP].map((t) => (
				<Sfx key={t} name="tick" at={t - 2} volume={0.06} />
			))}
			<Sfx name="ding" at={UN} volume={0.08} />
			<Sfx name="impact" at={DES} volume={0.08} />
			<Sfx name="pop" at={SOUL - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · DOLOPLUS ═══════════════════════════════ */
// La douleur dure (l'horloge tourne) ; Doloplus : 10 questions en 3 familles (son corps · 5, ses mouvements · 2, sa
// relation aux autres · 3), chacune notée de 0 à 3 ; la barre de score monte à 8 / 30, au-delà du seuil de 5.
const Group: React.FC<{at: number; litAt: number; x: number; title: string; n: number; icon: React.ReactNode; fill?: number[]}> = ({at: t0, litAt, x, title, n, icon, fill = []}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const lit = frame >= litAt;
	const bump = lit ? 1 + 0.08 * Math.exp(-(frame - litAt) / 4) : 1;
	return (
		<div style={{position: 'absolute', left: x, top: 160, width: 284, borderRadius: 30, background: LPI.paper, border: `6px solid ${lit ? LPI.blue : alpha(N, 0.3)}`, boxShadow: lit ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW, padding: '12px 16px 16px', boxSizing: 'border-box', opacity: lit ? 1 : 0.55, transform: `scale(${popAt(frame, t0) * bump})`}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<div style={{width: 54, height: 54, borderRadius: 27, background: alpha(LPI.sky, 0.8), border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, lineHeight: 1.05, whiteSpace: 'pre-line'}}>{title}</div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12}}>
				{Array.from({length: n}, (_, i) => (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, opacity: interpolate(frame, [t0 + i * 2, t0 + i * 2 + 5], [0, 1], clamp)}}>
						<div style={{flex: 1, height: 10, borderRadius: 5, background: alpha(N, 0.12)}} />
						{[0, 1, 2].map((d) => (
							<div key={d} style={{width: 18, height: 18, borderRadius: 9, background: d < (fill[i] ?? 0) ? LPI.pink : 'transparent', border: `3px solid ${d < (fill[i] ?? 0) ? N : alpha(N, 0.25)}`}} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export const Doloplus: React.FC = () => {
	const frame = useCurrentFrame();
	const DURE = at('doloplus', 'dure');
	const DOLO = at('doloplus', 'doloplus');
	const DIX = at('doloplus', 'dix');
	const CORPS = at('doloplus', 'corps');
	const MOUV = at('doloplus', 'mouvements');
	const REL = at('doloplus', 'relation');
	const PART = at('doloplus', 'partir');
	const TRENTE = at('doloplus', 'trente');
	const PRES = at('doloplus', 'présente');
	const scored = frame >= PART - 2;
	const value = interpolate(frame, [PART - 2, TRENTE + 12], [0, 8], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DURE + 1, DOLO + 1, DIX + 1, CORPS + 1, MOUV + 1, REL + 1, TRENTE + 1]} strength={0.03}>
				<Head kicker="Douleur qui dure" kAt={2} title="L'échelle *Doloplus*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[DOLO, DIX, TRENTE]}>
					{frame >= DURE - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 20, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${popAt(frame, DURE - 4)})`, transformOrigin: 'left top'}}>
							<WallClock h={8} m={0} size={110} spin={interpolate(frame, [DURE - 4, DOLO + 20], [0, 14], clamp)} />
							<Pill at={DURE - 4} size={36} color={LPI.sky}>
								elle dure dans le temps
							</Pill>
						</div>
					) : null}
					{frame >= DIX - 2 ? (
						<div style={{position: 'absolute', left: 640, top: 14, transform: `scale(${popAt(frame, DIX - 2)})`}}>
							<Pill at={DIX - 2} size={40} color={LPI.blue}>
								10 questions
							</Pill>
						</div>
					) : null}
					<Group at={DIX + 2} litAt={CORPS - 2} x={18} title="son corps" n={5} icon={<BodyIco />} fill={scored ? [2, 1, 1, 1, 0] : []} />
					<Group at={DIX + 7} litAt={MOUV - 2} x={326} title="ses mouvements" n={2} icon={<MoveIco />} fill={scored ? [1, 1] : []} />
					<Group at={DIX + 12} litAt={REL - 2} x={634} title={'sa relation\naux autres'} n={3} icon={<LinkIco />} fill={scored ? [1, 0, 0] : []} />
				</Stage>
				{frame >= PART - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 1010, opacity: fadeIn(frame, PART - 4, 6)}}>
						<ScoreBar value={value} max={30} threshold={5} label="dès 5 / 30" />
						<div style={{position: 'absolute', right: 0, top: -54, fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N}}>
							<span style={{color: value >= 5 ? LPI.pink : N}}>{Math.round(value)}</span> / 30
						</div>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1180}}>
					<CheckChip at={PRES - 2} label="la douleur est présente" size={42} />
				</div>
			</Camera>
			<Sfx name="tick" at={DURE} volume={0.07} />
			<Sfx name="pop" at={DIX - 2} volume={0.08} />
			{[CORPS, MOUV, REL].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.08} />
			))}
			<Sfx name="whoosh" at={PART - 2} volume={0.05} />
			<Sfx name="ding" at={PRES - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LA BPS (RÉANIMATION) ═══════════════════════════════ */
// Le patient intubé (tube jusqu'au respirateur), endormi (yeux fermés, « z ») ; on observe son visage, ses bras (crispés),
// puis le respirateur (la courbe devient irrégulière : il le supporte mal).
const BP = {x: 120, y: 50, size: 300};
const bPt = (px: number, py: number) => ({x: BP.x + (px * BP.size) / 400, y: BP.y + (py * BP.size) / 400});
const VENT = {x: 640, y: 140, w: 230};

export const Bps: React.FC = () => {
	const frame = useCurrentFrame();
	const REA = at('bps', 'réanimation');
	const INTU = at('bps', 'intubé');
	const ENDO = at('bps', 'endormi');
	const BPS = at('bps', 'bps');
	const VIS = at('bps', 'visage');
	const BRAS = at('bps', 'bras');
	const SUPP = at('bps', 'supporte');
	const RESP = at('bps', 'respirateur');
	const mouth = bPt(200, 152);
	const face = bPt(200, 120);
	const arms = bPt(200, 380);
	const keys: CamKey[] = [
		{at: VIS - 4, s: 2, x: face.x + 20, y: face.y + 20, dur: 12},
		{at: BRAS - 4, s: 1.45, x: arms.x + 40, y: arms.y - 40, dur: 12},
		{at: SUPP - 4, s: 1.6, x: VENT.x + VENT.w / 2, y: VENT.y + 140, dur: 14},
		{at: RESP + 26, s: 1, dur: 14},
	];
	const tube = fadeIn(frame, INTU - 2, 10);
	const tense = interpolate(frame, [BRAS - 2, BRAS + 6], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[REA + 1, INTU + 1, BPS + 1, VIS + 1, BRAS + 1, RESP + 1]} strength={0.03}>
				<Head kicker="En réanimation" kAt={2} title="La *BPS*" tAt={8} size={100} />
				<Stage y={440} h={560} at={4} bumps={[INTU, BPS, RESP]}>
					<ZoomCam keys={keys} w={936} h={560}>
						<div style={{position: 'absolute', left: BP.x, top: BP.y}}>
							<Patient size={BP.size} breath={idle(frame, 50) * 0.6} eyesClosed={fadeIn(frame, ENDO - 4, 8)} mood={frame >= VIS - 2 ? 'mal' : 'calme'} armL={8 * tense} armR={8 * tense} />
						</div>
						{tube > 0 ? (
							<svg width={936} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<path d={`M${mouth.x} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${VENT.x - 80} ${VENT.y + 220} ${VENT.x + 20} ${VENT.y + 210}`} fill="none" stroke={N} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${tube} 1`} />
								<path d={`M${mouth.x} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${VENT.x - 80} ${VENT.y + 220} ${VENT.x + 20} ${VENT.y + 210}`} fill="none" stroke={LPI.sky} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${tube} 1`} />
								{tense > 0
									? [-1, 1].map((k) => <path key={k} d={`M${bPt(200 + k * 150, 300).x} ${bPt(200, 300).y} l${k * 14} 8 l${-k * 14} 8 l${k * 14} 8`} fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" opacity={tense * (0.6 + 0.4 * Math.sin(frame))} />)
									: null}
								{frame >= ENDO - 2
									? [0, 1].map((i) => (
											<text key={i} x={bPt(290, 70).x + i * 30} y={bPt(290, 70).y - i * 28 - ((frame / 3) % 10)} fontFamily={FONT.title} fontWeight={900} fontSize={34 - i * 6} fill={LPI.blue} opacity={fadeIn(frame, ENDO - 2 + i * 6, 6)}>
												z
											</text>
										))
									: null}
							</svg>
						) : null}
						{frame >= INTU - 6 ? (
							<div style={{position: 'absolute', left: VENT.x, top: VENT.y, transform: `scale(${popAt(frame, INTU - 6)})`}}>
								<Ventilator width={VENT.w} fight={interpolate(frame, [SUPP - 2, SUPP + 8], [0, 1], clamp)} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={INTU - 2} to={ENDO - 2} color={LPI.blue}>
						intubé : un tube pour respirer
					</StagePill>
					<StagePill from={ENDO - 2} to={VIS - 4} color={LPI.sky}>
						endormi : il ne peut pas parler
					</StagePill>
				</Stage>
				{frame >= BPS - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1030}}>
						<Pill at={BPS - 2} size={40} color={LPI.sky}>
							BPS = échelle du comportement
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1130, display: 'flex', gap: 18}}>
					<CheckChip at={VIS - 2} label="visage" size={42} />
					<CheckChip at={BRAS - 2} label="bras" size={42} />
					<CheckChip at={RESP - 2} label="respirateur" size={42} />
				</div>
			</Camera>
			<Sfx name="pop" at={INTU - 6} volume={0.09} />
			<Sfx name="whoosh" at={VIS - 4} volume={0.06} />
			<Sfx name="whoosh" at={BRAS - 4} volume={0.06} />
			<Sfx name="buzz" at={SUPP} volume={0.05} dur={16} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · EVENDOL (ENFANT) ═══════════════════════════════ */
// L'enfant montre chaque signe au mot près (il pleure, grimace, s'agite, se recroqueville, se détourne) ; la grille
// EVENDOL (5 items notés 0 → 3) se remplit : 5 / 15, au-dessus du seuil de 4 → on le soulage.
export const Evendol: React.FC = () => {
	const frame = useCurrentFrame();
	const ENF = at('evendol', "l'enfant");
	const SEPT = at('evendol', 'sept');
	const EVEN = at('evendol', 'evendol');
	const VOIX = at('evendol', 'voix');
	const VIS = at('evendol', 'visage');
	const MOUV = at('evendol', 'mouvements');
	const POS = at('evendol', 'position');
	const REL = at('evendol', 'relation');
	const DES = at('evendol', 'dès');
	const SOUL = at('evendol', 'soulage');
	const sheet = popAt(frame, EVEN - 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ENF + 1, EVEN + 1, VOIX + 1, MOUV + 1, DES + 1]} strength={0.03}>
				<Head kicker="Chez l'enfant" kAt={2} title="L'échelle *EVENDOL*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[EVEN, VOIX, DES]}>
					{frame >= ENF - 4 ? (
						<div style={{position: 'absolute', left: 20, top: 150, transform: `scale(${popAt(frame, ENF - 4)})`, transformOrigin: '50% 100%'}}>
							<Kid
								size={270}
								mood={frame >= VIS - 2 ? 'mal' : 'calme'}
								cry={interpolate(frame, [VOIX - 2, VOIX + 4, VIS + 10, VIS + 16], [0, 1, 1, 0.3], clamp)}
								shake={interpolate(frame, [MOUV - 2, MOUV + 4, MOUV + 20, MOUV + 26], [0, 1, 1, 0], clamp)}
								curl={fadeIn(frame, POS - 2, 8)}
								turn={fadeIn(frame, REL - 2, 8)}
							/>
						</div>
					) : null}
					{frame >= SEPT - 2 ? (
						<div style={{position: 'absolute', left: 24, top: 488, transform: `scale(${popAt(frame, SEPT - 2)})`, transformOrigin: 'left top'}}>
							<Pill at={SEPT - 2} size={36} color={LPI.blue}>
								moins de 7 ans
							</Pill>
						</div>
					) : null}
					{sheet > 0 ? (
						<div style={{position: 'absolute', left: 330, top: 6, transform: `scale(${sheet})`, transformOrigin: 'right top'}}>
							<ObsSheet
								title="EVENDOL"
								mode="points"
								max={3}
								width={590}
								rowH={68}
								rows={[
									{label: 'voix', icon: <SoundIcon />, at: VOIX - 2, points: 2, pointsAt: VOIX + 6},
									{label: 'visage', icon: <MiniFace level={4} />, at: VIS - 2, points: 1, pointsAt: VIS + 6},
									{label: 'mouvements', icon: <MoveIco />, at: MOUV - 2, points: 1, pointsAt: MOUV + 6},
									{label: 'position', icon: <BodyIco />, at: POS - 2, points: 1, pointsAt: POS + 6},
									{label: 'relation', icon: <LinkIco />, at: REL - 2, points: 0, pointsAt: REL + 6},
								]}
								total={{at: VOIX + 6, of: 15}}
							/>
						</div>
					) : null}
				</Stage>
				{frame >= DES - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1030}}>
						<Pill at={DES - 2} size={44} color={LPI.pink}>
							dès 4 / 15 : il a mal
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1140}}>
					<CheckChip at={SOUL - 2} label="on le soulage" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={ENF - 4} volume={0.09} />
			<Sfx name="pop" at={EVEN - 4} volume={0.09} />
			{[VOIX, VIS, MOUV, POS, REL].map((t) => (
				<Sfx key={t} name="tick" at={t + 6} volume={0.06} />
			))}
			<Sfx name="impact" at={DES} volume={0.08} />
			<Sfx name="ding" at={SOUL - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const DONE = at('outro', 'réévalue') + 10;
	return (
		<AbsoluteFill>
			<RecapScene
				title="*L'hétéro-évaluation*"
				kAt={at('outro', 'récap') - 4}
				done={DONE}
				rows={[
					[at('outro', 'répondre'), 'alert', 'Il ne répond pas', "c'est toi qui observes"],
					[at('outro', 'algoplus'), 'check', 'Algoplus', 'personne âgée · dès 2 / 5'],
					[at('outro', 'doloplus'), 'wave', 'Doloplus', 'douleur qui dure · dès 5 / 30'],
					[at('outro', 'bps'), 'device', 'BPS', 'en réanimation'],
					[at('outro', 'evendol'), 'check', 'EVENDOL', 'enfant < 7 ans · dès 4 / 15'],
					[at('outro', 'toujours'), 'up', 'Toujours', 'on soulage, puis on réévalue'],
				]}
			/>
			<NextUp at={DONE + 6} part={2} done title="Tu sais l'évaluer !" teaser="qu'il puisse parler… ou non" icon={<TalkIcon size={96} />} y={1210} />
			<Sfx name="whoosh" at={DONE + 6} volume={0.07} />
		</AbsoluteFill>
	);
};

