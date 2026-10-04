import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../../theme';

const PARTICLES = Array.from({length: 26}, (_, i) => ({
	x: random(`px${i}`) * 1080,
	y: random(`py${i}`) * 1920,
	r: 2 + random(`pr${i}`) * 4,
	speed: 0.3 + random(`ps${i}`) * 0.7,
	phase: random(`ph${i}`) * Math.PI * 2,
	o: 0.08 + random(`po${i}`) * 0.18,
}));

/**
 * Fond « premium » de la série médicale : dégradé sombre, halo doux de la couleur du thème,
 * et quelques particules très discrètes qui montent lentement (profondeur légère).
 */
export const SoftBackground: React.FC<{accent?: string; frameOffset?: number}> = ({
	accent = C.cyan,
	frameOffset = 0,
}) => {
	const frame = useCurrentFrame() + frameOffset;
	const t = frame / 30;
	const hx = 50 + Math.sin(t * 0.35) * 12;
	const hy = 38 + Math.cos(t * 0.3) * 6;
	return (
		<AbsoluteFill style={{backgroundColor: '#060A1A'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 45% at ${hx}% ${hy}%, ${accent}38 0%, transparent 70%), radial-gradient(ellipse 80% 50% at 50% 110%, #1B2A6B55 0%, transparent 70%), linear-gradient(180deg, #070C20 0%, #0B1230 100%)`,
				}}
			/>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{PARTICLES.map((p, i) => {
					const y = (((p.y - frame * p.speed * 1.4) % 1920) + 1920) % 1920;
					const x = p.x + Math.sin(t * 0.6 + p.phase) * 14;
					return <circle key={i} cx={x} cy={y} r={p.r} fill={i % 3 === 0 ? accent : '#FFFFFF'} opacity={p.o} />;
				})}
			</svg>
			<AbsoluteFill
				style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}}
			/>
		</AbsoluteFill>
	);
};
