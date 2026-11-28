// Scènes pixel plein cadre de la série « Les plaies » (toile 180 × 320 de pixel.tsx, × 6 = 1080 × 1920), dans l'esprit
// des comptes « 8bit » demandé par le propriétaire : on oublie tout autour et on plonge en très gros plan sur ce qui se
// passe. Deux plans :
// - `pxBedScene` : la situation (patient allongé dans sa chambre, réticule sur le sacrum) ;
// - `pxSacrumSection` : la coupe au sacrum, RETOURNÉE (patient sur le dos : l'os en haut, la peau en bas contre le
//   matelas), dessinée pixel par pixel : os spongieux, muscle en fibres, graisse en lobules, derme, épiderme, vaisseaux
//   où les globules rouges avancent, oxygène qui diffuse, lésion profonde en cône contre l'os, rougeur, cisaillement
//   sous la main qui frotte, sang qui fuit des petits vaisseaux abîmés, décharge (le matelas s'éloigne), matelas à air.
// Exactitude : l'escarre commence en profondeur à l'interface os / muscle (NPIAP, lésion des tissus profonds) et la
// peau ne montre qu'ensuite une rougeur. Jamais de photo de plaie : aplats tramés stylisés.
import {dither, PX, Px, pxArrow} from './pixel';

/** Couleurs « mise en situation » (vraies couleurs) en plus de la palette de la fenêtre. */
export const PX_REAL = {hair: '#5A3E2B'} as const;

const G = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
const hash = (a: number, b: number) => (((a * 73856093) ^ (b * 19349663)) >>> 0) % 1000;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Cellules (Voronoï sur grille jittée) : écart entre les deux centres les plus proches (petit = bord de cellule). */
const cellEdge = (x: number, y: number, cell: number, seed: number) => {
	const gx = Math.floor(x / cell);
	const gy = Math.floor(y / cell);
	let d1 = 1e9;
	let d2 = 1e9;
	for (let j = -1; j <= 1; j++)
		for (let i = -1; i <= 1; i++) {
			const cx = (gx + i) * cell + (0.2 + (hash(gx + i + seed, gy + j) / 1000) * 0.6) * cell;
			const cy = (gy + j) * cell + (0.2 + (hash(gy + j + seed * 3, gx + i + 17) / 1000) * 0.6) * cell;
			const d = Math.hypot(x - cx, y - cy);
			if (d < d1) [d1, d2] = [d, d1];
			else if (d < d2) d2 = d;
		}
	return {edge: d2 - d1, d1};
};

/* ════════════════════════ plan large : le patient dans sa chambre ════════════════════════ */
/** Point du sacrum dans le plan large (pour le réticule et la poussée de caméra). */
export const BED_SACRUM = {x: 104, y: 205};

/**
 * Plan large serré : patient allongé sur le dos, de profil, de la tête aux genoux, dans sa chambre (la caméra est
 * proche : on voit surtout le corps contre le matelas). `ring` = réticule pointillé qui pulse sur le sacrum.
 */
