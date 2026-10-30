// Scènes de « La SpO₂ » : accroche (« 98 %… mais 98 % de quoi ? »), définition dans le corps (poumons → sang →
// hémoglobine des globules rouges → 100 hémoglobines), mesure au doigt (saturomètre en gros plan), norme adulte
// (et cible BPCO), désaturation / hypoxémie, signes (cyanose), récap rapide. La caméra s'approche de ce dont
// parle la voix (ZoomCam) ; saturomètre, vaisseau et grille : src/brand/oxygen.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNum, CamKey, CauseChip, Head, LAY, Pill, RecapScene, SLAM_Y, termSlot, ZoomCam} from '../../brand/episode';
import {CyanosisIcon, DizzyIcon} from '../../brand/icons';
import {CheckChip, Stamp} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {HemoGrid, PulseOx, SPO_ZONES, Vessel} from '../../brand/oxygen';
import {Patient} from '../../brand/patient';
import {LungsPicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {HeatWaves} from '../../brand/thermo';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
/** fondu enchaîné : 0 avant `a`, 1 après `a + d` */
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

/** Calque qui apparaît / disparaît en fondu. */
const Layer: React.FC<{o: number; children: React.ReactNode}> = ({o, children}) => (o <= 0 ? null : <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, o)}}>{children}</div>);

/** Petit écran de saturomètre (accroche : « tous les saturomètres »). */
const MiniScreen: React.FC<{value: number; at: number; out: number; x: number; y: number; rot: number}> = ({value, at: t0, out, x, y, rot}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || out >= 1) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				padding: '14px 26px',
				borderRadius: 30,
				background: N,
				boxShadow: SHADOW,
				transform: `rotate(${rot}deg) scale(${popAt(frame, t0) * (1 - out)})`,
				display: 'flex',
				alignItems: 'baseline',
				gap: 8,
			}}
		>
			<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: LPI.sky}}>SpO₂</span>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: LPI.paper, lineHeight: 1}}>{value}</span>
			<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: LPI.sky}}>%</span>
		</div>
	);
};

