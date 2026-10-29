// Scènes de « La fréquence cardiaque » : une notion = une scène, chaque mouvement part d'un mot de la voix.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {beatSchedule, EcgTrace, lastBeat} from '../../brand/cardio';
import {CheckChip, Stamp, Sticker, Strike, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Sign, SignKind} from '../../brand/learn';
import {Burst, Camera, Confetti, LiveBackground, Odometer, Stage, TermSlam} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {Heart} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Kicker, Title, useSoft} from '../../brand/ui';
import {
	CauseChip,
	CrossedThumb,
	FeverIcon,
	MedalIcon,
	MoonIcon,
	PainIcon,
	PressFingers,
	PulseWave,
	RADIAL,
	RunIcon,
	Stopwatch,
	StressIcon,
	Wrist,
} from './art';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);

/** Mise en page commune (1080 × 1920, interface TikTok : rien d'important au-dessus de 150 ni sous 1480). */
export const LAY = {kickerY: 236, titleY: 282, stageY: 440, stageH: 540, slotY: 1010, chipsY: 1250};
const SLOT = (i = 0) => ({x: 72, y: LAY.slotY + i * 175, w: 936});
const slamY = LAY.stageY + LAY.stageH / 2;

export const FC_ZONES: Zone[] = [
	{name: 'bradycardie', range: '< 60 bpm', tone: 'low', w: 1, lo: 30, hi: 60},
	{name: 'normale', range: '60 – 100 bpm', tone: 'norm', w: 1.15, lo: 60, hi: 100},
	{name: 'tachycardie', range: '≥ 100 bpm', tone: 'high', w: 1, lo: 100, hi: 150},
];

const Head: React.FC<{kicker: string; kAt: number; title: string; tAt: number; size?: number}> = ({kicker, kAt, title, tAt, size = 92}) => (
	<>
		<div style={{position: 'absolute', left: 72, top: LAY.kickerY}}>
			<Kicker at={kAt}>{kicker}</Kicker>
		</div>
		<div style={{position: 'absolute', left: 72, top: LAY.titleY, width: 936}}>
			<Title at={tAt} text={title} size={size} stagger={3} />
		</div>
	</>
);

const Unit: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 56, color = LPI.blue}) => (
	<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: size, color, marginLeft: 12}}>{children}</span>
);

/** Battements sonores (très bas) + pulsation. */
const Beats: React.FC<{beats: number[]; from: number; volume?: number}> = ({beats, from, volume = 0.08}) => (
	<>
		{beats
			.filter((b) => b >= from)
			.map((b) => (
				<Sfx key={b} name="heartbeat" at={b} volume={volume} />
			))}
	</>
);

