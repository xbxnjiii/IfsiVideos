// Fenêtre « console 8-bit » (série « Les plaies » en pixel art, kit de l'agent d'analyse Instagram, 28/11/2026).
// Principe : la scène se dessine pixel par pixel sur une toile de 160 × 160 « pixels logiques », agrandie × 6 SANS
// lissage (plus proche voisin) → 960 × 960. Elle s'anime à 12 images / s (saccadé voulu), le reste du reel à 30.
// Le cadre du reel (titre, compteur, mascotte, phrases clés) reste dans le style habituel du compte.
// Police pixel : Press Start 2P (SIL OFL, public/fonts/OFL-PressStart2P.txt), tailles 8 ou 16 seulement.
// Palette de la fenêtre (16 couleurs max) : fond et interface tirés des 5 couleurs de la marque, anatomie et code
// couleur des plaies en vraies couleurs (exception « couleurs de manuel » validée). Elle peut évoluer d'une vidéo à
// l'autre (choix laissé à Claude par le propriétaire).
import {loadFont} from '@remotion/fonts';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {alpha, LPI, SHADOW} from './theme';

/** Mélange opaque de deux couleurs (= une transparence de la marque posée sur une autre). */
const mix = (a: string, b: string, k: number) => {
	const pa = parseInt(a.slice(1), 16);
	const pb = parseInt(b.slice(1), 16);
	const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k));
	return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

/** Palette de la fenêtre pixel (16 couleurs). */
export const PX = {
	/** fond de l'écran : bleu nuit de la marque, un peu assombri */
	bg: mix(LPI.navy, '#000000', 0.22),
	/** panneaux et cadres de l'interface */
	panel: LPI.navy,
	/** bordures */
	line: mix(LPI.navy, LPI.blue, 0.55),
	text: LPI.paper,
	/** question, danger */
	pink: LPI.pink,
	/** jauge normale */
	blue: LPI.blue,
	/** jauge moyenne, matelas */
	sky: LPI.sky,
	// anatomie (couleurs de manuel)
	epi: '#F2C6A0',
	derm: '#E3967D',
	fat: '#F5DE8A',
	muscle: '#B5444B',
	bone: '#E8E2D0',
	artery: '#D7263D',
	vein: '#3E6FD8',
	/** rougeur de la peau (érythème) */
	red: '#E0525C',
	/** tissu qui souffre en profondeur (lésion des tissus profonds : violacé) */
	lesion: '#6E2B3D',
} as const;

const RGB: Record<string, [number, number, number]> = {};
const rgb = (hex: string) => (RGB[hex] ??= [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]);

