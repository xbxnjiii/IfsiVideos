// Banc d'essai visuel des pièces anatomiques (non publié).
// npx remotion still Anatomie-Lab out.png --props='{"view":"body","look":{"xray":1}}'
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LPI} from '../brand/theme';
import {Body, BodyLook, DEFAULT_LOOK} from './Body';
import {Heart, HEART_BOX} from './Heart';
import {Lungs} from './Lungs';
import {NeonBody} from './NeonBody';
import {FONT} from '../brand/theme';
import {alpha} from '../brand/theme';
import {rng} from './geometry';

export type LabProps = {
	view: 'heart' | 'lungs' | 'body' | 'neon';
	/** texte d'exemple sur la planche de style */
	caption?: [string, string];
	look?: Partial<BodyLook>;
	/** caméra en unités corps : centre + largeur visible */
	cam?: {cx: number; cy: number; w: number};
};

const BEATS = Array.from({length: 20}, (_, i) => 4 + i * 25);

const BOKEH = (() => {
	const r = rng(5);
	return Array.from({length: 40}, () => [r() * 1080, r() * 1920, 2 + r() * 7, r()]);
})();

export const AnatomyLab: React.FC<LabProps> = ({view, look, cam = {cx: 500, cy: 900, w: 1060}, caption}) => {
	const frame = useCurrentFrame();
	const c = Math.max(0, Math.sin((frame / 25) * Math.PI * 2));
	const h = (cam.w * 1920) / 1080;
	return (
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			{view === 'neon' ? (
				<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% 48%, #3f5683 0%, ${LPI.navy} 70%)`}}>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{BOKEH.map(([x, y, r, k], i) => (
							<circle key={i} cx={x} cy={y - frame * (0.3 + k)} r={r} fill={alpha(k > 0.5 ? LPI.sky : LPI.pink, 0.08 + 0.12 * k)} />
						))}
					</svg>
					<svg width={1080} height={1920} viewBox={`${cam.cx - cam.w / 2} ${cam.cy - h / 2} ${cam.w} ${h}`} style={{position: 'absolute', inset: 0}}>
						<NeonBody id="neo" frame={frame} beats={BEATS} breath={c} px={1080 / cam.w} />
					</svg>
					{caption ? (
						<div style={{position: 'absolute', left: 72, top: 200, right: 72}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.sky, lineHeight: 1}}>{caption[0]}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 112, color: LPI.paper, lineHeight: 1.02, textShadow: `0 0 40px ${alpha(LPI.pink, 0.6)}`}}>{caption[1]}</div>
						</div>
					) : null}
				</AbsoluteFill>
			) : view === 'body' ? (
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
