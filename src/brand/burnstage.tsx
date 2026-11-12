// Série « les degrés de brûlure » (1er, 2e superficiel / profond, 3e) : aspect de la brûlure vue de dessus sur une vraie
// peau (`BurnPatch`, couleurs réalistes : mise en situation, règle du propriétaire), bande de profondeur sur la coupe de
// peau (`DepthBand`), et trois mises en situation réalistes plein écran : la plage (`BeachTop`), les pâtes qu'on égoutte
// (`PastaPour`), le barbecue qu'on rallume à l'alcool (`Barbecue`).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';
import {SkinG} from './tick';
import {SkinAt, SkinLabels} from './wound';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Vraies couleurs (exceptions à la palette, demandées pour les mises en situation). */
const R = {
	skinHi: '#FBE0CB',
	skin: '#F0C2A0',
	skinLo: '#DCA27C',
	line: 'rgba(110,60,35,0.75)',
	red: '#D9483E',
	redSoft: '#E0604F',
	fluid: 'rgba(246,226,170,0.78)',
	fluidLine: '#C9A15A',
	pale: '#F3E6E0',
	waxy: '#EDE6D6',
	brown: '#7A4A2A',
	char: '#2A1E18',
	sand: '#E8D3A2',
	sandDk: '#CDB27C',
	towelA: '#2F6FD6',
	towelB: '#FAFAF7',
	shorts: '#C8343B',
	hair: '#4A2E1C',
	steel: '#B9C0C6',
	steelDk: '#7E878F',
	steelHi: '#E6EAED',
	water: 'rgba(205,228,245,0.85)',
	pasta: '#F2D38A',
	tile: '#EEF0EE',
	tileLine: '#D2D6D3',
	counter: '#9C8A74',
	grass: '#7FAE5A',
	grassDk: '#5E8F43',
	hedge: '#4F8A3E',
	grill: '#2B2B2B',
	grillHi: '#55595C',
	coal: '#3A2E28',
	ember: '#F06A2A',
	flameR: '#E2412C',
	flameO: '#F5892B',
	flameY: '#FFD24A',
	bottle: '#3D7FD9',
};
export const BURN_COLORS = R;
const LINE = {stroke: R.line, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Contour irrégulier autour de (cx, cy) (rayon moyen r). */
const blob = (cx: number, cy: number, r: number, seed = 0, n = 40) =>
	Array.from({length: n}, (_, i) => {
		const t = (i / n) * Math.PI * 2;
		const rr = r * (1 + 0.12 * Math.sin(3 * t + seed) + 0.07 * Math.sin(5 * t + 2 * seed) + 0.04 * Math.sin(9 * t + seed));
		return `${i ? 'L' : 'M'}${(cx + Math.cos(t) * rr).toFixed(1)} ${(cy + Math.sin(t) * rr * 0.82).toFixed(1)}`;
	}).join(' ') + ' Z';

/**
 * Brûlure vue de dessus, dans le repère 1000 × 1000 d'une peau en gros plan (`SkinG real`), centrée en (500, 500).
 * `deg` : 1 (rouge, sèche), 2 (2e superficiel : rouge, suintante, cloques claires tendues), 2.5 (2e profond : pâle,
 * blanchâtre, cloques molles), 3 (cartonnée, blanche / brune / noire, sèche, halo rouge autour). `k` 0 → 1 : la
 * brûlure apparaît ; `heal` 0 → 1 : elle guérit (1er degré : la rougeur s'efface, la peau pèle un peu).
 */
export const BurnPatch: React.FC<{deg: 1 | 2 | 2.5 | 3; k?: number; heal?: number; r?: number}> = ({deg, k = 1, heal = 0, r = 260}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const a = cl(k) * (1 - cl(heal));
	if (cl(k) <= 0) return null;
	return (
		<g>
			<defs>
				<radialGradient id={`br${id}`}>
					<stop offset="0" stopColor={R.red} stopOpacity={0.75} />
					<stop offset="0.65" stopColor={R.redSoft} stopOpacity={0.55} />
					<stop offset="1" stopColor={R.redSoft} stopOpacity={0} />
				</radialGradient>
				<radialGradient id={`bp${id}`}>
					<stop offset="0" stopColor={R.pale} stopOpacity={0.95} />
					<stop offset="0.7" stopColor={R.pale} stopOpacity={0.8} />
					<stop offset="1" stopColor={R.redSoft} stopOpacity={0.5} />
				</radialGradient>
				<filter id={`bf${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
			</defs>
			{deg === 1 ? (
				<g opacity={a}>
					<ellipse cx={500} cy={500} rx={r * 1.4} ry={r * 1.15} fill={`url(#br${id})`} />
					{/* peau sèche : fines ridules */}
					{[0, 1, 2, 3, 4].map((i) => (
						<path key={i} d={`M${380 + i * 50} ${420 + (i % 2) * 40} q20 -8 40 0`} fill="none" stroke={alpha('#8A3A2A', 0.25)} strokeWidth={3} />
					))}
				</g>
			) : null}
			{deg === 1 && heal > 0.4 ? (
				<g opacity={cl((heal - 0.4) / 0.3) * (1 - cl((heal - 0.85) / 0.15))}>
					{[[420, 450], [560, 480], [480, 580], [600, 560]].map(([x, y], i) => (
						<path key={i} d={`M${x} ${y} l18 -6 l10 12 l-14 10 Z`} fill={alpha('#FFFFFF', 0.7)} stroke={alpha('#B08060', 0.4)} strokeWidth={2} />
					))}
				</g>
			) : null}
			{deg === 2 ? (
				<g opacity={a}>
					<path d={blob(500, 500, r * 1.1, 1)} fill={R.redSoft} opacity={0.35} filter={`url(#bf${id})`} />
					<path d={blob(500, 500, r * 0.95, 1)} fill={alpha(R.red, 0.72)} />
					{/* suintement : reflets brillants + gouttelettes */}
					{[[400, 430, 40], [600, 450, 30], [470, 620, 34], [640, 600, 22]].map(([x, y, s], i) => (
						<ellipse key={i} cx={x} cy={y} rx={s} ry={s * 0.4} fill={alpha('#FFFFFF', 0.45)} transform={`rotate(-20 ${x} ${y})`} />
					))}
					{/* cloques tendues remplies de liquide clair */}
					{[[440, 500, 80], [590, 520, 62], [520, 400, 48], [380, 600, 40]].map(([x, y, s], i) => {
						const g = cl(k * 1.4 - i * 0.12);
						return (
							<g key={`c${i}`} transform={`translate(${x} ${y}) scale(${g})`}>
								<ellipse rx={s} ry={s * 0.8} fill={R.fluid} stroke={R.fluidLine} strokeWidth={4} />
								<ellipse cx={-s * 0.35} cy={-s * 0.3} rx={s * 0.35} ry={s * 0.18} fill={alpha('#FFFFFF', 0.85)} />
								<ellipse cx={s * 0.2} cy={s * 0.35} rx={s * 0.5} ry={s * 0.2} fill={alpha('#E8C27A', 0.35)} />
							</g>
						);
					})}
					{[0, 1, 2].map((i) => {
						const t = ((frame / 40 + i / 3) % 1);
						return <ellipse key={`d${i}`} cx={360 + i * 140} cy={660 + t * 60} rx={8} ry={11} fill={alpha('#F6E2AA', 0.7 * (1 - t))} />;
					})}
				</g>
			) : null}
			{deg === 2.5 ? (
				<g opacity={a}>
					<path d={blob(500, 500, r * 1.12, 2)} fill={alpha(R.redSoft, 0.5)} filter={`url(#bf${id})`} />
					<path d={blob(500, 500, r * 0.95, 2)} fill={`url(#bp${id})`} />
					{/* marbrures rouges en bordure */}
					{[[330, 480], [660, 430], [640, 640], [400, 650], [520, 330]].map(([x, y], i) => (
						<ellipse key={i} cx={x} cy={y} rx={40} ry={24} fill={alpha(R.red, 0.35)} filter={`url(#bf${id})`} />
					))}
					{/* cloques molles, plissées, à moitié vides */}
					{[[450, 480, 90], [600, 560, 60]].map(([x, y, s], i) => (
						<path
							key={`f${i}`}
							d={`M${x - s} ${y} C${x - s * 0.8} ${y - s * 0.7} ${x - s * 0.2} ${y - s * 0.5} ${x} ${y - s * 0.62} C${x + s * 0.3} ${y - s * 0.7} ${x + s * 0.9} ${y - s * 0.5} ${x + s} ${y} C${x + s * 0.6} ${y + s * 0.4} ${x + s * 0.1} ${y + s * 0.2} ${x - s * 0.3} ${y + s * 0.42} C${x - s * 0.6} ${y + s * 0.5} ${x - s} ${y + s * 0.3} ${x - s} ${y} Z`}
							fill={alpha('#F0E6C8', 0.6)}
							stroke={alpha(R.fluidLine, 0.8)}
							strokeWidth={3}
						/>
					))}
					{[[450, 480], [600, 560]].map(([x, y], i) => (
						<path key={`w${i}`} d={`M${x - 40} ${y - 10} q20 12 40 0 q20 -12 40 0`} fill="none" stroke={alpha('#B89A60', 0.6)} strokeWidth={3} />
					))}
				</g>
			) : null}
			{deg === 3 ? (
				<g opacity={a}>
					{/* halo rouge douloureux tout autour */}
					<path d={blob(500, 500, r * 1.28, 3)} fill={alpha(R.red, 0.45)} filter={`url(#bf${id})`} />
					<path d={blob(500, 500, r * 0.98, 3)} fill={R.waxy} stroke={alpha(R.char, 0.6)} strokeWidth={4} />
					<path d={blob(560, 470, r * 0.55, 5, 30)} fill={R.brown} />
					<path d={blob(470, 560, r * 0.38, 7, 30)} fill={R.char} />
					<path d={blob(610, 580, r * 0.22, 9, 24)} fill={alpha(R.char, 0.85)} />
					{/* peau cartonnée : craquelures sèches */}
					{[
						'M380 420 L430 450 L420 500',
						'M560 380 L590 430 L640 440',
						'M600 600 L560 640 L520 630',
						'M420 600 L450 560',
					].map((d, i) => (
						<path key={i} d={d} fill="none" stroke={alpha('#1A120E', 0.6)} strokeWidth={4} strokeLinecap="round" />
					))}
					<ellipse cx={420} cy={420} rx={40} ry={14} fill={alpha('#FFFFFF', 0.25)} />
				</g>
			) : null}
		</g>
	);
};

/**
 * Bande de profondeur sur la coupe de peau (`SkinAt`, repère 900 × 500) : la zone touchée de `y0` à `y1` (repère de la
 * coupe), en rose hachuré (`tone` pink) ou bleu nuit (`destroyed`, tissu détruit). `k` 0 → 1 : la bande descend.
 */
export const DepthBand: React.FC<{box: {x: number; y: number; w: number}; y0: number; y1: number; k: number; destroyed?: boolean}> = ({box, y0, y1, k, destroyed}) => {
	const h = (y1 - y0) * cl(k);
	if (h <= 0) return null;
	const c = destroyed ? N : LPI.pink;
	return (
		<svg width={box.w} height={box.w * 0.6} viewBox="0 0 900 540" style={{position: 'absolute', left: box.x, top: box.y, overflow: 'visible'}}>
			<defs>
				<pattern id={`db${y0}${y1}`} width={24} height={24} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<rect width={24} height={24} fill={alpha(c, destroyed ? 0.7 : 0.55)} />
					<line x1={0} y1={0} x2={0} y2={24} stroke={alpha(c, 0.8)} strokeWidth={8} />
				</pattern>
			</defs>
			<rect x={6} y={y0} width={888} height={h} fill={`url(#db${y0}${y1})`} stroke={c} strokeWidth={7} rx={8} />
			<line x1={-20} y1={y0 + h} x2={920} y2={y0 + h} stroke={c} strokeWidth={6} strokeDasharray="16 10" />
		</svg>
	);
};

/* ─────────────────────────────── 1er degré : la plage ─────────────────────────────── */

/**
 * La plage vue de dessus (plein écran 1080 × 1920) : sable, serviette rayée, ombre du parasol, quelqu'un allongé sur le
 * ventre. `red` 0 → 1 : le dos et les épaules rougissent ; `eve` 0 → 1 : lumière du soir ; `touch` 0 → 1 : un doigt
 * appuie sur l'épaule (la peau blanchit puis rougit) ; `sun` 0 → 1 : soleil qui tape (reflets).
 */
export const BeachTop: React.FC<{red?: number; eve?: number; touch?: number; sun?: number}> = ({red = 0, eve = 0, touch = 0, sun = 1}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const rd = cl(red);
	const TP = {x: 690, y: 700};
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id={`bk${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={R.skinLo} />
					<stop offset="0.5" stopColor={R.skin} />
					<stop offset="1" stopColor={R.skinLo} />
				</linearGradient>
				<radialGradient id={`bs${id}`}>
					<stop offset="0" stopColor={R.red} stopOpacity={0.8} />
					<stop offset="1" stopColor={R.red} stopOpacity={0} />
				</radialGradient>
				<filter id={`bb${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
			</defs>
			<rect width={1080} height={1920} fill={R.sand} />
			{Array.from({length: 260}, (_, i) => (
				<circle key={i} cx={(i * 97) % 1080} cy={(i * 173) % 1920} r={2 + (i % 3)} fill={alpha(R.sandDk, 0.6)} />
			))}
			{/* serviette rayée */}
			<g transform="rotate(-4 540 1060)">
				<rect x={250} y={330} width={580} height={1460} rx={20} fill={alpha('#000000', 0.15)} filter={`url(#bb${id})`} transform="translate(12 16)" />
				<rect x={250} y={330} width={580} height={1460} rx={20} fill={R.towelB} />
				{Array.from({length: 10}, (_, i) => (
					<rect key={i} x={250} y={330 + i * 146} width={580} height={73} fill={R.towelA} />
				))}
				{Array.from({length: 22}, (_, i) => (
					<line key={`f${i}`} x1={262 + i * 26} y1={330} x2={262 + i * 26} y2={300} stroke={R.towelB} strokeWidth={5} />
				))}
			</g>
			{/* la personne allongée sur le ventre (vue de dessus, tête en haut) */}
			<g>
				<path d="M540 1000 C600 1000 640 1040 640 1100 L650 1660 C650 1700 610 1710 600 1680 L560 1240 L520 1240 L480 1680 C470 1710 430 1700 430 1660 L440 1100 C440 1040 480 1000 540 1000 Z" fill={`url(#bk${id})`} {...LINE} />
				<path d="M430 1080 C430 1040 480 1020 540 1020 C600 1020 650 1040 650 1080 L656 1240 C620 1260 460 1260 424 1240 Z" fill={R.shorts} stroke={alpha('#000000', 0.3)} strokeWidth={4} />
				{/* bras le long du corps */}
				<path d="M350 640 C320 760 316 900 330 1040 C334 1070 370 1072 372 1040 C380 920 390 800 410 680 Z" fill={`url(#bk${id})`} {...LINE} />
				<path d="M730 640 C760 760 764 900 750 1040 C746 1070 710 1072 708 1040 C700 920 690 800 670 680 Z" fill={`url(#bk${id})`} {...LINE} />
				{/* dos + épaules */}
				<path d="M540 560 C640 560 740 590 740 660 C740 780 690 900 650 1030 L430 1030 C390 900 340 780 340 660 C340 590 440 560 540 560 Z" fill={`url(#bk${id})`} {...LINE} />
				<path d="M540 600 L540 1000" stroke={alpha(R.skinLo, 0.9)} strokeWidth={6} strokeLinecap="round" />
				<path d="M450 660 C480 700 500 720 500 760 M630 660 C600 700 580 720 580 760" fill="none" stroke={alpha(R.skinLo, 0.7)} strokeWidth={5} strokeLinecap="round" />
				{/* coup de soleil */}
				{rd > 0 ? (
					<g opacity={rd}>
						<ellipse cx={440} cy={680} rx={170} ry={110} fill={`url(#bs${id})`} />
						<ellipse cx={640} cy={680} rx={170} ry={110} fill={`url(#bs${id})`} />
						<ellipse cx={540} cy={820} rx={220} ry={180} fill={`url(#bs${id})`} opacity={0.8} />
						<ellipse cx={360} cy={820} rx={60} ry={140} fill={`url(#bs${id})`} opacity={0.7} />
						<ellipse cx={720} cy={820} rx={60} ry={140} fill={`url(#bs${id})`} opacity={0.7} />
					</g>
				) : null}
				{/* tête (de dos) */}
				<ellipse cx={540} cy={470} rx={110} ry={120} fill={R.hair} />
				<path d="M450 440 C470 400 520 390 560 400" fill="none" stroke={alpha('#FFFFFF', 0.2)} strokeWidth={10} strokeLinecap="round" />
				<path d="M470 560 C500 580 580 580 610 560 L600 600 C570 610 510 610 480 600 Z" fill={`url(#bk${id})`} />
			</g>
			{/* un doigt appuie sur l'épaule : la peau blanchit, puis la rougeur revient */}
			{touch > 0 ? (
				<g>
					<ellipse cx={TP.x} cy={TP.y} rx={34 * cl(touch * 2)} ry={26 * cl(touch * 2)} fill={alpha('#FFFFFF', 0.55 * (1 - cl((touch - 0.7) / 0.3)))} />
					<g transform={`translate(${(1 - cl(touch * 1.6)) * 220} ${-(1 - cl(touch * 1.6)) * 260})`} opacity={touch < 0.85 ? 1 : 1 - (touch - 0.85) / 0.15}>
						<line x1={TP.x + 200} y1={TP.y - 300} x2={TP.x + 12} y2={TP.y - 18} stroke={R.line} strokeWidth={84} strokeLinecap="round" />
						<line x1={TP.x + 200} y1={TP.y - 300} x2={TP.x + 12} y2={TP.y - 18} stroke={R.skin} strokeWidth={76} strokeLinecap="round" />
						<ellipse cx={TP.x + 30} cy={TP.y - 46} rx={20} ry={28} fill="#F6D6C8" stroke={R.line} strokeWidth={2.5} transform={`rotate(-56 ${TP.x + 30} ${TP.y - 46})`} />
					</g>
				</g>
			) : null}
			{/* soleil qui tape (reflets chauds) puis lumière du soir */}
			<circle cx={1000} cy={80} r={260} fill={alpha('#FFE07A', 0.35 * sun * (1 - eve) * (0.85 + 0.15 * Math.sin(frame / 10)))} filter={`url(#bb${id})`} />
			<rect width={1080} height={1920} fill={alpha('#FFE7A8', 0.1 * sun * (1 - eve))} />
			<rect width={1080} height={1920} fill={alpha('#E8783A', 0.22 * cl(eve))} />
			<ellipse cx={-80} cy={420} rx={420} ry={300} fill={alpha('#000000', 0.12 + 0.1 * cl(eve))} filter={`url(#bb${id})`} />
		</svg>
	);
};

/* ─────────────────────────────── 2e degré : les pâtes ─────────────────────────────── */

/**
 * On égoutte les pâtes, vu de côté (plein écran 1080 × 1920) : mur carrelé, plan de travail, évier en inox, passoire,
 * casserole tenue par un avant-bras qui la penche (`tilt` 0 → 1), filet d'eau bouillante + vapeur ; `splash` 0 → 1 :
 * des gouttes rebondissent sur la passoire et viennent frapper l'avant-bras ; `jerk` : le bras sursaute.
 */
export const PastaPour: React.FC<{tilt?: number; splash?: number; jerk?: number}> = ({tilt = 0, splash = 0, jerk = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const ang = -38 * cl(tilt);
	const P = {x: 420, y: 880};
	const rad = (ang * Math.PI) / 180;
	const lip = {x: P.x + 300 * Math.cos(rad) - -20 * Math.sin(rad), y: P.y + 300 * Math.sin(rad) + -20 * Math.cos(rad)};
	const flow = cl((tilt - 0.6) / 0.4);
	const ARM = {x: 300 + jerk * -60, y: 900 + jerk * 20};
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id={`ps${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={R.steelHi} />
					<stop offset="0.5" stopColor={R.steel} />
					<stop offset="1" stopColor={R.steelDk} />
				</linearGradient>
				<linearGradient id={`pk${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={R.skinHi} />
					<stop offset="1" stopColor={R.skinLo} />
				</linearGradient>
				<filter id={`pb${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			{/* mur carrelé */}
			<rect width={1080} height={1920} fill={R.tile} />
			{Array.from({length: 12}, (_, i) => (
				<line key={`h${i}`} x1={0} y1={i * 120} x2={1080} y2={i * 120} stroke={R.tileLine} strokeWidth={4} />
			))}
			{Array.from({length: 10}, (_, i) => (
				<line key={`v${i}`} x1={i * 120} y1={0} x2={i * 120} y2={1300} stroke={R.tileLine} strokeWidth={4} />
			))}
			{/* plan de travail + évier */}
			<rect x={0} y={1300} width={1080} height={620} fill={R.counter} />
			<rect x={0} y={1300} width={1080} height={26} fill={alpha('#FFFFFF', 0.25)} />
			<path d="M330 1300 L960 1300 L930 1560 C928 1590 900 1600 870 1600 L420 1600 C390 1600 362 1590 360 1560 Z" fill={`url(#ps${id})`} stroke={R.steelDk} strokeWidth={5} />
			<path d="M360 1320 L930 1320" stroke={alpha('#FFFFFF', 0.6)} strokeWidth={6} />
			{/* robinet */}
			<path d="M900 1300 L900 1060 C900 1000 840 990 820 1030 L820 1080" fill="none" stroke={R.steelDk} strokeWidth={34} strokeLinecap="round" />
			<path d="M900 1300 L900 1060 C900 1000 840 990 820 1030 L820 1080" fill="none" stroke={R.steel} strokeWidth={24} strokeLinecap="round" />
			{/* passoire dans l'évier, pleine de pâtes */}
			<path d="M470 1190 L790 1190 C780 1330 720 1390 630 1390 C540 1390 480 1330 470 1190 Z" fill={`url(#ps${id})`} stroke={R.steelDk} strokeWidth={5} />
			{Array.from({length: 18}, (_, i) => (
				<circle key={i} cx={510 + (i % 6) * 48} cy={1240 + Math.floor(i / 6) * 40} r={6} fill={R.steelDk} />
			))}
			{Array.from({length: 9}, (_, i) => (
				<path key={`p${i}`} d={`M${490 + i * 32} 1196 q16 -${18 + (i % 3) * 6} 34 0`} fill="none" stroke={R.pasta} strokeWidth={9} strokeLinecap="round" />
			))}
			{/* eau bouillante qui tombe + vapeur */}
			{flow > 0 ? (
				<path d={`M${lip.x} ${lip.y} C${lip.x + 70} ${lip.y + 40} ${600} ${1060} ${630} ${1196}`} fill="none" stroke={R.water} strokeWidth={34 * flow} strokeLinecap="round" />
			) : null}
			{[0, 1, 2, 3, 4].map((i) => {
				const t = ((frame / 34 + i / 5) % 1);
				return <ellipse key={`s${i}`} cx={560 + i * 40 + Math.sin(frame / 9 + i) * 20} cy={1180 - t * 520} rx={70 + t * 60} ry={40 + t * 30} fill={alpha('#FFFFFF', 0.4 * (1 - t) * (0.3 + 0.7 * flow))} filter={`url(#pb${id})`} />;
			})}
			{/* éclaboussures vers l'avant-bras */}
			{splash > 0 && splash < 1
				? Array.from({length: 7}, (_, i) => {
						const t = cl(splash * 1.2 - i * 0.04);
						const x0 = 620;
						const y0 = 1190;
						const x1 = ARM.x - 40 + i * 30;
						const y1 = ARM.y + 30 - (i % 3) * 20;
						const x = x0 + (x1 - x0) * t;
						const y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 220;
						return <circle key={`g${i}`} cx={x} cy={y} r={10 - (i % 3) * 2} fill={R.water} stroke={alpha('#7FA8D8', 0.8)} strokeWidth={2} opacity={t < 1 ? 1 : 0} />;
					})
				: null}
			{/* avant-bras + main qui tient la poignée */}
			<line x1={-80} y1={ARM.y + 60} x2={ARM.x} y2={ARM.y} stroke={R.line} strokeWidth={128} strokeLinecap="round" />
			<line x1={-80} y1={ARM.y + 60} x2={ARM.x} y2={ARM.y} stroke={`url(#pk${id})`} strokeWidth={120} strokeLinecap="round" />
			{splash > 0.85 ? [0, 1, 2].map((i) => <ellipse key={`m${i}`} cx={ARM.x - 120 + i * 50} cy={ARM.y + 20 - (i % 2) * 18} rx={14} ry={9} fill={alpha(R.red, 0.6 * cl((splash - 0.85) / 0.15))} />) : null}
			{/* la casserole (pivote autour de la main) */}
			<g transform={`rotate(${ang} ${P.x} ${P.y})`}>
				<rect x={P.x - 190} y={P.y - 20} width={200} height={36} rx={18} fill={'#2B2B2B'} />
				<path d={`M${P.x} ${P.y - 30} L${P.x + 300} ${P.y - 30} L${P.x + 290} ${P.y + 170} C${P.x + 288} ${P.y + 190} ${P.x + 270} ${P.y + 200} ${P.x + 250} ${P.y + 200} L${P.x + 50} ${P.y + 200} C${P.x + 30} ${P.y + 200} ${P.x + 12} ${P.y + 190} ${P.x + 10} ${P.y + 170} Z`} fill={`url(#ps${id})`} stroke={R.steelDk} strokeWidth={5} />
				<rect x={P.x - 6} y={P.y - 40} width={312} height={16} rx={8} fill={R.steelHi} stroke={R.steelDk} strokeWidth={4} />
				<path d={`M${P.x + 40} ${P.y + 10} L${P.x + 40} ${P.y + 170}`} stroke={alpha('#FFFFFF', 0.55)} strokeWidth={14} strokeLinecap="round" />
			</g>
			<circle cx={ARM.x + 10} cy={ARM.y - 4} r={62} fill={`url(#pk${id})`} stroke={R.line} strokeWidth={4} />
			{[0, 1, 2].map((i) => (
				<path key={`k${i}`} d={`M${ARM.x - 20 + i * 18} ${ARM.y - 50} q10 -6 16 4`} fill="none" stroke={R.line} strokeWidth={3} />
			))}
		</svg>
	);
};

/* ─────────────────────────────── 3e degré : le barbecue ─────────────────────────────── */

/**
 * Le barbecue au jardin, vu de côté (plein écran 1080 × 1920) : pelouse, haie, barbecue boule, braises ; une main
 * verse une bouteille d'alcool (`pour` 0 → 1) ; `fire` 0 → 1 : une boule de feu jaillit vers le bras ; `back` 0 → 1 :
 * le bras recule.
 */
export const Barbecue: React.FC<{pour?: number; fire?: number; back?: number}> = ({pour = 0, fire = 0, back = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const G = {x: 640, y: 1160};
	const f = cl(fire);
	const flick = (i: number) => Math.sin(frame / 2.5 + i * 1.7);
	const HAND = {x: 360 - back * 180, y: 820 - back * 40};
	const tilt = -20 - 55 * cl(pour);
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#CFE6F7" />
					<stop offset="1" stopColor="#F4F8FB" />
				</linearGradient>
				<linearGradient id={`bk${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={R.grillHi} />
					<stop offset="1" stopColor={R.grill} />
				</linearGradient>
				<linearGradient id={`bs${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={R.skinHi} />
					<stop offset="1" stopColor={R.skinLo} />
				</linearGradient>
				<radialGradient id={`bf${id}`} cx="0.5" cy="0.6" r="0.6">
					<stop offset="0" stopColor={R.flameY} />
					<stop offset="0.5" stopColor={R.flameO} />
					<stop offset="1" stopColor={R.flameR} stopOpacity={0.8} />
				</radialGradient>
				<filter id={`bb${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<rect width={1080} height={1920} fill={`url(#bg${id})`} />
			{/* haie + pelouse */}
			{Array.from({length: 12}, (_, i) => (
				<circle key={i} cx={-40 + i * 100} cy={1000 + (i % 3) * 20} r={110} fill={i % 2 ? R.hedge : R.grassDk} />
			))}
			<rect x={0} y={1080} width={1080} height={840} fill={R.grass} />
			{Array.from({length: 90}, (_, i) => (
				<path key={`g${i}`} d={`M${(i * 97) % 1080} ${1120 + ((i * 61) % 780)} l-4 -18 M${((i * 97) % 1080) + 6} ${1120 + ((i * 61) % 780)} l3 -16`} stroke={R.grassDk} strokeWidth={3} strokeLinecap="round" />
			))}
			{/* barbecue boule sur pieds */}
			<ellipse cx={G.x} cy={1640} rx={260} ry={30} fill={alpha('#000000', 0.2)} filter={`url(#bb${id})`} />
			{[[-150, 1640], [0, 1660], [150, 1640]].map(([dx, y], i) => (
				<line key={i} x1={G.x + dx * 0.6} y1={G.y + 120} x2={G.x + dx} y2={y} stroke={R.grill} strokeWidth={18} strokeLinecap="round" />
			))}
			<path d={`M${G.x - 240} ${G.y} C${G.x - 240} ${G.y + 190} ${G.x + 240} ${G.y + 190} ${G.x + 240} ${G.y} Z`} fill={`url(#bk${id})`} stroke="#111" strokeWidth={5} />
			<ellipse cx={G.x - 120} cy={G.y + 60} rx={50} ry={20} fill={alpha('#FFFFFF', 0.18)} />
			{/* braises + petites flammes */}
			{Array.from({length: 9}, (_, i) => (
				<ellipse key={`c${i}`} cx={G.x - 180 + i * 45} cy={G.y - 10 - (i % 2) * 10} rx={26} ry={16} fill={i % 3 ? R.coal : R.ember} />
			))}
			{Array.from({length: 5}, (_, i) => (
				<path key={`e${i}`} d={`M${G.x - 140 + i * 70} ${G.y - 14} q-10 -${26 + 10 * flick(i)} 0 -${44 + 14 * flick(i)} q10 ${18} 0 ${44 + 14 * flick(i)}`} fill={alpha(R.flameO, 0.7 * (1 - f))} />
			))}
			<line x1={G.x - 250} y1={G.y - 6} x2={G.x + 250} y2={G.y - 6} stroke={R.grillHi} strokeWidth={8} />
			{Array.from({length: 11}, (_, i) => (
				<line key={`r${i}`} x1={G.x - 220 + i * 44} y1={G.y - 14} x2={G.x - 220 + i * 44} y2={G.y + 2} stroke={R.grillHi} strokeWidth={5} />
			))}
			{/* la boule de feu (retour de flamme) vers le bras */}
			{f > 0 ? (
				<g opacity={cl(f * 3) * (1 - cl((f - 0.75) / 0.25))}>
					{[0, 1, 2, 3].map((i) => {
						const s = f * (1 + i * 0.12);
						const cx = G.x - 120 * s - i * 40;
						const cy = G.y - 200 * s - i * 50;
						return <path key={i} d={blob(cx, cy, 170 * s * (1 - i * 0.18), i + frame / 6, 24)} fill={`url(#bf${id})`} opacity={0.95 - i * 0.15} />;
					})}
					<path d={blob(G.x - 60 * f, G.y - 120 * f, 90 * f, frame / 5, 20)} fill={R.flameY} opacity={0.9} />
				</g>
			) : null}
			{/* bras + main qui verse la bouteille */}
			<line x1={-80} y1={HAND.y - 80} x2={HAND.x} y2={HAND.y} stroke={R.line} strokeWidth={126} strokeLinecap="round" />
			<line x1={-80} y1={HAND.y - 80} x2={HAND.x} y2={HAND.y} stroke={`url(#bs${id})`} strokeWidth={118} strokeLinecap="round" />
			<g transform={`rotate(${tilt} ${HAND.x + 20} ${HAND.y})`}>
				<rect x={HAND.x - 30} y={HAND.y - 50} width={190} height={100} rx={30} fill={R.bottle} stroke="#1E4E94" strokeWidth={5} />
				<rect x={HAND.x + 160} y={HAND.y - 22} width={50} height={44} rx={10} fill="#E9EDF1" stroke="#1E4E94" strokeWidth={4} />
				<rect x={HAND.x + 20} y={HAND.y - 30} width={100} height={60} rx={8} fill="#FAFAF7" />
				<path d={`M${HAND.x + 40} ${HAND.y - 10} h60 M${HAND.x + 40} ${HAND.y + 8} h40`} stroke={R.flameR} strokeWidth={6} />
			</g>
			{pour > 0.4 && f < 0.2 ? (
				<path d={`M${HAND.x + 150} ${HAND.y + 110} C${HAND.x + 190} ${HAND.y + 200} ${G.x - 140} ${G.y - 160} ${G.x - 110} ${G.y - 20}`} fill="none" stroke={alpha('#CFE6F7', 0.9)} strokeWidth={10 * cl((pour - 0.4) / 0.3)} strokeLinecap="round" />
			) : null}
			<circle cx={HAND.x + 10} cy={HAND.y} r={64} fill={`url(#bs${id})`} stroke={R.line} strokeWidth={4} />
			{[0, 1, 2].map((i) => (
				<path key={`k${i}`} d={`M${HAND.x - 22 + i * 20} ${HAND.y + 44} q10 6 16 -4`} fill="none" stroke={R.line} strokeWidth={3} />
			))}
			{/* lueur chaude du feu sur toute la scène */}
			<rect width={1080} height={1920} fill={alpha(R.flameO, 0.18 * f * (1 - cl((f - 0.75) / 0.25)))} />
		</svg>
	);
};

/* ─────────────────────────────── Aides communes aux trois vidéos ─────────────────────────────── */

/** Peau (couleur réelle) en très gros plan centrée en (cx, cy) sur W pixels, avec une brûlure `BurnPatch` en `children`. */
export const SkinClose: React.FC<{cx?: number; cy?: number; W?: number; children?: React.ReactNode}> = ({cx = 540, cy = 1000, W = 1500, children}) => (
	<svg width={W} height={W} viewBox="0 0 1000 1000" style={{position: 'absolute', left: cx - W / 2, top: cy - W / 2, overflow: 'visible'}}>
		<SkinG real>{children}</SkinG>
	</svg>
);
/** Point du repère de `SkinClose` → écran. */
export const skinClosePt = (x: number, y: number, cx = 540, cy = 1000, W = 1500) => ({x: cx - W / 2 + (x * W) / 1000, y: cy - W / 2 + (y * W) / 1000});

/** Repère de la coupe : y des couches (voir `SKIN` de wound.tsx). */
export const CUT_Y = {top: 60, epi: 85, dermMid: 132, derm: 180, hypo: 300, musc: 400, bone: 500};

/**
 * Coupe de peau (couches étiquetées) avec la zone touchée par la brûlure : bande hachurée de `y0` à `y1` (`CUT_Y`),
 * rose (touchée) ou bleu nuit (`destroyed`). `labels` : étiquettes visibles (0 → 5), `focus` : couche en rose ;
 * `nerves`, `pain`, `nervesBurnt` : les nerfs (douleur / détruits).
 */
export const CutView: React.FC<{box?: {x: number; y: number; w: number}; y0: number; y1: number; k: number; destroyed?: boolean; labels?: number; focus?: number; nerves?: number; pain?: number; nervesBurnt?: number}> = ({box = {x: 90, y: 660, w: 900}, y0, y1, k, destroyed, labels = 3, focus = -1, nerves = 0, pain = 0, nervesBurnt = 0}) => (
	<>
		<SkinAt b={box} nerves={nerves} pain={pain} nervesBurnt={nervesBurnt} />
		<DepthBand box={box} y0={y0} y1={y1} k={k} destroyed={destroyed} />
		<div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: (box.w * 500) / 900, fontFamily: FONT.title}}>
			<SkinLabels width={box.w} labels={labels} focus={focus} side="left" />
		</div>
	</>
);
