// Scènes de « La fréquence respiratoire » : une notion = une scène, chaque mouvement part d'un mot de la voix.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {PressFingers, RADIAL, Wrist} from '../../brand/body';
import {breathAt, BreathingLungs, BreathSegments, BreathTrace, Chest, cyclesSince} from '../../brand/breath';
import {BigNum, CauseChip, Head, LAY, RecapScene, SLAM_Y, Stopwatch, termSlot, Unit} from '../../brand/episode';
import {AnxietyIcon, EyeIcon, FeverIcon, PainIcon, PillIcon, RunIcon} from '../../brand/icons';
import {CheckChip, Stamp, Sticker, Strike, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Sign} from '../../brand/learn';
import {Burst, Camera, LiveBackground, Odometer, Stage, TermSlam} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {LungsPicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);
/** respiration calme : 16 cycles/min ≈ un cycle toutes les 112 frames ; un peu plus vite à l'écran pour l'œil */
const CALM = 84;

export const FR_ZONES: Zone[] = [
	{name: 'bradypnée', range: '< 12 cycles/min', tone: 'low', w: 1, lo: 4, hi: 12},
	{name: 'normale', range: '12 – 20 cycles/min', tone: 'norm', w: 1.15, lo: 12, hi: 20},
	{name: 'tachypnée', range: '> 20 cycles/min', tone: 'high', w: 1, lo: 20, hi: 36},
];

