// Scènes de « C'est quoi une embolie pulmonaire ? » (format pathologie) : accroche-choc (3e cause de mort
// cardiovasculaire, puis un caillot né dans la jambe remonte jusqu'aux poumons, caméra qui le suit), définition
// (embolie, phlébite, trajet du caillot), signes, conduite à tenir, traitement, facteurs de risque, récap rapide.
// Corps entier, veine, caillot, lit : src/brand/embolism.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {ArteryZoom, Brain} from '../../brand/brain';
import {Phone, ScanMonitor} from '../../brand/devices';
import {bodyPx, ChestScan, CLOT_T, clotAt, FullBody, SemiSitting} from '../../brand/embolism';
import {CamFollow, CamKey, camAt, camClamp, CauseChip, Head, LAY, Pill, RecapScene, SLAM_Y, Tag, termSlot, ZoomCam} from '../../brand/episode';
import {BedIcon, CastIcon, LegIcon, PainIcon, PillIcon, PlaneIcon, RibbonIcon, ScalpelIcon} from '../../brand/icons';
import {CheckChip, Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {DropPicto, HeartPicto, LungsPicto, O2Picto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
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

/** Étiquette qui suit un point de la caméra. */
const Follow: React.FC<{at: number; x: number; y: number; label: string; tone?: string}> = ({at: t0, x, y, label, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, t0)})`, transformOrigin: 'left center'}}>
			<Tag label={label} tone={tone} />
		</div>
	);
};

/** Petit écran de surveillance (SpO₂, FC, PA). */
const Screen: React.FC<{label: string; value: string; unit?: string; alert?: boolean; at: number}> = ({label, value, unit = '', alert = false, at: t0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{transform: `scale(${popAt(frame, t0)})`, padding: '12px 22px', borderRadius: 26, background: N, boxShadow: SHADOW, display: 'flex', alignItems: 'baseline', gap: 8, border: `6px solid ${alert && frame % 16 < 10 ? LPI.pink : N}`}}>
			<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: LPI.sky}}>{label}</span>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: alert ? LPI.pink : LPI.paper, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{value}</span>
			{unit ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.sky}}>{unit}</span> : null}
		</div>
	);
};

/** Gouttes de sang qui sortent de la bouche (toux), espace du corps. */
const Cough: React.FC<{on: number; size: number}> = ({on, size}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={size} height={size * 2.35} viewBox="0 0 400 940" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{[0, 1, 2].map((i) => {
				const t = ((frame + i * 7) % 24) / 24;
				return <path key={i} d={`M${206 + i * 10 + t * 40} ${158 + t * 30} c-6 8 -7 13 0 16 c7 -3 6 -8 0 -16 Z`} fill={LPI.pink} stroke={N} strokeWidth={2.5} opacity={on * (1 - t)} />;
			})}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « la 3e cause de mort cardiovasculaire », podium (1 infarctus, 2 AVC, 3 « ? »). Puis le corps entier :
// la caméra plonge sur le mollet, un caillot se forme, se détache et remonte (la caméra le suit) jusqu'au poumon,
// qu'il bouche (flash). Puis la question.
const HB = {size: 360, x: 360, y: 650};
const hookPt = (x: number, y: number) => ({x: HB.x + (x * HB.size) / 400, y: HB.y + (y * HB.size) / 400});

const Podium: React.FC<{x: number; h: number; n: number; color: string; at: number; children: React.ReactNode; label: string; labelAt: number}> = ({x, h, n, color, at: t0, children, label, labelAt}) => {
	const frame = useCurrentFrame();
	const p = popAt(frame, t0);
	return (
		<>
			<div style={{position: 'absolute', left: x, top: 1240 - h, width: 280, height: h, borderRadius: '36px 36px 0 0', background: color, border: `8px solid ${N}`, borderBottom: 'none', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', paddingTop: 20, fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N, lineHeight: 1}}>{n}</div>
			<div style={{position: 'absolute', left: x, top: 1240 - h - 230, width: 280, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8}}>
				<div style={{transform: `scale(${t0 <= 0 ? 1 : p})`}}>{children}</div>
				{frame >= labelAt ? (
					<div style={{transform: `scale(${labelAt <= 0 ? 1 : popAt(frame, labelAt)})`}}>
						<Tag label={label} tone={n === 3 ? LPI.pink : N} />
					</div>
				) : null}
			</div>
		</>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const INF = at('intro', "l'infarctus");
	const AVC = at('intro', "l'avc");
	const TROIS = at('intro', 'troisième');
	const ET = at('intro', 'et', 2);
	const CAIL = at('intro', 'caillot');
	const JAMBE = at('intro', 'jambe');
	const REM = at('intro', 'remonte');
	const POU = at('intro', 'poumons');
	const CEST = at('intro', "c'est", 2);
	const EMB = at('intro', 'embolie');
	const COMMENT = at('intro', 'comment');
	const podO = 1 - fadeIn(frame, ET - 4, 10);
	const bodyO = fadeIn(frame, ET - 6, 10);
	const tClot = interpolate(frame, [REM - 2, POU + 2], [0, 1], ease);
	const [ux, uy] = clotAt(tClot);
	const follow: CamFollow = (f) => {
		const [cx, cy] = clotAt(interpolate(f, [REM - 2, POU + 2], [0, 1], ease));
		const p = hookPt(cx, cy);
		return {s: interpolate(f, [ET - 6, ET + 12, REM, POU + 4, CEST - 6, CEST + 14], [1.4, 2.8, 2.8, 2.5, 2.5, 1], ease), x: p.x, y: p.y};
	};
	const cam = camClamp(follow(frame), 1080, 1920);
	const tag = cam.view(hookPt(ux, uy).x, hookPt(ux, uy).y);
	const lodged = fadeIn(frame, POU, 10);
	const shock = frame >= POU;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[INF + 1, AVC + 1, TROIS + 1, CAIL + 1, POU + 1, EMB + 1]} shakes={[TROIS + 2, POU + 2]} strength={0.04}>
				{/* ── A · 3e cause de mort cardiovasculaire ── */}
				{podO > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: podO, transform: `translateY(${(1 - podO) * 120}px)`}}>
						<div style={{position: 'absolute', left: 72, top: 220, width: 936}}>
							<Title at={-20} text="La *3e* cause de mort" size={88} stagger={0} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 326, width: 936}}>
							<Title at={-20} text="*cardiovasculaire*" size={88} stagger={0} />
						</div>
						<Podium x={400} h={420} n={1} color={LPI.sky} at={INF} label="infarctus" labelAt={INF}>
							<HeartPicto size={190} />
						</Podium>
						<Podium x={90} h={300} n={2} color={LPI.sky} at={AVC} label="AVC" labelAt={AVC}>
							<Brain size={190} />
						</Podium>
						<Podium x={710} h={210} n={3} color={LPI.pink} at={0} label="poumons" labelAt={0}>
							<div style={{position: 'relative', transform: `scale(${frame >= TROIS ? 1 + 0.25 * Math.exp(-(frame - TROIS) / 5) : 1})`}}>
								<LungsPicto size={200} />
								<div style={{position: 'absolute', right: -36, top: -40, width: 110, height: 110, borderRadius: 55, background: LPI.pink, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N, transform: `rotate(${Math.sin(frame / 6) * 8}deg)`}}>?</div>
							</div>
						</Podium>
						<Burst at={TROIS} x={850} y={900} r={260} n={14} />
					</div>
				) : null}
				{/* ── B · le caillot né dans la jambe remonte jusqu'aux poumons (la caméra le suit) ── */}
				{bodyO > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: bodyO}}>
						<ZoomCam keys={follow} w={1080} h={1920} radius={0}>
							<div style={{position: 'absolute', left: HB.x, top: HB.y}}>
								<FullBody
									size={HB.size}
									patient={{mood: shock ? 'mal' : 'calme', breath: shock ? 0.5 - 0.5 * Math.cos(frame / 2.2) : idle(frame), lungs: 1, heart: 1, beat: pulseAt(frame, shock ? 14 : 25), pale: shock ? 0.3 : 0}}
									vein={fadeIn(frame, ET, 10)}
									pulm={fadeIn(frame, REM - 6, 10)}
									clot={fadeIn(frame, CAIL - 6, 6)}
									clotGrow={interpolate(frame, [CAIL - 6, JAMBE], [0, 1], ease)}
									clotT={tClot}
									lodged={lodged}
								/>
							</div>
						</ZoomCam>
						{frame >= CAIL && frame < CEST - 6 ? <Follow at={CAIL} x={tag.x + 50} y={tag.y - 30} label="un caillot" /> : null}
					</div>
				) : null}
				{/* ── C · la question ── */}
				{frame >= CEST - 2 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 220, width: 936}}>
							<Title at={CEST} text="C'est quoi une" size={74} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 304, width: 936}}>
							<Title at={EMB - 2} text={'*embolie*\n*pulmonaire* ?'} size={112} stagger={4} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 562, width: 936}}>
							<Title at={COMMENT - 2} text="et comment la *reconnaître* ?" size={54} stagger={2} brush={false} />
						</div>
					</>
				) : null}
				{frame >= POU && frame < CEST - 6 ? <Stamp at={POU + 2} x={770} y={720} text="Bouché !" size={70} rot={-8} /> : null}
				<Burst at={POU} x={540} y={960} r={340} n={16} />
			</Camera>
			<Flash at={POU} />
			<Sfx name="heartbeat" at={0} volume={0.1} />
			<Sfx name="pop" at={INF} volume={0.1} />
			<Sfx name="pop" at={AVC} volume={0.1} />
			<Sfx name="impact" at={TROIS} volume={0.11} />
			<Sfx name="whoosh" at={ET - 6} volume={0.07} />
			<Sfx name="pop" at={CAIL} volume={0.09} />
			<Sfx name="whoosh" at={REM} volume={0.09} />
			<Sfx name="impact" at={POU} volume={0.13} />
			<Sfx name="buzz" at={POU + 2} volume={0.06} dur={20} />
			<Sfx name="whoosh" at={CEST - 6} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// Le caillot coincé dans l'artère du poumon ; on redescend à son origine (phlébite : veine profonde du mollet) ;
// il se détache, remonte au cœur puis se coince dans le poumon (la caméra le suit) ; la zone n'a plus de sang.
const DEF_WIN = {x: 24, y: 20, w: 888, h: 560};
const DB = {size: 235, x: 326, y: 4};
const defPt = (x: number, y: number) => ({x: DB.x + (x * DB.size) / 400, y: DB.y + (y * DB.size) / 400});

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const EMB = at('def', 'embolie');
	const CAIL = at('def', 'caillot');
	const BOU = at('def', 'bouche');
	const ART = at('def', 'artère');
	const SOUV = at('def', 'souvent');
	const PHL = at('def', 'phlébite');
	const VEINE = at('def', 'veine');
	const DET = at('def', 'détache');
	const COEUR = at('def', 'cœur');
	const COINCE = at('def', 'coince');
	const POU2 = at('def', 'poumon', 2);
	const SANG = at('def', 'sang');
	const MANQ = at('def', 'manque');
	const lodge = defPt(...clotAt(1));
	const calf = defPt(...clotAt(0));
	const keys: CamKey[] = [
		{at: CAIL - 4, s: 2.6, x: lodge.x, y: lodge.y, dur: 16},
		{at: SOUV - 2, s: 2.2, x: calf.x, y: calf.y - 20, dur: 18},
		{at: COINCE + 8, s: 2.2, x: lodge.x, y: lodge.y, dur: 1},
		{at: SANG - 6, s: 2.7, x: lodge.x + 10, y: lodge.y, dur: 14},
	];
	const tClot = frame < SOUV + 4 ? 1 : interpolate(frame, [DET, COEUR, COINCE], [0, CLOT_T.heart, 1], ease);
	const follow: CamFollow = (f) => {
		if (f >= DET - 2 && f < COINCE + 8) {
			const t = interpolate(f, [DET, COEUR, COINCE], [0, CLOT_T.heart, 1], ease);
			const p = defPt(...clotAt(t));
			return {s: 2.2, x: p.x, y: f < DET + 6 ? calf.y - 20 + (p.y - calf.y + 20) * ((f - DET + 2) / 8) : p.y};
		}
		return camAt(f, keys, DEF_WIN.w, DEF_WIN.h);
	};
	const cam = camClamp(follow(frame), DEF_WIN.w, DEF_WIN.h);
	const cp = defPt(...clotAt(tClot));
	const tag = cam.view(cp.x, cp.y);
	const clotO = interpolate(frame, [CAIL - 6, CAIL, SOUV, SOUV + 4, SOUV + 8], [0, 1, 1, 0, 1], clamp);
	const lodged = frame < SOUV + 4 ? fadeIn(frame, BOU - 2) : fadeIn(frame, COINCE, 10);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[BOU + 1, PHL + 1, DET + 1, COINCE + 1, MANQ + 1]} shakes={[COINCE + 2]}>
				<Head kicker="Définition" kAt={EMB - 4} title="L'embolie *pulmonaire*" tAt={EMB} size={84} />
				<Stage y={LAY.stageY} h={600} at={EMB + 2} bumps={[BOU, COINCE]}>
					<ZoomCam keys={follow} {...DEF_WIN}>
						<div style={{position: 'absolute', left: DB.x, top: DB.y}}>
							<FullBody
								size={DB.size}
								patient={{mood: frame >= COINCE ? 'mal' : 'calme', breath: frame >= COINCE ? 0.5 - 0.5 * Math.cos(frame / 2.4) : idle(frame), lungs: 1, heart: 1, beat: pulseAt(frame)}}
								pulm={1}
								vein={fadeIn(frame, SOUV, 10)}
								clot={clotO}
								clotT={tClot}
								lodged={lodged}
								swell={interpolate(frame, [PHL, PHL + 10, DET, DET + 10], [0, 0.5, 0.5, 0], clamp)}
							/>
						</div>
					</ZoomCam>
					{frame >= CAIL && clotO > 0.5 ? <Follow at={CAIL} x={DEF_WIN.x + tag.x + 40} y={DEF_WIN.y + tag.y - 70} label="caillot" /> : null}
					{frame >= ART && frame < SOUV ? (
						<div style={{position: 'absolute', left: 30, top: 510}}>
							<Pill at={ART} size={34}>
								artère du poumon
							</Pill>
						</div>
					) : null}
					{frame >= VEINE && frame < DET ? (
						<div style={{position: 'absolute', left: 30, top: 510}}>
							<Pill at={VEINE} size={34} color={LPI.blue}>
								veine profonde de la jambe
							</Pill>
						</div>
					) : null}
					{frame >= COEUR - 2 && frame < COINCE ? (
						<div style={{position: 'absolute', left: 30, top: 510}}>
							<Pill at={COEUR - 2} size={34}>
								cœur
							</Pill>
						</div>
					) : null}
					{frame >= POU2 - 2 && frame < MANQ - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 510}}>
							<Pill at={POU2 - 2} size={34} color={LPI.sky}>
								le sang ne passe plus
							</Pill>
						</div>
					) : null}
					{frame >= MANQ - 2 ? (
						<>
							<div style={{position: 'absolute', left: 30, top: 510}}>
								<Pill at={MANQ - 2} size={34}>
									il manque d'oxygène
								</Pill>
							</div>
							<div style={{position: 'absolute', left: 720, top: 40, width: 120, height: 120, transform: `scale(${popAt(frame, MANQ)})`}}>
								<svg width={120} height={120} viewBox="0 0 120 120">
									<circle cx={60} cy={60} r={52} fill={LPI.paper} stroke={N} strokeWidth={7} />
									<text x={60} y={76} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={52} fill={LPI.blue}>
										O₂
									</text>
									<path d="M24 96 L96 24" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
								</svg>
							</div>
						</>
					) : null}
				</Stage>
				<TermSlam index={0} at={BOU} term="Embolie pulmonaire" meaning="un caillot bouche une artère du poumon" sign="empty" slamY={SLAM_Y + 30} slot={{x: 72, y: 1062, w: 936}} active={frame >= BOU} />
				<TermSlam index={1} at={PHL} term="Phlébite" meaning="un caillot dans une veine profonde de la jambe" sign="alert" slamY={SLAM_Y + 30} slot={{x: 72, y: 1237, w: 936}} active={frame >= PHL} />
			</Camera>
			<Flash at={COINCE + 2} max={0.35} />
			<Sfx name="pop" at={CAIL} volume={0.09} />
			<Sfx name="whoosh" at={SOUV - 2} volume={0.06} />
			<Sfx name="whoosh" at={DET} volume={0.08} />
			<Sfx name="heartbeat" at={COEUR - 2} volume={0.09} />
			<Sfx name="impact" at={COINCE} volume={0.1} />
			<Sfx name="pop" at={MANQ} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · SIGNES ═══════════════════════════════ */
const SIG_WIN = {x: 24, y: 20, w: 888, h: 520};
const SB = {size: 220, x: 334, y: 2};
const sigPt = (x: number, y: number) => ({x: SB.x + (x * SB.size) / 400, y: SB.y + (y * SB.size) / 400});

export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const SIG = at('signes', 'signes');
	const COUP = at('signes', 'coup');
	const ESS = at('signes', 'essoufflement');
	const DOUL = at('signes', 'douleur');
	const INSP = at('signes', 'inspire');
	const COEUR = at('signes', 'cœur');
	const CRACH = at('signes', 'crache');
	const SAT = at('signes', 'saturation');
	const CHUTE = at('signes', 'chute');
	const JAMB = at('signes', 'jambes');
	const MOLL = at('signes', 'mollet');
	const DOULX = at('signes', 'douloureux');
	const PHL = at('signes', 'phlébite');
	const chest = sigPt(200, 290);
	const keys: CamKey[] = [
		{at: ESS - 2, s: 2.0, x: chest.x, y: chest.y - 20, dur: 14},
		{at: DOUL - 2, s: 2.4, x: sigPt(170, 270).x, y: sigPt(170, 270).y, dur: 12},
		{at: COEUR - 2, s: 2.6, x: sigPt(226, 300).x, y: sigPt(226, 300).y, dur: 12},
		{at: CRACH - 4, s: 3, x: sigPt(206, 160).x, y: sigPt(206, 160).y, dur: 12},
		{at: SAT - 4, s: 1.5, x: chest.x, y: chest.y, dur: 14},
		{at: JAMB - 2, s: 1.9, x: sigPt(200, 760).x, y: sigPt(200, 760).y, dur: 16},
		{at: MOLL - 2, s: 2.7, x: sigPt(156, 790).x, y: sigPt(156, 790).y, dur: 12},
	];
	const sat = interpolate(frame, [SAT, CHUTE + 14], [96, 88], ease);
	const fast = frame >= COUP;
	const inhale = 0.5 - 0.5 * Math.cos(frame / 2.2);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[COUP + 1, ESS + 1, DOUL + 1, COEUR + 1, CRACH + 1, CHUTE + 1, MOLL + 1]} shakes={[COUP + 2]}>
				<Head kicker="Les signes" kAt={SIG - 4} title="D'un *coup* !" tAt={COUP - 4} />
				<Stage y={LAY.stageY} h={560} at={SIG + 2} bumps={[COUP, CHUTE, MOLL]}>
					<ZoomCam keys={keys} {...SIG_WIN}>
						<div style={{position: 'absolute', left: SB.x, top: SB.y}}>
							<FullBody
								size={SB.size}
								patient={{
									mood: fast ? 'mal' : 'calme',
									breath: fast ? inhale : idle(frame),
									lungs: interpolate(frame, [ESS - 4, ESS + 4, DOUL + 30, DOUL + 40], [0, 1, 1, 0], clamp),
									heart: fadeIn(frame, COEUR - 4),
									beat: pulseAt(frame, 12),
									pale: fadeIn(frame, SAT, 14) * 0.4,
									sweat: fadeIn(frame, DOUL),
								}}
								chestPain={frame >= DOUL ? (frame >= INSP ? 0.4 + 0.6 * inhale : 1) * (frame < JAMB ? 1 : 0) : 0}
								swell={fadeIn(frame, MOLL + 2, 12)}
								calfPain={frame >= DOULX ? 1 : 0}
							/>
							<Cough on={frame >= CRACH && frame < SAT ? 1 : 0} size={SB.size} />
						</div>
					</ZoomCam>
					{frame >= SAT - 4 ? (
						<div style={{position: 'absolute', left: 640, top: 24}}>
							<Screen at={SAT - 4} label="SpO₂" value={String(Math.round(sat))} unit="%" alert={sat < 90} />
						</div>
					) : null}
					{frame >= COEUR - 2 && frame < CRACH - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={COEUR - 2} size={34}>
								le cœur s'accélère
							</Pill>
						</div>
					) : null}
					{frame >= INSP - 2 && frame < COEUR - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={INSP - 2} size={34}>
								plus forte quand on inspire
							</Pill>
						</div>
					) : null}
					{frame >= PHL - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={PHL - 2} size={34} color={LPI.blue}>
								phlébite ?
							</Pill>
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1030}}>
					<CauseChip at={ESS} icon={<LungsPicto size={56} />} label="essoufflement" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1030}}>
					<CauseChip at={DOUL} icon={<PainIcon size={56} />} label="douleur poitrine" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1140}}>
					<CauseChip at={COEUR} icon={<HeartPicto size={56} />} label="cœur rapide" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1140}}>
					<CauseChip at={CRACH} icon={<DropPicto size={56} />} label="crache du sang" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1250}}>
					<CauseChip at={SAT} icon={<O2Picto size={56} />} label="SpO₂ qui chute" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1250}}>
					<CauseChip at={MOLL} icon={<LegIcon size={56} />} label="mollet gonflé" />
				</div>
			</Camera>
			<Sfx name="impact" at={COUP} volume={0.08} />
			<Sfx name="pop" at={ESS} volume={0.1} />
			<Sfx name="pop" at={DOUL} volume={0.1} />
			<Sfx name="heartbeat" at={COEUR - 2} volume={0.1} />
			<Sfx name="pop" at={CRACH} volume={0.1} />
			<Sfx name="buzz" at={CHUTE} volume={0.06} dur={16} />
			<Sfx name="whoosh" at={JAMB - 2} volume={0.06} />
			<Sfx name="pop" at={MOLL} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · CONDUITE À TENIR ═══════════════════════════════ */
export const Urgence: React.FC = () => {
	const frame = useCurrentFrame();
	const URG = at('urgence', 'urgence');
	const ALE = at('urgence', 'alerte');
	const Q15 = at('urgence', '15');
	const MED = at('urgence', 'médecin');
	const INST = at('urgence', 'installe');
	const DEMI = at('urgence', 'demi-assise');
	const REPOS = at('urgence', 'repos');
	const SURV = at('urgence', 'surveille');
	const SATU = at('urgence', 'saturation');
	const POULS = at('urgence', 'pouls');
	const TENS = at('urgence', 'tension');
	const phone = useSoft(ALE - 4, true);
	const keys: CamKey[] = [
		{at: ALE - 2, s: 1.6, x: 160, y: 250, dur: 14},
		{at: INST - 4, s: 1.45, x: 640, y: 220, dur: 16},
		{at: SURV - 4, s: 1.3, x: 590, y: 440, dur: 14},
		{at: TENS + 18, s: 1, dur: 16},
	];
	const raise = interpolate(frame, [INST, DEMI + 8], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[URG + 1, Q15 + 1, DEMI + 1, SATU + 1, POULS + 1, TENS + 1]} shakes={[URG + 2]}>
				<Head kicker="Conduite à tenir" kAt={URG - 6} title="On *alerte* !" tAt={ALE - 2} />
				<Stage y={LAY.stageY} h={560} at={URG} bumps={[Q15, DEMI]}>
					<ZoomCam keys={keys} w={936} h={560}>
						<div style={{position: 'absolute', left: 50, top: 50, opacity: Math.min(1, phone * 1.5), transform: `translateY(${(1 - phone) * 80}px)`}}>
							<Phone digits={frame >= Q15 ? '15' : frame >= Q15 - 5 ? '1' : ''} ring={interpolate(frame, [Q15 + 6, Q15 + 12], [0, 1], clamp)} size={210} />
						</div>
						<div style={{position: 'absolute', left: 380, top: 40}}>
							<SemiSitting raise={raise} width={520} />
						</div>
						<div style={{position: 'absolute', left: 236, top: 404, display: 'flex', gap: 14}}>
							<Screen at={SATU} label="SpO₂" value="91" unit="%" />
							<Screen at={POULS} label="FC" value="118" />
							<Screen at={TENS} label="PA" value="110/70" />
						</div>
					</ZoomCam>
					{frame >= MED - 2 && frame < INST - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 480}}>
							<Pill at={MED - 2} size={34} color={LPI.blue}>
								ou le médecin à l'hôpital
							</Pill>
						</div>
					) : null}
					{frame >= REPOS - 2 && frame < SURV - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 480}}>
							<Pill at={REPOS - 2} size={34} color={LPI.sky}>
								au repos
							</Pill>
						</div>
					) : null}
				</Stage>
				<Stamp at={URG} x={800} y={398} text="Urgence !" size={60} rot={-7} />
				<div style={{position: 'absolute', left: 72, top: 1040, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={Q15} label="alerter : le 15 ou le médecin" size={44} />
					<CheckChip at={DEMI} label="position demi-assise, au repos" size={44} />
					<CheckChip at={SURV} label="surveiller SpO₂, pouls, tension" size={44} />
				</div>
			</Camera>
			<Sfx name="stamp" at={URG} volume={0.11} />
			<Sfx name="tick" at={Q15 - 5} volume={0.08} />
			<Sfx name="tick" at={Q15} volume={0.08} />
			<Sfx name="ding" at={Q15 + 8} volume={0.08} />
			<Sfx name="whoosh" at={INST - 4} volume={0.06} />
			<Sfx name="pop" at={DEMI} volume={0.1} />
			<Sfx name="pop" at={SATU} volume={0.09} />
			<Sfx name="pop" at={POULS} volume={0.09} />
			<Sfx name="pop" at={TENS} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TRAITEMENT ═══════════════════════════════ */
export const Traitement: React.FC = () => {
	const frame = useCurrentFrame();
	const CONF = at('traitement', 'confirmer');
	const SCAN = at('traitement', 'scanner');
	const TRAIT = at('traitement', 'traitement');
	const ANTI = at('traitement', 'anticoagulants');
	const GROS = at('traitement', 'grossir');
	const GRAV = at('traitement', 'graves');
	const DISS = at('traitement', 'dissoudre');
	const THR = at('traitement', 'thrombolyse');
	const scan = useSoft(SCAN - 6, true);
	const art = useSoft(TRAIT - 4, true);
	const keys: CamKey[] = [
		{at: SCAN - 2, s: 1.5, x: 230, y: 270, dur: 14},
		{at: TRAIT - 2, s: 1.35, x: 690, y: 270, dur: 16},
		{at: THR + 24, s: 1, dur: 16},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SCAN + 1, ANTI + 1, GROS + 1, DISS + 1, THR + 1]} shakes={[THR + 2]}>
				<Head kicker="Traitement" kAt={CONF - 4} title="À *l'hôpital*" tAt={CONF} />
				<Stage y={LAY.stageY} h={540} at={CONF + 2} bumps={[SCAN, THR]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: 20, top: 80, opacity: Math.min(1, scan * 1.5), transform: `scale(${0.6 + 0.4 * scan})`}}>
							<ScanMonitor label="scanner" scan={interpolate(frame, [SCAN, SCAN + 4, TRAIT, TRAIT + 6], [0, 1, 1, 0], clamp)} width={420} height={380}>
								<ChestScan clot={fadeIn(frame, SCAN + 8, 10)} width={300} />
							</ScanMonitor>
						</div>
						{frame >= TRAIT - 4 ? (
							<div style={{position: 'absolute', left: 460, top: 190, opacity: Math.min(1, art * 1.5), transform: `translateX(${(1 - art) * 200}px)`}}>
								<ArteryZoom width={460} clot={1} dissolve={interpolate(frame, [DISS, THR + 14], [0, 1], ease)} />
							</div>
						) : null}
						{frame >= GROS - 4 && frame < DISS ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<g transform={`translate(690 140) scale(${popAt(frame, GROS - 4)})`}>
									<circle r={42} fill={LPI.paper} stroke={LPI.pink} strokeWidth={8} />
									<path d="M0 22 V-20 M-14 -6 L0 -20 L14 -6" stroke={N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
									<path d="M-28 28 L28 -28" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
								</g>
							</svg>
						) : null}
					</ZoomCam>
					{frame >= SCAN - 2 && frame < TRAIT - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={SCAN - 2} size={34} color={LPI.blue}>
								scanner des poumons
							</Pill>
						</div>
					) : null}
					{frame >= ANTI && frame < GRAV ? (
						<div style={{position: 'absolute', left: 30, top: 446, display: 'flex', alignItems: 'center', gap: 12}}>
							<div style={{transform: `scale(${popAt(frame, ANTI)})`}}>
								<PillIcon size={70} />
							</div>
							<Pill at={ANTI + 2} size={32}>
								anticoagulants
							</Pill>
						</div>
					) : null}
				</Stage>
				<TermSlam index={0} at={ANTI} term="Anticoagulants" meaning="empêchent le caillot de grossir" sign="check" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= ANTI} />
				<TermSlam index={1} at={THR} term="Thrombolyse" meaning="on dissout le caillot (cas graves)" sign="alert" slamY={SLAM_Y} slot={termSlot(1)} active={frame >= THR} />
			</Camera>
			<Sfx name="whoosh" at={SCAN - 6} volume={0.06} />
			<Sfx name="tick" at={SCAN + 8} volume={0.07} />
			<Sfx name="pop" at={ANTI} volume={0.1} />
			<Sfx name="pop" at={GROS - 4} volume={0.09} />
			<Sfx name="ding" at={THR + 10} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · FACTEURS DE RISQUE ═══════════════════════════════ */
// Les jambes en gros plan : immobile, le sang stagne et un caillot se forme ; après une opération on fait marcher
// (le sang circule), bas de contention.
const RISK_WIN = {x: 24, y: 20, w: 888, h: 420};
const RB = {size: 178, x: 355, y: 0};
const riskPt = (x: number, y: number) => ({x: RB.x + (x * RB.size) / 400, y: RB.y + (y * RB.size) / 400});
const RISKS: [string, React.FC<{size?: number}>, string][] = [
	['alité', BedIcon, 'alité'],
	['plâtré', CastIcon, 'plâtré'],
	['avion', PlaneIcon, 'en avion'],
	['opération', ScalpelIcon, 'opération récente'],
	['cancer', RibbonIcon, 'cancer'],
	['pilule', PillIcon, 'pilule, grossesse'],
];

export const Risques: React.FC = () => {
	const frame = useCurrentFrame();
	const FACT = at('risques', 'facteurs');
	const IMMO = at('risques', 'immobile');
	const APRES = at('risques', 'après');
	const MARCH = at('risques', 'marcher');
	const CONT = at('risques', 'contention');
	const legs = riskPt(200, 790);
	const keys: CamKey[] = [
		{at: FACT, s: 1.9, x: legs.x, y: legs.y - 20, dur: 16},
		{at: IMMO - 2, s: 2.6, x: riskPt(150, 800).x, y: riskPt(150, 800).y, dur: 14},
		{at: APRES - 2, s: 1.9, x: legs.x, y: legs.y - 20, dur: 16},
	];
	// le sang stagne quand on ne bouge pas, repart quand on marche
	const speed = (f: number) => (f < IMMO ? 2 : f < APRES ? 0.3 : f < MARCH ? 1 : 4);
	let phase = 0;
	for (let f = 0; f < frame; f++) phase += speed(f);
	const clot = interpolate(frame, [IMMO, IMMO + 10, APRES - 4, APRES + 4], [0, 1, 1, 0], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[IMMO + 1, at('risques', 'opération') + 1, MARCH + 1, CONT + 1]} shakes={[IMMO + 2]}>
				<Head kicker="Facteurs de risque" kAt={FACT - 4} title="Qui est à *risque* ?" tAt={FACT} />
				<Stage y={LAY.stageY} h={460} at={FACT} bumps={[IMMO, MARCH]}>
					<ZoomCam keys={keys} {...RISK_WIN}>
						<div style={{position: 'absolute', left: RB.x, top: RB.y}}>
							<FullBody size={RB.size} patient={{breath: idle(frame)}} vein={fadeIn(frame, FACT, 10)} veinPhase={phase} clot={clot} clotT={0} clotGrow={interpolate(frame, [IMMO, at('risques', 'avion')], [0, 1], ease)} stocking={fadeIn(frame, CONT - 4, 10)} />
						</div>
					</ZoomCam>
					{frame >= IMMO - 2 && frame < APRES - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 380}}>
							<Pill at={IMMO - 2} size={34} color={LPI.sky}>
								immobile : le sang stagne
							</Pill>
						</div>
					) : null}
					{frame >= MARCH - 2 && frame < CONT - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 380}}>
							<Pill at={MARCH - 2} size={34}>
								on marche : le sang circule
							</Pill>
						</div>
					) : null}
					{frame >= CONT - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 380}}>
							<Pill at={CONT - 4} size={34} color={LPI.blue}>
								bas de contention
							</Pill>
						</div>
					) : null}
				</Stage>
				{RISKS.map(([w, Icon, label], i) => (
					<div key={w} style={{position: 'absolute', left: i % 2 ? 560 : 72, top: 930 + Math.floor(i / 2) * 110}}>
						<CauseChip at={at('risques', w)} icon={<Icon size={56} />} label={label} tone={i < 3 ? LPI.sky : LPI.pink} />
					</div>
				))}
			</Camera>
			<Sfx name="pop" at={IMMO} volume={0.08} />
			{RISKS.map(([w]) => (
				<Sfx key={w} name="pop" at={at('risques', w)} volume={0.09} />
			))}
			<Sfx name="whoosh" at={MARCH - 2} volume={0.06} />
			<Sfx name="ding" at={CONT} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="L'embolie *pulmonaire*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'bouge') + 16}
		rows={[
			[at('outro', 'caillot'), 'empty', 'Embolie pulmonaire', 'caillot dans le poumon'],
			[at('outro', 'phlébite'), 'down', 'Souvent une phlébite', 'veine de la jambe'],
			[at('outro', 'essoufflement'), 'alert', 'Signes', 'essoufflement · douleur · cœur rapide'],
			[at('outro', 'anticoagulants'), 'check', 'Traitement', 'anticoagulants'],
			[at('outro', 'bouge'), 'up', 'Prévention', 'on bouge, bas de contention'],
		]}
	/>
);
