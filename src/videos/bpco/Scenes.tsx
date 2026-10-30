// Scènes de « C'est quoi la BPCO ? » (format pathologie) : accroche (« Et si chaque respiration devenait un véritable
// effort ? », un homme qui peine à respirer, compte à rebours 3 · 2 · 1 pendant que la caméra plonge dans ses poumons,
// « C'est la BPCO »), définition (sigle lettre par lettre), dans les bronches (inflammation, mucus, rétrécissement,
// emphysème, air piégé), cause (tabac 8 cas sur 10), signes, spirométrie, traitement, oxygène et exacerbation, récap.
// Bronche, spiromètre, inhalateur : src/brand/copd.tsx ; bronches et lunettes à oxygène du `Patient`.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bronchus, exhaled, Inhaler, Spirometer} from '../../brand/copd';
import {WallClock} from '../../brand/devices';
import {CamKey, CauseChip, Head, LAY, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {CigaretteIcon, CoughIcon, DustIcon, RunIcon, SmogIcon, SputumIcon, SunriseIcon, SyringeIcon} from '../../brand/icons';
import {CheckChip, Stamp, Strike, Tape} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {SPO_ZONES} from '../../brand/oxygen';
import {Patient, PatientProps} from '../../brand/patient';
import {LungsPicto, SnowPicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Kicker, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
/** respiration rapide et laborieuse (essoufflement) */
const pant = (frame: number, period = 5) => 0.5 - 0.5 * Math.cos(frame / period);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** ressort sans hook (utilisable dans une boucle) */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.5}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Petit écran de surveillance (SpO₂…). */
const Screen: React.FC<{label: string; value: string; unit?: string; alert?: boolean; at: number}> = ({label, value, unit = '', alert = false, at: t0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{transform: `scale(${popAt(frame, t0)})`, padding: '12px 22px', borderRadius: 26, background: N, boxShadow: SHADOW, display: 'flex', alignItems: 'baseline', gap: 8, border: `6px solid ${alert && frame % 16 < 10 ? LPI.pink : N}`}}>
			<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: LPI.sky}}>{label}</span>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: alert ? LPI.pink : LPI.paper, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{value}</span>
			{unit ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: LPI.sky}}>{unit}</span> : null}
		</div>
	);
};

/** Pastille posée dans le socle (bas gauche), visible de `from` à `to`. */
const StagePill: React.FC<{from: number; to?: number; children: React.ReactNode; color?: string; x?: number; y?: number}> = ({from, to = 1e9, children, color, x = 30, y = 450}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame >= to) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Pill at={from} size={34} color={color}>
				{children}
			</Pill>
		</div>
	);
};

/**
 * Le patient (taille `size`, posé en x, y) + calques dessinés dans son espace (400 × 560) : souffle court
 * (bouffées devant la bouche), toux, crachats.
 */
const Man: React.FC<PatientProps & {x: number; y: number; puffs?: number; cough?: number; sputum?: number}> = ({x, y, size = 360, puffs = 0, cough = 0, sputum = 0, ...p}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Patient size={size} {...p} />
			<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{puffs > 0
					? [0, 1, 2].map((k) => {
							const t = ((frame + k * 10) % 30) / 30;
							return <path key={k} d={`M${226 + t * 60} ${150 - 6 + k * 6} q14 -10 28 0`} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" opacity={puffs * (1 - t)} />;
						})
					: null}
				{cough > 0
					? [-1, 0, 1].map((k) => {
							const t = ((frame + (k + 1) * 4) % 16) / 16;
							return <path key={k} d={`M${230 + t * 30} ${150 + k * 16 * (1 + t)} l${26 + t * 20} ${k * 12}`} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" opacity={cough * (1 - t * 0.7)} />;
						})
					: null}
				{sputum > 0
					? [0, 1].map((k) => {
							const t = ((frame + k * 13) % 26) / 26;
							return (
								<g key={k} transform={`translate(${238 + t * 70} ${156 + t * t * 90})`} opacity={sputum * (1 - t)}>
									<ellipse rx={13} ry={10} fill={alpha(LPI.blue, 0.5)} stroke={N} strokeWidth={3} />
									<circle cx={-4} cy={-3} r={3} fill={LPI.paper} />
								</g>
							);
						})
					: null}
			</svg>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Et si chaque respiration devenait un véritable effort ? » et un homme essoufflé (bouffées, sueurs).
// Compte à rebours 3 · 2 · 1 : à chaque chiffre la caméra s'approche et ses poumons apparaissent à travers le thorax ;
// « Que se passe-t-il ? » : les bronches rétrécissent ; « C'est la BPCO » (flash) ; puis la question.
const HP = {size: 620, x: 230, y: 600};
const hookPt = (x: number, y: number) => ({x: HP.x + (x * HP.size) / 400, y: HP.y + (y * HP.size) / 400});

const Countdown: React.FC<{marks: number[]; until: number}> = ({marks, until}) => {
	const frame = useCurrentFrame();
	if (frame < marks[0] - 2 || frame > until + 8) return null;
	const i = marks.filter((m) => frame >= m).length - 1;
	const n = 3 - Math.max(0, i);
	const since = frame - marks[Math.max(0, i)];
	const out = interpolate(frame, [until, until + 8], [1, 0], clamp);
	const ring = interpolate(since, [0, 20], [1, 0.05], clamp);
	return (
		<div style={{position: 'absolute', left: 540 - 150, top: 200, width: 300, height: 300, opacity: out, transform: `scale(${(0.6 + 0.4 * out) * (frame >= marks[0] ? 1 : 0.5)})`}}>
			<svg width={300} height={300} style={{position: 'absolute', inset: 0}}>
				<circle cx={150} cy={150} r={140} fill={N} stroke={LPI.paper} strokeWidth={10} />
				<circle cx={150} cy={150} r={118} fill="none" stroke={LPI.pink} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 150 150)" />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 190, color: LPI.paper, lineHeight: 1, transform: `scale(${since < 0 ? 0 : 1 + 0.5 * Math.exp(-since / 3)})`}}>
				{n}
			</div>
		</div>
	);
};

