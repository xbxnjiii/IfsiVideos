// Modèle de corps humain réutilisable : patient vu de face, de la tête aux hanches (bas en fondu).
// Style plat de la marque (trait bleu nuit, tenue bleue, peau = rose 30 % sur blanc cassé), visage simple
// qui cligne, et des calques à doser 0 → 1 : cœur qui bat (ou tremble), artères (sang qui s'arrête), cerveau vu à
// travers le crâne (privé d'oxygène), poumons, lèvres bleutées (cyanose), brassard, rougeur, pâleur, sueurs, maux de
// tête, vertiges. Les points du corps (PATIENT_PTS) servent à poser repères, traits et loupes.
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
	/** visage paralysé d'un côté (AVC) : la bouche et la paupière tombent côté droit de l'écran (0 → 1) */
	droop?: number;
	/** bras levés vers l'extérieur, en degrés (0 = le long du corps, 90 = à l'horizontale) */
	armL?: number;
	armR?: number;
	/** yeux fermés (inconscient, 0 → 1) */
	eyesClosed?: number;
	/** le cœur tremble au lieu de battre (fibrillation, 0 → 1) */
	quiver?: number;
	/** cerveau vu à travers le crâne (0 → 1) ; avec `flow`, les carotides montent du cœur jusqu'à lui */
	brain?: number;
	/** cerveau privé d'oxygène : il pâlit, ses neurones s'éteignent (0 → 1) */
	anoxia?: number;
	/** le sang ne circule plus : artères vides (0 → 1) */
	bloodless?: number;
	/** avancée du sang dans les artères (par défaut 3 × frame ; la figer = le sang s'arrête) */
	flowPhase?: number;
	/** poumons vus à travers le thorax (0 → 1) ; ils se gonflent avec `breath` */
	lungs?: number;
	/** lèvres bleutées : cyanose, manque d'oxygène (0 → 1) */
	cyanosis?: number;
	/** bas du corps en fondu (par défaut) ; false pour poser des jambes dessous (`FullBody`) */
	fade?: boolean;
};

const ARMS = ['M106 236 C92 290 80 340 76 400 C74 430 74 455 76 474', 'M294 236 C308 290 320 340 324 400 C326 430 326 455 324 474'];
const SLEEVES = ['M110 230 C100 254 94 276 92 300', 'M290 230 C300 254 306 276 308 300'];
const TORSO = 'M112 214 C140 197 168 192 200 192 C232 192 260 197 288 214 C300 222 304 236 302 252 L294 560 H106 L98 252 C96 236 100 222 112 214 Z';
const ARTERIES = [
	'M228 300 C232 262 262 236 292 244 C306 290 318 340 322 400 C324 430 324 450 324 470',
	'M228 300 C220 258 140 236 108 244 C94 290 82 340 78 400 C76 430 76 450 76 470',
	'M228 300 C222 340 206 380 200 470',
];
/** carotides : du cœur au cou (sous le cœur), puis du cou au cerveau le long des joues (par-dessus la tête) */
const CAROTIDS_LOW = ['M228 300 C230 262 218 236 216 206', 'M228 300 C222 262 186 236 184 206'];
const CAROTIDS_UP = ['M216 206 C215 186 230 172 246 160 C258 150 258 120 246 92', 'M184 206 C183 186 170 172 154 160 C142 150 142 120 154 92'];
const CAROTID_LOW_LEN = 98;
/** poumons (vus de face, espace 400 × 560) */
export const LUNGS = ['M188 238 C150 236 124 282 122 344 C120 384 142 396 172 388 C186 384 192 364 192 334 Z', 'M212 238 C250 236 276 282 278 344 C280 384 258 396 228 388 C214 384 208 364 208 334 Z'];
const BRAIN = 'M200 40 C182 30 150 36 146 62 C142 86 162 100 186 98 C194 97 198 94 200 90 C202 94 206 97 214 98 C238 100 258 86 254 62 C250 36 218 30 200 40 Z';
const GYRI = 'M162 56 Q172 46 180 58 Q186 66 176 72 M158 80 Q170 72 180 84 M238 56 Q228 46 220 58 Q214 66 224 72 M242 80 Q230 72 220 84 M188 44 Q194 54 186 62 M212 44 Q206 54 214 62';
const NEURONS = [
	[166, 50],
	[176, 86],
	[156, 68],
	[190, 72],
	[234, 50],
	[224, 86],
	[244, 68],
	[210, 72],
];