/** Cœur qui bat, avec une petite secousse quand il « s'emballe ». */
const BeatingHeart: React.FC<{beats: number[]; size: number; shake?: number}> = ({beats, size, shake = 0}) => {
	const frame = useCurrentFrame();
	const {pulse} = lastBeat(beats, frame);
	return (
		<div style={{transform: `rotate(${Math.sin(frame / 2.2) * 4 * shake}deg) translateX(${Math.sin(frame / 1.7) * 6 * shake}px)`}}>
			<Heart size={size} beat={pulse} />
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const Q = at('intro', 'quoi');
	const FC = at('intro', 'fréquence');
	const COMMENT = at('intro', 'comment');
	const SANS = at('intro', 'sans');
	const beats = beatSchedule([[0, 25]], 6, 400);
	const heart = spring({frame: frame - 2, fps: 30, config: {damping: 10, stiffness: 160, mass: 0.8}});
	const qp = usePop(Q);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q + 1, FC + 1, COMMENT + 1, SANS + 1]} shakes={[Q + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
					<Title at={0} text="C'est quoi la" size={74} stagger={3} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
					<Title at={FC} text={'*fréquence*\n*cardiaque* ?'} size={128} stagger={4} />
				</div>
				<div style={{position: 'absolute', left: 0, top: 960, opacity: Math.min(1, heart * 1.5)}}>
					<EcgTrace beats={beats} width={1080} height={150} amp={70} id="hook" color={alpha(LPI.blue, 0.8)} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: 540 - 210,
						top: 640,
						transform: `scale(${0.4 + 0.6 * heart})`,
					}}
				>
					<BeatingHeart beats={beats} size={420} />
				</div>
				{/* gros « ? » qui surgit sur « quoi » */}
				{frame >= Q ? (
					<div
						style={{
							position: 'absolute',
							left: 770,
							top: 600,
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
				<Burst at={Q} x={855} y={685} r={200} n={12} />
				<Sticker at={COMMENT} x={540} y={1160} rot={-4}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							padding: '14px 34px 14px 18px',
							borderRadius: 999,
							background: LPI.blue,
							color: LPI.paper,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 46,
							whiteSpace: 'nowrap',
						}}
					>
						<div style={{width: 70, height: 70, borderRadius: 35, background: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<svg width={50} height={50} viewBox="0 0 100 100">
								<rect x="22" y="8" width="24" height="76" rx="12" fill={LPI.sky} stroke={N} strokeWidth="7" />
								<rect x="54" y="2" width="24" height="82" rx="12" fill={LPI.sky} stroke={N} strokeWidth="7" />
							</svg>
						</div>
						Comment la prendre ?
					</div>
				</Sticker>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center'}}>
					<CheckChip at={SANS} label="Sans te tromper" size={44} />
				</div>
			</Camera>
			<Beats beats={beats} from={6} volume={0.07} />
			<Sfx name="pop" at={Q} volume={0.12} />
			<Sfx name="whoosh" at={FC} volume={0.06} />
			<Sfx name="pop" at={COMMENT} volume={0.1} />
			<Sfx name="ding" at={SANS + 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
const LetterRow: React.FC<{letter: string; word: string; lAt: number; wAt: number; y: number}> = ({letter, word, lAt, wAt, y}) => {
	const frame = useCurrentFrame();
	const l = usePop(lAt);
	const w = usePop(wAt);
	if (frame < lAt) return null;
	return (
		<div style={{position: 'absolute', left: 120, top: y, display: 'flex', alignItems: 'center', gap: 28}}>
			<div
				style={{
					width: 104,
					height: 104,
					borderRadius: 52,
					background: frame >= wAt ? LPI.blue : LPI.sky,
					color: frame >= wAt ? LPI.paper : N,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 66,
					transform: `scale(${l}) rotate(${(1 - l) * -30}deg)`,
					boxShadow: SHADOW,
				}}
			>
				{letter}
			</div>
			<div
				style={{
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 72,
					color: N,
					opacity: Math.min(1, w * 2),
					transform: `translateX(${(1 - w) * -60}px)`,
					clipPath: `inset(0 ${(1 - Math.min(1, w)) * 100}% 0 0)`,
				}}
			>
				<span style={{color: LPI.blue}}>{word[0]}</span>
				{word.slice(1)}
			</div>
		</div>
	);
};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const F = at('def', 'fréquence');
	const NB = at('def', 'nombre');
	const B1 = at('def', 'battements');
	const MIN = at('def', 'minute');
	const BPM = at('def', 'bpm');
	const B2 = at('def', 'battements', 2);
	const PAR = at('def', 'par');
	const M2 = at('def', 'minute', 2);
	const LAPSE = 24;
	const beats = beatSchedule(
		[
			[0, 25],
			[MIN, 4],
			[MIN + LAPSE, 25],
		],
		NB - 4,
		600,
	);
	const counted = beats.filter((b) => b >= B1 - 2 && b <= Math.min(frame, MIN)).length;
	const count = frame < MIN ? counted : interpolate(frame, [MIN, MIN + LAPSE], [counted, 72], ease);
	const progress = interpolate(frame, [MIN, MIN + LAPSE], [0, 1], ease);
	const watch = useSoft(NB, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[F + 1, B1 + 1, MIN + 1, MIN + LAPSE, BPM + 1, B2 + 1, M2 + 1]} shakes={[BPM + 2]}>
				<Head kicker="Définition" kAt={F} title="Fréquence *cardiaque*" tAt={F + 2} size={88} />
				<Stage y={LAY.stageY} h={LAY.stageH - 120} at={F + 4} bumps={[MIN + LAPSE]}>
					<div style={{position: 'absolute', left: 36, top: 60}}>
						<BeatingHeart beats={beats} size={300} />
					</div>
					{/* +1 à chaque battement compté */}
					{beats
						.filter((b) => b >= B1 - 2 && b < MIN && frame >= b && frame < b + 22)
						.map((b) => {
							const t = (frame - b) / 22;
							return (
								<div
									key={b}
									style={{
										position: 'absolute',
										left: 270,
										top: 70 - t * 70,
										opacity: 1 - t,
										fontFamily: FONT.title,
										fontWeight: 900,
										fontSize: 54,
										color: LPI.blue,
									}}
								>
									+1
								</div>
							);
						})}
					<div style={{position: 'absolute', left: 420, top: 20, opacity: Math.min(1, watch * 1.5), transform: `scale(${0.6 + 0.4 * watch})`}}>
						<Stopwatch progress={progress} count={count} size={340} />
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
				{/* « bpm » = battements par minute */}
				<LetterRow letter="B" word="battements" lAt={BPM} wAt={B2} y={960} />
				<LetterRow letter="P" word="par" lAt={BPM + 3} wAt={PAR} y={1086} />
				<LetterRow letter="M" word="minute" lAt={BPM + 6} wAt={M2} y={1212} />
			</Camera>
			<Beats beats={beats.filter((b) => b < MIN || b > MIN + LAPSE)} from={NB - 4} />
			{beats
				.filter((b) => b >= MIN && b <= MIN + LAPSE)
				.map((b) => (
					<Sfx key={b} name="tick" at={b} volume={0.08} />
				))}
			<Sfx name="ding" at={MIN + LAPSE} volume={0.09} />
			{[BPM, BPM + 3, BPM + 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE (pouls radial) ═══════════════════════════════ */
export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const PM = at('mesure', 'mesurer');
	const PR = at('mesure', 'prend');
	const POIG = at('mesure', 'poignet');
	const RAD = at('mesure', 'radial');
	const IDX = at('mesure', "l'index");
	const MAJ = at('mesure', 'majeur');
	const JAM = at('mesure', 'jamais');
	const POUCE = at('mesure', 'pouce');
	const PROPRE = at('mesure', 'propre');
	const COMPTE = at('mesure', 'compte');
	const MIN = at('mesure', 'minute');
	const ENT = at('mesure', 'entière');
	const beats = beatSchedule([[0, 25]], POIG, 800);
	const {pulse} = lastBeat(beats, frame);
	const arm = useSoft(PR - 4);
	const artery = interpolate(frame, [RAD + 20, RAD + 34], [0, 1], ease);
	const idx = interpolate(frame, [IDX - 2, IDX + 10], [0, 1], ease);
	const mid = interpolate(frame, [MAJ - 2, MAJ + 10], [0, 1], ease);
	const press = frame >= MAJ + 10 ? pulse : 0;
	const cross = interpolate(frame, [POUCE, POUCE + 10], [0, 1], clamp);
	const counted = beats.filter((b) => b >= COMPTE && b <= Math.min(frame, MIN)).length;
	const count = frame < MIN ? counted : interpolate(frame, [MIN, MIN + 22], [counted, 72], ease);
	const progress = frame < MIN ? interpolate(frame, [COMPTE, MIN], [0, 0.12], clamp) : interpolate(frame, [MIN, MIN + 22], [0.12, 1], ease);
	const watch = useSoft(COMPTE, true);
	const ox = 28;
	const oy = 110;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PR + 1, POIG + 1, RAD + 1, IDX + 1, MAJ + 1, POUCE + 1, COMPTE + 1, ENT + 1]} shakes={[POUCE + 2]}>
				<Head kicker="Mesure" kAt={PM} title="Prendre le *pouls*" tAt={PR} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={PM + 4} bumps={[RAD + 26, MAJ + 10]}>
					<div style={{position: 'absolute', left: ox, top: oy, opacity: Math.min(1, arm * 1.5), transform: `translateX(${(1 - arm) * -300}px)`}}>
						<Wrist artery={artery} pulse={frame >= RAD + 30 ? pulse : 0} glow={frame >= RAD + 30 ? 1 : 0} />
					</div>
					<div style={{position: 'absolute', left: ox + RADIAL.x - 100, top: oy + RADIAL.y - 400}}>
						<PressFingers index={idx} middle={mid} press={press} />
					</div>
					{frame >= POIG ? (
						<div style={{position: 'absolute', left: ox + 470, top: oy + 360}}>
							<Enter at={POIG} distance={20} bounce>
								<Tag label="poignet" />
							</Enter>
						</div>
					) : null}
					{frame >= IDX ? (
						<div style={{position: 'absolute', left: ox + RADIAL.x - 300, top: oy - 60}}>
							<Enter at={IDX} from="left" distance={30} bounce>
								<Tag label="index" tone={LPI.blue} />
							</Enter>
						</div>
					) : null}
					{frame >= MAJ ? (
						<div style={{position: 'absolute', left: ox + RADIAL.x + 70, top: oy - 60}}>
							<Enter at={MAJ} distance={30} bounce>
								<Tag label="majeur" tone={LPI.blue} />
							</Enter>
						</div>
					) : null}
				</Stage>
				<Sticker at={JAM} x={850} y={LAY.stageY + 110} rot={6}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px 12px 12px', borderRadius: 34, background: LPI.paper, border: `5px solid ${LPI.pink}`}}>
						<CrossedThumb cross={cross} size={110} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, lineHeight: 1.1}}>
							jamais
							<br />
							le pouce !
						</div>
					</div>
				</Sticker>
				{frame >= PROPRE ? (
					<div style={{position: 'absolute', left: 560, top: LAY.stageY + 250}}>
						<Enter at={PROPRE} distance={20} bounce>
							<div style={{padding: '12px 26px', borderRadius: 999, background: LPI.pink, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>
								il a son propre pouls !
							</div>
						</Enter>
					</div>
				) : null}
				<TermSlam
					index={0}
					at={RAD}
					term="Pouls radial"
					meaning="au poignet, côté pouce"
					sign="wave"
					slamY={slamY}
					slot={SLOT(0)}
					active={frame >= RAD && frame < COMPTE}
				/>
				{/* compter 1 minute entière */}
				<div style={{position: 'absolute', left: 72, top: 1196, opacity: Math.min(1, watch * 1.5), transform: `scale(${0.6 + 0.4 * watch})`, transformOrigin: 'left top'}}>
					<Stopwatch progress={progress} count={count} size={270} />
				</div>
				<div style={{position: 'absolute', left: 380, top: 1240}}>
					<CheckChip at={MIN} label="1 minute entière" size={42} />
				</div>
				{frame >= MIN + 22 ? (
					<div style={{position: 'absolute', left: 380, top: 1350}}>
						<Enter at={MIN + 22} from="left" distance={40} bounce>
							<div style={{display: 'flex', alignItems: 'baseline', fontFamily: FONT.title, fontWeight: 900, fontSize: 78, color: N}}>
								= 72<Unit>bpm</Unit>
							</div>
						</Enter>
					</div>
				) : null}
			</Camera>
			<Beats beats={beats} from={RAD + 30} volume={0.07} />
			<Sfx name="whoosh" at={PR - 4} volume={0.06} />
			<Sfx name="pop" at={IDX} volume={0.1} />
			<Sfx name="pop" at={MAJ} volume={0.1} />
			<Sfx name="buzz" at={POUCE} volume={0.06} />
			<Sfx name="pop" at={PROPRE} volume={0.1} />
			<Sfx name="ding" at={MIN + 22} volume={0.09} />
		</AbsoluteFill>
	);
};

const Tag: React.FC<{label: string; tone?: string}> = ({label, tone = N}) => (
	<div
		style={{
			padding: '8px 20px',
			borderRadius: 999,
			background: LPI.paper,
			border: `4px solid ${tone}`,
			fontFamily: FONT.title,
			fontWeight: 900,
			fontSize: 32,
			color: N,
			whiteSpace: 'nowrap',
			boxShadow: SHADOW,
		}}
	>
		{label}
	</div>
);

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
const BigNum: React.FC<{at: number; children: React.ReactNode; color?: string}> = ({at: t0, children, color = N}) => {
	const frame = useCurrentFrame();
	const t = frame - t0;
	if (t < 0) return null;
	const s = t < 5 ? interpolate(t, [0, 5], [2.2, 0.94], {easing: (v) => v * v}) : 1 - 0.06 * Math.exp(-(t - 5) / 3) * Math.cos((t - 5) * 0.9);
	return (
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 230, color, lineHeight: 1, transform: `scale(${s})`, opacity: interpolate(t, [0, 2], [0, 1], clamp)}}>
			{children}
		</div>
	);
};

export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const REPOS = at('norme', 'repos');
	const NORM = at('norme', 'normale');
	const S60 = at('norme', '60');
	const S100 = at('norme', '100');
	const BPM = at('norme', 'battements');
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S100 + 4, S100 + 24], [60, 72], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, REPOS + 1, NORM + 1, S60 + 1, S100 + 1]} shakes={[S60 + 2, S100 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420, display: 'flex', gap: 18}}>
					<CheckChip at={AD} label="adulte" size={40} />
					<CheckChip at={REPOS} label="au repos" size={40} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 560,
						width: 936,
						height: 330,
						borderRadius: 60,
						background: alpha(LPI.sky, 0.55),
						opacity: band,
						transform: `scaleX(${0.7 + 0.3 * band})`,
					}}
				/>
				<div style={{position: 'absolute', left: 72, top: 600, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24}}>
					<BigNum at={S60}>60</BigNum>
					{frame >= S100 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: LPI.blue}}>–</div> : null}
					<BigNum at={S100}>100</BigNum>
				</div>
				{frame >= BPM ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center'}}>
						<Enter at={BPM} distance={20}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>battements par minute</span>
						</Enter>
					</div>
				) : null}
				<Burst at={S60} x={380} y={720} r={220} n={10} />
				<Burst at={S100} x={720} y={720} r={240} n={12} />
				<NormScale zones={FC_ZONES} value={value} at={NORM + 4} markerAt={S100 + 4} y={1010} nameSize={30} rangeSize={26} />
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="pop" at={REPOS} volume={0.1} />
			<Sfx name="impact" at={S60} volume={0.1} />
			<Sfx name="impact" at={S100} volume={0.1} />
			<Sfx name="ding" at={S100 + 20} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TACHYCARDIE ═══════════════════════════════ */
