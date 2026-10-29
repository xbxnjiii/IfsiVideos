import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Lesson3, scaleY, Seuil, StatePill} from '../../brand/Lesson3';
import {NormScale, Zone} from '../../brand/NormScale';
import {Manometer} from '../../brand/pressure';
import {Finger, Glucometer, SugarRain} from '../../brand/glyco';
import {Sign} from '../../brand/learn';
import {Odometer} from '../../brand/motion3';
import {Artery, Heart, Lungs, Oximeter, Rbc, SnowPicto, Thermometer} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp, useSoft} from '../../brand/ui';
import {usePop} from '../../brand/kit';
import {Sfx} from '../../brand/Sfx';
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

/* Normes adulte (fiche de cours) : chaque échelle = zones nommées + bornes. */
export const ZONES = {
	temp: [
		{name: 'hypothermie', range: '< 35 °C', tone: 'low', w: 1.15, lo: 33, hi: 35},
		{name: '', tone: 'gap', w: 0.42, lo: 35, hi: 36.5},
		{name: 'apyrétique', range: '36,5 – 37,5', tone: 'norm', w: 1.1, lo: 36.5, hi: 37.5},
		{name: 'fébricule', range: '37,5 – 37,9', tone: 'mid', w: 1.0, lo: 37.5, hi: 37.95},
		{name: 'hyperthermie', range: '≥ 38 °C', tone: 'high', w: 1.25, lo: 37.95, hi: 40.5},
	],
	fc: [
		{name: 'bradycardie', range: '< 60 bpm', tone: 'low', w: 1, lo: 30, hi: 60},
		{name: 'normale', range: '60 – 100 bpm', tone: 'norm', w: 1.15, lo: 60, hi: 100},
		{name: 'tachycardie', range: '≥ 100 bpm', tone: 'high', w: 1, lo: 100, hi: 150},
	],
	fr: [
		{name: 'bradypnée', range: '< 12 cycles/min', tone: 'low', w: 1, lo: 4, hi: 12},
		{name: 'normale', range: '12 – 20 cycles/min', tone: 'norm', w: 1.1, lo: 12, hi: 20},
		{name: 'tachypnée', range: '> 20 cycles/min', tone: 'high', w: 1, lo: 20, hi: 36},
	],
	pa: [
		{name: 'hypotension', range: '< 90/60', tone: 'low', w: 1, lo: 60, hi: 90},
		{name: 'normale', range: '≈ 120/80 mmHg', tone: 'norm', w: 1.15, lo: 90, hi: 140},
		{name: 'hypertension', range: '> 140/90', tone: 'high', w: 1, lo: 140, hi: 190},
	],
	spo2: [
		{name: 'hypoxémie', range: '< 90 %', tone: 'high', w: 1, lo: 80, hi: 90},
		{name: 'désaturation', range: '90 – 95 %', tone: 'mid', w: 1, lo: 90, hi: 95},
		{name: 'normale', range: '> 95 à 100 %', tone: 'norm', w: 1.1, lo: 95, hi: 100.5},
	],
	gly: [
		{name: 'hypoglycémie', range: '< 0,70 g/l', tone: 'low', w: 1, lo: 0.3, hi: 0.7},
		{name: 'normoglycémie', range: '0,70 – 1,10 g/l', tone: 'norm', w: 1.15, lo: 0.7, hi: 1.1},
		{name: 'hyperglycémie', range: '> 1,10 g/l', tone: 'high', w: 1, lo: 1.1, hi: 2},
	],
	diu: [
		{name: 'anurie', range: '< 100', tone: 'high', w: 0.95, lo: 0, hi: 100},
		{name: 'oligurie', range: '< 400', tone: 'mid', w: 1, lo: 100, hi: 400},
		{name: '', tone: 'gap', w: 0.3, lo: 400, hi: 600},
		{name: 'normodiurèse', range: '600 – 2000', tone: 'norm', w: 1.35, lo: 600, hi: 2000},
		{name: '', tone: 'gap', w: 0.3, lo: 2000, hi: 2500},
		{name: 'polyurie', range: '> 2500 à 3000', tone: 'low', w: 1.15, lo: 2500, hi: 4000},
	],
} satisfies Record<string, Zone[]>;

