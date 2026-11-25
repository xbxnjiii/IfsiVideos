// « L'organisation du corps humain : le schéma annoté » (n° 102, thème « l'anatomie », 2e version de la n° 101 demandée
// « avec un schéma et les annotations » ; directives Instagram). Chaque niveau est un schéma de manuel dessiné par nous
// (carte blanche, traits de rappel, légendes qui s'écrivent au mot) : 1 · la cellule (membrane, cytoplasme, mitochondries,
// noyau, ADN) ; 2 · les 4 tissus (épithélial, conjonctif, musculaire, nerveux) ; 3 · l'organe = la paroi du cœur (péricarde :
// conjonctif, myocarde : musculaire, endocarde : épithélial, nerfs : nerveux) ; 4 · l'appareil cardiovasculaire (cœur,
// artères, veines) ; 5 · l'organisme (appareils nerveux, respiratoire, cardiovasculaire, digestif, urinaire) ; fin = le
// schéma complet en 5 vignettes.
// Sources : Bianconi E. et al., Ann Hum Biol 2013 (≈ 3,7 × 10¹³ cellules) ; Marieb & Hoehn, Anatomie et physiologie
// humaines (niveaux d'organisation, 4 tissus fondamentaux, paroi du cœur : péricarde, myocarde, endocarde).
// Couleurs de manuel pour les schémas (exception validée pour l'anatomie : muscle rouge, artères rouges, veines bleues…).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note} from '../../brand/bold';
import {Camera, Confetti} from '../../brand/motion3';
import {Counter, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {ANAT_C, Ann, Defs, LevelScene} from '../../brand/schema';
import {at} from './timeline';

const N = LPI.navy;
const SERIES = {cap: LPI.pink, label: "L'ANATOMIE · LE SCHÉMA"};
const TOTAL = 5;
const C = ANAT_C;
const S = {...SERIES, total: TOTAL};
const beatOf = (f: number) => Math.max(0, Math.sin(f / 4.5)) ** 3;
const on = (f: number, t: number, d = 8) => interpolate(f, [t - 4, t - 4 + d], [0, 1], clamp);

/** Une mitochondrie (crêtes en zigzag). */
const Mito: React.FC<{x: number; y: number; r?: number; w?: number}> = ({x, y, r = 0, w = 1}) => (
	<g transform={`translate(${x} ${y}) rotate(${r}) scale(${w})`}>
		<ellipse rx={54} ry={26} fill={C.mito} stroke={C.mitoDark} strokeWidth={4} />
		<path d="M-40 0 L-32 -15 L-24 12 L-16 -15 L-8 12 L0 -15 L8 12 L16 -15 L24 12 L32 -15 L40 0" fill="none" stroke={C.mitoDark} strokeWidth={3.5} strokeLinejoin="round" />
	</g>
);

/** La cellule (centre 480, 570). */
const CellArt: React.FC<{f: number}> = ({f}) => {
	const w = 1 + 0.012 * Math.sin(f / 12);
	const cx = 480;
	const cy = 570;
	return (
		<g>
			<ellipse cx={cx + 8} cy={cy + 22} rx={235} ry={255} fill={alpha(N, 0.12)} filter="url(#ocsSoft)" />
			{/* membrane : bicouche rose */}
			<ellipse cx={cx} cy={cy} rx={232 * w} ry={252 / w} fill={LPI.pink} stroke={N} strokeWidth={5} />
			<ellipse cx={cx} cy={cy} rx={218 * w} ry={238 / w} fill="url(#ocsCyto)" stroke={alpha(N, 0.6)} strokeWidth={3} />
			{/* réticulum autour du noyau */}
			{[0, 1, 2].map((k) => (
				<path key={k} d={`M${cx - 150 - k * 14} ${cy - 40 + k * 10} C${cx - 170 - k * 14} ${cy + 60} ${cx - 120} ${cy + 150 + k * 14} ${cx - 30} ${cy + 140 + k * 16}`} fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" opacity={0.75} />
			))}
			{/* appareil de Golgi */}
			{[0, 1, 2, 3].map((k) => (
				<path key={k} d={`M${cx + 70 - k * 4} ${cy + 140 + k * 16} Q${cx + 130} ${cy + 110 + k * 16} ${cx + 175 + k * 4} ${cy + 150 + k * 16}`} fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
			))}
			{/* ribosomes et vésicules */}
			{Array.from({length: 22}).map((_, i) => {
				const a = i * 2.39;
				const r = 120 + ((i * 37) % 80);
				return <circle key={i} cx={cx + Math.cos(a) * r * 0.95} cy={cy + Math.sin(a) * r} r={i % 4 ? 5 : 11} fill={i % 4 ? N : alpha(LPI.blue, 0.4)} stroke={i % 4 ? 'none' : N} strokeWidth={2} opacity={i % 4 ? 0.55 : 1} />;
			})}
			<Mito x={cx + 105} y={cy - 150} r={-25} />
			<Mito x={cx - 120} y={cy - 160} r={30} w={0.85} />
			<Mito x={cx + 150} y={cy + 30} r={80} w={0.8} />
			<Mito x={cx - 60} y={cy + 205} r={-8} w={0.8} />
			{/* noyau : enveloppe à pores, chromatine (ADN), nucléole */}
			<circle cx={cx - 20} cy={cy + 10} r={102} fill="url(#ocsNuc)" stroke={C.nucleusDark} strokeWidth={6} strokeDasharray="44 8" />
			<path
				d={Array.from({length: 26}, (_, i) => {
					const a = i * 0.9 + f / 40;
					const r = 30 + ((i * 23) % 50);
					return `${i ? 'L' : 'M'}${cx - 20 + Math.cos(a) * r} ${cy + 10 + Math.sin(a) * r}`;
				}).join(' ')}
				fill="none"
				stroke={C.nucleusDark}
				strokeWidth={4}
				strokeLinejoin="round"
				opacity={0.8}
			/>
			<circle cx={cx - 45} cy={cy - 15} r={26} fill={C.nucleusDark} />
		</g>
	);
};

/** Les 4 tissus, chacun dans un cadre 440 × 500 ; `show[k]` 0 → 1. */
const TISSUE_POS = [
	[30, 40],
	[490, 40],
	[30, 580],
	[490, 580],
];
const TissuePanel: React.FC<{k: number; f: number; show: number; name?: string}> = ({k, f, show, name}) => {
	const [x, y] = TISSUE_POS[k];
	const body = () => {
		if (k === 0)
			return (
				<g>
					<rect x={40} y={330} width={360} height={20} fill={alpha(C.fat, 0.9)} stroke={N} strokeWidth={3} />
					{Array.from({length: 6}).map((_, i) => (
						<g key={i}>
							<rect x={40 + i * 60} y={170} width={60} height={160} rx={8} fill={alpha(LPI.pink, 0.55)} stroke={N} strokeWidth={4} />
							<ellipse cx={70 + i * 60} cy={275} rx={15} ry={22} fill={C.nucleus} stroke={C.nucleusDark} strokeWidth={3} />
						</g>
					))}
				</g>
			);
		if (k === 1)
			return (
				<g>
					<rect x={40} y={140} width={360} height={240} rx={18} fill={alpha(C.fat, 0.35)} />
					{[170, 215, 260, 305, 350].map((yy, i) => (
						<path key={yy} d={`M45 ${yy} C140 ${yy - 30} 260 ${yy + 30} 395 ${yy - 8}`} fill="none" stroke={i % 2 ? C.muscle : alpha(C.muscle, 0.55)} strokeWidth={i % 2 ? 9 : 5} strokeLinecap="round" />
					))}
					{[195, 290, 240].map((yy, i) => (
						<path key={i} d={`M60 ${yy + 10} Q200 ${yy - 30} 380 ${yy + 25}`} fill="none" stroke={N} strokeWidth={2.5} opacity={0.6} />
					))}
					{[
						[120, 200],
						[290, 250],
						[180, 330],
					].map(([cx, cy], i) => (
						<g key={i} transform={`rotate(-15 ${cx} ${cy})`}>
							<ellipse cx={cx} cy={cy} rx={32} ry={13} fill={LPI.paper} stroke={N} strokeWidth={3.5} />
							<ellipse cx={cx} cy={cy} rx={11} ry={6} fill={C.nucleus} />
						</g>
					))}
				</g>
			);
		if (k === 2) {
			const sq = 1 - 0.06 * beatOf(f);
			return (
				<g transform={`translate(220 260) scale(${sq} 1) translate(-220 -260)`}>
					{[170, 245, 320].map((yy, j) => (
						<g key={yy}>
							<rect x={40} y={yy - 30} width={360} height={60} rx={26} fill="url(#ocsMuscle)" stroke={N} strokeWidth={4} />
							{Array.from({length: 22}).map((_, i) => (
								<line key={i} x1={55 + i * 15} y1={yy - 24} x2={55 + i * 15} y2={yy + 24} stroke={alpha('#5E1820', 0.45)} strokeWidth={3} />
							))}
							<line x1={130 + j * 70} y1={yy - 30} x2={130 + j * 70} y2={yy + 30} stroke={N} strokeWidth={6} />
							<ellipse cx={250 - j * 50} cy={yy} rx={18} ry={11} fill={C.nucleus} stroke={N} strokeWidth={2.5} />
						</g>
					))}
				</g>
			);
		}
		const p = (f / 22) % 1;
		return (
			<g>
				<path d="M120 255 L50 170 M120 255 L40 260 M120 255 L60 340 M95 225 L70 150 M100 290 L95 365" stroke={N} strokeWidth={7} strokeLinecap="round" fill="none" />
				<path d="M150 255 L390 255" stroke={N} strokeWidth={8} strokeLinecap="round" />
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={175 + i * 52} y={241} width={42} height={28} rx={13} fill={C.fat} stroke={N} strokeWidth={3} />
				))}
				<path d="M390 255 L415 225 M390 255 L418 255 M390 255 L415 285" stroke={N} strokeWidth={6} strokeLinecap="round" />
				<circle cx={120} cy={255} r={40} fill={LPI.blue} stroke={N} strokeWidth={5} />
				<circle cx={120} cy={255} r={14} fill={C.nucleusDark} />
				<circle cx={165 + p * 225} cy={255} r={11} fill={LPI.pink} stroke={N} strokeWidth={3} />
			</g>
		);
	};
	const s = 0.9 + 0.1 * show;
	return (
		<g transform={`translate(${x + 220} ${y + 250}) scale(${s}) translate(${-220} ${-250})`} opacity={0.12 + 0.88 * show}>
			<rect x={0} y={0} width={440} height={500} rx={30} fill={alpha(LPI.sky, 0.35)} stroke={alpha(N, 0.25)} strokeWidth={3} />
			{body()}
			{name ? (
				<text x={30} y={70} fontFamily={FONT.title} fontWeight={900} fontSize={44} fill={N} opacity={show}>
					{name}
				</text>
			) : null}
		</g>
	);
};

