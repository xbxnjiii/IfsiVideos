import React, {useId} from 'react';
import {C} from '../theme';

const useSvgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const Check: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.green}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="46" fill={color} />
		<path
			d="M28 52 L44 67 L73 35"
			fill="none"
			stroke={C.dark}
			strokeWidth="11"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Cross: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.red}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="46" fill={color} />
		<path d="M32 32 L68 68 M68 32 L32 68" stroke={C.white} strokeWidth="11" strokeLinecap="round" />
	</svg>
);

export const ArrowUp: React.FC<{size?: number; color?: string}> = ({size = 60, color = C.red}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M50 12 L84 50 H62 V88 H38 V50 H16 Z" fill={color} stroke={color} strokeWidth="6" strokeLinejoin="round" />
	</svg>
);

export const ArrowDown: React.FC<{size?: number; color?: string}> = ({size = 60, color = C.blue}) => (
	<div style={{transform: 'rotate(180deg)', display: 'flex'}}>
		<ArrowUp size={size} color={color} />
	</div>
);

export const ArrowRight: React.FC<{size?: number; color?: string}> = ({size = 50, color = C.white}) => (
	<div style={{transform: 'rotate(90deg)', display: 'flex'}}>
		<ArrowUp size={size} color={color} />
	</div>
);

export const Warning: React.FC<{size?: number; color?: string}> = ({size = 60, color = C.yellow}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M50 8 L94 88 H6 Z" fill={color} stroke={color} strokeWidth="8" strokeLinejoin="round" />
		<rect x="45" y="36" width="10" height="28" rx="5" fill={C.dark} />
		<circle cx="50" cy="75" r="6" fill={C.dark} />
	</svg>
);

/** Goutte de sang. */
export const Drop: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.red}) => {
	const id = useSvgId('drop');
	return (
		<svg width={size} height={size * 1.25} viewBox="0 0 100 125">
			<defs>
				<radialGradient id={id} cx="35%" cy="60%" r="70%">
					<stop offset="0%" stopColor="#FF6A80" />
					<stop offset="55%" stopColor={color} />
					<stop offset="100%" stopColor={C.blood} />
				</radialGradient>
			</defs>
			<path d="M50 4 C50 4 92 56 92 80 A42 42 0 1 1 8 80 C8 56 50 4 50 4 Z" fill={`url(#${id})`} />
			<ellipse cx="34" cy="78" rx="9" ry="15" fill="rgba(255,255,255,0.45)" transform="rotate(20 34 78)" />
		</svg>
	);
};

/** Tube de prélèvement sous vide. */
export const Tube: React.FC<{
	cap: string;
	capBand?: string;
	fill?: number;
	width?: number;
	glow?: number;
}> = ({cap, capBand, fill = 0.7, width = 80, glow = 0}) => {
	const clip = useSvgId('tube');
	const grad = useSvgId('blood');
	const level = 290 - fill * 220;
	return (
		<svg
			width={width}
			height={width * 3.75}
			viewBox="0 0 80 300"
			style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${30 * glow}px ${cap})` : undefined}}
		>
			<defs>
				<clipPath id={clip}>
					<path d="M12 50 H68 V262 A28 28 0 0 1 12 262 Z" />
				</clipPath>
				<linearGradient id={grad} x1="0" x2="1">
					<stop offset="0%" stopColor="#7A0A1E" />
					<stop offset="50%" stopColor={C.blood} />
					<stop offset="100%" stopColor="#6A0818" />
				</linearGradient>
			</defs>
			<path
				d="M12 50 H68 V262 A28 28 0 0 1 12 262 Z"
				fill="rgba(255,255,255,0.10)"
				stroke="rgba(255,255,255,0.55)"
				strokeWidth="3"
			/>
			<g clipPath={`url(#${clip})`}>
				<rect x="0" y={level} width="80" height="300" fill={`url(#${grad})`} />
				<rect x="12" y="120" width="56" height="70" fill="rgba(255,255,255,0.88)" />
				<rect x="18" y="132" width="44" height="6" rx="3" fill="rgba(10,15,31,0.35)" />
				<rect x="18" y="146" width="30" height="6" rx="3" fill="rgba(10,15,31,0.35)" />
				<rect x="18" y="168" width="44" height="12" fill="rgba(10,15,31,0.55)" />
			</g>
			<rect x="20" y="58" width="6" height="200" rx="3" fill="rgba(255,255,255,0.35)" />
			<rect x="4" y="0" width="72" height="58" rx="12" fill={cap} />
			{capBand ? <rect x="4" y="38" width="72" height="20" rx="4" fill={capBand} /> : null}
			<rect x="10" y="6" width="60" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
		</svg>
	);
};

