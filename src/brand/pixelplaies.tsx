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
import {LPI} from './theme';

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

/** Couleurs du plan large et du gros plan « dehors » : celles du format habituel (fond clair de la marque). */
const OUT = {wall: LPI.paper, panel: LPI.sky, line: LPI.navy, blue: LPI.blue, pink: LPI.pink, sheet: LPI.paper};

/**
 * Plan large serré, aux couleurs habituelles du compte (fond clair) : chambre d'hôpital détaillée (moniteur dont la
 * courbe défile, perfusion, fenêtre et rideau, table de chevet, carrelage), patient allongé sur le dos, de profil.
 * `ring` = réticule pointillé rose qui pulse sur le sacrum.
 */
export const pxBedScene = (g: Px, f: number, ring = 1) => {
	const t = Math.floor(f / 2.5);
	// mur clair, main courante, soubassement bleu clair
	g.rect(0, 0, 180, 236, OUT.wall);
	for (let x = 0; x < 180; x += 3) for (let y = (x * 7) % 11; y < 150; y += 11) if ((x + y) % 5 === 0) g.set(x, y, OUT.panel);
	g.rect(0, 150, 180, 86, OUT.panel);
	g.rect(0, 148, 180, 3, OUT.line);
	g.rect(0, 151, 180, 1, OUT.blue);
	// fenêtre : ciel, nuages qui glissent, croisillons, rideau rose
	g.rect(104, 30, 66, 84, OUT.line);
	g.rect(107, 33, 60, 78, OUT.panel);
	for (let i = 0; i < 3; i++) {
		const cx = 107 + ((i * 23 + Math.floor(t / 3)) % 66) - 4;
		const cy = 44 + i * 18;
		g.rect(cx, cy, 14, 3, OUT.wall);
		g.rect(cx + 3, cy - 2, 7, 2, OUT.wall);
	}
	g.rect(135, 33, 3, 78, OUT.line);
	g.rect(107, 70, 60, 3, OUT.line);
	g.rect(100, 26, 80, 3, OUT.line); // tringle
	for (let x = 160; x < 180; x++) g.rect(x, 29, 1, 92, (x + Math.floor(x / 4)) % 4 === 0 ? OUT.wall : OUT.pink);
	// moniteur au mur : écran bleu nuit, courbe qui défile
	const MY = 70;
	g.rect(12, MY, 52, 38, OUT.line);
	g.rect(15, MY + 3, 46, 26, LPI.navy);
	g.rect(15, MY + 3, 46, 1, OUT.blue);
	for (let x = 0; x < 42; x++) {
		const p = (x + t * 2) % 21;
		const y = p === 8 ? -7 : p === 9 ? 6 : p === 10 ? -2 : 0;
		g.set(17 + x, MY + 17 + y, OUT.panel);
		if (p === 8 || p === 9) g.set(17 + x, MY + 17 + Math.round(y / 2), OUT.panel);
	}
	g.rect(17, MY + 31, 6, 2, OUT.pink);
	g.rect(27, MY + 31, 6, 2, OUT.blue);
	g.rect(48, MY + 31, 10, 3, t % 4 < 2 ? OUT.pink : OUT.line); // voyant
	g.rect(36, MY + 38, 2, 12, OUT.line); // bras du moniteur
	// pied à perfusion, poche, tubulure jusqu'à la main
	g.rect(78, 64, 2, 172, OUT.line);
	g.rect(72, 64, 14, 2, OUT.line);
	g.rect(72, 66, 10, 20, OUT.wall);
	g.box(72, 66, 10, 20, OUT.line);
	g.rect(74, 74, 6, 10, OUT.panel);
	g.rect(76, 86, 1, 6, OUT.line);
	if (t % 6 === 0) g.set(76, 89, OUT.blue); // goutte
	for (let y = 92; y < 176; y += 2) g.set(77 + Math.round(((y - 92) / 84) * 22), y, OUT.line);
	// sol carrelé
	g.rect(0, 236, 180, 84, OUT.wall);
	g.rect(0, 236, 180, 2, OUT.line);
	for (let y = 250; y < 320; y += 16) g.rect(0, y, 180, 1, OUT.panel);
	for (let x = 0; x < 180; x += 22) g.rect(x, 238, 1, 82, OUT.panel);
	// ombre du lit sur le sol, chaussons roses
	for (let y = 238; y < 300; y++) for (let x = 6; x < 150; x++) if (dither(x, y, 0.22 * G(y, 262, 26))) g.set(x, y, OUT.panel);
	for (const sx of [58, 76]) {
		g.rect(sx, 300, 15, 6, OUT.pink);
		g.rect(sx + 8, 297, 7, 4, OUT.pink);
		g.box(sx, 300, 15, 6, OUT.line);
		g.rect(sx + 2, 301, 5, 1, OUT.wall);
	}
	// table de chevet
	g.rect(150, 168, 30, 68, OUT.blue);
	g.box(150, 168, 30, 68, OUT.line);
	g.rect(155, 186, 20, 2, OUT.line);
	g.rect(160, 158, 8, 10, OUT.wall); // verre
	g.box(160, 158, 8, 10, OUT.line);
	g.rect(161, 163, 6, 4, OUT.panel);
	// lit : tête de lit, matelas, drap, cadre, roues
	g.rect(0, 150, 7, 82, OUT.blue);
	g.box(0, 150, 7, 82, OUT.line);
	g.rect(0, 205, 150, 22, OUT.sheet);
	for (let x = 4; x < 150; x += 8) g.rect(x, 209, 4, 1, OUT.panel);
	for (let x = 8; x < 150; x += 8) g.rect(x, 216, 4, 1, OUT.panel);
	g.rect(0, 205, 150, 1, OUT.line);
	g.rect(0, 226, 150, 1, OUT.line);
	g.rect(0, 227, 150, 6, OUT.line);
	g.rect(20, 233, 4, 56, OUT.line);
	g.rect(130, 233, 4, 56, OUT.line);
	g.rect(14, 286, 18, 2, OUT.line);
	for (const wx of [22, 132]) {
		g.disk(wx, 293, 5, OUT.line);
		g.disk(wx, 293, 2, OUT.panel);
	}
	// oreiller
	g.rect(0, 183, 44, 22, OUT.sheet);
	g.box(0, 183, 44, 22, OUT.line);
	g.rect(2, 198, 40, 6, OUT.panel);
	// tête de profil : visage, oreille, cheveux
	g.disk(15, 168, 15, PX_REAL.hair); // chevelure (derrière)
	g.disk(22, 174, 13, PX.epi); // visage
	g.rect(20, 157, 12, 5, PX_REAL.hair); // mèche sur le front
	g.disk(14, 175, 3, PX.derm); // oreille
	g.rect(34, 170, 5, 4, PX.epi);
	g.rect(28, 166, 4, 1, OUT.line);
	g.rect(29, 180, 5, 1, PX.derm);
	// cou, blouse à pois
	g.rect(30, 182, 14, 10, PX.epi);
	// corps sous la couverture : poitrine, ventre, bassin contre le matelas, cuisses
	for (let x = 40; x < 150; x++) {
		const top = Math.round(205 - (x < 92 ? 34 - Math.max(0, x - 70) * 0.15 : x < 120 ? 31 - (x - 92) * 0.3 : 22 + 7 * G(x, 140, 12)));
		g.rect(x, top, 1, 205 - top, OUT.blue);
		g.set(x, top, OUT.line);
		if ((x + 9) % 26 === 0) g.rect(x, top + 3, 1, 205 - top - 6, OUT.line); // plis
		if ((x + 3) % 26 === 0) g.rect(x, top + 2, 1, 205 - top - 8, OUT.panel); // reflets
	}
	// bras sur la couverture (manche de blouse à pois), main avec le cathéter
	g.rect(48, 177, 34, 8, OUT.panel);
	for (let x = 50; x < 82; x += 5) g.set(x, 180, OUT.blue);
	g.box(48, 177, 34, 8, OUT.line);
	g.rect(82, 178, 18, 6, PX.epi);
	g.rect(100, 177, 10, 8, PX.epi);
	g.rect(98, 176, 4, 2, OUT.wall); // pansement du cathéter
	// réticule pointillé qui pulse sur le sacrum (zone d'appui)
	if (ring > 0) {
		const r = 14 + (t % 2) * 3;
		for (let a = 0; a < 64; a++) {
			if (a % 4 > 1) continue;
			const ang = (a / 64) * Math.PI * 2;
			g.set(BED_SACRUM.x + Math.cos(ang) * r, BED_SACRUM.y + Math.sin(ang) * r, OUT.pink);
		}
		for (const [dx, dy] of [[-r - 4, 0], [r + 2, 0], [0, -r - 4], [0, r + 2]]) g.rect(BED_SACRUM.x + dx, BED_SACRUM.y + dy, dx ? 3 : 1, dy ? 3 : 1, PX.red);
		g.rect(BED_SACRUM.x - 2, BED_SACRUM.y - 2, 5, 3, PX.red);
	}
};

