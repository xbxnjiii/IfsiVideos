// Insuffisance cardiaque : pèse-personne (écran qui roule), lit où le patient est calé par 0 → 3 oreillers (orthopnée),
// chevilles qui gonflent + signe du godet (le doigt laisse un creux), salière, pile du cœur fatigué, personnage assis
// jambes pendantes (OAP). Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Odometer} from './motion3';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Pèse-personne vu de face (360 × 300) ; `value` en kg (une décimale), `delta` : affiche « + » devant, `alert` : écran rose. */
export const BathScale: React.FC<{value: number; width?: number; delta?: boolean; alert?: number}> = ({value, width = 360, delta = false, alert = 0}) => {
	const k = width / 360;
	return (
		<div style={{position: 'relative', width, height: 300 * k}}>
			<svg width={width} height={300 * k} viewBox="0 0 360 300" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={10} y={20} width={340} height={270} rx={46} fill={LPI.paper} {...SK} />
				<rect x={30} y={40} width={300} height={230} rx={34} fill={alpha(LPI.sky, 0.55)} />
				<rect x={80} y={58} width={200} height={84} rx={16} fill={alert > 0.5 ? LPI.pink : N} />
				{[100, 260].map((x) => (
					<ellipse key={x} cx={x} cy={214} rx={48} ry={34} fill={alpha(LPI.paper, 0.85)} stroke={alpha(N, 0.35)} strokeWidth={5} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 80 * k, top: 58 * k, width: 200 * k, height: 84 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 * k, color: alert > 0.5 ? N : LPI.paper, fontFamily: FONT.title, fontWeight: 900}}>
				{delta ? <span style={{fontSize: 52 * k, lineHeight: 1}}>+</span> : null}
				<Odometer value={value} decimals={1} places={delta ? 1 : 2} size={58 * k} color={alert > 0.5 ? N : LPI.paper} />
				<span style={{fontSize: 30 * k, marginLeft: 4 * k}}>kg</span>
			</div>
		</div>
	);
};

/** Lit vu de côté, patient calé par `pillows` (0 → 3, continu) : plus il y a d'oreillers, plus il est assis. */
export const PropUp: React.FC<{pillows: number; width?: number; distress?: number}> = ({pillows, width = 440, distress = 0}) => {
	const frame = useCurrentFrame();
	const ang = (8 + 22 * Math.min(3, pillows)) * (Math.PI / 180);
	const hip = [210, 150];
	const along = (d: number, off = 0) => [hip[0] - Math.cos(ang) * d - Math.sin(ang) * off, hip[1] - Math.sin(ang) * d + Math.cos(ang) * off];
	const sh = along(110);
	const head = along(150, -6);
	const pil = (i: number) => {
		const k = Math.min(1, Math.max(0, pillows - i));
		const c = along(118 - i * 12, 34 + i * 6);
		return k > 0 ? (
			<ellipse key={i} cx={c[0] - 18 - i * 6} cy={c[1] + 8} rx={46} ry={18} transform={`rotate(${-ang * (180 / Math.PI) * 0.8} ${c[0]} ${c[1]})`} fill={i % 2 ? LPI.paper : LPI.sky} stroke={N} strokeWidth={5} opacity={k} />
		) : null;
	};
	const sweat = distress > 0 ? Math.sin(frame / 3) : 0;
	return (
		<svg width={width} height={(width * 250) / 440} viewBox="0 0 440 250" style={{overflow: 'visible'}}>
			<path d="M40 200 V236 M410 200 V236" stroke={N} strokeWidth={10} strokeLinecap="round" />
			<circle cx={40} cy={240} r={9} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<circle cx={410} cy={240} r={9} fill={LPI.sky} stroke={N} strokeWidth={5} />
			<rect x={20} y={176} width={410} height={26} rx={10} fill={N} />
			<rect x={30} y={150} width={392} height={30} rx={12} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={14} y={60} width={22} height={140} rx={8} fill={LPI.blue} stroke={N} strokeWidth={5} />
			{[0, 1, 2].map(pil)}
			{/* jambes sur le matelas, buste sur les oreillers, tête */}
			<path d={`M${hip[0]} ${hip[1] - 10} L400 ${hip[1] - 10}`} stroke={N} strokeWidth={40} strokeLinecap="round" />
			<path d={`M${hip[0]} ${hip[1] - 10} L400 ${hip[1] - 10}`} stroke={LPI.blue} strokeWidth={28} strokeLinecap="round" />
			<path d={`M${hip[0]} ${hip[1] - 14} L${sh[0]} ${sh[1]}`} stroke={N} strokeWidth={52} strokeLinecap="round" />
			<path d={`M${hip[0]} ${hip[1] - 14} L${sh[0]} ${sh[1]}`} stroke={LPI.blue} strokeWidth={40} strokeLinecap="round" />
			<circle cx={head[0]} cy={head[1]} r={27} fill={LPI.paper} stroke={N} strokeWidth={7} />
			<circle cx={head[0]} cy={head[1]} r={27} fill={LPI.pink} opacity={0.3 + 0.3 * distress} />
			{distress > 0 ? (
				<g opacity={distress}>
					<path d={`M${head[0] + 30} ${head[1] - 24} q8 -10 0 -20 M${head[0] + 42} ${head[1] - 10} q8 -10 0 -20`} fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" transform={`translate(0 ${sweat * 2})`} />
				</g>
			) : null}
		</svg>
	);
};

/** Deux bas de jambes vus de face (440 × 360) : `swell` gonfle les chevilles ; `press` : un pouce appuie sur la cheville
 * gauche ; `dent` : le creux qu'il laisse (signe du godet), qui se remplit lentement. */
export const Ankles: React.FC<{swell: number; press?: number; dent?: number; width?: number}> = ({swell, press = 0, dent = 0, width = 440}) => {
	const leg = (cx: number) => {
		const w = 46 + 24 * swell;
		return (
			<g key={cx}>
				<path
					d={`M${cx - 52} 10 C${cx - 56} 120 ${cx - w} 190 ${cx - w} 240 C${cx - w} 266 ${cx - 40} 280 ${cx - 40} 296 L${cx + 40} 296 C${cx + 40} 280 ${cx + w} 266 ${cx + w} 240 C${cx + w} 190 ${cx + 56} 120 ${cx + 52} 10 Z`}
					fill={LPI.paper}
					{...SK}
				/>
				<path
					d={`M${cx - 52} 10 C${cx - 56} 120 ${cx - w} 190 ${cx - w} 240 C${cx - w} 266 ${cx - 40} 280 ${cx - 40} 296 L${cx + 40} 296 C${cx + 40} 280 ${cx + w} 266 ${cx + w} 240 C${cx + w} 190 ${cx + 56} 120 ${cx + 52} 10 Z`}
					fill={alpha(LPI.pink, 0.25 + 0.15 * swell)}
				/>
				<path d={`M${cx - 44} 296 Q${cx - 50} 340 ${cx - 10} 344 H${cx + 66} Q${cx + 86} 340 ${cx + 70} 316 L${cx + 40} 296 Z`} fill={LPI.blue} {...SK} />
				{swell > 0.2 ? <path d={`M${cx - w + 8} 222 Q${cx} ${236 + 10 * swell} ${cx + w - 8} 222`} fill="none" stroke={alpha(N, 0.35)} strokeWidth={4} /> : null}
			</g>
		);
	};
	return (
		<svg width={width} height={(width * 360) / 440} viewBox="0 0 440 360" style={{overflow: 'visible'}}>
			{leg(120)}
			{leg(320)}
			{dent > 0 ? <ellipse cx={120 - 30} cy={236} rx={16} ry={11} fill={alpha(N, 0.35 * dent)} stroke={alpha(N, 0.5 * dent)} strokeWidth={3} /> : null}
			{press > 0 ? (
				<g transform={`translate(${-80 + 70 * press - 120 * Math.max(0, press - 1)} 0)`} opacity={Math.min(1, press * 2)}>
					<path d="M-60 210 H50 Q78 210 80 236 Q78 262 50 262 H-60 Z" fill={LPI.paper} {...SK} strokeWidth={6} />
					<path d="M-60 210 H50 Q78 210 80 236 Q78 262 50 262 H-60 Z" fill={alpha(LPI.pink, 0.3)} />
					<path d="M44 222 Q62 222 64 236 Q62 250 44 250" fill="none" stroke={alpha(N, 0.5)} strokeWidth={4} />
				</g>
			) : null}
		</svg>
	);
};

/** Salière « SEL » (140 × 220) ; `shake` 0 → 1 : grains qui tombent. */
export const SaltShaker: React.FC<{width?: number; shake?: number}> = ({width = 140, shake = 0}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 220) / 140} viewBox="0 0 140 220" style={{overflow: 'visible'}}>
			<path d="M34 40 Q34 14 70 14 Q106 14 106 40 Z" fill={LPI.sky} {...SK} />
			{[56, 70, 84].map((x) => (
				<circle key={x} cx={x} cy={28} r={3} fill={N} />
			))}
			<path d="M30 46 H110 L118 200 Q118 212 106 212 H34 Q22 212 22 200 Z" fill={LPI.paper} {...SK} />
			<text x={70} y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
				SEL
			</text>
			{shake > 0
				? Array.from({length: 8}, (_, i) => {
						const t = ((frame * 2 + i * 7) % 40) / 40;
						return <rect key={i} x={54 + (i % 4) * 9} y={-6 - t * 50} width={5} height={5} fill={N} opacity={shake * (1 - t)} transform="scale(1 -1) translate(0 0)" />;
					})
				: null}
		</svg>
	);
};

