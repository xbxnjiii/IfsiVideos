// « Saignement de nez » : tête de profil (tournée vers la droite) en rendu soigné (peau opaque en dégradé, ombres douces,
// contours fins), qui se penche en arrière ou en avant ; vue en coupe (fosse nasale → arrière-gorge → œsophage) avec le
// sang qui file dans la gorge ; filet de sang au bord de la narine ; os du nez / partie molle ; main qui pince le bas du
// nez ; mouchoir ; bouche ouverte qui respire (petits souffles). Livre ouvert tenu à deux mains. Couleurs de la marque.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Mélange opaque de deux couleurs de la marque. */
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const LINE = {stroke: alpha(N, 0.72), strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const SKIN_HI = LPI.paper;
const SKIN_MID = mix(LPI.paper, LPI.pink, 0.3);
const SKIN_LO = mix(LPI.paper, LPI.pink, 0.55);
const HAIR = mix(N, LPI.blue, 0.25);
const BLOOD = mix(LPI.pink, N, 0.18);

/** Repère 1000 × 1000 de la tête : pivot de la tête (le cou), bout de la narine (d'où coule le sang), bouche. */
export const HEAD = {pivot: {x: 470, y: 800}, nostril: {x: 728, y: 552}, mouth: {x: 712, y: 618}, soft: {x: 740, y: 522}, bone: {x: 712, y: 462}};

/** Point du repère de la tête (avant inclinaison) → repère 1000 × 1000 une fois la tête penchée de `tilt` degrés. */
export const headPt = (p: {x: number; y: number}, tilt: number) => {
	const a = (tilt * Math.PI) / 180;
	const dx = p.x - HEAD.pivot.x;
	const dy = p.y - HEAD.pivot.y;
	return {x: HEAD.pivot.x + dx * Math.cos(a) - dy * Math.sin(a), y: HEAD.pivot.y + dx * Math.sin(a) + dy * Math.cos(a)};
};

const FACE =
	'M300 330 C300 200 420 168 520 182 C622 196 672 268 668 350 C667 386 676 408 692 428 L768 516 C780 530 772 550 748 550 ' +
	'C734 550 722 546 712 553 C704 559 700 567 704 579 C712 589 714 599 704 607 C698 611 698 617 704 621 C714 629 712 643 700 651 ' +
	'C692 657 688 665 692 681 C698 713 680 741 640 745 C600 749 575 747 560 762 L556 840 L396 840 C394 770 384 712 356 664 C306 590 290 460 300 330 Z';

/** Cavité vue en coupe : fosse nasale (de la narine vers l'arrière), arrière-gorge, œsophage (repère de la tête). */
const CAVITY = 'M732 546 C700 520 640 500 560 500 C520 500 500 530 500 580 C500 660 500 740 490 840';

/**
 * Tête de profil tournée vers la droite (repère 1000 × 1000, épaules en bas). `tilt` en degrés : négatif = la tête bascule
 * en arrière, positif = penchée en avant. `bleed` 0 → 1 filet de sang de la narine ; `cut` 0 → 1 vue en coupe ;
 * `throat` 0 → 1 le sang qui file dans la gorge (avec `cut`) ; `bone` 0 → 1 repères os du nez / partie molle ;
 * `pinch` 0 → 1 la main qui pince le bas du nez ; `tissue` 0 → 1 le mouchoir sous le nez ; `breathe` 0 → 1 bouche
 * ouverte qui respire ; `mood` ; `eyes` « up » quand il regarde le plafond.
 */
export const HeadSide: React.FC<{
	width?: number;
	tilt?: number;
	bleed?: number;
	cut?: number;
	throat?: number;
	bone?: number;
	pinch?: number;
	pad?: boolean;
	wick?: number;
	tissue?: number;
	breathe?: number;
	mood?: 'calm' | 'worried' | 'sick' | 'happy';
	eyes?: 'open' | 'up' | 'down';
	shirt?: string;
	children?: React.ReactNode;
}> = ({width = 1000, tilt = 0, bleed = 0, cut = 0, throat = 0, bone = 0, pinch = 0, pad = false, wick = 0, tissue = 0, breathe = 0, mood = 'calm', eyes = 'open', shirt = LPI.blue, children}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const P = HEAD.pivot;
	const blink = frame % 96 < 4;
	const b = cl(bleed);
	const c = cl(cut);
	const pz = cl(pinch);
	const browY = mood === 'worried' || mood === 'sick' ? -6 : 0;
	const irisDy = eyes === 'up' ? -9 : eyes === 'down' ? 8 : 0;
	return (
		<svg width={width} height={width} viewBox="0 0 1000 1000" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<filter id={`hs${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
				<linearGradient id={`hk${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
					<stop offset="0" stopColor={SKIN_HI} />
					<stop offset="0.55" stopColor={SKIN_MID} />
					<stop offset="1" stopColor={SKIN_LO} />
				</linearGradient>
				<linearGradient id={`hn${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={SKIN_LO} />
					<stop offset="1" stopColor={SKIN_MID} />
				</linearGradient>
				<linearGradient id={`ht${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={mix(shirt, LPI.paper, 0.18)} />
					<stop offset="1" stopColor={mix(shirt, N, 0.2)} />
				</linearGradient>
				<clipPath id={`hc${id}`}>
					<path d={FACE} />
				</clipPath>
			</defs>
			{/* épaules + cou (fixes) */}
			<path d="M170 1010 C180 900 290 850 400 846 L560 846 C680 850 780 900 800 1010 Z" fill={alpha(N, 0.18)} filter={`url(#hs${id})`} transform="translate(14 18)" />
			<path d="M392 700 L556 700 L560 870 L388 870 Z" fill={`url(#hn${id})`} {...LINE} />
			<path d="M170 1010 C180 900 290 850 400 846 C430 880 520 880 560 846 C680 850 780 900 800 1010 Z" fill={`url(#ht${id})`} {...LINE} />
			<path d="M400 846 C430 880 520 880 560 846" fill="none" stroke={alpha(N, 0.5)} strokeWidth={5} />
			<g transform={`rotate(${tilt} ${P.x} ${P.y})`}>
				{/* ombre douce de la tête */}
				<path d={FACE} fill={alpha(N, 0.16)} filter={`url(#hs${id})`} transform="translate(16 14)" />
				<path d={FACE} fill={`url(#hk${id})`} {...LINE} />
				{/* reflets */}
				<path d="M560 214 C620 236 650 280 652 330" fill="none" stroke={alpha(LPI.paper, 0.9)} strokeWidth={14} strokeLinecap="round" />
				<ellipse cx={640} cy={520} rx={34} ry={20} fill={alpha(LPI.pink, 0.35)} />
				{/* vue en coupe : la peau devient transparente, on voit la fosse nasale et la gorge */}
				{c > 0 ? (
					<g clipPath={`url(#hc${id})`} opacity={c}>
						<path d={FACE} fill={alpha(LPI.sky, 0.55)} />
						<path d={CAVITY} fill="none" stroke={alpha(N, 0.6)} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
						<path d={CAVITY} fill="none" stroke={mix(LPI.paper, LPI.sky, 0.4)} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
						{/* langue + palais pour situer la bouche */}
						<path d="M560 600 C600 580 660 590 690 612 C660 640 600 650 560 640 Z" fill={alpha(LPI.pink, 0.55)} stroke={alpha(N, 0.4)} strokeWidth={3} />
						{throat > 0 ? (
							<path d={CAVITY} fill="none" stroke={BLOOD} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${cl(throat)} 1`} />
						) : null}
						{throat > 0.15
							? [0, 1, 2].map((i) => {
									const t = ((frame / 20 + i / 3) % 1) * cl(throat);
									const y = 620 + t * 220;
									return <circle key={i} cx={500 - t * 8} cy={y} r={9} fill={alpha(LPI.paper, 0.8)} />;
								})
							: null}
					</g>
				) : null}
				{/* oreille */}
				<path d="M420 430 C450 410 478 440 474 480 C470 520 450 536 428 530 C414 524 418 500 412 480 C406 460 406 440 420 430 Z" fill={SKIN_MID} {...LINE} />
				<path d="M432 456 C450 450 458 474 448 498" fill="none" stroke={alpha(N, 0.4)} strokeWidth={4} strokeLinecap="round" />
				{/* cheveux */}
				<path d="M296 344 C286 214 410 156 522 170 C616 182 666 236 670 306 C630 262 560 250 512 274 C462 300 428 336 412 410 C398 440 372 470 340 540 C304 480 294 410 296 344 Z" fill={HAIR} {...LINE} />
				<path d="M360 250 C420 210 500 196 570 210" fill="none" stroke={alpha(LPI.paper, 0.25)} strokeWidth={10} strokeLinecap="round" />
				{/* sourcil + œil */}
				<path d={`M600 ${398 + browY} Q630 ${388 + browY * 1.5} 660 ${396 - browY}`} fill="none" stroke={HAIR} strokeWidth={10} strokeLinecap="round" />
				{blink ? (
					<path d="M612 432 Q636 440 656 430" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				) : (
					<g>
						<path d="M608 432 Q634 412 660 430 Q636 448 608 432 Z" fill={LPI.paper} stroke={N} strokeWidth={4} />
						<circle cx={646} cy={431 + irisDy * 0.6} r={9} fill={N} />
						<circle cx={649} cy={428 + irisDy * 0.6} r={3} fill={LPI.paper} />
					</g>
				)}
				{/* narine (aile du nez) */}
				<path d="M712 530 C722 514 748 514 756 532" fill="none" stroke={alpha(N, 0.55)} strokeWidth={4} strokeLinecap="round" />
				<ellipse cx={728} cy={545} rx={12} ry={5} fill={alpha(N, 0.55)} />
				{/* bouche */}
				{breathe > 0.05 ? (
					<ellipse cx={704} cy={619} rx={8 + 6 * breathe} ry={4 + 10 * breathe} fill={mix(N, LPI.pink, 0.3)} stroke={N} strokeWidth={3} />
				) : mood === 'happy' ? (
					<path d="M690 612 Q700 628 712 616" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				) : mood === 'sick' ? (
					<path d="M686 620 q6 -6 10 0 q6 6 12 0" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				) : (
					<path d="M690 619 L708 619" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				)}
				{mood === 'sick' ? <ellipse cx={622} cy={540} rx={44} ry={26} fill={alpha(LPI.sky, 0.7)} /> : null}
				{/* filet de sang : de la narine, sur la lèvre */}
				{b > 0 ? (
					<g>
						<path d={`M722 548 C730 ${558 + 14 * b} 724 ${570 + 26 * b} 716 ${562 + 46 * b}`} fill="none" stroke={BLOOD} strokeWidth={9 + 5 * b} strokeLinecap="round" />
						<circle cx={718} cy={560 + 50 * b} r={8} fill={BLOOD} />
					</g>
				) : null}
				{/* os du nez / partie molle */}
				{bone > 0 ? (
					<g opacity={cl(bone)}>
						<path d="M688 424 L736 488" stroke={N} strokeWidth={8} strokeDasharray="12 10" strokeLinecap="round" />
						<ellipse cx={HEAD.soft.x} cy={HEAD.soft.y} rx={44} ry={30} fill={alpha(LPI.pink, 0.35)} stroke={LPI.pink} strokeWidth={6} strokeDasharray="14 9" />
					</g>
				) : null}
				{/* mouchoir tenu sous le nez */}
				{tissue > 0 ? (
					<g opacity={cl(tissue * 3)} transform={`translate(${(1 - cl(tissue)) * 120} ${(1 - cl(tissue)) * 80})`}>
						<path d="M700 520 C730 500 790 506 820 530 C840 560 830 610 800 630 C770 646 720 640 704 612 C694 584 690 548 700 520 Z" fill={LPI.paper} {...LINE} />
						<path d="M730 540 C760 560 780 590 790 620" fill="none" stroke={alpha(N, 0.25)} strokeWidth={4} />
						<path d="M790 610 C820 630 850 680 860 740 L940 740 C930 660 880 600 830 590 Z" fill={`url(#hk${id})`} {...LINE} />
					</g>
				) : null}
				{/* la main qui pince le bas du nez : index posé en travers de la partie molle, la main sous le menton */}
				{/* mèche : petit tampon de coton enfoncé dans la narine (le bout dépasse) */}
				{wick > 0 ? (
					<g opacity={Math.min(1, wick * 3)} transform={`translate(${(1 - Math.min(1, wick)) * 30} ${(1 - Math.min(1, wick)) * 40})`}>
						<rect x={716} y={524} width={22} height={44} rx={10} fill={LPI.paper} stroke={alpha(N, 0.55)} strokeWidth={3} transform="rotate(-30 727 546)" />
						<path d="M720 556 l6 -18 M728 560 l6 -18" stroke={alpha(N, 0.2)} strokeWidth={2} transform="rotate(-30 727 546)" />
					</g>
				) : null}
				{pz > 0 ? (
					<g transform={`translate(${(1 - pz) * 160} ${(1 - pz) * 220})`} opacity={cl(pz * 2)}>
						{/* avant-bras, poing fermé, index replié sur l'aile du nez (le pouce est de l'autre côté) */}
						<line x1={866} y1={700} x2={912} y2={1040} stroke={alpha(N, 0.72)} strokeWidth={122} strokeLinecap="round" />
						<line x1={866} y1={700} x2={912} y2={1040} stroke={SKIN_MID} strokeWidth={114} strokeLinecap="round" />
						<ellipse cx={852} cy={652} rx={70} ry={76} fill={alpha(N, 0.15)} filter={`url(#hs${id})`} transform="translate(8 10)" />
						<ellipse cx={852} cy={652} rx={70} ry={76} fill={`url(#hk${id})`} {...LINE} />
						{[0, 1, 2].map((i) => (
							<path key={i} d={`M${790 + i * 4} ${650 + i * 26} q30 ${-10} 52 6`} fill="none" stroke={alpha(N, 0.45)} strokeWidth={4} strokeLinecap="round" />
						))}
						{pad ? (
							<g>
								{/* compresse (ou mouchoir) entre les doigts et le nez : on comprime à travers elle */}
								<path d="M700 488 C730 470 780 474 800 500 C812 530 806 580 780 600 C750 616 712 606 700 584 C688 556 688 510 700 488 Z" fill={LPI.paper} stroke={alpha(N, 0.6)} strokeWidth={3.5} />
								<path d="M712 510 L792 520 M708 540 L798 552 M712 570 L790 580" stroke={alpha(LPI.sky, 0.9)} strokeWidth={3} />
							</g>
						) : null}
						<line x1={746} y1={530} x2={826} y2={612} stroke={alpha(N, 0.72)} strokeWidth={46} strokeLinecap="round" />
						<line x1={746} y1={530} x2={826} y2={612} stroke={SKIN_MID} strokeWidth={39} strokeLinecap="round" />
						<line x1={752} y1={528} x2={816} y2={594} stroke={alpha(LPI.paper, 0.7)} strokeWidth={8} strokeLinecap="round" />
						<ellipse cx={744} cy={538} rx={11} ry={8} transform="rotate(45 744 538)" fill={mix(LPI.paper, LPI.pink, 0.15)} stroke={alpha(N, 0.5)} strokeWidth={2.5} />
						<path d="M784 560 l14 -10 M798 576 l14 -10" stroke={alpha(N, 0.35)} strokeWidth={4} strokeLinecap="round" />
					</g>
				) : null}
				{children}
			</g>
		</svg>
	);
};

/** Petits souffles qui sortent de la bouche (respirer par la bouche), dans le repère de la tête une fois penchée. */
export const BreathPuffs: React.FC<{tilt: number; on: number}> = ({tilt, on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	const m = headPt(HEAD.mouth, tilt);
	return (
		<g opacity={cl(on)}>
			{[0, 1, 2].map((i) => {
				const t = ((frame / 30 + i / 3) % 1);
				return <path key={i} d={`M${m.x + 30 + t * 90} ${m.y - 10 + t * 10} q14 -10 28 0 q-14 10 -28 0`} fill="none" stroke={alpha(LPI.blue, 0.8 * (1 - t))} strokeWidth={6} strokeLinecap="round" />;
			})}
		</g>
	);
};

/** Livre ouvert vu de côté-dessus (repère 600 × 300), tenu à deux mains ; `spots` taches de sang sur la page de droite. */
export const OpenBook: React.FC<{width?: number; spots?: {x: number; y: number; r: number}[]}> = ({width = 600, spots = []}) => {
	const id = React.useId().replace(/:/g, '');
	return (
		<svg width={width} height={width / 2} viewBox="0 0 600 300" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<filter id={`bs${id}`} x="-20%" y="-40%" width="140%" height="180%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<path d="M20 110 L300 150 L580 110 L560 250 L300 290 L40 250 Z" fill={alpha(N, 0.22)} filter={`url(#bs${id})`} transform="translate(8 14)" />
			<path d="M24 104 L300 144 L576 104 L566 240 L300 282 L34 240 Z" fill={LPI.blue} {...LINE} />
			<path d="M40 80 C130 60 230 80 300 130 L300 266 C230 220 130 210 48 222 Z" fill={LPI.paper} {...LINE} />
			<path d="M560 80 C470 60 370 80 300 130 L300 266 C370 220 470 210 552 222 Z" fill={mix(LPI.paper, LPI.sky, 0.25)} {...LINE} />
			{[0, 1, 2, 3, 4].map((i) => (
				<React.Fragment key={i}>
					<path d={`M70 ${110 + i * 22} C140 ${98 + i * 22} 220 ${110 + i * 22} 280 ${150 + i * 22}`} fill="none" stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" />
					<path d={`M530 ${110 + i * 22} C460 ${98 + i * 22} 380 ${110 + i * 22} 320 ${150 + i * 22}`} fill="none" stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" />
				</React.Fragment>
			))}
			{spots.map((s, i) => (
				<g key={i}>
					<circle cx={s.x} cy={s.y} r={s.r} fill={BLOOD} />
					<circle cx={s.x + s.r * 0.9} cy={s.y - s.r * 0.5} r={s.r * 0.25} fill={BLOOD} />
					<circle cx={s.x - s.r * 0.8} cy={s.y + s.r * 0.6} r={s.r * 0.2} fill={BLOOD} />
				</g>
			))}
			{/* les pouces qui tiennent le livre */}
			<path d="M20 170 C10 140 40 120 70 140 L90 190 C70 210 30 200 20 170 Z" fill={SKIN_MID} {...LINE} />
			<path d="M580 170 C590 140 560 120 530 140 L510 190 C530 210 570 200 580 170 Z" fill={SKIN_MID} {...LINE} />
		</svg>
	);
};

/** Goutte de sang (repère centré, hauteur ≈ 2,4 r). */
export const BloodDrop: React.FC<{r?: number}> = ({r = 14}) => (
	<path d={`M0 ${-r * 1.4} C${r * 0.5} ${-r * 0.6} ${r} ${-r * 0.1} ${r} ${r * 0.35} C${r} ${r * 0.95} ${r * 0.5} ${r} 0 ${r} C${-r * 0.5} ${r} ${-r} ${r * 0.95} ${-r} ${r * 0.35} C${-r} ${-r * 0.1} ${-r * 0.5} ${-r * 0.6} 0 ${-r * 1.4} Z`} fill={BLOOD} stroke={alpha(N, 0.5)} strokeWidth={2} />
);

/** Pictogramme « se moucher » : mouchoir + petit souffle. */
export const BlowIcon: React.FC<{size?: number}> = ({size = 150}) => (
	<svg width={size} height={size} viewBox="0 0 150 150" style={{overflow: 'visible'}}>
		<path d="M30 50 C60 30 110 34 128 60 C140 90 128 124 96 132 C64 138 34 126 26 100 C20 80 22 62 30 50 Z" fill={LPI.paper} {...LINE} />
		<path d="M50 70 C70 86 90 100 104 124" fill="none" stroke={alpha(N, 0.3)} strokeWidth={5} />
		<path d="M14 40 l-10 -12 M30 26 l-4 -16 M50 22 l4 -16" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" />
	</svg>
);