/**
 * Gros plan « dehors » au sacrum (même repère que la coupe : la peau contre le matelas en bas) : blouse relevée, peau
 * du bas du dos, matelas, rougeur au point d'appui ; `xray` (0 → 1) fait deviner l'os en pointillés à travers la peau.
 */
export const pxHipClose = (g: Px, f: number, xray = 0) => {
	const s = {comp: 1, finger: 0};
	const t = Math.floor(f / 2.5);
	// bord de la blouse relevée (à gauche) et de la couverture soulevée (à droite)
	const top = (x: number) => (x < 96 ? 92 + Math.round(6 * Math.sin(x / 11)) : 110 + Math.round(9 * Math.sin(x / 17 + 1)) + Math.round((x - 96) * 0.25));
	for (let x = 0; x < 180; x++) {
		const sf = Math.round(secSurface(x, s));
		const tp = top(x);
		for (let y = 0; y < 320; y++) {
			let c: string;
			if (y < tp) {
				if (x < 96) {
					// blouse bleu clair à pois, plis
					c = OUT.panel;
					if ((x + Math.floor(y / 9) * 4) % 9 === 0 && y % 9 === 4) c = OUT.blue;
					if ((x * 3 + y) % 37 < 2) c = OUT.wall;
				} else {
					// couverture bleue soulevée, plis et reflets
					c = OUT.blue;
					const fold = (x + Math.round(y * 0.4)) % 23;
					if (fold < 2) c = OUT.line;
					else if (fold < 4) c = OUT.panel;
				}
				if (y >= tp - 2) c = OUT.line;
			} else if (y < sf) {
				// peau du bas du dos : reflet en haut, ombre propre vers le matelas, grain discret
				c = PX.epi;
				if (dither(x, y, 0.55 * G(y, tp + 14, 10))) c = PX.bone;
				if (dither(x, y, 0.5 * Math.max(0, (y - (sf - 60)) / 60) ** 1.5)) c = PX.derm;
				if (dither(x, y, 0.04)) c = PX.derm;
				if (y > sf - 3) c = PX.derm;
				if (dither(x, y, G(x, SEC.cx, 26) * G(y, sf - 6, 12))) c = PX.red; // rougeur au point d'appui
				// creux de la taille (ombre courbe à gauche)
				if (x < 40 && dither(x, y, 0.35 * G(x, 18, 10) * G(y, tp + 60, 40))) c = PX.derm;
			} else {
				// matelas : housse claire, coutil bleu clair, couture, ombre sous le corps
				c = OUT.sheet;
				if (y < sf + 1) c = OUT.line;
				else if (y < sf + 4 && dither(x, y, 0.5)) c = OUT.panel;
				else if ((x + 400) % 18 === 0 && y % 3 === 0) c = OUT.panel;
				if (y === 306) c = OUT.line;
				if (y > 306 && (x + y) % 6 === 0) c = OUT.panel;
			}
			g.set(x, y, c);
		}
	}
	// main gantée qui soulève la couverture (gant bleu clair, contour bleu nuit), légère respiration
	const hy = 92 + (t % 4 < 2 ? 0 : 1);
	g.rect(124, hy, 26, 16, OUT.panel);
	g.box(124, hy, 26, 16, OUT.line);
	for (let i = 0; i < 4; i++) {
		g.rect(126 + i * 6, hy + 15, 5, 9, OUT.panel);
		g.box(126 + i * 6, hy + 15, 5, 9, OUT.line);
	}
	g.rect(150, hy + 2, 30, 12, OUT.panel); // poignet
	g.rect(150, hy + 2, 30, 1, OUT.line);
	g.rect(150, hy + 13, 30, 1, OUT.line);
	g.rect(128, hy + 3, 8, 2, OUT.wall); // reflet du gant
	// l'os qu'on devine à travers la peau (pointillés qui s'allument)
	if (xray > 0) {
		for (let x = 10; x < 170; x += 2) {
			if ((x - 10) / 160 > xray) break;
			g.set(x, Math.round(secBone(x)), OUT.line);
			g.set(x + 1, Math.round(secBone(x)) - 1, OUT.blue);
		}
	}
};

