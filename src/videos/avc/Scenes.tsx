// Scènes de « C'est quoi un AVC » : accroche-choc (toutes les 4 minutes, 2 millions de neurones par minute),
// définition (A·V·C qui se déplie, cerveau dont une zone s'éteint), ischémique / hémorragique (gros plans
// d'artère), VITE joué par le patient, le 15 et l'heure, imagerie + traitements, facteurs de risque, récap.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArteryZoom, Brain} from '../../brand/brain';
import {Phone, ScanMonitor, WallClock} from '../../brand/devices';
import {CauseChip, Head, LAY, Pill, RecapScene, SLAM_Y, termSlot} from '../../brand/episode';
import {ArrhythmiaIcon, CholesterolIcon, CigaretteIcon, DiabetesIcon, HypertensionIcon} from '../../brand/icons';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Sign} from '../../brand/learn';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {Patient, patientPoint} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Kicker, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const easeIn = {...clamp, easing: Easing.in(Easing.cubic)};
const N = LPI.navy;
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number) => 0.5 - 0.5 * Math.cos(frame / 22);
/** 1900000 → « 1 900 000 » (espaces fines) */
const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Bulle « ? » rose qui tourne doucement. */
const Question: React.FC<{at: number; x: number; y: number; size?: number}> = ({at: t0, x, y, size = 170}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
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
				transform: `scale(${p}) rotate(${Math.sin(frame / 6) * 8}deg)`,
			}}
		>
			?
		</div>
	);
};