const VOIES = ['rectale', 'buccale', 'tympanique', 'axillaire', 'temporale / frontale'];

/** Voies de mesure de la température : la liste se construit pendant la définition. */
const Voies: React.FC<{at: number}> = ({at: t0}) => {
	const head = usePop(t0);
	return (
		<div style={{position: 'absolute', left: 628, top: 26, width: 290}}>
			<div
				style={{
					fontFamily: FONT.body,
					fontWeight: 800,
					fontSize: 19,
					letterSpacing: '0.14em',
					textTransform: 'uppercase',
					color: alpha(LPI.navy, 0.7),
					marginBottom: 10,
					opacity: Math.min(1, head * 2),
				}}
			>
				Voies de mesure
			</div>
			{VOIES.map((v, i) => (
				<Voie key={v} at={t0 + 4 + i * 5} label={v} />
			))}
		</div>
	);
};
const Voie: React.FC<{at: number; label: string}> = ({at: t0, label}) => {
	const p = usePop(t0);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				height: 50,
				marginBottom: 9,
				padding: '0 18px 0 10px',
				borderRadius: 999,
				background: LPI.paper,
				border: `3px solid ${LPI.sky}`,
				fontFamily: FONT.title,
				fontWeight: 800,
				fontSize: label.length > 12 ? 22 : 25,
				color: LPI.navy,
				whiteSpace: 'nowrap',
				width: 'fit-content',
				opacity: Math.min(1, p * 2),
				transform: `translateX(${(1 - p) * 50}px) scale(${0.7 + 0.3 * p})`,
				transformOrigin: 'left center',
			}}
		>
			<div style={{width: 14, height: 14, borderRadius: 7, background: LPI.blue}} />
			{label}
		</div>
	);
};
const COLD = alpha(LPI.sky, 0.95);

/* ═══════════════════════════ 1 — TEMPÉRATURE ═══════════════════════════ */

