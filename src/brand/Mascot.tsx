import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, LPI} from './theme';
import {clamp} from './ui';

/**
 * Mascotte officielle : uniquement les illustrations de la planche de référence,
 * détourées (jamais redessinées). Largeur / hauteur = taille d'origine des fichiers.
 */
export const MASCOT = {
	// expressions (bustes)
	joyeuse: {file: 'joyeuse', w: 610, h: 747},
	reflechit: {file: 'reflechit', w: 584, h: 767},
	surprise: {file: 'surprise', w: 610, h: 759},
	stressee: {file: 'stressee', w: 744, h: 804},
	confiante: {file: 'confiante', w: 627, h: 813},
	fatiguee: {file: 'fatiguee', w: 674, h: 773},
	determinee: {file: 'determinee', w: 730, h: 795},
	// poses (en pied)
	explique: {file: 'explique', w: 512, h: 810},
	notes: {file: 'notes', w: 405, h: 830},
	revise: {file: 'revise', w: 707, h: 762},
	soins: {file: 'soins', w: 508, h: 859},
	conseil: {file: 'conseil', w: 580, h: 862},
	celebre: {file: 'celebre', w: 697, h: 900},
	face: {file: 'face', w: 387, h: 900},
} as const;

export type MascotName = keyof typeof MASCOT;

/** Liseré blanc cassé « sticker » (comme le logo) + ombre douce. */
const STICKER = [
	`drop-shadow(4px 0 0 ${LPI.paper})`,
	`drop-shadow(-4px 0 0 ${LPI.paper})`,
	`drop-shadow(0 4px 0 ${LPI.paper})`,
	`drop-shadow(0 -4px 0 ${LPI.paper})`,
	`drop-shadow(0 16px 22px ${alpha(LPI.navy, 0.16)})`,
].join(' ');

/**
 * Mascotte ancrée par le bas (x = centre, y = bas de l'image).
 * `poses` : [[frame, nom], ...] — change d'expression/pose au fil de la narration (fondu court).
 */
export const Mascot: React.FC<{
	poses: [number, MascotName][];
	x: number;
	y: number;
	height: number;
	from?: 'left' | 'right' | 'bottom';
	idle?: boolean;
}> = ({poses, x, y, height, from = 'right', idle = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - poses[0][0], fps, config: {damping: 14, stiffness: 110, mass: 0.9}});
	if (frame < poses[0][0] - 1) return null;
	const d = (1 - enter) * 140;
	const offset =
		from === 'left' ? `translateX(${-d}px)` : from === 'right' ? `translateX(${d}px)` : `translateY(${d}px)`;
	const float = idle ? Math.sin(frame / 26) * 5 : 0;
	const tilt = idle ? Math.sin(frame / 41) * 0.8 : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity: Math.min(1, enter * 1.6),
				transform: `${offset} translateY(${float}px) rotate(${tilt}deg)`,
				transformOrigin: 'bottom center',
			}}
		>
			{poses.map(([at, name], i) => {
				const next = poses[i + 1]?.[0] ?? Infinity;
				const fadeIn = i === 0 ? 1 : interpolate(frame, [at, at + 6], [0, 1], clamp);
				const fadeOut = Number.isFinite(next) ? interpolate(frame, [next, next + 6], [1, 0], clamp) : 1;
				const o = fadeIn * fadeOut;
				if (o <= 0) return null;
				const m = MASCOT[name];
				const w = (m.w / m.h) * height;
				const pop = i === 0 ? 1 : 0.96 + 0.04 * spring({frame: frame - at, fps, config: {damping: 12, stiffness: 160}});
				return (
					<Img
						key={`${name}-${i}`}
						src={staticFile(`brand/mascotte/${m.file}.webp`)}
						style={{
							position: 'absolute',
							left: -w / 2,
							top: -height,
							width: w,
							height,
							opacity: o,
							transform: `scale(${pop})`,
							transformOrigin: 'bottom center',
							filter: STICKER,
						}}
					/>
				);
			})}
		</div>
	);
};