/** Flacon d'hémoculture. */
export const Bottle: React.FC<{cap?: string; width?: number}> = ({cap = C.orange, width = 96}) => (
	<svg width={width} height={width * 3.1} viewBox="0 0 96 300" style={{overflow: 'visible'}}>
		<rect x="28" y="0" width="40" height="34" rx="8" fill={cap} />
		<rect
			x="32"
			y="30"
			width="32"
			height="30"
			fill="rgba(255,255,255,0.2)"
			stroke="rgba(255,255,255,0.55)"
			strokeWidth="3"
		/>
		<path
			d="M32 60 C10 80 6 100 6 120 V270 A24 24 0 0 0 30 294 H66 A24 24 0 0 0 90 270 V120 C90 100 86 80 64 60 Z"
			fill="rgba(255,255,255,0.12)"
			stroke="rgba(255,255,255,0.55)"
			strokeWidth="3"
		/>
		<path d="M8 210 H88 V270 A22 22 0 0 1 66 292 H30 A22 22 0 0 1 8 270 Z" fill="#E9C46A" opacity="0.8" />
		<rect x="14" y="130" width="68" height="60" rx="6" fill="rgba(255,255,255,0.88)" />
		<rect x="22" y="142" width="50" height="7" rx="3" fill="rgba(10,15,31,0.35)" />
		<rect x="22" y="158" width="34" height="7" rx="3" fill="rgba(10,15,31,0.35)" />
	</svg>
);

/** Aiguille avec embout coloré, horizontale, pointe à droite. */
export const Needle: React.FC<{length?: number; hub?: string}> = ({length = 420, hub = C.green}) => (
	<svg width={length} height={70} viewBox={`0 0 ${length} 70`} style={{overflow: 'visible'}}>
		<rect x="0" y="14" width="120" height="42" rx="10" fill={hub} />
		<rect x="12" y="20" width="96" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
		<rect x="116" y="24" width="30" height="22" rx="4" fill="#C9D2E8" />
		<path d={`M146 31 H${length - 28} L${length} 35 L${length - 28} 39 H146 Z`} fill="#E3E8F5" />
		<path d={`M146 31 H${length - 28} L${length - 10} 33`} stroke="white" strokeWidth="1.5" fill="none" />
	</svg>
);

/** Capuchon d'aiguille. */
export const NeedleCap: React.FC<{width?: number; color?: string}> = ({width = 320, color = C.green}) => (
	<svg width={width} height={60} viewBox={`0 0 ${width} 60`}>
		<path d={`M0 10 H${width - 20} A20 20 0 0 1 ${width - 20} 50 H0 Z`} fill={color} opacity="0.55" />
		<rect x="0" y="10" width="26" height="40" fill={color} />
	</svg>
);

/** Collecteur à aiguilles (DASRI). */
export const Collector: React.FC<{width?: number}> = ({width = 300}) => (
	<svg width={width} height={width * 1.1} viewBox="0 0 300 330">
		<path d="M30 80 H270 L250 320 H50 Z" fill={C.yellow} />
		<path d="M30 80 H270 L265 140 H35 Z" fill="#E8B500" />
		<rect x="10" y="40" width="280" height="50" rx="14" fill="#F2C200" />
		<rect x="90" y="54" width="120" height="20" rx="10" fill={C.dark} />
		<g transform="translate(150 225)" fill="none" stroke={C.dark} strokeWidth="9">
			<circle r="16" />
			<circle cy="-34" r="26" />
			<circle cx="30" cy="17" r="26" />
			<circle cx="-30" cy="17" r="26" />
		</g>
	</svg>
);

/** Bulle de dialogue. */
export const Bubble: React.FC<{
	children: React.ReactNode;
	color: string;
	side?: 'left' | 'right';
	width?: number;
}> = ({children, color, side = 'left', width = 760}) => (
	<div style={{position: 'relative', width}}>
		<div
			style={{
				background: `linear-gradient(160deg, ${color}38, ${color}14)`,
				border: `3px solid ${color}`,
				borderRadius: 44,
				padding: '34px 42px',
				boxShadow: `0 20px 60px ${color}30`,
			}}
		>
			{children}
		</div>
		<svg
			width="60"
			height="44"
			viewBox="0 0 60 44"
			style={{
				position: 'absolute',
				bottom: -38,
				[side === 'left' ? 'left' : 'right']: 70,
				transform: side === 'right' ? 'scaleX(-1)' : undefined,
			}}
		>
			<path d="M3 0 L3 40 L50 0" fill={color} />
		</svg>
	</div>
);

/** K+ / Ca2+ etc. avec exposant propre. */
export const Ion: React.FC<{base: string; sup: string; color?: string}> = ({base, sup, color}) => (
	<span style={{color, whiteSpace: 'nowrap'}}>
		{base}
		<sup style={{fontSize: '0.6em', verticalAlign: '0.6em', lineHeight: 0}}>{sup}</sup>
	</span>
);
