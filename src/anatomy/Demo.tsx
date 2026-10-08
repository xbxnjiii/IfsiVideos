// Démo du « cœur » visuel de la série : le corps humain animé, sans voix (validation avant intégration).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from '../brand/theme';
import {DEFAULT_LOOK} from './Body';
import {ArteryLoupe, CapillaryLoupe, Cuff, Loupe, OXI_TIP, OxiClip, pulseShape} from './Closeups';
import {BodyStage, camAt, project, View} from './Stage';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const VIEW: View = {x: 0, y: 330, w: 1080, h: 1270};
const FULL = {cx: 500, cy: 900, w: 1565};

/** battements : segments [frame de début, période | liste de périodes] */
export const beatSchedule = (segments: [number, number | number[]][], start: number, end: number) => {
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

/** respiration : phase intégrée (le rythme change sans à-coup) */
export const breathAt = (frame: number, segments: [number, number][], shallowFrom = Infinity) => {
	let ph = 0;
	for (let f = 0; f < frame; f++) {
		let p = segments[0][1];
		for (const s of segments) if (f >= s[0]) p = s[1];
		ph += 1 / p;
	}
	const amp = frame >= shallowFrom ? 0.45 + 0.25 * Math.sin(frame / 7) : 1;
	return (0.5 - 0.5 * Math.cos(ph * Math.PI * 2)) * amp;
};

const BEATS = beatSchedule(
	[
		[0, 25],
		[420, 13],
		[480, 42],
		[520, [13, 31, 17, 38, 12, 27, 21, 34]],
		[570, 25],
	],
	4,
	1440,
);

const SECTIONS: [number, string, [number, string][]][] = [
	[0, 'Le corps humain', [[30, 'peau'], [45, 'muscles'], [62, 'artères et veines'], [92, 'cœur et poumons']]],
	[150, 'Température', [[165, 'fièvre'], [232, 'normale'], [260, 'trop basse']]],
	[330, 'Cœur', [[372, 'rythme normal'], [420, 'trop rapide'], [480, 'trop lent'], [520, 'irrégulier']]],
	[570, 'Poumons', [[612, 'respiration normale'], [650, 'trop rapide'], [710, 'trop lente'], [770, 'difficile']]],
	[810, 'Pression artérielle', [[880, 'le sang pousse sur la paroi'], [890, 'systole : le cœur se contracte'], [925, 'diastole : le cœur se relâche'], [960, 'pression trop haute'], [1010, 'pression trop basse']]],
	[1080, 'Saturation en oxygène', [[1150, "l'hémoglobine transporte l'O₂"], [1200, 'désaturation'], [1250, "manque d'O₂ dans le sang"]]],
	[1320, 'Le corps humain', []],
];

const Label: React.FC<{frame: number}> = ({frame}) => {
	let s = SECTIONS[0];
	for (const x of SECTIONS) if (frame >= x[0]) s = x;
	let sub = '';
	let subAt = 0;
	for (const [f, t] of s[2]) if (frame >= f) [subAt, sub] = [f, t];
	const pop = interpolate(frame, [subAt, subAt + 8], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<div style={{position: 'absolute', top: 170, left: 72, right: 72}}>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: LPI.navy, lineHeight: 1}}>{s[1]}</div>
			{sub ? (
				<div
					style={{
						display: 'inline-block',
						marginTop: 18,
						padding: '10px 26px',
						borderRadius: 999,
						background: LPI.blue,
						color: LPI.paper,
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 36,
						transform: `scale(${pop})`,
						transformOrigin: 'left center',
					}}
				>
					{sub}
				</div>
			) : null}
		</div>
	);
};

/** tracé ECG simplifié (écran) */
const Ecg: React.FC<{frame: number; on: number}> = ({frame, on}) => {
	if (on <= 0) return null;
	const W = 936;
	const spawn = W * 0.92;
	const pts = Array.from({length: Math.ceil(W / 5) + 1}, (_, i) => {
		const x = i * 5;
		let y = 0;
		for (const b of BEATS) {
			if (b > frame) break;
			const d = x - (spawn - (frame - b) * 9);
			y += -60 * Math.exp(-((d / 9) ** 2)) + 18 * Math.exp(-(((d - 18) / 8) ** 2)) - 12 * Math.exp(-(((d - 60) / 18) ** 2));
		}
		return `${x},${70 + y}`;
	}).join(' ');
	return (
		<svg width={W} height={140} style={{position: 'absolute', left: 72, top: 1620, opacity: on, overflow: 'visible'}}>
			<rect x={-20} y={-10} width={W + 40} height={160} rx={30} fill={alpha(LPI.sky, 0.45)} />
			<polyline points={pts} fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
		</svg>
	);
};

