// Scènes de « La glycémie » : une notion = une scène, chaque mouvement part d'un mot de la voix.
// Le patient (src/brand/patient.tsx) joue les signes ; le lecteur de glycémie roule en g/l (src/brand/glyco.tsx).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNum, CauseChip, Head, LAY, Lead, Pill, RecapScene, SLAM_Y, termSlot} from '../../brand/episode';
import {Cell, Finger, GLY_ZONES, Glucometer, Lancet, SugarCube, SugarFlow, SugarRain} from '../../brand/glyco';
import {FaintIcon, HungerIcon, SweatIcon, ThirstIcon, TiredIcon, TremorIcon, UrineIcon} from '../../brand/icons';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {Patient, PatientProps, patientPoint} from '../../brand/patient';
import {Artery} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number) => 0.5 - 0.5 * Math.cos(frame / 22);

/** Valeur qui roule d'un palier à l'autre : [[frame, valeur], …]. */
const steps = (frame: number, keys: [number, number][]) =>
	interpolate(
		frame,
		keys.flatMap(([t], i) => (i === 0 ? [t] : [t, t + Math.min(16, (keys[i + 1]?.[0] ?? t + 99) - t - 1)])),
		keys.flatMap(([, v], i) => (i === 0 ? [v] : [keys[i - 1][1], v])),
		ease,
	);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
const HOOK_METER = {x: 254, y: 640, k: 1.3};
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const Q = at('intro', 'quoi');
	const G = at('intro', 'glycémie');
	const pop = usePop(2);
	const qp = usePop(Q);
	const value = interpolate(frame, [6, 44], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q + 1, G + 1]} shakes={[Q + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
					<Title at={0} text="C'est quoi la" size={74} stagger={3} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
					<Title at={G} text="*glycémie* ?" size={130} stagger={4} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 520, width: 936, height: 560, overflow: 'hidden', opacity: pop}}>
					<SugarRain on={0.8} />
				</div>
				<div style={{position: 'absolute', left: HOOK_METER.x, top: HOOK_METER.y, transform: `scale(${HOOK_METER.k * (0.4 + 0.6 * pop)})`, transformOrigin: 'left top'}}>
					<Glucometer value={value} strip={0} blood={0} tone={null} beep={frame >= 44 ? Math.exp(-(frame - 44) / 4) : 0} />
				</div>
				{frame >= Q ? (
					<div
						style={{
							position: 'absolute',
							left: 836,
							top: 500,
							width: 170,
							height: 170,
							borderRadius: 85,
							background: LPI.pink,
							border: `8px solid ${LPI.paper}`,
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 130,
							color: N,
							transform: `scale(${qp}) rotate(${Math.sin(frame / 6) * 8}deg)`,
						}}
					>
						?
					</div>
				) : null}
				<Burst at={Q} x={921} y={585} r={200} n={12} />
			</Camera>
			<Sfx name="pop" at={Q} volume={0.12} />
			<Sfx name="whoosh" at={G} volume={0.06} />
			<Sfx name="ding" at={44} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