/** Carton blanc (lisible par-dessus le gros plan) */
const Card: React.FC<{at: number; until?: number; y: number; children: React.ReactNode}> = ({at: t0, until = 1e9, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0 - 1 || frame > until + 6) return null;
	const o = interpolate(frame, [until, until + 6], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 60, top: y, width: 960, display: 'flex', justifyContent: 'center', opacity: o}}>
			<div style={{padding: '22px 40px', borderRadius: 40, background: alpha(LPI.paper, 0.94), boxShadow: SHADOW, transform: `scale(${popAt(frame, t0)})`, textAlign: 'center'}}>{children}</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const RESP = at('intro', 'respiration');
	const EFF = at('intro', 'effort');
	const TROIS = at('intro', 'trois');
	const DEUX = at('intro', 'deux');
	const UN = at('intro', 'un', 2);
	const QUE = at('intro', 'que');
	const PASSE = at('intro', 'passe-t-il');
	const CEST = at('intro', "c'est");
	const BPCO = at('intro', 'bpco');
	const MAIS = at('intro', 'mais');
	const QUOI = at('intro', 'quoi');
	const chest = hookPt(200, 290);
	const keys: CamKey[] = [
		{at: TROIS - 2, s: 1.3, x: chest.x, y: chest.y - 40, dur: 10},
		{at: DEUX - 2, s: 1.75, x: chest.x, y: chest.y, dur: 10},
		{at: UN - 2, s: 2.4, x: chest.x, y: chest.y + 10, dur: 10},
		{at: MAIS - 6, s: 1.08, x: 540, y: 1010, dur: 16},
	];
	const lungs = interpolate(frame, [TROIS - 2, TROIS + 4, DEUX - 2, DEUX + 4, UN - 2, UN + 4], [0, 0.4, 0.4, 0.75, 0.75, 1], clamp);
	const titleO = 1 - fadeIn(frame, TROIS - 6, 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[RESP + 1, EFF + 1, TROIS + 1, DEUX + 1, UN + 1, BPCO + 1]} shakes={[EFF + 2, BPCO + 2]} strength={0.04}>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<Man
						x={HP.x}
						y={HP.y}
						size={HP.size}
						mood="mal"
						breath={pant(frame)}
						sweat={1}
						puffs={frame < UN ? 1 : 0}
						lungs={lungs}
						bronchi={fadeIn(frame, UN, 8)}
						narrow={interpolate(frame, [PASSE - 4, PASSE + 18], [0, 1], ease)}
						trapped={interpolate(frame, [BPCO, BPCO + 30], [0, 0.7], clamp)}
					/>
				</ZoomCam>
				{titleO > 0 ? (
					<div style={{position: 'absolute', left: 60, top: 200, width: 960, opacity: titleO}}>
						<Title at={-20} text={'Et si chaque *respiration*\ndevenait un *véritable*\n*effort* ?'} size={84} align="center" stagger={0} brush={false} />
					</div>
				) : null}
				<Countdown marks={[TROIS, DEUX, UN]} until={QUE - 4} />
				<Card at={QUE - 2} until={CEST - 4} y={240}>
					<Title at={QUE - 2} text="Que se *passe-t-il* ?" size={84} align="center" stagger={2} brush={false} />
				</Card>
				<Card at={CEST - 2} until={MAIS - 6} y={210}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, lineHeight: 1.1}}>C'est la</div>
					{frame >= BPCO ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 200, color: LPI.pink, lineHeight: 1, transform: `scale(${popAt(frame, BPCO)})`, WebkitTextStroke: `6px ${N}`}}>BPCO</div> : null}
				</Card>
				{frame >= MAIS - 4 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 220, width: 936}}>
							<Title at={MAIS - 2} text="C'est quoi la" size={74} align="center" stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 300, width: 936}}>
							<Title at={QUOI} text="*BPCO* ?" size={170} align="center" stagger={4} />
						</div>
					</>
				) : null}
				<Burst at={BPCO} x={540} y={420} r={360} n={18} />
			</Camera>
			<Flash at={BPCO} />
			<Sfx name="heartbeat" at={0} volume={0.08} />
			<Sfx name="whoosh" at={RESP} volume={0.05} />
			<Sfx name="impact" at={EFF} volume={0.08} />
			<Sfx name="tick" at={TROIS} volume={0.12} />
			<Sfx name="tick" at={DEUX} volume={0.12} />
			<Sfx name="tick" at={UN} volume={0.12} />
			<Sfx name="whoosh" at={QUE - 4} volume={0.07} />
			<Sfx name="buzz" at={PASSE} volume={0.05} dur={18} />
			<Sfx name="impact" at={BPCO} volume={0.13} />
			<Sfx name="whoosh" at={MAIS - 6} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// Le sigle se déplie lettre par lettre (une ligne par lettre sous le socle) ; dans le socle, le patient : on
// s'approche des bronches, des poumons, une horloge (toute la vie), puis l'air qui passe mal (bronches qui rétrécissent).
const DP = {size: 330, x: 303, y: 8};
const defPt = (x: number, y: number) => ({x: DP.x + (x * DP.size) / 400, y: DP.y + (y * DP.size) / 400});

