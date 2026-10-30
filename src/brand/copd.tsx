// Briques « BPCO » réutilisables : gros plan d'une bronche (paroi qui s'enflamme, mucus, passage qui rétrécit,
// alvéoles au bout qui se détruisent = emphysème, air qui entre puis reste piégé, bronchodilatateur qui la rouvre),
// spiromètre (on souffle dans un tube : courbe du volume soufflé, repère à 1 seconde, seuil de 70 %) et inhalateur.
// L'arbre bronchique vu à travers le thorax est dans le `Patient` (`bronchi`, `narrow`, `trapped`, `cannula`).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/** Hasard stable (0 → 1) pour l'élément i, k. */
const rnd = (i: number, k = 0) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Alvéoles en grappe au bout de la bronche (viewBox 900 × 460). */
const ALV = [
	[628, 118, 60],
	[732, 92, 58],
	[818, 160, 56],
	[712, 214, 58],
	[822, 280, 56],
	[640, 322, 60],
	[742, 352, 56],
];
/** Deux grands sacs qui remplacent les alvéoles détruites (emphysème). */
const SACS = [
	[690, 150, 118, 96],
	[740, 300, 112, 92],
];
const CY = 230;
const TUBE_END = 540;

/**
 * Gros plan d'une bronche, vue en long (viewBox 900 × 460, largeur `width`), alvéoles au bout à droite.
 * `inflame` : la paroi rougit et gonfle ; `mucus` : bouchons collés à la paroi ; `narrow` : le passage rétrécit ;
 * `alveoli` : grappe d'alvéoles visible ; `damage` : elles se détruisent (grands sacs) ; `airIn` / `airOut` : bulles
 * d'air qui entrent / ressortent (ralenties par le rétrécissement) ; `trapped` : bulles qui restent coincées au bout ;
 * `mist` : bouffée de médicament (bronchodilatateur).
 */
