// ─────────────────────────────────────────────────────────────────────────────
//  La Petite IDE — transitions « v4 » (vidéo pilote) : on ne répète jamais deux fois
//  la même transition d'affilée. Toutes durent TL.transition frames (14 = 0,47 s).
//
//  runWipe   : la mascotte traverse l'écran en courant et « tire » la scène suivante derrière elle
//  whip      : panoramique éclair (flou de bougé directionnel) vers le haut ou vers la gauche
//  zoomInto  : on plonge dans un élément (picto) puis la scène suivante s'ouvre depuis lui
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {GRID, LPI} from './theme';

const inOut = Easing.bezier(0.83, 0, 0.17, 1); // « easeInOutQuint » : le gros du mouvement au milieu
const out = Easing.bezier(0.22, 1, 0.36, 1);
const inCubic = Easing.bezier(0.32, 0, 0.67, 0);

/* ───────────────── 1. la mascotte tire la scène suivante ───────────────── */

/** Bord du rideau (x au niveau des pieds de la mascotte) — partagé avec la course de la mascotte. */
export const RUN_WIPE = {x0: -260, x1: 1400, slant: 150, band: 46};
export const runWipeEdge = (p: number) => RUN_WIPE.x0 + (RUN_WIPE.x1 - RUN_WIPE.x0) * p;

const RunWipeComponent: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress: p}) => {
	if (presentationDirection === 'exiting') {
		return <AbsoluteFill style={{transform: `translateX(${p * 90}px) scale(${1 - 0.03 * p})`, transformOrigin: '540px 960px'}}>{children}</AbsoluteFill>;
	}
	// le bord est incliné (le haut en avance) : sensation de vitesse
	const e = runWipeEdge(p) - 40;
	const {slant, band} = RUN_WIPE;
	const poly = (dx: number) => `${e + slant + dx},0 ${e - slant + dx},${GRID.h} -10,${GRID.h} -10,0`;
	const clip = `polygon(-10px 0px, ${e + slant - 2 * band}px 0px, ${e - slant - 2 * band}px ${GRID.h}px, -10px ${GRID.h}px)`;
	return (
		<AbsoluteFill>
			<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0}}>
				<polygon points={poly(0)} fill={LPI.blue} />
				<polygon points={poly(-band)} fill={LPI.sky} />
			</svg>
			<AbsoluteFill style={{clipPath: clip, transform: `translateX(${(1 - p) * -70}px)`}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};
export const runWipe = (): TransitionPresentation<Record<string, never>> => ({component: RunWipeComponent, props: {}});

/* ───────────────── 2. panoramique éclair ───────────────── */

type WhipProps = {dir: 'up' | 'left'};
const WhipComponent: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
	const {dir} = passedProps;
	const span = dir === 'up' ? GRID.h : GRID.w;
	const e = inOut(p);
	// vitesse (dérivée numérique) → flou de bougé dans l'axe du mouvement
	const v = (inOut(Math.min(1, p + 0.02)) - inOut(Math.max(0, p - 0.02))) / 0.04;
	const blur = Math.min(32, v * 11);
	const off = presentationDirection === 'exiting' ? -e * span : (1 - e) * span;
	const id = `whip-${dir}-${presentationDirection}`;
	const std = dir === 'up' ? `0 ${blur.toFixed(1)}` : `${blur.toFixed(1)} 0`;
	return (
		<AbsoluteFill>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} x="-10%" y="-10%" width="120%" height="120%">
					<feGaussianBlur stdDeviation={std} />
				</filter>
			</svg>
			<AbsoluteFill
				style={{
					backgroundColor: LPI.paper,
					transform: dir === 'up' ? `translateY(${off}px)` : `translateX(${off}px)`,
					filter: blur > 0.5 ? `url(#${id})` : undefined,
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
export const whip = (dir: WhipProps['dir'] = 'up'): TransitionPresentation<WhipProps> => ({component: WhipComponent, props: {dir}});

/* ───────────────── 3. plongée dans un élément ───────────────── */

type ZoomProps = {x: number; y: number; color?: string};
const ZoomIntoComponent: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
	const {x, y, color = LPI.sky} = passedProps;
	if (presentationDirection === 'exiting') {
		const z = 1 + 7 * inCubic(Math.min(1, p / 0.6));
		// fondu rapide : aucun morceau agrandi (texte, puce) ne reste visible dans les coins
		const fade = 1 - Math.min(1, Math.max(0, (p - 0.15) / 0.15));
		return <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${x}px ${y}px`, opacity: fade}}>{children}</AbsoluteFill>;
	}
	const R = Math.hypot(Math.max(x, GRID.w - x), Math.max(y, GRID.h - y)) + 40;
	const fill = out(Math.min(1, Math.max(0, (p - 0.25) / 0.35)));
	const open = out(Math.min(1, Math.max(0, (p - 0.45) / 0.55)));
	return (
		<AbsoluteFill>
			<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0}}>
				<circle cx={x} cy={y} r={fill * R} fill={color} />
			</svg>
			<AbsoluteFill
				style={{
					clipPath: `circle(${open * R}px at ${x}px ${y}px)`,
					transform: `scale(${1.25 - 0.25 * open})`,
					transformOrigin: `${x}px ${y}px`,
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
export const zoomInto = (props: ZoomProps): TransitionPresentation<ZoomProps> => ({component: ZoomIntoComponent, props});
