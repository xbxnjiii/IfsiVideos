// Briques « respiration » réutilisables : rythme respiratoire qui change sans à-coup (phase intégrée),
// poumons qui respirent, particules d'air, thorax qui se soulève, tracé respiratoire qui défile.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Lungs} from './pictos';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/** Segments [frame de début, période d'un cycle en frames] → phase intégrée (nombre de cycles depuis 0). */
export type BreathSegments = [number, number][];
export const breathPhase = (frame: number, segments: BreathSegments) => {
	let ph = 0;
	for (let f = 0; f < frame; f++) {
		let p = segments[0][1];
		for (const s of segments) if (f >= s[0]) p = s[1];
		ph += 1 / p;
	}
	return ph;
};

/** État de la respiration à une frame : souffle 0 → 1 (× amplitude), inspiration ou expiration, progression q. */
export const breathAt = (frame: number, segments: BreathSegments, amp = 1) => {
	const ph = breathPhase(frame, segments);
	const phase = ph % 1;
	const inspiring = phase < 0.5;
	return {
		ph,
		phase,
		inspiring,
		q: inspiring ? phase / 0.5 : (phase - 0.5) / 0.5,
		breath: (0.5 - 0.5 * Math.cos(phase * Math.PI * 2)) * amp,
	};
};

/** Cycles complets entre `from` et la frame courante. */
export const cyclesSince = (frame: number, from: number, segments: BreathSegments) =>
	frame <= from ? 0 : Math.floor(breathPhase(frame, segments) - breathPhase(from, segments));

/** Particules d'air qui entrent (inspiration) ou sortent (expiration) par la trachée. */
export const Air: React.FC<{q: number; inspiring: boolean; amp?: number; x: number; y0: number; y1: number}> = ({q, inspiring, amp = 1, x, y0, y1}) => (
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

/** Poumons qui respirent selon `segments` (+ air dans la trachée). */
export const BreathingLungs: React.FC<{segments: BreathSegments; size: number; amp?: number; air?: boolean}> = ({segments, size, amp = 1, air = true}) => {
	const frame = useCurrentFrame();
	const b = breathAt(frame, segments, amp);
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<Lungs breath={b.breath} inspiring={b.inspiring} q={b.q} size={size} />
			{air ? <Air q={b.q} inspiring={b.inspiring} amp={amp} x={size / 2} y0={size * -0.05} y1={size * 0.28} /> : null}
		</div>
	);
};

/** Buste de patient vu de face : la cage thoracique se soulève et s'élargit à l'inspiration. */
export const Chest: React.FC<{breath: number; size?: number}> = ({breath, size = 380}) => {
	const lift = breath * 16;
	const wide = 1 + breath * 0.06;
	return (
		<svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{overflow: 'visible'}}>
			{/* tête + cou */}
			<circle cx={200} cy={44} r={36} fill={LPI.paper} stroke={N} strokeWidth={9} />
			<rect x={178} y={78} width={44} height={30} rx={10} fill={LPI.paper} stroke={N} strokeWidth={8} />
			<g transform={`translate(200 ${300 - lift}) scale(${wide} 1) translate(-200 -300)`}>
				{/* bras */}
				<path d="M74 150 C52 220 46 300 52 400" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
				<path d="M326 150 C348 220 354 300 348 400" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
				{/* buste */}
				<path d="M74 152 C74 124 112 104 160 102 H240 C288 104 326 124 326 152 L312 404 H88 Z" fill={LPI.paper} stroke={N} strokeWidth={9} strokeLinejoin="round" />
				{/* cage thoracique */}
				<path d="M120 150 C110 210 116 270 150 318 H250 C284 270 290 210 280 150 C250 136 150 136 120 150 Z" fill={alpha(LPI.sky, 0.7)} />
				{[0, 1, 2, 3].map((k) => (
					<g key={k}>
						<path d={`M192 ${160 + k * 38} C166 ${154 + k * 38} 140 ${164 + k * 38} 128 ${184 + k * 38}`} fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
						<path d={`M208 ${160 + k * 38} C234 ${154 + k * 38} 260 ${164 + k * 38} 272 ${184 + k * 38}`} fill="none" stroke={LPI.blue} strokeWidth={8} strokeLinecap="round" />
					</g>
				))}
				<rect x={191} y={142} width={18} height={150} rx={9} fill={LPI.paper} stroke={N} strokeWidth={5} />
			</g>
		</svg>
	);
};

/** Tracé respiratoire qui défile : une ondulation par cycle, amplitude modulable (ample / superficielle). */
export const BreathTrace: React.FC<{
	segments: BreathSegments;
	width: number;
	height?: number;
	amp?: number;
	speed?: number;
	color?: string;
	stroke?: number;
	/** amplitude relative selon la frame (ex. respiration qui devient superficielle) */
	ampAt?: (frame: number) => number;
}> = ({segments, width, height = 140, amp = 50, speed = 6, color = LPI.blue, stroke = 9, ampAt}) => {
	const frame = useCurrentFrame();
	// phase de chaque frame passée (intégrée une seule fois)
	const span = Math.ceil(width / speed) + 2;
	const from = Math.max(0, frame - span);
	const phases: number[] = [];
	let ph = breathPhase(from, segments);
	for (let f = from; f <= frame; f++) {
		phases.push(ph);
		let p = segments[0][1];
		for (const s of segments) if (f >= s[0]) p = s[1];
		ph += 1 / p;
	}
	const mid = height / 2;
	const pts: string[] = [];
	for (let x = 0; x <= width; x += 5) {
		const f = frame - (width - x) / speed;
		const i = Math.round(f - from);
		if (i < 0) continue;
		const v = Math.sin(phases[Math.min(i, phases.length - 1)] * Math.PI * 2 - Math.PI / 2);
		pts.push(`${x},${mid - v * amp * (ampAt ? ampAt(Math.round(f)) : 1)}`);
	}
	const head = pts[pts.length - 1].split(',').map(Number);
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<path d={`M0 ${mid} H${width}`} stroke={alpha(N, 0.12)} strokeWidth={4} />
			<polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={head[0]} cy={head[1]} r={stroke * 1.4} fill={LPI.pink} stroke={N} strokeWidth={4} />
		</svg>
	);
};