export const Bronchus: React.FC<{
	width?: number;
	inflame?: number;
	mucus?: number;
	narrow?: number;
	alveoli?: number;
	damage?: number;
	airIn?: number;
	airOut?: number;
	trapped?: number;
	mist?: number;
}> = ({width = 900, inflame = 0, mucus = 0, narrow = 0, alveoli = 1, damage = 0, airIn = 0, airOut = 0, trapped = 0, mist = 0}) => {
	const frame = useCurrentFrame();
	const OH = 150;
	const LH = 112 - 72 * narrow;
	// bord intérieur de la paroi (bosselé quand elle s'enflamme)
	const edge = (side: -1 | 1) => {
		const pts: string[] = [];
		for (let x = -40; x <= TUBE_END; x += 20) {
			const bump = inflame * 12 * Math.sin(x / 34 + (side > 0 ? 1.4 : 0)) + inflame * 6;
			pts.push(`${x} ${CY + side * (LH + bump * (narrow > 0 ? 1 : 0.6))}`);
		}
		return pts;
	};
	const top = edge(-1);
	const bot = edge(1);
	const wallTop = `M-40 ${CY - OH} L${TUBE_END} ${CY - OH} L${top.slice().reverse().join(' L')} Z`;
	const wallBot = `M-40 ${CY + OH} L${TUBE_END} ${CY + OH} L${bot.slice().reverse().join(' L')} Z`;
	const lumen = `M${top.join(' L')} L${bot.slice().reverse().join(' L')} Z`;
	const speedIn = 7 * (1 - 0.5 * narrow);
	const speedOut = 7 * (1 - 0.8 * narrow);
	return (
		<svg width={width} height={(width * 460) / 900} viewBox="0 0 900 460" style={{overflow: 'visible'}}>
			{/* alvéoles (saines : grappe ; détruites : grands sacs, parois déchirées) */}
			{alveoli > 0 ? (
				<g opacity={alveoli}>
					{ALV.map(([x, y, r], i) => (
						<path key={`s${i}`} d={`M${TUBE_END - 10} ${CY} Q${(TUBE_END + x) / 2} ${(CY + y) / 2 + (y < CY ? 20 : -20)} ${x} ${y}`} fill="none" stroke={N} strokeWidth={22} strokeLinecap="round" opacity={1 - 0.6 * damage} />
					))}
					{ALV.map(([x, y, r], i) => (
						<path key={`l${i}`} d={`M${TUBE_END - 10} ${CY} Q${(TUBE_END + x) / 2} ${(CY + y) / 2 + (y < CY ? 20 : -20)} ${x} ${y}`} fill="none" stroke={LPI.paper} strokeWidth={11} strokeLinecap="round" opacity={1 - 0.6 * damage} />
					))}
					{SACS.map(([x, y, rx, ry], i) => (
						<ellipse key={`b${i}`} cx={x} cy={y} rx={rx} ry={ry} fill={alpha(LPI.sky, 0.75)} stroke={N} strokeWidth={7} opacity={damage} />
					))}
					{ALV.map(([x, y, r], i) => (
						<g key={i} opacity={1 - damage * 0.85}>
							<circle cx={x} cy={y} r={r * (1 - 0.15 * damage)} fill={LPI.sky} stroke={N} strokeWidth={7} strokeDasharray={damage > 0 ? `${60 - 50 * damage} ${10 + 40 * damage}` : undefined} />
							<circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.22} fill={alpha(LPI.paper, 0.7)} />
						</g>
					))}
				</g>
			) : null}
			{/* paroi de la bronche : bleu clair, puis rose quand elle s'enflamme ; anneaux de cartilage */}
			<path d={lumen} fill={LPI.paper} />
			{[wallTop, wallBot].map((d) => (
				<g key={d}>
					<path d={d} fill={LPI.sky} />
					<path d={d} fill={LPI.pink} opacity={0.85 * inflame} />
				</g>
			))}
			{Array.from({length: 8}, (_, i) => (
				<g key={i}>
					<path d={`M${10 + i * 70} ${CY - OH + 10} V${CY - LH - 26}`} stroke={alpha(N, 0.14)} strokeWidth={14} strokeLinecap="round" />
					<path d={`M${10 + i * 70} ${CY + OH - 10} V${CY + LH + 26}`} stroke={alpha(N, 0.14)} strokeWidth={14} strokeLinecap="round" />
				</g>
			))}
			<path d={`M-40 ${CY - OH} H${TUBE_END} M-40 ${CY + OH} H${TUBE_END}`} stroke={N} strokeWidth={9} />
			<path d={`M${top.join(' L')}`} fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round" />
			<path d={`M${bot.join(' L')}`} fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round" />
			{/* bouchons de mucus collés à la paroi */}
			{mucus > 0
				? [70, 200, 330, 450].map((x, i) => {
						const side = i % 2 ? 1 : -1;
						const y = CY + side * (LH + inflame * 6 - 6);
						const wob = Math.sin(frame / 9 + i) * 3;
						return (
							<g key={x} transform={`translate(${x} ${y}) scale(${mucus})`}>
								<ellipse rx={40 + wob} ry={24 - wob / 2} fill={alpha(LPI.blue, 0.45)} stroke={N} strokeWidth={5} />
								<ellipse cx={-10} cy={-6} rx={9} ry={5} fill={alpha(LPI.paper, 0.8)} />
							</g>
						);
					})
				: null}
			{/* médicament (bronchodilatateur) : brume qui entre */}
			{mist > 0
				? Array.from({length: 14}, (_, i) => {
						const x = -40 + ((frame * 6 + rnd(i) * 600) % 620);
						const y = CY + (rnd(i, 2) - 0.5) * 1.4 * LH;
						return <circle key={i} cx={x} cy={y} r={7 + 6 * rnd(i, 3)} fill={alpha(LPI.blue, 0.35)} opacity={mist} />;
					})
				: null}
			{/* bulles d'air qui entrent / ressortent */}
			{airIn > 0
				? Array.from({length: 9}, (_, i) => {
						const x = -40 + ((frame * speedIn + i * 80) % 760);
						const inAlv = x > TUBE_END - 20;
						const [ax, ay] = ALV[i % ALV.length];
						const p = inAlv ? Math.min(1, (x - TUBE_END + 20) / 200) : 0;
						const y = inAlv ? CY + (ay - CY) * p : CY + Math.sin(i * 1.7) * LH * 0.55;
						const xx = inAlv ? TUBE_END - 20 + (ax - TUBE_END + 20) * p : x;
						return <circle key={i} cx={xx} cy={y} r={13} fill={LPI.paper} stroke={LPI.blue} strokeWidth={5} opacity={airIn * (inAlv ? 1 - p * 0.6 : 1)} />;
					})
				: null}
			{airOut > 0
				? Array.from({length: 9}, (_, i) => {
						const x = TUBE_END + 40 - ((frame * speedOut + i * 70) % 640);
						const y = CY + Math.sin(i * 2.1) * LH * 0.5;
						return <circle key={i} cx={x} cy={y} r={13} fill={LPI.paper} stroke={LPI.blue} strokeWidth={5} opacity={airOut * Math.min(1, (x + 40) / 120)} />;
					})
				: null}
			{trapped > 0
				? Array.from({length: 14}, (_, i) => {
						const [ax, ay, r] = damage > 0.5 ? [...SACS[i % 2].slice(0, 2), 70] : ALV[i % ALV.length];
						const o = Math.min(1, Math.max(0, trapped * 14 - i));
						const a = rnd(i, 4) * Math.PI * 2;
						const d = r * 0.55 * rnd(i, 5);
						return (
							<circle
								key={i}
								cx={ax + Math.cos(a) * d + Math.sin(frame / 5 + i) * 4}
								cy={ay + Math.sin(a) * d + Math.cos(frame / 6 + i) * 4}
								r={13}
								fill={LPI.paper}
								stroke={LPI.blue}
								strokeWidth={5}
								opacity={o}
							/>
						);
					})
				: null}
		</svg>
	);
};