/** Flash rose plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, 0.55, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, 0)} 30%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Rangée de 10 pastilles : `n` remplies (8 sur 10…). */
const TenDots: React.FC<{at: number; n: number; color: string; label: string}> = ({at: t0, n, color, label}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
			{Array.from({length: 10}, (_, i) => {
				const p = usePopSafe(frame, t0 + i * 2);
				const on = i < n;
				return (
					<div
						key={i}
						style={{
							width: 52,
							height: 52,
							borderRadius: 26,
							boxSizing: 'border-box',
							background: on ? color : LPI.paper,
							border: `5px solid ${on ? N : alpha(N, 0.3)}`,
							transform: `scale(${p})`,
						}}
					/>
				);
			})}
			{frame >= t0 + 22 ? (
				<Enter at={t0 + 22} from="left" distance={20}>
					<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, marginLeft: 10, whiteSpace: 'nowrap'}}>{label}</span>
				</Enter>
			) : null}
		</div>
	);
};
/** ressort sans hook (utilisable dans une boucle) */
const usePopSafe = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const Q4 = at('intro', '4');
	const FR = at('intro', 'france');
	const QQ = at('intro', "quelqu'un");
	const AVC = at('intro', 'avc');
	const ET = at('intro', 'et');
	const MIN = at('intro', 'minute');
	const CERV = at('intro', 'cerveau');
	const DEUX = at('intro', '2');
	const NEUR = at('intro', 'neurones');
	const ALORS = at('intro', 'alors');
	const QUOI = at('intro', 'quoi');
	const AVC2 = at('intro', 'avc', 2);
	const COMMENT = at('intro', 'comment');
	// phase A : « 4 minutes » ; B : patient + cerveau ; C : la question
	const ring = spring({frame: frame + 8, fps, config: {damping: 13, stiffness: 160}});
	const outB = interpolate(frame, [ET - 4, ET + 6], [1, 0], clamp);
	const sweep = (frame % 30) / 30;
	const toCorner = interpolate(frame, [QQ - 4, QQ + 10], [0, 1], ease);
	const patientIn = spring({frame: frame - (QQ - 2), fps, config: {damping: 12, stiffness: 170}});
	const droop = interpolate(frame, [AVC, AVC + 8], [0, 1], ease);
	const toLeft = interpolate(frame, [ET - 2, ET + 12], [0, 1], ease);
	const brainIn = spring({frame: frame - (ET + 2), fps, config: {damping: 13, stiffness: 150}});
	const dead = interpolate(frame, [DEUX - 4, NEUR + 18], [0, 0.85], ease);
	const count = interpolate(frame, [DEUX - 4, NEUR + 14], [0, 2000000], {...clamp, easing: Easing.out(Easing.cubic)});
	const outAB = interpolate(frame, [ALORS - 4, ALORS + 8], [0, 1], easeIn);
	const brainC = interpolate(frame, [ALORS, ALORS + 16], [0, 1], ease);
	const a = 1 - outAB;
	// cerveau : à droite en phase B, puis centré sous la question en phase C
	const bx = interpolate(brainC, [0, 1], [470, 260]);
	const by = interpolate(brainC, [0, 1], [610, 880]);
	const bs = interpolate(brainC, [0, 1], [520, 560]);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q4 + 1, FR + 1, AVC + 1, MIN + 1, DEUX + 1, NEUR + 1, QUOI + 1, AVC2 + 1]} shakes={[AVC + 2, NEUR + 2]} strength={0.05}>
				{/* ── A · toutes les 4 minutes ── */}
				{a > 0 ? (
					<div style={{opacity: a}}>
						<div
							style={{
								position: 'absolute',
								left: 540 - 270,
								top: 470,
								width: 540,
								height: 540,
								opacity: outB,
								transform: `translate(${toCorner * -270}px, ${toCorner * -250}px) scale(${(0.3 + 0.7 * ring) * (1 - 0.62 * toCorner)})`,
								transformOrigin: 'center',
							}}
						>
							<svg width={540} height={540} viewBox="-135 -135 270 270" style={{position: 'absolute', inset: 0}}>
								<circle r={120} fill={LPI.paper} stroke={N} strokeWidth={12} />
								<circle r={98} fill="none" stroke={alpha(LPI.pink, 0.95)} strokeWidth={22} strokeDasharray={`${sweep * 616} 616`} transform="rotate(-90)" strokeLinecap="round" />
								{Array.from({length: 12}, (_, i) => (
									<path key={i} d="M0 -118 V-106" transform={`rotate(${i * 30})`} stroke={N} strokeWidth={6} strokeLinecap="round" />
								))}
								<path d="M0 0 V-84" transform={`rotate(${sweep * 360})`} stroke={N} strokeWidth={8} strokeLinecap="round" />
							</svg>
							<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 250, color: N, lineHeight: 0.9, transform: `scale(${frame >= Q4 ? 1 + 0.25 * Math.exp(-(frame - Q4) / 4) : 1})`}}>4</div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.blue}}>minutes</div>
							</div>
						</div>
						<div style={{position: 'absolute', left: 72, top: 250, opacity: 1 - toCorner}}>
							<Title at={0} text="Toutes les…" size={96} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 1040, textAlign: 'center', opacity: 1 - toCorner}}>
							<Pill at={FR} size={54} color={LPI.blue}>
								en France
							</Pill>
						</div>
						{/* patient : quelqu'un fait un AVC */}
						{frame >= QQ - 2 ? (
							<div
								style={{
									position: 'absolute',
									left: interpolate(toLeft, [0, 1], [540 - 210, 40]),
									top: interpolate(toLeft, [0, 1], [560, 640]),
									transform: `scale(${(0.3 + 0.7 * patientIn) * interpolate(toLeft, [0, 1], [1, 0.8])}) rotate(${frame >= AVC ? Math.sin((frame - AVC) * 1.3) * 3 * Math.exp(-(frame - AVC) / 10) : 0}deg)`,
									transformOrigin: 'left top',
								}}
							>
								<Patient size={420} breath={idle(frame)} mood={frame >= AVC ? 'mal' : 'calme'} droop={droop} />
							</div>
						) : null}
						{frame >= AVC ? (
							<div style={{position: 'absolute', left: 720, top: 600, opacity: outB}}>
								<Stamp at={AVC} x={0} y={0} text="AVC" size={92} rot={-8} />
							</div>
						) : null}
						{/* chaque minute → près de 2 millions de neurones */}
						{frame >= MIN - 2 ? (
							<div style={{position: 'absolute', left: 560, top: 470}}>
								<Pill at={MIN - 2} size={44}>
									chaque minute
								</Pill>
							</div>
						) : null}
						{frame >= DEUX - 4 ? (
							<div style={{position: 'absolute', left: 0, right: 0, top: 1140, textAlign: 'center'}}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 132, color: N, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>
									<span style={{color: LPI.pink}}>−</span>
									{fmt(count)}
								</div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: LPI.blue, opacity: frame >= NEUR - 2 ? 1 : 0}}>neurones</div>
							</div>
						) : null}
					</div>
				) : null}
				{/* cerveau (phase B → C) */}
				{frame >= ET + 2 ? (
					<div style={{position: 'absolute', left: bx, top: by, transform: `scale(${0.3 + 0.7 * brainIn})`, transformOrigin: 'center'}}>
						<Brain size={bs} dead={dead * (1 - brainC * 0.6)} everywhere alert={interpolate(frame, [DEUX, DEUX + 6, ALORS, ALORS + 10], [0, 1, 1, 0], clamp)} flow={1} />
					</div>
				) : null}
				{/* ── C · la question ── */}
				{frame >= ALORS ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 250, width: 936}}>
							<Title at={ALORS + 2} text="C'est quoi" size={84} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 350, width: 936}}>
							<Title at={AVC2 - 2} text="un *AVC* ?" size={190} stagger={4} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 620, width: 936}}>
							<Title at={COMMENT} text="et comment le *reconnaître* ?" size={60} stagger={2} brush={false} />
						</div>
						<Question at={QUOI} x={830} y={830} size={160} />
					</>
				) : null}
				<Burst at={Q4} x={540} y={740} r={300} n={14} />
				<Burst at={AVC} x={540} y={900} r={320} n={16} />
				<Burst at={AVC2} x={420} y={470} r={260} n={14} />
			</Camera>
			<Flash at={AVC} />
			<Flash at={NEUR} />
			<Sfx name="impact" at={Q4} volume={0.12} />
			{Array.from({length: 6}, (_, i) => (
				<Sfx key={i} name="tick" at={4 + i * 10} volume={0.06} />
			))}
			<Sfx name="pop" at={FR} volume={0.1} />
			<Sfx name="whoosh" at={QQ - 4} volume={0.07} />
			<Sfx name="stamp" at={AVC} volume={0.12} />
			<Sfx name="heartbeat" at={ET} volume={0.1} />
			<Sfx name="drumroll" at={DEUX - 4} volume={0.06} dur={28} />
			<Sfx name="impact" at={NEUR} volume={0.1} />
			<Sfx name="whoosh" at={ALORS - 4} volume={0.07} />
			<Sfx name="pop" at={QUOI} volume={0.11} />
			<Sfx name="impact" at={AVC2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
const Letter: React.FC<{i: number; letter: string; color: string; word: string; wAt: number; sub?: string; sAt?: number; at0: number}> = ({i, letter, color, word, wAt, sub, sAt = 0, at0}) => {
	const frame = useCurrentFrame();
	const p = usePop(at0 + i * 3);
	const w = usePop(wAt);
	const lift = interpolate(frame, [wAt - 2, wAt + 8], [0, 1], ease);
	return (
		<div style={{position: 'absolute', left: 72 + i * 312, top: 300, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 190 - 60 * lift, lineHeight: 1, color, transform: `scale(${p})`, textShadow: `0 10px 0 ${alpha(N, 0.12)}`}}>{letter}</div>
			{frame >= wAt ? (
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, transform: `scale(${w})`, whiteSpace: 'nowrap'}}>{word}</div>
			) : null}
			{sub && frame >= sAt ? (
				<Enter at={sAt} distance={14}>
					<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: alpha(N, 0.7), whiteSpace: 'nowrap'}}>{sub}</div>
				</Enter>
			) : null}
		</div>
	);
};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const A0 = at('def', 'avc');
	const ACC = at('def', 'accident');
	const VASC = at('def', 'vasculaire');
	const CER = at('def', 'cérébral');
	const VAIS = at('def', 'vaisseaux');
	const CERV = at('def', 'cerveau');
	const ZONE = at('def', 'zone');
	const SANG = at('def', 'sang');
	const OXY = at('def', "d'oxygène");
	const NEUR = at('def', 'neurones');
	const MEUR = at('def', 'meurent');
	const brain = useSoft(A0 + 4);
	const zone = interpolate(frame, [ZONE - 2, ZONE + 10], [0, 0.45], clamp);
	const cut = interpolate(frame, [SANG - 4, SANG + 6], [0, 1], clamp);
	const isch = Math.max(zone, interpolate(frame, [SANG, OXY + 10], [0.45, 1], clamp) * (frame >= SANG ? 1 : 0));
	const dead = interpolate(frame, [NEUR - 2, MEUR + 16], [0, 1], ease);
	const o2 = interpolate(frame, [OXY - 2, OXY + 14], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ACC + 1, VASC + 1, CER + 1, ZONE + 1, SANG + 1, OXY + 1, MEUR + 1]} shakes={[MEUR + 2]}>
				<div style={{position: 'absolute', left: 72, top: LAY.kickerY}}>
					<Kicker at={A0}>Définition</Kicker>
				</div>
				<Letter i={0} letter="A" color={LPI.blue} word="Accident" wAt={ACC} at0={A0} />
				<Letter i={1} letter="V" color={LPI.pink} word="Vasculaire" wAt={VASC} sub="(vaisseaux sanguins)" sAt={VAIS} at0={A0} />
				<Letter i={2} letter="C" color={N} word="Cérébral" wAt={CER} sub="(du cerveau)" sAt={CERV} at0={A0} />
				<Stage y={640} h={520} at={A0 + 6} bumps={[ZONE, MEUR]}>
					<div style={{position: 'absolute', left: 188, top: 30, opacity: Math.min(1, brain * 1.5), transform: `scale(${0.7 + 0.3 * brain})`}}>
						<Brain size={560} cut={cut} ischemia={isch} dead={dead} />
					</div>
					{/* O₂ qui s'éteint dans la zone */}
					{frame >= ZONE && o2 > 0
						? [0, 1, 2].map((k) => (
								<div
									key={k}
									style={{
										position: 'absolute',
										left: 188 + (300 + k * 46) * 1.12,
										top: 30 + (100 + (k % 2) * 50) * 1.12 - ((frame * 1.5 + k * 20) % 40),
										fontFamily: FONT.title,
										fontWeight: 900,
										fontSize: 34,
										color: LPI.blue,
										opacity: o2,
									}}
								>
									O₂
								</div>
							))
						: null}
					<div style={{position: 'absolute', left: 640, top: 20}}>
						<Pill at={ZONE} size={34}>
							une zone
						</Pill>
					</div>
				</Stage>
				{/* chaîne : plus de sang → plus d'O₂ → neurones morts */}
				<div style={{position: 'absolute', left: 72, top: 1200, display: 'flex', alignItems: 'center', gap: 14}}>
					<Pill at={SANG} size={34} color={LPI.sky}>
						plus de sang
					</Pill>
					{frame >= OXY - 2 ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.blue}}>→</span> : null}
					<Pill at={OXY} size={34} color={LPI.sky}>
						plus d'O₂
					</Pill>
					{frame >= MEUR - 2 ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.blue}}>→</span> : null}
					<Pill at={MEUR} size={34} color={LPI.pink}>
						neurones morts
					</Pill>
				</div>
			</Camera>
			<Sfx name="pop" at={ACC} volume={0.1} />
			<Sfx name="pop" at={VASC} volume={0.1} />
			<Sfx name="pop" at={CER} volume={0.1} />
			<Sfx name="whoosh" at={ZONE} volume={0.06} />
			<Sfx name="buzz" at={SANG} volume={0.05} />
			<Sfx name="impact" at={MEUR} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ISCHÉMIQUE / 3 · HÉMORRAGIQUE ═══════════════════════════════ */