/** Matrice de Bayer 4 × 4 : tramage (pas de transparence dans la fenêtre, on trame). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** true si le pixel (x, y) est « allumé » pour une densité k (0 → 1). */
export const dither = (x: number, y: number, k: number) => k > 0 && (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < k;

export const PIXEL_FONT = 'Press Start 2P';
const fontReady = loadFont({family: PIXEL_FONT, url: staticFile('fonts/PressStart2P-Regular.ttf')}).then(() => document.fonts.load(`8px "${PIXEL_FONT}"`));

let textCanvas: HTMLCanvasElement | null = null;

/** Toile logique : chaque méthode pose des pixels entiers, jamais de demi-pixel ni de lissage. */
export class Px {
	readonly w: number;
	readonly h: number;
	readonly data: Uint8ClampedArray<ArrayBuffer>;
	/** zone de dessin autorisée (loupe ronde…) ; null = toute la toile */
	clip: ((x: number, y: number) => boolean) | null = null;
	constructor(w = 160, h = 160) {
		this.w = w;
		this.h = h;
		this.data = new Uint8ClampedArray(w * h * 4);
	}
	set(x: number, y: number, c: string) {
		x = Math.round(x);
		y = Math.round(y);
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
		if (this.clip && !this.clip(x, y)) return;
		const [r, g, b] = rgb(c);
		const i = (y * this.w + x) * 4;
		this.data[i] = r;
		this.data[i + 1] = g;
		this.data[i + 2] = b;
		this.data[i + 3] = 255;
	}
	fill(c: string) {
		this.rect(0, 0, this.w, this.h, c);
	}
	rect(x: number, y: number, w: number, h: number, c: string) {
		x = Math.round(x);
		y = Math.round(y);
		for (let j = 0; j < Math.round(h); j++) for (let i = 0; i < Math.round(w); i++) this.set(x + i, y + j, c);
	}
	/** contour d'un rectangle (1 pixel) */
	box(x: number, y: number, w: number, h: number, c: string) {
		this.rect(x, y, w, 1, c);
		this.rect(x, y + h - 1, w, 1, c);
		this.rect(x, y, 1, h, c);
		this.rect(x + w - 1, y, 1, h, c);
	}
	/** disque plein (centre au milieu d'un pixel) */
	disk(cx: number, cy: number, r: number, c: string) {
		for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
			for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.set(x, y, c);
	}
	/** cercle de 1 pixel d'épaisseur */
	ring(cx: number, cy: number, r: number, c: string) {
		for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++)
			for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
				const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
				if (d <= r + 0.5 && d > r - 0.5) this.set(x, y, c);
			}
	}
	/** segment (Bresenham) ; `dash` = un pixel sur deux */
	line(x0: number, y0: number, x1: number, y1: number, c: string, dash = false) {
		x0 = Math.round(x0);
		y0 = Math.round(y0);
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		const dx = Math.abs(x1 - x0);
		const dy = -Math.abs(y1 - y0);
		const sx = x0 < x1 ? 1 : -1;
		const sy = y0 < y1 ? 1 : -1;
		let err = dx + dy;
		let k = 0;
		for (;;) {
			if (!dash || k++ % 2 === 0) this.set(x0, y0, c);
			if (x0 === x1 && y0 === y1) break;
			const e2 = 2 * err;
			if (e2 >= dy) {
				err += dy;
				x0 += sx;
			}
			if (e2 <= dx) {
				err += dx;
				y0 += sy;
			}
		}
	}
	/** texte en Press Start 2P (taille 8 ou 16), binarisé : aucun pixel adouci. Renvoie la largeur. */
	text(str: string, x: number, y: number, c: string, size: 8 | 16 = 8) {
		if (!str) return 0;
		textCanvas ??= document.createElement('canvas');
		const W = str.length * size + 4;
		const H = size + 6;
		textCanvas.width = W;
		textCanvas.height = H;
		const ctx = textCanvas.getContext('2d', {willReadFrequently: true})!;
		ctx.clearRect(0, 0, W, H);
		ctx.font = `${size}px "${PIXEL_FONT}"`;
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#fff';
		ctx.fillText(str, 0, 3);
		const img = ctx.getImageData(0, 0, W, H).data;
		for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (img[(j * W + i) * 4 + 3] >= 128) this.set(x + i, y + j - 3, c);
		return str.length * size;
	}
	/** texte avec ombre d'un pixel (lisible sur tout fond) */
	textS(str: string, x: number, y: number, c: string, size: 8 | 16 = 8, shadow: string = PX.bg) {
		this.text(str, x + 1, y + 1, shadow, size);
		return this.text(str, x, y, c, size);
	}
}

/** Quantifie une image à 12 i/s (vidéo à 30 i/s : un pas toutes les 2,5 images). */
export const px12 = (frame: number) => Math.floor(frame / 2.5) * 2.5;

/** Intègre une vitesse (0 → 1 par image à 12 i/s) jusqu'à `f` : phase d'un flux (sang qui circule) sans saut. */
export const flowPhase = (speed: (f: number) => number, f: number) => {
	let s = 0;
	for (let k = 0; k < f; k += 2.5) s += speed(k);
	return s;
};

/**
 * Fenêtre pixel posée dans le reel : cadre bleu nuit arrondi façon console, toile × 6 sans lissage, lignes d'écran.
 * `draw(g, f)` dessine la scène ; `f` = image de la scène quantifiée à 12 i/s.
 */