const LetterRow: React.FC<{i: number; letter: string; color: string; ink?: string; word: string; wAt: number; sub: string; sAt: number; at0: number}> = ({i, letter, color, ink = LPI.paper, word, wAt, sub, sAt, at0}) => {
	const frame = useCurrentFrame();
	if (frame < at0 + i * 3) return null;
	const p = popAt(frame, at0 + i * 3);
	const on = frame >= wAt;
	return (
		<div style={{position: 'absolute', left: 72, top: 1000 + i * 112, height: 98, display: 'flex', alignItems: 'center', gap: 22}}>
			<div style={{width: 96, height: 96, borderRadius: 26, background: color, border: `6px solid ${N}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 66, color: ink, transform: `scale(${p * (on && frame < wAt + 10 ? 1 + 0.15 * Math.exp(-(frame - wAt) / 3) : 1)})`, boxShadow: SHADOW}}>
				{letter}
			</div>
			{on ? (
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N, transform: `scale(${popAt(frame, wAt)})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{word}</div>
			) : null}
			{frame >= sAt ? (
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: alpha(N, 0.72), opacity: fadeIn(frame, sAt, 6), transform: `translateX(${(1 - fadeIn(frame, sAt, 6)) * -20}px)`, whiteSpace: 'nowrap'}}>· {sub}</div>
			) : null}
		</div>
	);
};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const LA = at('def', 'la');
	const FULL = at('def', 'bronchopneumopathie');
	const BRO = at('def', 'broncho');
	const BRONCHES = at('def', 'bronches');
	const PNEU = at('def', 'pneumopathie');
	const POUMON = at('def', 'poumon');
	const CHRO = at('def', 'chronique', 2);
	const VIE = at('def', 'vie');
	const OBS = at('def', 'obstructive', 2);
	const AIR = at('def', "l'air");
	const MAL = at('def', 'mal');
	const chest = defPt(200, 300);
	const keys: CamKey[] = [
		{at: BRO - 2, s: 2.1, x: chest.x, y: chest.y - 10, dur: 14},
		{at: PNEU - 2, s: 1.55, x: chest.x, y: chest.y, dur: 14},
		{at: CHRO - 4, s: 1, dur: 14},
		{at: OBS - 2, s: 2.3, x: defPt(200, 270).x, y: defPt(200, 270).y, dur: 14},
	];
	const glow = frame >= POUMON - 4 && frame < CHRO ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[BRO + 1, PNEU + 1, CHRO + 1, OBS + 1, MAL + 1]} shakes={[MAL + 2]}>
				<div style={{position: 'absolute', left: 72, top: LAY.kickerY}}>
					<Kicker at={LA}>Définition</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: LAY.titleY, width: 936}}>
					<Title at={LA + 2} text="La *BPCO*" size={92} stagger={3} />
				</div>
				{frame >= FULL - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 392, fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: alpha(N, 0.75), opacity: fadeIn(frame, FULL - 2, 8)}}>
						Bronchopneumopathie chronique obstructive
					</div>
				) : null}
				<Stage y={456} h={520} at={LA + 4} bumps={[BRONCHES, POUMON, MAL]}>
					<ZoomCam keys={keys} w={936} h={520}>
						<Man
							x={DP.x}
							y={DP.y}
							size={DP.size}
							mood={frame >= OBS ? 'mal' : 'calme'}
							breath={frame >= OBS ? pant(frame) : idle(frame)}
							lungs={1}
							bronchi={1}
							narrow={interpolate(frame, [OBS, MAL + 4], [0, 1], ease)}
						/>
						{glow > 0 ? (
							<svg width={936} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<ellipse cx={chest.x} cy={chest.y + 10} rx={95} ry={80} fill="none" stroke={LPI.pink} strokeWidth={8} opacity={glow} />
							</svg>
						) : null}
					</ZoomCam>
					{frame >= CHRO - 2 && frame < OBS - 2 ? (
						<div style={{position: 'absolute', left: 680, top: 60, transform: `scale(${popAt(frame, CHRO - 2)})`}}>
							<WallClock h={8} m={0} size={200} spin={interpolate(frame, [CHRO, OBS], [0, 3], clamp)} />
						</div>
					) : null}
					<StagePill from={BRONCHES - 2} to={PNEU - 2}>
						les bronches
					</StagePill>
					<StagePill from={POUMON - 2} to={CHRO - 2} color={LPI.blue}>
						le poumon
					</StagePill>
					<StagePill from={VIE - 2} to={OBS - 2} color={LPI.sky}>
						toute la vie
					</StagePill>
					<StagePill from={AIR - 2}>l'air passe mal</StagePill>
				</Stage>
				<LetterRow i={0} letter="B" color={LPI.blue} word="Broncho" wAt={BRO} sub="les bronches" sAt={BRONCHES} at0={LA + 2} />
				<LetterRow i={1} letter="P" color={LPI.pink} ink={N} word="Pneumopathie" wAt={PNEU} sub="maladie du poumon" sAt={POUMON} at0={LA + 2} />
				<LetterRow i={2} letter="C" color={N} word="Chronique" wAt={CHRO} sub="toute la vie" sAt={VIE} at0={LA + 2} />
				<LetterRow i={3} letter="O" color={LPI.sky} ink={N} word="Obstructive" wAt={OBS} sub="l'air passe mal" sAt={AIR} at0={LA + 2} />
			</Camera>
			{[BRO, PNEU, CHRO, OBS].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
			<Sfx name="tick" at={CHRO + 4} volume={0.06} />
			<Sfx name="buzz" at={MAL} volume={0.05} dur={16} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · DANS LES BRONCHES ═══════════════════════════════ */
// Gros plan du thorax, on plonge dans une bronche (fondu) : la paroi s'enflamme, le mucus, le passage rétrécit ;
// au bout, les alvéoles se détruisent (emphysème) ; l'air entre… mais ressort mal : il reste piégé.
const IP = {size: 340, x: 298, y: 4};
const inPt = (x: number, y: number) => ({x: IP.x + (x * IP.size) / 400, y: IP.y + (y * IP.size) / 400});
const BR = {x: 18, y: 36, w: 900};

export const Dedans: React.FC = () => {
	const frame = useCurrentFrame();
	const INT = at('dedans', "l'intérieur");
	const BRON = at('dedans', 'bronches');
	const ENFL = at('dedans', "s'enflamment");
	const MUC = at('dedans', 'mucus');
	const RETR = at('dedans', 'rétrécissent');
	const BOUT = at('dedans', 'bout');
	const ALV = at('dedans', 'alvéoles');
	const DETR = at('dedans', 'détruisent');
	const EMPH = at('dedans', "l'emphysème");
	const RES = at('dedans', 'résultat');
	const ENTRE = at('dedans', 'entre');
	const RESS = at('dedans', 'ressort');
	const PIEGE = at('dedans', 'piégé');
	const lung = inPt(160, 320);
	const body: CamKey[] = [
		{at: -1, s: 1.9, x: inPt(200, 300).x, y: inPt(200, 300).y, dur: 1},
		{at: INT + 6, s: 4.2, x: lung.x, y: lung.y, dur: 18},
	];
	const tube: CamKey[] = [
		{at: -1, s: 1.3, x: BR.x + 300, y: BR.y + 230, dur: 1},
		{at: BOUT - 2, s: 1.6, x: BR.x + 700, y: BR.y + 230, dur: 16},
		{at: RES - 2, s: 1, dur: 16},
	];
	const zoomO = fadeIn(frame, BRON - 6, 8);
	const airIn = interpolate(frame, [ENTRE - 6, ENTRE + 2, RESS - 2, RESS + 4], [0, 1, 1, 0], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ENFL + 1, MUC + 1, RETR + 1, DETR + 1, EMPH + 1, PIEGE + 1]} shakes={[RETR + 2, PIEGE + 2]}>
				<Head kicker="Dans les poumons" kAt={INT - 4} title="Des bronches *malades*" tAt={BRON - 2} size={84} />
				<Stage y={LAY.stageY} h={540} at={INT} bumps={[RETR, DETR, PIEGE]}>
					{zoomO < 1 ? (
						<div style={{position: 'absolute', inset: 0, opacity: 1 - zoomO}}>
							<ZoomCam keys={body} w={936} h={540}>
								<Man x={IP.x} y={IP.y} size={IP.size} breath={idle(frame)} lungs={1} bronchi={1} />
							</ZoomCam>
						</div>
					) : null}
					{zoomO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: zoomO}}>
							<ZoomCam keys={tube} w={936} h={540}>
								<div style={{position: 'absolute', left: BR.x, top: BR.y}}>
									<Bronchus
										width={BR.w}
										inflame={interpolate(frame, [ENFL - 2, ENFL + 12], [0, 1], ease)}
										mucus={interpolate(frame, [MUC - 2, MUC + 10], [0, 1], ease)}
										narrow={interpolate(frame, [RETR - 2, RETR + 14], [0, 1], ease)}
										damage={interpolate(frame, [DETR - 2, DETR + 18], [0, 1], ease)}
										airIn={airIn}
										airOut={fadeIn(frame, RESS, 6)}
										trapped={interpolate(frame, [RESS, PIEGE + 6], [0, 1], clamp)}
									/>
								</div>
							</ZoomCam>
						</div>
					) : null}
					<StagePill from={ENFL - 2} to={MUC - 2}>
						la paroi s'enflamme
					</StagePill>
					<StagePill from={MUC - 2} to={RETR - 2} color={LPI.blue}>
						du mucus
					</StagePill>
					<StagePill from={ALV - 2} to={DETR - 2} color={LPI.sky}>
						alvéoles : petits sacs où passe l'O₂
					</StagePill>
					<StagePill from={ENTRE - 4} to={RESS - 2} color={LPI.blue}>
						l'air entre…
					</StagePill>
					<StagePill from={RESS - 2}>… mais ressort mal</StagePill>
				</Stage>
				<Stamp at={PIEGE} x={720} y={560} text="Air piégé !" size={64} rot={-8} />
				<TermSlam index={0} at={RETR} term="Obstruction" meaning="les bronches enflammées rétrécissent" sign="squeeze" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= RETR} />
				<TermSlam index={1} at={EMPH} term="Emphysème" meaning="les alvéoles se détruisent" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= EMPH} />
			</Camera>
			<Sfx name="whoosh" at={INT + 6} volume={0.07} />
			<Sfx name="pop" at={ENFL} volume={0.08} />
			<Sfx name="pop" at={MUC} volume={0.08} />
			<Sfx name="buzz" at={RETR} volume={0.05} dur={14} />
			<Sfx name="whoosh" at={BOUT - 2} volume={0.05} />
			<Sfx name="impact" at={DETR + 4} volume={0.08} />
			<Sfx name="whoosh" at={ENTRE - 4} volume={0.05} />
			<Sfx name="stamp" at={PIEGE} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · CAUSE ═══════════════════════════════ */