/** Ondes de chaleur (rose) qui montent. */
const HeatWaves: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={936} height={430} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{[70, 310, 345].map((x0, k) => {
				const pts = Array.from({length: 30}, (_, i) => {
					const y = 400 - i * 12;
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
				const y = ((frame * (2.4 + random(`sv${i}`) * 1.6) + random(`sy${i}`) * 440) % 470) - 40;
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
	const PETITE = at('temp', 'petite');
	const FEBR = at('temp', 'fébricule');
	const PAS = at('temp', 'pas');
	const APY = at('temp', 'apyrétique');
	const BASSE = at('temp', 'basse');
	const HYP = at('temp', 'hypothermie');
	const value = interpolate(
		frame,
		[N + 20, N + 46, FIEVRE - 2, FIEVRE + 18, PETITE - 2, PETITE + 14, PAS - 2, PAS + 16, BASSE - 4, BASSE + 14],
		[35.4, 36.7, 36.7, 39.2, 39.2, 37.7, 37.7, 36.8, 36.8, 34.6],
		ease,
	);
	const hot = interpolate(frame, [FIEVRE + 4, FIEVRE + 14, PETITE, PETITE + 8, PAS, PAS + 8], [0, 1, 1, 0.45, 0.45, 0], clamp);
	const cold = interpolate(frame, [BASSE, BASSE + 10], [0, 1], clamp);
	const hotFill = interpolate(frame, [FIEVRE + 2, FIEVRE + 18, PETITE, PETITE + 12, PAS, PAS + 14], [0, 1, 1, 0.5, 0.5, 0], clamp);
	const coldFill = interpolate(frame, [BASSE, BASSE + 14], [0, 1], clamp);
	const num = useSoft(N + 24, true);
	return (
		<Lesson3
			n={1}
			scale={<NormScale zones={ZONES.temp} value={value} at={D + 16} markerAt={D + 20} y={scaleY()} />}
			slotSide="left"
			shake
			nAt={N}
			title={['La', 'température']}
			titleAt={T}
			definition="Évalue l'état thermique du patient"
			defAt={D}
			layers={[
				{color: PINK, level: hotFill},
				{color: COLD, level: coldFill},
			]}
			punches={[FIEVRE + 6, PETITE + 4, BASSE + 4]}
			terms={[
				{at: FEB, term: 'Fébrile', meaning: <>fièvre, hyperthermie <Seuil>≥ 38 °C</Seuil></>, sign: 'up'},
				{at: FEBR, term: 'Fébricule', meaning: <>petite fièvre <Seuil>37,5 – 37,9 °C</Seuil></>, sign: 'up'},
				{at: APY, term: 'Apyrétique', meaning: <>pas de fièvre <Seuil>36,5 – 37,5 °C</Seuil></>, sign: 'check'},
				{at: HYP, term: 'Hypothermie', meaning: <>température trop basse <Seuil>&lt; 35 °C</Seuil></>, sign: 'down'},
			]}
			stage={
				<>
					<HeatWaves on={hot} />
					<Snowfall on={cold} />
					<div style={{position: 'absolute', left: 70, top: 12}}>
						<Thermometer value={value} height={400} />
					</div>
					<Voies at={D} />
					<div
						style={{
							position: 'absolute',
							left: 262,
							top: 70,
							display: 'flex',
							alignItems: 'baseline',
							opacity: Math.min(1, num * 1.5),
							transform: `translateY(${(1 - num) * 30}px)`,
						}}
					>
						<Odometer value={value} decimals={1} places={2} size={136} />
						<Unit size={50}>°C</Unit>
					</div>
					<StatePill
						x={272}
						y={262}
						size={32}
						states={[
							{at: FIEVRE, kind: 'up', label: 'fièvre'},
							{at: PETITE, kind: 'up', label: 'petite fièvre'},
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
				scale={<NormScale zones={ZONES.fc} value={bpm} at={D + 8} markerAt={N + 46} y={scaleY()} />}
				slotSide="right"
				shake
				nAt={N}
				title={['Fréquence', 'cardiaque']}
				titleAt={T}
				definition="Nombre de battements du cœur par minute"
				defAt={D}
				layers={[{color: PINK, level: fast}]}
				punches={[RAP + 4]}
				terms={[
					{at: TA, term: 'Tachycardie', meaning: <>le cœur bat trop vite <Seuil>≥ 100 bpm</Seuil></>, sign: 'up'},
					{at: BR, term: 'Bradycardie', meaning: <>le cœur bat trop lentement <Seuil>&lt; 60 bpm</Seuil></>, sign: 'down'},
					{at: AR, term: 'Arythmie', meaning: 'rythme (bpm) irrégulier', sign: 'wave'},
				]}
				stage={
					<>
						<div style={{position: 'absolute', left: 40, top: 14, transform: `rotate(${Math.sin(frame / 3) * 3 * fast}deg)`}}>
							<Heart size={290} beat={beat} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 400,
								top: 50,
								display: 'flex',
								alignItems: 'baseline',
								opacity: Math.min(1, num * 1.5),
								transform: `translateY(${(1 - num) * 30}px) scale(${1 + 0.04 * beat})`,
								transformOrigin: 'left center',
							}}
						>
							<Odometer value={bpm} places={3} size={150} color={fast > 0.5 ? LPI.blue : LPI.navy} />
							<Unit>bpm</Unit>
						</div>
						<StatePill
							x={410}
							y={228}
							states={[
								{at: RAP, kind: 'up', label: 'trop rapide'},
								{at: LEN, kind: 'down', label: 'trop lente'},
								{at: IRR, kind: 'wave', label: 'rythme irrégulier'},
							]}
						/>
						<div style={{position: 'absolute', left: 0, top: 318}}>
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
			scale={<NormScale zones={ZONES.fr} value={rate} at={D + 8} markerAt={N + 46} y={scaleY()} />}
			slotSide="left"
			shake
			nAt={N}
			title={['Fréquence', 'respiratoire']}
			titleAt={T}
			definition="Nombre de respirations par minute"
			defAt={D}
			layers={[{color: PINK, level: Math.min(1, fast + dys)}]}
			punches={[RAP + 4, MAL + 4]}
			terms={[
				{at: TA, term: 'Tachypnée', meaning: <>respiration trop rapide <Seuil>&gt; 20 cycles/min</Seuil></>, sign: 'up'},
				{at: BR, term: 'Bradypnée', meaning: <>respiration trop lente <Seuil>&lt; 12 cycles/min</Seuil></>, sign: 'down'},
				{at: DY, term: 'Dyspnée', meaning: 'difficulté à respirer', sign: 'alert'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 40, top: 46}}>
						<Lungs breath={breath} inspiring={inspiring} q={q} size={340} />
					</div>
					<Air q={q} inspiring={inspiring} amp={amp} x={40 + 170} y0={30} y1={142} />
					<div
						style={{
							position: 'absolute',
							left: 470,
							top: 70,
							display: 'flex',
							alignItems: 'baseline',
							opacity: Math.min(1, num * 1.5) * (1 - dys),
							transform: `translateY(${(1 - num) * 30}px) scale(${1 - 0.2 * dys})`,
						}}
					>
						<Odometer value={rate} places={2} size={150} color={fast > 0.5 ? LPI.blue : LPI.navy} />
						<Unit size={46}>cycles/min</Unit>
					</div>
					<div
						style={{
							position: 'absolute',
							left: 560,
							top: 40,
							opacity: dys,
							transform: `scale(${0.4 + 0.6 * alertPop}) rotate(${Math.sin(frame / 2.5) * 4 * dys}deg)`,
						}}
					>
						<Sign kind="alert" size={160} />
					</div>
					<StatePill
						x={480}
						y={280}
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
				<Odometer value={v} places={3} size={104} color={hi ? LPI.blue : LPI.navy} />
			</div>
			<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: hi ? LPI.blue : alpha(LPI.navy, 0.55), marginTop: 4}}>
				{label}
			</div>
		</div>
	);
	return (
		<Lesson3
			n={4}
			scale={<NormScale zones={ZONES.pa} value={sys} at={D + 10} markerAt={N + 48} y={scaleY()} />}
			slotSide="right"
			shake
			nAt={N}
			title={['Pression', 'artérielle']}
			titleAt={T}
			definition="Pression du sang sur la paroi des artères"
			defAt={D}
			slotTop={1040}
			layers={[
				{color: PINK, level: high},
				{color: COLD, level: low},
			]}
			punches={[HAUTE + 4, BASSE + 4]}
			terms={[
				{at: SYS, term: 'Systolique (PAS)', meaning: '1er chiffre : le cœur se contracte', sign: 'squeeze'},
				{at: DIA, term: 'Diastolique (PAD)', meaning: '2e chiffre : le cœur se relâche', sign: 'relax'},
				{at: HTA, term: 'Hypertension', meaning: <>(HTA) trop haute <Seuil>&gt; 140/90 mmHg</Seuil></>, sign: 'up'},
				{at: HYPO, term: 'Hypotension', meaning: <>pression trop basse <Seuil>&lt; 90/60 mmHg</Seuil></>, sign: 'down'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 0, top: 4, transform: 'scale(0.62)', transformOrigin: 'top left'}}>
						<Artery width={1510} arrows={arrows} strength={strength} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 206,
							opacity: Math.min(1, num * 1.5),
							transform: `scale(${0.6 + 0.4 * num})`,
						}}
					>
						<Manometer value={needle} size={212} tone={tone} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 300,
							top: 222,
							display: 'flex',
							alignItems: 'flex-start',
							gap: 6,
							opacity: Math.min(1, num * 1.5),
							transform: `translateY(${(1 - num) * 30}px)`,
						}}
					>
						{cell(sys, hiSys, 'PAS')}
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: LPI.navy, lineHeight: 1.1}}>/</div>
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
				top: 292,
				width: 936,
				height: 134,
				borderRadius: 67,
				background: alpha(LPI.pink, 0.28),
				border: `5px solid ${alpha(LPI.pink, 0.8)}`,
				overflow: 'hidden',
				opacity: show,
				transform: `scaleX(${0.6 + 0.4 * show})`,
			}}
		>
			{Array.from({length: n}, (_, i) => {
				const x = ((i * L) / n + frame * 3.2) % L - 60;
				const y = 67 + Math.sin(frame / 14 + i * 1.7) * 14;
				return (
					<div key={i} style={{position: 'absolute', left: x - 40, top: y - 40}}>
						<Rbc size={80} o2={o2(i)} />
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
			scale={
				<NormScale
					zones={ZONES.spo2}
					value={value}
					at={D + 6}
					markerAt={D + 8}
					y={scaleY()}
					bracket={{lo: 88, hi: 92, label: 'cible BPCO : 88 – 92 %', at: at('spo2', 'transporte')}}
				/>
			}
			slotSide="left"
			shake
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
							<Sub2 /> chute <Seuil>&lt; 95 %</Seuil>
						</>
					),
					sign: 'down',
				},
				{at: HYPX, term: 'Hypoxémie', meaning: <>manque d'O<Sub2 /> dans le sang <Seuil>&lt; 90 %</Seuil></>, sign: 'empty'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 40, top: 0, transform: 'scale(0.84)', transformOrigin: 'top left'}}>
						<Oximeter on={on} value={value} enter={enter} clip={clip} alert={alertV} focus={focus} />
					</div>
					<BloodLane o2={o2} show={lane} />
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 250,
							fontFamily: FONT.body,
							fontWeight: 800,
							fontSize: 25,
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

/* ═══════════════════════ 6 — GLYCÉMIE ═══════════════════════ */

export const Glycemie: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('gly', 'six');
	const T = at('gly', 'glycémie');
	const D = at('gly', 'taux');
	const DOIGT = at('gly', 'doigt');
	const LECT = at('gly', 'lecteur');
	const TROP = at('gly', 'trop');
	const HYPER = at('gly', 'hyperglycémie');
	const PAS = at('gly', 'pas');
	const HYPO = at('gly', 'hypoglycémie');
	const value = interpolate(frame, [LECT + 6, LECT + 26, TROP - 2, TROP + 16, PAS - 2, PAS + 14], [0, 0.95, 0.95, 1.45, 1.45, 0.55], ease);
	const finger = useSoft(D - 4);
	const drop = useSoft(DOIGT);
	const device = useSoft(N + 22, true);
	const strip = interpolate(frame, [LECT - 2, LECT + 8], [0, 1], ease);
	const blood = interpolate(frame, [LECT + 6, LECT + 12], [0, 1], clamp);
	const beep = frame >= LECT + 26 ? Math.exp(-(frame - LECT - 26) / 4) : 0;
	const high = interpolate(frame, [TROP, TROP + 14, PAS, PAS + 12], [0, 1, 1, 0], clamp);
	const low = interpolate(frame, [PAS, PAS + 14], [0, 1], clamp);
	const tone = frame >= PAS ? LPI.sky : frame >= TROP ? LPI.pink : null;
	return (
		<Lesson3
			n={6}
			scale={<NormScale zones={ZONES.gly} value={value} at={D + 8} markerAt={LECT + 20} y={scaleY()} />}
			slotSide="right"
			shake
			nAt={N}
			title={['La', 'glycémie']}
			titleAt={T}
			definition="Taux de sucre dans le sang"
			defAt={D}
			layers={[
				{color: PINK, level: high},
				{color: COLD, level: low},
			]}
			punches={[DOIGT + 2, TROP + 4, PAS + 4]}
			terms={[
				{at: LECT, term: 'Lecteur de glycémie', meaning: 'une goutte de sang au bout du doigt', sign: 'device'},
				{at: HYPER, term: 'Hyperglycémie', meaning: <>trop de sucre <Seuil>&gt; 1,10 g/l</Seuil></>, sign: 'up'},
				{at: HYPO, term: 'Hypoglycémie', meaning: <>pas assez de sucre <Seuil>&lt; 0,70 g/l</Seuil></>, sign: 'down'},
			]}
			stage={
				<>
					<SugarRain on={high} />
					<div style={{position: 'absolute', left: 0, top: 126, opacity: Math.min(1, finger * 1.5), transform: `translateX(${(1 - finger) * -260}px)`}}>
						<Finger drop={drop} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 452,
							top: 150,
							opacity: Math.min(1, device * 1.5),
							transform: `translateX(${(1 - device) * 300}px) rotate(${Math.sin(frame / 3) * 2 * high}deg)`,
						}}
					>
						<Glucometer value={value} strip={strip} blood={blood} tone={tone} beep={beep} />
					</div>
					<StatePill
						x={470}
						y={44}
						size={36}
						states={[
							{at: TROP, kind: 'up', label: 'trop de sucre'},
							{at: PAS, kind: 'down', label: 'pas assez'},
						]}
					/>
				</>
			}
		/>
	);
};