export const PixelScreen: React.FC<{draw: (g: Px, f: number) => void; x?: number; y?: number; size?: number; logical?: number}> = ({draw, x = 60, y = 400, size = 960, logical = 160}) => {
	const frame = useCurrentFrame();
	const f = px12(frame);
	const ref = useRef<HTMLCanvasElement>(null);
	const [handle] = useState(() => delayRender('police pixel'));
	const released = useRef(false);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fontReady.then(() => setReady(true));
	}, []);
	useLayoutEffect(() => {
		if (!ready || !ref.current) return;
		const g = new Px(logical, logical);
		g.fill(PX.bg);
		draw(g, f);
		ref.current.getContext('2d')!.putImageData(new ImageData(g.data, logical, logical), 0, 0);
		if (!released.current) {
			released.current = true;
			continueRender(handle);
		}
	});
	const k = size / logical;
	return (
		<div style={{position: 'absolute', left: x - 14, top: y - 14, width: size + 28, height: size + 28, borderRadius: 40, background: LPI.navy, boxShadow: SHADOW, padding: 14, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: size, height: size, borderRadius: 26, overflow: 'hidden'}}>
				<canvas ref={ref} width={logical} height={logical} style={{width: size, height: size, imageRendering: 'pixelated', display: 'block'}} />
				{/* lignes d'écran : une ligne logique plus sombre toutes les 4, très discrète */}
				<div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(to bottom, transparent 0 ${3 * k}px, ${alpha(LPI.navy, 0.14)} ${3 * k}px ${4 * k}px)`, pointerEvents: 'none'}} />
			</div>
		</div>
	);
};

/**
 * Écran pixel plein cadre (format « 8bit », sans fenêtre autour) : toile `w` × `h` logiques agrandie × `scale` sans
 * lissage. `zoom` = poussée de caméra (s ≥ 1) vers le point logique (x, y) : les pixels grossissent, toujours nets.
 */
export const PixelFull: React.FC<{draw: (g: Px, f: number) => void; hud?: (g: Px, f: number) => void; w?: number; h?: number; scale?: number; zoom?: {s: number; x: number; y: number}}> = ({draw, hud, w = 180, h = 320, scale = 6, zoom}) => {
	const frame = useCurrentFrame();
	const f = px12(frame);
	const ref = useRef<HTMLCanvasElement>(null);
	const hudRef = useRef<HTMLCanvasElement>(null);
	const [handle] = useState(() => delayRender('police pixel'));
	const released = useRef(false);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fontReady.then(() => setReady(true));
	}, []);
	useLayoutEffect(() => {
		if (!ready || !ref.current) return;
		const g = new Px(w, h);
		g.fill(PX.bg);
		draw(g, f);
		ref.current.getContext('2d')!.putImageData(new ImageData(g.data, w, h), 0, 0);
		if (hudRef.current) {
			const o = new Px(w, h); // calque transparent, jamais zoomé : bulle, pastilles, compteur, jauges
			if (hud) hud(o, f);
			hudRef.current.getContext('2d')!.putImageData(new ImageData(o.data, w, h), 0, 0);
		}
		if (!released.current) {
			released.current = true;
			continueRender(handle);
		}
	});
	const z = zoom && zoom.s > 1.001 ? zoom : null;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: w * scale, height: h * scale, overflow: 'hidden', background: PX.bg}}>
			<canvas
				ref={ref}
				width={w}
				height={h}
				style={{width: w * scale, height: h * scale, imageRendering: 'pixelated', display: 'block', transformOrigin: z ? `${z.x * scale}px ${z.y * scale}px` : undefined, transform: z ? `scale(${z.s})` : undefined}}
			/>
			<canvas ref={hudRef} width={w} height={h} style={{position: 'absolute', left: 0, top: 0, width: w * scale, height: h * scale, imageRendering: 'pixelated'}} />
			<div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(to bottom, transparent 0 ${3 * scale}px, ${alpha(LPI.navy, 0.1)} ${3 * scale}px ${4 * scale}px)`, pointerEvents: 'none'}} />
		</div>
	);
};

/* ───────────────────────────── briques d'interface (HUD) ───────────────────────────── */

/**
 * Bulle de dialogue rétro en haut de la fenêtre (y 3 → 31) : ligne 1 en blanc, ligne 2 (la question) en rose,
 * 17 caractères max par ligne.
 * `typed` = nombre de caractères visibles (machine à écrire), Infinity = tout.
 */
export const pxBubble = (g: Px, l1: string, l2: string, typed = Infinity, y = 3, x = 3) => {
	g.rect(x, y, 154, 28, PX.panel);
	g.box(x, y, 154, 28, PX.text);
	g.box(x + 2, y + 2, 150, 24, PX.line);
	const n1 = Math.min(l1.length, typed);
	const n2 = Math.max(0, Math.min(l2.length, typed - l1.length));
	g.textS(l1.slice(0, n1), x + 6, y + 6, PX.text);
	g.textS(l2.slice(0, n2), x + 6, y + 17, PX.pink);
	// curseur qui clignote après la question
	if (typed >= l1.length + l2.length && Math.floor(typed / 6) % 2 === 0) g.rect(x + 6 + l2.length * 8 + 1, y + 17, 6, 8, PX.pink);
};

/** Nombre de caractères affichés : machine à écrire à `speed` caractères par image depuis `t0`. */
export const typedAt = (f: number, t0: number, speed = 0.9) => (f < t0 ? 0 : Math.floor((f - t0) * speed));

/** Couleur d'une jauge selon la gravité (0 = normal, 1 = danger) : bleu → bleu clair → rose. */
export const pxGaugeTone = (danger: number) => (danger > 0.66 ? PX.pink : danger > 0.33 ? PX.sky : PX.blue);

/**
 * Jauge horizontale avec étiquette au-dessus. `v` 0 → 1 ; `bad` = 'high' si une valeur haute est grave (appui),
 * 'low' si une valeur basse est grave (sang, oxygène). `blink` fait clignoter le remplissage (alerte).
 */
