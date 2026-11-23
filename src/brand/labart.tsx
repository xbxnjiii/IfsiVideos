// Petites illustrations de la série courte du tube jaune (n° 79 et suivantes) : fer (molécule Fe, garde-manger, camion de
// transferrine), foie (cellules qui lâchent leurs enzymes, canal de la bile bouché par un calcul, os), cholestérol (artère
// en coupe avec plaque), enzymes (cellule qui éclate). Palette de la marque ; le sang et les cellules restent en rose.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const FE = '#B5651D';

/** Bille de fer « Fe ». */
export const FeBall: React.FC<{r?: number}> = ({r = 26}) => (
	<g>
		<circle r={r} fill={FE} stroke={N} strokeWidth={r / 6} />
		<text y={r * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={r} fill={LPI.paper}>
			Fe
		</text>
	</g>
);

/** Garde-manger (les réserves de fer) : étagères remplies de billes Fe ; `fill` 0 → 1. */
export const Pantry: React.FC<{fill: number; width?: number}> = ({fill, width = 420}) => {
	const slots: [number, number][] = [];
	for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) slots.push([70 + col * 70, 300 - row * 100]);
	const n = Math.round(slots.length * Math.max(0, Math.min(1, fill)));
	return (
		<svg width={width} height={width * 0.9} viewBox="0 0 420 380" style={{overflow: 'visible'}}>
			<rect x={20} y={20} width={380} height={340} rx={24} fill={LPI.paper} stroke={N} strokeWidth={8} />
			{[120, 220, 320].map((y) => (
				<line key={y} x1={30} x2={390} y1={y + 18} y2={y + 18} stroke={N} strokeWidth={7} />
			))}
			{slots.slice(0, n).map(([x, y], i) => (
				<g key={i} transform={`translate(${x} ${y})`}>
					<FeBall r={24} />
				</g>
			))}
		</svg>
	);
};

/** Camion de transferrine qui roule ; `load` 0 → 1 = billes Fe dans la benne. */
export const IronTruck: React.FC<{load: number; width?: number; x?: number}> = ({load, width = 460, x = 0}) => {
	const frame = useCurrentFrame();
	const spots = [80, 140, 200, 110, 170];
	const n = Math.round(spots.length * load);
	return (
		<svg width={width} height={width * 0.55} viewBox="0 0 460 250" style={{overflow: 'visible'}}>
			<g transform={`translate(${x} ${2 * Math.sin(frame / 2)})`}>
				<rect x={40} y={60} width={240} height={120} rx={14} fill={LPI.sky} stroke={N} strokeWidth={8} />
				<path d="M280 100 H360 L410 150 V180 H280 Z" fill={LPI.blue} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<rect x={300} y={112} width={44} height={34} rx={6} fill={LPI.paper} stroke={N} strokeWidth={5} />
				{spots.slice(0, n).map((sx, i) => (
					<g key={i} transform={`translate(${sx} ${i < 3 ? 140 : 90})`}>
						<FeBall r={24} />
					</g>
				))}
				{[100, 340].map((wx) => (
					<g key={wx} transform={`translate(${wx} 190) rotate(${frame * 12})`}>
						<circle r={30} fill={N} />
						<circle r={10} fill={LPI.paper} />
						<rect x={-3} y={-26} width={6} height={14} fill={LPI.paper} />
					</g>
				))}
			</g>
		</svg>
	);
};

/** Cellules du foie en nid d'abeille ; `hurt` 0 → 1 : elles se fissurent et lâchent leurs enzymes (points) dans le sang. */
export const LiverCells: React.FC<{hurt: number; width?: number}> = ({hurt, width = 520}) => {
	const frame = useCurrentFrame();
	const hex = (cx: number, cy: number, r: number) =>
		Array.from({length: 6}, (_, i) => {
			const a = (Math.PI / 3) * i + Math.PI / 6;
			return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
		}).join(' ');
	const cells: [number, number][] = [];
	for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) cells.push([90 + col * 110 + (row % 2) * 55, 80 + row * 95]);
	return (
		<svg width={width} height={width * 0.75} viewBox="0 0 520 390" style={{overflow: 'visible'}}>
			<rect x={0} y={310} width={520} height={70} rx={30} fill={alpha('#E0524D', 0.35)} stroke={N} strokeWidth={5} />
			{cells.map(([cx, cy], i) => (
				<g key={i}>
					<polygon points={hex(cx, cy, 58)} fill="#B9574A" stroke={N} strokeWidth={5} />
					<circle cx={cx} cy={cy} r={12} fill={alpha(N, 0.6)} />
					{hurt > 0.3 && i % 3 === 0 ? <path d={`M${cx - 30} ${cy - 20} l20 18 l-8 12 l22 16`} fill="none" stroke={LPI.paper} strokeWidth={5} opacity={hurt} /> : null}
				</g>
			))}
			{Array.from({length: 14}).map((_, i) => {
				const t = ((frame / 40 + i / 14) % 1) * hurt;
				const sx = 60 + ((i * 97) % 420);
				return <circle key={`e${i}`} cx={sx + 10 * Math.sin(frame / 8 + i)} cy={200 + t * 140} r={9} fill={LPI.sky} stroke={N} strokeWidth={3} opacity={hurt > 0.05 ? 1 : 0} />;
			})}
		</svg>
	);
};