/** Cœur vu de face (repère libre, ≈ 400 × 480 autour de (0, 0)) : ventricules, oreillette droite, aorte, tronc pulmonaire,
 *  veine cave, coronaires ; `nerves` (0 → 1) : nerfs jaunes à la surface. */
const HeartFront: React.FC<{beat?: number; nerves?: number}> = ({beat = 0, nerves = 0}) => {
	const s = 1 + 0.035 * beat;
	return (
		<g transform={`scale(${s})`}>
			<path d="M-150 -150 L-150 -300 Q-150 -318 -128 -318 L-108 -318 Q-90 -318 -90 -300 L-90 -150 Z" fill={C.vein} stroke={N} strokeWidth={5} />
			<path d="M-20 -110 L-20 -260 Q-20 -330 60 -330 Q130 -330 140 -260 L140 -230 L100 -230 L100 -255 Q95 -290 60 -290 Q20 -290 20 -255 L20 -110 Z" fill={C.artery} stroke={N} strokeWidth={5} />
			{[-40, 10, 55].map((x, i) => (
				<path key={i} d={`M${x + 30} -310 L${x + 22 + i * 6} -360`} stroke={C.artery} strokeWidth={22} strokeLinecap="round" />
			))}
			{[-40, 10, 55].map((x, i) => (
				<path key={`o${i}`} d={`M${x + 30} -310 L${x + 22 + i * 6} -360`} stroke={N} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5} />
			))}
			<path d="M-160 -90 C-215 -120 -225 -30 -185 20 C-170 40 -140 30 -130 10 Z" fill="#B94552" stroke={N} strokeWidth={5} />
			<path d="M-150 -110 C-190 -20 -140 120 -30 230 C0 260 30 260 50 230 C150 110 190 -10 150 -100 C120 -160 40 -170 0 -130 C-40 -165 -120 -165 -150 -110 Z" fill="url(#ocsMuscle)" stroke={N} strokeWidth={6} />
			<path d="M40 -160 Q60 -200 100 -200 L130 -200 Q150 -200 150 -180 L150 -160 Q140 -140 90 -135 Q60 -132 40 -160 Z" fill={C.vein} stroke={N} strokeWidth={5} />
			<path d="M10 -120 Q-10 -40 20 60 Q40 140 15 225" fill="none" stroke={C.artery} strokeWidth={9} strokeLinecap="round" />
			<path d="M10 -120 Q-10 -40 20 60 Q40 140 15 225" fill="none" stroke={N} strokeWidth={2.5} opacity={0.6} />
			<path d="M-120 -80 Q-150 20 -80 150" fill="none" stroke={C.artery} strokeWidth={7} strokeLinecap="round" />
			<path d="M30 -20 Q90 0 130 -40" fill="none" stroke={C.artery} strokeWidth={6} strokeLinecap="round" />
			<path d="M-40 -150 Q-60 -120 -50 -80" fill="none" stroke={C.fat} strokeWidth={14} strokeLinecap="round" opacity={0.9} />
			<ellipse cx={-60} cy={-20} rx={46} ry={60} fill="#FFFFFF" opacity={0.12} />
			<g opacity={nerves}>
				{[
					'M-60 -250 Q-70 -180 -40 -120 Q-10 -60 -30 20',
					'M80 -260 Q70 -180 90 -120 Q110 -40 80 40',
					'M-40 -120 Q-90 -60 -110 20',
				].map((d) => (
					<g key={d}>
						<path d={d} fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
						<path d={d} fill="none" stroke={C.nerve} strokeWidth={5} strokeLinecap="round" />
					</g>
				))}
			</g>
		</g>
	);
};