/** Volume soufflé (fraction de tout l'air soufflé) au temps s (secondes), sain ou BPCO (0 → 1). */
export const exhaled = (s: number, copd: number) => {
	const tau = 0.5 + 0.75 * copd;
	return (1 - Math.exp(-s / tau)) / (1 - Math.exp(-6 / tau));
};

/**
 * Spiromètre (viewBox 560 × 400, largeur `width`) : boîtier, écran avec la courbe du volume soufflé en 6 secondes.
 * `t` 0 → 1 : la courbe se trace ; `copd` : courbe lente (bronches obstruées) ; `ref` : courbe normale en pointillés ;
 * `mark` : repère à 1 seconde + seuil de 70 % ; `blow` : le patient souffle (voyant qui s'allume).
 */
export const Spirometer: React.FC<{width?: number; t: number; copd?: number; ref?: number; mark?: number; blow?: number}> = ({width = 560, t, copd = 1, ref = 0, mark = 0, blow = 0}) => {
	const X0 = 96;
	const X1 = 486;
	const Y0 = 276;
	const Y1 = 86;
	const px = (s: number) => X0 + ((X1 - X0) * s) / 6;
	const py = (v: number) => Y0 - (Y0 - Y1) * v;
	const curve = (c: number, upTo: number) => {
		const pts: string[] = [];
		for (let s = 0; s <= upTo + 1e-6; s += 0.05) pts.push(`${px(s).toFixed(1)} ${py(exhaled(s, c)).toFixed(1)}`);
		return pts.length > 1 ? `M${pts.join(' L')}` : '';
	};
	const sNow = 6 * t;
	const v1 = exhaled(1, copd);
	return (
		<svg width={width} height={(width * 400) / 560} viewBox="0 0 560 400" style={{overflow: 'visible'}}>
			<rect x={10} y={10} width={540} height={370} rx={36} fill={N} />
			<rect x={36} y={36} width={488} height={290} rx={20} fill={LPI.paper} />
			{/* axes + graduations */}
			<path d={`M${X0} ${Y1 - 10} V${Y0} H${X1 + 10}`} fill="none" stroke={alpha(N, 0.55)} strokeWidth={4} />
			{[1, 2, 3, 4, 5, 6].map((s) => (
				<path key={s} d={`M${px(s)} ${Y0} v8`} stroke={alpha(N, 0.55)} strokeWidth={4} />
			))}
			<text x={X1} y={Y0 + 34} textAnchor="end" fontFamily={FONT.body} fontWeight={800} fontSize={20} fill={alpha(N, 0.6)}>
				temps (s)
			</text>
			<text x={X0 - 12} y={Y1 + 6} textAnchor="end" fontFamily={FONT.body} fontWeight={800} fontSize={22} fill={alpha(N, 0.6)}>
				100 %
			</text>
			{/* courbe normale (pointillés) */}
			{ref > 0 ? <path d={curve(0, 6)} fill="none" stroke={LPI.sky} strokeWidth={7} strokeDasharray="12 10" strokeLinecap="round" opacity={ref} /> : null}
			{/* repère 1 s et seuil 70 % */}
			{mark > 0 ? (
				<g opacity={mark}>
					<path d={`M${px(1)} ${Y0} V${Y1 - 6}`} stroke={N} strokeWidth={4} strokeDasharray="6 7" />
					<path d={`M${X0} ${py(0.7)} H${X1}`} stroke={LPI.pink} strokeWidth={4} strokeDasharray="10 8" />
					<text x={px(1) + 8} y={Y0 - 10} fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={N}>
						1 s
					</text>
					<text x={X1} y={py(0.7) - 10} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={LPI.pink}>
						70 %
					</text>
				</g>
			) : null}
			{/* courbe du patient */}
			{t > 0 ? <path d={curve(copd, Math.min(6, sNow))} fill="none" stroke={LPI.blue} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}
			{mark > 0 && t >= 1 / 6 ? <circle cx={px(1)} cy={py(v1)} r={11} fill={LPI.pink} stroke={N} strokeWidth={4} opacity={mark} /> : null}
			{/* voyant + embout */}
			<circle cx={500} cy={354} r={10} fill={blow > 0 ? LPI.pink : alpha(LPI.sky, 0.4)} opacity={0.5 + 0.5 * blow} />
			<text x={40} y={362} fontFamily={FONT.body} fontWeight={800} fontSize={22} letterSpacing="0.12em" fill={LPI.sky}>
				SPIROMÈTRE
			</text>
		</svg>
	);
};

