import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Fond sombre animé : halos colorés qui dérivent + grille de points qui défile. */
export const Background: React.FC<{accent?: string; accent2?: string}> = ({accent = C.red, accent2 = C.cyan}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const x1 = 25 + Math.sin(t * 0.7) * 18;
	const y1 = 22 + Math.cos(t * 0.55) * 10;
	const x2 = 75 + Math.cos(t * 0.5) * 18;
	const y2 = 78 + Math.sin(t * 0.8) * 10;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${x1}% ${y1}%, ${accent}66 0%, transparent 42%), radial-gradient(circle at ${x2}% ${y2}%, ${accent2}4D 0%, transparent 48%), linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 2px, transparent 2px)',
					backgroundSize: '54px 54px',
					backgroundPosition: `0px ${frame * 0.8}px`,
					WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)',
					maskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/** Grain de pellicule animé, posé par-dessus toute la vidéo. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				backgroundImage: NOISE,
				backgroundPosition: `${(frame * 37) % 256}px ${(frame * 91) % 256}px`,
				opacity,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
			}}
		/>
	);
};