/** Pile « énergie du cœur » (110 × 60) : `level` 0 → 1 ; rose quand elle est presque vide. */
export const Battery: React.FC<{level: number; width?: number}> = ({level, width = 110}) => {
	const frame = useCurrentFrame();
	const low = level < 0.3;
	const blink = low ? 0.55 + 0.45 * Math.round(0.5 + 0.5 * Math.cos(frame / 4)) : 1;
	return (
		<svg width={width} height={(width * 60) / 110} viewBox="0 0 110 60" style={{overflow: 'visible'}}>
			<rect x={4} y={6} width={92} height={48} rx={10} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={96} y={20} width={10} height={20} rx={3} fill={N} />
			<rect x={12} y={14} width={76 * Math.max(0.04, level)} height={32} rx={5} fill={low ? LPI.pink : LPI.blue} opacity={blink} />
		</svg>
	);
};

/** Personnage assis au bord du lit, jambes pendantes (220 × 260) : position de l'OAP. */
export const SitLegsDown: React.FC<{width?: number}> = ({width = 220}) => (
	<svg width={width} height={(width * 260) / 220} viewBox="0 0 220 260" style={{overflow: 'visible'}}>
		<rect x={10} y={150} width={140} height={26} rx={10} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<rect x={4} y={174} width={152} height={18} rx={8} fill={N} />
		<path d="M30 192 V250 M140 192 V250" stroke={N} strokeWidth={9} strokeLinecap="round" />
		{/* buste droit, cuisses sur le lit, jambes qui pendent */}
		<path d="M110 140 L110 60" stroke={N} strokeWidth={50} strokeLinecap="round" />
		<path d="M110 140 L110 60" stroke={LPI.blue} strokeWidth={38} strokeLinecap="round" />
		<path d="M110 140 L164 140 L168 230" fill="none" stroke={N} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M110 140 L164 140 L168 230" fill="none" stroke={LPI.blue} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M160 236 H198" stroke={N} strokeWidth={18} strokeLinecap="round" />
		<circle cx={110} cy={28} r={26} fill={LPI.paper} stroke={N} strokeWidth={7} />
		<circle cx={110} cy={28} r={26} fill={LPI.pink} opacity={0.3} />
	</svg>
);

/** Mousse rosée qui sort de la bouche (bulles), à poser sur la bouche du `Patient` (repère 400 × 560). */
export const Foam: React.FC<{size: number; on: number}> = ({size, on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{Array.from({length: 9}, (_, i) => {
				const t = ((frame + i * 6) % 36) / 36;
				const x = 200 + (i - 4) * 7 + Math.sin(frame / 5 + i) * 3;
				const y = 158 + t * 26;
				return <circle key={i} cx={x} cy={y} r={(4 + (i % 3) * 2) * interpolate(t, [0, 0.2, 1], [0.4, 1, 0.8], clamp)} fill={i % 2 ? LPI.pink : LPI.paper} stroke={N} strokeWidth={2} opacity={on * (1 - t * 0.6)} />;
			})}
		</svg>
	);
};