export const pxBedScene = (g: Px, f: number, ring = 1) => {
	// mur à lattes, fenêtre, sol
	g.rect(0, 0, 180, 262, PX.panel);
	for (let y = 10; y < 262; y += 20) g.rect(0, y, 180, 1, PX.bg);
	g.rect(110, 70, 62, 74, PX.line);
	g.rect(114, 74, 54, 66, PX.sky);
	g.rect(139, 74, 3, 66, PX.line);
	g.rect(114, 105, 54, 3, PX.line);
	g.rect(118, 78, 12, 3, PX.text);
	g.rect(0, 262, 180, 58, PX.bg);
	g.rect(0, 260, 180, 3, PX.line);
	// matelas épais, drap, sommier, pieds
	g.rect(0, 205, 180, 24, PX.sky);
	g.rect(0, 205, 180, 2, PX.text);
	for (let x = 6; x < 180; x += 22) g.rect(x, 210, 1, 18, PX.line);
	g.rect(0, 229, 180, 7, PX.line);
	g.rect(150, 236, 7, 24, PX.line);
	g.rect(12, 236, 7, 24, PX.line);
	// oreiller
	g.rect(0, 182, 44, 23, PX.text);
	g.rect(0, 200, 44, 5, PX.sky);
	g.rect(40, 186, 4, 17, PX.sky);
	// tête de profil : visage, oreille, cheveux
	g.disk(20, 172, 15, PX.epi);
	g.rect(4, 156, 26, 9, PX_REAL.hair);
	g.rect(4, 156, 9, 26, PX_REAL.hair);
	g.disk(14, 174, 3, PX.derm); // oreille
	g.rect(34, 170, 5, 4, PX.epi); // nez
	g.rect(28, 166, 4, 1, PX.bg); // œil fermé
	g.rect(29, 180, 5, 1, PX.derm); // bouche
	// cou + blouse
	g.rect(30, 182, 14, 10, PX.epi);
	// corps sous la couverture : poitrine, ventre, bassin contre le matelas, cuisses
	for (let x = 40; x < 180; x++) {
		const top = Math.round(205 - (x < 92 ? 34 - Math.max(0, x - 70) * 0.15 : x < 120 ? 31 - (x - 92) * 0.3 : 22 + 7 * G(x, 160, 14)));
		g.rect(x, top, 1, 205 - top, PX.blue);
		g.set(x, top, PX.sky);
		if ((x + 9) % 26 === 0) g.rect(x, top + 3, 1, 205 - top - 6, PX.line); // plis
	}
	// bras posé sur la couverture
	g.rect(52, 178, 48, 7, PX.epi);
	g.rect(52, 184, 48, 1, PX.derm);
	g.rect(100, 177, 11, 9, PX.epi);
	// réticule pointillé qui pulse sur le sacrum (zone d'appui)
	if (ring > 0) {
		const r = 14 + (Math.floor(f / 5) % 2) * 3;
		for (let a = 0; a < 64; a++) {
			if (a % 4 > 1) continue;
			const t = (a / 64) * Math.PI * 2;
			g.set(BED_SACRUM.x + Math.cos(t) * r, BED_SACRUM.y + Math.sin(t) * r, PX.pink);
		}
		g.rect(BED_SACRUM.x - 2, BED_SACRUM.y - 2, 5, 3, PX.red);
	}
};

/* ════════════════════════ très gros plan : la coupe au sacrum ════════════════════════ */
export type SectionState = {
	/** écrasement entre l'os et le matelas (ou la main) */
	comp: number;
	/** cisaillement : décalage horizontal de la peau sous la main qui frotte (px) */
	shear: number;
	/** le matelas s'éloigne (décharge), en px */
	gap: number;
	/** matelas adapté (cellules d'air) */
	air: boolean;
	/** le matelas est visible (sinon le patient est tourné : vide sous la peau) */
	mattress: boolean;
	/** phase du flux sanguin (flowPhase) */
	phase: number;
	/** oxygène qui diffuse dans les tissus (0 → 1) */
	o2: number;
	/** profondeur de la lésion depuis l'os (0 → 1) et densité du tramage */
	lesion: number;
	lesionK: number;
	pulse: boolean;
	/** rougeur de la peau */
	rougeur: number;
	/** sang qui fuit des petits vaisseaux abîmés (0 → 1) */
	leak: number;
	/** main qui frotte : montée (0 → 1) */
	hand: number;
	/** flèches de pression (poids / matelas) */
	arrows: number;
	/** doigt qui appuie sur la peau (0 → 1) */
	finger: number;
	f: number;
};

export const SECTION_DEFAULT: SectionState = {comp: 1, shear: 0, gap: 0, air: false, mattress: true, phase: 0, o2: 0.15, lesion: 0.42, lesionK: 1, pulse: false, rougeur: 1, leak: 0, hand: 0, arrows: 0, finger: 0, f: 0};

/** Centre de la proéminence osseuse (sacrum) et repères de la coupe. */
export const SEC = {cx: 90, skin: 286};

/** Repères pour poser les étiquettes : bas de l'os, surface de la peau, et y d'une profondeur d (0 = os, 1 = peau). */
export const secBone = (x: number) => 96 + 26 * G(x, SEC.cx, 34);
export const secSurface = (x: number, s: Pick<SectionState, 'comp' | 'finger'>) => SEC.skin - s.comp * 24 * G(x, SEC.cx, 46) - s.finger * 7 * G(x, SEC.cx, 9);
export const secY = (x: number, d: number, s: Pick<SectionState, 'comp' | 'finger'>) => Math.round(secBone(x) + d * (secSurface(x, s) - secBone(x)));