export const Ischemique: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const DANS = at('isch', 'dans');
	const AVC = at('isch', 'avc');
	const IS = at('isch', 'ischémique');
	const CAIL = at('isch', 'caillot');
	const BOU = at('isch', 'bouche');
	const PASSE = at('isch', 'passe');
	const clot = frame < CAIL - 2 ? 0 : spring({frame: frame - (CAIL - 2), fps, config: {damping: 11, stiffness: 180}});
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DANS + 1, IS + 1, CAIL + 1, BOU + 1, PASSE + 1]} shakes={[CAIL + 2]}>
				<Head kicker="8 fois sur 10" kAt={DANS} title="AVC *ischémique*" tAt={AVC - 2} size={86} />
				<div style={{position: 'absolute', left: 72, top: 420}}>
					<TenDots at={DANS + 4} n={8} color={LPI.blue} label="8 sur 10" />
				</div>
				<Stage y={520} h={470} at={DANS + 6} bumps={[CAIL, PASSE]}>
					<div style={{position: 'absolute', left: 0, top: 100}}>
						<ArteryZoom width={936} clot={clot} />
					</div>
					<div style={{position: 'absolute', left: 40, top: 30}}>
						<Pill at={CAIL} size={34} color={LPI.blue}>
							caillot
						</Pill>
					</div>
					{frame >= PASSE - 2 ? (
						<div style={{position: 'absolute', left: 640, top: 424}}>
							<Pill at={PASSE - 2} size={34} color={LPI.sky}>
								plus de sang
							</Pill>
						</div>
					) : null}
				</Stage>
				<Stamp at={BOU} x={780} y={540} text="Bouché !" size={54} rot={-8} />
				<TermSlam index={0} at={IS} term="Ischémique" meaning="le sang n'arrive plus (un caillot bouche l'artère)" sign="empty" slamY={SLAM_Y + 60} slot={{x: 72, y: 1030, w: 936}} active={frame >= IS} />
			</Camera>
			<Sfx name="pop" at={DANS + 4} volume={0.08} />
			<Sfx name="impact" at={CAIL} volume={0.11} />
			<Sfx name="stamp" at={BOU} volume={0.1} />
			<Sfx name="buzz" at={PASSE} volume={0.05} />
		</AbsoluteFill>
	);
};

