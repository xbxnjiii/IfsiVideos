// Corps humain de face, position anatomique (paumes vers l'avant), unités 1000 × 1800.
// Le côté droit du patient est à GAUCHE de l'écran.
import {limb, mirror, P, PR, smooth} from './geometry';

/* ─────────── repères ─────────── */

export const HEART = {x: 520, y: 520, scale: 0.5};
export const LUNGS = {x: 332, y: 280, scale: 0.7};
export const BODY = {w: 1000, h: 1800};

/* ─────────── silhouette ─────────── */

const HEAD: P[] = [
	[500, 12], [552, 22], [586, 58], [596, 112], [590, 160], [574, 200], [548, 228], [520, 244], [500, 248],
	...mirror<P>([[520, 244], [548, 228], [574, 200], [590, 160], [596, 112], [586, 58], [552, 22]]),
];

const NECK: P[] = [[456, 196], [544, 196], [548, 250], [560, 292], [440, 292], [452, 250]];

// tronc : côté gauche du patient (droite de l'écran), puis miroir
const TORSO_R: P[] = [
	[538, 268], [576, 282], [626, 296], [672, 312], [704, 332], [722, 364], [716, 402], [692, 440], [680, 500], [672, 570],
	[656, 650], [644, 710], [648, 772], [656, 830], [656, 866], [644, 902], [560, 936],
];
const TORSO: P[] = [...TORSO_R, [500, 950], ...mirror<P>(TORSO_R).reverse()];

// bras droit du patient (gauche de l'écran) : épaule → poignet
export const ARM_R: PR[] = [
	[330, 352, 46], [312, 410, 50], [298, 476, 45], [289, 540, 42], [280, 600, 37], [272, 642, 34], [263, 694, 38], [251, 772, 33], [240, 850, 27], [234, 880, 24],
];
const PALM_R: PR[] = [[233, 878, 25], [229, 924, 31], [225, 968, 32], [222, 998, 29]];
const FINGERS_R: PR[][] = [
	[[204, 990, 9], [200, 1033, 8], [198, 1066, 7]], // index
	[[216, 996, 9.5], [214, 1043, 8.5], [213, 1080, 7.5]], // majeur
	[[229, 994, 9], [230, 1038, 8], [231, 1071, 7]], // annulaire
	[[241, 986, 8], [244, 1020, 7], [246, 1050, 6]], // auriculaire
	[[212, 916, 11], [199, 952, 10], [190, 988, 8.5]], // pouce
];
export const LEG_R: PR[] = [
	[428, 860, 88], [426, 960, 80], [422, 1060, 70], [416, 1160, 60], [412, 1250, 50], [411, 1300, 46], [412, 1362, 50], [414, 1420, 53],
	[410, 1500, 44], [406, 1600, 32], [404, 1668, 26],
];
const FOOT_R: P[] = [[382, 1660], [426, 1660], [436, 1720], [444, 1778], [424, 1800], [380, 1800], [362, 1786], [372, 1720]];

/** lignes anatomiques discrètes (clavicules, pectoraux, nombril, plis…) — côté droit du patient */
const LINES_R: string[] = [
	'M384 318 C420 330 458 332 490 322',
	'M386 470 C420 500 466 500 494 482',
	'M384 832 C420 880 458 912 492 944',
	'M392 1284 C404 1302 420 1302 432 1284',
	'M258 640 C268 648 282 648 292 640',
	'M214 1000 L214 1030 M226 1000 L227 1028 M238 994 L240 1018',
];
export const LINES: string[] = [
	...LINES_R,
	...LINES_R.map((d) => mirrorPath(d)),
	'M455 224 C476 242 524 242 545 224',
	'M497 700 C495 708 497 716 500 718 C503 716 505 708 503 700',
];

const mirrorPR = (a: PR[]) => mirror<PR>(a);

export type Part = {id: string; d: string};

export const PARTS: Part[] = [
	{id: 'leg-r', d: limb(LEG_R)},
	{id: 'leg-l', d: limb(mirrorPR(LEG_R))},
	{id: 'foot-r', d: smooth(FOOT_R, true)},
	{id: 'foot-l', d: smooth(mirror<P>(FOOT_R), true)},
	{id: 'torso', d: smooth(TORSO, true)},
	{id: 'neck', d: smooth(NECK, true)},
	{id: 'head', d: smooth(HEAD, true)},
	{id: 'ear-r', d: smooth([[408, 112], [400, 130], [402, 158], [412, 172], [418, 140]], true)},
	{id: 'ear-l', d: smooth(mirror<P>([[408, 112], [400, 130], [402, 158], [412, 172], [418, 140]]), true)},
	...(['r', 'l'] as const).flatMap((side) => {
		const m = side === 'r' ? (a: PR[]) => a : mirrorPR;
		return [
			{id: `arm-${side}`, d: limb(m(ARM_R))},
			{id: `palm-${side}`, d: limb(m(PALM_R))},
			...FINGERS_R.map((f, i) => ({id: `finger-${side}-${i}`, d: limb(m(f))})),
		];
	}),
];

