import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {LessonLayout} from '../../brand/LessonLayout';
import {Sign, TermCard} from '../../brand/learn';
import {Artery, FlamePicto, fr1, Heart, Lungs, Oximeter, Rbc, SnowPicto, Thermometer} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp, Readout, useSoft} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

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

/* ═══════════════════════════ 1 — TEMPÉRATURE ═══════════════════════════ */
export const Temperature: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('temp', 'un');
	const T = at('temp', 'température');
	const D = at('temp', 'évalue');
	const FEB = at('temp', 'fébrile');
	const APY = at('temp', 'apyrétique');
	const HYP = at('temp', 'hypothermie');
	const FIEVRE = at('temp', 'fièvre');
	const value = interpolate(
		frame,
		[8, 30, FIEVRE - 2, FEB + 6, APY - 6, APY + 10, HYP - 18, HYP + 8],
		[35.6, 36.7, 36.7, 39.2, 39.2, 36.8, 36.8, 35.0],
		ease,
	);
	const state = frame >= HYP - 6 ? 'cold' : frame >= APY ? 'ok' : frame >= FEB - 6 ? 'hot' : 'none';
	const icon = useSoft(state === 'hot' ? FEB - 6 : state === 'ok' ? APY : HYP - 6, true);
	return (
		<>
			<LessonLayout
				n={1}
				total={5}
				nAt={N}
				title="*Température*"
				titleAt={T}
				definition="Évalue l'état thermique du patient"
				defAt={D}
				cardHeight={330}
				bumps={[FEB, APY, HYP]}
				mascot={[
					[D, 'reflechit'],
					[FEB, 'surprise'],
					[APY, 'confiante'],
					[HYP, 'stressee'],
				]}
				card={
					<>
						<div style={{position: 'absolute', left: 70, top: 14}}>
							<Thermometer value={value} height={300} />
						</div>
						<div style={{position: 'absolute', left: 280, top: 72}}>
							<Readout value={fr1(value)} unit="°C" size={128} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 290,
								top: 222,
								opacity: state === 'none' ? 0 : icon,
								transform: `scale(${0.6 + 0.4 * icon})`,
							}}
						>
							{state === 'hot' ? (
								<FlamePicto size={78} />
							) : state === 'cold' ? (
								<SnowPicto size={78} />
							) : state === 'ok' ? (
								<Sign kind="check" size={78} />
							) : null}
						</div>
					</>
				}
			>
				<TermCard at={FEB} until={APY} term="Fébrile" meaning="le patient a de la fièvre" sign="up" />
				<TermCard at={APY} until={HYP} term="Apyrétique" meaning="le patient n'a pas de fièvre" sign="check" />
				<TermCard at={HYP} term="Hypothermie" meaning="température trop basse" sign="down" />
			</LessonLayout>
			<Sfx name="pop" at={N} volume={0.12} />
			{[FEB, APY, HYP].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.12} />
			))}
		</>
	);
};

/* ═══════════════════════ 2 — FRÉQUENCE CARDIAQUE ═══════════════════════ */
const PulseTrace: React.FC<{beats: number[]; width: number}> = ({beats, width}) => {
	const frame = useCurrentFrame();
	const speed = 9;
	const spawn = width * 0.86;
	const pts = Array.from({length: Math.ceil(width / 6) + 1}, (_, i) => {
		const x = i * 6;
		let y = 0;
		for (const b of beats) {
			if (b > frame) break;
			const bx = spawn - (frame - b) * speed;
			const d = x - bx;
			y += -52 * Math.exp(-((d / 16) ** 2)) + 14 * Math.exp(-(((d - 32) / 14) ** 2));
		}
		return `${x},${60 + y}`;
	}).join(' ');
	return (
		<svg width={width} height={100} style={{overflow: 'visible'}}>
			<polyline
				points={pts}
				fill="none"
				stroke={LPI.blue}
				strokeWidth={7}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
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
			[RAP, 14],
			[LEN, 40],
			[IRR, [13, 31, 17, 38, 12, 27, 21, 34]],
		],
		10,
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
	const beat = Math.exp(-(frame - last) / 4);
	const irregular = [64, 108, 57, 96, 71, 104, 60, 92];
	const bpm = frame >= IRR ? irregular[idx % irregular.length] : frame >= LEN ? 45 : frame >= RAP ? 128 : 72;
	const counter = useSoft(D, true);
	return (
		<>
			<LessonLayout
				n={2}
				total={5}
				nAt={N}
				title="Fréquence *cardiaque*"
				titleAt={T}
				definition="Nombre de battements du cœur par minute"
				defAt={D}
				cardHeight={330}
				bumps={[TA, BR, AR]}
				mascot={[
					[D, 'determinee'],
					[TA, 'surprise'],
					[BR, 'fatiguee'],
					[AR, 'reflechit'],
				]}
				card={
					<>
						<div style={{position: 'absolute', left: 50, top: 8}}>
							<Heart size={230} beat={beat} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 330,
								top: 54,
								opacity: counter,
								transform: `translateY(${(1 - counter) * 16}px)`,
							}}
						>
							<Readout value={bpm} unit="bpm" size={124} color={frame >= RAP && frame < LEN ? LPI.blue : LPI.navy} />
						</div>
						<div style={{position: 'absolute', left: 0, top: 230}}>
							<PulseTrace beats={beats} width={936} />
						</div>
					</>
				}
			>
				<TermCard at={TA} until={BR} term="Tachycardie" meaning="le cœur bat trop vite" sign="up" />
				<TermCard at={BR} until={AR} term="Bradycardie" meaning="le cœur bat trop lentement" sign="down" />
				<TermCard at={AR} term="Arythmie" meaning="le rythme est irrégulier" sign="wave" />
			</LessonLayout>
			<Sfx name="pop" at={N} volume={0.12} />
			{[TA, BR, AR].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.12} />
			))}
			{beats
				.filter((b) => b >= 10)
				.map((b) => (
					<Sfx key={b} name="heartbeat" at={b} volume={0.11} />
				))}
		</>
	);
};