/** Artère : gaine claire, sang rose (ou vide, bleu clair) et globules qui avancent avec `phase`. */
const Artery: React.FC<{d: string; o: number; bloodless: number; phase: number}> = ({d, o, bloodless, phase}) => (
	<g opacity={o}>
		<path d={d} fill="none" stroke={alpha(LPI.paper, 0.9)} strokeWidth={14} strokeLinecap="round" />
		<path d={d} fill="none" stroke={LPI.sky} strokeWidth={8} strokeLinecap="round" />
		<path d={d} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" opacity={1 - bloodless} />
		<path d={d} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 26" strokeDashoffset={-phase} opacity={0.6 * (1 - 0.7 * bloodless)} />
	</g>
);

/** Calque de peau : blanc cassé + rose 30 % (+ rougeur), ou bleu clair (pâleur). */
const SkinLayers: React.FC<{flush: number; pale: number; children: (fill: string, opacity: number) => React.ReactNode}> = ({flush, pale, children}) => (
	<>
		{children(LPI.paper, 1)}
		{children(LPI.pink, Math.max(0, 0.3 - 0.3 * pale))}
		{pale > 0 ? children(LPI.sky, 0.45 * pale) : null}
		{flush > 0 ? children(LPI.pink, 0.4 * flush) : null}
	</>
);

