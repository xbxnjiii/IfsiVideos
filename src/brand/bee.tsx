// « Piqûre d'abeille » : abeille et guêpe vues de dessus (ailes qui battent), main posée à plat vue de dessus (rendu
// soigné : peau opaque en dégradé, ombre douce, ongles, plis), nappe de pique-nique, dard planté dans la peau avec sa
// poche de venin qui pulse (pincée : le venin se répand), carte qui gratte, bouts de doigts qui pincent, glaçon dans un
// linge, papule (gonflement rose). Couleurs de la marque uniquement (l'abeille est rayée rose et bleu nuit).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

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
const VENOM = mix(LPI.pink, N, 0.15);

/** Capsule (doigt, poignet…) : contour fin + remplissage, entre deux points. */
const Capsule: React.FC<{x1: number; y1: number; x2: number; y2: number; w: number; fill?: string}> = ({x1, y1, x2, y2, w, fill = SKIN_MID}) => (
	<>
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha(N, 0.72)} strokeWidth={w + 8} strokeLinecap="round" />
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth={w} strokeLinecap="round" />
	</>
);

/**
 * Abeille vue de dessus, tête vers +x (longueur ≈ 150 à `s` = 1) : ailes qui battent si `fly` > 0, abdomen rayé, dard.
 * `wasp` : guêpe (taille fine, abdomen pointu, rayures bleues).
 */
export const BeeG: React.FC<{x: number; y: number; s?: number; ang?: number; fly?: number; wasp?: boolean}> = ({x, y, s = 1, ang = 0, fly = 1, wasp = false}) => {
	const frame = useCurrentFrame();
	const flap = fly > 0 ? Math.sin(frame * 2.6) * 26 * fly : 0;
	const stripe = wasp ? LPI.sky : mix(LPI.pink, LPI.paper, 0.15);
	return (
		<g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
			<ellipse cx={-8} cy={12} rx={70} ry={30} fill={alpha(N, 0.18)} />
			{/* pattes */}
			{[-1, 1].map((sd) =>
				[0, 1, 2].map((i) => <path key={`${sd}${i}`} d={`M${20 - i * 16} ${sd * 14} l${-6 - i * 4} ${sd * 22} l${-8} ${sd * 8}`} fill="none" stroke={N} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />),
			)}
			{/* abdomen rayé + dard */}
			<path d={wasp ? 'M-14 0 L-86 0 L-96 0' : 'M-60 0 L-82 0'} stroke={N} strokeWidth={4} strokeLinecap="round" />
			{wasp ? (
				<path d="M-6 0 C-12 -24 -50 -26 -70 -10 C-82 0 -82 0 -70 10 C-50 26 -12 24 -6 0 Z" fill={stripe} {...LINE} strokeWidth={3} />
			) : (
				<ellipse cx={-30} cy={0} rx={36} ry={27} fill={stripe} {...LINE} strokeWidth={3} />
			)}
			{(wasp ? [-28, -46, -62] : [-14, -32, -50]).map((sx, i) => (
				<path key={i} d={`M${sx} ${wasp ? -16 + i * 4 : -24 + Math.abs(i - 1) * 4} Q${sx - 8} 0 ${sx} ${wasp ? 16 - i * 4 : 24 - Math.abs(i - 1) * 4}`} stroke={N} strokeWidth={wasp ? 7 : 9} fill="none" strokeLinecap="round" />
			))}
			{/* thorax velu */}
			<circle cx={10} cy={0} r={wasp ? 15 : 20} fill={mix(N, LPI.blue, 0.3)} {...LINE} strokeWidth={3} />
			{!wasp ? [0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={10 + Math.cos(i) * 13} cy={Math.sin(i * 1.7) * 12} r={3} fill={alpha(LPI.paper, 0.35)} />) : null}
			{/* tête, yeux, antennes */}
			<circle cx={34} cy={0} r={13} fill={N} />
			<ellipse cx={38} cy={-8} rx={6} ry={5} fill={alpha(LPI.sky, 0.8)} />
			<ellipse cx={38} cy={8} rx={6} ry={5} fill={alpha(LPI.sky, 0.8)} />
			<path d="M44 -5 q12 -6 18 -16 M44 5 q12 6 18 16" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" />
			{/* ailes */}
			{[-1, 1].map((sd) => (
				<g key={sd} transform={`rotate(${sd * (-20 + flap)} 8 ${sd * 8})`}>
					<ellipse cx={-14} cy={sd * 34} rx={38} ry={16} fill={alpha(LPI.paper, 0.75)} stroke={alpha(N, 0.55)} strokeWidth={2.5} />
					<ellipse cx={-6} cy={sd * 20} rx={22} ry={10} fill={alpha(LPI.paper, 0.6)} stroke={alpha(N, 0.45)} strokeWidth={2} />
				</g>
			))}
		</g>
	);
};