/* ═══════════════════════ 3 — FRÉQUENCE RESPIRATOIRE ═══════════════════════ */
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
		[RAP, 32],
		[LEN, 140],
		[MAL, 40],
	];
	const ph = breathPhase(frame, segments);
	const phase = ph % 1;
	const amp = frame >= MAL ? 0.45 + 0.25 * Math.sin(frame / 7) : 1;
	const breath = (0.5 - 0.5 * Math.cos(phase * Math.PI * 2)) * amp;
	const inspiring = phase < 0.5;
	const q = inspiring ? phase / 0.5 : (phase - 0.5) / 0.5;
	const counter = useSoft(D, true);
	const rate = frame >= MAL ? null : frame >= LEN ? 8 : frame >= RAP ? 28 : 16;
	const alertOn = useSoft(MAL, true);
	return (
		<>
			<LessonLayout
				n={3}
				total={5}
				nAt={N}
				title="Fréquence *respiratoire*"
				titleAt={T}
				titleSize={80}
				definition="Nombre de respirations par minute"
				defAt={D}
				cardHeight={330}
				bumps={[TA, BR, DY]}
				mascot={[
					[D, 'joyeuse'],
					[TA, 'stressee'],
					[BR, 'fatiguee'],
					[DY, 'surprise'],
				]}
				card={
					<>
						<div style={{position: 'absolute', left: 60, top: 32}}>
							<Lungs breath={breath} inspiring={inspiring} q={q} size={270} />
						</div>
						<div style={{position: 'absolute', left: 380, top: 96, opacity: counter * (rate === null ? 0 : 1)}}>
							<Readout value={rate ?? 16} unit="/ min" size={124} color={rate === 28 ? LPI.blue : LPI.navy} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 390,
								top: 100,
								display: 'flex',
								alignItems: 'center',
								gap: 20,
								opacity: rate === null ? alertOn : 0,
							}}
						>
							<Sign kind="alert" size={96} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.navy, lineHeight: 1.1}}>
								Difficulté
								<br />à respirer
							</div>
						</div>
					</>
				}
			>
				<TermCard at={TA} until={BR} term="Tachypnée" meaning="respiration trop rapide" sign="up" />
				<TermCard at={BR} until={DY} term="Bradypnée" meaning="respiration trop lente" sign="down" />
				<TermCard at={DY} term="Dyspnée" meaning="difficulté à respirer" sign="alert" />
			</LessonLayout>
			<Sfx name="pop" at={N} volume={0.12} />
			{[TA, BR, DY].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.12} />
			))}
		</>
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
	const sys = interpolate(frame, [HAUTE - 4, HAUTE + 10, BASSE - 4, BASSE + 10], [120, 165, 165, 85], ease);
	const dia = interpolate(frame, [HAUTE - 4, HAUTE + 10, BASSE - 4, BASSE + 10], [80, 100, 100, 50], ease);
	const strength = interpolate(frame, [HAUTE - 4, HAUTE + 10, BASSE - 4, BASSE + 10], [1, 1.8, 1.8, 0.45], ease);
	const hiSys = frame >= SYS && frame < DIA;
	const hiDia = frame >= DIA && frame < HAUTE;
	const tone = frame >= BASSE ? LPI.sky : frame >= HAUTE ? LPI.pink : null;
	const arrows = interpolate(frame, [W, W + 10], [0, 1], clamp);
	const num = (v: number, hi: boolean, label: string) => (
		<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
			<span
				style={{
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 96,
					lineHeight: 1,
					color: hi ? LPI.blue : LPI.navy,
					background: tone ? alpha(tone, 0.55) : hi ? alpha(LPI.sky, 0.7) : 'transparent',
					borderRadius: 18,
					padding: '0 10px',
				}}
			>
				{Math.round(v)}
			</span>
			<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: hi ? LPI.blue : alpha(LPI.navy, 0.5)}}>
				{label}
			</span>
		</div>
	);
	return (
		<>
			<LessonLayout
				n={4}
				total={5}
				nAt={N}
				title="Pression *artérielle*"
				titleAt={T}
				definition="Pression du sang sur la paroi des artères"
				defAt={D}
				cardHeight={330}
				bumps={[SYS, DIA, HTA, HYPO]}
				mascot={[
					[D, 'reflechit'],
					[SYS, 'determinee'],
					[DIA, 'joyeuse'],
					[HTA, 'stressee'],
					[HYPO, 'fatiguee'],
				]}
				card={
					<>
						<div
							style={{position: 'absolute', left: 18, top: 70, transform: 'scale(0.6)', transformOrigin: 'top left'}}
						>
							<Artery width={940} arrows={arrows} strength={strength} />
						</div>
						<div style={{position: 'absolute', left: 620, top: 26}}>
							{num(sys, hiSys, 'PAS')}
							<div style={{width: 250, height: 6, borderRadius: 3, background: LPI.navy, margin: '12px 0'}} />
							{num(dia, hiDia, 'PAD')}
							<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 30, color: LPI.blue, marginTop: 6}}>
								mmHg
							</div>
						</div>
					</>
				}
			>
				<TermCard
					at={SYS}
					until={DIA}
					term="Systolique (PAS)"
					meaning="1er chiffre : le cœur se contracte"
					sign="squeeze"
				/>
				<TermCard
					at={DIA}
					until={HTA}
					term="Diastolique (PAD)"
					meaning="2e chiffre : le cœur se relâche"
					sign="relax"
				/>
				<TermCard at={HTA} until={HYPO} term="Hypertension (HTA)" meaning="pression trop haute" sign="up" />
				<TermCard at={HYPO} term="Hypotension" meaning="pression trop basse" sign="down" />
			</LessonLayout>
			<Sfx name="pop" at={N} volume={0.12} />
			{[SYS, DIA, HTA, HYPO].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.12} />
			))}
		</>
	);
};