/** Paroi du cœur en coupe (rectangle x 60 → 640, y 690 → 1080) : péricarde, myocarde, endocarde, sang. */
const WallSection: React.FC<{f: number}> = ({f}) => (
	<g>
		<rect x={60} y={690} width={580} height={70} fill={C.fat} stroke={N} strokeWidth={4} />
		{Array.from({length: 9}).map((_, i) => (
			<path key={i} d={`M${70 + i * 64} ${705 + (i % 2) * 20} q20 -10 40 0 t40 0`} fill="none" stroke={alpha('#B89032', 0.7)} strokeWidth={3} />
		))}
		<rect x={60} y={760} width={580} height={230} fill="url(#ocsWall)" stroke={N} strokeWidth={4} />
		{Array.from({length: 7}).map((_, j) => (
			<g key={j}>
				<path d={`M60 ${785 + j * 30} H640`} stroke={alpha('#5E1820', 0.35)} strokeWidth={3} />
				{Array.from({length: 20}).map((_, i) => (
					<line key={i} x1={75 + i * 29 + (j % 2) * 14} y1={772 + j * 30} x2={75 + i * 29 + (j % 2) * 14} y2={796 + j * 30} stroke={alpha('#5E1820', 0.3)} strokeWidth={2.5} />
				))}
			</g>
		))}
		{[
			[150, 830],
			[380, 880],
			[520, 810],
			[260, 940],
		].map(([x, y], i) => (
			<ellipse key={i} cx={x} cy={y} rx={20} ry={10} fill={C.nucleus} stroke={N} strokeWidth={2.5} />
		))}
		<rect x={60} y={990} width={580} height={30} fill="#F6C9CF" stroke={N} strokeWidth={4} />
		{Array.from({length: 10}).map((_, i) => (
			<ellipse key={i} cx={90 + i * 58} cy={1005} rx={20} ry={6} fill={alpha(C.nucleus, 0.8)} />
		))}
		<rect x={60} y={1020} width={580} height={60} fill={C.blood} stroke={N} strokeWidth={4} />
		{Array.from({length: 8}).map((_, i) => {
			const x = 60 + ((i * 83 + f * 2.2) % 580);
			return <ellipse key={i} cx={x} cy={1040 + (i % 3) * 13} rx={18} ry={9} fill="#E0525E" stroke="#6E1018" strokeWidth={2} />;
		})}
	</g>
);