const LOUPE = {x: 660, y: 230, r: 190};
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const G = at('def', 'glycémie');
	const TAUX = at('def', 'taux');
	const SUC = at('def', 'sucre');
	const SANG = at('def', 'sang');
	const GLU = at('def', 'glucose');
	const CAR = at('def', 'carburant');
	const CEL = at('def', 'cellules');
	const GR = at('def', 'grammes');
	const LI = at('def', 'litre');
	const body = useSoft(G + 2);
	const loupe = useSoft(TAUX - 2, true);
	const sugar = interpolate(frame, [SUC - 2, SUC + 8], [0, 1], clamp);
	const flow = interpolate(frame, [SANG - 2, SANG + 12], [0, 1], clamp);
	const eat = interpolate(frame, [CAR - 8, CAR + 4], [0, 1], ease);
	const energy = interpolate(frame, [CAR, CAR + 8], [0, 1], clamp) * (0.85 + 0.15 * Math.sin(frame / 4));
	const arm = patientPoint('upperArm', 280);
	const ax = 30 + arm.x;
	const ay = 40 + arm.y;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TAUX + 1, SUC + 1, GLU + 1, CAR + 1, GR + 1]} shakes={[CAR + 2]}>
				<Head kicker="Définition" kAt={G} title="La *glycémie*" tAt={G + 2} />
				<Stage y={LAY.stageY} h={480} at={G + 4} bumps={[SUC, GR]}>
					<div style={{position: 'absolute', left: 30, top: 40, opacity: Math.min(1, body * 1.5), transform: `translateY(${(1 - body) * 50}px)`}}>
						<Patient size={280} breath={idle(frame)} heart={body} beat={pulseAt(frame)} flow={flow} />
					</div>
					{frame >= TAUX - 2 ? (
						<>
							<svg width={936} height={480} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: loupe}}>
								<path d={`M${ax} ${ay} L${LOUPE.x - LOUPE.r * 0.72} ${LOUPE.y - LOUPE.r * 0.7} M${ax} ${ay} L${LOUPE.x - LOUPE.r * 0.72} ${LOUPE.y + LOUPE.r * 0.7}`} stroke={LPI.blue} strokeWidth={5} strokeDasharray="12 10" />
								<circle cx={ax} cy={ay} r={14} fill={LPI.pink} stroke={LPI.paper} strokeWidth={5} />
							</svg>
							<div
								style={{
									position: 'absolute',
									left: LOUPE.x - LOUPE.r,
									top: LOUPE.y - LOUPE.r,
									width: LOUPE.r * 2,
									height: LOUPE.r * 2,
									borderRadius: LOUPE.r,
									overflow: 'hidden',
									background: LPI.paper,
									border: `9px solid ${N}`,
									boxSizing: 'border-box',
									boxShadow: SHADOW,
									transform: `scale(${loupe})`,
								}}
							>
								<div style={{position: 'absolute', left: -60, top: LOUPE.r - 150 - 9, width: 520, height: 300}}>
									<Artery width={520} arrows={0} strength={0.6} />
									<SugarFlow on={sugar} width={520} />
								</div>
							</div>
						</>
					) : null}
					<div style={{position: 'absolute', left: LOUPE.x - 76, top: LOUPE.y - LOUPE.r - 26}}>
						<Pill at={SUC} size={36} color={LPI.blue}>
							sucre
						</Pill>
					</div>
					<div style={{position: 'absolute', left: LOUPE.x - 70, top: LOUPE.y + LOUPE.r - 40}}>
						<Pill at={SANG} size={36}>
							sang
						</Pill>
					</div>
				</Stage>
				{/* glucose = carburant des cellules */}
				{frame >= GLU - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 940, display: 'flex', alignItems: 'center', gap: 20}}>
						<Enter at={GLU - 2} from="left" distance={40} bounce>
							<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<SugarCube size={70} rot={Math.sin(frame / 8) * 8} />
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>glucose</span>
							</div>
						</Enter>
						{frame >= CAR - 10 ? (
							<>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: LPI.blue}}>→</span>
								<div style={{width: 150, height: 150, marginTop: -10, marginBottom: -10}}>
									<Cell size={150} energy={energy} eat={eat} />
								</div>
							</>
						) : null}
						{frame >= CEL - 2 ? (
							<Enter at={CEL - 2} from="left" distance={30}>
								<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: N, lineHeight: 1.1, display: 'block'}}>
									carburant
									<br />
									<span style={{color: LPI.blue}}>des cellules</span>
								</span>
							</Enter>
						) : null}
					</div>
				) : null}
				{/* unité */}
				<div style={{position: 'absolute', left: 72, top: 1130, display: 'flex', alignItems: 'center', gap: 22}}>
					<Pill at={GR} size={70}>
						g/l
					</Pill>
					{frame >= LI - 4 ? (
						<Enter at={LI - 4} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 38, color: N, lineHeight: 1.1, display: 'block'}}>
								grammes
								<br />
								<span style={{color: LPI.blue}}>par litre</span>
							</span>
						</Enter>
					) : null}
				</div>
				<Burst at={CAR} x={72 + 470} y={1010} r={180} n={12} />
			</Camera>
			<Sfx name="whoosh" at={TAUX - 2} volume={0.06} />
			<Sfx name="pop" at={SUC} volume={0.1} />
			<Sfx name="pop" at={GLU - 2} volume={0.1} />
			<Sfx name="impact" at={CAR} volume={0.08} />
			<Sfx name="pop" at={GR} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE ═══════════════════════════════ */