export const pxGauge = (g: Px, label: string, x: number, y: number, w: number, v: number, bad: 'high' | 'low', f = 0, blink = false) => {
	g.textS(label, x, y, PX.text);
	const by = y + 11;
	g.rect(x, by, w, 7, PX.panel);
	g.box(x, by, w, 7, PX.line);
	const fill = Math.round((w - 4) * Math.max(0, Math.min(1, v)));
	const danger = bad === 'high' ? v : 1 - v;
	const tone = blink && danger > 0.66 && Math.floor(f / 5) % 2 === 1 ? PX.red : pxGaugeTone(danger);
	g.rect(x + 2, by + 2, fill, 3, tone);
};

/** Petite flèche pleine (3 à 6 px) : `dir` vers où elle pointe. */
export const pxArrow = (g: Px, x: number, y: number, dir: 'down' | 'up' | 'left' | 'right', c: string = PX.pink, len = 5) => {
	for (let i = 0; i < len; i++) {
		const half = i < len - 3 ? 0 : len - 1 - i;
		for (let k = -half; k <= half; k++) {
			if (dir === 'down') g.set(x + k, y + i, c);
			if (dir === 'up') g.set(x + k, y - i, c);
			if (dir === 'right') g.set(x + i, y + k, c);
			if (dir === 'left') g.set(x - i, y + k, c);
		}
	}
};

/** Grosse croix rose (3 px d'épaisseur) : geste à proscrire. `p` 0 → 1 trace les deux branches. */
export const pxCross = (g: Px, x0: number, y0: number, x1: number, y1: number, p = 1) => {
	const seg = (ax: number, ay: number, bx: number, by: number, q: number) => {
		if (q <= 0) return;
		const ex = ax + (bx - ax) * Math.min(1, q);
		const ey = ay + (by - ay) * Math.min(1, q);
		for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]]) g.line(ax + dx, ay + dy, ex + dx, ey + dy, PX.pink);
	};
	seg(x0, y0, x1, y1, p * 2);
	seg(x1, y0, x0, y1, p * 2 - 1);
};

/**
 * Étiquette avec trait de rappel (comme dans un schéma) : point sur la structure (ax, ay), trait pointillé, texte
 * sur fond bleu nuit en (tx, ty). `typed` = caractères visibles (machine à écrire) ; le trait se trace d'abord.
 */
export const pxLabel = (g: Px, text: string, tx: number, ty: number, ax: number, ay: number, typed = Infinity, tone: string = PX.text) => {
	if (typed <= 0) return;
	const w = text.split('\n').reduce((m, l) => Math.max(m, l.length), 0) * 8;
	const lines = text.split('\n');
	const ex = ax < tx ? tx - 1 : ax > tx + w ? tx + w : ax;
	const ey = ay < ty ? ty - 1 : ty + lines.length * 10;
	const k = Math.min(1, typed / 3);
	g.line(ax, ay, ax + (ex - ax) * k, ay + (ey - ay) * k, PX.text, true);
	g.rect(ax - 1, ay - 1, 3, 3, PX.pink);
	g.set(ax, ay, PX.text);
	if (typed < 3) return;
	let left = typed - 3;
	lines.forEach((l, i) => {
		const n = Math.max(0, Math.min(l.length, left));
		left -= l.length;
		if (n <= 0) return;
		g.rect(tx - 2, ty - 2 + i * 10, n * 8 + 3, 11, PX.panel);
		g.textS(l.slice(0, n), tx, ty + i * 10, tone);
	});
};

/** Pastille de mode en haut à gauche (triangle « lecture » ou double triangle « accéléré ») + texte. */
export const pxTag = (g: Px, text: string, fast = false, x = 4, y = 4) => {
	const w = text.length * 8 + (fast ? 22 : 16);
	g.rect(x, y, w, 14, PX.panel);
	g.box(x, y, w, 14, PX.line);
	const tri = (ox: number) => {
		for (let i = 0; i < 4; i++) g.rect(ox + i, y + 3 + i, 1, 8 - 2 * i, PX.pink);
	};
	tri(x + 4);
	if (fast) tri(x + 9);
	g.textS(text, x + (fast ? 16 : 11), y + 3, PX.text);
};

/** Compteur « n/N » en haut à droite (police 16), qui rebondit d'un pixel quand il change. */
export const pxCounter = (g: Px, n: number, total: number, bump = false, right = 176, y = 4) => {
	const t = `${n}/${total}`;
	const w = t.length * 16 + 8;
	const dy = bump ? -1 : 0;
	g.rect(right - w, y + dy, w, 22, n >= total ? PX.blue : PX.panel);
	g.box(right - w, y + dy, w, 22, PX.text);
	g.textS(t, right - w + 4, y + 3 + dy, PX.text, 16);
};
