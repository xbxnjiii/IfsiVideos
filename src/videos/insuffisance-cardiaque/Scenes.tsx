// Scènes de « L'insuffisance cardiaque » (format pathologie) : chaque mouvement part d'un mot de la voix (`npm run cues`).
// Accroche « 3 indices » : +3 kg en une semaine (alors qu'il mange moins), il dort assis sur 3 oreillers, ses chevilles
// gonflent le soir ; chaque indice se range en pastille ; « ce n'est pas l'âge » (barré) ; les indices pointent vers son
// cœur qui s'épuise (pile vide) ; « l'insuffisance cardiaque » (flash) ; « ses poumons peuvent se noyer » (l'eau monte).
// Puis définition, cœur gauche (poumons, orthopnée), cœur droit (œdèmes, signe du godet, poids), la pesée quotidienne,
// traitement, urgence (OAP), récap. Briques : src/brand/heartfail.tsx + `Patient` (`flood`, `lungs`, `cannula`…).
import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {WallClock, Phone} from '../../brand/devices';
import {camAt, CamKey, CauseChip, Head, Lead, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {Ankles, BathScale, Battery, Foam, PropUp, SaltShaker, SitLegsDown} from '../../brand/heartfail';
import {BedIcon, EyeIcon, HypertensionIcon, LegIcon, MoonIcon, PillIcon} from '../../brand/icons';
import {CheckChip, Stamp, Strike} from '../../brand/kit';
import {Sign} from '../../brand/learn';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Patient, PatientProps} from '../../brand/patient';
import {Heart} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {Jar} from '../../brand/urine';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
/** respiration rapide et laborieuse (essoufflement) */
const pant = (frame: number, period = 5) => 0.5 - 0.5 * Math.cos(frame / period);
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
/** ressort sans hook (utilisable dans une boucle) */
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
/** point d'une courbe de Bézier quadratique */
const bez = (t: number, p0: number[], p1: number[], p2: number[]) => [0, 1].map((i) => (1 - t) ** 2 * p0[i] + 2 * (1 - t) * t * p1[i] + t * t * p2[i]);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.5}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Pastille ronde (« ? », « ! », « ✓ », « 3 ») qui tangue. */
const Badge: React.FC<{at: number; until?: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({at: t0, until = 1e9, x, y, text, tone = LPI.pink, size = 110}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= until) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.62, color: tone === LPI.blue ? LPI.paper : N, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`}}>
			{text}
		</div>
	);
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 3}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 6) return null;
	const o = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: o}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Indice de l'accroche : il « pop » sur son mot puis file se ranger dans sa pastille (tx, ty). */
const Panel: React.FC<{from: number; to: number; x: number; y: number; w: number; h: number; tx?: number; ty?: number; children: React.ReactNode}> = ({from, to, x, y, w, h, tx, ty, children}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 9) return null;
	const cx = x + w / 2;
	const cy = y + h / 2;
	const p = interpolate(frame, [to, to + 9], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const dx = ((tx ?? cx) - cx) * p;
	const dy = ((ty ?? cy) - cy) * p;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${dx}px, ${dy}px) scale(${Math.max(0, popAt(frame, from)) * (1 - 0.85 * p)})`, opacity: interpolate(p, [0.6, 1], [1, 0], clamp)}}>
			{children}
		</div>
	);
};

/* ───────────── petites icônes (100 × 100) ───────────── */

const ScaleIcon: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round">
		<rect x={12} y={18} width={76} height={68} rx={16} fill={LPI.paper} />
		<rect x={30} y={30} width={40} height={18} rx={5} fill={N} />
		<path d="M50 44 L58 36" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** cœur abîmé par un infarctus (zone éteinte bleu nuit) */
const HeartScarIcon: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		<path d="M0 32 C-46 -4 -30 -52 0 -26 C30 -52 46 -4 0 32 Z" fill={LPI.pink} stroke={N} strokeWidth={7} strokeLinejoin="round" />
		<path d="M6 -16 C22 -22 30 -8 22 6 C14 14 2 8 4 -4 Z" fill={N} />
	</svg>
);

const HeartIcon: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		<path d="M0 32 C-46 -4 -30 -52 0 -26 C30 -52 46 -4 0 32 Z" fill={LPI.pink} stroke={N} strokeWidth={7} strokeLinejoin="round" />
	</svg>
);

/** Assiette : la portion rétrécit (`less` 0 → 1). */
const Plate: React.FC<{less: number; width?: number}> = ({less, width = 300}) => (
	<svg width={width} height={(width * 200) / 300} viewBox="0 0 300 200" style={{overflow: 'visible'}}>
		<path d="M28 40 V90 M20 40 V70 Q20 82 28 82 Q36 82 36 70 V40" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
		<ellipse cx={160} cy={110} rx={118} ry={74} fill={LPI.paper} stroke={N} strokeWidth={7} />
		<ellipse cx={160} cy={110} rx={82} ry={50} fill="none" stroke={alpha(LPI.sky, 0.95)} strokeWidth={6} />
		<ellipse cx={160} cy={108} rx={56 - 40 * less} ry={30 - 21 * less} fill={LPI.blue} stroke={N} strokeWidth={6} />
		<ellipse cx={150 + 20 * less} cy={100} rx={14 - 8 * less} ry={7 - 4 * less} fill={alpha(LPI.paper, 0.7)} />
	</svg>
);

