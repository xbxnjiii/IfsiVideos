// La mascotte « actrice » : elle se déplace sur TOUT l'écran, change d'expression au mot près.
//
// Deux façons de l'afficher, sans jamais montrer une coupe disgracieuse :
//  - les bustes (expressions, gestes, situations, accessoires) dans une CARTE-RÉACTION : tuile arrondie
//    dont les bords coïncident avec les bords coupés du dessin d'origine ; la tête dépasse en haut ;
//  - les poses en pied (debout, course, marche, assise…) libres, posées sur leurs pieds.
//
// Physique (à réutiliser pour toutes les vidéos) :
//  - entrée : « pop » avec anticipation (−8 %), dépassement ~12 %, petite rotation ;
//  - déplacement : saut en arc (hauteur ∝ distance), rotation dans le sens du mouvement, écrasement à l'atterrissage ;
//  - changement d'expression : écrasement / étirement (squash & stretch) + micro-rotation ;
//  - repos : respiration (±1,5 %) et flottement lent, jamais immobile ;
//  - sortie : rapide (8 frames), accélérée, vers le bord le plus proche.
import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import manifest from '../../public/brand/mascotte-v2/manifest.json';
import {Mascot2Key} from './Mascot2';
import {alpha, LPI} from './theme';
import {clamp} from './ui';

export type Mood = 'pos' | 'alert' | 'calm';

/** Une étape du jeu de la mascotte (frames absolues de la composition). */
export type Beat = {
	at: number;
	key: Mascot2Key;
	/** centre de la carte (bustes) ou point entre les pieds (poses en pied) */
	x: number;
	y: number;
	/** largeur de la carte (bustes) ou hauteur (poses en pied) */
	size: number;
	rot?: number;
	mood?: Mood;
	/** déplacement en courant (pose « course ») au lieu d'un saut */
	run?: boolean;
};

const isBody = (k: Mascot2Key) => k.startsWith('poses/') || k.startsWith('maitre/');
const src = (k: Mascot2Key) => staticFile(`brand/mascotte-v2/${k}.webp`);
const ratio = (k: Mascot2Key) => manifest[k].w / manifest[k].h;

const MOOD_BG: Record<Mood, [string, string]> = {
	pos: [LPI.sky, LPI.paper],
	alert: [LPI.pink, LPI.paper],
	calm: [alpha(LPI.sky, 0.55), LPI.paper],
};

const STICKER = [
	`drop-shadow(4px 0 0 ${LPI.paper})`,
	`drop-shadow(-4px 0 0 ${LPI.paper})`,
	`drop-shadow(0 -4px 0 ${LPI.paper})`,
	`drop-shadow(0 16px 22px ${alpha(LPI.navy, 0.2)})`,
].join(' ');

/** Carte-réaction : tuile arrondie + buste dont la tête dépasse. */
export const ReactionCard: React.FC<{k: Mascot2Key; w: number; mood: Mood}> = ({k, w, mood}) => {
	const h = w * 1.02;
	const iw = w * 1.04;
	const ih = iw / ratio(k);
	const r = w * 0.2;
	const [c1, c2] = MOOD_BG[mood];
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: r,
					background: `linear-gradient(160deg, ${c1} 0%, ${c2} 92%)`,
					border: `${Math.max(5, w * 0.022)}px solid ${LPI.paper}`,
					boxShadow: `0 0 0 3px ${alpha(LPI.navy, 0.9)}, 0 22px 40px ${alpha(LPI.navy, 0.22)}`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: w,
					height: h,
					// côtés et bas découpés sur la tuile ; le haut reste libre (la tête dépasse)
					clipPath: `inset(-60% 3.2% 3.2% 3.2% round 0 0 ${r * 0.85}px ${r * 0.85}px)`,
				}}
			>
				<Img src={src(k)} style={{position: 'absolute', left: (w - iw) / 2, top: h - ih + w * 0.02, width: iw, height: ih}} />
			</div>
		</div>
	);
};

