// Briques « cancer du rein » (vidéo n° 56). Mise en situation réaliste (vraies couleurs) : l'écran d'échographie (image en
// éventail, grains gris, le rein avec sa capsule claire, la masse qui apparaît sur le pôle supérieur, la mesure). Pictos
// aux couleurs de la marque : dialyse, vivre avec un seul rein, froid / chaleur (destruction des petites tumeurs).
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';

const N = LPI.navy;

/**
 * L'échographe (repère 1080 × 1920, vraies couleurs) : mur de la salle, écran noir avec l'image en éventail, le rein en
 * coupe, `mass` 0 → 1 la boule qui apparaît sur le pôle supérieur, `measure` 0 → 1 la mesure (pointillés + « 3,2 cm »),
 * `probe` la sonde posée sur le support.
 */
export const EchoScreen: React.FC<{mass?: number; measure?: number}> = ({mass = 0, measure = 0}) => {
	const frame = useCurrentFrame();
	const cx = 540;
	const apex = 470;
	const R = 640;
	const fan = `M${cx} ${apex} L${cx + R * Math.sin(-0.72)} ${apex + R * Math.cos(-0.72)} A${R} ${R} 0 0 0 ${cx + R * Math.sin(0.72)} ${apex + R * Math.cos(0.72)} Z`;
	const grains = React.useMemo(
		() =>
			Array.from({length: 900}).map((_, i) => {
				const a = (random(`a${i}`) - 0.5) * 1.42;
				const d = 30 + random(`d${i}`) * (R - 40);
				return {x: cx + d * Math.sin(a), y: apex + d * Math.cos(a), r: 1.2 + random(`r${i}`) * 2.6, o: 0.15 + random(`o${i}`) * 0.45};
			}),
		[],
	);
	const flick = 0.85 + 0.15 * Math.sin(frame / 2.3);
	const kx = 520;
	const ky = 860;
	const mx = 640;
	const my = 760;
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<radialGradient id="ec-kid" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="#D8D8D8" />
					<stop offset="0.35" stopColor="#8E8E8E" />
					<stop offset="0.8" stopColor="#5A5A5A" />
					<stop offset="1" stopColor="#CFCFCF" />
				</radialGradient>
				<radialGradient id="ec-mass" cx="0.45" cy="0.4" r="0.6">
					<stop offset="0" stopColor="#BDBDBD" />
					<stop offset="0.7" stopColor="#8A8A8A" />
					<stop offset="1" stopColor="#E2E2E2" />
				</radialGradient>
				<clipPath id="ec-fan">
					<path d={fan} />
				</clipPath>
				<linearGradient id="ec-wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#DCE6EE" />
					<stop offset="1" stopColor="#C9D5E0" />
				</linearGradient>
			</defs>
			{/* salle : mur, plan de travail */}
			<rect width={1080} height={1920} fill="url(#ec-wall)" />
			<rect y={1480} width={1080} height={440} fill="#B9C3CC" />
			<rect y={1480} width={1080} height={14} fill="#A3AEB8" />
			{/* l'écran */}
			<rect x={60} y={300} width={960} height={1080} rx={34} fill="#2B2F35" />
			<rect x={88} y={330} width={904} height={1000} rx={12} fill="#050607" />
			<rect x={420} y={1380} width={240} height={110} fill="#3A3F46" />
			{/* l'image en éventail */}
			<path d={fan} fill="#151515" />
			<g clipPath="url(#ec-fan)" opacity={flick}>
				{grains.map((g, i) => (
					<circle key={i} cx={g.x} cy={g.y} r={g.r} fill="#FFFFFF" opacity={g.o * 0.35} />
				))}
				{/* paroi au-dessus du rein */}
				<path d={`M${cx - 500} ${apex + 150} Q${cx} ${apex + 230} ${cx + 500} ${apex + 130}`} fill="none" stroke="#9A9A9A" strokeWidth={22} opacity={0.5} />
				{/* le rein : capsule claire, cortex gris, sinus brillant au centre */}
				<g transform={`rotate(-14 ${kx} ${ky})`}>
					<ellipse cx={kx} cy={ky} rx={250} ry={135} fill="url(#ec-kid)" />
					<ellipse cx={kx} cy={ky} rx={250} ry={135} fill="none" stroke="#EDEDED" strokeWidth={7} />
					<ellipse cx={kx + 10} cy={ky + 6} rx={120} ry={45} fill="#E6E6E6" opacity={0.8} />
					{[-150, -80, 80, 150].map((dx, i) => (
						<ellipse key={i} cx={kx + dx} cy={ky + (i % 2 ? 40 : -40)} rx={34} ry={22} fill="#3D3D3D" opacity={0.6} />
					))}
				</g>
				{/* la masse sur le pôle supérieur */}
				{mass > 0 ? (
					<g opacity={mass}>
						<circle cx={mx} cy={my} r={74 * (0.7 + 0.3 * mass)} fill="url(#ec-mass)" />
						<circle cx={mx} cy={my} r={74 * (0.7 + 0.3 * mass)} fill="none" stroke="#F0F0F0" strokeWidth={4} opacity={0.8} />
						{[[-20, -18], [16, 10], [-8, 26], [24, -24]].map(([dx, dy], i) => (
							<circle key={i} cx={mx + dx} cy={my + dy} r={14} fill="#6E6E6E" opacity={0.5} />
						))}
					</g>
				) : null}
			</g>
			{/* mesure */}
			{measure > 0 ? (
				<g opacity={measure}>
					<line x1={mx - 74} y1={my + 4} x2={mx - 74 + 148 * measure} y2={my + 4} stroke="#F2D240" strokeWidth={4} strokeDasharray="10 8" />
					<path d={`M${mx - 74} ${my - 10} l0 28 M${mx + 74} ${my - 10} l0 28`} stroke="#F2D240" strokeWidth={4} opacity={measure > 0.95 ? 1 : 0} />
					<text x={mx + 96} y={my - 60} fill="#F2D240" fontSize={44} fontFamily="Arial" fontWeight={700}>
						3,2 cm
					</text>
				</g>
			) : null}
			{/* inscriptions de l'appareil */}
			<text x={120} y={385} fill="#9FB3C8" fontSize={30} fontFamily="Arial">ABDO · 3,5 MHz</text>
			<text x={760} y={385} fill="#9FB3C8" fontSize={30} fontFamily="Arial">REIN D</text>
			{/* la sonde sur le plan */}
			<g transform="translate(820 1560) rotate(-20)">
				<rect x={-26} y={-120} width={52} height={170} rx={20} fill="#E9ECEF" stroke="#9AA3AD" strokeWidth={4} />
				<path d="M-34 50 Q0 82 34 50 L30 30 L-30 30 Z" fill="#C9CFD6" stroke="#9AA3AD" strokeWidth={4} />
				<path d="M0 -120 Q20 -200 -60 -260" fill="none" stroke="#5E6670" strokeWidth={10} strokeLinecap="round" />
			</g>
			{/* tube de gel */}
			<g transform="translate(200 1560)">
				<rect x={-34} y={-90} width={68} height={150} rx={14} fill="#7FB3E0" stroke="#4F86B8" strokeWidth={4} />
				<rect x={-16} y={-122} width={32} height={34} rx={6} fill="#F2F4F6" stroke="#9AA3AD" strokeWidth={3} />
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ PICTOS (repère 100 × 100, couleurs de la marque) ═══════════════════════════════ */

type IP = {size?: number};
const SW = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
/** Un rein (repère 100 × 100). */
const KidneyShape: React.FC<{x?: number; fill?: string; s?: number}> = ({x = 50, fill = LPI.pink, s = 1}) => (
	<g transform={`translate(${x} 50) scale(${s})`}>
		<path d="M-6 -36 Q-34 -40 -36 -4 Q-38 34 -6 36 Q8 36 6 18 Q2 8 10 4 Q14 0 10 -6 Q2 -10 6 -20 Q8 -36 -6 -36 Z" fill={fill} {...SW} />
	</g>
);

/** La dialyse : le rein et la machine (tuyaux). */
export const DialysisIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<KidneyShape x={30} s={0.8} />
		<rect x={58} y={22} width={34} height={56} rx={6} fill={LPI.sky} {...SW} />
		<circle cx={75} cy={40} r={8} fill={LPI.paper} {...SW} strokeWidth={3} />
		<path d="M36 40 Q48 30 58 34 M36 60 Q48 70 58 66" fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
	</svg>
);