/* ═══════════════════════ 5 — SATURATION (SpO2) ═══════════════════════ */
export const Saturation: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('spo2', 'cinq');
	const T = at('spo2', 'saturation');
	const D = at('spo2', 'pourcentage');
	const OXY = at('spo2', 'oxymètre');
	const DES = at('spo2', 'désaturation');
	const CHUTE = at('spo2', 'chute');
	const HYPX = at('spo2', 'hypoxémie');
	const MANQUE = at('spo2', 'manque');
	const value = interpolate(frame, [20, 46, CHUTE - 4, CHUTE + 16], [70, 98, 98, 86], ease);
	const alertV = interpolate(frame, [CHUTE, CHUTE + 10], [0, 1], clamp);
	const focus = frame >= OXY && frame < DES ? interpolate(frame, [OXY, OXY + 6], [0, 1], clamp) : 0;
	const o2 = interpolate(frame, [MANQUE, MANQUE + 16], [1, 0], clamp);
	const enter = useSoft(10);
	const clip = useSoft(22, true);
	const on = interpolate(frame, [26, 32], [0, 1], clamp);
	return (
		<>
			<LessonLayout
				n={5}
				total={5}
				nAt={N}
				title={'Saturation en *oxygène*'}
				titleAt={T}
				titleSize={80}
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
				cardHeight={330}
				bumps={[OXY, DES, HYPX]}
				mascot={[
					[T, 'confiante'],
					[DES, 'surprise'],
					[HYPX, 'stressee'],
				]}
				card={
					<>
						<div style={{position: 'absolute', left: 24, top: 18}}>
							<Oximeter on={on} value={value} enter={enter} clip={clip} alert={alertV} focus={focus} />
						</div>
						<div style={{position: 'absolute', left: 40, top: 236, display: 'flex', alignItems: 'center', gap: 14}}>
							<Rbc size={70} o2={o2} />
							<div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: alpha(LPI.navy, 0.7)}}>
								globule rouge + O<Sub2 />
							</div>
						</div>
					</>
				}
			>
				<TermCard
					at={OXY}
					until={DES}
					term="Oxymètre de pouls"
					meaning={
						<>
							l'appareil qui mesure la SpO
							<Sub2 />
						</>
					}
					sign="device"
				/>
				<TermCard
					at={DES}
					until={HYPX}
					term="Désaturation"
					meaning={
						<>
							la SpO
							<Sub2 /> chute
						</>
					}
					sign="down"
				/>
				<TermCard at={HYPX} term="Hypoxémie" meaning="manque d'oxygène dans le sang" sign="empty" />
			</LessonLayout>
			<Sfx name="pop" at={N} volume={0.12} />
			{[OXY, DES, HYPX].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.12} />
			))}
		</>
	);
};
