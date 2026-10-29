// Modèle de corps humain réutilisable : patient vu de face, de la tête aux hanches (bas en fondu).
// Style plat de la marque (trait bleu nuit, tenue bleue, peau = rose 30 % sur blanc cassé), visage simple
// qui cligne, et des calques à doser 0 → 1 : cœur qui bat, artères, brassard, rougeur, pâleur, sueurs,
// maux de tête, vertiges. Les points du corps (PATIENT_PTS) servent à poser repères, traits et loupes.
import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const VB = {w: 400, h: 560};

/** Points du corps (unités du viewBox 400 × 560) ; `patientPoint` les convertit en pixels. */
export const PATIENT_PTS = {
	forehead: [200, 84],
	mouth: [200, 150],
	ear: [266, 116],
	armpit: [104, 250],
	upperArm: [309, 300],
	elbow: [322, 380],
	wrist: [326, 466],
	heart: [228, 300],
	chest: [200, 300],
	belly: [200, 430],
} as const;
export type PatientPoint = keyof typeof PATIENT_PTS;
export const patientPoint = (p: PatientPoint, size: number) => {
	const k = size / VB.w;
	return {x: PATIENT_PTS[p][0] * k, y: PATIENT_PTS[p][1] * k};
};

export type PatientProps = {
	/** largeur en px (hauteur = 1,4 × largeur) */
	size?: number;
	mood?: 'calme' | 'content' | 'mal';
	/** 0 → 1 : le thorax se soulève */
	breath?: number;
	/** cœur visible (0 → 1) et battement (0 → 1) */
	heart?: number;
	beat?: number;
	/** artères qui partent du cœur (0 → 1) */
	flow?: number;
	/** brassard posé sur le bras (0 → 1) et gonflé (0 → 1) */
	cuff?: number;
	press?: number;
	flush?: number;
	pale?: number;
	sweat?: number;
	/** éclairs « aïe » aux tempes (maux de tête) */
	pain?: number;
	/** étoiles qui tournent autour de la tête */
	dizzy?: number;
};

const ARMS = ['M106 236 C92 290 80 340 76 400 C74 430 74 455 76 474', 'M294 236 C308 290 320 340 324 400 C326 430 326 455 324 474'];
const SLEEVES = ['M110 230 C100 254 94 276 92 300', 'M290 230 C300 254 306 276 308 300'];
const TORSO = 'M112 214 C140 197 168 192 200 192 C232 192 260 197 288 214 C300 222 304 236 302 252 L294 560 H106 L98 252 C96 236 100 222 112 214 Z';
const ARTERIES = [
	'M228 300 C232 262 262 236 292 244 C306 290 318 340 322 400 C324 430 324 450 324 470',
	'M228 300 C220 258 140 236 108 244 C94 290 82 340 78 400 C76 430 76 450 76 470',
	'M228 300 C222 340 206 380 200 470',
];

/** Calque de peau : blanc cassé + rose 30 % (+ rougeur), ou bleu clair (pâleur). */
const SkinLayers: React.FC<{flush: number; pale: number; children: (fill: string, opacity: number) => React.ReactNode}> = ({flush, pale, children}) => (
	<>
		{children(LPI.paper, 1)}
		{children(LPI.pink, Math.max(0, 0.3 - 0.3 * pale))}
		{pale > 0 ? children(LPI.sky, 0.45 * pale) : null}
		{flush > 0 ? children(LPI.pink, 0.4 * flush) : null}
	</>
);

