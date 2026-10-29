// Briques « cœur » réutilisables : calendrier des battements (rythme qui change sans à-coup),
// impulsion du dernier battement, tracé ECG qui défile (chaque battement = un QRS).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Heart} from './pictos';
import {Sfx} from './Sfx';
import {alpha, LPI} from './theme';

/** Battements à partir de segments [frame de début, période en frames | liste de périodes (irrégulier)]. */
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

/** Dernier battement passé : son index et une impulsion 0 → 1 (pour faire « battre » un cœur). */
export const lastBeat = (beats: number[], frame: number, decay = 4) => {
	let last = -999;
	let idx = -1;
	beats.forEach((b, i) => {
		if (b <= frame) {
			last = b;
			idx = i;
		}
	});
	return {idx, last, pulse: last < 0 ? 0 : Math.exp(-(frame - last) / decay)};
};

/** Tracé ECG : la ligne défile vers la gauche, chaque battement dessine un complexe QRS. */
export const EcgTrace: React.FC<{
	beats: number[];
	width: number;
	height?: number;
	/** amplitude du pic (px) */
	amp?: number;
	speed?: number;
	color?: string;
	stroke?: number;
	id: string;
}> = ({beats, width, height = 140, amp = 64, speed = 9, color = LPI.blue, stroke = 9, id}) => {
	const frame = useCurrentFrame();
	const spawn = width * 0.88;
	const mid = height * 0.58;
	const step = 6;
	const pts: [number, number][] = [];
	for (let x = 0; x <= width; x += step) {
		let y = 0;
		for (const b of beats) {
			if (b > frame) break;
			const d = x - (spawn - (frame - b) * speed);
			if (d < -60 || d > 80) continue;
			// petite onde P, QRS pointu, onde T arrondie
			y += 0.12 * amp * Math.exp(-(((d + 34) / 9) ** 2));
			y += -amp * Math.exp(-((d / 7) ** 2)) + 0.32 * amp * Math.exp(-(((d - 12) / 6) ** 2));
			y += -0.22 * amp * Math.exp(-(((d - 46) / 14) ** 2));
		}
		pts.push([x, mid + y]);
	}
	const head = pts[Math.round(spawn / step)];
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`ecg-${id}`} x1="0" x2="1">
					<stop offset="0" stopColor={color} stopOpacity="0" />
					<stop offset="0.22" stopColor={color} stopOpacity="1" />
				</linearGradient>
			</defs>
			<polyline
				points={pts.map((p) => p.join(',')).join(' ')}
				fill="none"
				stroke={`url(#ecg-${id})`}
				strokeWidth={stroke}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx={head[0]} cy={head[1]} r={stroke * 1.4} fill={LPI.pink} stroke={LPI.navy} strokeWidth={4} />
			<circle cx={head[0]} cy={head[1]} r={stroke * 3} fill={alpha(LPI.pink, 0.25)} />
		</svg>
	);
};

/** Cœur qui bat au rythme des battements, avec une secousse quand il « s'emballe » (`shake` 0 → 1). */
export const BeatingHeart: React.FC<{beats: number[]; size: number; shake?: number}> = ({beats, size, shake = 0}) => {
	const frame = useCurrentFrame();
	const {pulse} = lastBeat(beats, frame);
	return (
		<div style={{transform: `rotate(${Math.sin(frame / 2.2) * 4 * shake}deg) translateX(${Math.sin(frame / 1.7) * 6 * shake}px)`}}>
			<Heart size={size} beat={pulse} />
		</div>
	);
};

/** Battements sonores (très bas) à partir de la frame `from`. */
export const HeartSfx: React.FC<{beats: number[]; from: number; volume?: number}> = ({beats, from, volume = 0.08}) => (
	<>
		{beats
			.filter((b) => b >= from)
			.map((b) => (
				<Sfx key={b} name="heartbeat" at={b} volume={volume} />
			))}
	</>
);

/** Onde de pouls qui défile (montée raide, descente douce) ; `amp` = force, `period` = vitesse. */
export const PulseWave: React.FC<{amp: number; period: number; width?: number; height?: number; color?: string; on: number}> = ({
	amp,
	period,
	width = 600,
	height = 130,
	color = LPI.blue,
	on,
}) => {
	const frame = useCurrentFrame();
	const pts = Array.from({length: Math.ceil(width / 5) + 1}, (_, i) => {
		const x = i * 5;
		const ph = (((x + frame * 7) / (period * 7)) % 1 + 1) % 1;
		const v = ph < 0.18 ? Math.sin((ph / 0.18) * (Math.PI / 2)) : Math.exp(-(ph - 0.18) * 4.2) * (1 + 0.18 * Math.sin((ph - 0.18) * 18));
		return `${width - x},${height * 0.82 - v * amp * on}`;
	}).join(' ');
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<path d={`M0 ${height * 0.82} H${width}`} stroke={alpha(LPI.navy, 0.15)} strokeWidth={4} />
			<polyline points={pts} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

