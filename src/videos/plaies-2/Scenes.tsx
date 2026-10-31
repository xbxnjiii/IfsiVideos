// Série « Les plaies », partie 2 : les plaies aiguës. Accroche (« Ce petit trou… plus dangereux qu'une grande
// coupure ? » : la caméra recule et montre la profondeur de la piqûre), carte de la série (partie 2 / 3),
// excoriation · coupure · lacération, piqûre · morsure · plaie chirurgicale (l'objet blesse la coupe de peau),
// brûlures par degrés, récap + « à suivre : partie 3 ». Dessins : src/brand/wound.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CamKey, Head, RecapScene, SLAM_Y, StagePill, termSlot, ZoomCam} from '../../brand/episode';
import {LegIcon, SunriseIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {FlamePicto} from '../../brand/pictos';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {depthY, SKIN, SkinAt, SkinBox, skinPt, WoundShape, WoundTool} from '../../brand/wound';
import {PARTS} from '../plaies-1/Scenes';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
const steps = (frame: number, marks: number[], vals: number[], d = 10, from = 0) =>
	marks.reduce((v, m, i) => v + (vals[i] - (i ? vals[i - 1] : from)) * interpolate(frame, [m, m + d], [0, 1], ease), from);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Ce petit trou… » ; deux cartes en coupe : une grande coupure (large, en surface) et un petit trou vu
// de près. « plus dangereux » : la caméra de droite recule, le trou est profond et les microbes y descendent.
const CARD = {w: 480, h: 700, y: 520};
const HB: SkinBox = {x: 10, y: 230, w: 460};

const Card: React.FC<{x: number; label: string; children: React.ReactNode; tone?: string}> = ({x, label, children, tone = LPI.sky}) => (
	<div style={{position: 'absolute', left: x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 44, background: LPI.paper, border: `6px solid ${tone}`, boxShadow: SHADOW, overflow: 'hidden'}}>
		{children}
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center'}}>
			<div style={{padding: '6px 20px', borderRadius: 999, background: alpha(LPI.paper, 0.95), fontFamily: FONT.body, fontWeight: 900, fontSize: 32, letterSpacing: '0.12em', color: N}}>{label}</div>
		</div>
	</div>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TROU = at('intro', 'trou');
	const DANG = at('intro', 'dangereux');
	const GRANDE = at('intro', 'grande');
	const COUP = at('intro', 'coupure');
	const POURQ = at('intro', 'pourquoi');
	const pinTop = skinPt(HB, SKIN.cx, SKIN.top);
	const right: CamKey[] = [
		{at: -1, s: 3.4, x: pinTop.x, y: pinTop.y - 10, dur: 1},
		{at: DANG - 6, s: 1, dur: 18},
	];
	const left: CamKey[] = [
		{at: -1, s: 1, dur: 1},
		{at: GRANDE - 4, s: 1.4, x: pinTop.x, y: pinTop.y + 30, dur: 14},
		{at: POURQ - 6, s: 1, dur: 14},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TROU + 1, DANG + 1, COUP + 1, POURQ + 1]} shakes={[DANG + 2, POURQ + 2]} strength={0.04}>
				{frame < DANG - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 220, width: 936, opacity: 1 - fadeIn(frame, DANG - 6, 4)}}>
						<Title at={-20} text={'Ce petit *trou*…'} size={110} align="center" stagger={0} brush={false} />
					</div>
				) : null}
				{frame >= DANG - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 190, width: 936}}>
						<Title at={DANG - 4} text={'… plus *dangereux* qu’une\ngrande *coupure* ?'} size={84} align="center" stagger={3} brush={false} />
					</div>
				) : null}
				<Card x={40} label="GRANDE COUPURE">
					<div style={{position: 'absolute', inset: 0, top: 0}}>
						<ZoomCam keys={left} w={CARD.w} h={CARD.h} radius={0}>
							<SkinAt b={HB} depth={1.5} shape="crater" open={2.4} />
						</ZoomCam>
					</div>
				</Card>
				<Card x={560} label="PETIT TROU" tone={LPI.pink}>
					<div style={{position: 'absolute', inset: 0}}>
						<ZoomCam keys={right} w={CARD.w} h={CARD.h} radius={0}>
							<SkinAt b={HB} depth={4.3} shape="pin" germs={fadeIn(frame, DANG - 4, 6)} microbes={interpolate(frame, [DANG, DANG + 30], [0, 1], clamp)} />
						</ZoomCam>
					</div>
				</Card>
				<Stamp at={POURQ - 2} x={540} y={1330} text="Pourquoi ?" size={80} rot={-5} />
				<Burst at={DANG} x={800} y={900} r={300} n={14} />
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.05} />
			<Sfx name="pop" at={TROU} volume={0.08} />
			<Sfx name="whoosh" at={DANG - 6} volume={0.07} />
			<Sfx name="impact" at={DANG + 2} volume={0.09} />
			<Sfx name="buzz" at={DANG + 10} volume={0.04} dur={18} />
			<Sfx name="stamp" at={POURQ - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
const Banner: React.FC<{at: number; y: number; children: React.ReactNode; tone?: string}> = ({at: t0, y, children, tone = LPI.blue}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${tone}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>{children}</div>
		</div>
	);
};