/** On vit très bien avec un seul rein : un rein + une coche. */
export const OneKidneyIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<KidneyShape x={38} />
		<circle cx={74} cy={70} r={18} fill={LPI.blue} {...SW} />
		<path d="M66 70 l6 6 l11 -12" fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/** Détruire une petite tumeur par le froid ou la chaleur : un flocon et une flamme. */
export const ColdHeatIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<g transform="translate(28 50)" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round">
			{[0, 60, 120].map((a) => (
				<line key={a} x1={-20} y1={0} x2={20} y2={0} transform={`rotate(${a})`} />
			))}
		</g>
		<path d="M72 88 Q52 84 56 64 Q60 52 68 44 Q68 58 76 60 Q78 50 76 40 Q96 56 92 74 Q88 88 72 88 Z" fill={LPI.pink} {...SW} />
	</svg>
);

/** Une boule qu'on sent dans le ventre (le flanc) : silhouette et main. */
export const FlankLumpIcon: React.FC<IP> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M30 8 Q22 50 30 92 L70 92 Q78 50 70 8" fill={LPI.paper} {...SW} />
		<circle cx={60} cy={46} r={10} fill={LPI.pink} {...SW} strokeWidth={4} />
		<path d="M84 38 q-10 2 -12 10 q2 8 12 10" fill="none" stroke={alpha(N, 0.8)} strokeWidth={5} strokeLinecap="round" />
	</svg>
);