/**
 * Passage « dehors → dedans » : un cercle de scanner part du point d'appui et grandit ; à l'intérieur, la coupe (thème
 * sombre), à l'extérieur le gros plan clair ; bord tramé et anneau rose. `k` 0 → 1.
 */
export const pxReveal = (g: Px, inside: Px, k: number, cx = SEC.cx, cy = SEC.skin - 20) => {
	const R = k * 340;
	for (let y = 0; y < g.h; y++)
		for (let x = 0; x < g.w; x++) {
			const d = Math.hypot(x - cx, (y - cy) * 0.8);
			if (d < R - 6 || (d < R && dither(x, y, (R - d) / 6))) {
				const i = (y * g.w + x) * 4;
				g.data[i] = inside.data[i];
				g.data[i + 1] = inside.data[i + 1];
				g.data[i + 2] = inside.data[i + 2];
				g.data[i + 3] = 255;
			} else if (d < R + 2 && k < 1) g.set(x, y, d < R + 1 ? LPI.pink : LPI.paper);
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
	/** le doigt chasse le sang des petits vaisseaux du derme : la peau blanchit (0 → 1) */
	blanch?: number;
	/** profondeur (0 = os, 1 = peau) et taille (0 → 1) de la fuite de sang ; par défaut autour de l'artériole du derme */
	leakD?: number;
	leakR?: number;
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
				// rougeur : le derme et l'épiderme rougissent au centre ; sous le doigt, le sang est chassé (la peau blanchit)
				const bl = (s.blanch ?? 0) * G(xs, SEC.cx, 15);
				if (d > SEC_D.fat && dither(xs, y, s.rougeur * G(xs, SEC.cx, 26) * (d > SEC_D.skin ? 1 : 0.7) * (1 - bl))) c = PX.red;
				if (d > SEC_D.skin && dither(xs, y, bl * 0.8)) c = PX.bone;
				// vaisseaux : paroi + lumière + globules rouges qui avancent ; écrasés (paroi contre paroi) sous l'appui
				const pinched = pinchAt(xs);
				for (const [vc, wall, lumen] of vessels) {
					const dd = Math.abs(d - vc) * (sf - b);
					const half = pinched ? 0.5 : 2.4;
					if (dd <= half + 0.6) {
						if (pinched || dd > half - 0.6) c = wall;
						else if (vc > SEC_D.fat && (s.blanch ?? 0) * G(xs, SEC.cx, 15) > 0.45) c = PX.epi; // vaisseau vidé par le doigt
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
		const lr = s.leakR ?? 1;
		const n = Math.round(s.leak * 240 * lr);
		for (let i = 0; i < n; i++) {
			const a = (hash(i, 3) / 1000) * Math.PI * 2;
			const r = Math.sqrt(hash(i, 5) / 1000) * (8 + 30 * s.leak) * lr;
			const x = Math.round(SEC.cx - 6 + Math.cos(a) * r * 1.5 + s.shear * 0.6);
			const y = secY(x, s.leakD ?? SEC_D.art, s) + Math.round(Math.sin(a) * r * 0.55);
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
		// doigt ganté (bleu clair, contour bleu nuit) qui monte appuyer sur la peau
		const fy = Math.round(at(surf, SEC.cx) + (1 - s.finger) * 30);
		g.rect(SEC.cx - 12, fy + 4, 25, 80, LPI.sky);
		g.rect(SEC.cx - 9, fy, 19, 5, LPI.sky);
		g.rect(SEC.cx - 12, fy + 4, 1, 80, LPI.navy);
		g.rect(SEC.cx + 12, fy + 4, 1, 80, LPI.navy);
		g.rect(SEC.cx - 9, fy, 19, 1, LPI.navy);
		g.rect(SEC.cx - 11, fy + 1, 2, 3, LPI.navy);
		g.rect(SEC.cx + 10, fy + 1, 2, 3, LPI.navy);
		g.rect(SEC.cx - 6, fy + 6, 3, 40, LPI.paper);
		g.rect(SEC.cx - 12, fy + 30, 25, 1, LPI.blue);
	}
};

/* ════════════════════════ la peau vue de dessus (test du doigt) ════════════════════════ */
/** Teintes de peau (vraies couleurs) : claire et foncée, chacune en 3 tons + la marque de la zone abîmée. */
export const SKIN_TONES = {
	light: {base: PX.epi, hi: PX.bone, lo: PX.derm, mark: PX.red},
	dark: {base: '#8D5A3B', hi: '#A8714D', lo: '#6E4329', mark: '#5A3322'},
} as const;

/** Centre de la tache sur la peau vue de dessus. */
export const TOP_SPOT = {x: 90, y: 176};

export type SkinTopState = {
	tone: keyof typeof SKIN_TONES;
	/** rougeur (ou, sur peau foncée, zone plus foncée) */
	redness: number;
	/** doigt ganté : 0 = absent, 0.5 = posé au-dessus, 1 = appuie */
	finger: number;
	/** tache blanche laissée par le doigt (0 → 1) */
	white: number;
	/** chaleur (petites ondes roses) */
	heat?: number;
	/** zone indurée (contour en pointillés) */
	hard?: number;
	f: number;
};

/**
 * Peau du bas du dos vue de dessus (patient tourné sur le côté), aux couleurs claires du dehors : drap, bord de la
 * blouse, pli fessier, grain de la peau, rougeur au sacrum ; doigt ganté qui appuie ; tache blanche après l'appui.
 */
export const pxSkinTop = (g: Px, s: SkinTopState) => {
	const T = SKIN_TONES[s.tone];
	const {x: cx, y: cy} = TOP_SPOT;
	// demi-largeur du dos : la taille plus étroite en haut, les hanches plus larges en bas
	const half = (y: number) => 78 + 16 * G(y, 250, 80);
	for (let y = 0; y < 320; y++)
		for (let x = 0; x < 180; x++) {
			const dx = Math.abs(x - 90);
			const inSkin = dx < half(y);
			let c: string;
			if (!inSkin) {
				// drap
				c = OUT.sheet;
				if ((x + y * 2) % 14 === 0) c = OUT.panel;
				if (dx < half(y) + 3) c = OUT.panel; // ombre du corps sur le drap
			} else if (y < 46 + Math.round(5 * Math.sin(x / 9))) {
				// bord de la blouse relevée
				c = OUT.panel;
				if ((x + Math.floor(y / 7) * 3) % 8 === 0 && y % 7 === 3) c = OUT.blue;
				if (y >= 44 + Math.round(5 * Math.sin(x / 9))) c = OUT.line;
			} else {
				c = T.base;
				if (dither(x, y, 0.07)) c = T.lo;
				if (dither(x, y, 0.32 * G(x, 64, 26) * G(y, 110, 50))) c = T.hi; // reflet
				if (dither(x, y, 0.45 * Math.max(0, (dx - half(y) + 16) / 16))) c = T.lo; // le dos s'arrondit sur les côtés
				// colonne : petites bosses des vertèbres, puis le sacrum et ses deux fossettes
				if (Math.abs(x - 90) < 2 && y < 140 && (y % 14 < 3) && y > 52) c = T.lo;
				for (const fx of [72, 108]) if (Math.hypot(x - fx, y - 146) < 2.2) c = T.lo;
				// pli fessier en bas, au milieu
				if (y > 232 && Math.abs(x - 90 - Math.round((y - 232) * 0.05)) < 1) c = T.lo;
				if (y > 232 && Math.abs(x - 90 - Math.round((y - 232) * 0.05)) === 1 && dither(x, y, 0.5)) c = T.lo;
				// rougeur (bord irrégulier)
				const r = Math.hypot((x - cx) / 34, (y - cy) / 26) + ((hash(x >> 2, y >> 2) % 9) - 4) * 0.02;
				if (dither(x, y, s.redness * Math.max(0, Math.min(1, (1.15 - r) * 2.2)))) c = T.mark;
				// tache blanche laissée par le doigt
				const w = Math.hypot(x - cx, y - cy);
				if (s.white > 0 && w < 12 && dither(x, y, s.white * Math.min(1, (12 - w) / 4))) c = s.tone === 'light' ? OUT.wall : T.hi;
				if (dx > half(y) - 1) c = T.lo; // bord du corps
			}
			g.set(x, y, c);
		}
	// chaleur : petites ondes roses qui montent
	if ((s.heat ?? 0) > 0) {
		const t = Math.floor(s.f / 2.5);
		for (let i = 0; i < 5; i++) {
			if (i / 5 > (s.heat ?? 0)) break;
			const x0 = cx - 30 + i * 15;
			const y0 = cy - 30 - ((t * 2 + i * 7) % 22);
			for (let k = 0; k < 9; k++) g.set(x0 + Math.round(2 * Math.sin((k + t) / 1.6)), y0 + k, OUT.pink);
		}
	}
	// zone dure : contour pointillé
	if ((s.hard ?? 0) > 0) {
		for (let a = 0; a < 80; a++) {
			if (a / 80 > (s.hard ?? 0) || a % 3 === 2) continue;
			const ang = (a / 80) * Math.PI * 2;
			g.set(cx + Math.cos(ang) * 40, cy + Math.sin(ang) * 31, OUT.line);
		}
	}
	// main gantée (vue de dessus) : l'index tendu vers la tache, les autres doigts repliés ; ombre quand elle est levée
	if (s.finger > 0) {
		const lift = s.finger < 1 ? 1 - s.finger : 0;
		const away = Math.max(0, 0.5 - s.finger) * 2;
		const tx = cx + 1 + Math.round(away * 70);
		const ty = cy + 1 + Math.round(away * 110);
		const sh = Math.round(lift * 9);
		const ux = 0.42;
		const uy = 0.91; // direction du doigt (vers le bas à droite)
		const vx = uy;
		const vy = -ux; // perpendiculaire
		const shape = (k: number, j: number) => {
			// index : bout arrondi, s'élargit un peu vers la main
			if (k < 0) return false;
			const w = 11 + Math.min(3, k / 20);
			const tip = k < 11 ? Math.sqrt(Math.max(0, 1 - ((11 - k) / 11.5) ** 2)) : 1;
			if (k < 92 && Math.abs(j) <= w * tip) return true;
			// la main (poing) : un grand ovale au bout du doigt
			return ((k - 120) / 36) ** 2 + ((j - 10) / 30) ** 2 < 1;
		};
		const paint = (ox: number, oy: number, shadow: boolean) => {
			for (let y = 0; y < 320; y++)
				for (let x = 0; x < 180; x++) {
					const rx = x - ox;
					const ry = y - oy;
					const k = rx * ux + ry * uy;
					const j = rx * vx + ry * vy;
					if (!shape(k, j)) continue;
					if (shadow) {
						if (dither(x, y, 0.75)) g.set(x, y, s.tone === 'light' ? T.lo : '#4E2F1D');
						continue;
					}
					let c: string = OUT.panel;
					const edge = !shape(k - 1.2, j) || !shape(k + 1.2, j) || !shape(k, j - 1.2) || !shape(k, j + 1.2);
					if (edge) c = OUT.line;
					else if (k > 4 && k < 80 && j > 3 && j < 6) c = OUT.wall; // reflet du gant
					else if (k < 20 && Math.abs(j) < 6 && ((k - 9) / 7) ** 2 + (j / 5) ** 2 < 1) c = OUT.wall; // ongle sous le gant
					else if (Math.abs(k - 38) < 0.6 || Math.abs(k - 66) < 0.6) c = OUT.blue; // plis des phalanges
					else if (k > 100 && k < 146 && j < 34 && Math.abs((((j + 42) % 13) + 13) % 13 - 6) < 0.7) c = OUT.line; // doigts repliés
					else if (k > 96 && dither(x, y, 0.1)) c = OUT.blue;
					g.set(x, y, c);
				}
		};
		if (sh > 0) paint(tx + sh, ty + sh, true);
		paint(tx, ty, false);
	}
};