/** Repère 1000 × 1000 de la main posée à plat : point de la piqûre (dos de la main). */
export const HAND = {sting: {x: 520, y: 640}};

/** Main droite posée à plat, vue de dessus (dos de la main, doigts vers le haut, repère 1000 × 1000, le poignet sort en bas). */
export const HandTopG: React.FC<{children?: React.ReactNode}> = ({children}) => {
	const id = React.useId().replace(/:/g, '');
	const fingers = [
		{x1: 400, y1: 540, x2: 370, y2: 160, w: 92},
		{x1: 490, y1: 520, x2: 488, y2: 110, w: 96},
		{x1: 580, y1: 530, x2: 604, y2: 150, w: 90},
		{x1: 662, y1: 570, x2: 712, y2: 270, w: 76},
	];
	return (
		<g>
			<defs>
				<filter id={`hb${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="16" />
				</filter>
				<linearGradient id={`hp${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={SKIN_HI} />
					<stop offset="0.6" stopColor={SKIN_MID} />
					<stop offset="1" stopColor={SKIN_LO} />
				</linearGradient>
			</defs>
			{/* ombre douce sur la nappe */}
			<g transform="translate(22 26)" filter={`url(#hb${id})`} opacity={0.28}>
				<path d="M330 560 C330 500 700 500 720 580 L700 900 L700 1200 L360 1200 L350 900 Z" fill={N} />
				{fingers.map((f, i) => (
					<line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke={N} strokeWidth={f.w} strokeLinecap="round" />
				))}
				<line x1={350} y1={760} x2={190} y2={520} stroke={N} strokeWidth={100} strokeLinecap="round" />
			</g>
			{/* pouce */}
			<Capsule x1={360} y1={770} x2={196} y2={524} w={98} />
			<ellipse cx={204} cy={538} rx={30} ry={22} transform="rotate(-56 204 538)" fill={mix(LPI.paper, LPI.pink, 0.12)} stroke={alpha(N, 0.45)} strokeWidth={2.5} />
			{/* doigts */}
			{fingers.map((f, i) => (
				<Capsule key={i} {...f} />
			))}
			{/* paume (dos de la main) + poignet */}
			<path d="M328 560 C330 500 420 470 520 470 C620 470 712 500 716 580 C722 680 712 800 690 880 L700 1200 L362 1200 L350 880 C330 800 324 680 328 560 Z" fill={`url(#hp${id})`} {...LINE} />
			{/* ongles + plis des articulations */}
			{fingers.map((f, i) => {
				const dx = f.x2 - f.x1;
				const dy = f.y2 - f.y1;
				const L = Math.hypot(dx, dy);
				const ux = dx / L;
				const uy = dy / L;
				const a = (Math.atan2(dy, dx) * 180) / Math.PI;
				return (
					<g key={i}>
						<ellipse cx={f.x2 - ux * 24} cy={f.y2 - uy * 24} rx={30} ry={f.w * 0.3} transform={`rotate(${a} ${f.x2 - ux * 24} ${f.y2 - uy * 24})`} fill={mix(LPI.paper, LPI.pink, 0.12)} stroke={alpha(N, 0.45)} strokeWidth={2.5} />
						{[0.38, 0.66].map((t) => (
							<path key={t} d={`M${f.x1 + dx * t - uy * f.w * 0.22} ${f.y1 + dy * t + ux * f.w * 0.22} q${ux * 6} ${uy * 6} ${uy * f.w * 0.44} ${-ux * f.w * 0.44}`} fill="none" stroke={alpha(N, 0.3)} strokeWidth={3} strokeLinecap="round" />
						))}
					</g>
				);
			})}
			<path d="M372 600 C420 560 520 548 640 580" fill="none" stroke={alpha(LPI.paper, 0.85)} strokeWidth={14} strokeLinecap="round" />
			{/* tendons à peine visibles */}
			{[420, 500, 580].map((x, i) => (
				<path key={i} d={`M${x} 600 L${x + (i - 1) * 14} 840`} stroke={alpha(N, 0.08)} strokeWidth={8} strokeLinecap="round" />
			))}
			{children}
		</g>
	);
};

/**
 * Dard planté dans la peau, vu de dessus (repère de la peau, point d'entrée en `x`, `y`, taille `s`) : tige barbelée en
 * biais, poche de venin au bout qui pulse. `squeeze` 0 → 1 : la poche écrasée ; `out` 0 → 1 : le dard est poussé de côté
 * et sort (on gratte vers +x) ; `hide` : seul le petit point reste.
 */
export const StingerG: React.FC<{x: number; y: number; s?: number; squeeze?: number; out?: number}> = ({x, y, s = 1, squeeze = 0, out = 0}) => {
	const frame = useCurrentFrame();
	const sq = cl(squeeze);
	const o = cl(out);
	const pump = 1 + 0.08 * Math.sin(frame / 4) * (1 - sq);
	return (
		<g>
			{/* petit point rose de la piqûre */}
			<circle cx={x} cy={y} r={7 * s} fill={alpha(VENOM, 0.9)} />
			<g transform={`translate(${x + o * 260 * s} ${y - o * 40 * s}) rotate(${o * 50}) scale(${s})`} opacity={1 - cl((o - 0.6) / 0.4)}>
				<ellipse cx={18} cy={-24} rx={26} ry={9} fill={alpha(N, 0.15)} transform="rotate(-54 18 -24)" />
				{/* tige barbelée, courte et fine, plantée en biais */}
				<path d="M0 0 L22 -30" stroke={N} strokeWidth={4.5} strokeLinecap="round" />
				{[0.3, 0.55, 0.8].map((t) => (
					<path key={t} d={`M${22 * t} ${-30 * t} l-6 -1 M${22 * t} ${-30 * t} l2 6`} stroke={N} strokeWidth={2.2} strokeLinecap="round" />
				))}
				{/* poche de venin en goutte, arrachée à l'abeille (petits filaments) */}
				<g transform={`translate(30 -40) rotate(-54) scale(${(1 + 0.45 * sq) * pump} ${(1 - 0.55 * sq) * pump})`}>
					<path d="M-10 0 C-4 -12 10 -16 22 -12 C34 -8 36 8 24 13 C12 18 -2 12 -10 0 Z" fill={alpha(mix(LPI.pink, LPI.paper, 0.3), 0.92)} stroke={N} strokeWidth={3} />
					<ellipse cx={14} cy={0} rx={8} ry={6} fill={alpha(VENOM, 0.7)} />
					<ellipse cx={10} cy={-7} rx={6} ry={2.5} fill={alpha(LPI.paper, 0.85)} />
					<path d="M34 -4 q8 -4 12 -12 M34 4 q10 2 14 10 M30 10 q4 8 2 14" fill="none" stroke={alpha(N, 0.55)} strokeWidth={2} strokeLinecap="round" />
				</g>
			</g>
		</g>
	);
};

/** Venin qui se répand dans la peau autour de (x, y) : petits points roses qui s'éloignent (`spread` 0 → 1). */
export const VenomSpread: React.FC<{x: number; y: number; spread: number; r?: number}> = ({x, y, spread, r = 160}) => {
	if (spread <= 0) return null;
	return (
		<g>
			<circle cx={x} cy={y} r={r * (0.3 + 0.7 * spread)} fill={alpha(LPI.pink, 0.25 * spread)} />
			{Array.from({length: 14}, (_, i) => {
				const a = (i / 14) * Math.PI * 2 + 0.4;
				const d = (24 + r * spread * (0.6 + 0.4 * ((i * 5) % 3) / 2)) * 1;
				return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={6 + (i % 3) * 2} fill={alpha(VENOM, 0.8 * (1 - spread * 0.4))} />;
			})}
		</g>
	);
};

/** Papule : gonflement rose surélevé autour de (x, y) (`k` 0 → 1). */
export const WhealG: React.FC<{x: number; y: number; k: number; r?: number}> = ({x, y, k, r = 220}) => {
	const id = React.useId().replace(/:/g, '');
	if (k <= 0) return null;
	return (
		<g>
			<defs>
				<radialGradient id={`wh${id}`}>
					<stop offset="0" stopColor={alpha(LPI.pink, 0.75 * k)} />
					<stop offset="0.55" stopColor={alpha(LPI.pink, 0.45 * k)} />
					<stop offset="1" stopColor={alpha(LPI.pink, 0)} />
				</radialGradient>
			</defs>
			<circle cx={x} cy={y} r={r * (0.4 + 0.6 * k)} fill={`url(#wh${id})`} />
			<ellipse cx={x - r * 0.18} cy={y - r * 0.2} rx={r * 0.25 * k} ry={r * 0.1 * k} fill={alpha(LPI.paper, 0.45)} />
		</g>
	);
};

/** Carte (type carte bancaire) vue de dessus, bord gauche en (`x`, `y` = milieu du bord), largeur `w`. */
export const CardG: React.FC<{x: number; y: number; w?: number; ang?: number}> = ({x, y, w = 520, ang = 0}) => {
	const h = w * 0.63;
	return (
		<g transform={`translate(${x} ${y}) rotate(${ang})`}>
			<rect x={10} y={-h / 2 + 14} width={w} height={h} rx={28} fill={alpha(N, 0.2)} />
			<rect x={0} y={-h / 2} width={w} height={h} rx={28} fill={LPI.blue} {...LINE} />
			<rect x={0} y={-h / 2 + h * 0.18} width={w} height={h * 0.16} fill={mix(LPI.blue, N, 0.45)} />
			<rect x={w * 0.12} y={h * 0.02} width={w * 0.16} height={h * 0.2} rx={8} fill={LPI.sky} stroke={alpha(N, 0.6)} strokeWidth={3} />
			<path d={`M${w * 0.12} ${h * 0.12} h${w * 0.16} M${w * 0.2} ${h * 0.02} v${h * 0.2}`} stroke={alpha(N, 0.4)} strokeWidth={2} />
			{[0, 1, 2, 3].map((i) => (
				<rect key={i} x={w * 0.12 + i * w * 0.18} y={h * 0.3} width={w * 0.14} height={h * 0.06} rx={6} fill={alpha(LPI.paper, 0.6)} />
			))}
			<line x1={6} y1={-h / 2 + 18} x2={6} y2={h / 2 - 18} stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} strokeLinecap="round" />
		</g>
	);
};

/** Deux bouts de doigts (pouce + index) qui descendent pincer en (`x`, `y`) ; `gap` écart entre les deux (0 = serrés). */
export const PinchTipsG: React.FC<{x: number; y: number; gap?: number; s?: number}> = ({x, y, gap = 60, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<g transform={`translate(${-gap / 2 - 40} 0) rotate(-18)`}>
			<Capsule x1={0} y1={-420} x2={0} y2={-40} w={84} />
			<ellipse cx={0} cy={-74} rx={28} ry={34} fill={mix(LPI.paper, LPI.pink, 0.12)} stroke={alpha(N, 0.45)} strokeWidth={2.5} />
		</g>
		<g transform={`translate(${gap / 2 + 40} 0) rotate(18)`}>
			<Capsule x1={0} y1={-420} x2={0} y2={-40} w={84} />
			<ellipse cx={0} cy={-74} rx={28} ry={34} fill={mix(LPI.paper, LPI.pink, 0.12)} stroke={alpha(N, 0.45)} strokeWidth={2.5} />
		</g>
	</g>
);

/** Glaçon enveloppé dans un linge (repère 300 × 220), petits flocons de froid. */
export const IceCloth: React.FC<{width?: number}> = ({width = 220}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 220) / 300} viewBox="0 0 300 220" style={{overflow: 'visible'}}>
			<path d="M40 70 C80 40 220 40 262 72 C290 120 270 182 220 196 C160 210 90 206 54 186 C20 160 18 100 40 70 Z" fill={LPI.paper} {...LINE} />
			{[0, 1, 2, 3].map((i) => (
				<path key={i} d={`M${70 + i * 46} 64 L${60 + i * 46} 196`} stroke={alpha(LPI.sky, 0.9)} strokeWidth={10} />
			))}
			<path d="M60 110 C120 130 190 128 250 104" fill="none" stroke={alpha(N, 0.3)} strokeWidth={4} />
			<rect x={176} y={22} width={70} height={64} rx={12} transform="rotate(14 211 54)" fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={4} />
			<path d="M190 36 l24 4" stroke={alpha(LPI.paper, 0.9)} strokeWidth={6} strokeLinecap="round" transform="rotate(14 211 54)" />
			{[0, 1, 2].map((i) => {
				const t = (frame / 40 + i / 3) % 1;
				return (
					<g key={i} transform={`translate(${30 + i * 110} ${20 - t * 30})`} opacity={1 - t}>
						<path d="M0 -10 V10 M-9 -5 L9 5 M-9 5 L9 -5" stroke={LPI.blue} strokeWidth={3.5} strokeLinecap="round" />
					</g>
				);
			})}
		</svg>
	);
};