const Monitor: React.FC<{beats: number[]; bpm: number; fast: number; id: string}> = ({beats, bpm, fast, id}) => {
	return (
		<>
			<div style={{position: 'absolute', left: 36, top: 50}}>
				<BeatingHeart beats={beats} size={290} shake={fast} />
			</div>
			<div style={{position: 'absolute', left: 400, top: 70, display: 'flex', alignItems: 'baseline'}}>
				<Odometer value={bpm} places={3} size={160} color={fast > 0.5 ? LPI.blue : N} />
				<Unit>bpm</Unit>
			</div>
			<div style={{position: 'absolute', left: 0, top: 330}}>
				<EcgTrace beats={beats} width={936} height={130} amp={58} id={id} />
			</div>
		</>
	);
};

export const Tachy: React.FC = () => {
	const frame = useCurrentFrame();
	const AU = at('tachy', 'au-dessus');
	const C100 = at('tachy', '100');
	const TA = at('tachy', 'tachycardie');
	const EMB = at('tachy', "s'emballe");
	const ARR = at('tachy', 'arrive');
	const EFF = at('tachy', "l'effort");
	const FIE = at('tachy', 'fièvre');
	const STR = at('tachy', 'stress');
	const DOU = at('tachy', 'douleur');
	const beats = beatSchedule(
		[
			[0, 25],
			[C100, 14],
			[EMB, 11],
		],
		-10,
		700,
	);
	const bpm = interpolate(frame, [C100 - 2, C100 + 16, EMB, EMB + 10], [72, 118, 118, 128], ease);
	const fast = interpolate(frame, [EMB - 2, EMB + 6], [0, 1], clamp);
	const fill = interpolate(frame, [C100, C100 + 20], [0, 1], clamp);
	const causes: [number, React.ReactNode, string][] = [
		[EFF, <RunIcon key="r" size={56} />, "l'effort"],
		[FIE, <FeverIcon key="f" size={56} />, 'la fièvre'],
		[STR, <StressIcon key="s" size={56} />, 'le stress'],
		[DOU, <PainIcon key="p" size={56} />, 'la douleur'],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AU + 1, C100 + 1, TA + 1, EMB + 1, EFF + 1, FIE + 1, STR + 1, DOU + 1]} shakes={[EMB + 2, EMB + 10]}>
				<Head kicker="Au-dessus de 100" kAt={AU} title="Trop *rapide*" tAt={AU + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={AU + 4} layers={[{color: PINK, level: fill}]} bumps={[EMB]}>
					<Monitor beats={beats} bpm={bpm} fast={fast} id="tachy" />
				</Stage>
				<TermSlam
					index={0}
					at={TA}
					term="Tachycardie"
					meaning={
						<>
							le cœur bat trop vite <Seuil>≥ 100 bpm</Seuil>
						</>
					}
					sign="up"
					slamY={slamY}
					slot={SLOT(0)}
					active={frame >= TA && frame < ARR}
				/>
				{frame >= ARR ? (
					<div style={{position: 'absolute', left: 80, top: 1186}}>
						<Enter at={ARR} distance={14}>
							<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', textTransform: 'uppercase', color: alpha(N, 0.65)}}>
								ça arrive avec…
							</span>
						</Enter>
					</div>
				) : null}
				{causes.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i % 2 === 0 ? 72 : 560, top: 1240 + Math.floor(i / 2) * 116}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			<Beats beats={beats} from={0} volume={0.07} />
			<Sfx name="impact" at={EMB} volume={0.1} />
			{causes.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · BRADYCARDIE ═══════════════════════════════ */
export const Brady: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('brady', 'dessous');
	const C60 = at('brady', '60');
	const BR = at('brady', 'bradycardie');
	const RAL = at('brady', 'ralentit');
	const SPO = at('brady', 'sportif');
	const SOM = at('brady', 'sommeil');
	const NORMAL = at('brady', 'normal');
	const beats = beatSchedule(
		[
			[0, 25],
			[C60, 40],
			[RAL, 54],
		],
		-6,
		700,
	);
	const bpm = interpolate(frame, [C60 - 2, C60 + 18, RAL, RAL + 14], [72, 55, 55, 48], ease);
	const fill = interpolate(frame, [C60, C60 + 22], [0, 1], clamp);
	const slow = interpolate(frame, [RAL, RAL + 12], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DES + 1, C60 + 1, BR + 1, SPO + 1, SOM + 1, NORMAL + 1]} shakes={[BR + 4]}>
				<Head kicker="En dessous de 60" kAt={DES} title="Trop *lent*" tAt={DES + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={DES + 4} layers={[{color: COLD, level: fill}]}>
					<Monitor beats={beats} bpm={bpm} fast={0} id="brady" />
					{slow > 0 ? (
						<div style={{position: 'absolute', left: 690, top: 250, opacity: slow, transform: `scale(${0.6 + 0.4 * slow})`}}>
							<div style={{padding: '10px 24px', borderRadius: 999, background: LPI.paper, border: `4px solid ${LPI.blue}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>
								ralenti…
							</div>
						</div>
					) : null}
				</Stage>
				<TermSlam
					index={0}
					at={BR}
					term="Bradycardie"
					meaning={
						<>
							le cœur bat trop lentement <Seuil>&lt; 60 bpm</Seuil>
						</>
					}
					sign="down"
					slamY={slamY}
					slot={SLOT(0)}
					active={frame >= BR && frame < SPO}
				/>
				<div style={{position: 'absolute', left: 72, top: 1220}}>
					<CauseChip at={SPO} icon={<MedalIcon size={56} />} label="un sportif" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1220}}>
					<CauseChip at={SOM} icon={<MoonIcon size={56} />} label="le sommeil" tone={LPI.sky} />
				</div>
				<Stamp at={NORMAL} x={540} y={1400} text="peut être normal ✓" color={LPI.blue} rot={-4} size={50} />
			</Camera>
			<Beats beats={beats} from={0} volume={0.08} />
			<Sfx name="pop" at={SPO} volume={0.11} />
			<Sfx name="pop" at={SOM} volume={0.11} />
			<Sfx name="stamp" at={NORMAL} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · RYTHME ET FORCE ═══════════════════════════════ */
const WaveRow: React.FC<{at: number; label: string; amp: number; period: number; hi: boolean; y: number}> = ({at: t0, label, amp, period, hi, y}) => {
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
				height: 120,
				borderRadius: 34,
				background: LPI.paper,
				border: `5px solid ${hi ? LPI.pink : LPI.sky}`,
				boxShadow: hi ? `0 18px 44px ${alpha(LPI.pink, 0.35)}` : SHADOW,
				display: 'flex',
				alignItems: 'center',
				gap: 20,
				padding: '0 24px',
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 120}px) scale(${hi ? 1.02 : 1})`,
				overflow: 'hidden',
			}}
		>
			<div style={{width: 250, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: hi ? LPI.blue : N, whiteSpace: 'nowrap'}}>{label}</div>
			<PulseWave amp={amp} period={period} width={620} height={104} on={1} color={hi ? LPI.pink : LPI.blue} />
		</div>
	);
};

export const Rythme: React.FC = () => {
	const frame = useCurrentFrame();
	const MAIS = at('rythme', 'mais');
	const CH = at('rythme', 'chiffre');
	const IRR = at('rythme', 'irréguliers');
	const ARY = at('rythme', 'arythmie');
	const FAI = at('rythme', 'faible');
	const RAP = at('rythme', 'rapide');
	const FIL = at('rythme', 'filant');
	const beats = beatSchedule(
		[
			[0, 25],
			[IRR - 4, [13, 34, 17, 40, 12, 28, 21, 36]],
		],
		-8,
		700,
	);
	const num = useSoft(MAIS);
	const away = interpolate(frame, [IRR - 4, IRR + 10], [0, 1], ease);
	const lane = useSoft(IRR - 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CH + 1, IRR + 1, ARY + 1, FAI + 1, FIL + 1]} shakes={[CH + 3]}>
				<Head kicker="Rythme et force" kAt={MAIS} title="Pas que le *chiffre* !" tAt={MAIS + 2} size={84} />
				{/* le chiffre, barré, puis rangé dans le coin */}
				<div
					style={{
						position: 'absolute',
						left: interpolate(away, [0, 1], [300, 760]),
						top: interpolate(away, [0, 1], [470, 420]),
						transform: `scale(${(0.5 + 0.5 * num) * interpolate(away, [0, 1], [1, 0.42])})`,
						transformOrigin: 'left top',
						display: 'flex',
						alignItems: 'baseline',
						opacity: Math.min(1, num * 1.5),
					}}
				>
					<span style={{position: 'relative', fontFamily: FONT.title, fontWeight: 900, fontSize: 220, color: N, lineHeight: 1}}>
						72
						{/* trait bien droit, au milieu des chiffres (police 220, interligne 1 : milieu ≈ 105 px) */}
						<div style={{position: 'absolute', left: -18, right: -18, top: 105 - 60, height: 120}}>
							<Strike at={CH} width={330} rot={-2} thick={24} />
						</div>
					</span>
					<Unit size={70}>bpm</Unit>
				</div>
				{/* rythme irrégulier : le tracé */}
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 560,
						width: 936,
						height: 200,
						borderRadius: 44,
						background: alpha(LPI.sky, 0.55),
						opacity: lane,
						transform: `scaleY(${0.5 + 0.5 * lane})`,
						overflow: 'hidden',
					}}
				>
					<div style={{position: 'absolute', left: 0, top: 30}}>
						<EcgTrace beats={beats} width={936} height={150} amp={62} id="rythme" />
					</div>
				</div>
				<WaveRow at={FAI - 4} label="bien frappé" amp={70} period={25} hi={false} y={790} />
				<WaveRow at={RAP - 2} label="filant" amp={22} period={11} hi={frame >= FIL} y={926} />
				<TermSlam index={0} at={ARY} term="Arythmie" meaning="battements irréguliers" sign="wave" slamY={760} slot={{x: 72, y: 1080, w: 936}} active={frame >= ARY && frame < FIL} />
				<TermSlam index={1} at={FIL} term="Pouls filant" meaning="faible et rapide" sign="alert" slamY={760} slot={{x: 72, y: 1255, w: 936}} active={frame >= FIL} />
			</Camera>
			<Beats beats={beats} from={IRR - 4} volume={0.08} />
			<Sfx name="buzz" at={CH} volume={0.06} />
			<Sfx name="whoosh" at={FAI - 4} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
