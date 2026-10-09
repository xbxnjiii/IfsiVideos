// Illustrations des 14 besoins (Virginia Henderson) et « gags » visuels synchronisés sur le script.
// Style de la marque : trait bleu nuit arrondi, aplats bleu clair / rose / blanc cassé, jamais d'autre couleur.
// viewBox 400 × 400 ; `sw` (épaisseur de trait) grossit pour les petites versions (grilles, badges).
import React, {createContext, useContext} from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {Lungs, Thermometer} from '../../brand/pictos';
import {alpha, FONT, LPI} from '../../brand/theme';

const N = LPI.navy;
const Sw = createContext(10);
/** Petite version d'une illustration (trait épaissi pour rester lisible). */
export const Mini: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
	<Sw.Provider value={size < 140 ? 24 : size < 220 ? 16 : 10}>
		<div style={{width: size, height: size}}>{children}</div>
	</Sw.Provider>
);

type IconProps = {size?: number};
const Svg: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
	<svg width={size} height={size} viewBox="0 0 400 400" style={{overflow: 'visible'}} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);
const ease = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;

/* ─────────────── 1. Respirer ─────────────── */
export const BreathIcon: React.FC<IconProps & {fast?: number}> = ({size = 380}) => {
	const frame = useCurrentFrame();
	const ph = frame / 22;
	const breath = (1 - Math.cos(ph)) / 2;
	return <Lungs breath={breath} inspiring={Math.sin(ph) > 0} q={(ph / Math.PI) % 1} size={size} />;
};

/* ─────────────── 2. Boire et manger ─────────────── */
export const FoodIcon: React.FC<IconProps & {water: number; apple: number}> = ({size = 380, water, apple}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const lvl = 330 - 190 * water;
	const wave = (x: number) => lvl + 6 * Math.sin(x / 18 + frame / 5);
	const pts = Array.from({length: 13}, (_, i) => 60 + i * 12.5).map((x) => `${x},${wave(x)}`).join(' ');
	return (
		<Svg size={size}>
			<defs>
				<clipPath id="glass-in">
					<path d="M72 120 L188 120 L170 332 Q168 340 160 340 L100 340 Q92 340 90 332 Z" />
				</clipPath>
			</defs>
			<g clipPath="url(#glass-in)">
				<polygon points={`${pts} 220,400 40,400`} fill={LPI.sky} />
				{[0, 1, 2].map((k) => {
					const y = lvl + 140 - ((frame * 2.2 + k * 50) % 150);
					return y > lvl + 8 ? <circle key={k} cx={105 + k * 25} cy={y} r={7} fill={LPI.paper} opacity={0.8} /> : null;
				})}
			</g>
			<path d="M72 120 L188 120 L170 332 Q168 340 160 340 L100 340 Q92 340 90 332 Z" fill="none" stroke={N} strokeWidth={sw} />
			<path d="M150 118 L172 40 L200 40" fill="none" stroke={LPI.pink} strokeWidth={sw * 1.2} />
			<g transform={`translate(290 250) scale(${apple}) rotate(${Math.sin(frame / 14) * 5})`}>
				<path
					d="M0 -58 C-26 -78 -86 -66 -86 0 C-86 54 -46 94 -18 86 C-8 82 8 82 18 86 C46 94 86 54 86 0 C86 -66 26 -78 0 -58 Z"
					fill={LPI.pink}
					stroke={N}
					strokeWidth={sw}
				/>
				<path d="M-50 -20 Q-56 10 -40 36" fill="none" stroke={LPI.paper} strokeWidth={sw} opacity={0.8} />
				<path d="M0 -58 Q4 -86 18 -100" fill="none" stroke={N} strokeWidth={sw} />
				<path d="M8 -84 Q36 -112 62 -90 Q38 -66 8 -84 Z" fill={LPI.sky} stroke={N} strokeWidth={sw * 0.8} />
			</g>
		</Svg>
	);
};

