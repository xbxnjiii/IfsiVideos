import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import manifest from '../../public/brand/mascotte-v2/manifest.json';
import {alpha, LPI} from './theme';
import {clamp} from './ui';

/** Clés disponibles : « gestes/attention », « situations/recapitule », « expressions/surprise »… */
export type Mascot2Key = keyof typeof manifest;

const STICKER = [
	`drop-shadow(5px 0 0 ${LPI.paper})`,
	`drop-shadow(-5px 0 0 ${LPI.paper})`,
	`drop-shadow(0 5px 0 ${LPI.paper})`,
	`drop-shadow(0 -5px 0 ${LPI.paper})`,
	`drop-shadow(0 18px 26px ${alpha(LPI.navy, 0.18)})`,
].join(' ');

const src = (key: Mascot2Key) => staticFile(`brand/mascotte-v2/${key}.webp`);
const ratio = (key: Mascot2Key) => manifest[key].w / manifest[key].h;

/** Index de la pose courante. */
const currentPose = (poses: [number, Mascot2Key][], frame: number) => {
	let cur = 0;
	poses.forEach(([at], i) => {
		if (frame >= at) cur = i;
	});
	return cur;
};

/**
 * Mascotte officielle (planche v2).
 *
 * - sans `bubble` : ancrée par le bas-centre en (x, y) ; petit saut + rebond à chaque geste.
 * - avec `bubble` (rayon) : les bustes « sortent » d'une pastille bleu clair centrée en (x, y)
 *   (effet sticker pop-out). À chaque geste, l'ancienne pose replonge et la nouvelle surgit.
 *   Le bord plat des bustes reste caché dans la pastille.
 */
/**
 * Déplacements : [frame de départ, x, y] — la mascotte saute (arc) d'un point au suivant en `hop` frames.
 * Avec `run`, elle se déplace à plat (course) au lieu de sauter.
 */
export type Moves = [number, number, number][];

export const moveAt = (frame: number, moves: Moves, hop = 16, run = false) => {
	let x = moves[0][1];
	let y = moves[0][2];
	let lift = 0;
	let moving = false;
	for (let i = 1; i < moves.length; i++) {
		const [at, nx, ny] = moves[i];
		if (frame <= at) break;
		const t = Math.min(1, (frame - at) / hop);
		const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
		const px = x;
		const py = y;
		x = px + (nx - px) * e;
		y = py + (ny - py) * e;
		if (t < 1) {
			moving = true;
			lift = run ? Math.abs(Math.sin(t * Math.PI * 4)) * 14 : Math.sin(t * Math.PI) * Math.min(160, 60 + Math.hypot(nx - px, ny - py) * 0.25);
		}
	}
	return {x, y, lift, moving};
};

export const Mascot2: React.FC<{
	poses: [number, Mascot2Key][];
	x: number;
	y: number;
	height: number;
	from?: 'left' | 'right' | 'bottom';
	exitAt?: number;
	bubble?: number;
	/** déplacements (remplacent x / y) */
	moves?: Moves;
	hop?: number;
	run?: boolean;
}> = ({poses, x: x0, y: y0, height, from = 'right', exitAt, bubble, moves, hop = 16, run = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const mv = moves ? moveAt(frame, moves, hop, run) : {x: x0, y: y0, lift: 0, moving: false};
	const x = mv.x;
	const y = mv.y - mv.lift;
	if (frame < poses[0][0] - 1) return null;
	const enter = spring({frame: frame - poses[0][0], fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
	const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], clamp);
	const float = Math.sin(frame / 22) * 6;
	const tilt = Math.sin(frame / 37) * 1.2;

	if (bubble !== undefined) {
		const r = bubble;
		const top = height * 1.25; // place au-dessus du centre pour la tête et les bras
		const W = r * 4;
		const cx = W / 2;
		const cy = top;
		// forme de découpe : large au-dessus du centre de la pastille, cercle en dessous
		const clip = `path('M${cx - 1.7 * r} 0 H${cx + 1.7 * r} V${cy} H${cx + r} A${r} ${r} 0 0 1 ${cx - r} ${cy} H${cx - 1.7 * r} Z')`;
		const disc = spring({frame: frame - poses[0][0], fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
		const out = 1 - exit;
		return (
			<div
				style={{
					position: 'absolute',
					left: x - cx,
					top: y - cy,
					width: W,
					height: cy + r + 30,
					transform: `scale(${out})`,
					transformOrigin: `${cx}px ${cy}px`,
					opacity: out,
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: cx - r,
						top: cy - r,
						width: 2 * r,
						height: 2 * r,
						borderRadius: 999,
						background: LPI.sky,
						border: `6px solid ${LPI.paper}`,
						boxShadow: `0 18px 40px ${alpha(LPI.navy, 0.14)}`,
						transform: `scale(${disc})`,
					}}
				/>
				<div style={{position: 'absolute', inset: 0, clipPath: clip}}>
					{poses.map(([at, key], i) => {
						const next = poses[i + 1]?.[0];
						// la 1re pose surgit à l'entrée ; les suivantes 3 frames après la plongée de la précédente
						const rise = spring({
							frame: frame - at - (i === 0 ? 4 : 3),
							fps,
							config: {damping: 11, stiffness: 190, mass: 0.7},
						});
						const sink =
							next === undefined
								? 0
								: interpolate(frame, [next, next + 5], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
						if (rise <= 0.001 || sink >= 1) return null;
						const w = ratio(key) * height;
						const dy = (1 - rise) * height * 0.95 + sink * height * 0.95;
						return (
							<Img
								key={`${key}-${i}`}
								src={src(key)}
								style={{
									position: 'absolute',
									left: cx - w / 2,
									top: cy + r + 8 - height,
									width: w,
									height,
									filter: STICKER,
									transform: `translateY(${dy + float * 0.5}px) rotate(${tilt}deg)`,
									transformOrigin: 'bottom center',
								}}
							/>
						);
					})}
				</div>
			</div>
		);
	}

	const d = (1 - enter) * 220 + exit * 260;
	const offset = from === 'left' ? `translateX(${-d}px)` : from === 'right' ? `translateX(${d}px)` : `translateY(${d}px)`;
	const cur = currentPose(poses, frame);
	const since = frame - poses[cur][0];
	const bounce = cur === 0 ? 0 : Math.max(0, Math.sin(Math.min(1, since / 9) * Math.PI)) * 26;
	const squash = cur === 0 ? 1 : 1 + 0.06 * Math.exp(-since / 4) * Math.cos(since * 0.9);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity: Math.min(1, enter * 1.6) * (1 - exit),
				transform: `${offset} translateY(${float - bounce}px) rotate(${tilt}deg) scale(${2 - squash}, ${squash})`,
				transformOrigin: 'bottom center',
			}}
		>
			{poses.map(([at, key], i) => {
				const next = poses[i + 1]?.[0];
				const fadeIn = i === 0 ? 1 : interpolate(frame, [at, at + 4], [0, 1], clamp);
				const fadeOut = next === undefined ? 1 : interpolate(frame, [next, next + 4], [1, 0], clamp);
				const o = fadeIn * fadeOut;
				if (o <= 0) return null;
				const w = ratio(key) * height;
				return (
					<Img
						key={`${key}-${i}`}
						src={src(key)}
						style={{position: 'absolute', left: -w / 2, top: -height, width: w, height, opacity: o, filter: STICKER}}
					/>
				);
			})}
		</div>
	);
};
