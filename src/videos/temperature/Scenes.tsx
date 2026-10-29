// Scènes de « La température corporelle » : une notion = une scène, chaque mouvement part d'un mot de la voix.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Chest} from '../../brand/breath';
import {BigNum, CauseChip, Head, LAY, RecapScene, SLAM_Y, termSlot} from '../../brand/episode';
import {FlushIcon, PaleIcon, ShiverIcon, SweatIcon} from '../../brand/icons';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {Sfx} from '../../brand/Sfx';
import {HeatWaves, Snowfall, TEMP_ZONES, TempGauge, ThermoReadout} from '../../brand/thermo';
import {Thermometer} from '../../brand/pictos';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);
/** respiration lente du buste (il vit, sans attirer l'œil) */
const idle = (frame: number) => 0.25 - 0.25 * Math.cos(frame / 18);

/** Valeur qui roule d'un palier à l'autre : [[frame, valeur], …]. */
const steps = (frame: number, keys: [number, number][]) =>
	interpolate(
		frame,
		keys.flatMap(([t], i) => (i === 0 ? [t] : [t, t + Math.min(16, (keys[i + 1]?.[0] ?? t + 99) - t - 1)])),
		keys.flatMap(([, v], i) => (i === 0 ? [v] : [keys[i - 1][1], v])),
		ease,
	);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const Q = at('intro', 'quoi');
	const T = at('intro', 'température');
	const pop = usePop(2);
	const qp = usePop(Q);
	const value = interpolate(frame, [4, 54], [35, 37], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q + 1, T + 1]} shakes={[Q + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
					<Title at={0} text="C'est quoi la" size={74} stagger={3} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
					<Title at={T} text={'*température*\n*corporelle* ?'} size={112} stagger={4} />
				</div>
				{/* halo chaud derrière le réservoir */}
				<div style={{position: 'absolute', left: 333 - 160, top: 988 - 160, width: 320, height: 320, borderRadius: 160, background: `radial-gradient(circle, ${alpha(LPI.pink, 0.45)}, ${alpha(LPI.pink, 0)} 70%)`, opacity: pop, transform: `scale(${0.9 + 0.1 * Math.sin(frame / 7)})`}} />
				<div style={{position: 'absolute', left: 265, top: 600, opacity: Math.min(1, pop * 1.5), transform: `scale(${0.4 + 0.6 * pop})`, transformOrigin: '68px 388px'}}>
					<ThermoReadout value={value} height={440} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1110}}>
					<TempGauge value={value} on={pop} />
				</div>
				{frame >= Q ? (
					<div
						style={{
							position: 'absolute',
							left: 800,
							top: 560,
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
				<Burst at={Q} x={885} y={645} r={200} n={12} />
			</Camera>
			<Sfx name="pop" at={Q} volume={0.12} />
			<Sfx name="whoosh" at={T} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const T = at('def', 'température');
	const CH = at('def', 'chaleur');
	const CO = at('def', 'corps');
	const TH = at('def', 'thermique');
	const PA = at('def', 'patient');
	const DEG = at('def', 'degrés');
	const CEL = at('def', 'celsius');
	const glow = useSoft(CH - 2);
	const deg = usePop(DEG);
	const cel = usePop(CEL);
	const gauge = useSoft(TH - 2);
	// la jauge balaie froid → chaud puis se pose sur la normale
	const g = interpolate(frame, [TH, TH + 14, PA + 4, PA + 18], [34.6, 40.2, 40.2, 37], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[T + 1, CH + 1, TH + 1, DEG + 1, CEL + 1]} shakes={[CEL + 2]}>
				<Head kicker="Définition" kAt={T} title="Température *corporelle*" tAt={T + 2} size={74} />
				<Stage y={LAY.stageY} h={440} at={T + 4} bumps={[CH, CEL]}>
					<div style={{position: 'absolute', left: 50, top: 40}}>
						<Thermometer value={interpolate(frame, [CH, CH + 20], [36, 37], ease)} height={360} />
					</div>
					<div style={{position: 'absolute', left: 250, top: 30, width: 380, height: 380, borderRadius: 190, background: `radial-gradient(circle, ${alpha(LPI.pink, 0.6)}, ${alpha(LPI.pink, 0)} 70%)`, opacity: glow, transform: `scale(${0.7 + 0.3 * glow + 0.04 * Math.sin(frame / 6)})`}} />
					<div style={{position: 'absolute', left: 290, top: 60}}>
						<Chest breath={idle(frame)} size={300} />
					</div>
					<HeatWaves on={glow * 0.8} height={420} xs={[300, 430, 560]} />
					{frame >= DEG ? (
						<div style={{position: 'absolute', left: 660, top: 50, width: 240, textAlign: 'center'}}>
							<div
								style={{
									width: 220,
									height: 220,
									margin: '0 auto',
									borderRadius: 110,
									background: LPI.pink,
									border: `8px solid ${LPI.paper}`,
									boxShadow: SHADOW,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontFamily: FONT.title,
									fontWeight: 900,
									fontSize: 110,
									color: N,
									transform: `scale(${deg * (1 + 0.12 * cel - 0.12 * cel * Math.min(1, (frame - CEL) / 10))})`,
								}}
							>
								°C
							</div>
							{frame >= CEL ? (
								<div style={{marginTop: 20, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, opacity: Math.min(1, cel * 2), lineHeight: 1.1}}>
									degrés
									<br />
									<span style={{color: LPI.blue}}>Celsius</span>
								</div>
							) : null}
						</div>
					) : null}
				</Stage>
				<Burst at={CEL} x={72 + 780} y={LAY.stageY + 160} r={230} n={14} />
				<div style={{position: 'absolute', left: 72, top: 920}}>
					<CheckChip at={CO - 2} label="la chaleur du corps" size={44} />
				</div>
				{frame >= TH - 2 ? (
					<div style={{position: 'absolute', left: 80, top: 1050}}>
						<Enter at={TH - 2} distance={14}>
							<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', textTransform: 'uppercase', color: alpha(N, 0.65)}}>état thermique du patient</span>
						</Enter>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1110}}>
					<TempGauge value={g} on={gauge} />
				</div>
			</Camera>
			<Sfx name="whoosh" at={CH - 2} volume={0.06} />
			<Sfx name="pop" at={CO - 2} volume={0.1} />
			<Sfx name="tick" at={TH} volume={0.08} />
			<Sfx name="pop" at={DEG} volume={0.11} />
			<Sfx name="impact" at={CEL} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · VOIES DE MESURE ═══════════════════════════════ */
const BODY = {x: 40, y: 470, size: 470};
const VOIES: [word: string, label: string, sub: string, dot: [number, number]][] = [
	['rectale', 'rectale', '(dans le rectum)', [200, 404]],
	['buccale', 'buccale', '(dans la bouche)', [200, 62]],
	['tympanique', 'tympanique', "(dans l'oreille)", [240, 46]],
	['axillaire', 'axillaire', '(sous le bras)', [80, 168]],
	['temporale', 'temporale / frontale', '(sur le front)', [200, 20]],
];
const CARD = {x: 540, y: 470, w: 468, h: 112, gap: 12};

const VoieCard: React.FC<{at: number; label: string; sub: string; hi: boolean; y: number}> = ({at: t0, label, sub, hi, y}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: CARD.x,
				top: y,
				width: CARD.w,
				height: CARD.h,
				boxSizing: 'border-box',
				borderRadius: 32,
				background: hi ? LPI.blue : LPI.paper,
				border: `5px solid ${hi ? LPI.blue : LPI.sky}`,
				boxShadow: hi ? `0 18px 44px ${alpha(LPI.blue, 0.3)}` : SHADOW,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: '0 26px',
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 140}px) scale(${hi ? 1.03 : 1})`,
			}}
		>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: hi ? LPI.paper : N, whiteSpace: 'nowrap', lineHeight: 1.1}}>{label}</div>
			<div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 27, color: hi ? alpha(LPI.paper, 0.9) : alpha(N, 0.7), whiteSpace: 'nowrap'}}>{sub}</div>
		</div>
	);
};

export const Voies: React.FC = () => {
	const frame = useCurrentFrame();
	const PR = at('voies', 'prendre');
	const PL = at('voies', 'plusieurs');
	const ts = VOIES.map(([w]) => at('voies', w));
	const FRO = at('voies', 'frontale');
	const body = useSoft(PR - 2);
	const k = BODY.size / 400;
	const active = ts.findIndex((t, i) => frame >= t && (i === ts.length - 1 || frame < ts[i + 1]));
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PL + 1, ...ts.map((t) => t + 1), FRO + 1]} shakes={[ts[0] + 2]}>
				<Head kicker="Mesure" kAt={PR - 4} title="Plusieurs *voies*" tAt={PL} />
				<div style={{position: 'absolute', left: BODY.x, top: BODY.y, opacity: Math.min(1, body * 1.5), transform: `translateY(${(1 - body) * 60}px)`}}>
					<Chest breath={idle(frame)} size={BODY.size} />
				</div>
				{/* points de mesure sur le buste + trait vers la carte active */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{VOIES.map(([w, , , [dx, dy]], i) => {
						if (frame < ts[i] - 2) return null;
						const x = BODY.x + dx * k;
						const y = BODY.y + dy * k;
						const hi = i === active;
						const p = Math.min(1, (frame - ts[i] + 2) / 6);
						const cy = CARD.y + i * (CARD.h + CARD.gap) + CARD.h / 2;
						return (
							<g key={w}>
								{hi ? <path d={`M${x} ${y} L${CARD.x - 10} ${cy}`} stroke={LPI.blue} strokeWidth={5} strokeDasharray="12 10" strokeDashoffset={-frame * 2} opacity={p} /> : null}
								{hi ? <circle cx={x} cy={y} r={20 + 14 * ((frame % 20) / 20)} fill="none" stroke={LPI.pink} strokeWidth={5} opacity={1 - (frame % 20) / 20} /> : null}
								<circle cx={x} cy={y} r={(hi ? 18 : 12) * p} fill={hi ? LPI.pink : LPI.blue} stroke={LPI.paper} strokeWidth={5} />
							</g>
						);
					})}
				</svg>
				{VOIES.map(([w, label, sub], i) => (
					<VoieCard key={w} at={ts[i] - 2} label={label} sub={sub} hi={i === active} y={CARD.y + i * (CARD.h + CARD.gap)} />
				))}
			</Camera>
			<Sfx name="whoosh" at={PR - 2} volume={0.06} />
			{ts.map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.1} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const NORM = at('norme', 'normale');
	const S1 = at('norme', '36,5');
	const S2 = at('norme', '37,5');
	const DEG = at('norme', 'degrés');
	const AP = at('norme', 'apyrétique');
	const FIE = at('norme', 'fièvre');
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S2 + 4, S2 + 24], [36.5, 37], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, NORM + 1, S1 + 1, S2 + 1, AP + 1, FIE + 1]} shakes={[S1 + 2, S2 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420}}>
					<CheckChip at={AD} label="adulte" size={40} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 550, width: 936, height: 330, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 600, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
					<BigNum at={S1} size={170}>36,5</BigNum>
					{frame >= S2 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: LPI.blue}}>–</div> : null}
					<BigNum at={S2} size={170}>37,5</BigNum>
				</div>
				{frame >= DEG ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
						<Enter at={DEG} distance={20}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>degrés Celsius</span>
						</Enter>
					</div>
				) : null}
				<Burst at={S1} x={330} y={700} r={220} n={10} />
				<Burst at={S2} x={750} y={700} r={240} n={12} />
				<NormScale zones={TEMP_ZONES} value={value} at={NORM + 4} markerAt={S2 + 4} y={940} nameSize={25} rangeSize={21} />
				<TermSlam
					index={0}
					at={AP}
					term="Apyrétique"
					meaning={
						<>
							pas de fièvre <Seuil>36,5 – 37,5 °C</Seuil>
						</>
					}
					sign="check"
					slamY={SLAM_Y}
					slot={{x: 72, y: 1150, w: 936}}
					active={frame >= AP}
				/>
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="impact" at={S1} volume={0.1} />
			<Sfx name="impact" at={S2} volume={0.1} />
			<Sfx name="ding" at={FIE} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · FÉBRICULE / 5 · HYPERTHERMIE / 6 · HYPOTHERMIE ═══════════════════════════════ */
/** Thermomètre + valeur sur le socle ; `shiver` fait trembler (grelotte, frissons). */
const ThermoStage: React.FC<{value: number; shiver?: number}> = ({value, shiver = 0}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 150, top: 40, transform: `translateX(${Math.sin(frame * 2.1) * 6 * shiver}px)`}}>
			<ThermoReadout value={value} height={400} />
		</div>
	);
};

export const Febricule: React.FC = () => {
	const frame = useCurrentFrame();
	const EN = at('febricule', 'entre');
	const S1 = at('febricule', '37,5');
	const S2 = at('febricule', '38');
	const FEB = at('febricule', 'fébricule');
	const PET = at('febricule', 'petite');
	const value = steps(frame, [
		[0, 37],
		[S1, 37.5],
		[S2, 37.8],
	]);
	const fill = interpolate(frame, [S1, S2 + 16], [0, 0.45], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EN + 1, S1 + 1, S2 + 1, FEB + 1, PET + 1]} shakes={[FEB + 2]}>
				<Head kicker="Entre 37,5 et 38" kAt={EN} title="Petite *fièvre*" tAt={EN + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={EN + 4} layers={[{color: PINK, level: fill}]} bumps={[S2, FEB]}>
					<HeatWaves on={interpolate(frame, [S2, S2 + 14], [0, 0.4], clamp)} />
					<ThermoStage value={value} />
				</Stage>
				<TermSlam
					index={0}
					at={FEB}
					term="Fébricule"
					meaning={
						<>
							petite fièvre <Seuil>37,5 – 37,9 °C</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= FEB}
				/>
				<NormScale zones={TEMP_ZONES} value={value} at={S1 - 4} markerAt={S1} y={1210} nameSize={25} rangeSize={21} />
			</Camera>
			<Sfx name="tick" at={S1} volume={0.08} />
			<Sfx name="tick" at={S2} volume={0.08} />
			<Sfx name="ding" at={PET} volume={0.07} />
		</AbsoluteFill>
	);
};

export const Hyper: React.FC = () => {
	const frame = useCurrentFrame();
	const PA = at('hyper', 'partir');
	const S38 = at('hyper', '38');
	const HY = at('hyper', 'hyperthermie');
	const FIE = at('hyper', 'fièvre');
	const FEB = at('hyper', 'fébrile');
	const VOIR = at('hyper', 'voir');
	const signs: [number, React.ReactNode, string][] = [
		[at('hyper', 'frissons'), <ShiverIcon key="f" size={56} />, 'frissons'],
		[at('hyper', 'sueurs'), <SweatIcon key="s" size={56} />, 'sueurs'],
		[at('hyper', 'visage'), <FlushIcon key="v" size={56} />, 'visage rouge'],
	];
	const value = steps(frame, [
		[0, 37.8],
		[S38, 38.4],
		[FIE, 39.2],
	]);
	const fill = interpolate(frame, [S38, FIE + 16], [0.3, 1], clamp);
	const shiver = frame >= signs[0][0] && frame < signs[1][0] ? 1 : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PA + 1, S38 + 1, HY + 1, FIE + 1, ...signs.map(([t]) => t + 1)]} shakes={[FEB + 2]}>
				<Head kicker="À partir de 38" kAt={PA - 2} title="Trop *chaud*" tAt={PA + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={PA + 2} layers={[{color: PINK, level: fill}]} bumps={[S38, FIE]}>
					<HeatWaves on={interpolate(frame, [S38, S38 + 14], [0, 1], clamp)} />
					<ThermoStage value={value} shiver={shiver} />
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hyperthermie"
					meaning={
						<>
							fièvre <Seuil>≥ 38 °C</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < VOIR}
				/>
				<Stamp at={FEB} x={790} y={LAY.stageY + 430} text="Fébrile" size={56} rot={-6} />
				{frame >= VOIR ? (
					<div style={{position: 'absolute', left: 80, top: 1186}}>
						<Enter at={VOIR} distance={14}>
							<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', textTransform: 'uppercase', color: alpha(N, 0.65)}}>on peut voir…</span>
						</Enter>
					</div>
				) : null}
				{signs.map(([t, icon, label], i) => (
					<div key={label} style={{position: 'absolute', left: i === 1 ? 560 : 72, top: 1240 + (i === 2 ? 116 : 0)}}>
						<CauseChip at={t} icon={icon} label={label} />
					</div>
				))}
			</Camera>
			<Sfx name="tick" at={S38} volume={0.08} />
			<Sfx name="stamp" at={FEB} volume={0.1} />
			{signs.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.11} />
			))}
		</AbsoluteFill>
	);
};

export const Hypo: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('hypo', 'dessous');
	const S35 = at('hypo', '35');
	const HY = at('hypo', 'hypothermie');
	const FR = at('hypo', 'froid');
	const GR = at('hypo', 'grelotte');
	const PE = at('hypo', 'peau');
	const value = steps(frame, [
		[0, 37],
		[S35, 34.6],
	]);
	const fill = interpolate(frame, [S35, S35 + 22], [0, 1], clamp);
	const shiver = frame >= GR && frame < PE ? 1 : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DES + 1, S35 + 1, HY + 1, FR + 1, GR + 1, PE + 1]} shakes={[GR + 2]}>
				<Head kicker="En dessous de 35" kAt={DES} title="Trop *froid*" tAt={DES + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={DES + 4} layers={[{color: COLD, level: fill}]} bumps={[S35, FR]}>
					<Snowfall on={interpolate(frame, [S35, S35 + 14], [0, 1], clamp)} />
					<ThermoStage value={value} shiver={shiver} />
				</Stage>
				<TermSlam
					index={0}
					at={HY}
					term="Hypothermie"
					meaning={
						<>
							corps trop froid <Seuil>&lt; 35 °C</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= HY && frame < GR}
				/>
				<div style={{position: 'absolute', left: 72, top: 1240}}>
					<CauseChip at={GR} icon={<ShiverIcon size={56} />} label="il grelotte" tone={LPI.sky} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1356}}>
					<CauseChip at={PE} icon={<PaleIcon size={56} />} label="peau froide et pâle" tone={LPI.sky} />
				</div>
			</Camera>
			<Sfx name="tick" at={S35} volume={0.08} />
			<Sfx name="pop" at={GR} volume={0.11} />
			<Sfx name="pop" at={PE} volume={0.11} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="La *température*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'hypothermie') + 18}
		rows={[
			[at('outro', 'degrés'), 'device', 'Degrés Celsius', 'la chaleur du corps'],
			[at('outro', 'voies'), 'check', 'Plusieurs voies', 'rectale, buccale…'],
			[at('outro', 'apyrétique'), 'check', 'Apyrétique', '36,5 – 37,5 °C · pas de fièvre'],
			[at('outro', 'fébricule'), 'up', 'Fébricule', '37,5 – 37,9 °C · petite fièvre'],
			[at('outro', 'hyperthermie'), 'up', 'Hyperthermie', '≥ 38 °C · patient fébrile'],
			[at('outro', 'hypothermie'), 'down', 'Hypothermie', '< 35 °C · corps trop froid'],
		]}
	/>
);