// La cigarette enfume les poumons ; 10 poumons, 8 s'allument (8 cas sur 10) ; puis poussières, produits chimiques,
// pollution.
export const Cause: React.FC = () => {
	const frame = useCurrentFrame();
	const COUP = at('cause', 'coupable');
	const TABAC = at('cause', 'tabac');
	const DANS = at('cause', 'dans');
	const HUIT = at('cause', 'huit');
	const DIX = at('cause', 'dix');
	const POUSS = at('cause', 'poussières');
	const CHIM = at('cause', 'chimiques');
	const POLL = at('cause', 'pollution');
	const keys: CamKey[] = [
		{at: TABAC + 4, s: 1.35, x: 700, y: 240, dur: 14},
		{at: DANS - 4, s: 1, dur: 14},
	];
	const smoke = fadeIn(frame, TABAC - 4, 8) * (1 - fadeIn(frame, DANS, 8));
	const grid = fadeIn(frame, DANS - 2, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TABAC + 1, HUIT + 1, DIX + 1, POUSS + 1, CHIM + 1, POLL + 1]} shakes={[TABAC + 2]}>
				<Head kicker="La cause" kAt={COUP - 8} title="Le grand *coupable*" tAt={COUP - 4} size={84} />
				<Stage y={LAY.stageY} h={520} at={COUP - 6} bumps={[TABAC, HUIT, DIX]}>
					<ZoomCam keys={keys} w={936} h={520}>
						{grid < 1 ? (
							<div style={{position: 'absolute', inset: 0, opacity: 1 - grid}}>
								<div style={{position: 'absolute', left: 60, top: 150}}>
									<CigaretteIcon size={300} />
								</div>
								{smoke > 0
									? Array.from({length: 10}, (_, i) => {
											const t = ((frame * 1.4 + i * 10) % 100) / 100;
											return <div key={i} style={{position: 'absolute', left: 330 + t * 300, top: 170 + Math.sin(t * 6 + i) * 40 - t * 30, width: 40 + t * 50, height: 40 + t * 50, borderRadius: '50%', background: alpha(N, 0.22), opacity: smoke * Math.sin(t * Math.PI)}} />;
										})
									: null}
								<div style={{position: 'absolute', left: 580, top: 90}}>
									<LungsPicto size={300} />
								</div>
							</div>
						) : null}
						{grid > 0 ? (
							<div style={{position: 'absolute', left: 58, top: 210, width: 820, display: 'flex', flexWrap: 'wrap', gap: 20, opacity: grid}}>
								{Array.from({length: 10}, (_, i) => {
									const lit = frame >= HUIT + i * 2 && i < 8;
									return (
										<div key={i} style={{width: 148, height: 130, borderRadius: 30, background: lit ? LPI.pink : LPI.paper, border: `5px solid ${lit ? N : alpha(N, 0.25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, DANS - 2 + i)})`}}>
											<LungsPicto size={92} />
										</div>
									);
								})}
							</div>
						) : null}
					</ZoomCam>
					{frame >= DIX - 2 ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: LPI.pink, lineHeight: 1, WebkitTextStroke: `4px ${N}`, transform: `scale(${popAt(frame, DIX - 2)})`}}>8 / 10</div>
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={TABAC} icon={<CigaretteIcon size={56} />} label="tabac (8 cas / 10)" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={POUSS} icon={<DustIcon size={56} />} label="poussières au travail" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1230}}>
					<CauseChip at={CHIM} icon={<DustIcon size={56} />} label="produits chimiques" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1340}}>
					<CauseChip at={POLL} icon={<SmogIcon size={56} />} label="pollution" tone={LPI.sky} />
				</div>
			</Camera>
			<Sfx name="impact" at={TABAC} volume={0.1} />
			{Array.from({length: 8}, (_, i) => (
				<Sfx key={i} name="pop" at={HUIT + i * 2} volume={0.05} />
			))}
			<Sfx name="stamp" at={DIX} volume={0.09} />
			<Sfx name="pop" at={POUSS} volume={0.09} />
			<Sfx name="pop" at={CHIM} volume={0.09} />
			<Sfx name="pop" at={POLL} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · SIGNES ═══════════════════════════════ */
