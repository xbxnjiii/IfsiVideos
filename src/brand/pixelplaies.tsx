// Scènes pixel de la série « Les plaies » (fenêtre 160 × 160 de pixel.tsx) : patient allongé sur son lit, loupe reliée
// au sacrum, coupe de la peau RETOURNÉE (patient sur le dos : l'os en haut, la peau en bas contre le matelas).
// Exactitude : l'escarre commence en profondeur, à l'interface os / muscle, en cône dont la base est contre l'os et la
// pointe vers la peau ; la peau ne montre une rougeur qu'ensuite (NPIAP : « deep tissue pressure injury », pression et
// cisaillement à l'interface os-muscle). Jamais de photo de plaie : la lésion est un aplat tramé violacé.
import {dither, PX, Px, pxArrow} from './pixel';

/** État de la scène « escarre au sacrum » : chaque champ va de 0 à 1 sauf mention. */
export type SacrumState = {
	/** ouverture de la loupe (rayon) */
	loupe: number;
	/** écrasement des tissus entre l'os et le matelas (ou la main) */
	comp: number;
	/** débit de sang dans les petits vaisseaux (0 = arrêté) */
	sang: number;
	/** phase du flux (flowPhase) : les globules avancent d'un pixel par unité */
	phase: number;
	/** profondeur atteinte par la lésion depuis l'os (0 = rien, 1 = jusqu'à la peau) */
	lesion: number;
	/** densité de la lésion (tramage) : 1 = pleine, elle pâlit quand le sang revient */
	lesionK: number;
	/** rougeur visible à la surface de la peau */
	rougeur: number;
	/** flèches de pression (poids du corps / matelas) */
	arrows: number;
	/** la lésion clignote (alerte) */
	pulse: boolean;
	/** main qui frotte (décalage horizontal en px) ; null = pas de main */
	hand: number | null;
	/** petits vaisseaux qui éclatent sous le massage */
	broken: number;
	/** décharge : le patient est tourné sur le côté, calé par un coussin (0 → 1) */
	lift: number;
	/** matelas adapté (cellules d'air) */
	air: boolean;
	/** doigt qui appuie sur la rougeur (0 = absent, 1 = appuie) */
	finger: number;
	/** le point du sacrum clignote sur le patient */
	blink: boolean;
	/** image (12 i/s) pour les clignotements */
	f: number;
};

export const SACRUM_DEFAULT: SacrumState = {loupe: 1, comp: 1, sang: 0.2, phase: 0, lesion: 0.35, lesionK: 1, rougeur: 1, arrows: 1, pulse: false, hand: null, broken: 0, lift: 0, air: false, finger: 0, blink: true, f: 0};

/* ───────── patient allongé (vue de profil) ───────── */
const BED_Y = 48; // dessus du matelas

