import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BODY, C, TITLE} from '../theme';
import {clamp, usePop} from './motion';

/** En-tête de tip : gros numéro + catégorie. */
export const TipHeader: React.FC<{n: number; label: string; accent: string; top?: number}> = ({
	n,
	label,
	accent,
	top = 270,
}) => {
	const frame = useCurrentFrame();
	const a = usePop(0, 13, 200);
	const b = usePop(5, 13, 200);
	const line = interpolate(frame, [4, 16], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 28,
			}}
		>
			<div
				style={{
					fontFamily: TITLE,
					fontWeight: 900,
					fontSize: 132,
					lineHeight: 1,
					color: 'transparent',
					WebkitTextStroke: `4px ${accent}`,
					transform: `translateX(${(1 - a) * -120}px) rotate(${(1 - a) * -20}deg)`,
					opacity: a,
				}}
			>
				{String(n).padStart(2, '0')}
			</div>
			<div style={{width: 6, height: 110 * line, background: accent, borderRadius: 3}} />
			<div
				style={{
					transform: `translateX(${(1 - b) * 120}px)`,
					opacity: b,
					display: 'flex',
					flexDirection: 'column',
					gap: 4,
				}}
			>
				<div
					style={{
						fontFamily: BODY,
						fontWeight: 800,
						fontSize: 30,
						letterSpacing: '0.35em',
						color: C.muted,
					}}
				>
					TIP
				</div>
				<div
					style={{
						fontFamily: TITLE,
						fontWeight: 800,
						fontSize: 46,
						color: accent,
						letterSpacing: '0.02em',
					}}
				>
					{label}
				</div>
			</div>
		</div>
	);
};