/** Pastille de phase : inspiration ↑ / expiration ↓, allumée selon la respiration en cours. */
const PhasePill: React.FC<{at: number; label: string; up: boolean; on: boolean}> = ({at: t0, label, up, on}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 14,
				padding: '10px 26px 10px 10px',
				borderRadius: 999,
				background: on ? LPI.blue : LPI.paper,
				border: `4px solid ${on ? LPI.blue : LPI.sky}`,
				boxShadow: on ? `0 14px 34px ${alpha(LPI.blue, 0.3)}` : SHADOW,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: 40,
				color: on ? LPI.paper : N,
				whiteSpace: 'nowrap',
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 60}px) scale(${(0.7 + 0.3 * p) * (on ? 1.05 : 1)})`,
				transformOrigin: 'left center',
			}}
		>
			<Sign kind={up ? 'up' : 'down'} size={56} />
			{label}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const Q = at('intro', 'quoi');
	const FR = at('intro', 'fréquence');
	const COMMENT = at('intro', 'comment');
	const SANS = at('intro', 'sans');
	const seg: BreathSegments = [[0, CALM]];
	const pop = usePop(2);
	const qp = usePop(Q);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q + 1, FR + 1, COMMENT + 1, SANS + 1]} shakes={[Q + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
					<Title at={0} text="C'est quoi la" size={74} stagger={3} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
					<Title at={FR} text={'*fréquence*\n*respiratoire* ?'} size={112} stagger={4} />
				</div>
				<div style={{position: 'absolute', left: 0, top: 1010, opacity: Math.min(1, pop * 1.5)}}>
					<BreathTrace segments={seg} width={1080} height={120} amp={40} color={alpha(LPI.blue, 0.8)} />
				</div>
				<div style={{position: 'absolute', left: 540 - 200, top: 620, transform: `scale(${0.4 + 0.6 * pop})`}}>
					<BreathingLungs segments={seg} size={400} />
				</div>
				{frame >= Q ? (
					<div
						style={{
							position: 'absolute',
							left: 790,
							top: 590,
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
				<Burst at={Q} x={875} y={675} r={200} n={12} />
				<Sticker at={COMMENT} x={540} y={1200} rot={-4}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 34px 14px 18px', borderRadius: 999, background: LPI.blue, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, whiteSpace: 'nowrap'}}>
						<div style={{width: 70, height: 70, borderRadius: 35, background: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<LungsPicto size={52} />
						</div>
						Comment la compter ?
					</div>
				</Sticker>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center'}}>
					<CheckChip at={SANS} label="Sans qu'il s'en rende compte" size={40} />
				</div>
			</Camera>
			<Sfx name="pop" at={Q} volume={0.12} />
			<Sfx name="whoosh" at={FR} volume={0.06} />
			<Sfx name="pop" at={COMMENT} volume={0.1} />
			<Sfx name="ding" at={SANS + 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const F = at('def', 'fréquence');
	const NB = at('def', 'nombre');
	const MIN = at('def', 'minute');
	const INS = at('def', 'inspiration');
	const PLUS = at('def', 'plus');
	const EXP = at('def', 'expiration');
	const CYC = at('def', 'cycle');
	const CYCS = at('def', 'cycles');
	const LAPSE = 24;
	const seg: BreathSegments = [[0, CALM]];
	const b = breathAt(frame, seg);
	const counted = cyclesSince(Math.min(frame, MIN), NB, seg);
	const count = frame < MIN ? counted : interpolate(frame, [MIN, MIN + LAPSE], [counted, 16], ease);
	const progress = interpolate(frame, [MIN, MIN + LAPSE], [0, 1], ease);
	const watch = useSoft(NB, true);
	const eq = usePop(CYC);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[F + 1, MIN + 1, MIN + LAPSE, INS + 1, EXP + 1, CYC + 1, CYCS + 1]} shakes={[CYC + 2]}>
				<Head kicker="Définition" kAt={F} title="Fréquence *respiratoire*" tAt={F + 2} size={74} />
				<Stage y={LAY.stageY} h={420} at={F + 4} bumps={[MIN + LAPSE, CYC]}>
					<div style={{position: 'absolute', left: 30, top: 70}}>
						<BreathingLungs segments={seg} size={300} />
					</div>
					<div style={{position: 'absolute', left: 420, top: 20, opacity: Math.min(1, watch * 1.5), transform: `scale(${0.6 + 0.4 * watch})`}}>
						<Stopwatch progress={progress} count={count} size={340} label="respirations" />
					</div>
					{frame >= MIN + LAPSE ? (
						<div style={{position: 'absolute', left: 770, top: 150}}>
							<Enter at={MIN + LAPSE} from="left" distance={30} bounce>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, lineHeight: 1.1}}>
									en
									<br />
									<span style={{color: LPI.blue, fontSize: 56}}>1 min</span>
								</div>
							</Enter>
						</div>
					) : null}
				</Stage>
				<Burst at={MIN + LAPSE} x={72 + 420 + 170} y={LAY.stageY + 20 + 170} r={240} n={14} />
				{/* 1 cycle = inspiration + expiration */}
				<div style={{position: 'absolute', left: 72, top: 900, display: 'flex', alignItems: 'center', gap: 16}}>
					<PhasePill at={INS} label="inspiration" up on={frame >= INS && b.inspiring} />
					{frame >= PLUS ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: LPI.blue}}>+</div> : null}
					<PhasePill at={EXP} label="expiration" up={false} on={frame >= EXP && !b.inspiring} />
				</div>
				{frame >= CYC ? (
					<div
						style={{
							position: 'absolute',
							left: 72,
							top: 1040,
							display: 'flex',
							alignItems: 'center',
							gap: 20,
							opacity: Math.min(1, eq * 2),
							transform: `scale(${0.6 + 0.4 * eq})`,
							transformOrigin: 'left center',
						}}
					>
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.blue}}>=</span>
						<span style={{padding: '10px 34px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, boxShadow: SHADOW}}>1 cycle</span>
					</div>
				) : null}
				{frame >= CYCS ? (
					<div style={{position: 'absolute', left: 72, top: 1190}}>
						<Enter at={CYCS} from="left" distance={40} bounce>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 6, fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N}}>
								cycles<span style={{color: LPI.blue}}>/</span>min
							</div>
						</Enter>
					</div>
				) : null}
			</Camera>
			<Sfx name="tick" at={MIN} volume={0.08} />
			<Sfx name="ding" at={MIN + LAPSE} volume={0.09} />
			<Sfx name="pop" at={INS} volume={0.1} />
			<Sfx name="pop" at={EXP} volume={0.1} />
			<Sfx name="impact" at={CYC} volume={0.08} />
			<Sfx name="pop" at={CYCS} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE ═══════════════════════════════ */
export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const PC = at('mesure', 'compter');
	const TH = at('mesure', 'thorax');
	const SOUL = at('mesure', 'soulève');
	const RED = at('mesure', 'redescend');
	const CYC = at('mesure', 'cycle');
	const COMPTE = at('mesure', 'compte');
	const MIN = at('mesure', 'minute');
	const AST = at('mesure', "l'astuce");
	const DISC = at('mesure', 'discrètement');
	const SEMB = at('mesure', 'semblant');
	const CHANGE = at('mesure', 'change');
	// la cage se soulève sur « soulève », redescend sur « redescend »
	const seg: BreathSegments = [[0, CALM]];
	const b = breathAt(frame, seg);
	const lift = frame < RED + 20 ? interpolate(frame, [SOUL - 4, SOUL + 12, RED, RED + 16], [0, 1, 1, 0], ease) : b.breath;
	const chest = useSoft(TH - 4);
	const counted = cyclesSince(Math.min(frame, MIN), COMPTE, seg);
	const count = frame < MIN ? counted : interpolate(frame, [MIN, MIN + 22], [counted, 16], ease);
	const progress = frame < MIN ? interpolate(frame, [COMPTE, MIN], [0, 0.12], clamp) : interpolate(frame, [MIN, MIN + 22], [0.12, 1], ease);
	const watch = useSoft(COMPTE, true);
	const labels = interpolate(frame, [AST - 6, AST + 4], [1, 0], clamp);
	const trick = useSoft(AST, true);
	const fingers = interpolate(frame, [SEMB - 2, SEMB + 10], [0, 1], ease);
	const cyc = usePop(CYC);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TH + 1, SOUL + 1, RED + 1, CYC + 1, COMPTE + 1, AST + 1, DISC + 1, SEMB + 1, CHANGE + 1]} shakes={[CYC + 2]}>
				<Head kicker="Mesure" kAt={PC - 4} title="Compter les *cycles*" tAt={PC} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={PC + 2} bumps={[CYC, AST]}>
					<div style={{position: 'absolute', left: 30, top: 40, opacity: Math.min(1, chest * 1.5), transform: `translateY(${(1 - chest) * 60}px)`}}>
						<Chest breath={lift} size={400} />
					</div>
					{/* il se soulève / il redescend */}
					<div style={{position: 'absolute', left: 470, top: 90, display: 'flex', flexDirection: 'column', gap: 22, opacity: labels}}>
						<PhasePill at={SOUL} label="il se soulève" up on={frame >= SOUL && frame < RED} />
						<PhasePill at={RED} label="il redescend" up={false} on={frame >= RED} />
					</div>
					{frame >= CYC && labels > 0 ? (
						<div style={{position: 'absolute', left: 520, top: 330, opacity: labels, transform: `scale(${0.6 + 0.4 * cyc})`}}>
							<span style={{padding: '10px 30px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N, boxShadow: SHADOW}}>= 1 cycle</span>
						</div>
					) : null}
					{/* l'astuce : faire semblant de prendre le pouls en regardant le thorax */}
					{frame >= AST ? (
						<div style={{position: 'absolute', left: 440, top: 40, width: 480, height: 460, opacity: Math.min(1, trick * 1.5), transform: `scale(${0.7 + 0.3 * trick})`, transformOrigin: 'center'}}>
							<div style={{position: 'absolute', left: 150, top: 0}}>
								<EyeIcon size={110} />
							</div>
							<svg width={480} height={200} style={{position: 'absolute', left: 0, top: 30, overflow: 'visible'}}>
								<path d="M150 55 C90 50 40 80 -10 120" fill="none" stroke={LPI.blue} strokeWidth={8} strokeDasharray="14 14" strokeDashoffset={-frame * 2} strokeLinecap="round" />
								<path d="M-10 120 L12 96 M-10 120 L22 124" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
							</svg>
							<div style={{position: 'absolute', left: 0, top: 220, transform: 'scale(0.52)', transformOrigin: 'top left'}}>
								<Wrist artery={1} pulse={0} glow={0} />
								<div style={{position: 'absolute', left: RADIAL.x - 100, top: RADIAL.y - 400}}>
									<PressFingers index={fingers} middle={fingers} press={0} />
								</div>
							</div>
						</div>
					) : null}
				</Stage>
				<Stamp at={DISC} x={740} y={LAY.stageY + 30} text="discrètement" color={LPI.blue} size={46} rot={-6} />
				{frame >= SEMB ? (
					<div style={{position: 'absolute', left: 500, top: LAY.stageY + 470}}>
						<Enter at={SEMB} distance={20} bounce>
							<div style={{padding: '10px 24px', borderRadius: 999, background: LPI.paper, border: `4px solid ${LPI.blue}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>
								« je prends ton pouls… »
							</div>
						</Enter>
					</div>
				) : null}
				{/* compter une minute entière */}
				<div style={{position: 'absolute', left: 72, top: 1020, opacity: Math.min(1, watch * 1.5), transform: `scale(${0.6 + 0.4 * watch})`, transformOrigin: 'left top'}}>
					<Stopwatch progress={progress} count={count} size={270} label="cycles" />
				</div>
				<div style={{position: 'absolute', left: 380, top: 1060}}>
					<CheckChip at={MIN} label="1 minute entière" size={42} />
				</div>
				{frame >= MIN + 22 ? (
					<div style={{position: 'absolute', left: 380, top: 1166}}>
						<Enter at={MIN + 22} from="left" distance={40} bounce>
							<div style={{display: 'flex', alignItems: 'baseline', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>
								= 16<Unit size={44}>cycles/min</Unit>
							</div>
						</Enter>
					</div>
				) : null}
				{frame >= CHANGE ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1340, display: 'flex', justifyContent: 'center'}}>
						<Enter at={CHANGE} distance={24} bounce>
							<div style={{padding: '14px 30px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>
								sinon, il respire différemment !
							</div>
						</Enter>
					</div>
				) : null}
			</Camera>
			<Sfx name="whoosh" at={TH - 4} volume={0.06} />
			<Sfx name="pop" at={SOUL} volume={0.1} />
			<Sfx name="pop" at={RED} volume={0.1} />
			<Sfx name="impact" at={CYC} volume={0.08} />
			<Sfx name="ding" at={MIN + 22} volume={0.09} />
			<Sfx name="pop" at={AST} volume={0.1} />
			<Sfx name="stamp" at={DISC} volume={0.1} />
			<Sfx name="pop" at={SEMB} volume={0.1} />
			<Sfx name="buzz" at={CHANGE} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const REPOS = at('norme', 'repos');
	const NORM = at('norme', 'normale');
	const S12 = at('norme', '12');
	const S20 = at('norme', '20');
	const CYC = at('norme', 'cycles');
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S20 + 4, S20 + 24], [12, 16], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, REPOS + 1, NORM + 1, S12 + 1, S20 + 1]} shakes={[S12 + 2, S20 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420, display: 'flex', gap: 18}}>
					<CheckChip at={AD} label="adulte" size={40} />
					<CheckChip at={REPOS} label="au repos" size={40} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 560, width: 936, height: 330, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 600, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24}}>
					<BigNum at={S12}>12</BigNum>
					{frame >= S20 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: LPI.blue}}>–</div> : null}
					<BigNum at={S20}>20</BigNum>
				</div>
				{frame >= CYC ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center'}}>
						<Enter at={CYC} distance={20}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>cycles par minute</span>
						</Enter>
					</div>
				) : null}
				<Burst at={S12} x={400} y={720} r={220} n={10} />
				<Burst at={S20} x={700} y={720} r={240} n={12} />
				<NormScale zones={FR_ZONES} value={value} at={NORM + 4} markerAt={S20 + 4} y={1010} nameSize={30} rangeSize={24} />
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="pop" at={REPOS} volume={0.1} />
			<Sfx name="impact" at={S12} volume={0.1} />
			<Sfx name="impact" at={S20} volume={0.1} />
			<Sfx name="ding" at={S20 + 20} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TACHYPNÉE / 5 · BRADYPNÉE ═══════════════════════════════ */
