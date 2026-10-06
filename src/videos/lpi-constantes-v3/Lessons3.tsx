import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Lesson3, StatePill} from '../../brand/Lesson3';
import {Sign} from '../../brand/learn';
import {Odometer} from '../../brand/motion3';
import {Artery, Heart, Lungs, Oximeter, Rbc, SnowPicto, Thermometer} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp, useSoft} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

const Unit: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 58}) => (
	<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: size, color: LPI.blue, marginLeft: 12}}>{children}</span>
);

/** Battements à partir d'une suite de segments [frame de début, période en frames | liste de périodes]. */
const beatSchedule = (segments: [number, number | number[]][], start: number, end: number) => {
	const beats: number[] = [];
	let f = start;
	let k = 0;
	while (f < end) {
		beats.push(f);
		let seg = segments[0];
		for (const s of segments) if (f >= s[0]) seg = s;
		const p = seg[1];
		f += Array.isArray(p) ? p[k++ % p.length] : p;
	}
	return beats;
};

/** Phase respiratoire intégrée (le rythme change sans à-coup). */
const breathPhase = (frame: number, segments: [number, number][]) => {
	let ph = 0;
	for (let f = 0; f < frame; f++) {
		let p = segments[0][1];
		for (const s of segments) if (f >= s[0]) p = s[1];
		ph += 1 / p;
	}
	return ph;
};

const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);

/* ═══════════════════════════ 1 — TEMPÉRATURE ═══════════════════════════ */

/** Ondes de chaleur (rose) qui montent. */
const HeatWaves: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{[70, 310, 345].map((x0, k) => {
				const pts = Array.from({length: 30}, (_, i) => {
					const y = 420 - i * 12;
					const x = x0 + 12 * Math.sin((y + frame * 7 + k * 40) / 26);
					return `${x},${y}`;
				}).join(' ');
				return (
					<polyline
						key={k}
						points={pts}
						fill="none"
						stroke={LPI.pink}
						strokeWidth={9}
						strokeLinecap="round"
						strokeDasharray="60 40"
						strokeDashoffset={-frame * 6}
						opacity={on * 0.9}
					/>
				);
			})}
		</svg>
	);
};

/** Flocons qui tombent. */
const Snowfall: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<>
			{Array.from({length: 9}, (_, i) => {
				const x = 40 + random(`sx${i}`) * 850;
				const y = ((frame * (2.4 + random(`sv${i}`) * 1.6) + random(`sy${i}`) * 560) % 580) - 40;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							opacity: on * 0.85,
							transform: `rotate(${frame * 2 + i * 30}deg) scale(${0.6 + random(`ss${i}`) * 0.5})`,
						}}
					>
						<SnowPicto size={48} />
					</div>
				);
			})}
		</>
	);
};

export const Temperature: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('temp', 'un');
	const T = at('temp', 'température');
	const D = at('temp', 'évalue');
	const FIEVRE = at('temp', 'fièvre');
	const FEB = at('temp', 'fébrile');
	const PAS = at('temp', 'pas');
	const APY = at('temp', 'apyrétique');
	const BASSE = at('temp', 'basse');
	const HYP = at('temp', 'hypothermie');
	const value = interpolate(
		frame,
		[N + 20, N + 46, FIEVRE - 2, FIEVRE + 18, PAS - 2, PAS + 16, BASSE - 4, BASSE + 14],
		[35.4, 36.7, 36.7, 39.2, 39.2, 36.8, 36.8, 35.0],
		ease,
	);
	const hot = interpolate(frame, [FIEVRE + 4, FIEVRE + 14, PAS, PAS + 8], [0, 1, 1, 0], clamp);
	const cold = interpolate(frame, [BASSE, BASSE + 10], [0, 1], clamp);
	const hotFill = interpolate(frame, [FIEVRE + 2, FIEVRE + 18, PAS, PAS + 14], [0, 1, 1, 0], clamp);
	const coldFill = interpolate(frame, [BASSE, BASSE + 14], [0, 1], clamp);
	const num = useSoft(N + 24, true);
	return (
		<Lesson3
			n={1}
			nAt={N}
			title={['La', 'température']}
			titleAt={T}
			definition="Évalue l'état thermique du patient"
			defAt={D}
			layers={[
				{color: PINK, level: hotFill},
				{color: COLD, level: coldFill},
			]}
			punches={[FIEVRE + 6, BASSE + 4]}
			mascot={[
				[D, 'situations/explique'],
				[FEB, 'expressions/surprise'],
				[APY, 'gestes/ok'],
				[HYP, 'gestes/attention'],
			]}
			terms={[
				{at: FEB, term: 'Fébrile', meaning: 'le patient a de la fièvre', sign: 'up'},
				{at: APY, term: 'Apyrétique', meaning: "le patient n'a pas de fièvre", sign: 'check'},
				{at: HYP, term: 'Hypothermie', meaning: 'température trop basse', sign: 'down'},
			]}
			stage={
				<>
					<HeatWaves on={hot} />
					<Snowfall on={cold} />
					<div style={{position: 'absolute', left: 130, top: 26}}>
						<Thermometer value={value} height={480} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 380,
							top: 120,
							display: 'flex',
							alignItems: 'baseline',
							opacity: Math.min(1, num * 1.5),
							transform: `translateY(${(1 - num) * 30}px)`,
						}}
					>
						<Odometer value={value} decimals={1} places={2} size={170} />
						<Unit>°C</Unit>
					</div>
					<StatePill
						x={390}
						y={340}
						states={[
							{at: FIEVRE, kind: 'up', label: 'fièvre'},
							{at: PAS, kind: 'check', label: 'pas de fièvre'},
							{at: BASSE, kind: 'down', label: 'trop basse'},
						]}
					/>
				</>
			}
		/>
	);
};

