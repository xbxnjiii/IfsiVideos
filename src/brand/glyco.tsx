// Briques « glycémie » réutilisables : normes adulte (zones), doigt + autopiqueur + goutte, lecteur de glycémie
// (bandelette, valeur en g/l), sucres qui pleuvent, morceaux de sucre qui circulent dans l'artère, cellule qui
// « brûle » le glucose (carburant).
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Odometer} from './motion3';
import type {Zone} from './NormScale';
import {alpha, FONT, LPI} from './theme';

/** Normes adulte à jeun (liste fournie) : hypoglycémie < 0,70 · normoglycémie 0,70 – 1,10 · hyperglycémie > 1,10 g/l. */
export const GLY_ZONES: Zone[] = [
	{name: 'hypoglycémie', range: '< 0,70 g/l\n(< 3,9 mmol/L)', tone: 'low', w: 1, lo: 0.3, hi: 0.7},
	{name: 'normoglycémie', range: '0,70 – 1,10 g/l\n(3,9 – 6,1 mmol/L)', tone: 'norm', w: 1.15, lo: 0.7, hi: 1.1},
	{name: 'hyperglycémie', range: '> 1,10 g/l\n(> 6,1 mmol/L)', tone: 'high', w: 1, lo: 1.1, hi: 2.6},
];

/** Doigt stylisé (vu de profil) : une goutte de sang perle au bout. */
export const Finger: React.FC<{drop: number}> = ({drop}) => (
	<svg width={330} height={230} viewBox="0 0 330 230" style={{overflow: 'visible'}}>
		<path d="M-40 70 H250 A40 40 0 0 1 250 150 H-40" fill={LPI.paper} stroke={LPI.navy} strokeWidth={9} strokeLinejoin="round" />
		<path d="M224 76 H262 A14 14 0 0 1 262 104 H224 A6 6 0 0 1 218 98 V82 A6 6 0 0 1 224 76 Z" fill={alpha(LPI.sky, 0.9)} stroke={LPI.navy} strokeWidth={6} />
		<path d="M110 90 V130 M150 90 V130" stroke={alpha(LPI.navy, 0.3)} strokeWidth={6} strokeLinecap="round" />
		<g transform={`translate(270 146) scale(${drop})`}>
			<path d="M0 0 C-12 16 -17 28 -17 36 A17 17 0 0 0 17 36 C17 28 12 16 0 0 Z" fill={LPI.pink} stroke={LPI.navy} strokeWidth={6} strokeLinejoin="round" />
		</g>
	</svg>
);

/** Lecteur de glycémie : bandelette à gauche, écran avec la valeur en g/l. */
export const Glucometer: React.FC<{value: number; strip: number; blood: number; tone: string | null; beep: number}> = ({value, strip, blood, tone, beep}) => (
	<div style={{position: 'relative', width: 440, height: 250}}>
		{/* bandelette qui sort vers le doigt */}
		<div
			style={{
				position: 'absolute',
				left: -150 * strip,
				top: 124,
				width: 160,
				height: 30,
				borderRadius: 8,
				background: LPI.paper,
				border: `6px solid ${LPI.navy}`,
				boxSizing: 'border-box',
			}}
		>
			<div style={{position: 'absolute', left: 6, top: 3, width: 26 * blood, height: 12, borderRadius: 6, background: LPI.pink}} />
			<div style={{position: 'absolute', right: 20, top: 3, width: 40, height: 12, borderRadius: 4, background: LPI.blue}} />
		</div>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				borderRadius: 60,
				background: LPI.blue,
				border: `9px solid ${LPI.navy}`,
				boxSizing: 'border-box',
				transform: `scale(${1 + 0.03 * beep})`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 26,
					top: 26,
					width: 290,
					height: 180,
					borderRadius: 30,
					background: tone ? alpha(tone, 0.6) : LPI.paper,
					border: `6px solid ${LPI.navy}`,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Odometer value={value} decimals={2} places={1} size={100} />
				<div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 34, color: LPI.blue, marginTop: -6}}>g/l</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 334,
					top: 84,
					width: 66,
					height: 66,
					borderRadius: 33,
					background: LPI.sky,
					border: `6px solid ${LPI.navy}`,
					boxSizing: 'border-box',
				}}
			/>
		</div>
	</div>
);