/** Patient sur le dos, de profil, sur son lit ; `lift` le tourne sur le côté calé par un coussin. Renvoie le point du sacrum. */
export const pxPatientBed = (g: Px, s: Pick<SacrumState, 'lift' | 'air' | 'blink' | 'f'>) => {
	// lit : matelas, cadre, pieds
	g.rect(10, BED_Y, 140, 5, PX.sky);
	if (s.air) for (let x = 10; x < 150; x += 6) g.rect(x, BED_Y, 1, 5, PX.line); // cellules d'air
	if (s.air) for (let x = 12; x < 150; x += 6) g.rect(x, BED_Y, 3, 1, PX.text);
	g.rect(10, BED_Y + 5, 140, 3, PX.line);
	g.rect(14, BED_Y + 8, 4, 9, PX.line);
	g.rect(142, BED_Y + 8, 4, 9, PX.line);
	// oreiller
	g.rect(12, BED_Y - 4, 16, 4, PX.text);
	const up = Math.round(s.lift * 4); // le bassin se soulève (tourné sur le côté)
	// coussin de calage sous le dos quand on décharge
	if (s.lift > 0.1) for (let i = 0; i < 10; i++) g.rect(70 + i * 2, BED_Y - Math.min(up, Math.round((10 - i) * 0.5)), 2, Math.min(up, Math.round((10 - i) * 0.5)), PX.text);
	// tête
	g.disk(22, BED_Y - 9, 5, PX.epi);
	g.rect(18, BED_Y - 15, 9, 3, PX.muscle); // cheveux
	// corps (blouse) : épaules → bassin
	for (let x = 27; x < 96; x++) {
		const lift = x > 60 ? Math.round(up * Math.min(1, (x - 60) / 20)) : 0;
		const top = BED_Y - 9 - lift - (x < 34 ? 0 : 1);
		g.rect(x, top, 1, 9, PX.blue);
	}
	// bras le long du corps, main posée
	g.rect(40, BED_Y - 6 - Math.round(up * 0.3), 26, 2, PX.epi);
	g.rect(66, BED_Y - 6 - Math.round(up * 0.5), 3, 3, PX.epi);
	// jambes
	for (let x = 96; x < 140; x++) {
		const lift = Math.round(up * Math.max(0, 1 - (x - 96) / 30));
		g.rect(x, BED_Y - 7 - lift, 1, 7, PX.line);
	}
	// pieds
	g.rect(140, BED_Y - 11, 4, 11, PX.epi);
	// points d'appui (tête, sacrum, talons) : roses quand ils appuient
	const press = s.lift < 0.5;
	g.rect(20, BED_Y - 1, 3, 1, PX.pink);
	g.rect(138, BED_Y - 1, 3, 1, PX.pink);
	const sx = 88;
	const sy = BED_Y - 1 - up;
	if (press && (!s.blink || Math.floor(s.f / 5) % 2 === 0)) g.rect(sx - 1, sy - 1, 3, 2, PX.red);
	if (!press) g.rect(sx - 1, sy, 3, 1, PX.sky);
	return {x: sx, y: sy};
};

/* ───────── loupe : coupe retournée au sacrum ───────── */
export const LOUPE = {cx: 50, cy: 110, r: 41};

/**
 * Coupe de la peau au sacrum, patient sur le dos : os (proéminence du sacrum) en haut, muscle, graisse, derme avec ses
 * petits vaisseaux (artères rouges / veines bleues), épiderme, puis le matelas (ou la main, ou le vide si on décharge).
 */