/* ═══════════════════════ 2 — FRÉQUENCE CARDIAQUE ═══════════════════════ */
const PulseTrace: React.FC<{beats: number[]; width: number}> = ({beats, width}) => {
	const frame = useCurrentFrame();
	const speed = 9;
	const spawn = width * 0.9;
	const pts = Array.from({length: Math.ceil(width / 6) + 1}, (_, i) => {
		const x = i * 6;
		let y = 0;
		for (const b of beats) {
			if (b > frame) break;
			const bx = spawn - (frame - b) * speed;
			const d = x - bx;
			y += -56 * Math.exp(-((d / 15) ** 2)) + 16 * Math.exp(-(((d - 30) / 13) ** 2));
		}
		return `${x},${60 + y}`;
	}).join(' ');
	const head = pts.split(' ').map((p) => p.split(',').map(Number))[Math.round(spawn / 6)];
	return (
		<svg width={width} height={110} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="lpi-trace" x1="0" x2="1">
					<stop offset="0" stopColor={LPI.blue} stopOpacity="0" />
					<stop offset="0.25" stopColor={LPI.blue} stopOpacity="1" />
				</linearGradient>
			</defs>
			<polyline points={pts} fill="none" stroke="url(#lpi-trace)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={head[0]} cy={head[1]} r={11} fill={LPI.pink} stroke={LPI.navy} strokeWidth={4} />
		</svg>
	);
};

