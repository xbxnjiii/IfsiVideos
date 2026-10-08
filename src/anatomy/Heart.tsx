// Cœur semi-réaliste, vue antérieure (repère local 400 × 440, pointe en bas à droite de l'écran).
// Palette La Petite IDE uniquement : myocarde rose, sang désoxygéné bleu, ombres bleu nuit en transparence.
import React from 'react';
import {alpha, LPI} from '../brand/theme';

export const HEART_BOX = {w: 400, h: 440, cx: 236, cy: 290};

const VENTRICLES = 'M118 196 C92 262 146 362 248 420 C290 444 334 404 354 332 C374 262 362 204 330 172 C270 150 176 164 118 196 Z';
const LV = 'M258 170 C244 248 262 330 270 430 C300 440 336 402 354 332 C374 262 362 204 330 172 C300 160 280 162 258 170 Z';
const RA = 'M142 104 C104 108 80 148 82 196 C84 232 102 252 126 262 C154 244 172 204 178 162 C178 128 162 106 142 104 Z';
const RA_FLAP = 'M150 122 C168 98 204 104 210 128 C202 146 178 152 160 148 Z';
const LA_FLAP = 'M302 170 C314 140 352 134 366 158 C364 178 338 186 312 182 Z';

const AORTA = 'M212 182 C200 130 202 82 236 52 C270 24 320 30 344 66 C356 88 352 120 344 150';
const AORTA_BRANCHES = [
	{d: 'M236 52 C232 30 228 12 224 -16', w: 20},
	{d: 'M264 38 C264 20 264 4 264 -18', w: 15},
	{d: 'M294 40 C300 22 306 6 310 -14', w: 16},
];
const PULM_TRUNK = 'M236 190 C234 166 242 146 260 134 C280 124 302 126 322 136';
const PULM_RIGHT = 'M262 126 C236 118 202 118 170 126';
const SVC = 'M130 108 C130 70 132 30 134 -14';
const IVC = 'M128 190 C130 230 134 262 138 300';

const CORONARIES = [
	'M252 184 C244 252 262 334 268 424', // interventriculaire antérieure
	'M255 250 C280 262 300 280 320 302',
	'M262 322 C285 334 305 352 322 374',
	'M200 188 C160 206 128 238 126 290 C126 330 150 370 190 396', // coronaire droite
	'M128 272 C150 300 170 330 188 352',
	'M262 174 C290 168 322 172 350 200', // circonflexe
];
const CARDIAC_VEINS = ['M270 182 C258 256 274 334 282 414', 'M232 300 C214 330 206 360 210 392'];

// fibres du myocarde (texture discrète)
const FIBERS = Array.from({length: 14}, (_, i) => {
	const y = 190 + i * 17;
	return `M${100 + i * 4} ${y} C${170 + i * 3} ${y + 30 - i} ${270 - i * 2} ${y + 34} ${370 - i * 6} ${y - 6 + i * 2}`;
});

/** transformation autour d'un point (repère local) */
const about = (ox: number, oy: number, t: string) => `translate(${ox} ${oy}) ${t} translate(${-ox} ${-oy})`;

export const Tube: React.FC<{d: string; w: number; color: string; outline?: string; hi?: number; soft?: string}> = ({
	d,
	w,
	color,
	outline = LPI.navy,
	hi = 0.55,
	soft,
}) => (
	<g fill="none" strokeLinecap="round" strokeLinejoin="round">
		<path d={d} stroke={outline} strokeWidth={w + 6} />
		<path d={d} stroke={color} strokeWidth={w} />
		<g filter={soft ? `url(#${soft})` : undefined}>
			<path d={d} stroke={alpha(LPI.navy, 0.26)} strokeWidth={w * 0.5} transform={`translate(${w * 0.2} ${w * 0.08})`} />
			<path d={d} stroke={alpha(LPI.paper, hi)} strokeWidth={w * 0.28} transform={`translate(${-w * 0.2} ${-w * 0.05})`} />
		</g>
	</g>
);

