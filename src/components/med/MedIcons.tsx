import React from 'react';
import {interpolate, interpolateColors} from 'remotion';
import {BODY, C, TITLE} from '../../theme';

type IconProps = {size?: number; color?: string; stroke?: number};

/* ---------- icônes « ligne », style minimaliste ---------- */

export const ThermoIcon: React.FC<IconProps> = ({size = 80, color = C.orange, stroke = 7}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinecap="round"
	>
		<path d="M42 62 V20 A8 8 0 0 1 58 20 V62 A16 16 0 1 1 42 62 Z" />
		<circle cx="50" cy="75" r="7" fill={color} stroke="none" />
		<path d="M50 70 V40" />
		<path d="M66 30 H74 M66 42 H72 M66 54 H74" strokeWidth={stroke * 0.7} />
	</svg>
);

export const HeartIcon: React.FC<IconProps> = ({size = 80, color = C.red, stroke = 7}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinejoin="round"
		strokeLinecap="round"
	>
		<path d="M50 84 C14 60 10 36 24 24 C36 14 48 22 50 32 C52 22 64 14 76 24 C90 36 86 60 50 84 Z" />
		<path d="M26 50 H40 L45 40 L53 60 L58 50 H74" strokeWidth={stroke * 0.75} />
	</svg>
);

export const LungsIcon: React.FC<IconProps> = ({size = 80, color = C.cyan, stroke = 7}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinejoin="round"
		strokeLinecap="round"
	>
		<path d="M50 14 V44 M50 44 C44 46 42 50 42 56 M50 44 C56 46 58 50 58 56" />
		<path d="M38 30 C24 30 14 50 14 70 C14 82 22 86 32 84 C40 82 42 76 42 66 V40 C42 34 41 30 38 30 Z" />
		<path d="M62 30 C76 30 86 50 86 70 C86 82 78 86 68 84 C60 82 58 76 58 66 V40 C58 34 59 30 62 30 Z" />
	</svg>
);

export const GaugeIcon: React.FC<IconProps & {needle?: number}> = ({
	size = 80,
	color = C.violet,
	stroke = 7,
	needle = 0.65,
}) => {
	const a = Math.PI * (1 - needle);
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 100 100"
			fill="none"
			stroke={color}
			strokeWidth={stroke}
			strokeLinecap="round"
		>
			<path d="M14 66 A36 36 0 0 1 86 66" />
			<path d="M22 48 L28 52 M50 30 V37 M78 48 L72 52" strokeWidth={stroke * 0.7} />
			<path d={`M50 66 L${50 + Math.cos(a) * 28} ${66 - Math.sin(a) * 28}`} />
			<circle cx="50" cy="66" r="6" fill={color} stroke="none" />
			<path d="M30 82 H70" strokeWidth={stroke * 0.7} />
		</svg>
	);
};

export const O2Icon: React.FC<IconProps> = ({size = 80, color = C.blue, stroke = 7}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={stroke}>
		<circle cx="36" cy="50" r="20" />
		<circle cx="66" cy="50" r="20" />
		<text x="78" y="88" fill={color} stroke="none" fontFamily={TITLE} fontWeight={900} fontSize="30">
			2
		</text>
	</svg>
);

export const FlameIcon: React.FC<{size?: number}> = ({size = 90}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path
			d="M50 6 C58 26 80 36 80 62 A30 30 0 0 1 20 62 C20 46 30 38 36 28 C38 40 44 44 48 44 C46 30 46 18 50 6 Z"
			fill="#FF6B35"
		/>
		<path d="M50 50 C56 60 66 64 66 74 A16 16 0 0 1 34 74 C34 64 44 60 50 50 Z" fill="#FFD23F" />
	</svg>
);

export const SnowIcon: React.FC<{size?: number; color?: string}> = ({size = 90, color = '#8FD3FF'}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth="7"
		strokeLinecap="round"
	>
		{[0, 60, 120].map((r) => (
			<g key={r} transform={`rotate(${r} 50 50)`}>
				<path d="M50 10 V90" />
				<path d="M38 20 L50 30 L62 20 M38 80 L50 70 L62 80" />
			</g>
		))}
	</svg>
);

/** Silhouette humaine simple (pour « le corps »). */
export const BodyIcon: React.FC<IconProps> = ({size = 80, color = C.white, stroke = 7}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="50" cy="20" r="10" />
		<path d="M30 40 H70 M50 34 V64 M50 64 L36 90 M50 64 L64 90 M30 40 L22 62 M70 40 L78 62" />
	</svg>
);

