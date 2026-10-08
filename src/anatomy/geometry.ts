// Outils géométriques du corps humain (unités « corps » : 1000 × 1800, axe du corps en x = 500).
import {getLength, getPointAtLength} from '@remotion/paths';

export type P = [number, number];
/** point d'axe + rayon local (membres, vaisseaux) */
export type PR = [number, number, number];

const fmt = (n: number) => Math.round(n * 10) / 10;

/** Courbe lisse (Catmull-Rom → Bézier cubiques) passant par tous les points. */
export const smooth = (pts: P[], closed = false): string => {
	const n = pts.length;
	if (n < 2) return '';
	const at = (i: number): P => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
	let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
	const segs = closed ? n : n - 1;
	for (let i = 0; i < segs; i++) {
		const p0 = at(i - 1);
		const p1 = at(i);
		const p2 = at(i + 1);
		const p3 = at(i + 2);
		const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += ` C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
	}
	return closed ? d + ' Z' : d;
};

/** Contour fermé d'un membre défini par son axe et ses rayons (extrémités arrondies). */
export const limb = (axis: PR[], caps: [boolean, boolean] = [true, true]): string => {
	const n = axis.length;
	const frames = axis.map((p, i) => {
		const a = axis[Math.max(0, i - 1)];
		const b = axis[Math.min(n - 1, i + 1)];
		const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
		const t: P = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
		return {t, nrm: [-t[1], t[0]] as P};
	});
	const off = (i: number, s: number): P => [axis[i][0] + frames[i].nrm[0] * axis[i][2] * s, axis[i][1] + frames[i].nrm[1] * axis[i][2] * s];
	const ANG = [1, 2, 3, 4, 5].map((k) => (k * Math.PI) / 6);
	// bout : de la gauche vers la droite en passant par l'avant ; départ : retour par l'arrière
	const cap = (i: number, dir: 1 | -1): P[] => {
		const {t, nrm} = frames[i];
		const [x, y, r] = axis[i];
		return ANG.map((th) => [
			x + r * (dir * nrm[0] * Math.cos(th) + dir * t[0] * Math.sin(th)),
			y + r * (dir * nrm[1] * Math.cos(th) + dir * t[1] * Math.sin(th)),
		]);
	};
	const left = axis.map((_, i) => off(i, 1));
	const right = axis.map((_, i) => off(i, -1)).reverse();
	return smooth([...left, ...(caps[1] ? cap(n - 1, 1) : []), ...right, ...(caps[0] ? cap(0, -1) : [])], true);
};

/** Miroir gauche ↔ droite autour de l'axe du corps. */
export const mirror = <T extends number[]>(pts: T[]): T[] => pts.map((p) => [1000 - p[0], ...p.slice(1)] as unknown as T);

/* ─────────── échantillonnage des tracés (pour faire circuler le sang) ─────────── */

export type Sampled = {d: string; length: number; pts: Float32Array; step: number};

const cache = new Map<string, Sampled>();

/** Tracé échantillonné une fois pour toutes (positions le long du chemin, tous les `step` unités). */
export const sample = (d: string, step = 3): Sampled => {
	const key = `${step}|${d}`;
	const hit = cache.get(key);
	if (hit) return hit;
	const length = getLength(d);
	const n = Math.max(2, Math.ceil(length / step) + 1);
	const pts = new Float32Array(n * 2);
	for (let i = 0; i < n; i++) {
		const p = getPointAtLength(d, Math.min(length, i * step)) ?? {x: 0, y: 0};
		pts[i * 2] = p.x;
		pts[i * 2 + 1] = p.y;
	}
	const s = {d, length, pts, step};
	cache.set(key, s);
	return s;
};

/** Position (et direction) à la distance `l` le long d'un tracé échantillonné. */
export const pointAt = (s: Sampled, l: number): {x: number; y: number; a: number} => {
	const n = s.pts.length / 2;
	const f = Math.max(0, Math.min(n - 1.001, l / s.step));
	const i = Math.floor(f);
	const k = f - i;
	const x = s.pts[i * 2] + (s.pts[i * 2 + 2] - s.pts[i * 2]) * k;
	const y = s.pts[i * 2 + 1] + (s.pts[i * 2 + 3] - s.pts[i * 2 + 1]) * k;
	const a = Math.atan2(s.pts[i * 2 + 3] - s.pts[i * 2 + 1], s.pts[i * 2 + 2] - s.pts[i * 2]);
	return {x, y, a};
};

/** Petit générateur pseudo-aléatoire déterministe (même rendu à chaque image). */
export const rng = (seed: number) => {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};
