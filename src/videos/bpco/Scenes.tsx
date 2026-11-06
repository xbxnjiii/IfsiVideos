// Scènes de « La BPCO » v2 (format pathologie) : accroche « Juste une toux de fumeur ? » (il tousse, il crache,
// s'arrête à chaque étage ; « c'est juste la cigarette » : FAUX ; c'est la BPCO ; 2 malades sur 3 ne le savent pas),
// définition (sigle lettre par lettre), LA RADIO couche par couche (demandé : on enlève un calque à chaque fois :
// le patient → la cage thoracique → les poumons → l'intérieur → les alvéoles → une alvéole et son vaisseau ; puis chez
// lui : bronches enflammées, mucus, rétrécies, emphysème, air piégé), cause (tabac 8 cas sur 10), signes,
// spirométrie, traitement, oxygène (cible 88 – 95 %) et exacerbation, récap. Vrais bruitages : toux, essoufflement,
// briquet, inhalateur, souffle (public/sfx/SOURCES.md).
// Dessins : src/brand/chest.tsx (couches du thorax), lungs.tsx (alvéoles, bronche en coupe, loupe), copd.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AlveolusExchange, ChestPeel} from '../../brand/chest';
import {Bronchus, exhaled, Inhaler, Spirometer} from '../../brand/copd';
import {WallClock} from '../../brand/devices';
import {CamKey, camAt, CauseChip, Head, LAY, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {
	CigaretteIcon,
	CoughIcon,
	DustIcon,
	RunIcon,
	SmogIcon,
	SputumIcon,
	SunriseIcon,
	SyringeIcon,
} from '../../brand/icons';
import {CheckChip, Stamp, Strike} from '../../brand/kit';
import {AirwayCross, AlveoliZoom, LUNGS_IN_PATIENT, ZoomBubble} from '../../brand/lungs';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {SPO_ZONES} from '../../brand/oxygen';
import {Bubble} from '../../brand/pain';
import {Patient, PatientProps} from '../../brand/patient';
import {LungsPicto, SnowPicto} from '../../brand/pictos';
import {Tissue} from '../../brand/precautions';
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
const popAt = (frame: number, t0: number) =>
	frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.5}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return (
		<AbsoluteFill
			style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}}
		/>
	);
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{
	from: number;
	to?: number;
	text: string;
	size?: number;
	y?: number;
	stagger?: number;
	align?: 'left' | 'center';
	plate?: boolean;
}> = ({from, to = 1e9, text, size = 88, y = 236, stagger = 3, align = 'left', plate = false}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 6 || frame < from - 1) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: y,
				width: 936,
				opacity: interpolate(frame, [to, to + 6], [1, 0], clamp),
			}}
		>
			{plate ? (
				<div
					style={{
						display: 'inline-block',
						padding: '8px 22px 14px',
						marginLeft: -22,
						borderRadius: 30,
						background: alpha(LPI.paper, 0.93),
						boxShadow: SHADOW,
					}}
				>
					<Title at={from} text={text} size={size} stagger={stagger} align={align} />
				</div>
			) : (
				<Title at={from} text={text} size={size} stagger={stagger} align={align} />
			)}
		</div>
	);
};

/** Pastille fixe qui apparaît à `from` et s'efface à `to`. */
const PillAt: React.FC<{
	from: number;
	to?: number;
	x?: number;
	y: number;
	size?: number;
	color?: string;
	children: React.ReactNode;
}> = ({from, to = 1e9, x = 72, y, size = 40, color, children}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const o = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity: o,
				transform: `scale(${0.8 + 0.2 * o})`,
				transformOrigin: 'left center',
			}}
		>
			<Pill at={from} size={size} color={color}>
				{children}
			</Pill>
		</div>
	);
};

/** Petit écran de surveillance (SpO₂…). */
const Screen: React.FC<{label: string; value: string; unit?: string; alert?: boolean; at: number}> = ({
	label,
	value,
	unit = '',
	alert = false,
	at: t0,
}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div
			style={{
				transform: `scale(${popAt(frame, t0)})`,
				padding: '12px 22px',
				borderRadius: 26,
				background: N,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'baseline',
				gap: 8,
				border: `6px solid ${alert && frame % 16 < 10 ? LPI.pink : N}`,
			}}
		>
			<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: LPI.sky}}>{label}</span>
			<span
				style={{
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 60,
					color: alert ? LPI.pink : LPI.paper,
					lineHeight: 1,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{value}
			</span>
			{unit ? (
				<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: LPI.sky}}>{unit}</span>
			) : null}
		</div>
	);
};

/** Pastille posée dans le socle (bas gauche), visible de `from` à `to`. */
const StagePill: React.FC<{
	from: number;
	to?: number;
	children: React.ReactNode;
	color?: string;
	x?: number;
	y?: number;
}> = ({from, to = 1e9, children, color, x = 30, y = 450}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame >= to) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Pill at={from} size={38} color={color}>
				{children}
			</Pill>
		</div>
	);
};

/**
 * Le patient (taille `size`, posé en x, y) + calques dessinés dans son espace (400 × 560) : souffle court
 * (bouffées devant la bouche), toux, crachats.
 */