/** Semaine : 7 jours qui se cochent l'un après l'autre à partir de `from`. */
const Week: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 10}}>
			{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
				const on = frame >= from + i * 3;
				const p = on ? popAt(frame, from + i * 3) : 1;
				return (
					<div key={i} style={{width: 58, height: 58, borderRadius: 29, background: on ? LPI.pink : LPI.paper, border: `5px solid ${on ? N : alpha(N, 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N, transform: `scale(${p})`}}>
						{d}
					</div>
				);
			})}
		</div>
	);
};

/* ───────────── le patient et ses calques (espace 400 × 560) ───────────── */

const HEART = 'M0 24 C-38 -4 -26 -42 0 -22 C26 -42 38 -4 0 24 Z';
const REFLUX = [
	[
		[214, 286],
		[172, 258],
		[150, 320],
	],
	[
		[244, 286],
		[280, 268],
		[256, 352],
	],
];

type ManProps = PatientProps & {
	x: number;
	y: number;
	/** moitié du cœur qui faiblit : G = cœur gauche (à droite de l'écran), D = cœur droit */
	side?: 'G' | 'D';
	weak?: number;
	/** le sang reflue du cœur vers les poumons */
	reflux?: number;
	/** gouttes d'eau qui descendent dans le corps */
	drops?: number;
	/** souffle court (bouffées devant la bouche) */
	puffs?: number;
	/** mousse rosée à la bouche (OAP) */
	foam?: number;
	/** cicatrice d'infarctus sur le cœur */
	scar?: number;
	/** flèches de pression autour du cœur (hypertension) */
	squeeze?: number;
	opacity?: number;
};

const Man: React.FC<ManProps> = ({x, y, size = 360, side, weak = 0, reflux = 0, drops = 0, puffs = 0, foam = 0, scar = 0, squeeze = 0, opacity = 1, ...p}) => {
	const frame = useCurrentFrame();
	const cid = useId().replace(/:/g, '');
	const breath = p.breath ?? 0;
	const lift = breath * 8;
	const wide = 1 + breath * 0.035;
	const hs = (0.55 + 0.45 * (p.heart ?? 0)) * (1 + 0.14 * (p.beat ?? 0));
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size * 1.4, opacity}}>
			<Patient size={size} {...p} />
			<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id={`h${cid}`}>
						<rect x={side === 'G' ? 0 : -60} y={-60} width={60} height={120} />
					</clipPath>
				</defs>
				<g transform={`translate(200 ${380 - lift}) scale(${wide} 1) translate(-200 -380)`}>
					{reflux > 0
						? REFLUX.map(([p0, p1, p2], k) => (
								<g key={k} opacity={reflux}>
									<path d={`M${p0.join(' ')} Q${p1.join(' ')} ${p2.join(' ')}`} fill="none" stroke={alpha(LPI.pink, 0.9)} strokeWidth={9} strokeLinecap="round" strokeDasharray="4 14" strokeDashoffset={-frame * 1.5} />
									{[0, 1, 2].map((i) => {
										const [cx, cy] = bez(((frame * 0.03 + i / 3 + k * 0.17) % 1) * 0.95, p0, p1, p2);
										return <circle key={i} cx={cx} cy={cy} r={7} fill={LPI.pink} stroke={N} strokeWidth={2.5} />;
									})}
								</g>
							))
						: null}
					{drops > 0
						? Array.from({length: 7}, (_, i) => {
								const t = (frame * 0.022 + i * 0.143) % 1;
								const dx = 150 + ((i * 37) % 100);
								return <path key={i} d="M0 -12 C7 -3 9 4 0 9 C-9 4 -7 -3 0 -12 Z" transform={`translate(${dx} ${330 + t * 220}) scale(1.3)`} fill={alpha(LPI.blue, 0.85)} stroke={N} strokeWidth={2} opacity={drops * interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0])} />;
							})
						: null}
					<g transform={`translate(228 300) scale(${hs})`}>
						{side && weak > 0 ? (
							<g clipPath={`url(#h${cid})`} opacity={weak * (0.75 + 0.25 * Math.sin(frame / 5))}>
								<path d={HEART} fill={alpha(N, 0.55)} />
								<path d={HEART} fill="none" stroke={LPI.paper} strokeWidth={3} strokeDasharray="5 6" />
							</g>
						) : null}
						{scar > 0 ? <path d="M6 -14 C18 -18 24 -6 18 4 C12 10 2 6 4 -4 Z" fill={N} opacity={scar} /> : null}
						{squeeze > 0
							? [0, 90, 180, 270].map((r) => (
									<g key={r} transform={`rotate(${r}) translate(${-62 - 5 * Math.sin(frame / 3)} 0)`} opacity={squeeze}>
										<path d="M-14 0 H10 M2 -9 L11 0 L2 9" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
									</g>
								))
							: null}
					</g>
				</g>
				{puffs > 0
					? [0, 1, 2].map((k) => {
							const t = ((frame + k * 10) % 30) / 30;
							return <path key={k} d={`M${226 + t * 60} ${150 - 6 + k * 6} q14 -10 28 0`} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" opacity={puffs * (1 - t)} />;
						})
					: null}
			</svg>
			{foam > 0 ? <Foam size={size} on={foam} /> : null}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Trois kilos en une semaine… » + pèse-personne « +3,0 kg » (écran rose) + « ? ». Les jours de la semaine se
// cochent ; assiette dont la portion rétrécit (« alors qu'il mange moins ») ; l'indice file en pastille. Lit : 1, 2, 3
// oreillers ; chevilles qui gonflent le soir ; « c'est l'âge ? » barré ; le patient : les 3 pastilles pointent vers son
// cœur, pile vide ; « L'insuffisance cardiaque » (flash) ; les pastilles pâlissent (personne ne les voit) ; on plonge
// dans le thorax : l'eau monte dans les poumons (flash).
const HP = {x: 330, y: 470, size: 420};
const hookPt = (px: number, py: number) => ({x: HP.x + (px * HP.size) / 400, y: HP.y + (py * HP.size) / 400});
const CHIPS = [
	{x: 72, y: 1240, cx: 300, cy: 1288},
	{x: 600, y: 1240, cx: 780, cy: 1288},
	{x: 72, y: 1356, cx: 340, cy: 1404},
];

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SEMAINE = at('intro', 'semaine');
	const MANGE = at('intro', 'mange');
	const MOINS = at('intro', 'moins');
	const DORT = at('intro', 'dort');
	const ASSIS = at('intro', 'assis');
	const TROIS2 = at('intro', 'trois', 2);
	const OREILLERS = at('intro', 'oreillers');
	const SOIR = at('intro', 'soir');
	const CHEVILLES = at('intro', 'chevilles');
	const GONFLENT = at('intro', 'gonflent');
	const CE = at('intro', 'ce');
	const AGE = at('intro', "l'âge");
	const CEST = at('intro', "c'est");
	const COEUR = at('intro', 'cœur');
	const EPUISE = at('intro', "s'épuise");
	const CEST2 = at('intro', "c'est", 2);
	const INSUF = at('intro', "l'insuffisance");
	const PERSONNE = at('intro', 'personne');
	const SIGNES = at('intro', 'signes');
	const POUMONS = at('intro', 'poumons');
	const NOYER = at('intro', 'noyer');
	const heart = hookPt(228, 300);
	const chest = hookPt(200, 318);
	const keys: CamKey[] = [
		{at: EPUISE - 2, s: 1.3, x: heart.x, y: heart.y + 40, dur: 12},
		{at: CEST2 - 2, s: 1, dur: 12},
		{at: POUMONS - 4, s: 1.75, x: chest.x, y: chest.y, dur: 14},
	];
	const cam = camAt(frame, keys, 1080, 1920);
	const hv = cam.view(heart.x, heart.y);
	const pat = Math.max(0, popAt(frame, CEST - 4));
	const side = interpolate(frame, [MANGE - 8, MANGE + 2], [0, 1], ease);
	const pillows = interpolate(frame, [DORT, ASSIS + 8, TROIS2 - 2, TROIS2 + 4, OREILLERS, OREILLERS + 6], [0, 1, 1, 2, 2, 3], ease);
	const chipsOut = interpolate(frame, [NOYER - 6, NOYER + 2], [1, 0], clamp);
	const dim = 1 - 0.6 * fadeIn(frame, PERSONNE, 10);
	const links = fadeIn(frame, COEUR - 2, 10) * (1 - fadeIn(frame, CEST2 - 4, 8));
	const flood = interpolate(frame, [NOYER - 6, NOYER + 26], [0, 0.85], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SEMAINE + 1, MOINS + 1, ASSIS + 1, OREILLERS + 1, GONFLENT + 1, AGE + 1, COEUR + 1, SIGNES + 1]} shakes={[INSUF + 2, NOYER + 2]} strength={0.04}>
				{/* le patient (dans la caméra) : cœur fatigué, pile vide, puis poumons qui se noient */}
				{pat > 0 ? (
					<ZoomCam keys={keys} w={1080} h={1920} radius={0}>
						<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${0.85 + 0.15 * pat})`, transformOrigin: `${heart.x}px ${heart.y}px`, opacity: Math.min(1, pat * 1.5)}}>
							<Man
								x={HP.x}
								y={HP.y}
								size={HP.size}
								mood={frame >= EPUISE ? 'mal' : 'calme'}
								breath={frame >= NOYER - 4 ? pant(frame) : idle(frame)}
								heart={1}
								beat={pulseAt(frame, 30) * 0.6}
								lungs={fadeIn(frame, POUMONS - 4, 10)}
								flood={flood}
								puffs={fadeIn(frame, NOYER, 8)}
								sweat={fadeIn(frame, NOYER, 10)}
								cyanosis={0.5 * fadeIn(frame, NOYER + 6, 12)}
							/>
							{frame >= EPUISE - 4 && frame < POUMONS ? (
								<div style={{position: 'absolute', left: heart.x + 70, top: heart.y - 120, transform: `scale(${popAt(frame, EPUISE - 4)})`, opacity: 1 - fadeIn(frame, POUMONS - 8, 6)}}>
									<Battery level={interpolate(frame, [EPUISE - 4, EPUISE + 14], [0.7, 0.12], clamp)} width={130} />
								</div>
							) : null}
						</div>
					</ZoomCam>
				) : null}
				{/* les indices pointent vers le cœur */}
				{links > 0 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{CHIPS.map((c, i) => {
							const d = Math.hypot(hv.x - c.cx, hv.y - c.cy);
							const draw = fadeIn(frame, COEUR - 2 + i * 3, 10);
							return <path key={i} d={`M${c.cx} ${c.cy} L${hv.x} ${hv.y}`} stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${d * draw} ${d}`} opacity={links} />;
						})}
					</svg>
				) : null}
				{/* indice 1 : le poids */}
				<Panel from={-30} to={DORT - 6} x={190} y={500} w={700} h={640} tx={CHIPS[0].cx} ty={CHIPS[0].cy}>
					<div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: `translate(${-130 * side}px, ${60 * side}px) scale(${1 - 0.3 * side})`}}>
						<div style={{position: 'absolute', left: 50, top: 0}}>
							<BathScale value={3} delta alert={frame % 20 < 13 ? 1 : 0} width={600} />
						</div>
						<div style={{position: 'absolute', left: 117, top: 540}}>
							<Week from={SEMAINE - 2} />
						</div>
						<Badge at={-30} x={590} y={-44} text="?" size={120} />
					</div>
				</Panel>
				<Panel from={MANGE - 4} to={DORT - 6} x={620} y={640} w={400} h={380} tx={CHIPS[0].cx} ty={CHIPS[0].cy}>
					<Plate less={interpolate(frame, [MOINS - 2, MOINS + 10], [0, 1], ease)} width={380} />
					<div style={{position: 'absolute', left: 0, top: 280, width: 400, display: 'flex', justifyContent: 'center'}}>
						<Pill at={MOINS - 2} size={44} color={LPI.sky}>
							il mange moins
						</Pill>
					</div>
				</Panel>
				{/* indice 2 : il dort assis */}
				<Panel from={DORT - 4} to={SOIR - 8} x={160} y={560} w={760} h={500} tx={CHIPS[1].cx} ty={CHIPS[1].cy}>
					<div style={{position: 'absolute', left: 0, top: 70}}>
						<PropUp pillows={pillows} width={740} distress={0.3} />
					</div>
					<div style={{position: 'absolute', left: 630, top: -20}}>
						<MoonIcon size={120} />
					</div>
					<Badge at={OREILLERS - 2} x={10} y={0} text="3" tone={LPI.blue} size={110} />
				</Panel>
				{/* indice 3 : les chevilles */}
				<Panel from={SOIR - 6} to={CE - 8} x={290} y={560} w={500} h={480} tx={CHIPS[2].cx} ty={CHIPS[2].cy}>
					<Ankles swell={interpolate(frame, [CHEVILLES - 4, GONFLENT + 16], [0, 1], ease)} width={500} />
					<div style={{position: 'absolute', left: 420, top: -40}}>
						<MoonIcon size={110} />
					</div>
				</Panel>
				{/* « ce n'est pas l'âge » */}
				<Panel from={CE - 4} to={CEST - 6} x={140} y={660} w={800} h={200}>
					<div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200}}>
						<Pill at={CE - 4} size={84} color={LPI.sky}>
							« c'est l'âge… »
						</Pill>
						<Strike at={AGE + 2} width={720} rot={-6} thick={11} />
					</div>
				</Panel>
				{/* pastilles des indices */}
				<div style={{opacity: dim * chipsOut}}>
					<div style={{position: 'absolute', left: CHIPS[0].x, top: CHIPS[0].y}}>
						<CauseChip at={DORT - 2} icon={<ScaleIcon />} label="+3 kg / semaine" />
					</div>
					<div style={{position: 'absolute', left: CHIPS[1].x, top: CHIPS[1].y}}>
						<CauseChip at={SOIR - 4} icon={<BedIcon size={56} />} label="dort assis" />
					</div>
					<div style={{position: 'absolute', left: CHIPS[2].x, top: CHIPS[2].y}}>
						<CauseChip at={CE - 6} icon={<LegIcon size={56} />} label="chevilles gonflées" />
					</div>
				</div>
				{frame >= PERSONNE && frame < NOYER + 2 ? (
					<div style={{position: 'absolute', left: 860, top: 1340, opacity: chipsOut * fadeIn(frame, PERSONNE, 6), transform: `scale(${popAt(frame, PERSONNE)})`}}>
						<div style={{position: 'relative', width: 110, height: 110, borderRadius: 55, background: LPI.paper, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<EyeIcon size={80} />
							<Strike at={PERSONNE + 3} width={110} rot={-40} thick={12} />
						</div>
					</div>
				) : null}
				{frame >= NOYER - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center'}}>
						<Pill at={NOYER - 2} size={60} color={LPI.pink}>
							ses poumons se noient !
						</Pill>
					</div>
				) : null}
				{/* titres */}
				<TitleAt from={-60} to={DORT - 6} text="*Trois* *kilos* en une semaine…" size={96} stagger={0} />
				<TitleAt from={DORT - 4} to={SOIR - 8} text="Il dort *assis*…" size={100} />
				<TitleAt from={SOIR - 6} to={CE - 8} text="Le soir, ses *chevilles* *gonflent*" size={92} />
				<TitleAt from={CE - 4} to={CEST - 6} text="Ce n'est pas *l'âge*…" size={96} />
				<TitleAt from={CEST - 4} to={CEST2 - 6} text="C'est son *cœur* qui s'épuise" size={92} />
				{frame >= CEST2 - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, transform: `scale(${frame >= INSUF ? 1 + 0.1 * Math.exp(-(frame - INSUF) / 4) : 1})`, transformOrigin: 'left center'}}>
						<Title at={CEST2 - 4} text={"C'est *l'insuffisance*\n*cardiaque*"} size={96} stagger={4} />
					</div>
				) : null}
				<Burst at={INSUF} x={hv.x} y={hv.y} r={300} n={16} />
			</Camera>
			<Flash at={INSUF} />
			<Flash at={NOYER} max={0.42} />
			<Sfx name="heartbeat" at={0} volume={0.08} />
			<Sfx name="tick" at={SEMAINE} volume={0.08} />
			<Sfx name="pop" at={MANGE - 4} volume={0.09} />
			<Sfx name="whoosh" at={DORT - 6} volume={0.06} />
			<Sfx name="pop" at={TROIS2 - 2} volume={0.09} />
			<Sfx name="pop" at={OREILLERS} volume={0.09} />
			<Sfx name="whoosh" at={SOIR - 8} volume={0.06} />
			<Sfx name="buzz" at={GONFLENT} volume={0.05} dur={16} />
			<Sfx name="whoosh" at={CE - 8} volume={0.06} />
			<Sfx name="stamp" at={AGE + 2} volume={0.09} />
			<Sfx name="heartbeat" at={COEUR} volume={0.1} />
			<Sfx name="buzz" at={EPUISE} volume={0.05} dur={18} />
			<Sfx name="impact" at={INSUF} volume={0.13} />
			<Sfx name="whoosh" at={POUMONS - 4} volume={0.07} />
			<Sfx name="impact" at={NOYER} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// « Un cœur qui pompe mal » : gros plan sur le cœur qui bat faiblement, puis le corps : le sang avance moins vite, les