export const Hemorragique: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const SIN = at('hemo', 'sinon');
	const AVC = at('hemo', 'avc');
	const HE = at('hemo', 'hémorragique');
	const ROM = at('hemo', 'rompt');
	const ECH = at('hemo', "s'échappe");
	const CERV = at('hemo', 'cerveau');
	const rupture = frame < ROM - 2 ? 0 : spring({frame: frame - (ROM - 2), fps, config: {damping: 10, stiffness: 200}});
	const spill = interpolate(frame, [ECH - 4, ECH + 24], [0, 1], ease);
	const bleed = interpolate(frame, [CERV - 4, CERV + 20], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SIN + 1, HE + 1, ROM + 1, ECH + 1, CERV + 1]} shakes={[ROM + 2]}>
				<Head kicker="2 fois sur 10" kAt={SIN} title="AVC *hémorragique*" tAt={AVC - 2} size={80} />
				<div style={{position: 'absolute', left: 72, top: 420}}>
					<TenDots at={SIN + 4} n={2} color={LPI.pink} label="2 sur 10" />
				</div>
				<Stage y={520} h={470} at={SIN + 6} bumps={[ROM, ECH]}>
					<div style={{position: 'absolute', left: 10, top: 210}}>
						<ArteryZoom width={600} rupture={rupture} spill={spill} />
					</div>
					{/* cerveau : la tache de sang s'étend */}
					{frame >= CERV - 8 ? (
						<div style={{position: 'absolute', left: 630, top: 130, transform: `scale(${usePopSafe(frame, CERV - 8)})`, transformOrigin: 'center'}}>
							<Brain size={300} bleed={bleed} neurons={0.5} flow={0.6} alert={bleed} />
						</div>
					) : null}
					<div style={{position: 'absolute', left: 40, top: 30}}>
						<Pill at={ROM} size={34}>
							rupture
						</Pill>
					</div>
				</Stage>
				<TermSlam index={0} at={HE} term="Hémorragique" meaning="une artère se rompt : le sang s'échappe" sign="alert" slamY={SLAM_Y + 60} slot={{x: 72, y: 1030, w: 936}} active={frame >= HE} />
			</Camera>
			<Sfx name="pop" at={SIN + 4} volume={0.08} />
			<Sfx name="impact" at={ROM} volume={0.12} />
			<Sfx name="whoosh" at={ECH} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · VITE ═══════════════════════════════ */