/* ─────────────── 3. Éliminer ─────────────── */
export const ToiletIcon: React.FC<IconProps & {flush: number}> = ({size = 380, flush}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const drop = Math.abs(Math.sin(frame / 9)) * 14;
	return (
		<Svg size={size}>
			<rect x="120" y="50" width="160" height="96" rx="20" fill={LPI.paper} stroke={N} strokeWidth={sw} />
			<path d="M244 76 H262" stroke={N} strokeWidth={sw} />
			<path d="M100 168 H300 Q300 262 226 286 L220 342 H180 L174 286 Q100 262 100 168 Z" fill={LPI.paper} stroke={N} strokeWidth={sw} />
			<ellipse cx="200" cy="168" rx="104" ry="26" fill={LPI.sky} stroke={N} strokeWidth={sw} />
			<ellipse cx="200" cy="172" rx="70" ry="13" fill={alpha(LPI.blue, 0.55)} />
			{flush > 0 ? (
				<g transform={`translate(200 172) rotate(${frame * 18}) scale(${1 - 0.5 * flush})`} opacity={1 - flush * 0.6}>
					<path d="M-44 0 A44 10 0 0 1 44 0" fill="none" stroke={LPI.paper} strokeWidth={sw * 0.7} />
				</g>
			) : null}
			<path d="M140 146 L120 168 M260 146 L280 168" stroke={N} strokeWidth={sw * 0.8} />
			<g transform={`translate(330 ${92 - drop})`}>
				<path d="M0 -34 C14 -14 26 0 26 16 A26 26 0 0 1 -26 16 C-26 0 -14 -14 0 -34 Z" fill={LPI.blue} stroke={N} strokeWidth={sw * 0.8} />
				<path d="M-10 14 A12 12 0 0 0 0 26" fill="none" stroke={LPI.paper} strokeWidth={sw * 0.6} />
			</g>
		</Svg>
	);
};

/* ─────────────── 4. Se mouvoir, posture ─────────────── */
export const SpineIcon: React.FC<IconProps & {straight: number; glow: number}> = ({size = 380, straight, glow}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	// mauvaise posture : dos rond (courbe en C) ; bonne posture : courbes naturelles en S
	const n = 10;
	const pts = Array.from({length: n}, (_, i) => {
		const t = i / (n - 1);
		const y = 330 - t * 270;
		const s = 26 * Math.sin(t * Math.PI * 2 - 0.4);
		const c = 70 * Math.sin(t * Math.PI);
		return {x: 200 + straight * s - (1 - straight) * c, y, t};
	});
	return (
		<Svg size={size}>
			{glow > 0 ? <ellipse cx="190" cy="200" rx={80 + 10 * Math.sin(frame / 4)} ry="160" fill={alpha(LPI.pink, 0.5 * glow)} /> : null}
			<path d="M150 336 L250 336 L200 384 Z" fill={LPI.sky} stroke={N} strokeWidth={sw} />
			{pts.map((p, i) => {
				const q = pts[Math.min(n - 1, i + 1)];
				const o = pts[Math.max(0, i - 1)];
				const a = (Math.atan2(q.x - o.x, -(q.y - o.y)) * 180) / Math.PI;
				const w = 74 - p.t * 30;
				return (
					<g key={i} transform={`translate(${p.x} ${p.y}) rotate(${a})`}>
						{i < n - 1 ? <rect x={-w * 0.32} y={-22} width={w * 0.64} height={10} rx={5} fill={LPI.pink} /> : null}
						<rect x={-w / 2} y={-11} width={w} height={22} rx={10} fill={LPI.paper} stroke={N} strokeWidth={sw * 0.75} />
						<path d={`M${w / 2 - 4} 0 H${w / 2 + 14}`} stroke={N} strokeWidth={sw * 0.75} />
					</g>
				);
			})}
		</Svg>
	);
};

