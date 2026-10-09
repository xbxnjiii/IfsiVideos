// La mascotte « actrice » : elle se déplace sur TOUT l'écran, change d'expression au mot près.
//
// Deux façons de l'afficher, sans jamais montrer une coupe disgracieuse :
//  - les bustes (expressions, gestes, situations, accessoires) dans une CARTE-RÉACTION : tuile arrondie
//    dont les bords coïncident avec les bords coupés du dessin d'origine ; la tête dépasse en haut ;
//  - les poses en pied (debout, course, marche, assise…) libres, posées sur leurs pieds, avec ombre au sol.
//
// Physique (à réutiliser pour toutes les vidéos, voir docs/lpi/charte-video.md « Tempo et physique ») :
//  - `pop`  : rétrécit sur place (6 frames, petite anticipation +8 %) puis ressort ailleurs AU MOT
//             (ressort amorti, dépassement ~12 %) — pour rejoindre un terme qui claque ;
//  - `hop`  : accroupie 3 frames, saut en arc (hauteur ∝ distance) centré sur le mot, étirement en l'air,
//             écrasement amorti à l'atterrissage ;
//  - `run`  : course (pose « course », toujours vers la droite : on ne retourne jamais l'image) ;
//  - `cut`  : changement d'expression sur place + écrasement / étirement ;
//  - repos  : respiration (±1,5 %) et flottement lent, jamais immobile ;
//  - `fx`   : métaphores physiques du mot (souffle court, frisson, colère, lenteur, joie).
import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import manifest from '../../public/brand/mascotte-v2/manifest.json';
import {Mascot2Key} from './Mascot2';
import {alpha, LPI} from './theme';

export type Mood = 'pos' | 'alert' | 'calm';
export type Via = 'hop' | 'run' | 'pop' | 'cut';
export type Fx = 'pant' | 'shiver' | 'shake' | 'slow' | 'bounce';

/** Une étape du jeu de la mascotte (frames absolues de la composition). */
export type Beat = {
	/** frame du mot : la nouvelle expression est visible à cet instant (saut centré dessus) */
	at: number;
	key: Mascot2Key;
	/** centre de la carte (bustes) ou point entre les pieds (poses en pied) */
	x: number;
	y: number;
	/** largeur de la carte (bustes) ou hauteur (poses en pied) */
	size: number;
	rot?: number;
	mood?: Mood;
	/** façon de rejoindre cette étape (défaut : `hop` si la place change, sinon `cut`) */
	via?: Via;
	/** durée du déplacement (frames) */
	dur?: number;
	fx?: Fx;
	/** hauteur max de l'arc d'un saut (px) — petite pour un saut « au ralenti » qui ne doit rien masquer */
	arc?: number;
};

const isBody = (k: Mascot2Key) => k.startsWith('poses/') || k.startsWith('maitre/');
const src = (k: Mascot2Key) => staticFile(`brand/mascotte-v2/${k}.webp`);
const ratio = (k: Mascot2Key) => manifest[k].w / manifest[k].h;

const MOOD_BG: Record<Mood, [string, string]> = {
	pos: [LPI.sky, LPI.paper],
	alert: [LPI.pink, LPI.paper],
	calm: [alpha(LPI.sky, 0.55), LPI.paper],
};

const ALERT = /stressee|surprise|en-colere|triste|decue|fatiguee|attention|probleme|erreur|facepalm/;
const POS = /joyeuse|grand-sourire|bravo|bonne-reponse|ok|valide|felicite|encourage|clin-doeil|eureka|bras-ouverts/;
const moodOf = (k: Mascot2Key): Mood => (ALERT.test(k) ? 'alert' : POS.test(k) ? 'pos' : 'calm');

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
					border: `${Math.min(w * 0.05, Math.max(5, w * 0.022))}px solid ${LPI.paper}`,
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
const POP_OUT = 6;
const CROUCH = 3;

type Plan = Beat & {via: Via; dur: number; start: number; land: number; dist: number};

/** Pré-calcule départ / atterrissage de chaque étape. */
export const planBeats = (beats: Beat[]): Plan[] =>
	beats.map((b, i) => {
		const prev = beats[i - 1];
		const dist = prev ? Math.hypot(b.x - prev.x, b.y - prev.y) : 0;
		const via: Via = i === 0 ? 'pop' : (b.via ?? (dist > 0 ? 'hop' : 'cut'));
		const dur = b.dur ?? (via === 'run' ? 22 : via === 'hop' ? Math.round(Math.min(20, Math.max(12, 10 + dist / 60))) : 0);
		const start = via === 'hop' || via === 'run' ? b.at - Math.round(dur / 2) : via === 'pop' ? b.at - (i === 0 ? 0 : POP_OUT) : b.at;
		const land = via === 'hop' || via === 'run' ? start + dur : b.at;
		return {...b, via, dur, start, land, dist};
	});

/** Effets « métaphore » au repos. */
const fxOffsets = (fx: Fx | undefined, f: number) => {
	switch (fx) {
		case 'pant':
			return {dx: 0, dy: 0, rot: 0, s: 0.035 * Math.sin(f * 1.1)};
		case 'shiver':
			return {dx: 3.5 * Math.sin(f * 2.7) + 2 * Math.sin(f * 4.1), dy: 0, rot: 0.9 * Math.sin(f * 3.3), s: 0};
		case 'shake':
			return {dx: 3 * Math.sin(f * 2.3), dy: 0, rot: 3 * Math.sin(f * 1.7), s: 0};
		case 'slow':
			return {dx: 0, dy: 0, rot: 0, s: 0.04 * Math.sin(f / 9.5)};
		case 'bounce':
			return {dx: 0, dy: -Math.abs(Math.sin(f * 0.26)) * 26, rot: 0, s: 0};
		default:
			return {dx: 0, dy: 0, rot: 0, s: 0};
	}
};

