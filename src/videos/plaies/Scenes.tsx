// Scènes de « Les différents types de plaies » : accroche (coupure de papier guérie en 3 jours / escarre qui dure des
// mois), définition dans une coupe de peau (la plaie s'enfonce couche par couche), deux familles (aiguë / chronique sur
// une ligne du temps), plaies aiguës (éraflure, coupure, lacération, piqûre, morsure, chirurgicale : l'objet blesse la
// coupe de peau), brûlures par degrés, plaies chroniques (escarre écrasée entre l'os et le matelas, ulcère de jambe,
// pied diabétique), 4 stades d'escarre, signes de gravité, récap. Dessins : src/brand/wound.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CamKey, CauseChip, Head, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {BedIcon, DiabetesIcon, LegIcon, ScalpelIcon, SunriseIcon, SyringeIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {FlamePicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {DepthGlyph, depthY, Finger, GermGlyph, LEG_PTS, LowerLeg, LYING_PTS, LyingBody, SKIN, SkinBlock, SkinLabels, Squeeze, WideGlyph, WoundShape, WoundTool, ZoneGlyph} from '../../brand/wound';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** ressort sans hook (utilisable dans une boucle) */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
/** paliers : la valeur rejoint vals[i] au mot marks[i] (en `d` frames) */
const steps = (frame: number, marks: number[], vals: number[], d = 10, from = 0) =>
	marks.reduce((v, m, i) => v + (vals[i] - (i ? vals[i - 1] : from)) * interpolate(frame, [m, m + d], [0, 1], ease), from);

/** Pastille posée dans le socle (bas gauche), visible de `from` à `to`. */
const StagePill: React.FC<{from: number; to?: number; children: React.ReactNode; color?: string; x?: number; y?: number}> = ({from, to = 1e9, children, color, x = 30, y = 460}) => {
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

/** Coupe de peau posée en (x, y), largeur w ; `pt` : point de la coupe → coordonnées du socle. */
type Box = {x: number; y: number; w: number};
const skinPt = (b: Box, x: number, y: number) => ({x: b.x + (x * b.w) / SKIN.w, y: b.y + (y * b.w) / SKIN.w});
const Skin: React.FC<{b: Box} & React.ComponentProps<typeof SkinBlock>> = ({b, ...p}) => (
	<div style={{position: 'absolute', left: b.x, top: b.y}}>
		<SkinBlock width={b.w} {...p} />
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « 3 jours… ou des mois ? », deux cartes : un doigt avec une coupure de papier, un talon avec une escarre.
// La caméra va de l'une à l'autre (la coupure se referme en 3 jours, l'escarre reste des mois), « deux plaies »
// (tampons), puis les 6 types de plaies apparaissent en pastilles.
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

/** Compteur (J+1, 2 mois…) en bas d'une carte. */
const Counter: React.FC<{text: string; at: number; tone?: string}> = ({text, at: t0, tone = LPI.blue}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}>
			<div style={{padding: '10px 30px', borderRadius: 999, background: tone, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 48, transform: `scale(${frame >= t0 ? 1 + 0.18 * Math.exp(-(frame - t0) / 3) : 1})`, fontVariantNumeric: 'tabular-nums'}}>{text}</div>
		</div>
	);
};