/* ─────────────── 5. Dormir ─────────────── */
export const MoonIcon: React.FC<IconProps> = ({size = 380}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const id = `moon-${size}`;
	return (
		<Svg size={size}>
			<defs>
				<mask id={id}>
					<rect width="400" height="400" fill="#fff" />
					<circle cx="252" cy="160" r="100" fill="#000" />
				</mask>
				<clipPath id={`${id}-c`}>
					<circle cx="190" cy="210" r="124" />
				</clipPath>
			</defs>
			<g transform={`rotate(${Math.sin(frame / 30) * 4} 200 200)`}>
				<circle cx="190" cy="210" r="124" fill={LPI.sky} mask={`url(#${id})`} />
				<circle cx="190" cy="210" r="124" fill="none" stroke={N} strokeWidth={sw} mask={`url(#${id})`} />
				<circle cx="252" cy="160" r="100" fill="none" stroke={N} strokeWidth={sw} clipPath={`url(#${id}-c)`} />
				<circle cx="120" cy="250" r="12" fill={alpha(LPI.blue, 0.35)} />
				<circle cx="150" cy="300" r="8" fill={alpha(LPI.blue, 0.35)} />
			</g>
			{[0, 1, 2].map((k) => {
				const t = ((frame + k * 22) % 66) / 66;
				return (
					<text
						key={k}
						x={270 + t * 60 + k * 8}
						y={170 - t * 120}
						fontFamily={FONT.title}
						fontWeight={900}
						fontSize={46 + k * 10}
						fill={LPI.blue}
						opacity={Math.sin(t * Math.PI)}
					>
						Z
					</text>
				);
			})}
			{[
				[330, 300],
				[80, 90],
				[320, 70],
			].map(([x, y], k) => {
				const s = 0.6 + 0.4 * Math.abs(Math.sin(frame / 12 + k * 2));
				return (
					<path
						key={k}
						transform={`translate(${x} ${y}) scale(${s})`}
						d="M0 -22 Q4 -4 22 0 Q4 4 0 22 Q-4 4 -22 0 Q-4 -4 0 -22 Z"
						fill={k === 1 ? LPI.pink : LPI.blue}
					/>
				);
			})}
		</Svg>
	);
};

/* ─────────────── 6. Se vêtir ─────────────── */
export const ShirtIcon: React.FC<IconProps & {stripes?: boolean}> = ({size = 380, stripes = false}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const rot = Math.sin(frame / 16) * 6;
	const shirt = 'M128 150 L72 196 L104 244 L136 222 V350 H264 V222 L296 244 L328 196 L272 150 Q256 186 200 186 Q144 186 128 150 Z';
	return (
		<Svg size={size}>
			<g transform={`rotate(${rot} 200 46)`}>
				<path d="M200 46 C200 20 230 22 228 42 C226 56 210 58 204 68" fill="none" stroke={N} strokeWidth={sw} />
				<path d="M204 70 L96 140 H304 Z" fill="none" stroke={N} strokeWidth={sw} />
				<defs>
					<clipPath id={`shirt-${size}`}>
						<path d={shirt} />
					</clipPath>
				</defs>
				<path d={shirt} fill={stripes ? LPI.paper : LPI.sky} />
				{stripes ? (
					<g clipPath={`url(#shirt-${size})`}>
						{Array.from({length: 9}, (_, i) => (
							<rect key={i} x={60 + i * 32} y="140" width="14" height="220" fill={LPI.sky} />
						))}
					</g>
				) : null}
				<path d={shirt} fill="none" stroke={N} strokeWidth={sw} />
				<path d="M156 162 Q200 214 244 162" fill="none" stroke={LPI.pink} strokeWidth={sw * 1.4} />
				{stripes ? [230, 270, 310].map((y) => <circle key={y} cx="200" cy={y} r={sw * 0.8} fill={N} />) : null}
			</g>
		</Svg>
	);
};

/* ─────────────── 7. Température ─────────────── */
export const TempIcon: React.FC<IconProps & {value: number}> = ({size = 380, value}) => <Thermometer value={value} height={size * 1.05} />;

/* ─────────────── 8. Propre, peau ─────────────── */
export const SoapIcon: React.FC<IconProps & {shine: number}> = ({size = 380, shine}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	return (
		<Svg size={size}>
			<g transform={`translate(200 270) rotate(${-10 + Math.sin(frame / 18) * 3})`}>
				<rect x="-120" y="-62" width="240" height="124" rx="46" fill={LPI.pink} stroke={N} strokeWidth={sw} />
				<path d="M-84 -30 Q-40 -46 10 -40" fill="none" stroke={LPI.paper} strokeWidth={sw} opacity={0.85} />
			</g>
			{Array.from({length: 6}, (_, k) => {
				const t = ((frame * 1.3 + k * 37) % 160) / 160;
				const x = 110 + random(`sx${k}`) * 190 + Math.sin(frame / 10 + k) * 10;
				const y = 210 - t * 190;
				const r = 16 + random(`sr${k}`) * 22;
				return (
					<g key={k} opacity={Math.sin(t * Math.PI)}>
						<circle cx={x} cy={y} r={r} fill={alpha(LPI.paper, 0.75)} stroke={LPI.blue} strokeWidth={sw * 0.5} />
						<path d={`M${x - r * 0.5} ${y - r * 0.2} A${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.1} ${y - r * 0.55}`} fill="none" stroke={LPI.blue} strokeWidth={sw * 0.4} />
					</g>
				);
			})}
			{shine > 0
				? [
						[80, 150],
						[330, 120],
						[320, 330],
					].map(([x, y], k) => (
						<path
							key={k}
							transform={`translate(${x} ${y}) scale(${shine * (0.7 + 0.3 * Math.abs(Math.sin(frame / 7 + k)))})`}
							d="M0 -30 Q5 -5 30 0 Q5 5 0 30 Q-5 5 -30 0 Q-5 -5 0 -30 Z"
							fill={LPI.blue}
						/>
					))
				: null}
		</Svg>
	);
};

