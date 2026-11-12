// « Entorse de la cheville » : bas de jambe + pied de profil (côté extérieur, orteils vers la droite), en vraies couleurs
// (mise en situation réaliste, demandé) : peau couleur chair, malléole, chaussette, basket blanche ; le pied se tord
// (`roll`), bouge (`flex`), la cheville gonfle (`swell`) et bleuit (`bruise`) ; vue radio (`xray`) avec l'os fêlé
// (`crack`) ; poche de glace dans un linge (`ice`), bande de contention en huit (`wrap`), doigt qui appuie sur l'os
// (`press`), sol de terre + racine (`ground`). Jambe surélevée sur des coussins (`LegRest`), pictos 4 pas et radio.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Vraies couleurs de la mise en situation (exceptions à la palette, demandées). */
const R = {
	skinHi: '#FBE0CB',
	skin: '#F0C2A0',
	skinLo: '#DCA27C',
	line: 'rgba(110,60,35,0.75)',
	nail: '#F6D6C8',
	sock: '#F7F7F5',
	shoe: '#F5F5F2',
	shoeLine: '#7A7A78',
	sole: '#D2D2CE',
	accent: '#2F6FD6',
	swell: '#E3786E',
	bruise: '#7A5C9A',
	dirt: '#C9A47A',
	dirtDk: '#A9845A',
	root: '#6B4524',
	rootHi: '#8C5E34',
	band: '#E9DCC0',
	bandDk: '#C8B48E',
	bone: '#EEF3FA',
};
const LINE = {stroke: R.line, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Repère 1000 × 1000 : pivot de la cheville, malléole externe (l'os qu'on palpe), sol. */
export const ANKLE = {pivot: {x: 470, y: 630}, malleolus: {x: 512, y: 598}, ground: 786, toes: {x: 900, y: 740}};

const LEG = 'M300 -80 C292 120 342 330 392 530 C398 600 424 652 472 656 C522 656 556 624 562 560 C552 400 552 200 568 -80 Z';
const FOOT = 'M404 596 C372 628 352 668 356 708 C360 748 392 766 440 768 L862 772 C904 772 920 744 904 716 C884 690 820 680 760 664 C690 645 612 612 560 574 Z';

/**
 * Bas de jambe + pied de profil (repère 1000 × 1000, le pied pose sur `ANKLE.ground`). `roll` 0 → 1 : le pied se tord
 * (entorse) ; `flex` degrés : le pied bouge (monte / descend) ; `shoe` basket + chaussette ; `swell`, `bruise` ; `xray`
 * 0 → 1 : vue radio (les os) ; `crack` 0 → 1 : fêlure du péroné ; `ice` : poche de glace dans un linge ; `wrap` 0 → 1 :
 * bande de contention ; `press` : un doigt appuie sur la malléole ; `ground` : sol de terre avec une racine.
 */
export const AnkleSide: React.FC<{
	roll?: number;
	flex?: number;
	shoe?: boolean;
	swell?: number;
	bruise?: number;
	xray?: number;
	crack?: number;
	ice?: number;
	wrap?: number;
	press?: number;
	ground?: boolean;
	children?: React.ReactNode;
}> = ({roll = 0, flex = 0, shoe = false, swell = 0, bruise = 0, xray = 0, crack = 0, ice = 0, wrap = 0, press = 0, ground = false, children}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const P = ANKLE.pivot;
	const M = ANKLE.malleolus;
	const footT = `rotate(${flex + roll * 22} ${P.x} ${P.y}) translate(${P.x} ${P.y}) scale(${1 - 0.22 * roll} 1) translate(${-P.x} ${-P.y})`;
	const x = cl(xray);
	const sw = cl(swell);
	// bande de contention : bandes successives (pied, puis huit autour de la cheville, puis jambe)
	const bands: {d: string; foot?: boolean}[] = [
		{d: 'M640 640 L660 790', foot: true},
		{d: 'M700 660 L720 790', foot: true},
		{d: 'M660 650 L450 560'},
		{d: 'M370 610 L575 610'},
		{d: 'M450 700 L600 560'},
		{d: 'M380 540 L568 540'},
		{d: 'M370 480 L566 480'},
	];
	const nb = wrap * bands.length;
	return (
		<g>
			<defs>
				<linearGradient id={`ak${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={R.skinLo} />
					<stop offset="0.45" stopColor={R.skin} />
					<stop offset="0.8" stopColor={R.skinHi} />
					<stop offset="1" stopColor={R.skin} />
				</linearGradient>
				<linearGradient id={`af${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={R.skinHi} />
					<stop offset="1" stopColor={R.skinLo} />
				</linearGradient>
				<radialGradient id={`as${id}`}>
					<stop offset="0" stopColor={R.swell} stopOpacity={0.7} />
					<stop offset="0.6" stopColor={R.swell} stopOpacity={0.35} />
					<stop offset="1" stopColor={R.swell} stopOpacity={0} />
				</radialGradient>
				<filter id={`ab${id}`} x="-40%" y="-40%" width="180%" height="180%">
					<feGaussianBlur stdDeviation="12" />
				</filter>
				<clipPath id={`ac${id}`}>
					<path d={LEG} />
					<path d={FOOT} transform={footT} />
				</clipPath>
			</defs>
			{ground ? (
				<g>
					<rect x={-600} y={ANKLE.ground} width={2200} height={500} fill={R.dirt} />
					{Array.from({length: 30}, (_, i) => (
						<ellipse key={i} cx={-500 + ((i * 137) % 2000)} cy={ANKLE.ground + 20 + ((i * 53) % 200)} rx={8 + (i % 4) * 4} ry={5} fill={R.dirtDk} />
					))}
				</g>
			) : null}
			{/* ombre au sol */}
			<ellipse cx={620} cy={ANKLE.ground + 4} rx={300} ry={22} fill={alpha('#000000', 0.22)} filter={`url(#ab${id})`} />
			{/* le pied (tourne autour de la cheville) */}
			<g transform={footT}>
				<path d={FOOT} fill={`url(#af${id})`} {...LINE} />
				{!shoe ? (
					<>
						<path d="M842 724 C866 718 890 722 900 734" fill="none" stroke={R.line} strokeWidth={2.5} />
						<ellipse cx={890} cy={724} rx={14} ry={8} fill={R.nail} stroke={R.line} strokeWidth={2} transform="rotate(-12 890 724)" />
						<path d="M520 700 C600 690 700 700 780 716" fill="none" stroke={alpha('#FFFFFF', 0.45)} strokeWidth={14} strokeLinecap="round" />
					</>
				) : (
					<>
						<path d="M350 690 C346 652 388 636 424 646 C468 656 520 642 560 628 C640 644 722 664 802 680 C874 694 916 716 910 748 L904 784 L354 784 C344 760 346 720 350 690 Z" fill={R.shoe} stroke={R.shoeLine} strokeWidth={4} />
						<path d="M354 760 L906 762 L904 786 C700 794 500 794 356 786 Z" fill={R.sole} stroke={R.shoeLine} strokeWidth={3} />
						<path d="M470 724 C560 702 660 702 760 714" fill="none" stroke={R.accent} strokeWidth={14} strokeLinecap="round" />
						{[0, 1, 2, 3].map((i) => (
							<line key={i} x1={600 + i * 34} y1={650 + i * 6} x2={616 + i * 34} y2={668 + i * 6} stroke={R.shoeLine} strokeWidth={5} strokeLinecap="round" />
						))}
						<path d="M380 652 C400 640 420 640 432 650" fill="none" stroke={R.shoeLine} strokeWidth={4} />
					</>
				)}
				{bands.map((b, i) =>
					b.foot && nb > i ? (
						<g key={i}>
							<path d={b.d} stroke={R.bandDk} strokeWidth={54} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(nb - i)} 1`} />
							<path d={b.d} stroke={R.band} strokeWidth={46} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(nb - i)} 1`} />
						</g>
					) : null,
				)}
			</g>
			{/* la jambe */}
			<path d={LEG} fill={`url(#ak${id})`} {...LINE} />
			<path d="M398 420 C402 500 404 560 410 610" fill="none" stroke={alpha(R.skinLo, 0.8)} strokeWidth={8} strokeLinecap="round" />
			{shoe ? <path d="M392 600 C400 640 430 664 472 666 C520 666 556 640 566 600 L572 650 C562 692 520 704 470 704 C420 704 390 692 380 650 Z" fill={R.sock} stroke={R.shoeLine} strokeWidth={3} /> : null}
			{/* malléole externe (l'os de la cheville) */}
			<ellipse cx={M.x} cy={M.y} rx={30} ry={26} fill={alpha('#FFFFFF', 0.35)} />
			<path d={`M${M.x - 26} ${M.y + 16} C${M.x - 10} ${M.y + 30} ${M.x + 14} ${M.y + 30} ${M.x + 28} ${M.y + 14}`} fill="none" stroke={alpha(R.skinLo, 0.9)} strokeWidth={5} strokeLinecap="round" />
			{/* gonflement + bleu */}
			{sw > 0 ? <ellipse cx={M.x + 4} cy={M.y + 6} rx={70 + 70 * sw} ry={56 + 46 * sw} fill={`url(#as${id})`} /> : null}
			{sw > 0 ? <path d={`M${M.x + 40} ${M.y - 50 - 30 * sw} C${M.x + 70 + 40 * sw} ${M.y - 20} ${M.x + 70 + 40 * sw} ${M.y + 40} ${M.x + 40} ${M.y + 70 + 20 * sw}`} fill="none" stroke={R.line} strokeWidth={4} opacity={sw} /> : null}
			{bruise > 0 ? <ellipse cx={M.x + 10} cy={M.y + 62} rx={70} ry={30} fill={R.bruise} opacity={0.45 * cl(bruise)} filter={`url(#ab${id})`} /> : null}
			{/* vue radio : la peau s'assombrit, les os apparaissent */}
			{x > 0 ? (
				<g clipPath={`url(#ac${id})`} opacity={x}>
					<rect x={0} y={-200} width={1000} height={1100} fill={alpha(N, 0.88)} />
					<g fill={alpha(R.bone, 0.92)} stroke={alpha(LPI.sky, 0.9)} strokeWidth={3}>
						<path d="M436 -80 L520 -80 L522 480 C526 540 540 580 520 610 L440 616 C418 590 428 540 436 480 Z" />
						<path d="M492 -80 L522 -80 L526 540 C546 572 544 620 514 632 C490 628 486 590 494 540 Z" fill={alpha(R.bone, 0.75)} />
						<g transform={footT}>
							<ellipse cx={482} cy={650} rx={50} ry={30} />
							<path d="M380 662 C380 630 424 620 470 640 L500 702 C470 742 410 748 384 726 Z" />
							<path d="M540 640 C570 630 600 640 610 660 L590 690 C560 690 540 676 540 640 Z" />
							{[0, 1, 2].map((i) => (
								<line key={i} x1={600} y1={668 + i * 14} x2={840} y2={716 + i * 12} strokeWidth={16} stroke={alpha(R.bone, 0.9)} strokeLinecap="round" />
							))}
							{[0, 1, 2].map((i) => (
								<line key={`p${i}`} x1={856} y1={718 + i * 12} x2={892} y2={726 + i * 12} strokeWidth={12} stroke={alpha(R.bone, 0.9)} strokeLinecap="round" />
							))}
						</g>
					</g>
					{crack > 0 ? (
						<g opacity={cl(crack)}>
							<path d="M496 552 l14 6 l-10 10 l16 6 l-8 8" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
							<circle cx={510} cy={566} r={56 + 6 * Math.sin(frame / 5)} fill="none" stroke={LPI.pink} strokeWidth={6} strokeDasharray="14 10" />
						</g>
					) : null}
				</g>
			) : null}
			{/* poche de glace dans un linge */}
			{ice > 0 ? (
				<g transform={`translate(${(1 - cl(ice)) * 260} ${(1 - cl(ice)) * -200})`} opacity={cl(ice * 2)}>
					<rect x={410} y={520} width={230} height={170} rx={50} fill={alpha('#000000', 0.2)} filter={`url(#ab${id})`} transform="translate(10 14)" />
					<rect x={410} y={520} width={230} height={170} rx={50} fill="#FAFAF8" stroke="#9AA4B0" strokeWidth={4} transform="rotate(-8 525 605)" />
					{[0, 1, 2, 3].map((i) => (
						<line key={i} x1={440 + i * 50} y1={530} x2={430 + i * 50} y2={680} stroke={alpha('#7FA8D8', 0.7)} strokeWidth={10} transform="rotate(-8 525 605)" />
					))}
					<rect x={560} y={490} width={70} height={60} rx={12} fill={alpha('#CFE6F7', 0.95)} stroke="#7FA8D8" strokeWidth={4} transform="rotate(18 595 520)" />
					{[0, 1, 2].map((i) => {
						const t = (frame / 36 + i / 3) % 1;
						return <path key={i} transform={`translate(${440 + i * 90} ${500 - t * 50})`} opacity={1 - t} d="M0 -10 V10 M-9 -5 L9 5 M-9 5 L9 -5" stroke="#7FA8D8" strokeWidth={4} strokeLinecap="round" />;
					})}
				</g>
			) : null}
			{/* bande de contention autour de la cheville et de la jambe */}
			{bands.map((b, i) =>
				!b.foot && nb > i ? (
					<g key={i}>
						<path d={b.d} stroke={R.bandDk} strokeWidth={54} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(nb - i)} 1`} />
						<path d={b.d} stroke={R.band} strokeWidth={46} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(nb - i)} 1`} />
						<path d={b.d} stroke={alpha('#FFFFFF', 0.35)} strokeWidth={6} strokeDasharray="4 10" pathLength={1} />
					</g>
				) : null,
			)}
			{/* doigt qui appuie sur l'os */}
			{press > 0 ? (
				<g transform={`translate(${(1 - cl(press)) * 120} ${(1 - cl(press)) * -160})`}>
					<line x1={760} y1={340} x2={M.x + 26} y2={M.y - 10} stroke={R.line} strokeWidth={80} strokeLinecap="round" />
					<line x1={760} y1={340} x2={M.x + 26} y2={M.y - 10} stroke={R.skin} strokeWidth={72} strokeLinecap="round" />
					<ellipse cx={M.x + 40} cy={M.y - 26} rx={20} ry={26} fill={R.nail} stroke={R.line} strokeWidth={2.5} transform={`rotate(-50 ${M.x + 40} ${M.y - 26})`} />
				</g>
			) : null}
			{children}
		</g>
	);
};