const Man: React.FC<PatientProps & {x: number; y: number; puffs?: number; cough?: number; sputum?: number}> = ({
	x,
	y,
	size = 360,
	puffs = 0,
	cough = 0,
	sputum = 0,
	...p
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Patient size={size} {...p} />
			<svg
				width={size}
				height={size * 1.4}
				viewBox="0 0 400 560"
				style={{position: 'absolute', inset: 0, overflow: 'visible'}}
			>
				{puffs > 0
					? [0, 1, 2].map((k) => {
							const t = ((frame + k * 10) % 30) / 30;
							return (
								<path
									key={k}
									d={`M${226 + t * 60} ${150 - 6 + k * 6} q14 -10 28 0`}
									fill="none"
									stroke={LPI.blue}
									strokeWidth={6}
									strokeLinecap="round"
									opacity={puffs * (1 - t)}
								/>
							);
						})
					: null}
				{cough > 0
					? [-1, 0, 1].map((k) => {
							const t = ((frame + (k + 1) * 4) % 16) / 16;
							return (
								<path
									key={k}
									d={`M${230 + t * 30} ${150 + k * 16 * (1 + t)} l${26 + t * 20} ${k * 12}`}
									stroke={LPI.pink}
									strokeWidth={8}
									strokeLinecap="round"
									opacity={cough * (1 - t * 0.7)}
								/>
							);
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
// Image 0 : « Juste une toux de fumeur ? » (2 lignes) + gros plan de l'homme qui tousse, le haut de son thorax déjà vu
// « à la radio » (bronches abîmées) : l'aperçu se referme aussitôt. « Tous les matins, la même toux » : les jours
// claquent (LUN → VEN) ; « il crache » : mouchoir ; l'escalier : il s'arrête au palier ; bulle « c'est juste la
// cigarette… » ; « Faux ! » : la bulle et le titre sont barrés au milieu de chaque ligne, tampon ; « Regarde ses
// poumons » : la radio descend (côtes → poumons → bronches bouchées, air coincé) ; « C'est la BPCO » (carton, flash) ;
// « deux malades sur trois ne le savent pas » : 3 patients, 2 avec un « ? ».
const HP = {size: 520, x: 90, y: 560};
const hookPt = (x: number, y: number) => ({x: HP.x + (x * HP.size) / 400, y: HP.y + (y * HP.size) / 400});

/** Escalier : un petit bonhomme monte, s'arrête au palier, souffle (viewBox 360 × 360). */
const Stairs: React.FC<{from: number; stop: number; size?: number}> = ({from, stop, size = 360}) => {
	const frame = useCurrentFrame();
	const steps = 6;
	const path = Array.from(
		{length: steps},
		(_, i) => `L${40 + i * 48} ${320 - i * 44} L${40 + (i + 1) * 48} ${320 - i * 44}`,
	).join(' ');
	const p = interpolate(frame, [from, stop], [0, 0.62], ease);
	const i = p * steps;
	const fx = 40 + i * 48 + 18;
	const fy = 320 - Math.floor(i) * 44 - 6 - (frame < stop ? Math.abs(Math.sin(frame / 3)) * 8 : 0);
	const tired = frame >= stop;
	return (
		<svg width={size} height={size} viewBox="0 0 360 360" style={{overflow: 'visible'}}>
			<path d={`M40 340 L40 320 ${path} L328 340 Z`} fill={LPI.sky} stroke={N} strokeWidth={7} strokeLinejoin="round" />
			<path d={`M228 ${320 - 4 * 44} L300 ${320 - 4 * 44}`} stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
			{/* le bonhomme */}
			<g transform={`translate(${fx} ${fy}) rotate(${tired ? 14 : 0})`}>
				<circle cx={0} cy={-62} r={14} fill={LPI.paper} stroke={N} strokeWidth={5} />
				<path
					d="M0 -48 L0 -18 M0 -18 L-10 0 M0 -18 L10 0 M0 -40 L-12 -24 M0 -40 L12 -26"
					stroke={N}
					strokeWidth={6}
					strokeLinecap="round"
				/>
			</g>
			{tired
				? [0, 1, 2].map((k) => {
						const t = ((frame + k * 9) % 27) / 27;
						return (
							<path
								key={k}
								d={`M${fx + 18 + t * 30} ${fy - 66 + k * 6} q10 -8 20 0`}
								fill="none"
								stroke={LPI.blue}
								strokeWidth={5}
								strokeLinecap="round"
								opacity={1 - t}
							/>
						);
					})
				: null}
			{tired ? (
				<g transform={`translate(${fx - 30} ${fy - 104}) scale(${popAt(frame, stop)})`}>
					<circle r={20} fill={LPI.pink} stroke={N} strokeWidth={4} />
					<text y={9} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>
						!
					</text>
				</g>
			) : null}
		</svg>
	);
};

/** Pastille ronde « ? » / « ✓ » qui tangue. */
const Badge: React.FC<{at: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({
	at: t0,
	x,
	y,
	text,
	tone = LPI.pink,
	size = 90,
}) => {
	const frame = useCurrentFrame();
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
				background: tone,
				border: `6px solid ${LPI.paper}`,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size * 0.6,
				color: tone === LPI.blue ? LPI.paper : N,
				transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`,
			}}
		>
			{text}
		</div>
	);
};

/** Rangée des jours (« tous les matins ») : chaque jour claque avec une petite quinte. */
const Days: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 8) return null;
	const o = interpolate(frame, [to, to + 8], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 72, top: 470, display: 'flex', gap: 14, opacity: o}}>
			{['LUN', 'MAR', 'MER', 'JEU', 'VEN'].map((d, i) => {
				const t = from + i * 4;
				const on = frame >= t;
				return (
					<div
						key={d}
						style={{
							width: 160,
							height: 92,
							borderRadius: 26,
							background: on ? LPI.pink : LPI.paper,
							border: `5px solid ${N}`,
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 36,
							color: N,
							transform: `scale(${on ? popAt(frame, t) : 0.001})`,
						}}
					>
						{d}
						<CoughIcon size={38} />
					</div>
				);
			})}
		</div>
	);
};

/** Titre de l'image 0 sur deux lignes, chaque ligne barrée à sa place sur « Faux ! ». */
const HookTitle: React.FC<{strike: number; out: number}> = ({strike, out}) => {
	const frame = useCurrentFrame();
	if (frame > out + 8) return null;
	const o = interpolate(frame, [out, out + 8], [1, 0], clamp);
	return (
		<div
			style={{position: 'absolute', left: 72, top: 220, opacity: o, display: 'flex', flexDirection: 'column', gap: 4}}
		>
			{['Juste une *toux*', 'de *fumeur* ?'].map((line) => (
				<div key={line} style={{position: 'relative', alignSelf: 'flex-start'}}>
					<Title at={-60} text={line} size={100} stagger={0} />
					{line.includes('fumeur') ? null : <Strike at={strike} width={line.length * 50} rot={-4} />}
					{line.includes('fumeur') ? <Strike at={strike + 4} width={380} rot={-4} /> : null}
				</div>
			))}
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MATINS = at('intro', 'matins');
	const TOUX = at('intro', 'toux');
	const CRACHE = at('intro', 'crache');
	const ESC = at('intro', "l'escalier");
	const ETAGE = at('intro', 'étage');
	const LUI = at('intro', 'lui');
	const DIT = at('intro', 'dit');
	const CIG = at('intro', 'cigarette');
	const FAUX = at('intro', 'faux');
	const REG = at('intro', 'regarde');
	const POUM = at('intro', 'poumons');
	const BOUCH = at('intro', 'bouchent');
	const COINC = at('intro', 'coincé');
	const BPCO = at('intro', 'bpco');
	const ET = at('intro', 'et', 3);
	const DEUX = at('intro', 'deux');
	const TROIS = at('intro', 'trois');
	const SAVENT = at('intro', 'savent');
	const face = hookPt(200, 150);
	const chest = hookPt(200, 300);
	const keys: CamKey[] = [
		{at: -1, s: 1.45, x: face.x + 30, y: face.y + 120, dur: 1},
		{at: CRACHE - 4, s: 1.75, x: face.x + 40, y: face.y + 90, dur: 12},
		{at: ESC - 4, s: 1, dur: 14},
		{at: REG - 4, s: 1.8, x: chest.x, y: chest.y + 20, dur: 16},
		{at: BPCO - 6, s: 1.15, x: chest.x, y: chest.y - 60, dur: 14},
	];
	// image 0 : un aperçu de la radio (le haut du thorax déjà « ouvert »), qui se referme aussitôt ; puis la vraie radio
	// sur « Regarde ses poumons »
	const peel =
		frame < REG - 2
			? interpolate(frame, [0, 10], [2.45, 0], ease)
			: interpolate(frame, [REG - 2, POUM + 8], [0, 3], ease);
	const trapped = interpolate(frame, [COINC - 4, COINC + 14], [0, 1], clamp);
	const main = 1 - fadeIn(frame, ET - 6, 8);
	const coughing =
		frame < 18 || (frame >= TOUX - 2 && frame < TOUX + 20) || (frame >= MATINS - 4 && frame < MATINS + 22);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera
				punches={[TOUX + 1, CRACHE + 1, ESC + 1, ETAGE + 1, FAUX + 1, POUM + 1, BPCO + 1]}
				shakes={[2, TOUX + 2, FAUX + 2, BPCO + 2]}
				strength={0.04}
			>
				{main > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: main}}>
						<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
							<Man
								x={HP.x}
								y={HP.y}
								size={HP.size}
								mood="mal"
								breath={frame >= ETAGE ? pant(frame, 3.5) : idle(frame, 40)}
								sweat={fadeIn(frame, ETAGE, 8) * (1 - fadeIn(frame, REG, 8))}
								cough={coughing && frame < CRACHE - 2 ? 1 : 0}
								sputum={frame >= CRACHE - 2 && frame < ESC - 4 ? 1 : 0}
								puffs={frame >= ETAGE && frame < FAUX ? 1 : 0}
							/>
							<div style={{position: 'absolute', left: HP.x, top: HP.y}}>
								<ChestPeel size={HP.size} peel={peel} copd={1} trapped={trapped} air={frame >= REG ? frame : null} />
							</div>
							{frame >= CRACHE - 2 && frame < ESC - 4 ? (
								<div
									style={{
										position: 'absolute',
										left: face.x + 150,
										top: face.y + 110,
										transform: `scale(${popAt(frame, CRACHE - 2)}) rotate(-10deg)`,
									}}
								>
									<Tissue width={130} />
								</div>
							) : null}
						</ZoomCam>
						<Days from={MATINS - 4} to={CRACHE - 8} />
						{frame >= ESC - 2 && frame < REG ? (
							<div
								style={{
									position: 'absolute',
									left: 640,
									top: 760,
									transform: `scale(${popAt(frame, ESC - 2)})`,
									transformOrigin: '50% 100%',
									opacity: 1 - fadeIn(frame, REG - 6, 6),
								}}
							>
								<Stairs from={ESC} stop={ETAGE} size={380} />
							</div>
						) : null}
						<PillAt from={ETAGE - 2} to={LUI - 4} x={640} y={1160} color={LPI.pink}>
							à chaque étage
						</PillAt>
						{/* ce qu'il se dit : la bulle est barrée en son milieu */}
						{frame >= DIT - 4 && frame < REG ? (
							<div
								style={{
									position: 'absolute',
									left: 410,
									top: 520,
									transform: `scale(${popAt(frame, DIT - 4)})`,
									transformOrigin: 'left bottom',
									opacity: 1 - fadeIn(frame, REG - 6, 6),
								}}
							>
								<div style={{position: 'relative', display: 'inline-block'}}>
									<Bubble tail="left" think>
										<span style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 42, width: 560}}>
											<CigaretteIcon size={70} />
											{frame >= CIG - 2 ? "c'est juste la cigarette…" : "c'est juste…"}
										</span>
									</Bubble>
									<div style={{position: 'absolute', inset: 0, zIndex: 3}}>
										<Strike at={FAUX} width={640} rot={-7} thick={18} />
									</div>
								</div>
							</div>
						) : null}
						<Stamp at={FAUX} x={720} y={760} text="FAUX !" size={74} rot={-10} out={REG - 6} />
						<PillAt from={BOUCH - 2} to={BPCO - 6} x={72} y={1330} color={LPI.pink} size={44}>
							les bronches se bouchent
						</PillAt>
						<PillAt from={COINC - 2} to={BPCO - 6} x={72} y={1420} color={LPI.sky} size={44}>
							l'air reste coincé
						</PillAt>
					</div>
				) : null}
				<HookTitle strike={FAUX} out={REG - 6} />
				<TitleAt from={REG - 2} to={BPCO - 6} text="Regarde ses *poumons*…" size={90} plate />
				{/* révélation */}
				{frame >= BPCO - 4 && frame < ET + 4 ? (
					<div
						style={{
							position: 'absolute',
							left: 60,
							top: 230,
							width: 960,
							display: 'flex',
							justifyContent: 'center',
							opacity: 1 - fadeIn(frame, ET - 4, 8),
						}}
					>
						<div
							style={{
								padding: '22px 46px',
								borderRadius: 44,
								background: alpha(LPI.paper, 0.95),
								boxShadow: SHADOW,
								textAlign: 'center',
								transform: `scale(${popAt(frame, BPCO - 4)})`,
							}}
						>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, lineHeight: 1.1}}>
								C'est la
							</div>
							{frame >= BPCO ? (
								<div
									style={{
										fontFamily: FONT.title,
										fontWeight: 900,
										fontSize: 200,
										color: LPI.pink,
										lineHeight: 1,
										transform: `scale(${popAt(frame, BPCO)})`,
										WebkitTextStroke: `6px ${N}`,
									}}
								>
									BPCO
								</div>
							) : null}
						</div>
					</div>
				) : null}
				<Burst at={BPCO} x={540} y={420} r={360} n={18} />
				{/* 2 malades sur 3 ne le savent pas */}
				{frame >= ET - 4 ? (
					<>
						<TitleAt from={ET - 2} text="*2* malades sur *3*…" size={92} y={260} />
						{[0, 1, 2].map((i) => {
							const t = [DEUX - 2, DEUX + 4, TROIS - 2][i];
							return frame >= t ? (
								<div
									key={i}
									style={{
										position: 'absolute',
										left: 60 + i * 330,
										top: 560,
										transform: `scale(${popAt(frame, t)})`,
										transformOrigin: '50% 100%',
									}}
								>
									<Patient size={300} mood={i < 2 ? 'calme' : 'mal'} breath={idle(frame + i * 20, 50)} />
								</div>
							) : null;
						})}
						<Badge at={SAVENT - 2} x={250} y={540} text="?" />
						<Badge at={SAVENT + 2} x={580} y={540} text="?" />
						<Badge at={TROIS + 4} x={910} y={540} text="✓" tone={LPI.blue} />
						<PillAt from={SAVENT - 2} x={170} y={1030} size={46} color={LPI.pink}>
							ne le savent même pas
						</PillAt>
					</>
				) : null}
			</Camera>
			<Flash at={FAUX} max={0.3} />
			<Flash at={BPCO} />
			<Sfx name="cough" at={0} volume={0.45} />
			<Sfx name="whoosh" at={2} volume={0.06} />
			<Sfx name="cough-2" at={TOUX - 2} volume={0.45} />
			<Sfx name="cough-1" at={CRACHE} volume={0.4} />
			<Sfx name="stairs" at={ESC - 2} volume={0.25} dur={ETAGE - ESC + 6} />
			<Sfx name="gasp" at={ETAGE} volume={0.35} />
			<Sfx name="lighter" at={LUI} volume={0.3} />
			<Sfx name="smoke" at={CIG} volume={0.3} />
			<Sfx name="stamp" at={FAUX} volume={0.12} />
			<Sfx name="buzz" at={FAUX + 2} volume={0.05} dur={14} />
			<Sfx name="whoosh" at={REG - 2} volume={0.09} />
			<Sfx name="gasp" at={COINC} volume={0.25} />
			<Sfx name="impact" at={BPCO} volume={0.13} />
			<Sfx name="pop" at={DEUX - 2} volume={0.08} />
			<Sfx name="pop" at={DEUX + 4} volume={0.08} />
			<Sfx name="pop" at={TROIS - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// Le sigle se déplie lettre par lettre (une ligne par lettre sous le socle) pendant « bronchopneumopathie chronique
// obstructive » ; puis chaque lettre reçoit son explication : une maladie des bronches, toute la vie (horloge),
// l'air passe mal (il s'essouffle).
const DP = {size: 330, x: 303, y: 8};

const LetterRow: React.FC<{
	i: number;
	letter: string;
	color: string;
	ink?: string;
	word: string;
	wAt: number;
	sub: string;
	sAt: number;
	at0: number;
}> = ({i, letter, color, ink = LPI.paper, word, wAt, sub, sAt, at0}) => {
	const frame = useCurrentFrame();
	if (frame < at0 + i * 3) return null;
	const p = popAt(frame, at0 + i * 3);
	const on = frame >= wAt;
	return (
		<div
			style={{
				position: 'absolute',
				left: 72,
				top: 1000 + i * 112,
				height: 98,
				display: 'flex',
				alignItems: 'center',
				gap: 22,
			}}
		>
			<div
				style={{
					width: 96,
					height: 96,
					borderRadius: 26,
					background: color,
					border: `6px solid ${N}`,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 66,
					color: ink,
					transform: `scale(${p * (on && frame < wAt + 10 ? 1 + 0.15 * Math.exp(-(frame - wAt) / 3) : 1)})`,
					boxShadow: SHADOW,
				}}
			>
				{letter}
			</div>
			{on ? (
				<div
					style={{
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 56,
						color: N,
						transform: `scale(${popAt(frame, wAt)})`,
						transformOrigin: 'left center',
						whiteSpace: 'nowrap',
					}}
				>
					{word}
				</div>
			) : null}
			{frame >= sAt ? (
				<div
					style={{
						fontFamily: FONT.body,
						fontWeight: 800,
						fontSize: 34,
						color: alpha(N, 0.72),
						opacity: fadeIn(frame, sAt, 6),
						transform: `translateX(${(1 - fadeIn(frame, sAt, 6)) * -20}px)`,
						whiteSpace: 'nowrap',
					}}
				>
					· {sub}
				</div>
			) : null}
		</div>
	);
};

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const LA = at('def', 'la');
	const FULL = at('def', 'bronchopneumopathie');
	const CHRO = at('def', 'chronique');
	const OBS = at('def', 'obstructive');
	const MALADIE = at('def', 'maladie');
	const BRONCHES = at('def', 'bronches');
	const VIE = at('def', 'vie');
	const AIR = at('def', "l'air");
	const MAL = at('def', 'mal');
	const PNEU = FULL + Math.round((CHRO - FULL) * 0.4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FULL + 1, PNEU + 1, CHRO + 1, OBS + 1, MAL + 1]} shakes={[MAL + 2]}>
				<div style={{position: 'absolute', left: 72, top: LAY.kickerY}}>
					<Kicker at={LA}>Définition</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: LAY.titleY, width: 936}}>
					<Title at={LA + 2} text="La *BPCO*" size={92} stagger={3} />
				</div>
				{frame >= FULL - 2 ? (
					<div
						style={{
							position: 'absolute',
							left: 72,
							top: 392,
							fontFamily: FONT.body,
							fontWeight: 800,
							fontSize: 34,
							color: alpha(N, 0.75),
							opacity: fadeIn(frame, FULL - 2, 8),
						}}
					>
						Bronchopneumopathie chronique obstructive
					</div>
				) : null}
				<Stage y={456} h={520} at={LA + 4} bumps={[BRONCHES, VIE, MAL]}>
					<Man
						x={DP.x}
						y={DP.y}
						size={DP.size}
						mood={frame >= AIR ? 'mal' : 'calme'}
						breath={frame >= AIR ? pant(frame) : idle(frame)}
						puffs={frame >= MAL ? 1 : 0}
					/>
					{frame >= BRONCHES - 2 && frame < VIE - 4 ? (
						<div style={{position: 'absolute', left: 660, top: 70, transform: `scale(${popAt(frame, BRONCHES - 2)})`}}>
							<LungsPicto size={220} />
						</div>
					) : null}
					{frame >= VIE - 4 && frame < AIR - 2 ? (
						<div style={{position: 'absolute', left: 680, top: 60, transform: `scale(${popAt(frame, VIE - 4)})`}}>
							<WallClock h={8} m={0} size={200} spin={interpolate(frame, [VIE - 4, AIR], [0, 3], clamp)} />
						</div>
					) : null}
					<StagePill from={MALADIE - 2} to={VIE - 4}>
						une maladie des bronches
					</StagePill>
					<StagePill from={VIE - 2} to={AIR - 2} color={LPI.sky}>
						toute la vie
					</StagePill>
					<StagePill from={AIR - 2} color={LPI.blue}>
						l'air passe mal
					</StagePill>
				</Stage>
				<LetterRow
					i={0}
					letter="B"
					color={LPI.blue}
					word="Broncho"
					wAt={FULL}
					sub="les bronches"
					sAt={BRONCHES}
					at0={LA + 2}
				/>
				<LetterRow
					i={1}
					letter="P"
					color={LPI.pink}
					ink={N}
					word="Pneumopathie"
					wAt={PNEU}
					sub="une maladie"
					sAt={MALADIE}
					at0={LA + 2}
				/>
				<LetterRow i={2} letter="C" color={N} word="Chronique" wAt={CHRO} sub="toute la vie" sAt={VIE} at0={LA + 2} />
				<LetterRow
					i={3}
					letter="O"
					color={LPI.sky}
					ink={N}
					word="Obstructive"
					wAt={OBS}
					sub="l'air passe mal"
					sAt={AIR}
					at0={LA + 2}
				/>
			</Camera>
			{[FULL, PNEU, CHRO, OBS].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
			<Sfx name="tick" at={VIE} volume={0.06} />
			<Sfx name="gasp" at={MAL} volume={0.25} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LA RADIO, COUCHE PAR COUCHE ═══════════════════════════════ */
// Le patient en grand, la caméra s'approche lentement du thorax ; à chaque mot la ligne de la radio descend et enlève
// une couche : « sous les côtes » (cage thoracique) → « les poumons » → « à l'intérieur » (trachée, bronches, l'air
// descend) ; « alvéoles » : plongée au bout d'une bronchiole, les grappes d'alvéoles, puis une alvéole et son
// vaisseau (l'O₂ passe dans le sang) ; « Mais chez lui » : retour dans les poumons, les bronches s'enflamment (loupe :
// bronche en coupe qui gonfle, mucus, rétrécit), les alvéoles cassent (emphysème), l'air reste piégé.
const RP = {size: 640, x: 220, y: 500};
const rK = RP.size / 400;
/** Point du repère « poumons » (600 × 640) → contenu de la caméra. */
const lungPt = (x: number, y: number) => ({
	x: RP.x + (LUNGS_IN_PATIENT.x + x * LUNGS_IN_PATIENT.s) * rK,
	y: RP.y + (LUNGS_IN_PATIENT.y + y * LUNGS_IN_PATIENT.s) * rK,
});
const chestPt = (x: number, y: number) => ({x: RP.x + x * rK, y: RP.y + y * rK});

/** Médaillon plein écran (gros plan) qui arrive en fondu. */
const Medallion: React.FC<{from: number; to: number; y?: number; r?: number; children: React.ReactNode}> = ({
	from,
	to,
	y = 860,
	r = 400,
	children,
}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 8) return null;
	const o = interpolate(frame, [from, from + 8, to, to + 8], [0, 1, 1, 0], clamp);
	return (
		<>
			<AbsoluteFill style={{background: alpha(LPI.paper, 0.82 * o)}} />
			<div
				style={{
					position: 'absolute',
					left: 540 - r,
					top: y - r,
					width: 2 * r,
					height: 2 * r,
					borderRadius: r,
					border: `10px solid ${N}`,
					boxSizing: 'border-box',
					background: LPI.paper,
					overflow: 'hidden',
					boxShadow: SHADOW,
					opacity: o,
					transform: `scale(${0.85 + 0.15 * o})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{children}
			</div>
		</>
	);
};

export const Radio: React.FC = () => {
	const frame = useCurrentFrame();
	const RADIO = at('radio', 'radio');
	const SOUS = at('radio', 'sous');
	const POUM = at('radio', 'poumons');
	const INT = at('radio', "l'intérieur");
	const AIR = at('radio', "l'air");
	const TRACH = at('radio', 'trachée');
	const BRON = at('radio', 'bronches');
	const ALV = at('radio', 'alvéoles');
	const PETITS = at('radio', 'petits');
	const OXY = at('radio', "l'oxygène");
	const SANG = at('radio', 'sang');
	const MAIS = at('radio', 'mais');
	const ENFL = at('radio', 'enflammées');
	const MUCUS = at('radio', 'mucus');
	const RETR = at('radio', 'rétrécissent');
	const ALV2 = at('radio', 'alvéoles', 2);
	const CASS = at('radio', 'cassent');
	const EMPH = at('radio', "l'emphysème");
	const AIR2 = at('radio', "l'air", 2);
	const PIEGE = at('radio', 'piégé');
	const chest = chestPt(200, 300);
	const tip = lungPt(150, 470);
	const keys: CamKey[] = [
		{at: 0, s: 1.15, x: chest.x, y: chest.y - 60, dur: SOUS},
		{at: SOUS - 4, s: 1.45, x: chest.x, y: chest.y - 20, dur: 30},
		{at: INT - 4, s: 1.75, x: chest.x, y: chest.y, dur: 16},
		{at: ALV - 8, s: 4.5, x: tip.x, y: tip.y, dur: 12},
		{at: MAIS - 6, s: 1.75, x: chest.x, y: chest.y, dur: 2},
	];
	const cam = camAt(frame, keys, 1080, 1920);
	const peel = interpolate(
		frame,
		[SOUS - 2, SOUS + 18, POUM - 6, POUM + 12, INT - 4, INT + 14],
		[0, 1, 1, 2, 2, 3],
		ease,
	);
	const copd = interpolate(
		frame,
		[ENFL - 4, ENFL + 16, MUCUS - 2, MUCUS + 10, RETR - 2, RETR + 16],
		[0, 0.4, 0.4, 0.7, 0.7, 1],
		ease,
	);
	const trapped = interpolate(frame, [AIR2 - 2, PIEGE + 12], [0, 1], clamp);
	const bron = cam.view(lungPt(232, 330).x, lungPt(232, 330).y);
	const alv = cam.view(lungPt(150, 470).x, lungPt(150, 470).y);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera
				punches={[SOUS + 1, POUM + 1, INT + 1, ALV + 1, MAIS + 1, PIEGE + 1]}
				shakes={[PIEGE + 2]}
				strength={0.03}
			>
				<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
					<div style={{position: 'absolute', left: RP.x, top: RP.y}}>
						<Patient
							size={RP.size}
							mood={frame >= MAIS ? 'mal' : 'calme'}
							breath={frame >= MAIS ? pant(frame, 5) * 0.5 : idle(frame, 60)}
						/>
					</div>
					<div style={{position: 'absolute', left: RP.x, top: RP.y}}>
						<ChestPeel
							size={RP.size}
							peel={peel}
							copd={copd}
							air={frame >= AIR - 2 ? frame : null}
							trapped={trapped}
							breath={idle(frame, 60)}
						/>
					</div>
				</ZoomCam>
				{/* gros plans : les alvéoles, puis une alvéole et son vaisseau */}
				<Medallion from={ALV + 2} to={OXY - 12}>
					<AlveoliZoom size={760} o2={frame} airIn={frame} />
				</Medallion>
				<Medallion from={OXY - 4} to={MAIS - 4}>
					<AlveolusExchange size={760} phase={frame * 3} />
				</Medallion>
				{/* loupes BPCO */}
				<ZoomBubble at={ENFL - 4} until={ALV2 - 6} ax={bron.x} ay={bron.y} cx={790} cy={640} r={230}>
					<AirwayCross
						size={380}
						inflame={interpolate(frame, [ENFL - 2, ENFL + 16], [0, 1], ease)}
						mucus={interpolate(frame, [MUCUS - 2, MUCUS + 12], [0, 1], ease)}
						squeeze={interpolate(frame, [RETR - 2, RETR + 14], [0, 1], ease)}
					/>
				</ZoomBubble>
				<ZoomBubble at={ALV2 - 4} ax={alv.x} ay={alv.y} cx={790} cy={640} r={230}>
					<AlveoliZoom
						size={440}
						emph={interpolate(frame, [CASS - 4, EMPH + 10], [0, 1], ease)}
						trapped={trapped}
						vessels={0.8}
					/>
				</ZoomBubble>
				{/* titres */}
				<TitleAt from={-30} to={SOUS - 6} text="Passons-le à la *radio*" size={86} plate />
				<TitleAt from={SOUS - 2} to={POUM - 6} text="Sous les *côtes*…" size={86} plate />
				<TitleAt from={POUM - 4} to={INT - 6} text="… les *poumons*" size={86} plate />
				<TitleAt from={INT - 2} to={ALV - 4} text="À *l'intérieur*" size={86} plate />
				<TitleAt from={ALV - 2} to={OXY - 6} text="Les *alvéoles*" size={86} y={180} plate />
				<TitleAt from={OXY - 4} to={MAIS - 6} text="L'O₂ passe dans le *sang*" size={76} y={180} plate />
				<TitleAt from={MAIS - 2} to={ALV2 - 6} text="Chez lui : les *bronches*" size={80} plate />
				<TitleAt from={ALV2 - 4} text="… et les *alvéoles*" size={80} plate />
				{/* étiquettes */}
				<PillAt from={SOUS + 4} to={POUM - 6} y={1330} color={LPI.sky}>
					la cage thoracique
				</PillAt>
				<PillAt from={POUM + 2} to={INT - 6} y={1330} color={LPI.pink}>
					les poumons
				</PillAt>
				<PillAt from={TRACH - 2} to={BRON - 9} y={1330} color={LPI.sky}>
					la trachée
				</PillAt>
				<PillAt from={BRON - 2} to={ALV - 6} y={1330} color={LPI.sky}>
					puis les bronches
				</PillAt>
				<PillAt from={PETITS - 2} to={OXY - 6} y={1300} x={140} color={LPI.pink}>
					de petits sacs d'air
				</PillAt>
				<PillAt from={SANG - 2} to={MAIS - 6} y={1300} x={140} color={LPI.blue}>
					O₂ → sang · CO₂ → air
				</PillAt>
				<PillAt from={ENFL - 2} to={MUCUS - 9} y={1330} color={LPI.pink}>
					elles s'enflamment
				</PillAt>
				<PillAt from={MUCUS - 2} to={RETR - 9} y={1330} color={LPI.sky}>
					du mucus
				</PillAt>
				<PillAt from={RETR - 2} to={ALV2 - 6} y={1330} color={LPI.blue}>
					le passage rétrécit
				</PillAt>
				<PillAt from={EMPH - 2} to={AIR2 - 4} y={1330} color={LPI.pink}>
					emphysème : alvéoles détruites
				</PillAt>
				<Stamp at={PIEGE} x={330} y={1300} text="Air piégé !" size={62} rot={-7} />
			</Camera>
			<Flash at={MAIS} max={0.25} />
			<Sfx name="whoosh" at={RADIO - 4} volume={0.06} />
			<Sfx name="whoosh" at={SOUS - 2} volume={0.08} />
			<Sfx name="whoosh" at={POUM - 6} volume={0.08} />
			<Sfx name="whoosh" at={INT - 4} volume={0.08} />
			<Sfx name="sigh" at={AIR - 2} volume={0.2} dur={60} />
			<Sfx name="whoosh" at={ALV - 8} volume={0.09} />
			<Sfx name="pop" at={PETITS} volume={0.07} />
			<Sfx name="ding" at={SANG} volume={0.06} />
			<Sfx name="cough-1" at={MAIS} volume={0.4} />
			<Sfx name="buzz" at={ENFL} volume={0.05} dur={14} />
			<Sfx name="pop" at={MUCUS} volume={0.08} />
			<Sfx name="buzz" at={RETR} volume={0.05} dur={14} />
			<Sfx name="pop" at={CASS} volume={0.08} />
			<Sfx name="gasp" at={AIR2} volume={0.28} />
			<Sfx name="stamp" at={PIEGE} volume={0.12} />
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
											return (
												<div
													key={i}
													style={{
														position: 'absolute',
														left: 330 + t * 300,
														top: 170 + Math.sin(t * 6 + i) * 40 - t * 30,
														width: 40 + t * 50,
														height: 40 + t * 50,
														borderRadius: '50%',
														background: alpha(N, 0.22),
														opacity: smoke * Math.sin(t * Math.PI),
													}}
												/>
											);
										})
									: null}
								<div style={{position: 'absolute', left: 580, top: 90}}>
									<LungsPicto size={300} />
								</div>
							</div>
						) : null}
						{grid > 0 ? (
							<div
								style={{
									position: 'absolute',
									left: 58,
									top: 210,
									width: 820,
									display: 'flex',
									flexWrap: 'wrap',
									gap: 20,
									opacity: grid,
								}}
							>
								{Array.from({length: 10}, (_, i) => {
									const lit = frame >= HUIT + i * 2 && i < 8;
									return (
										<div
											key={i}
											style={{
												width: 148,
												height: 130,
												borderRadius: 30,
												background: lit ? LPI.pink : LPI.paper,
												border: `5px solid ${lit ? N : alpha(N, 0.25)}`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												transform: `scale(${popAt(frame, DANS - 2 + i)})`,
											}}
										>
											<LungsPicto size={92} />
										</div>
									);
								})}
							</div>
						) : null}
					</ZoomCam>
					{frame >= DIX - 2 ? (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 40,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'baseline',
								gap: 16,
							}}
						>
							<div
								style={{
									fontFamily: FONT.title,
									fontWeight: 900,
									fontSize: 130,
									color: LPI.pink,
									lineHeight: 1,
									WebkitTextStroke: `4px ${N}`,
									transform: `scale(${popAt(frame, DIX - 2)})`,
								}}
							>
								8 / 10
							</div>
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
			<Sfx name="lighter" at={COUP - 6} volume={0.3} />
			<Sfx name="smoke" at={TABAC + 4} volume={0.3} />
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
				<Head kicker="Les signes" kAt={SIG - 4} title="Ça s'installe *doucement*" size={80} tAt={SIG} />
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
									<div
										key={i}
										style={{
											position: 'absolute',
											left: 40 + ((i * 167) % 860),
											top: -30 + t * 520,
											opacity: fadeIn(frame, BRON - 2, 10) * Math.sin(t * Math.PI),
											transform: `rotate(${frame * 2 + i * 30}deg)`,
										}}
									>
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
						une toux
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
					<CauseChip at={TOUX} icon={<CoughIcon size={56} />} label="une toux" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1110}}>
					<CauseChip at={CRA} icon={<SputumIcon size={56} />} label="crachats le matin" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1220}}>
					<CauseChip at={BRON} icon={<SnowPicto size={56} />} label="bronchites l'hiver" tone={LPI.sky} />
				</div>
			</Camera>
			<Sfx name="gasp" at={ESS} volume={0.3} />
			<Sfx name="pop" at={ESS} volume={0.07} />
			<Sfx name="pop" at={EFF} volume={0.09} />
			<Sfx name="cough" at={TOUX - 2} volume={0.42} />
			<Sfx name="pop" at={CRA} volume={0.09} />
			<Sfx name="tick" at={MATIN} volume={0.07} />
			<Sfx name="whoosh" at={BRON - 2} volume={0.06} />
			<Sfx name="pop" at={BRON} volume={0.09} />
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
	const SI = at('diag', "s'il");
	const SEC = at('diag', 'seconde');
	const SOIX = at('diag', 'soixante-dix');
	const CENT = at('diag', 'cent');
	const OBST = at('diag', 'obstruées');
	const k = SPIRO.w / 560;
	const mouth = {x: DG.x + (200 * DG.size) / 400, y: DG.y + (150 * DG.size) / 400};
	const inlet = {x: SPIRO.x + 14 * k, y: SPIRO.y + 300 * k};
	const screen = {x: SPIRO.x + 290 * k, y: SPIRO.y + 180 * k};
	const keys: CamKey[] = [
		{at: SOIX - 4, s: 1.65, x: screen.x, y: screen.y, dur: 14},
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
						<Man
							x={DG.x}
							y={DG.y}
							size={DG.size}
							mood={blowing ? 'mal' : 'calme'}
							breath={blowing ? 0.2 : idle(frame)}
						/>
						{hose > 0 ? (
							<svg
								width={936}
								height={520}
								style={{position: 'absolute', inset: 0, overflow: 'visible'}}
								opacity={hose}
							>
								<path
									d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`}
									fill="none"
									stroke={N}
									strokeWidth={30}
									strokeLinecap="round"
								/>
								<path
									d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`}
									fill="none"
									stroke={LPI.sky}
									strokeWidth={18}
									strokeLinecap="round"
								/>
								{blowing ? (
									<path
										d={`M${mouth.x + 18} ${mouth.y} C${mouth.x + 120} ${mouth.y + 10} ${inlet.x - 140} ${inlet.y + 40} ${inlet.x} ${inlet.y}`}
										fill="none"
										stroke={LPI.paper}
										strokeWidth={9}
										strokeLinecap="round"
										strokeDasharray="4 22"
										strokeDashoffset={-frame * 6}
									/>
								) : null}
								<rect
									x={mouth.x - 4}
									y={mouth.y - 14}
									width={34}
									height={28}
									rx={8}
									fill={LPI.blue}
									stroke={N}
									strokeWidth={5}
								/>
							</svg>
						) : null}
						<div style={{position: 'absolute', left: SPIRO.x, top: SPIRO.y}}>
							<Spirometer
								width={SPIRO.w}
								t={t}
								copd={1}
								ref={fadeIn(frame, SI - 2, 10)}
								mark={fadeIn(frame, SEC - 2, 8)}
								blow={blowing ? 1 : 0}
							/>
						</div>
					</ZoomCam>
					{frame >= SEC - 2 ? (
						<div
							style={{
								position: 'absolute',
								left: 560,
								top: 400,
								transform: `scale(${popAt(frame, SEC - 2)})`,
								padding: '8px 22px',
								borderRadius: 24,
								background: LPI.pink,
								border: `5px solid ${N}`,
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 40,
								color: N,
								whiteSpace: 'nowrap',
							}}
						>
							lui : {v1} % en 1 s
						</div>
					) : null}
					<StagePill from={SI - 2} to={SEC - 2} color={LPI.blue} y={440}>
						VEMS : l'air soufflé en 1 seconde
					</StagePill>
				</Stage>
				{frame >= OBST ? <Stamp at={OBST} x={300} y={560} text="Obstruées !" size={60} rot={-7} /> : null}
				<TermSlam
					index={0}
					at={SPI}
					term="Spirométrie"
					meaning="souffler le plus fort possible dans un tube"
					sign="device"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= SPI}
				/>
				<TermSlam
					index={1}
					at={CENT}
					term="VEMS / CVF < 70 %"
					meaning="en 1 seconde, il vide moins de 70 % de son air"
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(1)}
					active={frame >= CENT}
				/>
			</Camera>
			<Sfx name="pop" at={PAT} volume={0.08} />
			<Sfx name="blow" at={SOUF} volume={0.4} />
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
	const INHAL = at('traitement', 'inhalateurs');
	const BRONCHO = INHAL - 6;
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
							<Man
								x={318}
								y={0}
								size={300}
								mood="mal"
								breath={pant(frame, 4) * 0.6}
								lungs={1}
								bronchi={1}
								narrow={1}
								trapped={0.8}
							/>
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
								<Inhaler
									width={190}
									press={interpolate(frame, [INHAL - 2, INHAL + 3, INHAL + 10], [0, 1, 0], clamp)}
									puff={interpolate(frame, [INHAL, INHAL + 4, OUVR + 30, OUVR + 40], [0, 1, 1, 0], clamp)}
								/>
							</div>
							<div style={{position: 'absolute', left: 260, top: 70}}>
								<Bronchus
									width={660}
									inflame={1 - 0.6 * open}
									mucus={1 - open}
									narrow={1 - 0.75 * open}
									alveoli={0.9}
									damage={0.6}
									mist={interpolate(frame, [INHAL + 4, INHAL + 12, REHA - 8, REHA - 2], [0, 1, 1, 0], clamp)}
									airIn={open}
								/>
							</div>
						</div>
					) : null}
					{pReha > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: pReha}}>
							<Man
								x={60}
								y={20}
								size={300}
								mood={frame >= REENT ? 'content' : 'calme'}
								breath={frame >= REENT ? idle(frame, 50) : pant(frame, 4) * 0.5}
								lungs={1}
								bronchi={1}
								narrow={0.5}
							/>
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
						<div
							style={{
								position: 'absolute',
								left: 340,
								top: 110,
								opacity: pVacc,
								transform: `scale(${popAt(frame, VACC - 4)})`,
							}}
						>
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
				<Stamp at={GUER} x={640} y={380} text="Ne se guérit pas" size={46} rot={-7} out={FREIN + 10} />
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 975,
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
						alignItems: 'flex-start',
					}}
				>
					<CheckChip at={ARR} label="Arrêt du tabac" size={38} />
					<CheckChip at={INHAL} label="Inhalateurs" sub="bronchodilatateurs : ouvrent les bronches" size={38} />
					<CheckChip at={REHA} label="Réhabilitation respiratoire" size={38} />
					<CheckChip at={VACC} label="Vaccins" sub="grippe, pneumocoque" size={38} />
				</div>
			</Camera>
			<Sfx name="stamp" at={GUER} volume={0.09} />
			<Sfx name="buzz" at={ARR + 6} volume={0.06} dur={12} />
			<Sfx name="pop" at={BRONCHO} volume={0.09} />
			<Sfx name="puff" at={INHAL} volume={0.4} />
			<Sfx name="ding" at={OUVR + 10} volume={0.07} />
			<Sfx name="pop" at={REHA} volume={0.09} />
			<Sfx name="pop" at={VACC} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 7 · OXYGÈNE ET EXACERBATION ═══════════════════════════════ */