export const Patient: React.FC<PatientProps> = ({size = 360, mood = 'calme', breath = 0, heart = 0, beat = 0, flow = 0, cuff = 0, press = 0, flush = 0, pale = 0, sweat = 0, pain = 0, dizzy = 0, droop = 0, armL = 0, armR = 0, eyesClosed = 0, quiver = 0, brain = 0, anoxia = 0, bloodless = 0, flowPhase, lungs = 0, cyanosis = 0, fade = true}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const blink = Math.min(frame % 96 < 4 ? 0.15 : 1, 1 - 0.9 * eyesClosed);
	const lift = breath * 8;
	const wide = 1 + breath * 0.035;
	const unwell = mood === 'mal';
	const mouth =
		droop > 0
			? `M184 ${148 + 2 * droop} Q200 ${156 + 4 * droop} 218 ${148 + 26 * droop}`
			: mood === 'content'
				? 'M180 144 Q200 166 220 144'
				: unwell
					? 'M184 156 Q192 148 200 154 Q208 160 216 152'
					: 'M186 148 Q200 158 214 148';
	const [hx, hy] = PATIENT_PTS.heart;
	const [cx, cy] = PATIENT_PTS.upperArm;
	const phase = flowPhase ?? frame * 3;
	const jx = Math.sin(frame * 2.7) * 4 * quiver;
	const jy = Math.cos(frame * 3.3) * 3 * quiver;
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
			<g mask={fade ? `url(#m${id})` : undefined}>
				<g transform={`translate(200 ${380 - lift}) scale(${wide} 1) translate(-200 -380)`}>
					{/* bras (contour, peau, manche courte), chacun pivote à l'épaule */}
					{ARMS.map((d, k) => (
						<g key={d} transform={k === 0 ? `rotate(${armL} 106 236)` : `rotate(${-armR} 294 236)`}>
							<path d={d} fill="none" stroke={N} strokeWidth={56} strokeLinecap="round" />
							<SkinLayers flush={0} pale={pale}>
								{(fill, o) => <path d={d} fill="none" stroke={fill} strokeWidth={42} strokeLinecap="round" opacity={o} />}
							</SkinLayers>
							<path d={SLEEVES[k]} fill="none" stroke={N} strokeWidth={66} strokeLinecap="round" />
							<path d={SLEEVES[k]} fill="none" stroke={LPI.blue} strokeWidth={52} strokeLinecap="round" />
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
					{/* poumons (trachée, bronches), qui se gonflent avec la respiration */}
					{lungs > 0 ? (
						<g opacity={lungs} transform={`translate(200 300) scale(${1 + 0.06 * breath}) translate(-200 -300)`}>
							<path d="M200 196 V238 M200 238 L184 254 M200 238 L216 254" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" />
							<path d="M200 196 V238 M200 238 L184 254 M200 238 L216 254" fill="none" stroke={LPI.sky} strokeWidth={6} strokeLinecap="round" />
							{LUNGS.map((d) => (
								<path key={d} d={d} fill={LPI.sky} stroke={N} strokeWidth={6} strokeLinejoin="round" />
							))}
						</g>
					) : null}
					{/* artères */}
					{flow > 0 ? ARTERIES.map((d) => <Artery key={d} d={d} o={flow} bloodless={bloodless} phase={phase} />) : null}
					{brain > 0 && flow > 0 ? CAROTIDS_LOW.map((d) => <Artery key={d} d={d} o={Math.min(brain, flow)} bloodless={bloodless} phase={phase} />) : null}
					{/* cœur (qui tremble : il frémit sur place, petits éclairs de chaque côté) */}
					{heart > 0 ? (
						<g transform={`translate(${hx + jx} ${hy + jy}) scale(${(0.55 + 0.45 * heart) * (1 + 0.14 * beat + 0.05 * quiver * Math.sin(frame * 3.1))})`} opacity={Math.min(1, heart * 1.5)}>
							<circle r={34 + 16 * beat} fill={alpha(LPI.pink, 0.35 * (1 - beat))} />
							<path d="M0 24 C-38 -4 -26 -42 0 -22 C26 -42 38 -4 0 24 Z" fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
							{quiver > 0
								? [-1, 1].map((k) => (
										<path key={k} d={`M${k * 44} -18 l${k * 9} 7 l${-k * 9} 7 l${k * 9} 7`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={quiver * (0.6 + 0.4 * Math.sin(frame))} />
									))
								: null}
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
					<g transform={`translate(0 ${118 + 2 * droop}) scale(1 ${1 - 0.75 * droop}) translate(0 -118)`}>
						<circle cx={224} cy={118} r={8} fill={N} />
					</g>
				</g>
				{eyesClosed > 0 ? <path d="M164 120 Q176 128 188 120 M212 120 Q224 128 236 120" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" opacity={eyesClosed} /> : null}
				{droop > 0 ? <path d={`M212 ${104 + 4 * droop} Q224 ${106 + 6 * droop} 236 ${108 + 8 * droop}`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" opacity={droop} /> : null}
				<path d={mouth} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
				{cyanosis > 0 ? <path d={mouth} fill="none" stroke={LPI.blue} strokeWidth={11} strokeLinecap="round" opacity={cyanosis} /> : null}
				{/* cerveau vu à travers le crâne, carotides qui l'irriguent */}
				{brain > 0 ? (
					<g opacity={brain}>
						<ellipse cx={200} cy={66} rx={70} ry={46} fill={alpha(LPI.paper, 0.85)} stroke={alpha(LPI.sky, 0.9)} strokeWidth={4} strokeDasharray="10 8" />
						<path d={BRAIN} fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
						{anoxia > 0 ? <path d={BRAIN} fill={LPI.sky} opacity={0.85 * anoxia} /> : null}
						<path d={GYRI} fill="none" stroke={alpha(N, 0.45)} strokeWidth={4} strokeLinecap="round" />
						<path d="M200 42 V90" stroke={alpha(N, 0.55)} strokeWidth={4} strokeLinecap="round" />
						{NEURONS.map(([x, y], i) => (
							<circle key={i} cx={x} cy={y} r={4.5} fill={LPI.paper} opacity={Math.max(0, 1 - Math.min(1, anoxia * 1.6 - (i % 3) * 0.2)) * (0.55 + 0.45 * Math.sin(frame / 4 + i * 1.7))} />
						))}
					</g>
				) : null}
				{brain > 0 && flow > 0 ? CAROTIDS_UP.map((d) => <Artery key={d} d={d} o={Math.min(brain, flow)} bloodless={bloodless} phase={phase - CAROTID_LOW_LEN} />) : null}
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
