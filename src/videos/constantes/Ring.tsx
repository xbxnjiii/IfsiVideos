import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../../components/motion';
import {Badge} from '../../components/med/MedIcons';
import {TITLE} from '../../theme';
import {Abbr, CONST} from './shared';

export const RING = {x: 540, y: 930, r: 360, badge: 140};

export const ringPos = (k: number) => {
	const a = ((-90 + 72 * k) * Math.PI) / 180;
	return {x: RING.x + RING.r * Math.cos(a), y: RING.y + RING.r * Math.sin(a)};
};

/**
 * Les 5 constantes en cercle autour du personnage.
 * - `appearAt` : frame d'apparition du 1er badge (les suivants s'enchaînent)
 * - `highlight[k]` : frame où la constante k est nommée (zoom + halo)
 * - `listAt` : frame où les badges se rangent en liste (conclusion)
 */
export const Ring: React.FC<{
	appearAt: number;
	stagger?: number;
	highlight?: number[];
	listAt?: number;
	listPos?: (k: number) => {x: number; y: number};
}> = ({appearAt, stagger = 6, highlight, listAt, listPos}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const circle = interpolate(frame, [appearAt - 4, appearAt + 26], [0, 1], clamp);
	const toList = listAt === undefined ? 0 : spring({frame: frame - listAt, fps, config: {damping: 18, stiffness: 110}});
	const circumference = 2 * Math.PI * RING.r;
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - toList}}>
				<circle
					cx={RING.x}
					cy={RING.y}
					r={RING.r}
					fill="none"
					stroke="rgba(255,255,255,0.16)"
					strokeWidth={3}
					strokeDasharray={`${circumference * circle} ${circumference}`}
					transform={`rotate(-90 ${RING.x} ${RING.y})`}
				/>
			</svg>
			{CONST.map((c, k) => {
				const s = spring({frame: frame - appearAt - k * stagger, fps, config: {damping: 13, stiffness: 170}});
				const h = highlight ? interpolate(frame, [highlight[k], highlight[k] + 8], [0, 1], clamp) : 1;
				const named = highlight ? frame >= highlight[k] : true;
				const isCurrent = highlight !== undefined && named && (k === 4 || frame < highlight[k + 1]) && toList < 0.05;
				const pulse = isCurrent ? 1 + 0.12 * Math.max(0, 1 - (frame - highlight![k]) / 14) : 1;
				const ring = ringPos(k);
				const list = listPos ? listPos(k) : ring;
				const x = interpolate(toList, [0, 1], [ring.x, list.x]);
				const y = interpolate(toList, [0, 1], [ring.y, list.y]);
				const scale = s * pulse * interpolate(toList, [0, 1], [isCurrent ? 1.12 : 1, 0.82]);
				return (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: x - RING.badge / 2,
							top: y - RING.badge / 2,
							width: RING.badge,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${scale})`,
							opacity: Math.min(1, s * 2) * (highlight ? interpolate(h, [0, 1], [0.45, 1]) : 1),
						}}
					>
						<Badge color={c.color} size={RING.badge} glow={isCurrent ? 1 : named ? 0.3 : 0}>
							<c.Icon size={78} color={c.color} />
						</Badge>
						<div
							style={{
								marginTop: 10,
								fontFamily: TITLE,
								fontWeight: 900,
								fontSize: 36,
								color: c.color,
								opacity: 1 - toList,
								whiteSpace: 'nowrap',
							}}
						>
							<Abbr i={k} />
						</div>
					</div>
				);
			})}
		</>
	);
};