export const Cardiaque: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('fc', 'deux');
	const T = at('fc', 'fréquence');
	const D = at('fc', 'nombre');
	const TA = at('fc', 'tachycardie');
	const BR = at('fc', 'bradycardie');
	const AR = at('fc', 'arythmie');
	const RAP = at('fc', 'rapide');
	const LEN = at('fc', 'lente');
	const IRR = at('fc', 'irrégulier');
	const beats = beatSchedule(
		[
			[0, 25],
			[RAP, 13],
			[LEN, 42],
			[IRR, [13, 31, 17, 38, 12, 27, 21, 34]],
		],
		N + 22,
		700,
	);
	let last = -999;
	let idx = 0;
	beats.forEach((b, i) => {
		if (b <= frame) {
			last = b;
			idx = i;
		}
	});
	const beat = last < 0 ? 0 : Math.exp(-(frame - last) / 4);
	const irregular = [64, 108, 57, 96, 71, 104, 60, 92];
	const base = interpolate(frame, [N + 22, N + 46, RAP - 2, RAP + 14, LEN - 2, LEN + 14], [0, 72, 72, 128, 128, 45], ease);
	let bpm = base;
	if (frame >= IRR) {
		const prev = idx > 0 ? irregular[(idx - 1) % irregular.length] : 45;
		bpm = interpolate(frame, [last, last + 6], [prev, irregular[idx % irregular.length]], ease);
	}
	const num = useSoft(N + 24, true);
	const fast = interpolate(frame, [RAP, RAP + 14, LEN, LEN + 14], [0, 1, 1, 0], clamp);
	return (
		<>
			<Lesson3
				n={2}
				nAt={N}
				title={['Fréquence', 'cardiaque']}
				titleAt={T}
				definition="Nombre de battements du cœur par minute"
				defAt={D}
				layers={[{color: PINK, level: fast}]}
				punches={[RAP + 4]}
				mascot={[
					[D, 'accessoires/stethoscope'],
					[TA, 'expressions/surprise'],
					[BR, 'expressions/fatiguee'],
					[AR, 'expressions/questionnement'],
				]}
				terms={[
					{at: TA, term: 'Tachycardie', meaning: 'le cœur bat trop vite', sign: 'up'},
					{at: BR, term: 'Bradycardie', meaning: 'le cœur bat trop lentement', sign: 'down'},
					{at: AR, term: 'Arythmie', meaning: 'le rythme est irrégulier', sign: 'wave'},
				]}
				stage={
					<>
						<div style={{position: 'absolute', left: 40, top: 30, transform: `rotate(${Math.sin(frame / 3) * 3 * fast}deg)`}}>
							<Heart size={330} beat={beat} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 420,
								top: 90,
								display: 'flex',
								alignItems: 'baseline',
								opacity: Math.min(1, num * 1.5),
								transform: `translateY(${(1 - num) * 30}px) scale(${1 + 0.04 * beat})`,
								transformOrigin: 'left center',
							}}
						>
							<Odometer value={bpm} places={3} size={170} color={fast > 0.5 ? LPI.blue : LPI.navy} />
							<Unit>bpm</Unit>
						</div>
						<StatePill
							x={430}
							y={290}
							states={[
								{at: RAP, kind: 'up', label: 'trop rapide'},
								{at: LEN, kind: 'down', label: 'trop lente'},
								{at: IRR, kind: 'wave', label: 'rythme irrégulier'},
							]}
						/>
						<div style={{position: 'absolute', left: 0, top: 400}}>
							<PulseTrace beats={beats} width={936} />
						</div>
					</>
				}
			/>
			{beats
				.filter((b) => b >= N + 22)
				.map((b) => (
					<Sfx key={b} name="heartbeat" at={b} volume={0.1} />
				))}
		</>
	);
};

/* ═══════════════════════ 3 — FRÉQUENCE RESPIRATOIRE ═══════════════════════ */

/** Particules d'air qui entrent (inspiration) ou sortent (expiration) par la trachée. */
const Air: React.FC<{q: number; inspiring: boolean; amp: number; x: number; y0: number; y1: number}> = ({q, inspiring, amp, x, y0, y1}) => (
	<svg width={120} height={y1 - y0 + 40} style={{position: 'absolute', left: x - 60, top: y0 - 20, overflow: 'visible'}}>
		{Array.from({length: 5}, (_, i) => {
			const p = (q + i / 5) % 1;
			const t = inspiring ? p : 1 - p;
			const py = 20 + t * (y1 - y0);
			const px = 60 + Math.sin(p * 7 + i) * 10 * (1 - t);
			return <circle key={i} cx={px} cy={py} r={9 - 3 * t} fill={LPI.blue} opacity={amp * Math.sin(p * Math.PI) * 0.9} />;
		})}
	</svg>
);