/* ─────────── vaisseaux ─────────── */

export type Vessel = {id: string; pts: P[]; w: number; kind: 'artery' | 'vein'};

const A = (id: string, w: number, pts: P[]): Vessel => ({id, w, pts, kind: 'artery'});
const V = (id: string, w: number, pts: P[]): Vessel => ({id, w, pts, kind: 'vein'});
const both = (v: Vessel): Vessel[] => [
	{...v, id: `${v.id}-r`},
	{...v, id: `${v.id}-l`, pts: mirror<P>(v.pts)},
];

// Artères : chaque tracé part du cœur (le sang s'éloigne du cœur).
export const ARTERIES: Vessel[] = [
	// crosse et gros troncs : ils partent de la crosse aortique dessinée avec le cœur
	A('aorta', 15, [[574, 450], [566, 500], [546, 560], [526, 650], [510, 760], [500, 806]]),
	A('brachiocephalic', 10, [[514, 368], [498, 350], [484, 340]]),
	A('carotid-r', 8, [[484, 340], [476, 300], [470, 262], [466, 222], [458, 186]]),
	A('carotid-l', 8, [[534, 366], [532, 330], [532, 280], [536, 238], [542, 196]]),
	A('subclavian-r', 9, [[484, 340], [446, 330], [398, 334], [352, 350]]),
	A('subclavian-l', 9, [[557, 368], [580, 344], [612, 334], [650, 350]]),
	// bras (trajet interne : axillaire → humérale → radiale / ulnaire)
	...both(A('brachial', 7, [[352, 350], [330, 380], [314, 450], [302, 530], [292, 600], [282, 640]])),
	...both(A('radial', 5, [[282, 640], [266, 700], [250, 780], [236, 860], [226, 900]])),
	...both(A('ulnar', 5, [[282, 640], [276, 710], [264, 790], [248, 870], [238, 905]])),
	...both(A('palmar', 3.5, [[226, 900], [214, 942], [224, 958], [238, 950], [238, 905]])),
	...both(A('digital-index', 2.4, [[214, 942], [206, 985], [201, 1030], [199, 1058]])),
	...both(A('digital-middle', 2.4, [[222, 957], [218, 995], [216, 1040], [214, 1070]])),
	// abdomen → jambes
	...both(A('iliac', 11, [[500, 806], [478, 838], [458, 876], [444, 912]])),
	...both(A('femoral', 9, [[444, 912], [436, 990], [430, 1090], [424, 1190], [418, 1280]])),
	...both(A('tibial', 6, [[418, 1280], [418, 1370], [414, 1470], [408, 1590], [402, 1690], [404, 1760]])),
];

// Veines : chaque tracé part de la périphérie et va vers le cœur.
export const VEINS: Vessel[] = [
	V('vcs', 15, [[488, 334], [478, 352], [470, 370]]),
	V('vci', 16, [[490, 800], [488, 700], [480, 600], [472, 528]]),
	...both(V('jugular', 9, [[448, 180], [450, 230], [454, 272], [466, 310], [488, 334]])),
	V('subclavian-v-r', 9, [[344, 362], [392, 346], [444, 340], [488, 334]]),
	V('subclavian-v-l', 9, [[656, 362], [606, 346], [554, 340], [488, 334]]),
	// bras : céphalique (côté pouce), basilique (côté interne), médiane du coude
	...both(V('cephalic', 6, [[214, 900], [228, 820], [246, 740], [262, 660], [276, 560], [292, 460], [312, 390], [344, 362]])),
	...both(V('basilic', 6, [[248, 905], [262, 820], [276, 730], [290, 650], [304, 560], [316, 470], [330, 400], [344, 362]])),
	...both(V('median-cubital', 4.5, [[262, 660], [276, 648], [290, 640]])),
	...both(V('digital-v', 2.2, [[230, 1066], [231, 1020], [232, 975], [226, 935], [214, 900]])),
	// jambes
	...both(V('saphenous', 6, [[426, 1774], [420, 1680], [430, 1560], [440, 1440], [446, 1330], [452, 1220], [462, 1080], [470, 960], [474, 900]])),
	...both(V('femoral-v', 9, [[430, 1270], [440, 1180], [446, 1080], [454, 980], [462, 910], [474, 870], [490, 800]])),
	...both(V('iliac-v', 11, [[474, 870], [482, 836], [490, 806]])),
];

/* ─────────── muscles superficiels (écorché simplifié) ─────────── */