// artères pâlissent, jauge « sang envoyé » qui baisse. Causes : infarctus (zone éteinte sur le cœur), des années
// d'hypertension (flèches de pression, pile qui se vide).
const DM = {x: 318, y: 50, size: 300};
const dPt = (px: number, py: number) => ({x: DM.x + (px * DM.size) / 400, y: DM.y + (py * DM.size) / 400});

const Gauge: React.FC<{level: number; label: string}> = ({level, label}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
		<div style={{position: 'relative', width: 78, height: 300, borderRadius: 39, background: LPI.paper, border: `6px solid ${N}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${level * 100}%`, background: level < 0.55 ? LPI.pink : LPI.blue}} />
		</div>
		<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: alpha(N, 0.75), textAlign: 'center', lineHeight: 1.15, width: 170}}>{label}</div>
	</div>
);

export const Def: React.FC = () => {
	const frame = useCurrentFrame();
	const INSUF = at('def', "l'insuffisance");
	const COEUR = at('def', 'cœur');
	const POMPER = at('def', 'pomper');
	const ASSEZ = at('def', 'assez');
	const SANG = at('def', 'sang');
	const CORPS = at('def', 'corps');
	const SOUVENT = at('def', 'souvent');
	const ABIME = at('def', 'abîmé');
	const INFARCTUS = at('def', 'infarctus');
	const EPUISE = at('def', 'épuisé');
	const ANNEES = at('def', 'années');
	const HTA = at('def', "d'hypertension");
	const h = dPt(228, 300);
	const keys: CamKey[] = [
		{at: COEUR - 2, s: 2.2, x: h.x, y: h.y, dur: 12},
		{at: ASSEZ - 4, s: 1, dur: 14},
		{at: ABIME - 4, s: 2.3, x: h.x, y: h.y, dur: 12},
		{at: EPUISE - 4, s: 1.6, x: h.x - 20, y: h.y + 10, dur: 14},
	];
	const phase = frame < ASSEZ ? frame * 3 : ASSEZ * 3 + (frame - ASSEZ) * 1.1;
	const sent = interpolate(frame, [ASSEZ, CORPS + 12], [1, 0.4], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[COEUR + 1, POMPER + 1, CORPS + 1, INFARCTUS + 1, HTA + 1]} strength={0.03}>
				<Head kicker="L'insuffisance cardiaque" kAt={INSUF} title="Un cœur qui *pompe* *mal*" tAt={COEUR - 4} />
				<Stage y={440} h={540} at={4} bumps={[POMPER, CORPS, INFARCTUS, HTA]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Man
							x={DM.x}
							y={DM.y}
							size={DM.size}
							mood={frame >= CORPS ? 'mal' : 'calme'}
							breath={idle(frame)}
							heart={1}
							beat={pulseAt(frame, 28) * (frame >= POMPER ? 0.45 : 0.9)}
							flow={1}
							flowPhase={phase}
							bloodless={interpolate(frame, [ASSEZ, CORPS + 12], [0, 0.5], ease)}
							scar={fadeIn(frame, INFARCTUS - 2, 8)}
							squeeze={fadeIn(frame, HTA - 2, 6)}
						/>
						{frame >= EPUISE - 2 ? (
							<div style={{position: 'absolute', left: h.x + 40, top: h.y - 92, transform: `scale(${popAt(frame, EPUISE - 2)})`}}>
								<Battery level={interpolate(frame, [EPUISE, HTA + 16], [0.75, 0.15], clamp)} width={84} />
							</div>
						) : null}
					</ZoomCam>
					{frame >= ASSEZ - 4 && frame < SOUVENT + 6 ? (
						<div style={{position: 'absolute', left: 700, top: 70, opacity: fadeIn(frame, ASSEZ - 4, 6) * (1 - fadeIn(frame, SOUVENT, 6))}}>
							<Gauge level={sent} label="sang envoyé au corps" />
						</div>
					) : null}
					<StagePill from={ANNEES - 2} color={LPI.sky}>
						des années
					</StagePill>
				</Stage>
				{frame >= ASSEZ - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={ASSEZ - 2} size={40} color={LPI.sky}>
							insuffisant = pas assez
						</Pill>
					</div>
				) : null}
				<Lead at={SOUVENT} text="souvent, à cause de :" y={1110} />
				<div style={{position: 'absolute', left: 72, top: 1170}}>
					<CauseChip at={INFARCTUS - 2} icon={<HeartScarIcon />} label="un infarctus" />
				</div>
				<div style={{position: 'absolute', left: 500, top: 1170}}>
					<CauseChip at={HTA - 2} icon={<HypertensionIcon size={56} />} label="l'hypertension" />
				</div>
			</Camera>
			<Sfx name="heartbeat" at={COEUR} volume={0.1} />
			<Sfx name="heartbeat" at={POMPER + 6} volume={0.07} />
			<Sfx name="whoosh" at={ASSEZ - 4} volume={0.05} />
			<Sfx name="pop" at={INFARCTUS - 2} volume={0.1} />
			<Sfx name="pop" at={HTA - 2} volume={0.1} />
			<Sfx name="buzz" at={EPUISE} volume={0.04} dur={16} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · CŒUR GAUCHE ═══════════════════════════════ */
// Gros plan : la moitié gauche du cœur faiblit ; le sang reflue vers les poumons (flèches roses), l'eau y monte un peu ;
// il s'essouffle (bouffées, sueurs). Puis le lit : couché, il étouffe (« ! ») ; « l'orthopnée » ; assis (3 oreillers),
// il respire mieux (coche).
const GM = {x: 303, y: 30, size: 330};
const gPt = (px: number, py: number) => ({x: GM.x + (px * GM.size) / 400, y: GM.y + (py * GM.size) / 400});

export const Gauche: React.FC = () => {
	const frame = useCurrentFrame();
	const COEUR = at('gauche', 'cœur');
	const GAUCHE = at('gauche', 'gauche');
	const FAIBLIT = at('gauche', 'faiblit');
	const SANG = at('gauche', 'sang');
	const REFLUE = at('gauche', 'reflue');
	const POUMONS = at('gauche', 'poumons');
	const PATIENT = at('gauche', 'patient');
	const ESSOUFFLE = at('gauche', "s'essouffle");
	const ALLONGE = at('gauche', 'allongé');
	const ORTHO = at('gauche', "l'orthopnée");
	const RESPIRE = at('gauche', 'respire');
	const ASSIS = at('gauche', "qu'assis");
	const h = gPt(228, 300);
	const c = gPt(200, 300);
	const keys: CamKey[] = [
		{at: COEUR - 2, s: 2.3, x: h.x, y: h.y, dur: 12},
		{at: REFLUE - 4, s: 1.5, x: c.x, y: c.y, dur: 14},
		{at: PATIENT - 4, s: 1.5, x: c.x, y: 200, dur: 14},
	];
	const bodyO = 1 - fadeIn(frame, ALLONGE - 6, 8);
	const bedO = fadeIn(frame, ALLONGE - 6, 8);
	const pillows = interpolate(frame, [ASSIS - 4, ASSIS + 10], [0, 3], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[GAUCHE + 1, REFLUE + 1, ESSOUFFLE + 1, ALLONGE + 1, ORTHO + 1, ASSIS + 1]} strength={0.03}>
				<Head kicker="Le cœur gauche faiblit" kAt={2} title="Le sang *reflue* vers les *poumons*" tAt={SANG - 6} size={84} />
				<Stage y={440} h={540} at={4} bumps={[GAUCHE, POUMONS, ALLONGE, ASSIS]}>
					{bodyO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: bodyO}}>
							<ZoomCam keys={keys} w={936} h={540}>
								<Man
									x={GM.x}
									y={GM.y}
									size={GM.size}
									mood={frame >= ESSOUFFLE - 2 ? 'mal' : 'calme'}
									breath={frame >= ESSOUFFLE - 2 ? pant(frame) : idle(frame)}
									heart={1}
									beat={pulseAt(frame, 24) * 0.6}
									side="G"
									weak={fadeIn(frame, FAIBLIT - 2, 8)}
									lungs={fadeIn(frame, SANG - 6, 10)}
									reflux={fadeIn(frame, REFLUE - 2, 8)}
									flood={interpolate(frame, [POUMONS - 4, POUMONS + 30], [0, 0.35], ease)}
									puffs={fadeIn(frame, ESSOUFFLE, 6)}
									sweat={0.6 * fadeIn(frame, ESSOUFFLE, 10)}
								/>
							</ZoomCam>
							<StagePill from={GAUCHE - 2} to={REFLUE - 4}>
								cœur gauche
							</StagePill>
							<StagePill from={REFLUE - 2} to={PATIENT - 4} color={LPI.blue}>
								le sang reflue
							</StagePill>
							<StagePill from={ESSOUFFLE - 2} color={LPI.sky}>
								il s'essouffle
							</StagePill>
						</div>
					) : null}
					{bedO > 0 ? (
						<div style={{position: 'absolute', inset: 0, opacity: bedO}}>
							<div style={{position: 'absolute', left: 88, top: 90, transform: `scale(${0.9 + 0.1 * bedO})`}}>
								<PropUp pillows={pillows} width={760} distress={frame < ASSIS ? 1 : 1 - fadeIn(frame, ASSIS, 10)} />
							</div>
							<Badge at={ALLONGE + 2} until={ASSIS - 2} x={80} y={20} text="!" size={104} />
							<Badge at={ASSIS + 6} x={80} y={20} text="✓" tone={LPI.blue} size={104} />
							<StagePill from={ALLONGE - 2} to={ASSIS - 2}>
								couché : il étouffe
							</StagePill>
							<StagePill from={ASSIS} color={LPI.sky}>
								assis : ça va mieux
							</StagePill>
						</div>
					) : null}
				</Stage>
				{frame >= ORTHO - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={ORTHO - 2} size={38} color={LPI.sky}>
							orthopnée = essoufflé quand il est couché
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CheckChip at={RESPIRE - 2} label="il respire mieux assis" size={40} />
				</div>
			</Camera>
			<Sfx name="heartbeat" at={COEUR} volume={0.09} />
			<Sfx name="whoosh" at={REFLUE - 4} volume={0.06} />
			<Sfx name="buzz" at={ESSOUFFLE} volume={0.04} dur={16} />
			<Sfx name="whoosh" at={ALLONGE - 6} volume={0.06} />
			<Sfx name="pop" at={ORTHO - 2} volume={0.1} />
			<Sfx name="ding" at={ASSIS + 6} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · CŒUR DROIT ═══════════════════════════════ */
// La moitié droite du cœur faiblit ; des gouttes d'eau descendent dans le corps jusqu'aux chevilles, qui gonflent ; un
// pouce appuie : le creux reste (signe du godet) ; le pèse-personne sous les pieds : 70 → 72 kg.
const RM = {x: 30, y: 40, size: 290};
const rPt = (px: number, py: number) => ({x: RM.x + (px * RM.size) / 400, y: RM.y + (py * RM.size) / 400});
const RA = {x: 430, y: 14, w: 380};

export const Droite: React.FC = () => {
	const frame = useCurrentFrame();
	const COEUR = at('droite', 'cœur');
	const DROIT = at('droite', 'droit');
	const FAIBLIT = at('droite', 'faiblit');
	const EAU = at('droite', "l'eau");
	const CORPS = at('droite', 'corps');
	const CHEVILLES = at('droite', 'chevilles');
	const JAMBES = at('droite', 'jambes');
	const GONFLENT = at('droite', 'gonflent');
	const OEDEMES = at('droite', 'œdèmes');
	const POIDS = at('droite', 'poids');
	const MONTE = at('droite', 'monte');
	const h = rPt(228, 300);
	const dent = {x: RA.x + (90 * RA.w) / 440, y: RA.y + (236 * RA.w) / 440};
	const keys: CamKey[] = [
		{at: COEUR - 2, s: 2.2, x: h.x, y: h.y, dur: 12},
		{at: EAU - 4, s: 1, dur: 16},
		{at: OEDEMES - 6, s: 1.8, x: dent.x + 40, y: dent.y, dur: 12},
		{at: POIDS - 6, s: 1, dur: 14},
	];
	const swell = interpolate(frame, [CHEVILLES - 2, CHEVILLES + 8, GONFLENT - 2, GONFLENT + 16], [0, 0.35, 0.35, 1], ease);
	const press = interpolate(frame, [OEDEMES - 4, OEDEMES + 4, OEDEMES + 14, OEDEMES + 24], [0, 1, 1, 2], ease);
	const dentO = frame < OEDEMES + 14 ? 0 : interpolate(frame, [OEDEMES + 14, OEDEMES + 17, POIDS + 30], [0, 1, 0.55], clamp);
	const ank = Math.max(0, popAt(frame, CHEVILLES - 4));
	const sc = Math.max(0, popAt(frame, POIDS - 2));
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DROIT + 1, EAU + 1, GONFLENT + 1, OEDEMES + 1, MONTE + 1]} strength={0.03}>
				<Head kicker="Le cœur droit faiblit" kAt={2} title="*L'eau* s'accumule dans le *corps*" tAt={EAU - 6} size={84} />
				<Stage y={440} h={540} at={4} bumps={[DROIT, CORPS, GONFLENT, MONTE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Man x={RM.x} y={RM.y} size={RM.size} breath={idle(frame)} heart={1} beat={pulseAt(frame, 24) * 0.6} side="D" weak={fadeIn(frame, FAIBLIT - 2, 8)} drops={fadeIn(frame, EAU - 2, 10)} />
						{/* l'eau descend jusqu'aux chevilles */}
						{frame >= CHEVILLES - 6 ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<path d="M250 380 C320 420 380 330 450 250" fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" strokeDasharray="6 16" strokeDashoffset={-frame * 2} opacity={fadeIn(frame, CHEVILLES - 6, 8)} />
								<path d="M434 252 L452 246 L452 266" fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={fadeIn(frame, CHEVILLES - 6, 8)} />
							</svg>
						) : null}
						{ank > 0 ? (
							<div style={{position: 'absolute', left: RA.x, top: RA.y, transform: `scale(${ank})`, transformOrigin: '50% 100%'}}>
								<Ankles swell={swell} press={press} dent={dentO} width={RA.w} />
							</div>
						) : null}
						{sc > 0 ? (
							<div style={{position: 'absolute', left: 490, top: 318, transform: `scale(${sc})`, transformOrigin: '50% 100%'}}>
								<BathScale value={interpolate(frame, [MONTE - 2, MONTE + 16], [70, 72], ease)} width={260} alert={frame >= MONTE + 16 ? 1 : 0} />
							</div>
						) : null}
						{frame >= MONTE ? (
							<div style={{position: 'absolute', left: 770, top: 380, transform: `scale(${popAt(frame, MONTE)})`}}>
								<Sign kind="up" size={84} />
							</div>
						) : null}
					</ZoomCam>
					<StagePill from={DROIT - 2} to={EAU - 4}>
						cœur droit
					</StagePill>
					<StagePill from={JAMBES - 2} to={OEDEMES - 6} color={LPI.blue}>
						chevilles et jambes gonflent
					</StagePill>
					<StagePill from={POIDS - 2} color={LPI.pink}>
						le poids monte
					</StagePill>
				</Stage>
				{frame >= OEDEMES - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={OEDEMES - 2} size={40} color={LPI.sky}>
							œdème = de l'eau sous la peau
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1120}}>
					<CheckChip at={OEDEMES + 16} label="le doigt laisse un creux" size={38} />
				</div>
			</Camera>
			<Sfx name="heartbeat" at={COEUR} volume={0.09} />
			<Sfx name="whoosh" at={EAU - 4} volume={0.05} />
			<Sfx name="pop" at={CHEVILLES - 4} volume={0.1} />
			<Sfx name="buzz" at={GONFLENT} volume={0.04} dur={14} />
			<Sfx name="tick" at={OEDEMES + 4} volume={0.1} />
			<Sfx name="pop" at={POIDS - 2} volume={0.1} />
			<Sfx name="ding" at={MONTE + 16} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TON RÉFLEXE : LA PESÉE ═══════════════════════════════ */