/** Silhouette de face (centre x 480) dessinée par l'astuce du contour : traits épais bleu nuit puis peau par-dessus. */
const LIMBS: [string, number][] = [
	['M372 292 Q330 420 318 560 Q312 610 306 650', 64],
	['M588 292 Q630 420 642 560 Q648 610 654 650', 64],
	['M432 640 Q420 820 418 1010', 96],
	['M528 640 Q540 820 542 1010', 96],
	['M480 200 L480 250', 70],
];
const TORSO = 'M372 262 Q480 238 588 262 Q622 274 616 330 L592 520 Q586 600 600 660 Q480 700 360 660 Q374 600 368 520 L344 330 Q338 274 372 262 Z';
const Body: React.FC<{children?: React.ReactNode; dim?: number}> = ({children, dim = 1}) => (
	<g>
		<g opacity={dim}>
			{LIMBS.map(([d, w], i) => (
				<path key={i} d={d} stroke={N} strokeWidth={w + 10} strokeLinecap="round" fill="none" />
			))}
			<path d={TORSO} fill={N} stroke={N} strokeWidth={10} strokeLinejoin="round" />
			<circle cx={480} cy={140} r={75} fill={N} />
			{LIMBS.map(([d, w], i) => (
				<path key={`s${i}`} d={d} stroke={C.skin} strokeWidth={w} strokeLinecap="round" fill="none" />
			))}
			<path d={TORSO} fill="url(#ocsSkin)" />
			<circle cx={480} cy={140} r={70} fill={C.skin} />
		</g>
		{children}
	</g>
);

/** Artères (rouge) et veines (bleu) dans la silhouette ; le sang circule (`f`). */
const ARTERIES = [
	'M492 360 Q470 300 466 250 L466 110',
	'M492 330 Q420 300 380 300 Q345 420 328 560 L318 640',
	'M500 330 Q560 300 586 300 Q620 420 632 560 L642 640',
	'M500 390 L496 600 Q470 640 436 660 Q426 820 424 1000',
	'M496 600 Q520 640 532 660 Q540 820 544 1000',
];
const VEINS = [
	'M454 110 L454 250 Q456 300 470 352',
	'M302 640 L312 560 Q330 420 364 312 Q420 318 470 352',
	'M658 640 L648 560 Q636 420 602 312 Q560 318 488 360',
	'M408 1000 Q410 820 420 670 Q450 640 470 610 L472 400',
	'M560 1000 Q556 820 548 670 Q500 640 484 610',
];
const Vessels: React.FC<{f: number; art?: number; vein?: number}> = ({f, art = 1, vein = 1}) => (
	<g>
		{VEINS.map((d, i) => (
			<g key={`v${i}`} opacity={vein}>
				<path d={d} stroke={C.vein} strokeWidth={10} strokeLinecap="round" fill="none" />
				<path d={d} stroke={LPI.paper} strokeWidth={3} strokeLinecap="round" fill="none" strokeDasharray="6 34" strokeDashoffset={-f * 2.5} />
			</g>
		))}
		{ARTERIES.map((d, i) => (
			<g key={`a${i}`} opacity={art}>
				<path d={d} stroke={C.artery} strokeWidth={12} strokeLinecap="round" fill="none" />
				<path d={d} stroke={LPI.paper} strokeWidth={3} strokeLinecap="round" fill="none" strokeDasharray="6 34" strokeDashoffset={f * 3} />
			</g>
		))}
	</g>
);