export type Muscle = {id: string; d: string; fibers: string[]};

/** muscle fusiforme le long d'un axe + 3 lignes de fibres */
const fusiform = (id: string, axis: PR[]): Muscle => {
	const fib = [-0.5, 0, 0.5].map((k) =>
		smooth(
			axis.map(([x, y, r], i) => {
				const a = axis[Math.max(0, i - 1)];
				const b = axis[Math.min(axis.length - 1, i + 1)];
				const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
				return [x + (-(b[1] - a[1]) / l) * r * k, y + ((b[0] - a[0]) / l) * r * k] as P;
			}),
		),
	);
	return {id, d: limb(axis), fibers: fib};
};

const MUSCLES_R: Muscle[] = [
	{
		id: 'pectoral',
		d: 'M498 352 C470 340 420 336 384 350 C362 360 350 378 346 400 C372 426 410 470 440 482 C470 490 492 480 498 470 Z',
		fibers: ['M496 372 C450 370 400 376 352 396', 'M496 410 C452 412 404 410 356 402', 'M494 448 C456 450 410 436 364 408'],
	},
	{
		id: 'deltoid',
		d: 'M384 340 C352 326 318 332 300 352 C286 378 288 414 298 444 C312 432 330 404 346 396 C360 380 374 360 384 340 Z',
		fibers: ['M372 340 C340 360 312 400 300 436', 'M346 336 C324 360 304 398 296 430'],
	},
	fusiform('biceps', [[300, 446, 13], [294, 500, 22], [288, 560, 19], [282, 612, 8]]),
	fusiform('forearm', [[270, 652, 15], [264, 700, 21], [256, 760, 15], [246, 840, 7]]),
	fusiform('rectus-femoris', [[440, 930, 20], [432, 1050, 30], [424, 1170, 24], [418, 1262, 10]]),
	fusiform('vastus-lateralis', [[396, 960, 13], [384, 1080, 24], [386, 1200, 20], [402, 1270, 9]]),
	fusiform('vastus-medialis', [[452, 1120, 9], [454, 1196, 22], [440, 1262, 12]]),
	fusiform('sartorius', [[386, 872, 8], [416, 1000, 10], [442, 1150, 9], [452, 1292, 6]]),
	fusiform('tibialis', [[404, 1330, 13], [402, 1430, 17], [400, 1560, 10], [398, 1650, 5]]),
	fusiform('gastrocnemius', [[428, 1326, 9], [438, 1400, 19], [432, 1486, 10]]),
	fusiform('scm', [[442, 196, 8], [462, 242, 10], [488, 298, 6]]),
];

// grands droits de l'abdomen : 4 « carreaux » par côté
const ABS_R: Muscle[] = [0, 1, 2, 3].map((i) => {
	const y0 = 484 + i * 74;
	const y1 = y0 + (i === 3 ? 120 : 66);
	return {
		id: `abs-${i}`,
		d: smooth([[497, y0], [470, y0 + 2], [456, y0 + 10], [452, (y0 + y1) / 2], [458, y1 - 6], [474, y1], [497, y1]], true),
		fibers: [`M476 ${y0 + 8} L474 ${y1 - 8}`],
	};
});

const mirrorMuscle = (m: Muscle): Muscle => ({
	id: `${m.id}-l`,
	d: mirrorPath(m.d),
	fibers: m.fibers.map(mirrorPath),
});

/** miroir d'un tracé SVG (commandes absolues M/C/L/Z uniquement) */
export function mirrorPath(d: string): string {
	let i = 0;
	return d.replace(/-?\d+(\.\d+)?/g, (n) => (i++ % 2 === 0 ? String(1000 - parseFloat(n)) : n));
}

export const MUSCLES: Muscle[] = [...MUSCLES_R, ...ABS_R].flatMap((m) => [{...m, id: `${m.id}-r`}, mirrorMuscle(m)]);

/* ─────────── squelette (discret, vue « rayons X ») ─────────── */

export const RIBS: string[] = Array.from({length: 9}, (_, i) => {
	const y = 336 + i * 34;
	const w = 118 + Math.sin(((i + 1) / 10) * Math.PI) * 52;
	return `M${500 + 14} ${y} C${500 + w * 0.6} ${y - 14} ${500 + w} ${y + 4} ${500 + w + 8} ${y + 46 + i * 2}`;
}).flatMap((d) => [d, mirrorPath(d)]);
export const BONES: string[] = [
	'M500 316 L500 520', // sternum
	'M374 316 C420 306 462 312 494 318', // clavicules
	mirrorPath('M374 316 C420 306 462 312 494 318'),
	'M364 836 C352 790 384 760 430 772 C460 782 480 812 500 830', // bassin
	mirrorPath('M364 836 C352 790 384 760 430 772 C460 782 480 812 500 830'),
];