export const pxSacrumLoupe = (g: Px, s: SacrumState, from: {x: number; y: number}) => {
	const {cx, cy} = LOUPE;
	const r = Math.round(LOUPE.r * s.loupe);
	if (r < 2) return;
	// trait de rappel vers le sacrum
	const ang = Math.atan2(from.y - cy, from.x - cx);
	g.line(from.x, from.y + 2, cx + Math.cos(ang) * (r + 1), cy + Math.sin(ang) * (r + 1), PX.text, true);
	g.clip = (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
	// repère des couches (y croissant vers le bas)
	const top = cy - LOUPE.r;
	const boneBase = top + 16; // fond de l'os hors proéminence
	const gap = Math.round(s.lift * 7); // décharge : la peau ne touche plus le matelas
	const prom = (x: number) => 7 * Math.exp(-(((x - cx) / 13) ** 2)); // proéminence osseuse
	const boneBottom = (x: number) => boneBase + prom(x);
	// la peau est repoussée vers l'os sous l'appui (le matelas remonte au centre)
	const surface = (x: number) => top + 66 - s.comp * 5 * Math.exp(-(((x - cx) / 16) ** 2));
	for (let x = cx - LOUPE.r - 1; x <= cx + LOUPE.r + 1; x++) {
		const b = boneBottom(x);
		const sf = surface(x);
		for (let y = top - 1; y <= cy + LOUPE.r + 1; y++) {
			let c: string = PX.bg;
			if (y < b) {
				c = PX.bone;
				// travées de l'os spongieux
				if ((x + y * 3) % 7 === 0 && y > top + 3) c = PX.fat;
			} else if (y < sf) {
				const d = (y - b) / (sf - b); // 0 = contre l'os, 1 = à la surface
				c = d < 0.3 ? PX.muscle : d < 0.62 ? PX.fat : d < 0.9 ? PX.derm : PX.epi;
				// fibres du muscle
				if (d < 0.3 && y % 3 === 0 && (x + y) % 11 > 3) c = PX.derm;
				// lobules de graisse
				if (d >= 0.3 && d < 0.62 && ((x + 2 * (y % 2)) % 9 === 0 || (y % 5 === 0 && x % 9 > 2 && x % 9 < 6))) c = PX.epi;
				// rougeur de la peau au centre
				if (d >= 0.9 && Math.abs(x - cx) < 15 && dither(x, y, s.rougeur * (1 - Math.abs(x - cx) / 18))) c = PX.red;
				// lésion profonde : cône dont la base est contre l'os
				const hw = 17 * (1 - d * 0.55);
				if (d < s.lesion && Math.abs(x - cx) < hw) {
					const edge = Math.min(1, (hw - Math.abs(x - cx)) / 3, (s.lesion - d) * 12);
					const k = s.lesionK * edge * (s.pulse && Math.floor(s.f / 5) % 2 === 1 ? 0.6 : 1);
					if (dither(x, y, k)) c = PX.lesion;
				}
			} else if (y < sf + gap) {
				c = PX.bg; // vide : le matelas ne touche plus
			} else if (s.hand === null) {
				// matelas (cellules d'air si matelas adapté)
				c = PX.sky;
				if (s.air && (x - cx + 100) % 8 === 0) c = PX.line;
				if (y > sf + gap + 9) c = PX.line;
			}
			g.set(x, y, c);
		}
	}
	// petits vaisseaux du derme : une rangée de globules qui avancent ; pincés au centre sous l'appui
	for (let x = cx - LOUPE.r; x <= cx + LOUPE.r; x++) {
		const b = boneBottom(x);
		const sf = surface(x);
		const y = Math.round(b + (sf - b) * 0.76);
		const pinch = Math.abs(x - cx) < 15 * s.comp;
		if (pinch) continue;
		const k = (x - Math.floor(s.phase) + 400) % 5;
		if (k === 0) g.set(x, y, PX.artery);
		if (k === 2) g.set(x, y + 2, PX.vein);
	}
	// vaisseaux qui éclatent (massage) : petites taches rouges dans le derme
	const n = Math.round(s.broken * 16);
	for (let i = 0; i < n; i++) {
		const x = cx - 14 + ((i * 37) % 29);
		const b = boneBottom(x);
		const sf = surface(x);
		const y = Math.round(b + (sf - b) * (0.66 + ((i * 13) % 7) / 30));
		g.set(x, y, PX.artery);
		g.set(x + 1, y, PX.artery);
		if (i % 3 === 0) g.set(x, y + 1, PX.artery);
	}
	// flèches : le poids appuie sur l'os, le matelas repousse la peau
	if (s.arrows > 0) {
		const yA = top + 2;
		for (const ax of [cx - 9, cx + 9]) pxArrow(g, ax, yA, 'down', PX.pink, 6);
		if (s.hand === null && s.lift < 0.3) for (const ax of [cx - 9, cx + 9]) pxArrow(g, ax, Math.round(surface(ax)) + 9, 'up', PX.pink, 6);
	}
	// la main qui frotte (sous la peau, le patient est tourné)
	if (s.hand !== null) {
		const hx = Math.round(cx - 18 + s.hand);
		const hy = Math.round(surface(cx)) + 1;
		g.rect(hx, hy, 36, 8, PX.epi);
		for (let i = 1; i < 4; i++) g.rect(hx + i * 9, hy + 3, 1, 5, PX.derm); // doigts
		g.rect(hx, hy + 8, 36, 1, PX.derm);
		pxArrow(g, hx - 3, hy + 4, 'left', PX.pink, 5);
		pxArrow(g, hx + 38, hy + 4, 'right', PX.pink, 5);
	}
	// le doigt qui appuie sur la rougeur (teaser de la vidéo suivante)
	if (s.finger > 0) {
		const fy = Math.round(surface(cx) + (1 - s.finger) * (gap + 14));
		g.rect(cx - 4, fy, 9, 24, PX.epi);
		g.rect(cx - 3, fy + 1, 7, 4, PX.text); // ongle
		g.rect(cx - 4, fy + 9, 9, 1, PX.derm);
	}
	g.clip = null;
	// bord de la loupe
	g.ring(cx, cy, r, PX.text);
	g.ring(cx, cy, r + 1, PX.line);
};