/** courbe d'un saut 0 → 1 (lente au départ, rapide au milieu) */
const easeHop = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const MascotActor: React.FC<{
	beats: Beat[];
	/** frame de sortie (elle file vers le bord le plus proche) */
	exitAt?: number;
	/** durée d'un saut (frames) */
	hop?: number;
}> = ({beats, exitAt, hop = 14}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (!beats.length || frame < beats[0].at - 2) return null;
	if (exitAt !== undefined && frame > exitAt + 12) return null;

	// étape courante et précédente
	let i = 0;
	for (let k = 0; k < beats.length; k++) if (frame >= beats[k].at) i = k;
	const cur = beats[i];
	const prev = beats[Math.max(0, i - 1)];
	const since = frame - cur.at;

	// position : saut (ou course) depuis l'étape précédente
	const moving = i > 0 && since < hop && (prev.x !== cur.x || prev.y !== cur.y);
	const t = i > 0 ? Math.min(1, since / (cur.run ? hop * 1.6 : hop)) : 1;
	const e = cur.run ? t : easeHop(t);
	const dist = Math.hypot(cur.x - prev.x, cur.y - prev.y);
	let x = i > 0 ? prev.x + (cur.x - prev.x) * e : cur.x;
	let y = i > 0 ? prev.y + (cur.y - prev.y) * e : cur.y;
	const lift = moving && !cur.run ? Math.sin(t * Math.PI) * Math.min(220, 70 + dist * 0.3) : moving ? Math.abs(Math.sin(t * Math.PI * 5)) * 16 : 0;
	y -= lift;
	const size = i > 0 && moving ? prev.size + (cur.size - prev.size) * e : cur.size;
	const travelRot = moving ? Math.sign(cur.x - prev.x) * Math.sin(t * Math.PI) * (cur.run ? 6 : 14) : 0;

	// entrée / sortie
	const enter = spring({frame: frame - beats[0].at, fps, config: {damping: 10, stiffness: 200, mass: 0.7}});
	const anticip = interpolate(frame - beats[0].at, [-2, 0], [1, 0.92], clamp);
	let scale = (frame < beats[0].at ? anticip * 0 : 1) * (beats[0].at <= frame ? enter : 0);
	let exitX = 0;
	if (exitAt !== undefined && frame >= exitAt) {
		const p = interpolate(frame, [exitAt, exitAt + 10], [0, 1], {...clamp, easing: (v) => v * v * v});
		exitX = (x > 540 ? 1 : -1) * p * 900;
		scale *= 1 - 0.3 * p;
	}

	// squash & stretch au changement d'expression (et à l'atterrissage)
	const land = moving ? 0 : since - (i > 0 && dist > 0 ? (cur.run ? hop * 1.6 : hop) : 0);
	const sq = i > 0 && land >= 0 ? 0.11 * Math.exp(-land / 4.5) * Math.cos(land * 0.85) : 0;
	const breathe = 1 + 0.015 * Math.sin(frame / 14);
	const sx = (1 + sq) * breathe;
	const sy = (1 - sq) / breathe;
	const float = Math.sin(frame / 21 + i) * 5;
	const wob = Math.sin(frame / 33) * 1.5;

	// pose affichée : pendant une course, image « course »
	const key: Mascot2Key = moving && cur.run ? 'poses/course' : cur.key;
	const body = isBody(key);
	const rot = (cur.rot ?? 0) + travelRot + wob;
	const mood = cur.mood ?? 'calm';

	return (
		<div
			style={{
				position: 'absolute',
				left: x + exitX,
				top: y + (body ? 0 : float),
				transform: `rotate(${rot}deg) scale(${scale * sx}, ${scale * sy})`,
				transformOrigin: body ? 'bottom center' : 'center center',
			}}
		>
			{body ? (
				<Img
					src={src(key)}
					style={{
						position: 'absolute',
						left: (-size * ratio(key)) / 2,
						top: -size,
						height: size,
						width: size * ratio(key),
						filter: STICKER,
					}}
				/>
			) : (
				<div style={{position: 'absolute', left: -size / 2, top: -(size * 1.02) / 2}}>
					<ReactionCard k={key} w={size} mood={mood} />
				</div>
			)}
		</div>
	);
};