const TILT = [-4, 3, -2, 4, -3, 2];

/** Place équivalente quand on passe d'un buste (centre, largeur) à une pose en pied (pieds, hauteur) ou l'inverse. */
const asRep = (b: {key: Mascot2Key; x: number; y: number; size: number}, toBody: boolean) => {
	const body = isBody(b.key);
	if (body === toBody) return b;
	if (body) return {...b, y: b.y - b.size * 0.5, size: b.size * 0.62};
	return {...b, y: b.y + b.size * 0.8, size: b.size * 1.6};
};

export const MascotActor: React.FC<{beats: Beat[]}> = ({beats}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const plan = React.useMemo(() => planBeats(beats), [beats]);
	if (!plan.length || frame < plan[0].at) return null;

	let i = 0;
	for (let k = 0; k < plan.length; k++) if (frame >= plan[k].start) i = k;
	const cur = plan[i];
	const prev = plan[Math.max(0, i - 1)];
	const next = plan[i + 1];

	let key: Mascot2Key = cur.key;
	let x = cur.x;
	let y = cur.y;
	let size = cur.size;
	let scale = 1;
	let rot = cur.rot ?? (isBody(cur.key) ? 0 : TILT[i % TILT.length]);
	let sx = 1;
	let sy = 1;
	let lift = 0;
	let resting = true;
	let restSince = frame - cur.land;

	if (cur.via === 'pop') {
		if (frame < cur.at) {
			// rétrécit à l'ancienne place
			const q = (frame - cur.start) / POP_OUT;
			key = prev.key;
			x = prev.x;
			y = prev.y;
			size = prev.size;
			rot = prev.rot ?? (isBody(prev.key) ? 0 : TILT[(i - 1) % TILT.length]);
			scale = q < 0.3 ? 1 + 0.08 * (q / 0.3) : 1.08 * (1 - Math.pow((q - 0.3) / 0.7, 2));
			rot += 12 * q;
			resting = false;
		} else {
			const s = spring({frame: frame - cur.at, fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
			scale = s;
			rot += (1 - s) * -14;
			restSince = 99;
		}
	} else if (cur.via === 'hop' || cur.via === 'run') {
		const t = Math.min(1, (frame - cur.start) / cur.dur);
		if (t < 1) {
			resting = false;
			const e = cur.via === 'run' ? t : easeHop(t);
			const from = asRep(prev, cur.via === 'run' || isBody(cur.key));
			x = from.x + (cur.x - from.x) * e;
			y = from.y + (cur.y - from.y) * e;
			size = from.size + (cur.size - from.size) * e;
			if (cur.via === 'run') {
				key = 'poses/course';
				lift = Math.abs(Math.sin(t * Math.PI * 4)) * 18;
			} else {
				lift = Math.sin(t * Math.PI) * (cur.arc ?? Math.min(240, 60 + cur.dist * 0.35));
				rot += Math.sign(cur.x - prev.x) * Math.sin(t * Math.PI) * 12;
				const st = Math.sin(t * Math.PI);
				sy = 1 + 0.12 * st;
				sx = 1 - 0.07 * st;
			}
		}
	}

	// accroupie juste avant un saut
	if (resting && next && next.via === 'hop' && frame >= next.start - CROUCH) {
		const c = (frame - (next.start - CROUCH)) / CROUCH;
		sx *= 1 + 0.09 * c;
		sy *= 1 - 0.1 * c;
	}

	// écrasement amorti après l'atterrissage / le changement d'expression
	if (resting && i > 0 && restSince >= 0 && restSince < 40) {
		const sq = 0.11 * Math.exp(-restSince / 4.5) * Math.cos(restSince * 0.85);
		sx *= 1 + sq;
		sy *= 1 - sq;
	}

	const body = isBody(key);
	if (size < 8 || scale <= 0.01) return null;
	const fx = resting ? fxOffsets(cur.fx, frame) : {dx: 0, dy: 0, rot: 0, s: 0};
	const breathe = 1 + 0.015 * Math.sin(frame / 14) + fx.s;
	sx *= breathe;
	sy /= cur.fx === 'slow' || cur.fx === 'pant' ? 1 / breathe : breathe;
	const float = body ? 0 : Math.sin(frame / 21 + i) * 5;
	rot += Math.sin(frame / 33) * 1.5 + fx.rot;
	const mood = cur.mood ?? moodOf(key);
	const groundY = y;

	return (
		<>
			{body && scale > 0.05 ? (
				// ombre au sol : se rétrécit quand elle saute
				<div
					style={{
						position: 'absolute',
						left: x + fx.dx - size * 0.22,
						top: groundY - size * 0.025,
						width: size * 0.44,
						height: size * 0.05,
						borderRadius: '50%',
						background: alpha(LPI.navy, 0.14 * scale),
						transform: `scale(${1 - Math.min(0.6, (lift - fx.dy) / 300)})`,
					}}
				/>
			) : null}
			<div
				style={{
					position: 'absolute',
					left: x + fx.dx,
					top: y - lift + fx.dy + float,
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
		</>
	);
};

/** Liste des instants où la mascotte bouge (pour les bruitages). */
export const beatMoves = (beats: Beat[]) =>
	planBeats(beats)
		.filter((b, i) => i > 0)
		.map((b) => ({at: b.via === 'pop' ? b.at : b.start, via: b.via, x: b.x}));
