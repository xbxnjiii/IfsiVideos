import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type Props = Record<string, never>;

/**
 * Transition « poussée de caméra » douce : la scène sortante grossit légèrement,
 * la scène entrante arrive en fondu en finissant le mouvement. Rapide mais pas agressive.
 */
const SoftZoomComponent: React.FC<TransitionPresentationComponentProps<Props>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
}) => {
	const entering = presentationDirection === 'entering';
	const scale = entering ? interpolate(p, [0, 1], [0.92, 1]) : interpolate(p, [0, 1], [1, 1.14]);
	const opacity = entering ? interpolate(p, [0, 0.7], [0, 1], {extrapolateRight: 'clamp'}) : 1;
	return <AbsoluteFill style={{transform: `scale(${scale})`, opacity}}>{children}</AbsoluteFill>;
};

export const softZoom = (): TransitionPresentation<Props> => ({component: SoftZoomComponent, props: {} as Props});
