// ─────────────────────────────────────────────────────────────────────────────
//  LA PETITE IDE — système visuel des vidéos
//  Toute nouvelle vidéo de la marque part de ce fichier : couleurs, polices, grille.
// ─────────────────────────────────────────────────────────────────────────────
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/** Palette officielle — aucune autre couleur (hors mascotte et logos fournis). */
export const LPI = {
	/** Couleur principale : éléments importants, titres/infos clés, accents. */
	blue: '#4E7AC7',
	/** Arrière-plans secondaires, aplats doux, cartes, bulles. */
	sky: '#C5D8F4',
	/** Fond principal, espace respirant. */
	paper: '#F8F9FC',
	/** Accents émotionnels, petites mises en évidence. */
	pink: '#EAA7C1',
	/** Texte principal, contours, titres très contrastés. */
	navy: '#2D3A5A',
} as const;

/** Variante transparente d'une couleur de la palette (ombres, voiles) — pas une nouvelle teinte. */
export const alpha = (hex: string, a: number) => {
	const n = parseInt(hex.slice(1), 16);
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const FONT = {
	/** Logo / signature de marque. */
	brand: 'Fredoka',
	/** Titres, chiffres clés. */
	title: 'Nunito Sans',
	/** Texte courant, sous-titres. */
	body: 'Inter',
};

/** Ombre douce standard (profondeur légère, jamais d'effet 3D). */
export const SHADOW = `0 18px 48px ${alpha(LPI.navy, 0.1)}, 0 4px 12px ${alpha(LPI.navy, 0.06)}`;

/**
 * Grille 1080 × 1920. L'interface TikTok / Reels / Shorts couvre le haut (~150 px),
 * le bas (~420 px) et la colonne de droite (≈ x > 950 entre y 900 et 1500).
 */
export const GRID = {
	w: 1080,
	h: 1920,
	margin: 72,
	header: 150, // filigrane + progression
	title: 270, // kicker + titre
	main: 560, // carte principale
	captions: 1408, // sous-titres
	bottom: 1480, // rien d'important en dessous
};

const FILES: [string, string, string][] = [
	[FONT.title, 'nunito-sans-latin-600-normal.woff2', '600'],
	[FONT.title, 'nunito-sans-latin-700-normal.woff2', '700'],
	[FONT.title, 'nunito-sans-latin-800-normal.woff2', '800'],
	[FONT.title, 'nunito-sans-latin-900-normal.woff2', '900'],
	[FONT.brand, 'fredoka-latin-600-normal.woff2', '600'],
	[FONT.brand, 'fredoka-latin-700-normal.woff2', '700'],
	[FONT.body, 'inter-latin-500-normal.woff2', '500'],
	[FONT.body, 'inter-latin-600-normal.woff2', '600'],
	[FONT.body, 'inter-latin-700-normal.woff2', '700'],
	[FONT.body, 'inter-latin-800-normal.woff2', '800'],
];

export const brandFontsReady = Promise.all(
	FILES.map(([family, file, weight]) => loadFont({family, url: staticFile(`fonts/${file}`), weight})),
);