/** Poumons + fréquence + tracé respiratoire sur le socle. */
const BreathMonitor: React.FC<{seg: BreathSegments; rate: number; fast: number; amp?: number}> = ({seg, rate, fast, amp = 1}) => {
	const frame = useCurrentFrame();
	return (
		<>
			<div style={{position: 'absolute', left: 30, top: 40, transform: `rotate(${Math.sin(frame / 2.5) * 2.5 * fast}deg)`}}>
				<BreathingLungs segments={seg} size={290} amp={amp} />
			</div>
			<div style={{position: 'absolute', left: 380, top: 70, display: 'flex', alignItems: 'baseline'}}>
				<Odometer value={rate} places={2} size={160} color={fast > 0.5 ? LPI.blue : N} />
				<Unit size={46}>cycles/min</Unit>
			</div>
			<div style={{position: 'absolute', left: 0, top: 330}}>
				<BreathTrace segments={seg} width={936} height={130} amp={46 * amp} />
			</div>
		</>
	);
};

export const Tachy: React.FC = () => {
	const frame = useCurrentFrame();
	const AU = at('tachy', 'au-dessus');
	const C20 = at('tachy', '20');
	const TA = at('tachy', 'tachypnée');
	const ACC = at('tachy', "s'accélère");
	const ARR = at('tachy', 'arrive');
	const causes: [number, React.ReactNode, string][] = [
		[at('tachy', "l'effort"), <RunIcon key="r" size={56} />, "l'effort"],
		[at('tachy', 'fièvre'), <FeverIcon key="f" size={56} />, 'la fièvre'],
		[at('tachy', "l'anxiété"), <AnxietyIcon key="a" size={56} />, "l'anxiété"],
		[at('tachy', 'douleur'), <PainIcon key="p" size={56} />, 'la douleur'],
	];
	const seg: BreathSegments = [
		[0, CALM],
		[C20, 50],
		[ACC, 32],
	];
	const rate = interpolate(frame, [C20 - 2, C20 + 16, ACC, ACC + 12], [16, 24, 24, 28], ease);
	const fast = interpolate(frame, [ACC - 2, ACC + 6], [0, 1], clamp);
	const fill = interpolate(frame, [C20, C20 + 20], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AU + 1, C20 + 1, TA + 1, ACC + 1, ...causes.map(([t]) => t + 1)]} shakes={[ACC + 2]}>
				<Head kicker="Au-dessus de 20" kAt={AU} title="Trop *rapide*" tAt={AU + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={AU + 4} layers={[{color: PINK, level: fill}]} bumps={[ACC]}>
					<BreathMonitor seg={seg} rate={rate} fast={fast} />
				</Stage>
				<TermSlam
					index={0}
					at={TA}
					term="Tachypnée"
					meaning={
						<>
							respiration trop rapide <Seuil>&gt; 20 cycles/min</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= TA && frame < ARR}
				/>
				{frame >= ARR ? (
					<div style={{position: 'absolute', left: 80, top: 1186}}>
						<Enter at={ARR} distance={14}>
							<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', textTransform: 'uppercase', color: alpha(N, 0.65)}}>ça arrive avec…</span>
						</Enter>
					</div>
				) : null}
				{causes.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i % 2 === 0 ? 72 : 560, top: 1240 + Math.floor(i / 2) * 116}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			<Sfx name="impact" at={ACC} volume={0.1} />
			{causes.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

export const Brady: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('brady', 'dessous');
	const C12 = at('brady', '12');
	const BR = at('brady', 'bradypnée');
	const RAL = at('brady', 'ralentit');
	const ATT = at('brady', 'attention');
	const MED = at('brady', 'médicaments');
	const MOR = at('brady', 'morphine');
	const seg: BreathSegments = [
		[0, CALM],
		[C12, 130],
		[RAL, 170],
	];
	const rate = interpolate(frame, [C12 - 2, C12 + 18, RAL, RAL + 14], [16, 10, 10, 8], ease);
	const fill = interpolate(frame, [C12, C12 + 22], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DES + 1, C12 + 1, BR + 1, ATT + 1, MED + 1, MOR + 1]} shakes={[ATT + 2]}>
				<Head kicker="En dessous de 12" kAt={DES} title="Trop *lent*" tAt={DES + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={DES + 4} layers={[{color: COLD, level: fill}]}>
					<BreathMonitor seg={seg} rate={rate} fast={0} amp={interpolate(frame, [RAL, RAL + 20], [1, 0.8], clamp)} />
				</Stage>
				<TermSlam
					index={0}
					at={BR}
					term="Bradypnée"
					meaning={
						<>
							respiration trop lente <Seuil>&lt; 12 cycles/min</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= BR && frame < ATT}
				/>
				<Stamp at={ATT} x={790} y={LAY.stageY + 430} text="Attention !" size={56} rot={-6} />
				<div style={{position: 'absolute', left: 72, top: 1260}}>
					<CauseChip at={MED} icon={<PillIcon size={56} />} label="médicaments qui endorment" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1376}}>
					<CauseChip at={MOR} icon={<PillIcon size={56} />} label="ex. : la morphine" tone={LPI.pink} />
				</div>
			</Camera>
			<Sfx name="stamp" at={ATT} volume={0.1} />
			<Sfx name="pop" at={MED} volume={0.11} />
			<Sfx name="pop" at={MOR} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · AMPLITUDE, RYTHME, DYSPNÉE ═══════════════════════════════ */
