// Scènes de « La tension artérielle » : une notion = une scène, chaque mouvement part d'un mot de la voix.
// Le patient (src/brand/patient.tsx) joue la mesure et les signes ; le manomètre et la lecture 120/80 roulent.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNum, CamKey, CauseChip, Head, LAY, Lead, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {DizzyIcon, EarIcon, FaintIcon, HeadacheIcon, PaleIcon} from '../../brand/icons';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {Patient, patientPoint} from '../../brand/patient';
import {Artery, Heart} from '../../brand/pictos';
import {BPReadout, Manometer, PA_ZONES} from '../../brand/pressure';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);
/** battement : 1 juste après chaque coup, décroît ensuite (`period` frames) */
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number) => 0.5 - 0.5 * Math.cos(frame / 22);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 (miniature) : le patient ne va pas bien, « Qu'est-ce qu'il a ? » est déjà à l'écran. Les signes arrivent au mot
// (maux de tête, vertiges, oreilles qui bourdonnent) ; la question claque ; « hypertension » : le patient glisse à gauche,
// le manomètre surgit et s'affole (180/110), flash rose ; « brassard » : le brassard se gonfle, relié au manomètre, et la
// caméra s'approche ; « Mais au fait » : on recule, tout s'efface ; « c'est quoi, la tension artérielle ? » : le manomètre
// se centre en (540, 800), là où la transition plonge vers la définition.
const HOOK_WIN = {y: 400, w: 1080, h: 820};
const HP = 470;
/** point du patient (unités du viewBox 400 × 560) dans la fenêtre de l'accroche, patient posé en (left, 30) */
const hookPt = (x: number, y: number, left: number) => ({x: left + (x * HP) / 400, y: 30 + (y * HP) / 400});

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, 0.5, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
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