/** Racine qui traverse le sentier (repère de `AnkleSide`, sous le pied, ou n'importe où avec `x`, `y`). */
export const RootG: React.FC<{x?: number; y?: number; s?: number}> = ({x = 0, y = 0, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M-260 30 C-140 -40 -20 -40 80 -10 C160 14 220 30 300 20" fill="none" stroke={R.root} strokeWidth={46} strokeLinecap="round" />
		<path d="M-240 18 C-140 -44 -20 -46 80 -20" fill="none" stroke={R.rootHi} strokeWidth={10} strokeLinecap="round" />
		<path d="M-60 -24 C-40 -60 0 -70 40 -64" fill="none" stroke={R.root} strokeWidth={20} strokeLinecap="round" />
	</g>
);

/**
 * Jambe allongée sur un canapé, vue de côté (repère 1000 × 700) : `e` 0 → 1 le pied monte sur deux coussins, plus haut
 * que la hanche (traits pointillés des deux niveaux).
 */
export const LegRest: React.FC<{e: number}> = ({e}) => {
	const k = cl(e);
	const H = {x: 230, y: 470};
	const t = -0.05 - 0.1 * k;
	const K = {x: H.x + 300 * Math.cos(t), y: H.y + 300 * Math.sin(t)};
	const s = -0.02 - 0.38 * k;
	const F = {x: K.x + 290 * Math.cos(s), y: K.y + 290 * Math.sin(s)};
	return (
		<svg width={1000} height={700} viewBox="0 0 1000 700" style={{overflow: 'visible', display: 'block'}}>
			{/* canapé */}
			<rect x={-60} y={500} width={1100} height={140} rx={40} fill={LPI.blue} stroke={N} strokeWidth={5} />
			<rect x={-60} y={300} width={140} height={340} rx={50} fill={LPI.blue} stroke={N} strokeWidth={5} />
			{/* coussins sous le mollet */}
			{[0, 1].map((i) => (
				<rect key={i} x={K.x + 60} y={500 - 76 * (i + 1) * k} width={220} height={78} rx={34} fill={i ? LPI.sky : LPI.paper} stroke={N} strokeWidth={4} opacity={k > 0.05 ? 1 : 0} />
			))}
			{/* buste allongé, tête sur l'accoudoir */}
			<path d={`M${H.x + 30} ${H.y - 50} L60 ${H.y - 120} L40 ${H.y - 10} L${H.x + 30} ${H.y + 30} Z`} fill={R.accent} stroke={N} strokeWidth={5} strokeLinejoin="round" />
			<circle cx={36} cy={H.y - 120} r={58} fill={R.skin} stroke={R.line} strokeWidth={4} />
			<path d={`M-20 ${H.y - 128} C-20 ${H.y - 190} 60 ${H.y - 200} 86 ${H.y - 150} C60 ${H.y - 160} 20 ${H.y - 150} -4 ${H.y - 110} Z`} fill="#5B3A22" />
			<circle cx={62} cy={H.y - 126} r={5} fill={N} />
			<path d={`M60 ${H.y - 98} q12 6 22 -4`} fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
			{/* cuisse (short), jambe, pied */}
			<line x1={H.x} y1={H.y} x2={K.x} y2={K.y} stroke={R.line} strokeWidth={96} strokeLinecap="round" />
			<line x1={H.x} y1={H.y} x2={K.x} y2={K.y} stroke={R.skin} strokeWidth={88} strokeLinecap="round" />
			<line x1={H.x} y1={H.y} x2={H.x + (K.x - H.x) * 0.6} y2={H.y + (K.y - H.y) * 0.6} stroke={N} strokeWidth={104} strokeLinecap="round" />
			<line x1={H.x} y1={H.y} x2={H.x + (K.x - H.x) * 0.6} y2={H.y + (K.y - H.y) * 0.6} stroke={LPI.blue} strokeWidth={96} strokeLinecap="round" />
			<line x1={K.x} y1={K.y} x2={F.x} y2={F.y} stroke={R.line} strokeWidth={70} strokeLinecap="round" />
			<line x1={K.x} y1={K.y} x2={F.x} y2={F.y} stroke={R.skin} strokeWidth={62} strokeLinecap="round" />
			<g transform={`translate(${F.x} ${F.y}) rotate(${14 + (s * 180) / Math.PI * 0.4})`}>
				{/* pied orteils vers le plafond, en chaussette */}
				<path d="M-34 20 C-40 -30 -24 -100 6 -118 C30 -124 40 -100 34 -60 L34 24 C20 40 -20 40 -34 20 Z" fill={R.sock} stroke={R.shoeLine} strokeWidth={4} />
			</g>
			<ellipse cx={F.x - 6} cy={F.y} rx={44} ry={38} fill={alpha(R.swell, 0.35)} />
			{/* niveaux : hanche / pied */}
			<line x1={60} y1={H.y} x2={980} y2={H.y} stroke={N} strokeWidth={5} strokeDasharray="16 12" opacity={0.6} />
			<line x1={F.x - 160} y1={F.y} x2={980} y2={F.y} stroke={LPI.pink} strokeWidth={6} strokeDasharray="16 12" opacity={k} />
			{k > 0.3 ? <path d={`M940 ${H.y - 10} L940 ${F.y + 14} m-16 22 l16 -22 l16 22`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={k} /> : null}
		</svg>
	);
};

/** Pictogramme « 4 pas » : quatre empreintes de pied en quinconce. */
export const StepsIcon: React.FC<{size?: number}> = ({size = 130}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[0, 1, 2, 3].map((i) => (
			<g key={i} transform={`translate(${30 + (i % 2) * 34} ${86 - i * 22}) rotate(-8)`}>
				<ellipse rx={9} ry={13} fill={N} />
				<circle cx={-4} cy={-17} r={3} fill={N} />
				<circle cx={3} cy={-18} r={3} fill={N} />
			</g>
		))}
	</svg>
);

/** Pictogramme « radio » : cliché de cheville (os clairs sur fond bleu nuit). */
export const XrayIcon: React.FC<{size?: number}> = ({size = 130}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={6} y={6} width={88} height={88} rx={12} fill={N} stroke={LPI.sky} strokeWidth={4} />
		<g fill={alpha(LPI.paper, 0.9)}>
			<rect x={38} y={10} width={12} height={46} rx={5} />
			<rect x={52} y={12} width={7} height={46} rx={3} />
			<ellipse cx={47} cy={62} rx={11} ry={7} />
			<path d="M28 66 C28 58 40 58 46 64 L48 76 C40 82 30 80 28 74 Z" />
			<path d="M54 64 L84 76 L82 82 L52 72 Z" />
		</g>
	</svg>
);