export const AnatomyDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const cam = camAt(frame, [
		[0, FULL],
		[140, {cx: 500, cy: 760, w: 1250}],
		[175, FULL],
		[330, FULL],
		[372, {cx: 515, cy: 505, w: 330}],
		[565, {cx: 515, cy: 505, w: 330}],
		[610, {cx: 500, cy: 470, w: 540}],
		[805, {cx: 500, cy: 470, w: 540}],
		[850, {cx: 300, cy: 520, w: 430}],
		[1075, {cx: 300, cy: 520, w: 430}],
		[1120, {cx: 730, cy: 1010, w: 540}],
		[1315, {cx: 730, cy: 1010, w: 540}],
		[1375, FULL],
	]);
	const look = {
		...DEFAULT_LOOK,
		xray: interpolate(frame, [30, 70, 150, 175, 320, 345], [0, 1, 1, 0.12, 0.12, 1], ease),
		muscles: interpolate(frame, [40, 80, 110, 140, 820, 850, 1070, 1090], [0, 1, 1, 0.35, 0.35, 0.9, 0.9, 0.35], ease),
		vessels: interpolate(frame, [58, 64], [0, 1], clamp),
		draw: interpolate(frame, [60, 135], [0, 1], clamp),
		organs: interpolate(frame, [88, 118], [0, 1], ease),
		thermal: interpolate(frame, [165, 190, 230, 250, 260, 285, 312, 330], [0, 1, 1, 0, 0, -1, -1, 0], ease),
		breath: breathAt(frame, [[0, 90], [650, 30], [710, 140], [770, 40], [810, 90]], 770),
		flow: interpolate(frame, [418, 424, 478, 484, 518, 524], [1, 1.7, 1.7, 0.6, 0.6, 1], clamp),
		focus: frame >= 860 && frame < 1310 ? ('arteries' as const) : null,
	};
	// pression artérielle : force du sang sur la paroi
	const strength = interpolate(frame, [955, 970, 1005, 1020], [1, 1.8, 1.8, 0.5], clamp);
	const phase = frame >= 890 && frame < 925 ? 'sys' : frame >= 925 && frame < 960 ? 'dia' : null;
	const paLoupe = interpolate(frame, [870, 895, 1062, 1080], [0, 1, 1, 0], ease);
	const oxLoupe = interpolate(frame, [1125, 1150, 1300, 1320], [0, 1, 1, 0], ease);
	const sat = interpolate(frame, [1200, 1235], [1, 0.55], clamp);
	const plasma = interpolate(frame, [1250, 1285], [1, 0.2], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<BodyStage
				id="demo"
				frame={frame}
				beats={BEATS}
				look={look}
				cam={cam}
				view={VIEW}
				accessories={
					<>
						<Cuff show={interpolate(frame, [815, 845, 1070, 1090], [0, 1, 1, 0], clamp)} inflate={interpolate(frame, [850, 880], [0, 1], ease) * (0.85 + 0.15 * pulseShape(frame, BEATS))} />
						<OxiClip show={interpolate(frame, [1085, 1110, 1300, 1320], [0, 1, 1, 0], clamp)} glow={pulseShape(frame, BEATS)} />
					</>
				}
				overlay={
					<>
						<Loupe id="pa" x={760} y={760} r={250} open={paLoupe} target={project(cam, VIEW, [298, 492])}>
							<ArteryLoupe frame={frame} beats={BEATS} strength={strength} arrows={interpolate(frame, [880, 900], [0, 1], clamp)} phase={phase} />
						</Loupe>
						<Loupe id="ox" x={330} y={1190} r={265} open={oxLoupe} target={project(cam, VIEW, OXI_TIP)}>
							<CapillaryLoupe frame={frame} sat={sat} plasmaO2={plasma} light={interpolate(frame, [1150, 1170], [0, 1], clamp)} />
						</Loupe>
					</>
				}
			/>
			<Ecg frame={frame} on={interpolate(frame, [372, 392, 550, 570], [0, 1, 1, 0], clamp)} />
			<Label frame={frame} />
		</AbsoluteFill>
	);
};