/** Une ligne de la fiche récap : elle s'allume sur son mot, se coche quand la suivante arrive. */
const RecapRow: React.FC<{at: number; next: number; sign: SignKind; label: React.ReactNode; sub?: React.ReactNode; y: number}> = ({at: t0, next, sign, label, sub, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - t0, fps, config: {damping: 13, stiffness: 200, mass: 0.8}});
	if (frame < t0) return null;
	const current = frame < next;
	const sweep = interpolate(frame, [t0, t0 + 12], [0, 1], ease);
	const check = spring({frame: frame - next, fps, config: {damping: 9, stiffness: 240}});
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				height: 112,
				borderRadius: 32,
				overflow: 'hidden',
				background: LPI.paper,
				border: `5px solid ${current ? LPI.blue : LPI.sky}`,
				boxShadow: current ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW,
				opacity: Math.min(1, s * 1.6),
				transform: `translateX(${(1 - s) * 140}px) rotate(${(1 - s) * 3}deg) scale(${current ? 1.02 : 1})`,
			}}
		>
			<div style={{position: 'absolute', inset: 0, width: `${sweep * 100}%`, background: alpha(LPI.sky, current ? 0.6 : 0.3)}} />
			<div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px'}}>
				<div style={{position: 'relative'}}>
					<Sign kind={sign} size={74} />
					{frame >= next ? (
						<div style={{position: 'absolute', right: -14, top: -12, transform: `scale(${check})`}}>
							<Sign kind="check" size={38} />
						</div>
					) : null}
				</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: current ? LPI.blue : N, whiteSpace: 'nowrap'}}>{label}</div>
				{sub ? <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: alpha(N, 0.65), whiteSpace: 'nowrap'}}>{sub}</div> : null}
			</div>
		</div>
	);
};