/* ---------- typographie chimique ---------- */

export const Sub: React.FC<{children: React.ReactNode}> = ({children}) => (
	<sub style={{fontSize: '0.58em', verticalAlign: '-0.18em', lineHeight: 0}}>{children}</sub>
);

export const SpO2: React.FC = () => (
	<span style={{whiteSpace: 'nowrap'}}>
		SpO<Sub>2</Sub>
	</span>
);

export const O2: React.FC = () => (
	<span style={{whiteSpace: 'nowrap'}}>
		O<Sub>2</Sub>
	</span>
);

/* ---------- badge rond avec halo ---------- */

export const Badge: React.FC<{
	color: string;
	size?: number;
	glow?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({color, size = 150, glow = 0, children, style}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: 999,
			background: `radial-gradient(circle at 35% 30%, ${color}33, rgba(14,22,48,0.92) 70%)`,
			border: `3px solid ${color}${glow > 0.5 ? 'FF' : 'AA'}`,
			boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 ${20 + 50 * glow}px ${color}${glow > 0 ? '88' : '33'}`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...style,
		}}
	>
		{children}
	</div>
);

/* ---------- fenêtre « gros plan » ---------- */

export const Viewport: React.FC<{
	width?: number;
	height: number;
	color?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({width = 880, height, color = C.cyan, children, style}) => (
	<div
		style={{
			position: 'relative',
			width,
			height,
			borderRadius: 48,
			overflow: 'hidden',
			background: `radial-gradient(ellipse at 50% 30%, ${color}22, rgba(9,14,32,0.9) 70%)`,
			border: `2px solid ${color}55`,
			boxShadow: `0 40px 90px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.35)`,
			...style,
		}}
	>
		{children}
	</div>
);

/* ---------- thermomètre à jauge ---------- */

const T_MIN = 34;
const T_MAX = 41;

/** interpolateColors() renvoie du rgba() : on repasse en hex pour pouvoir ajouter une opacité (« #RRGGBB55 »). */
const toHex = (rgba: string) => {
	const [r, g, b] = rgba.match(/[\d.]+/g)!.map(Number);
	return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
};

export const thermoColor = (t: number) =>
	toHex(interpolateColors(t, [35, 36.7, 39.2], ['#5BB8FF', C.orange, '#FF3B3B']));

export const Thermometer: React.FC<{value: number; height?: number}> = ({value, height = 560}) => {
	const top = 30;
	const bottom = 470;
	const y = interpolate(value, [T_MIN, T_MAX], [bottom, top]);
	const color = thermoColor(value);
	const scale = height / 600;
	return (
		<svg width={180 * scale} height={height} viewBox="0 0 180 600" style={{overflow: 'visible'}}>
			<rect
				x="58"
				y="10"
				width="64"
				height="500"
				rx="32"
				fill="rgba(255,255,255,0.08)"
				stroke="rgba(255,255,255,0.45)"
				strokeWidth="4"
			/>
			<circle cx="90" cy="540" r="54" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.45)" strokeWidth="4" />
			<rect x="74" y={y} width="32" height={520 - y} rx="16" fill={color} />
			<circle cx="90" cy="540" r="40" fill={color} style={{filter: `drop-shadow(0 0 18px ${color})`}} />
			<rect x="80" y="40" width="7" height="440" rx="3.5" fill="rgba(255,255,255,0.25)" />
			{Array.from({length: T_MAX - T_MIN + 1}, (_, i) => {
				const t = T_MIN + i;
				const ty = interpolate(t, [T_MIN, T_MAX], [bottom, top]);
				return (
					<g key={t}>
						<path
							d={`M128 ${ty} H${t % 2 === 1 ? 150 : 142}`}
							stroke="rgba(255,255,255,0.5)"
							strokeWidth="4"
							strokeLinecap="round"
						/>
						{t % 2 === 1 ? (
							<text x="156" y={ty + 9} fill="rgba(255,255,255,0.55)" fontFamily={BODY} fontWeight={700} fontSize="24">
								{t}
							</text>
						) : null}
					</g>
				);
			})}
		</svg>
	);
};

/** 36.7 -> « 36,7 » (virgule décimale française). */
export const fr1 = (v: number) => v.toFixed(1).replace('.', ',');