/** Profondeurs des couches et des vaisseaux. */
export const SEC_D = {muscle: 0.3, fat: 0.64, skin: 0.92, deep: 0.15, art: 0.72, vein: 0.81};

export const pxSacrumSection = (g: Px, s: SectionState) => {
	const W = g.w;
	const H = g.h;
	const bone: number[] = [];
	const surf: number[] = [];
	for (let x = -60; x < W + 60; x++) {
		bone[x + 60] = secBone(x);
		surf[x + 60] = secSurface(x, s);
	}
	const at = (arr: number[], x: number) => arr[Math.max(0, Math.min(arr.length - 1, x + 60))];
	const pinchAt = (x: number) => s.comp * G(x, SEC.cx, 34) > 0.45;
	const vessels: [number, string, string][] = [
		[SEC_D.deep, PX.artery, PX.red],
		[SEC_D.art, PX.artery, PX.red],
		[SEC_D.vein, PX.vein, PX.sky],
	];
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			// cisaillement : plus on s'approche de la peau, plus la couche glisse avec la main
			const d0 = (y - at(bone, x)) / (at(surf, x) - at(bone, x));
			const xs = Math.round(x - s.shear * clamp01(d0) ** 1.4);
			const b = at(bone, xs);
			const sf = at(surf, xs);
			const d = (y - b) / (sf - b);
			let c: string = PX.bg;
			if (d < 0) {
				// os : corticale claire contre le muscle, spongieux en alvéoles
				if (b - y < 4) c = PX.text;
				else {
					const v = cellEdge(xs + 400, y, 10, 5);
					c = v.edge < 1.5 ? PX.fat : PX.bone;
				}
			} else if (d < 1) {
				if (d < SEC_D.muscle) {
					c = PX.muscle;
					if ((y + Math.round(1.5 * Math.sin(xs / 11)) + 400) % 4 === 0 && hash(xs >> 4, y) % 9 !== 0) c = PX.derm; // fibres ondulées
				} else if (d < SEC_D.fat) {
					// lobules de graisse : cellules jaunes bordées
					const v = cellEdge(xs + 400, y, 9, 11);
					c = v.edge < 1.4 ? PX.derm : PX.fat;
					if (v.edge >= 1.4 && v.d1 < 1.1) c = PX.bone; // reflet au cœur de la cellule
				} else if (d < SEC_D.skin) {
					c = PX.derm;
					if (dither(xs, y, 0.12)) c = PX.epi; // fibres de collagène
				} else {
					c = PX.epi;
					if (y >= Math.round(sf) - 1) c = PX.derm;
				}
				// rougeur : le derme et l'épiderme rougissent au centre
				if (d > SEC_D.fat && dither(xs, y, s.rougeur * G(xs, SEC.cx, 26) * (d > SEC_D.skin ? 1 : 0.7))) c = PX.red;
				// vaisseaux : paroi + lumière + globules rouges qui avancent ; écrasés (paroi contre paroi) sous l'appui
				const pinched = pinchAt(xs);
				for (const [vc, wall, lumen] of vessels) {
					const dd = Math.abs(d - vc) * (sf - b);
					const half = pinched ? 0.5 : 2.4;
					if (dd <= half + 0.6) {
						if (pinched || dd > half - 0.6) c = wall;
						else {
							c = lumen;
							const k = (((xs - Math.floor(s.phase)) % 7) + 700) % 7;
							if (k < 2) c = lumen === PX.sky ? PX.vein : PX.artery;
						}
					}
				}
				// lésion profonde : cône contre l'os, qui s'étend vers la peau
				const hw = 40 * (1 - d * 0.6) + ((hash(y >> 2, 9) % 9) - 4) * 0.9;
				const lim = s.lesion + ((hash(xs >> 2, 4) % 9) - 4) * 0.008;
				if (d < lim && Math.abs(xs - SEC.cx) < hw) {
					const edge = Math.min(1, (hw - Math.abs(xs - SEC.cx)) / 7, (lim - d) * 8);
					const k = s.lesionK * edge * (s.pulse && Math.floor(s.f / 5) % 2 === 1 ? 0.6 : 0.85);
					if (dither(xs, y, k)) c = hash(xs, y) % 11 === 0 ? PX.artery : PX.lesion;
				}
			} else if (s.mattress) {
				const top = sf + s.gap;
				if (y >= top) {
					// matelas : housse et piqûres ; matelas à air : cellules arrondies
					c = PX.sky;
					if (y < top + 1) c = PX.text;
					else if (s.air) {
						const cx = (x + 400) % 14;
						c = cx === 0 || cx === 13 ? PX.line : y < top + 4 && cx > 3 && cx < 7 ? PX.text : PX.sky;
					} else if ((x + 400) % 18 === 0 && y % 3 === 0) c = PX.line;
				}
			}
			g.set(x, y, c);
		}
	}
	// oxygène : petites bulles qui quittent les artérioles vers les tissus (elles s'arrêtent si le sang ne passe plus)
	for (let i = 0; i < 80; i++) {
		if (hash(i, 7) / 1000 > s.o2) continue;
		const x = (i * 37 + 11) % 180;
		if (pinchAt(x)) continue;
		const life = ((s.f / 2.5 + i * 5) % 18) / 18;
		const from = i % 2 ? SEC_D.art : SEC_D.deep;
		const y = secY(x, from, s) + Math.round(life * 14) * (i % 2 ? -1 : 1);
		g.rect(x, y, 1, 1, PX.sky);
	}
	// sang qui fuit : globules rouges en amas dans les tissus autour des vaisseaux abîmés
	if (s.leak > 0) {
		const n = Math.round(s.leak * 240);
		for (let i = 0; i < n; i++) {
			const a = (hash(i, 3) / 1000) * Math.PI * 2;
			const r = Math.sqrt(hash(i, 5) / 1000) * (8 + 30 * s.leak);
			const x = Math.round(SEC.cx - 6 + Math.cos(a) * r * 1.5 + s.shear * 0.6);
			const y = secY(x, SEC_D.art, s) + Math.round(Math.sin(a) * r * 0.55);
			g.rect(x, y, 2, 2, i % 5 === 0 ? PX.red : PX.artery);
		}
	}
	// flèches : le poids du corps appuie sur l'os, le matelas repousse la peau
	if (s.arrows > 0) {
		for (const ax of [SEC.cx - 34, SEC.cx, SEC.cx + 34]) pxArrow(g, ax, 44, 'down', PX.pink, 9);
		if (s.mattress && s.gap < 2) for (const ax of [SEC.cx - 34, SEC.cx, SEC.cx + 34]) pxArrow(g, ax, Math.round(at(surf, ax)) + 22, 'up', PX.pink, 9);
	}
	// la main qui frotte, sous la peau (patient tourné)
	if (s.hand > 0) {
		const hx = Math.round(SEC.cx - 46 + s.shear);
		const hy = Math.round(at(surf, SEC.cx) + 1 + (1 - s.hand) * 40);
		g.rect(hx, hy, 92, 34, PX.epi);
		g.rect(hx, hy, 92, 1, PX.derm);
		for (let i = 1; i < 5; i++) g.rect(hx + i * 18, hy + 4, 1, 30, PX.derm); // doigts
		for (let i = 0; i < 5; i++) g.rect(hx + 5 + i * 18, hy + 2, 8, 2, PX.text); // ongles
		pxArrow(g, hx - 4, hy + 12, 'left', PX.pink, 8);
		pxArrow(g, hx + 95, hy + 12, 'right', PX.pink, 8);
	}
	// le doigt qui appuie sur la rougeur
	if (s.finger > 0) {
		const fy = Math.round(at(surf, SEC.cx) + (1 - s.finger) * 30);
		g.rect(SEC.cx - 8, fy, 17, 60, PX.epi);
		g.rect(SEC.cx - 6, fy + 2, 13, 7, PX.text);
		g.rect(SEC.cx - 8, fy + 18, 17, 1, PX.derm);
		g.rect(SEC.cx - 8, fy, 1, 60, PX.derm);
	}
};
