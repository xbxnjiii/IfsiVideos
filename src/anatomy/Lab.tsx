// Banc d'essai visuel des pièces anatomiques (non publié).
// npx remotion still Anatomie-Lab out.png --props='{"view":"body","look":{"xray":1}}'
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LPI} from '../brand/theme';
import {Body, BodyLook, DEFAULT_LOOK} from './Body';
import {Heart, HEART_BOX} from './Heart';
import {Lungs} from './Lungs';

export type LabProps = {
	view: 'heart' | 'lungs' | 'body';
	look?: Partial<BodyLook>;
	/** caméra en unités corps : centre + largeur visible */
	cam?: {cx: number; cy: number; w: number};
};

const BEATS = Array.from({length: 20}, (_, i) => 4 + i * 25);

export const AnatomyLab: React.FC<LabProps> = ({view, look, cam = {cx: 500, cy: 900, w: 1060}}) => {
	const frame = useCurrentFrame();
	const c = Math.max(0, Math.sin((frame / 25) * Math.PI * 2));
	const h = (cam.w * 1920) / 1080;
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			{view === 'body' ? (
				<svg width={1080} height={1920} viewBox={`${cam.cx - cam.w / 2} ${cam.cy - h / 2} ${cam.w} ${h}`}>
					<Body id="lab" frame={frame} beats={BEATS} look={{...DEFAULT_LOOK, ...look}} />
				</svg>
			) : (
				<svg width={1080} height={1920} viewBox="0 0 1080 1920">
					{view === 'heart' ? (
						<g transform={`translate(${540 - HEART_BOX.cx * 2} ${900 - HEART_BOX.cy * 2}) scale(2)`}>
							<Heart id="lab" contract={c} atria={0} />
						</g>
					) : null}
					{view === 'lungs' ? (
						<g transform="translate(60 360) scale(2)">
							<Lungs id="lab" breath={c} />
						</g>
					) : null}
				</svg>
			)}
		</AbsoluteFill>
	);
};