export const Respiratoire: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('fr', 'trois');
	const T = at('fr', 'fréquence');
	const D = at('fr', 'nombre');
	const TA = at('fr', 'tachypnée');
	const BR = at('fr', 'bradypnée');
	const DY = at('fr', 'dyspnée');
	const RAP = at('fr', 'rapide');
	const LEN = at('fr', 'lente');
	const MAL = at('fr', 'mal');
	const segments: [number, number][] = [
		[0, 84],
		[RAP, 30],
		[LEN, 140],
		[MAL, 40],
	];
	const ph = breathPhase(frame, segments);
	const phase = ph % 1;
	const amp = frame >= MAL ? 0.45 + 0.25 * Math.sin(frame / 7) : 1;
	const breath = (0.5 - 0.5 * Math.cos(phase * Math.PI * 2)) * amp;
	const inspiring = phase < 0.5;
	const q = inspiring ? phase / 0.5 : (phase - 0.5) / 0.5;
	const num = useSoft(N + 24, true);
	const rate = interpolate(frame, [N + 22, N + 46, RAP - 2, RAP + 14, LEN - 2, LEN + 14], [0, 16, 16, 28, 28, 8], ease);
	const dys = interpolate(frame, [MAL, MAL + 14], [0, 1], clamp);
	const alertPop = useSoft(MAL, true);
	const fast = interpolate(frame, [RAP, RAP + 14, LEN, LEN + 14], [0, 1, 1, 0], clamp);
	return (
		<Lesson3
			n={3}
			nAt={N}
			title={['Fréquence', 'respiratoire']}
			titleAt={T}
			definition="Nombre de respirations par minute"
			defAt={D}
			layers={[{color: PINK, level: Math.min(1, fast + dys)}]}
			punches={[RAP + 4, MAL + 4]}
			mascot={[
				[D, 'situations/donne-conseil'],
				[TA, 'expressions/stressee'],
				[BR, 'expressions/fatiguee'],
				[DY, 'gestes/attention'],
			]}
			terms={[
				{at: TA, term: 'Tachypnée', meaning: 'respiration trop rapide', sign: 'up'},
				{at: BR, term: 'Bradypnée', meaning: 'respiration trop lente', sign: 'down'},
				{at: DY, term: 'Dyspnée', meaning: 'difficulté à respirer', sign: 'alert'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 30, top: 70}}>
						<Lungs breath={breath} inspiring={inspiring} q={q} size={420} />
					</div>
					<Air q={q} inspiring={inspiring} amp={amp} x={30 + 210} y0={50} y1={190} />
					<div
						style={{
							position: 'absolute',
							left: 500,
							top: 110,
							display: 'flex',
							alignItems: 'baseline',
							opacity: Math.min(1, num * 1.5) * (1 - dys),
							transform: `translateY(${(1 - num) * 30}px) scale(${1 - 0.2 * dys})`,
						}}
					>
						<Odometer value={rate} places={2} size={170} color={fast > 0.5 ? LPI.blue : LPI.navy} />
						<Unit>/ min</Unit>
					</div>
					<div
						style={{
							position: 'absolute',
							left: 560,
							top: 90,
							opacity: dys,
							transform: `scale(${0.4 + 0.6 * alertPop}) rotate(${Math.sin(frame / 2.5) * 4 * dys}deg)`,
						}}
					>
						<Sign kind="alert" size={180} />
					</div>
					<StatePill
						x={500}
						y={320}
						states={[
							{at: RAP, kind: 'up', label: 'trop rapide'},
							{at: LEN, kind: 'down', label: 'trop lente'},
							{at: MAL, kind: 'alert', label: 'du mal à respirer'},
						]}
					/>
				</>
			}
		/>
	);
};

/* ═══════════════════════ 4 — PRESSION ARTÉRIELLE ═══════════════════════ */

/** Manomètre du tensiomètre (0 → 300 mmHg). */
const Manometer: React.FC<{value: number; size?: number; tone?: string | null}> = ({value, size = 250, tone}) => {
	const a = interpolate(value, [0, 300], [-135, 135]);
	return (
		<svg width={size} height={size} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
			<circle r={92} fill={LPI.paper} stroke={LPI.navy} strokeWidth={8} />
			<circle r={80} fill={tone ? alpha(tone, 0.5) : alpha(LPI.sky, 0.45)} />
			{Array.from({length: 31}, (_, i) => {
				const ang = ((-135 + i * 9) * Math.PI) / 180;
				const big = i % 5 === 0;
				const r0 = big ? 58 : 66;
				return (
					<line
						key={i}
						x1={Math.sin(ang) * r0}
						y1={-Math.cos(ang) * r0}
						x2={Math.sin(ang) * 76}
						y2={-Math.cos(ang) * 76}
						stroke={LPI.navy}
						strokeWidth={big ? 5 : 3}
						strokeLinecap="round"
						opacity={big ? 0.9 : 0.5}
					/>
				);
			})}
			<text y={44} textAnchor="middle" fontFamily={FONT.body} fontWeight={800} fontSize={17} fill={alpha(LPI.navy, 0.6)}>
				mmHg
			</text>
			<g transform={`rotate(${a})`}>
				<path d="M-6 10 L0 -70 L6 10 Z" fill={LPI.navy} />
			</g>
			<circle r={13} fill={LPI.blue} stroke={LPI.navy} strokeWidth={4} />
		</svg>
	);
};