// Pèse-personne + fiche de poids (horloge 8 h) : J1 70,0 · J2 71,0 · J3 72,1 → « +2,1 kg en 3 jours » → tampon
// « ON ALERTE ! » ; puis on surveille aussi les œdèmes et l'essoufflement (puces cochées).
const LOG = {x: 470, y: 30, w: 440, h: 480};

const LogRow: React.FC<{at: number; day: string; value: string; alert?: boolean; y: number}> = ({at: t0, day, value, alert = false, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 24, top: y, width: LOG.w - 48, height: 76, borderRadius: 22, background: alert ? alpha(LPI.pink, 0.45) : alpha(LPI.sky, 0.5), display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', boxSizing: 'border-box', transform: `translateX(${(1 - popAt(frame, t0)) * 50}px)`, opacity: fadeIn(frame, t0, 5)}}>
			<div style={{width: 64, height: 54, borderRadius: 16, background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{day}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
		</div>
	);
};

export const Role: React.FC = () => {
	const frame = useCurrentFrame();
	const REFLEXE = at('role', 'réflexe');
	const PESER = at('role', 'peser');
	const JOUR = at('role', 'jour');
	const MEME = at('role', 'même');
	const HEURE = at('role', 'heure');
	const DEUX = at('role', 'deux');
	const TROIS = at('role', 'trois');
	const JOURS = at('role', 'jours');
	const ALERTE = at('role', 'alerte');
	const SURV = at('role', 'surveilles');
	const OEDEMES = at('role', 'œdèmes');
	const ESSOUF = at('role', "l'essoufflement");
	const keys: CamKey[] = [
		{at: JOURS - 4, s: 1.12, x: LOG.x + LOG.w / 2, y: 270, dur: 12},
		{at: SURV - 8, s: 1, dur: 14},
	];
	const kg = interpolate(frame, [PESER, PESER + 16, DEUX - 2, DEUX + 8, TROIS - 2, TROIS + 8], [0, 70, 70, 71, 71, 72.1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PESER + 1, HEURE + 1, DEUX + 1, TROIS + 1, JOURS + 1, OEDEMES + 1, ESSOUF + 1]} shakes={[ALERTE + 1]} strength={0.03}>
				<Head kicker="Ton réflexe" kAt={REFLEXE - 4} title="La *pesée* de chaque *jour*" tAt={PESER - 6} />
				<Stage y={440} h={540} at={4} bumps={[PESER, DEUX, TROIS, ALERTE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: 40, top: 150, transform: `scale(${popAt(frame, PESER - 8)})`}}>
							<BathScale value={kg} width={380} alert={frame >= JOURS ? 1 : 0} />
						</div>
						{frame >= JOUR - 4 ? (
							<div style={{position: 'absolute', left: LOG.x, top: LOG.y, width: LOG.w, height: LOG.h, borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, transform: `scale(${popAt(frame, JOUR - 4)})`}}>
								<div style={{position: 'absolute', left: 26, top: 18, display: 'flex', alignItems: 'center', gap: 14}}>
									<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N}}>Poids</div>
									{frame >= MEME - 2 ? (
										<div style={{display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${popAt(frame, MEME - 2)})`}}>
											<WallClock h={8} m={0} size={64} />
											{frame >= HEURE ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.blue}}>8 h</span> : null}
										</div>
									) : null}
								</div>
								<LogRow at={JOUR - 2} day="J1" value="70,0 kg" y={100} />
								<LogRow at={DEUX - 2} day="J2" value="71,0 kg" y={190} />
								<LogRow at={TROIS - 2} day="J3" value="72,1 kg" y={280} alert />
								{frame >= JOURS - 2 ? (
									<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center'}}>
										<Pill at={JOURS - 2} size={38} color={LPI.pink}>
											+2,1 kg en 3 jours
										</Pill>
									</div>
								) : null}
							</div>
						) : null}
					</ZoomCam>
				</Stage>
				<Stamp at={ALERTE - 1} x={540} y={1060} text="On alerte !" size={78} rot={-6} out={SURV - 6} />
				<Lead at={SURV} text="tu surveilles aussi :" y={1010} />
				<div style={{position: 'absolute', left: 72, top: 1066}}>
					<CheckChip at={OEDEMES - 2} label="les œdèmes" size={40} />
				</div>
				<div style={{position: 'absolute', left: 470, top: 1066}}>
					<CheckChip at={ESSOUF - 2} label="l'essoufflement" size={40} />
				</div>
			</Camera>
			<Sfx name="pop" at={PESER - 8} volume={0.1} />
			<Sfx name="tick" at={PESER + 16} volume={0.08} />
			<Sfx name="tick" at={DEUX + 8} volume={0.08} />
			<Sfx name="tick" at={TROIS + 8} volume={0.08} />
			<Sfx name="buzz" at={JOURS} volume={0.05} dur={16} />
			<Sfx name="stamp" at={ALERTE - 1} volume={0.12} />
			<Sfx name="ding" at={OEDEMES - 2} volume={0.08} />
			<Sfx name="ding" at={ESSOUF - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · TRAITEMENT ═══════════════════════════════ */
// Trois cases qui s'allument chacune sur son mot : diurétique (gélule + bocal qui se remplit), médicaments (cœur
// fatigué qui se calme, pile qui se recharge), peu de sel (salière barrée, l'eau qui s'accroche au sel) ; sous le
// socle, la liste se construit ligne par ligne.
const Box3: React.FC<{i: number; from: number; on: boolean; children: React.ReactNode}> = ({i, from, on, children}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	return (
		<div style={{position: 'absolute', left: 18 + i * 305, top: 26, width: 290, height: 488, borderRadius: 40, background: LPI.paper, border: `6px solid ${on ? LPI.blue : LPI.sky}`, boxShadow: on ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW, transform: `scale(${popAt(frame, from) * (on ? 1.03 : 0.97)})`, opacity: on ? 1 : 0.6, overflow: 'hidden'}}>
			{children}
		</div>
	);
};

const TreatRow: React.FC<{at: number; subAt: number; y: number; icon: React.ReactNode; name: string; sub: string}> = ({at: t0, subAt, y, icon, name, sub}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, display: 'flex', alignItems: 'center', gap: 18, opacity: fadeIn(frame, t0, 6), transform: `translateX(${(1 - popAt(frame, t0)) * 60}px)`}}>
			<div style={{width: 92, height: 92, flex: 'none', borderRadius: 46, background: LPI.paper, border: `5px solid ${LPI.blue}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{icon}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N, whiteSpace: 'nowrap'}}>{name}</div>
			{frame >= subAt ? <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: alpha(N, 0.7), whiteSpace: 'nowrap', opacity: fadeIn(frame, subAt, 6)}}>→ {sub}</div> : null}
		</div>
	);
};