export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const ME = at('mesure', 'mesurer');
	const GLY = at('mesure', 'glycémie');
	const BOUT = at('mesure', 'bout');
	const PIQ = at('mesure', 'pique');
	const GOU = at('mesure', 'goutte');
	const BAND = at('mesure', 'bandelette');
	const LECT = at('mesure', 'lecteur');
	const AFF = at('mesure', 'affiche');
	const RES = at('mesure', 'résultat');
	const finger = useSoft(BOUT - 4);
	const lancetIn = interpolate(frame, [PIQ - 10, PIQ - 2, GOU - 2, GOU + 8], [0, 1, 1, 0], ease);
	const press = interpolate(frame, [PIQ - 2, PIQ + 1, PIQ + 7], [0, 1, 0], clamp);
	const drop = interpolate(frame, [PIQ + 6, GOU + 4], [0, 1], ease);
	const device = useSoft(at('mesure', 'dépose') - 4, true);
	const strip = interpolate(frame, [BAND - 4, BAND + 8], [0, 1], ease);
	const blood = interpolate(frame, [BAND + 6, BAND + 14], [0, 1], clamp);
	const value = interpolate(frame, [LECT, AFF + 14], [0, 1], ease);
	const beep = frame >= RES ? Math.exp(-(frame - RES) / 4) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[GLY + 1, BOUT + 1, PIQ + 1, GOU + 1, BAND + 1, RES + 1]} shakes={[PIQ + 2]}>
				<Head kicker="Mesure" kAt={ME - 4} title="Glycémie *capillaire*" tAt={GLY - 2} size={76} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={ME + 2} bumps={[PIQ, RES]}>
					<div style={{position: 'absolute', left: 560, top: 30}}>
						<Pill at={BOUT} size={36} color={LPI.blue}>
							au bout du doigt
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 0, top: 126, opacity: Math.min(1, finger * 1.5), transform: `translateX(${(1 - finger) * -260}px)`}}>
						<Finger drop={drop} />
					</div>
					{lancetIn > 0 ? (
						<div style={{position: 'absolute', left: 222, top: 300 + (1 - lancetIn) * 260, opacity: Math.min(1, lancetIn * 2)}}>
							<Lancet press={press} />
						</div>
					) : null}
					<div style={{position: 'absolute', left: 452, top: 150, opacity: Math.min(1, device * 1.5), transform: `translateX(${(1 - device) * 300}px)`}}>
						<Glucometer value={value} strip={strip} blood={blood} tone={null} beep={beep} />
					</div>
				</Stage>
				<Burst at={PIQ} x={72 + 262} y={LAY.stageY + 276} r={120} n={10} />
				<div style={{position: 'absolute', left: 72, top: 1030, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={PIQ} label="on pique" size={44} />
					<CheckChip at={BAND} label="une goutte sur la bandelette" size={44} />
					<CheckChip at={AFF} label="le lecteur affiche le résultat" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={BOUT} volume={0.1} />
			<Sfx name="impact" at={PIQ} volume={0.09} />
			<Sfx name="whoosh" at={BAND - 4} volume={0.06} />
			<Sfx name="pop" at={BAND} volume={0.1} />
			<Sfx name="tick" at={LECT} volume={0.07} />
			<Sfx name="ding" at={RES} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const JEUN = at('norme', 'jeun');
	const MANGE = at('norme', 'mangé');
	const NORM = at('norme', 'normale');
	const S1 = at('norme', '0,70');
	const S2 = at('norme', '1,10');
	const GR = at('norme', 'gramme');
	const NG = at('norme', 'normoglycémie');
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S2 + 4, S2 + 24], [0.7, 0.95], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, JEUN + 1, NORM + 1, S1 + 1, S2 + 1, NG + 1]} shakes={[S1 + 2, S2 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420, display: 'flex', gap: 18, alignItems: 'center'}}>
					<CheckChip at={AD} label="adulte" size={40} />
					<CheckChip at={JEUN} label="à jeun" size={40} />
					{frame >= MANGE - 4 ? (
						<Enter at={MANGE - 4} from="left" distance={24}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 32, color: alpha(N, 0.75)}}>(sans avoir mangé)</span>
						</Enter>
					) : null}
				</div>
				<div style={{position: 'absolute', left: 72, top: 550, width: 936, height: 330, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 600, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
					<BigNum at={S1} size={165}>
						0,70
					</BigNum>
					{frame >= S2 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: LPI.blue}}>–</div> : null}
					<BigNum at={S2} size={165}>
						1,10
					</BigNum>
				</div>
				{frame >= GR - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
						<Enter at={GR - 2} distance={20}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>grammes par litre</span>
						</Enter>
					</div>
				) : null}
				<Burst at={S1} x={330} y={700} r={220} n={10} />
				<Burst at={S2} x={750} y={700} r={240} n={12} />
				<NormScale zones={GLY_ZONES} value={value} at={NORM + 4} markerAt={S2 + 4} y={940} nameSize={27} rangeSize={22} />
				<TermSlam
					index={0}
					at={NG}
					term="Normoglycémie"
					meaning={
						<>
							taux de sucre normal <Seuil>0,70 – 1,10 g/l (3,9 – 6,1 mmol/L)</Seuil>
						</>
					}
					sign="check"
					slamY={SLAM_Y}
					slot={{x: 72, y: 1150, w: 936}}
					active={frame >= NG}
				/>
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="pop" at={JEUN} volume={0.1} />
			<Sfx name="impact" at={S1} volume={0.1} />
			<Sfx name="impact" at={S2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · HYPERGLYCÉMIE / 5 · HYPOGLYCÉMIE ═══════════════════════════════ */
/** Patient + lecteur de glycémie sur le socle. */
const GlyStage: React.FC<{value: number; tone: string | null; patient: PatientProps; shake?: number}> = ({value, tone, patient, shake = 0}) => {
	const frame = useCurrentFrame();
	return (
		<>
			<div style={{position: 'absolute', left: 26, top: 34, transform: `translateX(${Math.sin(frame * 2.3) * 5 * shake}px)`}}>
				<Patient size={290} breath={idle(frame)} {...patient} />
			</div>
			<div style={{position: 'absolute', left: 440, top: 100, transform: 'scale(1.05)', transformOrigin: 'left top'}}>
				<Glucometer value={value} strip={0} blood={0} tone={tone} beep={0} />
			</div>
		</>
	);
};

export const Hyper: React.FC = () => {
	const frame = useCurrentFrame();
	const AU = at('hyper', 'au-dessus');
	const S = at('hyper', '1,10');
	const HY = at('hyper', 'hyperglycémie');
	const TROP = at('hyper', 'trop');
	const PAT = at('hyper', 'patient');
	const DIA = at('hyper', 'diabétiques');
	const signs: [number, React.ReactNode, string][] = [
		[at('hyper', 'soif'), <ThirstIcon key="s" size={56} />, 'très soif'],
		[at('hyper', 'uriner'), <UrineIcon key="u" size={56} />, 'urine beaucoup'],
		[at('hyper', 'fatigué'), <TiredIcon key="f" size={56} />, 'fatigue'],
	];
	const value = steps(frame, [
		[0, 1],
		[S, 1.45],
		[TROP, 2.1],
	]);
	const fill = interpolate(frame, [S, TROP + 16], [0.3, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AU + 1, S + 1, HY + 1, TROP + 1, DIA + 1, ...signs.map(([t]) => t + 1)]} shakes={[HY + 2]}>
				<Head kicker="Au-dessus de 1,10" kAt={AU} title="Trop de *sucre*" tAt={AU + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={AU + 4} layers={[{color: PINK, level: fill}]} bumps={[S, TROP]}>
					<SugarRain on={interpolate(frame, [TROP, TROP + 12], [0, 1], clamp)} />
					<GlyStage
						value={value}
						tone={frame >= S ? LPI.pink : null}
						patient={{
							mood: frame >= HY ? 'mal' : 'calme',
							heart: 1,
							beat: pulseAt(frame),
							flow: fill * 0.8,
							flush: interpolate(frame, [signs[0][0], signs[0][0] + 10], [0, 0.5], clamp),
						}}
					/>
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hyperglycémie"
					meaning={
						<>
							trop de sucre dans le sang <Seuil>&gt; 1,10 g/l (&gt; 6,1 mmol/L)</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < PAT}
				/>
				<Stamp at={DIA} x={790} y={LAY.stageY + 430} text="Diabète" size={58} rot={-6} />
				<Lead at={PAT} text="le patient peut avoir…" />
				{signs.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i === 1 ? 560 : 72, top: i === 2 ? 1356 : 1240}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			<Sfx name="tick" at={S} volume={0.08} />
			<Sfx name="tick" at={TROP} volume={0.08} />
			<Sfx name="stamp" at={DIA} volume={0.1} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

export const Hypo: React.FC = () => {
	const frame = useCurrentFrame();
	const EN = at('hypo', 'en');
	const S = at('hypo', '0,70');
	const HY = at('hypo', 'hypoglycémie');
	const PAS = at('hypo', 'pas');
	const VITE = at('hypo', 'vite');
	const SUE = at('hypo', 'sueurs');
	const TRE = at('hypo', 'tremblements');
	const FAIM = at('hypo', 'faim');
	const MAL = at('hypo', 'malaise');
	const URG = at('hypo', 'urgence');
	const signs: [number, React.ReactNode, string][] = [
		[SUE, <SweatIcon key="s" size={56} />, 'sueurs'],
		[TRE, <TremorIcon key="t" size={56} />, 'tremblements'],
		[FAIM, <HungerIcon key="f" size={56} />, 'faim'],
		[MAL, <FaintIcon key="m" size={56} />, 'malaise'],
	];
	const value = steps(frame, [
		[0, 1],
		[S, 0.65],
		[PAS, 0.5],
	]);
	const fill = interpolate(frame, [S, PAS + 16], [0.3, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EN + 1, S + 1, HY + 1, PAS + 1, VITE + 1, URG + 1, ...signs.map(([t]) => t + 1)]} shakes={[URG + 2]}>
				<Head kicker="En dessous de 0,70" kAt={EN} title="Pas assez de *sucre*" tAt={EN + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={EN + 4} layers={[{color: COLD, level: fill}]} bumps={[S, PAS]}>
					<GlyStage
						value={value}
						tone={frame >= S ? LPI.sky : null}
						shake={frame >= TRE && frame < FAIM ? 1 : 0}
						patient={{
							mood: frame >= HY ? 'mal' : 'calme',
							heart: 1,
							beat: pulseAt(frame, 18),
							pale: interpolate(frame, [PAS, PAS + 12], [0, 1], clamp),
							sweat: interpolate(frame, [SUE - 2, SUE + 6], [0, 1], clamp),
							dizzy: interpolate(frame, [MAL - 2, MAL + 8], [0, 1], clamp),
						}}
					/>
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hypoglycémie"
					meaning={
						<>
							pas assez de sucre <Seuil>&lt; 0,70 g/l (&lt; 3,9 mmol/L)</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < VITE}
				/>
				<Stamp at={URG} x={790} y={LAY.stageY + 430} text="Urgence !" size={58} rot={-6} />
				<Lead at={VITE} text="elle peut arriver vite :" />
				{signs.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i % 2 === 1 ? 560 : 72, top: i >= 2 ? 1356 : 1240}}>
						<CauseChip at={t} icon={icon} label={label} tone={LPI.sky} />
					</div>
				))}
			</Camera>
			<Sfx name="tick" at={S} volume={0.08} />
			<Sfx name="stamp" at={URG} volume={0.1} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="La *glycémie*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'hypoglycémie') + 48}
		rows={[
			[at('outro', 'sucre'), 'device', 'Taux de sucre', 'dans le sang · en g/l'],
			[at('outro', 'doigt'), 'check', 'Au bout du doigt', 'glycémie capillaire'],
			[at('outro', 'normale'), 'check', 'Normoglycémie', <>0,70 – 1,10 g/l à jeun<br />(3,9 – 6,1 mmol/L)</>],
			[at('outro', 'hyperglycémie'), 'up', 'Hyperglycémie', <>&gt; 1,10 g/l<br />(&gt; 6,1 mmol/L)</>],
			[at('outro', 'hypoglycémie'), 'down', 'Hypoglycémie', <>&lt; 0,70 g/l<br />(&lt; 3,9 mmol/L)</>],
		]}
	/>
);