/* ─────────────── 9. Éviter les dangers ─────────────── */
export const ShieldIcon: React.FC<IconProps & {check: number}> = ({size = 380, check}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const pulse = (frame % 40) / 40;
	return (
		<Svg size={size}>
			<path d="M200 40 L330 90 V196 Q330 306 200 362 Q70 306 70 196 V90 Z" fill="none" stroke={alpha(LPI.blue, 0.5 * (1 - pulse))} strokeWidth={sw} transform={`translate(200 200) scale(${1 + 0.18 * pulse}) translate(-200 -200)`} />
			<path d="M200 40 L330 90 V196 Q330 306 200 362 Q70 306 70 196 V90 Z" fill={LPI.blue} stroke={N} strokeWidth={sw} />
			<path d="M200 70 L300 108 V196 Q300 284 200 330" fill="none" stroke={alpha(LPI.paper, 0.35)} strokeWidth={sw * 1.4} />
			<path
				d="M140 200 L184 244 L266 160"
				fill="none"
				stroke={LPI.paper}
				strokeWidth={sw * 2.2}
				strokeDasharray="200"
				strokeDashoffset={200 * (1 - check)}
			/>
		</Svg>
	);
};

/* ─────────────── 10. Communiquer ─────────────── */
export const ChatIcon: React.FC<IconProps> = ({size = 380}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const a = Math.floor(frame / 30) % 2 === 0;
	const dots = (cx: number, cy: number, on: boolean) =>
		[0, 1, 2].map((i) => (
			<circle key={i} cx={cx + (i - 1) * 34} cy={cy + (on ? Math.sin(frame / 3 - i) * 6 : 0)} r={sw * 1.1} fill={on ? LPI.paper : alpha(LPI.paper, 0.6)} />
		));
	return (
		<Svg size={size}>
			<g transform={`translate(0 ${a ? -6 : 0})`}>
				<path d="M60 70 H250 Q280 70 280 100 V190 Q280 220 250 220 H130 L84 262 L96 220 H60 Q30 220 30 190 V100 Q30 70 60 70 Z" fill={LPI.blue} stroke={N} strokeWidth={sw} />
				{dots(155, 145, a)}
			</g>
			<g transform={`translate(0 ${a ? 0 : -6})`}>
				<path d="M160 200 H340 Q370 200 370 230 V306 Q370 336 340 336 H316 L326 376 L276 336 H160 Q130 336 130 306 V230 Q130 200 160 200 Z" fill={LPI.pink} stroke={N} strokeWidth={sw} />
				{dots(250, 268, !a)}
			</g>
		</Svg>
	);
};

/* ─────────────── 11. Croyances et valeurs ─────────────── */
export const CompassIcon: React.FC<IconProps & {settleAt?: number}> = ({size = 380, settleAt = 0}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const t = Math.max(0, frame - settleAt);
	const ang = 25 + 70 * Math.exp(-t / 18) * Math.cos(t / 4);
	const L = (x: number, y: number, s: string) => (
		<text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
			{s}
		</text>
	);
	return (
		<Svg size={size}>
			<circle cx="200" cy="200" r="160" fill={LPI.paper} stroke={N} strokeWidth={sw} />
			<circle cx="200" cy="200" r="126" fill={alpha(LPI.sky, 0.7)} />
			{Array.from({length: 12}, (_, i) => {
				const a = (i * Math.PI) / 6;
				return <path key={i} d={`M${200 + 138 * Math.sin(a)} ${200 - 138 * Math.cos(a)} L${200 + 150 * Math.sin(a)} ${200 - 150 * Math.cos(a)}`} stroke={N} strokeWidth={sw * 0.6} />;
			})}
			{L(200, 96, 'N')}
			{L(304, 200, 'E')}
			{L(200, 304, 'S')}
			{L(96, 200, 'O')}
			<g transform={`rotate(${ang} 200 200)`}>
				<path d="M200 90 L226 200 H174 Z" fill={LPI.pink} stroke={N} strokeWidth={sw * 0.7} />
				<path d="M200 310 L226 200 H174 Z" fill={N} />
			</g>
			<circle cx="200" cy="200" r="14" fill={LPI.paper} stroke={N} strokeWidth={sw * 0.7} />
		</Svg>
	);
};