export const Heart: React.FC<{
	/** contraction des ventricules 0 → 1 (systole) */
	contract: number;
	/** contraction des oreillettes 0 → 1 */
	atria?: number;
	/** préfixe unique des ids SVG */
	id: string;
	/** dessiner les gros vaisseaux au-dessus du cœur */
	vessels?: boolean;
}> = ({contract, atria = 0, id, vessels = true}) => {
	const c = contract;
	const sv = about(240, 180, `scale(${1 - 0.055 * c} ${1 - 0.085 * c}) rotate(${-2.2 * c})`);
	const sa1 = about(130, 150, `scale(${1 - 0.09 * atria})`);
	const sa2 = about(330, 165, `scale(${1 - 0.09 * atria})`);
	return (
		<g>
			<defs>
				<radialGradient id={`${id}-shine`} cx="0.36" cy="0.3" r="0.55">
					<stop offset="0" stopColor={LPI.paper} stopOpacity="0.75" />
					<stop offset="0.55" stopColor={LPI.paper} stopOpacity="0.12" />
					<stop offset="1" stopColor={LPI.paper} stopOpacity="0" />
				</radialGradient>
				<radialGradient id={`${id}-shade`} cx="0.42" cy="0.36" r="0.7">
					<stop offset="0.45" stopColor={LPI.navy} stopOpacity="0" />
					<stop offset="1" stopColor={LPI.navy} stopOpacity="0.42" />
				</radialGradient>
				<filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="2.2" />
				</filter>
				<filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
				<clipPath id={`${id}-v`}>
					<path d={VENTRICLES} />
				</clipPath>
			</defs>
			{vessels ? (
				<>
					<Tube soft={`${id}-soft`} d={IVC} w={34} color={LPI.blue} />
					<Tube soft={`${id}-soft`} d={PULM_RIGHT} w={26} color={LPI.blue} />
					<Tube soft={`${id}-soft`} d={SVC} w={36} color={LPI.blue} />
				</>
			) : null}
			{/* oreillettes */}
			<g transform={sa1}>
				<path d={RA} fill={LPI.pink} stroke={LPI.navy} strokeWidth={4.5} />
				<path d={RA} fill={`url(#${id}-shade)`} />
				<path d={RA} fill={`url(#${id}-shine)`} />
			</g>
			<g transform={sa2}>
				<path d={LA_FLAP} fill={LPI.pink} stroke={LPI.navy} strokeWidth={4} />
				<path d={LA_FLAP} fill={`url(#${id}-shade)`} />
			</g>
			{/* ventricules */}
			<g transform={sv}>
				<path d={VENTRICLES} fill={LPI.pink} />
				<g clipPath={`url(#${id}-v)`}>
					<path d={LV} fill={alpha(LPI.navy, 0.1)} />
					{FIBERS.map((d, i) => (
						<path key={i} d={d} fill="none" stroke={alpha(LPI.navy, 0.07)} strokeWidth={3} />
					))}
					<path d={VENTRICLES} fill={`url(#${id}-shade)`} />
					<path d={VENTRICLES} fill={`url(#${id}-shine)`} />
					<ellipse cx="190" cy="250" rx="46" ry="70" fill={alpha(LPI.paper, 0.35)} filter={`url(#${id}-blur)`} transform="rotate(28 190 250)" />
					<path d="M300 300 C330 330 330 380 290 420 L380 440 L390 280 Z" fill={alpha(LPI.navy, 0.16)} filter={`url(#${id}-blur)`} />
					{CARDIAC_VEINS.map((d, i) => (
						<Tube soft={`${id}-soft`} key={i} d={d} w={5} color={LPI.blue} outline={alpha(LPI.navy, 0.7)} hi={0.4} />
					))}
					{CORONARIES.map((d, i) => (
						<Tube soft={`${id}-soft`} key={i} d={d} w={i === 0 || i === 3 ? 8 : 5} color={LPI.pink} outline={alpha(LPI.navy, 0.8)} hi={0.7} />
					))}
				</g>
				<path d={VENTRICLES} fill="none" stroke={LPI.navy} strokeWidth={5} />
			</g>
			{vessels ? (
				<>
					{AORTA_BRANCHES.map((b, i) => (
						<Tube soft={`${id}-soft`} key={i} d={b.d} w={b.w} color={LPI.pink} />
					))}
					<Tube soft={`${id}-soft`} d={AORTA} w={46 + 4 * c} color={LPI.pink} hi={0.65} />
					<Tube soft={`${id}-soft`} d={PULM_TRUNK} w={36 + 3 * c} color={LPI.blue} />
					<g transform={sa1}>
						<path d={RA_FLAP} fill={LPI.pink} stroke={LPI.navy} strokeWidth={4} />
						<path d={RA_FLAP} fill={`url(#${id}-shade)`} />
					</g>
				</>
			) : null}
		</g>
	);
};