/**
 * Inhalateur (aérosol doseur, viewBox 220 × 260, largeur `width`) : `press` 0 → 1 enfonce la cartouche,
 * `puff` 0 → 1 fait sortir la bouffée de médicament par l'embout (à droite).
 */
export const Inhaler: React.FC<{width?: number; press?: number; puff?: number}> = ({width = 220, press = 0, puff = 0}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 260) / 220} viewBox="0 0 220 260" style={{overflow: 'visible'}}>
			{puff > 0
				? Array.from({length: 7}, (_, i) => {
						const t = ((frame * 1.2 + i * 9) % 40) / 40;
						return <circle key={i} cx={196 + t * 120} cy={206 + (rnd(i) - 0.5) * 50 * t} r={10 + 22 * t} fill={alpha(LPI.sky, 0.85)} stroke={alpha(N, 0.25)} strokeWidth={3} opacity={puff * (1 - t)} />;
					})
				: null}
			<rect x={66} y={8 + press * 18} width={64} height={130} rx={18} fill={LPI.sky} stroke={N} strokeWidth={8} />
			<rect x={78} y={28 + press * 18} width={40} height={10} rx={5} fill={alpha(N, 0.25)} />
			<path d="M54 92 H142 V180 H198 V232 H54 Z" fill={LPI.blue} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			<path d="M150 194 H196" stroke={alpha(LPI.paper, 0.6)} strokeWidth={8} strokeLinecap="round" />
		</svg>
	);
};
