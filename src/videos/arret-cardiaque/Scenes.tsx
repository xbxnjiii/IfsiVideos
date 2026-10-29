// Scènes de « L'arrêt cardiaque chez l'adulte » : accroche-choc (le tracé devient plat, le patient s'effondre,
// 3 minutes pour le cerveau, −10 % de survie par minute), définition (fibrillation ventriculaire), reconnaître,
// alerter, masser, RCP 30/2, défibrillateur, récap rapide.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Aed, CprHands, DepthGauge, EcgMonitor, HeadTilt, Pad, Rhythm} from '../../brand/arrest';
import {Brain} from '../../brand/brain';
import {Phone} from '../../brand/devices';
import {BigNum, Head, LAY, Pill, RecapScene, SLAM_Y, Stopwatch, termSlot} from '../../brand/episode';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Heart, Lungs} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const easeIn = {...clamp, easing: Easing.in(Easing.cubic)};
const N = LPI.navy;
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
/** ressort sans hook (utilisable dans une boucle) */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
/** compressions à ~110/min : enfoncement 0 → 1 rapide, remontée complète */
const compress = (frame: number, from: number, period = 16) => {
	if (frame < from) return 0;
	const p = ((frame - from) % period) / period;
	return p < 0.35 ? Math.sin((p / 0.35) * Math.PI * 0.5) : Math.cos(((p - 0.35) / 0.65) * Math.PI * 0.5);
};

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.55}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Cœur qui bat (`quiver` 0 → 1 : il tremble au lieu de battre, fibrillation). */
const LiveHeart: React.FC<{size: number; quiver?: number; period?: number}> = ({size, quiver = 0, period = 25}) => {
	const frame = useCurrentFrame();
	const beat = quiver > 0.5 ? 0 : pulseAt(frame, period);
	const jx = Math.sin(frame * 2.7) * 7 * quiver;
	const jy = Math.cos(frame * 3.3) * 5 * quiver;
	const js = 1 + Math.sin(frame * 3.1) * 0.05 * quiver;
	return (
		<div style={{position: 'relative', width: size, height: size, transform: `translate(${jx}px, ${jy}px) scale(${js})`}}>
			<Heart size={size} beat={beat} />
			{quiver > 0 ? (
				<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{[-1, 1].map((s) => (
						<path key={s} d={`M${50 + s * 46} 24 l${s * 8} 6 l${-s * 8} 6 l${s * 8} 6`} fill="none" stroke={LPI.pink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={quiver * (0.6 + 0.4 * Math.sin(frame))} />
					))}
				</svg>
			) : null}
		</div>
	);
};

/** Bulle de parole. */
const Bubble: React.FC<{at: number; x: number; y: number; children: React.ReactNode; size?: number}> = ({at: t0, x, y, children, size = 40}) => {
	const frame = useCurrentFrame();
	const p = popAt(frame, t0);
	if (frame < t0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				padding: '16px 28px',
				borderRadius: 36,
				background: LPI.paper,
				border: `6px solid ${N}`,
				boxShadow: SHADOW,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size,
				color: N,
				whiteSpace: 'nowrap',
				transform: `scale(${p})`,
				transformOrigin: 'left bottom',
			}}
		>
			{children}
			<div style={{position: 'absolute', left: 24, bottom: -24, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `24px solid ${N}`}} />
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ARR = at('intro', "s'arrêter");
	const DES = at('intro', 'dès');
	const CERV = at('intro', 'cerveau');
	const DANGER = at('intro', 'danger');
	const ET = at('intro', 'et');
	const MASS = at('intro', 'massage');
	const DIX = at('intro', '10');
	const MOINS = at('intro', 'moins');
	const ALORS = at('intro', 'alors');
	const QUOI = at('intro', 'quoi');
	const ARR2 = at('intro', 'arrêt');
	const GESTES = at('intro', 'gestes');
	const FLAT = ARR + 8;
	const rhythm = (t: number): Rhythm => (t < ARR - 2 ? 'sinus' : t < FLAT ? 'fv' : 'flat');
	const fall = frame < ARR + 4 ? 0 : spring({frame: frame - (ARR + 4), fps, config: {damping: 9, stiffness: 120}});
	const toB = interpolate(frame, [DES - 4, DES + 10], [0, 1], ease);
	const outB = interpolate(frame, [ET - 4, ET + 6], [1, 0], clamp);
	const outC = interpolate(frame, [ALORS - 4, ALORS + 6], [1, 0], clamp);
	const clockIn = spring({frame: frame - (DES - 2), fps, config: {damping: 12, stiffness: 160}});
	const brainIn = spring({frame: frame - (CERV - 4), fps, config: {damping: 12, stiffness: 150}});
	// −10 % par minute : un cran toutes les 6 frames de « chaque » à « moins »
	const STEP = Math.max(6, (MOINS + 4 - (ET + 6)) / 6);
	const stepsN = Math.max(0, Math.min(6, Math.floor((frame - (ET + 6)) / STEP) + 1));
	const survival = frame < ET + 6 ? 100 : 100 - 10 * stepsN;
	const shown = interpolate(frame, [ET + 6, ET + 6 + STEP * 6], [100, 40], clamp);
	const heartIn = spring({frame: frame - (ALORS + 5), fps, config: {damping: 12, stiffness: 160}});
	const sweep = ((frame - DES) % 30) / 30;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ARR + 1, FLAT + 1, DES + 1, DANGER + 1, DIX + 1, MOINS + 1, QUOI + 1, ARR2 + 1]} shakes={[FLAT + 2, DANGER + 2]} strength={0.05}>
				{/* ── A · le tracé s'arrête, il s'effondre ── */}
				<div style={{position: 'absolute', left: 72, top: 170, opacity: 1 - toB}}>
					<Title at={0} text="Son *cœur* s'arrête…" size={84} stagger={3} brush={false} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 300,
						transform: `translate(${toB * 520}px, ${toB * -60}px) scale(${1 - 0.55 * toB})`,
						transformOrigin: 'left top',
						opacity: outC,
					}}
				>
					<EcgMonitor rhythm={rhythm} width={936} height={300} readout={frame < ARR - 2 ? '♥ 72' : frame < FLAT ? 'FV' : '0'} alert={frame >= FLAT ? 1 : 0} />
				</div>
				{frame < DES + 10 ? (
					<div
						style={{
							position: 'absolute',
							left: 540 - 190,
							top: 680,
							opacity: 1 - toB,
							transform: `translateY(${fall * 260}px) rotate(${-84 * fall}deg)`,
							transformOrigin: '190px 520px',
						}}
					>
						<Patient size={380} breath={0} mood={frame >= ARR ? 'mal' : 'calme'} eyesClosed={interpolate(frame, [ARR + 2, ARR + 8], [0, 1], clamp)} pale={interpolate(frame, [FLAT, FLAT + 10], [0, 0.6], clamp)} />
					</div>
				) : null}
				{/* ── B · 3 minutes : le cerveau en danger ── */}
				{frame >= DES - 2 && outB > 0 ? (
					<div style={{opacity: outB}}>
						<div style={{position: 'absolute', left: 60, top: 560, width: 420, height: 420, transform: `scale(${0.3 + 0.7 * clockIn})`}}>
							<svg width={420} height={420} viewBox="-135 -135 270 270" style={{position: 'absolute', inset: 0}}>
								<circle r={120} fill={LPI.paper} stroke={N} strokeWidth={12} />
								<circle r={98} fill="none" stroke={alpha(LPI.pink, 0.95)} strokeWidth={22} strokeDasharray={`${Math.max(0, sweep) * 616} 616`} transform="rotate(-90)" strokeLinecap="round" />
								<path d="M0 0 V-84" transform={`rotate(${Math.max(0, sweep) * 360})`} stroke={N} strokeWidth={8} strokeLinecap="round" />
							</svg>
							<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 190, color: N, lineHeight: 0.9}}>3</div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: LPI.blue}}>minutes</div>
							</div>
						</div>
						{frame >= CERV - 4 ? (
							<div style={{position: 'absolute', left: 500, top: 600, transform: `scale(${0.3 + 0.7 * brainIn})`}}>
								<Brain size={500} dead={interpolate(frame, [DANGER - 4, ET], [0, 0.55], clamp)} everywhere alert={frame >= DANGER ? 1 : 0} flow={0.2} />
							</div>
						) : null}
						<Stamp at={DANGER} x={760} y={1080} text="En danger !" size={66} rot={-7} />
					</div>
				) : null}
				{/* ── C · −10 % de survie par minute ── */}
				{frame >= ET && outC > 0 ? (
					<div style={{opacity: outC * Math.min(1, (frame - ET) / 6)}}>
						<div style={{position: 'absolute', left: 72, top: 560}}>
							<Pill at={MASS - 2} size={48}>
								sans massage
							</Pill>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 250, color: N, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
							{Math.round(shown)}
							<span style={{fontSize: 120, color: LPI.blue}}> %</span>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 950, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: LPI.blue}}>chances de survie</div>
						<div style={{position: 'absolute', left: 72, top: 1040, width: 936, height: 74, borderRadius: 37, background: LPI.paper, border: `7px solid ${N}`, boxSizing: 'border-box', overflow: 'hidden'}}>
							<div style={{width: `${shown}%`, height: '100%', background: shown > 60 ? LPI.blue : LPI.pink}} />
						</div>
						{Array.from({length: stepsN}, (_, i) => (
							<div key={i} style={{position: 'absolute', left: 72 + i * 152, top: 1140, transform: `scale(${popAt(frame, ET + 6 + i * STEP)})`}}>
								<span style={{display: 'inline-block', padding: '6px 18px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>−10 %</span>
							</div>
						))}
						<div style={{position: 'absolute', left: 72, top: 1210, fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.1em', color: alpha(N, 0.65), opacity: stepsN > 0 ? 1 : 0}}>
							{`MINUTE ${stepsN}`} · {survival} %
						</div>
					</div>
				) : null}
				{/* ── D · la question ── */}
				{frame >= ALORS - 2 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 250, width: 936}}>
							<Title at={ALORS} text="C'est quoi un" size={80} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 340, width: 936}}>
							<Title at={ARR2 - 2} text={'*arrêt*\n*cardiaque* ?'} size={136} stagger={4} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 670, width: 936}}>
							<Title at={GESTES - 4} text="et quels *gestes* faire ?" size={62} stagger={2} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 540 - 160, top: 800, transform: `scale(${heartIn})`}}>
							<LiveHeart size={320} quiver={1} />
						</div>
						{frame >= QUOI ? (
							<div style={{position: 'absolute', left: 770, top: 780, width: 170, height: 170, borderRadius: 85, background: LPI.pink, border: `8px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N, transform: `scale(${popAt(frame, QUOI)}) rotate(${Math.sin(frame / 6) * 8}deg)`}}>
								?
							</div>
						) : null}
					</>
				) : null}
				<Burst at={FLAT} x={540} y={450} r={320} n={16} />
				<Burst at={DIX} x={540} y={820} r={300} n={14} />
				<Burst at={ARR2} x={420} y={480} r={260} n={14} />
			</Camera>
			<Flash at={FLAT} />
			<Flash at={DANGER} max={0.35} />
			<Sfx name="heartbeat" at={0} volume={0.12} />
			<Sfx name="buzz" at={FLAT} volume={0.09} dur={34} />
			<Sfx name="impact" at={ARR + 10} volume={0.12} />
			<Sfx name="tick" at={DES} volume={0.07} />
			<Sfx name="stamp" at={DANGER} volume={0.11} />
			{Array.from({length: 6}, (_, i) => (
				<Sfx key={i} name="tick" at={Math.round(ET + 6 + i * STEP)} volume={0.07} />
			))}
			<Sfx name="whoosh" at={ALORS - 4} volume={0.07} />
			<Sfx name="pop" at={QUOI} volume={0.11} />
			<Sfx name="impact" at={ARR2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const ARR = at('def', 'arrêt');
	const POMPE = at('def', 'pompe');
	const TREMB = at('def', 'trembler');
	const FIB = at('def', 'fibrillation');
	const CIRC = at('def', 'circule');
	const CERV = at('def', 'cerveau');
	const OXY = at('def', "d'oxygène");
	const quiver = interpolate(frame, [TREMB - 2, TREMB + 6], [0, 1], clamp);
	const rhythm = (t: number): Rhythm => (t < TREMB ? 'sinus' : 'fv');
	const mon = useSoft(ARR + 4, true);
	const brain = useSoft(CERV - 4, true);
	const flowing = frame < CIRC;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[POMPE + 1, TREMB + 1, FIB + 1, CIRC + 1, OXY + 1]} shakes={[TREMB + 2]}>
				<Head kicker="Définition" kAt={ARR} title="Arrêt *cardiaque*" tAt={ARR + 2} />
				<Stage y={LAY.stageY} h={540} at={ARR + 4} bumps={[TREMB, CIRC]}>
					<div style={{position: 'absolute', left: 30, top: 110}}>
						<LiveHeart size={280} quiver={quiver} />
					</div>
					<div style={{position: 'absolute', left: 30, top: 30}}>
						<Pill at={POMPE} size={34} color={frame >= TREMB ? LPI.pink : LPI.blue}>
							{frame >= TREMB ? 'il tremble' : 'il pompe'}
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 340, top: 30, opacity: Math.min(1, mon * 1.5), transform: `scale(${0.6 + 0.4 * mon})`, transformOrigin: 'left top'}}>
						<EcgMonitor rhythm={rhythm} width={566} height={220} readout={frame >= FIB ? 'FV' : '72'} alert={frame >= FIB ? 1 : 0} />
					</div>
					{/* sang pompé vers le corps → plus rien */}
					<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<path d="M300 300 C380 320 440 360 520 380" fill="none" stroke={flowing ? LPI.pink : alpha(LPI.sky, 1)} strokeWidth={16} strokeLinecap="round" />
						{flowing ? <path d="M300 300 C380 320 440 360 520 380" fill="none" stroke={LPI.paper} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 22" strokeDashoffset={-frame * 4 * (1 - quiver * 0.8)} /> : null}
					</svg>
					{frame >= CIRC - 2 ? (
						<div style={{position: 'absolute', left: 300, top: 400}}>
							<Pill at={CIRC - 2} size={32} color={LPI.sky}>
								le sang ne circule plus
							</Pill>
						</div>
					) : null}
					{frame >= CERV - 4 ? (
						<div style={{position: 'absolute', left: 560, top: 270, transform: `scale(${0.4 + 0.6 * brain})`, transformOrigin: 'center'}}>
							<Brain size={330} dead={interpolate(frame, [OXY - 4, OXY + 24], [0, 0.85], ease)} everywhere flow={0.2} alert={interpolate(frame, [OXY, OXY + 8], [0, 1], clamp)} />
						</div>
					) : null}
				</Stage>
				<TermSlam index={0} at={FIB} term="Fibrillation ventriculaire" meaning="le cœur tremble au lieu de battre" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= FIB} />
			</Camera>
			<Sfx name="heartbeat" at={POMPE - 4} volume={0.09} />
			<Sfx name="buzz" at={TREMB} volume={0.06} dur={20} />
			<Sfx name="impact" at={FIB} volume={0.08} />
			<Sfx name="pop" at={CERV} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · RECONNAÎTRE ═══════════════════════════════ */
export const Reconnaitre: React.FC = () => {
	const frame = useCurrentFrame();
	const POUR = at('reconnaitre', 'pour');
	const REP = at('reconnaitre', 'répond');
	const PARLE = at('reconnaitre', 'parle');
	const STIM = at('reconnaitre', 'stimule');
	const BASC = at('reconnaitre', 'bascule');
	const TETE = at('reconnaitre', 'tête');
	const REG = at('reconnaitre', 'regarde');
	const DIX = at('reconnaitre', '10');
	const RESP2 = at('reconnaitre', 'respire', 2);
	const GASPS = at('reconnaitre', 'gasps');
	const shake = frame >= STIM && frame < STIM + 22 ? Math.sin(frame * 1.8) * 8 : 0;
	const tiltIn = useSoft(BASC - 4, true);
	const tilt = interpolate(frame, [TETE - 2, TETE + 14], [0, 1], ease);
	const watch = useSoft(DIX - 4, true);
	const progress = interpolate(frame, [DIX, DIX + 30], [0, 1], clamp);
	const count = Math.max(0, Math.ceil(10 - progress * 10));
	const gasp = frame >= GASPS ? Math.exp(-((frame - GASPS) % 40) / 4) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[REP + 1, STIM + 1, BASC + 1, DIX + 1, RESP2 + 1, GASPS + 1]} shakes={[STIM + 2]}>
				<Head kicker="Reconnaître" kAt={POUR} title="Il ne *répond* pas ?" tAt={REP - 4} />
				<Stage y={LAY.stageY} h={560} at={POUR + 2} bumps={[STIM, RESP2]}>
					{/* patient allongé (vu de dessus) */}
					<div style={{position: 'absolute', left: 40, top: 70, transform: `translateX(${shake}px) rotate(${shake * 0.3}deg)`}}>
						<Patient size={320} breath={gasp * 0.8} mood="calme" eyesClosed={1} pale={0.4} />
						{frame >= STIM - 2 && frame < STIM + 26 ? (
							<svg width={320} height={448} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								{[110, 290].map((x) => (
									<ellipse key={x} cx={x} cy={222} rx={40} ry={30} fill={LPI.paper} stroke={N} strokeWidth={7} />
								))}
							</svg>
						) : null}
					</div>
					<div style={{position: 'absolute', left: 40, top: 20}}>
						<Pill at={REP} size={34}>
							✗ ne répond pas
						</Pill>
					</div>
					{frame < BASC - 4 ? (
						<Bubble at={PARLE - 2} x={420} y={90} size={42}>
							Vous m'entendez ?
						</Bubble>
					) : null}
					{frame >= BASC - 4 ? (
						<div style={{position: 'absolute', left: 500, top: 0, opacity: Math.min(1, tiltIn * 1.5), transform: `scale(${0.6 + 0.4 * tiltIn})`, transformOrigin: 'center'}}>
							<HeadTilt tilt={tilt} size={280} />
						</div>
					) : null}
					{frame >= DIX - 4 ? (
						<div style={{position: 'absolute', left: 610, top: 340, opacity: Math.min(1, watch * 1.5), transform: `scale(${0.6 + 0.4 * watch})`, transformOrigin: 'center'}}>
							<Stopwatch progress={progress} count={count} size={200} label="secondes" />
						</div>
					) : null}
					{frame >= REG - 2 ? (
						<div style={{position: 'absolute', left: 420, top: 282}}>
							<Pill at={REG - 2} size={28} color={LPI.sky}>
								regarder · écouter · sentir
							</Pill>
						</div>
					) : null}
					{frame >= RESP2 - 2 ? (
						<div style={{position: 'absolute', left: 40, top: 500}}>
							<Pill at={RESP2 - 2} size={34}>
								✗ ne respire pas
							</Pill>
						</div>
					) : null}
				</Stage>
				<TermSlam index={0} at={GASPS} term="Gasps" meaning="respirations rares et bruyantes, inefficaces" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= GASPS} />
				<div style={{position: 'absolute', left: 72, top: 1200, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
					<CheckChip at={BASC} label="tête basculée en arrière" size={40} />
					<CheckChip at={DIX} label="10 secondes maximum" size={40} />
				</div>
			</Camera>
			<Sfx name="pop" at={REP} volume={0.1} />
			<Sfx name="pop" at={PARLE - 2} volume={0.09} />
			<Sfx name="hop" at={STIM} volume={0.08} />
			<Sfx name="whoosh" at={BASC - 4} volume={0.06} />
			<Sfx name="tick" at={DIX} volume={0.08} />
			<Sfx name="pop" at={RESP2 - 2} volume={0.1} />
			<Sfx name="buzz" at={GASPS} volume={0.05} dur={14} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · ALERTER ═══════════════════════════════ */
export const Alerter: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUT = at('alerter', 'tout');
	const AL = at('alerter', 'alerte');
	const Q15 = at('alerter', '15');
	const Q112 = at('alerter', '112');
	const DEF = at('alerter', 'défibrillateur');
	const phone = useSoft(TOUT, true);
	const digits = frame >= Q15 ? '15' : frame >= Q15 - 5 ? '1' : '';
	const ring = interpolate(frame, [Q15 + 6, Q15 + 12], [0, 1], clamp);
	const aed = useSoft(DEF - 6, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AL + 1, Q15 + 1, Q112 + 1, DEF + 1]} shakes={[Q15 + 2]}>
				<Head kicker="Alerter" kAt={TOUT} title="Appelle le *15* !" tAt={AL - 2} />
				<Stage y={LAY.stageY} h={540} at={TOUT + 2} bumps={[Q15, DEF]}>
					<div style={{position: 'absolute', left: 80, top: 40, opacity: Math.min(1, phone * 1.5), transform: `translateY(${(1 - phone) * 80}px)`}}>
						<Phone digits={digits} ring={ring} size={250} />
					</div>
					<div style={{position: 'absolute', left: 90, top: 480}}>
						<Pill at={Q112} size={34} color={LPI.blue}>
							ou le 112
						</Pill>
					</div>
					{frame >= DEF - 6 ? (
						<div style={{position: 'absolute', left: 560, top: 70, opacity: Math.min(1, aed * 1.5), transform: `translateX(${(1 - aed) * 300}px) rotate(${(1 - aed) * 12}deg)`}}>
							<Aed msg="DAE" size={290} />
							<div style={{width: 290, marginTop: 14, textAlign: 'center', fontFamily: FONT.title, fontWeight: 800, fontSize: 28, color: N, lineHeight: 1.15}}>
								défibrillateur
								<br />
								<span style={{color: LPI.blue}}>automatisé externe</span>
							</div>
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={Q15} label="appeler le 15 (ou le 112)" size={44} />
					<CheckChip at={DEF} label="faire chercher un défibrillateur (DAE)" size={44} />
				</div>
			</Camera>
			<Sfx name="tick" at={Q15 - 5} volume={0.08} />
			<Sfx name="tick" at={Q15} volume={0.08} />
			<Sfx name="ding" at={Q15 + 8} volume={0.08} />
			<Sfx name="pop" at={Q112} volume={0.09} />
			<Sfx name="whoosh" at={DEF - 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · MASSER ═══════════════════════════════ */
export const Masser: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const PUIS = at('masser', 'puis');
	const MASSE = at('masser', 'masse');
	const CENTRE = at('masser', 'centre');
	const BRAS = at('masser', 'bras');
	const TENDUS = at('masser', 'tendus');
	const ENF = at('masser', 'enfonce');
	const CINQ = at('masser', '5');
	const CM = at('masser', 'centimètres');
	const CENT = at('masser', '100');
	const C120 = at('masser', '120');
	const STAY = at('masser', 'staying');
	const press = compress(frame, ENF);
	const arms = frame < BRAS - 4 ? 0 : spring({frame: frame - (BRAS - 4), fps, config: {damping: 14, stiffness: 140}});
	const target = interpolate(frame, [CENTRE - 2, CENTRE + 8], [0, 1], clamp);
	const gauge = useSoft(CINQ - 4, true);
	const rate = useSoft(CENT - 4, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[MASSE + 1, CENTRE + 1, TENDUS + 1, CINQ + 1, CENT + 1, STAY + 1]} shakes={[STAY + 2]}>
				<Head kicker="Masser" kAt={PUIS} title="On *masse* !" tAt={MASSE - 2} />
				<Stage y={LAY.stageY} h={600} at={PUIS + 2} bumps={[CENTRE, STAY]}>
					<div style={{position: 'absolute', left: 120, top: 70}}>
						<Patient size={360} breath={-press * 0.6} mood="calme" eyesClosed={1} pale={0.4} />
						<svg width={360} height={504} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{target > 0 ? (
								<g opacity={target * (arms > 0.8 ? 0.4 : 1)}>
									<circle cx={206} cy={296} r={70 + 6 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={7} strokeDasharray="14 10" strokeDashoffset={frame * 2} />
									<path d="M206 256 V336 M166 296 H246" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" />
								</g>
							) : null}
							<CprHands press={press} on={arms} />
						</svg>
					</div>
					{frame >= CINQ - 4 ? (
						<div style={{position: 'absolute', left: 740, top: 150, opacity: Math.min(1, gauge * 1.5), transform: `scale(${0.6 + 0.4 * gauge})`}}>
							<DepthGauge press={press} height={300} />
						</div>
					) : null}
					{frame >= CENT - 4 ? (
						<div style={{position: 'absolute', left: 540, top: 34, opacity: Math.min(1, rate * 1.5), transform: `scale(${0.6 + 0.4 * rate})`, transformOrigin: 'left top'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px 10px 12px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW}}>
								<div style={{width: 46, height: 46, borderRadius: 23, background: LPI.pink, transform: `scale(${1 + 0.3 * press})`}} />
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>100–120</span>
								<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 30, color: LPI.blue}}>/min</span>
							</div>
						</div>
					) : null}
					{/* notes de musique : le rythme de Staying Alive */}
					{frame >= STAY - 2
						? [0, 1, 2, 3].map((i) => {
								const t = ((frame - STAY + i * 12) % 48) / 48;
								return (
									<div key={i} style={{position: 'absolute', left: 560 + i * 70, top: 420 - t * 260, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: i % 2 ? LPI.pink : LPI.blue, opacity: Math.sin(t * Math.PI), transform: `rotate(${Math.sin(frame / 5 + i) * 14}deg)`}}>
										♪
									</div>
								);
							})
						: null}
				</Stage>
				<Stamp at={STAY} x={680} y={LAY.stageY + 560} text="♪ Staying Alive ♪" size={52} rot={-6} />
				<div style={{position: 'absolute', left: 72, top: 1070, display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 22, rowGap: 16, justifyContent: 'start'}}>
					<CheckChip at={CENTRE} label="centre de la poitrine" size={40} />
					<CheckChip at={TENDUS} label="bras tendus" size={40} />
					<CheckChip at={CM} label="5 à 6 cm" size={40} />
					<CheckChip at={C120} label="100 à 120 / min" size={40} />
				</div>
			</Camera>
			<Sfx name="whoosh" at={BRAS - 4} volume={0.07} />
			{Array.from({length: 14}, (_, i) => (
				<Sfx key={i} name="tick" at={ENF + i * 16} volume={0.05} />
			))}
			<Sfx name="pop" at={CENTRE} volume={0.1} />
			<Sfx name="pop" at={CINQ} volume={0.1} />
			<Sfx name="pop" at={CENT} volume={0.1} />
			<Sfx name="stamp" at={STAY} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · LA RCP : 30 / 2 ═══════════════════════════════ */
export const Rcp: React.FC = () => {
	const frame = useCurrentFrame();
	const CEST = at('rcp', "c'est");
	const RCP = at('rcp', 'rcp');
	const REA = at('rcp', 'réanimation');
	const T30 = at('rcp', '30');
	const D2 = at('rcp', '2');
	const INS = at('rcp', 'insufflations');
	const ARRETE = at('rcp', "s'arrête");
	const SEC = at('rcp', 'secours');
	const filled = Math.round(interpolate(frame, [T30, D2 - 2], [0, 30], clamp));
	const breath = interpolate(frame, [D2, D2 + 10, D2 + 18, D2 + 28, D2 + 36], [0, 1, 0, 1, 0], clamp);
	const loop = useSoft(ARRETE - 4, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[RCP + 1, T30 + 1, D2 + 1, ARRETE + 1, SEC + 1]} shakes={[T30 + 2]}>
				<Head kicker="Réanimation" kAt={CEST} title="La *RCP*" tAt={RCP - 2} />
				<div style={{position: 'absolute', left: 72, top: 420, display: 'flex', alignItems: 'center', gap: 16}}>
					<Pill at={RCP} size={50} color={LPI.blue}>
						RCP
					</Pill>
					{frame >= REA - 2 ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: LPI.blue}}>=</span> : null}
					{frame >= REA ? (
						<Enter at={REA} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: N, lineHeight: 1.1, display: 'block'}}>
								réanimation
								<br />
								<span style={{color: LPI.blue}}>cardio-pulmonaire</span>
							</span>
						</Enter>
					) : null}
				</div>
				<Stage y={560} h={520} at={CEST + 2} bumps={[T30, D2]}>
					{/* 30 compressions */}
					<div style={{position: 'absolute', left: 40, top: 30, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{height: 210, display: 'flex', alignItems: 'center'}}>
							<BigNum at={T30} size={200}>
								30
							</BigNum>
						</div>
						{frame >= T30 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.blue}}>compressions</div> : null}
						<div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 26px)', gap: 8, marginTop: 18, opacity: frame >= T30 - 2 ? 1 : 0}}>
							{Array.from({length: 30}, (_, i) => (
								<div key={i} style={{width: 26, height: 26, borderRadius: 13, background: i < filled ? LPI.pink : LPI.paper, border: `4px solid ${i < filled ? N : alpha(N, 0.25)}`, boxSizing: 'border-box'}} />
							))}
						</div>
					</div>
					{frame >= D2 - 3 ? <div style={{position: 'absolute', left: 430, top: 70, fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: alpha(N, 0.3)}}>+</div> : null}
					{/* 2 insufflations */}
					<div style={{position: 'absolute', left: 520, top: 30, width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{height: 210, display: 'flex', alignItems: 'center'}}>
							<BigNum at={D2} size={200}>
								2
							</BigNum>
						</div>
						{frame >= INS - 2 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.blue}}>insufflations</div> : null}
						{frame >= D2 ? (
							<div style={{marginTop: 4}}>
								<Lungs breath={breath} inspiring={breath > 0.05} q={(frame % 20) / 20} size={170} />
							</div>
						) : null}
					</div>
				</Stage>
				{/* on recommence, sans s'arrêter */}
				{frame >= ARRETE - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 1110, display: 'flex', alignItems: 'center', gap: 20, opacity: Math.min(1, loop * 1.5)}}>
						<svg width={90} height={90} viewBox="0 0 100 100" style={{transform: `rotate(${frame * 6}deg)`}}>
							<path d="M80 50 A30 30 0 1 1 64 24" fill="none" stroke={LPI.blue} strokeWidth={12} strokeLinecap="round" />
							<path d="M58 10 L68 26 L50 32" fill="none" stroke={LPI.blue} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>on ne s'arrête pas</span>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1230}}>
					<CheckChip at={SEC - 2} label="jusqu'à l'arrivée des secours" size={42} />
				</div>
			</Camera>
			<Sfx name="pop" at={RCP} volume={0.1} />
			<Sfx name="impact" at={T30} volume={0.1} />
			<Sfx name="drumroll" at={T30 + 2} volume={0.05} dur={22} />
			<Sfx name="impact" at={D2} volume={0.1} />
			<Sfx name="whoosh" at={ARRETE - 4} volume={0.07} />
			<Sfx name="ding" at={SEC} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · LE DÉFIBRILLATEUR ═══════════════════════════════ */
export const Dae: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('dae', 'dès');
	const DEF = at('dae', 'défibrillateur');
	const ARR = at('dae', 'arrive');
	const ALL = at('dae', "l'allume");
	const VOIX = at('dae', 'voix');
	const ANA = at('dae', 'analyse');
	const BES = at('dae', 'besoin');
	const CHOC = at('dae', 'choc');
	const ARRT = at('dae', 'arrêter');
	const PEND = at('dae', 'pendant');
	const PERS = at('dae', 'personne');
	const aed = useSoft(ARR - 6, true);
	const pads = interpolate(frame, [VOIX - 2, VOIX + 10], [0, 1], ease);
	const SHOCK = CHOC + 2;
	const rhythm = (t: number): Rhythm => (t < SHOCK ? 'fv' : t < SHOCK + 3 ? 'shock' : t < ARRT + 6 ? 'flat' : 'sinus');
	const msg = frame >= PEND ? 'Ne touchez pas !' : frame >= SHOCK + 3 ? 'Choc délivré' : frame >= BES ? 'Choc conseillé' : frame >= ANA ? 'Analyse…' : frame >= VOIX ? 'Collez les électrodes' : frame >= ALL ? 'Allumé' : '';
	const jolt = frame >= SHOCK && frame < SHOCK + 10 ? Math.sin((frame - SHOCK) * 2.2) * 14 * Math.exp(-(frame - SHOCK) / 4) : 0;
	const mon = useSoft(ANA - 4, true);
	const zone = interpolate(frame, [PEND - 2, PEND + 8], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ARR + 1, VOIX + 1, ANA + 1, SHOCK + 1, PEND + 1]} shakes={[SHOCK + 1]}>
				<Head kicker="Défibriller" kAt={DES} title="Le *défibrillateur*" tAt={DEF - 2} size={84} />
				<Stage y={LAY.stageY} h={600} at={DES + 2} bumps={[ARR, SHOCK]}>
					<div style={{position: 'absolute', left: 40, top: 60, transform: `translateY(${jolt}px)`}}>
						<Patient size={330} breath={0} mood="calme" eyesClosed={1} pale={frame >= ARRT + 6 ? 0.15 : 0.4} />
						<svg width={330} height={462} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<Pad x={150} y={262} rot={-10} on={pads} />
							<Pad x={272} y={372} rot={20} on={interpolate(frame, [VOIX + 4, VOIX + 16], [0, 1], ease)} />
							{zone > 0 ? <ellipse cx={200} cy={300} rx={250} ry={300} fill="none" stroke={LPI.pink} strokeWidth={10} strokeDasharray="22 14" strokeDashoffset={frame * 3} opacity={zone} /> : null}
						</svg>
					</div>
					{/* câbles électrodes → DAE */}
					{pads > 0 ? (
						<svg width={936} height={600} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<path d={`M${40 + 150 * 0.825} ${60 + 262 * 0.825} C300 160 520 120 640 180`} fill="none" stroke={N} strokeWidth={6} pathLength={1} strokeDasharray={`${pads} 1`} />
							<path d={`M${40 + 272 * 0.825} ${60 + 372 * 0.825} C380 380 560 300 650 260`} fill="none" stroke={N} strokeWidth={6} pathLength={1} strokeDasharray={`${pads} 1`} />
						</svg>
					) : null}
					{frame >= ARR - 6 ? (
						<div style={{position: 'absolute', left: 610, top: 30, opacity: Math.min(1, aed * 1.5), transform: `translateX(${(1 - aed) * 300}px)`}}>
							<Aed msg={msg} ready={frame >= BES && frame < SHOCK ? 1 : 0} press={interpolate(frame, [SHOCK - 3, SHOCK, SHOCK + 4], [0, 1, 0], clamp)} size={280} />
						</div>
					) : null}
					{frame >= ANA - 4 ? (
						<div style={{position: 'absolute', left: 470, top: 400, opacity: Math.min(1, mon * 1.5), transform: `scale(${0.6 + 0.4 * mon})`, transformOrigin: 'left top'}}>
							<EcgMonitor rhythm={rhythm} width={440} height={170} readout={frame >= ARRT + 6 ? '♥' : 'FV'} alert={frame < ARRT + 6 ? 1 : 0} />
						</div>
					) : null}
				</Stage>
				<Stamp at={SHOCK} x={560} y={660} text="Choc !" size={72} rot={-8} />
				<Stamp at={PEND} x={540} y={1110} text="Personne ne touche !" size={56} rot={-4} />
				<div style={{position: 'absolute', left: 72, top: 1190, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
					<CheckChip at={VOIX} label="on suit sa voix" size={40} />
					<CheckChip at={ANA} label="il analyse, choc si besoin" size={40} />
				</div>
			</Camera>
			<Flash at={SHOCK} color={LPI.sky} max={0.9} />
			<Sfx name="whoosh" at={ARR - 6} volume={0.07} />
			<Sfx name="ding" at={ALL} volume={0.07} />
			<Sfx name="pop" at={VOIX} volume={0.09} />
			<Sfx name="tick" at={ANA} volume={0.07} />
			<Sfx name="buzz" at={BES} volume={0.06} dur={16} />
			<Sfx name="impact" at={SHOCK} volume={0.14} />
			<Sfx name="heartbeat" at={ARRT + 6} volume={0.1} />
			<Sfx name="stamp" at={PEND} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Arrêt *cardiaque*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'compte') + 16}
		rows={[
			[at('outro', 'répond'), 'alert', 'Ne répond pas', 'et ne respire pas (ou gasps)'],
			[at('outro', 'cardiaque'), 'empty', 'Arrêt cardiaque', 'le cœur ne pompe plus'],
			[at('outro', '15'), 'device', 'Alerter : le 15', 'et chercher un DAE'],
			[at('outro', 'masse'), 'squeeze', 'Masser', '100 – 120/min · 5 – 6 cm'],
			[at('outro', 'défibrille'), 'check', 'Défibriller', 'suivre la voix du DAE'],
		]}
	/>
);