export const Outro: React.FC = () => {
	const R = at('outro', 'récap');
	const BAT = at('outro', 'battements');
	const RAD = at('outro', 'radial');
	const NORM = at('outro', 'normale');
	const TA = at('outro', 'tachycardie');
	const BR = at('outro', 'bradycardie');
	const RY = at('outro', 'rythme');
	const END = at('outro', 'pouls', 2);
	const DONE = END + 10;
	const rows: [number, SignKind, React.ReactNode, React.ReactNode][] = [
		[BAT, 'wave', 'bpm', 'battements par minute'],
		[RAD, 'device', 'Pouls radial', '2 doigts · 1 minute'],
		[NORM, 'check', '60 – 100 bpm', 'normale (adulte, repos)'],
		[TA, 'up', 'Tachycardie', '≥ 100 bpm'],
		[BR, 'down', 'Bradycardie', '< 60 bpm'],
		[RY, 'alert', 'Rythme + force', 'arythmie · pouls filant'],
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[R + 1, ...rows.map(([t]) => t + 1), DONE]} shakes={[DONE + 1]} strength={0.03}>
				<Head kicker="Petit récap" kAt={R - 4} title="Fréquence *cardiaque*" tAt={R} size={88} />
				{rows.map(([t, sign, label, sub], i) => (
					<RecapRow key={i} at={t} next={i < rows.length - 1 ? rows[i + 1][0] : DONE} sign={sign} label={label} sub={sub} y={430 + i * 128} />
				))}
				<Stamp at={DONE} x={540} y={1300} text="Pro du pouls !" size={80} rot={-6} />
				<Confetti at={DONE} x={540} y={900} n={60} />
			</Camera>
			{rows.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
			<Sfx name="stamp" at={DONE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LOGO ═══════════════════════════════ */
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 6, fps, config: {damping: 11, stiffness: 160, mass: 0.8}});
	return (
		<AbsoluteFill>
			<LiveBackground deco={false} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
				<Img
					src={staticFile('brand/logo/logo-principal.webp')}
					style={{width: 800, height: 'auto', opacity: Math.min(1, s * 1.5), transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`}}
				/>
			</AbsoluteFill>
			<Burst at={8} x={540} y={840} r={360} n={14} />
		</AbsoluteFill>
	);
};