const TYPES: {label: string; icon: React.ReactNode}[] = [
	{label: 'coupure', icon: <WoundTool kind="knife" size={120} />},
	{label: 'brûlure', icon: <FlamePicto size={110} />},
	{label: 'morsure', icon: <WoundTool kind="teeth" size={120} />},
	{label: 'piqûre', icon: <WoundTool kind="nail" size={120} />},
	{label: 'escarre', icon: <BedIcon size={120} />},
	{label: 'ulcère', icon: <LegIcon size={120} />},
];

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
	const DEUX = at('intro', 'deux');
	const PLAIES = at('intro', 'plaies');
	const ALORS = at('intro', 'alors');
	const DIFF = at('intro', 'différents');
	const TYPES_ = at('intro', 'types');
	const keys: CamKey[] = [
		{at: COUP - 4, s: 1.45, x: 280, y: 380, dur: 14},
		{at: ESC - 4, s: 1.45, x: 800, y: 380, dur: 14},
		{at: POUR - 4, s: 1, dur: 14},
	];
	const heal = interpolate(frame, [GUER, JOURS + 8], [0, 1], ease);
	const day = frame < GUER ? 0 : frame < TROIS - 6 ? 1 : frame < JOURS - 2 ? 2 : 3;
	const month = frame < PARF ? 0 : Math.min(3, 1 + Math.floor((frame - PARF) / 7));
	const cardsOut = interpolate(frame, [ALORS - 4, ALORS + 6], [1, 0], ease);
	const pulse = 1 + 0.05 * Math.sin(frame / 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[COUP + 1, JOURS + 1, ESC + 1, MOIS + 1, PLAIES + 1, TYPES_ + 1]} shakes={[PLAIES + 2]} strength={0.04}>
				{frame < POUR ? (
					<div style={{position: 'absolute', left: 72, top: 200, width: 936, opacity: 1 - fadeIn(frame, POUR - 6, 6)}}>
						<Title at={-20} text={'*3* *jours*…\nou des *mois* ?'} size={100} align="center" stagger={0} brush={false} />
					</div>
				) : null}
				{frame >= POUR - 2 && frame < ALORS ? (
					<div style={{position: 'absolute', left: 72, top: 220, width: 936, opacity: 1 - fadeIn(frame, ALORS - 6, 6)}}>
						<Title at={POUR - 2} text={'Pourtant…\n*deux* *plaies*.'} size={100} align="center" stagger={3} brush={false} />
					</div>
				) : null}
				{frame >= ALORS - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 220, width: 936}}>
						<Title at={ALORS - 2} text={'Les différents\n*types* de *plaies* ?'} size={96} align="center" stagger={3} />
					</div>
				) : null}
				{cardsOut > 0 ? (
					<div style={{position: 'absolute', left: W.x, top: W.y, width: W.w, height: W.h, opacity: cardsOut, transform: `scale(${0.8 + 0.2 * cardsOut})`}}>
						<ZoomCam keys={keys} w={W.w} h={W.h} radius={0}>
							<Card x={40} label="COUPURE DE PAPIER">
								{frame < 24 ? (
									<div style={{position: 'absolute', left: 250 + frame * 9, top: 160 - frame * 2, width: 200, height: 150, background: LPI.paper, border: `5px solid ${N}`, borderRadius: 8, transform: 'rotate(-28deg)', opacity: 1 - frame / 24}} />
								) : null}
								<div style={{position: 'absolute', left: -175, top: 175}}>
									<Finger width={640} cut={1} heal={heal} />
								</div>
								{heal >= 1 ? (
									<div style={{position: 'absolute', left: 330, top: 140, transform: `scale(${popAt(frame, JOURS + 8)})`, width: 92, height: 92, borderRadius: 46, background: LPI.sky, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<svg width={56} height={56} viewBox="0 0 100 100">
											<path d="M24 52 L42 70 L76 32" fill="none" stroke={N} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>
								) : null}
								<Counter text={day ? `J + ${day}` : 'J 0'} at={day === 1 ? GUER : day === 2 ? TROIS - 6 : JOURS - 2} />
							</Card>
							<Card x={560} label="ESCARRE (TALON)" tone={LPI.pink}>
								<div style={{position: 'absolute', left: -82, top: -221}}>
									<LowerLeg width={560} heelSore={1.35 * pulse} />
								</div>
								<Counter text={month ? `${month} mois${month === 3 ? '…' : ''}` : '?'} at={PARF + (month - 1) * 7} tone={LPI.pink} />
							</Card>
						</ZoomCam>
					</div>
				) : null}
				{cardsOut > 0 ? (
					<>
						<Stamp at={PLAIES} x={280} y={1150} text="Plaie" size={64} rot={-8} out={ALORS - 4} />
						<Stamp at={PLAIES + 5} x={800} y={1150} text="Plaie" size={64} rot={6} out={ALORS - 4} />
					</>
				) : null}
				{frame >= DIFF - 2
					? TYPES.map((t, i) => {
							const p = popAt(frame, DIFF - 2 + i * 4);
							const x = 100 + (i % 3) * 300;
							const y = 620 + Math.floor(i / 3) * 360;
							return (
								<div key={t.label} style={{position: 'absolute', left: x, top: y, width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${p})`}}>
									<div style={{width: 230, height: 230, borderRadius: 115, background: i % 2 ? alpha(LPI.pink, 0.55) : alpha(LPI.sky, 0.85), border: `7px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>{t.icon}</div>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{t.label}</div>
								</div>
							);
						})
					: null}
				<Burst at={PLAIES} x={540} y={1150} r={360} n={16} />
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.05} />
			<Sfx name="impact" at={COUP + 2} volume={0.07} />
			<Sfx name="tick" at={GUER} volume={0.08} />
			<Sfx name="tick" at={TROIS - 6} volume={0.08} />
			<Sfx name="ding" at={JOURS + 8} volume={0.08} />
			<Sfx name="whoosh" at={ESC - 4} volume={0.06} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="tick" at={PARF + i * 7} volume={0.08} />
			))}
			<Sfx name="buzz" at={MOIS} volume={0.05} dur={14} />
			<Sfx name="stamp" at={PLAIES} volume={0.1} />
			<Sfx name="stamp" at={PLAIES + 5} volume={0.08} />
			{TYPES.map((t, i) => (
				<Sfx key={t.label} name="pop" at={DIFF - 2 + i * 4} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// Coupe de peau : les microbes tournent au-dessus de la peau intacte ; « ouverture » : la peau s'ouvre, ils entrent ;
// puis la plaie s'enfonce couche par couche (épiderme, derme, graisse, muscle, os), la caméra descend avec elle.
const DB: Box = {x: 18, y: 18, w: 900};
const CHAIN = ['épiderme', 'derme', 'graisse', 'muscle', 'os'];

/** Les couches en chaîne (fiche sous le socle) : celle en cours en rose. */
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
						<div style={{padding: '10px 22px', borderRadius: 999, background: on ? LPI.pink : LPI.paper, border: `5px solid ${on ? N : LPI.sky}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N, transform: `scale(${popAt(frame, marks[i] - 2) * (on ? 1.06 : 1)})`, boxShadow: on ? SHADOW : 'none'}}>{c}</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAIE = at('def', 'plaie');
	const OUV = at('def', 'ouverture');
	const PEAU = at('def', 'peau');
	const BARR = at('def', 'barrière');
	const MICR = at('def', 'microbes');
	const ROMP = at('def', 'rompue');
	const PROF = at('def', 'profonde');
	const EPI = at('def', "l'épiderme");
	const DERME = at('def', 'derme');
	const GRAI = at('def', 'graisse');
	const MUSC = at('def', 'muscle');
	const OS = at('def', "l'os");
	const marks = [EPI, DERME, GRAI, MUSC, OS];
	const depth = steps(frame, [OUV - 2, DERME - 2, GRAI - 2, MUSC - 2, OS - 2], [1, 2, 3, 4, 4.9]);
	const focusY = (d: number) => skinPt(DB, SKIN.cx, depthY(d)).y;
	const cx = skinPt(DB, SKIN.cx, 0).x;
	const keys: CamKey[] = [
		{at: OUV - 4, s: 1.7, x: cx, y: focusY(1) - 10, dur: 14},
		{at: DERME - 4, s: 1.6, x: cx, y: focusY(2), dur: 12},
		{at: GRAI - 4, s: 1.45, x: cx, y: focusY(3), dur: 12},
		{at: MUSC - 4, s: 1.3, x: cx, y: focusY(4), dur: 12},
		{at: OS + 8, s: 1, dur: 16},
	];
	const germs = fadeIn(frame, BARR - 6, 8) * (1 - fadeIn(frame, PROF, 10));
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[OUV + 1, ROMP + 1, DERME + 1, GRAI + 1, MUSC + 1, OS + 1]} shakes={[ROMP + 2, OS + 2]}>
				<Head kicker="Définition" kAt={PLAIE - 6} title="Une *plaie*" tAt={PLAIE} />
				<Stage y={440} h={540} at={PLAIE + 2} bumps={[OUV, ROMP, OS]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Skin b={DB} depth={depth} shape="crater" germs={germs} microbes={interpolate(frame, [ROMP - 4, ROMP + 22], [0, 1], clamp)} />
						<div style={{position: 'absolute', left: DB.x, top: DB.y, fontFamily: FONT.title}}>
							<SkinLabels width={DB.w} labels={5 * fadeIn(frame, OS + 14, 14)} focus={4} />
						</div>
					</ZoomCam>
					<StagePill from={BARR - 2} to={ROMP - 2} color={LPI.sky}>
						la peau = une barrière
					</StagePill>
					<StagePill from={ROMP - 2} to={PROF - 2}>
						barrière rompue : les microbes entrent
					</StagePill>
					<StagePill from={PROF - 2} to={EPI - 2} color={LPI.blue}>
						plus profonde = plus de couches
					</StagePill>
				</Stage>
				<TermSlam index={0} at={PEAU} term="Plaie" meaning="une ouverture de la peau" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= PEAU} />
				<DepthChain marks={marks} y={1220} />
			</Camera>
			<Sfx name="whoosh" at={OUV - 4} volume={0.06} />
			<Sfx name="buzz" at={MICR} volume={0.04} dur={16} />
			<Sfx name="impact" at={ROMP} volume={0.08} />
			{marks.map((m) => (
				<Sfx key={m} name="pop" at={m} volume={0.08} />
			))}
			<Sfx name="impact" at={OS + 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · DEUX FAMILLES ═══════════════════════════════ */
// Ligne du temps en semaines : la plaie aiguë avance et se referme vite (✓) ; la chronique avance… et dépasse
// la zone 4 – 6 semaines, toujours ouverte.
const wx = (wk: number) => 160 + wk * 86;

export const Familles: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('familles', 'deux');
	const FAM = at('familles', 'familles');
	const AIG = at('familles', 'aiguës');
	const GUER = at('familles', 'guérissent');
	const SEM = at('familles', 'semaines');
	const CHRO = at('familles', 'chroniques');
	const TOUJ = at('familles', 'toujours');
	const QUAT = at('familles', 'quatre');
	const SEM2 = at('familles', 'semaines', 2);
	const keys: CamKey[] = [
		{at: AIG - 4, s: 1.45, x: 400, y: 200, dur: 14},
		{at: CHRO - 4, s: 1.35, x: 560, y: 330, dur: 14},
		{at: QUAT - 4, s: 1.6, x: wx(5), y: 280, dur: 12},
		{at: SEM2 + 14, s: 1, dur: 16},
	];
	const a = interpolate(frame, [GUER - 2, SEM + 10], [0, 2.4], ease);
	const aSize = 1 - interpolate(frame, [GUER + 6, SEM + 10], [0, 1], ease);
	const c = interpolate(frame, [CHRO, SEM2 + 6], [0, 7.4], ease);
	const band = frame >= QUAT - 4 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
	const pulse = 1 + 0.08 * Math.sin(frame / 3.5);
	const wound = (x: number, y: number, s: number, tone: string) => (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<ellipse rx={52} ry={30} fill={tone} stroke={N} strokeWidth={6} />
			<path d="M-26 0 Q0 -12 26 0" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
		</g>
	);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FAM + 1, AIG + 1, CHRO + 1, QUAT + 1, SEM2 + 1]} shakes={[TOUJ + 2]}>
				<Head kicker="Deux familles" kAt={DEUX - 4} title="*Aiguë* ou *chronique* ?" tAt={FAM - 4} size={84} />
				<Stage y={440} h={540} at={DEUX} bumps={[AIG, CHRO, QUAT]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{/* zone 4 – 6 semaines */}
							<rect x={wx(4)} y={70} width={wx(6) - wx(4)} height={400} rx={20} fill={alpha(LPI.pink, 0.16 + 0.2 * band)} stroke={alpha(LPI.pink, 0.8)} strokeWidth={4} strokeDasharray="12 10" />
							<text x={(wx(4) + wx(6)) / 2} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
								4 – 6 sem.
							</text>
							{/* axe du temps */}
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
							{/* pistes */}
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
						{frame >= AIG - 4 ? (
							<div style={{position: 'absolute', left: 14, top: 120, transform: `scale(${popAt(frame, AIG - 4)})`}}>
								<div style={{padding: '6px 18px', borderRadius: 999, background: LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>aiguë</div>
							</div>
						) : null}
						{frame >= CHRO - 4 ? (
							<div style={{position: 'absolute', left: 14, top: 280, transform: `scale(${popAt(frame, CHRO - 4)})`}}>
								<div style={{padding: '6px 18px', borderRadius: 999, background: LPI.pink, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>chronique</div>
							</div>
						) : null}
						{aSize <= 0.02 ? (
							<div style={{position: 'absolute', left: wx(a) - 44, top: 146, width: 88, height: 88, borderRadius: 44, background: LPI.sky, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${popAt(frame, SEM + 10)})`}}>
								<svg width={54} height={54} viewBox="0 0 100 100">
									<path d="M24 52 L42 70 L76 32" fill="none" stroke={N} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						) : null}
						{frame >= TOUJ - 2 ? (
							<div style={{position: 'absolute', left: wx(c) - 150, top: 236, width: 300, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, TOUJ - 2)})`}}>
								<div style={{padding: '6px 18px', borderRadius: 999, background: N, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.paper, whiteSpace: 'nowrap'}}>toujours ouverte</div>
							</div>
						) : null}
					</ZoomCam>
				</Stage>
				<TermSlam index={0} at={SEM} term="Plaie aiguë" meaning="guérit en quelques jours à quelques semaines" sign="check" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= SEM && frame < SEM2} />
				<TermSlam index={1} at={SEM2} term="Plaie chronique" meaning="pas fermée après 4 à 6 semaines" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= SEM2} />
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

/* ═══════════════════════════════ 3 · PLAIES AIGUËS ═══════════════════════════════ */
// La même coupe de peau, six fois : l'objet blesse la peau et la plaie prend sa forme (éraflure large et superficielle,
// coupure nette, déchirure irrégulière, piqûre minuscule mais profonde, morsure + microbes, incision suturée).
const AB: Box = {x: 118, y: 150, w: 700};
const AK = AB.w / SKIN.w;
const SURF = AB.y + SKIN.top * AK;
const ACX = AB.x + SKIN.cx * AK;

export const Aigues: React.FC = () => {
	const frame = useCurrentFrame();
	const AIG = at('aigues', 'aiguës');
	const EXC = at('aigues', "l'excoriation");
	const ERAF = at('aigues', 'éraflure');
	const SURFW = at('aigues', 'surface');
	const COUP = at('aigues', 'coupure');
	const NETS = at('aigues', 'nets');
	const LAC = at('aigues', 'lacération');
	const IRR = at('aigues', 'irréguliers');
	const PIQ = at('aigues', 'piqûre');
	const PETITE = at('aigues', 'petite');
	const PROF = at('aigues', 'profonde');
	const MORS = at('aigues', 'morsure');
	const MICR = at('aigues', 'microbes');
	const CHIR = at('aigues', 'chirurgicale');
	const BLOC = at('aigues', 'bloc');
	const seg = [EXC - 4, COUP - 6, LAC - 6, PIQ - 6, MORS - 6, CHIR - 8];
	const i = seg.filter((s) => frame >= s).length - 1;
	const shapes: WoundShape[] = ['scrape', 'cut', 'tear', 'pin', 'bite', 'cut'];
	const shape = shapes[Math.max(0, i)];
	const depth =
		i < 0
			? 0
			: i === 0
				? interpolate(frame, [EXC, ERAF + 10], [0, 1.15], ease)
				: i === 1
					? interpolate(frame, [COUP, COUP + 10], [0, 2.3], ease)
					: i === 2
						? interpolate(frame, [LAC, LAC + 12], [0, 2.4], ease)
						: i === 3
							? steps(frame, [PIQ, PROF - 2], [1, 4.1], 10)
							: i === 4
								? interpolate(frame, [MORS, MORS + 8], [0, 2.6], ease)
								: interpolate(frame, [CHIR, CHIR + 12], [0, 2.6], ease);
	const keys: CamKey[] = [
		{at: EXC - 4, s: 1.6, x: ACX, y: SURF + 30, dur: 14},
		{at: PETITE - 4, s: 2.1, x: ACX, y: SURF + 20, dur: 12},
		{at: PROF - 4, s: 1, dur: 14},
		{at: MORS - 6, s: 1.5, x: ACX, y: SURF + 10, dur: 12},
		{at: BLOC + 18, s: 1.15, x: ACX, y: SURF + 60, dur: 16},
	];
	const local = (a: number) => frame - a;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EXC + 1, COUP + 1, LAC + 1, PIQ + 1, PROF + 1, MORS + 1, CHIR + 1, BLOC + 1]} shakes={[COUP + 2, MORS + 2]}>
				<Head kicker="Plaies aiguës" kAt={AIG - 6} title="Ça guérit *vite*" tAt={AIG} size={88} />
				<Stage y={440} h={540} at={AIG} bumps={[EXC, COUP, LAC, PIQ, MORS, CHIR]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Skin b={AB} depth={depth} shape={shape} sutured={i === 5 ? interpolate(frame, [BLOC, BLOC + 24], [0, 1], clamp) : 0} germs={i === 4 ? fadeIn(frame, MICR - 6, 6) : 0} microbes={i === 4 ? interpolate(frame, [MICR - 2, MICR + 26], [0, 1], clamp) : 0} />
						{/* les objets */}
						{i === 0 ? (
							<div style={{position: 'absolute', left: ACX - 330 + interpolate(frame, [EXC, SURFW + 10], [0, 420], ease), top: SURF - 172, opacity: 1 - fadeIn(frame, COUP - 14, 8)}}>
								<WoundTool kind="gravel" size={220} />
							</div>
						) : null}
						{i === 1 ? (
							<div style={{position: 'absolute', left: ACX - 230, top: SURF - 115 - 70 * (1 - interpolate(frame, [COUP - 6, COUP + 4], [0, 1], ease)) - 120 * fadeIn(frame, NETS + 10, 10), opacity: 1 - fadeIn(frame, NETS + 10, 10)}}>
								<WoundTool kind="knife" size={240} />
							</div>
						) : null}
						{i === 2 ? (
							<div style={{position: 'absolute', left: ACX - 110, top: SURF - 200, transform: `scaleX(${1 + 0.12 * Math.sin(local(LAC) / 2.5)})`, opacity: fadeIn(frame, LAC - 4, 6)}}>
								<WoundTool kind="tear" size={220} />
							</div>
						) : null}
						{i === 3 ? (
							<div style={{position: 'absolute', left: ACX - 110, top: AB.y + depthY(depth) * AK - 211 - 60 * fadeIn(frame, MORS - 16, 8), opacity: 1 - fadeIn(frame, MORS - 16, 8)}}>
								<WoundTool kind="nail" size={220} />
							</div>
						) : null}
						{i === 4 ? (
							<div style={{position: 'absolute', left: ACX - 120, top: SURF - 156 - 40 * (1 - fadeIn(frame, MORS - 6, 8)), opacity: 1 - fadeIn(frame, MICR - 8, 8)}}>
								<WoundTool kind="teeth" size={240} bite={interpolate(frame, [MORS - 2, MORS + 4], [0, 1], clamp)} />
							</div>
						) : null}
						{i === 5 ? (
							<div style={{position: 'absolute', left: ACX - 190 + interpolate(frame, [CHIR - 8, CHIR + 10], [-160, 0], ease), top: SURF - 128, opacity: 1 - fadeIn(frame, BLOC - 4, 8)}}>
								<WoundTool kind="scalpel" size={220} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={SURFW - 2} to={COUP - 6} color={LPI.sky}>
						en surface
					</StagePill>
					<StagePill from={NETS - 2} to={LAC - 6} color={LPI.blue}>
						bords nets
					</StagePill>
					<StagePill from={IRR - 2} to={PIQ - 6}>
						bords irréguliers
					</StagePill>
					<StagePill from={PROF - 2} to={MORS - 6} color={LPI.blue}>
						petite… mais profonde
					</StagePill>
					<StagePill from={MICR - 2} to={CHIR - 8}>
						gros risque d'infection
					</StagePill>
					<StagePill from={BLOC - 2} color={LPI.sky}>
						propre, refermée par des points
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={EXC} icon={<WoundTool kind="gravel" size={56} />} label="excoriation" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1010}}>
					<CauseChip at={COUP} icon={<WoundTool kind="knife" size={56} />} label="coupure" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={LAC} icon={<WoundTool kind="tear" size={56} />} label="lacération" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1120}}>
					<CauseChip at={PIQ} icon={<WoundTool kind="nail" size={56} />} label="piqûre" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1230}}>
					<CauseChip at={MORS} icon={<WoundTool kind="teeth" size={56} />} label="morsure" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1230}}>
					<CauseChip at={CHIR} icon={<ScalpelIcon size={56} />} label="chirurgicale" tone={LPI.sky} />
				</div>
			</Camera>
			<Sfx name="whoosh" at={EXC} volume={0.06} />
			<Sfx name="buzz" at={ERAF} volume={0.04} dur={14} />
			<Sfx name="whoosh" at={COUP - 4} volume={0.07} />
			<Sfx name="impact" at={COUP + 2} volume={0.07} />
			<Sfx name="buzz" at={LAC + 2} volume={0.05} dur={12} />
			<Sfx name="pop" at={PIQ} volume={0.07} />
			<Sfx name="impact" at={PROF} volume={0.08} />
			<Sfx name="impact" at={MORS} volume={0.09} />
			<Sfx name="buzz" at={MICR} volume={0.04} dur={18} />
			<Sfx name="whoosh" at={CHIR - 6} volume={0.05} />
			{[0, 8, 16].map((d) => (
				<Sfx key={d} name="tick" at={BLOC + d} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · BRÛLURES ═══════════════════════════════ */
// La flamme au-dessus de la coupe de peau ; 1er degré : l'épiderme rougit, les nerfs « crient » ; 2e : la peau se
// soulève en cloque (phlyctène) ; 3e : toute l'épaisseur est carbonisée, les nerfs sont détruits, plus de douleur.
const BB: Box = {x: 58, y: 70, w: 820};
const BK = BB.w / SKIN.w;
const BSURF = BB.y + SKIN.top * BK;
const BCX = BB.x + SKIN.cx * BK;

export const Brulures: React.FC = () => {
	const frame = useCurrentFrame();
	const BRUL = at('brulures', 'brûlures');
	const PREM = at('brulures', 'premier');
	const ROUG = at('brulures', 'rougeur');
	const DOUL = at('brulures', 'douloureuse');
	const SOLEIL = at('brulures', 'soleil');
	const DEUX = at('brulures', 'deuxième');
	const CLOQ = at('brulures', 'cloques');
	const PHLY = at('brulures', 'phlyctènes');
	const TROIS = at('brulures', 'troisième');
	const DETR = at('brulures', 'détruite');
	const MAL = at('brulures', 'mal');
	const NERFS = at('brulures', 'nerfs');
	const BRULES = at('brulures', 'brûlés');
	const burn = steps(frame, [ROUG - 4, CLOQ - 4, DETR - 6], [1, 2, 3], 12);
	const keys: CamKey[] = [
		{at: PREM - 4, s: 1.7, x: BCX, y: BSURF + 30, dur: 14},
		{at: DEUX - 4, s: 1.5, x: BCX, y: BSURF, dur: 12},
		{at: TROIS - 4, s: 1.12, x: BCX, y: 280, dur: 14},
		{at: NERFS - 4, s: 1.8, x: BB.x + 640 * BK, y: BB.y + 130 * BK, dur: 12},
		{at: BRULES + 18, s: 1, dur: 16},
	];
	const flame = fadeIn(frame, BRUL - 2, 8) * (1 - fadeIn(frame, TROIS + 30, 10));
	const flick = 1 + 0.08 * Math.sin(frame * 1.3) + 0.04 * Math.sin(frame * 2.9);
	const deg = burn < 1.5 ? 1 : burn < 2.5 ? 2 : 3;
	const bracketY = BB.y + depthY(deg === 1 ? 1 : deg === 2 ? 2 : 2.4) * BK;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PREM + 1, ROUG + 1, DEUX + 1, CLOQ + 1, TROIS + 1, DETR + 1, NERFS + 1]} shakes={[DETR + 2]}>
				<Head kicker="Les brûlures" kAt={BRUL - 6} title="Trois *degrés*" tAt={BRUL} size={88} />
				<Stage y={440} h={540} at={BRUL} bumps={[ROUG, CLOQ, DETR]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Skin b={BB} burn={burn} nerves={1} pain={fadeIn(frame, DOUL - 2, 6) * (1 - fadeIn(frame, DETR - 4, 10))} nervesBurnt={fadeIn(frame, NERFS - 2, 10)} />
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
					<StagePill from={DOUL - 2} to={DEUX - 4}>
						rougeur qui fait mal
					</StagePill>
					<StagePill from={PHLY - 2} to={TROIS - 4} color={LPI.sky}>
						phlyctène = cloque
					</StagePill>
					<StagePill from={MAL - 2} to={NERFS - 2} color={LPI.blue}>
						ne fait plus mal…
					</StagePill>
					<StagePill from={NERFS - 2}>nerfs détruits</StagePill>
				</Stage>
				<TermSlam index={0} at={PREM} term="1er degré" meaning="rougeur douloureuse (coup de soleil)" sign="up" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= PREM && frame < DEUX} />
				<TermSlam index={1} at={DEUX} term="2e degré" meaning="cloques (phlyctènes)" sign="up" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= DEUX && frame < TROIS} />
				<TermSlam index={2} at={TROIS} term="3e degré" meaning="peau détruite · ne fait plus mal" sign="alert" slamY={SLAM_Y} slot={termSlot(2)} active={frame >= TROIS} />
			</Camera>
			<Sfx name="whoosh" at={BRUL} volume={0.06} />
			<Sfx name="buzz" at={DOUL} volume={0.04} dur={14} />
			<Sfx name="pop" at={CLOQ + 4} volume={0.09} />
			<Sfx name="impact" at={DETR} volume={0.09} />
			<Sfx name="buzz" at={NERFS} volume={0.04} dur={12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · PLAIES CHRONIQUES ═══════════════════════════════ */
// Patient couché et ses points d'appui ; plongée sur le sacrum : la peau écrasée entre l'os et le matelas, le sang ne
// passe plus, la peau meurt ; retour : sacrum et talons. Jambe : varices, le sang stagne, ulcère à la cheville ; pied
// diabétique : petite plaie sous le pied, la douleur ne remonte plus, elle grandit en silence.
const LB: Box = {x: 18, y: 120, w: 900};
const SQ: Box = {x: 18, y: 20, w: 900};
const LL = {x: 268, y: 4, w: 380};
const LK = LL.w / 500;
const legPt = (p: keyof typeof LEG_PTS) => ({x: LL.x + LEG_PTS[p][0] * LK, y: LL.y + LEG_PTS[p][1] * LK});
const lyPt = (p: keyof typeof LYING_PTS) => ({x: LB.x + (LYING_PTS[p][0] * LB.w) / 900, y: LB.y + (LYING_PTS[p][1] * LB.w) / 900});

export const Chroniques: React.FC = () => {
	const frame = useCurrentFrame();
	const CHRO = at('chroniques', 'chroniques');
	const ESC = at('chroniques', "l'escarre");
	const ECR = at('chroniques', 'écrasée');
	const OS = at('chroniques', "l'os");
	const MAT = at('chroniques', 'matelas');
	const SACR = at('chroniques', 'sacrum');
	const TAL = at('chroniques', 'talons');
	const ULC = at('chroniques', "l'ulcère");
	const SANG = at('chroniques', 'sang');
	const MAL = at('chroniques', 'mal');
	const PIED = at('chroniques', 'pied');
	const DIAB = at('chroniques', 'diabétique');
	const PETITE = at('chroniques', 'petite');
	const SENT = at('chroniques', 'sent');
	const AGG = at('chroniques', "s'aggrave");
	const SIL = at('chroniques', 'silence');
	const sacrum = lyPt('sacrum');
	const heel = lyPt('heel');
	const lying: CamKey[] = [
		{at: ECR - 8, s: 2.8, x: sacrum.x, y: sacrum.y, dur: 12},
		{at: SACR - 10, s: 1.9, x: sacrum.x, y: sacrum.y - 30, dur: 1},
		{at: TAL - 4, s: 1.9, x: heel.x, y: heel.y - 30, dur: 12},
	];
	const leg: CamKey[] = [
		{at: -1, s: 1.25, x: legPt('calf').x, y: legPt('calf').y + 40, dur: 1},
		{at: MAL - 4, s: 2, x: legPt('ankle').x, y: legPt('ankle').y - 50, dur: 12},
		{at: PIED - 4, s: 1.8, x: legPt('sole').x - 30, y: legPt('sole').y - 60, dur: 14},
		{at: SIL + 12, s: 1.2, x: legPt('sole').x - 60, y: legPt('sole').y - 160, dur: 16},
	];
	const sqO = fadeIn(frame, ECR - 2, 8) * (1 - fadeIn(frame, SACR - 10, 8));
	const legO = fadeIn(frame, ULC - 8, 8);
	const lyO = (1 - sqO) * (1 - legO);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ESC + 1, ECR + 1, MAT + 1, SACR + 1, TAL + 1, ULC + 1, MAL + 1, PIED + 1, AGG + 1]} shakes={[MAT + 2, AGG + 2]}>
				<Head kicker="Plaies chroniques" kAt={CHRO - 6} title="Celles qui *traînent*" tAt={CHRO} size={88} />
				<Stage y={440} h={540} at={CHRO} bumps={[ESC, MAT, ULC, PIED]}>
					{lyO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: lyO}}>
							<ZoomCam keys={lying} w={936} h={540}>
								<div style={{position: 'absolute', left: LB.x, top: LB.y}}>
									<LyingBody width={LB.w} points={fadeIn(frame, ESC - 2, 8)} focus={frame >= TAL - 2 ? ['sacrum', 'heel'] : frame >= SACR - 2 ? ['sacrum'] : []} />
								</div>
							</ZoomCam>
						</div>
					) : null}
					{sqO > 0 ? (
						<div style={{position: 'absolute', left: SQ.x, top: SQ.y, opacity: sqO}}>
							<Squeeze width={SQ.w} press={interpolate(frame, [OS - 6, MAT + 10], [0, 1], ease)} dead={interpolate(frame, [MAT + 8, SACR - 12], [0, 1], ease)} />
						</div>
					) : null}
					{legO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: legO}}>
							<ZoomCam keys={leg} w={936} h={540}>
								<div style={{position: 'absolute', left: LL.x, top: LL.y}}>
									<LowerLeg
										width={LL.w}
										veins={fadeIn(frame, ULC - 4, 10)}
										stasis={fadeIn(frame, SANG - 2, 14)}
										ulcer={popAt(frame, MAL - 2)}
										nerve={fadeIn(frame, PIED - 2, 8)}
										numb={fadeIn(frame, SENT - 2, 6)}
										footSore={popAt(frame, PETITE - 2)}
										grow={interpolate(frame, [AGG - 2, SIL + 10], [0, 1], ease)}
										silent={fadeIn(frame, AGG - 2, 16)}
									/>
								</div>
							</ZoomCam>
						</div>
					) : null}
					{frame >= DIAB - 2 ? (
						<div style={{position: 'absolute', left: 740, top: 24, transform: `scale(${popAt(frame, DIAB - 2)})`}}>
							<DiabetesIcon size={150} />
						</div>
					) : null}
					<StagePill from={OS - 2} to={SACR - 10}>
						écrasée entre l'os et le matelas
					</StagePill>
					<StagePill from={MAT + 12} to={SACR - 10} color={LPI.blue} y={390}>
						le sang ne passe plus
					</StagePill>
					<StagePill from={SACR - 2} to={ULC - 8} color={LPI.sky}>
						sacrum · talons
					</StagePill>
					<StagePill from={SANG - 2} to={PIED - 4} color={LPI.blue}>
						le sang circule mal
					</StagePill>
					<StagePill from={SENT - 2} to={AGG - 2} color={LPI.sky}>
						il ne sent pas sa plaie
					</StagePill>
					<StagePill from={AGG - 2}>elle s'aggrave en silence</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010}}>
					<CauseChip at={ESC} icon={<BedIcon size={56} />} label="escarre" />
				</div>
				<div style={{position: 'absolute', left: 540, top: 1010}}>
					<CauseChip at={ULC} icon={<LegIcon size={56} />} label="ulcère de jambe" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CauseChip at={PIED} icon={<DiabetesIcon size={56} />} label="pied diabétique" />
				</div>
			</Camera>
			<Sfx name="pop" at={ESC} volume={0.08} />
			<Sfx name="whoosh" at={ECR - 8} volume={0.07} />
			<Sfx name="impact" at={MAT} volume={0.09} />
			<Sfx name="buzz" at={MAT + 10} volume={0.04} dur={20} />
			<Sfx name="pop" at={SACR} volume={0.07} />
			<Sfx name="pop" at={TAL} volume={0.07} />
			<Sfx name="whoosh" at={ULC - 8} volume={0.06} />
			<Sfx name="impact" at={MAL} volume={0.07} />
			<Sfx name="whoosh" at={PIED - 4} volume={0.05} />
			<Sfx name="buzz" at={SENT} volume={0.04} dur={12} />
			<Sfx name="heartbeat" at={AGG} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · LES 4 STADES DE L'ESCARRE ═══════════════════════════════ */
// Coupe de peau : stade 1, la rougeur reste quand le doigt appuie ; stade 2, cloque puis peau abîmée ; stade 3, un
// creux jusqu'à la graisse ; stade 4, jusqu'au muscle et à l'os. Rangée des 4 stades sous le socle.
const EB: Box = {x: 88, y: 118, w: 760};
const STADES = [
	['rougeur qui ne', 'blanchit pas'],
	['cloque,', 'peau abîmée'],
	['creux jusqu’à', 'la graisse'],
	['muscle,', 'voire l’os'],
];

const StadeRow: React.FC<{show: number; marks: number[]}> = ({show, marks}) => {
	const frame = useCurrentFrame();
	if (frame < show) return null;
	const cur = marks.filter((m) => frame >= m - 2).length - 1;
	return (
		<div style={{position: 'absolute', left: 72, top: 1010, width: 936, display: 'flex', gap: 24}}>
			{STADES.map((lines, i) => {
				const on = i === cur;
				const done = i < cur;
				const lit = frame >= marks[i] - 2;
				return (
					<div
						key={i}
						style={{
							width: 216,
							height: 250,
							borderRadius: 34,
							boxSizing: 'border-box',
							background: on ? LPI.pink : lit ? LPI.paper : alpha(LPI.paper, 0.7),
							border: `6px solid ${on ? N : lit ? LPI.sky : alpha(N, 0.15)}`,
							boxShadow: on ? SHADOW : 'none',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							paddingTop: 18,
							gap: 10,
							transform: `scale(${popAt(frame, show + i * 3) * (on ? 1.05 : 1)})`,
						}}
					>
						<div style={{width: 92, height: 92, borderRadius: 46, background: on ? LPI.paper : done ? LPI.sky : alpha(LPI.sky, 0.5), border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N}}>{i + 1}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 27, lineHeight: 1.15, color: N, textAlign: 'center', opacity: lit ? 1 : 0.35}}>
							{lines[0]}
							<br />
							{lines[1]}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Escarre: React.FC = () => {
	const frame = useCurrentFrame();
	const ESC = at('escarre', "l'escarre");
	const QUAT = at('escarre', 'quatre');
	const STAD = at('escarre', 'stades');
	const S1 = at('escarre', 'Stade 1');
	const ROUG = at('escarre', 'rougeur');
	const APP = at('escarre', 'appuie');
	const S2 = at('escarre', 'Stade 2');
	const CLOQ = at('escarre', 'cloque');
	const ABI = at('escarre', 'abîmée');
	const S3 = at('escarre', 'Stade 3');
	const CREUX = at('escarre', 'creux');
	const GRAI = at('escarre', 'graisse');
	const S4 = at('escarre', 'Stade 4');
	const MUSC = at('escarre', 'muscle');
	const OS = at('escarre', "l'os");
	const cx = skinPt(EB, SKIN.cx, 0).x;
	const keys: CamKey[] = [
		{at: S1 - 4, s: 1.5, x: cx, y: skinPt(EB, 0, 40).y, dur: 14},
		{at: S3 - 6, s: 1, dur: 16},
	];
	const stage = frame < S2 - 4 ? 1 : frame < S3 - 4 ? 2 : frame < S4 - 4 ? 3 : 4;
	const redness = fadeIn(frame, ROUG - 2, 10) * (stage <= 2 ? 1 : 1 - fadeIn(frame, S3 - 4, 10));
	const press = interpolate(frame, [APP - 8, APP + 2, S2 - 14, S2 - 6], [0, 1, 1, 0], ease);
	const blister = stage === 2 ? interpolate(frame, [CLOQ - 4, CLOQ + 6, ABI - 4, ABI + 6], [0, 1, 1, 0], ease) : 0;
	const shape: WoundShape = stage <= 2 ? 'scrape' : 'crater';
	const depth = stage === 2 ? interpolate(frame, [ABI - 4, ABI + 8], [0, 1], ease) * 0.9 : stage === 3 ? interpolate(frame, [CREUX - 6, GRAI + 6], [1, 3], ease) : stage === 4 ? steps(frame, [MUSC - 4, OS - 4], [4, 4.9], 10, 3) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[QUAT + 1, S1 + 1, APP + 1, S2 + 1, S3 + 1, S4 + 1, OS + 1]} shakes={[S4 + 2, OS + 2]}>
				<Head kicker="Focus escarre" kAt={ESC - 4} title="*4* *stades*" tAt={QUAT - 2} />
				<Stage y={440} h={540} at={ESC} bumps={[S1, S2, S3, S4]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Skin b={EB} shape={shape} depth={depth} redness={redness} press={press} blister={blister} />
						<div style={{position: 'absolute', left: EB.x, top: EB.y, fontFamily: FONT.title}}>
							<SkinLabels width={EB.w} labels={5 * fadeIn(frame, S3 + 4, 12)} focus={stage === 3 ? 2 : stage === 4 ? (frame >= OS - 4 ? 4 : 3) : -1} />
						</div>
					</ZoomCam>
					<StagePill from={APP - 2} to={S2 - 4}>
						même si on appuie : elle reste rouge
					</StagePill>
					<StagePill from={CLOQ - 2} to={ABI - 4} color={LPI.sky}>
						une cloque
					</StagePill>
					<StagePill from={ABI - 2} to={S3 - 4} color={LPI.blue}>
						la peau s'abîme
					</StagePill>
				</Stage>
				<StadeRow show={STAD - 2} marks={[S1, S2, S3, S4]} />
			</Camera>
			<Sfx name="pop" at={STAD} volume={0.08} />
			{[S1, S2, S3, S4].map((s) => (
				<Sfx key={s} name="pop" at={s} volume={0.1} />
			))}
			<Sfx name="tick" at={APP} volume={0.08} />
			<Sfx name="pop" at={CLOQ + 2} volume={0.07} />
			<Sfx name="impact" at={MUSC} volume={0.07} />
			<Sfx name="impact" at={OS} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 7 · SIGNES DE GRAVITÉ ═══════════════════════════════ */
// À gauche, la plaie devient profonde, étendue, sale ; à droite, le patient et les zones à risque (visage, mains,
// articulations). Avis médical, puis le vaccin contre le tétanos.
const GB: Box = {x: 20, y: 150, w: 430};
const GP = {x: 560, y: 30, size: 300};
const gPt = (x: number, y: number) => ({x: GP.x + (x * GP.size) / 400, y: GP.y + (y * GP.size) / 400});

export const Gravite: React.FC = () => {
	const frame = useCurrentFrame();
	const ENFIN = at('gravite', 'enfin');
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
		{at: PROF - 4, s: 1.7, x: skinC.x, y: skinC.y, dur: 14},
		{at: ZONE - 4, s: 1, dur: 14},
		{at: VIS - 4, s: 2.2, x: face.x, y: face.y + 20, dur: 12},
		{at: MAIN - 4, s: 2, x: hand.x - 20, y: hand.y - 20, dur: 12},
		{at: ART - 4, s: 1.6, x: elbow.x - 60, y: elbow.y - 40, dur: 12},
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
				<Head kicker="Signes de gravité" kAt={ENFIN - 4} title="Simple ou *grave* ?" tAt={ENFIN + 2} size={88} />
				<Stage y={440} h={540} at={ENFIN} bumps={[PROF, ETEN, SOUIL, ZONE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Skin
							b={GB}
							shape="crater"
							depth={interpolate(frame, [PROF - 4, PROF + 10], [1.2, 4.2], ease)}
							open={interpolate(frame, [ETEN - 4, ETEN + 10], [0.75, 1.5], ease)}
							germs={fadeIn(frame, SOUIL - 4, 6)}
							microbes={interpolate(frame, [SOUIL, SALE + 12], [0, 1], clamp)}
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

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Les *plaies*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'gravité') + 16}
		rows={[
			[at('outro', 'plaie'), 'wave', 'Une plaie', 'une ouverture de la peau'],
			[at('outro', 'aiguë'), 'check', 'Aiguë', 'guérit vite : coupure, brûlure…'],
			[at('outro', 'chronique'), 'alert', 'Chronique', 'escarre · ulcère · pied diabétique'],
			[at('outro', 'signes'), 'alert', 'Gravité', 'profonde · sale · zone à risque'],
		]}
	/>
);