/* ─────────────── 12. S'occuper, se réaliser ─────────────── */
export const TargetIcon: React.FC<IconProps & {hit: number}> = ({size = 380, hit}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const e = ease(hit);
	const ax = interpolate(e, [0, 1], [560, 214]);
	const ay = interpolate(e, [0, 1], [-60, 196]);
	const wob = hit >= 1 ? Math.sin(frame * 1.4) * 6 * Math.exp(-((frame % 1000) / 1000)) : 0;
	return (
		<Svg size={size}>
			{[150, 116, 82, 48, 18].map((r, i) => (
				<circle key={r} cx="200" cy="210" r={r} fill={[LPI.sky, LPI.paper, LPI.blue, LPI.paper, LPI.pink][i]} stroke={N} strokeWidth={i === 0 ? sw : sw * 0.6} />
			))}
			{hit > 0 ? (
				<g transform={`translate(${ax} ${ay}) rotate(${-37 + wob})`}>
					<path d="M0 0 H150" stroke={N} strokeWidth={sw} />
					<path d="M0 0 L22 -12 L22 12 Z" fill={N} stroke={N} strokeWidth={sw * 0.5} />
					<path d="M120 0 L150 -22 L162 -22 L140 0 L162 22 L150 22 Z" fill={LPI.pink} stroke={N} strokeWidth={sw * 0.5} />
				</g>
			) : null}
		</Svg>
	);
};

/* ─────────────── 13. Se récréer ─────────────── */
export const GameIcon: React.FC<IconProps> = ({size = 380}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const note = (k: number) => {
		const t = ((frame + k * 30) % 90) / 90;
		const x = [80, 310, 330][k] + Math.sin(frame / 8 + k) * 10;
		const y = 170 - t * 130;
		return (
			<g key={k} transform={`translate(${x} ${y}) rotate(-12)`} opacity={Math.sin(t * Math.PI)}>
				<ellipse cx="0" cy="0" rx="20" ry="15" fill={k === 1 ? LPI.pink : LPI.blue} />
				<path d="M18 -2 V-62 Q36 -54 40 -36" fill="none" stroke={k === 1 ? LPI.pink : LPI.blue} strokeWidth={sw * 0.8} />
			</g>
		);
	};
	return (
		<Svg size={size}>
			{[0, 1, 2].map(note)}
			<g transform={`translate(0 ${Math.abs(Math.sin(frame / 8)) * -10}) rotate(${Math.sin(frame / 8) * 3} 200 260)`}>
				<path
					d="M120 190 H280 Q350 190 366 280 Q376 344 334 350 Q306 352 286 314 L270 290 H130 L114 314 Q94 352 66 350 Q24 344 34 280 Q50 190 120 190 Z"
					fill={LPI.sky}
					stroke={N}
					strokeWidth={sw}
				/>
				<path d="M100 240 V290 M75 265 H125" stroke={N} strokeWidth={sw * 1.4} />
				<circle cx="292" cy="246" r="15" fill={LPI.pink} stroke={N} strokeWidth={sw * 0.5} />
				<circle cx="322" cy="276" r="15" fill={LPI.blue} stroke={N} strokeWidth={sw * 0.5} />
				<circle cx="262" cy="276" r="15" fill={LPI.paper} stroke={N} strokeWidth={sw * 0.5} />
			</g>
		</Svg>
	);
};