/** Morceaux de sucre qui pleuvent (hyperglycémie). */
export const SugarRain: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<>
			{Array.from({length: 10}, (_, i) => {
				const x = 30 + random(`gx${i}`) * 860;
				const y = ((frame * (3 + random(`gv${i}`) * 2) + random(`gy${i}`) * 440) % 480) - 50;
				const s = 34 + random(`gs${i}`) * 18;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: s,
							height: s,
							borderRadius: 8,
							background: LPI.paper,
							border: `5px solid ${LPI.navy}`,
							opacity: on * 0.9,
							transform: `rotate(${frame * 3 + i * 40}deg)`,
						}}
					/>
				);
			})}
		</>
	);
};


/** Autopiqueur vu de face, pointe vers le haut : `press` 0 → 1 le pousse contre le doigt (déclic). */
export const Lancet: React.FC<{press: number; height?: number}> = ({press, height = 220}) => (
	<svg width={(80 / 220) * height} height={height} viewBox="0 0 80 220" style={{overflow: 'visible', transform: `translateY(${-press * 18}px)`}}>
		<rect x={22} y={4} width={36} height={40} rx={12} fill={LPI.sky} stroke={LPI.navy} strokeWidth={6} />
		<rect x={12} y={36} width={56} height={176} rx={24} fill={LPI.blue} stroke={LPI.navy} strokeWidth={7} />
		<rect x={30} y={70} width={20} height={44} rx={10} fill={LPI.paper} stroke={LPI.navy} strokeWidth={5} />
		<path d="M26 150 H54 M26 168 H54" stroke={alpha(LPI.paper, 0.6)} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** Morceau de sucre (carré blanc, reflet). */
export const SugarCube: React.FC<{size?: number; rot?: number}> = ({size = 44, rot = 0}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size * 0.2,
			background: LPI.paper,
			border: `${Math.max(3, size * 0.11)}px solid ${LPI.navy}`,
			boxSizing: 'border-box',
			transform: `rotate(${rot}deg)`,
			position: 'relative',
		}}
	>
		<div style={{position: 'absolute', left: '18%', top: '18%', width: '30%', height: '12%', borderRadius: 4, background: LPI.sky}} />
	</div>
);

/** Morceaux de sucre qui circulent dans la lumière de l'artère (`Artery`, 300 px de haut). */
export const SugarFlow: React.FC<{on: number; width: number; n?: number}> = ({on, width, n = 6}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<>
			{Array.from({length: n}, (_, i) => {
				const x = ((random(`sf${i}`) * (width + 60) + frame * 5) % (width + 60)) - 40;
				const y = 112 + random(`sfy${i}`) * 54;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, opacity: on, transform: `scale(${on})`}}>
						<SugarCube size={34} rot={frame * 2 + i * 50} />
					</div>
				);
			})}
		</>
	);
};

/** Cellule (membrane bleue, noyau rose) : `energy` 0 → 1 fait briller un éclair (le glucose = carburant). */
export const Cell: React.FC<{size?: number; energy?: number; eat?: number}> = ({size = 200, energy = 0, eat = 0}) => {
	const frame = useCurrentFrame();
	const wob = (k: number) => 92 + 4 * Math.sin(frame / 7 + k);
	return (
		<svg width={size} height={size} viewBox="-110 -110 220 220" style={{overflow: 'visible'}}>
			<circle r={100 + 14 * energy} fill={alpha(LPI.pink, 0.25 * energy)} />
			<ellipse rx={wob(0)} ry={wob(2)} fill={alpha(LPI.sky, 0.9)} stroke={LPI.navy} strokeWidth={8} />
			<circle cx={-26} cy={-18} r={30} fill={alpha(LPI.pink, 0.8)} stroke={LPI.navy} strokeWidth={6} />
			<circle cx={-34} cy={-26} r={8} fill={alpha(LPI.navy, 0.4)} />
			<ellipse cx={34} cy={34} rx={20} ry={11} fill="none" stroke={LPI.blue} strokeWidth={6} transform="rotate(-30 34 34)" />
			{eat > 0 ? <rect x={-14 + 70 * (1 - eat)} y={20} width={28} height={28} rx={6} fill={LPI.paper} stroke={LPI.navy} strokeWidth={5} opacity={1 - eat * 0.6} transform={`rotate(${eat * 90} ${70 * (1 - eat)} 34)`} /> : null}
			{energy > 0 ? (
				<path d="M14 -70 L-14 -10 H8 L-4 46 L34 -20 H10 Z" transform={`translate(30 -20) scale(${0.5 + 0.5 * energy})`} fill={LPI.pink} stroke={LPI.navy} strokeWidth={6} strokeLinejoin="round" opacity={Math.min(1, energy * 2)} />
			) : null}
		</svg>
	);
};
