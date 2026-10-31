// Série « Les plaies », partie 1 : les bases. Accroche (coupure de papier guérie en 3 jours / escarre qui dure des
// mois : « deux plaies »), carte de la série (partie 1 / 3), définition (la peau = une barrière, elle s'ouvre, les
// microbes passent), les couches de la peau (une à une, puis la plaie qui s'enfonce), deux familles (aiguë /
// chronique sur une ligne du temps), simple ou grave (+ tétanos), récap + « à suivre ». Dessins : src/brand/wound.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CamKey, CauseChip, Head, RecapScene, SLAM_Y, StagePill, termSlot, ZoomCam} from '../../brand/episode';
import {BedIcon, SyringeIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {FlamePicto} from '../../brand/pictos';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {DepthGlyph, Finger, GermGlyph, LAYERS, LowerLeg, SKIN, SkinAt, SkinBox, SkinLabels, skinPt, WideGlyph, WoundTool, ZoneGlyph} from '../../brand/wound';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
/** paliers : la valeur rejoint vals[i] au mot marks[i] (en `d` frames) */
const steps = (frame: number, marks: number[], vals: number[], d = 10, from = 0) =>
	marks.reduce((v, m, i) => v + (vals[i] - (i ? vals[i - 1] : from)) * interpolate(frame, [m, m + d], [0, 1], ease), from);

const CheckBadge: React.FC<{size?: number}> = ({size = 54}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 52 L42 70 L76 32" fill="none" stroke={N} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Picto « couches de la peau ». */
export const LayersIcon: React.FC<{size?: number}> = ({size = 80}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={12} y={20} width={76} height={14} rx={4} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<rect x={12} y={34} width={76} height={20} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<rect x={12} y={54} width={76} height={26} rx={4} fill={LPI.sky} stroke={N} strokeWidth={5} />
	</svg>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « 3 jours… ou des mois ? », deux cartes : un doigt avec une coupure de papier, un talon avec une escarre.
// La caméra va de l'une à l'autre (la coupure se referme en 3 jours, l'escarre reste des mois), « deux plaies ».
const W = {x: 0, y: 470, w: 1080, h: 860};
const CARD = {w: 480, h: 640, y: 40};

const Card: React.FC<{x: number; label: string; children: React.ReactNode; tone?: string}> = ({x, label, children, tone = LPI.sky}) => (
	<div style={{position: 'absolute', left: x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 44, background: LPI.paper, border: `6px solid ${tone}`, boxShadow: SHADOW, overflow: 'hidden'}}>
		{children}
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center'}}>
			<div style={{padding: '6px 20px', borderRadius: 999, background: alpha(LPI.paper, 0.95), fontFamily: FONT.body, fontWeight: 900, fontSize: 32, letterSpacing: '0.12em', color: N}}>{label}</div>
		</div>
	</div>
);

const Counter: React.FC<{text: string; at: number; tone?: string}> = ({text, at: t0, tone = LPI.blue}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}>
			<div style={{padding: '10px 30px', borderRadius: 999, background: tone, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 48, transform: `scale(${frame >= t0 ? 1 + 0.18 * Math.exp(-(frame - t0) / 3) : 1})`, fontVariantNumeric: 'tabular-nums'}}>{text}</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const COUP = at('intro', 'coupure');
	const GUER = at('intro', 'guérie');
	const TROIS = at('intro', 'trois');
	const JOURS = at('intro', 'jours');
	const ESC = at('intro', 'escarre');
	const PARF = at('intro', 'parfois');
	const MOIS = at('intro', 'mois');
	const POUR = at('intro', 'pourtant');
	const PLAIES = at('intro', 'plaies');
	const keys: CamKey[] = [
		{at: COUP - 4, s: 1.45, x: 280, y: 380, dur: 16},
		{at: ESC - 4, s: 1.45, x: 800, y: 380, dur: 16},
		{at: POUR - 4, s: 1, dur: 16},
	];
	const heal = interpolate(frame, [GUER, JOURS + 10], [0, 1], ease);
	const day = frame < GUER ? 0 : frame < TROIS - 6 ? 1 : frame < JOURS - 2 ? 2 : 3;
	const month = frame < PARF ? 0 : Math.min(3, 1 + Math.floor((frame - PARF) / 8));
	const pulse = 1 + 0.05 * Math.sin(frame / 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[COUP + 1, JOURS + 1, ESC + 1, MOIS + 1, PLAIES + 1]} shakes={[PLAIES + 2]} strength={0.04}>
				{frame < POUR ? (
					<div style={{position: 'absolute', left: 72, top: 200, width: 936, opacity: 1 - fadeIn(frame, POUR - 6, 6)}}>
						<Title at={-20} text={'*3* *jours*…\nou des *mois* ?'} size={100} align="center" stagger={0} brush={false} />
					</div>
				) : null}
				{frame >= POUR - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 220, width: 936}}>
						<Title at={POUR - 2} text={'Et pourtant…\n*deux* *plaies*.'} size={100} align="center" stagger={3} brush={false} />
					</div>
				) : null}
				<div style={{position: 'absolute', left: W.x, top: W.y, width: W.w, height: W.h}}>
					<ZoomCam keys={keys} w={W.w} h={W.h} radius={0}>
						<Card x={40} label="COUPURE DE PAPIER">
							{frame < 24 ? <div style={{position: 'absolute', left: 250 + frame * 9, top: 160 - frame * 2, width: 200, height: 150, background: LPI.paper, border: `5px solid ${N}`, borderRadius: 8, transform: 'rotate(-28deg)', opacity: 1 - frame / 24}} /> : null}
							<div style={{position: 'absolute', left: -175, top: 175}}>
								<Finger width={640} cut={1} heal={heal} />
							</div>
							{heal >= 1 ? (
								<div style={{position: 'absolute', left: 330, top: 120, transform: `scale(${popAt(frame, JOURS + 10)})`, width: 92, height: 92, borderRadius: 46, background: LPI.sky, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<CheckBadge />
								</div>
							) : null}
							<Counter text={day ? `J + ${day}` : 'J 0'} at={day === 1 ? GUER : day === 2 ? TROIS - 6 : JOURS - 2} />
						</Card>
						<Card x={560} label="ESCARRE (TALON)" tone={LPI.pink}>
							<div style={{position: 'absolute', left: -82, top: -221}}>
								<LowerLeg width={560} heelSore={1.35 * pulse} />
							</div>
							<Counter text={month ? `${month} mois${month === 3 ? '…' : ''}` : '?'} at={PARF + (month - 1) * 8} tone={LPI.pink} />
						</Card>
					</ZoomCam>
				</div>
				<Stamp at={PLAIES} x={280} y={1150} text="Plaie" size={64} rot={-8} />
				<Stamp at={PLAIES + 5} x={800} y={1150} text="Plaie" size={64} rot={6} />
				<Burst at={PLAIES} x={540} y={1150} r={360} n={16} />
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.05} />
			<Sfx name="impact" at={COUP + 2} volume={0.07} />
			<Sfx name="tick" at={GUER} volume={0.08} />
			<Sfx name="tick" at={TROIS - 6} volume={0.08} />
			<Sfx name="ding" at={JOURS + 10} volume={0.08} />
			<Sfx name="whoosh" at={ESC - 4} volume={0.06} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="tick" at={PARF + i * 8} volume={0.08} />
			))}
			<Sfx name="buzz" at={MOIS} volume={0.05} dur={14} />
			<Sfx name="stamp" at={PLAIES} volume={0.1} />
			<Sfx name="stamp" at={PLAIES + 5} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const PARTS = [
	{title: 'Les bases', icon: <LayersIcon size={78} />},
	{title: 'Les plaies aiguës', icon: <WoundTool kind="knife" size={84} />},
	{title: 'Les plaies chroniques', icon: <BedIcon size={78} />},
];