const Lane: React.FC<{at: number; label: string; seg: BreathSegments; amp: number; hi: boolean; y: number}> = ({at: t0, label, seg, amp, hi, y}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				height: 116,
				borderRadius: 34,
				background: LPI.paper,
				border: `5px solid ${hi ? LPI.blue : LPI.sky}`,
				boxShadow: hi ? `0 18px 44px ${alpha(LPI.blue, 0.3)}` : SHADOW,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '0 22px',
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 120}px) scale(${hi ? 1.02 : 1})`,
				overflow: 'hidden',
			}}
		>
			<div style={{width: 280, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: hi ? LPI.blue : N, whiteSpace: 'nowrap'}}>{label}</div>
			<BreathTrace segments={seg} width={600} height={100} amp={amp} stroke={7} />
		</div>
	);
};

export const Obs: React.FC = () => {
	const frame = useCurrentFrame();
	const MAIS = at('obs', 'mais');
	const CH = at('obs', 'chiffre');
	const AMP = at('obs', "l'amplitude");
	const AMPLE = at('obs', 'ample');
	const SUP = at('obs', 'superficielle');
	const RY = at('obs', 'rythme');
	const REG = at('obs', 'régulier');
	const PAS = at('obs', 'pas', 2);
	const DY = at('obs', 'dyspnée');
	const num = useSoft(MAIS);
	const away = interpolate(frame, [AMP - 4, AMP + 10], [0, 1], ease);
	const irregular: BreathSegments = [
		[0, 60],
		[RY + 10, 36],
		[RY + 40, 90],
		[RY + 100, 40],
		[RY + 130, 110],
		[RY + 230, 50],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CH + 1, AMP + 1, AMPLE + 1, SUP + 1, RY + 1, DY + 1]} shakes={[CH + 3]}>
				<Head kicker="Amplitude et rythme" kAt={MAIS} title="Pas que le *chiffre* !" tAt={MAIS + 2} size={84} />
				{/* le chiffre, barré d'un trait droit, puis rangé dans le coin */}
				<div
					style={{
						position: 'absolute',
						left: interpolate(away, [0, 1], [190, 700]),
						top: interpolate(away, [0, 1], [470, 410]),
						transform: `scale(${(0.5 + 0.5 * num) * interpolate(away, [0, 1], [1, 0.4])})`,
						transformOrigin: 'left top',
						display: 'flex',
						alignItems: 'baseline',
						opacity: Math.min(1, num * 1.5),
					}}
				>
					<span style={{position: 'relative', fontFamily: FONT.title, fontWeight: 900, fontSize: 220, color: N, lineHeight: 1}}>
						16
						<div style={{position: 'absolute', left: -18, right: -18, top: 105 - 60, height: 120}}>
							<Strike at={CH} width={330} rot={-2} thick={24} />
						</div>
					</span>
					<Unit size={64}>cycles/min</Unit>
				</div>
				<Lane at={AMPLE - 4} label="ample" seg={[[0, CALM]]} amp={40} hi={frame >= AMPLE && frame < SUP} y={560} />
				<Lane at={SUP - 4} label="superficielle" seg={[[0, 44]]} amp={11} hi={frame >= SUP && frame < RY} y={692} />
				<Lane at={RY - 2} label={frame >= PAS ? 'irrégulier' : 'régulier ?'} seg={irregular} amp={32} hi={frame >= REG && frame < DY} y={824} />
				<TermSlam index={0} at={DY} term="Dyspnée" meaning="difficulté à respirer" sign="alert" slamY={760} slot={{x: 72, y: 1010, w: 936}} active={frame >= DY} />
			</Camera>
			<Sfx name="buzz" at={CH} volume={0.06} />
			<Sfx name="whoosh" at={AMPLE - 4} volume={0.06} />
			<Sfx name="whoosh" at={SUP - 4} volume={0.06} />
			<Sfx name="whoosh" at={RY - 2} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Fréquence *respiratoire*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'dyspnée') + 16}
		stamp="Pro du souffle !"
		rows={[
			[at('outro', 'cycles'), 'wave', 'cycles/min', 'inspiration + expiration'],
			[at('outro', 'thorax'), 'device', 'Thorax · 1 minute', 'discrètement'],
			[at('outro', 'normale'), 'check', '12 – 20', 'normale (adulte, repos)'],
			[at('outro', 'tachypnée'), 'up', 'Tachypnée', '> 20 cycles/min'],
			[at('outro', 'bradypnée'), 'down', 'Bradypnée', '< 12 cycles/min'],
			[at('outro', 'dyspnée'), 'alert', 'Dyspnée', 'du mal à respirer'],
		]}
	/>
);