/* ─────────────── 14. Apprendre ─────────────── */
export const BookIcon: React.FC<IconProps & {light: number}> = ({size = 380, light}) => {
	const frame = useCurrentFrame();
	const sw = useContext(Sw);
	const flap = Math.sin(frame / 10) * 6;
	return (
		<Svg size={size}>
			{light > 0
				? Array.from({length: 7}, (_, i) => {
						const a = ((i - 3) * Math.PI) / 8;
						const r1 = 92;
						const r2 = 92 + 40 * light + 6 * Math.sin(frame / 4 + i);
						return <path key={i} d={`M${200 + r1 * Math.sin(a)} ${110 - r1 * Math.cos(a)} L${200 + r2 * Math.sin(a)} ${110 - r2 * Math.cos(a)}`} stroke={LPI.blue} strokeWidth={sw} />;
					})
				: null}
			<circle cx="200" cy="104" r="62" fill={light > 0.5 ? LPI.pink : LPI.paper} stroke={N} strokeWidth={sw} />
			<path d="M178 160 H222 M182 182 H218" stroke={N} strokeWidth={sw} />
			<path d="M184 110 Q200 80 216 110" fill="none" stroke={light > 0.5 ? LPI.paper : N} strokeWidth={sw * 0.7} />
			<path d="M40 250 Q120 222 200 256 Q280 222 360 250 V362 Q280 334 200 368 Q120 334 40 362 Z" fill={LPI.blue} stroke={N} strokeWidth={sw} />
			<path d={`M54 238 Q126 ${210 + flap} 200 244 V350 Q126 ${318 + flap} 54 340 Z`} fill={LPI.paper} stroke={N} strokeWidth={sw} />
			<path d={`M346 238 Q274 ${210 - flap} 200 244 V350 Q274 ${318 - flap} 346 340 Z`} fill={LPI.paper} stroke={N} strokeWidth={sw} />
			{[262, 288, 314].map((y) => (
				<g key={y}>
					<path d={`M84 ${y - 4} Q132 ${y - 22} 176 ${y}`} fill="none" stroke={alpha(N, 0.35)} strokeWidth={sw * 0.6} />
					<path d={`M224 ${y} Q268 ${y - 22} 316 ${y - 4}`} fill="none" stroke={alpha(N, 0.35)} strokeWidth={sw * 0.6} />
				</g>
			))}
		</Svg>
	);
};

/* ═══════════════════════════ gags (stickers) ═══════════════════════════ */

const G: React.FC<{w?: number; children: React.ReactNode}> = ({w = 220, children}) => (
	<svg width={w} height={w} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);

/** « le corps ne fonctionne pas au Wi-Fi » */
export const WifiOff: React.FC = () => (
	<G>
		<circle cx="100" cy="100" r="94" fill={LPI.sky} />
		{[70, 48, 26].map((r) => (
			<path key={r} d={`M${100 - r} ${118 - r * 0.2} A${r} ${r} 0 0 1 ${100 + r} ${118 - r * 0.2}`} fill="none" stroke={N} strokeWidth="13" />
		))}
		<circle cx="100" cy="126" r="9" fill={N} />
		<path d="M40 160 L160 40" stroke={LPI.pink} strokeWidth="18" />
	</G>
);

/** « noter tout ça dans les transmissions » : la feuille se remplit */
export const NotePad: React.FC<{write: number}> = ({write}) => (
	<G>
		<rect x="40" y="26" width="120" height="160" rx="14" fill={LPI.paper} stroke={N} strokeWidth="9" />
		<rect x="72" y="14" width="56" height="26" rx="8" fill={LPI.blue} stroke={N} strokeWidth="7" />
		{[64, 92, 120].map((y, i) => (
			<path
				key={y}
				d={`M60 ${y} H140`}
				stroke={alpha(N, 0.55)}
				strokeWidth="8"
				strokeDasharray="80"
				strokeDashoffset={80 * (1 - Math.min(1, Math.max(0, write * 3 - i)))}
			/>
		))}
		<path d="M64 152 L84 170 L140 132" fill="none" stroke={LPI.pink} strokeWidth="12" strokeDasharray="120" strokeDashoffset={120 * (1 - Math.min(1, Math.max(0, write * 3 - 2.4)))} />
	</G>
);

/** panneau « RETRAITE → » */
export const RetireSign: React.FC = () => (
	<div style={{position: 'relative', width: 280, height: 230}}>
		<div style={{position: 'absolute', left: 130, top: 80, width: 18, height: 150, borderRadius: 9, background: N}} />
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 10,
				height: 92,
				padding: '0 64px 0 28px',
				display: 'flex',
				alignItems: 'center',
				background: LPI.blue,
				clipPath: 'polygon(0 0, 86% 0, 100% 50%, 86% 100%, 0 100%)',
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: 44,
				letterSpacing: '0.05em',
				color: LPI.paper,
			}}
		>
			RETRAITE
		</div>
	</div>
);