const SP = {size: 340, x: 298, y: 0};
const sigPt = (x: number, y: number) => ({x: SP.x + (x * SP.size) / 400, y: SP.y + (y * SP.size) / 400});

export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const SIG = at('signes', 'signes');
	const ESS = at('signes', 'essoufflement');
	const EFF = at('signes', "l'effort");
	const RIEN = at('signes', 'rien');
	const TOUX = at('signes', 'toux');
	const CRA = at('signes', 'crachats');
	const MATIN = at('signes', 'matin');
	const BRON = at('signes', 'bronchites');
	const HIVER = at('signes', 'hiver');
	const BEAU = at('signes', 'beaucoup');
	const FUM = at('signes', 'fumeur');
	const face = sigPt(200, 140);
	const keys: CamKey[] = [
		{at: ESS - 2, s: 1.7, x: sigPt(200, 220).x, y: sigPt(200, 220).y, dur: 14},
		{at: TOUX - 2, s: 2.6, x: face.x + 40, y: face.y + 10, dur: 12},
		{at: MATIN - 4, s: 1.5, x: face.x + 80, y: face.y + 40, dur: 12},
		{at: BRON - 2, s: 1, dur: 16},
	];
	const breathless = frame >= ESS;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ESS + 1, EFF + 1, TOUX + 1, CRA + 1, HIVER + 1]} shakes={[TOUX + 2]}>
				<Head kicker="Les signes" kAt={SIG - 4} title="Petit à *petit*" tAt={SIG} />
				<Stage y={LAY.stageY} h={520} at={SIG + 2} bumps={[ESS, TOUX, HIVER]}>
					<ZoomCam keys={keys} w={936} h={520}>
						<Man
							x={SP.x}
							y={SP.y}
							size={SP.size}
							mood={breathless ? 'mal' : 'calme'}
							breath={breathless ? pant(frame, frame >= RIEN ? 4 : 5) : idle(frame)}
							sweat={fadeIn(frame, EFF, 8) * (frame < TOUX ? 1 : 0)}
							puffs={breathless && frame < TOUX - 4 ? 1 : 0}
							cough={frame >= TOUX && frame < CRA ? 1 : 0}
							sputum={frame >= CRA && frame < BRON ? 1 : 0}
						/>
						{frame >= EFF - 2 && frame < TOUX - 4 ? (
							<div style={{position: 'absolute', left: 100, top: 90, transform: `scale(${popAt(frame, EFF - 2)})`}}>
								<RunIcon size={150} />
							</div>
						) : null}
						{frame >= MATIN - 4 && frame < BRON - 2 ? (
							<div style={{position: 'absolute', left: 640, top: 30, transform: `scale(${popAt(frame, MATIN - 4)})`}}>
								<SunriseIcon size={140} />
							</div>
						) : null}
					</ZoomCam>
					{frame >= BRON - 2
						? Array.from({length: 12}, (_, i) => {
								const t = ((frame * 0.8 + i * 23) % 110) / 110;
								return (
									<div key={i} style={{position: 'absolute', left: 40 + ((i * 167) % 860), top: -30 + t * 520, opacity: fadeIn(frame, BRON - 2, 10) * Math.sin(t * Math.PI), transform: `rotate(${frame * 2 + i * 30}deg)`}}>
										<SnowPicto size={44 + (i % 3) * 14} />
									</div>
								);
							})
						: null}
					<StagePill from={EFF - 2} to={RIEN - 2} color={LPI.blue}>
						d'abord à l'effort
					</StagePill>
					<StagePill from={RIEN - 2} to={TOUX - 2}>
						puis pour un rien
					</StagePill>
					<StagePill from={TOUX + 4} to={CRA - 2} color={LPI.blue}>
						une toux qui dure
					</StagePill>
					<StagePill from={CRA - 2} to={MATIN - 2} color={LPI.sky}>
						des crachats
					</StagePill>
					<StagePill from={MATIN - 2} to={BRON - 2}>
						surtout le matin
					</StagePill>
					<StagePill from={HIVER - 2} color={LPI.sky}>
						chaque hiver
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1000}}>
					<CauseChip at={ESS} icon={<LungsPicto size={56} />} label="essoufflement" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1000}}>
					<CauseChip at={EFF} icon={<RunIcon size={56} />} label="à l'effort" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1110}}>
					<CauseChip at={TOUX} icon={<CoughIcon size={56} />} label="toux qui dure" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1110}}>
					<CauseChip at={CRA} icon={<SputumIcon size={56} />} label="crachats le matin" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1220}}>
					<CauseChip at={BRON} icon={<SnowPicto size={56} />} label="bronchites l'hiver" tone={LPI.sky} />
				</div>
				<Tape at={BEAU} y={1344} text="JUSTE LA TOUX DU FUMEUR ?" rot={-6} />
				<Stamp at={FUM + 8} x={380} y={1530} text="Non : un signe !" size={52} rot={-6} color={LPI.blue} />
			</Camera>
			<Sfx name="pop" at={ESS} volume={0.09} />
			<Sfx name="pop" at={EFF} volume={0.09} />
			<Sfx name="impact" at={TOUX} volume={0.08} />
			<Sfx name="pop" at={CRA} volume={0.09} />
			<Sfx name="tick" at={MATIN} volume={0.07} />
			<Sfx name="whoosh" at={BRON - 2} volume={0.06} />
			<Sfx name="pop" at={BRON} volume={0.09} />
			<Sfx name="whoosh" at={BEAU} volume={0.07} />
			<Sfx name="buzz" at={FUM + 8} volume={0.06} dur={14} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · DIAGNOSTIC ═══════════════════════════════ */