/** Nappe de pique-nique vue de dessus (vichy rose), assiette, verre de jus, lumière de soleil. */
export const PicnicBg: React.FC = () => {
	const frame = useCurrentFrame();
	const S = 120;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<rect width={1080} height={1920} fill={LPI.paper} />
			{Array.from({length: Math.ceil(1080 / S) + 1}, (_, i) => (
				<rect key={`c${i}`} x={i * S} y={0} width={S / 2} height={1920} fill={alpha(LPI.pink, 0.28)} />
			))}
			{Array.from({length: Math.ceil(1920 / S) + 1}, (_, i) => (
				<rect key={`r${i}`} x={0} y={i * S} width={1080} height={S / 2} fill={alpha(LPI.pink, 0.28)} />
			))}
			{/* assiette */}
			<circle cx={190} cy={330} r={170} fill={alpha(N, 0.15)} transform="translate(12 16)" />
			<circle cx={190} cy={330} r={170} fill={LPI.paper} {...LINE} />
			<circle cx={190} cy={330} r={120} fill="none" stroke={alpha(LPI.sky, 0.9)} strokeWidth={6} />
			<path d="M120 300 L260 290 L250 380 L130 390 Z" fill={mix(LPI.paper, LPI.pink, 0.45)} {...LINE} />
			<path d="M128 330 L254 322" stroke={alpha(LPI.blue, 0.6)} strokeWidth={10} strokeLinecap="round" />
			{/* verre de jus */}
			<circle cx={880} cy={300} r={110} fill={alpha(N, 0.15)} transform="translate(12 16)" />
			<circle cx={880} cy={300} r={110} fill={alpha(LPI.sky, 0.5)} {...LINE} />
			<circle cx={880} cy={300} r={88} fill={alpha(LPI.pink, 0.75)} />
			<ellipse cx={850} cy={270} rx={30} ry={14} fill={alpha(LPI.paper, 0.7)} />
			{/* lumière du soleil */}
			<rect width={1080} height={1920} fill={alpha(LPI.paper, 0.12 + 0.03 * Math.sin(frame / 25))} />
		</svg>
	);
};