export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const UN = at('serie', 'un');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const BASES = at('serie', 'bases');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, SERIE + 1, BASES + 1]} shakes={[UN + 2]}>
				<Head kicker="Série · Les plaies" kAt={NOUS - 4} title="Partie *1* sur 3" tAt={PART - 2} size={92} />
				<SeriesParts parts={PARTS} current={0} at={UN - 2} />
				{frame >= AUJ - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, AUJ - 2)})`}}>
						<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>
							Aujourd'hui : <span style={{color: LPI.blue}}>les bases</span>
						</div>
					</div>
				) : null}
			</Camera>
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="pop" at={UN - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={BASES} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// La peau s'ouvre (« ouverture »), puis se referme : « la peau est une barrière », les microbes tournent au-dessus
// sans entrer ; « quand elle s'ouvre » : elle s'ouvre à nouveau, ils passent, la plaie rougit (infection).
const DB: SkinBox = {x: 88, y: 112, w: 760};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAIE = at('def', 'plaie');
	const OUV = at('def', 'ouverture');
	const PEAU = at('def', 'peau');
	const OR = at('def', 'or');
	const BARR = at('def', 'barrière');
	const EMP = at('def', 'empêche');
	const MICR = at('def', 'microbes');
	const OUVRE = at('def', "s'ouvre");
	const PASS = at('def', 'passer');
	const INF = at('def', "s'infecter");
	const surf = skinPt(DB, SKIN.cx, SKIN.top);
	const depth = interpolate(frame, [OUV - 2, OUV + 10, OR, OR + 14, OUVRE - 4, OUVRE + 8], [0, 1.3, 1.3, 0, 0, 1.6], ease);
	const keys: CamKey[] = [
		{at: OUV - 4, s: 1.6, x: surf.x, y: surf.y + 40, dur: 16},
		{at: OR - 2, s: 1.15, x: surf.x, y: surf.y + 90, dur: 16},
		{at: OUVRE - 4, s: 1.7, x: surf.x, y: surf.y + 30, dur: 14},
		{at: INF - 4, s: 2, x: surf.x, y: surf.y + 40, dur: 14},
	];
	const germs = fadeIn(frame, EMP - 10, 10);
	const shield = fadeIn(frame, BARR - 4, 10) * (1 - fadeIn(frame, OUVRE - 6, 8));
	const infect = fadeIn(frame, INF - 2, 14);
	const throb = 0.5 + 0.5 * Math.sin(frame / 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[OUV + 1, BARR + 1, MICR + 1, OUVRE + 1, PASS + 1, INF + 1]} shakes={[OUVRE + 2, INF + 2]}>
				<Head kicker="Définition" kAt={PLAIE - 6} title="Une *plaie*" tAt={PLAIE} />
				<Stage y={440} h={540} at={PLAIE + 2} bumps={[OUV, BARR, OUVRE, INF]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt b={DB} depth={depth} shape="crater" germs={germs} microbes={interpolate(frame, [PASS - 10, PASS + 22], [0, 1], clamp)} />
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{/* la barrière : un liseré lumineux le long de la peau */}
							{shield > 0 ? <line x1={DB.x + 6} x2={DB.x + DB.w - 6} y1={surf.y - 4} y2={surf.y - 4} stroke={LPI.blue} strokeWidth={10 + 4 * throb} strokeLinecap="round" opacity={shield} /> : null}
							{/* infection : la plaie rougit et chauffe */}
							{infect > 0 ? <ellipse cx={surf.x} cy={surf.y + 30} rx={150 + 14 * throb} ry={60 + 8 * throb} fill={alpha(LPI.pink, 0.35 * infect)} stroke={LPI.pink} strokeWidth={6} strokeDasharray="14 10" opacity={infect} /> : null}
						</svg>
					</ZoomCam>
					<StagePill from={BARR - 2} to={OUVRE - 4} color={LPI.blue}>
						la peau = une barrière
					</StagePill>
					<StagePill from={OUVRE - 2} to={INF - 4}>
						ouverte : les microbes passent
					</StagePill>
					<StagePill from={INF - 2}>risque d'infection</StagePill>
				</Stage>
				<TermSlam index={0} at={PEAU} term="Plaie" meaning="une ouverture de la peau" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= PEAU} />
				{frame >= INF - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1200}}>
						<CauseChip at={INF - 2} icon={<GermGlyph size={56} />} label="peut s'infecter" />
					</div>
				) : null}
			</Camera>
			<Sfx name="whoosh" at={OUV - 4} volume={0.06} />
			<Sfx name="ding" at={BARR} volume={0.07} />
			<Sfx name="buzz" at={MICR} volume={0.04} dur={16} />
			<Sfx name="impact" at={OUVRE} volume={0.08} />
			<Sfx name="buzz" at={PASS} volume={0.04} dur={18} />
			<Sfx name="impact" at={INF} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LES COUCHES DE LA PEAU ═══════════════════════════════ */
// On présente chaque couche (gros plan + liseré rose), puis la plaie s'enfonce de couche en couche jusqu'à l'os.
const CB: SkinBox = {x: 18, y: 20, w: 900};
const CHAIN = ['épiderme', 'derme', 'hypoderme', 'muscle', 'os'];

const DepthChain: React.FC<{marks: number[]; y: number}> = ({marks, y}) => {
	const frame = useCurrentFrame();
	if (frame < marks[0] - 2) return null;
	const cur = marks.filter((m) => frame >= m - 2).length - 1;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
			{CHAIN.map((c, i) => {
				if (frame < marks[i] - 2) return null;
				const on = i === cur;
				return (
					<React.Fragment key={c}>
						{i > 0 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: alpha(N, 0.5), transform: `scale(${popAt(frame, marks[i] - 2)})`}}>›</div> : null}
						<div style={{padding: '10px 20px', borderRadius: 999, background: on ? LPI.pink : LPI.paper, border: `5px solid ${on ? N : LPI.sky}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, transform: `scale(${popAt(frame, marks[i] - 2) * (on ? 1.06 : 1)})`, boxShadow: on ? SHADOW : 'none'}}>{c}</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