/** Oreille qui bourdonne : ondes qui partent de l'oreille (`dir` = côté) + « bzz ». */
const Buzz: React.FC<{at: number; x: number; y: number; dir: 1 | -1; o: number}> = ({at: t0, x, y, dir, o}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || o <= 0) return null;
	const t = frame - t0;
	const c = Math.cos(0.7);
	const s = Math.sin(0.7);
	return (
		<svg width={180} height={180} viewBox="-90 -90 180 180" style={{position: 'absolute', left: x - 90, top: y - 90, overflow: 'visible', opacity: o * Math.min(1, t / 4)}}>
			{[0, 1, 2].map((i) => {
				const ph = ((t + i * 6) % 18) / 18;
				const r = 18 + ph * 48;
				return <path key={i} d={`M ${dir * r * c} ${-r * s} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${dir * r * c} ${r * s}`} fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" opacity={1 - ph} />;
			})}
			<text x={dir * 70} y={-52} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N} transform={`rotate(${dir * 14} ${dir * 70} -52)`}>
				bzz
			</text>
		</svg>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TETE = at('intro', 'tête');
	const VERT = at('intro', 'vertiges');
	const OREI = at('intro', 'oreilles');
	const QU = at('intro', "qu'est-ce");
	const HYP = at('intro', 'hypertension');
	const SA = at('intro', 'tension'); // « sa tension est trop haute »
	const TROP = at('intro', 'trop');
	const BRAS = at('intro', 'brassard');
	const MAIS = at('intro', 'mais');
	const CEST = at('intro', "c'est");
	const QUOI = at('intro', 'quoi');
	const TENS = at('intro', 'tension', 2);
	const slide = interpolate(frame, [HYP - 2, HYP + 10], [0, 1], ease);
	const leave = interpolate(frame, [MAIS, MAIS + 12], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const left = 305 - 275 * slide - 640 * leave;
	const dizzy = interpolate(frame, [VERT - 2, VERT + 8], [0, 1], clamp);
	const cuff = interpolate(frame, [BRAS - 2, BRAS + 6], [0, 1], clamp);
	const pipe = interpolate(frame, [BRAS + 2, BRAS + 14], [0, 1], clamp);
	const rise = interpolate(frame, [HYP, HYP + 14], [0, 1], ease);
	const pulse = pulseAt(frame, 16);
	const sys = 180 * rise;
	const dia = 110 * rise;
	const mPop = usePop(HYP);
	// le manomètre : à droite du patient, puis au centre (on y plonge vers la définition)
	const center = interpolate(frame, [MAIS + 4, MAIS + 20], [0, 1], ease);
	const mSize = 300 + 80 * center;
	const mx = 760 - 220 * center;
	const my = 190 + 210 * center;
	const rx = 760 - 220 * center;
	const ry = 352 + 258 * center;
	const arm = hookPt(309, 300, left);
	const out = interpolate(frame, [MAIS - 2, MAIS + 8], [1, 0], clamp);
	const qOut = interpolate(frame, [MAIS + 4, MAIS + 12], [0, 1], ease);
	const qPunch = frame >= QU ? 1 + 0.1 * Math.exp(-(frame - QU) / 4) : 1;
	const cam: CamKey[] = [
		{at: -1, s: 1},
		{at: BRAS - 2, s: 1.3, x: 600, y: 320, dur: 16},
		{at: MAIS, s: 1, dur: 14},
	];
	const signs: [number, React.ReactNode, string, number, number][] = [
		[TETE, <HeadacheIcon key="t" size={56} />, 'maux de tête', 72, 1240],
		[VERT, <DizzyIcon key="v" size={56} />, 'vertiges', 560, 1240],
		[OREI, <EarIcon key="o" size={56} />, "bourdonnements d'oreilles", 72, 1356],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TETE + 1, VERT + 1, OREI + 1, QU + 1, HYP + 1, TROP + 1, BRAS + 1, CEST + 1, TENS + 1]} shakes={[QU + 2, HYP + 2]} strength={0.04}>
				{/* « Qu'est-ce qu'il a ? » : déjà là sur l'image 0, claque sur la question, s'efface sur « Mais au fait » */}
				{qOut < 1 ? (
					<div style={{position: 'absolute', left: 72, top: 250, width: 936, opacity: 1 - qOut, transform: `translateY(${-40 * qOut}px) scale(${qPunch})`, transformOrigin: '0 50%'}}>
						<Title at={-60} text={"Qu'est-ce *qu'il* *a* ?"} size={92} />
					</div>
				) : null}
				{frame >= CEST - 2 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
							<Title at={CEST} text="C'est quoi la" size={74} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
							<Title at={TENS} text={'*tension*\n*artérielle* ?'} size={112} stagger={4} />
						</div>
					</>
				) : null}
				<ZoomCam keys={cam} w={HOOK_WIN.w} h={HOOK_WIN.h} y={HOOK_WIN.y} radius={0}>
					{leave < 1 ? (
						<div style={{position: 'absolute', left, top: 30, opacity: 1 - leave, transform: `rotate(${Math.sin(frame / 9) * 4 * dizzy * (1 - 0.6 * slide)}deg)`, transformOrigin: `${HP / 2}px ${HP * 1.2}px`}}>
							<Patient
								size={HP}
								mood="mal"
								breath={idle(frame)}
								pain={interpolate(frame, [TETE - 2, TETE + 6], [0.45, 1], clamp)}
								dizzy={dizzy}
								flush={interpolate(frame, [HYP, HYP + 10], [0, 0.7], clamp)}
								heart={interpolate(frame, [SA - 2, SA + 8], [0, 1], clamp)}
								beat={pulse}
								flow={interpolate(frame, [SA, SA + 20], [0, 1], clamp)}
								cuff={cuff}
								press={interpolate(frame, [BRAS + 2, BRAS + 16], [0, 1], clamp) * (0.85 + 0.15 * pulse)}
							/>
						</div>
					) : null}
					{/* le tuyau du brassard rejoint le manomètre (par la gauche : il ne croise pas les chiffres) */}
					{pipe > 0 && leave < 1 ? (
						<svg width={HOOK_WIN.w} height={HOOK_WIN.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - leave}}>
							<path
								d={`M ${arm.x + 20} ${arm.y + 6} C ${arm.x + 140} ${arm.y + 46}, ${mx - mSize * 0.33 - 90} ${my + mSize * 0.33 + 20}, ${mx - mSize * 0.33} ${my + mSize * 0.33}`}
								fill="none"
								stroke={N}
								strokeWidth={9}
								strokeLinecap="round"
								pathLength={1}
								strokeDasharray={1}
								strokeDashoffset={1 - pipe}
							/>
						</svg>
					) : null}
					{(
						[
							[hookPt(276, 116, left), 1],
							[hookPt(124, 116, left), -1],
						] as const
					).map(([p, dir]) => (
						<Buzz key={dir} at={OREI} x={p.x} y={p.y} dir={dir} o={1 - leave} />
					))}
					{frame >= HYP ? (
						<>
							<div style={{position: 'absolute', left: mx - mSize / 2, top: my - mSize / 2, transform: `scale(${mPop})`}}>
								<Manometer value={dia + (sys - dia) * pulse} size={mSize} tone={LPI.pink} />
							</div>
							<div style={{position: 'absolute', left: rx, top: ry, transform: `translateX(-50%) scale(${(0.6 + 0.4 * mPop) * (1 + 0.2 * center)})`, transformOrigin: '50% 0', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<BPReadout sys={sys} dia={dia} size={96} labels={false} unit={false} tone={LPI.pink} diaPlaces={3} />
								<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 40, color: LPI.blue}}>mmHg</div>
							</div>
						</>
					) : null}
				</ZoomCam>
				{signs.map(([t, icon, label, x, y]) => (
					<div key={label} style={{position: 'absolute', left: x, top: y, opacity: out, transform: `scale(${0.6 + 0.4 * out})`}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
				<Stamp at={HYP + 3} x={770} y={1000} text="Hypertension" size={58} rot={-7} out={BRAS - 4} />
				{frame < BRAS - 2 ? (
					<div style={{position: 'absolute', left: 590, top: 1092}}>
						<Pill at={TROP}>trop haute !</Pill>
					</div>
				) : null}
				{frame < MAIS ? (
					<div style={{position: 'absolute', left: 72, top: 1110}}>
						<Pill at={BRAS + 2} color={LPI.sky} size={52}>
							un simple brassard
						</Pill>
					</div>
				) : null}
				<QMark at={QU} out={HYP - 4} x={770} y={440} size={150} />
				<QMark at={QUOI} x={800} y={560} />
				<Burst at={QU} x={845} y={515} r={190} n={12} />
				<Burst at={HYP} x={760} y={590} r={260} n={14} />
				<Burst at={QUOI} x={885} y={645} r={200} n={12} />
			</Camera>
			<Flash at={HYP + 2} />
			<Sfx name="heartbeat" at={0} volume={0.1} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
			<Sfx name="buzz" at={OREI + 2} volume={0.035} dur={18} />
			<Sfx name="pop" at={QU} volume={0.12} />
			<Sfx name="impact" at={HYP} volume={0.1} />
			<Sfx name="stamp" at={HYP + 4} volume={0.09} />
			<Sfx name="tick" at={TROP} volume={0.08} />
			<Sfx name="whoosh" at={BRAS - 2} volume={0.06} />
			<Sfx name="whoosh" at={MAIS} volume={0.06} />
			<Sfx name="pop" at={QUOI} volume={0.12} />
			<Sfx name="whoosh" at={TENS} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
const LOUPE = {x: 660, y: 230, r: 190};
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const T = at('def', 'tension');
	const OU = at('def', 'ou');
	const PR = at('def', 'pression', 2);
	const SANG = at('def', 'sang');
	const PAROI = at('def', 'paroi');
	const ART = at('def', 'artères');
	const MM = at('def', 'millimètres');
	const MER = at('def', 'mercure');
	const body = useSoft(T + 2);
	const loupe = useSoft(PR - 2, true);
	const arrows = interpolate(frame, [PAROI - 4, PAROI + 8], [0, 1], clamp);
	const flow = interpolate(frame, [ART - 2, ART + 12], [0, 1], clamp);
	const arm = patientPoint('upperArm', 280);
	const ax = 30 + arm.x;
	const ay = 40 + arm.y;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[T + 1, OU + 1, PR + 1, PAROI + 1, ART + 1, MM + 1]} shakes={[PAROI + 2]}>
				<Head kicker="Définition" kAt={T} title="Tension *artérielle*" tAt={T + 2} size={80} />
				<Stage y={LAY.stageY} h={480} at={T + 4} bumps={[PAROI, MM]}>
					<div style={{position: 'absolute', left: 30, top: 40, opacity: Math.min(1, body * 1.5), transform: `translateY(${(1 - body) * 50}px)`}}>
						<Patient size={280} breath={idle(frame)} heart={body} beat={pulseAt(frame)} flow={flow} />
					</div>
					{/* loupe sur l'artère du bras : le sang pousse sur la paroi */}
					{frame >= PR - 2 ? (
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
								<div style={{position: 'absolute', left: -60, top: LOUPE.r - 150 - 9, transform: 'scale(1)', transformOrigin: 'left top'}}>
									<Artery width={520} arrows={arrows} strength={1.3} />
								</div>
							</div>
						</>
					) : null}
					{frame >= SANG ? (
						<div style={{position: 'absolute', left: LOUPE.x - 70, top: LOUPE.y + LOUPE.r - 40}}>
							<Pill at={SANG} size={36}>
								sang
							</Pill>
						</div>
					) : null}
					{frame >= PAROI ? (
						<div style={{position: 'absolute', left: LOUPE.x - 76, top: LOUPE.y - LOUPE.r - 26}}>
							<Pill at={PAROI} size={36} color={LPI.blue}>
								paroi
							</Pill>
						</div>
					) : null}
				</Stage>
				{/* TA = PA */}
				<div style={{position: 'absolute', left: 72, top: 960, display: 'flex', alignItems: 'center', gap: 18}}>
					<Pill at={OU - 2} color={LPI.blue} size={54}>
						TA
					</Pill>
					{frame >= OU + 2 ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.blue}}>=</span> : null}
					<Pill at={OU + 4} size={54}>
						PA
					</Pill>
					{frame >= OU + 8 ? (
						<Enter at={OU + 8} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: N, lineHeight: 1.1, display: 'block'}}>
								tension =<br />
								pression artérielle
							</span>
						</Enter>
					) : null}
				</div>
				{/* unité */}
				<div style={{position: 'absolute', left: 72, top: 1110, display: 'flex', alignItems: 'center', gap: 22}}>
					<Pill at={MM} size={70}>
						mmHg
					</Pill>
					{frame >= MER - 2 ? (
						<Enter at={MER - 2} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 38, color: N, lineHeight: 1.1, display: 'block'}}>
								millimètres
								<br />
								<span style={{color: LPI.blue}}>de mercure</span>
							</span>
						</Enter>
					) : null}
				</div>
				<Burst at={MM} x={200} y={1160} r={200} n={12} />
			</Camera>
			<Sfx name="pop" at={OU - 2} volume={0.1} />
			<Sfx name="whoosh" at={PR - 2} volume={0.06} />
			<Sfx name="impact" at={PAROI} volume={0.08} />
			<Sfx name="pop" at={MM} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE ═══════════════════════════════ */
