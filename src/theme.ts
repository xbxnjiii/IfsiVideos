import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const C = {
	bg: '#070B18',
	bg2: '#0E1630',
	card: 'rgba(255,255,255,0.06)',
	stroke: 'rgba(255,255,255,0.14)',
	white: '#F5F7FF',
	muted: '#9AA6C8',
	dark: '#0A0F1F',
	red: '#FF2E4D',
	coral: '#FF6B6B',
	cyan: '#2EE6D6',
	yellow: '#FFD23F',
	green: '#3DDC84',
	violet: '#A78BFA',
	blue: '#4DA3FF',
	orange: '#FF9F43',
	skin: '#F2B8A0',
	skinDark: '#D98E76',
	vein: '#3D6BFF',
	blood: '#B3122E',
};

export const TITLE = 'Montserrat';
export const BODY = 'Inter';

// Zones de sécurité TikTok / Reels / Shorts (1080x1920) :
// le haut (~200px), le bas (~420px) et la droite (~120px) sont couverts par l'UI.
export const SAFE = {top: 200, bottom: 1500, contentWidth: 860};

const FONTS: [string, string, string][] = [
	[TITLE, 'montserrat-latin-700-normal.woff2', '700'],
	[TITLE, 'montserrat-latin-800-normal.woff2', '800'],
	[TITLE, 'montserrat-latin-900-normal.woff2', '900'],
	[BODY, 'inter-latin-500-normal.woff2', '500'],
	[BODY, 'inter-latin-600-normal.woff2', '600'],
	[BODY, 'inter-latin-700-normal.woff2', '700'],
	[BODY, 'inter-latin-800-normal.woff2', '800'],
];

export const fontsReady = Promise.all(
	FONTS.map(([family, file, weight]) => loadFont({family, url: staticFile(`fonts/${file}`), weight})),
);