export const Couches: React.FC = () => {
	const frame = useCurrentFrame();
	const COUCH = at('couches', 'couches');
	const SURF = at('couches', 'surface');
	const EPI = at('couches', "l'épiderme");
	const DERME = at('couches', 'derme');
	const VAIS = at('couches', 'vaisseaux');
	const NERFS = at('couches', 'nerfs');
	const HYPO = at('couches', "l'hypoderme");
	const GRAI = at('couches', 'graisse');
	const PROF = at('couches', 'profonde');
	const TRAV = at('couches', 'traverse');
	const COUCH2 = at('couches', 'couches', 2);
	const MUSC = at('couches', 'muscle');
	const OS = at('couches', "l'os");
	const layer = frame >= PROF - 4 ? -1 : frame >= HYPO - 4 ? 2 : frame >= DERME - 4 ? 1 : frame >= SURF - 4 ? 0 : -1;
	const cx = skinPt(CB, SKIN.cx, 0).x;
	const ly = (i: number) => skinPt(CB, 0, (LAYERS[i].y0 + LAYERS[i].y1) / 2).y;
	const keys: CamKey[] = [
		{at: SURF - 4, s: 2.2, x: cx, y: ly(0) + 20, dur: 16},
		{at: DERME - 4, s: 1.8, x: cx, y: ly(1), dur: 14},
		{at: HYPO - 4, s: 1.6, x: cx, y: ly(2), dur: 14},
		{at: PROF - 6, s: 1, dur: 18},
	];
	const depth = steps(frame, [PROF, TRAV, COUCH2, MUSC - 2, OS - 2], [1, 2, 3, 4, 4.9], 12);
	const band = (i: number) => {
		const a = skinPt(CB, 0, LAYERS[i].y0);
		const b = skinPt(CB, 0, LAYERS[i].y1);
		const k = 0.5 + 0.5 * Math.sin(frame / 4);
		return <rect x={CB.x + 4} y={a.y} width={CB.w - 8} height={b.y - a.y} rx={10} fill={alpha(LPI.pink, 0.12 + 0.1 * k)} stroke={LPI.pink} strokeWidth={6} />;
	};
	const marks = [EPI, DERME, HYPO, MUSC, OS];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EPI + 1, DERME + 1, HYPO + 1, PROF + 1, MUSC + 1, OS + 1]} shakes={[OS + 2]}>
				<Head kicker="La peau" kAt={COUCH - 8} title="Plusieurs *couches*" tAt={COUCH - 4} size={88} />
				<Stage y={440} h={540} at={COUCH - 6} bumps={[EPI, DERME, HYPO, PROF, OS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt b={CB} depth={depth} shape="crater" nerves={fadeIn(frame, NERFS - 4, 10)} />
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{layer >= 0 ? band(layer) : null}
						</svg>
						<div style={{position: 'absolute', left: CB.x, top: CB.y, fontFamily: FONT.title}}>
							<SkinLabels width={CB.w} labels={5 * fadeIn(frame, OS + 16, 14)} focus={4} />
						</div>
					</ZoomCam>
					<StagePill from={EPI - 2} to={DERME - 4} color={LPI.sky}>
						épiderme : la surface
					</StagePill>
					<StagePill from={VAIS - 2} to={HYPO - 4} color={LPI.pink}>
						derme : vaisseaux et nerfs
					</StagePill>
					<StagePill from={GRAI - 2} to={PROF - 4} color={LPI.sky}>
						hypoderme : la graisse
					</StagePill>
					<StagePill from={TRAV - 2} to={OS + 14} color={LPI.blue}>
						plus profonde = plus de couches
					</StagePill>
				</Stage>
				<DepthChain marks={marks} y={1040} />
			</Camera>
			{marks.map((m) => (
				<Sfx key={m} name="pop" at={m} volume={0.09} />
			))}
			<Sfx name="whoosh" at={PROF - 6} volume={0.06} />
			<Sfx name="impact" at={OS + 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · DEUX FAMILLES ═══════════════════════════════ */
// Ligne du temps en semaines : la plaie aiguë avance et se referme (✓) ; la chronique dépasse la zone 4 – 6 semaines.
const wx = (wk: number) => 160 + wk * 86;

export const Familles: React.FC = () => {
	const frame = useCurrentFrame();
	const CLASSE = at('familles', 'classe');
	const FAM = at('familles', 'familles');
	const AIG = at('familles', 'aiguës');
	const GUER = at('familles', 'guérissent');
	const SEM = at('familles', 'semaines');
	const CHRO = at('familles', 'chroniques');
	const TOUJ = at('familles', 'toujours');
	const REF = at('familles', 'refermées');
	const QUAT = at('familles', 'quatre');
	const SEM2 = at('familles', 'semaines', 2);
	const keys: CamKey[] = [
		{at: AIG - 4, s: 1.45, x: 400, y: 200, dur: 16},
		{at: CHRO - 4, s: 1.35, x: 560, y: 330, dur: 16},
		{at: QUAT - 4, s: 1.6, x: wx(5), y: 280, dur: 14},
		{at: SEM2 + 16, s: 1, dur: 16},
	];
	const a = interpolate(frame, [GUER - 2, SEM + 10], [0, 2.4], ease);
	const aSize = 1 - interpolate(frame, [GUER + 10, SEM + 10], [0, 1], ease);
	const c = interpolate(frame, [CHRO, SEM2 + 6], [0, 7.4], ease);
	const band = frame >= QUAT - 4 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
	const pulse = 1 + 0.08 * Math.sin(frame / 3.5);
	const wound = (x: number, y: number, s: number, tone: string) => (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<ellipse rx={52} ry={30} fill={tone} stroke={N} strokeWidth={6} />
			<path d="M-26 0 Q0 -12 26 0" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
		</g>
	);
	const tag = (text: string, t0: number, top: number, bg: string) =>
		frame >= t0 ? (
			<div style={{position: 'absolute', left: 14, top, transform: `scale(${popAt(frame, t0)})`}}>
				<div style={{padding: '6px 18px', borderRadius: 999, background: bg, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>{text}</div>
			</div>
		) : null;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FAM + 1, AIG + 1, CHRO + 1, QUAT + 1, SEM2 + 1]} shakes={[TOUJ + 2]}>
				<Head kicker="Deux familles" kAt={CLASSE - 6} title="*Aiguë* ou *chronique* ?" tAt={FAM - 4} size={84} />
				<Stage y={440} h={540} at={CLASSE} bumps={[AIG, CHRO, QUAT]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<rect x={wx(4)} y={70} width={wx(6) - wx(4)} height={400} rx={20} fill={alpha(LPI.pink, 0.16 + 0.2 * band)} stroke={alpha(LPI.pink, 0.8)} strokeWidth={4} strokeDasharray="12 10" />
							<text x={(wx(4) + wx(6)) / 2} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
								4 – 6 sem.
							</text>
							<line x1={wx(0)} x2={wx(8.4)} y1={470} y2={470} stroke={N} strokeWidth={6} strokeLinecap="round" />
							<path d={`M${wx(8.4) - 14} 458 L${wx(8.4)} 470 L${wx(8.4) - 14} 482`} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
							{[0, 2, 4, 6, 8].map((wk) => (
								<g key={wk}>
									<line x1={wx(wk)} x2={wx(wk)} y1={458} y2={482} stroke={N} strokeWidth={5} />
									<text x={wx(wk)} y={516} textAnchor="middle" fontFamily={FONT.body} fontWeight={800} fontSize={26} fill={alpha(N, 0.75)}>
										{wk ? `${wk} sem.` : '0'}
									</text>
								</g>
							))}
							<line x1={wx(0)} x2={wx(8)} y1={190} y2={190} stroke={alpha(N, 0.25)} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
							<line x1={wx(0)} x2={wx(8)} y1={350} y2={350} stroke={alpha(N, 0.25)} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
							{frame >= AIG - 4 ? (
								<>
									<line x1={wx(0)} x2={wx(a)} y1={190} y2={190} stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
									{aSize > 0.02 ? wound(wx(a), 190, aSize * popAt(frame, AIG - 4), LPI.sky) : null}
								</>
							) : null}
							{frame >= CHRO - 4 ? (
								<>
									<line x1={wx(0)} x2={wx(c)} y1={350} y2={350} stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
									{wound(wx(c), 350, pulse * popAt(frame, CHRO - 4), LPI.pink)}
								</>
							) : null}
						</svg>
						{tag('aiguë', AIG - 4, 120, LPI.sky)}
						{tag('chronique', CHRO - 4, 280, LPI.pink)}
						{aSize <= 0.02 ? (
							<div style={{position: 'absolute', left: wx(a) - 44, top: 146, width: 88, height: 88, borderRadius: 44, background: LPI.sky, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, SEM + 10)})`}}>
								<CheckBadge />
							</div>
						) : null}
						{frame >= TOUJ - 2 ? (
							<div style={{position: 'absolute', left: wx(c) - 150, top: 236, width: 300, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, TOUJ - 2)})`}}>
								<div style={{padding: '6px 18px', borderRadius: 999, background: N, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.paper, whiteSpace: 'nowrap'}}>{frame >= REF ? 'pas refermée' : 'toujours…'}</div>
							</div>
						) : null}
					</ZoomCam>
				</Stage>
				<TermSlam index={0} at={SEM} term="Plaie aiguë" meaning="guérit en quelques jours à quelques semaines" sign="check" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= SEM && frame < SEM2} />
				<TermSlam index={1} at={SEM2} term="Plaie chronique" meaning="pas refermée après 4 à 6 semaines" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= SEM2} />
			</Camera>
			<Sfx name="whoosh" at={GUER} volume={0.05} />
			<Sfx name="ding" at={SEM + 10} volume={0.08} />
			<Sfx name="whoosh" at={CHRO} volume={0.05} />
			<Sfx name="buzz" at={TOUJ} volume={0.05} dur={16} />
			<Sfx name="tick" at={QUAT} volume={0.08} />
			<Sfx name="tick" at={at('familles', 'six')} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · SIMPLE OU GRAVE ═══════════════════════════════ */