// Le patient souffle dans le tube du spiromètre : la courbe se trace, la courbe normale en pointillés, repère à
// 1 seconde : il a vidé moins de 70 % de son air (VEMS / CVF).
const DG = {size: 300, x: 20, y: 30};
const SPIRO = {x: 400, y: 72, w: 520};

export const Diagnostic: React.FC = () => {
	const frame = useCurrentFrame();
	const CONF = at('diag', 'confirmer');
	const SPI = at('diag', 'spirométrie');
	const PAT = at('diag', 'patient');
	const SOUF = at('diag', 'souffle');
	const TUBE = at('diag', 'tube');
	const SI = at('diag', 'si');
	const SEC = at('diag', 'seconde');
	const SOIX = at('diag', 'soixante-dix');
	const CENT = at('diag', 'cent');
	const OBST = at('diag', 'obstruées');
	const k = SPIRO.w / 560;
	const mouth = {x: DG.x + (200 * DG.size) / 400, y: DG.y + (150 * DG.size) / 400};
	const inlet = {x: SPIRO.x + 14 * k, y: SPIRO.y + 300 * k};
	const screen = {x: SPIRO.x + 290 * k, y: SPIRO.y + 180 * k};
	const keys: CamKey[] = [
		{at: SEC - 4, s: 1.65, x: screen.x, y: screen.y, dur: 14},
		{at: OBST + 6, s: 1, dur: 16},
	];
	const blowing = frame >= SOUF && frame < SI;
	const t = interpolate(frame, [SOUF, TUBE + 30], [0, 1], clamp);
	const hose = fadeIn(frame, PAT - 4, 8);
	const v1 = Math.round(exhaled(1, 1) * 100);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SPI + 1, SOUF + 1, SEC + 1, SOIX + 1, OBST + 1]} shakes={[OBST + 2]}>
				<Head kicker="Diagnostic" kAt={CONF - 4} title="La *spirométrie*" tAt={SPI - 2} />
				<Stage y={LAY.stageY} h={520} at={CONF} bumps={[SOUF, SOIX, OBST]}>
					<ZoomCam keys={keys} w={936} h={520}>
						<Man x={DG.x} y={DG.y} size={DG.size} mood={blowing ? 'mal' : 'calme'} breath={blowing ? 0.2 : idle(frame)} />
						{hose > 0 ? (
							<svg width={936} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}} opacity={hose}>
								<path d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`} fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
								<path d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`} fill="none" stroke={LPI.sky} strokeWidth={18} strokeLinecap="round" />
								{blowing ? (
									<path d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`} fill="none" stroke={LPI.paper} strokeWidth={9} strokeLinecap="round" strokeDasharray="4 22" strokeDashoffset={-frame * 6} />
								) : null}
								<rect x={mouth.x - 4} y={mouth.y - 14} width={34} height={28} rx={8} fill={LPI.blue} stroke={N} strokeWidth={5} />
							</svg>
						) : null}
						<div style={{position: 'absolute', left: SPIRO.x, top: SPIRO.y}}>
							<Spirometer width={SPIRO.w} t={t} copd={1} ref={fadeIn(frame, SI - 2, 10)} mark={fadeIn(frame, SEC - 2, 8)} blow={blowing ? 1 : 0} />
						</div>
					</ZoomCam>
					{frame >= SOIX - 2 ? (
						<div style={{position: 'absolute', left: 560, top: 400, transform: `scale(${popAt(frame, SOIX - 2)})`, padding: '8px 22px', borderRadius: 24, background: LPI.pink, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, whiteSpace: 'nowrap'}}>
							lui : {v1} % en 1 s
						</div>
					) : null}
					<StagePill from={SEC - 2} to={SOIX - 2} color={LPI.blue} y={440}>
						VEMS : l'air soufflé en 1 seconde
					</StagePill>
				</Stage>
				{frame >= OBST ? <Stamp at={OBST} x={300} y={560} text="Obstruées !" size={60} rot={-7} /> : null}
				<TermSlam index={0} at={SPI} term="Spirométrie" meaning="souffler le plus fort possible dans un tube" sign="device" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= SPI} />
				<TermSlam index={1} at={CENT} term="VEMS / CVF < 70 %" meaning="en 1 seconde, il vide moins de 70 % de son air" sign="down" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= CENT} />
			</Camera>
			<Sfx name="pop" at={PAT} volume={0.08} />
			<Sfx name="whoosh" at={SOUF} volume={0.08} />
			<Sfx name="tick" at={SEC} volume={0.08} />
			<Sfx name="pop" at={SOIX} volume={0.1} />
			<Sfx name="stamp" at={OBST} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · TRAITEMENT ═══════════════════════════════ */
// « Ne se guérit pas » ; on la freine : cigarette barrée ; inhalateur dont la bouffée rouvre la bronche ; on
// réentraîne le souffle (la respiration redevient ample) ; vaccins.
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const GUER = at('traitement', 'guérit');
	const FREIN = at('traitement', 'freiner');
	const ARR = at('traitement', 'arrêter');
	const BRONCHO = at('traitement', 'bronchodilatateurs');
	const INHAL = at('traitement', 'inhalateurs');
	const OUVR = at('traitement', 'ouvrent');
	const REHA = at('traitement', 'réhabilitation');
	const REENT = at('traitement', 'réentraîner');
	const VACC = at('traitement', 'vaccins');
	const panel = (a: number, b: number) => interpolate(frame, [a - 6, a, b - 6, b], [0, 1, 1, 0], clamp);
	const pSick = 1 - fadeIn(frame, ARR - 10, 6);
	const pSmoke = panel(ARR - 4, BRONCHO - 2);
	const pInh = panel(BRONCHO - 2, REHA - 2);
	const pReha = panel(REHA - 2, VACC - 2);
	const pVacc = fadeIn(frame, VACC - 4, 6);
	const open = interpolate(frame, [OUVR - 2, OUVR + 16], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FREIN + 1, ARR + 1, INHAL + 1, OUVR + 1, REHA + 1, VACC + 1]} shakes={[ARR + 8]}>
				<Head kicker="Traitement" kAt={GUER - 8} title="On la *freine*" tAt={FREIN - 4} />
				<Stage y={LAY.stageY} h={500} at={GUER - 6} bumps={[ARR, OUVR, VACC]}>
					{pSick > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: pSick}}>
							<Man x={318} y={0} size={300} mood="mal" breath={pant(frame, 4) * 0.6} lungs={1} bronchi={1} narrow={1} trapped={0.8} />
						</div>
					) : null}
					{pSmoke > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: pSmoke}}>
							<div style={{position: 'absolute', left: 318, top: 100}}>
								<CigaretteIcon size={300} />
							</div>
							<div style={{position: 'absolute', left: 468, top: 250}}>
								<Strike at={ARR + 6} width={360} rot={-35} />
							</div>
						</div>
					) : null}
					{pInh > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: pInh}}>
							<div style={{position: 'absolute', left: 20, top: 120, transform: `scale(${popAt(frame, BRONCHO)})`}}>
								<Inhaler width={190} press={interpolate(frame, [INHAL - 2, INHAL + 3, INHAL + 10], [0, 1, 0], clamp)} puff={interpolate(frame, [INHAL, INHAL + 4, OUVR + 30, OUVR + 40], [0, 1, 1, 0], clamp)} />
							</div>
							<div style={{position: 'absolute', left: 260, top: 70}}>
								<Bronchus width={660} inflame={1 - 0.6 * open} mucus={1 - open} narrow={1 - 0.75 * open} alveoli={0.9} damage={0.6} mist={interpolate(frame, [INHAL + 4, INHAL + 12, REHA - 8, REHA - 2], [0, 1, 1, 0], clamp)} airIn={open} />
							</div>
						</div>
					) : null}
					{pReha > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: pReha}}>
							<Man x={60} y={20} size={300} mood={frame >= REENT ? 'content' : 'calme'} breath={frame >= REENT ? idle(frame, 50) : pant(frame, 4) * 0.5} lungs={1} bronchi={1} narrow={0.5} />
							<div style={{position: 'absolute', left: 470, top: 120}}>
								<RunIcon size={200} />
							</div>
							<div style={{position: 'absolute', left: 640, top: 150, width: 260, height: 150, overflow: 'hidden'}}>
								<svg width={260} height={150}>
									<path
										d={Array.from({length: 53}, (_, i) => {
											const x = i * 5;
											const amp = frame >= REENT ? 50 : 18;
											return `${i ? 'L' : 'M'}${x} ${75 - amp * Math.sin((x + frame * (frame >= REENT ? 3 : 9)) / (frame >= REENT ? 22 : 9))}`;
										}).join(' ')}
										fill="none"
										stroke={LPI.blue}
										strokeWidth={8}
										strokeLinecap="round"
									/>
								</svg>
							</div>
						</div>
					) : null}
					{pVacc > 0 ? (
						<div style={{position: 'absolute', left: 340, top: 110, opacity: pVacc, transform: `scale(${popAt(frame, VACC - 4)})`}}>
							<SyringeIcon size={260} />
						</div>
					) : null}
					<StagePill from={OUVR - 2} to={REHA - 2} color={LPI.blue} y={420}>
						la bronche s'ouvre
					</StagePill>
					<StagePill from={REENT - 2} to={VACC - 2} color={LPI.sky} y={420}>
						réentraîner le souffle
					</StagePill>
				</Stage>
				<Stamp at={GUER} x={800} y={380} text="Ne se guérit pas" size={46} rot={-7} out={FREIN + 10} />
				<div style={{position: 'absolute', left: 72, top: 975, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
					<CheckChip at={ARR} label="Arrêt du tabac" size={38} />
					<CheckChip at={BRONCHO} label="Bronchodilatateurs" sub="inhalateurs : ouvrent les bronches" size={38} />
					<CheckChip at={REHA} label="Réhabilitation respiratoire" size={38} />
					<CheckChip at={VACC} label="Vaccins" sub="grippe, pneumocoque" size={38} />
				</div>
			</Camera>
			<Sfx name="stamp" at={GUER} volume={0.09} />
			<Sfx name="buzz" at={ARR + 6} volume={0.06} dur={12} />
			<Sfx name="pop" at={BRONCHO} volume={0.09} />
			<Sfx name="whoosh" at={INHAL} volume={0.08} />
			<Sfx name="ding" at={OUVR + 10} volume={0.07} />
			<Sfx name="pop" at={REHA} volume={0.09} />
			<Sfx name="pop" at={VACC} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 7 · OXYGÈNE ET EXACERBATION ═══════════════════════════════ */
// Lunettes à oxygène, SpO₂ qui remonte dans la cible 88 – 92 % (échelle des normes adulte + cadre « cible BPCO ») ;
// puis tout s'aggrave d'un coup : exacerbation (essoufflé, toux, crachats, SpO₂ qui chute), on consulte vite.
const OP = {size: 320, x: 60, y: 0};

export const Oxygene: React.FC = () => {
	const frame = useCurrentFrame();
	const AVA = at('oxygene', 'avancé');
	const OXY = at('oxygene', "l'oxygène");
	const PETIT = at('oxygene', 'petit');
	const VISE = at('oxygene', 'vise');
	const SAT = at('oxygene', 'saturation');
	const Q88 = at('oxygene', 'quatre-vingt-huit');
	const Q92 = at('oxygene', 'quatre-vingt-douze');
	const CENT = at('oxygene', 'cent');
	const AGG = at('oxygene', "s'aggrave");
	const EXA = at('oxygene', 'exacerbation');
	const CONS = at('oxygene', 'consulte');
	const keys: CamKey[] = [
		{at: OXY - 2, s: 2.2, x: OP.x + 160, y: OP.y + 150, dur: 14},
		{at: VISE - 4, s: 1, dur: 16},
		{at: AGG - 2, s: 1.5, x: OP.x + 200, y: OP.y + 200, dur: 10},
	];
	const worse = frame >= AGG;
	const sat = worse ? interpolate(frame, [AGG, AGG + 30], [90, 84], ease) : interpolate(frame, [SAT - 6, Q92 + 10], [85, 90], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[OXY + 1, PETIT + 1, Q88 + 1, Q92 + 1, AGG + 1, EXA + 1]} shakes={[AGG + 2]}>
				<Head kicker="Au stade avancé" kAt={AVA - 6} title="Oxygène à *petit* *débit*" tAt={OXY - 2} size={84} />
				<Stage y={LAY.stageY} h={520} at={AVA - 4} bumps={[OXY, AGG]}>
					<ZoomCam keys={keys} w={936} h={520}>
						<Man
							x={OP.x}
							y={OP.y}
							size={OP.size}
							mood={worse ? 'mal' : 'calme'}
							breath={worse ? pant(frame, 3.5) : idle(frame, 50)}
							cannula={fadeIn(frame, OXY - 2, 8)}
							sweat={worse ? 1 : 0}
							cough={frame >= AGG + 6 && frame < EXA ? 1 : 0}
							sputum={frame >= EXA - 4 && frame < CONS ? 1 : 0}
							cyanosis={worse ? fadeIn(frame, AGG + 10, 20) * 0.7 : 0}
						/>
					</ZoomCam>
					<div style={{position: 'absolute', left: 560, top: 40}}>
						<Screen at={SAT - 6} label="SpO₂" value={String(Math.round(sat))} unit="%" alert={sat < 88} />
					</div>
					<StagePill from={PETIT - 2} to={VISE - 4} color={LPI.blue} x={500} y={170}>
						petit débit
					</StagePill>
				</Stage>
				<NormScale zones={SPO_ZONES} value={sat} at={VISE} y={880} x={110} width={870} bracket={{lo: 88, hi: 92, label: 'cible BPCO : 88 – 92 %', at: Q88}} />
				<TermSlam index={0} at={CENT} term="SpO₂ : 88 – 92 %" meaning="pas plus : trop d'O₂ peut être dangereux" sign="check" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= CENT} />
				<TermSlam index={1} at={EXA} term="Exacerbation" meaning="une poussée : tout s'aggrave d'un coup" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= EXA} />
				<Stamp at={CONS} x={480} y={1440} text="On consulte vite !" size={54} rot={-6} />
			</Camera>
			<Flash at={AGG} max={0.35} />
			<Sfx name="whoosh" at={OXY - 2} volume={0.06} />
			<Sfx name="pop" at={PETIT} volume={0.08} />
			<Sfx name="tick" at={Q88} volume={0.08} />
			<Sfx name="tick" at={Q92} volume={0.08} />
			<Sfx name="impact" at={AGG} volume={0.1} />
			<Sfx name="buzz" at={AGG + 4} volume={0.05} dur={18} />
			<Sfx name="pop" at={EXA} volume={0.1} />
			<Sfx name="stamp" at={CONS} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="La *BPCO*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'inhalateurs') + 16}
		rows={[
			[at('outro', 'bpco'), 'squeeze', 'BPCO', 'bronches rétrécies · air piégé'],
			[at('outro', 'cause'), 'alert', 'Cause n° 1', 'le tabac (8 cas sur 10)'],
			[at('outro', 'confirme'), 'device', 'Diagnostic', 'spirométrie : VEMS / CVF < 70 %'],
			[at('outro', 'freine'), 'check', 'On la freine', 'arrêt du tabac · inhalateurs'],
		]}
	/>
);
