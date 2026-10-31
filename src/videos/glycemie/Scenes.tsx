// Scènes de « La glycémie » : une notion = une scène, chaque mouvement part d'un mot de la voix.
// Le patient (src/brand/patient.tsx) joue les signes ; le lecteur de glycémie roule en g/l (src/brand/glyco.tsx).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNum, camAt, CamKey, CauseChip, Head, LAY, Lead, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {WallClock} from '../../brand/devices';
import {Cell, Finger, GLY_ZONES, Glucometer, Lancet, SugarCube, SugarFlow, SugarRain} from '../../brand/glyco';
import {FaintIcon, HungerIcon, SweatIcon, SyringeIcon, ThirstIcon, TiredIcon, TremorIcon, UrineIcon} from '../../brand/icons';
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
// Mini-enquête. Image 0 (miniature) : « Que s'est-il passé ? » déjà à l'écran, le patient un peu pâle et en sueur.
// Il se lève, vacille et s'effondre (impact, flash) ; « Que s'est-il passé ? » : la caméra s'approche. Retour en arrière
// (« trente minutes plus tôt ») : la chute se rembobine, image bleutée, horloge qui recule, deux indices (insuline faite,
// rien mangé) et sa phrase dans une bulle. « Verdict » : retour au présent, tampon HYPOGLYCÉMIE ; « sucre » : les sucres
// quittent le corps ; « glycémie » : le lecteur tombe à 0,45 g/l ; la question finit comme l'ancienne accroche (lecteur
// en HOOK_METER : la transition plonge dans son écran).
const HOOK_METER = {x: 254, y: 640, k: 1.3};
const HOOK_WIN = {y: 480, w: 1080, h: 980};
const HP = 420;
/** patient debout : coin (330, 120) de la fenêtre ; pivot de la chute = milieu du bas */
const STAND = {x: 330, y: 120};
const PIVOT = {x: STAND.x + HP / 2, y: STAND.y + HP * 1.4};
/** point du patient (viewBox 400 × 560) : debout, ou couché (chute `f` = 1 : rotation −90°, décalage LIE) */
const LIE = {dx: 294, dy: -198};
const standPt = (x: number, y: number) => ({x: STAND.x + (x * HP) / 400, y: STAND.y + (y * HP) / 400});
const liePt = (x: number, y: number) => ({x: PIVOT.x + LIE.dx + ((y - 560) * HP) / 400, y: PIVOT.y + LIE.dy - ((x - 200) * HP) / 400});

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.5}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Pastille ronde « ? » qui tangue, de `at` à `out`. */
const QMark: React.FC<{at: number; out?: number; x: number; y: number; size?: number}> = ({at: t0, out = 1e9, x, y, size = 170}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	const o = interpolate(frame, [out, out + 6], [1, 0], clamp);
	if (frame < t0 || o <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: size,
				height: size,
				borderRadius: size / 2,
				background: LPI.pink,
				border: `8px solid ${LPI.paper}`,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size * 0.76,
				color: N,
				transform: `scale(${p * o}) rotate(${Math.sin(frame / 6) * 8}deg)`,
			}}
		>
			?
		</div>
	);
};

/** Bandeau « ◀◀ 30 MIN PLUS TÔT » du retour en arrière. */
const Rewind: React.FC<{at: number; out: number}> = ({at: t0, out}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	const o = interpolate(frame, [out - 4, out + 2], [1, 0], clamp);
	if (frame < t0 || o <= 0) return null;
	const blink = 0.55 + 0.45 * Math.round(0.5 + 0.5 * Math.cos(frame / 4));
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 30px 12px 22px', borderRadius: 999, background: N, boxShadow: SHADOW, opacity: o, transform: `scale(${0.5 + 0.5 * p})`, transformOrigin: 'left center'}}>
			<svg width={58} height={34} viewBox="0 0 58 34" style={{opacity: blink}}>
				<path d="M28 2 L2 17 L28 32 Z M56 2 L30 17 L56 32 Z" fill={LPI.pink} />
			</svg>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.paper, letterSpacing: '0.04em'}}>30 MIN PLUS TÔT</span>
		</div>
	);
};