// Lunettes à oxygène, SpO₂ qui remonte dans la cible 88 – 95 % (échelle des normes adulte + cadre « cible BPCO ») ;
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
	const Q95 = at('oxygene', 'quatre-vingt-quinze');
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
	const sat = worse
		? interpolate(frame, [AGG, AGG + 30], [90, 84], ease)
		: interpolate(frame, [SAT - 6, Q95 + 10], [85, 91], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[OXY + 1, PETIT + 1, Q88 + 1, Q95 + 1, AGG + 1, EXA + 1]} shakes={[AGG + 2]}>
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
				<NormScale
					zones={SPO_ZONES}
					value={sat}
					at={VISE}
					y={880}
					x={110}
					width={870}
					bracket={{lo: 88, hi: 95, label: 'cible BPCO : 88 – 95 %', at: Q88}}
				/>
				<TermSlam
					index={0}
					at={CENT}
					term="SpO₂ : 88 – 95 %"
					meaning="pas plus : trop d'O₂ peut être dangereux"
					sign="check"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= CENT}
				/>
				<TermSlam
					index={1}
					at={EXA}
					term="Exacerbation"
					meaning="une poussée : tout s'aggrave d'un coup"
					sign="alert"
					slamY={SLAM_Y}
					slot={termSlot(1)}
					active={frame >= EXA}
				/>
				<Stamp at={CONS} x={600} y={1380} text="On consulte vite !" size={54} rot={-6} />
			</Camera>
			<Flash at={AGG} max={0.35} />
			<Sfx name="whoosh" at={OXY - 2} volume={0.06} />
			<Sfx name="pop" at={PETIT} volume={0.08} />
			<Sfx name="tick" at={Q88} volume={0.08} />
			<Sfx name="tick" at={Q95} volume={0.08} />
			<Sfx name="cough-2" at={AGG + 6} volume={0.4} />
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