/** Pastille ronde « ? » qui tangue. */
const QMark: React.FC<{at: number; x: number; y: number; size?: number}> = ({at: t0, x, y, size = 170}) => {
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
				transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`,
			}}
		>
			?
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : le saturomètre affiche 98 % (miniature). « tous les saturomètres » : d'autres écrans surgissent ;
// « 98 % de quoi ? » : la caméra fonce sur le chiffre ; la question ; « s'inquiéter » : le chiffre chute, alarme.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUS = at('intro', 'tous');
	const SATU = at('intro', 'saturomètres');
	const MAIS = at('intro', 'mais');
	const P98 = at('intro', '98', 2);
	const QUOI = at('intro', 'quoi');
	const CEST = at('intro', "c'est");
	const SPO = at('intro', 'spo');
	const QUAND = at('intro', 'quand');
	const INQ = at('intro', "s'inquiéter");
	const s = interpolate(frame, [0, MAIS, P98 + 2, CEST - 6, CEST + 12], [1.55, 1.55, 2.1, 2.1, 1], ease);
	const dy = interpolate(frame, [CEST - 6, CEST + 12], [0, 150], ease);
	const value = interpolate(frame, [INQ - 2, INQ + 18], [98, 86], clamp);
	const out = interpolate(frame, [MAIS - 4, MAIS + 6], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[3, TOUS + 1, P98 + 1, QUOI + 1, SPO + 1, INQ + 1]} shakes={[INQ + 2]} strength={0.04}>
				{/* le saturomètre : l'écran est centré sur x = 540 */}
				<div style={{position: 'absolute', left: 21, top: 480, transformOrigin: '519px 216px', transform: `translateY(${dy}px) scale(${s})`}}>
					<PulseOx value={value} width={820} light={1} alert={value < 90 ? 1 : 0} />
				</div>
				<MiniScreen value={97} at={TOUS} out={out} x={70} y={210} rot={-8} />
				<MiniScreen value={99} at={SATU} out={out} x={700} y={250} rot={6} />
				<MiniScreen value={96} at={SATU + 4} out={out} x={380} y={1200} rot={-4} />
				<QMark at={QUOI} x={850} y={230} />
				{frame >= CEST - 2 ? (
					<>
						<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
							<Title at={CEST} text="C'est quoi la" size={74} stagger={3} brush={false} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 312, width: 760}}>
							<Title at={SPO - 2} text="*SpO₂* ?" size={136} stagger={4} />
						</div>
						<div style={{position: 'absolute', left: 72, top: 488, width: 936}}>
							<Title at={QUAND - 2} text="et quand *s'inquiéter* ?" size={60} stagger={2} brush={false} />
						</div>
					</>
				) : null}
				<Burst at={P98} x={540} y={696} r={300} n={14} />
				<Burst at={QUOI} x={935} y={315} r={200} n={12} />
				<Burst at={INQ} x={540} y={900} r={320} n={14} />
			</Camera>
			<Flash at={INQ + 4} />
			<Sfx name="heartbeat" at={0} volume={0.1} />
			<Sfx name="pop" at={TOUS} volume={0.09} />
			<Sfx name="pop" at={SATU} volume={0.09} />
			<Sfx name="whoosh" at={P98 - 4} volume={0.07} />
			<Sfx name="pop" at={QUOI} volume={0.12} />
			<Sfx name="whoosh" at={CEST - 4} volume={0.06} />
			<Sfx name="impact" at={SPO} volume={0.09} />
			<Sfx name="buzz" at={INQ + 4} volume={0.08} dur={26} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
// Le sigle se déplie (S · p · O₂), puis dans le corps : on respire, la caméra plonge dans le poumon → vaisseau vu de
// près (l'O₂ se fixe sur l'hémoglobine des globules rouges) → le sang part dans tout le corps → 100 hémoglobines :
// 98 chargées = 98 %.
const DEF_WIN = {x: 24, y: 20, w: 888, h: 520};
const DEF_PAT = {x: 264, y: 26, size: 360};
const defPt = (x: number, y: number) => ({x: DEF_PAT.x + (x * DEF_PAT.size) / 400, y: DEF_PAT.y + (y * DEF_PAT.size) / 400});
const LETTERS: [string, string, string][] = [
	['S', 'saturation', 'saturation'],
	['p', 'pulsée', 'pulsée'],
	['O₂', 'oxygène', 'oxygène'],
];

export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const SPO = at('def', 'spo');
	const SAT = at('def', 'saturation');
	const PUL = at('def', 'pulsée');
	const OXY = at('def', 'oxygène');
	const RESP = at('def', 'respire');
	const LOXY = at('def', "l'oxygène");
	const PASSE = at('def', 'passe');
	const SANG = at('def', 'sang');
	const FIXE = at('def', 'fixe');
	const HEMO = at('def', "l'hémoglobine");
	const GLOB = at('def', 'globules');
	const TRANS = at('def', 'transportent');
	const CORPS = at('def', 'corps');
	const SPO2 = at('def', 'spo', 2);
	const POUR = at('def', 'pourcentage');
	const DHEMO = at('def', "d'hémoglobine");
	const CHAR = at('def', 'chargée');
	const lungs = defPt(200, 310);
	const sigleO = 1 - fadeIn(frame, RESP - 8, 10);
	const bodyO = fadeIn(frame, RESP - 6, 10) * (1 - fadeIn(frame, SANG - 2)) + fadeIn(frame, CORPS - 8) * (1 - fadeIn(frame, SPO2 - 4));
	const vesselO = fadeIn(frame, SANG - 2) * (1 - fadeIn(frame, CORPS - 8));
	const gridO = fadeIn(frame, SPO2 - 4);
	const body: CamKey[] = [
		{at: LOXY - 2, s: 1.9, x: lungs.x, y: lungs.y - 30, dur: 14},
		{at: SANG - 6, s: 3.4, x: lungs.x - 40, y: lungs.y, dur: 10},
		{at: CORPS - 10, s: 1, dur: 1},
	];
	const vessel: CamKey[] = [
		{at: 0, s: 1.35, x: 300, y: 220, dur: 1},
		{at: SANG, s: 1.15, x: 340, y: 240, dur: 16},
		{at: FIXE - 2, s: 1.6, x: 520, y: 330, dur: 14},
		{at: TRANS - 4, s: 1, dur: 16},
	];
	const sat = interpolate(frame, [FIXE, GLOB + 10], [0.15, 0.98], ease);
	// le sang accélère quand il « transporte »
	const vPhase = 4 * frame + 6 * Math.max(0, frame - TRANS);
	const breath = idle(frame, 50);
	const count = interpolate(frame, [POUR - 4, CHAR + 6], [0, 98], ease);
	const air = frame >= LOXY - 4 && frame < SANG;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SAT + 1, PUL + 1, OXY + 1, FIXE + 1, CORPS + 1, POUR + 1]} shakes={[FIXE + 2]}>
				<Head kicker="Définition" kAt={SPO} title="La *SpO₂*" tAt={SPO + 2} />
				<Stage y={LAY.stageY} h={560} at={SPO + 4} bumps={[RESP, FIXE, POUR]}>
					{/* le sigle se déplie */}
					<Layer o={sigleO}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', gap: 64}}>
							{LETTERS.map(([l, w], i) => {
								const t = [SAT, PUL, OXY][i];
								return (
									<div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 230}}>
										<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 190, lineHeight: 1, color: frame >= t ? LPI.blue : N, transform: `scale(${frame >= t ? 1 + 0.15 * Math.exp(-(frame - t) / 4) : 1})`}}>{l}</div>
										<div style={{height: 70, marginTop: 20}}>
											{frame >= t ? (
												<Pill at={t} size={42} color={i === 2 ? LPI.blue : LPI.pink}>
													{w}
												</Pill>
											) : null}
										</div>
									</div>
								);
							})}
						</div>
					</Layer>
					{/* dans le corps : on respire, l'oxygène entre dans les poumons */}
					<Layer o={bodyO}>
						<ZoomCam keys={body} {...DEF_WIN}>
							<div style={{position: 'absolute', left: DEF_PAT.x, top: DEF_PAT.y}}>
								<Patient size={DEF_PAT.size} breath={breath} lungs={1} heart={1} beat={pulseAt(frame)} flow={frame >= CORPS - 10 ? 1 : 0} flowPhase={vPhase} brain={frame >= CORPS - 10 ? 1 : 0} />
								{air ? (
									<svg width={DEF_PAT.size} height={DEF_PAT.size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
										{Array.from({length: 6}, (_, i) => {
											const t = ((frame + i * 7) % 42) / 42;
											const side = i % 2 ? 1 : -1;
											const x = t < 0.5 ? 200 : 200 + side * (t - 0.5) * 2 * 46;
											const y = 150 + t * 190;
											return <circle key={i} cx={x} cy={y} r={9} fill={LPI.blue} stroke={LPI.paper} strokeWidth={3} opacity={Math.sin(t * Math.PI)} />;
										})}
									</svg>
								) : null}
							</div>
						</ZoomCam>
					</Layer>
					{/* vu de près : l'O₂ passe dans le sang et se fixe sur l'hémoglobine */}
					<Layer o={vesselO}>
						<ZoomCam keys={vessel} {...DEF_WIN}>
							<div style={{position: 'absolute', left: 0, top: 40}}>
								<Vessel sat={sat} width={888} lung={1} loading={interpolate(frame, [SANG - 4, SANG + 6, TRANS, TRANS + 10], [0, 1, 1, 0], clamp)} phase={vPhase} />
							</div>
						</ZoomCam>
					</Layer>
					{/* 100 hémoglobines : 98 chargées = 98 % */}
					<Layer o={gridO}>
						<div style={{position: 'absolute', left: 50, top: 66}}>
							<HemoGrid filled={count} size={36} />
						</div>
						<div style={{position: 'absolute', left: 500, top: 60, width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 170, color: N, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
								{Math.round(count)}
								<span style={{fontSize: 80, color: LPI.blue}}> %</span>
							</div>
							{frame >= DHEMO - 2 ? (
								<Enter at={DHEMO - 2} distance={20}>
									<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 38, color: N, textAlign: 'center', lineHeight: 1.15, marginTop: 16}}>
										d'hémoglobine
										<br />
										<span style={{color: LPI.blue}}>chargée en O₂</span>
									</div>
								</Enter>
							) : null}
						</div>
					</Layer>
					{/* repères */}
					{frame >= LOXY && frame < SANG ? (
						<div style={{position: 'absolute', left: 40, top: 28}}>
							<Pill at={LOXY} size={34} color={LPI.blue}>
								O₂ = oxygène
							</Pill>
						</div>
					) : null}
					{frame >= PASSE && frame < SANG + 20 ? (
						<div style={{position: 'absolute', left: 620, top: 28}}>
							<Pill at={PASSE} size={34} color={LPI.sky}>
								poumons → sang
							</Pill>
						</div>
					) : null}
					{frame >= HEMO && frame < CORPS - 8 ? (
						<div style={{position: 'absolute', left: 540, top: 40, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
							<div style={{transform: `scale(${popAt(frame, HEMO)})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 8px 10px', borderRadius: 999, background: LPI.paper, border: `4px solid ${N}`, boxShadow: SHADOW}}>
								<svg width={40} height={40} viewBox="0 0 40 40">
									<circle cx={20} cy={20} r={14} fill={LPI.blue} stroke={N} strokeWidth={4} />
								</svg>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>hémoglobine + O₂</span>
							</div>
							{frame >= GLOB ? (
								<div style={{transform: `scale(${popAt(frame, GLOB)})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 8px 10px', borderRadius: 999, background: LPI.paper, border: `4px solid ${N}`, boxShadow: SHADOW}}>
									<svg width={50} height={40} viewBox="0 0 50 40">
										<ellipse cx={25} cy={20} rx={21} ry={15} fill={LPI.pink} stroke={N} strokeWidth={4} />
									</svg>
									<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>globule rouge</span>
								</div>
							) : null}
						</div>
					) : null}
					{frame >= CORPS - 4 && frame < SPO2 - 4 ? (
						<div style={{position: 'absolute', left: 40, top: 470}}>
							<Pill at={CORPS - 4} size={34}>
								dans tout le corps
							</Pill>
						</div>
					) : null}
				</Stage>
				{/* SpO₂ = saturation pulsée en oxygène */}
				{frame >= RESP - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 1030, display: 'flex', alignItems: 'center', gap: 16}}>
						<Pill at={RESP - 4} size={44} color={LPI.blue}>
							SpO₂
						</Pill>
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>=</span>
						<Enter at={RESP - 2} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 38, color: N}}>saturation pulsée en oxygène</span>
						</Enter>
					</div>
				) : null}
				<TermSlam
					index={0}
					at={POUR}
					term="SpO₂"
					meaning={
						<>
							% d'hémoglobine chargée en O₂ <Seuil>98 % = 98 sur 100</Seuil>
						</>
					}
					sign="check"
					slamY={SLAM_Y}
					slot={{x: 72, y: 1130, w: 936}}
					active={frame >= POUR}
				/>
			</Camera>
			<Sfx name="pop" at={SAT} volume={0.1} />
			<Sfx name="pop" at={PUL} volume={0.1} />
			<Sfx name="pop" at={OXY} volume={0.1} />
			<Sfx name="whoosh" at={RESP - 6} volume={0.06} />
			<Sfx name="whoosh" at={SANG - 6} volume={0.07} />
			<Sfx name="ding" at={FIXE} volume={0.07} />
			<Sfx name="pop" at={HEMO} volume={0.09} />
			<Sfx name="pop" at={GLOB} volume={0.09} />
			<Sfx name="whoosh" at={CORPS - 8} volume={0.06} />
			<Sfx name="drumroll" at={POUR - 2} volume={0.05} dur={30} />
			<Sfx name="ding" at={CHAR + 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE ═══════════════════════════════ */
// Le patient lève la main, le saturomètre se pose au bout du doigt ; on plonge dans le doigt → gros plan : la pince
// se ferme, la lumière traverse le doigt à chaque battement ; puis les 3 conditions d'une valeur fiable.
const MES_WIN = {x: 24, y: 20, w: 888, h: 520};
const MES_PAT = {x: 150, y: 30, size: 300};
const OX_W = 780;
const oxPt = (x: number, y: number) => ({x: 54 + (x * OX_W) / 900, y: (y * OX_W) / 900});

export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const ME = at('mesure', 'mesure');
	const SATU = at('mesure', 'saturomètre');
	const OXYM = at('mesure', 'oxymètre');
	const PINCE = at('mesure', 'pince');
	const DOIGT = at('mesure', 'doigt');
	const LUM = at('mesure', 'lumière');
	const BATT = at('mesure', 'battement');
	const PUL = at('mesure', 'pulsée');
	const FIA = at('mesure', 'fiable');
	const VER = at('mesure', 'vernis');
	const MAIN = at('mesure', 'main');
	const CHAU = at('mesure', 'chaude');
	const COUR = at('mesure', 'courbe');
	const REG = at('mesure', 'régulière');
	const k = MES_PAT.size / 400;
	const hand = {x: MES_PAT.x + 515 * k, y: MES_PAT.y + 329 * k};
	const front: CamKey[] = [
		{at: SATU - 2, s: 1.7, x: hand.x - 60, y: hand.y - 20, dur: 14},
		{at: PINCE - 6, s: 3.4, x: hand.x + 4, y: hand.y + 4, dur: 10},
	];
	const light = oxPt(560, 452);
	const nail = oxPt(618, 378);
	const screen = oxPt(570, 260);
	const close: CamKey[] = [
		{at: 0, s: 1.3, dur: 1},
		{at: PINCE - 2, s: 1, dur: 14},
		{at: LUM - 2, s: 1.6, x: light.x, y: light.y - 10, dur: 14},
		{at: BATT - 2, s: 1.25, x: screen.x, y: screen.y + 40, dur: 14},
		{at: FIA - 2, s: 1.7, x: nail.x, y: nail.y + 30, dur: 16},
		{at: COUR - 4, s: 1.7, x: screen.x + 30, y: screen.y + 40, dur: 14},
	];
	const frontO = 1 - fadeIn(frame, PINCE - 4);
	const clip = interpolate(frame, [PINCE - 4, PINCE + 8, FIA, FIA + 10, COUR - 8, COUR + 2], [0, 1, 1, 0, 0, 1], ease);
	const mini = popAt(frame, SATU);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SATU + 1, PINCE + 1, LUM + 1, BATT + 1, VER + 1, CHAU + 1, REG + 1]} shakes={[PINCE + 2]}>
				<Head kicker="Mesure" kAt={ME} title="Le *saturomètre*" tAt={SATU - 4} />
				<Stage y={LAY.stageY} h={560} at={ME + 2} bumps={[PINCE, VER, REG]}>
					{/* le patient lève la main : pince au bout du doigt */}
					<Layer o={frontO}>
						<ZoomCam keys={front} {...MES_WIN}>
							<div style={{position: 'absolute', left: MES_PAT.x, top: MES_PAT.y}}>
								<Patient size={MES_PAT.size} breath={idle(frame)} armR={interpolate(frame, [ME, ME + 14], [0, 60], ease)} />
								{frame >= SATU ? (
									<svg width={MES_PAT.size} height={MES_PAT.size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
										<g transform={`translate(522 334) rotate(36) scale(${mini})`}>
											<rect x={-30} y={-26} width={60} height={52} rx={14} fill={N} />
											<rect x={-20} y={-18} width={40} height={20} rx={5} fill={LPI.paper} />
											<text x={0} y={-3} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={14} fill={N}>
												98
											</text>
										</g>
									</svg>
								) : null}
							</div>
						</ZoomCam>
					</Layer>
					{/* gros plan : la pince, la lumière, le pouls */}
					<Layer o={1 - frontO}>
						<ZoomCam keys={close} {...MES_WIN}>
							<div style={{position: 'absolute', left: 54, top: 0}}>
								<PulseOx
									value={98}
									width={OX_W}
									clip={clip}
									on={fadeIn(frame, DOIGT - 2, 8)}
									light={fadeIn(frame, LUM - 2, 8) * (clip > 0.9 ? 1 : 0)}
									polish={interpolate(frame, [VER - 6, VER, VER + 12, VER + 22], [0, 1, 1, 0], clamp)}
									cold={interpolate(frame, [VER + 18, VER + 24, CHAU, CHAU + 12], [0, 1, 1, 0], clamp)}
									noise={interpolate(frame, [COUR - 10, COUR - 4, REG, REG + 14], [0, 1, 1, 0], clamp)}
								/>
							</div>
							{/* vernis : non ! */}
							{frame >= VER + 2 && frame < VER + 22 ? (
								<svg width={888} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
									<g transform={`translate(${nail.x} ${nail.y - 60}) scale(${popAt(frame, VER + 2)})`}>
										<circle r={34} fill={LPI.pink} stroke={LPI.paper} strokeWidth={6} />
										<path d="M-13 -13 L13 13 M13 -13 L-13 13" stroke={N} strokeWidth={8} strokeLinecap="round" />
									</g>
								</svg>
							) : null}
							<div style={{position: 'absolute', left: 280, top: 230, width: 600, height: 300, pointerEvents: 'none'}}>
								<HeatWaves on={interpolate(frame, [CHAU, CHAU + 6, CHAU + 26, CHAU + 34], [0, 1, 1, 0], clamp)} width={600} height={300} xs={[60, 260, 460]} />
							</div>
						</ZoomCam>
					</Layer>
					{frame >= OXYM - 2 && frame < PINCE - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={OXYM - 2} size={34} color={LPI.blue}>
								= oxymètre de pouls
							</Pill>
						</div>
					) : null}
					{frame >= BATT && frame < FIA - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 470}}>
							<Pill at={PUL - 2 > BATT ? PUL - 2 : BATT} size={34}>
								{frame >= PUL - 2 ? 'pulsée = au rythme du pouls' : 'à chaque battement'}
							</Pill>
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1040, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={VER} label="pas de vernis" size={44} />
					<CheckChip at={CHAU} label="une main bien chaude" size={44} />
					<CheckChip at={REG} label="une courbe régulière" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={SATU} volume={0.1} />
			<Sfx name="pop" at={OXYM} volume={0.08} />
			<Sfx name="whoosh" at={PINCE - 6} volume={0.07} />
			<Sfx name="tick" at={PINCE + 6} volume={0.09} />
			<Sfx name="ding" at={DOIGT} volume={0.07} />
			<Sfx name="heartbeat" at={BATT - 4} volume={0.1} />
			<Sfx name="pop" at={VER} volume={0.1} />
			<Sfx name="buzz" at={VER + 2} volume={0.05} dur={10} />
			<Sfx name="pop" at={CHAU} volume={0.1} />
			<Sfx name="ding" at={REG + 8} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const AD = at('norme', "l'adulte");
	const NORM = at('norme', 'normale');
	const S95 = at('norme', '95');
	const S100 = at('norme', '100');
	const BPCO = at('norme', 'bpco');
	const MAL = at('norme', 'maladie');
	const MED = at('norme', 'médecin');
	const CIB = at('norme', 'cible');
	const S88 = at('norme', '88');
	const S92 = at('norme', '92');
	const band = useSoft(NORM - 4);
	const pat = useSoft(BPCO - 2, true);
	const value = interpolate(frame, [S100 + 4, S100 + 24, S88 - 2, S92 + 10], [95, 98, 98, 90], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, NORM + 1, S95 + 1, S100 + 1, BPCO + 1, CIB + 1, S88 + 1, S92 + 1]} shakes={[S95 + 2, S100 + 2]}>
				<Head kicker="Norme adulte" kAt={AD - 4} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420}}>
					<CheckChip at={AD} label="adulte" size={40} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 510, width: 936, height: 250, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 530, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
					<BigNum at={S95} size={180}>
						95
					</BigNum>
					{frame >= S100 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: LPI.blue}}>–</div> : null}
					<BigNum at={S100} size={180}>
						100
					</BigNum>
					{frame >= S100 + 2 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 100, color: LPI.blue}}>%</div> : null}
				</div>
				<Burst at={S95} x={350} y={640} r={220} n={10} />
				<Burst at={S100} x={720} y={640} r={240} n={12} />
				<NormScale
					zones={SPO_ZONES}
					value={value}
					at={NORM + 4}
					markerAt={S100 + 4}
					y={790}
					bracket={{lo: 88, hi: 92, label: 'cible BPCO', at: CIB}}
				/>
				{/* BPCO : maladie chronique des poumons, cible fixée par le médecin */}
				<div style={{position: 'absolute', left: 72, top: 1070, width: 600, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
					<Pill at={BPCO} size={46} color={LPI.blue}>
						BPCO
					</Pill>
					{frame >= MAL - 2 ? (
						<Enter at={MAL - 2} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: N, lineHeight: 1.15, display: 'block'}}>
								maladie chronique
								<br />
								<span style={{color: LPI.blue}}>des poumons</span>
							</span>
						</Enter>
					) : null}
					{frame >= MED - 2 ? (
						<Enter at={MED - 2} distance={20}>
							<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: '0.08em', textTransform: 'uppercase', color: alpha(N, 0.65)}}>cible fixée par le médecin :</span>
						</Enter>
					) : null}
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<BigNum at={S88} size={100} color={LPI.pink}>
							88
						</BigNum>
						{frame >= S92 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.blue}}>–</div> : null}
						<BigNum at={S92} size={100} color={LPI.pink}>
							92
						</BigNum>
						{frame >= S92 + 2 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.blue}}>%</div> : null}
					</div>
				</div>
				{frame >= BPCO - 2 ? (
					<div style={{position: 'absolute', left: 720, top: 1050, opacity: Math.min(1, pat * 1.5), transform: `translateY(${(1 - pat) * 60}px)`}}>
						<Patient size={250} breath={idle(frame, 40)} lungs={1} mood="calme" />
					</div>
				) : null}
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="impact" at={S95} volume={0.1} />
			<Sfx name="impact" at={S100} volume={0.1} />
			<Sfx name="pop" at={BPCO} volume={0.1} />
			<Sfx name="whoosh" at={CIB} volume={0.06} />
			<Sfx name="impact" at={S88} volume={0.08} />
			<Sfx name="impact" at={S92} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · TROP BAS ═══════════════════════════════ */
// Le chiffre chute sur l'écran (zoom), puis la caméra glisse vers le sang : les globules rouges se vident d'O₂.
const BAS_OX = {x: 0, y: 70, w: 540};
const BAS_VES = {x: 470, y: 200, w: 440};
export const Bas: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('bas', 'dessous');
	const S95 = at('bas', '95');
	const DSAT = at('bas', 'désaturation');
	const S90 = at('bas', '90');
	const HYP = at('bas', 'hypoxémie');
	const MAN = at('bas', 'manque');
	const URG = at('bas', 'urgence');
	const PREV = at('bas', 'prévient');
	const value = interpolate(frame, [S95, S95 + 16, S90, S90 + 16], [98, 93, 93, 87], ease);
	const sat = interpolate(frame, [S95, S95 + 16, S90, S90 + 16, MAN, MAN + 20], [0.98, 0.9, 0.9, 0.8, 0.8, 0.55], ease);
	const fill = interpolate(frame, [S95, S95 + 20, S90, S90 + 20], [0, 0.45, 0.45, 1], clamp);
	const screen = {x: BAS_OX.x + (570 * BAS_OX.w) / 900, y: BAS_OX.y + (240 * BAS_OX.w) / 900};
	const ves = {x: BAS_VES.x + BAS_VES.w / 2, y: BAS_VES.y + (300 * BAS_VES.w) / 900};
	const keys: CamKey[] = [
		{at: S95 - 4, s: 1.7, x: screen.x, y: screen.y, dur: 14},
		{at: MAN - 4, s: 1.8, x: ves.x, y: ves.y, dur: 16},
		{at: URG - 4, s: 1, dur: 10},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[S95 + 1, DSAT + 1, S90 + 1, HYP + 1, URG + 1]} shakes={[HYP + 2, URG + 2]}>
				<Head kicker="En dessous de 95 %" kAt={DES} title="Trop *bas*" tAt={DES + 3} />
				<Stage y={LAY.stageY} h={540} at={DES + 2} layers={[{color: PINK, level: fill}]} bumps={[S95, S90]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: BAS_OX.x, top: BAS_OX.y}}>
							<PulseOx value={value} width={BAS_OX.w} light={1} alert={value < 90 ? 1 : 0} />
						</div>
						<div style={{position: 'absolute', left: BAS_VES.x, top: BAS_VES.y}}>
							<Vessel sat={sat} width={BAS_VES.w} phase={frame * 2.5} />
						</div>
					</ZoomCam>
					<Stamp at={URG} x={700} y={430} text="Urgence !" size={60} rot={-6} />
					{frame >= PREV - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 460}}>
							<Pill at={PREV - 2} size={34}>
								on prévient tout de suite
							</Pill>
						</div>
					) : null}
				</Stage>
				<TermSlam
					index={0}
					at={DSAT}
					term="Désaturation"
					meaning={
						<>
							SpO₂ trop basse <Seuil>&lt; 95 %</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= DSAT && frame < HYP}
				/>
				<TermSlam
					index={1}
					at={HYP}
					term="Hypoxémie"
					meaning={
						<>
							il manque d'oxygène dans le sang <Seuil>&lt; 90 %</Seuil>
						</>
					}
					sign="empty"
					slamY={SLAM_Y}
					slot={termSlot(1)}
					active={frame >= HYP}
				/>
			</Camera>
			<Flash at={URG} />
			<Sfx name="tick" at={S95} volume={0.08} />
			<Sfx name="tick" at={S90} volume={0.08} />
			<Sfx name="buzz" at={S90 + 10} volume={0.06} dur={20} />
			<Sfx name="stamp" at={URG} volume={0.11} />
			<Sfx name="pop" at={PREV} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · SIGNES ═══════════════════════════════ */
// Sur le patient : il respire vite (zoom thorax), lèvres bleutées (zoom bouche), ongle bleuté (gros plan du doigt),
// agité, confus ; « on regarde toujours le patient » : la caméra recule, une loupe l'entoure.
const SIG_WIN = {x: 24, y: 20, w: 888, h: 520};
const SIG_PAT = {x: 274, y: 24, size: 340};
const sigPt = (x: number, y: number) => ({x: SIG_PAT.x + (x * SIG_PAT.size) / 400, y: SIG_PAT.y + (y * SIG_PAT.size) / 400});
export const Signes: React.FC = () => {
	const frame = useCurrentFrame();
	const PAT = at('signes', 'patient');
	const ESS = at('signes', 'essoufflé');
	const LEV = at('signes', 'lèvres');
	const ONG = at('signes', 'ongles');
	const BLEU = at('signes', 'bleutés');
	const CYA = at('signes', 'cyanose');
	const AGI = at('signes', 'agité');
	const CONF = at('signes', 'confus');
	const CHIF = at('signes', 'chiffre');
	const REG2 = at('signes', 'regarde', 2);
	const TOUJ = at('signes', 'toujours');
	const chest = sigPt(200, 300);
	const mouth = sigPt(200, 150);
	const front: CamKey[] = [
		{at: ESS - 2, s: 1.5, x: chest.x, y: chest.y - 40, dur: 14},
		{at: LEV - 2, s: 2.8, x: mouth.x, y: mouth.y, dur: 12},
		{at: CYA - 6, s: 1.25, x: chest.x, y: chest.y - 60, dur: 1},
		{at: AGI - 4, s: 1.25, x: chest.x, y: chest.y - 80, dur: 12},
		{at: REG2 - 4, s: 1, dur: 16},
	];
	const finger = {x: 54 + (618 * 780) / 900, y: (378 * 780) / 900};
	const fingerKeys: CamKey[] = [{at: 0, s: 1.8, x: finger.x - 40, y: finger.y + 40, dur: 1}];
	const fingerO = fadeIn(frame, ONG - 4) * (1 - fadeIn(frame, CYA - 6));
	const cyan = interpolate(frame, [BLEU - 6, BLEU + 8], [0, 1], clamp);
	const breathe = frame < CHIF ? 0.5 - 0.5 * Math.cos((frame / 14) * Math.PI * 2) : idle(frame);
	const shake = frame >= AGI && frame < CONF + 20 ? Math.sin(frame * 1.6) * 6 : 0;
	const look = interpolate(frame, [REG2, REG2 + 12], [0, 1], ease);
	const chif = frame >= CHIF - 4 && frame < REG2 + 6;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ESS + 1, LEV + 1, BLEU + 1, CYA + 1, AGI + 1, CHIF + 1, TOUJ + 1]} shakes={[AGI + 2]}>
				<Head kicker="Les signes" kAt={PAT - 4} title="Et le *patient* ?" tAt={PAT} />
				<Stage y={LAY.stageY} h={560} at={PAT + 2} bumps={[ESS, CYA, TOUJ]}>
					<Layer o={1 - fingerO}>
						<ZoomCam keys={front} {...SIG_WIN}>
							<div style={{position: 'absolute', left: SIG_PAT.x, top: SIG_PAT.y, transform: `translateX(${shake}px) rotate(${shake * 0.4}deg)`}}>
								<Patient size={SIG_PAT.size} mood="mal" breath={breathe} lungs={interpolate(frame, [ESS - 4, ESS + 4, LEV - 4, LEV + 2], [0, 1, 1, 0], clamp)} cyanosis={interpolate(frame, [LEV, LEV + 10], [0, 1], clamp)} pale={0.35} dizzy={fadeIn(frame, CONF - 4)} sweat={fadeIn(frame, AGI)} />
							</div>
							{look > 0 ? (
								<svg width={888} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
									<ellipse cx={sigPt(200, 220).x} cy={sigPt(200, 220).y} rx={250} ry={240} fill="none" stroke={LPI.blue} strokeWidth={12} strokeDasharray="26 16" strokeDashoffset={frame * 3} opacity={look} />
								</svg>
							) : null}
						</ZoomCam>
					</Layer>
					<Layer o={fingerO}>
						<ZoomCam keys={fingerKeys} {...SIG_WIN}>
							<div style={{position: 'absolute', left: 54, top: 0}}>
								<PulseOx value={0} width={780} clip={0} cyan={cyan} cold={0.4} />
							</div>
						</ZoomCam>
					</Layer>
					{chif ? (
						<div style={{position: 'absolute', left: 620, top: 40, transform: `scale(${popAt(frame, CHIF - 4)})`, transformOrigin: 'right top'}}>
							<div style={{position: 'relative', padding: '14px 26px', borderRadius: 30, background: N, display: 'flex', alignItems: 'baseline', gap: 8, boxShadow: SHADOW}}>
								<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: LPI.sky}}>SpO₂</span>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: LPI.paper, lineHeight: 1}}>96</span>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: LPI.sky}}>%</span>
								<svg width={60} height={60} viewBox="0 0 60 60" style={{position: 'absolute', right: -24, top: -24}}>
									<circle cx={30} cy={30} r={26} fill={LPI.pink} stroke={LPI.paper} strokeWidth={5} />
									<path d="M20 30 H40" stroke={N} strokeWidth={7} strokeLinecap="round" />
								</svg>
							</div>
							<div style={{marginTop: 10, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>pas que le chiffre</div>
						</div>
					) : null}
				</Stage>
				<Stamp at={TOUJ} x={540} y={LAY.stageY + 500} text="On regarde le patient !" size={50} rot={-4} />
				<TermSlam
					index={0}
					at={CYA}
					term="Cyanose"
					meaning="lèvres et ongles bleutés (manque d'oxygène)"
					sign="alert"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= CYA}
				/>
				<div style={{position: 'absolute', left: 72, top: 1200}}>
					<CauseChip at={ESS} icon={<LungsPicto size={56} />} label="essoufflé" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1316}}>
					<CauseChip at={BLEU} icon={<CyanosisIcon size={56} />} label="lèvres, ongles bleutés" tone={LPI.blue} />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1200}}>
					<CauseChip at={AGI} icon={<DizzyIcon size={56} />} label={frame >= CONF ? 'agité ou confus' : 'agité'} />
				</div>
				<Burst at={TOUJ} x={540} y={LAY.stageY + 300} r={360} n={14} />
			</Camera>
			<Sfx name="pop" at={ESS} volume={0.1} />
			<Sfx name="whoosh" at={LEV - 2} volume={0.06} />
			<Sfx name="pop" at={BLEU} volume={0.1} />
			<Sfx name="impact" at={CYA} volume={0.08} />
			<Sfx name="pop" at={AGI} volume={0.1} />
			<Sfx name="pop" at={CHIF - 4} volume={0.09} />
			<Sfx name="stamp" at={TOUJ} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="La *SpO₂*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'urgence') + 16}
		rows={[
			[at('outro', "l'hémoglobine"), 'device', 'SpO₂', "% d'hémoglobine chargée en O₂"],
			[at('outro', 'doigt'), 'device', 'Au bout du doigt', 'saturomètre · sans vernis · main chaude'],
			[at('outro', 'normale'), 'check', 'Normale', '95 – 100 % (BPCO : 88 – 92 %)'],
			[at('outro', 'désaturation'), 'down', 'Désaturation', '< 95 %'],
			[at('outro', 'hypoxémie'), 'empty', 'Hypoxémie', '< 90 % · urgence'],
		]}
	/>
);