/** Organes dans la silhouette ; `o` = {cerveau, poumons, cœur, digestif, urinaire} 0 → 1. */
const Organs: React.FC<{f: number; o: number[]}> = ({f, o}) => {
	const br = 1 + 0.03 * Math.sin(f / 18);
	return (
		<g>
			<g opacity={o[0]}>
				<path d="M418 140 Q410 82 462 72 Q500 58 532 82 Q560 104 548 148 Q540 172 504 174 L458 174 Q424 170 418 140 Z" fill="#F2A7B5" stroke={N} strokeWidth={4} />
				<path d="M440 110 q14 -12 28 0 t28 0 t28 0 M436 140 q14 -10 28 0 t28 0 t28 0" fill="none" stroke="#C26A7C" strokeWidth={3} />
				<path d="M480 176 L480 640" stroke={N} strokeWidth={10} strokeLinecap="round" />
				<path d="M480 176 L480 640" stroke={C.nerve} strokeWidth={6} strokeLinecap="round" />
				<path d="M480 300 L372 330 L330 560 M480 300 L588 330 L630 560 M480 620 L436 680 L424 980 M480 620 L528 680 L540 980" fill="none" stroke={C.nerve} strokeWidth={3} opacity={0.9} />
			</g>
			<g opacity={o[1]} transform={`translate(480 370) scale(${br}) translate(-480 -370)`}>
				<path d="M478 250 L478 300" stroke={N} strokeWidth={16} strokeLinecap="round" />
				<path d="M478 250 L478 300" stroke="#F4C4C4" strokeWidth={9} strokeLinecap="round" />
				<path d="M466 300 C420 290 392 330 388 400 C386 450 400 470 440 462 Q466 456 466 420 Z" fill="#F4A3A3" stroke={N} strokeWidth={4} />
				<path d="M490 300 C540 290 570 330 574 400 C576 450 560 470 520 462 Q494 456 494 420 Z" fill="#F4A3A3" stroke={N} strokeWidth={4} />
			</g>
			<g opacity={o[2]} transform="translate(498 410) scale(0.16)">
				<HeartFront beat={beatOf(f)} />
			</g>
			<g opacity={o[3]}>
				<path d="M470 470 Q520 452 548 470 Q566 500 540 520 Q510 530 492 512 Q470 500 470 470 Z" fill="#F7B27A" stroke={N} strokeWidth={4} />
				<path d="M420 470 Q470 450 470 480 L462 515 Q430 520 418 500 Z" fill="#A65A44" stroke={N} strokeWidth={4} />
				<rect x={410} y={530} width={140} height={100} rx={40} fill="#F5C49B" stroke={N} strokeWidth={4} />
				<path d="M430 555 q20 -14 40 0 t40 0 t30 0 M430 585 q20 14 40 0 t40 0 t30 0 M430 610 q20 -10 40 0 t40 0 t30 0" fill="none" stroke="#C98450" strokeWidth={4} />
			</g>
			<g opacity={o[4]}>
				<path d="M400 600 Q440 630 466 650 M560 600 Q520 630 494 650" fill="none" stroke={C.nerve} strokeWidth={6} strokeLinecap="round" />
				<path d="M390 560 q-30 0 -30 30 q0 34 32 36 q14 0 14 -14 q-8 -10 0 -22 q8 -12 0 -22 q-4 -8 -16 -8 Z" fill="#B5545D" stroke={N} strokeWidth={4} />
				<path d="M570 560 q30 0 30 30 q0 34 -32 36 q-14 0 -14 -14 q8 -10 0 -22 q-8 -12 0 -22 q4 -8 16 -8 Z" fill="#B5545D" stroke={N} strokeWidth={4} />
				<ellipse cx={480} cy={655} rx={30} ry={22} fill="#F8D35A" stroke={N} strokeWidth={4} />
			</g>
		</g>
	);
};

/* ═══════════════════════════════ SCÈNES ═══════════════════════════════ */