/* ═══════════════════════ 7 — DIURÈSE ═══════════════════════ */

const JAR_MAX = 3500;

/** Bocal gradué de recueil des urines (24 h) : le niveau suit la diurèse, les gouttes tombent du tuyau. */
const Jar: React.FC<{value: number; drops: number[]}> = ({value, drops}) => {
	const frame = useCurrentFrame();
	const lvl = (v: number) => 380 - (Math.min(v, JAR_MAX) / JAR_MAX) * 316;
	const top = lvl(value);
	const wave = Array.from({length: 11}, (_, i) => {
		const x = 30 + i * 20;
		return `${x},${top + 5 * Math.sin(i / 1.3 + frame / 5)}`;
	}).join(' ');
	return (
		<svg width={260} height={400} viewBox="0 0 260 400" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="lpi-jar">
					<path d="M44 64 H216 V356 Q216 384 188 384 H72 Q44 384 44 356 Z" />
				</clipPath>
			</defs>
			{/* tuyau qui amène les urines */}
			<path d="M130 -24 V40" stroke={LPI.navy} strokeWidth={16} strokeLinecap="round" />
			<path d="M130 -24 V40" stroke={LPI.sky} strokeWidth={7} strokeLinecap="round" />
			<g clipPath="url(#lpi-jar)">
				<polygon points={`${wave} 240,400 20,400`} fill={alpha(LPI.sky, 0.95)} />
				<polyline points={wave} fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinejoin="round" />
			</g>
			{drops.map((d, i) => {
				const t = (frame - d) / 12;
				if (t < 0 || t > 1) return null;
				const y = 46 + t * t * (top - 46);
				return <path key={i} d={`M130 ${y - 14} C124 ${y - 4} 120 ${y + 2} 120 ${y + 6} A10 10 0 0 0 140 ${y + 6} C140 ${y + 2} 136 ${y - 4} 130 ${y - 14} Z`} fill={LPI.blue} />;
			})}
			<path d="M44 64 H216 V356 Q216 384 188 384 H72 Q44 384 44 356 Z" fill="none" stroke={LPI.navy} strokeWidth={10} strokeLinejoin="round" />
			<rect x="28" y="36" width="204" height="34" rx="12" fill={LPI.blue} stroke={LPI.navy} strokeWidth={8} />
			{[1000, 2000, 3000].map((g) => (
				<g key={g}>
					<path d={`M172 ${lvl(g)} H206`} stroke={LPI.navy} strokeWidth={6} strokeLinecap="round" />
					<text x="166" y={lvl(g) + 8} textAnchor="end" fontFamily={FONT.body} fontWeight={800} fontSize="22" fill={alpha(LPI.navy, 0.75)}>
						{g / 1000} L
					</text>
				</g>
			))}
		</svg>
	);
};