export const Pression: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('pa', 'quatre');
	const T = at('pa', 'pression');
	const D = at('pa', 'pression', 2);
	const W = at('pa', 'paroi');
	const SYS = at('pa', 'systolique');
	const DIA = at('pa', 'diastolique');
	const HTA = at('pa', "l'hypertension");
	const HYPO = at('pa', "l'hypotension");
	const HAUTE = at('pa', 'haute');
	const BASSE = at('pa', 'basse');
	const k = [HAUTE - 4, HAUTE + 12, BASSE - 4, BASSE + 12];
	const intro = interpolate(frame, [N + 22, N + 48], [0, 1], ease);
	const sys = interpolate(frame, k, [120, 165, 165, 85], ease) * intro;
	const dia = interpolate(frame, k, [80, 100, 100, 50], ease) * intro;
	const strength = interpolate(frame, k, [1, 1.8, 1.8, 0.45], ease);
	const hiSys = frame >= SYS && frame < DIA;
	const hiDia = frame >= DIA && frame < HAUTE;
	const tone = frame >= BASSE ? LPI.sky : frame >= HAUTE ? LPI.pink : null;
	const high = interpolate(frame, [HAUTE, HAUTE + 14, BASSE, BASSE + 14], [0, 1, 1, 0], clamp);
	const low = interpolate(frame, [BASSE, BASSE + 14], [0, 1], clamp);
	const arrows = interpolate(frame, [W, W + 10], [0, 1], clamp);
	// aiguille : verrouillée sur le chiffre expliqué, sinon elle oscille entre les deux (pouls)
	const pulse = Math.exp(-(frame % 25) / 5);
	const needle = hiSys ? sys : hiDia ? dia : dia + (sys - dia) * pulse;
	const num = useSoft(N + 24, true);
	const cell = (v: number, hi: boolean, label: string) => (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					borderRadius: 26,
					padding: '0 14px',
					background: tone ? alpha(tone, 0.6) : hi ? LPI.sky : 'transparent',
					transform: `scale(${hi ? 1.08 : 1})`,
				}}
			>
				<Odometer value={v} places={3} size={118} color={hi ? LPI.blue : LPI.navy} />
			</div>
			<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: hi ? LPI.blue : alpha(LPI.navy, 0.55), marginTop: 4}}>
				{label}
			</div>
		</div>
	);
	return (
		<Lesson3
			n={4}
			nAt={N}
			title={['Pression', 'artérielle']}
			titleAt={T}
			definition="Pression du sang sur la paroi des artères"
			defAt={D}
			stageH={520}
			slotTop={1026}
			layers={[
				{color: PINK, level: high},
				{color: COLD, level: low},
			]}
			punches={[HAUTE + 4, BASSE + 4]}
			mascot={[
				[D, 'accessoires/tensiometre'],
				[SYS, 'gestes/important'],
				[DIA, 'gestes/facile'],
				[HTA, 'expressions/en-colere'],
				[HYPO, 'expressions/decue'],
			]}
			terms={[
				{at: SYS, term: 'Systolique (PAS)', meaning: '1er chiffre : le cœur se contracte', sign: 'squeeze'},
				{at: DIA, term: 'Diastolique (PAD)', meaning: '2e chiffre : le cœur se relâche', sign: 'relax'},
				{at: HTA, term: 'Hypertension', meaning: '(HTA) pression trop haute', sign: 'up'},
				{at: HYPO, term: 'Hypotension', meaning: 'pression trop basse', sign: 'down'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 0, top: 6, transform: 'scale(0.78)', transformOrigin: 'top left'}}>
						<Artery width={1200} arrows={arrows} strength={strength} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 252,
							opacity: Math.min(1, num * 1.5),
							transform: `scale(${0.6 + 0.4 * num})`,
						}}
					>
						<Manometer value={needle} size={250} tone={tone} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 320,
							top: 280,
							display: 'flex',
							alignItems: 'flex-start',
							gap: 6,
							opacity: Math.min(1, num * 1.5),
							transform: `translateY(${(1 - num) * 30}px)`,
						}}
					>
						{cell(sys, hiSys, 'PAS')}
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: LPI.navy, lineHeight: 1.1}}>/</div>
						{cell(dia, hiDia, 'PAD')}
					</div>
				</>
			}
		/>
	);
};

/* ═══════════════════════ 5 — SATURATION (SpO2) ═══════════════════════ */