export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const TRAIT = at('traitement', 'traitement');
	const DIUR = at('traitement', 'diurétiques');
	const URINER = at('traitement', 'uriner');
	const TROP = at('traitement', 'trop');
	const MEDOC = at('traitement', 'médicaments');
	const SOULAGENT = at('traitement', 'soulagent');
	const COEUR = at('traitement', 'cœur');
	const PEU = at('traitement', 'peu');
	const SEL = at('traitement', 'sel');
	const RETIENT = at('traitement', 'retient');
	const EAU2 = at('traitement', "l'eau", 2);
	const cur = frame < MEDOC - 2 ? 0 : frame < PEU - 4 ? 1 : 2;
	const all = frame >= EAU2 + 12;
	const urine = interpolate(frame, [URINER - 4, TROP + 24], [300, 1900], clamp);
	const drops = frame >= URINER - 4 && frame < TROP + 24 ? Array.from({length: 8}, (_, k) => URINER - 4 + k * 7).filter((d) => d <= frame) : [];
	const calm = fadeIn(frame, SOULAGENT - 2, 14);
	const beat = calm < 1 ? pulseAt(frame, Math.round(14 + 12 * calm)) * (0.5 + 0.4 * calm) : pulseAt(frame, 26) * 0.9;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DIUR + 1, URINER + 1, MEDOC + 1, SOULAGENT + 1, PEU + 1, RETIENT + 1]} strength={0.03}>
				<Head kicker="Le traitement" kAt={TRAIT - 2} title="*Vider* l'eau, *soulager* le cœur" tAt={DIUR - 8} size={84} />
				<Stage y={440} h={540} at={4} bumps={[DIUR, MEDOC, PEU]}>
					<Box3 i={0} from={DIUR - 4} on={cur === 0 || all}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center', transform: `rotate(${Math.sin(frame / 8) * 8}deg)`}}>
							<PillIcon size={120} />
						</div>
						<div style={{position: 'absolute', left: 145 - 104, top: 170, transform: 'scale(0.8)', transformOrigin: '0 0'}}>
							<Jar value={urine} drops={drops} />
						</div>
					</Box3>
					<Box3 i={1} from={MEDOC - 4} on={cur === 1 || all}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', transform: `translateX(${Math.sin(frame / 1.7) * 4 * (1 - calm)}px)`}}>
							<Heart size={230} beat={beat} />
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
							<Battery level={interpolate(frame, [SOULAGENT - 2, COEUR + 24], [0.15, 0.9], clamp)} width={140} />
						</div>
					</Box3>
					<Box3 i={2} from={PEU - 6} on={cur === 2 || all}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', transform: `rotate(${frame < SEL + 6 ? Math.sin(frame / 2) * 12 : 0}deg)`}}>
							<div style={{position: 'relative'}}>
								<SaltShaker width={150} shake={frame < SEL + 6 ? 1 : 0} />
								<Strike at={SEL + 2} width={240} rot={-30} thick={16} />
							</div>
						</div>
						{frame >= RETIENT - 2
							? Array.from({length: 6}, (_, k) => {
									const a = (k / 6) * Math.PI * 2 + frame / 18;
									const r = 118 * fadeIn(frame, RETIENT - 2, 10);
									return (
										<svg key={k} width={40} height={50} viewBox="-20 -25 40 50" style={{position: 'absolute', left: 145 - 20 + Math.cos(a) * r, top: 240 - 25 + Math.sin(a) * r * 1.2, opacity: fadeIn(frame, RETIENT - 2, 6)}}>
											<path d="M0 -16 C9 -4 12 5 0 12 C-12 5 -9 -4 0 -16 Z" fill={alpha(LPI.blue, 0.85)} stroke={N} strokeWidth={3} />
										</svg>
									);
								})
							: null}
					</Box3>
				</Stage>
				<TreatRow at={DIUR - 2} subAt={URINER - 2} y={1012} icon={<PillIcon size={60} />} name="Diurétiques" sub="font uriner l'eau en trop" />
				<TreatRow at={MEDOC - 2} subAt={SOULAGENT - 2} y={1122} icon={<HeartIcon size={60} />} name="Médicaments" sub="soulagent le cœur" />
				<TreatRow at={PEU - 2} subAt={RETIENT - 2} y={1232} icon={<SaltShaker width={42} />} name="Peu de sel" sub="le sel retient l'eau" />
			</Camera>
			<Sfx name="pop" at={DIUR - 4} volume={0.1} />
			<Sfx name="tick" at={URINER} volume={0.07} />
			<Sfx name="pop" at={MEDOC - 4} volume={0.1} />
			<Sfx name="ding" at={SOULAGENT + 6} volume={0.07} />
			<Sfx name="pop" at={PEU - 6} volume={0.1} />
			<Sfx name="stamp" at={SEL + 2} volume={0.09} />
			<Sfx name="whoosh" at={RETIENT - 2} volume={0.05} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · URGENCE : L'OAP ═══════════════════════════════ */