/** Vignettes du schéma complet (accroche et fin). */
const Thumb: React.FC<{k: number; size?: number}> = ({k, size = 150}) => (
	<Live
		render={(f) => {
			const views = ['240 300 480 540', '30 580 440 500', '-260 -380 520 640', '250 40 460 1000', '250 40 460 1000'];
			return (
				<svg width={size} height={size} viewBox={views[k]} preserveAspectRatio="xMidYMid meet">
					<Defs />
					{k === 0 ? <CellArt f={f} /> : null}
					{k === 1 ? <TissuePanel k={2} f={f} show={1} /> : null}
					{k === 2 ? <HeartFront beat={beatOf(f)} nerves={1} /> : null}
					{k === 3 ? (
						<Body dim={0.7}>
							<Vessels f={f} />
							<g transform="translate(496 380) scale(0.16)">
								<HeartFront beat={beatOf(f)} />
							</g>
						</Body>
					) : null}
					{k === 4 ? (
						<Body>
							<Organs f={f} o={[1, 1, 1, 1, 1]} />
						</Body>
					) : null}
				</svg>
			);
		}}
	/>
);

const LEVELS = ['cellule', 'tissu', 'organe', 'appareil', 'organisme'];

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MIL = at('intro', 'milliards');
	const RANG = at('intro', 'rangées');
	const CINQ = at('intro', 'cinq');
	const SCHEMA = at('intro', 'schéma');
	const ENS = at('intro', 'ensemble ?');
	const count = Math.round(interpolate(frame, [0, MIL + 8], [0, 37000], clamp));
	return (
		<AbsoluteFill>
			<ShortBg />
			<SeriesPill cap={SERIES.cap} label={SERIES.label} />
			<Counter steps={[[0, 0]]} total={TOTAL} />
			<Camera punches={[MIL + 1, RANG + 1, CINQ + 1, SCHEMA + 1]} shakes={[MIL + 9]} strength={0.03}>
				<Big from={-2} text={"L'organisation\ndu *corps* *humain*"} size={88} y={300} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, color: N, opacity: interpolate(f, [CINQ - 8, CINQ], [1, 0], clamp)}}>
							<div style={{fontSize: 150, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{count.toLocaleString('fr-FR')}</div>
							<div style={{fontSize: 50, opacity: f >= MIL - 4 ? 1 : 0.15}}>milliards de cellules</div>
						</div>
					)}
				/>
				{LEVELS.map((l, i) => {
					const row = i < 3 ? 0 : 1;
					const col = i < 3 ? i : i - 3;
					const x = row === 0 ? 220 + col * 320 : 380 + col * 320;
					const y = row === 0 ? 720 : 1080;
					return (
						<Pop key={l} at={CINQ - 4 + i * 5} x={x} y={y}>
							<div style={{width: 280, height: 320, borderRadius: 36, background: '#FFFFFF', boxShadow: SHADOW, border: `5px solid ${N}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
								<Thumb k={i} size={220} />
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>
									<span style={{color: LPI.pink}}>{i + 1}</span> · {l}
								</div>
							</div>
						</Pop>
					);
				})}
				<Note at={SCHEMA - 6} y={1330} size={44}>
					le schéma à connaître
				</Note>
				<Note at={ENS - 6} y={1460} size={40} tone={LPI.pink}>
					on le lit ensemble ?
				</Note>
			</Camera>
			{LEVELS.map((l, i) => (
				<Sfx key={l} name="pop" at={CINQ - 4 + i * 5} volume={0.14} />
			))}
			<Sfx name="ding" at={ENS} volume={0.18} />
		</AbsoluteFill>
	);
};

export const Cellule: React.FC = () => {
	const UN = at('cellule', 'un');
	const anns: Ann[] = [
		{at: at('cellule', 'membrane'), text: 'membrane', sub: "l'enveloppe", ax: 264, ay: 470, tx: 225, ty: 330, end: true},
		{at: at('cellule', 'cytoplasme'), text: 'cytoplasme', sub: "le « liquide » de la cellule", ax: 340, ay: 720, tx: 60, ty: 940},
		{at: at('cellule', 'mitochondries,'), text: 'mitochondrie', sub: "fait l'énergie", ax: 585, ay: 420, tx: 560, ty: 180},
		{at: at('cellule', 'noyau'), text: 'noyau', sub: 'le centre', ax: 540, ay: 600, tx: 720, ty: 650, size: 34},
		{at: at('cellule', "l'adn."), text: 'ADN', sub: 'le programme', ax: 470, ay: 610, tx: 560, ty: 960},
	];
	return (
		<LevelScene
			series={S}
			n={1}
			numAt={UN}
			title={'1 · La *cellule*'}
			cardAt={at('cellule', 'petite') - 6}
			caption="LA CELLULE · PLUS PETITE UNITÉ VIVANTE"
			draw={(f) => (
				<>
					<Defs />
					<CellArt f={f} />
				</>
			)}
			anns={anns}
		/>
	);
};

export const Tissu: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('tissu', 'deux');
	const ts = [at('tissu', "l'épithélial,"), at('tissu', 'conjonctif,'), at('tissu', 'musculaire,'), at('tissu', 'nerveux,')];
	const vs = [at('tissu', 'recouvre,'), at('tissu', 'soutient,'), at('tissu', 'contracte,'), at('tissu', 'transmet.')];
	const names = ['épithélial', 'conjonctif', 'musculaire', 'nerveux'];
	const subs = ['il recouvre', 'il soutient', 'il se contracte', 'il transmet'];
	const details: [string, number, number][] = [
		['cellules serrées', 130, 230],
		['fibres', 330, 300],
		['fibres striées', 200, 170],
		['un neurone', 120, 255],
	];
	const anns: Ann[] = names.map((_, k) => {
		const [x, y] = TISSUE_POS[k];
		const [d, ax, ay] = details[k];
		return {at: vs[k], text: d, sub: subs[k], ax: x + ax, ay: y + ay, tx: x + 40, ty: y + 440, size: 32};
	});
	return (
		<LevelScene
			series={S}
			n={2}
			numAt={DEUX}
			title={'2 · Le *tissu*'}
			pink
			cardAt={at('tissu', 'semblables.') - 6}
			caption=""
			draw={(f) => (
				<>
					<Defs />
					{[0, 1, 2, 3].map((k) => (
						<TissuePanel key={k} k={k} f={f} name={names[k]} show={interpolate(frame, [ts[k] - 8, ts[k] + 4], [0, 1], clamp)} />
					))}
				</>
			)}
			anns={anns}
		/>
	);
};

export const Organe: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('organe', 'trois');
	const PERI = at('organe', 'péricarde');
	const MYO = at('organe', 'myocarde');
	const ENDO = at('organe', "l'endocarde");
	const NERFS = at('organe', 'nerfs');
	const anns: Ann[] = [
		{at: PERI, text: 'péricarde', sub: 'tissu conjonctif', ax: 600, ay: 725, tx: 670, ty: 735},
		{at: MYO, text: 'myocarde', sub: 'tissu musculaire', ax: 600, ay: 870, tx: 670, ty: 880},
		{at: ENDO, text: 'endocarde', sub: 'tissu épithélial', ax: 600, ay: 1005, tx: 670, ty: 1010},
		{at: NERFS, text: 'nerfs', sub: 'tissu nerveux', ax: 395, ay: 345, tx: 650, ty: 260},
	];
	return (
		<LevelScene
			series={S}
			n={3}
			numAt={TROIS}
			title={"3 · *L'organe*"}
			cardAt={at('organe', 'plusieurs') - 6}
			caption="LE CŒUR · SA PAROI EN COUPE"
			draw={(f) => (
				<>
					<Defs />
					<g transform="translate(330 400) scale(0.82)">
						<HeartFront beat={beatOf(f)} nerves={interpolate(frame, [NERFS - 6, NERFS + 4], [0, 1], clamp)} />
					</g>
					<g opacity={interpolate(f, [PERI - 14, PERI - 4], [0, 1], clamp)}>
						<circle cx={430} cy={470} r={42} fill="none" stroke={N} strokeWidth={5} />
						<path d="M400 500 L60 690 M460 500 L640 690" stroke={N} strokeWidth={3} strokeDasharray="10 8" />
						<WallSection f={f} />
					</g>
				</>
			)}
			anns={anns}
			sfx={[{name: 'heartbeat', at: at('organe', 'cœur,'), volume: 0.22}]}
		/>
	);
};

export const Appareil: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('appareil', 'quatre');
	const COEUR = at('appareil', 'cœur,');
	const ART = at('appareil', 'artères');
	const VEI = at('appareil', 'veines');
	const CARDIO = at('appareil', 'cardiovasculaire.');
	const anns: Ann[] = [
		{at: COEUR, text: 'cœur', sub: 'la pompe', ax: 500, ay: 385, tx: 690, ty: 250},
		{at: ART, text: 'artères', sub: 'le sang part', ax: 636, ay: 520, tx: 700, ty: 560},
		{at: VEI, text: 'veines', sub: 'le sang revient', ax: 410, ay: 880, tx: 250, ty: 820, end: true},
	];
	return (
		<LevelScene
			series={S}
			n={4}
			numAt={QUATRE}
			title={"4 · *L'appareil*"}
			pink
			cardAt={at('appareil', 'système.') - 10}
			caption="L'APPAREIL (OU SYSTÈME) CARDIOVASCULAIRE"
			draw={(f) => (
				<>
					<Defs />
					<g transform="translate(0 50)">
						<Body dim={0.75}>
							<Vessels f={f} art={interpolate(frame, [ART - 8, ART + 4], [0.15, 1], clamp)} vein={interpolate(frame, [VEI - 8, VEI + 4], [0.15, 1], clamp)} />
							<g transform="translate(496 380) scale(0.17)">
								<HeartFront beat={beatOf(f)} />
							</g>
						</Body>
					</g>
				</>
			)}
			anns={anns.map((a) => ({...a, ay: a.ay + 50}))}
			extra={
				<Pop at={CARDIO - 6} x={540} y={1470}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: LPI.paper, background: N, borderRadius: 999, padding: '14px 34px', whiteSpace: 'nowrap'}}>
						cœur + vaisseaux = <span style={{color: LPI.pink}}>cardiovasculaire</span>
					</div>
				</Pop>
			}
			sfx={[{name: 'heartbeat', at: COEUR, volume: 0.22}]}
		/>
	);
};

export const Organisme: React.FC = () => {
	const frame = useCurrentFrame();
	const CINQ = at('organisme', 'cinq');
	const TOUS = at('organisme', 'tous');
	const NERV = at('organisme', 'nerveux,');
	const RESP = at('organisme', 'respiratoire,');
	const DIG = at('organisme', 'digestif,');
	const URI = at('organisme', 'urinaire…');
	const TOI = at('organisme', 'toi !');
	const o = [NERV, RESP, TOUS, DIG, URI].map((t) => interpolate(frame, [t - 8, t + 4], [0.12, 1], clamp));
	const Y = 40;
	const anns: Ann[] = [
		{at: TOUS + 4, text: 'cardiovasculaire', sub: 'cœur, vaisseaux', ax: 505, ay: 410 + Y, tx: 600, ty: 1010, size: 32},
		{at: NERV, text: 'nerveux', sub: 'cerveau, nerfs', ax: 430, ay: 115 + Y, tx: 300, ty: 140, end: true, size: 32},
		{at: RESP, text: 'respiratoire', sub: 'poumons', ax: 560, ay: 380 + Y, tx: 690, ty: 300, size: 32},
		{at: DIG, text: 'digestif', sub: 'estomac, intestins', ax: 420, ay: 580 + Y, tx: 290, ty: 560, end: true, size: 32},
		{at: URI, text: 'urinaire', sub: 'reins, vessie', ax: 585, ay: 592 + Y, tx: 690, ty: 640, size: 32},
	];
	return (
		<LevelScene
			series={S}
			n={5}
			numAt={CINQ}
			title={"5 · *L'organisme*"}
			cardAt={TOUS - 8}
			caption="L'ORGANISME · TOUS LES APPAREILS"
			draw={(f) => (
				<>
					<Defs />
					<g transform={`translate(0 ${Y})`}>
						<Body>
							<Organs f={f} o={o} />
						</Body>
					</g>
				</>
			)}
			anns={anns}
			extra={
				<Pop at={TOI - 4} x={300} y={1420}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, background: LPI.pink, border: `6px solid ${N}`, borderRadius: 999, padding: '14px 36px', transform: 'rotate(-6deg)', whiteSpace: 'nowrap'}}>c'est toi !</div>
				</Pop>
			}
			sfx={[{name: 'ding', at: TOI, volume: 0.2}]}
		/>
	);
};

export const Fin: React.FC = () => {
	const ts = [at('fin', 'cellule,'), at('fin', 'tissu,'), at('fin', 'organe,'), at('fin', 'appareil,'), at('fin', 'organisme :')];
	const COMPLET = at('fin', 'complet !');
	const PROCH = at('fin', 'prochaine');
	const subs = ['membrane · cytoplasme · noyau', '4 tissus', 'plusieurs tissus : le cœur', 'des organes : cardiovasculaire', 'tous les appareils : toi'];
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<SeriesPill cap={SERIES.cap} label={SERIES.label} />
			<Counter steps={[[0, TOTAL]]} total={TOTAL} done />
			<Camera punches={[...ts.map((t) => t + 1), COMPLET + 1]} strength={0.02}>
				<Big from={-2} text={'Le *schéma* complet'} size={84} y={310} />
				{LEVELS.map((l, i) => (
					<Pop key={l} at={ts[i] - 4} x={540} y={520 + i * 195}>
						<div style={{width: 940, height: 180, borderRadius: 34, background: '#FFFFFF', boxShadow: SHADOW, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', boxSizing: 'border-box', position: 'relative'}}>
							<div style={{width: 56, height: 56, borderRadius: 28, background: i % 2 ? LPI.pink : LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{i + 1}</div>
							<Thumb k={i} size={150} />
							<div style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0}}>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>{l}</div>
								<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: LPI.blue}}>{subs[i]}</div>
							</div>
							<Live
								render={(f) => (
									<div style={{position: 'absolute', right: 26, width: 64, height: 64, borderRadius: 32, background: LPI.blue, color: LPI.paper, fontSize: 40, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${interpolate(f, [COMPLET - 4 + i * 2, COMPLET + 4 + i * 2], [0, 1], clamp)})`}}>✓</div>
								)}
							/>
						</div>
					</Pop>
				))}
				<Confetti at={COMPLET} />
				<Pop at={PROCH - 2} x={540} y={1500}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, background: N, borderRadius: 40, padding: '22px 40px', whiteSpace: 'nowrap'}}>
						prochaine vidéo : <span style={{color: LPI.pink}}>la cellule</span>
					</div>
				</Pop>
			</Camera>
			{ts.map((t, i) => (
				<Sfx key={i} name="pop" at={t} volume={0.18} />
			))}
			<Sfx name="ding" at={COMPLET} volume={0.22} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