export const Serie: React.FC = () => {
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const DEUX = at('serie', 'deux');
	const AIG = at('serie', 'aiguës');
	const GUER = at('serie', 'guérissent');
	const SEM = at('serie', 'semaines');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, AIG + 1, SEM + 1]} shakes={[DEUX + 2]}>
				<Head kicker="Série · Les plaies" kAt={NOUS - 4} title="Partie *2* sur 3" tAt={PART - 2} size={92} />
				<SeriesParts parts={PARTS} current={1} at={DEUX - 2} />
				<Banner at={AIG - 2} y={1100}>
					Aujourd'hui : <span style={{color: LPI.blue}}>les plaies aiguës</span>
				</Banner>
				<Banner at={GUER - 2} y={1210} tone={LPI.sky}>
					guérissent en <span style={{color: LPI.blue}}>jours ou semaines</span>
				</Banner>
			</Camera>
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="pop" at={DEUX - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={AIG} volume={0.08} />
			<Sfx name="pop" at={GUER} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIES AIGUËS : la coupe de peau et l'objet ═══════════════════════════════ */
const AB: SkinBox = {x: 118, y: 150, w: 700};
const AK = AB.w / SKIN.w;
const SURF = AB.y + SKIN.top * AK;
const ACX = AB.x + SKIN.cx * AK;

/** L'objet qui blesse, posé au-dessus de la plaie. */
const Tool: React.FC<{kind: 'gravel' | 'knife' | 'tear' | 'nail' | 'teeth' | 'scalpel'; x: number; y: number; size: number; o?: number; bite?: number; scaleX?: number}> = ({kind, x, y, size, o = 1, bite = 0, scaleX = 1}) =>
	o > 0 ? (
		<div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scaleX(${scaleX})`}}>
			<WoundTool kind={kind} size={size} bite={bite} />
		</div>
	) : null;

// 1 · excoriation, coupure, lacération
export const Trauma1: React.FC = () => {
	const frame = useCurrentFrame();
	const DAB = at('trauma1', "d'abord");
	const EXC = at('trauma1', "l'excoriation");
	const ERAF = at('trauma1', 'éraflure');
	const FROT = at('trauma1', 'frotte');
	const SURFW = at('trauma1', 'surface');
	const ARR = at('trauma1', "s'arrache");
	const COUP = at('trauma1', 'coupure');
	const TRANCH = at('trauma1', 'tranchant');
	const NETS = at('trauma1', 'nets');
	const LAC = at('trauma1', 'lacération');
	const DECH = at('trauma1', 'déchirure');
	const IRR = at('trauma1', 'irréguliers');
	const seg = [0, COUP - 6, LAC - 6];
	const i = seg.filter((s) => frame >= s).length - 1;
	const shapes: WoundShape[] = ['scrape', 'cut', 'tear'];
	const depth = i === 0 ? interpolate(frame, [FROT, ARR + 10], [0, 1.15], ease) : i === 1 ? interpolate(frame, [TRANCH - 4, TRANCH + 8], [0, 2.3], ease) : interpolate(frame, [DECH - 4, DECH + 12], [0, 2.4], ease);
	const keys: CamKey[] = [
		{at: ERAF - 6, s: 1.6, x: ACX, y: SURF + 30, dur: 16},
		{at: COUP - 6, s: 1.5, x: ACX, y: SURF + 50, dur: 14},
		{at: LAC - 6, s: 1.5, x: ACX, y: SURF + 50, dur: 14},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EXC + 1, ARR + 1, COUP + 1, TRANCH + 1, LAC + 1, DECH + 1]} shakes={[TRANCH + 2, DECH + 2]}>
				<Head kicker="Plaies aiguës" kAt={DAB - 4} title="Frotter, couper, *déchirer*" tAt={DAB} size={80} />
				<Stage y={440} h={540} at={DAB + 2} bumps={[ARR, TRANCH, DECH]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt b={AB} depth={depth} shape={shapes[i]} />
						{i === 0 ? <Tool kind="gravel" x={ACX - 330 + interpolate(frame, [FROT - 4, ARR + 10], [0, 420], ease)} y={SURF - 172} size={220} o={fadeIn(frame, ERAF - 4, 8) * (1 - fadeIn(frame, COUP - 14, 8))} /> : null}
						{i === 1 ? <Tool kind="knife" x={ACX - 230} y={SURF - 115 - 70 * (1 - interpolate(frame, [TRANCH - 8, TRANCH + 2], [0, 1], ease)) - 120 * fadeIn(frame, NETS + 14, 10)} size={240} o={fadeIn(frame, COUP + 20, 8) * (1 - fadeIn(frame, NETS + 14, 10))} /> : null}
						{i === 2 ? <Tool kind="tear" x={ACX - 110} y={SURF - 200} size={220} o={fadeIn(frame, DECH - 8, 6)} scaleX={1 + 0.12 * Math.sin((frame - DECH) / 2.5)} /> : null}
					</ZoomCam>
					<StagePill from={SURFW - 2} to={COUP - 6} color={LPI.sky}>
						seule la surface s'arrache
					</StagePill>
					<StagePill from={NETS - 2} to={LAC - 6} color={LPI.blue}>
						bords nets, bien droits
					</StagePill>
					<StagePill from={IRR - 2}>bords irréguliers, en zigzag</StagePill>
				</Stage>
				<TermSlam index={0} at={EXC} term="Excoriation" meaning="une éraflure : seule la surface s'arrache" sign="wave" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= EXC && frame < COUP} />
				<TermSlam index={1} at={COUP} term="Coupure" meaning="objet tranchant : bords nets" sign="check" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= COUP && frame < LAC} />
				<TermSlam index={2} at={LAC} term="Lacération" meaning="une déchirure : bords irréguliers" sign="alert" slamY={SLAM_Y} slot={termSlot(2)} active={frame >= LAC} />
			</Camera>
			<Sfx name="whoosh" at={FROT - 4} volume={0.06} />
			<Sfx name="buzz" at={ARR} volume={0.04} dur={14} />
			<Sfx name="whoosh" at={TRANCH - 8} volume={0.07} />
			<Sfx name="impact" at={TRANCH + 2} volume={0.07} />
			<Sfx name="buzz" at={DECH + 2} volume={0.05} dur={14} />
		</AbsoluteFill>
	);
};

// 2 · piqûre (petite mais profonde), morsure (microbes), plaie chirurgicale (points)
export const Trauma2: React.FC = () => {
	const frame = useCurrentFrame();
	const PIQ = at('trauma2', 'piqûre');
	const POINTU = at('trauma2', 'pointu');
	const CLOU = at('trauma2', 'clou');
	const PETIT = at('trauma2', 'petit');
	const PROF = at('trauma2', 'profond');
	const MICR = at('trauma2', 'microbes');
	const DANG = at('trauma2', 'dangereux');
	const MORS = at('trauma2', 'morsure');
	const BOUCHE = at('trauma2', 'bouche');
	const MICR2 = at('trauma2', 'microbes', 2);
	const INF = at('trauma2', "s'infecte");
	const CHIR = at('trauma2', 'chirurgicale');
	const BLOC = at('trauma2', 'bloc');
	const PROPRE = at('trauma2', 'propre');
	const REF = at('trauma2', 'refermée');
	const POINTS = at('trauma2', 'points');
	const seg = [0, MORS - 8, CHIR - 10];
	const i = seg.filter((s) => frame >= s).length - 1;
	const shapes: WoundShape[] = ['pin', 'bite', 'cut'];
	const depth = i === 0 ? steps(frame, [CLOU - 2, PROF - 4], [1, 4.1], 10) : i === 1 ? interpolate(frame, [MORS - 2, MORS + 8], [0, 2.6], ease) : interpolate(frame, [CHIR, CHIR + 12], [0, 2.6], ease);
	const keys: CamKey[] = [
		{at: CLOU - 6, s: 2.1, x: ACX, y: SURF + 20, dur: 14},
		{at: PROF - 6, s: 1, dur: 18},
		{at: MORS - 8, s: 1.5, x: ACX, y: SURF + 20, dur: 14},
		{at: CHIR - 10, s: 1.6, x: ACX, y: SURF + 40, dur: 14},
		{at: POINTS + 16, s: 1.15, x: ACX, y: SURF + 60, dur: 16},
	];
	const infect = i === 1 ? fadeIn(frame, INF - 2, 12) : 0;
	const throb = 0.5 + 0.5 * Math.sin(frame / 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CLOU + 1, PROF + 1, DANG + 1, MORS + 1, INF + 1, CHIR + 1, POINTS + 1]} shakes={[DANG + 2, MORS + 2]}>
				<Head kicker="Plaies aiguës" kAt={PIQ - 6} title="Piquer, mordre, *opérer*" tAt={PIQ - 2} size={80} />
				<Stage y={440} h={540} at={PIQ} bumps={[CLOU, PROF, MORS, CHIR, POINTS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt
							b={AB}
							depth={depth}
							shape={shapes[i]}
							sutured={i === 2 ? interpolate(frame, [REF, POINTS + 16], [0, 1], clamp) : 0}
							germs={i === 0 ? fadeIn(frame, MICR - 8, 6) : i === 1 ? fadeIn(frame, BOUCHE - 4, 6) : 0}
							microbes={i === 0 ? interpolate(frame, [MICR - 2, MICR + 30], [0, 1], clamp) : i === 1 ? interpolate(frame, [MICR2 - 2, MICR2 + 26], [0, 1], clamp) : 0}
						/>
						{i === 0 ? <Tool kind="nail" x={ACX - 110} y={AB.y + depthY(depth) * AK - 211 - 140 * (1 - fadeIn(frame, POINTU - 4, 10)) - 60 * fadeIn(frame, MORS - 18, 8)} size={220} o={fadeIn(frame, POINTU - 6, 8) * (1 - fadeIn(frame, MORS - 18, 8))} /> : null}
						{i === 1 ? <Tool kind="teeth" x={ACX - 120} y={SURF - 156 - 40 * (1 - fadeIn(frame, MORS - 8, 8))} size={240} bite={interpolate(frame, [MORS - 4, MORS + 2], [0, 1], clamp)} o={1 - fadeIn(frame, MICR2 - 6, 8)} /> : null}
						{i === 2 ? <Tool kind="scalpel" x={ACX - 190 + interpolate(frame, [CHIR - 10, CHIR + 8], [-160, 0], ease)} y={SURF - 128} size={220} o={1 - fadeIn(frame, PROPRE - 4, 8)} /> : null}
						{infect > 0 ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<ellipse cx={ACX} cy={SURF + 30} rx={200 + 14 * throb} ry={70 + 8 * throb} fill={alpha(LPI.pink, 0.3 * infect)} stroke={LPI.pink} strokeWidth={6} strokeDasharray="14 10" opacity={infect} />
							</svg>
						) : null}
					</ZoomCam>
					<StagePill from={PETIT - 2} to={PROF - 4} color={LPI.sky}>
						un tout petit trou…
					</StagePill>
					<StagePill from={PROF - 2} to={DANG - 2} color={LPI.blue}>
						… mais profond !
					</StagePill>
					<StagePill from={DANG - 2} to={MORS - 8}>
						les microbes vont loin
					</StagePill>
					<StagePill from={INF - 2} to={CHIR - 10}>
						risque d'infection
					</StagePill>
					<StagePill from={BLOC - 2} to={REF - 2} color={LPI.sky}>
						au bloc opératoire, propre
					</StagePill>
					<StagePill from={REF - 2} color={LPI.blue}>
						refermée par des points
					</StagePill>
				</Stage>
				<TermSlam index={0} at={PIQ} term="Piqûre" meaning="objet pointu : petit trou, mais profond" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= PIQ && frame < MORS} />
				<TermSlam index={1} at={MORS} term="Morsure" meaning="pleine de microbes : s'infecte facilement" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= MORS && frame < CHIR} />
				<TermSlam index={2} at={CHIR} term="Plaie chirurgicale" meaning="faite au bloc, refermée par des points" sign="check" slamY={SLAM_Y} slot={termSlot(2)} active={frame >= CHIR} />
			</Camera>
			<Sfx name="pop" at={CLOU} volume={0.08} />
			<Sfx name="whoosh" at={PROF - 6} volume={0.06} />
			<Sfx name="impact" at={PROF} volume={0.08} />
			<Sfx name="buzz" at={MICR} volume={0.04} dur={18} />
			<Sfx name="impact" at={MORS} volume={0.09} />
			<Sfx name="buzz" at={MICR2} volume={0.04} dur={18} />
			<Sfx name="whoosh" at={CHIR - 8} volume={0.05} />
			{[0, 8, 16].map((d) => (
				<Sfx key={d} name="tick" at={REF + d} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ BRÛLURES ═══════════════════════════════ */
const BB: SkinBox = {x: 58, y: 70, w: 820};
const BK = BB.w / SKIN.w;
const BSURF = BB.y + SKIN.top * BK;
const BCX = BB.x + SKIN.cx * BK;

export const Brulures: React.FC = () => {
	const frame = useCurrentFrame();
	const BRUL = at('brulures', 'brûlures');
	const PREM = at('brulures', 'premier');
	const SURFW = at('brulures', 'surface');
	const ROUGE = at('brulures', 'rouge');
	const MAL = at('brulures', 'mal');
	const SOLEIL = at('brulures', 'soleil');
	const DEUX = at('brulures', 'deuxième');
	const CLOQ = at('brulures', 'cloques');
	const PHLY = at('brulures', 'phlyctènes');
	const TROIS = at('brulures', 'troisième');
	const DETR = at('brulures', 'détruite');
	const MAL2 = at('brulures', 'mal', 2);
	const NERFS = at('brulures', 'nerfs');
	const POUR = at('brulures', 'pourtant');
	const GRAVE = at('brulures', 'grave');
	const burn = steps(frame, [ROUGE - 6, CLOQ - 4, DETR - 6], [1, 2, 3], 14);
	const keys: CamKey[] = [
		{at: PREM - 4, s: 1.7, x: BCX, y: BSURF + 30, dur: 16},
		{at: DEUX - 4, s: 1.5, x: BCX, y: BSURF, dur: 14},
		{at: TROIS - 4, s: 1.12, x: BCX, y: 280, dur: 16},
		{at: NERFS - 4, s: 1.8, x: BB.x + 640 * BK, y: BB.y + 130 * BK, dur: 14},
		{at: POUR - 4, s: 1, dur: 16},
	];
	const flame = fadeIn(frame, BRUL - 2, 8) * (1 - fadeIn(frame, TROIS + 40, 10));
	const flick = 1 + 0.08 * Math.sin(frame * 1.3) + 0.04 * Math.sin(frame * 2.9);
	const deg = burn < 1.5 ? 1 : burn < 2.5 ? 2 : 3;
	const bracketY = BB.y + depthY(deg === 1 ? 1 : deg === 2 ? 2 : 2.4) * BK;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PREM + 1, ROUGE + 1, DEUX + 1, CLOQ + 1, TROIS + 1, DETR + 1, NERFS + 1, GRAVE + 1]} shakes={[DETR + 2, GRAVE + 2]}>
				<Head kicker="Les brûlures" kAt={BRUL - 6} title="Trois *degrés*" tAt={BRUL} size={88} />
				<Stage y={440} h={540} at={BRUL} bumps={[ROUGE, CLOQ, DETR]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt b={BB} burn={burn} nerves={1} pain={fadeIn(frame, MAL - 2, 6) * (1 - fadeIn(frame, DETR - 4, 10))} nervesBurnt={fadeIn(frame, NERFS - 2, 10)} />
						{flame > 0 ? (
							<div style={{position: 'absolute', left: BCX - 60, top: BSURF - 140, opacity: flame, transform: `scale(${flick})`, transformOrigin: '50% 100%'}}>
								<FlamePicto size={120} />
							</div>
						) : null}
						{burn > 0.3 ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<path d={`M${BB.x + BB.w + 10} ${BSURF} H${BB.x + BB.w + 30} V${bracketY} H${BB.x + BB.w + 10}`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinejoin="round" />
								<text x={BB.x + BB.w + 40} y={(BSURF + bracketY) / 2 + 12} fontFamily={FONT.title} fontWeight={900} fontSize={36} fill={N}>
									{deg === 1 ? '1er' : `${deg}e`}
								</text>
							</svg>
						) : null}
					</ZoomCam>
					{frame >= SOLEIL - 2 && frame < DEUX - 4 ? (
						<div style={{position: 'absolute', left: 720, top: 24, transform: `scale(${popAt(frame, SOLEIL - 2)})`}}>
							<SunriseIcon size={150} />
						</div>
					) : null}
					<StagePill from={SURFW - 2} to={MAL - 2} color={LPI.sky}>
						seulement l'épiderme
					</StagePill>
					<StagePill from={MAL - 2} to={DEUX - 4}>
						rouge, ça fait mal
					</StagePill>
					<StagePill from={PHLY - 2} to={TROIS - 4} color={LPI.sky}>
						phlyctène = cloque
					</StagePill>
					<StagePill from={DETR - 2} to={MAL2 - 2} color={LPI.blue}>
						toute la peau est détruite
					</StagePill>
					<StagePill from={MAL2 - 2} to={NERFS - 2} color={LPI.blue}>
						ne fait plus mal…
					</StagePill>
					<StagePill from={NERFS - 2}>… car les nerfs sont brûlés</StagePill>
				</Stage>
				<TermSlam index={0} at={PREM} term="1er degré" meaning="rougeur douloureuse (coup de soleil)" sign="up" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= PREM && frame < DEUX} />
				<TermSlam index={1} at={DEUX} term="2e degré" meaning="cloques = phlyctènes" sign="up" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= DEUX && frame < TROIS} />
				<TermSlam index={2} at={TROIS} term="3e degré" meaning="peau détruite · ne fait plus mal" sign="alert" slamY={SLAM_Y} slot={termSlot(2)} active={frame >= TROIS} />
				<Stamp at={GRAVE - 2} x={720} y={560} text="La plus grave !" size={64} rot={-7} />
			</Camera>
			<Sfx name="whoosh" at={BRUL} volume={0.06} />
			<Sfx name="buzz" at={MAL} volume={0.04} dur={14} />
			<Sfx name="pop" at={CLOQ + 4} volume={0.09} />
			<Sfx name="impact" at={DETR} volume={0.09} />
			<Sfx name="buzz" at={NERFS} volume={0.04} dur={12} />
			<Sfx name="stamp" at={GRAVE - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + À SUIVRE ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const DANS = at('outro', 'dans');
	return (
		<AbsoluteFill>
			<RecapScene
				title="Les plaies *aiguës*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'brûlure') + 14}
				rows={[
					[at('outro', 'excoriation'), 'wave', 'Excoriation', 'éraflure en surface'],
					[at('outro', 'coupure'), 'check', 'Coupure', 'bords nets'],
					[at('outro', 'lacération'), 'alert', 'Lacération', 'déchirure, bords irréguliers'],
					[at('outro', 'piqûre'), 'alert', 'Piqûre · morsure', 'microbes : infection'],
					[at('outro', 'chirurgicale'), 'check', 'Chirurgicale', 'faite au bloc, suturée'],
					[at('outro', 'brûlure'), 'up', 'Brûlure', '1er · 2e · 3e degré'],
				]}
			/>
			<NextUp at={DANS - 2} part={3} title="Les plaies chroniques" teaser="… dont une qu'on ne sent même pas" icon={<LegIcon size={96} />} y={1230} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
			<Sfx name="pop" at={at('outro', 'sent')} volume={0.08} />
		</AbsoluteFill>
	);
};