// Gros plan sur les poumons : l'eau monte jusqu'en haut (flash) ; il étouffe (bouffées, sueurs, lèvres bleutées) ; gros
// plan sur la bouche : mousse rosée ; on recule, le patient glisse à gauche et les 3 gestes arrivent à droite : assis
// jambes pendantes, oxygène (lunettes à O₂ sur le patient), on appelle tout de suite.
const UM = {size: 330, y: 40};
const ACT_X = 400;

const Action: React.FC<{at: number; y: number; icon: React.ReactNode; text: React.ReactNode}> = ({at: t0, y, icon, text}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const p = popAt(frame, t0);
	return (
		<div style={{position: 'absolute', left: ACT_X, top: y, width: 516, height: 150, borderRadius: 34, background: LPI.paper, border: `5px solid ${LPI.blue}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px', boxSizing: 'border-box', transform: `translateX(${(1 - p) * 120}px)`, opacity: Math.min(1, p * 1.6)}}>
			<div style={{width: 120, height: 130, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, lineHeight: 1.08}}>{text}</div>
		</div>
	);
};

export const Urgence: React.FC = () => {
	const frame = useCurrentFrame();
	const URG = at('urgence', "l'urgence");
	const OEDEME = at('urgence', "l'œdème");
	const POUMON = at('urgence', 'poumon');
	const INONDE = at('urgence', 'inonde');
	const POUMONS = at('urgence', 'poumons');
	const PATIENT = at('urgence', 'patient');
	const ETOUFFE = at('urgence', 'étouffe');
	const CRACHE = at('urgence', 'crache');
	const MOUSSE = at('urgence', 'mousse');
	const ASSOIT = at('urgence', "l'assoit");
	const PENDANTES = at('urgence', 'pendantes');
	const OXY = at('urgence', "l'oxygène");
	const APPELLE = at('urgence', 'appelle');
	const mx = interpolate(frame, [ASSOIT - 6, ASSOIT + 8], [303, 40], ease);
	const lungsC = {x: 303 + (200 * UM.size) / 400, y: UM.y + (318 * UM.size) / 400};
	const mouth = {x: 303 + (200 * UM.size) / 400, y: UM.y + (150 * UM.size) / 400};
	const keys: CamKey[] = [
		{at: OEDEME - 2, s: 1.8, x: lungsC.x, y: lungsC.y, dur: 14},
		{at: PATIENT - 4, s: 1.3, x: mouth.x, y: 230, dur: 12},
		{at: CRACHE - 2, s: 2.3, x: mouth.x, y: mouth.y + 10, dur: 12},
		{at: ASSOIT - 10, s: 1, dur: 14},
	];
	const flood = interpolate(frame, [POUMON - 4, POUMON + 10, INONDE - 2, POUMONS + 14], [0, 0.3, 0.3, 0.95], ease);
	const bad = frame >= ETOUFFE - 2;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[OEDEME + 1, POUMON + 1, ETOUFFE + 1, MOUSSE + 1, ASSOIT + 1, OXY + 1, APPELLE + 1]} shakes={[INONDE + 2]} strength={0.04}>
				<Head kicker="L'urgence" kAt={URG} title="L'œdème *aigu* du *poumon*" tAt={OEDEME - 6} size={84} />
				<Stage y={440} h={540} at={4} bumps={[INONDE, ETOUFFE, ASSOIT, OXY, APPELLE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<Man
							x={mx}
							y={UM.y}
							size={UM.size}
							mood={frame >= INONDE ? 'mal' : 'calme'}
							breath={bad ? pant(frame, 4) : idle(frame, 40)}
							heart={1}
							beat={pulseAt(frame, 15) * 0.8}
							lungs={fadeIn(frame, OEDEME - 6, 10)}
							flood={flood}
							puffs={bad ? 1 : 0}
							sweat={fadeIn(frame, ETOUFFE, 10)}
							cyanosis={0.55 * fadeIn(frame, ETOUFFE + 4, 14)}
							foam={fadeIn(frame, MOUSSE - 4, 8)}
							cannula={fadeIn(frame, OXY - 2, 10)}
						/>
					</ZoomCam>
					<StagePill from={INONDE - 2} to={ETOUFFE - 2} color={LPI.blue}>
						l'eau inonde les poumons
					</StagePill>
					<StagePill from={ETOUFFE - 2} to={ASSOIT - 8}>
						il étouffe
					</StagePill>
					<Action at={ASSOIT - 2} y={20} icon={<SitLegsDown width={110} />} text={frame >= PENDANTES - 4 ? <>Assis,<br />jambes pendantes</> : 'Assis'} />
					<Action
						at={OXY - 2}
						y={190}
						icon={
							<div style={{width: 110, height: 110, borderRadius: 55, background: LPI.sky, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>
								O₂
							</div>
						}
						text="Oxygène"
					/>
					<Action at={APPELLE - 2} y={360} icon={<Phone digits="15" ring={1} size={68} />} text={<>On appelle<br />tout de suite</>} />
				</Stage>
				{frame >= OEDEME - 2 && frame < MOUSSE - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={OEDEME - 2} size={40} color={LPI.sky}>
							OAP = œdème aigu du poumon
						</Pill>
					</div>
				) : null}
				{frame >= MOUSSE - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={MOUSSE - 2} size={40} color={LPI.pink}>
							mousse rosée = eau + un peu de sang
						</Pill>
					</div>
				) : null}
				<Stamp at={URG + 12} x={540} y={1170} text="Urgence" size={64} rot={-5} />
			</Camera>
			<Flash at={INONDE} />
			<Sfx name="stamp" at={URG + 12} volume={0.1} />
			<Sfx name="whoosh" at={OEDEME - 2} volume={0.06} />
			<Sfx name="impact" at={INONDE} volume={0.12} />
			<Sfx name="buzz" at={ETOUFFE} volume={0.05} dur={20} />
			<Sfx name="whoosh" at={ASSOIT - 10} volume={0.06} />
			<Sfx name="pop" at={ASSOIT - 2} volume={0.1} />
			<Sfx name="pop" at={OXY - 2} volume={0.1} />
			<Sfx name="pop" at={APPELLE - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="Le cœur *épuisé*"
		kAt={at('outro', 'petit')}
		rows={[
			[at('outro', 'cœur'), 'down', 'Un cœur qui pompe mal', null],
			[at('outro', 'gauche'), 'wave', "Gauche : il s'essouffle", 'orthopnée'],
			[at('outro', 'droite'), 'up', 'Droite : il gonfle', 'œdèmes, poids'],
			[at('outro', 'pesée'), 'check', 'Pesée chaque jour', '+2 kg en 3 j = alerte'],
			[at('outro', 'étouffe'), 'alert', 'Il étouffe : OAP', '= urgence !'],
		]}
		done={at('outro', "l'urgence") + 10}
	/>
);