// À gauche la plaie devient profonde, étendue, souillée ; à droite le patient et les zones à risque (visage, mains,
// articulations). Avis médical, puis le vaccin contre le tétanos.
const GB: SkinBox = {x: 20, y: 150, w: 430};
const GP = {x: 560, y: 30, size: 300};
const gPt = (x: number, y: number) => ({x: GP.x + (x * GP.size) / 400, y: GP.y + (y * GP.size) / 400});

export const Gravite: React.FC = () => {
	const frame = useCurrentFrame();
	const SIMPLE = at('gravite', 'simple');
	const GRAVE = at('gravite', 'grave');
	const PROF = at('gravite', 'profonde');
	const ETEN = at('gravite', 'étendue');
	const SOUIL = at('gravite', 'souillée');
	const SALE = at('gravite', 'sale');
	const ZONE = at('gravite', 'zone');
	const VIS = at('gravite', 'visage');
	const MAIN = at('gravite', 'main');
	const ART = at('gravite', 'articulation');
	const LA = at('gravite', 'là', 2);
	const AVIS = at('gravite', 'avis');
	const VERIF = at('gravite', 'vérifie');
	const TET = at('gravite', 'tétanos');
	const skinC = skinPt(GB, SKIN.cx, 200);
	const face = gPt(200, 118);
	const hand = gPt(326, 466);
	const elbow = gPt(322, 380);
	const keys: CamKey[] = [
		{at: SIMPLE - 4, s: 1.7, x: skinC.x, y: skinC.y, dur: 16},
		{at: ZONE - 4, s: 1, dur: 16},
		{at: VIS - 4, s: 2.2, x: face.x, y: face.y + 20, dur: 14},
		{at: MAIN - 4, s: 2, x: hand.x - 20, y: hand.y - 20, dur: 14},
		{at: ART - 4, s: 1.6, x: elbow.x - 60, y: elbow.y - 40, dur: 14},
		{at: LA - 4, s: 1, dur: 16},
	];
	const ring = (p: {x: number; y: number}, t0: number, r = 46) => {
		if (frame < t0) return null;
		const k = 0.5 + 0.5 * Math.sin(frame / 4);
		return (
			<g key={`${p.x}-${p.y}`} transform={`translate(${p.x} ${p.y}) scale(${popAt(frame, t0)})`}>
				<circle r={r + 8 * k} fill={alpha(LPI.pink, 0.3)} />
				<circle r={r} fill="none" stroke={LPI.pink} strokeWidth={8} />
			</g>
		);
	};
	const tick = fadeIn(frame, TET + 4, 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[GRAVE + 1, PROF + 1, ETEN + 1, SOUIL + 1, ZONE + 1, AVIS + 1, TET + 1]} shakes={[AVIS + 2]}>
				<Head kicker="Signes de gravité" kAt={SIMPLE - 8} title="Simple ou *grave* ?" tAt={SIMPLE - 4} size={88} />
				<Stage y={440} h={540} at={SIMPLE - 6} bumps={[PROF, ETEN, SOUIL, ZONE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt
							b={GB}
							shape="crater"
							depth={interpolate(frame, [PROF - 4, PROF + 12], [1.1, 4.2], ease)}
							open={interpolate(frame, [ETEN - 4, ETEN + 12], [0.7, 1.5], ease)}
							germs={fadeIn(frame, SOUIL - 4, 6)}
							microbes={interpolate(frame, [SOUIL, SALE + 14], [0, 1], clamp)}
							dirt={fadeIn(frame, SALE - 4, 8)}
						/>
						<div style={{position: 'absolute', left: GP.x, top: GP.y}}>
							<Patient size={GP.size} mood={frame >= ZONE ? 'mal' : 'calme'} />
						</div>
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{ring(face, VIS - 2, 52)}
							{ring(hand, MAIN - 2, 34)}
							{ring(gPt(74, 466), MAIN + 2, 34)}
							{ring(elbow, ART - 2, 32)}
							{ring(gPt(78, 380), ART + 2, 32)}
						</svg>
					</ZoomCam>
					<StagePill from={SIMPLE - 2} to={PROF - 4} color={LPI.sky}>
						simple : petite, propre, superficielle
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={PROF} icon={<DepthGlyph size={56} />} label="profonde" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1010}}>
					<CauseChip at={ETEN} icon={<WideGlyph size={56} />} label="étendue" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={SOUIL} icon={<GermGlyph size={56} />} label="souillée (sale)" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1120}}>
					<CauseChip at={ZONE} icon={<ZoneGlyph size={56} />} label="zone à risque" />
				</div>
				<Stamp at={AVIS - 2} x={540} y={1300} text="Avis médical !" size={70} rot={-6} out={VERIF - 6} />
				{frame >= VERIF - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 30px 14px 16px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, transform: `scale(${popAt(frame, VERIF - 2)})`, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, whiteSpace: 'nowrap'}}>
							<div style={{width: 84, height: 84, borderRadius: 42, background: alpha(LPI.sky, 0.7), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<SyringeIcon size={64} />
							</div>
							Tétanos : vaccin à jour ?
							<div style={{width: 58, height: 58, borderRadius: 14, border: `5px solid ${N}`, background: tick > 0 ? LPI.sky : LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								{tick > 0 ? (
									<svg width={44} height={44} viewBox="0 0 100 100">
										<path d="M22 52 L42 72 L78 30" fill="none" stroke={N} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${tick} 1`} />
									</svg>
								) : null}
							</div>
						</div>
					</div>
				) : null}
			</Camera>
			{[PROF, ETEN, SOUIL, ZONE].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.09} />
			))}
			<Sfx name="whoosh" at={VIS - 4} volume={0.05} />
			<Sfx name="whoosh" at={MAIN - 4} volume={0.05} />
			<Sfx name="stamp" at={AVIS - 2} volume={0.1} />
			<Sfx name="pop" at={VERIF} volume={0.08} />
			<Sfx name="ding" at={TET + 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + À SUIVRE ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const DANS = at('outro', 'dans');
	const BRUL = at('outro', 'brûlure');
	return (
		<AbsoluteFill>
			<RecapScene
				title="Les *bases*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'grave') + 14}
				rows={[
					[at('outro', 'plaie'), 'wave', 'Une plaie', 'une ouverture de la peau'],
					[at('outro', 'aiguë'), 'check', 'Aiguë', 'guérit en jours ou semaines'],
					[at('outro', 'chronique'), 'alert', 'Chronique', 'pas refermée après 4 – 6 sem.'],
					[at('outro', 'simple'), 'alert', 'Grave si', 'profonde, sale, zone à risque'],
				]}
			/>
			<NextUp at={DANS - 2} part={2} title="Les plaies aiguës" teaser="… et la brûlure qui ne fait pas mal" icon={<FlamePicto size={96} />} />
			<Stamp at={at('outro', 'plus') - 2} x={760} y={1270} text="La plus grave !" size={56} rot={-6} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
			<Sfx name="pop" at={BRUL} volume={0.08} />
			<Sfx name="stamp" at={at('outro', 'plus') - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