type IP = {size?: number};
const Ico: React.FC<IP & {children: React.ReactNode}> = ({size = 130, children}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
		{children}
	</svg>
);
/** Visage qui gonfle (lèvres et paupières). */
export const SwellFaceIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<ellipse cx={50} cy={52} rx={36} ry={42} fill={mix(LPI.paper, LPI.pink, 0.35)} stroke={N} strokeWidth={5} />
		<path d="M30 40 q8 -6 14 0 M56 40 q8 -6 14 0" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
		<ellipse cx={50} cy={70} rx={16} ry={9} fill={LPI.pink} stroke={N} strokeWidth={4} />
		<path d="M12 30 l-8 -6 M88 30 l8 -6 M10 60 h-8 M90 60 h8" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
	</Ico>
);
/** Respirer difficilement : poumons + « ! ». */
export const BreathAlertIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M50 14 V40" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<path d="M46 40 C30 30 14 46 14 70 C14 86 30 90 40 82 C46 76 46 60 46 40 Z" fill={LPI.sky} stroke={N} strokeWidth={5} />
		<path d="M54 40 C70 30 86 46 86 70 C86 86 70 90 60 82 C54 76 54 60 54 40 Z" fill={LPI.sky} stroke={N} strokeWidth={5} />
		<circle cx={84} cy={18} r={14} fill={LPI.pink} stroke={N} strokeWidth={4} />
		<text x={84} y={25} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={N}>
			!
		</text>
	</Ico>
);
/** Piqûre dans la bouche : bouche ouverte + petite abeille. */
export const MouthStingIcon: React.FC<IP> = (p) => (
	<Ico {...p}>
		<path d="M14 48 Q50 30 86 48 Q50 92 14 48 Z" fill={mix(N, LPI.pink, 0.35)} stroke={N} strokeWidth={5} />
		<path d="M24 50 Q50 40 76 50" fill="none" stroke={LPI.paper} strokeWidth={7} />
		<ellipse cx={50} cy={66} rx={14} ry={7} fill={LPI.pink} />
		<BeeG x={76} y={20} s={0.22} ang={150} fly={0} />
	</Ico>
);