/** Canal de la bile (vert) ; `block` 0 → 1 : un calcul le bouche, la bile s'arrête et s'accumule. */
export const BileDuct: React.FC<{block: number; width?: number}> = ({block, width = 560}) => {
	const frame = useCurrentFrame();
	const stop = block > 0.5;
	return (
		<svg width={width} height={width * 0.4} viewBox="0 0 560 220" style={{overflow: 'visible'}}>
			<rect x={10} y={70} width={540} height={80} rx={40} fill="#D9E8B0" stroke={N} strokeWidth={7} />
			{Array.from({length: 8}).map((_, i) => {
				const x = stop ? 30 + ((i * 37) % 240) : 30 + ((frame * 4 + i * 70) % 520);
				return <circle key={i} cx={x} cy={110 + (i % 2 ? 14 : -14)} r={12} fill="#6E9A2E" opacity={0.85} />;
			})}
			{block > 0 ? (
				<g transform={`translate(330 110) scale(${block})`}>
					<path d="M-40 -30 C-10 -48 34 -40 42 -6 C50 30 10 46 -22 38 C-50 30 -58 -14 -40 -30 Z" fill="#C9A66B" stroke={N} strokeWidth={6} />
				</g>
			) : null}
		</svg>
	);
};

/** Os long (icône). */
export const BoneIcon: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M28 18 C18 8 4 20 14 30 C6 36 12 50 24 44 L56 76 C50 88 64 94 70 86 C80 96 92 82 82 72 C94 66 88 52 76 58 L44 26 C50 14 36 8 28 18 Z" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
	</svg>
);

/** Artère en coupe ; `plaque` 0 → 1 : le cholestérol se dépose et rétrécit le passage ; `clean` 0 → 1 : la plaque fond. */
export const Artery: React.FC<{plaque: number; clean?: number; width?: number}> = ({plaque, clean = 0, width = 460}) => {
	const frame = useCurrentFrame();
	const p = Math.max(0, plaque * (1 - clean));
	return (
		<svg width={width} height={width} viewBox="0 0 400 400" style={{overflow: 'visible'}}>
			<circle cx={200} cy={200} r={180} fill="#E79A8F" stroke={N} strokeWidth={8} />
			<circle cx={200} cy={200} r={140} fill="#F3D37A" stroke={N} strokeWidth={4} />
			<circle cx={200} cy={200 + 55 * p} r={140 - 85 * p} fill="#C9443E" />
			{Array.from({length: 6}).map((_, i) => (
				<circle key={i} cx={200 + (60 - 40 * p) * Math.cos(frame / 12 + i)} cy={200 + 55 * p + (40 - 25 * p) * Math.sin(frame / 10 + i * 2)} r={14} fill="#E0524D" stroke={alpha(N, 0.4)} strokeWidth={2} />
			))}
		</svg>
	);
};

/** Cellule ronde qui éclate (`burst` 0 → 1) et lâche des enzymes (points bleu clair). */
export const BurstCell: React.FC<{burst: number; size?: number; tone?: string}> = ({burst, size = 300, tone = LPI.pink}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="0 0 300 300" style={{overflow: 'visible'}}>
			<circle cx={150} cy={150} r={100} fill={tone} stroke={N} strokeWidth={8} strokeDasharray={burst > 0.3 ? '60 18' : undefined} />
			<circle cx={150} cy={150} r={30} fill={alpha(N, 0.55)} />
			{Array.from({length: 12}).map((_, i) => {
				const a = (i / 12) * Math.PI * 2;
				const d = 60 + 110 * burst + 6 * Math.sin(frame / 6 + i);
				return <circle key={i} cx={150 + Math.cos(a) * d} cy={150 + Math.sin(a) * d} r={13} fill={LPI.sky} stroke={N} strokeWidth={3} opacity={burst > 0.05 ? 1 : 0} />;
			})}
		</svg>
	);
};