/** Petite horloge « 24 h » dont l'aiguille fait le tour du cadran. */
const Clock24: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	const turn = interpolate(frame, [t0 + 2, t0 + 26], [0, 360], ease);
	return (
		<div style={{opacity: Math.min(1, p * 2), transform: `scale(${0.4 + 0.6 * p})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<svg width={120} height={120} viewBox="-60 -60 120 120">
				<circle r={52} fill={LPI.paper} stroke={LPI.navy} strokeWidth={8} />
				<path d={`M0 0 L0 -36 A36 36 0 ${turn > 180 ? 1 : 0} 1 ${36 * Math.sin((turn * Math.PI) / 180)} ${-36 * Math.cos((turn * Math.PI) / 180)} Z`} fill={alpha(LPI.sky, 0.9)} />
				<g transform={`rotate(${turn})`}>
					<path d="M0 6 V-38" stroke={LPI.navy} strokeWidth={7} strokeLinecap="round" />
				</g>
				<circle r={7} fill={LPI.pink} stroke={LPI.navy} strokeWidth={3} />
			</svg>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: LPI.navy, marginTop: 2}}>24 h</div>
		</div>
	);
};

/** Instants des gouttes : la cadence suit le volume (beaucoup d'urine = goutte à goutte rapide). */
const dropTimes = (frame: number, start: number, vAt: (f: number) => number) => {
	const out: number[] = [];
	let ph = 0;
	for (let f = start; f <= frame; f++) {
		const v = vAt(f);
		const period = v < 120 ? 0 : interpolate(v, [120, 400, 1500, 3200], [60, 34, 16, 6], clamp);
		if (period <= 0) continue;
		ph += 1 / period;
		if (ph >= 1) {
			ph -= 1;
			out.push(f);
		}
	}
	return out.slice(-6);
};

export const Diurese: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('diu', 'sept');
	const T = at('diu', 'diurèse');
	const D = at('diu', 'volume');
	const H24 = at('diu', '24');
	const PAS = at('diu', 'pas');
	const OLI = at('diu', 'oligurie');
	const PRESQUE = at('diu', 'presque');
	const ANU = at('diu', 'anurie');
	const TROP = at('diu', 'beaucoup');
	const POLY = at('diu', 'polyurie');
	const vAt = (f: number) =>
		interpolate(f, [N + 22, N + 50, PAS - 2, PAS + 16, PRESQUE - 2, PRESQUE + 14, TROP - 2, TROP + 18], [0, 1500, 1500, 300, 300, 60, 60, 3200], ease);
	const value = vAt(frame);
	const drops = dropTimes(frame, N + 22, vAt);
	const num = useSoft(N + 24, true);
	const jar = useSoft(N + 18, true);
	const low = interpolate(frame, [PAS, PAS + 14, TROP, TROP + 12], [0, 1, 1, 0], clamp);
	const high = interpolate(frame, [TROP, TROP + 14], [0, 1], clamp);
	return (
		<Lesson3
			n={7}
			scale={<NormScale zones={ZONES.diu} value={value} at={D + 8} markerAt={N + 50} y={scaleY()} nameSize={23} rangeSize={20} />}
			slotSide="left"
			shake
			nAt={N}
			title={['La', 'diurèse']}
			titleAt={T}
			definition="Volume d'urine sur 24 heures"
			defAt={D}
			layers={[
				{color: COLD, level: low},
				{color: PINK, level: high},
			]}
			punches={[H24 + 2, PAS + 4, PRESQUE + 4, TROP + 4]}
			terms={[
				{at: OLI, term: 'Oligurie', meaning: <>pas assez d'urine <Seuil>&lt; 400 ml/24 h</Seuil></>, sign: 'down'},
				{at: ANU, term: 'Anurie', meaning: <>presque plus d'urine <Seuil>&lt; 100 ml/24 h</Seuil></>, sign: 'empty'},
				{at: POLY, term: 'Polyurie', meaning: <>trop d'urine <Seuil>&gt; 2500 à 3000 ml/24 h</Seuil></>, sign: 'up'},
			]}
			stage={
				<>
					<div style={{position: 'absolute', left: 60, top: 30, opacity: Math.min(1, jar * 1.5), transform: `translateY(${(1 - jar) * 60}px)`}}>
						<Jar value={value} drops={drops} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 360,
							top: 64,
							display: 'flex',
							alignItems: 'baseline',
							opacity: Math.min(1, num * 1.5),
							transform: `translateY(${(1 - num) * 30}px)`,
						}}
					>
						<Odometer value={value} places={4} size={132} color={high > 0.5 ? LPI.blue : LPI.navy} />
						<Unit size={46}>ml</Unit>
					</div>
					<div style={{position: 'absolute', left: 790, top: 30}}>
						<Clock24 at={H24} />
					</div>
					<StatePill
						x={372}
						y={250}
						size={34}
						states={[
							{at: PAS, kind: 'down', label: 'pas assez'},
							{at: PRESQUE, kind: 'empty', label: 'presque plus du tout'},
							{at: TROP, kind: 'up', label: 'beaucoup trop'},
						]}
					/>
				</>
			}
		/>
	);
};