/** Globules rouges qui circulent ; chacun porte (ou non) son oxygène. */
const BloodLane: React.FC<{o2: (i: number) => number; show: number}> = ({o2, show}) => {
	const frame = useCurrentFrame();
	const n = 8;
	const L = 936 + 120;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 350,
				width: 936,
				height: 170,
				borderRadius: 85,
				background: alpha(LPI.pink, 0.28),
				border: `5px solid ${alpha(LPI.pink, 0.8)}`,
				overflow: 'hidden',
				opacity: show,
				transform: `scaleX(${0.6 + 0.4 * show})`,
			}}
		>
			{Array.from({length: n}, (_, i) => {
				const x = ((i * L) / n + frame * 3.2) % L - 60;
				const y = 85 + Math.sin(frame / 14 + i * 1.7) * 18;
				return (
					<div key={i} style={{position: 'absolute', left: x - 50, top: y - 50}}>
						<Rbc size={100} o2={o2(i)} />
					</div>
				);
			})}
		</div>
	);
};

export const Saturation: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('spo2', 'cinq');
	const T = at('spo2', 'saturation');
	const OXY = at('spo2', 'oxymètre');
	const D = at('spo2', 'pourcentage');
	const HEMO = at('spo2', "d'hémoglobine");
	const DES = at('spo2', 'désaturation');
	const CHUTE = at('spo2', 'chute');
	const HYPX = at('spo2', 'hypoxémie');
	const MANQUE = at('spo2', 'manque');
	const value = interpolate(frame, [N + 40, N + 66, CHUTE - 4, CHUTE + 16], [70, 98, 98, 86], ease);
	const alertV = interpolate(frame, [CHUTE, CHUTE + 14], [0, 1], clamp);
	const focus = frame >= OXY && frame < DES ? interpolate(frame, [OXY, OXY + 6], [0, 1], clamp) : 0;
	const enter = useSoft(N + 20);
	const clip = useSoft(N + 32, true);
	const on = interpolate(frame, [N + 38, N + 44], [0, 1], clamp);
	const lane = useSoft(D - 6);
	const o2 = (i: number) => {
		const fill = interpolate(frame, [HEMO + i * 2, HEMO + i * 2 + 8], [0, 1], clamp);
		const lost1 = [1, 5].includes(i) ? interpolate(frame, [CHUTE + i, CHUTE + i + 10], [0, 1], clamp) : 0;
		const lost2 = [0, 3, 6].includes(i) ? interpolate(frame, [MANQUE + i, MANQUE + i + 10], [0, 1], clamp) : 0;
		return fill * (1 - Math.max(lost1, lost2));
	};
	return (
		<Lesson3
			n={5}
			nAt={N}
			title={['Saturation en', 'oxygène']}
			titleAt={T}
			definition={
				<>
					<span style={{color: LPI.blue, fontWeight: 800}}>
						SpO
						<Sub2 />
					</span>{' '}
					: % d'hémoglobine qui transporte l'oxygène
				</>
			}
			defAt={D}
			layers={[{color: PINK, level: alertV}]}
			punches={[OXY + 2, CHUTE + 4]}
			mascot={[
				[T, 'situations/cherche-info'],
				[OXY, 'gestes/regardez'],
				[DES, 'expressions/surprise'],
				[HYPX, 'gestes/probleme'],
			]}
			terms={[
				{
					at: OXY,
					term: 'Oxymètre de pouls',
					meaning: (
						<>
							l'appareil qui mesure la SpO
							<Sub2 />
						</>
					),
					sign: 'device',
				},
				{
					at: DES,
					term: 'Désaturation',
					meaning: (
						<>
							la SpO
							<Sub2 /> chute
						</>
					),
					sign: 'down',
				},
				{at: HYPX, term: 'Hypoxémie', meaning: "manque d'oxygène dans le sang", sign: 'empty'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 40, top: 14, transform: 'scale(0.98)', transformOrigin: 'top left'}}>
						<Oximeter on={on} value={value} enter={enter} clip={clip} alert={alertV} focus={focus} />
					</div>
					<BloodLane o2={o2} show={lane} />
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 300,
							fontFamily: FONT.body,
							fontWeight: 800,
							fontSize: 28,
							color: alpha(LPI.navy, 0.7),
							opacity: lane,
						}}
					>
						hémoglobine + O<Sub2 />
					</div>
				</>
			}
		/>
	);
};