/** horloge qui tourne vite jusqu'à 12 h */
export const Clock: React.FC<{spin: number}> = ({spin}) => {
	const a = 360 * 12 * ease(spin);
	return (
		<G>
			<circle cx="100" cy="100" r="88" fill={LPI.paper} stroke={N} strokeWidth="11" />
			{Array.from({length: 12}, (_, i) => {
				const r = (i * Math.PI) / 6;
				return <path key={i} d={`M${100 + 66 * Math.sin(r)} ${100 - 66 * Math.cos(r)} L${100 + 76 * Math.sin(r)} ${100 - 76 * Math.cos(r)}`} stroke={N} strokeWidth={i % 3 ? 5 : 9} />;
			})}
			<path d="M100 100 V52" stroke={N} strokeWidth="11" transform={`rotate(${a / 12} 100 100)`} />
			<path d="M100 100 V36" stroke={LPI.pink} strokeWidth="8" transform={`rotate(${a} 100 100)`} />
			<circle cx="100" cy="100" r="9" fill={N} />
		</G>
	);
};

/** pile de 3 couvertures */
export const Blankets: React.FC = () => (
	<G w={230}>
		{[
			[LPI.blue, 128],
			[LPI.pink, 92],
			[LPI.sky, 56],
		].map(([c, y], i) => (
			<g key={i} transform={`rotate(${[-3, 4, -2][i]} 100 ${y})`}>
				<rect x="22" y={Number(y)} width="156" height="40" rx="16" fill={String(c)} stroke={N} strokeWidth="8" />
				<path d={`M40 ${Number(y) + 14} H160`} stroke={alpha(LPI.paper, 0.7)} strokeWidth="5" strokeDasharray="10 10" />
			</g>
		))}
		<text x="164" y="44" textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize="48" fill={N}>
			×3
		</text>
	</G>
);

/** fenêtre grande ouverte, neige de janvier */
export const WindowSnow: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<G w={240}>
			<rect x="30" y="30" width="140" height="150" rx="10" fill={LPI.sky} stroke={N} strokeWidth="10" />
			<path d="M100 30 V180 M30 104 H170" stroke={N} strokeWidth="8" />
			{Array.from({length: 7}, (_, i) => {
				const x = 44 + ((i * 47) % 116);
				const y = 40 + ((frame * (1.6 + (i % 3) * 0.5) + i * 33) % 134);
				return <circle key={i} cx={x + Math.sin(frame / 8 + i) * 5} cy={y} r={5 + (i % 2) * 2} fill={LPI.paper} />;
			})}
			<g transform="translate(150 6) rotate(8)">
				<rect x="0" y="0" width="74" height="78" rx="10" fill={LPI.paper} stroke={N} strokeWidth="6" />
				<rect x="0" y="0" width="74" height="24" rx="8" fill={LPI.pink} stroke={N} strokeWidth="6" />
				<text x="37" y="62" textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize="28" fill={N}>
					JANV
				</text>
			</g>
		</G>
	);
};

/** pyjama rayé */
export const Pyjama: React.FC = () => (
	<div style={{width: 230, height: 230}}>
		<Mini size={230}>
			<ShirtIcon size={230} stripes />
		</Mini>
	</div>
);

/** plafond + lampe : « regarder le plafond toute la journée » */
export const Ceiling: React.FC = () => {
	const frame = useCurrentFrame();
	const sw = Math.sin(frame / 14) * 8;
	return (
		<G w={230}>
			<rect x="0" y="6" width="200" height="18" rx="6" fill={alpha(N, 0.85)} />
			<g transform={`rotate(${sw} 100 24)`}>
				<path d="M100 24 V86" stroke={N} strokeWidth="6" />
				<path d="M60 128 Q60 86 100 86 Q140 86 140 128 Z" fill={LPI.blue} stroke={N} strokeWidth="8" />
				<circle cx="100" cy="134" r="14" fill={LPI.pink} />
			</g>
			{[72, 128].map((x) => (
				<g key={x}>
					<circle cx={x} cy="176" r="18" fill={LPI.paper} stroke={N} strokeWidth="6" />
					<circle cx={x} cy="168" r="8" fill={N} />
				</g>
			))}
		</G>
	);
};