export const Patient: React.FC<PatientProps> = ({size = 360, mood = 'calme', breath = 0, heart = 0, beat = 0, flow = 0, cuff = 0, press = 0, flush = 0, pale = 0, sweat = 0, pain = 0, dizzy = 0}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const blink = frame % 96 < 4 ? 0.15 : 1;
	const lift = breath * 8;
	const wide = 1 + breath * 0.035;
	const unwell = mood === 'mal';
	const [hx, hy] = PATIENT_PTS.heart;
	const [cx, cy] = PATIENT_PTS.upperArm;
	return (
		<svg width={size} height={size * 1.4} viewBox={`0 0 ${VB.w} ${VB.h}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={`fade${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0.8" stopColor="#fff" stopOpacity={1} />
					<stop offset="1" stopColor="#fff" stopOpacity={0} />
				</linearGradient>
				<mask id={`m${id}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={800} height={VB.h + 200}>
					<rect x={-200} y={-200} width={800} height={200} fill="#fff" />
					<rect x={-200} y={0} width={800} height={VB.h} fill={`url(#fade${id})`} />
				</mask>
			</defs>
			<g mask={`url(#m${id})`}>
				<g transform={`translate(200 ${380 - lift}) scale(${wide} 1) translate(-200 -380)`}>
					{/* bras (contour puis peau) et mains */}
					{ARMS.map((d) => (
						<path key={d} d={d} fill="none" stroke={N} strokeWidth={56} strokeLinecap="round" />
					))}
					<SkinLayers flush={0} pale={pale}>
						{(fill, o) => (
							<g opacity={o}>
								{ARMS.map((d) => (
									<path key={d} d={d} fill="none" stroke={fill} strokeWidth={42} strokeLinecap="round" />
								))}
							</g>
						)}
					</SkinLayers>
					{/* manches courtes */}
					{SLEEVES.map((d) => (
						<g key={d}>
							<path d={d} fill="none" stroke={N} strokeWidth={66} strokeLinecap="round" />
							<path d={d} fill="none" stroke={LPI.blue} strokeWidth={52} strokeLinecap="round" />
						</g>
					))}
					{/* cou */}
					<SkinLayers flush={0} pale={pale}>
						{(fill, o) => <rect x={178} y={150} width={44} height={60} rx={14} fill={fill} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={8} />}
					</SkinLayers>
					{/* tunique + col en V + poche */}
					<path d={TORSO} fill={LPI.blue} stroke={N} strokeWidth={8} strokeLinejoin="round" />
					<SkinLayers flush={0} pale={pale}>
						{(fill, o) => <path d="M174 194 L200 232 L226 194 Z" fill={fill} opacity={o} />}
					</SkinLayers>
					<path d="M172 194 L200 234 L228 194" fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
					<rect x={126} y={262} width={46} height={40} rx={8} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={5} />
					<path d="M200 236 V560" stroke={alpha(N, 0.25)} strokeWidth={4} />
					{/* artères */}
					{flow > 0
						? ARTERIES.map((d) => (
								<g key={d} opacity={flow}>
									<path d={d} fill="none" stroke={alpha(LPI.paper, 0.9)} strokeWidth={14} strokeLinecap="round" />
									<path d={d} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
									<path d={d} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 26" strokeDashoffset={-frame * 3} opacity={0.6} />
								</g>
							))
						: null}
					{/* cœur */}
					{heart > 0 ? (
						<g transform={`translate(${hx} ${hy}) scale(${(0.55 + 0.45 * heart) * (1 + 0.14 * beat)})`} opacity={Math.min(1, heart * 1.5)}>
							<circle r={34 + 16 * beat} fill={alpha(LPI.pink, 0.35 * (1 - beat))} />
							<path d="M0 24 C-38 -4 -26 -42 0 -22 C26 -42 38 -4 0 24 Z" fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
						</g>
					) : null}
					{/* brassard (bras droit du patient, à gauche de l'écran… ici côté droit de l'écran) */}
					{cuff > 0 ? (
						<g transform={`translate(${cx + (1 - cuff) * 90} ${cy}) rotate(-11) scale(${1 + 0.1 * press} 1)`} opacity={Math.min(1, cuff * 1.6)}>
							<rect x={-40} y={-50} width={80} height={100} rx={16} fill={LPI.sky} stroke={N} strokeWidth={7} />
							<path d="M-40 -16 H40 M-40 16 H40" stroke={alpha(N, 0.35)} strokeWidth={5} />
							<rect x={-16} y={-36} width={32} height={14} rx={4} fill={LPI.blue} />
						</g>
					) : null}
				</g>
				{/* tête : oreilles, visage, cheveux */}
				<SkinLayers flush={flush} pale={pale}>
					{(fill, o) => (
						<g opacity={o}>
							<ellipse cx={134} cy={116} rx={13} ry={19} fill={fill} stroke={o === 1 ? N : 'none'} strokeWidth={7} />
							<ellipse cx={266} cy={116} rx={13} ry={19} fill={fill} stroke={o === 1 ? N : 'none'} strokeWidth={7} />
							<ellipse cx={200} cy={108} rx={66} ry={74} fill={fill} stroke={o === 1 ? N : 'none'} strokeWidth={8} />
						</g>
					)}
				</SkinLayers>
				<path d="M134 110 C126 58 162 28 204 28 C246 28 276 60 266 110 C256 86 238 70 214 64 C194 80 166 90 134 110 Z" fill={N} />
				{/* joues */}
				<ellipse cx={160} cy={140} rx={14} ry={8} fill={LPI.pink} opacity={0.55 * (1 - pale) + 0.3 * flush} />
				<ellipse cx={240} cy={140} rx={14} ry={8} fill={LPI.pink} opacity={0.55 * (1 - pale) + 0.3 * flush} />
				{/* sourcils, yeux, bouche */}
				<path d={unwell ? 'M164 98 L186 104 M236 98 L214 104' : 'M164 100 Q176 94 188 99 M212 99 Q224 94 236 100'} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
				<g transform={`translate(0 118) scale(1 ${blink}) translate(0 -118)`}>
					<circle cx={176} cy={118} r={8} fill={N} />
					<circle cx={224} cy={118} r={8} fill={N} />
				</g>
				<path
					d={mood === 'content' ? 'M180 144 Q200 166 220 144' : unwell ? 'M184 156 Q192 148 200 154 Q208 160 216 152' : 'M186 148 Q200 158 214 148'}
					fill="none"
					stroke={N}
					strokeWidth={6}
					strokeLinecap="round"
				/>
				{/* sueurs */}
				{sweat > 0
					? [
							[118, 74, 0],
							[284, 92, 11],
						].map(([x, y, k]) => {
							const t = ((frame + k) % 32) / 32;
							return <path key={x} d={`M${x} ${y + t * 26} c-7 10 -9 16 0 20 c9 -4 7 -10 0 -20 Z`} fill={LPI.sky} stroke={N} strokeWidth={4} opacity={sweat * (1 - t * 0.6)} />;
						})
					: null}
				{/* maux de tête : éclairs aux tempes */}
				{pain > 0
					? [
							[108, 64, -1],
							[292, 64, 1],
						].map(([x, y, s]) => (
							<path
								key={x}
								d={`M${x} ${y} l${10 * s} -18 l${-2 * s} 16 l${12 * s} -14`}
								fill="none"
								stroke={LPI.pink}
								strokeWidth={7}
								strokeLinecap="round"
								strokeLinejoin="round"
								opacity={pain}
								transform={`translate(${s * 3 * Math.sin(frame / 2)} 0)`}
							/>
						))
					: null}
				{/* vertiges : étoiles qui tournent */}
				{dizzy > 0
					? [0, 1, 2].map((k) => {
							const a = frame / 9 + (k * Math.PI * 2) / 3;
							const x = 200 + Math.cos(a) * 92;
							const y = 26 + Math.sin(a) * 20;
							return (
								<path
									key={k}
									d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z"
									transform={`translate(${x} ${y}) scale(${0.8 + 0.3 * Math.sin(a)})`}
									fill={k === 1 ? LPI.pink : LPI.blue}
									stroke={N}
									strokeWidth={3}
									opacity={dizzy}
								/>
							);
						})
					: null}
			</g>
		</svg>
	);
};
