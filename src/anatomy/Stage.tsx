// Scène « corps » : caméra (centre + largeur visible, en unités corps), effets de température,
// accessoires et loupes. Toutes les vidéos de la série peuvent s'appuyer dessus.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {alpha, LPI} from '../brand/theme';
import {Body, BodyLook} from './Body';
import {P, rng} from './geometry';

export type Cam = {cx: number; cy: number; w: number};
export type View = {x: number; y: number; w: number; h: number};

const ease = Easing.inOut(Easing.cubic);

/** caméra interpolée entre des positions clés [frame, caméra] */
export const camAt = (frame: number, keys: [number, Cam][]): Cam => {
	if (frame <= keys[0][0]) return keys[0][1];
	for (let i = 0; i < keys.length - 1; i++) {
		const [f0, a] = keys[i];
		const [f1, b] = keys[i + 1];
		if (frame <= f1) {
			const t = ease((frame - f0) / Math.max(1, f1 - f0));
			// zoom interpolé en logarithme : vitesse perçue constante
			const w = Math.exp(Math.log(a.w) + (Math.log(b.w) - Math.log(a.w)) * t);
			return {cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, w};
		}
	}
	return keys[keys.length - 1][1];
};

/** point du corps → pixels écran */
export const project = (cam: Cam, view: View, p: P) => {
	const k = view.w / cam.w;
	const h = view.h / k;
	return {x: view.x + (p[0] - (cam.cx - cam.w / 2)) * k, y: view.y + (p[1] - (cam.cy - h / 2)) * k};
};

/* ─────────── effets de température (unités corps) ─────────── */

const HeatWaves: React.FC<{frame: number; on: number}> = ({frame, on}) => {
	if (on <= 0) return null;
	return (
		<g fill="none" stroke={alpha(LPI.pink, 0.75 * on)} strokeWidth={7} strokeLinecap="round" strokeDasharray="46 30">
			{[300, 400, 500, 600, 700, 220, 780].map((x0, k) => {
				const base = k < 5 ? 300 : 900;
				const pts = Array.from({length: 16}, (_, i) => {
					const y = base - i * 14;
					return `${x0 + 9 * Math.sin((y + frame * 6 + k * 40) / 22)},${y}`;
				}).join(' ');
				return <polyline key={k} points={pts} strokeDashoffset={-frame * 4} />;
			})}
		</g>
	);
};

const Sweat: React.FC<{frame: number; on: number}> = ({frame, on}) => {
	if (on <= 0) return null;
	return (
		<g>
			{[
				[468, 96, 0],
				[536, 110, 14],
				[452, 150, 28],
				[548, 160, 7],
			].map(([x, y, ph], i) => {
				const t = ((frame + ph * 3) % 60) / 60;
				return (
					<path
						key={i}
						d="M0 0 q-7 12 0 17 q7 -5 0 -17 z"
						fill={LPI.blue}
						stroke={LPI.paper}
						strokeWidth={1.5}
						opacity={on * Math.sin(t * Math.PI)}
						transform={`translate(${x} ${y + t * 46}) scale(1.7)`}
					/>
				);
			})}
		</g>
	);
};

const FROST = (() => {
	const r = rng(21);
	const spots: P[] = [[220, 1040], [780, 1040], [400, 1780], [600, 1780], [250, 900], [750, 900], [500, 40]];
	return spots.flatMap(([x, y]) => Array.from({length: 3}, () => [x + (r() - 0.5) * 90, y + (r() - 0.5) * 70, 8 + r() * 10] as [number, number, number]));
})();

const Frost: React.FC<{frame: number; on: number}> = ({frame, on}) => {
	if (on <= 0) return null;
	return (
		<g stroke={LPI.blue} strokeWidth={3.5} strokeLinecap="round" opacity={on}>
			{FROST.map(([x, y, s], i) => (
				<g key={i} transform={`translate(${x} ${y}) rotate(${frame * 1.5 + i * 25}) scale(${s / 10})`}>
					<path d="M0 -10 V10 M-8.7 -5 L8.7 5 M-8.7 5 L8.7 -5" />
				</g>
			))}
		</g>
	);
};

/* ─────────── scène ─────────── */

export const BodyStage: React.FC<{
	id: string;
	frame: number;
	beats: number[];
	look: BodyLook;
	cam: Cam;
	view: View;
	/** accessoires dessinés dans le repère du corps (brassard, oxymètre…) */
	accessories?: React.ReactNode;
	/** calque écran par-dessus (loupes, étiquettes) */
	overlay?: React.ReactNode;
}> = ({id, frame, beats, look, cam, view, accessories, overlay}) => {
	const h = (cam.w * view.h) / view.w;
	const fever = Math.max(0, look.thermal);
	const cold = Math.max(0, -look.thermal);
	const shiver = cold > 0.5 ? Math.sin(frame * 2.7) * 2.2 * cold : 0;
	return (
		<>
			<svg
				width={view.w}
				height={view.h}
				viewBox={`${cam.cx - cam.w / 2} ${cam.cy - h / 2} ${cam.w} ${h}`}
				style={{position: 'absolute', left: view.x, top: view.y, overflow: 'hidden'}}
			>
				<g transform={`translate(${shiver} 0)`}>
					<Body id={id} frame={frame} beats={beats} look={look} px={view.w / cam.w}>
						{accessories}
					</Body>
					<HeatWaves frame={frame} on={fever} />
					<Sweat frame={frame} on={interpolate(fever, [0.5, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
					<Frost frame={frame} on={cold} />
				</g>
			</svg>
			{overlay ? (
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
					{overlay}
				</svg>
			) : null}
		</>
	);
};