/** tambour : les baguettes frappent de plus en plus vite */
export const Drum: React.FC<{speed: number}> = ({speed}) => {
	const frame = useCurrentFrame();
	const hit = (k: number) => Math.abs(Math.sin(frame * (0.5 + speed * 1.2) + k * 1.6)) * 26;
	return (
		<G w={300}>
			<ellipse cx="100" cy="150" rx="78" ry="22" fill={LPI.blue} stroke={N} strokeWidth="8" />
			<rect x="22" y="100" width="156" height="50" fill={LPI.blue} />
			<path d="M22 100 V150 M178 100 V150" stroke={N} strokeWidth="8" />
			{[40, 70, 100, 130, 160].map((x, i) => (
				<path key={x} d={`M${x} ${104 + (i % 2) * 2} L${x + 15} 146`} stroke={LPI.paper} strokeWidth="5" />
			))}
			<ellipse cx="100" cy="100" rx="78" ry="22" fill={LPI.paper} stroke={N} strokeWidth="8" />
			<g transform={`rotate(${-hit(0)} 30 20)`}>
				<path d="M30 20 L92 92" stroke={N} strokeWidth="10" />
				<circle cx="92" cy="92" r="9" fill={LPI.pink} />
			</g>
			<g transform={`rotate(${hit(1)} 170 20)`}>
				<path d="M170 20 L108 92" stroke={N} strokeWidth="10" />
				<circle cx="108" cy="92" r="9" fill={LPI.pink} />
			</g>
		</G>
	);
};

/** médicament emballé comme un bonbon */
export const CandyPill: React.FC = () => (
	<G w={260}>
		<path d="M30 100 L-6 70 L-6 130 Z" fill={LPI.paper} stroke={N} strokeWidth="7" />
		<path d="M170 100 L206 70 L206 130 Z" fill={LPI.paper} stroke={N} strokeWidth="7" />
		<rect x="28" y="62" width="144" height="76" rx="38" fill={LPI.paper} stroke={N} strokeWidth="9" />
		<path d="M66 62 H100 V138 H66 A38 38 0 0 1 66 62 Z" fill={LPI.pink} />
		<path d="M100 62 H134 A38 38 0 0 1 134 138 H100 Z" fill={LPI.blue} />
		<rect x="28" y="62" width="144" height="76" rx="38" fill="none" stroke={N} strokeWidth="9" />
		<path d="M54 84 Q66 74 82 76" fill="none" stroke={LPI.paper} strokeWidth="7" />
	</G>
);

/** bulle « ça va pas trop… » */
export const SadBubble: React.FC = () => (
	<div
		style={{
			padding: '24px 34px',
			borderRadius: '40px 40px 40px 10px',
			background: LPI.paper,
			border: `6px solid ${N}`,
			fontFamily: FONT.title,
			fontWeight: 900,
			fontSize: 46,
			color: N,
			whiteSpace: 'nowrap',
		}}
	>
		« ça va pas trop… »
	</div>
);

/** cœur qui bat (loisirs, plaisir) */
export const HeartBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const b = 1 + 0.12 * Math.max(0, Math.sin(frame / 4));
	return (
		<G w={200}>
			<path
				transform={`translate(100 104) scale(${b}) translate(-100 -104)`}
				d="M100 170 C30 124 18 76 46 52 C70 32 94 46 100 66 C106 46 130 32 154 52 C182 76 170 124 100 170 Z"
				fill={LPI.pink}
				stroke={N}
				strokeWidth="9"
			/>
		</G>
	);
};

/** liste des 14 illustrations, dans l'ordre (pour les grilles) */
export const NEED_ICONS: React.FC<{size: number}>[] = [
	({size}) => <BreathIcon size={size} />,
	({size}) => <FoodIcon size={size} water={0.7} apple={1} />,
	({size}) => <ToiletIcon size={size} flush={0} />,
	({size}) => <SpineIcon size={size} straight={1} glow={0} />,
	({size}) => <MoonIcon size={size} />,
	({size}) => <ShirtIcon size={size} />,
	({size}) => <TempIcon size={size * 0.9} value={37} />,
	({size}) => <SoapIcon size={size} shine={0} />,
	({size}) => <ShieldIcon size={size} check={1} />,
	({size}) => <ChatIcon size={size} />,
	({size}) => <CompassIcon size={size} />,
	({size}) => <TargetIcon size={size} hit={1} />,
	({size}) => <GameIcon size={size} />,
	({size}) => <BookIcon size={size} light={1} />,
];