/** Bulle de parole (queue en bas à gauche, vers la bouche). */
const Bubble: React.FC<{at: number; out: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, out, x, y, children}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	const o = interpolate(frame, [out - 4, out + 2], [1, 0], clamp);
	if (frame < t0 || o <= 0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${p})`, transformOrigin: '0% 100%', opacity: o}}>
			<div style={{position: 'relative', width: 400, padding: '22px 30px', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 42, lineHeight: 1.12, color: N}}>
				{children}
				<svg width={60} height={50} viewBox="0 0 60 50" style={{position: 'absolute', left: 30, bottom: -44, overflow: 'visible'}}>
					<path d="M0 0 L8 46 L44 0" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
					<path d="M-2 -6 H48" stroke={LPI.paper} strokeWidth={8} />
				</svg>
			</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const LEVE = at('intro', 'lève');
	const EFF = at('intro', "s'effondre");
	const PASSE = at('intro', 'passé');
	const QUE = at('intro', 'que');
	const TRENTE = at('intro', 'trente');
	const INSU = at('intro', 'insuline');
	const DIT = at('intro', 'dit');
	const RIEN = at('intro', 'rien');
	const VERD = at('intro', 'verdict');
	const HYPO = at('intro', 'hypoglycémie');
	const MANQUE = at('intro', 'manque');
	const SUCRE = at('intro', 'sucre');
	const GLY = at('intro', 'glycémie');
	const MAIS = at('intro', 'mais');
	const CEST = at('intro', "c'est");
	const QUOI = at('intro', 'quoi');
	const GLY2 = at('intro', 'glycémie', 2);
	const IMPACT = EFF + 9;
	const clockPop = usePop(TRENTE + 2);
	const easeIn = {...clamp, easing: Easing.in(Easing.quad)};
	const flashback = frame >= TRENTE - 2 && frame < VERD - 2;
	// chute (0 debout → 1 couché) : tombe, se rembobine, retombe au retour dans le présent
	const f = frame < TRENTE - 2 ? interpolate(frame, [EFF - 1, IMPACT], [0, 1], easeIn) : flashback ? interpolate(frame, [TRENTE - 2, TRENTE + 12], [1, 0], ease) : interpolate(frame, [VERD - 2, VERD + 6], [0, 1], easeIn);
	const rise = frame < EFF ? interpolate(frame, [LEVE - 10, LEVE + 4], [150, 0], ease) : 0;
	const wobble = frame < TRENTE - 2 ? interpolate(frame, [LEVE + 2, EFF - 1], [0, 1], clamp) * (1 - f) : 0;
	const leave = interpolate(frame, [MAIS, MAIS + 12], [0, 1], easeIn);
	const unwell = !flashback;
	const out = interpolate(frame, [MAIS - 2, MAIS + 8], [1, 0], clamp);
	const qOut = interpolate(frame, [MAIS + 4, MAIS + 12], [0, 1], ease);
	const qPunch = frame >= QUE ? 1 + 0.1 * Math.exp(-(frame - QUE) / 4) : 1;
	const tint = interpolate(frame, [TRENTE - 2, TRENTE + 4, VERD - 4, VERD + 2], [0, 1, 1, 0], clamp);
	// le lecteur : surgit au-dessus du patient, chute à 0,45 g/l, puis se range comme l'ancienne accroche
	const mPop = usePop(GLY);
	const place = interpolate(frame, [MAIS + 4, MAIS + 20], [0, 1], ease);
	const mx = interpolate(place, [0, 1], [320, HOOK_METER.x]);
	const my = interpolate(place, [0, 1], [530, HOOK_METER.y]);
	const mk = interpolate(place, [0, 1], [1, HOOK_METER.k]);
	const value = interpolate(frame, [GLY + 2, GLY + 8, GLY + 24], [0, 1, 0.45], ease);
	const cam: CamKey[] = [
		{at: -1, s: 1},
		{at: PASSE - 8, s: 1.3, x: 420, y: 520, dur: 16},
		{at: TRENTE - 2, s: 1, dur: 12},
		{at: DIT - 6, s: 1.3, x: 540, y: 330, dur: 16},
		{at: VERD - 4, s: 1, dur: 10},
	];
	const c = camAt(frame, cam, HOOK_WIN.w, HOOK_WIN.h);
	const mouth = c.view(standPt(200, 150).x, standPt(200, 150).y);
	const clues: [number, React.ReactNode, string, number][] = [
		[INSU, <SyringeIcon key="i" size={56} />, 'insuline faite', 72],
		[RIEN, <HungerIcon key="r" size={56} />, 'rien mangé', 560],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[LEVE + 1, PASSE + 1, TRENTE + 1, INSU + 1, RIEN + 1, HYPO + 1, SUCRE + 1, GLY + 1, CEST + 1, GLY2 + 1]} shakes={[IMPACT, HYPO + 2]} strength={0.04}>
				{/* « Que s'est-il passé ? » : déjà là sur l'image 0, claque sur la question, s'efface sur « Mais au fait » */}
				{qOut < 1 ? (
					<div style={{position: 'absolute', left: 72, top: 226, width: 936, opacity: 1 - qOut, transform: `translateY(${-40 * qOut}px) scale(${qPunch})`, transformOrigin: '0 50%'}}>
						<Title at={-60} text={"Que s'est-il\n*passé* ?"} size={110} />
					</div>
				) : null}
				{frame >= CEST - 2 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
							<Title at={CEST} text="C'est quoi la" size={74} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
							<Title at={GLY2} text="*glycémie* ?" size={130} stagger={4} />
						</div>
					</>
				) : null}
				<ZoomCam keys={cam} w={HOOK_WIN.w} h={HOOK_WIN.h} y={HOOK_WIN.y} radius={0}>
					{leave < 1 ? (
						<>
							{/* ombre au sol quand il est couché */}
							<div style={{position: 'absolute', left: PIVOT.x + LIE.dx - 600, top: PIVOT.y + LIE.dy + 196, width: 620, height: 36, borderRadius: '50%', background: alpha(N, 0.12 * f), opacity: 1 - leave}} />
							<div
								style={{
									position: 'absolute',
									left: STAND.x,
									top: STAND.y,
									opacity: 1 - leave,
									transformOrigin: `${HP / 2}px ${HP * 1.4}px`,
									transform: `translate(${LIE.dx * f}px, ${LIE.dy * f + rise + 160 * leave}px) rotate(${-90 * f + Math.sin(frame / 5) * 6 * wobble}deg)`,
								}}
							>
								<Patient
									size={HP}
									mood={unwell && frame >= LEVE ? 'mal' : 'calme'}
									breath={idle(frame)}
									pale={unwell ? interpolate(frame, [LEVE, EFF], [0.3, 0.8], clamp) : 0}
									sweat={unwell ? interpolate(frame, [LEVE, EFF], [0.4, 1], clamp) : 0}
									dizzy={unwell ? wobble : 0}
									eyesClosed={unwell ? interpolate(f, [0.6, 1], [0, 1], clamp) : 0}
								/>
							</div>
							{/* « il manque de sucre » : les sucres quittent le corps */}
							{[0, 1, 2, 3, 4].map((i) => {
								const t0 = SUCRE - 4 + i * 4;
								const t = frame - t0;
								if (t < 0 || t > 26) return null;
								const p = liePt(300 + i * 40, 250 + (i % 2) * 120);
								return (
									<div key={i} style={{position: 'absolute', left: p.x - 24, top: p.y - 24 - t * 7, opacity: interpolate(t, [0, 3, 18, 26], [0, 1, 1, 0], clamp), transform: `scale(${interpolate(t, [0, 4, 26], [0.3, 1.1, 0.6], clamp)})`}}>
										<SugarCube size={52} rot={-14 + i * 9 + t * 2} />
									</div>
								);
							})}
						</>
					) : null}
				</ZoomCam>
				{/* retour en arrière : image bleutée, bandeau, horloge qui recule */}
				{tint > 0 ? <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${alpha(LPI.sky, 0.18 * tint)} 30%, ${alpha(N, 0.28 * tint)} 100%)`}} /> : null}
				<div style={{position: 'absolute', left: 72, top: 486}}>
					<Rewind at={TRENTE} out={VERD - 2} />
				</div>
				{flashback ? (
					<div style={{position: 'absolute', left: 64, top: 600, transform: `scale(${clockPop})`}}>
						<WallClock h={8} m={0} size={180} spin={interpolate(frame, [TRENTE + 2, TRENTE + 20], [0, -0.5], ease)} />
					</div>
				) : null}
				<Bubble at={DIT + 2} out={VERD - 2} x={mouth.x + 70} y={HOOK_WIN.y + mouth.y - 330}>
					« Ce matin, je n'ai <span style={{color: LPI.blue}}>rien mangé</span>… »
				</Bubble>
				{frame < MAIS + 8 ? (
					<div style={{position: 'absolute', inset: 0, opacity: out}}>
						<Lead at={INSU} text="les indices :" />
						{clues.map(([t, icon, label, x]) => (
							<div key={label} style={{position: 'absolute', left: x, top: 1240}}>
								<CauseChip at={t} icon={icon} label={label} />
							</div>
						))}
					</div>
				) : null}
				<Stamp at={HYPO + 2} x={540} y={650} text="Hypoglycémie" size={62} rot={-6} out={GLY - 6} />
				{frame < GLY - 4 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 712, textAlign: 'center'}}>
						<Pill at={MANQUE} color={LPI.sky} size={46}>
							pas assez de sucre dans le sang
						</Pill>
					</div>
				) : null}
				{frame >= GLY ? (
					<div style={{position: 'absolute', left: mx, top: my, transform: `scale(${mk * (0.4 + 0.6 * mPop)})`, transformOrigin: 'left top'}}>
						<Glucometer value={value} strip={0} blood={0} tone={value < 0.7 && frame > GLY + 10 ? LPI.sky : null} beep={frame >= GLY + 24 ? Math.exp(-(frame - GLY - 24) / 4) : 0} />
					</div>
				) : null}
				<QMark at={QUE} out={TRENTE - 4} x={820} y={640} size={150} />
				<QMark at={QUOI} x={836} y={500} />
				<Burst at={IMPACT} x={540} y={1150} r={300} n={14} />
				<Burst at={QUE} x={895} y={715} r={190} n={12} />
				<Burst at={HYPO + 2} x={540} y={650} r={320} n={14} />
				<Burst at={QUOI} x={921} y={585} r={200} n={12} />
			</Camera>
			<Flash at={IMPACT} />
			<Flash at={VERD - 2} color={LPI.paper} max={0.7} />
			<Flash at={HYPO + 2} />
			<Sfx name="heartbeat" at={0} volume={0.1} />
			<Sfx name="whoosh" at={EFF} volume={0.07} />
			<Sfx name="impact" at={IMPACT} volume={0.12} />
			<Sfx name="pop" at={QUE} volume={0.12} />
			<Sfx name="whoosh" at={TRENTE - 3} volume={0.08} />
			{[0, 5, 10, 15].map((k) => (
				<Sfx key={k} name="tick" at={TRENTE + 3 + k} volume={0.06} />
			))}
			{clues.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
			<Sfx name="pop" at={DIT + 2} volume={0.08} />
			<Sfx name="drumroll" at={VERD} volume={0.07} dur={HYPO - VERD + 2} />
			<Sfx name="stamp" at={HYPO + 2} volume={0.1} />
			<Sfx name="pop" at={SUCRE} volume={0.08} />
			<Sfx name="ding" at={GLY + 24} volume={0.06} />
			<Sfx name="whoosh" at={MAIS} volume={0.06} />
			<Sfx name="pop" at={QUOI} volume={0.12} />
			<Sfx name="whoosh" at={GLY2} volume={0.06} />
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