export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const PR = at('mesure', 'prendre');
	const TE = at('mesure', 'tensiomètre');
	const BR = at('mesure', 'brassard');
	const BRAS = at('mesure', 'bras');
	const CO = at('mesure', 'cœur');
	const REP = at('mesure', 'repos');
	const SIZE = 340;
	const body = useSoft(PR - 2);
	const cuff = useSoft(BR - 2);
	const press = interpolate(frame, [REP + 4, REP + 30], [0, 1], ease);
	const heart = useSoft(CO - 2, true);
	const mano = useSoft(TE - 2, true);
	const arm = patientPoint('upperArm', SIZE);
	const hp = patientPoint('heart', SIZE);
	const cx = 40 + arm.x + 34;
	const cy = 40 + arm.y + 20;
	const tube = interpolate(frame, [BR + 4, BR + 20], [0, 1], clamp);
	const level = interpolate(frame, [CO, CO + 12], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TE + 1, BR + 1, BRAS + 1, CO + 1, REP + 1]} shakes={[BR + 2]}>
				<Head kicker="Mesure" kAt={PR - 4} title="Le *tensiomètre*" tAt={TE - 2} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={PR + 2} bumps={[BR, CO]}>
					<div style={{position: 'absolute', left: 40, top: 40, opacity: Math.min(1, body * 1.5), transform: `translateY(${(1 - body) * 60}px)`}}>
						<Patient size={SIZE} breath={idle(frame)} heart={heart} beat={pulseAt(frame)} cuff={cuff} press={press} mood={frame >= REP ? 'content' : 'calme'} />
					</div>
					<svg width={936} height={LAY.stageH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						{/* tuyau brassard → manomètre */}
						<path d={`M${cx} ${cy} C${cx + 120} ${cy + 80} ${600} ${420} ${690} ${330}`} fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${tube} 1`} />
						{/* au niveau du cœur */}
						<path d={`M${40 + hp.x} ${40 + hp.y} H${cx - 6}`} stroke={LPI.pink} strokeWidth={6} strokeDasharray="10 9" opacity={level} />
					</svg>
					<div style={{position: 'absolute', left: 560, top: 60, opacity: Math.min(1, mano * 1.5), transform: `scale(${0.5 + 0.5 * mano})`}}>
						<Manometer value={press * 170} size={260} />
					</div>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1030, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={BRAS} label="autour du bras" size={44} />
					<CheckChip at={CO} label="au niveau du cœur" size={44} />
					<CheckChip at={REP} label="patient au repos" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={TE - 2} volume={0.1} />
			<Sfx name="whoosh" at={BR - 2} volume={0.07} />
			<Sfx name="pop" at={BRAS} volume={0.1} />
			<Sfx name="pop" at={CO} volume={0.1} />
			<Sfx name="pop" at={REP} volume={0.1} />
			<Sfx name="tick" at={REP + 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · DEUX CHIFFRES ═══════════════════════════════ */
export const Chiffres: React.FC = () => {
	const frame = useCurrentFrame();
	const TE = at('chiffres', 'tensiomètre');
	const DEUX = at('chiffres', 'deux');
	const PREM = at('chiffres', 'premier');
	const SYS = at('chiffres', 'systolique');
	const CONT = at('chiffres', 'contracte');
	const DEUXI = at('chiffres', 'deuxième');
	const DIA = at('chiffres', 'diastolique');
	const REL = at('chiffres', 'relâche');
	const roll = interpolate(frame, [DEUX, DEUX + 24], [0, 1], ease);
	const hi = frame >= DEUXI ? 'dia' : frame >= PREM ? 'sys' : null;
	// le cœur se serre sur « contracte », s'ouvre sur « relâche », bat doucement sinon
	const squeeze = interpolate(frame, [CONT - 3, CONT + 6, DEUXI - 4, DEUXI + 4], [0, 1, 1, 0], ease);
	const relax = interpolate(frame, [REL - 3, REL + 8], [0, 1], ease);
	const heartScale = 1 - 0.2 * squeeze + 0.1 * relax;
	const free = squeeze === 0 && relax === 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, PREM + 1, SYS + 1, CONT + 1, DEUXI + 1, DIA + 1, REL + 1]} shakes={[CONT + 2]}>
				<Head kicker="Lecture" kAt={TE} title="Deux *chiffres*" tAt={DEUX - 2} />
				<Stage y={LAY.stageY} h={440} at={TE + 2} bumps={[CONT, REL]}>
					<div style={{position: 'absolute', left: 30, top: 90, transform: `scale(${heartScale})`}}>
						<Heart size={240} beat={free ? pulseAt(frame, 28) : 0} />
					</div>
					{/* flèches : cœur qui se serre / qui s'ouvre */}
					<svg width={300} height={440} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
						{[-1, 1].map((s) => (
							<g key={s} stroke={s < 0 ? LPI.blue : LPI.blue} strokeWidth={8} strokeLinecap="round" fill="none">
								{squeeze > 0 ? <path d={`M${150 + s * 150} 210 L${150 + s * 120} 210 M${150 + s * 132} 196 L${150 + s * 118} 210 L${150 + s * 132} 224`} opacity={squeeze} /> : null}
								{relax > 0 ? <path d={`M${150 + s * 118} 210 L${150 + s * 150} 210 M${150 + s * 138} 196 L${150 + s * 152} 210 L${150 + s * 138} 224`} opacity={relax} /> : null}
							</g>
						))}
					</svg>
					<div style={{position: 'absolute', left: 320, top: 110, opacity: Math.min(1, roll * 3)}}>
						<BPReadout sys={120 * roll} dia={80 * roll} size={150} hi={hi} unit={false} />
					</div>
				</Stage>
				<TermSlam
					index={0}
					at={SYS}
					term="Systolique"
					meaning="1er chiffre : le cœur se contracte"
					sign="squeeze"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= SYS && frame < DEUXI}
				/>
				<TermSlam index={1} at={DIA} term="Diastolique" meaning="2e chiffre : le cœur se relâche" sign="relax" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= DIA} />
			</Camera>
			<Sfx name="tick" at={DEUX} volume={0.08} />
			<Sfx name="pop" at={PREM} volume={0.1} />
			<Sfx name="impact" at={CONT} volume={0.08} />
			<Sfx name="pop" at={DEUXI} volume={0.1} />
			<Sfx name="whoosh" at={REL} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const REP = at('norme', 'repos');
	const NORM = at('norme', 'normale');
	const S1 = at('norme', '120');
	const S2 = at('norme', '80');
	const S1b = at('norme', '120', 2);
	const S2b = at('norme', '80', 2);
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S2 + 4, S2 + 24], [95, 120], ease);
	const col = (t0: number, n: string, w: number, label: string, lAt: number) => (
		<div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{height: 210, display: 'flex', alignItems: 'center'}}>
				<BigNum at={t0} size={200}>
					{n}
				</BigNum>
			</div>
			{frame >= lAt ? (
				<Enter at={lAt} distance={20}>
					<span style={{display: 'inline-block', padding: '4px 22px', borderRadius: 999, background: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: LPI.blue, boxShadow: SHADOW}}>{label}</span>
				</Enter>
			) : null}
		</div>
	);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, REP + 1, NORM + 1, S1 + 1, S2 + 1, S1b + 1, S2b + 1]} shakes={[S1 + 2, S2 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420, display: 'flex', gap: 18}}>
					<CheckChip at={AD} label="adulte" size={40} />
					<CheckChip at={REP} label="au repos" size={40} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 550, width: 936, height: 360, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 580, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 6}}>
					{col(S1, '120', 360, 'systolique', S1b)}
					<div style={{height: 210, display: 'flex', alignItems: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 170, color: LPI.blue, opacity: frame >= S2 - 3 ? 1 : 0}}>/</div>
					{col(S2, '80', 260, 'diastolique', S2b)}
					<div style={{height: 210, display: 'flex', alignItems: 'flex-end', paddingBottom: 30, fontFamily: FONT.title, fontWeight: 800, fontSize: 46, color: LPI.blue, opacity: frame >= S2 + 6 ? 1 : 0}}>mmHg</div>
				</div>
				<Burst at={S1} x={330} y={690} r={230} n={10} />
				<Burst at={S2} x={700} y={690} r={230} n={12} />
				<NormScale zones={PA_ZONES} value={value} at={NORM + 4} markerAt={S2 + 4} y={1010} nameSize={30} rangeSize={24} />
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="pop" at={REP} volume={0.1} />
			<Sfx name="impact" at={S1} volume={0.1} />
			<Sfx name="impact" at={S2} volume={0.1} />
			<Sfx name="pop" at={S1b} volume={0.09} />
			<Sfx name="pop" at={S2b} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · HYPERTENSION / 6 · HYPOTENSION ═══════════════════════════════ */
/** Patient + manomètre + lecture sur le socle. */
const BPStage: React.FC<{sys: number; dia: number; tone: string | null; patient: React.ComponentProps<typeof Patient>; sway?: number}> = ({sys, dia, tone, patient, sway = 0}) => {
	const frame = useCurrentFrame();
	const pulse = pulseAt(frame, 22);
	return (
		<>
			<div style={{position: 'absolute', left: 26, top: 34, transform: `rotate(${Math.sin(frame / 9) * 5 * sway}deg)`, transformOrigin: '145px 380px'}}>
				<Patient size={290} breath={idle(frame)} {...patient} />
			</div>
			<div style={{position: 'absolute', left: 330, top: 34}}>
				<Manometer value={dia + (sys - dia) * pulse} size={214} tone={tone} />
			</div>
			<div style={{position: 'absolute', left: 556, top: 76}}>
				<BPReadout sys={sys} dia={dia} size={92} labels={false} unit={false} tone={tone} />
			</div>
			<div style={{position: 'absolute', left: 612, top: 206, fontFamily: FONT.title, fontWeight: 800, fontSize: 42, color: LPI.blue}}>mmHg</div>
		</>
	);
};

export const Hyper: React.FC = () => {
	const frame = useCurrentFrame();
	const AU = at('hyper', 'au-dessus');
	const S140 = at('hyper', '140');
	const HY = at('hyper', 'hypertension');
	const HTA = at('hyper', 'hta');
	const INA = at('hyper', 'inaperçue');
	const TETE = at('hyper', 'tête');
	const BOUR = at('hyper', 'bourdonnements');
	const VERT = at('hyper', 'vertiges');
	const sys = interpolate(frame, [S140 - 2, S140 + 18], [120, 165], ease);
	const dia = interpolate(frame, [S140 - 2, S140 + 18], [80, 95], ease);
	const fill = interpolate(frame, [S140, S140 + 22], [0, 1], clamp);
	const signs: [number, React.ReactNode, string][] = [
		[TETE, <HeadacheIcon key="t" size={56} />, 'maux de tête'],
		[BOUR, <EarIcon key="o" size={56} />, "bourdonnements d'oreilles"],
		[VERT, <DizzyIcon key="v" size={56} />, 'vertiges'],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AU + 1, S140 + 1, HY + 1, HTA + 1, INA + 1, ...signs.map(([t]) => t + 1)]} shakes={[HY + 2]}>
				<Head kicker="Au-dessus de 140/90" kAt={AU} title="Trop *haute*" tAt={AU + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={AU + 4} layers={[{color: PINK, level: fill}]} bumps={[S140, HY]}>
					<BPStage
						sys={sys}
						dia={dia}
						tone={frame >= S140 ? LPI.pink : null}
						patient={{
							mood: frame >= INA && frame < TETE ? 'calme' : frame >= HY ? 'mal' : 'calme',
							heart: 1,
							beat: pulseAt(frame, 18),
							flow: fill,
							flush: interpolate(frame, [TETE, TETE + 10], [0, 0.7], clamp),
							pain: interpolate(frame, [TETE, TETE + 6], [0, 1], clamp),
							dizzy: interpolate(frame, [VERT, VERT + 8], [0, 1], clamp),
						}}
					/>
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hypertension"
					meaning={
						<>
							(HTA) pression trop haute <Seuil>&gt; 140/90 mmHg</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < INA}
				/>
				<Stamp at={HTA} x={800} y={LAY.stageY + 420} text="HTA" size={64} rot={-6} />
				<Lead at={INA} text="souvent inaperçue… parfois :" />
				{signs.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i === 2 ? 560 : 72, top: i === 1 ? 1356 : 1240}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			<Sfx name="tick" at={S140} volume={0.08} />
			<Sfx name="stamp" at={HTA} volume={0.1} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

export const Hypo: React.FC = () => {
	const frame = useCurrentFrame();
	const EN = at('hypo', 'en');
	const S90 = at('hypo', '90');
	const HY = at('hypo', 'hypotension');
	const BAS = at('hypo', 'basse');
	const PAT = at('hypo', 'patient');
	const TETE = at('hypo', 'tête');
	const PALE = at('hypo', 'pâle');
	const MAL = at('hypo', 'malaise');
	const sys = interpolate(frame, [S90 - 2, S90 + 18], [120, 85], ease);
	const dia = interpolate(frame, [S90 - 2, S90 + 18], [80, 55], ease);
	const fill = interpolate(frame, [S90, S90 + 22], [0, 1], clamp);
	const signs: [number, React.ReactNode, string][] = [
		[TETE, <DizzyIcon key="t" size={56} />, 'la tête qui tourne'],
		[PALE, <PaleIcon key="p" size={56} />, 'pâleur'],
		[MAL, <FaintIcon key="m" size={56} />, 'malaise'],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EN + 1, S90 + 1, HY + 1, BAS + 1, ...signs.map(([t]) => t + 1)]} shakes={[BAS + 2]}>
				<Head kicker="En dessous de 90/60" kAt={EN} title="Trop *basse*" tAt={EN + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={EN + 4} layers={[{color: COLD, level: fill}]} bumps={[S90, BAS]}>
					<BPStage
						sys={sys}
						dia={dia}
						tone={frame >= S90 ? LPI.sky : null}
						sway={interpolate(frame, [TETE, TETE + 10], [0, 1], clamp)}
						patient={{
							mood: frame >= HY ? 'mal' : 'calme',
							heart: 1,
							beat: pulseAt(frame, 34),
							pale: interpolate(frame, [PALE - 4, PALE + 8], [0, 1], clamp),
							dizzy: interpolate(frame, [TETE, TETE + 8], [0, 1], clamp),
						}}
					/>
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hypotension"
					meaning={
						<>
							pression trop basse <Seuil>&lt; 90/60 mmHg</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < TETE}
				/>
				<Lead at={PAT} text="le patient peut avoir…" />
				{signs.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i === 1 ? 560 : 72, top: i === 2 ? 1356 : 1240}}>
						<CauseChip at={t} icon={icon} label={label} tone={LPI.sky} />
					</div>
				))}
			</Camera>
			<Sfx name="tick" at={S90} volume={0.08} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Tension *artérielle*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'hypotension') + 18}
		rows={[
			[at('outro', 'pression'), 'device', 'Pression du sang', 'dans les artères · en mmHg'],
			[at('outro', 'chiffres'), 'squeeze', '2 chiffres', 'systolique / diastolique'],
			[at('outro', 'normale'), 'check', '≈ 120/80 mmHg', 'normale (adulte, repos)'],
			[at('outro', 'hypertension'), 'up', 'Hypertension (HTA)', '> 140/90 mmHg'],
			[at('outro', 'hypotension'), 'down', 'Hypotension', '< 90/60 mmHg'],
		]}
	/>
);