const LETTERS = [
	{l: 'V', word: 'Visage paralysé', sub: "la bouche tombe d'un côté"},
	{l: 'I', word: "Inertie d'un membre", sub: 'un bras ou une jambe ne répond plus'},
	{l: 'T', word: 'Trouble de la parole', sub: 'il parle mal, ne trouve plus ses mots'},
	{l: 'E', word: 'En urgence', sub: 'on appelle le 15'},
];

/** Tuiles V · I · T · E : `active` = lettre en cours, `done` = lettres déjà vues (cochées). */
const ViteTiles: React.FC<{at: number; active: number; done: number; y?: number}> = ({at: t0, active, done, y = 410}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 72, top: y, display: 'flex', gap: 18}}>
			{LETTERS.map((L, i) => {
				const p = usePopSafe(frame, t0 + i * 3);
				const on = i === active;
				const ok = i < done;
				return (
					<div
						key={L.l}
						style={{
							position: 'relative',
							width: 120,
							height: 120,
							borderRadius: 30,
							background: on ? LPI.pink : ok ? LPI.blue : LPI.paper,
							border: `6px solid ${N}`,
							boxSizing: 'border-box',
							boxShadow: on ? `0 16px 40px ${alpha(LPI.pink, 0.55)}` : SHADOW,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 84,
							color: ok ? LPI.paper : N,
							transform: `scale(${p * (on ? 1.12 + 0.03 * Math.sin(frame / 4) : 1)}) rotate(${on ? -4 : 0}deg)`,
						}}
					>
						{L.l}
						{ok ? (
							<div style={{position: 'absolute', right: -14, top: -14}}>
								<Sign kind="check" size={44} />
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

/** Carte d'explication de la lettre en cours (change avec un petit rebond). */
const LetterCard: React.FC<{idx: number; since: number; y?: number}> = ({idx, since, y = 1196}) => {
	const frame = useCurrentFrame();
	if (idx < 0) return null;
	const p = usePopSafe(frame, since);
	const L = LETTERS[idx];
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				minHeight: 150,
				boxSizing: 'border-box',
				borderRadius: 40,
				background: LPI.paper,
				border: `6px solid ${LPI.pink}`,
				boxShadow: `0 18px 44px ${alpha(LPI.pink, 0.35)}`,
				display: 'flex',
				alignItems: 'center',
				gap: 26,
				padding: '18px 30px',
				transform: `scale(${0.8 + 0.2 * p}) translateY(${(1 - p) * 30}px)`,
				opacity: Math.min(1, p * 2),
			}}
		>
			<div style={{width: 100, height: 100, flexShrink: 0, borderRadius: 26, background: LPI.pink, border: `6px solid ${N}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N}}>{L.l}</div>
			<div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue, lineHeight: 1.05}}>{L.word}</div>
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: alpha(N, 0.8), marginTop: 6}}>{L.sub}</div>
			</div>
		</div>
	);
};

const GARBLE = ['Je… veu…', 'blr… ma…', 'heu… le…', 'zz… pa…'];

export const Vite: React.FC = () => {
	const frame = useCurrentFrame();
	const POUR = at('vite', 'pour');
	const PENSE = at('vite', 'pense');
	const VITE = at('vite', 'vite');
	const V = at('vite', 'v');
	const VIS = at('vite', 'visage');
	const TOMBE = at('vite', 'tombe');
	const I = at('vite', 'i');
	const INER = at('vite', 'inertie');
	const BRAS = at('vite', 'bras');
	const REP = at('vite', 'répond');
	const T = at('vite', 't');
	const PAROLE = at('vite', 'parole');
	const PARLE = at('vite', 'parle');
	const TROUVE = at('vite', 'trouve');
	const SIZE = 380;
	const idx = frame >= T ? 2 : frame >= I ? 1 : frame >= V ? 0 : -1;
	const since = [V, I, T][Math.max(0, idx)];
	const droop = interpolate(frame, [TOMBE - 4, TOMBE + 8], [0, 1], ease);
	const raise = interpolate(frame, [INER - 2, INER + 12], [0, 100], {...clamp, easing: Easing.out(Easing.back(1.6))});
	const fall = interpolate(frame, [REP - 2, REP + 10], [0, 1], {...clamp, easing: Easing.bounce});
	const armR = raise * (1 - fall) + 12 * fall;
	const mouth = patientPoint('mouth', SIZE);
	const elbow = patientPoint('elbow', SIZE);
	const px = 278;
	const py = 40;
	const bubble = usePopSafe(frame, PAROLE - 2);
	const garble = frame >= TROUVE ? '… ? ?' : GARBLE[Math.floor(frame / 5) % GARBLE.length];
	const ring = (t0: number, t1: number) => interpolate(frame, [t0, t0 + 6, t1 - 4, t1], [0, 1, 1, 0], clamp);
	const zoom = interpolate(frame, [VIS - 4, VIS + 10, I - 10, I + 2], [1, 1.8, 1.8, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[VITE + 1, V + 1, TOMBE + 1, I + 1, REP + 1, T + 1, PAROLE + 1, TROUVE + 1]} shakes={[VITE + 2, REP + 2]}>
				<Head kicker="Reconnaître" kAt={POUR} title="Pense *VITE* !" tAt={PENSE - 2} />
				<ViteTiles at={VITE - 2} active={idx} done={Math.max(0, idx)} />
				<Stage y={560} h={600} at={POUR + 4} bumps={[TOMBE, REP, PAROLE]}>
					{/* « visage » : on zoome sur la bouche qui tombe, puis on revient au patient entier */}
					<div style={{position: 'absolute', left: 0, top: 0, width: 936, height: 600, overflow: 'hidden', borderRadius: 50}}>
						<div style={{position: 'absolute', left: px, top: py, transform: `scale(${zoom}) translateX(${frame >= REP && frame < REP + 12 ? Math.sin(frame * 2) * 3 : 0}px)`, transformOrigin: `${mouth.x}px ${mouth.y - 40}px`}}>
							<Patient size={SIZE} breath={idle(frame)} mood={frame >= TOMBE ? 'mal' : 'calme'} droop={droop} armL={raise} armR={armR} />
							<svg width={SIZE} height={SIZE * 1.4} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
								<circle cx={mouth.x + 8} cy={mouth.y} r={46} fill="none" stroke={LPI.pink} strokeWidth={6} strokeDasharray="12 9" strokeDashoffset={frame * 2} opacity={ring(TOMBE - 4, I)} />
								<circle cx={elbow.x + 40} cy={elbow.y - 10} r={80} fill="none" stroke={LPI.pink} strokeWidth={7} strokeDasharray="14 10" strokeDashoffset={frame * 2} opacity={ring(REP, T)} />
							</svg>
						</div>
					</div>
					{/* bulle : il parle mal */}
					{frame >= PAROLE - 2 ? (
						<div
							style={{
								position: 'absolute',
								left: px + mouth.x + 70,
								top: py + mouth.y - 150,
								padding: '18px 30px',
								borderRadius: 40,
								background: LPI.paper,
								border: `6px solid ${N}`,
								boxShadow: SHADOW,
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 46,
								color: N,
								whiteSpace: 'nowrap',
								transform: `scale(${bubble}) rotate(${frame >= PARLE ? Math.sin(frame / 2) * 3 : 0}deg)`,
								transformOrigin: 'left bottom',
							}}
						>
							{garble}
							<div style={{position: 'absolute', left: 20, bottom: -26, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `26px solid ${N}`}} />
						</div>
					) : null}
				</Stage>
				<LetterCard idx={idx} since={since} />
			</Camera>
			<Sfx name="impact" at={VITE} volume={0.11} />
			<Sfx name="pop" at={V} volume={0.1} />
			<Sfx name="buzz" at={TOMBE} volume={0.05} />
			<Sfx name="pop" at={I} volume={0.1} />
			<Sfx name="whoosh" at={INER} volume={0.06} />
			<Sfx name="hop" at={REP} volume={0.08} />
			<Sfx name="pop" at={T} volume={0.1} />
			<Sfx name="pop" at={PAROLE} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · EN URGENCE : LE 15 ═══════════════════════════════ */
export const Urgence: React.FC = () => {
	const frame = useCurrentFrame();
	const ET = at('urgence', 'et');
	const E = at('urgence', 'e');
	const APP = at('urgence', 'appelle');
	const Q15 = at('urgence', '15');
	const HEURE = at('urgence', "l'heure");
	const DEBUT = at('urgence', 'début');
	const CHAQUE = at('urgence', 'chaque');
	const COMPTE = at('urgence', 'compte');
	const phone = useSoft(E, true);
	const digits = frame >= Q15 ? '15' : frame >= Q15 - 6 ? '1' : '';
	const press = interpolate(frame, [Q15 + 4, Q15 + 7, Q15 + 12], [0, 1, 0], clamp);
	const ring = interpolate(frame, [Q15 + 8, Q15 + 14], [0, 1], clamp);
	const clock = useSoft(HEURE - 2, true);
	const spin = interpolate(frame, [HEURE - 2, DEBUT + 10], [-3, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[E + 1, Q15 + 1, HEURE + 1, COMPTE + 1]} shakes={[Q15 + 2]}>
				<Head kicker="E comme en urgence" kAt={ET} title="Appelle le *15* !" tAt={APP - 2} />
				<ViteTiles at={ET - 6} active={frame >= E ? 3 : -1} done={3} />
				<Stage y={560} h={540} at={ET + 2} bumps={[Q15, HEURE]}>
					<div style={{position: 'absolute', left: 70, top: 40, opacity: Math.min(1, phone * 1.5), transform: `translateY(${(1 - phone) * 80}px) rotate(${-6 + 6 * phone}deg)`}}>
						<Phone digits={digits} press={press} ring={ring} size={250} />
					</div>
					<div style={{position: 'absolute', left: 470, top: 50, opacity: Math.min(1, clock * 1.5), transform: `scale(${0.5 + 0.5 * clock})`, transformOrigin: 'center'}}>
						<WallClock h={14} m={32} spin={spin} size={260} />
					</div>
					{frame >= DEBUT - 2 ? (
						<div style={{position: 'absolute', left: 430, top: 330, width: 360, textAlign: 'center'}}>
							<Enter at={DEBUT - 2} distance={16}>
								<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: alpha(N, 0.7)}}>début des signes</div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.blue}}>14 h 32</div>
							</Enter>
						</div>
					) : null}
				</Stage>
				<Stamp at={COMPTE - 2} x={730} y={1050} text="Chaque minute compte !" size={44} rot={-5} />
				<div style={{position: 'absolute', left: 72, top: 1160, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={Q15} label="appeler le 15" size={44} />
					<CheckChip at={HEURE} label="noter l'heure du début" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={E} volume={0.1} />
			<Sfx name="tick" at={Q15 - 6} volume={0.08} />
			<Sfx name="tick" at={Q15} volume={0.08} />
			<Sfx name="ding" at={Q15 + 10} volume={0.08} />
			<Sfx name="tick" at={HEURE} volume={0.08} />
			<Sfx name="stamp" at={COMPTE - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · À L'HÔPITAL ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const HOP = at('traitement', "l'hôpital");
	const SCAN = at('traitement', 'scanner');
	const IRM = at('traitement', 'irm');
	const TYPE = at('traitement', 'type');
	const CAIL = at('traitement', 'caillot');
	const DISS = at('traitement', 'dissoudre');
	const LYSE = at('traitement', 'thrombolyse');
	const RET = at('traitement', 'retirer');
	const TOMIE = at('traitement', 'thrombectomie');
	const mon = useSoft(HOP + 2, true);
	const out = interpolate(frame, [DISS - 12, DISS - 2], [0, 1], easeIn);
	const clot = interpolate(frame, [TYPE + 4, TYPE + 12], [0, 1], clamp);
	const row1 = useSoft(DISS - 6, true);
	const row2 = useSoft(RET - 8, true);
	const dissolve = interpolate(frame, [DISS + 2, LYSE + 10], [0, 1], ease);
	const retrieve = interpolate(frame, [RET - 2, TOMIE + 22], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SCAN + 1, IRM + 1, TYPE + 1, CAIL + 1, LYSE + 1, TOMIE + 1]} shakes={[CAIL + 2]}>
				<Head kicker="À l'hôpital" kAt={HOP - 2} title="Scanner ou *IRM*" tAt={SCAN - 2} />
				<Stage y={LAY.stageY} h={540} at={HOP + 2} bumps={[TYPE, LYSE, TOMIE]}>
					{out < 1 ? (
						<div style={{position: 'absolute', left: 60, top: 70, opacity: Math.min(1, mon * 1.5) * (1 - out), transform: `scale(${(0.6 + 0.4 * mon) * (1 - 0.3 * out)}) translateY(${-out * 200}px)`}}>
							<ScanMonitor label={frame >= IRM ? 'IRM' : 'Scanner'} scan={frame < CAIL ? 1 : 0}>
								<Brain size={360} clot={clot} ischemia={clot} dead={0} neurons={0.6} />
							</ScanMonitor>
						</div>
					) : null}
					{out < 1 ? (
						<div style={{position: 'absolute', left: 630, top: 120, display: 'flex', flexDirection: 'column', gap: 26, opacity: 1 - out}}>
							<Pill at={TYPE} size={34} color={frame >= CAIL ? LPI.blue : LPI.sky}>
								{frame >= CAIL ? '✓ caillot' : 'caillot ?'}
							</Pill>
							<div style={{opacity: frame >= CAIL ? 0.35 : 1}}>
								<Pill at={TYPE + 4} size={34} color={LPI.sky}>
									saignement ?
								</Pill>
							</div>
						</div>
					) : null}
					{/* deux traitements du caillot */}
					{frame >= DISS - 6 ? (
						<div style={{position: 'absolute', left: 48, top: 30, opacity: Math.min(1, row1 * 1.5), transform: `translateX(${(1 - row1) * 300}px)`}}>
							<ArteryZoom width={840} clot={1} dissolve={dissolve} />
							<div style={{position: 'absolute', left: 24, top: -22}}>
								<Pill at={DISS - 6} size={30} color={LPI.blue}>
									médicament
								</Pill>
							</div>
						</div>
					) : null}
					{frame >= RET - 8 ? (
						<div style={{position: 'absolute', left: 48, top: 300, opacity: Math.min(1, row2 * 1.5), transform: `translateX(${(1 - row2) * 300}px)`}}>
							<ArteryZoom width={840} clot={1} retrieve={retrieve} />
							<div style={{position: 'absolute', left: 24, top: -22}}>
								<Pill at={RET - 8} size={30} color={LPI.blue}>
									sonde
								</Pill>
							</div>
						</div>
					) : null}
				</Stage>
				<TermSlam index={0} at={LYSE} term="Thrombolyse" meaning="dissoudre le caillot avec un médicament" sign="device" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= LYSE && frame < TOMIE} />
				<TermSlam index={1} at={TOMIE} term="Thrombectomie" meaning="aller retirer le caillot avec une sonde" sign="check" slamY={SLAM_Y + 80} slot={termSlot(1)} active={frame >= TOMIE} />
			</Camera>
			<Sfx name="whoosh" at={HOP + 2} volume={0.06} />
			<Sfx name="tick" at={TYPE} volume={0.08} />
			<Sfx name="ding" at={CAIL} volume={0.08} />
			<Sfx name="whoosh" at={DISS - 6} volume={0.06} />
			<Sfx name="whoosh" at={RET - 8} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 7 · FACTEURS DE RISQUE ═══════════════════════════════ */
/** Coupe d'artère : la plaque grossit à chaque facteur (`plaque` 0 → 4), un petit caillot vient boucher (`clot`). */
const ArteryCut: React.FC<{plaque: number; clot: number}> = ({plaque, clot}) => {
	const frame = useCurrentFrame();
	const lumen = 150 - plaque * 22;
	return (
		<svg width={420} height={420} viewBox="-210 -210 420 420">
			<circle r={196} fill={LPI.sky} stroke={N} strokeWidth={10} />
			<circle r={156} fill={alpha(LPI.pink, 0.35)} stroke={N} strokeWidth={6} />
			{/* plaque (graisse) qui rétrécit le passage */}
			<path d={`M0 -156 A156 156 0 1 1 -1 -156 Z M0 ${-lumen} A${lumen} ${lumen} 0 1 0 1 ${-lumen} Z`} fill={LPI.paper} fillRule="evenodd" transform={`translate(${(150 - lumen) * 0.35} ${(150 - lumen) * 0.2})`} />
			<circle r={lumen} cx={(150 - lumen) * 0.35} cy={(150 - lumen) * 0.2} fill={LPI.pink} stroke={N} strokeWidth={6} />
			{Array.from({length: 5}, (_, i) => {
				const a = frame / 8 + i * 1.3;
				const r = lumen * 0.55;
				return <ellipse key={i} cx={(150 - lumen) * 0.35 + Math.cos(a) * r} cy={(150 - lumen) * 0.2 + Math.sin(a) * r} rx={18} ry={10} fill={LPI.paper} opacity={0.75} transform={`rotate(${a * 57} ${(150 - lumen) * 0.35 + Math.cos(a) * r} ${(150 - lumen) * 0.2 + Math.sin(a) * r})`} />;
			})}
			{clot > 0 ? (
				<g transform={`translate(${(150 - lumen) * 0.35 + (1 - clot) * 240} ${(150 - lumen) * 0.2}) scale(${0.5 + 0.5 * clot})`}>
					<path d="M-34 -40 C0 -50 40 -40 44 -6 C48 30 18 48 -10 44 C-40 40 -56 12 -50 -14 C-46 -30 -42 -36 -34 -40 Z" fill={LPI.blue} stroke={N} strokeWidth={6} />
				</g>
			) : null}
		</svg>
	);
};

export const Risques: React.FC = () => {
	const frame = useCurrentFrame();
	const AUG = at('risques', 'augmente');
	const RIS = at('risques', 'risque');
	const items: [number, React.ReactNode, string][] = [
		[at('risques', "l'hypertension"), <HypertensionIcon key="h" size={56} />, "l'hypertension"],
		[at('risques', 'tabac'), <CigaretteIcon key="t" size={56} />, 'le tabac'],
		[at('risques', 'diabète'), <DiabetesIcon key="d" size={56} />, 'le diabète'],
		[at('risques', 'cholestérol'), <CholesterolIcon key="c" size={56} />, 'le cholestérol'],
		[at('risques', 'troubles'), <ArrhythmiaIcon key="r" size={56} />, 'troubles du rythme du cœur'],
	];
	const plaque = items.slice(0, 4).reduce((s, [t]) => s + interpolate(frame, [t - 2, t + 10], [0, 1], ease), 0);
	const clot = interpolate(frame, [items[4][0], items[4][0] + 16], [0, 1], ease);
	const cut = useSoft(AUG - 2, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[RIS + 1, ...items.map(([t]) => t + 1)]} shakes={[items[4][0] + 14]}>
				<Head kicker="Prévention" kAt={AUG - 6} title="Ce qui *augmente* le risque" tAt={AUG - 2} size={70} />
				<Stage y={LAY.stageY} h={500} at={AUG} bumps={items.map(([t]) => t)}>
					<div style={{position: 'absolute', left: 258, top: 40, transform: `scale(${0.5 + 0.5 * cut})`, opacity: Math.min(1, cut * 1.5), transformOrigin: 'center'}}>
						<ArteryCut plaque={plaque} clot={clot} />
					</div>
					<div style={{position: 'absolute', left: 30, top: 30}}>
						<Pill at={items[0][0]} size={30} color={LPI.sky}>
							l'artère se rétrécit
						</Pill>
					</div>
				</Stage>
				{items.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i % 2 === 1 ? 560 : 72, top: 990 + Math.floor(i / 2) * 116}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			{items.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
			<Sfx name="impact" at={items[4][0] + 14} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Un *AVC*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', '15') + 18}
		rows={[
			[at('outro', 'privée'), 'empty', 'Privée de sang', 'une zone du cerveau'],
			[at('outro', 'ischémique'), 'down', 'Ischémique', "un caillot bouche l'artère"],
			[at('outro', 'hémorragique'), 'alert', 'Hémorragique', 'une artère saigne'],
			[at('outro', 'vite'), 'check', 'VITE', 'visage · inertie · parole · urgence'],
			[at('outro', '15'), 'device', 'Le 15', 'au moindre doute'],
		]}
	/>
);
